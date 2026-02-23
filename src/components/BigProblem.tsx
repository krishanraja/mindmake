import { motion, useInView } from "framer-motion";
import { useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const revealInView = useInView(revealRef, { once: true, amount: 0.3 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const base = "text-lg sm:text-xl md:text-2xl font-display tracking-tight leading-relaxed text-left";

  const fade = (delay: number, alwaysVisible?: boolean) => ({
    initial: alwaysVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : alwaysVisible ? undefined : { opacity: 0, y: 16 },
    transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  } as const);

  const revealFade = (delay: number) => ({
    initial: { opacity: 0, y: 16 } as const,
    animate: revealInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  } as const);

  /* Shared glow keyframes — reused on "mindset one", "walk the walk", "walk the talk" */
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

      {/* ─── ACT 1: The Provocation (existing, unchanged) ─── */}

      {/* Paragraph 1 */}
      <motion.p
        className={`${base} font-light ${isMint ? "text-mint" : "text-white/80"}`}
        {...fade(0, true)}
      >
        In ten years, every leader will fall into one of two categories.
      </motion.p>

      {/* Paragraph 2 — continuous flowing text */}
      <motion.p
        className={`${base} ${isMint ? "text-mint" : "text-white/90"}`}
        {...fade(0.1)}
      >
        <span className={`font-black ${isMint ? "" : "text-white"}`}>
          Those who learned to <span className="tracking-[0.06em]">orchestrate</span> AI.
        </span>{" "}
        <span className={`font-light ${isMint ? "" : "text-white/30"}`}>
          And those who got orchestrated by it.
        </span>{" "}
        <span className={`font-black ${isMint ? "" : "text-white"}`}>
          Those who <span className="tracking-[0.06em]">trained</span> AI to extend their thinking.
        </span>{" "}
        <span className={`font-light ${isMint ? "" : "text-white/30"}`}>
          And those who let AI replace it.
        </span>{" "}
        <span className={`font-black ${isMint ? "" : "text-white"}`}>
          Those who used it to <span className="tracking-[0.06em]">accelerate</span>.
        </span>{" "}
        <span className={`font-light ${isMint ? "" : "text-white/30"}`}>
          And those who got flattened by those who did.
        </span>
      </motion.p>

      {/* Paragraph 3 — continuous flowing text */}
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

      {/* ─── BRIDGE: Breathing scroll cue ─── */}

      <div
        ref={!isMint ? revealRef : undefined}
        className="flex flex-col items-center py-10 md:py-14"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [0.3, 0.7, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-1"
          >
            <ChevronDown className={`w-5 h-5 ${isMint ? "text-mint" : "text-mint/40"}`} />
            <ChevronDown className={`w-5 h-5 -mt-3 ${isMint ? "text-mint/70" : "text-mint/25"}`} />
          </motion.div>
        </motion.div>
      </div>

      {/* ─── ACT 2: The Reveal — "Walk the Walk" ─── */}

      {/* Title — blur-to-focus "lens crystallizing" effect */}
      <motion.h3
        className={`text-3xl sm:text-4xl md:text-5xl font-black leading-tight ${
          isMint ? "text-mint" : "text-white"
        }`}
        initial={{ opacity: 0, filter: "blur(12px)", scale: 1.08, y: 30 }}
        animate={
          revealInView
            ? { opacity: 1, filter: "blur(0px)", scale: 1, y: 0 }
            : {}
        }
        transition={{ duration: 1.0, ease: [0.25, 0.1, 0.25, 1] }}
      >
        Does your consultant actually{" "}
        <motion.span
          className="text-mint"
          animate={revealInView ? glowAnimation : undefined}
          transition={glowTransition}
          style={!isMint ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" } : undefined}
        >
          walk the walk
        </motion.span>
        ?
      </motion.h3>

      {/* Body paragraph 1 */}
      <motion.p
        className={`${base} ${isMint ? "text-mint" : "text-white/90"}`}
        {...revealFade(0.4)}
      >
        <span className="font-medium">
          Mindmaker helps leaders lead from the front on AI transformation with a hands-on fluency sprint.
        </span>{" "}
        <span className="font-light">
          The days of delegating all things AI to the tech guys are over &mdash; it&rsquo;s time to{" "}
        </span>
        <motion.span
          className={`font-black ${isMint ? "text-mint" : "text-mint"}`}
          animate={revealInView ? glowAnimation : undefined}
          transition={{ ...glowTransition, delay: 0.5 }}
          style={!isMint ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" } : undefined}
        >
          walk the talk
        </motion.span>{" "}
        <span className="font-light">
          if you want to own the next decade.
        </span>
      </motion.p>

      {/* Body paragraph 2 */}
      <motion.p
        className={`${base} ${isMint ? "text-mint" : "text-white/90"}`}
        {...revealFade(0.7)}
      >
        <span className="font-medium">
          We don&rsquo;t hand you a strategy deck.
        </span>{" "}
        <span className="font-light">
          We get you working with the tools on your terms, within your limits &mdash; and then we guide your personal output{" "}
        </span>
        <span className={`font-black tracking-wide ${isMint ? "" : "text-mint"}`}>
          Mindmake
        </span>{" "}
        <span className="font-light">
          roadmap mapped back from what you want to accomplish, with new ways of operating that you&rsquo;ll take with you for years.
        </span>
      </motion.p>
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
