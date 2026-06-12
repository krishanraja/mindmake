// supabase/functions/submit-testimonial/index.ts
// Public submit endpoint for the Mindmaker testimonial page.
// Inserts a row into public.testimonials and emails the notify address.
// Deploy with verify_jwt = false (it is a public, unauthenticated form).

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  let body: any;
  try { body = await req.json(); } catch { return json({ error: "bad json" }, 400); }

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

  const { data, error } = await supabase
    .from("testimonials").insert(row).select("id").single();

  if (error) {
    console.error("insert error", error.message);
    return json({ error: "could not save" }, 500);
  }

  // Email is best-effort. A failed email must not lose the saved row.
  try { await notify(row, data?.id); }
  catch (e) { console.error("email failed", String(e)); }

  return json({ ok: true, id: data?.id });
});

function str(v: unknown) { return typeof v === "string" && v.trim() ? v.trim() : null; }
function numOrNull(v: unknown) { const n = Number(v); return Number.isFinite(n) ? Math.round(n) : null; }
function json(o: unknown, status = 200) {
  return new Response(JSON.stringify(o), { status, headers: { ...cors, "Content-Type": "application/json" } });
}

async function notify(row: any, id?: string) {
  const key = Deno.env.get("RESEND_API_KEY");
  const to = Deno.env.get("NOTIFY_EMAIL") ?? "krish@themindmaker.ai";
  const from = Deno.env.get("FROM_EMAIL") ?? "Mindmaker Reflections <reflections@themindmaker.ai>";
  if (!key) { console.warn("RESEND_API_KEY not set, skipping email"); return; }

  const r = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: row.email ? [row.email] : undefined,
      subject: `New reflection${row.name ? ` from ${row.name}` : ""}${row.client_slug ? ` (${row.client_slug})` : ""}`,
      text: transcript(row, id),
    }),
  });
  if (!r.ok) console.error("resend error", r.status, await r.text());
}

function transcript(row: any, id?: string) {
  const L: string[] = [];
  L.push("MINDMAKER reflection");
  if (row.name) L.push(`From: ${row.name}${row.role ? `, ${row.role}` : ""}${row.company ? ` (${row.company})` : ""}`);
  if (row.email) L.push(`Email: ${row.email}`);
  if (row.link) L.push(`Link: ${row.link}`);
  L.push(`Client: ${row.client_slug ?? "-"}   Source: ${row.source ?? "-"}`);
  if (row.confidence_before != null && row.confidence_after != null)
    L.push(`Confidence: ${row.confidence_before} to ${row.confidence_after} (out of 10)`);
  if (row.nps != null) L.push(`Would recommend: ${row.nps}/10`);
  if (row.rating != null) L.push(`Overall: ${row.rating}/5`);
  const permMap: Record<string, string> = { free: "Use freely", edits: "Use, run edits past me first", private: "Keep private" };
  L.push(`Permission: ${row.permission ? permMap[row.permission] : "(not set)"}   Reference/video: ${row.willing_reference ? "yes" : "no"}`);
  L.push("");
  for (const r of (row.responses ?? [])) {
    if (r.type === "scale" || r.type === "nps" || r.type === "rating") continue; // already summarised above
    L.push(String(r.eyebrow || r.stage || "").toUpperCase());
    if (r.question) L.push(r.question);
    if (r.type === "multi" || r.type === "single") {
      const picked = Array.isArray(r.picked) ? r.picked : (r.picked ? [r.picked] : []);
      L.push(picked.length ? picked.join(", ") : "(none picked)");
      if (r.more) L.push(`Added: ${r.more}`);
    } else {
      L.push(r.value && String(r.value).length ? r.value : "(skipped)");
    }
    L.push("");
  }
  L.push(`Saved as row: ${id ?? "-"}`);
  return L.join("\n");
}
