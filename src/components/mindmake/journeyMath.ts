/* Shared motion maths for the step journeys. Duplicated from the approved
   opening act so the homepage engine is never edited from a route rebuild. */

export const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));

export const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;

export const ease = (value: number) => value < .5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;

export const range = (value: number, start: number, end: number) => ease(clamp((value - start) / Math.max(.0001, end - start)));

/* A pinned section reports how far the visitor has carried it: 0 when the
   stage first sticks, 1 when the section releases it. The stage's computed
   top already contains the header and consent chrome, so the read stays
   correct while the consent notice is visible. */
export function pinProgress(section: HTMLElement) {
  const stage = (section.firstElementChild as HTMLElement | null) ?? section;
  const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
  const rect = section.getBoundingClientRect();
  return clamp((stickyTop - rect.top) / Math.max(1, rect.height - stage.offsetHeight));
}
