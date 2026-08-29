#!/usr/bin/env node
/**
 * The section rhythm gate.
 *
 * Two sections in a row on the same ground read as one long section. The site
 * shipped with exactly one ground on every page and a separator at 1.23:1,
 * which is under what a laptop shows, so a reader met an undivided wall of
 * content and said so.
 *
 * This measures the painted background of every top level section and fails
 * when neighbours match. A section is allowed to match its neighbour only when
 * something else separates them: a full-bleed band carrying its own image, or a
 * visible seam. Both exemptions are named here rather than inferred, so adding
 * one is a decision somebody makes on purpose.
 *
 * Usage:
 *   node scripts/qa/section-rhythm-check.mjs [--base URL] [--paths a,b] [--report]
 */

import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};

const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm").split(",");
const REPORT = args.includes("--report");
/** The width to read the rhythm at. It was hard-coded to 1440, and a phone
    stacks sections that sit side by side on a laptop, so the ground order it
    produces is a different question that had never been asked. */
const WIDTH = Number(flag("width", 1440));

/** A band that separates by other means and so may repeat its neighbour's ground. */
const SELF_SEPARATING = ["mm-film-band"];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const failures = [];
const report = [];

for (const path of PATHS) {
  const page = await browser.newPage({ viewport: { width: WIDTH, height: WIDTH < 700 ? 844 : 900 } });
  await page.goto(BASE + path, { waitUntil: "networkidle" });

  const sections = await page.evaluate((selfSeparating) => {
    const roots = [...document.querySelectorAll(".mm-site > section, main > section, footer")];
    return roots.map((el) => {
      const style = getComputedStyle(el);
      /* A transparent section shows whatever the page paints behind it, which
         is the deep ink ground. Resolve it so two transparent neighbours are
         compared as the same ground rather than as two blanks. */
      const clear = (colour) => colour === "rgba(0, 0, 0, 0)" || colour === "transparent";
      let ground = style.backgroundColor;
      /* Walk up to whichever ancestor actually paints. The site's ground is on
         .mm-site, not on body, so reading body reports a colour nothing shows. */
      for (let node = el.parentElement; node && clear(ground); node = node.parentElement) {
        ground = getComputedStyle(node).backgroundColor;
      }
      const heading = el.querySelector("h1, h2");
      return {
        ground,
        exempt: selfSeparating.some((cls) => el.classList.contains(cls)),
        seam: style.borderTopWidth !== "0px" && style.borderTopColor !== "rgba(0, 0, 0, 0)"
          && style.borderTopColor !== "transparent",
        title: (heading?.textContent ?? el.tagName).trim().slice(0, 46),
      };
    });
  }, SELF_SEPARATING);

  for (const [index, section] of sections.entries()) {
    const previous = sections[index - 1];
    const repeats = previous && previous.ground === section.ground;
    const excused = section.exempt || (previous && previous.exempt) || section.seam;
    report.push({ path, ...section, repeats: Boolean(repeats), excused: Boolean(excused) });
    if (repeats && !excused) {
      failures.push(`${path}: "${section.title}" repeats the ground above it (${section.ground}) with no seam`);
    }
  }
  await page.close();
}
await browser.close();

if (REPORT) {
  console.log("section grounds, top to bottom\n");
  let current = "";
  for (const row of report) {
    if (row.path !== current) { current = row.path; console.log(`  ${current}`); }
    const mark = row.repeats ? (row.excused ? "repeat, excused" : "REPEAT        ") : "               ";
    console.log(`    ${mark} ${row.ground.padEnd(20)} ${row.title}`);
  }
  process.exit(0);
}

if (failures.length) {
  console.error(`\n${failures.length} section(s) share a ground with the one above:`);
  for (const line of failures) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`section rhythm clean: ${report.length} sections across ${PATHS.length} pages, no unseparated repeats`);
