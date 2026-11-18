import { fetchExa } from "../enrich/currency.ts";
// Exact version already in the lockfile.
// deno-lint-ignore no-import-prefix
import { getDomain } from "npm:tldts@7.0.27";
import { fetchResource } from "./fetch.ts";
import { measureExcerpt, pdfContent } from "./documents.ts";
import { publicUrl, runtime, stripHtml } from "./transport.ts";
import { robotsGuard } from "./robots.ts";
import { ukDate, ukPeriod } from "./uk-parsers.ts";
import type {
  Chip,
  Company,
  Dependencies,
  FetchOutcome,
  Source,
} from "./types.ts";

/** Follow only search results and their explicit report links on the verified domain. */
export async function annualReportFallback(
  company: Company,
  chip: Chip,
  deps: Dependencies,
  filed: string,
  periodEnd: string | undefined,
  room: number,
): Promise<Source[]> {
  if (room <= 0) return [];
  const year = periodEnd?.slice(0, 4) ?? filed.slice(0, 4),
    mayFetch = robotsGuard(deps);
  const own = (value: string) => {
    try {
      return getDomain(publicUrl(value).hostname) === getDomain(company.domain);
    } catch {
      return false;
    }
  };
  const found = await Promise.all([
    fetchExa(company.name, company.domain, {
      includeDomains: [company.domain],
      query: `annual report ${year} pdf`,
      coverage: true,
    }, runtime(deps)),
    fetchExa(company.name, company.domain, {
      includeDomains: [company.domain],
      query: `annual report ${year}`,
      coverage: true,
    }, runtime(deps)),
  ]);
  const queue = [
    ...new Set(
      found.flat().flatMap((i) =>
        i.sourceUrl && own(i.sourceUrl) ? [i.sourceUrl] : []
      ),
    ),
  ];
  const seen = new Set<string>(), out: Source[] = [];
  for (
    let i = 0;
    i < queue.length && seen.size < 8 && out.length < Math.min(room, 2);
    i++
  ) {
    const url = queue[i];
    if (seen.has(url) || !own(url)) continue;
    seen.add(url);
    let outcome: FetchOutcome | undefined;
    try {
      const resource = await fetchResource(deps, url, {
        cap: 2_000_000,
        pdfCap: 12_000_000,
        timeoutMs: 15000,
        coverageRedirects: true,
        mayFetch,
      });
      outcome = resource.outcome;
      if (resource.status !== 200 || !own(resource.url)) continue;
      const isPdf = /pdf/i.test(resource.headers.get("content-type") ?? "") ||
        /\.pdf(?:[?#]|$)/i.test(resource.url);
      let text: string;
      if (isPdf) {
        const pdf = await pdfContent(resource.bytes, deps, { maxPages: 60 });
        if (pdf.scanned) {
          resource.outcome.reason = "scanned-pdf-no-text";
          continue;
        }
        text = pdf.text;
      } else {
        const raw = new TextDecoder().decode(resource.bytes);
        for (const m of raw.matchAll(/href\s*=\s*["']([^"']+)["']/gi)) {
          const link =
            new URL(m[1].replaceAll("&amp;", "&"), resource.url).href;
          if (
            own(link) && /\.pdf(?:[?#]|$)/i.test(link) && !queue.includes(link)
          ) queue.push(link);
        }
        text = stripHtml(raw);
        if (!/annual report/i.test(text) || text.length < 200) {
          resource.outcome.reason = "annual-report-discovery-page";
          continue;
        }
      }
      const period = ukPeriod(text);
      if (
        !period.documentPeriod && period.documentPeriodEnd === periodEnd &&
        /annual report/i.test(text)
      ) {
        period.documentPeriod = `FY${year}`;
      }
      const explicit = text.match(
        /(?:published|publication date|issued)\s*(?:on|:)??\s*(\d{1,2}\s+[A-Za-z]+\s+20\d{2})/i,
      )?.[1];
      const printed = explicit ? ukDate(explicit) : null;
      const matchesPeriod = !!periodEnd &&
        (period.documentPeriodEnd === periodEnd ||
          !period.documentPeriodEnd && period.documentPeriod === `FY${year}`);
      const published = printed ?? (matchesPeriod ? filed : null);
      if (!published || Date.parse(published) > deps.now().getTime()) {
        resource.outcome.reason = "annual-report-date-unconfirmed";
        continue;
      }
      const selected = new TextEncoder().encode(text).length <= 300_000
        ? { text, fragments: [text], excerpted: true as const }
        : measureExcerpt(text, chip);
      out.push({
        url: resource.url,
        title: `${company.name} annual report ${year}`,
        publisher: company.name,
        published,
        retrievedAt: deps.now().toISOString(),
        category: "filing",
        chunkExtraction: true,
        ...selected,
        ...period,
      });
      resource.outcome.kept = true;
      resource.outcome.reason = "kept-own-annual-report";
    } catch (error) {
      if (outcome) {
        outcome.reason =
          error instanceof Error && error.message === "pdf reader unavailable"
            ? error.message
            : "annual-report-processing-failed";
      }
    }
  }
  return out;
}
