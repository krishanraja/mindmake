#!/usr/bin/env node
/**
 * One left edge per page: the wordmark and the page's own content.
 *
 * Krish photographed /ai-gtm on 24 September 2026 with the mark sitting 60px
 * outboard of "Build one useful AI system on real work." underneath it. Nothing
 * in the suite had ever measured the two against each other, so three separate
 * causes had accumulated unseen, and the reason they were unseen is the fourth
 * entry below:
 *
 * 1. The shared commercial block read `--mm-edge`, the container's measure,
 *    while the header read `--mm-header-inline`, the route's. On /ai-brain and
 *    /ai-gtm those are different numbers, and the gap grew with the viewport:
 *    180px at 1920 on the brain.
 * 2. /new-age-leadership draws its own masthead on the R5 surface's `--edge`
 *    and hangs the commercial block and the footer off a bare `.mm-site`, which
 *    took the container's. 63px against 100px at 1440, 72px against 340px at
 *    1920.
 * 3. `.mm-container` centred itself with auto margins, so the three blocks that
 *    declare a narrower `max-width` on the container itself were centred rather
 *    than shortened. The article title stood 210px inboard of the mark, the
 *    article body 260px, the legal sections 160px.
 * 4. All of it passed every other gate, because a screenshot at exit 0 proves
 *    the page rendered, not that it lines up.
 *
 * What this asks, at five widths, on every indexed route: the wordmark in the
 * page's own top bar and each of that page's content edges start on the same
 * pixel. `ANCHORS` names the content edge per surface, because a page's edge is
 * a design decision and a heuristic would eventually argue with one; anything
 * deliberately inset (a centred closing block, a quote's rule, a numbered rail)
 * is not a content edge and is not listed.
 *
 * With no `--base` it serves `dist/` itself, in Vercel's resolution order, so it
 * reads the same prerendered files production answers with. Point `--base` at a
 * dev server while iterating.
 *
 * Usage:
 *   node scripts/qa/logo-alignment-check.mjs [--base http://127.0.0.1:4180]
 *                                            [--widths 390,768,1280,1440,1920]
 *                                            [--browser <chromium path>]
 */
import { chromium } from "playwright";
import { loadAnswers } from "../lib/answers-loader.mjs";
import { loadBlogPosts } from "../lib/blog-posts-loader.mjs";
import { startServer } from "./serve-dist.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
/** Not 4180: the other gates use it, and CLAUDE.md forbids sharing a fixed port. */
const PORT = 4183;
const SERVED = flag("base", null);
const BASE = (SERVED ?? `http://127.0.0.1:${PORT}`).replace(/\/$/, "");
const WIDTHS = flag("widths", "390,768,1280,1440,1920").split(",").map(Number);
const EXECUTABLE = flag("browser", process.env.MM_CHROMIUM ?? undefined);
/**
 * One CSS pixel. A `clamp()` and a percentage resolving to the same edge can
 * land a hundredth apart, and nothing at that scale is visible; the drifts this
 * exists to catch were 42px and up.
 */
const TOLERANCE = 1;

/**
 * The wordmark, in the order the surfaces are tried. Each route resolves to the
 * first one that is on the page and visible.
 */
const LOGOS = [
  ".mm-header .mm-brand",
  ".mm-homepage-release .r3-opening .site-masthead .brand",
  ".nal-page .masthead .brand",
];

/**
 * The content edges every route is measured against.
 *
 * `.mm-container` is the primitive the standard routes are built from, so
 * naming it covers the article measures and the legal measures without listing
 * them and covers the next such block on the day it is written.
 */
const SHARED = [
  "main .mm-container",
  ".mm-footer > .mm-container > *",
  /* The commercial block's own copy. Its film layer is full-bleed by design and
     its instrument is the other column, so neither is a left edge. */
  ".mm-decision-balance-offer > h2",
  ".mm-decision-balance-offer > p",
  ".mm-decision-balance-offer > nav",
  ".mm-decision-balance-offer > button",
];
const ANCHORS = {
  "/": [
    ".r3-opening .hero-copy > h1",
    ".r3-opening .hero-copy > p",
    ".r3-opening .hero-copy > .route-doors",
    /* The R3 history chapter (reinstated in r41), on both the desktop and the
       phone frame; the hidden one fails the visibility test. */
    ".r3-history :is(.bridge, .story-copy)",
    /* The new-age leadership chapters below the first screen (r35). Their
       stages and scenes hang off the right edge, so each chapter's kicker is
       its left edge. */
    ".mm-home-leadership .reach-copy > .kicker",
    ".mm-home-leadership .work-intro > .kicker",
    ".mm-home-leadership .proof-story > .kicker",
    ".r3-footer .site-footer > :first-child",
  ],
  /* The R5 hero's deck is inset against the film on purpose and its action is
     pinned to the right edge, so the kicker and the headline are the edge. */
  "/new-age-leadership": [".nal-page .hero .hero-content > .kicker", ".nal-page .hero .hero-content > h1"],
};
/**
 * Every indexed route, plus one of each templated page, read from the same
 * loaders the sitemap uses so a renamed article cannot quietly drop the article
 * template out of the check.
 *
 * The homepage's chapters are listed too, as of the pass that put them on the
 * frame's edge. What is not listed anywhere is a right edge: this gate reads the
 * left one, so a rail or a stage that hangs off the right is verified by eye.
 */
const [posts, { answers, answerPath }] = await Promise.all([
  loadBlogPosts(process.cwd()),
  loadAnswers(process.cwd()),
]);
const ROUTES = [
  "/",
  "/ai-brain",
  "/ai-gtm",
  "/case-studies",
  "/new-age-leadership",
  "/blog",
  `/blog/${posts[0].slug}`,
  answerPath(answers[0].slug),
  "/faq",
  "/contact",
  "/privacy",
  "/terms",
  "/alumni",
  /* The 404, which the static server answers the way Vercel does: no file, so
     the SPA fallback, so the client router. It is not an indexed route and has
     no prerendered file of its own, which is exactly why it has to be named
     here rather than picked up from the page list. */
  "/this-route-does-not-exist",
];

/** Runs in the page. Self-contained: Playwright ships it across as source. */
const measure = ([logos, selectors]) => {
  const visible = (element) => {
    const box = element.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) return false;
    const style = getComputedStyle(element);
    return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) > 0.05;
  };
  const round = (value) => Math.round(value * 100) / 100;
  let logo = null;
  let logoSelector = null;
  for (const selector of logos) {
    for (const element of document.querySelectorAll(selector)) {
      if (!visible(element)) continue;
      logo = element;
      logoSelector = selector;
      break;
    }
    if (logo) break;
  }
  const edges = [];
  for (const selector of selectors) {
    for (const element of document.querySelectorAll(selector)) {
      if (!visible(element)) continue;
      /* A content edge is the box's own left, not its text's: a rule, a list
         marker or a button's inner padding indents the text and the box is
         still on the edge. */
      const left = element.getBoundingClientRect().left;
      edges.push({ selector, left: round(left), text: (element.textContent ?? "").trim().slice(0, 44) });
    }
  }
  return {
    logo: logo ? round(logo.getBoundingClientRect().left) : null,
    logoSelector,
    edges,
  };
};

const server = SERVED ? null : await startServer(PORT);
const browser = await chromium.launch(EXECUTABLE ? { executablePath: EXECUTABLE } : {});
const page = await browser.newPage();
const failures = [];
let checked = 0;

for (const route of ROUTES) {
  const selectors = [...SHARED, ...(ANCHORS[route] ?? [])];
  for (const width of WIDTHS) {
    await page.setViewportSize({ width, height: 900 });
    /* `load`, not `networkidle`: these pages hold looping film, so the network
       never goes quiet and the wait is a 30s timeout on the routes that carry
       the most film. Nothing measured here needs the film; the boxes are laid
       out by the stylesheets, which `load` guarantees. */
    const response = await page.goto(`${BASE}${route}`, { waitUntil: "load" });
    if (response && response.status() >= 400) {
      failures.push(`${route} @ ${width}: served ${response.status()}`);
      continue;
    }
    /* The surfaces reveal on scroll and the commercial block is sticky, so walk
       the page before reading. Nothing here depends on the scroll position: the
       left edge is the same at every offset, and walking it is what puts the
       later sections in the layout at all. */
    await page.evaluate(async () => {
      await document.fonts.ready;
      const step = window.innerHeight * 0.8;
      for (let top = 0; top <= document.body.scrollHeight; top += step) {
        window.scrollTo(0, top);
        await new Promise((resolve) => requestAnimationFrame(resolve));
      }
      window.scrollTo(0, 0);
      await new Promise((resolve) => setTimeout(resolve, 150));
    });
    const { logo, logoSelector, edges } = await page.evaluate(measure, [LOGOS, selectors]);
    if (logo === null) {
      failures.push(`${route} @ ${width}: no wordmark found (${LOGOS.join(", ")})`);
      continue;
    }
    if (edges.length === 0) {
      failures.push(`${route} @ ${width}: no content edge found (${selectors.join(", ")})`);
      continue;
    }
    for (const edge of edges) {
      checked += 1;
      const delta = Math.round((edge.left - logo) * 100) / 100;
      if (Math.abs(delta) <= TOLERANCE) continue;
      failures.push(
        `${route} @ ${width}: wordmark at ${logo} (${logoSelector}), ` +
          `${edge.selector} at ${edge.left} — ${delta > 0 ? "+" : ""}${delta}px  "${edge.text}"`,
      );
    }
  }
}

await browser.close();
server?.close();

if (failures.length > 0) {
  console.error(`Logo alignment: ${failures.length} of ${checked} content edges are not on the wordmark's edge.\n`);
  for (const failure of failures) console.error(`  ${failure}`);
  process.exit(1);
}
console.log(`Logo alignment: ${checked} content edges across ${ROUTES.length} routes and ${WIDTHS.length} widths, all on the wordmark's edge.`);
