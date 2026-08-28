import { describe, expect, it } from "vitest";
import {
  LANE_MAP,
  LANE_ORDER,
  corroborationLabel,
  industryCounts,
  isStale,
  laneCounts,
  laneFor,
  laneSpark,
  matchesIndustry,
  timestampLabel,
  topCard,
  STALE_AFTER_HOURS,
  type BoardCard,
  type BoardDay,
} from "@/lib/board";

/**
 * The board makes three promises a visitor can check: the mapping is published,
 * the corroboration is stated in plain words, and the freshness is honest.
 * Each one is a rule rather than a rendering detail, so each is tested here.
 */

const card = (over: Partial<BoardCard> = {}): BoardCard => ({
  id: "a",
  headline: "A model release",
  say: "Something changed.",
  pov: "The floor moved.",
  category: "model",
  source: "blog.google",
  url: "https://blog.google/x",
  timeAgo: "16h ago",
  score: 10,
  sourceCount: 2,
  ...over,
});

const day = (date: string, cards: BoardCard[]): BoardDay => ({ date, cards });

describe("the published lane mapping", () => {
  it("maps every category the cache uses", () => {
    const categories = [
      "model", "product", "orchestration",
      "economics", "tools",
      "governance", "proof", "security",
      "org",
    ];
    for (const category of categories) {
      expect(`${category} -> ${laneFor(category)}`).not.toBe(`${category} -> null`);
    }
  });

  it("matches the mapping the page publishes beside the board", () => {
    expect(LANE_MAP.product).toEqual(["model", "product", "orchestration"]);
    expect(LANE_MAP.price).toEqual(["economics", "tools"]);
    expect(LANE_MAP.positioning).toEqual(["governance", "proof", "security"]);
    expect(LANE_MAP.people).toEqual(["org"]);
    expect(LANE_ORDER).toEqual(["product", "price", "positioning", "people"]);
  });

  it("counts a card into exactly one lane", () => {
    const counts = laneCounts([
      day("2026-08-28T10:30:00Z", [card({ category: "model" }), card({ category: "economics" })]),
      day("2026-08-27T10:30:00Z", [card({ category: "org" })]),
    ]);
    expect(counts).toEqual({ product: 1, price: 1, positioning: 0, people: 1 });
  });

  it("leaves an unknown category out rather than guessing a lane", () => {
    expect(laneFor("weather")).toBeNull();
    expect(laneFor(null)).toBeNull();
  });
});

describe("corroboration reads as plain words", () => {
  it("names the count when two or more sources agree", () => {
    expect(corroborationLabel(card({ sourceCount: 2 }))).toBe("2 independent sources");
    expect(corroborationLabel(card({ sourceCount: 5 }))).toBe("5 independent sources");
  });

  it("says so when a lone source is the primary one", () => {
    expect(corroborationLabel(card({ sourceCount: 1, source: "blog.google" })))
      .toBe("1 source, primary");
  });

  it("claims nothing extra for a lone secondary source", () => {
    expect(corroborationLabel(card({ sourceCount: 1, source: "biztoc.com" }))).toBe("1 source");
    expect(corroborationLabel(card({ sourceCount: null, source: "biztoc.com" }))).toBe("1 source");
  });

  it("never uses a tier or a score", () => {
    for (const count of [1, 2, 9]) {
      const label = corroborationLabel(card({ sourceCount: count }));
      expect(label).not.toMatch(/tier|score|strength|confidence/i);
    }
  });
});

describe("freshness is honest", () => {
  const stamped = "2026-08-28T10:30:00Z";

  it("labels a read inside the window as today's", () => {
    const now = new Date("2026-08-28T18:00:00Z");
    expect(isStale(stamped, now)).toBe(false);
    expect(timestampLabel(stamped, 28, 417, now)).toBe("Read 10:30 UTC · 28 days · 417 corroborated items");
  });

  it("labels a read past the window as yesterday's rather than hiding it", () => {
    const now = new Date("2026-08-29T20:00:00Z");
    expect(isStale(stamped, now)).toBe(true);
    expect(timestampLabel(stamped, 28, 417, now)).toContain("Yesterday's read");
  });

  it("turns stale exactly at the stated boundary", () => {
    const justInside = new Date(Date.parse(stamped) + (STALE_AFTER_HOURS - 0.1) * 36e5);
    const justOutside = new Date(Date.parse(stamped) + (STALE_AFTER_HOURS + 0.1) * 36e5);
    expect(isStale(stamped, justInside)).toBe(false);
    expect(isStale(stamped, justOutside)).toBe(true);
  });

  it("treats an unreadable stamp as stale rather than fresh", () => {
    expect(isStale("not a date")).toBe(true);
    expect(timestampLabel("not a date", 28, 417)).toBe("The read is rebuilding");
  });
});

describe("the aggregations", () => {
  const days = [
    day("2026-08-28T10:30:00Z", [
      card({ id: "low", score: 2 }),
      card({ id: "high", score: 40 }),
      card({ id: "mid", score: 11 }),
    ]),
    day("2026-08-27T10:30:00Z", [card({ id: "old", score: 99 })]),
  ];

  it("takes the homepage card from today, by score", () => {
    /* Never yesterday's strongest item: the homepage claims today's read. */
    expect(topCard(days)?.id).toBe("high");
  });

  it("returns nothing when today holds nothing", () => {
    expect(topCard([])).toBeNull();
    expect(topCard([day("2026-08-28T10:30:00Z", [])])).toBeNull();
  });

  it("sparks the last seven days, oldest first", () => {
    const window = Array.from({ length: 10 }, (_, index) =>
      day(`2026-08-${String(index + 1).padStart(2, "0")}T10:30:00Z`,
        Array.from({ length: index }, () => card())));
    const spark = laneSpark(window, "product");
    expect(spark).toHaveLength(7);
    expect(spark).toEqual([3, 4, 5, 6, 7, 8, 9]);
  });
});

describe("the industry filter is deterministic", () => {
  const technology = card({ headline: "A new open weights model ships", say: "For developers." });
  const finance = card({ headline: "A bank deploys credit risk scoring", say: "A regulated incumbent." });

  it("keeps every card under all industries", () => {
    expect(matchesIndustry(technology, "All industries")).toBe(true);
    expect(matchesIndustry(finance, "All industries")).toBe(true);
  });

  it("matches on the words the visitor can see", () => {
    expect(matchesIndustry(technology, "Technology")).toBe(true);
    expect(matchesIndustry(finance, "Financial services")).toBe(true);
    expect(matchesIndustry(finance, "Technology")).toBe(false);
  });

  it("counts honestly, so a chip with no matches can disable itself", () => {
    const counts = industryCounts([technology, finance]);
    expect(counts["All industries"]).toBe(2);
    expect(counts["Financial services"]).toBe(1);
    expect(counts["Media and publishing"]).toBe(0);
  });
});
