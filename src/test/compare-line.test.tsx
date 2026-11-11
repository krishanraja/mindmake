import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CompareLine } from "@/components/mindmake/CompareLine";
import { COMPARE } from "@/data/compareBoard";

/**
 * "Instead of…" on the closes of /ai-brain and /ai-gtm.
 *
 * The rules that matter: the verdict is never empty, every choice updates it,
 * the grades stay honest (some Partly, never every rival No), the copy carries
 * no em dashes, and closing the board puts the reader back where they were.
 */
afterEach(() => cleanup());

describe("compare data", () => {
  for (const [page, data] of Object.entries(COMPARE)) {
    it(`${page}: five criteria, valid grades, honest Partly grades, clean copy`, () => {
      expect(data.criteria).toHaveLength(5);
      expect(data.initial).toBeGreaterThanOrEqual(0);
      expect(data.initial).toBeLessThan(data.alts.length);
      for (const [, grades] of data.alts) expect(grades).toMatch(/^[YPN]{5}$/);
      expect(data.alts.some(([, grades]) => grades.includes("P"))).toBe(true);
      const copy = JSON.stringify(data);
      expect(copy).not.toMatch(/—|–/);
      expect(copy).not.toMatch(/\$|£|€|\bprice[sd]? (?:from|at)\b/i);
    });
  }
});

describe("CompareLine", () => {
  it("starts with a verdict and updates it for every choice", () => {
    const data = COMPARE.brain;
    const { container } = render(<CompareLine page="brain" />);
    const select = screen.getByLabelText("Instead of") as HTMLSelectElement;
    expect(select.value).toBe(String(data.initial));
    const live = container.querySelector("[aria-live='polite']")!;
    data.alts.forEach(([, , give], k) => {
      fireEvent.change(select, { target: { value: String(k) } });
      const visible = container.querySelectorAll(".mm-compare-stack > p");
      expect(visible).toHaveLength(1);
      expect(visible[0].textContent).toContain(give);
      expect(live).toBe(visible[0]);
    });
    // Every line stays in the one cell, so its height is the longest line's and never changes.
    expect(container.querySelectorAll(".mm-compare-stack > *")).toHaveLength(data.alts.length);
  });

  it("labels every dot with its criterion and grade", () => {
    render(<CompareLine page="gtm" />);
    const dots = screen.getAllByRole("img", { hidden: true });
    expect(dots.length).toBeGreaterThan(0);
    for (const dot of dots) expect(dot.getAttribute("aria-label")).toMatch(/: (Yes|Partly|No)$/);
  });

  it("opens the board as a modal and returns the reader to the same place and button", () => {
    const { container } = render(<CompareLine page="gtm" />);
    const dialog = container.querySelector("dialog") as HTMLDialogElement;
    dialog.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); });
    dialog.close = vi.fn(function (this: HTMLDialogElement) { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); });
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const trigger = screen.getByRole("button", { name: /See all 10 side by side/ });
    fireEvent.click(trigger);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect(document.documentElement.classList.contains("mm-compare-locked")).toBe(true);
    expect(container.querySelector(".mm-compare-row.is-pick")?.textContent).toContain(COMPARE.gtm.alts[COMPARE.gtm.initial][0]);
    fireEvent.click(screen.getByRole("button", { name: "Close and go back", hidden: true }));
    expect(document.documentElement.classList.contains("mm-compare-locked")).toBe(false);
    expect(document.activeElement).toBe(trigger);
    expect(scrollTo).not.toHaveBeenCalled();
    scrollTo.mockRestore();
  });
});
