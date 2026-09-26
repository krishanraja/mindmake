import { useEffect, useRef, useState } from "react";

/**
 * The attendance line over the logo rail: a count that runs up to 4000+ the
 * first time it comes into view, then the sentence (Krish, 2026-09-26).
 *
 * The rendered text is always the final "4000+", so the server markup, a page
 * without script, a crawler and a reader with reduced motion all read the
 * settled figure. The run only starts in a browser that allows motion, once
 * the line is on screen, and lasts about a second and a half.
 */
const TARGET = 4000;
const DURATION = 1400;

export function LeaderCount() {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState<number | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    setValue(0);
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min(1, (now - start) / DURATION);
        /* Fast at first, settling on the figure. */
        setValue(Math.round(TARGET * (1 - Math.pow(1 - t, 3))));
        if (t < 1) frame = requestAnimationFrame(step);
        else setValue(null);
      };
      frame = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, []);

  return (
    <span className="mm-leader-count">
      <span className="mm-leader-count-figure" ref={ref} aria-hidden="true">{value === null ? `${TARGET}+` : value}</span>
      <span className="mm-visually-hidden">{TARGET}+ </span>
      {" "}leaders who have adopted mind/make thinking, from businesses including
    </span>
  );
}
