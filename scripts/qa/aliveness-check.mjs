#!/usr/bin/env node
/**
 * The aliveness gate.
 *
 * The rule has always been that no viewport-height of any page is ever fully
 * still. The first version of this check asked the browser whether an animation
 * existed, which the site passed while a visitor saw nothing: a 7%-alpha glow
 * satisfies `getAnimations()` and satisfies no human being.
 *
 * So this measures the thing the rule is actually about. It photographs each
 * viewport twice, a beat apart, and compares the pixels. A viewport whose
 * frames are near-identical is still, whatever the DOM claims.
 *
 * Usage:
 *   node scripts/qa/aliveness-check.mjs [--base http://127.0.0.1:4180]
 *                                       [--paths /,/ai-brain,/ai-gtm]
 *                                       [--width 1440] [--gap 900] [--report]
 *
 * --report prints every reading and always exits 0, which is how you calibrate
 * a threshold rather than guess one.
 */

import { chromium } from "playwright";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm").split(",");
const WIDTH = Number(flag("width", 1440));
const HEIGHT = Number(flag("height", WIDTH < 700 ? 844 : 900));
/** Milliseconds between the two frames. Long enough to see slow ambient drift. */
const GAP = Number(flag("gap", 900));
const REPORT = args.includes("--report");

/**
 * Minimum mean per-channel change, out of 255, for a viewport to count as alive.
 *
 * Calibrated against real readings rather than chosen: the section ground light
 * alone measures around 0.01 over this gap, and a playing film measures over 1.
 * 0.15 sits well clear of the glow and well under the quietest real motion.
 */
const FLOOR = Number(flag("floor", 0.15));

function meanDelta(aBuffer, bBuffer) {
  const a = PNG.sync.read(aBuffer);
  const b = PNG.sync.read(bBuffer);
  if (a.data.length !== b.data.length) return Infinity;
  let sum = 0;
  // Every fourth byte is alpha, which never changes here.
  for (let i = 0; i < a.data.length; i += 4) {
    sum += Math.abs(a.data[i] - b.data[i])
      + Math.abs(a.data[i + 1] - b.data[i + 1])
      + Math.abs(a.data[i + 2] - b.data[i + 2]);
  }
  return sum / (a.data.length / 4) / 3;
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];
const readings = [];

for (const path of PATHS) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  // Let lazy media start before judging whether anything moves.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < Math.max(1, height - HEIGHT / 2); y += HEIGHT) {
    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(700);
    const first = await page.screenshot();
    await page.waitForTimeout(GAP);
    const second = await page.screenshot();
    const delta = meanDelta(first, second);
    readings.push({ path, y, delta });
    if (delta < FLOOR) problems.push(`${path} @${y}px is still (${delta.toFixed(3)} < ${FLOOR})`);
  }
  await page.close();
}
await browser.close();

if (REPORT) {
  console.log(`aliveness readings at ${WIDTH}x${HEIGHT}, ${GAP}ms apart\n`);
  for (const r of readings) {
    const bar = "#".repeat(Math.min(40, Math.round(r.delta * 8)));
    console.log(`  ${r.path.padEnd(10)} @${String(r.y).padStart(5)}  ${r.delta.toFixed(3).padStart(7)}  ${bar}`);
  }
  const quietest = readings.reduce((a, b) => (a.delta < b.delta ? a : b));
  console.log(`\n  quietest: ${quietest.path} @${quietest.y}px at ${quietest.delta.toFixed(3)}`);
  process.exit(0);
}

if (problems.length) {
  console.error(`aliveness: ${problems.length} still viewport(s) at ${WIDTH}px\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`aliveness clean at ${WIDTH}px: ${readings.length} viewports, quietest ${Math.min(...readings.map((r) => r.delta)).toFixed(3)}`);
