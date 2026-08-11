/**
 * Proposal generator contract (Diagnosis Room → co-branded one-pager).
 *
 * Once Mindy has diagnosed a visitor's nervous AI decision, the generator turns
 * the decision brief + recommendation into the visitor's own co-branded
 * one-pager: Mindmaker x [their company]. The deterministic shell (co-brand
 * hero, ranges, proof tiles, ladder, guarantee) paints from this payload; any
 * reflective prose slot is generated separately, voice-linted, and passed in
 * already-clean.
 *
 * Hard contracts mirrored here so the template never has to reach for them:
 *   - The price block shows recommendation.price (the published figure for
 *     "$8,000–$25,000"), never an exact figure. If exit is 'book-call' or the
 *     band reads "set on the call", the price block says the number is set on
 *     the call. En dashes in numeric ranges.
 *   - PROOF is SELECTED via selectProof(), never written. The three chosen
 *     ProofEntry tiles ride in on `proof`.
 *   - VOICE. Every LLM-generated prose slot (whatIHeard, the keep hero, etc.)
 *     must clear lintVoice() BEFORE it is placed on this payload.
 */

import type { Dossier } from '../enrich/types.ts';
import type { ProofEntry } from '../mindy/proof-index.ts';

/** Mindy's decomposed decision (verbatim from the mindy-chat turn contract). */
export interface DecisionBrief {
  realDecision: string;
  paths: { name: string; tradeoff: string }[];
  weakAssumption: string;
  next14Days: string;
}

/** Mindy's routed recommendation (verbatim from the mindy-chat turn contract). */
export interface Recommendation {
  /** Routing mode, e.g. "Mode A (productised)" or "Mode B (bespoke)". */
  mode: string;
  /** A rung name from the canonical ladder. */
  rung: string;
  /** A public range-card band, e.g. "$8,000–$25,000". NEVER an exact figure. */
  price: string;
  exit: 'self-serve' | 'book-call' | 'learn' | 'proposal';
}

/** Optional captured contact for the signature line and digest. */
export interface ProposalContact {
  name?: string;
  email?: string;
  company?: string;
}

/**
 * One numbered deliverable in THE ENGAGEMENT section. Optional so callers can
 * lean on the deterministic default ladder when Mindy has not authored a
 * bespoke list. Every `title` / `desc` here must already be voice-linted.
 */
export interface Deliverable {
  title: string;
  desc: string;
}

/** One value card in WHAT YOU KEEP. role + worth are short, body is the example. */
export interface ValueCard {
  role: string;
  title: string;
  body: string;
  worth: string;
}

/** A single rung in THE HOURS AND THE PRICE ladder. price is a band or label. */
export interface LadderRung {
  step: string; // e.g. "Step 1 / Pilot"
  price: string; // a BAND or a label like "Scoped together" — never an exact figure
  title: string;
  desc: string;
  bullets?: string[];
  /** Visual treatment: 'pilot' default, 'full' the lead rung, 'future' the dark Phase 2 rung. */
  kind?: 'pilot' | 'full' | 'future';
  /** Optional credit/carry line rendered beneath this rung (e.g. "credits in full toward step 2"). */
  credit?: string;
}

/** One Phase 2 track with its chip list. */
export interface Phase2Track {
  kicker: string; // e.g. "Track 01 / The internal brain"
  title: string;
  desc: string;
  chips: { label: string; key?: boolean }[];
}

/** The spec row in the hours strip (window / time / rate / fee). */
export interface SpecItem {
  k: string;
  v: string;
}

/**
 * Everything the renderer needs. Assembled by the proposal edge function from
 * the dossier, decisionBrief, recommendation, selectProof() output, and any
 * already-linted prose. Sensible deterministic defaults cover every optional
 * slot so the shell always renders, even with a null dossier.
 */
export interface ProposalPayload {
  /** Source dossier (co-brands the hero from identity). May be null. */
  dossier: Dossier | null;
  decisionBrief: DecisionBrief;
  recommendation: Recommendation;
  contact?: ProposalContact;

  /** Co-brand inputs, resolved by the caller from the dossier (with fallbacks). */
  clientName: string;
  clientLogoUrl?: string;
  /** Brand accent (dossier.identity.colors[0]); the mint defaults apply if absent. */
  accentHex?: string;

  /** Hero copy. headline + lead must be voice-linted if LLM-generated. */
  eyebrowLabel?: string; // co-brand row label, e.g. "AI Enablement Proposal"
  headline?: string;
  lead?: string; // may contain a single <b> emphasis span (already-escaped by caller? no — see template)

  /** WHAT I HEARD. heading + intro are prose; bullets are short voice-linted lines. */
  whatIHeard?: {
    heading?: string;
    intro?: string;
    bullets?: string[];
  };

  /** THE ENGAGEMENT. heading + intro prose; deliverables numbered; streams optional. */
  engagement?: {
    heading?: string;
    intro?: string;
    label?: string; // section label, e.g. "Phase 1 / The engagement"
    deliverables?: Deliverable[];
    streams?: { label: string; items: { name: string; note?: string }[] };
  };

  /** WHAT YOU KEEP. hero line + value cards + foot. */
  keep?: {
    label?: string;
    heading?: string;
    hero?: string; // may carry one <b> emphasis; rendered as escaped text
    cards?: ValueCard[];
    foot?: string;
  };

  /** PROOF — the three SELECTED tiles. Selected via selectProof(), never written. */
  proof: ProofEntry[];

  /** THE HOURS AND THE PRICE. specs + the range + an optional ladder. */
  price?: {
    label?: string;
    heading?: string;
    intro?: string;
    specs?: SpecItem[]; // window / time / rate — the FEE cell is forced to the range
    rateNote?: string;
    free?: string; // the free on-ramp bar copy
    ladder?: LadderRung[];
    ladderNote?: string;
  };

  /** THE GUARANTEE / I CARRY THE RISK. */
  guarantee?: {
    label?: string;
    heading?: string;
    intro?: string;
    title?: string; // the inverted panel kicker, e.g. "The results guarantee"
    body?: string;
  };

  /** PHASE 2 / LATER. */
  phase2?: {
    label?: string;
    pill?: string;
    heading?: string;
    intro?: string;
    cap?: string;
    tracks?: Phase2Track[];
    commercial?: string;
  };

  /** NEXT STEPS list. */
  nextSteps?: string[];

  /** Signature. Defaults to Krish + current month/year + "Prepared for [client]". */
  signature?: {
    name?: string;
    email?: string;
    /** Override the "Mindmaker / Prepared for X, Month Year" meta line entirely. */
    meta?: string;
  };

  /** Output format hint. The renderer always returns HTML; 'pdf' is print-ready. */
  format?: 'html' | 'pdf';
}
