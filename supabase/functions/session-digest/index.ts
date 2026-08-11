/**
 * @file session-digest Edge Function
 * @description Final back-end piece of the Diagnosis Room. When a session reaches a
 *   meaningful end, the front-end POSTs the full session here so we can (a) email Krish the
 *   FULL intelligence and (b) if the visitor opted in and a proposal exists, email the visitor
 *   their proposal.
 *
 *   The Krish digest now flows through the unified lead pipeline (`processLead` +
 *   `fromSessionDigest`) so it matches every other lead notification, same shell, same
 *   dossier + internal-routing block, same transcript styling, proposal attached. The dossier
 *   is already built client-side, so the pipeline does NOT re-enrich (`enrich.skip`).
 *
 * ## Privacy split (IMPORTANT)
 * - KRISH: the full digest (contact, recommendation, decision brief, dossier INCLUDING the
 *   internal routing layer, transcript, proposal attachment). Rendered Krish-only.
 * - VISITOR: only when opted in + valid email + a proposal exists, a short warm note plus
 *   the proposal attachment. NEVER the routing block, NEVER the transcript. Sent independently:
 *   a visitor-copy failure must not fail the Krish digest.
 *
 * ## Response  200 { ok, krishEmailSent, visitorEmailSent } · 4xx/5xx { error }
 * @secrets RESEND_API_KEY
 * Rate limit: 20 req / IP / 10 min (in-memory, best-effort). Hard ceiling: REQUEST_CEILING.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import type { Dossier } from "../_shared/enrich/types.ts";
import { json, handlePreflight } from "../_shared/http/cors.ts";
import { sendResendEmail, toBase64, hasResendKey } from "../_shared/http/resend.ts";
import { esc, looksLikeEmail } from "../_shared/lead/escape.ts";
import { processLead } from "../_shared/lead/pipeline.ts";
import { fromSessionDigest } from "../_shared/lead/adapters.ts";
import type { TranscriptTurn } from "../_shared/lead/types.ts";

const VISITOR_FROM = "Mindmaker <scoping@themindmaker.ai>";
const KRISH_TO = "krish@themindmaker.ai";

// Simple in-memory abuse controls (per cold start), best-effort.
const rateLimit = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 20;
let totalServed = 0;
const REQUEST_CEILING = 5000;

interface Contact {
  name?: string;
  email?: string;
  company?: string;
}

interface DigestRequest {
  dossier?: Dossier | null;
  decisionBrief?: {
    realDecision?: string;
    paths?: { name?: string; tradeoff?: string }[];
    weakAssumption?: string;
    next14Days?: string | string[];
  } | null;
  recommendation?: { mode?: string; rung?: string; range?: string; exit?: string } | null;
  transcript?: TranscriptTurn[];
  contact?: Contact;
  proposalId?: string;
  proposalHtml?: string;
  endedVia?: "chat" | "book-call" | "proposal";
  userOptInCopy?: boolean;
}

/** Build the SHORT, warm covering note emailed to the visitor (no routing, no transcript). */
function buildVisitorHtml(contact: Contact): string {
  const firstName = (contact?.name || "").trim().split(/\s+/)[0];
  const greeting = firstName ? `Hi ${esc(firstName)},` : "Hi,";
  return `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.65;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px;background:#ffffff;">
  <p style="margin:0 0 14px 0;font-size:15px;">${greeting}</p>
  <p style="margin:0 0 14px 0;font-size:15px;">Thanks for spending a bit of time in the diagnosis room. Your proposal is attached as a one-pager you can open in any browser.</p>
  <p style="margin:0 0 14px 0;font-size:15px;">It is a starting point, not a fixed quote. The number gets set on a call once we have looked at the real shape of the work. If it reads right, reply to this email and we will find a time.</p>
  <p style="margin:18px 0 0 0;font-size:15px;">Krish</p>
  <p style="margin:2px 0 0 0;font-size:13px;color:#888;">Mindmaker</p>
</body></html>`;
}

serve(async (req: Request): Promise<Response> => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;
  if (req.method !== "POST") return json({ error: "Method not allowed." }, 405);

  if (totalServed >= REQUEST_CEILING) {
    return json({ error: "High demand right now. Try again later." }, 429);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.windowStart > RATE_WINDOW_MS) {
    rateLimit.set(ip, { count: 1, windowStart: now });
  } else {
    entry.count += 1;
    if (entry.count > RATE_MAX) return json({ error: "Too many requests. Try again in a few minutes." }, 429);
  }

  if (!hasResendKey()) {
    console.error("[session-digest] RESEND_API_KEY missing or invalid");
    return json({ error: "Email service is not configured." }, 503);
  }

  let body: DigestRequest;
  try {
    body = (await req.json()) as DigestRequest;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  if (!body || typeof body !== "object") return json({ error: "Invalid request body." }, 400);

  const transcript = Array.isArray(body.transcript) ? body.transcript : [];
  const hasTranscript = transcript.some((t) => t && typeof t.content === "string" && t.content.trim().length > 0);
  const hasBrief = !!body.decisionBrief && typeof body.decisionBrief === "object";
  if (!hasTranscript && !hasBrief) {
    return json({ error: "Nothing to digest: a transcript or a decisionBrief is required." }, 400);
  }

  const contact: Contact = body.contact && typeof body.contact === "object" ? body.contact : {};

  // ── 1) Krish digest (primary), through the unified pipeline (no re-enrichment). ──
  let krishEmailSent = false;
  try {
    const { sent } = await processLead(fromSessionDigest({ ...body, transcript, contact }));
    krishEmailSent = sent;
  } catch (e) {
    console.error("[session-digest] Krish digest exception:", (e as Error).message);
  }

  // ── 2) Visitor copy (only if opted in + valid email + a proposal exists). ──
  let visitorEmailSent = false;
  const wantsCopy =
    body.userOptInCopy === true &&
    looksLikeEmail(contact.email) &&
    typeof body.proposalHtml === "string" &&
    body.proposalHtml.trim().length > 0;
  if (wantsCopy) {
    try {
      const res = await sendResendEmail(
        {
          from: VISITOR_FROM,
          to: [contact.email as string],
          reply_to: KRISH_TO,
          subject: "Your Mindmaker proposal",
          html: buildVisitorHtml(contact),
          attachments: [
            { filename: `proposal-${body.proposalId || "mindmaker"}.html`, content: toBase64(body.proposalHtml as string) },
          ],
        },
        { label: "session-digest:visitor" },
      );
      visitorEmailSent = res.ok;
    } catch (e) {
      console.error("[session-digest] Visitor copy exception:", (e as Error).message);
    }
  }

  totalServed += 1;

  if (!krishEmailSent) {
    return json({ error: "Failed to send the session digest.", krishEmailSent, visitorEmailSent }, 502);
  }
  return json({ ok: true, krishEmailSent, visitorEmailSent });
});
