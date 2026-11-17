import type { EnrichRuntime } from "../enrich/runtime.ts";
import { evidenceHostname, sameCompanyName } from "../enrich/provenance.ts";
import type { Company, Registry } from "./types.ts";

export type RegistryHit = { name: string; domain: string; registry: Registry };
export function secHeaders(rt: EnrichRuntime): HeadersInit | null {
  const contact = rt.env("SEC_CONTACT_EMAIL");
  return contact && /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/.test(contact)
    ? {
      "User-Agent": `Mindmake parts research <${contact}>`,
      Accept: "application/json",
    }
    : null;
}
export function chHeaders(rt: EnrichRuntime): HeadersInit | null {
  const key = rt.env("COMPANIES_HOUSE_API_KEY");
  return key
    ? { Authorization: `Basic ${btoa(`${key}:`)}`, Accept: "application/json" }
    : null;
}
export async function json(
  rt: EnrichRuntime,
  url: string,
  headers: HeadersInit,
  ms = 6000,
): Promise<Record<string, unknown> | null> {
  try {
    const res = await rt.request(url, { headers }, ms);
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
}
const tickerCache = new WeakMap<
  object,
  { at: number; data: Record<string, unknown> }
>();
async function tickers(rt: EnrichRuntime, headers: HeadersInit) {
  const key = rt.cacheKey ?? rt;
  const cached = tickerCache.get(key);
  if (cached && Date.now() - cached.at < 24 * 60 * 60 * 1000) {
    return cached.data;
  }
  const data = await json(
    rt,
    "https://www.sec.gov/files/company_tickers.json",
    headers,
    9000,
  );
  if (
    data &&
    Object.values(data).some((v) =>
      v && typeof v === "object" && "cik_str" in v && "title" in v
    )
  ) tickerCache.set(key, { at: Date.now(), data });
  return data;
}
export async function searchRegistries(
  company: string,
  rt: EnrichRuntime,
): Promise<RegistryHit[]> {
  const ch = chHeaders(rt);
  const sec = secHeaders(rt);
  const uk = async (): Promise<RegistryHit[]> => {
    if (!ch) return [];
    const searchUrl =
      `https://api.company-information.service.gov.uk/search/companies?q=${
        encodeURIComponent(company)
      }&items_per_page=10`;
    let data = await json(rt, searchUrl, ch, 4000);
    if (!data) data = await json(rt, searchUrl, ch, 4000);
    const items = Array.isArray(data?.items) ? data.items : [];
    return items.filter((i) =>
      typeof i.title === "string" && /^[A-Z0-9]{8}$/i.test(i.company_number)
    ).map((i) => ({
      name: i.title,
      domain: "",
      registry: {
        authority: "Companies House",
        id: i.company_number,
        status: String(i.company_status ?? "unknown"),
        url:
          `https://find-and-update.company-information.service.gov.uk/company/${i.company_number}`,
      },
    }));
  };
  const us = async (): Promise<RegistryHit[]> => {
    if (!sec) return [];
    const data = await tickers(rt, sec);
    return Object.values(data ?? {}).filter((
      v,
    ): v is { title: string; cik_str: number } =>
      !!v && typeof v === "object" && "title" in v &&
      typeof v.title === "string" && "cik_str" in v &&
      typeof v.cik_str === "number" &&
      (sameCompanyName(company, v.title) ||
        v.title.toLowerCase().includes(company.toLowerCase()))
    )
      .slice(0, 10).map((i) => ({
        name: i.title,
        domain: "",
        registry: {
          authority: "SEC",
          id: String(i.cik_str).padStart(10, "0"),
          status: "listed in SEC company tickers",
          url: `https://www.sec.gov/edgar/browse/?CIK=${i.cik_str}`,
        },
      }));
  };
  const lists = await Promise.all([uk(), us()]);
  return lists.flat();
}
export async function registryDomain(
  hit: RegistryHit,
  rt: EnrichRuntime,
): Promise<RegistryHit> {
  if (hit.registry.authority !== "SEC") return hit;
  const headers = secHeaders(rt);
  if (!headers) return hit;
  const data = await json(
    rt,
    `https://data.sec.gov/submissions/CIK${hit.registry.id}.json`,
    headers,
    800,
  );
  const domain = evidenceHostname(data?.website) ??
    evidenceHostname(data?.investorWebsite)?.replace(/^investors?\./, "");
  // An issuer's name and its own website must agree before a domain is bound.
  return data && typeof data.name === "string" &&
      sameCompanyName(hit.name, data.name) && domain
    ? { ...hit, domain }
    : hit;
}
export function registryUrls(
  registry: Registry,
  rt: EnrichRuntime,
): { url: string; headers: HeadersInit; title: string }[] {
  if (
    registry.authority === "Companies House" &&
    /^[A-Z0-9]{8}$/i.test(registry.id)
  ) {
    const headers = chHeaders(rt);
    if (!headers) return [];
    const base =
      `https://api.company-information.service.gov.uk/company/${registry.id}`;
    return [{ url: base, headers, title: "Company register profile" }, {
      url: `${base}/officers`,
      headers,
      title: "Officer register roles and dates",
    }, {
      url: `${base}/filing-history`,
      headers,
      title: "Filing history dates",
    }];
  }
  const headers = secHeaders(rt);
  return headers && /^\d{10}$/.test(registry.id)
    ? [
      {
        url: `https://data.sec.gov/submissions/CIK${registry.id}.json`,
        headers,
        title: "SEC submissions",
      },
      {
        url:
          `https://data.sec.gov/api/xbrl/companyfacts/CIK${registry.id}.json`,
        headers,
        title: "SEC company facts",
      },
    ]
    : [];
}

/** Slow filing lookup belongs only to gather, after website identity is verified. */
export async function secFilingCandidate(
  company: Company,
  rt: EnrichRuntime,
  allowEmail = false,
): Promise<
  {
    hit: RegistryHit;
    url: string;
    releaseIndex?: string;
  } | null
> {
  if (
    company.registry ||
    !company.verifiedBy.some((c) =>
      c.check === "website" || allowEmail && c.check === "work-email-domain"
    )
  ) return null;
  const headers = secHeaders(rt);
  if (!headers) return null;
  const hits = (await searchRegistries(company.name, rt)).filter((hit) =>
    hit.registry.authority === "SEC" && sameCompanyName(company.name, hit.name)
  );
  if (hits.length !== 1) return null;
  const hit = hits[0];
  const data = await json(
    rt,
    `https://data.sec.gov/submissions/CIK${hit.registry.id}.json`,
    headers,
  );
  if (
    !data || typeof data.name !== "string" ||
    !sameCompanyName(company.name, data.name) ||
    evidenceHostname(data.website) || evidenceHostname(data.investorWebsite)
  ) return null;
  const filings = data.filings as
    | { recent?: Record<string, unknown[]> }
    | undefined;
  const recent = filings?.recent;
  if (!recent || !Array.isArray(recent.form)) return null;
  const eligible = recent.form.flatMap((form, i) => {
    const accession = recent.accessionNumber?.[i],
      document = recent.primaryDocument?.[i],
      date = recent.filingDate?.[i];
    return (form === "10-K" || form === "10-Q") &&
        typeof accession === "string" &&
        /^\d{10}-\d{2}-\d{6}$/.test(accession) &&
        typeof document === "string" &&
        /^[a-z0-9][a-z0-9_.-]*\.html?$/i.test(document) &&
        typeof date === "string" &&
        /^\d{4}-\d{2}-\d{2}$/.test(date) && Number.isFinite(Date.parse(date))
      ? [{ accession, document, date }]
      : [];
  }).sort((a, b) => b.date.localeCompare(a.date));
  const latest = eligible[0];
  const release = recent.form.findIndex((f) => f === "8-K" || f === "6-K");
  const accession = recent.accessionNumber?.[release];
  const releaseIndex =
    typeof accession === "string" && /^\d{10}-\d{2}-\d{6}$/.test(accession)
      ? `https://www.sec.gov/Archives/edgar/data/${Number(hit.registry.id)}/${
        accession.replaceAll("-", "")
      }/${accession}-index.html`
      : undefined;
  return latest
    ? {
      hit,
      releaseIndex,
      url: `https://www.sec.gov/Archives/edgar/data/${
        Number(hit.registry.id)
      }/${latest.accession.replaceAll("-", "")}/${latest.document}`,
    }
    : null;
}

export function filingNamesDomain(text: string, domain: string): boolean {
  const escaped = domain.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  // Literal host boundaries reject notduolingo.com and duolingo.com.evil.example.
  return new RegExp(
    `(?:^|[^a-z0-9_.@-])(?:www\\.)?${escaped}(?=$|[^a-z0-9_.-]|[.](?:[\\s<]|$))`,
    "i",
  ).test(text);
}
