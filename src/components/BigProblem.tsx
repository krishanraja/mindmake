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
      if (i > 8) {
        clearInterval(interval);
        return;
      }
      setLitIndex(i);
    }, 450);
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
    <section
      ref={sectionRef}
      className="bg-ink py-20 md:py-28 lg:py-32"
    >
      <div
        ref={contentRef}
        className="relative container-width max-w-5xl px-6 md:px-12"
        onMouseMove={handleMouseMove}
      >
        <div className="space-y-5 md:space-y-6 text-center">
          <Line index={0} litIndex={litIndex} className="text-lg sm:text-xl md:text-2xl font-display font-light tracking-tight leading-relaxed">
            In ten years, every leader will fall into one of two categories.
          </Line>

          <Line index={1} litIndex={litIndex} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.08]">
            Those who learned to <PW>orchestrate</PW> AI.
          </Line>

          <Line index={2} litIndex={litIndex} dim className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight leading-[1.08]">
            And those who got orchestrated by it.
          </Line>

          <Line index={3} litIndex={litIndex} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.08]">
            Those who <PW>trained</PW> AI to extend their thinking.
          </Line>

          <Line index={4} litIndex={litIndex} dim className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight leading-[1.08]">
            And those who let AI replace it.
          </Line>

          <Line index={5} litIndex={litIndex} className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.08]">
            Those who used it to <PW>accelerate</PW>.
          </Line>

          <Line index={6} litIndex={litIndex} dim className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight leading-[1.08]">
            And those who got flattened by those who did.
          </Line>

          <div className="pt-4 md:pt-6">
            <Line index={7} litIndex={litIndex} className="text-lg sm:text-xl md:text-2xl font-display font-medium tracking-tight leading-relaxed">
              This isn&rsquo;t a technology decision.
            </Line>
            <Line index={7} litIndex={litIndex} mint className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight leading-[1.08] mt-2">
              It&rsquo;s a leadership one.
            </Line>
          </div>

          <Line index={8} litIndex={litIndex} className="text-base sm:text-lg md:text-xl font-display font-light tracking-tight leading-relaxed max-w-2xl mx-auto">
            The question isn&rsquo;t whether AI will reshape your business.{" "}
            <span className="font-bold">It&rsquo;s whether you&rsquo;ll be the one holding the pen.</span>
          </Line>
        </div>

        {/* Mint torchlight overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: "radial-gradient(circle 120px at var(--mx, -200px) var(--my, -200px), black 0%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(circle 120px at var(--mx, -200px) var(--my, -200px), black 0%, transparent 80%)",
          }}
        >
          <div className="space-y-5 md:space-y-6 text-center">
            <MintLine className="text-lg sm:text-xl md:text-2xl font-display font-light tracking-tight leading-relaxed">
              In ten years, every leader will fall into one of two categories.
            </MintLine>
            <MintLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.08]">
              Those who learned to <span className="tracking-[0.06em]">orchestrate</span> AI.
            </MintLine>
            <MintLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight leading-[1.08]">
              And those who got orchestrated by it.
            </MintLine>
            <MintLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.08]">
              Those who <span className="tracking-[0.06em]">trained</span> AI to extend their thinking.
            </MintLine>
            <MintLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight leading-[1.08]">
              And those who let AI replace it.
            </MintLine>
            <MintLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-black tracking-tight leading-[1.08]">
              Those who used it to <span className="tracking-[0.06em]">accelerate</span>.
            </MintLine>
            <MintLine className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-light tracking-tight leading-[1.08]">
              And those who got flattened by those who did.
            </MintLine>
            <div className="pt-4 md:pt-6">
              <MintLine className="text-lg sm:text-xl md:text-2xl font-display font-medium tracking-tight leading-relaxed">
                This isn&rsquo;t a technology decision.
              </MintLine>
              <MintLine className="text-2xl sm:text-3xl md:text-4xl font-display font-black tracking-tight leading-[1.08] mt-2">
                It&rsquo;s a leadership one.
              </MintLine>
            </div>
            <MintLine className="text-base sm:text-lg md:text-xl font-display font-light tracking-tight leading-relaxed max-w-2xl mx-auto">
              The question isn&rsquo;t whether AI will reshape your business.{" "}
              <span className="font-bold">It&rsquo;s whether you&rsquo;ll be the one holding the pen.</span>
            </MintLine>
          </div>
        </div>
      </div>
    </section>
  );
};

const PW = ({ children }: { children: React.ReactNode }) => (
  <span className="tracking-[0.06em]">{children}</span>
);

const MintLine = ({ className, children }: { className?: string; children: React.ReactNode }) => (
  <p className={`${className} text-mint`}>{children}</p>
);

const Line = ({
  index,
  litIndex,
  dim,
  mint,
  className,
  children,
}: {
  index: number;
  litIndex: number;
  dim?: boolean;
  mint?: boolean;
  className?: string;
  children: React.ReactNode;
}) => {
  const isLit = index <= litIndex;
  const isCurrent = index === litIndex;

  let color: string;
  if (mint && isLit) {
    color = "text-mint";
  } else if (isLit) {
    color = isCurrent ? "text-white" : dim ? "text-white/25" : "text-white/60";
  } else {
    color = "text-white/[0.06]";
  }

  return (
    <p
      className={`${className} ${color} transition-all duration-700 ease-out ${
        isCurrent ? "scale-[1.01]" : "scale-100"
      }`}
      style={
        mint && isLit
          ? { textShadow: "0 0 60px hsl(158 82% 73% / 0.3), 0 0 120px hsl(158 82% 73% / 0.1)" }
          : undefined
      }
    >
      {children}
    </p>
  );
};

export default BigProblem;
