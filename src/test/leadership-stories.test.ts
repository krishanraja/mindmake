import { describe, expect, it } from "vitest";
import { CONTENTS, keptHeadings, leadershipChaptersMarkup, leadershipStories, storyPlan, storyScroll, storyTargets, storyWeight } from "@/components/leadership-chapters/leadershipChapters";
import { publishableTestimonials } from "@/data/testimonials";

/* The AI Brain stories. Their words are claims the business stands behind, so
   the rules that keep them true are tested, not remembered. */
describe("AI Brain stories", () => {
  const weights = leadershipStories.map(storyWeight);
  const samples = Array.from({ length: 2001 }, (_, i) => i / 2000);

  it("keeps the six approved headings word for word, in order, each now a full story", () => {
    const kept = leadershipStories.filter((story) => (keptHeadings as readonly string[]).includes(story.heading));
    expect(kept.map((story) => story.heading)).toEqual([...keptHeadings]);
    for (const story of leadershipStories) expect(story.situation, story.heading).toBeTruthy();
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

  it("tells a full story in four parts, in our words, inside its budget", () => {
    for (const story of leadershipStories.filter((s) => s.situation)) {
      expect(story.happened).toBeTruthy();
      const parts = [story.heading, story.situation!, story.happened!, story.quote?.text ?? ""];
      for (const part of parts) {
        expect(part).not.toMatch(/[—–]/);
        expect(part).not.toMatch(/\bnot\b[^.]*,\s*but\b/i);
      }
      /* Budgets that keep every story short enough to read in one hold. */
      expect(story.heading.length).toBeLessThanOrEqual(80);
      expect(story.situation!.length).toBeLessThanOrEqual(150);
      expect(story.happened!.length).toBeLessThanOrEqual(210);
      expect((story.quote?.text ?? "").length).toBeLessThanOrEqual(110);
    }
  });

  it("opens on its contents and ends on the last story", () => {
    expect(storyScroll(0, weights)).toMatchObject({ story: 0, contentsShown: 1, storyShown: 0 });
    expect(storyScroll(1, weights)).toMatchObject({ story: leadershipStories.length - 1, contentsShown: 0, storyShown: 1 });
  });

  it("rests each story whole, in order, the first and last included", () => {
    const { rests } = storyPlan(weights);
    expect(rests).toHaveLength(leadershipStories.length);
    rests.forEach((rest, i) => {
      expect(storyScroll(rest, weights)).toEqual({ story: i, mark: i, storyShown: 1, contentsShown: 0 });
      if (i) expect(rest).toBeGreaterThan(rests[i - 1]);
    });
  });

  it("rests the contents whole before any story opens", () => {
    const { contentsRests, rests } = storyPlan(weights);
    expect(contentsRests).toHaveLength(1);
    expect(storyScroll(contentsRests[0], weights)).toEqual({ story: 0, mark: 0, storyShown: 0, contentsShown: 1 });
    expect(contentsRests[0]).toBeLessThan(rests[0]);
    for (const p of samples) if (p > rests[0]) expect(storyScroll(p, weights).storyShown).toBe(1);
  });

  it("with the contents above the panel (a small phone), pins the stories alone from the first, and Previous on the first still goes back to the contents", () => {
    const { rests, total, contentsRests } = storyPlan(weights, 0);
    expect(total).toBeCloseTo(storyPlan(weights).total - 1);
    expect(contentsRests).toEqual([0]);
    for (const p of samples) expect(storyScroll(p, weights, 0).storyShown).toBe(1);
    expect(storyScroll(0, weights, 0).story).toBe(0);
    rests.forEach((rest, i) => expect(storyScroll(rest, weights, 0)).toEqual({ story: i, mark: i, storyShown: 1, contentsShown: 0 }));
    expect(storyTargets(rests[0], weights, 0)).toEqual({ prev: CONTENTS, next: 1 });
  });

  it("is a pure function of position: the same place shows the same thing both ways", () => {
    const forward = samples.map((p) => storyScroll(p, weights));
    const backward = [...samples].reverse().map((p) => storyScroll(p, weights)).reverse();
    expect(backward).toEqual(forward);
  });

  it("always shows one whole state, never a part and never both, stepping one story at a time", () => {
    let last = 0;
    for (const p of samples) {
      const state = storyScroll(p, weights);
      expect([state.storyShown, state.contentsShown].sort()).toEqual([0, 1]);
      expect(state.mark).toBe(state.story);
      expect(state.story - last).toBeGreaterThanOrEqual(0);
      expect(state.story - last).toBeLessThanOrEqual(1);
      last = state.story;
    }
    expect(last).toBe(leadershipStories.length - 1);
  });

  it("sends the arrows to the story before or after, Previous on the first back to the contents, and Next never back", () => {
    const { rests, contentsRests } = storyPlan(weights);
    const last = leadershipStories.length - 1;
    expect(storyTargets(contentsRests[0], weights)).toEqual({ prev: -1, next: 0 });
    rests.forEach((rest, i) => expect(storyTargets(rest, weights)).toEqual({ prev: i ? i - 1 : CONTENTS, next: i < last ? i + 1 : -1 }));
    for (const p of samples) {
      const { prev, next } = storyTargets(p, weights);
      if (next >= 0) expect(rests[next]).toBeGreaterThan(p);
      if (prev >= 0) expect(rests[prev]).toBeLessThan(p);
      if (prev === CONTENTS) expect(contentsRests[0]).toBeLessThan(p);
    }
  });

  it("gives every story the same hold, long enough to read it", () => {
    const { segments } = storyPlan(weights);
    const holds = segments.filter((s) => s.kind === "hold").map((s) => s.to - s.from);
    leadershipStories.forEach((_, i) => expect(holds[i]).toBeCloseTo(1.5, 9));
  });

  it("server-renders every story and the contents with nothing hidden, and the travel from the same plan", () => {
    const markup = leadershipChaptersMarkup();
    const human = markup.slice(markup.indexOf('<section class="human-proof"'));
    leadershipStories.forEach((story, i) => {
      expect(human).toContain(`id="mm-story-${i + 1}"`);
      expect(human).toContain(`href="#mm-story-${i + 1}"`);
    });
    expect(human.slice(0, human.indexOf('<div class="proof-return">'))).not.toContain('aria-hidden="true"><h2');
    /* No contents row can break a line after an article. */
    const nav = human.slice(human.indexOf('<nav class="story-contents"'), human.indexOf("</nav>"));
    const rows = [...nav.matchAll(/<span>([^<]*)<\/span>/g)].map((m) => m[1]);
    expect(rows).toHaveLength(leadershipStories.length);
    rows.forEach((row) => expect(row).not.toMatch(/\b(a|an|the) /i));
    /* Read as a document, nothing in the contents is current; the script marks the row. */
    expect(human).not.toContain('aria-current="true"><span class="story-number">');
    expect(human).toContain('<div class="benefit-controls" role="group" aria-label="AI Brain benefits"');
    const { rests, contentsRests, total } = storyPlan(weights);
    expect(human).toContain(`data-story-rests="${rests.map((r) => r.toFixed(5)).join(",")}"`);
    expect(human).toContain(`data-contents-rests="${contentsRests.map((r) => r.toFixed(5)).join(",")}"`);
    expect(human).toContain(`--story-units: ${total.toFixed(2)}`);
    expect(human).toContain(`/ ${String(leadershipStories.length).padStart(2, "0")}`);
  });
});
