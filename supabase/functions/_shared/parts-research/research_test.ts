// Async fixtures implement the same Promise interface as real network clients.
// deno-lint-ignore-file require-await
import fixture from "./fixtures/research.json" with { type: "json" };
import { asCompany, identify } from "./identify.ts";
import { buildPack, validatePack } from "./pack.ts";
import { extract, prepare, verifyFacts } from "./facts.ts";
import { gather, priority } from "./gather.ts";
import { jsonMember } from "./registry-text.ts";
import { entryBytes, personaliseBundle, readZip } from "./bundle.ts";
import { publicUrl, readCapped, runtime } from "./transport.ts";
import { completeText } from "../enrich/llm.ts";
import { fetchCurrency } from "../enrich/currency.ts";
import { assembleIdentityDepth } from "../enrich/orchestrate.ts";
import {
  type Buyer,
  CHIPS,
  type Company,
  type Dependencies,
  type Evidence,
  type Pack,
  type Source,
} from "./types.ts";
import { run as runResearch } from "../../../../scripts/parts/research-run.ts";
import { run as runBundle } from "../../../../scripts/parts/personalise-bundle.ts";

function assert(value: unknown, message = "Assertion failed"): asserts value {
  if (!value) throw new Error(message);
}
function equal(a: unknown, b: unknown) {
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    `Different: ${JSON.stringify(a)} != ${JSON.stringify(b)}`,
  );
}
function rejects(fn: () => unknown) {
  let failed = false;
  try {
    fn();
  } catch {
    failed = true;
  }
  assert(failed, "Expected rejection");
}
async function rejectsAsync(fn: () => Promise<unknown>) {
  let failed = false;
  try {
    await fn();
  } catch {
    failed = true;
  }
  assert(failed, "Expected rejection");
}
const company = fixture.company as Company, source = fixture.source as Source;
const buyer: Buyer = {
  company: "Acme",
  role: "Finance director",
  useCase: "monthly-board-pack",
  useCaseLabel: CHIPS["monthly-board-pack"],
};
const now = () => new Date(fixture.now);
const response = (value: unknown) =>
  new Response(typeof value === "string" ? value : JSON.stringify(value), {
    headers: {
      "content-type": typeof value === "string"
        ? "text/html"
        : "application/json",
    },
  });
function dependencies(
  options: {
    ambiguous?: boolean;
    noWebsite?: boolean;
    registry?: "uk" | "us";
    coverage?: boolean;
  } = {},
) {
  const calls: { url: string; init?: RequestInit }[] = [];
  const deps: Dependencies = {
    now,
    env: (key) =>
      (key === "BRANDFETCH_API_KEY" || key === "EXA_API_KEY")
        ? "synthetic-brand"
        : options.registry === "uk" && key === "COMPANIES_HOUSE_API_KEY"
        ? "synthetic-register"
        : options.registry === "us" && key === "SEC_CONTACT_EMAIL"
        ? "tests@example.invalid"
        : options.coverage &&
            ["EXA_API_KEY", "NEWSAPI_API_KEY", "PERPLEXITY_API_KEY"].includes(
              key,
            )
        ? "synthetic-search"
        : undefined,
    resolveHost: async () => ["93.184.216.34"],
    fetch: async (input, init) => {
      const url = String(input);
      calls.push({ url, init });
      if (url.includes("brandfetch.io/v2/search")) {
        return response(
          options.ambiguous
            ? [{ domain: "acme.example", name: "Acme" }, {
              domain: "other.example",
              name: "Acme",
            }]
            : [{ domain: "acme.example", name: "Acme" }],
        );
      }
      if (url.includes("brandfetch.io/v2/brands/")) {
        return response({ name: "Acme", domain: url.split("/").at(-1) });
      }
      if (url.includes("/search/companies")) return response(fixture.chSearch);
      if (url.endsWith("/company/12345678")) return response(fixture.chProfile);
      if (url.endsWith("/officers")) return response(fixture.chOfficers);
      if (url.endsWith("/filing-history")) return response(fixture.chFilings);
      if (url.endsWith("company_tickers.json")) {
        return response(fixture.secTickers);
      }
      if (url.includes("/submissions/CIK")) {
        return response(fixture.secSubmission);
      }
      if (url.includes("/companyfacts/CIK")) return response(fixture.secFacts);
      if (url.includes("/Archives/edgar/")) {
        return response(
          "<title>Acme filing</title><p>Revenue was USD 40000 in FY2026.</p>",
        );
      }
      if (url.includes("api.exa.ai")) {
        return response({
          results: [{
            title: "Acme results",
            url: "https://acme.example/news/results",
            publishedDate: "2026-10-31",
          }, {
            title: "Acme results",
            url: "https://press.example/acme",
            publishedDate: "2026-11-01",
          }],
        });
      }
      if (url.includes("newsapi.org")) {
        return response({
          articles: [{
            title: "Acme results",
            url: "https://press.example/acme",
            publishedAt: "2026-11-01",
          }],
        });
      }
      if (url.includes("api.perplexity.ai")) {
        return response({
          choices: [{ message: { content: "Acme published its results." } }],
          citations: ["https://press.example/acme"],
        });
      }
      if (url === "https://press.example/acme") {
        return response(
          '<meta property="article:published_time" content="2026-10-31"><p>Acme reported revenue of GBP 40000.</p><a href="https://acme.example/">Acme</a>',
        );
      }
      if (url.endsWith("/news/results")) return response(fixture.press);
      if (/https:\/\/(?:acme|other).example\/$/.test(url)) {
        return options.noWebsite
          ? new Response(null, { status: 404 })
          : response(fixture.home);
      }
      return new Response(null, { status: 404 });
    },
    complete: async (input) =>
      JSON.stringify({
        facts: JSON.parse(input.user).source?.url === fixture.fact.sourceUrl
          ? [fixture.fact]
          : [],
      }),
  };
  return { deps, calls };
}
function verifiedPack(): { pack: Pack; evidence: Evidence } {
  const result = verifyFacts([fixture.fact], [source], company, now());
  const pack: Pack = {
    schema: "mindmake.research-pack/1",
    part: "fact-check-board-update",
    builtAt: fixture.now,
    buyer,
    company,
    facts: result.facts,
    notFound: [],
    prepare: prepare(result.facts, buyer.role, buyer.useCase),
  };
  return {
    pack,
    evidence: {
      builtAt: fixture.now,
      company,
      sources: [source],
      verifiedFacts: structuredClone(result.facts),
      counts: {
        sourcesFetched: 1,
        factsProposed: 1,
        factsKept: 1,
        factsDropped: 0,
        dropped: {},
      },
    },
  };
}

Deno.test("Companies House stays separate without the website company number and contributes no facts", async () => {
  const { deps } = dependencies({ registry: "uk" });
  const fetch = deps.fetch;
  deps.fetch = async (input, init) =>
    String(input) === "https://acme.example/"
      ? response("<p>Acme Limited</p>")
      : fetch(input, init);
  const result = await identify({
    company: "Acme",
    domain: "acme.example",
    workEmail: "buyer@acme.example",
  }, deps);
  assert(result.verified);
  equal(result.verified.registry, null);
  assert(
    result.candidates.some((c) =>
      c.registry?.authority === "Companies House" && c.domain === ""
    ),
  );
  const sources = await gather(
    asCompany(result.verified),
    "monthly-board-pack",
    deps,
  );
  assert(
    !sources.some((s) => s.url.includes("company-information.service.gov.uk")),
  );
});
Deno.test("ambiguous company name returns all discovered candidates without choosing", async () => {
  const { deps } = dependencies({ ambiguous: true });
  const result = await identify({ company: "Acme" }, deps);
  equal(result.candidates.length, 2);
  equal(result.verified, null);
});
Deno.test("one brand check alone cannot verify a company", async () => {
  const { deps } = dependencies({ noWebsite: true });
  const result = await identify(
    { company: "Acme", domain: "acme.example" },
    deps,
  );
  equal(result.verified, null);
  equal(result.candidates[0].checks.length, 1);
});
Deno.test("explicit domain with two independent checks verifies, and email local part is absent", async () => {
  const { deps } = dependencies();
  const result = await identify({
    company: "Acme",
    domain: "acme.example",
    workEmail: "private-buyer@acme.example",
  }, deps);
  assert(result.verified);
  assert(!JSON.stringify(result).includes("private-buyer"));
});
Deno.test("identity deadline degrades gracefully even when injected transport ignores abort", async () => {
  const { deps } = dependencies();
  deps.identifyTimeoutMs = 35;
  deps.fetch = () => new Promise(() => {});
  const started = performance.now();
  const result = await identify({ company: "Acme" }, deps);
  assert(performance.now() - started < 500);
  equal(result.verified, null);
  await new Promise((resolve) => setTimeout(resolve, 5));
});
Deno.test("registry search uses Basic auth and binds a UK company number from the website", async () => {
  const { deps, calls } = dependencies({ registry: "uk" });
  const result = await identify(
    { company: "Acme", domain: "acme.example" },
    deps,
  );
  assert(result.verified);
  equal(result.verified.registry?.id, "12345678");
  const call = calls.find((c) => c.url.includes("/search/companies"))!;
  equal(
    new Headers(call.init?.headers).get("Authorization"),
    `Basic ${btoa("synthetic-register:")}`,
  );
});
Deno.test("SEC ticker and submission discovery uses contact env and fetches financial records plus filing URLs", async () => {
  const { deps, calls } = dependencies({ registry: "us" });
  const result = await identify(
    { company: "Acme", domain: "acme.example" },
    deps,
  );
  assert(result.verified);
  equal(result.verified.registry?.authority, "SEC");
  const sources = await gather(
    asCompany(result.verified),
    "results-commentary",
    deps,
  );
  assert(
    sources.some((s) =>
      s.url.includes("companyfacts") && s.text.includes('"val":40000') &&
      s.text.includes('"val":10000') && s.text.includes('"val":20')
    ),
  );
  assert(sources.some((s) => s.url.includes("/Archives/edgar/")));
  assert(
    calls.filter((c) => new URL(c.url).hostname.endsWith("sec.gov")).every(
      (c) =>
        new Headers(c.init?.headers).get("User-Agent") ===
          "Mindmake parts research <tests@example.invalid>",
    ),
  );
});
Deno.test("gather strips private officer fields and preserves literal corporate register text", async () => {
  const { deps } = dependencies({ registry: "uk" });
  const result = await identify(
    { company: "Acme", domain: "acme.example" },
    deps,
  );
  assert(result.verified);
  const sources = await gather(
    asCompany(result.verified),
    "monthly-board-pack",
    deps,
  );
  assert(
    sources.some((s) =>
      s.url.endsWith("/officers") &&
      s.text.includes('"officer_role":"director"')
    ),
  );
  assert(!JSON.stringify(sources).includes("PRIVATE"));
  assert(!JSON.stringify(sources).includes("date_of_birth"));
});
Deno.test("currency reuses all three clients, fetches coverage itself and uses the source publication date", async () => {
  const { deps, calls } = dependencies({ coverage: true });
  const sources = await gather(company, "monthly-board-pack", deps);
  assert(calls.some((c) => c.url.includes("api.perplexity.ai")));
  assert(calls.some((c) => c.url.includes("api.exa.ai")));
  assert(calls.some((c) => c.url.includes("newsapi.org")));
  equal(
    sources.find((s) => s.url === "https://press.example/acme")?.published,
    "2026-10-31",
  );
  equal(calls.filter((c) => c.url === "https://press.example/acme").length, 1);
  const exa = JSON.parse(
    String(calls.find((c) => c.url.includes("api.exa.ai"))?.init?.body),
  );
  equal(exa.startPublishedDate, "2025-11-17T12:00:00.000Z");
});
Deno.test("fabricated quote is dropped and model-added statement is replaced", () => {
  const result = verifyFacts(
    [{ ...fixture.fact, quote: "Revenue was GBP 99999 in FY2026." }, {
      ...fixture.fact,
      statement: "Revenue doubled.",
    }],
    [source],
    company,
    now(),
  );
  equal(result.facts.length, 1);
  equal(result.facts[0].statement, fixture.fact.quote);
  equal(result.dropped, { "quote-not-found": 1 });
});
Deno.test("over-age facts are dropped while registry age exemption is restricted to registries", () => {
  const result = verifyFacts(
    [fixture.fact],
    [{ ...source, published: "2023-01-01" }],
    company,
    now(),
  );
  equal(result.dropped["over-age"], 1);
  const fakeRegistry = verifyFacts(
    [{ ...fixture.fact, kind: "registry" }],
    [source],
    company,
    now(),
  );
  equal(fakeRegistry.dropped["not-a-registry"], 1);
});
Deno.test("quotes tolerate whitespace only, duplicates are removed and grade follows the actual URL", () => {
  const result = verifyFacts(
    [fixture.fact, fixture.fact],
    [{ ...source, text: "Revenue\nwas GBP 40000 in FY2026." }],
    company,
    now(),
  );
  equal(result.facts.length, 1);
  equal(result.dropped.duplicate, 1);
  equal(result.facts[0].grade, "primary");
  const secondary = {
    ...source,
    url: "https://press.example/acme",
    category: "coverage" as const,
  };
  equal(
    verifyFacts(
      [{ ...fixture.fact, sourceUrl: secondary.url }],
      [secondary],
      company,
      now(),
    ).facts[0].grade,
    "secondary",
  );
});
Deno.test("fact cap, source count and monthly recency priorities are bounded", () => {
  const proposals = Array.from(
    { length: 45 },
    (_, n) => ({
      ...fixture.fact,
      value: null,
      unit: null,
      period: null,
      kind: "announcement",
      statement: `The company opened a new office ${n}.`,
      quote: `The company opened a new office ${n}.`,
    }),
  );
  const result = verifyFacts(
    proposals,
    [{ ...source, text: proposals.map((p) => p.quote).join(" ") }],
    company,
    now(),
  );
  equal(result.facts.length, 12);
  equal(result.dropped["fact-cap"], 33);
  assert(
    priority(source, "monthly-board-pack", now()) >
      priority(
        { ...source, published: "2026-01-01" },
        "monthly-board-pack",
        now(),
      ),
  );
});
Deno.test("prepare emits at most five questions and every citation exists", () => {
  const { pack } = verifiedPack();
  const questions = prepare(pack.facts, buyer.role, buyer.useCase);
  assert(questions.length <= 5);
  assert(
    questions.every((q) =>
      q.question.endsWith("?") && q.because.length &&
      q.because.every((id) => pack.facts.some((f) => f.id === id))
    ),
  );
});
Deno.test("validatePack rejects missing URL, quote, verification, extra fields and oversize", () => {
  const { pack, evidence } = verifiedPack();
  validatePack(pack, evidence);
  for (
    const change of [
      (p: Pack) => {
        p.facts[0].source.url = "";
      },
      (p: Pack) => {
        p.facts[0].quote = "";
      },
      (p: Pack) => {
        p.notFound = ["x".repeat(200001)];
      },
      (p: Pack) => {
        Object.assign(p, { extra: true });
      },
      (p: Pack) => {
        p.facts[0].statement = "An altered statement.";
      },
      (p: Pack) => {
        p.prepare[0].because = ["F999"];
      },
    ]
  ) {
    const invalid = structuredClone(pack);
    change(invalid);
    rejects(() => validatePack(invalid, evidence));
  }
  rejects(() => validatePack(pack));
  rejects(() => validatePack(pack, { ...evidence, verifiedFacts: [] }));
});
Deno.test("buildPack records proposed, kept and dropped counts with a validating receipt", async () => {
  const { deps } = dependencies();
  deps.complete = async (input) =>
    JSON.stringify({
      facts: JSON.parse(input.user).source?.url !== fixture.fact.sourceUrl
        ? []
        : [fixture.fact, {
          ...fixture.fact,
          quote: "A made up quote that is absent.",
        }],
    });
  const result = await buildPack(company, buyer, deps);
  validatePack(result.pack, result.evidence);
  equal(result.counts.factsProposed, 3);
  equal(result.counts.factsKept, 1);
  assert(
    result.evidence.extractions?.some((call) =>
      call.factsKept === 1 && call.parseStatus === "ok"
    ),
  );
  equal(result.counts.factsDropped, 2);
  assert(result.counts.sourcesFetched <= 15);
});
Deno.test("unverified company produces an empty general version without model or network calls", async () => {
  const { deps, calls } = dependencies();
  deps.complete = () => {
    throw new Error("Must not run");
  };
  const result = await buildPack(
    { ...company, verified: false, verifiedBy: [] },
    buyer,
    deps,
  );
  equal(calls.length, 0);
  equal(result.pack.facts, []);
  assert(result.pack.notFound.some((s) => s.includes("general version")));
  validatePack(result.pack);
});
Deno.test("model JSON mode preserves quote punctuation; malformed output preserves deterministic facts", async () => {
  const { deps } = dependencies();
  deps.env = (key) => key === "GOOGLE_AI_API_KEY" ? "synthetic" : undefined;
  const exact = JSON.stringify({
    facts: [{ quote: "A quoted phrase, with  two spaces." }],
  });
  deps.fetch = async () =>
    response({ candidates: [{ content: { parts: [{ text: exact }] } }] });
  equal(
    await completeText(
      { system: "JSON", user: "input", format: "json" },
      runtime(deps),
    ),
    exact,
  );
  deps.complete = async () => "not JSON";
  const deterministic = await extract([source], buyer, deps);
  equal(deterministic.length, 1);
  equal((deterministic[0] as { value: number }).value, 40000);
});
Deno.test("transport rejects private destinations, redirects and oversized streamed pages", async () => {
  for (
    const url of [
      "http://acme.example",
      "https://127.0.0.1",
      "https://user:pass@acme.example",
      "https://localhost",
    ]
  ) rejects(() => publicUrl(url));
  const { deps, calls } = dependencies();
  deps.resolveHost = async () => ["10.0.0.1"];
  await rejectsAsync(() => runtime(deps).request("https://acme.example"));
  equal(calls.length, 0);
  deps.resolveHost = async () => ["93.184.216.34"];
  deps.fetch = async () =>
    new Response(null, {
      status: 302,
      headers: { location: "https://other.example" },
    });
  await rejectsAsync(() => runtime(deps).request("https://acme.example"));
  await rejectsAsync(() => readCapped(new Response("x".repeat(200001))));
});
Deno.test("personalise adds exactly one stored entry with every existing record and payload unchanged", async () => {
  const base = await Deno.readFile(
    new URL("./fixtures/base.mcpb", import.meta.url),
  );
  const { pack, evidence } = verifiedPack();
  const bytes = new TextEncoder().encode(JSON.stringify(pack));
  const result = await personaliseBundle(base, bytes, evidence);
  const before = readZip(base), after = readZip(result);
  equal(after.entries.length, before.entries.length + 1);
  equal([...after.comment], [...before.comment]);
  equal([...result.subarray(0, before.centralOffset)], [
    ...base.subarray(0, before.centralOffset),
  ]);
  for (const entry of before.entries) {
    const next = after.entries.find((e) => e.name === entry.name)!;
    equal([...next.central], [...entry.central]);
    equal([...await entryBytes(result, next)], [
      ...await entryBytes(base, entry),
    ]);
  }
  equal([
    ...await entryBytes(
      result,
      after.entries.find((e) => e.name === "research/pack.json")!,
    ),
  ], [...bytes]);
  await rejectsAsync(() => personaliseBundle(result, bytes, evidence));
  const wrong = await Deno.readFile(
    new URL("./fixtures/wrong-part.mcpb", import.meta.url),
  );
  await rejectsAsync(() => personaliseBundle(wrong, bytes, evidence));
});

Deno.test("SEC values become plain, unit-bound facts from exact concept quotes", () => {
  const secCompany: Company = {
    ...company,
    registry: {
      authority: "SEC",
      id: "0000001234",
      status: "listed",
      url: "https://www.sec.gov/edgar/browse/?CIK=1234",
    },
  };
  const text = JSON.stringify(fixture.secFacts);
  const secSource: Source = {
    ...source,
    category: "registry",
    published: null,
    url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000001234.json",
    text,
  };
  const proposals = [
    {
      kind: "reported-figure",
      quote: jsonMember(text, "Revenues")!,
      statement: "Revenue was USD 40000 for the period ending 2026-09-30.",
      value: 40000,
      unit: "USD",
      period: "2026-09-30",
      sourceUrl: secSource.url,
    },
    {
      kind: "reported-figure",
      quote: jsonMember(text, "EntityNumberOfEmployees")!,
      statement: "Employees totalled 20 people at 2026-09-30.",
      value: 20,
      unit: "people",
      period: "2026-09-30",
      sourceUrl: secSource.url,
    },
  ];
  const checked = verifyFacts(proposals, [secSource], secCompany, now());
  equal(checked.facts.length, 2);
  equal(
    verifyFacts(
      [{ ...proposals[0], value: 40001 }],
      [secSource],
      secCompany,
      now(),
    ).facts[0]?.value,
    40000,
  );
});

Deno.test("old reporting periods cannot be refreshed by new article dates", () => {
  const quote = "Revenue was GBP 40000 in FY2020.";
  const result = verifyFacts(
    [{ ...fixture.fact, quote, statement: quote, period: "FY2020" }],
    [{ ...source, text: quote }],
    company,
    now(),
  );
  equal(result.dropped["over-age"], 1);
});

Deno.test("personal biographies and third-party leadership facts are rejected", () => {
  const leadership = {
    ...fixture.fact,
    kind: "leadership",
    value: null,
    unit: null,
    period: null,
    quote: "Jane Doe, Finance director.",
    statement: "Jane Doe, Finance director.",
    leadership: { name: "Jane Doe", title: "Finance director" },
  };
  const own = { ...source, text: leadership.quote };
  equal(verifyFacts([leadership], [own], company, now()).facts.length, 1);
  const third = { ...own, url: "https://press.example/acme" };
  equal(
    verifyFacts(
      [{ ...leadership, sourceUrl: third.url }],
      [third],
      company,
      now(),
    ).dropped["leadership-not-first-party"],
    1,
  );
  const biography = {
    ...leadership,
    quote: "Jane Doe, Finance director. Born on 1 May.",
    statement: "Jane Doe, Finance director. Born on 1 May.",
  };
  equal(
    verifyFacts(
      [biography],
      [{ ...source, text: biography.quote }],
      company,
      now(),
    ).facts.length,
    0,
  );
});
Deno.test("local runner prints candidates and exits 2 when identity is ambiguous", async () => {
  const { deps } = dependencies({ ambiguous: true });
  const lines: string[] = [];
  const log = console.log;
  console.log = (s) => lines.push(String(s));
  try {
    equal(
      await runResearch([
        "--company",
        "Acme",
        "--role",
        "Finance director",
        "--chip",
        "monthly-board-pack",
        "--out",
        "supabase/functions/_shared/parts-research/fixtures/absent-output.json",
      ], deps),
      2,
    );
  } finally {
    console.log = log;
  }
  equal(JSON.parse(lines[0]).candidates.length, 2);
  assert(!lines.join("").includes("synthetic-brand"));
});

Deno.test("existing identity-depth merge and default currency scope are preserved", async () => {
  const identity = await assembleIdentityDepth("acme.example", {
    brand: async () => ({ identity: { name: "Acme" }, tools: ["brandfetch"] }),
    rank: async () => ({ scale: { trancoRank: 100 }, tools: ["tranco"] }),
    company: async () => ({
      identity: { name: "Acme Limited" },
      tools: ["pdl"],
    }),
  });
  equal(identity.dossier.identity.name, "Acme");
  equal(identity.dossier.meta.tools, ["pdl", "tranco", "brandfetch"]);
  const { deps, calls } = dependencies({ coverage: true });
  const currency = await fetchCurrency("Acme", "acme.example", {
    runtime: runtime(deps),
  });
  equal(currency?.currency?.map((item) => item.sourceUrl), [
    "https://acme.example/news/results",
  ]);
  assert(!calls.some((c) => c.url.includes("perplexity.ai")));
});

Deno.test("runner persists a validating pack and bundle CLI adds only its research entry", async () => {
  const parent = "quality/parts/research-test-output";
  await Deno.mkdir(parent, { recursive: true });
  const root = await Deno.realPath(parent);
  const directory = await Deno.makeTempDir({ dir: parent, prefix: "run-" });
  const output = `${directory}/pack.json`, bundled = `${directory}/buyer.mcpb`;
  const { deps } = dependencies();
  const lines: string[] = [];
  const log = console.log;
  console.log = (line) => lines.push(String(line));
  try {
    equal(
      await runResearch([
        "--company",
        "Acme",
        "--domain",
        "acme.example",
        "--role",
        buyer.role,
        "--chip",
        buyer.useCase,
        "--out",
        output,
      ], deps),
      0,
    );
    const pack = JSON.parse(await Deno.readTextFile(output));
    const evidence = JSON.parse(
      await Deno.readTextFile(`${output}.evidence.json`),
    );
    validatePack(pack, evidence);
    equal(pack.facts.length, 1);
    await runBundle([
      "--base",
      "supabase/functions/_shared/parts-research/fixtures/base.mcpb",
      "--pack",
      output,
      "--out",
      bundled,
    ]);
    const result = readZip(await Deno.readFile(bundled));
    equal(result.entries.length, 4);
    assert(result.entries.some((entry) => entry.name === "research/pack.json"));
    equal(JSON.parse(lines[0]).factsKept, 1);
    equal(JSON.parse(lines[1]).entriesAdded, 1);
    assert(!lines.join("").includes("synthetic-brand"));
    await rejectsAsync(() =>
      runBundle([
        "--base",
        "supabase/functions/_shared/parts-research/fixtures/base.mcpb",
        "--pack",
        output,
        "--out",
        bundled,
      ])
    );
  } finally {
    console.log = log;
    const absolute = await Deno.realPath(directory);
    assert(
      absolute.startsWith(root + (Deno.build.os === "windows" ? "\\" : "/")),
      "Temporary cleanup escaped its test directory",
    );
    await Deno.remove(absolute, { recursive: true });
  }
});
