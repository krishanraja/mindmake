/**
 * The returned hour's first answer, "Clock off work earlier?", is crossed out
 * in red as the reader scrolls (Krish, 2026-09-26). Homepage only: the
 * chapter's source is shared with /new-age-leadership, so the words are
 * wrapped here, after mount, and the shared markup is untouched.
 *
 * Native scrolling owns the line. Its length is read from where the answer
 * is, so it draws going down and undraws going back up, and nothing
 * intercepts wheel, touch or keys. On a desktop the panel pins beside the
 * benefits, which holds the answer still while the page moves on; the line
 * follows where the answer would be without the pin, so it keeps drawing
 * through the first part of the pinned travel. The line starts once the
 * answer is 72% of the way down the screen and completes 36% of a screen
 * later. Reduced motion shows it struck; without script the stylesheet
 * strikes it.
 */
export function mountReturnedHour(root: HTMLElement) {
  const answer = root.querySelector<HTMLElement>(".mm-home-leadership .proof-return li");
  const panel = answer?.closest<HTMLElement>(".proof-return");
  const chapter = answer?.closest<HTMLElement>(".human-proof");
  if (!answer || !panel || !chapter) return () => undefined;
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  const struck = document.createElement("s");
  struck.className = "mm-hour-strike";
  struck.append(...answer.childNodes);
  answer.append(struck);
  answer.classList.add("mm-hour-struck");
  let frame = 0;
  const paint = () => {
    frame = 0;
    if (motion.matches) { answer.style.setProperty("--strike", "1"); return; }
    /* The pinned panel shares the chapter's first row, so how far it has been
       held is how far it sits below the chapter's top. */
    const held = getComputedStyle(panel).position === "sticky" ? panel.getBoundingClientRect().top - chapter.getBoundingClientRect().top : 0;
    const top = answer.getBoundingClientRect().top - held;
    const progress = Math.max(0, Math.min(1, (innerHeight * 0.72 - top) / (innerHeight * 0.36)));
    answer.style.setProperty("--strike", progress.toFixed(4));
  };
  const queue = () => { if (!frame) frame = requestAnimationFrame(paint); };
  addEventListener("scroll", queue, { passive: true, signal: abort.signal });
  addEventListener("resize", queue, { passive: true, signal: abort.signal });
  motion.addEventListener("change", queue, { signal: abort.signal });
  paint();
  return () => {
    abort.abort();
    cancelAnimationFrame(frame);
    answer.classList.remove("mm-hour-struck");
    answer.style.removeProperty("--strike");
    struck.replaceWith(...struck.childNodes);
  };
}
