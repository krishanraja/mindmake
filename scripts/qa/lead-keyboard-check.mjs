#!/usr/bin/env node
/**
 * The lead dialog with a software keyboard up, on a phone.
 *
 * Reported (Krish, 2026-09-25) from Android Chrome with the Samsung keyboard:
 * "The keyboard interaction on this lead capture form on mobile is absolutely
 * horrendous. It just is not usable at all." The name fields sat under the
 * sticky header and progress rail while the keyboard and its autofill strip
 * took the bottom half of the screen.
 *
 * No browser automation raises a real software keyboard, so this does what
 * the keyboard does to the page: it shrinks the visual viewport the dialog
 * measures, first to the keyboard alone and then with an autofill strip on
 * top, and fires the resize a phone fires. Then, for every text field on the
 * journey, it asks what a person would ask: is the label, the field and its
 * hint or error on screen, between the bottom of the sticky header and the
 * top of the keyboard?
 *
 * Also held: the header and the rail do not overlap, the step's action fits
 * the space left above the keyboard, nothing scrolls sideways, and
 * first.last@company.com arrives on the name step with both names filled.
 *
 * Reported again (Krish, 2026-09-26, Android Chrome at 412x915): "Every time I
 * click on the keyboard on this screen it just obstructs the actual text box
 * I'm trying to type into." That was the homepage, whose dialog is the drawer,
 * and this check had only ever walked the centred card from /case-studies. It
 * now walks both, plus /ai-brain's drawer, the fields of the offer of a person
 * that opens under a personal address, and a visual viewport that iOS has
 * panned as well as shrunk. The offer's own button is also pressed, because it
 * used to reload the page from inside a nested form.
 *
 * Everything runs against a local dev server whose Supabase address does not
 * exist. The company read and the code request are answered with fixtures;
 * every other function call is refused, so nothing is researched or sent.
 *
 *   node scripts/qa/lead-keyboard-check.mjs [--root <checkout>] [--out <dir>]
 *
 * `--root` points it at another checkout (the negative control runs it against
 * main, which must fail). Chromium only, from PLAYWRIGHT_CHROMIUM or the
 * preinstalled /opt/pw-browsers/chromium.
 */
import { existsSync, realpathSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const root = resolve(flag("root") ?? fileURLToPath(new URL("../../", import.meta.url)));
/* `--only <text>` walks only the labels containing it, e.g. "decision". */
const only = flag("only");
const output = resolve(flag("out") ?? resolve(fileURLToPath(new URL("../../", import.meta.url)), "artifacts/lead-keyboard"));
const { createServer } = await import(resolve(root, "node_modules/vite/dist/node/index.js"));

const failures = [];
const observations = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

const dossier = {
  identity: { name: "Peldon Rose" },
  understanding: { descriptor: "A workplace design and build company.", products: ["Office design"] },
  synthesis: "Peldon Rose designs and builds workplaces.",
};

/* Visible heights with the keyboard up: the keyboard alone, then with the
   autofill strip Chrome and the Samsung keyboard add above it. */
const viewports = [
  { width: 412, height: 915, keyboard: [480, 380] },
  { width: 390, height: 844, keyboard: [400, 330], pan: 140 },
  { width: 320, height: 568, keyboard: [300, 250] },
  { width: 844, height: 390, keyboard: [200, 160], landscape: true },
];

await mkdir(output, { recursive: true });
const server = await createServer({
  root,
  configFile: resolve(root, "vite.config.ts"),
  define: {
    "import.meta.env.VITE_SUPABASE_URL": JSON.stringify("https://mindmake-qa.invalid"),
    "import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY": JSON.stringify("mindmake-designated-synthetic-key"),
    "import.meta.env.VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED": JSON.stringify("true"),
  },
  server: {
    host: "127.0.0.1",
    port: 0,
    strictPort: false,
    hmr: false,
    fs: { allow: [root, realpathSync(resolve(root, "node_modules"))] },
  },
  logLevel: "error",
});
await server.listen();
const origin = `http://127.0.0.1:${server.httpServer.address().port}`;

const executablePath = process.env.PLAYWRIGHT_CHROMIUM ?? (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(executablePath ? { executablePath } : {});

async function prepare(page) {
  await page.addInitScript(() => {
    localStorage.setItem("mindmake_consent", "accepted");
    /* A visual viewport this script can shrink the way a keyboard does. */
    const real = window.visualViewport;
    const fake = new EventTarget();
    const state = { height: null, top: 0 };
    for (const [key, read] of Object.entries({
      height: () => state.height ?? real?.height ?? window.innerHeight,
      width: () => real?.width ?? window.innerWidth,
      offsetTop: () => state.top,
      offsetLeft: () => 0,
      pageTop: () => window.scrollY,
      pageLeft: () => window.scrollX,
      scale: () => 1,
    })) Object.defineProperty(fake, key, { get: read });
    Object.defineProperty(window, "visualViewport", { configurable: true, get: () => fake });
    window.__mmKeyboard = (visibleHeight, panned = 0) => {
      state.height = visibleHeight;
      state.top = visibleHeight === null ? 0 : panned;
      fake.dispatchEvent(new Event("resize"));
    };
  });
  await page.route("**/functions/v1/**", async (route) => {
    const request = route.request();
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    };
    if (request.method() === "OPTIONS") {
      await route.fulfill({ status: 204, headers: cors, body: "" });
      return;
    }
    const json = (body) => route.fulfill({ status: 200, contentType: "application/json", headers: cors, body: JSON.stringify(body) });
    if (request.url().includes("/enrich-company")) return json(dossier);
    if (request.url().includes("/submit-mindmake-brief")) {
      const body = request.postDataJSON();
      if (body?.action === "request") {
        return json({ version: 2, success: true, status: "verification_required", requestId: body.requestId });
      }
    }
    await route.abort("blockedbyclient");
  });
}

/* The centred card (/case-studies, which also loads the stylesheet the
   offer of a person is otherwise dressed from), the homepage's drawer and
   /ai-brain's drawer. */
const entries = [
  { name: "card", path: "/case-studies?start=1", door: /Build your AI GTM/ },
  { name: "home", path: "/?start=brain" },
  { name: "brain", path: "/ai-brain?start=brain" },
];

const settle = (page) => page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 60)))));

/* Where everything is, read from the page the way a person would see it. */
const BRIEF_PANEL = '.mm-brief-panel[role="dialog"]';

async function measure(page, fieldSelector, actionSelector, panelSelector = BRIEF_PANEL) {
  return page.evaluate(([selector, action, panelAt]) => {
    const panel = document.querySelector(panelAt);
    const field = document.querySelector(selector);
    const viewport = window.visualViewport;
    const visibleBottom = Math.min(panel.getBoundingClientRect().bottom, viewport.offsetTop + viewport.height);
    const top = panel.querySelector(".mm-brief-top");
    const rail = panel.querySelector(".mm-brief-path");
    const sticky = (element) => element && getComputedStyle(element).position === "sticky" && getComputedStyle(element).display !== "none";
    const chromeBottom = Math.max(
      panel.getBoundingClientRect().top,
      viewport.offsetTop,
      ...[top, rail].filter(sticky).map((element) => element.getBoundingClientRect().bottom),
    );
    const group = [
      ...(field.labels ? Array.from(field.labels) : []),
      field,
      ...(field.getAttribute("aria-describedby") ?? "").split(/\s+/).map((id) => id && document.getElementById(id)).filter(Boolean),
    ].map((element) => element.getBoundingClientRect()).filter((rect) => rect.height > 0);
    const groupTop = Math.min(...group.map((rect) => rect.top));
    const groupBottom = Math.max(...group.map((rect) => rect.bottom));
    const actionRect = action ? document.querySelector(action)?.getBoundingClientRect() : null;
    return {
      focused: document.activeElement === field,
      chromeBottom: Math.round(chromeBottom),
      visibleBottom: Math.round(visibleBottom),
      groupTop: Math.round(groupTop),
      groupBottom: Math.round(groupBottom),
      headerBottom: top ? Math.round(top.getBoundingClientRect().bottom) : null,
      railTop: sticky(rail) ? Math.round(rail.getBoundingClientRect().top) : null,
      actionHeight: actionRect ? Math.round(actionRect.height) : null,
      keyboardFlag: panel.getAttribute("data-keyboard") ?? panel.parentElement.getAttribute("data-keyboard"),
      sideways: Math.max(document.documentElement.scrollWidth - window.innerWidth, panel.scrollWidth - panel.clientWidth),
    };
  }, [fieldSelector, actionSelector, panelSelector]);
}

async function checkField(page, label, name, fieldSelector, actionSelector, heights, pan = 0, panelSelector = BRIEF_PANEL) {
  const shots = [];
  await page.evaluate(() => window.__mmKeyboard(null));
  await settle(page);
  await page.locator(fieldSelector).evaluate((element) => element.focus({ preventScroll: true }));
  /* The last height is tried again with the visual viewport panned down, the
     way iOS moves it to show a field, when the viewport asks for that. */
  const states = [...heights.map((visible) => [visible, 0]), ...(pan ? [[heights.at(-1), pan]] : [])];
  for (const [index, [visible, panned]] of states.entries()) {
    await page.evaluate(([height, top]) => window.__mmKeyboard(height, top), [visible, panned]);
    await settle(page);
    const box = await measure(page, fieldSelector, actionSelector, panelSelector);
    const where = `${label} ${name} with ${visible}px visible${panned ? `, panned ${panned}px` : ""}`;
    const inView = box.groupTop >= box.chromeBottom - 1 && box.groupBottom <= box.visibleBottom + 1;
    const band = box.visibleBottom - box.chromeBottom;
    fail(!box.focused, `${where}: the field lost focus`);
    fail(!inView, `${where}: label, field or hint outside the visible band (group ${box.groupTop}-${box.groupBottom}, band ${box.chromeBottom}-${box.visibleBottom})`);
    fail(box.railTop !== null && box.headerBottom !== null && box.railTop < box.headerBottom - 1, `${where}: the progress rail slides under the header (${box.railTop} < ${box.headerBottom})`);
    fail(box.actionHeight !== null && box.actionHeight > band, `${where}: the step's action (${box.actionHeight}px) cannot fit above the keyboard (${band}px)`);
    fail(box.sideways > 1, `${where}: the page scrolls sideways by ${box.sideways}px`);
    fail(box.keyboardFlag !== "open", `${where}: the dialog did not register the keyboard`);
    observations.push({ viewport: label, field: name, visibleHeight: visible, panned, ...box, inView });
    if (index >= heights.length - 1) {
      const file = `${label}-${name}-keyboard${panned ? "-panned" : ""}.png`.replace(/[^a-z0-9.-]+/gi, "-");
      await page.screenshot({ path: resolve(output, file), clip: { x: 0, y: panned, width: page.viewportSize().width, height: visible } });
      shots.push(file);
    }
  }
  await page.evaluate(() => window.__mmKeyboard(null));
  await page.locator(fieldSelector).evaluate((element) => element.blur());
  await settle(page);
  return shots;
}

try {
  for (const viewport of viewports) for (const entry of entries) {
    const label = `${entry.name}-${viewport.width}x${viewport.height}`;
    if (only && !label.includes(only)) continue;
    try {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await prepare(page);
    await page.goto(`${origin}${entry.path}`, { waitUntil: "domcontentloaded" });
    const dialog = page.locator('.mm-brief-panel[role="dialog"]');
    await dialog.waitFor({ state: "visible", timeout: 30000 });
    await page.evaluate(() => document.fonts.ready);
    if (entry.door) await dialog.getByRole("button", { name: entry.door }).click();

    await dialog.locator("#mm-company-email").fill("anya.divekar@peldonrose.com");
    await checkField(page, label, "company-email", "#mm-company-email", '.is-company [data-mm-primary]', viewport.keyboard, viewport.pan);

    /* A personal address, the offer of a person, and its three fields. */
    await dialog.locator("#mm-company-email").fill("anya@gmail.com");
    await dialog.getByRole("button", { name: /read the business/i }).click();
    await dialog.locator(".mm-handoff-trigger").click();
    await dialog.locator(".mm-handoff .mm-details").waitFor();
    const handoffInputs = await page.locator(".mm-handoff .mm-details input").evaluateAll((inputs) => inputs.map((input) => input.id));
    for (const [index, name] of ["handoff-first-name", "handoff-last-name", "handoff-email"].entries()) {
      const selector = `[id="${handoffInputs[index]}"]`;
      fail(!handoffInputs[index], `${label}: the offer of a person has no ${name} field`);
      if (handoffInputs[index]) await checkField(page, label, name, selector, ".mm-handoff .mm-details [data-mm-primary]", viewport.keyboard, viewport.pan);
    }
    /* Its button, with the names still empty, answers with the name error
       and leaves the page where it is. Inside the company form it reloaded
       the page instead. */
    const before = page.url();
    await dialog.locator(".mm-handoff").getByRole("button", { name: /have a person pick this up/i }).click();
    await settle(page);
    const stayed = await dialog.count() === 1 && page.url() === before && await dialog.locator(".mm-handoff .mm-journey-error").isVisible();
    fail(!stayed, `${label}: pressing the offer's button did not answer in place (url ${page.url()})`);
    if (!stayed) throw new Error("the offer's button left the dialog");

    await dialog.locator("#mm-company-email").fill("anya.divekar@peldonrose.com");
    await dialog.getByRole("button", { name: /read the business/i }).click();
    await dialog.getByRole("heading", { name: "Who is this for?" }).waitFor();

    const filled = [await dialog.locator("#mm-first-name").inputValue(), await dialog.locator("#mm-last-name").inputValue()];
    fail(filled[0] !== "Anya" || filled[1] !== "Divekar", `${label}: anya.divekar@ did not arrive as Anya / Divekar (got ${filled.join(" / ")})`);
    /* Typed in when the address did not fill them, so the rest of the walk
       still measures the keyboard rather than stopping at the name error. */
    if (!filled[0]) await dialog.locator("#mm-first-name").fill("Anya");
    if (!filled[1]) await dialog.locator("#mm-last-name").fill("Divekar");
    observations.push({ viewport: label, step: "profile", prefilled: filled });
    await page.screenshot({ path: resolve(output, `${label}-profile-prefilled.png`) });
    await checkField(page, label, "first-name", "#mm-first-name", '.is-profile [data-mm-primary]', viewport.keyboard, viewport.pan);
    await checkField(page, label, "last-name", "#mm-last-name", '.is-profile [data-mm-primary]', viewport.keyboard, viewport.pan);

    const select = dialog.locator(".mm-brief-role-select");
    if (await select.isVisible()) await select.selectOption("leadership");
    else await dialog.getByRole("button", { name: "Leadership" }).click();
    await dialog.getByRole("button", { name: /see the company read/i }).click();
    await dialog.getByRole("heading", { name: "This is what I can see so far." }).waitFor({ timeout: 15000 });
    await dialog.locator(".mm-choice-grid button").first().click();
    await dialog.getByRole("button", { name: /use this problem/i }).click();
    await dialog.getByRole("button", { name: "Grow this business" }).click();
    await dialog.getByRole("button", { name: /show me the recommendation/i }).click();
    await page.locator('.mm-brief-panel[data-step="preview"] .mm-folio').waitFor({ state: "visible" });
    await page.screenshot({ path: resolve(output, `${label}-preview-header.png`) });
    for (let leaf = 0; leaf < 3; leaf += 1) {
      const next = dialog.getByRole("button", { name: /next leaf/i });
      if (await next.isVisible()) await next.click();
    }
    await dialog.getByRole("button", { name: /keep the private brief/i }).click();
    await dialog.getByRole("button", { name: /^continue/i }).click();

    await dialog.locator("#mm-work-email").waitFor();
    await checkField(page, label, "contact-email", "#mm-work-email", ".is-contact .mm-button", viewport.keyboard, viewport.pan);
    await dialog.getByRole("button", { name: /send the code/i }).click();
    await dialog.locator("#mm-verification-code").waitFor();
    await checkField(page, label, "code", "#mm-verification-code", ".is-verify .mm-button", viewport.keyboard, viewport.pan);
    await context.close();
    } catch (error) {
      failures.push(`${label}: the walk stopped: ${String(error?.message ?? error).split("\n")[0]}`);
    }
  }

  /* The other dialog on the site that asks for text before the lead dialog:
     "Start here" on /new-age-leadership, one decision in a textarea. */
  for (const viewport of viewports) {
    const label = `decision-${viewport.width}x${viewport.height}`;
    if (only && !label.includes(only)) continue;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: true,
      hasTouch: true,
      deviceScaleFactor: 2,
      reducedMotion: "reduce",
    });
    try {
      const page = await context.newPage();
      await prepare(page);
      await page.goto(`${origin}/new-age-leadership`, { waitUntil: "domcontentloaded" });
      const start = page.locator(".mm-decision-balance-start");
      await start.waitFor({ state: "attached", timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      await start.scrollIntoViewIfNeeded();
      await start.click();
      await page.locator(".mm-decision-balance-dialog textarea").waitFor({ state: "visible" });
      await checkField(page, label, "decision", ".mm-decision-balance-dialog textarea", ".mm-decision-balance-frame", viewport.keyboard, viewport.pan, ".mm-decision-balance-dialog");
    } catch (error) {
      failures.push(`${label}: the walk stopped: ${String(error?.message ?? error).split("\n")[0]}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

const landscape = failures.filter((message) => message.includes("844x390"));
const blocking = failures.filter((message) => !message.includes("844x390"));
const receipt = {
  check: "lead-keyboard",
  root,
  capturedAt: new Date().toISOString(),
  passed: blocking.length === 0,
  failures: blocking,
  knownLimits: landscape,
  observations,
};
await writeFile(resolve(output, "lead-keyboard-receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
if (landscape.length) {
  console.log(`LEAD KEYBOARD: ${landscape.length} landscape limit(s) recorded, not blocking:`);
  for (const message of landscape) console.log(`  - ${message}`);
}
if (blocking.length) {
  console.error(`LEAD KEYBOARD CHECK FAILED (${blocking.length}):`);
  for (const message of blocking) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`LEAD KEYBOARD CHECK PASSED: ${observations.length} observations, screenshots in ${output}`);
