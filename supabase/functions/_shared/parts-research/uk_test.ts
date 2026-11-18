// deno-lint-ignore-file require-await
import fixture from "./fixtures/uk-sources.json" with { type: "json" };
import { rnsListing, rnsTicker, ukPeriod, ukTableFacts } from "./uk-parsers.ts";
import { firstPdfPages } from "./documents.ts";
import { ukSources } from "./uk-sources.ts";
import { buildPack, validatePack } from "./pack.ts";
import { extract } from "./facts.ts";
import { identify } from "./identify.ts";
import { fetchResource } from "./fetch.ts";
import { robotsAllows } from "./robots.ts";
import type { Company, Dependencies, Source } from "./types.ts";
function assert(value: unknown): asserts value {
  if (!value) throw new Error("UK fixture assertion failed");
}
const now = () => new Date("2026-11-18T12:00:00Z");
const deps = (): Dependencies => ({
  fetch: async () => new Response(null, { status: 404 }),
  env: () => undefined,
  now,
  resolveHost: async () => ["93.184.216.34"],
  fetchOutcomes: [],
});
function company(
  name = "Auto Trader Group plc",
  domain = "autotrader.co.uk",
  id = "09439967",
): Company {
  return {
    name,
    domain,
    verified: true,
    registry: {
      authority: "Companies House",
      id,
      status: "active",
      url:
        `https://find-and-update.company-information.service.gov.uk/company/${id}`,
    },
    verifiedBy: [{
      check: "website",
      url: `https://${domain}/`,
      detail: "Matching own-site name.",
    }, {
      check: "work-email-domain",
      url: `https://${domain}/`,
      detail: "Buyer-supplied domain matches.",
    }],
  };
}
const buyer = {
  company: "Auto Trader Group plc",
  role: "Chief Financial Officer",
  useCase: "results-commentary" as const,
  useCaseLabel: "Results commentary",
};
const announcement =
  "https://www.investegate.co.uk/announcement/rns/autotrader-group-plc--auto/half-year-results/9859158";
Deno.test("UK RNS discovery, robots, entities and fiscal periods survive full pack validation", async () => {
  const d = deps();
  const requested: string[] = [];
  d.env = (k) => k === "EXA_API_KEY" ? "synthetic" : undefined;
  d.complete = async () => "[]";
  d.fetch = async (input, init) => {
    const url = String(input);
    requested.push(url);
    if (url === "https://api.exa.ai/search") {
      const body = JSON.parse(String((init as RequestInit)?.body));
      if (body.includeDomains?.[0] === "investegate.co.uk") {
        return Response.json({
          results: [{ title: "Half Year Results", url: announcement }],
        });
      }
      return Response.json({ results: [] });
    }
    if (url === "https://www.investegate.co.uk/robots.txt") {
      return new Response(fixture.robots);
    }
    if (url === "https://www.investegate.co.uk/company/AUTO") {
      return new Response(fixture.listing);
    }
    if (url === announcement) {
      return new Response(
        fixture.rns.replace(
          "</html>",
          "<!--" + "x".repeat(552000) + "--></html>",
        ),
        { headers: { "content-type": "text/html" } },
      );
    }
    return new Response(null, { status: 404 });
  };
  assert(rnsTicker(announcement, "AUTO TRADER GROUP PLC") === "AUTO");
  assert(!rnsTicker(announcement, "Mindmake"));
  assert(
    rnsListing(fixture.listing, buyer.company, now(), buyer.useCase).length ===
      1,
  );
  for (const path of ["/search-company", "/tp001", "/ui/login", "/callback"]) {
    assert(!robotsAllows(fixture.robots, path));
  }
  const { pack, evidence } = await buildPack(company(), buyer, d);
  validatePack(pack, evidence);
  const revenue = pack.facts.find((f) => f.metric === "group revenue");
  assert(
    revenue?.value === 313400000 && revenue.unit === "GBP" &&
      revenue.grade === "primary",
  );
  assert(
    revenue.period === "H1 2027" && revenue.periodStart === "2026-04-01" &&
      revenue.periodEnd === "2026-09-30",
  );
  assert(
    pack.facts.find((f) => f.metric === "group revenue growth")?.value === -1,
  );
  assert(pack.facts.some((f) => f.value === 13762 && f.period === "H1 2027"));
  assert(
    evidence.sources.some((s) =>
      s.publisher === "Investegate (RNS)" && s.published === "2026-11-05" &&
      s.text.includes("Strategy & delivery remain")
    ),
  );
  assert(
    !requested.some((u) => /search-company|tp001|transaction-in-own/.test(u)),
  );
  assert(
    ukPeriod("H1 2026 H1 2027 SIX MONTHS ENDED 30 SEPTEMBER 2026")
      .documentPeriod === "H1 2027",
  );
  const fy = {
    ...evidence.sources[0],
    text: "£m FY2026 FY2025 Group revenue 100.0 90.0",
    documentPeriod: "FY2026",
    documentPeriodStart: "2025-04-01",
    documentPeriodEnd: "2026-03-31",
  } as Source;
  assert(
    ukTableFacts(fy)[0]?.value === 100000000 &&
      ukTableFacts(fy)[0].periodType === "year",
  );
  assert(
    ukPeriod("H1 2027 SIX MONTHS ENDED 30 SEPTEMBER 2026")
      .documentPeriodStart === "2026-04-01",
  );
});
function accountsDeps(pdf: boolean) {
  const d = deps();
  const requested: { url: string; auth: string | null }[] = [];
  d.env = (k) => k === "COMPANIES_HOUSE_API_KEY" ? "synthetic" : undefined;
  d.complete = async () => "[]";
  d.fetch = async (input, init) => {
    const url = String(input);
    requested.push({
      url,
      auth: new Headers((init as RequestInit)?.headers).get("authorization"),
    });
    if (url.endsWith("/filing-history?category=accounts")) {
      return Response.json(fixture.history);
    }
    if (url.endsWith("/document/fixture-accounts")) {
      return Response.json(pdf ? fixture.pdfMetadata : fixture.xhtmlMetadata);
    }
    if (url.endsWith("/document/fixture-accounts/content")) {
      return pdf
        ? new Response(new Uint8Array(7190321), {
          headers: {
            "content-type": "application/pdf",
            "content-length": "7190321",
          },
        })
        : new Response(
          await Deno.readTextFile(
            new URL("./fixtures/uk-accounts.xhtml", import.meta.url),
          ),
          { headers: { "content-type": "application/xhtml+xml" } },
        );
    }
    return new Response(null, { status: 404 });
  };
  return { d, requested };
}
Deno.test("UK bound Companies House iXBRL retains tagged quotes, context dates and filing date", async () => {
  const { d, requested } = accountsDeps(false);
  const c = company("Monzo Bank Limited", "monzo.com", "09446231");
  const { pack, evidence } = await buildPack(
    c,
    { ...buyer, company: c.name },
    d,
  );
  validatePack(pack, evidence);
  const revenue = pack.facts.find((f) => f.metric === "turnover");
  assert(
    revenue?.value === 1234000 && revenue.source.published === "2026-08-27" &&
      revenue.grade === "primary",
  );
  assert(
    revenue.periodStart === "2025-04-01" &&
      revenue.periodEnd === "2026-03-31" &&
      revenue.quote.includes('name="uk-core:TurnoverRevenue"'),
  );
  assert(
    pack.facts.some((f) => f.value === -50000) &&
      pack.facts.some((f) => f.value === 70 && f.unit === "people"),
  );
  assert(
    requested.filter((r) => r.url.includes("document-api")).every((r) =>
      r.auth === `Basic ${btoa("synthetic:")}`
    ),
  );
});
Deno.test("UK PDF-only accounts allow 12 MB, read first 40 pages and extract in chunks", async () => {
  const { d } = accountsDeps(true);
  let pages = 0, calls = 0;
  d.extractPdf = async (bytes, options) => {
    assert(bytes.length === 7190321);
    pages = options?.maxPages ?? 0;
    return "FY2026 YEAR ENDED 31 MARCH 2026\nCash at bank was £1 million.\n" +
      "cash context ".repeat(6000);
  };
  const sources = await ukSources(
    company("Monzo Bank Limited", "monzo.com", "09446231"),
    "results-commentary",
    d,
  );
  assert(
    sources.length === 1 && sources[0].published === "2026-08-27" &&
      pages === 40,
  );
  d.complete = async (input) => {
    calls++;
    assert(JSON.parse(input.user).source.text.length <= 50000);
    return "[]";
  };
  await extract(sources, buyer, d);
  assert(calls >= 2);
  const missing = accountsDeps(true);
  missing.d.extractPdf = async () => {
    throw new Error("pdf reader unavailable");
  };
  assert(
    (await ukSources(
      company("Monzo Bank Limited", "monzo.com", "09446231"),
      "results-commentary",
      missing.d,
    )).length === 0,
  );
  assert(
    missing.d.fetchOutcomes?.some((f) => f.reason === "pdf reader unavailable"),
  );
});
Deno.test("UK document redirects strip Basic auth and reject unrelated hosts", async () => {
  for (const safe of [true, false]) {
    const d = deps();
    let second = false;
    d.fetch = async (input, init) => {
      if (String(input).includes("document-api")) {
        return new Response(null, {
          status: 302,
          headers: {
            location: safe
              ? "https://accounts.s3.eu-west-2.amazonaws.com/file.pdf"
              : "https://unrelated.example/file.pdf",
          },
        });
      }
      second = true;
      assert(!new Headers((init as RequestInit)?.headers).has("authorization"));
      return new Response("PDF");
    };
    try {
      await fetchResource(
        d,
        "https://document-api.company-information.service.gov.uk/document/fixture/content",
        {
          documentRedirects: true,
          init: { headers: { Authorization: "Basic synthetic" } },
        },
      );
      assert(safe);
    } catch {
      assert(!safe);
    }
    assert(second === safe);
  }
});
Deno.test("UK identity gives purchase probes six seconds and never binds Mindmake to Mindmaker", async () => {
  const d = deps();
  d.env = (k) => k === "COMPANIES_HOUSE_API_KEY" ? "synthetic" : undefined;
  d.fetch = async (input) =>
    String(input).includes("search/companies")
      ? Response.json({
        items: [{
          title: "MINDMAKER LTD",
          company_number: "17383946",
          company_status: "active",
        }],
      })
      : new Response("<title>Mindmake</title><p>Mindmaker Ltd in the UK.</p>");
  const result = await identify({
    company: "Mindmake",
    domain: "mindmake.co",
    workEmail: "buyer@mindmake.co",
    mode: "purchase",
  }, d);
  assert(
    result.verified && !result.verified.registry &&
      !result.verified.checks.some((c) => c.check === "companies-house"),
  );
  // Delay beyond the old per-attempt budget while remaining within the new one.
  const slow = deps();
  slow.fetch = async () => {
    await new Promise((resolve) => setTimeout(resolve, 4700));
    return new Response("<title>Monzo</title><p>Company number 09446231.</p>");
  };
  const monzo = await identify({
    company: "Monzo Bank Limited",
    domain: "monzo.com",
    workEmail: "buyer@monzo.com",
    mode: "purchase",
  }, slow);
  assert(
    monzo.verified?.checks.some((c) => c.check === "website") &&
      slow.identityProbes?.[0].outcome === "verified",
  );
});

Deno.test("UK own investor ticker fallback confirms dates and rejects mismatched embargo dates", async () => {
  for (const mismatch of [false, true]) {
    const d = deps();
    d.fetch = async (input) => {
      const url = String(input);
      if (url.endsWith("robots.txt")) {
        return new Response(null, { status: 404 });
      }
      if (url === "https://plc.autotrader.co.uk/") {
        return new Response(
          "<title>Autotrader Group PLC</title><p>LSE: AUTO</p>",
        );
      }
      if (url.endsWith("/company/AUTO")) return new Response(fixture.listing);
      if (url === announcement) {
        return new Response(
          mismatch
            ? fixture.rns.replace("5 November 2026", "6 November 2026")
            : fixture.rns,
        );
      }
      return new Response(null, { status: 404 });
    };
    const sources = await ukSources(company(), "results-commentary", d);
    assert(sources.length === (mismatch ? 0 : 1));
    if (mismatch) {
      assert(d.fetchOutcomes?.some((f) => f.reason === "rns-date-unconfirmed"));
    }
  }
});
Deno.test("UK real registration numbers bind from homepage or plc footer without waiting for unrelated legal pages", async () => {
  for (
    const [name, domain, number, homepage] of [[
      "Monzo Bank Limited",
      "monzo.com",
      "09446231",
      true,
    ], [
      "Auto Trader Group plc",
      "autotrader.co.uk",
      "09439967",
      false,
    ]] as const
  ) {
    const d = deps();
    d.env = (k) => k === "COMPANIES_HOUSE_API_KEY" ? "synthetic" : undefined;
    const requested: string[] = [];
    d.fetch = async (input) => {
      const url = String(input);
      requested.push(url);
      if (url.includes("search/companies")) {
        return Response.json({
          items: [{
            title: name.toUpperCase(),
            company_number: number,
            company_status: "active",
          }],
        });
      }
      if (url === `https://${domain}/`) {
        return new Response(
          `<title>${homepage ? "Monzo" : "Autotrader"}</title>${
            homepage ? number : ""
          }`,
        );
      }
      if (url === `https://plc.${domain}/`) {
        return new Response(
          `Registered in England with company number: ${number}.`,
        );
      }
      return new Promise<Response>(() => {});
    };
    const start = performance.now();
    const result = await identify(
      { company: name, domain, mode: "purchase" },
      d,
    );
    assert(
      result.verified?.registry?.id === number &&
        performance.now() - start < 2000,
    );
    if (homepage) assert(!requested.some((url) => url.endsWith("/legal")));
  }
});

Deno.test("UK PDF text walker stops at page 40 and releases the document", async () => {
  const pages: number[] = [];
  let cleaned = 0, destroyed = false;
  const text = await firstPdfPages({
    numPages: 195,
    getPage: async (n) => {
      pages.push(n);
      return {
        getTextContent: async () => ({ items: [{ str: `Page ${n}` }] }),
        cleanup: () => {
          cleaned++;
        },
      };
    },
    destroy: async () => {
      destroyed = true;
    },
  });
  assert(
    pages.length === 40 && pages.at(-1) === 40 && cleaned === 40 && destroyed &&
      !text.includes("Page 41"),
  );
});
