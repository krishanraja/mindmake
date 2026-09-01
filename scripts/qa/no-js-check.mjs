#!/usr/bin/env node
/**
 * The no-JavaScript gate.
 *
 * Every other check on this site loads the page in a browser that runs
 * everything, which is the one visitor whose experience was never in doubt.
 * The contract's rule is stricter than that: the DOM is always complete, CSS
 * defaults to revealed, and no JavaScript means nothing hidden. Nothing was
 * measuring it.
 *
 * What it missed, for months: `.mm-drum` was `overflow: hidden` and the drum's
 * position is a transform written by a hook, so with scripting off the box
 * showed one card and clipped every other one with no scrollbar. On the
 * questions drum that was one answer of eight and 2,308px of clipped copy, on
 * the section a reader goes to when they have a question. Every unit test
 * passed, because every unit test renders into a jsdom that runs JavaScript,
 * and every browser gate passed, because every browser gate runs JavaScript.
 *
 * Two things are checked, and the second is the general form of the first.
 *
 * REACHABLE: every answer in the page's own corpus is in the served markup.
 *
 * NOT CLIPPED AWAY: no element that the browser actually laid out is hidden by
 * a clipping ancestor that cannot be scrolled. An element with no box at all is
 * fine and is skipped: a closed `<details>` renders nothing, and its summary is
 * a real control that opens it with no script running. An element with a box
 * that has been clipped to nothing is different, because there is no control
 * anywhere that brings it back.
 *
 * Usage:
 *   node scripts/qa/no-js-check.mjs [--base http://127.0.0.1:4180]
 *                                   [--paths /,/ai-brain,/ai-gtm] [--report]
 */
import { chromium } from "playwright";
import { asked } from "./lib/asked.mjs";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm,/faq").split(",");
const REPORT = args.includes("--report");

/** How much of an element's own box has to survive its clipping ancestors. */
const KEPT_FLOOR = 0.06;

/* The corpus, read the way the pages read it. A page is checked against the
   answers it actually renders rather than a list kept here, so adding a
   question to a page cannot quietly escape the gate. */
const corpus = JSON.parse(readFileSync(resolve(process.cwd(), "src/content/answers.json"), "utf8"));
const answers = (corpus.entries ?? corpus).map((entry) => ({ id: entry.id, question: entry.question, answer: entry.answer }));

/** Text a browser will have collapsed, matched the same way. */
const flatten = (text) => text.replace(/\s+/g, " ").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
const problems = [];
const rows = [];

for (const path of PATHS) {
  const page = await context.newPage();
  await page.goto(BASE + asked(path), { waitUntil: "load" });

  const text = flatten(await page.evaluate(() => document.body.textContent ?? ""));
  /* The questions this page renders, taken from the page rather than a list
     kept here, and each one's answer looked for in the served markup. */
  const onPage = answers.filter((entry) => text.includes(flatten(entry.question)));
  const missing = onPage.filter((entry) => !text.includes(flatten(entry.answer)));

  const clipped = await page.evaluate((floor) => {
    const out = [];
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,blockquote,figcaption")) {
      const box = el.getBoundingClientRect();
      const area = box.width * box.height;
      /* No box at all: not laid out, so not clipped. A closed <details> and a
         display:none branch both land here, and both are opened by a control
         the browser itself provides. */
      if (area <= 0) continue;
      let t = box.top, l = box.left, w = box.width, h = box.height;
      let cage = null;
      for (let node = el.parentElement; node; node = node.parentElement) {
        const cs = getComputedStyle(node);
        const overflow = `${cs.overflowX} ${cs.overflowY}`;
        const c = node.getBoundingClientRect();
        if (/auto|scroll/.test(overflow)) {
          /* Scrollable, so the reader can bring this into the box. What is
             visible afterwards is the element, or the box if the box is
             smaller. Carrying its far-off-screen position further up the tree
             is what made the first version of this call every card in a
             working scroller unreachable. */
          w = Math.min(w, c.width); h = Math.min(h, c.height);
          t = c.top; l = c.left;
          continue;
        }
        if (!/hidden|clip/.test(overflow)) continue;
        const kept = Math.max(0, Math.min(t + h, c.bottom) - Math.max(t, c.top)) * Math.max(0, Math.min(l + w, c.right) - Math.max(l, c.left));
        if (kept < w * h) cage = `${node.tagName.toLowerCase()}.${(node.className || "").toString().split(" ")[0]}`;
        const nt = Math.max(t, c.top), nl = Math.max(l, c.left);
        h = Math.max(0, Math.min(t + h, c.bottom) - nt);
        w = Math.max(0, Math.min(l + w, c.right) - nl);
        t = nt; l = nl;
      }
      const kept = (w * h) / area;
      if (kept < floor) out.push({ cage, kept: Math.round(kept * 1000) / 1000, text: (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 52) });
    }
    return out;
  }, KEPT_FLOOR);

  rows.push({ path, asked: onPage.length, missing: missing.length, clipped: clipped.length });
  if (missing.length) {
    problems.push(`${path}: ${missing.length} of ${onPage.length} answers not in the markup: ${missing.map((m) => m.id).join(", ")}`);
  }
  if (clipped.length) {
    const cages = [...new Set(clipped.map((c) => c.cage))].join(", ");
    problems.push(`${path}: ${clipped.length} text block(s) laid out and then clipped away inside ${cages}, with no way to scroll to them — first: "${clipped[0].text}"`);
  }
  await page.close();
}
await context.close();
await browser.close();

if (REPORT) {
  for (const r of rows) {
    console.log(`  ${r.path.padEnd(12)} ${String(r.asked).padStart(2)} answers asked, ${r.missing} missing, ${r.clipped} clipped away`);
  }
  process.exit(0);
}

if (problems.length) {
  console.error(`\nWith JavaScript off, ${problems.length} problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`no JavaScript: ${rows.length} pages, ${rows.reduce((n, r) => n + r.asked, 0)} answers all present, nothing clipped away`);
