import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const checks = [
  ["https://mindmake.co/ai-brain", "Which part of the business do you work in?"],
  ["https://mindmake.co/ai-brain", "Work email"],
  ["https://mindmake.co/ai-gtm", "Which part of the business do you work in?"],
  ["https://mindmake.co/privacy", "part of the business you work in"],
  ["https://mindmake.co/ai-gtm", "What you sell"],
];
for (const [url, needle] of checks) {
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  const errs = [];
  page.on("pageerror", (e) => errs.push(String(e).slice(0, 80)));
  await page.goto(url, { waitUntil: "networkidle" });
  const found = await page.evaluate((n) => document.body.innerText.includes(n), needle);
  console.log(`  ${found ? "OK  " : "MISS"}  ${url.replace("https://mindmake.co","")}  "${needle}"${errs.length ? "  errors:"+errs[0] : ""}`);
  await page.close();
}
await b.close();
