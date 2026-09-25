/** Native scrolling owns progression. Never intercept wheel, touch or keyboard. */
/* From r41 the R3 history chapter is the only chapter this pins. The
   new-age leadership chapters after it pin with their own sticky tracks. */
type Chapters = {
  selectStory: (index: number) => void;
};

const EASE = "cubic-bezier(.22,.61,.36,1)";

/* A phone's address bar changes innerHeight as it shows and hides. The initial
   containing block keeps the smaller size, so the step and the pin test hold
   still while the reader scrolls instead of re-laying the track mid-gesture. */
const stableViewport = () => Math.min(innerHeight, document.documentElement.clientHeight || innerHeight);

/* The scroll-driven era change. The words and image are swapped at once, so
   the visible state is always the current one; what moves is only the look of
   the change: the outgoing picture holds on top until the incoming one has
   decoded, then dissolves, and the story lines rise in from the direction of
   travel. */
function crossfade(section: HTMLElement, direction: number, apply: () => void, ghosts: Set<HTMLElement>, alive: () => boolean) {
  const frames = [...section.querySelectorAll<HTMLElement>(".history-frame")].filter(frame => frame.getClientRects().length);
  const held = frames.flatMap(frame => {
    const image = frame.querySelector<HTMLImageElement>("img[data-story-image]");
    if (!image || typeof image.animate !== "function") return [];
    const ghost = image.cloneNode() as HTMLImageElement;
    ghost.removeAttribute("data-story-image");
    ghost.alt = "";
    ghost.setAttribute("aria-hidden", "true");
    ghost.className = "homepage-pin-ghost";
    image.after(ghost);
    ghosts.add(ghost);
    return [{ frame, image, ghost }];
  });
  apply();
  for (const { frame, image, ghost } of held) {
    const lines = [...frame.querySelectorAll<HTMLElement>(".story-copy > .story-meta, .story-copy > h3, .story-copy > p")];
    lines.forEach((line, order) => line.animate(
      [{ opacity: 0, transform: `translateY(${direction * 14}px)` }, { opacity: 1, transform: "none" }],
      { duration: 560, delay: order * 60, easing: EASE, fill: "backwards" },
    ));
    const ready = typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve();
    void ready.then(() => {
      if (!alive() || !ghost.isConnected) return;
      image.animate([{ transform: "scale(1.035)" }, { transform: "scale(1)" }], { duration: 1100, easing: EASE });
      ghost.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 520, easing: "ease", fill: "forwards" })
        .finished.catch(() => undefined).then(() => { ghost.remove(); ghosts.delete(ghost); });
    });
  }
}

export function mountPinnedChapters(root: HTMLElement, chapters: Chapters) {
  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  const abort = new AbortController();
  const ghosts = new Set<HTMLElement>();
  const alive = () => !abort.signal.aborted;
  let frame = 0;
  const tracks = ([
    { name: "history", count: 4, apply: (index: number) => chapters.selectStory(index) },
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
        const from = item.index;
        item.index = index;
        if (from < 0) item.apply(index);
        else crossfade(item.section, index > from ? 1 : -1, () => item.apply(index), ghosts, alive);
        item.section.dataset.scrollStage = String(index);
      }
    }
  }
  function queue() { if (!frame) frame = requestAnimationFrame(update); }
  function measure() {
    const viewport = stableViewport();
    for (const item of tracks) {
      const height = item.section.getBoundingClientRect().height;
      // Short landscape / enlarged text must not pin content outside the viewport.
      const enabled = !motion.matches && height <= viewport + 2;
      if (enabled !== item.enabled) item.index = -1;
      item.enabled = enabled;
      if (!enabled) delete item.section.dataset.scrollStage;
      item.step = Math.max(220, Math.round(viewport * .6));
      item.track.classList.toggle("is-pinned", item.enabled);
      item.track.style.height = item.enabled ? `${height + item.count * item.step}px` : "";
      item.track.dataset.pinMode = item.enabled ? "scroll" : "natural";
    }
    queue();
  }
  function choose(event: Event) {
    const detail = (event as CustomEvent<{ section: string; index?: number }>).detail;
    const item = tracks.find((entry) => entry.name === detail.section);
    if (!item) return;
    // Natural-mode controls can change the scene without moving the track.
    item.index = -1;
    if (!item.enabled) return;
    const index = detail.index ?? 0;
    const top = window.scrollY + item.track.getBoundingClientRect().top;
    window.scrollTo({ top: top + index * item.step + 2, behavior: "instant" });
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
    ghosts.forEach(ghost => ghost.remove());
    ghosts.clear();
    tracks.forEach(({ section, track }) => {
      track.replaceWith(section);
      delete section.dataset.scrollStage;
    });
  };
}
