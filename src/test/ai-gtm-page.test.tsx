// Ruling (Krish, 2026-11-25): /ai-gtm refocused on content production, distribution and monetisation
import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";

describe("AI business", () => {
  const main = new DOMParser().parseFromString(serverRender("/ai-gtm"), "text/html").querySelector("main")!;
  it("keeps one hero and three sections", () => {
    expect(main.querySelectorAll("h1")).toHaveLength(1);
    expect(main.querySelector("h1")?.textContent).toBe("Make more of your best work, get it in front of the right people, and get paid properly for it.");
    expect([...main.querySelectorAll(":scope > section")].map(el => el.id)).toEqual(["you", "inside", "built"]);
    expect(main.querySelector("[data-mm-hero]")?.textContent).toBe("Start building your AI business");
  });
  it("gives each lever a surface line and native disclosure", () => {
    const tiles = [...main.querySelectorAll(".product-levers details")];
    expect(tiles.map(tile => tile.querySelector("strong")?.textContent)).toEqual(["Production","Distribution","Monetisation"]);
    for (const tile of tiles) {
      expect(tile.querySelector("summary span")?.textContent).toBeTruthy();
      expect(tile.querySelector("p")?.textContent).toBeTruthy();
      expect(tile.hasAttribute("open")).toBe(false);
    }
    const first = tiles[0] as HTMLDetailsElement;
    first.querySelector("summary")!.click();
    expect(first.open).toBe(true);
    first.querySelector("summary")!.click();
    expect(first.open).toBe(false);
    expect(main.querySelector(".team-board, .gtm-view-switch")).toBeNull();
  });
  it("connects four weeks of work to commercial proof and the reader's own receipt", () => {
    expect(main.querySelectorAll(".sprint-weeks li")).toHaveLength(4);
    expect(main.querySelector(".product-receipt")?.textContent).toContain("terms you agreed");
    expect(main.querySelectorAll("[data-finder-tab]")).toHaveLength(6);
    expect(main.querySelector(".finder-panel.is-active [data-finder-card]")?.getAttribute("data-finder-card")).toBe("C-16");
    expect(main.querySelector(".finder-panel.is-active .story-example-label")?.textContent).toBe("EXAMPLE");
  });
});
