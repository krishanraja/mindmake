import { useEffect, useRef, useState } from "react";
import { useScrollDriver } from "@/hooks/useScrollDriver";

interface CountingValueProps {
  value: number;
  /** Milliseconds for the count once it starts. */
  duration?: number;
}

/**
 * A live value that counts when it comes into view.
 *
 * The final number is what the component renders first, so nothing about the
 * page depends on the animation running: this changes how a value that is
 * already present feels, and never gates it. Reduced motion and jsdom both land
 * on the final value immediately, because the driver pins progress to 1 there.
 */
export function CountingValue({ value, duration = 620 }: CountingValueProps) {
  const [shown, setShown] = useState(value);
  const started = useRef(false);
  const frame = useRef(0);

  const ref = useScrollDriver<HTMLSpanElement>((progress) => {
    if (started.current) return;
    // Count only once the tile has actually entered the viewport.
    if (progress <= 0.5 || progress >= 1) return;
    started.current = true;

    const from = Math.max(0, Math.round(value * 0.72));
    const start = performance.now();
    setShown(from);

    const step = (now: number) => {
      const elapsed = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - elapsed, 3);
      setShown(Math.round(from + (value - from) * eased));
      if (elapsed < 1) frame.current = requestAnimationFrame(step);
    };
    frame.current = requestAnimationFrame(step);
  });

  useEffect(() => {
    setShown(value);
    started.current = false;
    return () => cancelAnimationFrame(frame.current);
  }, [value]);

  return <span ref={ref}>{shown.toLocaleString("en-GB")}</span>;
}
