/**
 * @file session-digest Edge Function
 * @description Final back-end piece of the Diagnosis Room (the on-site experience where
 *              "Mindy" diagnoses a visitor's nervous AI decision and may generate a one-page
 *              proposal). When a session reaches a meaningful end (a booked call, a generated
 *              proposal, or a substantive chat), the front-end POSTs the full session here so
 *              we can (a) email Krish the FULL intelligence from the session, and (b) if the
 *              visitor opted in, email the visitor their own copy of the proposal.
 *
 * ## Request (POST JSON)
 * {
 *   dossier?:        Dossier | null,                                   // company enrichment dossier
 *   decisionBrief?:  { realDecision, paths:[{name,tradeoff}], weakAssumption, next14Days } | null,
 *   recommendation?: { mode, rung, range, exit } | null,              // the routed offer
 *   transcript:      { role:'user'|'assistant', content:string }[],   // the Mindy conversation
 *   contact:         { name?: string, email?: string, company?: string },
 *   proposalId?:     string,
 *   proposalHtml?:   string,                                          // generated one-pager HTML, if any
 *   endedVia?:       'chat' | 'book-call' | 'proposal',
 *   userOptInCopy?:  boolean                                          // visitor ticked "email me a copy"
 * }
 *
 * ## Response
 *   200 { ok: true, krishEmailSent: boolean, visitorEmailSent: boolean }
 *   4xx/5xx { error: string }
 *
 * ## Privacy split (IMPORTANT)
 * - KRISH (internal digest) receives EVERYTHING: contact, recommendation, decision brief,
 *   the full dossier INCLUDING the internal routing layer (`scale`: employeeCount, sizeBand,
 *   trancoRank, icp, recommendedMode), the synthesis, and the FULL transcript. The proposal
 *   (if any) rides along as an HTML attachment.
 * - The VISITOR (only when they opted in, supplied a valid email, and a proposal exists)
 *   receives ONLY their proposal as an attachment plus a short warm note in Krish's voice.
 *   The visitor copy NEVER contains the internal routing block and NEVER contains the raw
 *   transcript. The `scale` layer is routing-only and must never be flexed back at the user.
 *
 * The two emails are sent independently: a failure to send the visitor copy must not fail
 * the Krish digest. Partial success is reported in the response.
 *
 * @secrets RESEND_API_KEY
 * Rate limit: 20 requests / IP / 10 min (in-memory, best-effort). Hard ceiling: REQUEST_CEILING.
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import type { Dossier } from "../_shared/enrich/types.ts";

// ── conventions: CORS + json helper (matched to the sibling functions) ────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ── config ────────────────────────────────────────────────────────────────────────

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY") || "";

// Addresses lifted from notify-scoping-request (the existing Resend pattern).
const KRISH_TO = "krish@themindmaker.ai";
const DIGEST_FROM = "Mindmaker Diagnosis Room <scoping@themindmaker.ai>";
const VISITOR_FROM = "Mindmaker <scoping@themindmaker.ai>";

// Simple in-memory abuse controls (per cold start), best-effort.
const rateLimit = new Map<string, { count: number; windowStart: number }>();
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 20; // 20 requests / IP / window

// Global circuit breaker: refuse new work past this many served calls since cold start.
let totalServed = 0;
const REQUEST_CEILING = 5000;

// ── types ───────────────────────────────────────────────────────────────────────

type Role = "user" | "assistant";

interface TranscriptTurn {
  role: Role;
  content: string;
}

interface DecisionBrief {
  realDecision?: string;
  paths?: { name?: string; tradeoff?: string }[];
  weakAssumption?: string;
  next14Days?: string | string[];
}

interface Recommendation {
  mode?: string;
  rung?: string;
  range?: string;
  exit?: string;
}

interface Contact {
  name?: string;
  email?: string;
  company?: string;
}

interface DigestRequest {
  dossier?: Dossier | null;
  decisionBrief?: DecisionBrief | null;
  recommendation?: Recommendation | null;
  transcript?: TranscriptTurn[];
  contact?: Contact;
  proposalId?: string;
  proposalHtml?: string;
  endedVia?: "chat" | "book-call" | "proposal";
  userOptInCopy?: boolean;
}

interface ResendAttachment {
  filename: string;
  content: string; // base64
}

// ── helpers ─────────────────────────────────────────────────────────────────────

/** HTML-escape any interpolated user/transcript content to prevent injection. */
const esc = (str: unknown): string => {
  if (str === undefined || str === null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

/** Light email sanity check (intentionally permissive, not RFC-strict). */
const looksLikeEmail = (v: unknown): v is string =>
  typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Encode a string as base64 without blowing the call stack on large buffers. */
const toBase64 = (input: string): string => {
  const bytes = new TextEncoder().encode(input);
  let binary = "";
  const chunk = 0x8000; // 32k chars at a time
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
};

/** Normalise next14Days, which may arrive as a string or string[]. */
const next14DaysToHtml = (next14Days: DecisionBrief["next14Days"]): string => {
  if (!next14Days) return "";
  if (Array.isArray(next14Days)) {
    const items = next14Days
      .filter((s) => typeof s === "string" && s.trim())
      .map((s) => `<li style="margin:2px 0;">${esc(s)}</li>`)
      .join("");
    return items ? `<ul style="margin:6px 0 0 0;padding-left:20px;">${items}</ul>` : "";
  }
  return `<div style="white-space:pre-wrap;">${esc(next14Days)}</div>`;
};

// ── email body builders ────────────────────────────────────────────────────────

/** Build the FULL internal digest emailed to Krish. Contains routing + transcript. */
function buildKrishHtml(req: DigestRequest): string {
  const { dossier, decisionBrief, recommendation, transcript, contact, proposalId, endedVia } = req;
  const blocks: string[] = [];

  // Contact
  blocks.push(`
    <div style="margin-top:18px;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Contact</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 0;color:#666;width:120px;">Name</td><td style="padding:4px 0;">${esc(contact?.name) || "(not given)"}</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Email</td><td style="padding:4px 0;">${
          looksLikeEmail(contact?.email)
            ? `<a href="mailto:${esc(contact?.email)}" style="color:#0e1a2b;">${esc(contact?.email)}</a>`
            : "(not given)"
        }</td></tr>
        <tr><td style="padding:4px 0;color:#666;">Company</td><td style="padding:4px 0;">${esc(contact?.company) || "(not given)"}</td></tr>
      </table>
    </div>`);

  // Ended via + recommendation
  const recRows: string[] = [];
  if (recommendation?.mode) recRows.push(`<tr><td style="padding:4px 0;color:#666;width:120px;">Mode</td><td style="padding:4px 0;font-weight:600;">${esc(recommendation.mode)}</td></tr>`);
  if (recommendation?.rung) recRows.push(`<tr><td style="padding:4px 0;color:#666;">Rung</td><td style="padding:4px 0;">${esc(recommendation.rung)}</td></tr>`);
  if (recommendation?.range) recRows.push(`<tr><td style="padding:4px 0;color:#666;">Range</td><td style="padding:4px 0;">${esc(recommendation.range)}</td></tr>`);
  if (recommendation?.exit) recRows.push(`<tr><td style="padding:4px 0;color:#666;">Exit</td><td style="padding:4px 0;">${esc(recommendation.exit)}</td></tr>`);
  blocks.push(`
    <div style="margin-top:18px;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Session outcome</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr><td style="padding:4px 0;color:#666;width:120px;">Ended via</td><td style="padding:4px 0;font-weight:600;">${esc(endedVia || "session")}</td></tr>
        ${recRows.join("") || `<tr><td style="padding:4px 0;color:#666;">Recommendation</td><td style="padding:4px 0;">(none captured)</td></tr>`}
      </table>
    </div>`);

  // Decision brief
  if (decisionBrief) {
    const pathRows = (decisionBrief.paths || [])
      .filter((p) => p && (p.name || p.tradeoff))
      .map(
        (p) =>
          `<li style="margin:4px 0;"><strong>${esc(p.name) || "(path)"}</strong>${
            p.tradeoff ? ` — ${esc(p.tradeoff)}` : ""
          }</li>`,
      )
      .join("");
    blocks.push(`
      <div style="margin-top:18px;">
        <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Decision brief</p>
        ${decisionBrief.realDecision ? `<p style="margin:6px 0 2px 0;font-weight:600;">Real decision</p><div style="background:#fafafa;border-left:4px solid #00D9B6;padding:10px 14px;font-size:14px;white-space:pre-wrap;">${esc(decisionBrief.realDecision)}</div>` : ""}
        ${pathRows ? `<p style="margin:12px 0 2px 0;font-weight:600;">Paths</p><ul style="margin:4px 0 0 0;padding-left:20px;font-size:14px;">${pathRows}</ul>` : ""}
        ${decisionBrief.weakAssumption ? `<p style="margin:12px 0 2px 0;font-weight:600;">Weak assumption</p><div style="background:#fafafa;border-left:4px solid #e5e5e3;padding:10px 14px;font-size:14px;white-space:pre-wrap;">${esc(decisionBrief.weakAssumption)}</div>` : ""}
        ${decisionBrief.next14Days ? `<p style="margin:12px 0 2px 0;font-weight:600;">Next 14 days</p><div style="font-size:14px;">${next14DaysToHtml(decisionBrief.next14Days)}</div>` : ""}
      </div>`);
  }

  // Dossier
  if (dossier) {
    const id = dossier.identity || {};
    const un = dossier.understanding || {};
    const sc = dossier.scale || {};

    const identityRows = [
      id.name ? `<tr><td style="padding:4px 0;color:#666;width:120px;">Name</td><td style="padding:4px 0;font-weight:600;">${esc(id.name)}</td></tr>` : "",
      id.founded ? `<tr><td style="padding:4px 0;color:#666;">Founded</td><td style="padding:4px 0;">${esc(id.founded)}</td></tr>` : "",
      un.tagline ? `<tr><td style="padding:4px 0;color:#666;">Tagline</td><td style="padding:4px 0;">${esc(un.tagline)}</td></tr>` : "",
      un.industry ? `<tr><td style="padding:4px 0;color:#666;">Industry</td><td style="padding:4px 0;">${esc(un.industry)}</td></tr>` : "",
    ].join("");

    const understandingBits = [
      un.descriptor ? `<p style="margin:6px 0 2px 0;font-weight:600;">What they do</p><div style="font-size:14px;white-space:pre-wrap;">${esc(un.descriptor)}</div>` : "",
      un.stack && un.stack.length ? `<p style="margin:10px 0 2px 0;font-weight:600;">Stack</p><div style="font-size:14px;">${un.stack.map((t) => esc(t)).join(", ")}</div>` : "",
    ].join("");

    const currencyItems = (dossier.currency || [])
      .filter((c) => c && c.text)
      .map((c) => {
        const link = c.sourceUrl ? ` <a href="${esc(c.sourceUrl)}" style="color:#0e1a2b;">[source]</a>` : "";
        const date = c.date ? ` <span style="color:#999;">(${esc(c.date)})</span>` : "";
        const src = c.source ? ` <span style="color:#bbb;font-size:12px;">via ${esc(c.source)}</span>` : "";
        return `<li style="margin:4px 0;">${esc(c.text)}${link}${date}${src}</li>`;
      })
      .join("");

    // Internal routing block (Krish only — NEVER shown to the visitor).
    const routingRows = [
      sc.employeeCount !== undefined ? `<tr><td style="padding:4px 0;color:#666;width:140px;">Employee count</td><td style="padding:4px 0;">${esc(sc.employeeCount)}</td></tr>` : "",
      sc.sizeBand ? `<tr><td style="padding:4px 0;color:#666;">Size band</td><td style="padding:4px 0;">${esc(sc.sizeBand)}</td></tr>` : "",
      sc.trancoRank !== undefined ? `<tr><td style="padding:4px 0;color:#666;">Tranco rank</td><td style="padding:4px 0;">${esc(sc.trancoRank)}</td></tr>` : "",
      sc.icp ? `<tr><td style="padding:4px 0;color:#666;">ICP</td><td style="padding:4px 0;font-weight:600;">${esc(sc.icp)}</td></tr>` : "",
      sc.recommendedMode ? `<tr><td style="padding:4px 0;color:#666;">Recommended mode</td><td style="padding:4px 0;font-weight:600;">${esc(sc.recommendedMode)}</td></tr>` : "",
    ].join("");

    blocks.push(`
      <div style="margin-top:18px;">
        <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Company dossier${dossier.domain ? ` — ${esc(dossier.domain)}` : ""}</p>
        ${identityRows ? `<table style="width:100%;border-collapse:collapse;font-size:14px;">${identityRows}</table>` : ""}
        ${understandingBits}
        ${currencyItems ? `<p style="margin:12px 0 2px 0;font-weight:600;">Currency</p><ul style="margin:4px 0 0 0;padding-left:20px;font-size:14px;">${currencyItems}</ul>` : ""}
        ${dossier.synthesis ? `<p style="margin:12px 0 2px 0;font-weight:600;">Synthesis</p><div style="background:#fafafa;border-left:4px solid #00D9B6;padding:10px 14px;font-size:14px;white-space:pre-wrap;">${esc(dossier.synthesis)}</div>` : ""}
        ${
          routingRows
            ? `<div style="margin-top:14px;background:#fff7e6;border:1px solid #f0d9a8;border-radius:6px;padding:12px 16px;">
                 <p style="margin:0 0 6px 0;font-weight:700;color:#8a6d1a;font-size:13px;">Internal routing (not shown to the visitor)</p>
                 <table style="width:100%;border-collapse:collapse;font-size:14px;">${routingRows}</table>
               </div>`
            : ""
        }
      </div>`);
  }

  // Transcript
  const turns = (transcript || [])
    .filter((t) => t && typeof t.content === "string" && t.content.trim())
    .map((t) => {
      const who = t.role === "assistant" ? "Mindy" : "Visitor";
      const accent = t.role === "assistant" ? "#00D9B6" : "#9cb3ff";
      return `<div style="margin:8px 0;padding:10px 14px;background:#fafafa;border-left:4px solid ${accent};font-size:14px;">
                <span style="font-weight:700;color:#0e1a2b;">${who}</span>
                <div style="margin-top:4px;white-space:pre-wrap;">${esc(t.content)}</div>
              </div>`;
    })
    .join("");
  blocks.push(`
    <div style="margin-top:18px;">
      <p style="margin:0 0 6px 0;font-weight:700;color:#0e1a2b;">Transcript</p>
      ${turns || `<p style="color:#999;font-size:14px;">(no transcript turns)</p>`}
    </div>`);

  // Proposal note
  if (proposalId || req.proposalHtml) {
    blocks.push(`
      <div style="margin-top:18px;padding:12px 16px;background:#0e1a2b;border-radius:6px;color:#fff;font-size:14px;">
        A proposal was generated for this session${proposalId ? ` (id <code style="color:#00D9B6;">${esc(proposalId)}</code>)` : ""}.
        ${req.proposalHtml ? "It is attached to this email as an HTML file." : ""}
      </div>`);
  }

  const heading = esc(contact?.company || dossier?.identity?.name || "A visitor");
  return `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;max-width:680px;margin:0 auto;padding:0;background:#f7f7f5;">
  <div style="background:linear-gradient(135deg,#0e1a2b 0%,#1a2b3d 100%);padding:32px 24px;">
    <h1 style="color:#fff;margin:0 0 6px 0;font-size:22px;">Diagnosis Room digest</h1>
    <p style="color:#00D9B6;margin:0;font-size:13px;">${heading} — ${esc(endedVia || "session")}</p>
  </div>
  <div style="background:#fff;padding:24px;">
    ${blocks.join("")}
  </div>
</body></html>`;
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

// ── resend send ──────────────────────────────────────────────────────────────────

async function sendEmail(payload: {
  from: string;
  to: string[];
  subject: string;
  html: string;
  reply_to?: string;
  attachments?: ResendAttachment[];
}): Promise<{ ok: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY.trim()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errText = await res.text();
    return { ok: false, error: `${res.status} ${errText}` };
  }
  return { ok: true };
}

// ── handler ─────────────────────────────────────────────────────────────────────

serve(async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  if (totalServed >= REQUEST_CEILING) {
    return json({ error: "High demand right now. Try again later." }, 429);
  }

  // Per-IP in-memory rate limit (best-effort).
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
    if (entry.count > RATE_MAX) {
      return json({ error: "Too many requests. Try again in a few minutes." }, 429);
    }
  }

  if (!RESEND_API_KEY || !RESEND_API_KEY.trim().startsWith("re_")) {
    console.error("[session-digest] RESEND_API_KEY missing or invalid");
    return json({ error: "Email service is not configured." }, 503);
  }

  // Parse + validate body.
  let body: DigestRequest;
  try {
    body = (await req.json()) as DigestRequest;
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }
  if (!body || typeof body !== "object") {
    return json({ error: "Invalid request body." }, 400);
  }

  const transcript = Array.isArray(body.transcript) ? body.transcript : [];
  const hasTranscript = transcript.some(
    (t) => t && typeof t.content === "string" && t.content.trim().length > 0,
  );
  const hasBrief = !!body.decisionBrief && typeof body.decisionBrief === "object";
  if (!hasTranscript && !hasBrief) {
    return json({ error: "Nothing to digest: a transcript or a decisionBrief is required." }, 400);
  }

  const contact: Contact = body.contact && typeof body.contact === "object" ? body.contact : {};

  // ── 1) Krish digest (the primary email) ──────────────────────────────────────
  let krishEmailSent = false;
  try {
    const subjectWho = contact.company || body.dossier?.identity?.name || "a visitor";
    const attachments: ResendAttachment[] = [];
    if (typeof body.proposalHtml === "string" && body.proposalHtml.trim()) {
      attachments.push({
        filename: `proposal-${body.proposalId || "mindmaker"}.html`,
        content: toBase64(body.proposalHtml),
      });
    }
    const krishResult = await sendEmail({
      from: DIGEST_FROM,
      to: [KRISH_TO],
      reply_to: looksLikeEmail(contact.email) ? contact.email : undefined,
      subject: `Diagnosis Room: ${subjectWho} — ${body.endedVia || "session"}`,
      html: buildKrishHtml({ ...body, transcript, contact }),
      attachments: attachments.length ? attachments : undefined,
    });
    if (krishResult.ok) {
      krishEmailSent = true;
    } else {
      console.error("[session-digest] Krish digest send failed:", krishResult.error);
    }
  } catch (e) {
    console.error("[session-digest] Krish digest exception:", (e as Error).message);
  }

  // ── 2) Visitor copy (only if opted in + valid email + a proposal exists) ──────
  // Sent independently: a visitor-copy failure must NOT fail the Krish digest.
  let visitorEmailSent = false;
  const wantsCopy =
    body.userOptInCopy === true &&
    looksLikeEmail(contact.email) &&
    typeof body.proposalHtml === "string" &&
    body.proposalHtml.trim().length > 0;
  if (wantsCopy) {
    try {
      const visitorResult = await sendEmail({
        from: VISITOR_FROM,
        to: [contact.email as string],
        reply_to: KRISH_TO,
        subject: "Your Mindmaker proposal",
        html: buildVisitorHtml(contact),
        attachments: [
          {
            filename: `proposal-${body.proposalId || "mindmaker"}.html`,
            content: toBase64(body.proposalHtml as string),
          },
        ],
      });
      if (visitorResult.ok) {
        visitorEmailSent = true;
      } else {
        console.error("[session-digest] Visitor copy send failed:", visitorResult.error);
      }
    } catch (e) {
      console.error("[session-digest] Visitor copy exception:", (e as Error).message);
    }
  }

  totalServed += 1;

  // If we could not even send the primary digest, surface it as a failure.
  if (!krishEmailSent) {
    return json(
      { error: "Failed to send the session digest.", krishEmailSent, visitorEmailSent },
      502,
    );
  }

  return json({ ok: true, krishEmailSent, visitorEmailSent });
});
