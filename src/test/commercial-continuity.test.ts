import { describe, expect, it } from "vitest";
import { render as serverRender } from "@/entry-server";

const ROUTES = [
  ["/new-age-leadership", "leadership"],
  ["/blog", "editorial"],
  ["/blog/a-useful-first-30-days-building-with-ai", "editorial"],
  ["/answers", "editorial"],
  ["/answers/ai-decision-tool-trustworthy-leadership-team", "editorial"],
  ["/ai-brain", "brain"],
  ["/ai-gtm", "gtm"],
] as const;

describe("the approved commercial Decision Balance surface", () => {
  it.each(ROUTES)("is server-rendered once on %s with its approved context", (route, context) => {
    const html = serverRender(route);
    expect(html.match(/class="mm-decision-balance"/g), route).toHaveLength(1);
    expect(html, route).not.toContain('class="mm-proofglass"');
    expect(html, route).toContain(`data-context="${context}"`);
    expect(html, route).toContain("Build one useful AI system on real work.");
    expect(html, route).toContain("One real decision.");
    expect(html, route).toContain("<strong>Evidence</strong>");
    expect(html, route).toContain("<strong>First version</strong>");
    expect(html, route).toContain("<strong>Real work</strong>");
    expect(html, route).toContain("<strong>Yours</strong>");
    expect(html, route).toContain("Evidence and options prepared around it.");
    expect(html, route).toContain("You keep the system, its proof and standards.");
  });

  it("keeps both policy-switched films poster-backed and does not emit a moving source", () => {
    const html = serverRender("/new-age-leadership");
    const videos = html.match(/<video[^>]*class="mm-decision-balance-film"[^>]*><\/video>/g) || [];
    expect(videos).toHaveLength(2);
    expect(videos.every((video) => video.includes("poster="))).toBe(true);
    expect(videos.some((video) => /\ssrc=/.test(video))).toBe(false);
  });

  it("keeps both offer routes and the sole filled commercial action available in the markup", () => {
    const html = serverRender("/blog");
    expect(html).toContain('href="/ai-brain"');
    expect(html).toContain('href="/ai-gtm"');
    expect(html.match(/class="mm-decision-balance-start"/g)).toHaveLength(1);
    expect(html.match(/data-mm-primary="true"/g)).toHaveLength(1);
    expect(html).toContain("Get a first decision record before email");
    expect(html).toContain("Nothing has been sent.");
  });
});
