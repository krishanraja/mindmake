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
    const quote of body.split(/(?<=[.!?])\s+(?=[A-Z“"])/).map((s) => s.trim())
  ) {
    const match = quote.match(
      /^(?:(?:Our|The)\s+)?([A-Za-z][A-Za-z,-]*(?:\s+[A-Za-z][A-Za-z,-]*){0,5}?)\s+(?:was|were|is|are|increased to|decreased to|grew to|rose to|fell to|reached|totalled|totaled|of)\s+(US\$|USD\s*|GBP\s*|\$|£)?\s*([+-]?\d[\d,]*(?:\.\d+)?)(?:\s*(billion|million|thousand|bn|m|k)\b)?/i,
    );
    if (!match) continue;
    const metric = match[1].toLowerCase();
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
    const value = Number(
      (Number(match[3].replaceAll(",", "")) * scale).toPrecision(15),
    );
    const unit = quote.slice(match[0].length).startsWith("%")
      ? "%"
      : /GBP|£/.test(match[2] ?? "")
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
      periodType: source.documentPeriod?.startsWith("Q") ? "quarter" : null,
      periodStart: null,
      periodEnd: null,
    };
    result.push(base);
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
