import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { kits } from "../../../src/content/kits.ts";
import { buildAndStore } from "../_shared/ai-stack/store.ts";
import { sendResendEmail } from "../_shared/http/resend.ts";
import { couponOf, downloadToken, KitError, stripeMode, webhook, type KitEvent, type Purchase } from "../_shared/kits/core.ts";
import { database, env, failure, json, limitedBody, mapping, publicOrigin, stripeClient } from "../_shared/kits/runtime.ts";

serve(async request => {
  try {
    if (request.method !== "POST") throw new KitError(405, "Method not allowed");
    const stripe = stripeClient();
    const secret = env("KITS_STRIPE_WEBHOOK_SECRET");
    if (!secret.startsWith("whsec_")) throw new KitError(503, "Webhook unavailable");
    const db = database();
    let deliveryAttempt: string | undefined;
    async function rpc<T>(name: string, args: Record<string, unknown>): Promise<T> {
      const { data, error } = await db.rpc(name, args);
      if (error) throw new KitError(503, "Purchase processing unavailable");
      return data as T;
    }
    const response = await webhook(await limitedBody(request), request.headers.get("stripe-signature"), {
      live: stripeMode(env("KITS_STRIPE_SECRET_KEY")),
      verify: async (raw, signature) => await stripe.webhooks.constructEventAsync(raw, signature, secret) as unknown as KitEvent,
      catalogue: kits, files: mapping("KITS_FILES_JSON"), origin: publicOrigin(),
      promotionCoupon: async id => couponOf(await stripe.promotionCodes.retrieve(id)),
      priorMemberClaims: async (email, sessionId) => {
        const exact = email.replace(/[\\%_]/g, character => `\\${character}`);
        const { count, error } = await db.from("kit_purchases").select("id", { count: "exact", head: true })
          .ilike("email", exact).like("payment_intent", "member\\_%").neq("session_id", sessionId);
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
    });
    return json(response);
  } catch (error) { return failure(error); }
});
