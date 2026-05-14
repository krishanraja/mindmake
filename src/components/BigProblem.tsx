import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import {
  ArrowDown,
  Brain,
  Compass,
  Crown,
  KeyRound,
  Rocket,
  RotateCw,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

/* ─── Content ─────────────────────────────────────────────────────────────
   Each card holds two faces:
   - fate: what happens if you don't pick up the pen
   - value: what working with us looks like
   The same card frame flips from face A to face B — picking up the pen.
   ──────────────────────────────────────────────────────────────────────── */

type Face = { icon: LucideIcon; strong: string; sub: string };

const cards: { fate: Face; value: Face }[] = [
  {
    fate: { icon: Crown, strong: "Orchestrate AI.", sub: "Or report to it." },
    value: {
      icon: Rocket,
      strong: "Ships, not slides.",
      sub: "Working systems and defensible decisions — built alongside you in real time.",
    },
  },
  {
    fate: { icon: Brain, strong: "Extend your thinking.", sub: "Or become a commodity." },
    value: {
      icon: Compass,
      strong: "You lead, not watch.",
      sub: "Hands-on fluency in your actual workflows. Not a training course.",
    },
  },
  {
    fate: { icon: Zap, strong: "Accelerate.", sub: "Or get passed by." },
    value: {
      icon: KeyRound,
      strong: "Yours to keep.",
      sub: "A Mindmake roadmap and operating rhythms you'll carry for years.",
    },
  },
];

/* ─── A single card that flips between its two faces in 3D ──────────────── */

type FlipCardProps = {
  fate: Face;
  value: Face;
  isMobile: boolean;
};

const FlipCard = ({ fate, value, isMobile }: FlipCardProps) => {
  const [flipped, setFlipped] = useState(false);

  const FateIcon = fate.icon;
  const ValueIcon = value.icon;

  // Desktop reveals on hover; mobile + keyboard toggle on activation.
  const hoverProps = isMobile
    ? {}
    : { onHoverStart: () => setFlipped(true), onHoverEnd: () => setFlipped(false) };

  const faceClass =
    "absolute inset-0 flex flex-col items-start p-5 md:p-6 rounded-xl border [backface-visibility:hidden]";

  return (
    <motion.button
      type="button"
      aria-pressed={flipped}
      aria-label={`${fate.strong} ${fate.sub} — flip to reveal: ${value.strong}`}
      onClick={() => setFlipped((f) => !f)}
      {...hoverProps}
      className="relative w-full min-h-[180px] md:min-h-[210px] text-left rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
      style={{ perspective: 1000 }}
    >
      <motion.div
        className="relative h-full w-full min-h-[180px] md:min-h-[210px]"
        style={{ transformStyle: "preserve-3d" }}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      >
        {/* Fate face — front */}
        <div className={`${faceClass} border-white/10 bg-white/[0.03]`}>
          <FateIcon className="w-7 h-7 mb-3 text-white/60 shrink-0" />
          <p className="text-lg md:text-xl font-bold text-white leading-tight">{fate.strong}</p>
          <p className="text-sm text-white/60 leading-snug mt-1">{fate.sub}</p>
          <span className="mt-auto pt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-mint/70">
            <RotateCw className="w-3 h-3" />
            {isMobile ? "Tap" : "Hover"}
          </span>
        </div>

        {/* Value face — back, pre-rotated */}
        <div
          className={`${faceClass} border-mint/30 bg-mint/[0.04]`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <ValueIcon className="w-7 h-7 mb-3 text-mint shrink-0" />
          <p className="text-lg md:text-xl font-bold text-white leading-tight">{value.strong}</p>
          <p className="text-sm text-white/70 leading-snug mt-1">{value.sub}</p>
        </div>
      </motion.div>
    </motion.button>
  );
};

/* ─── Reduced-motion fallback: stacked, static, accessible ───────────────── */

const StaticFallback = ({ onCTA }: { onCTA: () => void }) => (
  <section id="big-problem" className="bg-ink py-20 md:py-28">
    <div className="container-width max-w-5xl">
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint mb-6">
        Ten years from now
      </div>

      <h2 className="text-3xl md:text-5xl font-bold leading-[1.05] text-white mb-12 tracking-tight">
        Every leader will fall into one of <span className="text-mint">two categories.</span>
      </h2>

      <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-14">
        {cards.map(({ fate }, i) => {
          const Icon = fate.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-5 md:p-6 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0"
            >
              <Icon className="w-7 h-7 md:mb-3 text-white/60 shrink-0" />
              <div>
                <p className="text-lg md:text-xl font-bold text-white">{fate.strong}</p>
                <p className="text-sm text-white/60 mt-0.5">{fate.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <p className="text-xl md:text-3xl font-bold text-white leading-snug tracking-tight mb-14 max-w-4xl">
        This isn&rsquo;t a technology decision. <span className="text-mint">It&rsquo;s a leadership one.</span>{" "}
        <span className="font-medium text-white/75">
          The question isn&rsquo;t whether AI will reshape your business — it&rsquo;s whether you&rsquo;ll be the one
          holding the pen.
        </span>
      </p>

      <h3 className="text-3xl md:text-5xl font-bold text-white mb-10 tracking-tight">
        Here&rsquo;s how you <span className="text-mint">pick up the pen.</span>
      </h3>

      <div className="grid md:grid-cols-3 gap-3 md:gap-4 mb-14">
        {cards.map(({ value }, i) => {
          const Icon = value.icon;
          return (
            <div
              key={i}
              className="rounded-xl border border-mint/30 bg-mint/[0.03] p-5 md:p-6 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0"
            >
              <Icon className="w-7 h-7 md:mb-3 text-mint shrink-0" />
              <div>
                <p className="text-lg md:text-xl font-bold text-white">{value.strong}</p>
                <p className="text-sm text-white/70 mt-0.5 leading-relaxed">{value.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={onCTA}
        className="group inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-mint/40 hover:border-mint text-white font-semibold transition-colors"
      >
        See how I work
        <ArrowDown className="w-4 h-4 text-mint group-hover:translate-y-0.5 transition-transform" />
      </button>
    </div>

    <div className="mt-20 flex items-center justify-center gap-4 px-8">
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
      <div className="w-1.5 h-1.5 rounded-full bg-mint/40" />
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
    </div>
  </section>
);

/* ─── Main: static-flow section with flippable two-faced cards ───────────── */

const BigProblem = () => {
  const prefersReducedMotion = useReducedMotion();
  const isMobile = useIsMobile();

  const scrollToFramework = useCallback(() => {
    document.getElementById("framework-journey")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (prefersReducedMotion) {
    return <StaticFallback onCTA={scrollToFramework} />;
  }

  return (
    <section id="big-problem" className="relative bg-ink py-20 md:py-28 overflow-hidden">
      {/* Ambient mint glow */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1100px] max-h-[1100px] rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(158 82% 73% / 0.16) 0%, hsl(158 82% 73% / 0.04) 35%, transparent 65%)",
          }}
        />
      </div>

      <div className="container-width max-w-5xl relative z-10">
        {/* Eyebrow */}
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-mint mb-5 sm:mb-7">
          Ten years from now
        </div>

        {/* Headline */}
        <h2 className="text-[clamp(1.875rem,5vw,3.75rem)] font-bold leading-[1.05] tracking-tight text-white mb-8 md:mb-10">
          Every leader will fall into one of <span className="text-mint">two categories.</span>
        </h2>

        {/* Pivot paragraph */}
        <p className="text-lg md:text-2xl font-bold text-white leading-snug tracking-tight mb-10 md:mb-14 max-w-4xl">
          This isn&rsquo;t a technology decision. <span className="text-mint">It&rsquo;s a leadership one.</span>{" "}
          <span className="font-medium text-white/70">
            The question isn&rsquo;t whether AI will reshape your business — it&rsquo;s whether you&rsquo;ll be
            the one holding the pen.
          </span>
        </p>

        {/* Answer headline + flip affordance */}
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-6 md:mb-8">
          <h3 className="text-2xl md:text-4xl font-bold text-white tracking-tight">
            Here&rsquo;s how you <span className="text-mint">pick up the pen.</span>
          </h3>
          <span className="text-xs md:text-sm text-white/45">
            {isMobile ? "Tap each card" : "Hover each card"}
          </span>
        </div>

        {/* Flip card grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
          {cards.map((card, i) => (
            <FlipCard key={i} fate={card.fate} value={card.value} isMobile={isMobile} />
          ))}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-10 md:mt-14">
          <button
            onClick={scrollToFramework}
            className="group inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border border-mint/40 hover:border-mint bg-ink/40 backdrop-blur-sm text-white font-semibold text-sm sm:text-base transition-colors"
          >
            See how I work
            <ArrowDown className="w-4 h-4 text-mint group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* Section break */}
      <div className="mt-16 md:mt-24 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-mint/40" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
      </div>
    </section>
  );
};

export default BigProblem;
