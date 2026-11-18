import type {
  Chip,
  Fact,
  FactMetadata,
  ProposedFact,
  Source,
} from "./types.ts";
import { normalise } from "./transport.ts";

export function figureRank(
  metric: string,
  chip: Chip = "results-commentary",
): number {
  if (
    /amortisation|amortization|lease interest|finance costs?|fees?|impairment|tax rate|share.based payment/i
      .test(metric)
  ) return -100;
  const headline =
    /revenue|operating profit|profit before tax|earnings per share|\beps\b|dividend|cash|net debt|guidance|customers|users|subscribers|bookings|forecourts?|margin/i
      .test(metric);
  const priority = chip === "lender-update"
    ? /cash|debt|liquidity|profit/i.test(metric)
    : chip === "investor-update"
    ? /revenue|customers|users|margin|guidance/i.test(metric)
    : /revenue|profit|earnings|eps|forecourts?|margin/i.test(metric);
  return (headline ? 300 : 100) + (priority ? 20 : 0);
}
export function announcementWeight(text: string): number {
  return (/\b(stop|stopping|sunset|discontinu|withdraw|launch|introduc|acquir|divest|raise|raising|cut|price|pricing|appoint|step down|restructur|partner|layoff|redundan|strateg|evolv)|AI-native platform/i
      .test(text)
    ? 100
    : 0) +
    (/\b(expect|outlook|guidance|forecast|target)/i.test(text) ? 10 : 0) +
    (/\d/.test(text) ? 1 : 0);
}
export function backgroundAnnouncement(
  source: Source | undefined,
  quote: string,
): boolean {
  if (!source) return false;
  if (/notice of (?:[\w -]+ )?results/i.test(source.title)) return true;
  const text = normalise(source.text),
    position = text.indexOf(normalise(quote));
  if (position < 0) return false;
  const heading = source.text.match(
    /(?:^|\n)\s*(?:About [^\n.!?]{1,100}|Notes to editors)\s*:?\s*(?:\n|$)/i,
  );
  return !!heading &&
    position >= normalise(source.text.slice(0, heading.index)).length;
}
/** Rescue an explicit strategy sentence even when the model omits it. */
export function strategyFacts(source: Source): ProposedFact[] {
  if (
    !source.published || source.category === "registry" ||
    source.category === "coverage"
  ) return [];
  return source.text.split(/(?<=[.!?])\s+(?=[A-Z“"])|[\r\n]+/).map((s) =>
    s.trim()
  ).filter((quote) =>
    /\bevolv(?:e|ing).{0,120}\bAI-native platform\b/i.test(quote) &&
    !backgroundAnnouncement(source, quote)
  ).map((quote) => ({
    kind: "announcement",
    statement: quote,
    quote,
    sourceUrl: source.url,
    value: null,
    unit: null,
    period: null,
    significance: 3,
  }));
}
export function questionFacts(
  facts: Fact[],
  chip: Chip,
  metadata: FactMetadata = {},
): Fact[] {
  return facts.filter((f) =>
    f.kind === "reported-figure"
      ? figureRank(f.metric ?? "", chip) >= 300
      : f.kind === "announcement" && metadata[f.id]?.significance === 3
  )
    .sort((a, b) =>
      (b.kind === "announcement"
        ? 1000 + announcementWeight(b.quote)
        : figureRank(b.metric ?? "", chip)) -
      (a.kind === "announcement"
        ? 1000 + announcementWeight(a.quote)
        : figureRank(a.metric ?? "", chip))
    ).slice(0, 16);
}
