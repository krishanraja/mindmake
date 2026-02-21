import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from "framer-motion";
import { useRef, useState, useCallback } from "react";
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
    offset: ["start 0.65", "end start"],
  });

  const spotlight = useTransform(
    scrollYProgress,
    [0, 0.15, 0.25, 0.40, 0.55, 0.70, 0.85],
    [-1, -1, 0, 0, 1, 2, 2],
  );

  // Torchlight: mouse-following mint glow
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);
  const torchX = useSpring(rawX, { stiffness: 300, damping: 30 });
  const torchY = useSpring(rawY, { stiffness: 300, damping: 30 });
  const [torchVisible, setTorchVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    },
    [rawX, rawY],
  );

  const handleMouseEnter = useCallback(() => setTorchVisible(true), []);
  const handleMouseLeave = useCallback(() => setTorchVisible(false), []);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-ink relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Torchlight glow that follows cursor */}
      <motion.div
        className="absolute pointer-events-none z-10 rounded-full"
        style={{
          width: 420,
          height: 420,
          x: torchX,
          y: torchY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(126,244,194,0.10) 0%, rgba(126,244,194,0.04) 35%, transparent 70%)",
          opacity: torchVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <div className="container-width relative z-20">
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
  const [isHovered, setIsHovered] = useState(false);

  const cardOpacity = useTransform(spotlight, (v: number) => {
    const dist = Math.abs(v - index);
    return Math.max(0.2, 1 - dist * 0.8);
  });

  const glowOpacity = useTransform(spotlight, (v: number) => {
    const dist = Math.abs(v - index);
    return Math.max(0, 1 - dist * 2) * 0.35;
  });

  return (
    <motion.div
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex flex-col h-[420px] relative overflow-hidden transition-opacity duration-300"
      style={{ opacity: isHovered ? 1 : cardOpacity }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Natural radial glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          opacity: isHovered ? 0.35 : glowOpacity,
          background: "radial-gradient(ellipse at center, rgba(126, 244, 194, 0.15) 0%, transparent 70%)",
          boxShadow: "0 0 80px rgba(126, 244, 194, 0.08)",
        }}
      />

      <div className="text-center shrink-0 h-[72px] flex flex-col items-center justify-center">
        <Icon className="w-6 h-6 text-mint mb-1.5" />
        <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{headline}</h3>
        <p className="text-xs text-mint mt-0.5">{label}</p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden mt-4">{children}</div>
    </motion.div>
  );
};

const MindSetContent = () => {
  const doubled = [...noiseItems, ...noiseItems];

  return (
    <div className="h-full flex flex-col">
      {/* Scrolling list with fade masks */}
      <div className="flex-1 overflow-hidden relative mb-3">
        <div className="absolute inset-x-0 top-0 h-6 bg-gradient-to-b from-white/[0.04] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white/[0.04] to-transparent z-10 pointer-events-none" />
        <div
          className="space-y-1.5 pb-4"
          style={{
            animation: "mindset-scroll 18s linear infinite",
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-1 rounded text-[11px]"
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.keep ? "bg-mint" : "bg-red-400/50"}`} />
              <span className={!item.keep ? "line-through text-white/20" : "font-semibold text-white"}>
                {item.label}
              </span>
              {item.keep && <span className="ml-auto text-[9px] font-bold text-mint uppercase">Signal</span>}
            </div>
          ))}
        </div>
      </div>
      {/* Fixed footer */}
      <div className="h-[48px] shrink-0 flex items-center border-t border-white/10">
        <div>
          <span className="text-[10px] text-white/30">8 inputs &rarr; </span>
          <span className="text-xs font-bold text-mint">3 that matter</span>
        </div>
      </div>
    </div>
  );
};

const MindMapContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5, margin: "-15% 0px" });

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
      {/* Fixed footer */}
      <div className="h-[48px] shrink-0 flex items-center border-t border-white/10 mt-auto">
        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.2 }}>
          <span className="text-lg font-bold text-mint">5&ndash;10 hrs</span>
          <span className="text-xs text-white/40 ml-1">saved/week</span>
        </motion.div>
      </div>
    </div>
  );
};

const MindMakeContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5, margin: "-15% 0px" });

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
      </div>
      {/* Fixed footer */}
      <div className="h-[48px] shrink-0 flex items-center border-t border-white/10 mt-auto">
        <motion.div className="flex gap-6" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2.3 }}>
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
