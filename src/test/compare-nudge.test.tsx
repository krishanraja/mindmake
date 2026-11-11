import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { CompareNudge } from "@/components/mindmake/CompareNudge";
import { COMPARE } from "@/data/compareBoard";
import { leadershipStories } from "@/components/leadership-chapters/leadershipChapters";
import { storyFinderMarkup } from "@/components/leadership-chapters/storyFinder";

/**
 * "Prefer to …?" above "Where would you start?" on /ai-brain and /ai-gtm
 * (Krish, 2026-11-11).
 *
 * The rules that matter: the nudge sits before the question and says what a
 * tap does, the route on screen when tapped is the one the comparison opens
 * on, a tap before the page started is kept, the grades stay honest, the copy
 * carries no em dashes or company names, and closing puts the reader back
 * where they were with focus on the nudge.
 */
afterEach(() => cleanup());

/* As the two pages lay it out: the nudge, then the finder. */
function Harness({ page }: { page: "brain" | "gtm" }) {
  return (
    <>
      <CompareNudge page={page} />
      <div dangerouslySetInnerHTML={{ __html: storyFinderMarkup(leadershipStories, { kicker: false, door: page }) }} />
    </>
  );
}

function stubDialog(container: HTMLElement) {
  const dialog = container.querySelector("dialog.mm-compare-sheet") as HTMLDialogElement;
  dialog.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); });
  dialog.close = vi.fn(function (this: HTMLDialogElement) { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); });
  return dialog;
}

describe("compare data", () => {
  for (const [page, data] of Object.entries(COMPARE)) {
    it(`${page}: five criteria, valid grades, honest Partly grades, clean copy`, () => {
      expect(data.criteria).toHaveLength(5);
      for (const [, grades, , , prefer] of data.alts) {
        expect(grades).toMatch(/^[YPN]{5}$/);
        expect(prefer).toMatch(/^[a-z]/);
      }
      expect(data.alts.some(([, grades]) => grades.includes("P"))).toBe(true);
      const copy = JSON.stringify(data);
      expect(copy).not.toMatch(/—|–/);
      expect(copy).not.toMatch(/ChatGPT|OpenAI|Claude|Gemini|Copilot|McKinsey|Accenture/);
    });
  }
});

describe("CompareNudge", () => {
  it("is rendered by the page, not mounted into the finder", () => {
    for (const door of ["brain", "gtm", "library", undefined] as const) {
      expect(storyFinderMarkup(leadershipStories, { door })).not.toMatch(/data-compare-slot|finder-compare/);
    }
  });

  it("sits above the question, says what a tap does and opens on the route on screen", () => {
    const data = COMPARE.brain;
    const { container } = render(<Harness page="brain" />);
    const nudge = screen.getByRole("button", { name: /Prefer another route/ });
    const question = container.querySelector(".finder-question")!;
    expect(nudge.closest(".mm-compare-float")).not.toBeNull();
    expect(nudge.compareDocumentPosition(question) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(container.querySelector(".mm-nudge-go")?.textContent).toBe("See how we compare →");
    // The floating piece of the Brain paints into the orb, inside the button.
    expect(nudge.querySelector(".mm-orb .mm-orb-body canvas.mm-orb-goo")).not.toBeNull();
    expect(container.querySelector(".mm-nudge-slot [data-on]")?.textContent).toBe(`${data.alts[data.initial][4]}?`);
    // Every phrase shares one cell, so turning never changes the caption's width.
    expect(container.querySelectorAll(".mm-nudge-slot > span")).toHaveLength(data.alts.length);
    const dialog = stubDialog(container);
    fireEvent.click(nudge);
    expect(dialog.showModal).toHaveBeenCalledTimes(1);
    expect((screen.getByRole("combobox", { hidden: true }) as HTMLSelectElement).value).toBe(String(data.initial));
    expect(document.documentElement.classList.contains("mm-compare-locked")).toBe(true);
  });

  it("updates the verdict for every choice and keeps both views in one cell", () => {
    const data = COMPARE.gtm;
    const { container } = render(<Harness page="gtm" />);
    const select = screen.getByRole("combobox", { hidden: true }) as HTMLSelectElement;
    data.alts.forEach(([, grades, give], k) => {
      fireEvent.change(select, { target: { value: String(k) } });
      const live = container.querySelector(".mm-compare-stack > p")!;
      expect(live.getAttribute("aria-live")).toBe("polite");
      expect(live.textContent).toContain(give);
      const marks = [...container.querySelectorAll(".mm-compare-row:not(.is-head) [role='cell']:nth-child(2)")].map((m) => m.textContent);
      expect(marks).toEqual(grades.split("").map((g) => ({ Y: "Yes", P: "Partly", N: "No" })[g]));
    });
    expect(container.querySelectorAll(".mm-compare-stack > *")).toHaveLength(data.alts.length);
    const views = container.querySelectorAll(".mm-compare-views > *");
    expect(views).toHaveLength(2);
    fireEvent.click(screen.getByRole("button", { name: /See all 10 side by side/, hidden: true }));
    expect(views[0].getAttribute("aria-hidden")).toBe("true");
    expect(views[0].hasAttribute("inert")).toBe(true);
    expect(views[1].getAttribute("aria-hidden")).toBeNull();
  });

  it("labels every dot with its criterion and grade", () => {
    render(<Harness page="gtm" />);
    for (const dot of screen.getAllByRole("img", { hidden: true })) expect(dot.getAttribute("aria-label")).toMatch(/: (Yes|Partly|No)$/);
  });

  it("closes back to the same place with focus on the nudge", () => {
    const { container } = render(<Harness page="gtm" />);
    const dialog = stubDialog(container);
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    const nudge = screen.getByRole("button", { name: /Prefer another route/ });
    fireEvent.click(nudge);
    fireEvent.click(screen.getByRole("button", { name: "Close and go back", hidden: true }));
    expect(dialog.close).toHaveBeenCalled();
    expect(document.documentElement.classList.contains("mm-compare-locked")).toBe(false);
    expect(document.activeElement).toBe(nudge);
    expect(nudge.className).toContain("is-seen");
    expect(scrollTo).not.toHaveBeenCalled();
    scrollTo.mockRestore();
  });

  it("opens the comparison for a tap made before the page started", () => {
    const fn = vi.fn();
    window.__mmEarly = { door: "", compare: true, el: null, done: false, fn };
    // The page opens it while mounting, before a test could stub the element.
    const proto = HTMLDialogElement.prototype as HTMLDialogElement & { showModal?: () => void };
    const had = Object.getOwnPropertyDescriptor(proto, "showModal");
    proto.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); });
    try {
      const { container } = render(<Harness page="gtm" />);
      const dialog = container.querySelector("dialog.mm-compare-sheet") as HTMLDialogElement;
      expect(dialog.hasAttribute("open")).toBe(true);
      expect(window.__mmEarly?.compare).toBe(false);
    } finally {
      if (had) Object.defineProperty(proto, "showModal", had); else Reflect.deleteProperty(proto, "showModal");
      delete window.__mmEarly;
      document.documentElement.classList.remove("mm-compare-locked");
    }
  });
});
