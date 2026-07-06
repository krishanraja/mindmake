/**
 * @file operator-read.ts
 * @description The "intelligent" line at the top of every lead digest. Two-to-three
 *   sentences in Krish's operator voice answering: who is this, what do they seem to
 *   want, and what is the sharp next move. Grounded in the company dossier (identity,
 *   what-they-do, recent activity, synthesis AND the internal scale/routing — allowed
 *   here because the digest is Krish-only) plus the fields the lead actually submitted.
 *
 *   KRISH-ONLY. It may reference size / ICP, so it must never appear on any
 *   visitor-facing surface. Best-effort: returns null on any failure or when there is
 *   nothing substantive to reason over. Reuses the shared Gemini→Anthropic `completeText`.
 */

import { completeText } from "../enrich/llm.ts";
import type { Dossier } from "../enrich/types.ts";
import type { LeadEvent } from "./types.ts";

const SYSTEM_PROMPT = [
  "You are Krish, a sharp operator who runs AI transformation for leaders. A new lead just came in through the website.",
  "Write a tight internal note to yourself: who this is, what they seem to actually want, and the single sharpest next move.",
  "Hard rules:",
  "- 3 sentences maximum. No headings, no bullet points, no line breaks.",
  "- Ground every claim in the brief below. Do not invent facts. If the brief is thin, say what you'd confirm on the call.",
  "- Sentence one: who they are (use the company research if present). Sentence two: what they're really deciding / want. Sentence three: the next move (which offer or question), concrete.",
  "- Sentence case. Active voice. Confident, lightly cynical, useful. British-Australian spelling.",
  "- No em dashes. No buzzwords (transformation, synergy, leverage, ecosystem, journey, unlock, seamless, empower, game-changer, cutting-edge).",
  "Output only the note. No preamble, no quotation marks.",
].join("\n");

/** Flatten a dossier into a compact factual brief. Includes scale (Krish-only email). */
function dossierBrief(d: Dossier): string {
  const lines: string[] = [];
  const id = d.identity, un = d.understanding, sc = d.scale;
  if (id.name) lines.push(`Company: ${id.name} (${d.domain})`);
  else lines.push(`Domain: ${d.domain}`);
  if (un.tagline) lines.push(`Tagline: ${un.tagline}`);
  if (un.descriptor) lines.push(`What they do: ${un.descriptor}`);
  if (un.industry) lines.push(`Industry: ${un.industry}`);
  if (un.products?.length) lines.push(`Products: ${un.products.join(", ")}`);
  if (un.stack?.length) lines.push(`Tech stack: ${un.stack.join(", ")}`);
  if (sc.employeeCount) lines.push(`Employees: ${sc.employeeCount}`);
  else if (sc.sizeBand) lines.push(`Size band: ${sc.sizeBand}`);
  if (sc.icp) lines.push(`Likely ICP: ${sc.icp}`);
  if (sc.recommendedMode) lines.push(`Suggested route: ${sc.recommendedMode}`);
  if (d.currency?.length) {
    const recent = d.currency.slice(0, 2).map((c) => c.text).filter(Boolean);
    if (recent.length) lines.push(`Recent: ${recent.join(" | ")}`);
  }
  if (d.synthesis) lines.push(`Prior read: ${d.synthesis}`);
  return lines.join("\n");
}

/** Flatten the submitted fields into a compact brief the model can reason over. */
function submissionBrief(event: LeadEvent): string {
  const lines: string[] = [];
  const c = event.contact;
  lines.push(`Source: ${event.sourceLabel}`);
  const who = [c.name, c.role].filter(Boolean).join(", ");
  if (who) lines.push(`Person: ${who}`);
  if (c.company) lines.push(`Company (self-reported): ${c.company}`);
  if (c.email) lines.push(`Email: ${c.email}`);
  for (const g of event.groups) {
    for (const f of g.fields) {
      if (f.list && f.list.filter(Boolean).length) {
        lines.push(`${f.label}: ${f.list.filter(Boolean).join(", ")}`);
      } else if (f.longform != null && String(f.longform).trim()) {
        lines.push(`${f.label}: ${String(f.longform).trim()}`);
      } else if (f.value !== undefined && f.value !== null && String(f.value).trim()) {
        lines.push(`${f.label}: ${f.value}`);
      }
    }
  }
  return lines.join("\n");
}

/** Whether there is enough to say anything useful (avoid a wasted LLM call). */
function hasSubstance(event: LeadEvent, dossier: Dossier | null): boolean {
  if (dossier && (dossier.identity.name || dossier.understanding.descriptor)) return true;
  const fieldCount = event.groups.reduce((n, g) => n + g.fields.length, 0);
  return fieldCount > 0;
}

/**
 * Produce the operator's read for a lead. Best-effort: returns null on any failure
 * or when there is nothing substantive to reason over. Never throws.
 */
export async function generateOperatorRead(
  event: LeadEvent,
  dossier: Dossier | null,
): Promise<string | null> {
  if (!hasSubstance(event, dossier)) return null;

  const parts = [submissionBrief(event)];
  if (dossier) parts.push(`\nCompany research:\n${dossierBrief(dossier)}`);

  try {
    return await completeText({
      system: SYSTEM_PROMPT,
      user: `Lead brief:\n${parts.join("\n")}`,
      maxTokens: 180,
      temperature: 0.4,
    });
  } catch {
    return null;
  }
}
