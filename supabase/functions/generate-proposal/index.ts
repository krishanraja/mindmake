/**
 * @file generate-proposal Edge Function
 * @description The on-the-fly proposal generator for the Diagnosis Room.
 *
 * Once Mindy has diagnosed a visitor's nervous AI decision, this turns the
 * decision brief + recommendation into the visitor's own co-branded one-pager
 * (Mindmaker x [their company]). The deterministic shell paints from a mode
 * scaffold + the dossier + selected proof; the reflective prose slots are
 * generated in a single Claude call, voice-linted, and merged in clean. The
 * renderer (`renderProposalHtml`) produces a self-contained, print-ready A4
 * sheet. When format==='pdf' the HTML is rendered to a PDF via Browserless.
 *
 * ## Request (POST, application/json)
 * ```
 * {
 *   dossier?: Dossier | null,
 *   decisionBrief: {                      // REQUIRED
 *     realDecision: string,
 *     paths: { name: string; tradeoff: string }[],
 *     weakAssumption: string,
 *     next14Days: string
 *   },
 *   recommendation: {                     // REQUIRED
 *     mode: string,                       // routing mode, e.g. "Mode B (bespoke)" or a scaffold key
 *     rung: string,                       // a canonical ladder rung name
 *     price: string,                      // the published price for the recommended rung
 *     exit: 'self-serve' | 'book-call' | 'learn' | 'proposal'
 *   },
 *   contact?: { name?: string; email?: string; company?: string },
 *   format?: 'html' | 'pdf'               // default 'html'
 * }
 * ```
 *
 * ## Response
 * - format==='html' (default), 200, application/json:
 *   ```
 *   { html: string, payload: ProposalPayload, proposalId: string }
 *   ```
 * - format==='pdf', 200, application/json (base64 chosen for a clean front-end
 *   download path; see note below):
 *   ```
 *   { pdfBase64: string, proposalId: string, contentType: 'application/pdf' }
 *   ```
 * - format==='pdf' but Browserless failed, 200, application/json (graceful
 *   fallback so the front-end can print-to-PDF client-side):
 *   ```
 *   { html: string, payload: ProposalPayload, proposalId: string,
 *     pdfFallback: true, pdfError: string }
 *   ```
 * - Error, 4xx/5xx, application/json: `{ error: string }`
 *
 * ### Why base64 JSON for the PDF
 * The Diagnosis Room is a JSON conversation; returning the PDF as a base64 field
 * alongside the stable `proposalId` lets the front-end keep one response shape,
 * trigger a download with a data: URL, and fall back to client print without a
 * second request. Raw `application/pdf` bytes would force a separate transport.
 *
 * ## Critical contracts (mirrored from the proposal types + knowledge layer)
 * - The price block shows recommendation.price, the published figure for the
 *   recommended rung. If exit==='book-call', or the scope falls outside the two
 *   engagements, the fee reads "set on the call" instead. (Enforced here AND in
 *   the renderer's resolveFee().)
 * - PROOF is SELECTED via selectProof(), never written.
 * - VOICE. Every LLM-generated prose slot clears lintVoice() before it is placed
 *   on the payload. One corrective re-call, then a soft em-dash scrub.
 *
 * Model: claude-sonnet-4-6 (fallback claude-haiku-4-5-20251001).
 * Env: ANTHROPIC_API_KEY (prose), BROWSERLESS_API_KEY (PDF, optional).
 * Rate limit: 20 proposals / IP / 10 min (in-memory, best-effort).
 * Cost cap: soft cap via MAX_TOKENS; hard circuit breaker via REQUEST_CEILING.
 */

import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

import { lintVoice } from "../_shared/mindy/voice-lint.ts";
import { selectProof } from "../_shared/mindy/proof-index.ts";
import { getModeScaffold } from "../_shared/proposal/deliverables.ts";
import { renderProposalHtml } from "../_shared/proposal/template.ts";
import type {
  DecisionBrief,
  ProposalContact,
  ProposalPayload,
  Recommendation,
} from "../_shared/proposal/types.ts";
import type { Dossier, Icp } from "../_shared/enrich/types.ts";

// ── config ────────────────────────────────────────────────────────────────────

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY") || "";
const BROWSERLESS_API_KEY = Deno.env.get("BROWSERLESS_API_KEY") || "";

const PRIMARY_MODEL = "claude-sonnet-4-6";
const FALLBACK_MODEL = "claude-haiku-4-5-20251001";
const MAX_TOKENS = 1100;
const ANTHROPIC_VERSION = "2023-06-01";

// Browserless. The current, working endpoint shape is the regional host with the
// token as a query param and a JSON body of { html, options }. We smoke-test the
// endpoint with a tiny HTML before sending the real (large) document, and fall
// back to the legacy host if the primary 404s.
const BROWSERLESS_PRIMARY = "https://production-sfo.browserless.io/pdf";
const BROWSERLESS_LEGACY = "https://chrome.browserless.io/pdf";

// In-memory abuse controls (per cold start, best-effort).
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_MAX = 20; // 20 proposals per IP per window
const ipHits = new Map<string, number[]>();

// Global circuit breaker: refuse new work once this many successful calls have
// been served since the last cold start.
let totalServed = 0;
const REQUEST_CEILING = 5000;

// ── response helper ─────────────────────────────────────────────────────────────

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

// ── rate limit ──────────────────────────────────────────────────────────────────

/** Per-IP sliding-window rate limit. Records the hit when allowed. */
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

// ── the prose slots the LLM fills ────────────────────────────────────────────────

/** The strict-JSON prose contract returned by the single Claude call. */
interface ProseSlots {
  heroHeadline: string;
  heroLead: string;
  whatIHeardIntro: string;
  whatIHeardBullets: string[];
  engagementIntro: string;
  whatYouKeepHero: string;
  whatYouKeepFoot: string;
}

/** Every prose slot we lint, as flat strings, in the order they are generated. */
function flattenSlots(s: ProseSlots): { key: string; text: string }[] {
  const out: { key: string; text: string }[] = [
    { key: "heroHeadline", text: s.heroHeadline },
    { key: "heroLead", text: s.heroLead },
    { key: "whatIHeardIntro", text: s.whatIHeardIntro },
    { key: "engagementIntro", text: s.engagementIntro },
    { key: "whatYouKeepHero", text: s.whatYouKeepHero },
    { key: "whatYouKeepFoot", text: s.whatYouKeepFoot },
  ];
  (s.whatIHeardBullets || []).forEach((b, i) =>
    out.push({ key: `whatIHeardBullets[${i}]`, text: b }),
  );
  return out;
}

// ── domain / co-brand resolution ─────────────────────────────────────────────────

/** Pull the registrable root word from a domain, e.g. "dothinkdo.com" -> "Dothinkdo". */
function domainRootName(domain?: string): string | undefined {
  if (!domain) return undefined;
  const bare = domain
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];
  const root = bare.split(".")[0];
  if (!root) return undefined;
  return root.charAt(0).toUpperCase() + root.slice(1);
}

/** Resolve the client display name: identity.name -> contact.company -> domain root. */
function resolveClientName(
  dossier: Dossier | null,
  contact: ProposalContact | undefined,
): string {
  return (
    dossier?.identity?.name?.trim() ||
    contact?.company?.trim() ||
    domainRootName(dossier?.domain) ||
    "your company"
  );
}

// ── prose generation (single Claude call) ─────────────────────────────────────────

/**
 * The system context for the prose call. Grounds the model in Krish's voice and
 * the hard contracts, then pins the strict-JSON output shape. The deterministic
 * spine (deliverables, value cards, guarantee, phase 2, proof, price) is NOT the
 * model's job; it only writes the reflective slots that wrap that spine.
 */
function buildProseSystem(): string {
  return `You are Krish Raja, founder of Mindmaker, the anti-consultancy for leaders who are done being sold AI and ready to use it. You are writing the reflective prose for a visitor's own co-branded one-page proposal, generated live after you diagnosed their nervous AI decision in the Diagnosis Room.

You write ONLY the reflective slots that wrap an already-built proposal. The numbered deliverables, the value cards, the proof tiles, the guarantee, the price band and the phase-2 tracks are already written and locked. Do not restate them. Your job is the human framing: the hero line, the lead, the "what I heard" reflection, the engagement intro, and the "what you keep" hero and foot.

Ground every line in the dossier and the decision brief you are given. Name one real, specific fact from their world where it lands naturally (their company, their sector, the actual decision, the actual trade-off). Reflect their decision back sharper than they said it. Never flatter, never hype.

HARD RULES (these are not style preferences):
- DO NOT WRITE A PRICE IN PROSE. The price block already renders the number. If you reference cost at all, keep it qualitative ("what it costs", "set on the call"). Never invent a figure and never offer a discount.
- VOICE. No em dashes, ever. No spaced double-hyphen, no word-joining en dash (numeric ranges like $8,000-$25,000 are fine). No buzzwords (transformation, synergy, ecosystem, journey, unlock, seamless, empower, game-changer, cutting-edge, revolutionary, leverage-as-a-verb, optimise, enhance, maximise, robust, holistic, and the rest of the banned list). Active voice. Sentence case. British-Australian spelling. Second person. At most one exclamation mark, ideally zero. No emoji.
- Short declarative sentences, then a longer one that earns it. Real specifics over adjectives. Concede the honest other side before you land a point.
- Do not invent a client outcome, a named customer, a duration, or an offer name. If a fact is not in the dossier, do not assert it.

# Your output contract (read carefully)

Return ONE JSON object and nothing else. No prose before or after, no markdown code fences, no commentary. The object must match this exact schema:

{
  "heroHeadline": string,        // one line, <=14 words, the sharp promise of the recommended next step. No price.
  "heroLead": string,            // 1-2 sentences. What this sheet is: the diagnosis, written down. Reference their decision.
  "whatIHeardIntro": string,     // 1-2 sentences. The surface ask vs the real decision underneath, in their world.
  "whatIHeardBullets": string[], // 3-5 short lines. The real decision, the weak assumption, the honest paths with the trade-off named, the next 14 days. One fact each. End each with a full stop.
  "engagementIntro": string,     // 1-2 sentences framing the shape of the work for THEIR decision. Do not list deliverables.
  "whatYouKeepHero": string,     // 1-2 sentences. What stays when you leave, for them specifically. May use real specifics.
  "whatYouKeepFoot": string      // 1 sentence. The closing note under the value cards. Operator tone.
}`;
}

/** Compact, model-readable brief of the dossier + decision + recommendation. */
function buildProseUser(
  dossier: Dossier | null,
  brief: DecisionBrief,
  rec: Recommendation,
  clientName: string,
): string {
  const lines: string[] = [];

  lines.push("# The visitor and their decision");
  lines.push("");
  lines.push(`Client name (for co-brand): ${clientName}`);

  if (dossier) {
    const id = dossier.identity || {};
    const u = dossier.understanding || {};
    if (dossier.domain) lines.push(`Domain: ${dossier.domain}`);
    if (id.founded) lines.push(`Founded: ${id.founded}`);
    if (u.descriptor) lines.push(`What they do: ${u.descriptor}`);
    if (u.tagline) lines.push(`Tagline: ${u.tagline}`);
    if (u.industry) lines.push(`Industry: ${u.industry}`);
    if (u.products?.length) {
      lines.push(`Products: ${u.products.slice(0, 6).join(", ")}`);
    }
    if (u.stack?.length) {
      lines.push(`Notable stack: ${u.stack.slice(0, 8).join(", ")}`);
    }
    if (dossier.synthesis) {
      lines.push(`Working read of them: ${dossier.synthesis}`);
    }
    if (dossier.currency?.length) {
      lines.push("Recent and current:");
      for (const c of dossier.currency.slice(0, 4)) {
        lines.push(`  - ${c.text}${c.date ? ` (${c.date})` : ""}`);
      }
    }
    // scale.* is internal routing only: NEVER reflected back, so it is not
    // included in the prose brief at all.
  } else {
    lines.push(
      "No enrichment dossier. Do not invent a company, a sector, or numbers. Ground the prose in the decision brief alone, and keep the co-brand to the client name.",
    );
  }

  lines.push("");
  lines.push("# The decision brief (from the diagnosis)");
  lines.push(`Real decision: ${brief.realDecision || "(not captured)"}`);
  if (brief.weakAssumption) {
    lines.push(`Weakest assumption to test: ${brief.weakAssumption}`);
  }
  if (brief.paths?.length) {
    lines.push("Honest paths:");
    for (const p of brief.paths) {
      lines.push(`  - ${p.name}: ${p.tradeoff}`);
    }
  }
  if (brief.next14Days) {
    lines.push(`Next 14 days: ${brief.next14Days}`);
  }

  lines.push("");
  lines.push("# The recommendation (locked, do not change)");
  lines.push(`Routing mode: ${rec.mode}`);
  lines.push(`Recommended rung: ${rec.rung}`);
  lines.push(
    `Price for the recommended rung (rendered separately, do not restate it in prose): ${rec.price || "set on the call"}`,
  );
  lines.push(`Exit: ${rec.exit}`);

  lines.push("");
  lines.push(
    "Write the seven prose slots now. Name a real fact from their world where it lands. No price figures in prose. No em dashes. Return the JSON object and nothing else.",
  );

  return lines.join("\n");
}

/** One call to the Anthropic Messages API. Returns the joined text, or throws. */
async function callAnthropic(
  model: string,
  system: string,
  messages: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": ANTHROPIC_VERSION,
    },
    body: JSON.stringify({ model, max_tokens: MAX_TOKENS, system, messages }),
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

/** Robustly parse the model output into a ProseSlots object, NDM-style. */
function parseProse(raw: string): ProseSlots | null {
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
  return normaliseProse(parsed as Record<string, unknown>);
}

/** Coerce a loosely-shaped object into ProseSlots, with safe string defaults. */
function normaliseProse(o: Record<string, unknown>): ProseSlots | null {
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const bullets = Array.isArray(o.whatIHeardBullets)
    ? o.whatIHeardBullets
        .map((b) => str(b))
        .filter((b) => b.length > 0)
        .slice(0, 5)
    : [];

  const slots: ProseSlots = {
    heroHeadline: str(o.heroHeadline),
    heroLead: str(o.heroLead),
    whatIHeardIntro: str(o.whatIHeardIntro),
    whatIHeardBullets: bullets,
    engagementIntro: str(o.engagementIntro),
    whatYouKeepHero: str(o.whatYouKeepHero),
    whatYouKeepFoot: str(o.whatYouKeepFoot),
  };

  // Need at least a hero line to be worth using; the renderer fills the rest from
  // deterministic defaults if a slot is empty.
  if (!slots.heroHeadline && !slots.heroLead) return null;
  return slots;
}

/**
 * Last-resort minimal cleanup of em-dash / spaced-double-hyphen / exclamation
 * overrun that survives the corrective re-call. Banned tokens are left intact
 * (rewriting risks nonsense); the re-call is the real guard. Mirrors mindy-chat.
 */
function softScrub(text: string): string {
  let out = text.replace(/, /g, ", ").replace(/\s--\s/g, ", ");
  let seenBang = false;
  out = out.replace(/!/g, () => {
    if (seenBang) return ".";
    seenBang = true;
    return "!";
  });
  return out;
}

/** Run lintVoice across every slot; return the union of violations with labels. */
function lintSlots(slots: ProseSlots): string[] {
  const violations: string[] = [];
  for (const { key, text } of flattenSlots(slots)) {
    const r = lintVoice(text);
    if (!r.ok) violations.push(`${key}: ${r.violations.join(", ")}`);
  }
  return violations;
}

/** Apply softScrub to every slot string (used as the final fallback). */
function scrubSlots(slots: ProseSlots): ProseSlots {
  return {
    heroHeadline: softScrub(slots.heroHeadline),
    heroLead: softScrub(slots.heroLead),
    whatIHeardIntro: softScrub(slots.whatIHeardIntro),
    whatIHeardBullets: slots.whatIHeardBullets.map(softScrub),
    engagementIntro: softScrub(slots.engagementIntro),
    whatYouKeepHero: softScrub(slots.whatYouKeepHero),
    whatYouKeepFoot: softScrub(slots.whatYouKeepFoot),
  };
}

/**
 * Generate the prose slots: one Claude call, voice-gate, one corrective re-call
 * if any slot fails, then a soft scrub. Returns null prose if the model is
 * unreachable, in which case the renderer uses its deterministic defaults (the
 * page still renders fully, grounded in the decision brief).
 */
async function generateProse(
  dossier: Dossier | null,
  brief: DecisionBrief,
  rec: Recommendation,
  clientName: string,
): Promise<ProseSlots | null> {
  const system = buildProseSystem();
  const user = buildProseUser(dossier, brief, rec, clientName);
  const messages = [{ role: "user" as const, content: user }];

  let raw = "";
  try {
    raw = await callAnthropic(PRIMARY_MODEL, system, messages);
  } catch (e1) {
    console.error("generate-proposal prose primary failed", e1);
    try {
      raw = await callAnthropic(FALLBACK_MODEL, system, messages);
    } catch (e2) {
      console.error("generate-proposal prose fallback failed", e2);
      return null;
    }
  }

  let slots = parseProse(raw);
  if (!slots) return null;

  let violations = lintSlots(slots);
  if (violations.length > 0) {
    // ONE corrective re-call, listing the exact violations, asking for the same
    // JSON with the offending slots fixed.
    try {
      const correction = [
        ...messages,
        { role: "assistant" as const, content: raw },
        {
          role: "user" as const,
          content:
            "Some slots broke the voice rules: " +
            violations.join("; ") +
            ". Rewrite ONLY the JSON, keeping every slot's meaning and the same fields, but fix the flagged slots so there are no em dashes, no banned buzzwords, at most one exclamation mark, sentence case, active voice, second person, British-Australian. No price figures in prose. Return the JSON object and nothing else.",
        },
      ];
      const rawFix = await callAnthropic(PRIMARY_MODEL, system, correction);
      const fixed = parseProse(rawFix);
      if (fixed) {
        const fixedViolations = lintSlots(fixed);
        // Adopt the re-call if it is at least as clean.
        if (fixedViolations.length <= violations.length) {
          slots = fixed;
          violations = fixedViolations;
        }
      }
    } catch (e) {
      console.error("generate-proposal prose voice re-call failed", e);
    }

    // Final soft scrub if anything remains (handles em dashes deterministically).
    if (violations.length > 0) {
      const scrubbed = scrubSlots(slots);
      if (lintSlots(scrubbed).length < violations.length) {
        slots = scrubbed;
      }
    }
  }

  return slots;
}

// ── payload assembly ─────────────────────────────────────────────────────────────

/** A normalised, non-null DecisionBrief. */
function normaliseBrief(input: unknown): DecisionBrief | null {
  if (!input || typeof input !== "object") return null;
  const b = input as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const realDecision = str(b.realDecision);
  const paths = Array.isArray(b.paths)
    ? b.paths
        .map((p) => {
          const pp = p as Record<string, unknown>;
          return { name: str(pp?.name), tradeoff: str(pp?.tradeoff) };
        })
        .filter((p) => p.name || p.tradeoff)
    : [];
  // A usable brief needs at least the real decision OR some paths.
  if (!realDecision && paths.length === 0) return null;
  return {
    realDecision,
    paths,
    weakAssumption: str(b.weakAssumption),
    next14Days: str(b.next14Days),
  };
}

/** A normalised, non-null Recommendation. */
function normaliseRecommendation(input: unknown): Recommendation | null {
  if (!input || typeof input !== "object") return null;
  const r = input as Record<string, unknown>;
  const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
  const exitRaw = str(r.exit);
  const exit = (
    ["self-serve", "book-call", "learn", "proposal"].includes(exitRaw)
      ? exitRaw
      : "proposal"
  ) as Recommendation["exit"];
  const mode = str(r.mode);
  // Mode is the one field the scaffold genuinely needs. Range may legitimately be
  // empty (it resolves to "set on the call"); rung is cosmetic.
  if (!mode && !str(r.rung) && !str(r.price)) return null;
  return { mode, rung: str(r.rung), price: str(r.price), exit };
}

/** Optional contact. */
function normaliseContact(input: unknown): ProposalContact | undefined {
  if (!input || typeof input !== "object") return undefined;
  const c = input as Record<string, unknown>;
  const str = (v: unknown): string | undefined =>
    typeof v === "string" && v.trim() ? v.trim() : undefined;
  const contact: ProposalContact = {
    name: str(c.name),
    email: str(c.email),
    company: str(c.company),
  };
  if (!contact.name && !contact.email && !contact.company) return undefined;
  return contact;
}

/**
 * Whether the recommendation carries a real, displayable price. If not, the fee
 * block reads "set on the call" (also re-checked by the renderer's resolveFee,
 * this is the orchestrator-side mirror of the same rule).
 */
function isHonestBand(range: string): boolean {
  const raw = (range || "").trim();
  if (!raw) return false;
  const lower = raw.toLowerCase();
  if (lower.includes("call") || lower.includes("scoped") || lower === "tbd") {
    return false;
  }
  return true;
}

/**
 * Build the deterministic payload skeleton from the scaffold + dossier + proof,
 * then merge in any generated prose. The renderer fills every remaining optional
 * slot from its own deterministic defaults, so the page is always complete.
 */
function buildPayload(
  dossier: Dossier | null,
  brief: DecisionBrief,
  rec: Recommendation,
  contact: ProposalContact | undefined,
  prose: ProseSlots | null,
  format: "html" | "pdf",
): ProposalPayload {
  const scaffold = getModeScaffold(rec.mode);
  const clientName = resolveClientName(dossier, contact);

  // Co-brand from the dossier identity, with fallbacks. Fall back to the icon /
  // symbol when no full logo resolved, so the lockup still paints a real mark.
  const clientLogoUrl =
    dossier?.identity?.logoUrl || dossier?.identity?.iconUrl;
  const accentHex = dossier?.identity?.colors?.[0];

  // Proof: SELECTED, never written. Mode (hard) -> icp (strong) -> industry (soft).
  const icp: Icp | "enterprise" = dossier?.scale?.icp || "enterprise";
  const industry = dossier?.understanding?.industry;
  const proof = selectProof(rec.mode, icp, industry, 3);

  // Fee band: the recommendation.price, unless book-call or no honest band, in
  // which case the renderer shows "set on the call". We pass the range through;
  // resolveFee() in the template makes the final call. We also surface an honest
  // rate note so the page reads right either way.
  const feeBand =
    rec.exit === "book-call" || !isHonestBand(rec.price)
      ? "set on the call"
      : rec.price;

  // The phase-2 panel from the scaffold (rendered as tracks).
  const ph2 = scaffold.phase2;

  const payload: ProposalPayload = {
    dossier,
    decisionBrief: brief,
    recommendation: rec,
    contact,

    clientName,
    clientLogoUrl,
    accentHex,

    eyebrowLabel: "AI Enablement Proposal",
    headline: prose?.heroHeadline || undefined,
    lead: prose?.heroLead || undefined,

    whatIHeard: {
      intro: prose?.whatIHeardIntro || undefined,
      bullets:
        prose?.whatIHeardBullets && prose.whatIHeardBullets.length > 0
          ? prose.whatIHeardBullets
          : undefined,
    },

    engagement: {
      label: scaffold.engagementLabel,
      heading: scaffold.engagementHeading,
      intro: prose?.engagementIntro || undefined,
      deliverables: scaffold.deliverables,
    },

    keep: {
      hero: prose?.whatYouKeepHero || scaffold.keepHero,
      cards: scaffold.keepCards,
      foot: prose?.whatYouKeepFoot || scaffold.keepFoot,
    },

    proof,

    price: {
      // feeBand carries the band; the renderer forces the fee cell to a range or
      // the set-on-call line. We do not synthesise specs (window/time/rate) here
      // since they are mode-specific and live with Krish; the renderer renders a
      // clean single fee cell when none are supplied.
      free:
        "Before anything is committed, a free first conversation. If you are not a fit, I will say so on the call, not after you have paid.",
    },

    guarantee: {
      title: scaffold.guarantee.title,
      intro: scaffold.guarantee.intro,
      body: scaffold.guarantee.body,
    },

    phase2: {
      heading: ph2.heading,
      intro: ph2.intro,
      cap: ph2.cap,
      tracks: ph2.tracks,
      commercial: ph2.commercial,
    },

    nextSteps: scaffold.nextSteps,

    // Signature is always Krish (the renderer defaults to Krish Raja +
    // krish@themindmaker.ai + "Prepared for {clientName}, {month year}"). The
    // captured contact rides on payload.contact, not the signature block.

    format,
  };

  // The renderer reads recommendation.price for the fee. If we resolved a
  // set-on-call band, reflect that into the recommendation copy it sees so the
  // renderer's resolveFee shows the set-on-call line consistently.
  if (feeBand === "set on the call") {
    payload.recommendation = { ...rec, price: feeBand };
  }

  return payload;
}

// ── proposal id (stable-ish, hash of domain + headline) ──────────────────────────

/**
 * A short, stable-ish proposal id derived from the client domain/name + the
 * headline. Deterministic for the same inputs (not Date/random based), so a
 * regenerated proposal for the same diagnosis keeps the same stamp. FNV-1a -> base36.
 */
function proposalId(payload: ProposalPayload): string {
  const seed = [
    payload.dossier?.domain || "",
    payload.clientName || "",
    payload.headline || "",
    payload.recommendation?.mode || "",
    payload.recommendation?.rung || "",
  ].join("|");

  // FNV-1a 32-bit.
  let h = 0x811c9dc5;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  const stamp = (h >>> 0).toString(36);
  return `mm-${stamp}`;
}

// ── browserless pdf ──────────────────────────────────────────────────────────────

/** Encode a Uint8Array to base64 without blowing the call stack on large buffers. */
function toBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000; // 32k chars at a time
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

/** POST html to a Browserless /pdf endpoint. Returns the PDF bytes, or throws. */
async function browserlessRender(
  endpoint: string,
  token: string,
  html: string,
): Promise<Uint8Array> {
  const res = await fetch(`${endpoint}?token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      html,
      options: { printBackground: true, format: "A4" },
    }),
  });
  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`browserless ${res.status}: ${errText.slice(0, 200)}`);
  }
  return new Uint8Array(await res.arrayBuffer());
}

/**
 * Render the proposal HTML to a PDF via Browserless.
 *
 * Smoke-tests the endpoint with a tiny HTML first to confirm the current
 * URL/shape: tries BROWSERLESS_PRIMARY; if it 404s (route moved), falls back to
 * BROWSERLESS_LEGACY. The endpoint that smoke-passes is the one used for the real
 * document. Returns { pdf, endpoint } on success, or throws (the caller falls
 * back to returning HTML with a flag).
 */
async function renderPdf(
  html: string,
  token: string,
): Promise<{ pdf: Uint8Array; endpoint: string }> {
  const SMOKE = "<!DOCTYPE html><html><body><h1>ok</h1></body></html>";

  // 1) Smoke-test the primary endpoint.
  let endpoint = BROWSERLESS_PRIMARY;
  try {
    await browserlessRender(endpoint, token, SMOKE);
  } catch (e) {
    const msg = String(e instanceof Error ? e.message : e);
    // A 404 means the route moved; try the legacy host. Anything else (401/429/
    // 5xx) is an endpoint that exists but is unhappy, so do not waste a call on
    // legacy, rethrow.
    if (msg.includes("404")) {
      endpoint = BROWSERLESS_LEGACY;
      await browserlessRender(endpoint, token, SMOKE); // smoke the legacy route
    } else {
      throw e;
    }
  }

  // 2) Render the real document on the smoke-confirmed endpoint.
  const pdf = await browserlessRender(endpoint, token, html);
  return { pdf, endpoint };
}

// ── handler ──────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed." }, 405);
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
      { error: "You are going quickly. Give it a moment and try again." },
      429,
    );
  }

  // Parse the body.
  let body: {
    dossier?: Dossier | null;
    decisionBrief?: unknown;
    recommendation?: unknown;
    contact?: unknown;
    format?: unknown;
  };
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request body." }, 400);
  }

  // Validate the two required inputs with reasonable 400s.
  const brief = normaliseBrief(body?.decisionBrief);
  if (!brief) {
    return json(
      {
        error:
          "A decision brief is required to generate a proposal. Run the diagnosis first.",
      },
      400,
    );
  }

  const rec = normaliseRecommendation(body?.recommendation);
  if (!rec) {
    return json(
      {
        error:
          "A recommendation is required to generate a proposal. Run the diagnosis first.",
      },
      400,
    );
  }

  const dossier = (body?.dossier as Dossier | null | undefined) ?? null;
  const contact = normaliseContact(body?.contact);
  const format: "html" | "pdf" = body?.format === "pdf" ? "pdf" : "html";

  // Prose generation needs the LLM. If the key is missing we still render a
  // complete page from deterministic defaults; we do not hard-fail the proposal.
  let prose: ProseSlots | null = null;
  if (ANTHROPIC_API_KEY) {
    const clientName = resolveClientName(dossier, contact);
    try {
      prose = await generateProse(dossier, brief, rec, clientName);
    } catch (e) {
      console.error("generate-proposal prose generation failed", e);
      prose = null;
    }
  } else {
    console.warn(
      "generate-proposal: ANTHROPIC_API_KEY unset, rendering deterministic defaults only",
    );
  }

  // Assemble the payload and render.
  const payload = buildPayload(dossier, brief, rec, contact, prose, format);
  const html = renderProposalHtml(payload);
  const id = proposalId(payload);

  // HTML path: return html + payload + id.
  if (format !== "pdf") {
    totalServed += 1;
    return json({ html, payload, proposalId: id });
  }

  // PDF path: render via Browserless. On any failure, fall back to HTML so the
  // front-end can print-to-PDF client-side.
  if (!BROWSERLESS_API_KEY) {
    totalServed += 1;
    return json({
      html,
      payload,
      proposalId: id,
      pdfFallback: true,
      pdfError: "PDF rendering is not configured (no BROWSERLESS_API_KEY).",
    });
  }

  try {
    const { pdf, endpoint } = await renderPdf(html, BROWSERLESS_API_KEY);
    totalServed += 1;
    console.log(`generate-proposal: PDF rendered via ${endpoint}`);
    return json({
      pdfBase64: toBase64(pdf),
      proposalId: id,
      contentType: "application/pdf",
    });
  } catch (e) {
    console.error("generate-proposal browserless render failed", e);
    totalServed += 1;
    return json({
      html,
      payload,
      proposalId: id,
      pdfFallback: true,
      pdfError: "PDF rendering failed; print the HTML to PDF instead.",
    });
  }
});
