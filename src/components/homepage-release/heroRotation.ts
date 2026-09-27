/**
 * The hero headline turns through four lines once, then rests on the first
 * (Krish, 2026-09-27). Each says that the business moves when the leader
 * does, and each underlines the "you" or "your" it turns on.
 *
 * Every headline is set in the same three fixed lines (Krish: "every headline
 * takes exactly the same amount of lines on mobile and desktop"), so the block
 * keeps one shape and nothing under it moves as they turn. The generator sets
 * the first in the markup the same way, so the page never reflows on load. The
 * type keeps the approved size wherever the longest of the twelve lines fits
 * the column, and steps down only where it would not.
 *
 * The first line is the approved headline and stays the h1's accessible name,
 * so a screen reader, a crawler, a page without script and a reader with
 * reduced motion only ever meet that one. The turn waits while the hero is
 * off screen or the tab is hidden.
 */
type Row = string;
/** Three rows per headline; *word* marks the underlined you or your. */
const LINES: ReadonlyArray<readonly [Row, Row, Row]> = [
  ["Build the human + AI", "business that augments", "*your* vision."],
  ["Your business", "levels up when", "*you* do."],
  ["Become the leader", "*your* business", "needs next."],
  ["Amplify *your*", "judgement, and the", "business follows."],
];
const FIRST_HOLD = 6500;
const HOLD = 5500;
const LEAVE = 480;

const row = (words: Row) => {
  const node = document.createElement("span");
  node.className = "mm-hero-row";
  for (const [index, part] of words.split("*").entries()) {
    if (!part) continue;
    if (index % 2) {
      const mark = document.createElement("span");
      mark.className = "mm-hero-your";
      mark.textContent = part;
      node.append(mark);
    } else node.append(part);
  }
  return node;
};
const fill = (line: HTMLElement, rows: readonly [Row, Row, Row]) => {
  const [a, b, c] = rows.map(row);
  line.replaceChildren(a, " ", b, " ", c);
};

export function mountHeroRotation(root: HTMLElement) {
  const headings = [...root.querySelectorAll<HTMLElement>(".r3-opening h1")];
  const hero = root.querySelector<HTMLElement>(".r3-opening");
  const lines = headings.map((heading) => heading.querySelector<HTMLElement>(".mm-hero-line"));
  if (!headings.length || !hero || lines.some((line) => !line)) return () => undefined;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  headings.forEach((heading, index) => {
    heading.setAttribute("aria-label", heading.textContent?.replace(/\s+/g, " ").trim() ?? "");
    lines[index]!.setAttribute("aria-hidden", "true");
  });

  /* The approved size unless the longest of all twelve lines would overrun
     the column, measured at this width on a hidden copy. */
  const fit = () => headings.forEach((heading, index) => {
    heading.style.fontSize = "";
    if (heading.offsetParent === null) return;
    const probe = lines[index]!.cloneNode() as HTMLElement;
    probe.classList.add("mm-hero-probe");
    heading.append(probe);
    let widest = 0;
    for (const rows of LINES) {
      fill(probe, rows);
      for (const node of probe.children) widest = Math.max(widest, (node as HTMLElement).getBoundingClientRect().width);
    }
    probe.remove();
    const room = heading.clientWidth;
    if (widest > room) heading.style.fontSize = `${Math.floor(parseFloat(getComputedStyle(heading).fontSize) * (room / widest) * 100) / 100}px`;
  });

  let current = 0;
  let timer = 0;
  let visible = true;
  let finished = motion.matches;
  const show = (index: number) => {
    headings.forEach((heading) => heading.classList.add("is-leaving"));
    timer = window.setTimeout(() => {
      current = index;
      lines.forEach((line) => fill(line!, LINES[index]));
      headings.forEach((heading) => { heading.classList.remove("is-leaving"); heading.classList.add("is-turned"); });
      if (index === 0) { finished = true; return; }
      schedule(HOLD);
    }, LEAVE);
  };
  const schedule = (delay: number) => {
    window.clearTimeout(timer);
    if (finished || !visible || document.hidden) return;
    timer = window.setTimeout(() => show((current + 1) % LINES.length), delay);
  };
  const resume = () => schedule(current === 0 ? FIRST_HOLD : HOLD);

  const observer = typeof IntersectionObserver === "undefined" ? null : new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) resume(); else window.clearTimeout(timer);
  }, { threshold: 0.35 });
  observer?.observe(hero);
  document.addEventListener("visibilitychange", () => (document.hidden ? window.clearTimeout(timer) : resume()), { signal: abort.signal });
  motion.addEventListener("change", () => {
    if (!motion.matches) return;
    finished = true;
    window.clearTimeout(timer);
    lines.forEach((line) => fill(line!, LINES[0]));
    headings.forEach((heading) => heading.classList.remove("is-leaving"));
  }, { signal: abort.signal });
  let frame = 0;
  addEventListener("resize", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(fit); }, { passive: true, signal: abort.signal });
  document.fonts?.ready.then(() => { if (!abort.signal.aborted) fit(); });
  fit();
  resume();

  return () => {
    abort.abort();
    observer?.disconnect();
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    headings.forEach((heading, index) => {
      fill(lines[index]!, LINES[0]);
      lines[index]!.removeAttribute("aria-hidden");
      heading.classList.remove("is-leaving", "is-turned");
      heading.removeAttribute("aria-label");
      heading.style.fontSize = "";
    });
  };
}
