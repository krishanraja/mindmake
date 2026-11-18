import { measureName } from "./figures.ts";
import { growthFacts, priorFacts } from "./comparatives.ts";
import { businessStatement } from "./narrative.ts";
import type { ProposedFact, Source } from "./types.ts";

/** Literal sentence grammar, independent of model proposals. */
export function sentenceFacts(source: Source): ProposedFact[] {
  if (source.category === "coverage" || source.category === "registry") {
    return [];
  }
  const result: ProposedFact[] = [];
  const body = source.text.startsWith(source.title)
    ? source.text.slice(source.title.length).trimStart()
    : source.text;
  for (
    const quote of body.split(/(?<=[.!?])\s+(?=[A-Z“"])|[\r\n]+/).map((s) =>
      s.trim()
    )
  ) {
    const movement = movementFacts(quote, source);
    if (movement.length) {
      result.push(...movement);
      continue;
    }
    const growth = growthFacts(quote, source);
    if (growth.length) {
      result.push(...growth);
      continue;
    }
    const match = quote.match(
      /^(?:(?:Our|The)\s+)?([A-Za-z][A-Za-z,-]*(?:\s+[A-Za-z][A-Za-z,-]*){0,24}?)\s+(?:was|were|is|are|increased to|decreased to|grew to|rose to|fell to|reached|totalled|totaled|had|has|of)\s+(US\$|USD\s*|GBP\s*|\$|£)?\s*([+-]?\d[\d,]*(?:\.\d+)?)(?:\s*(billion|million|thousand|bn|m|k)\b)?/i,
    );
    if (!match) continue;
    const metric = measureName(match[1]);
    if (
      /passport|spouse|children|born|home address|date of birth/i.test(quote)
    ) continue;
    if (
      /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/.test(match[1]) &&
      !match[1].split(/\W+/).every((w) =>
        /^(?:Adjusted|Total|Net|Gross|Cash|And|Short|Term|Investments|Daily|Monthly|Active|Users|Paid|Subscribers|Annual|Recurring|Revenue|Average|Subscription|Length|Bookings|Margin|Income|Profit|Operating|Costs)$/i
          .test(w)
      )
    ) continue;
    if (
      /\b(?:age|born|salary|home|spouse|children|he|she|his|her)\b/i.test(
        metric,
      ) || ["cash", "income", "users"].includes(metric)
    ) continue;
    const scale = ({
      billion: 1e9,
      bn: 1e9,
      million: 1e6,
      m: 1e6,
      thousand: 1e3,
      k: 1e3,
    } as Record<string, number>)[match[4]?.toLowerCase()] ?? 1;
    const pence = /^\s*(?:pence|p)\b/i.test(quote.slice(match[0].length));
    const value = Number(
      (Number(match[3].replaceAll(",", "")) * scale * (pence ? 0.01 : 1))
        .toPrecision(15),
    );
    const unit = quote.slice(match[0].length).startsWith("%")
      ? "%"
      : pence || /GBP|£/.test(match[2] ?? "")
      ? "GBP"
      : match[2]
      ? "USD"
      : /users|subscribers|employees/.test(metric)
      ? "people"
      : null;
    const period = source.documentPeriod ??
      quote.match(/\b(?:FY20\d{2}|Q[1-4] 20\d{2})\b/)?.[0] ?? null;
    const base: ProposedFact = {
      kind: "reported-figure",
      metric,
      aliases: [],
      value,
      unit,
      quote,
      statement: businessStatement(quote),
      sourceUrl: source.url,
      period,
      periodSource: source.documentPeriod
        ? "document"
        : period
        ? "quote"
        : undefined,
      periodType: source.documentPeriod?.startsWith("Q")
        ? "quarter"
        : source.documentPeriod?.startsWith("H")
        ? "year-to-date"
        : source.documentPeriod?.startsWith("FY")
        ? "year"
        : null,
      periodStart: source.documentPeriodStart ?? null,
      periodEnd: source.documentPeriodEnd ?? null,
    };
    result.push(base, ...priorFacts(base, source));
    const margin = quote.match(
      /(?:representing\s+(?:a\s+)?)(\d+(?:\.\d+)?)%\s+margin\b/i,
    );
    if (margin) {
      result.push({
        ...base,
        metric: `${metric} margin`,
        value: Number(margin[1]),
        unit: "%",
      });
    }
  }
  return result;
}

export function roundingAllowance(quote: string, value: number): number {
  for (
    const m of quote.matchAll(
      /(\d[\d,]*(?:\.\d+)?)\s*(billion|million|thousand|bn|m|k)\b/gi,
    )
  ) {
    const scale = ({
      billion: 1e9,
      bn: 1e9,
      million: 1e6,
      m: 1e6,
      thousand: 1e3,
      k: 1e3,
    } as Record<string, number>)[m[2].toLowerCase()];
    if (Math.abs(Number(m[1].replaceAll(",", "")) * scale - value) < 1e-6) {
      return 0.5 * scale / 10 ** (m[1].split(".")[1]?.length ?? 0);
    }
  }
  return 1e-9;
}

export function movementFacts(quote: string, source: Source): ProposedFact[] {
  if (
    !source.documentPeriodEnd ||
    !/^\d{4}-\d{2}-\d{2}$/.test(source.documentPeriodEnd)
  ) return [];
  const m = quote.match(
    /^(?:(?:Our|The)\s+)?([A-Za-z][A-Za-z-]*(?:\s+[A-Za-z][A-Za-z-]*){0,11}?)\s+(?:increased|decreased|grew|rose|fell|moved)\s+from\s+(\d[\d,]*(?:\.\d+)?)(k|m|bn|thousand|million|billion)?\s+at the end of\s+([A-Za-z]+),?\s+to\s+(\d[\d,]*(?:\.\d+)?)(k|m|bn|thousand|million|billion)?\s+at the end of\s+([A-Za-z]+)\./i,
  );
  if (!m) return [];
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const metric = m[1].toLowerCase(), end = new Date(source.documentPeriodEnd);
  if (!Number.isFinite(end.getTime())) return [];
  const results: ProposedFact[] = [];
  for (
    const [raw, scaleWord, monthWord] of [[m[2], m[3], m[4]], [
      m[5],
      m[6],
      m[7],
    ]]
  ) {
    const month = months.indexOf(monthWord.toLowerCase());
    if (month < 0) return [];
    const year = end.getUTCFullYear() - (month > end.getUTCMonth() ? 1 : 0);
    const date = new Date(Date.UTC(year, month + 1, 0)).toISOString().slice(
      0,
      10,
    );
    const scale = ({
      k: 1e3,
      thousand: 1e3,
      m: 1e6,
      million: 1e6,
      bn: 1e9,
      billion: 1e9,
    } as Record<string, number>)[scaleWord?.toLowerCase()] ?? 1;
    const value = Number(
      (Number(raw.replaceAll(",", "")) * scale).toPrecision(15),
    );
    results.push({
      kind: "reported-figure",
      sourceUrl: source.url,
      metric,
      aliases: [],
      value,
      unit: /users|subscribers|employees/.test(metric) ? "people" : null,
      quote,
      statement: `${metric} at the end of ${monthWord} ${year} was ${
        value.toLocaleString("en-GB")
      }.`,
      period: `at ${date}`,
      periodSource: "document",
      periodType: "instant",
      periodStart: null,
      periodEnd: date,
    });
  }
  return results;
}
