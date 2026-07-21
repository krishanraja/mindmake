// Mindmaker personalize-intake
// Turns a SAFE company dossier (never dossier.scale.*) plus the visitor's seat into a couple
// of tiny, bespoke, voice-linted microcopy fragments for the static /intake form. Progressive
// enhancement only: the intake page always has a deterministic fallback, so on any failure,
// empty input, or off-voice output we simply return { fragments: {} } and the page uses its
// own copy. Deploy with verify_jwt = false (called from the static page with the anon key).

import { corsHeaders, json, handlePreflight } from "../_shared/http/cors.ts";
import { completeText } from "../_shared/enrich/llm.ts";
import { lintVoice } from "../_shared/mindy/voice-lint.ts";

interface SafeDossier {
  company?: string;
  industry?: string;
  tagline?: string;
  descriptor?: string;
  stack?: string[];
  news?: string;
}

// Only these fragment keys are ever returned. Each maps to one deterministic slot the client
// already owns, so a missing/dropped fragment is invisible.
const FRAGMENT_KEYS = ["business_reflect", "aspiration_nudge"] as const;

const SYSTEM = `You are Mindy, the on-site guide for Mindmaker, writing in Krish Raja's voice: a sharp, dry, senior operator talking to a peer. Confident, not arrogant. Cynical, not negative. Never salesy, never a cheerleader.

You are writing one or two tiny pieces of microcopy for a pre-session intake form, using ONLY the facts you are given about the visitor's company. The anti-bluff rule is absolute: if you are not sure of something, do not say it. One wrong fact collapses the spell. Never invent a product, a metric, a customer, a claim, or a detail that is not in the facts you were given.

Return STRICT JSON and nothing else (no prose, no code fence):
{
  "business_reflect": string,  // <= 18 words. A sharp one-line reflection of what this company does, ending by inviting a correction (for example: "Fix anything I got wrong."). Reflect only the given facts. Use "" if you cannot say something specific and true.
  "aspiration_nudge": string   // <= 16 words. A grounded nudge for the question "a year from now, where do you want to be with AI?", tuned to their world. Use "" if you have nothing specific and true to add.
}

Rules: sentence case, never title case. No em dashes. No exclamation marks. Do not name or address the visitor. Never mention or imply company size, employee count, headcount, revenue, or web rank (you are not given these and must never guess them). Avoid these words: transformation, synergy, ecosystem, journey, unlock, seamless, empower, optimize, enhance, elevate, robust, cutting-edge, revolutionary, leverage as a verb. If a fragment cannot be written cleanly and truthfully, return "" for it.`;

function buildUser(safe: SafeDossier, seat?: string | null): string {
  const l: string[] = ["Facts about the company (use only these, invent nothing):"];
  if (safe.company) l.push(`- Name: ${safe.company}`);
  if (safe.industry) l.push(`- Industry: ${safe.industry}`);
  if (safe.descriptor) l.push(`- What they do: ${safe.descriptor}`);
  if (safe.tagline) l.push(`- Tagline: ${safe.tagline}`);
  if (Array.isArray(safe.stack) && safe.stack.length) l.push(`- Notable stack: ${safe.stack.slice(0, 8).join(", ")}`);
  if (safe.news) l.push(`- Recent: ${safe.news}`);
  if (seat) l.push(`\nThe visitor's seat / role: ${seat}`);
  l.push(`\nWrite the JSON now.`);
  return l.join("\n");
}

// Pull a JSON object out of the model text, tolerating any stray wrapping.
function parseFragments(raw: string): Record<string, unknown> {
  const s = raw.trim().replace(/^```[a-z]*\n?/i, "").replace(/\n?```$/i, "").trim();
  const a = s.indexOf("{");
  const b = s.lastIndexOf("}");
  if (a < 0 || b < 0 || b < a) return {};
  try {
    const o = JSON.parse(s.slice(a, b + 1));
    return o && typeof o === "object" ? o as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

// Keep only non-empty fragments that pass the runtime voice gate. Anything off-voice
// (banned token, em dash, exclamation) is dropped so the client falls back cleanly.
function cleanFragments(o: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const key of FRAGMENT_KEYS) {
    const v = o[key];
    if (typeof v !== "string") continue;
    const t = v.trim();
    if (!t) continue;
    if (!lintVoice(t).ok) continue;
    out[key] = t;
  }
  return out;
}

Deno.serve(async (req) => {
  const preflight = handlePreflight(req);
  if (preflight) return preflight;
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed." }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const body = await req.json().catch(() => null);
    const safe: SafeDossier = (body && typeof body === "object" && body.safe) || {};
    const seat: string | null = body && typeof body.seat === "string" ? body.seat : null;

    // Nothing worth personalising from (free-email / failed enrichment) -> deterministic fallback.
    if (!safe.company && !safe.industry && !safe.descriptor && !safe.tagline) {
      return json({ fragments: {} });
    }

    const raw = await completeText({
      system: SYSTEM,
      user: buildUser(safe, seat),
      maxTokens: 220,
      temperature: 0.5,
      timeoutMs: 7000,
    });
    if (!raw) return json({ fragments: {} });

    return json({ fragments: cleanFragments(parseFragments(raw)) });
  } catch (_e) {
    // Never surface an error to the page; it always has its own copy.
    return json({ fragments: {} });
  }
});
