/**
 * @file synthesize.ts
 * @description Final synthesis step of the company-enrichment pipeline. Takes the
 *   assembled {@link Dossier} and produces one short, confident "here is what I think
 *   you do, tell me if I am wrong" paragraph in Krish's operator voice. This is the line
 *   Mindy uses to make a visitor feel known from just their work email/domain.
 *
 *   The provider fallback (Gemini gemini-2.5-flash → Anthropic claude-haiku-4-5) and the
 *   voice scrub now live in the shared `./llm.ts` (`completeText`), used here and by the
 *   lead pipeline's operator's read. On any failure this returns null and logs; never throws.
 *
 * @dependencies completeText ('./llm.ts'), Dossier ('./types.ts'), createLogger ('../logger.ts')
 * @env GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY
 */

import { completeText } from "./llm.ts";
import { createLogger } from "../logger.ts";
import type { Dossier } from "./types.ts";

const logger = createLogger("enrich/synthesize");

/**
 * System/instruction guidance shared by both providers. Encodes Krish's operator voice
 * and the framing of the descriptor: confident, specific, named to a real fact from the
 * dossier, and explicitly inviting correction.
 */
function buildSystemPrompt(visitorCountry = "US"): string {
  return [
    "You write one short paragraph that a sharp operator would say to a visitor whose company you just looked up.",
    'Frame it as "here is what I think you do, tell me if I am wrong". Confident, not hedged. You are showing you did the homework.',
    "Hard rules:",
    "- 70 words or fewer. One paragraph. No line breaks, no lists, no headings.",
    "- Name at least one real, specific fact from the brief below (a product, the industry, a named tool, the scale). Do not invent facts.",
    "- Sentence case. Active voice. Second person. British-Australian spelling.",
    `- Describe the company's global or primary (typically US/HQ) entity. The visitor is in ${visitorCountry}; use their locale and US dollars. Never assume a regional subsidiary or local currency unless the company is unambiguously and only regional.`,
    "- End by inviting a correction, in your own words (e.g. tell me where I have got this wrong).",
    "- No em dashes. No buzzwords (transformation, synergy, leverage, ecosystem, journey, unlock, seamless, empower, game-changer, cutting-edge).",
    'Output only the paragraph. No preamble, no quotation marks, no "Here is".',
  ].join("\n");
}

/**
 * Builds the compact, factual brief handed to the model. We deliberately omit the
 * internal `scale` routing layer (employee counts / rank) — those route ICP silently
 * and are never recited back at the user.
 */
function buildBrief(d: Dossier): string {
  const u = d.understanding;
  const lines: string[] = [];

  lines.push(`Company: ${d.identity.name ?? d.domain}`);
  lines.push(`Domain: ${d.domain}`);
  if (u.tagline) lines.push(`Tagline: ${u.tagline}`);
  if (u.descriptor) lines.push(`What they do: ${u.descriptor}`);
  if (u.industry) lines.push(`Industry: ${u.industry}`);
  if (u.products?.length) lines.push(`Products: ${u.products.join(", ")}`);
  if (u.stack?.length) lines.push(`Tech stack: ${u.stack.join(", ")}`);
  if (d.identity.founded) lines.push(`Founded: ${d.identity.founded}`);
  if (d.scale.sizeBand) lines.push(`Rough size: ${d.scale.sizeBand}`);
  if (d.currency.length) {
    const recent = d.currency.slice(0, 2).map((c) => c.text).filter(Boolean);
    if (recent.length) lines.push(`Recent: ${recent.join(" | ")}`);
  }

  return lines.join("\n");
}

/**
 * Produce the one-paragraph "here is what I think you do, tell me if I am wrong" descriptor
 * from an assembled dossier. Delegates the provider fallback + voice scrub to `completeText`.
 * Returns the clean single-paragraph descriptor (never contains an em dash), or null.
 *
 * @param d The assembled {@link Dossier}.
 * @param visitorCountry ISO alpha-2 country of the visitor (default 'US'), biasing the
 *   descriptor toward the global/primary entity and the visitor's locale + US dollars.
 */
export async function synthesizeDescriptor(
  d: Dossier,
  visitorCountry = "US",
): Promise<string | null> {
  const out = await completeText({
    system: buildSystemPrompt(visitorCountry),
    user: `Brief:\n${buildBrief(d)}`,
    maxTokens: 300,
    temperature: 0.4,
  });
  if (!out) logger.error("synthesis unavailable for domain", { domain: d.domain });
  return out;
}
