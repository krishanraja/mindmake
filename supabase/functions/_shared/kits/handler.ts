import { kits } from "../../../../src/content/kits.ts";
import { buildAndStore } from "../ai-stack/store.ts";
import { sendResendEmail } from "../http/resend.ts";
import { receiptHtml, receiptText } from "./email.ts";
import { couponOf, downloadToken, KitError, stripeMode, type PurchaseInput, type Purchase, type WebhookDeps } from "./core.ts";
import { database, env, mapping, publicOrigin, stripeClient } from "./runtime.ts";

type Db = ReturnType<typeof database>;
type Stripe = ReturnType<typeof stripeClient>;

/** Everything the webhook needs except how its event is verified: shared by Stripe's webhook and the member-list loader. */
export function kitsDeps(stripe: Stripe, db: Db): Omit<WebhookDeps, "verify"> {
  let deliveryAttempt: string | undefined;
  async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
    const { data, error } = await db.rpc(name, args);
    if (error) throw new KitError(503, "Purchase processing unavailable");
    return data as T;
  }
  return {
        live: stripeMode(env("KITS_STRIPE_SECRET_KEY")),
        catalogue: kits, files: mapping("KITS_FILES_JSON"), origin: publicOrigin(),
        promotionCoupon: async id => couponOf(await stripe.promotionCodes.retrieve(id)),
        priorMemberClaims: async (email, sessionId) => {
        const { count, error } = await db.from("kit_purchases").select("id", { count: "exact", head: true })
          .eq("email_key", await emailKey(db, email)).like("payment_intent", "member\\_%").neq("session_id", sessionId);
        if (error) throw new KitError(503, "Purchase processing unavailable");
        return count ?? 0;
      },
      record: (event, purchase, refundIntent) => rpc<string | null>("kits_record_event", { p_event_id: event.id, p_event_type: event.type, p_purchase: purchase, p_refund_intent: refundIntent }),
        claimDelivery: async id => {
          const purchase = await rpc<Purchase | null>("kits_claim_delivery", { p_id: id });
          deliveryAttempt = purchase?.delivery_attempt;
          return purchase;
        },
        prepareDelivery: async (id, payload) => {
          const purchase = await rpc<Purchase | null>("kits_prepare_delivery", { p_id: id, p_payload: payload, p_attempt: deliveryAttempt });
          if (!purchase) throw new KitError(503, "Delivery lease expired");
          return purchase;
        },
        sign: async (file, seconds) => {
          const { data, error } = await db.storage.from("kits").createSignedUrl(file, seconds, { download: true });
          if (error || !data?.signedUrl) throw new KitError(503, "Download unavailable");
          return data.signedUrl;
        },
        token: id => downloadToken(id, env("KITS_DOWNLOAD_SECRET")),
        // At most 15 seconds, so Stripe hears back in time; a slower company is built by hand.
        research: async (purchase, subject) => {
          const path = `research/ai-stack/${purchase.id}.json`;
          let timer: ReturnType<typeof setTimeout> | undefined;
          try {
            await Promise.race([
              buildAndStore(db, subject, path, env("BUILTWITH_API_KEY") || undefined),
              new Promise((_, reject) => { timer = setTimeout(() => reject(new Error("Research took too long")), 15000); }),
            ]);
          } finally { clearTimeout(timer); }
          return path;
        },
        send: async purchase => {
          if (env("KITS_EMAIL_ENABLED") !== "true" || !purchase.delivery_payload) return false;
          const { data, error } = await db.from("kit_purchases").select("status").eq("id", purchase.id).eq("delivery_attempt", deliveryAttempt).single();
          if (error || data?.status !== "paid") return false;
          const result = await sendResendEmail({ from: env("MINDMAKE_BRIEF_FROM"), to: [purchase.email], subject: purchase.delivery_payload.subject, text: purchase.delivery_payload.text, ...(purchase.delivery_payload.html ? { html: purchase.delivery_payload.html } : {}) }, {
            idempotencyKey: `kit-receipt-${purchase.session_id}`, label: "kits-receipt",
          });
          return result.ok;
        },
        finishDelivery: (id, success) => rpc<void>("kits_finish_delivery", { p_id: id, p_success: success, p_attempt: deliveryAttempt }),
        notifyOperator: async (purchase, message) => {
          const to = env("MINDMAKE_OPERATOR_EMAIL");
          if (env("KITS_EMAIL_ENABLED") !== "true" || !to) return;
          await sendResendEmail({ from: env("MINDMAKE_BRIEF_FROM"), to: [to], ...message }, { idempotencyKey: `kit-operator-${purchase.session_id}`, label: "kits-operator" });
        },
      // Who may use the makeyourmindup codes: the loaded Substack list, matched on the normalised address.
      memberTier: async email => {
        // Until the first list is loaded there is nothing to check against, so codes work as they did before.
        const { count, error: countError } = await db.from("kit_members").select("email_key", { count: "exact", head: true });
        if (countError) throw new KitError(503, "Purchase processing unavailable");
        if (!count) return "founding";
        const { data, error } = await db.from("kit_members").select("tier").eq("email_key", await emailKey(db, email)).maybeSingle();
        if (error) throw new KitError(503, "Purchase processing unavailable");
        return (data?.tier as "paid" | "founding" | undefined) ?? null;
      },
      holdForMember: async claim => {
        const key = await emailKey(db, claim.email);
        const { error } = await db.from("kit_member_requests").upsert({ ...claim, email_key: key }, { onConflict: "session_id", ignoreDuplicates: true });
        if (error) throw new KitError(503, "Purchase processing unavailable");
        const parts = {
          preheader: "We are confirming your makeyourmindup membership.", heading: "We are confirming your membership",
          intro: "Thank you for using your makeyourmindup code. We could not find this email address among our members yet, so your brain module has not been sent.",
          notes: ["If you joined makeyourmindup with a different email address, reply to this email with it and a person will sort it out within a day.", "If you are not a member yet, you can add the module for $59 at the link below, or subscribe to makeyourmindup first.", BUYER_NOTE],
          button: { label: "See the brain modules", href: `${publicOrigin()}/brain-modules` },
          footerLinks: [{ label: "mindmake.co", href: publicOrigin() }],
        };
        const operator = env("MINDMAKE_OPERATOR_EMAIL");
        if (env("KITS_EMAIL_ENABLED") !== "true") return;
        await sendResendEmail({ from: env("MINDMAKE_BRIEF_FROM"), to: [claim.email], subject: "We are confirming your membership", text: receiptText(parts), html: receiptHtml(parts) }, { idempotencyKey: `kit-hold-${claim.session_id}`, label: "kits-hold" });
        if (operator) await sendResendEmail({ from: env("MINDMAKE_BRIEF_FROM"), to: [operator], subject: "A free brain module claim needs a member check",
          text: `${claim.email} used ${claim.coupon === "mymu-founding-member" ? "MAKEMYMINDUP-FOREVER" : "MAKEMYMINDUP"} for ${claim.kit_slug} and is not on the loaded makeyourmindup member list.\n\nIf they are a member, load a fresh Substack export (it releases every waiting claim at once). If not, nothing more to do: they were told how to buy it.` }, { idempotencyKey: `kit-hold-operator-${claim.session_id}`, label: "kits-hold-operator" });
      },
  };
}

async function emailKey(db: Db, email: string): Promise<string> {
  const { data, error } = await db.rpc("kits_email_key", { p_email: email });
  if (error || typeof data !== "string") throw new KitError(503, "Purchase processing unavailable");
  return data;
}
const BUYER_NOTE = "You will never get marketing emails from us.";
