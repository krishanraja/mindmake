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
import { fittedLoopPath, loopFits, underlinePath } from "@/lib/scribble";

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
  /* A full second after the heading lands, so the reader sees the hand come
     in rather than finding the mark already there (Krish, 2026-11-04). */
  let start = 1450;
  title.querySelectorAll<HTMLElement>("[data-hs-mark]").forEach((mark, index) => {
    if (mark.querySelector("svg")) return;
    const box = mark.getBoundingClientRect();
    if (!box.width) return;
    const fontSize = parseFloat(getComputedStyle(mark).fontSize) || 40;
    const scale = fontSize / 40;
    const seed = `${mark.textContent}-${index}`;
    const others = glyphBoxes(title, mark);
    const own = glyphBoxes(mark)[0] ?? box;
    let kind = markKind(mark.dataset.hsMark, box, title.getBoundingClientRect(), fontSize);
    /* A loop only where it fits between the words around it; else the
       underline on a heading's last line; else no mark at all. */
    const room = kind === "loop" ? loopRoom(own, others, fontSize) : null;
    if (kind === "loop" && !room) kind = markKind("underline", box, title.getBoundingClientRect(), fontSize);
    if (kind === "loop" && !room) return;
    const pad = Math.round(fontSize * 0.45);
    const w = box.width + pad * 2, h = box.height + pad * 2;
    const strokes = room
      ? [fittedLoopPath(room.cx - box.left + pad, room.cy - box.top + pad, room.a, room.b, seed)]
      : underlinePath({ x: pad, y: pad - fontSize * 0.08, w: box.width, h: box.height }, seed, scale);
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "hs-mark-ink");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("viewBox", `0 0 ${w.toFixed(1)} ${h.toFixed(1)}`);
    svg.setAttribute("width", w.toFixed(1));
    svg.setAttribute("height", h.toFixed(1));
    svg.style.left = `${-pad}px`;
    svg.style.top = `${-pad}px`;
    /* One hand, one stroke at a time: each takes as long as a steady pen
       needs for its length, and the next begins once the pen has lifted. */
    const duration = room
      ? Math.min(1100, Math.max(750, 600 + box.width * 0.9))
      : Math.min(900, Math.max(400, 350 + box.width / 1.4));
    strokes.forEach((d) => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", d);
      path.setAttribute("pathLength", "1");
      path.style.strokeWidth = `${Math.max(2, 2.6 * scale).toFixed(1)}px`;
      path.style.setProperty("--stroke-delay", `${Math.round(start)}ms`);
      path.style.setProperty("--stroke-dur", `${Math.round(duration)}ms`);
      svg.append(path);
      start += duration + 90;
    });
    start += 160;
    mark.append(svg);
    requestAnimationFrame(() => requestAnimationFrame(() => svg.classList.add("is-drawn")));
  });
}

type Rect = { left: number; right: number; top: number; bottom: number };

let ruler: CanvasRenderingContext2D | null | undefined;

/**
 * Where each word's ink actually is, outside `skip`: the browser's own text
 * metrics give how far its letters rise above and fall below the baseline,
 * so "you" is known to stand lower than "staff".
 */
function glyphBoxes(root: HTMLElement, skip?: HTMLElement): Rect[] {
  const out: Rect[] = [];
  if (ruler === undefined) ruler = document.createElement("canvas").getContext("2d");
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    if (skip?.contains(node) || !node.parentElement) continue;
    const style = getComputedStyle(node.parentElement);
    if (ruler) ruler.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    const words = /\S+/g;
    let match: RegExpExecArray | null;
    while ((match = words.exec(node.data))) {
      const range = document.createRange();
      range.setStart(node, match.index);
      range.setEnd(node, match.index + match[0].length);
      const b = range.getBoundingClientRect();
      if (!b.width) continue;
      const m = ruler?.measureText(match[0]);
      if (m && m.fontBoundingBoxAscent) {
        const baseline = b.top + (b.height - m.fontBoundingBoxAscent - m.fontBoundingBoxDescent) / 2 + m.fontBoundingBoxAscent;
        out.push({ left: b.left, right: b.right, top: baseline - m.actualBoundingBoxAscent, bottom: baseline + m.actualBoundingBoxDescent });
      } else out.push({ left: b.left, right: b.right, top: b.top + b.height * 0.22, bottom: b.bottom - b.height * 0.12 });
    }
  }
  if (skip || out.length < 2) return out;
  return [out.reduce((u, r) => ({ left: Math.min(u.left, r.left), right: Math.max(u.right, r.right), top: Math.min(u.top, r.top), bottom: Math.max(u.bottom, r.bottom) }))];
}

/**
 * The roomiest pen loop around `own` that keeps clear of every other word,
 * if one still rings it: it leans into whichever side has space.
 */
export function loopRoom(own: Rect, others: Rect[], fontSize: number) {
  const gap = Math.max(3, fontSize * 0.045);
  let left = own.left - fontSize * 0.6, right = own.right + fontSize * 0.6;
  let top = own.top - fontSize * 0.4, bottom = own.bottom + fontSize * 0.4;
  for (const r of others) {
    if (r.bottom > own.top && r.top < own.bottom) {
      if (r.right <= own.left) left = Math.max(left, r.right + gap);
      else if (r.left >= own.right) right = Math.min(right, r.left - gap);
    }
  }
  for (const r of others) {
    if (r.right > left && r.left < right) {
      if (r.bottom <= own.top + 1) top = Math.max(top, r.bottom + gap);
      else if (r.top >= own.bottom - 1) bottom = Math.min(bottom, r.top - gap);
    }
  }
  /* Lean into the free side, or sit centred on the phrase; whichever rings it. */
  const ocx = (own.left + own.right) / 2, ocy = (own.top + own.bottom) / 2;
  const options = [
    { cx: (left + right) / 2, cy: (top + bottom) / 2, a: (right - left) / 2, b: (bottom - top) / 2 },
    { cx: ocx, cy: ocy, a: Math.min(ocx - left, right - ocx), b: Math.min(ocy - top, bottom - ocy) },
  ];
  for (const o of options) {
    const hw = Math.max(o.cx - own.left, own.right - o.cx), hh = Math.max(o.cy - own.top, own.bottom - o.cy);
    if (loopFits(o.a, o.b, hw, hh)) return o;
  }
  return null;
}

/**
 * Never an underline across other words (Krish, 2026-11-04: "We can't have
 * underlines that overlap other text"): where more of the heading sits below
 * the phrase, at this width, it is circled instead.
 */
export function markKind(asked: string | undefined, mark: { bottom: number }, title: { bottom: number }, fontSize: number): "loop" | "underline" {
  if (asked === "loop") return "loop";
  return title.bottom - mark.bottom > fontSize * 0.5 ? "loop" : "underline";
}
