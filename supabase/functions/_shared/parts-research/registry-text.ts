import type { Fact, ProposedFact, Source } from "./types.ts";

/** Extract one literal JSON member without serialising it or changing its quote bytes. */
export function jsonMember(raw: string, key: string): string | null {
  const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`"${escaped}"\\s*:\\s*\\{`).exec(raw);
  if (!match) return null;
  let depth = 1, quoted = false, escape = false;
  for (let i = match.index + match[0].length; i < raw.length; i++) {
    const char = raw[i];
    if (quoted) {
      if (escape) escape = false;
      else if (char === "\\") escape = true;
      else if (char === '"') quoted = false;
    } else if (char === '"') quoted = true;
    else if (char === "{") depth++;
    else if (char === "}" && --depth === 0) {
      return raw.slice(match.index, i + 1);
    }
  }
  return null;
}
const concepts: Record<string, string> = {
  Revenues: "Revenue",
  RevenueFromContractWithCustomerExcludingAssessedTax: "Revenue",
  SalesRevenueNet: "Revenue",
  NetIncomeLoss: "Net income",
  NumberOfEmployees: "Employees",
  EntityNumberOfEmployees: "Employees",
};
/** Narrow, deterministic phrasing for a literal register JSON quote. No model inference. */
export function registryStatement(
  fact: Pick<
    ProposedFact | Fact,
    "quote" | "kind" | "value" | "unit" | "period"
  >,
): string | null {
  try {
    const parsed = fact.quote.trimStart().startsWith("{")
      ? JSON.parse(fact.quote)
      : JSON.parse(`{${fact.quote}}`);
    if (
      fact.kind === "registry" && fact.value === null && fact.unit === null &&
      fact.period === null && parsed.type === "AA" &&
      /^\d{4}-\d{2}-\d{2}$/.test(parsed.date)
    ) return `The latest accounts were filed on ${parsed.date}.`;
    const keys = Object.keys(parsed);
    if (keys.length !== 1) return null;
    const key = keys[0], value = parsed[key];
    if (
      fact.kind === "registry" && fact.value === null && fact.unit === null &&
      fact.period === null
    ) {
      const madeUp = key === "last_accounts"
        ? value?.made_up_to ?? value?.period_end_on
        : key === "made_up_date"
        ? value
        : null;
      if (typeof madeUp === "string" && /^\d{4}-\d{2}-\d{2}$/.test(madeUp)) {
        return `The latest accounts were made up to ${madeUp}.`;
      }
      const confirmation = key === "confirmation_statement"
        ? value?.last_made_up_to
        : null;
      if (
        typeof confirmation === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(confirmation)
      ) return `The confirmation statement was made up to ${confirmation}.`;
    }
    if (
      fact.kind === "registry" && typeof value === "string" &&
      fact.value === null && fact.unit === null && fact.period === null
    ) {
      if (key === "company_status" && /^[a-z-]+$/.test(value)) {
        return `The company register lists the status as ${value}.`;
      }
      if (key === "date_of_creation" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return `The company register gives ${value} as the date of creation.`;
      }
      if (key === "date" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return `The filing history records a filing on ${value}.`;
      }
      return null;
    }
    if (
      fact.kind !== "reported-figure" || !concepts[key] ||
      fact.value === null || !fact.period ||
      !/^\d{4}-\d{2}(?:-\d{2})?$/.test(fact.period)
    ) return null;
    const employees = concepts[key] === "Employees";
    const unit = employees ? "pure" : fact.unit;
    if (
      employees ? fact.unit !== "people" : !["USD", "GBP"].includes(unit ?? "")
    ) return null;
    const rows = value?.units?.[unit!];
    if (
      !Array.isArray(rows) ||
      !rows.some((row) =>
        row.val === fact.value &&
        (row.end === fact.period || row.end?.slice(0, 7) === fact.period) &&
        /^\d{10}-\d{2}-\d{6}$/.test(row.accn)
      )
    ) return null;
    const end = rows.find((row) =>
      row.val === fact.value &&
      (row.end === fact.period || row.end?.slice(0, 7) === fact.period)
    ).end;
    return employees
      ? `Employees totalled ${fact.value} people at ${end}.`
      : `${
        concepts[key]
      } was ${unit} ${fact.value} for the period ending ${end}.`;
  } catch {
    return null;
  }
}

/** Retain the literal latest AA object, including its date/type relationship. */
export function latestAccountsQuote(raw: string): string | null {
  const start = raw.search(/"items"\s*:\s*\[/);
  if (start < 0) return null;
  const offset = raw.indexOf("[", start) + 1;
  let depth = 0, quoted = false, escape = false, begin = -1;
  const items: { text: string; date: string }[] = [];
  for (let i = offset; i < raw.length; i++) {
    const c = raw[i];
    if (quoted) {
      if (escape) escape = false;
      else if (c === "\\") escape = true;
      else if (c === '"') quoted = false;
      continue;
    }
    if (c === '"') quoted = true;
    else if (c === "{") {
      if (depth === 0) begin = i;
      depth++;
    } else if (c === "}" && --depth === 0 && begin >= 0) {
      const text = raw.slice(begin, i + 1);
      try {
        const item = JSON.parse(text);
        if (item.type === "AA" && /^\d{4}-\d{2}-\d{2}$/.test(item.date)) {
          items.push({ text, date: item.date });
        }
      } catch { /* Invalid item. */ }
    } else if (c === "]" && depth === 0) break;
  }
  return items.sort((a, b) => b.date.localeCompare(a.date))[0]?.text ?? null;
}
export function registryFacts(source: Source): ProposedFact[] {
  if (source.category !== "registry" || source.xbrl?.length) return [];
  const quotes = [...(source.fragments ?? [])];
  for (const span of source.fragments ?? []) {
    if (span.trimStart().startsWith("{")) {
      const date = span.match(/"made_up_date"\s*:\s*"\d{4}-\d{2}-\d{2}"/)?.[0];
      if (date) quotes.push(date);
    }
  }
  const facts: ProposedFact[] = [];
  for (const quote of new Set(quotes)) {
    if (/^"date"\s*:/.test(quote)) continue;
    const p: ProposedFact = {
      kind: "registry",
      quote,
      statement: "",
      value: null,
      unit: null,
      period: null,
      sourceUrl: source.url,
    };
    const statement = registryStatement(p);
    if (statement) facts.push({ ...p, statement });
  }
  return facts;
}
