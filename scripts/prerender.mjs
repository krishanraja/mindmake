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
    path: "/sprints",
    title: "1:1 Sprints — Mindmaker",
    description:
      "Your nervous decision, resolved. Builder or Orchestrator. 4-week ($18k) or 90-day ($60k). Fixed scope. Decisions that stick.",
  },
  {
    path: "/enterprise",
    title: "Enterprise — Mindmaker",
    description:
      "Your AI capabilities, translated into revenue. The Signal Session ($15k) aligns your team fast. The Revenue Architecture ($60-80k) builds the complete commercial strategy.",
  },
  {
    path: "/signal",
    title: "The Signal Desk — Mindmaker",
    description:
      "Signal, noise, decisions, and takes on where AI is actually moving — classified by Krish Raja.",
  },
  {
    path: "/tool",
    title: "The Nervous Decision Machine — Mindmaker",
    description:
      "Type the AI decision you're putting off. Get a one-page artifact in 60 seconds. No email required.",
  },
  {
    path: "/blog",
    title: "Blog — Mindmaker",
    description:
      "Analysis, frameworks, and decisions on the state of AI for leaders. No vendor theatre.",
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
