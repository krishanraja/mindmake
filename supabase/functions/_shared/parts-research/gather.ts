import { exhibitUrls } from "./exhibits.ts";
import { fetchResource, isSec, receiptUrl } from "./fetch.ts";
import { filingText, measureExcerpt, pdfText } from "./documents.ts";
import { robotsGuard } from "./robots.ts";
import { xbrlExcerpt } from "./xbrl.ts";
import { fetchCurrency } from "../enrich/currency.ts";
import { companyNameInText, evidenceHostname } from "../enrich/provenance.ts";
import {
  filingNamesDomain,
  registryUrls,
  secFilingCandidate,
  secHeaders,
} from "./registry.ts";
import { publicUrl, publishedDate, runtime, stripHtml } from "./transport.ts";
import {
  type Chip,
  type Company,
  type Dependencies,
  MAX_FILING_BYTES,
  MAX_SOURCE_BYTES,
  type Source,
} from "./types.ts";
import { independentChecks } from "./identify.ts";

export function ownDomain(company: Company, url: string): boolean {
  const host = evidenceHostname(url);
  return !!host &&
    (host === company.domain || host.endsWith(`.${company.domain}`));
}
export function registrySource(company: Company, url: string): boolean {
  const r = company.registry;
  if (!r) return false;
  const u = new URL(url);
  return r.authority === "Companies House"
    ? [
      "api.company-information.service.gov.uk",
      "find-and-update.company-information.service.gov.uk",
    ].includes(u.hostname) && u.pathname.startsWith(`/company/${r.id}`) &&
      /^(?:\/officers|\/filing-history)?$/.test(
        u.pathname.slice(`/company/${r.id}`.length),
      )
    : (u.hostname === "data.sec.gov" &&
      [`/submissions/CIK${r.id}.json`, `/api/xbrl/companyfacts/CIK${r.id}.json`]
        .includes(u.pathname)) ||
      (u.hostname === "www.sec.gov" &&
        u.pathname.startsWith(`/Archives/edgar/data/${Number(r.id)}/`));
}
export function priority(source: Source, chip: Chip, now: Date): number {
  const recent = source.published &&
    now.getTime() - Date.parse(source.published) <= 90 * 86400000;
  const figure = /revenue|income|results|earnings|cash|debt|employees/i.test(
    source.title + " " + source.text.slice(0, 1000),
  );
  return (chip === "monthly-board-pack" && recent ? 100 : 0) +
    ((chip === "results-commentary" || chip === "lender-update") && figure
      ? 80
      : 0) +
    (chip === "investor-update" &&
        /funding|investment|announc/i.test(
          source.title + " " + source.text.slice(0, 1000),
        )
      ? 80
      : 0);
}
export async function gather(
  company: Company,
  chip: Chip,
  deps: Dependencies,
): Promise<Source[]> {
  if (!company.verified || !independentChecks({ checks: company.verifiedBy })) {
    return [];
  }
  const rt = runtime(deps, undefined, company.domain);
  const mayFetch = robotsGuard(deps);
  const now = deps.now();
  const from = new Date(now);
  from.setUTCFullYear(from.getUTCFullYear() - 1);
  const sources: Source[] = deps.gatheredSources ?? [];
  const seen = new Set<string>();
  let attempts = 0;

  const filingLinks: string[] = [];
  const releaseIndexes = new Set<string>();
  const releaseForms = new Set<string>();
  const filingDates = new Map<string, string>();
  async function page(
    url: string,
    category: Source["category"],
    headers?: HeadersInit,
    title?: string,
  ): Promise<void> {
    if (attempts >= 15 || seen.has(url)) {
      deps.fetchOutcomes?.push({
        url: receiptUrl(url),
        status: null,
        bytes: 0,
        kept: false,
        reason: seen.has(url) ? "duplicate-url" : "source-cap",
      });
      return;
    }
    try {
      publicUrl(url);
    } catch {
      return;
    }
    seen.add(url);
    attempts++;
    let outcome: import("./types.ts").FetchOutcome | undefined;
    try {
      const sec = isSec(new URL(url).hostname);
      const resource = await fetchResource(deps, url, {
        init: { headers },
        cap: sec ? MAX_FILING_BYTES : undefined,
        redirectDomain: ownDomain(company, url) ? company.domain : undefined,
        coverageRedirects: !ownDomain(company, url),
        mayFetch: category === "registry" ? undefined : mayFetch,
      });
      outcome = resource.outcome;
      if (resource.status < 200 || resource.status >= 300) return;
      url = resource.url;
      const pdf =
        /application\/pdf/i.test(resource.headers.get("content-type") ?? "") ||
        /\.pdf(?:[?#]|$)/i.test(url) ||
        new TextDecoder().decode(resource.bytes.subarray(0, 5)) === "%PDF-";
      const raw = pdf
        ? await pdfText(resource.bytes, deps)
        : new TextDecoder("utf-8", { fatal: true }).decode(resource.bytes);
      const html = !pdf &&
        (/html/i.test(resource.headers.get("content-type") ?? "") ||
          /^\s*</.test(raw));
      let text = html ? stripHtml(raw) : raw;
      let fragments: string[] | undefined;
      let excerpted = false;
      let xbrl: Source["xbrl"];
      if (category === "filing" || pdf) {
        const selected = pdf
          ? measureExcerpt(text, chip)
          : filingText(raw, chip);
        text = selected.text;
        fragments = selected.fragments;
        excerpted = true;
      }
      if (text.trim().length < 30) {
        outcome.reason = "insufficient-text";
        return;
      }
      outcome.reason = "source-not-admitted";
      if (
        category === "coverage" &&
        !companyNameInText(company.name, text)
      ) {
        outcome.reason = "company-name-absent";
        return;
      }
      if (category === "coverage") {
        const linkedDomain = [...raw.matchAll(/https?:\/\/[^\s"'<>]+/gi)].some((
          match,
        ) => ownDomain(company, match[0]));
        if (
          !linkedDomain &&
          !text.toLowerCase().includes(company.domain.toLowerCase())
        ) {
          outcome.reason = "company-domain-absent";
          return;
        }
      }
      if (category === "registry") {
        const data = JSON.parse(raw);
        if (url.endsWith("/officers")) {
          // Do not expose registry officer names, addresses, dates of birth or nationalities.
          fragments = (Array.isArray(data.items) ? data.items : []).flatMap((
            item: Record<string, unknown>,
          ) =>
            ["officer_role", "appointed_on", "resigned_on"].flatMap((key) => {
              const match = raw.match(
                new RegExp(
                  `"${key}"\\s*:\\s*"${
                    String(item[key] ?? "").replace(
                      /[.*+?^${}()|[\]\\]/g,
                      "\\$&",
                    )
                  }"`,
                ),
              );
              return item[key] && match ? [match[0]] : [];
            })
          );
          text = fragments!.join("\n");
        } else if (url.includes("companyfacts")) {
          const selected = xbrlExcerpt(raw, from);
          text = selected.text;
          fragments = selected.fragments;
          xbrl = selected.xbrl;
          excerpted = true;
        } else if (url.includes("/submissions/")) {
          const recent = data.filings?.recent;
          if (recent && company.registry) {
            for (
              let i = 0;
              i < Math.min(recent.accessionNumber?.length ?? 0, 12);
              i++
            ) {
              if (Date.parse(recent.filingDate?.[i]) < from.getTime()) continue;
              const accn = recent.accessionNumber[i];
              if (
                /^\d{10}-\d{2}-\d{6}$/.test(accn) &&
                /^\d{4}-\d{2}-\d{2}$/.test(recent.filingDate?.[i])
              ) filingDates.set(accn.replaceAll("-", ""), recent.filingDate[i]);
              if (
                ["8-K", "6-K"].includes(recent.form?.[i]) &&
                /^\d{10}-\d{2}-\d{6}$/.test(accn) &&
                !releaseForms.has(recent.form[i])
              ) {
                releaseForms.add(recent.form[i]);
                releaseIndexes.add(
                  `https://www.sec.gov/Archives/edgar/data/${
                    Number(company.registry.id)
                  }/${accn.replaceAll("-", "")}/${accn}-index.html`,
                );
              }
              const document = recent.primaryDocument?.[i];
              if (
                /^\d{10}-\d{2}-\d{6}$/.test(accn) &&
                typeof document === "string" &&
                /^[a-z0-9][a-z0-9_.-]*\.html?$/i.test(document)
              ) {
                filingLinks.push(
                  `https://www.sec.gov/Archives/edgar/data/${
                    Number(company.registry.id)
                  }/${accn.replaceAll("-", "")}/${document}`,
                );
              }
            }
          }
          // Submission records may contain mailing addresses. Keep only literal filing dates/forms.
          fragments = raw.match(/"(?:filingDate|form)"\s*:\s*\[[^\]]*\]/g) ??
            [];
          text = fragments.join("\n");
        } else {
          // Register profiles/history retain only literal corporate fields, never officer biographies.
          fragments = raw.match(
            /"(?:company_name|company_number|company_status|date_of_creation|date|type|description)"\s*:\s*"[^"\n]*"/g,
          ) ?? [];
          text = fragments.join("\n");
        }
      }
      if (!text.trim()) {
        outcome.reason = "no-retained-text";
        return;
      }
      const accession = url.match(/\/Archives\/edgar\/data\/\d+\/(\d+)\//)?.[1];
      const published = accession
        ? filingDates.get(accession) ?? null
        : html
        ? publishedDate(raw)
        : null;
      const periodMatch = stripHtml(raw).match(
        /(?:Q([1-4])(?:\s*FY)?|(?:first|second|third|fourth) quarter)(?:\s+of)?\s*(20\d{2})/i,
      );
      const documentPeriod = periodMatch
        ? `Q${
          periodMatch[1] ??
            ({ first: 1, second: 2, third: 3, fourth: 4 } as Record<
              string,
              number
            >)[periodMatch[0].split(" ")[0].toLowerCase()]
        } ${periodMatch[2]}`
        : undefined;
      if (category === "coverage" && !published) {
        outcome.reason = "publication-date-absent";
        return;
      }
      if (
        published &&
        (Date.parse(published) > now.getTime() ||
          category === "coverage" && Date.parse(published) < from.getTime())
      ) {
        outcome.reason = "source-date-outside-window";
        return;
      }
      if (new TextEncoder().encode(text).length > MAX_SOURCE_BYTES) {
        outcome.reason = "retained-text-cap";
        return;
      }
      if (performance.now() >= (deps.deadline ?? Infinity)) {
        outcome.reason = "build-budget-exhausted";
        return;
      }
      sources.push({
        title: title ??
          stripHtml(
            raw.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ??
              new URL(url).hostname,
          ),
        publisher: new URL(url).hostname,
        url,
        published,
        ...(documentPeriod ? { documentPeriod } : {}),
        retrievedAt: deps.now().toISOString(),
        text,
        category,
        ...(fragments ? { fragments } : {}),
        ...(excerpted ? { excerpted: true } : {}),
        ...(xbrl ? { xbrl } : {}),
      });
      outcome.kept = true;
      outcome.reason = excerpted ? "kept-excerpt" : "kept";
    } catch (error) {
      if (outcome) {
        outcome.reason =
          error instanceof Error && error.message === "pdf reader unavailable"
            ? "pdf reader unavailable"
            : "document-processing-failed";
      }
    }
  }

  const query = chip === "monthly-board-pack"
    ? "announcements and results, prioritise the last 90 days"
    : chip === "investor-update"
    ? "funding and company announcements"
    : "reported revenue net income employees results and financing";
  const discovery = fetchCurrency(company.name, company.domain, {
    runtime: rt,
    coverage: true,
    from: from.toISOString(),
    to: now.toISOString(),
    query,
    maxItems: 12,
  });
  const binding = await secFilingCandidate(company, rt);
  if (binding) {
    try {
      const scan = await fetchResource(deps, binding.url, {
        cap: MAX_FILING_BYTES,
        scan: (text) => filingNamesDomain(text, company.domain),
        mayFetch,
      });
      if (scan.matched) {
        company.registry = binding.hit.registry;
        company.verifiedBy.push({
          check: "sec-edgar",
          detail:
            "The uniquely matching issuer's latest annual or quarterly filing names this company domain.",
          url: scan.url,
        });
        filingLinks.unshift(binding.url);
      }
    } catch { /* Binding failed; its outcome is retained by transport. */ }
  }
  if (company.registry) {
    await Promise.all(
      registryUrls(company.registry, rt).map((item) =>
        page(item.url, "registry", item.headers, item.title)
      ),
    );
  }
  for (const index of releaseIndexes) {
    try {
      const response = await fetchResource(deps, index, {
        cap: 200000,
        mayFetch,
      });
      if (response.status === 200) {
        const links = exhibitUrls(
          new TextDecoder().decode(response.bytes),
          index,
        );
        response.outcome.reason = links.length
          ? "exhibit-links-discovered"
          : "no-release-exhibit";
        filingLinks.unshift(...links);
      }
    } catch { /* Index outcome is retained. */ }
  }
  await page(`https://${company.domain}/`, "website");
  const currency = await discovery;
  const coverage = [...(currency?.currency ?? [])].sort((a, b) =>
    (Date.parse(b.date ?? "") || 0) - (Date.parse(a.date ?? "") || 0)
  );
  // Provider snippets locate URLs only. Every accepted source is fetched independently.
  const urls = [
    ...new Set([
      ...filingLinks,
      ...coverage.map((item) => item.sourceUrl).filter((s): s is string => !!s),
    ]),
  ];
  for (const url of urls) {
    await page(
      url,
      registrySource(company, url)
        ? "filing"
        : ownDomain(company, url)
        ? "website"
        : "coverage",
      registrySource(company, url) ? secHeaders(rt) ?? undefined : undefined,
    );
  }
  return sources.sort((a, b) =>
    Number(!!b.xbrl?.length) - Number(!!a.xbrl?.length) ||
    priority(b, chip, now) - priority(a, chip, now)
  );
}
