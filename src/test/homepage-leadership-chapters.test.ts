import { afterEach, describe, expect, it, vi } from "vitest";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { heroStartMarkup, homepageSectionsMarkup, mastheadSubscribeMarkup, mountHomepageSections } from "@/components/homepage-release/homepageSections";
import { leadershipChaptersMarkup, mountLeadershipChapters, organisationGridMarkup, practiceRest, practiceSweep } from "@/components/leadership-chapters/leadershipChapters";
import { readFileSync } from "node:fs";

describe("the homepage in three sections", () => {
  afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

  /* Ruling (2026-10-24): "drastically simplify everything here to be probably
     three sections". The R3 opening, then the problem, how it works and what
     the reader gets, then the R3 footer. */
  it("runs the opening, the three sections and the footer, in that order", () => {
    const at = (needle: string) => homepageMarkup.indexOf(needle);
    expect(at('id="opening"')).toBeGreaterThan(-1);
    expect(at('id="hs-problem-title"')).toBeGreaterThan(at('id="opening"'));
    expect(at('id="footer"')).toBeGreaterThan(at('id="hs-get-title"'));
    const sections = homepageSectionsMarkup();
    const order = ["Right now, your AI is an intern.", "A chief of staff knows how you think.", "Built on your real work. Yours to keep."].map((title) => sections.indexOf(title));
    expect(order.every((index, i) => index > -1 && (i === 0 || index > order[i - 1]))).toBe(true);
    expect(sections.match(/<section\b/g)).toHaveLength(3);
    expect(sections).toContain('id="history"');
  });

  it("no longer carries the cut chapters: history pin, reach, practice, stories, returned hour, route or receipt", () => {
    for (const retired of ['data-component="authority"', 'data-component="leadership-dividend"', 'data-component="history"', 'id="route"', 'id="new-age-leadership"', "r3-mode-switch", "data-stage=", "data-practice=", "data-story-finder", "proof-return", "What stays with you", "Get your free AI brief"]) {
      expect(homepageMarkup + homepageSectionsMarkup(), retired).not.toContain(retired);
    }
    expect(homepageSectionsMarkup()).not.toContain("reach-sequence");
    expect(homepageSectionsMarkup()).not.toContain("work-scroll");
  });

  it("puts the way in and the publication in the opening, after the doors, on desktop and phone", () => {
    /* markup.ts interpolates the hero's way in when it loads: once on desktop, once on the phone. */
    expect(homepageMarkup.split(heroStartMarkup()).length - 1).toBe(2);
    const hero = heroStartMarkup();
    expect(hero).toContain('data-start-route="brain"');
    expect(hero).toContain("Start building your AI brain");
    expect(hero).toContain("From Make Your Mind Up");
    expect(hero).toContain('href="https://makeyourmindup.ai"');
    expect(hero).not.toMatch(/latest/i);
    expect(homepageMarkup).toContain("The leaders who shape the next decade will have an AI that thinks like them. We build yours.");
  });

  it("turns each era in place, the question giving way to what happened, and stops listening once unmounted", () => {
    const root = document.createElement("div");
    root.innerHTML = homepageSectionsMarkup();
    document.body.append(root);
    const tiles = [...root.querySelectorAll<HTMLButtonElement>("[data-hs-era]")];
    expect(tiles).toHaveLength(4);
    expect(tiles.map((tile) => tile.querySelector(".hs-era-q")?.textContent)).toEqual([
      "“If knowledge lives outside us, will memory grow weaker?”",
      "“If the machine can do the work, what happens to the worker?”",
      "“If the device does the arithmetic, will children stop learning to think?”",
      "“If the device knows the route, will we lose our sense of direction?”",
    ]);
    const unmount = mountHomepageSections(root);
    tiles[2].click();
    expect(tiles.map((tile) => tile.getAttribute("aria-pressed"))).toEqual(["false", "false", "true", "false"]);
    tiles[2].click();
    expect(tiles[2].getAttribute("aria-pressed")).toBe("false");
    unmount();
    tiles[0].click();
    expect(tiles[0].getAttribute("aria-pressed")).toBe("false");
  });

  it("shows the organisation still, and the practice scenes as pictures, with no film to play", () => {
    const sections = homepageSectionsMarkup();
    expect(sections).toContain('class="hybrid-organisation is-active"');
    expect(sections).toContain(organisationGridMarkup);
    expect(sections).not.toContain("<video");
    const root = document.createElement("div");
    root.innerHTML = sections;
    expect(root.querySelectorAll('.hs-trio img[alt=""]')).toHaveLength(3);
  });

  it("puts each era and each result on its own picture, decorative and loaded when near", () => {
    /* The owner's review on their phone, 24 October 2026: the old history
       pictures behind the eras, the stories' pictures behind the results. */
    const root = document.createElement("div");
    root.innerHTML = homepageSectionsMarkup();
    const eras = [...root.querySelectorAll<HTMLImageElement>("[data-hs-era] .hs-card-img")];
    const results = [...root.querySelectorAll<HTMLImageElement>(".hs-proof > li > .hs-card-img")];
    expect(eras).toHaveLength(4);
    expect(results).toHaveLength(3);
    for (const image of [...eras, ...results]) {
      expect(image.getAttribute("alt")).toBe("");
      expect(image.getAttribute("loading")).toBe("lazy");
      expect(image.getAttribute("src")).toBeTruthy();
    }
    expect(eras.map((image) => image.getAttribute("src")).join(" ")).toMatch(/history-writing.*history-loom.*history-calculator.*history-satnav/);
    expect(new Set(results.map((image) => image.getAttribute("src"))).size).toBe(3);
  });

  it("runs the eras and the practice scenes as carousels with a timeline of their stops, oldest first", () => {
    const root = document.createElement("div");
    root.innerHTML = homepageSectionsMarkup();
    const rails = [...root.querySelectorAll<HTMLElement>("[data-hs-rail]")];
    expect(rails).toHaveLength(2);
    expect([...rails[0].querySelectorAll("[data-hs-rail-go]")].map((stop) => stop.textContent)).toEqual(["370 BC", "1675", "1970s", "2000s"]);
    expect([...rails[1].querySelectorAll("[data-hs-rail-go]")].map((stop) => stop.textContent)).toEqual(["Notice", "Connect", "Prepare"]);
    for (const rail of rails) {
      expect(rail.querySelector('[data-hs-rail-step="-1"]')?.getAttribute("aria-label")).toMatch(/^Previous /);
      expect(rail.querySelector('[data-hs-rail-step="1"]')?.getAttribute("aria-label")).toMatch(/^Next /);
      expect(rail.querySelector('[data-hs-rail-go="0"]')?.getAttribute("aria-current")).toBe("true");
    }
  });

  it("offers the publication beside the menu in the homepage masthead, at both sizes", () => {
    expect(homepageMarkup.split(mastheadSubscribeMarkup()).length - 1).toBe(2);
    expect(mastheadSubscribeMarkup()).toContain('href="https://makeyourmindup.ai"');
    expect(mastheadSubscribeMarkup()).toContain('data-subscribe-source="masthead"');
  });
});

describe("the new-age leadership chapters, shared with /new-age-leadership", () => {
  afterEach(() => { vi.unstubAllGlobals(); document.body.innerHTML = ""; });

  it("still carry reach, practice and the stories for /new-age-leadership", () => {
    const rendered = leadershipChaptersMarkup();
    for (const words of ["What people do, and should do,<br />", "When built right,<br />", "What your AI Brain makes possible", "What will you do with the hours you save on a task?"]) {
      expect(rendered).toContain(words);
    }
  });

  it("hides every decorative chapter film from assistive technology", () => {
    const videos = leadershipChaptersMarkup().split("<video").slice(1).map((video) => video.slice(0, video.indexOf(">")));
    expect(videos).toHaveLength(4);
    videos.forEach((video) => expect(video).toContain('aria-hidden="true"'));
  });

  /* What the AI Brain makes possible (15 October 2026): the reader picks a
     situation, opens a story whole, and starts the brief at that story's door. */
  it("finds a story by situation, opens it whole, starts the brief at its door, and stops listening once unmounted", () => {
    vi.stubGlobal("scrollTo", vi.fn());
    const root = document.createElement("div");
    root.innerHTML = leadershipChaptersMarkup();
    document.body.append(root);
    const sheet = root.querySelector<HTMLDialogElement>("[data-finder-sheet]")!;
    sheet.showModal = vi.fn(function (this: HTMLDialogElement) { this.setAttribute("open", ""); });
    sheet.close = vi.fn(function (this: HTMLDialogElement) { this.removeAttribute("open"); this.dispatchEvent(new Event("close")); });
    Object.defineProperty(sheet, "open", { configurable: true, get() { return this.hasAttribute("open"); } });
    const onStart = vi.fn();
    const unmount = mountLeadershipChapters(root, { reduced: true, media: true, onStart });
    const tabs = [...root.querySelectorAll<HTMLButtonElement>("[data-finder-tab]")];
    const panels = [...root.querySelectorAll<HTMLElement>("[data-finder-panel]")];
    const selected = () => tabs.map((tab) => tab.getAttribute("aria-selected"));
    expect(selected()).toEqual(["true", "false", "false", "false", "false"]);
    /* The unchosen situations stay in place, out of reach, so the finder keeps
       its height (2026-10-24). */
    expect(panels.map((panel) => panel.hasAttribute("inert"))).toEqual([false, true, true, true, true]);
    /* Arrow keys move between situations and wrap; Home and End go to the ends. */
    tabs[0].dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(selected()[4]).toBe("true");
    expect(document.activeElement).toBe(tabs[4]);
    tabs[4].dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true }));
    expect(selected()[0]).toBe("true");
    tabs[4].click();
    expect(panels.map((panel) => panel.hasAttribute("inert"))).toEqual([true, true, true, true, false]);
    /* A card opens as a sheet holding the whole story and its result on the record. */
    const summary = panels[4].querySelector<HTMLElement>("summary")!;
    summary.click();
    expect(sheet.showModal).toHaveBeenCalledTimes(1);
    const body = root.querySelector<HTMLElement>("[data-finder-sheet-body]")!;
    expect(body.querySelector("h3")!.textContent).toMatch(/^Two quarters of argument/);
    expect(body.querySelector(".finder-outcome")!.textContent).toMatch(/partner agreement was signed/);
    expect(body.querySelector(".finder-proof")!.getAttribute("href")).toBe("/case-studies#story=day-one");
    expect(document.activeElement).toBe(root.querySelector("[data-finder-close]"));
    /* The brief opens at the story's door, and the sheet closes first. */
    const start = body.querySelector<HTMLAnchorElement>("[data-finder-start]")!;
    const event = new MouseEvent("click", { bubbles: true, cancelable: true });
    start.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(onStart).toHaveBeenCalledWith("gtm");
    expect(sheet.hasAttribute("open")).toBe(false);
    expect(document.activeElement).toBe(summary);
    unmount();
    tabs[1].click();
    expect(panels[1].hasAttribute("inert")).toBe(true);
    expect(root.querySelector("[data-story-finder]")!.classList.contains("is-live")).toBe(false);
  });

  /* Without a script every situation and every card is on the page, each card
     opening in place, and the start link is an ordinary link to the brief. */
  it("reads every situation and card in place without a script", () => {
    const root = document.createElement("div");
    root.innerHTML = leadershipChaptersMarkup();
    expect(root.querySelectorAll("[data-finder-panel][hidden]")).toHaveLength(0);
    expect(root.querySelectorAll("details[data-finder-card] .finder-full")).toHaveLength(17);
    root.querySelectorAll<HTMLAnchorElement>("[data-finder-start]").forEach((link) => expect(link.getAttribute("href")).toMatch(/^\/\?start=(brain|gtm)$/));
  });

  /* The phone's practice sequence (r46): a mint line sweeps each scene in as
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
