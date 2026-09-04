#!/usr/bin/env node
/**
 * The two pieces of fixed chrome, driven into their states.
 *
 * The privacy strip and the mobile action bar are the only things on this site
 * that float over the reading, and neither is on the page at rest, so no gate
 * here had ever seen either of them. Krish photographed the strip on an Android
 * phone on 4 September 2026: floating 76px above the bottom of the screen with
 * the page showing underneath, its one sentence broken over two lines, and its
 * button reading GOT / IT. Every one of those reproduced at every phone size
 * the moment anything scrolled, and three separate causes were behind them.
 *
 * 1. The strip was positioned `bottom: 76px`, the action bar's height, whether
 *    or not the bar was there. The bar appears later than the strip and stands
 *    down whenever the page's own action is on screen, so most of the time it
 *    was not.
 * 2. The strip is the one public surface rendered outside `.mm-site`, so the
 *    scaffold's bare `p { font-size: 16px }` in `src/index.css` reached it. A
 *    bare element rule beats inheritance whatever its specificity, so a row
 *    designed at 10.5px rendered at 16px and wrapped.
 * 3. `white-space: nowrap; text-wrap: initial` on the same rule: the second
 *    declaration is the first shorthand's own longhand, reset to `wrap`, so the
 *    sentence had never been on one line since the day it was written.
 *
 * What this asks, at eight screen sizes, on two pages, at normal text and at
 * the 1.5x an Android visitor's accessibility setting produces:
 *
 * 1. **Flush.** The strip sits on the bottom edge of the screen on a phone, and
 *    at its designed inset in the corner on a laptop. No gap with page showing
 *    through it.
 * 2. **Stacked, never overlapping.** The action bar sits on the strip when both
 *    are up, and the two rectangles do not intersect.
 * 3. **Compact.** Neither is taller than a budget, in pixels and as a share of
 *    the screen, so fixed chrome cannot eat the reading.
 * 4. **Unbroken.** The button's label is on one line, and nothing inside either
 *    overflows its own box sideways.
 * 5. **Out of the way.** Neither covers the page's primary action, and the
 *    footer's last line is reachable underneath both.
 *
 * Usage:
 *   node scripts/qa/fixed-chrome-check.mjs [--base http://127.0.0.1:4180]
 *                                          [--report]
 */
import { chromium } from "playwright";
import { asked } from "./lib/asked.mjs";
import { serveBoard } from "./lib/board-fixture.mjs";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/ai-gtm").split(",");
const REPORT = args.includes("--report");

/** The same eight as `qa:screens`, for the same reasons, plus the phone in the photograph. */
const SIZES = [
  [360, 800], [390, 844], [412, 915], [430, 932],
  [768, 1024], [1024, 768], [1280, 800], [1440, 900],
];

/**
 * Text scales to run every size at.
 *
 * 1 is the design. 1.5 is what an Android visitor gets with the accessibility
 * text slider up, and close to what Chrome's own font boosting did to this
 * strip before `text-size-adjust: 100%`. A layout that only holds at 1 is a
 * layout that holds for some people.
 */
const SCALES = [1, 1.5];

/**
 * The tallest either piece of chrome may be, by text scale.
 *
 * At the design's own size the strip is one row of about 40px and the bar one
 * button of about 72px. At 1.5x a phone strip may fall into two rows and still
 * be tidy, which is where 128px comes from. A height budget is the weakest of
 * the three checks on this and it is here for the case the other two miss: the
 * defect in the photograph measured 65px against a 39px design and sat inside
 * the first budget written here, so what actually catches it is the sentence's
 * line count and whether the sentence and the button still share a row.
 */
const MAX_HEIGHT = { 1: 80, 1.5: 128 };
const MAX_SHARE = Number(flag("max-share", 0.18));
/** How far from the bottom edge the strip may sit before it is floating. */
const FLUSH_SLACK = 1.5;
/** The corner card's designed inset on a laptop, from `--mm-safe-bottom` + 14. */
const DESKTOP_INSET = 14;

const problems = [];
const rows = [];
const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});

for (const [width, height] of SIZES) {
  const phone = width < 768;
  for (const scale of SCALES) {
    for (const path of PATHS) {
      const context = await browser.newContext({
        viewport: { width, height },
        isMobile: phone,
        hasTouch: phone,
        deviceScaleFactor: 1,
      });
      const page = await context.newPage();
      await serveBoard(page);
      /* A visitor who has never answered, which is the only visitor who sees
         the strip at all. */
      await context.addInitScript(() => { try { localStorage.clear(); } catch { /* blocked */ } });
      await page.goto(BASE + asked(path), { waitUntil: "networkidle" }).catch(() => {});
      if (scale !== 1) {
        /* Every font size multiplied once, which is what a phone's text-size
           setting does. An `em` rule on a subtree is not the same thing: it
           compounds at every level, so a link inside a paragraph came out at
           2.25x and the gate reported a 160px strip the site never renders. */
        await page.evaluate((factor) => {
          /* Read every size first, then write. Writing as it walks inflates
             the parent before the child is read, and the child inherits the
             new value: the bar's button came out at 38px from a 17px design
             and the gate reported a 167px bar the site never renders. */
          const sizes = [];
          for (const root of document.querySelectorAll(".mm-cookie-notice, .mm-action-bar")) {
            for (const el of [root, ...root.querySelectorAll("*")]) {
              const size = parseFloat(getComputedStyle(el).fontSize);
              if (size) sizes.push([el, size]);
            }
          }
          for (const [el, size] of sizes) el.style.setProperty("font-size", `${size * factor}px`, "important");
        }, scale);
      }

      /* Three positions: past the strip's threshold and before the bar's,
         past both, and the foot of the page where the footer must still be
         readable underneath whatever is up. */
      for (const [label, place] of [
        ["strip only", () => window.scrollTo(0, window.innerHeight * 0.7)],
        ["both", () => window.scrollTo(0, window.innerHeight * 3)],
        ["foot", () => window.scrollTo(0, document.body.scrollHeight)],
      ]) {
        await page.evaluate(place);
        await page.waitForTimeout(420);

        const read = await page.evaluate(() => {
          const box = (el) => {
            if (!el) return null;
            const style = getComputedStyle(el);
            if (style.display === "none" || style.visibility === "hidden") return null;
            const b = el.getBoundingClientRect();
            if (b.height === 0) return null;
            /* A bar translated off the bottom is not on screen. */
            if (b.top >= window.innerHeight - 0.5) return null;
            return { top: b.top, bottom: b.bottom, left: b.left, right: b.right, height: b.height, width: b.width };
          };
          const notice = document.querySelector(".mm-cookie-notice");
          const bar = document.querySelector(".mm-action-bar");
          const button = notice?.querySelector("button");
          const overflow = (el) => (el ? Math.round(el.scrollWidth - el.clientWidth) : 0);
          const lineCount = (el) => {
            if (!el) return 0;
            const style = getComputedStyle(el);
            const line = parseFloat(style.lineHeight) || parseFloat(style.fontSize) * 1.2;
            const inner = el.getBoundingClientRect().height
              - parseFloat(style.paddingTop) - parseFloat(style.paddingBottom)
              - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth);
            return Math.max(1, Math.round(inner / line));
          };
          const buried = [];
          const footerLast = document.querySelector(".mm-footer small");
          return {
            notice: box(notice),
            bar: box(bar),
            noticeOverflow: overflow(notice),
            barOverflow: overflow(bar),
            buttonLines: lineCount(button),
            sentenceLines: lineCount(notice?.querySelector("p")),
            /* Whether the sentence and the button are still on one row,
               by their centres. The row breaking is what a reader sees as
               the strip glitching, and it happens without either piece
               wrapping inside itself. */
            rowSplit: (() => {
              const p = notice?.querySelector("p");
              const b = notice?.querySelector("button");
              if (!p || !b) return 0;
              const pb = p.getBoundingClientRect();
              const bb = b.getBoundingClientRect();
              return Math.round(Math.abs((pb.top + pb.bottom) / 2 - (bb.top + bb.bottom) / 2));
            })(),
            buttonBox: button ? button.getBoundingClientRect().right : null,
            buried: [...new Set(buried)],
            footerLast: footerLast ? footerLast.getBoundingClientRect() : null,
            viewport: { width: window.innerWidth, height: window.innerHeight },
            documentWidth: document.documentElement.scrollWidth,
          };
        });

        const where = `${width}x${height} ${path} ${label} x${scale}`;
        rows.push({ where, notice: read.notice, bar: read.bar, buttonLines: read.buttonLines });
        if (!read.notice) continue;

        const gap = read.viewport.height - read.notice.bottom;
        if (phone) {
          if (gap > FLUSH_SLACK) problems.push(`${where}: the privacy strip floats ${Math.round(gap)}px above the bottom of the screen`);
          if (Math.abs(read.notice.left) > FLUSH_SLACK || Math.abs(read.notice.right - read.viewport.width) > FLUSH_SLACK) {
            problems.push(`${where}: the privacy strip is not full width (${Math.round(read.notice.left)} to ${Math.round(read.notice.right)} of ${read.viewport.width})`);
          }
        } else if (Math.abs(gap - DESKTOP_INSET) > 2) {
          problems.push(`${where}: the privacy card sits ${Math.round(gap)}px from the bottom, not its designed ${DESKTOP_INSET}px`);
        }

        for (const [name, chrome] of [["privacy strip", read.notice], ["action bar", read.bar]]) {
          if (!chrome) continue;
          const budget = MAX_HEIGHT[scale] ?? 128;
          if (chrome.height > budget) problems.push(`${where}: the ${name} is ${Math.round(chrome.height)}px tall, over ${budget}px at this text scale`);
          if (chrome.height > read.viewport.height * MAX_SHARE) {
            problems.push(`${where}: the ${name} takes ${Math.round((chrome.height / read.viewport.height) * 100)}% of the screen, over ${Math.round(MAX_SHARE * 100)}%`);
          }
        }
        for (const name of read.buried) problems.push(`${where}: the ${name} buries the page's primary action`);

        if (read.notice && read.bar) {
          const overlap = read.notice.top < read.bar.bottom && read.notice.bottom > read.bar.top;
          if (overlap) problems.push(`${where}: the action bar and the privacy strip overlap (bar ${Math.round(read.bar.top)}-${Math.round(read.bar.bottom)}, strip ${Math.round(read.notice.top)}-${Math.round(read.notice.bottom)})`);
        }

        if (read.buttonLines > 1) problems.push(`${where}: the privacy strip's button label is on ${read.buttonLines} lines`);
        /* At the design's own text size the sentence is one line. This is the
           defect in the photograph: the strip is the one public surface
           rendered outside `.mm-site`, a bare `p { font-size: 16px }` in the
           scaffold stylesheet reached it, and a row drawn for 10.5px wrapped.
           A height budget did not catch it on its own. */
        if (scale === 1 && read.sentenceLines > 1) problems.push(`${where}: the privacy strip's sentence is on ${read.sentenceLines} lines at the design's own text size`);
        if (scale === 1 && read.rowSplit > 4) problems.push(`${where}: the privacy strip has broken into two rows at the design's own text size (sentence and button ${read.rowSplit}px apart)`);
        if (read.noticeOverflow > 1) problems.push(`${where}: the privacy strip overflows itself sideways by ${read.noticeOverflow}px`);
        if (read.barOverflow > 1) problems.push(`${where}: the action bar overflows itself sideways by ${read.barOverflow}px`);
        if (read.documentWidth > read.viewport.width + 1) problems.push(`${where}: the document scrolls sideways (${read.documentWidth} > ${read.viewport.width})`);

        if (label === "foot" && read.footerLast) {
          const covered = read.notice.top < read.footerLast.bottom && read.notice.bottom > read.footerLast.top;
          if (covered) problems.push(`${where}: the privacy strip covers the last line of the footer, so its reserve is not being read`);
          if (read.bar) {
            const barCovered = read.bar.top < read.footerLast.bottom && read.bar.bottom > read.footerLast.top;
            if (barCovered) problems.push(`${where}: the action bar covers the last line of the footer`);
          }
        }
      }
      /* And the question `qa:screens` asks, asked again with the chrome up:
         a reader who has scrolled to the page's own action can press it.
         Asked at the middle of the screen rather than wherever the action
         happens to sit, because chrome on the bottom edge clips the last few
         pixels of a tall card at some scroll position on any page, and a card
         the reader can scroll is not a buried action. */
      const buried = await page.evaluate(async () => {
        const found = [];
        for (const target of document.querySelectorAll("[data-mm-primary]")) {
          target.scrollIntoView({ block: "center" });
          await new Promise((done) => setTimeout(done, 320));
          const b = target.getBoundingClientRect();
          if (b.height === 0) continue;
          const at = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
          if (!at || target.contains(at) || at.contains(target)) continue;
          const chrome = at.closest(".mm-cookie-notice, .mm-action-bar");
          if (chrome) found.push(chrome.classList.contains("mm-cookie-notice") ? "privacy strip" : "action bar");
        }
        return [...new Set(found)];
      });
      for (const name of buried) problems.push(`${width}x${height} ${path} x${scale}: the ${name} buries an action the reader has scrolled to`);

      await context.close();
    }
  }
}
await browser.close();

if (REPORT) {
  for (const row of rows) {
    console.log(
      `  ${row.where.padEnd(34)}`
      + `  strip ${row.notice ? `${Math.round(row.notice.height)}px at ${Math.round(row.notice.top)}` : "none".padEnd(12)}`
      + `  bar ${row.bar ? `${Math.round(row.bar.height)}px at ${Math.round(row.bar.top)}` : "none"}`
      + `  button ${row.buttonLines || "-"} line`,
    );
  }
}

if (problems.length) {
  const unique = [...new Set(problems)];
  console.error(`\n${unique.length} problem(s) with the fixed chrome:`);
  for (const line of unique) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`fixed chrome clean: ${SIZES.length} sizes x ${PATHS.length} pages x ${SCALES.length} text scales, the strip flush and the bar stacked on it, nothing broken, nothing covered`);
