#!/usr/bin/env node
/**
 * Every screen size, in one pass.
 *
 * Every other browser gate here runs at 1440 and 390, which are a laptop and
 * one phone. Krish asked for the whole range, and the range is where the
 * interesting failures are: a section that reads well on a 390px phone can be
 * two and a half screens on a 360px one, a two-column grid can collapse at 768
 * and leave a column of nothing at 1024, and a layout tuned for 1440 can strand
 * its content in the middle third at 1920.
 *
 * Eight sizes, three pages, and four questions per pair.
 *
 * 1. **Section budget.** No section runs past `--budget` screens. The rule this
 *    enforces is not a height cap for its own sake: a section over about one and
 *    a third screens on a phone is almost always several sections that have not
 *    been separated yet. The homepage's proof strip was a heading, a film, three
 *    story cards, a link, thirty-three quotes on a drum and a rail of logos, and
 *    it ran 2.61 screens at 360px. The exemptions below are named and each one
 *    says why.
 *
 * 2. **No sideways scroll.** The document is never wider than the viewport.
 *
 * 3. **Nothing clipped away.** No text the browser laid out is hidden inside a
 *    box that cannot be scrolled to, which is the same test
 *    `scripts/qa/no-js-check.mjs` runs with scripting off.
 *
 * 4. **The action is reachable.** No fixed chrome covers the page's primary
 *    action, which is what a sticky bar does to a close block if nobody checks.
 *
 * Usage:
 *   node scripts/qa/screen-matrix-check.mjs [--base http://127.0.0.1:4180]
 *                                           [--paths /,/ai-brain,/ai-gtm]
 *                                           [--budget 1.35] [--report]
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
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm,/new-age-leadership").split(",");
const BUDGET = Number(flag("budget", 1.35));
const REPORT = args.includes("--report");

/**
 * The sizes, and why each one is here.
 *
 * 360 is the narrowest phone still in real use and the width every section
 * budget is set by. 390 and 430 are the two common iPhone widths. 768 is a
 * tablet portrait and the width most two-column grids switch at. 1024 is a
 * tablet landscape and a small laptop, and it is short: 768px of height is
 * where a tall section hurts most. 1280 and 1440 are laptops. 1920 is a desktop
 * monitor, where the failure is content stranded in a narrow middle.
 */
const SIZES = [
  [360, 800], [390, 844], [430, 932],
  [768, 1024], [1024, 768], [1280, 800], [1440, 900], [1920, 1080],
];

/**
 * Sections allowed past the budget, by the text they start with, and why.
 *
 * Named rather than counted, the way `qa:rhythm` names its own, so that adding
 * an exemption is a decision somebody has to write a reason for.
 */
const EXEMPT = [
  {
    match: /^Thirty days builds it/,
    why: "The pinned climb. It is taller than the screen on purpose: its contents are sticky inside it, so three levels cost one screen of looking rather than three of scrolling.",
  },
  {
    match: /^What AI changes about selling/,
    why: "The lever panel is one instrument, not several sections: four dials in one frame with their needles swinging together across a single read. Splitting it would be splitting a gauge in half. It is 1.44 screens on a 360px phone and under budget on every other size.",
  },
  {
    match: /^What that looks like in a working company/,
    why: "The org chart on /new-age-leadership. Eleven roles in one diagram, and on a phone the diagram is a stack of eleven cards: 880px of the section's 1,154px is the chart itself. Splitting it would be two org charts. It is 1.44 screens on a 360px phone, 1.30 on a 390, and under budget at every other size.",
  },
  {
    match: /^Four details and two taps/,
    why: "The /ai-brain form asks three chip questions rather than one, which is what makes the read about the reader's week instead of the company. Four fields and three sets of choices do not fit 800px, and asking less to hit a number is the wrong trade.",
  },
];

const browser = await chromium.launch({
  executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium",
});
const problems = [];
const rows = [];

for (const [width, height] of SIZES) {
  const context = await browser.newContext({
    viewport: { width, height },
    isMobile: width < 700,
    hasTouch: width < 700,
  });
  const page = await context.newPage();
  /* The board's own network, stubbed, so a section measured here is the section
     production shows rather than "The read is rebuilding". This served
     `{"items":[]}` until 2 September 2026, which matches neither shape the
     function returns, so it measured the collapsed board under a comment
     claiming the opposite. */
  await serveBoard(page);

  for (const path of PATHS) {
    await page.goto(BASE + asked(path), { waitUntil: "networkidle" });
    await page.waitForTimeout(600);

    const seen = await page.evaluate((vh) => {
      const out = { sections: [], overflow: 0, clipped: [] };
      out.overflow = Math.max(0, document.documentElement.scrollWidth - window.innerWidth);

      for (const el of document.querySelectorAll("section")) {
        const box = el.getBoundingClientRect();
        if (box.height < 40) continue;
        out.sections.push({
          screens: Math.round((box.height / vh) * 100) / 100,
          px: Math.round(box.height),
          text: (el.innerText ?? "").trim().replace(/\s+/g, " ").slice(0, 46),
        });
      }

      for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,blockquote")) {
        const box = el.getBoundingClientRect();
        const area = box.width * box.height;
        if (area <= 0) continue;
        const cs = getComputedStyle(el);
        if (cs.visibility === "hidden" || cs.display === "none" || Number(cs.opacity) < 0.05) continue;
        /* Two boxes clip on purpose and both hand the reader a way back in:
           a `<details>` fold, opened by its own summary, and a drum or deck,
           which is `[role=group]` with a tabindex and is dragged. Counting
           either as unreachable would report the questions stack and the
           thirty-three voices as defects for working. */
        if (el.closest("details") || el.closest("[role='group'][tabindex]")) continue;
        /* A heading that is deliberately not drawn. `.mm-visually-hidden` is
           the standard 1px clipped box that names a section for a screen
           reader, so being clipped away is the whole of its job. It only
           started reporting on 2 September, when the margin reset stopped
           being (0,1,1) and its own `margin: -1px` finally applied; the box was
           always there and always clipped. */
        if (el.closest(".mm-visually-hidden")) continue;
        let t = box.top, l = box.left, w = box.width, h = box.height;
        for (let node = el.parentElement; node; node = node.parentElement) {
          const p = getComputedStyle(node);
          const overflow = `${p.overflowX} ${p.overflowY}`;
          const c = node.getBoundingClientRect();
          if (/auto|scroll/.test(overflow)) {
            w = Math.min(w, c.width); h = Math.min(h, c.height); t = c.top; l = c.left;
            continue;
          }
          if (!/hidden|clip/.test(overflow)) continue;
          const nt = Math.max(t, c.top), nl = Math.max(l, c.left);
          h = Math.max(0, Math.min(t + h, c.bottom) - nt);
          w = Math.max(0, Math.min(l + w, c.right) - nl);
          t = nt; l = nl;
        }
        if ((w * h) / area < 0.06) {
          out.clipped.push((el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 46));
        }
      }
      return out;
    }, height);

    /* The primary action, and whether any fixed chrome sits on top of it. */
    const buried = await page.evaluate(async () => {
      const target = document.querySelector("[data-mm-primary]");
      if (!target) return null;
      target.scrollIntoView({ block: "center" });
      await new Promise((done) => setTimeout(done, 350));
      const box = target.getBoundingClientRect();
      const at = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
      if (!at || target.contains(at) || at.contains(target)) return null;
      const cs = getComputedStyle(at.closest("[class]") ?? at);
      if (cs.position !== "fixed" && cs.position !== "sticky") return null;
      return (at.closest("[class]") ?? at).className.toString().slice(0, 40);
    });

    const over = seen.sections.filter((s) => s.screens > BUDGET
      && !EXEMPT.some((e) => e.match.test(s.text)));

    rows.push({ width, height, path, sections: seen.sections, over, overflow: seen.overflow, clipped: seen.clipped.length, buried });

    for (const s of over) {
      problems.push(`${width}x${height} ${path} section runs ${s.screens} screens (${s.px}px): "${s.text}"`);
    }
    if (seen.overflow > 1) problems.push(`${width}x${height} ${path} scrolls sideways by ${seen.overflow}px`);
    if (seen.clipped.length) problems.push(`${width}x${height} ${path} has ${seen.clipped.length} text block(s) clipped away: "${seen.clipped[0]}"`);
    if (buried) problems.push(`${width}x${height} ${path} covers its primary action with fixed chrome: ${buried}`);
  }
  await context.close();
}
await browser.close();

if (REPORT) {
  for (const r of rows) {
    const worst = r.sections.slice().sort((a, b) => b.screens - a.screens)[0];
    console.log(`  ${String(r.width).padStart(4)}x${String(r.height).padEnd(4)} ${r.path.padEnd(11)} ${String(r.sections.length).padStart(2)} sections, worst ${String(worst?.screens ?? 0).padStart(5)}  over budget ${r.over.length}  overflow ${r.overflow}px  clipped ${r.clipped}`);
    for (const s of r.over) console.log(`        ${String(s.screens).padStart(5)} screens  ${JSON.stringify(s.text)}`);
  }
  process.exit(0);
}

if (problems.length) {
  console.error(`\n${problems.length} problem(s) across ${SIZES.length} screen sizes:`);
  for (const line of problems) console.error(`  ${line}`);
  console.error(`\nExempt, by name: ${EXEMPT.map((e) => e.match.source).join(", ")}`);
  process.exit(1);
}
console.log(`every screen size: ${SIZES.length} sizes x ${PATHS.length} pages, no section past ${BUDGET} screens, nothing clipped, nothing sideways, the action always reachable`);
