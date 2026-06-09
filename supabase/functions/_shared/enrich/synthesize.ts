/**
 * @file synthesize.ts
 * @description Final synthesis step of the company-enrichment pipeline. Takes the
 *   assembled {@link Dossier} and produces one short, confident "here is what I think
 *   you do, tell me if I am wrong" paragraph in Krish's operator voice. This is the line
 *   Mindy uses to make a visitor feel known from just their work email/domain.
 *
 *   Primary model: Gemini gemini-2.5-flash. Fallback: Anthropic claude-haiku-4-5-20251001.
 *   On any failure (either provider), returns null and logs the error — never throws.
 *
 * @dependencies
 *   - fetchWithTimeout ('../timeout.ts') — 7000ms per provider call.
 *   - createLogger     ('../logger.ts')  — structured logging.
 *   - Dossier          ('./types.ts')    — the assembled dossier contract.
 *
 * @env GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY
 */

import { fetchWithTimeout } from '../timeout.ts';
import { createLogger } from '../logger.ts';
import type { Dossier } from './types.ts';

const logger = createLogger('enrich/synthesize');

/** Per-provider request timeout. */
const TIMEOUT_MS = 7000;

const GEMINI_MODEL = 'gemini-2.5-flash';
const ANTHROPIC_MODEL = 'claude-haiku-4-5-20251001';

/**
 * System/instruction guidance shared by both providers. Encodes Krish's operator voice
 * and the framing of the descriptor: confident, specific, named to a real fact from the
 * dossier, and explicitly inviting correction.
 */
function buildSystemPrompt(visitorCountry = 'US'): string {
  return [
    'You write one short paragraph that a sharp operator would say to a visitor whose company you just looked up.',
    'Frame it as "here is what I think you do, tell me if I am wrong". Confident, not hedged. You are showing you did the homework.',
    'Hard rules:',
    '- 70 words or fewer. One paragraph. No line breaks, no lists, no headings.',
    '- Name at least one real, specific fact from the brief below (a product, the industry, a named tool, the scale). Do not invent facts.',
    '- Sentence case. Active voice. Second person. British-Australian spelling.',
    `- Describe the company's global or primary (typically US/HQ) entity. The visitor is in ${visitorCountry}; use their locale and US dollars. Never assume a regional subsidiary or local currency unless the company is unambiguously and only regional.`,
    '- End by inviting a correction, in your own words (e.g. tell me where I have got this wrong).',
    '- No em dashes. No buzzwords (transformation, synergy, leverage, ecosystem, journey, unlock, seamless, empower, game-changer, cutting-edge).',
    'Output only the paragraph. No preamble, no quotation marks, no "Here is".',
  ].join('\n');
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
  if (u.products?.length) lines.push(`Products: ${u.products.join(', ')}`);
  if (u.stack?.length) lines.push(`Tech stack: ${u.stack.join(', ')}`);
  if (d.identity.founded) lines.push(`Founded: ${d.identity.founded}`);
  if (d.scale.sizeBand) lines.push(`Rough size: ${d.scale.sizeBand}`);
  if (d.currency.length) {
    const recent = d.currency.slice(0, 2).map((c) => c.text).filter(Boolean);
    if (recent.length) lines.push(`Recent: ${recent.join(' | ')}`);
  }

  return lines.join('\n');
}

/**
 * Voice scrub: the synthesis line is user-facing, so it must never carry an em
 * dash (the model is told not to, but is not always obedient). Replaces em/en
 * dashes and spaced ASCII '--' with sentence-appropriate punctuation, collapses
 * the whitespace it leaves behind, and guarantees no U+2014 survives.
 */
function scrubVoice(input: string): string {
  let s = input;
  // Spaced em/en dash or '--' acting as a clause break -> comma.
  s = s.replace(/\s*[—–]\s*/g, ', ');
  s = s.replace(/\s+--\s+/g, ', ');
  // Any remaining bare em/en dash (e.g. word-glued) -> comma.
  s = s.replace(/[—–]/g, ', ');
  // Tidy artefacts: doubled commas/spaces, comma butting up to terminal punctuation.
  s = s.replace(/,\s*,/g, ',').replace(/\s{2,}/g, ' ').replace(/\s+,/g, ',');
  s = s.replace(/,\s*([.!?])/g, '$1');
  return s.trim();
}

/** Normalises model output: strips wrapping quotes, code fences, and stray whitespace. */
function cleanOutput(raw: string): string {
  let s = raw.trim();
  // Strip a leading/trailing code fence if the model wrapped the line.
  s = s.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '').trim();
  // Strip a single pair of wrapping quotes.
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  // Voice-lint: the synthesis output is user-facing and was previously un-scrubbed.
  return scrubVoice(s);
}

/**
 * Calls Gemini gemini-2.5-flash. Returns the trimmed paragraph, or null on any failure
 * (missing key, non-2xx, empty candidates, timeout). Logs the error; never throws.
 */
async function synthesizeWithGemini(brief: string, systemPrompt: string): Promise<string | null> {
  const key = Deno.env.get('GOOGLE_AI_API_KEY');
  if (!key) {
    logger.warn('GOOGLE_AI_API_KEY not set; skipping Gemini');
    return null;
  }

  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
    const prompt = `${systemPrompt}\n\nBrief:\n${brief}`;

    const res = await fetchWithTimeout(
      url,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 300,
            // gemini-2.5-flash is a thinking model: with thinking on, it spends the
            // whole 300-token budget on internal reasoning (thoughtsTokenCount) and
            // emits almost no visible text (finishReason: MAX_TOKENS). Disabling
            // thinking returns the full paragraph within budget. Verified live 2026-06-09.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
      TIMEOUT_MS,
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.warn('Gemini non-2xx', { status: res.status, body: body.slice(0, 400) });
      return null;
    }

    const data = await res.json();
    const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== 'string' || !text.trim()) {
      logger.warn('Gemini returned empty content', {
        finishReason: data?.candidates?.[0]?.finishReason,
      });
      return null;
    }

    const out = cleanOutput(text);
    return out.length ? out : null;
  } catch (err) {
    logger.error('Gemini call failed', { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

/**
 * Calls Anthropic claude-haiku-4-5-20251001 via the Messages API (raw HTTP — Deno edge,
 * no SDK). Returns the trimmed paragraph, or null on any failure. Logs the error; never throws.
 */
async function synthesizeWithAnthropic(brief: string, systemPrompt: string): Promise<string | null> {
  const key = Deno.env.get('ANTHROPIC_API_KEY');
  if (!key) {
    logger.warn('ANTHROPIC_API_KEY not set; skipping Anthropic fallback');
    return null;
  }

  try {
    const res = await fetchWithTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 300,
          system: systemPrompt,
          messages: [{ role: 'user', content: `Brief:\n${brief}` }],
        }),
      },
      TIMEOUT_MS,
    );

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      logger.warn('Anthropic non-2xx', { status: res.status, body: body.slice(0, 400) });
      return null;
    }

    const data = await res.json();
    // content is a block array; concatenate any text blocks.
    const blocks: Array<{ type?: string; text?: string }> = Array.isArray(data?.content)
      ? data.content
      : [];
    const text = blocks
      .filter((b) => b?.type === 'text' && typeof b.text === 'string')
      .map((b) => b.text as string)
      .join('')
      .trim();

    if (!text) {
      logger.warn('Anthropic returned empty content', { stopReason: data?.stop_reason });
      return null;
    }

    const out = cleanOutput(text);
    return out.length ? out : null;
  } catch (err) {
    logger.error('Anthropic call failed', { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

/**
 * Produce the one-paragraph "here is what I think you do, tell me if I am wrong" descriptor
 * from an assembled dossier. Tries Gemini first; on any failure or empty result, falls back
 * to Anthropic Haiku. Returns the trimmed paragraph (<=70 words target), or null if both fail.
 *
 * Never throws — every failure path returns null and logs.
 *
 * @param d The assembled {@link Dossier} (name, tagline, industry, products, stack, currency, scale).
 * @param visitorCountry ISO alpha-2 country of the visitor (default 'US'). Biases the
 *   descriptor toward the global/primary entity and the visitor's locale + US dollars,
 *   so a US visitor is never handed a regional subsidiary with the wrong currency.
 * @returns A clean single-paragraph descriptor (never contains an em dash), or null.
 *
 * @example
 * // Smoke test (do NOT ship in the export) — construct a small fake Gong dossier:
 * // const gong: Dossier = {
 * //   domain: 'gong.io',
 * //   fetchedAt: new Date().toISOString(),
 * //   identity: { name: 'Gong', founded: 2015 },
 * //   understanding: {
 * //     tagline: 'Revenue intelligence platform',
 * //     descriptor: 'Captures and analyses customer conversations for sales teams',
 * //     industry: 'computer software',
 * //     products: ['Gong Revenue Intelligence', 'Gong Forecast'],
 * //     stack: ['Salesforce', 'Segment', 'Marketo', 'Snowflake'],
 * //   },
 * //   scale: { sizeBand: '1001-5000', employeeCount: 1684 },
 * //   currency: [{ text: 'Raised a Series E in 2021', source: 'perplexity' }],
 * //   confidence: {},
 * //   meta: { tools: [], ms: 0, depth: 'full' },
 * // };
 * // const line = await synthesizeDescriptor(gong);
 * // Expected output (Gemini, one of many phrasings):
 * //   "You run Gong, a revenue intelligence platform that records and reads sales calls
 * //    for software teams, wired into Salesforce and Snowflake. If I have got the angle
 * //    wrong, tell me."
 */
export async function synthesizeDescriptor(
  d: Dossier,
  visitorCountry = 'US',
): Promise<string | null> {
  const brief = buildBrief(d);
  const systemPrompt = buildSystemPrompt(visitorCountry);

  const primary = await synthesizeWithGemini(brief, systemPrompt);
  if (primary) return primary;

  logger.info('Gemini synthesis unavailable; falling back to Anthropic', { domain: d.domain });
  const fallback = await synthesizeWithAnthropic(brief, systemPrompt);
  if (fallback) return fallback;

  logger.error('Both synthesis providers failed', { domain: d.domain });
  return null;
}
