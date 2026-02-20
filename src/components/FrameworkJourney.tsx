import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Zap, FileCheck } from "lucide-react";

const MindLabel = ({ prefix, suffix }: { prefix: string; suffix: string }) => (
  <span>
    {prefix}<span className="text-ink dark:text-mint font-black">{suffix}</span>
  </span>
);

const noiseItems = [
  { label: "GPT-4o", keep: false },
  { label: "Claude 3.5", keep: true },
  { label: "Copilot", keep: false },
  { label: "Gemini Pro", keep: false },
  { label: "Midjourney", keep: false },
  { label: "Perplexity", keep: true },
  { label: "Vendor A pitch", keep: false },
  { label: "Board memo", keep: true },
  { label: "LinkedIn hype", keep: false },
  { label: "McKinsey report", keep: false },
  { label: "CTO's roadmap", keep: false },
  { label: "Colleague's tip", keep: false },
];

const workflowPairs = [
  { from: "Weekly briefing", to: "AI draft" },
  { from: "Vendor analysis", to: "Comparison matrix" },
  { from: "Board prep", to: "Slide generator" },
];

const FrameworkJourney = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const card1Opacity = useTransform(scrollYProgress, [0.1, 0.25, 0.4, 0.55], [0.3, 1, 1, 0.3]);
  const card2Opacity = useTransform(scrollYProgress, [0.25, 0.4, 0.55, 0.7], [0.3, 1, 1, 0.3]);
  const card3Opacity = useTransform(scrollYProgress, [0.4, 0.55, 0.7, 0.85], [0.3, 1, 1, 0.3]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-background">
      <div className="container-width">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <MindLabel prefix="Mind" suffix="Set" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Map" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Make" />
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Every leader passes through three phases. Most nervous decisions resolve in the first.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10 lg:gap-14">
          <MindSetCard opacityValue={card1Opacity} />
          <MindMapCard opacityValue={card2Opacity} />
          <MindMakeCard opacityValue={card3Opacity} />
        </div>
      </div>
    </section>
  );
};

const MindSetCard = ({ opacityValue }: { opacityValue: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div ref={ref} className="text-center" style={{ opacity: opacityValue }}>
      <div className="mb-6">
        <Target className="w-8 h-8 text-ink dark:text-white mx-auto mb-3" />
        <h3 className="text-2xl font-bold">Filter the noise.</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-1">
          <MindLabel prefix="Mind" suffix="Set" />
        </p>
      </div>

      {/* Filtering animation: items appear, noise gets struck through and fades, signal stays */}
      <div className="relative overflow-hidden rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-border/30 p-4">
        <div className="space-y-1.5">
          {noiseItems.map((item, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-[12px]"
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.3, delay: i * 0.2 }}
            >
              {/* Strike-through for noise, highlight for signal */}
              <motion.div
                className="flex items-center gap-2 w-full"
                animate={
                  isInView
                    ? item.keep
                      ? { opacity: 1 }
                      : { opacity: 0.25 }
                    : {}
                }
                transition={{ duration: 0.8, delay: i * 0.2 + 1.5 }}
              >
                <motion.div
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    item.keep
                      ? "bg-emerald-500 dark:bg-mint"
                      : "bg-red-400/60"
                  }`}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: i * 0.2 + 1.5 }}
                />
                <span
                  className={
                    item.keep
                      ? "font-semibold text-ink dark:text-white"
                      : "line-through text-muted-foreground"
                  }
                >
                  {item.label}
                </span>
                {item.keep && (
                  <motion.span
                    className="ml-auto text-[10px] font-bold text-emerald-600 dark:text-mint uppercase"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: i * 0.2 + 2.5 }}
                  >
                    Signal
                  </motion.span>
                )}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Summary at bottom */}
        <motion.div
          className="mt-4 pt-3 border-t border-border/30 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 4.5, duration: 0.8 }}
        >
          <span className="text-xs text-muted-foreground">12 inputs &rarr; </span>
          <span className="text-sm font-bold text-ink dark:text-mint">3 that matter</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MindMapCard = ({ opacityValue }: { opacityValue: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div ref={ref} className="text-center" style={{ opacity: opacityValue }}>
      <div className="mb-6">
        <Zap className="w-8 h-8 text-ink dark:text-white mx-auto mb-3" />
        <h3 className="text-2xl font-bold">Build your systems.</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-1">
          <MindLabel prefix="Mind" suffix="Map" />
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-border/30 p-5">
        <div className="space-y-4">
          {workflowPairs.map((pair, i) => (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                className="flex-1 px-3 py-2 rounded-lg bg-ink/[0.06] dark:bg-white/[0.06] text-[12px] font-medium text-center"
                initial={{ opacity: 0, x: -30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.8 + 0.5 }}
              >
                {pair.from}
              </motion.div>
              <motion.div
                className="text-ink/30 dark:text-mint text-sm font-bold"
                initial={{ opacity: 0, scale: 0 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: i * 0.8 + 1.0 }}
              >
                &rarr;
              </motion.div>
              <motion.div
                className="flex-1 px-3 py-2 rounded-lg bg-ink/10 dark:bg-mint/15 text-[12px] font-medium text-center border border-ink/10 dark:border-mint/20"
                initial={{ opacity: 0, x: 30 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.8 + 1.2 }}
              >
                {pair.to}
              </motion.div>
            </div>
          ))}
        </div>

        <motion.div
          className="text-center mt-5 pt-3 border-t border-border/30"
          initial={{ opacity: 0, y: 10 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 3.5, duration: 0.6 }}
        >
          <span className="text-2xl font-bold text-ink dark:text-mint">5&ndash;10 hrs</span>
          <span className="text-sm text-muted-foreground ml-2">saved every week</span>
        </motion.div>
      </div>
    </motion.div>
  );
};

const MindMakeCard = ({ opacityValue }: { opacityValue: any }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  return (
    <motion.div ref={ref} className="text-center" style={{ opacity: opacityValue }}>
      <div className="mb-6">
        <FileCheck className="w-8 h-8 text-ink dark:text-white mx-auto mb-3" />
        <h3 className="text-2xl font-bold">Decide and ship.</h3>
        <p className="text-sm text-ink/60 dark:text-white/50 mt-1">
          <MindLabel prefix="Mind" suffix="Make" />
        </p>
      </div>

      <div className="relative overflow-hidden rounded-xl bg-ink/[0.03] dark:bg-white/[0.03] border border-border/30 p-5">
        <motion.div
          className="text-left space-y-3"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {/* Decision header */}
          <motion.div
            className="text-[13px] font-bold"
            initial={{ opacity: 0, y: 8 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.8 }}
          >
            Decision: Build vs Buy
          </motion.div>

          {/* Two options */}
          <div className="flex gap-3">
            <motion.div
              className="flex-1 p-3 rounded-lg bg-ink/[0.06] dark:bg-white/[0.06] text-[11px]"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.5, duration: 0.5 }}
            >
              <div className="font-semibold mb-1">Build</div>
              <div className="text-muted-foreground">Full control. IP ownership. Higher upfront cost.</div>
            </motion.div>
            <motion.div
              className="flex-1 p-3 rounded-lg bg-ink/[0.06] dark:bg-white/[0.06] text-[11px]"
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 2.0, duration: 0.5 }}
            >
              <div className="font-semibold mb-1">Buy</div>
              <div className="text-muted-foreground">Fast deploy. Vendor risk. Recurring cost.</div>
            </motion.div>
          </div>

          {/* Decision made */}
          <motion.div
            className="flex items-center gap-2 text-[12px] font-semibold text-ink dark:text-mint pt-1"
            initial={{ opacity: 0, x: -15 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 3.0, duration: 0.5 }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            Decision: Build (with exit criteria)
          </motion.div>

          {/* Metrics */}
          <motion.div
            className="flex gap-6 pt-2 border-t border-border/30"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 3.8, duration: 0.6 }}
          >
            <div>
              <div className="text-[10px] text-muted-foreground">Projected ROI</div>
              <div className="text-xl font-bold text-ink dark:text-mint">340%</div>
            </div>
            <div>
              <div className="text-[10px] text-muted-foreground">Time to deploy</div>
              <div className="text-xl font-bold text-ink dark:text-mint">6 weeks</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FrameworkJourney;
