/**
 * Screenshots every price surface at both breakpoints in all three currencies,
 * and fails if any page scrolls horizontally.
 *
 * The overflow assertion is the point, not the images. AUD carries the longest
 * price strings ($14,500, $27,500, $45,500, $76,000), so it is the currency
 * most likely to push a price card past the viewport at 390px. A screenshot
 * nobody opens proves nothing; `scrollWidth <= clientWidth` proves something.
 *
 * Requires a build first. See README.md for the env vars.
 */

import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { startServer } from "./serve-dist.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../../.qa-screenshots");

const ROUTES = ["/", "/start", "/teardown", "/handover", "/capital"];
const WIDTHS = [
  { name: "390", width: 390, height: 844 },
  { name: "1440", width: 1440, height: 900 },
];
const CURRENCIES = ["usd", "gbp", "aud"];

mkdirSync(OUT, { recursive: true });

const server = await startServer(4182);
const B = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });

let shots = 0;
let overflows = 0;

try {
  for (const vp of WIDTHS) {
    for (const currency of CURRENCIES) {
      const ctx = await browser.newContext({
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await ctx.newPage();

      for (const route of ROUTES) {
        const url = `${B}${route}${route.includes("?") ? "&" : "?"}currency=${currency}`;
        await page.goto(url, { waitUntil: "domcontentloaded" });
        // Give React time to mount and repaint in the chosen currency.
        await page.waitForTimeout(1200);

        const { sw, cw } = await page.evaluate(() => ({
          sw: document.documentElement.scrollWidth,
          cw: document.documentElement.clientWidth,
        }));
        const prices = await page.$$eval("[data-price]", (ns) =>
          ns.map((n) => n.textContent.trim()),
        );

        const slug = route === "/" ? "home" : route.replace(/\//g, "");
        const name = `${slug}-${vp.name}-${currency}.png`;
        await page.screenshot({ path: resolve(OUT, name), fullPage: false });
        shots++;

        const ok = sw <= cw;
        if (!ok) overflows++;
        console.log(
          `${ok ? "ok  " : "OVERFLOW"} ${name.padEnd(28)} ${sw}/${cw}  ${prices.join(" ") || "(no prices)"}`,
        );
      }
      await ctx.close();
    }
  }
} finally {
  await browser.close();
  server.close();
}

console.log(`\n${shots} screenshots in .qa-screenshots/`);
console.log(overflows === 0 ? "No horizontal overflow at any width or currency." : `${overflows} OVERFLOW(S).`);
process.exit(overflows === 0 ? 0 : 1);
