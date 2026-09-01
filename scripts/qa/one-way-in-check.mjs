#!/usr/bin/env node
/**
 * The one-way-in gate.
 *
 * A page asks for details in one place. At the foot of /ai-gtm a phone reader
 * used to meet three "Start here" buttons at once — the close block's, the
 * pinned mobile bar's and the menu's — under body copy that asked for a company
 * address while the box beneath it said "Ask us anything". Two ways in is not a
 * choice, it is a reader wondering which one is the real one.
 *
 * This walks each page and counts the primary actions actually visible at any
 * scroll position. Visible means a real box, not display:none, not
 * visibility:hidden, and not zero opacity — the closed menu has a box and would
 * otherwise be counted, which is how the first version of this check lied.
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
const REPORT = args.includes("--report");

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];
const rows = [];

for (const [width, height] of [[1440, 900], [390, 844]]) {
  for (const path of PATHS) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.goto(BASE + asked(path), { waitUntil: "networkidle" });
    const tall = await page.evaluate(() => document.body.scrollHeight);

    let worst = 0;
    let worstAt = 0;
    let labels = [];
    for (let y = 0; y < tall; y += Math.round(height * 0.6)) {
      await page.evaluate((top) => window.scrollTo(0, top), y);
      await page.waitForTimeout(250);
      const seen = await page.evaluate(() => {
        const out = [];
        for (const el of document.querySelectorAll("a, button")) {
          const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
          if (!/start here|read my business|show me week one/i.test(text)) continue;
          const box = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          const hidden = style.visibility === "hidden" || style.display === "none"
            || Number(style.opacity) === 0 || box.width === 0;
          const onScreen = box.bottom > 0 && box.top < window.innerHeight;
          if (!hidden && onScreen) out.push(text);
        }
        return out;
      });
      if (seen.length > worst) { worst = seen.length; worstAt = y; labels = seen; }
    }
    rows.push({ width, path, worst, worstAt, labels });
    if (worst > 1) {
      problems.push(`${width}px ${path} @${worstAt}px shows ${worst} primary actions at once: ${labels.join(" | ")}`);
    }
    await page.close();
  }
}
await browser.close();

if (REPORT) {
  for (const r of rows) {
    console.log(`  ${String(r.width).padStart(4)} ${r.path.padEnd(14)} most at once: ${r.worst}${r.labels.length ? "  " + r.labels.join(" | ") : ""}`);
  }
  process.exit(0);
}

if (problems.length) {
  console.error(`\n${problems.length} page(s) offering more than one way in at once:`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`one way in: ${rows.length} page/width pairs, never more than one primary action on screen`);
