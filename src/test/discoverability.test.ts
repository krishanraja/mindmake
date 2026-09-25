import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { blogPosts } from "@/data/blogPosts";
import plates from "@/content/socialPlates.json";
import { answers } from "@/lib/answers";
import { answerJsonLd, answerPath } from "@/lib/answerFormat";
import { staticPages, stillForCategory, plateWords, answerStill } from "../../scripts/lib/pages.mjs";

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
    ...answers.map((answer) => ({ path: answerPath(answer.slug), still: answerStill, headline: answer.title, claim: "" })),
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
      expect(existsSync(resolve(ROOT, `src/assets/films/aug2026/${plate.still}-poster.jpg`)), plate.still).toBe(true);
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

  it("derives the reader directory from canonical metadata, not a second set of claims", () => {
    const llms = execFileSync(process.execPath, ["scripts/generate-llms.mjs", "--stdout"], { cwd: ROOT, encoding: "utf8" });
    expect(llms.replaceAll("\r\n", "\n")).toBe(read("public/llms.txt").replaceAll("\r\n", "\n"));
    for (const page of staticPages) expect(llms).toContain(page.description);
    for (const post of blogPosts) expect(llms).toContain(`https://mindmake.co/blog/${post.slug}`);
    expect(llms).not.toMatch(/two emails, ever|four details|Thirty days|priced on the result/);
    expect(llms).toContain("[Ideas you can use]");
    expect(llms).toContain("[Questions we get asked]");
    expect(llms).toContain("[About us]");
  });

  it("keeps sitemap dates factual and uses the same canonical route set as prerender", () => {
    const sitemap = execFileSync(process.execPath, ["scripts/generate-sitemap.mjs", "--stdout"], { cwd: ROOT, encoding: "utf8" });
    expect(sitemap.replaceAll("\r\n", "\n")).toBe(read("public/sitemap.xml").replaceAll("\r\n", "\n"));
    const xml = new DOMParser().parseFromString(sitemap, "text/xml");
    expect(xml.querySelector("parsererror")).toBeNull();
    const rows = [...xml.querySelectorAll("url")];
    expect(rows).toHaveLength(staticPages.length + blogPosts.length + answers.length);
    for (const page of staticPages) {
      const row = rows.find(row => row.querySelector("loc")?.textContent === `https://mindmake.co${page.path}`);
      expect(row, page.path).toBeDefined();
      expect(row?.querySelector("lastmod"), page.path).toBeNull();
    }
    for (const post of blogPosts) {
      const row = rows.find(row => row.querySelector("loc")?.textContent === `https://mindmake.co/blog/${post.slug}`);
      expect(row?.querySelector("lastmod")?.textContent).toBe(post.updatedAt || post.publishedAt);
    }
  });

  it("uses the approved homepage positioning in the fallback head, organisation and install manifest", () => {
    const home = staticPages.find(page => page.path === "/")!;
    const doc = new DOMParser().parseFromString(read("index.html"), "text/html");
    expect(doc.title).toBe(`${home.title} | Mindmake`);
    for (const selector of ['meta[name="description"]', 'meta[property="og:description"]', 'meta[name="twitter:description"]']) {
      expect(doc.querySelector(selector)?.getAttribute("content")).toBe(home.description);
    }
    const graph = JSON.parse(doc.querySelector('script[type="application/ld+json"]')!.textContent!)["@graph"];
    expect(graph.find((node: { "@type": string }) => node["@type"] === "Organization").description).toBe(home.description);
    expect(JSON.parse(read("public/site.webmanifest")).description).toBe(home.description);
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

/**
 * The answer pages, which exist to be fetched and quoted.
 *
 * One page per buyer question, machine-first, published by dropping a markdown
 * file into `src/content/answers/`. Their index merged into `/blog`, "Ideas
 * you can use", on 2026-09-25 (Krish), so `/answers` itself redirects there
 * and only the pages are indexed. Because there is no manifest to keep in
 * step, what has to be checked instead is that the file the author wrote is
 * what every crawler surface ends up carrying.
 */
describe("the answer pages", () => {
  it("publishes at least one, and every one carries what a retriever needs", () => {
    expect(answers.length).toBeGreaterThan(0);
    for (const answer of answers) {
      expect(answer.slug, answer.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
      expect(answer.title.length, answer.slug).toBeGreaterThan(10);
      expect(answer.description.length, answer.slug).toBeLessThan(160);
      /* Two or three sentences: long enough to stand alone when it is lifted
         out of the page, short enough to be lifted at all. */
      const sentences = answer.answer.split(/(?<=[.?!])\s+/).filter(Boolean);
      expect(sentences.length, answer.slug).toBeGreaterThanOrEqual(2);
      expect(sentences.length, answer.slug).toBeLessThanOrEqual(3);
      expect(answer.claim.length, answer.slug).toBeGreaterThan(40);
      expect(answer.targetQuery.length, answer.slug).toBeGreaterThan(10);
      expect(answer.firstParty.length, answer.slug).toBeGreaterThan(0);
      expect(answer.faq.length, answer.slug).toBeGreaterThan(0);
      expect(answer.body.length, answer.slug).toBeGreaterThan(1000);
    }
  });

  it("carries a real date apiece, newest first", () => {
    /* A page's date is when it was written, and a surface where every page
       shares one timestamp reads as a dump rather than a publication. The
       floor is the launch of the site, because nothing here can honestly
       predate it, and the ceiling is today. */
    const today = new Date().toISOString().slice(0, 10);
    for (const answer of answers) {
      expect(answer.publishedAt >= "2026-08-26", `${answer.slug} predates the site`).toBe(true);
      expect(answer.publishedAt <= today, `${answer.slug} is dated ahead of today`).toBe(true);
    }
    /* A page marked `lead: false` never opens the index (Krish, 2026-09-25);
       the newest page allowed to lead does, and the rest keep date order. */
    expect(answers[0].lead).toBe(true);
    const newestLeader = answers.filter((answer) => answer.lead).map((answer) => answer.publishedAt).sort().reverse()[0];
    expect(answers[0].publishedAt).toBe(newestLeader);
    const rest = answers.slice(1).map((answer) => answer.publishedAt);
    expect(rest).toEqual([...rest].sort().reverse());
  });

  it("never lets the adtech answer lead", () => {
    const adtech = answers.find((answer) => answer.slug === "adtech-compete-ai-targeting-models-defensibility-audit");
    expect(adtech?.lead).toBe(false);
    expect(answers[0].slug).not.toBe(adtech?.slug);
  });

  it("says the answer and the FAQ in structured data", () => {
    for (const answer of answers) {
      const graph = answerJsonLd(answer)["@graph"] as Array<Record<string, unknown>>;
      const article = graph.find((node) => node["@type"] === "Article")!;
      const faq = graph.find((node) => node["@type"] === "FAQPage")!;
      expect(article.headline).toBe(answer.title);
      expect(article.abstract).toBe(answer.answer);
      expect(article.datePublished).toBe(answer.publishedAt);
      expect(article.mainEntityOfPage).toEqual({
        "@type": "WebPage",
        "@id": `https://mindmake.co${answerPath(answer.slug)}`,
      });
      expect((faq.mainEntity as unknown[]).length).toBe(answer.faq.length);
    }
  });

  it("is routed on both sides of the static render", () => {
    /* The prerender writes markup with `src/entry-server.tsx` and the browser
       hydrates it with `src/App.tsx`. A route in one and not the other is an
       answer page that ships as an empty #root or fails to hydrate. */
    for (const [file, path] of [
      ["src/App.tsx", "/answers/:slug"],
      ["src/entry-server.tsx", "/answers/:slug"],
    ]) {
      expect(read(file), `${file} routes ${path}`).toContain(`path="${path}"`);
    }
    /* The old index address sends the reader to the merged page on the
       client; the prerender never writes a page for it. */
    expect(read("src/App.tsx")).toContain('path="/answers" element={<Navigate to="/blog" replace />}');
    expect(read("src/entry-server.tsx")).not.toContain('path="/answers"');
  });

  it("reaches every crawler surface from the one loader", () => {
    for (const script of [
      "scripts/generate-sitemap.mjs",
      "scripts/prerender.mjs",
      "scripts/social-plates.mjs",
    ]) {
      expect(read(script), script).toContain("./lib/answers-loader.mjs");
    }
    /* llms.txt lists the ideas in the order /blog shows them, so it reads the
       answers through the ideas loader, which reads them through this one. */
    expect(read("scripts/generate-llms.mjs")).toContain("./lib/ideas-loader.mjs");
    expect(read("scripts/lib/ideas-loader.mjs")).toContain("./answers-loader.mjs");
    expect(read("scripts/lib/ideas-loader.mjs")).toContain("src/lib/ideaFormat.ts");
    /* One parser, compiled for the scripts rather than written twice. */
    expect(read("scripts/lib/answers-loader.mjs")).toContain("src/lib/answerFormat.ts");
  });

  it("is in the sitemap, in llms.txt and open to crawlers", () => {
    const sitemap = read("public/sitemap.xml");
    const llms = read("public/llms.txt");
    expect(sitemap).not.toContain("<loc>https://mindmake.co/answers</loc>");
    expect(sitemap).toContain("<loc>https://mindmake.co/blog</loc>");
    for (const answer of answers) {
      expect(sitemap, answer.slug).toContain(`<loc>https://mindmake.co${answerPath(answer.slug)}</loc>`);
      expect(llms, answer.slug).toContain(answerPath(answer.slug));
      /* The question, not only the link: a page is worth fetching because of
         what it answers, and the title is only our wording of that. */
      expect(llms, answer.slug).toContain(answer.targetQuery);
    }
    const robots = read("public/robots.txt");
    expect(robots).toContain("Allow: /answers");
    expect(robots).not.toMatch(/Disallow: \/answers/);
  });
});
