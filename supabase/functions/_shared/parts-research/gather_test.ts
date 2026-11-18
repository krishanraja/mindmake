// deno-lint-ignore-file require-await
import identity from "./fixtures/identity-recovery.json" with { type: "json" };
import recovery from "./fixtures/gather-recovery.json" with { type: "json" };
import base from "./fixtures/research.json" with { type: "json" };
import { fetchResource, RESEARCH_AGENT } from "./fetch.ts";
import { filingNamesDomain } from "./registry.ts";
import { gather } from "./gather.ts";
import { buildPack, validatePack } from "./pack.ts";
import { canonicalPeriod, quoteValue } from "./figures.ts";
import { measureExcerpt, PDF_MODULE } from "./documents.ts";
import { olderThan24Months, verifyFacts } from "./facts.ts";
import { robotsAllows } from "./robots.ts";
import {
  CHIPS,
  type Company,
  type Dependencies,
  type Fact,
  MAX_FILING_BYTES,
  type Source,
} from "./types.ts";

function assert(value: unknown, message = "Assertion failed"): asserts value {
  if (!value) throw new Error(message);
}
function equal(a: unknown, b: unknown) {
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    `Different: ${JSON.stringify(a)} != ${JSON.stringify(b)}`,
  );
}
async function rejects(fn: () => unknown) {
  let failed = false;
  try {
    await fn();
  } catch {
    failed = true;
  }
  assert(failed, "Expected rejection");
}
const html = (text: string) =>
  new Response(text, { headers: { "content-type": "text/html" } });
const json = (data: unknown) =>
  new Response(JSON.stringify(data), {
    headers: { "content-type": "application/json" },
  });
function firm(): Company {
  return {
    ...structuredClone(base.company) as Company,
    name: identity.company,
    domain: identity.domain,
    verifiedBy: base.company.verifiedBy.map((c) => ({
      ...c,
      url: "https://duolingo.com/",
    })) as Company["verifiedBy"],
  };
}
const buyer = {
  company: identity.company,
  role: "Chief Financial Officer",
  useCase: "results-commentary" as const,
  useCaseLabel: CHIPS["results-commentary"],
};
function setup() {
  const calls: { url: string; headers: Headers }[] = [];
  const deps: Dependencies = {
    now: () => new Date(base.now),
    fetchOutcomes: [],
    env: (key) =>
      key === "SEC_CONTACT_EMAIL"
        ? "test@example.invalid"
        : ["EXA_API_KEY", "PERPLEXITY_API_KEY", "NEWSAPI_API_KEY"].includes(key)
        ? "synthetic"
        : undefined,
    resolveHost: async () => ["93.184.216.34"],
    complete: async () => '{"facts":[]}',
    extractPdf: async (bytes) => {
      assert(new TextDecoder().decode(bytes).startsWith("%PDF-"));
      return recovery.pdfText;
    },
    fetch: async (input, init) => {
      const url = String(input);
      calls.push({
        url,
        headers: new Headers((init as RequestInit | undefined)?.headers),
      });
      if (url.endsWith("/robots.txt")) {
        return new Response(null, { status: 404 });
      }
      if (url.endsWith("company_tickers.json")) return json(identity.tickers);
      if (url.includes("/submissions/CIK")) return json(identity.submission);
      if (url.includes("/companyfacts/CIK")) return json(base.secFacts);
      if (url === identity.filingUrl) {
        return html(
          "<html><p>" + "x".repeat(1_100_000) + "</p>" + identity.filing +
            "</html>",
        );
      }
      if (url === "https://api.exa.ai/search") {
        return json({
          results: [
            {
              title: "Letter",
              url: "https://investors.duolingo.com/letter.pdf",
            },
            { title: "Results", url: "https://finance.yahoo.com/results" },
            { title: "Blocked", url: "https://www.stocktitan.net/results" },
          ],
        });
      }
      if (url.includes("api.perplexity.ai")) {
        return json({
          choices: [{
            message: { content: "Duolingo published its results." },
          }],
          citations: [identity.filingUrl],
        });
      }
      if (url.includes("newsapi.org")) {
        return new Response(null, { status: 426 });
      }
      if (url === "https://investors.duolingo.com/letter.pdf") {
        return new Response(
          await Deno.readFile(
            new URL("./fixtures/shareholder-letter.pdf", import.meta.url),
          ),
          { headers: { "content-type": "application/pdf" } },
        );
      }
      if (url === "https://finance.yahoo.com/results") {
        return new Response(null, {
          status: 301,
          headers: { location: "https://uk.finance.yahoo.com/results" },
        });
      }
      if (url === "https://uk.finance.yahoo.com/results") {
        return html(recovery.coverage);
      }
      if (url.includes("stocktitan")) {
        return new Response("Forbidden", { status: 403 });
      }
      if (url === "https://duolingo.com/") return html(recovery.home);
      return new Response(null, { status: 404 });
    },
  };
  return { deps, calls };
}
Deno.test("unavailable PDF reader is recorded without failing the build", async () => {
  const { deps } = setup();
  deps.extractPdf = async () => {
    throw new Error("pdf reader unavailable");
  };
  const result = await buildPack(firm(), buyer, deps);
  assert(
    result.evidence.fetches?.some((f) =>
      f.url.endsWith("letter.pdf") && !f.kept &&
      f.reason === "pdf reader unavailable"
    ),
  );
  assert(result.pack.facts.length > 0);
});
Deno.test("gather recovery keeps PDF, SEC figures and redirected coverage with a complete fetch receipt", async () => {
  const { deps, calls } = setup();
  const result = await buildPack(firm(), buyer, deps);
  equal(result.pack.company.registry?.id, "0001562088");
  assert(
    result.evidence.sources.some((s) =>
      s.url.endsWith("letter.pdf") && s.text === recovery.pdfText
    ),
  );
  assert(
    result.evidence.sources.some((s) =>
      s.url === "https://uk.finance.yahoo.com/results"
    ),
  );
  assert(
    result.evidence.sources.some((s) =>
      s.url === identity.filingUrl && s.excerpted &&
      new TextEncoder().encode(s.text).length <= 300000
    ),
  );
  assert(
    result.pack.facts.some((f) =>
      f.metric === "revenue" && f.value === 40000 &&
      f.source.url.includes("companyfacts") && f.grade === "primary"
    ),
  );
  assert(
    result.evidence.fetches?.some((f) =>
      f.status === 403 && !f.kept && f.reason === "http-403"
    ),
  );
  assert(
    result.evidence.fetches?.some((f) =>
      f.status === 426 && f.reason === "provider-unavailable"
    ),
  );
  assert(
    result.evidence.fetches?.some((f) =>
      f.url === "https://duolingo.com/" && f.reason === "insufficient-text"
    ),
  );
  for (const call of calls) {
    assert(
      result.evidence.fetches?.some((f) =>
        f.url === call.url && f.status !== null
      ),
      call.url,
    );
    const sec = new URL(call.url).hostname.endsWith(".sec.gov");
    equal(
      call.headers.get("User-Agent"),
      sec ? "Mindmake parts research <test@example.invalid>" : RESEARCH_AGENT,
    );
    assert(call.headers.get("Accept")?.includes("application/pdf"));
  }
  const news = new URL(calls.find((c) => c.url.includes("newsapi.org"))!.url);
  equal(
    (Date.parse(news.searchParams.get("to")!) -
      Date.parse(news.searchParams.get("from")!)) / 86400000,
    29,
  );
  validatePack(result.pack, result.evidence);
});
Deno.test("SEC requests carry contact headers before binding and missing contact fails closed", async () => {
  const { deps, calls } = setup();
  await fetchResource(deps, "https://www.sec.gov/unbound.htm");
  equal(
    calls[0].headers.get("User-Agent"),
    "Mindmake parts research <test@example.invalid>",
  );
  deps.env = () => undefined;
  await rejects(() => fetchResource(deps, "https://data.sec.gov/unbound.json"));
  equal(calls.length, 1);
  equal(deps.fetchOutcomes!.at(-1)?.reason, "sec-contact-unavailable");
});
Deno.test("binding scans past 200 KB without retaining a document and stops at 20 MB", async () => {
  for (const present of [true, false]) {
    const { deps } = setup();
    const text = "x".repeat(present ? 900000 : MAX_FILING_BYTES) +
      " www.duolingo.com ";
    deps.fetch = async () => new Response(text);
    const result = await fetchResource(deps, identity.filingUrl, {
      cap: MAX_FILING_BYTES,
      scan: (text) => filingNamesDomain(text, identity.domain),
    });
    equal(result.matched, present);
    equal(result.bytes.length, 0);
    assert(result.outcome.bytes > 200000);
  }
});
Deno.test("coverage redirects use the public suffix list and refuse another registrable domain", async () => {
  for (
    const [from, target, accepted] of [
      ["finance.yahoo.com", "uk.finance.yahoo.com", true],
      ["finance.yahoo.com", "yahoo.com.evil.example", false],
      ["a.example.co.uk", "b.example.co.uk", true],
      ["a.example.co.uk", "b.other.co.uk", false],
      ["one.github.io", "two.github.io", false],
    ] as const
  ) {
    const { deps } = setup();
    let calls = 0;
    deps.fetch = async () =>
      ++calls === 1
        ? new Response(null, {
          status: 301,
          headers: { location: `https://${target}/` },
        })
        : html("ok");
    const job = () =>
      fetchResource(deps, `https://${from}/`, { coverageRedirects: true });
    if (accepted) equal((await job()).url, `https://${target}/`);
    else await rejects(job);
    equal(calls, accepted ? 2 : 1);
  }
});
Deno.test("PDF byte cap prevents extraction, parser failures and HTTP failures explain themselves", async () => {
  const { deps } = setup();
  const fetch = deps.fetch;
  let parsed = false;
  deps.extractPdf = async () => {
    parsed = true;
    throw new Error("bad PDF");
  };
  deps.fetch = async (input, init) =>
    String(input).endsWith("letter.pdf")
      ? new Response("%PDF-", {
        headers: {
          "content-type": "application/pdf",
          "content-length": "5000001",
        },
      })
      : fetch(input, init);
  await gather(firm(), buyer.useCase, deps);
  assert(!parsed);
  assert(
    deps.fetchOutcomes!.some((f) =>
      f.url.endsWith("letter.pdf") && f.reason === "byte-cap"
    ),
  );
  deps.fetch = fetch;
  await gather(firm(), buyer.useCase, deps);
  assert(parsed);
  assert(
    deps.fetchOutcomes!.some((f) =>
      f.url.endsWith("letter.pdf") && f.reason === "document-processing-failed"
    ),
  );
  equal(PDF_MODULE, "npm:unpdf@0.12.1");
});
Deno.test("filing excerpts cap UTF-8 text at 300 KB and preserve unjoined quote boundaries", () => {
  const selected = measureExcerpt(
    ("Revenue was $1m. " + "é".repeat(4000)).repeat(120),
    "results-commentary",
  );
  assert(new TextEncoder().encode(selected.text).length <= 300000);
  assert(selected.excerpted && selected.fragments.length > 1);
  const quote = selected.fragments[0].slice(-20) + " " +
    selected.fragments[1].slice(0, 20);
  const source = { ...base.source, ...selected } as Source;
  const checked = verifyFacts(
    [{ ...base.fact, quote, statement: quote }],
    [source],
    base.company as Company,
    new Date(base.now),
  );
  equal(checked.facts.length, 0);
});
Deno.test("reported values come from quotes with scale words, currency symbols and canonical periods", () => {
  for (const [quote, metric, unit, expected] of recovery.figures) {
    equal(
      quoteValue(quote as string, metric as string, unit as Fact["unit"]),
      expected,
    );
  }
  equal(canonicalPeriod("2026-09-30"), "2026-09");
  equal(canonicalPeriod("Q3 2026"), "Q3 2026");
  const quote = recovery.pdfText;
  const source = { ...base.source, text: quote } as Source;
  const checked = verifyFacts(
    [{
      ...base.fact,
      metric: "revenue",
      aliases: ["Sales", "SALES", "Turnover"],
      quote,
      statement: quote,
      value: 7,
      unit: "USD",
      period: "Q3 2026",
    }],
    [source],
    firm(),
    new Date(base.now),
  );
  equal(checked.facts[0]?.value, 1400000000);
  equal(checked.facts[0]?.aliases, ["sales", "turnover"]);
  assert(olderThan24Months(null, "2024-09", new Date(base.now)));
  assert(olderThan24Months(null, "Q3 2024", new Date(base.now)));
  assert(olderThan24Months(null, "H1 2024", new Date(base.now)));
  assert(!olderThan24Months(null, "2026-09", new Date(base.now)));
});
Deno.test("validator rejects forged numeric values, absent metrics and too many aliases", async () => {
  const { deps } = setup();
  const result = await buildPack(firm(), buyer, deps);
  assert(result.pack.facts.length);
  for (const change of ["value", "metric", "aliases"] as const) {
    const pack = structuredClone(result.pack),
      receipt = structuredClone(result.evidence);
    if (change === "value") pack.facts[0].value = 1234567;
    if (change === "metric") delete pack.facts[0].metric;
    if (change === "aliases") {
      pack.facts[0].aliases = Array.from({ length: 9 }, (_, i) => `alias ${i}`);
    }
    receipt.verifiedFacts = structuredClone(pack.facts);
    await rejects(() => validatePack(pack, receipt));
  }
});
Deno.test("robots disallow prevents fetching and homepage links do not start a crawl", async () => {
  assert(
    !robotsAllows(
      "User-agent: *\nDisallow: /private\nAllow: /private/public",
      "/private/item",
    ),
  );
  assert(
    robotsAllows(
      "User-agent: *\nDisallow: /private\nAllow: /private/public",
      "/private/public",
    ),
  );
  const { deps, calls } = setup();
  const fetch = deps.fetch;
  deps.fetch = async (input, init) =>
    String(input) === "https://investors.duolingo.com/robots.txt"
      ? html("User-agent: MindmakeResearch\nDisallow: /letter.pdf")
      : String(input) === "https://duolingo.com/"
      ? html(
        '<p>Duolingo, Inc. welcome to our website.</p><a href="/news/unlisted">News</a>',
      )
      : fetch(input, init);
  await gather(firm(), buyer.useCase, deps);
  assert(
    !calls.some((c) =>
      c.url.endsWith("letter.pdf") || c.url.includes("/news/unlisted")
    ),
  );
  assert(
    deps.fetchOutcomes!.some((f) =>
      f.url.endsWith("letter.pdf") &&
      f.reason === "robots-disallowed-or-unavailable"
    ),
  );
});
Deno.test("fetch receipts redact credential query values and record private-address rejection", async () => {
  const { deps } = setup();
  await fetchResource(
    deps,
    "https://api.example/generate?key=synthetic-secret",
  );
  assert(!JSON.stringify(deps.fetchOutcomes).includes("synthetic-secret"));
  deps.resolveHost = async () => ["127.0.0.1"];
  await rejects(() => fetchResource(deps, "https://api.example/private"));
  equal(deps.fetchOutcomes!.at(-1)?.reason, "non-public-address");
});
