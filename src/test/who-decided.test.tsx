import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, cleanup, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { FACTS, LEVELS, STEPS, SUBTITLE, THESIS, readDecision } from "@/features/who-decided/audit";
import WhoDecided from "@/pages/WhoDecided";

const source = (path: string) => readFileSync(path, "utf8");

describe("Who decided? evidence, never a score", () => {
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
    expect(source("scripts/lib/pages.mjs")).not.toContain("/who-decided");
    expect(source("src/lib/publicLinks.ts")).not.toContain("/who-decided");
    const head = source("index.html");
    expect(head).toContain("window.mmPrivateAuditDocument || window.mmGoogleTagLoaded");
    expect(head).toContain("window.mmPrivateAuditDocument || window.mmClarityLoaded");
    expect(head).toContain('!window.mmPrivateAuditDocument && !["localhost", "127.0.0.1"]');
  });

  it("renders the locked facts verbatim, keeps notes private, supports revision and clears work", () => {
    Element.prototype.scrollIntoView = vi.fn();
    render(<MemoryRouter initialEntries={["/who-decided"]}><WhoDecided /></MemoryRouter>);
    expect(screen.getByText(THESIS)).toBeInTheDocument();
    expect(screen.getByText(SUBTITLE)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Begin the audit/ }));
    expect(screen.getByRole("button", { name: /Continue/ })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("Your note on the decision"), { target: { value: "private synthetic decision" } });
    for (let index = 0; index < 6; index++) {
      expect(screen.getByText(`Step ${index + 1} of 6`)).toBeInTheDocument();
      expect(screen.getAllByRole("radio")).toHaveLength(4);
      fireEvent.click(screen.getByLabelText(STEPS[index].options[2].text));
      fireEvent.click(screen.getByRole("button", { name: index === 5 ? /Read my decision/ : /Continue/ }));
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
    expect(screen.getByText("private synthetic decision")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Revisit my answers" }));
    expect(screen.getByLabelText(STEPS[0].options[2].text)).toBeChecked();
    expect(screen.getByLabelText("Your note on the decision")).toHaveValue("private synthetic decision");
    fireEvent.click(screen.getByRole("button", { name: "Clear my work" }));
    fireEvent.click(screen.getByRole("button", { name: "Keep working" }));
    expect(screen.getByLabelText(STEPS[0].options[2].text)).toBeChecked();
    fireEvent.click(screen.getByRole("button", { name: "Clear my work" }));
    fireEvent.click(screen.getByRole("button", { name: "Yes, clear them" }));
    fireEvent.click(screen.getByRole("button", { name: /Begin the audit/ }));
    expect(screen.getByLabelText("Your note on the decision")).toHaveValue("");
    expect(screen.getAllByRole("radio").every(radio => !(radio as HTMLInputElement).checked)).toBe(true);
    fireEvent(window, new Event("pagehide"));
    expect(screen.getByRole("button", { name: /Begin the audit/ })).toBeInTheDocument();
    cleanup();
  });
});
