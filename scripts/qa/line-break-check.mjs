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
const VIEWPORTS = [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }];

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
       comes first; the root's clip is the viewport. */
    let edge = null;
    for (let node = el.parentElement; node; node = node.parentElement) {
      const overflow = getComputedStyle(node).overflowX;
      if (/auto|scroll/.test(overflow)) { edge = null; break; }
      if (/hidden|clip/.test(overflow)) { edge = node; break; }
    }
    if (edge && words.length) {
      const bounds = edge === document.documentElement || edge === document.body ? { left: 0, right: innerWidth } : edge.getBoundingClientRect();
      const lefts = words.map((word) => word.left);
      const rights = words.map((word) => word.right);
      const past = Math.max(Math.max(...rights) - bounds.right, bounds.left - Math.min(...lefts));
      if (past > 1) problems.push({ kind: "clipped", where: describe(el), text: el.textContent.trim().replace(/\s+/g, " ").slice(0, 90), stranded: `${Math.round(past)}px past ${describe(edge)}` });
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

const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const failures = [];
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
    }
    await context.close();
  }
  /* Negative control: a stranded word, a stranded link and a line cut off by
     a box that hides its overflow, which this check must report, or its
     silence on the site means nothing. The same overhang inside a scroller
     must not be reported. */
  const control = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await control.setContent(`<p style="width:11ch;font:16px monospace;text-wrap:wrap">aaa bbb ccc ddd</p><nav style="display:flex;flex-wrap:wrap;column-gap:10px;width:230px">${'<a href="#" style="display:block;width:100px;font:16px monospace">Route</a>'.repeat(5)}</nav><div style="width:120px;overflow:hidden"><p id="cut" style="width:240px;font:16px monospace">cut off at the edge</p></div><div style="width:120px;overflow-x:auto"><p style="width:240px;font:16px monospace">reachable by a swipe</p></div>`);
  const caught = await control.evaluate(measure);
  const clippedCaught = caught.filter((p) => p.kind === "clipped");
  if (!caught.some((p) => p.kind === "word") || !caught.some((p) => p.kind === "link") || clippedCaught.length !== 1 || !clippedCaught[0].where.includes("#cut")) failures.push({ viewport: "control", route: "fixture", kind: "control", where: "negative control", stranded: `expected a word, a link and one clipped line, caught ${JSON.stringify(caught)}` });
} finally {
  await browser.close();
  server?.kill();
}

/* The same stranded item repeated across routes is one fault: shared chrome. */
const seen = new Set();
const unique = failures.filter((f) => { const key = `${f.viewport}|${f.kind}|${f.where}|${f.text ?? ""}|${f.stranded}`; if (seen.has(key)) return false; seen.add(key); return true; });
console.log(JSON.stringify({ routes: only ?? routes, viewports: VIEWPORTS.map((v) => `${v.width}x${v.height}`), failures: unique }, null, 2));
if (unique.length) process.exitCode = 1;
