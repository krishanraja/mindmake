// deno-lint-ignore-file require-await
import fixture from "./fixtures/r21.json" with { type: "json" };
import uk from "./fixtures/uk-sources.json" with { type: "json" };
import keys from "../../../../project-documentation/research-pack-contract.keys.json" with {
  type: "json",
};
import { ALLOWED_FACT_KEYS } from "./contract.ts";
import { sentenceFacts } from "./sentences.ts";
import { verifyFacts } from "./facts.ts";
import { buildPack, validatePack } from "./pack.ts";
import { firstPdfPages } from "./documents.ts";
import { annualReportFallback } from "./annual-reports.ts";
import { measureName, quoteValue } from "./figures.ts";
import {
  type Company,
  type Dependencies,
  PART,
  type ProposedFact,
  SCHEMA,
  type Source,
} from "./types.ts";
function assert(
  value: unknown,
  message = "r21 assertion failed",
): asserts value {
  if (!value) throw new Error(message);
}
const now = () => new Date("2026-11-18T12:00:00Z");
const company: Company = {
  name: "Monzo Bank Limited",
  domain: "monzo.com",
  verified: true,
  verifiedBy: [{
    check: "website",
    url: "https://monzo.com/",
    detail: "Name matches",
  }, {
    check: "work-email-domain",
    url: "https://monzo.com/",
    detail: "Domain matches",
  }],
  registry: {
    authority: "Companies House",
    id: "09446231",
    status: "active",
    url:
      "https://find-and-update.company-information.service.gov.uk/company/09446231",
  },
};
const buyer = {
  company: company.name,
  role: "Chief Financial Officer",
  useCase: "results-commentary" as const,
  useCaseLabel: "Results commentary",
};
const deps = (): Dependencies => ({
  fetch: async () => new Response(null, { status: 404 }),
  env: () => undefined,
  now,
  resolveHost: async () => ["93.184.216.34"],
  complete: async () => "[]",
  fetchOutcomes: [],
});
function source(text: string, period = "FY2026"): Source {
  return {
    title: "Annual report",
    publisher: "Monzo",
    url: "https://monzo.com/report",
    category: "filing",
    published: "2026-08-27",
    retrievedAt: now().toISOString(),
    text,
    documentPeriod: period,
    documentPeriodStart: period.startsWith("H") ? "2026-04-01" : "2025-04-01",
    documentPeriodEnd: period.startsWith("H") ? "2026-09-30" : "2026-03-31",
  };
}
function validated(s: Source, proposals = sentenceFacts(s)) {
  const result = verifyFacts(proposals, [s], company, now());
  const pack = {
    schema: SCHEMA,
    part: PART,
    builtAt: now().toISOString(),
    company,
    buyer,
    facts: result.facts,
    prepare: [],
    notFound: [],
  };
  const evidence = {
    builtAt: pack.builtAt,
    company,
    sources: [s],
    verifiedFacts: result.facts,
    factMetadata: result.factMetadata,
    counts: {
      sourcesFetched: 1,
      factsProposed: result.factsProposed,
      factsKept: result.factsKept,
      factsDropped: result.factsDropped,
      dropped: result.dropped,
    },
  };
  validatePack(pack, evidence);
  return { pack, evidence, result };
}
Deno.test("r21 contract keys match docs and reject significance, periodSource and arbitrary extra keys", async () => {
  const doc = await Deno.readTextFile(
    new URL(
      "../../../../project-documentation/research-pack-contract.md",
      import.meta.url,
    ),
  );
  const block = doc.slice(
    doc.indexOf('"facts": ['),
    doc.indexOf('"notFound":'),
  );
  const withoutSource = block.replace(
    /"source"\s*:\s*\{[^}]+\}/,
    '"source": {}',
  );
  const base = [...withoutSource.matchAll(/"([A-Za-z]+)"\s*:/g)].map((m) =>
    m[1]
  ).filter((k) => k !== "facts");
  assert(
    JSON.stringify([...new Set(base)].sort()) ===
      JSON.stringify([...keys.fact.required].sort()),
  );
  for (const key of keys.fact.optional) {
    assert(
      new RegExp(`\\b${key}\\b`).test(doc.slice(doc.indexOf("CONTRACT v1.1"))),
    );
  }
  assert(
    JSON.stringify(ALLOWED_FACT_KEYS) ===
      JSON.stringify([...keys.fact.required, ...keys.fact.optional]),
  );
  const s = source("We will launch a new product to improve the service.");
  const proposal: ProposedFact = {
    kind: "announcement",
    quote: s.text,
    statement: s.text,
    value: null,
    unit: null,
    period: null,
    sourceUrl: s.url,
    significance: 3,
  };
  const { pack, evidence } = validated(s, [proposal]);
  assert(
    pack.facts.length === 1 && evidence.factMetadata.F1.significance === 3,
  );
  for (const f of pack.facts) {
    assert(Object.keys(f).every((k) => ALLOWED_FACT_KEYS.includes(k)));
  }
  for (const key of ["significance", "periodSource", "surprise"]) {
    const bad = structuredClone(pack);
    Object.assign(bad.facts[0], { [key]: 3 });
    let rejected = false;
    try {
      validatePack(bad, { ...evidence, verifiedFacts: bad.facts });
    } catch {
      rejected = true;
    }
    assert(rejected, key);
  }
});
Deno.test("r21 prior brackets never relabel current values and growth yields exact current, growth and prior figures", () => {
  const a = validated(source(fixture.forecourts, "H1 2027"));
  assert(a.pack.facts.length === 2, JSON.stringify(a.result.dropped));
  assert(a.pack.facts.some((f) => f.value === 13762 && f.period === "H1 2027"));
  assert(a.pack.facts.some((f) => f.value === 14080 && f.period === "H1 2026"));
  const forged = {
    ...sentenceFacts(source(fixture.forecourts, "H1 2027"))[0],
    period: "Q1 2026",
  };
  assert(
    verifyFacts(
      [forged],
      [source(fixture.forecourts, "H1 2027")],
      company,
      now(),
    ).facts.length === 0,
  );
  const b = validated(source(fixture.deposits));
  assert(b.pack.facts.length === 3, JSON.stringify(b.result.dropped));
  for (
    const [metric, value, unit, period] of [
      ["deposits", 25700000000, "GBP", "FY2026"],
      ["deposits growth", 55, "%", "FY2026"],
      ["deposits", 16600000000, "GBP", "FY2025"],
    ]
  ) {
    assert(
      b.pack.facts.some((f) =>
        f.metric === metric && f.value === value && f.unit === unit &&
        f.period === period
      ),
    );
  }
  const c = validated(source(fixture.movement, "H1 2027"));
  assert(
    c.pack.facts.length === 2 &&
      c.pack.facts.every((f) => f.kind === "reported-figure"),
  );
  assert(
    c.pack.facts.some((f) => f.value === 13600 && f.period === "at 2026-03-31"),
  );
  assert(
    c.pack.facts.some((f) => f.value === 13900 && f.period === "at 2026-09-30"),
  );
});
Deno.test("r21 noun phrases and pence retain exact measures and base GBP values", () => {
  for (const [text, metric, value] of fixture.measures) {
    const result = validated(source(String(text)));
    assert(
      result.pack.facts.length === 1,
      `${text}: ${JSON.stringify(result.result.dropped)}`,
    );
    const f = result.pack.facts[0];
    assert(
      f.metric === metric && f.value === value && f.unit === "GBP",
      JSON.stringify(f),
    );
    assert(f.quote === text);
  }
  assert(
    measureName("we are proposing an interim dividend") === "interim dividend",
  );
  assert(
    measureName(
      "this was offset by interest receivable on cash and cash equivalents",
    ) === "interest receivable on cash and cash equivalents",
  );
  for (const text of ["18.10p", "18.10 pence"]) {
    assert(quoteValue(text, "interim dividend", "GBP") === 0.181);
  }
});
const reportUrl =
  "https://monzo.com/annual-report/2026/Monzo-Annual-Report-2026.pdf";
function scannedDeps() {
  const d = deps();
  d.env = (k) =>
    ["EXA_API_KEY", "COMPANIES_HOUSE_API_KEY"].includes(k)
      ? "synthetic"
      : undefined;
  const pages: number[] = [];
  let signed = false, searches = 0;
  d.extractPdf = async (bytes, options) => {
    pages.push(options?.maxPages ?? 0);
    return bytes.length === 7190321
      ? "\n".repeat(39)
      : `FY2026 YEAR ENDED 31 MARCH 2026\n${fixture.deposits}\n` +
        " Strategic report context.".repeat(600);
  };
  d.fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://api.exa.ai/search") {
      const body = JSON.parse(String((init as RequestInit)?.body));
      if (
        body.includeDomains?.[0] === "monzo.com" &&
        body.query.includes("annual report")
      ) {
        searches++;
        return Response.json({
          results: [{
            title: "Annual report",
            url: "https://monzo.com/annual-report/2026/",
          }, {
            title: "Wrong company report",
            url: "https://other.example/report.pdf",
          }],
        });
      }
      return Response.json({ results: [] });
    }
    if (url.endsWith("/filing-history?category=accounts")) {
      return Response.json(uk.history);
    }
    if (url.endsWith("/document/fixture-accounts")) {
      return Response.json(uk.pdfMetadata);
    }
    if (url.endsWith("/document/fixture-accounts/content")) {
      return new Response(null, {
        status: 302,
        headers: { location: "https://s3.eu-west-2.amazonaws.com/report.pdf" },
      });
    }
    if (url.includes("amazonaws.com")) {
      signed = true;
      assert(!new Headers((init as RequestInit)?.headers).has("authorization"));
      return new Response(new Uint8Array(7190321), {
        headers: { "content-type": "application/pdf" },
      });
    }
    if (url === "https://monzo.com/annual-report/2026/") {
      return new Response(`<a href="${reportUrl}">Annual report</a>`);
    }
    if (url === reportUrl) {
      return new Response(new Uint8Array(8000000), {
        headers: { "content-type": "application/pdf" },
      });
    }
    assert(!url.includes("other.example"));
    return new Response(null, { status: 404 });
  };
  return { d, pages, read: () => ({ signed, searches }) };
}
Deno.test("r21 scanned CH PDF is excluded and own annual report recovers primary facts with matching-period filing date", async () => {
  const { d, pages, read } = scannedDeps();
  const { pack, evidence } = await buildPack(company, buyer, d);
  validatePack(pack, evidence);
  assert(
    read().signed && read().searches === 2 && pages.includes(40) &&
      pages.includes(60),
  );
  assert(
    evidence.fetches?.some((f) =>
      f.reason === "scanned-pdf-no-text" && !f.kept
    ),
  );
  assert(!evidence.sources.some((s) => s.url.includes("document-api")));
  assert(evidence.counts.sourcesFetched === evidence.sources.length);
  assert(
    pack.facts.some((f) =>
      f.metric === "deposits" && f.value === 25700000000 &&
      f.grade === "primary" && f.source.url === reportUrl &&
      f.source.published === "2026-08-27"
    ),
  );
  for (const f of pack.facts) {
    assert(Object.keys(f).every((k) => ALLOWED_FACT_KEYS.includes(k)));
  }
});
Deno.test("r21 annual report date never borrows unmatched accounts period and PDF walker reaches page 60", async () => {
  const { d } = scannedDeps();
  d.extractPdf = async () =>
    "FY2025 YEAR ENDED 31 MARCH 2025\n" +
    " Published business context.".repeat(600);
  assert(
    (await annualReportFallback(
      company,
      buyer.useCase,
      d,
      "2026-08-27",
      "2026-03-31",
      2,
    )).length === 0,
  );
  d.extractPdf = async () =>
    "Published on 12 June 2026\nFY2026 YEAR ENDED 31 MARCH 2026\n" +
    " Business context.".repeat(900);
  const sources = await annualReportFallback(
    company,
    buyer.useCase,
    d,
    "2026-08-27",
    "2026-03-31",
    2,
  );
  assert(sources[0]?.published === "2026-06-12");
  let last = 0, destroyed = false;
  await firstPdfPages({
    numPages: 195,
    getPage: async (n) => {
      last = n;
      return {
        getTextContent: async () => ({ items: [{ str: "text" }] }),
        cleanup: () => {},
      };
    },
    destroy: async () => {
      destroyed = true;
    },
  }, 60);
  assert(last === 60 && destroyed);
});
