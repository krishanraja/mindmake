import type { Fact, ProposedFact, Source } from "./types.ts";

export function canonicalPeriod(period: string | null): string | null {
  if (!period) return null;
  if (/^(?:9M \d{4}|at \d{4}-\d{2}-\d{2})$/.test(period)) return period;
  const p = period.trim();
  if (
    /^FY(?:19|20)\d{2}$/.test(p) ||
    /^(?:H[12]|Q[1-4]) (?:19|20)\d{2}$/.test(p) ||
    /^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])$/.test(p)
  ) return p;
  if (/^(?:19|20)\d{2}-(?:0[1-9]|1[0-2])-\d{2}$/.test(p)) return p.slice(0, 7);
  const quarter = p.match(
    /(?:Q([1-4])\s*|(?:first|second|third|fourth) quarter(?: of)? )((?:19|20)\d{2})/i,
  );
  if (quarter) {
    const n = quarter[1] ??
      ({ first: 1, second: 2, third: 3, fourth: 4 } as Record<string, number>)[
        p.split(" ")[0].toLowerCase()
      ];
    return `Q${n} ${quarter[2]}`;
  }
  return null;
}
export function metricFor(p: ProposedFact): string {
  if (typeof p.metric === "string" && p.metric.trim()) {
    return p.metric.trim().toLowerCase();
  }
  const words = p.quote.match(
    /cash, cash equivalents and short-term investments|cash and cash equivalents|cash and (?:short-term )?investments|net income|paid subscribers|daily active users|monthly active users|revenue|cash|subscribers|users|employees|customer deposits|guidance/i,
  );
  return words?.[0].toLowerCase() ?? "reported figure";
}
export function figureAliases(value: unknown): string[] {
  return Array.isArray(value)
    ? [
      ...new Set(
        value.filter((s): s is string =>
          typeof s === "string" && !!s.trim() && s.length <= 100 &&
          !["cash", "income", "users", "subscribers", "margin"].includes(
            s.trim().toLowerCase(),
          )
        ).map((s) => s.trim().toLowerCase()),
      ),
    ].slice(0, 8)
    : [];
}
/** Parse base units only from quote bytes. Ambiguous multi-value quotes stay null. */
export function quoteValue(
  quote: string,
  metric: string,
  unit: Fact["unit"],
): number | null {
  // Literal XBRL rows and legacy concept quotes: val is the only numeric measure.
  if (/"val"\s*:/.test(quote)) {
    const vals = [
      ...quote.matchAll(/"val"\s*:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g),
    ].map((m) => Number(m[1]));
    return vals.length === 1 && Number.isFinite(vals[0]) ? vals[0] : null;
  }
  let text = quote.replace(
    /\b(?:FY\s?\d{4}|[HQ][1-4]\s+\d{4}|\d{4}-\d{2}(?:-\d{2})?)\b/gi,
    (m) => " ".repeat(m.length),
  );
  const index = text.toLowerCase().indexOf(metric.toLowerCase());
  if (index >= 0) {
    const after = text.slice(index + metric.length);
    // Preserve decimal points; terminate at a sentence boundary or semicolon.
    text = after.split(/;|\.(?:\s|$)/)[0];
  }
  const pattern =
    /(?:(US\$|USD|GBP|£|\$)\s*)?(\(?[+-]?\d[\d,]*(?:\.\d+)?)(?:\s*(billion|million|thousand|bn|m|k)\b)?\)?\s*(%|per cent|percent)?/gi;
  const values: number[] = [];
  for (const m of text.matchAll(pattern)) {
    if (!m[1] && !m[3] && !m[4] && /^(?:19|20)\d{2}$/.test(m[2])) continue;
    if (unit === "%" && !m[4] || unit !== "%" && m[4]) continue;
    if (
      m[1] && unit === "GBP" && /USD|\$/i.test(m[1]) ||
      m[1] && unit === "USD" && /GBP|£/i.test(m[1])
    ) continue;
    const scale = ({
      billion: 1e9,
      bn: 1e9,
      million: 1e6,
      m: 1e6,
      thousand: 1e3,
      k: 1e3,
    } as Record<string, number>)[m[3]?.toLowerCase()] ?? 1;
    const n = Number(m[2].replace(/[,(]/g, "")) * scale *
      (m[2].startsWith("(") ? -1 : 1);
    if (Number.isFinite(n)) values.push(n);
  }
  return values.length === 1 ? values[0] : null;
}
export function xbrlStatement(
  source: Source,
  fact: Pick<Fact, "quote" | "value" | "unit" | "period">,
): string | null {
  return source.xbrl?.find((x) =>
    x.quote === fact.quote && x.value === fact.value && x.unit === fact.unit &&
    x.period === canonicalPeriod(fact.period)
  )?.statement ?? null;
}
