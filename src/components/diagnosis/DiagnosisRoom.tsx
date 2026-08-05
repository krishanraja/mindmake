import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
} from "framer-motion";
import {
  CalendarClock,
  GripHorizontal,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useKeyboardInset } from "@/hooks/useKeyboardInset";
import { haptics } from "@/lib/haptics";
import { sound } from "@/lib/sound";
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
 * Mobile is the first-class surface: a drifting mint aurora, a real in-flow
 * header (with a drag grabber, mute toggle, and the persistent book-call exit),
 * keyboard-aware content that floats the composer above the soft keyboard, and
 * a grabber-only drag-to-dismiss that never fights the inner scroll regions.
 *
 * Open it by mounting it once near ScopingModal in App.tsx and toggling `open`,
 * driven by a window CustomEvent("openDiagnosisRoom", { detail: { mode } }).
 * Close with Esc, the X, or a downward pull on the grabber.
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
  const [muted, setMuted] = useState(true);

  // keyboard avoidance (mobile only attaches listeners)
  const { keyboardHeight } = useKeyboardInset(isMobile && open);

  // drag-to-dismiss (mobile only; started from the grabber)
  const dragControls = useDragControls();
  const y = useMotionValue(0);
  const auroraOpacity = useTransform(y, [0, 300], [1, 0.35]);

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

  // reflect the persisted sound preference into the header toggle on mount
  useEffect(() => {
    setMuted(sound.isMuted());
  }, []);

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
      y.set(0);
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // a subtle cue as the room moves between phases (skips the first paint)
  const lastPhase = useRef<string | null>(null);
  useEffect(() => {
    if (!open) {
      lastPhase.current = null;
      return;
    }
    if (lastPhase.current && lastPhase.current !== phase && phase !== "opener") {
      sound.play("tick");
    }
    lastPhase.current = phase;
  }, [phase, open]);

  // Follow the auto-advance on mobile: when the room reaches the brief / three
  // exits / proposal, bring that pane forward so the payoff is actually seen
  // (otherwise it stays buried behind the "Your brief" tab). "Keep chatting"
  // returns the visitor to the conversation.
  useEffect(() => {
    if (phase === "brief" || phase === "fork" || phase === "proposal") {
      setMobilePane("brief");
    } else if (phase === "chat") {
      setMobilePane("talk");
    }
  }, [phase]);

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

  // every booking exit gets a small reward (haptic + chime) before it fires
  const handleBookCall = useCallback(() => {
    haptics.success();
    sound.play("chime");
    session.bookCall(CALENDLY_URL);
  }, [session]);

  const toggleMute = useCallback(() => {
    const nowMuted = sound.toggleMuted();
    setMuted(nowMuted);
    haptics.tap();
    if (!nowMuted) sound.play("tick"); // confirm un-mute audibly
  }, []);

  const switchPane = useCallback((pane: "talk" | "brief") => {
    haptics.select();
    sound.play("tick");
    setMobilePane(pane);
  }, []);

  const handleDragEnd = useCallback(
    (_e: PointerEvent | MouseEvent | TouchEvent, info: PanInfo) => {
      const shouldClose = info.offset.y > 120 || info.velocity.y > 600;
      if (shouldClose) {
        haptics.impact();
        sound.play("swoosh");
        animate(y, window.innerHeight, {
          duration: 0.24,
          ease: [0.4, 0, 1, 1],
        }).then(() => handleClose());
      } else {
        animate(y, 0, { type: "spring", stiffness: 500, damping: 40 });
      }
    },
    [y, handleClose],
  );

  if (!open) return null;

  const showOpener = phase === "opener";
  const isExpressBook = phase === "express-book";
  const progress = phaseStep(phase);
  const dragEnabled = isMobile && !reduce;

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
          onBookCall={handleBookCall}
          onTranscribe={session.transcribeAudio}
          disabled={reading}
          keyboardHeight={keyboardHeight}
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
          onBookCall={handleBookCall}
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
          onBookCall={handleBookCall}
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
          onBookCall={handleBookCall}
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
        <div className="relative h-14 w-14">
          <span className="absolute inset-0 rounded-full bg-mint/15 blur-xl motion-safe:animate-pulse" />
          <span className="absolute inset-0 rounded-full bg-mint/10 ring-1 ring-mint/25" />
        </div>
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
          onClick={() => {
            haptics.tap();
            session.keepChatting();
          }}
          label="What I heard"
        />
      )}
      {hasBrief && (
        <ArtefactChip
          active={phase === "brief"}
          onClick={() => {
            haptics.tap();
            session.viewBrief();
          }}
          label="Decision brief"
        />
      )}
      {hasBrief && (
        <ArtefactChip
          active={phase === "fork"}
          onClick={() => {
            haptics.tap();
            session.goToFork();
          }}
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
      className="fixed inset-0 z-[200] overflow-hidden bg-ink text-white"
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
      {/* base room gradient (always dark, theme-independent) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-ink-900 via-ink to-ink-700/50" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink-900/85 via-transparent to-mint/[0.04]" />

      {/* drifting mint aurora, fades as the room is pulled away */}
      {!reduce && (
        <motion.div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          style={{ opacity: auroraOpacity }}
        >
          <span
            className="aurora-blob bg-mint/15"
            style={{ top: "-12%", right: "-10%", height: 460, width: 460 }}
          />
          <span
            className="aurora-blob bg-emerald-400/10"
            style={{
              bottom: "-18%",
              left: "-12%",
              height: 520,
              width: 520,
              animationDelay: "-7s",
            }}
          />
          <span
            className="aurora-blob bg-cyan-300/[0.07]"
            style={{
              top: "32%",
              left: "38%",
              height: 360,
              width: 360,
              animationDelay: "-14s",
            }}
          />
        </motion.div>
      )}

      {/* the draggable shell (mobile), header + content move together; the
          grabber is the only drag initiator so inner scroll never dismisses. */}
      <motion.div
        className="relative z-[1] flex h-full flex-col"
        style={dragEnabled ? { y } : undefined}
        drag={dragEnabled ? "y" : false}
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.6 }}
        onDragEnd={handleDragEnd}
      >
        <RoomHeader
          showGrabber={dragEnabled}
          showBookCall={!isExpressBook}
          muted={muted}
          onToggleMute={toggleMute}
          onBookCall={handleBookCall}
          onClose={handleClose}
          onGrab={(e) => dragControls.start(e)}
        />

        <div className="min-h-0 flex-1">
          {showOpener ? (
            <Opener
              mode={session.mode}
              onStart={session.start}
              onExpressBook={session.startExpress}
              onSwitchToFull={session.switchToFull}
              onTranscribe={session.transcribeAudio}
              busy={reading}
              keyboardHeight={keyboardHeight}
            />
          ) : isMobile ? (
            // mobile: single column with a talk/artefact tab switch. The talk
            // leads; the artefact is one tap away. Express jumps straight to
            // the booking pane.
            <div
              className="flex h-full flex-col px-4 pt-1"
              style={{
                paddingBottom: `max(1rem, env(safe-area-inset-bottom), ${keyboardHeight}px)`,
              }}
            >
              {isExpressBook ? (
                <div className="min-h-0 flex-1">{rightRailContent()}</div>
              ) : (
                <>
                  {hasArtefact && (
                    <div className="mb-3 flex shrink-0 gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md">
                      <PaneTab
                        active={mobilePane === "talk"}
                        onClick={() => switchPane("talk")}
                        label="Talk"
                      />
                      <PaneTab
                        active={mobilePane === "brief"}
                        onClick={() => switchPane("brief")}
                        label="Your brief"
                      />
                    </div>
                  )}
                  <div className="min-h-0 flex-1">
                    {mobilePane === "talk" || !hasArtefact ? (
                      leftRail
                    ) : (
                      <div className="glass-panel h-full overflow-y-auto rounded-2xl p-4">
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
              <div className="h-full overflow-hidden border-r border-white/10 px-8 pb-8 pt-6 lg:px-12">
                <div className="mx-auto h-full max-w-xl">{leftRail}</div>
              </div>
              <div className="h-full overflow-hidden px-8 pb-8 pt-6 lg:px-12">
                <div className="mx-auto h-full max-w-xl">
                  {isExpressBook ? rightRailContent() : rightRail}
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ---------------------------------------------------------------------------
// The in-flow room header. Reserves its own layout height (so the Opener
// headline can never sit under it), is safe-area aware, and carries the drag
// grabber, the sound toggle, the persistent book-call exit, and close.
// ---------------------------------------------------------------------------
const RoomHeader = ({
  showGrabber,
  showBookCall,
  muted,
  onToggleMute,
  onBookCall,
  onClose,
  onGrab,
}: {
  showGrabber: boolean;
  showBookCall: boolean;
  muted: boolean;
  onToggleMute: () => void;
  onBookCall: () => void;
  onClose: () => void;
  onGrab: (e: React.PointerEvent) => void;
}) => (
  <div
    className="relative z-10 shrink-0"
    style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}
  >
    {showGrabber && (
      <button
        type="button"
        aria-label="Drag down to close"
        onPointerDown={onGrab}
        className="mx-auto flex h-7 w-full max-w-[120px] cursor-grab touch-none items-center justify-center active:cursor-grabbing"
      >
        <span className="h-1.5 w-10 rounded-full bg-white/25 transition-colors hover:bg-white/40" />
      </button>
    )}
    <div className="flex items-center gap-2 px-3 pb-2 pt-1 sm:px-6">
      <button
        type="button"
        onClick={onToggleMute}
        aria-pressed={!muted}
        aria-label={muted ? "Turn sound on" : "Turn sound off"}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white/45 transition-colors hover:bg-white/10 hover:text-white/80"
      >
        {muted ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4 text-mint" />
        )}
      </button>
      <div className="flex-1" />
      {showBookCall && (
        <button
          type="button"
          onClick={onBookCall}
          className="inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-mint/30 bg-mint/[0.08] px-3.5 py-1.5 text-xs font-semibold text-mint transition-all hover:border-mint/60 hover:bg-mint/15 active:scale-[0.97]"
        >
          <CalendarClock className="h-3.5 w-3.5" />
          Book a call
        </button>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="h-10 w-10 shrink-0 rounded-full text-white/60 hover:bg-white/10 hover:text-white"
        aria-label="Close the room"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  </div>
);

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
      "relative min-h-[44px] rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
      active
        ? "border-mint/50 text-ink"
        : "border-white/10 text-white/55 hover:border-white/25 hover:text-white/80",
    )}
  >
    {active && (
      <motion.span
        layoutId="artefactChipIndicator"
        className="absolute inset-0 rounded-full bg-mint"
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      />
    )}
    <span className="relative z-[1]">{label}</span>
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
      "relative min-h-[44px] flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors",
      active ? "text-ink" : "text-white/55 hover:text-white/80",
    )}
  >
    {active && (
      <motion.span
        layoutId="paneTabIndicator"
        className="absolute inset-0 rounded-full bg-mint shadow-[0_2px_16px_-4px_rgba(0,217,182,0.5)]"
        transition={{ type: "spring", stiffness: 400, damping: 32 }}
      />
    )}
    <span className="relative z-[1]">{label}</span>
  </button>
);

export default DiagnosisRoom;
