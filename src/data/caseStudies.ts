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

/**
 * Which live engagement a case study maps to.
 *
 * Retagged August 2026 off the retired six-rung ladder. Where an old
 * engagement does not map cleanly, it is
 * tagged by what it most resembles in shape, and the original tag is noted in a
 * comment on the record. Nothing about the work itself changed; only the label
 * a reader filters by.
 */
export type Engagement = "Teardown" | "Handover";

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
  // Largest first, matching every other surface.
  Handover: {
    label: "The Handover",
    price: "",
    blurb: "Six weeks rebuilding how the business decides and sells. Then it ends.",
    href: "/handover",
    cta: "See The Handover",
  },
  Teardown: {
    label: "The Teardown",
    price: "",
    blurb: "Ten business days on one real decision, taken apart.",
    href: "/teardown",
    cta: "See The Teardown",
  },
};

/** Display order matters: rich cases first (best teaser), quote cards after. */
export const caseStudies: CaseStudy[] = [
  // ---- Rich cases ----
  {
    id: "us-publisher-roadmap",
    engagement: "Teardown", // retagged from the retired one-day commercial diagnosis
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
    engagement: "Teardown", // retagged from the retired executive cohort
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
    engagement: "Handover", // retagged from the retired 30-day commercial rebuild
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
      "A senior operator running a coaching and corporate-consulting practice on the side. Outdated website, no CRM, no content cadence. Inbox-zero in her corporate role and 6,500 unread emails in her own business. The forcing function was missing.",
    theCall:
      "AI is the forcing function. Rebuild the entire commercial stack in eight weeks (brand, site, productized offers, lead capture, content engine and outbound) on a reusable writing OS so context never has to be re-explained.",
    theWork:
      "A new brand and production-ready site concepts shipped one prompt each. A productized coaching ladder ($2K–$8K) and a corporate workshop, lead capture, an L&D outbound system, and reusable projects for voice, video scripts and outreach.",
    quote: {
      text: "The reason I'm loving Krish's sprints is the unique approach. He uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need.",
      attribution: "Founder & CEO, executive coaching practice",
    },
  },
  {
    id: "content-engine-founder-owned",
    engagement: "Handover", // retagged from the retired 30-day commercial rebuild
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
      "Build a low-cost, voice-first content engine the founder owns. Manual first, automated only after the system worked end-to-end, phased so the founder kept enjoying it.",
    theWork:
      "A three-phase roadmap: a voice-to-research engine producing research-backed posts in under 45 minutes, then seeding and outreach, then a publishing pipeline, evidence library and SEO flywheel.",
    quote: {
      text: "Since working with Krish I've learnt to push through basic barriers I didn't realise I could, and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days. It's helping me be seen by my customers.",
      attribution: "Founder, research & content brand",
    },
  },
  {
    id: "series-b-build-vs-buy",
    engagement: "Teardown", // retagged from the retired one-day commercial diagnosis
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
    engagement: "Teardown", // retagged from the retired executive cohort
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
    engagement: "Teardown", // retagged from the retired executive cohort
    clientLabel: "VP of Operations",
    sector: "Tool sprawl",
    variant: "quote",
    headline: "We went from 14 tools to 3 systems that actually work.",
    metrics: [{ value: "14 → 3", label: "AI tools that actually work" }],
    quote: {
      text: "Everyone on the team was experimenting with AI: ChatGPT for this, Claude for that, some random automation tool from LinkedIn. It was chaos. The cohort forced us to decide what's actually strategic and what's just noise.",
      attribution: "VP of Operations",
    },
  },
  {
    id: "q-build-vs-buy",
    engagement: "Teardown", // retagged from the retired one-day commercial diagnosis
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
    engagement: "Teardown", // retagged from the retired one-day commercial diagnosis
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
    engagement: "Teardown", // retagged from the retired one-day commercial diagnosis
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
    engagement: "Teardown", // retagged from the retired executive cohort
    clientLabel: "Head of Ops · Scale-up",
    sector: "Execution",
    variant: "quote",
    headline: "I built two workflows that I now use every day.",
    metrics: [{ value: "2", label: "workflows I now use every single day" }],
    quote: {
      text: "I actually built two workflows in the session that I now use every day. Not experiments, real systems that made my week calmer almost immediately.",
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
 * These speak to translating complexity, leadership and teaching, distinct
 * from the client-outcome case studies above.
 */
export const endorsements: Endorsement[] = [
  {
    quote:
      "An outstanding leader with a clear vision and a knack for driving innovation, a true professional at the forefront of the digital tech industry.",
    attribution: "Talent Director, global ad-tech",
  },
  {
    quote:
      "A respected senior leader with deep expertise in digital media and data, a great communicator of complexity, with a warm nature that brings people together.",
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
      "A leading thinker in programmatic and data, who concisely articulates the problems and solutions that matter now and next.",
    attribution: "Business Development Director, programmatic media",
  },
  {
    quote:
      "An industry expert across programmatic, performance and audience who turns knowledge into actionable plans and crafted solutions for clients.",
    attribution: "Enterprise Account Executive, employee-experience SaaS",
  },
  {
    quote:
      "Articulate, engaging and entertaining. He breaks down the barriers advertisers face with data and tech and presents clear solutions.",
    attribution: "Country Manager ANZ, marketing-technology platform",
  },
  {
    quote:
      "Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty.",
    attribution: "Digital Commerce Director, retail-media agency",
  },
  {
    quote:
      "A unique ability to make programmatic and data accessible to everyone in the room, not just the 'digital' people.",
    attribution: "National Sales Director, digital marketplace",
  },
  {
    quote:
      "Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward.",
    attribution: "Managing Partner, data & digital consultancy",
  },
];

/**
 * Aggregate proof for the results band.
 *
 * Leads with the $254K POC (proof bank R-01), which is the largest contracted
 * number Mindmaker holds and was nowhere on the site until August 2026. The
 * client is never named: "a major US publisher" is the approved wording and the
 * only wording.
 */
export const RESULTS_BAND: CaseMetric[] = [
  { value: "$254K", label: "POC contracted with a major US publisher" },
  { value: "22%", label: "revenue lift on affected inventory" },
  { value: "40%", label: "faster production ops, no new headcount" },
  { value: "90 days", label: "to a defensible production workflow" },
  { value: "~$20/mo", label: "founder-owned content engine" },
];
