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

import { defaultEnrichRuntime, type EnrichRuntime } from "./runtime.ts";

const DEFAULT_TIMEOUT_MS = 7000;
const GEMINI_MODEL = "gemini-2.5-flash";
const ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";

export interface CompleteTextInput {
  /** System / instruction guidance (voice, rules, framing). */
  system: string;
  /** Preserve exact quotes and JSON escapes for evidence extraction. */
  format?: "json";
  /** The user turn, the brief / data the model reasons over. */
  user: string;
  maxTokens?: number;
  temperature?: number;
  timeoutMs?: number;
  acceptOutput?: (text: string) => boolean;
  extractionModels?: { primary: string; fallback: string };
  onFailure?: (reason: string) => void;
  onAttempt?: (
    attempt: {
      provider: string;
      model: string;
      ms: number;
      output: string | null;
      reason?: string;
    },
  ) => void;
}

/**
 * Voice scrub: model output is often user- or Krish-facing and must never carry an em
 * dash (models are told not to, but are not always obedient). Replaces em/en dashes and
 * spaced ASCII '--' with sentence-appropriate punctuation, normalises the American
 * "judgment" to the British "judgement" the whole site uses, and tidies the artefacts.
 */
export function scrubVoice(input: string): string {
  let s = input;
  s = s.replace(/\s*[\u2013\u2014]\s*/g, ", ");
  s = s.replace(/\s+--\s+/g, ", ");
  s = s.replace(/\bjudgment(al|s)?\b/g, "judgement$1").replace(
    /\bJudgment(al|s)?\b/g,
    "Judgement$1",
  );
  s = s.replace(/,\s*,/g, ",").replace(/\s{2,}/g, " ").replace(/\s+,/g, ",");
  s = s.replace(/,\s*([.!?])/g, "$1");
  return s.trim();
}

/** Normalise model output: strips wrapping quotes, code fences, stray whitespace, em dashes. */
export function cleanOutput(raw: string): string {
  let s = raw.trim();
  s = s.replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return scrubVoice(s);
}

async function withGemini(
  input: CompleteTextInput,
  runtime: EnrichRuntime,
  model = GEMINI_MODEL,
): Promise<string | null> {
  const logger = runtime.logger;
  const key = runtime.env("GOOGLE_AI_API_KEY");
  if (!key) {
    logger.warn("GOOGLE_AI_API_KEY not set; skipping Gemini");
    return null;
  }
  try {
    const url =
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;
    const prompt = `${input.system}\n\n${input.user}`;
    const res = await runtime.request(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: input.temperature ?? 0.4,
            ...(input.format === "json"
              ? { responseMimeType: "application/json" }
              : {}),
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
      input.onFailure?.(
        `HTTP ${res.status}${
          res.status === 401 ? ": authentication rejected" : ""
        }`,
      );
      const body = await res.text().catch(() => "");
      logger.warn("Gemini non-2xx", {
        status: res.status,
        body: body.slice(0, 400),
      });
      return null;
    }
    const data = await res.json();
    const text: unknown = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (typeof text !== "string" || !text.trim()) {
      logger.warn("Gemini returned empty content", {
        finishReason: data?.candidates?.[0]?.finishReason,
      });
      return null;
    }
    const out = input.format === "json"
      ? text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
      : cleanOutput(text);
    return out.length ? out : null;
  } catch (err) {
    logger.error("Gemini call failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

async function withAnthropic(
  input: CompleteTextInput,
  runtime: EnrichRuntime,
  model = ANTHROPIC_MODEL,
): Promise<string | null> {
  const logger = runtime.logger;
  const key = runtime.env("ANTHROPIC_API_KEY");
  if (!key) {
    logger.warn("ANTHROPIC_API_KEY not set; skipping Anthropic fallback");
    return null;
  }
  try {
    const res = await runtime.request(
      "https://api.anthropic.com/v1/messages",
      {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          max_tokens: input.maxTokens ?? 300,
          // Claude 5 models reject `temperature` (HTTP 400, verified 17 Nov 2026); older models keep it.
          ...(/^claude-[a-z]+-5/.test(model)
            ? {}
            : { temperature: input.temperature ?? 0.4 }),
          system: input.system,
          messages: [{ role: "user", content: input.user }],
        }),
      },
      input.timeoutMs ?? DEFAULT_TIMEOUT_MS,
    );
    if (!res.ok) {
      input.onFailure?.(
        `HTTP ${res.status}${
          res.status === 401 ? ": authentication rejected" : ""
        }`,
      );
      const body = await res.text().catch(() => "");
      logger.warn("Anthropic non-2xx", {
        status: res.status,
        body: body.slice(0, 400),
      });
      return null;
    }
    const data = await res.json();
    const blocks: Array<{ type?: string; text?: string }> =
      Array.isArray(data?.content) ? data.content : [];
    const text = blocks
      .filter((b) => b?.type === "text" && typeof b.text === "string")
      .map((b) => b.text as string)
      .join("")
      .trim();
    if (!text) {
      logger.warn("Anthropic returned empty content", {
        stopReason: data?.stop_reason,
      });
      return null;
    }
    const out = input.format === "json"
      ? text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "")
      : cleanOutput(text);
    return out.length ? out : null;
  } catch (err) {
    logger.error("Anthropic call failed", {
      error: err instanceof Error ? err.message : String(err),
    });
    return null;
  }
}

/**
 * Complete a short text turn. Tries Gemini first; on any failure or empty result,
 * falls back to Anthropic Haiku. Returns cleaned (voice-scrubbed) text, or null if
 * both fail. Never throws.
 */
export async function completeText(
  input: CompleteTextInput,
  runtime: EnrichRuntime = defaultEnrichRuntime("enrich/llm"),
): Promise<string | null> {
  if (input.extractionModels) {
    const start = performance.now();
    for (
      const [provider, model] of [
        ["anthropic", input.extractionModels.primary],
        ["gemini", input.extractionModels.fallback],
      ]
    ) {
      const remaining = (input.timeoutMs ?? 90000) -
        (performance.now() - start);
      if (remaining <= 0) break;
      const attemptStart = performance.now();
      let reason: string | undefined;
      const output =
        await (provider === "anthropic" ? withAnthropic : withGemini)(
          {
            ...input,
            timeoutMs: remaining,
            onFailure: (value) => {
              reason = value;
            },
          },
          runtime,
          model,
        );
      input.onAttempt?.({
        provider,
        model,
        ms: Math.round(performance.now() - attemptStart),
        output,
        reason,
      });
      if (output && (input.acceptOutput?.(output) ?? true)) return output;
    }
    return null;
  }
  const logger = runtime.logger;
  const primary = await withGemini(input, runtime);
  if (primary) return primary;
  logger.info("Gemini unavailable; falling back to Anthropic");
  const fallback = await withAnthropic(input, runtime);
  if (fallback) return fallback;
  logger.error("Both completion providers failed");
  return null;
}
