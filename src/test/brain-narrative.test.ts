import { MemoryRouter } from "react-router-dom";
import { ProductSprint } from "@/components/mindmake/ProductSprint";
import { createElement } from "react";
import { render, fireEvent, within } from "@testing-library/react";
import { LiquidBrain } from "@/components/mindmake/LiquidBrain";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";
import { readingProgress, sequenceProgress, stepStates } from "@/components/mindmake/locked/scrollSequence";
import fixture from "@/data/vnext/brain-fixture.json";


const ROOT = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

const page = () => new DOMParser().parseFromString(serverRender("/ai-brain"), "text/html");

// Ruling (Krish, 2026-11-25): /ai-brain revisualised
describe("the AI brain route", () => {
  const main = page().querySelector("main")!;
  it("keeps the hero and three rooms in reading order", () => {
    expect(main.querySelector("h1")?.textContent).toBe("Teach your AI what experience taught you.");
    expect([...main.querySelectorAll(":scope > section")].map(el => el.id)).toEqual(["you", "inside", "built"]);
    expect(main.querySelector("[data-mm-hero]")?.textContent).toBe("Start building your AI brain");
  });
  it("explains one North Star and five parts beside three disclosures", () => {
    expect([...main.querySelectorAll(".brain-field button")].map(el => el.textContent)).toEqual(["North Star","Vision","Judgement","Taste","Standards","Preferences"]);
    expect(main.querySelector("#brain-answer")?.textContent).toContain("What are you trying to make possible?");
    expect(main.querySelectorAll(".brain-truths details")).toHaveLength(3);
    expect(main.textContent).not.toMatch(/\bCTRL\b|four answers|chief of staff/i);
  });
  it("updates the same answer panel for a reader's choice", () => {
    const view = render(createElement(LiquidBrain));
    try {
      const panel = view.container.querySelector("#brain-answer")!;
      const button = within(view.container).getByRole("button", { name: "Taste" });
      fireEvent.click(button);
      expect(button).toHaveAttribute("aria-pressed", "true");
      expect(view.container.querySelector("#brain-answer")).toBe(panel);
      expect(panel.querySelector('[aria-hidden="false"]')).toHaveTextContent("Which detail makes this feel right or wrong to you?");
      fireEvent.click(within(view.container).getByRole("button", { name: "Preferences" }));
      const guess = within(view.container).getByRole("button", { name: "Preferences" });
      expect(guess).toHaveAttribute("data-guess", "pending");
      fireEvent.click(within(view.container).getByRole("button", { name: "Confirm this preference" }));
      expect(guess).toHaveAttribute("data-guess", "confirmed");
    } finally { view.unmount(); }
  });
  it("opens the six wishes from the Sprint and follows the brief wish to its next card", () => {
    const view = render(createElement(MemoryRouter, {}, createElement(ProductSprint, { door: "brain", onStart: () => undefined })));
    try {
      const dialog = view.container.querySelector<HTMLDialogElement>(".product-stories")!;
      dialog.showModal = () => dialog.setAttribute("open", "");
      fireEvent.click(within(view.container).getByRole("button", { name: "Explore the stories" }));
      expect(dialog.open).toBe(true);
      const tabs = within(dialog).getAllByRole("tab");
      expect(tabs).toHaveLength(6);
      const brief = tabs.find(tab => tab.dataset.finderTab === "brief")!;
      fireEvent.click(brief);
      expect(brief).toHaveAttribute("aria-selected", "true");
      const panel = dialog.querySelector(".finder-panel.is-active")!;
      const next = panel.querySelector<HTMLButtonElement>("[data-finder-next]")!;
      const first = panel.querySelector('[data-deck="current"]');
      expect(first).toBeTruthy();
      expect(next).toBeEnabled();
      fireEvent.click(next);
      expect(panel.querySelector('[data-deck="current"]')).not.toBe(first);
    } finally { view.unmount(); }
  });
  it("ends in the four weeks, the receipt and the six wishes", () => {
    expect(main.querySelectorAll(".sprint-weeks li")).toHaveLength(4);
    expect(main.querySelector(".product-receipt")?.textContent).toContain("What stays with you");
    expect(main.querySelectorAll("[data-finder-tab]")).toHaveLength(6);
  });
});

describe("the Brain's voice", () => {
  /* The public voice gates in brief2-public-contract.test.ts read the retired
     src/pages/AiBrain.tsx. These read what /ai-brain actually shows: the page
     source, its markup and every fixture line the instruments display. */
  const BANNED = ["agentic", "ai literacy", "ai fluency", "prompt engineering", "leveraging ai", "ai-powered", "future of work", "chief of staff", "productivity", "assistant", "thesis", "judgment"];
  const ANTITHESIS = [
    /\bnot [a-z]{2,}[^.?!]{0,40}, but\b/i,
    /\.\s+Not [A-Z][a-z]+[.,]/,
    /\bnever just\b/i,
    /\bit never\b[^.?!]{0,30}\bit does\b/i,
    /\b[a-z]+, not [a-z]+/i,
    /\bnot only\b/i,
  ];
  const stripComments = (source: string) => source
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*\/\/.*$/gm, "");
  const displayedFixture = [
    ...fixture.items.map((item) => item.title),
    ...fixture.relationships.map((relationship) => relationship.meaning),
    ...fixture.sources.flatMap((source) => [source.label, source.assertion]),
    ...fixture.corrections.map((correction) => correction.summary),
  ].join("\n");
  const surfaces: Array<[string, string]> = [
    ["src/pages/AiBrainLocked.tsx", stripComments(read("src/pages/AiBrainLocked.tsx"))],
    ["LiquidBrain", stripComments(read("src/components/mindmake/LiquidBrain.tsx"))],
    ["brain-fixture (displayed fields)", displayedFixture],
    ["src/components/mindmake/chiefOfStaff.ts", stripComments(read("src/components/mindmake/chiefOfStaff.ts"))],
  ];

  it.each(surfaces)("uses no banned framing in %s", (_surface, copy) => {
    for (const word of BANNED) expect(copy, word).not.toMatch(new RegExp(`\\b${word}\\b`, "i"));
  });

  it.each(surfaces)("uses no antithesis template in %s", (_surface, copy) => {
    for (const pattern of ANTITHESIS) expect(copy, String(pattern)).not.toMatch(pattern);
  });

  it.each(surfaces)("uses no em or en dash as punctuation in %s", (_surface, copy) => {
    expect(copy).not.toContain("—");
    expect(copy).not.toMatch(/\s–\s/);
  });
});

describe("the stepped build", () => {
  it("lights nothing before the instrument rises into view", () => {
    expect(sequenceProgress(900, 500, 900)).toBe(0);
    expect(stepStates(0, 4)).toEqual(["next", "next", "next", "next"]);
  });

  it("lights the steps in order and keeps the last one current when complete", () => {
    expect(stepStates(0.01, 4)).toEqual(["current", "next", "next", "next"]);
    expect(stepStates(0.5, 4)).toEqual(["past", "past", "current", "next"]);
    expect(stepStates(1, 4)).toEqual(["past", "past", "past", "current"]);
  });

  it("reaches the whole build once the instrument has risen by its own height", () => {
    const viewport = 900;
    const height = 520;
    const start = viewport * 0.85;
    expect(sequenceProgress(start, height, viewport)).toBe(0);
    expect(sequenceProgress(start - height, height, viewport)).toBe(1);
    expect(sequenceProgress(start - height / 2, height, viewport)).toBeCloseTo(0.5);
  });

  it("paces the month by its own steps, each lit as it reaches the reading line", () => {
    // Four steps 100px apart; the reading line at 600px.
    const tops = (first: number) => [first, first + 100, first + 200, first + 300];
    expect(readingProgress(tops(620), 600)).toBe(0);
    expect(stepStates(readingProgress(tops(599), 600), 4)).toEqual(["current", "next", "next", "next"]);
    // The third step (Day 30) is only current once its own top is past the line.
    expect(stepStates(readingProgress(tops(401), 600), 4)).toEqual(["past", "current", "next", "next"]);
    expect(stepStates(readingProgress(tops(399), 600), 4)).toEqual(["past", "past", "current", "next"]);
    // The days keep pace: halfway through a step is halfway through its share.
    expect(readingProgress(tops(350), 600)).toBeCloseTo(0.625);
    expect(readingProgress(tops(200), 600)).toBe(1);
    expect(readingProgress([], 600)).toBe(1);
  });



  it("undoes itself on the way back", () => {
    const viewport = 844;
    const positions = [700, 500, 300, 100, 300, 500, 700];
    const states = positions.map((top) => stepStates(sequenceProgress(top, 420, viewport), 5).join(","));
    expect(states.slice(0, 4)).toEqual([...states.slice(3)].reverse());
  });
});
