import { describe, expect, it } from "vitest";
import { render } from "@/entry-server";
import { featuredQuotes, publicClientQuotes, testimonials } from "@/data/testimonials";
import { results, useCases } from "@/data/useCases";
import { caseFromHash } from "@/lib/useCaseHash";

/* The server's page for /case-studies is the page without script: every use
   case, every result on the record and every client quote must be in it, and
   no voice that is not a client's (owner review, 2026-11-15). */
describe("/case-studies, as the server sends it", () => {
  const body = render("/case-studies");
  const doc = new DOMParser().parseFromString(`<!doctype html><body>${body}</body>`, "text/html");
  const plain = (text: string | null | undefined) => (text ?? "").replaceAll(" ", " ").replace(/\s+/g, " ").trim();

  it("holds all eighteen use cases, each card its whole story", () => {
    const cards = [...doc.querySelectorAll(".uc-card")];
    expect(cards).toHaveLength(18);
    expect(cards.map((card) => card.getAttribute("data-uc"))).toEqual(useCases.map((entry) => entry.id));
    for (const card of cards) {
      expect(card.className, "no card is set aside before the finder runs").not.toContain("is-away");
      expect(card.querySelector("a")!.getAttribute("href")).toMatch(/^#c-\d{2}$/);
    }
    expect(cards.map((card) => card.id)).toEqual(useCases.map((entry) => entry.id.toLowerCase()));
    /* The sheet draws a story only when one is open. */
    expect(doc.querySelector(".uc-sheet .uc-story")).toBeNull();
    for (const entry of useCases) {
      const story = doc.getElementById(entry.id.toLowerCase())!;
      const text = plain(story.textContent);
      for (const words of [entry.heading, entry.startingPoint, entry.whatWeDid, entry.outcome]) expect(text, entry.id).toContain(words);
    }
  });

  it("holds the eight results on the record, on their use cases", () => {
    const shown = [...doc.querySelectorAll(".uc-card-result")];
    expect(shown).toHaveLength(8);
    for (const result of results) {
      const story = doc.getElementById(result.useCase.toLowerCase())!;
      expect(plain(story.querySelector(".uc-card-result-head")?.textContent)).toBe(result.headline);
      expect(plain(story.querySelector(".uc-card-result")?.textContent)).toContain(result.detail);
    }
    expect(doc.querySelectorAll(".uc-status")).toHaveLength(8);
  });

  it("holds the eighteen client quotes whole, each at its own fragment", () => {
    const quotes = [...doc.querySelectorAll("figure.uc-quote")];
    expect(quotes).toHaveLength(18);
    /* The five featured first, in their order, then the rest as the record holds them. */
    const order = [...featuredQuotes, ...publicClientQuotes.filter((voice) => !voice.featured)];
    expect(quotes.map((quote) => quote.id)).toEqual(order.map((voice) => `q-${voice.id}`));
    for (const voice of publicClientQuotes) {
      const quote = doc.getElementById(`q-${voice.id}`)!;
      expect(plain(quote.querySelector("blockquote")!.textContent)).toBe(`“${voice.full.replace(/\s+/g, " ")}”`);
      expect(quote.hasAttribute("inert"), "every quote is in reach before the carousel runs").toBe(false);
    }
    /* The nine that belong to a use case open it. */
    expect(doc.querySelectorAll(".uc-quote-link")).toHaveLength(9);
  });

  it("carries no session comment, career reference or old proof field", () => {
    const text = plain(doc.body.textContent);
    for (const voice of testimonials.filter((entry) => entry.family === "session" || entry.family === "reference")) {
      if (voice.name) expect(text, voice.id).not.toContain(voice.name);
      expect(text, voice.id).not.toContain(voice.full.slice(0, 60));
    }
    expect(doc.querySelector(".mm-case-proof-s2, [data-open-story], .mm-drum")).toBeNull();
    expect(text, "no use case code is shown").not.toMatch(/\bC-\d{2}\b/);
  });
});

describe("links into /case-studies", () => {
  it("resolve a use case from its own fragment and from the older result fragments", () => {
    expect(caseFromHash("#c-11")).toBe("C-11");
    expect(caseFromHash("#C-09")).toBe("C-09");
    expect(caseFromHash("#story=market-moves")).toBe("C-11");
    expect(caseFromHash("#story=day-one&phase=result")).toBe("C-15");
    expect(caseFromHash("#record-team-decides")).toBe("C-17");
    for (const result of results) expect(caseFromHash(`#story=${result.id}`)).toBe(result.useCase);
  });

  it("name nothing for anything else (negative controls)", () => {
    for (const hash of ["", "#c-19", "#c-1", "#story=nope", "#record-", "#q-media-cro", "#overview"]) expect(caseFromHash(hash), hash).toBeUndefined();
  });
});
