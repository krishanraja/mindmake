import { describe, expect, it } from "vitest";
import { homepageSectionsMarkup } from "@/components/homepage-release/homepageSections";
import { SITUATIONS, getUseCase } from "@/data/useCases";
import { WAYS } from "@/data/ways";

/* "Ways an AI brain can level you up." (Krish, 2026-11-28): one card per
   wish, each front a promise of fewer than ten words, each back its story in
   the record's own words; "In their words." follows it on the homepage, and
   nothing links to the retired /case-studies. */
describe("homepage ways and words", () => {
  it("gives every wish one card whose front is under ten words", () => {
    const wishes = new Set<string>(SITUATIONS.map((wish) => wish.id));
    expect(WAYS.filter((card) => wishes.has(card.wish)).map((card) => card.wish).sort()).toEqual([...wishes].sort());
    /* The three business cards folded in from the retired /ai-gtm (2026-11-28). */
    expect(WAYS.filter((card) => !wishes.has(card.wish)).map((card) => card.wish)).toEqual(["make", "share", "earn"]);
    for (const card of WAYS) expect(card.front.split(/\s+/).length, card.front).toBeLessThan(10);
  });

  it("maps the six wishes one to one onto the six parts of the brain", () => {
    const wishes = new Set<string>(SITUATIONS.map((wish) => wish.id));
    expect(new Set(WAYS.filter((card) => wishes.has(card.wish)).map((card) => card.part)).size).toBe(6);
  });

  it("tells each story in its record's own words", () => {
    for (const card of WAYS) {
      if (card.back.kind !== "story") continue;
      const entry = getUseCase(card.back.id);
      expect(card.back.heading).toBe(entry.heading);
      expect(card.back.outcome).toBe(entry.outcome);
      expect(card.back.result).toBe(entry.result?.headline);
    }
  });

  it("orders the sections ways, words, then the 30 days and the close", () => {
    const html = homepageSectionsMarkup();
    const at = (needle: string) => html.indexOf(needle);
    expect(at('id="ways"')).toBeGreaterThan(at('id="history"'));
    expect(at('id="words"')).toBeGreaterThan(at('id="ways"'));
    expect(at("We build yours with you in")).toBeGreaterThan(at('id="words"'));
    expect(html).toContain('Ways an AI brain can level <span class="hs-ul">you</span> up.');
    expect(html.match(/class="vs-tilt-card"/g)?.length).toBe(WAYS.length);
    expect(html).not.toContain("/case-studies");
    expect(html).not.toContain("What would you do more of?");
    expect(html).not.toContain("What the work made possible.");
  });
});
