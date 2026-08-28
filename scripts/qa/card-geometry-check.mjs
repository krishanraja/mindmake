#!/usr/bin/env node
/**
 * The card geometry gate.
 *
 * Cards in a rail have to be the same height, and the rows inside them have to
 * line up with the rows beside them. That was reported as "the cards are
 * different heights" and it had one cause: the track hugged each card's own
 * content, so the quote, the name and the button all landed at a different
 * height on every card in the row.
 *
 * This measures it rather than trusting the CSS. It reads every card in a rail,
 * checks the heights match, checks each row's top offset within its card
 * matches its neighbours', and checks that opening a card does not move
 * anything below the rail.
 */
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const BASE = flag("base", "http://127.0.0.1:4180");
const PATHS = flag("paths", "/,/case-studies").split(",");
/** A pixel of rounding is fine; a row landing somewhere else is not. */
const TOLERANCE = Number(flag("tolerance", 1.5));

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];

for (const path of PATHS) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  const drum = await page.$(".mm-drum");
  if (!drum) { await page.close(); continue; }
  await drum.scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);

  const read = await page.evaluate(() => {
    const cards = [...document.querySelectorAll(".mm-drum-track > .mm-voice")];
    return cards.map((card) => {
      const box = card.getBoundingClientRect();
      const row = (selector) => {
        const el = card.querySelector(selector);
        return el ? Math.round((el.getBoundingClientRect().top - box.top) * 10) / 10 : null;
      };
      return {
        height: Math.round(box.height * 10) / 10,
        quote: row("blockquote"),
        by: row(".mm-voice-by"),
        more: row(".mm-voice-more"),
      };
    });
  });

  if (read.length < 2) { await page.close(); continue; }
  const first = read[0];
  for (const [at, card] of read.entries()) {
    if (Math.abs(card.height - first.height) > TOLERANCE) {
      problems.push(`${path} card ${at}: height ${card.height} against ${first.height}`);
    }
    for (const row of ["quote", "by", "more"]) {
      if (card[row] === null || first[row] === null) continue;
      if (Math.abs(card[row] - first[row]) > TOLERANCE) {
        problems.push(`${path} card ${at}: ${row} row at ${card[row]} against ${first[row]}`);
      }
    }
  }

  /* Opening a card must not move the page. */
  const below = await page.evaluate(() => {
    const after = document.querySelector(".mm-drum-count");
    return after ? Math.round(after.getBoundingClientRect().top) : null;
  });
  /* Dispatched rather than clicked: the drum drifts continuously, so Playwright's
     actionability check never sees a stable element and waits forever. */
  const opener = await page.$(".mm-drum-track > .mm-voice .mm-voice-more");
  if (opener && below !== null) {
    await opener.dispatchEvent("click");
    await page.waitForTimeout(400);
    const moved = await page.evaluate(() => {
      const after = document.querySelector(".mm-drum-count");
      return after ? Math.round(after.getBoundingClientRect().top) : null;
    });
    if (Math.abs(moved - below) > 2) {
      problems.push(`${path}: opening a card moved the content below it by ${moved - below}px`);
    }
  }
  console.log(`${path}: ${read.length} cards, height ${first.height}px, rows at ${first.quote}/${first.by}/${first.more}`);
  await page.close();
}
await browser.close();

if (problems.length) {
  console.error(`\n${problems.length} card geometry problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log("card geometry clean: equal heights, aligned rows, no reflow on open");
