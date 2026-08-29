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
 * - **A scroll pass reveals anything the reader reaches.** It does the
 *   observer's job on a plain scroll listener, so a silently broken observer
 *   costs nothing at all. This started life as a two-second timer and that was
 *   wrong twice over: it defeated the feature, because on any real page every
 *   element was revealed before the reader had scrolled to one, and it was a
 *   weaker promise, because it guaranteed a moment rather than the reader's own
 *   position.
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
 * The backstop, and the registry it runs over.
 *
 * Every pending element is checked against the viewport on scroll and on
 * resize, which is the observer's own job done by hand. If the observer works,
 * this never has anything left to do; if it silently does not, the reader
 * cannot tell, because an element is revealed by the time they can see it.
 *
 * One listener for the whole page, in the shape `useScrollDriver` already uses,
 * so a page of thirty revealed elements is one passive listener rather than
 * thirty.
 */
const pending = new Set<HTMLElement>();
let frame = 0;
let listening = false;

function sweep() {
  frame = 0;
  const viewport = window.innerHeight;
  for (const element of [...pending]) {
    if (element.getBoundingClientRect().top < viewport) {
      element.dataset.reveal = "shown";
      pending.delete(element);
    }
  }
  if (pending.size === 0) stopSweeping();
}

const onScroll = () => {
  if (frame) return;
  frame = requestAnimationFrame(sweep);
};

function startSweeping() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

function stopSweeping() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", onScroll);
}

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
      pending.delete(element);
      if (pending.size === 0) stopSweeping();
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
    pending.add(element);
    startSweeping();

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        show();
        observer.disconnect();
      }
    }, { rootMargin: ROOT_MARGIN });
    observer.observe(element);

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
      observer.disconnect();
      /* Revealed on the way out, so an element that unmounts mid-reveal cannot
         be remounted into a hidden state by a stale attribute. */
      show();
    };
  }, [index]);

  return ref;
}
