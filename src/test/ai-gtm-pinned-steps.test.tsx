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
/* How tall the stage's content is; the room it has is STAGE less a rail. */
let content = 400;

function Probe({ onReady, lockMs = 50 }: { onReady: (api: ReturnType<typeof usePinnedSteps<HTMLElement>>) => void; lockMs?: number }) {
  const api = usePinnedSteps<HTMLElement>(COUNT, { lockMs });
  onReady(api);
  return (
    <section ref={api.trackRef}>
      <div ref={api.stageRef}>
        <div className="gtm-stage-body">
          <div className="steps">
            {[0, 1, 2, 3].map((index) => <p key={index} data-gtm-step={index} data-active={index === api.step}>{index}</p>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function mount({ lockMs = 50 }: { lockMs?: number } = {}) {
  let api!: ReturnType<typeof usePinnedSteps<HTMLElement>>;
  const view = render(<Probe lockMs={lockMs} onReady={(next) => { api = next; }} />);
  const section = view.container.querySelector("section")!;
  const stage = section.querySelector("div")!;
  const room = stage.querySelector<HTMLElement>(".gtm-stage-body")!;
  const steps = stage.querySelector<HTMLElement>(".steps")!;
  const box = (top: number, height: number) => ({ top, height, bottom: top + height, left: 0, right: 0, width: 0, x: 0, y: top, toJSON: () => ({}) }) as DOMRect;
  vi.spyOn(room, "getBoundingClientRect").mockImplementation(() => box(HEADER, STAGE - 60));
  vi.spyOn(steps, "getBoundingClientRect").mockImplementation(() => box(HEADER + 40, content));
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
  content = 400;
  Object.defineProperty(window, "scrollY", { configurable: true, value: 0 });
});

function stubLayout() {
  // A chapter the hook has marked to flow is unpinned, as the stylesheet does.
  vi.spyOn(window, "getComputedStyle").mockImplementation((element) => ({
    position: (element as Element).closest?.("section")?.hasAttribute("data-gtm-flow") ? "static" : position,
    top: `${HEADER}px`,
  }) as CSSStyleDeclaration);
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

  it("reads position again when a control's hold lapses, even if the reader has stopped scrolling", async () => {
    stubLayout();
    vi.stubGlobal("scrollTo", vi.fn());
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }));
    const { api } = mount();
    await scrollHeld(0);
    await act(async () => api().goTo(3));
    // The reader scrolls back before the page arrives, then stops.
    await scrollHeld(10);
    expect(api().step).toBe(3);
    await act(async () => { await new Promise((done) => setTimeout(done, 120)); });
    expect(api().step).toBe(0);
  });

  it("ends a control's hold as soon as the page arrives, so the next scroll counts at once", async () => {
    stubLayout();
    const scrollTo = vi.fn();
    vi.stubGlobal("scrollTo", scrollTo);
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: false, media: query, addEventListener: () => undefined, removeEventListener: () => undefined }));
    const { api } = mount({ lockMs: 5000 });
    await scrollHeld(0);
    await act(async () => api().goTo(2));
    const { top } = scrollTo.mock.calls[0][0] as ScrollToOptions;
    Object.defineProperty(window, "scrollY", { configurable: true, value: top });
    await scrollHeld(top!);
    expect(api().step).toBe(2);
    Object.defineProperty(window, "scrollY", { configurable: true, value: 450 });
    await scrollHeld(450);
    expect(api().step).toBe(1);
  });

  it("lets a step that outgrows its stage flow as a document instead of clipping (WCAG 1.4.12)", async () => {
    stubLayout();
    const { api, section } = mount();
    await scrollHeld(450);
    expect(api().pinned).toBe(true);
    expect(section.hasAttribute("data-gtm-flow")).toBe(false);
    // The reader widens their text spacing: the step no longer fits.
    content = STAGE;
    await scrollHeld(460);
    expect(section.getAttribute("data-gtm-flow")).toBe("true");
    expect(api().pinned).toBe(false);
    // It does not flip back under the reader when the content shrinks again.
    content = 400;
    await scrollHeld(470);
    expect(section.getAttribute("data-gtm-flow")).toBe("true");
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
