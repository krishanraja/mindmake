import { KIT_CURRENCY, KIT_PRICE_CENTS, type Kit } from "../../../../src/content/kits.ts";

export class KitError extends Error {
  constructor(public status: number, message: string) { super(message); }
}
export function requireTestKey(key: string) {
  if (!key.startsWith("sk_test_")) throw new KitError(503, "Test checkout is unavailable");
}
export interface Price { id: string; active: boolean; livemode: boolean; currency: string; unit_amount: number | null; type: string }
export interface CheckoutDeps {
  key: string; origin: string; catalogue: readonly Kit[]; prices: Record<string, string>;
  retrievePrice: (id: string) => Promise<Price>;
  createSession: (params: Record<string, unknown>, options: { idempotencyKey: string }) => Promise<{ url: string | null; livemode: boolean }>;
}
export async function checkout(input: unknown, deps: CheckoutDeps) {
  requireTestKey(deps.key);
  if (!input || typeof input !== "object") throw new KitError(400, "Invalid request");
  const { slug, requestId } = input as Record<string, unknown>;
  if (typeof slug !== "string" || typeof requestId !== "string" || !/^[0-9a-f-]{36}$/i.test(requestId)) throw new KitError(400, "Invalid request");
  const kit = deps.catalogue.find(item => item.slug === slug && item.status === "ready");
  if (!kit) throw new KitError(404, "Part is not for sale");
  const priceId = deps.prices[slug];
  if (!priceId?.startsWith("price_")) throw new KitError(503, "Part is not configured");
  const price = await deps.retrievePrice(priceId);
  if (!price.active || price.livemode || price.currency !== KIT_CURRENCY || price.unit_amount !== KIT_PRICE_CENTS || price.type !== "one_time") throw new KitError(503, "Part price is not configured");
  const session = await deps.createSession({
    mode: "payment", payment_method_types: ["card"], line_items: [{ price: priceId, quantity: 1 }],
    metadata: { kit_slug: slug, kit_price: priceId }, payment_intent_data: { metadata: { kit_slug: slug } },
    success_url: `${deps.origin}/parts/${slug}?checkout=success`, cancel_url: `${deps.origin}/parts/${slug}?checkout=cancelled`,
  }, { idempotencyKey: `kit-${slug}-${requestId}` });
  if (session.livemode || !session.url || new URL(session.url).origin !== "https://checkout.stripe.com") throw new KitError(502, "Checkout is unavailable");
  return { url: session.url };
}

export interface KitEvent {
  id: string; type: string; livemode: boolean; created: number;
  data: { object: Record<string, unknown> };
}
export interface Purchase {
  id: string; session_id: string; payment_intent: string; kit_slug: string;
  email: string; status: "paid" | "refunded"; file_path: string;
  delivery_attempt?: string;
  delivery_payload: { text: string; subject: string } | null;
}
export interface PurchaseInput {
  session_id: string; payment_intent: string; kit_slug: string; email: string; file_path: string;
}
export interface WebhookDeps {
  verify: (body: string, signature: string) => Promise<KitEvent>;
  catalogue: readonly Kit[]; files: Record<string, string>;
  record: (event: KitEvent, purchase: PurchaseInput | null, refundIntent: string | null) => Promise<string | null>;
  claimDelivery: (id: string) => Promise<Purchase | null>;
  prepareDelivery: (id: string, payload: { text: string; subject: string }) => Promise<Purchase>;
  sign: (path: string, seconds: number) => Promise<string>;
  token: (id: string) => Promise<string>; origin: string;
  send: (purchase: Purchase) => Promise<boolean>;
  finishDelivery: (id: string, success: boolean) => Promise<void>;
}

export async function webhook(raw: string, signature: string | null, deps: WebhookDeps) {
  if (!signature) throw new KitError(400, "Missing signature");
  let event: KitEvent;
  try { event = await deps.verify(raw, signature); } catch { throw new KitError(400, "Invalid signature"); }
  if (event.livemode) throw new KitError(400, "Live events are not accepted");
  if (!["checkout.session.completed", "charge.refunded"].includes(event.type)) return { received: true };
  const object = event.data.object;
  let purchase: PurchaseInput | null = null;
  let refundIntent: string | null = null;
  if (event.type === "checkout.session.completed") {
    const metadata = object.metadata as Record<string, string> | undefined;
    const kit = deps.catalogue.find(item => item.slug === metadata?.kit_slug && item.status === "ready");
    // Other products on the same Stripe account are outside this endpoint.
    if (!metadata?.kit_slug) return { received: true };
    if (!kit || object.mode !== "payment" || object.payment_status !== "paid" || object.currency !== KIT_CURRENCY || object.amount_total !== KIT_PRICE_CENTS || object.livemode !== false) throw new KitError(400, "Invalid part purchase");
    const email = (object.customer_details as { email?: string } | undefined)?.email;
    const file = deps.files[kit.slug];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || typeof object.payment_intent !== "string" || typeof object.id !== "string") throw new KitError(400, "Incomplete purchase");
    if (!file || file.includes("..") || file.startsWith("/")) throw new KitError(503, "Part file unavailable");
    purchase = { session_id: object.id, payment_intent: object.payment_intent, kit_slug: kit.slug, email, file_path: file };
  } else {
    // Only kit charges carry this metadata; it is set on the PaymentIntent.
    const metadata = object.metadata as Record<string, string> | undefined;
    if (!metadata?.kit_slug) return { received: true };
    if (typeof object.payment_intent !== "string" || typeof object.amount_refunded !== "number" || object.amount_refunded <= 0 || object.livemode !== false) throw new KitError(400, "Invalid refund");
    refundIntent = object.payment_intent;
  }
  const id = await deps.record(event, purchase, refundIntent);
  if (!id || !purchase) return { received: true };
  const claimed = await deps.claimDelivery(id);
  if (!claimed) return { received: true };
  try {
    let prepared = claimed;
    if (!prepared.delivery_payload) {
      const direct = await deps.sign(prepared.file_path, 7 * 24 * 60 * 60);
      const token = await deps.token(prepared.id);
      const renew = `${deps.origin}/parts/download#token=${encodeURIComponent(token)}`;
      prepared = await deps.prepareDelivery(id, {
        subject: `Your AI brain part: ${deps.catalogue.find(item => item.slug === purchase.kit_slug)!.name}`,
        text: `This part of your AI brain is ready to download:\n${direct}\n\nThis download link is valid for 7 days. For a fresh link, open:\n${renew}\n\nOpen the download in Claude Desktop to add it.\n\nFull refund within 14 days, no questions asked. Reply to this email for help or a refund.`,
      });
    }
    if (prepared.status === "refunded") { await deps.finishDelivery(id, false); return { received: true }; }
    if (!await deps.send(prepared)) throw new Error("Delivery pending");
    await deps.finishDelivery(id, true);
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

export async function renewDownload(token: string, deps: {
  key: string; secret: string;
  find: (id: string) => Promise<Pick<Purchase, "status" | "file_path"> | null>;
  sign: (file: string, seconds: number) => Promise<string>;
}) {
  requireTestKey(deps.key);
  const id = await verifyDownloadToken(token, deps.secret);
  const purchase = await deps.find(id);
  if (!purchase || purchase.status !== "paid") throw new KitError(403, "Download unavailable");
  return { url: await deps.sign(purchase.file_path, 7 * 24 * 60 * 60) };
}
