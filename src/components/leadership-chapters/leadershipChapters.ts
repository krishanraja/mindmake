import signalsPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp";
import evidencePoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp";
import communicationsPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp";
import readyPoster from "../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import signalsFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import communicationsFilm from "@/assets/films/sep2026/communications-compose-loop-r01-20s-720p-web-sealed.mp4";
import readyFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import founderPlate from "@/assets/stories/founder-pantograph-r01-800.webp";
import updatesPlate from "@/assets/stories/updates-seal-r01-800.webp";
import briefingPlate from "@/assets/stories/briefing-tray-r01-800.webp";
import drawerPlate from "@/assets/stories/index-drawer-r01-800.webp";
import pricingPlate from "@/assets/stories/pricing-balance-r01-800.webp";
import workbenchPlate from "@/assets/stories/workbench-gears-r01-800.webp";
import pressPlate from "@/assets/stories/proofing-press-r01-800.webp";
import telescopePlate from "@/assets/stories/window-telescope-r01-800.webp";
import cardsPlate from "@/assets/stories/punched-cards-r01-800.webp";
import prismPlate from "@/assets/stories/prism-light-r01-800.webp";
import voicePlate from "@/assets/stories/voice-pipe-r01-800.webp";
import folioPlate from "@/assets/stories/shared-folio-r01-800.webp";
import stencilPlate from "@/assets/stories/stencil-correction-r01-800.webp";
import orreryPlate from "@/assets/stories/orrery-alignment-r01-800.webp";
import { mountStoryFinder, storyFinderMarkup } from "./storyFinder";

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

/* Four of the six headings the section carried as one-liners, kept word for
   word as the headings of four stories below (src/test/leadership-stories.test.ts).
   "Work nobody owns" and "Founder-led content" left with their stories on
   15 October 2026: their outcomes said nothing a stranger could use (feedback
   ledger AI-BRAIN-STORIES-OUTCOMES-001). */
export const keptHeadings = [
  "Leadership updates become consistent, even when the week was not.",
  "A change in market pricing becomes a decision, not a forgotten observation.",
  "A CEO who hates writing can still publish ideas worth following.",
  "A CRO who hates the numbers can become better at using them.",
] as const;

/**
 * What the AI Brain makes possible, told as short stories: one client, one
 * card. A story has a heading, where the leader was, what happened, and the
 * outcome it led to; only where the person wrote it, one line in their own
 * words. Each is a true client story told in our words (Krish, 15 October
 * 2026, feedback ledger AI-BRAIN-STORIES-TRUE-001). Where the client's result
 * is on the record, `record` names it in src/data/rebuildProof.ts, the outcome
 * uses only that result's public words, and the quote is that same client's
 * (AI-BRAIN-STORIES-OUTCOMES-001). A quoted line is an exact substring of its
 * testimonial in src/data/testimonials.ts, never edited
 * (src/test/leadership-stories.test.ts).
 */
export interface LeadershipStory {
  heading: string;
  situation: string;
  happened: string;
  /** What changed, in one line a stranger understands. */
  outcome: string;
  /** The client's result on the record, by its id in clientStories. */
  record?: string;
  quote?: { testimonialId: string; text: string };
  /** A generated scene from the instrument room: mood, never evidence. */
  scene?: string;
  /** Where a story has no scene: where it started and where it ended, in the record's public words. */
  figure?: { was: string; now: string };
}

/* Holds words on one line wherever they are set: "once a month" in the
   heading, and an article with its noun so no line ends on "a". */
const keep = (words: string) => words.replaceAll(" ", "\u00a0");

export const leadershipStories: readonly LeadershipStory[] = [
  /* Getting your ideas out */
  {
    heading: `A founder who posted about ${keep("once a month")} now posts most days.`,
    situation: `The founder runs ${keep("a research")} and content brand. Publishing ${keep("a post")} backed by research took days.`,
    happened: `We set up an AI system that ${keep("the founder")} owns. ${keep("It fits")} around what they do and where they get stuck.`,
    outcome: `${keep("A post")} backed by research now takes under an hour.`,
    record: "own-system",
    quote: { testimonialId: "wellness-founder", text: "It's helping me be seen by my customers." },
    scene: founderPlate,
  },
  {
    heading: keptHeadings[2],
    situation: `The CEO of an executive coaching practice avoided posting and being seen. They knew ${keep("a modern")} chief executive should be visible.`,
    happened: `Their AI brain helps them get better at the things they avoided or felt held up by. Now they can just publish.`,
    outcome: `Five videos went out in the first week.`,
    record: "hand-back",
    quote: { testimonialId: "coaching-founder", text: "He uses his incredible knowledge of AI and tech to help me with really human problems." },
    scene: pressPlate,
  },
  {
    heading: keptHeadings[0],
    situation: `The leader's updates used to depend on how their week had gone. ${keep("A patchy")} week meant patchy updates.`,
    happened: `Their AI brain knows that risk. It helps them get each update out, whatever the week has been like.`,
    outcome: `${keep("A patchy")} week no longer means patchy updates.`,
    scene: updatesPlate,
  },
  /* Seeing what is changing. The first two are Krish's own account of each
     engagement (Krish, 2026-10-24), anonymous at role level like the rest;
     neither has a result on the record, so neither carries a quote or a
     case-study link. The insurance leader may not hand over customer data, so
     her story says plainly that nothing leaves her business. */
  {
    heading: `An insurance leader who networks less now still hears what ${keep("her market")} says.`,
    situation: `A senior insurance leader used to hear her industry's news by networking. She can do far less of that now, and cannot share customer data.`,
    happened: `We built her ${keep("a one-way")} feed: the world outside her business, brought to her. Nothing goes out, so no customer data leaves.`,
    outcome: `She feels more informed, and no customer data ever leaves her business.`,
    figure: { was: "News picked up while networking", now: "Her market, brought to her" },
  },
  {
    heading: `An investor buying companies now watches his market through his own method.`,
    situation: `An investor looking to buy companies reads the market with his own method. More investors are moving into his area.`,
    happened: `We turned his method into ${keep("a system")} that watches for the outside signals it looks for, so his reading of the market keeps up.`,
    outcome: `It flags the signals he looks for, so he can stay ahead as more investors move into his area.`,
    figure: { was: "More investors crowding his area", now: "His method, running for him" },
  },
  {
    heading: `A CEO who read many newsletters every morning now gets one briefing.`,
    situation: `The chief executive subscribed to many newsletters. His morning briefing meant checking them one by one, by hand.`,
    happened: `We built him an AI brain that reads them for him.`,
    outcome: `One briefing is waiting for him each morning.`,
    scene: briefingPlate,
  },
  {
    heading: `A leader who only heard from inside now sees what is changing outside.`,
    situation: `The leader only had company data and their own people to go on. They had never thought of AI as ${keep("a way")} to learn what was happening outside.`,
    happened: `What we built brings them research on their company, their market and current events, only when it could change ${keep("a decision.")}`,
    outcome: `It gives them an edge over competitors and brings them closer to customers.`,
    scene: telescopePlate,
  },
  {
    heading: keptHeadings[1],
    situation: `The founder of an adtech firm and their leadership team kept coming back to pricing. They had the same conversation hundreds of times.`,
    happened: `Now they treat that repetition as ${keep("a signal")} to act. When pricing comes up again, the conversation ends in ${keep("a decision.")}`,
    outcome: `The price was clear within 30 days, and the first two customers signed up to trial it.`,
    record: "simple-product",
    quote: { testimonialId: "martech-founder", text: "We had a brilliant product nobody could buy, because nobody could explain it." },
    scene: pricingPlate,
  },
  /* Getting hands-on again */
  {
    heading: `A head of operations is hands-on again, with systems they built.`,
    situation: `The leader is head of operations at ${keep("a scale-up,")} ${keep("a fast-growing")} company. They manage people and wanted to be hands-on again.`,
    happened: `In ${keep("a session")} with us, they built two real, working systems.`,
    outcome: `Their week felt calmer almost at once.`,
    quote: { testimonialId: "scaleup-ops", text: "I actually built two workflows in the session that I now use every day." },
    scene: workbenchPlate,
  },
  {
    heading: `Someone new to AI now builds their own dashboard by saying what they need.`,
    situation: `A member of the team was new to AI. They needed ${keep("a dashboard")} for the accounts they look after.`,
    happened: `Their AI brain guided them as they built it, with the right data underneath and the company's own voice.`,
    outcome: `They talked it into being, at least five times faster than AI alone, and far more accurately.`,
    scene: voicePlate,
  },
  {
    heading: keptHeadings[3],
    situation: `The chief revenue officer at ${keep("a data-infrastructure")} company was fine with numbers but bad with spreadsheets.`,
    happened: `Now they play to their strengths. They reliably build their own AI agents, helpers that handle the work they hated.`,
    outcome: `The company changed how it sells, and that led to ${keep("a paid")} trial with ${keep("a major")} US publisher.`,
    record: "market-moves",
    quote: { testimonialId: "data-infra-cro", text: "We set up an AI-native go-to-market system that made us rethink who we hire and what they do." },
    scene: cardsPlate,
  },
  /* Keeping your team in step */
  {
    heading: `Teams working on the same account stop asking each other the same questions.`,
    situation: `Different teams worked on the same accounts. The same questions kept going back and forth between them.`,
    happened: `Each person's AI brain now knows what the other teams already know about an account, including who already looks after it.`,
    outcome: `The repeated questions stopped.`,
    scene: folioPlate,
  },
  {
    heading: `One person corrected it once, and everyone's AI got better that day.`,
    situation: `One person kept being told something by their AI that had stopped being true.`,
    happened: `They corrected it once.`,
    outcome: `That same day, the fix reached everyone it applied to, and only them.`,
    scene: stencilPlate,
  },
  {
    heading: `A team's account plans now serve the division's goals and the CEO's vision.`,
    situation: `A team looked after ${keep("a few")} large accounts. Their plans, the division's goals and the chief executive's direction sat in different places.`,
    happened: `Each person's AI brain now works with the division's and the CEO's. It maps each account's health and its contacts by seniority.`,
    outcome: `It tells the CEO when someone senior needs them to step in.`,
    scene: orreryPlate,
  },
  /* Making the big AI calls: three results on the record, told as stories in
     their public words only (04_PROOF.md, the eight stories). */
  {
    heading: `Two quarters of argument over build or partner ended in one day.`,
    situation: `The chief revenue officer of ${keep("a media")} company had spent two quarters refereeing one argument: build it themselves, or partner.`,
    happened: `We worked it through with the room in one day. The answer was to partner now, and look at building again in twelve months, once the data is stronger.`,
    outcome: `The partner agreement was signed the following month.`,
    record: "day-one",
    quote: { testimonialId: "media-cro", text: "He doesn't want to loiter." },
    scene: prismPlate,
  },
  {
    heading: `A publisher weighing up fourteen AI suppliers made three decisions.`,
    situation: `A top-10 US digital publisher had fourteen AI suppliers competing for its business.`,
    happened: `It started with hands-on AI sessions. From there, the fourteen became three decisions.`,
    outcome: `Its own team built the chosen work, with no new hires.`,
    record: "team-decides",
    quote: { testimonialId: "publisher-ops", text: "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability." },
    scene: drawerPlate,
  },
  {
    heading: `A broadcaster stopped eleven of its fourteen AI tools and kept its budget.`,
    situation: `A legacy broadcast business had fourteen AI tools on the go.`,
    happened: `We tied every AI choice back to the business. Eleven of the fourteen tools stopped, and the budget stayed.`,
    outcome: `Its first working system went live inside 90 days.`,
    record: "business-first",
    figure: { was: "Fourteen AI tools on the go", now: "Eleven stopped, and one working system live" },
  },
];

export const leadershipScenes = [
  [signalsFilm, signalsPoster, "It notices what changed.", "Signals arrive before someone asks for a report."],
  [evidenceFilm, evidencePoster, "It joins the evidence.", "New information meets what the business already knows."],
  [communicationsFilm, communicationsPoster, "It prepares the next move.", "Useful work reaches you ready for a decision."],
] as const;

const reels = (items: string[]) => `<ul>${items.map((x) => `<li>${x}</li>`).join("")}</ul><ul aria-hidden="true">${items.map((x) => `<li>${x}</li>`).join("")}</ul>`;

/** The hybrid organisation: the leader, their chief of staff, the AI Brain and
    the roles around them. One source for the reach chapter here and the
    homepage's "how it works" section (homepageSections.ts). */
export const organisationGridMarkup = `<div class="organisation-grid" aria-label="A hybrid organisation made from people, an AI Brain and shared roles"><article class="org-cell org-leader"><small>Human</small><strong>Leader</strong><span>Direction · judgement</span></article><article class="org-cell org-chief"><small>Human</small><strong>Chief of Staff</strong><span>Trust · context</span></article><article class="org-cell org-brain"><small>System</small><strong>AI Brain</strong><span>Memory · links</span></article><article class="org-cell org-signals"><small>Agent</small><strong>Market signals</strong><span>Watches change</span></article><article class="org-cell org-marketing"><small>Hybrid</small><strong>Marketing</strong><span>Person leads</span></article><article class="org-cell org-research"><small>Hybrid</small><strong>Research</strong><span>People listen</span></article><article class="org-cell org-sales"><small>Agent</small><strong>Sales research</strong><span>People build trust</span></article><article class="org-cell org-brief"><small>New role</small><strong>Executive brief</strong><span>One view</span></article><div class="organisation-lines" aria-hidden="true"><i></i><i></i><i></i></div></div>`;

export function leadershipChaptersMarkup() {
  const scenes = leadershipScenes.map((s, i) => `<article class="work-scene${i ? "" : " is-active"}" data-work-scene="${i}"><video muted loop playsinline preload="${i ? "none" : "metadata"}" aria-hidden="true" poster="${esc(s[1])}"><source src="${esc(s[0])}" type="video/mp4" /></video><div class="work-wash"></div><div><small>0${i + 1}</small><h3>${s[2]}</h3><p>${s[3]}</p></div></article>`).join("");
  return `<section class="reach-sequence" data-reach aria-labelledby="reach-title"><div class="reach-sticky"><video muted loop playsinline preload="metadata" aria-hidden="true" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="reach-wash" aria-hidden="true"></div><div class="reach-copy"><p class="kicker"><span></span>the hybrid-species business</p><div class="reach-copy-state is-active" data-reach-copy="boundary"><h2 id="reach-title">The feeling is similar.<br /><em style="font-style: normal">The scale is not.</em></h2><p>AI isn't just a single-use tool - it can carry work that used to look like human thinking, but we miss the mark with how we use it.</p></div><div class="reach-copy-state" data-reach-copy="organisation" aria-hidden="true"><h2>What people do, and should do,<br /><em style="font-style: normal">changes shape.</em></h2><p>People hold judgement, have higher standards and take more accountability than ever. The AI Brain connects, iterates and executes.</p></div><details><summary>Sources</summary><div><a href="https://classics.mit.edu/Plato/phaedrus.html">Plato, Phaedrus</a><a href="https://live-www.nationalarchives.gov.uk/explore-the-collection/stories/the-proclamation-of-ned-ludd/">The National Archives, Luddite protests</a><a href="https://eric.ed.gov/?id=EJ336469">Hembree and Dessart, 79-study calculator review</a><a href="https://doi.org/10.1038/s41598-020-62877-0">GPS use and spatial memory</a></div></details></div><div class="reach-stage"><div class="capability-instrument is-active" data-reach-panel="boundary" aria-label="The changing division of work"><div class="capability-head"><p><span>01</span>AI carries</p><i aria-hidden="true"></i><p><span>02</span>You keep</p></div><div class="capability-window"><div class="capability-reel reel-ai">${reels(["Gather","Connect","Compare","Monitor","Model","Reconcile","Prepare","Retrieve","Route","Update"])}</div><div class="capability-core" aria-hidden="true"><i></i><b></b></div><div class="capability-reel reel-human">${reels(["Intent","Taste","Judgement","Method","Relationships","Context","Accountability","Exceptions","Ethics","Decision"])}</div></div></div><div class="hybrid-organisation" data-reach-panel="organisation" aria-hidden="true"><p class="instrument-label"><span></span>New-age leadership</p>${organisationGridMarkup}</div></div><nav class="reach-progress" aria-label="Sequence stages"><i aria-hidden="true"></i><button type="button" data-reach-jump="boundary" aria-current="step">Work</button><button type="button" data-reach-jump="organisation">Organisation</button></nav></div></section>
  <section class="work-scroll" aria-label="How the hybrid system works"><div class="work-sticky"><div class="work-intro"><p class="kicker"><span></span>What this feels like in practice</p><h2 class="scroll-reveal" data-reveal>When built right,<br /><em style="font-style: normal">AI is our biggest level-up.</em></h2></div><div class="work-scenes">${scenes}</div><nav class="work-nav" aria-label="Working stages"><button class="is-active" data-work-button="0" aria-current="step">Notice</button><button data-work-button="1">Connect</button><button data-work-button="2">Prepare</button></nav></div></section>
  <section class="human-proof is-finder" aria-labelledby="proof-title">${storyFinderMarkup(leadershipStories)}<div class="proof-return"><p class="kicker dark"><span></span>The returned hour</p><h2>What will you do with the hours you save on a task?</h2><ul><li>Clock off work earlier?</li><li>Invest the time into the part of your job only you can do?</li><li>Invest into the AI brain you own that will compound over time?</li></ul></div></section>`;
}

export interface LeadershipChaptersOptions {
  reduced: boolean;
  /** Opens the free AI brief at a door, from a story. */
  onStart?: (door: "brain" | "gtm") => void;
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
export function mountLeadershipChapters(root: HTMLElement, { reduced, media = false, canPlay = () => !reduced, onStart }: LeadershipChaptersOptions) {
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
  const videos = media ? [...root.querySelectorAll<HTMLVideoElement>(".reach-sequence video, .work-scroll video")] : [];
  if (media && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver((entries) => entries.forEach((entry) => {
      const video = entry.target as HTMLVideoElement;
      /* The pinned phone scenes play by the sweep, above, not by visibility: all three are in view at once. */
      if (workMode === "pinned" && workVideos.includes(video)) return;
      if (entry.isIntersecting && canPlay()) void video.play().catch(() => undefined); else video.pause();
    }), { threshold: 0.18 });
    observers.push(videoObserver); videos.forEach((v) => videoObserver.observe(v));
    const reveals = [...root.querySelectorAll<HTMLElement>(".reach-sequence [data-reveal], .work-scroll [data-reveal]")];
    if (reduced) reveals.forEach((x) => x.classList.add("is-revealed"));
    else { const observer = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-revealed"); observer.unobserve(e.target); } }), { threshold: 0.25 }); observers.push(observer); reveals.forEach((x) => observer.observe(x)); }
  } else if (media) root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((x) => x.classList.add("is-revealed"));

  const unmountFinder = mountStoryFinder(root, { reduced, onStart });
  setWork(0); measureWork(); update();
  return () => { abort.abort(); unmountFinder(); observers.forEach((o) => o.disconnect()); videos.forEach((v) => v.pause()); };
}
