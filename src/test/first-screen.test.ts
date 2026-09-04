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
 * was exactly right: pure white at 20ms, a document in black on white at 395ms,
 * and the site arriving at 719ms. Seven hundred milliseconds of a white page
 * nobody designed, on the ground the whole site is a reaction against.
 *
 * Two causes, both invisible to every test that existed. `src/index.css` sets a
 * page ground, and Vite injects the built stylesheet into the head *after* the
 * critical inline style in `index.html`, so the later rule won and the ground
 * was off-white until React painted over it. And the build wrote a hand-written
 * shell with no styles at all: every heading and paragraph on the page as plain
 * HTML, which is right for a crawler and was, for a visitor, a document.
 *
 * The first cause is what this file now guards. The second is gone rather than
 * fixed: `src/entry-server.tsx` renders the real components at build time, so
 * the first painted frame is the page, and the shell and the forty inlined
 * lines that styled it are deleted. Most of this file went with them; what
 * stays is the ground, in every place that can paint one, and a check that the
 * shell does not come back as a likeness. The behaviour itself is measured by
 * `scripts/qa/first-second-check.mjs`, which loads the built site cold on a
 * throttled connection and photographs the entrance.
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

describe("the scaffold stylesheet, and what it may still paint", () => {
  /* `src/index.css` is what this project was started from, and twice now
     something left in it has reached a visitor. First `next-themes` inlined a
     script whose minified text differed between the two bundles and threw away
     every page's server render. Then `a:hover` set a colour from the scaffold's
     own `--mint`, #00DBBA, which is not in the palette, and an underline that
     outranked every single-class card link. On Android a tap holds `:hover`, so
     a card a reader touched stayed underlined in that colour until they tapped
     elsewhere.

     The file still has to exist: it carries the Tailwind layers and the shadcn
     tokens that `src/components/ui` reads. What it must not do is style an
     element the public site renders. */

  it("styles no link at all", () => {
    const links = appCss.match(/^\s*a\s*[:,{][^}]*}/gm) ?? [];
    expect(links, `src/index.css styles a link: ${links.join(" | ")}`).toHaveLength(0);
  });

  it("keeps the scaffold accent away from anything rendered", () => {
    /* `--mint` here is a different colour from `--mm-mint` and always was. It
       may stay as a token the shadcn graph reads; it may not be used to paint. */
    const uses = appCss
      /* Comments are where the reason this rule exists is written down, and
         quoting the old declaration is the clearest way to write it. */
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split("\n")
      .filter((line) => /hsl\(var\(--mint\)/.test(line) && !/^\s*--/.test(line));
    expect(uses, `src/index.css paints with the scaffold accent: ${uses.join(" | ")}`).toHaveLength(0);
  });

  it("leaves the link default to the file that owns public surfaces", () => {
    expect(mindmakeCss).toContain(".mm-site a { color: inherit; text-decoration: none; }");
  });
});

describe("the shell, and why there is not one", () => {
  it("keeps the inline style to the ground and nothing else", () => {
    /* The inline block exists for one reason: the built stylesheet is
       render-blocking and 126KB, and the ground has to be right before it
       lands. Everything beyond that is a second copy of the design, which is
       how the first screen drifted away from the page three separate times. */
    expect(inlineStyle.length).toBeLessThan(220);
    for (const drift of ["--mm-tx", "font-size", "radial-gradient", "@keyframes", "animation"]) {
      expect(inlineStyle, drift).not.toContain(drift);
    }
  });

  it("has no hand-written first screen left anywhere", () => {
    /* Three bugs came from the shell being a likeness rather than the thing,
       the last of them a strip below the hero where the real page starts its
       next section on a raised ground and the shell had plain ink. A fourth
       would start exactly here, with an id nobody renders any more. */
    for (const [name, source] of [
      ["index.html", indexHtml],
      ["mindmake.css", mindmakeCss],
      ["prerender.mjs", read("scripts/prerender.mjs")],
    ] as const) {
      expect(source, name).not.toContain("prerendered-content");
      expect(source, name).not.toContain("prerendered-brand");
      expect(source, name).not.toContain("prerendered-plate");
    }
  });

  it("fills the root from the components instead", () => {
    /* The replacement, named so the deletion above reads as a move rather than
       a loss: a crawler that runs nothing still gets every word of every page,
       and now in the real layout. */
    const prerender = read("scripts/prerender.mjs");
    expect(prerender).toContain("entry-server");
    expect(prerender).toContain('<div id="root">');
    expect(read("src/entry-server.tsx")).toContain("renderToString");
  });
});

describe("the first screen's own files, asked for before the stylesheet", () => {
  /* Measured cold on a throttled phone, the page painted in Helvetica and
     Georgia and relaid itself twice as the real faces arrived, the wordmark
     painted half-drawn, and the hero poster popped into an empty plate 650ms
     after first paint. Every one of those is a file the browser only learned
     about after the 135KB render-blocking stylesheet had been parsed. The
     prerender now names them in the head, read from the built output rather
     than guessed, so a renamed asset cannot leave a stale preload behind. */
  const prerender = read("scripts/prerender.mjs");

  it("preloads the four latin faces it finds in the built stylesheet, or fails the build", () => {
    expect(prerender).toContain('rel="preload" as="font" type="font/woff2" crossorigin');
    for (const face of ["archivo", "newsreader", "source-serif-4", "ibm-plex-mono-latin-400-normal"]) {
      expect(prerender, face).toContain(face);
    }
    expect(prerender).toContain("fontFiles.length !== 4");
  });

  it("preloads the wordmark, the mark and the priority poster from the page it rendered", () => {
    expect(prerender).toContain('class="mm-brand-wordmark" src="');
    expect(prerender).toContain('class="mm-brand-icon" src="');
    expect(prerender).toContain('as="image" type="image/webp" fetchpriority="high"');
    const brand = read("src/components/mindmake/MindmakeBrand.tsx");
    expect(brand.match(/fetchpriority: "high"/g)).toHaveLength(2);
    expect(brand.match(/decoding="sync"/g)).toHaveLength(2);
  });

  it("gives every fallback face the metrics of the face it stands in for", () => {
    for (const face of ["Archivo Fallback", "Newsreader Fallback", "Source Serif Fallback", "Plex Mono Fallback"]) {
      const at = mindmakeCss.indexOf(`font-family: "${face}"`);
      expect(at, face).toBeGreaterThan(-1);
      const rule = mindmakeCss.slice(at, mindmakeCss.indexOf("}", at));
      for (const metric of ["size-adjust", "ascent-override", "descent-override", "line-gap-override"]) {
        expect(rule, `${face} ${metric}`).toContain(metric);
      }
    }
    expect(mindmakeCss).toContain('--mm-grotesque: "Archivo Variable", "Archivo Fallback"');
    expect(mindmakeCss).toContain('--mm-serif: "Newsreader Variable", "Newsreader Fallback"');
    expect(mindmakeCss).toContain('--mm-body: "Source Serif 4 Variable", "Source Serif Fallback"');
    expect(mindmakeCss).toContain('--mm-mono: "IBM Plex Mono", "Plex Mono Fallback"');
  });
});

describe("the entrance, held in the head and released once", () => {
  /* The page arrives once. The inline script in index.html sets mm-pending
     and mm-curtain on <html> before first paint and swaps them for
     mm-arrived when the four faces are in or 700ms after the first frame,
     marking both moments for the gate. Everything about it that matters is
     a guarantee about what happens when it does not run. */
  const script = indexHtml.slice(indexHtml.indexOf("var CURTAIN"), indexHtml.indexOf("</script>", indexHtml.indexOf("var CURTAIN")));

  it("is small, and outside the React tree", () => {
    expect(script.length).toBeLessThan(1400);
    expect(indexHtml.indexOf("var CURTAIN")).toBeLessThan(indexHtml.indexOf('<div id="root">'));
  });

  it("waits for the four faces by name, with a cap from the first frame and one for a background tab", () => {
    expect(script).toContain("d.fonts.load");
    for (const face of ["Archivo Variable", "Newsreader Variable", "Source Serif 4 Variable", "IBM Plex Mono"]) {
      expect(script).toContain(face);
    }
    expect(script).toContain("requestAnimationFrame");
    expect(script).toContain("setTimeout(go,700)");
    expect(script).toContain("setTimeout(go,4000)");
    expect(script).toContain('performance.mark("mm-pending")');
    expect(script).toContain('performance.mark("mm-arrived")');
  });

  it("stands down for reduced motion and for a deep link", () => {
    expect(script).toContain("prefers-reduced-motion: reduce");
    expect(script).toContain("location.hash");
  });

  it("carries the curtain as fifteen strips that only the script can show", () => {
    const curtain = indexHtml.slice(indexHtml.indexOf('<div class="mm-curtain"'), indexHtml.indexOf('<div id="root">'));
    expect(curtain.match(/<i style="--i:\d+"><\/i>/g)).toHaveLength(15);
    expect(curtain).toContain('aria-hidden="true"');
    expect(mindmakeCss).toContain(".mm-curtain { display: none; }");
    expect(mindmakeCss).toContain(".mm-curtain.is-on {");
    /* Keyed on the element's own class and never on a class of <html>: a
       root-class-keyed rule on this element, even display: none, held every
       frame in Chromium until the class came off. */
    expect(mindmakeCss).not.toContain("html.mm-curtain");
    expect(curtain).toContain('classList.add("is-on")');
    expect(script).toContain("var CURTAIN=true");
  });

  it("keeps the critical inline style to the ground even so", () => {
    expect(inlineStyle.length).toBeLessThan(220);
    expect(inlineStyle).not.toContain("mm-curtain");
  });
});
