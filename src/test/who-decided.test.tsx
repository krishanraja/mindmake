import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { readFileSync } from "node:fs";
import { FACTS, LEVELS, STEPS, SUBTITLE, THESIS, readDecision } from "@/features/who-decided/audit";
import WhoDecided from "@/pages/WhoDecided";

const source = (path: string) => readFileSync(path, "utf8");

const choices = [2, 1, 0, 2, 2, 1];
afterEach(cleanup);

function openAudit() {
  Element.prototype.scrollIntoView = vi.fn();
  render(<MemoryRouter initialEntries={["/measure-your-ai-judgement"]}><WhoDecided /></MemoryRouter>);
  return within(screen.getByRole("article"));
}

function completeQuestions(audit: ReturnType<typeof openAudit>, positions = choices) {
  for (const [index, step] of STEPS.entries()) fireEvent.click(audit.getByRole("button", { name: step.options[positions[index]].text }));
}

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
    for (const path of ["src/features/who-decided/audit.ts", "src/pages/WhoDecided.tsx", "src/features/who-decided/DecisionResults.tsx", "src/features/who-decided/CompoundingExample.tsx"]) {
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

  it("shows one question at a time and grounds the first result in the reader’s choices", () => {
    const audit = openAudit();
    expect(audit.getByText(SUBTITLE)).toBeVisible();
    fireEvent.click(audit.getByRole("button", { name: /Begin/ }));
    for (const [index, step] of STEPS.entries()) {
      const question = audit.getByRole("heading", { level: 1 });
      expect(question).toHaveTextContent(step.question);
      expect(question).toHaveTextContent(`Question ${index + 1} of 6`);
      expect(audit.queryByText(step.prompt)).toBeNull();
      expect(within(audit.getByRole("group")).getAllByRole("button")).toHaveLength(4);
      if (index === 1) {
        fireEvent.click(audit.getByRole("button", { name: "Previous question" }));
        const previous = audit.getByRole("button", { name: STEPS[0].options[2].text });
        expect(previous).toHaveAttribute("aria-pressed", "true");
        fireEvent.click(previous);
      }
      fireEvent.click(audit.getByRole("button", { name: step.options[choices[index]].text }));
    }
    const standard = STEPS[2];
    expect(audit.getByRole("heading", { name: standard.nextTitle })).toHaveFocus();
    expect(audit.getByText(standard.options[0].meaning, { exact: true })).toBeVisible();
    expect(audit.getByText(standard.practice)).toBeVisible();
    fireEvent.click(audit.getByText("See my six answers"));
    expect(audit.getAllByRole("listitem")).toHaveLength(6);
    expect(audit.getByText(`“${standard.options[0].text}”`)).toBeVisible();
  });

  it("copies the reader’s rule and offers manual copying if the clipboard is unavailable", async () => {
    const clipboard = vi.fn().mockResolvedValue(undefined);
    const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText: clipboard } });
    try {
      const audit = openAudit();
      fireEvent.click(audit.getByRole("button", { name: /Begin/ }));
      completeQuestions(audit);
      fireEvent.click(audit.getByRole("button", { name: "Turn this into an AI brain rule" }));
      expect(audit.getByRole("heading", { name: "Give your AI a rule you own." })).toHaveFocus();
      expect(audit.getByText(STEPS[2].example)).toBeVisible();
      fireEvent.click(audit.getByRole("button", { name: "Copy my rule" }));
      expect(await audit.findByRole("button", { name: "Rule copied" })).toBeVisible();
      expect(clipboard).toHaveBeenCalledWith(STEPS[2].rule);
      clipboard.mockRejectedValueOnce(new Error("clipboard unavailable"));
      fireEvent.click(audit.getByRole("button", { name: "Rule copied" }));
      expect(await audit.findByText(/Use your device’s Copy command/)).toBeVisible();
      expect(window.getSelection()?.toString()).toBe(STEPS[2].rule);
    } finally {
      if (originalClipboard) Object.defineProperty(navigator, "clipboard", originalClipboard);
      else Reflect.deleteProperty(navigator, "clipboard");
    }
  });

  it("models adjustable growth separately from the audit, caps the catch rate and opens a fresh brief", () => {
    const audit = openAudit();
    fireEvent.click(audit.getByRole("button", { name: /Begin/ }));
    completeQuestions(audit);
    fireEvent.click(audit.getByRole("button", { name: "Turn this into an AI brain rule" }));
    fireEvent.click(audit.getByRole("button", { name: "See how the gains add up" }));
    expect(audit.getByRole("heading", { name: "What if each week built on the last?" })).toHaveFocus();
    expect(audit.getByLabelText("Assumed weekly gain")).toHaveValue("10");
    expect(audit.getByLabelText("Time improving the rule")).toHaveValue("13");
    expect(audit.getByText("Week 13 · 34.5%")).toBeVisible();
    expect(audit.getByText("3.45×", { exact: true })).toBeVisible();
    expect(audit.getByText("147 more")).toBeVisible();
    fireEvent.change(audit.getByLabelText("Time improving the rule"), { target: { value: "52" } });
    expect(audit.getByText("Week 52 · 100%")).toBeVisible();
    fireEvent.change(audit.getByLabelText("Assumed weekly gain"), { target: { value: "0" } });
    expect(audit.getByText("Week 52 · 10%")).toBeVisible();
    expect(audit.getByText("0 more")).toBeVisible();
    fireEvent.click(audit.getByRole("button", { name: "Back to your AI brain" }));
    fireEvent.click(audit.getByRole("button", { name: "See how the gains add up" }));
    expect(audit.getByLabelText("Assumed weekly gain")).toHaveValue("0");
    expect(audit.getByLabelText("Time improving the rule")).toHaveValue("52");
    fireEvent.click(audit.getByText("Research behind the audit"));
    for (const fact of FACTS) {
      expect(audit.getByText(fact.text)).toBeVisible();
      expect(audit.getByRole("link", { name: fact.attribution })).toHaveAttribute("href", fact.href);
    }
    expect(audit.getByText(THESIS)).toBeVisible();
    expect(audit.getByRole("link", { name: "Start your brief" })).toHaveAttribute("href", "/?start=1");
  });

  it("honours established habits and supports revising, cancelling and clearing", () => {
    const audit = openAudit();
    fireEvent.click(audit.getByRole("button", { name: /Begin/ }));
    completeQuestions(audit);
    fireEvent.click(audit.getByRole("button", { name: "Revisit my answers" }));
    expect(audit.getByRole("button", { name: STEPS[0].options[2].text })).toHaveAttribute("aria-pressed", "true");
    completeQuestions(audit, Array(6).fill(3));
    expect(audit.getByRole("heading", { name: "Take a good habit into your next decision." })).toBeVisible();
    expect(audit.getByText(STEPS[0].options[3].meaning)).toBeVisible();
    fireEvent.click(audit.getByRole("button", { name: "Clear my work" }));
    fireEvent.click(audit.getByRole("button", { name: "Keep working" }));
    expect(audit.getByRole("button", { name: "Turn this into an AI brain rule" })).toBeVisible();
    fireEvent.click(audit.getByRole("button", { name: "Clear my work" }));
    fireEvent.click(audit.getByRole("button", { name: "Yes, clear them" }));
    fireEvent.click(audit.getByRole("button", { name: /Begin/ }));
    expect(within(audit.getByRole("group")).getAllByRole("button").every(button => button.getAttribute("aria-pressed") === "false")).toBe(true);
    fireEvent(window, new Event("pagehide"));
    expect(audit.getByRole("button", { name: /Begin/ })).toBeVisible();
  });

  it("retains the three research findings verbatim", () => {
    expect(FACTS.map(fact => fact.text)).toEqual([
      "Across 106 experiments, people working with AI did better when they were already better than the AI at the task, and worse when they were not.",
      "Consultants given AI on a task beyond what it could do were 19 percentage points less likely to get it right.",
      "Knowledge workers who trusted AI more reported thinking less critically; those more confident in their own judgement thought more critically.",
    ]);
  });
});
