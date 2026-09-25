import signalsPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp";
import evidencePoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp";
import communicationsPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp";
import readyPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import signalsFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import communicationsFilm from "@/assets/films/sep2026/communications-compose-loop-r01-20s-720p-web-sealed.mp4";
import readyFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";

/**
 * The three new-age leadership chapters: the organisation changing shape,
 * the system in practice, and what the AI Brain makes possible with the
 * returned hour. One source serves /new-age-leadership and the homepage, so
 * the approved words and their scroll behaviour cannot drift between them.
 * Both pages render it inside a `.nal-page` scope, which the R5 stylesheet
 * needs. The films are decorative plates behind copy that already says what
 * they show, so they are hidden from assistive technology.
 */
const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

export const leadershipBenefits = [
  ["Leadership updates become consistent, even when the week was not.", "Your decisions, risks and priorities stay connected from one update to the next."],
  ["Work nobody owns becomes visible before it becomes a problem.", "The Brain joins the gaps across reports, meetings and decisions."],
  ["A change in market pricing becomes a decision, not a forgotten observation.", "It connects the signal to what your commercial team already knows."],
  ["A CEO who hates writing can still publish ideas worth following.", "The blank page goes. Their judgement and voice stay."],
  ["A CRO who hates the numbers can become better at using them.", "The Brain prepares what changed, why it matters and where to look next."],
  ["Founder-led content can begin with the work, not another content calendar.", "Useful thinking already inside the business becomes something people can see."],
] as const;

export const leadershipScenes = [
  [signalsFilm, signalsPoster, "It notices what changed.", "Signals arrive before someone asks for a report."],
  [evidenceFilm, evidencePoster, "It joins the evidence.", "New information meets what the business already knows."],
  [communicationsFilm, communicationsPoster, "It prepares the next move.", "Useful work reaches you ready for a decision."],
] as const;

const reels = (items: string[]) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul><ul aria-hidden="true">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;

export interface LeadershipChaptersMarkupOptions {
  /**
   * "organisation" renders the reach chapter as its second state alone, as one
   * still screen with no scroll track. The homepage uses it (Ruling, Krish,
   * 2026-09-25): its first state, "The feeling is familiar. The reach is new.",
   * answers the history chapter that /new-age-leadership has and the homepage
   * does not, and its sources cite that history.
   */
  opening?: "boundary" | "organisation";
}

export function leadershipChaptersMarkup({ opening = "boundary" }: LeadershipChaptersMarkupOptions = {}) {
  const brainBenefits = leadershipBenefits.map((b, i) => `<article class="brain-benefit${i ? "" : " is-active"}" data-benefit="${i}" aria-hidden="${Boolean(i)}"><h2${i ? "" : ' id="proof-title"'}>${b[0]}</h2><p>${b[1]}</p></article>`).join("");
  const scenes = leadershipScenes.map((s, i) => `<article class="work-scene${i ? "" : " is-active"}" data-work-scene="${i}"><video muted loop playsinline preload="${i ? "none" : "metadata"}" aria-hidden="true" poster="${esc(s[1])}"><source src="${esc(s[0])}" type="video/mp4" /></video><div class="work-wash"></div><div><small>0${i + 1}</small><h3>${s[2]}</h3><p>${s[3]}</p></div></article>`).join("");
  const reach = opening === "organisation"
    ? `<section class="reach-sequence reach-organisation-only" data-reach-static aria-labelledby="reach-title"><div class="reach-sticky"><video muted loop playsinline preload="metadata" aria-hidden="true" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="reach-wash" aria-hidden="true"></div><div class="reach-copy"><p class="kicker"><span></span>And now, AI</p><div class="reach-copy-state is-active" data-reach-copy="organisation"><h2 id="reach-title">The organisation<br /><em>changes shape.</em></h2><p>People hold judgement. The AI Brain connects the work.</p></div></div><div class="reach-stage"><div class="hybrid-organisation is-active" data-reach-panel="organisation"><p class="instrument-label"><span></span>New-age leadership</p><div class="organisation-grid" aria-label="A hybrid organisation made from people, an AI Brain and shared roles"><article class="org-cell org-leader"><small>Human</small><strong>Leader</strong><span>Direction · judgement</span></article><article class="org-cell org-chief"><small>Human</small><strong>Chief of Staff</strong><span>Trust · context</span></article><article class="org-cell org-brain"><small>System</small><strong>AI Brain</strong><span>Memory · links</span></article><article class="org-cell org-signals"><small>Agent</small><strong>Market signals</strong><span>Watches change</span></article><article class="org-cell org-marketing"><small>Hybrid</small><strong>Marketing</strong><span>Person leads</span></article><article class="org-cell org-research"><small>Hybrid</small><strong>Research</strong><span>People listen</span></article><article class="org-cell org-sales"><small>Agent</small><strong>Sales research</strong><span>People build trust</span></article><article class="org-cell org-brief"><small>New role</small><strong>Executive brief</strong><span>One view</span></article><div class="organisation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div><p class="film-mark">Illustrative machinery</p></div></section>`
    : `<section class="reach-sequence" data-reach aria-labelledby="reach-title"><div class="reach-sticky"><video muted loop playsinline preload="metadata" aria-hidden="true" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="reach-wash" aria-hidden="true"></div><div class="reach-copy"><p class="kicker"><span></span>And now, AI</p><div class="reach-copy-state is-active" data-reach-copy="boundary"><h2 id="reach-title">The feeling is familiar.<br /><em>The reach is new.</em></h2><p>AI can carry work that used to look like thinking, across the business from one decision to the next.</p></div><div class="reach-copy-state" data-reach-copy="organisation" aria-hidden="true"><h2>The organisation<br /><em>changes shape.</em></h2><p>People hold judgement. The AI Brain connects the work.</p></div><details><summary>Sources</summary><div><a href="https://classics.mit.edu/Plato/phaedrus.html">Plato, Phaedrus</a><a href="https://live-www.nationalarchives.gov.uk/explore-the-collection/stories/the-proclamation-of-ned-ludd/">The National Archives, Luddite protests</a><a href="https://eric.ed.gov/?id=EJ336469">Hembree and Dessart, 79-study calculator review</a><a href="https://doi.org/10.1038/s41598-020-62877-0">GPS use and spatial memory</a></div></details></div><div class="reach-stage"><div class="capability-instrument is-active" data-reach-panel="boundary" aria-label="The changing division of work"><div class="capability-head"><p><span>01</span>AI carries</p><i aria-hidden="true"></i><p><span>02</span>You keep</p></div><div class="capability-window"><div class="capability-reel reel-ai">${reels(["Gather","Connect","Compare","Monitor","Model","Reconcile","Prepare","Retrieve","Route","Update"])}</div><div class="capability-core" aria-hidden="true"><i></i><b></b></div><div class="capability-reel reel-human">${reels(["Intent","Taste","Judgement","Method","Relationships","Context","Accountability","Exceptions","Ethics","Decision"])}</div></div></div><div class="hybrid-organisation" data-reach-panel="organisation" aria-hidden="true"><p class="instrument-label"><span></span>New-age leadership</p><div class="organisation-grid" aria-label="A hybrid organisation made from people, an AI Brain and shared roles"><article class="org-cell org-leader"><small>Human</small><strong>Leader</strong><span>Direction · judgement</span></article><article class="org-cell org-chief"><small>Human</small><strong>Chief of Staff</strong><span>Trust · context</span></article><article class="org-cell org-brain"><small>System</small><strong>AI Brain</strong><span>Memory · links</span></article><article class="org-cell org-signals"><small>Agent</small><strong>Market signals</strong><span>Watches change</span></article><article class="org-cell org-marketing"><small>Hybrid</small><strong>Marketing</strong><span>Person leads</span></article><article class="org-cell org-research"><small>Hybrid</small><strong>Research</strong><span>People listen</span></article><article class="org-cell org-sales"><small>Agent</small><strong>Sales research</strong><span>People build trust</span></article><article class="org-cell org-brief"><small>New role</small><strong>Executive brief</strong><span>One view</span></article><div class="organisation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div><nav class="reach-progress" aria-label="Sequence stages"><i aria-hidden="true"></i><button type="button" data-reach-jump="boundary" aria-current="step">Work</button><button type="button" data-reach-jump="organisation">Organisation</button></nav><p class="film-mark">Illustrative machinery</p></div></section>`;
  return `${reach}
  <section class="work-scroll" aria-label="How the hybrid system works"><div class="work-sticky"><div class="work-intro"><p class="kicker"><span></span>What this feels like in practice</p><h2 class="scroll-reveal" data-reveal>The system does not replace your judgement.<br /><em>It brings more to it.</em></h2></div><div class="work-scenes">${scenes}</div><nav class="work-nav" aria-label="Working stages"><button class="is-active" data-work-button="0" aria-current="step">Notice</button><button data-work-button="1">Connect</button><button data-work-button="2">Prepare</button></nav></div></section>
  <section class="human-proof" aria-labelledby="proof-title"><div class="proof-track" data-benefit-track><div class="proof-story brain-benefits" data-benefits><p class="kicker"><span></span>What your AI Brain makes possible</p><div class="benefit-stage">${brainBenefits}</div><div class="benefit-controls" aria-label="AI Brain benefits"><button type="button" data-benefit-prev aria-label="Previous benefit">←</button><p><span data-benefit-count>01</span> / 06</p><div aria-hidden="true"><i></i></div><button type="button" data-benefit-next aria-label="Next benefit">→</button></div><p class="sr-status" data-benefit-status aria-live="polite"></p></div></div><div class="proof-return"><p class="kicker dark"><span></span>The returned hour</p><h2>What will you do with the hours it gives back?</h2><ul><li>Ask the harder question.</li><li>Spend more time with people.</li><li>Make the consequential call earlier.</li></ul></div></section>`;
}

export interface LeadershipChaptersOptions {
  reduced: boolean;
  /** Play chapter films in view and reveal marked headings. A page that already does this for its whole surface passes false. */
  media?: boolean;
  /** Whether chapter films may play at all, read on every visibility change. */
  canPlay?: () => boolean;
}

/**
 * Every chapter reads its state from where the page is, forwards and
 * backwards. Native scrolling owns progression: nothing here intercepts
 * wheel, touch or keys. The controls move the page to where a state lives
 * rather than swapping the picture under a reader who has not moved.
 */
export function mountLeadershipChapters(root: HTMLElement, { reduced, media = false, canPlay = () => !reduced }: LeadershipChaptersOptions) {
  const abort = new AbortController();
  const observers: IntersectionObserver[] = [];
  const signal = abort.signal;
  const activate = (selector: string, index: number, current = "step") => root.querySelectorAll<HTMLElement>(selector).forEach((node, i) => {
    node.classList.toggle("is-active", i === index);
    node.setAttribute("aria-hidden", String(i !== index));
    if (node.tagName === "BUTTON") {
      if (i === index) node.setAttribute("aria-current", current);
      else node.removeAttribute("aria-current");
    }
  });

  let reachLockUntil = 0;
  let workIndex = -1;
  const setWork = (i: number) => { if (i === workIndex) return; workIndex = i; activate("[data-work-scene]", i); activate("[data-work-button]", i); };
  const work = root.querySelector<HTMLElement>(".work-scroll");
  const reach = root.querySelector<HTMLElement>("[data-reach]");
  const reachSticky = reach?.querySelector<HTMLElement>(".reach-sticky");
  const setReach = (phase: string) => {
    root.querySelectorAll<HTMLElement>("[data-reach-copy],[data-reach-panel]").forEach((node) => { const active = (node.dataset.reachCopy || node.dataset.reachPanel) === phase; node.classList.toggle("is-active", active); node.setAttribute("aria-hidden", String(!active)); });
    root.querySelectorAll<HTMLElement>("[data-reach-jump]").forEach((node) => node.dataset.reachJump === phase ? node.setAttribute("aria-current", "step") : node.removeAttribute("aria-current"));
  };
  /* The six AI Brain benefits used to advance themselves every 6.2 seconds.
     On a page whose argument is carried by scrolling, that was the one
     element that moved on its own, and it changed the sentence under anybody
     reading at their own pace. It is a pinned sequence the reader drives, and
     the arrows move the page to a state rather than swapping it in place. */
  const benefitNodes = [...root.querySelectorAll<HTMLElement>("[data-benefit]")];
  const benefitTrack = root.querySelector<HTMLElement>("[data-benefit-track]");
  const benefitPanel = root.querySelector<HTMLElement>("[data-benefits]");
  const benefitControls = root.querySelector<HTMLElement>(".benefit-controls");
  let benefit = -1; let benefitLockUntil = 0;
  const setBenefit = (raw: number, announce = false) => {
    const next = Math.max(0, Math.min(benefitNodes.length - 1, raw));
    if (next === benefit && !announce) return;
    benefit = next;
    activate("[data-benefit]", benefit);
    const count = root.querySelector("[data-benefit-count]");
    if (count) count.textContent = String(benefit + 1).padStart(2, "0");
    /* The rule under the arrows reads this. */
    benefitControls?.style.setProperty("--benefit-index", String(benefit));
    const status = root.querySelector("[data-benefit-status]");
    if (announce && status) status.textContent = `Benefit ${benefit + 1} of ${benefitNodes.length}: ${benefitNodes[benefit].innerText}`;
  };
  const chooseBenefit = (i: number) => {
    const next = Math.max(0, Math.min(benefitNodes.length - 1, i));
    setBenefit(next, true);
    benefitLockUntil = performance.now() + 1200;
    if (!benefitTrack || !benefitPanel) return;
    scrollTo({ top: scrollY + benefitTrack.getBoundingClientRect().top + Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight) * (next / (benefitNodes.length - 1)), behavior: reduced ? "auto" : "smooth" });
  };
  /* The work scenes are gated to wide screens, because below 900px they are
     laid out one after another and the reader is already moving through them. */
  const update = () => {
    if (work && innerWidth > 900) setWork(Math.round(Math.max(0, Math.min(1, -work.getBoundingClientRect().top / Math.max(1, work.offsetHeight - innerHeight))) * 2));
    if (reach && reachSticky) { const p = Math.max(0, Math.min(1, -reach.getBoundingClientRect().top / Math.max(1, reach.offsetHeight - reachSticky.offsetHeight))); reach.style.setProperty("--reach-progress", String(p)); if (performance.now() >= reachLockUntil) setReach(p < 0.48 ? "boundary" : "organisation"); }
    if (benefitTrack && benefitPanel && performance.now() >= benefitLockUntil) setBenefit(Math.round(Math.max(0, Math.min(1, -benefitTrack.getBoundingClientRect().top / Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight))) * (benefitNodes.length - 1)));
  };
  addEventListener("scroll", update, { passive: true, signal }); addEventListener("resize", update, { signal });
  root.querySelectorAll<HTMLElement>("[data-work-button]").forEach((button, i) => button.addEventListener("click", () => { setWork(i); if (work) scrollTo({ top: scrollY + work.getBoundingClientRect().top + (work.offsetHeight - innerHeight) * (i / 2), behavior: reduced ? "auto" : "smooth" }); }, { signal }));
  root.querySelectorAll<HTMLElement>("[data-reach-jump]").forEach((button) => button.addEventListener("click", () => { const phase = button.dataset.reachJump || "boundary"; setReach(phase); reachLockUntil = performance.now() + 1200; if (reach && reachSticky) scrollTo({ top: scrollY + reach.getBoundingClientRect().top + (reach.offsetHeight - reachSticky.offsetHeight) * (phase === "organisation" ? 0.68 : 0.12), behavior: reduced ? "auto" : "smooth" }); }, { signal }));
  root.querySelector("[data-benefit-prev]")?.addEventListener("click", () => chooseBenefit(benefit - 1), { signal }); root.querySelector("[data-benefit-next]")?.addEventListener("click", () => chooseBenefit(benefit + 1), { signal });

  const videos = media ? [...root.querySelectorAll<HTMLVideoElement>(".reach-sequence video, .work-scroll video")] : [];
  if (media && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { const video = entry.target as HTMLVideoElement; if (entry.isIntersecting && canPlay()) void video.play().catch(() => undefined); else video.pause(); }), { threshold: 0.18 });
    observers.push(videoObserver); videos.forEach((v) => videoObserver.observe(v));
    const reveals = [...root.querySelectorAll<HTMLElement>(".reach-sequence [data-reveal], .work-scroll [data-reveal], .human-proof [data-reveal]")];
    if (reduced) reveals.forEach((x) => x.classList.add("is-revealed"));
    else { const observer = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); observer.unobserve(e.target); } }), { threshold: 0.25 }); observers.push(observer); reveals.forEach((x) => observer.observe(x)); }
  } else if (media) root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((x) => x.classList.add("is-revealed"));

  setWork(0); setBenefit(0); update();
  return () => { abort.abort(); observers.forEach((o) => o.disconnect()); videos.forEach((v) => v.pause()); };
}
