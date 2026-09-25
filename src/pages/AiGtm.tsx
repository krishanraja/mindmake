import { useEffect, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useLockedMotion } from "@/components/mindmake/locked/useLockedMotion";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import signals from "@/data/vnext/gtm-signals.json";
import quietWorkshopFilm from "@/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4";
import signalsArriveFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import quietWorkshopPoster from "../../prototypes/website-redesign-recovery/gtm-market-change/media/quiet-workshop-growth-poster.png";
import signalsArrivePoster from "../../prototypes/website-redesign-recovery/gtm-market-change/media/signals-arrive-poster.png";
import { PairingBridge } from "@/components/mindmake/PairingBridge";
import "@/styles/mindmake.css";
import "@/styles/mindmake-locked-gtm.css";
import "@/styles/mindmake-gtm-plain.css";

/* The plain-English AI GTM page (GTM-PLAIN-R2, owner-approved 24 September
   2026). It keeps the approved GTM surface's markup vocabulary, tokens, films,
   paper leaves, paddles and scroll build; only the words, the business switch,
   the 30-day plan and the team board are new. */

type Mode = "established" | "founder";
type View = "today" | "native";
type Kind = "person" | "hybrid" | "agent";
type Role = { id: string; kind: Kind; title: string; line: string; isNew?: boolean };

const KIND_MARK: Record<Kind, string> = { person: "H", hybrid: "H+A", agent: "A" };
const KIND_NAME: Record<Kind, string> = { person: "Person", hybrid: "Person + agents", agent: "Agent-first" };

/* Each lever cites one dated company source from the locked signal fixture. */
const SOURCES = {
  product: { name: "Uber", date: "Apr 2026", href: signals.product.source },
  price: { name: "HubSpot", date: "Apr 2026", href: signals.pricing.source },
  positioning: { name: "Shopify", date: "Mar 2026", href: signals.commerce.source },
  people: { name: "Zendesk", date: "May 2026", href: signals.service.source },
} as const;

const LEVERS = ["product", "price", "positioning", "people"] as const;
const LEVER_NAMES = { product: "Product", price: "Price", positioning: "Positioning", people: "People" } as const;
const LEAF_CLASS = { product: "leaf-product", price: "leaf-price", positioning: "leaf-positioning", people: "leaf-people" } as const;
const leafOrigins = [
  { x: 272, y: 182 },
  { x: -330, y: 182 },
  { x: 288, y: -166 },
  { x: -330, y: -166 },
];

const MODES: Record<Mode, {
  tab: string;
  tabSmall: string;
  lede: string;
  hub: string;
  levers: Record<(typeof LEVERS)[number], { now: string; was: string }>;
  teamHead: string;
  lead: Record<View, Role>;
  roles: Record<View, Role[]>;
  tally: Record<View, string>;
  decisions: Record<string, string>;
  proof: { result: string; quote: string; who: string };
}> = {
  established: {
    tab: "I run an established business",
    tabSmall: "Fixing a model that works",
    lede: "AI is changing what customers pay for, how they choose and who does the work. We rebuild your go-to-market around it, then test it with real buyers.",
    hub: "Established business",
    levers: {
      product: { now: "Software that finishes the work.", was: "Software people use" },
      price: { now: "Charge per task or result, with a cap buyers can forecast.", was: "Per seat, per month" },
      positioning: { now: "Clear enough that an AI assistant recommends you.", was: "Written for people browsing" },
      people: { now: "A smaller team leads while agents carry the volume.", was: "Hire more people as you grow" },
    },
    teamHead: "Your sales and marketing team gets agents.",
    lead: {
      today: { id: "lead", kind: "person", title: "Chief Revenue Officer", line: "Owns the number" },
      native: { id: "lead", kind: "person", title: "Chief Revenue Officer", line: "Owns the number and the agents" },
    },
    roles: {
      today: [
        { id: "sales", kind: "person", title: "Sales", line: "8 account executives" },
        { id: "sdr", kind: "person", title: "Lead qualification", line: "4 people" },
        { id: "marketing", kind: "person", title: "Marketing", line: "5 people" },
        { id: "success", kind: "person", title: "Customer success", line: "6 people" },
        { id: "ops", kind: "person", title: "Sales operations", line: "3 people" },
        { id: "price", kind: "person", title: "Pricing", line: "Set once a year by finance" },
      ],
      native: [
        { id: "sales", kind: "hybrid", title: "Sales", line: "4 people + research and proposal agents" },
        { id: "sdr", kind: "agent", title: "Lead qualification", line: "Agents first, people take exceptions" },
        { id: "marketing", kind: "hybrid", title: "Marketing", line: "2 people + content agents" },
        { id: "success", kind: "hybrid", title: "Customer success", line: "3 people + support agents" },
        { id: "ops", kind: "agent", title: "Market intelligence", line: "Watches rivals, prices and buyers", isNew: true },
        { id: "price", kind: "person", title: "Pricing owner", line: "Owns what customers pay for", isNew: true },
      ],
    },
    tally: { today: "27 people · 0 agents", native: "11 people · 5 agent roles" },
    decisions: {
      lead: "How do you set targets when part of the team is software?",
      sales: "When agents do the research and first drafts, do you cover more accounts or run a smaller team?",
      sdr: "Who is accountable when an agent turns away a lead that would have bought?",
      marketing: "Which work must stay in a human voice, and who signs off what agents publish?",
      success: "If agents resolve most tickets, what are customers paying your people for?",
      ops: "Who reads what this agent finds, and how fast can a finding change your price?",
      price: "Per task or per result: which can your buyers forecast and your finance team bill?",
    },
    proof: {
      result: "A new sales path led to a paid test with a major US publisher.",
      quote: "We set up an AI-native go-to-market system that made us rethink who we hire and what they do.",
      who: "Chief Revenue Officer, data-infrastructure company",
    },
  },
  founder: {
    tab: "I'm building an AI-native business",
    tabSmall: "Starting from scratch",
    lede: "AI is changing what customers pay for, how they choose and who does the work. We help you build a go-to-market that starts AI-native, then test it with real buyers.",
    hub: "AI-native start",
    levers: {
      product: { now: "Build around the job AI can finish.", was: "Match the leader's feature list" },
      price: { now: "Charge for work done from the first customer.", was: "Borrow seat pricing from SaaS" },
      positioning: { now: "One clear job buyers and AI assistants can repeat.", was: "Another AI tool in a crowded list" },
      people: { now: "The founder plus agents until the model is proven.", was: "Hire sales, then marketing, then support" },
    },
    teamHead: "Your first commercial team can be mostly agents.",
    lead: {
      today: { id: "lead", kind: "person", title: "Founder", line: "Sells, markets and supports" },
      native: { id: "lead", kind: "person", title: "Founder", line: "Sets direction and closes deals" },
    },
    roles: {
      today: [
        { id: "hire", kind: "person", title: "First sales hire", line: "Planned for next quarter" },
        { id: "content", kind: "person", title: "Contractors", line: "Content, design and ads" },
        { id: "support", kind: "person", title: "Support", line: "The founder's evenings" },
      ],
      native: [
        { id: "hire", kind: "hybrid", title: "Customer lead", line: "First hire, working with agents" },
        { id: "content", kind: "agent", title: "Content", line: "Drafts in your voice, you approve" },
        { id: "support", kind: "agent", title: "Onboarding and support", line: "Answers first, escalates the rest" },
        { id: "outreach", kind: "agent", title: "Outreach and research", line: "Finds and warms the right buyers", isNew: true },
      ],
    },
    tally: { today: "1 founder · 1 hire planned", native: "2 people · 4 agent roles" },
    decisions: {
      lead: "Which calls must only you make, and which can agents take today?",
      hire: "Is your first hire a seller, or someone who runs the agents that sell?",
      content: "Is your voice written down clearly enough for an agent to follow it?",
      support: "When should a customer reach you instead of an agent?",
      outreach: "What must an agent never say to a buyer on your behalf?",
    },
    proof: {
      result: "Position and price rebuilt in 30 days. Two pilots signed during the work.",
      quote: "We had a brilliant product nobody could buy, because nobody could explain it. We're now clear on who we are in the new world.",
      who: "Founder, adtech firm",
    },
  },
};

const PLAN = [
  { when: "Week 1", what: "We map all four", detail: "What AI changes for your product, price, positioning and people." },
  { when: "Weeks 2 to 4", what: "We build the move worth most", detail: "And test it with real buyers." },
  { when: "Day 30", what: "You keep it", detail: "The model, the evidence and anything we built." },
];

const MENU = [
  "Pricing model and buyer test",
  "Positioning and messaging",
  "AI-native org chart",
  "Working agents",
  "Product marketing launch kit",
  "AI market read",
];

function clamp(value: number) {
  return Math.max(0, Math.min(1, value));
}

/* Scroll progress of one element through the viewport, 0 before it arrives and
   1 once it has fully settled. Reverses when the reader scrolls back up. The
   server render and first client render use the settled state, so a reader
   without scripts, or before they run, gets the finished build. */
function useScrollProgress(ref: React.RefObject<HTMLElement>, startAt: number, span: number) {
  const [progress, setProgress] = useState(1);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (reduced.matches) {
        setProgress(1);
        return;
      }
      const rect = element.getBoundingClientRect();
      const start = window.innerHeight * startAt;
      const distance = Math.max(240, window.innerHeight * span);
      setProgress(clamp((start - rect.top) / distance));
    };
    const request = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", request);
    reduced.addEventListener?.("change", request);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", request);
      reduced.removeEventListener?.("change", request);
    };
  }, [ref, startAt, span]);
  return progress;
}

export default function AiGtm() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const rootRef = useRef<HTMLDivElement>(null);
  const leverRef = useRef<HTMLDivElement>(null);
  const teamRef = useRef<HTMLDivElement>(null);
  useLockedMotion(rootRef);

  const [mode, setMode] = useState<Mode>("established");
  const [stage, setStage] = useState(0);
  const [chosenView, setChosenView] = useState<View | null>(null);
  const [picked, setPicked] = useState("lead");

  const copy = MODES[mode];
  const leverProgress = useScrollProgress(leverRef, 0.9, 0.62);
  const teamProgress = useScrollProgress(teamRef, 0.86, 0.6);
  // The chart builds from today's team to the AI-native one as it scrolls into
  // view, and back again on the way up, until the reader takes the switch.
  const view: View = chosenView ?? (teamProgress >= 0.55 ? "native" : "today");
  const roles = copy.roles[view];
  const role = picked === "lead" ? copy.lead[view] : roles.find((item) => item.id === picked) ?? copy.lead[view];
  const leverInverse = 1 - leverProgress;

  useEffect(() => {
    rootRef.current?.classList.remove("no-js");
  }, []);

  const chooseMode = (next: Mode) => {
    setMode(next);
    setPicked("lead");
    setStage(0);
    trackRef.current?.scrollTo({ left: 0 });
  };

  const trackRef = useRef<HTMLDivElement>(null);
  const goToStage = (index: number) => {
    const next = Math.max(0, Math.min(LEVERS.length - 1, index));
    setStage(next);
    const track = trackRef.current;
    const slide = track?.children[next] as HTMLElement | undefined;
    if (track && slide) {
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: smooth ? "smooth" : "auto" });
    }
  };
  const onTrackScroll = () => {
    const track = trackRef.current;
    if (!track || !track.children.length) return;
    const width = (track.children[0] as HTMLElement).offsetWidth;
    const index = Math.round(track.scrollLeft / Math.max(1, width));
    if (index !== stage) setStage(Math.max(0, Math.min(LEVERS.length - 1, index)));
  };

  return (
    <MindmakeShell onStart={() => openBrief("gtm")} mainClassName="mm-locked-route-main" siteClassName="mm-route-gtm" compactFooter>
      <SEO title="Build your AI GTM" description="Make your pricing, positioning and team AI-native, then test it with real buyers." canonical="/ai-gtm" />
      <div ref={rootRef} className="mm-locked-gtm mm-gtm-plain no-js" data-mode={mode}>
        <div className="page-shell">
          <section className="intro" aria-labelledby="page-title">
            <figure className="motion-scene motion-scene--threshold" aria-hidden="true" data-motion-scene="threshold">
              <video aria-hidden="true" className="motion-film" data-motion-video="threshold" data-src={quietWorkshopFilm} poster={quietWorkshopPoster} preload="none" muted loop playsInline />
              <span className="motion-scrim" />
            </figure>
            <h1 id="page-title">Make your pricing, positioning and team AI-native.</h1>
            <div className="intro-side">
              <p className="kicker">One go-to-market move in 30 days</p>
              <p className="intro-copy">{copy.lede}</p>
            </div>
          </section>

          <section className="signal-deck next-deck" aria-labelledby="business-heading">
            <figure className="motion-scene motion-scene--signals" aria-hidden="true" data-motion-scene="signals">
              <video aria-hidden="true" className="motion-film" data-motion-video="signals" data-src={signalsArriveFilm} poster={signalsArrivePoster} preload="none" muted loop playsInline />
              <span className="motion-scrim" />
            </figure>
            <div className="signal-index">
              <div className="section-label">
                <span>01</span>
                <h2 id="business-heading">Your business</h2>
              </div>
              <fieldset className="signal-selector">
                <legend className="sr-only">Which describes your business?</legend>
                {(Object.keys(MODES) as Mode[]).map((key, index) => (
                  <label className="signal-tab" key={key}>
                    <input type="radio" name="business" value={key} checked={mode === key} onChange={() => chooseMode(key)} />
                    <span className="tab-number">0{index + 1}</span>
                    <span><b>{MODES[key].tab}</b><small>{MODES[key].tabSmall}</small></span>
                  </label>
                ))}
              </fieldset>
            </div>
            <article className="signal-readout">
              <div className="readout-topline">
                <p>How the 30 days work</p>
                <p className="readout-note">Fee agreed privately</p>
              </div>
              <ol className="next-plan">
                {PLAN.map((step) => (
                  <li key={step.when}>
                    <span>{step.when}</span>
                    <b>{step.what}</b>
                    <small>{step.detail}</small>
                  </li>
                ))}
              </ol>
              <details className="evidence-drawer">
                <summary>What we can build for you</summary>
                <div className="evidence-body">
                  <ul className="next-menu">
                    {MENU.map((item) => <li key={item}>{item}</li>)}
                  </ul>
                  <p>We agree which of these go into your 30 days, and the fee, before work starts.</p>
                </div>
              </details>
            </article>
          </section>

          <section className="linkage next-levers" aria-labelledby="levers-heading">
            <div className="question-block">
              <div className="section-label">
                <span>02</span>
                <p>What changes</p>
              </div>
              <div className="question-copy">
                <h2 id="levers-heading">Four things change. We rebuild all four.</h2>
              </div>
            </div>

            <div
              ref={leverRef}
              className="instrument"
              aria-label="What changes in your go-to-market"
              data-build={leverProgress >= 0.985 ? "built" : leverProgress > 0.02 ? "building" : "idle"}
              style={{
                "--build-progress": leverProgress.toFixed(4),
                "--build-inverse": leverInverse.toFixed(4),
                "--build-offset": `${Math.round(leverInverse * 640)}px`,
                "--mobile-leaf-y": `${Math.round(leverInverse * 34)}px`,
              } as React.CSSProperties}
            >
              <div className="machine-film" aria-hidden="true"><div className="machine-vignette" /></div>
              <div className="build-meter" aria-hidden="true"><span /><i /></div>
              <div className="instrument-surface" aria-hidden="true">
                <svg className="linkage-lines" viewBox="0 0 1000 610" preserveAspectRatio="none">
                  <path className="trace trace-a" d="M500 310 C410 265 375 145 250 124" />
                  <path className="trace trace-b" d="M500 310 C605 258 650 145 760 124" />
                  <path className="trace trace-c" d="M500 310 C405 370 350 476 242 480" />
                  <path className="trace trace-d" d="M500 310 C602 370 650 474 770 480" />
                  <circle cx="500" cy="310" r="70" />
                  <circle cx="500" cy="310" r="54" />
                </svg>
                <div className="hub">
                  <span>Your go-to-market</span>
                  <b>{copy.hub}</b>
                  <i aria-hidden="true" />
                </div>
              </div>

              <div className="outcome-grid" data-device-variant="desktop">
                {LEVERS.map((key, index) => (
                  <article
                    key={key}
                    className={`paper-leaf ${LEAF_CLASS[key]}`}
                    style={{
                      "--leaf-x": `${Math.round(leafOrigins[index].x * leverInverse)}px`,
                      "--leaf-y": `${Math.round(leafOrigins[index].y * leverInverse)}px`,
                    } as React.CSSProperties}
                  >
                    <span className="leaf-index">{String.fromCharCode(65 + index)}</span>
                    <h3>{LEVER_NAMES[key]}</h3>
                    <p>{copy.levers[key].now}</p>
                    <div className="leaf-was">
                      <span><s>{copy.levers[key].was}</s></span>
                      <a href={SOURCES[key].href} target="_blank" rel="noreferrer">{SOURCES[key].name} · {SOURCES[key].date} <span aria-hidden="true">&#8599;</span></a>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mobile-stage" data-device-variant="mobile">
                <div className="mobile-link" aria-hidden="true">
                  <span className="link-pin" /><i /><span className="link-pin" />
                </div>
                <div className="lever-track" ref={trackRef} onScroll={onTrackScroll} role="group" aria-roledescription="carousel" aria-label="The four changes">
                  {LEVERS.map((key, index) => (
                    <article key={key} className="paper-leaf mobile-leaf" aria-roledescription="slide" aria-label={`${index + 1} of 4: ${LEVER_NAMES[key]}`}>
                      <span className="leaf-index">{String.fromCharCode(65 + index)} / 04</span>
                      <h3>{LEVER_NAMES[key]}</h3>
                      <p>{copy.levers[key].now}</p>
                      <div className="leaf-was">
                        <span><s>{copy.levers[key].was}</s></span>
                        <a href={SOURCES[key].href} target="_blank" rel="noreferrer">{SOURCES[key].name} · {SOURCES[key].date} <span aria-hidden="true">&#8599;</span></a>
                      </div>
                    </article>
                  ))}
                </div>
                <nav className="stage-controls" aria-label="The four changes">
                  <button type="button" className="stage-arrow" onClick={() => goToStage(stage - 1)} disabled={stage === 0} aria-label="Previous change">
                    <span aria-hidden="true">&larr;</span>
                  </button>
                  <p className="stage-count" aria-live="polite">
                    <span className="sr-only">{LEVER_NAMES[LEVERS[stage]]}, </span>
                    {String(stage + 1).padStart(2, "0")} / {String(LEVERS.length).padStart(2, "0")}
                  </p>
                  <button
                    type="button"
                    className="stage-arrow"
                    onClick={() => goToStage(stage === LEVERS.length - 1 ? 0 : stage + 1)}
                    aria-label={stage === LEVERS.length - 1 ? `Back to ${LEVER_NAMES[LEVERS[0]]}` : `Next: ${LEVER_NAMES[LEVERS[stage + 1]]}`}
                  >
                    <span aria-hidden="true">{stage === LEVERS.length - 1 ? "\u21BA" : "\u2192"}</span>
                  </button>
                </nav>
              </div>
            </div>
          </section>

          <section className="linkage next-team" aria-labelledby="team-heading">
            <div className="question-block">
              <div className="section-label">
                <span>03</span>
                <p>Your team</p>
              </div>
              <div className="question-copy">
                <h2 id="team-heading">{copy.teamHead}</h2>
              </div>
            </div>

            <div className="response-rail">
              <fieldset className="response-selector">
                <legend className="sr-only">Team view</legend>
                {(["today", "native"] as View[]).map((key) => (
                  <label className="response-paddle" key={key}>
                    <input type="radio" name="team-view" value={key} checked={view === key} onChange={() => setChosenView(key)} />
                    <span className="paddle-mark" aria-hidden="true" />
                    <span>{key === "today" ? "Today" : "AI-native"}</span>
                  </label>
                ))}
              </fieldset>
              <p className="team-tally" aria-live="polite">{copy.tally[view]}</p>
            </div>

            <div ref={teamRef} className="team-board" data-view={view} style={{ "--team-progress": teamProgress.toFixed(4) } as React.CSSProperties}>
              <div className="team-lead">
                <RoleTag role={copy.lead[view]} active={picked === "lead"} decision={copy.decisions.lead} onPick={() => setPicked("lead")} />
              </div>
              <div className="team-roles">
                {roles.map((item) => (
                  <RoleTag key={`${view}-${item.id}`} role={item} active={picked === item.id} decision={copy.decisions[item.id]} onPick={() => setPicked(item.id)} />
                ))}
              </div>
            </div>

            <article className="test-slip team-decision" aria-live="polite" aria-labelledby="decision-title">
              <div className="test-rivet" aria-hidden="true" />
              <p className="test-label"><span>{KIND_MARK[role.kind]}</span> {role.title}</p>
              <h3 id="decision-title">{copy.decisions[role.id] ?? copy.decisions.lead}</h3>
              <p>{KIND_NAME[role.kind]}. {role.line}. We work through decisions like this with you in week 1.</p>
              <div className="test-footer">
                <span>The decision you'll face</span>
                <span className="perforation" aria-hidden="true" />
                <span>Illustrative team</span>
              </div>
            </article>
          </section>

          <section className="signal-deck next-proof" aria-labelledby="proof-heading">
            <div className="signal-index">
              <div className="section-label">
                <span>04</span>
                <h2 id="proof-heading">Result</h2>
              </div>
            </div>
            <article className="signal-readout">
              <blockquote className="observation">&ldquo;{copy.proof.quote}&rdquo;</blockquote>
              <p className="proof-result">{copy.proof.result}</p>
              <div className="proof-attribution">
                <p>{copy.proof.who}</p>
                <a href="/case-studies">Read the story <span aria-hidden="true">&rarr;</span></a>
              </div>
            </article>
          </section>
        </div>
      </div>
      <PairingBridge route="gtm" onStart={() => openBrief("gtm")} />
      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" presentation="drawer" journeyKey={briefJourneyKey} initialContext={copy.tab} />
    </MindmakeShell>
  );
}

/* On a phone the chosen role opens in place, so the decision appears under the
   finger that asked for it; wider screens show it on the slip below the board. */
function RoleTag({ role, active, decision, onPick }: { role: Role; active: boolean; decision: string; onPick: () => void }) {
  return (
    <div className={`role-cell${active ? " is-active" : ""}`}>
      <button type="button" className={`role-tag kind-${role.kind}${role.isNew ? " is-new" : ""}`} aria-pressed={active} onClick={onPick}>
        <span className="role-kind"><i aria-hidden="true">{KIND_MARK[role.kind]}</i><span className="role-kind-text">{KIND_NAME[role.kind]}</span></span>
        <b>{role.title}</b>
        <small>{role.line}</small>
        {role.isNew ? <em>New role</em> : null}
      </button>
      {active ? <p className="role-decision"><span>The decision you'll face</span>{decision}</p> : null}
    </div>
  );
}
