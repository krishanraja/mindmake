import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "..");
const distDir = resolve(rootDir, "dist");
const site = "https://mindmake.co";
const template = readFileSync(resolve(distDir, "index.html"), "utf8").replace(
  /<div id="root">[\s\S]*?<\/div>\s*<script type="module"/,
  '<div id="root"></div>\n    <script type="module"',
);

/* The four latin faces, preloaded.

   Measured cold on a throttled phone, the page painted at 1.06s in Helvetica
   and Georgia, then Archivo and Source Serif landed at 1.87s and reflowed the
   door copy 22px, then Newsreader landed at 2.02s and rewrapped the hero
   claim. The faces were the last thing the browser asked for, because it only
   learns about them after the 135KB render-blocking stylesheet has arrived and
   been parsed. A preload lets it ask at head-parse time, so the faces travel
   alongside the stylesheet rather than after it.

   Read from the built stylesheet rather than guessed, because Vite hashes the
   file names and the stylesheet is the one honest index of what the browser
   will request. Exactly four, or the build fails: a build that silently
   preloads nothing is the failure mode this exists to remove. `crossorigin` is
   load-bearing, because a font fetch is anonymous CORS and a preload without
   it is a second download of the same file. */
const stylesheetHref = (template.match(/<link rel="stylesheet"[^>]*href="([^"]+\.css)"/) ?? [])[1];
if (!stylesheetHref) {
  throw new Error("dist/index.html carries no stylesheet link, so the font files cannot be found.");
}
const stylesheet = readFileSync(resolve(distDir, `.${stylesheetHref}`), "utf8");
const LATIN_FACE = /url\((["']?)([^)"']*(?:(?:archivo|newsreader|source-serif-4)-latin-wght-normal|ibm-plex-mono-latin-400-normal)[^)"']*\.woff2)\1\)/g;
const fontFiles = [...new Set([...stylesheet.matchAll(LATIN_FACE)].map((match) => match[2]))];
if (fontFiles.length !== 4) {
  throw new Error(`Expected four latin font files to preload and found ${fontFiles.length}: ${fontFiles.join(", ") || "none"}.`);
}
const fontPreloads = fontFiles
  .map((href) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${href}" />`)
  .join("\n    ");
/* After the inline ground and before the stylesheet link Vite appended. */
const shell = template.replace("</style>", `</style>\n    ${fontPreloads}`);

/* The indexed pages, shared with the plate painter so the head and the share
   card are written from the same words; and the plates it painted. */
import { staticPages } from "./lib/pages.mjs";
const plates = JSON.parse(readFileSync(resolve(rootDir, "src/content/socialPlates.json"), "utf8"));

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const blogPosts = await loadBlogPosts(rootDir);

const articlePages = blogPosts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: post.title,
  description: post.metaDescription,
  ogType: "article",
  ogImage: post.ogImage,
  jsonLd: {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription,
    author: { "@type": "Person", name: post.author },
    publisher: { "@type": "Organization", name: "Mindmake", url: site },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${site}/blog/${post.slug}` },
  },
}));

const pages = [...staticPages, ...articlePages];

/* The built server bundle. `npm run build` builds it immediately before this
   script runs; a stale one would silently prerender the previous commit's
   markup, so its absence is a failure rather than a fallback. */
const ssrEntry = resolve(rootDir, "dist-ssr/entry-server.js");
if (!existsSync(ssrEntry)) {
  throw new Error("dist-ssr/entry-server.js is missing. Run `npm run build:ssr` before prerendering.");
}
const { render } = await import(pathToFileURL(ssrEntry).href);

/* Paths the route table in src/entry-server.tsx does not cover. Collected
   rather than thrown on immediately, so one run names all of them. */
const missingFromSsr = [];

function replaceMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*>`, "i");
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function build(page) {
  const fullTitle = `${page.title} | Mindmake`;
  const canonicalUrl = `${site}${page.path}`;
  let html = shell.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
  html = replaceMeta(html, "name", "title", fullTitle);
  html = replaceMeta(html, "name", "description", page.description);
  html = replaceMeta(html, "property", "og:type", page.ogType || "website");
  html = replaceMeta(html, "property", "og:title", fullTitle);
  html = replaceMeta(html, "property", "og:description", page.description);
  html = replaceMeta(html, "property", "og:url", canonicalUrl);
  html = replaceMeta(html, "name", "twitter:title", fullTitle);
  html = replaceMeta(html, "name", "twitter:description", page.description);
  html = replaceMeta(html, "name", "twitter:url", canonicalUrl);
  if (page.keywords) html = replaceMeta(html, "name", "keywords", page.keywords);
  /* The page's own social plate, painted from these same words by
     scripts/social-plates.mjs; the version in the URL changes when the words
     do, so a network that caches by URL fetches the repainted plate. */
  const plate = plates[page.path] ?? plates["/"];
  const plateUrl = page.ogImage ?? `${site}${plate.file}?v=${plate.version}`;
  const plateAlt = [plate.headline, plate.claim].filter(Boolean).join(" ");
  html = replaceMeta(html, "property", "og:image", plateUrl);
  html = replaceMeta(html, "property", "og:image:alt", plateAlt);
  html = replaceMeta(html, "name", "twitter:image", plateUrl);
  html = replaceMeta(html, "name", "twitter:image:alt", plateAlt);
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
  if (page.jsonLd) {
    html = html.replace("</head>", `    <script id="mindmake-page-jsonld" type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>\n  </head>`);
  }
  /* The page itself, rendered from the components at build time.

     This used to be a hand-written shell: every heading and paragraph as plain
     markup, styled to look like the first screen it was about to become. It did
     its job and it was a likeness, and three bugs came from it being a likeness
     rather than the thing. The last was a strip below the hero where the real
     page starts its next section on a raised ground and the shell had plain
     ink, which the entrance gate read as the page settling a second after it
     painted.

     Everything above this line is unchanged. `src/components/SEO.tsx` writes
     the head in an effect and so produces nothing server-side, which is why the
     title, meta, canonical and JSON-LD are still written here and why this
     replaces the body alone.

     A route the server bundle does not cover leaves #root empty and loads as a
     single-page app, exactly as every retired route already does. */
  const body = render(page.path);
  if (!body) missingFromSsr.push(page.path);

  /* The hero poster, preloaded from what this page renders.

     It is `fetchpriority="high"` on its own tag and still landed 650ms after
     the plate, because the tag is only discovered once the document is parsed
     and the stylesheet is in. It is read from the rendered body rather than
     named here, so a renamed asset or a page with no priority plate cannot
     leave a stale preload behind. Only the first priority plate is taken,
     which is the hero on every page that has one; a webp preload carries its
     type so a browser without webp ignores it and takes the jpg from the
     picture element as it does today. The wordmark and the mark used to be
     preloaded here as well; they are vectors written into the page now, and
     there is nothing to fetch.

     Case-insensitive, because React writes the attribute as `srcSet` in the
     server render and this pattern was written for `srcset`: from 3 to
     4 September 2026 it matched nothing, no page carried the preload, and
     the record said every page did. `src/test/first-screen.test.ts` now runs
     the same pattern over the real render of the homepage. */
  const preloads = [];
  const poster = body.match(/<source srcset="([^"]+)" type="image\/webp"[^>]*>\s*<img(?=[^>]*class="mm-plate-media")(?=[^>]*fetchpriority="high")[^>]*>/i);
  if (poster) preloads.push(`<link rel="preload" as="image" type="image/webp" fetchpriority="high" href="${poster[1]}" />`);
  if (preloads.length) {
    html = html.replace('<link rel="stylesheet"', `${preloads.join("\n    ")}\n    <link rel="stylesheet"`);
  }

  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

}

const renderedPaths = new Set();
for (const page of pages) {
  if (renderedPaths.has(page.path)) throw new Error(`Duplicate prerender path: ${page.path}`);
  renderedPaths.add(page.path);
  const html = build(page);
  if (page.path === "/") writeFileSync(resolve(distDir, "index.html"), html);
  else {
    const out = resolve(distDir, page.path.slice(1));
    if (!existsSync(out)) mkdirSync(out, { recursive: true });
    writeFileSync(resolve(out, "index.html"), html);
  }
}

/* A route the sitemap indexes and the server bundle does not render would ship
   an empty #root: the page would still work, as a single-page app, and would
   have quietly lost everything the prerender is for. The build fails on it for
   the same reason it fails when the prerender and sitemap route sets disagree. */
if (missingFromSsr.length) {
  throw new Error(
    `src/entry-server.tsx has no route for: ${missingFromSsr.join(", ")}. `
    + "Add them there, or stop indexing them.",
  );
}

const sitemap = readFileSync(resolve(distDir, "sitemap.xml"), "utf8");
const indexedPaths = [...sitemap.matchAll(/<loc>(https:\/\/mindmake\.co[^<]*)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname);
const missing = indexedPaths.filter((path) => !renderedPaths.has(path));
const unexpected = [...renderedPaths].filter((path) => !indexedPaths.includes(path));
if (missing.length || unexpected.length) {
  throw new Error(`Prerender and sitemap differ. Missing: ${missing.join(", ") || "none"}. Unexpected: ${unexpected.join(", ") || "none"}.`);
}

console.log(`Prerendered ${pages.length} indexed pages (${staticPages.length} pages + ${articlePages.length} articles)`);
