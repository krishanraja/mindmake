import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { ReactNode } from "react";
import { afterEach, describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { takeEarlyStart } from "@/lib/earlyStart";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";

/**
 * The way in answers a tap made before the page started (Krish, 2026-11-11:
 * "Start building your AI business button no longer works"; on production the
 * button painted at 0.75s and answered at 5.1s on a slow phone). The catcher is
 * the inline script in index.html, run here as the browser runs it.
 */
const html = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
const catcher = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map((m) => m[1]).find((code) => code.includes("__mmEarly"));

function arm(path: string) {
  window.history.replaceState({}, "", path);
  new Function(catcher!)();
}

function tap(el: Element, init: MouseEventInit = {}) {
  const event = new MouseEvent("click", { bubbles: true, cancelable: true, button: 0, ...init });
  el.dispatchEvent(event);
  return event;
}

afterEach(() => {
  takeEarlyStart();
  delete window.__mmEarly;
  document.body.innerHTML = "";
  window.history.replaceState({}, "", "/");
});

describe("the early tap catcher", () => {
  it("is in the page template", () => {
    expect(catcher).toBeTruthy();
  });

  it("keeps a tap on /ai-gtm's way in, marks it pressed and hands the door to the page once", () => {
    arm("/ai-gtm");
    document.body.innerHTML = `<div class="mm-pairing"><button class="mm-button" data-early-start="gtm">Start building your AI business <span>→</span></button></div>`;
    const button = document.querySelector("button")!;
    const event = tap(button.querySelector("span")!);
    expect(event.defaultPrevented).toBe(true);
    expect(button.hasAttribute("data-early-pressed")).toBe(true);
    expect(button.getAttribute("aria-busy")).toBe("true");
    expect(takeEarlyStart()).toBe("gtm");
    expect(button.hasAttribute("data-early-pressed")).toBe(false);
    expect(button.hasAttribute("aria-busy")).toBe(false);
    // Taken away: a later tap reaches the page's own handler untouched.
    expect(tap(button).defaultPrevented).toBe(false);
    expect(takeEarlyStart()).toBeNull();
  });

  it("reads the door from the control, or else from the page", () => {
    arm("/");
    document.body.innerHTML = `<button class="hs-start-button" data-start-route="brain">Start</button>`;
    tap(document.querySelector("button")!);
    expect(takeEarlyStart()).toBe("brain");

    delete window.__mmEarly;
    arm("/ai-gtm/");
    document.body.innerHTML = `<div class="mm-action-bar"><button class="mm-button">Start</button></div><a class="finder-start" href="/?start=brain" data-finder-start="brain">Start</a>`;
    tap(document.querySelector(".mm-action-bar button")!);
    tap(document.querySelector("a")!);
    expect(takeEarlyStart()).toBe("brain");

    delete window.__mmEarly;
    arm("/about");
    document.body.innerHTML = `<button class="mm-menu-start">Start</button>`;
    tap(document.querySelector("button")!);
    expect(takeEarlyStart()).toBe("home");
  });

  it("leaves every other click, modified clicks and other pages alone", () => {
    arm("/ai-brain");
    document.body.innerHTML = `<a href="/ai-gtm">Build your AI business</a><a class="finder-start" href="/?start=brain" data-finder-start="brain">Start</a>`;
    expect(tap(document.querySelector("a")!).defaultPrevented).toBe(false);
    expect(tap(document.querySelector(".finder-start")!, { metaKey: true }).defaultPrevented).toBe(false);
    expect(takeEarlyStart()).toBeNull();

    delete window.__mmEarly;
    arm("/blog");
    expect(window.__mmEarly).toBeUndefined();
  });
});

describe("the page reading it", () => {
  const at = (path: string) => ({ children }: { children: ReactNode }) => <MemoryRouter initialEntries={[path]}>{children}</MemoryRouter>;

  it("opens the brief at the door tapped before the page started", async () => {
    arm("/ai-gtm");
    document.body.innerHTML = `<button data-early-start="gtm">Start</button>`;
    tap(document.querySelector("button")!);
    const { result } = renderHook(() => useLeadBriefHistory(), { wrapper: at("/ai-gtm") });
    await waitFor(() => expect(result.current.briefOpen).toBe(true));
    expect(result.current.briefRoute).toBe("gtm");
    expect(window.__mmEarly?.done).toBe(true);
  });

  it("opens nothing when nothing was tapped", async () => {
    arm("/ai-gtm");
    const { result } = renderHook(() => useLeadBriefHistory(), { wrapper: at("/ai-gtm") });
    await waitFor(() => expect(window.__mmEarly?.done).toBe(true));
    expect(result.current.briefOpen).toBe(false);
  });
});
