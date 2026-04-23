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
    path: "/cohort",
    title: "The AI Decision Cohort: Mindmaker",
    description:
      "Make your nervous AI decision with 15 other senior leaders. Three weeks. Mostly async. Three live sessions. $3,500 per seat, quarterly.",
  },
  {
    path: "/enterprise",
    title: "Enterprise: Mindmaker",
    description:
      "Your AI capabilities, translated into revenue. The Signal Session ($15k) aligns your team fast. The Revenue Architecture ($60-100k) builds the complete commercial strategy.",
  },
  {
    path: "/operator",
    title: "How I operate: Mindmaker",
    description:
      "The 14-agent operating system behind Mindmaker. Memory, cost, and orchestration lessons from running a real agentic business in production.",
  },
  {
    path: "/signal",
    title: "The Operator's Brief: Mindmaker",
    description:
      "The live sandbox. Model prices, classified reads (WATCH / SKIP / CALL / TAKE), and a decision machine for leaders making AI calls.",
  },
  {
    path: "/blog",
    title: "Blog: Mindmaker",
    description:
      "Analysis, frameworks, and decisions on the state of AI for leaders. No vendor theatre.",
  },
  {
    path: "/faq",
    title: "FAQ: Mindmaker",
    description:
      "Answers to common questions about Mindmaker sprints, pricing, and how we work.",
  },
  {
    path: "/contact",
    title: "Contact: Mindmaker",
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
