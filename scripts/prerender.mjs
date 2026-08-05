/**
 * Prerender script for the public marketing routes.
 *
 * For each route this writes a static HTML file carrying that route's meta
 * tags AND a real body: headings, prose and links describing what the page
 * actually says.
 *
 * Why the body matters. Vercel serves these files directly (rewrites only
 * fire for paths with no matching file), and AI crawlers such as GPTBot,
 * ClaudeBot and PerplexityBot largely do not execute JavaScript. Before this
 * change they received an empty div and indexed nothing. Google renders JS
 * and sees the full React app either way.
 *
 * The body is injected inside <div id="root">. src/main.tsx mounts with
 * createRoot, which clears the container on mount, so React replaces this
 * content wholesale. There is no hydration mismatch, and no markup here is
 * ever shown to a user once JS runs.
 *
 * Keep every `body` below faithful to what the live page renders. This is a
 * text-only summary of the real page, never a different pitch, or it becomes
 * cloaking. When a page's positioning changes, change it here too.
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

// Read the built index.html as the template. `vite build` empties dist first,
// so this is normally pristine; the reset below keeps a second run of this
// script on its own output from nesting one injection inside another.
const template = readFileSync(resolve(distDir, "index.html"), "utf-8").replace(
  /<div id="root">\s*<div id="prerendered-content">[\s\S]*?<\/div>\s*<\/div>/,
  '<div id="root"></div>'
);

if (!template.includes('<div id="root"></div>')) {
  console.error(
    "ERROR: could not find an empty <div id=\"root\"></div> in dist/index.html.\n" +
      "The template has drifted or a previous injection could not be reset."
  );
  process.exit(1);
}

const SITE = "https://www.themindmaker.ai";

// Shared footer of links, so every crawled page exposes the real site graph.
const navBlock = `
    <nav aria-label="Mindmaker">
      <a href="/">Home</a>
      <a href="/start">The Diagnosis Room</a>
      <a href="/teardown">The Teardown</a>
      <a href="/handover">The Handover</a>
      <a href="/cohort">The AI-Fluent Executive</a>
      <a href="/operator">How I operate</a>
      <a href="/case-studies">Case studies</a>
      <a href="/signal">Live Intel</a>
      <a href="/library">Library</a>
      <a href="/blog">Blog</a>
      <a href="/contact">Contact</a>
    </nav>`;

// Pages to prerender: meta tags plus the crawlable body.
const pages = [
  {
    path: "/",
    title: "Mindmaker: make the AI decision you keep putting off",
    description:
      "Krish Raja helps senior leaders make and ship nervous AI decisions. Operator-advisor, not a consultant. Work one real decision through the Diagnosis Room, free and without an email.",
    body: `
    <h1>Everyone's selling AI. Nobody's helping you take control of it.</h1>
    <p>Consultants, LLMs and the next hyped tool sell you point solutions built to extract your judgment, not build it. Mindmaker does the opposite: it rebuilds how you decide with AI, so you get sharper as the tools get better.</p>
    <h2>Decision blockers I hear every week</h2>
    <ul>
      <li>I need to deliver an AI strategy, where do I start?</li>
      <li>14 tools pitched this quarter. I use none of them.</li>
      <li>Everyone on my team is using different AI tools. It's chaos.</li>
      <li>Should we build our own AI tools or buy off the shelf?</li>
      <li>How do I know if AI is delivering ROI or just hype?</li>
      <li>I'm nervous about getting locked into the wrong vendor.</li>
    </ul>
    <h2>Start with one real decision</h2>
    <p>The <a href="/start">Diagnosis Room</a> is a guided on-site session. Mindy works through one nervous AI decision with you and ends in one of three honest exits: keep talking it through, book a free 15-minute call, or take away a one-page proposal. Free, no email required.</p>
    <h2>Who you're working with</h2>
    <p>Krish Raja is an operator-advisor, not a consultant: no training, no decks, no demos, just decisions. He runs a 14-agent AI operating system across his own portfolio every day, so the commercial work comes out of production rather than out of a deck. See <a href="/operator">how he operates</a> and the <a href="/case-studies">work it has moved</a>.</p>
    <h2>Two ways in</h2>
    <p>One method: your context, held properly, and anchored to the decisions you are actually making this week. Run it yourself with <a href="https://ctrl.themindmaker.ai/">CTRL</a>, an AI-native chief of staff that is free to start. Or run it with me: <a href="/teardown">The Teardown</a>, ten days on one real decision at $3,500, and if that goes well <a href="/handover">The Handover</a>, six weeks rebuilding how the business decides and sells, from $30,000.</p>`,
  },
  {
    path: "/start",
    title: "The Diagnosis Room: work through one nervous AI decision",
    description:
      "A guided on-site session. Mindy works through one nervous AI decision with you and ends in three honest exits: keep talking, book a free 15-minute call, or take a one-page proposal. Free, no email required.",
    body: `
    <h1>Bring one real decision.</h1>
    <p>The Diagnosis Room is a guided session on this site. You describe the AI decision you keep not making. Mindy, reasoning in Krish's voice, reflects your business back to you, takes the decision apart, and names the fork you are actually standing at.</p>
    <h2>How it ends</h2>
    <ul>
      <li>Keep talking it through, at no cost and with no email.</li>
      <li>Book a free 15-minute call with Krish.</li>
      <li>Take away a one-page proposal, co-branded to your company.</li>
    </ul>
    <h2>What you get</h2>
    <p>A named fork, the paths available with the trade-off on each, the weak assumption worth testing first, and a concrete next step. Yours to keep. It will recommend a cheaper option, or none at all, when that is the honest answer.</p>
    <p>Free. No email required to start.</p>`,
  },
  {
    path: "/teardown",
    title: "The Teardown: Mindmaker",
    description:
      "Ten business days. One real decision, taken apart into the claims it rests on, each checked against live evidence and cross-examined across four models. Under two hours of your time. $3,500.",
    body: `
    <h1>Bring the decision you keep not making.</h1>
    <p>Ten business days. Under two hours of your time. You get back the decision taken apart: what it actually rests on, which of those parts survive contact with evidence, and which are yours alone to call.</p>
    <h2>What actually happens</h2>
    <ul>
      <li>Your decision comes apart into the claims it is resting on. Most rest on four or five, and most people have never written them down.</li>
      <li>Every claim is tested against live evidence and comes back with a reliability tier, so you can see which parts are load-bearing and which are just repeated.</li>
      <li>Every consideration is classed External (the world decides), Only you (no amount of research will help), or Nobody yet (the answer does not exist and waiting will not produce it).</li>
      <li>Four models cross-examine it, and where they disagree you see the disagreement rather than an average that hides it.</li>
    </ul>
    <h2>What you keep</h2>
    <p>A one-page memo you can send on, your decision mapped to its load-bearing claims, every consideration classed, the four-model cross-examination with disagreements preserved, and three claims placed under a 90-day watch so you know what would change your mind. Plus a CTRL workspace with your decision map in it and 30 days of Edge Pro.</p>
    <h2>Price</h2>
    <p>$3,500 fixed, one decision, ten business days from kickoff. 20% off if you let me write about the work, with you approving how you are portrayed.</p>
    <p>A Teardown is also the gate for <a href="/handover">The Handover</a>. Nobody buys six weeks without us both seeing how one decision goes first.</p>`,
  },
  {
    path: "/handover",
    title: "The Handover: Mindmaker",
    description:
      "Six weeks. We rebuild how your business decides and sells with AI, then I leave and you keep it. Week five I don't attend. Day 90 recheck included. $30,000 under 250 people, $50,000 up to 5,000.",
    body: `
    <h1>Six weeks. Then I leave and you keep it.</h1>
    <p>Consultants are built so the engagement never ends. This one is built to end, on a date you know at the start. In week five I don't attend at all, because a system that only runs when I'm in the room is not a system.</p>
    <h2>The six weeks</h2>
    <ul>
      <li>Week 1. Load and correct your context. Most of it is discovering what the org believes that is no longer true.</li>
      <li>Week 2. Adversarial pre-mortem. We assume the plan failed and work backwards to why.</li>
      <li>Week 3. The fork. If you are not AI-native we rebuild GTM, pricing and positioning. If you are, we set the build order instead.</li>
      <li>Week 4. You drive. You run it, I watch and correct.</li>
      <li>Week 5. I don't attend. If it only works when I'm in the room, we both find that out while there is still time to fix it.</li>
      <li>Week 6. Exit. You keep the system, the context, and the way of deciding. A Day 90 recheck is included.</li>
    </ul>
    <h2>Who it's for</h2>
    <p>Companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product: the seat accountable for whether it sells. Not the CTO, because this is commercial work and engineering and commercial are different problems.</p>
    <h2>Price and the gate</h2>
    <p>$30,000 under 250 people. $50,000 for 250 to 5,000. 20% off if you let me write about the work, with you approving how you are portrayed. I take six of these a year, which is the honest number for work I do personally.</p>
    <p>Every Handover starts with <a href="/teardown">a Teardown</a>, ten days and $3,500. It has talked people out of this as often as into it.</p>`,
  },
  {
    path: "/cohort",
    title: "The AI-Fluent Executive: Mindmaker",
    description:
      "Make your nervous AI decision with 15 other senior leaders. Four weeks, mostly async, with weekly live sessions. Diagnose, decompose, decide, deploy. $2,000 to $3,000 per seat, quarterly. Hosted on Maven.",
    body: `
    <h1>Make your nervous AI decision with 15 other senior leaders.</h1>
    <p>Four weeks, mostly async, with weekly live sessions. Diagnose, decompose, decide, deploy. You leave with the one decision you've been avoiding, pressure-tested by a room full of people sitting in the same chair you are.</p>
    <h2>The four-week arc</h2>
    <ul>
      <li>Week 1, Diagnose. Name the real decision sitting under the one you arrived with, and scope it tightly.</li>
      <li>Week 2, Decompose. Break it into the actual trade-offs: build or buy, now or wait, what stays human and what goes agentic.</li>
      <li>Week 3, Decide. Commit out loud to the group, and leave with a one-page decision memo you can send on.</li>
      <li>Week 4, Deploy. Ship the first concrete step, with the cohort holding you to the date you set.</li>
    </ul>
    <h2>The shape of it</h2>
    <p>Mostly async, with one 90-minute live session each week. Around four to five hours a week. Ten to fifteen seats, so every participant presents live. For senior operators with budget authority and a real AI decision on the desk, who want peers rather than a consultant lecturing them.</p>
    <h2>Price and dates</h2>
    <p>$2,000 to $3,000 per seat, quarterly, hosted on Maven. Full payment or split into two payments. The next cohort runs November 19 to December 13, 2026 and is currently sold out on Maven, which holds the waitlist.</p>
    <p>Not sure it's the right rung? Work the decision through in the <a href="/start">Diagnosis Room</a> first.</p>`,
  },
  {
    path: "/operator",
    title: "How I operate: Mindmaker",
    description:
      "Most AI advisors sell frameworks they've read. I operate the frameworks I sell. A 14-agent operating system managing a 13-venture portfolio, and the memory, cost and orchestration lessons from running it.",
    body: `
    <h1>The operating system behind Mindmaker.</h1>
    <p>Most advisors sell frameworks they read. I run the frameworks I sell. Mindmaker is operated by a 14-agent system across a 13-venture portfolio, in production, every day.</p>
    <h2>Where the edge comes from</h2>
    <ul>
      <li>Architecture. How the agents are structured, what each one owns, and where the handoffs sit.</li>
      <li>Optimization. What the work actually costs to run, and which model belongs on which job.</li>
      <li>Memory. Giving a system durable context so it stops relearning the business every week.</li>
    </ul>
    <p>This is pattern recognition from a system running under real constraints, not from a conference deck. Almost nobody advising leaders on AI is writing from inside a production agent fleet.</p>
    <p>See <a href="/case-studies">what the work moved</a>, or bring a decision to the <a href="/start">Diagnosis Room</a>.</p>`,
  },
  {
    path: "/case-studies",
    title: "Case studies: Mindmaker",
    description:
      "Anonymized proof from real engagements: stalled commercial assets repositioned, founder-led businesses rebuilt, and nervous AI decisions resolved in days.",
    body: `
    <h1>The work, and what it moved.</h1>
    <p>Real engagements, anonymized. Stalled commercial assets repositioned, founder-led businesses rebuilt, and nervous AI decisions resolved in days rather than quarters.</p>
    <p>Each case names the situation, the decision that was actually blocking it, what changed, and what moved as a result. Client names are withheld where permission was not given; the specifics are intact either way.</p>
    <p>Tell me the decision you're stuck on and I'll tell you which of these it looks like. Start in the <a href="/start">Diagnosis Room</a>.</p>`,
  },
  {
    path: "/signal",
    title: "Live Intel: Mindmaker",
    description:
      "Live model prices, weekly classified reads (WATCH / SKIP / CALL / TAKE), and a nervous-decision machine for leaders making AI calls.",
    body: `
    <h1>Live Intel</h1>
    <p>Every model price, every signal, and the decisions worth making this week, classified by whether they are actually worth your time.</p>
    <h2>The taxonomy</h2>
    <ul>
      <li>WATCH. Worth acting on.</li>
      <li>SKIP. Hype, ignore it.</li>
      <li>CALL. A decision here is overdue.</li>
      <li>TAKE. Krish's opinion, stated plainly.</li>
    </ul>
    <h2>Live model pricing</h2>
    <p>Current pricing across the frontier models leaders are actually choosing between: Claude Opus, Sonnet and Haiku, Gemini Pro and Flash, and GPT-5 and GPT-5 Mini, with a plain-English read on what the movement means for your bill.</p>
    <p>The page also carries the Nervous Decision Machine: describe the AI decision you are stuck on and get it taken apart in writing. Free, no email required.</p>`,
  },
  {
    path: "/new-age-leadership",
    title: "New Age Leadership: Mindmaker",
    description:
      "What your org chart looks like when AI agents are teammates. Human, hybrid, agent-first and emergent roles, and the governance decisions every leader will face.",
    body: `
    <h1>What your org chart looks like when AI agents are teammates.</h1>
    <p>Most leadership writing about AI is theoretical. This is the org chart of a business already running a 14-agent fleet, and the role-design decisions every leader will face as their organization takes on agents.</p>
    <h2>Four kinds of role</h2>
    <ul>
      <li>Human roles, where judgment and accountability cannot be delegated.</li>
      <li>Hybrid roles, where a person directs agents doing the execution.</li>
      <li>Agent-first roles, where the agent runs the function and a human reviews.</li>
      <li>Emergent roles, which nobody designed and which appear once the fleet is running.</li>
    </ul>
    <p>Each one comes with a governance question you probably haven't answered yet: who is accountable when an agent is wrong, who approves an agent-proposed hire, and what a performance review means for a role no human holds.</p>
    <p>Mindmaker's framework is Mind Set, then Mind Map, then Mind Make. Mind Make is the phase where these decisions get committed and deployed. You don't need to solve it today. You do need to know it's coming.</p>`,
  },
  {
    path: "/library",
    title: "Library: Mindmaker",
    description:
      "Posts, frameworks and answers to the questions leaders actually ask about AI decisions, adoption and vendor noise.",
    body: `
    <h1>Posts, questions, and what I believe.</h1>
    <p>The written archive: frameworks, essays and straight answers to the questions leaders actually ask about making AI decisions, choosing vendors, and telling adoption from theatre.</p>
    <p>Includes the FAQ: how the engagements work, what they cost, who they suit, and when the honest answer is that you don't need them.</p>
    <p>Can't find your answer? <a href="/contact">Email me directly</a>.</p>`,
  },
  {
    path: "/blog",
    title: "Blog: Mindmaker",
    description:
      "Analysis, frameworks, and decisions on the state of AI for leaders. No vendor theatre.",
    body: `
    <h1>Analysis and frameworks for leaders building AI capability.</h1>
    <p>Practical frameworks and strategies for leaders building AI capability. No vendor theatre, just what has held up in real implementations.</p>
    <p>Recurring themes: why AI training fails where building works, how to spot vendor theatre, what real ROI looks like when you measure it honestly, the builder mindset versus the consumer mindset, and how to get an executive team aligned on AI without a six-figure literacy contract.</p>
    <p>Got a decision you keep not making? Work it through in the <a href="/start">Diagnosis Room</a>. Free, no email.</p>`,
  },
  {
    path: "/faq",
    title: "FAQ: Mindmaker",
    description:
      "Answers to common questions about how Mindmaker works, what engagements cost, and who they suit.",
    body: `
    <h1>Questions.</h1>
    <p>Answers about how Mindmaker works, what the engagements cost, who they suit, and when the honest answer is that you don't need one.</p>
    <p>The full set lives in the <a href="/library">Library</a>.</p>`,
  },
  {
    path: "/contact",
    title: "Contact: Mindmaker",
    description:
      "Get in touch with Krish Raja at Mindmaker. Bring the AI decision you're stuck on.",
    body: `
    <h1>Let's talk.</h1>
    <p>Have a nervous decision about AI, or want to talk about working together? Send a note with the decision you're stuck on and what a good outcome looks like.</p>
    <p>Krish Raja helps senior business leaders become AI-literate by building working systems around their real work, not through vendor theatre or theoretical training. Sixteen years scaling businesses across the UK, USA and Australia, including work with Microsoft, Nine and the BBC.</p>
    <p>Prefer to think out loud first? The <a href="/start">Diagnosis Room</a> takes one decision apart with you, free and without an email.</p>
    <p>Email: krish@themindmaker.ai</p>`,
  },
];

function buildHtml(page) {
  let html = template;

  html = html.replace(/<title>[^<]*<\/title>/, `<title>${page.title}</title>`);
  html = html.replace(
    /<meta name="description" content="[^"]*"/,
    `<meta name="description" content="${page.description}"`
  );
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
    `<meta property="og:url" content="${SITE}${page.path}"`
  );
  html = html.replace(
    /<meta name="twitter:title" content="[^"]*"/,
    `<meta name="twitter:title" content="${page.title}"`
  );
  html = html.replace(
    /<meta name="twitter:description" content="[^"]*"/,
    `<meta name="twitter:description" content="${page.description}"`
  );
  html = html.replace(
    /<link rel="canonical" href="[^"]*"/,
    `<link rel="canonical" href="${SITE}${page.path}"`
  );

  // Inject the crawlable body. React clears #root on mount (createRoot), so
  // this is replaced the moment the bundle runs.
  const content = `<div id="prerendered-content">${page.body}\n${navBlock}\n  </div>`;
  html = html.replace('<div id="root"></div>', `<div id="root">${content}</div>`);

  return html;
}

function prerender() {
  let count = 0;
  let missingRoot = 0;

  for (const page of pages) {
    const html = buildHtml(page);

    // Verify THIS page's own body landed, not merely that some injection
    // exists. A stale template would otherwise pass silently and write the
    // homepage body to every route.
    const fingerprint = page.body.trim().slice(0, 60);
    if (!html.includes(fingerprint)) {
      missingRoot++;
      console.warn(`  ! ${page.path}: body was not injected`);
    }

    if (page.path === "/") {
      // Homepage overwrites the template file itself. Written last-ish is
      // fine because `template` was already read into memory above.
      writeFileSync(resolve(distDir, "index.html"), html);
    } else {
      const dirPath = resolve(distDir, page.path.slice(1));
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      writeFileSync(resolve(dirPath, "index.html"), html);
    }
    count++;
  }

  console.log(`Prerendered ${count} pages with per-page meta tags and crawlable body content`);
  if (missingRoot > 0) {
    console.error(`ERROR: ${missingRoot} page(s) had no body injected. The root div selector has drifted.`);
    process.exit(1);
  }
}

prerender();
