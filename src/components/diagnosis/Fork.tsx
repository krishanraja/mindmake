import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CalendarClock,
  FileText,
  MessageCircle,
} from "lucide-react";
import { haptics } from "@/lib/haptics";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";
import type { ExitKind, Recommendation } from "./types";

// Single source of truth lives in the session hook; re-exported here so older
// imports (ProposalView, DiagnosisRoom) keep working.
export { CALENDLY_URL } from "./useDiagnosisSession";

interface ForkProps {
  recommendation: Recommendation | null;
  readyForProposal: boolean;
  readyForCall: boolean;
  onKeepChatting: () => void;
  onBookCall: () => void;
  onGenerateProposal: () => void;
}

type ExitId = "learn" | "book-call" | "proposal";

interface ExitDef {
  id: ExitId;
  icon: typeof MessageCircle;
  title: string;
  body: string;
  cta: string;
  onClick: (h: ForkProps) => void;
}

const EXITS: Record<ExitId, ExitDef> = {
  learn: {
    id: "learn",
    icon: MessageCircle,
    title: "Keep thinking it through",
    body: "No rush to book anything. Stay here and keep asking. I'll hand you something free if it helps.",
    cta: "Keep chatting",
    onClick: (h) => h.onKeepChatting(),
  },
  "book-call": {
    id: "book-call",
    icon: CalendarClock,
    title: "Book a call",
    body: "First conversation is free. If you're not a fit, I'll say so on the call, not after you've paid.",
    cta: "Book a call",
    onClick: (h) => h.onBookCall(),
  },
  proposal: {
    id: "proposal",
    icon: FileText,
    title: "See it as a proposal",
    body: "I'll turn your brief into a one-pager you can keep, scoped to the honest next step. Download it as a PDF.",
    cta: "Build the proposal",
    onClick: (h) => h.onGenerateProposal(),
  },
};

/** Map the recommendation's exit kind to which door is primary. */
const primaryFor = (
  exit: ExitKind | undefined,
  readyForProposal: boolean,
  readyForCall: boolean,
): ExitId => {
  if (exit === "book-call") return "book-call";
  if (exit === "proposal") return "proposal";
  if (exit === "self-serve") return "proposal";
  if (exit === "learn") return "learn";
  if (readyForCall) return "book-call";
  if (readyForProposal) return "proposal";
  return "learn";
};

export const Fork = (props: ForkProps) => {
  const { recommendation, readyForProposal, readyForCall } = props;
  const reduce = useReducedMotion();

  const primaryId = primaryFor(
    recommendation?.exit,
    readyForProposal,
    readyForCall,
  );
  const order: ExitId[] = [
    primaryId,
    ...(["learn", "book-call", "proposal"] as ExitId[]).filter(
      (id) => id !== primaryId,
    ),
  ];

  const reveal = (delay: number) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.45 },
        };

  return (
    <div className="space-y-5">
      <motion.div {...reveal(0)}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint/80">
          Where to from here
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
          One honest next step.
        </h3>
        {recommendation?.rung && (
          <p className="mt-1 text-sm text-white/55">
            Based on what you told me, the smallest thing that resolves this is{" "}
            <span className="text-white/80">{recommendation.rung}</span>
            {recommendation.range ? ` (${recommendation.range}).` : "."}
          </p>
        )}
      </motion.div>

      <div className="space-y-3">
        {order.map((id, i) => {
          const exit = EXITS[id];
          const Icon = exit.icon;
          const isPrimary = id === primaryId;
          return (
            <motion.button
              key={id}
              type="button"
              onClick={() => {
                haptics.impact();
                sound.play("tick");
                exit.onClick(props);
              }}
              whileHover={reduce ? undefined : { y: -2 }}
              whileTap={reduce ? undefined : { scale: 0.985 }}
              className={cn(
                "group relative flex w-full items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all",
                isPrimary
                  ? "glass-panel border-mint/40 hover:border-mint/70"
                  : "border-white/10 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.05]",
              )}
              {...reveal(0.08 + i * 0.07)}
            >
              {isPrimary && (
                <span
                  className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-mint/20 blur-3xl"
                  aria-hidden
                />
              )}
              <span
                className={cn(
                  "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full",
                  isPrimary ? "bg-mint/20 text-mint" : "bg-white/5 text-white/60",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="text-base font-semibold text-white">
                    {exit.title}
                  </span>
                  {isPrimary && (
                    <span className="rounded-full bg-mint/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-mint">
                      Recommended
                    </span>
                  )}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-white/60">
                  {exit.body}
                </span>
              </span>
              <ArrowRight
                className={cn(
                  "mt-1 h-5 w-5 shrink-0 transition-transform group-hover:translate-x-0.5",
                  isPrimary ? "text-mint" : "text-white/40",
                )}
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default Fork;
