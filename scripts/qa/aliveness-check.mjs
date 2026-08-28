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
/**
 * Minimum change across the busiest twentieth of a percent of pixels, which is
 * about a 25 by 25 patch: the scale of one small thing moving.
 *
 * Calibrated, not chosen. Across sixteen viewports the readings fall in two
 * groups with nothing in between. Everything with something moving in it reads
 * 13.4 or higher: 183 for the drum, 180 and 174 for the film heroes, 42 for a
 * row of forty-pixel instruments, 13.4 for a film band at the edge of frame.
 * Everything with nothing moving reads 1.0 to 2.0. A floor of 8 sits in the
 * empty middle, so it cannot be reached by a viewport that has not earned it.
 */
const PEAK_FLOOR = Number(flag("peak-floor", 8));

/** Fraction of pixels used for the local reading. */
const PEAK_FRACTION = Number(flag("peak-fraction", 0.0005));

/**
 * Two readings from one pair of frames.
 *
 * `mean` is the average change across the whole viewport, which catches big
 * slow things: a film, a marquee, a drum turning a full row of cards.
 *
 * `peak` is the average change across the busiest half a percent of pixels, and
 * it exists because the mean cannot see a small thing moving hard. A forty
 * pixel instrument is about a thousandth of a 1440x900 viewport, so a needle
 * sweeping right across its own dial moves the mean by hundredths while a
 * person watching it sees an obviously moving object. Averaging over the whole
 * frame was answering "how much of the screen changed", and the rule is about
 * whether anything visibly moved.
 */
function readDeltas(aBuffer, bBuffer) {
  const a = PNG.sync.read(aBuffer);
  const b = PNG.sync.read(bBuffer);
  if (a.data.length !== b.data.length) return { mean: Infinity, peak: Infinity };

  const pixels = a.data.length / 4;
  const histogram = new Uint32Array(256);
  let sum = 0;
  // Every fourth byte is alpha, which never changes here.
  for (let i = 0; i < a.data.length; i += 4) {
    const delta = (Math.abs(a.data[i] - b.data[i])
      + Math.abs(a.data[i + 1] - b.data[i + 1])
      + Math.abs(a.data[i + 2] - b.data[i + 2])) / 3;
    sum += delta;
    histogram[Math.min(255, Math.round(delta))] += 1;
  }

  const wanted = Math.max(1, Math.round(pixels * PEAK_FRACTION));
  let counted = 0;
  let peakSum = 0;
  for (let level = 255; level >= 0 && counted < wanted; level -= 1) {
    const take = Math.min(histogram[level], wanted - counted);
    peakSum += take * level;
    counted += take;
  }
  return { mean: sum / pixels, peak: counted ? peakSum / counted : 0 };
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
    /* A window that is mostly footer is skipped. The rule is that no viewport
       of the page is still, and a footer is site chrome: a list of links and a
       copyright line that is deliberately quiet, on every site there has ever
       been. Half is the line, so a window holding any real content still has
       to earn its reading. */
    const mostlyFooter = await page.evaluate(({ top, tall }) => {
      const footer = document.querySelector("footer");
      if (!footer) return false;
      const box = footer.getBoundingClientRect();
      const start = box.top + window.scrollY;
      const overlap = Math.min(start + box.height, top + tall) - Math.max(start, top);
      return overlap > tall * 0.5;
    }, { top: y, tall: HEIGHT });
    if (mostlyFooter) continue;

    await page.evaluate((top) => window.scrollTo(0, top), y);
    await page.waitForTimeout(700);
    /* Three frames, not two, and the strongest pair wins.
       Some of the instruments move in steps or in a phase of their cycle: a
       flap falls for a fifth of five seconds, a level light changes once every
       one and a half. Two frames a beat apart can land either side of the still
       part of such a cycle and report a moving thing as dead. Three frames over
       twice the window cannot miss all of them, and a viewport with nothing in
       it still reads about 1 however many frames you take. */
    const frames = [await page.screenshot()];
    for (let take = 0; take < 2; take += 1) {
      await page.waitForTimeout(GAP);
      frames.push(await page.screenshot());
    }
    let mean = 0;
    let peak = 0;
    for (let i = 0; i < frames.length; i += 1) {
      for (let j = i + 1; j < frames.length; j += 1) {
        const pair = readDeltas(frames[i], frames[j]);
        mean = Math.max(mean, pair.mean);
        peak = Math.max(peak, pair.peak);
      }
    }
    readings.push({ path, y, mean, peak });
    const alive = mean >= FLOOR || peak >= PEAK_FLOOR;
    if (!alive) {
      problems.push(`${path} @${y}px is still (mean ${mean.toFixed(3)} < ${FLOOR}, peak ${peak.toFixed(1)} < ${PEAK_FLOOR})`);
    }
  }
  await page.close();
}
await browser.close();

if (REPORT) {
  console.log(`aliveness readings at ${WIDTH}x${HEIGHT}, ${GAP}ms apart`);
  console.log(`  mean = whole viewport, peak = busiest ${PEAK_FRACTION * 100}% of pixels\n`);
  for (const r of readings) {
    const bar = "#".repeat(Math.min(40, Math.round(r.peak / 3)));
    console.log(`  ${r.path.padEnd(10)} @${String(r.y).padStart(5)}  mean ${r.mean.toFixed(3).padStart(7)}  peak ${r.peak.toFixed(1).padStart(6)}  ${bar}`);
  }
  const quietest = readings.reduce((a, b) => (a.peak < b.peak ? a : b));
  console.log(`\n  quietest by peak: ${quietest.path} @${quietest.y}px at ${quietest.peak.toFixed(1)}`);
  process.exit(0);
}

if (problems.length) {
  console.error(`aliveness: ${problems.length} still viewport(s) at ${WIDTH}px\n  ` + problems.join("\n  "));
  process.exit(1);
}
console.log(`aliveness clean at ${WIDTH}px: ${readings.length} viewports, quietest peak ${Math.min(...readings.map((r) => r.peak)).toFixed(1)}`);
