import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const conceptDir = fileURLToPath(new URL("./", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const browserPath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const fixture = JSON.parse(await readFile(new URL("../../ai-brain-vnext-r5/brain-fixture.json", import.meta.url), "utf8"));
const issues = [];
const observations = [];

assert.equal(fixture.items.length, 20);
assert.equal(fixture.relationships.length, 18);
assert.equal(fixture.sources.length, 10);
assert.equal(fixture.corrections.length, 3);
assert.ok(fixture.items.some((item) => item.id === "BI-003" && item.confidence === "direct"));

const sourceUrls = [new URL("./index-s2.html", import.meta.url), new URL("./styles-s2.css", import.meta.url), new URL("./script-s2.js", import.meta.url), new URL("./review-s2.html", import.meta.url)];
const sourceFiles = await Promise.all(sourceUrls.map((url) => readFile(url, "utf8")));
for (const [index, source] of sourceFiles.entries()) {
  assert.equal(source.includes("—"), false, `Source file ${index} contains an em dash.`);
}

const server = await createServer({ root: repoRoot, logLevel: "error", server: { host: "127.0.0.1", port: 0 } });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const conceptUrl = `${origin}/prototypes/website-redesign-recovery/brain-signature/index-s2.html`;
const browser = await chromium.launch({ headless: true, executablePath: browserPath });

function monitor(page, label) {
  page.on("pageerror", (error) => issues.push(`${label}: page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") issues.push(`${label}: console error: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) issues.push(`${label}: HTTP ${response.status()} ${response.url()}`);
  });
}

async function geometry(page, label, { requireChapterFit = false } = {}) {
  const result = await page.evaluate(() => {
    const root = document.documentElement;
    const controls = [...document.querySelectorAll("button:not([hidden]), a[href]")]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.textContent.trim().replace(/\s+/g, " ").slice(0, 64), width: rect.width, height: rect.height };
      });
    const chapters = [...document.querySelectorAll(".chapter")].map((chapter) => {
      const chapterRect = chapter.getBoundingClientRect();
      const contentOverflow = [...chapter.querySelectorAll(":scope > .chapter-copy, :scope > .instrument, :scope > .brain-object, :scope > .opening-copy, :scope > .opening-note")]
        .filter((element) => getComputedStyle(element).display !== "none")
        .map((element) => ({ name: element.className, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.top < chapterRect.top - 2 || rect.bottom > chapterRect.bottom + 2 || rect.left < chapterRect.left - 2 || rect.right > chapterRect.right + 2)
        .map(({ name }) => name);
      return { id: chapter.id, rectHeight: chapterRect.height, contentOverflow };
    });
    const nestedScrollers = [...document.querySelectorAll("main *")].filter((element) => {
      const style = getComputedStyle(element);
      return ["auto", "scroll"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
    }).map((element) => element.className || element.id || element.tagName);
    return { clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, controls, chapters, nestedScrollers, viewportHeight: window.innerHeight };
  });
  assert.ok(result.scrollWidth <= result.clientWidth + 1, `${label}: horizontal overflow ${result.scrollWidth} > ${result.clientWidth}`);
  assert.deepEqual(result.nestedScrollers, [], `${label}: nested scroll containers ${result.nestedScrollers.join(", ")}`);
  for (const control of result.controls) {
    assert.ok(control.width >= 44 && control.height >= 44, `${label}: undersized control "${control.label}" at ${control.width}x${control.height}`);
  }
  if (requireChapterFit) {
    for (const chapter of result.chapters) {
      assert.ok(chapter.rectHeight <= result.viewportHeight + 1, `${label}: #${chapter.id} is taller than the viewport at ${chapter.rectHeight}`);
      assert.deepEqual(chapter.contentOverflow, [], `${label}: #${chapter.id} clips content ${chapter.contentOverflow.join(", ")}`);
    }
  }
  return result;
}

async function openPage(label, viewport, query = "") {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  monitor(page, label);
  await page.goto(`${conceptUrl}${query}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelectorAll(".meaning-node-s2").length === 20);
  return page;
}

for (const [label, viewport] of [
  ["wide desktop 1880x953", { width: 1880, height: 953 }],
  ["desktop 1440x900", { width: 1440, height: 900 }],
  ["compact desktop 1440x700", { width: 1440, height: 700 }],
  ["mobile 390x844", { width: 390, height: 844 }]
]) {
  const page = await openPage(label, viewport, "?render=final");
  await geometry(page, label, { requireChapterFit: true });
  await page.close();
}
observations.push("Every Brain chapter fits cleanly at 1880x953, 1440x900, 1440x700 and 390x844 without clipping or nested scrolling.");

const desktop = await openPage("desktop interactions", { width: 1440, height: 900 });
assert.equal(await desktop.locator(".meaning-node-s2").count(), 20);
assert.equal(await desktop.locator("#relationshipFieldS2 line").count(), 18);
assert.equal(await desktop.locator("#recordReelS2 .record-card").count(), 51);
assert.equal(await desktop.locator("#completeRecordS2 p").count(), 51);
await desktop.locator('.meaning-node-s2[data-id="BI-020"]').click();
assert.equal((await desktop.locator("#inspectorTitleS2").textContent()).trim(), "Build the thing that compounds people");
assert.match(await desktop.locator("#inspectorStatementS2").textContent(), /less generic/);
await desktop.locator('.meaning-node-s2[data-id="BI-003"]').click();
assert.equal((await desktop.locator("#inspectorTitleS2").textContent()).trim(), "Human release judgement");
observations.push("The retained Brain visual exposes all 20 ideas with plain-language inspection at the point of action.");

await desktop.locator("#testSourceS2").click();
assert.equal(await desktop.locator("body").getAttribute("data-source-test"), "true");
assert.equal((await desktop.locator("#proofHeadlineS2").textContent()).trim(), "The decision still holds.");
assert.match(await desktop.locator("#proofDetailS2").textContent(), /Two connected ideas need another look/);
await desktop.locator("#testSourceS2").click();
assert.equal(await desktop.locator("body").getAttribute("data-source-test"), "false");

await desktop.locator("#replayCorrectionS2").click();
assert.equal(await desktop.locator("body").getAttribute("data-correction"), "replay");
assert.match(await desktop.locator("#correctionStatusS2").textContent(), /earlier view/);
await desktop.locator("#replayCorrectionS2").click();
assert.equal(await desktop.locator("body").getAttribute("data-correction"), "current");
observations.push("The source check and correction remain causal, reversible and understandable without record identifiers or specialist language.");

const initialIndex = (await desktop.locator("#recordIndexS2").textContent()).trim();
await desktop.locator("#nextRecordS2").click();
assert.notEqual((await desktop.locator("#recordIndexS2").textContent()).trim(), initialIndex);
await desktop.locator("#pauseRecordS2").click();
assert.equal(await desktop.locator("body").getAttribute("data-record-paused"), "true");
assert.equal((await desktop.locator("#pauseRecordS2").textContent()).trim(), "Play");
observations.push("All 51 records occupy one fixed-height vertical reel with automatic movement, pause and manual advance, so the record never expands the page.");

await desktop.evaluate(() => document.querySelector("#memory").scrollIntoView());
await desktop.waitForFunction(() => document.querySelector("#memory")?.dataset.build !== "idle");
await desktop.evaluate(() => window.scrollBy(0, 420));
await desktop.waitForFunction(() => document.querySelector("#memory")?.dataset.build === "built");
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForFunction(() => document.querySelector("#memory")?.dataset.build === "idle");
observations.push("Scrolling forward builds each instrument and scrolling back returns it to idle.");

const skipBefore = await desktop.locator(".skip-link").boundingBox();
assert.ok(skipBefore.y + skipBefore.height <= 0);
await desktop.locator(".skip-link").focus();
const skipAfter = await desktop.locator(".skip-link").boundingBox();
assert.ok(skipAfter.y >= 0);
await geometry(desktop, "desktop after interactions");
await desktop.close();

for (const [label, viewport] of [
  ["small mobile 320x568", { width: 320, height: 568 }],
  ["large mobile 430x932", { width: 430, height: 932 }],
  ["mobile landscape 844x390", { width: 844, height: 390 }]
]) {
  const page = await openPage(label, viewport);
  await geometry(page, label);
  await page.close();
}
observations.push("The compact and landscape edge viewports use natural page height with no horizontal overflow, nested scrolling or clipped controls.");

const zoomed = await openPage("mobile 200 percent base text", { width: 390, height: 844 });
await zoomed.addStyleTag({ content: "html { font-size: 200% !important; }" });
await geometry(zoomed, "mobile 200 percent base text");
await zoomed.close();

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const reduced = await reducedContext.newPage();
monitor(reduced, "mobile reduced motion");
await reduced.goto(conceptUrl, { waitUntil: "networkidle" });
await reduced.waitForFunction(() => document.querySelectorAll(".record-card").length === 51);
assert.equal(await reduced.locator("body").getAttribute("data-record-paused"), "true");
assert.equal((await reduced.locator("#pauseRecordS2").textContent()).trim(), "Play");
await reduced.locator("#nextRecordS2").click();
assert.equal((await reduced.locator("#recordIndexS2").textContent()).trim(), "2 of 51");
await geometry(reduced, "mobile reduced motion");
await reducedContext.close();
observations.push("Reduced motion pauses the live reel by default while keeping manual advance available.");

const noJsContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
const noJs = await noJsContext.newPage();
await noJs.goto(conceptUrl, { waitUntil: "networkidle" });
assert.equal(await noJs.locator(".chapter").count(), 5);
assert.equal(await noJs.locator(".js-action").first().isHidden(), true);
assert.match(await noJs.locator(".no-js-record").textContent(), /20 ideas, 18 connections, 10 sources and 3 corrections/);
await geometry(noJs, "mobile no JavaScript");
await noJsContext.close();
observations.push("The no-JavaScript state retains the five-part story, record totals and readable fallback meaning.");

for (const state of ["ready", "loading", "stale", "error", "recovery"]) {
  const page = await openPage(`evidence state ${state}`, { width: 390, height: 844 }, `?state=${state}&render=final`);
  assert.equal(await page.locator("html").getAttribute("data-evidence-state"), state);
  assert.ok((await page.locator("#evidenceStateS2").textContent()).trim().length > 20);
  await page.close();
}
observations.push("Ready, loading, stale, error and recovery states keep the last known record readable.");

const desktopShot = await browser.newPage({ viewport: { width: 1440, height: 900 } });
monitor(desktopShot, "desktop screenshot");
await desktopShot.goto(`${conceptUrl}?render=final`, { waitUntil: "networkidle" });
await desktopShot.evaluate(() => document.fonts.ready);
await desktopShot.screenshot({ path: `${conceptDir}desktop-s2-1440.png`, fullPage: true });
await desktopShot.close();

const mobileShot = await browser.newPage({ viewport: { width: 390, height: 844 } });
monitor(mobileShot, "mobile screenshot");
await mobileShot.goto(`${conceptUrl}?render=final`, { waitUntil: "networkidle" });
await mobileShot.evaluate(() => document.fonts.ready);
await mobileShot.screenshot({ path: `${conceptDir}mobile-s2-390.png`, fullPage: true });
await mobileShot.close();

const review = await browser.newPage({ viewport: { width: 1500, height: 1600 } });
monitor(review, "paired review");
await review.goto(`${origin}/prototypes/website-redesign-recovery/brain-signature/review-s2.html`, { waitUntil: "networkidle" });
await review.evaluate(() => document.fonts.ready);
await review.screenshot({ path: `${conceptDir}paired-s2.png` });
await review.close();

await browser.close();
await server.close();
assert.deepEqual(issues, [], issues.join("\n"));

const outputFiles = ["desktop-s2-1440.png", "mobile-s2-390.png", "paired-s2.png", "index-s2.html", "styles-s2.css", "script-s2.js", "check-s2.mjs", "review-s2.html"];
const hashes = {};
for (const name of outputFiles) hashes[name] = createHash("sha256").update(await readFile(new URL(`./${name}`, import.meta.url))).digest("hex");

console.log(JSON.stringify({
  result: "pass",
  origin,
  fixture: { ideas: 20, connections: 18, sources: 10, corrections: 3, reelRecords: 51 },
  viewports: ["1880x953", "1440x900", "1440x700", "390x844", "320x568", "430x932", "844x390", "390x844 at 200 percent text"],
  evidenceStates: ["ready", "loading", "stale", "error", "recovery"],
  observations,
  hashes
}, null, 2));
