/**
 * Lightweight prerender script for critical SEO pages.
 *
 * For each route, generates a static HTML file with proper meta tags
 * and a loading shell. The SPA hydrates over this on the client.
 *
 * This is NOT full SSR, it gives search engines meta tags and basic
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
    title: "The AI-Fluent Executive: Mindmaker",
    description:
      "Make your nervous AI decision with 15 other senior leaders. Four weeks. Mostly async. Weekly live sessions. Diagnose, decompose, decide, deploy. $2,500 per seat, quarterly. Hosted on Maven.",
  },
  {
    path: "/workshops",
    title: "Workshops: Mindmaker",
    description:
      "Five one-day workshops on Maven. Build alongside Krish Raja, operator running a 14-agent AI business. From $599.",
  },
  {
    path: "/workshops/build-your-ai-chief-of-staff",
    title: "Build Your AI Chief of Staff: Mindmaker",
    description:
      "One-day workshop on Maven. Build the AI assistant that actually shows up to work, connected to your real inbox, calendar, and chat channels. $599.",
  },
  {
    path: "/workshops/map-your-agentic-org-chart",
    title: "Map Your Agentic Org Chart: Mindmaker",
    description:
      "One-day workshop on Maven. Design the agent fleet your business actually needs. Walk out with a complete agent-native org chart and a 90-day build sequence. $599.",
  },
  {
    path: "/workshops/vibe-coding-for-leaders",
    title: "Vibe Coding for Leaders: Mindmaker",
    description:
      "One-day workshop on Maven. Ship the internal tool you've been waiting six months for IT to build. Working tool, live URL, deployed by end of day. $599.",
  },
  {
    path: "/workshops/build-an-autonomous-business-function",
    title: "Build an Autonomous Business Function: Mindmaker",
    description:
      "One-day workshop on Maven. Build the workflow that runs without you. Real n8n or Make workflow, deployed on your real business by end of session. $599.",
  },
  {
    path: "/workshops/give-your-ai-memory",
    title: "Give Your AI Memory: Mindmaker",
    description:
      "One-day workshop on Maven. Build the memory web that makes your AI worth using. Stop re-explaining your business every Monday. Private, portable, deployed by end of day. $599.",
  },
  {
    path: "/enterprise",
    title: "Enterprise: Mindmaker",
    description:
      "Your AI capabilities, translated into revenue. The Signal Session ($15k) aligns your team fast. The Revenue Architecture ($60-100k) builds the complete commercial strategy.",
  },
  {
    path: "/capital",
    title: "Capital: Mindmaker",
    description:
      "For Operating Partners, family offices, and funds. The Signal Session ($15k) maps the AI strategy for your fund or a portfolio company. The Revenue Architecture ($60-100k per portco) deploys the rebuild. Fund-level pricing available.",
  },
  {
    path: "/operator",
    title: "How I operate: Mindmaker",
    description:
      "The 14-agent operating system behind Mindmaker. Memory, cost, and orchestration lessons from running a real agentic business in production.",
  },
  {
    path: "/case-studies",
    title: "Case studies: Mindmaker",
    description:
      "Anonymized proof from real engagements: stalled commercial assets repositioned, founder-led businesses rebuilt, and nervous AI decisions resolved in days. Filter by Cohort, Signal Session, or Revenue Architecture.",
  },
  {
    path: "/signal",
    title: "The Operator's Brief: Mindmaker",
    description:
      "The live sandbox. Model prices, classified reads (WATCH / SKIP / CALL / TAKE), and a decision machine for leaders making AI calls.",
  },
  {
    path: "/immersion",
    title: "The AI Immersion: Mindmaker",
    description:
      "A focused half-day session for executive teams who need to get aligned on AI fast. Up to eight senior leaders, one facilitated conversation, a board-ready summary within five business days. $12,000.",
  },
  {
    path: "/new-age-leadership",
    title: "New Age Leadership: Mindmaker",
    description:
      "Most leadership content about AI is theoretical. This is the org chart of a business already running a 14-agent fleet, with the decisions every leader will need to make as their organization becomes AI-native.",
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
