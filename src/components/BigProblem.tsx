import { motion, useInView } from "framer-motion";
import { useRef, useCallback } from "react";

const lines = [
  { text: "In ten years, every leader will fall into one of two categories.", weight: "font-light", gap: false },
  { text: "", weight: "", gap: true },
  { text: "Those who learned to orchestrate AI.", weight: "font-black", pw: "orchestrate", gap: false },
  { text: "And those who got orchestrated by it.", weight: "font-light", dim: true, gap: false },
  { text: "Those who trained AI to extend their thinking.", weight: "font-black", pw: "trained", gap: false },
  { text: "And those who let AI replace it.", weight: "font-light", dim: true, gap: false },
  { text: "Those who used it to accelerate.", weight: "font-black", pw: "accelerate", gap: false },
  { text: "And those who got flattened by those who did.", weight: "font-light", dim: true, gap: false },
  { text: "", weight: "", gap: true },
  { text: "This isn\u2019t a technology decision.", weight: "font-medium", gap: false },
  { text: "It\u2019s a leadership one.", weight: "font-black", mint: true, gap: false },
  { text: "The question isn\u2019t whether AI will reshape your business. It\u2019s whether you\u2019ll be the one holding the pen.", weight: "font-light", boldEnd: "It\u2019s whether you\u2019ll be the one holding the pen.", gap: false },
];

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

  const renderLine = (line: typeof lines[0], i: number, isMint: boolean) => {
    if (line.gap) return <div key={i} className="h-4 md:h-6" />;

    const base = "text-xl sm:text-2xl md:text-3xl font-display tracking-tight leading-snug text-left";

    let color: string;
    if (isMint) {
      color = "text-mint";
    } else if (line.mint) {
      color = "text-mint";
    } else if (line.dim) {
      color = "text-white/30";
    } else {
      color = "text-white/90";
    }

    let content: React.ReactNode = line.text;
    if (line.pw) {
      const parts = line.text.split(line.pw);
      content = <>{parts[0]}<span className="tracking-[0.06em]">{line.pw}</span>{parts[1]}</>;
    } else if (line.boldEnd) {
      const parts = line.text.split(line.boldEnd);
      content = <>{parts[0]}<span className="font-bold">{line.boldEnd}</span></>;
    }

    return (
      <motion.p
        key={i}
        className={`${base} ${line.weight} ${color}`}
        initial={{ opacity: 0, y: 12 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4, delay: i * 0.12, ease: "easeOut" }}
        style={
          !isMint && line.mint
            ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" }
            : undefined
        }
      >
        {content}
      </motion.p>
    );
  };

  return (
    <section ref={sectionRef} className="bg-ink pt-16 md:pt-24 pb-0">
      <div
        ref={contentRef}
        className="relative max-w-5xl mx-auto px-4 md:px-6"
        onMouseMove={handleMouseMove}
      >
        {/* Base text layer */}
        <div className="space-y-1">
          {lines.map((line, i) => renderLine(line, i, false))}
        </div>

        {/* Mint torchlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none px-4 md:px-6"
          style={{
            maskImage: "radial-gradient(circle 100px at var(--mx, -999px) var(--my, -999px), black 0%, transparent 70%)",
            WebkitMaskImage: "radial-gradient(circle 100px at var(--mx, -999px) var(--my, -999px), black 0%, transparent 70%)",
          }}
        >
          <div className="space-y-1">
            {lines.map((line, i) => renderLine(line, i, true))}
          </div>
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
