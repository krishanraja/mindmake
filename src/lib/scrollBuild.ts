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
  const still = typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const arrive = (el: Element | null, order: number, onShown?: () => void) => {
    if (el instanceof HTMLElement && el.dataset.reveal === undefined) cleanups.push(revealOnArrival(el, order, onShown));
  };
  root.querySelectorAll<HTMLElement>(selectors.sections).forEach((section) => {
    const titles = [...section.querySelectorAll<HTMLElement>(selectors.title)];
    /* The body waits for its heading to be written (audit WIPE-01). */
    if (titles.length && !still) {
      section.style.setProperty("--mm-reveal-after", `${WIPE_BODY_WAIT_MS}ms`);
      cleanups.push(() => section.style.removeProperty("--mm-reveal-after"));
    }
    titles.forEach((title) => {
      title.classList.add("hs-wipe");
      arrive(title, 0, () => {
        /* Only a heading that was actually waiting below the fold is written
           in; one already on screen is never hidden, even for a moment. */
        if (title.dataset.reveal === "shown") cleanups.push(wipeLines(title));
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

/** How long one line takes to write, and the gap before the next line starts. */
export const WIPE_LINE_MS = 280;
export const WIPE_STAGGER_MS = 70;
/** How long the body waits for its heading: the first line is written by then. */
export const WIPE_BODY_WAIT_MS = 300;

/**
 * Whether a heading can be wiped in: only one the reader can actually see,
 * and only once. A heading inside a hidden beat, an inert or aria-hidden
 * container, or with no size is never wiped (audit WIPE-02, 2026-11-10: bars
 * appeared for headings nobody could see).
 */
export function canWipe(title: HTMLElement): boolean {
  if (title.dataset.wiped !== undefined) return false;
  if (title.closest('[inert], [aria-hidden="true"], [hidden], [data-active="false"]')) return false;
  if (!title.offsetWidth || !title.offsetHeight) return false;
  const check = (title as HTMLElement & { checkVisibility?: (options: object) => boolean }).checkVisibility;
  if (typeof check === "function" && !check.call(title, { opacityProperty: true, visibilityProperty: true })) return false;
  return true;
}

/** The heading's lines, in its own box: top, bottom, left and right offsets. */
function lineBoxes(title: HTMLElement) {
  const range = document.createRange();
  range.selectNodeContents(title);
  const box = title.getBoundingClientRect();
  const fontSize = parseFloat(getComputedStyle(title).fontSize) || 40;
  const lines: Array<{ top: number; bottom: number; left: number; right: number }> = [];
  const rects = typeof range.getClientRects === "function" ? [...range.getClientRects()] : [];
  rects.filter((rect) => rect.width > 1 && rect.height > 1).forEach((rect) => {
    const top = rect.top - box.top, bottom = rect.bottom - box.top, left = rect.left - box.left, right = rect.right - box.left;
    const line = lines.find((entry) => Math.abs(entry.top - top) < fontSize * 0.5);
    if (line) { line.left = Math.min(line.left, left); line.right = Math.max(line.right, right); line.bottom = Math.max(line.bottom, bottom); }
    else lines.push({ top, bottom, left, right });
  });
  range.detach?.();
  return { lines: lines.sort((x, y) => x.top - y.top), fontSize };
}

/**
 * A heading is written in, a line at a time (owner, 2026-11-10, adapted from
 * the 21st.dev text block animation, then fixed after the phone review: "Keep
 * it, fixed"). A narrow bar of Mindmake's answer colour runs along each line
 * like a pen's nib, and the words appear behind it; the next line starts just
 * after. The heading arrives before its body (the body waits
 * WIPE_BODY_WAIT_MS), the whole heading is written in well under a second,
 * and nothing is left behind.
 *
 * The words are uncovered by one clip on the heading, a staircase that grows
 * along each line, so the markup is never changed. The bars sit in a layer
 * beside the heading, placed from layout offsets so a transform elsewhere
 * cannot move them. Returns a cancel that stops it and leaves the heading
 * whole. Called only for a heading that was waiting below the fold.
 */
export function wipeLines(title: HTMLElement): () => void {
  if (!canWipe(title)) return () => undefined;
  const { lines, fontSize } = lineBoxes(title);
  if (!lines.length) return () => undefined;
  title.dataset.wiped = "";
  const host = (title.offsetParent as HTMLElement | null) ?? document.body;
  const width = title.offsetWidth;
  /* The title's place inside the layer's host, from layout values. */
  let originX = title.offsetLeft, originY = title.offsetTop;
  if (host === document.body) {
    const box = title.getBoundingClientRect();
    originX = box.left + window.scrollX;
    originY = box.top + window.scrollY;
  }
  const [r, g, b] = (getComputedStyle(title).color.match(/\d+(\.\d+)?/g) ?? ["0", "0", "0"]).map(Number);
  const colour = (r * 299 + g * 587 + b * 114) / 1000 > 140 ? "#91e8bc" : "#2f6b4c";
  const layer = document.createElement("div");
  layer.className = "hs-wipe-layer";
  layer.setAttribute("aria-hidden", "true");
  host.append(layer);
  /* Rows meet halfway between lines, so the staircase has no gaps; the first
     and last rows reach well past the glyphs so no tip or tail is cut. */
  const rows = lines.map((line, index) => ({
    ...line,
    rowTop: index === 0 ? -fontSize : (lines[index - 1].bottom + line.top) / 2,
    rowBottom: index === lines.length - 1 ? title.offsetHeight + fontSize : (line.bottom + lines[index + 1].top) / 2,
  }));
  const nibWidth = Math.max(3, Math.round(fontSize * 0.12));
  const bars = rows.map((row) => {
    const bar = document.createElement("span");
    bar.style.cssText = `position:absolute;top:${(originY + row.top).toFixed(1)}px;height:${(row.bottom - row.top).toFixed(1)}px;width:${nibWidth}px;left:${(originX + row.left).toFixed(1)}px;background:${colour};border-radius:${nibWidth}px;opacity:0;`;
    layer.append(bar);
    return bar;
  });
  const ease = (t: number) => 1 - Math.pow(1 - t, 3);
  const clip = (reach: number[]) => {
    const points: string[] = [`${-fontSize}px ${rows[0].rowTop}px`];
    rows.forEach((row, index) => {
      const x = reach[index];
      points.push(`${x.toFixed(1)}px ${row.rowTop.toFixed(1)}px`, `${x.toFixed(1)}px ${row.rowBottom.toFixed(1)}px`);
    });
    points.push(`${-fontSize}px ${rows[rows.length - 1].rowBottom.toFixed(1)}px`);
    title.style.clipPath = `polygon(${points.join(", ")})`;
  };
  let frame = 0;
  let finished = false;
  const finish = () => {
    if (finished) return;
    finished = true;
    cancelAnimationFrame(frame);
    layer.remove();
    title.style.removeProperty("clip-path");
  };
  const start = performance.now();
  const total = WIPE_LINE_MS + WIPE_STAGGER_MS * (rows.length - 1);
  const tick = (now: number) => {
    const elapsed = now - start;
    const reach = rows.map((row, index) => {
      const t = Math.max(0, Math.min(1, (elapsed - index * WIPE_STAGGER_MS) / WIPE_LINE_MS));
      const x = t >= 1 ? width + fontSize : row.left + (row.right - row.left) * ease(t);
      const bar = bars[index];
      bar.style.opacity = t > 0 && t < 1 ? "1" : "0";
      bar.style.left = `${(originX + Math.min(x, row.right) - nibWidth / 2).toFixed(1)}px`;
      return t <= 0 ? row.left - 1 : x;
    });
    clip(reach);
    if (elapsed >= total) { finish(); return; }
    frame = requestAnimationFrame(tick);
  };
  clip(rows.map((row) => row.left - 1));
  frame = requestAnimationFrame(tick);
  return finish;
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
