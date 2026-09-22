#!/usr/bin/env node
import fs from "node:fs/promises";
import { chromium } from "playwright";

const origin = "http://127.0.0.1:4192";
const output = "C:/Users/krish/.scratch/mindmake-route-lock-production-final";
const viewports = [
  ["desktop-1440x900", 1440, 900],
  ["shallow-1440x700", 1440, 700],
  ["wide-1920x800", 1920, 800],
  ["tablet-1024x768", 1024, 768],
  ["mobile-430x932", 430, 932],
  ["mobile-390x844", 390, 844],
  ["compact-320x568", 320, 568],
  ["landscape-844x390", 844, 390],
];
const activeViewports = process.env.QA_VIEWPORT
  ? viewports.filter(([name]) => name === process.env.QA_VIEWPORT)
  : process.env.QA_ONE ? [viewports[5]] : viewports;
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const forbidden = /\b(keep the seat|meter the work|price the result|start with either|three things you know at the end)\b/i;

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });

async function prepare(page) {
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
}

async function baseChecks(page, route, name, width, height) {
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  const response = await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  const state = await page.evaluate(() => {
    const hero = document.querySelector("main > .hero");
    const brand = document.querySelector(".mm-brand");
    const menu = document.querySelector(".mm-menu-button");
    const centers = [brand, menu].map((element) => {
      const rect = element.getBoundingClientRect();
      return rect.top + rect.height / 2;
    });
    return {
      bodyText: document.body.innerText,
      heroHeight: hero?.getBoundingClientRect().height ?? 0,
      heroOverflow: hero ? hero.scrollHeight - hero.clientHeight : 999,
      overflow: document.documentElement.scrollWidth - innerWidth,
      centers,
      overlay: Boolean(document.querySelector("vite-error-overlay")),
    };
  });
  fail(!response?.ok(), `${route} ${name}: response failed`);
  fail(errors.length > 0, `${route} ${name}: ${errors.join(" | ")}`);
  fail(state.overlay, `${route} ${name}: Vite error overlay present`);
  fail(state.bodyText.length < 700, `${route} ${name}: route content is incomplete`);
  fail(forbidden.test(state.bodyText), `${route} ${name}: banned shorthand is visible`);
  fail(Math.abs(state.heroHeight - height) > 5, `${route} ${name}: hero is ${Math.round(state.heroHeight)}px, viewport is ${height}px`);
  fail(state.heroOverflow > 2, `${route} ${name}: first screen clips by ${Math.round(state.heroOverflow)}px`);
  fail(state.overflow > 1, `${route} ${name}: horizontal overflow is ${Math.round(state.overflow)}px`);
  fail(Math.abs(state.centers[0] - state.centers[1]) > 2, `${route} ${name}: logo and menu are misaligned`);
  return state;
}

for (const [name, width, height] of activeViewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  await prepare(page);
  await baseChecks(page, "/ai-brain", name, width, height);
  await page.screenshot({ path: `${output}/brain-${name}-hero.png` });

  const stages = page.locator(".stage-nav button");
  fail(await stages.count() !== 4, `/ai-brain ${name}: expected four decision stages`);
  await stages.nth(1).scrollIntoViewIfNeeded();
  await stages.nth(1).click();
  await page.waitForTimeout(700);
  const brain = await page.evaluate(() => {
    const graph = document.querySelector(".living-graph");
    const inspector = document.querySelector("#brainMapReadout");
    const graphBox = graph.getBoundingClientRect();
    const visibleNodes = [...document.querySelectorAll(".living-node")]
      .map((node) => node.getBoundingClientRect())
      .filter((rect) => rect.width > 0 && rect.height > 0);
    const inspectorChildren = [...inspector.children].filter((child) => {
      const style = getComputedStyle(child);
      const rect = child.getBoundingClientRect();
      return style.display !== "none" && style.visibility !== "hidden" && rect.height > 0;
    }).map((child) => {
      const rect = child.getBoundingClientRect();
      return { top: rect.top, bottom: rect.bottom, width: rect.width, text: child.textContent.trim() };
    });
    return {
      nodes: document.querySelectorAll(".living-node").length,
      edges: document.querySelectorAll(".living-edge").length,
      sources: document.querySelector(".living-count")?.textContent ?? "",
      active: document.querySelectorAll(".living-node.is-active").length,
      currentStage: document.querySelector('.stage-nav [aria-current="step"]')?.textContent.trim(),
      nodeTopGap: Math.min(...visibleNodes.map((rect) => rect.top)) - graphBox.top,
      inspectorOverflow: inspector.scrollHeight - inspector.clientHeight,
      inspectorChildren,
      overflow: document.documentElement.scrollWidth - innerWidth,
    };
  });
  fail(brain.nodes !== 20 || brain.edges !== 18 || !brain.sources.includes("10 sources"), `/ai-brain ${name}: actual Brain counts are not 20, 18 and 10`);
  fail(brain.active !== 1 || !brain.currentStage?.includes("Brain"), `/ai-brain ${name}: Brain stage is not active`);
  fail(brain.nodeTopGap > 72, `/ai-brain ${name}: ${Math.round(brain.nodeTopGap)}px of empty space remains above the first node`);
  fail(brain.inspectorOverflow > 2, `/ai-brain ${name}: inspector clips by ${Math.round(brain.inspectorOverflow)}px`);
  fail(brain.inspectorChildren.some((child, index, all) => index > 0 && child.top < all[index - 1].bottom - 1), `/ai-brain ${name}: inspector components overlap`);
  fail(brain.overflow > 1, `/ai-brain ${name}: Brain interaction creates horizontal overflow`);
  await page.locator('.living-node[data-id="BI-003"]').focus();
  await page.keyboard.press("Enter");
  fail(!(await page.locator("#brainMapReadout").innerText()).includes("Human release judgement"), `/ai-brain ${name}: keyboard node inspection failed`);
  await page.screenshot({ path: `${output}/brain-${name}-interactive.png` });

  await stages.nth(2).click();
  await page.waitForTimeout(550);
  fail(!(await page.locator('[data-panel="2"]').isVisible()), `/ai-brain ${name}: evidence stage is not visible`);
  await stages.nth(3).click();
  await page.waitForTimeout(550);
  const correction = page.locator(".apply-correction");
  await correction.click();
  await page.waitForTimeout(80);
  const repairText = await page.locator(".brain-change aside").innerText();
  fail(!/repair complete/i.test(repairText), `/ai-brain ${name}: correction does not repair the Brain (${repairText.replace(/\s+/g, " ")})`);

  await page.locator(".proof-disclosure").scrollIntoViewIfNeeded();
  await page.locator(".proof-disclosure").click();
  fail(!(await page.locator("#founder-proof").isVisible()), `/ai-brain ${name}: founder proof disclosure failed`);

  await page.evaluate(() => scrollTo(0, 0));
  const start = page.locator(".hero [data-mm-primary]");
  await start.click();
  await page.locator('[role="dialog"]').waitFor({ state: "visible" });
  await page.waitForTimeout(500);
  const drawer = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const rect = dialog.getBoundingClientRect();
    return { rect, focus: document.activeElement?.id, backgroundInert: document.querySelector("main > .hero").inert };
  });
  fail(drawer.rect.top < -1 || drawer.rect.left < -1 || drawer.rect.right > width + 1 || drawer.rect.bottom > height + 1, `/ai-brain ${name}: drawer leaves the viewport`);
  fail(!["mm-company-email", "mm-brief-title"].includes(drawer.focus) || !drawer.backgroundInert, `/ai-brain ${name}: drawer focus or inert state failed (${JSON.stringify({ focus: drawer.focus, backgroundInert: drawer.backgroundInert })})`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
  fail(await page.locator('[role="dialog"]').count() !== 0, `/ai-brain ${name}: Escape does not close drawer`);
  await page.close();
}

for (const [name, width, height] of activeViewports) {
  const page = await browser.newPage({ viewport: { width, height } });
  await prepare(page);
  await baseChecks(page, "/ai-gtm", name, width, height);
  const opening = await page.evaluate(() => {
    const windowElement = document.querySelector(".ticker-window");
    const track = document.querySelector(".wire-signals");
    const actions = [...document.querySelectorAll(".hero-actions a,.hero-actions button")].map((element) => ({
      width: element.clientWidth,
      scrollWidth: element.scrollWidth,
      whiteSpace: getComputedStyle(element).whiteSpace,
    }));
    return {
      signals: document.querySelectorAll('.wire-signals [role="radio"]').length,
      totalSignals: document.querySelectorAll(".wire-signals button").length,
      tickerOverflow: getComputedStyle(windowElement).overflowX,
      animation: getComputedStyle(track).animationName,
      tickerScrollable: windowElement.scrollWidth > windowElement.clientWidth,
      actions,
    };
  });
  fail(opening.signals !== 5 || opening.totalSignals !== 10, `/ai-gtm ${name}: ticker is not five signals doubled once`);
  fail(opening.tickerOverflow !== "hidden" || opening.animation !== "ticker-loop" || !opening.tickerScrollable, `/ai-gtm ${name}: live ticker is not continuous and clipped cleanly`);
  fail(opening.actions.some((action) => action.scrollWidth > action.width + 1), `/ai-gtm ${name}: hero action wraps or clips`);
  await page.screenshot({ path: `${output}/gtm-${name}-hero.png` });

  const signalControls = page.locator('.wire-signals [role="radio"]');
  const uniqueChoices = new Set();
  for (let signalIndex = 0; signalIndex < 5; signalIndex += 1) {
    await signalControls.nth(signalIndex).dispatchEvent("click");
    const choices = await page.locator(".response-tabs button").evaluateAll((buttons) => buttons.map((button) => {
      const label = button.querySelector("b");
      const rect = button.getBoundingClientRect();
      const labelRect = label.getBoundingClientRect();
      const lineHeight = Number.parseFloat(getComputedStyle(label).lineHeight) || labelRect.height;
      return {
        text: label.textContent.trim(),
        width: rect.width,
        groupWidth: button.parentElement.getBoundingClientRect().width,
        lines: Math.round(labelRect.height / lineHeight),
        clips: button.scrollWidth > button.clientWidth + 1 || button.scrollHeight > button.clientHeight + 1,
      };
    }));
    choices.forEach((choice) => uniqueChoices.add(choice.text));
    fail(choices.some((choice) => forbidden.test(choice.text) || choice.text.split(/\s+/).length < 4), `/ai-gtm ${name}: signal ${signalIndex + 1} contains contextless response language`);
    fail(choices.some((choice) => choice.clips || choice.lines > 2), `/ai-gtm ${name}: signal ${signalIndex + 1} response text clips or spiders`);
    if (width <= 960) fail(choices.some((choice) => choice.width < choice.groupWidth * .94), `/ai-gtm ${name}: mobile response choices are squeezed into desktop columns`);
  }
  fail(uniqueChoices.size !== 15, `/ai-gtm ${name}: expected 15 distinct response choices, found ${uniqueChoices.size}`);

  await page.locator(".decision-rail button").nth(1).scrollIntoViewIfNeeded();
  await page.locator(".decision-rail button").nth(1).click();
  await page.waitForTimeout(1200);
  await page.locator(".response-tabs button").nth(0).click();
  await page.waitForTimeout(80);
  const decision = await page.evaluate(() => ({
    phase: document.querySelector(".decision")?.dataset.phase,
    choice: document.querySelector('.response-tabs [aria-checked="true"] b')?.textContent.trim(),
    map: [...document.querySelectorAll(".mobile-response dd")].map((element) => element.textContent.trim()),
    comparisonTop: document.querySelector(".comparison-shell").getBoundingClientRect().top,
    comparisonOffset: document.querySelector(".comparison-shell").getBoundingClientRect().top + scrollY,
    scrollY,
    overflow: document.documentElement.scrollWidth - innerWidth,
  }));
  fail(!decision.choice || decision.map.some((value) => value.length < 8), `/ai-gtm ${name}: response does not update all four linked decisions`);
  fail(decision.overflow > 1, `/ai-gtm ${name}: decision interaction creates horizontal overflow`);
  if (width <= 1280) fail(decision.comparisonTop > height * .42, `/ai-gtm ${name}: response build begins too low in the viewport (${Math.round(decision.comparisonTop)}px; scroll ${Math.round(decision.scrollY)} of ${Math.round(decision.comparisonOffset)}px)`);
  await page.screenshot({ path: `${output}/gtm-${name}-decision.png` });

  await page.evaluate(() => scrollTo(0, 0));
  await page.locator(".hero [data-mm-primary]").click();
  await page.locator('[role="dialog"]').waitFor({ state: "visible" });
  await page.waitForTimeout(500);
  const drawer = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    const rect = dialog.getBoundingClientRect();
    return {
      rect,
      focus: document.activeElement?.id,
      backgroundInert: document.querySelector("main > .hero").inert,
      context: document.querySelector(".mm-brief-carried-context")?.textContent.trim(),
    };
  });
  fail(drawer.rect.top < -1 || drawer.rect.left < -1 || drawer.rect.right > width + 1 || drawer.rect.bottom > height + 1, `/ai-gtm ${name}: drawer leaves the viewport`);
  fail(!["mm-company-email", "mm-brief-title"].includes(drawer.focus) || !drawer.backgroundInert || !drawer.context, `/ai-gtm ${name}: drawer did not preserve focus, inert state and chosen context (${JSON.stringify({ focus: drawer.focus, backgroundInert: drawer.backgroundInert, context: drawer.context })})`);
  await page.keyboard.press("Escape");
  await page.waitForTimeout(80);
  fail(await page.locator('[role="dialog"]').count() !== 0, `/ai-gtm ${name}: Escape does not close drawer`);
  await page.close();
}

for (const [route, reviewPath] of [
  ["brain", "/prototypes/ai-brain-vnext-r5/production-review.html"],
  ["gtm", "/prototypes/ai-gtm-vnext-r6/production-review.html"],
]) {
  const page = await browser.newPage({ viewport: { width: 1180, height: 760 } });
  await prepare(page);
  await page.goto(`${origin}${reviewPath}`, { waitUntil: "networkidle" });
  fail(await page.locator("iframe").count() !== 2, `${route}: paired production review is missing a viewport`);
  await page.screenshot({ path: `${output}/${route}-paired-production-review.png`, fullPage: true });
  await page.close();
}

for (const route of ["/ai-brain", "/ai-gtm"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
  await prepare(page);
  await page.goto(`${origin}${route}`, { waitUntil: "networkidle" });
  if (route === "/ai-brain") {
    const state = await page.evaluate(() => ({
      animation: getComputedStyle(document.querySelector(".living-viewport")).animationName,
      panels: [...document.querySelectorAll(".state-panel")].every((panel) => getComputedStyle(panel).visibility !== "hidden"),
    }));
    fail(state.animation !== "none" || !state.panels, "/ai-brain reduced motion fallback is incomplete");
  } else {
    const state = await page.evaluate(() => ({
      animation: getComputedStyle(document.querySelector(".wire-signals")).animationName,
      overflow: getComputedStyle(document.querySelector(".ticker-window")).overflowX,
    }));
    fail(state.animation !== "none" || state.overflow !== "auto", "/ai-gtm reduced motion ticker fallback is incomplete");
  }
  await page.close();
}

await browser.close();
console.log(JSON.stringify({ artifact: "locked-production-routes", output, viewports: activeViewports.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
