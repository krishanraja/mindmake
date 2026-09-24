import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { createServer } from "vite";

const conceptDir = fileURLToPath(new URL("./", import.meta.url));
const repoRoot = fileURLToPath(new URL("../../../", import.meta.url));
const browserPath = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const issues = [];
const observations = [];
const sha256 = (content) => createHash("sha256").update(content).digest("hex");

const baselineHashes = {
  "index-s2.html": "fe797bc208887c63a65e12bea98c543a088cbb14f566a69275f9a408ebba0123",
  "styles-s2.css": "73be37eb68c46dd04e97be877aad5f8a560e870417c25811518699eeae1f5a49",
  "script-s2.js": "0a399a7510cd0e3f83cc7bb2e92d63c25b34ee36cb2478630edba6490572118f",
  "check-s2.mjs": "07fc63e45aa80ce158cdfe70f6c859f294eb3627cb1e6264b12485a601d883f3",
  "review-s2.html": "aac231d7bd267e71cdcb47b5e6c9630944dd7045764c0424e585c135ed1ddfd9",
  "paired-s2.png": "5bf0fed49f34842870661d358cc1525397663da6cc9674a7c9d87a778976f93d"
};
const lockHashes = {
  "index-s2-lock.html": "32fe36fb55c66010dfdd2d2593b191012b37aff7165c3904eb18accb1bae8192",
  "styles-s2-lock.css": "4dc5945f4bcd362f6588942566fd072a5489c12028abfdb3af3e7150a50fb490",
  "check-s2-lock.mjs": "7b041ba56cc5c4c31a2ef1e0b8b5af4ebb6d1d95f3c55dfa8721e7bd9bb08417",
  "review-s2-lock.html": "5cd6d6a01d85baffd01ae08123e941d7a3576197f47e95cc322f46cf1f7ef5b1",
  "paired-s2-lock.png": "9126ba8d4684f89d552f3a79279e14e8469e73955b6c2d3e434a2e544443766e"
};
const motionS1Hashes = {
  "index-s2-motion.html": "99e676122e2577c110055d75354d81808c1ec66c5e08f6d9b1030bbb9fb81400",
  "styles-s2-motion.css": "6438fd26ed7feaecf8d52f6db90683f0c310c26b805194741cf4de5129bec282",
  "script-s2-motion.js": "8c9a1fedab2ab6e5d21e7cf95ff38a8b80abdcb725b7fca8baf1441b9273178c",
  "check-s2-motion.mjs": "032b872a0c37a45e533c09b17701f43b543d904927436980d34837f33cd14320",
  "review-s2-motion.html": "4e7c00ec5e59a472d619d89537de3cf047c6a1d8bf7c44112e27e70f112cfb6f",
  "desktop-s2-motion-1440.png": "113b30c83ed1bccd8fb87208d868e43740efb70c35b890d2535e437d0523b604",
  "mobile-s2-motion-390.png": "f9d1ce6fb65a125c0562c11fa2cbe266c2596bee2e39083e1f5f89b44a824b02",
  "paired-s2-motion.png": "95f673f10ead9f8ee867ca9e91eaf64e4fda7e1afaaf65949adafb3daf3149d4",
  "media/evidence-connects-poster.png": "60390f9d15e561bad9739a0ea5da0ae9cd7c5c443691695bbb01bca374c81bbe"
};

for (const [name, expected] of Object.entries(baselineHashes)) {
  const bytes = await readFile(new URL(`./${name}`, import.meta.url));
  assert.equal(sha256(bytes), expected, `Approved S2 baseline changed: ${name}`);
}

for (const [name, expected] of Object.entries(lockHashes)) {
  const bytes = await readFile(new URL(`./${name}`, import.meta.url));
  assert.equal(sha256(bytes), expected, `Approved S2 lock changed: ${name}`);
}

for (const [name, expected] of Object.entries(motionS1Hashes)) {
  const bytes = await readFile(new URL(`./${name}`, import.meta.url));
  assert.equal(sha256(bytes), expected, `BRAIN-MOTION-S1 baseline changed: ${name}`);
}

const filmBytes = await readFile(new URL("../../../src/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4", import.meta.url));
assert.equal(sha256(filmBytes), "374e98e244f4d56b64a69775078dae1ef76e918fb2711bd7f73671fe681b39da", "Approved evidence-connects film changed");

const baselineHtml = await readFile(new URL("./index-s2-motion.html", import.meta.url), "utf8");
const candidateHtml = await readFile(new URL("./index-s2-motion-s2.html", import.meta.url), "utf8");
const motionCss = await readFile(new URL("./styles-s2-motion.css", import.meta.url), "utf8");
const motionS2Css = await readFile(new URL("./styles-s2-motion-s2.css", import.meta.url), "utf8");
const motionScript = await readFile(new URL("./script-s2-motion.js", import.meta.url), "utf8");
const openingFilm = `        <figure class="opening-film" aria-hidden="true" data-motion-scene="evidence">
          <video
            data-motion-video="evidence"
            data-src="../../../src/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4"
            poster="./media/evidence-connects-poster.png"
            preload="none"
            muted
            loop
            playsinline
          ></video>
          <span class="opening-film-scrim"></span>
          <span class="opening-film-readout"><i></i> Evidence connecting</span>
        </figure>
`;
const normalizedCandidate = candidateHtml
  .replace("<title>BRAIN-MOTION-S2 / Full-bleed Evidence</title>", "<title>BRAIN-MOTION-S1 / Living Record</title>")
  .replace('    <link rel="stylesheet" href="./styles-s2-motion-s2.css" />\r\n', "")
  .replace('    <link rel="stylesheet" href="./styles-s2-motion-s2.css" />\n', "");
assert.equal(normalizedCandidate, baselineHtml, "BRAIN-MOTION-S2 contains an undeclared HTML change");
assert.equal(candidateHtml.match(/script-s2\.js/g)?.length, 1, "Motion candidate must reuse the approved S2 interaction source exactly once");
assert.equal(candidateHtml.match(/styles-s2-lock\.css/g)?.length, 1, "Motion candidate must retain exactly one lock stylesheet");
assert.equal(candidateHtml.match(/styles-s2-motion\.css/g)?.length, 1, "Motion candidate must add exactly one motion stylesheet");
assert.equal(candidateHtml.match(/styles-s2-motion-s2\.css/g)?.length, 1, "Motion S2 candidate must add exactly one full-bleed override stylesheet");
assert.equal(candidateHtml.match(/script-s2-motion\.js/g)?.length, 1, "Motion candidate must add exactly one motion controller");
assert.equal(candidateHtml.split(openingFilm).length - 1, 1, "The declared opening film must occur exactly once");
assert.equal(motionCss.includes("—"), false, "Motion stylesheet contains an em dash");
assert.equal(motionS2Css.includes("—"), false, "Motion S2 stylesheet contains an em dash");
assert.equal(/currentTime|requestAnimationFrame\([^)]*scroll/i.test(motionScript), false, "Brain film playback must not be scroll-scrubbed");
observations.push("The approved S2 baseline, lock and BRAIN-MOTION-S1 remain byte-identical; BRAIN-MOTION-S2 adds only its title and one full-bleed override stylesheet.");

const server = await createServer({ root: repoRoot, logLevel: "error", server: { host: "127.0.0.1", port: 0 } });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const conceptUrl = `${origin}/prototypes/website-redesign-recovery/brain-signature/index-s2-motion-s2.html`;
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

async function inspectLayout(page, label, { requireViewportFit = false } = {}) {
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

    const copy = [...document.querySelectorAll(".chapter-copy>h2,.chapter-copy>p,.opening-copy>h1,.opening-copy>p")].map((element) => {
      const rect = element.getBoundingClientRect();
      const parentRect = element.parentElement.getBoundingClientRect();
      const node = [...element.childNodes].find((child) => child.nodeType === Node.TEXT_NODE);
      const lines = new Map();
      if (node) {
        const text = node.textContent || "";
        for (const match of text.matchAll(/\S+/g)) {
          const range = document.createRange();
          range.setStart(node, match.index);
          range.setEnd(node, match.index + match[0].length);
          const wordRect = range.getBoundingClientRect();
          const key = Math.round(wordRect.top);
          lines.set(key, (lines.get(key) || 0) + 1);
        }
      }
      const lineCounts = [...lines.entries()].sort((a, b) => a[0] - b[0]).map((entry) => entry[1]);
      return {
        selector: `${element.parentElement.className} ${element.tagName.toLowerCase()}`,
        text: element.textContent.trim(),
        right: rect.right,
        parentRight: parentRect.right,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        lastLineWords: lineCounts.at(-1) || 0
      };
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

    const correctionCopy = document.querySelector(".correction .chapter-copy")?.getBoundingClientRect();
    const correctionLimit = window.innerWidth >= 901 ? window.innerWidth * .39 : window.innerWidth >= 761 && window.matchMedia("(orientation: portrait)").matches ? window.innerWidth * .42 : null;
    return {
      clientWidth: root.clientWidth,
      scrollWidth: root.scrollWidth,
      viewportHeight: window.innerHeight,
      controls,
      copy,
      chapters,
      nestedScrollers,
      correctionRight: correctionCopy?.right || 0,
      correctionLimit
    };
  });

  assert.ok(result.scrollWidth <= result.clientWidth + 1, `${label}: horizontal overflow ${result.scrollWidth} > ${result.clientWidth}`);
  assert.deepEqual(result.nestedScrollers, [], `${label}: nested scrollers ${result.nestedScrollers.join(", ")}`);
  for (const control of result.controls) assert.ok(control.width >= 44 && control.height >= 44, `${label}: undersized control ${control.label} at ${control.width}x${control.height}`);
  for (const block of result.copy) {
    assert.ok(block.scrollWidth <= block.clientWidth + 1, `${label}: text overflow in ${block.selector}: ${block.text}`);
    assert.ok(block.right <= block.parentRight + 2, `${label}: copy escapes its measure in ${block.selector}: ${block.text}`);
    assert.notEqual(block.lastLineWords, 1, `${label}: one-word orphan in ${block.selector}: ${block.text}`);
  }
  if (result.correctionLimit !== null) assert.ok(result.correctionRight <= result.correctionLimit + 2, `${label}: correction copy crosses its material panel ${result.correctionRight} > ${result.correctionLimit}`);
  if (requireViewportFit) {
    for (const chapter of result.chapters) {
      assert.ok(chapter.rectHeight <= result.viewportHeight + 1, `${label}: #${chapter.id} is taller than the viewport at ${chapter.rectHeight}`);
      assert.deepEqual(chapter.contentOverflow, [], `${label}: #${chapter.id} clips ${chapter.contentOverflow.join(", ")}`);
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

const requiredViewports = [
  ["320x568", { width: 320, height: 568 }],
  ["360x800", { width: 360, height: 800 }],
  ["390x844", { width: 390, height: 844 }],
  ["430x932", { width: 430, height: 932 }],
  ["768x1024", { width: 768, height: 1024 }],
  ["844x390", { width: 844, height: 390 }],
  ["1024x768", { width: 1024, height: 768 }],
  ["1280x800", { width: 1280, height: 800 }],
  ["1440x700", { width: 1440, height: 700 }],
  ["1440x900", { width: 1440, height: 900 }],
  ["1920x1080", { width: 1920, height: 1080 }]
];

for (const [label, viewport] of requiredViewports) {
  const page = await openPage(`lock ${label}`, viewport, "?render=final");
  const bounded = [[390,844],[430,932],[768,1024],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]].some(([width,height]) => viewport.width === width && viewport.height === height);
  await inspectLayout(page, `lock ${label}`, { requireViewportFit: bounded });
  await page.close();
}
observations.push("All eleven required viewports pass copy containment, orphan, target-size, overflow and nested-scroll checks; eight primary viewports also keep every chapter inside one viewport.");

const desktop = await openPage("locked desktop interactions", { width: 1440, height: 900 });
await desktop.waitForFunction(() => document.documentElement.dataset.activeFilm === "evidence");
assert.equal(
  await desktop.locator("video").evaluate((item) => item.paused),
  false,
  "The evidence film should play while the opening is visible."
);
assert.equal(await desktop.locator(".meaning-node-s2").count(), 20);
assert.equal(await desktop.locator("#recordReelS2 .record-card").count(), 51);
await desktop.locator('.meaning-node-s2[data-id="BI-020"]').click();
assert.match(await desktop.locator("#inspectorStatementS2").textContent(), /less generic/);
await desktop.locator("#testSourceS2").click();
assert.equal((await desktop.locator("#proofHeadlineS2").textContent()).trim(), "The decision still holds.");
await desktop.locator("#testSourceS2").click();
await desktop.locator("#replayCorrectionS2").click();
assert.match(await desktop.locator("#correctionStatusS2").textContent(), /earlier view/);
await desktop.locator("#replayCorrectionS2").click();
const recordIndex = (await desktop.locator("#recordIndexS2").textContent()).trim();
await desktop.locator("#nextRecordS2").click();
assert.notEqual((await desktop.locator("#recordIndexS2").textContent()).trim(), recordIndex);
await desktop.locator("#pauseRecordS2").click();
assert.equal(await desktop.locator("body").getAttribute("data-record-paused"), "true");
await desktop.evaluate(() => document.querySelector("#memory").scrollIntoView());
await desktop.waitForFunction(() => document.querySelector("#memory")?.dataset.build !== "idle");
await desktop.waitForFunction(() => document.querySelector("video")?.paused);
assert.equal(await desktop.locator("html").getAttribute("data-active-film"), null);
await desktop.evaluate(() => window.scrollBy(0, 420));
await desktop.waitForFunction(() => document.querySelector("#memory")?.dataset.build === "built");
await desktop.evaluate(() => window.scrollTo(0, 0));
await desktop.waitForFunction(() => document.querySelector("#memory")?.dataset.build === "idle");
await desktop.waitForFunction(() => document.documentElement.dataset.activeFilm === "evidence");
await inspectLayout(desktop, "locked desktop after interactions");
await desktop.close();
observations.push("The evidence film plays only at the opening and pauses offscreen; the approved scroll build remains causal and reversible.");
observations.push("All approved S2 interactions and the full 51-entry reel remain intact after the additive media layer.");

const zoomed = await openPage("locked mobile 200 percent text", { width: 390, height: 844 });
await zoomed.addStyleTag({ content: "html { font-size: 200% !important; }" });
await inspectLayout(zoomed, "locked mobile 200 percent text");
await zoomed.close();

const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
const reduced = await reducedContext.newPage();
monitor(reduced, "locked reduced motion");
await reduced.goto(conceptUrl, { waitUntil: "networkidle" });
await reduced.waitForFunction(() => document.querySelectorAll(".record-card").length === 51);
await reduced.waitForFunction(() => document.documentElement.dataset.motionPolicy === "poster");
assert.equal(await reduced.locator("video").evaluate((item) => !item.getAttribute("src") && item.paused), true);
assert.equal(await reduced.locator("body").getAttribute("data-record-paused"), "true");
await reduced.locator("#nextRecordS2").click();
assert.equal((await reduced.locator("#recordIndexS2").textContent()).trim(), "2 of 51");
await inspectLayout(reduced, "locked reduced motion");
await reducedContext.close();

const saveDataContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
await saveDataContext.addInitScript(() => {
  Object.defineProperty(navigator, "connection", {
    configurable: true,
    value: { saveData: true, addEventListener() {} }
  });
});
const saveData = await saveDataContext.newPage();
monitor(saveData, "Brain save-data");
await saveData.goto(conceptUrl, { waitUntil: "networkidle" });
await saveData.waitForFunction(() => document.documentElement.dataset.motionPolicy === "poster");
assert.equal(await saveData.locator("video").evaluate((item) => !item.getAttribute("src") && item.paused), true);
assert.equal(await saveData.locator("#opening-title").isVisible(), true);
await inspectLayout(saveData, "Brain save-data");
await saveDataContext.close();

const unavailableContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
const unavailable = await unavailableContext.newPage();
unavailable.on("pageerror", (error) => issues.push(`Brain unavailable media: page error: ${error.message}`));
let blockedMediaRequests = 0;
await unavailable.route(/\.mp4$/, (route) => {
  blockedMediaRequests += 1;
  return route.abort("failed");
});
await unavailable.goto(conceptUrl, { waitUntil: "networkidle" });
await unavailable.waitForTimeout(500);
assert.ok(blockedMediaRequests >= 1, "The missing-media scenario must block an attempted Brain film request.");
assert.equal(await unavailable.locator("#opening-title").isVisible(), true);
assert.equal(await unavailable.locator("video").evaluate((item) => Boolean(item.poster)), true);
await inspectLayout(unavailable, "Brain unavailable media");
await unavailableContext.close();

const noJsContext = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
const noJs = await noJsContext.newPage();
await noJs.goto(conceptUrl, { waitUntil: "networkidle" });
assert.match(await noJs.locator(".no-js-record").textContent(), /20 ideas, 18 connections, 10 sources and 3 corrections/);
assert.equal(await noJs.locator("video").evaluate((item) => !item.getAttribute("src") && Boolean(item.poster)), true);
await inspectLayout(noJs, "locked no JavaScript");
await noJsContext.close();
observations.push("Two-hundred-percent text, reduced motion, save-data, unavailable-media and no-JavaScript states preserve the approved meaning and recovery controls.");

const desktopShot = await browser.newPage({ viewport: { width: 1440, height: 900 } });
monitor(desktopShot, "locked desktop screenshot");
await desktopShot.goto(`${conceptUrl}?render=final`, { waitUntil: "networkidle" });
await desktopShot.evaluate(() => document.fonts.ready);
await desktopShot.screenshot({ path: `${conceptDir}desktop-s2-motion-s2-1440.png`, fullPage: true });
await desktopShot.close();

const mobileShot = await browser.newPage({ viewport: { width: 390, height: 844 } });
monitor(mobileShot, "locked mobile screenshot");
await mobileShot.goto(`${conceptUrl}?render=final`, { waitUntil: "networkidle" });
await mobileShot.evaluate(() => document.fonts.ready);
await mobileShot.screenshot({ path: `${conceptDir}mobile-s2-motion-s2-390.png`, fullPage: true });
await mobileShot.close();

const review = await browser.newPage({ viewport: { width: 1500, height: 1600 } });
monitor(review, "locked paired review");
await review.goto(`${origin}/prototypes/website-redesign-recovery/brain-signature/review-s2-motion-s2.html`, { waitUntil: "networkidle" });
await review.evaluate(() => document.fonts.ready);
await review.screenshot({ path: `${conceptDir}paired-s2-motion-s2.png` });
await review.close();

await browser.close();
await server.close();
assert.deepEqual(issues, [], issues.join("\n"));

const outputFiles = ["index-s2-motion-s2.html", "styles-s2-motion-s2.css", "check-s2-motion-s2.mjs", "review-s2-motion-s2.html", "desktop-s2-motion-s2-1440.png", "mobile-s2-motion-s2-390.png", "paired-s2-motion-s2.png"];
const hashes = {};
for (const name of outputFiles) hashes[name] = sha256(await readFile(new URL(`./${name}`, import.meta.url)));

console.log(JSON.stringify({
  result: "pass",
  origin,
  baselineHashes,
  lockHashes,
  motionS1Hashes,
  declaredDelta: ["candidate title", "one additive full-bleed hero stylesheet"],
  requiredViewports: requiredViewports.map(([label]) => label),
  observations,
  hashes
}, null, 2));
