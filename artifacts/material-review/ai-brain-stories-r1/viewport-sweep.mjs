// Stories section sweep: for each route and viewport, at every resting state of
// the candidate, report text or rows cut by the stage edge and controls under
// the action bar or below the fold; then compare the six's open composition
// with today's build. Usage: node sweep-r3.mjs [candOrigin] [liveOrigin] [sizes]
import { chromium } from "/home/user/mindmake/node_modules/playwright/index.mjs";
import { writeFile } from "node:fs/promises";

const CAND = process.argv[2] || "http://127.0.0.1:4180";
const LIVE = process.argv[3] || "http://127.0.0.1:4193";
const DEFAULT = "1920x1080,1920x800,1680x1050,1600x900,1600x789,1536x864,1536x730,1440x900,1440x800,1440x789,1440x700,1366x768,1366x657,1280x800,1280x720,1280x600,1180x820,1100x700,1024x768,1024x700,1024x660,960x700,820x1180,768x1024,720x450,430x932,412x915,390x844,375x667,360x800,320x568";
const sizes = (process.argv[4] || DEFAULT).split(",").map((s) => { const [w, h] = s.split("x").map(Number); return { w, h, mobile: w <= 620 }; });
const routes = (process.env.ROUTES || "/,/new-age-leadership/").split(",");
const SIX_ONLY = process.env.SIX_ONLY === "1";
const browser = await chromium.launch();

const open = async (origin, path, { w, h, mobile }) => {
  const context = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
  await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); localStorage.setItem("mm-cookie-consent", "declined"); } catch {} });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(origin + path, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  return { context, page, errors };
};
const settle = (page, ms = 120) => page.evaluate((ms) => new Promise((r) => setTimeout(() => requestAnimationFrame(() => requestAnimationFrame(r)), ms)), ms);
const toShare = (page, share) => page.evaluate((share) => {
  const track = document.querySelector("[data-benefit-track]");
  const panel = document.querySelector("[data-benefits]");
  const pin = parseFloat(getComputedStyle(panel).top) || 0;
  scrollTo({ top: scrollY + track.getBoundingClientRect().top - pin + Math.max(1, track.offsetHeight - panel.offsetHeight) * share, behavior: "instant" });
}, share);

/* What a reader sees at this position: text cut by the stage clip, rows outside
   the stage, and the arrows against the fold and the action bar. */
const inspect = (page) => page.evaluate(() => {
  const stageEl = document.querySelector("[data-story-stage]") || document.querySelector(".benefit-stage");
  const stage = stageEl.getBoundingClientRect();
  const margin = parseFloat(getComputedStyle(stageEl).overflowClipMargin) || 0;
  const bar = document.querySelector(".mm-action-bar.is-shown");
  const barTop = bar && getComputedStyle(bar).display !== "none" ? bar.getBoundingClientRect().top : innerHeight;
  const fold = Math.min(innerHeight, barTop);
  const out = [];
  const visible = (el) => { const cs = getComputedStyle(el); return cs.visibility !== "hidden" && parseFloat(cs.opacity) > 0.01 && el.getClientRects().length; };
  const shown = [...document.querySelectorAll(".brain-benefit, [data-story-contents]")].filter(visible);
  for (const el of shown) {
    const range = document.createRange(); range.selectNodeContents(el);
    const rects = [...range.getClientRects()].filter((r) => r.width > 0 && r.height > 0);
    if (!rects.length) continue;
    const top = Math.min(...rects.map((r) => r.top)); const bottom = Math.max(...rects.map((r) => r.bottom));
    const name = el.matches("[data-story-contents]") ? "contents" : `s${Number(el.dataset.benefit) + 1}`;
    if (bottom > stage.bottom + margin + 0.5) out.push(`${name} cut ${Math.round(bottom - stage.bottom - margin)}px`);
    if (top < stage.top - margin - 0.5) out.push(`${name} cut top ${Math.round(stage.top - margin - top)}px`);
    if (bottom > fold + 0.5) out.push(`${name} under ${bar ? "bar" : "fold"} ${Math.round(bottom - fold)}px`);
    if (name === "contents") el.querySelectorAll("a").forEach((a, i) => { const r = a.getBoundingClientRect(); if (r.bottom > stage.bottom + 0.5) out.push(`row ${i + 1} outside stage ${Math.round(r.bottom - stage.bottom)}px`); });
  }
  const next = document.querySelector("[data-benefit-next]").getBoundingClientRect();
  if (next.bottom > fold + 0.5) out.push(`arrows under ${bar ? "bar" : "fold"} ${Math.round(next.bottom - fold)}px`);
  const panel = document.querySelector("[data-benefits]");
  if (panel.scrollTop) out.push(`panel scrolled ${panel.scrollTop}px`);
  return { issues: out, shown: shown.map((el) => el.matches("[data-story-contents]") ? "C" : `S${Number(el.dataset.benefit) + 1}`).join("+") };
});

const sixGeometry = (page) => page.evaluate(() => {
  const r = (el) => { if (!el) return null; const b = el.getBoundingClientRect(); return [Math.round(b.top * 2) / 2, Math.round(b.height * 2) / 2, Math.round(b.left * 2) / 2, Math.round(b.width * 2) / 2]; };
  const a = document.querySelector(".brain-benefit.is-active");
  const lines = (el) => { const range = document.createRange(); range.selectNodeContents(el); return new Set([...range.getClientRects()].filter((x) => x.width > 0).map((x) => Math.round(x.top))).size; };
  return { heading: a?.querySelector("h2")?.textContent, h2: r(a?.querySelector("h2")), h2Lines: a ? lines(a.querySelector("h2")) : 0, p: r(a?.querySelector("p")), stage: r(document.querySelector(".benefit-stage")), next: r(document.querySelector("[data-benefit-next]")), kicker: r(document.querySelector(".brain-benefits .kicker")) };
});

const report = { cand: CAND, live: LIVE, results: [] };
let problems = 0, sixDiffs = 0;
for (const size of sizes) for (const path of routes) {
  const line = { size: `${size.w}x${size.h}`, path, cand: [], live: [], six: [] };
  /* Candidate: every story and contents rest. */
  const c = await open(CAND, path, size);
  const flow = await c.page.evaluate(() => getComputedStyle(document.querySelector("[data-benefits]")).position !== "sticky");
  const plan = await c.page.evaluate(() => { const t = document.querySelector("[data-benefit-track]"); return { stories: t.dataset.storyRests.split(",").map(Number), contents: t.dataset.contentsRests.split(",").map(Number) }; });
  const candSix = [];
  if (!flow) {
    const stops = SIX_ONLY ? plan.stories.map((s, i) => ["s", i, s]) : [...plan.stories.map((s, i) => ["s", i, s]), ...plan.contents.map((s, i) => ["c", i, s])];
    for (const [kind, i, share] of stops) {
      await toShare(c.page, share); await settle(c.page, kind === "s" ? 700 : 500);
      const seen = await inspect(c.page);
      if (seen.issues.length) line.cand.push(`${kind}${i + 1}[${seen.shown}]: ${seen.issues.join(", ")}`);
      if (kind === "s" && i > 0) candSix.push(await sixGeometry(c.page));
    }
  } else line.cand.push("flow");
  if (c.errors.length) line.cand.push(`errors: ${c.errors.join("; ")}`);
  await c.context.close();
  /* Today: the six by their own steps. */
  const l = await open(LIVE, path, size);
  const liveFlow = await l.page.evaluate(() => getComputedStyle(document.querySelector("[data-benefits]")).position !== "sticky");
  const liveSix = [];
  if (!liveFlow) for (let i = 0; i < 6; i++) {
    await l.page.evaluate((i) => { const track = document.querySelector("[data-benefit-track]"); const panel = document.querySelector("[data-benefits]"); const pin = parseFloat(getComputedStyle(panel).top) || 0; scrollTo({ top: scrollY + track.getBoundingClientRect().top - pin + Math.max(1, track.offsetHeight - panel.offsetHeight) * (i === 5 ? 0.999 : i / 5 + 0.02), behavior: "instant" }); }, i);
    await settle(l.page, 950);
    const seen = await inspect(l.page);
    if (seen.issues.length) line.live.push(`six${i + 1}: ${seen.issues.join(", ")}`);
    liveSix.push(await sixGeometry(l.page));
  }
  await l.context.close();
  if (!flow && !liveFlow) for (let i = 0; i < 6; i++) {
    const a = liveSix[i], b = candSix[i];
    const d = [];
    for (const k of ["heading", "h2", "h2Lines", "p", "stage", "next", "kicker"]) if (JSON.stringify(a?.[k]) !== JSON.stringify(b?.[k])) d.push(`${k} ${JSON.stringify(a?.[k])}->${JSON.stringify(b?.[k])}`);
    if (d.length) line.six.push(`six${i + 1}: ${d.join("; ")}`);
  }
  /* What is new: an issue today's build does not have at this size, or the
     arrows further under the bar or fold than today. */
  const liveArrows = Math.max(0, ...line.live.map((x) => Number((x.match(/arrows under \w+ (\d+)px/) || [])[1] || 0)));
  /* Today's item N is the candidate's story N+1. */
  const liveText = (n, kind) => Math.max(0, ...line.live.map((x) => Number((x.match(new RegExp(`\\bs${n} ${kind} (\\d+)px`)) || [])[1] || 0)));
  line.fresh = line.cand.filter((x) => x !== "flow").map((x) => x.split(": ").slice(1).join(": ").split(", ").filter((issue) => {
    const arrows = issue.match(/arrows under \w+ (\d+)px/);
    if (arrows) return Number(arrows[1]) > liveArrows + 1;
    const text = issue.match(/^s(\d+) (cut|under \w+) (\d+)px/);
    if (text && Number(text[1]) > 1) return Number(text[3]) > liveText(Number(text[1]) - 1, text[2]) + 1;
    return true;
  }).length ? x : null).filter(Boolean);
  report.results.push(line);
  const candIssues = line.fresh;
  problems += candIssues.length; sixDiffs += line.six.length;
  console.log(`${line.size} ${path === "/" ? "home" : "nal "}  CAND ${candIssues.length ? candIssues.join(" | ") : line.cand.includes("flow") ? "flow" : "clean"}${line.live.length ? `\n      LIVE ${line.live.join(" | ")}` : ""}${line.six.length ? `\n      SIX  ${line.six.join("\n           ")}` : ""}`);
}
await browser.close();
await writeFile(process.env.OUT || "/tmp/claude-0/-home-user-mindmake/e1eb5e29-bfef-54ee-a2e9-5dcda49eb0d7/scratchpad/sweep-r3.json", JSON.stringify(report, null, 1));
console.log(`\nSUMMARY candidate issues ${problems}, six differences ${sixDiffs}`);
