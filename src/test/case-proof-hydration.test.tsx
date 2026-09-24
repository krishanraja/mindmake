import { act } from "react";
import { renderToString } from "react-dom/server";
import { hydrateRoot } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CaseProofField } from "@/components/mindmake/locked/CaseProofField";
import { clientStories } from "@/data/rebuildProof";

// Vitest strips CSS imports, including this raw CSS module. Feed the real
// repository stylesheet to the component rather than testing an empty stub.
vi.mock("../../prototypes/website-redesign-recovery/case-study-browsing/styles.css?raw", async () => {
  const { readFileSync } = await import("node:fs");
  const { resolve } = await import("node:path");
  return { default: readFileSync(resolve(process.cwd(), "prototypes/website-redesign-recovery/case-study-browsing/styles.css"), "utf8") };
});

describe("case proof field parsed-server hydration", () => {
  afterEach(() => { vi.restoreAllMocks(); vi.unstubAllGlobals(); });

  it("retains raw CSS syntax and hydrates the original server heading", async () => {
    vi.stubGlobal("IS_REACT_ACT_ENVIRONMENT", true);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => {});
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue();
    const previousUrl = window.location.href;
    window.history.replaceState({}, "", "/case-studies/");
    // One real story keeps this raw-text boundary test bounded; the full
    // built-route browser matrix exercises all eight stories independently.
    const component = <CaseProofField stories={clientStories.slice(0, 1)} />;
    const container = document.createElement("div");
    container.innerHTML = renderToString(component);
    document.body.append(container);
    const serverHeading = container.querySelector("h1");
    const serverCss = container.querySelector("style")!.textContent!;
    // A string-vs-string SSR comparison misses this: style contents use the
    // HTML RAWTEXT parser and therefore retain, rather than decode, entities.
    expect(serverCss).not.toMatch(/&(?:quot|gt|lt|amp);/);
    // Positive control, so the entity assertion above cannot pass on an empty
    // string. It deliberately asserts on the scoping this component adds rather
    // than on the prototype stylesheet's own text: `?raw` resolves to "" under
    // vitest, which would make any assertion about the sheet's contents a
    // statement about the test environment instead of the product. That the
    // sheet itself ships is proved where it can be: the built-route browser
    // matrix and scripts/qa/case-proof-field-production-check.mjs.
    expect(serverCss).toContain(".mm-case-proof-s2 .site-head-space");
    expect(serverCss).toContain(".mm-case-proof-s2 .proof-shell");
    const recovered: unknown[] = [];
    let root: ReturnType<typeof hydrateRoot> | undefined;
    try {
      await act(async () => {
        root = hydrateRoot(container, component, { onRecoverableError: error => recovered.push(error) });
      });
      expect(recovered).toEqual([]);
      expect(container.querySelector("h1")).toBe(serverHeading);
      expect(container.querySelector("style")!.textContent).toBe(serverCss);
    } finally {
      await act(async () => root?.unmount());
      container.remove();
      window.history.replaceState({}, "", previousUrl);
    }
  }, 30000);
});
