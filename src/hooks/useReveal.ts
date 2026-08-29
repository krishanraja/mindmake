import { useEffect, useRef } from "react";

/**
 * The one entrance primitive on the site.
 *
 * Entrance choreography was banned outright until 29 August 2026. The ban had a
 * good argument behind it, recorded in `03_DESIGN_CONTRACT.md`: a scrubbed build
 * needs no observer, starts from no absent state, and reverses, and a reveal
 * needs all three. Krish lifted it, having asked three times for builds that
 * arrive as you read. It is his contract.
 *
 * What the ban was also protecting is not lifted, because it was never really
 * about choreography. Copy on this site has to be readable by a crawler that
 * runs nothing, by a screen reader, by somebody who asked for reduced motion,
 * and by somebody who lands halfway down a page from a search result. A reveal
 * whose first state is genuinely absent breaks all four. So this reveals
 * presentation, never content:
 *
 * - **The DOM is always complete.** Nothing is mounted on intersection and
 *   nothing is unmounted. Only opacity and transform change.
 * - **CSS defaults to revealed.** An element is hidden only after this hook has
 *   run and confirmed it has an observer, so no JavaScript means no hiding.
 * - **Only what is below the fold is ever hidden.** Landing mid-page shows
 *   everything already on screen, immediately, in its final state.
 * - **A timer reveals everything regardless.** If the observer never fires, for
 *   any reason at all, the page is whole a moment later rather than never.
 * - **Reduced motion hides nothing**, so that visitor gets the completed pass
 *   exactly as they do from every scrubbed build.
 *
 * `src/test/reveal-contract.test.tsx` holds each of those, because "the content
 * is still there" is the sort of promise that is true when it is written and
 * quietly false two refactors later.
 */

/** How far below the fold an element is revealed. One comfortable glance. */
const ROOT_MARGIN = "0px 0px -12% 0px";

/**
 * How long the page waits before showing everything regardless.
 *
 * Not a timeout in the usual sense: nothing has failed if it fires. It is the
 * guarantee that no combination of a stalled observer, a detached element or a
 * browser doing something unexpected can leave copy hidden. Two seconds is long
 * enough that it never pre-empts a reveal somebody is about to scroll to, and
 * short enough that nobody reads a gap.
 */
const SAFETY_MS = 2000;

const reducedMotion = (): boolean =>
  typeof window !== "undefined"
  && typeof window.matchMedia === "function"
  && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Marks an element to arrive as it is read.
 *
 * The element carries `data-reveal="shown"` at all times except the window
 * between this hook running and the element crossing into view, when it carries
 * `"pending"`. CSS styles the pending state and nothing else, which is what
 * makes the default revealed.
 */
export function useReveal<T extends HTMLElement>(index = 0) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window === "undefined") return;

    const show = () => {
      element.dataset.reveal = "shown";
    };

    /* No observer, or a visitor who asked for stillness: the element keeps the
       revealed state it was rendered in and this hook does nothing at all. */
    if (reducedMotion() || typeof IntersectionObserver !== "function") return;

    /* Already on screen, or scrolled past: never hidden. Somebody arriving from
       a search result at the middle of a page is looking at this element now,
       and an entrance it has already missed is just a blank space. */
    const box = element.getBoundingClientRect();
    if (box.top < window.innerHeight) return;

    element.dataset.reveal = "pending";
    element.style.setProperty("--mm-reveal-i", String(index));

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show();
        observer.disconnect();
      }
    }, { rootMargin: ROOT_MARGIN });
    observer.observe(element);

    /* The promise that nothing stays hidden, whatever else happens. */
    const safety = window.setTimeout(() => {
      show();
      observer.disconnect();
    }, SAFETY_MS);

    const motionQuery = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const onPreferenceChange = () => {
      if (reducedMotion()) {
        show();
        observer.disconnect();
      }
    };
    motionQuery?.addEventListener?.("change", onPreferenceChange);

    return () => {
      motionQuery?.removeEventListener?.("change", onPreferenceChange);
      window.clearTimeout(safety);
      observer.disconnect();
      /* Revealed on the way out, so an element that unmounts mid-reveal cannot
         be remounted into a hidden state by a stale attribute. */
      show();
    };
  }, [index]);

  return ref;
}
