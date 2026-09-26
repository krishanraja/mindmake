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

/**
 * Progress paced by the steps themselves, for an instrument whose steps sit
 * below something that shows the whole build at once (the month's thirty
 * days). Reading from the instrument's top lit that rail and the last steps
 * while they were still under the action bar (Krish, 2026-09-26: "this
 * section builds a bit too early"). Here step i becomes current as its own
 * top crosses the reading line, and the progress between two crossings runs
 * with the distance travelled, so anything keyed to --seq-p keeps pace with
 * the step being read. The last step completes once it has travelled one
 * step's height past the line. Scrolling back undoes it.
 */
export function readingProgress(stepTops: number[], line: number) {
  const count = stepTops.length;
  if (count === 0) return 1;
  if (stepTops[0] >= line) return 0;
  let current = 0;
  while (current + 1 < count && stepTops[current + 1] < line) current += 1;
  const pitch = count > 1 ? (stepTops[count - 1] - stepTops[0]) / (count - 1) : 1;
  const next = current + 1 < count ? stepTops[current + 1] : stepTops[current] + pitch;
  const travelled = Math.max(0, Math.min(1, (line - stepTops[current]) / Math.max(1, next - stepTops[current])));
  return Math.min(1, (current + travelled) / count);
}
