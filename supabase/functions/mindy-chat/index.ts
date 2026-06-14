/**
 * @file mindy-chat Edge Function
 * @description Mindy's conversational reasoning endpoint for the Diagnosis Room.
 *
 * Mindy is the on-site guide: a visitor brings one nervous AI decision, Mindy
 * reflects their business back (from the enrichment dossier), diagnoses the
 * decision the way Krish would, then forks to one of three honest exits
 * (learn-by-chat / book a free 15-min call / generate a personalised proposal).
 *
 * This function runs Mindy's reasoning turn. It composes her Brain Pack (system
 * prompt + reasoning guide + fit rubric + pricing card) plus a formatted dossier
 * block, calls Claude, parses a strict-JSON turn, and runs the output through the
 * runtime voice gate before returning it.
 *
 * ## Request (POST, application/json)
 * ```
 * {
 *   messages: { role: 'user' | 'assistant'; content: string }[], // full turn history, oldest first
 *   dossier?: Dossier | null,   // enrichment dossier for the visitor's company, if known
 *   sessionId?: string,         // opaque client session id, logged only
 *   mode?: 'express' | 'full'   // 'express' rushes to the call (default 'full')
 * }
 * ```
 *
 * ## Response (200, application/json) — the parsed turn object
 * ```
 * {
 *   reply: string,                       // Mindy's next turn, in Krish's voice, SHORT (2-4 sentences, ~70 words)
 *   phase: 'reflect' | 'diagnose' | 'recommend' | 'fork' | 'chat',
 *   quickReplies: string[],              // 0-3 short tappable options answering the question just asked
 *   recommendation: {                    // null until Mindy has earned a recommendation
 *     mode: string,                      // e.g. "Mode A (productised)" / "Mode B (bespoke)"
 *     rung: string,                      // a canonical ladder rung name
 *     range: string,                     // a public range card band, NEVER an exact figure
 *     exit: 'self-serve' | 'book-call' | 'learn' | 'proposal'
 *   } | null,
 *   decisionBrief: {                     // null until the decision is decomposed
 *     realDecision: string,
 *     paths: { name: string; tradeoff: string }[],
 *     weakAssumption: string,
 *     next14Days: string
 *   } | null,
 *   readyForProposal: boolean,           // true once a proposal artefact would be honest
 *   readyForCall: boolean                // true once booking the call is the right door
 * }
 * ```
 *
 * ## Error (4xx/5xx, application/json)
 * ```
 * { error: string }
 * ```
 *
 * ## Critical privacy contract
 * The dossier's `scale.*` fields (employeeCount, sizeBand, trancoRank, icp,
 * recommendedMode) are INTERNAL ROUTING ONLY. They are fenced into a dedicated
 * "INTERNAL ROUTING" block in the system context with an explicit instruction
 * that Mindy must use them to choose the right door/mode but must NEVER recite
 * the numbers back to the user. They are never returned in the response and never
 * surfaced client-side.
 *
 * ## Pricing contract
 * Mindy quotes ranges only, never an exact figure. Above ~$100k or any
 * retainer/implementation/custom-terms request she stops quoting and books the
 * call. Enforced in the system context (PRICING_CARD) and reinforced here.
 *
 * Model: claude-sonnet-4-6 (fallback claude-haiku-4-5-20251001 on error).
 * Rate limit: 60 messages / IP / 10 min (in-memory, best-effort).
 * Cost cap: soft cap via MAX_TOKENS; hard circuit breaker via REQUEST_CEILING.
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import {
  MINDY_SYSTEM_PROMPT,
  REASONING_GUIDE,
  FIT_RUBRIC,
  PRICING_CARD,
} from "../_shared/mindy/knowledge.ts";
import { lintVoice } from "../_shared/mindy/voice-lint.ts";
import type { Dossier } from "../_shared/enrich/types.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const PRIMARY_MODEL = "claude-sonnet-4-6";
const FALLBACK_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 2000;
const ANTHROPIC_VERSION = "2023-06-01";

// In-memory abuse controls (per cold start, best-effort). This is a chat, so the
// window is generous relative to the one-shot Nervous Decision Machine.
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 60; // 60 messages per IP per window
const ipHits = new Map<string, number[]>();

// Global circuit breaker: refuse new work once the function has served this many
// successful calls since the last cold start.
let totalServed = 0;
const REQUEST_CEILING = 20000;

// Guardrails on the request payload.
const MAX_MESSAGES = 40; // most recent turns kept; older ones dropped
const MAX_CONTENT_CHARS = 4000; // per message
const MAX_TOTAL_CHARS = 24000; // across the whole transcript

/** Mindy's structured turn, the response contract. */
interface Recommendation {
  mode: string;
  rung: string;
  range: string;
  exit: "self-serve" | "book-call" | "learn" | "proposal";
}

interface DecisionBrief {
  realDecision: string;
  paths: { name: string; tradeoff: string }[];
  weakAssumption: string;
  next14Days: string;
}

interface MindyTurn {
  reply: string;
  phase: "reflect" | "diagnose" | "recommend" | "fork" | "chat";
  recommendation: Recommendation | null;
  decisionBrief: DecisionBrief | null;
  readyForProposal: boolean;
  readyForCall: boolean;
  /**
   * 0 to 3 short tappable options that directly answer the question Mindy just
   * asked. Each <=6 words. Empty when the question is genuinely open. The client
   * renders these as pills so the visitor can tap instead of type.
   */
  quickReplies: string[];
  /**
   * The visitor's company, when they name it in conversation and no dossier was
   * supplied up front. The client uses this to enrich in the background (logo,
   * brand, stack, recent signals) so the co-brand appears even without an email.
   * Null once known or when no company has been mentioned.
   */
  extractedCompany: { name?: string; domain?: string } | null;
}

type SessionMode = "express" | "full";

type ChatMessage = { role: "user" | "assistant"; content: string };

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

/**
 * Per-IP sliding-window rate limit. Returns true if the request is allowed and
 * records the hit; false if the window is already full.
 */
function allowRequest(ip: string, now: number): boolean {
  const windowStart = now - RATE_WINDOW_MS;
  const hits = (ipHits.get(ip) || []).filter((t) => t > windowStart);
  if (hits.length >= RATE_MAX) {
    ipHits.set(ip, hits);
    return false;
  }
  hits.push(now);
  ipHits.set(ip, hits);
  return true;
}

/**
 * The strict-output contract appended to the system context. Tells the model to
 * return one JSON object and nothing else, and pins the schema + the hard rules.
 */
const OUTPUT_CONTRACT = `# Your output contract (read carefully)

Return ONE JSON object and nothing else. No prose before or after, no markdown code fences, no commentary. The object must match this exact schema:

{
  "reply": string,            // your next turn to the visitor, in voice. SHORT: 2 to 4 sentences, hard cap ~70 words. One idea per turn. Never a wall of text.
  "phase": "reflect" | "diagnose" | "recommend" | "fork" | "chat",
  "quickReplies": string[],   // 0 to 3 short tappable options that directly answer the question you just asked. Each <=6 words. [] when the question is genuinely open.
  "recommendation": {         // null until you have earned a recommendation
    "mode": string,           // the routing mode, e.g. "Mode A (productised)" or "Mode B (bespoke)"
    "rung": string,           // a rung name from the canonical ladder only
    "range": string,          // a band from the public range card, e.g. "$2,000-$3,000". NEVER an exact figure
    "exit": "self-serve" | "book-call" | "learn" | "proposal"
  } | null,
  "decisionBrief": {          // null until you have decomposed the decision
    "realDecision": string,   // the real question under their surface ask
    "paths": [ { "name": string, "tradeoff": string } ],  // 2-3 honest paths, trade-off named on each
    "weakAssumption": string, // the one assumption that, if wrong, breaks their plan
    "next14Days": string      // one concrete instruction they can act on by Monday
  } | null,
  "readyForProposal": boolean,// true only once a proposal artefact would be honest
  "readyForCall": boolean,    // true only once booking the free call is the right door
  "extractedCompany": {       // the visitor's company, ONLY when they name it and you were not already given one. Else null.
    "name": string,           // the company name as they said it
    "domain": string          // their website domain if you can confidently infer it (e.g. "acme.com"), else omit
  } | null
}

Rules for the object:
- "reply" is the ONLY field the visitor sees. It carries your whole turn. Everything else is state for the room.
- BREVITY IS A HARD RULE. Keep "reply" to 2 to 4 sentences, around 70 words at most. One idea per turn. Ask one question, not three. Do not stack a reflection, a framework, and a question in the same turn. Short declarative, then the one sentence that earns it. If you have more to say, save it for the next turn.
- QUICK REPLIES (IMPORTANT — almost every turn needs these): the visitor is usually on a phone and wants to tap, not type. Whenever you ASK a question, put 2 to 4 tappable options in "quickReplies". This includes the OPENING "what is the decision?" turn: there you offer decision STARTERS that help them pick a lane, not canned answers (e.g. ["Build vs buy an AI tool", "Where do we even start", "Cut cost or add capability", "Commercialise our own AI"]). For follow-ups, offer the genuinely likely answers (e.g. ["Build it ourselves", "Buy a tool", "Not sure yet"], or ["This quarter", "Longer horizon", "No timeline yet"]). Keep each under ~6 words and make them real, tappable answers or starters. The visitor can always still type instead. Use [] ONLY on a turn where you are NOT asking a question at all (a pure statement on the way to the fork).
- CONVERGE FAST. This is a few turns, not an interview. Reflect, then ask the one real question, then reason, then recommend. One sharp question per turn, then converge. Do not interrogate. Give the visitor a sense of progress and an ending, never an endless loop.
- HARD CONVERGENCE RULE. By the user's third substantive turn you MUST produce a decisionBrief (the real decision, 2 to 3 paths with trade-offs, the weak assumption, the next 14 days) AND a recommendation, set the matching readyForProposal or readyForCall, and move to the fork. Do not keep probing past that. One sharp question per turn, then converge.
- KEEP THE JSON COMPACT. decisionBrief fields are concise: one line each, at most 3 paths, each path name and trade-off short. This is a hard rule, it keeps the object from truncating.
- Keep recommendation and decisionBrief null until you have actually earned them. Reflect, then reason, then recommend. Do not recommend on turn one.
- "range" is always a band from the public range card, never an exact number. If the situation is above ~$100k, a retainer, implementation, or custom terms, do not quote: set exit to "book-call", set readyForCall true, and leave range as the relevant band only if one honestly applies, otherwise use "set on the call".
- Set readyForProposal true only when you have a decisionBrief and a recommended self-serve or proposal exit. Set readyForCall true for high-stakes ambiguous fits, any enterprise/capital buyer at $12k+, strong fit with visible hesitation, the Immersion, or anything over the ceiling.
- EXTRACTED COMPANY: if the visitor names their company or website and you were NOT already given a dossier (no company is shown to you below), set "extractedCompany" with their company name (and the website domain if you can confidently infer it). This lets me quietly pull their logo and public context to ground the conversation. Set it the first turn you learn it, then null on later turns. Never ask for a company you have already been told. If a company is already known to you, or none has been mentioned, set extractedCompany to null. Do not announce that you are looking them up.
- Voice rules are hard. No em dashes. No banned buzzwords. Sentence case. Active voice. British-Australian. Second person. At most one exclamation mark, ideally zero. No emoji.
- Never recite any internal routing number (employee count, size band, rank). Use them silently to pick the door.`;

/**
 * Extra system instruction injected only in express mode. The visitor clicked
 * "Book a call" and wants to book, not run a full diagnosis. Collect only what is
 * needed to brief Krish, then exit to the call fast.
 */
const EXPRESS_DIRECTIVE = `# EXPRESS MODE (active for this session)

The visitor came here to book the call, not to be diagnosed. Respect that.
- Keep it to one or two turns total. Do NOT run a full diagnosis.
- Collect only what Krish needs to open warm: the one-line decision they want help with, and a quick confirm of who they are (name and company, if not already known from the dossier).
- Offer quickReplies wherever they help (e.g. ["Build vs buy", "Cut costs with AI", "Commercialise our AI"]).
- Tell them warmly and plainly that the fastest path is the call, and that you are getting them straight there.
- As soon as you have the one-line decision and know who they are, set "readyForCall" true and set recommendation.exit to "book-call". Keep "decisionBrief" light or null; a full brief is not required to book.
- Stay in voice, ranges only, never recite internal routing. Brevity still applies: 2 to 4 sentences.`;

/**
 * Formats the dossier into two clearly-separated blocks for the system context:
 *  - a user-facing "what you already know" block (identity / understanding /
 *    currency / synthesis), which Mindy may reflect back, and
 *  - a fenced INTERNAL ROUTING block (scale.*), which Mindy must use only to
 *    choose the right door/mode and must NEVER recite.
 * If the dossier is null/absent, returns an instruction to ask the one real
 * question and not fake knowledge.
 */
function formatDossierBlock(dossier: Dossier | null | undefined): string {
  if (!dossier) {
    return `# Dossier

There is no enrichment dossier for this visitor. Do not pretend to know their business. Do not invent a company, a sector, or numbers. Open by reflecting only what they themselves have said in this conversation, then ask the one real question only they can answer: what is the AI decision actually keeping them up. If they have not given you a company yet, ask for the one thing you genuinely need (their company or domain), and say plainly that you would rather know than guess.`;
  }

  const lines: string[] = [];
  const id = dossier.identity || {};
  const u = dossier.understanding || {};

  lines.push("# Dossier");
  lines.push("");
  lines.push(
    "## What you already know about them (safe to reflect back, hand them the pen to correct it)",
  );
  if (id.name) lines.push(`- Company: ${id.name}`);
  if (dossier.domain) lines.push(`- Domain: ${dossier.domain}`);
  if (id.founded) lines.push(`- Founded: ${id.founded}`);
  if (u.descriptor) lines.push(`- What they do: ${u.descriptor}`);
  if (u.tagline) lines.push(`- Tagline: ${u.tagline}`);
  if (u.industry) lines.push(`- Industry: ${u.industry}`);
  if (u.products?.length) {
    lines.push(`- Products: ${u.products.slice(0, 6).join(", ")}`);
  }
  if (u.stack?.length) {
    lines.push(`- Notable stack: ${u.stack.slice(0, 8).join(", ")}`);
  }
  if (dossier.synthesis) {
    lines.push(`- Working read (correct me if wrong): ${dossier.synthesis}`);
  }
  if (dossier.currency?.length) {
    lines.push("- Recent and current (cite provenance if you use these):");
    for (const c of dossier.currency.slice(0, 5)) {
      const date = c.date ? ` (${c.date})` : "";
      lines.push(`  - ${c.text}${date} [${c.source}]`);
    }
  }

  // Confidence note: if a claim is low confidence, Mindy should stay silent
  // rather than bluff. Surface the per-layer confidence so the model can judge.
  if (dossier.confidence && Object.keys(dossier.confidence).length) {
    const conf = Object.entries(dossier.confidence)
      .map(([k, v]) => `${k}:${typeof v === "number" ? v.toFixed(2) : v}`)
      .join(", ");
    lines.push(
      `- Confidence per layer: ${conf}. If a claim is low confidence, stay silent rather than bluff. One wrong fact collapses the spell.`,
    );
  }

  // The fenced internal block. scale.* is routing only and must never be recited.
  const s = dossier.scale || {};
  lines.push("");
  lines.push(
    "## INTERNAL ROUTING — never recite these numbers to the user; use them only to choose the right door/mode",
  );
  lines.push(
    "These are private signals. Do not say the employee count, size band, or rank out loud, and do not paraphrase them ('a company your size', 'a few hundred people'). Use them silently to route to the right mode and rung.",
  );
  if (s.employeeCount !== undefined) {
    lines.push(`- employeeCount: ${s.employeeCount}`);
  }
  if (s.sizeBand) lines.push(`- sizeBand: ${s.sizeBand}`);
  if (s.trancoRank !== undefined) lines.push(`- trancoRank: ${s.trancoRank}`);
  if (s.icp) lines.push(`- icp: ${s.icp}`);
  if (s.recommendedMode) {
    lines.push(`- recommendedMode: ${s.recommendedMode}`);
  }
  if (
    s.employeeCount === undefined &&
    !s.sizeBand &&
    s.trancoRank === undefined &&
    !s.icp &&
    !s.recommendedMode
  ) {
    lines.push("- (no routing signals resolved; route from the conversation)");
  }

  return lines.join("\n");
}

/** Composes the full system context Mindy reasons with. */
function buildSystemContext(
  dossier: Dossier | null | undefined,
  mode: SessionMode = "full",
): string {
  const parts = [
    MINDY_SYSTEM_PROMPT,
    "\n---\n",
    "# Companion layer: reasoning-fewshots\n",
    REASONING_GUIDE,
    "\n---\n",
    "# Companion layer: fit-and-walkaway-rubric\n",
    FIT_RUBRIC,
    "\n---\n",
    "# Companion layer: pricing-range-model\n",
    PRICING_CARD,
    "\n---\n",
    formatDossierBlock(dossier),
    "\n---\n",
    OUTPUT_CONTRACT,
  ];
  if (mode === "express") {
    parts.push("\n---\n", EXPRESS_DIRECTIVE);
  }
  return parts.join("\n");
}

/** Robustly parse the model output into a MindyTurn, NDM-style. */
function parseTurn(raw: string): MindyTurn | null {
  let parsed: unknown = null;
  try {
    parsed = JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        parsed = null;
      }
    }
  }
  if (!parsed || typeof parsed !== "object") return null;
  return normaliseTurn(parsed as Record<string, unknown>);
}

/**
 * Last-resort salvage when the model output is not usable JSON (most commonly a
 * mid-JSON truncation on a deep turn carrying a full decisionBrief). Rather than
 * 502 the whole turn, try to recover at least the "reply" string with a tolerant
 * regex and return a minimal valid turn so the visitor keeps moving. Returns null
 * only when no reply text at all can be recovered.
 */
function salvageTurn(raw: string): MindyTurn | null {
  const m = raw.match(/"reply"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (!m) return null;
  let reply = "";
  try {
    // JSON-unescape the captured fragment by wrapping it back into a string.
    reply = JSON.parse(`"${m[1]}"`);
  } catch {
    // If the fragment itself is malformed, fall back to a naive unescape.
    reply = m[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t")
      .replace(/\\\\/g, "\\");
  }
  reply = reply.trim();
  if (!reply) return null;
  return {
    reply,
    phase: "chat",
    recommendation: null,
    decisionBrief: null,
    readyForProposal: false,
    readyForCall: false,
    quickReplies: [],
    extractedCompany: null,
  };
}

/**
 * Coerce a loosely-shaped object into a valid MindyTurn, filling safe defaults
 * so the client always receives the full contract. Returns null if there is no
 * usable reply at all.
 */
function normaliseTurn(o: Record<string, unknown>): MindyTurn | null {
  const reply = typeof o.reply === "string" ? o.reply.trim() : "";
  if (!reply) return null;

  const phaseRaw = typeof o.phase === "string" ? o.phase : "chat";
  const phase = (
    ["reflect", "diagnose", "recommend", "fork", "chat"].includes(phaseRaw)
      ? phaseRaw
      : "chat"
  ) as MindyTurn["phase"];

  let recommendation: Recommendation | null = null;
  const r = o.recommendation as Record<string, unknown> | null | undefined;
  if (r && typeof r === "object") {
    const exitRaw = typeof r.exit === "string" ? r.exit : "";
    const exit = (
      ["self-serve", "book-call", "learn", "proposal"].includes(exitRaw)
        ? exitRaw
        : "learn"
    ) as Recommendation["exit"];
    recommendation = {
      mode: typeof r.mode === "string" ? r.mode : "",
      rung: typeof r.rung === "string" ? r.rung : "",
      range: typeof r.range === "string" ? r.range : "",
      exit,
    };
  }

  let decisionBrief: DecisionBrief | null = null;
  const b = o.decisionBrief as Record<string, unknown> | null | undefined;
  if (b && typeof b === "object") {
    const rawPaths = Array.isArray(b.paths) ? b.paths : [];
    const paths = rawPaths
      .map((p) => {
        const pp = p as Record<string, unknown>;
        return {
          name: typeof pp?.name === "string" ? pp.name : "",
          tradeoff: typeof pp?.tradeoff === "string" ? pp.tradeoff : "",
        };
      })
      .filter((p) => p.name || p.tradeoff);
    decisionBrief = {
      realDecision:
        typeof b.realDecision === "string" ? b.realDecision : "",
      paths,
      weakAssumption:
        typeof b.weakAssumption === "string" ? b.weakAssumption : "",
      next14Days: typeof b.next14Days === "string" ? b.next14Days : "",
    };
  }

  // quickReplies: 0 to 3 short, tappable options. Coerce to clean strings,
  // drop empties, clamp length and count, default to [].
  let quickReplies: string[] = [];
  if (Array.isArray(o.quickReplies)) {
    quickReplies = o.quickReplies
      .map((q) => (typeof q === "string" ? q.trim() : ""))
      .filter((q) => q.length > 0)
      .map((q) => (q.length > 40 ? q.slice(0, 40) : q))
      .slice(0, 3);
  }

  // extractedCompany: a name (and optional domain) the visitor revealed. Coerce
  // to clean strings, drop empties, cap length, default to null.
  let extractedCompany: { name?: string; domain?: string } | null = null;
  const ec = o.extractedCompany as Record<string, unknown> | null | undefined;
  if (ec && typeof ec === "object") {
    const name = typeof ec.name === "string" ? ec.name.trim() : "";
    const domain = typeof ec.domain === "string" ? ec.domain.trim() : "";
    if (name || domain) {
      extractedCompany = {};
      if (name) extractedCompany.name = name.slice(0, 120);
      if (domain) extractedCompany.domain = domain.slice(0, 120);
    }
  }

  return {
    reply,
    phase,
    recommendation,
    decisionBrief,
    readyForProposal: o.readyForProposal === true,
    readyForCall: o.readyForCall === true,
    quickReplies,
    extractedCompany,
  };
}

/** One call to the Anthropic Messages API. Returns the joined text, or throws. */
async function callAnthropic(
  model: string,
  system: string,
  messages: ChatMessage[],
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system,
      messages,
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`anthropic ${res.status}: ${errText.slice(0, 500)}`);
  }

  const data = await res.json();
  return Array.isArray(data?.content)
    ? data.content
        .filter((c: { type: string }) => c.type === "text")
        .map((c: { text: string }) => c.text)
        .join("")
    : "";
}

/**
 * Last-resort minimal cleanup of voice violations that survive the corrective
 * re-call: strip em/spaced dashes and exclamation overrun rather than block the
 * turn. Banned tokens are left intact (replacing them risks nonsense); the
 * re-call is the real guard, this only keeps a near-miss from being rejected.
 */
function softScrub(text: string): string {
  let out = text
    .replace(/—/g, ", ") // em dash -> comma
    .replace(/\s--\s/g, ", "); // spaced double-hyphen -> comma
  // Collapse multiple exclamation marks down to one.
  let seenBang = false;
  out = out.replace(/!/g, () => {
    if (seenBang) return ".";
    seenBang = true;
    return "!";
  });
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
  }

  if (!ANTHROPIC_API_KEY) {
    return json({ error: "Mindy is offline. Try again in a bit." }, 503);
  }

  if (totalServed >= REQUEST_CEILING) {
    return json({ error: "High demand right now. Try again later." }, 429);
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("cf-connecting-ip") ||
    "unknown";

  const now = Date.now();
  if (!allowRequest(ip, now)) {
    return json(
      { error: "You are going quickly. Give it a moment and continue." },
      429,
    );
  }

  // Parse and validate the request body.
  let body: {
    messages?: unknown;
    dossier?: Dossier | null;
    sessionId?: unknown;
    mode?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  const rawMessages = Array.isArray(body?.messages) ? body.messages : [];
  let messages: ChatMessage[] = rawMessages
    .map((m) => {
      const mm = m as Record<string, unknown>;
      const role = mm?.role === "assistant" ? "assistant" : "user";
      const content =
        typeof mm?.content === "string" ? mm.content.trim() : "";
      return { role, content } as ChatMessage;
    })
    .filter((m) => m.content.length > 0);

  if (messages.length === 0) {
    return json({ error: "Say something to start the room." }, 400);
  }

  // Keep only the most recent turns, clamp per-message and total length.
  if (messages.length > MAX_MESSAGES) {
    messages = messages.slice(-MAX_MESSAGES);
  }
  messages = messages.map((m) => ({
    role: m.role,
    content:
      m.content.length > MAX_CONTENT_CHARS
        ? m.content.slice(0, MAX_CONTENT_CHARS)
        : m.content,
  }));
  let total = messages.reduce((n, m) => n + m.content.length, 0);
  while (total > MAX_TOTAL_CHARS && messages.length > 1) {
    const dropped = messages.shift();
    total -= dropped ? dropped.content.length : 0;
  }

  // The Anthropic API requires the first message to be from the user.
  while (messages.length > 0 && messages[0].role !== "user") {
    messages.shift();
  }
  if (messages.length === 0) {
    return json({ error: "Say something to start the room." }, 400);
  }

  const dossier = (body?.dossier as Dossier | null | undefined) ?? null;
  const mode: SessionMode = body?.mode === "express" ? "express" : "full";
  let system = buildSystemContext(dossier, mode);

  // Convergence nudge. Count the visitor's substantive turns from the (already
  // assistant-stripped, length-clamped) history. By the third user turn Mindy
  // must stop probing and produce the decisionBrief and recommendation, then
  // move to the fork. Express mode rushes to the call already, so skip it there.
  const userTurnCount = messages.filter((m) => m.role === "user").length;
  if (mode !== "express" && userTurnCount >= 3) {
    system +=
      "\n---\n# Convergence nudge (this turn)\nThe visitor has given you enough. Produce the decisionBrief and recommendation in THIS turn and move to the fork; do not ask another open question. Keep the reply short, ranges only, never recite the internal routing numbers.";
  }

  // Primary call, with one model fallback on transport/HTTP error.
  let raw = "";
  try {
    raw = await callAnthropic(PRIMARY_MODEL, system, messages);
  } catch (e1) {
    console.error("mindy-chat primary model failed", e1);
    try {
      raw = await callAnthropic(FALLBACK_MODEL, system, messages);
    } catch (e2) {
      console.error("mindy-chat fallback model failed", e2);
      return json({ error: "Mindy hit a snag. Try again in a minute." }, 502);
    }
  }

  let turn = parseTurn(raw);
  if (!turn) {
    // The JSON was unusable (most often a deep-turn truncation mid-object).
    // Salvage at least the reply rather than hard-failing the turn.
    turn = salvageTurn(raw);
  }
  if (!turn) {
    return json({ error: "Mindy gave an unusable answer. Try again." }, 502);
  }

  // Voice gate. If the reply fails, do ONE corrective re-call asking for a clean
  // rewrite of the reply only, with the specific violations listed. If it still
  // fails, scrub the offending tokens minimally rather than block the turn.
  let lint = lintVoice(turn.reply);
  if (!lint.ok) {
    try {
      const correction: ChatMessage[] = [
        ...messages,
        { role: "assistant", content: raw },
        {
          role: "user",
          content:
            "Your reply broke the voice rules: " +
            lint.violations.join("; ") +
            ". Rewrite ONLY the JSON, keeping every field the same, but fix the reply so it has no em dashes, no banned buzzwords, at most one exclamation mark, sentence case, active voice, second person, British-Australian. Return the JSON object and nothing else.",
        },
      ];
      const rawFix = await callAnthropic(PRIMARY_MODEL, system, correction);
      const fixed = parseTurn(rawFix) ?? salvageTurn(rawFix);
      if (fixed) {
        const fixedLint = lintVoice(fixed.reply);
        if (fixedLint.ok) {
          turn = fixed;
          lint = fixedLint;
        } else {
          // Prefer the cleaner of the two, then scrub.
          turn = fixed;
          lint = fixedLint;
        }
      }
    } catch (e) {
      console.error("mindy-chat voice re-call failed", e);
      // fall through to scrub
    }

    if (!lint.ok) {
      const scrubbed = softScrub(turn.reply);
      const scrubbedLint = lintVoice(scrubbed);
      // Only adopt the scrub if it actually reduced violations.
      if (scrubbedLint.violations.length < lint.violations.length) {
        turn.reply = scrubbed;
      }
    }
  }

  // Safety net: never strand the visitor on the OPENING question with nothing to
  // tap. If the model returned no quick replies on its first reply to the visitor
  // (and it is not closing the fork), seed decision starters so the flow stays
  // tap-through from the very first turn. Later turns rely on the prompt rule.
  if (
    turn.quickReplies.length === 0 &&
    turn.phase !== "fork" &&
    !turn.readyForCall &&
    !turn.readyForProposal &&
    messages.filter((m) => m.role === "user").length <= 1
  ) {
    turn.quickReplies = [
      "Build vs buy an AI tool",
      "Where do we even start",
      "Cut cost or add capability",
      "Commercialise our own AI",
    ];
  }

  totalServed += 1;
  return json(turn);
});
