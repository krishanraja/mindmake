import type { InstrumentKind } from "@/components/mindmake/Instrument";
import bbcLogo from "@/assets/brands/bbc.svg";
import hearstLogo from "@/assets/brands/hearst.svg";
import condeNastLogo from "@/assets/brands/conde-nast.svg";

/**
 * The diagram a story gets, and the numbers in it.
 *
 * Four shapes, and every number in one is from that story's own record. Where
 * the record has no number, the story gets `offer`, which carries none. Nothing
 * here is rounded up, filled in, or inferred from a neighbouring story: a
 * diagram with an invented figure in it is a lie with a chart around it.
 */
export type StoryFigure =
  /** Two spans, long against short. "A year of the wrong build, or one day." */
  /**
   * Two spans, long against short. No numerals: the record says "about a year"
   * and "one day", and printing 365 would be precise where the record is not.
   * from and to set the ratio the bars are drawn at, nothing more.
   */
  | { shape: "span"; from: number; to: number; fromLabel: string; toLabel: string }
  /** A set narrowing or widening. Fourteen vendors, three decisions. */
  | { shape: "focus"; from: number; to: number; keep: "few" | "many"; fromLabel: string; toLabel: string }
  /**
   * A month of days, a few marked or most of them. It carries no numeral,
   * because the record says "about once a month" and "most days" and there is
   * no number in either. The picture shows the pattern; the labels say the
   * words that were actually recorded.
   */
  | { shape: "cadence"; from: number; to: number; fromLabel: string; toLabel: string }
  /** One figure that stands on its own. Two pilots signed during the work. */
  | { shape: "count"; value: number; label: string; within: string }
  /** No number in the record, so no number in the diagram. */
  | { shape: "offer"; before: string; after: string };

export type ClientStory = {
  id: string;
  title: string;
  outcome: string;
  quote: string;
  attribution: string;
  /** Headline for the proof archive, and the diagram that goes with it. */
  result: string;
  figure: StoryFigure;
  homepage?: {
    sector: string;
    title: string;
    body: string;
    visual: "time" | "offer" | "pilots";
  };
};

export const attendeeBrands = [
  { name: "BBC", logo: bbcLogo },
  { name: "Hearst", logo: hearstLogo },
  { name: "Condé Nast", logo: condeNastLogo },
] as const;

export const clientStories: ClientStory[] = [
  {
    id: "expensive-decision",
    result: "One day stopped a year of the wrong build.",
    figure: { shape: "span", from: 365, to: 1, fromLabel: "About a year on the wrong path", toLabel: "One day to the decision" },
    title: "Settle the expensive decision",
    outcome: "One day to a clear build-or-partner decision. This avoided about a year of work on the wrong path.",
    quote: "One day. One decision. No more Monday debates. That's the entire review.",
    attribution: "Chief Revenue Officer, media company",
    homepage: {
      sector: "Media company",
      title: "One day to stop a year of the wrong build.",
      body: "A clear build-or-partner choice ended months of debate and avoided roughly a year of work on the wrong path.",
      visual: "time",
    },
  },
  {
    id: "sellable-expertise",
    result: "Expertise became an offer people could buy.",
    figure: { shape: "offer", before: "Ideas everyone respected", after: "One offer, and a plan to launch it" },
    title: "Turn expertise into something clients can buy",
    outcome: "A respected advisory firm turned its ideas into a clear offer and a plan to launch it.",
    quote: "We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable.",
    attribution: "Partner, Venture Capital Firm",
    homepage: {
      sector: "Investment firm",
      title: "Expertise became an offer people could buy.",
      body: "A respected advice business moved from good ideas to one clear offer and a defined investment plan.",
      visual: "offer",
    },
  },
  {
    id: "simple-product",
    result: "Two pilots signed during the work.",
    figure: { shape: "count", value: 2, label: "pilots signed", within: "inside the thirty days" },
    title: "Make the product simple enough to sell",
    outcome: "The position and price were rebuilt in 30 days. The first two pilots were signed during the work.",
    quote: "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me.",
    attribution: "Founder, adtech firm",
    homepage: {
      sector: "Advertising technology",
      title: "Two pilots signed during the work.",
      body: "The product, price and message became clear in 30 days. The first two pilots signed before the work ended.",
      visual: "pilots",
    },
  },
  {
    id: "hand-back",
    result: "The business was rebuilt and left in the founder's hands.",
    figure: { shape: "count", value: 5, label: "videos shipped", within: "in week one of eight" },
    title: "Rebuild the business, then hand it back",
    outcome: "An eight-week rebuild covered the brand, offers, lead capture, content and outreach. Five videos shipped in week one.",
    quote: "He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need.",
    attribution: "Founder and CEO, executive coaching practice",
  },
  {
    id: "own-system",
    result: "Publishing moved from monthly to most days.",
    figure: { shape: "cadence", from: 1, to: 22, fromLabel: "About once a month", toLabel: "Most days" },
    title: "Own the system instead of renting the operator",
    outcome: "A founder-owned content system cut publishing time from days to under an hour. Publishing moved from about monthly to most days.",
    quote: "I've learnt to push through barriers I didn't know I could, and the systems make me more effective and more motivated. I used to post once a month, now it's most days. It's helping my customers see me.",
    attribution: "Founder, research and content brand",
  },
  {
    id: "team-decides",
    result: "Fourteen vendors became three decisions.",
    figure: { shape: "focus", from: 14, to: 3, keep: "few", fromLabel: "Fourteen competing vendors", toLabel: "Three decisions" },
    title: "Change how the team decides",
    outcome: "A publisher moved from 14 competing AI vendors to three decisions. Its own team then shipped the chosen work with no new hires.",
    quote: "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it.",
    attribution: "Head of Operations, top-10 US digital publisher",
  },
  {
    id: "business-first",
    result: "Eleven tools stopped. One useful system went live.",
    figure: { shape: "focus", from: 14, to: 3, keep: "few", fromLabel: "Fourteen tools running", toLabel: "Three kept, eleven stopped" },
    title: "Tie every AI choice back to the business",
    outcome: "Eleven of fourteen tools were stopped. The budget was kept and the first working system went live inside 90 days.",
    quote: "It's been a good journey to bring him problems that match our business goals and leadership needs, and watch them come together in a very thoughtful programme.",
    attribution: "President, legacy broadcast business",
  },
  {
    id: "market-moves",
    result: "A new sales path led to a paid publisher test.",
    figure: { shape: "offer", before: "Selling the way the old web paid", after: "A paid test with a major US publisher" },
    title: "Change direction before the market moves",
    outcome: "A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.",
    quote: "He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver.",
    attribution: "Chief Revenue Officer, data-infrastructure company",
  },
];

export const careerReferences = [
  { name: "Lizzie Young", role: "Chief Executive, Commercial Radio & Audio", quote: "A respected senior leader with deep expertise in digital media and data, a great communicator of complexity, with a warm nature that brings people together." },
  { name: "Rob Hudson", role: "National Sales Director, Media, REA Group", quote: "A unique ability to make data products accessible to everyone in the room, not just the digital people. A genuine passion for helping clients solve business problems, and above all very personable and approachable." },
  { name: "Michael Ricciardone", role: "Country Manager, ANZ, MoEngage", quote: "Articulate, engaging and entertaining. He breaks down the barriers marketers face with data and technology using relevant examples and stories, then presents clear solutions. Full of support, always keen to educate." },
  { name: "Melinda Heffernan", role: "Ad Channel Partnerships Director, Asia-Pacific, Taboola", quote: "He explains complex technical set-ups simply and is a true problem solver. I learnt a huge amount about finding solutions for clients from him." },
  { name: "Chris Spencer", role: "Lead Account Executive, Enterprise, Culture Amp", quote: "An industry expert who turns knowledge into actionable plans and crafted solutions for clients." },
  { name: "Ashley Wales-Brown", role: "Digital Commerce Director, Mars United Commerce", quote: "Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty." },
  { name: "Matt Paine", role: "Managing Partner, Lamington Digital", quote: "Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward." },
  { name: "Marie-Anne Leung Kam", role: "Director, 2 Square Talent", quote: "An outstanding leader with a clear vision, a collaborative approach and a knack for driving innovation. I could not recommend him more highly." },
  { name: "Vincent Pelillo", role: "Regional Managing Director, Channel Factory", quote: "Outstanding leadership, consistently driving results in a challenging market. Where 'get it done' is valued, I'd rehire him 100%." },
] as const;

export const homepageResultStories = clientStories.flatMap((story) =>
  story.homepage ? [{ id: story.id, ...story.homepage }] : [],
);

/**
 * The mark for a kind of story, so a reader can tell at a glance what shape of
 * result they are about to read. Each mapping is the instrument that means the
 * same thing: time moving through, things falling away, a figure reached, a
 * rhythm traced, a shape formed.
 */
export const FIGURE_INSTRUMENT: Record<StoryFigure["shape"], InstrumentKind> = {
  span: "rail",
  focus: "flap",
  count: "gauge",
  cadence: "recorder",
  offer: "drawer",
};
