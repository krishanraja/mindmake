import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { act } from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { useReveal } from "@/hooks/useReveal";

/**
 * Entrance choreography, and what did not get lifted with the ban.
 *
 * Until 29 August 2026 the contract banned reveals outright and checked it by
 * asserting `IntersectionObserver` appeared nowhere. That was a good check of a
 * decision Krish has now reversed, so the check has to change with it: an
 * observer is allowed, and what is enforced instead is the thing the ban was
 * really protecting.
 *
 * Copy on this site has to be readable by a crawler that runs nothing, by a
 * screen reader, by somebody who asked for reduced motion, and by somebody who
 * lands halfway down a page from a search result. A reveal whose first state is
 * genuinely absent breaks all four, and it breaks them silently: the page looks
 * right to whoever built it, because they always arrive at the top with
 * JavaScript running and a working observer.
 *
 * So every test here is the same question asked four ways. If the reveal never
 * happens, is the page still whole?
 */

/** An observer that records what it was given and never fires. */
class SilentObserver {
  static observed: Element[] = [];
  static instances: SilentObserver[] = [];
  disconnected = false;
  constructor(_: IntersectionObserverCallback, readonly options?: IntersectionObserverInit) {
    SilentObserver.instances.push(this);
  }
  observe(element: Element) { SilentObserver.observed.push(element); }
  unobserve() { /* not used */ }
  disconnect() { this.disconnected = true; }
  takeRecords() { return []; }
}

function Revealed({ index = 0 }: { index?: number }) {
  const ref = useReveal<HTMLParagraphElement>(index);
  return <p ref={ref}>The decision and what changed next.</p>;
}

const setViewport = (height: number) => {
  Object.defineProperty(window, "innerHeight", { value: height, configurable: true });
};

const originalBox = Element.prototype.getBoundingClientRect;
const setBox = (top: number) => {
  Element.prototype.getBoundingClientRect = function rect() {
    return { top, bottom: top + 40, left: 0, right: 100, width: 100, height: 40, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
  };
};

/* Assigned, never redefined. src/test/setup.ts installs a no-op observer with
   `writable: true` and no `configurable`, so vi.stubGlobal and delete both throw
   on it and only plain assignment works. */
const originalObserver = window.IntersectionObserver;
const useObserver = (value: unknown) => {
  (window as unknown as Record<string, unknown>).IntersectionObserver = value;
};

const matchMedia = (reduced: boolean) => {
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: () => ({ matches: reduced, addEventListener: vi.fn(), removeEventListener: vi.fn() }),
  });
};

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Element.prototype.getBoundingClientRect = originalBox;
  useObserver(originalObserver);
  SilentObserver.observed = [];
  SilentObserver.instances = [];
});

describe("what a reveal is allowed to hide", () => {
  it("hides nothing at all when there is no observer", () => {
    matchMedia(false);
    setViewport(800);
    setBox(2000);
    useObserver(undefined);
    render(<Revealed />);
    expect(screen.getByText(/The decision/).dataset.reveal).toBeUndefined();
  });

  it("hides nothing for a visitor who asked for stillness", () => {
    matchMedia(true);
    setViewport(800);
    setBox(2000);
    useObserver(SilentObserver);
    render(<Revealed />);
    expect(screen.getByText(/The decision/).dataset.reveal).toBeUndefined();
    expect(SilentObserver.observed).toHaveLength(0);
  });

  it("hides nothing that is already on screen", () => {
    /* Somebody arriving from a search result at the middle of a page is looking
       at this element now. An entrance it has already missed is a blank space. */
    matchMedia(false);
    setViewport(800);
    setBox(120);
    useObserver(SilentObserver);
    render(<Revealed />);
    expect(screen.getByText(/The decision/).dataset.reveal).toBeUndefined();
  });

  it("shows anything the reader scrolls to even if the observer never fires", async () => {
    /* The backstop, and the one promise that had to be rebuilt. It was a
       two-second timer, which was wrong twice: on a real page every element was
       revealed before the reader had scrolled to one, so no arrival ever
       happened, and it guaranteed a moment rather than the reader's position.
       A scroll pass is the observer's job done by hand, so a silently broken
       observer costs nothing at all. */
    matchMedia(false);
    setViewport(800);
    setBox(2000);
    useObserver(SilentObserver);
    render(<Revealed />);
    expect(screen.getByText(/The decision/).dataset.reveal).toBe("pending");

    /* Time alone changes nothing now, which is the point. */
    await act(async () => { await new Promise((r) => setTimeout(r, 60)); });
    expect(screen.getByText(/The decision/).dataset.reveal).toBe("pending");

    setBox(400);
    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
      await new Promise((r) => requestAnimationFrame(() => r(null)));
    });
    expect(screen.getByText(/The decision/).dataset.reveal).toBe("shown");
  });

  it("keeps the text in the document the whole time", () => {
    /* The one that matters for a crawler and a screen reader: pending is a
       presentation state, never an absence. */
    matchMedia(false);
    setViewport(800);
    setBox(2000);
    useObserver(SilentObserver);
    const { container } = render(<Revealed />);
    expect(container.textContent).toContain("The decision and what changed next.");
    expect(screen.getByText(/The decision/).dataset.reveal).toBe("pending");
  });
});

describe("the presentation layer", () => {
  const css = readFileSync(resolve(__dirname, "../styles/mindmake.css"), "utf8");

  it("styles the pending state and nothing else", () => {
    /* Revealed is the default because it is the *unstyled* state. If the hidden
       styling keyed off the presence of the attribute rather than its pending
       value, an element the hook had touched and then failed to finish would
       stay invisible. */
    const block = css.slice(css.indexOf('[data-reveal="pending"] {'));
    expect(block.slice(0, block.indexOf("}"))).toContain("opacity: 0");
    expect(css).not.toMatch(/\[data-reveal\]\s*\{[^}]*opacity:\s*0/);
  });

  it("travels on an animation, because a transition loses to the card", () => {
    /* The first three arrivals shipped snapping rather than travelling, and
       nothing failed. `transition` is one property; .mm-enemy, .mm-story,
       .mm-fork and .mm-lever each set their own in mindmake-instruments.css,
       which loads after this file at the same specificity, so the card's
       one-property transition replaced the reveal's entirely.

       An animation cannot be overwritten by a transition, so this is checked as
       what it is: no `transition` on the reveal at all, and the fill mode that
       lets go afterwards rather than pinning `transform: none` forever. */
    const shown = css.slice(css.indexOf('[data-reveal="shown"] {'));
    const block = shown.slice(0, shown.indexOf("}"));
    expect(block).toContain("animation: mm-arrive");
    expect(block).toContain("backwards");
    expect(block).not.toContain("forwards");
    expect(block).not.toContain("transition");
    expect(css).toContain("@keyframes mm-arrive");

    /* And the collision itself, so this cannot be undone by moving a rule.
       Every card family the reveal is used on still owns its own transition;
       the point is that the two layers no longer touch. */
    const cards = readFileSync(resolve(__dirname, "../styles/mindmake-instruments.css"), "utf8");
    for (const card of [".mm-enemy {", ".mm-story {", ".mm-fork {", ".mm-lever {"]) {
      const rule = cards.slice(cards.indexOf(card));
      expect(rule.slice(0, rule.indexOf("}")), card).toContain("transition:");
    }
  });

  it("restores it under reduced motion even if the hook already marked one", () => {
    const guard = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce) {", css.indexOf('[data-reveal="pending"]')));
    expect(guard.slice(0, 200)).toContain('[data-reveal="pending"] { opacity: 1');
    expect(guard.slice(0, 200)).toContain('[data-reveal="shown"] { animation: none');
  });
});

describe("the entrance", () => {
  /* The page arrives once, and the way it does so is held to the same four
     promises as every reveal: nothing is hidden unless a script has said so,
     the hidden state is the exception and never the default, arrival travels
     on an animation with a fill that lets go, and reduced motion is handed
     everything at once. */
  const css = readFileSync(resolve(__dirname, "../styles/mindmake.css"), "utf8");
  const entrance = css.slice(css.indexOf("The entrance: the page arrives once"));

  it("hides type only under a class the head script sets", () => {
    /* Read over the entrance's own block. The rest of the file has its own
       reasons to write opacity: 0, such as the burger's bars once the menu is
       open, and none of them is an entrance. */
    const rules = entrance.replace(/\/\*[\s\S]*?\*\//g, "");
    const hidden = [...rules.matchAll(/([^{}]+)\{[^}]*opacity:\s*0\s*;[^}]*\}/g)].map((m) => m[1].trim());
    expect(hidden.length).toBeGreaterThan(0);
    for (const selector of hidden) {
      expect(`${selector}: sanctioned`).toBe(
        /^\[data-reveal="pending"\]$|^\.mm-pending /.test(selector) || /mm-arrive-fade|from$/.test(selector)
          ? `${selector}: sanctioned`
          : `${selector}: hides something with no script to release it`,
      );
    }
    expect(entrance).toContain(".mm-pending .mm-first,");
  });

  it("arrives on an animation that lets go, never a transition", () => {
    const arrived = entrance.slice(entrance.indexOf(".mm-arrived .mm-first {"));
    const block = arrived.slice(0, arrived.indexOf("}"));
    expect(block).toContain("animation: mm-arrive");
    expect(block).toContain("backwards");
    expect(block).not.toContain("transition");
  });

  it("is hidden by default and handed over whole under reduced motion", () => {
    expect(entrance).toContain(".mm-curtain { display: none; }");
    const guard = entrance.slice(entrance.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(guard).toContain(".mm-covered .mm-curtain { display: none; }");
    expect(guard).toContain(".mm-pending .mm-first, .mm-pending .mm-menu-button { opacity: 1; }");
    expect(guard).toContain("animation: none");
  });
});

describe("the motion law, as it now stands", () => {
  const ROOT = resolve(__dirname, "../..");
  const read = (path: string) => readFileSync(resolve(ROOT, path), "utf8");

  it("says entrance choreography is sanctioned, and on what condition", () => {
    const contract = read("project-documentation/03_DESIGN_CONTRACT.md");
    expect(contract).toMatch(/entrance choreography is sanctioned/i);
    /* The lift is conditional, and the condition is the whole of what the ban
       was protecting. A contract that just deleted the ban would leave nothing
       to point at when somebody ships a reveal that starts genuinely absent. */
    expect(contract).toMatch(/readable if the reveal never fires/i);
  });

  it("keeps one primitive, as the scroll layer does", () => {
    /* The ban was checkable because IntersectionObserver appeared nowhere. What
       replaces that is narrower: it appears in exactly one file. */
    const hook = read("src/hooks/useReveal.ts");
    expect(hook).toContain("IntersectionObserver");
    for (const surface of [
      "src/pages/Index.tsx",
      "src/pages/AiBrain.tsx",
      "src/pages/AiGtm.tsx",
      "src/hooks/useScrollDriver.ts",
      "src/components/mindmake/FilmPlate.tsx",
      "src/components/mindmake/MindmakeShell.tsx",
    ]) {
      expect(`${surface}: ${read(surface).includes("IntersectionObserver")}`).toBe(`${surface}: false`);
    }
  });
});
