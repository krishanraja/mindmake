import { chromium } from "/home/user/mindmake/node_modules/playwright/index.mjs";
const [base = "http://127.0.0.1:4180", label = "cand"] = process.argv.slice(2);
const sizes = (process.env.SIZES || "1920x1080,1440x900,1280x600,1024x700,720x450,320x568").split(",");
const routes = (process.env.ROUTES || "/new-age-leadership/,/").split(",");
const b = await chromium.launch();
let hidden = 0;
for (const route of routes) for (const size of sizes) for (const reduced of [false, true]) for (const cookie of [false, true]) {
  const [w, h] = size.split("x").map(Number);
  const ctx = await b.newContext({ viewport: { width: w, height: h }, reducedMotion: reduced ? "reduce" : "no-preference", isMobile: w <= 620, hasTouch: w <= 620 });
  if (!cookie) await ctx.addInitScript(() => { try { localStorage.setItem("mindmake_consent", "declined"); } catch {} });
  const page = await ctx.newPage();
  await page.goto(base + route, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  /* Start on the last focusable before the section, then Tab through it. */
  await page.evaluate(() => {
    const panel = document.querySelector("[data-benefits]");
    const all = [...document.querySelectorAll("a[href], button, [tabindex]:not([tabindex='-1'])")].filter((n) => !n.closest("[inert]") && n.getClientRects().length);
    const before = all.filter((n) => n.compareDocumentPosition(panel) & Node.DOCUMENT_POSITION_FOLLOWING && !panel.contains(n)).pop();
    before?.focus({ preventScroll: false });
  });
  const steps = [];
  for (let i = 0; i < 14; i++) {
    await page.keyboard.press("Tab");
    await page.waitForTimeout(reduced ? 120 : 650);
    const r = await page.evaluate(() => {
      const el = document.activeElement; const panel = document.querySelector("[data-benefits]");
      if (!el || !panel.contains(el)) return { inside: false };
      const box = el.getBoundingClientRect();
      const covers = [...document.querySelectorAll(".mm-action-bar.is-shown, .mm-cookie-notice")].filter((n) => getComputedStyle(n).display !== "none" && getComputedStyle(n).visibility !== "hidden").map((n) => n.getBoundingClientRect());
      const under = covers.some((c) => box.top >= c.top - 0.5 && box.bottom <= c.bottom + 0.5 && box.left >= c.left - 0.5 && box.right <= c.right + 0.5);
      const off = box.bottom > innerHeight + 0.5 || box.top < -0.5;
      const name = el.getAttribute("aria-label") || el.textContent.trim().slice(0, 14);
      return { inside: true, name, hidden: under || off, why: under ? "covered" : off ? "off-screen" : "" };
    });
    if (!r.inside) { if (steps.length) break; else continue; }
    steps.push(r.hidden ? `${r.name}[${r.why}]` : r.name);
    if (r.hidden) hidden += 1;
  }
  const bad = steps.filter((x) => x.includes("[")).length;
  console.log(`${label} ${route} ${size} ${reduced ? "reduced" : "motion "} ${cookie ? "cookie" : "      "} hidden=${bad}  ${steps.join(" > ")}`);
  await ctx.close();
}
await b.close();
console.log(`${label} TOTAL hidden focus stops: ${hidden}`);
