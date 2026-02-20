import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
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
  { label: "Perplexity", keep: true },
  { label: "Vendor A pitch", keep: false },
  { label: "Board memo", keep: true },
  { label: "LinkedIn hype", keep: false },
  { label: "McKinsey report", keep: false },
  { label: "CTO's roadmap", keep: false },
];

const workflowPairs = [
  { from: "Weekly briefing", to: "AI draft" },
  { from: "Vendor analysis", to: "Comparison matrix" },
  { from: "Board prep", to: "Slide generator" },
];

const FrameworkJourney = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.666%"]);
  const spotlightIndex = useTransform(scrollYProgress, [0, 0.33, 0.66, 1], [0, 0, 1, 2]);

  return (
    <section ref={containerRef} className="relative bg-ink" style={{ height: "300vh" }}>
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen overflow-hidden flex flex-col">
        {/* Header */}
        <div className="text-center pt-16 pb-8 px-4 shrink-0">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            <MindLabel prefix="Mind" suffix="Set" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Map" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Make" />
          </h2>
          <p className="text-base text-white/50 max-w-lg mx-auto">
            Every leader passes through three phases. Most nervous decisions resolve in the first.
          </p>
        </div>

        {/* Horizontal scroll track */}
        <div className="flex-1 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 flex"
            style={{ x, width: "300%" }}
          >
            <CardPanel index={0} spotlightIndex={spotlightIndex}>
              <MindSetContent />
            </CardPanel>
            <CardPanel index={1} spotlightIndex={spotlightIndex}>
              <MindMapContent />
            </CardPanel>
            <CardPanel index={2} spotlightIndex={spotlightIndex}>
              <MindMakeContent />
            </CardPanel>
          </motion.div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 pb-8 shrink-0">
          {[0, 1, 2].map((i) => (
            <ProgressDot key={i} index={i} spotlightIndex={spotlightIndex} />
          ))}
        </div>
      </div>
    </section>
  );
};

const ProgressDot = ({ index, spotlightIndex }: { index: number; spotlightIndex: any }) => {
  const isActive = useTransform(spotlightIndex, (v: number) => Math.round(v) === index ? 1 : 0.3);
  const width = useTransform(spotlightIndex, (v: number) => Math.round(v) === index ? 32 : 8);

  return (
    <motion.div
      className="h-2 rounded-full bg-mint"
      style={{ opacity: isActive, width }}
      transition={{ duration: 0.3 }}
    />
  );
};

const CardPanel = ({
  index,
  spotlightIndex,
  children,
}: {
  index: number;
  spotlightIndex: any;
  children: React.ReactNode;
}) => {
  const opacity = useTransform(spotlightIndex, (v: number) => {
    const distance = Math.abs(v - index);
    return distance < 0.5 ? 1 : 0.15;
  });

  const scale = useTransform(spotlightIndex, (v: number) => {
    const distance = Math.abs(v - index);
    return distance < 0.5 ? 1 : 0.92;
  });

  const labels = ["MindSet", "MindMap", "MindMake"];
  const icons = [Target, Zap, FileCheck];
  const headlines = ["Filter the noise.", "Build your systems.", "Decide and ship."];
  const Icon = icons[index];

  return (
    <div className="w-1/3 h-full flex items-center justify-center px-4 md:px-8">
      <motion.div
        className="w-full max-w-lg h-[70vh] max-h-[500px] rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-sm p-6 md:p-8 flex flex-col overflow-hidden relative"
        style={{ opacity, scale }}
      >
        {/* Spotlight glow */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            opacity: useTransform(spotlightIndex, (v: number) =>
              Math.abs(v - index) < 0.5 ? 0.15 : 0
            ),
            boxShadow: "inset 0 0 80px rgba(126, 244, 194, 0.3), 0 0 60px rgba(126, 244, 194, 0.15)",
          }}
        />

        {/* Card header */}
        <div className="text-center mb-4 shrink-0">
          <Icon className="w-7 h-7 text-mint mx-auto mb-2" />
          <h3 className="text-xl md:text-2xl font-bold text-white">{headlines[index]}</h3>
          <p className="text-xs text-mint mt-1">{labels[index]}</p>
        </div>

        {/* Card content */}
        <div className="flex-1 overflow-hidden">{children}</div>
      </motion.div>
    </div>
  );
};

const MindSetContent = () => {
  const [visibleCount, setVisibleCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { amount: 0.3 });

  useEffect(() => {
    if (!isInView) return;
    const interval = setInterval(() => {
      setVisibleCount((prev) => {
        if (prev >= noiseItems.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <div ref={ref} className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 scrollbar-thin">
        {noiseItems.map((item, i) => {
          if (i >= visibleCount) return null;
          const settled = visibleCount > noiseItems.length - 1;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-3 py-1.5 rounded text-[12px]"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  item.keep ? "bg-mint" : "bg-red-400/60"
                }`}
              />
              <span
                className={
                  settled && !item.keep
                    ? "line-through text-white/25"
                    : item.keep && settled
                    ? "font-semibold text-white"
                    : "text-white/70"
                }
              >
                {item.label}
              </span>
              {settled && item.keep && (
                <span className="ml-auto text-[10px] font-bold text-mint uppercase">
                  Signal
                </span>
              )}
            </motion.div>
          );
        })}
      </div>
      {visibleCount > noiseItems.length - 1 && (
        <motion.div
          className="mt-3 pt-3 border-t border-white/10 text-center shrink-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <span className="text-xs text-white/40">10 inputs &rarr; </span>
          <span className="text-sm font-bold text-mint">3 that matter</span>
        </motion.div>
      )}
    </div>
  );
};

const MindMapContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="h-full flex flex-col justify-center">
      <div className="space-y-5">
        {workflowPairs.map((pair, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.div
              className="flex-1 px-3 py-2.5 rounded-lg bg-white/[0.06] text-[12px] font-medium text-center text-white/80"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.6 + 0.3 }}
            >
              {pair.from}
            </motion.div>
            <motion.span
              className="text-mint text-sm font-bold"
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: i * 0.6 + 0.7 }}
            >
              &rarr;
            </motion.span>
            <motion.div
              className="flex-1 px-3 py-2.5 rounded-lg bg-mint/15 text-[12px] font-medium text-center text-white border border-mint/20"
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.6 + 0.9 }}
            >
              {pair.to}
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div
        className="text-center mt-6 pt-4 border-t border-white/10"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 2.5 }}
      >
        <span className="text-2xl font-bold text-mint">5&ndash;10 hrs</span>
        <span className="text-sm text-white/50 ml-2">saved every week</span>
      </motion.div>
    </div>
  );
};

const MindMakeContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="h-full flex flex-col justify-center">
      <div className="space-y-4">
        <motion.div
          className="text-[13px] font-bold text-white"
          initial={{ opacity: 0, y: 8 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.5 }}
        >
          Decision: Build vs Buy
        </motion.div>

        <div className="flex gap-3">
          <motion.div
            className="flex-1 p-3 rounded-lg bg-white/[0.06] text-[11px] text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.0 }}
          >
            <div className="font-semibold text-white mb-1">Build</div>
            <div className="text-white/50">Full control. IP ownership. Higher upfront cost.</div>
          </motion.div>
          <motion.div
            className="flex-1 p-3 rounded-lg bg-white/[0.06] text-[11px] text-left"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 1.5 }}
          >
            <div className="font-semibold text-white mb-1">Buy</div>
            <div className="text-white/50">Fast deploy. Vendor risk. Recurring cost.</div>
          </motion.div>
        </div>

        <motion.div
          className="flex items-center gap-2 text-[12px] font-semibold text-mint"
          initial={{ opacity: 0, x: -15 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 2.2 }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Decision: Build (with exit criteria)
        </motion.div>

        <motion.div
          className="flex gap-6 pt-3 border-t border-white/10"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 2.8 }}
        >
          <div>
            <div className="text-[10px] text-white/40">Projected ROI</div>
            <div className="text-xl font-bold text-mint">340%</div>
          </div>
          <div>
            <div className="text-[10px] text-white/40">Time to deploy</div>
            <div className="text-xl font-bold text-mint">6 weeks</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrameworkJourney;
