/** Read-only HTTP and hydrated-head parity. No search submissions or form writes. */
import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";
import { staticPages } from "../lib/pages.mjs";
import { loadBlogPosts } from "../lib/blog-posts-loader.mjs";
import { loadAnswers } from "../lib/answers-loader.mjs";

const origin = process.argv.find(arg => arg.startsWith("--base="))?.slice(7);
if (!origin || !/^https?:\/\//.test(origin)) throw new Error("Supply --base= an explicit built preview or public origin");
const directoryIndex = process.argv.includes('--directory-index');
if (directoryIndex && !['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw new Error('Directory-index mode is only for local Vite previews; production must verify actual clean URLs');
const root = resolve(import.meta.dirname, "../..");
const posts = await loadBlogPosts(root);
const { answers, answerPath } = await loadAnswers(root);
const expectedRoutes = [...staticPages.map(page => page.path), ...posts.map(post => `/blog/${post.slug}`), ...answers.map(answer => answerPath(answer.slug))].sort();
const out = resolve(root, "artifacts/homepage-release");
await mkdir(out, { recursive: true });
const report = { at: new Date().toISOString(), origin, revision: process.env.QA_REVISION || "unbound", scope: "Read-only metadata and asset audit; media/third-party requests blocked. Not visual or conversion QA.", expectedRoutes, routes: [], assets: [], failures: [] };
const browser = await chromium.launch();
report.localDirectoryIndex = directoryIndex;
const context = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
// Parsing <title> does not invoke its JS setter. SEO's effect always does,
// including on pages whose initial and client metadata are already identical.
// This observes real client execution without introducing a product-only flag.
await context.addInitScript(() => {
  window.__qaSeoTitleWrites = 0;
  const title = Object.getOwnPropertyDescriptor(Document.prototype, "title");
  if (!title?.set) throw new Error("Document title setter unavailable");
  Object.defineProperty(Document.prototype, "title", {
    ...title,
    set(value) {
      title.set.call(this, value);
      window.__qaSeoTitleWrites += 1;
    },
  });
});
await context.route("**/*", route => {
  const request = route.request();
  const url = new URL(request.url());
  return request.method() !== "GET" || url.origin !== new URL(origin).origin || /\.(mp4|webm)(?:\?|$)/.test(url.href)
    ? route.abort() : route.continue();
});
const page = await context.newPage();
const readHead = html => {
  const doc = html === null ? document : new DOMParser().parseFromString(html, "text/html");
  const keys = ["description", "robots", "keywords", "og:type", "og:title", "og:description", "og:url", "og:image", "og:image:secure_url", "og:image:width", "og:image:height", "og:image:alt", "twitter:card", "twitter:title", "twitter:description", "twitter:image", "twitter:image:alt"];
  return {
    title: doc.title,
    canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute("href"),
    canonicalCount: doc.querySelectorAll('link[rel="canonical"]').length,
    meta: Object.fromEntries(keys.map(key => [key, doc.querySelector(`meta[name="${key}"],meta[property="${key}"]`)?.getAttribute("content") || null])),
    schema: [...doc.querySelectorAll('script[type="application/ld+json"]')].map(node => JSON.parse(node.textContent)),
    pageSchema: doc.querySelector('#mindmake-page-jsonld') ? JSON.parse(doc.querySelector('#mindmake-page-jsonld').textContent) : null,
    icons: [...doc.querySelectorAll('link[rel="icon"],link[rel="apple-touch-icon"],link[rel="mask-icon"],link[rel="manifest"]')].map(node => node.getAttribute("href")),
  };
};
const headDifferences = (initial, hydrated) => {
  const differences = ["title", "canonical", "pageSchema"].filter(key => JSON.stringify(initial[key]) !== JSON.stringify(hydrated[key]));
  for (const key of Object.keys(initial.meta)) if (initial.meta[key] !== hydrated.meta[key]) differences.push(key);
  return differences;
};
const waitForClientHead = () => page.waitForFunction(() => window.__qaSeoTitleWrites > 0, null, { timeout: 15000 });
try {
  // Exercise the detector against a known-good and a known-bad hydration.
  // Fixtures are fulfilled in this browser only; no server endpoint is created.
  report.controls = [];
  for (const regression of [false, true]) {
    const url = `${origin}/__qa_metadata_control_${Number(regression)}`;
    const directives = "index, follow, max-image-preview:large";
    const html = `<html><head><title>Control</title><meta name="robots" content="${directives}"><script>setTimeout(()=>{document.title='Control';document.querySelector('meta[name="robots"]').content=${JSON.stringify(regression ? "index, follow" : directives)}},100)</script></head><body>Control</body></html>`;
    await page.route(url, route => route.fulfill({ status: 200, contentType: "text/html", body: html }));
    await page.goto(url, { waitUntil: "domcontentloaded" });
    const initial = await page.evaluate(readHead, html);
    await waitForClientHead();
    const hydrated = await page.evaluate(readHead, null);
    const differences = headDifferences(initial, hydrated);
    if (regression ? !differences.includes("robots") : differences.length !== 0) throw new Error("Metadata parity detector failed its controls");
    report.controls.push({ regression, clientTitleWrites: await page.evaluate(() => window.__qaSeoTitleWrites), differences, pass: true });
    await page.unroute(url);
  }
  const sitemap = await context.request.get(`${origin}/sitemap.xml`);
  if (!sitemap.ok()) throw new Error(`Sitemap HTTP ${sitemap.status()}`);
  const routes = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
  if (!routes.length || new Set(routes).size !== routes.length) throw new Error("Empty or duplicate sitemap routes");
  if (JSON.stringify([...routes].sort()) !== JSON.stringify(expectedRoutes)) throw new Error("Served sitemap does not match the complete source-indexed route set");
  const assets = new Map();
  for (const route of routes) {
    // Vite preview serves /page/ as its built directory index but /page as the
    // SPA fallback. Production clean URLs are tested without this local flag.
    const requestPath = directoryIndex && route !== '/' ? `${route}/` : route;
    const response = await page.goto(`${origin}${requestPath}`, { waitUntil: "domcontentloaded", timeout: 30000 });
    const html = await response.text();
    const initial = await page.evaluate(readHead, html);
    await waitForClientHead();
    const hydrated = await page.evaluate(readHead, null);
    const differences = headDifferences(initial, hydrated);
    const failures = [];
    if (response.status() !== 200) failures.push(`HTTP ${response.status()}`);
    if (initial.canonical !== `https://mindmake.co${route}` || initial.canonicalCount !== 1 || hydrated.canonicalCount !== 1) failures.push("canonical");
    if (!initial.title || !initial.meta.description || /noindex/.test(initial.meta.robots || "")) failures.push("indexable metadata");
    if (!hydrated.meta.robots?.includes("max-image-preview:large")) failures.push("large preview lost");
    if (differences.length) failures.push(`head drift: ${differences.join(", ")}`);
    if (!initial.meta["og:image:alt"] || initial.meta["og:image:width"] !== "1200" || initial.meta["og:image:height"] !== "630") failures.push("social dimensions/alt");
    if (!html.includes("<h1") || !html.includes('id="root"')) failures.push("missing initial body");
    report.routes.push({ route, status: response.status(), htmlSha256: createHash("sha256").update(html).digest("hex"), clientTitleWrites: await page.evaluate(() => window.__qaSeoTitleWrites), initial, hydrated, failures });
    report.failures.push(...failures.map(message => `${route}: ${message}`));
    assets.set(new URL(initial.meta["og:image"]).pathname + new URL(initial.meta["og:image"]).search, "social");
    for (const icon of initial.icons) assets.set(icon, "icon");
  }
  for (const [path, kind] of assets) {
    const response = await context.request.get(new URL(path, origin).href);
    const bytes = await response.body();
    let dimensions = null;
    if (/\.(?:jpg|png)(?:\?|$)/.test(path)) {
      const meta = await sharp(bytes).metadata();
      dimensions = { width: meta.width, height: meta.height };
      if (kind === "social" && (meta.width !== 1200 || meta.height !== 630)) report.failures.push(`${path}: wrong social dimensions`);
    }
    if (!response.ok() || !bytes.length || /text\/html/.test(response.headers()["content-type"] || "")) report.failures.push(`${path}: not a served asset`);
    report.assets.push({ path, kind, status: response.status(), type: response.headers()["content-type"], bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex"), dimensions });
  }
} catch (error) {
  report.failures.push(String(error));
} finally {
  await browser.close();
  report.pass = report.routes.length > 0 && report.failures.length === 0;
  const file = resolve(out, `discoverability-${new URL(origin).hostname}-${report.at.replaceAll(":", "-")}.json`);
  await writeFile(file, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ file, pass: report.pass, routes: report.routes.length, assets: report.assets.length, failures: report.failures }, null, 2));
  if (!report.pass) process.exitCode = 1;
}
