import writingImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-writing-s2.webp";
import loomImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-loom-s2.webp";
import calculatorImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-calculator-s2.webp";
import satnavImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-satnav-s2.webp";
import latestIssue from "@/data/latestIssue.json";
import { attendeeBrands } from "@/data/rebuildProof";
import { canShowStoryQuote, featuredQuotes, publicClientQuotes, testimonials } from "@/data/testimonials";
import { partSlug, WAYS, type BrainPart, type WayCard } from "@/data/ways";
import { PUBLICATION_URL, START_LABEL, SUBSCRIBE_LABEL } from "@/lib/publicLinks";
import { placeholderFor, srcsetFor } from "@/lib/responsiveImages";
import { buildOnScroll } from "@/lib/scrollBuild";
import { track } from "@/lib/analytics";
import { swipeIntent, tieLast } from "@/components/leadership-chapters/storyFinder";
import { mountTiltCards } from "@/lib/tiltCard";
import { revealOnArrival } from "@/hooks/useReveal";

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


/** The close's one voice: the publisher, in its approved story excerpt. */
const CLOSING_VOICE = (() => {
  const voice = testimonials.find(record => record.id === "publisher-ops")!;
  const quote = voice.useCaseExcerpts!["C-17"]!;
  return canShowStoryQuote(quote) ? { quote, who: voice.role } : undefined;
})();

/**
 * "In their words." (moved from /case-studies on 2026-11-28): every client
 * quote that may be shown whole, featured voices first, one in front at a
 * time. All of them share one cell, so the box is always the height of the
 * longest and a turn moves nothing.
 */
const QUOTES = [...featuredQuotes, ...publicClientQuotes.filter((voice) => !voice.featured)].filter((voice) => canShowStoryQuote(voice.full));

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

/* A small brain with its six parts, the card's own part lit (the /ai-brain map). */
const PART_DOTS: Record<BrainPart, [number, number]> = {
  "North Star": [23, 17], Vision: [20.5, 6.5], Judgement: [37, 13], Taste: [10, 12.5], Standards: [19, 26], Preferences: [37, 25.5],
};
const brainGlyph = (lit: BrainPart) =>
  `<svg class="vs-tilt-card-glyph" viewBox="0 0 46 34" aria-hidden="true"><path d="M23 3.5c-3-2.2-8.4-2.1-11 .9-4.4-.3-7.7 3-7.2 7.1C2 13.6 2 18 4.6 20.3c-.4 4 2.9 7.4 7 7.1 2.4 3.3 7.6 3.9 11.4 1.4 3.8 2.5 9 1.9 11.4-1.4 4.1.3 7.4-3.1 7-7.1 2.6-2.3 2.6-6.7 0-8.8.5-4.1-2.8-7.4-7.2-7.1-2.6-3-8-3.1-11-.9Z"/><path d="M23 3.5v25.3"/>${(Object.entries(PART_DOTS) as [BrainPart, [number, number]][]).map(([part, [x, y]]) => `<circle cx="${x}" cy="${y}" r="${part === lit ? 2.6 : 1.7}"${part === lit ? ' class="is-lit"' : ""}/>`).join("")}</svg>`;

const turnIcon = `<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M10 6a4 4 0 1 1-1.2-2.85"/><path d="M9.2 1.2v2.2H7"/></svg>`;

const wayBack = (card: WayCard) => card.back.kind === "lever"
  ? `<p class="vs-tilt-card-back-title">${esc(tieLast(card.back.input))}</p><p class="vs-tilt-card-back-line">${esc(tieLast(card.back.question))}</p><p class="vs-tilt-card-result">Your AI brain asks before you decide<small class="vs-tilt-card-label">${esc(card.back.title)}</small></p>`
  : card.back.kind === "story"
  ? `<p class="vs-tilt-card-back-title">${esc(tieLast(card.back.heading))}</p><p class="vs-tilt-card-back-line">${esc(tieLast(card.back.outcome))}</p>${card.back.result ? `<p class="vs-tilt-card-result">${esc(tieLast(card.back.result))}<small>Result on the record</small></p>` : '<p class="vs-tilt-card-result">A practice account<small class="vs-tilt-card-label">From our own work</small></p>'}`
  : `<p class="vs-tilt-card-back-title">${esc(tieLast(card.back.title))}</p><p class="vs-tilt-card-back-line">${esc(tieLast(card.back.leave))}</p><p class="vs-tilt-card-result">An illustration of the work<small class="vs-tilt-card-label">Example</small></p>`;

const wayImage = (src: string) => {
  const srcset = srcsetFor(src, 800);
  const placeholder = placeholderFor(src);
  return `<img class="vs-tilt-card-img" src="${esc(src)}"${srcset ? ` srcset="${esc(srcset)}" sizes="(max-width: 760px) 80vw, 330px"` : ""} alt="" width="800" height="1191" loading="lazy" decoding="async" draggable="false"${placeholder ? ` style="background:#f1ead9 url(${placeholder}) center / cover"` : ""} />`;
};

const wayMarkup = (card: WayCard, index: number) =>
  `<li><div class="vs-tilt-card" data-way="${card.wish}" data-part="${partSlug(card.part)}"><div class="vs-tilt-card-shadow" aria-hidden="true"></div><div class="vs-tilt-card-body"><div class="vs-tilt-card-face vs-tilt-card-front">${wayImage(card.art)}<div class="vs-tilt-card-scrim"></div><div class="vs-tilt-card-foil" aria-hidden="true"><i></i></div><div class="vs-tilt-card-content"><p class="vs-tilt-card-row"><span class="vs-tilt-card-part"><i class="vs-tilt-card-dot" aria-hidden="true"></i>${esc(card.part)}</span></p><h3 class="vs-tilt-card-title">${esc(tieLast(card.front))}</h3><p class="vs-tilt-card-foot"><span>${String(index + 1).padStart(2, "0")} / ${String(WAYS.length).padStart(2, "0")}</span><span class="vs-tilt-card-turn" aria-hidden="true">Turn ${turnIcon}</span></p></div><div class="vs-tilt-card-glare" aria-hidden="true"><i></i></div></div><div class="vs-tilt-card-face vs-tilt-card-back"><div class="vs-tilt-card-foil" aria-hidden="true"><i></i></div><div class="vs-tilt-card-content"><p class="vs-tilt-card-row">${brainGlyph(card.part)}<span>${esc(card.part)}</span></p>${wayBack(card)}</div><div class="vs-tilt-card-glare" aria-hidden="true"><i></i></div></div></div><button type="button" class="vs-tilt-card-toggle" aria-pressed="false" aria-label="${esc(card.front)} Turn the card over"></button></div></li>`;

const quoteMarkup = (voice: (typeof QUOTES)[number], index: number) =>
  `<li${index ? "" : ' class="is-on"'} id="q-${esc(voice.id)}"><blockquote><p>“${esc(tieLast(voice.full))}”</p></blockquote><p class="hs-words-who">${voice.name ? `<cite>${esc(voice.name)}</cite> ` : ""}${esc(tieLast(voice.role))}</p></li>`;

const logoCells = (copy: boolean) => attendeeBrands.map((brand) => `<li class="hs-logo-cell"><img src="${esc(brand.logo)}" alt="${copy ? "" : esc(brand.name)}" loading="eager" decoding="async"${brand.scale ? ` style="height:calc(var(--hs-logo-h) * ${brand.scale})"` : ""} /></li>`).join("");

const wordsMarkup = () => `<section id="words" class="hs-section hs-words" aria-labelledby="words-title"><div class="hs-inner"><div class="hs-words-head"><h2 id="words-title" class="hs-title">In their words.</h2><div class="hs-words-nav"><button type="button" data-hs-words-step="-1" aria-label="Previous quote" disabled>←</button><p aria-live="polite" aria-atomic="true"><span data-hs-words-at>1</span> of ${QUOTES.length}</p><button type="button" data-hs-words-step="1" aria-label="Next quote">→</button></div></div><ul class="hs-words-stack" data-hs-words aria-label="What clients say">${QUOTES.map(quoteMarkup).join("")}</ul><p class="hs-count"><span class="hs-count-figure" data-hs-count aria-hidden="true">4000+</span><span class="hs-visually-hidden">4000+ </span> leaders who have adopted mind/make thinking, from businesses including</p><div class="hs-logos"><div class="hs-logos-track"><ul aria-label="Businesses our attendees come from">${logoCells(false)}</ul><ul class="hs-logos-copy" aria-hidden="true">${logoCells(true)}</ul></div></div></div></section>`;

const waysMarkup = () => `<section id="ways" class="hs-section hs-ways" aria-labelledby="ways-title"><div class="hs-inner"><h2 id="ways-title" class="hs-title">Ways an AI brain can level <span class="hs-you">you</span> up.</h2><div class="hs-rail" data-hs-rail><ul class="hs-ways-track" data-hs-rail-track aria-label="Ways an AI brain helps, one card each; turn a card for its story">${WAYS.map(wayMarkup).join("")}</ul>${railNav("card", WAYS.map((_, index) => String(index + 1).padStart(2, "0")))}</div></div></section>`;

export function homepageSectionsMarkup() {
  return `<section id="history" class="hs-section hs-problem" aria-labelledby="hs-problem-title"><div class="hs-inner">${compareSlot("sheet")}<h2 id="hs-problem-title" class="hs-title">Every new technology asks us to change <span class="hs-mark" data-hs-mark="underline">how we think</span>.</h2><p class="hs-lede">Each time, the real question was who kept the judgement. With AI, it is the same question.</p><div class="hs-rail" data-hs-rail><ul class="hs-eras" data-hs-rail-track aria-label="Four times we have been here before, oldest first">${ERAS.map(eraMarkup).join("")}</ul>${railNav("era", ERAS.map((era) => era.stop))}</div></div></section>
      ${waysMarkup()}${wordsMarkup()}<section class="hs-section hs-build" aria-labelledby="hs-get-title"><div class="hs-inner"><h2 id="hs-get-title" class="hs-title">We build yours with you in <span class="hs-mark" data-hs-mark="underline">30 days</span>.</h2><p class="hs-lede">Then it is yours to grow. It starts with no sensitive material: your goals, your standards and the calls you have made are enough to begin.</p><details class="journey-detail"><summary>A rule worth keeping</summary><p>If you always keep the final edit, your AI brain can bring that rule back when a sponsor asks for approval.</p></details>${CLOSING_VOICE ? `<p class="hs-closing-voice"><q>${esc(CLOSING_VOICE.quote)}</q> <span class="hs-voices-who">${esc(CLOSING_VOICE.who)}</span></p>` : ""}<div class="journey-end"><button type="button" class="mm-button" data-mm-primary data-start-route="brain">Start your brief</button><a href="/ai-brain">Inside an AI brain <span aria-hidden="true">→</span></a></div></div></section>
      `;
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
 * "In their words.": one quote in front, moved only by the arrows or a
 * sideways swipe, never by a timer. Every quote shares one cell, so the box is
 * always the height of the longest and a turn moves nothing. An address that
 * names a quote (#q-<id>) brings it to the front.
 */
function mountWords(section: HTMLElement, signal: AbortSignal) {
  const stack = section.querySelector<HTMLElement>("[data-hs-words]");
  if (!stack) return;
  const items = [...stack.children] as HTMLElement[];
  const at = section.querySelector<HTMLElement>("[data-hs-words-at]");
  const prev = section.querySelector<HTMLButtonElement>('[data-hs-words-step="-1"]');
  const next = section.querySelector<HTMLButtonElement>('[data-hs-words-step="1"]');
  let index = 0;
  const paint = () => {
    index = Math.max(0, Math.min(items.length - 1, index));
    items.forEach((item, i) => {
      item.classList.toggle("is-on", i === index);
      if (i === index) { item.removeAttribute("aria-hidden"); item.removeAttribute("inert"); }
      else { item.setAttribute("aria-hidden", "true"); item.setAttribute("inert", ""); }
    });
    if (at) at.textContent = String(index + 1);
    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= items.length - 1;
  };
  prev?.addEventListener("click", () => { index -= 1; paint(); }, { signal });
  next?.addEventListener("click", () => { index += 1; paint(); }, { signal });
  let drag: { x: number; y: number; t: number; id: number } | null = null;
  stack.addEventListener("pointerdown", (event) => { if (event.pointerType !== "mouse" || event.button === 0) drag = { x: event.clientX, y: event.clientY, t: performance.now(), id: event.pointerId }; }, { signal });
  const release = (event: PointerEvent) => {
    if (!drag || drag.id !== event.pointerId) return;
    const by = event.type === "pointercancel" ? 0 : swipeIntent(event.clientX - drag.x, event.clientY - drag.y, performance.now() - drag.t);
    drag = null;
    if (by) { index += by; paint(); }
  };
  stack.addEventListener("pointerup", release, { signal });
  stack.addEventListener("pointercancel", release, { signal });
  const fromHash = () => {
    const match = /^#q-(.+)$/.exec(location.hash);
    const found = match ? items.findIndex((item) => item.id === `q-${decodeURIComponent(match[1])}`) : -1;
    if (found < 0) return;
    index = found;
    paint();
    section.scrollIntoView({ block: "start" });
  };
  addEventListener("hashchange", fromHash, { signal });
  section.classList.add("is-live");
  paint();
  fromHash();
}

/**
 * The attendance count runs up to 4000+ the first time it comes into view.
 * The page always carries the settled figure, so a reader without script or
 * with reduced motion, and a crawler, read "4000+".
 */
function mountCount(figure: HTMLElement, signal: AbortSignal, reduced: boolean) {
  if (reduced) return;
  let frame = 0;
  const line = figure.closest<HTMLElement>(".hs-count") ?? figure;
  /* The site's one arrival primitive (src/hooks/useReveal.ts) says when the
     line is reached; if it is already on screen the count runs at once. */
  const unreveal = revealOnArrival(line, 0, () => {
    if (signal.aborted) return;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / 1400));
      figure.textContent = t < 1 ? String(Math.round(4000 * (1 - Math.pow(1 - t, 3)))) : "4000+";
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
  });
  signal.addEventListener("abort", () => { unreveal(); cancelAnimationFrame(frame); figure.textContent = "4000+"; });
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
  const unTilt = mountTiltCards(root);
  root.querySelectorAll<HTMLElement>(".hs-words").forEach((section) => mountWords(section, abort.signal));
  root.querySelectorAll<HTMLElement>("[data-hs-count]").forEach((figure) => mountCount(figure, abort.signal, reduced));
  /* Each section builds as the reader reaches it (src/lib/scrollBuild.ts). */
  const unbuild = buildOnScroll(root, {
    sections: ".hs-section",
    title: ".hs-title",
    lede: ".hs-lede",
    splitLede: true,
    items: ".hs-build .journey-detail, .hs-closing-voice, .journey-end, .hs-eras > li, .hs-ways-track > li, .hs-words-stack, .hs-logos, .hs-rail-nav",
  });
  return () => { abort.abort(); unTilt(); unbuild(); };
}
