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
import { asked } from "./lib/asked.mjs";
import { serveBoard } from "./lib/board-fixture.mjs";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm,/new-age-leadership").split(",");
const WIDTH = Number(flag("width", 1440));
const HEIGHT = Number(flag("height", WIDTH < 700 ? 844 : 900));
/**
 * Milliseconds between frames, and how many.
 *
 * The window has to be longer than the longest a credited thing stays still
 * inside its own cycle, or the reading is a coin toss. The plate light sweep is
 * the binding case: `mm-sweep` runs 9.5s and parks from 55% to 100%, so it is
 * motionless for about 4.3 seconds at a stretch. Three frames 900ms apart span
 * 1.8s and fit inside that gap, and they did: the same viewport on /ai-brain
 * read a whole-screen change of 0.125 on one run and 1.611 on the next, with 2
 * cells moving and then 23. Every reading taken with that window, including the
 * ones recorded in 06_CURRENT_STATE.md, is only trustworthy where the motion
 * was continuous.
 *
 * Five frames 1600ms apart span 6.4s, which is longer than the 4.3s park, so at
 * least one pair must straddle the moving part of the cycle.
 */
const GAP = Number(flag("gap", 1600));
const FRAMES = Number(flag("frames", 5));
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

/* The live board, served from a fixture.
   `useBoardData` fetches `get-ai-news` from Supabase, which this session cannot
   reach, so /ai-gtm's board section rendered "The read is rebuilding" and
   measured a peak of 1.0: a screen with literally nothing in it. That is a
   reading about the network, not about the page, and it was about to be treated
   as a design defect. The fixture is one real response captured from the live
   function, so the section is measured in the state a visitor sees. */
/* The fixture and the route both live in ./lib/board-fixture.mjs now, because
   two other gates were stubbing this endpoint with a payload that collapsed the
   board and nobody noticed the three had drifted apart. */

for (const path of PATHS) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: HEIGHT } });
  await serveBoard(page);
  await page.goto(BASE + asked(path), { waitUntil: "networkidle" });
  // Let lazy media start before judging whether anything moves.
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 600) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 50));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);

  /* The scrubbed pass runs first now, because its result decides whether a
     viewport that is still at rest is actually still.

     The design contract carries two motion layers: ambient, which moves while
     you stand there, and scrubbed builds, which are driven by position and are
     correctly static the moment you stop. Photographing a stopped page can only
     ever see the first. Six of the fourteen viewports this gate was failing sat
     on ClimbLadder, ProcessTrack and the fork band, which are the second — so
     the gate was asking those sections to be something the contract says they
     must not be, and the only way to satisfy it would have been to decorate
     them.

     A viewport is alive if something moves in it while you stand still, or if
     something in it changes as you scroll through it. A viewport with neither
     is dead, and the gate still says so. */
  const build = await scrubbedThirds(page);
  scrubbed.push({ path, ...build });
  const buildsAt = (top, tall) => build.moved.some((m) => m.bottom > top && m.top < top + tall);

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
    for (let take = 0; take < FRAMES - 1; take += 1) {
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
    readings.push({ path, y, mean, peak, cells, builds: buildsAt(y, HEIGHT) });
    /* An AND on the second term, where it used to be a bare OR. A viewport is
       alive if the whole screen changes, or if something changes hard enough to
       see *across enough of the screen to be seen*. One ticking mark satisfies
       the peak and nothing else, which is how four frozen phone screens passed
       this gate for a fortnight. */
    const builds = buildsAt(y, HEIGHT);
    const alive = mean >= FLOOR || (peak >= PEAK_FLOOR && cells >= CELLS_FLOOR) || builds;
    if (!alive) {
      problems.push(
        `${path} @${y}px is still (mean ${mean.toFixed(3)} < ${FLOOR}, `
        + `peak ${peak.toFixed(1)}, ${cells}/${GRID * GRID} cells moving < ${CELLS_FLOOR}, `
        + `and nothing in it builds as you scroll)`,
      );
    }
  }
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
        bottom: Math.round(box.bottom + window.scrollY),
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
  const moved = [];
  const count = Math.min(...samples.map((s) => s.length));
  for (let i = 0; i < count; i += 1) {
    const states = new Set(samples.map((s) => s[i].state));
    if (states.size > 1) moved.push({ top: samples[0][i].top, bottom: samples[0][i].bottom });
  }

  const thirds = [0, 0, 0];
  for (const { top } of moved) {
    const third = Math.min(2, Math.floor((top / tall) * 3));
    thirds[third] += 1;
  }
  return { thirds, total: moved.length, moved };
}

if (REPORT) {
  console.log(`aliveness readings at ${WIDTH}x${HEIGHT}, ${GAP}ms apart`);
  console.log(`  mean = whole viewport, peak = busiest ${PEAK_FRACTION * 100}% of pixels, cells = ${GRID}x${GRID} cells changing by ${CELL_FLOOR}\n`);
  for (const r of readings) {
    const bar = "#".repeat(Math.min(40, Math.round(r.peak / 3)));
    console.log(`  ${r.path.padEnd(10)} @${String(r.y).padStart(5)}  mean ${r.mean.toFixed(3).padStart(7)}  peak ${r.peak.toFixed(1).padStart(6)}  cells ${String(r.cells).padStart(2)}/${GRID * GRID}  ${r.builds ? "builds" : "      "}  ${bar}`);
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
