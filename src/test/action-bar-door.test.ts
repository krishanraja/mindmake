import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";
import { START_LABEL, START_LABEL_GTM } from "@/lib/publicLinks";

/**
 * The action bar is one button and nothing else.
 *
 * Ruling (2026-10-24): "they should just have one call to action". The bar used
 * to carry a door to the other offer route beside the button, and with the
 * analytics notice that made four controls at the foot of /ai-brain. The other
 * route is now one quiet line at the foot of each offer page.
 *
 * The door's history still matters: it was keyed on the pathname, so
 * "/ai-brain" found a door and "/ai-brain/" did not, and the document hydrated
 * into React error #418. The label is now a prop each page passes, so both
 * spellings of a route must render the same bar.
 */

const bar = (html: string) => html.match(/<div class="mm-action-bar[^"]*"[^>]*>[\s\S]*?<\/button><\/div><\/div>/)?.[0] ?? "";

describe("the action bar", () => {
  it.each(["/ai-brain", "/ai-gtm", "/ai-brain/", "/ai-gtm/", "/blog", "/case-studies", "/faq", "/contact"])(
    "offers no door on %s, only the one button",
    (route) => {
      const html = serverRender(route);
      expect(html.includes("mm-action-bar-door"), route).toBe(false);
      expect((bar(html).match(/<(?:a|button)\b/g) ?? []).length, route).toBe(1);
    },
  );

  it("names what the reader is building, and the revenue engine on its own page", () => {
    for (const route of ["/ai-brain", "/blog", "/faq", "/case-studies"]) {
      expect(bar(serverRender(route)).includes(START_LABEL), route).toBe(true);
    }
    for (const route of ["/ai-gtm", "/ai-gtm/"]) {
      expect(bar(serverRender(route)).includes(START_LABEL_GTM), route).toBe(true);
    }
  });

  it("renders the same bar on both spellings of an offer route", () => {
    expect(bar(serverRender("/ai-brain/"))).toBe(bar(serverRender("/ai-brain")));
    expect(bar(serverRender("/ai-gtm/"))).toBe(bar(serverRender("/ai-gtm")));
  });
});
