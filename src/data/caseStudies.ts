/**
 * Case studies & client proof, centralized.
 *
 * Sourced from the Operator-Advisor portfolio and client feedback, then
 * ANONYMIZED per direction: no real client names or company names appear
 * anywhere. Each item is attributed by role + sector only (e.g.
 * "CRO, identity-data infrastructure"). The named originals are kept
 * offline; flip a specific quote to named only with that client's sign-off.
 *
 * Consumed by:
 *  - src/pages/CaseStudies.tsx  (the filterable /case-studies page)
 *  - src/components/TrustSection.tsx  (homepage teaser carousel)
 */

export type Engagement = "Cohort" | "Signal Session" | "Revenue Architecture";

export type CaseTheme = "Reposition" | "Rebuild" | "Decide";

export interface CaseMetric {
  value: string;
  label: string;
}

export interface CaseStudy {
  id: string;
  /** Filter dimension: which offer this maps to. */
  engagement: Engagement;
  theme?: CaseTheme;
  /** Anonymized attribution shown in the card footer. */
  clientLabel: string;
  /** Short eyebrow label for the card. */
  sector: string;
  /** "case" = rich Situation -> Call -> Work card; "quote" = short quote card. */
  variant: "case" | "quote";
  headline: string;
  metrics: CaseMetric[];
  situation?: string;
  theCall?: string;
  theWork?: string;
  /** Anonymized client quote. */
  quote?: { text: string; attribution: string };
}

/**
 * Per-engagement metadata for the contextual offer strip + filter pills.
 * Ties proof straight to the purchasable offer.
 */
export const ENGAGEMENT_META: Record<
  Engagement,
  { label: string; price: string; blurb: string; href: string; cta: string }
> = {
  "Signal Session": {
    label: "The Signal Session",
    price: "$15,000",
    blurb: "One nervous AI decision, resolved fast.",
    href: "/enterprise#signal-session",
    cta: "Book a Signal Session",
  },
  "Revenue Architecture": {
    label: "The Revenue Architecture",
    price: "$60–100k",
    blurb: "Rebuild how the business makes money with AI.",
    href: "/enterprise#revenue-architecture",
    cta: "Scope a Revenue Architecture",
  },
  Cohort: {
    label: "The AI-Fluent Executive",
    price: "$2,500",
    blurb: "Get clear alongside 15 other senior leaders. Four weeks.",
    href: "/cohort",
    cta: "See the cohort",
  },
};

/** Display order matters: rich cases first (best teaser), quote cards after. */
export const caseStudies: CaseStudy[] = [
  // ---- Rich cases ----
  {
    id: "identity-infra-reposition",
    engagement: "Revenue Architecture",
    theme: "Reposition",
    clientLabel: "CRO · Identity & data infrastructure",
    sector: "Identity & data infrastructure",
    variant: "case",
    headline: "Repositioned a collapsing category from defence to offence",
    metrics: [
      { value: "$254K", label: "POC contracted" },
      { value: "4", label: "major publishers back in pipeline" },
      { value: "43", label: "outbound campaigns, three regions" },
    ],
    situation:
      "Patented identity tech and a strong APAC pipeline — but the category was collapsing. Buyers in the US and EMEA had stopped paying for cookie-replacement tools and started asking what comes next for the open web.",
    theCall:
      "Reposition the entire commercial surface. Move the lens from third-party-cookie defence to first-party publisher infrastructure for an AI-mediated internet — new pitch, personas, partner story and price point.",
    theWork:
      "A new ICP, messaging and sales-enablement workflows, with a central AI brain feeding every seller. 43 outbound campaigns across the US, EMEA and APAC against four distinct personas, a publisher POC scoped around addressability and conversion measurement, and a new thought-leadership cadence on agentic browsing. The work of at least ten people, done by two.",
    quote: {
      text: "Krish set up an AI-native GTM system that makes us think differently about who we need to hire and what they'll be doing. He works experimentally yet transparently. We trusted he would deliver.",
      attribution: "CRO, identity-data infrastructure",
    },
  },
  {
    id: "us-publisher-roadmap",
    engagement: "Signal Session",
    theme: "Decide",
    clientLabel: "Head of Operations · Top-10 US digital publisher",
    sector: "Digital publishing",
    variant: "case",
    headline: "14 AI vendors, one board mandate, three decisions",
    metrics: [
      { value: "40%", label: "faster production ops" },
      { value: "75%", label: "less campaign setup time" },
      { value: "22%", label: "revenue lift on affected inventory" },
    ],
    situation:
      "An SVP-level operator with a board mandate to deliver an AI roadmap by quarter-end. 14 AI vendors on the calendar, every internal team running a different tool, and no defensible position to take to the board.",
    theCall:
      "Stop the vendor cycle. Build the roadmap inside-out from the actual editorial and ad-operations P&L, not the vendor decks. Kill, build, or pause every option on the table with a written rationale.",
    theWork:
      "A three-decision board memo: one vendor killed, one workflow built internally, one paused with a re-evaluation date. The AI editorial-ops pipeline shipped by their own team in 45 days, with zero new headcount.",
    quote: {
      text: "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. Cheers to Krish for leading and landing.",
      attribution: "Head of Operations, top-10 US digital publisher",
    },
  },
  {
    id: "broadcast-operating-agreement",
    engagement: "Cohort",
    theme: "Reposition",
    clientLabel: "President · Legacy broadcast business",
    sector: "Broadcast media",
    variant: "case",
    headline: "From 14 tools and a threatened budget to a one-page operating agreement",
    metrics: [
      { value: "11 killed", label: "of 14 AI tools" },
      { value: "90 days", label: "to first production workflow" },
      { value: "Budget", label: "defended at next review" },
    ],
    situation:
      "A Head of Strategy asked to figure out AI on top of an existing role. Team of four, a $250K budget, no mandate, no operating model. Every team using a different tool, and the CFO threatening to pull the budget.",
    theCall:
      "Skip the strategy deck. Write a one-page operating agreement instead. Tie every approved tool to a P&L line, put AI decisions on the executive agenda, and stand up a product-strategy incubator inside the business.",
    theWork:
      "A one-page AI operating agreement. Three approved tools, eleven killed. A monthly executive AI cadence installed. The first cross-functional AI project shipped on time and defensible to finance.",
    quote: {
      text: "It's been a good journey to bring Krish problems that match our business goals and leadership needs, and watch them come together in a very thoughtful program.",
      attribution: "President, legacy broadcast business",
    },
  },
  {
    id: "coaching-practice-rebuild",
    engagement: "Revenue Architecture",
    theme: "Rebuild",
    clientLabel: "Founder & CEO · Executive coaching practice",
    sector: "Coaching & advisory",
    variant: "case",
    headline: "A full commercial stack rebuilt in eight weeks",
    metrics: [
      { value: "8 weeks", label: "to rebuild the stack" },
      { value: "5 videos", label: "shipped in week one" },
      { value: "$2K–$8K", label: "productized offer ladder" },
    ],
    situation:
      "A senior operator running a coaching and corporate-consulting practice on the side. Outdated website, no CRM, no content cadence — inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.",
    theCall:
      "AI is the forcing function. Rebuild the entire commercial stack in eight weeks — brand, site, productized offers, lead capture, content engine and outbound — on a reusable writing OS so context never has to be re-explained.",
    theWork:
      "A new brand and production-ready site concepts shipped one prompt each. A productized coaching ladder ($2K–$8K) and a corporate workshop, lead capture, an L&D outbound system, and reusable projects for voice, video scripts and outreach.",
    quote: {
      text: "The reason I'm loving Krish's sprints is the unique approach — he uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need.",
      attribution: "Founder & CEO, executive coaching practice",
    },
  },
  {
    id: "content-engine-founder-owned",
    engagement: "Revenue Architecture",
    theme: "Rebuild",
    clientLabel: "Founder · Research & content brand",
    sector: "Research & content",
    variant: "case",
    headline: "A founder-owned content engine for about $20 a month",
    metrics: [
      { value: "~$20/mo", label: "total AI stack cost" },
      { value: "<1 hr", label: "per research-backed post (was days)" },
      { value: "Owned", label: "end-to-end by the founder" },
    ],
    situation:
      "A founder pivoting to a research-led content brand. Privacy-conscious, energy-managed, and no appetite for autonomy until the human-in-the-loop system was proven. They needed a content engine that compounds without burning them out.",
    theCall:
      "Build a low-cost, voice-first content engine the founder owns. Manual first, automated only after the system worked end-to-end — phased so the founder kept enjoying it.",
    theWork:
      "A three-phase roadmap: a voice-to-research engine producing research-backed posts in under 45 minutes, then seeding and outreach, then a publishing pipeline, evidence library and SEO flywheel.",
    quote: {
      text: "Since working with Krish I've learnt to push through basic barriers I didn't realise I could — and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days. It's helping me be seen by my customers.",
      attribution: "Founder, research & content brand",
    },
  },
  {
    id: "tmt-advisory-productized",
    engagement: "Revenue Architecture",
    theme: "Rebuild",
    clientLabel: "Managing Partner · Global TMT advisory & ventures",
    sector: "Advisory & ventures",
    variant: "case",
    headline: "Turned a speaking brand into AI products clients can buy",
    metrics: [
      { value: "Fund One", label: "launched under the ventures arm" },
      { value: "2 offers", label: "productized advisory + ventures" },
      { value: "1st product", label: "AI podcasts launched" },
    ],
    situation:
      "A global TMT advisory with deep boardroom relationships and a sharp newsletter brand — but the commercial surface was speaking, not selling. No productized AI offer for clients, and no formal investment thesis to deploy alongside its venture bets.",
    theCall:
      "Turn the firm's expertise into AI products clients can buy. Codify Strategic Product Development as the core advisory wedge and, in parallel, write the ventures thesis: who the firm backs, why, and at what stage.",
    theWork:
      "AI-powered CX transformation packaged as a sellable engagement, not a keynote. A productized advisory ladder, a ventures thesis stood up and focused on CTO-led founders, and the newsletter rewired as distribution for both.",
  },
  {
    id: "series-b-build-vs-buy",
    engagement: "Signal Session",
    theme: "Decide",
    clientLabel: "Founder · Series B adtech",
    sector: "Build vs buy",
    variant: "case",
    headline: "Proof the build was the wrong decision",
    metrics: [
      { value: "5 months", label: "of engineering saved" },
      { value: "v1", label: "with 3 paying design partners" },
    ],
    situation:
      "Six months into a custom AI build, with investors asking hard questions. They wanted to build an assistant that knew their business.",
    theCall:
      "Pressure-test the build before another quarter of engineering. Decide build versus buy on the evidence, not the ambition.",
    theWork:
      "Proof the build was the wrong decision, a scope change, and a repositioning around a smaller use case customers were already paying for. v1 shipped with three paying design partners in 60 days.",
  },

  // ---- Quote-only cards ----
  {
    id: "q-board-questions",
    engagement: "Cohort",
    clientLabel: "GTM Leader · Series C SaaS",
    sector: "Board confidence",
    variant: "quote",
    headline: "I stopped dreading board AI questions.",
    metrics: [{ value: "0", label: "board AI questions I now dread" }],
    quote: {
      text: "Before the session I was fielding questions about our AI strategy and honestly making it up as I went. Krish helped me get clear on the three decisions that actually mattered. Now when the board asks, I have real answers.",
      attribution: "GTM Leader, Series C SaaS",
    },
  },
  {
    id: "q-14-to-3",
    engagement: "Cohort",
    clientLabel: "VP of Operations",
    sector: "Tool sprawl",
    variant: "quote",
    headline: "We went from 14 tools to 3 systems that actually work.",
    metrics: [{ value: "14 → 3", label: "AI tools that actually work" }],
    quote: {
      text: "Everyone on the team was experimenting with AI — ChatGPT for this, Claude for that, some random automation tool from LinkedIn. It was chaos. The cohort forced us to decide what's actually strategic and what's just noise.",
      attribution: "VP of Operations",
    },
  },
  {
    id: "q-build-vs-buy",
    engagement: "Signal Session",
    clientLabel: "Founder · Early-stage FinTech",
    sector: "Build vs buy",
    variant: "quote",
    headline: "I finally knew what to build versus buy.",
    metrics: [{ value: "6mo", label: "of going in circles, resolved" }],
    quote: {
      text: "I'd been going in circles for six months. Do we build our own AI underwriting model or use a vendor API? Krish didn't hand me a recommendation. He gave me the framework to decide for myself.",
      attribution: "Founder, early-stage FinTech",
    },
  },
  {
    id: "q-board-confidence",
    engagement: "Signal Session",
    clientLabel: "CEO · Mid-market services",
    sector: "Board confidence",
    variant: "quote",
    headline: "For the first time I wasn't guessing in a board conversation on AI.",
    metrics: [{ value: "✓", label: "board confidence, first time" }],
    quote: {
      text: "I went into a board conversation on AI the week after our session and for the first time I wasn't guessing. I had the questions, I knew what to push on, and I didn't get cornered.",
      attribution: "CEO, mid-market services",
    },
  },
  {
    id: "q-vendor-kill",
    engagement: "Signal Session",
    clientLabel: "COO · B2B technology",
    sector: "Vendor decisions",
    variant: "quote",
    headline: "We killed a vendor proposal in ten minutes.",
    metrics: [{ value: "10 min", label: "to kill a bad vendor proposal" }],
    quote: {
      text: "I expected another AI discussion. It wasn't. We killed a vendor proposal in about ten minutes because the assumptions didn't hold up. I forwarded the notes straight to my team and we moved on.",
      attribution: "COO, B2B technology",
    },
  },
  {
    id: "q-two-workflows",
    engagement: "Cohort",
    clientLabel: "Head of Ops · Scale-up",
    sector: "Execution",
    variant: "quote",
    headline: "I built two workflows that I now use every day.",
    metrics: [{ value: "2", label: "workflows I now use every single day" }],
    quote: {
      text: "I actually built two workflows in the session that I now use every day. Not experiments — real systems that made my week calmer almost immediately.",
      attribution: "Head of Ops, scale-up",
    },
  },
];

export interface Endorsement {
  quote: string;
  /** Anonymized: role + sector only. */
  attribution: string;
}

/**
 * Senior-peer endorsements (career references), anonymized to role + sector.
 * These speak to translating complexity, leadership and teaching — distinct
 * from the client-outcome case studies above.
 */
export const endorsements: Endorsement[] = [
  {
    quote:
      "An outstanding leader with a clear vision and a knack for driving innovation — a true professional at the forefront of the digital tech industry.",
    attribution: "Talent Director, global ad-tech",
  },
  {
    quote:
      "A respected senior leader with deep expertise in digital media and data — a great communicator of complexity, with a warm nature that brings people together.",
    attribution: "Chief Executive, national audio industry body",
  },
  {
    quote:
      "He explains complex technical set-ups simply and is a true problem solver. I learnt a huge amount about finding solutions for clients from him.",
    attribution: "Partnerships Director APAC, content-recommendation platform",
  },
  {
    quote:
      "Outstanding leadership, consistently driving results in a challenging market. Where 'get it done' is valued, I'd rehire him 100%.",
    attribution: "Regional MD, video-advertising technology",
  },
  {
    quote:
      "A leading thinker in programmatic and data — he concisely articulates the problems and solutions that matter now and next.",
    attribution: "Business Development Director, programmatic media",
  },
  {
    quote:
      "An industry expert across programmatic, performance and audience who turns knowledge into actionable plans and crafted solutions for clients.",
    attribution: "Enterprise Account Executive, employee-experience SaaS",
  },
  {
    quote:
      "Articulate, engaging and entertaining — he breaks down the barriers advertisers face with data and tech and presents clear solutions.",
    attribution: "Country Manager ANZ, marketing-technology platform",
  },
  {
    quote:
      "Intelligent and hardworking, with a deep understanding of data and tech — always good for a straight answer and willing to get his hands dirty.",
    attribution: "Digital Commerce Director, retail-media agency",
  },
  {
    quote:
      "A unique ability to make programmatic and data accessible to everyone in the room — not just the 'digital' people.",
    attribution: "National Sales Director, digital marketplace",
  },
  {
    quote:
      "Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward.",
    attribution: "Managing Partner, data & digital consultancy",
  },
];

/** Aggregate proof for the results band. */
export const RESULTS_BAND: CaseMetric[] = [
  { value: "$254K", label: "POC contracted from a repositioning" },
  { value: "22%", label: "revenue lift on affected inventory" },
  { value: "40%", label: "faster production ops, no new headcount" },
  { value: "90 days", label: "to a defensible production workflow" },
  { value: "~$20/mo", label: "founder-owned content engine" },
];
