import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import { loadBlogPosts } from "./lib/blog-posts-loader.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(here, "..");
const distDir = resolve(rootDir, "dist");
const site = "https://mindmake.co";
const template = readFileSync(resolve(distDir, "index.html"), "utf8").replace(
  /<div id="root">[\s\S]*?<\/div>\s*<script type="module"/,
  '<div id="root"></div>\n    <script type="module"',
);

const nav = `<nav aria-label="Mindmake"><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm">Build your AI GTM</a><a href="/case-studies">Results</a><a href="https://mindmakerlive.substack.com">The weekly read</a><a href="/?start=1">Start here</a></nav>`;

const staticPages = [
  {
    path: "/",
    title: "Every AI you buy knows the market. None of them know you.",
    description: "Mindmake builds systems that hold a leader's judgement: an AI brain, or an AI go-to-market model. Thirty days, and you keep everything.",
    body: `<h1>Every AI you buy knows the market. None of them know you.</h1><h2>Two doors</h2><p><a href="/ai-brain">Build your AI brain</a>. Your taste, standards and context, running as a system. It amplifies what you are best at and absorbs what you hate.</p><p><a href="/ai-gtm">Build your AI GTM</a>. AI moved your market. Monetization, positioning, people. One lever, thirty days, priced on the outcome.</p><h2>Two ways to stay stuck</h2><p>The oracle: advice you could have reached yourself. Consultants hand down the answer, charge for the ceremony, and take the thinking with them when they leave.</p><p>The mirror: your own thinking, handed back. Every AI you buy ingests what you tell it and returns it polished, unchanged, and forgotten by morning. Nothing compounds.</p><h2>We build instruments</h2><p>An instrument makes the situation legible, and the decision stays yours. We build systems that hold your judgement, show you the whole board in plain English, and belong to you when we leave.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/ai-brain",
    title: "Build your AI brain",
    description: "Your taste, standards and judgement, running as a system. Built in thirty days, learning from the first week, yours forever.",
    body: `<h1>Taste. Standards. Judgement. Yours, running as a system.</h1><p>An AI brain is a working system that holds how you decide and uses it on real work. Built in thirty days. Learning from the first week. Yours forever.</p><h2>Built around what you are best at, and what you hate</h2><p>Amplify: the parts only you can do, done more. Your network, made searchable and usable at the moment it matters. The calls only you can make, prepared from every angle. The taste that makes your work recognisably yours, written down and enforced.</p><p>Absorb: the parts you hate, done without you. Copy drafted in your voice, to your standards, before you arrive. The admin between decisions. The first pass of everything you currently dread starting.</p><h2>Thirty days builds it. The habit compounds it.</h2><p>Level one, you use AI: prompts and one-offs, useful moments, nothing remembers. Level two, you direct AI: work is delegated, reviewed, shipped, forgotten. Level three, it compounds: the system remembers, learns your standards, and hands back hours that return as judgement.</p><h2>You keep everything</h2><p>The brain, the automations, the standards file, the habit. All of it stays when we leave.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/ai-gtm",
    title: "Build your AI GTM",
    description: "An AI-native go-to-market model across product, price, positioning and people. One lever, thirty days, priced on the outcome.",
    body: `<h1>AI moved your market. Your price has not moved yet.</h1><p>An AI-native go-to-market model across product, price, positioning and people. One lever, thirty days, priced on the outcome.</p><h2>Three places the money moves</h2><p>Monetization: the P&amp;L is being repriced underneath you. What intelligence costs now, what that does to your margin, and the pricing your next decision should assume.</p><p>Positioning: who is coming for your business, with what tactics, and the story that keeps you distinct while they arrive.</p><p>People: the roles that should exist now, the people who thrive in them, and the immediate 10X wins inside your GTM.</p><h2>What moved, by lever</h2><p>A daily corroborated read of what changed across product, price, positioning and people, published on this page with its own timestamp.</p><h2>Read it, or rebuild it</h2><p>The audit, thirty days: read what changed, choose the lever. You leave with the model, the recommendation and the proof it was built on. Priced on the outcome.</p><p>The deployment: install the vision, build the champions. We deploy the brain as the memory of your GTM, wire it to the tactical plans, and develop the people inside your team who carry it forward.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/case-studies",
    title: "Results",
    description: "Eight verified stories about the work Mindmake helped customers change and what happened next.",
    body: `<h1>The decision and what changed next.</h1><p>Eight real pieces of work. The customers stay anonymous. The work and results do not.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/new-age-leadership",
    title: "A working AI org chart",
    description: "Explore a working org chart from our own AI system and see the human decisions behind each role.",
    ogType: "article",
    keywords: "AI org chart, AI agents, organisation design, human judgement",
    body: `<h1>See people and AI agents share the work.</h1><p>This is a working org chart from our own AI system. It shows the decision each role creates and the work that returns to a person.</p><h2>Three choices before you add an AI agent</h2><ul><li>Keep a person on the calls that need trust.</li><li>Let AI carry work that has a clear rule.</li><li>Design the hand-off, not only the agent.</li></ul><p><a href="/?start=1">Start here</a>.</p>`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "See people and AI agents share the work",
      author: { "@type": "Organization", name: "Mindmake", url: site },
      publisher: { "@type": "Organization", name: "Mindmake", url: site },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${site}/new-age-leadership` },
    },
  },
  {
    path: "/blog",
    title: "Ideas for better AI decisions",
    description: "Useful questions, checks and working methods for leaders making business decisions as AI changes their market.",
    body: "",
  },
  {
    path: "/faq",
    title: "Straight answers",
    description: "Straight answers about Mindmake: what the thirty days build, what it costs, what happens to your data and what you keep.",
    body: `<h1>Straight answers.</h1><p>The questions leaders ask before they start, answered the way we would answer them on a call. What it costs, whether you need to be technical, what happens after the thirty days, and who sees your data.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Send Mindmake a general message.",
    body: `<h1>Contact Mindmake.</h1><p>Use this page for a general message. For a private company recommendation, <a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/privacy",
    title: "Privacy policy",
    description: "How Mindmake collects, uses and protects information.",
    body: `<h1>Privacy policy.</h1><p>This page explains what Mindmake collects, why it is needed and the choices you have.</p><h2>A private starting brief</h2><p>Mindmake uses the company website, the problem you choose, what you would do with more time and your work email to create the brief you asked for and send the same facts to our team. The publication choice is separate and unticked.</p><h2>Two emails, ever</h2><p>A confirmed request receives its results email and one follow-up fourteen days later. Nothing else is sent, and the follow-up record is deleted once it has been used.</p><h2>Your choices</h2><p>You can ask for a copy, correction or deletion of your personal information by emailing <a href="mailto:privacy@mindmake.co">privacy@mindmake.co</a>.</p>`,
  },
  {
    path: "/terms",
    title: "Terms and conditions",
    description: "Terms for using the Mindmake website and services.",
    body: `<h1>Terms and conditions.</h1><p>Use the site lawfully, and agree the details of paid work in writing before it starts.</p><h2>Paid work</h2><p>Each piece of paid work has its own written agreement. It sets the scope, timing, price, payment dates, ownership, confidentiality, cancellation terms and any agreed result.</p><h2>Questions</h2><p>Email <a href="mailto:hello@mindmake.co">hello@mindmake.co</a>.</p>`,
  },
];

const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#39;");

const renderInlineMarkdown = (value) => escapeHtml(value)
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/\*([^*]+)\*/g, "<em>$1</em>")
  .replace(/\[([^\]]+)]\((https?:\/\/[^)]+|\/[^)]+)\)/g, '<a href="$2">$1</a>');

function renderMarkdown(markdown) {
  const output = [];
  let list = null;

  const closeList = () => {
    if (list) output.push(`</${list}>`);
    list = null;
  };

  for (const rawLine of markdown.trim().split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) {
      closeList();
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      output.push(`<h3>${renderInlineMarkdown(line.slice(4))}</h3>`);
      continue;
    }
    if (line.startsWith("## ")) {
      closeList();
      output.push(`<h2>${renderInlineMarkdown(line.slice(3))}</h2>`);
      continue;
    }
    const unordered = line.match(/^-\s+(.+)/);
    const ordered = line.match(/^\d+\.\s+(.+)/);
    if (unordered || ordered) {
      const nextList = unordered ? "ul" : "ol";
      if (list !== nextList) {
        closeList();
        list = nextList;
        output.push(`<${list}>`);
      }
      output.push(`<li>${renderInlineMarkdown((unordered || ordered)[1])}</li>`);
      continue;
    }
    closeList();
    output.push(`<p>${renderInlineMarkdown(line)}</p>`);
  }
  closeList();
  return output.join("");
}

const blogPosts = await loadBlogPosts(rootDir);
const blogIndex = staticPages.find((page) => page.path === "/blog");
blogIndex.body = `<h1>Ideas you can use.</h1><p>Each note gives you a question, check or working method to take into a real decision.</p><ol>${blogPosts.map((post) => `<li><a href="/blog/${escapeHtml(post.slug)}">${escapeHtml(post.title)}</a><p>${escapeHtml(post.excerpt)}</p></li>`).join("")}</ol>`;

const articlePages = blogPosts.map((post) => ({
  path: `/blog/${post.slug}`,
  title: post.title,
  description: post.metaDescription,
  ogType: "article",
  ogImage: post.ogImage,
  body: `<article><p><a href="/blog">All ideas</a></p><h1>${escapeHtml(post.title)}</h1><p>${escapeHtml(post.excerpt)}</p>${renderMarkdown(post.content)}</article>`,
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

function replaceMeta(html, attribute, key, content) {
  const tag = `<meta ${attribute}="${key}" content="${escapeHtml(content)}" />`;
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const pattern = new RegExp(`<meta\\s+${attribute}=["']${escapedKey}["'][^>]*>`, "i");
  return pattern.test(html) ? html.replace(pattern, tag) : html.replace("</head>", `    ${tag}\n  </head>`);
}

function build(page) {
  const fullTitle = `${page.title} | Mindmake`;
  const canonicalUrl = `${site}${page.path}`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(fullTitle)}</title>`);
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
  if (page.ogImage) {
    html = replaceMeta(html, "property", "og:image", page.ogImage);
    html = replaceMeta(html, "name", "twitter:image", page.ogImage);
  }
  html = html.replace(/<link rel="canonical" href="[^"]*"\s*\/?>/, `<link rel="canonical" href="${escapeHtml(canonicalUrl)}" />`);
  if (page.jsonLd) {
    html = html.replace("</head>", `    <script id="mindmake-page-jsonld" type="application/ld+json">${JSON.stringify(page.jsonLd)}</script>\n  </head>`);
  }
  return html.replace('<div id="root"></div>', `<div id="root"><div id="prerendered-content">${page.body}${nav}</div></div>`);
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

const sitemap = readFileSync(resolve(distDir, "sitemap.xml"), "utf8");
const indexedPaths = [...sitemap.matchAll(/<loc>(https:\/\/mindmake\.co[^<]*)<\/loc>/g)]
  .map((match) => new URL(match[1]).pathname);
const missing = indexedPaths.filter((path) => !renderedPaths.has(path));
const unexpected = [...renderedPaths].filter((path) => !indexedPaths.includes(path));
if (missing.length || unexpected.length) {
  throw new Error(`Prerender and sitemap differ. Missing: ${missing.join(", ") || "none"}. Unexpected: ${unexpected.join(", ") || "none"}.`);
}

console.log(`Prerendered ${pages.length} indexed pages (${staticPages.length} pages + ${articlePages.length} articles)`);
