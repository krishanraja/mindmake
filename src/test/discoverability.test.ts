import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { blogPosts } from "@/data/blogPosts";
import plates from "@/content/socialPlates.json";
import { staticPages, stillForCategory, plateWords } from "../../scripts/lib/pages.mjs";

const ROOT = resolve(__dirname, "../..");
const read = (relative: string) => readFileSync(resolve(ROOT, relative), "utf8");
const bytes = (relative: string) => readFileSync(resolve(ROOT, relative));

/**
 * What a crawler and a share card are given.
 *
 * On 4 September 2026 every page shared one social plate drawn for a brand two
 * rebuilds ago, the tab icon was an older hand-drawn mark in a different
 * green on a dark square, the Organization logo pointed at that icon, both
 * URL forms of every page answered 200, and llms.txt described a hand-off the
 * site no longer runs. None of it was measured by anything. This file reads
 * the files a crawler reads.
 */

/** JPEG dimensions from the first frame header, no image library needed. */
function jpegSize(buffer: Buffer): { width: number; height: number } {
  let at = 2;
  while (at < buffer.length) {
    if (buffer[at] !== 0xff) { at += 1; continue; }
    const marker = buffer[at + 1];
    if (marker >= 0xc0 && marker <= 0xc3) return { height: buffer.readUInt16BE(at + 5), width: buffer.readUInt16BE(at + 7) };
    at += 2 + buffer.readUInt16BE(at + 2);
  }
  throw new Error("no frame header");
}

/** PNG dimensions from the IHDR chunk. */
const pngSize = (buffer: Buffer) => ({ width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) });

type Plate = { file: string; version: string; headline: string; claim: string; still: string };
const manifest = plates as Record<string, Plate>;

describe("the social plates, one per indexed page, painted from the page's words", () => {
  const indexed = [
    ...staticPages.map((page) => ({ path: page.path, still: page.still, ...plateWords(page) })),
    ...blogPosts.map((post) => ({ path: `/blog/${post.slug}`, still: stillForCategory[post.category], headline: post.title, claim: "" })),
  ];

  it("covers every indexed page and nothing else", () => {
    expect(Object.keys(manifest).sort()).toEqual(indexed.map((page) => page.path).sort());
  });

  it("was painted with the words the page carries now", () => {
    /* Painted by a browser and committed, because the production build has
       no browser. A changed headline fails here until `npm run social-plates`
       repaints, which is the point. */
    for (const page of indexed) {
      const plate = manifest[page.path];
      expect(plate.headline, page.path).toBe(page.headline);
      expect(plate.claim, page.path).toBe(page.claim);
      expect(plate.still, page.path).toBe(page.still);
      expect(plate.version).toMatch(/^[0-9a-f]{8}$/);
    }
  });

  it("is a 1200 by 630 photograph under 200KB for every entry", () => {
    for (const [path, plate] of Object.entries(manifest)) {
      const file = resolve(ROOT, "public", plate.file.slice(1));
      expect(existsSync(file), `${path}: ${plate.file}`).toBe(true);
      const buffer = readFileSync(file);
      expect(jpegSize(buffer), path).toEqual({ width: 1200, height: 630 });
      expect(buffer.length, path).toBeLessThan(200_000);
      expect(existsSync(resolve(ROOT, `src/assets/films/${plate.still}-poster.jpg`)), plate.still).toBe(true);
    }
  });

  it("is what both head writers point at, with the words as the alt text", () => {
    const prerender = read("scripts/prerender.mjs");
    expect(prerender).toContain('src/content/socialPlates.json');
    expect(prerender).toContain('replaceMeta(html, "property", "og:image:alt", plateAlt)');
    expect(prerender).toContain('replaceMeta(html, "name", "twitter:image:alt", plateAlt)');
    const seo = read("src/components/SEO.tsx");
    expect(seo).toContain('import plates from "@/content/socialPlates.json"');
    expect(seo).not.toContain("og-image.jpg");
    expect(existsSync(resolve(ROOT, "public/og-image.jpg"))).toBe(false);
    expect(read("index.html")).toContain('content="https://mindmake.co/social/home.jpg"');
  });
});

describe("the icon set, drawn from the vector mark", () => {
  const html = read("index.html");

  it("links the svg, the ico, the png, the touch icon, the pinned tab and the manifest", () => {
    for (const link of [
      '<link rel="icon" href="/favicon.svg" type="image/svg+xml" />',
      '<link rel="icon" href="/favicon-32x32.png" type="image/png" sizes="32x32" />',
      '<link rel="icon" href="/favicon.ico" sizes="16x16 32x32 48x48" />',
      '<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />',
      '<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#7fe3b4" />',
      '<link rel="manifest" href="/site.webmanifest" />',
    ]) expect(html).toContain(link);
  });

  it("is the mark, transparent on the tab and on the ink where a platform paints its own ground", () => {
    const favicon = read("public/favicon.svg");
    expect(favicon).not.toContain("<rect");
    expect(favicon).not.toMatch(/Mindmaker|#10B981|#5EE9B5/);
    expect(favicon.match(/<path /g)?.length).toBe(4);
    for (const [file, side] of [["favicon-16x16.png", 16], ["favicon-32x32.png", 32], ["favicon-192x192.png", 192], ["favicon-512x512.png", 512], ["favicon-192x192-maskable.png", 192], ["favicon-512x512-maskable.png", 512], ["apple-touch-icon.png", 180], ["mindmake-logo-512.png", 512]] as const) {
      expect(pngSize(bytes(`public/${file}`)), file).toEqual({ width: side, height: side });
    }
    /* Alpha in the corner: a tab icon is transparent there, a touch icon,
       a maskable icon and the logo are ink. The corner pixel of an RGBA PNG
       is not readable without decoding, so the generator's rule is pinned
       instead, and the gate that reads pixels is the eye. */
    const generator = read("scripts/generate-favicons.mjs");
    expect(generator).toContain('square(0.92, null)');
    expect(generator).toContain('writeFileSync(out("apple-touch-icon.png"), await png(square(0.62, INK), 180))');
    expect(generator).toContain("mindmake-mark.svg");
    expect(read("public/safari-pinned-tab.svg")).not.toContain("linearGradient");
    for (const stale of ["favicon-70x70.png", "favicon-144x144.png", "favicon-150x150.png", "favicon-310x310.png", "favicon-96x96.png", "favicon-48x48.png", "favicon.png", "mindmake-icon.png"]) {
      expect(existsSync(resolve(ROOT, `public/${stale}`)), stale).toBe(false);
    }
  });

  it("names the site's ink in the manifest and the logo in the organisation record", () => {
    const manifestFile = JSON.parse(read("public/site.webmanifest"));
    expect(manifestFile.theme_color).toBe("#0a100d");
    expect(manifestFile.background_color).toBe("#0a100d");
    expect(manifestFile.icons.map((icon: { src: string }) => icon.src)).toEqual([
      "/favicon-192x192.png", "/favicon-512x512.png", "/favicon-192x192-maskable.png", "/favicon-512x512-maskable.png",
    ]);
    expect(html).toContain('"logo": "https://mindmake.co/mindmake-logo-512.png"');
    expect(html).not.toContain("favicon-512x512.png\"");
  });
});

describe("what the crawlers are told", () => {
  it("serves one form of every URL and keeps the retired routes permanent", () => {
    const vercel = JSON.parse(read("vercel.json"));
    expect(vercel.trailingSlash).toBe(false);
    const temporary = vercel.redirects.filter((redirect: { permanent: boolean }) => !redirect.permanent).map((redirect: { source: string }) => redirect.source);
    /* Two short links people may still type, and the internal email test
       harness `redirects.test.ts` keeps temporary and unindexed. */
    expect(temporary.sort()).toEqual(["/decision", "/start", "/test-email-flows.html"]);
  });

  it("describes the hand-off the site runs in llms.txt", () => {
    const llms = read("scripts/generate-llms.mjs");
    expect(llms).not.toContain("company website");
    expect(llms).toContain("four details");
    expect(llms).toContain("two emails, ever");
  });

  it("writes the head and the plates from one page list", () => {
    const prerender = read("scripts/prerender.mjs");
    expect(prerender).toContain('from "./lib/pages.mjs"');
    expect(prerender).not.toContain("const staticPages = [");
    for (const page of staticPages) {
      expect(page.title.length, page.path).toBeGreaterThan(0);
      expect(page.description.length, page.path).toBeLessThan(160);
    }
  });
});
