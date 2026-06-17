// Mindmaker submit-intake
// Inserts a pre-session intake row and emails Krish a readable brief.
// Deploy with verify_jwt = false. Mirrors submit-testimonial.
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY and RESEND_API_KEY are injected by the platform.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FROM = "Mindmaker Intake <intake@themindmaker.ai>";
const TO = "krish@themindmaker.ai";

function pickedList(entry: any): string {
  const p = Array.isArray(entry?.picked) ? entry.picked : (entry?.picked ? [entry.picked] : []);
  return p.length ? p.join(", ") : "(skipped)";
}

function pickedByKey(b: any, key: string): string | null {
  const resp = Array.isArray(b.responses) ? b.responses : [];
  const e = resp.find((r: any) => r.key === key);
  if (!e) return null;
  const v = pickedList(e);
  return v === "(skipped)" ? null : v;
}

function buildBrief(b: any): string {
  const L: string[] = [];
  const who = [b.name, b.role].filter(Boolean).join(", ");
  L.push("MINDMAKER PRE-SESSION INTAKE");
  L.push(who + (b.company ? `  (${b.company})` : ""));
  if (b.email) L.push(`Email: ${b.email}`);
  if (b.link) L.push(`Link: ${b.link}`);
  L.push("");
  const aspiration = pickedByKey(b, "aspiration");
  L.push("SNAPSHOT");
  if (b.seat) L.push(`Seat: ${b.seat}`);
  if (b.confidence_now != null) L.push(`AI confidence today: ${b.confidence_now}/10`);
  if (b.value_frame) L.push(`"Worth it" looks like: ${b.value_frame}`);
  if (aspiration) L.push(`Where they want to be in a year: ${aspiration}`);
  L.push("");
  if (b.business_oneliner) { L.push("WHAT THEY DO"); L.push(b.business_oneliner); L.push(""); }
  if (b.north_star) { L.push("THE ONE THING THIS HAS TO NAIL"); L.push(b.north_star); L.push(""); }
  const handoff = pickedByKey(b, "handoff");
  if (handoff) { L.push("WHAT ONLY THEY SHOULD BE DOING (role-aware)"); L.push(handoff); L.push(""); }
  if (b.wish) { L.push("WISH THEY COULD DO BUT CAN'T"); L.push(b.wish); L.push(""); }

  // The picture: remaining chip answers (aspiration + handoff are featured above).
  const resp = Array.isArray(b.responses) ? b.responses : [];
  const chipQs = resp.filter((e: any) => (e.type === "multi" || e.type === "single") && e.key !== "aspiration" && e.key !== "handoff");
  if (chipQs.length) {
    L.push("THE PICTURE");
    for (const e of chipQs) {
      L.push(`- ${e.eyebrow}: ${pickedList(e)}`);
      if (e.more) L.push(`    added: ${e.more}`);
    }
    L.push("");
  }
  if (b.anything_else) { L.push("ANYTHING ELSE"); L.push(b.anything_else); L.push(""); }
  return L.join("\n");
}

function briefHtml(b: any): string {
  const esc = (s: string) => (s || "").replace(/[&<>]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[m] as string));
  const text = buildBrief(b);
  return `<div style="font-family:ui-monospace,Menlo,monospace;font-size:13px;line-height:1.55;color:#0e1512;white-space:pre-wrap">${esc(text)}</div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const body = await req.json();

    // Honeypot: bots fill hidden fields. Pretend success, store nothing.
    if (body.website && String(body.website).trim().length > 0) {
      return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
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

    // Email Krish the brief. Non-fatal if it fails.
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (resendKey) {
      const subj = `Intake: ${body.name || "someone"}${body.company ? ` · ${body.company}` : ""}`;
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: FROM, to: [TO], reply_to: body.email || undefined,
            subject: subj, text: buildBrief(body), html: briefHtml(body),
          }),
        });
      } catch (_e) { /* email is best effort */ }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...cors, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: String(e) }), { status: 400, headers: { ...cors, "Content-Type": "application/json" } });
  }
});
