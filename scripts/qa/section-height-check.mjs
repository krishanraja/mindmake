#!/usr/bin/env node
/**
 * No section taller than a desktop screen (Krish, 2026-11-06: "no section
 * should be bigger than a desktop screen on desktop. This is imperative.";
 * again 2026-11-11: "Ensure every section's height is no taller than a
 * desktop screen size").
 *
 * Measures every top-level section of the homepage and the two offer pages at
 * 1440x900 and 1280x800, after scrolling the whole page so everything that
 * builds on scroll has built, and fails any section taller than the screen.
 * `--base` points at an existing server; otherwise it serves `dist/` itself.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const port = 4372;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = flag("base") ?? `http://127.0.0.1:${port}`;
const local = !flag("base");

/** What counts as a section on each page: what a reader sees as one band. */
const PAGES = [
  { path: "/", sections: ".mm-homepage-release .hs-section" },
  { path: "/ai-brain", sections: ".mm-locked-brain .chapter[data-phase]:not(.pair):not(.opening), .mm-locked-brain .pair-panel, .brain-close > .brain-finder, .brain-close > .brain-close-body" },
  { path: "/ai-gtm", sections: ".mm-gtm [data-gtm-chapter]:not([data-gtm-chapter='threshold']):not(.gtm-opening)" },
];
const VIEWPORTS = [{ width: 1440, height: 900 }, { width: 1280, height: 800 }];

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(`${BASE}/`)).ok) return; } catch { /* not up yet */ }
    await new Promise((done) => setTimeout(done, 500));
  }
  throw new Error(`No server at ${BASE}`);
}

const failures = [];
const measured = {};
try {
  await waitForServer();
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  for (const viewport of VIEWPORTS) {
    for (const { path, sections } of PAGES) {
      const context = await browser.newContext({ viewport, reducedMotion: "reduce" });
      const page = await context.newPage();
      await page.goto(`${BASE}${path}${local && path !== "/" ? "/" : ""}`, { waitUntil: "networkidle" });
      await page.evaluate(async () => {
        for (let y = 0; y < document.documentElement.scrollHeight; y += 400) { scrollTo({ top: y, behavior: "instant" }); await new Promise((done) => setTimeout(done, 40)); }
        scrollTo({ top: 0, behavior: "instant" });
      });
      await page.waitForTimeout(400);
      const rows = await page.evaluate((selector) => [...document.querySelectorAll(selector)].filter((node) => node.offsetParent !== null).map((node) => ({
        name: node.id || node.getAttribute("data-gtm-chapter") || String(node.className).split(" ").slice(0, 2).join("."),
        height: Math.round(node.getBoundingClientRect().height),
      })), sections);
      const key = `${viewport.width}x${viewport.height} ${path}`;
      measured[key] = Object.fromEntries(rows.map((row) => [row.name, row.height]));
      if (!rows.length) failures.push(`${key}: no sections found for ${sections}`);
      for (const row of rows) if (row.height > viewport.height + 1) failures.push(`${key}: ${row.name} is ${row.height}px, taller than the ${viewport.height}px screen`);
      await context.close();
    }
  }
  await browser.close();
} finally {
  server?.kill();
}
console.log(JSON.stringify({ measured, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
