import { useCallback, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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
} from "./types";

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

// ---------------------------------------------------------------------------
// public hook surface
// ---------------------------------------------------------------------------

export interface DiagnosisSessionState {
  phase: RoomPhase;
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
  /** Kick the session off from the opener. */
  start: (decision: string, email?: string) => Promise<void>;
  /** Send a follow-up message into the conversation. */
  send: (text: string) => Promise<void>;
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

  const patch = useCallback((p: Partial<DiagnosisSessionState>) => {
    setState((s) => ({ ...s, ...p }));
  }, []);

  // -- the transcript that gets attached to a digest (full history) ---------
  const transcript = useCallback((): ChatMessage[] => messagesRef.current, []);

  // -- background full-depth enrichment (no gasp, just upgrades the dossier) -
  const enrichFull = useCallback(
    async (email?: string, domain?: string) => {
      try {
        const { data, error } = await supabase.functions.invoke(
          "enrich-company",
          { body: { email, domain, depth: "full" } },
        );
        if (error) return; // background; fail silently
        const res = data as EnrichResponse;
        if (!res || "skipped" in res || "error" in res) return;
        const merged: Dossier = { ...(rawDossierRef.current || {}), ...res };
        rawDossierRef.current = merged;
        patch({ dossier: toViewDossier(merged) });
      } catch {
        /* background enrichment is best-effort */
      }
    },
    [patch],
  );

  // -- one round-trip to mindy-chat -----------------------------------------
  const callMindy = useCallback(
    async (assistantTurnId: string) => {
      patch({ thinking: true, error: null });
      try {
        const { data, error } = await supabase.functions.invoke("mindy-chat", {
          body: {
            messages: messagesRef.current,
            dossier: rawDossierRef.current, // raw (with scale) for routing
            sessionId: sessionIdRef.current,
          },
        });
        if (error) throw new Error(error.message || "mindy-chat failed");
        const res = data as MindyChatResponse;

        messagesRef.current = [
          ...messagesRef.current,
          { role: "assistant", content: res.reply },
        ];

        setState((s) => ({
          ...s,
          thinking: false,
          turns: s.turns.map((t) =>
            t.id === assistantTurnId
              ? { ...t, content: res.reply, pending: false }
              : t,
          ),
          recommendation: res.recommendation ?? s.recommendation,
          decisionBrief: res.decisionBrief ?? s.decisionBrief,
          readyForProposal: res.readyForProposal || s.readyForProposal,
          readyForCall: res.readyForCall || s.readyForCall,
        }));
      } catch (e) {
        const message = errMessage(e, "I lost the thread there. Try once more.");
        setState((s) => ({
          ...s,
          thinking: false,
          error: message,
          turns: s.turns.filter((t) => t.id !== assistantTurnId),
        }));
        // pull the failed assistant slot back out of history if it was added
      }
    },
    [patch],
  );

  // -- START -----------------------------------------------------------------
  const start = useCallback(
    async (decision: string, email?: string) => {
      const text = decision.trim();
      if (!text) return;

      const cleanEmail =
        email && EMAIL_RE.test(email.trim()) ? email.trim() : undefined;
      const domain = cleanEmail ? domainFromEmail(cleanEmail) : undefined;
      const willEnrich = !!cleanEmail && !isFreeEmail(cleanEmail);

      trackEvent("diagnosis_room_start", { hasEmail: !!cleanEmail, willEnrich });

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
        try {
          const { data, error } = await supabase.functions.invoke(
            "enrich-company",
            { body: { email: cleanEmail, domain, depth: "identity" } },
          );
          if (error) throw new Error(error.message || "enrich failed");
          const res = data as EnrichResponse;

          if (res && !("skipped" in res) && !("error" in res)) {
            rawDossierRef.current = res as Dossier;
            patch({
              dossier: toViewDossier(res as Dossier),
              coBranded: true,
              contact: {
                email: cleanEmail,
                company: (res as Dossier).identity?.name,
              },
            });
            void enrichFull(cleanEmail, domain); // background upgrade
          }
          // skipped / error -> no gasp, graceful path, Mindy just proceeds
        } catch {
          // enrichment failure is non-fatal; proceed without the co-brand
        }
      }

      patch({ phase: "reflect", reading: false });
      await callMindy(assistantTurnId);
    },
    [patch, callMindy, enrichFull],
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
        phase: s.phase === "opener" || s.phase === "reading" ? "chat" : s.phase,
        turns: [
          ...s.turns,
          { id: uid(), role: "user", content: t },
          { id: assistantTurnId, role: "assistant", content: "", pending: true },
        ],
      }));

      await callMindy(assistantTurnId);
    },
    [callMindy],
  );

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
  const bookCall = useCallback(
    (calendlyUrl: string) => {
      trackEvent("diagnosis_room_book_call");
      window.open(calendlyUrl, "_blank", "noopener,noreferrer");
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
    setOptInCopyState(false);
    setState(INITIAL);
  }, []);

  return useMemo(
    () => ({
      ...state,
      optInCopy,
      start,
      send,
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
      start,
      send,
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
