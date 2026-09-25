#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = "C:/Users/krish/.scratch/mindmake-commercial-proofglass-production";
const failures = [];
const observations = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

const approvedHashes = {
  "prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s3.html": "03673392bb4d9b0419f32e9eea13cd06d17925a9a3c63e462ead4239a5abe232",
  "prototypes/website-redesign-recovery/commercial-continuity/styles-readiness-s3.css": "9a17d3f1dec6c92933fb5e7ae09ed53c7b06b8e22788a2434e3b525912a90325",
  "prototypes/website-redesign-recovery/commercial-continuity/script-readiness-s3.js": "5ee1c8cc99e9d379b2104d6d13c8ba154118f86cf082cda6ff06d52c720d2d0e",
  "prototypes/website-redesign-recovery/commercial-continuity/review-readiness-s3.html": "2e6949238fb3b91d9e3d3786d6f672629ca073ee593561c13fa360fd967687e4",
  "prototypes/website-redesign-recovery/commercial-continuity/check-readiness-s3.mjs": "13721855997e9bfa61fca169849f2a5a98369d138a1385b0352da88b2195734e",
};

const routes = [
  ["/new-age-leadership", "leadership"],
  ["/blog", "editorial"],
  ["/blog/a-useful-first-30-days-building-with-ai", "editorial"],
  ["/answers/ai-decision-tool-trustworthy-leadership-team", "editorial"],
  ["/ai-brain", "brain"],
  ["/ai-gtm", "gtm"],
];

const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1440,700],[1440,900]];
const fastBrowser = process.env.PROOFGLASS_QA_FAST;
const policyOnly = process.env.PROOFGLASS_QA_POLICY_ONLY === "1";
const fastViewport = (process.env.PROOFGLASS_QA_VIEWPORT || "390x844").split("x").map(Number);
const matrices = policyOnly ? { chromium: [], webkit: [], firefox: [] } : fastBrowser ? {
  chromium: fastBrowser === "1" || fastBrowser === "chromium" ? [fastViewport] : [],
  webkit: fastBrowser === "webkit" ? [fastViewport] : [],
  firefox: fastBrowser === "firefox" ? [fastViewport] : [],
} : { chromium: chromiumViewports, webkit: representative, firefox: representative };

await mkdir(output, { recursive: true });
for (const [relativePath, expected] of Object.entries(approvedHashes)) {
  const actual = createHash("sha256").update(await readFile(new URL(`../../${relativePath}`, import.meta.url))).digest("hex");
  fail(actual !== expected, `approved S3 artifact changed: ${relativePath} expected ${expected}, got ${actual}`);
}

const server = await createServer({
  root,
  server: { host: "127.0.0.1", port: 0, strictPort: false },
  logLevel: "error",
});
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const { render: renderSsr } = await server.ssrLoadModule("/src/entry-server.tsx");

for (const [path, context] of routes) {
  const html = renderSsr(path);
  fail((html.match(/class="mm-proofglass"/g) || []).length !== 1, `${path}: SSR must contain exactly one Proofglass surface`);
  fail(!html.includes(`data-context="${context}"`), `${path}: SSR context is not ${context}`);
  fail(!html.includes("Pressure → call → system → judgement → change"), `${path}: causal record spine is missing`);
  fail(!html.includes("Continue to private brief"), `${path}: private-brief handoff is missing`);
  fail((html.match(/data-proof-record=/g) || []).length !== 4, `${path}: expected four client records`);
  const video = html.match(/<video[^>]*class="mm-proofglass-film"[^>]*><\/video>/)?.[0] || "";
  fail(!video.includes("poster="), `${path}: SSR film is not poster-backed`);
  fail(/\ssrc=/.test(video), `${path}: SSR emitted moving media before client policy checks`);
}

async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
}

async function settle(page) {
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

async function load(page, path = "/new-age-leadership") {
  await prepare(page);
  await page.goto(origin + path, { waitUntil: "domcontentloaded" });
  await page.locator(".mm-proofglass").waitFor({ state: "attached" });
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = "auto";
    const root = document.querySelector(".mm-proofglass");
    const header = document.querySelector(".mm-header");
    if (!root) return;
    const compact = matchMedia("(max-width: 860px)").matches;
    const top = scrollY + root.getBoundingClientRect().top - (compact ? 0 : (header?.getBoundingClientRect().height || 0));
    scrollTo(0, top);
  });
  await settle(page);
}

async function state(page) {
  return page.evaluate(() => {
    const root = document.querySelector(".mm-proofglass");
    const stage = root?.querySelector(".mm-proofglass-stage");
    const sheet = root?.querySelector(".mm-proofglass-sheet");
    const visible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > .02 && rect.width > .5 && rect.height > .5;
    };
    const targetViolations = [...(root?.querySelectorAll("a,button,textarea") || [])]
      .filter(visible)
      .map((element) => ({ text: (element.getAttribute("aria-label") || element.textContent || "").trim().slice(0,60), rect: element.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
      .map(({ text, rect }) => ({ text, width: rect.width, height: rect.height }));
    const textViolations = [];
    const selectors = [".mm-proofglass-arrival h2", ".mm-proofglass-offer", ".mm-proofglass-outcome", ".mm-proofglass-result", ".mm-proofglass-stage-grid small", ".mm-proofglass-stage-grid span", ".mm-proofglass-basis blockquote", ".mm-proofglass-basis p", ".mm-proofglass-preflight h2", ".mm-proofglass-preflight dd"];
    for (const element of root?.querySelectorAll(selectors.join(",")) || []) {
      if (!visible(element)) continue;
      const boundary = element.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(element);
      for (const rect of range.getClientRects()) {
        if (rect.width < .5 || rect.height < .5) continue;
        if (rect.left < boundary.left - 8 || rect.right > boundary.right + 8 || rect.top < boundary.top - 8 || rect.bottom > boundary.bottom + 8) {
          textViolations.push({ text: element.textContent.trim().slice(0,60), rect: rect.toJSON(), boundary: boundary.toJSON() });
        }
      }
    }
    const video = root?.querySelector("video");
    const start = root?.querySelector(".mm-proofglass-start");
    const selectedStage = root?.querySelector(".mm-proofglass-record.is-active .mm-proofglass-lens");
    return {
      count: document.querySelectorAll(".mm-proofglass").length,
      context: root?.getAttribute("data-context"),
      documentX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rootX: root ? root.scrollWidth - root.clientWidth : -1,
      root: root?.getBoundingClientRect().toJSON(),
      stage: stage?.getBoundingClientRect().toJSON(),
      sheet: sheet?.getBoundingClientRect().toJSON(),
      sheetTransform: sheet ? getComputedStyle(sheet).transform : "",
      start: start?.getBoundingClientRect().toJSON(),
      targetViolations,
      textViolations,
      stageValue: selectedStage?.getAttribute("aria-valuenow"),
      activeRecord: root?.querySelector(".mm-proofglass-record.is-active")?.getAttribute("data-proof-record"),
      videoSrc: video?.getAttribute("src") || "",
      currentSrc: video?.currentSrc || "",
      videoPaused: video?.paused,
      poster: video?.getAttribute("poster") || "",
      toggleHidden: root?.querySelector(".mm-proofglass-film-toggle")?.hidden,
      compact: matchMedia("(max-width: 860px)").matches,
    };
  });
}

function assess(value, label, context) {
  fail(value.count !== 1, `${label}: expected one Proofglass surface, saw ${value.count}`);
  fail(context && value.context !== context, `${label}: expected ${context} context, saw ${value.context}`);
  fail(value.documentX > 1, `${label}: horizontal document overflow ${value.documentX}`);
  fail(value.rootX > 1, `${label}: horizontal Proofglass overflow ${value.rootX}`);
  fail(!value.root || !value.stage || !value.sheet || !value.start, `${label}: required geometry is missing`);
  fail(value.targetViolations.length > 0, `${label}: undersized controls ${JSON.stringify(value.targetViolations.slice(0,5))}`);
  fail(value.textViolations.length > 0, `${label}: clipped or escaping text ${JSON.stringify(value.textViolations.slice(0,3))}`);
  fail(!value.poster.includes("ready-for-decision"), `${label}: approved poster is missing (${value.poster})`);
}

async function exercise(page, browserName, width, height, path = "/new-age-leadership", context = "leadership") {
  const label = `${browserName} ${width}x${height} ${path}`;
  await load(page, path);
  const cold = await state(page);
  assess(cold, `${label} cold`, context);

  if (browserName === "chromium" && path === "/new-age-leadership" && [[390,844],[844,390],[1440,900]].some(([w,h]) => w === width && h === height)) {
    await page.screenshot({ path: `${output}/${browserName}-${width}x${height}-cold.png`, fullPage: false });
  }

  if (!cold.compact) {
    await page.evaluate(() => {
      const root = document.querySelector(".mm-proofglass");
      if (!root) return;
      const top = scrollY + root.getBoundingClientRect().top;
      const travel = Math.max(root.offsetHeight - innerHeight, 1);
      scrollTo(0, top + travel * .98);
    });
    await settle(page);
    const built = await state(page);
    fail(Number(built.stageValue) < 5, `${label}: causal scroll did not reach recorded change (${built.stageValue})`);
    if (browserName === "chromium" && path === "/new-age-leadership" && width === 1440 && height === 900) {
      await page.screenshot({ path: `${output}/${browserName}-${width}x${height}-built.png`, fullPage: false });
    }
    await load(page, path);
    const reversed = await state(page);
    fail(Number(reversed.stageValue) !== 1, `${label}: reverse scroll did not recover the starting point (${reversed.stageValue})`);
  }

  const chooser = width <= 860 ? page.locator('[data-proof-jump="3"]') : page.locator('[data-proof-record-trigger="3"]');
  await chooser.click();
  await settle(page);
  fail(!(await page.locator('[data-proof-record="3"]').evaluate((node) => node.classList.contains("is-active"))), `${label}: fourth record did not activate`);
  const finalStage = page.locator('[data-proof-record="3"] [data-proof-stage="4"]');
  await finalStage.click();
  await page.waitForFunction(() => document.querySelector('[data-proof-record="3"] [data-proof-stage="4"]')?.getAttribute("aria-selected") === "true");
  fail((await finalStage.getAttribute("aria-selected")) !== "true", `${label}: explicit stage choice was not selected`);
  fail(!(await finalStage.getAttribute("aria-label"))?.includes("Eleven stopped"), `${label}: full stage meaning is not exposed accessibly`);

  await page.locator(".mm-proofglass-start").click();
  const dialog = page.locator(".mm-proofglass-preflight");
  fail(!(await dialog.evaluate((node) => node.open)), `${label}: Start here did not open the preflight`);
  const textarea = dialog.locator("#proofglass-decision");
  fail(!(await textarea.evaluate((node) => node === document.activeElement)), `${label}: preflight did not focus the decision field`);
  await dialog.locator(".mm-proofglass-frame").click();
  fail(!(await dialog.locator("#proofglass-decision-error").isVisible()), `${label}: empty decision has no visible recovery`);
  fail((await textarea.getAttribute("aria-invalid")) !== "true", `${label}: empty decision is not exposed as invalid`);
  await textarea.fill("Decide whether to build or partner");
  await dialog.locator(".mm-proofglass-frame").click();
  await dialog.locator(".mm-proofglass-preflight-result").waitFor({ state: "visible" });
  const resultText = await dialog.locator(".mm-proofglass-preflight-result").innerText();
  fail(!resultText.includes("Compare build, partner and hybrid paths"), `${label}: build-or-partner branch did not produce the specific frame`);
  fail(!resultText.toLowerCase().includes("nothing has been sent"), `${label}: pre-email consequence is missing (${JSON.stringify(resultText)})`);
  await dialog.locator(".mm-proofglass-continue").click();
  await page.locator('.mm-brief-panel[role="dialog"]').waitFor({ state: "visible", timeout: 5000 });
  observations.push({ browser: browserName, viewport: `${width}x${height}`, route: path, action: "Proofglass → framed decision → private brief", result: "pass", cold });
}

async function runMatrix(launcher, browserName, viewports) {
  const browser = await launcher.launch({ headless: true, ...(browserName === "chromium" ? { channel: "chrome" } : {}) });
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 860, isMobile: false });
      const page = await context.newPage();
      try { await exercise(page, browserName, width, height); }
      catch (error) { failures.push(`${browserName} ${width}x${height}: ${error.stack || error.message}`); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); }
}

async function routeInsertionSweep() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const [path, contextName] of routes) {
      for (const [width,height] of [[390,844],[1440,900]]) {
        const context = await browser.newContext({ viewport: { width, height }, hasTouch: width <= 860 });
        const page = await context.newPage();
        try {
          await load(page, path);
          const value = await state(page);
          assess(value, `route sweep ${width}x${height} ${path}`, contextName);
          observations.push({ browser: "chromium", viewport: `${width}x${height}`, route: path, action: "production insertion", result: "pass", state: value });
        } catch (error) { failures.push(`route sweep ${width}x${height} ${path}: ${error.stack || error.message}`); }
        finally { await context.close(); }
      }
    }
  } finally { await browser.close(); }
}

async function constrainedModes() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const mode of ["reduced-motion", "save-data", "200%-text", "media-failure"]) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: mode === "reduced-motion" ? "reduce" : "no-preference" });
      if (mode === "save-data") await context.addInitScript(() => Object.defineProperty(navigator, "connection", { configurable: true, value: { saveData: true } }));
      const page = await context.newPage();
      if (mode === "media-failure") await page.route("**/*.mp4", (route) => route.abort("failed"));
      try {
        await load(page);
        if (mode === "200%-text") {
          await page.evaluate(() => { document.documentElement.dataset.textScale = "200"; });
          await settle(page);
        }
        const value = await state(page);
        assess(value, mode, "leadership");
        if (mode === "reduced-motion" || mode === "save-data" || mode === "200%-text") {
          const movingMediaRemains = mode === "200%-text"
            ? Boolean(value.videoSrc) || value.videoPaused !== true
            : Boolean(value.videoSrc || value.currentSrc) || value.videoPaused !== true;
          fail(movingMediaRemains, `${mode}: moving film remained attached or playing`);
          fail(value.toggleHidden !== true, `${mode}: unusable motion control remained visible`);
        }
        if (mode === "media-failure") fail(!value.poster.includes("ready-for-decision"), "media-failure: poster recovery disappeared");
        observations.push({ browser: "chromium", viewport: "1440x900", route: "/new-age-leadership", action: mode, result: "pass", state: value });
      } catch (error) { failures.push(`${mode}: ${error.stack || error.message}`); }
      finally { await context.close(); }
    }
  } finally { await browser.close(); }
}

try {
  await runMatrix(chromium, "chromium", matrices.chromium);
  await runMatrix(webkit, "webkit", matrices.webkit);
  await runMatrix(firefox, "firefox", matrices.firefox);
  if (!fastBrowser && !policyOnly) {
    await routeInsertionSweep();
  }
  if (!fastBrowser) {
    await constrainedModes();
  }
} finally {
  await server.close();
}

const report = {
  artifact: "COMMERCIAL-READINESS-S3-PROOFGLASS production integration",
  origin,
  matrices,
  routeInsertions: routes.map(([path, context]) => ({ path, context })),
  observations,
  evidence: output,
  physicalDevices: "not run",
  failures,
};
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ artifact: report.artifact, origin, matrices, routeInsertions: report.routeInsertions.length, observations: observations.length, evidence: output, physicalDevices: report.physicalDevices, failures }, null, 2));
if (failures.length) process.exitCode = 1;
