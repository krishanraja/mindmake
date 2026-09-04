/**
 * The social plates: one per indexed page, painted from the page's own words.
 *
 * Until 4 September 2026 every page shared one plate, drawn for a brand two
 * rebuilds ago: a paper card, a retired headline, a grid the site never had.
 * Each page and each post now has its own, in the site's design: the ink,
 * the mark and the wordmark, the page's headline in the grotesque and its
 * claim in the serif and the mint, and the first frame of the film its hero
 * plays, faded into the ink. The words come from `scripts/lib/pages.mjs` and
 * `src/data/blogPosts.ts`, the same source the prerender writes the head
 * from, so a share card and a crawler read the same sentence.
 *
 * Painted here, by a browser, and committed, rather than at build time: the
 * production build has no browser. The manifest this writes records the
 * words each plate was painted with, and `src/test/discoverability.test.ts`
 * compares them with the current words, so a changed headline fails the
 * suite until the plates are painted again. The file names are stable and
 * the manifest carries a version from the words, so a social network that
 * caches by URL fetches a repainted plate.
 *
 * Run: npm run social-plates
 */
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, readdirSync, unlinkSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";
import { staticPages, stillForCategory, plateWords } from "./lib/pages.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = resolve(root, "public/social");
mkdirSync(outDir, { recursive: true });

/* Bump when the template changes, so every plate is repainted. */
const TEMPLATE = 2;

/* Where each film's first frame has its subject, as the share of its width
   to keep in the plate's right-hand column. */
const FOCUS = { "film-01": "62%", "film-02": "60%", "film-03": "60%", "film-04": "22%", "film-05": "70%" };

const font = (relative) => pathToFileURL(resolve(root, "node_modules", relative)).href;
const asset = (relative) => `data:image/jpeg;base64,${readFileSync(resolve(root, relative)).toString("base64")}`;
const mark = readFileSync(resolve(root, "src/assets/mindmake-mark.svg"), "utf8");
const wordmark = readFileSync(resolve(root, "src/assets/mindmake-wordmark.svg"), "utf8");

const posts = await loadBlogPosts(root);
const pages = [
  ...staticPages.map((page) => ({ path: page.path, name: page.path === "/" ? "home" : page.path.slice(1), still: page.still, ...plateWords(page) })),
  ...posts.map((post) => ({ path: `/blog/${post.slug}`, name: `blog-${post.slug}`, still: stillForCategory[post.category] ?? "film-01", headline: post.title, claim: "" })),
];

/* Type size by length, so a long title still fits its column. */
const size = (text) => (text.length <= 22 ? 78 : text.length <= 40 ? 66 : text.length <= 64 ? 56 : 46);

const html = (page) => `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: "Archivo"; src: url("${font("@fontsource-variable/archivo/files/archivo-latin-wght-normal.woff2")}") format("woff2"); font-weight: 100 900; }
@font-face { font-family: "Newsreader"; src: url("${font("@fontsource-variable/newsreader/files/newsreader-latin-wght-normal.woff2")}") format("woff2"); font-weight: 200 800; }
@font-face { font-family: "Plex Mono"; src: url("${font("@fontsource/ibm-plex-mono/files/ibm-plex-mono-latin-500-normal.woff2")}") format("woff2"); font-weight: 500; }
html, body { margin: 0; }
body { width: 1200px; height: 630px; position: relative; overflow: hidden; background: #0a100d; --mm-tx: #e6ede8; --mm-mint: #7fe3b4; font-family: "Archivo", sans-serif; }
.still { position: absolute; top: 0; right: 0; width: 680px; height: 630px; object-fit: cover; object-position: ${FOCUS[page.still] ?? "60%"} 50%; filter: brightness(.86) saturate(.92); }
.fade { position: absolute; inset: 0; background:
  linear-gradient(90deg, #0a100d 0%, #0a100d 46%, rgba(10,16,13,.72) 60%, rgba(10,16,13,.18) 78%, rgba(10,16,13,0) 100%),
  linear-gradient(0deg, rgba(10,16,13,.82) 0%, rgba(10,16,13,0) 42%); }
.light { position: absolute; top: 0; right: 0; width: 680px; height: 630px; background: linear-gradient(115deg, transparent 55%, rgba(190,220,205,.08) 72%, transparent 88%); }
.brand { position: absolute; left: 72px; top: 62px; display: flex; align-items: center; gap: 14px; }
.brand .mark { width: 44px; } .brand .word { width: 220px; } .brand svg { display: block; width: 100%; height: auto; }
.words { position: absolute; left: 72px; bottom: 118px; width: 620px; }
h1 { margin: 0; font-weight: 700; font-size: ${size(page.headline)}px; line-height: 1.04; letter-spacing: -.018em; color: var(--mm-tx); text-wrap: balance; }
p { margin: 18px 0 0; font-family: "Newsreader", serif; font-weight: 400; font-size: ${page.claim.length > 48 ? 34 : 40}px; line-height: 1.18; color: var(--mm-mint); text-wrap: balance; max-width: 560px; }
.url { position: absolute; left: 72px; bottom: 62px; font-family: "Plex Mono", monospace; font-weight: 500; font-size: 19px; letter-spacing: .06em; color: var(--mm-mint); display: flex; align-items: center; gap: 12px; }
.url i { width: 8px; height: 8px; border-radius: 50%; background: var(--mm-mint); display: inline-block; }
</style></head><body>
<img class="still" src="${asset(`src/assets/films/${page.still}-poster.jpg`)}" alt="">
<div class="fade"></div><div class="light"></div>
<div class="brand"><span class="mark">${mark}</span><span class="word">${wordmark}</span></div>
<div class="words"><h1>${escape(page.headline)}</h1>${page.claim ? `<p>${escape(page.claim)}</p>` : ""}</div>
<div class="url"><i></i>mindmake.co${page.path === "/" ? "" : page.path.startsWith("/blog/") ? "/blog" : page.path}</div>
</body></html>`;

function escape(value) {
  return String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

/* The same browser the gates use: the system Chromium where one is named,
   Playwright's own otherwise. */
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM || existsSync("/opt/pw-browsers/chromium")
  ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM ?? "/opt/pw-browsers/chromium" }
  : {});
const context = await browser.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await context.newPage();
const manifest = {};
for (const entry of pages) {
  const version = createHash("sha1").update(JSON.stringify([TEMPLATE, entry.headline, entry.claim, entry.still, entry.path])).digest("hex").slice(0, 8);
  const file = `${entry.name}.jpg`;
  await page.setContent(html(entry), { waitUntil: "load" });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: resolve(outDir, file), type: "jpeg", quality: 88, clip: { x: 0, y: 0, width: 1200, height: 630 } });
  manifest[entry.path] = { file: `/social/${file}`, version, headline: entry.headline, claim: entry.claim, still: entry.still };
}
await browser.close();

/* Plates nothing names any more. */
for (const stale of readdirSync(outDir)) {
  if (!Object.values(manifest).some((plate) => plate.file.endsWith(`/${stale}`))) unlinkSync(resolve(outDir, stale));
}
writeFileSync(resolve(root, "src/content/socialPlates.json"), `${JSON.stringify(manifest, null, 2)}\n`);
if (existsSync(resolve(root, "public/og-image.jpg"))) unlinkSync(resolve(root, "public/og-image.jpg"));
console.log(`${pages.length} plates painted into public/social, manifest in src/content/socialPlates.json`);
