import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Quote, FastForward } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";

const PARAGRAPHS = [
  "Agatha is the COO-agent in Mindmaker's fleet. Her job is to surface strategic tensions, challenge my thinking, and flag when the fleet as a whole is drifting off-course. She's good at it.",
  "What I didn't expect: in January, Agatha flagged a capability gap. Outputs from fifteen other agents were landing in my inbox as fifteen separate reports. Nobody was synthesizing them into a coherent executive view. She proposed the role herself — an Intelligence Synthesist — and specified what it would need to do. A new agent was built to fulfill the spec. Its name is Nova.",
  "The decision I faced, which no business-school playbook had prepared me for: an AI teammate had identified a capability gap in my org and proposed a role to fill it. Who approves that hire? What's the vetting? What's the org-chart governance for agent-proposed roles? I had to write the policy from scratch. Every executive with an agent fleet is about to have the same moment.",
];

const trackEvent = (name: string) => {
  try {
    (window as unknown as { plausible?: (e: string) => void }).plausible?.(name);
  } catch {
    /* analytics optional */
  }
};

const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
};

interface TypedParagraphProps {
  text: string;
  active: boolean;
  onComplete: () => void;
  speedMs: number;
  instant?: boolean;
}

const TypedParagraph = ({ text, active, onComplete, speedMs, instant }: TypedParagraphProps) => {
  const [chars, setChars] = useState(instant || !active ? text.length : 0);
  const indexRef = useRef(0);

  useEffect(() => {
    if (instant) {
      setChars(text.length);
      return;
    }
    if (!active) return;
    indexRef.current = 0;
    setChars(0);
    const id = window.setInterval(() => {
      indexRef.current += 1;
      setChars(indexRef.current);
      if (indexRef.current >= text.length) {
        window.clearInterval(id);
        onComplete();
      }
    }, speedMs);
    return () => window.clearInterval(id);
  }, [active, instant, text, speedMs, onComplete]);

  const displayed = text.slice(0, chars);
  const showCursor = active && !instant && chars < text.length;

  return (
    <p className="text-lg md:text-xl text-foreground leading-relaxed">
      {displayed}
      {showCursor && (
        <span className="inline-block w-2 h-5 ml-0.5 align-middle bg-mint animate-pulse" />
      )}
    </p>
  );
};

export const AgathaStory = () => {
  const isMobile = useIsMobile();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [currentParagraph, setCurrentParagraph] = useState(0);
  const [showAll, setShowAll] = useState(false);

  // Use an IntersectionObserver to trigger the sequence once the section is visible
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !inView) {
            setInView(true);
          }
        });
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [inView]);

  const instant = showAll || reducedMotion;
  const speedMs = isMobile ? 8 : 15;

  const handleParagraphDone = (i: number) => {
    if (i === currentParagraph) setCurrentParagraph(i + 1);
  };

  const handleShowAll = () => {
    setShowAll(true);
    setCurrentParagraph(PARAGRAPHS.length);
    trackEvent("agatha_skip_clicked");
  };

  return (
    <section
      ref={sectionRef}
      className="section-padding bg-gradient-to-b from-background to-muted/30"
      aria-label="The Intelligence Synthesist story"
    >
      <div className="container-width max-w-3xl">
        {/* Featured callout eyebrow */}
        <motion.div
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-6"
          initial={{ opacity: 0, y: 8 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.4 }}
        >
          <span className="h-1 w-1 rounded-full bg-mint" />
          A story from the fleet
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl md:text-5xl font-bold mb-8 leading-tight"
          initial={{ opacity: 0, y: 12 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          Agatha hired herself a teammate.
        </motion.h2>

        {/* Quote glyph */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <Quote className="w-8 h-8 text-mint" />
        </motion.div>

        {/* Paragraphs */}
        <div className="space-y-6">
          {PARAGRAPHS.map((p, i) => (
            <TypedParagraph
              key={i}
              text={p}
              active={inView && i <= currentParagraph}
              onComplete={() => handleParagraphDone(i)}
              speedMs={speedMs}
              instant={instant || i < currentParagraph}
            />
          ))}
        </div>

        {/* Skip button */}
        {!instant && inView && currentParagraph < PARAGRAPHS.length && (
          <div className="mt-6">
            <button
              type="button"
              onClick={handleShowAll}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              <FastForward className="w-3.5 h-3.5" />
              Show all
            </button>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 pt-6 border-t border-border/60"
        >
          <p className="text-sm text-muted-foreground">
            This is one of the role-design questions the Cohort works through.{" "}
            <a
              href="/cohort"
              className="font-semibold text-mint-dark dark:text-mint hover:underline"
            >
              See the Cohort →
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

interface PageCompletionBeaconProps {
  enabled?: boolean;
}

export const PageCompletionBeacon = ({ enabled = true }: PageCompletionBeaconProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          try {
            (window as unknown as { plausible?: (e: string) => void }).plausible?.("page_completed");
          } catch {
            /* analytics optional */
          }
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={ref} aria-hidden="true" />;
};
