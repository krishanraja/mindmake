import { createServer } from "vite";
import { chromium, firefox, webkit } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../../../..");
const route = "/prototypes/website-redesign-recovery/component-selection/homepage-history-configurator/index.html";
const evidence = "C:/Users/krish/.scratch/mindmake-homepage-history-configurator";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const scenarios = [
  { name: "default", choices: {} },
  { name: "cinematic-right", choices: { desktopComposition: "cinematic", mobileComposition: "prelude", desktopCopyPosition: "right", desktopHeadlineScale: "large", mobileHeadlineScale: "compact", controlTreatment: "count", storyTransition: "slide" } },
  { name: "banded-first-frame", choices: { desktopComposition: "banded", mobileComposition: "first-frame", desktopCopyPosition: "left", desktopHeadlineScale: "large", mobileHeadlineScale: "balanced", controlTreatment: "titles", storyTransition: "cut", bridgeHeadline: "AI is not the first tool to make people question their place.", bridgeLine: "The technology changes. The human question does not.", closingHinge: "AI reaches further. Your boundary has to become clearer." } }
];

const clickChoice = async (page, name, value) => {
  await page.locator(`label:has(input[name=${JSON.stringify(name)}][value=${JSON.stringify(value)}])`).click();
};

const visibleContained = async (page) => page.locator(".preview-card").evaluateAll((cards) => cards.every((card) => {
  const frame = card.querySelector(".history-frame");
  const bounds = frame.getBoundingClientRect();
  const nodes = [...card.querySelectorAll(".bridge, .story-copy, .era-rail, .closing-hinge")].filter((node) => {
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return !node.hidden && style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  });
  return nodes.every((node) => {
    const box = node.getBoundingClientRect();
    return box.left >= bounds.left - 1 && box.right <= bounds.right + 1 && box.top >= bounds.top - 1 && box.bottom <= bounds.bottom + 1;
  });
}));

const criticalOverlaps = async (page) => page.locator(".preview-card").evaluateAll((cards) => cards.flatMap((card) => {
  const nodes = [...card.querySelectorAll(".bridge, .story-copy, .era-rail, .closing-hinge")].filter((node) => {
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return !node.hidden && style.display !== "none" && style.visibility !== "hidden" && box.width > 0 && box.height > 0;
  });
  const overlaps = [];
  for (let i = 0; i < nodes.length; i += 1) {
    for (let j = i + 1; j < nodes.length; j += 1) {
      const a = nodes[i].getBoundingClientRect();
      const b = nodes[j].getBoundingClientRect();
      if (a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top) overlaps.push(`${card.classList.contains("preview-mobile") ? "mobile" : "desktop"}:${nodes[i].className}+${nodes[j].className}`);
    }
  }
  return overlaps;
}));

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
try {
  await fs.mkdir(evidence, { recursive: true });
  await server.listen();
  const address = server.httpServer.address();
  if (!address || typeof address === "string") throw new Error("Vite did not expose an ephemeral TCP port");
  const origin = `http://127.0.0.1:${address.port}`;

  for (const [engineName, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    const page = await browser.newPage({ viewportSize: { width: 1440, height: 1000 } });
    const errors = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(origin + route, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.removeItem("mindmake-homepage-history-combination-v1"));
    await page.reload({ waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);

    fail(await page.locator('input[type="radio"]').count() !== 56, `${engineName}: expected 56 independent radio choices`);
    fail(await page.locator(".segments span").evaluateAll((nodes) => nodes.some((node) => node.getBoundingClientRect().height < 44)), `${engineName}: a choice target is under 44px`);
    fail(await page.locator("img[data-story-image]").evaluateAll((images) => images.some((image) => !image.complete || image.naturalWidth < 1)), `${engineName}: a story image failed`);

    const viewports = engineName === "chromium"
      ? [{ name: "1280", width: 1280, height: 900 }, { name: "1440", width: 1440, height: 1000 }, { name: "1920", width: 1920, height: 1080 }, { name: "2560", width: 2560, height: 1440 }]
      : [{ name: "1440", width: 1440, height: 1000 }, { name: "1920", width: 1920, height: 1080 }];

    for (const viewport of viewports) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      for (const scenario of scenarios) {
        await page.getByRole("button", { name: "Reset" }).click();
        for (const [name, value] of Object.entries(scenario.choices)) await clickChoice(page, name, value);
        for (let story = 0; story < 4; story += 1) {
          const label = ["Writing", "Loom", "Calculator", "Satnav"][story];
          await page.getByRole("button", { name: label, exact: true }).first().click();
          await page.waitForTimeout(80);
          const prefix = `${engineName} ${viewport.name} ${scenario.name} ${label}`;
          fail(!(await visibleContained(page)), `${prefix}: visible content escaped its frame`);
          const overlaps = await criticalOverlaps(page);
          fail(overlaps.length > 0, `${prefix}: critical regions overlap (${overlaps.join(", ")})`);
          fail(await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1), `${prefix}: page overflow`);
          if (engineName === "chromium" && viewport.name === "1920" && scenario.name === "default" && story === 0) {
            await page.locator(".preview-desktop").screenshot({ path: `${evidence}/wide-writing-desktop.png` });
            await page.locator(".preview-mobile").screenshot({ path: `${evidence}/wide-writing-mobile.png` });
          }
          if (engineName === "chromium" && viewport.name === "1440" && scenario.name === "cinematic-right" && story === 2) {
            await page.locator(".preview-mobile").screenshot({ path: `${evidence}/cinematic-right-calculator-mobile.png` });
          }
        }
        if (engineName === "chromium" && viewport.name === "1440") {
          await page.locator(".preview-desktop").screenshot({ path: `${evidence}/${scenario.name}-desktop.png` });
          await page.locator(".preview-mobile").screenshot({ path: `${evidence}/${scenario.name}-mobile.png` });
        }
      }
    }

    await clickChoice(page, "questionCalculator", "When the calculator does the sum, what should children still learn?");
    await page.getByRole("button", { name: "Lock the historical story" }).click();
    fail(!(await page.getByRole("button", { name: "Historical story locked" }).isVisible()), `${engineName}: lock readback missing`);
    await page.reload({ waitUntil: "networkidle" });
    fail(!(await page.getByLabel("When the calculator does the sum, what should children still learn?", { exact: true }).isChecked()), `${engineName}: selection did not persist`);
    fail(errors.length > 0, `${engineName}: ${errors.join(" | ")}`);
    await browser.close();
  }

  console.log(JSON.stringify({ origin, evidence, failures }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
