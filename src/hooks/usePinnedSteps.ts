import { useCallback, useEffect, useRef, useState } from "react";

/**
 * A pinned chapter that advances one step at a time as the page scrolls.
 *
 * The geometry is the one /new-age-leadership proved: a tall track holds a
 * `position: sticky` stage one screen high, and the step is read from how far
 * the stage has travelled through the track. State comes from position and
 * nothing else, so scrolling back up walks the steps back down, the chapter
 * releases at either end by itself, and nothing here listens to the wheel, a
 * touch or a key. Controls move the page to where a step lives rather than
 * swapping the step underneath the reader.
 *
 * Two corrections to the pattern it copies. Progress is measured from the
 * stage's own sticky top (the header height) rather than from the top of the
 * viewport, which put every threshold off by the header. And reduced motion
 * keeps the pin and every step: it drops transitions in CSS, where they live,
 * rather than jumping the chapter to its last state the way the site's
 * progress driver does for decorative motion.
 *
 * Whether the stage pins at all is the stylesheet's decision (short screens,
 * no scripting), read back from the computed position, so the hook has no
 * width or height branches of its own. The server render and the first client
 * render are both step 0, so hydration never disagrees with the markup.
 */

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** How far the stage has travelled through its track, 0 at the pin and 1 at the release. */
export function heldProgress(trackTop: number, stageTop: number, trackHeight: number, stageHeight: number) {
  return clamp01((stageTop - trackTop) / Math.max(1, trackHeight - stageHeight));
}

/** The step a progress value falls in, with equal bands for each step. */
export function stepFor(progress: number, count: number) {
  return Math.max(0, Math.min(count - 1, Math.floor(clamp01(progress) * count)));
}

interface Options {
  /** How long a control's jump holds its step before position rules again. */
  lockMs?: number;
}

export function usePinnedSteps<T extends HTMLElement = HTMLElement>(count: number, { lockMs = 1200 }: Options = {}) {
  const trackRef = useRef<T>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [pinned, setPinned] = useState(false);
  const lockUntil = useRef(0);
  const stepRef = useRef(0);

  const commit = useCallback((next: number) => {
    if (next === stepRef.current) return;
    stepRef.current = next;
    setStep(next);
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const style = window.getComputedStyle(stage);
      const isPinned = style.position === "sticky";
      setPinned(isPinned);
      if (!isPinned) {
        track.style.setProperty("--gtm-progress", "1");
        return;
      }
      const stageTop = Number.parseFloat(style.top) || 0;
      const trackBox = track.getBoundingClientRect();
      const progress = heldProgress(trackBox.top, stageTop, trackBox.height, stage.offsetHeight);
      track.style.setProperty("--gtm-progress", progress.toFixed(4));
      if (Date.now() < lockUntil.current) return;
      commit(stepFor(progress, count));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
    };
  }, [count, commit]);

  const goTo = useCallback((index: number) => {
    const track = trackRef.current;
    const stage = stageRef.current;
    if (!track || !stage) return;
    const next = Math.max(0, Math.min(count - 1, index));
    const reduced = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const behavior: ScrollBehavior = reduced ? "auto" : "smooth";
    const style = window.getComputedStyle(stage);
    if (style.position !== "sticky") {
      // Unpinned, every step is laid out in flow: take the reader to it.
      const target = stage.querySelector<HTMLElement>(`[data-gtm-step="${next}"]`);
      target?.scrollIntoView({ behavior, block: "start" });
      return;
    }
    const stageTop = Number.parseFloat(style.top) || 0;
    const held = track.offsetHeight - stage.offsetHeight;
    // The middle of the step's band, so a small scroll either way keeps it.
    const top = window.scrollY + track.getBoundingClientRect().top - stageTop + (held * (next + 0.5)) / count;
    lockUntil.current = Date.now() + lockMs;
    commit(next);
    window.scrollTo({ top: Math.round(top), behavior });
  }, [commit, count, lockMs]);

  return { trackRef, stageRef, step, pinned, goTo };
}
