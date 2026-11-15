import type { InstrumentKind } from "@/components/mindmake/Instrument";
import { testimonials } from "@/data/testimonials";
import { resultById, type ResultId } from "@/data/useCases";
import bbcLogo from "@/assets/brands/bbc.svg";
import hearstLogo from "@/assets/brands/hearst.svg";
import condeNastLogo from "@/assets/brands/conde-nast.svg";
import walmartLogo from "@/assets/brands/walmart.svg";
import pepsicoLogo from "@/assets/brands/pepsico.webp";
import pgLogo from "@/assets/brands/pg.webp";
import bmwLogo from "@/assets/brands/bmw.svg";
import boeingLogo from "@/assets/brands/boeing.svg";
import pfizerLogo from "@/assets/brands/pfizer.svg";
import visaLogo from "@/assets/brands/visa.svg";
import amexLogo from "@/assets/brands/american-express.svg";
import goldmanLogo from "@/assets/brands/goldman-sachs.svg";
import deloitteLogo from "@/assets/brands/deloitte.svg";
import pwcLogo from "@/assets/brands/pwc.svg";
import lorealLogo from "@/assets/brands/loreal.svg";
import adidasLogo from "@/assets/brands/adidas.svg";

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
};

/**
 * The sixteen approved attendee brands (04_PROOF.md), media first. Attendance,
 * never clients. Official artwork from each brand's own kit (Brandfetch,
 * 6 November 2026), shown as one flat mark by the rail's filter. P&G's roundel
 * is knocked out so its letters read through the flat mark, as BMW's quarters
 * do. `scale` lifts a round or stacked mark to the optical size of a wordmark.
 */
export const attendeeBrands: ReadonlyArray<{ name: string; logo: string; scale?: number }> = [
  { name: "BBC", logo: bbcLogo },
  { name: "Hearst", logo: hearstLogo },
  { name: "Condé Nast", logo: condeNastLogo },
  { name: "Walmart", logo: walmartLogo },
  { name: "PepsiCo", logo: pepsicoLogo, scale: 1.25 },
  { name: "P&G", logo: pgLogo, scale: 1.45 },
  { name: "BMW", logo: bmwLogo, scale: 1.45 },
  { name: "Boeing", logo: boeingLogo },
  { name: "Pfizer", logo: pfizerLogo, scale: 1.3 },
  { name: "Visa", logo: visaLogo },
  { name: "American Express", logo: amexLogo, scale: 0.7 },
  { name: "Goldman Sachs", logo: goldmanLogo, scale: 1.35 },
  { name: "Deloitte", logo: deloitteLogo },
  { name: "PwC", logo: pwcLogo, scale: 1.25 },
  { name: "L'Oréal", logo: lorealLogo },
  { name: "Adidas", logo: adidasLogo, scale: 1.2 },
];

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

/**
 * How the results field draws each result: its title and its diagram. The
 * result's words, its quote and the use case it belongs to are read from the
 * one record in src/data/useCases.ts; only these two presentation fields live
 * here, in the order the field shows them.
 */
const CASE_PROOF: ReadonlyArray<{ id: ResultId; title: string; figure: StoryFigure }> = [
  { id: "day-one", title: "Land the answer in a day, then leave", figure: { shape: "span", from: 180, to: 1, fromLabel: "Two quarters refereeing the argument", toLabel: "One day in the room" } },
  { id: "sellable-expertise", title: "Turn expertise into something clients can buy", figure: { shape: "offer", before: "Ideas everyone respected", after: "One offer, and a plan to launch it" } },
  { id: "simple-product", title: "Make the product simple enough to sell", figure: { shape: "count", value: 2, label: "pilots signed", within: "inside the thirty days" } },
  { id: "hand-back", title: "Rebuild the business, then hand it back", figure: { shape: "count", value: 5, label: "videos shipped", within: "in week one of eight" } },
  { id: "own-system", title: "Own the system instead of renting the operator", figure: { shape: "cadence", from: 1, to: 22, fromLabel: "About once a month", toLabel: "Most days" } },
  { id: "team-decides", title: "Change how the team decides", figure: { shape: "focus", from: 14, to: 3, keep: "few", fromLabel: "Fourteen competing vendors", toLabel: "Three decisions" } },
  { id: "business-first", title: "Tie every AI choice back to the business", figure: { shape: "cut", from: 14, cut: 11, live: 1 } },
  { id: "market-moves", title: "Change direction before the market moves", figure: { shape: "offer", before: "Selling the way the old web paid", after: "A paid test with a major US publisher" } },
];

/** The eight results on the record, read from their use cases, with the quote each carries. */
export const clientStories: ClientStory[] = CASE_PROOF.map(({ id, title, figure }) => {
  const result = resultById(id);
  return { id, result: result.headline, figure, title, outcome: result.detail, ...spoken(result.quoteId) };
});

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
