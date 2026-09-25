import { useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { PairingBridge } from "@/components/mindmake/PairingBridge";
import { useLockedMotion } from "@/components/mindmake/locked/useLockedMotion";
import { Opening } from "@/components/ai-gtm/Opening";
import { LeverChapter, type LeverStep } from "@/components/ai-gtm/LeverChapter";
import { Workaround } from "@/components/ai-gtm/Workaround";
import { TurnBand } from "@/components/ai-gtm/TurnBand";
import { PlanChapter } from "@/components/ai-gtm/PlanChapter";
import { TeamChapter, type TeamCopy } from "@/components/ai-gtm/TeamChapter";
import { ProofBand } from "@/components/ai-gtm/ProofBand";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import signals from "@/data/vnext/gtm-signals.json";
import quietWorkshopFilm from "@/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4";
import signalsArriveFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import quietWorkshopPoster from "../../prototypes/website-redesign-recovery/case-study-browsing/media/quiet-workshop-growth-loop-r01-20s-720p-web-sealed-poster.webp";
import signalsArrivePoster from "../../prototypes/website-redesign-recovery/case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp";
import "@/styles/mindmake.css";
import "@/styles/mindmake-ai-gtm.css";

/* The AI GTM page (r45, awaiting the owner's review of the rendered page).

   Told as one argument, in the order a buyer lives it: the change they already
   feel, in four places; the workaround they would reach for and what it would
   cost them; the offer as the answer; the 30 days; what their team becomes;
   one result. Each chapter holds one idea on one screen, and the
   three with more than one state pin and build with scroll in both directions.
   It is drawn in the site's own system (Newsreader headlines, Archivo body,
   Plex Mono labels, the house palette and container), with the two films the
   continuity contract gives this page and no other imagery. */

type Mode = "established" | "founder";

/* The four levers, the moment each one is felt, and the dated public source
   that shows it moving. Chapter one reads the same for both kinds of business.

   Each lever cites the source whose recorded observation supports it, and each
   felt line says no more than that source does (gtm-signals.json carries the
   observation and its limit): Zendesk sells software as a workforce that does
   the service job; HubSpot's agents answer customers and recommend leads, and
   are paid for per resolved conversation and per lead; Shopify puts merchants'
   products inside AI assistants. The People line is where the page first says
   "agents", so it says what one is. */
const LEVERS = ["product", "price", "positioning", "people"] as const;
const LEVER_NAMES = { product: "Product", price: "Price", positioning: "Positioning", people: "People" } as const;
const SIGNAL_FOR = { product: signals.service, price: signals.pricing, positioning: signals.commerce, people: signals.pricing } as const;
const SOURCE_NAME = { product: "Zendesk", price: "HubSpot", positioning: "Shopify", people: "HubSpot" } as const;

const FELT = {
  product: "Your buyers are being offered software that does the whole job.",
  price: "Your buyers can already pay some software for each result it delivers.",
  positioning: "Your next buyer may ask an AI assistant for a shortlist before they visit your website.",
  people: "Agents, software that works on its own, now answer customers and find leads.",
} as const;

const SHIFT = {
  product: { was: "Software people use", now: "Software that finishes the work." },
  price: { was: "Per seat, per month", now: "Charge per task or result, with a cap buyers can forecast." },
  positioning: { was: "Written for people browsing", now: "Clear enough that an AI assistant recommends you." },
  people: { was: "Hire more people as you grow", now: "A smaller team leads while agents carry the volume." },
} as const;

const LEVER_STEPS: LeverStep[] = LEVERS.map((key) => ({
  key,
  name: LEVER_NAMES[key],
  felt: FELT[key],
  was: SHIFT[key].was,
  now: SHIFT[key].now,
  source: { name: SOURCE_NAME[key], date: SIGNAL_FOR[key].date, href: SIGNAL_FOR[key].source },
}));

const OPENING = {
  lead: "Your customers have changed",
  accent: "how they buy.",
  deck: "You still build, price, position and hire by the old playbook.",
};

const WORKAROUND = {
  easy: "You could add an AI tool and keep everything else.",
  cost: "The deals would go to whoever changed the rest.",
};

const TURN = {
  heading: "Make your pricing, positioning and team",
  accent: "AI-native.",
  question: "Where are you starting from?",
};

const MODES: Record<Mode, {
  tab: string;
  tabSmall: string;
  lede: string;
  levers: Record<(typeof LEVERS)[number], { was: string; now: string }> | null;
  team: TeamCopy;
  proof: { result: string; quote: string; who: string; story: string };
}> = {
  established: {
    tab: "I run an established business",
    tabSmall: "Fixing a model that works",
    lede: "AI is changing what customers pay for, how they choose and who does the work. We rebuild your go-to-market around it, then test it with real buyers.",
    levers: null,
    team: {
      heading: "Your sales and marketing team gets agents.",
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
    },
    proof: {
      result: "A new sales path led to a paid test with a major US publisher.",
      quote: "We set up an AI-native go-to-market system that made us rethink who we hire and what they do.",
      who: "Chief Revenue Officer, data-infrastructure company",
      story: "market-moves",
    },
  },
  founder: {
    tab: "I'm building an AI-native business",
    tabSmall: "Starting from scratch",
    lede: "AI is changing what customers pay for, how they choose and who does the work. We help you build a go-to-market that starts AI-native, then test it with real buyers.",
    levers: {
      product: { now: "Build around the job AI can finish.", was: "Match the leader's feature list" },
      price: { now: "Charge for work done from the first customer.", was: "Borrow seat pricing from SaaS" },
      positioning: { now: "One clear job buyers and AI assistants can repeat.", was: "Another AI tool in a crowded list" },
      people: { now: "The founder plus agents until the model is proven.", was: "Hire sales, then marketing, then support" },
    },
    team: {
      heading: "Your first commercial team can be mostly agents.",
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
    },
    proof: {
      result: "Position and price rebuilt in 30 days. Two pilots signed during the work.",
      quote: "We had a brilliant product nobody could buy, because nobody could explain it. We're now clear on who we are in the new world.",
      who: "Founder, adtech firm",
      story: "simple-product",
    },
  },
};

const PLAN = [
  { when: "Week 1", what: "We map all four", detail: "What AI changes for your product, price, positioning and people.", days: [1, 7] as const },
  { when: "Weeks 2 to 4", what: "We build the move worth most", detail: "And test it with real buyers.", days: [8, 28] as const },
  { when: "Day 30", what: "You keep it", detail: "The model, the evidence and anything we built.", days: [29, 30] as const },
];

const MENU = [
  "Pricing model and buyer test",
  "Positioning and messaging",
  "AI-native org chart",
  "Working agents",
  "Product marketing launch kit",
  "AI market read",
];

export default function AiGtm() {
  const { briefOpen, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const rootRef = useRef<HTMLDivElement>(null);
  useLockedMotion(rootRef);

  const [mode, setMode] = useState<Mode>("established");
  const [picked, setPicked] = useState("lead");
  const [paused, setPaused] = useState(false);
  const toggleMotion = () => {
    const next = !paused;
    setPaused(next);
    const root = rootRef.current;
    if (!root) return;
    root.dataset.motionPaused = String(next);
    root.dispatchEvent(new Event("mm:motion"));
  };
  const copy = MODES[mode];
  const chooseMode = (next: Mode) => {
    setMode(next);
    setPicked("lead");
  };
  const mapped = copy.levers ? LEVERS.map((key) => ({ name: LEVER_NAMES[key], ...copy.levers![key] })) : null;

  return (
    <MindmakeShell onStart={() => openBrief("gtm")} siteClassName="mm-route-gtm" compactFooter>
      <SEO title="Build your AI GTM" description="Make your pricing, positioning and team AI-native, then test it with real buyers." canonical="/ai-gtm" />
      <div ref={rootRef} className="mm-gtm" data-mode={mode}>
        <Opening
          lead={OPENING.lead}
          accent={OPENING.accent}
          deck={OPENING.deck}
          rules={LEVERS.map((key) => ({ name: LEVER_NAMES[key], was: SHIFT[key].was }))}
          paused={paused}
          onToggleMotion={toggleMotion}
          film={(
            <figure className="gtm-film" aria-hidden="true" data-motion-scene="threshold">
              <video aria-hidden="true" data-motion-video="threshold" data-src={quietWorkshopFilm} poster={quietWorkshopPoster} preload="none" muted loop playsInline />
            </figure>
          )}
        />

        <LeverChapter
          heading="You can feel it in four places."
          steps={LEVER_STEPS}
          backdrop={(
            <figure className="gtm-film gtm-film-quiet" aria-hidden="true" data-motion-scene="signals">
              <video aria-hidden="true" data-motion-video="signals" data-src={signalsArriveFilm} poster={signalsArrivePoster} preload="none" muted loop playsInline />
            </figure>
          )}
        />

        <Workaround easy={WORKAROUND.easy} cost={WORKAROUND.cost} />

        <TurnBand
          heading={TURN.heading}
          accent={TURN.accent}
          question={TURN.question}
          promise={copy.lede}
          doors={(Object.keys(MODES) as Mode[]).map((key) => ({ mode: key, label: MODES[key].tab, small: MODES[key].tabSmall }))}
          mode={mode}
          onMode={chooseMode}
        />

        <PlanChapter
          heading="One go-to-market move in 30 days"
          steps={PLAN}
          mapped={mapped}
          menu={MENU}
          note="We agree which of these go into your 30 days, and the fee, before work starts."
        />

        <TeamChapter
          copy={copy.team}
          picked={picked}
          onPick={setPicked}
          decisionLabel="The decision you'll face"
          decisionNote="We work through decisions like this with you in week 1."
          instrumentLabel="Illustrative team"
        />

        <ProofBand heading="Result" quote={copy.proof.quote} result={copy.proof.result} who={copy.proof.who} story={copy.proof.story} />
      </div>
      <PairingBridge route="gtm" onStart={() => openBrief("gtm")} />
      <LeadBrief open={briefOpen} onClose={closeBrief} route="gtm" presentation="drawer" journeyKey={briefJourneyKey} initialContext={copy.tab} />
    </MindmakeShell>
  );
}
