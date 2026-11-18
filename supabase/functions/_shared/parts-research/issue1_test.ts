// Issue 1: one fact that fails the pack check is dropped with its reason, never
// the whole pack. Offline: every fetch and model reply is a local fixture.
import run9 from "./fixtures/letter-run9.json" with { type: "json" };
import fixture from "./fixtures/research.json" with { type: "json" };
import { buildPack, factProblem, validatePack } from "./pack.ts";
import { CHIPS, type Company, type Dependencies, type Fact } from "./types.ts";

function assert(x: unknown, message = "Assertion failed"): asserts x {
  if (!x) throw new Error(message);
}
const buyer = {
  company: "Acme",
  role: "CFO",
  useCase: "results-commentary" as const,
  useCaseLabel: CHIPS["results-commentary"],
};
const letter = (clock: { late: boolean }): Dependencies => ({
  now: () =>
    new Date(Date.parse(fixture.now) + (clock.late ? 400_000 : 0)),
  env: () => undefined,
  resolveHost: async () => ["93.184.216.34"],
  extractions: [],
  fetch: async (input) =>
    String(input).endsWith("robots.txt")
      ? new Response("", { status: 404 })
      : new Response(
        `<html><title>Q3 2026 shareholder letter</title><meta property="article:published_time" content="2026-11-03"><body>${run9.table} ${run9.prose}</body></html>`,
        { headers: { "content-type": "text/html" } },
      ),
  complete: async () =>
    JSON.stringify({
      facts: [{
        ...fixture.fact,
        quote: run9.prose,
        statement: run9.prose,
        metric: "cash and short-term investments",
        unit: "USD",
        period: null,
      }],
    }),
});

Deno.test("issue 1: a fact altered after verification is the only one factProblem rejects", async () => {
  const { pack, evidence } = await buildPack(
    fixture.company as Company,
    buyer,
    letter({ late: false }),
  );
  validatePack(pack, evidence);
  assert(pack.facts.length >= 2, "needs at least two facts");
  const ctx = {
    company: pack.company,
    builtAt: pack.builtAt,
    evidence,
  };
  assert(pack.facts.every((f) => factProblem(f, ctx) === null));
  const figure = pack.facts.find((f) => f.kind === "reported-figure")!;
  const altered: Fact = { ...figure, value: (figure.value ?? 0) + 1 };
  const reason = factProblem(altered, ctx);
  assert(reason !== null && !/^Invalid research pack/.test(reason), reason ?? "");
  assert(
    pack.facts.filter((f) => f !== figure).every((f) =>
      factProblem(f, ctx) === null
    ),
  );
});

Deno.test("issue 1: facts that fail the pack check are dropped with a reason, and the pack still builds", async () => {
  // The clock jumps 400 s between fetching and assembly, past the 300 s
  // freshness window, so every fact fails "source not from this build".
  // Before issue 1 this threw and lost the whole pack.
  const clock = { late: false };
  const d = letter(clock);
  const complete = d.complete!;
  d.complete = async (...args) => {
    clock.late = true;
    return await complete(...args);
  };
  const { pack, evidence, counts } = await buildPack(
    fixture.company as Company,
    buyer,
    d,
  );
  validatePack(pack, evidence);
  const drops = (evidence.droppedProposals ?? []).filter((p) =>
    p.reason.startsWith("pack-check: ")
  );
  assert(drops.length > 0, "expected pack-check drops");
  assert(
    drops.every((p) => p.reason === "pack-check: source not from this build"),
    JSON.stringify(drops.map((p) => p.reason)),
  );
  assert(pack.facts.length === 0 && counts.factsKept === 0);
  assert(counts.dropped["pack-check: source not from this build"] === drops.length);
  assert(Object.keys(evidence.factMetadata ?? {}).length === 0);
  assert(
    pack.notFound.some((s) => /No company facts passed/.test(s)),
    "the empty pack says why",
  );
});

Deno.test("issue 1: a clock that moves under the window between gather and assembly keeps every fact", async () => {
  const late = { late: false };
  const d = letter(late);
  const base = Date.parse(fixture.now);
  let calls = 0;
  d.now = () => new Date(base + (calls++ > 0 && late.late ? 200_000 : 0));
  const complete = d.complete!;
  d.complete = async (...args) => {
    late.late = true;
    return await complete(...args);
  };
  const { pack, evidence } = await buildPack(
    fixture.company as Company,
    buyer,
    d,
  );
  validatePack(pack, evidence);
  assert(pack.facts.length >= 2);
  assert(
    !(evidence.droppedProposals ?? []).some((p) =>
      p.reason.startsWith("pack-check: ")
    ),
  );
});
