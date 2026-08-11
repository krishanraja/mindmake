/**
 * @file llm.ts
 * @description Shared text-completion helper with a Gemini→Anthropic fallback, factored
 *   out of synthesize.ts so both the dossier synthesis line AND the lead pipeline's
 *   "operator's read" use one battle-tested code path (same model ids, same
 *   thinking-budget workaround, same voice scrub).
 *
 *   Primary model:  Gemini gemini-2.5-flash (thinkingBudget: 0, see note below).
 *   Fallback model: Anthropic claude-haiku-4-5-20251001.
 *   On any failure (either provider), returns null and logs, never throws.
 *
 * @env GOOGLE_AI_API_KEY, ANTHROPIC_API_KEY
 */

import { fetchWithTimeout } from "../timeout.ts";
import { createLogger } from "../logger.ts";

const logger = createLogger("enrich/llm");

const DEFAULT_TIMEOUT_MS = 7000;
const GEMINI_MODEL = "gemini-2.5-flash";
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

export interface CompleteTextInput {
  /** System / instruction guidance (voice, rules, framing). */
  system: string;
  /** The user turn, the brief / data the model reasons over. */
  user: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
}

/**
 * Voice scrub: model output is often user- or Krish-facing and must never carry an em
 * dash (models are told not to, but are not always obedient). Replaces em/en dashes and
 * spaced ASCII '--' with sentence-appropriate punctuation and tidies the artefacts.
 */
export function scrubVoice(input: string): string {
  let s = input;
  s = s.replace(/\s*[, –]\s*/g, ", ");
  s = s.replace(/\s+--\s+/g, ", ");
  s = s.replace(/[, –]/g, ", ");
  s = s.replace(/,\s*,/g, ",").replace(/\s{2,}/g, " ").replace(/\s+,/g, ",");
  s = s.replace(/,\s*([.!?])/g, "$1");
  return s.trim();
}

/** Normalise model output: strips wrapping quotes, code fences, stray whitespace, em dashes. */
export function cleanOutput(raw: string): string {
  let s = raw.trim();
  s = s.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();
  if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
    s = s.slice(1, -1).trim();
  }
  return scrubVoice(s);
}

async function withGemini(input: CompleteTextInput): Promise<string | null> {
  const key = Deno.env.get("GOOGLE_AI_API_KEY");
  if (!key) {
    logger.warn("GOOGLE_AI_API_KEY not set; skipping Gemini");
    return null;
  }
  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${key}`;
    const prompt = `${input.system}\n\n${input.user}`;
    const res = await fetchWithTimeout(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: input.temperature ?? 0.4,
            maxOutputTokens: input.maxTokens ?? 300,
            // gemini-2.5-flash is a thinking model: with thinking on, it spends the
            // whole token budget on internal reasoning and emits almost no visible
            // text (finishReason: MAX_TOKENS). Disabling thinking returns the full
            // text within budget. Verified live 2026-06-09.
            thinkingConfig: { thinkingBudget: 0 },
          },
        }),
      },
      input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.warn("Gemini non-2xx", { status: res.status, body: body.slice(0, 400) });
      return null;
    }
    const data = await res.json();
    const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || !text.trim()) {
      logger.warn("Gemini returned empty content", { finishReason: data?.candidates?.[0]?.finishReason });
      return null;
    }
    const out = cleanOutput(text);
    return out.length ? out : null;
  } catch (err) {
    logger.error("Gemini call failed", { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

async function withAnthropic(input: CompleteTextInput): Promise<string | null> {
  const key = Deno.env.get("ANTHROPIC_API_KEY");
  if (!key) {
    logger.warn("ANTHROPIC_API_KEY not set; skipping Anthropic fallback");
    return null;
  }
  try {
    const res = await fetchWithTimeout(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: input.maxTokens ?? 300,
          temperature: input.temperature ?? 0.4,
          system: input.system,
          messages: [{ role: "user", content: input.user }],
        }),
      },
      input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );
    if (!res.ok) {
      const body = await res.text().catch(() => "");
      logger.warn("Anthropic non-2xx", { status: res.status, body: body.slice(0, 400) });
      return null;
    }
    const data = await res.json();
    const blocks: Array<{ type?: string; text?: string }> = Array.isArray(data?.content) ? data.content : [];
    const text = blocks
      .filter((b) => b?.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("")
      .trim();
    if (!text) {
      logger.warn("Anthropic returned empty content", { stopReason: data?.stop_reason });
      return null;
    }
    const out = cleanOutput(text);
    return out.length ? out : null;
  } catch (err) {
    logger.error("Anthropic call failed", { error: err instanceof Error ? err.message : String(err) });
    return null;
  }
}

/**
 * Complete a short text turn. Tries Gemini first; on any failure or empty result,
 * falls back to Anthropic Haiku. Returns cleaned (voice-scrubbed) text, or null if
 * both fail. Never throws.
 */
export async function completeText(input: CompleteTextInput): Promise<string | null> {
  const primary = await withGemini(input);
  if (primary) return primary;
  logger.info("Gemini unavailable; falling back to Anthropic");
  const fallback = await withAnthropic(input);
  if (fallback) return fallback;
  logger.error("Both completion providers failed");
  return null;
}
