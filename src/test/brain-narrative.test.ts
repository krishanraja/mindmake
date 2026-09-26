import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";
import { sequenceProgress, stepStates } from "@/components/mindmake/locked/scrollSequence";
import fixture from "@/data/vnext/brain-fixture.json";

/**
 * /ai-brain after the S4 narrative (Krish, 2026-09-25) and its S5 sharpening
 * (Krish, 2026-09-26): the hero, then six chapters that speak to the reader.
 * You (the questions only they can answer), Inside (what a Brain holds, each
 * idea labelled with its standing), Sharper (one decision), Private (the living
 * record, reaching four kinds of work), Business (one call reaching the four
 * levers) and Built (the month we build it in). The source-check and
 * correction chapters stay retired.
 */

const ROOT = resolve(__dirname, "../..");
const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");
const MARKUP = "prototypes/website-redesign-recovery/brain-signature/index-s4-narrative-r1.html";

const page = () => new DOMParser().parseFromString(serverRender("/ai-brain"), "text/html");

describe("the Brain narrative", () => {
  it("runs the hero and six chapters in order", () => {
    const doc = page();
    const chapters = [...doc.querySelectorAll<HTMLElement>(".mm-locked-brain .chapter[data-phase]")];
    expect(chapters.map((chapter) => chapter.id)).toEqual(["opening", "you", "memory", "sharper", "living-record", "business", "built"]);
    expect(chapters.map((chapter) => chapter.dataset.phase)).toEqual(["opening", "you", "memory", "sharper", "record", "business", "built"]);
    expect(doc.querySelector("h1")?.textContent?.trim()).toBe("An AI brain of your own.");
  });

  it("points every rail link and the opening action at a real chapter", () => {
    const doc = page();
    const links = [...doc.querySelectorAll<HTMLAnchorElement>(".phase-rail a[data-phase-link]")];
    expect(links.map((link) => link.textContent?.replace(/^\d+/, "").trim())).toEqual(["You", "Inside", "Sharper", "Private", "Business", "Built"]);
    for (const link of links) {
      const target = doc.querySelector<HTMLElement>(link.getAttribute("href") ?? "#missing");
      expect(target?.dataset.phase, link.getAttribute("href") ?? "").toBe(link.dataset.phaseLink);
    }
    const action = doc.querySelector<HTMLAnchorElement>(".opening .primary-link");
    expect(action?.getAttribute("href")).toBe("#you");
  });

  it("keeps every instrument inside a chapter the scroll build reads", () => {
    const doc = page();
    const instruments = [...doc.querySelectorAll(".mm-locked-brain .instrument")];
    expect(instruments.length).toBe(6);
    for (const instrument of instruments) expect(instrument.closest(".chapter[data-phase]")).not.toBeNull();
  });

  it("steps through five questions, four decision leaves, four levers and the month", () => {
    const doc = page();
    const count = (selector: string) => doc.querySelectorAll(`${selector} [data-step]`).length;
    expect(count("#you .question-stack")).toBe(5);
    expect(count("#sharper .decision-stack")).toBe(4);
    expect(count("#business .lever-field")).toBe(4);
    expect(count("#built .month-field")).toBe(4);
    // Thirty days, each lighting at its own point in the month's four steps.
    expect(doc.querySelectorAll("#built .month-days i").length).toBe(30);
    // Nothing is dimmed in the server render: without script every step reads whole.
    expect(doc.querySelectorAll("[data-step-state]").length).toBe(0);
  });

  it("keeps the approved film, the constellation and the living record", () => {
    const html = serverRender("/ai-brain");
    expect(html.match(/data-motion-video="evidence"/g)?.length).toBe(1);
    for (const id of ["meaningFieldS2", "relationshipFieldS2", "meaningInspectorS2", "recordReelS2", "pauseRecordS2", "nextRecordS2", "completeRecordS2"]) {
      expect(html, id).toContain(`id="${id}"`);
    }
    // The inspector's label names the picked idea's standing, starting on the
    // settled idea the page opens with.
    expect(html).toContain('data-standing="settled">Agreed by you</span>');
  });

  it("names the work the record reaches, not AI companies, and says 30 days only where it builds", () => {
    const doc = page();
    const ports = [...doc.querySelectorAll("#living-record .record-ports li")].map((port) => port.textContent?.trim());
    expect(ports).toEqual(["Board paper", "Client reply", "Next post", "Team brief"]);
    // Ruling (Krish, 2026-09-26): the Brain is sold on the jobs it does, not on
    // integrations with named AI companies.
    const text = doc.querySelector(".mm-locked-brain")?.textContent ?? "";
    for (const vendor of ["ChatGPT", "OpenAI", "Claude", "Anthropic", "Copilot", "Gemini"]) expect(text, vendor).not.toContain(vendor);
    const main = doc.querySelector(".mm-locked-brain")!;
    const withDays = [...main.querySelectorAll<HTMLElement>(".chapter[data-phase]")].filter((chapter) => /30 days/.test(chapter.textContent ?? ""));
    expect(withDays.map((chapter) => chapter.id)).toEqual(["built"]);
  });

  it("retires the source check, the correction and the memory promise", () => {
    const html = serverRender("/ai-brain");
    for (const retired of ['id="proof"', 'id="correction"', "testSourceS2", "correctionMachine", "Nothing gets lost.", "One decision wakes the whole Brain.", "It remembers what mattered", "What this Brain holds", "approved source fixture"]) {
      expect(html, retired).not.toContain(retired);
    }
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
    [MARKUP, stripComments(read(MARKUP))],
    ["brain-fixture (displayed fields)", displayedFixture],
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

  it("undoes itself on the way back", () => {
    const viewport = 844;
    const positions = [700, 500, 300, 100, 300, 500, 700];
    const states = positions.map((top) => stepStates(sequenceProgress(top, 420, viewport), 5).join(","));
    expect(states.slice(0, 4)).toEqual([...states.slice(3)].reverse());
  });
});
