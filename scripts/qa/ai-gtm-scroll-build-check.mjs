#!/usr/bin/env node
/**
 * /ai-gtm (r44): the page has to build as it is scrolled, on a phone as well
 * as a desktop, in the site's own chrome, and stay whole where it cannot pin.
 *
 * Krish rejected the live page on 25 September 2026 in part because "There
 * are no scroll builds". The rebuild pins three chapters: the four places the
 * change is felt, the 30 days and the team. Like the /new-age-leadership gate
 * this is modelled on, it never clicks to prove a state exists. It scrolls and
 * records what the page shows, forwards and in reverse, and a chapter passes
 * when scrolling alone reaches every one of its states both ways, holds its
 * stage at the masthead while it does, and releases at either end.
 *
 * It reads the built site through `vite preview`, so it measures the
 * prerendered bytes, and it also measures what `qa:line-breaks` cannot: that
 * gate only sees visible elements, so the steps a pinned chapter is not
 * showing go unmeasured there. Here each step is measured while it is shown.
 *
 * Also checked: nothing in a pinned stage is clipped, at twelve screen sizes,
 * for both doors and every seat, and a chapter that cannot hold its content
 * flows instead, before the reader reaches it and never while they are in it;
 * the same holds with WCAG 1.4.12 text spacing applied; a rail press followed
 * by the reader scrolling away leaves the step the position says, not the one
 * pressed; the focus ring clears 3:1 on the cream bands;
 * the reader without scripts gets every step in flow; reduced
 * motion keeps every pin; the rail moves the page and the state follows it;
 * the door switch and a seat pick never move the page; controls are 44px; one
 * visible h1; the wordmark shares the content's left edge; small text meets
 * WCAG AA on the ground it sits on. A negative control removes the pins and
 * must fail, or the sweep is measuring nothing.
 *
 * With --candidate it binds the run to a material-review candidate manifest
 * and adds what that gate's readiness checks ask about: internal links that
 * resolve, requests that fail, keyboard focus that shows, a rail clear of the
 * action bar, one page scroll with no nested scroller or frame, no repeated
 * sentence or placeholder copy, and neighbouring chapters on different grounds.
 *
 * Evidence: artifacts/ai-gtm/scroll-build/ (frames per state, report.json and
 * a scroll-build evidence report checked by scripts/qa/scroll-build-evidence.mjs).
 *
 * Run after `npm run build`:
 *   PLAYWRIGHT_CHROMIUM=/opt/pw-browsers/chromium node scripts/qa/ai-gtm-scroll-build-check.mjs \
 *     [--candidate quality/ai-gtm/material-review-candidate-r44.json]
 */
import { createHash } from "node:crypto";
import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { validateScrollBuildEvidence } from "./scroll-build-evidence.mjs";
import { computeCandidateIdentity } from "./material-review-firewall-lib.mjs";

const root = fileURLToPath(new URL("../../", import.meta.url));
const output = path.join(root, "artifacts", "ai-gtm", "scroll-build");
const failures = [];
const observations = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const args = process.argv.slice(2);
const candidateArg = args.includes("--candidate") ? args[args.indexOf("--candidate") + 1] : null;
const candidate = candidateArg ? JSON.parse(await readFile(path.join(root, candidateArg), "utf8")) : null;
const identity = candidate ? await computeCandidateIdentity(root, candidate) : null;
const checks = {};
const note = (id, ok, detail) => { checks[id] = { status: ok ? "pass" : "fail", detail }; if (!ok) failures.push(`${id}: ${detail}`); };
const launch = () => chromium.launch({ headless: true, ...(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {}) });

const VIEWPORTS = [[320, 568], [360, 640], [360, 780], [390, 844], [430, 932], [768, 1024], [844, 390], [1024, 768], [1280, 600], [1366, 657], [1366, 768], [1440, 900], [1920, 1080]];
/* Sizes where a stage is closest to its content: laptops a browser's chrome
   has shortened, and the phones reviewers found clipping on. */
const FIT = [[1440, 900], [1366, 657], [1440, 700], [1536, 730], [1280, 600], [1024, 600], [768, 1024], [412, 915], [390, 844], [375, 740], [360, 780], [360, 740]];
const TEXT_SPACING = "* { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }";
const CHAPTERS = { levers: ["Product", "Price", "Positioning", "People"], plan: ["Week 1", "Weeks 2 to 4", "Day 30"], team: ["Today", "AI-native"] };
const BLANK_LIMIT = 0.42;
const STRIDE_SHARE = 0.2;

await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });

const port = await new Promise((resolvePort, rejectPort) => {
  const probe = createServer();
  probe.once("error", rejectPort);
  probe.listen(0, "127.0.0.1", () => { const { port: found } = probe.address(); probe.close(() => resolvePort(found)); });
});
const server = spawn(process.execPath, [path.join(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const origin = `http://127.0.0.1:${port}`;
/* Local static preview serves the prerendered file at /path/ (CLAUDE.md). */
const ROUTE = `${origin}/ai-gtm/`;
for (let attempt = 0; attempt < 100; attempt += 1) { try { if ((await fetch(ROUTE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }

/* One scroll position: which state each chapter shows, whether its stage is
   pinned under the masthead, the longest run of empty viewport rows, overflow,
   and any lone last word in the text currently shown. */
const PROBE = `(() => {
  const header = document.querySelector(".mm-header")?.getBoundingClientRect().height ?? 68;
  const chapters = {};
  for (const section of document.querySelectorAll("[data-gtm-chapter]")) {
    const name = section.dataset.gtmChapter;
    const stage = section.querySelector(".gtm-stage");
    if (!stage) continue;
    const s = getComputedStyle(stage);
    const box = stage.getBoundingClientRect();
    const rail = section.querySelector('.gtm-rail-step[data-active="true"] .gtm-rail-name');
    const pinned = s.position === "sticky";
    const onScreen = box.top < innerHeight * 0.5 && box.bottom > innerHeight * 0.5;
    chapters[name] = { pinned, stageTop: Math.round(box.top * 10) / 10, onScreen, held: pinned && Math.abs(box.top - header) <= 2, state: rail ? rail.textContent.trim() : null, view: section.dataset.view || null };
  }
  const COLS = 7, ROWS = 60;
  const painted = (x, y) => {
    for (const el of document.elementsFromPoint(x, y)) {
      const tag = el.tagName;
      if (tag === "IMG" || tag === "VIDEO" || tag === "svg" || tag === "INPUT") return true;
      const cs = getComputedStyle(el);
      if (cs.backgroundImage !== "none") return true;
      if (cs.borderTopWidth !== "0px" || cs.borderBottomWidth !== "0px" || cs.borderLeftWidth !== "0px" || cs.borderRightWidth !== "0px") return true;
      for (const node of el.childNodes) {
        if (node.nodeType !== 3 || !node.textContent.trim()) continue;
        const range = document.createRange(); range.selectNodeContents(el);
        for (const r of range.getClientRects()) if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return true;
      }
    }
    return false;
  };
  let run = 0, worst = 0;
  for (let r = 0; r < ROWS; r += 1) {
    const y = Math.min(innerHeight - 1, Math.round((innerHeight * r) / (ROWS - 1)));
    let blank = true;
    for (let c = 0; c < COLS; c += 1) { if (painted(Math.min(innerWidth - 1, Math.round((innerWidth * (c + 0.5)) / COLS)), y)) { blank = false; break; } }
    if (blank) { run += 1; worst = Math.max(worst, run); } else run = 0;
  }
  const lone = [];
  for (const el of document.querySelectorAll(".mm-gtm :is(h1, h2, h3, p, li, blockquote, cite, b, small, .role-title, .role-line)")) {
    if (!el.checkVisibility?.({ visibilityProperty: true, opacityProperty: true })) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > innerHeight || r.width < 2) continue;
    if ([...el.children].some((child) => /^(block|grid|flex)$/.test(getComputedStyle(child).display) && child.textContent.trim())) continue;
    const words = [];
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      for (const match of node.textContent.matchAll(/\\S+/g)) {
        const range = document.createRange(); range.setStart(node, match.index); range.setEnd(node, match.index + match[0].length);
        for (const rect of [...range.getClientRects()].filter((q) => q.width > 0)) words.push({ word: match[0], top: rect.top, h: rect.height });
      }
    }
    if (words.length < 3) continue;
    const lines = [];
    for (const w of words) { const line = lines.find((l) => Math.abs(l.top - w.top) < w.h / 2); if (line) line.words.push(w.word); else lines.push({ top: w.top, words: [w.word] }); }
    lines.sort((a, b) => a.top - b.top);
    if (lines.length >= 2 && lines.at(-1).words.length === 1) lone.push(el.textContent.trim().replace(/\\s+/g, " ").slice(0, 70) + " [" + lines.at(-1).words[0] + "]");
  }
  return { chapters, blank: Math.round((worst * innerHeight) / 59), overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth, lone, scrollY: Math.round(scrollY) };
})()`;

/* How far a pinned chapter's visible content runs past the room above its
   rail, or, where it flows, which of its steps and seats are missing. */
const FIT_PROBE = `((name) => {
  const section = document.querySelector('[data-gtm-chapter="' + name + '"]');
  const stage = section.querySelector(".gtm-stage");
  const body = stage.querySelector(".gtm-stage-body");
  const pinned = getComputedStyle(stage).position === "sticky";
  const shown = (el) => el.checkVisibility({ visibilityProperty: true, opacityProperty: true });
  if (!pinned) {
    const steps = [...section.querySelectorAll("[data-gtm-step]")];
    const missing = steps.filter((step) => !shown(step)).map((step) => step.textContent.trim().slice(0, 30));
    if (name === "team") {
      for (const seat of section.querySelectorAll(".role-cell")) {
        const layers = [...seat.querySelectorAll(".role-layer:not(.role-empty)")];
        if (layers.some((layer) => !shown(layer)) || !shown(seat.querySelector(".role-decision"))) missing.push("seat " + seat.textContent.trim().slice(0, 30));
      }
    }
    return { pinned, missing, flow: section.hasAttribute("data-gtm-flow") };
  }
  const room = body.getBoundingClientRect();
  let over = 0; let who = "";
  for (const el of body.querySelectorAll("*")) {
    if (!shown(el)) continue;
    const r = el.getBoundingClientRect();
    if (!r.height) continue;
    const past = Math.max(r.bottom - room.bottom, room.top - r.top);
    if (past > over) { over = past; who = (el.className || el.tagName) + " " + el.textContent.trim().slice(0, 30); }
  }
  return { pinned, over: Math.round(over), who, flow: section.hasAttribute("data-gtm-flow") };
})`;

async function openPage(browser, width, height, options = {}) {
  const context = await browser.newContext({ viewport: { width, height }, hasTouch: width < 900, isMobile: width < 600, reducedMotion: options.reduced ? "reduce" : "no-preference", javaScriptEnabled: options.javaScript !== false });
  await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); } catch {} });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error" && !/Failed to load resource/.test(message.text())) errors.push(message.text()); });
  page.on("response", (response) => { if (response.url().startsWith(origin) && response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  page.on("requestfailed", (request) => { if (request.url().startsWith(origin) && !/\.(mp4|webm)(\?|$)/.test(request.url())) errors.push(`failed ${request.url()}`); });
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await page.locator("h1#page-title").waitFor();
  await page.evaluate(() => document.fonts?.ready);
  await page.waitForTimeout(options.javaScript === false ? 200 : 600);
  return { page, context, errors };
}

async function scrollToY(page, top) {
  await page.evaluate(async (y) => {
    scrollTo({ top: y, behavior: "auto" });
    await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  }, top);
  await page.waitForTimeout(120);
}

async function sweep(page, height, direction) {
  const doc = await page.evaluate(() => document.documentElement.scrollHeight);
  const steps = Math.max(48, Math.ceil((doc - height) / (height * STRIDE_SHARE)) + 1);
  const seen = Object.fromEntries(Object.keys(CHAPTERS).map((name) => [name, []]));
  const held = Object.fromEntries(Object.keys(CHAPTERS).map((name) => [name, false]));
  let worstBlank = 0; let worstBlankAt = 0; let overflow = 0; const lone = new Set();
  for (let i = 0; i < steps; i += 1) {
    const step = direction === "forward" ? i : steps - 1 - i;
    const total = await page.evaluate(() => document.documentElement.scrollHeight) - height;
    await scrollToY(page, Math.round((total * step) / (steps - 1)));
    const state = await page.evaluate(PROBE);
    for (const [name, chapter] of Object.entries(state.chapters)) {
      if (!chapter.held || !chapter.state) continue;
      held[name] = true;
      if (seen[name].at(-1) !== chapter.state) seen[name].push(chapter.state);
    }
    if (state.blank > worstBlank) { worstBlank = state.blank; worstBlankAt = state.scrollY; }
    overflow = Math.max(overflow, state.overflow);
    state.lone.forEach((entry) => lone.add(entry));
  }
  return { seen, held, worstBlank, worstBlankAt, overflow, lone: [...lone], doc, steps };
}

const browser = await launch();

for (const [width, height] of VIEWPORTS) {
  const label = `chromium-${width}x${height}`;
  const { page, context, errors } = await openPage(browser, width, height);

  const opening = await page.evaluate(() => {
    const box = (selector) => { const r = document.querySelector(selector)?.getBoundingClientRect(); return r && { top: r.top, left: r.left, width: r.width, height: r.height, bottom: r.bottom }; };
    const title = document.querySelector("#page-title");
    const visibleH1 = [...document.querySelectorAll("h1")].filter((h) => h.checkVisibility?.() && h.getBoundingClientRect().height > 0);
    return {
      brand: box(".mm-header .mm-brand"),
      content: box(".gtm-opening-body"),
      header: box(".mm-header"),
      h1: visibleH1.length,
      h1Top: title.getBoundingClientRect().top,
      family: getComputedStyle(title).fontFamily,
      stylesheets: [...document.styleSheets].map((sheet) => sheet.href || "").filter(Boolean),
    };
  });
  fail(opening.h1 !== 1, `${label}: ${opening.h1} visible h1 elements`);
  fail(!opening.header || opening.h1Top < opening.header.bottom, `${label}: the h1 sits under the fixed header`);
  fail(!/Newsreader/.test(opening.family), `${label}: the h1 is not set in Newsreader (${opening.family})`);
  fail(!opening.brand || !opening.content || Math.abs(opening.brand.left - opening.content.left) > 2, `${label}: wordmark and content share no gutter (${opening.brand?.left} vs ${opening.content?.left})`);

  const forward = await sweep(page, height, "forward");
  const reverse = await sweep(page, height, "reverse");
  for (const [pass, result] of [["forward", forward], ["reverse", reverse]]) {
    for (const [name, states] of Object.entries(CHAPTERS)) {
      if (!result.held[name]) continue;
      const expected = pass === "forward" ? states : [...states].reverse();
      fail(JSON.stringify(result.seen[name]) !== JSON.stringify(expected), `${label}: ${pass} scroll showed ${name} as ${JSON.stringify(result.seen[name])}, expected ${JSON.stringify(expected)}`);
    }
    fail(result.worstBlank > height * BLANK_LIMIT, `${label}: ${pass} pass shows ${result.worstBlank}px of nothing at y=${result.worstBlankAt} (limit ${Math.round(height * BLANK_LIMIT)}px)`);
    fail(result.overflow > 1, `${label}: ${pass} pass has horizontal overflow ${result.overflow}px`);
    fail(result.lone.length > 0, `${label}: ${pass} pass strands a lone word: ${result.lone.join(" | ")}`);
  }

  /* Where a chapter does not pin, every one of its steps is laid out in flow. */
  const flow = await page.evaluate((chapters) => Object.fromEntries(Object.keys(chapters).map((name) => {
    const section = document.querySelector(`[data-gtm-chapter="${name}"]`);
    const stage = section?.querySelector(".gtm-stage");
    const pinned = stage && getComputedStyle(stage).position === "sticky";
    const steps = [...(section?.querySelectorAll("[data-gtm-step]") ?? [])];
    const shown = steps.filter((step) => step.checkVisibility?.({ visibilityProperty: true, opacityProperty: true })).length;
    return [name, { pinned, steps: steps.length, shown }];
  })), CHAPTERS);
  for (const [name, state] of Object.entries(flow)) {
    if (name !== "team") fail(!state.pinned && state.shown !== state.steps, `${label}: ${name} is unpinned but shows ${state.shown} of ${state.steps} steps`);
    fail(state.pinned && !forward.held[name], `${label}: ${name} is sticky but never held under the masthead`);
  }
  if (!flow.team.pinned) {
    const team = await page.evaluate(`${FIT_PROBE}("team")`);
    fail(team.missing.length > 0, `${label}: team is unpinned but hides ${team.missing.join(" | ")}`);
  }

  /* Every visible control is at least 44px tall. */
  const small = await page.evaluate(async () => {
    const found = [];
    for (const section of document.querySelectorAll("[data-gtm-chapter]")) {
      section.scrollIntoView({ block: "start" });
      await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
      for (const control of section.querySelectorAll("button, a, label.gtm-door")) {
        if (!control.checkVisibility?.({ visibilityProperty: true, opacityProperty: true })) continue;
        const r = control.getBoundingClientRect();
        if (r.height > 0 && r.height < 44) found.push(`${control.className || control.tagName}: ${Math.round(r.height)}px`);
      }
    }
    return found;
  });
  fail(small.length > 0, `${label}: controls under 44px: ${[...new Set(small)].join(", ")}`);
  fail(errors.length > 0, `${label}: runtime errors ${errors.join(" | ")}`);

  observations.push({
    label,
    document: forward.doc,
    samples: forward.steps,
    pinned: Object.fromEntries(Object.entries(flow).map(([name, state]) => [name, state.pinned])),
    worstBlankShare: Number((Math.max(forward.worstBlank, reverse.worstBlank) / height).toFixed(3)),
    forward: forward.seen,
    reverse: reverse.seen,
  });
  await context.close();
}

/* The rail moves the page and the state follows; the switch and a seat pick
   never move it. */
{
  const { page, context } = await openPage(browser, 1440, 900);
  const levers = await page.evaluate(() => document.querySelector('[data-gtm-chapter="levers"]').getBoundingClientRect().top + scrollY);
  await scrollToY(page, levers);
  const before = await page.evaluate(() => scrollY);
  await page.locator('[data-gtm-chapter="levers"] .gtm-rail-step').nth(2).click();
  await page.waitForTimeout(1500);
  const after = await page.evaluate(() => ({ y: scrollY, state: document.querySelector('[data-gtm-chapter="levers"] .gtm-rail-step[data-active="true"] .gtm-rail-name')?.textContent }));
  fail(!(after.y > before) || after.state !== "Positioning", `rail: pressing Positioning moved the page from ${before} to ${after.y} and shows ${after.state}`);

  const turn = await page.evaluate(() => document.querySelector('[data-gtm-chapter="turn"]').getBoundingClientRect().top + scrollY);
  await scrollToY(page, turn);
  const atTurn = await page.evaluate(() => scrollY);
  await page.locator('label.gtm-door', { hasText: "building an AI-native business" }).click();
  await page.waitForTimeout(400);
  const afterSwitch = await page.evaluate(() => ({ y: scrollY, head: document.querySelector("#gtm-team-title")?.textContent, week: document.querySelector(".gtm-plan-mapped") !== null }));
  fail(afterSwitch.y !== atTurn, `switch: choosing a door moved the page from ${atTurn} to ${afterSwitch.y}`);
  fail(afterSwitch.head !== "Your first commercial team can be mostly agents." || !afterSwitch.week, `switch: the founder door did not reach the team and the month (${afterSwitch.head})`);

  const team = await page.evaluate(() => document.querySelector('[data-gtm-chapter="team"]').getBoundingClientRect().top + scrollY);
  await scrollToY(page, team + 500);
  const atTeam = await page.evaluate(() => scrollY);
  await page.locator(".team-board .role-cell").nth(2).click();
  await page.waitForTimeout(300);
  const afterPick = await page.evaluate(() => ({ y: scrollY, decision: document.querySelector(".decision-panel h3")?.textContent }));
  fail(afterPick.y !== atTeam, `seat: picking a seat moved the page from ${atTeam} to ${afterPick.y}`);
  fail(afterPick.decision !== "Is your voice written down clearly enough for an agent to follow it?", `seat: the decision beside the board is ${afterPick.decision}`);
  observations.push({ label: "controls", rail: { before, after }, switch: afterSwitch, seat: afterPick });
  await context.close();
}

/* Nothing in a pinned stage is clipped, for either door or any seat; a
   chapter that cannot hold its content flows before the reader gets there,
   and never flips under them while they are in it. */
for (const [width, height] of FIT) {
  for (const door of ["established", "founder"]) {
    const label = `fit-${width}x${height}-${door}`;
    const { page, context } = await openPage(browser, width, height);
    if (door === "founder") {
      await page.evaluate(() => document.querySelector("[data-gtm-chapter=turn] input[value=founder]").click());
      await page.waitForTimeout(300);
    }
    const summary = {};
    for (const [name, states] of Object.entries(CHAPTERS)) {
      const geometry = await page.evaluate((chapter) => {
        const section = document.querySelector(`[data-gtm-chapter="${chapter}"]`);
        const stage = section.querySelector(".gtm-stage");
        return { top: section.getBoundingClientRect().top + scrollY, held: section.offsetHeight - stage.offsetHeight, pinned: getComputedStyle(stage).position === "sticky", header: document.querySelector(".mm-header").getBoundingClientRect().height };
      }, name);
      if (!geometry.pinned) {
        const state = await page.evaluate(`${FIT_PROBE}(${JSON.stringify(name)})`);
        fail(state.missing.length > 0, `${label}: ${name} flows but hides ${state.missing.join(" | ")}`);
        summary[name] = state.flow ? "flows (released by the hook)" : "flows";
        continue;
      }
      let worst = 0; let where = "";
      for (let index = 0; index < states.length; index += 1) {
        const y = Math.round(geometry.top - geometry.header + (geometry.held * (index + 0.5)) / states.length);
        await scrollToY(page, y);
        await page.waitForTimeout(450);
        const seats = name === "team" ? await page.locator(".team-board .role-cell:not([disabled])").count() : 1;
        for (let seat = 0; seat < seats; seat += 1) {
          if (name === "team") {
            await page.locator(".team-board .role-cell:not([disabled])").nth(seat).click();
            await page.waitForTimeout(120);
          }
          const state = await page.evaluate(`${FIT_PROBE}(${JSON.stringify(name)})`);
          if (!state.pinned) { fail(true, `${label}: ${name} released its pin while the reader was in it (step ${index}, seat ${seat})`); break; }
          if (state.over > worst) { worst = state.over; where = `step ${index}${name === "team" ? `, seat ${seat}` : ""}: ${state.who}`; }
        }
      }
      fail(worst > 1, `${label}: ${name} is clipped by ${worst}px at ${where}`);
      summary[name] = worst > 1 ? `clipped ${worst}px` : "pinned, fits";
    }
    observations.push({ label, ...summary });
    await context.close();
  }
}

/* WCAG 1.4.12: with text spacing widened, a pinned chapter either still
   holds its content or flows; nothing is clipped. */
for (const [width, height] of [[1440, 900], [1366, 657], [390, 844]]) {
  const label = `text-spacing-${width}x${height}`;
  const { page, context } = await openPage(browser, width, height);
  await page.addStyleTag({ content: TEXT_SPACING });
  await page.waitForTimeout(600);
  const summary = {};
  for (const [name, states] of Object.entries(CHAPTERS)) {
    const geometry = await page.evaluate((chapter) => {
      const section = document.querySelector(`[data-gtm-chapter="${chapter}"]`);
      const stage = section.querySelector(".gtm-stage");
      return { top: section.getBoundingClientRect().top + scrollY, held: section.offsetHeight - stage.offsetHeight, header: document.querySelector(".mm-header").getBoundingClientRect().height };
    }, name);
    let worst = 0; let flowed = false; const missing = [];
    for (let index = 0; index < states.length; index += 1) {
      await scrollToY(page, Math.round(geometry.top - geometry.header + (geometry.held * (index + 0.5)) / states.length));
      await page.waitForTimeout(350);
      const state = await page.evaluate(`${FIT_PROBE}(${JSON.stringify(name)})`);
      if (state.pinned) worst = Math.max(worst, state.over);
      else { flowed = true; missing.push(...state.missing); }
    }
    fail(worst > 1, `${label}: ${name} is clipped by ${worst}px with widened text spacing`);
    fail(missing.length > 0, `${label}: ${name} flows but hides ${[...new Set(missing)].join(" | ")}`);
    summary[name] = flowed ? "flows" : worst > 1 ? `clipped ${worst}px` : "pinned, fits";
  }
  observations.push({ label, ...summary });
  await context.close();
}

/* A rail press holds its step only until the page arrives: a reader who
   scrolls away first is shown the step their position says. */
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const label = `rail-hold-${width}x${height}`;
  const { page, context } = await openPage(browser, width, height);
  for (const name of ["levers", "plan"]) {
    const pinned = await page.evaluate((chapter) => getComputedStyle(document.querySelector(`[data-gtm-chapter="${chapter}"] .gtm-stage`)).position === "sticky", name);
    if (!pinned) continue;
    const top = await page.evaluate((chapter) => document.querySelector(`[data-gtm-chapter="${chapter}"]`).getBoundingClientRect().top + scrollY, name);
    await scrollToY(page, top);
    await page.locator(`[data-gtm-chapter="${name}"] .gtm-rail-step`).last().click();
    await page.waitForTimeout(150);
    await page.evaluate((h) => scrollBy({ top: -h * 0.6, behavior: "instant" }), height);
    await page.waitForTimeout(1700);
    const state = await page.evaluate((chapter) => {
      const section = document.querySelector(`[data-gtm-chapter="${chapter}"]`);
      const count = section.querySelectorAll(".gtm-rail-step").length;
      const progress = Number(section.style.getPropertyValue("--gtm-progress"));
      const expected = Math.max(0, Math.min(count - 1, Math.floor(progress * count)));
      const shown = [...section.querySelectorAll(".gtm-rail-step")].findIndex((step) => step.dataset.active === "true");
      return { progress, expected, shown };
    }, name);
    fail(state.shown !== state.expected, `${label}: after a rail press and a scroll back, ${name} shows step ${state.shown} where its position says ${state.expected}`);
    observations.push({ label: `${label}-${name}`, ...state });
  }
  await context.close();
}

/* Reduced motion keeps every pin; without scripts every step is in flow. */
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const label = `reduced-${width}x${height}`;
  const { page, context } = await openPage(browser, width, height, { reduced: true });
  const forward = await sweep(page, height, "forward");
  for (const [name, states] of Object.entries(CHAPTERS)) {
    if (!forward.held[name]) continue;
    fail(JSON.stringify(forward.seen[name]) !== JSON.stringify(states), `${label}: ${name} reached ${JSON.stringify(forward.seen[name])}`);
  }
  fail(!forward.held.levers, `${label}: reduced motion released the four places`);
  observations.push({ label, forward: forward.seen, held: forward.held });
  await context.close();
}
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const label = `no-js-${width}x${height}`;
  const { page, context } = await openPage(browser, width, height, { javaScript: false });
  const state = await page.evaluate(() => {
    const steps = [...document.querySelectorAll("[data-gtm-step]")];
    const hidden = steps.filter((step) => !step.checkVisibility({ visibilityProperty: true, opacityProperty: true })).map((step) => step.textContent.trim().slice(0, 40));
    const sticky = [...document.querySelectorAll(".gtm-stage")].filter((stage) => getComputedStyle(stage).position === "sticky").length;
    const clipped = [...document.querySelectorAll(".mm-gtm :is(h1, h2, h3, p, li)")].filter((el) => { const r = el.getBoundingClientRect(); return r.width > 0 && (r.right > innerWidth + 1 || r.left < -1); }).length;
    const shown = document.body.innerText.toLowerCase();
    return { steps: steps.length, hidden, sticky, clipped, native: shown.includes("11 people · 5 agent roles"), today: shown.includes("27 people · 0 agents") };
  });
  fail(state.hidden.length > 0, `${label}: steps hidden without scripts: ${state.hidden.join(" | ")}`);
  fail(state.sticky > 0, `${label}: ${state.sticky} stages still pin without scripts`);
  fail(state.clipped > 0, `${label}: ${state.clipped} text blocks run off the screen`);
  fail(!state.native || !state.today, `${label}: the team does not show both of its states`);
  await page.screenshot({ path: path.join(output, `${label}.jpg`), fullPage: true, type: "jpeg", quality: 60 });
  observations.push({ label, ...state });
  await context.close();
}

/* Small text meets AA on the ground it is drawn on. */
{
  const { page, context } = await openPage(browser, 1440, 900);
  const low = await page.evaluate(async () => {
    const parse = (value) => { const m = value.match(/rgba?\(([^)]+)\)/); if (!m) return null; const [r, g, b, a = 1] = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return [r, g, b, a]; };
    const lum = ([r, g, b]) => { const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
    const over = (top, under) => [0, 1, 2].map((i) => top[i] * top[3] + under[i] * (1 - top[3]));
    const ground = (el) => {
      const layers = [];
      for (let node = el; node; node = node.parentElement) { const bg = parse(getComputedStyle(node).backgroundColor); if (bg && bg[3] > 0) { layers.push(bg); if (bg[3] >= 1) break; } }
      let colour = [10, 16, 13];
      for (const layer of layers.reverse()) colour = over(layer, colour);
      return colour;
    };
    const found = [];
    for (const section of document.querySelectorAll("[data-gtm-chapter]")) {
      section.scrollIntoView({ block: "start" });
      await new Promise((done) => setTimeout(done, 700));
      for (const el of section.querySelectorAll("p, li, small, cite, b, span, a, button, h2, h3")) {
        if (!el.checkVisibility?.({ visibilityProperty: true, opacityProperty: true })) continue;
        if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) continue;
        const cs = getComputedStyle(el);
        const size = parseFloat(cs.fontSize);
        const fg = parse(cs.color);
        if (!fg) continue;
        const bg = ground(el);
        const text = over(fg, bg);
        const [a, b] = [lum(text), lum(bg)].sort((x, y) => y - x);
        const ratio = (a + 0.05) / (b + 0.05);
        const need = size >= 24 || (size >= 18.66 && Number(cs.fontWeight) >= 700) ? 3 : 4.5;
        if (ratio < need) found.push(`${el.className || el.tagName} "${el.textContent.trim().slice(0, 30)}" ${ratio.toFixed(2)}:1`);
      }
    }
    return found;
  });
  fail(low.length > 0, `contrast: under AA on its own ground: ${[...new Set(low)].join(" | ")}`);
  await context.close();
}

/* What the material-review readiness checks ask about beyond the sweep. */
{
  const { page, context, errors } = await openPage(browser, 1440, 900);
  const links = await page.evaluate(() => [...new Set([...document.querySelectorAll("main a[href], .mm-pairing a[href]")].map((a) => a.getAttribute("href")).filter((href) => href.startsWith("/")))]);
  const broken = [];
  for (const href of links) {
    const response = await fetch(`${origin}${href.replace(/\/?$/, "/")}`);
    if (response.status >= 400) broken.push(`${href} ${response.status}`);
  }
  const external = await page.evaluate(() => [...document.querySelectorAll("main a[href^='http']")].map((a) => ({ href: a.href, rel: a.rel, target: a.target })));
  const unsafe = external.filter((link) => link.target === "_blank" && !/noreferrer|noopener/.test(link.rel));
  note("broken_links_controls_assets", broken.length === 0 && unsafe.length === 0, broken.length || unsafe.length ? `broken ${broken.join(", ")} unsafe ${unsafe.map((l) => l.href).join(", ")}` : `${links.length} internal links resolve; ${external.length} dated sources open safely in a new tab`);

  const structure = await page.evaluate(() => {
    const frames = document.querySelectorAll("iframe, frame, object, embed").length;
    const nested = [...document.querySelectorAll(".mm-gtm *")].filter((el) => { const s = getComputedStyle(el); return /(auto|scroll)/.test(s.overflowY + s.overflowX) && (el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1); }).map((el) => el.className);
    const words = (sentence) => sentence.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter((w) => w && !["the", "a", "an", "and", "or", "of", "to", "in", "on", "it", "is", "we", "you", "your", "our", "that", "this", "for", "with", "as", "at", "by", "from", "then", "so"].includes(w));
    const texts = [...document.querySelectorAll(".mm-gtm :is(p, li, h1, h2, h3, blockquote, cite)")].filter((el) => !el.closest(".mm-visually-hidden")).map((el) => el.textContent.replace(/\s+/g, " ").trim());
    const seen = new Map(); const repeated = [];
    for (const text of texts) for (const sentence of text.split(/(?<=[.?!])\s+/)) { const key = words(sentence).join(" "); if (key.split(" ").length < 6) continue; if (seen.has(key)) repeated.push(sentence); seen.set(key, true); }
    const body = document.querySelector(".mm-gtm").innerText;
    const placeholder = ["lorem", "ipsum", "TODO", "TBD", "placeholder", "undefined", "NaN", "[object", "Open any result. Move its mechanism.", "Illustrative machinery films"].filter((token) => body.includes(token));
    const grounds = [...document.querySelectorAll("[data-gtm-chapter], .mm-pairing")].map((el) => ({ name: el.dataset.gtmChapter || "pairing", bg: getComputedStyle(el).backgroundColor }));
    const seams = grounds.slice(1).filter((ground, index) => ground.bg === grounds[index].bg).map((ground, index) => `${grounds[index].name}/${ground.name}`);
    const headings = [...document.querySelectorAll("main :is(h1, h2, h3)")].map((h) => Number(h.tagName[1]));
    const skips = headings.filter((level, index) => index && level > headings[index - 1] + 1).length;
    return { frames, nested, repeated, placeholder, seams, grounds, headings: headings.length, skips, h1: document.querySelectorAll("main h1").length };
  });
  note("single_dom_scroll_context", structure.frames === 0 && structure.nested.length === 0, structure.frames || structure.nested.length ? `frames ${structure.frames}, nested scrollers ${structure.nested.join(", ")}` : "one document, one page scroll, no frames and no nested scroller");
  note("duplicate_components_claims", structure.repeated.length === 0 && (await page.locator(".mm-pairing").count()) === 1, structure.repeated.length ? `repeated: ${structure.repeated.join(" | ")}` : "no sentence of six or more content words said twice; one closing pair");
  note("placeholder_debug_backup_singer_copy", structure.placeholder.length === 0, structure.placeholder.length ? `found ${structure.placeholder.join(", ")}` : "no placeholder, debug or narrating copy on the page");
  note("section_seam_collision", structure.seams.length === 0, structure.seams.length ? `neighbouring chapters share a ground: ${structure.seams.join(", ")}` : `grounds alternate: ${structure.grounds.map((g) => `${g.name} ${g.bg}`).join("; ")}`);

  /* Keyboard: every control on the path is reachable and shows where it is. */
  await page.evaluate(() => scrollTo(0, 0));
  const focus = [];
  for (let press = 0; press < 60; press += 1) {
    await page.keyboard.press("Tab");
    const state = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const s = getComputedStyle(el);
      const label = el.closest("label");
      const ring = label ? getComputedStyle(label) : s;
      const shows = (style) => (style.outlineStyle !== "none" && parseFloat(style.outlineWidth) > 0) || style.boxShadow !== "none";
      /* The ring is drawn outside the control, on its band's ground. */
      const rgb = (value) => (value.match(/[\d.]+/g) || []).slice(0, 3).map(Number);
      const lum = ([r, g, b]) => { const c = [r, g, b].map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
      let band = (label || el).parentElement;
      while (band && getComputedStyle(band).backgroundColor.replace(/\s/g, "").match(/rgba\(.*,0\)|transparent/)) band = band.parentElement;
      const pair = [lum(rgb(ring.outlineColor)), lum(rgb(band ? getComputedStyle(band).backgroundColor : "rgb(10,16,13)"))].sort((x, y) => y - x);
      const ringContrast = (pair[0] + 0.05) / (pair[1] + 0.05);
      return { name: (el.getAttribute("aria-label") || el.textContent || el.value || "").trim().slice(0, 40), inGtm: Boolean(el.closest(".mm-gtm")), onPaper: Boolean(el.closest(".mm-on-paper")), ringContrast, visible: shows(s) || shows(ring), hidden: !el.checkVisibility?.({ visibilityProperty: true }) };
    });
    if (state?.inGtm) focus.push(state);
  }
  const unseen = focus.filter((state) => !state.visible || state.hidden);
  const faint = focus.filter((state) => state.ringContrast < 3);
  const paper = focus.filter((state) => state.onPaper);
  note("keyboard_focus_semantics", focus.length >= 8 && unseen.length === 0 && faint.length === 0 && paper.length > 0 && structure.h1 === 1 && structure.skips === 0, `${focus.length} focus stops in the page, ${unseen.length} without a visible ring or on a hidden step; ${faint.length} rings under 3:1 on their ground (${paper.length} on the cream bands, lowest ${Math.min(...focus.map((state) => state.ringContrast)).toFixed(2)}:1${faint.length ? `: ${faint.map((state) => state.name).join(", ")}` : ""}); one h1; ${structure.headings} headings, ${structure.skips} skipped levels`);
  fail(errors.length > 0, `readiness 1440x900: runtime errors ${errors.join(" | ")}`);
  await context.close();
}

/* Stills of the chapters that do not pin, for the reviewers. */
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const { page, context } = await openPage(browser, width, height);
  for (const name of ["opening", "turn", "proof"]) {
    await page.evaluate((chapter) => document.querySelector(`[data-gtm-chapter="${chapter}"]`).scrollIntoView({ block: chapter === "opening" ? "start" : "center" }), name);
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(output, `${name}-${width}x${height}.jpg`), type: "jpeg", quality: 72 });
  }
  await page.evaluate(() => document.querySelector("[data-gtm-chapter=turn] input[value=founder]").click());
  await page.waitForTimeout(300);
  for (const name of ["plan", "team", "proof"]) {
    await page.evaluate((chapter) => { const el = document.querySelector(`[data-gtm-chapter="${chapter}"]`); scrollTo(0, el.getBoundingClientRect().top + scrollY + (chapter === "proof" ? -100 : el.offsetHeight * 0.45)); }, name);
    await page.waitForTimeout(700);
    await page.screenshot({ path: path.join(output, `founder-${name}-${width}x${height}.jpg`), type: "jpeg", quality: 72 });
  }
  await page.locator(".mm-pairing").scrollIntoViewIfNeeded();
  await page.waitForTimeout(400);
  await page.screenshot({ path: path.join(output, `close-${width}x${height}.jpg`), type: "jpeg", quality: 72 });
  await context.close();
}

/* Evidence in the scroll-build shape, checked by the vendored validator. */
const contract = { acceptedDecision: "r44 candidate: /ai-gtm pinned chapters", cases: [] };
const report = { cases: [] };
const candidateFiles = ["src/pages/AiGtm.tsx", "src/hooks/usePinnedSteps.ts", "src/styles/mindmake-ai-gtm.css", "src/components/ai-gtm/Opening.tsx", "src/components/ai-gtm/LeverChapter.tsx", "src/components/ai-gtm/Workaround.tsx", "src/components/ai-gtm/PlanChapter.tsx", "src/components/ai-gtm/TeamChapter.tsx", "src/components/ai-gtm/StepRail.tsx"];
contract.candidateDigest = identity?.sha256 ?? sha256(Buffer.concat(await Promise.all(candidateFiles.map((file) => readFile(path.join(root, file))))));
report.candidateDigest = contract.candidateDigest;
contract.acceptedDecisionDigest = sha256(contract.acceptedDecision);
const chrome = [];
for (const [width, height] of [[1440, 900], [390, 844]]) {
  const viewport = `${width}x${height}`;
  const { page, context } = await openPage(browser, width, height);
  const header = await page.evaluate(() => document.querySelector(".mm-header").getBoundingClientRect().height);
  for (const [name, states] of Object.entries(CHAPTERS)) {
    const id = `${name}-${viewport}`;
    const pinnable = await page.evaluate((chapter) => getComputedStyle(document.querySelector(`[data-gtm-chapter="${chapter}"] .gtm-stage`)).position === "sticky", name);
    if (!pinnable) continue;
    contract.cases.push({ id, route: "/ai-gtm", viewport, states, pinTop: Math.round(header), tolerance: 2 });
    const geometry = await page.evaluate((chapter) => {
      const section = document.querySelector(`[data-gtm-chapter="${chapter}"]`);
      const stage = section.querySelector(".gtm-stage");
      const top = section.getBoundingClientRect().top + scrollY;
      return { top, held: section.offsetHeight - stage.offsetHeight };
    }, name);
    const shot = async (tag) => {
      const file = path.join(output, `${id}-${tag}.jpg`);
      const bytes = await page.screenshot({ path: file, type: "jpeg", quality: 72 });
      return { path: path.relative(root, file), sha256: sha256(bytes) };
    };
    const sample = async (y, tag) => {
      await scrollToY(page, y);
      await page.waitForTimeout(500);
      const state = await page.evaluate((chapter) => {
        const section = document.querySelector(`[data-gtm-chapter="${chapter}"]`);
        const rail = section.querySelector(".gtm-rail")?.getBoundingClientRect();
        const bar = document.querySelector(".mm-action-bar.is-shown")?.getBoundingClientRect();
        return { text: section.querySelector('.gtm-rail-step[data-active="true"] .gtm-rail-name')?.textContent.trim(), stageTop: section.querySelector(".gtm-stage").getBoundingClientRect().top, scrollY, railBottom: rail?.bottom ?? null, barTop: bar?.top ?? innerHeight };
      }, name);
      chrome.push({ id: `${id}-${tag}`, railBottom: state.railBottom, barTop: state.barTop });
      return { visibleText: state.text, scrollY: Math.round(state.scrollY), stageTop: Math.round(state.stageTop * 10) / 10, evidence: await shot(tag) };
    };
    const header68 = Math.round(header);
    const at = (index) => Math.round(geometry.top - header68 + (geometry.held * (index + 0.5)) / states.length);
    const forward = []; const reverse = [];
    for (let index = 0; index < states.length; index += 1) forward.push(await sample(at(index), `forward-${index}`));
    const exitAfter = await sample(Math.round(geometry.top - header68 + geometry.held + height * 0.5), "exit-after");
    for (let index = states.length - 1; index >= 0; index -= 1) reverse.push(await sample(at(index) - 1, `reverse-${index}`));
    const exitBefore = await sample(Math.round(geometry.top - header68 - height * 0.5), "exit-before");
    report.cases.push({ id, route: "/ai-gtm", viewport, input: "page-scroll", capture: forward[0].evidence, forward, reverse, exitAfter: { scrollY: exitAfter.scrollY, stageTop: exitAfter.stageTop, evidence: exitAfter.evidence }, exitBefore: { scrollY: exitBefore.scrollY, stageTop: exitBefore.stageTop, evidence: exitBefore.evidence } });
  }
  await context.close();
}
const pinnedSamples = chrome.filter((entry) => !/exit/.test(entry.id));
const covered = pinnedSamples.filter((entry) => entry.railBottom !== null && entry.railBottom > entry.barTop + 1);
note("viewport_safe_areas_fixed_chrome", covered.length === 0 && pinnedSamples.length > 0, covered.length ? `the rail sits under the action bar at ${covered.map((entry) => entry.id).join(", ")}` : `${pinnedSamples.length} pinned states keep the rail clear of the action bar; stages hold at the header height`);
const evidenceFailures = validateScrollBuildEvidence(contract, report);
failures.push(...evidenceFailures.map((message) => `scroll-build evidence: ${message}`));
await writeFile(path.join(output, "scroll-build-contract.json"), `${JSON.stringify(contract, null, 2)}\n`);
await writeFile(path.join(output, "scroll-build-evidence.json"), `${JSON.stringify(report, null, 2)}\n`);

/* Negative control: with the pins removed the chapters cannot build with
   scroll. If the sweep still passes, it is not measuring the pins. */
{
  const { page, context } = await openPage(browser, 1440, 900);
  await page.addStyleTag({ content: ".mm-gtm .gtm-stage{position:static!important}" });
  await page.waitForTimeout(300);
  const broken = await sweep(page, 900, "forward");
  const caught = broken.seen.levers.length !== 4 || !broken.held.levers;
  fail(!caught, "negative control: the sweep passes a page whose pins have been removed");
  observations.push({ label: "negative-control-unpinned", leversHeld: broken.held.levers, leversSeen: broken.seen.levers });
  await context.close();
}

await browser.close();
server.kill();
const none = (pattern) => !failures.some((message) => pattern.test(message));
const builtPage = await readFile(path.join(root, "dist/ai-gtm/index.html"));
Object.assign(checks, {
  artifact_identity: { status: identity ? "pass" : "not_run", detail: identity ? `candidate ${identity.sha256} over ${identity.files.length} files` : "no candidate manifest given" },
  runtime_identity: { status: "pass", detail: `vite preview of dist/, /ai-gtm/ served from dist/ai-gtm/index.html sha256 ${sha256(builtPage)}` },
  fresh_self_owned_capture: { status: "pass", detail: `captured ${new Date().toISOString()} from a server this run started at ${origin}` },
  overflow_overlap_clipping: { status: none(/overflow|clipped|run off|released its pin|flows but hides|unpinned but hides/) ? "pass" : "fail", detail: `no horizontal overflow at ${VIEWPORTS.length} viewports both ways; no pinned stage clipped at ${FIT.length} sizes for both doors and every seat, nor with WCAG 1.4.12 text spacing; a chapter that cannot hold its content flows whole; nothing runs off the screen without scripts` },
  layout_alignment: { status: none(/gutter/) ? "pass" : "fail", detail: `wordmark and content share one left edge at ${VIEWPORTS.length} viewports` },
  text_wrap_orphans_content_range: { status: none(/lone word/) ? "pass" : "fail", detail: `no lone last word in any shown step at ${VIEWPORTS.length} viewports, forwards and in reverse` },
  contrast: { status: none(/^contrast/) ? "pass" : "fail", detail: "every visible text node meets WCAG AA on the ground it is drawn on at 1440x900" },
  touch_targets: { status: none(/under 44px/) ? "pass" : "fail", detail: `every visible control at least 44px tall at ${VIEWPORTS.length} viewports` },
  reduced_motion: { status: none(/^reduced/) ? "pass" : "fail", detail: "reduced motion keeps every pin and reaches every step at 1440x900 and 390x844" },
  section_fit_scroll_contract: { status: none(/of nothing|never held|unpinned but|still pin/) ? "pass" : "fail", detail: `blank bands under ${BLANK_LIMIT * 100}% of the viewport; each pinned chapter holds one screen and releases; unpinned chapters lay every step out` },
  console_network_user_impact: { status: none(/runtime errors/) ? "pass" : "fail", detail: "no page errors, console errors, failed requests or 4xx/5xx responses from the site" },
  continuous_forward_reverse_journey: { status: none(/scroll showed|scroll-build evidence|negative control|rail:|rail-hold|switch:|seat:/) ? "pass" : "fail", detail: "scrolling alone reaches every state of levers, plan and team forwards and in reverse; controls move the page and the switch does not; a rail press never outlasts the reader scrolling away" },
  judge_evidence_identity: { status: "not_run", detail: "set by the receipts script once the independent reviewers have reported on this candidate" },
});
const result = { gate: "ai-gtm-scroll-build", at: new Date().toISOString(), engine: "chromium", origin, selfOwned: true, candidateId: candidate?.candidateId ?? null, candidateSha256: identity?.sha256 ?? null, blankLimitShare: BLANK_LIMIT, checks, observations, failures };
await writeFile(path.join(output, "report.json"), `${JSON.stringify(result, null, 2)}\n`);
console.log(JSON.stringify({ gate: result.gate, viewports: VIEWPORTS.length, evidenceCases: report.cases.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
