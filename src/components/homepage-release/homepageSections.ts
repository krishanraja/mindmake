import writingImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-writing-s2.webp";
import loomImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-loom-s2.webp";
import calculatorImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-calculator-s2.webp";
import satnavImage from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-satnav-s2.webp";
import { leadershipScenes, leadershipStories, organisationGridMarkup } from "@/components/leadership-chapters/leadershipChapters";
import latestIssue from "@/data/latestIssue.json";
import { PUBLICATION_URL, START_LABEL, START_SUBLABEL } from "@/lib/publicLinks";

/**
 * The homepage after its opening, in three sections (Ruling, Krish,
 * 2026-10-24: "drastically simplify everything here to be probably three
 * sections"; every page answers what problem it solves, how it solves it, and
 * what the reader gets and how they know it works).
 *
 * 1. The problem: right now your AI is an intern, and we have been here
 *    before. The four eras of the old history chapter, each on its own picture
 *    from that chapter, in a carousel swiped through time from left to right;
 *    a tile turns on a tap; nothing pins ("keeping a user here for so long
 *    through the scroll... is not worth it").
 * 2. How it works: a chief of staff knows how you think. The organisation from
 *    the reach chapter and the three practice scenes in a carousel of their
 *    own; the returned hour becomes one line ("a great message... not worth a
 *    full section").
 * 3. What you get: three true results, each on its story's own picture, the
 *    stories on /ai-brain, and the way in.
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

/** The practice scenes' own names, as the timeline under their carousel. */
const SCENE_STOPS = ["Notice", "Connect", "Prepare"] as const;

/** A result's picture is its story's own scene on /ai-brain, found by its record. */
const sceneOf = (record: string) => leadershipStories.find((story) => story.record === record)?.scene ?? "";

/** Three results on the record, in the words already approved on the site. */
const PROOF = [
  { record: "own-system", story: "A founder who posted about once a month now posts most days.", outcome: "A post backed by research now takes under an hour." },
  { record: "hand-back", story: "A CEO who hates writing can still publish ideas worth following.", outcome: "Five videos went out in the first week." },
  {
    record: "market-moves",
    quote: "We set up an AI-native go-to-market system that made us rethink who we hire and what they do.",
    outcome: "A new sales path led to a paid test with a major US publisher.",
    who: "Chief Revenue Officer, data-infrastructure company",
  },
] as const;

const startButton = () => `<button type="button" class="hs-start-button" data-start-route="brain" data-mm-primary>${START_LABEL} <span aria-hidden="true">→</span></button>`;

/** The hero's way in and the publication line, after the doors (desktop and phone). */
export function heroStartMarkup() {
  return `<div class="hs-start">${startButton()}<small class="hs-start-note">${START_SUBLABEL}</small></div><p class="hs-issue"><span class="hs-issue-label">From Make Your Mind Up</span> <a class="hs-issue-title" href="${esc(latestIssue.url)}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_hero">${esc(latestIssue.title)}</a> <a class="hs-issue-subscribe" href="${PUBLICATION_URL}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_hero">Get it free, three times a week <span aria-hidden="true">↗</span></a></p>`;
}

/** The subscribe link beside the menu in the homepage masthead (Krish, 2026-10-24). */
export function mastheadSubscribeMarkup() {
  return `<a class="hs-subscribe" href="${PUBLICATION_URL}" target="_blank" rel="noreferrer" data-subscribe-source="masthead">Subscribe</a>`;
}

/** A picture behind a card: decorative, so it has no name and loads when near. */
const cardImage = (src: string) => `<img class="hs-card-img" src="${esc(src)}" alt="" width="800" height="450" loading="lazy" decoding="async" />`;

/**
 * Under a carousel: back and forward, and the stops it moves through, left to
 * right. The stops light as their cards come into view, so the reader sees
 * where they are in the sequence and that there is more to the right.
 */
const railNav = (noun: string, stops: readonly string[]) =>
  `<div class="hs-rail-nav" data-hs-rail-nav><button type="button" class="hs-rail-step" data-hs-rail-step="-1" aria-label="Previous ${noun}" disabled><span aria-hidden="true">←</span></button><ol class="hs-rail-stops" style="--hs-stops:${stops.length}">${stops.map((stop, index) => `<li><button type="button" data-hs-rail-go="${index}"${index ? "" : ' aria-current="true"'}>${stop}</button></li>`).join("")}</ol><button type="button" class="hs-rail-step" data-hs-rail-step="1" aria-label="Next ${noun}"><span aria-hidden="true">→</span></button></div>`;

const eraMarkup = ({ when, image, question, answer }: (typeof ERAS)[number]) =>
  `<li><button type="button" class="hs-era" aria-pressed="false" data-hs-era>${cardImage(image)}<span class="hs-era-when">${when}</span><span class="hs-era-faces"><span class="hs-era-q">“${question}”</span><span class="hs-era-a"><b>What actually happened instead</b>${answer}</span></span><span class="hs-era-mark" aria-hidden="true"></span></button></li>`;

const proofMarkup = (item: (typeof PROOF)[number]) => "quote" in item
  ? `<li>${cardImage(sceneOf(item.record))}<blockquote class="hs-proof-story">“${item.quote}”</blockquote><p class="hs-proof-outcome">${item.outcome}</p><p class="hs-proof-who">${item.who}</p></li>`
  : `<li>${cardImage(sceneOf(item.record))}<p class="hs-proof-story">${item.story}</p><p class="hs-proof-outcome">${item.outcome}</p><p class="hs-proof-who" aria-hidden="true"></p></li>`;

export function homepageSectionsMarkup() {
  const trio = leadershipScenes.map(([, poster, title, line], index) => `<li><img src="${esc(poster)}" alt="" width="640" height="400" loading="lazy" decoding="async" /><small>0${index + 1}</small><h4>${title}</h4><p>${line}</p></li>`).join("");
  return `<section id="history" class="hs-section hs-problem" aria-labelledby="hs-problem-title"><div class="hs-inner"><h2 id="hs-problem-title" class="hs-title">Right now, your AI is an intern.</h2><p class="hs-lede">It has read the whole internet and knows nothing about you. It drafts fast. It cannot make your call.</p><h3 class="hs-subtitle">We've been here before.</h3><div class="hs-rail" data-hs-rail><ul class="hs-eras" data-hs-rail-track aria-label="Four times we have been here before, oldest first">${ERAS.map(eraMarkup).join("")}</ul>${railNav("era", ERAS.map((era) => era.stop))}</div><p class="hs-close">Every time, the people who kept their judgement in charge came out ahead. The feeling is the same. <em>The scale is not.</em></p></div></section>
      <section class="hs-section hs-how" aria-labelledby="hs-how-title"><div class="hs-inner"><h2 id="hs-how-title" class="hs-title">A chief of staff knows how you think.</h2><p class="hs-lede">An AI brain holds your taste, standards and judgement, and brings them to the AI you already use. It carries the work. You keep the calls.</p><div class="nal-page mm-home-leadership hs-org"><div class="hybrid-organisation is-active"><p class="instrument-label"><span></span>New-age leadership</p>${organisationGridMarkup}</div></div><p class="hs-carries"><span><b>AI carries</b> gather, connect, compare, monitor, prepare</span> <span><b>You keep</b> taste, judgement, relationships, the decision</span></p><h3 class="hs-subtitle">When built right, <em>AI is our biggest level-up.</em></h3><div class="hs-rail" data-hs-rail><ol class="hs-trio" data-hs-rail-track tabindex="0" aria-label="What it does, in three scenes">${trio}</ol>${railNav("scene", SCENE_STOPS)}</div><p class="hs-reinvest">And the hours it hands back go into the work only you can do.</p></div></section>
      <section class="hs-section hs-get" aria-labelledby="hs-get-title"><div class="hs-inner"><h2 id="hs-get-title" class="hs-title">Built on your real work. Yours to keep.</h2><p class="hs-lede">We build the first working version with you, prove it on real decisions, and leave it running.</p><ul class="hs-proof">${PROOF.map(proofMarkup).join("")}</ul><p class="hs-proof-links"><a href="/ai-brain#stories">See where you would start</a> <a href="/case-studies">Success stories</a></p><div class="hs-start">${startButton()}</div></div></section>
      `;
}

/**
 * A carousel: the card nearest the start is the current one, the stops whose
 * cards are mostly in view are lit, the arrows stop at either end, and where
 * every card already fits the controls go but keep their room.
 */
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
  return () => abort.abort();
}
