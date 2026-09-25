import { chromium } from "playwright";
import { mkdir } from "node:fs/promises";

const baseUrl = process.env.MM_BASE_URL || "http://127.0.0.1:4192";
const captureDir = "C:/Users/krish/.scratch/mindmake-responsive-r3";
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

function fail(viewport, route, message) {
  failures.push(`${viewport} ${route}: ${message}`);
}

async function box(locator) {
  return locator.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      left: rect.left,
      width: rect.width,
      height: rect.height,
      clientHeight: element.clientHeight,
      scrollHeight: element.scrollHeight,
      clientWidth: element.clientWidth,
      scrollWidth: element.scrollWidth,
      display: style.display,
      visibility: style.visibility,
      opacity: Number(style.opacity),
    };
  });
}

function intersects(a, b, tolerance = 1) {
  return a.left < b.right - tolerance && a.right > b.left + tolerance && a.top < b.bottom - tolerance && a.bottom > b.top + tolerance;
}

async function assertNoHorizontalOverflow(page, viewport, route) {
  const geometry = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  if (geometry.scrollWidth > geometry.clientWidth + 1) {
    fail(viewport, route, `horizontal overflow ${geometry.scrollWidth}px > ${geometry.clientWidth}px`);
  }
}

async function testBrain(page, viewport) {
  const route = "/ai-brain";
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await assertNoHorizontalOverflow(page, viewport.name, route);

  const hero = page.locator(".mm-brain-stable .hero");
  const heroButton = hero.locator("[data-mm-primary]");
  const [heroBox, buttonBox] = await Promise.all([box(hero), box(heroButton)]);
  if (buttonBox.bottom > heroBox.bottom - 28) {
    fail(viewport.name, route, `hero action has only ${(heroBox.bottom - buttonBox.bottom).toFixed(1)}px bottom clearance`);
  }

  const evidenceButton = page.getByRole("button", { name: /Evidence/i }).first();
  await evidenceButton.scrollIntoViewIfNeeded();
  await evidenceButton.click();
  await page.waitForTimeout(500);
  const cards = page.locator(".brain-evidence-panel.is-active .brain-evidence > *");
  const count = await cards.count();
  const cardBoxes = [];
  for (let index = 0; index < count; index += 1) {
    const card = cards.nth(index);
    const cardBox = await box(card);
    cardBoxes.push(cardBox);
    if (cardBox.scrollHeight > cardBox.clientHeight + 2) {
      fail(viewport.name, route, `evidence card ${index + 1} clips ${cardBox.scrollHeight - cardBox.clientHeight}px vertically`);
    }
    const textParts = card.locator(":scope > small, :scope > strong, :scope > span");
    const textCount = await textParts.count();
    const textBoxes = [];
    for (let textIndex = 0; textIndex < textCount; textIndex += 1) textBoxes.push(await box(textParts.nth(textIndex)));
    for (let a = 0; a < textBoxes.length; a += 1) {
      for (let b = a + 1; b < textBoxes.length; b += 1) {
        if (intersects(textBoxes[a], textBoxes[b], 2)) fail(viewport.name, route, `evidence card ${index + 1} text layers overlap`);
      }
    }
  }

  await page.screenshot({ path: `${captureDir}/${viewport.name}-brain-evidence.png`, fullPage: false });
  evidence.push({ viewport: viewport.name, route, heroClearance: Math.round(heroBox.bottom - buttonBox.bottom), cards: cardBoxes.map((item) => Math.round(item.height)) });
}

async function testGtm(page, viewport) {
  const route = "/ai-gtm";
  await page.goto(`${baseUrl}${route}`, { waitUntil: "networkidle" });
  await assertNoHorizontalOverflow(page, viewport.name, route);

  await page.getByRole("button", { name: "Open navigation" }).click();
  await page.waitForTimeout(180);
  const menu = await box(page.locator("#mindmake-menu .mm-menu-routes"));
  if (menu.top < 0 || menu.bottom > viewport.height + 1) fail(viewport.name, route, `navigation does not fit the viewport (${menu.top.toFixed(1)}–${menu.bottom.toFixed(1)})`);
  for (const label of ["Build your AI brain", "Build your AI GTM", "Results", "Thinking", "Questions leaders ask", "Before you start", "Media"]) {
    if (!(await page.locator("#mindmake-menu .mm-menu-routes").getByText(label, { exact: true }).count())) fail(viewport.name, route, `navigation is missing ${label}`);
  }
  if (!(await page.locator("#mindmake-menu").getByRole("button", { name: "Get your free AI brief" }).count())) fail(viewport.name, route, "navigation is missing the start action");
  await page.getByRole("button", { name: "Close navigation" }).click();
  await page.waitForTimeout(180);

  const label = page.locator(".mm-gtm-r7 .wire-label > span");
  const date = page.locator(".mm-gtm-r7 .wire-label time");
  const [labelBox, dateBox] = await Promise.all([box(label), box(date)]);
  const labelMid = (labelBox.top + labelBox.bottom) / 2;
  const dateMid = (dateBox.top + dateBox.bottom) / 2;
  if (Math.abs(labelMid - dateMid) > 3) fail(viewport.name, route, `ticker label/date are misaligned by ${Math.abs(labelMid - dateMid).toFixed(1)}px`);

  const decision = page.locator(".mm-gtm-r7 .decision");
  if (viewport.width > 1280) {
    const decisionTop = await decision.evaluate((element) => element.offsetTop);
    const travel = await decision.evaluate((element) => element.offsetHeight - innerHeight);
    for (const sample of [
      { progress: .12, phase: "0" },
      { progress: .5, phase: "1" },
      { progress: .88, phase: "2" },
    ]) {
      await page.evaluate(({ top, offset }) => scrollTo(0, top + offset), { top: decisionTop, offset: travel * sample.progress });
      await page.waitForTimeout(700);
      const phase = await decision.getAttribute("data-phase");
      if (phase !== sample.phase) fail(viewport.name, route, `scroll progress ${sample.progress} resolved to phase ${phase}, expected ${sample.phase}`);
      const chapters = page.locator(".decision-chapter");
      for (let index = 0; index < 3; index += 1) {
        const chapterBox = await box(chapters.nth(index));
        const expectedVisible = String(index) === sample.phase;
        if (expectedVisible && (chapterBox.visibility !== "visible" || chapterBox.opacity < .95)) fail(viewport.name, route, `phase ${sample.phase} chapter is not fully visible`);
        if (!expectedVisible && chapterBox.visibility === "visible" && chapterBox.opacity > .05) fail(viewport.name, route, `phase ${sample.phase} leaves chapter ${index} visually competing`);
      }
      if (["desktop-1440-short", "desktop-1440", "desktop-wide"].includes(viewport.name)) {
        await page.screenshot({ path: `${captureDir}/${viewport.name}-gtm-phase-${sample.phase}.png`, fullPage: false });
      }
    }
  } else {
    await decision.scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${captureDir}/${viewport.name}-gtm-decision.png`, fullPage: false });
  }

  await page.locator(".mm-gtm-r7 .proof").evaluate((element) => window.scrollTo({ top: element.offsetTop, behavior: "instant" }));
  await page.waitForTimeout(150);
  const headerBox = await box(page.locator(".mm-header"));
  const proofCopy = await box(page.locator(".mm-gtm-r7 .proof-copy"));
  if (viewport.width > 960) {
    if (proofCopy.top < headerBox.bottom + 4) fail(viewport.name, route, `paid proof begins under the header (${proofCopy.top.toFixed(1)}px)`);
    if (proofCopy.bottom > viewport.height - 8) fail(viewport.name, route, `paid proof runs ${(proofCopy.bottom - viewport.height).toFixed(1)}px below the viewport`);
  }

  await page.screenshot({ path: `${captureDir}/${viewport.name}-gtm-proof.png`, fullPage: false });
  evidence.push({ viewport: viewport.name, route, tickerDelta: Math.round(Math.abs(labelMid - dateMid) * 10) / 10, proofTop: Math.round(proofCopy.top), proofBottom: Math.round(proofCopy.bottom) });
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
    await testGtm(page, viewport);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(JSON.stringify({ artifact: "mindmake-responsive-release-r3", baseUrl, captureDir, viewports, evidence, failures }, null, 2));
if (failures.length) process.exitCode = 1;
