// Builds one company's AI-stack research file and keeps it in the private kits bucket.
// Service role only: called by Mindmake's own purchase flow, never from a browser.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { buildAiStack } from "../_shared/ai-stack/build.ts";
import { get } from "../_shared/ai-stack/http.ts";
import { database, env, json, limitedBody } from "../_shared/kits/runtime.ts";

serve(async (request) => {
  try {
    if (request.method !== "POST") return json({ error: "Method not allowed" }, 405);
    const service = env("SUPABASE_SERVICE_ROLE_KEY");
    if (!service || request.headers.get("authorization") !== `Bearer ${service}`) return json({ error: "Not allowed" }, 403);
    let input: { company?: string; domain?: string; related?: string[]; purchase_id?: string };
    try { input = JSON.parse(await limitedBody(request, 4096)); } catch { return json({ error: "Invalid request" }, 400); }
    const pack = await buildAiStack({ company: input.company ?? "", domain: input.domain ?? "", related: input.related }, { get, now: () => new Date(), builtwithKey: env("BUILTWITH_API_KEY") || undefined });
    const path = `research/ai-stack/${input.purchase_id && /^[0-9a-f-]{36}$/i.test(input.purchase_id) ? input.purchase_id : pack.company.domain}/${pack.built_at.replace(/[:.]/g, "-")}.json`;
    const { error } = await database().storage.from("kits").upload(path, new Blob([JSON.stringify(pack, null, 2)], { type: "application/json" }), { upsert: false });
    if (error) return json({ error: "Could not store the research" }, 503);
    const ai = pack.rows.filter((r) => r.category !== "Supporting stack");
    return json({ path, rows: pack.rows.length, ai_rows: ai.length, methods_run: pack.methods.filter((m) => m.ran).length, technology_data: pack.methods.find((m) => m.id === "technographic")?.ran ?? false });
  } catch (error) {
    return json({ error: error instanceof Error && /valid domain|company's name|Nothing public/.test(error.message) ? error.message : "Research unavailable" }, 422);
  }
});
