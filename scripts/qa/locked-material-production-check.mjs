#!/usr/bin/env node
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { resolve } from "node:path";
import { chromium, firefox, webkit } from "playwright";
import { PNG } from "pngjs";
import { candidateIdentity } from "./award-panel-lib.mjs";

const root = resolve(import.meta.dirname, "../..");
const output = "C:/Users/krish/.scratch/mindmake-locked-material-production";
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
  ["1920x1080", { width: 1920, height: 1080 }],
];
const chapterFitViewports = new Set([
  "390x844", "430x932", "768x1024", "1024x768", "1280x800", "1440x700", "1440x900", "1920x1080",
]);
const fingerprints = {
  "prototypes/website-redesign-recovery/brain-signature/index-s2-motion-s3.html": "423659d864e79a72a55d4fd3ca9450b610e616187929293f1e0a8faaafbff2c6",
  "src/styles/mindmake-locked-brain.css": "51e0a9a3a351e81d8578f570eaf662d0f6b958acf17551c666caf89ddc5dc4a2",
};
/* /ai-gtm left the locked-material routes in r47: it is written by hand on the
   house tokens and has its own scroll-build gate (scripts/qa/ai-gtm-scroll-build-check.mjs).
   Its checks here had asserted the retired signal-and-response design since r25. */
const issues = [];
const observations = [];
let origin;
let server;

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
const channel = (value) => {
  const normalised = value / 255;
  return normalised <= 0.04045 ? normalised / 12.92 : ((normalised + 0.055) / 1.055) ** 2.4;
};
const luminance = ([red, green, blue]) => 0.2126 * channel(red) + 0.7152 * channel(green) + 0.0722 * channel(blue);
const contrastRatio = (first, second) => {
  const light = Math.max(luminance(first), luminance(second));
  const dark = Math.min(luminance(first), luminance(second));
  return (light + 0.05) / (dark + 0.05);
};
const rgbChannels = (value) => {
  const channels = value.match(/[\d.]+/g)?.slice(0, 3).map(Number);
  assert.equal(channels?.length, 3, `Could not parse rendered colour: ${value}`);
  return channels;
};
const findEphemeralPort = () => new Promise((resolvePort, rejectPort) => {
  const probe = createServer();
  probe.unref();
  probe.once("error", rejectPort);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    probe.close((error) => error ? rejectPort(error) : resolvePort(address.port));
  });
});

for (const [relativePath, expected] of Object.entries(fingerprints)) {
  const actual = sha256(await readFile(resolve(root, relativePath)));
  assert.equal(actual, expected, `Locked production input changed: ${relativePath}`);
}
observations.push("The owner-approved BRAIN-MOTION-S3 document, and its generated scoped styles with the verified fine-pointer reflow guards, match their locked hashes.");

async function startServer() {
  const port = await findEphemeralPort();
  origin = `http://127.0.0.1:${port}`;
  const viteEntry = resolve(root, "node_modules/vite/bin/vite.js");
  server = spawn(process.execPath, [viteEntry, "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let diagnostics = "";
  server.stdout.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`Script-owned Vite server exited before readiness.\n${diagnostics}`);
    try {
      const brain = await fetch(`${origin}/ai-brain`);
      if (brain.ok) return;
    } catch {
      // Retry until the bounded readiness window expires.
    }
    await delay(125);
  }
  throw new Error(`Script-owned Vite server did not become ready at ${origin}.\n${diagnostics}`);
}

function monitor(page, label) {
  page.on("pageerror", (error) => issues.push(`${label}: page error: ${error.message}`));
  page.on("console", (message) => {
    if (message.type() === "error") issues.push(`${label}: console error: ${message.text()}`);
  });
  page.on("response", (response) => {
    if (response.status() >= 400) issues.push(`${label}: HTTP ${response.status()} ${response.url()}`);
  });
}

async function prepare(page, label) {
  monitor(page, label);
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
}

async function openRoute(browser, route, rootSelector, label, viewport, query = "") {
  const coarsePointer = viewport.width <= 430 || (viewport.height <= 430 && viewport.width <= 900);
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1, hasTouch: coarsePointer });
  await prepare(page, label);
  const response = await page.goto(`${origin}${route}${query}`, { waitUntil: "domcontentloaded" });
  assert.ok(response?.ok(), `${label}: route response failed`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction((selector) => {
    const element = document.querySelector(selector);
    return element && !element.classList.contains("no-js");
  }, rootSelector);
  return page;
}

async function inspectCommon(page, label, rootSelector, { targets = [] } = {}) {
  const result = await page.evaluate(({ selector, targetSelectors }) => {
    const rootElement = document.querySelector(selector);
    const visible = (element) => {
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
    };
    const controls = targetSelectors.flatMap((target) => [...rootElement.querySelectorAll(target)])
      .filter((element, index, all) => all.indexOf(element) === index && visible(element))
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label: (element.textContent || element.getAttribute("aria-label") || element.tagName).trim().replace(/\s+/g, " ").slice(0, 72),
          width: rect.width,
          height: rect.height,
        };
      });
    const nestedScrollers = [...rootElement.querySelectorAll("*")].filter((element) => {
      const style = getComputedStyle(element);
      return ["auto", "scroll"].includes(style.overflowY) && element.scrollHeight > element.clientHeight + 1;
    }).map((element) => element.className || element.id || element.tagName);
    const brand = document.querySelector(".mm-header .mm-brand")?.getBoundingClientRect();
    const menu = document.querySelector(".mm-menu-button")?.getBoundingClientRect();
    const heading = rootElement.querySelector("h1")?.getBoundingClientRect();
    const intersects = (left, right) => Boolean(left && right
      && left.left < right.right && left.right > right.left
      && left.top < right.bottom && left.bottom > right.top);
    return {
      viewportWidth: innerWidth,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      rootOverflow: rootElement.scrollWidth - rootElement.clientWidth,
      overlay: Boolean(document.querySelector("vite-error-overlay")),
      nestedScrollers,
      controls,
      shellCenterDelta: brand && menu ? Math.abs((brand.top + brand.height / 2) - (menu.top + menu.height / 2)) : 999,
      shellHeadingCollision: intersects(brand, heading) || intersects(menu, heading),
    };
  }, { selector: rootSelector, targetSelectors: targets });
  assert.ok(!result.overlay, `${label}: Vite error overlay is present`);
  assert.ok(result.documentOverflow <= 1, `${label}: document horizontal overflow ${result.documentOverflow}px`);
  assert.ok(result.rootOverflow <= 1, `${label}: locked surface horizontal overflow ${result.rootOverflow}px`);
  assert.deepEqual(result.nestedScrollers, [], `${label}: nested scrollers ${result.nestedScrollers.join(", ")}`);
  assert.ok(result.shellCenterDelta <= 2, `${label}: shared shell brand and menu drift by ${result.shellCenterDelta}px`);
  assert.equal(result.shellHeadingCollision, false, `${label}: shared shell overlaps the route headline`);
  for (const control of result.controls) {
    assert.ok(control.width >= 44 && control.height >= 44, `${label}: undersized control ${control.label} at ${control.width}x${control.height}`);
  }
  return result;
}

async function inspectBrainLayout(page, label, { requireViewportFit = false } = {}) {
  await inspectCommon(page, label, ".mm-locked-brain", {
    targets: ["button:not([hidden])", ".primary-link", ".phase-rail a"],
  });
  const result = await page.evaluate(() => {
    const copy = [...document.querySelectorAll(".mm-locked-brain .chapter-copy>h2,.mm-locked-brain .chapter-copy>p,.mm-locked-brain .opening-copy>h1,.mm-locked-brain .opening-copy>p")].map((element) => {
      const rect = element.getBoundingClientRect();
      const parentRect = element.parentElement.getBoundingClientRect();
      const nodes = [...element.childNodes].filter((child) => child.nodeType === Node.TEXT_NODE);
      const lines = new Map();
      for (const node of nodes) {
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
        lastLineWords: lineCounts.at(-1) || 0,
      };
    });
    const chapters = [...document.querySelectorAll(".mm-locked-brain .chapter")].map((chapter) => {
      const chapterRect = chapter.getBoundingClientRect();
      const contentOverflow = [...chapter.querySelectorAll(":scope > .chapter-copy, :scope > .instrument, :scope > .opening-copy")]
        .filter((element) => getComputedStyle(element).display !== "none")
        .map((element) => ({ name: element.className, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.top < chapterRect.top - 2 || rect.bottom > chapterRect.bottom + 2 || rect.left < chapterRect.left - 2 || rect.right > chapterRect.right + 2)
        .map(({ name }) => name);
      return { id: chapter.id, height: chapterRect.height, contentOverflow };
    });
    const correctionCopy = document.querySelector(".mm-locked-brain .correction .chapter-copy")?.getBoundingClientRect();
    const brainRect = document.querySelector(".mm-locked-brain .brain-object")?.getBoundingClientRect();
    const plaque = document.querySelector(".mm-locked-brain .pulse-core");
    const plaqueRect = plaque?.getBoundingClientRect();
    const plaqueChildren = plaque ? [...plaque.children].map((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      return {
        name: element.tagName,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
        centerX: rect.left + rect.width / 2,
        textAlign: style.textAlign,
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
      };
    }) : [];
    const plaqueCollisions = plaqueChildren.slice(0, -1).flatMap((child, index) => {
      const next = plaqueChildren[index + 1];
      return child.bottom > next.top + 0.5 ? [`${child.name}->${next.name}`] : [];
    });
    const correctionLimit = innerWidth >= 901
      ? innerWidth * 0.39
      : innerWidth >= 761 && matchMedia("(orientation: portrait)").matches ? innerWidth * 0.42 : null;
    const recordText = [...document.querySelectorAll(".mm-locked-brain .record-card strong,.mm-locked-brain .record-card small")].map((element) => {
      const style = getComputedStyle(element);
      return {
        text: element.textContent?.trim() || "",
        scrollWidth: element.scrollWidth,
        clientWidth: element.clientWidth,
        scrollHeight: element.scrollHeight,
        clientHeight: element.clientHeight,
        textOverflow: style.textOverflow,
        whiteSpace: style.whiteSpace,
      };
    });
    return {
      viewportHeight: innerHeight,
      openingHeight: document.querySelector(".mm-locked-brain .opening")?.getBoundingClientRect().height || 0,
      copy,
      chapters,
      correctionRight: correctionCopy?.right || 0,
      correctionLimit,
      recordText,
      brainObject: brainRect ? {
        decorative: document.querySelector(".mm-locked-brain .brain-object").getAttribute("aria-hidden") === "true"
          && getComputedStyle(document.querySelector(".mm-locked-brain .brain-object")).pointerEvents === "none",
      } : null,
      plaque: brainRect && plaqueRect ? {
        centerDx: Math.abs((plaqueRect.left + plaqueRect.width / 2) - (brainRect.left + brainRect.width / 2)),
        centerDy: Math.abs((plaqueRect.top + plaqueRect.height / 2) - (brainRect.top + brainRect.height / 2)),
        centerX: plaqueRect.left + plaqueRect.width / 2,
        widthRatio: plaqueRect.width / brainRect.width,
        aspectRatio: plaqueRect.width / plaqueRect.height,
        rect: { left: plaqueRect.left, right: plaqueRect.right, top: plaqueRect.top, bottom: plaqueRect.bottom },
        children: plaqueChildren,
        collisions: plaqueCollisions,
      } : null,
    };
  });
  for (const block of result.copy) {
    assert.ok(block.scrollWidth <= block.clientWidth + 1, `${label}: text overflow in ${block.selector}: ${block.text}`);
    assert.ok(block.right <= block.parentRight + 2, `${label}: copy escapes its measure in ${block.selector}: ${block.text}`);
    if (block.lastLineWords === 1) issues.push(`${label}: one-word orphan in ${block.selector}: ${block.text}`);
  }
  assert.ok(Math.abs(result.openingHeight - result.viewportHeight) <= 1, `${label}: Brain opening is ${result.openingHeight}px, not one ${result.viewportHeight}px viewport`);
  if (result.correctionLimit !== null) {
    assert.ok(result.correctionRight <= result.correctionLimit + 2, `${label}: correction copy crosses its material panel`);
  }
  /* r41 (Krish, 2026-09-25): the decision plaque is gone; the orbit is the
     hero's decorative ground and must never take a pointer or a reader. */
  assert.equal(result.plaque, null, `${label}: the removed decision plaque has returned`);
  assert.ok(result.brainObject?.decorative, `${label}: the hero orbit is not a decorative layer`);
  for (const record of result.recordText) {
    assert.notEqual(record.textOverflow, "ellipsis", `${label}: living-record text is ellipsized: ${record.text}`);
    assert.notEqual(record.whiteSpace, "nowrap", `${label}: living-record text cannot wrap: ${record.text}`);
    assert.ok(record.scrollWidth <= record.clientWidth + 1 && record.scrollHeight <= record.clientHeight + 1, `${label}: living-record text is clipped: ${record.text}`);
  }
  if (requireViewportFit) {
    for (const chapter of result.chapters) {
      assert.ok(chapter.height <= result.viewportHeight + 1, `${label}: #${chapter.id} is taller than the viewport at ${chapter.height}px`);
      assert.deepEqual(chapter.contentOverflow, [], `${label}: #${chapter.id} clips ${chapter.contentOverflow.join(", ")}`);
    }
  }
}

async function verifyBrainInteractions(browser) {
  const page = await openRoute(browser, "/ai-brain", ".mm-locked-brain", "Chromium Brain interactions", { width: 1440, height: 900 });
  await page.waitForFunction(() => document.querySelectorAll(".meaning-node-s2").length === 20);
  assert.equal(await page.locator("#relationshipFieldS2 line").count(), 18);
  assert.equal(await page.locator("#recordReelS2 .record-card").count(), 51);
  assert.equal(await page.locator("#completeRecordS2 p").count(), 51);
  await page.locator('.meaning-node-s2[data-id="BI-020"]').click();
  assert.match(await page.locator("#inspectorStatementS2").textContent(), /less generic/);
  /* Every idea keeps one size and every title one line, whichever is picked. */
  const nodeGeometry = await page.evaluate(async () => {
    const sizes = new Set();
    const titleHeights = new Set();
    for (const node of document.querySelectorAll(".meaning-node-s2")) {
      node.click();
      await new Promise((resolve) => setTimeout(resolve, 220));
      for (const dot of document.querySelectorAll(".meaning-node-s2")) {
        const style = getComputedStyle(dot, "::before");
        sizes.add(`${style.width}x${style.height}`);
      }
      titleHeights.add(Math.round(document.querySelector("#inspectorTitleS2").getBoundingClientRect().height));
      titleHeights.add(`panel ${Math.round(document.querySelector("#meaningInspectorS2").getBoundingClientRect().height)}`);
    }
    return { sizes: [...sizes], titleHeights: [...titleHeights] };
  });
  assert.equal(nodeGeometry.sizes.length, 1, `Brain idea dots change size on selection: ${nodeGeometry.sizes.join(", ")}`);
  assert.equal(nodeGeometry.titleHeights.length, 2, `Brain inspector title or panel height moves on selection: ${nodeGeometry.titleHeights.join(", ")}`);
  const proofHeight = await page.locator(".proof-result").evaluate((element) => element.getBoundingClientRect().height);
  await page.locator("#testSourceS2").click();
  assert.equal(await page.locator("#testSourceS2").getAttribute("aria-checked"), "true");
  assert.equal((await page.locator("#proofHeadlineS2").textContent()).trim(), "The decision still holds.");
  assert.equal(await page.locator(".proof-result").evaluate((element) => element.getBoundingClientRect().height), proofHeight, "Brain proof result changes height when a source is removed");
  await page.locator("#testSourceS2").click();
  /* The correction builds from before to now with scroll, and unbuilds on the way back. */
  const learnAt = async (fraction) => page.evaluate(async (at) => {
    const machine = document.querySelector("#correctionMachine");
    window.scrollTo(0, machine.getBoundingClientRect().top + window.scrollY - window.innerHeight * at);
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    return Number(getComputedStyle(document.querySelector("#correction")).getPropertyValue("--learn-scroll"));
  }, fraction);
  const early = await learnAt(0.95);
  const late = await learnAt(0.2);
  const back = await learnAt(0.95);
  assert.ok(early < 0.25 && late === 1 && back < 0.25, `Brain correction does not build both ways with scroll (${early}, ${late}, ${back})`);
  await page.locator("#pauseRecordS2").click();
  assert.equal(await page.locator(".mm-locked-brain").getAttribute("data-record-paused"), "true");
  await page.locator("[data-commercial-video]").evaluate((video) => video.scrollIntoView({ block: "center" }));
  await page.waitForFunction(() => {
    const video = document.querySelector("[data-commercial-video]");
    return video && video.readyState >= 2 && !video.paused;
  });
  const overlap = await page.evaluate(() => {
    const video = document.querySelector("[data-commercial-video]");
    if (!video) return null;
    const top = video.getBoundingClientRect().top + scrollY;
    window.scrollTo(0, top - innerHeight * 0.43);
    return true;
  });
  assert.equal(overlap, true);
  await page.waitForTimeout(150);
  const overlapState = await page.evaluate(() => {
    const control = document.querySelector("#pauseRecordS2");
    const video = document.querySelector("[data-commercial-video]");
    if (!control || !video) return null;
    const controlRect = control.getBoundingClientRect();
    const videoRect = video.getBoundingClientRect();
    return {
      controlVisible: controlRect.bottom > 0 && controlRect.top < innerHeight,
      videoVisible: videoRect.bottom > 0 && videoRect.top < innerHeight,
    };
  });
  assert.equal(overlapState?.controlVisible, true, "Chromium Brain interactions: record control must remain visible in the adjacent-film overlap state");
  assert.equal(overlapState?.videoVisible, true, "Chromium Brain interactions: commercial film must be visible in the adjacent-film overlap state");
  await page.waitForFunction(() => document.querySelector("[data-commercial-video]")?.paused);
  assert.equal(await page.locator("[data-commercial-video]").evaluate((video) => video.paused), true, "Chromium Brain interactions: a loaded commercial film must pause while the record control remains visible");
  await page.waitForFunction(() => [...document.querySelectorAll("video")]
    .filter((video) => {
      const rect = video.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    })
    .every((video) => video.paused));
  assert.equal(await page.locator("video").evaluateAll((videos) => videos
    .filter((video) => {
      const rect = video.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < innerHeight && rect.right > 0 && rect.left < innerWidth;
    })
    .every((video) => video.paused)), true, "Chromium Brain interactions: no adjacent film may keep moving beneath the record Pause control");
  const currentRecordIsVisible = async () => page.evaluate(() => {
    const card = document.querySelector("#recordReelS2 .record-card.is-current");
    const windowElement = document.querySelector(".reel-window");
    if (!card || !windowElement) return false;
    const cardRect = card.getBoundingClientRect();
    const windowRect = windowElement.getBoundingClientRect();
    const centerY = cardRect.top + cardRect.height / 2;
    return centerY >= windowRect.top
      && centerY <= windowRect.bottom
      && Number.parseFloat(getComputedStyle(card).opacity) >= 0.99
      && Boolean(card.querySelector("strong")?.textContent?.trim())
      && Boolean(card.querySelector("small")?.textContent?.trim());
  });
  assert.equal(await currentRecordIsVisible(), true, "Chromium Brain interactions: Pause must leave a complete current record visible");
  const before = (await page.locator("#recordIndexS2").textContent()).trim();
  await page.locator("#nextRecordS2").click();
  await page.waitForTimeout(600);
  assert.notEqual((await page.locator("#recordIndexS2").textContent()).trim(), before);
  assert.equal(await currentRecordIsVisible(), true, "Chromium Brain interactions: Next must reveal a complete current record");
  await page.evaluate(() => document.querySelector("#memory").scrollIntoView());
  await page.waitForFunction(() => document.querySelector("#memory")?.dataset.build !== "idle");
  await page.evaluate(() => window.scrollBy(0, 420));
  await page.waitForFunction(() => document.querySelector("#memory")?.dataset.build === "built");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector("#memory")?.dataset.build === "idle");
  await page.waitForFunction(() => document.querySelector(".mm-locked-brain")?.dataset.activeFilm === "evidence");
  assert.equal(await page.locator("video[data-motion-video]").evaluate((video) => video.paused), false);
  await page.evaluate(() => document.querySelector("#memory").scrollIntoView());
  await page.waitForFunction(() => document.querySelector("video[data-motion-video]")?.paused);
  assert.equal(await page.locator(".mm-locked-brain").getAttribute("data-active-film"), null);
  await page.close();
  observations.push("Brain preserves 20 meanings, 18 relationships, 10 sources, 3 corrections and all 51 record entries; fixed-size ideas, one-line titles, a stable source switch, a scroll-built correction, reel controls, one-film motion and reversible scroll build work on the production route.");
}

async function verifyBrainClosingContrast(browser) {
  const results = [];
  for (const reducedMotion of ["no-preference", "reduce"]) {
    const label = `Chromium Brain closing contrast / ${reducedMotion}`;
    const page = await browser.newPage({
      viewport: { width: 1440, height: 900 },
      deviceScaleFactor: 1,
      reducedMotion,
    });
    await prepare(page, label);
    try {
      const response = await page.goto(`${origin}/ai-brain?render=final`, { waitUntil: "domcontentloaded" });
      assert.ok(response?.ok(), `${label}: route response failed`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => !document.querySelector(".mm-locked-brain")?.classList.contains("no-js"));
      for (const selector of ["#memory-title", "#correction-title", "#record-title"]) {
        const heading = page.locator(selector);
        await heading.scrollIntoViewIfNeeded();
        const foreground = rgbChannels(await heading.evaluate((element) => getComputedStyle(element).color));
        const rendered = PNG.sync.read(await heading.screenshot({ animations: "disabled" }));
        const originalStyle = await heading.getAttribute("style");
        await heading.evaluate((element) => {
          element.style.setProperty("color", "transparent", "important");
          element.style.setProperty("text-shadow", "none", "important");
        });
        const image = PNG.sync.read(await heading.screenshot({ animations: "disabled" }));
        if (originalStyle === null) await heading.evaluate((element) => element.removeAttribute("style"));
        else await heading.evaluate((element, style) => element.setAttribute("style", style), originalStyle);
        let minimum = Number.POSITIVE_INFINITY;
        let glyphPixels = 0;
        for (let offset = 0; offset < image.data.length; offset += 4) {
          if (image.data[offset + 3] === 0) continue;
          const changed = Math.abs(rendered.data[offset] - image.data[offset])
            + Math.abs(rendered.data[offset + 1] - image.data[offset + 1])
            + Math.abs(rendered.data[offset + 2] - image.data[offset + 2]);
          if (changed < 12) continue;
          glyphPixels += 1;
          minimum = Math.min(minimum, contrastRatio(foreground, [image.data[offset], image.data[offset + 1], image.data[offset + 2]]));
        }
        assert.ok(glyphPixels > 0, `${label}: ${selector} produced no measurable glyph pixels`);
        assert.ok(minimum >= 3, `${label}: ${selector} worst rendered contrast is ${minimum.toFixed(2)}:1`);
        results.push(`${selector} ${reducedMotion} ${minimum.toFixed(2)}:1`);
      }
    } finally {
      await page.close();
    }
  }
  observations.push(`Brain's late meaning-bearing headlines exceed 3:1 against every rendered background pixel in normal and reduced-motion modes (${results.join(", ")}).`);
}

async function verifyBrainFinePointerReflow(browser) {
  for (const viewport of [{ width: 512, height: 384 }, { width: 720, height: 450 }]) {
    const label = `Chromium Brain fine-pointer ${viewport.width}x${viewport.height} 200% reflow`;
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1, hasTouch: false, reducedMotion: "reduce" });
    await prepare(page, label);
    try {
      const response = await page.goto(`${origin}/ai-brain?render=final`, { waitUntil: "domcontentloaded" });
      assert.ok(response?.ok(), `${label}: route response failed`);
      await page.evaluate(() => document.fonts.ready);
      await page.waitForFunction(() => document.querySelectorAll(".meaning-node-s2").length === 20);
      const geometry = await page.evaluate(() => {
        const pairs = [
          ["#memory-title", ".mm-locked-brain .memory .instrument"],
          ["#correction-title", ".mm-locked-brain .correction .instrument"],
        ].map(([headingSelector, instrumentSelector]) => {
          const heading = document.querySelector(headingSelector);
          const instrument = document.querySelector(instrumentSelector);
          const headingRect = heading?.getBoundingClientRect();
          const instrumentRect = instrument?.getBoundingClientRect();
          return {
            headingSelector,
            instrumentSelector,
            heading: headingRect?.toJSON(),
            instrument: instrumentRect?.toJSON(),
            headingClientWidth: heading?.clientWidth ?? -1,
            headingScrollWidth: heading?.scrollWidth ?? -1,
            collision: Boolean(headingRect && instrumentRect
              && headingRect.left < instrumentRect.right
              && headingRect.right > instrumentRect.left
              && headingRect.top < instrumentRect.bottom
              && headingRect.bottom > instrumentRect.top),
          };
        });
        return { documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, pairs };
      });
      assert.ok(geometry.documentOverflow <= 1, `${label}: document overflow ${geometry.documentOverflow}px`);
      for (const pair of geometry.pairs) {
        assert.ok(pair.heading && pair.instrument, `${label}: ${pair.headingSelector} or ${pair.instrumentSelector} is missing`);
        assert.ok(pair.headingScrollWidth <= pair.headingClientWidth + 1, `${label}: ${pair.headingSelector} overflows its ${pair.headingClientWidth}px measure`);
        assert.equal(pair.collision, false, `${label}: ${pair.headingSelector} collides with ${pair.instrumentSelector}`);
      }
    } finally {
      await page.close();
    }
  }
}

async function verifyFallbacks(browser) {
  for (const [route, rootSelector, filmCount] of [
    ["/ai-brain", ".mm-locked-brain", 1],
  ]) {
    const reducedContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, reducedMotion: "reduce" });
    await reducedContext.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
    const reduced = await reducedContext.newPage();
    monitor(reduced, `reduced motion ${route}`);
    await reduced.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
    await reduced.waitForFunction((selector) => document.querySelector(selector)?.dataset.motionPolicy === "poster", rootSelector);
    assert.equal(await reduced.locator(`${rootSelector} video`).count(), filmCount);
    assert.equal(await reduced.locator(`${rootSelector} video`).evaluateAll((videos) => videos.every((video) => !video.getAttribute("src") && video.paused)), true);
    assert.equal(await reduced.locator("#pauseRecordS2").textContent(), "Play");
    await reduced.locator("#nextRecordS2").click();
    await reduced.waitForFunction(() => document.querySelector("#recordIndexS2")?.textContent?.trim() === "2 of 51");
    assert.equal((await reduced.locator("#recordIndexS2").textContent()).trim(), "2 of 51");
    await reducedContext.close();

    const saveDataContext = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true });
    await saveDataContext.addInitScript(() => {
      localStorage.setItem("mindmake_consent", "accepted");
      Object.defineProperty(navigator, "connection", {
        configurable: true,
        value: { saveData: true, addEventListener() {}, removeEventListener() {} },
      });
    });
    const saveData = await saveDataContext.newPage();
    monitor(saveData, `save-data ${route}`);
    await saveData.goto(`${origin}${route}`, { waitUntil: "domcontentloaded" });
    await saveData.waitForFunction((selector) => document.querySelector(selector)?.dataset.motionPolicy === "poster", rootSelector);
    assert.equal(await saveData.locator(`${rootSelector} video`).evaluateAll((videos) => videos.every((video) => !video.getAttribute("src") && video.paused)), true);
    await saveDataContext.close();
  }
  observations.push("Reduced-motion and save-data modes retain both experiences on poster-backed visual grounds without loading film playback sources.");
}

async function verifyEvidenceStates(browser) {
  for (const [route, rootSelector, states] of [
    ["/ai-brain", ".mm-locked-brain", ["ready", "loading", "stale", "error", "recovery"]],
  ]) {
    for (const state of states) {
      const page = await openRoute(browser, route, rootSelector, `${route} evidence ${state}`, { width: 390, height: 844 }, `?state=${state}`);
      assert.equal(await page.locator(rootSelector).getAttribute("data-evidence-state"), state);
      const selector = "#evidenceStateS2";
      /* The Brain's evidence bar only speaks when something needs saying:
         a ready or loading record shows nothing (Krish, 2026-09-25). */
      if (route === "/ai-brain" && ["ready", "loading"].includes(state)) {
        assert.equal(await page.locator(".truth-bar").isVisible(), false, `${route} ${state}: the evidence bar is showing`);
      } else {
        assert.ok((await page.locator(selector).textContent()).trim().length > 18);
      }
      await page.close();
    }
  }
  observations.push("Every locked ready, stale, quiet, conflicted, loading, error and recovery label remains explicit on the production routes.");
}

async function verifyRepresentativeEngine(browserType, engine, viewports) {
  const browser = await browserType.launch({ headless: true });
  try {
    for (const [label, viewport] of viewports) {
      for (const [route, rootSelector] of [["/ai-brain", ".mm-locked-brain"]]) {
        const page = await openRoute(browser, route, rootSelector, `${engine} ${route} ${label}`, viewport, "?render=final");
        await page.waitForFunction(() => document.querySelectorAll(".meaning-node-s2").length === 20);
        await inspectBrainLayout(page, `${engine} ${route} ${label}`, { requireViewportFit: chapterFitViewports.has(label) });
        await page.close();
        console.log(`${engine} ${route} ${label}: pass`);
      }
    }
  } finally {
    await browser.close();
  }
}

async function captureEvidence(browser) {
  for (const [routeName, route, rootSelector] of [
    ["brain", "/ai-brain", ".mm-locked-brain"],
  ]) {
    for (const [label, viewport] of [["desktop-1440x900", { width: 1440, height: 900 }], ["mobile-390x844", { width: 390, height: 844 }]]) {
      const page = await openRoute(browser, route, rootSelector, `capture ${routeName} ${label}`, viewport, "?render=final");
      if (routeName === "brain") await page.waitForFunction(() => document.querySelectorAll(".meaning-node-s2").length === 20);
      await page.addStyleTag({ content: "html, body, .mm-locked-brain { scroll-behavior: auto !important; }" });
      await page.waitForFunction((selector) => {
        const rootElement = document.querySelector(selector);
        return rootElement?.dataset.activeFilm || rootElement?.dataset.motionPolicy === "poster";
      }, rootSelector);
      await page.waitForTimeout(350);
      await page.locator(`${rootSelector} video`).evaluateAll((videos) => videos.forEach((video) => video.pause()));
      await page.waitForTimeout(120);
      await page.screenshot({ path: `${output}/${routeName}-${label}-hero.png` });
      const section = routeName === "brain" ? "#correction" : ".instrument";
      await page.locator(section).scrollIntoViewIfNeeded();
      await page.waitForTimeout(450);
      await page.locator(`${rootSelector} video`).evaluateAll((videos) => videos.forEach((video) => video.pause()));
      await page.waitForTimeout(120);
      await page.screenshot({ path: `${output}/${routeName}-${label}-signature.png` });
      await page.close();
    }
  }
}

await mkdir(output, { recursive: true });
try {
  await startServer();
  console.log(`Using script-owned Mindmake server at ${origin}`);
  const chrome = await chromium.launch({ channel: "chrome", headless: true });
  try {
    for (const [label, viewport] of requiredViewports) {
      const brain = await openRoute(chrome, "/ai-brain", ".mm-locked-brain", `Chromium Brain ${label}`, viewport, "?render=final");
      await brain.waitForFunction(() => document.querySelectorAll(".meaning-node-s2").length === 20);
      await inspectBrainLayout(brain, `Chromium Brain ${label}`, { requireViewportFit: chapterFitViewports.has(label) });
      await brain.close();
      console.log(`Chromium ${label}: pass`);
    }
    observations.push("Chromium passes the locked Brain route at all eleven required viewports, including chapter fit, plaque centring, copy containment, target size, overflow and nested-scroll gates.");
    await verifyBrainInteractions(chrome);
    console.log("Chromium Brain interactions: pass");
    await verifyBrainClosingContrast(chrome);
    console.log("Chromium Brain closing contrast: pass");
    await verifyBrainFinePointerReflow(chrome);
    console.log("Chromium Brain fine-pointer reflow: pass");
    await verifyFallbacks(chrome);
    console.log("Chromium motion fallbacks: pass");
    await verifyEvidenceStates(chrome);
    console.log("Chromium evidence states: pass");
    await captureEvidence(chrome);
    console.log("Chromium evidence capture: pass");
  } finally {
    await chrome.close();
  }
  await verifyRepresentativeEngine(webkit, "WebKit", [requiredViewports[2], requiredViewports[4], requiredViewports[9]]);
  observations.push("WebKit passes representative narrow, tablet and desktop production-route geometry checks.");
  await verifyRepresentativeEngine(firefox, "Firefox", [requiredViewports[2], requiredViewports[9]]);
  observations.push("Firefox passes representative narrow and desktop production-route geometry checks.");
  assert.deepEqual(issues, [], issues.join("\n"));
  const report = {
    artifact: "mindmake-locked-material-production-v1",
    generatedAt: new Date().toISOString(),
    result: "pass",
    origin,
    output,
    candidate: await candidateIdentity(),
    chromiumViewports: requiredViewports.map(([label]) => label),
    webkitViewports: ["390x844", "768x1024", "1440x900"],
    firefoxViewports: ["390x844", "1440x900"],
    observations,
    physicalDevices: "not run; emulation does not satisfy the physical-device release gate",
  };
  await writeFile(`${output}/report.json`, `${JSON.stringify(report, null, 2)}\n`, "utf8");
  console.log(JSON.stringify(report, null, 2));
} finally {
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([
      new Promise((resolveExit) => server.once("exit", resolveExit)),
      delay(2000),
    ]);
  }
}
