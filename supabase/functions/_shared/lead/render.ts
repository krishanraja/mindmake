/**
 * @file render.ts
 * @description The single lead-digest email renderer. Generalises session-digest's
 *   `buildKrishHtml` into a source-agnostic "11/10" email so EVERY lead capture produces
 *   one consistent, researched, well-formatted notification instead of eight different
 *   layouts. KRISH-ONLY by contract (`audience: 'krish'`): it renders the internal
 *   routing block and is never used for a visitor-facing email.
 *
 *   Section order: hero → operator's read → contact → company dossier (+ internal
 *   routing) → what they submitted → transcript → proposal note → reply CTA.
 *
 *   Palette matches the reference email exactly: ink #0e1a2b, emerald #00D9B6,
 *   paper #f7f7f5, neutral border #e5e5e3, amber routing callout #fff7e6.
 */

import type { Dossier } from "../enrich/types.ts";
import type { LeadEvent, LeadField, LeadFieldGroup, TranscriptTurn } from "./types.ts";
import { compactGroups } from "./types.ts";
import { esc, looksLikeEmail } from "./escape.ts";

const INK = "#0e1a2b";
const EMERALD = "#00D9B6";

/** Per-source subject emoji so Krish's inbox stays scannable at a glance. */
const SOURCE_EMOJI: Record<string, string> = {
  contact: "📬",
  lead: "🎯",
  "leadership-diagnostic": "📊",
  scoping: "🧭",
  "ctrl-waitlist": "🎟️",
  intake: "📝",
  testimonial: "⭐",
  "session-digest": "🩺",
};

export interface RenderInput {
  event: LeadEvent;
  dossier: Dossier | null;
  operatorRead: string | null;
  audience?: "krish";
}

// ── field / group rendering ────────────────────────────────────────────────

function tableRows(fields: LeadField[]): string {
  return fields
    .map(
      (f) =>
        `<tr><td style="padding:4px 0;color:#666;width:160px;vertical-align:top;">${esc(f.label)}</td><td style="padding:4px 0;">${esc(f.value)}</td></tr>`,
    )
    .join("");
}

function longformBlock(f: LeadField): string {
  return `<p style="margin:12px 0 2px 0;font-weight:600;">${esc(f.label)}</p>
    <div style="background:#fafafa;border-left:4px solid #e5e5e3;padding:10px 14px;font-size:14px;white-space:pre-wrap;">${esc(f.longform)}</div>`;
}

function listBlock(f: LeadField): string {
  const items = (f.list ?? [])
    .filter((x) => x != null && String(x).trim())
    .map((x) => `<li style="margin:2px 0;">${esc(x)}</li>`)
    .join("");
  if (!items) return "";
  return `<p style="margin:12px 0 2px 0;font-weight:600;">${esc(f.label)}</p>
    <ul style="margin:4px 0 0 0;padding-left:20px;font-size:14px;">${items}</ul>`;
}

/**
 * Render a group's fields preserving declared order: consecutive short values
 * collapse into one facts table; longform + list fields render as their own blocks.
 */
function renderFields(fields: LeadField[]): string {
  const out: string[] = [];
  let tableBuf: LeadField[] = [];
  const flush = () => {
    if (tableBuf.length) {
      out.push(`<table style="width:100%;border-collapse:collapse;font-size:14px;">${tableRows(tableBuf)}</table>`);
      tableBuf = [];
    }
  };
  for (const f of fields) {
    const isTableRow = f.list == null && f.longform == null && f.value !== undefined && f.value !== null;
    if (isTableRow) {
      tableBuf.push(f);
    } else if (f.list) {
      flush();
      out.push(listBlock(f));
    } else if (f.longform != null) {
      flush();
      out.push(longformBlock(f));
    }
  }
  flush();
  return out.join("");
}

function renderGroup(g: LeadFieldGroup): string {
  return `<div style="margin-top:18px;">
    <p style="margin:0 0 6px 0;font-weight:700;color:${INK};">${esc(g.title)}</p>
    ${renderFields(g.fields)}
  </div>`;
}

// ── section builders ───────────────────────────────────────────────────────

function heroBlock(event: LeadEvent, dossier: Dossier | null): string {
  const id = dossier?.identity;
  const heading = esc(event.contact.company || id?.name || event.contact.name || "New lead");
  const accent = (id?.colors && id.colors[0]) || EMERALD;
  const logo = id?.logoUrl || id?.iconUrl;
  const logoImg = logo
    ? `<div style="display:inline-block;background:#fff;border-radius:8px;padding:6px 10px;margin-bottom:12px;">
         <img src="${esc(logo)}" alt="${heading}" style="max-height:34px;max-width:180px;vertical-align:middle;" />
       </div><br/>`
    : "";
  return `<div style="background:linear-gradient(135deg,${INK} 0%,#1a2b3d 100%);padding:32px 24px;">
    ${logoImg}
    <p style="color:${esc(accent)};margin:0 0 6px 0;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;font-weight:600;">${esc(event.sourceLabel)}</p>
    <h1 style="color:#fff;margin:0;font-size:22px;font-weight:700;">${heading}</h1>
  </div>`;
}

function operatorReadBlock(read: string | null): string {
  if (!read || !read.trim()) return "";
  return `<div style="background:#eafaf6;border-left:4px solid ${EMERALD};padding:14px 18px;border-radius:0 8px 8px 0;">
    <p style="margin:0 0 4px 0;font-weight:700;color:${INK};font-size:11px;text-transform:uppercase;letter-spacing:0.6px;">The read</p>
    <div style="font-size:15px;color:${INK};line-height:1.5;white-space:pre-wrap;">${esc(read)}</div>
  </div>`;
}

function contactBlock(event: LeadEvent): string {
  const c = event.contact;
  const rows: string[] = [];
  rows.push(`<tr><td style="padding:4px 0;color:#666;width:120px;">Name</td><td style="padding:4px 0;">${esc(c.name) || "(not given)"}</td></tr>`);
  rows.push(`<tr><td style="padding:4px 0;color:#666;">Email</td><td style="padding:4px 0;">${
    looksLikeEmail(c.email)
      ? `<a href="mailto:${esc(c.email)}" style="color:${INK};">${esc(c.email)}</a>`
      : "(not given)"
  }</td></tr>`);
  if (c.company) rows.push(`<tr><td style="padding:4px 0;color:#666;">Company</td><td style="padding:4px 0;">${esc(c.company)}</td></tr>`);
  if (c.role) rows.push(`<tr><td style="padding:4px 0;color:#666;">Role</td><td style="padding:4px 0;">${esc(c.role)}</td></tr>`);
  return `<div style="margin-top:18px;">
    <p style="margin:0 0 6px 0;font-weight:700;color:${INK};">Contact</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">${rows.join("")}</table>
  </div>`;
}

/** Company dossier + the amber internal-routing callout (Krish-only). */
function dossierBlock(dossier: Dossier | null): string {
  if (!dossier) return "";
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
      const link = c.sourceUrl ? ` <a href="${esc(c.sourceUrl)}" style="color:${INK};">[source]</a>` : "";
      const date = c.date ? ` <span style="color:#999;">(${esc(c.date)})</span>` : "";
      const src = c.source ? ` <span style="color:#bbb;font-size:12px;">via ${esc(c.source)}</span>` : "";
      return `<li style="margin:4px 0;">${esc(c.text)}${link}${date}${src}</li>`;
    })
    .join("");

  const routingRows = [
    sc.employeeCount !== undefined ? `<tr><td style="padding:4px 0;color:#666;width:140px;">Employee count</td><td style="padding:4px 0;">${esc(sc.employeeCount)}</td></tr>` : "",
    sc.sizeBand ? `<tr><td style="padding:4px 0;color:#666;">Size band</td><td style="padding:4px 0;">${esc(sc.sizeBand)}</td></tr>` : "",
    sc.trancoRank !== undefined ? `<tr><td style="padding:4px 0;color:#666;">Tranco rank</td><td style="padding:4px 0;">${esc(sc.trancoRank)}</td></tr>` : "",
    sc.icp ? `<tr><td style="padding:4px 0;color:#666;">ICP</td><td style="padding:4px 0;font-weight:600;">${esc(sc.icp)}</td></tr>` : "",
    sc.recommendedMode ? `<tr><td style="padding:4px 0;color:#666;">Recommended mode</td><td style="padding:4px 0;font-weight:600;">${esc(sc.recommendedMode)}</td></tr>` : "",
  ].join("");

  return `<div style="margin-top:18px;">
    <p style="margin:0 0 6px 0;font-weight:700;color:${INK};">Company dossier${dossier.domain ? ` — ${esc(dossier.domain)}` : ""}</p>
    ${identityRows ? `<table style="width:100%;border-collapse:collapse;font-size:14px;">${identityRows}</table>` : ""}
    ${understandingBits}
    ${currencyItems ? `<p style="margin:12px 0 2px 0;font-weight:600;">Recent activity</p><ul style="margin:4px 0 0 0;padding-left:20px;font-size:14px;">${currencyItems}</ul>` : ""}
    ${dossier.synthesis ? `<p style="margin:12px 0 2px 0;font-weight:600;">Synthesis</p><div style="background:#fafafa;border-left:4px solid ${EMERALD};padding:10px 14px;font-size:14px;white-space:pre-wrap;">${esc(dossier.synthesis)}</div>` : ""}
    ${
      routingRows
        ? `<div style="margin-top:14px;background:#fff7e6;border:1px solid #f0d9a8;border-radius:6px;padding:12px 16px;">
             <p style="margin:0 0 6px 0;font-weight:700;color:#8a6d1a;font-size:13px;">Internal routing (not shown to the visitor)</p>
             <table style="width:100%;border-collapse:collapse;font-size:14px;">${routingRows}</table>
           </div>`
        : ""
    }
  </div>`;
}

function transcriptBlock(transcript?: TranscriptTurn[]): string {
  const turns = (transcript || [])
    .filter((t) => t && typeof t.content === "string" && t.content.trim())
    .map((t) => {
      const who = t.role === "assistant" ? "Mindy" : "Visitor";
      const accent = t.role === "assistant" ? EMERALD : "#9cb3ff";
      return `<div style="margin:8px 0;padding:10px 14px;background:#fafafa;border-left:4px solid ${accent};font-size:14px;">
        <span style="font-weight:700;color:${INK};">${who}</span>
        <div style="margin-top:4px;white-space:pre-wrap;">${esc(t.content)}</div>
      </div>`;
    })
    .join("");
  if (!turns) return "";
  return `<div style="margin-top:18px;">
    <p style="margin:0 0 6px 0;font-weight:700;color:${INK};">Transcript</p>
    ${turns}
  </div>`;
}

function proposalBlock(proposal?: LeadEvent["proposal"]): string {
  if (!proposal || (!proposal.id && !proposal.html)) return "";
  return `<div style="margin-top:18px;padding:12px 16px;background:${INK};border-radius:6px;color:#fff;font-size:14px;">
    A proposal was generated for this session${proposal.id ? ` (id <code style="color:${EMERALD};">${esc(proposal.id)}</code>)` : ""}.
    ${proposal.html ? "It is attached to this email as an HTML file." : ""}
  </div>`;
}

function ctaBlock(event: LeadEvent): string {
  if (!looksLikeEmail(event.contact.email)) return "";
  const first = (event.contact.name || "").trim().split(/\s+/)[0] || "them";
  return `<div style="text-align:center;padding-top:20px;margin-top:24px;border-top:1px solid #e5e5e3;">
    <a href="mailto:${esc(event.contact.email)}" style="display:inline-block;background:${INK};color:#fff;padding:10px 22px;border-radius:6px;text-decoration:none;font-weight:600;font-size:14px;">Reply to ${esc(first)}</a>
  </div>`;
}

// ── public API ─────────────────────────────────────────────────────────────

export function buildSubject(event: LeadEvent, dossier: Dossier | null): string {
  const emoji = SOURCE_EMOJI[event.source] || "📥";
  const who = event.contact.company || dossier?.identity?.name || event.contact.name || event.contact.email || "New lead";
  return `${emoji} ${event.sourceLabel}: ${who}`;
}

/** Render the full Krish-facing lead digest. Returns { subject, html }. */
export function renderLeadDigest(input: RenderInput): { subject: string; html: string } {
  const { event, dossier, operatorRead } = input;
  const groups = compactGroups(event.groups);

  const body = [
    operatorReadBlock(operatorRead),
    contactBlock(event),
    dossierBlock(dossier),
    ...groups.map(renderGroup),
    transcriptBlock(event.transcript),
    proposalBlock(event.proposal),
    ctaBlock(event),
  ].join("");

  const html = `
<!DOCTYPE html>
<html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;max-width:680px;margin:0 auto;padding:0;background:#f7f7f5;">
  ${heroBlock(event, dossier)}
  <div style="background:#fff;padding:24px;">
    ${body}
  </div>
  <div style="text-align:center;padding:20px 24px;color:#999;font-size:12px;">
    <p style="margin:0;">Lead captured at <a href="https://www.themindmaker.ai" style="color:#666;">themindmaker.ai</a></p>
  </div>
</body></html>`;

  return { subject: buildSubject(event, dossier), html };
}
