import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { careerReferences } from "@/data/rebuildProof";

const orderedCareerReferences = [
  ...careerReferences.filter(({ name }) => name === "Ashley Wales-Brown"),
  ...careerReferences.filter(({ name }) => name !== "Ashley Wales-Brown"),
];

const testimonials = orderedCareerReferences.map(
  ({ name, role, quote }) => [quote, `${name}, ${role}`] as const,
);

interface QuoteDeckProps {
  title: string;
  items: readonly (readonly [string, string])[];
  tone?: "forest" | "ink";
}

function QuoteDeck({ title, items, tone = "forest" }: QuoteDeckProps) {
  const [index, setIndex] = useState(0);
  const [swipeMode, setSwipeMode] = useState(false);
  const stackRef = useRef<HTMLDivElement>(null);
  const scrollFrameRef = useRef(0);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 900px)");
    const update = () => setSwipeMode(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    const stack = stackRef.current;
    if (!stack || !swipeMode) return;
    const onScroll = () => {
      if (scrollFrameRef.current) return;
      scrollFrameRef.current = window.requestAnimationFrame(() => {
        scrollFrameRef.current = 0;
        if (stack.scrollWidth <= stack.clientWidth + 4) return;
        const nearest = Math.round(stack.scrollLeft / Math.max(1, stack.clientWidth));
        setIndex(Math.max(0, Math.min(items.length - 1, nearest)));
      });
    };
    stack.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      stack.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(scrollFrameRef.current);
      scrollFrameRef.current = 0;
    };
  }, [items.length, swipeMode]);

  const goTo = (next: number) => {
    setIndex(next);
    const stack = stackRef.current;
    if (!stack || !swipeMode) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    stack.scrollTo({ left: next * stack.clientWidth, behavior: reducedMotion ? "auto" : "smooth" });
  };
  const move = (direction: number) => goTo((index + direction + items.length) % items.length);

  return (
    <article className={`mm-quote-deck is-${tone}`}>
      <header><h3>{title}</h3></header>
      <div className="mm-quote-stack" aria-live="polite" ref={stackRef}>
        {items.map(([quote, source], itemIndex) => (
          <blockquote className={itemIndex === index ? "is-active" : ""} aria-hidden={swipeMode ? undefined : itemIndex !== index} key={source}>
            <p>“{quote}”</p>
            <cite>{source}</cite>
          </blockquote>
        ))}
      </div>
      <footer>
        <span className="mm-rail-count">{String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        <div className="mm-rail-dots">
          {items.map(([, source], dotIndex) => (
            <button
              key={source}
              type="button"
              className={dotIndex === index ? "is-active" : ""}
              onClick={() => goTo(dotIndex)}
              aria-label={`Go to ${title.toLowerCase()} ${dotIndex + 1} of ${items.length}`}
              aria-current={dotIndex === index || undefined}
            />
          ))}
        </div>
        <div>
          <button type="button" onClick={() => move(-1)} aria-label={`Previous ${title.toLowerCase()}`}><ArrowLeft aria-hidden="true" /></button>
          <button type="button" onClick={() => move(1)} aria-label={`Next ${title.toLowerCase()}`}><ArrowRight aria-hidden="true" /></button>
        </div>
      </footer>
    </article>
  );
}

export function CareerReferenceDeck() {
  return (
    <div className="mm-voices">
      <QuoteDeck title="Testimonials" items={testimonials} tone="ink" />
    </div>
  );
}
