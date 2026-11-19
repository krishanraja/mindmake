import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { staticPages } from "../lib/pages.mjs";
import { kits, visibleKits, type Kit } from "../../src/content/kits.ts";
import { BUYER_PROMISE, checkout, MEMBER_COUPON, companyFrom, COMPANY_FIELDS, downloadToken, operatorNote, renewDownload, verifyDownloadToken, webhook, type CheckoutDeps, type KitEvent, type Purchase, type WebhookDeps } from "../../supabase/functions/_shared/kits/core.ts";
import { kitsPreview } from "../lib/kits-build.mjs";

const ready: Kit = { ...kits[0], status: "ready" };
const sessionId = "cs_test_synthetic";
const purchaseId = "00000000-0000-4000-8000-000000000001";
const checkoutInput = { slug: ready.slug, requestId: purchaseId };
function checkoutFixture() {
  const calls: { params: Record<string, unknown>; options: { idempotencyKey: string } }[] = [];
  const deps: CheckoutDeps = {
    key: "sk_test_synthetic", origin: "https://preview.example", catalogue: [ready], prices: { [ready.slug]: "price_synthetic" },
    retrievePrice: async id => ({ id, active: true, livemode: false, currency: "usd", unit_amount: 5900, type: "one_time" }),
    createSession: async (params, options) => { calls.push({ params, options }); return { url: "https://checkout.stripe.com/c/pay/test_synthetic", livemode: false }; },
  };
  return { deps, calls };
}
function paidEvent(): KitEvent {
  return { id: "evt_synthetic_paid", type: "checkout.session.completed", livemode: false, created: 1,
    data: { object: { id: sessionId, mode: "payment", payment_status: "paid", currency: "usd", amount_total: 5900, livemode: false,
      metadata: { kit_slug: ready.slug }, customer_details: { email: "buyer@example.invalid" }, payment_intent: "pi_synthetic" } } };
}
function refundedEvent(): KitEvent {
  return { id: "evt_synthetic_refund", type: "charge.refunded", livemode: false, created: 2,
    data: { object: { payment_intent: "pi_synthetic", livemode: false, metadata: { kit_slug: ready.slug }, amount_refunded: 5900 } } };
}
function webhookFixture() {
  const state = { event: paidEvent(), events: new Set<string>(), purchase: null as Purchase | null, refunded: false, sent: false, sends: 0, sendOk: true, signed: [] as number[], verified: [] as string[], records: 0 };
  const deps: WebhookDeps = {
    live: false, catalogue: [ready], files: { [ready.slug]: "fact-check-board-update/v1.mcpb" }, origin: "https://preview.example",
    verify: async (raw, signature) => { state.verified.push(`${signature}:${raw}`); if (signature !== "valid-synthetic-signature") throw new Error("Invalid"); return state.event; },
    record: async (event, input, refundIntent) => {
      if (state.events.has(event.id)) return state.purchase?.id ?? null;
      state.events.add(event.id); state.records++;
      if (refundIntent) { state.refunded = true; if (state.purchase) state.purchase.status = "refunded"; }
      if (input && !state.purchase) state.purchase = { ...input, id: purchaseId, status: state.refunded ? "refunded" : "paid", delivery_payload: null };
      return state.purchase?.id ?? null;
    },
    claimDelivery: async () => state.sent || state.purchase?.status !== "paid" ? null : state.purchase,
    prepareDelivery: async (_id, payload) => { state.purchase!.delivery_payload ??= payload; return state.purchase!; },
    sign: async (_file, seconds) => { state.signed.push(seconds); return "https://storage.example.invalid/synthetic"; },
    token: id => downloadToken(id, "synthetic-secret-for-unit-tests-only-32"),
    send: async () => { state.sends++; return state.sendOk; },
    finishDelivery: async (_id, success) => { if (success) state.sent = true; },
  };
  return { deps, state, run: () => webhook("unaltered raw body", "valid-synthetic-signature", deps) };
}

export const kitTests: [string, () => void | Promise<void>][] = [
  ["parts routes match in client and SSR and stay outside indexed pages", async () => {
    // Runs from the repository root under both Node and Vitest (jsdom rewrites import.meta.url).
    const read = (file: string) => readFile(`${process.cwd()}/${file}`, "utf8");
    for (const file of ["src/App.tsx", "src/entry-server.tsx"]) {
      const source = await read(file);
      for (const route of ["/brain-modules", "/brain-modules/:slug", "/brain-modules/download", "/kits/download"]) assert(source.includes(`path="${route}"`), `${file}: ${route}`);
      assert(!source.includes('path="/kits"')); assert(!source.includes('path="/kits/:slug"'));
    }
    assert(!staticPages.some(page => /^\/(parts|kits)(\/|$)/.test(page.path)));
    const hosting = JSON.parse(await read("vercel.json"));
    assert(hosting.redirects.some((rule: { source: string; destination: string }) => rule.source === "/kits/:path*" && rule.destination === "/brain-modules/:path*"));
    assert(hosting.redirects.some((rule: { source: string; destination: string; permanent?: boolean }) => rule.source === "/parts/:path*" && rule.destination === "/brain-modules/:path*" && rule.permanent), "old /parts links, including receipts already sent, keep working");
    const page = await read("src/pages/Kits.tsx");
    assert(page.includes('noindex />')); assert(page.includes('to="/measure-your-ai-judgement"'));
    assert(page.includes('Start your AI brain <em>one module at a time.</em>'));
    assert(page.includes('title: "What only you can judge", content: <p>{kit.whoDecided}</p>'));
    assert(page.includes('title: "What it checks", content: <p>{kit.checks}</p>'));
    assert(!page.includes('kit.whoDecided ??'));
    // Krish, 18 November 2026: the hero says plainly that a brain module is working software, not a prompt; one is a brain module, never "a part".
    const explanation = "Your AI brain is your judgement, written down so AI can use it. Each brain module is working software, not a prompt: it checks what you are about to rely on against your own files, the same way every time, and remembers what changed. You see the result in five minutes.";
    assert(page.indexOf(explanation) > page.indexOf("</h1>"));
    // The one-click line now lives in the hero checklist, so the hero is one paragraph (18 November 2026).
    assert(page.includes("Buy once, then add it to Claude Desktop on a Mac or Windows computer in one click."));
    assert(page.includes("Pick the job you want done before your next decision."));
    assert(!page.includes("kit-group")); assert(!page.includes("kit.group"));
    assert(page.includes('kit.slug === "audit-a-decision" && <p className="kit-audit">Try it free first: <Link to="/measure-your-ai-judgement">Measure your AI judgement</Link> is the same six questions for one decision.</p>'));
    assert(!/\u2014|AI transformation|AI literacy|innovation|capability building|leverage AI|unlock|game-changer|the future of work/i.test(page));
  }],
  ["each part retains the report checks and human judgement verbatim", () => {
    const expected = [
    [
        "fact-check-board-update",
        "the claims in your update for matching wording, conflicting numbers and explicit negation in your evidence.",
        "whether the evidence is trustworthy and the update gives the board a fair account of the business."
    ],
    [
        "fact-check-email",
        "the names, figures and quotations in your draft against your notes.",
        "whether each claim is true in context, correctly attributed and right to send."
    ],
    [
        "check-a-number",
        "the ratio arithmetic, reporting dates, cohort details, repeated measurements and missing sources behind your metrics.",
        "whether the underlying measurements are reliable and answer the question you need to decide."
    ],
    [
        "meeting-brief",
        "your own files for who they are, what was last said, open questions and gaps in the record.",
        "which questions matter for this conversation and how to respond to what the other person says."
    ],
    [
        "lowest-price",
        "the minimum price that meets your target margin from your costs, payment fees and refund reserve.",
        "whether customers will pay that price and whether your costs and assumptions reflect your business."
    ],
    [
        "test-a-discount",
        "what the discount does to your contribution and the extra sales needed to keep it whole.",
        "whether the discount will bring enough extra demand and whether you can fulfil those sales."
    ],
    [
        "audit-a-decision",
        "your own account of how you made this decision, against six questions.",
        "whether your account is honest, and what you will do differently next time."
    ],
    [
        "read-ai-stack",
        "each tool in the research against its evidence, capped at what that kind of evidence can prove, and against your own notes.",
        "what the tools tell you about how this company works, and what to ask them about it."
    ]
];
    assert.deepEqual(kits.map(part => [part.slug, part.checks, part.whoDecided]), expected);
  }],
  ["download renewal authorises a paid receipt, rejects a refund and signs for seven days", async () => {
    const secret = "synthetic-secret-for-unit-tests-only-32";
    const token = await downloadToken(purchaseId, secret);
    let status: "paid" | "refunded" = "paid"; let calls = 0;
    const deps = { key: "sk_test_synthetic", secret,
      find: async () => ({ status, file_path: "kit/v1.mcpb" }),
      sign: async (file: string, seconds: number) => { calls++; assert.equal(file, "kit/v1.mcpb"); assert.equal(seconds, 604800); return "signed-synthetic"; },
    };
    assert.deepEqual(await renewDownload(token, deps), { url: "signed-synthetic" });
    status = "refunded"; await assert.rejects(() => renewDownload(token, deps), /Download unavailable/);
    assert.equal(calls, 1);
  }],
  ["eight clearly named parts support decisions through the AI brain door", () => {
    assert.deepEqual(kits.map(part => part.slug), ["fact-check-board-update", "fact-check-email", "check-a-number", "meeting-brief", "lowest-price", "test-a-discount", "audit-a-decision", "read-ai-stack"]);
    assert.deepEqual(kits.map(part => part.name), ["Fact-check my board update", "Fact-check an email before I send it", "Check a number before I rely on it", "Brief me before a meeting", "Work out my lowest price", "Test a discount before I agree to it", "Audit a decision I made with AI", "Read a company's AI stack"]);
    assert.deepEqual(kits.map(part => part.problem), ["Every claim traced to a source before it goes to the board.", "Every name, figure and quote checked before it leaves your outbox.", "Whether a figure is sound enough to decide on or report.", "What your own files already say about the person, and what is missing.", "Your price floor, from your own costs and margin.", "What it really costs, and how many extra sales it needs to pay for itself.", "Where your judgement held and where you handed it over, kept as a running record.", "The AI tools one company really uses, each with its evidence and how sure we can be."]);
    assert(kits.every(part => !("group" in part)));
    assert.equal(new Set(kits.map(part => part.slug)).size, 8);
    for (const part of kits) {
      assert.equal(part.status, "ready"); assert.equal(part.door, "ai-brain");
      assert(part.strengthens); assert(part.problem); assert.equal(part.does.length, 3); assert.equal(part.firstFiveMinutes.length, 3);
      assert(part.requirements.includes("Claude Desktop on Mac or Windows."));
      assert(!/\u2014|AI transformation|AI literacy|innovation|capability building|leverage AI|unlock|game-changer|the future of work/i.test(JSON.stringify(part)));
    }
    for (const environment of ["production", "preview", "local"] as const) assert.deepEqual(visibleKits(kits, environment), kits);
    assert.deepEqual(visibleKits([{ ...ready, status: "sample" }], "production"), []);
  }],
  ["production deployment cannot enable fixtures with a preview flag", () => {
    assert.equal(kitsPreview({ VERCEL_ENV: "production", KITS_PREVIEW_BUILD: "1" }, "development"), false);
    assert.equal(kitsPreview({ VERCEL_ENV: "preview" }), true);
    assert.equal(kitsPreview({}), false);
    assert.equal(kitsPreview({}, "development"), true);
  }],
  ["checkout creates one fixed-price payment with a retry-stable idempotency key", async () => {
    const { deps, calls } = checkoutFixture();
    await checkout({ ...checkoutInput, amount: 1, quantity: 9, success_url: "https://evil.invalid" }, deps);
    await checkout(checkoutInput, deps);
    assert.equal(calls.length, 2); assert.deepEqual(calls[0].options, calls[1].options);
    assert.equal(calls[0].params.mode, "payment");
    assert.deepEqual(calls[0].params.line_items, [{ price: "price_synthetic", quantity: 1 }]);
    assert.equal(calls[0].params.success_url, `https://preview.example/brain-modules/${ready.slug}?checkout=success`);
    assert.equal(calls[0].params.cancel_url, `https://preview.example/brain-modules/${ready.slug}?checkout=cancelled`);
  }],
  ["absent or unknown keys fail before calling Stripe", async () => {
    for (const key of ["", "pk_live_synthetic", "whsec_synthetic", "sk_synthetic"]) {
      const { deps, calls } = checkoutFixture(); deps.key = key;
      await assert.rejects(() => checkout(checkoutInput, deps), /Checkout is unavailable/); assert.equal(calls.length, 0);
    }
  }],
  ["a live key sells at the live price and refuses a test price or a test session", async () => {
    const { deps, calls } = checkoutFixture(); deps.key = "sk_live_synthetic";
    deps.retrievePrice = async id => ({ id, active: true, livemode: true, currency: "usd", unit_amount: 5900, type: "one_time" });
    deps.createSession = async (params, options) => { calls.push({ params, options }); return { url: "https://checkout.stripe.com/c/pay/live_synthetic", livemode: true }; };
    assert.equal((await checkout(checkoutInput, deps)).url, "https://checkout.stripe.com/c/pay/live_synthetic");
    const testPrice = checkoutFixture(); testPrice.deps.key = "rk_live_synthetic";
    await assert.rejects(() => checkout(checkoutInput, testPrice.deps), /price is not configured/); assert.equal(testPrice.calls.length, 0);
    const testSession = checkoutFixture(); testSession.deps.key = "sk_live_synthetic";
    testSession.deps.retrievePrice = deps.retrievePrice;
    await assert.rejects(() => checkout(checkoutInput, testSession.deps), /Checkout is unavailable/);
  }],
  ["a live checkout fulfils live events and refuses test events, and the reverse", async () => {
    const live = webhookFixture(); live.deps.live = true;
    live.state.event = paidEvent(); live.state.event.livemode = true; (live.state.event.data.object as Record<string, unknown>).livemode = true;
    await live.run(); assert.equal(live.state.sends, 1);
    const mixed = webhookFixture(); mixed.deps.live = true;
    await assert.rejects(() => mixed.run(), /Event mode does not match/); assert.equal(mixed.state.records, 0);
    const object = webhookFixture(); object.deps.live = true;
    object.state.event = paidEvent(); object.state.event.livemode = true;
    await assert.rejects(() => object.run(), /Invalid part purchase/); assert.equal(object.state.sends, 0);
  }],
  ["checkout accepts promotion codes", async () => {
    const { deps, calls } = checkoutFixture(); await checkout(checkoutInput, deps);
    assert.equal(calls[0].params.allow_promotion_codes, true);
  }],
  ["a member code makes one module free and it is still delivered", async () => {
    const { run, state } = webhookFixture();
    const object = state.event.data.object as Record<string, unknown>;
    Object.assign(object, { payment_status: "no_payment_required", amount_total: 0, amount_subtotal: 5900, payment_intent: null,
      total_details: { amount_discount: 5900 }, discounts: [{ coupon: MEMBER_COUPON, promotion_code: "promo_synthetic" }] });
    await run(); assert.equal(state.sends, 1); assert.equal(state.purchase!.payment_intent, `member_${sessionId}`);
  }],
  ["any other free code, or a part-price total, fails closed", async () => {
    for (const change of [
      { discounts: [{ coupon: "EARLYADOPTER_synthetic" }] },
      { discounts: [] },
      { discounts: [{ coupon: MEMBER_COUPON }, { coupon: "other" }] },
      { amount_total: 100, total_details: { amount_discount: 5800 } },
    ]) {
      const { run, state } = webhookFixture();
      Object.assign(state.event.data.object as Record<string, unknown>, { payment_status: "no_payment_required", amount_total: 0, amount_subtotal: 5900,
        payment_intent: null, total_details: { amount_discount: 5900 }, discounts: [{ coupon: MEMBER_COUPON }] }, change);
      await assert.rejects(() => run(), /Invalid part purchase/); assert.equal(state.sends, 0);
    }
  }],
  ["sample and unknown slugs cannot be bought", async () => {
    const { deps, calls } = checkoutFixture(); deps.catalogue = [{ ...ready, status: "sample" }];
    await assert.rejects(() => checkout(checkoutInput, deps), /not for sale/);
    await assert.rejects(() => checkout({ ...checkoutInput, slug: "unknown" }, deps), /not for sale/);
    assert.equal(calls.length, 0);
  }],
  ["removed parts cannot be bought", async () => {
    const { deps, calls } = checkoutFixture(); deps.catalogue = kits;
    for (const slug of ["evidence", "claims", "the-room", "price-floor", "your-word", "the-discount", "spend", "commitments", "the-numbers", "the-source", "who-next", "quiet-deals"]) {
      deps.prices[slug] = "price_synthetic";
      await assert.rejects(() => checkout({ ...checkoutInput, slug }, deps), /not for sale/);
    }
    assert.equal(calls.length, 0);
  }],
  ["wrong currency, amount, recurring, inactive or live prices fail closed", async () => {
    for (const override of [{ currency: "gbp" }, { unit_amount: 590 }, { type: "recurring" }, { active: false }, { livemode: true }]) {
      const { deps, calls } = checkoutFixture(); const original = deps.retrievePrice;
      deps.retrievePrice = async id => ({ ...await original(id), ...override });
      await assert.rejects(() => checkout(checkoutInput, deps), /price is not configured/); assert.equal(calls.length, 0);
    }
  }],
  ["every buyer is promised no marketing emails, one personal check-in and a free session, and is pointed to the full site", async () => {
    assert.match(BUYER_PROMISE, /never get marketing emails/); assert.match(BUYER_PROMISE, /check in with you once, personally/); assert.match(BUYER_PROMISE, /free session/);
    const { deps, calls } = checkoutFixture(); await checkout(checkoutInput, deps);
    assert.deepEqual(calls[0].params.custom_text, { submit: { message: BUYER_PROMISE } });
    const { run, state } = webhookFixture(); await run();
    const text = state.purchase!.delivery_payload!.text;
    assert(text.includes(BUYER_PROMISE)); assert(text.includes("https://preview.example/brain-modules")); assert(text.includes("build your whole AI brain with Mindmake at https://preview.example"));
  }],
  ["each delivered purchase tells the operator once, and a failed note never fails the delivery", async () => {
    const { deps, run, state } = webhookFixture(); const notes: { subject: string; text: string }[] = [];
    deps.notifyOperator = async (_purchase, message) => { notes.push(message); };
    await run(); await run();
    assert.equal(notes.length, 1); assert.equal(notes[0].subject, "New parts buyer: Fact-check my board update");
    assert.match(notes[0].text, /buyer@example\.invalid bought Fact-check my board update/); assert.match(notes[0].text, /Nothing is sent to them automatically/);
    const failing = webhookFixture(); failing.deps.notifyOperator = async () => { throw new Error("mail down"); };
    await failing.run(); assert.equal(failing.state.sent, true);
    assert.match(operatorNote({ email: "a@example.invalid", kit_slug: ready.slug }, [ready], new Date("2026-11-18T12:00:00Z")).text, /by 2026-11-25/);
  }],
  ["missing or forged webhook signatures never record or send", async () => {
    const { deps, state } = webhookFixture();
    await assert.rejects(() => webhook("raw", null, deps), /Missing signature/);
    await assert.rejects(() => webhook("raw", "forged", deps), /Invalid signature/);
    assert.equal(state.records, 0); assert.equal(state.sends, 0);
  }],
  ["verified raw body is passed unchanged and duplicates do not duplicate the purchase or email", async () => {
    const { run, state } = webhookFixture(); await run(); await run();
    assert.equal(state.verified[0], "valid-synthetic-signature:unaltered raw body");
    assert.equal(state.records, 1); assert.equal(state.sends, 1); assert.equal(state.purchase?.status, "paid");
    assert.deepEqual(state.signed, [604800]);
    assert.match(state.purchase!.delivery_payload!.text, /brain-modules\/download#token=/);
    assert.equal(state.purchase!.delivery_payload!.subject, "Your AI brain module: Fact-check my board update");
    assert(!/\bkit\b/i.test(state.purchase!.delivery_payload!.text));
  }],
  ["a failed email retries the persisted payload without issuing another signed URL", async () => {
    const { run, state } = webhookFixture(); state.sendOk = false;
    await assert.rejects(run, /Delivery pending/); const payload = state.purchase!.delivery_payload;
    state.sendOk = true; await run();
    assert.equal(state.records, 1); assert.equal(state.sent, true); assert.equal(state.signed.length, 1);
    assert.equal(state.purchase!.delivery_payload, payload);
  }],
  ["refund marks the purchase refunded and duplicate events remain idempotent", async () => {
    const { run, state } = webhookFixture(); await run(); state.event = refundedEvent(); await run(); await run();
    assert.equal(state.purchase!.status, "refunded"); assert.equal(state.records, 2); assert.equal(state.sends, 1);
  }],
  ["out-of-order refund prevents later fulfilment", async () => {
    const { run, state } = webhookFixture(); state.event = refundedEvent(); await run(); state.event = paidEvent(); await run();
    assert.equal(state.purchase!.status, "refunded"); assert.equal(state.sends, 0);
  }],
  ["live, unpaid and altered-amount events cannot fulfil", async () => {
    for (const change of ["live", "unpaid", "amount"]) {
      const { run, state } = webhookFixture();
      if (change === "live") state.event.livemode = true;
      if (change === "unpaid") state.event.data.object.payment_status = "unpaid";
      if (change === "amount") state.event.data.object.amount_total = 1;
      await assert.rejects(run); assert.equal(state.records, 0); assert.equal(state.sends, 0);
    }
  }],
  ["receipt capability rejects tampering and cannot use a session ID as authorisation", async () => {
    const secret = "synthetic-secret-for-unit-tests-only-32";
    const token = await downloadToken(purchaseId, secret);
    assert.equal(await verifyDownloadToken(token, secret), purchaseId);
    await assert.rejects(() => verifyDownloadToken(token.replace(/^0/, "1"), secret));
    await assert.rejects(() => verifyDownloadToken(sessionId, secret));
    await assert.rejects(() => verifyDownloadToken(token, "another-secret-for-unit-tests-only-32"));
  }],
  ["a company brain module asks for the company and its website at checkout; the others ask for nothing", async () => {
    const company: Kit = { ...kits.find(item => item.asksFor === "company")!, status: "ready" };
    const { deps, calls } = checkoutFixture(); deps.catalogue = [ready, company]; deps.prices[company.slug] = "price_synthetic_company";
    await checkout({ slug: company.slug, requestId: purchaseId }, deps);
    await checkout(checkoutInput, deps);
    assert.deepEqual(calls[0].params.custom_fields, COMPANY_FIELDS);
    assert.equal(calls[1].params.custom_fields, undefined);
    for (const field of COMPANY_FIELDS) assert(field.label.custom.length <= 50, "Stripe allows 50 characters in a label");
  }],
  ["the website a buyer types is read the way people type it, and nonsense is refused", () => {
    const at = (company: string, domain: string) => companyFrom({ custom_fields: [{ key: "company", text: { value: company } }, { key: "domain", text: { value: domain } }] });
    for (const typed of ["acme.com", "ACME.com", "https://www.acme.com/about?x=1", "www.acme.com.", "acme.com:443", " acme.com ", "jo@acme.com"]) assert.deepEqual(at("Acme", typed), { company: "Acme", domain: "acme.com" }, typed);
    for (const typed of ["acme", "not a site", "", "http://", "acme..com", "-acme.com"]) assert.equal(at("Acme", typed), null, typed);
    assert.equal(at("A", "acme.com"), null);
    assert.equal(companyFrom({}), null);
    assert.equal(at("Acme\u0007 Ltd", "acme.com")!.company, "Acme  Ltd");
  }],
  ["a company brain module's receipt carries the research link first, then the module", async () => {
    const company: Kit = { ...kits.find(item => item.asksFor === "company")!, status: "ready" };
    const { deps, state, run } = webhookFixture(); deps.catalogue = [company]; deps.files = { [company.slug]: "read-ai-stack/v1.mcpb" };
    state.event.data.object.metadata = { kit_slug: company.slug };
    state.event.data.object.custom_fields = [{ key: "company", text: { value: "Northwind Freight" } }, { key: "domain", text: { value: "https://northwind-freight.example/" } }];
    const asked: unknown[] = []; const notes: string[] = [];
    deps.research = async (purchase, subject) => { asked.push(subject); return `research/ai-stack/${purchase.id}.json`; };
    deps.notifyOperator = async (_purchase, message) => { notes.push(message.text); };
    await run();
    assert.deepEqual(asked, [{ company: "Northwind Freight", domain: "northwind-freight.example" }]);
    const text = state.purchase!.delivery_payload!.text;
    assert(text.startsWith("Your research file on Northwind Freight (northwind-freight.example)"));
    assert(text.indexOf("research file") < text.indexOf("brain module is ready"));
    assert.deepEqual(state.signed, [604800, 604800]); assert.equal(state.sends, 1);
    assert(!notes[0].includes("To do now"));
  }],
  ["when the research cannot be built the buyer still gets the module, and Krish is told to build it by hand", async () => {
    const company: Kit = { ...kits.find(item => item.asksFor === "company")!, status: "ready" };
    for (const [fields, named] of [[[{ key: "company", text: { value: "Ghost Co" } }, { key: "domain", text: { value: "ghost.example" } }], "Ghost Co (ghost.example)"], [[], "the company you named"]] as const) {
      const { deps, state, run } = webhookFixture(); deps.catalogue = [company]; deps.files = { [company.slug]: "read-ai-stack/v1.mcpb" };
      state.event.data.object.metadata = { kit_slug: company.slug };
      state.event.data.object.custom_fields = fields;
      const notes: string[] = []; let tries = 0;
      deps.research = async () => { tries++; throw new Error("Nothing public could be read"); };
      deps.notifyOperator = async (_purchase, message) => { notes.push(message.text); };
      await run();
      assert.equal(tries, fields.length ? 1 : 0);
      const text = state.purchase!.delivery_payload!.text;
      assert(text.startsWith(`We could not read ${named} automatically.`)); assert(text.includes("within one working day"));
      assert(text.includes("brain module is ready")); assert.equal(state.sends, 1);
      assert(notes[0].includes("To do now: build the research file") && notes[0].includes("buyer@example.invalid"));
    }
  }],
  ["a retry after a failed send keeps the stored receipt and still tells Krish what is owed", async () => {
    const company: Kit = { ...kits.find(item => item.asksFor === "company")!, status: "ready" };
    const { deps, state, run } = webhookFixture(); deps.catalogue = [company]; deps.files = { [company.slug]: "read-ai-stack/v1.mcpb" };
    state.event.data.object.metadata = { kit_slug: company.slug };
    let tries = 0; const notes: string[] = [];
    deps.research = async () => { tries++; throw new Error("slow"); };
    deps.notifyOperator = async (_purchase, message) => { notes.push(message.text); };
    state.event.data.object.custom_fields = [{ key: "company", text: { value: "Slow Co" } }, { key: "domain", text: { value: "slow.example" } }];
    state.sendOk = false; await assert.rejects(run);
    state.sendOk = true; state.events.clear(); await run();
    assert.equal(tries, 1, "the stored receipt is reused, not rebuilt"); assert.equal(state.sends, 2);
    assert(notes.length === 1 && notes[0].includes("To do now"));
  }],
];
