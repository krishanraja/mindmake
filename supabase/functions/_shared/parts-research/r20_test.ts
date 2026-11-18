// deno-lint-ignore-file require-await
import fixture from "./fixtures/r20.json" with { type: "json" };
import uk from "./fixtures/uk-sources.json" with { type: "json" };
import { liveDependencies } from "../../../../scripts/parts/research-run.ts";
import { fetchResource } from "./fetch.ts";
import { buildPack, validatePack } from "./pack.ts";
import { extract, verifyFacts } from "./facts.ts";
import { sentenceFacts } from "./sentences.ts";
import { ukTableFacts } from "./uk-parsers.ts";
import { generateQuestions, validQuestion } from "./questions.ts";
import { PART, SCHEMA } from "./types.ts";
import { questionFacts, strategyFacts } from "./relevance.ts";
import type { Company, Dependencies, ProposedFact, Source } from "./types.ts";
function assert(
  value: unknown,
  message = "r20 assertion failed",
): asserts value {
  if (!value) throw new Error(message);
}
const now = () => new Date("2026-11-18T12:00:00Z");
const deps = (): Dependencies => ({
  fetch: async () => new Response(null, { status: 404 }),
  env: () => undefined,
  now,
  resolveHost: async () => ["93.184.216.34"],
  complete: async () => "[]",
  fetchOutcomes: [],
});
const company: Company = {
  name: "Auto Trader Group plc",
  domain: "autotrader.co.uk",
  verified: true,
  verifiedBy: [{
    check: "website",
    url: "https://autotrader.co.uk/",
    detail: "Matching name",
  }, {
    check: "work-email-domain",
    url: "https://autotrader.co.uk/",
    detail: "Matching domain",
  }],
  registry: null,
};
const buyer = {
  company: company.name,
  role: "Chief Financial Officer",
  useCase: "results-commentary" as const,
  useCaseLabel: "Results commentary",
};
function source(text: string): Source {
  return {
    title: "Half Year Results",
    publisher: "Autotrader",
    url: "https://autotrader.co.uk/results",
    published: "2026-11-05",
    retrievedAt: now().toISOString(),
    text,
    category: "filing",
    documentPeriod: "H1 2027",
    documentPeriodStart: "2026-04-01",
    documentPeriodEnd: "2026-09-30",
  };
}
function announcement(
  quote: string,
  s: Source,
  significance: 1 | 2 | 3 = 1,
): ProposedFact {
  return {
    kind: "announcement",
    statement: quote,
    quote,
    sourceUrl: s.url,
    value: null,
    unit: null,
    period: null,
    significance,
  };
}

Deno.test("r20 DNS retains independent deadlines, IPv6 grace and per-host cache", async () => {
  const original = Deno.resolveDns;
  let calls = 0;
  const signals: AbortSignal[] = [];
  Object.defineProperty(Deno, "resolveDns", {
    configurable: true,
    value: async (
      _host: string,
      type: string,
      options: { signal: AbortSignal },
    ) => {
      calls++;
      signals.push(options.signal);
      if (type === "A") return ["93.184.216.34"];
      await new Promise((resolve) => setTimeout(resolve, 900));
      return [];
    },
  });
  try {
    const d = liveDependencies(), start = performance.now();
    const result = await d.resolveHost!("r20-dns-fixture.example");
    assert(result[0] === "93.184.216.34" && performance.now() - start < 700);
    assert(
      (await liveDependencies().resolveHost!("r20-dns-fixture.example"))[0] ===
        result[0],
    );
    assert(calls === 2 && signals[0] !== signals[1]);
    await new Promise((resolve) => setTimeout(resolve, 950));
  } finally {
    Object.defineProperty(Deno, "resolveDns", {
      configurable: true,
      value: original,
    });
  }
});

Deno.test("r20 document content permits exactly one HTTPS Amazon redirect and strips credentials", async () => {
  for (
    const target of [
      "https://s3.eu-west-2.amazonaws.com/accounts/file.pdf",
      "https://bucket.amazonaws.com/file.pdf",
      "http://bucket.amazonaws.com/file.pdf",
      "https://amazonaws.com.evil.example/file.pdf",
    ]
  ) {
    const d = deps();
    let calls = 0;
    d.fetch = async (_input, init) => {
      calls++;
      if (calls === 1) {
        return new Response(null, {
          status: 302,
          headers: { location: target },
        });
      }
      assert(!new Headers((init as RequestInit)?.headers).has("authorization"));
      return new Response("pdf");
    };
    let passed = false;
    try {
      await fetchResource(
        d,
        "https://document-api.company-information.service.gov.uk/document/fixture/content",
        {
          documentRedirects: true,
          init: { headers: { Authorization: "Basic synthetic" } },
        },
      );
      passed = true;
    } catch { /* Expected for rejected targets. */ }
    assert(
      passed === target.startsWith("https://") && !target.includes("evil") ||
        !passed && (target.startsWith("http:") || target.includes("evil")),
    );
    assert(calls === (passed ? 2 : 1));
  }
  const d = deps();
  let calls = 0;
  d.fetch = async () => {
    calls++;
    return new Response(null, {
      status: 302,
      headers: { location: "https://s3.eu-west-2.amazonaws.com/again" },
    });
  };
  let refused = false;
  try {
    await fetchResource(
      d,
      "https://document-api.company-information.service.gov.uk/document/fixture/content",
      { documentRedirects: true },
    );
  } catch {
    refused = true;
  }
  assert(refused && calls === 2);
});

Deno.test("r20 redirected Monzo PDF yields strategic report and deterministic register facts in a validated pack", async () => {
  const d = deps();
  d.env = (k) => k === "COMPANIES_HOUSE_API_KEY" ? "synthetic" : undefined;
  const c: Company = {
    ...company,
    name: "Monzo Bank Limited",
    domain: "monzo.com",
    verifiedBy: company.verifiedBy.map((c) => ({
      ...c,
      url: "https://monzo.com/",
    })),
    registry: {
      authority: "Companies House",
      id: "09446231",
      status: "active",
      url:
        "https://find-and-update.company-information.service.gov.uk/company/09446231",
    },
  };
  let pages = 0, download = false;
  d.extractPdf = async (bytes, options) => {
    assert(bytes.length === 7190321);
    pages = options?.maxPages ?? 0;
    return "FY2026 YEAR ENDED 31 MARCH 2026\nCash at bank was £1 million.\nRevenue was £2 million." +
      " Financial context.".repeat(600);
  };
  d.fetch = async (input, init) => {
    const url = String(input);
    if (url.endsWith("/company/09446231")) {
      return Response.json(fixture.profile);
    }
    if (url.includes("filing-history")) return Response.json(uk.history);
    if (url.endsWith("/document/fixture-accounts")) {
      return Response.json(uk.pdfMetadata);
    }
    if (url.endsWith("/document/fixture-accounts/content")) {
      return new Response(null, {
        status: 302,
        headers: {
          location:
            "https://s3.eu-west-2.amazonaws.com/accounts/report.pdf?signature=fixture",
        },
      });
    }
    if (url.includes("amazonaws.com")) {
      download = true;
      assert(!new Headers((init as RequestInit)?.headers).has("authorization"));
      return new Response(new Uint8Array(7190321), {
        headers: { "content-type": "application/pdf" },
      });
    }
    return new Response(null, { status: 404 });
  };
  const { pack, evidence } = await buildPack(
    c,
    { ...buyer, company: c.name },
    d,
  );
  validatePack(pack, evidence);
  assert(download && pages === 40);
  assert(
    pack.facts.some((f) => f.metric === "cash at bank" && f.value === 1000000),
  );
  const registry = pack.facts.filter((f) => f.kind === "registry");
  for (
    const fragment of [
      "status as active",
      "date of creation",
      "made up to 2026-03-31",
      "filed on 2026-08-27",
      "confirmation statement",
    ]
  ) assert(registry.some((f) => f.statement.includes(fragment)), fragment);
  assert(registry.every((f) => f.grade === "primary"));
});

Deno.test("r20 headline revenue and EPS survive figure cap ahead of financial footnotes", () => {
  const s = source(
    fixture.table + "\n" +
      Array.from(
        { length: 35 },
        (_, i) => `Finance costs category ${i} was GBP ${i + 1}.`,
      ).join("\n"),
  );
  const footnotes: ProposedFact[] = Array.from({ length: 35 }, (_, i) => ({
    kind: "reported-figure",
    metric: `finance costs category ${i}`,
    aliases: [],
    quote: `Finance costs category ${i} was GBP ${i + 1}.`,
    statement: `Finance costs category ${i} was GBP ${i + 1}.`,
    value: i + 1,
    unit: "GBP",
    period: null,
    sourceUrl: s.url,
  }));
  const result = verifyFacts(
    [...footnotes, ...ukTableFacts(s)],
    [s],
    company,
    now(),
  );
  assert(
    result.facts.some((f) =>
      f.metric === "group revenue" && f.value === 313400000
    ),
  );
  assert(result.facts.some((f) => f.metric === "basic eps" && f.value === 0.2));
  assert(result.facts[0].metric === "group revenue");
  assert(
    result.facts.length === 28 && result.dropped["fact-cap"] > 0,
    JSON.stringify(result.dropped),
  );
});

Deno.test("r20 forecourt movement emits two verified instant facts with calendar year from fiscal document", () => {
  const s = source(fixture.movement), proposed = sentenceFacts(s);
  const result = verifyFacts(proposed, [s], company, now());
  assert(result.facts.length === 2, JSON.stringify(result.dropped));
  assert(
    result.facts[0].value === 13600 &&
      result.facts[0].period === "at 2026-03-31",
  );
  assert(
    result.facts[1].value === 13900 &&
      result.facts[1].periodEnd === "2026-09-30",
  );
  assert(
    result.facts.every((f) =>
      f.periodType === "instant" && f.periodStart === null &&
      result.factMetadata[f.id]?.periodSource === "document" &&
      f.quote === fixture.movement
    ),
  );
  const pack = {
    schema: SCHEMA,
    part: PART,
    builtAt: now().toISOString(),
    buyer,
    company,
    facts: result.facts,
    prepare: [],
    notFound: [],
  };
  const evidence = {
    builtAt: pack.builtAt,
    company,
    sources: [s],
    verifiedFacts: result.facts,
    counts: {
      sourcesFetched: 1,
      factsProposed: 2,
      factsKept: 2,
      factsDropped: 0,
      dropped: {},
    },
  };
  validatePack(pack, evidence);
  const forged = structuredClone(pack);
  forged.facts[0].periodEnd = "2026-04-30";
  let rejected = false;
  try {
    validatePack(forged, { ...evidence, verifiedFacts: forged.facts });
  } catch {
    rejected = true;
  }
  assert(rejected);
});

Deno.test("r20 strategy significance beats announcements cap and background never becomes news", async () => {
  const lows = Array.from(
    { length: 15 },
    (_, i) =>
      `The business launched programme ${
        i + 1
      } to improve its internal reporting process.`,
  );
  const s = source(
    [
      ...lows,
      fixture.strategy,
      fixture.product,
      "About Autotrader",
      fixture.background,
    ].join("\n"),
  );
  const proposals = [
    ...lows.map((q) => announcement(q, s)),
    announcement(fixture.product, s, 3),
    announcement(fixture.background, s, 3),
    ...strategyFacts(s),
  ];
  const result = verifyFacts(proposals, [s], company, now());
  assert(result.facts.length === 12, JSON.stringify(result.dropped));
  assert(
    result.facts.some((f) =>
      f.quote === fixture.strategy &&
      result.factMetadata[f.id]?.significance === 3
    ),
  );
  assert(result.facts.some((f) => f.quote === fixture.product));
  assert(result.dropped["announcement-background"] === 1);
  for (const title of ["Notice of Half Year Results", "Notice of Results"]) {
    const notice = { ...s, title, text: fixture.background };
    assert(
      verifyFacts(
        [announcement(fixture.background, notice, 3)],
        [notice],
        company,
        now(),
      ).facts.length === 0,
    );
  }
  const notes = { ...s, text: `Notes to editors\n${fixture.background}` };
  assert(
    verifyFacts(
      [announcement(fixture.background, notes, 3)],
      [notes],
      company,
      now(),
    ).facts.length === 0,
  );
  const d = deps();
  let prompt = "";
  d.complete = async (input) => {
    prompt = input.system;
    return "[]";
  };
  assert(
    (await extract([s], buyer, d)).some((p) =>
      (p as ProposedFact).quote === fixture.strategy
    ),
  );
  assert(
    prompt.includes("significance 1 to 3") &&
      prompt.includes("Notes to editors"),
  );
  const selected = questionFacts(
    result.facts,
    buyer.useCase,
    result.factMetadata,
  );
  assert(selected.length === 2);
  const product = selected.find((f) => f.quote === fixture.product)!;
  assert(
    validQuestion({
      question: "What will Autotrader Intelligence change for retailers?",
      because: [product.id],
    }, selected),
  );
  const financialSource = source(
    "Lease interest was GBP 123.\nGroup revenue was GBP 313 million.",
  );
  const figures = verifyFacts(
    sentenceFacts(financialSource),
    [financialSource],
    company,
    now(),
  ).facts;
  assert(
    questionFacts(figures, buyer.useCase).every((f) =>
      f.metric !== "lease interest"
    ),
  );
  let calls = 0;
  d.complete = async (input) => {
    calls++;
    const sent = JSON.parse(input.user).facts;
    assert(
      sent.length === 2 &&
        sent.every((f: { id: string }) => selected.some((s) => s.id === f.id)),
    );
    return JSON.stringify({
      questions: [{
        question:
          "What must change to deliver the AI-native platform strategy?",
        because: [selected.find((f) => f.quote === fixture.strategy)!.id],
      }],
    });
  };
  const questions = await generateQuestions(
    result.facts,
    buyer.role,
    buyer.useCase,
    d,
    [],
    result.factMetadata,
  );
  assert(calls === 1 && questions.length === 1);
});
