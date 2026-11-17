import type { PeriodFields } from "./types.ts";
export function xbrlPeriod(
  row: { start?: string; end: string; fp?: string },
): (PeriodFields & { period: string; description: string }) | null {
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(row.end) ||
    !Number.isFinite(Date.parse(row.end))
  ) return null;
  const end = new Date(row.end), year = end.getUTCFullYear();
  const date = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  if (!row.start) {
    return {
      period: `at ${row.end}`,
      description: `at ${date}`,
      periodType: "instant",
      periodStart: null,
      periodEnd: row.end,
    };
  }
  const days = (Date.parse(row.end) - Date.parse(row.start)) / 86400000 + 1;
  const base = { periodStart: row.start, periodEnd: row.end };
  if (days >= 75 && days <= 105) {
    return {
      ...base,
      periodType: "quarter",
      period: `${
        /^Q[1-4]$/.test(row.fp ?? "")
          ? row.fp
          : `Q${Math.ceil((end.getUTCMonth() + 1) / 3)}`
      } ${year}`,
      description: `three months to ${date}`,
    };
  }
  if (days >= 165 && days <= 195) {
    return {
      ...base,
      periodType: "year-to-date",
      period: `H1 ${year}`,
      description: `six months to ${date}`,
    };
  }
  if (days >= 255 && days <= 290) {
    return {
      ...base,
      periodType: "year-to-date",
      period: `9M ${year}`,
      description: `nine months to ${date}`,
    };
  }
  if (days >= 350 && days <= 380) {
    return {
      ...base,
      periodType: "year",
      period: `FY${year}`,
      description: `year to ${date}`,
    };
  }
  return null;
}
