/**
 * Reading flow: what a reader meets scrolling a page down and back up.
 *
 * Written after S9 (Krish's phone recording, 10 November 2026, ledger
 * S9-AUDIT-001). Every unit test and gate passed while the live pages
 * stacked sections into a collage, blanked the screen, dimmed the Brain as it
 * was read and let story cards show through each other. None of that is
 * visible to a check that loads a page and looks once. This one scrolls, the
 * way a thumb does, at phone, small phone, phone landscape and laptop sizes,
 * down and back up, and at every step asks:
 *
 * - nothing on the page is pinned (position: sticky), outside a closed dialog;
 * - no section is tilted or clipped, and a section is eased back (scaled or
 *   dimmed) only once its foot has risen past 40% of the screen;
 * - no section overlaps the one before it;
 * - the screen is not blank (words or a picture on it);
 * - the page did not move by itself.
 *
 * Then, per page: the floating button never sits on a link or a picture; a
 * return to the tab moves nothing; a heading's wipe leaves nothing behind;
 * the Brain's tour holds each idea long enough to read and stops for good
 * once the reader picks one, and its two panels stack; and on every screen
 * each swipe deck (the stories on /ai-brain, /ai-gtm and /case-studies, the
 * homepage's results) keeps one height, has solid cards, moves one card per
 * arrow or swipe and ignores a vertical scroll. A reduced-motion pass checks no section is
 * eased at all.
 *
 * `--base` points at a running server (production readback:
 * `--base https://mindmake.co`); otherwise it serves dist/ itself.
 * Chromium only, as the repository rules require.
 */
import { chromium, devices } from "playwright";
import { spawn } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const port = 4372;
const server = flag("base") ? null : spawn(process.execPath, [resolve(root, "node_modules/vite/bin/vite.js"), "preview", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: "ignore" });
const BASE = flag("base") ?? `http://127.0.0.1:${port}`;
for (let i = 0; i < 100; i += 1) { try { if ((await fetch(BASE)).ok) break; } catch {} await new Promise((r) => setTimeout(r, 100)); }

const PROFILES = [
  { name: "pixel7", options: { ...devices["Pixel 7"] }, phone: true },
  { name: "360x780", options: { viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }, phone: true },
  { name: "pixel7-landscape", options: { ...devices["Pixel 7 landscape"] }, phone: true },
  { name: "1440x900", options: { viewport: { width: 1440, height: 900 } }, phone: false },
];
const ROUTES = ["/", "/ai-brain", "/ai-gtm"];
/* Where each page's swipe deck is, and its controls. */
const FINDER_DECK = { root: ".story-finder", cards: ".finder-panel.is-active .finder-card", at: ".finder-panel.is-active [data-finder-at]", next: ".finder-panel.is-active [data-finder-next]", tabs: "[data-finder-tab]" };
const DECKS = { "/": { root: ".hs-proof-deck", cards: ".hs-proof-deck [data-hs-deck-track] > li", at: ".hs-proof-deck [data-hs-deck-at]", next: '.hs-proof-deck [data-hs-deck-step="1"]' }, "/ai-brain": FINDER_DECK, "/ai-gtm": FINDER_DECK };

/** The deck runs, keeps one height whatever is chosen, has solid cards, moves one card per arrow or sideways swipe, and ignores a vertical scroll. */
async function checkDeck(page, context, where, deck, touch) {
  const state = await page.evaluate((selector) => {
    const root = document.querySelector(selector);
    if (!root) return { missing: true };
    root.scrollIntoView({ block: "center" });
    return { live: root.classList.contains("is-deck") };
  }, deck.root);
  if (state.missing || !state.live) { fail(where, "the swipe deck is not running"); return; }
  await page.waitForTimeout(500);
  const heights = await page.evaluate(async ({ root, tabs, doors }) => {
    const out = [document.querySelector(root).offsetHeight];
    const frame = () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
    for (const door of doors ? [...document.querySelectorAll(doors)] : [null]) {
      if (door) { door.click(); await frame(); }
      for (const tab of tabs ? [...document.querySelectorAll(tabs)].filter((t) => !t.hidden) : []) { tab.click(); await frame(); out.push(document.querySelector(root).offsetHeight); }
    }
    if (doors) document.querySelector(doors)?.click();
    if (tabs) document.querySelector(tabs)?.click();
    return out;
  }, deck);
  if (new Set(heights).size > 1) fail(where, `the deck changes height: ${heights.join(", ")}`);
  const solid = await page.evaluate((cards) => [...document.querySelectorAll(cards)].every((card) => {
    const colour = getComputedStyle(card).backgroundColor;
    return !/rgba\(.*,\s*0(\.\d+)?\)$/.test(colour) && colour !== "transparent";
  }), deck.cards);
  if (!solid) fail(where, "a deck card is see-through");
  const index = () => page.evaluate((at) => document.querySelector(at)?.textContent, deck.at);
  const start = await index();
  if (!touch) {
    await page.locator(deck.next).first().click();
    await page.waitForTimeout(500);
    const moved = await index();
    if (Number(moved) !== Number(start) + 1) fail(where, `the arrow moved the deck from ${start} to ${moved}`);
    return;
  }
  const card = page.locator(`${deck.cards}[data-deck="current"]`).first();
  await card.scrollIntoViewIfNeeded();
  const box = await card.boundingBox();
  const cdp = await context.newCDPSession(page);
  const swipe = async (dx, dy) => {
    const x0 = box.x + box.width * (dx < 0 ? 0.8 : 0.2), y0 = box.y + box.height / 2;
    await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: x0, y: y0 }] });
    for (let i = 1; i <= 8; i += 1) { await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: x0 + (dx * i) / 8, y: y0 + (dy * i) / 8 }] }); await page.waitForTimeout(16); }
    await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
    await page.waitForTimeout(500);
  };
  await swipe(-140, 0);
  const moved = await index();
  if (Number(moved) !== Number(start) + 1) fail(where, `a left swipe moved the deck from ${start} to ${moved}`);
  await swipe(0, -120);
  const still = await index();
  if (still !== moved) fail(where, `a vertical scroll moved the deck from ${moved} to ${still}`);
  await cdp.detach();
}
const SECTIONS = { "/": ".hs-section", "/ai-brain": ".mm-locked-brain > .chapter[data-phase], .brain-close", "/ai-gtm": ".mm-gtm > [data-gtm-chapter]" };

const failures = [];
const fail = (where, message) => failures.push(`${where}: ${message}`);
const launch = process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {};
const browser = await chromium.launch(launch);

/* One step's observations, in the page. */
const observe = (selector) => {
  const vh = window.innerHeight;
  const sticky = [...document.querySelectorAll("main *")].filter((node) => !node.closest("dialog") && getComputedStyle(node).position === "sticky").map((node) => node.className || node.tagName);
  const sections = [...document.querySelectorAll(selector)];
  const bad = [];
  let previousBottom = -Infinity;
  sections.forEach((section, index) => {
    const style = getComputedStyle(section);
    const box = section.getBoundingClientRect();
    /* Only what script sets: a section's own designed clip or transform is
       part of its look, not a stack. */
    if (section.style.transform || section.style.rotate) bad.push(`section ${index} transformed or rotated by script (${section.style.transform || section.style.rotate})`);
    if (section.style.clipPath) bad.push(`section ${index} clipped by script`);
    const eased = (style.scale && style.scale !== "none" && parseFloat(style.scale) < 0.999) || /brightness\((?!1\))/.test(style.filter);
    if (eased && box.bottom > vh * 0.4 + 2) bad.push(`section ${index} eased while its foot is at ${Math.round(box.bottom)} of ${vh}`);
    if (box.top < previousBottom - 1) bad.push(`section ${index} overlaps the one before by ${Math.round(previousBottom - box.top)}px`);
    previousBottom = Math.max(previousBottom, box.bottom);
  });
  let text = 0;
  const MEDIA = "img, picture, video, canvas, svg";
  for (let x = 0.2; x < 1; x += 0.3) for (let y = 0.25; y < 1; y += 0.25) {
    const px = innerWidth * x, py = vh * y;
    const el = document.elementFromPoint(px, py);
    if (!el || getComputedStyle(el).visibility === "hidden") continue;
    /* A picture counts when the point is on it, whether the point lands on
       the picture itself or on the frame drawn over it (the /ai-brain month
       plate is a frame over its photograph). */
    const under = (media) => { const box = media.getBoundingClientRect(); return px >= box.left && px <= box.right && py >= box.top && py <= box.bottom; };
    if ((el.textContent ?? "").trim().length > 0 || el.closest(`${MEDIA}, figure`) || [...el.querySelectorAll(MEDIA)].some(under)) text += 1;
  }
  return { sticky, bad, text, y: Math.round(scrollY) };
};

for (const profile of PROFILES) {
  for (const reduced of [false, true]) {
    if (reduced && profile.name !== "pixel7") continue;
    const context = await browser.newContext({ ...profile.options, reducedMotion: reduced ? "reduce" : "no-preference" });
    await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); } catch {} });
    const page = await context.newPage();
    for (const route of ROUTES) {
      const where = `${profile.name}${reduced ? " reduced" : ""} ${route}`;
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const height = await page.evaluate(() => document.documentElement.scrollHeight);
      const vh = await page.evaluate(() => innerHeight);
      const stepPx = Math.round(vh * 0.3);
      const positions = [];
      for (let y = 0; y <= height - vh; y += stepPx) positions.push(y);
      positions.push(height - vh);
      const walk = [...positions, ...[...positions].reverse()];
      let blank = 0;
      for (const y of walk) {
        await page.evaluate((top) => window.scrollTo(0, top), y);
        await page.waitForTimeout(90);
        const seen = await page.evaluate(observe, SECTIONS[route]);
        if (seen.sticky.length) fail(where, `pinned at y=${y}: ${seen.sticky.slice(0, 3).join(", ")}`);
        seen.bad.forEach((problem) => fail(where, `y=${y}: ${problem}`));
        if (Math.abs(seen.y - Math.min(y, height - vh)) > 2) fail(where, `page moved by itself at y=${y} (now ${seen.y})`);
        if (seen.text === 0) blank += 1;
        if (reduced) {
          const eased = await page.evaluate((selector) => [...document.querySelectorAll(selector)].some((s) => s.style.scale || s.style.filter), SECTIONS[route]);
          if (eased) fail(where, `a section is eased under reduced motion at y=${y}`);
        }
      }
      if (blank > 1) fail(where, `${blank} steps showed no text anywhere on screen`);

      /* Headings written in leave nothing behind. */
      await page.waitForTimeout(1500);
      const leftovers = await page.evaluate(() => ({ layers: document.querySelectorAll(".hs-wipe-layer").length, clipped: [...document.querySelectorAll(".hs-wipe")].filter((h) => h.style.clipPath).length }));
      if (leftovers.layers || leftovers.clipped) fail(where, `wipe left ${leftovers.layers} layer(s) and ${leftovers.clipped} clipped heading(s)`);

      /* Returning to the tab moves nothing. */
      await page.evaluate((top) => window.scrollTo(0, top), Math.round(height * 0.45));
      await page.waitForTimeout(200);
      const before = await page.evaluate(() => scrollY);
      await page.evaluate(() => {
        const set = (state) => { Object.defineProperty(document, "visibilityState", { value: state, configurable: true }); Object.defineProperty(document, "hidden", { value: state === "hidden", configurable: true }); document.dispatchEvent(new Event("visibilitychange")); };
        set("hidden"); window.dispatchEvent(new Event("blur"));
        set("visible"); window.dispatchEvent(new Event("focus"));
        document.activeElement instanceof HTMLElement && document.activeElement.blur();
        document.querySelector("main a[href], main button")?.focus({ preventScroll: true });
      });
      await page.waitForTimeout(400);
      const after = await page.evaluate(() => scrollY);
      if (Math.abs(after - before) > 2) fail(where, `returning to the tab moved the page from ${before} to ${after}`);

      if (route === "/ai-brain") {
        /* The connected Brain (2026-11-10) may tour its ideas slowly while it
           is on screen. Each idea must stay long enough to read, and a reader's
           pick must stop the tour: it used to turn every 3.6s and replace the
           reading before anyone could read it (audit BRAIN-05). */
        const active = () => page.evaluate(() => document.querySelector(".meaning-node-s2.is-active")?.dataset.id);
        await page.evaluate(() => document.querySelector("#meaningFieldS2")?.scrollIntoView({ block: "center" }));
        const first = await active();
        await page.waitForTimeout(5000);
        const later = await active();
        if (first !== later) fail(where, `the Brain moved from ${first} to ${later} within 5s, too soon to read`);
        const picked = await page.evaluate(() => {
          const node = [...document.querySelectorAll(".meaning-node-s2:not(.is-active)")].at(-1);
          node?.click();
          return node?.dataset.id;
        });
        await page.waitForTimeout(7600);
        const held = await active();
        if (picked && held !== picked) fail(where, `the Brain's tour carried on after the reader picked ${picked} (now ${held})`);
        await page.keyboard.press("Escape");
        const stacked = await page.evaluate(() => {
          const memory = document.querySelector("#memory")?.getBoundingClientRect();
          const record = document.querySelector("#living-record")?.getBoundingClientRect();
          return memory && record ? record.top >= memory.bottom - 1 : false;
        });
        if (!stacked) fail(where, "the goals and record panels are not one after the other");
      }

      /* The floating button never sits on a link, a control or a picture. */
      if (route !== "/") {
        for (let y = 0; y < height; y += Math.round(vh * 0.5)) {
          await page.evaluate((top) => window.scrollTo(0, top), y);
          await page.waitForTimeout(450);
          const on = await page.evaluate(() => {
            const bar = document.querySelector(".mm-action-bar.is-shown:not(.is-tucked)");
            if (!bar) return null;
            const box = bar.querySelector(".mm-button").getBoundingClientRect();
            for (const [x, y2] of [[box.left + 4, box.top + 4], [box.right - 4, box.top + 4], [box.left + box.width / 2, box.top + box.height / 2], [box.left + 4, box.bottom - 4], [box.right - 4, box.bottom - 4]]) {
              const under = document.elementsFromPoint(x, y2).find((el) => !bar.contains(el));
              if (under && under.closest('a[href], button, summary, [role="button"], [role="tab"], img, video, canvas')) return under.outerHTML.slice(0, 80);
            }
            return null;
          });
          if (on) fail(where, `the floating button sits on ${on} at y=${y}`);
        }
      }

      /* The swipe deck, on every screen (owner, 2026-11-10: "Same style and
         movement on desktop"): the stories on /ai-brain and /ai-gtm, the
         homepage's results. */
      if (DECKS[route]) await checkDeck(page, context, where, DECKS[route], profile.phone);
    }
    await context.close();
  }
}

/* The stories on /case-studies are the same deck, with its doors as well as
   its situations; the page is not scrolled step by step here, only its deck. */
for (const profile of PROFILES) {
  const context = await browser.newContext({ ...profile.options });
  await context.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); } catch {} });
  const page = await context.newPage();
  await page.goto(BASE + "/case-studies", { waitUntil: "networkidle" });
  await checkDeck(page, context, `${profile.name} /case-studies`, { ...FINDER_DECK, doors: "[data-finder-pick]" }, profile.phone);
  await context.close();
}

/* Negative control for the blank screen: an empty screen must count as
   blank, and a photograph whose frame takes the point must not. */
{
  const control = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await control.setContent(`<style>body{margin:0;background:#08140f}</style><div style="height:2000px"></div>`);
  const empty = await control.evaluate(observe, "section");
  await control.setContent(`<style>body{margin:0}</style><div style="position:relative;height:844px"><div class="frame" style="position:absolute;inset:0"><img style="width:100%;height:100%;display:block;pointer-events:none" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='10'%3E%3Crect width='10' height='10' fill='%23345'/%3E%3C/svg%3E"></div></div>`);
  const framed = await control.evaluate(observe, "section");
  if (empty.text !== 0 || framed.text === 0) fail("control", `expected an empty screen blank and a framed photograph not, saw ${empty.text} and ${framed.text}`);
  await control.close();
}

await browser.close();
server?.kill();
console.log(JSON.stringify({ base: BASE, profiles: PROFILES.map((p) => p.name), routes: ROUTES, failures }, null, 2));
process.exit(failures.length ? 1 : 0);
