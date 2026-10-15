import signalsPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp";
import evidencePoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp";
import communicationsPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp";
import readyPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import signalsFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import communicationsFilm from "@/assets/films/sep2026/communications-compose-loop-r01-20s-720p-web-sealed.mp4";
import readyFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import founderPlate from "@/assets/stories/founder-pantograph-r01-800.webp";

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

/**
 * What the AI Brain makes possible, told as short stories: one leader, one way
 * in. A story has a heading in the form the six above already use, where the
 * leader was, what happened, and, only where the person wrote it, one line in
 * their own words. Every fact traces to project-documentation/04_PROOF.md, and
 * a quoted line is an exact substring of its testimonial in
 * src/data/testimonials.ts, never edited (src/test/leadership-stories.test.ts).
 * The six keep their one-line form until the stories behind them are sourced.
 */
export interface LeadershipStory {
  heading: string;
  /** The one-line form the six carry today. */
  line?: string;
  situation?: string;
  happened?: string;
  quote?: { testimonialId: string; text: string };
  /** A generated scene from the instrument room: mood, never evidence. */
  scene?: string;
}

/* Holds words on one line wherever they are set: "once a month" in the
   heading, and an article with its noun so no line ends on "a". */
const keep = (words: string) => words.replaceAll(" ", "\u00a0");

export const leadershipStories: readonly LeadershipStory[] = [
  {
    heading: `A founder who posted about ${keep("once a month")} now posts most days.`,
    situation: `The founder runs ${keep("a research")} and content brand. Publishing ${keep("a post")} backed by research took days.`,
    happened: `We set up an AI system that belongs to the founder. It fits around what they do and where they get stuck. ${keep("A post")} like that now takes under an hour.`,
    quote: { testimonialId: "wellness-founder", text: "It's helping me be seen by my customers." },
    scene: founderPlate,
  },
  ...leadershipBenefits.map(([heading, line]) => ({ heading, line })),
];

/** A full story holds the page for twice as long as a heading and its line,
    so a reader paging with Space or PageDown rarely steps over it. */
export const storyWeight = (story: LeadershipStory) => (story.situation ? 2 : 1);

/* The pinned travel, in units: the contents opens the section and holds the
   page while a reader finds the story that is them; then each story holds it
   in turn. */
const OPENING = 1;

interface StorySegment { kind: "contents" | "hold"; from: number; to: number; index: number }

export function storyPlan(weights: readonly number[]) {
  const segments: StorySegment[] = [];
  let at = 0;
  const add = (kind: StorySegment["kind"], length: number, index: number) => { segments.push({ kind, from: at, to: at + length, index }); at += length; };
  add("contents", OPENING, 0);
  weights.forEach((weight, i) => add("hold", weight, i));
  const total = at;
  /* Where each story rests: the middle of its hold, as a share of the travel. */
  const rests = segments.filter((s) => s.kind === "hold").map((s) => (s.from + s.to) / 2 / total);
  /* Where the contents rests: the middle of the opening. */
  const contentsRests = [OPENING / 2 / total];
  return { segments, total, rests, contentsRests };
}

/**
 * What the stage shows, read only from how far through the pinned travel the
 * reader is (0 to 1): the contents, then one whole story at a time, never a
 * part of one and never two at once. The same position always gives the same
 * state, forwards or backwards. The page fades from one state to the next over
 * a fixed short time (the stylesheet), so wherever scrolling stops, what shows
 * is whole; with reduced motion the change is immediate.
 */
export function storyScroll(progress: number, weights: readonly number[]) {
  const { segments, total } = storyPlan(weights);
  const x = clamp01(progress) * total;
  const segment = segments.find((s) => x < s.to) ?? segments[segments.length - 1];
  const k = segment.index;
  if (segment.kind === "contents") return { story: k, mark: k, storyShown: 0, contentsShown: 1 };
  return { story: k, mark: k, storyShown: 1, contentsShown: 0 };
}

/** The arrows' target for the opening contents. */
export const CONTENTS = -2;

/**
 * Where the arrows go from a position. From an open story they open the one
 * before or after it, and Previous on the first story goes back to the
 * contents (CONTENTS). From the contents, Next opens the first story. -1 means
 * there is nowhere to go, and the arrow is disabled.
 */
export function storyTargets(progress: number, weights: readonly number[]) {
  const state = storyScroll(progress, weights);
  const last = weights.length - 1;
  if (!state.storyShown) return { prev: -1, next: 0 };
  return { prev: state.story > 0 ? state.story - 1 : CONTENTS, next: state.story < last ? state.story + 1 : -1 };
}

export const leadershipScenes = [
  [signalsFilm, signalsPoster, "It notices what changed.", "Signals arrive before someone asks for a report."],
  [evidenceFilm, evidencePoster, "It joins the evidence.", "New information meets what the business already knows."],
  [communicationsFilm, communicationsPoster, "It prepares the next move.", "Useful work reaches you ready for a decision."],
] as const;

const reels = (items: string[]) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul><ul aria-hidden="true">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;

export function leadershipChaptersMarkup() {
  const weights = leadershipStories.map(storyWeight);
  const plan = storyPlan(weights);
  const count = String(leadershipStories.length).padStart(2, "0");
  const contents = leadershipStories.map((story, i) => `<a href="#mm-story-${i + 1}" data-story-link="${i}"><span class="story-number">${String(i + 1).padStart(2, "0")}</span><span>${story.heading}</span></a>`).join("");
  const brainBenefits = leadershipStories.map((story, i) => {
    const body = story.situation
      ? `<div class="story-body${story.scene ? " has-plate" : ""}">${story.scene ? `<figure class="story-plate" aria-hidden="true"><img src="${esc(story.scene)}" alt="" width="800" height="800" loading="lazy" decoding="async" /></figure>` : ""}<p class="story-situation">${story.situation}</p><p class="story-happened">${story.happened}</p>${story.quote ? `<blockquote class="story-quote">"${story.quote.text}"</blockquote>` : ""}</div>`
      : `<p>${story.line}</p>`;
    return `<article class="brain-benefit${story.situation ? " is-story" : ""}" id="mm-story-${i + 1}" data-benefit="${i}" data-weight="${weights[i]}"><h2 tabindex="-1">${story.heading}</h2>${body}</article>`;
  }).join("");
  const scenes = leadershipScenes.map((s, i) => `<article class="work-scene${i ? "" : " is-active"}" data-work-scene="${i}"><video muted loop playsinline preload="${i ? "none" : "metadata"}" aria-hidden="true" poster="${esc(s[1])}"><source src="${esc(s[0])}" type="video/mp4" /></video><div class="work-wash"></div><div><small>0${i + 1}</small><h3>${s[2]}</h3><p>${s[3]}</p></div></article>`).join("");
  return `<section class="reach-sequence" data-reach aria-labelledby="reach-title"><div class="reach-sticky"><video muted loop playsinline preload="metadata" aria-hidden="true" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="reach-wash" aria-hidden="true"></div><div class="reach-copy"><p class="kicker"><span></span>the hybrid-species business</p><div class="reach-copy-state is-active" data-reach-copy="boundary"><h2 id="reach-title">The feeling is similar.<br /><em style="font-style: normal">The scale is not.</em></h2><p>AI isn't just a single-use tool - it can carry work that used to look like human thinking, but we miss the mark with how we use it.</p></div><div class="reach-copy-state" data-reach-copy="organisation" aria-hidden="true"><h2>What people do, and should do,<br /><em style="font-style: normal">changes shape.</em></h2><p>People hold judgement, have higher standards and take more accountability than ever. The AI Brain connects, iterates and executes.</p></div><details><summary>Sources</summary><div><a href="https://classics.mit.edu/Plato/phaedrus.html">Plato, Phaedrus</a><a href="https://live-www.nationalarchives.gov.uk/explore-the-collection/stories/the-proclamation-of-ned-ludd/">The National Archives, Luddite protests</a><a href="https://eric.ed.gov/?id=EJ336469">Hembree and Dessart, 79-study calculator review</a><a href="https://doi.org/10.1038/s41598-020-62877-0">GPS use and spatial memory</a></div></details></div><div class="reach-stage"><div class="capability-instrument is-active" data-reach-panel="boundary" aria-label="The changing division of work"><div class="capability-head"><p><span>01</span>AI carries</p><i aria-hidden="true"></i><p><span>02</span>You keep</p></div><div class="capability-window"><div class="capability-reel reel-ai">${reels(["Gather","Connect","Compare","Monitor","Model","Reconcile","Prepare","Retrieve","Route","Update"])}</div><div class="capability-core" aria-hidden="true"><i></i><b></b></div><div class="capability-reel reel-human">${reels(["Intent","Taste","Judgement","Method","Relationships","Context","Accountability","Exceptions","Ethics","Decision"])}</div></div></div><div class="hybrid-organisation" data-reach-panel="organisation" aria-hidden="true"><p class="instrument-label"><span></span>New-age leadership</p><div class="organisation-grid" aria-label="A hybrid organisation made from people, an AI Brain and shared roles"><article class="org-cell org-leader"><small>Human</small><strong>Leader</strong><span>Direction · judgement</span></article><article class="org-cell org-chief"><small>Human</small><strong>Chief of Staff</strong><span>Trust · context</span></article><article class="org-cell org-brain"><small>System</small><strong>AI Brain</strong><span>Memory · links</span></article><article class="org-cell org-signals"><small>Agent</small><strong>Market signals</strong><span>Watches change</span></article><article class="org-cell org-marketing"><small>Hybrid</small><strong>Marketing</strong><span>Person leads</span></article><article class="org-cell org-research"><small>Hybrid</small><strong>Research</strong><span>People listen</span></article><article class="org-cell org-sales"><small>Agent</small><strong>Sales research</strong><span>People build trust</span></article><article class="org-cell org-brief"><small>New role</small><strong>Executive brief</strong><span>One view</span></article><div class="organisation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div><nav class="reach-progress" aria-label="Sequence stages"><i aria-hidden="true"></i><button type="button" data-reach-jump="boundary" aria-current="step">Work</button><button type="button" data-reach-jump="organisation">Organisation</button></nav></div></section>
  <section class="work-scroll" aria-label="How the hybrid system works"><div class="work-sticky"><div class="work-intro"><p class="kicker"><span></span>What this feels like in practice</p><h2 class="scroll-reveal" data-reveal>When built right,<br /><em style="font-style: normal">AI is our biggest level-up.</em></h2></div><div class="work-scenes">${scenes}</div><nav class="work-nav" aria-label="Working stages"><button class="is-active" data-work-button="0" aria-current="step">Notice</button><button data-work-button="1">Connect</button><button data-work-button="2">Prepare</button></nav></div></section>
  <section class="human-proof" aria-labelledby="proof-title"><div class="proof-track" data-benefit-track data-story-rests="${plan.rests.map((r) => r.toFixed(5)).join(",")}" data-contents-rests="${plan.contentsRests.map((r) => r.toFixed(5)).join(",")}" style="--story-units: ${plan.total.toFixed(2)}"><div class="proof-story brain-benefits" data-benefits><p class="kicker" id="proof-title"><span></span>What your AI Brain makes possible</p><div class="benefit-stage" data-story-stage><nav class="story-contents" aria-label="Contents" data-story-contents>${contents}</nav>${brainBenefits}</div><div class="benefit-controls" role="group" aria-label="AI Brain benefits" style="--story-count: ${leadershipStories.length}"><button type="button" data-benefit-prev aria-label="Previous benefit" aria-disabled="true">←</button><p><span data-benefit-count>01</span> / ${count}</p><div aria-hidden="true"><i></i></div><button type="button" data-benefit-next aria-label="Next benefit">→</button></div><p class="sr-status" data-benefit-status aria-live="polite"></p></div></div><div class="proof-return"><p class="kicker dark"><span></span>The returned hour</p><h2>What will you do with the hours you save on a task?</h2><ul><li>Clock off work earlier?</li><li>Invest the time into the part of your job only you can do?</li><li>Invest into the AI brain you own that will compound over time?</li></ul></div></section>`;
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
  const observers: { disconnect: () => void }[] = [];
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
  /* The stories are a pinned sequence the reader drives (they once advanced
     themselves every 6.2 seconds, changing the sentence under anybody still
     reading). The section opens on its contents, every story by its heading,
     and scroll opens each story out of the contents in turn and folds it back
     before the next. What shows is read only from where the page is
     (storyScroll), so it is the same forwards and backwards, and the arrows
     and contents rows move the page to where a story rests rather than
     swapping the picture under a reader who has not moved. */
  const benefitNodes = [...root.querySelectorAll<HTMLElement>("[data-benefit]")];
  const benefitTrack = root.querySelector<HTMLElement>("[data-benefit-track]");
  const benefitPanel = root.querySelector<HTMLElement>("[data-benefits]");
  const benefitControls = root.querySelector<HTMLElement>(".benefit-controls");
  const storyStage = root.querySelector<HTMLElement>("[data-story-stage]");
  const storyContents = root.querySelector<HTMLElement>("[data-story-contents]");
  const storyLinks = [...root.querySelectorAll<HTMLAnchorElement>("[data-story-link]")];
  const storyPrev = root.querySelector<HTMLElement>("[data-benefit-prev]");
  const storyNext = root.querySelector<HTMLElement>("[data-benefit-next]");
  const storyWeights = benefitNodes.map((node) => Number(node.dataset.weight) || 1);
  const storyPlanned = storyPlan(storyWeights);
  const fullStories = benefitNodes.filter((node) => node.classList.contains("is-story"));
  let benefit = -1; let shownKey = ""; let storyOpen = false; let pendingFocus = -1; let pendingUntil = 0; let storyPinTop = 0;
  /* A contents row hands focus to the story it opens. The story's heading can
     only take focus once it is visible, which is after the previous state has
     faded, so focus is retried for a few frames rather than lost. A reader who
     scrolls or types meanwhile has moved on, and the hand-off is dropped. */
  const landFocus = (i: number, tries = 40) => {
    const heading = benefitNodes[i]?.querySelector<HTMLElement>("h2");
    if (!heading || pendingFocus !== i || performance.now() > pendingUntil) return;
    heading.focus({ preventScroll: true });
    if (document.activeElement === heading) { pendingFocus = -1; return; }
    if (tries > 0) requestAnimationFrame(() => landFocus(i, tries - 1));
  };
  const dropFocus = () => { pendingFocus = -1; };
  /* The contents and a full story lie over the stage, which the six size as
     they always have, and keep the same air above the arrows that the six
     have. Each scales its type and spacing down only as far as it must to fit
     (--fit, 1 at full size), and no further than stays easy to read (0.75).
     Where it cannot fit even there, which only the smallest phones need, it
     keeps the largest size that takes no more room and the stage grows to
     hold it. */
  const FIT_FLOOR = 0.75;
  const STAGE_AIR = 14;
  const fitToStage = (node: HTMLElement | null) => {
    if (!node || !storyStage) return;
    node.style.removeProperty("--fit");
    const room = storyStage.clientHeight - STAGE_AIR;
    if (node.offsetHeight <= room) return;
    const fits = (fit: number, height: number) => { node.style.setProperty("--fit", fit.toFixed(3)); return node.offsetHeight <= height; };
    let lo = FIT_FLOOR; let hi = 1;
    if (!fits(FIT_FLOOR, room)) {
      const least = node.offsetHeight;
      for (let step = 0; step < 7; step += 1) { const mid = (lo + hi) / 2; if (fits(mid, least)) lo = mid; else hi = mid; }
      fits(lo, least);
      storyStage.style.minHeight = `${node.offsetHeight + STAGE_AIR}px`;
      return;
    }
    for (let step = 0; step < 7; step += 1) { const mid = (lo + hi) / 2; if (fits(mid, room)) lo = mid; else hi = mid; }
    fits(lo, room);
  };
  /* Fixed chrome at the foot of the screen (the action bar on
     /new-age-leadership, the cookie notice) publishes its height. Where the
     arrows would sit under it, or below the fold, the panel lifts them: first
     into room it has spare, then by giving up the stage's empty height, never
     below what the stage holds, then by narrowing the air above its label.
     No line of any story is lost to the lift. The fold is the pinned panel's
     own foot, a small-viewport height, so a phone's toolbar showing or hiding
     does not move it. */
  const footReserve = () => {
    const style = document.documentElement.style;
    return (parseFloat(style.getPropertyValue("--mm-bar-reserve")) || 0) + (parseFloat(style.getPropertyValue("--mm-cookie-reserve")) || 0);
  };
  let measuredReserve = -1;
  const overlap = (air: number) => {
    if (!benefitPanel || !benefitControls) return 0;
    const panel = benefitPanel.getBoundingClientRect();
    const bottom = benefitControls.getBoundingClientRect().bottom - panel.top;
    return bottom - (benefitPanel.offsetHeight - measuredReserve - air);
  };
  /* Only arrows the chrome or the fold really covers are lifted; once lifted,
     they keep a little air above fixed chrome. */
  const liftControls = () => {
    if (!storyStage || !benefitPanel) return;
    if (overlap(0) <= 0) return;
    const air = measuredReserve > 0 ? 8 : 0;
    let over = overlap(air);
    benefitPanel.style.setProperty("--story-lift", `${Math.ceil(over)}px`);
    over = overlap(air);
    if (over > 0) {
      const held = Math.max(0, ...benefitNodes.filter((node) => !node.classList.contains("is-story")).map((node) => node.offsetHeight), ...[storyContents, ...fullStories].map((node) => (node ? node.offsetHeight + STAGE_AIR : 0)));
      const height = storyStage.offsetHeight;
      if (height - held > 0.5) storyStage.style.minHeight = `${Math.max(held, height - over)}px`;
      over = overlap(air);
    }
    if (over > 0) {
      const top = parseFloat(getComputedStyle(benefitPanel).paddingTop) || 0;
      if (top - 20 > 0.5) benefitPanel.style.paddingTop = `${Math.max(20, top - over)}px`;
      over = overlap(air);
    }
    return over;
  };
  /* The last resort, for a small touch screen under both the action bar and
     the cookie notice: the contents rows give up some of their 44px touch
     height, never below 32px, and the fit and the lift run again. */
  const ROW_TOUCH = 44;
  const ROW_TOUCH_LEAST = 32;
  const tightenRows = (over: number) => {
    if (!storyContents || over <= 0 || !matchMedia("(pointer: coarse)").matches) return false;
    const rows = storyLinks.length || 1;
    const row = Math.max(ROW_TOUCH_LEAST, ROW_TOUCH - Math.ceil(over / rows));
    if (row >= ROW_TOUCH) return false;
    storyContents.style.setProperty("--row-touch", `${row}px`);
    return true;
  };
  /* A screen too short to pin the stories (a phone held sideways) reads them
     as a document, as it reads the practice scenes: every story and the
     contents in order, the contents links plain links. The script reads which
     the stylesheet chose from the panel's computed position. */
  let storyFlow = false;
  let measuredFor = "";
  const measureStories = (force = false) => {
    if (!benefitPanel) return;
    const style = getComputedStyle(benefitPanel);
    const flow = style.position !== "sticky";
    /* A phone's address bar showing or hiding fires a resize that changes
       nothing the fit or the lift depend on; only measure when one of them
       has changed. */
    const inputs = `${flow}:${benefitPanel.clientWidth}:${benefitPanel.offsetHeight}:${footReserve()}:${style.top}`;
    if (!force && inputs === measuredFor) return;
    measuredFor = inputs;
    /* Sizes are read straight after they are set, so nothing may be mid
       transition while they are (reduced motion gives every element one). */
    benefitPanel.classList.add("is-measuring");
    storyPinTop = parseFloat(style.top) || 0;
    measuredReserve = footReserve();
    benefitPanel.toggleAttribute("data-story-pinned", !flow);
    const reset = () => {
      storyStage?.style.removeProperty("min-height");
      benefitPanel.style.removeProperty("--story-lift");
      benefitPanel.style.removeProperty("padding-top");
    };
    reset();
    storyContents?.style.removeProperty("--row-touch");
    if (flow) [storyContents, ...fullStories].forEach((node) => node?.style.removeProperty("--fit"));
    else {
      [storyContents, ...fullStories].forEach(fitToStage);
      if (tightenRows(liftControls() ?? 0)) { reset(); [storyContents, ...fullStories].forEach(fitToStage); liftControls(); }
    }
    benefitPanel.classList.remove("is-measuring");
    if (flow === storyFlow) return;
    storyFlow = flow;
    shownKey = ""; benefit = -1;
    if (flow) {
      benefitNodes.forEach((node) => setInert(node, false));
      setInert(storyContents, false);
    }
  };
  const setInert = (node: HTMLElement | null, hidden: boolean) => { if (!node) return; node.setAttribute("aria-hidden", String(hidden)); node.toggleAttribute("inert", hidden); };
  const setOnce = (node: HTMLElement | null, name: string, value: string) => { if (node && node.getAttribute(name) !== value) node.setAttribute(name, value); };
  const storyProgress = () => {
    if (!benefitTrack || !benefitPanel) return 0;
    return clamp01((storyPinTop - benefitTrack.getBoundingClientRect().top) / Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight));
  };
  const paintStories = (progress: number) => {
    if (storyFlow) return;
    const state = storyScroll(progress, storyWeights);
    const open = state.storyShown > 0;
    storyOpen = open;
    if (state.story !== benefit) {
      benefit = state.story;
      benefitNodes.forEach((node, i) => node.classList.toggle("is-active", i === benefit));
      const count = root.querySelector("[data-benefit-count]");
      if (count) count.textContent = String(benefit + 1).padStart(2, "0");
      /* The rule under the arrows reads these. */
      benefitControls?.style.setProperty("--benefit-index", String(benefit));
    }
    const targets = storyTargets(progress, storyWeights);
    setOnce(storyPrev, "aria-disabled", String(targets.prev === -1));
    setOnce(storyPrev, "aria-label", targets.prev === CONTENTS ? "Back to the contents" : "Previous benefit");
    setOnce(storyNext, "aria-disabled", String(targets.next === -1));
    const key = `${benefit}:${open}`;
    if (key === shownKey) return;
    shownKey = key;
    benefitNodes.forEach((node, i) => setInert(node, !(open && i === benefit)));
    /* A reader who scrolls on from a focused contents row keeps their place:
       focus goes to the story that opens rather than falling to the page. */
    if (open && storyContents?.contains(document.activeElement)) { pendingFocus = benefit; pendingUntil = performance.now() + 2500; }
    /* Hand focus to the opening story before the contents that held it goes inert. */
    if (open && pendingFocus === benefit) landFocus(benefit);
    setInert(storyContents, open);
  };
  /* Moves the page to where a story rests, or to the contents (CONTENTS). A
     contents row also hands focus to the story's heading, which a screen
     reader reads, so the status line stays quiet for it. */
  const chooseBenefit = (i: number, focus = false) => {
    if (i === -1 || !benefitTrack || !benefitPanel) return;
    const toContents = i === CONTENTS;
    const next = toContents ? 0 : Math.min(benefitNodes.length - 1, i);
    const status = root.querySelector("[data-benefit-status]");
    if (status && !focus) { status.textContent = ""; requestAnimationFrame(() => { status.textContent = toContents ? "Contents" : `Benefit ${next + 1} of ${benefitNodes.length}. ${benefitNodes[next].querySelector("h2")?.textContent ?? ""}`; }); }
    const share = toContents ? storyPlanned.contentsRests[0] : storyPlanned.rests[next];
    const top = scrollY + benefitTrack.getBoundingClientRect().top - storyPinTop + Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight) * share;
    if (focus) { pendingFocus = next; pendingUntil = performance.now() + 2500; }
    scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    if (focus && storyOpen && benefit === next) landFocus(next);
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
    if (benefitTrack && benefitPanel && !storyFlow) paintStories(storyProgress());
  };
  addEventListener("scroll", update, { passive: true, signal }); addEventListener("resize", () => { measureWork(); measureStories(); update(); }, { signal });
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
  /* The arrows go where the position says (storyTargets), and a disabled arrow
     does nothing. Pressed again while the page is still moving to the last
     one's target, an arrow steps on from that target, so quick presses are
     each counted. */
  let aimed = -1; let aimedUntil = 0;
  const arrow = (button: HTMLElement | null, which: "prev" | "next") => button?.addEventListener("click", () => {
    if (button.getAttribute("aria-disabled") === "true" || storyFlow) return;
    const last = benefitNodes.length - 1;
    let target: number;
    if (performance.now() < aimedUntil) {
      if (which === "next") target = aimed === CONTENTS ? 0 : aimed < last ? aimed + 1 : -1;
      else target = aimed === CONTENTS ? -1 : aimed > 0 ? aimed - 1 : CONTENTS;
    } else target = storyTargets(storyProgress(), storyWeights)[which];
    if (target === -1) return;
    aimed = target; aimedUntil = reduced ? 0 : performance.now() + 900;
    chooseBenefit(target);
  }, { signal });
  arrow(storyPrev, "prev"); arrow(storyNext, "next");
  const dropAim = () => { aimedUntil = 0; dropFocus(); };
  addEventListener("wheel", dropAim, { passive: true, signal }); addEventListener("touchstart", dropAim, { passive: true, signal }); addEventListener("keydown", dropFocus, { signal });
  /* Keyboard focus that enters the section before it has pinned would sit at
     the foot of the screen, where the action bar can cover it. The page moves
     to where the state focus belongs to rests, pinned, with the arrows clear. */
  benefitPanel?.addEventListener("focusin", (event) => {
    if (storyFlow || !benefitTrack || !(event.target instanceof HTMLElement) || !event.target.matches(":focus-visible")) return;
    if (Math.abs(benefitPanel.getBoundingClientRect().top - storyPinTop) <= 1) return;
    const state = storyScroll(storyProgress(), storyWeights);
    const share = state.storyShown ? storyPlanned.rests[state.story] : storyPlanned.contentsRests[0];
    /* At once, whatever the page's own scroll behaviour, so focus lands where the reader can see it. */
    scrollTo({ top: scrollY + benefitTrack.getBoundingClientRect().top - storyPinTop + Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight) * share, behavior: "instant" });
  }, { signal });
  storyLinks.forEach((link, i) => link.addEventListener("click", (event) => { if (storyFlow) return; event.preventDefault(); chooseBenefit(i, true); }, { signal }));

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

  setWork(0); measureStories(); paintStories(0); measureWork(); update();
  /* The action bar and the cookie notice publish their height on the root
     element when they show or hide, which a scroll does not always follow. */
  if ("MutationObserver" in window) {
    const reserveObserver = new MutationObserver(() => { if (footReserve() !== measuredReserve) { measureStories(); update(); } });
    reserveObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["style"] });
    observers.push(reserveObserver);
  }
  /* The type the contents and a full story fit with is the page's own, so fit
     again once it has loaded. */
  void document.fonts?.ready.then(() => { if (!signal.aborted) { measureStories(true); update(); } });
  return () => { abort.abort(); observers.forEach((o) => o.disconnect()); videos.forEach((v) => v.pause()); };
}
