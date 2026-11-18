// deno-lint-ignore-file require-await
import { recoverPurchaseIdentity } from "./recovery.ts";
import run9 from "./fixtures/letter-run9.json" with { type: "json" };
import { generateQuestions, validQuestion } from "./questions.ts";
import { tableFacts } from "./tables.ts";
import uk from "./fixtures/uk-r17.json" with { type: "json" };
import { companyNameInText, sameCompanyName } from "../enrich/provenance.ts";
import fixture from "./fixtures/research.json" with { type: "json" };
import { extract, normaliseProposal, prepare, verifyFacts } from "./facts.ts";
import { narrativeIssue, parseFacts, supportedPeriod } from "./narrative.ts";
import { exhibitUrls } from "./exhibits.ts";
import { gather } from "./gather.ts";
import { buildPack, validatePack } from "./pack.ts";
import { identify } from "./identify.ts";
import { completeText } from "../enrich/llm.ts";
import { runtime } from "./transport.ts";
import {
  CHIPS,
  type Company,
  type Dependencies,
  type Source,
} from "./types.ts";
function assert(x: unknown): asserts x {
  if (!x) throw new Error("Assertion failed");
}
const buyer = {
  company: "Acme",
  role: "CFO",
  useCase: "results-commentary" as const,
  useCaseLabel: CHIPS["results-commentary"],
};
const deps = (): Dependencies => ({
  now: () => new Date(fixture.now),
  env: () => undefined,
  resolveHost: async () => ["93.184.216.34"],
  fetch: async () => new Response(null, { status: 404 }),
  extractions: [],
});
Deno.test("extraction parses arrays, envelopes, fences and every complete truncated object", () => {
  const fact = {
    quote: 'A quoted "word" with {braces} and a verb was retained.',
  };
  for (
    const raw of [
      JSON.stringify([fact]),
      JSON.stringify({ facts: [fact] }),
      "```json\n" + JSON.stringify([fact]) + "\n```",
    ]
  ) {
    assert(
      parseFacts(raw).status === "ok" && parseFacts(raw).facts.length === 1,
    );
  }
  const raw = '{"facts":[' + JSON.stringify(fact) + "," + JSON.stringify(fact) +
    ',{"quote":"unfinished';
  assert(
    parseFacts(raw).status === "truncated" &&
      parseFacts(raw).facts.length === 2,
  );
  assert(parseFacts("nonsense").status === "failed");
  assert(parseFacts('{"facts":[{"quote":"unfinished').facts.length === 0);
});
Deno.test("extraction is one call per source, max four concurrent, bounded and auditable", async () => {
  const d = deps();
  let active = 0, peak = 0, calls = 0;
  d.complete = async (input) => {
    calls++;
    active++;
    peak = Math.max(peak, active);
    assert(input.timeoutMs === 90000 && input.maxTokens === 6000);
    assert(input.extractionModels?.primary === "claude-haiku-5-5");
    const payload = JSON.parse(input.user);
    assert(payload.source && !payload.sources);
    await new Promise((r) => setTimeout(r, 10));
    active--;
    return "[]";
  };
  const sources = Array.from(
    { length: 9 },
    (
      _,
      i,
    ) => ({ ...fixture.source, url: `https://acme.example/${i}` } as Source),
  );
  await extract(sources, buyer, d);
  assert(calls === 9 && peak === 4 && d.extractions?.length === 9);
  assert(
    d.extractions.every((x) =>
      x.inputCharacters > fixture.source.text.length &&
      x.outputCharacters === 2 && x.parseStatus === "ok"
    ),
  );
  const expired = deps();
  expired.deadline = performance.now() - 1;
  expired.complete = async () => {
    throw new Error("Must not call");
  };
  assert((await extract(sources, buyer, expired)).length === 9);
});
Deno.test("extraction routing prefers configured Anthropic then Gemini without changing defaults", async () => {
  const d = deps();
  d.env = (k) =>
    k === "ANTHROPIC_API_KEY" || k === "GOOGLE_AI_API_KEY"
      ? "synthetic"
      : undefined;
  const calls: string[] = [];
  const models: string[] = [];
  d.fetch = async (url, init) => {
    calls.push(String(url));
    const body = JSON.parse(String((init as RequestInit)?.body));
    if (String(url).includes("anthropic")) {
      models.push(body.model);
      return new Response(null, { status: 503 });
    }
    return new Response(
      JSON.stringify({
        candidates: [{ content: { parts: [{ text: "[]" }] } }],
      }),
    );
  };
  const attempts: string[] = [];
  await completeText({
    system: "JSON",
    user: "test",
    format: "json",
    timeoutMs: 90000,
    extractionModels: {
      primary: "configured-haiku",
      fallback: "configured-gemini",
    },
    onAttempt: (a) => attempts.push(a.provider),
  }, runtime(d));
  assert(
    models[0] === "configured-haiku" &&
      calls[1].includes("configured-gemini") &&
      attempts.join() === "anthropic,gemini",
  );
  calls.length = 0;
  await completeText(
    { system: "JSON", user: "test", format: "json" },
    runtime(d),
  );
  assert(calls[0].includes("gemini-2.5-flash"));
});
Deno.test("narrative verification rejects tables, short text and verbless rows, nulls unsupported periods", () => {
  assert(
    narrativeIssue("Revenues $ 309,007 $ 271,713 $ 899,428 $ 754,721") ===
      "table-row",
  );
  assert(narrativeIssue("Revenue grew.") === "short-narrative");
  assert(
    narrativeIssue(
      "The revenue from our subscription business this quarter",
    ) === "no-narrative-verb",
  );
  assert(
    supportedPeriod(
      "Revenue grew strongly during the third quarter of 2026.",
      "Q3 2026",
    ) === "Q3 2026",
  );
  assert(
    supportedPeriod("Revenue grew strongly across our business.", "Q3 2026") ===
      null,
  );
  const quote = "Revenue grew from USD 20 million to USD 30 million.";
  assert(
    supportedPeriod("Revenue grew during September 2026.", "2026-09") ===
      "2026-09",
  );
  assert(
    supportedPeriod("Revenue grew during September 2026.", "2026-08") === null,
  );
  const source = { ...fixture.source, text: quote } as Source;
  const facts = verifyFacts(
    [{
      ...fixture.fact,
      quote,
      statement: quote,
      unit: "USD",
      period: "Q3 2026",
    }],
    [source],
    fixture.company as Company,
    new Date(fixture.now),
  ).facts;
  assert(
    facts[0]?.kind === "announcement" && facts[0].value === null &&
      facts[0].period === null,
  );
});
Deno.test("typed filing index follows every HTML EX-99 document but skips images and PDFs", () => {
  const index =
    "https://www.sec.gov/Archives/edgar/data/1562088/000162828026069474/0001628280-26-069474-index.html";
  const html = [
    "q3fy26duolingo9-30x26share.htm",
    "q3fy26duolingo9-30x26xpres.htm",
    "photo.jpg",
    "letter.pdf",
  ].map((file, i) =>
    `<tr><td><a href="${file}">${file}</a></td><td>EX-99.${i + 1}</td></tr>`
  ).join("");
  const links = exhibitUrls(html, index);
  assert(
    links.length === 2 && links[0].endsWith("share.htm") &&
      links[1].endsWith("xpres.htm"),
  );
});
Deno.test("purchase website retry preserves successful check and logs both probe outcomes", async () => {
  for (const mode of ["pre-payment", "purchase"] as const) {
    const d = deps();
    let calls = 0;
    d.identityProbes = [];
    d.fetch = async (url) =>
      String(url) === "https://acme.example/"
        ? ++calls === 1
          ? new Response(null, { status: 503 })
          : new Response("<title>Acme</title>")
        : new Response(null, { status: 404 });
    const result = await identify({
      company: "Acme",
      domain: "acme.example",
      workEmail: "buyer@acme.example",
      mode,
    }, d);
    assert(calls === (mode === "purchase" ? 2 : 1));
    assert(!!result.verified === (mode === "purchase"));
    assert(d.identityProbes.length === calls);
  }
});

Deno.test("gather fetches typed 8-K index and the full shareholder letter and press release", async () => {
  const d = deps();
  const requested: string[] = [];
  const prefix =
    "https://www.sec.gov/Archives/edgar/data/1562088/000162828026069474/";
  const index = prefix + "0001628280-26-069474-index.html";
  const files = [
    "q3fy26duolingo9-30x26share.htm",
    "q3fy26duolingo9-30x26xpres.htm",
  ];
  d.env = (k) => k === "SEC_CONTACT_EMAIL" ? "test@example.invalid" : undefined;
  d.fetch = async (input) => {
    const url = String(input);
    requested.push(url);
    if (url.includes("/submissions/")) {
      return new Response(
        JSON.stringify({
          filings: {
            recent: {
              form: ["8-K"],
              filingDate: ["2026-11-03"],
              accessionNumber: ["0001628280-26-069474"],
              primaryDocument: ["duol-20261103.htm"],
            },
          },
        }),
      );
    }
    if (url === index) {
      return new Response(
        files.map((file, i) =>
          `<tr><td><a href="${file}">${file}</a></td><td>EX-99.${
            i + 1
          }</td></tr>`
        ).join(""),
      );
    }
    if (files.some((f) => url === prefix + f)) {
      return new Response(
        "<html><p>" + "x".repeat(266000) +
          "</p><p>Paid subscribers reached ten million across our business.</p></html>",
      );
    }
    return new Response(null, { status: 404 });
  };
  const company = {
    ...fixture.company,
    registry: {
      authority: "SEC",
      id: "0001562088",
      status: "listed",
      url: "https://www.sec.gov/edgar/browse/?CIK=1562088",
    },
  } as Company;
  const sources = await gather(company, "results-commentary", d);
  assert(requested.includes(index));
  assert(
    files.every((f) =>
      sources.some((s) => s.url === prefix + f && s.published === "2026-11-03")
    ),
  );
});

Deno.test("overall build deadline bounds a fetch that never settles", async () => {
  const d = deps();
  d.deadline = performance.now() + 25;
  d.fetch = () => new Promise<Response>(() => {});
  const started = performance.now();
  const result = await buildPack(fixture.company as Company, buyer, d);
  assert(performance.now() - started < 500 && result.pack.facts.length === 0);
  await new Promise((r) => setTimeout(r, 40));
});

Deno.test("live provider shapes normalise before strict verification", () => {
  for (const field of ["quote", "exact_quote", "supporting_quote"]) {
    const proposal = normaliseProposal(
      {
        ...fixture.fact,
        quote: undefined,
        [field]: fixture.fact.quote,
        metric: "Daily Active Users",
        aliases: null,
        unit: "million",
        statement: "Invented introduction",
      } as never,
    );
    assert(
      proposal.quote === fixture.fact.quote &&
        proposal.statement === fixture.fact.quote,
    );
    assert(
      proposal.unit === "GBP" && proposal.metric === "daily active users" &&
        proposal.aliases?.length === 0,
    );
  }
  for (
    const [unit, expected] of [["$", "USD"], ["usd", "USD"], ["pct", "%"], [
      "gbp",
      "GBP",
    ]]
  ) {
    assert(
      normaliseProposal({ ...fixture.fact, unit } as never).unit === expected,
    );
  }
});

Deno.test("purchase recovery requires literal filing domain and work email", async () => {
  for (const present of [false, true]) {
    const d = deps();
    d.env = (key) =>
      key === "SEC_CONTACT_EMAIL" ? "test@example.com" : undefined;
    d.fetch = async (input) => {
      const url = String(input);
      if (url.endsWith("robots.txt")) return new Response("", { status: 404 });
      if (url.includes("company_tickers")) {
        return Response.json({
          0: { title: "Recovery Example Inc.", cik_str: 123 },
        });
      }
      if (url.includes("submissions")) {
        return Response.json({
          name: "Recovery Example Inc.",
          registry: null,
          website: "",
          filings: {
            recent: {
              form: ["10-Q"],
              accessionNumber: ["0000000123-26-000001"],
              primaryDocument: ["report.htm"],
              filingDate: ["2026-11-01"],
            },
          },
        });
      }
      return new Response(
        present ? "Our website is www.example.com." : "No website named here.",
      );
    };
    const candidate = {
      name: "Recovery Example Inc.",
      registry: null,
      domain: "example.com",
      checks: [{
        check: "work-email-domain" as const,
        url: "https://example.com/",
        detail: "Email domain matches.",
      }],
    };
    assert(await recoverPurchaseIdentity(candidate, d) === present);
  }
});

Deno.test("live business sentences retain cash, DAU growth and safe executive attribution", () => {
  const cash =
    "Cash and short-term investments increased to $1.4 billion at quarter end.";
  const dau =
    "Daily active users (DAUs) accelerated for a second quarter in a row to 29% year-over-year growth, up from 23% in Q2.";
  const attributed = cash + " said Jane Smith, chief financial officer.";
  const source = {
    ...fixture.source,
    text: cash + " " + dau + " " + attributed,
    documentPeriod: "Q3 2026",
  } as Source;
  const proposals = [cash, dau, attributed].map((quote) => ({
    ...fixture.fact,
    quote,
    statement: quote,
    unit: null,
    period: null,
    metric: quote.startsWith("Cash")
      ? "cash and short-term investments"
      : "daily active users",
  }));
  const result = verifyFacts(
    proposals,
    [source],
    fixture.company as Company,
    new Date(fixture.now),
  );
  assert(result.facts.length === 2);
  const fact = result.facts[0];
  assert(
    fact.value === 1400000000 && fact.unit === "USD" &&
      fact.period === "Q3 2026" &&
      result.factMetadata[fact.id]?.periodSource === "document",
  );
  assert(result.facts[1].quote === dau && result.facts[1].value === null);
  assert(result.facts.every((f) => !f.statement.includes("Jane Smith")));
  const questions = prepare(
    [...result.facts, {
      ...fact,
      id: "X1",
      quote: JSON.stringify({ val: 999 }),
      statement: "Revenue was USD 999.",
    }],
    "CFO",
    "results-commentary",
  );
  assert(
    questions.length === 2 &&
      questions.every((q) =>
        q.because.length <= 2 && !q.because.includes("X1")
      ),
  );
  assert(
    parseFacts(
      JSON.stringify(Array.from({ length: 25 }, () => ({ quote: cash }))),
      25,
    ).facts.length === 25,
  );
});

Deno.test("run 9 current-column KPIs and sentence windows survive strict pack validation", async () => {
  const d = deps();
  d.fetch = async (input) =>
    String(input).endsWith("robots.txt")
      ? new Response("", { status: 404 })
      : new Response(
        `<html><title>Q3 2026 shareholder letter</title><meta property="article:published_time" content="2026-11-03"><body>${run9.table} ${run9.prose}</body></html>`,
        { headers: { "content-type": "text/html" } },
      );
  d.complete = async () =>
    JSON.stringify({
      facts: [{
        ...fixture.fact,
        quote: run9.prose,
        statement: run9.prose,
        metric: "cash and short-term investments",
        unit: "USD",
        period: null,
      }],
    });
  const { pack, evidence } = await buildPack(
    fixture.company as Company,
    buyer,
    d,
  );
  validatePack(pack, evidence);
  const dau = pack.facts.find((f) => f.metric === "daily active users");
  assert(
    dau?.value === 64900000 && dau.period === "Q3 2026" &&
      dau.unit === "people" && dau.aliases?.includes("daus"),
  );
  assert(dau.quote === "Daily active users (DAUs) (1) 50.5 64.9");
  assert(
    pack.facts.find((f) => f.metric === "daily active users growth")?.value ===
      29,
  );
  assert(
    pack.facts.find((f) => f.metric === "paid subscribers")?.value === 13100000,
  );
  assert(pack.facts.find((f) => f.metric === "total bookings")?.unit === "USD");
  const cash = pack.facts.find((f) =>
    f.metric === "cash and short-term investments"
  );
  assert(
    cash?.value === 1400000000 &&
      evidence.factMetadata?.[cash.id]?.periodSource === "document" &&
      cash.quote.startsWith("Cash and"),
  );
  assert(
    !tableFacts(
      {
        ...fixture.source,
        text: run9.table.replace("Q3 2026", "Unknown"),
      } as Source,
    ).length,
  );
});
Deno.test("attribution quote remains literal and drop receipts explain every rejection", () => {
  const quote =
    "Cash and short-term investments increased to $1.4 billion, said Jane Smith, chief financial officer.";
  const source = { ...fixture.source, text: quote } as Source;
  const result = verifyFacts(
    [{
      ...fixture.fact,
      quote,
      statement: quote,
      metric: "cash and short-term investments",
      unit: "USD",
      period: null,
    }, { ...fixture.fact, quote: "Fabricated " + "x".repeat(200) }],
    [source],
    fixture.company as Company,
    new Date(fixture.now),
  );
  assert(
    result.facts[0]?.quote === quote &&
      !result.facts[0].statement.includes("Jane Smith"),
  );
  assert(
    result.droppedProposals.length === 1 &&
      result.droppedProposals[0].quote.length === 160 &&
      result.droppedProposals[0].reason === "quote-not-found",
  );
});

Deno.test("run 10 primary sentences survive an empty model and pack validation", async () => {
  const d = deps();
  d.fetch = async (input) =>
    String(input).endsWith("robots.txt")
      ? new Response("", { status: 404 })
      : new Response(
        `<html><title>Q3 2026 shareholder letter</title><meta property="article:published_time" content="2026-11-03"><body>${run9.prose}</body></html>`,
        { headers: { "content-type": "text/html" } },
      );
  d.complete = async () => null;
  const { pack, evidence } = await buildPack(
    fixture.company as Company,
    buyer,
    d,
  );
  validatePack(pack, evidence);
  assert(
    pack.facts.find((f) => f.metric === "adjusted ebitda")?.value === 78700000,
  );
  assert(
    pack.facts.find((f) => f.metric === "adjusted ebitda margin")?.value ===
      25.5,
  );
  const cash = pack.facts.find((f) =>
    f.metric === "cash and short-term investments"
  );
  assert(
    cash?.value === 1400000000 &&
      evidence.factMetadata?.[cash.id]?.periodSource === "document" &&
      cash.period === "Q3 2026",
  );
  const d2 = deps();
  d2.complete = async () =>
    JSON.stringify({
      questions: [{
        question:
          "With cash and short-term investments at $1.4bn, which commitments can we fund?",
        because: [cash!.id],
      }, {
        question: "Can cash cover $2bn of investment?",
        because: [cash!.id],
      }, {
        question: "What does this mean for our next decision?",
        because: [cash!.id],
      }],
    });
  const questions = await generateQuestions(
    pack.facts,
    "CFO",
    "results-commentary",
    d2,
    [],
  );
  assert(questions.length === 1 && validQuestion(questions[0], pack.facts));
  assert(
    !validQuestion({
      question: "What does cash mean for Jane Smith?",
      because: [cash!.id],
    }, pack.facts),
  );
  assert(
    !validQuestion({
      question: "What does cash mean for delivery?",
      because: ["F999"],
    }, pack.facts),
  );
  assert(
    !validQuestion({
      question: "How does cash change " + "funding ".repeat(30) + "?",
      because: [cash!.id],
    }, pack.facts),
  );
  d2.complete = async () =>
    JSON.stringify({
      questions: Array.from({ length: 9 }, (_, i) => ({
        question: `How does cash affect ${
          [
            "funding",
            "commitments",
            "planning",
            "delivery",
            "investment",
            "reserves",
            "liquidity",
            "priorities",
            "budgets",
          ][i]
        }?`,
        because: [cash!.id],
      })),
    });
  assert(
    (await generateQuestions(pack.facts, "CFO", "results-commentary", d2, []))
      .length === 8,
  );
  const fallback = {
    question: "How does cash change funding headroom?",
    because: [cash!.id],
  };
  d2.complete = async () => null;
  assert(
    (await generateQuestions(pack.facts, "CFO", "results-commentary", d2, [
      fallback,
    ])).length === 0,
  );
});

Deno.test("r17 identity reads large homepage prefixes and normalises UK company names", async () => {
  assert(sameCompanyName(uk.buyerNames[1], "Autotrader"));
  assert(sameCompanyName(uk.buyerNames[0], "Monzo"));
  assert(companyNameInText(uk.buyerNames[1], "Welcome to Autotrader"));
  assert(!companyNameInText("Monzo", "Notmonzo"));
  for (const size of [239000, 700000]) {
    const d = deps();
    d.fetch = async () =>
      new Response(uk.monzoTitle + "x".repeat(size), {
        headers: { "content-length": String(size + uk.monzoTitle.length) },
      });
    const result = await identify({
      company: uk.buyerNames[0],
      domain: "monzo.com",
      workEmail: "buyer@monzo.com",
      mode: "purchase",
    }, d);
    assert(result.verified?.checks.some((c) => c.check === "website"));
  }
});
Deno.test("r17 Companies House retries and binds an investor-page number only on the company domain", async () => {
  for (const matching of [true, false]) {
    const d = deps();
    let search = 0;
    const urls: string[] = [];
    d.env = (k) => k === "COMPANIES_HOUSE_API_KEY" ? "synthetic" : undefined;
    d.fetch = async (input) => {
      const url = String(input);
      urls.push(url);
      if (url.includes("search/companies")) {
        if (++search === 1) throw new Error("timeout fixture");
        return Response.json({
          items: [{
            title: uk.buyerNames[1],
            company_number: "12345678",
            company_status: "active",
          }],
        });
      }
      if (url === "https://autotrader.co.uk/") {
        return new Response(uk.traderTitle);
      }
      if (url === "https://plc.autotrader.co.uk/") {
        return new Response(matching ? uk.legal : "Registered elsewhere.");
      }
      return new Response(null, { status: 404 });
    };
    const result = await identify({
      company: uk.buyerNames[1],
      domain: "autotrader.co.uk",
      mode: "purchase",
    }, d);
    assert(search === 2 && urls.includes("https://plc.autotrader.co.uk/"));
    assert(!!result.verified === matching);
  }
});
Deno.test("r17 Claude 5 omits temperature and older Claude preserves it", async () => {
  for (
    const model of [
      "claude-haiku-5-5",
      "claude-sonnet-5",
      "claude-haiku-4-5-20251001",
    ]
  ) {
    const d = deps();
    d.env = (k) => k === "ANTHROPIC_API_KEY" ? "synthetic" : undefined;
    let body: Record<string, unknown> = {};
    d.fetch = async (_input, init) => {
      body = JSON.parse(String((init as RequestInit)?.body));
      return Response.json({ content: [{ type: "text", text: "{}" }] });
    };
    await completeText({
      system: "JSON",
      user: "data",
      temperature: 0,
      extractionModels: { primary: model, fallback: "gemini-2.5-flash" },
    }, runtime(d));
    assert(Object.hasOwn(body, "temperature") === model.includes("-4-"));
  }
});
Deno.test("r17 questions ignore exhausted extraction budget, retry twice and never use templates", async () => {
  const d = deps();
  d.deadline = performance.now() - 1;
  let attempts = 0;
  d.complete = async (input) => {
    attempts++;
    assert(input.timeoutMs === 45000);
    return '{"questions":[{"question":"What next?","because":["F1"]}]}';
  };
  const facts = verifyFacts(
    [fixture.fact],
    [fixture.source as Source],
    fixture.company as Company,
    new Date(fixture.now),
  ).facts;
  const result = await generateQuestions(
    facts,
    "CFO",
    "results-commentary",
    d,
    [{ question: "How does revenue affect commitments?", because: ["F1"] }],
  );
  assert(attempts === 2 && result.length === 0);
});
Deno.test("r17 announcement ranking, separate caps and dated-only policy", () => {
  const announcements = Array.from(
    { length: 20 },
    (_, i) => ({
      ...fixture.fact,
      kind: "announcement",
      quote: `The company opened a new office ${i}.`,
      statement: `The company opened a new office ${i}.`,
      value: null,
      unit: null,
      period: null,
    }),
  );
  const decision = {
    ...announcements[0],
    quote: "The company will stop subscriptions this month.",
    statement: "The company will stop subscriptions this month.",
  };
  const boiler = {
    ...announcements[0],
    quote: "The company announced a conference call this week.",
    statement: "The company announced a conference call this week.",
  };
  const figures = Array.from(
    { length: 35 },
    (_, i) => ({
      ...fixture.fact,
      quote: `Revenue was GBP ${10000 + i} in FY2026.`,
      statement: `Revenue was GBP ${10000 + i} in FY2026.`,
      value: 10000 + i,
    }),
  );
  const proposals = [...announcements, ...figures, decision, boiler];
  const source = {
    ...fixture.source,
    text: proposals.map((p) => p.quote).join(" "),
  } as Source;
  const result = verifyFacts(
    proposals,
    [source],
    fixture.company as Company,
    new Date(fixture.now),
  );
  assert(
    result.facts.length === 40 &&
      result.facts.filter((f) => f.kind === "announcement").length === 12,
  );
  assert(
    result.facts.some((f) => f.quote === decision.quote) &&
      result.dropped["filing-boilerplate"] === 1,
  );
  assert(
    verifyFacts(
      [decision],
      [{ ...source, published: null }],
      fixture.company as Company,
      new Date(fixture.now),
    ).dropped["undated-announcement"] === 1,
  );
});
Deno.test("r17 sparse verified company has an honest notice and no question call", async () => {
  const d = deps();
  let questions = 0;
  d.fetch = async (input) =>
    String(input).endsWith("robots.txt")
      ? new Response(null, { status: 404 })
      : new Response(
        "<html><title>Acme</title><body>Revenue was GBP 10000 in FY2026.</body></html>",
        { headers: { "content-type": "text/html" } },
      );
  d.complete = async (input) => {
    if (JSON.parse(input.user).facts) questions++;
    return "[]";
  };
  const { pack } = await buildPack(fixture.company as Company, buyer, d);
  assert(questions === 0 && pack.prepare.length === 0);
  assert(
    pack.notFound.includes(
      "Little has been published about Acme in the last 12 months, so this check leans on your own evidence.",
    ),
  );
});
