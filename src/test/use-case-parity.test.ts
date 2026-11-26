import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import fixture from "./fixtures/stories-export-2026-11-11.json";
import { featuredQuotes, publicClientQuotes, testimonials, type Testimonial } from "@/data/testimonials";
import { SITUATIONS, results, useCases, type UseCase, type UseCaseId } from "@/data/useCases";

/**
 * The site's use cases and quotes against the owner's cleaned content file of
 * 11 to 15 November 2026 (fixture made by scripts/extract-stories-export.mjs).
 * Every word on a record must equal the file, every reference must resolve to
 * the right quote, and nothing the file retired may come back.
 */

type FixtureUseCase = (typeof fixture.useCases)[number];
type FixtureQuote = (typeof fixture.quotes)[number];

/* Headings the owner allowed to be shortened where that reads better without
   losing meaning (Krish, 2026-11-15: "you are free to shorten if it makes the
   UX better and does not lose any meaning"), approved on the rendered preview
   the same day: "Happy With your recommendations". */
const HEADING_RULINGS: Partial<Record<UseCaseId, { status: "pending" | "approved"; text: string }>> = {
  // Ruling (Krish, 2026-11-25): stories overhaul
  "C-16": { status: "approved", text: "Media advisers turned their expertise into an offer clients could buy." },
  "C-09": { status: "approved", text: "A head of operations is hands-on again, building systems from the best of what's new and proven, fitted to their exact work." },
  "C-10": { status: "approved", text: "Someone new to AI now talks their own dashboard into existence, anchored to their north star values." },
};

const EVIDENCE: Record<UseCase["evidence"], RegExp> = {
  result: /^Result on the record: `R-[a-z-]+`\.$/,
  "practice-account": /^Krish’s own account\.$/,
  "practice-account-quote": /^Krish’s own account and the client quotation referenced below\.$/,
  "practice-account-figure": /^Krish’s own account and figure from the engagement\. The five-times-faster figure is owner-reported\.$/,
};

const qid = (id: string) => id.replace(/^Q-/, "");
const basename = (path: string) => path.split("/").pop()!.split("?")[0];
const attribution = (voice: Testimonial) => (voice.name ? `${voice.name}, ${voice.role}` : voice.role);

/** Every way a record can disagree with the file, as readable lines. */
function useCaseProblems(entry: UseCase, source: FixtureUseCase): string[] {
  const problems: string[] = [];
  const ruling = HEADING_RULINGS[entry.id];
  const heading = ruling ? ruling.text : source.heading;
  if (entry.heading !== heading) problems.push(`${entry.id} heading`);
  for (const key of ["outcome", "startingPoint", "whatWeDid"] as const) if (entry[key] !== source[key]) problems.push(`${entry.id} ${key}`);
  if ((entry.quoteId ?? null) !== (source.quoteId ? qid(source.quoteId) : null)) problems.push(`${entry.id} quoteId`);
  if (!basename(entry.picture).startsWith(source.picture.replace(/\.webp$/, ""))) problems.push(`${entry.id} picture`);
  if (!EVIDENCE[entry.evidence].test(source.evidence)) problems.push(`${entry.id} evidence`);
  if (Boolean(entry.result) !== Boolean(source.result)) problems.push(`${entry.id} result presence`);
  if (entry.result && source.result) {
    if (`R-${entry.result.id}` !== source.result.id) problems.push(`${entry.id} result id`);
    if (entry.result.headline !== source.result.headline) problems.push(`${entry.id} result headline`);
    if (entry.result.detail !== source.result.detail) problems.push(`${entry.id} result detail`);
    if (entry.result.quoteId !== qid(source.result.quoteId!)) problems.push(`${entry.id} result quote`);
  }
  return problems;
}

function quoteProblems(voice: Testimonial | undefined, source: FixtureQuote): string[] {
  if (!voice) return [`${source.id} missing`];
  const problems: string[] = [];
  if (voice.full !== source.full) problems.push(`${source.id} full`);
  if (voice.excerpt !== source.excerpt) problems.push(`${source.id} excerpt`);
  if (voice.family !== source.relationship) problems.push(`${source.id} relationship`);
  if (attribution(voice) !== source.attribution) problems.push(`${source.id} attribution`);
  if ((voice.featured?.excerpt ?? null) !== source.featuredExcerpt) problems.push(`${source.id} featured excerpt`);
  if (JSON.stringify(voice.useCaseExcerpts ?? {}) !== JSON.stringify(source.useCaseExcerpts)) problems.push(`${source.id} use-case excerpts`);
  for (const part of [voice.excerpt, voice.featured?.excerpt, ...Object.values(voice.useCaseExcerpts ?? {})]) {
    if (part !== undefined && !voice.full.includes(part)) problems.push(`${source.id} part not in full`);
  }
  return problems;
}

describe("use cases and quotes match the content source", () => {
  it("has eighteen use cases in the six wishes, in order", () => {
    expect(useCases.map((entry) => entry.id)).toEqual(fixture.useCases.map((entry) => entry.id));
    expect(SITUATIONS.map((situation) => situation.label)).toEqual(fixture.groups.map((group) => group.label));
    expect(useCases.map((entry) => entry.door)).toEqual([...Array(11).fill("brain"), ...Array(7).fill("gtm")]);
    expect(SITUATIONS.map((situation) => [...situation.useCases])).toEqual(fixture.groups.map((group) => group.useCases));
  });

  it("holds every use case and its result word for word", () => {
    const problems = useCases.flatMap((entry) => useCaseProblems(entry, fixture.useCases.find((source) => source.id === entry.id)!));
    expect(problems).toEqual([]);
  });

  it("attaches the eight results to the right use cases", () => {
    expect(results.map((result) => result.useCase)).toEqual(["C-01", "C-02", "C-08", "C-11", "C-15", "C-16", "C-17", "C-18"]);
    expect(results.map((result) => `R-${result.id}`)).toEqual(fixture.useCases.flatMap((entry) => (entry.result ? [entry.result.id] : [])));
  });

  it("keeps one full record for each of the thirty-three quotes", () => {
    expect(testimonials).toHaveLength(33);
    expect(testimonials.map((voice) => `Q-${voice.id}`).sort()).toEqual(fixture.quotes.map((quote) => quote.id).sort());
    const problems = fixture.quotes.flatMap((source) => quoteProblems(testimonials.find((voice) => `Q-${voice.id}` === source.id), source));
    expect(problems).toEqual([]);
  });

  it("makes the public collection eighteen, with the five featured in their order", () => {
    expect(publicClientQuotes.map((voice) => `Q-${voice.id}`)).toEqual(fixture.quotes.filter((quote) => quote.relationship === "client" || quote.relationship === "outcome").map((quote) => quote.id));
    expect(featuredQuotes.map((voice) => ({ order: voice.featured!.order, id: `Q-${voice.id}` }))).toEqual(fixture.featured);
  });

  it("resolves every quote reference to that client's own record", () => {
    for (const entry of useCases) {
      if (entry.quoteId) expect(testimonials.find((voice) => voice.id === entry.quoteId)?.useCaseExcerpts?.[entry.id], entry.id).toBeTruthy();
      if (entry.result) expect(testimonials.find((voice) => voice.id === entry.result!.quoteId)?.family, entry.id).toBe("outcome");
    }
  });

  it("names every role only in words the use case itself uses", () => {
    for (const entry of useCases) expect(`${entry.heading} ${entry.startingPoint}`, entry.id).toContain(entry.roleWords);
  });

  it("records each approved heading change and keeps every other heading exact", () => {
    const differing = fixture.useCases.filter((source) => useCases.find((entry) => entry.id === source.id)!.heading !== (source.originalHeading ?? source.heading)).map((source) => source.id);
    for (const source of fixture.useCases.filter((entry) => entry.originalHeading)) {
      expect(HEADING_RULINGS[source.id as UseCaseId]).toEqual({ status: "approved", text: source.heading });
    }
    expect(differing.sort()).toEqual(Object.keys(HEADING_RULINGS).sort());
  });

  it("catches each kind of drift (negative controls)", () => {
    const c11 = useCases.find((entry) => entry.id === "C-11")!;
    const s11 = fixture.useCases.find((source) => source.id === "C-11")!;
    expect(useCaseProblems({ ...c11, heading: "A CRO who hates the numbers can become better at using them." }, s11)).toEqual(["C-11 heading"]);
    expect(useCaseProblems({ ...c11, result: { ...c11.result!, quoteId: "media-cro" } }, s11)).toEqual(["C-11 result quote"]);
    expect(useCaseProblems({ ...c11, result: undefined, evidence: "practice-account" }, s11)).toContain("C-11 result presence");
    const gates = testimonials.find((voice) => voice.id === "gately")!;
    const sGates = fixture.quotes.find((quote) => quote.id === "Q-gately")!;
    expect(quoteProblems({ ...gates, name: "James Gately" }, sGates)).toEqual(["Q-gately attribution"]);
    expect(quoteProblems({ ...gates, full: gates.full.replace("halt", "stop") }, sGates)).toContain("Q-gately full");
    expect(quoteProblems({ ...gates, excerpt: "not in the quote" }, sGates)).toContain("Q-gately part not in full");
    expect(quoteProblems(undefined, sGates)).toEqual(["Q-gately missing"]);
  });
});

describe("retired wording and private material stay out", () => {
  const files = (dir: string): string[] => readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return name === "fixtures" ? [] : files(path);
    return /\.(ts|tsx|js|mjs|json|css|html)$/.test(name) ? [path] : [];
  });
  const sources = files("src").filter((path) => !path.endsWith("use-case-parity.test.ts"));

  it("does not bring back old variants anywhere in the site source", () => {
    const retired = ["hates the numbers", "James Gately", "sales path led to a paid test", "defined investment plan", "signed before the work ended", "Position and price rebuilt", "roughly monthly", "contnues", "aroudn"];
    const found = sources.flatMap((path) => {
      const text = readFileSync(path, "utf8");
      return retired.filter((phrase) => text.includes(phrase)).map((phrase) => `${path}: ${phrase}`);
    });
    expect(found).toEqual([]);
  });

  it("keeps private engagement detail out of the records", () => {
    for (const path of ["src/data/useCases.ts", "src/data/testimonials.ts", "src/data/rebuildProof.ts"]) {
      const text = readFileSync(path, "utf8");
      expect(text, path).not.toMatch(/\bR-0\d\b/);
      expect(text, path).not.toMatch(/\$\s?\d/);
      expect(text, path).not.toMatch(/\b(40|75|22)%/);
      expect(text, path).not.toMatch(/\bPOC\b/);
    }
  });

  it("builds the use-case and quote records from nothing but each other and their pictures", () => {
    const imports = (path: string) => [...readFileSync(path, "utf8").matchAll(/^import (type )?[^;]* from "([^"]+)";$/gm)].map((m) => ({ type: Boolean(m[1]), from: m[2] }));
    for (const { type, from } of imports("src/data/useCases.ts")) expect(type || from === "@/data/testimonials" || from.startsWith("@/assets/stories/"), from).toBe(true);
    for (const { type, from } of imports("src/data/testimonials.ts")) expect(type, from).toBe(true);
  });
});
