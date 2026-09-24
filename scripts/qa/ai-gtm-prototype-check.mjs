#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const base = flag("base", "http://127.0.0.1:4192/prototypes/ai-gtm-vnext-r1/");
const output = "C:/Users/krish/.scratch/mindmake-ai-gtm-vnext-r1";
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
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const opening = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const brand = document.querySelector(".brand").getBoundingClientRect();
    const menu = document.querySelector(".menu-trigger").getBoundingClientRect();
    const action = document.querySelector(".hero .primary-action").getBoundingClientRect();
    const selectors = [".brand", "#heroTitle", "#sequenceTitle", "#marketTitle", "#proofTitle", "#closeTitle", ".site-footer>img"];
    const anchors = selectors.map((selector) => document.querySelector(selector).getBoundingClientRect().left);
    return {
      bodyText: document.body.innerText.trim().length,
      heroTop: hero.top,
      heroHeight: hero.height,
      actionInsideHero: action.top >= hero.top && action.bottom <= hero.bottom,
      headerCentres: Math.abs((brand.top + brand.height / 2) - (menu.top + menu.height / 2)),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      pageScreens: document.documentElement.scrollHeight / innerHeight,
      anchorSpread: Math.max(...anchors) - Math.min(...anchors),
    };
  });
  fail(opening.bodyText < 650, `${viewport.name}: content is missing`);
  fail(Math.abs(opening.heroTop) > 1 || Math.abs(opening.heroHeight - viewport.height) > 2, `${viewport.name}: hero does not own exactly one opening screen`);
  fail(!opening.actionInsideHero, `${viewport.name}: hero action leaves the opening screen`);
  fail(opening.headerCentres > 2, `${viewport.name}: header brand and menu misalign by ${opening.headerCentres.toFixed(1)}px`);
  fail(opening.horizontalOverflow > 1, `${viewport.name}: horizontal overflow ${opening.horizontalOverflow}px`);
  fail(opening.pageScreens < 6 || opening.pageScreens > 9, `${viewport.name}: route length is ${opening.pageScreens.toFixed(2)} screens`);
  fail(opening.anchorSpread > 2, `${viewport.name}: page grid anchors diverge by ${opening.anchorSpread.toFixed(1)}px`);
  fail(consoleErrors.length > 0, `${viewport.name}: runtime errors ${consoleErrors.join(" | ")}`);
  checkLines(`${viewport.name} hero`, await textLines(page.locator("#heroTitle")), viewport.width <= 390 ? 5 : 4);
  checkLines(`${viewport.name} sequence`, await textLines(page.locator("#sequenceTitle")), 4);
  await page.screenshot({ path: `${output}/${viewport.name}-hero.png`, fullPage: false });

  await page.locator("#menuTrigger").click();
  fail((await page.locator("#menuTrigger").getAttribute("aria-expanded")) !== "true", `${viewport.name}: menu does not expose open state`);
  fail(!(await page.locator("main").evaluate((element) => element.inert)), `${viewport.name}: menu does not isolate the page`);
  if (["desktop-1440x900", "mobile-390x844", "compact-320x568", "landscape-844x390"].includes(viewport.name)) {
    await page.screenshot({ path: `${output}/${viewport.name}-menu.png`, fullPage: false });
  }
  await page.keyboard.press("Escape");

  for (let stage = 0; stage < 4; stage += 1) {
    await page.locator(`[data-stage="${stage}"]`).click();
    await page.waitForTimeout(1000);
    const state = await page.evaluate((expected) => {
      const sheet = document.querySelector(".offer-sheet").getBoundingClientRect();
      const panelElement = document.querySelector(`[data-panel="${expected}"]`);
      const panel = panelElement.getBoundingClientRect();
      const childrenContained = [...panelElement.children].every((child) => {
        const rect = child.getBoundingClientRect();
        return rect.top >= panel.top - 1 && rect.right <= panel.right + 1 && rect.bottom <= panel.bottom + 1 && rect.left >= panel.left - 1;
      });
      return {
        current: Number(document.querySelector('[data-stage][aria-current="step"]')?.dataset.stage),
        exposed: document.querySelectorAll('.lever-panel[aria-hidden="false"]').length,
        sheet: { top: sheet.top, right: sheet.right, bottom: sheet.bottom, left: sheet.left },
        panel: { top: panel.top, right: panel.right, bottom: panel.bottom, left: panel.left },
        panelOverflow: Math.max(panelElement.scrollHeight - panelElement.clientHeight, panelElement.scrollWidth - panelElement.clientWidth),
        childrenContained,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, stage);
    fail(state.current !== stage || state.exposed !== 1, `${viewport.name}: lever ${stage} is not the sole current state`);
    fail(state.panelOverflow > 1 || !state.childrenContained, `${viewport.name}: lever ${stage} content leaves its panel`);
    fail(state.overflow > 1, `${viewport.name}: lever ${stage} creates overflow`);
    checkLines(`${viewport.name} lever ${stage}`, await textLines(page.locator(`[data-panel="${stage}"] h3`)), viewport.width <= 390 ? 4 : 3);
    await page.screenshot({ path: `${output}/${viewport.name}-lever-${stage}.png`, fullPage: false });
  }

  await page.locator(".close [data-open-start]").click();
  await page.locator("#startLayer:not([hidden])").waitFor();
  const drawer = await page.evaluate(() => {
    const panel = document.querySelector(".start-drawer").getBoundingClientRect();
    const action = document.querySelector(".drawer-action").getBoundingClientRect();
    return {
      left: panel.left,
      right: panel.right,
      top: panel.top,
      bottom: panel.bottom,
      actionBottom: action.bottom,
      viewportWidth: innerWidth,
      viewportHeight: innerHeight,
      focused: document.activeElement?.id,
      backgroundInert: document.querySelector("main").inert && document.querySelector(".site-footer").inert,
      internalOverflow: document.querySelector(".start-drawer").scrollHeight - document.querySelector(".start-drawer").clientHeight,
    };
  });
  fail(drawer.left < -1 || drawer.right > drawer.viewportWidth + 1 || drawer.top < -1 || drawer.bottom > drawer.viewportHeight + 1, `${viewport.name}: drawer leaves viewport`);
  fail(drawer.actionBottom > drawer.viewportHeight - 8, `${viewport.name}: drawer action underlaps bottom chrome`);
  fail(drawer.focused !== "workEmail" || !drawer.backgroundInert, `${viewport.name}: drawer focus or isolation failed`);
  fail(drawer.internalOverflow > 1, `${viewport.name}: drawer has ${drawer.internalOverflow}px internal overflow`);
  await page.screenshot({ path: `${output}/${viewport.name}-drawer.png`, fullPage: false });
  await page.locator(".drawer-action").click();
  fail((await page.locator("#emailError").evaluate((element) => element.hidden)), `${viewport.name}: empty submission has no recovery message`);
  const recovery = await page.evaluate(() => {
    const panel = document.querySelector(".start-drawer");
    const action = document.querySelector(".drawer-action").getBoundingClientRect();
    return {
      actionBottom: action.bottom,
      viewportHeight: innerHeight,
      internalOverflow: panel.scrollHeight - panel.clientHeight,
    };
  });
  fail(recovery.actionBottom > recovery.viewportHeight - 8, `${viewport.name}: validation recovery underlaps bottom chrome`);
  fail(recovery.internalOverflow > 1, `${viewport.name}: validation recovery creates ${recovery.internalOverflow}px drawer overflow`);
  if (["desktop-1440x900", "mobile-390x844", "compact-320x568", "landscape-844x390"].includes(viewport.name)) {
    await page.screenshot({ path: `${output}/${viewport.name}-drawer-error.png`, fullPage: false });
  }
  await page.keyboard.press("Escape");
  if (["desktop-1440x900", "mobile-390x844", "compact-320x568", "landscape-844x390"].includes(viewport.name)) {
    await page.locator(".market").screenshot({ path: `${output}/${viewport.name}-market.png` });
    await page.locator(".proof").screenshot({ path: `${output}/${viewport.name}-proof.png` });
    await page.locator(".close").screenshot({ path: `${output}/${viewport.name}-close.png` });
    await page.locator(".site-footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${output}/${viewport.name}-close-footer.png`, fullPage: false });
  }

  observations.push({ viewport: viewport.name, pageScreens: Number(opening.pageScreens.toFixed(2)) });
  await page.close();
}

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.goto(base, { waitUntil: "networkidle" });
const reducedState = await reduced.evaluate(() => ({
  sticky: getComputedStyle(document.querySelector(".offer-sticky")).position,
  exposed: document.querySelectorAll('.lever-panel:not([aria-hidden="true"])').length,
  staticPanels: [...document.querySelectorAll(".lever-panel")].filter((panel) => getComputedStyle(panel).position !== "absolute").length,
  videos: document.querySelectorAll("video").length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
fail(reducedState.sticky === "sticky", "reduced motion: offer sequence still pins");
fail(reducedState.exposed !== 4 || reducedState.staticPanels !== 4, "reduced motion: all four levers are not readable");
fail(reducedState.overflow > 1, "reduced motion: horizontal overflow");
await reduced.screenshot({ path: `${output}/mobile-390x844-reduced.png`, fullPage: true });
await reduced.close();

const review = await browser.newPage({ viewport: { width: 1180, height: 760 } });
await review.goto(`${base}review.html`, { waitUntil: "networkidle" });
fail((await review.locator("iframe").count()) !== 2, "paired review: expected desktop and mobile frames");
await review.screenshot({ path: `${output}/paired-review.png`, fullPage: true });
await review.close();

await browser.close();
console.log(JSON.stringify({ artifact: "ai-gtm-vnext-r1", viewports: observations, screenshotDirectory: output, failures }, null, 2));
if (failures.length) process.exitCode = 1;
