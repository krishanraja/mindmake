/**
 * Sections that stack as they are read (owner, 2026-11-10: "make the
 * hero-scroll-animation attached work for all the 3 pages for all sections
 * ... adapt it all together for a much more alive feeling website").
 *
 * The 21st.dev hero scroll pins a section and lets the next slide over it
 * while the first shrinks and tilts away. Adapted here, not copied: each
 * section is a sheet laid on the one before. The covered sheet settles back
 * (a little smaller, a degree of tilt, its light lowered, its corners rounded)
 * and the arriving one carries a soft shadow on its leading edge, so the page
 * reads as one pile of work being built rather than a scroll of panels.
 *
 * It changes presentation only, and only when it is safe to:
 * - nothing runs under reduced motion or without script, so the page is the
 *   ordinary scroll it always was;
 * - a sheet taller than the screen scrolls through in full before it holds,
 *   by sticking at its own foot, so no words are ever held out of reach;
 * - only transform, filter, a rounded clip and shadow change, never layout, so a
 *   heading never moves under a reader's thumb and no section changes size.
 */

export interface StackOptions {
  /** The fixed masthead's height, which every sheet holds beneath. */
  header?: () => number;
}

const clamp = (value: number) => Math.max(0, Math.min(1, value));

/** The masthead's height as the stylesheet publishes it. */
export const mastheadHeight = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mm-header-height")) || 68;

export function stackSections(groups: HTMLElement[][], { header = mastheadHeight }: StackOptions = {}): () => void {
  if (typeof window === "undefined") return () => undefined;
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  if (reduced) return () => undefined;
  const sheets = groups.filter((group) => group.length > 1);
  if (!sheets.length) return () => undefined;
  document.documentElement.classList.add("mm-stacking");

  const touched = new Set<HTMLElement>();
  /* A sheet must be opaque or the one beneath shows through it. A section
     that takes its colour from the page is given the page's own ground. */
  const groundOf = (sheet: HTMLElement) => {
    for (let el: HTMLElement | null = sheet.parentElement; el; el = el.parentElement) {
      const colour = getComputedStyle(el).backgroundColor;
      if (colour && !/rgba\(.*,\s*0\)$/.test(colour) && colour !== "transparent") return colour;
    }
    return "#0a100d";
  };
  const prepare = () => {
    const viewport = window.innerHeight;
    const top = header();
    sheets.forEach((group) => group.forEach((sheet, index) => {
      touched.add(sheet);
      sheet.classList.add("mm-sheet");
      sheet.style.zIndex = String(index + 1);
      sheet.classList.toggle("mm-sheet-over", index > 0);
      const own = getComputedStyle(sheet).backgroundColor;
      if (!sheet.style.backgroundColor && (/rgba\(.*,\s*0\)$/.test(own) || own === "transparent")) sheet.style.backgroundColor = groundOf(sheet);
      /* Every sheet is positioned, so its z-index lays it over the one before. */
      if (getComputedStyle(sheet).position === "static") sheet.style.position = "relative";
      if (index === group.length - 1) return;
      /* A sheet shorter than the screen holds under the masthead; a taller
         one scrolls through and holds at its own foot. */
      const height = sheet.offsetHeight;
      sheet.style.position = "sticky";
      sheet.style.top = `${Math.min(top, viewport - height)}px`;
    }));
  };

  let frame = 0;
  const paint = () => {
    frame = 0;
    const viewport = window.innerHeight;
    const top = header();
    sheets.forEach((group) => group.forEach((sheet, index) => {
      const next = group[index + 1];
      if (!next) return;
      const arriving = next.getBoundingClientRect().top;
      const p = clamp((viewport - arriving) / Math.max(1, viewport - top));
      if (p <= 0.001) {
        if (sheet.dataset.sheetCovered) {
          delete sheet.dataset.sheetCovered;
          sheet.style.removeProperty("transform");
          sheet.style.removeProperty("filter");
          sheet.style.removeProperty("clip-path");
        }
        return;
      }
      sheet.dataset.sheetCovered = "";
      /* The sheet settles back towards where the reader's eye already is:
         its top when it is held under the masthead, its foot when it was
         taller than the screen. */
      const rect = sheet.getBoundingClientRect();
      const originY = Math.max(0, Math.min(rect.height, viewport * 0.45 - rect.top));
      sheet.style.transformOrigin = `50% ${originY.toFixed(0)}px`;
      sheet.style.transform = `scale(${(1 - 0.075 * p).toFixed(4)}) rotate(${(-1.1 * p).toFixed(3)}deg)`;
      sheet.style.filter = `brightness(${(1 - 0.45 * p).toFixed(3)})`;
      sheet.style.clipPath = `inset(0 round ${(28 * p).toFixed(1)}px)`;
    }));
  };
  const request = () => { if (!frame) frame = requestAnimationFrame(paint); };

  /* A control on a covered sheet is under the next one. When keyboard focus
     (or a find, or a link) lands on one, the page steps back until that sheet
     is uncovered, so nothing can be focused out of sight. */
  const onFocus = (event: FocusEvent) => {
    const target = event.target instanceof Element ? event.target : null;
    if (target) uncover(target);
  };

  /* Heights change as pictures load and fonts land, so the holds are read
     again whenever a sheet changes size, never on scroll. */
  const resize = () => { prepare(); request(); };
  const observer = typeof ResizeObserver === "function" ? new ResizeObserver(() => { prepare(); request(); }) : null;
  sheets.flat().forEach((sheet) => observer?.observe(sheet));
  prepare();
  paint();
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", resize, { passive: true });
  document.addEventListener("focusin", onFocus);

  return () => {
    document.removeEventListener("focusin", onFocus);
    window.removeEventListener("scroll", request);
    window.removeEventListener("resize", resize);
    observer?.disconnect();
    if (frame) cancelAnimationFrame(frame);
    document.documentElement.classList.remove("mm-stacking");
    touched.forEach((sheet) => {
      sheet.classList.remove("mm-sheet", "mm-sheet-over");
      delete sheet.dataset.sheetCovered;
      for (const property of ["position", "top", "z-index", "background-color", "transform", "transform-origin", "filter", "clip-path"]) sheet.style.removeProperty(property);
    });
  };
}

/**
 * Scrolls back just far enough that the sheet holding `element` is no longer
 * covered by the one after it. Does nothing when it is not covered.
 */
export function uncover(element: Element) {
  const sheet = element.closest<HTMLElement>(".mm-sheet[data-sheet-covered]");
  if (!sheet) return;
  const sheets = [...(sheet.parentElement?.children ?? [])].filter((node): node is HTMLElement => node instanceof HTMLElement && node.classList.contains("mm-sheet"));
  const next = sheets[sheets.indexOf(sheet) + 1];
  if (!next) return;
  /* Later sheets can be held over it too, and each only lets go as the page
     passes its own place, so the step back is taken until nothing covers it. */
  for (let i = 0; i < 8; i++) {
    const over = window.innerHeight - next.getBoundingClientRect().top;
    if (over <= 0.5) return;
    window.scrollTo({ top: window.scrollY - over, behavior: "instant" as ScrollBehavior });
  }
}
