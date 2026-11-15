import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UseCaseFinder } from "@/components/mindmake/UseCaseFinder";
import { ClientWords } from "@/components/mindmake/ClientWords";

/* /case-studies since 15 November 2026: the use-case finder and the client
   quotes replace the results field. Both must hydrate over their server HTML
   with nothing for React to recover, so the page a reader first sees is the
   page that stays. */
describe("use-case finder and client quotes hydration", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("hydrates the server markup without recoverable errors", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    const previousUrl = window.location.href;
    window.history.replaceState({}, "", "/case-studies/");
    const component = <><UseCaseFinder onStart={() => undefined} /><ClientWords /></>;
    const container = document.createElement("div");
    container.innerHTML = renderToString(component);
    document.body.append(container);
    const serverHeading = container.querySelector("h1");
    expect(serverHeading?.textContent).toBe("What you can do with it.");
    const recovered: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, component, { onRecoverableError: (error) => recovered.push(error) });
      });
      expect(recovered).toEqual([]);
      expect(container.querySelector("h1")).toBe(serverHeading);
    } finally {
      await act(async () => root?.unmount());
      container.remove();
      window.history.replaceState({}, "", previousUrl);
    }
  }, 30000);
});
