import { useEffect, useRef } from "react";

/**
 * The one scroll primitive on the site.
 *
 * It writes a single custom property, --mm-p, onto each registered element:
 * 0 when the element's centre sits a viewport below the fold, 1 when it sits a
 * viewport above it, and 0.5 when it is centred. CSS reads that value to shift
 * emphasis between things already on the page (parallax, sticky focus dimming)
 * and CountingValue reads it to start a count.
 *
 * What it deliberately cannot do: reveal anything. Elements are always in their
 * final state in the DOM, so scroll never gates comprehension and reduced
 * motion needs no fallback content. Under prefers-reduced-motion, or wherever
 * the browser APIs are missing (tests, prerender), every element is pinned to
 * the completed value.
 */

type Subscriber = (progress: number) => void;

/**
 * How an element's position maps to 0 to 1.
 *
 * `centre` is the original: a gentle two-viewport ramp, right for parallax
 * where only the differential matters. `read` is tight and finishes while the
 * element is still on screen, which is what a build needs: the thing has to be
 * assembled by the time the visitor is looking at it, not a viewport later.
 * `pin` belongs to a section taller than the screen holding a sticky child: it
 * maps 0 to 1 across exactly the distance that child holds still for, so the
 * whole of a held section's motion is spent while it is the only thing on
 * screen. It needs no width branch, because a section that is merely tall and
 * not pinned travels the same distance under the same arithmetic.
 */
export type ScrollRange = "centre" | "read" | "pin";

interface Entry {
  notify: Subscriber;
  range: ScrollRange;
}

const registry = new Map<Element, Entry>();
let frame = 0;
let listening = false;

const clamp = (value: number) => Math.min(1, Math.max(0, value));

function completed() {
  registry.forEach(({ notify }) => notify(1));
}

function readProgress(rect: DOMRect, viewport: number): number {
  /* 0 when the top edge is three quarters down the screen, 1 when the bottom
     edge has risen to just above the middle. The whole build happens inside
     one comfortable reading pass. */
  const start = viewport * 0.75;
  const end = viewport * 0.45;
  const travelled = start - rect.top;
  const distance = Math.max(1, start - end + rect.height);
  return clamp(travelled / distance);
}

function progressFor(rect: DOMRect, viewport: number, range: ScrollRange): number {
  if (range === "pin") {
    /* 0 the moment the section's top reaches the top of the screen, 1 when its
       bottom does. That is the sticky child's exact hold, so the build starts
       when the section takes the screen and finishes as it gives it back.

       A section shorter than the screen has no such distance, and dividing by
       what is left of it snapped the whole build between 0 and 1 with nothing
       in between. That is the narrow phone, where the pin is off and the
       section is a few hundred pixels tall, so it falls back to a read. */
    const held = rect.height - viewport;
    if (held < viewport * 0.25) return readProgress(rect, viewport);
    return clamp(-rect.top / held);
  }
  if (range === "read") return readProgress(rect, viewport);
  const centre = rect.top + rect.height / 2;
  // 0 one viewport below the fold, 1 one viewport above it.
  return clamp((1 - centre / viewport + 1) / 2);
}

function measure() {
  frame = 0;
  const viewport = window.innerHeight || 1;
  registry.forEach(({ notify, range }, element) => {
    notify(progressFor(element.getBoundingClientRect(), viewport, range));
  });
}

function schedule() {
  if (frame) return;
  frame = window.requestAnimationFrame(measure);
}

function reducedMotion() {
  return typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function startListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule, { passive: true });
  schedule();
}

function stopListening() {
  if (!listening) return;
  listening = false;
  window.removeEventListener("scroll", schedule);
  window.removeEventListener("resize", schedule);
  if (frame) {
    window.cancelAnimationFrame(frame);
    frame = 0;
  }
}

function register(element: Element, notify: Subscriber, range: ScrollRange) {
  registry.set(element, { notify, range });
  if (reducedMotion() || typeof window.requestAnimationFrame !== "function") {
    notify(1);
    return;
  }
  startListening();
  schedule();
}

function unregister(element: Element) {
  registry.delete(element);
  if (registry.size === 0) stopListening();
}

/**
 * Registers a node with the driver and writes --mm-p onto it.
 * Pass an onProgress callback to react in JS (CountingValue does).
 */
export function useScrollDriver<T extends HTMLElement>(
  onProgress?: (progress: number) => void,
  range: ScrollRange = "centre",
) {
  const ref = useRef<T | null>(null);
  const callback = useRef(onProgress);
  callback.current = onProgress;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window === "undefined") return;

    const notify = (progress: number) => {
      element.style.setProperty("--mm-p", progress.toFixed(3));
      callback.current?.(progress);
    };

    register(element, notify, range);

    const motionQuery = typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)")
      : null;
    const onPreferenceChange = () => {
      if (reducedMotion()) {
        stopListening();
        completed();
      } else {
        startListening();
      }
    };
    motionQuery?.addEventListener?.("change", onPreferenceChange);

    return () => {
      motionQuery?.removeEventListener?.("change", onPreferenceChange);
      unregister(element);
    };
  }, [range]);

  return ref;
}
