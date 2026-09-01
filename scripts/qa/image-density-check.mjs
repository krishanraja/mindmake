#!/usr/bin/env node
/**
 * The image density gate.
 *
 * Two failures, one measurement. An image rendered wider than its source is
 * upscaled and will look broken; an image rendered at less than twice its CSS
 * width is soft on the retina screen most visitors are using.
 *
 * This exists because both were shipped at once and neither was visible in a
 * code review: a favicon with a viewBox and no width fell back to 300px and
 * then stretched to fill a 1240px grid column, and the product captures were
 * authored at 1x for a 2x world. Only the browser can tell you either.
 *
 * Usage:
 *   node scripts/qa/image-density-check.mjs [--base URL] [--paths a,b,c]
 *                                           [--width 1440] [--min 1.6] [--report]
 */

import { chromium } from "playwright";
import { asked } from "./lib/asked.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm,/case-studies").split(",");
const WIDTH = Number(flag("width", 1440));
/**
 * Source pixels per CSS pixel.
 *
 * Two floors, because two different things are being judged. A product capture
 * or a photograph carries detail a reader has to resolve, so it wants close to
 * the 2x a retina screen asks for. A film still is limited by the footage it
 * came from: a 1920px master shown full width at 1440 CSS pixels cannot exceed
 * 1.33x however it is exported, and atmospheric film reads fine there.
 *
 * SVG is exempt entirely. Its intrinsic size is an authoring convenience, not a
 * resolution, and a vector rendered above it loses nothing.
 */
const MIN = Number(flag("min", 1.8));
const FILM_MIN = Number(flag("film-min", 1.3));
const REPORT = args.includes("--report");

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const rows = [];

for (const path of PATHS) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: 900 }, deviceScaleFactor: 2 });
  await page.goto(BASE + asked(path), { waitUntil: "networkidle" });
  // Walk the page so lazy images and posters have all loaded before measuring.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 60));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1200);

  const found = await page.evaluate(() => [...document.querySelectorAll("img, video")].map((el) => {
    const box = el.getBoundingClientRect();
    const natural = el.naturalWidth || el.videoWidth || 0;
    const rendered = Math.round(box.width);
    if (!rendered || !natural) return null;
    const full = el.currentSrc || el.src || "";
    // Test the whole URL: splitting on "/" first destroys a data: prefix.
    if (/\.svg(\?|$)/i.test(full) || full.startsWith("data:image/svg")) return null;
    const src = full.split("/").pop() ?? "";
    return { src, rendered, natural, ratio: Number((natural / rendered).toFixed(2)) };
  }).filter(Boolean));

  for (const image of found) rows.push({ path, ...image });
  await page.close();
}
await browser.close();

const floorFor = (row) => (/film-\d\d-/.test(row.src) ? FILM_MIN : MIN);
const upscaled = rows.filter((r) => r.ratio < 1);
const soft = rows.filter((r) => r.ratio >= 1 && r.ratio < floorFor(r));

if (REPORT) {
  console.log(`image density at ${WIDTH}px, source pixels per CSS pixel\n`);
  for (const r of [...rows].sort((a, b) => a.ratio - b.ratio)) {
    const floor = /film-\d\d-/.test(r.src) ? FILM_MIN : MIN;
    const mark = r.ratio < 1 ? "UPSCALED" : r.ratio < floor ? "soft    " : "ok      ";
    console.log(`  ${mark} ${String(r.ratio).padStart(6)}x  ${String(r.rendered).padStart(4)}px from ${String(r.natural).padStart(4)}px  ${r.path.padEnd(14)} ${r.src}`);
  }
  process.exit(0);
}

if (upscaled.length || soft.length) {
  if (upscaled.length) {
    console.error(`\n${upscaled.length} image(s) rendered larger than the source:`);
    for (const r of upscaled) console.error(`  ${r.path} ${r.src}: ${r.rendered}px from ${r.natural}px (${r.ratio}x)`);
  }
  if (soft.length) {
    console.error(`\n${soft.length} image(s) soft on a retina screen:`);
    for (const r of soft) console.error(`  ${r.path} ${r.src}: ${r.rendered}px from ${r.natural}px (${r.ratio}x, floor ${floorFor(r)}x)`);
  }
  process.exit(1);
}
console.log(`image density clean at ${WIDTH}px: ${rows.length} images, lowest ${Math.min(...rows.map((r) => r.ratio))}x`);
