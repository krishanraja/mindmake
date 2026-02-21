import { motion, useInView } from "framer-motion";
import { useRef, useCallback } from "react";

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  const base = "text-xl sm:text-2xl md:text-3xl font-display tracking-tight leading-relaxed text-left";
  const fade = (delay: number, alwaysVisible?: boolean) => ({
    initial: alwaysVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    animate: isInView ? { opacity: 1, y: 0 } : alwaysVisible ? undefined : { opacity: 0, y: 16 },
    transition: { duration: 0.9, delay, ease: [0.25, 0.1, 0.25, 1] as const },
  } as const);

  const content = (isMint: boolean) => (
    <div className="space-y-8 md:space-y-10">
      {/* Paragraph 1 */}
      <motion.p
        className={`${base} font-light ${isMint ? "text-mint" : "text-white/80"}`}
        {...fade(0, true)}
      >
        In ten years, every leader will fall into one of two categories.
      </motion.p>

      {/* Paragraph 2 -- continuous flowing text */}
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

      {/* Paragraph 3 -- continuous flowing text */}
      <motion.p
        className={`${base} ${isMint ? "text-mint" : "text-white/90"}`}
        {...fade(0.5)}
      >
        <span className="font-medium">This isn&rsquo;t a technology decision.</span>{" "}
        <span
          className={`font-black ${isMint ? "text-mint" : "text-mint"}`}
          style={!isMint ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" } : undefined}
        >
          It&rsquo;s a leadership one.
        </span>{" "}
        <span className="font-light">
          The question isn&rsquo;t whether AI will reshape your business.
        </span>{" "}
        <span className="font-bold">
          It&rsquo;s whether you&rsquo;ll be the one holding the pen.
        </span>
      </motion.p>
    </div>
  );

  return (
    <section ref={sectionRef} className="bg-ink pt-16 md:pt-24 pb-0">
      <div
        ref={contentRef}
        className="relative max-w-6xl mx-auto px-4"
        onMouseMove={handleMouseMove}
      >
        {/* Base text layer */}
        {content(false)}

        {/* Mint torchlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none px-4"
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
