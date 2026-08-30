#!/usr/bin/env node
/**
 * The aliveness gate.
 *
 * The rule has always been that no viewport-height of any page is ever fully
 * still. The first version of this check asked the browser whether an animation
 * existed, which the site passed while a visitor saw nothing: a 7%-alpha glow
 * satisfies `getAnimations()` and satisfies no human being.
 *
 * So this measures the thing the rule is actually about, in two passes.
 *
 * The AT-REST pass photographs each viewport several times a beat apart and
 * compares the pixels. A viewport whose frames are near-identical is still,
 * whatever the DOM claims.
 *
 * The SCRUBBED pass photographs the same content at three scroll positions and
 * requires it to look different at each. That pass exists because the first one
 * passed a site whose scroll-driven motion amounted to 34px of hero parallax:
 * measuring only at rest cannot tell a page that builds as you read it from a
 * page that merely has something ticking in the corner. Both are required, and
 * they measure different promises.
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

/**
 * The spread reading: how much of the viewport moves, rather than whether
 * anything in it does.
 *
 * `peak` above answers "did anything move", and as an OR against `mean` that
 * is all this gate ever asked. A forty-pixel instrument ticking in the corner
 * of an otherwise frozen screen of text reads a peak of 24 to 30 and passes,
 * and four of the seven phone viewports on the homepage were passing exactly
 * that way while reading a whole-screen mean of 0.012 to 0.060. The site was
 * certified alive by a gate measuring something else.
 *
 * So the frame is cut into a grid and cells that actually change are counted.
 * One small object moving lights one cell; a film, a drum or a marquee lights
 * many. The floors are calibrated below from readings on both.
 */
const GRID = Number(flag("grid", 8));
/** Mean change within one cell for that cell to count as moving. */
const CELL_FLOOR = Number(flag("cell-floor", 0.6));
/**
 * How many of the GRID x GRID cells must move.
 *
 * Calibrated across twenty-six viewports on the three main pages at 390px, and
 * the readings fall in two groups with a clean gap. Everything carrying a film,
 * a drum or a marquee lights 9 to 45 cells. Everything whose only motion is one
 * or two instrument marks lights 0 to 3, and reads a whole-screen mean of 0.007
 * to 0.08 — which is to say a person looking at it sees a photograph. Four sits
 * in the gap.
 *
 * It is deliberately not set where the site currently stands. Viewports below
 * it are named in the failure output and are the worklist, not the floor.
 */
const CELLS_FLOOR = Number(flag("cells-floor", 4));

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
  if (a.data.length !== b.data.length) return { mean: Infinity, peak: Infinity, cells: GRID * GRID };

  const pixels = a.data.length / 4;
  const histogram = new Uint32Array(256);
  /* Per-cell sums, for the spread reading below. */
  const cellSum = new Float64Array(GRID * GRID);
  const cellPixels = new Uint32Array(GRID * GRID);
  const cellWidth = a.width / GRID;
  const cellHeight = a.height / GRID;
  let sum = 0;
  // Every fourth byte is alpha, which never changes here.
  for (let i = 0; i < a.data.length; i += 4) {
    const delta = (Math.abs(a.data[i] - b.data[i])
      + Math.abs(a.data[i + 1] - b.data[i + 1])
      + Math.abs(a.data[i + 2] - b.data[i + 2])) / 3;
    sum += delta;
    histogram[Math.min(255, Math.round(delta))] += 1;

    const pixel = i / 4;
    const cell = Math.min(GRID - 1, Math.floor((pixel / a.width) / cellHeight)) * GRID
      + Math.min(GRID - 1, Math.floor((pixel % a.width) / cellWidth));
    cellSum[cell] += delta;
    cellPixels[cell] += 1;
  }

  let cells = 0;
  for (let cell = 0; cell < cellSum.length; cell += 1) {
    if (cellPixels[cell] && cellSum[cell] / cellPixels[cell] >= CELL_FLOOR) cells += 1;
  }

  const wanted = Math.max(1, Math.round(pixels * PEAK_FRACTION));
  let counted = 0;
  let peakSum = 0;
  for (let level = 255; level >= 0 && counted < wanted; level -= 1) {
    const take = Math.min(histogram[level], wanted - counted);
    peakSum += take * level;
    counted += take;
  }
  return { mean: sum / pixels, peak: counted ? peakSum / counted : 0, cells };
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];
const readings = [];

const scrubbed = [];

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
    let cells = 0;
    for (let i = 0; i < frames.length; i += 1) {
      for (let j = i + 1; j < frames.length; j += 1) {
        const pair = readDeltas(frames[i], frames[j]);
        mean = Math.max(mean, pair.mean);
        peak = Math.max(peak, pair.peak);
        cells = Math.max(cells, pair.cells);
      }
    }
    readings.push({ path, y, mean, peak, cells });
    /* An AND on the second term, where it used to be a bare OR. A viewport is
       alive if the whole screen changes, or if something changes hard enough to
       see *across enough of the screen to be seen*. One ticking mark satisfies
       the peak and nothing else, which is how four frozen phone screens passed
       this gate for a fortnight. */
    const alive = mean >= FLOOR || (peak >= PEAK_FLOOR && cells >= CELLS_FLOOR);
    if (!alive) {
      problems.push(
        `${path} @${y}px is still (mean ${mean.toFixed(3)} < ${FLOOR}, `
        + `peak ${peak.toFixed(1)}, ${cells}/${GRID * GRID} cells moving < ${CELLS_FLOOR})`,
      );
    }
  }
  const build = await scrubbedThirds(page);
  scrubbed.push({ path, ...build });
  if (build.thirds.some((count) => count === 0)) {
    const empty = build.thirds
      .map((count, third) => (count === 0 ? ["top", "middle", "bottom"][third] : null))
      .filter(Boolean);
    problems.push(`${path} builds nothing as you read its ${empty.join(" or ")} third (${build.thirds.join("/")})`);
  }
  await page.close();
}
await browser.close();

/**
 * The scrubbed pass: does the page build as you read it?
 *
 * Not measured in pixels. A position-driven build resets when you scroll back,
 * so three photographs taken from the same offset are three identical
 * photographs, and photographs taken from different offsets differ because the
 * page moved rather than because anything built. So this reads the state
 * instead: the --mm-p each driver writes, and the opacity of the words a
 * ScrubText lights. An element counts as scrubbed only if that state actually
 * differs across three scroll positions.
 *
 * It asserts distribution, not a count. The site this was written for had
 * exactly three scroll-driven elements and all three were inside the hero,
 * which is a page with parallax at the top and nothing afterwards. So a page
 * has to carry scrubbed motion in its top, middle and bottom third.
 */
async function scrubbedThirds(page) {
  const tall = await page.evaluate(() => document.body.scrollHeight);
  const readState = () => page.evaluate(() => {
    const out = [];
    for (const el of document.querySelectorAll("[style*='--mm-p'], .mm-scrub span, .mm-fig-holder *")) {
      const box = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      out.push({
        top: Math.round(box.top + window.scrollY),
        state: `${style.getPropertyValue("--mm-p")}|${style.opacity}|${style.transform}|${style.width}`,
      });
    }
    return out;
  });

  /* Sampled from the very top, because a build in the top third has already
     finished by 15 percent down and would read as unchanging from there. The
     same at the other end. */
  const samples = [];
  for (const at of [0, 0.08, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95]) {
    await page.evaluate((top) => window.scrollTo(0, top), Math.round(tall * at));
    await page.waitForTimeout(420);
    samples.push(await readState());
  }

  /* An element is scrubbed if its state is not the same in every sample. */
  const moved = new Set();
  const count = Math.min(...samples.map((s) => s.length));
  for (let i = 0; i < count; i += 1) {
    const states = new Set(samples.map((s) => s[i].state));
    if (states.size > 1) moved.add(samples[0][i].top);
  }

  const thirds = [0, 0, 0];
  for (const top of moved) {
    const third = Math.min(2, Math.floor((top / tall) * 3));
    thirds[third] += 1;
  }
  return { thirds, total: moved.size };
}

if (REPORT) {
  console.log(`aliveness readings at ${WIDTH}x${HEIGHT}, ${GAP}ms apart`);
  console.log(`  mean = whole viewport, peak = busiest ${PEAK_FRACTION * 100}% of pixels, cells = ${GRID}x${GRID} cells changing by ${CELL_FLOOR}\n`);
  for (const r of readings) {
    const bar = "#".repeat(Math.min(40, Math.round(r.peak / 3)));
    console.log(`  ${r.path.padEnd(10)} @${String(r.y).padStart(5)}  mean ${r.mean.toFixed(3).padStart(7)}  peak ${r.peak.toFixed(1).padStart(6)}  cells ${String(r.cells).padStart(2)}/${GRID * GRID}  ${bar}`);
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
