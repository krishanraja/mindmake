import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface RevealLineProps {
  children: React.ReactNode;
  index: number;
  scrollYProgress: any;
  totalLines: number;
}

const RevealLine = ({ children, index, scrollYProgress, totalLines }: RevealLineProps) => {
  const segmentSize = 0.7 / totalLines;
  const start = 0.1 + index * segmentSize;
  const peak = start + segmentSize * 0.4;
  const end = start + segmentSize * 1.2;

  const opacity = useTransform(
    scrollYProgress,
    [start, peak, end],
    [0.15, 1, 0.4]
  );
  const y = useTransform(
    scrollYProgress,
    [start, peak],
    [20, 0]
  );

  return (
    <motion.div style={{ opacity, y }} className="will-change-transform">
      {children}
    </motion.div>
  );
};

const PowerWord = ({ children }: { children: React.ReactNode }) => (
  <span
    className="font-black tracking-wide text-white"
    style={{
      letterSpacing: "0.04em",
    }}
  >
    {children}
  </span>
);

const DimLine = ({ children }: { children: React.ReactNode }) => (
  <span className="text-white/50 font-light">{children}</span>
);

const lines = [
  {
    content: (
      <p className="text-2xl sm:text-3xl md:text-4xl font-light text-white/70 leading-relaxed">
        In ten years, every leader will fall into one of two categories.
      </p>
    ),
  },
  {
    content: (
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
        Those who learned to <PowerWord>orchestrate</PowerWord> AI.
      </p>
    ),
  },
  {
    content: (
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
        <DimLine>And those who got orchestrated by it.</DimLine>
      </p>
    ),
  },
  {
    content: (
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
        Those who <PowerWord>trained</PowerWord> AI to extend their thinking.
      </p>
    ),
  },
  {
    content: (
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
        <DimLine>And those who let AI replace it.</DimLine>
      </p>
    ),
  },
  {
    content: (
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] tracking-tight">
        Those who used it to <PowerWord>accelerate</PowerWord>.
      </p>
    ),
  },
  {
    content: (
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
        <DimLine>And those who got flattened by those who did.</DimLine>
      </p>
    ),
  },
  {
    content: (
      <div className="pt-8 md:pt-12">
        <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white/60 leading-relaxed">
          This isn't a technology decision.
        </p>
        <p
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-mint mt-3"
          style={{
            textShadow: "0 0 60px hsl(158 82% 73% / 0.3), 0 0 120px hsl(158 82% 73% / 0.15)",
            letterSpacing: "0.02em",
          }}
        >
          It's a leadership one.
        </p>
      </div>
    ),
  },
  {
    content: (
      <p
        className="text-lg sm:text-xl md:text-2xl font-light text-white/50 leading-relaxed max-w-2xl"
        style={{ letterSpacing: "0.01em" }}
      >
        The question isn't whether AI will reshape your business.
        <br />
        <span className="text-white font-semibold">
          It's whether you'll be the one holding the pen.
        </span>
      </p>
    ),
  },
];

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink overflow-hidden"
      style={{ minHeight: `${lines.length * 45 + 40}vh` }}
    >
      <div className="sticky top-0 min-h-screen flex items-center justify-center py-20">
        <div className="container-width">
          <div className="max-w-4xl mx-auto space-y-8 md:space-y-10 text-center">
            {lines.map((line, i) => (
              <RevealLine
                key={i}
                index={i}
                scrollYProgress={scrollYProgress}
                totalLines={lines.length}
              >
                {line.content}
              </RevealLine>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BigProblem;
