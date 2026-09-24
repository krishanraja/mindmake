import { afterEach, describe, expect, it, vi } from "vitest";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { mountHomepageRuntime } from "@/components/homepage-release/runtime";

describe("homepage navigation focus readiness", () => {
  let destroy: (() => void) | undefined;
  afterEach(() => { destroy?.(); destroy = undefined; vi.useRealTimers(); vi.restoreAllMocks(); document.body.innerHTML = ""; });

  function fixture() {
    vi.useFakeTimers();
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const root = document.createElement("div");
    root.innerHTML = homepageMarkup;
    document.body.append(root);
    const opener = root.querySelector<HTMLButtonElement>('.r3-opening .preview-desktop .menu-control')!;
    const close = root.querySelector<HTMLButtonElement>('.r3-navigation .preview-desktop .menu-control')!;
    const link = root.querySelector<HTMLAnchorElement>('.r3-navigation .preview-desktop a')!;
    let visible = false;
    const originalStyle = window.getComputedStyle;
    vi.spyOn(window, "getComputedStyle").mockImplementation((element, pseudo) => {
      const result = originalStyle(element, pseudo);
      if (element === close) Object.defineProperty(result, "visibility", { value: visible ? "visible" : "hidden" });
      return result;
    });
    vi.spyOn(close, "getClientRects").mockImplementation(() => ({ length: visible ? 1 : 0 } as DOMRectList));
    const focus = vi.spyOn(close, "focus");
    destroy = mountHomepageRuntime(root, { onStart: vi.fn() }).destroy;
    opener.focus();
    opener.click();
    return { root, opener, close, link, focus, show: () => { visible = true; } };
  }

  it("waits for actual visibility beyond the former 60ms deadline, then focuses once", () => {
    const f = fixture();
    vi.advanceTimersByTime(500);
    expect(f.focus).not.toHaveBeenCalled();
    f.show();
    vi.advanceTimersByTime(32);
    expect(document.activeElement).toBe(f.close);
    expect(f.focus).toHaveBeenCalledOnce();
    vi.advanceTimersByTime(500);
    expect(f.focus).toHaveBeenCalledOnce();
  });

  it("cancels pending opening focus when closed before becoming visible", () => {
    const f = fixture();
    vi.advanceTimersByTime(100);
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    f.show();
    vi.advanceTimersByTime(500);
    expect(f.focus).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(f.opener);
  });

  it("does not steal focus after the user has already focused a navigation link", () => {
    const f = fixture();
    f.link.focus();
    f.show();
    vi.advanceTimersByTime(500);
    expect(f.focus).not.toHaveBeenCalled();
    expect(document.activeElement).toBe(f.link);
  });

  it("cancels pending focus on unmount", () => {
    const f = fixture();
    destroy!(); destroy = undefined;
    f.show();
    vi.advanceTimersByTime(500);
    expect(f.focus).not.toHaveBeenCalled();
  });

  it("ignores stale close callbacks when the menu is immediately reopened", () => {
    const f = fixture();
    window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    f.opener.click();
    f.show();
    vi.advanceTimersByTime(500);
    expect(document.activeElement).toBe(f.close);
    expect(f.focus).toHaveBeenCalledOnce();
  });

  it("does not attempt focus after a dialog makes the homepage inert", () => {
    const f = fixture();
    f.root.setAttribute("inert", "");
    f.show();
    vi.advanceTimersByTime(500);
    expect(f.focus).not.toHaveBeenCalled();
  });

  it("stops retrying when its root is disconnected before teardown", () => {
    const f = fixture();
    f.root.remove();
    vi.advanceTimersByTime(500);
    expect(vi.getTimerCount()).toBe(0);
    expect(f.focus).not.toHaveBeenCalled();
  });
});
