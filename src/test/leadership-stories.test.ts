import { describe, expect, it } from "vitest";
import { keptHeadings, leadershipChaptersMarkup, leadershipStories, type LeadershipStory } from "@/components/leadership-chapters/leadershipChapters";
import { SITUATIONS, storyByStart } from "@/components/leadership-chapters/storyFinder";
import { clientStories } from "@/data/rebuildProof";
import { publishableTestimonials } from "@/data/testimonials";

/* A story joined to a result on the record must be that client's story: the
   quote it carries is the record's own voice (Krish, 15 October 2026,
   AI-BRAIN-STORIES-OUTCOMES-001). */
const sameClient = (story: LeadershipStory) => {
  if (!story.record) return true;
  const record = clientStories.find((entry) => entry.id === story.record);
  return !!record && (!story.quote || story.quote.testimonialId === record.voice);
};

/* The AI Brain stories. Their words are claims the business stands behind, so
   the rules that keep them true are tested, not remembered. */
describe("AI Brain stories", () => {
  it("keeps the four approved headings word for word, each a full story", () => {
    const kept = leadershipStories.filter((story) => (keptHeadings as readonly string[]).includes(story.heading));
    expect(kept.map((story) => story.heading).sort()).toEqual([...keptHeadings].sort());
    for (const story of leadershipStories) expect(story.situation, story.heading).toBeTruthy();
  });

  it("is one client to a card: fifteen stories, each with the outcome it led to", () => {
    expect(leadershipStories).toHaveLength(15);
    expect(new Set(leadershipStories.map((story) => story.heading)).size).toBe(15);
    for (const story of leadershipStories) expect(story.outcome, story.heading).toBeTruthy();
  });

  it("joins a story to a result on the record only where the quote is that same client's", () => {
    const joined = leadershipStories.filter((story) => story.record);
    expect(joined.map((story) => story.record).sort()).toEqual(["business-first", "day-one", "hand-back", "market-moves", "own-system", "simple-product", "team-decides"]);
    for (const story of joined) expect(sameClient(story), story.heading).toBe(true);
    /* Negative control: the right words under the wrong client fail. */
    const swapped = { ...joined[0], quote: { testimonialId: "media-cro", text: "He doesn't want to loiter." } };
    expect(joined[0].record).not.toBe("day-one");
    expect(sameClient(swapped)).toBe(false);
    expect(sameClient({ ...joined[0], record: "no-such-result" })).toBe(false);
  });

  it("gives every story a scene or, where it has none, its before and after", () => {
    for (const story of leadershipStories) expect(Boolean(story.scene) || Boolean(story.figure), story.heading).toBe(true);
  });

  it("files every story under exactly one of five situations, three to each", () => {
    expect(SITUATIONS).toHaveLength(5);
    const filed = SITUATIONS.flatMap((situation) => {
      expect(situation.cards, situation.label).toHaveLength(3);
      return situation.cards.map((start) => storyByStart(leadershipStories, start));
    });
    expect(new Set(filed).size).toBe(filed.length);
    expect([...filed].sort((a, b) => a.heading.localeCompare(b.heading))).toEqual([...leadershipStories].sort((a, b) => a.heading.localeCompare(b.heading)));
    expect(SITUATIONS.map((situation) => situation.door)).toEqual(["brain", "brain", "brain", "gtm", "gtm"]);
  });

  it("quotes only exact, unedited substrings of a publishable testimonial, and names its leader by that testimonial's role", () => {
    for (const story of leadershipStories.filter((s) => s.quote)) {
      const source = publishableTestimonials.find((t) => t.id === story.quote!.testimonialId);
      expect(source, story.quote!.testimonialId).toBeDefined();
      expect(source!.full).toContain(story.quote!.text);
      /* The role's sector words, as the story sets them (an article held to its noun). */
      const sector = source!.role.split(",").slice(1).join(",").trim();
      expect(story.situation!.replaceAll("\u00a0", " ")).toContain(sector);
    }
  });

  it("tells a full story in five parts, in our words, inside its budget", () => {
    for (const story of leadershipStories.filter((s) => s.situation)) {
      expect(story.happened).toBeTruthy();
      const parts = [story.heading, story.situation!, story.happened!, story.outcome, story.quote?.text ?? ""];
      for (const part of parts) {
        expect(part).not.toMatch(/[—–]/);
        expect(part).not.toMatch(/\bnot\b[^.]*,\s*but\b/i);
      }
      /* Budgets that keep every card and sheet short enough to read at a glance. */
      expect(story.heading.length).toBeLessThanOrEqual(80);
      expect(story.situation!.length).toBeLessThanOrEqual(150);
      expect(story.happened!.length).toBeLessThanOrEqual(210);
      expect(story.outcome.length).toBeLessThanOrEqual(100);
      /* A whole sentence from the client reads better in the sheet than a cut one. */
      expect((story.quote?.text ?? "").length).toBeLessThanOrEqual(125);
    }
  });

  it("server-renders every story once, each with its outcome, and every situation, with nothing to unhide", () => {
    const markup = leadershipChaptersMarkup();
    const human = markup.slice(markup.indexOf('<section class="human-proof'), markup.indexOf('<div class="proof-return">'));
    const plain = human.replaceAll("\u00a0", " ");
    const cards = human.match(/<li class="finder-card">/g) ?? [];
    expect(cards).toHaveLength(15);
    for (const story of leadershipStories) {
      expect(plain.split(`<span class="finder-heading">${story.heading.replaceAll("\u00a0", " ")}</span>`)).toHaveLength(2);
      expect(plain).toContain(`<span class="finder-outcome">${story.outcome.replaceAll("\u00a0", " ")}</span>`);
    }
    for (const situation of SITUATIONS) expect(human).toContain(`<h3 class="finder-situation">${situation.label}</h3>`);
    const proofs = [...human.matchAll(/href="\/case-studies#story=([^"]+)"/g)].map((m) => m[1]);
    expect(proofs).toHaveLength(7);
    for (const id of proofs) expect(clientStories.map((entry) => entry.id)).toContain(id);
    expect(human).not.toMatch(/success story/i);
    expect(human).not.toContain(" hidden");
  });
});
