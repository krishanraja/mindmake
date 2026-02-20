import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FileCheck, Zap, Target } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

const chaosItems = [
  "GPT-4", "Claude", "Copilot", "Gemini", "Midjourney", "Perplexity",
  "Vendor deck", "Board memo", "LinkedIn post", "McKinsey report",
  "Colleague's tip", "CTO's roadmap",
];

const workflowPairs = [
  { from: "Weekly briefing", to: "AI draft" },
  { from: "Vendor analysis", to: "Comparison matrix" },
  { from: "Board prep", to: "Slide generator" },
];

const FrameworkJourney = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container-width">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Mind Set &rarr; Mind Map &rarr; Mind Make
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Every leader passes through three phases. Most nervous decisions resolve in the first.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
          <MindSetCard />
          <MindMapCard />
          <MindMakeCard />
        </div>
      </div>
    </section>
  );
};

const MindSetCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: 0 }}
    >
      <div className="mb-6">
        <Target className="w-8 h-8 text-ink dark:text-white mx-auto mb-3" />
        <h3 className="text-2xl font-bold">Filter the noise.</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-1">Mind Set</p>
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-border/30">
        {chaosItems.map((item, i) => (
          <motion.span
            key={i}
            className="absolute px-2 py-0.5 bg-ink/10 dark:bg-mint/15 text-[10px] rounded whitespace-nowrap text-ink/70 dark:text-white/70"
            style={{
              left: `${(i % 4) * 24 + Math.random() * 8}%`,
              top: `${Math.floor(i / 4) * 30 + Math.random() * 15}%`,
            }}
            initial={{ opacity: 0.8, scale: 0.7 + Math.random() * 0.5, rotate: -12 + Math.random() * 24 }}
            animate={isInView ? { opacity: 0, scale: 0.1, x: "40%", y: "40%", rotate: 0 } : {}}
            transition={{ duration: 1.2, delay: i * 0.07, ease: "easeIn" }}
          >
            {item}
          </motion.span>
        ))}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.3 }}
        >
          <FileCheck className="w-7 h-7 text-ink dark:text-mint mb-1" />
          <span className="text-sm font-semibold text-ink dark:text-white">Your AI Relevance Map</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MindMapCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: 0.15 }}
    >
      <div className="mb-6">
        <Zap className="w-8 h-8 text-ink dark:text-white mx-auto mb-3" />
        <h3 className="text-2xl font-bold">Build your systems.</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-1">Mind Map</p>
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-border/30 p-5">
        {workflowPairs.map((pair, i) => (
          <div key={i} className="flex items-center gap-2 mb-3">
            <motion.div
              className="flex-1 px-2 py-1.5 rounded bg-ink/[0.06] dark:bg-white/[0.06] text-[11px] font-medium text-center"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ ...spring, delay: i * 0.25 + 0.2 }}
            >
              {pair.from}
            </motion.div>
            <motion.span
              className="text-ink/40 dark:text-mint text-xs font-bold"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.25 + 0.35 }}
            >
              &rarr;
            </motion.span>
            <motion.div
              className="flex-1 px-2 py-1.5 rounded bg-ink/10 dark:bg-mint/15 text-[11px] font-medium text-center border border-ink/10 dark:border-mint/20"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ ...spring, delay: i * 0.25 + 0.4 }}
            >
              {pair.to}
            </motion.div>
          </div>
        ))}
        <motion.div
          className="text-center mt-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.3 }}
        >
          <span className="text-lg font-bold text-ink dark:text-mint">5&ndash;10 hrs</span>
          <span className="text-xs text-muted-foreground ml-1">saved/week</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MindMakeCard = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      className="text-center"
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ ...spring, delay: 0.3 }}
    >
      <div className="mb-6">
        <FileCheck className="w-8 h-8 text-ink dark:text-white mx-auto mb-3" />
        <h3 className="text-2xl font-bold">Decide and ship.</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-1">Mind Make</p>
      </div>

      <div className="relative h-48 overflow-hidden rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-border/30 p-4">
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[11px] font-bold text-left">Decision: Build vs Buy</div>
          <div className="flex gap-2">
            <motion.div
              className="flex-1 p-2 rounded bg-ink/[0.06] dark:bg-white/[0.06] text-[10px] text-left"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
            >
              <div className="font-semibold mb-0.5">Build</div>
              <div className="text-muted-foreground">Full control, IP ownership</div>
            </motion.div>
            <motion.div
              className="flex-1 p-2 rounded bg-ink/[0.06] dark:bg-white/[0.06] text-[10px] text-left"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.7 }}
            >
              <div className="font-semibold mb-0.5">Buy</div>
              <div className="text-muted-foreground">Fast deploy, vendor risk</div>
            </motion.div>
          </div>

          <motion.div
            className="flex items-center gap-1 text-ink dark:text-mint text-[11px] font-semibold"
            initial={{ opacity: 0, x: -10 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 1.0 }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Decision: Build (with exit criteria)
          </motion.div>

          <div className="flex gap-4 mt-1">
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.2 }}>
              <div className="text-[10px] text-muted-foreground">ROI</div>
              <div className="text-sm font-bold text-ink dark:text-mint">340%</div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: 1.4 }}>
              <div className="text-[10px] text-muted-foreground">Deploy</div>
              <div className="text-sm font-bold text-ink dark:text-mint">6 weeks</div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FrameworkJourney;
