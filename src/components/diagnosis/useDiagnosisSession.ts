import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { detectLogoBg } from "./logoLuminance";
import type {
  ChatMessage,
  Contact,
  ConversationTurn,
  DecisionBrief,
  Dossier,
  EndedVia,
  EnrichResponse,
  GenerateProposalResponse,
  MindyChatResponse,
  ProposalHtmlResponse,
  Recommendation,
  RoomPhase,
  SessionMode,
} from "./types";

export const CALENDLY_URL = "https://calendly.com/krish-raja/15-min-intro";

/**
 * The one line Mindy says when a function fails. Voice-linted: sentence case,
 * no em dashes, no buzzwords. Never a raw "Edge Function returned a non-2xx"
 * string. We always offer the call as the fastest fix.
 */
const ERROR_REPLY =
  "Sorry, something went wrong on my end. The quickest fix is a quick call with Krish, he can pick this up live.";

// ---------------------------------------------------------------------------
// small utilities
// ---------------------------------------------------------------------------

const trackEvent = (name: string, props?: Record<string, unknown>) => {
  try {
    (
      window as unknown as {
        plausible?: (e: string, o?: { props?: object }) => void;
      }
    ).plausible?.(name, props ? { props } : undefined);
  } catch {
    /* analytics optional */
  }
};

const FREE_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "yahoo.com",
  "ymail.com",
  "hotmail.com",
  "outlook.com",
  "live.com",
  "icloud.com",
  "me.com",
  "aol.com",
  "proton.me",
  "protonmail.com",
  "gmx.com",
  "mail.com",
  "yandex.com",
  "zoho.com",
]);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const domainFromEmail = (email: string): string | undefined => {
  const at = email.lastIndexOf("@");
  if (at < 0) return undefined;
  return email.slice(at + 1).trim().toLowerCase() || undefined;
};

const isFreeEmail = (email: string): boolean => {
  const domain = domainFromEmail(email);
  return domain ? FREE_EMAIL_DOMAINS.has(domain) : false;
};

const uid = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

/**
 * Strip the internal routing layer from a dossier before it is exposed to any
 * view. scale.* must never reach a component. We keep a private copy with
 * scale intact for the round-trip back to the edge functions.
 */
const toViewDossier = (raw: Dossier | null): Dossier | null => {
  if (!raw) return null;
  const { scale: _scale, ...rest } = raw;
  return rest;
};

const errMessage = (e: unknown, fallback: string): string => {
  if (e instanceof Error && e.message) return e.message;
  if (typeof e === "string" && e) return e;
  return fallback;
};

/**
 * Wrap supabase.functions.invoke so a thrown network error and a non-2xx both
 * collapse to a single shape: { data, failed }. We never let the raw
 * "Edge Function returned a non-2xx status code" string escape into the UI.
 */
const safeInvoke = async <T,>(
  fn: string,
  body: unknown,
): Promise<{ data: T | null; failed: boolean }> => {
  try {
    const { data, error } = await supabase.functions.invoke(fn, { body });
    if (error) return { data: null, failed: true };
    return { data: (data as T) ?? null, failed: false };
  } catch {
    return { data: null, failed: true };
  }
};

/** Read a Blob as a bare base64 string (no data: prefix). */
const blobToBase64 = (blob: Blob): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("read failed"));
    reader.onloadend = () => {
      const result = String(reader.result || "");
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.readAsDataURL(blob);
  });

// ---------------------------------------------------------------------------
// public hook surface
// ---------------------------------------------------------------------------

export interface DiagnosisSessionState {
  phase: RoomPhase;
  /** Conversation intent. Express rushes to the booking. */
  mode: SessionMode;
  /** View-safe dossier (scale.* already stripped). Null until enriched. */
  dossier: Dossier | null;
  /** True the instant a non-free email starts enriching, drives the gasp. */
  coBranded: boolean;
  turns: ConversationTurn[];
  recommendation: Recommendation | null;
  decisionBrief: DecisionBrief | null;
  readyForProposal: boolean;
  readyForCall: boolean;

  // loading / status flags
  reading: boolean; // identity enrichment in flight
  thinking: boolean; // mindy-chat in flight
  proposalLoading: boolean; // generate-proposal (html) in flight
  pdfLoading: boolean; // generate-proposal (pdf) in flight
  error: string | null;

  // proposal artefact
  proposalHtml: string | null;
  proposalId: string | null;
  pdfFallback: boolean;

  contact: Contact;
}

export interface UseDiagnosisSession extends DiagnosisSessionState {
  /** Set the conversation mode (express vs full). */
  setMode: (mode: SessionMode) => void;
  /** Switch a started express session into the full diagnosis. */
  switchToFull: () => void;
  /** Kick the session off from the opener. */
  start: (
    decision: string,
    email?: string,
    company?: { name?: string; domain?: string },
  ) => Promise<void>;
  /** Express path: collect the minimum and jump straight to the booking. */
  startExpress: (
    decision: string,
    email?: string,
    company?: { name?: string; domain?: string },
  ) => void;
  /** Send a follow-up message into the conversation. */
  send: (text: string) => Promise<void>;
  /** Transcribe a recorded audio blob via the transcribe edge fn. */
  transcribeAudio: (blob: Blob) => Promise<string>;
  /** Retry after a graceful error (drops the error turn, re-sends nothing). */
  dismissError: () => void;
  /** Jump to the kept one-screen brief (no email wall). */
  viewBrief: () => void;
  /** Open the three honest exits. */
  goToFork: () => void;
  /** Continue chatting from the fork (the "keep learning" exit). */
  keepChatting: () => void;
  /** Book-call exit: opens Calendly, fires the digest with endedVia book-call. */
  bookCall: (calendlyUrl: string) => void;
  /** Generate the proposal artefact and move to the proposal scene. */
  generateProposal: () => Promise<void>;
  /** Download the proposal as a PDF (or print-fallback). */
  downloadProposalPdf: () => Promise<void>;
  /** Set whether the visitor wants a copy emailed (drives the digest). */
  setOptInCopy: (v: boolean) => void;
  /** Fire the session digest on a meaningful end. Idempotent per session. */
  endSession: (via: EndedVia) => Promise<void>;
  /** Reset everything (called when the room closes). */
  reset: () => void;

  optInCopy: boolean;
}

const INITIAL: DiagnosisSessionState = {
  phase: "opener",
  mode: "full",
  dossier: null,
  coBranded: false,
  turns: [],
  recommendation: null,
  decisionBrief: null,
  readyForProposal: false,
  readyForCall: false,
  reading: false,
  thinking: false,
  proposalLoading: false,
  pdfLoading: false,
  error: null,
  proposalHtml: null,
  proposalId: null,
  pdfFallback: false,
  contact: {},
};

export function useDiagnosisSession(): UseDiagnosisSession {
  const [state, setState] = useState<DiagnosisSessionState>(INITIAL);
  const [optInCopy, setOptInCopyState] = useState(false);

  // Private refs that must survive renders but never trigger them, and that
  // must carry the INTERNAL scale.* layer for the round-trip.
  const sessionIdRef = useRef<string>(uid());
  const rawDossierRef = useRef<Dossier | null>(null); // includes scale.*
  const messagesRef = useRef<ChatMessage[]>([]); // full chat history
  const digestSentRef = useRef<EndedVia | null>(null); // idempotency guard
  const abortRef = useRef<AbortController | null>(null);
  const modeRef = useRef<SessionMode>("full"); // current mode, no stale closure

  // Auto-advance guards: surface the brief, then the three exits, exactly once
  // each, so a visitor who chose to "keep chatting" is never yanked back.
  const briefSurfacedRef = useRef(false);
  const forkSurfacedRef = useRef(false);
  // Fire the chat-detected enrichment at most once per session.
  const mentionEnrichedRef = useRef(false);
  // Current phase, mirrored into a ref so async callbacks read it without a
  // stale closure (and without putting phase in their dependency arrays).
  const phaseRef = useRef<RoomPhase>("opener");

  const patch = useCallback((p: Partial<DiagnosisSessionState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  // keep the phase ref in step with committed state for async callbacks
  useEffect(() => {
    phaseRef.current = state.phase;
  }, [state.phase]);

  // -- the transcript that gets attached to a digest (full history) ---------
  const transcript = useCallback((): ChatMessage[] => messagesRef.current, []);

  const setMode = useCallback(
    (mode: SessionMode) => {
      modeRef.current = mode;
      patch({ mode });
    },
    [patch],
  );

  // -- background full-depth enrichment (no gasp, just upgrades the dossier) -
  const enrichFull = useCallback(
    async (email?: string, domain?: string) => {
      const { data, failed } = await safeInvoke<EnrichResponse>(
        "enrich-company",
        { email, domain, depth: "full" },
      );
      if (failed || !data) return; // background; fail silently
      const res = data;
      if ("skipped" in res || "error" in res) return;
      const prev = rawDossierRef.current;
      const merged: Dossier = { ...(prev || {}), ...res };
      // Preserve a client-detected logo brightness across the upgrade when the
      // logo URL is unchanged, so the adaptive plate decision doesn't reset.
      const prevUrl = prev?.identity?.logoUrl || prev?.identity?.iconUrl;
      const nextUrl = merged.identity?.logoUrl || merged.identity?.iconUrl;
      if (prev?.identity?.logoBg && prevUrl && prevUrl === nextUrl) {
        merged.identity = { ...merged.identity, logoBg: prev.identity.logoBg };
      }
      rawDossierRef.current = merged;
      patch({ dossier: toViewDossier(merged) });
    },
    [patch],
  );

  // -- detect logo brightness so co-brand surfaces pick the right background --
  // A dark/coloured mark needs a light plate; a light/white mark goes straight
  // on the dark surface. We sample the actual artwork (canvas luminance) rather
  // than trusting Brandfetch's unreliable theme tag, then patch the live dossier.
  const primeLogoBg = useCallback(
    async (logoUrl?: string) => {
      if (!logoUrl) return;
      const bg = await detectLogoBg(logoUrl);
      if (!bg) return;
      const cur = rawDossierRef.current;
      if (!cur) return;
      const curUrl = cur.identity?.logoUrl || cur.identity?.iconUrl;
      if (curUrl !== logoUrl) return; // dossier/logo changed under us
      cur.identity = { ...cur.identity, logoBg: bg };
      patch({ dossier: toViewDossier(cur) });
    },
    [patch],
  );

  // -- enrich from a company NAMED in conversation (no email needed) ---------
  // Mindy returns an extractedCompany when she spots the visitor's company in
  // chat. We resolve it (name -> Brandfetch search -> domain) at identity depth
  // for the co-brand gasp, then upgrade to the full dossier in the background.
  const enrichFromMention = useCallback(
    async (name?: string, domain?: string) => {
      if (rawDossierRef.current) return; // already have a dossier
      if (!name && !domain) return;

      const { data, failed } = await safeInvoke<EnrichResponse>(
        "enrich-company",
        { name, domain, depth: "identity" },
      );
      if (failed || !data) return;
      if ("skipped" in data || "error" in data) return;

      const res = data as Dossier;
      rawDossierRef.current = res;
      setState((s) => ({
        ...s,
        dossier: toViewDossier(res),
        coBranded: true,
        contact: {
          ...s.contact,
          company: res.identity?.name || s.contact.company,
        },
      }));
      void primeLogoBg(res.identity?.logoUrl || res.identity?.iconUrl);
      // deep upgrade (PDL + BuiltWith + currency + synthesis) in the background
      void enrichFull(undefined, res.domain || domain);
    },
    [enrichFull, primeLogoBg],
  );

  // -- one round-trip to mindy-chat -----------------------------------------
  // On any failure we never surface a raw error string. Instead the pending
  // assistant turn becomes a calm apology turn and we flag `error` so the UI
  // can offer the call as the fastest fix.
  const callMindy = useCallback(
    async (assistantTurnId: string) => {
      patch({ thinking: true, error: null });

      const { data, failed } = await safeInvoke<MindyChatResponse>(
        "mindy-chat",
        {
          messages: messagesRef.current,
          dossier: rawDossierRef.current, // raw (with scale) for routing
          sessionId: sessionIdRef.current,
          mode: modeRef.current,
        },
      );

      if (failed || !data || typeof data.reply !== "string" || !data.reply) {
        // graceful degrade: turn the pending bubble into a friendly apology and
        // record a non-blocking error flag (used to surface the book-call CTA).
        messagesRef.current = [
          ...messagesRef.current,
          { role: "assistant", content: ERROR_REPLY },
        ];
        setState((s) => ({
          ...s,
          thinking: false,
          error: ERROR_REPLY,
          turns: s.turns.map((t) =>
            t.id === assistantTurnId
              ? { ...t, content: ERROR_REPLY, pending: false, kind: "error" }
              : t,
          ),
        }));
        return;
      }

      const res = data;
      const quickReplies = Array.isArray(res.quickReplies)
        ? res.quickReplies
            .filter((q): q is string => typeof q === "string" && !!q.trim())
            .map((q) => q.trim())
            .slice(0, 3)
        : [];

      messagesRef.current = [
        ...messagesRef.current,
        { role: "assistant", content: res.reply },
      ];

      setState((s) => ({
        ...s,
        thinking: false,
        error: null,
        // clear pills off every older turn; only the newest carries them
        turns: s.turns.map((t) =>
          t.id === assistantTurnId
            ? {
                ...t,
                content: res.reply,
                pending: false,
                kind: "normal",
                quickReplies,
              }
            : { ...t, quickReplies: undefined },
        ),
        recommendation: res.recommendation ?? s.recommendation,
        decisionBrief: res.decisionBrief ?? s.decisionBrief,
        readyForProposal: res.readyForProposal || s.readyForProposal,
        readyForCall: res.readyForCall || s.readyForCall,
      }));

      // Auto-advance the room to its payoff. The conversation can otherwise
      // stall forever: mindy-chat signals readiness (res.phase === "fork" or the
      // ready flags) but nothing acted on it, so the brief, the three honest
      // exits, and the co-branded proposal stayed buried behind a tab. Done
      // imperatively (not inside the updater) so it is StrictMode-safe; the
      // refs surface each milestone once, so a "keep chatting" visitor is never
      // yanked back to the fork.
      const fromPhase = phaseRef.current;
      const canAutoAdvance =
        fromPhase === "reflect" ||
        fromPhase === "chat" ||
        fromPhase === "brief";
      if (canAutoAdvance) {
        const ready =
          res.readyForProposal || res.readyForCall || res.phase === "fork";
        if (ready && !forkSurfacedRef.current) {
          forkSurfacedRef.current = true;
          briefSurfacedRef.current = true;
          trackEvent("diagnosis_room_auto_fork");
          patch({ phase: "fork" });
        } else if (res.decisionBrief && !briefSurfacedRef.current) {
          briefSurfacedRef.current = true;
          trackEvent("diagnosis_room_auto_brief");
          patch({ phase: "brief" });
        }
      }

      // If Mindy detected the visitor's company in conversation and we have no
      // dossier yet, enrich from it in the background so the co-brand, logo, and
      // business intelligence appear even though no work email was ever given.
      const ec = res.extractedCompany;
      if (
        ec &&
        (ec.name || ec.domain) &&
        !rawDossierRef.current &&
        !mentionEnrichedRef.current
      ) {
        mentionEnrichedRef.current = true;
        trackEvent("diagnosis_room_enrich_from_mention");
        void enrichFromMention(ec.name, ec.domain);
      }
    },
    [patch, enrichFromMention],
  );

  // -- START -----------------------------------------------------------------
  const start = useCallback(
    async (
      decision: string,
      email?: string,
      company?: { name?: string; domain?: string },
    ) => {
      const text = decision.trim();
      if (!text) return;

      const cleanEmail =
        email && EMAIL_RE.test(email.trim()) ? email.trim() : undefined;
      const emailEnriches = !!cleanEmail && !isFreeEmail(cleanEmail);
      const domain = cleanEmail ? domainFromEmail(cleanEmail) : undefined;

      // Enrichment key, most precise first: a work-email domain, then a company
      // the visitor PICKED from search (exact domain), then a free-typed name.
      const companyDomain = company?.domain?.trim() || undefined;
      const companyName = company?.name?.trim() || undefined;
      const willEnrich = emailEnriches || !!companyDomain || !!companyName;

      trackEvent("diagnosis_room_start", {
        hasEmail: !!cleanEmail,
        hasCompany: !!(companyDomain || companyName),
        willEnrich,
      });

      // seed the conversation with the opening decision
      messagesRef.current = [{ role: "user", content: text }];

      const userTurn: ConversationTurn = {
        id: uid(),
        role: "user",
        content: text,
      };
      const assistantTurnId = uid();
      const assistantTurn: ConversationTurn = {
        id: assistantTurnId,
        role: "assistant",
        content: "",
        pending: true,
      };

      patch({
        contact: { email: cleanEmail },
        turns: [userTurn, assistantTurn],
      });

      if (willEnrich) {
        // fast identity pass for the co-brand gasp, then full in the background
        patch({ phase: "reading", reading: true, error: null });
        const enrichBody = emailEnriches
          ? { email: cleanEmail, domain, depth: "identity" }
          : { domain: companyDomain, name: companyName, depth: "identity" };
        const { data, failed } = await safeInvoke<EnrichResponse>(
          "enrich-company",
          enrichBody,
        );
        // enrichment failure is non-fatal; we just proceed without the co-brand
        if (!failed && data && !("skipped" in data) && !("error" in data)) {
          const res = data as Dossier;
          rawDossierRef.current = res;
          patch({
            dossier: toViewDossier(res),
            coBranded: true,
            contact: {
              email: cleanEmail,
              company: res.identity?.name || companyName,
            },
          });
          void primeLogoBg(res.identity?.logoUrl || res.identity?.iconUrl);
          void enrichFull(cleanEmail, res.domain || domain || companyDomain); // background upgrade
        }
      }

      patch({ phase: "reflect", reading: false });
      await callMindy(assistantTurnId);
    },
    [patch, callMindy, enrichFull, primeLogoBg],
  );

  // -- EXPRESS START ---------------------------------------------------------
  // Collect only the critical info and rush to the Calendly booking. Enrich in
  // the background so Krish still gets a brief; never gate the booking on it.
  const startExpress = useCallback(
    (
      decision: string,
      email?: string,
      company?: { name?: string; domain?: string },
    ) => {
      const text = decision.trim();
      const cleanEmail =
        email && EMAIL_RE.test(email.trim()) ? email.trim() : undefined;
      const emailEnriches = !!cleanEmail && !isFreeEmail(cleanEmail);
      const domain = cleanEmail ? domainFromEmail(cleanEmail) : undefined;
      const companyDomain = company?.domain?.trim() || undefined;
      const companyName = company?.name?.trim() || undefined;

      modeRef.current = "express";
      trackEvent("diagnosis_room_express_start", {
        hasEmail: !!cleanEmail,
        hasCompany: !!(companyDomain || companyName),
      });

      // seed the transcript so the digest carries the one-line decision
      messagesRef.current = text ? [{ role: "user", content: text }] : [];

      patch({
        mode: "express",
        phase: "express-book",
        contact: { email: cleanEmail, company: companyName },
      });

      // background enrichment so the brief Krish receives is still rich. Prefer
      // the email domain; otherwise enrich from the company the visitor picked.
      if (emailEnriches) {
        void enrichFull(cleanEmail, domain);
      } else if (companyDomain || companyName) {
        void enrichFromMention(companyName, companyDomain);
      }
    },
    [patch, enrichFull, enrichFromMention],
  );

  // -- SEND ------------------------------------------------------------------
  const send = useCallback(
    async (text: string) => {
      const t = text.trim();
      if (!t) return;

      messagesRef.current = [
        ...messagesRef.current,
        { role: "user", content: t },
      ];

      const assistantTurnId = uid();
      setState((s) => ({
        ...s,
        error: null,
        phase: s.phase === "opener" || s.phase === "reading" ? "chat" : s.phase,
        // sending answers any open pills; strip them off all prior turns
        turns: [
          ...s.turns.map((t) =>
            t.quickReplies ? { ...t, quickReplies: undefined } : t,
          ),
          { id: uid(), role: "user", content: t },
          { id: assistantTurnId, role: "assistant", content: "", pending: true },
        ],
      }));

      await callMindy(assistantTurnId);
    },
    [callMindy],
  );

  // -- voice: transcribe a recorded blob via the transcribe edge fn ----------
  const transcribeAudio = useCallback(async (blob: Blob): Promise<string> => {
    const audioBase64 = await blobToBase64(blob);
    const { data, failed } = await safeInvoke<{ text?: string; error?: string }>(
      "transcribe",
      { audioBase64, mimeType: blob.type || "audio/webm" },
    );
    if (failed || !data || !data.text) {
      throw new Error("transcribe failed");
    }
    return data.text;
  }, []);

  const dismissError = useCallback(() => {
    setState((s) => ({
      ...s,
      error: null,
      turns: s.turns.filter((t) => t.kind !== "error"),
    }));
  }, []);

  // -- navigation between scenes --------------------------------------------
  const viewBrief = useCallback(() => {
    trackEvent("diagnosis_room_view_brief");
    patch({ phase: "brief" });
  }, [patch]);

  const goToFork = useCallback(() => {
    trackEvent("diagnosis_room_fork");
    patch({ phase: "fork" });
  }, [patch]);

  const keepChatting = useCallback(() => {
    patch({ phase: "chat" });
    void endSessionInternal("chat");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patch]);

  // -- express -> full: the "help me think it through first" escape hatch ----
  // From the opener we just flip the door into full mode (stay on the opener so
  // the visitor can frame the decision). From the express booking pane we have
  // a seeded one-line decision but no conversation yet, so we kick off the full
  // diagnosis with that line. Anywhere else, just continue the conversation.
  const switchToFull = useCallback(() => {
    modeRef.current = "full";
    trackEvent("diagnosis_room_switch_to_full");
    patch({ mode: "full" });

    setState((curr) => {
      if (curr.phase === "opener") return { ...curr, phase: "opener" };

      // express booking pane: no turns yet but we have the seeded decision
      if (curr.turns.length === 0 && messagesRef.current.length > 0) {
        const seeded = messagesRef.current[0]?.content || "";
        const cleanEmail = curr.contact.email;
        // defer the network call out of the state updater
        queueMicrotask(() => void start(seeded, cleanEmail));
        return { ...curr, phase: "reflect" };
      }

      return { ...curr, phase: "chat" };
    });
  }, [patch, start]);

  // -- session digest (idempotent per endedVia) -----------------------------
  const endSessionInternal = useCallback(
    async (via: EndedVia) => {
      if (digestSentRef.current === via) return;
      digestSentRef.current = via;
      try {
        await supabase.functions.invoke("session-digest", {
          body: {
            dossier: rawDossierRef.current,
            decisionBrief: state.decisionBrief,
            recommendation: state.recommendation,
            transcript: transcript(),
            contact: state.contact,
            proposalId: state.proposalId || undefined,
            proposalHtml: state.proposalHtml || undefined,
            endedVia: via,
            userOptInCopy: optInCopy,
          },
        });
        trackEvent("diagnosis_room_digest_sent", { via });
      } catch {
        // digest is fire-and-forget; never block the UI on it
        digestSentRef.current = null; // allow a retry on the next meaningful end
      }
    },
    [
      state.decisionBrief,
      state.recommendation,
      state.contact,
      state.proposalId,
      state.proposalHtml,
      optInCopy,
      transcript,
    ],
  );

  const endSession = useCallback(
    (via: EndedVia) => endSessionInternal(via),
    [endSessionInternal],
  );

  // -- book-call exit --------------------------------------------------------
  // The persistent escape hatch. Works from any phase: opens Calendly and fires
  // the digest with endedVia "book-call" plus whatever is collected so far.
  const bookCall = useCallback(
    (calendlyUrl?: string) => {
      trackEvent("diagnosis_room_book_call");
      window.open(
        calendlyUrl || CALENDLY_URL,
        "_blank",
        "noopener,noreferrer",
      );
      void endSessionInternal("book-call");
    },
    [endSessionInternal],
  );

  // -- proposal exit ---------------------------------------------------------
  const generateProposal = useCallback(async () => {
    trackEvent("diagnosis_room_generate_proposal");
    patch({ phase: "proposal", proposalLoading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-proposal",
        {
          body: {
            dossier: rawDossierRef.current,
            decisionBrief: state.decisionBrief,
            recommendation: state.recommendation,
            contact: state.contact,
            format: "html",
          },
        },
      );
      if (error) throw new Error(error.message || "proposal failed");
      const res = data as GenerateProposalResponse;
      if ("html" in res) {
        patch({
          proposalHtml: res.html,
          proposalId: res.proposalId,
          pdfFallback: !!(res as ProposalHtmlResponse).pdfFallback,
          proposalLoading: false,
        });
        void endSessionInternal("proposal");
      } else {
        throw new Error("Unexpected proposal response");
      }
    } catch (e) {
      patch({
        proposalLoading: false,
        error: errMessage(e, "The proposal didn't render. Try again in a moment."),
      });
    }
  }, [patch, state.decisionBrief, state.recommendation, state.contact, endSessionInternal]);

  const downloadProposalPdf = useCallback(async () => {
    patch({ pdfLoading: true, error: null });
    try {
      const { data, error } = await supabase.functions.invoke(
        "generate-proposal",
        {
          body: {
            dossier: rawDossierRef.current,
            decisionBrief: state.decisionBrief,
            recommendation: state.recommendation,
            contact: state.contact,
            format: "pdf",
          },
        },
      );
      if (error) throw new Error(error.message || "pdf failed");
      const res = data as GenerateProposalResponse;

      if ("pdfBase64" in res) {
        const byteChars = atob(res.pdfBase64);
        const bytes = new Uint8Array(byteChars.length);
        for (let i = 0; i < byteChars.length; i++) {
          bytes[i] = byteChars.charCodeAt(i);
        }
        const blob = new Blob([bytes], {
          type: res.contentType || "application/pdf",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const company =
          state.contact.company || state.dossier?.identity?.name || "Mindmaker";
        a.href = url;
        a.download = `Mindmaker x ${company}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
        trackEvent("diagnosis_room_pdf_downloaded");
      } else {
        // Browserless down -> print the HTML preview client-side
        patch({ pdfFallback: true });
        window.print();
      }
    } catch (e) {
      // last-resort fallback: print whatever is on screen
      patch({
        error: errMessage(e, "Couldn't build the PDF. Printing the preview instead."),
      });
      window.print();
    } finally {
      patch({ pdfLoading: false });
    }
  }, [patch, state.decisionBrief, state.recommendation, state.contact, state.dossier]);

  const setOptInCopy = useCallback((v: boolean) => setOptInCopyState(v), []);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    sessionIdRef.current = uid();
    rawDossierRef.current = null;
    messagesRef.current = [];
    digestSentRef.current = null;
    briefSurfacedRef.current = false;
    forkSurfacedRef.current = false;
    mentionEnrichedRef.current = false;
    setOptInCopyState(false);
    setState(INITIAL);
  }, []);

  return useMemo(
    () => ({
      ...state,
      optInCopy,
      setMode,
      switchToFull,
      start,
      startExpress,
      send,
      transcribeAudio,
      dismissError,
      viewBrief,
      goToFork,
      keepChatting,
      bookCall,
      generateProposal,
      downloadProposalPdf,
      setOptInCopy,
      endSession,
      reset,
    }),
    [
      state,
      optInCopy,
      setMode,
      switchToFull,
      start,
      startExpress,
      send,
      transcribeAudio,
      dismissError,
      viewBrief,
      goToFork,
      keepChatting,
      bookCall,
      generateProposal,
      downloadProposalPdf,
      setOptInCopy,
      endSession,
      reset,
    ],
  );
}
