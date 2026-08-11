/**
 * Generates public/llms.txt from src/lib/offers.ts.
 *
 * llms.txt is what answer engines read when they want a plain statement of
 * what this business sells. It used to be hand-maintained, which meant it
 * drifted: it was still quoting a retired ladder and a CTRL price that had
 * changed twice.
 *
 * Written to BOTH public/ and dist/, mirroring generate-sitemap.mjs. public/
 * is committed so `vite dev` serves a current file and the diff is reviewable;
 * dist/ is written because `vite build` copied the previous public/ contents
 * before this script ran.
 *
 * Generation alone does not stop drift, since a generated file can still be
 * hand-edited and committed. What stops it is that public/llms.txt is
 * committed AND scanned by src/test/price-single-source.test.ts, so a stale
 * price literal in it fails the test suite.
 *
 * All prices here are DEFAULT_CURRENCY. GBP and AUD exist on the site behind
 * a switcher; publishing three ladders to a crawler would read as three
 * different offers.
 */

import { writeFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { loadOffers } from "./lib/offers-loader.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const {
  TEARDOWN,
  HANDOVER,
  DEFAULT_CURRENCY,
  HANDOVER_ANNUAL_CAP,
  PRACTICE_DESCRIPTION,
  displayPrice,
} = await loadOffers();

const d = (offer, tierId) => displayPrice(offer, DEFAULT_CURRENCY, tierId);
const tierLine = (offer, tierId) => {
  const tier = offer.tiers.find((t) => t.id === tierId);
  return `${d(offer, tierId)} ${tier.label}`;
};

const llms = `# The Mindmaker

<!-- GENERATED FILE. Do not edit by hand. Source: src/lib/offers.ts via scripts/generate-llms.mjs -->

> Krish Raja helps senior leaders make and ship nervous AI decisions. Operator-advisor, not a consultant: no training, no decks, no demos, just decisions.

${PRACTICE_DESCRIPTION}

## Core offers

Presented largest first. Every engagement has a fixed scope, a fixed price and a finish line.

- [The Handover](/handover): ${tierLine(HANDOVER, "under-100")}, ${tierLine(HANDOVER, "100-250")}, ${tierLine(HANDOVER, "250-5000")}. Six weeks, and a completed Teardown is required first. Week 1 load and correct context, week 2 adversarial pre-mortem, week 3 the fork (rebuild GTM, pricing and positioning, or set the build order if already AI-native), week 4 the client drives, week 5 Krish does not attend, week 6 exit. Day 90 recheck included. Capped at ${HANDOVER_ANNUAL_CAP} a year. Sold to the CEO, CRO or VP Product, never the CTO.
- [The Teardown](/teardown): ${d(TEARDOWN)} ${TEARDOWN.tiers[0].label} Ten business days, under two hours of client time. The decision comes apart into the claims it rests on; each is checked against live evidence with a reliability tier; each consideration is classed External, Only you, or Nobody yet; four models cross-examine it with disagreements preserved rather than averaged. Ends in a one-page memo plus three claims under a 90-day watch, and includes a CTRL workspace with the decision map in it. This is the entry rung and the gate for The Handover.
- [For funds and portfolio companies](/capital): the same two engagements, priced per portfolio company. Fund-level and multi-company terms are set on a call.

Prices above are ${DEFAULT_CURRENCY}. The site also publishes GBP and AUD via a currency switcher on each offer page. Those are set prices per market, not conversions, so do not convert between them.

## Who it is for

Companies of 50 to 5,000 people, sweet spot 100 to 1,000. The buyer is the CEO, CRO or VP Product: the seat accountable for whether it sells.

## How I operate

- [The operating system behind Mindmaker](/operator): a 14-agent fleet running 45 workflows in production, licensed to three businesses. The operational foundation the commercial advice is built on.

## Try it

- [The Diagnosis Room](/start): an on-site guided experience. Mindy works through one nervous AI decision with you and ends in one of three honest exits: keep chatting, book a free 15-minute call, or download a co-branded one-page proposal. Free, no email required.
- [Mindmaker LIVE](/signal): live model prices, weekly classified reads (WATCH / SKIP / CALL / TAKE), and the Nervous Decision Machine embedded in-page.
- [Case studies](/case-studies): anonymised client outcomes, filterable.

## About

- [Krish Raja, Founder](/)
- Sixteen years commercialising content, media and IP businesses. Now he builds the AI systems that run them.

## Writing

- [Mindmaker LIVE](https://live.themindmaker.ai): two formats. Built, on why someone built the thing they built. Paid, on who is actually getting paid in a shift and by what mechanism. Free and paid tiers.
- [Blog](/blog): long-form analysis.

## Thought leadership

- [New Age Leadership](/new-age-leadership): how org charts change when AI agents become teammates. Interactive demonstration of human / hybrid / agent-first / emergent roles, with the role-design decisions leaders will face.

## Positioning

Mindmaker is the anti-consultancy for leaders done being sold AI. Consultants, LLMs and the next hyped tool sell point solutions built to extract your judgment, not build it. The method is one thing: build the brain that holds your business, anchored to the decisions you are actually making. Run it yourself with CTRL (https://ctrl.themindmaker.ai), or run it with Krish through The Teardown and then The Handover. Krish runs a 14-agent AI business on his own P&L, so the commercial work comes out of production rather than out of a deck. No fractional executive roles. No ongoing retainers. No production IT work.

## Contact

- Book: https://www.themindmaker.ai (Bring me one real decision, from any page)
- Email: krish@themindmaker.ai
`;

const targets = [
  resolve(__dirname, "../public/llms.txt"),
  resolve(__dirname, "../dist/llms.txt"),
];

let written = 0;
for (const target of targets) {
  try {
    writeFileSync(target, llms);
    written++;
  } catch (err) {
    // dist/ does not exist outside a build. public/ failing is a real error.
    if (target.includes("/public/")) throw err;
  }
}

// The prices are the whole reason this file is generated. If interpolation
// silently produced nothing, fail rather than publish a ladder with holes.
for (const needle of [d(TEARDOWN), d(HANDOVER, "under-100"), d(HANDOVER, "250-5000")]) {
  if (!llms.includes(needle)) {
    console.error(`ERROR: generate-llms.mjs produced no "${needle}" in llms.txt.`);
    process.exit(1);
  }
}

console.log(`Generated llms.txt (${written} target${written === 1 ? "" : "s"})`);
