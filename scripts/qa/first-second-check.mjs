#!/usr/bin/env node
/**
 * The first second.
 *
 * Every other gate on this project measures a page that has already arrived.
 * The aliveness gate goes further than most and still scrolls the whole page to
 * start lazy media, waits a second and a half, and only then takes its first
 * photograph: a procedure precisely designed to skip the window a visitor
 * actually lands in.
 *
 * So nobody had ever looked at the entrance, and the entrance was three
 * different pages in a row. A text-only document on a white ground, then a
 * flash as the real page replaced it, then the films arriving. The claim being
 * made was "alive from the get-go" and the get-go was the one part not
 * measured.
 *
 * This photographs from navigation rather than from load, on a throttled
 * connection, and reports four things:
 *
 *   first paint      the first frame that is not the browser's blank page
 *   ground settled   the last time the page's dominant colour changes
 *   content settled  the last time the frame changes structurally at all
 *   first motion     the first frame that differs from the one before it
 *                    without anything else having changed, which is ambient
 *                    motion running
 *
 * The number that matters most is `flips`: how many times the ground colour
 * changes before it settles. One is correct, a page arriving. Two or more is
 * the visitor watching the site change its mind, which is what a flash is.
 *
 * Usage:
 *   node scripts/qa/first-second-check.mjs [--base http://127.0.0.1:4180]
 *                                          [--paths /,/ai-brain,/ai-gtm]
 *                                          [--widths 390,1440] [--window 4000]
 *                                          [--report] [--frames]
 */
import { chromium } from "playwright";
import { PNG } from "pngjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const BASE = flag("base", "http://127.0.0.1:4180");
/* `/?start=1` is in the default set because it is a route the site's own
   primary action produces, and it is not a page the prerender renders: every
   indexed path is rendered without a query string. That difference cost a
   hydration failure nobody could see. The dialog opened on the client's first
   render while the server had rendered the page with it shut, React threw the
   whole page away with error #418, and it did so on every shared start link
   and every back-button return into the dialog. Neither the page set here nor
   `src/test/ssg-hydration.test.tsx` covered a query-parameter state. */
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm,/?start=1").split(",");
const WIDTHS = flag("widths", "390,1440").split(",").map(Number);
/** How long to watch. A flash the visitor sees happens well inside this. */
const WINDOW = Number(flag("window", 4000));
const REPORT = args.includes("--report");
/** Print every frame, which is how a threshold gets calibrated rather than guessed. */
const FRAMES = args.includes("--frames");

/**
 * Above this whole-frame luminance the page is showing a light ground.
 *
 * Not a judgement about brightness in general: every page on this site wears
 * the ink, `.mm-site` paints `--mm-ink` (#0a100d, luminance 0.05) and nothing
 * else ever paints a ground. A settled frame reads about 0.06 to 0.12 with type
 * and film on it. Half way to white is far outside anything the design can
 * produce, so a frame over it is the page in a state it never means to be in.
 */
const LIGHT_AT = Number(flag("light-at", 0.5));

/**
 * How long after first paint the page may still be rearranging itself.
 *
 * A page that arrives once is settled within a frame or two of painting. This
 * is deliberately generous: it is here to catch a second page replacing the
 * first, not to police a layout shift of a few pixels.
 */
const SETTLE_BUDGET = Number(flag("settle-budget", 400));

/**
 * Cells of the 8 by 8 grid that must change at once to be worth looking at.
 *
 * A third of the frame. Below that a page is adjusting; above it, something the
 * size of a hero has been swapped for something else.
 */
const BIG_CHANGE = Number(flag("big-change", 22));

/**
 * Network shaping, so the entrance is measured on a connection somebody might
 * actually have rather than on a loopback socket.
 *
 * Chosen to match a decent 4G phone, which is the honest middle: fast enough
 * that a well-built page arrives in one piece, slow enough that a page which
 * paints three times in a row shows every one of them.
 */
const THROTTLE = {
  offline: false,
  downloadThroughput: (4 * 1024 * 1024) / 8,
  uploadThroughput: (1024 * 1024) / 8,
  latency: 120,
};

/**
 * How light the whole frame is, and a coarse fingerprint of it.
 *
 * Luminance across every sampled pixel rather than the single most common
 * colour. The first version took the dominant colour and it read 36 percent of
 * the frame: on a page that is a dark ground carrying a photograph and a block
 * of type, "the commonest colour" is a minority opinion. What a person means by
 * "it flashed white at me" is that the whole frame got bright, so that is what
 * is measured.
 *
 * The fingerprint is an 8 by 8 luminance grid, which changes when the page
 * changes structurally and not when a film advances one frame.
 */
function read(buffer) {
  const png = PNG.sync.read(buffer);
  const cells = new Array(64).fill(0);
  const counts = new Array(64).fill(0);
  let total = 0;
  let seen = 0;
  for (let y = 0; y < png.height; y += 4) {
    for (let x = 0; x < png.width; x += 4) {
      const at = (png.width * y + x) << 2;
      const lum = 0.2126 * png.data[at] + 0.7152 * png.data[at + 1] + 0.0722 * png.data[at + 2];
      total += lum;
      seen += 1;
      const cell = Math.min(7, Math.floor((y / png.height) * 8)) * 8
        + Math.min(7, Math.floor((x / png.width) * 8));
      cells[cell] += lum;
      counts[cell] += 1;
    }
  }
  return {
    lum: total / seen / 255,
    print: cells.map((sum, at) => Math.round(sum / Math.max(1, counts[at]) / 16)).join(","),
  };
}

/** Mean per-channel change between two frames, out of 255. */
function delta(a, b) {
  const one = PNG.sync.read(a);
  const two = PNG.sync.read(b);
  if (one.width !== two.width || one.height !== two.height) return 255;
  let total = 0;
  let seen = 0;
  for (let at = 0; at < one.data.length; at += 4 * 4) {
    total += Math.abs(one.data[at] - two.data[at])
      + Math.abs(one.data[at + 1] - two.data[at + 1])
      + Math.abs(one.data[at + 2] - two.data[at + 2]);
    seen += 3;
  }
  return total / seen;
}

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];
const rows = [];

for (const width of WIDTHS) {
  for (const path of PATHS) {
    const context = await browser.newContext({
      viewport: { width, height: width < 700 ? 844 : 900 },
    });
    const page = await context.newPage();

    /* Hydration errors, which is a different failure with the same symptom.
       React compares the prerendered markup against what the app renders on
       its first pass, and when they disagree it throws the whole server render
       away and rebuilds the page from nothing. What that looks like is exactly
       what this script measures: the site arrives, then a second later it is
       replaced. Two of those shipped in one afternoon and neither was visible,
       because a production React build reports them as a numbered error nobody
       reads. The frames catch a replacement big enough to move a third of the
       still cells; this catches every one of them, including the ones that
       rebuild into identical-looking markup. */
    const hydration = [];
    page.on("pageerror", (error) => {
      const text = String(error?.message ?? error);
      /* 418 initial UI mismatch, 419 unfinished server boundary, 421 boundary
         rebuilt during hydration, 423 root switched to client rendering, 425
         text mismatch. All five mean the same thing here. */
      if (/Minified React error #(418|419|421|423|425)\b/.test(text) || /Hydration failed|error while hydrating|server HTML/i.test(text)) {
        hydration.push(text.replace(/;.*$/, ""));
      }
    });

    const session = await context.newCDPSession(page);
    await session.send("Network.enable");
    await session.send("Network.emulateNetworkConditions", THROTTLE);
    /* A cold visitor has nothing cached, which is the whole point: a warm load
       hides the flash by having the stylesheet already in hand. */
    await session.send("Network.setCacheDisabled", { cacheDisabled: true });

    /* Frames come from the compositor, not from screenshot().
       The first version of this asked for a screenshot every 100ms and got
       0ms, 411ms, then nothing until 1449ms: screenshot() waits on the main
       thread, and the main thread is busy parsing 351KB of JavaScript, which is
       precisely the second being measured. An instrument that goes blind during
       the event is not an instrument. A screencast is pushed from the
       compositor as each frame paints, so it sees through the work. */
    const frames = [];
    const started = Date.now();
    session.on("Page.screencastFrame", async ({ data, sessionId }) => {
      frames.push({ at: Date.now() - started, shot: Buffer.from(data, "base64") });
      try { await session.send("Page.screencastFrameAck", { sessionId }); } catch { /* gone */ }
    });
    await session.send("Page.startScreencast", { format: "png", everyNthFrame: 1 });
    /* Navigation is not awaited. Waiting for load would mean the first
       photograph is taken after the thing being photographed has finished. */
    page.goto(BASE + path, { waitUntil: "commit" }).catch(() => {});
    await page.waitForTimeout(WINDOW);
    try { await session.send("Page.stopScreencast"); } catch { /* gone */ }

    /* The browser's own paint timing, rather than a guess from the frames.
       Before the document paints, the compositor is still pushing the blank
       tab, which is white on every browser there has ever been and is not
       something this site can be blamed for or fix. Anchoring here is what
       separates "the page flashed white" from "the browser had not started". */
    const fcp = await page.evaluate(() => {
      const entry = performance.getEntriesByName("first-contentful-paint")[0];
      return entry ? Math.round(entry.startTime) : null;
    }).catch(() => null);

    const seen = frames.map((frame) => ({ at: frame.at, ...read(frame.shot) }));
    if (FRAMES) {
      console.log(`\n  ${width}px ${path}, every painted frame:`);
      for (const frame of seen) {
        const bar = "#".repeat(Math.round(frame.lum * 60));
        console.log(`    ${String(frame.at).padStart(5)}ms  lum ${frame.lum.toFixed(3)}  ${frame.lum > LIGHT_AT ? "LIGHT" : "dark "}  ${bar}`);
      }
    }

    /* Everything before the document painted belongs to the browser, not to
       this site, so it is dropped rather than measured. */
    const firstPaint = fcp;
    const ours = firstPaint === null ? seen : seen.filter((frame) => frame.at >= firstPaint - 40);

    /* A light frame on this site is always wrong. Every page, the 404 included,
       wears the ink: `.mm-site` paints `--mm-ink` and nothing else ever paints
       a ground. So any bright frame is the page in a state it never means to
       be in, and the visitor saw it. */
    const flashes = ours.filter((frame) => frame.lum > LIGHT_AT);
    const flashMs = flashes.length
      ? flashes[flashes.length - 1].at - flashes[0].at
      : 0;

    /* Structural settling: the last time the 8x8 fingerprint changed by more
       than a film advancing. A page that arrives once settles early and stays. */
    /* Which cells of the grid are film, and which are page.
     *
     * A replacement and a film both change a lot of the frame, so counting
     * changed cells cannot tell them apart: the first version of this called a
     * 566px plate coming alive at 1440 a page replacement, and the second, told
     * to ignore anything followed by more movement, then failed to catch a
     * genuinely wrong page being swapped out, because a film plays in that case
     * too.
     *
     * What separates them is where the change is. A film changes the same
     * region over and over; a replacement moves type that was not moving. So
     * the cells that keep changing once the page is running are measured, set
     * aside, and the replacement check is run on what is left.
     */
    const tail = ours.slice(Math.floor(ours.length * 0.6));
    const restless = new Set();
    if (tail.length > 3) {
      const grids = tail.map((frame) => frame.print.split(",").map(Number));
      for (let cell = 0; cell < 64; cell += 1) {
        const values = grids.map((grid) => grid[cell]);
        if (Math.max(...values) - Math.min(...values) > 1) restless.add(cell);
      }
    }
    const stillCells = 64 - restless.size;

    const movedStill = (a, b) => {
      const before = a.print.split(",").map(Number);
      const after = b.print.split(",").map(Number);
      let count = 0;
      for (let cell = 0; cell < 64; cell += 1) {
        if (restless.has(cell)) continue;
        if (Math.abs(before[cell] - after[cell]) > 1) count += 1;
      }
      return count;
    };

    /* A third of what is meant to be holding still, and never fewer than six
       cells, so a page that is almost all film cannot pass by having nothing
       left to measure. */
    const floor = Math.max(6, Math.round(stillCells / 3));
    let settled = firstPaint;
    const reflows = [];
    for (let i = 1; i < ours.length; i += 1) {
      const moved = movedStill(ours[i - 1], ours[i]);
      if (moved < floor) continue;
      settled = ours[i].at;
      reflows.push({ at: ours[i].at, moved });
    }

    /* The first frame after settling that still differs from the one before
       it: the page has finished arriving and something is moving anyway. */
    let firstMotion = null;
    for (let i = 1; i < frames.length; i += 1) {
      if (frames[i].at <= settled) continue;
      if (delta(frames[i - 1].shot, frames[i].shot) > 0.05) { firstMotion = frames[i].at; break; }
    }

    rows.push({ width, path, frames: frames.length, firstPaint, settled, flashMs, firstMotion, reflows: reflows.length, restless: restless.size });

    if (flashes.length) {
      problems.push(`${width}px ${path}: a light ground is on screen from ${flashes[0].at}ms for ${flashMs || "<1"}ms (brightest ${Math.max(...flashes.map((f) => f.lum)).toFixed(2)})`);
    }
    if (reflows.length > 0) {
      problems.push(`${width}px ${path}: the page is replaced ${reflows.length}x after it paints (${reflows.map((r) => `${r.at}ms, ${r.moved} still cells moved`).join("; ")}), which is the glitch`);
    }
    if (firstPaint !== null && settled - firstPaint > SETTLE_BUDGET) {
      problems.push(`${width}px ${path}: still rearranging ${settled - firstPaint}ms after first paint`);
    }
    if (firstMotion === null) {
      problems.push(`${width}px ${path}: nothing moves in the first ${WINDOW}ms`);
    }
    if (hydration.length) {
      problems.push(`${width}px ${path}: hydration failed ${hydration.length}x (${[...new Set(hydration)].join(" | ")}), so the server render was thrown away`);
    }

    await context.close();
  }
}
await browser.close();

for (const row of rows) {
  console.log(
    `  ${String(row.width).padStart(4)} ${row.path.padEnd(11)}`
    + ` ${String(row.frames).padStart(3)} frames`
    + `  paint ${String(row.firstPaint ?? "-").padStart(5)}ms`
    + `  settled ${String(row.settled ?? "-").padStart(5)}ms`
    + `  light flash ${String(row.flashMs).padStart(4)}ms`
    + `  page replaced ${row.reflows}x`
    + `  ${String(row.restless).padStart(2)}/64 cells alive`
    + `  first motion ${String(row.firstMotion ?? "none").padStart(5)}${row.firstMotion === null ? "" : "ms"}`,
  );
}

if (REPORT) process.exit(0);

if (problems.length) {
  console.error(`\n${problems.length} problem(s) in the first second:`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log("\nthe entrance arrives once, on the ink, and is moving when it lands");
