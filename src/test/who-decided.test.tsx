import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { FACTS, LEVELS, STEPS, SUBTITLE, THESIS, readDecision } from "@/features/who-decided/audit";
import WhoDecided from "@/pages/WhoDecided";

const source = (path: string) => readFileSync(path, "utf8");

describe("Measure your AI judgement evidence, never a score", () => {
  it("maps each step's four behaviours to the four evidence levels", () => {
    expect(STEPS.map(step => step.id)).toEqual(["decision", "evidence", "standard", "numbers", "handover", "pattern"]);
    for (const step of STEPS) {
      expect(step.options.map(option => option.level)).toEqual(["Aware", "Supported", "Independent", "Adapting"]);
      for (const option of step.options) {
        expect(option.text.length).toBeGreaterThan(20);
        expect(option.meaning.length).toBeGreaterThan(20);
      }
    }
  });

  it("chooses the lowest level, with ties in question order, for every combination", () => {
    for (let combination = 0; combination < 4096; combination++) {
      const positions = STEPS.map((_, index) => Math.floor(combination / 4 ** index) % 4);
      const answers = positions.map(index => LEVELS[index]);
      const read = readDecision(answers)!;
      expect(read.first.id).toBe(STEPS[positions.indexOf(Math.min(...positions))].id);
      expect(read.lines.map(line => line.level)).toEqual(answers);
      expect(Object.keys(read)).toEqual(["lines", "first"]);
      expect(JSON.stringify(read)).not.toMatch(/score|percentage|grade|badge/i);
      read.lines.forEach((line, index) => expect(line.meaning).toBe(STEPS[index].options[positions[index]].meaning));
    }
  });

  it("does not turn missing, extra or unknown answers into a read", () => {
    expect(readDecision([])).toBeNull();
    expect(readDecision([null, ...Array(5).fill("Independent")])).toBeNull();
    expect(readDecision(Array(6).fill("unknown"))).toBeNull();
    expect(readDecision(Array(7).fill("Aware"))).toBeNull();
    expect(readDecision(new Array(6))).toBeNull();
  });

  it("has no answer transport, persistence, tracking or form submission in the audit module", () => {
    for (const path of ["src/features/who-decided/audit.ts", "src/pages/WhoDecided.tsx"]) {
      expect(source(path)).not.toMatch(/\b(fetch|sendBeacon|XMLHttpRequest|WebSocket|localStorage|sessionStorage|indexedDB|supabase|track|gtag|plausible)\b|<form\b|document\.cookie/);
    }
    expect(source("scripts/lib/pages.mjs")).not.toContain("/measure-your-ai-judgement");
    expect(source("src/lib/publicLinks.ts")).not.toContain("/measure-your-ai-judgement");
    const head = source("index.html");
    // The audit loads as its own private document; a stale path here makes the page reload forever.
    expect(head).toContain("window.mmPrivateAuditDocument = /^\\/measure-your-ai-judgement\\/?$/.test(window.location.pathname)");
    expect(head).toContain("window.mmPrivateAuditDocument || window.mmGoogleTagLoaded");
    expect(head).toContain("window.mmPrivateAuditDocument || window.mmClarityLoaded");
    expect(head).toContain('!window.mmPrivateAuditDocument && !["localhost", "127.0.0.1"]');
  });

  it("shows only the question, moves on at a tap, keeps the locked facts verbatim and clears work", () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<MemoryRouter initialEntries={["/measure-your-ai-judgement"]}><WhoDecided /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "Measure your AI judgement" })).toBeInTheDocument();
    expect(screen.getByText(SUBTITLE)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Begin/ }));
    for (let index = 0; index < 6; index++) {
      const question = screen.getByRole("heading", { level: 1 });
      expect(question).toHaveTextContent(STEPS[index].question);
      expect(question).toHaveTextContent(`Question ${index + 1} of 6`);
      // Nothing but the question: no step title, prompt, note, clear or progress words.
      expect(screen.queryByText(STEPS[index].title)).toBeNull();
      expect(screen.queryByText(STEPS[index].prompt)).toBeNull();
      expect(screen.queryByText(/Private note|Clear my work|Step \d of 6/)).toBeNull();
      expect(within(screen.getByRole("group")).getAllByRole("button")).toHaveLength(4);
      if (index === 1) {
        fireEvent.click(screen.getByRole("button", { name: "Previous question" }));
        expect(screen.getByRole("button", { name: STEPS[0].options[2].text })).toHaveAttribute("aria-pressed", "true");
        fireEvent.click(screen.getByRole("button", { name: STEPS[0].options[2].text }));
      }
      fireEvent.click(screen.getByRole("button", { name: STEPS[index].options[2].text }));
    }
    const exactFacts = [
      "Across 106 experiments, people working with AI did better when they were already better than the AI at the task, and worse when they were not.",
      "Consultants given AI on a task beyond what it could do were 19 percentage points less likely to get it right.",
      "Knowledge workers who trusted AI more reported thinking less critically; those more confident in their own judgement thought more critically.",
    ];
    expect(FACTS.map(fact => fact.text)).toEqual(exactFacts);
    for (const fact of exactFacts) expect(screen.getByText(fact)).toBeInTheDocument();
    for (const fact of FACTS) expect(screen.getByRole("link", { name: fact.attribution })).toHaveAttribute("href", fact.href);
    expect(screen.getByText("Vaccaro, Almaatouq and Malone, Nature Human Behaviour, 2024.")).toBeInTheDocument();
    expect(screen.getByText("Dell'Acqua et al., Harvard Business School and BCG, 2023 (758 consultants).")).toBeInTheDocument();
    expect(screen.getByText("Lee et al., Carnegie Mellon and Microsoft Research, CHI 2025 (319 knowledge workers, self-reported).")).toBeInTheDocument();
    expect(within(screen.getByRole("article")).getByRole("link", { name: "Start your brief" })).toHaveAttribute("href", "/?start=1");
    expect(screen.getByText(THESIS)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Revisit my answers" }));
    expect(screen.getByRole("button", { name: STEPS[0].options[2].text })).toHaveAttribute("aria-pressed", "true");
    for (let index = 0; index < 6; index++) fireEvent.click(screen.getByRole("button", { name: STEPS[index].options[2].text }));
    fireEvent.click(screen.getByRole("button", { name: "Clear my work" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep working" }));
    expect(screen.getByText(THESIS)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Clear my work" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, clear them" }));
    fireEvent.click(screen.getByRole("button", { name: /Begin/ }));
    expect(within(screen.getByRole("group")).getAllByRole("button").every(button => button.getAttribute("aria-pressed") === "false")).toBe(true);
    fireEvent(window, new Event("pagehide"));
    expect(screen.getByRole("button", { name: /Begin/ })).toBeInTheDocument();
    cleanup();
  });
});
