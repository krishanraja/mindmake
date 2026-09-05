/**
 * send-follow-ups
 *
 * The second and last email a lead ever receives. Runs daily from pg_cron and
 * sends anything whose fourteen days are up.
 *
 * The two-email cap is a promise on the public pages, so the mechanics keep it
 * honest: one queue row per address per journey, a deterministic idempotency
 * key so a retry cannot duplicate, sent_at written only when the provider
 * accepted, and the row purged a week later.
 *
 * Deploy with verify_jwt false and guard on the cron header, which is how the
 * project's other scheduled functions are called.
 */

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendResendEmail } from "../_shared/http/resend.ts";

const BATCH = 50;
const MAX_ATTEMPTS = 3;

const SUBJECT = "The better version of our offer";

const bodyText = (startUrl: string) => [
  "Two weeks ago you asked us to read your business, and we sent you what we found.",
  "",
  "Since then we have made the offer sharper: one result, read in private, and a fixed price agreed",
  "up front rather than a scope that grows. If the timing is better now, reply to this email and",
  "we will pick up where your read left off.",
  "",
  `You can also start again with fresh numbers here: ${startUrl}`,
  "",
  "This is the last email we will send you.",
  "",
  "Mindmake",
].join("\n");

const bodyHtml = (startUrl: string) => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${SUBJECT}</title></head>
<body style="margin:0;background:#0a100d;color:#e6ede8;font:16px/1.6 Georgia,serif">
<div style="max-width:560px;margin:0 auto;padding:32px 22px">
<p style="margin:0 0 24px;font:600 13px/1 Arial,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:#788c82">Mindmake</p>
<p style="margin:0 0 16px;color:#b0c0b7">Two weeks ago you asked us to read your business, and we sent you what we found.</p>
<p style="margin:0 0 16px;color:#b0c0b7">Since then we have made the offer sharper: one result, read in private, and a fixed price agreed up front rather than a scope that grows. If the timing is better now, reply to this email and we will pick up where your read left off.</p>
<p style="margin:0 0 24px"><a href="${startUrl}" style="color:#7fe3b4">Start again with fresh numbers</a></p>
<p style="margin:24px 0 0;font:400 13px/1.5 Arial,sans-serif;color:#788c82">This is the last email we will send you.</p>
</div></body></html>`;

interface QueueRow {
  id: string;
  email: string;
  attempts: number;
}

Deno.serve(async (request) => {
  const expected = Deno.env.get("MINDMAKE_CRON_SECRET")?.trim();
  const presented = request.headers.get("x-mindmake-cron-secret")?.trim();
  if (!expected || presented !== expected) {
    return new Response(JSON.stringify({ error: "forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const from = Deno.env.get("MINDMAKE_BRIEF_FROM");
  const operatorEmail = Deno.env.get("MINDMAKE_OPERATOR_EMAIL");
  const publicUrl = Deno.env.get("MINDMAKE_PUBLIC_URL") ?? "https://mindmake.co";
  if (!supabaseUrl || !serviceRoleKey || !from || !operatorEmail) {
    return new Response(JSON.stringify({ error: "service_unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } });
  const startUrl = `${publicUrl.replace(/\/$/, "")}/?start=1`;

  const { data, error } = await supabase
    .from("follow_up_queue")
    .select("id, email, attempts")
    .is("sent_at", null)
    .lte("send_after", new Date().toISOString())
    .lt("attempts", MAX_ATTEMPTS)
    .order("send_after", { ascending: true })
    .limit(BATCH);

  if (error) {
    console.error("[send-follow-ups] read queue", error.message);
    return new Response(JSON.stringify({ error: "queue_unavailable" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }

  const rows = (data ?? []) as QueueRow[];
  let sent = 0;
  let failed = 0;

  for (const row of rows) {
    const result = await sendResendEmail(
      {
        from,
        to: [row.email],
        reply_to: operatorEmail,
        subject: SUBJECT,
        html: bodyHtml(startUrl),
        text: bodyText(startUrl),
      },
      // Keyed on the row, so a retried run can never send twice.
      { label: "mindmake-follow-up", idempotencyKey: `mindmake-follow-up/${row.id}` },
    );

    if (result.ok) {
      sent += 1;
      await supabase
        .from("follow_up_queue")
        .update({ sent_at: new Date().toISOString(), attempts: row.attempts + 1 })
        .eq("id", row.id);
    } else {
      failed += 1;
      // Counted, so a permanently bad address stops after three tries rather
      // than becoming a recurring send.
      await supabase
        .from("follow_up_queue")
        .update({ attempts: row.attempts + 1 })
        .eq("id", row.id);
    }
  }

  const { error: purgeError } = await supabase.rpc("mindmake_purge_follow_ups");
  if (purgeError) console.error("[send-follow-ups] purge", purgeError.message);

  return new Response(JSON.stringify({ due: rows.length, sent, failed }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
