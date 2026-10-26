#!/usr/bin/env node
/**
 * No stranded words, no stranded links.
 *
 * Ruling (Krish, 2026-09-25), for the whole site at the normal desktop and
 * normal phone sizes: one word or one link must never sit alone on a new line.
 * The case that prompted it was the homepage footer at 1440, where seven routes
 * filled a row and "Get your free AI brief" wrapped onto a row of its own, and
 * the statement above it ended on "market." alone.
 *
 * Two kinds of break are measured, both on the built site:
 *
 *  - Text: every visible block of running text is split into words, each word
 *    is measured with a Range, and words sharing a top are one line. A block of
 *    two or more lines whose last line holds one word fails.
 *  - Rows: a container of three or more links or buttons that wraps into rows
 *    fails when its last row holds one item and an earlier row holds several.
 *    A column (one item per row) is a list, not a wrap, and passes.
 *  - Clipped text (Krish, 2026-09-25): a word that runs past the edge of an
 *    ancestor that hides its overflow, or past the viewport, is text a reader
 *    cannot see. The homepage's benefits lost the ends of their lines this way
 *    at 390px, and every other check passed, because the clip hid the overflow
 *    from the page's scroll width. A word inside a scroller is not clipped:
 *    what a scroller hides is a swipe away.
 *
 *  - Size changes (Ruling, Krish, 2026-10-24: "we don't ever get one word sprawl
 *    over to a second line and change the entire component size. That makes
 *    everything look unstable"): on the pages listed in STATES, every tab,
 *    toggle, step and seat is clicked in turn. Each newly shown state is
 *    measured for stranded words like the rest of the page, and the component
 *    around the control fails if its height moves by more than 1px. A control
 *    that something fixed covers once it is scrolled into view fails too: the
 *    story rail's arrow sat under the action bar at 1280 wide, and a click
 *    there pressed the bar.
 *
 * Measured at the normal desktop and phone sizes and, since 24 October 2026,
 * at a 1280 laptop and a 360 phone as well.
 *
 * Reduced motion is emulated so every reveal is in its final place; layout is
 * measured after fonts load. `--base` points at an existing server; otherwise
 * the check serves `dist/` itself. Routes come from the built sitemap, so every
 * indexed page is covered and a new one joins automatically.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { asked } from "./lib/asked.mjs";

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const port = 4371;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = flag("base") ?? `http://127.0.0.1:${port}`;

const sitemap = await readFile(resolve(root, "dist/sitemap.xml"), "utf8");
const routes = [...new Set([...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map(([, path]) => path || "/"))];
const only = flag("paths")?.split(",");
const VIEWPORTS = [{ name: "desktop", width: 1440, height: 900 }, { name: "laptop", width: 1280, height: 800 }, { name: "mobile", width: 390, height: 844 }, { name: "small", width: 360, height: 780 }];
/* What a reader can change on each page, and the component whose size each
   change must leave alone. Controls are clicked in document order; only the
   ones visible at the viewport are used. A group's setup is clicked first, so
   the rail is walked in the situation that has more stories than fit; a group
   that repeats presses its one control until it leaves, to the last card. A
   group with ifOverflows is a carousel that only needs its controls where its
   row is wider than the screen; where every card fits it is not swept. A group
   that finds its frame but clicks nothing fails: a renamed selector must never
   pass in silence. */
const STATES = {
  "/": [
    { name: "eras", controls: "[data-hs-era]", frames: [".hs-eras"] },
    { name: "era rail", setup: '.hs-problem [data-hs-rail-go="0"]', controls: '.hs-problem [data-hs-rail-step="1"]', repeat: 6, ifOverflows: ".hs-problem [data-hs-rail-track]", frames: [".hs-problem .hs-rail"] },
    { name: "scene rail", setup: '.hs-how [data-hs-rail-go="0"]', controls: '.hs-how [data-hs-rail-step="1"]', repeat: 6, ifOverflows: ".hs-how [data-hs-rail-track]", frames: [".hs-how .hs-rail"] },
  ],
  "/ai-brain": [
    { name: "beats", controls: ".beats [data-beat-go], .beats [data-beat-step]", frames: [".beat-copies", ".beat-instruments"] },
    { name: "finder", controls: ".brain-finder [data-finder-tab]", frames: [".brain-finder .story-finder"] },
    { name: "finder rail", setup: '.brain-finder [data-finder-tab="change"]', controls: ".brain-finder .finder-panel.is-active [data-finder-next]", repeat: 8, frames: [".brain-finder .story-finder"] },
  ],
  "/ai-gtm": [
    { name: "starting point", controls: ".gtm-door", frames: [".lever-steps"] },
    { name: "team", controls: ".gtm-view-switch button", frames: [".gtm-team-body"] },
    { name: "seat", controls: ".role-cell:not(:disabled)", frames: [".gtm-team-body"] },
  ],
  "/new-age-leadership": [{ name: "finder", controls: "[data-finder-tab]", frames: [".story-finder"] }],
};

for (let i = 0; i < 100; i += 1) { try { if ((await fetch(BASE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }

const measure = () => {
  const visible = (el) => {
    if (!el.checkVisibility?.({ visibilityProperty: true })) return false;
    const box = el.getBoundingClientRect();
    return box.width > 2 && box.height > 2;
  };
  const describe = (el) => {
    const parts = [];
    for (let node = el; node && node !== document.body && parts.length < 3; node = node.parentElement) {
      parts.unshift(node.tagName.toLowerCase() + (node.id ? `#${node.id}` : "") + (typeof node.className === "string" && node.className.trim() ? `.${node.className.trim().split(/\s+/).slice(0, 2).join(".")}` : ""));
    }
    return parts.join(" > ");
  };
  const blockish = (el) => !/^(inline|contents|none)$/.test(getComputedStyle(el).display);
  /* Windows that things move through by design, each reached by its own
     controls, like a scroller: the living record's reel on /ai-brain, whose
     records pass through it and whose Next shows each one whole. */
  const MOVING_WINDOWS = ".reel-window";
  const problems = [];

  /* Text: the innermost blocks that hold words directly. */
  const TEXT = "p, h1, h2, h3, h4, h5, h6, li, blockquote, figcaption, dd, dt, small, label, a, button, span, strong, em, div, td, th";
  for (const el of document.querySelectorAll(TEXT)) {
    if (!blockish(el) && !["A", "BUTTON"].includes(el.tagName)) continue;
    if ([...el.children].some((child) => blockish(child) && child.textContent.trim())) continue;
    /* Deliberate breaks (an address, a signature) are set line by line. */
    if (el.querySelector("br")) continue;
    if (!visible(el) || el.closest("[aria-hidden='true'], [inert], script, style, noscript, svg, .sr-only, .mm-skip")) continue;
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (const match of node.textContent.matchAll(/\S+/g)) {
        const range = document.createRange();
        range.setStart(node, match.index);
        range.setEnd(node, match.index + match[0].length);
        /* A word the browser breaks at a hyphen is a fragment on each line. */
        for (const rect of [...range.getClientRects()].filter((r) => r.width > 0)) words.push({ word: match[0], top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right });
      }
    }
    /* Clipped: the nearest ancestor that hides overflow, unless a scroller
       or a moving window comes first; the root's clip is the viewport. Across
       and, since 24 October 2026, down: the opening hid its last line below
       its own foot on a short phone, and only the across check existed. The
       page itself scrolls down, so the root never clips downwards. A fixed
       element (a masthead) escapes the clip of everything above it. */
    const clipOf = (axis) => {
      if (getComputedStyle(el).position === "fixed") return null;
      for (let node = el.parentElement; node; node = node.parentElement) {
        const style = getComputedStyle(node);
        if (/auto|scroll/.test(style[axis]) || node.matches(MOVING_WINDOWS)) return null;
        if (/hidden|clip/.test(style[axis])) return node;
        if (style.position === "fixed") return null;
      }
      return null;
    };
    const edge = clipOf("overflowX");
    if (edge && words.length) {
      const bounds = edge === document.documentElement || edge === document.body ? { left: 0, right: innerWidth } : edge.getBoundingClientRect();
      const lefts = words.map((word) => word.left);
      const rights = words.map((word) => word.right);
      const past = Math.max(Math.max(...rights) - bounds.right, bounds.left - Math.min(...lefts));
      if (past > 1) problems.push({ kind: "clipped", where: describe(el), text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 90), stranded: `${Math.round(past)}px past ${describe(edge)}` });
    }
    const floor = clipOf("overflowY");
    if (floor && floor !== document.documentElement && floor !== document.body && words.length) {
      const bounds = floor.getBoundingClientRect();
      const below = Math.max(...words.map((word) => word.bottom)) - bounds.bottom;
      const above = bounds.top - Math.min(...words.map((word) => word.top));
      if (Math.max(below, above) > 1) problems.push({ kind: "clipped", where: describe(el), text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 90), stranded: `${Math.round(Math.max(below, above))}px ${below > above ? "below the foot of" : "above the top of"} ${describe(floor)}` });
    }
    if (words.length < 3) continue;
    const lines = [];
    for (const word of words) {
      const line = lines.find((l) => Math.abs(l.top - word.top) < (word.bottom - word.top) / 2);
      if (line) line.words.push(word.word); else lines.push({ top: word.top, words: [word.word] });
    }
    lines.sort((a, b) => a.top - b.top);
    if (lines.length >= 2 && lines.at(-1).words.length === 1) {
      problems.push({ kind: "word", where: describe(el), text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 90), stranded: lines.at(-1).words[0], wrap: getComputedStyle(el).textWrapStyle || getComputedStyle(el).textWrap });
    }
  }

  /* Rows: containers whose direct items are links or buttons. */
  for (const container of document.querySelectorAll("nav, ul, ol, div, footer, section, p")) {
    if (!visible(container) || container.closest("[aria-hidden='true'], [inert]")) continue;
    const items = [...container.children]
      .map((child) => (child.matches("a, button") ? child : child.matches("li") && child.children.length === 1 && child.firstElementChild.matches("a, button") ? child : null))
      .filter((item) => item && visible(item));
    if (items.length < 3 || items.length !== [...container.children].filter(visible).length) continue;
    /* Cards in a grid are not a line of links; an item taller than two lines
       of text is a card. */
    if (items.some((item) => item.getBoundingClientRect().height > 72)) continue;
    const rows = [];
    for (const item of items) {
      const box = item.getBoundingClientRect();
      const row = rows.find((r) => Math.abs(r.top - box.top) < box.height / 2);
      if (row) row.items.push(item); else rows.push({ top: box.top, items: [item] });
    }
    rows.sort((a, b) => a.top - b.top);
    if (rows.length >= 2 && rows.at(-1).items.length === 1 && rows.slice(0, -1).some((r) => r.items.length > 1)) {
      problems.push({ kind: "link", where: describe(container), stranded: rows.at(-1).items[0].textContent.trim().replace(/\s+/g, " "), rows: rows.map((r) => r.items.length).join("+") });
    }
  }
  return problems;
};

/* Heights of a group's frames, as numbers, or null where a frame is absent. */
const heights = (frames) => frames.map((selector) => {
  const el = [...document.querySelectorAll(selector)].find((node) => node.getClientRects().length);
  return el ? el.getBoundingClientRect().height : null;
});

/* Click every visible control of each group, measure the new state, and
   report a frame whose height moved. */
async function sweep(page, groups, report, swept = {}) {
  for (const group of groups) {
    if (group.ifOverflows && !(await page.evaluate((selector) => {
      const row = document.querySelector(selector);
      return row ? row.scrollWidth > row.clientWidth + 2 : true;
    }, group.ifOverflows))) { swept[group.name] = "fits"; continue; }
    if (group.setup) {
      const setup = page.locator(group.setup).first();
      if (await setup.isVisible()) { await setup.scrollIntoViewIfNeeded(); await setup.click(); await page.waitForTimeout(220); }
    }
    const controls = page.locator(group.controls);
    const count = await controls.count();
    const first = await page.evaluate(heights, group.frames);
    if (first.every((h) => h === null)) {
      report({ kind: "coverage", where: group.name, stranded: `none of ${group.frames.join(", ")} is on the page` });
      continue;
    }
    let clicked = 0;
    for (let i = 0; i < (group.repeat ?? count); i += 1) {
      const control = group.repeat ? controls.first() : controls.nth(i);
      if (!(await control.isVisible()) || !(await control.isEnabled())) {
        if (group.repeat) break;
        continue;
      }
      await control.scrollIntoViewIfNeeded();
      /* A control under fixed chrome (the action bar, the notice) can be
         neither seen nor pressed, and a click there lands on the chrome. */
      const covered = await control.evaluate((node) => {
        const box = node.getBoundingClientRect();
        const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return top && !node.contains(top) ? (top.className || top.tagName).toString().slice(0, 60) : null;
      });
      if (covered) {
        report({ kind: "covered", where: `${group.name}: control ${i + 1}`, stranded: `under ${covered}` });
        if (group.repeat) break;
        continue;
      }
      await control.click();
      clicked += 1;
      await page.waitForTimeout(220);
      for (const problem of await page.evaluate(measure)) report(problem);
      const now = await page.evaluate(heights, group.frames);
      now.forEach((h, k) => {
        if (h === null || first[k] === null) return;
        const moved = Math.abs(h - first[k]);
        if (moved > 1) report({ kind: "height", where: `${group.name}: ${group.frames[k]}`, stranded: `${Math.round(first[k])}px became ${Math.round(h)}px after control ${i + 1}` });
      });
    }
    swept[group.name] = clicked;
    if (group.repeat && clicked >= group.repeat) report({ kind: "coverage", where: group.name, stranded: `still offered after ${clicked} presses: the rail never reaches its last card` });
    if (!clicked) report({ kind: "coverage", where: group.name, stranded: `no visible control matches ${group.controls}` });
  }
  return swept;
}

const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const failures = [];
const swept = {};
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); localStorage.setItem("mm-cookie-consent", "declined"); } catch {} });
    const page = await context.newPage();
    for (const route of routes.filter((r) => !only || only.includes(r))) {
      await page.goto(BASE + asked(route), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      /* Walk the page once so every scroll-revealed section is in place. */
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += Math.round(innerHeight * 0.7)) {
          window.scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        window.scrollTo(0, document.documentElement.scrollHeight);
        await new Promise((r) => setTimeout(r, 600));
      });
      for (const problem of await page.evaluate(measure)) failures.push({ viewport: viewport.name, route, ...problem });
      const groups = STATES[route.replace(/\/$/, "") || "/"];
      if (groups) swept[`${viewport.width}x${viewport.height} ${route}`] = await sweep(page, groups, (problem) => failures.push({ viewport: viewport.name, route, ...problem }));
    }
    await context.close();
  }
  /* Negative control: a stranded word, a stranded link and a line cut off by
     a box that hides its overflow, which this check must report, or its
     silence on the site means nothing. The same overhang inside a scroller
     must not be reported. */
  const control = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await control.setContent(`<p style="width:11ch;font:16px monospace;text-wrap:wrap">aaa bbb ccc ddd</p><nav style="display:flex;flex-wrap:wrap;column-gap:10px;width:230px">${'<a href="#" style="display:block;width:100px;font:16px monospace">Route</a>'.repeat(5)}</nav><div style="width:120px;overflow:hidden"><p id="cut" style="width:240px;font:16px monospace">cut off at the edge</p></div><div style="width:120px;overflow-x:auto"><p style="width:240px;font:16px monospace">reachable by a swipe</p></div><div style="width:130px;height:22px;overflow:hidden"><p id="cutv" style="margin:0;font:16px/20px monospace">first line then lost below</p></div><div style="width:130px;height:22px;overflow-y:auto"><p style="margin:0;font:16px/20px monospace">first line then scrolled to</p></div><div style="width:130px;height:22px;overflow:hidden"><p style="position:fixed;top:0;left:0;margin:0;font:16px/20px monospace">a masthead</p></div>`);
  const caught = await control.evaluate(measure);
  const clippedCaught = caught.filter((p) => p.kind === "clipped");
  if (!caught.some((p) => p.kind === "word") || !caught.some((p) => p.kind === "link") || clippedCaught.length !== 2 || !clippedCaught.some((p) => p.where.includes("#cut") && !p.where.includes("#cutv")) || !clippedCaught.some((p) => p.where.includes("#cutv"))) failures.push({ viewport: "control", route: "fixture", kind: "control", where: "negative control", stranded: `expected a word, a link, one line clipped across and one clipped below, caught ${JSON.stringify(caught)}` });
  /* Size changes: a box that grows when its button is pressed must be caught,
     and one that holds both states in one cell must not. */
  await control.setContent(`<div id="grows" style="width:220px;font:16px monospace"><button id="grow" onclick="document.getElementById('words').textContent='a much longer line of words that wraps over several more lines'">change</button><p id="words">short words here</p></div><div id="holds" style="width:220px;font:16px monospace"><button id="hold" onclick="document.querySelectorAll('#held > p').forEach((p) => p.style.visibility = p.style.visibility === 'hidden' ? 'visible' : 'hidden')">change</button><div id="held" style="display:grid"><p style="grid-area:1/1">short words here</p><p style="grid-area:1/1;visibility:hidden">a much longer line of words that wraps over several more lines</p></div></div>`);
  const sized = [];
  await sweep(control, [{ name: "grows", controls: "#grow", frames: ["#grows"] }, { name: "holds", controls: "#hold", frames: ["#holds"] }], (problem) => sized.push(problem));
  const sizeCaught = sized.filter((p) => p.kind === "height");
  if (sizeCaught.length !== 1 || !sizeCaught[0].where.startsWith("grows")) failures.push({ viewport: "control", route: "fixture", kind: "control", where: "size control", stranded: `expected one size change in #grows and none in #holds, caught ${JSON.stringify(sized)}` });
  /* A control under a fixed band across the bottom edge must be reported, and
     one clear of it must not. */
  await control.setContent(`<div id="frame" style="font:16px monospace"><button id="clear">clear</button></div><button id="under" style="position:fixed;left:20px;bottom:8px">under</button><div style="position:fixed;left:0;right:0;bottom:0;height:60px;background:#000"></div>`);
  const hidden = [];
  await sweep(control, [{ name: "under", controls: "#under", frames: ["#frame"] }, { name: "clear", controls: "#clear", frames: ["#frame"] }], (problem) => hidden.push(problem));
  const coveredCaught = hidden.filter((p) => p.kind === "covered");
  if (coveredCaught.length !== 1 || !coveredCaught[0].where.startsWith("under")) failures.push({ viewport: "control", route: "fixture", kind: "control", where: "covered control", stranded: `expected #under to be reported as covered and #clear not, caught ${JSON.stringify(hidden)}` });
} finally {
  await browser.close();
  server?.kill();
}

/* The same stranded item repeated across routes is one fault: shared chrome. */
const seen = new Set();
const unique = failures.filter((f) => { const key = `${f.viewport}|${f.kind}|${f.where}|${f.text ?? ""}|${f.stranded}`; if (seen.has(key)) return false; seen.add(key); return true; });
console.log(JSON.stringify({ routes: only ?? routes, viewports: VIEWPORTS.map((v) => `${v.width}x${v.height}`), clicked: swept, failures: unique }, null, 2));
if (unique.length) process.exitCode = 1;
