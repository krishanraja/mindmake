import type { ProposedFact, Source } from "./types.ts";
import { measureName } from "./figures.ts";
const scale = (word?: string) =>
  ({
    bn: 1e9,
    billion: 1e9,
    m: 1e6,
    million: 1e6,
    k: 1e3,
    thousand: 1e3,
  } as Record<string, number>)[word?.toLowerCase() ?? ""] ?? 1;
export function priorFacts(
  base: ProposedFact,
  _source: Source,
): ProposedFact[] {
  const m = base.quote.match(
    /\((H[12]\s*20\d{2}|FY\s*20\d{2}|Q[1-4]\s*20\d{2})\s*:\s*(£|\$)?\s*([\d,]+(?:\.\d+)?)(bn|m|k|billion|million|thousand)?\s*\)/i,
  );
  if (!m) return [];
  const period = m[1].toUpperCase().replace(/^(H[12]|Q[1-4])\s*/, "$1 ")
    .replace(/^FY\s*/, "FY");
  const value = Number(
    (Number(m[3].replaceAll(",", "")) * scale(m[4])).toPrecision(15),
  );
  return [{
    ...base,
    value,
    period,
    unit: m[2] === "£" ? "GBP" : m[2] === "$" ? "USD" : base.unit,
    periodSource: "quote",
    periodType: period.startsWith("FY")
      ? "year"
      : period.startsWith("H")
      ? "year-to-date"
      : "quarter",
    periodStart: null,
    periodEnd: null,
    statement: `${base.metric} for ${period} was ${
      value.toLocaleString("en-GB")
    }${base.unit ? ` ${base.unit}` : ""}.`,
  }];
}
export function growthFacts(quote: string, source: Source): ProposedFact[] {
  const m = quote.match(
    /^(?:(?:Our|The)\s+)?([A-Za-z][A-Za-z -]{0,120}?)\s+(?:increased|grew|rose)\s+by\s+(\d+(?:\.\d+)?)%\s+to\s*(£|\$)?\s*([\d,]+(?:\.\d+)?)(bn|m|k|billion|million|thousand)?\b/i,
  );
  if (!m) return [];
  const metric = measureName(m[1]),
    value = Number(
      (Number(m[4].replaceAll(",", "")) * scale(m[5])).toPrecision(15),
    );
  const base: ProposedFact = {
    kind: "reported-figure",
    metric,
    aliases: [],
    quote,
    statement: quote,
    sourceUrl: source.url,
    value,
    unit: m[3] === "£" ? "GBP" : m[3] === "$" ? "USD" : null,
    period: source.documentPeriod ?? null,
    periodSource: source.documentPeriod ? "document" : undefined,
    periodType: source.documentPeriod?.startsWith("FY")
      ? "year"
      : source.documentPeriod?.startsWith("H")
      ? "year-to-date"
      : null,
    periodStart: source.documentPeriodStart ?? null,
    periodEnd: source.documentPeriodEnd ?? null,
  };
  return [base, {
    ...base,
    metric: `${metric} growth`,
    value: Number(m[2]),
    unit: "%",
  }, ...priorFacts(base, source)];
}
