import { useInView } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";

const SIZE = "text-xl sm:text-2xl md:text-3xl font-display tracking-tight leading-snug";

const linesData = [
  { text: "In ten years, every leader will fall into one of two categories.", weight: "font-light", dim: false, mint: false },
  { text: "Those who learned to orchestrate AI.", weight: "font-black", dim: false, mint: false, pw: "orchestrate" },
  { text: "And those who got orchestrated by it.", weight: "font-light", dim: true, mint: false },
  { text: "Those who trained AI to extend their thinking.", weight: "font-black", dim: false, mint: false, pw: "trained" },
  { text: "And those who let AI replace it.", weight: "font-light", dim: true, mint: false },
  { text: "Those who used it to accelerate.", weight: "font-black", dim: false, mint: false, pw: "accelerate" },
  { text: "And those who got flattened by those who did.", weight: "font-light", dim: true, mint: false },
  { text: "This isn\u2019t a technology decision.", weight: "font-medium", dim: false, mint: false },
  { text: "It\u2019s a leadership one.", weight: "font-black", dim: false, mint: true },
  { text: "The question isn\u2019t whether AI will reshape your business. It\u2019s whether you\u2019ll be the one holding the pen.", weight: "font-light", dim: false, mint: false, boldEnd: "It\u2019s whether you\u2019ll be the one holding the pen." },
];

const renderText = (line: typeof linesData[0], isMintLayer: boolean) => {
  if (isMintLayer) return line.text;

  if (line.boldEnd) {
    const parts = line.text.split(line.boldEnd);
    return <>{parts[0]}<span className="font-bold">{line.boldEnd}</span></>;
  }
  if (line.pw) {
    const parts = line.text.split(line.pw);
    return <>{parts[0]}<span className="tracking-[0.06em]">{line.pw}</span>{parts[1]}</>;
  }
  return line.text;
};

const SharedLines = ({ isMintLayer, litIndex }: { isMintLayer: boolean; litIndex: number }) => (
  <div className="space-y-3 md:space-y-4 text-center">
    {linesData.map((line, i) => {
      const isLit = i <= litIndex;
      const isCurrent = i === litIndex;

      let color: string;
      if (isMintLayer) {
        color = "text-mint";
      } else if (line.mint && isLit) {
        color = "text-mint";
      } else if (isLit) {
        color = isCurrent ? "text-white" : line.dim ? "text-white/25" : "text-white/60";
      } else {
        color = "text-white/[0.06]";
      }

      return (
        <p
          key={i}
          className={`${SIZE} ${line.weight} ${color} transition-all duration-700 ease-out ${
            !isMintLayer && isCurrent ? "scale-[1.01]" : "scale-100"
          }`}
          style={
            !isMintLayer && line.mint && isLit
              ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3), 0 0 120px hsl(158 82% 73% / 0.1)" }
              : undefined
          }
        >
          {renderText(line, isMintLayer)}
        </p>
      );
    })}
  </div>
);

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
      if (i >= linesData.length) {
        clearInterval(interval);
        return;
      }
      setLitIndex(i);
    }, 400);
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
    <section ref={sectionRef} className="bg-ink py-16 md:py-20">
      <div
        ref={contentRef}
        className="relative container-width max-w-6xl px-4 md:px-8"
        onMouseMove={handleMouseMove}
      >
        {/* Base text layer */}
        <SharedLines isMintLayer={false} litIndex={litIndex} />

        {/* Mint torchlight overlay -- identical structure, masked to cursor */}
        <div
          className="absolute inset-0 pointer-events-none px-4 md:px-8"
          style={{
            maskImage: "radial-gradient(circle 120px at var(--mx, -200px) var(--my, -200px), black 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle 120px at var(--mx, -200px) var(--my, -200px), black 0%, transparent 80%)",
          }}
        >
          <SharedLines isMintLayer={true} litIndex={litIndex} />
        </div>
      </div>
    </section>
  );
};

export default BigProblem;
