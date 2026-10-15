import { clientStories } from "@/data/rebuildProof";
import { publishableTestimonials } from "@/data/testimonials";
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
  { id: "change", label: "Seeing what is changing", door: "brain", cards: ["A CEO who read many newsletters", "A leader who only heard from inside", "A change in market pricing"] },
  { id: "hands", label: "Getting hands-on again", door: "brain", cards: ["A head of operations", "Someone new to AI", "A CRO who hates the numbers"] },
  { id: "team", label: "Keeping your team in step", door: "gtm", cards: ["Teams working on the same account", "One person corrected it once", "A team's account plans"] },
  { id: "calls", label: "Making the big AI calls", door: "gtm", cards: ["Two quarters of argument", "A publisher weighing up", "A broadcaster stopped"] },
];

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
/* The last two words travel together from the first paint, so no card or
   line ends on one word alone, in a rail or a sheet keepLastWords has not
   reached yet. Quotes are left exactly as spoken. */
const tail = (text: string) => text.replace(/ (\S+)$/, "\u00a0$1");
const plain = (text: string) => text.replaceAll("\u00a0", " ");

export const storyByStart = (stories: readonly LeadershipStory[], start: string) => {
  const found = stories.find((story) => plain(story.heading).startsWith(start));
  if (!found) throw new Error(`No story starts "${start}"`);
  return found;
};

const startLink = (door: "brain" | "gtm") =>
  `<a class="finder-start" href="/?start=${door}" data-finder-start="${door}">Get your free AI brief <span aria-hidden="true">→</span></a>`;

/* Where it started and where it ended, for a story with no scene. */
const figureMarkup = (figure: NonNullable<LeadershipStory["figure"]>, extra = "") =>
  `<span class="finder-figure${extra}" aria-hidden="true"><span class="finder-was"><i>Before</i><span>${tail(esc(figure.was))}</span></span><span class="finder-now"><i>After</i><span>${tail(esc(figure.now))}</span></span></span>`;

function card(story: LeadershipStory, door: "brain" | "gtm", id: string) {
  const record = story.record ? clientStories.find((entry) => entry.id === story.record) : undefined;
  if (story.record && !record) throw new Error(`No result on the record with id "${story.record}"`);
  const voice = story.quote ? publishableTestimonials.find((entry) => entry.id === story.quote!.testimonialId) : undefined;
  const plate = story.scene ? `<img src="${esc(story.scene)}" alt="" width="800" height="800" loading="lazy" decoding="async" />` : "";
  const faceVisual = plate ? `<span class="finder-plate" aria-hidden="true">${plate}</span>` : story.figure ? figureMarkup(story.figure) : "";
  const fullVisual = plate ? `<figure class="finder-full-plate" aria-hidden="true">${plate}</figure>` : story.figure ? figureMarkup(story.figure, " is-full") : "";
  const quote = story.quote ? `<blockquote>"${story.quote.text}"${voice ? `<cite>${esc(voice.role)}</cite>` : ""}</blockquote>` : "";
  const proof = record ? `<p class="finder-record"><a class="finder-proof" href="/case-studies#story=${record.id}">The full story\u00a0<span aria-hidden="true">→</span></a></p>` : "";
  const face = `<span class="finder-face">${faceVisual}<span class="finder-heading">${tail(story.heading)}</span><span class="finder-outcome">${tail(story.outcome)}</span></span>`;
  /* The heading and the outcome are said once, on the card; the sheet borrows
     them when it opens, so a page without scripts never says them twice. */
  const full = `<div class="finder-full">${fullVisual ? `<div class="finder-full-media">${fullVisual}</div>` : ""}<div class="finder-full-text"><p>${tail(story.situation)}</p><p data-finder-happened>${tail(story.happened)}</p>${quote}${proof}${startLink(door)}</div></div>`;
  return `<li class="finder-card"><details data-finder-card="${id}"><summary>${face}</summary>${full}</details></li>`;
}

export function storyFinderMarkup(stories: readonly LeadershipStory[]) {
  const tabs = SITUATIONS.map((s, i) => `<button type="button" role="tab" id="finder-tab-${s.id}" aria-controls="finder-panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-finder-tab="${s.id}">${s.label}</button>`).join("");
  const panels = SITUATIONS.map((s, i) => {
    const cards = s.cards.map((start, n) => card(storyByStart(stories, start), s.door, `${s.id}-${n + 1}`)).join("");
    return `<div class="finder-panel${i === 0 ? " is-active" : ""}" role="tabpanel" id="finder-panel-${s.id}" aria-labelledby="finder-tab-${s.id}" data-finder-panel="${s.id}"><h3 class="finder-situation">${s.label}</h3><ul class="finder-rail" data-finder-rail>${cards}</ul><div class="finder-nav"><button type="button" data-finder-prev aria-label="Previous story">←</button><p><span data-finder-at>1</span> / ${s.cards.length}</p><button type="button" data-finder-next aria-label="Next story">→</button></div></div>`;
  }).join("");
  return `<div class="story-finder" data-story-finder><p class="kicker" id="proof-title"><span></span>What your AI Brain makes possible</p><h2 class="finder-question">Where would you start?</h2><div class="finder-tabs" role="tablist" aria-label="Where would you start?">${tabs}</div>${panels}<dialog class="finder-sheet" data-finder-sheet aria-label="Story"><button type="button" class="finder-close" data-finder-close aria-label="Close">×</button><div data-finder-sheet-body></div></dialog></div>`;
}

export interface StoryFinderOptions {
  reduced: boolean;
  /** Opens the free AI brief at a door; without it the card's link is followed. */
  onStart?: (door: "brain" | "gtm") => void;
}

export function mountStoryFinder(root: HTMLElement, { reduced, onStart }: StoryFinderOptions) {
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
    panels.forEach((panel, i) => { panel.classList.toggle("is-active", i === index); panel.hidden = i !== index; });
    const rail = panels[index]?.querySelector<HTMLElement>("[data-finder-rail]");
    rail?.scrollTo?.({ left: 0, behavior: "instant" as ScrollBehavior });
    /* A panel measured while hidden had no width, so its arrows are read again once it shows. */
    painters[index]?.();
    if (focus) tabs[index]?.focus();
    tabs[index]?.scrollIntoView?.({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
  };
  panels.forEach((panel, i) => { panel.hidden = i !== 0; });
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => select(i), { signal });
    tab.addEventListener("keydown", (event) => {
      const step = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 0;
      if (event.key === "Home") { event.preventDefault(); select(0, true); return; }
      if (event.key === "End") { event.preventDefault(); select(tabs.length - 1, true); return; }
      if (!step) return;
      event.preventDefault();
      select((i + step + tabs.length) % tabs.length, true);
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
      if (!rail.clientWidth) return;
      const i = current();
      if (at) at.textContent = String(i + 1);
      const end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
      prev?.toggleAttribute("disabled", i === 0 && rail.scrollLeft < 2);
      next?.toggleAttribute("disabled", end);
      /* Where every card already shows, there is nothing to page through. */
      if (nav) nav.hidden = rail.scrollWidth <= rail.clientWidth + 2;
    };
    painters[panels.indexOf(panel)] = paint;
    const go = (step: number) => {
      const i = Math.max(0, Math.min(cards.length - 1, current() + step));
      rail.scrollTo?.({ left: cards[i].offsetLeft - rail.offsetLeft, behavior: reduced ? "auto" : "smooth" });
    };
    prev?.addEventListener("click", () => go(-1), { signal });
    next?.addEventListener("click", () => go(1), { signal });
    let frame = 0;
    rail.addEventListener("scroll", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(paint); }, { passive: true, signal });
    addEventListener("resize", paint, { passive: true, signal });
    paint();
  });

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

  return () => { abort.abort(); close(); finder.classList.remove("is-live"); };
}
