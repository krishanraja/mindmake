import { describe, expect, it } from "vitest";
import {
  boardDaysRequested,
  buildBoard,
  toBoardCard,
  MAX_BOARD_DAYS,
  type SharedPoolRow,
} from "../../supabase/functions/get-ai-news/board";

/**
 * The board view is an additive path on a function other consumers already
 * depend on, so these cover both halves: the new mapping is correct, and a
 * request that does not ask for the board never reaches it.
 */

const row = (date: string, cards: unknown[]): SharedPoolRow => ({ created_at: date, payload: cards });

const card = (over: Record<string, unknown> = {}) => ({
  id: "live-2026-08-28-0",
  headline: "Gemini-3.5 Transcription Model Released",
  say: "Improved transcription tools.",
  pov: "The floor moved again.",
  category: "model",
  source: "https://blog.google/some/path",
  url: "https://blog.google/some/path",
  timeAgo: "16h ago",
  score: 13.66,
  sourceCount: 2,
  ...over,
});

describe("the board request", () => {
  it("is taken only when the caller asks for it", () => {
    expect(boardDaysRequested(null)).toBeNull();
    expect(boardDaysRequested({})).toBeNull();
    expect(boardDaysRequested({ view: "headlines" })).toBeNull();
    expect(boardDaysRequested({ view: "board" })).toBe(MAX_BOARD_DAYS);
  });

  it("clamps the window to what the cache retains", () => {
    expect(boardDaysRequested({ view: "board", days: 1 })).toBe(1);
    expect(boardDaysRequested({ view: "board", days: 7 })).toBe(7);
    expect(boardDaysRequested({ view: "board", days: 400 })).toBe(MAX_BOARD_DAYS);
    expect(boardDaysRequested({ view: "board", days: 0 })).toBe(MAX_BOARD_DAYS);
    expect(boardDaysRequested({ view: "board", days: "many" })).toBe(MAX_BOARD_DAYS);
  });
});

describe("the card mapping", () => {
  it("carries every field the board renders", () => {
    const mapped = toBoardCard(card(), 0, 0);
    expect(mapped).toMatchObject({
      id: "live-2026-08-28-0",
      headline: "Gemini-3.5 Transcription Model Released",
      pov: "The floor moved again.",
      category: "model",
      timeAgo: "16h ago",
      sourceCount: 2,
    });
  });

  it("reduces a source to the bare domain", () => {
    expect(toBoardCard(card({ source: "https://www.theverge.com/ai/123" }), 0, 0)?.source)
      .toBe("theverge.com");
  });

  it("nulls an absent point of view rather than emptying it", () => {
    /* The page omits the pov line when it is null. An empty string would draw
       an arrow pointing at nothing. */
    expect(toBoardCard(card({ pov: null }), 0, 0)?.pov).toBeNull();
    expect(toBoardCard(card({ pov: "   " }), 0, 0)?.pov).toBeNull();
  });

  it("drops anything without a headline", () => {
    expect(toBoardCard(card({ headline: "" }), 0, 0)).toBeNull();
    expect(toBoardCard({ say: "orphan" }, 0, 0)).toBeNull();
    expect(toBoardCard(null, 0, 0)).toBeNull();
  });

  it("gives a card without an id a stable one", () => {
    expect(toBoardCard(card({ id: null }), 2, 5)?.id).toBe("board-2-5");
  });
});

describe("the board response", () => {
  const rows = [
    row("2026-08-28T10:30:23Z", [card(), card({ id: "b", category: "economics" })]),
    row("2026-08-27T10:30:24Z", [card({ id: "c", category: "org" })]),
  ];

  it("returns the days newest first with a total", () => {
    const board = buildBoard(rows, 28);
    expect(board?.days).toHaveLength(2);
    expect(board?.days[0].cards).toHaveLength(2);
    expect(board?.total).toBe(3);
  });

  it("stamps the response with the cache's own date", () => {
    /* Freshness is a promise the visitor can check tomorrow, so the timestamp
       is never now(). */
    expect(buildBoard(rows, 28)?.timestamp).toBe("2026-08-28T10:30:23Z");
  });

  it("honours the requested window", () => {
    expect(buildBoard(rows, 1)?.days).toHaveLength(1);
  });

  it("returns nothing when the cache holds nothing usable", () => {
    expect(buildBoard([], 28)).toBeNull();
    expect(buildBoard([row("2026-08-28T10:30:23Z", [])], 28)).toBeNull();
    expect(buildBoard([{ created_at: "x", payload: null }], 28)).toBeNull();
  });
});
