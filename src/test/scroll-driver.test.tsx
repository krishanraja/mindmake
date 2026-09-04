import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen } from "@testing-library/react";
import { useScrollDriver } from "@/hooks/useScrollDriver";

/**
 * The first write, held.
 *
 * Hydration lands after first paint, so the driver's first value lands on a
 * page the reader is already looking at. Measured cold on a phone, the hero's
 * three parallax elements moved in one frame when it did: the plate 7px down,
 * the headline 6px up, the claim 10px up, because the CSS default is zero
 * translate and the first measured value is not. These hold the two things
 * that stop it: `--mm-p0` is the first value and never moves again, so a
 * transform computed from the difference starts at zero; and the element is
 * marked as settling for the first moments, so a build can let that first
 * value travel rather than snap.
 */

let top = 600;
const originalRect = Element.prototype.getBoundingClientRect;
const originalRaf = window.requestAnimationFrame;
const originalCancel = window.cancelAnimationFrame;
let queue: FrameRequestCallback[] = [];
const flush = () => {
  const pending = queue;
  queue = [];
  for (const callback of pending) callback(0);
};

function Driven({ silent = false, onProgress }: { silent?: boolean; onProgress?: (p: number) => void }) {
  const ref = useScrollDriver<HTMLDivElement>(onProgress, "centre", { silent });
  return <div ref={ref} data-testid="driven">A thing the driver moves.</div>;
}

beforeEach(() => {
  top = 600;
  queue = [];
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
  Element.prototype.getBoundingClientRect = function rect() {
    return { top, bottom: top + 40, left: 0, right: 100, width: 100, height: 40, x: 0, y: top, toJSON: () => ({}) } as DOMRect;
  };
  window.requestAnimationFrame = (callback: FrameRequestCallback) => { queue.push(callback); return queue.length; };
  window.cancelAnimationFrame = () => {};
});

afterEach(() => {
  cleanup();
  Element.prototype.getBoundingClientRect = originalRect;
  window.requestAnimationFrame = originalRaf;
  window.cancelAnimationFrame = originalCancel;
  vi.restoreAllMocks();
});

describe("the driver's first write", () => {
  it("records the first value as --mm-p0 and never moves it again", async () => {
    render(<Driven />);
    act(flush);
    const element = screen.getByTestId("driven");
    const first = element.style.getPropertyValue("--mm-p");
    expect(first).not.toBe("");
    expect(element.style.getPropertyValue("--mm-p0")).toBe(first);

    top = 200;
    act(() => { window.dispatchEvent(new Event("scroll")); flush(); });
    const second = element.style.getPropertyValue("--mm-p");
    expect(second).not.toBe(first);
    expect(element.style.getPropertyValue("--mm-p0")).toBe(first);
  });

  it("marks the element as settling for the first moments, then lets go", async () => {
    render(<Driven />);
    act(flush);
    const element = screen.getByTestId("driven");
    expect(element.hasAttribute("data-mm-settling")).toBe(true);
    await new Promise((done) => setTimeout(done, 480));
    expect(element.hasAttribute("data-mm-settling")).toBe(false);
  });

  it("writes nothing onto a silent subscriber and still tells it where it is", () => {
    const seen: number[] = [];
    render(<Driven silent onProgress={(p) => seen.push(p)} />);
    act(flush);
    const element = screen.getByTestId("driven");
    expect(seen.length).toBeGreaterThan(0);
    expect(element.style.getPropertyValue("--mm-p")).toBe("");
    expect(element.style.getPropertyValue("--mm-p0")).toBe("");
    expect(element.hasAttribute("data-mm-settling")).toBe(false);
  });
});
