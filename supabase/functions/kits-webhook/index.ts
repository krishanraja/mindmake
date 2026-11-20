import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { KitError, stripeMode, webhook, type KitEvent } from "../_shared/kits/core.ts";
import { kitsDeps } from "../_shared/kits/handler.ts";
import { database, env, failure, json, limitedBody, stripeClient } from "../_shared/kits/runtime.ts";

serve(async request => {
  try {
    if (request.method !== "POST") throw new KitError(405, "Method not allowed");
    const stripe = stripeClient();
    const secret = env("KITS_STRIPE_WEBHOOK_SECRET");
    if (!secret.startsWith("whsec_")) throw new KitError(503, "Webhook unavailable");
    const db = database();
    const deps = kitsDeps(stripe, db);
    const response = await webhook(await limitedBody(request), request.headers.get("stripe-signature"), {
      ...deps,
      verify: async (raw, signature) => await stripe.webhooks.constructEventAsync(raw, signature, secret) as unknown as KitEvent,
    });
    return json(response);
  } catch (error) { return failure(error); }
});
