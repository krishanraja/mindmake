import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MindmakeProposal } from "@/components/mindmake/MindmakeProposal";

/**
 * The canon promises the visitor "the branded proposal on screen, by email, and
 * as a self-contained attachment". Nothing asserted the first of those three,
 * and it was removed for a whole commit without a single gate objecting. This
 * is that gate.
 *
 * It holds two things: that the proposal renders with the content it was given,
 * and that on screen it wears the step's own surface rather than the paper the
 * email and the attachment wear. Those two are the whole defect: the content
 * was never the problem, the paper was.
 */

const CONTENT = {
  company: "Northwind",
  domain: "northwind.com",
  pressure: "Our price no longer matches the value",
  known: "Northwind sells a managed service into mid-market logistics.",
  evidence: ["Their pricing page lists three tiers", "Two competitors moved to usage pricing"],
  carry: "The first pass of every proposal.",
  human: "The judgement about which deals are worth chasing.",
  proof: "Reprice one tier and test it with six real buyers.",
  capacityValue: "A day a week back for the calls only you can make.",
  preparedFor: "ada@northwind.com",
  nextStep: "reply" as const,
};

describe("the proposal on screen", () => {
  it("renders the read, the proof and the returned time", () => {
    render(<MindmakeProposal content={CONTENT} />);
    expect(screen.getByText(CONTENT.known)).toBeInTheDocument();
    expect(screen.getByText(CONTENT.carry)).toBeInTheDocument();
    expect(screen.getByText(CONTENT.human)).toBeInTheDocument();
    expect(screen.getByText(CONTENT.proof)).toBeInTheDocument();
    expect(screen.getByText(CONTENT.capacityValue)).toBeInTheDocument();
  });

  it("names the company and who it was prepared for", () => {
    render(<MindmakeProposal content={CONTENT} />);
    expect(screen.getByLabelText("Your private brief")).toBeInTheDocument();
    /* The company name is in the cover line and in the read, so scope to the
       cover rather than matching the page and finding both. */
    expect(screen.getByText(/prepared for ada@northwind\.com/)).toBeInTheDocument();
    const cover = document.querySelector(".mm-proposal-brand");
    expect(cover?.textContent).toContain("Mindmake");
    expect(cover?.textContent).toContain("Northwind");
  });

  it("carries the honesty framing, which is mandatory on every read", () => {
    render(<MindmakeProposal content={CONTENT} />);
    expect(screen.getByText(/illustrative/i)).toBeInTheDocument();
  });

  /* The dialog is dark and the proposal used to arrive as cream paper with a
     drop shadow, which is what made it read as an appendix rather than as the
     thing the visitor came for. On screen it takes the dialog's tone tokens;
     paper belongs to the email and the attachment, which are built elsewhere. */
  it("wears the step's surface on screen, not the paper the email wears", () => {
    const css = readFileSync(resolve("src/styles/mindmake-brief.css"), "utf8");
    const block = css.slice(css.indexOf(".mm-proposal {"), css.indexOf(".mm-proposal-foot p"));
    expect(block).toContain("--mmb-");
    expect(block).not.toContain("var(--mm-paper)");
    expect(block).not.toContain("box-shadow");
  });

  /* Deleting it from the success step is exactly what happened once already. */
  it("is still rendered by the brief dialog", () => {
    const dialog = readFileSync(resolve("src/components/mindmake/LeadBrief.tsx"), "utf8");
    expect(dialog).toContain("<MindmakeProposal");
    const success = dialog.slice(dialog.indexOf('{step === "success" && ('));
    expect(success.slice(0, 2_000)).toContain("MindmakeProposal");
  });

  /* The paper design still has a job: it is the email and the attachment, and
     it builds its own standalone HTML rather than sharing the screen's CSS, so
     restyling the screen cannot reach it. */
  it("leaves the paper document alone", () => {
    const paper = readFileSync(resolve("src/components/mindmake/privateBriefHtml.ts"), "utf8");
    expect(paper).toContain("#f4f0e8");
    expect(paper).toContain("box-shadow");
    expect(paper).toContain("@media print");
  });
});
