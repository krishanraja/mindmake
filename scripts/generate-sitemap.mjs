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

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(__dirname, "..");

const DOMAINS = [
  "https://mindmake.co",
];

// Static routes with their change frequency and priority
const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/ai-brain", changefreq: "weekly", priority: "0.9" },
  { path: "/ai-gtm", changefreq: "weekly", priority: "0.9" },
  { path: "/case-studies", changefreq: "monthly", priority: "0.8" },
  { path: "/new-age-leadership", changefreq: "monthly", priority: "0.5" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/faq", changefreq: "monthly", priority: "0.5" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  // /alumni intentionally excluded: unlisted and noindex.
  // /workshops, /cohort, /enterprise, /immersion and /leaders are 301s now.
  // A redirected URL does not belong in a sitemap.
];

async function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const blogPosts = await loadBlogPosts(rootDir);

  const urls = [];

  for (const domain of DOMAINS) {
    // Static pages
    for (const route of staticRoutes) {
      urls.push(`  <url>
    <loc>${domain}${route.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`);
    }

    // Blog posts
    for (const post of blogPosts) {
      urls.push(`  <url>
    <loc>${domain}/blog/${post.slug}</loc>
    <lastmod>${post.updatedAt || today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`);
    }
  }

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>
`;

  // Write to both public/ (for dev) and dist/ (for production)
  writeFileSync(resolve(__dirname, "../public/sitemap.xml"), sitemap);
  try {
    writeFileSync(resolve(__dirname, "../dist/sitemap.xml"), sitemap);
  } catch {
    // dist/ may not exist yet if running before build
  }

  const totalUrls = urls.length;
  const domainsCount = DOMAINS.length;
  console.log(
    `Sitemap generated: ${staticRoutes.length} pages + ${blogPosts.length} blog posts across ${domainsCount} domains (${totalUrls} total URLs)`
  );
}

await generateSitemap();
