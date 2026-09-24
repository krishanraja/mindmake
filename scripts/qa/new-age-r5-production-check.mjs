#!/usr/bin/env node
/**
 * /new-age-leadership: the story has to build as the page is scrolled, on a
 * phone as well as a desktop, and it has to do it inside the site's own chrome.
 *
 * What this gate is answering, and why it is written the way it is.
 *
 * The route shipped with three pinned sequences that never pinned. The prototype
 * declared `overflow-x: hidden` on `body`, where the scrollport is the viewport;
 * production scopes every prototype selector to `.nal-page`, which turned that
 * div into its own scrollport, and a `position: sticky` child of a container
 * that never scrolls does not stick. Each sequence therefore scrolled away
 * after one screen and left the rest of its track — 1800 to 1980px of it — as
 * empty paper, and the states it was supposed to build through changed
 * off-screen where nobody saw them. The only way through the page was the
 * buttons. Nothing in the old gate could see any of this: it read each control,
 * clicked it, and confirmed the state changed.
 *
 * So this one never clicks to prove a state exists. It scrolls, and records
 * what the page shows at each position. A sequence passes when scrolling alone
 * reaches every one of its states, and reaches them again in reverse. Anything
 * a reader can only get to by pressing a button is a failure here, which is the
 * whole point.
 *
 * The blank-band measure exists for the same reason. It samples seven columns
 * across sixty rows of the viewport and calls a row empty when no column has
 * text, media, a border or a background image on it. The longest run of empty
 * rows is the band a reader sees as a hole. Before the fix the worst was a full
 * viewport; the limit below is set above the composition's own editorial pauses
 * and below anything that reads as a fault. It is deliberately not tightened to
 * the current measurement: this is a floor for faults, not a lock on layout.
 *
 * What it does not cover: it exercises the route's source through Vite, as the
 * gate it replaces did, not the built artifact. It is evidence about behaviour,
 * not a release receipt; `qa:release-routes` is what binds the built bytes.
 *
 * Run: node scripts/qa/new-age-r5-production-check.mjs
 *      QA_ENGINES="chromium webkit" node scripts/qa/new-age-r5-production-check.mjs
 */
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "artifacts", "new-age-leadership");
const failures = [];
const observations = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

/* The R5 prototype is the approved baseline and stays byte-identical. Everything
   this release changed is production source: the page component, the hand-
   authored R6 layer, and the shell overrides in mindmake.css. */
const locked = {
  "prototypes/website-redesign-recovery/new-age-leadership/index-s3-r5.html": "cdf7603e278730dfae162e82fc4433e4a7452d0d4b1e268b2580a079445ac7b1",
  "prototypes/website-redesign-recovery/new-age-leadership/styles-s3-r5.css": "9164326484d62717ba781edbe7d3fc50dfac35f6739b5bb9aadbf833082bbe34",
  "prototypes/website-redesign-recovery/new-age-leadership/script-s3-r5.js": "68fa0f838808e6a2efb355e1c5aedc3d81ef726e4a59a41b033d91d7ee5e7e6f",
};

/* Portrait phones, a small phone, a phone held sideways, tablets and desktops.
   The 360x640 case is here because a rule written for a phone in landscape was
   claiming a whole screen for four words of heading on one held upright. */
const VIEWPORTS = {
  chromium: [[320, 568], [360, 640], [390, 844], [430, 932], [768, 1024], [844, 390], [1024, 768], [1366, 768], [1440, 900], [1920, 1080]],
  webkit: [[390, 844], [844, 390], [1440, 900]],
  firefox: [[390, 844], [844, 390], [1440, 900]],
};

/* Above this share of the viewport, a run of nothing is a fault rather than a
   pause. The composition's widest intentional rest measured 30%. */
const BLANK_LIMIT = 0.42;
/* Sampling density, not a fixed step count. The shortest state on the page is
   one AI Brain benefit, which is 40svh of scroll on a short screen; a fixed 40
   samples over a document five viewports longer than that strides straight past
   one and reports a state the page does draw as missing. So the stride is tied
   to the viewport and the floor is only a floor. */
const MIN_STEPS = 40;
const STRIDE_SHARE = 0.28;

await mkdir(output, { recursive: true });
for (const [file, expected] of Object.entries(locked)) {
  const actual = createHash("sha256").update(await readFile(path.join(root, file))).digest("hex");
  fail(actual !== expected, `${file}: approved R5 baseline hash changed (${actual})`);
}

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;
const engines = { chromium, webkit, firefox };
const asked = (process.env.QA_ENGINES || process.env.QA_ENGINE || "chromium webkit firefox").split(/[\s,]+/u).filter(Boolean);

/* Runs inside the page at one scroll position. Returns which state each
   sequence is showing and the longest run of viewport rows with nothing on
   them. `elementsFromPoint` is used rather than a screenshot diff because a
   film frame that happens to be almost black is content, and a paper panel with
   no words on it is not. */
const PROBE = `(() => {
  const COLS = 7, ROWS = 60;
  const painted = (x, y) => {
    for (const el of document.elementsFromPoint(x, y)) {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "svg" || tag === "INPUT") return true;
      const cs = getComputedStyle(el);
      if (cs.backgroundImage !== "none") return true;
      if (cs.borderTopWidth !== "0px" || cs.borderBottomWidth !== "0px" || cs.borderLeftWidth !== "0px" || cs.borderRightWidth !== "0px") return true;
      for (const node of el.childNodes) {
        if (node.nodeType !== 3 || !node.textContent.trim()) continue;
        const range = document.createRange();
        range.selectNodeContents(el);
        for (const r of range.getClientRects()) if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
      }
    }
    return false;
  };
  let run = 0, worst = 0;
  for (let r = 0; r < ROWS; r += 1) {
    const y = Math.min(innerHeight - 1, Math.round((innerHeight * r) / (ROWS - 1)));
    let blank = true;
    for (let c = 0; c < COLS; c += 1) {
      const x = Math.min(innerWidth - 1, Math.round((innerWidth * (c + 0.5)) / COLS));
      if (painted(x, y)) { blank = false; break; }
    }
    if (blank) { run += 1; worst = Math.max(worst, run); } else run = 0;
  }
  const active = (sel) => [...document.querySelectorAll(sel)].findIndex((n) => n.classList.contains("is-active"));
  /* Below 900px the three work scenes are laid out one after another rather
     than cross-faded in place, so "which one is showing" is which one the
     viewport is over, not which one carries the active class. */
  const scenes = [...document.querySelectorAll("[data-work-scene]")];
  const stacked = scenes.length > 0 && getComputedStyle(scenes[0]).position !== "absolute";
  const onScreen = scenes.findIndex((n) => { const r = n.getBoundingClientRect(); return r.top < innerHeight * 0.6 && r.bottom > innerHeight * 0.4; });
  return {
    blank: Math.round((worst * innerHeight) / 59),
    lens: active("[data-lens-copy]"),
    reach: active("[data-reach-panel]"),
    benefit: active("[data-benefit]"),
    work: stacked ? onScreen : active("[data-work-scene]"),
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  };
})()`;

async function sweep(page, height, direction) {
  const doc = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.max(MIN_STEPS, Math.ceil((doc - height) / (height * STRIDE_SHARE)) + 1);
  const seen = { lens: new Set(), reach: new Set(), benefit: new Set(), work: new Set() };
  let worstBlank = 0;
  let worstBlankAt = 0;
  let overflow = 0;
  for (let i = 0; i < steps; i += 1) {
    const step = direction === "forward" ? i : steps - 1 - i;
    /* The document is re-read rather than divided up once. A film that finishes
       loading or the action bar arriving changes the page's height mid-sweep,
       and positions computed from a stale total land somewhere other than where
       they were meant to. */
    const total = await page.evaluate(() => document.documentElement.scrollHeight) - height;
    const y = Math.round((total * step) / (steps - 1));
    /* Scroll, then let the page answer it: two frames for the scroll handler
       and the transition that follows, then a beat for the film swap. */
    await page.evaluate(async (top) => {
      scrollTo({ top, behavior: "auto" });
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    }, y);
    await page.waitForTimeout(150);
    const state = await page.evaluate(PROBE);
    for (const key of Object.keys(seen)) if (state[key] >= 0) seen[key].add(state[key]);
    if (state.blank > worstBlank) { worstBlank = state.blank; worstBlankAt = y; }
    overflow = Math.max(overflow, state.overflow);
  }
  return { seen, worstBlank, worstBlankAt, overflow, doc, steps };
}

for (const engineName of asked) {
  if (!engines[engineName]) { failures.push(`unknown engine ${engineName}`); continue; }
  const browser = await engines[engineName].launch({ headless: true });
  for (const [width, height] of VIEWPORTS[engineName]) {
    const label = `${engineName}-${width}x${height}`;
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
    await page.locator("#hero-title").waitFor();
    await page.evaluate(() => document.fonts?.ready);
    /* The privacy notice is answered before measuring. It is real chrome and
       other gates check it where it belongs; here it would sit over the
       sequence controls at the foot of the screen for part of every sweep and
       change the page's height while it does. */
    const consent = page.locator(".mm-cookie-notice button", { hasText: /got it/iu }).first();
    if (await consent.count()) await consent.click().catch(() => undefined);
    await page.waitForTimeout(400);

    const opening = await page.evaluate(() => {
      const box = (selector) => { const r = document.querySelector(selector)?.getBoundingClientRect(); return r && { top: r.top, bottom: r.bottom, left: r.left, width: r.width, height: r.height }; };
      const shown = (selector) => { const n = document.querySelector(selector); if (!n) return false; const s = getComputedStyle(n); const r = n.getBoundingClientRect(); return s.visibility !== "hidden" && s.opacity !== "0" && r.width > 0 && r.height > 0; };
      const title = document.querySelector("#hero-title");
      return {
        hero: box(".nal-page .hero"),
        header: box(".mm-header"),
        brand: box(".mm-header .mm-brand"),
        content: box(".nal-page .hero-content"),
        action: box(".nal-page .hero-action"),
        headingColour: getComputedStyle(title).color,
        headingFamily: getComputedStyle(title).fontFamily,
        bodyLength: document.body.innerText.length,
        ownMasthead: document.querySelectorAll(".nal-page .masthead").length,
        footers: document.querySelectorAll(".mm-footer").length,
        motionLabel: document.querySelector(".nal-page .motion-toggle span")?.textContent,
        motionShown: shown(".nal-page .motion-toggle"),
        visible: ["#hero-title", ".nal-page .hero-action", ".nal-page .motion-toggle"].every(shown),
        controlHeights: [...document.querySelectorAll(".nal-page button,.nal-page input[type=range],.nal-page a.hero-action")].filter((node) => { const s = getComputedStyle(node); const r = node.getBoundingClientRect(); return s.visibility !== "hidden" && s.display !== "none" && r.height > 0; }).map((node) => node.getBoundingClientRect().height),
      };
    });

    /* The site's own chrome, not a masthead this one route drew for itself. */
    fail(opening.ownMasthead !== 0, `${label}: the route still draws its own masthead`);
    fail(!opening.header || !opening.brand, `${label}: the shared site header is missing`);
    fail(opening.footers !== 1, `${label}: expected exactly one site footer, found ${opening.footers}`);
    fail(await page.getByRole("button", { name: "Open navigation", exact: true }).count() !== 1, `${label}: the shared navigation control is missing`);
    fail(!opening.brand || !opening.content || Math.abs(opening.brand.left - opening.content.left) > 2, `${label}: wordmark and story share no gutter (${JSON.stringify({ brand: opening.brand?.left, content: opening.content?.left })})`);

    fail(!opening.hero || Math.abs(opening.hero.top) > 1 || Math.abs(opening.hero.height - height) > 2, `${label}: hero does not own the opening viewport`);
    fail(!opening.header || !opening.action || opening.header.bottom > opening.action.top, `${label}: fixed header collides with the hero action`);
    fail(opening.headingColour !== "rgb(234, 223, 200)", `${label}: hero heading colour is ${opening.headingColour}`);
    fail(!/Newsreader/u.test(opening.headingFamily), `${label}: the site reset has taken the story's heading face (${opening.headingFamily})`);
    fail(opening.bodyLength < 1200 || !opening.visible, `${label}: primary content is missing`);
    fail(opening.controlHeights.some((value) => value > 0 && value < 44), `${label}: a visible control is smaller than 44px`);
    /* The span is the button's accessible name and the script rewrites it as
       the state changes. A phone used to hide it and draw a fixed word. */
    fail(!opening.motionShown || !/motion/iu.test(opening.motionLabel || ""), `${label}: the film control has no readable label (${opening.motionLabel})`);

    const forward = await sweep(page, height, "forward");
    const reverse = await sweep(page, height, "reverse");

    /* Scrolling alone, in both directions, reaches every state. */
    for (const [pass, result] of [["forward", forward], ["reverse", reverse]]) {
      fail(result.seen.lens.size !== 4, `${label}: ${pass} scroll reached ${result.seen.lens.size}/4 history states`);
      fail(result.seen.reach.size !== 2, `${label}: ${pass} scroll reached ${result.seen.reach.size}/2 reach states`);
      fail(result.seen.benefit.size !== 6, `${label}: ${pass} scroll reached ${result.seen.benefit.size}/6 AI Brain benefits`);
      fail(result.seen.work.size !== 3, `${label}: ${pass} scroll reached ${result.seen.work.size}/3 working scenes`);
      fail(result.worstBlank > height * BLANK_LIMIT, `${label}: ${pass} pass shows ${result.worstBlank}px of nothing at y=${result.worstBlankAt} (limit ${Math.round(height * BLANK_LIMIT)}px)`);
      fail(result.overflow > 1, `${label}: ${pass} pass has horizontal overflow ${result.overflow}px`);
    }
    fail(errors.length > 0, `${label}: runtime errors ${errors.join(" | ")}`);

    observations.push({ label, document: forward.doc, samples: forward.steps, worstBlankPx: Math.max(forward.worstBlank, reverse.worstBlank), worstBlankShare: Number((Math.max(forward.worstBlank, reverse.worstBlank) / height).toFixed(3)), forward: Object.fromEntries(Object.entries(forward.seen).map(([k, v]) => [k, [...v].sort((a, b) => a - b)])), reverse: Object.fromEntries(Object.entries(reverse.seen).map(([k, v]) => [k, [...v].sort((a, b) => a - b)])) });

    if ([[390, 844], [844, 390], [1440, 900]].some(([w, h]) => w === width && h === height)) {
      await page.evaluate(() => scrollTo({ top: 0, behavior: "auto" }));
      await page.waitForTimeout(200);
      await page.screenshot({ path: `${output}/${label}.png`, fullPage: false });
    }

    /* The route's stylesheet is scoped so it cannot follow the reader out. */
    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    fail(await page.locator(".nal-page").count() !== 0, `${label}: page scope survives route navigation`);
    await page.close();
  }
  await browser.close();
}

/* A negative control. With the sticky positioning removed the sequences cannot
   build with scroll and the tracks empty out, which is exactly the shipped
   fault; if the sweep above still passes against that, it is measuring nothing. */
const control = await chromium.launch({ headless: true });
const controlPage = await control.newPage({ viewport: { width: 1440, height: 900 } });
await controlPage.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
await controlPage.locator("#hero-title").waitFor();
await controlPage.addStyleTag({ content: ".nal-page .lens-sticky,.nal-page .reach-sticky,.nal-page .work-sticky,.nal-page .proof-track>.proof-story{position:static!important}" });
await controlPage.waitForTimeout(300);
const broken = await sweep(controlPage, 900, "forward");
const controlCaught = broken.seen.lens.size !== 4 || broken.worstBlank > 900 * BLANK_LIMIT;
fail(!controlCaught, "negative control: the sweep passes a page whose pins have been removed, so it is not measuring the pins");
observations.push({ label: "negative-control-unpinned", historyStatesReached: broken.seen.lens.size, worstBlankPx: broken.worstBlank });
await control.close();

await server.close();
const report = { gate: "new-age-leadership-scroll-build", at: new Date().toISOString(), engines: asked, blankLimitShare: BLANK_LIMIT, minSteps: MIN_STEPS, strideShare: STRIDE_SHARE, observations, failures };
await writeFile(path.join(output, "report.json"), `${JSON.stringify(report, null, 2)}\n`, "utf8");
console.log(JSON.stringify(report, null, 2));
if (failures.length) process.exitCode = 1;
