import { useEffect, useMemo, useRef } from "react";
import type { ClientStory } from "@/data/rebuildProof";
import readyFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import communicationsFilm from "@/assets/films/sep2026/communications-compose-loop-r01-20s-720p-web-sealed.mp4";
import opportunitiesFilm from "@/assets/films/sep2026/opportunities-resolve-loop-r01-20s-720p-web-sealed.mp4";
import workshopFilm from "@/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import signalsFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import readyPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import communicationsPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp";
import opportunitiesPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/opportunities-resolve-loop-r01-20s-720p-web-sealed-poster.webp";
import workshopPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/quiet-workshop-growth-loop-r01-20s-720p-web-sealed-poster.webp";
import evidencePoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp";
import signalsPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp";
import proofFieldCss from "../../../../prototypes/website-redesign-recovery/case-study-browsing-r2/styles.css?raw";

type StoryPresentation = {
  short: string;
  film: string;
  poster: string;
  offset: number;
  filmPosition: string;
};

const PRESENTATION: Record<string, StoryPresentation> = {
  "day-one": { short: "Day one", film: readyFilm, poster: readyPoster, offset: 1.4, filmPosition: "51% 52%" },
  "sellable-expertise": { short: "Sellable expertise", film: communicationsFilm, poster: communicationsPoster, offset: 3.8, filmPosition: "61% 48%" },
  "simple-product": { short: "Simple product", film: opportunitiesFilm, poster: opportunitiesPoster, offset: 6.2, filmPosition: "50% 49%" },
  "hand-back": { short: "Hand it back", film: workshopFilm, poster: workshopPoster, offset: 8.6, filmPosition: "48% 47%" },
  "own-system": { short: "Own the system", film: evidenceFilm, poster: evidencePoster, offset: 10.8, filmPosition: "44% 45%" },
  "team-decides": { short: "Team decides", film: signalsFilm, poster: signalsPoster, offset: 13.2, filmPosition: "36% 52%" },
  "business-first": { short: "Business first", film: readyFilm, poster: readyPoster, offset: 15.4, filmPosition: "74% 50%" },
  "market-moves": { short: "Market moves", film: signalsFilm, poster: signalsPoster, offset: 17.1, filmPosition: "74% 54%" },
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[character] ?? character));


function scopeCss(source: string, root: string) {
  /* Comments come out before anything else is parsed. The transform below finds
     rules by looking for the next brace, so a comment sitting between two rules
     is read as part of the following selector — which means a stylesheet that
     documents its own sections emits `<root> /* note *\/ .selector`, a selector
     that matches nothing. A banner comment above an @media rule is worse: the
     header no longer starts with "@media", the whole block takes the plain-rule
     path, and every rule inside it ships unscoped and silently inert. That is
     how the entire phone composition came to be absent from the built page
     while the stylesheet on disk was correct. A stray brace inside a comment
     (`#record-{id}`) desynchronises the same counter. */
  const withoutComments = source.replace(/\/\*[\s\S]*?\*\//g, "");
  const withoutFonts = withoutComments.replace(/@font-face\s*\{[^}]*\}/g, "");
  const transform = (input: string): string => {
    let output = "";
    let cursor = 0;
    while (cursor < input.length) {
      const open = input.indexOf("{", cursor);
      if (open === -1) return output + input.slice(cursor);
      const header = input.slice(cursor, open);
      let depth = 1;
      let close = open + 1;
      while (close < input.length && depth > 0) {
        if (input[close] === "{") depth += 1;
        if (input[close] === "}") depth -= 1;
        close += 1;
      }
      const body = input.slice(open + 1, close - 1);
      const trimmed = header.trim();
      if (trimmed.startsWith("@media") || trimmed.startsWith("@supports") || trimmed.startsWith("@layer")) {
        output += `${trimmed}{${transform(body)}}`;
      } else if (trimmed.startsWith("@")) {
        output += `${trimmed}{${body}}`;
      } else {
        const selectors = trimmed.split(",").map((selector) => {
          const clean = selector.trim();
          if (clean === ":root" || clean === "html" || clean === "body") return root;
          if (clean === "*") return `${root} *`;
          return `${root} ${clean}`;
        }).join(",");
        output += `${selectors}{${body}}`;
      }
      cursor = close;
    }
    return output;
  };
  return `${transform(withoutFonts)}
${root} .site-head-space{min-height:var(--mm-header-height)}
/* The header is fixed, so any scroll the browser performs on our behalf --
   focusing a control, following an anchor, an engine scrolling an element into
   view before a tap -- can land a control underneath it. At a short landscape
   viewport that is exactly what happens to the rail dock: it is on screen, the
   browser scrolls it to the top of the page, and the masthead is then over it.
   Reserving the measured header height as scroll margin makes those scrolls
   stop below the chrome instead of behind it. */
${root} .region,${root} .mobile-dock,${root} .mobile-dock button,${root} .expanded{scroll-margin-top:calc(var(--mm-header-height) + 12px)}
${root} .proof-shell{grid-template-rows:var(--mm-header-height) auto minmax(0,1fr)}
${root} .field-intro{grid-template-columns:minmax(0,1fr)}
@media(min-width:861px){
  ${root} .field-intro,${root} .proof-field{width:min(var(--mm-shell-max),calc(100% - (2 * max(var(--mm-gutter),var(--mm-safe-left),var(--mm-safe-right)))));margin-inline:auto}
  ${root} .field-intro{padding-inline:0}
}
@media(max-width:860px){
  ${root} .site-head-space{height:var(--mm-header-height)}
  ${root} .proof-shell{grid-template-rows:var(--mm-header-height) auto minmax(0,1fr) auto auto}
  ${root} .field-intro{width:calc(100% - (2 * max(var(--mm-gutter),var(--mm-safe-left),var(--mm-safe-right))));margin-inline:auto;padding-inline:0}
  ${root} .expanded-head h2{overflow-wrap:anywhere}
  ${root} .mobile-dock{padding-bottom:calc(env(safe-area-inset-bottom,0px) + var(--mm-cookie-reserve,0px))}
}`;
}

/**
 * StoryFigureView, emitted as markup.
 *
 * The field builds its regions as a string, so the figure has to be a string
 * too. Every number below is read from the record's own `story.figure`; the
 * class names and element order match the React component exactly, so the two
 * render identically and the stylesheet serves both.
 */
function storyFigureMarkup(figure: ClientStory["figure"]) {
  // A record with nothing to say at either end renders no label row, rather
  // than a row of two empty spans reserving the space where words would go.
  // business-first is the one that carries none: its endpoints would repeat its
  // own headline, and the two obvious phrasings are on the field's banned-copy
  // list. The absence is the decision; this stops it looking like an omission.
  const labels = (from: string, to: string) => (from || to
    ? `<p><span>${escapeHtml(from)}</span><span>${escapeHtml(to)}</span></p>`
    : "");
  if (figure.shape === "span") {
    const resolved = Math.max(3, Math.sqrt(figure.to / figure.from) * 100);
    return `<div class="mm-fig mm-fig-span" data-fig="span" data-resolved="${resolved.toFixed(2)}">
      <span class="mm-fig-bar is-was" style="width:100%"></span>
      <span class="mm-fig-bar is-now" style="width:${resolved.toFixed(2)}%"></span>
      ${labels(figure.fromLabel, figure.toLabel)}
    </div>`;
  }
  if (figure.shape === "focus") {
    const total = Math.max(figure.from, figure.to);
    const marks = Array.from({ length: total }, (_, i) => `<i class="${i < figure.to ? "is-kept" : "is-dim"}"></i>`).join("");
    return `<div class="mm-fig mm-fig-focus" data-fig="focus" data-kept="${figure.to}">
      <div class="mm-fig-marks" aria-hidden="true">${marks}</div>
      <p class="mm-fig-pair"><b>${figure.from}</b><span aria-hidden="true">→</span><b>${figure.to}</b></p>
      ${labels(figure.fromLabel, figure.toLabel)}
    </div>`;
  }
  if (figure.shape === "cadence") {
    const cells = Array.from({ length: 28 }, (_, i) => `<i class="${i < figure.to ? "is-on" : ""}"></i>`).join("");
    return `<div class="mm-fig mm-fig-cadence" data-fig="cadence" data-from="${figure.from}" data-to="${figure.to}">
      <div class="mm-fig-month" aria-hidden="true">${cells}</div>
      ${labels(figure.fromLabel, figure.toLabel)}
    </div>`;
  }
  if (figure.shape === "count") {
    return `<div class="mm-fig mm-fig-count" data-fig="count" data-value="${figure.value}">
      <p class="mm-fig-value">${figure.value}</p>
      <p class="mm-fig-label">${escapeHtml(figure.label)}</p>
      <p class="mm-fig-within">${escapeHtml(figure.within)}</p>
    </div>`;
  }
  const scatter = [[8, 30], [26, 12], [44, 38], [62, 18], [80, 34], [98, 22]];
  const marks = scatter.map((_, i) => `<rect class="mm-fig-mark is-set" x="${(14 + i * 18.6).toFixed(1)}" y="28" width="12" height="4" rx="1"/>`).join("");
  return `<div class="mm-fig mm-fig-offer" data-fig="offer" data-scatter="${scatter.map(([x, y]) => `${x},${y}`).join(" ")}">
    <svg viewBox="0 0 120 56" aria-hidden="true" preserveAspectRatio="none">
      <rect class="mm-fig-frame" x="4" y="8" width="112" height="40" rx="2"/>${marks}
    </svg>
    ${labels(figure.before, figure.after)}
  </div>`;
}

/**
 * Passages the phone card cannot hold at a size worth reading.
 *
 * The record is never edited. The run named here is wrapped and hidden on the
 * phone alone, with an ellipsis shown in its place; desktop renders every word
 * and the full quotation stays in the DOM byte-exact either way. Each entry
 * must be the literal tail of the passage it belongs to, and the build throws
 * if a record is reworded out from under it rather than quietly showing a
 * sentence that no longer ends where it should.
 */
const PHONE_ELISION: Record<string, { quote?: string; outcome?: string }> = {
  "day-one": { outcome: ", and build comes back for review in twelve months, once the data is stronger." },
  "hand-back": { quote: ". I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need." },
  "own-system": { quote: ". I used to post once a month; now it's most days because I focus on building an AI engine around what I do and what I get bottlenecked by. It's helping me be seen by my customers." },
  "team-decides": { quote: ". Cheers to Krish for leading and landing." },
  "market-moves": { quote: ". We trusted he would deliver." },
};

function elided(text: string, tail: string | undefined, id: string, field: string) {
  if (!tail) return escapeHtml(text);
  if (!text.endsWith(tail)) throw new Error(`Phone elision for ${id} no longer matches the ${field} in the record`);
  const kept = text.slice(0, text.length - tail.length);
  return `${escapeHtml(kept)}<span class="q-cut">${escapeHtml(tail)}</span><span class="q-gap" aria-hidden="true">…</span>`;
}

function storyMarkup(story: ClientStory, index: number) {
  const presentation = PRESENTATION[story.id];
  if (!presentation) throw new Error(`No proof-field presentation for ${story.id}`);
  const position = String(index + 1).padStart(2, "0");
  const cut = PHONE_ELISION[story.id] ?? {};
  const id = escapeHtml(story.id);
  return `<li class="region" data-index="${index}" data-story="${id}">
    <video class="region-film" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-film-src="${escapeHtml(presentation.film)}" data-offset="${presentation.offset}" style="object-position:${presentation.filmPosition}" poster="${escapeHtml(presentation.poster)}"></video>
    <a class="region-hit" href="#record-${id}" aria-controls="record-${id}" data-open-story="${id}">
      <span class="region-kicker"><b>${position}</b></span>
      <span class="region-copy"><small>${escapeHtml(presentation.short)}</small><strong>${escapeHtml(story.result)}</strong><cite>${escapeHtml(story.attribution)}</cite></span>
    </a>
    <section class="expanded" id="record-${id}" aria-labelledby="title-${id}">
      <button class="expanded-close" type="button" data-close-story aria-label="Close this record, return to all eight"><span aria-hidden="true">✕</span></button>
      <header class="expanded-head"><p>${position} / 08 · ${escapeHtml(story.title)}</p><h2 id="title-${id}" tabindex="-1">${escapeHtml(story.result)}</h2></header>
      <div class="expanded-visual">${storyFigureMarkup(story.figure)}</div>
      <div class="expanded-copy">
        <p>${elided(story.outcome, cut.outcome, story.id, "outcome")}</p>
        <blockquote><p>${elided(story.quote, cut.quote, story.id, "quote")}</p><cite>${escapeHtml(story.attribution)}</cite></blockquote>
      </div>
      <footer class="expanded-actions"><div><button type="button" data-toggle-phase>Show starting point</button></div><span class="position">Case archive · ${position} of 08</span><button type="button" data-close-story>All eight</button></footer>
    </section>
  </li>`;
}

export function CaseProofField({ stories }: { stories: ClientStory[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const styles = useMemo(() => scopeCss(proofFieldCss, ".mm-case-proof-s2"), []);
  const markup = useMemo(() => stories.map(storyMarkup).join(""), [stories]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const shell = root.querySelector<HTMLElement>(".proof-shell");
    const list = root.querySelector<HTMLElement>(".region-list");
    const dock = root.querySelector<HTMLElement>(".mobile-dock");
    const live = root.querySelector<HTMLElement>("[data-live]");
    if (!shell || !list || !dock || !live) return;

    const regions = Array.from(root.querySelectorAll<HTMLElement>(".region"));
    const openButtons = Array.from(root.querySelectorAll<HTMLAnchorElement>("[data-open-story]"));
    const films = Array.from(root.querySelectorAll<HTMLVideoElement>(".region-film"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: EventTarget & { saveData?: boolean } }).connection;
    let saveData = Boolean(connection?.saveData);
    let selected: string | null = null;
    let phase: "start" | "result" = "result";
    let focusIndex = 0;
    let originIndex = 0;
    let filmBatch = 0;
    let priorityFilm: HTMLVideoElement | null = null;
    const cleanups: Array<() => void> = [];
    const listen = <K extends keyof WindowEventMap>(target: Window | Document | MediaQueryList | EventTarget, type: K | string, handler: EventListenerOrEventListenerObject, options?: AddEventListenerOptions) => {
      target.addEventListener(type as string, handler, options);
      cleanups.push(() => target.removeEventListener(type as string, handler, options));
    };
    const isCompact = () => window.matchMedia("(max-width: 860px)").matches;
    const filmMayMove = () => !reducedMotion.matches && !saveData;
    const ensureFilmSources = () => films.forEach((film) => {
      if (!filmMayMove() || film.src) return;
      const source = film.dataset.filmSrc;
      if (source) film.src = source;
    });
    const removeFilmSources = () => films.forEach((film) => {
      film.pause();
      film.removeAttribute("src");
      film.load();
    });
    const filmIsVisible = (film: HTMLVideoElement) => {
      const region = film.closest<HTMLElement>(".region");
      const hit = region?.querySelector<HTMLElement>(".region-hit");
      if (!region || !hit || getComputedStyle(region).display === "none" || getComputedStyle(hit).display === "none") return false;
      const rect = region.getBoundingClientRect();
      return rect.right > 0 && rect.bottom > 0 && rect.left < innerWidth && rect.top < innerHeight;
    };
    const syncFilms = () => {
      const moving = filmMayMove() && document.visibilityState === "visible";
      shell.dataset.filmMotion = moving ? "moving" : "still";
      if (!moving) {
        films.forEach((film) => { film.classList.remove("is-moving"); film.pause(); });
        if (!filmMayMove()) removeFilmSources();
        return;
      }
      ensureFilmSources();
      const visibleFilms = films.filter(filmIsVisible);
      const limit = isCompact() ? 2 : 4;
      const ordered = visibleFilms.length ? visibleFilms.map((_, index) => visibleFilms[(index + filmBatch) % visibleFilms.length]) : [];
      const active = new Set(priorityFilm && visibleFilms.includes(priorityFilm)
        ? [priorityFilm, ...ordered.filter((film) => film !== priorityFilm).slice(0, limit - 1)]
        : ordered.slice(0, limit));
      films.forEach((film) => {
        const shouldPlay = active.has(film);
        film.classList.toggle("is-moving", shouldPlay);
        if (shouldPlay) void film.play().catch(() => undefined);
        else film.pause();
      });
    };
    const setOffsets = () => films.forEach((film) => {
      const setOffset = () => {
        const offset = Number(film.dataset.offset || 0);
        if (Number.isFinite(film.duration) && film.duration > 0) film.currentTime = Math.min(offset, Math.max(0, film.duration - 0.1));
      };
      if (film.readyState >= 1) setOffset();
      else listen(film, "loadedmetadata", setOffset as EventListener, { once: true });
    });
    const filmObserver = new IntersectionObserver(syncFilms, { rootMargin: "80px" });
    regions.forEach((region) => filmObserver.observe(region));
    cleanups.push(() => filmObserver.disconnect());
    regions.forEach((region) => {
      const film = region.querySelector<HTMLVideoElement>(".region-film");
      if (!film) return;
      listen(region, "pointerenter", () => { priorityFilm = film; syncFilms(); });
      listen(region, "pointerleave", () => { if (priorityFilm === film) priorityFilm = null; syncFilms(); });
      listen(region, "focusin", () => { priorityFilm = film; syncFilms(); });
      listen(region, "focusout", () => { if (priorityFilm === film) priorityFilm = null; syncFilms(); });
    });
    const rotation = window.setInterval(() => {
      if (!filmMayMove() || document.visibilityState !== "visible" || priorityFilm) return;
      filmBatch += isCompact() ? 2 : 4;
      syncFilms();
    }, 6000);
    cleanups.push(() => window.clearInterval(rotation));

    const hashState = () => {
      const match = location.hash.match(/^#story=([^&]+)(?:&phase=(start|result))?$/);
      const story = match && stories.some((item) => item.id === match[1]) ? match[1] : null;
      return { story, phase: (match?.[2] === "start" ? "start" : "result") as "start" | "result" };
    };
    const setRoving = (index: number) => {
      focusIndex = Math.max(0, Math.min(stories.length - 1, index));
      openButtons.forEach((button, buttonIndex) => {
        button.tabIndex = buttonIndex === focusIndex ? 0 : -1;
        if (!button.hasAttribute("aria-expanded")) button.setAttribute("aria-expanded", "false");
      });
    };
    const animateLayout = (mutate: () => void) => {
      if (reducedMotion.matches) { mutate(); return; }
      const before = new Map(regions.map((region) => [region, region.getBoundingClientRect()]));
      mutate();
      requestAnimationFrame(() => regions.forEach((region) => {
        if (getComputedStyle(region).display === "none") return;
        const first = before.get(region);
        const last = region.getBoundingClientRect();
        if (!first || !last.width || !last.height) return;
        region.animate([
          { transformOrigin: "0 0", transform: `translate(${first.left - last.left}px,${first.top - last.top}px) scale(${first.width / last.width},${first.height / last.height})` },
          { transformOrigin: "0 0", transform: "none" },
        ], { duration: 520, easing: "cubic-bezier(.2,.8,.2,1)" });
      }));
    };
    const writeUrl = (story: string | null, nextPhase: "start" | "result", mode: "push" | "replace" = "push") => {
      const url = story ? `#story=${story}&phase=${nextPhase}` : "#overview";
      history[mode === "replace" ? "replaceState" : "pushState"]({ story, phase: nextPhase }, "", url);
    };
    const setFigure = (fig: HTMLElement, atResult: boolean) => {
      const kind = fig.dataset.fig;
      if (kind === "span") {
        const now = fig.querySelector<HTMLElement>(".mm-fig-bar.is-now");
        if (now) now.style.width = `${atResult ? Number(fig.dataset.resolved || 0) : 2}%`;
        return;
      }
      if (kind === "focus") {
        const kept = Number(fig.dataset.kept || 0);
        fig.querySelectorAll<HTMLElement>(".mm-fig-marks i").forEach((mark, index) => {
          mark.className = atResult ? (index < kept ? "is-kept" : "is-dim") : "";
        });
        const pair = fig.querySelectorAll<HTMLElement>(".mm-fig-pair b");
        if (pair.length === 2) pair[1].style.opacity = atResult ? "1" : ".28";
        return;
      }
      if (kind === "cadence") {
        const on = atResult ? Number(fig.dataset.to || 0) : Number(fig.dataset.from || 0);
        fig.querySelectorAll<HTMLElement>(".mm-fig-month i").forEach((cell, index) => {
          cell.className = index < on ? "is-on" : "";
        });
        return;
      }
      if (kind === "count") {
        const node = fig.querySelector<HTMLElement>(".mm-fig-value");
        if (node) node.textContent = String(atResult ? Number(fig.dataset.value || 0) : 0);
        return;
      }
      if (kind === "offer") {
        const scatter = (fig.dataset.scatter || "").trim().split(/\s+/).map((pair) => pair.split(",").map(Number));
        fig.querySelectorAll<SVGRectElement>(".mm-fig-mark").forEach((mark, index) => {
          const start = scatter[index] ?? [8, 28];
          mark.setAttribute("x", atResult ? String(14 + index * 18.6) : String(start[0]));
          mark.setAttribute("y", atResult ? "28" : String(start[1]));
          mark.setAttribute("width", atResult ? "12" : "4");
          mark.classList.toggle("is-set", atResult);
        });
      }
    };
    const applyPhase = (nextPhase: "start" | "result", announce = true) => {
      phase = nextPhase;
      shell.dataset.phase = phase;
      const activeId = selected;
      if (!activeId) return;
      const selectedRegion = root.querySelector<HTMLElement>(`[data-story="${activeId}"]`);
      if (!selectedRegion) return;
      const expanded = selectedRegion.querySelector<HTMLElement>(".expanded");
      if (!expanded) return;
      expanded.querySelectorAll<HTMLElement>("[data-fig]").forEach((fig) => setFigure(fig, phase === "result"));
      const button = expanded.querySelector<HTMLButtonElement>("[data-toggle-phase]");
      if (button) {
        button.textContent = phase === "result" ? "Show starting point" : "Show the result";
        button.setAttribute("aria-pressed", phase === "result" ? "false" : "true");
      }
      if (announce) live.textContent = `${PRESENTATION[activeId]?.short}: ${phase === "result" ? "recorded result" : "starting point"}.`;
    };
    const openStory = (id: string, nextPhase: "start" | "result" = "result", options: { originIndex?: number; fromHistory?: boolean; replace?: boolean } = {}) => {
      const index = stories.findIndex((story) => story.id === id);
      if (index < 0) return;
      originIndex = options.originIndex ?? index;
      selected = id;
      phase = nextPhase;
      const side = [1, 2, 4, 7].includes(index) ? "right" : "left";
      animateLayout(() => {
        shell.dataset.mode = "story";
        shell.dataset.side = side;
        regions.forEach((region, regionIndex) => {
          const active = region.dataset.story === id;
          region.classList.toggle("is-selected", active);
          region.querySelector<HTMLElement>(".region-hit")?.setAttribute("aria-expanded", String(active));
          const open = region.querySelector<HTMLAnchorElement>(".region-hit");
          if (open) open.tabIndex = active ? -1 : 0;
          if (!active) region.style.order = String(regionIndex < index ? regionIndex : regionIndex - 1);
        });
        const position = root.querySelector<HTMLElement>("[data-mobile-position]");
        if (position) position.textContent = `${String(index + 1).padStart(2, "0")} / 08`;
        applyPhase(phase, false);
      });
      requestAnimationFrame(syncFilms);
      if (!options.fromHistory) writeUrl(id, phase, options.replace ? "replace" : "push");
      sessionStorage.setItem("mindmake-proof-field", JSON.stringify({ story: id, phase, originIndex }));
      requestAnimationFrame(() => {
        root.scrollIntoView({ block: "start", behavior: "auto" });
        requestAnimationFrame(() => root.querySelector<HTMLElement>(`#title-${id}`)?.focus({ preventScroll: true }));
      });
      live.textContent = `Opened case ${index + 1} of 8: ${stories[index].result}`;
    };
    const closeStory = (options: { fromHistory?: boolean; replace?: boolean; focus?: boolean } = {}) => {
      const target = originIndex;
      animateLayout(() => {
        selected = null;
        phase = "result";
        shell.dataset.mode = "overview";
        shell.dataset.phase = "result";
        delete shell.dataset.side;
        regions.forEach((region) => {
          region.classList.remove("is-selected");
          region.style.order = "";
          region.querySelector<HTMLElement>(".region-hit")?.setAttribute("aria-expanded", "false");
        });
        setRoving(target);
      });
      requestAnimationFrame(syncFilms);
      if (!options.fromHistory) writeUrl(null, "result", options.replace ? "replace" : "push");
      if (options.focus !== false) requestAnimationFrame(() => openButtons[target]?.focus({ preventScroll: true }));
      live.textContent = "Returned to all eight case studies.";
    };
    const moveSpatially = (current: number, direction: string) => {
      const currentRect = openButtons[current].getBoundingClientRect();
      const cx = currentRect.left + currentRect.width / 2;
      const cy = currentRect.top + currentRect.height / 2;
      const candidates = openButtons.map((button, index) => {
        if (index === current) return null;
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        const dx = x - cx;
        const dy = y - cy;
        const valid = direction === "left" ? dx < -4 : direction === "right" ? dx > 4 : direction === "up" ? dy < -4 : dy > 4;
        if (!valid) return null;
        const primary = direction === "left" || direction === "right" ? Math.abs(dx) : Math.abs(dy);
        const secondary = direction === "left" || direction === "right" ? Math.abs(dy) : Math.abs(dx);
        return { index, score: primary + secondary * 1.8 };
      }).filter((value): value is { index: number; score: number } => Boolean(value)).sort((a, b) => a.score - b.score);
      return candidates[0]?.index ?? current;
    };

    openButtons.forEach((button, index) => {
      listen(button, "click", ((event: MouseEvent) => {
        event.preventDefault();
        if (isCompact()) { railTo(index); return; }
        openStory(button.dataset.openStory ?? "", "result", { originIndex: index });
      }) as EventListener);
      listen(button, "focus", () => setRoving(index));
      listen(button, "keydown", ((event: KeyboardEvent) => {
        let target: number | null = null;
        if (event.key === "Home") target = 0;
        if (event.key === "End") target = stories.length - 1;
        if (/^[1-8]$/.test(event.key)) target = Number(event.key) - 1;
        if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) target = moveSpatially(index, event.key.replace("Arrow", "").toLowerCase());
        if (event.key === " ") {
          event.preventDefault();
          openStory(button.dataset.openStory ?? "", "result", { originIndex: index });
          return;
        }
        if (target === null) return;
        event.preventDefault();
        setRoving(target);
        openButtons[target].focus();
      }) as EventListener);
    });
    listen(list, "click", ((event: MouseEvent) => {
      const target = event.target as Element;
      const toggle = target.closest<HTMLElement>("[data-toggle-phase]");
      const close = target.closest<HTMLElement>("[data-close-story]");
      if (toggle && selected) {
        applyPhase(phase === "result" ? "start" : "result");
        writeUrl(selected, phase, "replace");
        sessionStorage.setItem("mindmake-proof-field", JSON.stringify({ story: selected, phase, originIndex }));
      }
      if (close) closeStory();
    }) as EventListener);
    const segments = Array.from(root.querySelectorAll<HTMLElement>("[data-rail-segments] i"));
    const position = root.querySelector<HTMLElement>("[data-mobile-position]");
    const railIndex = () => {
      const middle = list.scrollLeft + list.clientWidth / 2;
      let best = 0;
      let bestGap = Infinity;
      regions.forEach((region, index) => {
        const gap = Math.abs(region.offsetLeft + region.offsetWidth / 2 - middle);
        if (gap < bestGap) { bestGap = gap; best = index; }
      });
      return best;
    };
    const syncRail = () => {
      if (!isCompact()) return;
      const index = railIndex();
      if (position) position.textContent = `${String(index + 1).padStart(2, "0")} / 08`;
      segments.forEach((segment, segmentIndex) => segment.classList.toggle("is-on", segmentIndex === index));
    };
    const railTo = (index: number) => {
      const region = regions[Math.max(0, Math.min(regions.length - 1, index))];
      if (!region) return;
      list.scrollTo({
        left: region.offsetLeft - (list.clientWidth - region.offsetWidth) / 2,
        behavior: reducedMotion.matches ? "auto" : "smooth",
      });
    };
    let railFrame = 0;
    listen(list, "scroll", () => {
      window.cancelAnimationFrame(railFrame);
      railFrame = window.requestAnimationFrame(() => { syncRail(); syncFilms(); });
    }, { passive: true } as AddEventListenerOptions);
    listen(root.querySelector<HTMLElement>("[data-mobile-prev]")!, "click", () => railTo(railIndex() - 1));
    listen(root.querySelector<HTMLElement>("[data-mobile-next]")!, "click", () => railTo(railIndex() + 1));
    listen(document, "keydown", ((event: KeyboardEvent) => {
      if (event.key === "Escape" && selected) { event.preventDefault(); closeStory(); }
    }) as EventListener);
    listen(window, "popstate", () => {
      const state = hashState();
      if (state.story) openStory(state.story, state.phase, { fromHistory: true, originIndex: stories.findIndex((story) => story.id === state.story) });
      else if (selected) closeStory({ fromHistory: true });
    });
    listen(window, "resize", () => { dock.hidden = !isCompact(); syncRail(); syncFilms(); });
    listen(document, "visibilitychange", syncFilms);
    listen(reducedMotion, "change", () => { if (filmMayMove()) setOffsets(); syncFilms(); });
    if (connection) listen(connection, "change", () => { saveData = Boolean(connection.saveData); if (filmMayMove()) setOffsets(); syncFilms(); });

    dock.hidden = !isCompact();
    syncRail();
    setRoving(0);
    const initial = hashState();
    if (initial.story) openStory(initial.story, initial.phase, { fromHistory: true, originIndex: stories.findIndex((story) => story.id === initial.story) });
    else if (location.hash === "" || location.hash === "#overview") history.replaceState({ story: null, phase: "result" }, "", "#overview");
    setOffsets();
    syncFilms();

    return () => {
      cleanups.reverse().forEach((cleanup) => cleanup());
      films.forEach((film) => film.pause());
    };
  }, [stories]);

  return (
    <div ref={rootRef} className="mm-case-proof-s2">
      {/* HTML style is RAWTEXT: entities emitted for a React text child are not
          decoded by the HTML parser. Keep this trusted, repository-owned CSS
          identical on the server and client so hydration preserves the page. */}
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <section className="proof-shell" data-mode="overview" data-phase="result" aria-labelledby="fieldTitle">
        <div className="site-head-space" aria-hidden="true" />
        <section className="field-intro">
          <div>
            <h1 id="fieldTitle">Proof you can inspect.</h1>
          </div>
        </section>
        <section className="proof-field" aria-label="Eight client stories" data-copy-boundary>
          <ol className="region-list" dangerouslySetInnerHTML={{ __html: markup }} />
        </section>
        {/* Eight marks, the current one lit. It ships in the served document so
            the rail reads as a rail before any script runs, and so does the
            dock: the phone's controls are not chrome that appears once
            something is open, because on the phone nothing is closed. */}
        <div className="rail-segments" aria-hidden="true" data-rail-segments>
          {Array.from({ length: 8 }, (_, index) => <i className={index === 0 ? "is-on" : undefined} key={index} />)}
        </div>
        <nav className="mobile-dock" aria-label="Case study controls">
          <button type="button" data-mobile-prev aria-label="Previous record">←</button>
          <span data-mobile-position>01 / 08</span>
          <button type="button" data-mobile-next aria-label="Next record">→</button>
        </nav>
        <p className="sr-only" aria-live="polite" data-live />
      </section>
    </div>
  );
}
