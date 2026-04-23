import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { PriceTicker } from "@/components/PriceTicker";
import { NervousDecisionInput } from "@/components/nervous-decision/Input";

// Plain-English interpretations for a non-technical leader.
// Rotates every ~8 seconds. Easy to tweak in one place.
const INTERPRETATIONS = [
  "Haiku 4.5 runs ~15x cheaper than Opus 4.7 and clears 90% of everyday reasoning tasks. Defaulting to Opus for summarisation burns money.",
  "Gemini 2.5 Pro is the only frontier model under $2/M input. For high-volume classification and extraction, it's the default, not Claude.",
  "Frontier prices dropped ~70% in 12 months. If your AI budget is a fixed line item, you're under-using it, not over-using it.",
];

const OperatorsBrief = () => {
  const [insightIdx, setInsightIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setInsightIdx((i) => (i + 1) % INTERPRETATIONS.length);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative py-20 md:py-24 bg-ink text-white">
      <div className="container-width max-w-4xl">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-mint/80 mb-5">
            <span className="h-1 w-1 rounded-full bg-mint" />
            The Operator's Brief
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-4">
            Live prices. Sharp takes. One nervous decision at a time.
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto">
            The desk I read every morning, condensed. Full dashboard one click away.
          </p>
        </motion.div>

        {/* Moving price ticker */}
        <div className="mb-3">
          <PriceTicker size="sm" tone="dark" />
        </div>

        {/* Rotating plain-English interpretation */}
        <div className="relative h-14 mb-10 flex items-center justify-center px-2">
          <AnimatePresence mode="wait">
            <motion.p
              key={insightIdx}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center text-center text-sm md:text-base text-white/75 leading-snug"
            >
              {INTERPRETATIONS[insightIdx]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Compact Nervous Decision input */}
        <NervousDecisionInput size="compact" tone="dark" />

        {/* Footer row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6 text-[11px] text-white/40">
          <span>Prices via Artificial Analysis, updated hourly.</span>
          <a
            href="/signal"
            className="inline-flex items-center gap-1.5 font-semibold text-white/60 hover:text-mint transition-colors"
          >
            Open the full dashboard <ArrowRight className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default OperatorsBrief;
