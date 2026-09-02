import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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
  matchesRole,
  roleCounts,
  ROLE_CATEGORIES,
  ROLE_LABELS,
  timestampLabel,
  topCard,
  STALE_AFTER_HOURS,
  type BoardCard,
  type BoardDay,
} from "@/lib/board";

const read = (relative: string) =>
  readFileSync(resolve(__dirname, "../..", relative), "utf8");

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

  it("does not let Technology become a synonym for everything", () => {
    /* Every item on this board is about AI, so words like model, platform,
       software and api match nearly all of them. With those in the list, the
       chip a technology buyer is most likely to press returned the same set as
       All industries and read as broken. It now marks stories about the
       technology industry rather than stories that mention technology. */
    const generic = [
      card({ headline: "A new language model tops the benchmarks" }),
      card({ headline: "The platform ships a developer api" }),
      card({ headline: "New software for agents" }),
    ];
    for (const item of generic) expect(matchesIndustry(item, "Technology")).toBe(false);

    const sector = [
      card({ headline: "The chip shortage eases" }),
      card({ headline: "A hyperscaler opens a data centre" }),
      card({ headline: "A semiconductor foundry raises prices" }),
    ];
    for (const item of sector) expect(matchesIndustry(item, "Technology")).toBe(true);
  });
});

describe("the board reads from one filtered collection", () => {
  /* The chips used to filter the visible cards while the lane counts, the
     spark bars and the timestamp were computed from the unfiltered window, so
     the numbers never moved and the control read as dead. Every figure has to
     come from the same filtered days. */
  const source = read("src/components/mindmake/board/LiveBoard.tsx");

  it("filters the whole window before anything is counted", () => {
    expect(source).toMatch(/const days = useMemo\([\s\S]{0,220}matchesIndustry\(card, industry\)/);
  });

  it("derives every figure from the filtered days", () => {
    for (const derived of [
      "laneCounts(days)",
      "laneSpark(days, lane)",
      "days.reduce((sum, day) => sum + day.cards.length, 0)",
      "timestampLabel(board.cacheDate, days.length, total)",
    ]) {
      expect(`${derived}: ${source.includes(derived)}`).toBe(`${derived}: true`);
    }
  });

  it("says how much it is holding back rather than dropping it silently", () => {
    expect(source).toContain("Showing {visible.length} of {today.length} today.");
    expect(source).toContain("Show all ${today.length}");
  });

  it("shows fewer cards on a phone, where they are a single column", () => {
    expect(source).toContain("CARDS_SHOWN_PHONE");
    expect(source).toMatch(/phone \? CARDS_SHOWN_PHONE : CARDS_SHOWN/);
  });

  it("never renders a heading with nothing under it", () => {
    /* Loading used to be a bare h2, which reads as broken rather than busy. */
    const loading = source.slice(source.indexOf('board.status === "loading"'));
    expect(loading.slice(0, 500)).toContain("Reading today's sources.");
  });
});

describe("the role filter reads the board as one part of a business", () => {
  /* The eight the lead dialog already asks, in its order. */
  const ROLES = [
    "leadership", "sales", "marketing", "product",
    "engineering", "operations", "finance", "people",
  ] as const;

  it("uses the site's own divisions and no second vocabulary", () => {
    expect(Object.keys(ROLE_CATEGORIES)).toEqual([...ROLES]);
    expect(Object.keys(ROLE_LABELS)).toEqual([...ROLES]);
    /* Named the way the person in that job would say it, which is what the
       dialog asks, so the board never offers "Revenue" beside a form asking
       about "Sales". */
    expect(ROLE_LABELS.sales).toBe("Sales");
    expect(ROLE_LABELS.people).toBe("People");
  });

  it("claims every category for someone, and none for everyone", () => {
    const claimed = new Set(Object.values(ROLE_CATEGORIES).flat());
    for (const category of Object.values(LANE_MAP).flat()) {
      expect(`${category}: claimed`).toBe(`${category}: ${claimed.has(category) ? "claimed" : "orphaned"}`);
    }
    for (const [role, cats] of Object.entries(ROLE_CATEGORIES)) {
      expect(`${role}: ${cats.length < 9}`).toBe(`${role}: true`);
    }
  });

  it("matches on the category a division works in", () => {
    expect(matchesRole(card({ category: "org" }), "people")).toBe(true);
    expect(matchesRole(card({ category: "economics" }), "finance")).toBe(true);
    expect(matchesRole(card({ category: "security" }), "engineering")).toBe(true);
    /* And not on one it does not. */
    expect(matchesRole(card({ headline: "A quiet day", category: "org" }), "engineering")).toBe(false);
  });

  it("matches on a word in the headline or the point of view", () => {
    const hiring = card({ headline: "Hiring slows across model labs", category: "model" });
    expect(matchesRole(hiring, "people")).toBe(true);
    const pov = card({ headline: "A neutral headline", category: "model", pov: "Watch the cost per token." });
    expect(matchesRole(pov, "finance")).toBe(true);
  });

  it("does not let any role become a synonym for everything", () => {
    /* The lesson the Technology chip taught, applied before it can repeat: a
       chip that returns the whole board is a chip that reads as broken. */
    const board = [
      card({ headline: "Frontier model tops the benchmark", category: "model" }),
      card({ headline: "Ad revenue passes a billion", category: "economics" }),
      card({ headline: "Regulator opens an inquiry", category: "governance" }),
      card({ headline: "A new agent toolchain ships", category: "tools" }),
      card({ headline: "Researchers move between labs", category: "org" }),
      card({ headline: "A serious vulnerability is disclosed", category: "security" }),
      card({ headline: "An independent evaluation is published", category: "proof" }),
    ];
    for (const role of ROLES) {
      const hits = board.filter((entry) => matchesRole(entry, role)).length;
      expect(`${role}: ${hits < board.length}`).toBe(`${role}: true`);
    }
  });

  it("counts every role, so a chip is never pressable and empty", () => {
    const counts = roleCounts([
      card({ category: "org", headline: "Researchers move between labs" }),
      card({ category: "economics", headline: "Ad revenue passes a billion" }),
    ]);
    expect(Object.keys(counts)).toEqual([...ROLES]);
    expect(counts.people).toBe(1);
    expect(counts.finance).toBe(1);
    expect(counts.leadership).toBe(2);
    for (const role of ROLES) expect(counts[role]).toBeLessThanOrEqual(2);
  });
});
