import { useEffect, useRef } from "react";
import { ConvergeFigure } from "@/components/mindmake/ConvergeFigure";
import { Instrument } from "@/components/mindmake/Instrument";

/**
 * One thing that happened, as a figure and one line.
 *
 * It was three paragraphs. The story is fifteen reports arriving as fifteen
 * files, an agent noticing that nobody joined them up, and a person deciding
 * whether the missing job was worth having. That is a picture with a caption,
 * and the picture is the part a reader remembers.
 *
 * Ported off the retired vocabulary on 2 September 2026. It was the last piece
 * of prose on the site still laid out in Tailwind utilities and animated by
 * `framer-motion`, on a page nobody could reach, so nothing had ever pulled it
 * up. It also carried a second "Start here" halfway down a page that already
 * closes on one, which is a second way in on a site whose rule is one.
 */
export function AgathaStory({ ground }: { ground?: "raise" | "paper" } = {}) {
  const ground_class = ground === "raise" ? " mm-on-raise" : ground === "paper" ? " mm-on-paper" : "";

  return (
    <section className={`mm-block${ground_class}`} aria-labelledby="agatha-story-title">
      <div className="mm-container">
        <div className="mm-head-split">
          <h2 id="agatha-story-title">
            <Instrument kind="flap" className="mm-head-mark" />
            Fifteen reports exposed one missing job.
          </h2>
          <p className="mm-lede">
            An agent in our own system noticed nobody was joining them up. A person decided the
            job was worth having.
          </p>
        </div>
        <ConvergeFigure />
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
