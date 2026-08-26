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

const nav = `<nav aria-label="Mindmake"><a href="/ai-brain">Build Your AI Brain</a><a href="/ai-gtm">Build Your AI GTM</a><a href="/case-studies">Results</a><a href="https://mindmakerlive.substack.com">Media</a><a href="/?start=1">Start here</a></nav>`;

const staticPages = [
  {
    path: "/",
    title: "Put your best judgement to work with AI",
    description: "Mindmake helps leaders turn their judgement into useful AI systems and make better product, price, message and team decisions.",
    body: `<h1>Put your best judgement to work with AI.</h1><p>Mindmake helps leaders use AI to do more. It keeps what they know close, brings the right facts into view and turns hard choices into tools their team can use.</p><h2>Ways to get started on your AI journey</h2><p><a href="/ai-brain">Build Your AI Brain</a> or <a href="/ai-gtm">Build Your AI GTM</a>. Begin with the one that feels most useful now.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/ai-brain",
    title: "Build Your AI Brain",
    description: "Build an AI system that remembers what matters, prepares useful work and helps other people meet your standard.",
    body: `<h1>Build an AI that knows how you work.</h1><p>Not a pile of prompts. A working system that remembers what matters, prepares the work and brings the hard calls back to you.</p><h2>A 30-day proof</h2><p>Prove one part of your AI brain on live work, then leave it in your hands.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/ai-gtm",
    title: "Build Your AI GTM",
    description: "Use AI to make better product, price, message and team decisions, then test the answer with real buyers.",
    body: `<h1>Build the offer your market needs now.</h1><p>AI changes what customers can do, what they will pay for and how quickly a new company can move.</p><h2>A 30-day proof</h2><p>Make one product, price or offer change real and test it with real buyers.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/case-studies",
    title: "Customer outcomes",
    description: "Eight verified stories about the work Mindmake helped customers change and what happened next.",
    body: `<h1>The decision and what changed next.</h1><p>Eight real pieces of work. The customers stay anonymous. The work and results do not.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/new-age-leadership",
    title: "A working AI org chart",
    description: "Explore a working org chart from Krish Raja's own AI system and see the human decisions behind each role.",
    ogType: "article",
    keywords: "AI org chart, AI agents, organisation design, human judgement",
    body: `<h1>See people and AI agents share the work.</h1><p>This is a working org chart from Krish's own AI system. It shows the decision each role creates and the work that returns to a person.</p><h2>Three choices before you add an AI agent</h2><ul><li>Keep a person on the calls that need trust.</li><li>Let AI carry work that has a clear rule.</li><li>Design the hand-off, not only the agent.</li></ul><p><a href="/?start=1">Start here</a>.</p>`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "See people and AI agents share the work",
      author: { "@type": "Person", name: "Krish Raja", url: site },
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
    title: "Useful answers",
    description: "Clear answers about Mindmake, who it helps, what the work produces and how to begin.",
    body: `<h1>Useful answers</h1><p>Who the work is for, what the first month proves and what stays with you afterwards.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Send Krish Raja a general message about Mindmake.",
    body: `<h1>Contact Mindmake.</h1><p>Use this page for a general message. For a private company recommendation, <a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/privacy",
    title: "Privacy policy",
    description: "How Mindmake collects, uses and protects information.",
    body: `<h1>Privacy policy.</h1><p>This page explains what Mindmake collects, why it is needed and the choices you have.</p><h2>A private starting brief</h2><p>Mindmake uses the company website, the problem you choose, what you would do with more time and your work email to create the brief you asked for and send the same facts to Krish. The newsletter choice is separate and unticked.</p><h2>Your choices</h2><p>You can ask for a copy, correction or deletion of your personal information by emailing <a href="mailto:krish@themindmaker.ai">krish@themindmaker.ai</a>.</p>`,
  },
  {
    path: "/terms",
    title: "Terms and conditions",
    description: "Terms for using the Mindmake website and services.",
    body: `<h1>Terms and conditions.</h1><p>Use the site lawfully, and agree the details of paid work in writing before it starts.</p><h2>Paid work</h2><p>Each piece of paid work has its own written agreement. It sets the scope, timing, price, payment dates, ownership, confidentiality, cancellation terms and any agreed result.</p><h2>Questions</h2><p>Email <a href="mailto:krish@themindmaker.ai">krish@themindmaker.ai</a>.</p>`,
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
