import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, GitBranch, ListChecks, Target } from "lucide-react";
import type { DecisionBrief as Brief, Dossier } from "./types";

interface DecisionBriefProps {
  brief: Brief | null;
  dossier?: Dossier | null;
  /** Optional placeholder shown while the brief is still forming. */
  forming?: boolean;
}

/**
 * The one-screen brief the visitor keeps. No email wall. This is the spine of
 * all three exits: a learner screenshots it, a booked call opens on it, the
 * proposal is built from it.
 */
export const DecisionBrief = ({ brief, dossier, forming }: DecisionBriefProps) => {
  const reduce = useReducedMotion();
  const company = dossier?.identity?.name;

  const reveal = (delay: number) =>
    reduce
      ? { initial: false }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { delay, duration: 0.5, ease: [0.4, 0, 0.2, 1] as const },
        };

  if (!brief) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
        <div className="h-10 w-10 rounded-full border-2 border-mint/30 border-t-mint motion-safe:animate-spin" />
        <p className="text-sm text-white/55">
          {forming
            ? "Pulling your decision into one screen"
            : "We'll write the brief once the decision is clear."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...reveal(0)}>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-mint/80">
          Decision brief
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-white sm:text-2xl">
          {company ? `Mindmaker × ${company}` : "Your decision, on one screen"}
        </h3>
        <p className="mt-1 text-xs text-white/45">Yours to keep. No email needed.</p>
      </motion.div>

      {/* the real decision */}
      <motion.div
        className="rounded-xl border border-white/10 bg-white/[0.03] p-5"
        {...reveal(0.08)}
      >
        <div className="mb-2 flex items-center gap-2">
          <Target className="h-4 w-4 text-mint" />
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
            The real decision
          </p>
        </div>
        <p className="text-base leading-relaxed text-white/90">
          {brief.realDecision}
        </p>
      </motion.div>

      {/* paths with trade-offs */}
      {brief.paths?.length > 0 && (
        <motion.div {...reveal(0.16)}>
          <div className="mb-3 flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-mint" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/55">
              The paths
            </p>
          </div>
          <div className="space-y-3">
            {brief.paths.map((p, i) => (
              <motion.div
                key={`${p.name}-${i}`}
                className="rounded-xl border border-white/10 p-4"
                {...reveal(0.2 + i * 0.06)}
              >
                <p className="text-sm font-semibold text-white">{p.name}</p>
                <p className="mt-1 text-sm leading-relaxed text-white/65">
                  <span className="text-white/45">Trade-off: </span>
                  {p.tradeoff}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* weak assumption */}
      {brief.weakAssumption && (
        <motion.div
          className="rounded-xl border border-amber-300/20 bg-amber-300/[0.04] p-5"
          {...reveal(0.32)}
        >
          <div className="mb-2 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-300/80" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100/70">
              The weak assumption to test
            </p>
          </div>
          <p className="text-sm leading-relaxed text-white/85">
            {brief.weakAssumption}
          </p>
        </motion.div>
      )}

      {/* next 14 days */}
      {brief.next14Days && (
        <motion.div
          className="rounded-xl border border-mint/20 bg-mint/[0.05] p-5"
          {...reveal(0.4)}
        >
          <div className="mb-2 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-mint" />
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mint/90">
              The next 14 days
            </p>
          </div>
          <p className="text-sm leading-relaxed text-white/90">
            {brief.next14Days}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default DecisionBrief;
