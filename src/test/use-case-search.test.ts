import { describe, expect, it } from "vitest";
import { conceptsOf, distance, indexUseCases, searchUseCases, stem, SEARCH_PROMPTS } from "@/lib/useCaseSearch";
import { useCases } from "@/data/useCases";

/* The index the finder builds, from the same record fields it searches. */
const INDEX = indexUseCases(useCases.map((u) => ({ id: u.id, text: [u.heading, u.outcome, u.startingPoint, u.whatWeDid, u.result?.headline, u.result?.detail].filter(Boolean).join(" ") })));
const top = (query: string, n = 3) => searchUseCases(INDEX, query).ranked.slice(0, n).map((r) => r.id);

describe("searching the use cases by meaning", () => {
  it("stems and measures spelling", () => {
    expect(stem("posting")).toBe(stem("posts"));
    expect(stem("newsletters")).toBe(stem("newsletter"));
    expect(distance("spredsheet", "spreadsheet")).toBe(1);
    expect(distance("pricing", "broadcast")).toBeGreaterThan(3);
  });

  it("understands what a reader means, not only the words they use", () => {
    expect(conceptsOf("scale my business").get("growth")).toBe(3);
    expect(top("too many AI tools")).toContain("C-18");
    expect(top("cut costs")).toContain("C-18");
    expect(top("should we build or partner")[0]).toBe("C-15");
    expect(top("what should I charge")).toContain("C-08");
    expect(top("I hate spreadsheets")[0]).toBe("C-11");
    expect(top("keep up with my industry")).toEqual(expect.arrayContaining(["C-04"]));
    expect(top("I read too many newsletters")[0]).toBe("C-06");
    expect(top("private equity deal sourcing")[0]).toBe("C-05");
    expect(top("turn our consulting into a product")).toContain("C-16");
  });

  it("forgives a typo", () => {
    expect(top("spredsheets")[0]).toBe("C-11");
    expect(top("newsleters")[0]).toBe("C-06");
  });

  it("always suggests the closest match, never an empty page", () => {
    for (const query of ["zzqx", "blockchain tokenomics", "a", "!!!"]) {
      const found = searchUseCases(INDEX, query);
      expect(found.ranked.length, query).toBeGreaterThan(0);
    }
    expect(searchUseCases(INDEX, "zzqx").closest).toBe(true);
    expect(searchUseCases(INDEX, "pricing").closest).toBe(false);
  });

  it("lands every prompt the box offers on a real match", () => {
    for (const prompt of SEARCH_PROMPTS) {
      const found = searchUseCases(INDEX, prompt);
      expect(found.closest, prompt).toBe(false);
      expect(found.ranked.length, prompt).toBeGreaterThan(0);
    }
    expect(top("Cut my AI tools")).toContain("C-18");
    expect(top("Post more often")[0]).toBe("C-01");
    expect(top("Price my product")).toContain("C-08");
    expect(top("Make a big AI call")).toContain("C-15");
    expect(top("Get my team in step")).toContain("C-12");
  });

  it("returns every use case, in order, for an empty query", () => {
    expect(searchUseCases(INDEX, "  ").ranked.map((r) => r.id)).toEqual(useCases.map((u) => u.id));
  });
});
