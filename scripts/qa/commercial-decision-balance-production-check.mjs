#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = "C:/Users/krish/.scratch/mindmake-commercial-decision-balance-production";
const failures = [];
const observations = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

const approvedHashes = {
  "prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s4-r3.html": "0bcaad80c828eea0033a4cdabbf0e9ad0973b674720ec85a5805f5f862800495",
  "prototypes/website-redesign-recovery/commercial-continuity/styles-readiness-s4.css": "62ea24a3bf36212ee04555b447c27a8557403cab79a32c72ba23af07ba171d4e",
  "prototypes/website-redesign-recovery/commercial-continuity/styles-readiness-s4-r2.css": "04fb946dc4376ff8c963b88fe6dfc60cb183f3523cbd345dc9705ab5e28070ed",
  "prototypes/website-redesign-recovery/commercial-continuity/styles-readiness-s4-r3.css": "22dd1c403e652306ae8717557a3ba96b6862650ce6e5988e685e33b57a50f2c5",
  "prototypes/website-redesign-recovery/commercial-continuity/script-readiness-s4.js": "451bad24d3126da11add67a3e885f0348d03ace8d7fb3ad39ff3eee0b365ada9",
  "prototypes/website-redesign-recovery/commercial-continuity/script-readiness-s4-r3.js": "cf5ba4788afc7ad32da07c515cfedd479ca5c68d4d82fe32d5100ec5a09e5469",
  "prototypes/website-redesign-recovery/commercial-continuity/check-readiness-s4-r3.mjs": "541b872572d1f3f02bb510c6678032e9517c2fef05a44185f91f17e888d828ad",
};

// Ruling (Krish, 2026-09-24): the Decision Balance exists on
// /new-age-leadership and absolutely nowhere else. `routes` is the surface that
// carries it; `removedRoutes` is the negative control over the six that used to.
const routes = [
  ["/new-age-leadership", "leadership"],
];

const removedRoutes = [
  "/",
  "/blog",
  "/blog/a-useful-first-30-days-building-with-ai",
  "/answers",
  "/answers/ai-decision-tool-trustworthy-leadership-team",
  "/ai-brain",
  "/ai-gtm",
];

const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1108,574],[1280,720],[1366,640],[1440,900],[1475,730],[1538,636],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1280,720],[1366,640],[1475,730],[1538,636],[1920,1080]];
const fastBrowser = process.env.DECISION_BALANCE_QA_FAST;
const fastViewport = (process.env.DECISION_BALANCE_QA_VIEWPORT || "1280x720").split("x").map(Number);
const matrices = fastBrowser ? {
  chromium: fastBrowser === "1" || fastBrowser === "chromium" ? [fastViewport] : [],
  webkit: fastBrowser === "webkit" ? [fastViewport] : [],
  firefox: fastBrowser === "firefox" ? [fastViewport] : [],
} : { chromium: chromiumViewports, webkit: representative, firefox: representative };

await mkdir(output, { recursive: true });
for (const [relativePath, expected] of Object.entries(approvedHashes)) {
  const actual = createHash("sha256").update(await readFile(new URL(`../../${relativePath}`, import.meta.url))).digest("hex");
  fail(actual !== expected, `approved S4 R3 artifact changed: ${relativePath} expected ${expected}, got ${actual}`);
}

const routeSources = ["NewAgeLeadership.tsx"];
const clearedSources = ["Index.tsx", "Blog.tsx", "BlogPost.tsx", "Answers.tsx", "Answer.tsx", "AiBrainLocked.tsx", "AiGtm.tsx"];
for (const source of routeSources) {
  const code = await readFile(new URL(`../../src/pages/${source}`, import.meta.url), "utf8");
  fail(!code.includes("CommercialDecisionBalance"), `${source}: approved production adapter is missing`);
  fail(code.includes("CommercialProofglass"), `${source}: superseded S3 adapter is still mounted`);
}
for (const source of clearedSources) {
  const code = await readFile(new URL(`../../src/pages/${source}`, import.meta.url), "utf8");
  fail(code.includes("CommercialDecisionBalance"), `${source}: the Decision Balance is mounted outside /new-age-leadership`);
}

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const { render: renderSsr } = await server.ssrLoadModule("/src/entry-server.tsx");

for (const [path, context] of routes) {
  const html = renderSsr(path);
  fail((html.match(/class="mm-decision-balance"/g) || []).length !== 1, `${path}: SSR must contain exactly one Decision Balance`);
  fail(html.includes("class=\"mm-proofglass\""), `${path}: SSR still emits superseded Proofglass`);
  fail(!html.includes(`data-context="${context}"`), `${path}: SSR context is not ${context}`);
  fail(!html.includes("Build one useful AI system on real work."), `${path}: approved offer heading is missing`);
  fail(!html.includes("Get a first decision record before email"), `${path}: pre-email action consequence is missing`);
  fail(!html.includes("Scope, duration and fee are agreed privately in writing before work starts."), `${path}: private commercial boundary is missing`);
  fail(!html.includes("One real decision or capability."), `${path}: no-JavaScript proof sequence is missing`);
  const videos = html.match(/<video[^>]*class="mm-decision-balance-film"[^>]*>/g) || [];
  fail(videos.length !== 2, `${path}: SSR expected two policy-switched video nodes, saw ${videos.length}`);
  fail(videos.some((video) => !video.includes("poster=")), `${path}: an SSR film has no poster`);
  fail(videos.some((video) => /\ssrc=/.test(video)), `${path}: SSR emitted moving media before policy checks`);
}

for (const path of removedRoutes) {
  const html = renderSsr(path);
  fail(html.includes("mm-decision-balance"), `${path}: SSR still renders the Decision Balance outside /new-age-leadership`);
  fail(html.includes("Build one useful AI system on real work."), `${path}: the approved offer heading survives outside /new-age-leadership`);
}

async function prepare(page, { consent = true } = {}) {
  await page.addInitScript(({ accept }) => {
    sessionStorage.removeItem("mindmake-decision-balance-stage");
    sessionStorage.removeItem("mindmake-decision-balance-input");
    sessionStorage.removeItem("mindmake-decision-balance-complete");
    if (accept) localStorage.setItem("mindmake_consent", "accepted");
    else localStorage.removeItem("mindmake_consent");
  }, { accept: consent });
}

async function settle(page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function load(page, path = "/new-age-leadership", options = {}) {
  await prepare(page, options);
  await page.goto(origin + path, { waitUntil: "domcontentloaded" });
  await page.locator(".mm-decision-balance").waitFor({ state: "attached" });
  // WebKit can finish font and upstream film layout after DOMContentLoaded.
  // Anchor only after that work, then re-assert the semantic surface edge so
  // the cold-state measurement cannot accidentally describe a later scroll
  // stage. This mirrors how a visitor reaches the surface after page settle.
  await settle(page);
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const root = document.querySelector(".mm-decision-balance");
      if (root) scrollTo(0, scrollY + root.getBoundingClientRect().top);
    });
    await settle(page);
  }
}

async function state(page) {
  return page.evaluate(() => {
    const root = document.querySelector(".mm-decision-balance");
    const q = (selector) => root?.querySelector(selector);
    const rect = (selector, scope = root) => scope?.querySelector(selector)?.getBoundingClientRect().toJSON();
    const visible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const box = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02 && box.width > .5 && box.height > .5;
    };
    const targetViolations = [...(root?.querySelectorAll("a,button,input,textarea") || [])]
      .filter(visible)
      .map((element) => ({ text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0,60), box: element.getBoundingClientRect().toJSON(), type: element.getAttribute("type") }))
      .filter(({ box, type }) => type !== "range" && (box.width < 43.5 || box.height < 43.5));
    const textViolations = [];
    const textSelectors = [
      ".mm-decision-balance-offer h2", ".mm-decision-balance-lede", ".mm-decision-balance-contract", ".mm-decision-balance-boundary",
      ".mm-decision-balance-heading h3", ".mm-decision-balance-heading p", ".mm-decision-balance-assembly .pan", ".mm-decision-balance-stages button",
      ".mm-decision-balance-dialog-input h2", ".mm-decision-balance-dialog-result h2", ".mm-decision-balance-dialog-result dd",
    ];
    for (const element of root?.querySelectorAll(textSelectors.join(",")) || []) {
      if (!visible(element)) continue;
      const boundary = element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      for (const line of range.getClientRects()) {
        if (line.width < .5 || line.height < .5) continue;
        if (line.left < boundary.left - 8 || line.right > boundary.right + 8 || line.top < boundary.top - 8 || line.bottom > boundary.bottom + 8) {
          textViolations.push({ text: element.textContent.trim().slice(0,70), line: line.toJSON(), boundary: boundary.toJSON() });
        }
      }
    }
    const videos = [...(root?.querySelectorAll("video") || [])];
    const brand = document.querySelector(".mm-header .mm-brand")?.getBoundingClientRect().toJSON();
    const heading = rect(".mm-decision-balance-offer h2");
    const header = document.querySelector(".mm-header")?.getBoundingClientRect().toJSON();
    const cookie = document.querySelector(".mm-cookie-notice")?.getBoundingClientRect().toJSON();
    const start = rect(".mm-decision-balance-start");
    const stages = rect(".mm-decision-balance-stages");
    const shell = rect(".mm-decision-balance-shell");
    const offer = rect(".mm-decision-balance-offer");
    const instrument = rect(".mm-decision-balance-instrument");
    const overlaps = (a, b) => Boolean(a && b && a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top);
    return {
      count: document.querySelectorAll(".mm-decision-balance").length,
      oldCount: document.querySelectorAll(".mm-proofglass").length,
      context: root?.getAttribute("data-context"),
      compact: matchMedia("(max-width: 860px)").matches,
      viewport: { width: innerWidth, height: innerHeight },
      documentX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rootX: root ? root.scrollWidth - root.clientWidth : -1,
      root: root?.getBoundingClientRect().toJSON(), shell, offer, instrument, header, brand, heading, start, stages, cookie,
      alignment: brand && heading ? Math.abs(brand.left - heading.left) : null,
      cookieOverlapsStart: overlaps(cookie, start),
      cookieOverlapsStages: overlaps(cookie, stages),
      targetViolations,
      textViolations,
      stage: Number(q('.mm-decision-balance-stages button[aria-pressed="true"]')?.getAttribute("data-balance-stage")),
      posters: videos.map((video) => video.getAttribute("poster") || ""),
      sources: videos.map((video) => ({ src: video.getAttribute("src") || "", currentSrc: video.currentSrc || "", paused: video.paused })),
      cookieVisible: Boolean(cookie),
    };
  });
}

function assess(value, label, context, { fit = true } = {}) {
  fail(value.count !== 1, `${label}: expected one Decision Balance, saw ${value.count}`);
  fail(value.oldCount !== 0, `${label}: superseded Proofglass still rendered`);
  fail(context && value.context !== context, `${label}: expected ${context} context, saw ${value.context}`);
  fail(value.documentX > 1, `${label}: horizontal document overflow ${value.documentX}`);
  fail(value.rootX > 1, `${label}: horizontal component overflow ${value.rootX}`);
  fail(!value.root || !value.shell || !value.offer || !value.instrument || !value.header || !value.brand || !value.heading || !value.start || !value.stages, `${label}: required geometry is missing`);
  fail(value.alignment === null || value.alignment > 1.5, `${label}: logo/content alignment drift ${value.alignment}px`);
  fail(value.targetViolations.length > 0, `${label}: undersized controls ${JSON.stringify(value.targetViolations.slice(0,5))}`);
  fail(value.textViolations.length > 0, `${label}: clipped or escaping text ${JSON.stringify(value.textViolations.slice(0,3))}`);
  fail(value.posters.length !== 2 || value.posters.some((poster) => !poster.includes("ready-for-decision")), `${label}: approved posters are missing ${JSON.stringify(value.posters)}`);
  fail(value.cookieOverlapsStart || value.cookieOverlapsStages, `${label}: consent notice overlaps a primary control`);
  if (fit && !value.compact) {
    fail(value.shell.top < value.header.bottom - 1.5, `${label}: surface begins beneath fixed header (${value.shell.top} < ${value.header.bottom})`);
    fail(value.shell.bottom > value.viewport.height + 1.5, `${label}: desktop shell exceeds viewport (${value.shell.bottom} > ${value.viewport.height})`);
    fail(value.start.bottom > value.shell.bottom - 10, `${label}: primary action has no safe bottom reserve (${value.start.bottom}/${value.shell.bottom})`);
    fail(value.stages.bottom > value.shell.bottom - 8, `${label}: proof stages have no safe bottom reserve (${value.stages.bottom}/${value.shell.bottom})`);
  }
}

async function scrollStage(page, stage) {
  await page.evaluate((next) => {
    const root = document.querySelector(".mm-decision-balance");
    if (!root) return;
    const top = scrollY + root.getBoundingClientRect().top;
    const travel = Math.max(root.offsetHeight - innerHeight, 1);
    scrollTo(0, top + travel * (next / 4));
  }, stage);
  await settle(page);
}

async function exercise(page, browserName, width, height, path = "/new-age-leadership", context = "leadership") {
  const label = `${browserName} ${width}x${height} ${path}`;
  await load(page, path);
  const cold = await state(page);
  assess(cold, `${label} cold`, context);

  if (browserName === "chromium" && path === "/new-age-leadership" && [[390,844],[844,390],[1280,720],[1475,730],[1538,636],[1920,1080]].some(([w,h]) => w === width && h === height)) {
    await page.screenshot({ path: `${output}/${browserName}-${width}x${height}-cold.png`, fullPage: false });
  }

  if (cold.compact) {
    const final = page.locator('[data-balance-stage="4"]');
    await final.click();
    await settle(page);
    fail((await state(page)).stage !== 4, `${label}: mobile final reading did not activate`);
    await final.press("Home");
    await settle(page);
    fail((await state(page)).stage !== 0, `${label}: mobile keyboard recovery did not return to the first reading`);
  } else {
    await scrollStage(page, 4);
    fail((await state(page)).stage !== 4, `${label}: causal scroll did not reach the final reading`);
    await scrollStage(page, 0);
    fail((await state(page)).stage !== 0, `${label}: reverse scroll did not recover the first reading`);
  }

  const shouldExerciseDialog = ["390x844", "844x390", "1280x720", "1475x730"].includes(`${width}x${height}`);
  if (shouldExerciseDialog) {
    const start = page.locator(".mm-decision-balance-start");
    await start.scrollIntoViewIfNeeded();
    await settle(page);
    const before = await page.evaluate(() => ({ x: scrollX, y: scrollY, anchorTop: document.querySelector(".mm-decision-balance")?.getBoundingClientRect().top || 0, shellX: document.querySelector(".mm-decision-balance-shell")?.scrollLeft || 0, shellY: document.querySelector(".mm-decision-balance-shell")?.scrollTop || 0 }));
    await start.click({ force: true });
    const dialog = page.locator(".mm-decision-balance-dialog");
    fail(!(await dialog.evaluate((node) => node.open)), `${label}: Start here did not open the decision record`);
    const textarea = dialog.locator("textarea");
    fail(!(await textarea.evaluate((node) => node === document.activeElement)), `${label}: decision field did not receive focus`);
    await dialog.locator(".mm-decision-balance-frame").click();
    fail(!(await dialog.locator(".mm-decision-balance-error").isVisible()), `${label}: empty decision has no visible recovery`);
    fail((await textarea.getAttribute("aria-invalid")) !== "true", `${label}: empty decision is not exposed as invalid`);
    await textarea.fill("Decide whether to build or partner");
    // The real interaction includes typing time. Allow the intentional focus
    // recovery from the empty submission to finish before asserting the next
    // click; Firefox otherwise sees the button move during that recovery.
    await settle(page);
    await dialog.locator(".mm-decision-balance-frame").click();
    await dialog.locator(".mm-decision-balance-dialog-result").waitFor({ state: "visible" });
    const resultText = await dialog.locator(".mm-decision-balance-dialog-result").innerText();
    fail((await dialog.locator("dt").count()) !== 6, `${label}: decision record does not expose all six fields`);
    fail(!resultText.includes("credible build, buy and hybrid paths"), `${label}: build-or-partner branch is not specific`);
    fail(!resultText.includes("Nothing has been sent"), `${label}: pre-email consequence is missing`);
    await dialog.getByRole("button", { name: "Close Start here" }).click();
    await settle(page);
    const afterClose = await page.evaluate(() => ({ x: scrollX, y: scrollY, anchorTop: document.querySelector(".mm-decision-balance")?.getBoundingClientRect().top || 0, shellX: document.querySelector(".mm-decision-balance-shell")?.scrollLeft || 0, shellY: document.querySelector(".mm-decision-balance-shell")?.scrollTop || 0 }));
    fail(Math.abs(before.x - afterClose.x) > 1 || Math.abs(before.anchorTop - afterClose.anchorTop) > 1 || Math.abs(before.shellX - afterClose.shellX) > 1 || Math.abs(before.shellY - afterClose.shellY) > 1, `${label}: closing the record changed the visitor's visible content anchor ${JSON.stringify({ before, afterClose })}`);
    await start.click({ force: true });
    await dialog.locator(".mm-decision-balance-dialog-result").waitFor({ state: "visible" });
    await dialog.getByRole("button", { name: "Change decision" }).click();
    fail(!(await textarea.evaluate((node) => node === document.activeElement)), `${label}: Change decision did not return focus to the field`);
    await dialog.getByRole("button", { name: "Close Start here" }).click();
    await settle(page);
    const afterChange = await page.evaluate(() => ({ x: scrollX, y: scrollY, anchorTop: document.querySelector(".mm-decision-balance")?.getBoundingClientRect().top || 0 }));
    fail(Math.abs(before.x - afterChange.x) > 1 || Math.abs(before.anchorTop - afterChange.anchorTop) > 1, `${label}: change/close did not recover the visitor's visible content anchor`);
    await start.click({ force: true });
    await textarea.fill("Decide whether to build or partner");
    await dialog.locator(".mm-decision-balance-frame").click();
    await dialog.getByRole("button", { name: /Keep this and continue/ }).click();
    const brief = page.locator('.mm-brief-panel[role="dialog"]');
    await brief.waitFor({ state: "visible", timeout: 5000 });
    await page.waitForFunction(() => {
      const panel = document.querySelector('.mm-brief-panel[role="dialog"]');
      return Boolean(panel && panel.contains(document.activeElement));
    }, undefined, { timeout: 2500 });
    fail(!(await brief.evaluate((panel) => panel.contains(document.activeElement))), `${label}: private-brief handoff did not transfer focus into the new dialog`);
  }

  observations.push({ browser: browserName, viewport: `${width}x${height}`, route: path, action: "approved balance → reversible proof → decision record", expected: "complete, fitted and recoverable", observed: "pass", evidence: cold });
}

async function runMatrix(launcher, browserName, viewports) {
  const browser = await launcher.launch({ headless: true, ...(browserName === "chromium" ? { channel: "chrome" } : {}) });
  try {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 860 });
      const page = await context.newPage();
      try { await exercise(page, browserName, width, height); }
      catch (error) { failures.push(`${browserName} ${width}x${height}: ${error.stack || error.message}`); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); }
}

async function routeSweep() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const [path, contextName] of routes) {
      for (const [width, height] of [[390,844],[1280,720]]) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 860 });
        const page = await context.newPage();
        try {
          await load(page, path);
          const value = await state(page);
          assess(value, `route sweep ${width}x${height} ${path}`, contextName);
          observations.push({ browser: "chromium", viewport: `${width}x${height}`, route: path, action: "production insertion", expected: "one approved surface", observed: "pass", evidence: value });
        } catch (error) { failures.push(`route sweep ${width}x${height} ${path}: ${error.stack || error.message}`); }
        finally { await context.close(); }
      }
    }
  } finally { await browser.close(); }
}

async function constrainedModes() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const mode of ["reduced-motion", "save-data", "200%-text", "media-failure", "first-visit-desktop", "first-visit-mobile"]) {
      const mobile = mode === "first-visit-mobile";
      const context = await browser.newContext({ viewport: mobile ? { width: 390, height: 844 } : { width: 1280, height: 720 }, reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference" });
      if (mode === "save-data") await context.addInitScript(() => Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } }));
      const page = await context.newPage();
      if (mode === "media-failure") await page.route("**/*.mp4", (route) => route.abort("failed"));
      try {
        const firstVisit = mode.startsWith("first-visit");
        await load(page, "/new-age-leadership", { consent: !firstVisit });
        if (mode === "200%-text") {
          await page.evaluate(() => { document.documentElement.dataset.textScale = "200"; });
          await settle(page);
        }
        if (firstVisit) {
          await page.waitForSelector(".mm-cookie-notice", { state: "visible" });
          await settle(page);
        }
        const value = await state(page);
        assess(value, mode, "leadership", { fit: mode !== "200%-text" });
        if (["reduced-motion", "save-data", "200%-text"].includes(mode)) {
          const unsafe = mode === "200%-text"
            ? value.sources.some((video) => Boolean(video.src) || video.paused !== true)
            : value.sources.some((video) => Boolean(video.src || video.currentSrc) || video.paused !== true);
          fail(unsafe, `${mode}: moving media remained attached or playing ${JSON.stringify(value.sources)}`);
        }
        if (mode === "media-failure") fail(value.posters.some((poster) => !poster.includes("ready-for-decision")), "media-failure: poster recovery disappeared");
        observations.push({ browser: "chromium", viewport: mobile ? "390x844" : "1280x720", route: "/new-age-leadership", action: mode, expected: "constraint-safe", observed: "pass", evidence: value });
      } catch (error) { failures.push(`${mode}: ${error.stack || error.message}`); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); }
}

try {
  await runMatrix(chromium, "chromium", matrices.chromium);
  await runMatrix(webkit, "webkit", matrices.webkit);
  await runMatrix(firefox, "firefox", matrices.firefox);
  if (!fastBrowser) {
    await routeSweep();
    await constrainedModes();
  }
} finally {
  await server.close();
}

const report = {
  artifact: "COMMERCIAL-READINESS-S4-R3 production integration",
  origin,
  approvedHashes,
  matrices,
  routeInsertions: routes.map(([path, context]) => ({ path, context })),
  observations,
  evidence: output,
  physicalDevices: "not run",
  failures,
};
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ artifact: report.artifact, origin, matrices, routeInsertions: routes.length, observations: observations.length, evidence: output, physicalDevices: report.physicalDevices, failures }, null, 2));
if (failures.length) process.exitCode = 1;
