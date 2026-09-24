import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const prototypeFile = path.resolve(scriptDirectory, "../../prototypes/homepage-vnext/index.html");
const baseUrl = process.env.HOMEPAGE_PROTOTYPE_URL || pathToFileURL(prototypeFile).href;
const output = "C:/Users/krish/.scratch/mindmake-homepage-vnext";
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-320x568", width: 320, height: 568 },
  { name: "landscape-844x390", width: 844, height: 390 }
];

await fs.mkdir(output, { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const observations = [];

async function routeTitleMetrics(page) {
  return page.locator("#routeTitle").evaluate((heading) => {
    const lines = [...heading.querySelectorAll("span")].flatMap((span) => {
      const range = document.createRange();
      const textNode = span.firstChild;
      if (!textNode) return [];
      const words = [...textNode.textContent.matchAll(/\S+/g)].map((match) => {
        range.setStart(textNode, match.index);
        range.setEnd(textNode, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        return { word: match[0], top: rect.top, left: rect.left, right: rect.right };
      });
      return words.reduce((groups, word) => {
        const existing = groups.find((group) => Math.abs(group.top - word.top) < 2);
        if (existing) existing.words.push(word);
        else groups.push({ top: word.top, words: [word] });
        return groups;
      }, []);
    }).map((line) => ({
      text: line.words.map(({ word }) => word).join(" "),
      wordCount: line.words.length,
      width: Math.max(...line.words.map(({ right }) => right)) - Math.min(...line.words.map(({ left }) => left))
    }));
    const rect = heading.getBoundingClientRect();
    return {
      lines,
      fontSize: Number.parseFloat(getComputedStyle(heading).fontSize),
      withinViewport: rect.left >= -1 && rect.right <= document.documentElement.clientWidth + 1
    };
  });
}

function checkRouteTitle(viewport, route, metrics) {
  if (!metrics.withinViewport) failures.push(`${viewport}: ${route} title leaves the viewport`);
  if (metrics.lines.length > 3) failures.push(`${viewport}: ${route} title spiders across ${metrics.lines.length} lines`);
  if (metrics.lines.length > 1 && metrics.lines.at(-1).wordCount === 1) failures.push(`${viewport}: ${route} title ends with a one-word orphan`);
  const widest = Math.max(...metrics.lines.map(({ width }) => width));
  const narrowest = Math.min(...metrics.lines.map(({ width }) => width));
  if (metrics.lines.length > 1 && narrowest / widest < 0.42) failures.push(`${viewport}: ${route} title line balance is ${Math.round((narrowest / widest) * 100)} percent`);
}

async function textFlowMetrics(page, selectors) {
  return page.locator(selectors).evaluateAll((elements) => elements.map((element) => {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const words = [];
    while (walker.nextNode()) {
      const textNode = walker.currentNode;
      for (const match of textNode.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(textNode, match.index);
        range.setEnd(textNode, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) words.push({ word: match[0], top: rect.top });
      }
    }
    const lines = words.reduce((groups, word) => {
      const existing = groups.find((group) => Math.abs(group.top - word.top) < 2);
      if (existing) existing.words.push(word.word);
      else groups.push({ top: word.top, words: [word.word] });
      return groups;
    }, []).map(({ words: lineWords }) => lineWords.length);
    let longestSingleRun = 0;
    let currentSingleRun = 0;
    for (const wordCount of lines) {
      currentSingleRun = wordCount === 1 ? currentSingleRun + 1 : 0;
      longestSingleRun = Math.max(longestSingleRun, currentSingleRun);
    }
    return {
      selector: element.id ? `#${element.id}` : `.${element.classList[0]}`,
      lines,
      longestSingleRun
    };
  }));
}

function checkTextFlow(viewport, route, flows) {
  for (const flow of flows) {
    const singleLines = flow.lines.filter((wordCount) => wordCount === 1).length;
    if (flow.longestSingleRun >= 3 || (flow.lines.length >= 4 && singleLines / flow.lines.length > 0.5)) {
      failures.push(`${viewport}: ${route} ${flow.selector} spiders across lines ${flow.lines.join("/")}`);
    }
  }
}

for (const viewport of viewports) {
  const page = await browser.newPage({ viewport });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);

  const metrics = await page.evaluate(() => {
    const threshold = document.querySelector(".threshold").getBoundingClientRect();
    const thresholdCopy = document.querySelector(".threshold-copy").getBoundingClientRect();
    const instrument = document.querySelector(".threshold-instrument").getBoundingClientRect();
    const doors = [...document.querySelectorAll(".route-door")].map((button) => {
      const rect = button.getBoundingClientRect();
      return { width: rect.width, height: rect.height, top: rect.top, bottom: rect.bottom };
    });
    return {
      horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      pageScreens: document.documentElement.scrollHeight / window.innerHeight,
      threshold: { top: threshold.top, bottom: threshold.bottom, height: threshold.height },
      thresholdCopyBottom: thresholdCopy.bottom,
      instrument: { top: instrument.top, bottom: instrument.bottom, height: instrument.height },
      doors
    };
  });

  if (metrics.horizontalOverflow > 1) failures.push(`${viewport.name}: horizontal overflow ${metrics.horizontalOverflow}px`);
  if (metrics.doors.some((door) => door.width < 44 || door.height < 44)) failures.push(`${viewport.name}: route door below 44px target`);
  if (metrics.doors.some((door) => door.bottom > viewport.height + 2)) failures.push(`${viewport.name}: route door below first viewport`);
  if (metrics.pageScreens > 1.18) failures.push(`${viewport.name}: shared threshold is ${metrics.pageScreens.toFixed(2)} screens`);
  if (viewport.width <= 560) {
    if (metrics.thresholdCopyBottom > metrics.doors[0].top - 8) failures.push(`${viewport.name}: homepage claim overlaps the route controls`);
    if (metrics.doors[1].top <= metrics.doors[0].bottom) failures.push(`${viewport.name}: mobile route controls are not stacked for thumb reach`);
    if (Math.abs(metrics.threshold.height - viewport.height) > 2) failures.push(`${viewport.name}: mobile homepage is not composed as one viewport`);
  }
  const thresholdFlow = await textFlowMetrics(page, "#thresholdTitle, .threshold-lede");
  checkTextFlow(viewport.name, "threshold", thresholdFlow);

  const observation = { viewport: viewport.name, ...metrics };
  observations.push(observation);
  await page.screenshot({ path: `${output}/${viewport.name}-threshold.png`, fullPage: true });

  await page.locator("[data-route='brain']").click();
  await page.locator("#routeView:not([hidden])").waitFor();
  await page.waitForTimeout(420);
  const brainTitle = await routeTitleMetrics(page);
  checkRouteTitle(viewport.name, "brain", brainTitle);
  const brainFlow = await textFlowMetrics(page, ".route-lede, .route-figure figcaption, .receipt-head h2, .proof-receipt blockquote");
  checkTextFlow(viewport.name, "brain", brainFlow);
  observation.brainTitle = brainTitle;
  observation.brainFlow = brainFlow;
  const routePrimary = await page.locator("#startButton").boundingBox();
  if (!routePrimary || routePrimary.y + routePrimary.height > viewport.height + 4) failures.push(`${viewport.name}: route Start here is not in the first viewport`);
  await page.screenshot({ path: `${output}/${viewport.name}-brain.png`, fullPage: true });

  await page.locator("#startButton").click();
  await page.locator("#startLayer:not([hidden])").waitFor();
  await page.waitForTimeout(320);
  const drawerOverflow = await page.evaluate(() => {
    const drawer = document.querySelector(".start-drawer");
    return drawer.scrollHeight - drawer.clientHeight;
  });
  if (drawerOverflow > 1) failures.push(`${viewport.name}: start drawer overflows by ${drawerOverflow}px`);
  if (["desktop-1440x900", "mobile-390x844", "mobile-320x568", "landscape-844x390"].includes(viewport.name)) {
    await page.screenshot({ path: `${output}/${viewport.name}-drawer.png`, fullPage: false });
  }
  await page.keyboard.press("Escape");
  if ((await page.evaluate(() => document.activeElement?.id)) !== "startButton") failures.push(`${viewport.name}: drawer did not restore focus to Start here`);

  if (["desktop-1440x900", "mobile-390x844"].includes(viewport.name)) {
    await page.locator("#routeBack").click();
    await page.locator("#thresholdView:not([hidden])").waitFor();
    await page.locator("[data-route='gtm']").click();
    await page.locator("#routeView:not([hidden])").waitFor();
    await page.waitForTimeout(420);
    const gtmTitle = await routeTitleMetrics(page);
    checkRouteTitle(viewport.name, "gtm", gtmTitle);
    const gtmFlow = await textFlowMetrics(page, ".route-lede, .route-figure figcaption, .receipt-head h2, .proof-receipt blockquote");
    checkTextFlow(viewport.name, "gtm", gtmFlow);
    observation.gtmTitle = gtmTitle;
    observation.gtmFlow = gtmFlow;
    await page.screenshot({ path: `${output}/${viewport.name}-gtm.png`, fullPage: true });
  }
  await page.close();
}

const keyboardPage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await keyboardPage.goto(baseUrl, { waitUntil: "networkidle" });
await keyboardPage.keyboard.press("Tab");
await keyboardPage.keyboard.press("Tab");
await keyboardPage.keyboard.press("Tab");
if ((await keyboardPage.evaluate(() => document.activeElement?.id)) !== "menuTrigger") failures.push("mobile keyboard: Menu is not third in natural tab order after skip link and home");
await keyboardPage.keyboard.press("Enter");
await keyboardPage.locator("#menuLayer:not([hidden])").waitFor();
await keyboardPage.waitForTimeout(320);
await keyboardPage.keyboard.press("Shift+Tab");
if ((await keyboardPage.evaluate(() => document.activeElement?.id)) !== "menuStart") failures.push("mobile keyboard: menu focus does not wrap backwards");
await keyboardPage.screenshot({ path: `${output}/mobile-390x844-menu.png`, fullPage: false });
await keyboardPage.keyboard.press("Escape");
if ((await keyboardPage.evaluate(() => document.activeElement?.id)) !== "menuTrigger") failures.push("mobile keyboard: menu did not restore trigger focus");
await keyboardPage.close();

const reducedPage = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reducedPage.goto(baseUrl, { waitUntil: "networkidle" });
await reducedPage.locator("[data-route='gtm']").click();
await reducedPage.locator("#routeView:not([hidden])").waitFor();
if ((await reducedPage.locator("#routeTitle").textContent()) !== "Make the business easier to buy.") failures.push("reduced motion: route content did not arrive");
await reducedPage.screenshot({ path: `${output}/mobile-390x844-gtm-reduced.png`, fullPage: true });
await reducedPage.close();

const textPage = await browser.newPage({ viewport: { width: 320, height: 568 } });
await textPage.goto(baseUrl, { waitUntil: "networkidle" });
await textPage.evaluate(() => { document.documentElement.style.fontSize = "200%"; });
const enlargedThreshold = await textPage.evaluate(() => {
  const proof = document.querySelector(".shared-proof").getBoundingClientRect();
  const copy = document.querySelector(".threshold-copy").getBoundingClientRect();
  const doors = [...document.querySelectorAll(".route-door")].map((button) => {
    const rect = button.getBoundingClientRect();
    return { top: rect.top, bottom: rect.bottom, clipped: button.scrollHeight > button.clientHeight + 1 };
  });
  return {
    horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    copyDoorGap: doors[0].top - copy.bottom,
    doorsOverlapProof: doors.some((door) => door.bottom > proof.top),
    clippedDoor: doors.some((door) => door.clipped)
  };
});
if (enlargedThreshold.horizontalOverflow > 1) failures.push("200 percent text: threshold has horizontal overflow");
if (enlargedThreshold.copyDoorGap < 8) failures.push(`200 percent text: homepage claim overlaps route controls by ${Math.abs(enlargedThreshold.copyDoorGap)}px`);
if (enlargedThreshold.doorsOverlapProof) failures.push("200 percent text: route doors overlap the paid-proof line");
if (enlargedThreshold.clippedDoor) failures.push("200 percent text: route door text is clipped");
await textPage.screenshot({ path: `${output}/mobile-320x568-text-200.png`, fullPage: true });
await textPage.locator("[data-route='brain']").click();
await textPage.locator("#routeView:not([hidden])").waitFor();
await textPage.waitForTimeout(50);
const enlargedTitle = await routeTitleMetrics(textPage);
checkRouteTitle("200 percent text", "brain", enlargedTitle);
const enlargedFlow = await textFlowMetrics(textPage, ".route-lede, .route-figure figcaption, .receipt-head h2, .proof-receipt blockquote");
checkTextFlow("200 percent text", "brain", enlargedFlow);
const enlargedRoute = await textPage.evaluate(() => ({
  overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  offenders: [...document.querySelectorAll("body *")].filter((element) => {
    const rect = element.getBoundingClientRect();
    return rect.right > document.documentElement.clientWidth + 1 || rect.left < -1;
  }).map((element) => ({ tag: element.tagName, className: element.className, id: element.id, text: element.textContent?.trim().slice(0, 60) })).slice(0, 12)
}));
if (enlargedRoute.overflow > 1) failures.push(`200 percent text: route has horizontal overflow from ${JSON.stringify(enlargedRoute.offenders)}`);
await textPage.screenshot({ path: `${output}/mobile-320x568-brain-text-200.png`, fullPage: true });
await textPage.close();

await browser.close();

console.log(JSON.stringify({ failures, observations, screenshotDirectory: output }, null, 2));
if (failures.length) process.exitCode = 1;
