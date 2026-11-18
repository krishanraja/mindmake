import { ukTableFacts } from "./uk-parsers.ts";
import { sentenceFacts } from "./sentences.ts";
import type { ProposedFact, Source } from "./types.ts";

/** Conservative two-period KPI grammar. Unrecognised layouts produce no facts. */
export function tableFacts(source: Source): ProposedFact[] {
  if (source.category === "coverage" || source.category === "registry") {
    return [];
  }
  const facts: ProposedFact[] = ukTableFacts(source);
  const headers = [
    ...source.text.matchAll(
      /Q([1-4])\s+(20\d{2})\s+Q([1-4])\s+(20\d{2})\s+YoY/gi,
    ),
  ];
  for (const [i, header] of headers.entries()) {
    if (
      header[1] !== header[3] || Number(header[4]) !== Number(header[2]) + 1
    ) continue;
    const start = header.index! + header[0].length;
    const note = source.text.slice(
      Math.max(0, header.index! - 150),
      start + 100,
    );
    const scale = /in millions/i.test(note)
      ? 1e6
      : /in thousands/i.test(note)
      ? 1e3
      : /\$/.test(note)
      ? 1
      : null;
    if (!scale) continue;
    const body = source.text.slice(
      start,
      Math.min(headers[i + 1]?.index ?? Infinity, start + 8000),
    );
    const row =
      /((?:daily active users|monthly active users|paid subscribers|total bookings|subscription bookings|revenue)(?:\s*\((?:DAUs|MAUs|period end|\d+)\))*)\s+(\$\s*)?([\d,]+(?:\.\d+)?)\s+(\$\s*)?([\d,]+(?:\.\d+)?)(?:\s+([+-]?[\d.]+)%)/gi;
    for (const match of body.matchAll(row)) {
      const metric = match[1].replace(/\s*\([^)]*\)/g, "").toLowerCase();
      const aliases = [...match[1].matchAll(/\((DAUs|MAUs)\)/gi)].map((m) =>
        m[1].toLowerCase()
      );
      const period = `Q${header[3]} ${header[4]}`;
      const unit = match[2] || match[4]
        ? "USD"
        : /users|subscribers/.test(metric)
        ? "people"
        : null;
      const currentQuote = match[0].slice(0, match[0].lastIndexOf(match[6]))
        .trimEnd();
      for (const growth of [false, true]) {
        const value = Number(
          (Number((growth ? match[6] : match[5]).replaceAll(",", "")) *
            (growth ? 1 : scale)).toPrecision(15),
        );
        const name = metric + (growth ? " growth" : "");
        facts.push({
          kind: "reported-figure",
          sourceUrl: source.url,
          metric: name,
          aliases: growth ? [] : aliases,
          quote: growth ? match[0] : currentQuote,
          statement: `${name} for ${period} was ${
            value.toLocaleString("en-GB")
          }${growth ? "% year over year" : unit ? ` ${unit}` : ""}.`,
          value,
          unit: growth ? "%" : unit,
          period,
          periodType: "quarter",
          periodStart: null,
          periodEnd: null,
        });
      }
    }
  }
  return facts;
}
export function tableMatch(
  source: Source | undefined,
  fact: Partial<ProposedFact>,
): ProposedFact | undefined {
  return source &&
    [...tableFacts(source), ...sentenceFacts(source)].find((row) =>
      ["quote", "statement", "metric", "value", "unit", "period"].every((key) =>
        row[key as keyof ProposedFact] === fact[key as keyof ProposedFact]
      )
    );
}
