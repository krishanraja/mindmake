import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarClock, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useDiagnosisSession, CALENDLY_URL } from "./useDiagnosisSession";
import { Opener } from "./Opener";
import { Conversation } from "./Conversation";
import { DossierReveal } from "./DossierReveal";
import { DecisionBrief } from "./DecisionBrief";
import { Fork } from "./Fork";
import { ProposalView } from "./ProposalView";
import { ExpressBooking } from "./ExpressBooking";
import { MindyAvatar } from "./MindyAvatar";
import { Button } from "@/components/ui/button";
import type { SessionMode } from "./types";

export interface DiagnosisRoomProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Where the room was opened from (for analytics / context). */
  sourcePage?: string;
  /** "express" rushes to a booking; "full" runs the diagnosis. Default "full". */
  mode?: SessionMode;
}

// rough sense of progress through the full diagnosis (never an exact bar)
const phaseStep = (phase: string): { step: number; total: number } | null => {
  switch (phase) {
    case "reflect":
    case "chat":
      return { step: 1, total: 3 };
    case "brief":
      return { step: 2, total: 3 };
    case "fork":
    case "proposal":
      return { step: 3, total: 3 };
    default:
      return null;
  }
};

/**
 * THE DIAGNOSIS ROOM.
 *
 * A full-screen, permanently-dark immersive overlay (above the navbar) that
 * composes the scenes via the session state machine in useDiagnosisSession.
 *
 * Open it by mounting it once near ScopingModal in App.tsx and toggling `open`,
 * driven by a window CustomEvent("openDiagnosisRoom", { detail: { mode } }).
 * Close with Esc or the X. A persistent "Book a call" exit is always visible.
 */
export const DiagnosisRoom = ({
  open,
  onOpenChange,
  mode = "full",
}: DiagnosisRoomProps) => {
  const isMobile = useIsMobile();
  const reduce = useReducedMotion();
  const session = useDiagnosisSession();
  // mobile: which pane is showing, the talk or the artefact
  const [mobilePane, setMobilePane] = useState<"talk" | "brief">("talk");

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
    contact,
  } = session;

  const { setMode } = session;

  // seed the session mode whenever the room opens, before paint, so the opener
  // never flashes the wrong variant.
  useLayoutEffect(() => {
    if (open) setMode(mode);
  }, [open, mode, setMode]);


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
    const t = setTimeout(() => {
      session.reset();
      setMobilePane("talk");
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // when the artefact first appears on mobile, nudge attention to it
  const hasArtefact =
    coBranded ||
    !!decisionBrief ||
    phase === "fork" ||
    phase === "proposal" ||
    phase === "express-book";

  const handleClose = useCallback(() => {
    // a meaningful chat that never forked still counts as a soft chat-end
    if (turns.length > 1 && (phase === "chat" || phase === "reflect")) {
      void session.endSession("chat");
    }
    onOpenChange(false);
  }, [turns.length, phase, session, onOpenChange]);

  if (!open) return null;

  const showOpener = phase === "opener";
  const isExpressBook = phase === "express-book";
  const progress = phaseStep(phase);

  // ---- the persistent "book a call" exit (visible at every step) ----------
  const persistentBookCall = !showOpener && !isExpressBook && (
    <button
      type="button"
      onClick={() => session.bookCall(CALENDLY_URL)}
      className="inline-flex items-center gap-1.5 rounded-full border border-mint/30 bg-mint/[0.08] px-3 py-1.5 text-xs font-semibold text-mint transition-colors hover:border-mint/60 hover:bg-mint/15 min-h-[36px]"
    >
      <CalendarClock className="h-3.5 w-3.5" />
      Book a call
    </button>
  );

  // ---- the left rail: Mindy + the conversation ----------------------------
  const leftRail = (
    <div className="flex h-full flex-col">
      <div className="mb-4 flex shrink-0 items-center gap-3">
        <MindyAvatar
          size={40}
          state={thinking || reading ? "thinking" : "idle"}
        />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-white">Mindy</p>
          <p className="truncate text-xs text-white/55">
            {reading
              ? `Reading up on ${dossier?.identity?.name || "your company"}`
              : thinking
                ? "Thinking"
                : progress
                  ? `Step ${progress.step} of ${progress.total}`
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
          onBookCall={() => session.bookCall(CALENDLY_URL)}
          onTranscribe={session.transcribeAudio}
          disabled={reading}
        />
      </div>
    </div>
  );

  // ---- the right rail: the artefact that's building -----------------------
  const rightRailContent = () => {
    if (isExpressBook) {
      return (
        <ExpressBooking
          contact={contact}
          decision={turns.find((t) => t.role === "user")?.content || ""}
          onBookCall={() => session.bookCall(CALENDLY_URL)}
          onSwitchToFull={session.switchToFull}
        />
      );
    }

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
      return (
        <DossierReveal
          dossier={dossier}
          onCorrect={() =>
            session.send("One quick correction about my business.")
          }
        />
      );
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
  const rightRailNav = !showOpener && !isExpressBook && (hasBrief || coBranded) && (
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

      {/* fixed room header: persistent book-call exit + close, safe-area aware */}
      <div
        className="absolute inset-x-0 top-0 z-10 flex items-center justify-end gap-2 px-4 pt-3 sm:px-6"
        style={{ paddingTop: "max(0.75rem, env(safe-area-inset-top))" }}
      >
        {persistentBookCall}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClose}
          className="h-10 w-10 shrink-0 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
          aria-label="Close the room"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* content */}
      <div className="relative z-[1] h-full">
        {showOpener ? (
          <Opener
            mode={session.mode}
            onStart={session.start}
            onExpressBook={session.startExpress}
            onSwitchToFull={session.switchToFull}
            onTranscribe={session.transcribeAudio}
            busy={reading}
          />
        ) : isMobile ? (
          // mobile: single column with a talk/artefact tab switch. The talk
          // leads; the artefact is one tap away. Express jumps straight to the
          // booking pane.
          <div
            className="flex h-full flex-col px-4 pb-4"
            style={{
              paddingTop: "max(4rem, calc(env(safe-area-inset-top) + 3.5rem))",
              paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
            }}
          >
            {isExpressBook ? (
              <div className="min-h-0 flex-1">{rightRailContent()}</div>
            ) : (
              <>
                {hasArtefact && (
                  <div className="mb-3 flex shrink-0 gap-1 rounded-full border border-white/10 bg-white/[0.03] p-1">
                    <PaneTab
                      active={mobilePane === "talk"}
                      onClick={() => setMobilePane("talk")}
                      label="Talk"
                    />
                    <PaneTab
                      active={mobilePane === "brief"}
                      onClick={() => setMobilePane("brief")}
                      label="Your brief"
                    />
                  </div>
                )}
                <div className="min-h-0 flex-1">
                  {mobilePane === "talk" || !hasArtefact ? (
                    leftRail
                  ) : (
                    <div className="h-full overflow-y-auto rounded-2xl border border-white/10 bg-white/[0.02] p-4">
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
              </>
            )}
          </div>
        ) : (
          // desktop: split screen
          <div className="grid h-full grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
            <div className="h-full overflow-hidden border-r border-white/10 px-8 pb-8 pt-16 lg:px-12">
              <div className="mx-auto h-full max-w-xl">{leftRail}</div>
            </div>
            <div className="h-full overflow-hidden px-8 pb-8 pt-16 lg:px-12">
              <div className="mx-auto h-full max-w-xl">
                {isExpressBook ? rightRailContent() : rightRail}
              </div>
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
      "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px]",
      active
        ? "border-mint/50 bg-mint/15 text-mint"
        : "border-white/10 text-white/55 hover:border-white/25 hover:text-white/80",
    )}
  >
    {label}
  </button>
);

const PaneTab = ({
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
      "flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors min-h-[40px]",
      active ? "bg-mint/15 text-mint" : "text-white/55 hover:text-white/80",
    )}
  >
    {label}
  </button>
);

export default DiagnosisRoom;
