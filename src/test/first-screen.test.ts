import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const read = (relative: string) => readFileSync(resolve(ROOT, relative), "utf8");

/**
 * The first screen, before JavaScript.
 *
 * Krish described the entrance as a text-only page on a white background, then
 * a glitch, then the site. Measured cold at 390px on a 4Mbps connection, that
 * was exactly right: pure white at 20ms, the prerendered document in black on
 * white at 395ms, and the site arriving at 719ms. Seven hundred milliseconds of
 * a white page nobody designed, on the ground the whole site is a reaction
 * against.
 *
 * Two causes, both invisible to every test that existed. `src/index.css` sets a
 * page ground, and Vite injects the built stylesheet into the head *after* the
 * critical inline style in `index.html`, so the later rule won and the ground
 * was off-white until React painted over it. And the prerendered shell had no
 * styles at all: it is every heading and paragraph on the page as plain HTML,
 * which is right for a crawler and was, for a visitor, a document.
 *
 * A stylesheet is not markup, so no component test could see either one. What
 * follows is the checkable form: the ground is the ink in every place that can
 * paint one, and the two copies of the first screen's CSS agree. The behaviour
 * itself is measured by `scripts/qa/first-second-check.mjs`, which loads the
 * built site cold on a throttled connection and photographs the entrance.
 */

const indexHtml = read("index.html");
const inlineStyle = indexHtml.slice(indexHtml.indexOf("<style>"), indexHtml.indexOf("</style>"));
const mindmakeCss = read("src/styles/mindmake.css");
const appCss = read("src/index.css");

/** The one ink. Repeated in three files, which is why this test exists. */
const INK = "#0a100d";

describe("the ground, everywhere something can paint one", () => {
  it("is the ink in the critical inline style", () => {
    expect(inlineStyle).toContain(`background:${INK}`);
  });

  it("is the ink on body, not the shadcn --background token", () => {
    /* This is the rule that caused it. `--background` is off-white and is still
       correct for the components that read it through `bg-background`; it was
       never correct for the page, because every page on this site, the 404
       included, renders inside `.mm-site` and `.mm-site` paints the ink. */
    const body = appCss.slice(appCss.indexOf("\nbody {"));
    const block = body.slice(0, body.indexOf("}"));
    expect(block).toContain(`background-color: ${INK}`);
    expect(block).not.toContain("hsl(var(--background))");
  });

  it("still leaves --background alone for the components that read it", () => {
    expect(appCss).toContain("--background: var(--off-white)");
    expect(read("src/App.tsx")).toContain("bg-background");
  });

  it("agrees with the token the design system defines", () => {
    const root = mindmakeCss.slice(mindmakeCss.indexOf(":root"));
    expect(root.slice(0, root.indexOf("}"))).toContain(`--mm-ink: ${INK}`);
  });
});

describe("the prerendered shell", () => {
  const prerender = read("scripts/prerender.mjs");

  it("carries the wordmark, so the header does not appear out of nowhere", () => {
    expect(prerender).toContain('id="prerendered-brand"');
    expect(prerender).toMatch(/MIND<span>\/<\/span>MAKE/);
  });

  it("is styled by both copies of the first screen's CSS", () => {
    for (const [name, css] of [["inline", inlineStyle], ["stylesheet", mindmakeCss]] as const) {
      expect(css, name).toContain("#prerendered-content");
      expect(css, name).toContain("#prerendered-brand");
      expect(css, name).toContain("mm-first-light");
    }
  });

  it("holds the two copies to the same values", () => {
    /* The inline copy exists so the first screen does not wait on a 126KB
       render-blocking stylesheet. Two copies of a colour is how a ground
       drifts, so the values are compared rather than trusted. */
    for (const value of [
      "--mm-ink:#0a100d",
      "--mm-tx:#e6ede8",
      "--mm-tx2:#b0c0b7",
      "--mm-mint:#7fe3b4",
    ]) {
      expect(inlineStyle, value).toContain(value);
      const [token, colour] = value.split(":");
      expect(mindmakeCss, value).toContain(`${token}: ${colour}`);
    }
    for (const shape of [
      "height:100dvh",
      "clamp(26px,4.6vw,54px)",
      "radial-gradient(60% 45% at 50% 40%",
    ]) {
      expect(inlineStyle, shape).toContain(shape);
      expect(mindmakeCss.replace(/\s+/g, ""), shape).toContain(shape.replace(/\s+/g, ""));
    }
  });

  it("hides nothing it is indexed for", () => {
    /* The shell is the whole page's copy, which is the point: a crawler that
       runs no JavaScript still gets all of it. So the screen it does not fit in
       is clipped, never display:none, and the text stays text. */
    const block = mindmakeCss.slice(mindmakeCss.indexOf("#prerendered-content {"));
    const shell = block.slice(0, block.indexOf("}"));
    expect(shell).toContain("overflow: hidden");
    expect(shell).not.toContain("display: none");
    expect(mindmakeCss).toContain("margin-bottom: 100dvh");
  });

  it("moves without JavaScript, and stops when asked", () => {
    /* The only thing on screen that can move before React exists. Reduced
       motion still gets the light; it simply stops travelling. */
    for (const [name, css] of [["inline", inlineStyle], ["stylesheet", mindmakeCss]] as const) {
      expect(css, name).toContain("animation");
      /* Matched without the trailing punctuation: the inline copy is minified
         by hand and the stylesheet is not, so one carries a semicolon. */
      expect(css.replace(/\s+/g, ""), name)
        .toMatch(/prefers-reduced-motion:reduce\)\{#prerendered-content::before\{animation:none;?\}/);
    }
  });

  it("names the wordmark out of the rules that would move it", () => {
    /* Three real bugs, all the same shape. `#prerendered-content > *` set
       position:relative and dropped both the wordmark and the film plate out of
       their absolute placement into the flow, and `#prerendered-content p` gave
       the wordmark a 58ch max-width with auto margins and centred it, because
       the wordmark is a paragraph and that selector outranks its id by one
       element. An id is not automatically the most specific thing in the room. */
    for (const [name, css] of [["inline", inlineStyle], ["stylesheet", mindmakeCss]] as const) {
      expect(css.replace(/\s+/g, ""), name).toContain(">*:not(#prerendered-brand,#prerendered-plate)");
      expect(css.replace(/\s+/g, ""), name).toContain("p:not(#prerendered-brand)");
    }
  });
});
