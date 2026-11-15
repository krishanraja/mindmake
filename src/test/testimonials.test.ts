import { describe, it, expect } from "vitest";
import { testimonials, publishableTestimonials, publicClientQuotes, featuredQuotes, type Testimonial } from "@/data/testimonials";
import { clientStories } from "@/data/rebuildProof";
import { results, useCases } from "@/data/useCases";

/**
 * The promise this file enforces is that a shortened quote is still the
 * person's own words.
 *
 * A rail carrying 33 quotes needs them all about one line long. The tempting
 * way to get there is to rewrite each one, and a rewritten quote attributed to
 * a named person is not a quote. So every excerpt has to be a literal substring
 * of the full text, which a machine can check and a person cannot fudge.
 */
describe("testimonials", () => {
  it("holds all 33 voices", () => {
    expect(testimonials).toHaveLength(33);
  });

  it("gives every voice a unique id", () => {
    const ids = testimonials.map((voice) => voice.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("makes every excerpt an exact substring of the full quote", () => {
    for (const voice of testimonials) {
      expect(`${voice.id}: ${voice.full.includes(voice.excerpt)}`).toBe(`${voice.id}: true`);
    }
  });

  it("keeps every excerpt short enough for one line on the rail", () => {
    for (const voice of testimonials) {
      expect(`${voice.id}: ${voice.excerpt.length}`).toBe(`${voice.id}: ${Math.min(voice.excerpt.length, 108)}`);
    }
  });

  it("never leaves an excerpt equal to the whole quote when the quote is long", () => {
    /* An excerpt that is the entire quote is fine for a one-line quote and a
       sign of a missing excerpt for a paragraph. */
    for (const voice of testimonials) {
      if (voice.full.length <= 120) continue;
      expect(`${voice.id}: ${voice.excerpt === voice.full}`).toBe(`${voice.id}: false`);
    }
  });

  it("names every voice that is not an anonymised outcome", () => {
    for (const voice of testimonials) {
      const named = typeof voice.name === "string" && voice.name.length > 0;
      expect(`${voice.id}: ${named}`).toBe(`${voice.id}: ${voice.family !== "outcome"}`);
    }
  });

  it("gives every voice a role", () => {
    for (const voice of testimonials) {
      expect(`${voice.id}: ${voice.role.length > 0}`).toBe(`${voice.id}: true`);
    }
  });

  /* The consent rule, which predates this file: a client named on the site
     appears only where the consent is on record. Missing or failed consent
     data hides the entry rather than showing it unattributed. */
  it("publishes a named client only with recorded consent", () => {
    for (const voice of publishableTestimonials) {
      if (voice.family !== "client") continue;
      expect(`${voice.id}: ${voice.consent}`).toBe(`${voice.id}: recorded`);
    }
  });

  it("drops a named client whose consent is missing", () => {
    const withoutConsent: Testimonial = {
      id: "unconsented",
      family: "client",
      name: "Someone",
      role: "Client",
      excerpt: "a quote",
      full: "a quote",
    };
    const filtered = [...testimonials, withoutConsent]
      .filter((voice) => voice.family !== "client" || voice.consent === "recorded");
    expect(filtered.some((voice) => voice.id === "unconsented")).toBe(false);
  });

  /* Every result on the record names its quote by id and reads it from here,
     so no page can carry an older or an edited copy of what someone wrote. */
  it("gives every result the whole quote of an outcome voice in this file", () => {
    for (const result of results) expect(`${result.id}: ${testimonials.find((entry) => entry.id === result.quoteId)?.family}`).toBe(`${result.id}: outcome`);
    for (const story of clientStories) {
      const voice = testimonials.find((entry) => entry.id === story.voice);
      expect(`${story.id}: ${story.quote === voice?.full && story.attribution === voice?.role}`).toBe(`${story.id}: true`);
    }
  });

  it("names the featured quotes in their order, each part an exact substring", () => {
    expect(featuredQuotes.map((voice) => voice.id)).toEqual(["coaching-founder", "saas-gtm", "divekar", "fintech-founder", "scaleup-ops"]);
    for (const voice of testimonials.filter((entry) => entry.featured)) {
      expect(voice.full, voice.id).toContain(voice.featured!.excerpt);
      expect(voice.featured!.excerpt.length, voice.id).toBeLessThanOrEqual(108);
    }
  });

  it("keeps each use-case part an exact substring, keyed to a use case that names this quote", () => {
    let parts = 0;
    for (const voice of testimonials) {
      for (const [id, text] of Object.entries(voice.useCaseExcerpts ?? {})) {
        parts += 1;
        expect(voice.full, `${voice.id} ${id}`).toContain(text);
        expect(text!.length, `${voice.id} ${id}`).toBeLessThanOrEqual(125);
        expect(useCases.find((entry) => entry.id === id)?.quoteId, `${voice.id} ${id}`).toBe(voice.id);
      }
    }
    expect(parts).toBe(8);
  });

  it("makes the public client collection the eighteen clients and client outcomes", () => {
    expect(publicClientQuotes).toHaveLength(18);
    expect(publicClientQuotes.every((voice) => voice.family === "client" || voice.family === "outcome")).toBe(true);
  });

  it("keeps the four families apart", () => {
    const counts = testimonials.reduce<Record<string, number>>((tally, voice) => {
      tally[voice.family] = (tally[voice.family] ?? 0) + 1;
      return tally;
    }, {});
    expect(counts).toEqual({ session: 5, client: 4, outcome: 14, reference: 10 });
  });
});
