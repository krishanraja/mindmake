import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";
import { START_LABEL } from "@/lib/publicLinks";

/**
 * The action bar's door, and the trailing slash that broke it.
 *
 * The bar carries at most one door: the offer route the reader is not already
 * on. The first version keyed that on `location.pathname` exactly, so
 * "/ai-brain" found a door and "/ai-brain/" did not. Both spellings reach the
 * same page — Vercel resolves either, and the local preview serves the
 * prerendered file from the second — so the document was rendered with a door
 * and hydrated without one. React error #418, the whole route dropped to client
 * rendering, and the server heading went with it. Every engine caught it.
 *
 * These assertions are the shape of that bug: the same door on both spellings,
 * no door where neither offer route is the page, and never both doors at once.
 */

const doorsIn = (html: string) =>
  [...html.matchAll(/class="mm-action-bar-door"[^>]*href="([^"]+)"/g)].map((match) => match[1]);

const hrefFirst = (html: string) =>
  [...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*class="mm-action-bar-door"/g)].map((match) => match[1]);

const doors = (html: string) => {
  const found = [...doorsIn(html), ...hrefFirst(html)];
  return [...new Set(found)];
};

describe("the action bar's door", () => {
  it.each([
    ["/ai-brain", "/ai-gtm"],
    ["/ai-gtm", "/ai-brain"],
  ])("offers the other offer route on %s", (route, expected) => {
    expect(doors(serverRender(route)), route).toEqual([expected]);
  });

  it.each([
    ["/ai-brain/", "/ai-gtm"],
    ["/ai-gtm/", "/ai-brain"],
  ])("offers the same door on %s, which is the spelling hydration arrives at", (route, expected) => {
    expect(doors(serverRender(route)), route).toEqual([expected]);
  });

  it.each(["/blog", "/answers", "/case-studies", "/faq", "/contact"])(
    "offers no door on %s, where neither offer route is the page",
    (route) => {
      expect(doors(serverRender(route)), route).toEqual([]);
    },
  );

  it("never puts both doors in the bar, which would be three controls in a bar allowed two", () => {
    for (const route of ["/ai-brain", "/ai-gtm", "/blog", "/faq"]) {
      expect(doors(serverRender(route)).length, route).toBeLessThanOrEqual(1);
    }
  });

  it("carries the one shared label on every route that renders a bar", () => {
    for (const route of ["/ai-brain", "/ai-gtm", "/blog", "/answers", "/faq", "/case-studies"]) {
      const html = serverRender(route);
      expect(html.includes('class="mm-action-bar'), route).toBe(true);
      expect(html.includes(START_LABEL), route).toBe(true);
    }
  });
});
