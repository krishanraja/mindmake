import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath, pathToFileURL } from "url";
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
    title: "Every AI you buy knows the market. Yours should also know you.",
    description: "Mindmake builds AI that knows how you work: your standards, your context and your past decisions. Thirty days, and you keep what it learns.",
    body: `<h1>Every AI you buy knows the market. Yours should also know you.</h1><h2>Two ways to start</h2><p><a href="/ai-brain">Build your AI brain</a>. An AI that knows how you work: your standards, your context and the decisions you have already made. It helps with the work only you can do, and takes on the work you would rather not.</p><p><a href="/ai-gtm">Build your AI GTM</a>. AI is changing what customers will pay for. We rebuild one part of how you sell, across what you offer, what you charge, how you stand out and who does the selling.</p><h2>Where does everything you teach AI end up?</h2><p>Consultants and agencies do good work and leave you a plan. When the project closes, the understanding behind it goes with them.</p><p>The tools you subscribe to are useful, and each of them keeps what it learns on their side.</p><p>We build the system inside your own accounts. It learns how you decide, it gets better every week, and it stays yours when we finish.</p><h2>You keep what it learns</h2><p>We help you put your own judgement to work, in plain English, on real decisions, and you own the result.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/ai-brain",
    title: "Build your AI brain",
    description: "An AI that knows how you work: your standards, your context and the decisions you have already made. Built in thirty days, and yours to keep.",
    body: `<h1>Your AI should already know how you work. In thirty days, yours will.</h1><p>An AI brain is a working system that holds your standards, your context and the decisions you have already made, then uses them on real work. It starts learning in the first week, and you keep it.</p><h2>Built around your best work, and the parts you would rather skip</h2><p>More of this: the work only you can do. Your network, made searchable at the moment it matters. The calls only you can make, prepared from every angle. The taste that makes your work recognisably yours, written down.</p><p>Less of this: the work you would rather not do. Copy drafted in your voice before you arrive. The admin between decisions. The first pass of everything you dread starting.</p><h2>Thirty days builds it. Using it makes it better.</h2><p>You use AI: you ask, it answers, and tomorrow it has forgotten. You direct AI: you hand work over, check it and ship it, and every task starts from nothing. It builds on itself: it remembers, it learns what good looks like to you, and the hours it saves go back into your best work.</p><h2>One process, and the second half is optional.</h2><p>The build, thirty days: we learn your standards from real work, switch on the parts that keep learning, and connect it to the tools your week already runs on.</p><p>The habit, optional: occasional check-ins to build the habits that get you to the third level. No monthly retainer, and the system keeps working either way.</p><h2>You keep everything</h2><p>The system, the automations and the record of your standards. All of it stays with you when we finish.</p><p><a href="/?start=1">Start here</a>.</p>`,
  },
  {
    path: "/ai-gtm",
    title: "Build your AI GTM",
    description: "AI is changing what customers will pay for. We rebuild one part of how you sell, in thirty days, and prove it with real buyers.",
    body: `<h1>AI is changing what customers pay for. We help you sell for that.</h1><p>We take one part of how you sell, rebuild it around the way AI has changed your market, and prove it with real buyers inside thirty days. You keep the model.</p><h2>Four things AI changes about selling</h2><p>What you sell: the thing itself can change now, not only the way you talk about it. We look at what AI lets your product do that it could not do last year, and what a customer would pay more for.</p><p>What you charge: the cost of doing the work is falling, and customers are starting to notice. We work out what that means for your margin and what your prices should assume next year.</p><p>How you stand out: who else is selling to your customers now, what they are promising, and the clearest way to explain why you are the better choice.</p><p>Who does the selling: the roles worth creating now, the people who do well in them, and the parts of selling your team can hand to AI this month.</p><h2>What changed in AI</h2><p>A daily read of what changed across product, price, positioning and people, checked against other sources and published on this page with its own timestamp. Readable as one part of a business: leadership, sales, marketing, product, engineering, operations, finance or people.</p><h2>Thirty days proves it. Then your team runs it.</h2><p>The review, thirty days: understand what changed and pick one thing to fix. You get the model, a clear recommendation and all the evidence behind it.</p><p>The build, optional: put it in place and teach your team to run it. We set the system up as the memory of how you sell, connect it to your plans, and coach the people who keep it going.</p><p><a href="/?start=1">Start here</a>.</p>`,
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
    body: `<h1>Privacy policy.</h1><p>This page explains what Mindmake collects, why it is needed and the choices you have.</p><h2>A private starting brief</h2><p>Mindmake uses the company website, the problem you choose, what you would do with more time and your work email to create the brief you asked for and send the same facts to our team. The publication choice is separate and unticked.</p><h2>Two emails, ever</h2><p>Asking us to send your brief triggers a six-digit code so we know the address is yours. After you confirm it you receive two emails: your results, and one follow-up fourteen days later. Nothing else is sent, and the follow-up record is deleted once it has been used.</p><h2>Your choices</h2><p>You can ask for a copy, correction or deletion of your personal information by emailing <a href="mailto:krish@themindmaker.ai">krish@themindmaker.ai</a>.</p>`,
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

/* The built server bundle. `npm run build` builds it immediately before this
   script runs; a stale one would silently prerender the previous commit's
   markup, so its absence is a failure rather than a fallback. */
const ssrEntry = resolve(rootDir, "dist-ssr/entry-server.js");
if (!existsSync(ssrEntry)) {
  throw new Error("dist-ssr/entry-server.js is missing. Run `npm run build:ssr` before prerendering.");
}
const { render } = await import(pathToFileURL(ssrEntry).href);

/* Paths the route table in src/entry-server.tsx does not cover. Collected
   rather than thrown on immediately, so one run names all of them. */
const missingFromSsr = [];

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
  /* The page itself, rendered from the components at build time.

     This used to be a hand-written shell: every heading and paragraph as plain
     markup, styled to look like the first screen it was about to become. It did
     its job and it was a likeness, and three bugs came from it being a likeness
     rather than the thing. The last was a strip below the hero where the real
     page starts its next section on a raised ground and the shell had plain
     ink, which the entrance gate read as the page settling a second after it
     painted.

     Everything above this line is unchanged. `src/components/SEO.tsx` writes
     the head in an effect and so produces nothing server-side, which is why the
     title, meta, canonical and JSON-LD are still written here and why this
     replaces the body alone.

     A route the server bundle does not cover leaves #root empty and loads as a
     single-page app, exactly as every retired route already does. */
  const body = render(page.path);
  if (!body) missingFromSsr.push(page.path);
  return html.replace('<div id="root"></div>', `<div id="root">${body}</div>`);

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

/* A route the sitemap indexes and the server bundle does not render would ship
   an empty #root: the page would still work, as a single-page app, and would
   have quietly lost everything the prerender is for. The build fails on it for
   the same reason it fails when the prerender and sitemap route sets disagree. */
if (missingFromSsr.length) {
  throw new Error(
    `src/entry-server.tsx has no route for: ${missingFromSsr.join(", ")}. `
    + "Add them there, or stop indexing them.",
  );
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
