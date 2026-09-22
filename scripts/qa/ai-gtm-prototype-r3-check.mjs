#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const base = flag("base", "http://127.0.0.1:4192/prototypes/ai-gtm-vnext-r3/");
const output = "C:/Users/krish/.scratch/mindmake-ai-gtm-vnext-r3";
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "shallow-1440x700", width: 1440, height: 700 },
  { name: "reported-1316x742", width: 1316, height: 742 },
  { name: "wide-1882x870", width: 1882, height: 870 },
  { name: "ultrawide-1920x800", width: 1920, height: 800 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "boundary-961x700", width: 961, height: 700 },
  { name: "boundary-960x700", width: 960, height: 700 },
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
  fail(longest >= 2, `${name}: spiders through ${longest} consecutive one-word lines`);
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  page.on("pageerror", (error) => errors.push(error.message));
  const response = await page.goto(base, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  fail(!response?.ok(), `${viewport.name}: page response failed`);
  fail(errors.length > 0, `${viewport.name}: runtime errors ${errors.join(" | ")}`);

  const opening = await page.evaluate(() => {
    const hero = document.querySelector(".hero").getBoundingClientRect();
    const title = document.querySelector("#heroTitle").getBoundingClientRect();
    const action = document.querySelector(".hero .primary-action").getBoundingClientRect();
    const brand = document.querySelector(".brand").getBoundingClientRect();
    const menu = document.querySelector(".menu-trigger").getBoundingClientRect();
    const visibleTitle = [...document.querySelectorAll(".title-wide,.title-phone")].find((element) => getComputedStyle(element).display !== "none").getBoundingClientRect();
    return {
      content: document.body.innerText.trim().length,
      heroTop: hero.top,
      heroHeight: hero.height,
      heroScrollOverflow: document.querySelector(".hero").scrollHeight - document.querySelector(".hero").clientHeight,
      titleTop: title.top,
      titleBottom: title.bottom,
      visibleTitleWidth: visibleTitle.width,
      actionBottom: action.bottom,
      heroBottom: hero.bottom,
      headerAlignment: Math.abs((brand.top + brand.height / 2) - (menu.top + menu.height / 2)),
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      pageScreens: document.documentElement.scrollHeight / innerHeight,
    };
  });
  fail(opening.content < 900, `${viewport.name}: meaningful content is missing`);
  fail(Math.abs(opening.heroTop) > 1, `${viewport.name}: hero does not begin at the viewport`);
  fail(opening.heroHeight < viewport.height - 2, `${viewport.name}: hero is shorter than the opening screen`);
  fail(opening.heroHeight > viewport.height + 1, `${viewport.name}: hero exceeds the opening screen by ${(opening.heroHeight - viewport.height).toFixed(1)}px`);
  fail(opening.heroScrollOverflow > 1, `${viewport.name}: hero clips ${opening.heroScrollOverflow}px of content`);
  fail(opening.titleTop < 0 || opening.titleBottom > opening.heroBottom + 1, `${viewport.name}: hero title leaves the hero`);
  fail(opening.actionBottom > opening.heroBottom + 1, `${viewport.name}: hero action leaves the hero`);
  fail(opening.headerAlignment > 2, `${viewport.name}: brand and menu misalign by ${opening.headerAlignment.toFixed(1)}px`);
  fail(opening.horizontalOverflow > 1, `${viewport.name}: horizontal overflow ${opening.horizontalOverflow}px`);
  fail(opening.pageScreens > (viewport.name === "landscape-844x390" ? 7 : 6.5), `${viewport.name}: route is ${opening.pageScreens.toFixed(2)} screens long`);
  const titleSelector = await page.locator(".title-wide").isVisible() ? ".title-wide" : ".title-phone";
  checkLines(`${viewport.name} hero`, await textLines(page.locator(titleSelector)), titleSelector === ".title-phone" ? 4 : 3);
  await page.screenshot({ path: `${output}/${viewport.name}-hero.png`, fullPage: false });

  if (await page.locator(".text-link").isVisible()) {
    await page.locator(".text-link").click();
    await page.waitForTimeout(700);
    const anchor = await page.evaluate(() => ({
      decisionTop: document.querySelector("#decisionTable").getBoundingClientRect().top,
      headerBottom: document.querySelector("#siteHeader").getBoundingClientRect().bottom,
    }));
    fail(anchor.decisionTop < anchor.headerBottom - 1 || anchor.decisionTop > anchor.headerBottom + 32, `${viewport.name}: worked-example anchor hides or strands the section opening`);
    await page.evaluate(() => scrollTo(0, 0));
  }

  for (const signal of ["pricing", "commerce", "product"]) {
    await page.locator(`[data-signal="${signal}"]`).click();
    fail((await page.locator(`[data-signal="${signal}"]`).getAttribute("aria-checked")) !== "true", `${viewport.name}: signal ${signal} does not select`);
    for (const responseIndex of [0, 1, 2]) {
      await page.locator(`[data-response="${responseIndex}"]`).click();
      const state = await page.evaluate((index) => ({
        selectedResponses: document.querySelectorAll('.response-tabs [aria-checked="true"]').length,
        selectedColumns: document.querySelectorAll('.desktop-matrix .is-selected').length,
        checked: document.querySelector(`[data-response="${index}"]`).getAttribute("aria-checked"),
        mobileText: document.querySelector(".mobile-response").innerText.length,
        ticketText: document.querySelector(".test-ticket").innerText.length,
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }), responseIndex);
      fail(state.selectedResponses !== 1 || state.checked !== "true", `${viewport.name}: response ${responseIndex} is not the sole selected control`);
      fail(state.selectedColumns !== 5, `${viewport.name}: response ${responseIndex} does not link all four decisions`);
      fail(state.mobileText < 80 || state.ticketText < 80, `${viewport.name}: response ${responseIndex} loses consequence or test copy`);
      fail(state.overflow > 1, `${viewport.name}: interaction creates horizontal overflow`);
    }
  }

  await page.locator("#decisionTable").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  const decision = await page.evaluate(() => {
    const visibleMode = innerWidth <= 1120 ? document.querySelector(".mobile-response") : document.querySelector(".desktop-matrix");
    const rect = visibleMode.getBoundingClientRect();
    const tabs = [...document.querySelectorAll(".response-tabs button")].map((button) => button.getBoundingClientRect().height);
    return {
      display: getComputedStyle(visibleMode).display,
      right: rect.right,
      left: rect.left,
      tabs,
      viewportWidth: innerWidth,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    };
  });
  fail(decision.display === "none", `${viewport.name}: responsive decision treatment is hidden`);
  fail(decision.left < -1 || decision.right > decision.viewportWidth + 1, `${viewport.name}: decision treatment leaves viewport`);
  fail(decision.tabs.some((height) => height < 44), `${viewport.name}: response target below 44px`);
  fail(decision.overflow > 1, `${viewport.name}: decision state overflows horizontally`);
  await page.screenshot({ path: `${output}/${viewport.name}-decision.png`, fullPage: false });

  await page.locator("[data-open-start]").first().click();
  const drawer = await page.evaluate(() => {
    const panel = document.querySelector(".start-drawer");
    const rect = panel.getBoundingClientRect();
    const action = document.querySelector(".drawer-action").getBoundingClientRect();
    return {
      left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom,
      actionBottom: action.bottom, height: innerHeight, width: innerWidth,
      focus: document.activeElement?.id,
      inert: document.querySelector("main").inert && document.querySelector(".site-footer").inert,
      overflow: panel.scrollHeight - panel.clientHeight,
      context: document.querySelector("#drawerContext").textContent,
    };
  });
  fail(drawer.left < -1 || drawer.right > drawer.width + 1 || drawer.top < -1 || drawer.bottom > drawer.height + 1, `${viewport.name}: drawer leaves viewport`);
  fail(drawer.actionBottom > drawer.height - 8, `${viewport.name}: drawer action underlaps bottom reserve`);
  fail(drawer.focus !== "workEmail" || !drawer.inert, `${viewport.name}: drawer focus or isolation failed`);
  fail(drawer.overflow > 1, `${viewport.name}: drawer has ${drawer.overflow}px internal overflow`);
  fail(!drawer.context.includes("AI prototyping"), `${viewport.name}: selected evidence is not carried into Start here`);
  await page.locator("#companyForm .drawer-action").click();
  fail(await page.locator("#emailError").evaluate((element) => element.hidden), `${viewport.name}: empty submission has no recovery message`);
  await page.screenshot({ path: `${output}/${viewport.name}-drawer-error.png`, fullPage: false });
  await page.locator("#workEmail").fill("judge@acme.co");
  await page.locator("#companyForm .drawer-action").click();
  const handoff = await page.evaluate(() => ({
    visible: !document.querySelector("#handoffState").hidden,
    receipt: document.querySelector("#handoffReceipt").textContent,
    context: document.querySelector("#handoffContext").textContent,
    focus: document.activeElement?.id,
    overflow: document.querySelector(".start-drawer").scrollHeight - document.querySelector(".start-drawer").clientHeight,
    actionHeight: document.querySelector("#handoffState .drawer-action").getBoundingClientRect().height,
  }));
  fail(!handoff.visible || !handoff.receipt.includes("acme.co") || !handoff.context.includes("AI prototyping"), `${viewport.name}: valid company handoff loses email domain or selected context`);
  fail(handoff.focus !== "handoffState", `${viewport.name}: handoff does not announce and focus its new state`);
  fail(handoff.overflow > 1 || handoff.actionHeight < 44, `${viewport.name}: handoff state clips or shrinks its action`);
  await page.screenshot({ path: `${output}/${viewport.name}-drawer-handoff.png`, fullPage: false });
  await page.locator("#handoffState [data-close-start]").click();

  await page.locator("#menuTrigger").click();
  await page.locator("#menuLayer [data-open-start]").click();
  await page.keyboard.press("Escape");
  fail((await page.evaluate(() => document.activeElement?.id)) !== "menuTrigger", `${viewport.name}: replacing Menu with Start loses the original focus target`);

  await page.locator(".proof").scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${output}/${viewport.name}-proof.png`, fullPage: false });
  observations.push({ viewport: viewport.name, pageScreens: Number(opening.pageScreens.toFixed(2)) });
  await page.close();
}

const reduced = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.goto(base, { waitUntil: "networkidle" });
const reducedState = await reduced.evaluate(() => ({
  hiddenContent: [...document.querySelectorAll(".decision-intro,.comparison-shell,.proof-copy")].filter((element) => Number(getComputedStyle(element).opacity) < 1).length,
  videosVisible: [...document.querySelectorAll("video")].filter((video) => getComputedStyle(video).display !== "none").length,
  posterBackups: [...document.querySelectorAll(".hero-visual,.proof")].filter((element) => getComputedStyle(element).backgroundImage !== "none").length,
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
fail(reducedState.hiddenContent > 0, "reduced motion: content remains hidden");
fail(reducedState.videosVisible > 0, "reduced motion: ambient films remain visible");
fail(reducedState.posterBackups !== 2, "reduced motion: static poster replacements are missing");
fail(reducedState.overflow > 1, "reduced motion: horizontal overflow");
await reduced.screenshot({ path: `${output}/mobile-390x844-reduced.png`, fullPage: true });
await reduced.close();

for (const fixtureState of ["stale", "quiet", "error", "conflicted"]) {
  const statePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await statePage.goto(`${base}?state=${fixtureState}`, { waitUntil: "networkidle" });
  const state = await statePage.evaluate((expected) => ({
    bodyState: document.body.dataset.fixtureState,
    noticeHidden: document.querySelector("#fixtureNotice").hidden,
    noticeLength: document.querySelector("#fixtureNotice").textContent.trim().length,
    overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    checkedDate: document.querySelector(".wire-label time").textContent,
  }), fixtureState);
  fail(state.bodyState !== fixtureState || state.noticeHidden || state.noticeLength < 70, `${fixtureState} fixture: state boundary is not explicit`);
  fail(state.overflow > 1, `${fixtureState} fixture: horizontal overflow ${state.overflow}px`);
  fail(!state.checkedDate.includes("15 Sep 2026"), `${fixtureState} fixture: checked date is missing`);
  await statePage.screenshot({ path: `${output}/mobile-390x844-${fixtureState}.png`, fullPage: false });
  await statePage.close();
}

const review = await browser.newPage({ viewport: { width: 1180, height: 760 } });
await review.goto(`${base}review.html`, { waitUntil: "networkidle" });
fail((await review.locator("iframe").count()) !== 2, "paired review: expected desktop and mobile frames");
await review.screenshot({ path: `${output}/paired-review.png`, fullPage: true });
await review.close();

await browser.close();
console.log(JSON.stringify({ artifact: "ai-gtm-vnext-r3", viewports: observations, screenshotDirectory: output, failures }, null, 2));
if (failures.length) process.exitCode = 1;
