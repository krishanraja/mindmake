/**
 * The homepage cards that sit on pictures, measured (Krish, 2026-10-24: the
 * pictures "faded enough that the text is all visible. Make sure you do color
 * contrast checks").
 *
 * Every line of text on the eras (both faces of each) and the three results is
 * read at a phone held as Krish holds it (412x741), the smallest phone in the
 * line-break check (360x780) and a desktop (1440x900). The card's text is made
 * transparent, the card is captured, and the box of each line is read back
 * pixel by pixel; the background behind a line is its brightest pixel (the
 * 99.5th percentile, so one anti-aliased pixel does not decide it). A line
 * fails below 4.5:1, or 3:1 for large text. A colour with alpha is laid over
 * that same pixel first.
 *
 * A negative control, a card of pale text on a bright picture, must fail, or
 * the check's silence on the site means nothing. `--base` points at an
 * existing server; otherwise the check serves `dist/` itself.
 */
import { chromium } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const port = 4372;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = flag("base") ?? `http://127.0.0.1:${port}`;
const VIEWPORTS = [{ width: 412, height: 741 }, { width: 360, height: 780 }, { width: 1440, height: 900 }];
const HIDE = ".mm-contrast-audit, .mm-contrast-audit * { color: transparent !important; text-decoration-color: transparent !important; }";

/* The lines of text in a card, then the card captured with them hidden. */
async function measure(page, card) {
  const lines = await card.evaluate((node) => {
    const box = node.getBoundingClientRect();
    const out = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT);
    for (let text = walker.nextNode(); text; text = walker.nextNode()) {
      const parent = text.parentElement;
      if (!text.textContent.trim() || !parent.checkVisibility({ visibilityProperty: true, opacityProperty: true })) continue;
      const range = document.createRange();
      range.selectNodeContents(text);
      const style = getComputedStyle(parent);
      for (const r of range.getClientRects()) if (r.width > 1) out.push({ x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height, color: style.color, size: parseFloat(style.fontSize), weight: Number(style.fontWeight), text: text.textContent.trim().slice(0, 40) });
    }
    node.classList.add("mm-contrast-audit");
    return out;
  });
  const png = (await card.screenshot()).toString("base64");
  await card.evaluate((node) => node.classList.remove("mm-contrast-audit"));
  return page.evaluate(async ({ png, lines }) => {
    const img = new Image();
    img.src = `data:image/png;base64,${png}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const g = canvas.getContext("2d");
    g.drawImage(img, 0, 0);
    const lin = (c) => { c /= 255; return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4; };
    const lum = (r, gr, b) => .2126 * lin(r) + .7152 * lin(gr) + .0722 * lin(b);
    return lines.map((line) => {
      const data = g.getImageData(Math.max(0, Math.round(line.x)), Math.max(0, Math.round(line.y)), Math.max(1, Math.round(line.w)), Math.max(1, Math.round(line.h))).data;
      const pixels = [];
      for (let i = 0; i < data.length; i += 4) pixels.push([lum(data[i], data[i + 1], data[i + 2]), data[i], data[i + 1], data[i + 2]]);
      pixels.sort((a, b) => a[0] - b[0]);
      const [lb, ...ground] = pixels[Math.min(pixels.length - 1, Math.floor(pixels.length * .995))];
      const [r, gr, b, a = 1] = line.color.match(/[\d.]+/g).map(Number);
      const lt = lum(...[r, gr, b].map((c, k) => a * c + (1 - a) * ground[k]));
      const ratio = (Math.max(lt, lb) + .05) / (Math.min(lt, lb) + .05);
      const large = line.size >= 24 || (line.size >= 18.66 && line.weight >= 700);
      return { text: line.text, ratio: Math.round(ratio * 100) / 100, need: large ? 3 : 4.5 };
    });
  }, { png, lines });
}

for (let i = 0; i < 100; i += 1) { try { if ((await fetch(BASE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const failures = [];
const measured = [];
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, reducedMotion: "reduce" });
    await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); } catch {} });
    const page = await context.newPage();
    await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
    await page.addStyleTag({ content: HIDE });
    await page.evaluate(async () => {
      document.querySelectorAll('img[loading="lazy"]').forEach((img) => { img.loading = "eager"; });
      await Promise.all([...document.querySelectorAll(".hs-card-img")].map((img) => img.decode().catch(() => {})));
      await document.fonts.ready;
    });
    const cards = [];
    const tiles = await page.locator("[data-hs-era]").count();
    for (let i = 0; i < tiles; i++) for (const face of ["question", "answer"]) cards.push({ locator: page.locator("[data-hs-era]").nth(i), name: `era ${i + 1}, ${face}`, face });
    const results = await page.locator(".hs-proof > li").count();
    for (let i = 0; i < results; i++) cards.push({ locator: page.locator(".hs-proof > li").nth(i), name: `result ${i + 1}` });
    if (tiles !== 4 || results !== 3) failures.push(`${viewport.width}x${viewport.height}: expected four eras and three results, found ${tiles} and ${results}`);
    for (const card of cards) {
      if (card.face) await card.locator.evaluate((node, face) => node.setAttribute("aria-pressed", String(face === "answer")), card.face);
      await card.locator.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      for (const line of await measure(page, card.locator)) {
        measured.push(line.ratio / line.need);
        if (line.ratio < line.need) failures.push(`${viewport.width}x${viewport.height} ${card.name}: "${line.text}" is ${line.ratio}:1, needs ${line.need}:1`);
      }
    }
    await context.close();
  }
  /* Negative control: pale text on a bright picture must be caught. */
  const control = await browser.newPage({ viewport: { width: 412, height: 741 } });
  await control.setContent(`<style>${HIDE}</style><div id="card" style="width:300px;padding:20px;background:linear-gradient(90deg,#fff,#d8d8d8);font:16px serif"><p style="margin:0;color:#b9b9b9">pale words on a bright picture</p></div>`);
  const caught = (await measure(control, control.locator("#card"))).filter((line) => line.ratio < line.need);
  if (!caught.length) failures.push("negative control: pale text on a bright picture was not caught");
} finally {
  await browser.close();
  server?.kill();
}
console.log(JSON.stringify({ viewports: VIEWPORTS.map((v) => `${v.width}x${v.height}`), lines: measured.length, worstShareOfMinimum: Math.round(Math.min(...measured) * 100) / 100, failures }, null, 2));
if (failures.length || !measured.length) process.exitCode = 1;
