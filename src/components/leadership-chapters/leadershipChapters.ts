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
  ["Leadership updates become consistent, even when the week was not.", "\"I used to deliver inconsistently if my week was inconsistent. Now, my system knows that risk and helps me deliver regardless.\""],
  ["Work nobody owns becomes visible before it becomes a problem.", "\"I didn't realize a business would need an intelligence synthesist as a job. AI doesn't just take work off a person's plate, it reinvents roles entirely to create outcomes that just did not occur before.\""],
  ["A change in market pricing becomes a decision, not a forgotten observation.", "\"I've had the same chat hundreds of times over the years with my leadership team about pricing. Now, that repetition is a signal for action, instead of more talking.\""],
  ["A CEO who hates writing can still publish ideas worth following.", "\"I avoid posting content and being visible, even though a modern day CEO really should. My AI brain helps me get better at the things I avoided or felt bottlenecked by so I can just ship it.\""],
  ["A CRO who hates the numbers can become better at using them.", "\"I'm not bad with numbers, but I'm bad with spreadsheets. Now, I can play to my strengths while reliably creating AI agents myself that handle what I hated.\""],
  ["Founder-led content can begin with the work, not another content calendar.", "\"When I do a task like creating content, it used to just go to the PR agency. Now, my AI brain suggests repurposing it for all sorts of things like internal updates, product vision boards. It actually keeps my overall vision much more consistent.\""],
] as const;

export const leadershipScenes = [
  [signalsFilm, signalsPoster, "It notices what changed.", "Signals arrive before someone asks for a report."],
  [evidenceFilm, evidencePoster, "It joins the evidence.", "New information meets what the business already knows."],
  [communicationsFilm, communicationsPoster, "It prepares the next move.", "Useful work reaches you ready for a decision."],
] as const;

const reels = (items: string[]) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul><ul aria-hidden="true">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;

export function leadershipChaptersMarkup() {
  const brainBenefits = leadershipBenefits.map((b, i) => `<article class="brain-benefit${i ? "" : " is-active"}" data-benefit="${i}" aria-hidden="${Boolean(i)}"><h2${i ? "" : ' id="proof-title"'}>${b[0]}</h2><p>${b[1]}</p></article>`).join("");
  const scenes = leadershipScenes.map((s, i) => `<article class="work-scene${i ? "" : " is-active"}" data-work-scene="${i}"><video muted loop playsinline preload="${i ? "none" : "metadata"}" aria-hidden="true" poster="${esc(s[1])}"><source src="${esc(s[0])}" type="video/mp4" /></video><div class="work-wash"></div><div><small>0${i + 1}</small><h3>${s[2]}</h3><p>${s[3]}</p></div></article>`).join("");
  return `<section class="reach-sequence" data-reach aria-labelledby="reach-title"><div class="reach-sticky"><video muted loop playsinline preload="metadata" aria-hidden="true" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="reach-wash" aria-hidden="true"></div><div class="reach-copy"><p class="kicker"><span></span>the hybrid-species business</p><div class="reach-copy-state is-active" data-reach-copy="boundary"><h2 id="reach-title">The feeling is similar.<br /><em style="font-style: normal">The scale is not.</em></h2><p>AI isn't just a single-use tool - it can carry work that used to look like human thinking, but we miss the mark with how we use it.</p></div><div class="reach-copy-state" data-reach-copy="organisation" aria-hidden="true"><h2>What people do, and should do,<br /><em style="font-style: normal">changes shape.</em></h2><p>People hold judgement, have higher standards and take more accountability than ever. The AI Brain connects, iterates and executes.</p></div><details><summary>Sources</summary><div><a href="https://classics.mit.edu/Plato/phaedrus.html">Plato, Phaedrus</a><a href="https://live-www.nationalarchives.gov.uk/explore-the-collection/stories/the-proclamation-of-ned-ludd/">The National Archives, Luddite protests</a><a href="https://eric.ed.gov/?id=EJ336469">Hembree and Dessart, 79-study calculator review</a><a href="https://doi.org/10.1038/s41598-020-62877-0">GPS use and spatial memory</a></div></details></div><div class="reach-stage"><div class="capability-instrument is-active" data-reach-panel="boundary" aria-label="The changing division of work"><div class="capability-head"><p><span>01</span>AI carries</p><i aria-hidden="true"></i><p><span>02</span>You keep</p></div><div class="capability-window"><div class="capability-reel reel-ai">${reels(["Gather","Connect","Compare","Monitor","Model","Reconcile","Prepare","Retrieve","Route","Update"])}</div><div class="capability-core" aria-hidden="true"><i></i><b></b></div><div class="capability-reel reel-human">${reels(["Intent","Taste","Judgement","Method","Relationships","Context","Accountability","Exceptions","Ethics","Decision"])}</div></div></div><div class="hybrid-organisation" data-reach-panel="organisation" aria-hidden="true"><p class="instrument-label"><span></span>New-age leadership</p><div class="organisation-grid" aria-label="A hybrid organisation made from people, an AI Brain and shared roles"><article class="org-cell org-leader"><small>Human</small><strong>Leader</strong><span>Direction · judgement</span></article><article class="org-cell org-chief"><small>Human</small><strong>Chief of Staff</strong><span>Trust · context</span></article><article class="org-cell org-brain"><small>System</small><strong>AI Brain</strong><span>Memory · links</span></article><article class="org-cell org-signals"><small>Agent</small><strong>Market signals</strong><span>Watches change</span></article><article class="org-cell org-marketing"><small>Hybrid</small><strong>Marketing</strong><span>Person leads</span></article><article class="org-cell org-research"><small>Hybrid</small><strong>Research</strong><span>People listen</span></article><article class="org-cell org-sales"><small>Agent</small><strong>Sales research</strong><span>People build trust</span></article><article class="org-cell org-brief"><small>New role</small><strong>Executive brief</strong><span>One view</span></article><div class="organisation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div><nav class="reach-progress" aria-label="Sequence stages"><i aria-hidden="true"></i><button type="button" data-reach-jump="boundary" aria-current="step">Work</button><button type="button" data-reach-jump="organisation">Organisation</button></nav><p class="film-mark">Illustrative machinery</p></div></section>
  <section class="work-scroll" aria-label="How the hybrid system works"><div class="work-sticky"><div class="work-intro"><p class="kicker"><span></span>What this feels like in practice</p><h2 class="scroll-reveal" data-reveal>When built right,<br /><em style="font-style: normal">AI is our biggest level-up.</em></h2></div><div class="work-scenes">${scenes}</div><nav class="work-nav" aria-label="Working stages"><button class="is-active" data-work-button="0" aria-current="step">Notice</button><button data-work-button="1">Connect</button><button data-work-button="2">Prepare</button></nav></div></section>
  <section class="human-proof" aria-labelledby="proof-title"><div class="proof-track" data-benefit-track><div class="proof-story brain-benefits" data-benefits><p class="kicker"><span></span>What your AI Brain makes possible</p><div class="benefit-stage">${brainBenefits}</div><div class="benefit-controls" aria-label="AI Brain benefits"><button type="button" data-benefit-prev aria-label="Previous benefit">←</button><p><span data-benefit-count>01</span> / 06</p><div aria-hidden="true"><i></i></div><button type="button" data-benefit-next aria-label="Next benefit">→</button></div><p class="sr-status" data-benefit-status aria-live="polite"></p></div></div><div class="proof-return"><p class="kicker dark"><span></span>The returned hour</p><h2>What will you do with the hours you save on a task?</h2><ul><li>Clock off work earlier?</li><li>Invest the time in to the part of your job only you can do?</li><li>Invest in to the AI brain you own that will compound over time?</li></ul></div></section>`;
}

export interface LeadershipChaptersOptions {
  reduced: boolean;
  /** Play chapter films in view and reveal marked headings. A page that already does this for its whole surface passes false. */
  media?: boolean;
  /** Whether chapter films may play at all, read on every visibility change. */
  canPlay?: () => boolean;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** Where each practice scene rests when its stop on the phone rail is chosen: settled, never mid-sweep. */
export const practiceRest = [0.06, 0.5, 0.94] as const;

/**
 * The practice scenes on a phone, read from how far through their pinned
 * travel the reader is, 0 to 1 (Krish, 2026-09-25: "should really build with
 * scroll, with that left-to-right green line animation").
 *
 * Each of the two changes is a sweep: a mint line crosses the frame from left
 * to right and uncovers the next scene behind it, over the middle 40% of its
 * half of the travel, so every scene also holds still long enough to read. The
 * outgoing words leave as the line sets off and the incoming ones arrive once
 * it has passed. The rail's fill moves only while a line sweeps, and reaches
 * each stop as its sweep completes. With reduced motion the scenes change at
 * the same points, all at once, and nothing sweeps.
 */
export function practiceSweep(progress: number, reduced = false) {
  const t = clamp01(progress) * 2;
  const sweep = (k: number) => (reduced ? (t >= k - 0.5 ? 1 : 0) : clamp01((t - (k - 0.7)) / 0.4));
  const one = sweep(1);
  const two = sweep(2);
  const moving = two > 0 && two < 1 ? two : one > 0 && one < 1 ? one : null;
  return {
    /* Each scene takes over halfway through its sweep, the same point at
       which reduced motion switches it. */
    active: t >= 1.5 ? 2 : t >= 0.5 ? 1 : 0,
    sweeps: [one, two] as const,
    /* Where the line is across the frame, and how strongly it shows: it fades
       in and out at the frame's edges rather than appearing whole. */
    edge: moving ?? 0,
    line: moving === null ? 0 : Math.min(1, moving / 0.08, (1 - moving) / 0.08),
    fill: (one + two) / 2,
    reached: [true, one >= 1, two >= 1] as const,
    copy: [1 - clamp01(one / 0.3), clamp01((one - 0.6) / 0.4) * (1 - clamp01(two / 0.3)), clamp01((two - 0.6) / 0.4)] as const,
  };
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
  /* Above 900px the whole practice chapter pins and its scenes change at the
     quarter points. On a phone of ordinary height the stylesheet pins the
     scenes alone, under the introduction, and they build by the sweep above.
     A phone held sideways, or a page without scripts, keeps them one after
     another. The script reads which of these the stylesheet chose from the
     scenes' computed position rather than restating its media query. */
  const workSticky = work?.querySelector<HTMLElement>(".work-sticky");
  const workIntro = work?.querySelector<HTMLElement>(".work-intro");
  const workScenes = work?.querySelector<HTMLElement>(".work-scenes");
  const workSceneNodes = [...root.querySelectorAll<HTMLElement>("[data-work-scene]")];
  const workButtons = [...root.querySelectorAll<HTMLElement>("[data-work-button]")];
  const workVideos = [...root.querySelectorAll<HTMLVideoElement>(".work-scene video")];
  let workMode: "wide" | "pinned" | "flow" = "wide";
  let workPinTop = 0;
  const measureWork = () => {
    const style = workScenes ? getComputedStyle(workScenes) : null;
    const next = innerWidth > 900 ? "wide" : style?.position === "sticky" ? "pinned" : "flow";
    workPinTop = parseFloat(style?.top ?? "") || 0;
    if (next === workMode) return;
    const leftPin = workMode === "pinned";
    workMode = next;
    workIndex = -1;
    /* Laid out one after another, every scene is on the page and none is hidden from a screen reader. */
    if (workMode === "flow") workSceneNodes.forEach((node) => node.setAttribute("aria-hidden", "false"));
    /* Leaving the pin (a phone turned on its side), the films the sweep
       paused go back to playing by visibility. */
    if (leftPin && media) workVideos.forEach((video) => { const box = video.getBoundingClientRect(); if (box.bottom > 0 && box.top < innerHeight && canPlay()) void video.play().catch(() => undefined); else video.pause(); });
  };
  /* Measured from the layout, not from innerHeight, which changes whenever a
     phone's address bar shows or hides. */
  const pinnedWork = () => {
    if (!workSticky || !workIntro || !workScenes) return null;
    const start = workIntro.offsetTop + workIntro.offsetHeight;
    return { pinTop: workPinTop, top: workSticky.getBoundingClientRect().top + start, travel: Math.max(1, workSticky.offsetHeight - start - workScenes.offsetHeight) };
  };
  const paintPinnedWork = () => {
    const geometry = pinnedWork();
    if (!work || !geometry) return;
    const state = practiceSweep((geometry.pinTop - geometry.top) / geometry.travel, reduced);
    work.style.setProperty("--work-sweep-1", state.sweeps[0].toFixed(4));
    work.style.setProperty("--work-sweep-2", state.sweeps[1].toFixed(4));
    work.style.setProperty("--work-edge", state.edge.toFixed(4));
    work.style.setProperty("--work-line", state.line.toFixed(3));
    work.style.setProperty("--work-fill", state.fill.toFixed(4));
    workSceneNodes.forEach((node, i) => node.style.setProperty("--work-copy", state.copy[i].toFixed(3)));
    workButtons.forEach((button, i) => button.toggleAttribute("data-work-reached", state.reached[i]));
    setWork(state.active);
    /* Only the scene on screen, and the one a line is uncovering, play: a
       phone never decodes all three films at once. */
    if (media) {
      const box = work.getBoundingClientRect();
      const inView = box.bottom > 0 && box.top < innerHeight;
      const visible = [state.sweeps[0] < 1, state.sweeps[0] > 0 && state.sweeps[1] < 1, state.sweeps[1] > 0];
      workVideos.forEach((video, i) => {
        if (inView && visible[i] && canPlay()) { if (video.paused) void video.play().catch(() => undefined); } else if (!video.paused) video.pause();
      });
    }
  };
  const update = () => {
    if (work && workMode === "wide") setWork(Math.round(Math.max(0, Math.min(1, -work.getBoundingClientRect().top / Math.max(1, work.offsetHeight - innerHeight))) * 2));
    if (work && workMode === "pinned") paintPinnedWork();
    if (reach && reachSticky) { const p = Math.max(0, Math.min(1, -reach.getBoundingClientRect().top / Math.max(1, reach.offsetHeight - reachSticky.offsetHeight))); reach.style.setProperty("--reach-progress", String(p)); if (performance.now() >= reachLockUntil) setReach(p < 0.48 ? "boundary" : "organisation"); }
    if (benefitTrack && benefitPanel && performance.now() >= benefitLockUntil) setBenefit(Math.round(Math.max(0, Math.min(1, -benefitTrack.getBoundingClientRect().top / Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight))) * (benefitNodes.length - 1)));
  };
  addEventListener("scroll", update, { passive: true, signal }); addEventListener("resize", () => { measureWork(); update(); }, { signal });
  workButtons.forEach((button, i) => button.addEventListener("click", () => {
    if (workMode === "pinned") {
      const geometry = pinnedWork();
      if (geometry) scrollTo({ top: scrollY + geometry.top - geometry.pinTop + practiceRest[i] * geometry.travel, behavior: reduced ? "auto" : "smooth" });
      return;
    }
    setWork(i);
    if (work) scrollTo({ top: scrollY + work.getBoundingClientRect().top + (work.offsetHeight - innerHeight) * (i / 2), behavior: reduced ? "auto" : "smooth" });
  }, { signal }));
  root.querySelectorAll<HTMLElement>("[data-reach-jump]").forEach((button) => button.addEventListener("click", () => { const phase = button.dataset.reachJump || "boundary"; setReach(phase); reachLockUntil = performance.now() + 1200; if (reach && reachSticky) scrollTo({ top: scrollY + reach.getBoundingClientRect().top + (reach.offsetHeight - reachSticky.offsetHeight) * (phase === "organisation" ? 0.68 : 0.12), behavior: reduced ? "auto" : "smooth" }); }, { signal }));
  root.querySelector("[data-benefit-prev]")?.addEventListener("click", () => chooseBenefit(benefit - 1), { signal }); root.querySelector("[data-benefit-next]")?.addEventListener("click", () => chooseBenefit(benefit + 1), { signal });

  const videos = media ? [...root.querySelectorAll<HTMLVideoElement>(".reach-sequence video, .work-scroll video")] : [];
  if (media && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const video = entry.target as HTMLVideoElement;
      /* The pinned phone scenes play by the sweep, above, not by visibility: all three are in view at once. */
      if (workMode === "pinned" && workVideos.includes(video)) return;
      if (entry.isIntersecting && canPlay()) void video.play().catch(() => undefined); else video.pause();
    }), { threshold: 0.18 });
    observers.push(videoObserver); videos.forEach((v) => videoObserver.observe(v));
    const reveals = [...root.querySelectorAll<HTMLElement>(".reach-sequence [data-reveal], .work-scroll [data-reveal], .human-proof [data-reveal]")];
    if (reduced) reveals.forEach((x) => x.classList.add("is-revealed"));
    else { const observer = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); observer.unobserve(e.target); } }), { threshold: 0.25 }); observers.push(observer); reveals.forEach((x) => observer.observe(x)); }
  } else if (media) root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((x) => x.classList.add("is-revealed"));

  setWork(0); setBenefit(0); measureWork(); update();
  return () => { abort.abort(); observers.forEach((o) => o.disconnect()); videos.forEach((v) => v.pause()); };
}
