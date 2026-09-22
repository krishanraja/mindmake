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
import proofFieldCss from "../../../../prototypes/website-redesign-recovery/case-study-browsing/styles.css?raw";

type MechanismKind = "span" | "offer" | "pilots" | "handoff" | "cadence" | "decisions" | "switches" | "route";

type StoryPresentation = {
  short: string;
  before: string;
  after: string;
  kind: MechanismKind;
  film: string;
  poster: string;
  offset: number;
  filmPosition: string;
};

const PRESENTATION: Record<string, StoryPresentation> = {
  "day-one": { short: "Day one", before: "Two quarters refereeing the argument", after: "One day in the room", kind: "span", film: readyFilm, poster: readyPoster, offset: 1.4, filmPosition: "51% 52%" },
  "sellable-expertise": { short: "Sellable expertise", before: "Ideas everyone respected", after: "One offer, and a plan to launch it", kind: "offer", film: communicationsFilm, poster: communicationsPoster, offset: 3.8, filmPosition: "61% 48%" },
  "simple-product": { short: "Simple product", before: "Inside the thirty days", after: "2 pilots signed", kind: "pilots", film: opportunitiesFilm, poster: opportunitiesPoster, offset: 6.2, filmPosition: "50% 49%" },
  "hand-back": { short: "Hand it back", before: "5 videos shipped in week one of eight", after: "Left in the founder's hands", kind: "handoff", film: workshopFilm, poster: workshopPoster, offset: 8.6, filmPosition: "48% 47%" },
  "own-system": { short: "Own the system", before: "About once a month", after: "Most days", kind: "cadence", film: evidenceFilm, poster: evidencePoster, offset: 10.8, filmPosition: "44% 45%" },
  "team-decides": { short: "Team decides", before: "Fourteen competing vendors", after: "Three decisions", kind: "decisions", film: signalsFilm, poster: signalsPoster, offset: 13.2, filmPosition: "36% 52%" },
  "business-first": { short: "Business first", before: "", after: "", kind: "switches", film: readyFilm, poster: readyPoster, offset: 15.4, filmPosition: "74% 50%" },
  "market-moves": { short: "Market moves", before: "Selling the way the old web paid", after: "A paid test with a major US publisher", kind: "route", film: signalsFilm, poster: signalsPoster, offset: 17.1, filmPosition: "74% 54%" },
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (character) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
}[character] ?? character));

function mechanismGlyph(kind: MechanismKind, large = false) {
  const view = large ? "0 0 520 240" : "0 0 220 74";
  const stroke = "currentColor";
  const mint = "#87e7bd";
  const paper = "#eadcc1";
  const body: Record<MechanismKind, string> = {
    span: `<g class="phase-a" fill="none" stroke="${stroke}" stroke-width="${large ? 4 : 2}"><path d="M${large ? 32 : 14} ${large ? 86 : 29}H${large ? 464 : 202}"/><path d="M${large ? 32 : 14} ${large ? 68 : 21}V${large ? 104 : 37}M${large ? 464 : 202} ${large ? 68 : 21}V${large ? 104 : 37}"/></g><g class="phase-b travel"><rect x="${large ? 394 : 170}" y="${large ? 124 : 43}" width="${large ? 70 : 30}" height="${large ? 45 : 16}" fill="${mint}"/><circle cx="${large ? 486 : 211}" cy="${large ? 146 : 51}" r="${large ? 10 : 4}" fill="${paper}"/></g>`,
    offer: `<g class="phase-a" fill="none" stroke="${stroke}" stroke-width="${large ? 3 : 1.5}">${[0, 1, 2, 3].map((i) => `<path d="M${large ? 36 : 16} ${large ? 58 + i * 30 : 18 + i * 11}C${large ? 170 : 72} ${large ? 40 + i * 24 : 14 + i * 9} ${large ? 250 : 110} ${large ? 70 + i * 20 : 25 + i * 8} ${large ? 310 : 134} ${large ? 110 : 38}"/>`).join("")}</g><g class="phase-b travel"><rect x="${large ? 310 : 134}" y="${large ? 76 : 26}" width="${large ? 168 : 72}" height="${large ? 92 : 32}" rx="${large ? 3 : 1}" fill="none" stroke="${mint}" stroke-width="${large ? 4 : 2}"/><path d="M${large ? 326 : 141} ${large ? 104 : 36}H${large ? 456 : 197}M${large ? 326 : 141} ${large ? 128 : 45}H${large ? 426 : 184}" stroke="${mint}" stroke-width="${large ? 3 : 1.5}"/></g>`,
    pilots: `<path class="phase-a" d="M${large ? 60 : 26} ${large ? 176 : 59}A${large ? 150 : 64} ${large ? 150 : 50} 0 0 1 ${large ? 460 : 198} ${large ? 176 : 59}" fill="none" stroke="${stroke}" stroke-width="${large ? 4 : 2}"/><g class="phase-b travel" fill="none" stroke="${mint}" stroke-width="${large ? 5 : 2}"><circle cx="${large ? 220 : 94}" cy="${large ? 116 : 39}" r="${large ? 34 : 13}"/><circle cx="${large ? 340 : 146}" cy="${large ? 96 : 33}" r="${large ? 34 : 13}"/><path d="M${large ? 204 : 87} ${large ? 116 : 39}l${large ? 12 : 5} ${large ? 12 : 5} ${large ? 22 : -10} ${large ? -26 : 9}M${large ? 324 : 139} ${large ? 96 : 33}l${large ? 12 : 5} ${large ? 12 : 5} ${large ? 22 : -10} ${large ? -26 : 9}"/></g>`,
    handoff: `<g class="phase-a" stroke="${stroke}" stroke-width="${large ? 3 : 1.5}"><path d="M${large ? 38 : 16} ${large ? 164 : 56}H${large ? 476 : 205}"/>${Array.from({ length: 8 }, (_, i) => `<path d="M${large ? 52 + i * 54 : 22 + i * 23} ${large ? 152 : 52}V${large ? 176 : 60}"/>`).join("")}${Array.from({ length: 5 }, (_, i) => `<circle cx="${large ? 52 + i * 17 : 22 + i * 8}" cy="${large ? 124 : 42}" r="${large ? 7 : 3}" fill="${paper}"/>`).join("")}</g><g class="phase-b travel" fill="none" stroke="${mint}" stroke-width="${large ? 5 : 2}"><circle cx="${large ? 410 : 176}" cy="${large ? 96 : 33}" r="${large ? 28 : 12}"/><path d="M${large ? 382 : 164} ${large ? 96 : 33}H${large ? 260 : 112}v${large ? 26 : 9}h${large ? 42 : 18}"/></g>`,
    cadence: `<g class="phase-a" fill="none" stroke="${stroke}" stroke-width="${large ? 4 : 2}"><path d="M${large ? 36 : 15} ${large ? 144 : 49}H${large ? 484 : 208}"/><path d="M${large ? 94 : 40} ${large ? 144 : 49}V${large ? 70 : 24}"/></g><g class="phase-b" stroke="${mint}" stroke-width="${large ? 4 : 2}"><path d="M${large ? 36 : 15} ${large ? 144 : 49}H${large ? 484 : 208}"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${large ? 180 + i * 28 : 77 + i * 12} ${large ? 144 : 49}V${large ? (i % 3 === 0 ? 68 : 92) : (i % 3 === 0 ? 23 : 31)}"/>`).join("")}</g>`,
    decisions: `<g class="phase-a" fill="${paper}" opacity=".75">${Array.from({ length: 14 }, (_, i) => { const angle = (i / 14) * Math.PI * 2; const x = (large ? 258 : 110) + Math.cos(angle) * (large ? 150 : 60); const y = (large ? 120 : 37) + Math.sin(angle) * (large ? 80 : 25); return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${large ? 5 : 2.2}"/>`; }).join("")}</g><g class="phase-b travel" fill="none" stroke="${mint}" stroke-width="${large ? 7 : 3}"><path d="M${large ? 258 : 110} ${large ? 120 : 37}L${large ? 420 : 181} ${large ? 54 : 18}"/><path d="M${large ? 258 : 110} ${large ? 120 : 37}L${large ? 438 : 189} ${large ? 120 : 37}"/><path d="M${large ? 258 : 110} ${large ? 120 : 37}L${large ? 420 : 181} ${large ? 188 : 63}"/></g>`,
    switches: `<g transform="translate(${large ? 45 : 19} ${large ? 54 : 17})">${Array.from({ length: 14 }, (_, i) => { const x = (i % 7) * (large ? 58 : 24); const y = Math.floor(i / 7) * (large ? 84 : 28); const off = i > 2; return `<g class="switch ${off ? "is-off" : ""}" transform="translate(${x} ${y})"><rect width="${large ? 34 : 14}" height="${large ? 58 : 20}" rx="${large ? 4 : 2}" fill="none" stroke="${off ? stroke : mint}" stroke-width="${large ? 3 : 1.5}"/><circle cx="${large ? 17 : 7}" cy="${large ? 16 : 6}" r="${large ? 6 : 2.5}" fill="${off ? paper : mint}"/></g>`; }).join("")}</g>`,
    route: `<g fill="none" stroke-width="${large ? 5 : 2}"><path class="phase-a" d="M${large ? 36 : 15} ${large ? 120 : 40}H${large ? 472 : 203}" stroke="${stroke}"/><path class="phase-b" d="M${large ? 36 : 15} ${large ? 120 : 40}H${large ? 210 : 90}Q${large ? 270 : 116} ${large ? 120 : 40} ${large ? 304 : 131} ${large ? 72 : 24}H${large ? 472 : 203}" stroke="${mint}"/><circle class="travel" cx="${large ? 444 : 191}" cy="${large ? 72 : 24}" r="${large ? 12 : 5}" fill="${mint}" stroke="none"/></g>`,
  };
  return `<svg viewBox="${view}" aria-hidden="true" focusable="false">${body[kind]}</svg>`;
}

function scopeCss(source: string, root: string) {
  const withoutFonts = source.replace(/@font-face\s*\{[^}]*\}/g, "");
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
${root} .proof-shell{grid-template-rows:var(--mm-header-height) auto minmax(0,1fr)}
${root} .field-intro{grid-template-columns:minmax(0,1fr)}
@media(min-width:861px){
  ${root} .field-intro,${root} .proof-field{width:min(var(--mm-shell-max),calc(100% - (2 * max(var(--mm-gutter),var(--mm-safe-left),var(--mm-safe-right)))));margin-inline:auto}
  ${root} .field-intro{padding-inline:0}
}
@media(max-width:860px){
  ${root} .site-head-space{height:var(--mm-header-height)}
  ${root} .field-intro,${root} .proof-field{width:calc(100% - (2 * max(var(--mm-gutter),var(--mm-safe-left),var(--mm-safe-right))));margin-inline:auto}
  ${root} .field-intro{padding-inline:0}
  ${root} .proof-shell[data-mode="story"] .proof-field{margin-inline:auto}
  ${root} .region-list{grid-template-rows:repeat(4,minmax(82px,auto))}
  ${root} .region{min-height:82px}
  ${root} .region-hit,${root} .region[data-index="2"] .region-hit,${root} .region[data-index="5"] .region-hit,${root} .region[data-index="6"] .region-hit{position:relative;inset:auto;height:auto;min-height:82px;overflow-wrap:anywhere}
  ${root} .region-copy strong{overflow-wrap:anywhere}
  ${root} .mobile-dock{bottom:var(--mm-cookie-reserve,0px)}
}
@media(max-width:280px){
  ${root} .region-list{grid-template-columns:1fr;grid-template-rows:none}
}`;
}

function storyMarkup(story: ClientStory, index: number) {
  const presentation = PRESENTATION[story.id];
  if (!presentation) throw new Error(`No proof-field presentation for ${story.id}`);
  const position = String(index + 1).padStart(2, "0");
  const endpoints = presentation.before && presentation.after
    ? `<div class="endpoint-labels"><span>${escapeHtml(presentation.before)}</span><span>${escapeHtml(presentation.after)}</span></div>`
    : "";
  return `<li class="region" data-index="${index}" data-story="${escapeHtml(story.id)}">
    <video class="region-film" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1" data-film-src="${escapeHtml(presentation.film)}" data-offset="${presentation.offset}" style="object-position:${presentation.filmPosition}" poster="${escapeHtml(presentation.poster)}"></video>
    <a class="region-hit" href="#record-${escapeHtml(story.id)}" aria-controls="detail-${escapeHtml(story.id)}" data-open-story="${escapeHtml(story.id)}">
      <span class="region-kicker"><b>${position}</b></span>
      <span class="region-copy"><small>${escapeHtml(presentation.short)}</small><strong>${escapeHtml(story.result)}</strong></span>
      <span class="region-glyph phase-result">${mechanismGlyph(presentation.kind)}</span>
    </a>
    <section class="expanded phase-result" id="detail-${escapeHtml(story.id)}" aria-labelledby="title-${escapeHtml(story.id)}" hidden>
      <header class="expanded-head"><p>${position} / 08 · ${escapeHtml(story.title)}</p><h2 id="title-${escapeHtml(story.id)}" tabindex="-1">${escapeHtml(story.result)}</h2></header>
      <div class="expanded-visual"><div class="mechanism">${mechanismGlyph(presentation.kind, true)}</div>${endpoints}</div>
      <div class="expanded-copy"><p>${escapeHtml(story.outcome)}</p></div>
      <footer class="expanded-actions"><div><button type="button" data-toggle-phase>Show starting point</button><a href="#record-${escapeHtml(story.id)}" data-full-case="${escapeHtml(story.id)}">See the source record</a></div><span class="position">Case archive · ${position} of 08</span><button type="button" data-close-story>All eight</button></footer>
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
    const applyPhase = (nextPhase: "start" | "result", announce = true) => {
      phase = nextPhase;
      shell.dataset.phase = phase;
      const activeId = selected;
      if (!activeId) return;
      const selectedRegion = root.querySelector<HTMLElement>(`[data-story="${activeId}"]`);
      if (!selectedRegion) return;
      const expanded = selectedRegion.querySelector<HTMLElement>(".expanded");
      if (!expanded) return;
      expanded.classList.toggle("phase-start", phase === "start");
      expanded.classList.toggle("phase-result", phase === "result");
      const button = expanded.querySelector<HTMLButtonElement>("[data-toggle-phase]");
      if (button) button.textContent = phase === "result" ? "Show starting point" : "Show recorded result";
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
        dock.hidden = !isCompact();
        regions.forEach((region, regionIndex) => {
          const active = region.dataset.story === id;
          region.classList.toggle("is-selected", active);
          region.querySelector<HTMLElement>(".region-hit")?.setAttribute("aria-expanded", String(active));
          const expanded = region.querySelector<HTMLElement>(".expanded");
          if (expanded) expanded.hidden = !active;
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
        dock.hidden = true;
        regions.forEach((region) => {
          region.classList.remove("is-selected");
          region.style.order = "";
          region.querySelector<HTMLElement>(".region-hit")?.setAttribute("aria-expanded", "false");
          const expanded = region.querySelector<HTMLElement>(".expanded");
          if (expanded) expanded.hidden = true;
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
      const fullCase = target.closest<HTMLAnchorElement>("[data-full-case]");
      if (toggle && selected) {
        applyPhase(phase === "result" ? "start" : "result");
        writeUrl(selected, phase, "replace");
        sessionStorage.setItem("mindmake-proof-field", JSON.stringify({ story: selected, phase, originIndex }));
      }
      if (close) closeStory();
      if (fullCase) {
        event.preventDefault();
        const id = fullCase.dataset.fullCase;
        closeStory({ fromHistory: true, focus: false });
        const destination = id ? document.getElementById(`record-${id}`) : null;
        if (destination) {
          history.pushState({ story: null, phase: "result" }, "", `#record-${id}`);
          destination.focus({ preventScroll: true });
          destination.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
        }
      }
    }) as EventListener);
    listen(root.querySelector<HTMLElement>("[data-mobile-back]")!, "click", () => closeStory());
    listen(root.querySelector<HTMLElement>("[data-mobile-prev]")!, "click", () => {
      if (!selected) return;
      const index = stories.findIndex((story) => story.id === selected);
      const next = (index - 1 + stories.length) % stories.length;
      openStory(stories[next].id, "result", { originIndex: next });
    });
    listen(root.querySelector<HTMLElement>("[data-mobile-next]")!, "click", () => {
      if (!selected) return;
      const index = stories.findIndex((story) => story.id === selected);
      const next = (index + 1) % stories.length;
      openStory(stories[next].id, "result", { originIndex: next });
    });
    const visitArchive = (event: Event) => {
      event.preventDefault();
      closeStory({ fromHistory: true, focus: false });
      history.pushState({ story: null, phase: "result" }, "", "#case-archive");
      document.getElementById("case-archive")?.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth" });
    };
    root.querySelectorAll("[data-case-archive]").forEach((link) => listen(link, "click", visitArchive));
    listen(document, "keydown", ((event: KeyboardEvent) => {
      if (event.key === "Escape" && selected) { event.preventDefault(); closeStory(); }
    }) as EventListener);
    listen(window, "popstate", () => {
      const state = hashState();
      if (state.story) openStory(state.story, state.phase, { fromHistory: true, originIndex: stories.findIndex((story) => story.id === state.story) });
      else if (selected) closeStory({ fromHistory: true });
    });
    listen(window, "resize", () => { dock.hidden = !(selected && isCompact()); syncFilms(); });
    listen(document, "visibilitychange", syncFilms);
    listen(reducedMotion, "change", () => { if (filmMayMove()) setOffsets(); syncFilms(); });
    if (connection) listen(connection, "change", () => { saveData = Boolean(connection.saveData); if (filmMayMove()) setOffsets(); syncFilms(); });

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
      <style>{styles}</style>
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
        <nav className="mobile-dock" aria-label="Case study controls" hidden>
          <button type="button" data-mobile-back>All eight</button>
          <button type="button" data-mobile-prev aria-label="Previous case study">←</button>
          <span data-mobile-position>01 / 08</span>
          <button type="button" data-mobile-next aria-label="Next case study">→</button>
          <a href="#case-archive" data-case-archive aria-label="Open the full case-study archive">Archive ↗</a>
        </nav>
        <p className="sr-only" aria-live="polite" data-live />
      </section>
    </div>
  );
}
