#!/usr/bin/env node
/**
 * Text contrast through the whole lead dialog, in every state a visitor sees.
 *
 * Reported (Krish, 2026-09-26) from Android Chrome: "Text colour contrast
 * issues here." The handoff form that opens under a personal address set its
 * question and its eight division choices in the dark site's pale tokens on
 * the dialog's cream paper, and the paper step's own captions ("Work email",
 * "We use the domain, not your inbox.") sat at 3.4:1. Nothing measured them.
 *
 * This walks the dialog from the homepage drawer, door to success, including
 * the personal-address handoff with a division chosen, the code-not-sent
 * handoff and a pressed choice on every choice step, and at each state it
 * measures every visible run of text against the ground actually behind it:
 * the text colour composited over the stacked backgrounds of its ancestors,
 * with ancestor opacity applied. Placeholders are measured too. The bar is
 * WCAG AA, 4.5:1, or 3:1 for large text (24px, or 18.66px bold). Disabled
 * controls are exempt in WCAG but still held to 3:1 here, because the
 * progress rail is read even when its stages cannot be pressed yet.
 *
 * Text over the preview's film has no single ground and is reported as
 * unmeasured rather than guessed at. Chromium only; every backend call is
 * answered by a fixture or refused, so nothing is researched or sent.
 *
 *   node scripts/qa/lead-contrast-check.mjs [--root <checkout>] [--out <dir>]
 */
import { existsSync, realpathSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const args = process.argv.slice(2);
const flag = (name) => { const at = args.indexOf(`--${name}`); return at === -1 ? undefined : args[at + 1]; };
const root = resolve(flag("root") ?? fileURLToPath(new URL("../../", import.meta.url)));
const output = resolve(flag("out") ?? resolve(fileURLToPath(new URL("../../", import.meta.url)), "artifacts/lead-contrast"));
const { createServer } = await import(resolve(root, "node_modules/vite/dist/node/index.js"));

const failures = [];
const measured = [];
const unmeasured = new Set();

const dossier = {
  identity: { name: "Peldon Rose" },
  understanding: { descriptor: "A workplace design and build company.", products: ["Office design"] },
  synthesis: "Peldon Rose designs and builds workplaces.",
};

/* The homepage's drawer, which asks for the door; /ai-brain's drawer, which
   does not; and /about's card, whose page loads mindmake-instruments.css, the
   stylesheet that turned the offer of a person pale (it stays loaded after a
   visitor moves on from /about or /case-studies to any other page). */
const entries = [
  { name: "home", path: "/?start=1", door: /Build your AI brain/ },
  { name: "brain", path: "/ai-brain?start=brain" },
  { name: "about", path: "/about?start=1", door: /Build your AI GTM/ },
];

const viewports = [
  { width: 412, height: 915, mobile: true },
  { width: 1440, height: 900, mobile: false },
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
  await page.addInitScript(() => localStorage.setItem("mindmake_consent", "accepted"));
  let requests = 0;
  await page.route("**/functions/v1/**", async (route) => {
    const request = route.request();
    const cors = {
      "access-control-allow-origin": "*",
      "access-control-allow-headers": "authorization, x-client-info, apikey, content-type",
      "access-control-allow-methods": "POST, OPTIONS",
    };
    if (request.method() === "OPTIONS") return route.fulfill({ status: 204, headers: cors, body: "" });
    const json = (body) => route.fulfill({ status: 200, contentType: "application/json", headers: cors, body: JSON.stringify(body) });
    if (request.url().includes("/enrich-company")) return json(dossier);
    if (request.url().includes("/submit-mindmake-brief")) {
      const body = request.postDataJSON();
      /* The first request fails, so the code-not-sent offer is measured; the
         second is answered, so the walk reaches the code. */
      if (body?.action === "request" && (requests += 1) > 1) {
        return json({ version: 2, success: true, status: "verification_required", requestId: body.requestId });
      }
      if (body?.action === "confirm") {
        return json({ version: 2, success: true, status: "confirmed", requestId: body.requestId, leadId: "synthetic-contrast-check", visitorDelivery: "queued", operatorDelivery: "queued", publicationInterestRecorded: false });
      }
    }
    return route.abort("blockedbyclient");
  });
}

const settle = (page) => page.evaluate(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(() => setTimeout(done, 120)))));

/* Everything below runs in the page. */
function audit() {
  const parse = (value) => {
    const match = value.match(/rgba?\(([^)]+)\)/);
    if (!match) return null;
    const parts = match[1].split(/[\s,/]+/).filter(Boolean).map(Number);
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length > 3 ? parts[3] : 1 };
  };
  const over = (top, bottom) => ({
    r: top.r * top.a + bottom.r * (1 - top.a),
    g: top.g * top.a + bottom.g * (1 - top.a),
    b: top.b * top.a + bottom.b * (1 - top.a),
    a: 1,
  });
  const luminance = ({ r, g, b }) => {
    const channel = (value) => { const c = value / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  const ratio = (a, b) => { const [x, y] = [luminance(a), luminance(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
  const hex = ({ r, g, b }) => `#${[r, g, b].map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;

  /* The ground behind an element: every ancestor's background, stacked. A
     gradient of one colour (the dialog's header) counts as that colour; any
     other image, or the film under the preview, leaves the ground unknown,
     unless an opaque background nearer the text already covers it. */
  const ground = (element) => {
    const chain = [];
    let unknown = null;
    let covered = false;
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const style = getComputedStyle(node);
      const layers = [];
      const colour = parse(style.backgroundColor);
      const image = style.backgroundImage;
      if (image && image !== "none") {
        const colours = [...image.matchAll(/rgba?\([^)]+\)/g)].map((m) => m[0]);
        const unique = [...new Set(colours)];
        if (image.includes("url(") || unique.length !== 1) {
          if (!covered) unknown ??= `background image on ${node.className || node.tagName}`;
        } else layers.push(parse(unique[0]));
      }
      if (colour && colour.a > 0) layers.push(colour);
      if (node.matches?.(".mm-folio-preview") && !covered) unknown ??= "text over the preview film";
      if (layers.some((layer) => layer.a >= 0.99) && Number(style.opacity) >= 0.99) covered = true;
      chain.push({ opacity: Number(style.opacity), layers });
    }
    /* Painted from the page down: each node lays its backgrounds over what
       is behind it, then its children (or, at the element, the text), and
       the whole is blended back by the node's opacity, as a browser does
       for a group. Run once without the text for the ground and once with
       it for the colour the text actually shows. */
    const mix = (top, bottom, amount) => ({
      r: top.r * amount + bottom.r * (1 - amount),
      g: top.g * amount + bottom.g * (1 - amount),
      b: top.b * amount + bottom.b * (1 - amount),
      a: 1,
    });
    const paint = (index, behind, text) => {
      let inner = behind;
      for (const layer of [...chain[index].layers].reverse()) inner = over(layer, inner);
      inner = index === 0 ? (text ? over(text, inner) : inner) : paint(index - 1, inner, text);
      return mix(inner, behind, chain[index].opacity);
    };
    const white = { r: 255, g: 255, b: 255, a: 1 };
    return {
      colour: paint(chain.length - 1, white, null),
      shown: (fg) => paint(chain.length - 1, white, fg),
      unknown,
    };
  };

  const visible = (element) => {
    const rect = element.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return false;
    for (let node = element; node && node.nodeType === 1; node = node.parentElement) {
      const style = getComputedStyle(node);
      if (style.display === "none" || style.visibility === "hidden" || Number(style.opacity) === 0) return false;
      if (style.clip === "rect(0px, 0px, 0px, 0px)" || style.clipPath === "inset(50%)") return false;
    }
    /* Covered by one of the preview's own panels (the time editor, the keep
       confirmation), the text under it is not what anybody is reading. */
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    if (x >= 0 && y >= 0 && x < window.innerWidth && y < window.innerHeight) {
      const top = document.elementFromPoint(x, y);
      const overlay = (node) => node?.closest?.(".mm-folio-panel") ?? null;
      if (top && !element.contains(top) && !top.contains(element) && overlay(top) && overlay(top) !== overlay(element)) return false;
    }
    return true;
  };

  const panel = document.querySelector('.mm-brief-panel[role="dialog"]');
  const results = [];
  const record = (element, text, colourValue, kind) => {
    const style = getComputedStyle(element);
    const { colour: bg, shown: paintText, unknown } = ground(element);
    const fg = parse(colourValue);
    if (!fg) return;
    const size = parseFloat(style.fontSize);
    const bold = Number(style.fontWeight) >= 700;
    const large = size >= 24 || (bold && size >= 18.66);
    const disabled = element.closest("button:disabled, [aria-disabled='true'], fieldset:disabled") !== null;
    const needed = disabled ? 3 : large ? 3 : 4.5;
    const shown = paintText(fg);
    const value = ratio(shown, bg);
    results.push({
      text: text.slice(0, 70),
      kind,
      selector: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${typeof element.className === "string" && element.className ? `.${element.className.trim().split(/\s+/).join(".")}` : ""}`,
      fg: hex(shown),
      bg: hex(bg),
      size,
      disabled,
      needed,
      ratio: Math.round(value * 100) / 100,
      unknown,
      /* Text over a film or a picture is measured from the pixels instead:
         tagged here, read from a screenshot with the text hidden. */
      probe: unknown ? (element.setAttribute("data-contrast-probe", String(results.length)), String(results.length)) : null,
      raw: fg,
    });
  };

  for (const element of panel.querySelectorAll("*")) {
    if (!visible(element)) continue;
    const text = Array.from(element.childNodes)
      .filter((node) => node.nodeType === 3)
      .map((node) => node.textContent.trim())
      .join(" ")
      .trim();
    if (text) record(element, text, getComputedStyle(element).color, "text");
    if (element instanceof HTMLInputElement && !["checkbox", "radio", "hidden"].includes(element.type)) {
      if (element.value) record(element, element.value, getComputedStyle(element).color, "value");
      else if (element.placeholder) record(element, element.placeholder, getComputedStyle(element, "::placeholder").color, "placeholder");
    }
    if (element instanceof HTMLSelectElement) record(element, element.selectedOptions[0]?.textContent ?? "", getComputedStyle(element).color, "value");
    /* An icon that stands for something is held to 3:1, as a graphic. */
    if (element instanceof SVGSVGElement && element.getAttribute("aria-hidden") !== "true" || element.matches?.("svg.mm-q-mark, .mm-handoff svg.mm-i")) {
      const style = getComputedStyle(element);
      const stroke = [...element.querySelectorAll("[stroke]:not([stroke='none'])")]
        .map((node) => getComputedStyle(node).stroke)
        .find((value) => value.startsWith("rgb"));
      const { colour: bg, shown: paintMark, unknown } = ground(element);
      const fg = parse(stroke ?? style.color);
      if (fg) {
        const shown = paintMark(fg);
        results.push({ text: `[icon] ${element.getAttribute("class") ?? "svg"}`, kind: "icon", selector: "svg", fg: hex(shown), bg: hex(bg), size: 0, disabled: false, needed: 3, ratio: Math.round(ratio(shown, bg) * 100) / 100, unknown });
      }
    }
  }
  return { step: panel.getAttribute("data-step"), tone: panel.getAttribute("data-tone"), results };
}

/* For text with no single ground: hide the text, take the screenshot, and
   measure the text colour against every pixel of the box it sat in. The
   ratio reported is the one 95% of those pixels meet or beat. */
async function probePixels(page, results) {
  const probes = results.filter((item) => typeof item.probe === "string");
  if (probes.length === 0) return;
  await page.addStyleTag({ content: "[data-contrast-probe]{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important;caret-color:transparent!important}" });
  await settle(page);
  const shot = (await page.screenshot({ fullPage: false })).toString("base64");
  const readings = await page.evaluate(async ([png, items]) => {
    const image = new Image();
    image.src = `data:image/png;base64,${png}`;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = image.width;
    canvas.height = image.height;
    const context = canvas.getContext("2d", { willReadFrequently: true });
    context.drawImage(image, 0, 0);
    const scale = image.width / window.innerWidth;
    const channel = (value) => { const c = value / 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    const luminance = (r, g, b) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
    const out = {};
    for (const item of items) {
      const element = document.querySelector(`[data-contrast-probe="${item.probe}"]`);
      const rect = element?.getBoundingClientRect();
      if (!rect) continue;
      const x = Math.max(0, Math.floor(rect.left * scale));
      const y = Math.max(0, Math.floor(rect.top * scale));
      const width = Math.min(canvas.width - x, Math.ceil(rect.width * scale));
      const height = Math.min(canvas.height - y, Math.ceil(rect.height * scale));
      if (width < 2 || height < 2) continue;
      const data = context.getImageData(x, y, width, height).data;
      const ratios = [];
      for (let index = 0; index < data.length; index += 16) {
        const a = item.raw.a;
        const r = item.raw.r * a + data[index] * (1 - a);
        const g = item.raw.g * a + data[index + 1] * (1 - a);
        const b = item.raw.b * a + data[index + 2] * (1 - a);
        const [hi, lo] = [luminance(r, g, b), luminance(data[index], data[index + 1], data[index + 2])].sort((m, n) => n - m);
        ratios.push((hi + 0.05) / (lo + 0.05));
      }
      ratios.sort((m, n) => m - n);
      out[item.probe] = Math.round(ratios[Math.floor(ratios.length * 0.05)] * 100) / 100;
    }
    document.querySelectorAll("[data-contrast-probe]").forEach((element) => element.removeAttribute("data-contrast-probe"));
    return out;
  }, [shot, probes.map(({ probe, raw }) => ({ probe, raw }))]);
  for (const item of probes) {
    if (readings[item.probe] === undefined) continue;
    item.ratio = readings[item.probe];
    item.bg = `pixels (${item.unknown})`;
    item.unknown = null;
  }
}

async function snapshot(page, label, state) {
  await settle(page);
  const { step, tone, results } = await page.evaluate(audit);
  await probePixels(page, results);
  for (const item of results) {
    const where = `${label} ${state} (${step}/${tone})`;
    delete item.raw;
    delete item.probe;
    if (item.unknown) { unmeasured.add(`${where}: "${item.text}" (${item.unknown})`); continue; }
    measured.push({ viewport: label, state, step, tone, ...item });
    if (item.ratio + 0.005 < item.needed) {
      failures.push(`${where}: "${item.text}" ${item.selector} ${item.fg} on ${item.bg} is ${item.ratio}:1, needs ${item.needed}:1`);
    }
  }
  const file = `${label}-${state}.png`.replace(/[^a-z0-9.-]+/gi, "-");
  await page.screenshot({ path: resolve(output, file), fullPage: false });
}

try {
  for (const viewport of viewports) for (const entry of entries) {
    const label = `${entry.name}-${viewport.width}x${viewport.height}`;
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      isMobile: viewport.mobile,
      hasTouch: viewport.mobile,
      deviceScaleFactor: viewport.mobile ? 2 : 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    try {
      await prepare(page);
      await page.goto(`${origin}${entry.path}`, { waitUntil: "domcontentloaded" });
      const dialog = page.locator('.mm-brief-panel[role="dialog"]');
      await dialog.waitFor({ state: "visible", timeout: 30000 });
      await page.evaluate(() => document.fonts.ready);
      if (entry.door) {
        await snapshot(page, label, "door");
        await dialog.getByRole("button", { name: entry.door }).click();
      }
      await snapshot(page, label, "company");

      await dialog.locator("#mm-company-email").fill("anya@gmail.com");
      await dialog.getByRole("button", { name: /read the business/i }).click();
      await dialog.locator(".mm-form-error").waitFor();
      await snapshot(page, label, "company-personal-email-error");
      await dialog.locator(".mm-handoff-trigger").click();
      await dialog.locator(".mm-handoff .mm-details").waitFor();
      await snapshot(page, label, "company-handoff-form");
      await dialog.locator(".mm-handoff .mm-qchip").nth(1).click();
      await snapshot(page, label, "company-handoff-form-chosen");
      await dialog.locator(".mm-handoff").getByRole("button", { name: /have a person pick this up/i }).click();
      await dialog.locator(".mm-handoff .mm-journey-error").waitFor();
      await snapshot(page, label, "company-handoff-form-error");

      await dialog.locator("#mm-company-email").fill("anya.divekar@peldonrose.com");
      await dialog.getByRole("button", { name: /read the business/i }).click();
      await dialog.getByRole("heading", { name: "Who is this for?" }).waitFor();
      await snapshot(page, label, "profile");
      await dialog.getByRole("button", { name: /see the company read/i }).click();
      await snapshot(page, label, "profile-division-error");
      const select = dialog.locator(".mm-brief-role-select");
      if (await select.isVisible()) await select.selectOption("leadership");
      else await dialog.getByRole("button", { name: "Leadership" }).click();
      await snapshot(page, label, "profile-chosen");
      await dialog.getByRole("button", { name: /see the company read/i }).click();
      await dialog.getByRole("heading", { name: "This is what I can see so far." }).waitFor({ timeout: 15000 });
      await snapshot(page, label, "pressure");
      await dialog.locator(".mm-choice-grid button").first().click();
      await snapshot(page, label, "pressure-chosen");
      await dialog.getByRole("button", { name: /use this problem/i }).click();
      await snapshot(page, label, "capacity");
      await dialog.getByRole("button", { name: "Grow this business" }).click();
      await snapshot(page, label, "capacity-chosen");
      await dialog.getByRole("button", { name: /show me the recommendation/i }).click();
      await page.locator('.mm-brief-panel[data-step="preview"] .mm-folio').waitFor({ state: "visible" });
      await snapshot(page, label, "preview");
      for (let leaf = 0; leaf < 3; leaf += 1) {
        const next = dialog.getByRole("button", { name: /next leaf/i });
        if (await next.isVisible()) await next.click();
      }
      await snapshot(page, label, "preview-last-leaf");
      await dialog.locator(".mm-folio-time-key button").click();
      await dialog.locator(".mm-folio-time-panel").waitFor();
      await snapshot(page, label, "preview-time-editor");
      await dialog.getByRole("button", { name: /keep current time/i }).click();
      await dialog.getByRole("button", { name: /keep the private brief/i }).click();
      await dialog.locator(".mm-folio-keep-panel").waitFor();
      await snapshot(page, label, "preview-keep-confirm");
      await dialog.getByRole("button", { name: /^continue/i }).click();
      await dialog.locator("#mm-work-email").waitFor();
      await snapshot(page, label, "contact");
      await dialog.getByRole("button", { name: /send the code/i }).click();
      await dialog.locator("#mm-work-email-error").waitFor();
      await snapshot(page, label, "contact-code-not-sent");
      await dialog.getByRole("button", { name: /send the code/i }).click();
      await dialog.locator("#mm-verification-code").waitFor();
      await snapshot(page, label, "verify");
      await dialog.locator("#mm-verification-code").fill("123456");
      await dialog.locator(".mm-success").waitFor({ timeout: 15000 });
      await snapshot(page, label, "success");
    } catch (error) {
      failures.push(`${label}: the walk stopped: ${String(error?.message ?? error).split("\n")[0]}`);
      await page.screenshot({ path: resolve(output, `${label}-stopped.png`) }).catch(() => undefined);
    }
    await context.close();
  }
} finally {
  await browser.close();
  await server.close();
}

const receipt = {
  check: "lead-contrast",
  root,
  capturedAt: new Date().toISOString(),
  passed: failures.length === 0,
  failures,
  unmeasured: [...unmeasured],
  lowest: [...measured].sort((a, b) => a.ratio / a.needed - b.ratio / b.needed).slice(0, 25),
  measured,
};
await writeFile(resolve(output, "lead-contrast-receipt.json"), `${JSON.stringify(receipt, null, 2)}\n`);
if (failures.length) {
  console.error(`LEAD CONTRAST CHECK FAILED (${failures.length}):`);
  for (const message of failures) console.error(`  - ${message}`);
  process.exit(1);
}
console.log(`LEAD CONTRAST CHECK PASSED: ${measured.length} measurements, ${unmeasured.size} over film left unmeasured, screenshots in ${output}`);
