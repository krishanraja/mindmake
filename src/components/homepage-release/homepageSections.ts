import { leadershipScenes, organisationGridMarkup } from "@/components/leadership-chapters/leadershipChapters";
import latestIssue from "@/data/latestIssue.json";
import { PUBLICATION_URL, START_LABEL, START_SUBLABEL } from "@/lib/publicLinks";

/**
 * The homepage after its opening, in three sections (Ruling, Krish,
 * 2026-10-24: "drastically simplify everything here to be probably three
 * sections"; every page answers what problem it solves, how it solves it, and
 * what the reader gets and how they know it works).
 *
 * 1. The problem: right now your AI is an intern, and we have been here
 *    before. The four eras of the old history chapter read in two seconds and
 *    turn on a tap; nothing pins ("keeping a user here for so long through the
 *    scroll... is not worth it").
 * 2. How it works: a chief of staff knows how you think. The organisation from
 *    the reach chapter and the three practice scenes, still; the returned hour
 *    becomes one line ("a great message... not worth a full section").
 * 3. What you get: three true results, the stories on /ai-brain, and the way in.
 *
 * Hand-written, like heroRotation.ts; scripts/qa/build-homepage-release.mjs
 * injects it between the R3 opening and footer, and the hero's way in after
 * the doors. Every word here is approved copy or the copy Krish approved in the
 * rendered mocks of 24 October 2026.
 */

const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

/** The four eras, in the history chapter's own approved words. */
const ERAS = [
  ["370 BC · Writing", "If knowledge lives outside us, will memory grow weaker?", "Ideas could travel beyond one voice and survive their maker. We changed what memory was for."],
  ["1675 · Engine loom", "If the machine can do the work, what happens to the worker?", "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain."],
  ["1970s · Calculator", "If the device does the arithmetic, will children stop learning to think?", "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer."],
  ["2000s · Satnav", "If the device knows the route, will we lose our sense of direction?", "That risk turned out to be real. A useful tool still asks us what we choose to keep practising."],
] as const;

/** Three results on the record, in the words already approved on the site. */
const PROOF = [
  { story: "A founder who posted about once a month now posts most days.", outcome: "A post backed by research now takes under an hour." },
  { story: "A CEO who hates writing can still publish ideas worth following.", outcome: "Five videos went out in the first week." },
  {
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

const eraMarkup = ([when, question, answer]: readonly [string, string, string]) =>
  `<li><button type="button" class="hs-era" aria-pressed="false" data-hs-era><span class="hs-era-when">${when}</span><span class="hs-era-faces"><span class="hs-era-q">“${question}”</span><span class="hs-era-a"><b>What actually happened instead</b>${answer}</span></span><span class="hs-era-mark" aria-hidden="true"></span></button></li>`;

const proofMarkup = (item: (typeof PROOF)[number]) => "quote" in item
  ? `<li><blockquote class="hs-proof-story">“${item.quote}”</blockquote><p class="hs-proof-outcome">${item.outcome}</p><p class="hs-proof-who">${item.who}</p></li>`
  : `<li><p class="hs-proof-story">${item.story}</p><p class="hs-proof-outcome">${item.outcome}</p><p class="hs-proof-who" aria-hidden="true"></p></li>`;

export function homepageSectionsMarkup() {
  const trio = leadershipScenes.map(([, poster, title, line], index) => `<li><img src="${esc(poster)}" alt="" width="640" height="400" loading="lazy" decoding="async" /><small>0${index + 1}</small><h4>${title}</h4><p>${line}</p></li>`).join("");
  return `<section id="history" class="hs-section hs-problem" aria-labelledby="hs-problem-title"><div class="hs-inner"><h2 id="hs-problem-title" class="hs-title">Right now, your AI is an intern.</h2><p class="hs-lede">It has read the whole internet and knows nothing about you. It drafts fast. It cannot make your call.</p><h3 class="hs-subtitle">We've been here before.</h3><ul class="hs-eras">${ERAS.map(eraMarkup).join("")}</ul><p class="hs-close">Every time, the people who kept their judgement in charge came out ahead. The feeling is the same. <em>The scale is not.</em></p></div></section>
      <section class="hs-section hs-how" aria-labelledby="hs-how-title"><div class="hs-inner"><h2 id="hs-how-title" class="hs-title">A chief of staff knows how you think.</h2><p class="hs-lede">An AI brain holds your taste, standards and judgement, and brings them to the AI you already use. It carries the work. You keep the calls.</p><div class="nal-page mm-home-leadership hs-org"><div class="hybrid-organisation is-active"><p class="instrument-label"><span></span>New-age leadership</p>${organisationGridMarkup}</div></div><p class="hs-carries"><span><b>AI carries</b> gather, connect, compare, monitor, prepare</span> <span><b>You keep</b> taste, judgement, relationships, the decision</span></p><h3 class="hs-subtitle">When built right, <em>AI is our biggest level-up.</em></h3><ol class="hs-trio">${trio}</ol><p class="hs-reinvest">And the hours it hands back go into the work only you can do.</p></div></section>
      <section class="hs-section hs-get" aria-labelledby="hs-get-title"><div class="hs-inner"><h2 id="hs-get-title" class="hs-title">Built on your real work. Yours to keep.</h2><p class="hs-lede">We build the first working version with you, prove it on real decisions, and leave it running.</p><ul class="hs-proof">${PROOF.map(proofMarkup).join("")}</ul><p class="hs-proof-links"><a href="/ai-brain#stories">See where you would start</a> <a href="/case-studies">Success stories</a></p><div class="hs-start">${startButton()}</div></div></section>
      `;
}

/**
 * The eras turn on a tap: the question gives way to what actually happened,
 * in the same place, so a tile never changes size. Without script a tile shows
 * both (homepageSections.css).
 */
export function mountHomepageSections(root: HTMLElement) {
  const abort = new AbortController();
  root.querySelectorAll<HTMLButtonElement>("[data-hs-era]").forEach((tile) => {
    tile.addEventListener("click", () => tile.setAttribute("aria-pressed", String(tile.getAttribute("aria-pressed") !== "true")), { signal: abort.signal });
  });
  return () => abort.abort();
}
