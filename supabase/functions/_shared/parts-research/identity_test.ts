// Async fixtures implement the real transport interface.
// deno-lint-ignore-file require-await
import recovery from "./fixtures/identity-recovery.json" with { type: "json" };
import fixture from "./fixtures/research.json" with { type: "json" };
import { asCompany, identify } from "./identify.ts";
import { gather } from "./gather.ts";
import { buildPack, validatePack } from "./pack.ts";
import { runtime } from "./transport.ts";
import { CHIPS, type Company, type Dependencies } from "./types.ts";

function assert(value: unknown, message = "Assertion failed"): asserts value {
  if (!value) throw new Error(message);
}
function equal(a: unknown, b: unknown) {
  assert(
    JSON.stringify(a) === JSON.stringify(b),
    `Different: ${JSON.stringify(a)} != ${JSON.stringify(b)}`,
  );
}
async function rejects(fn: () => Promise<unknown>) {
  let failed = false;
  try {
    await fn();
  } catch {
    failed = true;
  }
  assert(failed, "Expected rejection");
}
const response = (value: unknown) =>
  new Response(typeof value === "string" ? value : JSON.stringify(value), {
    headers: {
      "content-type": typeof value === "string"
        ? "text/html"
        : "application/json",
    },
  });
// Reproduces the human-reported issuer failure using synthetic filing contents.
function issuerFixture(
  options: {
    filing?: string;
    home?: string;
    investorWebsite?: string;
    ambiguous?: boolean;
  } = {},
) {
  const calls: string[] = [];
  const deps: Dependencies = {
    now: () => new Date(fixture.now),
    env: (key) =>
      key === "SEC_CONTACT_EMAIL" ? "tests@example.invalid" : undefined,
    resolveHost: async () => ["93.184.216.34"],
    fetch: async (input, init) => {
      const url = String(input);
      calls.push(url);
      assert((init as RequestInit | undefined)?.redirect === "manual");
      if (url === "https://duolingo.com/") {
        return new Response("redirect body", {
          status: 302,
          headers: { location: "https://www.duolingo.com/" },
        });
      }
      if (url === "https://www.duolingo.com/") {
        return response(options.home ?? recovery.home);
      }
      if (url.endsWith("company_tickers.json")) {
        return response(
          options.ambiguous
            ? {
              ...recovery.tickers,
              "1": { cik_str: 999999, title: "Duolingo Group Limited" },
            }
            : recovery.tickers,
        );
      }
      if (url.includes("/submissions/CIK")) {
        return response({
          ...recovery.submission,
          investorWebsite: options.investorWebsite ?? "",
        });
      }
      if (url === recovery.filingUrl) {
        return response(options.filing ?? recovery.filing);
      }
      return new Response(null, { status: 404 });
    },
    complete: async () => '{"facts":[]}',
  };
  return { deps, calls };
}
const input = {
  company: recovery.company,
  domain: recovery.domain,
  workEmail: recovery.email,
};
Deno.test("slow registry preserves website checks in both modes and ticker cache is reused", async () => {
  for (const mode of ["pre-payment", "purchase"] as const) {
    const { deps, calls } = issuerFixture();
    const fetch = deps.fetch;
    let finished = false;
    deps.fetch = async (url, init) => {
      if (String(url).endsWith("company_tickers.json")) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        finished = true;
      }
      if (String(url) === "https://www.duolingo.com/") assert(!finished);
      return fetch(url, init);
    };
    const start = performance.now();
    const result = await identify({ ...input, mode }, deps);
    assert(result.verified?.checks.some((c) => c.check === "website"));
    if (mode === "pre-payment") {
      assert(performance.now() - start < 2950);
      await new Promise((resolve) => setTimeout(resolve, 400));
    } else {
      assert(finished);
      deps.fetch = fetch;
      const before = calls.filter((u) =>
        u.endsWith("company_tickers.json")
      ).length;
      await identify({ ...input, mode }, deps);
      // A different injected transport is isolated from the worker cache.
      equal(
        calls.filter((u) => u.endsWith("company_tickers.json")).length,
        before + 1,
      );
      await identify({ ...input, mode }, deps);
      equal(
        calls.filter((u) => u.endsWith("company_tickers.json")).length,
        before + 1,
      );
    }
  }
});
Deno.test("issuer homepage follows www redirect and verifies without a brand provider", async () => {
  const { deps, calls } = issuerFixture();
  const result = await identify(input, deps);
  assert(result.verified);
  equal(result.verified.checks.map((c) => c.check).sort(), [
    "website",
    "work-email-domain",
  ]);
  assert(calls.includes("https://www.duolingo.com/"));
  assert(
    !calls.some((u) => u.includes("/Archives/")),
    "Filing lookup must not run during identify",
  );
  equal(result.verified.registry, null);
  equal(
    result.candidates.find((c) => c.registry?.id === "0001562088")?.domain,
    "",
  );
});
Deno.test("identity matches title, og site name and visible text with repeated legal suffixes", async () => {
  for (
    const home of [
      recovery.home,
      recovery.ogHome,
      "<p>Welcome to Duolingo.</p>",
    ]
  ) {
    for (
      const suffix of [
        "Inc.",
        "Ltd",
        "plc",
        "Limited",
        "Group",
        "Group Limited",
      ]
    ) {
      const { deps } = issuerFixture({ home });
      const result = await identify(
        { ...input, company: `Duolingo ${suffix}` },
        deps,
      );
      assert(
        result.verified?.checks.some((c) => c.check === "website"),
        suffix,
      );
    }
  }
});
Deno.test("email check is independent of a failed website and free mail does not count", async () => {
  const { deps } = issuerFixture();
  const fetch = deps.fetch;
  deps.fetch = async (url, init) =>
    String(url).includes("duolingo.com")
      ? new Response(null, { status: 404 })
      : fetch(url, init);
  const result = await identify(input, deps);
  equal(result.verified, null);
  equal(
    result.candidates.find((c) => c.domain === recovery.domain)?.checks.map((
      c,
    ) => c.check),
    ["work-email-domain"],
  );
  const free = await identify({ ...input, workEmail: "cfo@gmail.com" }, deps);
  assert(
    !free.candidates.flatMap((c) => c.checks).some((c) =>
      c.check === "work-email-domain"
    ),
  );
});
Deno.test("website receives 1800ms while registry discovery runs alongside it", async () => {
  const { deps } = issuerFixture();
  const fetch = deps.fetch;
  deps.fetch = async (url, init) => {
    if (String(url) === "https://www.duolingo.com/") {
      await new Promise((resolve) => setTimeout(resolve, 1200));
    }
    return fetch(url, init);
  };
  const start = performance.now();
  const result = await identify(input, deps);
  assert(result.verified);
  assert(performance.now() - start < 2700);
});
Deno.test("redirect boundary refuses other domains, lookalikes, private targets and a fourth hop", async () => {
  for (
    const location of [
      "https://different.com/",
      "https://duolingo.com.evil.example/",
      "https://notduolingo.com/",
      "http://duolingo.com/",
      "https://127.0.0.1/",
    ]
  ) {
    const { deps, calls } = issuerFixture();
    deps.fetch = async (url) => {
      calls.push(String(url));
      return new Response(null, { status: 302, headers: { location } });
    };
    await rejects(() =>
      runtime(deps, undefined, recovery.domain).request("https://duolingo.com/")
    );
    equal(calls.length, 1);
  }
  for (const hops of [3, 4]) {
    const { deps, calls } = issuerFixture();
    deps.fetch = async (url) => {
      calls.push(String(url));
      return calls.length <= hops
        ? new Response(null, {
          status: 302,
          headers: { location: `https://sub${calls.length}.duolingo.com/` },
        })
        : response(recovery.home);
    };
    const job = () =>
      runtime(deps, undefined, recovery.domain).request(
        "https://duolingo.com/",
      );
    if (hops === 3) assert((await job()).ok);
    else await rejects(job);
    equal(calls.length, 4);
  }
  const { deps, calls } = issuerFixture();
  deps.resolveHost = async (host) =>
    host === "www.duolingo.com" ? ["127.0.0.1"] : ["93.184.216.34"];
  await rejects(() =>
    runtime(deps, undefined, recovery.domain).request("https://duolingo.com/")
  );
  equal(calls.length, 1);
});
Deno.test("SEC investorWebsite binds its parent domain during identity", async () => {
  const { deps } = issuerFixture({
    investorWebsite: "https://investors.duolingo.com/",
  });
  const result = await identify(input, deps);
  equal(result.verified?.registry?.id, "0001562088");
  assert(result.verified?.checks.some((c) => c.check === "sec-edgar"));
});
Deno.test("gather binds a unique SEC issuer through its latest primary 10-K and persists filing evidence", async () => {
  const { deps, calls } = issuerFixture();
  const result = await identify(input, deps);
  assert(result.verified);
  const original = asCompany(result.verified);
  const built = await buildPack(original, {
    company: recovery.company,
    role: "Chief Financial Officer",
    useCase: "results-commentary",
    useCaseLabel: CHIPS["results-commentary"],
  }, deps);
  equal(original.registry, null);
  equal(built.pack.company.registry?.id, "0001562088");
  equal(
    built.pack.company.verifiedBy.find((c) => c.check === "sec-edgar")?.url,
    recovery.filingUrl,
  );
  assert(
    built.evidence.sources.some((s) =>
      s.url === recovery.filingUrl && s.text.includes("www.duolingo.com")
    ),
  );
  assert(calls.some((u) => u.includes("/companyfacts/CIK0001562088")));
  validatePack(built.pack, built.evidence);
});
Deno.test("SEC binding refuses missing or lookalike domains, ambiguous issuers and unverified websites", async () => {
  for (
    const options of [{ filing: recovery.unrelatedFiling }, {
      filing: recovery.hostileFiling,
    }, { ambiguous: true }]
  ) {
    const { deps, calls } = issuerFixture(options);
    const result = await identify(input, deps);
    assert(result.verified);
    const firm = asCompany(result.verified);
    const sources = await gather(firm, "results-commentary", deps);
    equal(firm.registry, null);
    assert(
      !sources.some((s) =>
        s.category === "filing" || s.category === "registry"
      ),
    );
    assert(!calls.some((u) => u.includes("/companyfacts/")));
    if (options.ambiguous) assert(!calls.includes(recovery.filingUrl));
  }
  const { deps, calls } = issuerFixture();
  const firm = structuredClone(fixture.company) as Company;
  firm.verifiedBy = firm.verifiedBy.filter((c) => c.check !== "website");
  firm.verifiedBy.push({
    check: "brand-registry",
    detail: "Synthetic brand check.",
    url: "https://api.brandfetch.io/v2/brands/acme.example",
  });
  await gather(firm, "results-commentary", deps);
  equal(firm.registry, null);
  assert(!calls.some((u) => u.includes("/Archives/")));
});
