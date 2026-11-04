#!/usr/bin/env node
/**
 * Every heading starts on the page's one left edge (Ruling, Krish,
 * 2026-11-04: "Things should never be misaligned"). The logo and content
 * share a gutter (CLAUDE.md), so at 1440x900, 1280x800, 390x844 and 360x780
 * the left edge of every visible page and section heading (h1, h2 and the
 * story finder's question) must sit within 2px of the masthead logo's left
 * edge. Headings inside cards, sheets and two-panel halves are not page
 * headings and are skipped; so are headings centred by design.
 *
 * Serves dist/ itself unless `--base` names a running server. Exits 1 with
 * the offending headings listed.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const flag = (name) => { const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : undefined; };
const port = 4372;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = flag("base") ?? `http://127.0.0.1:${port}`;
const ROUTES = (flag("routes") ?? "/,/ai-brain/,/ai-gtm/,/case-studies/").split(",");
const VIEWPORTS = [[1440, 900], [1280, 800], [390, 844], [360, 780]];
const SKIP = ".mm-case-proof-s2 li.region, .finder-card, .finder-sheet, .pair-panel:not(:first-child), .hs-proof, .hs-acts, .hs-eras, .lever-steps, .team-instrument, .decision-panel, .mm-receipt, dialog, footer, .r3-footer, [aria-hidden='true'], .beat-copy[data-active='false'], .sr-only";

const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`no server at ${BASE}`);
};

const failures = [];
try {
  if (server) await waitForServer();
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  for (const [width, height] of VIEWPORTS) {
    const page = await browser.newPage({ viewport: { width, height } });
    await page.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "essential"); } catch { /* storage off */ } });
    for (const route of ROUTES) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const found = await page.evaluate((skip) => {
        const logo = [...document.querySelectorAll(".mm-header .mm-brand-icon, .mm-header .mm-brand, header a[href='/'], .masthead a[href='/'], a.brand, .r3-brand")]
          .map((el) => el.getBoundingClientRect()).find((r) => r.width > 0 && r.left >= 0);
        if (!logo) return { error: "no visible logo" };
        const out = [];
        for (const el of document.querySelectorAll("main h1, main h2, .finder-question, h1, h2")) {
          if (el.closest(skip)) continue;
          const style = getComputedStyle(el);
          if (style.visibility === "hidden" || style.display === "none" || style.textAlign === "center") continue;
          const range = document.createRange();
          range.selectNodeContents(el);
          const rect = [...range.getClientRects()].find((r) => r.width > 0);
          if (!rect) continue;
          /* A heading in a horizontal row that starts off screen is scrolled, not misaligned. */
          if (rect.left < 0 || rect.left > innerWidth) continue;
          const delta = Math.round(rect.left - logo.left);
          if (Math.abs(delta) > 2) out.push({ text: el.textContent.trim().slice(0, 60), left: Math.round(rect.left), logo: Math.round(logo.left), delta });
        }
        return { out };
      }, SKIP);
      if (found.error) failures.push({ viewport: `${width}x${height}`, route, error: found.error });
      for (const item of found.out ?? []) failures.push({ viewport: `${width}x${height}`, route, ...item });
    }
    await page.close();
  }
  await browser.close();
} finally {
  server?.kill();
}
console.log(JSON.stringify({ routes: ROUTES, viewports: VIEWPORTS.map(([w, h]) => `${w}x${h}`), failures }, null, 2));
process.exit(failures.length ? 1 : 0);
