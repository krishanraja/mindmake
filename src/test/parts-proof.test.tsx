import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { BuiltBy, DecisionMath, PartsEngine, PartsVersus, Stories } from "@/components/ui/parts-proof";
import { testimonials } from "@/data/testimonials";

describe("parts proof (Krish, 18 November 2026)", () => {
  it("Built by names Krish, links to krishraja.com to verify, and never names his former employer", () => {
    render(<BuiltBy />);
    expect(screen.getByRole("link", { name: "krishraja.com" }).getAttribute("href")).toBe("https://www.krishraja.com");
    expect(screen.getByAltText("Krish Raja")).toBeTruthy();
    const source = readFileSync(`${process.cwd()}/src/components/ui/parts-proof.tsx`, "utf8");
    expect(source).toContain("a national media group");
    expect(source).not.toMatch(/\bNine\b/);
  });
  it("the math is the reader's own numbers: stake times how much more often they are right, against $59", () => {
    const { container } = render(<DecisionMath />);
    const result = () => container.querySelector("dd[aria-live]")!.textContent;
    expect(result()).toBe("$10,000");
    fireEvent.click(screen.getByRole("button", { name: "$5,000,000" }));
    fireEvent.click(screen.getByRole("button", { name: "1 in 20" }));
    expect(result()).toBe("$250,000");
    expect(screen.getByText("$59")).toBeTruthy();
    expect(screen.getByText(/Dell'Acqua et al\., 2023/)).toBeTruthy();
  });
  it("stories are verbatim testimonials with the result in bold, and say buyer stories come next", () => {
    const { container } = render(<Stories />);
    const bold = [...container.querySelectorAll("blockquote strong")].map(node => node.textContent);
    expect(bold.length).toBeGreaterThanOrEqual(6);
    for (const text of bold) expect(testimonials.some(t => t.excerpt === text && t.full.includes(text!))).toBe(true);
    expect(screen.getByText(/stories from buyers come next/)).toBeTruthy();
  });
  it("the exit question makes no scarcity claim and offers a way out", () => {
    const source = readFileSync(`${process.cwd()}/src/components/ui/parts-proof.tsx`, "utf8");
    expect(source).toContain("Nothing. Close this.");
    expect(source).not.toMatch(/next \d+ orders|only \d+ left|price rises|ends (today|soon)/i);
  });
  it("the comparison is honest: every rival scores something, and names categories, never companies", () => {
    const { container } = render(<PartsVersus />);
    const names = [...container.querySelectorAll(".kit-versus-choices button")].map(b => b.textContent!);
    expect(names).toContain("A saved prompt"); expect(names).toContain("A Claude skill");
    for (const name of names) {
      fireEvent.click(screen.getByRole("button", { name }));
      const grades = [...container.querySelectorAll("td[data-grade]")].map(td => td.textContent);
      expect(grades.some(g => g !== "No")).toBe(true);
    }
  });
  it("the engine states only what the release proves", () => {
    render(<PartsEngine />);
    expect(screen.getByText(/289 automated tests and 355 simulated edge cases/)).toBeTruthy();
    expect(screen.getByText(/No AI model sits inside the checks/)).toBeTruthy();
  });
});
