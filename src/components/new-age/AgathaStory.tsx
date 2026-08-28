import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";

const PARAGRAPHS = [
  "Agatha is an AI operations agent in our own system. It checks work from the other agents, looks for gaps and brings important questions back to us.",
  "It noticed a simple problem. Fifteen useful reports were arriving as fifteen separate files. No one was turning them into one clear view for a leader. Agatha described the missing job and the checks it would need. We then built Nova to do that job.",
  "The useful part was not that AI had invented a job. It had made a missing hand-off visible. We still had to decide whether the job was needed, what good work looked like and when Nova should ask for help.",
];

interface AgathaStoryProps {
  onStart: () => void;
}

export function AgathaStory({ onStart }: AgathaStoryProps) {
  const reduceMotion = useReducedMotion();

  return (
    <section className="section-padding" aria-labelledby="agatha-story-title">
      <div className="container-width max-w-4xl">
        <motion.h2
          id="agatha-story-title"
          className="max-w-[14ch] text-4xl font-bold leading-[1.02] md:text-6xl"
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={reduceMotion ? { duration: 0 } : { delay: 0.08, duration: 0.5 }}
        >
          Fifteen reports exposed one missing job.
        </motion.h2>
        <div className="mt-10 space-y-6 border-l-2 border-mint pl-6 md:mt-14 md:pl-10">
          {PARAGRAPHS.map((paragraph, index) => (
            <motion.p
              key={paragraph}
              className="text-lg leading-relaxed text-foreground md:text-xl"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-70px" }}
              transition={reduceMotion ? { duration: 0 } : { delay: index * 0.08, duration: 0.42 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>
        <div className="mt-10 border-t border-border/60 pt-7">
          <p className="max-w-2xl text-muted-foreground">
            A useful starting point can be this small: find the work that is falling between
            good people and good tools, then design the hand-off.
          </p>
          <button className="mm-text-link mt-5 inline-flex min-h-11 items-center py-2" type="button" onClick={onStart}>
            Start here
          </button>
        </div>
      </div>
    </section>
  );
}

interface PageCompletionBeaconProps {
  enabled?: boolean;
}

export function PageCompletionBeacon({ enabled = true }: PageCompletionBeaconProps) {
  const ref = useRef<HTMLDivElement>(null);
  const firedRef = useRef(false);

  useEffect(() => {
    if (!enabled) return;
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !firedRef.current) {
          firedRef.current = true;
          try {
            (window as unknown as { plausible?: (event: string) => void }).plausible?.(
              "page_completed",
            );
          } catch {
            // Analytics are optional.
          }
        }
      });
    }, { threshold: 0.5 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={ref} aria-hidden="true" />;
}
