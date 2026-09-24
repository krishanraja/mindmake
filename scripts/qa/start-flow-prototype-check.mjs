#!/usr/bin/env node
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const base = flag("base", "http://127.0.0.1:4190/prototypes/start-flow-vnext/");
const viewports = [
  { name: "desktop-1440x900", width: 1440, height: 900 },
  { name: "tablet-1024x768", width: 1024, height: 768 },
  { name: "mobile-390x844", width: 390, height: 844 },
  { name: "mobile-375x812", width: 375, height: 812 },
  { name: "mobile-320x568", width: 320, height: 568 },
  { name: "landscape-844x390", width: 844, height: 390 },
];

const browser = await chromium.launch({ channel: "chrome", headless: true });
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

async function titleLines(page) {
  return page.locator(".screen.active h1").evaluate((element) => {
    const words = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      for (const match of walker.currentNode.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(walker.currentNode, match.index);
        range.setEnd(walker.currentNode, match.index + match[0].length);
        const rect = range.getBoundingClientRect();
        words.push({ text: match[0], top: rect.top });
      }
    }
    return words.reduce((lines, word) => {
      const line = lines.find((entry) => Math.abs(entry.top - word.top) < 2);
      if (line) line.words.push(word.text);
      else lines.push({ top: word.top, words: [word.text] });
      return lines;
    }, []).map((line) => line.words);
  });
}

for (const viewport of viewports) {
  for (const step of [1, 2]) {
    const page = await browser.newPage({ viewport });
    await page.goto(`${base}${step === 2 ? "?step=2" : ""}`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    const state = await page.evaluate(() => {
      const screen = document.querySelector(".screen.active");
      const action = screen.querySelector(".primary").getBoundingClientRect();
      const actionRail = screen.querySelector(".action-rail").getBoundingClientRect();
      const controls = [...screen.querySelectorAll("button, input, select")]
        .map((control) => control.getBoundingClientRect())
        .filter((rect) => rect.width > 0 && rect.height > 0);
      return {
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        screenOverflow: screen.scrollHeight - screen.clientHeight,
        actionTop: action.top,
        actionBottom: action.bottom,
        actionRailBottom: actionRail.bottom,
        shortControl: controls.find((rect) => rect.height < 44),
      };
    });
    fail(state.horizontalOverflow > 1, `${viewport.name} step ${step}: horizontal overflow`);
    fail(state.screenOverflow > 1, `${viewport.name} step ${step}: internal screen scroll`);
    fail(state.actionTop < 0 || state.actionBottom > viewport.height + 1, `${viewport.name} step ${step}: primary action leaves the viewport`);
    const bottomClearance = viewport.width > 640
      ? (viewport.height > 620 ? 40 : 16)
      : (viewport.height > 620 ? 20 : 10);
    fail(state.actionRailBottom > viewport.height - bottomClearance + 1, `${viewport.name} step ${step}: action rail enters the ${bottomClearance}px system-chrome exclusion zone`);
    fail(Boolean(state.shortControl), `${viewport.name} step ${step}: an interactive control is below 44px`);
    const lines = await titleLines(page);
    fail(lines.length > 4, `${viewport.name} step ${step}: title uses ${lines.length} lines`);
    let singleRun = 0;
    let longestSingleRun = 0;
    for (const line of lines) {
      singleRun = line.length === 1 ? singleRun + 1 : 0;
      longestSingleRun = Math.max(longestSingleRun, singleRun);
    }
    fail(longestSingleRun >= 3, `${viewport.name} step ${step}: title spiders through ${longestSingleRun} one-word lines`);
    await page.close();
  }
}

const interaction = await browser.newPage({ viewport: { width: 320, height: 568 } });
await interaction.goto(base, { waitUntil: "networkidle" });
await interaction.locator("#email").fill("krish@mindmake.co");
await interaction.locator('[data-screen="company"] .primary').click();
fail(!(await interaction.locator('[data-screen="you"]').evaluate((element) => element.classList.contains("active"))), "phone interaction: company submit did not advance");
fail((await interaction.locator("#domain").innerText()) !== "mindmake.co", "phone interaction: company record did not inherit the email domain");
await interaction.locator(".division-select").selectOption({ label: "Commercial" });
await interaction.locator(".back").click();
fail(!(await interaction.locator('[data-screen="company"]').evaluate((element) => element.classList.contains("active"))), "phone interaction: back did not restore the company step");
await interaction.close();

await browser.close();
console.log(JSON.stringify({ artifact: "start-flow-vnext-r2", viewports: viewports.map(({ name }) => name), failures }, null, 2));
if (failures.length) process.exitCode = 1;
