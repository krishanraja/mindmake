#!/usr/bin/env node
/**
 * Declarations a component makes that can never win.
 *
 * On 2 September 2026 Krish pointed at one line on `/ai-brain` sitting flush
 * against the two cards above it. The line asks for `margin-top: 30px` in
 * `.mm-payoff` and was computing 0, because `mindmake.css` carried
 * `.mm-site h1, .mm-site p, ... { margin: 0 }` at (0,1,1), and that is above
 * every single-class rule in this repository. Not "wins on order" — cannot
 * lose. Measuring the whole site found 16 more of them across five pages: the
 * fork's "No email required" flush against its buttons, the questions heading
 * with no space under it, the drum's provenance note with none above it, the
 * story outcome, the board's rebuilding line, the founder's name.
 *
 * The same shape had already cost the lead dialog its step rail's typography,
 * where `.mm-site button { font: inherit }` beat `.mm-brief-path button` and
 * the rail rendered at the body's 17px serif for months.
 *
 * A site-wide default that outranks the components it serves is not a default,
 * it is an override, and nothing in a code review shows it: both rules read
 * correctly on their own and the file that loses is not the file being read.
 * So this asks the browser instead. For every element on every page it walks
 * the author rules that match, and reports any declaration from a rule of one
 * class or less that is beaten by a `.mm-site` reset.
 *
 * The fix is `:where()`, which contributes no specificity: a reset written as
 * `:where(.mm-site) :where(p, h2, ...)` still beats the browser's own
 * stylesheet, because an author rule always does, and now loses to any
 * component that asks for something, which is the whole job of a reset.
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
const WIDTH = Number(flag("width", 1440));
const PATHS = ["/", "/ai-brain", "/ai-gtm", "/case-studies", "/faq"];

/* Properties where losing changes the layout or the reading. A reset winning on
   `box-sizing` is the reset doing its job; a reset winning on `margin-top` is
   a component being silently ignored. */
const WATCHED = [
  "margin-top", "margin-bottom", "margin-left", "margin-right",
  "padding-top", "padding-bottom",
  "font-size", "font-weight", "font-family", "line-height",
  "max-width", "text-wrap", "color",
];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const page = await browser.newPage({ viewport: { width: WIDTH, height: WIDTH < 700 ? 844 : 900 } });
await serveBoard(page);

const problems = new Map();
for (const path of PATHS) {
  await page.goto(asked(BASE, path), { waitUntil: "networkidle" });
  /* Everything on the page, including what only mounts once it is looked at. */
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 500) {
      window.scrollTo(0, y);
      await new Promise((done) => setTimeout(done, 20));
    }
    window.scrollTo(0, 0);
  });

  const rows = await page.evaluate((watched) => {
    /* Every author declaration on a watched property, with the selector that
       carries it. Media queries are skipped: this runs at one width, and a
       rule that only applies at another is not dead, it is elsewhere. */
    const declarations = [];
    for (const sheet of document.styleSheets) {
      let list;
      try { list = sheet.cssRules; } catch { continue; }
      const walk = (rules) => {
        for (const rule of rules) {
          if (rule.media) continue;
          /* Recurse, but do not skip the rule itself for having a list. Since
             nested CSS landed, every CSSStyleRule carries a `cssRules` of its
             own, empty for a plain rule, and an empty CSSRuleList is truthy.
             The first version of this gate treated that as "this is a group,
             move on", collected nothing at all, and passed a tree it had been
             written to fail. `.length` is the difference. */
          if (rule.cssRules?.length) walk(rule.cssRules);
          if (!rule.selectorText || !rule.style) continue;
          /* A bare `0` and a computed `0px` are the same length, and comparing
             them as strings is how the first version of this gate passed on a
             tree it was written to fail. */
          const unit = (v) => (v.trim() === "0" ? "0px" : v.trim());
          for (const prop of watched) {
            const value = rule.style.getPropertyValue(prop);
            if (value) declarations.push({ sel: rule.selectorText, prop, value: unit(value) });
          }
          /* `margin: 30px 0 0` sets margin-top too. */
          const shorthand = rule.style.getPropertyValue("margin");
          if (shorthand) declarations.push({ sel: rule.selectorText, prop: "margin-top", value: unit(shorthand.split(/\s+/)[0]) });
        }
      };
      walk(list);
    }

    /* Which of a selector's comma-separated parts matched, and how heavy it is. */
    const weigh = (selector, el) => {
      const part = selector.split(",").map((s) => s.trim())
        .find((s) => { try { return el.matches(s); } catch { return false; } });
      if (!part) return null;
      const bare = part.replace(/:where\([^)]*\)/g, " ");   // :where() counts for nothing
      return {
        part,
        ids: (bare.match(/#[\w-]+/g) || []).length,
        classes: (bare.match(/\.[\w-]+|\[[^\]]+\]|:(?!:)[\w-]+/g) || []).length,
        elements: (bare.match(/(^|[\s>+~])[a-z][\w-]*/g) || []).length,
      };
    };
    const isReset = (part) => /\.mm-site\b/.test(part) && !/\.mm-[a-z0-9-]+(?<!site)\b(?![\w-]*\()/.test(part.replace(/\.mm-site\b/g, ""));

    const out = [];
    const seen = new Set();
    for (const el of document.querySelectorAll("body *")) {
      const cs = getComputedStyle(el);
      if (cs.display === "none") continue;
      const cls = (el.className || "").toString().trim();
      if (!cls || !/\bmm-/.test(cls)) continue;
      const key = el.tagName + "|" + cls;
      if (seen.has(key)) continue;
      seen.add(key);

      for (const dec of declarations) {
        const mine = weigh(dec.sel, el);
        if (!mine) continue;
        if (isReset(mine.part)) continue;                       // the reset itself
        if (mine.ids || mine.classes > 1 || mine.elements) continue;   // heavier than (0,1,0)
        if (/var\(|auto|inherit|initial|unset/.test(dec.value)) continue;
        const want = /^-?[\d.]+px$/.test(dec.value) ? parseFloat(dec.value) : null;
        const got = cs.getPropertyValue(dec.prop);
        if (want !== null) { if (Math.abs(parseFloat(got) - want) <= 0.6) continue; }
        else if (got.trim() === dec.value) continue;

        /* It lost. To a reset, or to a component that meant to win? */
        const winner = declarations
          .map((other) => ({ other, w: weigh(other.sel, el) }))
          .filter((row) => row.w && row.other.prop === dec.prop && row.w !== mine)
          .filter((row) => {
            const v = row.other.value;
            if (want !== null) return /^-?[\d.]+px$/.test(v) && Math.abs(parseFloat(v) - parseFloat(got)) <= 0.6;
            return v === got.trim() || (v === "0" && parseFloat(got) === 0);
          })
          .find((row) => isReset(row.w.part));
        if (!winner) continue;

        out.push(`${mine.part} { ${dec.prop}: ${dec.value} } is dead: "${winner.w.part}" sets ${got.trim()} at higher specificity   [<${el.tagName.toLowerCase()} class="${cls.slice(0, 46)}">]`);
      }
    }
    return [...new Set(out)];
  }, WATCHED);

  for (const row of rows) problems.set(row, (problems.get(row) ?? new Set()).add(path));
}
await browser.close();

if (problems.size) {
  console.error(`\n${problems.size} declaration(s) a component makes and can never win, at ${WIDTH}px:\n`);
  for (const [row, paths] of problems) console.error(`  ${row}  ${[...paths].join(" ")}`);
  console.error(`\nWrap the reset in :where() so it carries no specificity, rather than raising every component that loses to it.`);
  process.exit(1);
}
console.log(`no dead component declarations at ${WIDTH}px: ${PATHS.length} pages, ${WATCHED.length} properties`);
