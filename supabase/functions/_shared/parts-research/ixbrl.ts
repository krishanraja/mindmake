import { stripHtml } from "./transport.ts";
import type { Source } from "./types.ts";
const attr = (tag: string, key: string) =>
  tag.match(new RegExp(`\\b${key}\\s*=\\s*["']([^"']+)["']`, "i"))?.[1];
export function ixValue(quote: string): number | null {
  const tag = quote.match(/^<ix:nonFraction\b[^>]*>/i)?.[0];
  if (!tag || /nil=["']true/i.test(tag)) return null;
  let text = stripHtml(quote).trim();
  if (/numcommadecimal/i.test(attr(tag, "format") ?? "")) {
    text = text.replaceAll(".", "").replace(",", ".");
  } else text = text.replaceAll(",", "");
  if (!/^\(?-?\d+(?:\.\d+)?\)?$/.test(text)) return null;
  const n = Number(text.replace(/[()]/g, "")) *
    10 ** Number(attr(tag, "scale") ?? 0) *
    (attr(tag, "sign") === "-" || text.startsWith("(") ? -1 : 1);
  return Number.isFinite(n) ? Number(n.toPrecision(15)) : null;
}
export function ixbrlFacts(raw: string, published: string) {
  const contexts = new Map<
    string,
    { start: string | null; end: string; instant: boolean }
  >();
  for (
    const m of raw.matchAll(
      /<(?:xbrli:)?context\b[^>]*>[\s\S]*?<\/(?:xbrli:)?context>/gi,
    )
  ) {
    if (/(?:explicitMember|typedMember)/i.test(m[0])) continue;
    const id = attr(m[0], "id"),
      start =
        m[0].match(/<(?:xbrli:)?startDate>\s*(\d{4}-\d{2}-\d{2})/i)?.[1] ??
          null;
    const instant = m[0].match(/<(?:xbrli:)?instant>\s*(\d{4}-\d{2}-\d{2})/i)
      ?.[1];
    const end = instant ??
      m[0].match(/<(?:xbrli:)?endDate>\s*(\d{4}-\d{2}-\d{2})/i)?.[1];
    if (
      id && end && Number.isFinite(Date.parse(end)) &&
      (!start || Number.isFinite(Date.parse(start)))
    ) contexts.set(id, { start, end, instant: !!instant });
  }
  const units = new Map<string, string>();
  for (
    const m of raw.matchAll(
      /<(?:xbrli:)?unit\b[^>]*>[\s\S]*?<\/(?:xbrli:)?unit>/gi,
    )
  ) {
    const id = attr(m[0], "id");
    if (id) units.set(id, stripHtml(m[0]));
  }
  const concepts: Record<string, string> = {
    TurnoverRevenue: "turnover",
    Revenue: "revenue",
    Turnover: "turnover",
    ProfitLoss: "profit or loss",
    ProfitLossForPeriod: "profit or loss for the period",
    AverageNumberEmployeesDuringPeriod: "average number of employees",
    AverageNumberEmployees: "average number of employees",
    CashBankInHand: "cash at bank and in hand",
    CashAtBankAndInHand: "cash at bank and in hand",
    CashAndCashEquivalents: "cash and cash equivalents",
    NetAssetsLiabilities: "net assets or liabilities",
    NetAssets: "net assets",
  };
  const xbrl: NonNullable<Source["xbrl"]> = [];
  for (
    const m of raw.matchAll(
      /<ix:nonFraction\b[^>]*>[\s\S]*?<\/ix:nonFraction>/gi,
    )
  ) {
    const name = attr(m[0], "name")?.split(":").at(-1),
      metric = name && concepts[name],
      context = contexts.get(attr(m[0], "contextRef") ?? "");
    const value = ixValue(m[0]);
    if (!metric || !context || value === null) continue;
    const measure = units.get(attr(m[0], "unitRef") ?? "") ?? "";
    const unit = metric.includes("employees")
      ? "people"
      : /GBP/.test(measure)
      ? "GBP"
      : /USD/.test(measure)
      ? "USD"
      : null;
    if (!unit) continue;
    const days = context.start
      ? (Date.parse(context.end) - Date.parse(context.start)) / 86400000
      : 0;
    const period = context.instant
      ? `at ${context.end}`
      : days > 330
      ? `FY${context.end.slice(0, 4)}`
      : context.end.slice(0, 7);
    xbrl.push({
      quote: m[0],
      metric,
      value,
      unit,
      period,
      statement: `${metric} for ${period} was ${unit} ${
        value.toLocaleString("en-GB")
      }.`,
      published,
      periodType: context.instant
        ? "instant"
        : days > 330
        ? "year"
        : "year-to-date",
      periodStart: context.start,
      periodEnd: context.end,
    });
  }
  const selected = xbrl.filter((row) => row.quote.length <= 1600).sort((a, b) =>
    (b.periodEnd ?? "").localeCompare(a.periodEnd ?? "")
  ).slice(0, 40);
  const fragments = selected.map((f) => f.quote);
  return { xbrl: selected, fragments, text: fragments.join("\n") };
}
