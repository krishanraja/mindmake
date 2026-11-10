import { describe, expect, it, vi } from "vitest";
import fixture from "@/data/vnext/brain-fixture.json";
import { SETTLE_BRIGHTNESS, SETTLE_SCALE, settleLook, settleProgress, settleSections } from "@/lib/sectionSettle";
import { canWipe, wipeLines } from "@/lib/scrollBuild";
import { deckStates, swipeIntent, DECK_SWIPE_PX } from "@/components/leadership-chapters/storyFinder";
import { overlapsContent } from "@/lib/actionBarOverlap";
import { inBrain, seatIdeas } from "@/components/mindmake/locked/liquidBrain";

/* The S9 repair (ledger S9-AUDIT-001, Krish, 2026-11-10): sections settle
   instead of stacking, the story deck swipes, the heading wipe is fixed, the
   floating button steps aside, and the Brain holds still and stays cheap. */

describe("the gentle settle", () => {
  it("does nothing until a section's foot rises past 40% of the screen, and is full at the masthead", () => {
    expect(settleProgress(900, 800, 64)).toBe(0);
    expect(settleProgress(320, 800, 64)).toBe(0);
    expect(settleProgress(64, 800, 64)).toBe(1);
    expect(settleProgress(-200, 800, 64)).toBe(1);
    const mid = settleProgress(192, 800, 64);
    expect(mid).toBeGreaterThan(0);
    expect(mid).toBeLessThan(1);
  });

  it("only ever eases back a little, and is the identity at rest", () => {
    expect(settleLook(0)).toEqual({ scale: 1, brightness: 1 });
    expect(settleLook(1).scale).toBeCloseTo(SETTLE_SCALE);
    expect(settleLook(1).brightness).toBeCloseTo(SETTLE_BRIGHTNESS);
    expect(SETTLE_SCALE).toBeGreaterThanOrEqual(0.96);
    let previous = 1;
    for (let p = 0; p <= 1; p += 0.1) { const { scale } = settleLook(p); expect(scale).toBeLessThanOrEqual(previous); previous = scale; }
  });

  it("never pins, tilts or clips a section, and leaves no style behind", () => {
    const section = document.createElement("section");
    document.body.append(section);
    const undo = settleSections([section]);
    expect(section.style.position).toBe("");
    expect(section.style.transform).toBe("");
    expect(section.style.clipPath).toBe("");
    undo();
    expect(section.getAttribute("style") ?? "").toBe("");
    section.remove();
  });
});

describe("the heading wipe", () => {
  const heading = (parent: HTMLElement) => {
    const h = document.createElement("h2");
    h.textContent = "A heading";
    Object.defineProperty(h, "offsetWidth", { value: 300 });
    Object.defineProperty(h, "offsetHeight", { value: 60 });
    parent.append(h);
    return h;
  };

  it("never runs on a heading the reader cannot see", () => {
    for (const hide of ['data-active="false"', "inert", 'aria-hidden="true"', "hidden"]) {
      const wrap = document.createElement("div");
      wrap.setAttribute(hide.split("=")[0], hide.includes("=") ? hide.split('"')[1] : "");
      document.body.append(wrap);
      expect(canWipe(heading(wrap)), hide).toBe(false);
      wrap.remove();
    }
  });

  it("never runs twice on one heading, and refuses a heading with no size", () => {
    const h = heading(document.body);
    expect(canWipe(h)).toBe(true);
    h.dataset.wiped = "";
    expect(canWipe(h)).toBe(false);
    const empty = document.createElement("h2");
    document.body.append(empty);
    expect(canWipe(empty)).toBe(false);
    h.remove(); empty.remove();
  });

  it("returns a cancel that leaves the heading whole", () => {
    const h = heading(document.body);
    const cancel = wipeLines(h);
    cancel();
    expect(h.style.clipPath).toBe("");
    expect(document.querySelector(".hs-wipe-layer")).toBeNull();
    h.remove();
  });
});

describe("the swipe deck", () => {
  it("puts read stories behind, the current one on top and the rest to come", () => {
    expect(deckStates(4, 2)).toEqual([
      { state: "past", depth: 2 }, { state: "past", depth: 1 }, { state: "current", depth: 0 }, { state: "next", depth: 0 },
    ]);
    expect(deckStates(3, 0).map((card) => card.state)).toEqual(["current", "next", "next"]);
  });

  it("moves only on a clear sideways swipe, never on a vertical scroll", () => {
    expect(swipeIntent(-DECK_SWIPE_PX - 1, 4, 400)).toBe(1);
    expect(swipeIntent(DECK_SWIPE_PX + 1, 4, 400)).toBe(-1);
    expect(swipeIntent(-30, 4, 400)).toBe(0);
    expect(swipeIntent(-30, 2, 40)).toBe(1);
    expect(swipeIntent(-80, 200, 300)).toBe(0);
    expect(swipeIntent(4, 0, 10)).toBe(0);
  });
});

describe("the floating button", () => {
  const bar = () => {
    const wrap = document.createElement("div");
    wrap.className = "mm-action-bar";
    const button = document.createElement("button");
    button.className = "mm-button";
    button.getBoundingClientRect = () => ({ top: 700, bottom: 750, left: 100, right: 300, width: 200, height: 50, x: 100, y: 700, toJSON: () => ({}) }) as DOMRect;
    wrap.append(button);
    document.body.append(wrap);
    return wrap;
  };

  it("steps aside over a link, a picture or the Brain's reading, but not over running text", () => {
    const original = document.elementsFromPoint;
    const cases: Array<[string, boolean]> = [["a", true], ["img", true], ["h2", true], ["p", false]];
    for (const [tag, expected] of cases) {
      const el = document.createElement(tag);
      if (tag === "a") el.setAttribute("href", "/x");
      document.body.append(el);
      const host = bar();
      document.elementsFromPoint = vi.fn(() => [el]) as typeof document.elementsFromPoint;
      expect(overlapsContent(host), tag).toBe(expected);
      host.remove(); el.remove();
    }
    const reading = document.createElement("aside");
    reading.setAttribute("data-mm-clear", "");
    const line = document.createElement("p");
    reading.append(line);
    document.body.append(reading);
    const host = bar();
    document.elementsFromPoint = vi.fn(() => [line]) as typeof document.elementsFromPoint;
    expect(overlapsContent(host)).toBe(true);
    document.elementsFromPoint = original;
    host.remove(); reading.remove();
  });
});

describe("the liquid Brain", () => {
  it("seats every idea inside the brain, in the same place on every visit", () => {
    const ideas = fixture.items.map((item) => ({ id: item.id, x: item.x, y: item.y, settled: true }));
    const first = seatIdeas(ideas);
    const second = seatIdeas(ideas);
    for (const item of fixture.items) {
      const [x, y] = first.get(item.id)!;
      expect(inBrain(x, y), item.id).toBe(true);
      expect(second.get(item.id)).toEqual([x, y]);
    }
  });

  it("turns only when asked to tour, and draws no per-pair fibres", async () => {
    const { readFileSync } = await import("node:fs");
    const { resolve } = await import("node:path");
    const source = readFileSync(resolve(__dirname, "../components/mindmake/locked/liquidBrain.ts"), "utf8");
    expect(source).toContain("let touring = Boolean(options.tour)");
    expect(source).toContain("touring && !pinned");
    expect(source).not.toMatch(/for \(let j = i \+ 1; j < particles\.length/);
    expect(source).not.toContain("pointerdown");
  });
});

describe("the connected Brain (mock, round 2)", () => {
  it("names every cluster, words every connection both ways, and puts every change in plain words", async () => {
    const { CLUSTERS, RELATION_WORDS, RELATION_WORDS_BACK, plainChanges, restsOn } = await import("@/components/mindmake/locked/connectedBrain");
    for (const item of fixture.items) expect(CLUSTERS.some((cluster) => cluster.id === item.cluster), item.id).toBe(true);
    for (const relationship of fixture.relationships) {
      expect(RELATION_WORDS[relationship.type], relationship.type).toBeTruthy();
      expect(RELATION_WORDS_BACK[relationship.type], relationship.type).toBeTruthy();
    }
    for (const correction of fixture.corrections) expect(plainChanges[correction.id], correction.id).toBeTruthy();
    for (const item of fixture.items) {
      const rests = restsOn(fixture, item.id);
      const shown = [rests.cluster, ...rests.connections.flatMap((c) => [c.verb, c.title]), ...rests.sources.flatMap((s) => [s.label, s.line]), ...rests.changes];
      for (const line of shown) expect(line, `${item.id}: ${line}`).not.toMatch(/\bCTRL\b/);
    }
    expect(restsOn(fixture, "BI-010").connections).toHaveLength(5);
  });
});
