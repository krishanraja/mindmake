#!/usr/bin/env node
/**
 * The no-JavaScript gate.
 *
 * Every other check on this site loads the page in a browser that runs
 * everything, which is the one visitor whose experience was never in doubt.
 * The contract's rule is stricter than that: the DOM is always complete, CSS
 * defaults to revealed, and no JavaScript means nothing hidden. Nothing was
 * measuring it.
 *
 * What it missed, for months: `.mm-drum` was `overflow: hidden` and the drum's
 * position is a transform written by a hook, so with scripting off the box
 * showed one card and clipped every other one with no scrollbar. On the
 * questions drum that was one answer of eight and 2,308px of clipped copy, on
 * the section a reader goes to when they have a question. Every unit test
 * passed, because every unit test renders into a jsdom that runs JavaScript,
 * and every browser gate passed, because every browser gate runs JavaScript.
 *
 * Two things are checked, and the second is the general form of the first.
 *
 * REACHABLE: every answer in the page's own corpus is in the served markup.
 *
 * NOT CLIPPED AWAY: no element that the browser actually laid out is hidden by
 * a clipping ancestor that cannot be scrolled. An element with no box at all is
 * fine and is skipped: a closed `<details>` renders nothing, and its summary is
 * a real control that opens it with no script running. An element with a box
 * that has been clipped to nothing is different, because there is no control
 * anywhere that brings it back.
 *
 * Usage:
 *   node scripts/qa/no-js-check.mjs [--base http://127.0.0.1:PORT]
 *                                   [--paths /,/ai-brain,/ai-gtm] [--report]
 *
 * Without --base, the gate owns an ephemeral production-preview server and
 * stops it before exit. An explicit base is only for deliberate diagnostics.
 */
import { chromium } from "playwright";
import { asked } from "./lib/asked.mjs";
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { createServer } from "node:net";
import { resolve } from "node:path";

const args = process.argv.slice(2);
const flag = (name, fallback) => {
  const at = args.indexOf(`--${name}`);
  return at === -1 ? fallback : args[at + 1];
};
const root = resolve(import.meta.dirname, "../..");
let BASE = flag("base", "");
let server;
const PATHS = flag("paths", "/,/ai-brain,/ai-gtm,/faq,/new-age-leadership").split(",");
const REPORT = args.includes("--report");

const delay = (milliseconds) => new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
const findEphemeralPort = () => new Promise((resolvePort, rejectPort) => {
  const probe = createServer();
  probe.unref();
  probe.once("error", rejectPort);
  probe.listen(0, "127.0.0.1", () => {
    const address = probe.address();
    probe.close((error) => {
      if (error) rejectPort(error);
      else resolvePort(address.port);
    });
  });
});

const startServer = async () => {
  const port = await findEphemeralPort();
  BASE = `http://127.0.0.1:${port}`;
  const viteEntry = resolve(root, "node_modules/vite/bin/vite.js");
  server = spawn(process.execPath, [viteEntry, "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], {
    cwd: root,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let diagnostics = "";
  server.stdout.on("data", (chunk) => { diagnostics += chunk.toString(); });
  server.stderr.on("data", (chunk) => { diagnostics += chunk.toString(); });
  for (let attempt = 0; attempt < 80; attempt += 1) {
    if (server.exitCode !== null) throw new Error(`local preview server exited before readiness\n${diagnostics}`);
    try {
      const response = await fetch(`${BASE}/`);
      if (response.ok) return;
    } catch {
      // The owned preview is still starting.
    }
    await delay(125);
  }
  throw new Error(`local preview server did not become ready at ${BASE}\n${diagnostics}`);
};

if (!BASE) {
  await startServer();
  console.log(`Using script-owned production preview at ${BASE}`);
}

/** How much of an element's own box has to survive its clipping ancestors. */
const KEPT_FLOOR = 0.06;

/* The corpus, read the way the pages read it. A page is checked against the
   answers it actually renders rather than a list kept here, so adding a
   question to a page cannot quietly escape the gate. */
const corpus = JSON.parse(readFileSync(resolve(process.cwd(), "src/content/answers.json"), "utf8"));
const answers = (corpus.entries ?? corpus).map((entry) => ({ id: entry.id, question: entry.question, answer: entry.answer }));

/** Text a browser will have collapsed, matched the same way. */
const flatten = (text) => text.replace(/\s+/g, " ").replace(/[‘’]/g, "'").replace(/[“”]/g, '"').trim();

const problems = [];
const rows = [];
let browser;

try {
  browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM
    ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM }
    : process.platform === "linux"
      ? { executablePath: "/opt/pw-browsers/chromium" }
      : { channel: "chrome" });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });

  for (const path of PATHS) {
    const page = await context.newPage();
    await page.goto(BASE + asked(path), { waitUntil: "load" });

  const text = flatten(await page.evaluate(() => document.body.textContent ?? ""));
  const structure = await page.evaluate(() => ({
    rootIsEmpty: (document.querySelector("#root")?.textContent ?? "").trim().length === 0,
    mains: document.querySelectorAll("main").length,
    h1s: document.querySelectorAll("h1").length,
  }));
  /* The questions this page renders, taken from the page rather than a list
     kept here, and each one's answer looked for in the served markup. */
  const onPage = answers.filter((entry) => text.includes(flatten(entry.question)));
  const missing = onPage.filter((entry) => !text.includes(flatten(entry.answer)));

  const clipped = await page.evaluate((floor) => {
    const out = [];
    for (const el of document.querySelectorAll("h1,h2,h3,h4,p,li,blockquote,figcaption")) {
      const visibleText = (el.textContent ?? "").trim().replace(/\s+/g, " ");
      // Empty structural text nodes carry no readable content, so their box
      // cannot constitute a no-JavaScript reachability failure.
      if (!visibleText) continue;
      const box = el.getBoundingClientRect();
      const area = box.width * box.height;
      /* No box at all: not laid out, so not clipped. A display:none branch
         lands here. */
      if (area <= 0) continue;
      /* A closed <details> is opened by a control the browser itself provides,
         so its contents are reachable with scripting off. This used to be the
         line above: while the summary was shut the contents had no box, so the
         area test caught them. Chromium now lays that content out and hides it
         through the details slot instead, so on 24 September the ai-gtm
         evidence drawer reported as unreachable text inside `section.signal-deck`
         with `open` false on its own <details> ancestor. Named rather than
         inferred from a box, so a further change to how a browser shuts a
         drawer cannot quietly turn this back into a finding. */
      if (el.closest("details:not([open])")) continue;
      /* A heading that is deliberately not drawn. `.mm-visually-hidden` is the
         standard 1px clipped box naming a section for a screen reader, so being
         clipped away is the whole of its job, and it is more reachable with
         scripting off than with it. It only started reporting on 2 September,
         when the margin reset stopped being (0,1,1) and its own `margin: -1px`
         finally applied; the box was always there and always clipped. */
      if (el.closest(".mm-visually-hidden")) continue;
      let t = box.top, l = box.left, w = box.width, h = box.height;
      let cage = null;
      for (let node = el.parentElement; node; node = node.parentElement) {
        const cs = getComputedStyle(node);
        const overflow = `${cs.overflowX} ${cs.overflowY}`;
        const c = node.getBoundingClientRect();
        if (/auto|scroll/.test(overflow)) {
          /* Scrollable, so the reader can bring this into the box. What is
             visible afterwards is the element, or the box if the box is
             smaller. Carrying its far-off-screen position further up the tree
             is what made the first version of this call every card in a
             working scroller unreachable. */
          w = Math.min(w, c.width); h = Math.min(h, c.height);
          t = c.top; l = c.left;
          continue;
        }
        if (!/hidden|clip/.test(overflow)) continue;
        const kept = Math.max(0, Math.min(t + h, c.bottom) - Math.max(t, c.top)) * Math.max(0, Math.min(l + w, c.right) - Math.max(l, c.left));
        if (kept < w * h) cage = `${node.tagName.toLowerCase()}.${(node.className || "").toString().split(" ")[0]}`;
        const nt = Math.max(t, c.top), nl = Math.max(l, c.left);
        h = Math.max(0, Math.min(t + h, c.bottom) - nt);
        w = Math.max(0, Math.min(l + w, c.right) - nl);
        t = nt; l = nl;
      }
      const kept = (w * h) / area;
      if (kept < floor) out.push({ cage, kept: Math.round(kept * 1000) / 1000, text: visibleText.slice(0, 52) });
    }
    return out;
  }, KEPT_FLOOR);

  const emptyRoute = structure.rootIsEmpty || structure.mains < 1 || structure.h1s < 1 || text.length < 80;
  rows.push({ path, asked: onPage.length, missing: missing.length, clipped: clipped.length, emptyRoute });
  if (emptyRoute) {
    problems.push(`${path}: served no complete route content with JavaScript disabled (${structure.mains} main, ${structure.h1s} h1, ${text.length} text characters)`);
  }
  if (missing.length) {
    problems.push(`${path}: ${missing.length} of ${onPage.length} answers not in the markup: ${missing.map((m) => m.id).join(", ")}`);
  }
  if (clipped.length) {
    const cages = [...new Set(clipped.map((c) => c.cage))].join(", ");
    problems.push(`${path}: ${clipped.length} text block(s) laid out and then clipped away inside ${cages}, with no way to scroll to them — first: "${clipped[0].text}"`);
  }
    await page.close();
  }
  await context.close();
} finally {
  if (browser) await browser.close();
  if (server && server.exitCode === null) {
    server.kill("SIGTERM");
    await Promise.race([
      new Promise((resolveExit) => server.once("exit", resolveExit)),
      delay(2000),
    ]);
  }
}

if (REPORT) {
  for (const r of rows) {
    console.log(`  ${r.path.padEnd(12)} ${String(r.asked).padStart(2)} answers asked, ${r.missing} missing, ${r.clipped} clipped away, complete route: ${r.emptyRoute ? "no" : "yes"}`);
  }
}

if (problems.length) {
  console.error(`\nWith JavaScript off, ${problems.length} problem(s):`);
  for (const line of problems) console.error(`  ${line}`);
  process.exit(1);
}
console.log(`no JavaScript: ${rows.length} pages, ${rows.reduce((n, r) => n + r.asked, 0)} answers all present, nothing clipped away`);
