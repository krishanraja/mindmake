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
import { underlinePath } from "@/lib/scribble";

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
    section.querySelectorAll<HTMLElement>(selectors.title).forEach((title) => {
      title.classList.add("hs-wipe");
      arrive(title, 0, () => {
        /* Only a heading that was actually waiting below the fold is wiped
           in; one already on screen is never hidden, even for a moment. */
        if (title.dataset.reveal === "shown") wipeLines(title);
        drawMarks(title);
      });
    });
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
 * A heading arrives line by line behind a block of colour (owner, 2026-11-10,
 * after the 21st.dev text block animation: "have the text blocks animate
 * with something like" it, adapted rather than copied). Each line is covered
 * by a bar that sweeps in from the left, the words appear under it, and the
 * bar leaves to the right; the lines follow one another down the heading.
 *
 * No library and no change to the heading's own markup: the lines are found
 * from the text's own boxes, the bars sit in a layer beside the heading, and
 * the heading is uncovered by a clip that drops a line at a time. Mint on a
 * dark ground, the deep green on paper, so the bar is always Mindmake's
 * answer colour. Called only for a heading that was waiting below the fold.
 */
export function wipeLines(title: HTMLElement) {
  const host = (title.offsetParent as HTMLElement | null) ?? document.body;
  const range = document.createRange();
  range.selectNodeContents(title);
  const fontSize = parseFloat(getComputedStyle(title).fontSize) || 40;
  const lines: Array<{ top: number; bottom: number; left: number; right: number }> = [];
  [...range.getClientRects()].filter((rect) => rect.width > 1 && rect.height > 1).forEach((rect) => {
    const line = lines.find((entry) => Math.abs(entry.top - rect.top) < fontSize * 0.5);
    if (line) { line.left = Math.min(line.left, rect.left); line.right = Math.max(line.right, rect.right); line.bottom = Math.max(line.bottom, rect.bottom); }
    else lines.push({ top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right });
  });
  range.detach?.();
  if (!lines.length) return;
  lines.sort((a, b) => a.top - b.top);
  const box = title.getBoundingClientRect();
  const hostBox = host.getBoundingClientRect();
  const offsetX = host === document.body ? window.scrollX : host.scrollLeft - host.clientLeft;
  const offsetY = host === document.body ? window.scrollY : host.scrollTop - host.clientTop;
  const [r, g, b] = (getComputedStyle(title).color.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).map(Number);
  const light = (r * 299 + g * 587 + b * 114) / 1000 > 140;
  const colour = light ? "#91e8bc" : "#2f6b4c";
  const layer = document.createElement("div");
  layer.className = "hs-wipe-layer";
  layer.setAttribute("aria-hidden", "true");
  host.append(layer);
  const reveal = (bottom: number) => {
    title.style.clipPath = `inset(-0.3em -1em ${Math.max(0, box.bottom - bottom).toFixed(1)}px -1em)`;
  };
  reveal(box.top - 1);
  const D = 460, STAGGER = 120;
  const timers: number[] = [];
  lines.forEach((line, index) => {
    const bar = document.createElement("span");
    bar.style.cssText = `position:absolute;left:${(line.left - hostBox.left + offsetX).toFixed(1)}px;top:${(line.top - hostBox.top + offsetY).toFixed(1)}px;width:${(line.right - line.left).toFixed(1)}px;height:${(line.bottom - line.top).toFixed(1)}px;background:${colour};transform:scaleX(0);transform-origin:left center;`;
    layer.append(bar);
    bar.animate?.([
      { transform: "scaleX(0)", transformOrigin: "left center", offset: 0, easing: "cubic-bezier(.7, 0, .3, 1)" },
      { transform: "scaleX(1)", transformOrigin: "left center", offset: 0.5 },
      { transform: "scaleX(1)", transformOrigin: "right center", offset: 0.5001, easing: "cubic-bezier(.7, 0, .3, 1)" },
      { transform: "scaleX(0)", transformOrigin: "right center", offset: 1 },
    ], { duration: D * 2, delay: index * STAGGER, fill: "both" });
    timers.push(window.setTimeout(() => reveal(index === lines.length - 1 ? box.bottom + fontSize : line.bottom + 2), index * STAGGER + D));
  });
  timers.push(window.setTimeout(() => { layer.remove(); title.style.removeProperty("clip-path"); }, (lines.length - 1) * STAGGER + D * 2 + 40));
}

/**
 * A hand marks a heading's closing words once it has arrived: two quick pen
 * strokes beneath them (the content engine's scribble, src/lib/scribble.ts).
 * Only ever under the heading's last line, so the ink never runs across other
 * words (Krish, 2026-11-04: "We can't have underlines that overlap other
 * text"); at a width where the phrase is not on the last line, no mark is
 * drawn. Decoration over words already there, so hidden from assistive
 * technology and drawn once; reduced motion shows it drawn.
 */
export function drawMarks(title: HTMLElement) {
  /* A full second after the heading lands, so the reader sees the hand come
     in rather than finding the mark already there (Krish, 2026-11-04). */
  let start = 1450;
  title.querySelectorAll<HTMLElement>("[data-hs-mark]").forEach((mark, index) => {
    if (mark.querySelector("svg")) return;
    const box = mark.getBoundingClientRect();
    if (!box.width) return;
    const fontSize = parseFloat(getComputedStyle(mark).fontSize) || 40;
    if (!onLastLine(box, title.getBoundingClientRect(), fontSize)) return;
    const scale = fontSize / 40;
    const pad = Math.round(fontSize * 0.45);
    const w = box.width + pad * 2, h = box.height + pad * 2;
    const strokes = underlinePath({ x: pad, y: pad - fontSize * 0.08, w: box.width, h: box.height }, `${mark.textContent}-${index}`, scale);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "hs-mark-ink");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`);
    svg.setAttribute("width", w.toFixed(1));
    svg.setAttribute("height", h.toFixed(1));
    svg.style.left = `${-pad}px`;
    svg.style.top = `${-pad}px`;
    /* One hand, one stroke at a time (Krish, 2026-11-04: "like someone is
       literally drawing two lines one after the other with a pen"): each takes
       as long as a steady pen needs for its length, and the second begins
       once the pen has lifted. */
    /* A quick hand (Krish, 2026-11-04: "People don't draw that slowly"). */
    const duration = Math.min(450, Math.max(220, 180 + box.width / 3.5));
    strokes.forEach((d) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("pathLength", "1");
      path.style.strokeWidth = `${Math.max(2, 2.6 * scale).toFixed(1)}px`;
      path.style.setProperty("--stroke-delay", `${Math.round(start)}ms`);
      path.style.setProperty("--stroke-dur", `${Math.round(duration)}ms`);
      svg.append(path);
      start += duration + 60;
    });
    start += 160;
    mark.append(svg);
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add("is-drawn")));
  });
}

/** Whether a phrase sits on its heading's last line, with nothing of the heading below it. */
export function onLastLine(mark: { bottom: number }, title: { bottom: number }, fontSize: number): boolean {
  return title.bottom - mark.bottom <= fontSize * 0.5;
}
