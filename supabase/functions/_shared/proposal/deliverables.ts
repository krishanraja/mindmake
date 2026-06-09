/**
 * Per-mode deterministic scaffolds for the proposal generator.
 *
 * These are the deterministic 60% the LLM never rewrites: the canonical
 * deliverables list, the WHAT-YOU-KEEP artifacts, the GUARANTEE copy, the
 * PHASE-2 tracks, and the default NEXT-STEPS, per pricing/proof mode. Mindy
 * supplies the reflective prose (hero lead, what-i-heard, intros, card bodies);
 * these scaffolds supply the spine so the shell always renders, even with a
 * null dossier and no LLM output.
 *
 * Modes mirror the proof bank / pricing-range model:
 *   cohort, workshop, signal-session, revenue-architecture, immersion,
 *   bespoke-enablement, ctrl.
 *
 * Voice rules baked in (these strings are NOT re-linted at runtime, so they must
 * pass cleanly on sight): no em dashes, sentence case, British-Australian,
 * operator tone, second person. NO price appears here at all. Every price band
 * lives only in ProposalPayload.price, and only ever as a range or a label. Any
 * cost reference in copy is qualitative ("costed", "scoped together", "set on
 * the call"), never a figure.
 *
 * `bespoke-enablement` is the canonical full shape, lifted from the DoThinkDo
 * one-pager: a six-deliverable engagement with a pilot -> full -> phase-2 ladder.
 * `getModeScaffold()` falls back to it for any unknown mode.
 */

import type {
  Deliverable,
  Phase2Track,
  ValueCard,
} from './types.ts';

/** The deterministic spine for one mode. */
export interface ModeScaffold {
  /** Canonical mode key. */
  mode: string;
  /** Section label for THE ENGAGEMENT, e.g. "Phase 1 / The engagement". */
  engagementLabel: string;
  /** Default H2 for THE ENGAGEMENT (Mindy may override with a sharper line). */
  engagementHeading: string;
  /** The canonical numbered deliverables. */
  deliverables: Deliverable[];
  /** The WHAT-YOU-KEEP value cards (the artifacts that survive the engagement). */
  keepCards: ValueCard[];
  /** Default keep-hero line: what stays when the engagement ends. */
  keepHero: string;
  /** Default keep-foot line. */
  keepFoot: string;
  /** GUARANTEE: the inverted-panel kicker, the definition-of-done intro, the carry-the-risk body. */
  guarantee: { title: string; intro: string; body: string };
  /** PHASE-2 tracks (the "later, scoped together" panel). */
  phase2: { heading: string; intro: string; cap: string; tracks: Phase2Track[]; commercial: string };
  /** Default NEXT-STEPS list. */
  nextSteps: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// bespoke-enablement — the canonical full shape (DoThinkDo template).
// ─────────────────────────────────────────────────────────────────────────────
const BESPOKE_ENABLEMENT: ModeScaffold = {
  mode: 'bespoke-enablement',
  engagementLabel: 'Phase 1 / The engagement',
  engagementHeading: 'An enablement sprint, built into your real work.',
  deliverables: [
    {
      title: 'Discovery and net-new opportunity mapping',
      desc:
        'Per stream: the tasks eating the most time, and the things AI could do that the stream does not do today but that move a real business goal. New ways to package what you sell, faster paths from idea to client-ready, not busywork.',
    },
    {
      title: 'A working brain per stream',
      desc:
        'A context base behind every prompt the stream runs, so AI knows their world, their voice and their clients without being re-briefed each time. Owned by you, not rented from a platform.',
    },
    {
      title: 'Two to three live use cases per stream',
      desc:
        'Built in your own tools, with a one-page playbook each, coached until the owner runs them without me in the room.',
    },
    {
      title: 'A company AI usage policy',
      desc:
        'One agreed page on which tools you use, what is allowed, where the guardrails sit, and how people should work with AI. So adoption scales without becoming a free-for-all.',
    },
    {
      title: 'Systems-thinking coaching across the sprint',
      desc:
        'Recurring sessions with stream leads so the habit sticks and becomes muscle memory, plus how to keep improving the AI rather than delegating to it and walking away.',
    },
    {
      title: 'The AI roadmap',
      desc:
        'Everything learned pulled into one prioritised plan for where AI goes next, including a recommended shape for the build that follows.',
    },
  ],
  keepHero:
    "After the sprint, what stays when I leave: the working brains, the AI usage policy, the roadmap, a playbook for every use case, and teams that operate differently. That is the return, and it does not expire when the sprint ends.",
  keepCards: [
    {
      role: 'Marketing',
      title: 'Throughput',
      body:
        'AI drafts, repurposes and schedules the first 80% of content and campaigns, powered by the marketing brain.',
      worth: '<b>A content engine</b> that ships more every week, run by the same people.',
    },
    {
      role: 'Founder',
      title: 'Visibility',
      body:
        'A system that turns your thinking, client sessions and talks into published posts and talk material in minutes.',
      worth: '<b>A market presence that runs</b>, instead of one you keep meaning to start.',
    },
    {
      role: 'Leadership',
      title: 'Leverage',
      body:
        'Research, proposals and planning drafted and structured with AI. You own the roadmap and the policy.',
      worth: '<b>Your scarcest hours freed</b>, plus a roadmap you would otherwise commission.',
    },
  ],
  keepFoot:
    'The other streams follow the same logic: more out the door, and a brain that keeps doing it. And we go looking for what AI can do that your streams do not do today, pointed at the business goal, not at busywork.',
  guarantee: {
    title: 'The results guarantee',
    intro:
      'The sprint is done when every stream is live on its use cases, the brains are built, the policy is agreed, and the roadmap is delivered.',
    body:
      'I budget a fixed number of hours. <b>If I am not on track to land all of it inside the budget, I keep going at no extra cost.</b> The fee does not move. I carry the overrun, not you. The only thing I ask in return is that each stream shows up to its sessions and gives me the access to do the work.',
  },
  phase2: {
    heading: 'Phase 1 teaches the people. Phase 2 builds the systems.',
    intro:
      'Phase 1 gets your teams using AI on their own work. Phase 2 is the second sprint that builds the machines behind it, recommends and costs the stack to run them, and turns the roadmap into systems the business owns. The result is a lean company that runs like one several times its size.',
    cap:
      'Scoped together from the Phase 1 roadmap. These are the directions on the table now. Phase 1 will sharpen them, and surface more.',
    tracks: [
      {
        kicker: 'Track 01 / The internal brain',
        title: 'A central bot, running the company around the clock',
        desc:
          'A central operating brain, with agents that do the work your teams only touched in Phase 1, day and night.',
        chips: [
          { label: 'A 24/7 ops bot', key: true },
          { label: 'Live business intelligence' },
          { label: 'An outbound engine' },
          { label: 'A content and marketing engine' },
          { label: 'An always-on EA' },
        ],
      },
      {
        kicker: 'Track 02 / The stack, costed',
        title: 'The right tools, priced and sequenced to your budget',
        desc:
          'Clear recommendations on which tools to bring on, what each costs, and the order to do it in, plus the shared context layer that feeds every one of them.',
        chips: [
          { label: 'Tool recommendations, costed', key: true },
          { label: 'Sequenced to your budget' },
          { label: 'A shared context layer' },
          { label: 'Owned and documented' },
        ],
      },
      {
        kicker: 'Track 03 / The systems build',
        title: 'The roadmap, turned into permanent systems',
        desc:
          'The second sprint that turns the prioritised roadmap into the systems the business runs on, owned by you and documented.',
        chips: [
          { label: 'Systems the business owns', key: true },
          { label: 'Built on the Phase 1 foundation' },
          { label: 'Documented and handed over' },
          { label: 'Improvable without me' },
        ],
      },
    ],
    commercial:
      'This is the same kind of autonomous system I run across my own ventures: a fleet of agents handling research, outbound, content and ops while I make the calls. I am not theorising it, I live in it. We shape Phase 2 together when you are ready, off the roadmap and the data Phase 1 has already produced.',
  },
  nextSteps: [
    'A free 30-minute discovery with each team. No commitment.',
    'We pick the streams and a start date.',
    'I send the calendar and the access I need.',
    'First use case live by the end of week two.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// cohort — The AI-Fluent Executive (productised, leader buyer).
// ─────────────────────────────────────────────────────────────────────────────
const COHORT: ModeScaffold = {
  mode: 'cohort',
  engagementLabel: 'The engagement',
  engagementHeading: 'Four weeks to decide, then run AI yourself.',
  deliverables: [
    {
      title: 'The decision, named and decomposed',
      desc:
        'We take the one nervous AI decision you walked in with, name the real question underneath it, and lay out the honest paths with the trade-off on each. You leave able to decide, not still gathering opinions.',
    },
    {
      title: 'The frameworks, applied to your own work',
      desc:
        'The five-brick chain, redeploy-not-replace, find-the-brick, and the audit that scores where your hours actually go. Not taught as theory, run live against your function so you can use them again the week after.',
    },
    {
      title: 'One working automation you build yourself',
      desc:
        'By the end you have shipped one real thing in your own tools, with you driving and me coaching. The point is that you can do it again without me.',
    },
    {
      title: 'A written evaluation standard',
      desc:
        'A short, reusable way to judge the next AI tool or pitch that lands on your desk, so the team stops bringing every decision back to you.',
    },
  ],
  keepHero:
    'After four weeks, what stays: a decision made and in writing, the frameworks to make the next one, one automation you built, and the confidence to run AI yourself instead of waiting to feel ready.',
  keepCards: [
    {
      role: 'The decision',
      title: 'Clarity',
      body:
        'The fork you came in stuck on, resolved, with the trade-off on each path named and the recommended next move written down.',
      worth: '<b>A decision you can act on Monday</b>, not a folder of notes.',
    },
    {
      role: 'The method',
      title: 'Repeatability',
      body:
        'The same frameworks that cracked this decision, now yours to run against the next one without me in the room.',
      worth: '<b>A filter for every AI call after this one</b>, owned by you.',
    },
    {
      role: 'The build',
      title: 'Proof',
      body:
        'One working automation in your own tools, shipped by you, so the capability is demonstrated rather than promised.',
      worth: '<b>Evidence you can build</b>, not just brief someone who can.',
    },
  ],
  keepFoot:
    'You leave able to make the AI decisions in front of you and the ones coming next, without paying for the learning curve twice.',
  guarantee: {
    title: 'The decision guarantee',
    intro:
      'The cohort is done when your decision is made and in writing, the frameworks are yours, and you have shipped one working thing.',
    body:
      "If you finish the four weeks and you still cannot name your decision and the path you are taking, <b>I will keep working with you until you can.</b> The point of the room is a decision, not a certificate.",
  },
  phase2: {
    heading: 'The cohort sharpens the operator. The build comes next.',
    intro:
      'The cohort gets you deciding and building for yourself. What comes after, when the decision points at something bigger, is a scoped build or a company-level engagement, shaped off what you learned here.',
    cap: 'Optional, and only if a real build shows up. Nothing here is part of the cohort fee.',
    tracks: [
      {
        kicker: 'Track 01 / Take it to the team',
        title: 'The same method, run across your function',
        desc:
          'An immersion that gets your leadership team to the same agreed view you reached, so the decisions stop restarting every Monday.',
        chips: [
          { label: 'Shared vocabulary', key: true },
          { label: 'Agreed use boundaries' },
          { label: 'Owners assigned' },
        ],
      },
      {
        kicker: 'Track 02 / Build the real thing',
        title: 'A scoped build, when the decision points at one',
        desc:
          'When the decision you made needs something built rather than taught, a bespoke enablement sprint embeds it into the real work and leaves the systems with you.',
        chips: [
          { label: 'Built in your tools', key: true },
          { label: 'A working brain' },
          { label: 'Coached until you own it' },
        ],
      },
    ],
    commercial:
      'No pressure to climb. Most people leave the cohort able to do the next thing themselves, and I would rather you did. The build is there only if the decision you made genuinely needs one.',
  },
  nextSteps: [
    'Enrol on the next cohort via Maven.',
    'Bring the one decision keeping you up at night.',
    'We decide it together in week one, then build.',
    'You leave able to make the next one without me.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// workshop — one-day, one working thing (feeder rung).
// ─────────────────────────────────────────────────────────────────────────────
const WORKSHOP: ModeScaffold = {
  mode: 'workshop',
  engagementLabel: 'The session',
  engagementHeading: 'One day. One working thing you keep.',
  deliverables: [
    {
      title: 'One real AI tool, built live',
      desc:
        'We pick the single thing that would help you most and build it together in your own tools, in the room, in one day. You drive, I coach.',
    },
    {
      title: 'A one-page playbook for it',
      desc:
        'How to run it, how to improve it, and how to know it is trustworthy, on a page you keep.',
    },
    {
      title: 'A way to judge the next one',
      desc:
        'A short, repeatable test for whether the next AI idea is worth your time, so you stop guessing.',
    },
  ],
  keepHero:
    'After one day, what stays: one working tool used the next morning, a one-page playbook for it, and a way to judge the next idea. No decks, no oversell.',
  keepCards: [
    {
      role: 'The tool',
      title: 'Something that works',
      body:
        'A single AI tool built for your real work, in your own stack, that you use the day after the session.',
      worth: '<b>One thing that works</b>, not a strategy you have to go implement.',
    },
    {
      role: 'The playbook',
      title: 'A way to run it',
      body:
        'The one page that tells you how to run the tool, improve it, and trust its output.',
      worth: '<b>Repeatable without me</b>, from day one.',
    },
    {
      role: 'The filter',
      title: 'A way to choose',
      body:
        'A short test for the next AI idea, so the second tool is your call, made well.',
      worth: '<b>Better choices after this one</b>, owned by you.',
    },
  ],
  keepFoot:
    'A workshop is the cheap way to find out whether the approach works for you before you commit to more. Whatever you pay rolls forward if you climb.',
  guarantee: {
    title: 'The working-tool guarantee',
    intro: 'The day is done when you have one working tool and the playbook to run it.',
    body:
      'You walk out with one thing that works, or you do not pay. <b>I would rather you left with a tool than a feeling.</b>',
  },
  phase2: {
    heading: 'The workshop proves it. The cohort compounds it.',
    intro:
      'The workshop gets you one working tool. If the approach lands, the AI-Fluent Executive cohort takes you from one tool to running AI across your work, and your workshop fee credits toward it.',
    cap: 'Optional. The workshop stands on its own.',
    tracks: [
      {
        kicker: 'Track 01 / Go deeper',
        title: 'From one tool to running AI yourself',
        desc:
          'The cohort applies the same frameworks across your function over four weeks, with your workshop credit applied.',
        chips: [
          { label: 'Workshop credit applied', key: true },
          { label: 'Four weeks' },
          { label: 'A decision in writing' },
        ],
      },
    ],
    commercial:
      'No push. The workshop is designed to stand alone. The credit is there only if you decide the deeper room is worth it.',
  },
  nextSteps: [
    'Book the next workshop via Maven.',
    'Bring the one task you want AI to take off your plate.',
    'Leave with it working, and a playbook to run it.',
    'Climb to the cohort with your credit if it lands.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// signal-session — one day, one company-level go/no-go decision.
// ─────────────────────────────────────────────────────────────────────────────
const SIGNAL_SESSION: ModeScaffold = {
  mode: 'signal-session',
  engagementLabel: 'The session',
  engagementHeading: 'One day. One decision. No more Monday debates.',
  deliverables: [
    {
      title: 'The real question, isolated',
      desc:
        'We strip the company-level AI question down to the actual fork: build or partner, ship or kill, price it this way or that. The thing two quarters of meetings have been circling.',
    },
    {
      title: 'The honest paths, each costed in time and risk',
      desc:
        'Two or three real options with the trade-off named on each, including the cost of doing nothing. No deck, the working in the open.',
    },
    {
      title: 'A clear go or no-go, in writing',
      desc:
        'A defensible decision you can take to the board or the team the same week, with the reasoning attached.',
    },
    {
      title: 'A reusable way to make the next one',
      desc:
        'The scoring method we used, written down, so the next company-level AI call does not need another two quarters.',
    },
  ],
  keepHero:
    'After one day, what stays: a clear decision in writing, the reasoning behind it, and the scoring method to make the next one. The internal stalemate, broken.',
  keepCards: [
    {
      role: 'The decision',
      title: 'A straight answer',
      body:
        'The go or no-go your team has been circling, made and documented, with the trade-off on each path named.',
      worth: '<b>A decision the board can stand behind</b>, the same week.',
    },
    {
      role: 'The time',
      title: 'A year not wasted',
      body:
        'Engineering and exec time no longer spent debating the wrong thing or building down the wrong path.',
      worth: '<b>The expensive months you do not spend</b>, recovered.',
    },
    {
      role: 'The method',
      title: 'A repeatable score',
      body:
        'The way we ranked the options, written down and yours to reuse on the next company-level call.',
      worth: '<b>A scoring method you keep</b>, not a one-off opinion.',
    },
  ],
  keepFoot:
    'One day, one decision. It is also the diagnostic gate for a bigger engagement, if the decision turns out to need a build behind it.',
  guarantee: {
    title: 'The decision guarantee',
    intro:
      'The session is done when you have a clear go or no-go in writing, with the reasoning and the trade-offs attached.',
    body:
      'If you leave the day without a decision you can defend, <b>the session has not done its job, and I will say so before you pay for anything more.</b> The whole point is one decision, not another round of debate.',
  },
  phase2: {
    heading: 'The session decides it. The architecture builds it.',
    intro:
      'The session resolves the question. If the answer is to build, the Revenue Architecture turns the decision into the commercial engine that runs it, scoped together off the day.',
    cap: 'Only if the decision points at a build. The session stands on its own.',
    tracks: [
      {
        kicker: 'Track 01 / Build the commercial layer',
        title: 'The decision, turned into a revenue engine',
        desc:
          'When the go decision needs positioning, pricing and a sales motion built behind it, the Revenue Architecture sprint builds it, scoped off the session.',
        chips: [
          { label: 'Positioning and pricing', key: true },
          { label: 'A sales motion the team runs' },
          { label: 'Scoped off the session' },
        ],
      },
    ],
    commercial:
      'The session credits toward the architecture if you go that way. If the decision was no-go, the session has already paid for itself in the year you do not waste.',
  },
  nextSteps: [
    'Book the free 15-minute call to confirm fit.',
    'We set the date and the question to be decided.',
    'One day in the room, one decision out.',
    'You take the go or no-go to the board the same week.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// revenue-architecture — full commercial rebuild (enterprise / capital).
// ─────────────────────────────────────────────────────────────────────────────
const REVENUE_ARCHITECTURE: ModeScaffold = {
  mode: 'revenue-architecture',
  engagementLabel: 'Phase 1 / The engagement',
  engagementHeading: 'A shipped AI capability, made sellable.',
  deliverables: [
    {
      title: 'Positioning that a buyer understands',
      desc:
        'The capability you built, reframed from a technical feature into something a buyer can grasp, want, and pay for. The story your sales team can actually tell.',
    },
    {
      title: 'Pricing set against value, not guessed',
      desc:
        'A pricing model built off the value at stake for the buyer, not a number you picked because it felt right. Bands, anchors, and the logic behind them.',
    },
    {
      title: 'A go-to-market motion the team runs',
      desc:
        'A single, repeatable sales motion the team executes without you in the room, so the win rate stops reflecting who happened to pitch it.',
    },
    {
      title: 'The first pilots signed inside the window',
      desc:
        'Not a strategy deck. We aim to land the first one or two deals during the sprint, so the engine is proven before I leave.',
    },
    {
      title: 'A playbook the business owns',
      desc:
        'The whole motion written down: positioning, pricing, the pitch, the objection handling, so it runs without the founder present.',
    },
  ],
  keepHero:
    'After the sprint, what stays: positioning a buyer understands, pricing set against value, a sales motion the team runs without you, the first pilots signed, and a playbook the business owns. A product nobody could buy, turned into one they can.',
  keepCards: [
    {
      role: 'Commercial',
      title: 'A sellable product',
      body:
        'The capability repositioned and priced so the sales team stops treating it as a footnote and starts attaching it to deals.',
      worth: '<b>Revenue that books</b>, not a feature buried in the base plan.',
    },
    {
      role: 'Sales',
      title: 'A motion that runs',
      body:
        'One go-to-market motion the team executes consistently, with the win rate to match, no founder required.',
      worth: '<b>A team that stops winging it</b>, on a playbook they own.',
    },
    {
      role: 'Leadership',
      title: 'A line you can explain',
      body:
        'A clear story for the product you can take to the board, the buyer, or the next round, in language they understand.',
      worth: '<b>A product you can finally explain</b>, including to yourself.',
    },
  ],
  keepFoot:
    'You leave with a revenue line that did not exist before the sprint, and a playbook the sales team runs without me or you in the room.',
  guarantee: {
    title: 'The results guarantee',
    intro:
      'The sprint is done when the positioning is set, the pricing is live, the motion is documented, and we have gone after the first deals.',
    body:
      'I price against the value of the decision, not my hours, and I carry the scoping risk. <b>The motion is built to run without me, or it has not landed.</b> A playbook only I can run is a failure, not a deliverable.',
  },
  phase2: {
    heading: 'Phase 1 builds the engine. Phase 2 scales it.',
    intro:
      'Phase 1 makes one capability sellable and proves the motion. Phase 2 templates it across the rest of the portfolio or the product line, and builds the systems that run the motion at scale.',
    cap: 'Scoped together off the Phase 1 playbook. For funds, the template carries across portfolio companies.',
    tracks: [
      {
        kicker: 'Track 01 / Template it across the portfolio',
        title: 'One motion, reused across companies',
        desc:
          'For funds and groups, the engine built in one company, turned into a template the others run, with a fund-level shape.',
        chips: [
          { label: 'A reusable template', key: true },
          { label: 'Run across portcos' },
          { label: 'Fund-level scope' },
        ],
      },
      {
        kicker: 'Track 02 / Build the systems behind it',
        title: 'The motion, run by systems',
        desc:
          'The outbound, the content, and the commercial intelligence behind the motion, built as systems the business owns and improves.',
        chips: [
          { label: 'An outbound engine', key: true },
          { label: 'Commercial intelligence' },
          { label: 'Owned and documented' },
        ],
      },
    ],
    commercial:
      'This is the kind of commercial engine I run across my own ventures: positioning, pricing and an outbound fleet that books while I make the calls. We shape Phase 2 off what Phase 1 already proved, not off a guess.',
  },
  nextSteps: [
    'Book the call to scope the engagement.',
    'We confirm the capability and the value at stake.',
    'A 30-day sprint to positioning, pricing, and the first pilots.',
    'You keep a motion the team runs without us.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// immersion — team alignment, 4-8 senior leaders, CEO sponsor.
// ─────────────────────────────────────────────────────────────────────────────
const IMMERSION: ModeScaffold = {
  mode: 'immersion',
  engagementLabel: 'The session',
  engagementHeading: 'Your leadership team, to one agreed view.',
  deliverables: [
    {
      title: 'Every private view, surfaced',
      desc:
        'Each leader has a quiet opinion on AI and none have said it out loud. We get them on the table, so the disagreement is visible and can finally be resolved.',
    },
    {
      title: 'Agreed use boundaries, on the record',
      desc:
        'Where AI is acceptable in your work and where it is not, decided together, so the contentious calls are ruled in or out with the whole team behind them.',
    },
    {
      title: 'A short list of prioritised use cases',
      desc:
        'Three use cases with owners assigned and the rest parked with a reason, so the roadmap argument stops restarting.',
    },
    {
      title: 'Written principles the team signs',
      desc:
        'A page of AI principles the leaders actually agree to, and a consistent answer when a client or the board asks where the firm stands.',
    },
  ],
  keepHero:
    'After the immersion, what stays: written principles the team signed, agreed use boundaries, three prioritised use cases with owners, and a shared vocabulary that survives the next planning cycle.',
  keepCards: [
    {
      role: 'The team',
      title: 'Alignment',
      body:
        'Eight private views turned into one agreed position, with the contentious calls resolved on the record rather than left to fester.',
      worth: '<b>A leadership team that agrees</b>, and can say so out loud.',
    },
    {
      role: 'The work',
      title: 'A short list',
      body:
        'Three prioritised use cases with named owners, and the rest parked with a reason, so planning stops going in circles.',
      worth: '<b>Owners and a reason</b>, instead of a circular roadmap.',
    },
    {
      role: 'The firm',
      title: 'A position',
      body:
        'Written principles the leaders signed, and a consistent answer when clients ask what the firm thinks about AI.',
      worth: '<b>A position you can stand behind</b>, signed.',
    },
  ],
  keepFoot:
    'Getting a leadership team to agree on anything is hard. You leave with signed principles, owned use cases, and a vocabulary that outlasts the room.',
  guarantee: {
    title: 'The alignment guarantee',
    intro:
      'The immersion is done when the principles are signed, the boundaries are agreed, and three use cases have owners.',
    body:
      'If the team leaves without an agreed position, <b>the day has not done its job, and I will tell you so.</b> The point is alignment the team will stand behind, not a workshop everyone forgets by Friday.',
  },
  phase2: {
    heading: 'The immersion aligns the team. The build follows.',
    intro:
      'The immersion gets your leaders to one view and three owned use cases. What follows, if you want it, is building those use cases into the real work, scoped off the day.',
    cap: 'Optional, and only for the use cases the team chose to own.',
    tracks: [
      {
        kicker: 'Track 01 / Build the agreed use cases',
        title: 'The three you chose, made real',
        desc:
          'A bespoke enablement sprint that takes the prioritised use cases and embeds them into the teams that own them.',
        chips: [
          { label: 'Built in your tools', key: true },
          { label: 'Owned by the named leads' },
          { label: 'Coached until it sticks' },
        ],
      },
    ],
    commercial:
      'No pressure to build. The alignment is the deliverable. The build is there only for the use cases the team genuinely committed to.',
  },
  nextSteps: [
    'Book the call with "immersion" preselected.',
    'We confirm the leaders in the room and the questions to settle.',
    'A session that ends in signed principles and owned use cases.',
    'Build the chosen use cases next, if the team wants to.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// ctrl — the product. Free -> Diagnostic -> Edge Pro. Tooling, not an engagement.
// ─────────────────────────────────────────────────────────────────────────────
const CTRL: ModeScaffold = {
  mode: 'ctrl',
  engagementLabel: 'The product',
  engagementHeading: 'AI that knows your business, and stops forgetting.',
  deliverables: [
    {
      title: 'A portable context layer',
      desc:
        'Your world, your priorities and your voice held in one place and carried into every AI tool you use, so you stop retyping your background into a chatbot every session.',
    },
    {
      title: 'Mornings anchored to your real priorities',
      desc:
        'A daily read that starts from what actually matters to you, not a blank prompt, so the day opens on signal rather than setup.',
    },
    {
      title: 'Consistent output, regardless of the week',
      desc:
        'Repeatable context per client or project, so the quality of your AI-assisted work stops swinging on how much you remembered to feed it.',
    },
  ],
  keepHero:
    'CTRL is yours to keep using: a context layer that travels with you across every AI tool, mornings anchored to your priorities, and consistent output whether the week is calm or chaos.',
  keepCards: [
    {
      role: 'Every tool',
      title: 'Portable context',
      body:
        'Your context on file and carried into every AI tool, so each one knows your world without being re-briefed.',
      worth: '<b>No more retyping your life</b> into a chatbot every morning.',
    },
    {
      role: 'Every morning',
      title: 'A real starting point',
      body:
        'A daily anchor to your actual priorities, so AI opens on what matters rather than a cold blank prompt.',
      worth: '<b>Mornings on signal</b>, not setup.',
    },
    {
      role: 'Every engagement',
      title: 'Consistency',
      body:
        'Repeatable per-client context, so your AI-assisted work is the same quality however busy you are.',
      worth: '<b>Consistent thinking</b>, not whatever you typed that day.',
    },
  ],
  keepFoot:
    'CTRL is the tool, not an engagement. Start free, and upgrade only when the context layer is already earning its place.',
  guarantee: {
    title: 'The free door',
    intro: 'CTRL starts free. You see the value before you pay anything.',
    body:
      'Start on the free tier and use it. <b>Upgrade only when the context layer has already proven it gives you the time back.</b> There is no engagement to commit to, and no call to sit through first.',
  },
  phase2: {
    heading: 'The tool gives you time back. The systems compound it.',
    intro:
      'CTRL holds your context and gives you the time back. If you decide you want a faster business rather than just faster outputs, that is a build, and a different conversation.',
    cap: 'Only if you want to go from a tool to a system. CTRL stands on its own.',
    tracks: [
      {
        kicker: 'Track 01 / From tool to system',
        title: 'When faster outputs are not enough',
        desc:
          'If the time CTRL gives back gets reinvested into systems and loops, a bespoke enablement sprint builds the engine behind it.',
        chips: [
          { label: 'A faster business', key: true },
          { label: 'Systems you own' },
          { label: 'Only if you will reinvest' },
        ],
      },
    ],
    commercial:
      'Not everyone needs a fleet, and I will say so even though I sell it. If you just want faster outputs, CTRL is the whole answer. Build only when you will reinvest the time.',
  },
  nextSteps: [
    'Start free at ctrl.themindmaker.ai.',
    'Load your context once.',
    'Use it across every AI tool you already run.',
    'Upgrade only when it has earned its place.',
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Registry + selector.
// ─────────────────────────────────────────────────────────────────────────────

/** All canonical mode scaffolds, keyed by mode. */
export const MODE_SCAFFOLDS: Record<string, ModeScaffold> = {
  'bespoke-enablement': BESPOKE_ENABLEMENT,
  cohort: COHORT,
  workshop: WORKSHOP,
  'signal-session': SIGNAL_SESSION,
  'revenue-architecture': REVENUE_ARCHITECTURE,
  immersion: IMMERSION,
  ctrl: CTRL,
};

/**
 * Normalise a loosely-formatted mode key to a canonical scaffold key.
 * Lower-cases, trims, and maps common aliases / spacing variants onto the seven
 * canonical modes. Returns undefined for anything unrecognised so the caller can
 * fall back deterministically.
 */
function canonicalMode(mode: string): string | undefined {
  const m = (mode || '').toLowerCase().trim().replace(/[\s_]+/g, '-');
  if (MODE_SCAFFOLDS[m]) return m;
  const ALIASES: Record<string, string> = {
    'signal': 'signal-session',
    'signalsession': 'signal-session',
    'revenue': 'revenue-architecture',
    'revenue-arch': 'revenue-architecture',
    'architecture': 'revenue-architecture',
    'bespoke': 'bespoke-enablement',
    'enablement': 'bespoke-enablement',
    'rebuild': 'bespoke-enablement',
    'cohort-ai-fluent-executive': 'cohort',
    'ai-fluent-executive': 'cohort',
    'workshops': 'workshop',
    'immersions': 'immersion',
    'ctrl-free': 'ctrl',
  };
  return ALIASES[m];
}

/**
 * Return the deterministic scaffold for a mode. Unknown or empty modes fall back
 * to `bespoke-enablement`, the canonical full shape, so the shell always renders.
 */
export function getModeScaffold(mode: string): ModeScaffold {
  const key = canonicalMode(mode);
  return (key && MODE_SCAFFOLDS[key]) || BESPOKE_ENABLEMENT;
}
