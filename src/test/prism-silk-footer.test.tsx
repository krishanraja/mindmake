import { describe, expect, it, vi } from "vitest";
import { renderToString } from "react-dom/server";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import PrismSilkFooter, {
  psfApproach,
  psfColumnHue,
  psfEaseBack,
  psfFive,
  psfGrainFrame,
  psfHex,
  psfLayerRise,
  psfOnScreen,
  psfStageHeight,
} from "@/components/ui/prism-silk-footer";
import { MindmakeFooter } from "@/components/mindmake/MindmakeFooter";
import { PRIMARY_ROUTES, START_LABEL, START_LABEL_GTM } from "@/lib/publicLinks";

describe("the silk's pure helpers", () => {
  it("reads hex and keeps exactly five silk colours", () => {
    expect(psfHex("#fff")).toEqual([1, 1, 1]);
    expect(psfHex("06110d")?.map((v) => Math.round(v * 255))).toEqual([6, 17, 13]);
    expect(psfHex("mint")).toBeNull();
    expect(psfFive(["#111", "nope", "#222"], ["#000"])).toEqual(["#111", "#222", "#111", "#222", "#111"]);
    expect(psfFive([], ["#000"])).toEqual(["#000", "#000", "#000", "#000", "#000"]);
  });

  it("settles every fold exactly, back folds first", () => {
    expect(psfEaseBack(0)).toBe(0);
    expect(psfEaseBack(1)).toBe(1);
    expect(Math.max(...Array.from({ length: 99 }, (_, i) => psfEaseBack((i + 1) / 100)))).toBeGreaterThan(1);
    expect(psfLayerRise(0.3, 0, 5)).toBeGreaterThan(psfLayerRise(0.3, 4, 5));
    for (let i = 0; i < 5; i++) expect(psfLayerRise(1, i, 5)).toBe(1);
  });

  it("keeps grain, motion and hue within bounds", () => {
    expect(psfGrainFrame(-1, 24)).toBe(0);
    expect(psfGrainFrame(1000, 24)).toBeLessThan(997);
    expect(psfApproach(0, 1, 10, 6)).toBeLessThan(1);
    expect(psfApproach(0, 1, 0.1, 6)).toBeGreaterThan(0);
    for (let i = 0; i < 3; i++) expect(Math.abs(psfColumnHue(i, 3))).toBeLessThanOrEqual(0.36);
    expect(psfColumnHue(0, 0)).toBe(0);
    expect(psfStageHeight(100, 90)).toBe(80);
  });

  it("knows a footer already on screen", () => {
    expect(psfOnScreen(100, 900, 800)).toBe(true);
    expect(psfOnScreen(900, 1600, 800)).toBe(false);
    expect(psfOnScreen(-900, -10, 800)).toBe(false);
  });
});

describe("the footer without script", () => {
  it("renders every word visible, with no entrance armed, and a stylesheet the server does not escape", () => {
    const html = renderToString(<PrismSilkFooter name="Test" credit={null} socials={[]} />);
    const rootClass = html.match(/^<footer class="([^"]*)"/)?.[1] ?? "";
    expect(rootClass.split(" ")).toContain("psf-root");
    expect(rootClass.split(" ")).not.toContain("psf-armed");
    expect(rootClass.split(" ")).not.toContain("psf-in");
    /* React escapes ">" and quotes in a text child of <style>; the sheet is
       written raw, so its child combinators and content strings survive. */
    expect(html).toContain(".psf-roll > span");
    expect(html).toContain('content: ""');
    expect(html).not.toContain("&gt; span");
  });

  it("hides text only behind the armed class the client adds", () => {
    const css = renderToString(<PrismSilkFooter />).match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
    /* Every selector rule that zeroes opacity or scale, apart from hover-only
       chrome (the tooltip, the chip's edge) and keyframe steps. */
    const hiding = css.split("}").map((rule) => rule.trim()).filter((rule) => rule.startsWith(".") && /opacity:\s*0;|scaleX\(0\)/.test(rule) && !/^\.psf-(?:tip|soc::before)\b/.test(rule));
    expect(hiding.length).toBeGreaterThan(0);
    for (const rule of hiding) expect(rule).toMatch(/^\.psf-armed:not\(\.psf-in\) /);
  });
});

describe("the Mindmake footer", () => {
  const draw = (label?: string) => {
    const onStart = vi.fn();
    render(
      <MemoryRouter>
        <MindmakeFooter onStart={onStart} startLabel={label} />
      </MemoryRouter>,
    );
    return onStart;
  };

  it("carries every primary route, the way in, Subscribe, the legal pair and the registered companies", () => {
    draw();
    const nav = screen.getByRole("navigation", { name: "Footer navigation" });
    const links = [...nav.querySelectorAll("a")].map((a) => a.textContent?.replace("↗", "").trim());
    for (const { label } of PRIMARY_ROUTES) expect(links).toContain(label);
    expect(links).toContain(START_LABEL);
    expect(links).toHaveLength(PRIMARY_ROUTES.length + 1);
    const legal = screen.getByRole("navigation", { name: "Legal navigation" });
    expect([...legal.querySelectorAll("a")].map((a) => a.getAttribute("href"))).toEqual(["/privacy", "/terms"]);
    expect(screen.getByRole("link", { name: /Subscribe for free/ }).getAttribute("href")).toBe("https://makeyourmindup.ai");
    expect(document.body.textContent).toContain("Keep your edge as AIchanges the market.");
    expect(document.body.textContent).toContain("Mindmake is a Mindmaker LLC company. Mindmaker Ltd in the UK.");
    /* Nothing from the stock component leaks through. */
    expect(document.body.textContent).not.toMatch(/Lumenfold|Makora|Made with|Hiring/);
    expect(document.querySelector(".psf-soc")).toBeNull();
  });

  it("opens the brief from the way in instead of following /start", () => {
    const onStart = draw(START_LABEL_GTM);
    const start = screen.getByRole("link", { name: START_LABEL_GTM });
    expect(start.getAttribute("href")).toBe("/start");
    start.click();
    expect(onStart).toHaveBeenCalledTimes(1);
  });

  it("opens Media in a new tab and keeps the phone footer minimal", () => {
    draw();
    const media = screen.getByRole("link", { name: /^Media/ });
    expect(media.getAttribute("target")).toBe("_blank");
    expect(document.querySelector("footer.mm-footer.psf-phone-minimal")).not.toBeNull();
  });
});
