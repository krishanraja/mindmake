#!/usr/bin/env node
/**
 * A phone's first visit, on a slow line (Krish, 2026-11-04: "Some of the
 * images take up to 10 seconds to load on a user's first visit. That is
 * completely unacceptable.").
 *
 * Chromium at 390x844, cache off, Chrome's "Slow 4G" profile (1.6 Mbps down,
 * 150 ms), scrolling each page like a reader. It fails when:
 *   - any picture takes more than 2.5 s from request to finished;
 *   - the first picture the page asks for finishes more than 3 s after the
 *     navigation starts;
 *   - any film transfers a byte before the page's load event;
 *   - any single picture sent to the phone is over 150 KB.
 *
 * Serves dist/ itself unless `--base` names a running server or a public
 * origin. Local routes take the trailing slash (scripts/qa/lib/asked.mjs).
 * Negative control: against production as it was before this check existed,
 * the /ai-brain poster (901 KB, 10.8 s) and the homepage film fail it.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { asked } from "./lib/asked.mjs";

const root = resolve(import.meta.dirname, "../..");
const flag = (name) => { const hit = process.argv.find((arg) => arg.startsWith(`--${name}=`)); if (hit) return hit.slice(name.length + 3); const i = process.argv.indexOf(`--${name}`); return i > -1 ? process.argv[i + 1] : undefined; };
const port = 4373;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = (flag("base") ?? `http://127.0.0.1:${port}`).replace(/\/$/, "");
const local = /127\.0\.0\.1|localhost/.test(BASE);
const ROUTES = (flag("routes") ?? "/,/ai-brain,/ai-gtm,/case-studies").split(",");
const SLOW_4G = { offline: false, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8, latency: 150 };
const LIMIT = { picture: 2500, first: 3000, bytes: 150 * 1024 };
const PICTURE = /\.(webp|jpe?g|png|avif|gif)(\?|$)/i;
const FILM = /\.(mp4|webm|mov)(\?|$)/i;

const waitForServer = async () => {
  for (let i = 0; i < 60; i++) {
    try { if ((await fetch(BASE)).ok) return; } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error(`no server at ${BASE}`);
};

const report = { base: BASE, profile: "Slow 4G, 390x844, cache off", limits: LIMIT, routes: [], failures: [] };
try {
  if (server) await waitForServer();
  const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
  for (const route of ROUTES) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "essential"); } catch { /* storage off */ } });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", SLOW_4G);
    const requests = new Map();
    let loadAt = Infinity;
    const t0 = Date.now();
    cdp.on("Network.requestWillBeSent", (e) => requests.set(e.requestId, { url: e.request.url, start: Date.now() - t0, firstByte: null, end: null, bytes: 0 }));
    cdp.on("Network.dataReceived", (e) => { const r = requests.get(e.requestId); if (r && r.firstByte === null) r.firstByte = Date.now() - t0; });
    cdp.on("Network.loadingFinished", (e) => { const r = requests.get(e.requestId); if (r) { r.end = Date.now() - t0; r.bytes = e.encodedDataLength; } });
    page.on("load", () => { loadAt = Date.now() - t0; });
    await page.goto(BASE + (local ? asked(route) : route), { waitUntil: "domcontentloaded", timeout: 60000 });
    await page.waitForLoadState("load", { timeout: 60000 }).catch(() => undefined);
    for (let i = 0; i < 16; i++) { await page.mouse.wheel(0, 450); await page.waitForTimeout(900); }
    await page.waitForTimeout(3000);
    const all = [...requests.values()];
    const pictures = all.filter((r) => PICTURE.test(r.url) && !r.url.startsWith("data:"));
    const films = all.filter((r) => FILM.test(r.url));
    const first = pictures.sort((a, b) => a.start - b.start)[0];
    const name = (r) => r.url.split("/").pop().split("?")[0];
    for (const p of pictures) {
      const took = p.end === null ? Infinity : p.end - p.start;
      if (took > LIMIT.picture) report.failures.push(`${route}: ${name(p)} took ${p.end === null ? "never finished" : `${took} ms`} (limit ${LIMIT.picture})`);
      if (p.bytes > LIMIT.bytes) report.failures.push(`${route}: ${name(p)} is ${Math.round(p.bytes / 1024)} KB (limit ${LIMIT.bytes / 1024})`);
    }
    if (first && (first.end ?? Infinity) > LIMIT.first) report.failures.push(`${route}: first picture ${name(first)} finished at ${first.end ?? "never"} ms (limit ${LIMIT.first})`);
    for (const f of films) if (f.firstByte !== null && f.firstByte < loadAt) report.failures.push(`${route}: film ${name(f)} downloaded before the page loaded (${f.firstByte} ms < ${loadAt} ms)`);
    report.routes.push({
      route,
      loadEvent: loadAt,
      pictures: pictures.length,
      slowestPicture: Math.max(0, ...pictures.map((p) => (p.end ?? Infinity) - p.start)),
      firstPicture: first ? { file: name(first), finished: first.end } : null,
      pictureKB: Math.round(pictures.reduce((s, p) => s + p.bytes, 0) / 1024),
      filmKB: Math.round(films.reduce((s, f) => s + f.bytes, 0) / 1024),
    });
    await context.close();
  }
  await browser.close();
} finally {
  server?.kill();
}
console.log(JSON.stringify(report, null, 2));
process.exit(report.failures.length ? 1 : 0);
