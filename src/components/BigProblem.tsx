import { motion, useScroll, useTransform, useMotionValueEvent } from "framer-motion";
import { useRef, useState } from "react";

const PowerWord = ({ children }: { children: React.ReactNode }) => (
  <span className="font-black tracking-[0.05em] text-white">{children}</span>
);

const lines = [
  <p key={0} className="text-2xl sm:text-3xl md:text-4xl font-light text-white/60 leading-relaxed tracking-tight">
    In ten years, every leader will fall into one of two categories.
  </p>,

  <p key={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
    Those who learned to <PowerWord>orchestrate</PowerWord> AI.
  </p>,

  <p key={2} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white/30 font-light">
    And those who got orchestrated by it.
  </p>,

  <p key={3} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
    Those who <PowerWord>trained</PowerWord> AI to extend their thinking.
  </p>,

  <p key={4} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white/30 font-light">
    And those who let AI replace it.
  </p>,

  <p key={5} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight text-white">
    Those who used it to <PowerWord>accelerate</PowerWord>.
  </p>,

  <p key={6} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-white/30 font-light">
    And those who got flattened by those who did.
  </p>,

  <div key={7}>
    <p className="text-xl sm:text-2xl md:text-3xl font-medium text-white/50 leading-relaxed tracking-tight">
      This isn&rsquo;t a technology decision.
    </p>
    <p
      className="text-3xl sm:text-4xl md:text-5xl font-bold text-mint mt-4 tracking-tight"
      style={{ textShadow: "0 0 60px hsl(158 82% 73% / 0.3)" }}
    >
      It&rsquo;s a leadership one.
    </p>
  </div>,

  <p key={8} className="text-xl sm:text-2xl md:text-3xl font-light text-white/40 leading-relaxed tracking-tight max-w-2xl mx-auto">
    The question isn&rsquo;t whether AI will reshape your business.
    <br />
    <span className="text-white font-semibold">
      It&rsquo;s whether you&rsquo;ll be the one holding the pen.
    </span>
  </p>,
];

const BigProblem = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const idx = Math.min(Math.floor(v * lines.length), lines.length - 1);
    setActiveIndex(idx);
  });

  return (
    <section
      ref={sectionRef}
      className="relative bg-ink"
      style={{ height: `${lines.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center justify-center px-6">
        <div className="max-w-4xl w-full text-center">
          {lines.map((line, i) => (
            <motion.div
              key={i}
              className="absolute inset-0 flex items-center justify-center px-6"
              initial={false}
              animate={{
                opacity: activeIndex === i ? 1 : 0,
                y: activeIndex === i ? 0 : activeIndex > i ? -30 : 30,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              style={{ pointerEvents: activeIndex === i ? "auto" : "none" }}
            >
              <div className="max-w-4xl w-full text-center">{line}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BigProblem;
