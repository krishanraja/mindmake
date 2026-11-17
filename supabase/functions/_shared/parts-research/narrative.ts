import { canonicalPeriod } from "./figures.ts";
/** Salvage only complete array elements, never repair an incomplete fact. */
export function parseFacts(
  raw: string | null,
  limit = 12,
): { facts: unknown[]; status: "ok" | "truncated" | "failed" } {
  const text = (raw ?? "").trim().replace(/^```(?:json)?\s*/i, "").replace(
    /\s*```$/,
    "",
  );
  try {
    const value = JSON.parse(text);
    const facts = Array.isArray(value) ? value : value?.facts;
    return Array.isArray(facts)
      ? { facts: facts.slice(0, limit), status: "ok" }
      : { facts: [], status: "failed" };
  } catch { /* Recover complete objects in an unfinished array. */ }
  const prefix = text.match(/^(?:\{\s*"facts"\s*:\s*)?\[/);
  if (!prefix) return { facts: [], status: "failed" };
  const facts: unknown[] = [];
  let quoted = false, escape = false, depth = 0, start = -1;
  for (let i = prefix[0].length; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') quoted = false;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === "{") {
      if (depth === 0) start = i;
      depth++;
    } else if (c === "}") {
      if (--depth === 0 && start >= 0) {
        try {
          facts.push(JSON.parse(text.slice(start, i + 1)));
        } catch {
          return { facts: [], status: "failed" };
        }
        if (facts.length === limit) break;
        start = -1;
      }
    } else if (depth === 0 && !/[\s,\]]/.test(c)) {
      return { facts: [], status: "failed" };
    }
  }
  return {
    facts,
    status: facts.length || quoted || depth > 0 ? "truncated" : "failed",
  };
}
export function narrativeNumbers(quote: string): number[] {
  return (quote.match(/(?<![A-Za-z0-9])\d[\d,]*(?:\.\d+)?/g) ?? []).map((n) =>
    Number(n.replaceAll(",", ""))
  );
}
export function narrativeIssue(quote: string): string | null {
  if (narrativeNumbers(quote).length >= 3) return "table-row";
  if (quote.trim().split(/\s+/).length < 6) return "short-narrative";
  if (
    !/\b(?:is|are|was|were|be|been|has|have|had|will|expects?|expected|anticipates?|projects?|reached|grew|accelerated|rose|fell|increased|decreased|reported|reports|launched|launches|withdrew|withdraws|introduced|introduces|announced|announces|acquired|acquires|raised|raises|appointed|appoints|opened|closed|plans?|totalled|generated|delivered|ended|reflects|includes|represents|remains|remained|continues|continued|offers|offered|achieved|surpassed|exceeded|recorded|reduced|improved|expanded|discontinued|completed|signed|agreed|believes?|saw|added|adds|reaches|grows|totaled)\b/i
      .test(quote)
  ) return "no-narrative-verb";
  return null;
}
export function supportedPeriod(
  quote: string,
  period: string | null,
): string | null {
  if (!period) return null;
  const label = canonicalPeriod(period);
  if (!label) return null;
  const year = label.match(/\d{4}/)?.[0];
  if (!year || !quote.includes(year)) return null;
  if (/^Q[1-4]/.test(label)) {
    const q = Number(label[1]),
      ordinal = ["first", "second", "third", "fourth"][q - 1];
    if (new RegExp(`\\bQ${q}\\b|\\b${ordinal} quarter\\b`, "i").test(quote)) {
      return label;
    }
    const month = quote.match(
      /three months (?:ended|ending|to)\s+(?:\d{1,2}\s+)?(January|February|March|April|May|June|July|August|September|October|November|December)/i,
    )?.[1];
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
    return month &&
        Math.ceil((months.indexOf(month.toLowerCase()) + 1) / 3) === q
      ? label
      : null;
  }
  if (label.startsWith("9M")) {
    return /nine months (?:ended|ending|to)|9M/i.test(quote) ? label : null;
  }
  if (label.startsWith("H1")) {
    return /six months (?:ended|ending|to)|first half|H1/i.test(quote)
      ? label
      : null;
  }
  if (label.startsWith("FY")) {
    return /full year|fiscal year|year ended|\bFY\d{4}\b/i.test(quote)
      ? label
      : null;
  }
  const monthLabel = label.match(/^(\d{4})-(\d{2})$/);
  if (!monthLabel) return null;
  const monthName = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ][Number(monthLabel[2]) - 1];
  return monthName &&
      new RegExp(`\\b${monthName}\\s+${year}\\b`, "i").test(quote)
    ? label
    : null;
}

export function businessStatement(quote: string): string {
  return quote.replace(
    /[,;]?\s*[”"]?\s*said\s+[A-Z][\w'-]+(?:\s+[A-Z][\w'-]+){1,3},\s*(?:(?:our|the|company[’']s)\s+)?(?:chief [a-z ]+ officer|CEO|CFO|COO|president|co-founder|founder)(?:\s+of\s+[^.!?]+)?[.!?]?$/i,
    "",
  ).trim().replace(/^[“"]/, "");
}
export function sentenceWindow(quote: string, metric?: string): string {
  const sentences = quote.split(/(?<=[.!?])\s+(?=[A-Z“"])/);
  const matches = sentences.filter((s) =>
    metric && s.toLowerCase().includes(metric.toLowerCase()) && /\d/.test(s)
  );
  return matches.length === 1 ? matches[0] : quote;
}
