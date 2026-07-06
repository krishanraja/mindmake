// supabase/functions/submit-testimonial/index.ts
// Public submit endpoint for the Mindmaker testimonial page. Inserts a row into
// public.testimonials, then emails Krish a researched digest via the unified lead
// pipeline (previously a plain-text transcript). Deploy with verify_jwt = false.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { json, handlePreflight } from "../_shared/http/cors.ts";
import { dispatchLead } from "../_shared/lead/pipeline.ts";
import { fromTestimonial } from "../_shared/lead/adapters.ts";

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: any;
  try {
    body = await req.json();
  } catch {
    return json({ error: "bad json" }, 400);
  }

  // Honeypot: bots fill hidden fields. Accept silently, store nothing.
  if (body?.website) return json({ ok: true });

  if (!body || !Array.isArray(body.responses)) return json({ error: "missing responses" }, 400);

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const perm = ["free", "edits", "private"].includes(body.permission) ? body.permission : null;

  const row = {
    source: str(body.source),
    client_slug: str(body.client_slug),
    name: str(body.name),
    role: str(body.role),
    company: str(body.company),
    link: str(body.link),
    email: str(body.email),
    permission: perm,
    willing_reference: !!body.willing_reference,
    confidence_before: numOrNull(body.confidence_before),
    confidence_after: numOrNull(body.confidence_after),
    nps: numOrNull(body.nps),
    rating: numOrNull(body.rating),
    summary_line: str(body.summary_line),
    responses: Array.isArray(body.responses) ? body.responses : [],
    meta: body.meta ?? {},
  };

  const { data, error } = await supabase.from("testimonials").insert(row).select("id").single();

  if (error) {
    console.error("insert error", error.message);
    return json({ error: "could not save" }, 500);
  }

  // Email is best-effort; a failed email must not lose the saved row.
  await dispatchLead(fromTestimonial(row), { depth: "identity" });

  return json({ ok: true, id: data?.id });
});

function str(v: unknown) {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}
function numOrNull(v: unknown) {
  const n = Number(v);
  return Number.isFinite(n) ? Math.round(n) : null;
}
