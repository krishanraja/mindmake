/**
 * @file synthesize.ts
 * @description Final synthesis step of the company-enrichment pipeline. Takes the
 *   assembled {@link Dossier} and produces one short, declarative outside read of the
 *   company in the Mindmake voice. The paragraph appears on the site's company-read
 *   card, in the private brief and in both delivery emails, so it must land as a
 *   confident statement: no questions, no invitation to correct, British spelling.
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
 * System/instruction guidance shared by both providers. Encodes the Mindmake voice:
 * a confident, declarative outside read of the business, named to a real fact from
 * the dossier, written as a statement the reader can test rather than a conversation.
 */
function buildSystemPrompt(visitorCountry = "US"): string {
  return [
    "You write one short paragraph: a sharp outside read of a company, addressed to its leader.",
    "It is a written brief, not a conversation. State what the business does and where it stands. Confident, not hedged.",
    "Hard rules:",
    "- 60 words or fewer. One paragraph. No line breaks, no lists, no headings.",
    "- Name at least one real, specific fact from the brief below (a product, the industry, a named tool, the scale). Do not invent facts.",
    "- Declarative sentences only. Never ask the reader anything. Never invite a correction or a reply. Never write tell me, let me know, correct me or if I am wrong.",
    "- End on a plain statement about the business.",
    "- Sentence case. Active voice. Second person. British spelling (judgement, organisation, not judgment or organization).",
    `- Describe the company's global or primary (typically US/HQ) entity. The visitor is in ${visitorCountry}; use their locale and US dollars. Never assume a regional subsidiary or local currency unless the company is unambiguously and only regional.`,
    "- No em dashes. No buzzwords (transformation, synergy, leverage, ecosystem, journey, unlock, seamless, empower, game-changer, cutting-edge).",
    'Output only the paragraph. No preamble, no quotation marks, no "Here is".',
  ].join("\n");
}

/**
 * Builds the compact, factual brief handed to the model. We deliberately omit the
 * internal `scale` routing layer (employee counts / rank), those route ICP silently
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
 * Produce the one-paragraph declarative company read from an assembled dossier.
 * Delegates the provider fallback + voice scrub to `completeText`.
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
