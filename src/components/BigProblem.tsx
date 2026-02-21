import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.3 });
  const [litIndex, setLitIndex] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    let i = -1;
    const interval = setInterval(() => {
      i++;
      if (i > 2) { clearInterval(interval); return; }
      setLitIndex(i);
    }, 600);
    return () => clearInterval(interval);
  }, [isInView]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = contentRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  }, []);

  return (
    <section ref={sectionRef} className="bg-ink py-16 md:py-24">
      <div
        ref={contentRef}
        className="relative max-w-3xl mx-auto px-6 md:px-8"
        onMouseMove={handleMouseMove}
      >
        {/* Base text layer */}
        <Paragraphs litIndex={litIndex} mint={false} />

        {/* Mint torchlight overlay -- identical structure */}
        <div
          className="absolute inset-0 pointer-events-none px-6 md:px-8"
          style={{
            maskImage: "radial-gradient(circle 100px at var(--mx, -999px) var(--my, -999px), black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle 100px at var(--mx, -999px) var(--my, -999px), black 0%, transparent 70%)",
          }}
        >
          <Paragraphs litIndex={litIndex} mint={true} />
        </div>
      </div>
    </section>
  );
};

const Paragraphs = ({ litIndex, mint }: { litIndex: number; mint: boolean }) => {
  const base = "text-xl sm:text-2xl md:text-3xl font-display tracking-tight leading-relaxed text-left";
  const dimColor = mint ? "text-mint" : "text-white/[0.06]";
  const litColor = mint ? "text-mint" : "text-white/90";
  const currentColor = mint ? "text-mint" : "text-white";
  const fadedLit = mint ? "text-mint" : "text-white/50";

  const p0 = litIndex >= 0 ? (litIndex === 0 ? currentColor : fadedLit) : dimColor;
  const p1 = litIndex >= 1 ? (litIndex === 1 ? currentColor : fadedLit) : dimColor;
  const p2 = litIndex >= 2 ? (litIndex === 2 ? currentColor : fadedLit) : dimColor;

  return (
    <div className="space-y-8 md:space-y-10">
      {/* Paragraph 1: Opening */}
      <p className={`${base} font-light transition-all duration-700 ${p0}`}>
        In ten years, every leader will fall into one of two categories.
      </p>

      {/* Paragraph 2: The three contrasts */}
      <div className={`space-y-1 transition-all duration-700 ${p1}`}>
        <p className={`${base} font-black`}>
          Those who learned to <span className="tracking-[0.06em]">orchestrate</span> AI.
        </p>
        <p className={`${base} font-light ${mint ? "text-mint" : litIndex >= 1 ? "text-white/30" : dimColor}`}>
          And those who got orchestrated by it.
        </p>
        <p className={`${base} font-black`}>
          Those who <span className="tracking-[0.06em]">trained</span> AI to extend their thinking.
        </p>
        <p className={`${base} font-light ${mint ? "text-mint" : litIndex >= 1 ? "text-white/30" : dimColor}`}>
          And those who let AI replace it.
        </p>
        <p className={`${base} font-black`}>
          Those who used it to <span className="tracking-[0.06em]">accelerate</span>.
        </p>
        <p className={`${base} font-light ${mint ? "text-mint" : litIndex >= 1 ? "text-white/30" : dimColor}`}>
          And those who got flattened by those who did.
        </p>
      </div>

      {/* Paragraph 3: The closer */}
      <div className={`transition-all duration-700 ${p2}`}>
        <p className={`${base} font-medium`}>
          This isn&rsquo;t a technology decision.
        </p>
        <p
          className={`${base} font-black mt-1 ${mint ? "text-mint" : litIndex >= 2 ? "text-mint" : dimColor}`}
          style={
            !mint && litIndex >= 2
              ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" }
              : undefined
          }
        >
          It&rsquo;s a leadership one.
        </p>
        <p className={`${base} font-light mt-4`}>
          The question isn&rsquo;t whether AI will reshape your business.{" "}
          <span className="font-bold">It&rsquo;s whether you&rsquo;ll be the one holding the pen.</span>
        </p>
      </div>
    </div>
  );
};

export default BigProblem;
