/**
 * Verifies the currency switcher in a real browser against the built output.
 *
 * Checks the things a unit test cannot: that the choice survives navigation
 * and a reload, that the URL param beats the cookie and is then promoted into
 * it, that nothing auto-detects from locale, and that AUD (the longest price
 * strings) does not overflow at 390px.
 *
 * Requires a build first. See scripts/qa/README.md for the env vars the build
 * needs locally.
 */

import { chromium } from "playwright";
import { startServer } from "./serve-dist.mjs";

const PORT = 4180;
const B = `http://127.0.0.1:${PORT}`;

const server = await startServer(PORT);
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let failures = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}\n      got      ${actual}\n      expected ${expected}`);
};

try {
  // A locale that is emphatically not US, to prove nothing sniffs it.
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    locale: "en-AU",
    timezoneId: "Australia/Sydney",
  });
  const page = await ctx.newPage();
  const prices = async () =>
    (await page.$$eval("[data-price]", (ns) => ns.map((n) => n.textContent.trim()))).join(" ");

  await page.goto(`${B}/teardown`, { waitUntil: "networkidle" });
  check("default is USD despite en-AU locale and Sydney timezone", await prices(), "$9,500 $9,500");

  await page.getByLabel("Show prices in British pounds").check();
  await page.waitForTimeout(200);
  check("switching to GBP on /teardown", await prices(), "£7,500 £7,500");

  await page.goto(`${B}/handover`, { waitUntil: "networkidle" });
  check("GBP persists across navigation to /handover", await prices(), "£14,000 £23,500 £39,000 £7,500");

  await page.reload({ waitUntil: "networkidle" });
  check("GBP survives a reload", await prices(), "£14,000 £23,500 £39,000 £7,500");

  const cookie = (await ctx.cookies()).find((c) => c.name === "mm_currency");
  check("choice is persisted in a cookie", cookie?.value, "GBP");

  await page.getByLabel("Show prices in Australian dollars").check();
  await page.waitForTimeout(200);
  check("switching to AUD on /handover", await prices(), "$27,500 $45,500 $76,000 $14,500");

  await page.goto(`${B}/teardown?currency=usd`, { waitUntil: "networkidle" });
  check("URL param overrides the stored cookie", await prices(), "$9,500 $9,500");

  await page.goto(`${B}/teardown`, { waitUntil: "networkidle" });
  check("param was promoted into the cookie", await prices(), "$9,500 $9,500");

  await page.goto(`${B}/teardown?currency=nonsense`, { waitUntil: "networkidle" });
  check("an unparseable param falls back rather than throwing", await prices(), "$9,500 $9,500");

  // Overflow, in the currency with the longest strings, at the narrowest width.
  await page.setViewportSize({ width: 390, height: 844 });
  for (const route of ["/teardown", "/handover"]) {
    await page.goto(`${B}${route}?currency=aud`, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);
    const { sw, cw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      cw: document.documentElement.clientWidth,
    }));
    check(`${route} at 390px in AUD does not overflow (${sw} <= ${cw})`, sw <= cw, true);
  }
  await ctx.close();
} finally {
  await browser.close();
  server.close();
}

console.log(failures === 0 ? "\nAll currency checks passed." : `\n${failures} check(s) FAILED.`);
process.exit(failures === 0 ? 0 : 1);
