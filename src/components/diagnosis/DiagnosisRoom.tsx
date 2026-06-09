import { useCallback, useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useDiagnosisSession } from "./useDiagnosisSession";
import { Opener } from "./Opener";
import { Conversation } from "./Conversation";
import { DossierReveal } from "./DossierReveal";
import { DecisionBrief } from "./DecisionBrief";
import { Fork, CALENDLY_URL } from "./Fork";
import { ProposalView } from "./ProposalView";
import { MindyAvatar } from "./MindyAvatar";
import { Button } from "@/components/ui/button";

export interface DiagnosisRoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where the room was opened from (for analytics / context). */
  sourcePage?: string;
}

/**
 * THE DIAGNOSIS ROOM.
 *
 * A full-screen, permanently-dark immersive overlay (above the navbar) that
 * composes the scenes via the session state machine in useDiagnosisSession.
 *
 * Open it by mounting it once near ScopingModal in App.tsx and toggling `open`,
 * driven by a window CustomEvent("openDiagnosisRoom"). Close with Esc or the X.
 */
export const DiagnosisRoom = ({ open, onOpenChange }: DiagnosisRoomProps) => {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const session = useDiagnosisSession();

  const {
    phase,
    dossier,
    coBranded,
    turns,
    thinking,
    reading,
    error,
    recommendation,
    decisionBrief,
    readyForProposal,
    readyForCall,
    proposalHtml,
    proposalLoading,
    pdfLoading,
    pdfFallback,
    optInCopy,
  } = session;

  // lock body scroll while the room is open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  // reset the session a beat after the room closes so it reopens fresh
  useEffect(() => {
    if (open) return;
    const t = setTimeout(() => session.reset(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = useCallback(() => {
    // a meaningful chat that never forked still counts as a soft chat-end
    if (turns.length > 1 && (phase === "chat" || phase === "reflect")) {
      void session.endSession("chat");
    }
    onOpenChange(false);
  }, [turns.length, phase, session, onOpenChange]);

  if (!open) return null;

  const showOpener = phase === "opener";

  // ---- the left rail: Mindy + the conversation ----------------------------
  const leftRail = (
    <div className="flex h-full flex-col">
      <div className="mb-5 flex shrink-0 items-center gap-3">
        <MindyAvatar size={40} state={thinking || reading ? "thinking" : "idle"} />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">Mindy</p>
          <p className="text-xs text-white/55">
            {reading
              ? `Reading up on ${dossier?.identity?.name || "your company"}`
              : thinking
                ? "Thinking"
                : "Mindmaker"}
          </p>
        </div>
      </div>
      <div className="min-h-0 flex-1">
        <Conversation
          turns={turns}
          thinking={thinking}
          error={error}
          onSend={session.send}
          disabled={reading}
        />
      </div>
    </div>
  );

  // ---- the right rail: the artefact that's building -----------------------
  const rightRailContent = () => {
    if (phase === "proposal") {
      return (
        <ProposalView
          html={proposalHtml}
          loading={proposalLoading}
          pdfLoading={pdfLoading}
          pdfFallback={pdfFallback}
          error={error}
          recommendation={recommendation}
          optInCopy={optInCopy}
          onOptInChange={session.setOptInCopy}
          onDownloadPdf={session.downloadProposalPdf}
          onBookCall={() => session.bookCall(CALENDLY_URL)}
        />
      );
    }

    if (phase === "fork") {
      return (
        <Fork
          recommendation={recommendation}
          readyForProposal={readyForProposal}
          readyForCall={readyForCall}
          onKeepChatting={session.keepChatting}
          onBookCall={() => session.bookCall(CALENDLY_URL)}
          onGenerateProposal={session.generateProposal}
        />
      );
    }

    if (phase === "brief" || (decisionBrief && phase !== "reflect")) {
      return <DecisionBrief brief={decisionBrief} dossier={dossier} />;
    }

    // reflect / chat / reading: show the co-brand reveal once we have identity,
    // otherwise a calm forming state.
    if (coBranded && dossier?.identity) {
      return <DossierReveal dossier={dossier} onCorrect={() => session.send("Actually, let me correct something about my business.")} />;
    }

    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
        <div className="h-12 w-12 rounded-full bg-mint/10 ring-1 ring-mint/20" />
        <p className="max-w-xs text-sm leading-relaxed text-white/45">
          Your decision brief will build here as we talk. Nothing is asked
          twice.
        </p>
      </div>
    );
  };

  // navigation chips between artefact views (only once there's something to show)
  const hasBrief = !!decisionBrief;
  const rightRailNav = !showOpener && (hasBrief || coBranded) && (
    <div className="mb-4 flex shrink-0 flex-wrap gap-2">
      {coBranded && (
        <ArtefactChip
          active={phase === "reflect" || phase === "chat"}
          onClick={() => session.keepChatting()}
          label="What I heard"
        />
      )}
      {hasBrief && (
        <ArtefactChip
          active={phase === "brief"}
          onClick={session.viewBrief}
          label="Decision brief"
        />
      )}
      {hasBrief && (
        <ArtefactChip
          active={phase === "fork"}
          onClick={session.goToFork}
          label="Next step"
        />
      )}
    </div>
  );

  const rightRail = (
    <div className="flex h-full flex-col">
      {rightRailNav}
      <div className="min-h-0 flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={phase}
            initial={reduce ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="h-full"
          >
            {rightRailContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <motion.div
      className="fixed inset-0 z-[200] bg-ink text-white"
      initial={reduce ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduce ? undefined : { opacity: 0 }}
      transition={{ duration: 0.3 }}
      role="dialog"
      aria-modal="true"
      aria-label="The Diagnosis Room"
      onClick={(e) => {
        // Backdrop close: only when the click lands on the room shell itself,
        // never on the conversation, artefact, or any interactive content.
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      {/* layered room backgrounds (always dark, theme-independent) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/80 via-transparent to-mint/5" />
      {!reduce && (
        <div
          className="pointer-events-none absolute right-1/4 top-1/4 h-[500px] w-[500px] rounded-full bg-mint/10 blur-3xl"
          style={{ animation: "pulse 6s ease-in-out infinite" }}
        />
      )}

      {/* close */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        className="absolute right-4 top-4 z-10 h-10 w-10 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
        aria-label="Close the room"
      >
        <X className="h-5 w-5" />
      </Button>

      {/* content */}
      <div className="relative z-[1] h-full">
        {showOpener ? (
          <Opener onStart={session.start} busy={reading} />
        ) : isMobile ? (
          // mobile: single column, the conversation leads, the artefact follows
          <div className="flex h-full flex-col px-5 pb-6 pt-16">
            <div className="min-h-0 flex-1">{leftRail}</div>
            {(coBranded || hasBrief || phase === "fork" || phase === "proposal") && (
              <div className="mt-4 max-h-[42vh] shrink-0 overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                {rightRailNav}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={phase}
                    initial={reduce ? false : { opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduce ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.3 }}
                  >
                    {rightRailContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            )}
          </div>
        ) : (
          // desktop: split screen
          <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="h-full overflow-hidden border-r border-white/10 px-8 pb-8 pt-16 lg:px-12">
              <div className="mx-auto h-full max-w-xl">{leftRail}</div>
            </div>
            <div className="h-full overflow-hidden px-8 pb-8 pt-16 lg:px-12">
              <div className="mx-auto h-full max-w-xl">{rightRail}</div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const ArtefactChip = ({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-mint/50 bg-mint/15 text-mint"
        : "border-white/10 text-white/55 hover:border-white/25 hover:text-white/80",
    )}
  >
    {label}
  </button>
);

export default DiagnosisRoom;
