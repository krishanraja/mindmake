import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";

/**
 * The Decision Balance belongs to one route.
 *
 * It was mounted on seven surfaces: the leadership essay, both offer routes and
 * the four editorial pages. Ruling (Krish, 2026-09-24): it exists on
 * /new-age-leadership and absolutely nowhere else. So this file checks the one
 * route that keeps it, and holds a negative control over the six that lost it,
 * because a re-mount is a one-line import and would otherwise pass unseen.
 */

const HOME_ROUTE = "/new-age-leadership";

const REMOVED_ROUTES = [
  "/",
  "/blog",
  "/blog/a-useful-first-30-days-building-with-ai",
  "/answers/ai-decision-tool-trustworthy-leadership-team",
  "/ai-brain",
  "/ai-gtm",
] as const;

describe("the approved commercial Decision Balance surface", () => {
  it("is server-rendered once on /new-age-leadership with its approved context", () => {
    const html = serverRender(HOME_ROUTE);
    expect(html.match(/class="mm-decision-balance"/g)).toHaveLength(1);
    expect(html).not.toContain('class="mm-proofglass"');
    expect(html).toContain('data-context="leadership"');
    expect(html).toContain("Build one useful AI system on real work.");
    expect(html).toContain("One real decision.");
    expect(html).toContain("<strong>Evidence</strong>");
    expect(html).toContain("<strong>First version</strong>");
    expect(html).toContain("<strong>Real work</strong>");
    expect(html).toContain("<strong>Yours</strong>");
    expect(html).toContain("Evidence and options prepared around it.");
    expect(html).toContain("You keep the system, its proof and standards.");
  });

  it.each(REMOVED_ROUTES)("is absent from %s", (route) => {
    const html = serverRender(route);
    expect(html.match(/class="mm-decision-balance"/g), route).toBeNull();
    expect(html, route).not.toContain("mm-decision-balance");
    expect(html, route).not.toContain("Build one useful AI system on real work.");
    expect(html, route).not.toContain("Get a first decision record before email");
  });

  it("keeps both policy-switched films poster-backed and does not emit a moving source", () => {
    const html = serverRender(HOME_ROUTE);
    const videos = html.match(/<video[^>]*class="mm-decision-balance-film"[^>]*><\/video>/g) || [];
    expect(videos).toHaveLength(2);
    expect(videos.every((video) => video.includes("poster="))).toBe(true);
    expect(videos.some((video) => /\ssrc=/.test(video))).toBe(false);
  });

  it("keeps both offer routes and the sole filled commercial action available in the markup", () => {
    const html = serverRender(HOME_ROUTE);
    expect(html).toContain('href="/ai-brain"');
    expect(html).toContain('href="/ai-gtm"');
    expect(html.match(/class="mm-decision-balance-start"/g)).toHaveLength(1);
    expect(html.match(/data-mm-primary="true"/g)).toHaveLength(1);
    expect(html).toContain("Get a first decision record before email");
    expect(html).toContain("Nothing has been sent.");
  });
});
