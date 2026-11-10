/**
 * Sections ease back as they leave (Ruling, owner, 2026-11-10: "Gentle
 * settle, no pinning").
 *
 * This replaced section stacking, which held each section and laid the next
 * one over it. That made the page a collage, blanked the screen and dimmed the
 * Brain while it was read (audit S9-AUDIT-001). Here nothing pins and nothing
 * overlaps: every section scrolls exactly as the page does, and only as its
 * own foot rises past the upper part of the screen does it settle back a
 * little, slightly smaller and dimmer, the way a page you have finished slides
 * out of focus.
 *
 * The scale is taken from the section's foot (transform-origin at the bottom
 * centre), so its bottom edge, and the next section below it, never move. It
 * changes presentation only, resets the moment the reader comes back, does
 * nothing under reduced motion or the page's own motion pause, and never
 * scrolls the page.
 */

/** Where the settle starts: the section's foot at this share of the screen. */
export const SETTLE_START = 0.4;
/** Fully settled: the smallest scale and the lowest brightness. */
export const SETTLE_SCALE = 0.97;
export const SETTLE_BRIGHTNESS = 0.72;

/** 0 while the section's foot is below SETTLE_START of the screen, 1 when it reaches the masthead. */
export function settleProgress(bottom: number, viewport: number, masthead: number): number {
  const start = viewport * SETTLE_START;
  if (bottom >= start) return 0;
  if (bottom <= masthead) return 1;
  return (start - bottom) / Math.max(1, start - masthead);
}

/** The look at progress p, eased so the first part of the exit is barely felt. */
export function settleLook(p: number): { scale: number; brightness: number } {
  const eased = Math.max(0, Math.min(1, p)) ** 2;
  return { scale: 1 - (1 - SETTLE_SCALE) * eased, brightness: 1 - (1 - SETTLE_BRIGHTNESS) * eased };
}

export interface SettleOptions {
  /** Whether motion is paused by the page's own control; checked every frame. */
  paused?: () => boolean;
  /** Where the page announces a change to its motion pause ("mm:motion"). */
  motionTarget?: EventTarget;
}

export function settleSections(sections: HTMLElement[], { paused = () => false, motionTarget }: SettleOptions = {}): () => void {
  if (typeof window === "undefined" || !sections.length) return () => undefined;
  const motion = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  /* The screen's small height, unaffected by a phone's toolbar sliding in
     and out, so the settle never jumps as the toolbar moves (STACK-12). */
  const probe = document.createElement("div");
  probe.setAttribute("aria-hidden", "true");
  probe.style.cssText = "position:fixed;top:0;left:0;width:0;height:100svh;visibility:hidden;pointer-events:none";
  document.body.append(probe);
  const masthead = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mm-header-height")) || 64;
  const last = new Map<HTMLElement, number>();

  const clear = (section: HTMLElement) => {
    if (!last.get(section)) return;
    last.set(section, 0);
    for (const property of ["scale", "filter", "transform-origin", "will-change"]) section.style.removeProperty(property);
  };

  let frame = 0;
  const paint = () => {
    frame = 0;
    if (motion?.matches || paused()) { sections.forEach(clear); return; }
    const viewport = probe.offsetHeight || window.innerHeight;
    const top = masthead();
    /* Read every position first, then write, so the browser lays out once. */
    const progress = sections.map((section) => {
      /* A section holding keyboard focus stays as it is. */
      if (section.matches(":focus-within") && document.activeElement?.matches(":focus-visible")) return 0;
      return settleProgress(section.getBoundingClientRect().bottom, viewport, top);
    });
    sections.forEach((section, index) => {
      const p = progress[index];
      if (p <= 0) { clear(section); return; }
      if (Math.abs((last.get(section) ?? 0) - p) < 0.002) return;
      last.set(section, p);
      const look = settleLook(p);
      section.style.transformOrigin = "50% 100%";
      section.style.willChange = "scale, filter";
      section.style.scale = look.scale.toFixed(4);
      section.style.filter = `brightness(${look.brightness.toFixed(3)})`;
    });
  };
  const request = () => { if (!frame) frame = requestAnimationFrame(paint); };
  const events: Array<[EventTarget, string]> = [[window, "scroll"], [window, "resize"], [window, "pageshow"], [document, "visibilitychange"], ...(motionTarget ? [[motionTarget, "mm:motion"] as [EventTarget, string]] : [])];
  events.forEach(([target, type]) => target.addEventListener(type, request, { passive: true }));
  motion?.addEventListener?.("change", request);
  paint();

  return () => {
    events.forEach(([target, type]) => target.removeEventListener(type, request));
    motion?.removeEventListener?.("change", request);
    if (frame) cancelAnimationFrame(frame);
    probe.remove();
    sections.forEach((section) => {
      for (const property of ["scale", "filter", "transform-origin", "will-change"]) section.style.removeProperty(property);
    });
  };
}
