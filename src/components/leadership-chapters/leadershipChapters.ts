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

/* Holds "once a month" on one line wherever the heading is set. */
const keep = (words: string) => words.replaceAll(" ", "\u00a0");

export const leadershipStories: readonly LeadershipStory[] = [
  {
    heading: `A founder who posted ${keep("once a month")} now publishes most days.`,
    situation: "The founder runs a research and content brand. Publishing a post backed by research took days.",
    happened: "We set up an AI system that belongs to the founder. They build it around what they do and where they get stuck. A post like that now takes under an hour.",
    quote: { testimonialId: "wellness-founder", text: "I've learnt to push through basic barriers I didn't realise I could" },
    scene: founderPlate,
  },
  ...leadershipBenefits.map(([heading, line]) => ({ heading, line })),
];

/** A full story holds the page for longer than a heading and its line. */
export const storyWeight = (story: LeadershipStory) => (story.situation ? 1.5 : 1);

/* The pinned travel, in units: the contents opens the section, then each
   story opens from it and folds back into it before the next one opens. */
const OPENING = 1;
const OPENING_PASSAGE = 0.35;
const PASSAGE = 0.7;

interface StorySegment { kind: "contents" | "open" | "hold" | "passage"; from: number; to: number; index: number }

export function storyPlan(weights: readonly number[]) {
  const segments: StorySegment[] = [];
  let at = 0;
  const add = (kind: StorySegment["kind"], length: number, index: number) => { segments.push({ kind, from: at, to: at + length, index }); at += length; };
  add("contents", OPENING, 0);
  add("open", OPENING_PASSAGE, 0);
  weights.forEach((weight, i) => {
    if (i) add("passage", PASSAGE, i - 1);
    add("hold", weight, i);
  });
  const total = at;
  /* Where each story rests whole: the middle of its hold, as a share of the travel. */
  const rests = segments.filter((s) => s.kind === "hold").map((s) => (s.from + s.to) / 2 / total);
  /* Where the contents rests whole with its mark on each row: the middle of the
     opening for the first, and for each later row the point in the passage
     where the mark has just stepped onto it. */
  const contentsRests = [
    OPENING / 2 / total,
    ...segments.filter((s) => s.kind === "passage").map((s) => (s.from + 0.575 * (s.to - s.from)) / total),
  ];
  return { segments, total, rests, contentsRests };
}

const ramp = (t: number, a: number, b: number) => clamp01((t - a) / (b - a));

/**
 * Which story is open, and how much of it and of the contents shows, read only
 * from how far through the pinned travel the reader is (0 to 1). The same
 * position always gives the same picture, forwards or backwards. In a passage
 * the open story fades, the contents arrives, the mark steps one row, the
 * contents leaves and the next story arrives, so two sets of words never share
 * the stage. With reduced motion every state snaps whole at fixed points.
 */
export function storyScroll(progress: number, weights: readonly number[], reduced = false) {
  const { segments, total } = storyPlan(weights);
  const x = clamp01(progress) * total;
  const segment = segments.find((s) => x < s.to) ?? segments[segments.length - 1];
  const t = clamp01((x - segment.from) / (segment.to - segment.from));
  const k = segment.index;
  if (segment.kind === "contents") return { story: k, mark: k, storyShown: 0, contentsShown: 1 };
  if (segment.kind === "hold") return { story: k, mark: k, storyShown: 1, contentsShown: 0 };
  if (segment.kind === "open") {
    if (reduced) return t < 0.5 ? { story: k, mark: k, storyShown: 0, contentsShown: 1 } : { story: k, mark: k, storyShown: 1, contentsShown: 0 };
    return { story: k, mark: k, storyShown: ramp(t, 0.55, 1), contentsShown: 1 - ramp(t, 0, 0.45) };
  }
  if (reduced) {
    if (t < 1 / 3) return { story: k, mark: k, storyShown: 1, contentsShown: 0 };
    if (t < 1 / 2) return { story: k, mark: k, storyShown: 0, contentsShown: 1 };
    if (t < 2 / 3) return { story: k + 1, mark: k + 1, storyShown: 0, contentsShown: 1 };
    return { story: k + 1, mark: k + 1, storyShown: 1, contentsShown: 0 };
  }
  if (t < 0.2) return { story: k, mark: k, storyShown: 1 - ramp(t, 0, 0.2), contentsShown: 0 };
  if (t < 0.8) return { story: t < 0.5 ? k : k + 1, mark: t < 0.5 ? k : k + 1, storyShown: 0, contentsShown: Math.min(ramp(t, 0.2, 0.35), 1 - ramp(t, 0.65, 0.8)) };
  return { story: k + 1, mark: k + 1, storyShown: ramp(t, 0.8, 1), contentsShown: 0 };
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
  const contents = leadershipStories.map((story, i) => `<a href="#mm-story-${i + 1}" data-story-link="${i}"${i ? "" : ' aria-current="true"'}><span class="story-number">${String(i + 1).padStart(2, "0")}</span><span>${story.heading}</span></a>`).join("");
  const brainBenefits = leadershipStories.map((story, i) => {
    const body = story.situation
      ? `<div class="story-body${story.scene ? " has-plate" : ""}">${story.scene ? `<figure class="story-plate"><img src="${esc(story.scene)}" alt="" width="800" height="800" loading="lazy" decoding="async" /></figure>` : ""}<p class="story-situation">${story.situation}</p><p class="story-happened">${story.happened}</p>${story.quote ? `<blockquote class="story-quote">"${story.quote.text}"</blockquote>` : ""}</div>`
      : `<p>${story.line}</p>`;
    return `<article class="brain-benefit${story.situation ? " is-story" : ""}${i ? "" : " is-active"}" id="mm-story-${i + 1}" data-benefit="${i}" data-weight="${weights[i]}"><h2 tabindex="-1">${story.heading}</h2>${body}</article>`;
  }).join("");
  const scenes = leadershipScenes.map((s, i) => `<article class="work-scene${i ? "" : " is-active"}" data-work-scene="${i}"><video muted loop playsinline preload="${i ? "none" : "metadata"}" aria-hidden="true" poster="${esc(s[1])}"><source src="${esc(s[0])}" type="video/mp4" /></video><div class="work-wash"></div><div><small>0${i + 1}</small><h3>${s[2]}</h3><p>${s[3]}</p></div></article>`).join("");
  return `<section class="reach-sequence" data-reach aria-labelledby="reach-title"><div class="reach-sticky"><video muted loop playsinline preload="metadata" aria-hidden="true" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="reach-wash" aria-hidden="true"></div><div class="reach-copy"><p class="kicker"><span></span>the hybrid-species business</p><div class="reach-copy-state is-active" data-reach-copy="boundary"><h2 id="reach-title">The feeling is similar.<br /><em style="font-style: normal">The scale is not.</em></h2><p>AI isn't just a single-use tool - it can carry work that used to look like human thinking, but we miss the mark with how we use it.</p></div><div class="reach-copy-state" data-reach-copy="organisation" aria-hidden="true"><h2>What people do, and should do,<br /><em style="font-style: normal">changes shape.</em></h2><p>People hold judgement, have higher standards and take more accountability than ever. The AI Brain connects, iterates and executes.</p></div><details><summary>Sources</summary><div><a href="https://classics.mit.edu/Plato/phaedrus.html">Plato, Phaedrus</a><a href="https://live-www.nationalarchives.gov.uk/explore-the-collection/stories/the-proclamation-of-ned-ludd/">The National Archives, Luddite protests</a><a href="https://eric.ed.gov/?id=EJ336469">Hembree and Dessart, 79-study calculator review</a><a href="https://doi.org/10.1038/s41598-020-62877-0">GPS use and spatial memory</a></div></details></div><div class="reach-stage"><div class="capability-instrument is-active" data-reach-panel="boundary" aria-label="The changing division of work"><div class="capability-head"><p><span>01</span>AI carries</p><i aria-hidden="true"></i><p><span>02</span>You keep</p></div><div class="capability-window"><div class="capability-reel reel-ai">${reels(["Gather","Connect","Compare","Monitor","Model","Reconcile","Prepare","Retrieve","Route","Update"])}</div><div class="capability-core" aria-hidden="true"><i></i><b></b></div><div class="capability-reel reel-human">${reels(["Intent","Taste","Judgement","Method","Relationships","Context","Accountability","Exceptions","Ethics","Decision"])}</div></div></div><div class="hybrid-organisation" data-reach-panel="organisation" aria-hidden="true"><p class="instrument-label"><span></span>New-age leadership</p><div class="organisation-grid" aria-label="A hybrid organisation made from people, an AI Brain and shared roles"><article class="org-cell org-leader"><small>Human</small><strong>Leader</strong><span>Direction · judgement</span></article><article class="org-cell org-chief"><small>Human</small><strong>Chief of Staff</strong><span>Trust · context</span></article><article class="org-cell org-brain"><small>System</small><strong>AI Brain</strong><span>Memory · links</span></article><article class="org-cell org-signals"><small>Agent</small><strong>Market signals</strong><span>Watches change</span></article><article class="org-cell org-marketing"><small>Hybrid</small><strong>Marketing</strong><span>Person leads</span></article><article class="org-cell org-research"><small>Hybrid</small><strong>Research</strong><span>People listen</span></article><article class="org-cell org-sales"><small>Agent</small><strong>Sales research</strong><span>People build trust</span></article><article class="org-cell org-brief"><small>New role</small><strong>Executive brief</strong><span>One view</span></article><div class="organisation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div></div></div><nav class="reach-progress" aria-label="Sequence stages"><i aria-hidden="true"></i><button type="button" data-reach-jump="boundary" aria-current="step">Work</button><button type="button" data-reach-jump="organisation">Organisation</button></nav></div></section>
  <section class="work-scroll" aria-label="How the hybrid system works"><div class="work-sticky"><div class="work-intro"><p class="kicker"><span></span>What this feels like in practice</p><h2 class="scroll-reveal" data-reveal>When built right,<br /><em style="font-style: normal">AI is our biggest level-up.</em></h2></div><div class="work-scenes">${scenes}</div><nav class="work-nav" aria-label="Working stages"><button class="is-active" data-work-button="0" aria-current="step">Notice</button><button data-work-button="1">Connect</button><button data-work-button="2">Prepare</button></nav></div></section>
  <section class="human-proof" aria-labelledby="proof-title"><div class="proof-track" data-benefit-track data-story-rests="${plan.rests.map((r) => r.toFixed(5)).join(",")}" data-contents-rests="${plan.contentsRests.map((r) => r.toFixed(5)).join(",")}" style="--story-units: ${plan.total.toFixed(2)}"><div class="proof-story brain-benefits" data-benefits><p class="kicker" id="proof-title"><span></span>What your AI Brain makes possible</p><div class="benefit-stage" data-story-stage><nav class="story-contents" aria-label="Stories" data-story-contents>${contents}</nav>${brainBenefits}</div><div class="benefit-controls" aria-label="AI Brain stories" style="--story-count: ${leadershipStories.length}"><button type="button" data-benefit-prev aria-label="Previous story" aria-disabled="true">←</button><p><span data-benefit-count>01</span> / ${count}</p><div aria-hidden="true"><i></i></div><button type="button" data-benefit-next aria-label="Next story">→</button></div><p class="sr-status" data-benefit-status aria-live="polite"></p></div></div><div class="proof-return"><p class="kicker dark"><span></span>The returned hour</p><h2>What will you do with the hours you save on a task?</h2><ul><li>Clock off work earlier?</li><li>Invest the time into the part of your job only you can do?</li><li>Invest into the AI brain you own that will compound over time?</li></ul></div></section>`;
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
  const storyRests = storyPlan(storyWeights).rests;
  let benefit = -1; let shownKey = "";
  const setInert = (node: HTMLElement | null, hidden: boolean) => { if (!node) return; node.setAttribute("aria-hidden", String(hidden)); node.toggleAttribute("inert", hidden); };
  const paintStories = (state: ReturnType<typeof storyScroll>) => {
    const open = state.storyShown > 0;
    if (state.story !== benefit) {
      benefit = state.story;
      benefitNodes.forEach((node, i) => node.classList.toggle("is-active", i === benefit));
      const count = root.querySelector("[data-benefit-count]");
      if (count) count.textContent = String(benefit + 1).padStart(2, "0");
      /* The rule under the arrows reads these. */
      benefitControls?.style.setProperty("--benefit-index", String(benefit));
      storyLinks.forEach((link, i) => { if (i === state.mark) link.setAttribute("aria-current", "true"); else link.removeAttribute("aria-current"); });
      storyPrev?.setAttribute("aria-disabled", String(benefit === 0));
      storyNext?.setAttribute("aria-disabled", String(benefit === benefitNodes.length - 1));
    }
    storyStage?.style.setProperty("--story-shown", state.storyShown.toFixed(3));
    storyStage?.style.setProperty("--contents-shown", state.contentsShown.toFixed(3));
    const key = `${benefit}:${open}:${state.contentsShown > 0}`;
    if (key === shownKey) return;
    shownKey = key;
    benefitNodes.forEach((node, i) => setInert(node, !(open && i === benefit)));
    setInert(storyContents, !(state.contentsShown > 0));
  };
  const storyProgress = () => {
    if (!benefitTrack || !benefitPanel) return 0;
    const pinTop = parseFloat(getComputedStyle(benefitPanel).top) || 0;
    return clamp01((pinTop - benefitTrack.getBoundingClientRect().top) / Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight));
  };
  const chooseBenefit = (i: number, focus = false) => {
    const next = Math.max(0, Math.min(benefitNodes.length - 1, i));
    const status = root.querySelector("[data-benefit-status]");
    if (status) { status.textContent = ""; requestAnimationFrame(() => { status.textContent = `Story ${next + 1} of ${benefitNodes.length}. ${benefitNodes[next].querySelector("h2")?.textContent ?? ""}`; }); }
    if (!benefitTrack || !benefitPanel) return;
    const pinTop = parseFloat(getComputedStyle(benefitPanel).top) || 0;
    const top = scrollY + benefitTrack.getBoundingClientRect().top - pinTop + Math.max(1, benefitTrack.offsetHeight - benefitPanel.offsetHeight) * storyRests[next];
    scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
    if (focus) {
      const heading = benefitNodes[next].querySelector<HTMLElement>("h2");
      const land = () => { if (benefit === next && heading) heading.focus({ preventScroll: true }); };
      if (reduced) requestAnimationFrame(land); else setTimeout(land, 900);
    }
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
    if (benefitTrack && benefitPanel) paintStories(storyScroll(storyProgress(), storyWeights, reduced));
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
  storyPrev?.addEventListener("click", () => chooseBenefit(benefit - 1), { signal }); storyNext?.addEventListener("click", () => chooseBenefit(benefit + 1), { signal });
  storyLinks.forEach((link, i) => link.addEventListener("click", (event) => { event.preventDefault(); chooseBenefit(i, true); }, { signal }));

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

  setWork(0); paintStories(storyScroll(0, storyWeights, reduced)); measureWork(); update();
  return () => { abort.abort(); observers.forEach((o) => o.disconnect()); videos.forEach((v) => v.pause()); };
}
