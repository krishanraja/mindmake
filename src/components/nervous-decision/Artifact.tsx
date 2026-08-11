import { ArrowRight, RotateCcw } from "lucide-react";
import { motion } from "framer-motion";
import {
  NDM_CONFIDENCE_STYLES,
  type NDMArtifact,
} from "@/components/nervous-decision/types";

interface ArtifactProps {
  artifact: NDMArtifact;
  onReset: () => void;
  tone?: "dark" | "light";
}

// Renders the three-card output of the Nervous Decision Machine.
// Used inside OperatorsBrief (homepage teaser) and Brief (full dashboard).
export const Artifact = ({ artifact, onReset, tone = "dark" }: ArtifactProps) => {
  const isDark = tone === "dark";
  const surface = isDark
    ? "bg-white/5 border-mint/30 text-white"
    : "bg-background border-mint/40 text-foreground";
  const mutedText = isDark ? "text-white/80" : "text-foreground/80";
  const subtleText = isDark ? "text-white/60" : "text-muted-foreground";
  const pathSurface = isDark ? "bg-white/[0.04]" : "bg-muted/40";
  const fallbackConfidence = isDark
    ? "bg-white/5 text-white/70 border-white/20"
    : "bg-muted text-muted-foreground border-border";

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className={`rounded-xl p-5 border space-y-4 ${surface}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-mint">
          Your decision card
        </span>
        <button
          onClick={onReset}
          aria-label="Try another decision"
          className={`text-[11px] inline-flex items-center gap-1 hover:text-mint ${subtleText}`}
        >
          <RotateCcw className="w-3 h-3" /> Try another
        </button>
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint mb-1">
          01 {artifact.card1_real_decision.heading}
        </div>
        <p className={`text-[13px] leading-relaxed ${mutedText}`}>
          {artifact.card1_real_decision.body}
        </p>
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint mb-2">
          02 {artifact.card2_three_paths.heading}
        </div>
        <div className="space-y-2">
          {artifact.card2_three_paths.paths.map((p, i) => (
            <div key={i} className={`rounded p-2 ${pathSurface}`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-[12px]">{p.name}</span>
                <span
                  className={`text-[9px] font-bold uppercase tracking-[0.12em] px-1.5 py-0.5 rounded-full border ${
                    NDM_CONFIDENCE_STYLES[p.confidence] || fallbackConfidence
                  }`}
                >
                  {p.confidence}
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${subtleText}`}>{p.tradeoff}</p>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.14em] text-mint mb-2">
          03 {artifact.card3_next_14_days.heading}
        </div>
        <ol className="space-y-1.5">
          {artifact.card3_next_14_days.actions.map((a, i) => (
            <li key={i} className={`flex gap-2 text-[13px] ${mutedText}`}>
              <span className="shrink-0 w-4 h-4 rounded-full bg-mint text-ink text-[10px] font-bold flex items-center justify-center">
                {i + 1}
              </span>
              <span>{a}</span>
            </li>
          ))}
        </ol>
      </div>

      <a
        href="/teardown"
        className="block text-center text-[12px] font-bold text-ink bg-mint rounded py-2 hover:opacity-90 transition-opacity"
      >
        Take it apart properly <ArrowRight className="inline w-3 h-3 ml-1" />
      </a>
    </motion.div>
  );
};
