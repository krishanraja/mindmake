import { KIT_CURRENCY, KIT_PRICE_CENTS, type Kit } from "../../../../src/content/kits.ts";
import { receiptHtml, receiptText, type ReceiptParts } from "./email.ts";

export class KitError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
/**
 * The Stripe mode follows the installed key: a live key takes real payments,
 * a test key takes test payments, and the two never mix (Ruling, Krish,
 * 2026-11-18: parts go live for sale). Any other key is refused.
 */
export function stripeMode(key: string): boolean {
  if (/^(?:sk|rk)_live_/.test(key)) return true;
  if (/^(?:sk|rk)_test_/.test(key)) return false;
  throw new KitError(503, "Checkout is unavailable");
}
export interface Price { id: string; active: boolean; livemode: boolean; currency: string; unit_amount: number | null; type: string }
export interface CheckoutDeps {
  key: string; origin: string; catalogue: readonly Kit[]; prices: Record<string, string>;
  retrievePrice: (id: string) => Promise<Price>;
  createSession: (params: Record<string, unknown>, options: { idempotencyKey: string }) => Promise<{ url: string | null; livemode: boolean }>;
  /** Looks up an active promotion code by what the member typed or followed a link with. */
  findPromotion?: (code: string) => Promise<{ id: string; active: boolean; coupon: string | null } | null>;
}
export async function checkout(input: unknown, deps: CheckoutDeps) {
  const live = stripeMode(deps.key);
  if (!input || typeof input !== "object") throw new KitError(400, "Invalid request");
  const { slug, requestId, code } = input as Record<string, unknown>;
  if (typeof slug !== "string" || typeof requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(requestId)) throw new KitError(400, "Invalid request");
  if (code !== undefined && (typeof code !== "string" || !/^[A-Za-z0-9-]{3,40}$/.test(code))) throw new KitError(400, "That code does not work");
  const kit = deps.catalogue.find(item => item.slug === slug && item.status === "ready");
  if (!kit) throw new KitError(404, "Part is not for sale");
  const priceId = deps.prices[slug];
  if (!priceId?.startsWith("price_")) throw new KitError(503, "Part is not configured");
  const price = await deps.retrievePrice(priceId);
  if (!price.active || price.livemode !== live || price.currency !== KIT_CURRENCY || price.unit_amount !== KIT_PRICE_CENTS || price.type !== "one_time") throw new KitError(503, "Part price is not configured");
  // A member link carries its code, applied here so the member never types it. Every other checkout shows Stripe's
  // code box (Ruling, Krish, 2026-11-20), where MAKEMYMINDUP and MAKEMYMINDUP-FOREVER work.
  let discount: Record<string, unknown> = { allow_promotion_codes: true };
  if (typeof code === "string") {
    const promotion = deps.findPromotion ? await deps.findPromotion(code) : null;
    if (!promotion?.active || !FREE_COUPONS.includes(promotion.coupon ?? "")) throw new KitError(400, "That code does not work");
    discount = { discounts: [{ promotion_code: promotion.id }] };
  }
  const session = await deps.createSession({
    // No payment_method_types: the buyer sees every method the account has on (card, Link, Apple Pay, Google Pay
    // and the rest), each of which settles at checkout (Ruling, Krish, 2026-11-20).
    mode: "payment", line_items: [{ price: priceId, quantity: 1 }], ...discount,
    metadata: { kit_slug: slug, kit_price: priceId }, payment_intent_data: { metadata: { kit_slug: slug } },
    custom_text: { submit: { message: BUYER_PROMISE } },
    ...(kit.asksFor === "company" ? { custom_fields: COMPANY_FIELDS } : {}),
    success_url: `${deps.origin}/brain-modules/${slug}?checkout=success${typeof code === "string" ? "&member=1" : ""}`, cancel_url: `${deps.origin}/brain-modules/${slug}?checkout=cancelled`,
  }, { idempotencyKey: `kit-${slug}-${requestId}${typeof code === "string" ? "-member" : ""}` });
  if (session.livemode !== live || !session.url || new URL(session.url).origin !== "https://checkout.stripe.com") throw new KitError(502, "Checkout is unavailable");
  return { url: session.url };
}

/** What a company brain module asks at checkout: the company and its website. */
export const COMPANY_FIELDS = [
  { key: "company", type: "text", label: { type: "custom", custom: "Company to read" }, text: { minimum_length: 2, maximum_length: 120 } },
  { key: "domain", type: "text", label: { type: "custom", custom: "Its website, for example acme.com" }, text: { minimum_length: 4, maximum_length: 253 } },
];
const DOMAIN = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/;
/** The company a buyer named at checkout, or null when either answer cannot be used. */
export function companyFrom(session: Record<string, unknown>): { company: string; domain: string } | null {
  const fields = Array.isArray(session.custom_fields) ? session.custom_fields as { key?: string; text?: { value?: string | null } }[] : [];
  const value = (key: string) => Array.from(String(fields.find(field => field?.key === key)?.text?.value ?? ""), c => c.charCodeAt(0) < 32 || c.charCodeAt(0) === 127 ? " " : c).join("").trim();
  const company = value("company").slice(0, 120);
  let domain = value("domain").toLowerCase().replace(/^[a-z]+:\/\//, "").split(/[/?#\s]/)[0].replace(/:\d+$/, "").replace(/\.$/, "").replace(/^www\./, "");
  if (domain.includes("@")) domain = domain.split("@").pop() ?? "";
  return company.length >= 2 && DOMAIN.test(domain) ? { company, domain } : null;
}

/**
 * The makeyourmindup paid-subscriber perk (Ruling, Krish, 2026-11-19): a promotion code on this coupon makes one
 * brain module free. A free checkout is fulfilled only when this exact coupon took off the whole price, so any other
 * 100% code on the account fails closed.
 */
export const MEMBER_COUPON = "mymu-member-module";
/** Founding members: every brain module free, as often as they like (MAKEMYMINDUP-FOREVER; Ruling, Krish, 2026-11-20). */
export const FOUNDING_COUPON = "mymu-founding-member";
export const FREE_COUPONS: readonly string[] = [MEMBER_COUPON, FOUNDING_COUPON];
/** The coupon a Stripe promotion code points at, in either the older (`coupon`) or newer (`promotion.coupon`) shape. */
export function couponOf(promotion: unknown): string | null {
  const p = promotion as { coupon?: unknown; promotion?: { coupon?: unknown } } | null;
  const c = p?.promotion?.coupon ?? p?.coupon;
  return typeof c === "string" ? c : typeof (c as { id?: unknown })?.id === "string" ? (c as { id: string }).id : null;
}
/** The free coupon that took off the whole price, or null. Any other 100% code on the account fails closed. */
export async function freeCoupon(object: Record<string, unknown>, promotionCoupon?: (id: string) => Promise<string | null>): Promise<string | null> {
  const totals = object.total_details as { amount_discount?: number } | undefined;
  if (!(object.amount_total === 0 && object.amount_subtotal === KIT_PRICE_CENTS && totals?.amount_discount === KIT_PRICE_CENTS
    && ["paid", "no_payment_required"].includes(String(object.payment_status)))) return null;
  const discounts = Array.isArray(object.discounts) ? object.discounts as { coupon?: unknown; promotion_code?: unknown }[] : [];
  if (discounts.length !== 1) return null;
  const known = (id: string | null) => id && FREE_COUPONS.includes(id) ? id : null;
  const direct = couponOf({ coupon: discounts[0]?.coupon });
  if (direct) return known(direct);
  const promo = discounts[0]?.promotion_code;
  const promoCoupon = couponOf(promo);
  if (promoCoupon) return known(promoCoupon);
  const id = typeof promo === "string" ? promo : (promo as { id?: unknown })?.id;
  if (typeof id !== "string" || !promotionCoupon) return null;
  try { return known(await promotionCoupon(id)); } catch { return null; }
}
export async function isMemberRedemption(object: Record<string, unknown>, promotionCoupon?: (id: string) => Promise<string | null>): Promise<boolean> {
  return (await freeCoupon(object, promotionCoupon)) !== null;
}

/** The promise made to every buyer (Krish, 18 November 2026). Shown at checkout, in the receipt and on the page. */
export const BUYER_PROMISE = "You will never get marketing emails from us. We will check in with you once, personally, to make sure the brain module is working for you. If it is not, we will run a free session with you to put it right.";
export const CHECK_IN_DAYS = 7;

/** The stored receipt. `owed` marks what Krish still has to do by hand; it is never sent to the buyer. */
export interface DeliveryPayload { subject: string; text: string; html?: string; owed?: "repeat" | "research" }

export interface KitEvent {
  id: string; type: string; livemode: boolean; created: number;
  data: { object: Record<string, unknown> };
}
export interface Purchase {
  id: string; session_id: string; payment_intent: string; kit_slug: string;
  email: string; status: "paid" | "refunded"; file_path: string;
  delivery_attempt?: string;
  delivery_payload: DeliveryPayload | null;
}
export interface PurchaseInput {
  session_id: string; payment_intent: string; kit_slug: string; email: string; file_path: string;
}
export interface WebhookDeps {
  verify: (body: string, signature: string) => Promise<KitEvent>;
  /** True when the installed Stripe key is live. Events of the other mode are refused. */
  live: boolean;
  catalogue: readonly Kit[]; files: Record<string, string>;
  record: (event: KitEvent, purchase: PurchaseInput | null, refundIntent: string | null) => Promise<string | null>;
  claimDelivery: (id: string) => Promise<Purchase | null>;
  prepareDelivery: (id: string, payload: DeliveryPayload) => Promise<Purchase>;
  sign: (path: string, seconds: number) => Promise<string>;
  /** How many earlier MAKEMYMINDUP claims this address made, other than this session. */
  priorMemberClaims?: (email: string, sessionId: string) => Promise<number>;
  /** The coupon behind a promotion code, read from Stripe: a session records the code, not always its coupon. */
  promotionCoupon?: (promotionCodeId: string) => Promise<string | null>;
  token: (id: string) => Promise<string>; origin: string;
  send: (purchase: Purchase) => Promise<boolean>;
  finishDelivery: (id: string, success: boolean) => Promise<void>;
  /** Builds and stores the research file for a company brain module; returns its storage path. */
  research?: (purchase: Purchase, subject: { company: string; domain: string }) => Promise<string>;
  /** Tells the operator a buyer is now a lead with a check-in due. Best effort: never fails a delivery. */
  notifyOperator?: (purchase: Purchase, message: { subject: string; text: string }) => Promise<void>;
}
/** The operator's note for a new buyer: a prompt for one personal check-in, never an automated send. */
export function operatorNote(purchase: Pick<Purchase, "email" | "kit_slug">, catalogue: readonly Kit[], today: Date, todo?: string) {
  const due = new Date(today.getTime() + CHECK_IN_DAYS * 86400000).toISOString().slice(0, 10);
  const name = catalogue.find(item => item.slug === purchase.kit_slug)?.name ?? purchase.kit_slug;
  return { subject: `New parts buyer: ${name}`, text: `${purchase.email} bought ${name}.\n\nCheck in with them personally by ${due}. They were promised: ${BUYER_PROMISE}\n\nNothing is sent to them automatically. They are saved as a lead in kit_purchases, with the check-in in kit_concierge_queue.${todo ? `\n\nTo do now: ${todo}` : ""}` };
}

export async function webhook(raw: string, signature: string | null, deps: WebhookDeps) {
  if (!signature) throw new KitError(400, "Missing signature");
  let event: KitEvent;
  try { event = await deps.verify(raw, signature); } catch { throw new KitError(400, "Invalid signature"); }
  if (event.livemode !== deps.live) throw new KitError(400, "Event mode does not match this checkout");
  // A bank payment (US bank account) completes the checkout unpaid and settles days later, as
  // async_payment_succeeded; the module goes out only then (2026-11-20, when more payment methods were turned on).
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded", "charge.refunded"].includes(event.type)) return { received: true };
  const object = event.data.object;
  let purchase: PurchaseInput | null = null;
  let refundIntent: string | null = null;
  let repeatClaim = false;
  if (event.type !== "charge.refunded") {
    const metadata = object.metadata as Record<string, string> | undefined;
    const kit = deps.catalogue.find(item => item.slug === metadata?.kit_slug && item.status === "ready");
    // Other products on the same Stripe account are outside this endpoint.
    if (!metadata?.kit_slug) return { received: true };
    // Not paid yet: a bank payment still settling. Nothing is recorded or sent until it settles.
    if (event.type === "checkout.session.completed" && object.payment_status === "unpaid") return { received: true };
    const coupon = await freeCoupon(object, deps.promotionCoupon);
    const member = coupon !== null;
    const paid = object.payment_status === "paid" && object.amount_total === KIT_PRICE_CENTS;
    if (!kit || object.mode !== "payment" || !(paid || member) || object.currency !== KIT_CURRENCY || object.livemode !== deps.live) throw new KitError(400, "Invalid part purchase");
    const email = (object.customer_details as { email?: string } | undefined)?.email;
    const file = deps.files[kit.slug];
    // A member redemption costs nothing, so Stripe makes no PaymentIntent; the session id stands in for it, marked
    // by which code it used, so a second claim on the one-module code can be seen.
    const intent = member && object.payment_intent == null && typeof object.id === "string" ? `${coupon === FOUNDING_COUPON ? "founding" : "member"}_${object.id}` : object.payment_intent;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof intent !== "string" || typeof object.id !== "string") throw new KitError(400, "Incomplete purchase");
    if (!file || file.includes("..") || file.startsWith("/")) throw new KitError(503, "Part file unavailable");
    purchase = { session_id: object.id, payment_intent: intent, kit_slug: kit.slug, email, file_path: file };
    // MAKEMYMINDUP is one free module per person: a second claim from the same address is told so, not sent a module.
    if (coupon === MEMBER_COUPON && deps.priorMemberClaims) repeatClaim = (await deps.priorMemberClaims(email, object.id)) > 0;
  } else {
    // Only kit charges carry this metadata; it is set on the PaymentIntent.
    const metadata = object.metadata as Record<string, string> | undefined;
    if (!metadata?.kit_slug) return { received: true };
    if (typeof object.payment_intent !== "string" || typeof object.amount_refunded !== "number" || object.amount_refunded <= 0 || object.livemode !== deps.live) throw new KitError(400, "Invalid refund");
    refundIntent = object.payment_intent;
  }
  const id = await deps.record(event, purchase, refundIntent);
  if (!id || !purchase) return { received: true };
  const claimed = await deps.claimDelivery(id);
  if (!claimed) return { received: true };
  try {
    let prepared = claimed;
    let todo: string | undefined;
    if (!prepared.delivery_payload) {
      const kit = deps.catalogue.find(item => item.slug === purchase.kit_slug)!;
      const page = `${deps.origin}/brain-modules/${kit.slug}`;
      const footerLinks = [{ label: "Brain modules", href: `${deps.origin}/brain-modules` }, { label: "Your 2-minute AI upgrade toolkit", href: `${deps.origin}/2-minute-ai-upgrade-toolkit` }, { label: "mindmake.co", href: deps.origin }];
      let parts: ReceiptParts, owed: "repeat" | "research" | undefined;
      if (repeatClaim) {
        owed = "repeat";
        todo = `${prepared.email} tried a second free module (${kit.name}) with MAKEMYMINDUP. No module was sent; they were told how to buy it.`;
        parts = { preheader: "MAKEMYMINDUP covers one free brain module.", heading: "About your free brain module",
          intro: "MAKEMYMINDUP covers one free brain module, and this email address has already used it.",
          button: { label: `Add ${kit.name}, $59`, href: page },
          notes: ["Or reply to this email and we will sort it out.", BUYER_PROMISE], footerLinks };
      } else {
        const token = await deps.token(prepared.id);
        const download = `${deps.origin}/brain-modules/download#token=${encodeURIComponent(token)}`;
        let research: string | undefined;
        if (kit.asksFor === "company") {
          const subject = companyFrom(object);
          try {
            if (!subject || !deps.research) throw new Error("Research unavailable");
            await deps.research(prepared, subject);
            research = `Your research file on ${subject.company} (${subject.domain}) is ready on the same page, built today from public signals. Give it to the brain module in Claude Desktop.`;
          } catch {
            const what = subject ? `${subject.company} (${subject.domain})` : "the company you named";
            owed = "research";
            todo = `build the research file for ${what} by hand and send it to ${prepared.email}.`;
            research = `We could not read ${what} automatically. We will build your research file by hand and email it to you within one working day. You do not need to do anything.`;
          }
        }
        parts = { preheader: `${kit.name} is ready to download.`, heading: "Thank you. Your brain module is ready.",
          intro: `Your brain module, ${kit.name}, is ready. ${kit.problem}`,
          button: { label: "Download your brain module", href: download },
          steps: [...(research ? [research] : []), "Open this email on a Mac or Windows computer.", "Press the button above and open the download. Claude Desktop adds it in one click.", "Ask Claude to use it on your own files. Nothing is sent to us."],
          // Members came in with a code, so they already read it; everyone else is asked once (Krish, 2026-11-20).
          subscribe: object.payment_status === "paid" ? { href: "https://makeyourmindup.ai" } : undefined,
          notes: ["The button works whenever you need it, on any computer: it fetches a fresh download each time.", "Full refund within 14 days, no questions asked. Reply to this email for help or a refund.", BUYER_PROMISE], footerLinks };
      }
      prepared = await deps.prepareDelivery(id, { subject: repeatClaim ? "About your free brain module" : `Your brain module: ${kit.name}`, text: receiptText(parts), html: receiptHtml(parts), ...(owed ? { owed } : {}) });
    }
    // A retry reads the stored receipt, so anything still owed is never forgotten.
    if (!todo && prepared.delivery_payload?.owed === "repeat") todo = `${prepared.email} tried a second free module with MAKEMYMINDUP. No module was sent.`;
    if (!todo && prepared.delivery_payload?.owed === "research") todo = `build the research file by hand and send it to ${prepared.email}; the receipt they were sent names the company.`;
    if (prepared.status === "refunded") { await deps.finishDelivery(id, false); return { received: true }; }
    if (!await deps.send(prepared)) throw new Error("Delivery pending");
    await deps.finishDelivery(id, true);
    try { await deps.notifyOperator?.(prepared, operatorNote(prepared, deps.catalogue, new Date(), todo)); } catch { /* the lead is already saved; the note is a courtesy */ }
  } catch {
    await deps.finishDelivery(id, false);
    throw new KitError(503, "Delivery pending; retry this event");
  }
  return { received: true };
}

async function signature(id: string, secret: string) {
  if (secret.length < 32) throw new KitError(503, "Downloads unavailable");
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return Array.from(new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(`kit-download:${id}`))), byte => byte.toString(16).padStart(2, "0")).join("");
}
export async function downloadToken(id: string, secret: string) { return `${id}.${await signature(id, secret)}`; }
export async function verifyDownloadToken(token: string, secret: string) {
  const [id, supplied, extra] = token.split(".");
  if (extra || !/^[0-9a-f-]{36}$/i.test(id ?? "") || !/^[a-f0-9]{64}$/.test(supplied ?? "")) throw new KitError(403, "Download unavailable");
  const expected = await signature(id, secret);
  let difference = 0;
  for (let i = 0; i < expected.length; i++) difference |= expected.charCodeAt(i) ^ supplied.charCodeAt(i);
  if (difference !== 0) throw new KitError(403, "Download unavailable");
  return id;
}

/** The saved name of a module file: mindmake-<module>.mcpb, with no version in it. */
export function downloadName(file: string): string {
  const base = file.split("/").pop() ?? "";
  const match = /^(mindmake-[a-z0-9-]+?)(?:-\d+\.\d+\.\d+)?\.mcpb$/.exec(base);
  return match ? `${match[1]}.mcpb` : "mindmake-brain-module.mcpb";
}

export async function renewDownload(token: string, deps: {
  key: string; secret: string;
  find: (id: string) => Promise<Pick<Purchase, "status" | "file_path"> | null>;
  sign: (file: string, seconds: number) => Promise<string>;
  /** A company module's research file, when this purchase has one. Never fails the module download. */
  signResearch?: (id: string, file: string, seconds: number) => Promise<string | null>;
}) {
  stripeMode(deps.key);
  const id = await verifyDownloadToken(token, deps.secret);
  const purchase = await deps.find(id);
  if (!purchase || purchase.status !== "paid") throw new KitError(403, "Download unavailable");
  const research = deps.signResearch ? await deps.signResearch(id, purchase.file_path, 7 * 24 * 60 * 60).catch(() => null) : null;
  return { url: await deps.sign(purchase.file_path, 7 * 24 * 60 * 60), ...(research ? { research_url: research } : {}) };
}
