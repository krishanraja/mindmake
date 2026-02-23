import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef, useCallback, useState } from "react";
import { ArrowRight, Crown, Brain, Zap, Rocket, Compass, KeyRound } from "lucide-react";

/* ─── Card data ─── */

const categories = [
  { icon: Crown, strong: "Orchestrate AI.", contrast: "...or get orchestrated by it.", delay: 0.15 },
  { icon: Brain, strong: "Extend your thinking.", contrast: "...or let AI replace it.", delay: 0.25 },
  { icon: Zap, strong: "Accelerate.", contrast: "...or get flattened by those who did.", delay: 0.35 },
];

const valueProps = [
  { icon: Rocket, headline: "Ships, not slides.", body: "No strategy decks. Working systems and defensible decisions, built alongside you in real time.", delay: 0 },
  { icon: Compass, headline: "You lead, not watch.", body: "Hands-on fluency sprint. You build with AI in your actual workflows \u2014 not a training course.", delay: 0.1 },
  { icon: KeyRound, headline: "Yours to keep.", body: "A personal Mindmake roadmap and new operating rhythms you\u2019ll carry for years.", delay: 0.2 },
];

/* ─── Component ─── */

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [isRevealed, setIsRevealed] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const base = "text-lg sm:text-xl md:text-2xl font-display tracking-tight leading-relaxed text-left";
  const ease = [0.25, 0.1, 0.25, 1] as const;

  const fade = (delay: number, alwaysVisible?: boolean) => ({
    initial: alwaysVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : alwaysVisible ? undefined : { opacity: 0, y: 16 },
    transition: { duration: 0.5, delay, ease },
  } as const);

  /* Shared glow keyframes — reused on "mindset one" + revealed heading */
  const glowAnimation = {
    textShadow: [
      "0 0 60px hsl(158 82% 73% / 0.3)",
      "0 0 90px hsl(158 82% 73% / 0.55), 0 0 30px hsl(158 82% 73% / 0.3)",
      "0 0 30px hsl(158 82% 73% / 0.1)",
      "0 0 120px hsl(158 82% 73% / 0.8), 0 0 50px hsl(158 82% 73% / 0.5), 0 0 10px hsl(158 82% 73% / 0.4)",
      "0 0 60px hsl(158 82% 73% / 0.3)",
    ],
    opacity: [1, 1, 0.7, 1, 1],
  };

  const glowTransition = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
    times: [0, 0.25, 0.45, 0.7, 1],
  };

  const content = (isMint: boolean) => (
    <div className="space-y-8 md:space-y-10">

      {/* ─── Opening Line ─── */}
      <motion.p
        className={`${base} font-light ${isMint ? "text-mint" : "text-white/80"}`}
        {...fade(0, true)}
      >
        In ten years, every leader will fall into one of two categories.
      </motion.p>

      {/* ─── Leader Category Cards ─── */}
      <div className="grid md:grid-cols-3 gap-4">
        {categories.map((cat, i) => {
          const Icon = cat.icon;
          return (
            <motion.div
              key={i}
              className={`rounded-xl border p-5 md:p-6 transition-all ease-out
                ${isMint
                  ? "border-mint/20 bg-mint/[0.03]"
                  : "border-white/10 bg-white/[0.03] hover:border-mint/40 hover:bg-white/[0.07] group"
                }`}
              style={{ transitionDuration: "120ms" }}
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.3, delay: cat.delay, ease }}
            >
              <Icon className={`w-7 h-7 mb-3 transition-colors ${isMint ? "text-mint" : "text-white/50 group-hover:text-mint"}`} />
              <p className={`text-lg font-bold mb-1 ${isMint ? "text-mint" : "text-white"}`}>{cat.strong}</p>
              <p className={`text-sm font-light ${isMint ? "text-mint/40" : "text-white/25"}`}>{cat.contrast}</p>
            </motion.div>
          );
        })}
      </div>

      {/* ─── Bridge: "It's a mindset one." ─── */}
      <motion.p
        className={`${base} ${isMint ? "text-mint" : "text-white/90"}`}
        {...fade(0.5)}
      >
        <span className="font-medium">This isn&rsquo;t a technology decision.</span>{" "}
        <motion.span
          className={`font-black ${isMint ? "text-mint" : "text-mint"}`}
          animate={isInView ? glowAnimation : undefined}
          transition={glowTransition}
          style={!isMint ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" } : undefined}
        >
          It&rsquo;s a mindset one.
        </motion.span>{" "}
        <span className="font-light">
          The question isn&rsquo;t whether AI will reshape your business.
        </span>{" "}
        <span className="font-bold">
          It&rsquo;s whether you&rsquo;ll be the one holding the pen.
        </span>
      </motion.p>

      {/* ─── Button → Click → Value Prop Cards ─── */}
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="reveal-cta"
            className="flex justify-center py-8 md:py-10"
            initial={{ opacity: 0, y: 12 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
            transition={{ duration: 0.25, delay: 0.4, ease }}
          >
            <button
              onClick={() => setIsRevealed(true)}
              className={`group relative px-8 py-4 rounded-full border
                         font-semibold text-lg cursor-pointer transition-colors
                         ${isMint
                           ? "border-mint/50 text-mint"
                           : "border-mint/30 text-white hover:border-mint/60 glow-pulse"
                         }`}
            >
              <span className="flex items-center gap-3">
                Here&rsquo;s how you pick up the pen
                <ArrowRight className="w-5 h-5 text-mint group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="revealed-content"
            className="pt-4 md:pt-6 space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            {/* Heading — fast fade, not the old 1s blur-to-focus */}
            <motion.h3
              className={`text-2xl md:text-3xl font-bold leading-snug ${isMint ? "text-mint" : "text-white"}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              Work with someone who actually{" "}
              <motion.span
                className="text-mint"
                animate={glowAnimation}
                transition={glowTransition}
                style={!isMint ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" } : undefined}
              >
                ships your results
              </motion.span>.
            </motion.h3>

            {/* Value prop cards — clipPath wipe from bottom */}
            <div className="grid md:grid-cols-3 gap-4">
              {valueProps.map((prop, i) => {
                const Icon = prop.icon;
                return (
                  <motion.div
                    key={i}
                    className={`rounded-xl border p-5 md:p-6 transition-all ease-out
                      ${isMint
                        ? "border-mint/20 bg-mint/[0.03]"
                        : "border-white/10 bg-white/[0.03] hover:border-mint/40 hover:bg-white/[0.07] group"
                      }`}
                    style={{ transitionDuration: "120ms" }}
                    initial={{ clipPath: "inset(100% 0 0 0)", opacity: 0 }}
                    animate={{ clipPath: "inset(0% 0 0 0)", opacity: 1 }}
                    transition={{ duration: 0.25, delay: prop.delay, ease }}
                  >
                    <Icon className={`w-7 h-7 mb-3 transition-colors ${isMint ? "text-mint" : "text-white/50 group-hover:text-mint"}`} />
                    <p className={`text-lg font-bold mb-1 ${isMint ? "text-mint" : "text-white"}`}>{prop.headline}</p>
                    <p className={`text-sm font-light leading-relaxed ${isMint ? "text-mint/60" : "text-white/60"}`}>{prop.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-ink pt-16 md:pt-24 pb-0">
      <div
        ref={contentRef}
        className="relative container-width"
        onMouseMove={handleMouseMove}
      >
        {/* Base text layer */}
        {content(false)}

        {/* Mint torchlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none px-4 sm:px-6 lg:px-8"
          style={{
            maskImage: "radial-gradient(circle 100px at var(--mx, -999px) var(--my, -999px), black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle 100px at var(--mx, -999px) var(--my, -999px), black 0%, transparent 70%)",
          }}
        >
          {content(true)}
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
