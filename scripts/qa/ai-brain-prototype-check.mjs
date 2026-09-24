#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const base = flag("base", "http://127.0.0.1:4192/prototypes/ai-brain-vnext-r1/");
const output = "C:/Users/krish/.scratch/mindmake-ai-brain-vnext-r1";
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "drawer-boundary-901x700", width: 901, height: 700 },
  { name: "drawer-boundary-900x700", width: 900, height: 700 },
  { name: "intermediate-834x814", width: 834, height: 814 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-375x812", width: 375, height: 812 },
  { name: "mobile-320x568", width: 320, height: 568 },
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

function checkLines(name, lines, maxLines = 5) {
  fail(lines.length > maxLines, `${name}: uses ${lines.length} lines`);
  let run = 0;
  let longest = 0;
  for (const line of lines) {
    run = line.length === 1 ? run + 1 : 0;
    longest = Math.max(longest, run);
  }
  fail(longest >= 3, `${name}: spiders through ${longest} one-word lines`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const consoleErrors = [];
  page.on("console", (message) => { if (message.type() === "error") consoleErrors.push(message.text()); });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  await page.goto(base, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => scrollTo(0, Math.min(240, document.documentElement.scrollHeight - innerHeight)));
  await page.waitForTimeout(120);
  fail((await page.evaluate(() => scrollY)) < 100, `${viewport.name}: early user scroll is reset`);
  await page.evaluate(() => scrollTo(0, 0));

  const metrics = await page.evaluate(() => ({
    bodyText: document.body.innerText.trim().length,
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    pageScreens: document.documentElement.scrollHeight / innerHeight,
    errorOverlay: Boolean(document.querySelector(".vite-error-overlay, #webpack-dev-server-client-overlay")),
    controls: [...document.querySelectorAll("button, a[href], input")].map((element) => {
      const rect = element.getBoundingClientRect();
      return { text: element.textContent?.trim().slice(0, 30), width: rect.width, height: rect.height, visible: rect.width > 0 && rect.height > 0 && rect.bottom > 0 && rect.top < innerHeight };
    }),
  }));
  fail(metrics.bodyText < 500, `${viewport.name}: page is blank or missing content`);
  fail(metrics.horizontalOverflow > 1, `${viewport.name}: horizontal overflow ${metrics.horizontalOverflow}px`);
  fail(metrics.errorOverlay, `${viewport.name}: Vite error overlay present`);
  fail(consoleErrors.length > 0, `${viewport.name}: console errors ${consoleErrors.join(" | ")}`);
  fail(metrics.controls.some((control) => control.visible && control.height < 44), `${viewport.name}: visible control below 44px`);
  fail(metrics.pageScreens < 5 || metrics.pageScreens > 9, `${viewport.name}: route length is ${metrics.pageScreens.toFixed(2)} screens`);
  checkLines(`${viewport.name} hero`, await textLines(page.locator("#heroTitle")), 4);
  checkLines(`${viewport.name} sequence heading`, await textLines(page.locator("#sequenceTitle")), 5);

  await page.screenshot({ path: `${output}/${viewport.name}-hero.png`, fullPage: false });

  await page.locator("#menuTrigger").click();
  fail((await page.locator("#menuTrigger").getAttribute("aria-expanded")) !== "true", `${viewport.name}: menu trigger does not expose open state`);
  await page.locator("[data-close-menu]").last().click();
  fail((await page.locator("#menuTrigger").getAttribute("aria-expanded")) !== "false", `${viewport.name}: menu trigger does not expose closed state`);

  for (let stage = 0; stage < 4; stage += 1) {
    await page.locator(`[data-stage="${stage}"]`).click();
    await page.waitForTimeout(900);
    const stageMetrics = await page.evaluate((expected) => {
      const sheet = document.querySelector(".decision-sheet").getBoundingClientRect();
      const panel = document.querySelector(`[data-panel="${expected}"]`).getBoundingClientRect();
      const current = document.querySelector('[data-stage][aria-current="step"]');
      return {
        current: Number(current?.dataset.stage),
        sheet: { top: sheet.top, right: sheet.right, bottom: sheet.bottom, left: sheet.left },
        panel: { top: panel.top, right: panel.right, bottom: panel.bottom, left: panel.left },
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    }, stage);
    fail(stageMetrics.current !== stage, `${viewport.name}: stage ${stage} did not become current`);
    fail(stageMetrics.horizontalOverflow > 1, `${viewport.name}: stage ${stage} creates horizontal overflow`);
    fail(stageMetrics.panel.right > stageMetrics.sheet.right + 1 || stageMetrics.panel.bottom > stageMetrics.sheet.bottom + 1, `${viewport.name}: stage ${stage} content leaves decision sheet`);
    checkLines(`${viewport.name} stage ${stage}`, await textLines(page.locator(`[data-panel="${stage}"] h3`)), viewport.width <= 390 ? 5 : 4);
    fail((await page.locator('.state-panel[aria-hidden="false"]').count()) !== 1, `${viewport.name}: stage ${stage} exposes overlapping panels`);
    if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) {
      await page.screenshot({ path: `${output}/${viewport.name}-stage-${stage}.png`, fullPage: false });
    }
  }

  await page.locator(".proof-disclosure").click();
  const proofState = await page.evaluate(() => ({
    expanded: document.querySelector(".proof-disclosure").getAttribute("aria-expanded"),
    hidden: document.querySelector("#founderProof").hidden,
    quote: document.querySelector("#founderProof").textContent.trim(),
  }));
  fail(proofState.expanded !== "true" || proofState.hidden || !proofState.quote.includes("once a month"), `${viewport.name}: proof disclosure does not reveal attributed evidence`);
  if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) await page.screenshot({ path: `${output}/${viewport.name}-proof-expanded.png`, fullPage: false });
  await page.locator(".proof-disclosure").click();

  await page.locator(".close [data-open-start]").click();
  await page.locator("#startLayer:not([hidden])").waitFor();
  const drawer = await page.evaluate(() => {
    const panel = document.querySelector(".start-drawer");
    const rect = panel.getBoundingClientRect();
    const action = panel.querySelector(".drawer-action").getBoundingClientRect();
    const step = panel.querySelector(".drawer-step").getBoundingClientRect();
    const title = panel.querySelector("#drawerTitle").getBoundingClientRect();
    const form = panel.querySelector("form");
    return {
      internalOverflow: panel.scrollHeight - panel.clientHeight,
      formOverflow: form.scrollHeight - form.clientHeight,
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      bottom: rect.bottom,
      actionBottom: action.bottom,
      actionTop: action.top,
      stepBottom: step.bottom,
      titleTop: title.top,
      titleBottom: title.bottom,
      titleFontSize: Number.parseFloat(getComputedStyle(panel.querySelector("#drawerTitle")).fontSize),
      viewportHeight: innerHeight,
      backgroundInert: document.querySelector("main").inert && document.querySelector("#siteHeader").inert,
      activeTag: document.activeElement?.tagName,
      labelled: document.querySelector("#workEmail").labels?.length > 0,
    };
  });
  fail(drawer.internalOverflow > 1, `${viewport.name}: drawer internally scrolls by ${drawer.internalOverflow}px`);
  fail(drawer.formOverflow > 1, `${viewport.name}: drawer form internally scrolls by ${drawer.formOverflow}px`);
  fail(drawer.horizontalOverflow > 1, `${viewport.name}: drawer creates horizontal overflow`);
  fail(drawer.titleTop < drawer.stepBottom + 20, `${viewport.name}: drawer title overlaps progress rail`);
  fail(drawer.titleFontSize > 73, `${viewport.name}: drawer title is oversized at ${drawer.titleFontSize}px`);
  fail(drawer.titleBottom > drawer.actionTop, `${viewport.name}: drawer title collides with action rail`);
  fail(drawer.actionBottom > drawer.viewportHeight - (viewport.height > 620 ? 18 : 8), `${viewport.name}: drawer action enters bottom chrome reserve`);
  fail(!drawer.backgroundInert, `${viewport.name}: drawer background is not inert`);
  fail(drawer.activeTag !== "INPUT", `${viewport.name}: drawer focus did not enter work email`);
  fail(!drawer.labelled, `${viewport.name}: work email is not programmatically labelled`);
  if (["desktop-1440x900", "intermediate-834x814", "mobile-390x844", "mobile-320x568", "landscape-844x390"].includes(viewport.name)) await page.screenshot({ path: `${output}/${viewport.name}-drawer.png`, fullPage: false });

  await page.locator('[data-drawer-screen="company"] .drawer-action').click();
  const invalid = await page.evaluate(() => ({
    errorVisible: !document.querySelector("#workEmailError").hidden,
    invalid: document.querySelector("#workEmail").getAttribute("aria-invalid"),
    focused: document.activeElement?.id,
  }));
  fail(!invalid.errorVisible || invalid.invalid !== "true" || invalid.focused !== "workEmail", `${viewport.name}: invalid email does not produce linked recovery`);

  await page.locator("#workEmail").fill("juror@example.com");
  await page.locator('[data-drawer-screen="company"] .drawer-action').click();
  await page.locator('[data-drawer-screen="you"]:not([hidden])').waitFor();
  const youState = await page.evaluate(() => {
    const screen = document.querySelector('[data-drawer-screen="you"]');
    const action = screen.querySelector(".drawer-action").getBoundingClientRect();
    return {
      domain: document.querySelector("#companyDomain").textContent,
      current: document.querySelector("[data-drawer-step].is-current")?.dataset.drawerStep,
      overflow: screen.scrollHeight - screen.clientHeight,
      actionBottom: action.bottom,
      focused: document.activeElement?.id,
      status: document.querySelector("#companyDomain + small")?.textContent,
    };
  });
  fail(youState.domain !== "example.com" || youState.current !== "you", `${viewport.name}: valid email does not advance to You`);
  fail(youState.focused !== "firstName", `${viewport.name}: You screen focus lands on ${youState.focused || "nothing"}`);
  fail(youState.status !== "Ready for the live company read", `${viewport.name}: prototype implies a company read has already run`);
  fail(youState.overflow > 1, `${viewport.name}: You screen internally scrolls by ${youState.overflow}px`);
  fail(youState.actionBottom > viewport.height - (viewport.height > 620 ? 18 : 8), `${viewport.name}: You action enters bottom chrome reserve`);
  if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) await page.screenshot({ path: `${output}/${viewport.name}-drawer-you.png`, fullPage: false });

  await page.locator("#firstName").fill("Test");
  await page.locator("#lastName").fill("Juror");
  await page.locator("#businessPart").selectOption("Founder");
  await page.locator('[data-drawer-screen="you"] .drawer-action').click();
  await page.locator('[data-drawer-screen="complete"]:not([hidden])').waitFor();
  fail((await page.locator("#completeDomain").textContent()) !== "example.com", `${viewport.name}: completion loses company domain`);
  const completionState = await page.evaluate(() => ({
    focused: document.activeElement?.dataset?.drawerScreen,
    heading: document.querySelector("#drawerCompleteTitle")?.textContent,
    nextAction: document.querySelector('[data-drawer-screen="complete"] .drawer-action')?.textContent.trim(),
    nextHref: document.querySelector('[data-drawer-screen="complete"] .drawer-action')?.getAttribute("href"),
  }));
  fail(completionState.focused !== "complete", `${viewport.name}: completion focus does not announce the new state`);
  fail(completionState.heading !== "The live brief picks up here.", `${viewport.name}: completion overclaims prototype behaviour`);
  fail(completionState.nextAction !== "Continue to the live brief →" || completionState.nextHref !== "../../ai-brain?start=brain", `${viewport.name}: completion does not hand off to the live brief`);
  if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) await page.screenshot({ path: `${output}/${viewport.name}-drawer-complete.png`, fullPage: false });
  await page.keyboard.press("Escape");
  fail(!(await page.locator("#startLayer").evaluate((element) => element.hidden)), `${viewport.name}: Escape did not close drawer`);

  observations.push({ viewport: viewport.name, pageScreens: Number(metrics.pageScreens.toFixed(2)) });
  await page.close();
}

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.goto(base, { waitUntil: "domcontentloaded" });
const reducedMetrics = await reduced.evaluate(() => ({
  sequencePosition: getComputedStyle(document.querySelector(".decision-sticky")).position,
  visiblePanels: [...document.querySelectorAll(".state-panel")].filter((panel) => {
    const style = getComputedStyle(panel);
    return style.opacity === "1" && style.visibility === "visible" && style.position !== "absolute";
  }).length,
  exposedPanels: [...document.querySelectorAll(".state-panel")].filter((panel) => panel.getAttribute("aria-hidden") !== "true").length,
  sequenceText: document.querySelector(".decision-sheet").innerText,
  horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
fail(reducedMetrics.sequencePosition === "sticky", "reduced motion: decision still pins");
fail(reducedMetrics.visiblePanels !== 4, `reduced motion: expected four readable panels, found ${reducedMetrics.visiblePanels}`);
fail(reducedMetrics.exposedPanels !== 4, `reduced motion: expected four semantically exposed panels, found ${reducedMetrics.exposedPanels}`);
fail(!["What evidence would make", "Productise the repeated middle", "The useful judgement stays"].every((text) => reducedMetrics.sequenceText.includes(text)), "reduced motion: decision story is incomplete");
fail(reducedMetrics.horizontalOverflow > 1, "reduced motion: horizontal overflow");
await reduced.screenshot({ path: `${output}/mobile-390x844-reduced.png`, fullPage: true });
await reduced.close();

const handoff = await browser.newPage({ viewport: { width: 390, height: 844 } });
await handoff.goto(base, { waitUntil: "domcontentloaded" });
await handoff.locator("[data-open-start]").first().click();
await handoff.locator("#workEmail").fill("juror@example.com");
await handoff.locator('[data-drawer-screen="company"] .drawer-action').click();
await handoff.locator("#firstName").fill("Test");
await handoff.locator("#lastName").fill("Juror");
await handoff.locator("#businessPart").selectOption("Founder");
await handoff.locator('[data-drawer-screen="you"] .drawer-action').click();
await handoff.locator('[data-drawer-screen="complete"] .drawer-action').click();
await handoff.waitForURL(/\/ai-brain\?start=brain$/);
await handoff.locator('.mm-brief-panel[role="dialog"]').waitFor();
fail(!handoff.url().endsWith("/ai-brain?start=brain"), "live handoff: wrong destination");
fail((await handoff.locator("#mm-brief-title").textContent()) !== "Which business should we read?", "live handoff: production Brain brief did not open");
await handoff.screenshot({ path: `${output}/mobile-390x844-live-handoff.png`, fullPage: false });
await handoff.close();

const review = await browser.newPage({ viewport: { width: 1180, height: 760 } });
await review.goto(`${base}review.html`, { waitUntil: "domcontentloaded" });
fail((await review.locator("iframe").count()) !== 2, "paired review: expected desktop and mobile frames");
await review.screenshot({ path: `${output}/paired-review.png`, fullPage: true });
await review.close();

await browser.close();
console.log(JSON.stringify({ artifact: "ai-brain-vnext-r1", viewports: observations, screenshotDirectory: output, failures }, null, 2));
if (failures.length) process.exitCode = 1;
