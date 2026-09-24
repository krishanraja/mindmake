import { afterEach, describe, expect, it, vi } from "vitest";
import { mountPinnedChapters } from "@/components/homepage-release/pinnedChapters";

describe("homepage pin lifecycle", () => {
  const originalResizeObserver = window.ResizeObserver;
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); window.ResizeObserver = originalResizeObserver; document.body.innerHTML = ""; });

  function fixture() {
    let reduced = false;
    let sectionHeight = 900;
    const motion = new EventTarget();
    Object.defineProperty(motion, "matches", { get: () => reduced });
    vi.stubGlobal("matchMedia", () => motion);
    vi.stubGlobal("innerHeight", 900);
    const frames = new Map<number, FrameRequestCallback>();
    let nextFrame = 0;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frames.set(++nextFrame, callback); return nextFrame;
    });
    const cancel = vi.fn((id: number) => frames.delete(id));
    vi.stubGlobal("cancelAnimationFrame", cancel);
    let resize: () => void = () => {};
    const disconnect = vi.fn();
    window.ResizeObserver = class {
      constructor(callback: ResizeObserverCallback) { resize = () => callback([], this); }
      observe() {}
      unobserve() {}
      disconnect = disconnect;
    };
    const flush = () => { const pending = [...frames.values()]; frames.clear(); pending.forEach(callback => callback(0)); };
    const root = document.createElement("div");
    root.innerHTML = '<section data-component="history"></section><section data-component="leadership-dividend"></section>';
    document.body.append(root);
    const sections = [...root.querySelectorAll<HTMLElement>("section")];
    sections.forEach(section => vi.spyOn(section, "getBoundingClientRect").mockImplementation(() => ({ height: sectionHeight, top: 0 } as DOMRect)));
    const callbacks = { selectStory: vi.fn(), selectPractice: vi.fn(), selectDividend: vi.fn() };
    const destroy = mountPinnedChapters(root, callbacks);
    flush();
    const setReduced = (value: boolean) => { reduced = value; motion.dispatchEvent(new Event("change")); flush(); };
    const setHeight = (height: number) => { sectionHeight = height; resize(); flush(); };
    return { root, sections, callbacks, destroy, flush, setReduced, setHeight, frames, cancel, disconnect };
  }

  for (const fallback of ["reduced-motion", "short-height"] as const) {
    for (const chapter of ["history", "dividend"] as const) {
      it(`resynchronises ${chapter} after ${fallback}, manual selection and re-enable`, () => {
        const f = fixture();
        const section = f.sections[chapter === "history" ? 0 : 1];
        expect(section.dataset.scrollStage).toBe("0");
        if (fallback === "reduced-motion") f.setReduced(true); else f.setHeight(1100);
        expect(section.dataset.scrollStage).toBeUndefined();
        expect(section.parentElement!.dataset.pinMode).toBe("natural");
        // The real runtime applies the manual choice before notifying the pin controller.
        if (chapter === "history") f.callbacks.selectStory(3); else f.callbacks.selectDividend("return");
        f.root.dispatchEvent(new CustomEvent("homepage:choice", { detail: { section: chapter, index: 3, mode: chapter === "dividend" ? "return" : undefined } }));
        if (chapter === "history") expect(f.callbacks.selectStory).toHaveBeenLastCalledWith(3);
        else expect(f.callbacks.selectDividend).toHaveBeenLastCalledWith("return");
        if (fallback === "reduced-motion") f.setReduced(false); else f.setHeight(900);
        expect(section.parentElement!.dataset.pinMode).toBe("scroll");
        expect(section.dataset.scrollStage).toBe("0");
        if (chapter === "history") expect(f.callbacks.selectStory).toHaveBeenLastCalledWith(0);
        else {
          expect(f.callbacks.selectDividend).toHaveBeenLastCalledWith("practice");
          expect(f.callbacks.selectPractice).toHaveBeenLastCalledWith(0);
        }
        f.destroy();
      });
    }
  }

  it("cancels pending work, removes observers/listeners and restores the original sections", () => {
    const f = fixture();
    f.callbacks.selectStory.mockClear();
    dispatchEvent(new Event("scroll"));
    expect(f.frames.size).toBe(1);
    f.destroy();
    expect(f.disconnect).toHaveBeenCalledOnce();
    expect(f.cancel).toHaveBeenCalled();
    expect(f.frames.size).toBe(0);
    expect([...f.root.children]).toEqual(f.sections);
    expect(f.sections.every(section => !section.hasAttribute("data-scroll-stage"))).toBe(true);
    dispatchEvent(new Event("scroll"));
    f.setReduced(true);
    f.root.dispatchEvent(new CustomEvent("homepage:choice", { detail: { section: "history", index: 1 } }));
    f.flush();
    expect(f.callbacks.selectStory).not.toHaveBeenCalled();
    expect(f.frames.size).toBe(0);
  });
});
