import { afterEach, describe, expect, it, vi } from "vitest";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { leadershipChaptersMarkup, mountLeadershipChapters } from "@/components/leadership-chapters/leadershipChapters";

describe("homepage leadership chapters", () => {
  afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

  it("carries the three new-age leadership chapters between the opening and the route", () => {
    const opening = homepageMarkup.indexOf('id="opening"');
    const chapters = homepageMarkup.indexOf('id="new-age-leadership"');
    const route = homepageMarkup.indexOf('id="route"');
    expect(opening).toBeGreaterThan(-1);
    expect(chapters).toBeGreaterThan(opening);
    expect(route).toBeGreaterThan(chapters);
    const rendered = leadershipChaptersMarkup();
    for (const words of ["The organisation<br /><em>changes shape.</em>", "The system does not replace your judgement.", "What your AI Brain makes possible", "What will you do with the hours it gives back?"]) {
      expect(rendered).toContain(words);
    }
  });

  it("no longer carries the retired R3 authority and dividend chapters", () => {
    for (const retired of ['data-component="authority"', 'data-component="leadership-dividend"', "r3-mode-switch", "data-stage=", "data-practice="]) {
      expect(homepageMarkup).not.toContain(retired);
    }
  });

  it("carries the R3 history chapter before the leadership chapters, and the reach chapter's two states (r41)", () => {
    const history = homepageMarkup.indexOf('data-component="history"');
    expect(history).toBeGreaterThan(homepageMarkup.indexOf('id="opening"'));
    expect(history).toBeLessThan(homepageMarkup.indexOf('id="new-age-leadership"'));
    expect(homepageMarkup).toContain("You are not the first person to wonder what a new tool might take from you.");
    expect(homepageMarkup.match(/data-era="[0-3]"/g)?.length).toBeGreaterThanOrEqual(4);
    expect(homepageMarkup).toContain('href="#history"');
    const chapters = leadershipChaptersMarkup();
    expect(chapters).toContain("The feeling is familiar.");
    expect(chapters).toContain('data-reach-jump="organisation"');
  });

  it("hides every decorative chapter film from assistive technology", () => {
    const videos = leadershipChaptersMarkup().split("<video").slice(1).map((video) => video.slice(0, video.indexOf(">")));
    expect(videos).toHaveLength(4);
    videos.forEach((video) => expect(video).toContain('aria-hidden="true"'));
  });

  it("moves between benefits from its controls and stops listening once unmounted", () => {
    vi.stubGlobal("scrollTo", vi.fn());
    const root = document.createElement("div");
    root.innerHTML = leadershipChaptersMarkup();
    document.body.append(root);
    const unmount = mountLeadershipChapters(root, { reduced: true, media: true });
    const count = root.querySelector("[data-benefit-count]")!;
    expect(count.textContent).toBe("01");
    root.querySelector<HTMLButtonElement>("[data-benefit-next]")!.click();
    expect(count.textContent).toBe("02");
    expect(root.querySelectorAll(".brain-benefit.is-active")).toHaveLength(1);
    expect(root.querySelector('[data-benefit="1"]')!.getAttribute("aria-hidden")).toBe("false");
    unmount();
    root.querySelector<HTMLButtonElement>("[data-benefit-next]")!.click();
    expect(count.textContent).toBe("02");
  });
});
