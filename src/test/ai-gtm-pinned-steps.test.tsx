import { act, cleanup, render } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import { heldProgress, stepFor, usePinnedSteps } from "@/hooks/usePinnedSteps";

/**
 * The /ai-gtm chapters pin and step with scroll (r44). The step is derived
 * from position and nothing else, which is what makes the chapter reverse on
 * the way back up and release by itself at either end. These tests hold that
 * contract without a browser: the geometry is stubbed the way the homepage
 * pin lifecycle test stubs it, and the page is moved by setting where the
 * track sits relative to the viewport.
 */

const HEADER = 68;
const STAGE = 700;
const COUNT = 4;
const HELD = 4 * 400;
const TRACK = STAGE + HELD;

let trackTop = 900;
let position = "sticky";

function Probe({ onReady }: { onReady: (api: ReturnType<typeof usePinnedSteps<HTMLElement>>) => void }) {
  const api = usePinnedSteps<HTMLElement>(COUNT, { lockMs: 50 });
  onReady(api);
  return (
    <section ref={api.trackRef}>
      <div ref={api.stageRef}>
        {[0, 1, 2, 3].map((index) => <p key={index} data-gtm-step={index} data-active={index === api.step}>{index}</p>)}
      </div>
    </section>
  );
}

function mount() {
  let api!: ReturnType<typeof usePinnedSteps<HTMLElement>>;
  const view = render(<Probe onReady={(next) => { api = next; }} />);
  const section = view.container.querySelector("section")!;
  const stage = section.querySelector("div")!;
  vi.spyOn(section, "getBoundingClientRect").mockImplementation(() => ({ top: trackTop, height: TRACK, bottom: trackTop + TRACK, left: 0, right: 0, width: 0, x: 0, y: trackTop, toJSON: () => ({}) }) as DOMRect);
  Object.defineProperty(section, "offsetHeight", { configurable: true, get: () => TRACK });
  Object.defineProperty(stage, "offsetHeight", { configurable: true, get: () => STAGE });
  return { view, section, stage, api: () => api };
}

/* Move the page so the stage has travelled `px` into its held distance. */
async function scrollHeld(px: number) {
  trackTop = HEADER - px;
  await act(async () => {
    window.dispatchEvent(new Event("scroll"));
    await new Promise((resolveFrame) => requestAnimationFrame(() => resolveFrame(null)));
  });
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  trackTop = 900;
  position = "sticky";
});

function stubLayout() {
  vi.spyOn(window, "getComputedStyle").mockImplementation(() => ({ position, top: `${HEADER}px` }) as CSSStyleDeclaration);
}

describe("the pinned-step maths", () => {
  it("measures travel from the stage's own sticky top, not the viewport's", () => {
    expect(heldProgress(HEADER, HEADER, TRACK, STAGE)).toBe(0);
    expect(heldProgress(HEADER - HELD / 2, HEADER, TRACK, STAGE)).toBe(0.5);
    expect(heldProgress(HEADER - HELD, HEADER, TRACK, STAGE)).toBe(1);
    // Before the pin and after the release it holds at the ends.
    expect(heldProgress(900, HEADER, TRACK, STAGE)).toBe(0);
    expect(heldProgress(-5000, HEADER, TRACK, STAGE)).toBe(1);
  });

  it("gives every step an equal band and never runs past the last", () => {
    expect([0, 0.24, 0.25, 0.49, 0.5, 0.74, 0.75, 1].map((p) => stepFor(p, 4))).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
    expect(stepFor(-1, 3)).toBe(0);
    expect(stepFor(2, 3)).toBe(2);
  });
});

describe("usePinnedSteps", () => {
  it("renders step 0 on the server, with every step present and none hidden from assistive technology", () => {
    const html = renderToString(<Probe onReady={() => undefined} />);
    expect(html.match(/data-gtm-step=/g)).toHaveLength(4);
    expect(html).toContain('data-gtm-step="0" data-active="true"');
    expect(html).not.toContain("aria-hidden");
  });

  it("steps forward and back again from position alone", async () => {
    stubLayout();
    const { api } = mount();
    const seen: number[] = [];
    for (const px of [0, 450, 850, 1250, 1590, 1250, 850, 450, 0]) {
      await scrollHeld(px);
      seen.push(api().step);
    }
    expect(seen).toEqual([0, 1, 2, 3, 3, 3, 2, 1, 0]);
  });

  it("publishes its progress on the track for the rail and the month to read", async () => {
    stubLayout();
    const { section } = mount();
    await scrollHeld(HELD / 2);
    expect(section.style.getPropertyValue("--gtm-progress")).toBe("0.5000");
  });

  it("moves the page to the middle of a step's band when a control asks, and holds the step while it travels", async () => {
    stubLayout();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }));
    const { api } = mount();
    await scrollHeld(0);
    await act(async () => api().goTo(2));
    expect(api().step).toBe(2);
    const target = scrollTo.mock.calls[0][0] as ScrollToOptions;
    expect(target.behavior).toBe("smooth");
    // window.scrollY is 0 in jsdom; the stage is at the pin, so the target is
    // two and a half bands into the held distance.
    expect(target.top).toBe(Math.round(HELD * (2.5 / COUNT)));
    // A scroll event inside the lock does not snap the step back.
    await scrollHeld(10);
    expect(api().step).toBe(2);
    // Once the lock has passed, position rules again.
    await act(async () => { await new Promise((done) => setTimeout(done, 80)); });
    await scrollHeld(10);
    expect(api().step).toBe(0);
  });

  it("keeps every step under reduced motion, and only jumps rather than glides", async () => {
    stubLayout();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query.includes("reduce"), media: query, addEventListener: () => undefined, removeEventListener: () => undefined }));
    const { api } = mount();
    // Unlike the site's progress driver, reduced motion does not force the end state.
    await scrollHeld(0);
    expect(api().step).toBe(0);
    await scrollHeld(450);
    expect(api().step).toBe(1);
    await act(async () => api().goTo(3));
    expect((scrollTo.mock.calls[0][0] as ScrollToOptions).behavior).toBe("auto");
  });

  it("lets the stylesheet unpin it, and then takes a control to the step in flow", async () => {
    position = "static";
    stubLayout();
    const { api, stage } = mount();
    const target = stage.querySelector<HTMLElement>('[data-gtm-step="2"]')!;
    const into = vi.fn();
    target.scrollIntoView = into;
    await scrollHeld(0);
    expect(api().pinned).toBe(false);
    await act(async () => api().goTo(2));
    expect(into).toHaveBeenCalledTimes(1);
  });

  it("stops listening when it unmounts", async () => {
    stubLayout();
    const remove = vi.spyOn(window, "removeEventListener");
    const { view } = mount();
    view.unmount();
    const removed = remove.mock.calls.map(([type]) => type);
    expect(removed).toContain("scroll");
    expect(removed).toContain("resize");
  });

  it("never takes over the reader's own input", () => {
    const source = readFileSync(resolve(__dirname, "../hooks/usePinnedSteps.ts"), "utf8");
    for (const banned of ["IntersectionObserver", "\"wheel\"", "\"touchmove\"", "preventDefault", "keydown"]) {
      expect(`${banned}: ${source.includes(banned)}`).toBe(`${banned}: false`);
    }
    // No latch: a step reached once is not remembered, it is re-read from position.
    expect(source).not.toMatch(/\b(started|seen|hasFired|played)\b/);
  });
});
