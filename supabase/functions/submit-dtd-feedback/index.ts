/**
 * Receives the DoThinkDo staff feedback form at mindmake.co/feedback/dtd and
 * emails it to the operator. Nothing is stored: the email is the record.
 *
 * @secrets RESEND_API_KEY, MINDMAKE_BRIEF_FROM, MINDMAKE_ALLOWED_ORIGINS, DTD_FEEDBACK_TO
 */

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { sendResendEmail } from "../_shared/http/resend.ts";
import { BODY_LIMIT_BYTES, FeedbackValidationError, parseDtdFeedback, renderFeedbackEmail } from "./core.ts";

const ALLOWED_REQUEST_HEADERS = "authorization, x-client-info, apikey, content-type";
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 10;

/* Per-isolate limit: enough to stop a loop hammering the mailbox, and a cold
   isolate starting again at zero is acceptable for a form this small. */
const recent = new Map<string, number[]>();

const isEmail = (value: string | undefined): value is string =>
  Boolean(value && value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value));

const isSafeSender = (value: string | undefined): value is string =>
  Boolean(value && value.length <= 320 && !/[\r\n]/.test(value) && /^[^<>]{1,100}<[^\s@]+@[^\s@]+\.[^\s@]+>$/.test(value));

const allowedOrigins = (): Set<string> =>
  new Set((Deno.env.get("MINDMAKE_ALLOWED_ORIGINS") ?? "").split(",").map((item) => item.trim()).filter(Boolean));

const corsHeaders = (origin: string | null): Record<string, string> =>
  origin
    ? {
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": ALLOWED_REQUEST_HEADERS,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Max-Age": "600",
      Vary: "Origin",
    }
    : { Vary: "Origin" };

const json = (body: unknown, status: number, origin: string | null): Response =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

function overLimit(key: string, now: number): boolean {
  const hits = (recent.get(key) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  hits.push(now);
  recent.set(key, hits);
  return hits.length > RATE_MAX;
}

async function readBody(request: Request): Promise<unknown> {
  const text = await request.text();
  if (new TextEncoder().encode(text).byteLength > BODY_LIMIT_BYTES) throw new FeedbackValidationError("Too large");
  try {
    return JSON.parse(text);
  } catch {
    throw new FeedbackValidationError("Invalid JSON");
  }
}

export async function handleDtdFeedback(request: Request): Promise<Response> {
  const requestOrigin = request.headers.get("origin");
  const origin = requestOrigin && allowedOrigins().has(requestOrigin) ? requestOrigin : null;

  if (request.method === "OPTIONS") return new Response(null, { status: origin ? 204 : 403, headers: corsHeaders(origin) });
  if (request.method !== "POST") return json({ ok: false, error: "method_not_allowed" }, 405, origin);
  if (!origin) return json({ ok: false, error: "origin_not_allowed" }, 403, null);

  const from = Deno.env.get("MINDMAKE_BRIEF_FROM")?.trim();
  const to = Deno.env.get("DTD_FEEDBACK_TO")?.trim().toLowerCase();
  if (!isSafeSender(from) || !isEmail(to)) {
    console.error("[submit-dtd-feedback] sender or recipient is not configured");
    return json({ ok: false, error: "not_configured" }, 503, origin);
  }

  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (overLimit(client, Date.now())) return json({ ok: false, error: "rate_limited" }, 429, origin);

  let feedback;
  try {
    feedback = parseDtdFeedback(await readBody(request));
  } catch (error) {
    if (error instanceof FeedbackValidationError) return json({ ok: false, error: "invalid", message: error.message }, 400, origin);
    throw error;
  }
  if (!feedback) return json({ ok: true }, 200, origin);

  const email = renderFeedbackEmail(feedback, new Date());
  const result = await sendResendEmail({ from, to: [to], subject: email.subject, text: email.text, html: email.html }, {
    label: "submit-dtd-feedback",
    idempotencyKey: `dtd-feedback-${crypto.randomUUID()}`,
  });
  if (!result.ok) return json({ ok: false, error: "send_failed" }, 502, origin);
  return json({ ok: true }, 200, origin);
}

serve(handleDtdFeedback);
