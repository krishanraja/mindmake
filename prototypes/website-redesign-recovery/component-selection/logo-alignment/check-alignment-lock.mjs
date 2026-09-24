import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { chromium, firefox, webkit } from "playwright";

const root = normalize(join(import.meta.dirname, "../../../.."));
const mime = { ".html": "text/html", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const server = createServer(async (request, response) => {
  try {
    const pathname = new URL(request.url, "http://127.0.0.1").pathname;
    const file = normalize(join(root, decodeURIComponent(pathname)));
    if (!file.startsWith(root)) throw new Error("outside root");
    response.setHeader("Content-Type", mime[extname(file)] || "application/octet-stream");
    response.end(await readFile(file));
  } catch {
    response.statusCode = 404;
    response.end("Not found");
  }
});

await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
const { port } = server.address();
const url = `http://127.0.0.1:${port}/prototypes/website-redesign-recovery/component-selection/logo-alignment/alignment-lock.html`;
const failures = [];

try {
  for (const [name, engine] of Object.entries({ chromium, firefox, webkit })) {
    const browser = await engine.launch({ headless: true });
    try {
      const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
      const errors = [];
      page.on("console", (message) => message.type() === "error" && errors.push(message.text()));
      await page.goto(url, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const result = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
        missingImages: [...document.images].filter((image) => !image.complete || image.naturalWidth === 0).length,
        duplicateEyebrows: document.querySelectorAll(".hero-copy p").length,
        proofs: [...document.querySelectorAll(".proof")].map((proof) => {
          const viewport = proof.querySelector(".viewport").getBoundingClientRect();
          const brand = proof.querySelector(".brand").getBoundingClientRect();
          const hero = proof.querySelector(".hero-copy").getBoundingClientRect();
          return {
            name: proof.className,
            brandX: brand.left - viewport.left,
            heroX: hero.left - viewport.left,
            targetHeight: brand.height,
          };
        }),
      }));
      if (result.overflow) failures.push(`${name}: horizontal overflow`);
      if (result.missingImages) failures.push(`${name}: ${result.missingImages} missing logo image(s)`);
      if (result.duplicateEyebrows) failures.push(`${name}: duplicate hero eyebrow remains`);
      for (const proof of result.proofs) {
        if (Math.abs(proof.brandX - proof.heroX) > 0.25) failures.push(`${name}: ${proof.name} edge mismatch ${proof.brandX}/${proof.heroX}`);
        if (proof.targetHeight < 44) failures.push(`${name}: ${proof.name} brand target ${proof.targetHeight}px`);
      }
      if (errors.length) failures.push(`${name}: console errors ${errors.join(" | ")}`);
    } finally {
      await browser.close();
    }
  }
} finally {
  await new Promise((resolve) => server.close(resolve));
}

console.log(JSON.stringify({ url, failures }, null, 2));
if (failures.length) process.exitCode = 1;
