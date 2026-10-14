#!/usr/bin/env node
/**
 * Review readiness for a material candidate that lives on the built site
 * rather than in a prototype folder (for example a homepage chapter that
 * `/` and `/new-age-leadership` share).
 *
 * The presentation firewall (`material-review-firewall-lib.mjs`) refuses to
 * serve a candidate until three receipts are bound to its exact bytes:
 * readiness, continuity and specialist. This script produces the first two
 * from observation, and the third from the judge panel's own verdict files,
 * so nothing reaches Krish on a model's say-so.
 *
 *   node scripts/qa/material-candidate-readiness.mjs probe <manifest>
 *     Builds the site, runs the repository checks the manifest names, then
 *     serves dist/ on a self-owned local port and walks every declared route
 *     and viewport: forward and reverse through every scroll-driven section,
 *     pin geometry, contrast against the brightest pixel behind each line,
 *     keyboard, touch targets, short screens, reduced motion, seams,
 *     console and network. Writes browser-report.json and screenshots.
 *
 *   node scripts/qa/material-candidate-readiness.mjs specialist <manifest> <panel.json>
 *     Writes one juror file per judge and the specialist receipt. A judge
 *     that vetoed, or a verdict bound to other bytes, fails the receipt.
 *
 *   node scripts/qa/material-candidate-readiness.mjs receipts <manifest>
 *     Writes the readiness and continuity receipts from the browser report,
 *     the command logs and the specialist receipt.
 *
 * Every artefact is bound to the candidate digest the firewall computes. A
 * failed or missing observation is written as failed; nothing is relabelled.
 */
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import { mkdir, readFile, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import sharp from "sharp";
import { computeCandidateIdentity, sha256 } from "./material-review-firewall-lib.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const [mode, manifestArg, extra] = process.argv.slice(2);
if (!["probe", "specialist", "receipts", "selftest"].includes(mode) || !manifestArg) {
  console.error("usage: material-candidate-readiness.mjs probe|selftest|specialist|receipts <manifest> [panel.json]");
  process.exit(2);
}
const manifest = JSON.parse(await readFile(path.resolve(root, manifestArg), "utf8"));
const identity = await computeCandidateIdentity(root, manifest);
let outDir = path.resolve(root, "artifacts/material-review", manifest.candidateId);
const rel = (absolute) => path.relative(root, absolute).replaceAll("\\", "/");
const fileEvidence = async (absolute) => ({ path: rel(absolute), sha256: sha256(await readFile(absolute)) });
const WEEK = 7 * 24 * 60 * 60 * 1000;

/* Negative controls: `selftest` plants a known defect and requires the probe
   to report it. A probe that passes a planted defect is not evidence. */
const NEGATIVES = {
  contrast: { css: "[data-benefit].is-active h2, [data-benefit].is-active p { color: rgba(240, 232, 214, 0.22) !important; }", expect: /contrast/ },
  controls: { css: "[data-benefit-next], [data-benefit-prev] { display: none !important; }", expect: /controls not in view|touch target/ },
  overflow: { css: "[data-benefit].is-active h2 { margin-left: 70vw !important; white-space: nowrap !important; }", expect: /overflow/ },
};
const NEGATIVE = process.env.MM_READINESS_NEGATIVE ?? "";
const NEGATIVE_CSS = NEGATIVES[NEGATIVE]?.css ?? "";

function run(command, logPath) {
  return new Promise((resolve) => {
    const child = spawn(command, { cwd: root, shell: true, env: { ...process.env, FORCE_COLOR: "0" } });
    const chunks = [];
    child.stdout.on("data", (d) => chunks.push(d));
    child.stderr.on("data", (d) => chunks.push(d));
    child.on("exit", async (code) => {
      const text = `$ ${command}\n${Buffer.concat(chunks).toString("utf8")}\n[exit ${code}]\n`;
      await writeFile(logPath, text, "utf8");
      resolve(code ?? 1);
    });
  });
}

const freePort = () => new Promise((resolve, reject) => {
  const probe = createServer();
  probe.once("error", reject);
  probe.listen(0, "127.0.0.1", () => { const { port } = probe.address(); probe.close(() => resolve(port)); });
});

/* WCAG relative luminance and contrast. */
const lin = (c) => { const s = c / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; };
const lum = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };
const blend = ([r, g, b, a], bg) => [r * a + bg[0] * (1 - a), g * a + bg[1] * (1 - a), b * a + bg[2] * (1 - a)];

async function probe() {
  const p = NEGATIVE ? { ...manifest.probe, commands: [], routes: manifest.probe.routes.slice(0, 1), viewports: manifest.probe.viewports, shortViewports: manifest.probe.shortViewports.slice(0, 1) } : manifest.probe;
  if (NEGATIVE) outDir = path.resolve(root, "artifacts/material-review", manifest.candidateId, `selftest-${NEGATIVE}`);
  await rm(outDir, { recursive: true, force: true });
  await mkdir(path.resolve(outDir, "logs"), { recursive: true });
  await mkdir(path.resolve(outDir, "screenshots"), { recursive: true });

  const commands = [];
  for (const command of p.commands) {
    const logPath = path.resolve(outDir, "logs", `${command.id}.log`);
    const started = Date.now();
    const code = await run(command.run, logPath);
    commands.push({ id: command.id, run: command.run, exit: code, seconds: Math.round((Date.now() - started) / 1000), log: rel(logPath) });
    console.log(`${command.id}: exit ${code}`);
    if (command.id === "build" && code !== 0) break;
  }

  const port = await freePort();
  const origin = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [path.resolve(root, "scripts/qa/serve-dist.mjs"), String(port)], { cwd: root, stdio: "ignore" });
  await new Promise((r) => setTimeout(r, 900));
  const distIndex = await readFile(path.resolve(root, "dist/index.html"));
  const browser = await chromium.launch();
  const results = { candidateId: manifest.candidateId, candidateSha256: identity.sha256, capturedAt: new Date().toISOString(), origin, distIndexSha256: sha256(distIndex), commands, journeys: [], shortScreens: [], reduced: [], keyboard: [], failures: [] };
  const fail = (where, message) => results.failures.push({ where, message });

  const open = async (viewport, extraContext = {}) => {
    const context = await browser.newContext({ viewport: { width: viewport.w, height: viewport.h }, isMobile: Boolean(viewport.mobile), hasTouch: Boolean(viewport.mobile), deviceScaleFactor: 1, ...extraContext });
    await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); localStorage.setItem("mm-cookie-consent", "declined"); } catch {} });
    if (NEGATIVE_CSS) await context.addInitScript((css) => { addEventListener("DOMContentLoaded", () => { const style = document.createElement("style"); style.textContent = css; document.head.append(style); }); }, NEGATIVE_CSS);
    const page = await context.newPage();
    const issues = [];
    page.on("console", (m) => { if (m.type() === "error") issues.push(`console: ${m.text()}`); });
    page.on("pageerror", (e) => issues.push(`pageerror: ${e.message}`));
    page.on("requestfailed", (r) => { if (r.url().startsWith(origin) && !/\.mp4(\?|$)/.test(r.url())) issues.push(`requestfailed: ${r.url()} ${r.failure()?.errorText}`); });
    page.on("response", (r) => { if (r.url().startsWith(origin) && r.status() >= 400) issues.push(`http ${r.status()}: ${r.url()}`); });
    return { context, page, issues };
  };
  const settle = (page) => page.evaluate(() => document.fonts.ready.then(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)))));
  /* Where the story frame pins: its own sticky top, which the stylesheet sets
     from the masthead height on each page. */
  const headerBottom = (page) => page.evaluate((sel) => { const f = document.querySelector(sel); return f ? Math.round(parseFloat(getComputedStyle(f).top) || 0) : 0; }, p.sections.find((s) => s.frame)?.frame);

  for (const route of p.routes) for (const viewport of p.viewports) {
    const where = `${route.name}@${viewport.name}`;
    const { context, page, issues } = await open(viewport);
    await page.goto(origin + route.path, { waitUntil: "networkidle" });
    await settle(page);
    const top = await headerBottom(page);
    const meta = await page.evaluate(({ sections }) => ({
      height: document.documentElement.scrollHeight,
      iframes: document.querySelectorAll("iframe").length,
      scroller: document.scrollingElement === document.documentElement,
      nested: [...document.querySelectorAll("main *")].filter((el) => { const s = getComputedStyle(el); return /(auto|scroll)/.test(s.overflowY) && el.scrollHeight > el.clientHeight + 2 && el.clientHeight > innerHeight * 0.5; }).length,
      placeholder: /lorem ipsum|\bTODO\b|\bTBD\b|placeholder text|xxx/i.test(document.body.innerText),
      expected: Object.fromEntries(sections.map((s) => [s.id, s.items ? [...document.querySelectorAll(s.items)].map((n) => (n.querySelector(s.itemHeading)?.textContent ?? "").replace(/\s+/g, " ").trim()) : null])),
    }), { sections: p.sections });
    if (meta.iframes) fail(where, `${meta.iframes} iframes`);
    if (!meta.scroller || meta.nested) fail(where, "nested scroll context");
    if (meta.placeholder) fail(where, "placeholder or debug copy in rendered text");

    const seen = Object.fromEntries(p.sections.map((s) => [s.id, { forward: [], reverse: [] }]));
    const pinMisses = []; const overflow = []; const shots = []; const contrast = []; const captured = new Set();
    /* Fine steps through every declared track, so no state shorter than a
       coarse stride is skipped; coarse steps elsewhere. */
    const coarse = Math.max(40, Math.round(viewport.h * 0.08));
    const tracks = await page.evaluate((sels) => sels.map((sel) => { const r = document.querySelector(sel)?.getBoundingClientRect(); return r ? [r.top + scrollY - innerHeight, r.bottom + scrollY] : null; }).filter(Boolean), [...new Set(p.sections.map((s) => s.track))]);
    const positions = [];
    for (let y = 0; y <= meta.height - viewport.h; y += tracks.some(([a, b]) => y >= a && y <= b) ? 16 : coarse) positions.push(y);
    positions.push(meta.height - viewport.h);
    for (const direction of ["forward", "reverse"]) {
      for (const y of direction === "forward" ? positions : [...positions].reverse()) {
        await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y);
        await page.waitForTimeout(90);
        const state = await page.evaluate(({ sections, top }) => {
          /* Text that runs past either edge of the page, whether or not the
             page itself can scroll sideways (Krish, 2026-09-25: "text flying
             off the right-hand side of the page"). */
          const w = document.documentElement.clientWidth;
          const offEdge = [...document.querySelectorAll("main h1, main h2, main h3, main p, main li, main blockquote, main button")].some((el) => {
            /* Measure the glyphs, not the box: text can spill out of a box that has collapsed. */
            const range = document.createRange(); range.selectNodeContents(el);
            const r = range.getBoundingClientRect();
            if (!r.width || r.bottom < 0 || r.top > innerHeight || getComputedStyle(el).visibility === "hidden" || Number(getComputedStyle(el).opacity) === 0 || el.closest("[aria-hidden='true']")) return false;
            return r.right > w + 1 || r.left < -1;
          });
          const out = { overflowX: document.documentElement.scrollWidth > w + 1 || offEdge, states: {}, pins: [] };
          out.whole = {};
          for (const s of sections) {
            const active = document.querySelector(s.state);
            const track = document.querySelector(s.track); const frame = s.frame ? document.querySelector(s.frame) : null;
            const tr = track?.getBoundingClientRect();
            /* A state counts only while its chapter is on screen. */
            out.states[s.id] = active && tr && tr.bottom > 0 && tr.top < innerHeight ? active.textContent.replace(/\s+/g, " ").trim() : null;
            const fr = (frame ?? track)?.getBoundingClientRect();
            out.whole[s.id] = Boolean(fr && fr.top >= -1 && fr.bottom <= innerHeight + 1);
            if (track && frame) {
              const t = track.getBoundingClientRect(); const f = frame.getBoundingClientRect();
              const pinAt = parseFloat(getComputedStyle(frame).top) || top;
              if (t.top < pinAt - 2 && t.bottom > pinAt + f.height + 2) out.pins.push({ id: s.id, frameTop: Math.round(f.top), expected: pinAt });
            }
          }
          return out;
        }, { sections: p.sections, top });
        if (state.overflowX) overflow.push(y);
        for (const pin of state.pins) if (Math.abs(pin.frameTop - pin.expected) > 3) pinMisses.push({ y, ...pin });
        for (const s of p.sections) {
          const list = seen[s.id][direction]; const value = state.states[s.id];
          if (value && list[list.length - 1] !== value) list.push(value);
          /* Without published rests, capture each state once, the first time
             its frame is wholly on screen. */
          if (direction === "forward" && s.capture && !s.rests && value && state.whole[s.id] && !captured.has(`${s.id}:${value}`)) {
            captured.add(`${s.id}:${value}`);
            await page.waitForTimeout(700);
            const n = String(list.length).padStart(2, "0");
            const file = path.resolve(outDir, "screenshots", `${route.name}-${viewport.name}-${s.id}-${n}.jpg`);
            await page.screenshot({ path: file, type: "jpeg", quality: 82 });
            shots.push(file);
            if (s.text) contrast.push(...await measureContrast(page, s.text, `${where} ${s.id} ${n}`));
          }
        }
      }
    }
    /* Where a track publishes where each state rests whole, every state is
       captured and its contrast measured there, not mid-change. */
    for (const s of p.sections.filter((x) => x.capture && x.rests)) {
      const rests = await page.evaluate(({ track, attr }) => (document.querySelector(track)?.getAttribute(attr) ?? "").split(",").filter(Boolean).map(Number), { track: s.track, attr: s.rests });
      for (const [i, rest] of rests.entries()) {
        await page.evaluate(({ s, rest }) => {
          const track = document.querySelector(s.track); const frame = document.querySelector(s.frame);
          const pin = parseFloat(getComputedStyle(frame).top) || 0;
          scrollTo({ top: scrollY + track.getBoundingClientRect().top - pin + rest * (track.offsetHeight - frame.offsetHeight), behavior: "instant" });
        }, { s, rest });
        await page.waitForTimeout(700);
        const n = String(i + 1).padStart(2, "0");
        const file = path.resolve(outDir, "screenshots", `${route.name}-${viewport.name}-${s.id}-${n}.jpg`);
        await page.screenshot({ path: file, type: "jpeg", quality: 82 });
        shots.push(file);
        if (s.text) contrast.push(...await measureContrast(page, s.text, `${where} ${s.id} ${n}`));
      }
    }
    for (const c of contrast.filter((c) => !c.pass)) fail(where, `contrast ${c.ratio.toFixed(2)} < ${c.need} for ${c.label}`);
    const journey = { route: route.path, viewport: viewport.name, surface: viewport.surface, sections: {}, pinMisses, overflow, contrast, issues: [...issues], screenshots: shots.map(rel) };
    for (const s of p.sections) {
      const f = seen[s.id].forward; const r = seen[s.id].reverse; const want = meta.expected[s.id] ?? s.states;
      const forward = want ? JSON.stringify(f) === JSON.stringify(want) : f.length >= 2;
      const reverse = want ? JSON.stringify(r) === JSON.stringify([...want].reverse()) : r.length >= 2;
      journey.sections[s.id] = { forward, reverse, seenForward: f, seenReverse: r, expected: want };
      if (!forward) fail(where, `${s.id} forward states ${JSON.stringify(f)} expected ${JSON.stringify(want)}`);
      if (!reverse) fail(where, `${s.id} reverse states ${JSON.stringify(r)}`);
    }
    if (pinMisses.length) fail(where, `${pinMisses.length} pin geometry misses, first ${JSON.stringify(pinMisses[0])}`);
    if (overflow.length) fail(where, `horizontal overflow at ${overflow.length} positions`);
    if (issues.length) fail(where, `console/network: ${issues.slice(0, 3).join(" | ")}`);

    const seams = await page.evaluate((sel) => { const list = [...document.querySelectorAll(sel)].map((n) => { const r = n.getBoundingClientRect(); return { top: r.top + scrollY, bottom: r.bottom + scrollY, name: n.className || n.id }; }); const bad = []; for (let i = 1; i < list.length; i += 1) if (list[i].top < list[i - 1].bottom - 1) bad.push([list[i - 1].name, list[i].name]); return bad; }, p.seams);
    journey.seams = seams; if (seams.length) fail(where, `section seam overlap ${JSON.stringify(seams[0])}`);

    const story = p.sections.find((s) => s.next);
    if (story) {
      const targets = await page.evaluate(({ next, prev }) => [next, prev].map((sel) => { const r = document.querySelector(sel)?.getBoundingClientRect(); return r ? { w: Math.round(r.width), h: Math.round(r.height) } : null; }), story);
      journey.targets = targets;
      if (viewport.mobile && targets.some((t) => !t || t.w < 44 || t.h < 44)) fail(where, `touch target under 44px ${JSON.stringify(targets)}`);
    }
    results.journeys.push(journey);
    await context.close();
  }

  const story = p.sections.find((s) => s.next);
  for (const route of p.routes) for (const viewport of [...p.viewports, ...p.shortViewports]) {
    for (const reduced of [true, false]) {
      if (!reduced && !viewport.short) continue;
      const where = `${route.name}@${viewport.name}${reduced ? " reduced" : ""}`;
      const { context, page, issues } = await open(viewport, reduced ? { reducedMotion: "reduce" } : {});
      await page.goto(origin + route.path, { waitUntil: "networkidle" });
      await settle(page);
      await page.evaluate(toFirstState, story);
      await page.waitForTimeout(500);
      const count = await page.evaluate((sel) => document.querySelectorAll(sel).length, story.items);
      const states = [];
      for (let i = 0; i < count; i += 1) {
        const s = await page.evaluate(({ story, top }) => {
          const frame = document.querySelector(story.frame); const active = document.querySelector(story.state);
          const heading = active?.getBoundingClientRect(); const next = document.querySelector(story.next)?.getBoundingClientRect();
          const prev = document.querySelector(story.prev)?.getBoundingClientRect();
          const inView = (r) => r && r.top >= top - 1 && r.bottom <= innerHeight + 1 && r.width > 0;
          return { text: active?.textContent.replace(/\s+/g, " ").trim(), sticky: frame ? getComputedStyle(frame).position : null, headingWhole: inView(heading), controls: inView(next) && inView(prev), nextDisabled: document.querySelector(story.next)?.getAttribute("aria-disabled"), prevDisabled: document.querySelector(story.prev)?.getAttribute("aria-disabled") };
        }, { story, top: await headerBottom(page) });
        states.push(s);
        if (!s.headingWhole) fail(where, `state ${i + 1} heading not whole in view`);
        if (!s.controls) fail(where, `state ${i + 1} controls not in view`);
        if (i < count - 1) {
          try { await page.click(story.next, { timeout: 3000 }); } catch { fail(where, `controls not in view: the next control could not be used at state ${i + 1}`); break; }
          await page.waitForTimeout(reduced ? 450 : 1500);
        }
      }
      if (new Set(states.map((s) => s.text)).size !== count) fail(where, `next control reached ${new Set(states.map((s) => s.text)).size} of ${count} states`);
      const shot = path.resolve(outDir, "screenshots", `${route.name}-${viewport.name}${reduced ? "-reduced" : ""}-last.jpg`);
      await page.screenshot({ path: shot, type: "jpeg", quality: 82 });
      (reduced ? results.reduced : results.shortScreens).push({ route: route.path, viewport: viewport.name, surface: viewport.surface, states, issues: [...issues], screenshot: rel(shot) });
      if (issues.length) fail(where, `console/network: ${issues[0]}`);
      await context.close();
    }
  }

  for (const route of p.routes) {
    const viewport = p.viewports.find((v) => !v.mobile);
    const where = `${route.name}@${viewport.name} keyboard`;
    const { context, page } = await open(viewport);
    await page.goto(origin + route.path, { waitUntil: "networkidle" });
    await settle(page);
    await page.evaluate(toFirstState, story);
    await page.waitForTimeout(400);
    try { await page.focus(story.prev, { timeout: 3000 }); } catch { fail(where, "previous control cannot take focus"); }
    await page.keyboard.press("Tab");
    const focus = await page.evaluate((sel) => { const el = document.activeElement; const s = getComputedStyle(el); return { onNext: el === document.querySelector(sel), visible: el.matches(":focus-visible"), ring: (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || s.boxShadow !== "none", label: el.getAttribute("aria-label") }; }, story.next);
    const before = await page.evaluate((sel) => document.querySelector(sel)?.textContent.trim(), story.state);
    await page.keyboard.press("Enter");
    await page.waitForTimeout(1500);
    const after = await page.evaluate((sel) => document.querySelector(sel)?.textContent.trim(), story.state);
    const entry = { route: route.path, ...focus, advanced: before !== after };
    results.keyboard.push(entry);
    if (!focus.onNext || !focus.visible || !focus.ring) fail(where, `focus not visible on next control ${JSON.stringify(focus)}`);
    if (!focus.label) fail(where, "next control has no accessible name");
    if (!entry.advanced) fail(where, "Enter on next did not advance the story");
    await context.close();
  }

  await browser.close();
  server.kill();
  for (const c of commands) if (c.exit !== 0) fail(`command ${c.id}`, `exit ${c.exit}`);
  await writeFile(path.resolve(outDir, "browser-report.json"), `${JSON.stringify(results, null, 2)}\n`, "utf8");
  console.log(JSON.stringify({ candidateSha256: identity.sha256, failures: results.failures }, null, 2));
  if (results.failures.length) process.exitCode = 1;

  async function measureContrast(page, selector, label) {
    const nodes = await page.$$(selector);
    const out = [];
    for (const node of nodes) {
      const info = await node.evaluate((el) => {
        const s = getComputedStyle(el); const r = el.getBoundingClientRect();
        let alpha = 1; for (let n = el; n; n = n.parentElement) alpha *= parseFloat(getComputedStyle(n).opacity);
        const m = s.color.match(/[\d.]+/g).map(Number);
        return { box: { x: r.x, y: r.y, width: r.width, height: r.height }, rgba: [m[0], m[1], m[2], (m[3] ?? 1) * alpha], size: parseFloat(s.fontSize), weight: parseInt(s.fontWeight, 10), visible: r.width > 0 && r.height > 0 && s.visibility !== "hidden", text: el.textContent.trim().slice(0, 48) };
      });
      if (!info.visible || info.rgba[3] < 0.05) continue;
      const vp = page.viewportSize();
      const x0 = Math.max(0, Math.floor(info.box.x)); const y0 = Math.max(0, Math.floor(info.box.y));
      const x1 = Math.min(vp.width, Math.ceil(info.box.x + info.box.width)); const y1 = Math.min(vp.height, Math.ceil(info.box.y + info.box.height));
      if (x1 - x0 < 2 || y1 - y0 < 2) continue;
      const box = { x: x0, y: y0, width: x1 - x0, height: y1 - y0 };
      /* Two captures of the same box, with and without the glyphs. Only the
         pixels the glyphs actually cover are judged, against what lies
         directly behind them, so a rule, dot or border beside the words
         cannot pass or fail a line. */
      const withText = await page.screenshot({ clip: box, type: "png", animations: "disabled" });
      await node.evaluate((el) => { el.style.setProperty("color", "transparent", "important"); el.style.setProperty("text-shadow", "none", "important"); el.querySelectorAll("*").forEach((c) => { c.style.setProperty("color", "transparent", "important"); c.style.setProperty("text-shadow", "none", "important"); c.style.setProperty("text-decoration-color", "transparent", "important"); }); });
      const bare = await page.screenshot({ clip: box, type: "png", animations: "disabled" });
      await node.evaluate((el) => { el.style.removeProperty("color"); el.style.removeProperty("text-shadow"); el.querySelectorAll("*").forEach((c) => { c.style.removeProperty("color"); c.style.removeProperty("text-shadow"); c.style.removeProperty("text-decoration-color"); }); });
      const a = await sharp(withText).raw().toBuffer({ resolveWithObject: true });
      const b = await sharp(bare).raw().toBuffer({ resolveWithObject: true });
      const ratios = [];
      for (let i = 0; i < b.data.length; i += b.info.channels) {
        const d = Math.abs(a.data[i] - b.data[i]) + Math.abs(a.data[i + 1] - b.data[i + 1]) + Math.abs(a.data[i + 2] - b.data[i + 2]);
        if (d < 24) continue;
        const bg = [b.data[i], b.data[i + 1], b.data[i + 2]];
        ratios.push(ratio(blend(info.rgba, bg), bg));
      }
      if (!ratios.length) continue;
      ratios.sort((x, y) => x - y);
      /* The worst 1% of glyph pixels, so one anti-aliased edge cannot decide it. */
      const worst = ratios[Math.floor(ratios.length * 0.01)];
      const large = info.size >= 24 || (info.size >= 18.66 && info.weight >= 700);
      const need = large ? 3 : 4.5;
      out.push({ label: `${label}: ${info.text}`, ratio: worst, need, pass: worst >= need });
    }
    return out;
  }
}

async function specialist(panelPath) {
  const panel = JSON.parse(await readFile(path.resolve(panelPath), "utf8"));
  await mkdir(path.resolve(outDir, "jurors"), { recursive: true });
  const jurors = [];
  const hardGates = [];
  for (const judge of panel.judges) {
    const bound = judge.candidateSha256 === identity.sha256;
    const status = bound && !judge.veto ? "pass" : "fail";
    const file = path.resolve(outDir, "jurors", `${judge.id}.json`);
    await writeFile(file, `${JSON.stringify({ ...judge, status, boundToCurrentBytes: bound }, null, 2)}\n`, "utf8");
    jurors.push({ id: judge.id, contextId: judge.contextId, executorId: judge.executorId, surface: "desktop+mobile", coverage: judge.coverage, score: judge.score, veto: Boolean(judge.veto), status, evidence: [await fileEvidence(file)] });
    hardGates.push({ id: `${judge.id}:no_veto`, status: judge.veto ? "fail" : "pass" }, { id: `${judge.id}:bound_to_candidate`, status: bound ? "pass" : "fail" });
  }
  const now = Date.now();
  const receipt = { schemaVersion: 1, candidateId: manifest.candidateId, candidateSha256: identity.sha256, capturedAt: new Date(now).toISOString(), expiresAt: new Date(now + WEEK).toISOString(), jurors, hardGates };
  await writeFile(path.resolve(root, manifest.evidence.specialist), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");
  const failed = jurors.filter((j) => j.status !== "pass");
  console.log(JSON.stringify({ jurors: jurors.map((j) => ({ id: j.id, score: j.score, veto: j.veto, status: j.status })), failed: failed.map((j) => j.id) }, null, 2));
  if (failed.length) process.exitCode = 1;
}

async function receipts() {
  const reportPath = path.resolve(outDir, "browser-report.json");
  const report = JSON.parse(await readFile(reportPath, "utf8"));
  if (report.candidateSha256 !== identity.sha256) throw new Error("browser report is bound to other bytes; run probe again");
  const reportEvidence = await fileEvidence(reportPath);
  const logEvidence = async (id) => { const c = report.commands.find((x) => x.id === id); if (!c) return { evidence: [], ok: false }; return { evidence: [await fileEvidence(path.resolve(root, c.log))], ok: c.exit === 0 }; };
  const failuresMatching = (re) => report.failures.filter((f) => re.test(`${f.where} ${f.message}`));
  const firstShot = report.journeys[0]?.screenshots?.[0];
  const shotEvidence = firstShot ? [await fileEvidence(path.resolve(root, firstShot))] : [];

  let specialistOk = false;
  try {
    const sp = JSON.parse(await readFile(path.resolve(root, manifest.evidence.specialist), "utf8"));
    specialistOk = sp.candidateSha256 === identity.sha256 && sp.jurors.every((j) => j.status === "pass");
  } catch { specialistOk = false; }
  const specialistEvidence = specialistOk ? [await fileEvidence(path.resolve(root, manifest.evidence.specialist))] : [];

  const check = async (id, ok, evidence) => ({ id, status: ok ? "pass" : "fail", evidence });
  const lb = await logEvidence("line-breaks"); const pm = await logEvidence("pre-merge"); const logo = await logEvidence("logo-alignment");
  const chrome = await logEvidence("chrome"); const unit = await logEvidence("unit"); const build = await logEvidence("build");
  const checks = [
    await check("artifact_identity", build.ok, [reportEvidence, ...build.evidence]),
    await check("runtime_identity", /^http:\/\/127\.0\.0\.1:\d+$/.test(report.origin), [reportEvidence]),
    await check("fresh_self_owned_capture", Date.now() - Date.parse(report.capturedAt) < WEEK && shotEvidence.length > 0, [reportEvidence, ...shotEvidence]),
    await check("broken_links_controls_assets", !failuresMatching(/requestfailed|http \d|touch target|accessible name/).length, [reportEvidence]),
    await check("overflow_overlap_clipping", lb.ok && !failuresMatching(/overflow|seam/).length, [reportEvidence, ...lb.evidence]),
    await check("layout_alignment", logo.ok, logo.evidence),
    await check("text_wrap_orphans_content_range", lb.ok, lb.evidence),
    await check("contrast", !failuresMatching(/contrast/).length && report.journeys.some((j) => j.contrast.length), [reportEvidence]),
    await check("keyboard_focus_semantics", !failuresMatching(/keyboard/).length && report.keyboard.length > 0, [reportEvidence]),
    await check("touch_targets", !failuresMatching(/touch target/).length, [reportEvidence]),
    await check("viewport_safe_areas_fixed_chrome", chrome.ok && !failuresMatching(/controls not in view/).length, [reportEvidence, ...chrome.evidence]),
    await check("reduced_motion", pm.ok && !failuresMatching(/reduced/).length && report.reduced.length > 0, [reportEvidence, ...pm.evidence]),
    await check("section_fit_scroll_contract", pm.ok && !failuresMatching(/pin geometry|heading not whole/).length, [reportEvidence, ...pm.evidence]),
    await check("duplicate_components_claims", unit.ok, unit.evidence),
    await check("placeholder_debug_backup_singer_copy", !failuresMatching(/placeholder/).length, [reportEvidence]),
    await check("console_network_user_impact", !failuresMatching(/console|pageerror/).length, [reportEvidence]),
    await check("single_dom_scroll_context", !failuresMatching(/iframes|nested scroll/).length, [reportEvidence]),
    await check("continuous_forward_reverse_journey", !failuresMatching(/forward states|reverse states/).length && report.journeys.length > 0, [reportEvidence]),
    await check("section_seam_collision", !failuresMatching(/seam/).length, [reportEvidence]),
    await check("judge_evidence_identity", specialistOk, specialistEvidence.length ? specialistEvidence : [reportEvidence]),
  ];
  const sectionIds = manifest.requirements.scrollDrivenSections;
  const journeys = [];
  for (const surface of manifest.requirements.surfaces) {
    const js = report.journeys.filter((j) => j.surface === surface);
    const forward = js.length > 0 && js.every((j) => sectionIds.every((id) => j.sections[id]?.forward));
    const reverse = js.length > 0 && js.every((j) => sectionIds.every((id) => j.sections[id]?.reverse));
    const evidence = [];
    for (const j of js) for (const s of j.screenshots.slice(0, 2)) evidence.push(await fileEvidence(path.resolve(root, s)));
    journeys.push({ surface, continuousCapture: js.length > 0, forwardScroll: forward ? "pass" : "fail", reverseScroll: reverse ? "pass" : "fail", scrollDrivenSections: forward && reverse ? sectionIds : [], evidence: evidence.length ? evidence : [reportEvidence] });
  }
  const stamp = { capturedAt: report.capturedAt, expiresAt: new Date(Date.parse(report.capturedAt) + WEEK).toISOString() };
  const readiness = { schemaVersion: 1, candidateId: manifest.candidateId, candidateSha256: identity.sha256, ...stamp, runtime: { selfOwned: true, origin: report.origin }, checks, journeys };
  const observations = [];
  for (const j of report.journeys) {
    const failures = report.failures.filter((f) => f.where.startsWith(`${p(j.route)}@${j.viewport}`));
    const evidence = j.screenshots.length ? [await fileEvidence(path.resolve(root, j.screenshots[0]))] : [reportEvidence];
    observations.push({ id: `chromium-${p(j.route)}-${j.viewport}-journey`, surface: j.surface, route: j.route, viewport: j.viewport, action: "Scroll the whole page forward then back in fixed steps, reading every scroll-driven section's active state, pin position, overflow and contrast at each story.", expected: "Every state appears in order forward and in reverse order backward, frames pin under the masthead, nothing overflows and every line keeps its contrast.", observed: failures.length ? failures.map((f) => f.message).join("; ") : `forward and reverse complete for ${Object.keys(j.sections).join(", ")}; ${j.contrast.length} lines measured for contrast`, status: failures.length ? "fail" : "pass", evidence });
  }
  for (const s of [...report.shortScreens, ...report.reduced]) {
    const kind = report.reduced.includes(s) ? "reduced" : "short";
    const failures = report.failures.filter((f) => f.where.startsWith(`${p(s.route)}@${s.viewport}${kind === "reduced" ? " reduced" : ""}`));
    observations.push({ id: `chromium-${p(s.route)}-${s.viewport}-${kind}`, surface: s.surface, route: s.route, viewport: s.viewport, action: "Step through every story with the next control.", expected: "Every story becomes active, its heading and both controls stay whole in view, and the frame stays pinned.", observed: failures.length ? failures.map((f) => f.message).join("; ") : `${s.states.length} states reached, all whole with controls in view`, status: failures.length ? "fail" : "pass", evidence: [await fileEvidence(path.resolve(root, s.screenshot))] });
  }
  const continuity = { schemaVersion: 1, candidateId: manifest.candidateId, candidateSha256: identity.sha256, ...stamp, observations };
  await writeFile(path.resolve(root, manifest.evidence.readiness), `${JSON.stringify(readiness, null, 2)}\n`, "utf8");
  await writeFile(path.resolve(root, manifest.evidence.continuity), `${JSON.stringify(continuity, null, 2)}\n`, "utf8");
  const failed = checks.filter((c) => c.status !== "pass").map((c) => c.id);
  console.log(JSON.stringify({ candidateSha256: identity.sha256, failedChecks: failed, failedObservations: observations.filter((o) => o.status !== "pass").map((o) => o.id) }, null, 2));
  if (failed.length || observations.some((o) => o.status !== "pass")) process.exitCode = 1;
}

/* Where the first state rests: the track's own plan when it publishes one
   (data-story-rests), otherwise just inside the start of the pinned track. */
function toFirstState(story) {
  const track = document.querySelector(story.track);
  const frame = document.querySelector(story.frame);
  const pin = frame ? parseFloat(getComputedStyle(frame).top) || 0 : 0;
  const rests = track.dataset.storyRests ? track.dataset.storyRests.split(",").map(Number) : null;
  const travel = frame ? track.offsetHeight - frame.offsetHeight : 0;
  scrollTo({ top: scrollY + track.getBoundingClientRect().top - pin + (rests ? rests[0] * travel : pin + 4), behavior: "instant" });
}

function p(routePath) { return manifest.probe.routes.find((r) => r.path === routePath)?.name ?? routePath; }

async function selftest() {
  const outcomes = [];
  for (const [name, control] of Object.entries(NEGATIVES)) {
    const child = spawn(process.execPath, [fileURLToPath(import.meta.url), "probe", manifestArg], { cwd: root, env: { ...process.env, MM_READINESS_NEGATIVE: name } });
    const chunks = []; child.stdout.on("data", (d) => chunks.push(d)); child.stderr.on("data", (d) => chunks.push(d));
    const code = await new Promise((r) => child.on("exit", r));
    const text = Buffer.concat(chunks).toString("utf8");
    const caught = code !== 0 && control.expect.test(text);
    outcomes.push({ control: name, exit: code, caught });
    console.log(`${name}: ${caught ? "caught" : "MISSED"}`);
  }
  const file = path.resolve(outDir, "probe-selftest.json");
  await mkdir(outDir, { recursive: true });
  await writeFile(file, `${JSON.stringify({ candidateSha256: identity.sha256, ranAt: new Date().toISOString(), outcomes }, null, 2)}\n`, "utf8");
  if (outcomes.some((o) => !o.caught)) process.exitCode = 1;
}

if (mode === "probe") await probe();
else if (mode === "selftest") await selftest();
else if (mode === "specialist") await specialist(extra);
else await receipts();
