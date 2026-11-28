import { describe, expect, it } from "vitest";
import { leadershipChaptersMarkup, leadershipStories, type LeadershipStory } from "@/components/leadership-chapters/leadershipChapters";
import { SITUATIONS, storyById } from "@/components/leadership-chapters/storyFinder";
import { publishableTestimonials } from "@/data/testimonials";
import { results } from "@/data/useCases";

/* A story joined to a result on the record must be that client's story: the
   quote it carries is the record's own voice (Krish, 15 October 2026,
   AI-BRAIN-STORIES-OUTCOMES-001). */
const sameClient = (story: LeadershipStory) => {
  if (!story.record) return true;
  const record = results.find((entry) => entry.id === story.record);
  return !!record && (!story.quote || story.quote.testimonialId === record.quoteId);
};

/* The AI Brain stories. Their words are claims the business stands behind, so
   the rules that keep them true are tested, not remembered. */
describe("AI Brain stories", () => {
  it("tells every story in full: where the leader was and what happened", () => {
    /* The headings themselves are pinned word for word against the content
       source in src/test/use-case-parity.test.ts. */
    for (const story of leadershipStories) {
      expect(story.situation, story.heading).toBeTruthy();
      expect(story.happened, story.heading).toBeTruthy();
    }
  });

  it("is one client to a card: eighteen stories, each with the outcome it led to", () => {
    /* Fifteen, then two more on 24 October 2026: the fintech leader (first
       written up as insurance, corrected by Krish on 11 November 2026) and the
       investor, both in "Seeing what is changing", from Krish's own account. */
    expect(leadershipStories).toHaveLength(18);
    expect(new Set(leadershipStories.map((story) => story.heading)).size).toBe(18);
    for (const story of leadershipStories) expect(story.outcome, story.heading).toBeTruthy();
    /* Krish, 2026-11-11: "This is actually a fintech leader". */
    const leader = leadershipStories.find((story) => story.heading.startsWith("A fintech leader"));
    expect(leader?.situation).toMatch(/^A senior fintech leader/);
    expect(JSON.stringify(leadershipStories)).not.toMatch(/insurance/i);
  });

  it("joins a story to a result on the record only where the quote is that same client's", () => {
    const joined = leadershipStories.filter((story) => story.record);
    expect(joined.map((story) => story.record).sort()).toEqual(results.map((result) => result.id).sort());
    expect(results).toHaveLength(8);
    for (const story of joined) expect(sameClient(story), story.heading).toBe(true);
    /* Negative control: the right words under the wrong client fail. */
    const swapped = { ...joined[0], quote: { testimonialId: "media-cro", text: "He doesn't want to loiter." } };
    expect(joined[0].record).not.toBe("day-one");
    expect(sameClient(swapped)).toBe(false);
    expect(sameClient({ ...joined[0], record: "no-such-result" })).toBe(false);
  });

  it("puts every story on its own scene (Krish, 2026-11-04: every card has a picture)", () => {
    for (const story of leadershipStories) expect(story.scene, story.heading).toMatch(/\.webp$/);
    expect(new Set(leadershipStories.map((story) => story.scene)).size).toBe(leadershipStories.length);
  });

  it("files every story under exactly one of the six wishes, including an examples-only wish", () => {
    expect(SITUATIONS).toHaveLength(6);
    expect(SITUATIONS.map((situation) => situation.useCases.length)).toEqual([2, 0, 4, 4, 5, 3]);
    const filed = SITUATIONS.flatMap((situation) => {
      return situation.useCases.map((id) => storyById(leadershipStories, id));
    });
    expect(new Set(filed).size).toBe(filed.length);
    expect([...filed].sort((a, b) => a.heading.localeCompare(b.heading))).toEqual([...leadershipStories].sort((a, b) => a.heading.localeCompare(b.heading)));
    for (const id of ["C-02", "C-15", "C-16"] as const) expect(storyById(leadershipStories, id).quote).toBeUndefined();
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
      expect(story.heading.length).toBeLessThanOrEqual(124);
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
    expect(cards).toHaveLength(18);
    const dom = new DOMParser().parseFromString(human, "text/html");
    expect(dom.querySelectorAll(".story-example")).toHaveLength(12);
    expect(dom.querySelector("#finder-panel-terms .finder-card")).toBeNull();
    expect(dom.querySelector("#finder-panel-terms .story-example-label")?.textContent).toBe("EXAMPLE");
    for (const story of leadershipStories) {
      expect(plain.split(`<span class="finder-heading">${story.heading.replaceAll("\u00a0", " ")}</span>`)).toHaveLength(2);
      expect(plain).toContain(`<span class="finder-outcome">${story.outcome.replaceAll("\u00a0", " ")}</span>`);
    }
    for (const situation of SITUATIONS) expect(plain).toContain(`<h3 class="finder-situation">${situation.label}</h3>`);
    /* Each result links to the homepage's ways, where the stories now live (2026-11-28). */
    expect([...human.matchAll(/class="finder-proof" href="\/#ways"/g)]).toHaveLength(8);
    /* The sheet shows the result itself, headline and detail, after the outcome. */
    for (const result of results) expect(plain).toContain(result.headline);
    expect(human).not.toMatch(/success story/i);
    expect(human).not.toContain(" hidden");
  });
});
