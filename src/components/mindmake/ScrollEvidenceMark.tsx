import { useEffect, useRef } from "react";

export function ScrollEvidenceMark() {
  const markRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
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
      const start = window.innerHeight * 0.82;
      const finish = window.innerHeight * 0.44;
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
  }, []);

  return (
    <span className="mm-evidence-target" ref={markRef}>
      <strong>1 day</strong>
      <svg className="mm-evidence-mark" viewBox="0 0 340 150" preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path pathLength="1" d="M28 93C43 37 112 17 205 24C286 30 330 61 314 94C296 130 219 136 131 128C66 122 18 112 28 93Z" />
      </svg>
    </span>
  );
}
