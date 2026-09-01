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
 *
 * ## The fork, sanctioned 1 September 2026
 *
 * The homepage's one button became two, the two doors by name, because the
 * choice between them was already being made and the visitor was not being
 * asked: each door carries its own four pressure questions and every `Start
 * here` was passing none. Two buttons named `Build your AI brain` and `Build
 * your AI GTM` do not match this gate's text pattern, so they would have slipped
 * past it silently. Renaming a button is not the same as deciding, so the rule
 * changed instead.
 *
 * **One way in, which may be one fork of exactly two named doors, adjacent, in
 * one control group.** A `[role="group"]` holding both, and nothing else on the
 * screen. Two primary actions that are not in the same group still fail, three
 * in a group fail, and a group in one corner with a stray `Start here` in the
 * other fails, which is the defect this gate was built for.
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
        const groups = new Map();
        for (const el of document.querySelectorAll("a, button")) {
          const text = (el.textContent ?? "").trim().replace(/\s+/g, " ");
          /* A way in opens the details capture. A link navigates. That
             distinction is what the first version of this gate got for free by
             reading only the words `start here`, and lost the moment the
             homepage's button became the two doors by name: the header menu and
             the footer say those same words as navigation, and counting them
             would have failed every page for having a site map.

             So: anything marked as a way in, plus any button saying one of
             these, because a button cannot navigate and a button saying Start
             here is a way in somebody forgot to mark. Never a link. */
          const marked = el.hasAttribute("data-mm-primary");
          const says = /start here|read my business|show me week one|build your ai (brain|gtm)/i.test(text);
          if (!marked && !(says && el.tagName === "BUTTON")) continue;
          const box = el.getBoundingClientRect();
          const style = getComputedStyle(el);
          const hidden = style.visibility === "hidden" || style.display === "none"
            || Number(style.opacity) === 0 || box.width === 0;
          const onScreen = box.bottom > 0 && box.top < window.innerHeight;
          if (hidden || !onScreen) continue;
          /* A fork counts once, and only as a fork: exactly two, in one group,
             which is what makes it one decision rather than two offers. */
          const group = el.closest("[role='group']");
          const key = group ?? el;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key).push(text);
        }
        for (const [key, texts] of groups) {
          const isFork = key !== texts[0] && typeof key.closest === "function"
            && key.getAttribute?.("role") === "group" && texts.length === 2;
          if (isFork) out.push(`${texts.join(" + ")} (one fork)`);
          else for (const t of texts) out.push(t);
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
