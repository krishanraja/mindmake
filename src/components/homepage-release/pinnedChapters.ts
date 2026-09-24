/** Native scrolling owns progression. Never intercept wheel, touch or keyboard. */
type Chapters = {
  selectStory: (index: number) => void;
  selectPractice: (index: number) => void;
  selectDividend: (mode: "practice" | "benefits" | "return") => void;
};

export function mountPinnedChapters(root: HTMLElement, chapters: Chapters) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  let frame = 0;
  const tracks = ([
    { name: "history", count: 4, apply: (index: number) => chapters.selectStory(index) },
    { name: "leadership-dividend", count: 5, apply: (index: number) => {
      chapters.selectDividend(index < 3 ? "practice" : index === 3 ? "benefits" : "return");
      if (index < 3) chapters.selectPractice(index);
    } },
  ]).flatMap(({ name, count, apply }) => {
    const section = root.querySelector<HTMLElement>(`[data-component="${name}"]`);
    if (!section) return [];
    const track = document.createElement("div");
    track.className = "homepage-pin-track";
    track.dataset.chapter = name;
    section.before(track);
    track.append(section);
    return [{ name, count, apply, section, track, enabled: false, step: 0, index: -1 }];
  });
  function update() {
    frame = 0;
    for (const item of tracks) {
      if (!item.enabled) continue;
      const progress = -item.track.getBoundingClientRect().top;
      if (progress < -1) continue;
      const index = Math.max(0, Math.min(item.count - 1, Math.floor((progress + 1) / item.step)));
      if (index !== item.index) {
        item.index = index;
        item.apply(index);
        item.section.dataset.scrollStage = String(index);
      }
    }
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  function measure() {
    for (const item of tracks) {
      const height = item.section.getBoundingClientRect().height;
      // Short landscape / enlarged text must not pin content outside the viewport.
      item.enabled = !motion.matches && height <= innerHeight + 2;
      item.step = Math.max(220, Math.round(innerHeight * .6));
      item.track.classList.toggle("is-pinned", item.enabled);
      item.track.style.height = item.enabled ? `${height + item.count * item.step}px` : "";
      item.track.dataset.pinMode = item.enabled ? "scroll" : "natural";
    }
    queue();
  }
  function choose(event: Event) {
    const detail = (event as CustomEvent<{ section: string; index?: number; mode?: string }>).detail;
    const name = detail.section === "dividend" ? "leadership-dividend" : detail.section;
    const item = tracks.find((entry) => entry.name === name);
    if (!item?.enabled) return;
    const index = detail.mode === "benefits" ? 3 : detail.mode === "return" ? 4 : detail.index ?? 0;
    const top = window.scrollY + item.track.getBoundingClientRect().top;
    window.scrollTo({ top: top + index * item.step + 2, behavior: "instant" });
    item.index = -1;
    queue();
  }
  addEventListener("scroll", queue, { passive: true, signal: abort.signal });
  addEventListener("resize", measure, { passive: true, signal: abort.signal });
  motion.addEventListener("change", measure, { signal: abort.signal });
  root.addEventListener("homepage:choice", choose, { signal: abort.signal });
  const resize = new ResizeObserver(measure);
  tracks.forEach(({ section }) => resize.observe(section));
  measure();
  return () => {
    abort.abort();
    resize.disconnect();
    cancelAnimationFrame(frame);
    tracks.forEach(({ section, track }) => {
      track.replaceWith(section);
      delete section.dataset.scrollStage;
    });
  };
}
