#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium, firefox, webkit } from "playwright";
import { createServer } from "vite";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = "C:/Users/krish/.scratch/mindmake-new-age-r5-production";
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const locked = {
  "prototypes/website-redesign-recovery/new-age-leadership/index-s3-r5.html": "cdf7603e278730dfae162e82fc4433e4a7452d0d4b1e268b2580a079445ac7b1",
  "prototypes/website-redesign-recovery/new-age-leadership/styles-s3-r5.css": "9164326484d62717ba781edbe7d3fc50dfac35f6739b5bb9aadbf833082bbe34",
  "prototypes/website-redesign-recovery/new-age-leadership/script-s3-r5.js": "68fa0f838808e6a2efb355e1c5aedc3d81ef726e4a59a41b033d91d7ee5e7e6f",
};
const matrices = {
  chromium: [[320,568],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1366,640],[1440,900],[1920,1080]],
  webkit: [[390,844],[844,390],[1440,900]],
  firefox: [[390,844],[844,390],[1440,900]],
};

await mkdir(output, { recursive: true });
for (const [file, expected] of Object.entries(locked)) {
  const actual = createHash("sha256").update(await readFile(new URL(`../../${file}`, import.meta.url))).digest("hex");
  fail(actual !== expected, `${file}: approved hash changed (${actual})`);
}

const server = await createServer({ root, server: { host: "127.0.0.1", port: 0, strictPort: false }, logLevel: "error" });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;
const engines = { chromium, webkit, firefox };

for (const [engineName, viewports] of Object.entries(matrices)) {
  const browser = await engines[engineName].launch({ headless: true });
  for (const [width, height] of viewports) {
    const page = await browser.newPage({ viewport: { width, height } });
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
    await page.locator("#hero-title").waitFor();
    await page.evaluate(() => document.fonts?.ready);
    const state = await page.evaluate(() => {
      const box = (selector) => { const r = document.querySelector(selector)?.getBoundingClientRect(); return r && { top:r.top, right:r.right, bottom:r.bottom, left:r.left, width:r.width, height:r.height }; };
      const nodeVisible = (node) => { if (!node) return false; const s = getComputedStyle(node); const r = node.getBoundingClientRect(); return s.visibility !== "hidden" && s.opacity !== "0" && r.width > 0 && r.height > 0; };
      const visible = (selector) => nodeVisible(document.querySelector(selector));
      return {
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
        hero: box(".nal-page .hero"), header: box(".nal-page .masthead"), action: box(".nal-page .hero-action"),
        headingColour: getComputedStyle(document.querySelector("#hero-title")).color,
        bodyLength: document.body.innerText.length,
        visible: ["#hero-title", ".hero-action", ".motion-toggle"].every(visible),
        controlHeights: [...document.querySelectorAll(".nal-page button,.nal-page input[type=range],.nal-page .hero-action")].filter(nodeVisible).map((node) => node.getBoundingClientRect().height),
      };
    });
    const label = `${engineName}-${width}x${height}`;
    fail(state.overflow > 1, `${label}: horizontal overflow ${state.overflow}px`);
    fail(state.bodyLength < 1200 || !state.visible, `${label}: primary content is missing`);
    fail(!state.hero || Math.abs(state.hero.top) > 1 || Math.abs(state.hero.height - height) > 2, `${label}: hero does not own the opening viewport`);
    fail(!state.header || !state.action || state.header.bottom > state.action.top, `${label}: fixed header collides with the hero action`);
    fail(state.headingColour !== "rgb(234, 223, 200)", `${label}: hero heading colour is ${state.headingColour}`);
    fail(state.controlHeights.some((value) => value > 0 && value < 44), `${label}: a visible control is smaller than 44px`);
    fail(errors.length > 0, `${label}: runtime errors ${errors.join(" | ")}`);

    await page.locator("[data-lens-next]").click();
    await page.waitForTimeout(800);
    fail(await page.locator('[data-lens-copy="0"]').getAttribute("aria-hidden") !== "true", `${label}: historical carousel does not leave its opening story`);
    await page.locator("[data-benefit-next]").click();
    fail(await page.locator('[data-benefit="1"]').getAttribute("aria-hidden") !== "false", `${label}: benefit carousel does not advance`);
    await page.locator('[data-reach-jump="organisation"]').click();
    await page.waitForTimeout(250);
    fail(await page.locator('[data-reach-panel="organisation"]').getAttribute("aria-hidden") !== "false", `${label}: organisation state does not open`);
    await page.locator('[data-reach-jump="boundary"]').click();
    await page.waitForTimeout(250);
    fail(await page.locator('[data-reach-panel="boundary"]').getAttribute("aria-hidden") !== "false", `${label}: work state does not restore`);
    if ([[390,844],[844,390],[1440,900]].some(([w,h]) => w === width && h === height)) await page.screenshot({ path: `${output}/${label}.png`, fullPage: false });

    await page.goto(`${origin}/`, { waitUntil: "domcontentloaded" });
    fail(await page.locator(".nal-page").count() !== 0, `${label}: page scope survives route navigation`);
    await page.close();
  }
  await browser.close();
}

const reducedBrowser = await chromium.launch({ headless: true });
const reduced = await reducedBrowser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
await reduced.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
await reduced.locator("#hero-title").waitFor();
fail(await reduced.locator(".motion-toggle").getAttribute("aria-pressed") !== "true", "reduced motion: motion is not paused by default");
await reducedBrowser.close();

await server.close();
console.log(JSON.stringify({ gate: "new-age-r5-production", origin, failures }, null, 2));
if (failures.length) process.exitCode = 1;
