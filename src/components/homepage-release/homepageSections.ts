import writingImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-writing-s2.webp";
import loomImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-loom-s2.webp";
import calculatorImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-calculator-s2.webp";
import satnavImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-satnav-s2.webp";
import latestIssue from "@/data/latestIssue.json";
import { canShowStoryQuote, featuredQuotes } from "@/data/testimonials";
import { getUseCase, situationOf } from "@/data/useCases";
import { PUBLICATION_URL, START_LABEL, SUBSCRIBE_LABEL } from "@/lib/publicLinks";
import { placeholderFor, srcsetFor } from "@/lib/responsiveImages";
import { buildOnScroll } from "@/lib/scrollBuild";
import { track } from "@/lib/analytics";
import { mountLiquidOrb } from "@/components/mindmake/locked/liquidOrb";
import { DECK_WIDE, paintDeckCards, swipeIntent } from "@/components/leadership-chapters/storyFinder";

/**
 * The homepage after its opening, in two sections since 2026-11-11 (three
 * from Ruling, Krish, 2026-10-24: "drastically simplify everything here to be
 * probably three sections"; every page answers what problem it solves, how it solves it, and
 * what the reader gets and how they know it works).
 *
 * 1. The problem: right now your AI is an intern, and we have been here
 *    before. The four eras of the old history chapter, each on its own picture
 *    from that chapter, in a carousel swiped through time from left to right;
 *    a tile turns on a tap; nothing pins ("keeping a user here for so long
 *    through the scroll... is not worth it").
 * 2. What you get: three true results, each on its story's own picture, then
 *    a floating piece of the living Brain asking where to start (yourself or
 *    your business), and a band that is only about exploring what leaders
 *    built (Krish, 2026-11-11: the section's button went, "the call to action
 *    is now taken care of by the floating blob orb").
 *
 * "Your AI brain knows how you think." moved to /ai-brain on
 * 2026-11-11 (src/components/mindmake/chiefOfStaff.ts).
 *
 * The carousels and pictures follow Krish's review on the phone, 24 October
 * 2026: "make these cards a carousel, which the user obviously knows they have
 * to scroll through, time left to right", and the pictures "faded enough that
 * the text is all visible". A picture sits behind its card under the card's
 * own ink, never under less than 90% of it where text can fall, so the words
 * keep their contrast whatever the picture holds (homepageSections.css).
 *
 * Hand-written, like heroRotation.ts; scripts/qa/build-homepage-release.mjs
 * injects it between the R3 opening and footer, and the hero's way in after
 * the doors.
 */

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** The four eras, in the history chapter's own approved words and pictures. */
const ERAS = [
  { when: "370 BC · Writing", stop: "370 BC", image: writingImage, question: "If knowledge lives outside us, will memory grow weaker?", answer: "Ideas could travel beyond one voice and survive their maker. We changed what memory was for." },
  { when: "1675 · Engine loom", stop: "1675", image: loomImage, question: "If the machine can do the work, what happens to the worker?", answer: "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain." },
  { when: "1970s · Calculator", stop: "1970s", image: calculatorImage, question: "If the device does the arithmetic, will children stop learning to think?", answer: "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer." },
  { when: "2000s · Satnav", stop: "2000s", image: satnavImage, question: "If the device knows the route, will we lose our sense of direction?", answer: "That risk turned out to be real. A useful tool still asks us what we choose to keep practising." },
] as const;


/**
 * Three results on the record, each read from its use case's one record
 * (src/data/useCases.ts), with the wish each record belongs to.
 */
const PROOF = (["C-15", "C-18", "C-16"] as const).map(getUseCase);

/**
 * A few voices under the results, one at a time (Krish, 2026-11-06: some of
 * the quotes at the foot of the homepage, "non-obtrusive and minimalist", to
 * send more people to the full range of results). They are the featured
 * quotes, in their order, each the featured part of its one record in
 * src/data/testimonials.ts, never retyped. The line ends in the way to all of
 * them on /case-studies.
 */
const VOICES = featuredQuotes.filter((voice) => canShowStoryQuote(voice.featured!.excerpt)).map((found) => ({ quote: found.featured!.excerpt, who: found.name ? `${found.name}, ${found.role}` : found.role }));

const startButton = () => `<button type="button" class="hs-start-button" data-start-route="brain" data-mm-primary>${START_LABEL} <span aria-hidden="true">→</span></button>`;

/**
 * Where the "Prefer to ...?" nudge from /ai-brain lands on the homepage
 * (Krish, 2026-11-18: "duplicate this component on the hero section of the
 * homepage, thoughtfully for mobile and desktop"). Index.tsx renders the one
 * nudge, the same React component as /ai-brain's, into whichever place fits
 * the screen (HOME_COMPARE_IN_HERO below):
 *
 * - "hero", on a wide screen: floating over the film, right of the copy, so
 *   it is its own thing beside the way in and never in its path.
 * - "sheet", on a phone or a narrower screen, where the hero fills the screen
 *   and has no room left: the first thing on the sheet that slides up over
 *   the hero, so a reader meets it on their first scroll. Its height is
 *   reserved before the page starts (homepageSections.css), so nothing moves
 *   when it arrives.
 *
 * Both are empty in the prerendered page; the nudge opens a dialog, which
 * needs the page started anyway.
 */
export const HOME_COMPARE_IN_HERO = "(min-width: 1180px)";
const compareSlot = (place: "hero" | "sheet") => `<div class="hs-compare mm-site" data-hs-compare="${place}"></div>`;

/** The hero's way in and the publication line, after the doors (desktop and phone). */
export function heroStartMarkup() {
  return `<div class="hs-start">${startButton()}</div><p class="hs-issue"><span class="hs-issue-label">From our media channel</span> <a class="hs-issue-title" href="${esc(latestIssue.url)}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_hero">${esc(latestIssue.title)}</a> <a class="hs-issue-subscribe" href="${PUBLICATION_URL}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_hero">Get it free, three times a week <span aria-hidden="true">↗</span></a></p>${compareSlot("hero")}`;
}

/** The subscribe link beside the menu in the homepage masthead (Krish, 2026-10-24). */
export function mastheadSubscribeMarkup() {
  return `<a class="hs-subscribe" href="${PUBLICATION_URL}" target="_blank" rel="noreferrer" data-subscribe-source="masthead"><span class="mm-masthead-label-full">${esc(SUBSCRIBE_LABEL)}</span><span class="mm-masthead-label-short">Media</span></a>`;
}

/**
 * A picture behind a card: decorative, so it has no name and loads when near.
 * A phone downloads the size its card shows, and the card holds a blurred
 * placeholder of the scene until the picture arrives (Krish, 2026-11-04:
 * pictures took up to ten seconds on a phone's first visit).
 */
const cardImage = (src: string, originalWidth = 800, sizes = "(max-width: 760px) 84vw, 340px") => {
  const srcset = srcsetFor(src, originalWidth);
  const placeholder = placeholderFor(src);
  return `<img class="hs-card-img" src="${esc(src)}"${srcset ? ` srcset="${esc(srcset)}" sizes="${sizes}"` : ""} alt="" width="800" height="450" loading="lazy" decoding="async"${placeholder ? ` style="background:#0d1c16 url(${placeholder}) center / cover"` : ""} />`;
};

/**
 * Under a carousel: back and forward, and the stops it moves through, left to
 * right. The stops light as their cards come into view, so the reader sees
 * where they are in the sequence and that there is more to the right.
 */
const railNav = (noun: string, stops: readonly string[]) =>
  `<div class="hs-rail-nav" data-hs-rail-nav><button type="button" class="hs-rail-step" data-hs-rail-step="-1" aria-label="Previous ${noun}" disabled><span aria-hidden="true">←</span></button><ol class="hs-rail-stops" style="--hs-stops:${stops.length}">${stops.map((stop, index) => `<li><button type="button" data-hs-rail-go="${index}"${index ? "" : ' aria-current="true"'}>${stop}</button></li>`).join("")}</ol><button type="button" class="hs-rail-step" data-hs-rail-step="1" aria-label="Next ${noun}"><span aria-hidden="true">→</span></button></div>`;

const eraMarkup = ({ when, image, question, answer }: (typeof ERAS)[number]) =>
  `<li><button type="button" class="hs-era" aria-pressed="false" data-hs-era>${cardImage(image, 1600)}<span class="hs-era-when">${when}</span><span class="hs-era-faces"><span class="hs-era-q">“${question}”</span><span class="hs-era-a"><b>What actually happened instead</b>${answer}</span></span><span class="hs-era-mark" aria-hidden="true"></span></button></li>`;

const proofMarkup = (item: (typeof PROOF)[number]) =>
  `<li>${cardImage(item.picture, 800, "(max-width: 760px) 84vw, 33vw")}<p class="hs-proof-story"><a href="/case-studies#${item.id.toLowerCase()}">${esc(item.heading)}</a></p><p class="hs-proof-outcome">${esc(item.outcome)}</p><p class="hs-proof-who">${esc(situationOf(item.id).label)}</p></li>`;

/**
 * Where to start, asked by a floating piece of the living Brain (Krish,
 * 2026-11-11: the orb "show up on the 'We build yours with you in 30 days'
 * section and ask the user if they want to start with themselves (AI Brain) or
 * their business (AI revenue)"). The two answers are real links, so the reader
 * lands on one of the two pages with or without script; the orb only paints.
 * The business door reads "Your AI business" (Krish, 2026-11-11), the name
 * every link to /ai-gtm carries.
 */
const chooserMarkup = () => `<div class="hs-choose" data-hs-choose><span class="hs-choose-orb" aria-hidden="true"><span class="hs-choose-body" data-hs-orb></span><span class="hs-choose-shadow"></span></span><div class="hs-choose-bubble" role="group" aria-labelledby="hs-choose-q"><p id="hs-choose-q" class="hs-choose-q">Where do you want to start?</p><div class="hs-choose-doors"><a class="hs-choose-door" href="/ai-brain" data-choose="brain"><b>With yourself</b><span>Your AI brain</span><i aria-hidden="true">→</i></a><a class="hs-choose-door" href="/ai-gtm" data-choose="gtm"><b>With your business</b><span>Your AI business</span><i aria-hidden="true">→</i></a></div></div></div>`;

export function homepageSectionsMarkup() {
  return `<section id="history" class="hs-section hs-problem" aria-labelledby="hs-problem-title"><div class="hs-inner">${compareSlot("sheet")}<h2 id="hs-problem-title" class="hs-title">Every new technology asks us to change <span class="hs-mark" data-hs-mark="underline">how we think</span>.</h2><p class="hs-lede">Each time, the real question was who kept the judgement. With AI, it is the same question.</p><div class="hs-rail" data-hs-rail><ul class="hs-eras" data-hs-rail-track aria-label="Four times we have been here before, oldest first">${ERAS.map(eraMarkup).join("")}</ul>${railNav("era", ERAS.map((era) => era.stop))}</div></div></section>
      <section class="hs-section hs-get" aria-labelledby="hs-get-title"><div class="hs-inner"><h2 id="hs-get-title" class="hs-title">We build yours with you in <span class="hs-mark" data-hs-mark="underline">30 days</span>.</h2><p class="hs-lede">Then it is yours to grow. It starts with no sensitive material: your goals, your standards and the calls you have made are enough to begin.</p>${chooserMarkup()}<div class="hs-proof-deck" data-hs-deck><ul class="hs-proof" data-hs-deck-track>${PROOF.map(proofMarkup).join("")}</ul><div class="hs-deck-nav"><button type="button" data-hs-deck-step="-1" aria-label="Previous result" disabled>←</button><p><span data-hs-deck-at>1</span> of ${PROOF.length}</p><button type="button" data-hs-deck-step="1" aria-label="Next result">→</button></div></div><div class="hs-voices" data-hs-voices><ul class="hs-voices-stack" aria-label="What clients say">${VOICES.map((voice, index) => `<li${index ? "" : ' class="is-on"'}><q>${esc(voice.quote)}</q> <span class="hs-voices-who">${esc(voice.who)}</span></li>`).join("")}</ul><a class="hs-voices-link hs-explore" href="/case-studies">Explore what leaders built <span aria-hidden="true">→</span></a></div></div></section>
      `;
}

/**
 * A carousel: the card nearest the start is the current one, the stops whose
 * cards are mostly in view are lit, the arrows stop at either end, and where
 * every card already fits the controls go but keep their room.
 */
/**
 * The three results as the stories' swipe deck, with the same cards and the
 * same movement on every screen (owner, 2026-11-10: "the horizontal card
 * animation ... on this and the success story pages", "Same style and
 * movement on desktop"). The current result is on top; the ones already read
 * peek above it, a step smaller and darker; a sideways swipe or the arrows
 * move one result, and the page always scrolls normally. The deck arrives as
 * one piece, never card by card, so no card's arrival overrides its place in
 * the stack. Without script the three stay a row (homepageSections.css).
 */
function mountProofDeck(deck: HTMLElement, signal: AbortSignal) {
  const track = deck.querySelector<HTMLElement>("[data-hs-deck-track]");
  if (!track) return;
  const cards = [...track.children] as HTMLElement[];
  const counter = deck.querySelector<HTMLElement>("[data-hs-deck-at]");
  const prev = deck.querySelector<HTMLButtonElement>('[data-hs-deck-step="-1"]');
  const next = deck.querySelector<HTMLButtonElement>('[data-hs-deck-step="1"]');
  let at = 0;
  const wide = window.matchMedia?.(DECK_WIDE);
  const paint = () => {
    at = Math.max(0, Math.min(cards.length - 1, at));
    /* On a wide screen the results to come fan out to the right (2026-11-11). */
    paintDeckCards(cards, at, Boolean(wide?.matches), track, { fill: true });
    if (counter) counter.textContent = String(at + 1);
    if (prev) prev.disabled = at <= 0;
    if (next) next.disabled = at >= cards.length - 1;
  };
  const go = (step: number) => { at += step; paint(); };
  prev?.addEventListener("click", () => go(-1), { signal });
  next?.addEventListener("click", () => go(1), { signal });
  let drag: { x: number; y: number; t: number; id: number; moved: boolean } | null = null;
  let swallowClick = false;
  track.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    drag = { x: event.clientX, y: event.clientY, t: performance.now(), id: event.pointerId, moved: false };
  }, { signal });
  track.addEventListener("pointermove", (event) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) drag.moved = true;
    if (drag.moved) cards[at].style.translate = `${dx.toFixed(0)}px 0`;
  }, { signal });
  const release = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    const moved = drag.moved;
    const step = event.type === "pointercancel" ? 0 : swipeIntent(dx, dy, performance.now() - drag.t);
    drag = null;
    if (moved) swallowClick = true;
    if (step) go(step); else paint();
  };
  track.addEventListener("pointerup", release, { signal });
  track.addEventListener("pointercancel", release, { signal });
  track.addEventListener("click", (event) => {
    if (swallowClick) {
      swallowClick = false;
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    /* A result fanned out to the right comes to the front when pressed. */
    const card = (event.target as Element | null)?.closest?.("[data-hs-deck-track] > li") as HTMLElement | null;
    if (!card || card.dataset.deck === "current") return;
    at = cards.indexOf(card);
    paint();
  }, { capture: true, signal });
  wide?.addEventListener?.("change", paint, { signal } as AddEventListenerOptions);
  addEventListener("resize", paint, { passive: true, signal });
  deck.classList.add("is-deck");
  paint();
  signal.addEventListener("abort", () => {
    deck.classList.remove("is-deck");
    cards.forEach((card) => {
      delete card.dataset.deck;
      for (const property of ["--depth", "--ahead", "z-index", "translate"]) card.style.removeProperty(property);
      card.removeAttribute("inert");
    });
    track.style.removeProperty("--fan-step");
  });
}

function mountRail(rail: HTMLElement, signal: AbortSignal, reduced: boolean) {
  const track = rail.querySelector<HTMLElement>("[data-hs-rail-track]");
  const nav = rail.querySelector<HTMLElement>("[data-hs-rail-nav]");
  if (!track || !nav) return;
  const cards = [...track.children] as HTMLElement[];
  const stops = [...nav.querySelectorAll<HTMLButtonElement>("[data-hs-rail-go]")];
  const prev = nav.querySelector<HTMLButtonElement>('[data-hs-rail-step="-1"]');
  const next = nav.querySelector<HTMLButtonElement>('[data-hs-rail-step="1"]');
  const start = () => parseFloat(getComputedStyle(track).scrollPaddingLeft) || 0;
  const current = () => {
    let best = 0;
    cards.forEach((card, index) => { if (Math.abs(card.offsetLeft - start() - track.scrollLeft) < Math.abs(cards[best].offsetLeft - start() - track.scrollLeft)) best = index; });
    return best;
  };
  const paint = () => {
    if (!track.clientWidth) return;
    const left = track.scrollLeft;
    const end = left + track.clientWidth >= track.scrollWidth - 2;
    const at = end ? cards.length - 1 : current();
    stops.forEach((stop, index) => {
      const card = cards[index];
      const shown = Math.min(card.offsetLeft + card.offsetWidth, left + track.clientWidth) - Math.max(card.offsetLeft, left);
      stop.classList.toggle("is-seen", shown / card.offsetWidth > .6);
      if (index === at) stop.setAttribute("aria-current", "true");
      else stop.removeAttribute("aria-current");
    });
    nav.style.setProperty("--hs-progress", String(Math.min(1, (left + track.clientWidth) / track.scrollWidth)));
    if (prev) prev.disabled = left < 2;
    if (next) next.disabled = end;
    nav.style.visibility = track.scrollWidth <= track.clientWidth + 2 ? "hidden" : "";
  };
  const go = (index: number) => {
    const card = cards[Math.max(0, Math.min(cards.length - 1, index))];
    track.scrollTo?.({ left: card.offsetLeft - start(), behavior: reduced ? "auto" : "smooth" });
  };
  stops.forEach((stop, index) => stop.addEventListener("click", () => go(index), { signal }));
  prev?.addEventListener("click", () => go(current() - 1), { signal });
  next?.addEventListener("click", () => go(current() + 1), { signal });
  let frame = 0;
  track.addEventListener("scroll", () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(paint); }, { passive: true, signal });
  addEventListener("resize", paint, { passive: true, signal });
  paint();
  void document.fonts?.ready.then(paint);
}

/**
 * The voices take turns in one place: every voice shares one cell, so the line
 * is always the height of the longest and a turn moves nothing. A voice holds
 * for seven seconds, waits while a pointer or focus rests on the line or the
 * line is off screen, and never turns with reduced motion or without script.
 */
function mountVoices(root: HTMLElement, signal: AbortSignal, reduced: boolean) {
  const items = [...root.querySelectorAll<HTMLElement>(".hs-voices-stack > li")];
  if (reduced || items.length < 2) return;
  let at = 0;
  let held = false;
  const hold = (value: boolean) => () => { held = value; };
  root.addEventListener("pointerenter", hold(true), { signal });
  root.addEventListener("pointerleave", hold(false), { signal });
  root.addEventListener("focusin", hold(true), { signal });
  root.addEventListener("focusout", hold(false), { signal });
  const onScreen = () => { const box = root.getBoundingClientRect(); return box.bottom > 0 && box.top < innerHeight; };
  const timer = setInterval(() => {
    if (held || !onScreen() || document.hidden) return;
    items[at].classList.remove("is-on");
    at = (at + 1) % items.length;
    items[at].classList.add("is-on");
  }, 7000);
  signal.addEventListener("abort", () => clearInterval(timer));
}

/**
 * The eras turn on a tap: the question gives way to what actually happened,
 * in the same place, so a tile never changes size. Without script a tile shows
 * both, and each carousel is a row to swipe (homepageSections.css).
 */
export function mountHomepageSections(root: HTMLElement) {
  const abort = new AbortController();
  const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
  root.querySelectorAll<HTMLButtonElement>("[data-hs-era]").forEach((tile) => {
    tile.addEventListener("click", () => tile.setAttribute("aria-pressed", String(tile.getAttribute("aria-pressed") !== "true")), { signal: abort.signal });
  });
  root.querySelectorAll<HTMLElement>("[data-hs-rail]").forEach((rail) => mountRail(rail, abort.signal, reduced));
  root.querySelectorAll<HTMLElement>("[data-hs-deck]").forEach((deck) => mountProofDeck(deck, abort.signal));
  root.querySelectorAll<HTMLElement>("[data-hs-voices]").forEach((voices) => mountVoices(voices, abort.signal, reduced));
  const orbs = [...root.querySelectorAll<HTMLElement>("[data-hs-orb]")].map((host) => mountLiquidOrb(host, { reduced, size: () => host.getBoundingClientRect().width || 84 }));
  root.querySelectorAll<HTMLAnchorElement>("[data-choose]").forEach((door) => {
    door.addEventListener("click", () => track("door_click", { source: "orb", to: door.getAttribute("href") ?? "" }), { signal: abort.signal });
  });
  /* Each section builds as the reader reaches it (src/lib/scrollBuild.ts). */
  const unbuild = buildOnScroll(root, {
    sections: ".hs-section",
    title: ".hs-title",
    lede: ".hs-lede",
    splitLede: true,
    items: ".hs-eras > li, .hs-proof-deck, .hs-inner > .hs-close, .hs-inner > .hs-proof-links, .hs-inner > .hs-voices, .hs-inner > .hs-choose, .hs-rail-nav",
  });
  return () => { abort.abort(); unbuild(); orbs.forEach((orb) => orb.destroy()); };
}
