import type { Fact, ProposedFact } from "./types.ts";

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
    const parsed = JSON.parse(`{${fact.quote}}`);
    const keys = Object.keys(parsed);
    if (keys.length !== 1) return null;
    const key = keys[0], value = parsed[key];
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
