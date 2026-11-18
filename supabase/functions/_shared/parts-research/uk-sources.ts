import { annualReportFallback } from "./annual-reports.ts";
import { fetchExa } from "../enrich/currency.ts";
import { companyNameInText } from "../enrich/provenance.ts";
import { fetchResource } from "./fetch.ts";
import { publicUrl, publishedDate, runtime, stripHtml } from "./transport.ts";
import { chHeaders, json } from "./registry.ts";
import { robotsGuard } from "./robots.ts";
import { measureExcerpt, pdfContent } from "./documents.ts";
import { ixbrlFacts } from "./ixbrl.ts";
import { rnsListing, rnsTicker, ukDate, ukPeriod } from "./uk-parsers.ts";
import type { Chip, Company, Dependencies, Source } from "./types.ts";

/** UK discovery never visits Investegate search/login or other disallowed paths. */
export async function ukSources(
  company: Company,
  chip: Chip,
  deps: Dependencies,
  room = 15,
): Promise<Source[]> {
  if (!company.verified || company.registry?.authority === "SEC" || room <= 0) {
    return [];
  }
  const out: Source[] = [], rt = runtime(deps), mayFetch = robotsGuard(deps);
  const search = await fetchExa(company.name, company.domain, {
    coverage: true,
    includeDomains: ["investegate.co.uk"],
    query: "regulatory announcements RNS",
    maxItems: 8,
  }, rt);
  const tickers = [
    ...new Set(search.flatMap((item) => {
      const ticker = item.sourceUrl && rnsTicker(item.sourceUrl, company.name);
      return ticker ? [ticker] : [];
    })),
  ];
  let ticker = tickers.length === 1 ? tickers[0] : null;
  if (!ticker) {
    for (
      const host of [
        `plc.${company.domain}`,
        `investors.${company.domain}`,
        company.domain,
      ]
    ) {
      try {
        const page = await fetchResource(deps, `https://${host}/`, {
          cap: 512 * 1024,
          prefix: true,
          timeoutMs: 6000,
          redirectDomain: company.domain,
          mayFetch,
        });
        const text = stripHtml(new TextDecoder().decode(page.bytes));
        const match = text.match(/\bLSE\s*:\s*([A-Z0-9.]{1,12})\b/);
        if (
          page.status === 200 && match && companyNameInText(company.name, text)
        ) {
          ticker = match[1];
          break;
        }
      } catch { /* Investor-site absence is not an issuer match. */ }
    }
  }
  if (ticker) {
    try {
      const listing = await fetchResource(
        deps,
        `https://www.investegate.co.uk/company/${encodeURIComponent(ticker)}`,
        { cap: 2_000_000, timeoutMs: 15000, mayFetch, coverageRedirects: true },
      );
      listing.outcome.reason = "rns-listing";
      if (listing.status === 200) {
        for (
          const item of rnsListing(
            new TextDecoder().decode(listing.bytes),
            company.name,
            deps.now(),
            chip,
          )
        ) {
          if (out.length >= room) break;
          try {
            const resource = await fetchResource(deps, item.url, {
              cap: 2_000_000,
              timeoutMs: 15000,
              mayFetch,
              coverageRedirects: true,
            });
            if (resource.status !== 200) continue;
            const raw = new TextDecoder().decode(resource.bytes),
              fullText = raw.split(/<\/(?:p|div|tr|table|h[1-6])>/i).map(
                stripHtml,
              ).filter(Boolean).join("\n");
            const embargo = fullText.match(
              /Embargoed until[^\n]{0,100}?(\d{1,2}\s+[A-Za-z]+\s+20\d{2})/i,
            )?.[1];
            const pageDate = embargo
              ? ukDate(embargo)
              : publishedDate(raw)?.slice(0, 10);
            const dateText = new Date(item.published).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "long",
                year: "numeric",
                timeZone: "UTC",
              },
            );
            if (
              (pageDate && pageDate !== item.published) ||
              (!pageDate && !fullText.includes(dateText))
            ) {
              resource.outcome.reason = "rns-date-unconfirmed";
              continue;
            }
            if (!rnsTicker(resource.url, company.name)) {
              resource.outcome.reason = "rns-issuer-mismatch";
              continue;
            }
            const excerpt = new TextEncoder().encode(fullText).length > 300_000
              ? measureExcerpt(fullText, chip)
              : {
                text: fullText,
                fragments: [fullText],
                excerpted: true as const,
              };
            out.push({
              url: item.url,
              title: item.title,
              publisher: "Investegate (RNS)",
              published: item.published,
              retrievedAt: deps.now().toISOString(),
              category: "filing",
              ...excerpt,
              ...ukPeriod(fullText),
            });
            resource.outcome.kept = true;
            resource.outcome.reason = "kept-rns";
          } catch { /* Fetch receipt retains the failure. */ }
        }
      }
    } catch { /* Listing failure leaves other sources available. */ }
  }
  if (company.registry?.authority === "Companies House" && out.length < room) {
    const number = company.registry.id, headers = chHeaders(rt);
    if (headers) {
      const history = await json(
        rt,
        `https://api.company-information.service.gov.uk/company/${number}/filing-history?category=accounts`,
        headers,
        15000,
      );
      const items = (Array.isArray(history?.items) ? history.items : []) as {
        type?: string;
        date?: string;
        links?: { document_metadata?: string };
        description_values?: { made_up_date?: string };
      }[];
      const latest = items.filter((i) =>
        i.type === "AA" && i.date && /^\d{4}-\d{2}-\d{2}$/.test(i.date) &&
        Date.parse(i.date) <= deps.now().getTime()
      ).sort((a, b) =>
        b.date!.localeCompare(a.date!)
      )[0];
      if (latest?.links?.document_metadata) {
        try {
          const metaUrl = publicUrl(latest.links.document_metadata);
          if (
            metaUrl.hostname !==
              "document-api.company-information.service.gov.uk" ||
            !/^\/document\/[a-z0-9_-]+$/i.test(metaUrl.pathname)
          ) return out;
          const metadata = await json(rt, metaUrl.href, headers, 15000);
          const resources = metadata?.resources as
            | Record<string, number | { content_length?: number }>
            | undefined;
          const mime =
            resources && Object.hasOwn(resources, "application/xhtml+xml")
              ? "application/xhtml+xml"
              : resources && Object.hasOwn(resources, "application/pdf")
              ? "application/pdf"
              : null;
          if (!mime) return out;
          const size = resources![mime],
            length = typeof size === "number" ? size : size?.content_length;
          if (length && length > 12_000_000) return out;
          const url = metaUrl.href + "/content";
          const response = await fetchResource(deps, url, {
            cap: 12_000_000,
            pdfCap: 12_000_000,
            timeoutMs: 15000,
            init: { headers: { ...headers, Accept: mime } },
            documentRedirects: true,
          });
          if (response.status !== 200) return out;
          try {
            const common = {
              url,
              title: `${company.name} accounts`,
              publisher: "Companies House",
              published: latest.date!,
              retrievedAt: deps.now().toISOString(),
              registryCompanyNumber: number,
            };
            if (mime === "application/xhtml+xml") {
              const parsed = ixbrlFacts(
                new TextDecoder().decode(response.bytes),
                latest.date!,
              );
              if (parsed.xbrl.length) {
                out.push({
                  ...common,
                  ...parsed,
                  category: "registry",
                  excerpted: true,
                });
              }
            } else {
              const pdf = await pdfContent(response.bytes, deps, {
                maxPages: 40,
                pageCount: typeof metadata?.pages === "number"
                  ? metadata.pages
                  : undefined,
              });
              if (pdf.scanned) {
                response.outcome.reason = "scanned-pdf-no-text";
                out.push(
                  ...await annualReportFallback(
                    company,
                    chip,
                    deps,
                    latest.date!,
                    latest.description_values?.made_up_date,
                    room - out.length,
                  ),
                );
                return out;
              }
              const text = pdf.text;
              const selected = new TextEncoder().encode(text).length <= 300_000
                ? { text, fragments: [text], excerpted: true as const }
                : measureExcerpt(text, chip);
              if (selected.text) {
                out.push({
                  ...common,
                  ...selected,
                  ...ukPeriod(text),
                  category: "filing",
                  chunkExtraction: true,
                });
              }
            }
            response.outcome.kept = out.some((s) => s.url === url);
            response.outcome.reason = response.outcome.kept
              ? "kept-accounts"
              : "accounts-no-retained-text";
          } catch (error) {
            response.outcome.reason = error instanceof Error &&
                error.message === "pdf reader unavailable"
              ? error.message
              : "accounts-processing-failed";
          }
        } catch {
          /* No account data is inferred from failed metadata/content. */
        }
      }
    }
  }
  return out;
}
