/**
 * Whether the floating way-in button would sit on content (SiteActionBar.tsx;
 * audit BAR-02, 2026-11-10).
 */
/** What counts as something under the button: anything the reader could tap, and pictures. Running text at the foot of the screen is not: the reader scrolls it clear, and the button tucks away while they do. */
const INTERACTIVE = 'a[href], button, input, select, textarea, summary, label, [role="button"], [role="link"], [role="tab"], [tabindex]:not([tabindex="-1"])';
const PICTURE = "img, svg, video, canvas, picture";
/** Headings, and any reading a section marks as one to keep clear (the Brain's reading). */
const KEEP_CLEAR = "h1, h2, h3, h4, [data-mm-clear]";

/**
 * Whether the button, where it rests, sits on content. Probes nine points over
 * its resting box (wherever the slide-in transform has it now), ignoring the
 * bar itself and the fixed chrome around it.
 */
export function overlapsContent(bar: HTMLElement): boolean {
  const button = bar.querySelector<HTMLElement>(".mm-button");
  if (!button || typeof document.elementsFromPoint !== "function") return false;
  const box = button.getBoundingClientRect();
  if (!box.width) return false;
  const shift = typeof DOMMatrixReadOnly === "function" ? new DOMMatrixReadOnly(getComputedStyle(bar).transform === "none" ? undefined : getComputedStyle(bar).transform).m42 : 0;
  const top = box.top - shift - 6, bottom = box.bottom - shift + 6, left = box.left - 6, right = box.right + 6;
  const xs = [left, (left + right) / 2, right], ys = [top, (top + bottom) / 2, bottom];
  for (const x of xs) for (const y of ys) {
    if (y < 0 || y > window.innerHeight || x < 0 || x > window.innerWidth) continue;
    const under = document.elementsFromPoint(x, y).find((el) => !bar.contains(el) && !el.closest(".mm-cookie-notice, .mm-action-bar, header, .site-masthead"));
    if (!under) continue;
    if (under.closest(INTERACTIVE) || under.matches(PICTURE) || under.closest("svg") || under.closest(KEEP_CLEAR)) return true;
  }
  return false;
}
