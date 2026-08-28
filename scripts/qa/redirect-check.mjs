/**
 * Exercises every retired route in a real browser against the built output.
 *
 * IMPORTANT LIMITATION, read before trusting a pass. This verifies the
 * CLIENT-SIDE fallback in App.tsx, not the HTTP 301. The 301s live in
 * vercel.json and are applied by Vercel's edge, which does not exist locally.
 * The local server here deliberately does not implement them, so what this
 * proves is: a visitor who lands on a retired URL ends up on the right page
 * with the right content, even if the edge rule never fired.
 *
 * The edge rules themselves are checked structurally by
 * src/test/redirects.test.ts, and can only be confirmed as real 301s against a
 * deployment.
 */

import { chromium } from "playwright";
import { startServer } from "./serve-dist.mjs";

const PORT = 4181;

/* Every retired offer route lands on the homepage, and the reason is the one-hop
   rule. These used to expect /teardown, /handover and /start, which were the
   rungs of the offer ladder. That ladder is retired: those three routes are
   themselves redirects to the homepage now, so expecting a retired route to
   arrive at one of them was asking for a two-hop chain the deploy runbook
   forbids. The code has sent them straight to the homepage since the ladder came
   out; this table was the last thing still describing the old shape. */
const EXPECTED = {
  "/workshops": "/",
  "/workshops/build-your-ai-chief-of-staff": "/",
  "/workshops/map-your-agentic-org-chart": "/",
  "/workshops/vibe-coding-for-leaders": "/",
  "/workshops/build-an-autonomous-business-function": "/",
  "/workshops/give-your-ai-memory": "/",
  "/enterprise": "/",
  "/immersion": "/",
  "/cohort": "/",
  "/leaders": "/",
  "/leadership-insights": "/",
  "/war-room": "/",
  "/strategy-day": "/",
  "/fractional-caio": "/",
  "/sprints": "/",
  "/sprint/90-day": "/",
  "/sprint/4-week": "/",
  "/builder-sprint": "/",
  /* Retired with the rest of the ladder. This file was asserting it stayed
     live, alone against vercel.json and src/test/redirects.test.ts, which both
     have it going to the homepage and both pass. */
  "/capital": "/",
};

const server = await startServer(PORT);
// The server may have walked to the next free port if PORT was taken.
const B = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let failures = 0;

try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

  for (const [from, to] of Object.entries(EXPECTED)) {
    // domcontentloaded, not networkidle. The pages load a Calendly script and
    // looping background video, so the network never goes idle and the wait
    // hangs until the timeout on every route.
    await page.goto(B + from, { waitUntil: "domcontentloaded" });
    // The redirect is a client-side <Navigate>, so it happens once React
    // mounts. Wait for the URL to actually change rather than guessing.
    await page
      .waitForFunction((expected) => window.location.pathname === expected, to, { timeout: 8000 })
      .catch(() => {});
    const landed = new URL(page.url()).pathname;
    const ok = landed === to;
    if (!ok) failures++;
    console.log(`${ok ? "PASS" : "FAIL"}  ${from.padEnd(48)} -> ${landed}${ok ? "" : `  (expected ${to})`}`);
  }

  // /alumni is unlinked and noindex, but must still render rather than redirect.
  await page.goto(B + "/alumni", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const alumni = new URL(page.url()).pathname;
  const alumniOk = alumni === "/alumni";
  if (!alumniOk) failures++;
  console.log(`${alumniOk ? "PASS" : "FAIL"}  /alumni still reachable by direct URL -> ${alumni}`);

} finally {
  await browser.close();
  server.close();
}

console.log(
  failures === 0
    ? "\nAll client-side redirects land correctly. The HTTP 301s are config-checked by the test suite and only observable on Vercel."
    : `\n${failures} redirect(s) FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
