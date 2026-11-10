import { clientStories } from "@/data/rebuildProof";
import { publishableTestimonials } from "@/data/testimonials";
import { START_LABEL } from "@/lib/publicLinks";
import { placeholderFor, srcsetFor } from "@/lib/responsiveImages";
import type { LeadershipStory } from "./leadershipChapters";

/**
 * What the AI Brain makes possible, found rather than scrolled (prototype for
 * Krish, 15 October 2026: "on mobile I see just an endless list of stuff,
 * which overwhelms me … help me think about this like the CEO of Apple").
 *
 * The reader answers one question about themselves and gets the three stories
 * that fit, one card at a time, with the whole story a tap away. One card is
 * one client: the story and the outcome it led to ("Maybe we figure out a way
 * of just having a story and an outcome mapped to one another", Krish, 15
 * October 2026). Where the client's result is on the record the card links to
 * it, and every story ends in the free AI brief opened at its door.
 *
 * Without scripts every situation and every card is on the page, each card a
 * <details> that opens in place; with scripts the situations become tabs, the
 * cards a rail, and a card opens as a sheet.
 */

interface Situation {
  id: string;
  label: string;
  door: "brain" | "gtm";
  /** Stories by the first words of their heading, so a reworded heading fails here rather than dropping a card. */
  cards: readonly string[];
}

export const SITUATIONS: readonly Situation[] = [
  { id: "ideas", label: "Getting your ideas out", door: "brain", cards: ["A founder who posted", "A CEO who hates writing", "Leadership updates become"] },
  { id: "change", label: "Seeing what is changing", door: "brain", cards: ["An insurance leader", "An investor buying", "A CEO who read many newsletters", "A leader who only heard from inside", "A change in market pricing"] },
  { id: "hands", label: "Getting hands-on again", door: "brain", cards: ["A head of operations", "Someone new to AI", "A CRO who hates the numbers"] },
  { id: "team", label: "Keeping your team in step", door: "gtm", cards: ["Teams working on the same account", "One person corrected it once", "A team's account plans"] },
  { id: "calls", label: "Making the big AI calls", door: "gtm", cards: ["Two quarters of argument", "A respected advisory firm", "A publisher weighing up", "A broadcaster stopped"] },
];

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const plain = (text: string) => text.replaceAll("\u00a0", " ");

export const storyByStart = (stories: readonly LeadershipStory[], start: string) => {
  const found = stories.find((story) => plain(story.heading).startsWith(start));
  if (!found) throw new Error(`No story starts "${start}"`);
  return found;
};

/* `data-mm-native` keeps the page-transition handler (RouteTransitions) from
   taking the click first: on any page but the homepage it would otherwise
   carry the reader to / before the finder could open the brief in place. */
const startLink = (door: "brain" | "gtm") =>
  `<a class="finder-start" href="/?start=${door}" data-finder-start="${door}" data-mm-native>${START_LABEL} <span aria-hidden="true">→</span></a>`;

function card(story: LeadershipStory, door: "brain" | "gtm", id: string) {
  const record = story.record ? clientStories.find((entry) => entry.id === story.record) : undefined;
  if (story.record && !record) throw new Error(`No result on the record with id "${story.record}"`);
  const voice = story.quote ? publishableTestimonials.find((entry) => entry.id === story.quote!.testimonialId) : undefined;
  /* A phone downloads the size its card shows, over a blurred placeholder of
     the scene (Krish, 2026-11-04: pictures took up to ten seconds). */
  const srcset = srcsetFor(story.scene, 800);
  const placeholder = placeholderFor(story.scene);
  const plate = `<img src="${esc(story.scene)}"${srcset ? ` srcset="${esc(srcset)}" sizes="(max-width: 620px) 300px, (max-width: 1279px) 42vw, 30vw"` : ""} alt="" width="800" height="800" loading="lazy" decoding="async"${placeholder ? ` style="background:#0a1712 url(${placeholder}) center / cover"` : ""} />`;
  /* The scene lies behind the whole card, clearest in the band at the top
     where no words sit; the card's ink thickens under the words. */
  const faceVisual = `<span class="finder-plate" aria-hidden="true">${plate}</span>`;
  const fullVisual = `<figure class="finder-full-plate" aria-hidden="true">${plate}</figure>`;
  const quote = story.quote ? `<blockquote>"${story.quote.text}"${voice ? `<cite>${esc(voice.role)}</cite>` : ""}</blockquote>` : "";
  const proof = record ? `<p class="finder-record"><a class="finder-proof" href="/case-studies#story=${record.id}">The full story\u00a0<span aria-hidden="true">→</span></a></p>` : "";
  const face = `<span class="finder-face">${faceVisual}<span class="finder-heading">${story.heading}</span><span class="finder-outcome">${story.outcome}</span></span>`;
  /* The heading and the outcome are said once, on the card; the sheet borrows
     them when it opens, so a page without scripts never says them twice. */
  const full = `<div class="finder-full"><div class="finder-full-media">${fullVisual}</div><div class="finder-full-text"><p>${story.situation}</p><p data-finder-happened>${story.happened}</p>${quote}${proof}${startLink(door)}</div></div>`;
  return `<li class="finder-card"><details data-finder-card="${id}"><summary>${face}</summary>${full}</details></li>`;
}

export interface StoryFinderMarkupOptions {
  /** The "What your AI Brain makes possible" label. /ai-brain leaves it out: the page already says so. */
  kicker?: boolean;
  /**
   * Which product's stories (proposal for Krish, 2026-11-04: one library, one
   * card, sorted by product; approved 4 November 2026). A product page shows
   * only its own; "library" is /case-studies, which opens with the choice of
   * product. Left out, every situation shows with no choice, as on
   * /new-age-leadership.
   */
  door?: "brain" | "gtm" | "library";
  /** A page heading and line set inside the finder, so they share its one left edge and its ground. */
  intro?: { title: string; lede: string };
}

const DOOR_LABEL = { brain: "AI brain", gtm: "AI business" } as const;

export function storyFinderMarkup(stories: readonly LeadershipStory[], { kicker = true, door, intro }: StoryFinderMarkupOptions = {}) {
  const shown = door === "brain" || door === "gtm" ? SITUATIONS.filter((s) => s.door === door) : SITUATIONS;
  const first = shown[0]?.door ?? "brain";
  const tabs = shown.map((s, i) => `<button type="button" role="tab" id="finder-tab-${s.id}" aria-controls="finder-panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-finder-tab="${s.id}" data-finder-door="${s.door}"${door === "library" && s.door !== first ? " hidden" : ""}>${s.label}</button>`).join("");
  const doors = door === "library" ? `<div class="finder-doors" role="group" aria-label="What do you want to build?">${(["brain", "gtm"] as const).map((d) => `<button type="button" data-finder-pick="${d}" aria-pressed="${d === first}">${DOOR_LABEL[d]}</button>`).join("")}</div>` : "";
  const panels = shown.map((s, i) => {
    const cards = s.cards.map((start, n) => card(storyByStart(stories, start), s.door, `${s.id}-${n + 1}`)).join("");
    return `<div class="finder-panel${i === 0 ? " is-active" : ""}" role="tabpanel" id="finder-panel-${s.id}" aria-labelledby="finder-tab-${s.id}" data-finder-panel="${s.id}"><h3 class="finder-situation">${s.label}</h3><ul class="finder-rail" data-finder-rail>${cards}</ul><div class="finder-nav"><button type="button" data-finder-prev aria-label="Previous story">←</button><p><span data-finder-at>1</span> of ${s.cards.length}</p><button type="button" data-finder-next aria-label="Next story">→</button></div></div>`;
  }).join("");
  const label = kicker ? `<p class="kicker" id="proof-title"><span></span>What your AI Brain makes possible</p>` : "";
  const question = door === "library" ? "What do you want to build?" : "Where would you start?";
  const head = intro ? `<div class="finder-intro"><h1 id="library-title">${esc(intro.title)}</h1><p>${esc(intro.lede)}</p></div>` : "";
  return `<div class="story-finder${door === "library" ? " is-library" : ""}" data-story-finder>${head}${label}<h2 class="finder-question">${question}</h2>${doors}<div class="finder-tabs" role="tablist" aria-label="Where would you start?">${tabs}</div><div class="finder-panels">${panels}</div><dialog class="finder-sheet" data-finder-sheet aria-label="Story"><button type="button" class="finder-close" data-finder-close aria-label="Close">×</button><div data-finder-sheet-body></div></dialog></div>`;
}

export interface StoryFinderOptions {
  reduced: boolean;
  /**
   * On a phone, the stories stack as the reader scrolls (owner, 2026-11-10,
   * after the 21st.dev card animation: "use this card-animation style ... for
   * the Where would you start? cards, particularly on mobile"). /ai-brain and
   * /ai-gtm ask for it; the library and the long read keep the rail.
   */
  deck?: boolean;
  /** Opens the free AI brief at a door; without it the card's link is followed. */
  onStart?: (door: "brain" | "gtm") => void;
}

export function mountStoryFinder(root: HTMLElement, { reduced, onStart, deck = false }: StoryFinderOptions) {
  const finder = root.querySelector<HTMLElement>("[data-story-finder]");
  if (!finder) return () => undefined;
  const abort = new AbortController();
  const { signal } = abort;
  finder.classList.add("is-live");
  const tabs = [...finder.querySelectorAll<HTMLButtonElement>("[data-finder-tab]")];
  const panels = [...finder.querySelectorAll<HTMLElement>("[data-finder-panel]")];
  const sheet = finder.querySelector<HTMLDialogElement>("[data-finder-sheet]");
  const sheetBody = finder.querySelector<HTMLElement>("[data-finder-sheet-body]");
  let opener: HTMLElement | null = null;
  const painters: Array<() => void> = [];

  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => { tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    /* The situations share one place and the unchosen ones are hidden there
       rather than taken out, so the finder is always the height of its
       tallest situation and choosing one never resizes it (Ruling, Krish,
       2026-10-24). `inert` keeps the unchosen ones out of reach. */
    panels.forEach((panel, i) => { panel.classList.toggle("is-active", i === index); panel.toggleAttribute("inert", i !== index); });
    const rail = panels[index]?.querySelector<HTMLElement>("[data-finder-rail]");
    rail?.scrollTo?.({ left: 0, behavior: "instant" as ScrollBehavior });
    /* A panel measured while hidden had no width, so its arrows are read again once it shows. */
    painters[index]?.();
    if (focus) tabs[index]?.focus();
    tabs[index]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  };
  panels.forEach((panel, i) => { panel.toggleAttribute("inert", i !== 0); });
  /* The library's first choice: which product. Its situations are the only
     tabs shown, and the first of them opens. */
  const picks = [...finder.querySelectorAll<HTMLButtonElement>("[data-finder-pick]")];
  picks.forEach((pick) => pick.addEventListener("click", () => {
    const door = pick.dataset.finderPick;
    picks.forEach((other) => other.setAttribute("aria-pressed", String(other === pick)));
    tabs.forEach((tab) => { tab.hidden = tab.dataset.finderDoor !== door; });
    select(tabs.findIndex((tab) => tab.dataset.finderDoor === door));
  }, { signal }));
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i), { signal });
    tab.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      /* Only the chosen product's situations are tabs the reader can reach. */
      const shown = tabs.map((_, n) => n).filter((n) => !tabs[n].hidden);
      const at = shown.indexOf(i);
      if (event.key === "Home") { event.preventDefault(); select(shown[0], true); return; }
      if (event.key === "End") { event.preventDefault(); select(shown[shown.length - 1], true); return; }
      if (!step) return;
      event.preventDefault();
      select(shown[(at + step + shown.length) % shown.length], true);
    }, { signal });
  });

  /* The rail: one card in view on a phone, the next peeking; the count and
     the arrows follow the card nearest the rail's start. */
  panels.forEach((panel) => {
    const rail = panel.querySelector<HTMLElement>("[data-finder-rail]");
    const cards = rail ? [...rail.children] as HTMLElement[] : [];
    const at = panel.querySelector<HTMLElement>("[data-finder-at]");
    const prev = panel.querySelector<HTMLButtonElement>("[data-finder-prev]");
    const next = panel.querySelector<HTMLButtonElement>("[data-finder-next]");
    if (!rail || !cards.length) return;
    const current = () => {
      const left = rail.scrollLeft;
      let best = 0;
      cards.forEach((card, i) => { if (Math.abs(card.offsetLeft - rail.offsetLeft - left) < Math.abs(cards[best].offsetLeft - rail.offsetLeft - left)) best = i; });
      return best;
    };
    const nav = panel.querySelector<HTMLElement>(".finder-nav");
    const paint = () => {
      /* The phone deck owns the count and the arrows while it runs. */
      if (finder.classList.contains("is-deck")) return;
      if (!rail.clientWidth) return;
      const i = current();
      /* Where several cards show at once the count names all of them, so a
         situation with five stories reads "1 to 3 of 5", then "3 to 5 of 5". */
      const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : rail.clientWidth;
      const inView = Math.max(1, Math.round(rail.clientWidth / Math.max(1, step)));
      const last = Math.min(cards.length, i + inView);
      if (at) at.textContent = last > i + 1 ? `${i + 1} to ${last}` : String(i + 1);
      const end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
      prev?.toggleAttribute("disabled", i === 0 && rail.scrollLeft < 2);
      next?.toggleAttribute("disabled", end);
      /* Where every card already shows there is nothing to page through, so
         the arrows go, but their room stays: a situation with three stories
         and one with five are the same height (Ruling, Krish, 2026-10-24: no
         component may change size when a reader makes a choice). */
      if (nav) nav.style.visibility = rail.scrollWidth <= rail.clientWidth + 2 ? "hidden" : "";
    };
    /* Every card's outcome starts on the same line (Ruling, Krish,
       2026-10-24: the green outcome lines must not sit at different heights
       because one heading wraps to an extra line). The headings of a
       situation take the height of its tallest, measured whenever the
       situation is shown or the screen changes width, never while scrolling. */
    const headings = cards.map((card) => card.querySelector<HTMLElement>(".finder-heading")).filter((el): el is HTMLElement => Boolean(el));
    const equalise = () => {
      if (!rail.clientWidth || !headings.length) return;
      panel.style.removeProperty("--finder-heading-h");
      const tallest = Math.max(...headings.map((heading) => heading.getBoundingClientRect().height));
      panel.style.setProperty("--finder-heading-h", `${Math.ceil(tallest)}px`);
    };
    painters[panels.indexOf(panel)] = () => { equalise(); paint(); };
    const go = (step: number) => {
      if (finder.classList.contains("is-deck")) return;
      const i = Math.max(0, Math.min(cards.length - 1, current() + step));
      rail.scrollTo?.({ left: cards[i].offsetLeft - rail.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    };
    prev?.addEventListener("click", () => go(-1), { signal });
    next?.addEventListener("click", () => go(1), { signal });
    /* A card reached by Tab comes fully into view: the browser left the rail
       where it was, so focus sat on a card mostly off screen (audit DECK-08). */
    rail.addEventListener("focusin", (event) => {
      if (finder.classList.contains("is-deck")) return;
      (event.target as HTMLElement).closest<HTMLElement>(".finder-card")?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
    }, { signal });
    let frame = 0;
    rail.addEventListener("scroll", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(paint); }, { passive: true, signal });
    addEventListener("resize", () => { equalise(); paint(); }, { passive: true, signal });
    equalise();
    paint();
  });

  /* The web fonts change where headings break, so every situation is measured
     again once they have loaded. */
  void document.fonts?.ready.then(() => { if (!signal.aborted) painters.forEach((paint) => paint?.()); });

  /* A card opens as a sheet: the whole story, its result on the record where
     it has one, and the brief at its door. */
  const close = () => { if (sheet?.open) sheet.close(); };
  finder.querySelectorAll<HTMLDetailsElement>("[data-finder-card]").forEach((card) => {
    const summary = card.querySelector("summary");
    summary?.addEventListener("click", (event) => {
      if (!sheet || !sheetBody || typeof sheet.showModal !== "function") return;
      event.preventDefault();
      const full = card.querySelector(".finder-full");
      sheetBody.innerHTML = full ? full.outerHTML : "";
      const heading = summary.querySelector(".finder-heading");
      const outcome = summary.querySelector(".finder-outcome");
      const sheetFull = sheetBody.querySelector(".finder-full");
      if (heading && sheetFull) {
        const head = document.createElement("div");
        head.className = "finder-full-head";
        head.innerHTML = `<h3>${heading.innerHTML}</h3>`;
        sheetFull.prepend(head);
      }
      if (outcome) {
        const line = document.createElement("p");
        line.className = "finder-outcome";
        line.innerHTML = outcome.innerHTML;
        sheetBody.querySelector("[data-finder-happened]")?.after(line);
      }
      opener = summary;
      sheet.showModal();
      sheet.querySelector<HTMLElement>("[data-finder-close]")?.focus();
    }, { signal });
  });
  sheet?.addEventListener("close", () => { opener?.focus(); opener = null; }, { signal });
  sheet?.addEventListener("click", (event) => { if (event.target === sheet) close(); }, { signal });
  finder.querySelector("[data-finder-close]")?.addEventListener("click", close, { signal });
  finder.addEventListener("click", (event) => {
    const start = (event.target as HTMLElement).closest<HTMLAnchorElement>("[data-finder-start]");
    if (!start || !onStart) return;
    event.preventDefault();
    close();
    onStart(start.dataset.finderStart === "gtm" ? "gtm" : "brain");
  }, { signal });

  const undeck = deck ? mountDeck(finder, tabs, panels, signal) : () => undefined;

  return () => { abort.abort(); undeck(); close(); finder.classList.remove("is-live"); };
}

/** Earlier stories that stay visible above the current one. */
export const DECK_PEEKS = 2;
/** A horizontal drag this long (CSS px) moves to the next or previous story. */
export const DECK_SWIPE_PX = 56;

/** Each card's place in the deck: behind the current one (by depth), current, or still to come. */
export function deckStates(count: number, index: number) {
  return Array.from({ length: count }, (_, k) => k < index
    ? { state: "past" as const, depth: index - k }
    : k === index ? { state: "current" as const, depth: 0 } : { state: "next" as const, depth: 0 });
}

/** Whether a finished drag moves the deck: -1 back, 1 on, 0 stay. A short fast flick counts. */
export function swipeIntent(dx: number, dy: number, ms: number): -1 | 0 | 1 {
  if (Math.abs(dx) < 8 || Math.abs(dx) < Math.abs(dy)) return 0;
  const fast = ms > 0 && Math.abs(dx) / ms > 0.5;
  if (Math.abs(dx) < DECK_SWIPE_PX && !fast) return 0;
  return dx < 0 ? 1 : -1;
}

/**
 * The stories as a deck on a phone (Ruling, owner, 2026-11-10: "Swipe deck,
 * no pinning", after the scroll-pinned deck sliced stories and let cards show
 * through one another). The current story sits on top, whole and solid; the
 * ones already read stay visible above it, a step smaller and darker each,
 * so the reader always sees how far through they are. A sideways swipe or the
 * arrows move one story; the page itself always scrolls normally, and the
 * finder is one height whichever situation is chosen.
 *
 * Only below 761px and only with script; a laptop and a page without script
 * keep the rail. Under reduced motion the deck still works, without travel.
 */
function mountDeck(finder: HTMLElement, tabs: HTMLButtonElement[], panels: HTMLElement[], signal: AbortSignal) {
  const phone = window.matchMedia?.("(max-width: 760px)");
  if (!phone) return () => undefined;
  const index = new Map<HTMLElement, number>(panels.map((panel) => [panel, 0]));
  let live = false;

  const cardsOf = (panel: HTMLElement) => [...panel.querySelectorAll<HTMLElement>("[data-finder-rail] > .finder-card")];
  const paint = (panel: HTMLElement) => {
    const cards = cardsOf(panel);
    const at = Math.max(0, Math.min(cards.length - 1, index.get(panel) ?? 0));
    index.set(panel, at);
    deckStates(cards.length, at).forEach(({ state, depth }, k) => {
      const card = cards[k];
      card.dataset.deck = state;
      card.style.setProperty("--depth", String(Math.min(depth, DECK_PEEKS + 1)));
      card.style.zIndex = String(k + 1);
      card.style.removeProperty("translate");
      card.toggleAttribute("inert", state !== "current");
    });
    const count = panel.querySelector<HTMLElement>("[data-finder-at]");
    if (count) count.textContent = String(at + 1);
    const nav = panel.querySelector<HTMLElement>(".finder-nav");
    if (nav) nav.style.visibility = cards.length > 1 ? "" : "hidden";
    panel.querySelector("[data-finder-prev]")?.toggleAttribute("disabled", at <= 0);
    panel.querySelector("[data-finder-next]")?.toggleAttribute("disabled", at >= cards.length - 1);
  };
  const go = (panel: HTMLElement, step: number) => {
    index.set(panel, (index.get(panel) ?? 0) + step);
    paint(panel);
  };

  panels.forEach((panel) => {
    const rail = panel.querySelector<HTMLElement>("[data-finder-rail]");
    /* The arrows take the deck's step before the rail's own handler runs. */
    const arrow = (step: number) => (event: Event) => {
      if (!live) return;
      event.stopImmediatePropagation();
      go(panel, step);
    };
    panel.querySelector("[data-finder-prev]")?.addEventListener("click", arrow(-1), { capture: true, signal });
    panel.querySelector("[data-finder-next]")?.addEventListener("click", arrow(1), { capture: true, signal });
    if (!rail) return;
    /* A sideways drag moves the current story with the finger; a vertical
       one is the page's, untouched (touch-action: pan-y in the CSS). */
    let drag: { x: number; y: number; t: number; id: number; moved: boolean } | null = null;
    let swallowClick = false;
    rail.addEventListener("pointerdown", (event) => {
      if (!live || (event.pointerType === "mouse" && event.button !== 0)) return;
      drag = { x: event.clientX, y: event.clientY, t: performance.now(), id: event.pointerId, moved: false };
    }, { signal });
    rail.addEventListener("pointermove", (event) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) drag.moved = true;
      const current = rail.querySelector<HTMLElement>('.finder-card[data-deck="current"]');
      if (drag.moved && current) current.style.translate = `${dx.toFixed(0)}px 0`;
    }, { signal });
    const release = (event: PointerEvent) => {
      if (!drag || event.pointerId !== drag.id) return;
      const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
      const moved = drag.moved;
      const step = event.type === "pointercancel" ? 0 : swipeIntent(dx, dy, performance.now() - drag.t);
      drag = null;
      if (moved) swallowClick = true;
      if (step) go(panel, step); else paint(panel);
    };
    rail.addEventListener("pointerup", release, { signal });
    rail.addEventListener("pointercancel", release, { signal });
    rail.addEventListener("click", (event) => {
      if (!swallowClick) return;
      swallowClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
    }, { capture: true, signal });
  });
  /* A new situation starts at its first story. */
  tabs.forEach((tab, i) => tab.addEventListener("click", () => {
    if (!live || !panels[i]) return;
    index.set(panels[i], 0);
    paint(panels[i]);
  }, { signal }));

  const enter = () => {
    if (live) return;
    live = true;
    finder.classList.add("is-deck");
    panels.forEach(paint);
  };
  const leave = () => {
    if (!live) return;
    live = false;
    finder.classList.remove("is-deck");
    panels.forEach((panel) => cardsOf(panel).forEach((card) => {
      delete card.dataset.deck;
      for (const property of ["--depth", "z-index", "translate"]) card.style.removeProperty(property);
      card.removeAttribute("inert");
    }));
  };
  const decide = () => (phone.matches ? enter() : leave());
  phone.addEventListener?.("change", decide, { signal } as AddEventListenerOptions);
  decide();
  return () => leave();
}
