#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = "C:/Users/krish/.scratch/mindmake-commercial-continuity-production";
const failures = [];
const observations = [];
const executed = { chromium: 0, webkit: 0, firefox: 0 };
const fail = (condition, message) => { if (condition) failures.push(message); };

const baselineHashes = {
  "prototypes/website-redesign-recovery/commercial-continuity/index.html": "954957d47b699a415fa373843496e05bdc7a288525d0fae1d3d827fc9cc5daa2",
  "prototypes/website-redesign-recovery/commercial-continuity/styles.css": "c5d4ec541347c5a9a6cb98bc10f4ee84f377fd270b45306e141b6369a14fb41e",
  "prototypes/website-redesign-recovery/commercial-continuity/script.js": "21361d27b0d966b0f18f5861d5d4d429a8d71bff397e3ef01fa734f014c4b881",
  "prototypes/website-redesign-recovery/commercial-continuity/review.html": "cc567650f0e0e25bdad6bde8c7991565a56c4e36c48c8bfc1f7ea2e3b707aeee",
  "prototypes/website-redesign-recovery/commercial-continuity/check.mjs": "6c6fed97864e28fc9fafd2a177669773504bf58743c40468eb77638b2d95b1b2",
};

const routes = [
  { path: "/new-age-leadership", context: "leadership", film: "ready-for-decision" },
  { path: "/blog", context: "editorial", film: "communications-compose" },
  { path: "/blog/a-useful-first-30-days-building-with-ai", context: "editorial", film: "communications-compose" },
  { path: "/answers", context: "editorial", film: "communications-compose" },
  { path: "/answers/ai-decision-tool-trustworthy-leadership-team", context: "editorial", film: "communications-compose" },
  { path: "/ai-brain", context: "brain", film: "evidence-connects" },
  { path: "/ai-gtm", context: "gtm", film: "quiet-workshop-growth" },
];

const required = [[320, 568], [360, 800], [390, 844], [430, 932], [768, 1024], [844, 390], [1024, 768], [1280, 800], [1440, 700], [1440, 900], [1920, 1080]];
const representative = [[320, 568], [390, 844], [844, 390], [1024, 768], [1440, 700], [1440, 900]];
const fastBrowser = process.env.COMMERCIAL_QA_FAST;
const policyOnly = process.env.COMMERCIAL_QA_POLICY_ONLY === "1";
const fastViewport = (process.env.COMMERCIAL_QA_VIEWPORT || "390x844").split("x").map(Number);
const matrix = policyOnly ? { chromium: [], webkit: [], firefox: [] } : fastBrowser ? {
  chromium: fastBrowser === "1" || fastBrowser === "chromium" ? [fastViewport] : [],
  webkit: fastBrowser === "webkit" ? [fastViewport] : [],
  firefox: fastBrowser === "firefox" ? [fastViewport] : [],
} : { chromium: required, webkit: representative, firefox: representative };

await mkdir(output, { recursive: true });
for (const [relativePath, expected] of Object.entries(baselineHashes)) {
  const actual = createHash("sha256").update(await readFile(new URL(`../../${relativePath}`, import.meta.url))).digest("hex");
  fail(actual !== expected, `locked COMMERCIAL-CONTINUITY-S1 baseline changed: ${relativePath} expected ${expected}, got ${actual}`);
}

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const { render: renderSsr } = await server.ssrLoadModule("/src/entry-server.tsx");

for (const route of routes) {
  const html = renderSsr(route.path);
  const count = html.match(/class="mm-commercial"/g)?.length ?? 0;
  fail(count !== 1, `${route.path}: SSR must contain exactly one commercial surface, saw ${count}`);
  fail(!html.includes(`data-context="${route.context}"`), `${route.path}: SSR context is not ${route.context}`);
  const video = html.match(/<video[^>]*data-commercial-video="true"[^>]*><\/video>/)?.[0] ?? "";
  fail(!video.includes("poster="), `${route.path}: SSR video is not poster-backed`);
  fail(/\ssrc=/.test(video), `${route.path}: SSR emitted a moving source for no-JavaScript visitors`);
}

const settle = async (page) => {
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
};

const scrollToCommercial = async (page) => {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    await page.evaluate(() => {
      const element = document.querySelector(".mm-commercial");
      if (!element) return;
      document.documentElement.style.scrollBehavior = "auto";
      const headerBottom = document.querySelector(".mm-header")?.getBoundingClientRect().bottom ?? 0;
      const portraitMobile = innerWidth <= 860 && innerHeight > 520;
      const intendedTop = portraitMobile ? 0 : headerBottom;
      scrollBy(0, element.getBoundingClientRect().top - intendedTop);
    });
    await settle(page);
  }
};

const geometry = async (page) => page.evaluate(() => {
  const root = document.querySelector(".mm-commercial");
  const surface = root?.querySelector(".mm-commercial-surface");
  const content = root?.querySelector(".mm-commercial-content");
  const visible = (element) => {
    if (!element || element.hidden) return false;
    const style = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > 0.5 && rect.height > 0.5;
  };
  const inside = (inner, outer, tolerance = 2) => inner.left >= outer.left - tolerance
    && inner.right <= outer.right + tolerance
    && inner.top >= outer.top - tolerance
    && inner.bottom <= outer.bottom + tolerance;
  const textViolations = [];
  if (content) {
    const boundary = content.getBoundingClientRect();
    for (const text of content.querySelectorAll("h2,h3,p,strong,span,a,button")) {
      if (!visible(text) || text.children.length) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      for (const rect of range.getClientRects()) {
        if (rect.width < 0.5 || rect.height < 0.5) continue;
        if (!inside(rect, boundary)) textViolations.push({ text: text.textContent.trim().slice(0, 60), rect: rect.toJSON(), boundary: boundary.toJSON() });
      }
    }
  }
  const targets = [...(root?.querySelectorAll("a,button") ?? [])]
    .filter(visible)
    .map((element) => ({ text: (element.textContent || element.getAttribute("aria-label") || "").trim().slice(0, 50), rect: element.getBoundingClientRect() }))
    .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
    .map(({ text, rect }) => ({ text, width: rect.width, height: rect.height }));
  const start = root?.querySelector(".mm-commercial-start")?.getBoundingClientRect();
  const filmState = root?.querySelector(".mm-commercial-film-state");
  const video = root?.querySelector("video");
  const p = Number.parseFloat(surface?.style.getPropertyValue("--commercial-p") || "0");
  return {
    context: root?.getAttribute("data-context"),
    count: document.querySelectorAll(".mm-commercial").length,
    width: innerWidth,
    height: innerHeight,
    documentX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    surface: surface?.getBoundingClientRect().toJSON(),
    content: content?.getBoundingClientRect().toJSON(),
    start: start?.toJSON(),
    startVisible: start ? start.top >= -1 && start.bottom <= innerHeight + 1 : false,
    progress: p,
    textViolations,
    targets,
    filmOpacity: filmState ? Number(getComputedStyle(filmState).opacity) : -1,
    toggleHidden: root?.querySelector("[data-commercial-toggle]")?.hidden,
    motionPolicy: root?.getAttribute("data-motion-policy"),
    videoSrc: video?.getAttribute("src") || "",
    currentSrc: video?.currentSrc || "",
    poster: video?.getAttribute("poster") || "",
    videoPaused: video?.paused,
    brainHref: root?.querySelector('a[href="/ai-brain"]')?.getAttribute("href"),
    gtmHref: root?.querySelector('a[href="/ai-gtm"]')?.getAttribute("href"),
    storiesHref: root?.querySelector('a[href="/case-studies"]')?.getAttribute("href"),
    currentDoor: root?.querySelector('.mm-commercial-doors a[aria-current="page"]')?.getAttribute("href") || "",
  };
});

const assessCold = (state, label, route) => {
  const staticLandscape = state.width > state.height && state.height <= 520;
  fail(state.count !== 1, `${label}: expected one commercial surface, saw ${state.count}`);
  fail(state.context !== route.context, `${label}: expected ${route.context} context, saw ${state.context}`);
  fail(state.documentX > 1, `${label}: horizontal document overflow ${state.documentX}`);
  fail(!state.surface || !state.content || !state.start, `${label}: required commercial geometry is missing`);
  fail(state.textViolations.length > 0, `${label}: painted text escapes the proof surface ${JSON.stringify(state.textViolations.slice(0, 3))}`);
  fail(state.targets.length > 0, `${label}: undersized visible controls ${JSON.stringify(state.targets.slice(0, 5))}`);
  if (staticLandscape) {
    fail(state.progress < 0.99, `${label}: compact landscape surface did not resolve to its static state (${state.progress})`);
    fail(state.filmOpacity > 0.05, `${label}: compact landscape film should remain poster-backed (${state.filmOpacity})`);
    fail(!state.toggleHidden, `${label}: compact landscape motion control should be hidden`);
  } else {
    fail(state.progress > 0.08, `${label}: cold surface began at progress ${state.progress}`);
  }
  fail(!state.startVisible, `${label}: Start here is not visible in the cold viewport`);
  fail(state.brainHref !== "/ai-brain" || state.gtmHref !== "/ai-gtm" || state.storiesHref !== "/case-studies", `${label}: one or more commercial routes are missing`);
  const expectedCurrent = route.context === "brain" ? "/ai-brain" : route.context === "gtm" ? "/ai-gtm" : "";
  fail(state.currentDoor !== expectedCurrent, `${label}: expected current door ${expectedCurrent || "none"}, saw ${state.currentDoor || "none"}`);
  const expectedFilm = route.context === "gtm" && staticLandscape ? "signals-arrive" : route.film;
  fail(!state.poster.includes(expectedFilm), `${label}: expected ${expectedFilm} poster, saw ${state.poster}`);
};

async function exercisePage(page, browserName, viewport, route) {
  const [width, height] = viewport;
  const label = `${browserName} ${width}x${height} ${route.path}`;
  await page.goto(origin + route.path, { waitUntil: "domcontentloaded" });
  await page.locator(".mm-commercial").waitFor({ state: "attached" });
  await scrollToCommercial(page);
  const cold = await geometry(page);
  const coldFailureCount = failures.length;
  assessCold(cold, label, route);
  if (failures.length > coldFailureCount) {
    await page.screenshot({
      path: `${output}/failure-cold-${browserName}-${width}x${height}-${route.path.replace(/[^a-z0-9]+/gi, "-")}.png`,
      fullPage: false,
    }).catch(() => undefined);
  }

  if (browserName === "chromium" && route.path === "/new-age-leadership" && [[320, 568], [390, 844], [1440, 700], [1440, 900]].some(([w, h]) => w === width && h === height)) {
    await page.screenshot({ path: `${output}/${browserName}-${width}x${height}-cold.png`, fullPage: false });
  }

  if (width > 860 && height > 520) {
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      const headerBottom = document.querySelector(".mm-header")?.getBoundingClientRect().bottom ?? 0;
      scrollBy(0, Math.max(280, innerHeight * 0.66) + headerBottom);
    });
    await settle(page);
    const built = await geometry(page);
    fail(built.progress < 0.9, `${label}: built progress stopped at ${built.progress}`);
    fail(built.filmOpacity > 0.05, `${label}: film annotation remains visible at built progress (${built.filmOpacity})`);
    fail(built.toggleHidden !== true, `${label}: film control remains present under the built proof sheet`);
    if (browserName === "chromium" && route.path === "/new-age-leadership" && width === 1440 && height === 900) {
      await page.screenshot({ path: `${output}/${browserName}-${width}x${height}-built.png`, fullPage: false });
    }
    await scrollToCommercial(page);
    const reversed = await geometry(page);
    fail(reversed.progress > 0.08, `${label}: reverse scroll did not restore cold progress (${reversed.progress})`);
    fail(reversed.filmOpacity < 0.9, `${label}: reverse scroll did not restore the film annotation (${reversed.filmOpacity})`);
  }

  await page.locator(".mm-commercial-start").click();
  await page.locator('.mm-brief-panel[role="dialog"]').waitFor({ state: "visible", timeout: 5000 });
  const clippedProgressLabels = await page.locator(".mm-brief-path button").evaluateAll((buttons) => buttons
    .filter((button) => button.scrollWidth > button.clientWidth + 1)
    .map((button) => ({ label: button.textContent?.trim(), clientWidth: button.clientWidth, scrollWidth: button.scrollWidth })));
  fail(clippedProgressLabels.length > 0, `${label}: Start-here progress labels clip ${JSON.stringify(clippedProgressLabels)}`);
  observations.push({ browser: browserName, viewport: `${width}x${height}`, route: route.path, cold, action: "Start here opened the real LeadBrief" });
}

async function verifyDesktopReflow() {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  try {
    for (const path of ["/ai-brain", "/blog"]) {
      const context = await browser.newContext({ viewport: { width: 512, height: 384 }, hasTouch: false, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
      const label = `chromium desktop fine-pointer 512x384 ${path} 200% reflow`;
      try {
        await page.goto(origin + path, { waitUntil: "domcontentloaded" });
        await page.locator(".mm-commercial-contract").scrollIntoViewIfNeeded();
        await settle(page);
        const state = await page.locator(".mm-commercial-contract").evaluate((element) => {
          const paragraph = element.querySelector("p");
          const contract = element.getBoundingClientRect();
          const paragraphRect = paragraph?.getBoundingClientRect();
          return {
            documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
            contract: contract.toJSON(),
            paragraph: paragraphRect?.toJSON(),
            paragraphClientWidth: paragraph?.clientWidth ?? -1,
            paragraphScrollWidth: paragraph?.scrollWidth ?? -1,
          };
        });
        fail(state.documentOverflow > 1, `${label}: horizontal document overflow ${state.documentOverflow}`);
        fail(!state.paragraph || state.paragraph.width < 180, `${label}: proof paragraph collapsed (${JSON.stringify(state)})`);
        fail(state.paragraphClientWidth < 0 || state.paragraphScrollWidth > state.paragraphClientWidth + 2, `${label}: proof paragraph clips (${JSON.stringify(state)})`);
        fail(state.contract.left < -1 || state.contract.right > 513, `${label}: contract escapes viewport (${JSON.stringify(state)})`);
        observations.push({ browser: "chromium", viewport: "512x384 fine-pointer reflow", route: path, action: "shared commercial proof remains full-width and readable", state });
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

for (const [browserName, launcher] of Object.entries({ chromium, webkit, firefox })) {
  if (!matrix[browserName].length) continue;
  const browser = await launcher.launch({ headless: true, ...(browserName === "chromium" ? { channel: "chrome" } : {}) });
  for (const viewport of matrix[browserName]) {
    const [width, height] = viewport;
    for (const route of routes) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: "no-preference" });
      const page = await context.newPage();
      await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
      page.on("pageerror", (error) => failures.push(`${browserName} ${width}x${height} ${route.path}: page error ${error.message}`));
      try {
        await exercisePage(page, browserName, viewport, route);
      } catch (error) {
        const label = `${browserName} ${width}x${height} ${route.path}`;
        const message = error instanceof Error ? error.message : String(error);
        failures.push(`${label}: interaction exercise failed: ${message}`);
        observations.push({
          browser: browserName,
          viewport: `${width}x${height}`,
          route: route.path,
          action: "interaction exercise failed",
          error: message,
          url: page.url(),
        });
        await page.screenshot({
          path: `${output}/failure-${browserName}-${width}x${height}-${route.path.replace(/[^a-z0-9]+/gi, "-")}.png`,
          fullPage: false,
        }).catch(() => undefined);
      }
      executed[browserName] += 1;
      await context.close();
    }
  }
  await browser.close();
}

if (!policyOnly) await verifyDesktopReflow();

async function policyCheck(name, init, options = {}) {
  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, ...options });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  if (init) await page.addInitScript(init);
  await page.goto(origin + "/new-age-leadership", { waitUntil: "domcontentloaded" });
  await page.locator(".mm-commercial").waitFor({ state: "attached" });
  await scrollToCommercial(page);
  await page.waitForTimeout(120);
  const state = await geometry(page);
  fail(Boolean(state.videoSrc || state.currentSrc), `${name}: moving source attached despite constrained policy`);
  fail(state.motionPolicy !== "poster", `${name}: expected poster policy, saw ${state.motionPolicy}`);
  observations.push({ policy: name, state });
  await context.close();
  await browser.close();
}

if (!fastBrowser) {
  await policyCheck("reduced motion", null, { reducedMotion: "reduce" });
  await policyCheck("Save Data", () => {
    const connection = new EventTarget();
    Object.defineProperty(connection, "saveData", { value: true });
    Object.defineProperty(navigator, "connection", { configurable: true, value: connection });
  });

  const browser = await chromium.launch({ headless: true, channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  await page.route("**/*.mp4", (route) => route.abort("failed"));
  await page.goto(origin + "/new-age-leadership", { waitUntil: "domcontentloaded" });
  await page.locator(".mm-commercial").waitFor({ state: "attached" });
  await scrollToCommercial(page);
  await page.waitForFunction(
    () => document.querySelector(".mm-commercial")?.getAttribute("data-motion-policy") === "unavailable",
    null,
    { timeout: 5000 },
  ).catch(() => undefined);
  const unavailable = await geometry(page);
  fail(unavailable.motionPolicy !== "unavailable", `unavailable media: expected unavailable policy, saw ${unavailable.motionPolicy}`);
  fail(!unavailable.poster.includes("ready-for-decision"), "unavailable media: poster fallback disappeared");
  fail(Boolean(unavailable.videoSrc), "unavailable media: failed moving source was not retired");
  observations.push({ policy: "unavailable media", state: unavailable });
  await context.close();
  await browser.close();

  for (const [width, height] of [[390, 844], [1440, 700]]) {
    const chrome = await chromium.launch({ headless: true, channel: "chrome" });
    const chromeContext = await chrome.newContext({ viewport: { width, height } });
    const chromePage = await chromeContext.newPage();
    await chromePage.goto(origin + "/new-age-leadership", { waitUntil: "domcontentloaded" });
    await chromePage.locator(".mm-commercial").waitFor({ state: "attached" });
    await scrollToCommercial(chromePage);
    const overlap = await chromePage.evaluate(() => {
      const notice = document.querySelector(".mm-cookie-notice")?.getBoundingClientRect();
      const controls = [...document.querySelectorAll(".mm-commercial a,.mm-commercial button")]
        .filter((element) => {
          const style = getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return !element.hidden && style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.02 && rect.width > 0 && rect.height > 0;
        })
        .map((element) => ({ text: element.textContent.trim().slice(0, 40), rect: element.getBoundingClientRect().toJSON() }));
      const collisions = notice ? controls.filter(({ rect }) => Math.min(rect.right, notice.right) - Math.max(rect.left, notice.left) > 0.5 && Math.min(rect.bottom, notice.bottom) - Math.max(rect.top, notice.top) > 0.5) : [];
      return { notice: notice?.toJSON(), controls, collisions };
    });
    fail(overlap.collisions.length > 0, `cookie chrome ${width}x${height}: overlaps commercial controls ${JSON.stringify(overlap.collisions)}`);
    observations.push({ policy: "cookie chrome", viewport: `${width}x${height}`, overlap });
    await chromeContext.close();
    await chrome.close();
  }
}

await server.close();
const report = { artifact: "mindmake-commercial-continuity-production", origin, executed, observations, failures };
await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ artifact: report.artifact, origin, executed, observations: observations.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
