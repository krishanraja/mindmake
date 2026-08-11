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

const EXPECTED = {
  "/workshops": "/teardown",
  "/workshops/build-your-ai-chief-of-staff": "/teardown",
  "/workshops/map-your-agentic-org-chart": "/teardown",
  "/workshops/vibe-coding-for-leaders": "/teardown",
  "/workshops/build-an-autonomous-business-function": "/teardown",
  "/workshops/give-your-ai-memory": "/teardown",
  "/enterprise": "/handover",
  "/immersion": "/handover",
  "/cohort": "/start",
  "/leaders": "/start",
  "/leadership-insights": "/start",
  "/war-room": "/handover",
  "/strategy-day": "/teardown",
  "/fractional-caio": "/handover",
  "/sprints": "/teardown",
  "/sprint/4-week": "/teardown",
  "/sprint/90-day": "/handover",
  "/builder-sprint": "/teardown",
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

  // /capital stays live rather than redirecting.
  await page.goto(B + "/capital", { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(1200);
  const capital = new URL(page.url()).pathname;
  const capitalOk = capital === "/capital";
  if (!capitalOk) failures++;
  console.log(`${capitalOk ? "PASS" : "FAIL"}  /capital stays live -> ${capital}`);
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
