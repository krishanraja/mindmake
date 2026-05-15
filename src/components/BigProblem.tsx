import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { useCallback, useRef } from "react";
import {
  ArrowDown,
  Brain,
  Compass,
  Crown,
  KeyRound,
  Rocket,
  Zap,
  type LucideIcon,
} from "lucide-react";

/* ─── Content ─────────────────────────────────────────────────────────────
   Each card holds two faces:
   - fate: what happens if you don't pick up the pen
   - value: what working with us looks like
   The same card frame morphs from face A to face B via a left→right wipe
   during the final act of the scroll narrative.
   ──────────────────────────────────────────────────────────────────────── */

type Face = { icon: LucideIcon; strong: string; sub: string };

const cards: { fate: Face; value: Face }[] = [
  {
    fate: { icon: Crown, strong: "Orchestrate AI.", sub: "Or report to it." },
    value: {
      icon: Rocket,
      strong: "Ships, not slides.",
      sub: "Working systems and decisions you can defend, built alongside you in real time.",
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
      sub: "A Mindmake roadmap and the working habits to run it. Yours for years.",
    },
  },
];

/* ─── A single card that morphs between its two faces via a clipPath wipe ── */

type MorphCardProps = {
  index: number;
  fate: Face;
  value: Face;
  scrollYProgress: MotionValue<number>;
};

const MorphCard = ({ index, fate, value, scrollYProgress }: MorphCardProps) => {
  // Stagger the wipe per card to create a cascading reveal across the row.
  const start = 0.66 + index * 0.03;
  const end = start + 0.12;

  const wipe = useTransform(scrollYProgress, [start, end], [0, 1]);
  const fateClip = useTransform(wipe, (p) => `inset(0 0 0 ${p * 100}%)`);
  const valueClip = useTransform(wipe, (p) => `inset(0 ${(1 - p) * 100}% 0 0)`);

  const FateIcon = fate.icon;
  const ValueIcon = value.icon;

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] backdrop-blur-sm h-[78px] sm:h-[92px] md:h-[200px]">
      {/* Fate face: visible in Act 1, wiped away in Act 3 */}
      <motion.div
        style={{ clipPath: fateClip, WebkitClipPath: fateClip as unknown as string }}
        className="absolute inset-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 p-4 md:p-6"
      >
        <FateIcon className="w-6 h-6 md:w-7 md:h-7 md:mb-3 text-white/60 shrink-0" />
        <div className="min-w-0">
          <p className="text-base md:text-xl font-bold text-white leading-tight">{fate.strong}</p>
          <p className="text-xs md:text-sm text-white/60 leading-snug mt-0.5">{fate.sub}</p>
        </div>
      </motion.div>

      {/* Value face: wiped in during Act 3 */}
      <motion.div
        style={{ clipPath: valueClip, WebkitClipPath: valueClip as unknown as string }}
        className="absolute inset-0 flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0 p-4 md:p-6"
      >
        <ValueIcon className="w-6 h-6 md:w-7 md:h-7 md:mb-3 text-mint shrink-0" />
        <div className="min-w-0">
          <p className="text-base md:text-xl font-bold text-white leading-tight">{value.strong}</p>
          <p className="text-xs md:text-sm text-white/70 leading-snug mt-0.5">{value.sub}</p>
        </div>
      </motion.div>
    </div>
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
          The question isn&rsquo;t whether AI will reshape your business. It&rsquo;s whether you&rsquo;ll be the one
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

/* ─── Main: pinned, scroll-driven three-act narrative ────────────────────── */

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  /* Eyebrow: persists across the section */
  const eyebrowOpacity = useTransform(scrollYProgress, [0, 0.04, 0.92, 1], [0, 1, 1, 0.55]);

  /* Headlines: three states crossfade in the same vertical slot */
  // Act 1
  const h1Opacity = useTransform(scrollYProgress, [0, 0.04, 0.28, 0.36], [0, 1, 1, 0]);
  const h1Y = useTransform(scrollYProgress, [0, 0.04, 0.36], [40, 0, -28]);

  // Act 2: the pivot
  const h2Opacity = useTransform(scrollYProgress, [0.30, 0.40, 0.56, 0.64], [0, 1, 1, 0]);
  const h2Y = useTransform(scrollYProgress, [0.30, 0.40, 0.64], [40, 0, -28]);
  // Marker-stroke highlight that draws left to right behind "leadership one"
  const leadHighlight = useTransform(scrollYProgress, [0.43, 0.55], ["0%", "100%"]);

  // Act 3: the answer
  const h3Opacity = useTransform(scrollYProgress, [0.58, 0.66, 1], [0, 1, 1]);
  const h3Y = useTransform(scrollYProgress, [0.58, 0.66], [40, 0]);

  /* Card grid: present from Act 1, recedes during the typography pivot, returns for Act 3 */
  const cardsOpacity = useTransform(
    scrollYProgress,
    [0, 0.10, 0.30, 0.42, 0.58, 0.66, 1],
    [0, 1, 1, 0.22, 0.22, 1, 1],
  );
  const cardsY = useTransform(
    scrollYProgress,
    [0, 0.10, 0.30, 0.42, 0.58, 0.66],
    [40, 0, 0, 14, 14, 0],
  );
  const cardsScale = useTransform(
    scrollYProgress,
    [0.30, 0.42, 0.58, 0.66],
    [1, 0.95, 0.95, 1],
  );

  /* Mint hairline beam at the wipe edge, visible only during the morph */
  const beamX = useTransform(scrollYProgress, [0.66, 0.84], ["-2%", "102%"]);
  const beamOpacity = useTransform(scrollYProgress, [0.64, 0.68, 0.82, 0.86], [0, 1, 1, 0]);

  /* CTA fades in once the wipe completes */
  const ctaOpacity = useTransform(scrollYProgress, [0.86, 0.95], [0, 1]);
  const ctaY = useTransform(scrollYProgress, [0.86, 0.95], [16, 0]);

  /* Ambient mint glow breathes with scroll */
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.18, 0.38, 0.22]);
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.25]);

  /* Progress bar: fine left rail signalling how far through the narrative the reader is */
  const progressScaleY = scrollYProgress;

  const scrollToFramework = useCallback(() => {
    document.getElementById("framework-journey")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  if (prefersReducedMotion) {
    return <StaticFallback onCTA={scrollToFramework} />;
  }

  return (
    <section
      ref={sectionRef}
      id="big-problem"
      className="relative bg-ink h-[220vh] sm:h-[240vh] md:h-[280vh]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
        {/* Ambient mint glow */}
        <motion.div
          style={{ opacity: glowOpacity, scale: glowScale }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[120vw] max-w-[1200px] max-h-[1200px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, hsl(158 82% 73% / 0.22) 0%, hsl(158 82% 73% / 0.05) 35%, transparent 65%)",
            }}
          />
        </motion.div>

        {/* Vertical progress rail, left side, desktop only */}
        <div className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 hidden md:flex flex-col items-center gap-3 z-20">
          <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-mint/60 [writing-mode:vertical-rl] rotate-180">
            01 / 03
          </div>
          <div className="relative h-32 w-px bg-white/10 overflow-hidden">
            <motion.div
              style={{ scaleY: progressScaleY, transformOrigin: "top" }}
              className="absolute inset-0 bg-mint"
            />
          </div>
        </div>

        <div className="container-width max-w-5xl relative z-10 w-full">
          {/* Eyebrow */}
          <motion.div
            style={{ opacity: eyebrowOpacity }}
            className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-mint mb-5 sm:mb-7"
          >
            Ten years from now
          </motion.div>

          {/* Headline slot: three acts crossfade in the same space */}
          <div className="relative min-h-[28vh] sm:min-h-[26vh] md:min-h-[24vh] lg:min-h-[22vh]">
            {/* Act 1 */}
            <motion.h2
              style={{ opacity: h1Opacity, y: h1Y }}
              className="absolute inset-0 text-[clamp(1.875rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-white"
            >
              Every leader will fall into one of{" "}
              <span className="text-mint">two categories.</span>
            </motion.h2>

            {/* Act 2: pivot with marker-stroke highlight */}
            <motion.h2
              style={{ opacity: h2Opacity, y: h2Y }}
              className="absolute inset-0 text-[clamp(1.375rem,3.8vw,3rem)] font-bold leading-[1.18] tracking-tight text-white"
            >
              This isn&rsquo;t a technology decision.{" "}
              <span className="relative inline-block">
                <motion.span
                  aria-hidden
                  style={{ width: leadHighlight }}
                  className="absolute inset-y-[0.1em] left-0 bg-mint/20 rounded-sm pointer-events-none"
                />
                <span className="relative text-mint">It&rsquo;s a leadership one.</span>
              </span>{" "}
              <span className="font-medium text-white/65">
                The question isn&rsquo;t whether AI will reshape your business. It&rsquo;s whether
                you&rsquo;ll be the one holding the pen.
              </span>
            </motion.h2>

            {/* Act 3 */}
            <motion.h2
              style={{ opacity: h3Opacity, y: h3Y }}
              className="absolute inset-0 text-[clamp(1.875rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-white"
            >
              Here&rsquo;s how you{" "}
              <span className="text-mint">pick up the pen.</span>
            </motion.h2>
          </div>

          {/* Card grid */}
          <motion.div
            style={{ opacity: cardsOpacity, y: cardsY, scale: cardsScale }}
            className="relative grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mt-8 md:mt-12"
          >
            {/* Mint hairline beam: sweeps across the row during the Act 3 wipe */}
            <motion.div
              aria-hidden
              style={{
                left: beamX,
                opacity: beamOpacity,
                background:
                  "linear-gradient(to bottom, transparent 0%, hsl(158 82% 73%) 50%, transparent 100%)",
                boxShadow: "0 0 14px hsl(158 82% 73% / 0.7), 0 0 4px hsl(158 82% 73% / 0.9)",
              }}
              className="absolute -top-3 -bottom-3 w-px z-30 pointer-events-none hidden md:block"
            />

            {cards.map((card, i) => (
              <MorphCard
                key={i}
                index={i}
                fate={card.fate}
                value={card.value}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </motion.div>

          {/* CTA */}
          <motion.div
            style={{ opacity: ctaOpacity, y: ctaY }}
            className="flex justify-center mt-8 md:mt-12"
          >
            <button
              onClick={scrollToFramework}
              className="group inline-flex items-center gap-3 px-6 sm:px-7 py-3 sm:py-3.5 rounded-full border border-mint/40 hover:border-mint bg-ink/40 backdrop-blur-sm text-white font-semibold text-sm sm:text-base transition-colors"
            >
              See how I work
              <ArrowDown className="w-4 h-4 text-mint group-hover:translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* Section break: sits at the bottom of the tall section, visible as it releases */}
      <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4 px-8">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
        <div className="w-1.5 h-1.5 rounded-full bg-mint/40" />
        <div className="flex-1 h-px bg-gradient-to-r from-transparent via-mint/30 to-transparent" />
      </div>
    </section>
  );
};

export default BigProblem;
