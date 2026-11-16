import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { kits } from "../../../src/content/kits.ts";
import { checkout, KitError } from "../_shared/kits/core.ts";
import { allowedOrigin, env, failure, json, limitedBody, mapping, publicOrigin, stripeClient } from "../_shared/kits/runtime.ts";

serve(async request => {
  let origin: string | undefined;
  try {
    origin = allowedOrigin(request);
    if (request.method === "OPTIONS") return json(null, 200, origin);
    if (request.method !== "POST") throw new KitError(405, "Method not allowed");
    const stripe = stripeClient();
    let input: unknown;
    try { input = JSON.parse(await limitedBody(request, 2048)); } catch (error) { if (error instanceof KitError) throw error; throw new KitError(400, "Invalid request"); }
    return json(await checkout(input, {
      key: env("STRIPE_SECRET_KEY"), origin: publicOrigin(), catalogue: kits, prices: mapping("KITS_STRIPE_PRICES_JSON"),
      retrievePrice: id => stripe.prices.retrieve(id),
      createSession: (params, options) => stripe.checkout.sessions.create(params, options),
    }), 200, origin);
  } catch (error) { return failure(error, origin); }
});
