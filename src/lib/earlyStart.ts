import type { BriefRoute } from "@/components/mindmake/leadDelivery";

/**
 * The tap on the way in made before the page started (Krish, 2026-11-11:
 * "Start building your AI business button no longer works").
 *
 * The pages are prerendered, so on a mid-range phone the way in is on screen
 * about four seconds before React answers it (measured on production on
 * 2026-11-11: painted at 0.75s, answering at 5.1s with a four-times slower
 * processor on a slow connection). The catcher in index.html keeps a tap made
 * in that gap: it marks the control pressed and remembers which door, or that
 * the reader asked for the comparison. The page reads it here the moment it
 * mounts, opens what was asked for, and takes the catcher away, so it never
 * touches a later click. It is the shape src/pages/DtdFeedback.tsx proved on
 * 2 November 2026 for one button, here for every way in that opens in place.
 */
export interface EarlyCatch {
  door: "" | BriefRoute;
  compare: boolean;
  el: Element | null;
  done: boolean;
  fn: (event: Event) => void;
}

declare global {
  interface Window {
    __mmEarly?: EarlyCatch;
  }
}

const unmark = (early: EarlyCatch) => {
  early.el?.removeAttribute("data-early-pressed");
  early.el?.removeAttribute("aria-busy");
  early.el = null;
};

/**
 * Whether the reader asked for the comparison before the page started. Read
 * by the nudge, which mounts before the page's own effects run; it leaves the
 * catcher in place for the page to take away.
 */
export function takeEarlyCompare(): boolean {
  if (typeof window === "undefined") return false;
  const early = window.__mmEarly;
  if (!early || early.done || !early.compare) return false;
  early.compare = false;
  unmark(early);
  return true;
}

/**
 * The door the reader asked for before the page started, if any, and the
 * catcher taken away. Every later call returns null.
 */
export function takeEarlyStart(): BriefRoute | null {
  if (typeof window === "undefined") return null;
  const early = window.__mmEarly;
  if (!early || early.done) return null;
  early.done = true;
  document.removeEventListener("click", early.fn, true);
  const door = early.door || null;
  unmark(early);
  return door;
}
