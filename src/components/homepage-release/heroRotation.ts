/**
 * The hero headline turns through four lines once, then rests on the first
 * (Krish, 2026-09-27). Each says that the business moves when the leader
 * does, and each underlines the "you" or "your" it turns on.
 *
 * The first line is the approved headline and stays the h1's accessible name,
 * so a screen reader, a crawler, a page without script and a reader with
 * reduced motion only ever meet that one. The heading keeps the height of its
 * tallest line, measured at the current width, and each line sits at its
 * foot, so the lede and the doors under it never move. The first line keeps
 * the approved headline's narrow measure; the others take the lede's, since
 * that measure would break them a word to a line. The turn waits while
 * the hero is off screen or the tab is hidden.
 */
const LINES: ReadonlyArray<readonly [string, string, string]> = [
  ["Build the human + AI business that augments ", "your", " vision."],
  ["Your business levels\u00a0up when ", "you", " do."],
  ["Become the leader ", "your", " business needs next."],
  ["Amplify ", "your", " judgement, and the business follows."],
];
const FIRST_HOLD = 6500;
const HOLD = 5500;
const LEAVE = 480;

/* Where each line may run to: the approved measure for the first, the lede's for the rest. */
const measures = new WeakMap<HTMLElement, { first: string; rest: string }>();
const fit = (line: HTMLElement, heading: HTMLElement, index: number) => {
  const measure = measures.get(heading);
  if (measure) line.style.maxWidth = index === 0 ? measure.first : measure.rest;
  line.classList.toggle("is-wide", index !== 0);
};
const fill = (line: HTMLElement, [before, word, after]: readonly [string, string, string]) => {
  const mark = document.createElement("span");
  mark.className = "mm-hero-your";
  mark.textContent = word;
  line.replaceChildren(before, mark, after);
};

export function mountHeroRotation(root: HTMLElement) {
  const headings = [...root.querySelectorAll<HTMLElement>(".r3-opening h1")];
  const hero = root.querySelector<HTMLElement>(".r3-opening");
  if (!headings.length || !hero) return () => undefined;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  let current = 0;
  const lines = headings.map((heading) => {
    heading.setAttribute("aria-label", heading.textContent?.trim() ?? "");
    heading.classList.add("mm-hero-rotating");
    const line = document.createElement("span");
    line.className = "mm-hero-line";
    line.setAttribute("aria-hidden", "true");
    line.append(...heading.childNodes);
    heading.append(line);
    return line;
  });

  /* The tallest line at this width, measured on a hidden copy of the line. */
  const reserve = () => headings.forEach((heading, index) => {
    heading.style.minHeight = "";
    heading.style.maxWidth = "";
    if (heading.offsetParent === null) return;
    const lede = heading.parentElement?.querySelector<HTMLElement>(".hero-lede");
    const first = getComputedStyle(heading).maxWidth;
    const size = parseFloat(getComputedStyle(heading).fontSize);
    const column = heading.parentElement?.clientWidth ?? heading.clientWidth;
    const rest = `${Math.min(column, Math.max(heading.getBoundingClientRect().width, lede?.getBoundingClientRect().width ?? 0, size * 10.5))}px`;
    measures.set(heading, { first, rest });
    heading.style.maxWidth = rest;
    fit(lines[index], heading, current);
    const probe = lines[index].cloneNode() as HTMLElement;
    probe.classList.add("mm-hero-probe");
    probe.style.width = rest;
    heading.append(probe);
    let tallest = 0;
    LINES.forEach((words, turn) => { fill(probe, words); fit(probe, heading, turn); tallest = Math.max(tallest, probe.getBoundingClientRect().height); });
    probe.remove();
    heading.style.minHeight = `${Math.ceil(tallest)}px`;
  });

  let timer = 0;
  let visible = true;
  let finished = motion.matches;
  const show = (index: number) => {
    headings.forEach((heading) => heading.classList.add("is-leaving"));
    timer = window.setTimeout(() => {
      current = index;
      lines.forEach((line, n) => { fill(line, LINES[index]); fit(line, headings[n], index); });
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
    lines.forEach((line, n) => { fill(line, LINES[0]); fit(line, headings[n], 0); });
    headings.forEach((heading) => heading.classList.remove("is-leaving"));
  }, { signal: abort.signal });
  let frame = 0;
  addEventListener("resize", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(reserve); }, { passive: true, signal: abort.signal });
  document.fonts?.ready.then(() => { if (!abort.signal.aborted) reserve(); });
  reserve();
  resume();

  return () => {
    abort.abort();
    observer?.disconnect();
    window.clearTimeout(timer);
    cancelAnimationFrame(frame);
    headings.forEach((heading, index) => {
      fill(lines[index], LINES[0]);
      heading.replaceChildren(...lines[index].childNodes);
      heading.classList.remove("mm-hero-rotating", "is-leaving", "is-turned");
      heading.removeAttribute("aria-label");
      heading.style.minHeight = "";
      heading.style.maxWidth = "";
    });
  };
}
