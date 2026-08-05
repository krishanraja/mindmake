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

import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const DOMAINS = [
  "https://www.themindmaker.ai",
];

// Static routes with their change frequency and priority
const staticRoutes = [
  { path: "/", changefreq: "daily", priority: "1.0" },
  { path: "/start", changefreq: "weekly", priority: "0.9" },
  { path: "/teardown", changefreq: "weekly", priority: "0.9" },
  { path: "/handover", changefreq: "weekly", priority: "0.9" },
  { path: "/cohort", changefreq: "weekly", priority: "0.9" },
  { path: "/operator", changefreq: "monthly", priority: "0.7" },
  { path: "/case-studies", changefreq: "monthly", priority: "0.8" },
  { path: "/signal", changefreq: "daily", priority: "0.8" },
  { path: "/new-age-leadership", changefreq: "weekly", priority: "0.8" },
  { path: "/blog", changefreq: "daily", priority: "0.8" },
  { path: "/library", changefreq: "weekly", priority: "0.7" },
  { path: "/leaders", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "yearly", priority: "0.5" },
  { path: "/privacy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
  // /alumni intentionally excluded: invitation-only, noindex.
];

// Extract blog slugs from the static data file
function getBlogSlugs() {
  try {
    const blogFile = readFileSync(
      resolve(__dirname, "../src/data/blogPosts.ts"),
      "utf-8"
    );
    const slugMatches = blogFile.matchAll(/slug:\s*"([^"]+)"/g);
    return [...slugMatches].map((m) => m[1]);
  } catch {
    console.warn("Warning: Could not read blogPosts.ts for sitemap generation");
    return [];
  }
}

function generateSitemap() {
  const today = new Date().toISOString().split("T")[0];
  const blogSlugs = getBlogSlugs();

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
    for (const slug of blogSlugs) {
      urls.push(`  <url>
    <loc>${domain}/blog/${slug}</loc>
    <lastmod>${today}</lastmod>
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
    `Sitemap generated: ${staticRoutes.length} pages + ${blogSlugs.length} blog posts across ${domainsCount} domains (${totalUrls} total URLs)`
  );
}

generateSitemap();
