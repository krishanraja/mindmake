import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
for (const [w, h] of [[390, 844], [1440, 900]]) {
  for (const p of ["/", "/ai-brain/", "/ai-gtm/"]) {
    const page = await browser.newPage({ viewport: { width: w, height: h } });
    await page.goto("http://127.0.0.1:4190" + p, { waitUntil: "networkidle" });
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 600) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 30)); }
      window.scrollTo(0, 0);
    });
    const tall = await page.evaluate(() => document.body.scrollHeight);
    const rows = [];
    for (let y = 0; y < tall - h / 2; y += h) {
      const what = await page.evaluate(({ top, tall: vh }) => {
        const boxes = [...document.querySelectorAll(".mm-site > section, main > section, footer")];
        let best = null; let most = 0;
        for (const el of boxes) {
          const b = el.getBoundingClientRect();
          const s = b.top + window.scrollY;
          const overlap = Math.min(s + b.height, top + vh) - Math.max(s, top);
          if (overlap > most) { most = overlap; best = el; }
        }
        if (!best) return "?";
        const id = best.getAttribute("aria-labelledby") || best.id || "";
        const label = id ? document.getElementById(id)?.textContent?.slice(0, 38) : "";
        return `${best.className.split(" ").filter((c) => c !== "mm-block").join(".")} ${label ? "| " + label : ""}`.trim();
      }, { top: y, tall: h });
      rows.push(`    ${String(y).padStart(5)}  ${what}`);
    }
    console.log(`\n  ${w}px ${p}`);
    console.log(rows.join("\n"));
    await page.close();
  }
}
await browser.close();
