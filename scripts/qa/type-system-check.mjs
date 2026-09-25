#!/usr/bin/env node
/**
 * One type system, measured word by word.
 *
 * Ruling (Krish, 2026-09-25): "The AI brain page contains all the right fonts
 * and font sizes. The homepage and other pages do not. Audit every single word
 * and standardise the fonts everywhere."
 *
 * Every visible text node on every indexed route (plus /ai-brain, /ai-gtm,
 * /about, the legal pages and the 404) is read from the rendered cascade at
 * 1440x900 and 390x844 and held to the roles /ai-brain gives its words:
 *
 *  - Only Newsreader, Archivo and IBM Plex Mono.
 *  - Newsreader for headings and for anything read, at 380 to 500 (inline
 *    <strong>/<b> emphasis in prose may be bold), never tracked open.
 *  - Archivo for actions and small interface text only: never a heading, never
 *    a sentence someone reads, never capitals (labels are mono), never tracked
 *    open, and bold (600 to 720) when it is an action.
 *  - IBM Plex Mono for labels, numbers, dates and breadcrumbs: 400 (the site
 *    ships no other weight, so anything at 600 or above is a synthetic bold;
 *    the one exception is the Subscribe action the AI Brain page itself sets
 *    at 600), never tracked past .14em. Capitals (the menu word, labels) may
 *    be tracked in either face.
 *  - Nothing read in Newsreader or Archivo under 13px.
 *
 * Illustrative instruments (`.instrument`) and aria-hidden text are exempt:
 * they are drawings of machinery, and /ai-brain's own instruments use their
 * own small type. Reduced motion is emulated so every reveal is in its final
 * place. `--base` points at an existing server; otherwise dist/ is served.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const port = 4372;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = flag("base") ?? `http://127.0.0.1:${port}`;

const sitemap = await readFile(resolve(root, "dist/sitemap.xml"), "utf8");
const routes = [...new Set([...sitemap.matchAll(/<loc>https?:\/\/[^/<]+(\/[^<]*)<\/loc>/g)].map(([, path]) => path || "/"))];
for (const extra of ["/ai-brain", "/ai-gtm", "/about", "/contact", "/privacy", "/terms", "/a-page-that-does-not-exist"]) if (!routes.includes(extra)) routes.push(extra);
const only = flag("paths")?.split(",");
const VIEWPORTS = [{ name: "desktop", width: 1440, height: 900 }, { name: "mobile", width: 390, height: 844 }];
const FACES = ["Newsreader", "Archivo", "IBM Plex Mono"];

for (let i = 0; i < 100; i += 1) { try { if ((await fetch(BASE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }

const read = () => {
  const words = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let node; (node = walker.nextNode());) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    const el = node.parentElement;
    if (!text || !el || el.closest("script,style,noscript,svg,.instrument,[aria-hidden=true],.skip-link,.mm-skip")) continue;
    if (!el.checkVisibility?.({ visibilityProperty: true })) continue;
    const box = el.getBoundingClientRect();
    if (box.width < 2 || box.height < 2) continue;
    const cs = getComputedStyle(el);
    const size = parseFloat(cs.fontSize);
    if (size < 1) continue;
    const path = [];
    for (let e = el; e && e !== document.body && path.length < 3; e = e.parentElement) path.unshift(e.tagName.toLowerCase() + (typeof e.className === "string" && e.className.trim() ? `.${e.className.trim().split(/\s+/).slice(0, 2).join(".")}` : ""));
    words.push({
      text: text.slice(0, 60),
      face: cs.fontFamily.split(",")[0].replace(/["']/g, "").replace(/ Variable$/, "").trim(),
      weight: Number(cs.fontWeight),
      caps: cs.textTransform === "uppercase",
      tracking: cs.letterSpacing === "normal" ? 0 : parseFloat(cs.letterSpacing) / size,
      size,
      heading: Boolean(el.closest("h1,h2,h3,h4,h5,h6")),
      action: Boolean(el.closest("a,button,summary,label,[role=button]")),
      emphasis: /^(STRONG|B)$/.test(el.tagName) && Boolean(el.parentElement?.closest("p,li,blockquote")),
      subscribe: Boolean(el.closest(".mm-subscribe-cta")),
      symbol: /^[←→↗↓↑·/\s\d]+$/.test(text),
      sentence: text.length > 55,
      where: path.join(">"),
    });
  }
  return words;
};

const judge = (w) => {
  const why = [];
  if (!FACES.includes(w.face)) why.push(`face ${w.face}`);
  if (w.face === "Newsreader") {
    if ((w.weight < 380 || w.weight > 500) && !w.emphasis) why.push(`Newsreader at ${w.weight}`);
    if (w.tracking > 0.001 && !w.caps) why.push("tracked Newsreader");
  }
  if (w.face === "Archivo") {
    if (w.heading) why.push("Archivo heading");
    if (w.caps) why.push("Archivo capitals (labels are mono)");
    if (w.tracking > 0.021) why.push("tracked Archivo");
    if (w.sentence && !w.action) why.push("Archivo reading copy");
    if (w.action && !w.symbol && w.weight < 600 && w.sentence) why.push("Archivo reading copy in a link");
    if (!w.action && w.weight !== 400 && w.weight < 600) why.push(`Archivo at ${w.weight}`);
  }
  if (w.face === "IBM Plex Mono") {
    if (w.weight >= 600 && !w.subscribe) why.push(`synthetic bold mono (${w.weight})`);
    if (w.tracking > 0.145) why.push(`mono tracked ${w.tracking.toFixed(2)}em`);
  }
  if (w.face !== "IBM Plex Mono" && w.sentence && !w.symbol && w.size < 12.9) why.push(`reading copy at ${w.size.toFixed(1)}px`);
  return why;
};

const browser = await chromium.launch();
const failures = [];
let counted = 0;
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
    for (const route of routes.filter((r) => !only || only.includes(r))) {
      const page = await context.newPage();
      await page.goto(BASE + (route === "/" ? "/" : `${route.replace(/\/$/, "")}/`), { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(300);
      const words = await page.evaluate(read);
      counted += words.length;
      const seen = new Set();
      for (const word of words) {
        const why = judge(word);
        if (!why.length) continue;
        const key = `${why.join("; ")}|${word.where}`;
        if (seen.has(key)) continue;
        seen.add(key);
        failures.push({ route, viewport: viewport.name, why: why.join("; "), text: word.text, where: word.where, face: `${word.face} ${word.weight} ${word.size.toFixed(1)}px` });
      }
      await page.close();
    }
    await context.close();
  }
} finally {
  await browser.close();
  server?.kill();
}

console.log(JSON.stringify({ status: failures.length ? "FAIL" : "PASS", textNodes: counted, routes: routes.length, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
