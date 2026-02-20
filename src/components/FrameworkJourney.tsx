import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { Target, Zap, FileCheck } from "lucide-react";

const MindLabel = ({ prefix, suffix }: { prefix: string; suffix: string }) => (
  <span>
    {prefix}<span className="text-mint font-black">{suffix}</span>
  </span>
);

const noiseItems = [
  { label: "GPT-4o", keep: false },
  { label: "Claude 3.5", keep: true },
  { label: "Copilot", keep: false },
  { label: "Gemini Pro", keep: false },
  { label: "Perplexity", keep: true },
  { label: "Vendor pitch", keep: false },
  { label: "Board memo", keep: true },
  { label: "LinkedIn hype", keep: false },
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

  const spotlight = useTransform(scrollYProgress, [0.2, 0.35, 0.5, 0.65, 0.8], [0, 0, 1, 2, 2]);

  return (
    <section ref={sectionRef} className="py-24 md:py-32 bg-ink">
      <div className="container-width">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            <MindLabel prefix="Mind" suffix="Set" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Map" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Make" />
          </h2>
          <p className="text-base text-white/40 max-w-lg mx-auto">
            Three phases. Most nervous decisions resolve in the first.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          <Card index={0} spotlight={spotlight} icon={Target} label="MindSet" headline="Filter the noise.">
            <MindSetContent />
          </Card>
          <Card index={1} spotlight={spotlight} icon={Zap} label="MindMap" headline="Build your systems.">
            <MindMapContent />
          </Card>
          <Card index={2} spotlight={spotlight} icon={FileCheck} label="MindMake" headline="Decide and ship.">
            <MindMakeContent />
          </Card>
        </div>
      </div>
    </section>
  );
};

const Card = ({
  index,
  spotlight,
  icon: Icon,
  label,
  headline,
  children,
}: {
  index: number;
  spotlight: any;
  icon: any;
  label: string;
  headline: string;
  children: React.ReactNode;
}) => {
  const opacity = useTransform(spotlight, (v: number) => {
    const dist = Math.abs(v - index);
    return dist < 0.6 ? 1 : 0.25;
  });

  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex flex-col h-[400px] relative overflow-hidden"
      style={{ opacity }}
    >
      {/* Glow when active */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          opacity: useTransform(spotlight, (v: number) =>
            Math.abs(v - index) < 0.6 ? 0.25 : 0
          ),
          boxShadow:
            "inset 0 0 60px rgba(126, 244, 194, 0.2), 0 0 40px rgba(126, 244, 194, 0.1)",
        }}
      />

      <div className="text-center mb-4 shrink-0">
        <Icon className="w-6 h-6 text-mint mx-auto mb-2" />
        <h3 className="text-lg md:text-xl font-bold text-white">{headline}</h3>
        <p className="text-xs text-mint mt-0.5">{label}</p>
      </div>

      <div className="flex-1 overflow-hidden">{children}</div>
    </motion.div>
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
        if (prev >= noiseItems.length) { clearInterval(interval); return prev; }
        return prev + 1;
      });
    }, 350);
    return () => clearInterval(interval);
  }, [isInView]);

  const settled = visibleCount >= noiseItems.length;

  return (
    <div ref={ref} className="h-full flex flex-col">
      <div className="flex-1 space-y-1 overflow-hidden">
        {noiseItems.map((item, i) => {
          if (i >= visibleCount) return null;
          return (
            <motion.div
              key={i}
              className="flex items-center gap-2 px-2 py-1 rounded text-[11px]"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.keep ? "bg-mint" : "bg-red-400/50"}`} />
              <span className={settled && !item.keep ? "line-through text-white/20" : item.keep && settled ? "font-semibold text-white" : "text-white/60"}>
                {item.label}
              </span>
              {settled && item.keep && <span className="ml-auto text-[9px] font-bold text-mint uppercase">Signal</span>}
            </motion.div>
          );
        })}
      </div>
      {settled && (
        <motion.div className="pt-2 border-t border-white/10 text-center shrink-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span className="text-[10px] text-white/30">8 inputs &rarr; </span>
          <span className="text-xs font-bold text-mint">3 that matter</span>
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
      <div className="space-y-3">
        {workflowPairs.map((pair, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <motion.div
              className="flex-1 px-2 py-2 rounded bg-white/[0.06] text-[11px] font-medium text-center text-white/70"
              initial={{ opacity: 0, x: -15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.5 + 0.3 }}
            >
              {pair.from}
            </motion.div>
            <motion.span className="text-mint text-[10px] font-bold" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: i * 0.5 + 0.6 }}>
              &rarr;
            </motion.span>
            <motion.div
              className="flex-1 px-2 py-2 rounded bg-mint/15 text-[11px] font-medium text-center text-white border border-mint/20"
              initial={{ opacity: 0, x: 15 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ type: "spring", stiffness: 60, damping: 15, delay: i * 0.5 + 0.7 }}
            >
              {pair.to}
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div className="text-center mt-4 pt-3 border-t border-white/10" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
        <span className="text-lg font-bold text-mint">5&ndash;10 hrs</span>
        <span className="text-xs text-white/40 ml-1">saved/week</span>
      </motion.div>
    </div>
  );
};

const MindMakeContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div ref={ref} className="h-full flex flex-col justify-center">
      <div className="space-y-3">
        <motion.div className="text-[12px] font-bold text-white" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.3 }}>
          Decision: Build vs Buy
        </motion.div>
        <div className="flex gap-2">
          <motion.div className="flex-1 p-2 rounded bg-white/[0.06] text-[10px]" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 0.8 }}>
            <div className="font-semibold text-white mb-0.5">Build</div>
            <div className="text-white/40">Full control. IP ownership.</div>
          </motion.div>
          <motion.div className="flex-1 p-2 rounded bg-white/[0.06] text-[10px]" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.2 }}>
            <div className="font-semibold text-white mb-0.5">Buy</div>
            <div className="text-white/40">Fast deploy. Vendor risk.</div>
          </motion.div>
        </div>
        <motion.div className="flex items-center gap-1.5 text-[11px] font-semibold text-mint" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 1.8 }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          Build (with exit criteria)
        </motion.div>
        <motion.div className="flex gap-4 pt-2 border-t border-white/10" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.3 }}>
          <div>
            <div className="text-[9px] text-white/30">ROI</div>
            <div className="text-base font-bold text-mint">340%</div>
          </div>
          <div>
            <div className="text-[9px] text-white/30">Deploy</div>
            <div className="text-base font-bold text-mint">6 weeks</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FrameworkJourney;
