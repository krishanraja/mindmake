/**
 * No word alone on the last line.
 *
 * Ruling (Krish, 2026-09-25): one word must never sit alone on a new line, on
 * any page, at the normal desktop or phone size. `text-wrap: pretty` in
 * src/index.css is the first line of defence and is not enough on its own:
 * measured in Chromium 141 it left "weaker?", "sessions" and "conditions."
 * alone at widths where pulling one word down would have fixed them.
 *
 * So after hydration, each block of running text whose last word has wrapped
 * alone gets its last two words joined, the way a typesetter would. Two ways,
 * so neither React nor any exact-text check is disturbed:
 *
 *  - Text React rendered: the space becomes a no-break space, in place, in the
 *    same text node. React never reads a text node back, so the next render
 *    simply writes its own string and this runs again.
 *  - Markup React does not own (the generated homepage, the locked Brain
 *    prototype): the two words move into a `white-space: nowrap` span. Their
 *    text, `textContent` and `innerText` are byte-identical, which is what the
 *    homepage's own state checks compare.
 *
 * It only ever joins words; nothing is undone on resize, because two words
 * kept together read correctly at every width. The server render and the
 * no-JavaScript page are unchanged. scripts/qa/line-break-check.mjs measures
 * the result on every indexed page.
 */
const BLOCK_TEXT = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dd, dt, small, label, a, button, span, strong, em, div, td, th";
const NBSP = "\u00a0";

const blockish = (el: Element) => !/^(inline|contents|none)$/.test(getComputedStyle(el).display);
const ownedByReact = (el: Element | null) => !!el && Object.keys(el).some((key) => key.startsWith("__reactFiber$"));

type Word = { node: Text; start: number; end: number };

function lastTwoWords(el: Element): [Word, Word] | null {
  const words: Word[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    for (const match of node.data.matchAll(/\S+/g)) {
      words.push({ node, start: match.index ?? 0, end: (match.index ?? 0) + match[0].length });
    }
  }
  return words.length >= 3 ? [words[words.length - 2], words[words.length - 1]] : null;
}

/* The line a word ends on. A word broken at a hyphen sits on two lines, and
   only its last fragment shares a line with what follows it. */
function top(word: Word): number | null {
  const range = document.createRange();
  range.setStart(word.node, word.start);
  range.setEnd(word.node, word.end);
  const rect = [...range.getClientRects()].filter((r) => r.width > 0).at(-1);
  return rect ? rect.top : null;
}

/* Returns an undo, so a join that would push the pair past an edge that hides
   it can be taken back. On /ai-brain "release judgement" at 44.8px is 311px, in
   a 226px heading inside a panel that hides overflow, so joining it cut the
   headline off (Krish, 2026-09-25). A lone last word is better than lost text. */
function join(before: Word, last: Word): (() => void) | null {
  /* Only a plain gap inside one text node is joined; a gap that crosses an
     element boundary (a link, an emphasis) is left as written. */
  if (before.node !== last.node) return null;
  const gap = before.node.data.slice(before.end, last.start);
  if (!/^[ \t\n\r]+$/.test(gap)) return null;
  const parent = before.node.parentElement;
  if (ownedByReact(parent)) {
    const node = before.node;
    const original = node.data;
    node.data = node.data.slice(0, before.end) + NBSP + node.data.slice(last.start);
    return () => { node.data = original; };
  }
  const tail = before.node.splitText(before.start);
  const rest = tail.splitText(last.end - before.start);
  const keep = document.createElement("span");
  keep.className = "mm-keep";
  keep.style.whiteSpace = "nowrap";
  tail.parentNode?.insertBefore(keep, rest);
  keep.append(tail);
  const host = keep.parentNode;
  return () => { keep.replaceWith(...keep.childNodes); host?.normalize(); };
}

/* Whether the joined block now runs past an edge that hides it: an ancestor
   that clips its overflow, or the viewport. A pair that merely overhangs its
   own box, with nothing clipping it, still reads in full and stays joined.

   A block that does not overflow can still be cut off. A heading in an
   auto-sized grid or flex track grows with the joined pair instead, and takes
   its track wider than the box that clips it: on the homepage "forgotten
   observation." widened the benefits column by 15px, and every benefit lost
   the ends of its lines (Krish, 2026-09-25). So a block wider than an ancestor
   that hides its overflow counts as clipped too. Scrolling ancestors are left
   out of that test: what they hide is a swipe away, and a card waiting off
   screen in a carousel is not cut off. */
function clipped(el: Element): boolean {
  if (el.scrollWidth <= el.clientWidth + 1) {
    const width = el.getBoundingClientRect().width;
    if (width > window.innerWidth + 1) return true;
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      if (/hidden|clip/.test(getComputedStyle(node).overflowX) && width > node.clientWidth + 1) return true;
    }
    return false;
  }
  const range = document.createRange();
  range.selectNodeContents(el);
  const right = Math.max(...[...range.getClientRects()].map((r) => r.right), el.getBoundingClientRect().right);
  if (right > window.innerWidth + 1) return true;
  for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
    if (/hidden|clip|auto|scroll/.test(getComputedStyle(node).overflowX) && right > node.getBoundingClientRect().right + 1) return true;
  }
  return false;
}

/* Blocks whose join was taken back. Undoing is itself a mutation, so without
   this the observer below would join and undo them for ever. A resize clears
   it, since a wider column may fit the pair. */
let declined = new WeakSet<Element>();

function repair(root: ParentNode) {
  for (const el of root.querySelectorAll(BLOCK_TEXT)) {
    /* Cheap first: only an element that holds words itself is a candidate. */
    if (![...el.childNodes].some((node) => node.nodeType === Node.TEXT_NODE && /\S/.test(node.textContent ?? ""))) continue;
    if (el.closest("script, style, noscript, svg, .mm-keep, [contenteditable]")) continue;
    if (!blockish(el) && el.tagName !== "A" && el.tagName !== "BUTTON") continue;
    if ([...el.children].some((child) => child.tagName !== "BR" && blockish(child) && child.textContent?.trim())) continue;
    if (el.querySelector("br")) continue;
    if (declined.has(el)) continue;
    const pair = lastTwoWords(el);
    if (!pair) continue;
    const [before, last] = pair;
    const a = top(before);
    const b = top(last);
    if (a === null || b === null || b - a < 1) continue;
    const undo = join(before, last);
    if (undo && clipped(el)) { undo(); declined.add(el); }
  }
}

export function keepLastWords(): () => void {
  if (typeof window === "undefined" || typeof document.createRange !== "function") return () => {};
  let frame = 0;
  let width = window.innerWidth;
  let timer = 0;
  const schedule = () => {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => repair(document.body));
    }, 120);
  };
  const onResize = () => {
    if (window.innerWidth === width) return;
    width = window.innerWidth;
    declined = new WeakSet<Element>();
    schedule();
  };
  const observer = new MutationObserver((records) => {
    /* Its own spans and joins are mutations too; only react to other ones. */
    if (records.every((record) => (record.target as Element).closest?.(".mm-keep") || [...record.addedNodes].every((node) => (node as Element).classList?.contains("mm-keep")))) return;
    schedule();
  });
  /* Attributes too: the homepage and Brain page show their states by
     toggling classes and hidden flags, and a state that was hidden when the
     page loaded is only measurable once it is shown. */
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["class", "hidden", "aria-hidden", "aria-current", "data-state"] });
  window.addEventListener("resize", onResize, { passive: true });
  void document.fonts?.ready.then(schedule);
  schedule();
  return () => {
    observer.disconnect();
    window.removeEventListener("resize", onResize);
    window.clearTimeout(timer);
    window.cancelAnimationFrame(frame);
  };
}
