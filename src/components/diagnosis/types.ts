// Front-end types for The Diagnosis Room.
// These mirror the contracts of the four deployed edge functions:
//   enrich-company, mindy-chat, generate-proposal, session-digest.
//
// HARD RULE: scale.* is INTERNAL routing only. It is typed here so the
// dossier round-trips cleanly back to the edge functions, but it must NEVER
// be surfaced in any view. The hook strips it out of everything it returns.

// ---------------------------------------------------------------------------
// enrich-company
// ---------------------------------------------------------------------------

export interface DossierIdentity {
  name?: string;
  logoUrl?: string;
  iconUrl?: string;
  colors?: string[];
  founded?: string | number;
  /**
   * Client-detected brightness of the logo artwork: 'dark' = dark/coloured mark
   * (render on a light plate), 'light' = light/white mark (render on a dark
   * surface). Absent until detected.
   */
  logoBg?: "light" | "dark";
}

export interface DossierUnderstanding {
  tagline?: string;
  descriptor?: string;
  products?: string[];
  industry?: string;
  stack?: string[];
}

/** INTERNAL routing layer. Never rendered. Kept only so the object round-trips. */
export interface DossierScale {
  [key: string]: unknown;
}

export interface DossierCurrencyItem {
  text: string;
  sourceUrl?: string;
  date?: string;
  source?: string;
}

export interface Dossier {
  domain?: string;
  identity?: DossierIdentity;
  understanding?: DossierUnderstanding;
  /** INTERNAL only. Do not display. */
  scale?: DossierScale;
  currency?: DossierCurrencyItem[];
  synthesis?: string;
  confidence?: number;
  meta?: Record<string, unknown>;
}

export type EnrichDepth = "identity" | "full";

export interface EnrichRequest {
  domain?: string;
  email?: string;
  depth: EnrichDepth;
}

/** A normal successful enrichment. */
export interface EnrichSuccess {
  domain?: string;
  identity?: DossierIdentity;
  understanding?: DossierUnderstanding;
  scale?: DossierScale;
  currency?: DossierCurrencyItem[];
  synthesis?: string;
  confidence?: number;
  meta?: Record<string, unknown>;
  skipped?: undefined;
  error?: undefined;
}

/** Free-email / personal-email path. No co-brand gasp; Mindy just proceeds. */
export interface EnrichSkipped {
  skipped: "free-email";
  dossier: null;
}

export interface EnrichError {
  error: string;
}

export type EnrichResponse = EnrichSuccess | EnrichSkipped | EnrichError;

// ---------------------------------------------------------------------------
// mindy-chat
// ---------------------------------------------------------------------------

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}

export type MindyPhase =
  | "reflect"
  | "diagnose"
  | "recommend"
  | "fork"
  | "chat";

/** Conversation length / intent. Express rushes to a booking; full diagnoses. */
export type SessionMode = "express" | "full";

export type ExitKind = "self-serve" | "book-call" | "learn" | "proposal";

export interface Recommendation {
  mode: string;
  rung: string;
  price: string;
  exit: ExitKind;
}

export interface DecisionPath {
  name: string;
  tradeoff: string;
}

export interface DecisionBrief {
  realDecision: string;
  paths: DecisionPath[];
  weakAssumption: string;
  next14Days: string;
}

export interface MindyChatRequest {
  messages: ChatMessage[];
  dossier?: Dossier | null;
  sessionId?: string;
  /** "express" rushes to a booking; "full" runs the diagnosis. Default "full". */
  mode?: SessionMode;
}

export interface MindyChatResponse {
  reply: string;
  phase: MindyPhase;
  recommendation: Recommendation | null;
  decisionBrief: DecisionBrief | null;
  readyForProposal: boolean;
  readyForCall: boolean;
  /** 0-3 tappable answers to the question just asked. Free text still works. */
  quickReplies?: string[];
  /**
   * The visitor's company when Mindy detects it mid-conversation and no dossier
   * was supplied at the door. The client enriches from this in the background so
   * the co-brand, logo, and business intelligence appear without a work email.
   */
  extractedCompany?: { name?: string; domain?: string } | null;
}

// ---------------------------------------------------------------------------
// generate-proposal
// ---------------------------------------------------------------------------

export interface Contact {
  name?: string;
  email?: string;
  company?: string;
}

export type ProposalFormat = "html" | "pdf";

export interface GenerateProposalRequest {
  dossier: Dossier | null;
  decisionBrief: DecisionBrief | null;
  recommendation: Recommendation | null;
  contact?: Contact;
  format: ProposalFormat;
}

export interface ProposalHtmlResponse {
  html: string;
  payload?: unknown;
  proposalId: string;
  /** When Browserless is down on a pdf request, the fn returns html + this flag. */
  pdfFallback?: boolean;
}

export interface ProposalPdfResponse {
  pdfBase64: string;
  proposalId: string;
  contentType: string;
}

export type GenerateProposalResponse =
  | ProposalHtmlResponse
  | ProposalPdfResponse;

// ---------------------------------------------------------------------------
// session-digest
// ---------------------------------------------------------------------------

export type EndedVia = "chat" | "book-call" | "proposal";

export interface SessionDigestRequest {
  dossier: Dossier | null;
  decisionBrief: DecisionBrief | null;
  recommendation: Recommendation | null;
  transcript: ChatMessage[];
  contact: Contact;
  proposalId?: string;
  proposalHtml?: string;
  endedVia?: EndedVia;
  userOptInCopy?: boolean;
}

export interface SessionDigestResponse {
  ok: boolean;
  krishEmailSent: boolean;
  visitorEmailSent: boolean;
}

// ---------------------------------------------------------------------------
// Room state machine
// ---------------------------------------------------------------------------

export type RoomPhase =
  | "opener" // the single door
  | "reading" // enrichment in flight (identity depth)
  | "reflect" // DossierReveal + Mindy's first reflection
  | "chat" // ongoing conversation
  | "brief" // the kept one-screen decision brief
  | "fork" // the three honest exits
  | "proposal" // the live proposal artefact
  | "express-book"; // the express path: straight to the Calendly booking

/** A single turn shown in the conversation transcript view. */
export interface ConversationTurn {
  id: string;
  role: ChatRole;
  content: string;
  /** True while this assistant turn is still streaming/typing. */
  pending?: boolean;
  /** Tappable answer pills for the latest Mindy turn (0-3). */
  quickReplies?: string[];
  /**
   * A turn the visitor cannot reply to in the normal way (e.g. a graceful
   * error). The UI surfaces a "book the call" affordance instead of pills.
   */
  kind?: "normal" | "error";
}

/** The opening details collected at the door. */
export interface OpenerInput {
  decision: string;
  email?: string;
}
