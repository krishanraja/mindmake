// Mindmaker submit-intake
// Inserts a pre-session intake row, then emails Krish a researched digest via the unified
// lead pipeline (previously a plain-text monospace brief). Deploy with verify_jwt = false.
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, RESEND_API_KEY + enrichment keys are platform-injected.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, json, handlePreflight } from "../_shared/http/cors.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromIntake } from "../_shared/lead/adapters.ts";

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;

  try {
    const body = await req.json();

    // Honeypot: bots fill hidden fields. Pretend success, store nothing, send nothing.
    if (body.website && String(body.website).trim().length > 0) {
      return json({ ok: true });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const row = {
      source: body.source ?? "intake",
      client_slug: body.client_slug ?? null,
      name: body.name ?? null,
      role: body.role ?? null,
      company: body.company ?? null,
      email: body.email ?? null,
      link: body.link ?? null,
      seat: body.seat ?? null,
      confidence_now: body.confidence_now ?? null,
      business_oneliner: body.business_oneliner ?? null,
      north_star: body.north_star ?? null,
      value_frame: body.value_frame ?? null,
      wish: body.wish ?? null,
      anything_else: body.anything_else ?? null,
      responses: body.responses ?? null,
      meta: body.meta ?? null,
    };

    const { error } = await supabase.from("intake_submissions").insert(row);
    if (error) throw error;

    // Research + email Krish the digest in the background.
    await dispatchLead(fromIntake(body), { depth: "full" });

    return json({ ok: true });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
