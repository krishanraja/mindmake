import assert from "node:assert/strict";
import { kits, visibleKits, type Kit } from "../../src/content/kits.ts";
import { checkout, downloadToken, renewDownload, verifyDownloadToken, webhook, type CheckoutDeps, type KitEvent, type Purchase, type WebhookDeps } from "../../supabase/functions/_shared/kits/core.ts";
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
    catalogue: [ready], files: { [ready.slug]: "board-update-check/v1.mcpb" }, origin: "https://preview.example",
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
  ["production hides every sample; preview and local expose explicitly labelled fixtures", () => {
    assert.equal(kits.length, 3); assert(kits.every(kit => kit.status === "sample"));
    assert.deepEqual(visibleKits(kits, "production"), []);
    assert.equal(visibleKits(kits, "preview").length, 3); assert.equal(visibleKits(kits, "local").length, 3);
    assert.deepEqual(visibleKits([...kits, ready], "production"), [ready]);
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
    assert.equal(calls[0].params.success_url, `https://preview.example/kits/${ready.slug}?checkout=success`);
  }],
  ["live or absent keys fail before calling Stripe", async () => {
    for (const key of ["sk_live_synthetic", "", "rk_test_synthetic"]) {
      const { deps, calls } = checkoutFixture(); deps.key = key;
      await assert.rejects(() => checkout(checkoutInput, deps), /Test checkout/); assert.equal(calls.length, 0);
    }
  }],
  ["sample and unknown slugs cannot be bought", async () => {
    const { deps, calls } = checkoutFixture(); deps.catalogue = kits;
    await assert.rejects(() => checkout(checkoutInput, deps), /not for sale/);
    await assert.rejects(() => checkout({ ...checkoutInput, slug: "unknown" }, deps), /not for sale/);
    assert.equal(calls.length, 0);
  }],
  ["wrong currency, amount, recurring, inactive or live prices fail closed", async () => {
    for (const override of [{ currency: "gbp" }, { unit_amount: 590 }, { type: "recurring" }, { active: false }, { livemode: true }]) {
      const { deps, calls } = checkoutFixture(); const original = deps.retrievePrice;
      deps.retrievePrice = async id => ({ ...await original(id), ...override });
      await assert.rejects(() => checkout(checkoutInput, deps), /price is not configured/); assert.equal(calls.length, 0);
    }
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
    assert.match(state.purchase!.delivery_payload!.text, /kits\/download#token=/);
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
];
