import { clientStories, type ClientStory } from "@/data/rebuildProof";

/**
 * What the AI Brain makes possible, found rather than scrolled (prototype for
 * Krish, 15 October 2026: "on mobile I see just an endless list of stuff,
 * which overwhelms me … help me think about this like the CEO of Apple").
 *
 * The reader answers one question about themselves and gets the few stories
 * that fit, one card at a time, with the whole story a tap away. The fourteen
 * stories and the eight results on the record are one set, grouped by the
 * reader's situation and by the door it belongs to, so a story that has a
 * result on the record links to it, and every story ends in the free AI brief
 * opened at that door.
 *
 * Without scripts every situation and every card is on the page, each card a
 * <details> that opens in place; with scripts the situations become tabs, the
 * cards a rail, and a card opens as a sheet.
 */

export interface FinderStory {
  heading: string;
  situation: string;
  happened: string;
  quote?: { text: string };
  scene?: string;
}

type Card = { story: string; result?: string } | { result: string };

interface Situation {
  id: string;
  label: string;
  door: "brain" | "gtm";
  cards: Card[];
}

/* Stories are named by the first words of their heading, so a reworded
   heading fails here rather than dropping a card. */
export const SITUATIONS: readonly Situation[] = [
  { id: "ideas", label: "Getting your ideas out", door: "brain", cards: [
    { story: "A founder who posted", result: "own-system" },
    { story: "A CEO who hates writing" },
    { story: "Leadership updates become" },
    { story: "Founder-led content" },
  ] },
  { id: "change", label: "Seeing what is changing", door: "brain", cards: [
    { story: "A CEO who read many newsletters" },
    { story: "A leader who only heard from inside" },
    { story: "A change in market pricing" },
  ] },
  { id: "hands", label: "Getting hands-on again", door: "brain", cards: [
    { story: "A head of operations" },
    { story: "Someone new to AI" },
    { story: "A CRO who hates the numbers" },
  ] },
  { id: "team", label: "Keeping your team in step", door: "gtm", cards: [
    { story: "Teams working on the same account" },
    { story: "One person corrected it once" },
    { story: "A team's account plans" },
    { story: "Work nobody owns" },
    { result: "team-decides" },
    { result: "business-first" },
  ] },
  { id: "sell", label: "Growing what you sell", door: "gtm", cards: [
    { result: "simple-product" },
    { result: "market-moves" },
    { result: "day-one" },
    { result: "sellable-expertise" },
    { result: "hand-back" },
  ] },
];

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
const firstSentence = (text: string) => (text.match(/^.*?[.!?](\s|$)/)?.[0] ?? text).trim();
/* The last two words travel together from the first paint, so no card or
   label ends on one word alone, in a rail or a sheet keepLastWords has not
   reached yet. Quotes are left exactly as spoken. */
const tail = (text: string) => text.replace(/ (\S+)$/, "\u00a0$1");

const resultById = (id: string): ClientStory => {
  const found = clientStories.find((story) => story.id === id);
  if (!found) throw new Error(`No result on the record with id "${id}"`);
  return found;
};

const startLink = (door: "brain" | "gtm") =>
  `<a class="finder-start" href="/?start=${door}" data-finder-start="${door}">Get your free AI brief <span aria-hidden="true">→</span></a>`;

const proofLink = (result: ClientStory, text: string) =>
  `<a class="finder-proof" href="/case-studies#story=${result.id}">${tail(esc(text))}\u00a0<span aria-hidden="true">→</span></a>`;

/* The whole story, as a sheet opens it: its head across the top, the scene or
   the figure on one side and the words on the other where there is room. */
const full = (head: string, media: string, text: string) =>
  `<div class="finder-full"><div class="finder-full-head">${head}</div>${media ? `<div class="finder-full-media">${media}</div>` : ""}<div class="finder-full-text">${text}</div></div>`;

function storyCard(story: FinderStory, door: "brain" | "gtm", id: string, result?: ClientStory) {
  const plate = story.scene ? `<img src="${esc(story.scene)}" alt="" width="800" height="800" loading="lazy" decoding="async" />` : "";
  const quote = story.quote ? `<blockquote>"${story.quote.text}"</blockquote>` : "";
  const proof = result ? `<p class="finder-record">${proofLink(result, result.result)}</p>` : "";
  const tag = result ? `<span class="finder-tag">Success story</span>` : "";
  const face = `<span class="finder-face">${plate ? `<span class="finder-plate" aria-hidden="true">${plate}</span>` : ""}${tag}<span class="finder-heading">${tail(story.heading)}</span><span class="finder-line">${tail(firstSentence(story.situation))}</span></span>`;
  const body = full(`<h3>${tail(story.heading)}</h3>`, plate ? `<figure class="finder-full-plate" aria-hidden="true">${plate}</figure>` : "", `<p>${tail(story.situation)}</p><p>${tail(story.happened)}</p>${quote}${proof}${startLink(door)}`);
  return `<li class="finder-card is-story"><details data-finder-card="${id}"><summary>${face}</summary>${body}</details></li>`;
}

/* A result's figure in words: where it started and where it ended, in the
   record's own labels, and only the numerals its diagram on /case-studies
   prints (rebuildProof.ts keeps the rule on numbers). */
function resultFigure(result: ClientStory) {
  const f = result.figure;
  const pair = (was: string, now: string) => `<span class="finder-was"><i>Before</i><span>${tail(esc(was))}</span></span><span class="finder-now"><i>After</i><span>${tail(esc(now))}</span></span>`;
  switch (f.shape) {
    case "span":
    case "cadence":
    case "focus":
      return pair(f.fromLabel, f.toLabel);
    case "offer":
      return pair(f.before, f.after);
    case "count":
      return `<span class="finder-count"><b>${f.value}</b><span>${tail(esc(f.label))}</span><i>${tail(esc(f.within))}</i></span>`;
    case "cut":
      return `<span class="finder-count is-pair"><span><b>${f.cut}</b>tools cut</span><span><b>${f.live}</b>system live</span></span>`;
  }
}

function resultCard(result: ClientStory, door: "brain" | "gtm", id: string) {
  const figure = (extra = "") => `<span class="finder-figure${extra}" aria-hidden="true">${resultFigure(result)}</span>`;
  const face = `<span class="finder-face">${figure()}<span class="finder-tag">Success story</span><span class="finder-heading">${tail(esc(result.result))}</span><span class="finder-line">${tail(esc(result.attribution))}</span></span>`;
  const body = full(`<p class="finder-tag">Success story</p><h3>${tail(esc(result.result))}</h3>`, figure(" is-full"), `<p>${tail(esc(result.outcome))}</p><blockquote>"${esc(result.quote)}"<cite>${esc(result.attribution)}</cite></blockquote><p class="finder-record">${proofLink(result, "The full story")}</p>${startLink(door)}`);
  return `<li class="finder-card is-result"><details data-finder-card="${id}"><summary>${face}</summary>${body}</details></li>`;
}

export function storyFinderMarkup(stories: readonly FinderStory[]) {
  const byStart = (start: string) => {
    const plain = (heading: string) => heading.replaceAll(" ", " ");
    const found = stories.find((story) => plain(story.heading).startsWith(start));
    if (!found) throw new Error(`No story starts "${start}"`);
    return found;
  };
  const tabs = SITUATIONS.map((s, i) => `<button type="button" role="tab" id="finder-tab-${s.id}" aria-controls="finder-panel-${s.id}" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-finder-tab="${s.id}">${s.label}</button>`).join("");
  const panels = SITUATIONS.map((s, i) => {
    const cards = s.cards.map((card, n) => {
      const id = `${s.id}-${n + 1}`;
      if ("story" in card) return storyCard(byStart(card.story), s.door, id, card.result ? resultById(card.result) : undefined);
      return resultCard(resultById(card.result), s.door, id);
    }).join("");
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

  const select = (index: number, focus = false) => {
    tabs.forEach((tab, i) => { tab.setAttribute("aria-selected", String(i === index)); tab.tabIndex = i === index ? 0 : -1; });
    panels.forEach((panel, i) => { panel.classList.toggle("is-active", i === index); panel.hidden = i !== index; });
    const rail = panels[index]?.querySelector<HTMLElement>("[data-finder-rail]");
    rail?.scrollTo({ left: 0, behavior: "instant" as ScrollBehavior });
    if (focus) tabs[index]?.focus();
    tabs[index]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: reduced ? "auto" : "smooth" });
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
    const paint = () => {
      const i = current();
      if (at) at.textContent = String(i + 1);
      const end = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 2;
      prev?.toggleAttribute("disabled", i === 0 && rail.scrollLeft < 2);
      next?.toggleAttribute("disabled", end);
    };
    const go = (step: number) => {
      const i = Math.max(0, Math.min(cards.length - 1, current() + step));
      rail.scrollTo({ left: cards[i].offsetLeft - rail.offsetLeft, behavior: reduced ? "auto" : "smooth" });
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
