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
 * width or height branches of its own. The one exception is a step that has
 * grown taller than its stage, because the reader has widened text spacing or
 * raised their font size: the hook marks the chapter `data-gtm-flow` and the
 * stylesheet lays it out as a document, so nothing is clipped (WCAG 1.4.12).
 * The mark holds while the reader is in or past the chapter, so the page never
 * flips back and forth under them; it is tried again when the screen changes
 * size, or when the chapter's content changes (a font arriving, the other door
 * chosen) while it is still below the screen, where nothing visible moves.
 * The server render and the first client render are both step 0, so
 * hydration never disagrees with the markup.
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
  const lockAt = useRef(-1);
  const relock = useRef<(() => void) | null>(null);
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
    const body = stage.querySelector<HTMLElement>(":scope > .gtm-stage-body");
    let frame = 0;
    let written = "";
    let flowAt: { width: number; height: number; over: number } | null = null;
    // Whether fit needs checking again: on mount, and when a size changes.
    let dirty = true;

    /* The site's action bar arrives once the reader is past the opening, and
       the stage gives it room. Until it has, fit is judged at the height the
       stage will have beside it, so a chapter that will not fit is released
       before the reader reaches it, never as the bar slides in. */
    const barToCome = () => {
      if (document.documentElement.classList.contains("mm-bar-visible")) return 0;
      return document.querySelector<HTMLElement>(".mm-action-bar")?.offsetHeight ?? 0;
    };
    /* How far the stage's content runs past the room it has, top and bottom,
       read from the body's own children so a step's entrance transform never
       counts as overflow. The stage is shortened for the bar for this one
       synchronous measurement and restored before anything is painted. */
    const overflow = () => {
      if (!body) return 0;
      const bar = barToCome();
      const held = { height: stage.style.height, transition: stage.style.transition };
      if (bar) {
        stage.style.transition = "none";
        stage.style.height = `${stage.offsetHeight - bar}px`;
      }
      const room = body.getBoundingClientRect();
      let top = Infinity;
      let bottom = -Infinity;
      for (const child of Array.from(body.children)) {
        const box = child.getBoundingClientRect();
        if (!box.height) continue;
        top = Math.min(top, box.top);
        bottom = Math.max(bottom, box.bottom);
      }
      if (bar) {
        stage.style.height = held.height;
        stage.style.transition = held.transition;
      }
      if (bottom < top) return 0;
      return Math.max(0, bottom - room.bottom) + Math.max(0, room.top - top);
    };

    const write = (value: string) => {
      // Off-screen chapters hold 0 or 1; only a change is written.
      if (value === written) return;
      written = value;
      track.style.setProperty("--gtm-progress", value);
    };

    const measure = () => {
      frame = 0;
      let style = window.getComputedStyle(stage);
      if (dirty) {
        dirty = false;
        if (flowAt && track.getBoundingClientRect().top > window.innerHeight) {
          // Below the screen: try the pinned layout again where no one sees it.
          flowAt = null;
          delete track.dataset.gtmFlow;
          style = window.getComputedStyle(stage);
        }
        const over = style.position === "sticky" && !flowAt ? overflow() : 0;
        if (over > 1) {
          flowAt = { width: window.innerWidth, height: window.innerHeight, over };
          track.dataset.gtmFlow = "true";
          style = window.getComputedStyle(stage);
        }
      }
      const isPinned = style.position === "sticky";
      setPinned(isPinned);
      if (!isPinned) {
        write("1");
        return;
      }
      const stageTop = Number.parseFloat(style.top) || 0;
      const trackBox = track.getBoundingClientRect();
      const progress = heldProgress(trackBox.top, stageTop, trackBox.height, stage.offsetHeight);
      write(progress.toFixed(4));
      if (Date.now() < lockUntil.current) {
        // A control's jump holds its step only until the page arrives.
        if (Math.abs(window.scrollY - lockAt.current) > 1) return;
        lockUntil.current = 0;
      }
      commit(stepFor(progress, count));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    relock.current = request;
    const resize = () => {
      if (flowAt && (window.innerWidth !== flowAt.width || window.innerHeight - flowAt.height > flowAt.over + 8)) {
        flowAt = null;
        delete track.dataset.gtmFlow;
      }
      dirty = true;
      request();
    };
    // A step that grows in place (text spacing, a font arriving) or a stage
    // that changes height (the bar arriving) is measured again.
    const regrow = () => {
      dirty = true;
      request();
    };
    const grown = typeof ResizeObserver === "function" && body ? new ResizeObserver(regrow) : null;
    if (grown && body) {
      Array.from(body.children).forEach((child) => grown.observe(child));
      grown.observe(stage);
    }
    let live = true;
    document.fonts?.ready.then(() => live && regrow());

    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      live = false;
      grown?.disconnect();
      relock.current = null;
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", resize);
      delete track.dataset.gtmFlow;
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
    lockAt.current = Math.round(top);
    commit(next);
    window.scrollTo({ top: Math.round(top), behavior });
    // If the reader scrolls on before the page arrives, position rules again
    // the moment the hold lapses, not at their next scroll.
    window.setTimeout(() => relock.current?.(), lockMs + 16);
  }, [commit, count, lockMs]);

  return { trackRef, stageRef, step, pinned, goTo };
}
