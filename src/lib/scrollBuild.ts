/**
 * Pages that build as they are read (Krish, 2026-11-04: "the homepage feels
 * like it needs to build and animate on scroll", then "do the same scroll
 * build on /ai-brain and /ai-gtm").
 *
 * In each section the heading arrives and a hand marks its key words, then the
 * lede (a sentence at a time where the markup is not React's to rewrite), then
 * the cards in turn. Every piece goes through the site's one entrance
 * primitive, `revealOnArrival` in src/hooks/useReveal.ts, so nothing is hidden
 * without an observer, under reduced motion or once on screen, and nothing
 * pins or changes size: content stays readable if no animation ever runs.
 */
import { revealOnArrival } from "@/hooks/useReveal";
import { loopPath, underlinePath } from "@/lib/scribble";

export interface BuildSelectors {
  /** Each section that builds on its own. */
  sections: string;
  /** Headings inside a section; their [data-hs-mark] words are marked on arrival. */
  title: string;
  /** Ledes inside a section. */
  lede?: string;
  /** Cards and blocks that follow the lede, in turn. */
  items?: string;
  /**
   * Set a lede a sentence at a time. Only where the markup is not owned by
   * React, which would not expect its text nodes to be rewritten.
   */
  splitLede?: boolean;
}

export function buildOnScroll(root: HTMLElement, selectors: BuildSelectors): () => void {
  const cleanups: Array<() => void> = [];
  const arrive = (el: Element | null, order: number, onShown?: () => void) => {
    if (el instanceof HTMLElement && el.dataset.reveal === undefined) cleanups.push(revealOnArrival(el, order, onShown));
  };
  root.querySelectorAll<HTMLElement>(selectors.sections).forEach((section) => {
    section.querySelectorAll<HTMLElement>(selectors.title).forEach((title) => arrive(title, 0, () => drawMarks(title)));
    if (selectors.lede) {
      section.querySelectorAll<HTMLElement>(selectors.lede).forEach((lede) => {
        const sentences = (lede.textContent ?? "").match(/[^.!?]+[.!?]+["”’]?\s*/g) ?? [];
        if (selectors.splitLede && sentences.length > 1 && lede.children.length === 0) {
          lede.textContent = "";
          sentences.forEach((sentence, index) => {
            const span = document.createElement("span");
            span.dataset.hsSentence = "";
            span.textContent = sentence;
            lede.append(span);
            arrive(span, 2 + index * 3);
          });
        } else arrive(lede, 2);
      });
    }
    if (selectors.items) {
      let index = 0;
      section.querySelectorAll(selectors.items).forEach((item) => arrive(item, 3 + Math.min(index++, 3)));
    }
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}

/**
 * A hand marks a heading's key words once it has arrived: a loop around one
 * or an underline beneath it (the content engine's scribble,
 * src/lib/scribble.ts). Decoration over words already there, so hidden from
 * assistive technology and drawn once; reduced motion shows it drawn.
 */
export function drawMarks(title: HTMLElement) {
  title.querySelectorAll<HTMLElement>("[data-hs-mark]").forEach((mark, index) => {
    if (mark.querySelector("svg")) return;
    const box = mark.getBoundingClientRect();
    if (!box.width) return;
    const kind = mark.dataset.hsMark === "loop" ? "loop" : "underline";
    const fontSize = parseFloat(getComputedStyle(mark).fontSize) || 40;
    const scale = fontSize / 40;
    const pad = kind === "loop" ? Math.round(fontSize * 0.45) : Math.round(fontSize * 0.3);
    const w = box.width + pad * 2, h = box.height + pad * 2;
    const target = { x: pad, y: pad, w: box.width, h: box.height };
    const seed = `${mark.textContent}-${index}`;
    const d = kind === "loop" ? loopPath(target, seed) : underlinePath({ ...target, y: pad - fontSize * 0.08 }, seed, scale);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "hs-mark-ink");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`);
    svg.setAttribute("width", w.toFixed(1));
    svg.setAttribute("height", h.toFixed(1));
    svg.style.left = `${-pad}px`;
    svg.style.top = `${-pad}px`;
    svg.style.setProperty("--hs-mark-delay", `${450 + index * 350}ms`);
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", d);
    path.setAttribute("pathLength", "1");
    path.style.strokeWidth = `${Math.max(2, 2.6 * scale).toFixed(1)}px`;
    svg.append(path);
    mark.append(svg);
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add("is-drawn")));
  });
}
