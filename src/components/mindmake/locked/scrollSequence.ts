/**
 * How far a stepped Brain instrument has built, from its own place on screen.
 *
 * The chapter's --p is measured from the chapter's top, which on a phone
 * passes its first threshold while the instrument is still below the fold, so
 * the first step would light where nobody can see it. Each stepped instrument
 * reads its own position instead, the way the r41 correction did: it starts
 * building as its top rises past 85% of the viewport and is complete once it
 * has risen by its own height (or 45% of the viewport, if taller). Scrolling
 * back runs the same arithmetic in reverse, so the build undoes itself.
 */
export function sequenceProgress(rectTop: number, rectHeight: number, viewportHeight: number) {
  if (viewportHeight <= 0) return 1;
  const span = Math.max(rectHeight, viewportHeight * 0.45);
  return Math.max(0, Math.min(1, (viewportHeight * 0.85 - rectTop) / span));
}

export type StepState = "past" | "current" | "next";

/**
 * Which steps are lit at a given progress. Nothing is lit before the build
 * starts; after that the steps light in order, and the last one stays current
 * once the build is complete.
 */
export function stepStates(progress: number, count: number): StepState[] {
  const lit = progress <= 0 ? -1 : Math.min(count - 1, Math.floor(progress * count));
  return Array.from({ length: count }, (_, index) => (index < lit ? "past" : index === lit ? "current" : "next"));
}
