#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const base = flag("base", "http://127.0.0.1:4192/ai-brain");
const output = "C:/Users/krish/.scratch/mindmake-ai-brain-production";
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "boundary-961x700", width: 961, height: 700 },
  { name: "boundary-960x700", width: 960, height: 700 },
  { name: "intermediate-834x814", width: 834, height: 814 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-375x812", width: 375, height: 812 },
  { name: "compact-320x568", width: 320, height: 568 },
  { name: "landscape-844x390", width: 844, height: 390 },
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const observations = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

async function textLines(locator) {
  return locator.evaluate((element) => {
    const words = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      for (const match of node.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) words.push({ text: match[0], top: rect.top });
      }
    }
    return words.reduce((lines, word) => {
      const line = lines.find((candidate) => Math.abs(candidate.top - word.top) < 2);
      if (line) line.words.push(word.text);
      else lines.push({ top: word.top, words: [word.text] });
      return lines;
    }, []).map((line) => line.words);
  });
}

function checkLines(name, lines, maximum) {
  fail(lines.length > maximum, `${name}: uses ${lines.length} lines`);
  let run = 0;
  let longest = 0;
  for (const line of lines) {
    run = line.length === 1 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  fail(longest >= 3, `${name}: spiders through ${longest} consecutive one-word lines`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const firstScreen = await page.evaluate(() => {
    const hero = document.querySelector(".mm-brain-hero").getBoundingClientRect();
    const brand = document.querySelector(".mm-header .mm-brand").getBoundingClientRect();
    const menu = document.querySelector(".mm-menu-button").getBoundingClientRect();
    const action = document.querySelector(".mm-brain-hero [data-mm-primary]").getBoundingClientRect();
    return {
      bodyText: document.body.innerText.trim().length,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      pageScreens: document.documentElement.scrollHeight / innerHeight,
      heroHeight: hero.height,
      heroTop: hero.top,
      brandWidth: brand.width,
      headerCentreDifference: Math.abs((brand.top + brand.height / 2) - (menu.top + menu.height / 2)),
      actionInsideHero: action.top >= hero.top && action.bottom <= hero.bottom,
      errorOverlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
    };
  });
  fail(firstScreen.bodyText < 600, `${viewport.name}: page is blank or missing content`);
  fail(firstScreen.horizontalOverflow > 1, `${viewport.name}: horizontal overflow ${firstScreen.horizontalOverflow}px`);
  fail(firstScreen.pageScreens < 6 || firstScreen.pageScreens > 9, `${viewport.name}: route length is ${firstScreen.pageScreens.toFixed(2)} screens`);
  fail(Math.abs(firstScreen.heroTop) > 1 || Math.abs(firstScreen.heroHeight - viewport.height) > 2, `${viewport.name}: hero does not own exactly the opening screen`);
  fail(firstScreen.brandWidth < 120, `${viewport.name}: brand is not legible at ${firstScreen.brandWidth.toFixed(1)}px wide`);
  fail(firstScreen.headerCentreDifference > 3, `${viewport.name}: brand and menu centres differ by ${firstScreen.headerCentreDifference.toFixed(1)}px`);
  fail(!firstScreen.actionInsideHero, `${viewport.name}: primary action falls outside the hero`);
  fail(firstScreen.errorOverlay || consoleErrors.length > 0, `${viewport.name}: runtime errors ${consoleErrors.join(" | ")}`);
  checkLines(`${viewport.name} hero`, await textLines(page.locator("#brain-title")), 4);
  checkLines(`${viewport.name} decision heading`, await textLines(page.locator("#decision-sequence-title")), 5);

  const pageGrid = await page.evaluate(() => {
    const selectors = {
      header: ".mm-header .mm-brand",
      hero: "#brain-title",
      decision: "#decision-sequence-title",
      proof: "#brain-proof-title",
      kept: "#brain-kept-title",
      close: "#brain-close-title",
      footer: ".mm-footer .mm-brand",
    };
    const anchors = Object.fromEntries(Object.entries(selectors).map(([name, selector]) => [
      name,
      document.querySelector(selector).getBoundingClientRect().left,
    ]));
    const values = Object.values(anchors);
    return { anchors, spread: Math.max(...values) - Math.min(...values) };
  });
  fail(pageGrid.spread > 2, `${viewport.name}: page grid anchors diverge by ${pageGrid.spread.toFixed(1)}px (${JSON.stringify(pageGrid.anchors)})`);
  await page.screenshot({ path: `${output}/${viewport.name}-hero-verified.png`, fullPage: false });

  for (let nextStage = 0; nextStage < 4; nextStage += 1) {
    await page.locator(".mm-brain-stage-nav button").nth(nextStage).click();
    await page.waitForTimeout(600);
    const state = await page.evaluate((expected) => {
      const active = document.querySelectorAll(".mm-brain-state-panel.is-active");
      const panel = document.querySelector(`.mm-brain-state-panel[data-panel="${expected}"]`).getBoundingClientRect();
      const sheet = document.querySelector(".mm-brain-decision-sheet").getBoundingClientRect();
      const panelElement = document.querySelector(`.mm-brain-state-panel[data-panel="${expected}"]`);
      const chromeElement = document.querySelector(".mm-brain-sheet-chrome");
      return {
        activeCount: active.length,
        current: [...document.querySelectorAll(".mm-brain-stage-nav button")].findIndex((button) => button.getAttribute("aria-current") === "step"),
        exposed: document.querySelectorAll('.mm-brain-state-panel:not([aria-hidden="true"])').length,
        panel: { top: panel.top, right: panel.right, bottom: panel.bottom, left: panel.left },
        sheet: { top: sheet.top, right: sheet.right, bottom: sheet.bottom, left: sheet.left },
        localPanelTop: panelElement.offsetTop,
        localChromeBottom: chromeElement.offsetTop + chromeElement.offsetHeight,
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, nextStage);
    fail(state.activeCount !== 1 || state.current !== nextStage || state.exposed !== 1, `${viewport.name}: stage ${nextStage} is not the sole current state`);
    fail(state.localPanelTop < state.localChromeBottom - 1, `${viewport.name}: stage ${nextStage} overlaps the sheet chrome`);
    fail(state.panel.left < state.sheet.left - 1 || state.panel.right > state.sheet.right + 1 || state.panel.bottom > state.sheet.bottom + 1, `${viewport.name}: stage ${nextStage} leaves the decision sheet`);
    fail(state.horizontalOverflow > 1, `${viewport.name}: stage ${nextStage} creates horizontal overflow`);
    checkLines(`${viewport.name} stage ${nextStage}`, await textLines(page.locator(`.mm-brain-state-panel[data-panel="${nextStage}"] h3`)), viewport.width <= 390 ? 5 : 4);
    if (["desktop-1440x900", "mobile-390x844", "compact-320x568", "landscape-844x390"].includes(viewport.name)) {
      await page.screenshot({ path: `${output}/${viewport.name}-stage-${nextStage}-verified.png`, fullPage: false });
    }
  }

  await page.locator(".mm-brain-proof-disclosure").click();
  const proof = await page.evaluate(() => ({
    expanded: document.querySelector(".mm-brain-proof-disclosure").getAttribute("aria-expanded"),
    quote: document.querySelector("#founder-proof")?.textContent ?? "",
  }));
  fail(proof.expanded !== "true" || !proof.quote.includes("once a month") || !proof.quote.includes("most days"), `${viewport.name}: evidence disclosure is incomplete`);

  await page.locator(".mm-brain-close [data-mm-primary]").click();
  await page.locator('.mm-brief-panel[role="dialog"]').waitFor();
  await page.waitForTimeout(400);
  const drawer = await page.evaluate(() => {
    const panel = document.querySelector(".mm-brief-panel").getBoundingClientRect();
    const action = document.querySelector(".mm-brief-panel [data-mm-primary]")?.getBoundingClientRect();
    return {
      left: panel.left,
      right: panel.right,
      top: panel.top,
      bottom: panel.bottom,
      actionBottom: action?.bottom ?? 0,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      focused: document.activeElement?.tagName,
      url: location.href,
      backgroundInert: document.querySelector(".mm-brain-hero").inert,
      presentation: document.querySelector(".mm-brief-panel").dataset.presentation,
    };
  });
  fail(drawer.left < -1 || drawer.right > drawer.viewportWidth + 1 || drawer.top < -1 || drawer.bottom > drawer.viewportHeight + 1, `${viewport.name}: drawer leaves the viewport`);
  fail(drawer.actionBottom > drawer.viewportHeight + 1, `${viewport.name}: drawer action underlaps bottom chrome`);
  fail(!["INPUT", "H2"].includes(drawer.focused) || !drawer.backgroundInert, `${viewport.name}: drawer focus or background isolation failed`);
  fail(drawer.presentation !== "drawer" || !drawer.url.includes("start=brain"), `${viewport.name}: Brain drawer loses its route state`);
  if (["desktop-1440x900", "mobile-390x844", "compact-320x568", "landscape-844x390"].includes(viewport.name)) {
    await page.screenshot({ path: `${output}/${viewport.name}-drawer-verified.png`, fullPage: false });
  }
  await page.keyboard.press("Escape");
  await page.locator('.mm-brief-panel[role="dialog"]').waitFor({ state: "detached" });
  fail(page.url().includes("start="), `${viewport.name}: closing the drawer leaves start state in the URL`);

  if (["desktop-1440x900", "mobile-390x844", "compact-320x568", "landscape-844x390"].includes(viewport.name)) {
    await page.locator(".mm-footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${output}/${viewport.name}-close-footer-verified.png`, fullPage: false });
  }

  observations.push({ viewport: viewport.name, pageScreens: Number(firstScreen.pageScreens.toFixed(2)) });
  await page.close();
}

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
await reduced.goto(base, { waitUntil: "networkidle" });
const reducedState = await reduced.evaluate(() => ({
  sequencePosition: getComputedStyle(document.querySelector(".mm-brain-decision-sticky")).position,
  exposedPanels: document.querySelectorAll('.mm-brain-state-panel:not([aria-hidden="true"])').length,
  staticPanels: [...document.querySelectorAll(".mm-brain-state-panel")].filter((panel) => getComputedStyle(panel).position !== "absolute").length,
  videos: document.querySelectorAll(".mm-brain-vnext video").length,
  horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
fail(reducedState.sequencePosition === "sticky", "reduced motion: decision sequence still pins");
fail(reducedState.exposedPanels !== 4 || reducedState.staticPanels !== 4, "reduced motion: all four decision states are not readable together");
fail(reducedState.videos !== 0, `reduced motion: ${reducedState.videos} video elements mounted`);
fail(reducedState.horizontalOverflow > 1, "reduced motion: horizontal overflow");
await reduced.screenshot({ path: `${output}/mobile-390x844-reduced-verified.png`, fullPage: true });
await reduced.close();

const deepLink = await browser.newPage({ viewport: { width: 390, height: 844 } });
await deepLink.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
await deepLink.goto(`${base}?start=brain`, { waitUntil: "networkidle" });
await deepLink.locator('.mm-brief-panel[role="dialog"]').waitFor();
fail((await deepLink.locator("#mm-brief-title").textContent()) !== "Which business should we read?", "deep link: live Brain brief does not open on the company step");
await deepLink.close();

await browser.close();
console.log(JSON.stringify({ artifact: "production-ai-brain-vnext", viewports: observations, screenshotDirectory: output, failures }, null, 2));
if (failures.length) process.exitCode = 1;
