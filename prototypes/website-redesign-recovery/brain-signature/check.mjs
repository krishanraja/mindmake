import assert from "node:assert/strict";
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

const sourceFiles = await Promise.all([
  readFile(new URL("./index.html", import.meta.url), "utf8"),
  readFile(new URL("./styles.css", import.meta.url), "utf8"),
  readFile(new URL("./script.js", import.meta.url), "utf8")
]);
for (const [index, source] of sourceFiles.entries()) {
  assert.equal(source.includes("—"), false, `Source file ${index} contains an em dash.`);
}

const server = await createServer({ root: repoRoot, logLevel: "error", server: { host: "127.0.0.1", port: 0 } });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const conceptUrl = `${origin}/prototypes/website-redesign-recovery/brain-signature/`;
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

async function geometry(page, label) {
  const result = await page.evaluate(() => {
    const root = document.documentElement;
    const controls = [...document.querySelectorAll("button:not([hidden]), a[href], summary")]
      .filter((element) => {
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.visibility !== "hidden" && style.display !== "none" && rect.width > 0 && rect.height > 0;
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { label: element.textContent.trim().replace(/\s+/g, " ").slice(0, 64), width: rect.width, height: rect.height };
      });
    return { clientWidth: root.clientWidth, scrollWidth: root.scrollWidth, controls };
  });
  assert.ok(result.scrollWidth <= result.clientWidth + 1, `${label}: horizontal overflow ${result.scrollWidth} > ${result.clientWidth}`);
  for (const control of result.controls) {
    assert.ok(control.width >= 44 && control.height >= 44, `${label}: undersized control "${control.label}" at ${control.width}x${control.height}`);
  }
}

async function openPage(label, viewport, query = "") {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  monitor(page, label);
  await page.goto(`${conceptUrl}index.html${query}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelectorAll(".meaning-node").length === 20);
  await geometry(page, label);
  return page;
}

const desktop = await openPage("desktop 1440x900", { width: 1440, height: 900 });
assert.equal(await desktop.locator(".meaning-node").count(), 20);
assert.equal(await desktop.locator("#relationshipField line").count(), 18);
assert.deepEqual(await desktop.locator(".record-groups ol").evaluateAll((lists) => lists.map((list) => list.children.length)), [20, 18, 10, 3]);
assert.equal(await desktop.locator("#decision").getAttribute("data-build"), "idle");
await desktop.evaluate(() => document.querySelector("#decision").scrollIntoView());
await desktop.waitForFunction(() => document.querySelector("#decision")?.dataset.build !== "idle");
await desktop.evaluate(() => window.scrollBy(0, 520));
await desktop.waitForFunction(() => document.querySelector("#decision")?.dataset.build === "built");
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForFunction(() => document.querySelector("#decision")?.dataset.build === "idle");
observations.push("Scrolling forward builds the decision carriage and scrolling back returns it to idle.");

await desktop.locator('.meaning-node[data-id="BI-020"]').click();
assert.equal((await desktop.locator("#inspectorTitle").textContent()).trim(), "Build the thing that compounds people");
await desktop.locator('.meaning-node[data-id="BI-003"]').click();
assert.equal((await desktop.locator("#inspectorTitle").textContent()).trim(), "Human release judgement");
observations.push("All 20 meanings are keyboard-sized controls and the inspector resolves the selected fixture record.");

await desktop.locator("#maskSource").click();
assert.equal(await desktop.locator("body").getAttribute("data-mask"), "true");
assert.match(await desktop.locator("#meaningSupport").textContent(), /Still supported by SRC-010/);
assert.equal((await desktop.locator("#rel003State").textContent()).trim(), "Supported through SRC-010");
assert.match(await desktop.locator("#rel009State").textContent(), /^Challenged/);
assert.match(await desktop.locator("#rel010State").textContent(), /^Challenged/);
assert.match(await desktop.locator("#meaningSupport").textContent(), /confidence remains direct/);
await desktop.locator("#maskSource").click();
assert.equal(await desktop.locator("body").getAttribute("data-mask"), "false");
assert.equal((await desktop.locator("#rel009State").textContent()).trim(), "Supported by SRC-002");
observations.push("Masking SRC-002 leaves BI-003 and REL-003 supported, challenges REL-009 and REL-010, preserves direct confidence, and restores cleanly.");

await desktop.locator("#replayCorrection").click();
assert.equal(await desktop.locator("body").getAttribute("data-correction"), "replay");
assert.match(await desktop.locator("#correctionStatus").textContent(), /v1 to v2/);
assert.equal((await desktop.locator(".earlier-version p").textContent()).trim(), "Consequential work always required human release.");
assert.equal((await desktop.locator(".current-version p").textContent()).trim(), "Externally consequential work requires human release. Reversible internal drafts may stay delegated.");
await desktop.locator("#replayCorrection").click();
assert.equal(await desktop.locator("body").getAttribute("data-correction"), "current");
observations.push("The correction replays and returns to current v2 while keeping the fixture provenance limit visible.");

const skipBefore = await desktop.locator(".skip-link").boundingBox();
assert.ok(skipBefore.y + skipBefore.height <= 0);
await desktop.locator(".skip-link").focus();
const skipAfter = await desktop.locator(".skip-link").boundingBox();
assert.ok(skipAfter.y >= 0);
await geometry(desktop, "desktop after interactions");
await desktop.close();

const compactDesktop = await openPage("desktop 1440x700", { width: 1440, height: 700 });
await compactDesktop.close();

const mobile = await openPage("mobile 390x844", { width: 390, height: 844 });
assert.equal(await mobile.locator(".mobile-path").isVisible(), true);
assert.equal(await mobile.locator(".meaning-field").isHidden(), true);
assert.equal((await mobile.locator(".mobile-path strong").textContent()).trim(), "Human release judgement");
await mobile.locator("#maskSource").click();
assert.match(await mobile.locator("#inspectionNote").textContent(), /two relationships are challenged/);
await mobile.locator("#maskSource").click();
await mobile.locator("#replayCorrection").click();
assert.match(await mobile.locator("#correctionStatus").textContent(), /v1 to v2/);
await mobile.locator("details").first().click();
assert.equal(await mobile.locator("#allMeanings li").count(), 20);
await geometry(mobile, "mobile after full task");
observations.push("Mobile keeps one focal beam and one obvious action while the complete record remains reachable without nested scrolling.");
await mobile.close();

for (const [label, viewport] of [
  ["small mobile 320x568", { width: 320, height: 568 }],
  ["large mobile 430x932", { width: 430, height: 932 }],
  ["mobile landscape 844x390", { width: 844, height: 390 }]
]) {
  const page = await openPage(label, viewport);
  await page.close();
}

const zoomed = await openPage("mobile 200 percent base text", { width: 390, height: 844 });
await zoomed.addStyleTag({ content: "html { font-size: 200% !important; }" });
await geometry(zoomed, "mobile 200 percent base text");
await zoomed.close();

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const reduced = await reducedContext.newPage();
monitor(reduced, "mobile reduced motion");
await reduced.goto(`${conceptUrl}index.html`, { waitUntil: "networkidle" });
assert.equal(await reduced.locator(".scene").count(), 4);
assert.equal(await reduced.locator(".scene").evaluateAll((scenes) => scenes.every((scene) => getComputedStyle(scene).display !== "none")), true);
await reduced.locator("#maskSource").click();
assert.match(await reduced.locator("#meaningSupport").textContent(), /SRC-010/);
await geometry(reduced, "mobile reduced motion");
await reducedContext.close();

const noJsContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
const noJs = await noJsContext.newPage();
await noJs.goto(`${conceptUrl}index.html`, { waitUntil: "networkidle" });
assert.equal(await noJs.locator(".scene").count(), 4);
assert.equal(await noJs.locator(".js-action").first().isHidden(), true);
assert.match(await noJs.locator(".no-js-record").textContent(), /20 meanings/);
assert.match(await noJs.locator(".no-js-record").textContent(), /18 relationships/);
assert.match(await noJs.locator(".no-js-record").textContent(), /10 sources/);
assert.match(await noJs.locator(".no-js-record").textContent(), /3 corrections/);
await geometry(noJs, "mobile no JavaScript");
await noJsContext.close();
observations.push("Reduced-motion and no-JavaScript views retain all four phases and the complete record.");

for (const state of ["ready", "loading", "stale", "error", "recovery"]) {
  const page = await openPage(`evidence state ${state}`, { width: 390, height: 844 }, `?state=${state}`);
  assert.equal(await page.locator("html").getAttribute("data-evidence-state"), state);
  assert.ok((await page.locator("#evidenceState").textContent()).trim().length > 20);
  await page.close();
}
observations.push("Ready, loading, stale, error and recovery states keep the last known record readable.");

const desktopShot = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
monitor(desktopShot, "desktop screenshot");
await desktopShot.goto(`${conceptUrl}index.html?render=final`, { waitUntil: "networkidle" });
await desktopShot.evaluate(() => document.fonts.ready);
await desktopShot.screenshot({ path: `${conceptDir}desktop-1440.png`, fullPage: true });
await desktopShot.close();

const mobileShot = await browser.newPage({ viewport: { width: 390, height: 844 } });
monitor(mobileShot, "mobile screenshot");
await mobileShot.goto(`${conceptUrl}index.html?render=final`, { waitUntil: "networkidle" });
await mobileShot.evaluate(() => document.fonts.ready);
await mobileShot.screenshot({ path: `${conceptDir}mobile-390.png`, fullPage: true });
await mobileShot.close();

const review = await browser.newPage({ viewport: { width: 1500, height: 1600 } });
monitor(review, "paired review");
await review.goto(`${conceptUrl}review.html`, { waitUntil: "networkidle" });
await review.evaluate(() => document.fonts.ready);
await review.screenshot({ path: `${conceptDir}paired-review.png` });
await review.close();

await browser.close();
await server.close();
assert.deepEqual(issues, [], issues.join("\n"));
console.log(JSON.stringify({
  result: "pass",
  origin,
  fixture: { meanings: 20, relationships: 18, sources: 10, corrections: 3 },
  viewports: ["1440x900", "1440x700", "390x844", "320x568", "430x932", "844x390", "390x844 at 200 percent text"],
  evidenceStates: ["ready", "loading", "stale", "error", "recovery"],
  observations
}, null, 2));
