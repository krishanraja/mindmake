/**
 * Lightweight prerender script for critical SEO pages.
 *
 * For each route, generates a static HTML file with proper meta tags
 * and a loading shell. The SPA hydrates over this on the client.
 *
 * This is NOT full SSR — it gives search engines meta tags and basic
 * content structure without requiring a framework migration.
 *
 * For full SSR/SSG, migrate to Next.js or Astro (separate effort).
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

// Read the built index.html as the template
const template = readFileSync(resolve(distDir, "index.html"), "utf-8");

// Pages to prerender with their meta tags
const pages = [
  {
    path: "/sprint/4-week",
    title: "4-Week Sprint — Mindmaker",
    description:
      "One decision. Four weeks. Board-ready. A 1:1 sprint that turns your biggest AI anxiety into a clear, defensible decision.",
  },
  {
    path: "/sprint/90-day",
    title: "90-Day Sprint — Mindmaker",
    description:
      "The full journey. Mind Set → Mind Map → Mind Make. Three decisions, three months, complete transformation from AI chaos to calm direction.",
  },
  {
    path: "/sprints",
    title: "AI Sprints — Mindmaker",
    description:
      "Choose your sprint. 4-week or 90-day. Both start with clarity. Both end with decisions that stick.",
  },
  {
    path: "/blog",
    title: "AI Literacy Blog — Mindmaker",
    description:
      "Expert insights on AI literacy for business leaders. Practical frameworks, not vendor theatre.",
  },
  {
    path: "/faq",
    title: "FAQ — Mindmaker",
    description:
      "Answers to common questions about Mindmaker sprints, pricing, and how we work.",
  },
  {
    path: "/contact",
    title: "Contact — Mindmaker",
    description: "Get in touch with Mindmaker. Start the conversation.",
  },
];

function prerender() {
  let count = 0;

  for (const page of pages) {
    // Create the directory structure
    const dirPath = resolve(distDir, page.path.slice(1));
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }

    // Replace meta tags in the template
    let html = template;

    // Update title
    html = html.replace(
      /<title>[^<]*<\/title>/,
      `<title>${page.title}</title>`
    );

    // Update meta description
    html = html.replace(
      /<meta name="description" content="[^"]*"/,
      `<meta name="description" content="${page.description}"`
    );

    // Update OG tags
    html = html.replace(
      /<meta property="og:title" content="[^"]*"/,
      `<meta property="og:title" content="${page.title}"`
    );
    html = html.replace(
      /<meta property="og:description" content="[^"]*"/,
      `<meta property="og:description" content="${page.description}"`
    );
    html = html.replace(
      /<meta property="og:url" content="[^"]*"/,
      `<meta property="og:url" content="https://www.themindmaker.ai${page.path}"`
    );

    // Update Twitter tags
    html = html.replace(
      /<meta name="twitter:title" content="[^"]*"/,
      `<meta name="twitter:title" content="${page.title}"`
    );
    html = html.replace(
      /<meta name="twitter:description" content="[^"]*"/,
      `<meta name="twitter:description" content="${page.description}"`
    );

    // Update canonical
    html = html.replace(
      /<link rel="canonical" href="[^"]*"/,
      `<link rel="canonical" href="https://www.themindmaker.ai${page.path}"`
    );

    // Write the prerendered file
    writeFileSync(resolve(dirPath, "index.html"), html);
    count++;
  }

  console.log(`Prerendered ${count} pages with per-page meta tags`);
}

prerender();
