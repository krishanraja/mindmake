import type { InstrumentKind } from "@/components/mindmake/Instrument";
import { testimonials } from "@/data/testimonials";
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
  /**
   * A set cut down, and what went live in its place. Every tool the record
   * counts is drawn, the ones stopped are struck through rather than removed,
   * and the system that went live stands apart from them: "eleven of fourteen
   * tools were stopped" and "one useful system live" are two facts, and a
   * narrowing drawn as 14 → 3 said only the first and looked like its
   * neighbour's figure. Only `cut` and `live` are printed; they are the
   * headline's own numbers.
   */
  | { shape: "cut"; from: number; cut: number; live: number }
  /** No number in the record, so no number in the diagram. */
  | { shape: "offer"; before: string; after: string };

export type ClientStory = {
  id: string;
  title: string;
  outcome: string;
  /** The voice in `src/data/testimonials.ts` this story quotes, by id. */
  voice: string;
  /** Read from that voice: the whole quote, verbatim, and the role it was given under. */
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

/**
 * What a story quotes, read from the thirty-three rather than written twice.
 *
 * Until 7 September 2026 each story carried its own copy of the quote, and the
 * copies drifted: anglicised, name-stripped, and in three cases older words
 * than the person's own file held. A quote is canon in one place, so a story
 * names its voice and takes the quote and the role from there. A story naming
 * a voice that does not exist fails here, at import, rather than rendering an
 * empty card.
 */
const spoken = (voice: string) => {
  const found = testimonials.find((entry) => entry.id === voice);
  if (!found) throw new Error(`No testimonial with id "${voice}"`);
  return { voice, quote: found.full, attribution: found.role };
};

export const clientStories: ClientStory[] = [
  /* Swapped on 7 September 2026 to fit the quote it carries. The record is the
     same engagement (R-08): the story used to lead on the year of engineering
     not spent, and the client's own words are about value landing on day one,
     compounding after, and nobody loitering. So the story is the day, the
     partner signed the month after, and the review booked twelve months out.
     The two quarters and the one day are the record's; no number is new. */
  {
    id: "day-one",
    result: "A day's work, and a partner signed the month after.",
    figure: { shape: "span", from: 180, to: 1, fromLabel: "Two quarters refereeing the argument", toLabel: "One day in the room" },
    title: "Land the answer in a day, then leave",
    outcome: "Two quarters of argument over build or partner ended in one day in the room. The partner agreement was signed the following month, and build comes back for review in twelve months, once the data is stronger.",
    ...spoken("media-cro"),
    homepage: {
      sector: "Media company",
      title: "A day's work, and a partner signed the month after.",
      body: "Two quarters of argument over build or partner ended in one day. The partner agreement was signed the following month.",
      visual: "time",
    },
  },
  {
    id: "sellable-expertise",
    result: "Expertise became an offer people could buy.",
    figure: { shape: "offer", before: "Ideas everyone respected", after: "One offer, and a plan to launch it" },
    title: "Turn expertise into something clients can buy",
    outcome: "A respected advisory firm turned its ideas into a clear offer and a plan to launch it.",
    ...spoken("media-advisory-partner"),
    homepage: {
      sector: "Media advisory",
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
    ...spoken("martech-founder"),
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
    ...spoken("coaching-founder"),
  },
  {
    id: "own-system",
    result: "Publishing moved from monthly to most days.",
    figure: { shape: "cadence", from: 1, to: 22, fromLabel: "About once a month", toLabel: "Most days" },
    title: "Own the system instead of renting the operator",
    outcome: "A founder-owned content system cut publishing time from days to under an hour. Publishing moved from about monthly to most days.",
    ...spoken("wellness-founder"),
  },
  {
    id: "team-decides",
    result: "Fourteen vendors became three decisions.",
    figure: { shape: "focus", from: 14, to: 3, keep: "few", fromLabel: "Fourteen competing vendors", toLabel: "Three decisions" },
    title: "Change how the team decides",
    outcome: "A publisher moved from 14 competing AI vendors to three decisions. Its own team then shipped the chosen work with no new hires.",
    ...spoken("publisher-ops"),
  },
  {
    id: "business-first",
    result: "The team cut eleven tools and put one useful system live.",
    figure: { shape: "cut", from: 14, cut: 11, live: 1 },
    title: "Tie every AI choice back to the business",
    outcome: "Eleven of fourteen tools were stopped. The budget was kept and the first working system went live inside 90 days.",
    ...spoken("broadcast-president"),
  },
  {
    id: "market-moves",
    result: "A new sales path led to a paid publisher test.",
    figure: { shape: "offer", before: "Selling the way the old web paid", after: "A paid test with a major US publisher" },
    title: "Change direction before the market moves",
    outcome: "A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.",
    ...spoken("data-infra-cro"),
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
  cut: "flap",
  cadence: "recorder",
  offer: "drawer",
};
