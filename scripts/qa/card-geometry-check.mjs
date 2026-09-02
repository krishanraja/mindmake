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
import { asked } from "./lib/asked.mjs";

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
  await page.goto(BASE + asked(path), { waitUntil: "networkidle" });
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

  /* Opening a card must not move the page, and must not scroll it either.
     Measured apart, because the first version of this reported an 861px move
     that was really the browser scrolling to a newly focused panel. */
  const before = await page.evaluate(() => {
    const after = document.querySelector(".mm-drum-count");
    return {
      top: after ? Math.round(after.getBoundingClientRect().top) : null,
      scroll: Math.round(window.scrollY),
      tall: document.documentElement.scrollHeight,
    };
  });
  const below = before.top;
  /* Dispatched rather than clicked: the drum drifts continuously, so Playwright's
     actionability check never sees a stable element and waits forever. */
  const opener = await page.$(".mm-drum-track > .mm-voice .mm-voice-more");
  if (opener && below !== null) {
    await opener.dispatchEvent("click");
    await page.waitForTimeout(400);
    const after = await page.evaluate(() => ({
      top: (() => { const el = document.querySelector(".mm-drum-count"); return el ? Math.round(el.getBoundingClientRect().top) : null; })(),
      scroll: Math.round(window.scrollY),
      tall: document.documentElement.scrollHeight,
    }));
    if (after.tall !== before.tall) {
      problems.push(`${path}: opening a card changed the page height by ${after.tall - before.tall}px`);
    }
    if (after.scroll !== before.scroll) {
      problems.push(`${path}: opening a card scrolled the page by ${after.scroll - before.scroll}px`);
    }
    if (below !== null && after.top !== null && Math.abs((after.top - after.scroll) - (below - before.scroll)) > 2) {
      problems.push(`${path}: opening a card moved the content below it by ${after.top - below}px`);
    }
  }
  /* Every control that moves a deck or a rail actually moves it.
   *
   * The story deck shipped on 2 September 2026 with arrows that did nothing at
   * all above about 1200px. It borrowed the rail's bound, `count * pitch -
   * viewport`, and a deck has no track to run out of: on a laptop the frame is
   * wider than eight cards at a 150px pitch, so the expression went negative,
   * clamped to zero travel, and every press was a no-op. It worked on a phone
   * by arithmetic accident, which is why every check that ran at 390 was happy.
   *
   * Nothing here was looking. The gates measure geometry, reachability and
   * motion; none of them pressed a button and asked whether anything happened.
   * So this presses the next arrow of every deck and rail on the page and fails
   * if the thing it drives is in the same place afterwards. */
  for (const [name, group, arrow] of [
    ["deck", ".mm-deck", ".mm-index-hint button:last-of-type"],
    ["voices rail", ".mm-drum", ".mm-drum-arrows button:last-of-type"],
  ]) {
    const control = await page.$(arrow);
    if (!control) continue;
    const where = () => page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      /* A deck writes its position to a custom property and a rail transforms
         its track, so read whichever this one uses. */
      return `${getComputedStyle(el).getPropertyValue("--mm-deck-at").trim()}|${el.querySelector(".mm-drum-track")?.style.transform ?? ""}`;
    }, group);
    const before = await where();
    if (before === null) continue;
    await control.scrollIntoViewIfNeeded();
    await control.click();
    await page.waitForTimeout(650);
    const after = await where();
    if (before === after) {
      problems.push(`${path}: pressing the ${name}'s next arrow moved nothing (${before || "unset"})`);
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
