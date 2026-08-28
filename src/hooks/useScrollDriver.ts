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

const registry = new Map<Element, Subscriber>();
let frame = 0;
let listening = false;

function completed() {
  registry.forEach((notify) => notify(1));
}

function measure() {
  frame = 0;
  const viewport = window.innerHeight || 1;
  registry.forEach((notify, element) => {
    const rect = element.getBoundingClientRect();
    const centre = rect.top + rect.height / 2;
    // 0 one viewport below the fold, 1 one viewport above it.
    const raw = 1 - centre / viewport;
    notify(Math.min(1, Math.max(0, (raw + 1) / 2)));
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

function register(element: Element, notify: Subscriber) {
  registry.set(element, notify);
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

    register(element, notify);

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
  }, []);

  return ref;
}
