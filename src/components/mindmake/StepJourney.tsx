import { ReactNode, useEffect, useRef } from "react";
import { clamp, ease, pinProgress, range } from "@/components/mindmake/journeyMath";

/* One engine per journey page. Every pinned step section inside receives a
   raw progress value plus three pre-eased beats, all as custom properties,
   so the stylesheet owns what arrival, build and settle look like. Scroll
   moves the story forward and carries it back the same way. */
export function StepJourney({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sections = [...root.querySelectorAll<HTMLElement>("[data-mm-step]")];
    if (!sections.length) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const isReduced = reduceMotion.matches;
      const viewport = window.innerHeight;

      sections.forEach((section) => {
        /* A stage standing in flow (reduced motion, short landscape) shows
           its complete scene instead of a scroll build. */
        const stage = section.firstElementChild as HTMLElement | null;
        const unpinned = !stage || getComputedStyle(stage).position !== "sticky";
        const progress = isReduced || unpinned ? 1 : pinProgress(section);
        const rect = section.getBoundingClientRect();
        const state = rect.top > viewport ? "ahead" : rect.bottom < 0 ? "passed" : "active";
        /* Arrival begins while the section is still approaching the screen,
           so no scene ever sits empty waiting for its pin to start. */
        const arrive = isReduced || unpinned ? 1 : ease(clamp((viewport - rect.top) / Math.max(1, viewport * .55)));

        section.style.setProperty("--mm-step-progress", progress.toFixed(4));
        section.style.setProperty("--mm-step-p1", arrive.toFixed(4));
        section.style.setProperty("--mm-step-p2", range(progress, .04, .56).toFixed(4));
        section.style.setProperty("--mm-step-p3", range(progress, .42, .9).toFixed(4));
        if (section.dataset.stepState !== state) section.dataset.stepState = state;
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    reduceMotion.addEventListener?.("change", schedule);

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      reduceMotion.removeEventListener?.("change", schedule);
    };
  }, []);

  return (
    <div className="mm-journey" ref={rootRef}>
      {children}
    </div>
  );
}
