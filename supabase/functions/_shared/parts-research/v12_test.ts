// deno-lint-ignore-file require-await
import { xbrlExcerpt } from "./xbrl.ts";
import { xbrlPeriod } from "./periods.ts";
import { figureAliases } from "./figures.ts";
import { exhibitUrls } from "./exhibits.ts";
import { robotsGuard } from "./robots.ts";
import { extract, prepare, verifyFacts } from "./facts.ts";
import { buildPack } from "./pack.ts";
import base from "./fixtures/research.json" with { type: "json" };
import {
  CHIPS,
  type Company,
  type Dependencies,
  type Source,
} from "./types.ts";
function assert(v: unknown): asserts v {
  if (!v) throw new Error("Assertion failed");
}
const now = () => new Date(base.now);
const deps: Dependencies = {
  now,
  env: () => undefined,
  resolveHost: async () => ["93.184.216.34"],
  fetch: async () => new Response(null, { status: 404 }),
};
const row = (
  start: string | undefined,
  end: string,
  val: number,
  filed = "2026-11-01",
) => ({
  ...(start ? { start } : {}),
  end,
  val,
  filed,
  accn: "0000001234-26-000001",
});
const rows = [
  row("2026-01-01", "2026-09-30", 899428000),
  row("2026-07-01", "2026-09-30", 309007000),
  row("2026-07-01", "2026-09-30", 310000000, "2026-11-10"),
  row("2025-01-01", "2025-12-31", 1000000000),
];
const raw = JSON.stringify({
  facts: {
    "us-gaap": {
      Revenues: { units: { USD: rows } },
      CashAndCashEquivalentsAtCarryingValue: {
        units: { USD: [row(undefined, "2026-09-30", 400000000)] },
      },
    },
  },
});
Deno.test("v1.2 durations, exact measures, restatements and filing dates survive verification", async () => {
  const selected = xbrlExcerpt(raw, new Date("2025-11-17"));
  assert(
    selected.xbrl.some((x) => x.period === "9M 2026" && x.value === 899428000),
  );
  assert(
    selected.xbrl.some((x) =>
      x.period === "Q3 2026" && x.value === 310000000 &&
      x.published === "2026-11-10"
    ),
  );
  assert(!selected.xbrl.some((x) => x.value === 309007000));
  assert(
    selected.xbrl.some((x) =>
      x.metric === "cash and cash equivalents" && x.period === "at 2026-09-30"
    ),
  );
  assert(
    xbrlPeriod(rows[1])?.description === "three months to 30 September 2026",
  );
  assert(xbrlPeriod(row("2026-01-01", "2026-06-30", 1))?.period === "H1 2026");
  assert(xbrlPeriod(rows[3])?.period === "FY2025");
  assert(
    figureAliases(["cash", "income", "users", "cash and cash equivalents"])
      .length === 1,
  );
  const company = {
    ...base.company,
    registry: {
      authority: "SEC",
      id: "0000001234",
      status: "listed",
      url: "https://www.sec.gov/edgar/browse/?CIK=1234",
    },
  } as Company;
  const source = {
    ...base.source,
    ...selected,
    category: "registry",
    url: "https://data.sec.gov/api/xbrl/companyfacts/CIK0000001234.json",
    published: null,
  } as Source;
  const proposals = await extract([source], {
    company: "Acme",
    role: "CFO",
    useCase: "results-commentary",
    useCaseLabel: CHIPS["results-commentary"],
  }, { ...deps, complete: async () => null });
  const result = verifyFacts(proposals, [source], company, now());
  assert(result.facts.length === 4);
  assert(
    result.facts.some((f) =>
      f.period === "Q3 2026" && f.periodStart === "2026-07-01" &&
      f.source.published === "2026-11-10"
    ),
  );
  assert(
    prepare(result.facts, "CFO", "results-commentary").every((q) =>
      q.because.length <= 3 && q.question.includes("?")
    ),
  );
});
Deno.test("v1.2 extracts narrative KPIs and announcements alongside XBRL", async () => {
  const quote = "Daily active users reached 50 million in Q3 2026.";
  const launch = "Acme launched a new subscription in November 2026.";
  const source = { ...base.source, text: quote + " " + launch } as Source;
  const extracted = await extract([source], {
    company: "Acme",
    role: "CFO",
    useCase: "investor-update",
    useCaseLabel: CHIPS["investor-update"],
  }, {
    ...deps,
    complete: async (input) => {
      assert(
        input.system.includes("guidance") &&
          input.system.includes("ONLY to XBRL"),
      );
      return JSON.stringify({
        facts: [{
          ...base.fact,
          quote,
          statement: quote,
          metric: "daily active users",
          period: "Q3 2026",
          unit: null,
          sourceUrl: source.url,
        }, {
          ...base.fact,
          kind: "announcement",
          quote: launch,
          statement: launch,
          value: null,
          unit: null,
          period: null,
          sourceUrl: source.url,
        }],
      });
    },
  });
  assert(
    verifyFacts(extracted, [source], base.company as Company, now()).facts
      .length === 2,
  );
});
Deno.test("v1.2 follows only listed release exhibits and allows robots 4xx", async () => {
  const index =
    "https://www.sec.gov/Archives/edgar/data/1234/000000123426000001/";
  const html =
    '<table><tr><td><a href="letter.htm">letter</a></td><td>EX-99.1</td></tr><tr><td><a href="https://evil.example/other.htm">other</a></td><td>EX-99.1</td></tr></table>';
  assert(exhibitUrls(html, index).join() == index + "letter.htm");
  for (const status of [401, 403, 404, 429, 500, 503]) {
    const guard = robotsGuard({
      ...deps,
      fetch: async () => new Response(null, { status }),
    });
    assert(await guard("https://acme.example/release") === (status < 500));
  }
});
Deno.test("v1.2 revenue notFound agrees with retained XBRL facts", async () => {
  const company = {
    ...base.company,
    registry: {
      authority: "SEC",
      id: "0000001234",
      status: "listed",
      url: "https://www.sec.gov/edgar/browse/?CIK=1234",
    },
  } as Company;
  const result = await buildPack(company, {
    company: "Acme",
    role: "CFO",
    useCase: "results-commentary",
    useCaseLabel: CHIPS["results-commentary"],
  }, {
    ...deps,
    env: (k) => k === "SEC_CONTACT_EMAIL" ? "test@example.invalid" : undefined,
    complete: async () => null,
    fetch: async (url) =>
      String(url).includes("companyfacts")
        ? new Response(raw)
        : new Response(null, { status: 404 }),
  });
  assert(result.pack.facts.some((f) => f.metric === "revenue"));
  assert(
    !result.pack.notFound.some((s) => s.includes("No verified public revenue")),
  );
});

Deno.test("v1.2 keeps only five quarters and robots timeout retries once", async () => {
  const many = Array.from({ length: 8 }, (_, i) => {
    const end = new Date(Date.UTC(2026, 9 - i * 3, 0));
    const start = new Date(
      Date.UTC(end.getUTCFullYear(), end.getUTCMonth() - 2, 1),
    );
    return row(
      start.toISOString().slice(0, 10),
      end.toISOString().slice(0, 10),
      i + 1,
    );
  });
  const selected = xbrlExcerpt(
    JSON.stringify({ Revenues: { units: { USD: many } } }),
    new Date("2025-11-17"),
  );
  assert(selected.xbrl.length === 5);
  let calls = 0;
  const guard = robotsGuard({
    ...deps,
    fetchOutcomes: [],
    fetch: async () => {
      calls++;
      if (calls === 1) return await new Promise<Response>(() => {});
      return new Response(null, { status: 403 });
    },
  });
  assert(await guard("https://acme.example/release"));
  assert(calls === 2);
});
