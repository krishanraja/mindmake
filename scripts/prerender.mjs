import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const here = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(here, "../dist");
const site = "https://www.themindmaker.ai";
const template = readFileSync(resolve(distDir, "index.html"), "utf8").replace(
  /<div id="root">\s*<div id="prerendered-content">[\s\S]*?<\/div>\s*<\/div>/,
  '<div id="root"></div>',
);

const nav = `<nav aria-label="Mindmaker"><a href="/sprint">The Sprint</a><a href="/case-studies">Results</a><a href="https://live.themindmaker.ai">Mindmaker Live</a><a href="https://calendly.com/krish-raja/mindmaker-concierge">Book a fit call</a></nav>`;

const pages = [
  {
    path: "/",
    title: "Commercial decisions shaped by AI | The Mindmaker",
    description: "Mindmaker helps founders and business leaders make hard product, price, go-to-market and company decisions as AI changes the market.",
    body: `<h1>Make the right call as AI changes your business.</h1><p>Mindmaker helps founders and business leaders decide what to build, how to price it, how to sell it and how the team should work. Then we help put the decision into action.</p><h2>One decision. 21 days.</h2><p>The Sprint ends with the decision made, the reason kept and the first material action under way.</p><p><a href="/sprint">See the Sprint</a> or <a href="https://calendly.com/krish-raja/mindmaker-concierge">book a fit call</a>.</p>`,
  },
  {
    path: "/sprint",
    title: "The Sprint | The Mindmaker",
    description: "A 21-day Sprint with Krish Raja to resolve one hard product, price, go-to-market or company decision shaped by AI.",
    body: `<h1>One hard business decision. Settled in 21 days.</h1><p>Krish researches it, challenges it, models the choices and makes the call with you. You give decisions and introductions. There is no homework.</p><h2>What you keep</h2><p>The decision, the evidence and reasoning in a private CTRL workspace, and the first material action already under way.</p><p><a href="https://calendly.com/krish-raja/mindmaker-concierge">Book a fit call</a>.</p>`,
  },
  {
    path: "/case-studies",
    title: "Client results | The Mindmaker",
    description: "Eight verified stories about the business decisions Mindmaker helped clients make and what happened next.",
    body: `<h1>The decision, and what changed next.</h1><p>Eight real engagements. The clients stay anonymous. The work and results do not.</p><p><a href="https://calendly.com/krish-raja/mindmaker-concierge">Book a fit call</a>.</p>`,
  },
  {
    path: "/operator",
    title: "How Krish operates | The Mindmaker",
    description: "The systems and operating experience behind Mindmaker's commercial decision work.",
    body: `<h1>How Krish operates.</h1><p>More than 17 years across data, technology and product strategy, plus two years working deep inside AI.</p><p><a href="/sprint">See the Sprint</a>.</p>`,
  },
  {
    path: "/library",
    title: "Library | The Mindmaker",
    description: "Articles and answers about AI, business decisions and the work behind Mindmaker.",
    body: `<h1>Library</h1><p>Articles and answers about AI, business decisions and the work behind Mindmaker.</p>`,
  },
  {
    path: "/blog",
    title: "Articles | The Mindmaker",
    description: "Articles about AI, business decisions and the systems Krish builds.",
    body: `<h1>Articles</h1><p>Writing about AI, business decisions and the systems Krish builds.</p>`,
  },
  {
    path: "/new-age-leadership",
    title: "New Age Leadership | The Mindmaker",
    description: "What changes when AI agents become part of the team.",
    body: `<h1>What changes when AI agents become part of the team.</h1><p>A practical look at human, hybrid and agent-first roles.</p>`,
  },
  {
    path: "/contact",
    title: "Contact | The Mindmaker",
    description: "Send Krish Raja a general message or book a short fit call about a commercial decision shaped by AI.",
    body: `<h1>Contact</h1><p>Use this page for a general message. For work, <a href="https://calendly.com/krish-raja/mindmaker-concierge">book a fit call</a>.</p>`,
  },
];

function build(page) {
  let html = template;
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(/<meta name="description" content="[^"]*"/, `<meta name="description" content="${page.description}"`);
  html = html.replace(/<meta property="og:title" content="[^"]*"/, `<meta property="og:title" content="${page.title}"`);
  html = html.replace(/<meta property="og:description" content="[^"]*"/, `<meta property="og:description" content="${page.description}"`);
  html = html.replace(/<meta property="og:url" content="[^"]*"/, `<meta property="og:url" content="${site}${page.path}"`);
  html = html.replace(/<meta name="twitter:title" content="[^"]*"/, `<meta name="twitter:title" content="${page.title}"`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*"/, `<meta name="twitter:description" content="${page.description}"`);
  html = html.replace(/<link rel="canonical" href="[^"]*"/, `<link rel="canonical" href="${site}${page.path}"`);
  return html.replace('<div id="root"></div>', `<div id="root"><div id="prerendered-content">${page.body}${nav}</div></div>`);
}

for (const page of pages) {
  const html = build(page);
  if (page.path === "/") writeFileSync(resolve(distDir, "index.html"), html);
  else {
    const out = resolve(distDir, page.path.slice(1));
    if (!existsSync(out)) mkdirSync(out, { recursive: true });
    writeFileSync(resolve(out, "index.html"), html);
  }
}

console.log(`Prerendered ${pages.length} public pages`);
