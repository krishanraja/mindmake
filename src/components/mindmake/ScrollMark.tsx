import { ReactNode, useEffect, useRef } from "react";

type MarkShape = "circle" | "underline" | "bracket";
type MarkDriver = "scroll" | "step" | "reveal";

interface ScrollMarkProps {
  children: ReactNode;
  shape?: MarkShape;
  driver?: MarkDriver;
  band?: [start: number, end: number];
  className?: string;
}

/* One hand-drawn stroke per shape, each normalised so the CSS dash offset
   reads a plain 0 to 1 progress. */
const MARK_PATHS: Record<MarkShape, { viewBox: string; d: string }> = {
  circle: {
    viewBox: "0 0 340 150",
    d: "M28 93C43 37 112 17 205 24C286 30 330 61 314 94C296 130 219 136 131 128C66 122 18 112 28 93Z",
  },
  underline: {
    viewBox: "0 0 340 40",
    d: "M6 26C64 18 132 24 186 20C242 16 296 22 334 16",
  },
  bracket: {
    viewBox: "0 0 60 150",
    d: "M52 8C22 10 12 34 14 74C16 116 26 140 54 142",
  },
};

/* A hand-drawn mark over one stable claim. Three drivers cover the three
   places copy lives: normal-flow pages (the scroll band draws and un-draws
   it), pinned step scenes (CSS reads the scene's settle beat instead, so
   this component adds no listener there), and the brief dialog (a one-time
   reveal animation). Reduced motion always shows the finished mark. */
export function ScrollMark({ children, shape = "circle", driver = "scroll", band = [0.82, 0.44], className = "" }: ScrollMarkProps) {
  const markRef = useRef<HTMLSpanElement>(null);
  const [bandStart, bandEnd] = band;

  useEffect(() => {
    if (driver !== "scroll") return;
    const mark = markRef.current;
    if (!mark) return;

    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const draw = () => {
      frame = 0;
      if (motionPreference.matches) {
        mark.style.setProperty("--mm-mark-progress", "1");
        return;
      }
      const rect = mark.getBoundingClientRect();
      const start = window.innerHeight * bandStart;
      const finish = window.innerHeight * bandEnd;
      const progress = Math.min(1, Math.max(0, (start - rect.top) / Math.max(1, start - finish)));
      mark.style.setProperty("--mm-mark-progress", progress.toFixed(4));
    };

    const requestDraw = () => {
      if (!frame) frame = window.requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener("scroll", requestDraw, { passive: true });
    window.addEventListener("resize", requestDraw);
    motionPreference.addEventListener?.("change", requestDraw);

    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestDraw);
      window.removeEventListener("resize", requestDraw);
      motionPreference.removeEventListener?.("change", requestDraw);
    };
  }, [bandEnd, bandStart, driver]);

  const path = MARK_PATHS[shape];

  return (
    <span className={`mm-mark is-${shape} is-${driver}${className ? ` ${className}` : ""}`} ref={markRef}>
      {children}
      <svg viewBox={path.viewBox} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path pathLength="1" d={path.d} />
      </svg>
    </span>
  );
}
