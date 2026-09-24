import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.MM_BASE_URL || "http://127.0.0.1:4192";
const captureDir = "C:/Users/krish/.scratch/mindmake-responsive-system-r4";
const viewports = [
  { name: "phone-320", width: 320, height: 568 },
  { name: "phone-390", width: 390, height: 844 },
  { name: "phone-430", width: 430, height: 932 },
  { name: "tablet-768", width: 768, height: 1024 },
  { name: "laptop-1280", width: 1280, height: 720 },
  { name: "laptop-1366", width: 1366, height: 768 },
  { name: "desktop-1440-short", width: 1440, height: 700 },
  { name: "desktop-1440", width: 1440, height: 900 },
  { name: "desktop-1920", width: 1920, height: 1080 },
  { name: "desktop-wide", width: 2508, height: 1350 },
];

const failures = [];
const evidence = [];
const fail = (viewport, message) => failures.push(`${viewport}: ${message}`);
const closeTo = (a, b, tolerance = 2) => Math.abs(a - b) <= tolerance;

async function box(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
    };
  });
}

async function testBrain(page, viewport) {
  await page.goto(`${baseUrl}/ai-brain`, { waitUntil: "networkidle" });

  const documentWidth = await page.evaluate(() => ({
    client: document.documentElement.clientWidth,
    scroll: document.documentElement.scrollWidth,
  }));
  if (documentWidth.scroll > documentWidth.client + 1) {
    fail(viewport.name, `horizontal overflow ${documentWidth.scroll}px > ${documentWidth.client}px`);
  }

  const [nav, hero] = await Promise.all([
    box(page.locator(".mm-nav")),
    box(page.locator(".mm-brain-r5 .hero-copy")),
  ]);
  if (viewport.width > 960 && (!closeTo(nav.left, hero.left) || !closeTo(nav.right, hero.right))) {
    fail(viewport.name, `header and hero use different shells (${nav.left.toFixed(1)}-${nav.right.toFixed(1)} vs ${hero.left.toFixed(1)}-${hero.right.toFixed(1)})`);
  }

  const proofShell = page.locator(".mm-brain-r5 .proof-shell");
  if ((await proofShell.count()) !== 1) {
    fail(viewport.name, "proof section has no canonical proof-shell");
  } else {
    const proof = await box(page.locator(".mm-brain-r5 .proof"));
    const shell = await box(proofShell);
    if (viewport.width > 960 && (!closeTo(nav.left, shell.left) || !closeTo(nav.right, shell.right))) {
      fail(viewport.name, `header and proof use different shells (${nav.left.toFixed(1)}-${nav.right.toFixed(1)} vs ${shell.left.toFixed(1)}-${shell.right.toFixed(1)})`);
    }
    if (viewport.width <= 430 && proof.height > viewport.height * 1.35) {
      fail(viewport.name, `collapsed proof occupies ${(proof.height / viewport.height).toFixed(2)} screens`);
    }

    const visual = page.locator(".proof-story-visual");
    if ((await visual.count()) === 1) {
      const visualBox = await box(visual);
      if (visualBox.left < shell.left - 1 || visualBox.right > shell.right + 1) {
        fail(viewport.name, `proof visual escapes its shell (${visualBox.left.toFixed(1)}-${visualBox.right.toFixed(1)} outside ${shell.left.toFixed(1)}-${shell.right.toFixed(1)})`);
      }
    }
  }

  const storyTabs = page.locator("[role=tablist][aria-label='Client stories'] [role=tab]");
  const tabCount = await storyTabs.count();
  if (tabCount < 3) fail(viewport.name, `expected at least three case-study controls, found ${tabCount}`);
  if (tabCount >= 3) {
    const seen = new Set();
    const figures = new Set();
    for (let index = 0; index < tabCount; index += 1) {
      await storyTabs.nth(index).click();
      const id = await page.locator(".proof-story-card").getAttribute("data-story-id");
      if (id) seen.add(id);
      const figure = await page.locator(".proof-story-visual").getAttribute("data-figure");
      if (figure) figures.add(figure);
      const labelGeometry = await storyTabs.nth(index).evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        clientHeight: element.clientHeight,
        scrollHeight: element.scrollHeight,
      }));
      if (labelGeometry.scrollHeight > labelGeometry.clientHeight + 2) {
        fail(viewport.name, `case-study control ${index + 1} clips vertically`);
      }
      if (labelGeometry.scrollWidth > labelGeometry.clientWidth + 2) {
        fail(viewport.name, `case-study control ${index + 1} clips horizontally`);
      }
    }
    if (seen.size !== tabCount) fail(viewport.name, `case-study controls reached ${seen.size} of ${tabCount} stories`);
    if (figures.size !== tabCount) fail(viewport.name, `case-study controls reached ${figures.size} of ${tabCount} distinct visuals`);

    await storyTabs.first().click();
    await storyTabs.first().focus();
    await storyTabs.first().press("ArrowRight");
    if (await page.locator(".proof-story-card").getAttribute("data-story-id") !== "team-decides") {
      fail(viewport.name, "ArrowRight does not advance the active case study");
    }
    if (await page.evaluate(() => document.activeElement?.id) !== "proof-tab-team-decides") {
      fail(viewport.name, "keyboard navigation does not move focus with the active case study");
    }

    if (viewport.width <= 430) {
      await page.locator(".proof-story-card").evaluate((element) => {
        const dispatchTouch = (type, clientX, clientY) => {
          const event = new Event(type, { bubbles: true, cancelable: true });
          Object.defineProperty(event, type === "touchstart" ? "touches" : "changedTouches", {
            value: [{ clientX, clientY }],
          });
          element.dispatchEvent(event);
        };
        dispatchTouch("touchstart", 250, 200);
        dispatchTouch("touchend", 100, 204);
      });
      if (await page.locator(".proof-story-card").getAttribute("data-story-id") !== "hand-back") {
        fail(viewport.name, "horizontal swipe does not advance the active case study");
      }
    }

    await page.goto(`${baseUrl}/ai-brain#case-team-decides`, { waitUntil: "networkidle" });
    if (await page.locator(".proof-story-card").getAttribute("data-story-id") !== "team-decides") {
      fail(viewport.name, "case-study deep link does not restore the requested story");
    }
  }

  const evidenceButton = page.getByRole("button", { name: /Evidence/i }).first();
  await evidenceButton.scrollIntoViewIfNeeded();
  await evidenceButton.click();
  await page.waitForTimeout(250);
  const cards = page.locator(".brain-evidence-panel.is-active .brain-evidence > *");
  const cardCount = await cards.count();
  if (viewport.width > 960 && cardCount === 4) {
    const cardBoxes = [];
    const labelOffsets = [];
    const headlineOffsets = [];
    for (let index = 0; index < cardCount; index += 1) {
      const card = cards.nth(index);
      const cardBox = await box(card);
      cardBoxes.push(cardBox);
      labelOffsets.push((await box(card.locator(":scope > small"))).top - cardBox.top);
      headlineOffsets.push((await box(card.locator(":scope > strong"))).top - cardBox.top);
      if (cardBox.scrollHeight > cardBox.clientHeight + 2) fail(viewport.name, `evidence card ${index + 1} clips vertically`);
    }
    const heightSpread = Math.max(...cardBoxes.map((item) => item.height)) - Math.min(...cardBoxes.map((item) => item.height));
    const labelSpread = Math.max(...labelOffsets) - Math.min(...labelOffsets);
    const headlineSpread = Math.max(...headlineOffsets) - Math.min(...headlineOffsets);
    if (heightSpread > 2) fail(viewport.name, `evidence card heights differ by ${heightSpread.toFixed(1)}px`);
    if (labelSpread > 2) fail(viewport.name, `evidence labels differ by ${labelSpread.toFixed(1)}px`);
    if (headlineSpread > 2) fail(viewport.name, `evidence headlines differ by ${headlineSpread.toFixed(1)}px`);
  }

  await page.screenshot({ path: `${captureDir}/${viewport.name}-brain-system.png`, fullPage: false });
  evidence.push({ viewport: viewport.name, nav, hero, storyTabs: tabCount });
}

await mkdir(captureDir, { recursive: true });
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.PLAYWRIGHT_CHROMIUM || "C:/Program Files/Google/Chrome/Application/chrome.exe",
});

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await testBrain(page, viewport);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ artifact: "mindmake-responsive-system-r4", baseUrl, captureDir, viewports, evidence, failures }, null, 2));
if (failures.length) process.exitCode = 1;
