import { jsonMember } from "./registry-text.ts";
import { canonicalPeriod } from "./figures.ts";
import { xbrlPeriod } from "./periods.ts";
import { MAX_SOURCE_BYTES, type Source } from "./types.ts";

const concepts: Record<string, string> = {
  Revenues: "revenue",
  RevenueFromContractWithCustomerExcludingAssessedTax: "revenue",
  SalesRevenueNet: "revenue",
  NetIncomeLoss: "net income",
  CashAndCashEquivalentsAtCarryingValue: "cash and cash equivalents",
  CashCashEquivalentsAndShortTermInvestments:
    "cash, cash equivalents and short-term investments",
  NumberOfEmployees: "employees",
  EntityNumberOfEmployees: "employees",
};
/** Select literal recent XBRL rows with their concept/unit context, before model extraction. */
export function xbrlExcerpt(raw: string, from: Date) {
  const fragments: string[] = [], xbrl: NonNullable<Source["xbrl"]> = [];
  let bytes = 0;
  for (const [concept, metric] of Object.entries(concepts)) {
    const member = jsonMember(raw, concept);
    if (!member) continue;
    const data = JSON.parse(`{${member}}`)[concept];
    for (const [unit, rows] of Object.entries(data.units ?? {})) {
      if (!["USD", "GBP", "pure"].includes(unit) || !Array.isArray(rows)) {
        continue;
      }
      const unitFact = metric === "employees" && unit === "pure"
        ? "people"
        : unit === "USD" || unit === "GBP"
        ? unit
        : null;
      if (!unitFact) continue;
      for (const match of member.matchAll(/\{[^{}]*"val"\s*:[^{}]*\}/g)) {
        const quote = match[0];
        const row = JSON.parse(quote);
        if (
          !rows.some((r) => JSON.stringify(r) === JSON.stringify(row)) ||
          !Number.isFinite(row.val) ||
          !/^\d{10}-\d{2}-\d{6}$/.test(row.accn) ||
          !Number.isFinite(Date.parse(row.filed)) ||
          Date.parse(row.filed) < from.getTime() || !canonicalPeriod(row.end)
        ) continue;
        const size = new TextEncoder().encode(quote).length + 1;
        if (bytes + size > MAX_SOURCE_BYTES) break;
        if (
          xbrl.some((x) =>
            x.quote === quote && x.metric === metric && x.unit === unitFact
          )
        ) continue;
        bytes += size;
        fragments.push(quote);
        const period = xbrlPeriod(row);
        if (!period) continue;
        const statement = `${metric[0].toUpperCase() + metric.slice(1)} ${
          period.periodType === "instant"
            ? period.description
            : `for ${period.period} (${period.description})`
        } was ${unitFact} ${row.val.toLocaleString("en-US")}.`;
        xbrl.push({
          quote,
          metric,
          value: row.val,
          unit: unitFact,
          period: period.period,
          periodType: period.periodType,
          periodStart: period.periodStart,
          periodEnd: period.periodEnd,
          published: row.filed,
          statement,
        });
      }
    }
  }
  const latest = new Map<string, NonNullable<Source["xbrl"]>[number]>();
  for (const item of xbrl) {
    const key = JSON.stringify([
      item.metric,
      item.unit,
      item.periodType,
      item.periodStart,
      item.periodEnd,
    ]);
    if (!latest.has(key) || latest.get(key)!.published < item.published) {
      latest.set(key, item);
    }
  }
  const selected: typeof xbrl = [];
  const counts = new Map<string, number>();
  for (
    const item of [...latest.values()].sort((a, b) =>
      b.periodEnd!.localeCompare(a.periodEnd!) ||
      b.published.localeCompare(a.published)
    )
  ) {
    const key = `${item.metric}:${item.unit}:${item.periodType}`;
    const limit = item.periodType === "quarter" || item.periodType === "instant"
      ? 5
      : 1;
    if ((counts.get(key) ?? 0) >= limit) continue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
    selected.push(item);
  }
  return {
    text: selected.map((x) => x.quote).join("\n"),
    fragments: selected.map((x) => x.quote),
    xbrl: selected,
    excerpted: true as const,
  };
}
