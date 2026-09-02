import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  LANE_MAP,
  LANE_ORDER,
  corroborationLabel,
  countMatching,
  industryCounts,
  isStale,
  laneCounts,
  laneFor,
  laneSpark,
  matchesIndustry,
  isShown,
  matchesRole,
  recentMatching,
  roleCounts,
  ROLE_CATEGORIES,
  ROLE_LABELS,
  timestampLabel,
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

  /* `topCard` went with the homepage's single card. The homepage carries the
     board's own rows now, newest first across the window, which is the same
     collection `/ai-gtm` draws from rather than a second rule beside it. */
  /* Reading the window rather than the day makes a repeat possible where it
     never was before: nothing upstream promises an id is unique across days,
     and two rows carrying one headline would also be two React children with
     one key. */
  it("shows a story that ran on two days once", () => {
    const twice = [
      day("2026-08-28T10:30:00Z", [card({ id: "same" }), card({ id: "other" })]),
      day("2026-08-27T10:30:00Z", [card({ id: "same" })]),
    ];
    expect(recentMatching(twice).map((entry) => entry.id)).toEqual(["same", "other"]);
    expect(countMatching(twice)).toBe(2);
  });

  it("takes the homepage's rows from the window, newest first", () => {
    expect(recentMatching(days, { limit: 2 }).map((entry) => entry.id)).toEqual(["low", "high"]);
    expect(recentMatching([])).toEqual([]);
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
    expect(source).toContain("Showing {rows.length} of {total} across {days.length} days.");
    expect(source).toContain("Show {Math.min(ROWS_EXPANDED, total)}");
  });

  it("shows fewer rows on a phone, where a row is three lines rather than one", () => {
    expect(source).toContain("ROWS_SHOWN_PHONE");
    expect(source).toMatch(/phone \? ROWS_SHOWN_PHONE : ROWS_SHOWN/);
  });

  /* Today alone is fine while nothing is filtered, because today's items are
     the newest anyway. It fails the moment a role is picked: People is 39 items
     in 476 and 0 of today's 13, so the chip added to serve that reader would
     have been empty on most days. The rows come from the window. */
  it("draws its rows from the window rather than from today", () => {
    expect(source).toContain("recentMatching(days, { limit })");
    expect(source).not.toMatch(/const today = days\[0\]/);
  });

  it("counts each chip as what it would return if pressed", () => {
    expect(source).toContain("roleCounts(shown.filter((card) => matchesIndustry(card, industry)))");
    expect(source).toContain("industryCounts(shown.filter((card) => !role || matchesRole(card, role)))");
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

describe("the classifier's own reading, when it arrives", () => {
  it("prefers affects over the projection, and answers only from it", () => {
    /* A story whose subject is a model and whose audience is the people who
       manage the work. The projection can only see the subject; the field can
       see both, so it is the answer and the projection is not consulted. */
    const marked = card({
      headline: "A frontier lab reshapes how its teams are staffed",
      category: "model",
      affects: ["people", "leadership"],
    });
    expect(matchesRole(marked, "people")).toBe(true);
    expect(matchesRole(marked, "leadership")).toBe(true);
    /* Product would have matched on category alone. It does not now, because
       the classifier read the article and did not say Product. */
    expect(matchesRole(marked, "product")).toBe(false);
  });

  it("falls back to the projection when the field is absent or empty", () => {
    expect(matchesRole(card({ category: "model" }), "product")).toBe(true);
    expect(matchesRole(card({ category: "model", affects: [] }), "product")).toBe(true);
  });

  it("declines an item whose only content is damage", () => {
    expect(isShown(card({ stance: "opportunity" }))).toBe(true);
    expect(isShown(card({ stance: "shift" }))).toBe(true);
    expect(isShown(card({ stance: "risk" }))).toBe(true);
    expect(isShown(card({ stance: "damage" }))).toBe(false);
  });

  it("shows an item that predates the field rather than emptying the board", () => {
    expect(isShown(card())).toBe(true);
    expect(isShown(card({ stance: null }))).toBe(true);
  });
});

/**
 * The departures board, and the two things it is not allowed to cost.
 *
 * The headline must be readable with no scripting, and it must not break in the
 * middle of a word. Both were broken by the same decision -- one element per
 * character -- and both are fixed in the markup rather than in the animation,
 * which is why they can be read out of the source.
 */
describe("the board's rows are leaves, and the leaves cost the headline nothing", () => {
  const source = read("src/components/mindmake/board/FlapRow.tsx");

  it("puts the true character in the markup and paints the decoy over it", () => {
    /* The leaf's own text is the real character; the riffle only ever writes an
       attribute. So a crawler, a reader with scripting off and a reader who
       asked for less motion all get the headline written out in full. */
    expect(source).toContain('<span className="mm-flap" key={at}>{character}</span>');
    expect(source).toContain("cell.dataset.r =");
    expect(source).toContain("delete cell.dataset.r");
  });

  it("does nothing at all under reduced motion", () => {
    expect(source).toContain('window.matchMedia?.("(prefers-reduced-motion: reduce)").matches');
  });

  /* A board that has finished is a photograph of a board, and the aliveness
     gate reads a page at rest, by which time an arrival has arrived. An arrived
     row keeps turning one word of itself over, which is what a real departures
     board does for as long as you stand in front of it. */
  it("keeps turning over after it has arrived, and only while it is on screen", () => {
    expect(source).toContain("const idle = () => {");
    expect(source).toContain("if (visible && !document.hidden && words.length)");
  });

  /* An arrival has arrived by the time a page is at rest, and the idle turn on
     its own is too small and too occasional for a gate that photographs five
     instants: three runs of `qa:alive` gave clean, clean, then three still
     viewports. The panel is a `Build`, so it assembles with scroll position and
     comes apart again on the way back, which is the reading a page at rest can
     actually carry. */
  it("assembles with scroll position rather than only on arrival", () => {
    for (const surface of ["src/components/mindmake/board/LiveBoard.tsx", "src/pages/Index.tsx"]) {
      const page = read(surface);
      expect(`${surface}: ${page.includes('<Build className="mm-flap-panel">')}`).toBe(`${surface}: true`);
    }
    /* And the two clocks may not share a name: `--mm-at` is what `Build` writes
       on every child, so the flap using it would have decided the row's opacity
       and then pinned it at 1, leaving a build that never comes apart. */
    expect(source).toContain('"--mm-turn"');
    expect(source).not.toContain('"--mm-at"');
    expect(source).toContain("...style,");
  });

  /* Driving the needle from the row's position on screen was tried and
     reverted: a row low on the screen showed a low needle, so an item with two
     independent sources read as weaker than one with a single source sitting
     higher up. A gauge carries a value, and an idle turn leaves it alone. */
  it("never moves the needle for a reason that is not the item's corroboration", () => {
    expect(source).toContain("turn(words[(Math.random() * words.length) | 0], 460, false)");
    expect(source).not.toContain("useScrollDriver");
    const css = read("src/styles/mindmake-instruments.css");
    expect(css).toContain("calc(63 - var(--mm-turn, 1) * var(--mm-sweep, 0) * 63)");
  });

  /* Two atomic inline boxes are a break opportunity in Chromium whether or not
     there is a space between them, so a headline of bare leaves broke mid-word
     on nearly every row of a phone. The word is the unit that holds a line
     together; only one long enough to strand a line gives that up. */
  it("breaks between words, not between letters", () => {
    expect(source).toContain('className={`mm-flap-word${word.length >= LONG_WORD ? " is-long" : ""}`}');
    const css = read("src/styles/mindmake-instruments.css");
    expect(css).toContain(".mm-flap-word { white-space: nowrap; }");
    expect(css).toContain(".mm-flap-word.is-long { white-space: normal; }");
  });

  /* An inline-block whose overflow is not `visible` takes its bottom margin
     edge as its baseline instead of its text's, which lifted every churning run
     off the line it was sitting in. The clip belongs to the leaf. */
  it("clips the decoy rather than the cell, so the line keeps its baseline", () => {
    const css = read("src/styles/mindmake-instruments.css");
    const cell = css.slice(css.indexOf(".mm-flap[data-r] {"), css.indexOf(".mm-flap[data-r]::before"));
    expect(cell.slice(0, cell.indexOf("::after"))).not.toContain("overflow: hidden");
    expect(cell).toContain("overflow: hidden");
  });

  /* Measured over the day's items: 25 of 29 `pov` lines are commands addressed
     to the reader and 9 carry American spellings, both of which the house style
     bans outright. The board's reading of an item is the stance word instead. */
  it("does not print the classifier's advice to the reader", () => {
    expect(source).not.toContain("card.pov");
    expect(source).toContain("STANCE_LABEL");
  });

  it("settles in a bounded time however long the headline is", () => {
    /* At a fixed rate per character a 91-character headline took two and a half
       seconds, which on a phone is most of the visible screen unreadable for
       most of that time. The rate comes from a target total instead. */
    expect(source).toMatch(/window\.innerWidth < 700 \? 760 : 1180/);
    expect(source).toContain("Math.max(8, Math.min(30, target / leaves.length))");
  });
});
