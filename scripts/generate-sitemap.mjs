/**
 * Generates sitemap.xml at build time.
 * Run after `vite build` to place sitemap in dist/.
 *
 * Reads blog slugs from the static data file and combines
 * with known routes to produce a complete sitemap.
 *
 * Only includes the canonical production domain to avoid
 * noindex issues with non-production Vercel deployments.
 */

import { writeFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";
import { loadAnswers } from "./lib/answers-loader.mjs";
import { staticPages } from "./lib/pages.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const DOMAINS = [
  "https://mindmake.co",
];

// Static routes with their change frequency and priority
// One indexed route list, shared with prerender. No fabricated lastmod for
// static pages: a build date is not evidence of a significant content change.
const staticRoutes = staticPages;
const escapeXml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");

async function generateSitemap() {
  const blogPosts = await loadBlogPosts(rootDir);
  const { answers, answerPath } = await loadAnswers(rootDir);

  const urls = [];

  for (const domain of DOMAINS) {
    // Static pages
    for (const route of staticRoutes) {
      urls.push(`  <url>
    <loc>${escapeXml(domain + route.path)}</loc>
  </url>`);
    }

    // Blog posts
    for (const post of blogPosts) {
      urls.push(`  <url>
    <loc>${escapeXml(`${domain}/blog/${post.slug}`)}</loc>
    <lastmod>${escapeXml(post.updatedAt || post.publishedAt)}</lastmod>
  </url>`);
    }

    // Answer pages. A separate surface from the blog, and a separate loop:
    // one page per buyer question, dated by when it was written.
    for (const answer of answers) {
      urls.push(`  <url>
    <loc>${escapeXml(domain + answerPath(answer.slug))}</loc>
    <lastmod>${escapeXml(answer.publishedAt)}</lastmod>
  </url>`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  if (process.argv.includes("--stdout")) {
    process.stdout.write(sitemap);
    return;
  }
  // The public-only path lets focused checks leave an active built candidate alone.
  writeFileSync(resolve(__dirname, "../public/sitemap.xml"), sitemap);
  if (!process.argv.includes("--public-only") && existsSync(resolve(rootDir, "dist"))) {
    writeFileSync(resolve(__dirname, "../dist/sitemap.xml"), sitemap);
  }

  const totalUrls = urls.length;
  const domainsCount = DOMAINS.length;
  console.log(
    `Sitemap generated: ${staticRoutes.length} pages + ${blogPosts.length} blog posts + ${answers.length} answers across ${domainsCount} domains (${totalUrls} total URLs)`
  );
}

await generateSitemap();
