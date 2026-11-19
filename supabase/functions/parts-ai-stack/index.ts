// The operator's own build of a company's AI-stack research file, for a hand rebuild or a test.
// Service role only: never called from a browser.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { buildAndStore } from "../_shared/ai-stack/store.ts";
import { database, env, json, limitedBody } from "../_shared/kits/runtime.ts";

serve(async (request) => {
  try {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const service = env("SUPABASE_SERVICE_ROLE_KEY");
    if (!service || request.headers.get("authorization") !== `Bearer ${service}`) return json({ error: "Not allowed" }, 403);
    let input: { company?: string; domain?: string; related?: string[]; purchase_id?: string };
    try { input = JSON.parse(await limitedBody(request, 4096)); } catch { return json({ error: "Invalid request" }, 400); }
    const owner = input.purchase_id && /^[0-9a-f-]{36}$/i.test(input.purchase_id) ? input.purchase_id : `operator/${new Date().toISOString().replace(/[:.]/g, "-")}`;
    return json(await buildAndStore(database(), { company: input.company ?? "", domain: input.domain ?? "", related: input.related }, `research/ai-stack/${owner}.json`, env("BUILTWITH_API_KEY") || undefined));
  } catch (error) {
    return json({ error: error instanceof Error && /valid domain|company's name|Nothing public/.test(error.message) ? error.message : "Research unavailable" }, 422);
  }
});
