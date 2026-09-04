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
       what is left of it snaps the whole build between 0 and 1 with nothing in
       between, so it falls back to a read. This used to be the narrow phone,
       where every pin was switched off: measured at 390 the climb reached 1.000
       while it was still arriving, three steps lighting in the time it takes to
       scroll past a heading. The phone holds its own sections now, at a length
       sized for a phone, and this is the guard for a section that genuinely has
       no room rather than the mobile path. */
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

interface DriverOptions {
  /**
   * Report progress to the callback and write nothing onto the element.
   *
   * For a subscriber that only wants to know where it is, such as a film plate
   * deciding whether it is near enough to mount its loop. A plate carrying
   * `--mm-p` would read to the aliveness gate's scrubbed pass as an element
   * that builds with scroll, which it does not.
   */
  silent?: boolean;
}

/** How long the first value is allowed to travel before values are written raw. */
const SETTLE_MS = 400;

/**
 * Registers a node with the driver and writes --mm-p onto it.
 * Pass an onProgress callback to react in JS (CountingValue does).
 *
 * ## The first write
 *
 * Hydration lands after first paint, so the first value the driver writes
 * lands on a page a reader is already looking at. Measured cold on a phone at
 * scroll 0, the hero's three parallax elements moved in one frame when that
 * happened: the plate 7px down, the headline 6px up, the claim 10px up, with
 * no transition, because the CSS default of .5 is zero translate and the first
 * measured value at 390x844 is about .8.
 *
 * Two things stop it. `--mm-p0` is written once, alongside the first `--mm-p`,
 * and parallax computes its translate from the difference, so the server
 * render, the first client render and the first write all compute zero and the
 * reader's own position is the origin: the `centre` range is documented as
 * one where only the differential matters, and now that is literally true. And
 * `data-mm-settling` is set for the first 400ms, so a group that builds with
 * position (`Build`) can let its first value travel rather than snap, which
 * matters when the reader has already thumbed past it before the script
 * arrived.
 */
export function useScrollDriver<T extends HTMLElement>(
  onProgress?: (progress: number) => void,
  range: ScrollRange = "centre",
  options: DriverOptions = {},
) {
  const ref = useRef<T | null>(null);
  const callback = useRef(onProgress);
  callback.current = onProgress;
  const { silent = false } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (typeof window === "undefined") return;

    let first = true;
    let settling = 0;
    const notify = (progress: number) => {
      if (!silent) {
        if (first) {
          element.style.setProperty("--mm-p0", progress.toFixed(3));
          element.setAttribute("data-mm-settling", "");
          settling = window.setTimeout(() => element.removeAttribute("data-mm-settling"), SETTLE_MS);
        }
        element.style.setProperty("--mm-p", progress.toFixed(3));
      }
      first = false;
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
      window.clearTimeout(settling);
      element.removeAttribute("data-mm-settling");
      unregister(element);
    };
  }, [range, silent]);

  return ref;
}
