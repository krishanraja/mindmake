import { afterEach, describe, expect, it, vi } from "vitest";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { leadershipChaptersMarkup, mountLeadershipChapters, practiceRest, practiceSweep } from "@/components/leadership-chapters/leadershipChapters";

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

  /* The phone's practice sequence (r45): a mint line sweeps each scene in as
     the reader scrolls, and the rail's fill travels with it. */
  describe("the practice sweep on a phone", () => {
    const samples = Array.from({ length: 401 }, (_, i) => i / 400);

    it("starts on the first scene and ends on the last, with the rail empty then full", () => {
      expect(practiceSweep(0)).toMatchObject({ active: 0, sweeps: [0, 0], fill: 0, line: 0, copy: [1, 0, 0] });
      expect(practiceSweep(1)).toMatchObject({ active: 2, sweeps: [1, 1], fill: 1, line: 0, copy: [0, 0, 1] });
    });

    it("only ever moves forward as the reader scrolls on, so scrolling back retraces it exactly", () => {
      for (let i = 1; i < samples.length; i += 1) {
        const before = practiceSweep(samples[i - 1]);
        const after = practiceSweep(samples[i]);
        expect(after.sweeps[0]).toBeGreaterThanOrEqual(before.sweeps[0]);
        expect(after.sweeps[1]).toBeGreaterThanOrEqual(before.sweeps[1]);
        expect(after.fill).toBeGreaterThanOrEqual(before.fill);
        expect(after.active).toBeGreaterThanOrEqual(before.active);
      }
    });

    it("reaches each stop on the rail exactly as its sweep completes", () => {
      for (const progress of samples) {
        const state = practiceSweep(progress);
        expect(state.fill).toBeCloseTo((state.sweeps[0] + state.sweeps[1]) / 2, 10);
        expect(state.reached[1]).toBe(state.sweeps[0] >= 1);
        expect(state.reached[2]).toBe(state.sweeps[1] >= 1);
      }
    });

    it("never shows two scenes' words at once, and shows the line only mid-sweep", () => {
      for (const progress of samples) {
        const state = practiceSweep(progress);
        expect(state.copy.filter((value) => value > 0).length).toBeLessThanOrEqual(1);
        const sweeping = state.sweeps.some((value) => value > 0 && value < 1);
        if (!sweeping) expect(state.line).toBe(0);
      }
    });

    it("holds every scene still where its rail stop sends the reader", () => {
      practiceRest.forEach((rest, scene) => {
        const state = practiceSweep(rest);
        expect(state.active).toBe(scene);
        expect(state.line).toBe(0);
        expect(state.copy[scene]).toBe(1);
      });
    });

    it("with reduced motion, changes scene at the same points, all at once, with no line", () => {
      for (const progress of samples) {
        const state = practiceSweep(progress, true);
        expect(state.line).toBe(0);
        state.sweeps.forEach((value) => expect([0, 1]).toContain(value));
        expect(state.active).toBe(practiceSweep(progress).active);
      }
    });

    it("keeps every stacked scene available to a screen reader where the frame cannot pin", () => {
      vi.stubGlobal("scrollTo", vi.fn());
      vi.stubGlobal("innerWidth", 844);
      vi.stubGlobal("innerHeight", 390);
      const root = document.createElement("div");
      root.innerHTML = leadershipChaptersMarkup();
      document.body.append(root);
      const unmount = mountLeadershipChapters(root, { reduced: true });
      const hidden = [...root.querySelectorAll("[data-work-scene]")].map((scene) => scene.getAttribute("aria-hidden"));
      expect(hidden).toEqual(["false", "false", "false"]);
      unmount();
    });
  });
});
