import { sameCompanyName } from "../enrich/provenance.ts";
import { stripHtml } from "./transport.ts";
import type { Chip, ProposedFact, Source } from "./types.ts";

export function rnsTicker(url: string, company: string): string | null {
  try {
    const u = new URL(url);
    if (
      !/^www\.investegate\.co\.uk$|^investegate\.co\.uk$/.test(u.hostname) ||
      u.protocol !== "https:"
    ) return null;
    const m = u.pathname.match(
      /^\/announcement\/rns\/([a-z0-9-]+)--([a-z0-9.]+)\//i,
    );
    return m && sameCompanyName(m[1].replaceAll("-", " "), company)
      ? m[2].toUpperCase()
      : null;
  } catch {
    return null;
  }
}
export function ukDate(text: string): string | null {
  const m = text.match(
    /\b(\d{1,2})\s+(Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+(20\d{2})\b/i,
  );
  if (!m) return null;
  const month = [
    "jan",
    "feb",
    "mar",
    "apr",
    "may",
    "jun",
    "jul",
    "aug",
    "sep",
    "oct",
    "nov",
    "dec",
  ].indexOf(m[2].slice(0, 3).toLowerCase()) + 1;
  const value = `${m[3]}-${String(month).padStart(2, "0")}-${
    m[1].padStart(2, "0")
  }`;
  return Number.isFinite(Date.parse(value)) &&
      new Date(value).toISOString().slice(0, 10) === value
    ? value
    : null;
}
export function ukPeriod(
  text: string,
): Pick<
  Source,
  "documentPeriod" | "documentPeriodStart" | "documentPeriodEnd"
> {
  const label = text.match(/\b(H[12])\s*(20\d{2})\b|\bFY\s*(20\d{2})\b/i);
  let documentPeriod = label
    ? label[1] ? `${label[1].toUpperCase()} ${label[2]}` : `FY${label[3]}`
    : undefined;
  const columns = text.match(
    /\b(H[12]\s*20\d{2}|FY\s*20\d{2})\s+(H[12]\s*20\d{2}|FY\s*20\d{2})/i,
  );
  if (
    columns &&
    columns[1].slice(0, 2).toUpperCase() ===
      columns[2].slice(0, 2).toUpperCase()
  ) {
    const current = Number(columns[1].slice(-4)) > Number(columns[2].slice(-4))
      ? columns[1]
      : columns[2];
    documentPeriod = current.toUpperCase().startsWith("FY")
      ? current.replace(/\s/g, "").toUpperCase()
      : current.toUpperCase().replace(/(H[12])\s*/, "$1 ");
  }
  const ending = text.match(
    /\b(SIX MONTHS|YEAR|TWELVE MONTHS)\s+ENDED\s+(\d{1,2}\s+[A-Z]+\s+20\d{2})/i,
  );
  const end = ending && ukDate(ending[2]);
  if (!end) return { documentPeriod };
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() + 1);
  start.setUTCMonth(
    start.getUTCMonth() - (ending![1].toUpperCase() === "SIX MONTHS" ? 6 : 12),
  );
  return {
    documentPeriod,
    documentPeriodStart: start.toISOString().slice(0, 10),
    documentPeriodEnd: end,
  };
}
export type RnsItem = { url: string; title: string; published: string };
export function rnsListing(
  html: string,
  company: string,
  now: Date,
  chip: Chip,
): RnsItem[] {
  const cutoff = new Date(now);
  cutoff.setUTCFullYear(cutoff.getUTCFullYear() - 1);
  const items: RnsItem[] = [];
  for (
    const m of html.matchAll(
      /<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi,
    )
  ) {
    const url = new URL(m[1], "https://www.investegate.co.uk").href;
    if (!rnsTicker(url, company)) continue;
    const title = stripHtml(m[2]);
    if (
      /transaction in own shares|total voting rights|holding(?:\(s\)|s)? in company|director\/PDMR shareholding|block listing|form 8\.3|notification of major holdings/i
        .test(title)
    ) continue;
    if (
      !/results|trading update|acquis|dispos|board|director|strateg|capital markets day|appointment/i
        .test(title)
    ) continue;
    const before = html.slice(Math.max(0, m.index! - 1200), m.index!);
    const rowStart = before.lastIndexOf("<tr");
    const row = rowStart >= 0
      ? before.slice(rowStart) +
        html.slice(m.index!, html.indexOf("</tr>", m.index!) + 5)
      : before.slice(before.lastIndexOf("</a>") + 4) + m[0];
    const dates = [
      ...stripHtml(row).matchAll(/\b\d{1,2}\s+[A-Za-z]{3,9}\s+20\d{2}\b/g),
    ];
    const published = dates.length ? ukDate(dates.at(-1)![0]) : null;
    if (
      !published || Date.parse(published) < cutoff.getTime() ||
      Date.parse(published) > now.getTime()
    ) continue;
    if (!items.some((i) => i.url === url)) {
      items.push({ url, title, published });
    }
  }
  const latest = items.sort((a, b) => b.published.localeCompare(a.published))
    .slice(0, 6);
  const score = (i: RnsItem) =>
    chip === "investor-update"
      ? Number(/acquis|dispos|strateg|capital markets/i.test(i.title))
      : chip === "monthly-board-pack"
      ? Number(now.getTime() - Date.parse(i.published) < 90 * 86400000)
      : Number(/results|trading/i.test(i.title));
  return latest.sort((a, b) =>
    score(b) - score(a) || b.published.localeCompare(a.published)
  );
}
export function ukTableFacts(source: Source): ProposedFact[] {
  const result: ProposedFact[] = [];
  const header = source.text.match(
    /\b(H[12]\s*20\d{2}|FY\s*20\d{2})\s+(H[12]\s*20\d{2}|FY\s*20\d{2})(?:\s+(?:Change|YoY))?/i,
  );
  if (!header) return result;
  const label = (s: string) =>
    s.toUpperCase().startsWith("FY")
      ? s.replace(/\s/g, "").toUpperCase()
      : s.toUpperCase().replace(/(H[12])\s*/, "$1 ");
  const labels = [label(header[1]), label(header[2])];
  if (labels[0].slice(0, 2) !== labels[1].slice(0, 2)) return result;
  const current = Number(labels[0].slice(-4)) > Number(labels[1].slice(-4))
    ? 0
    : 1;
  const prefix = source.text.slice(
    Math.max(0, header.index! - 200),
    header.index! + header[0].length + 150,
  );
  const scale = /£\s*m\b|in millions/i.test(prefix)
    ? 1e6
    : /£\s*000|in thousands/i.test(prefix)
    ? 1e3
    : null;
  if (!scale) return result;
  const body = source.text.slice(
    header.index! + header[0].length,
    header.index! + 12000,
  );
  for (
    const row of body.matchAll(
      /((?:Group|Total)?\s*(?:revenue|turnover|operating profit|profit before tax|basic earnings per share|diluted earnings per share|basic EPS|diluted EPS|(?:interim )?dividend per share|adjusted EBITDA|net assets|net debt|net cash|cash at bank)(?:\s*\((?:p|pence|£)\))?)\s+(?:£\s*)?(\(?[\d,]+(?:\.\d+)?\)?)\s+(?:£\s*)?(\(?[\d,]+(?:\.\d+)?\)?)(?:\s+(\(?-?[\d.]+%\)?))?/gi,
    )
  ) {
    const metric = row[1].replace(/\s*\((?:p|pence|£)\)/gi, "").trim()
        .toLowerCase(),
      period = labels[current];
    const perShare = /per share|\beps\b/i.test(metric);
    if (perShare && !/\((?:p|pence|£)\)/i.test(row[1])) continue;
    const rowScale = perShare
      ? /\((?:p|pence)\)/i.test(row[1]) ? 0.01 : 1
      : scale;
    const parse = (s: string) =>
      Number(s.replace(/[(),%]/g, "")) * (s.startsWith("(") ? -1 : 1);
    const quote = row[0].trimStart();
    const base: ProposedFact = {
      kind: "reported-figure",
      metric,
      aliases: [],
      sourceUrl: source.url,
      quote,
      statement: `${metric} for ${period} was GBP ${
        Number((parse(row[current + 2]) * rowScale).toPrecision(15))
          .toLocaleString("en-GB")
      }.`,
      value: Number((parse(row[current + 2]) * rowScale).toPrecision(15)),
      unit: "GBP",
      period,
      periodSource: source.documentPeriod === period ? "document" : undefined,
      periodType: period.startsWith("H") ? "year-to-date" : "year",
      periodStart: source.documentPeriod === period
        ? source.documentPeriodStart ?? null
        : null,
      periodEnd: source.documentPeriod === period
        ? source.documentPeriodEnd ?? null
        : null,
    };
    result.push(base);
    if (row[4]) {
      result.push({
        ...base,
        metric: `${metric} growth`,
        value: parse(row[4]),
        unit: "%",
        statement: `${metric} growth for ${period} was ${parse(row[4])}%.`,
      });
    }
  }
  return result;
}
