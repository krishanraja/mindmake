/**
 * The icon set, from the vector mark.
 *
 * Every file here is drawn from `src/assets/mindmake-mark.svg`, the designer's
 * September 2026 export rebuilt as paths, so the tab, the home screen, the
 * pinned tab, the install icon and the Organization logo are the one mark.
 * Until 4 September 2026 they were an older hand-drawn approximation in a
 * different green, and the tab icon on a light tab bar wore a dark square.
 *
 * Transparent wherever the platform allows it: the SVG, the ICO and the PNGs
 * a browser tab or a bookmark bar draws. Ink wherever the platform paints its
 * own ground otherwise: iOS fills a transparent touch icon with black, and a
 * maskable install icon is cropped to a circle or a squircle, so both carry
 * the site's ink and keep the mark inside the safe zone.
 *
 * Run: npm run generate-favicons
 */
import sharp from "sharp";
import pngToIco from "png-to-ico";
import { readFileSync, writeFileSync, unlinkSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = (name) => resolve(root, "public", name);
const INK = "#0a100d";

const mark = readFileSync(resolve(root, "src/assets/mindmake-mark.svg"), "utf8");
const viewBox = mark.match(/viewBox="([^"]+)"/)[1].split(" ").map(Number);
const [vx, vy, vw, vh] = viewBox;
const inner = mark.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");

/**
 * The mark on a square, at a share of its side, centred. `ground` is a fill
 * for the square or null for a transparent one.
 */
function square(share, ground) {
  const side = 1000;
  const scale = (side * share) / Math.max(vw, vh);
  const w = vw * scale;
  const h = vh * scale;
  const tx = (side - w) / 2 - vx * scale;
  const ty = (side - h) / 2 - vy * scale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${side} ${side}">`
    + (ground ? `<rect width="${side}" height="${side}" fill="${ground}"/>` : "")
    + `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(5)})">${inner}</g></svg>`;
}

const png = (svg, size) => sharp(Buffer.from(svg)).resize(size, size).png().toBuffer();

/* The tab icon: the mark alone, filling its square, no ground. */
const tab = square(0.92, null);
writeFileSync(out("favicon.svg"), tab + "\n");
for (const size of [16, 32, 192, 512]) writeFileSync(out(`favicon-${size}x${size}.png`), await png(tab, size));
writeFileSync(out("favicon.ico"), await pngToIco([await png(tab, 16), await png(tab, 32), await png(tab, 48)]));

/* The touch icon and the maskable install icons: ink ground, mark inside the
   safe zone (the central 80% of a maskable icon survives every mask). */
writeFileSync(out("apple-touch-icon.png"), await png(square(0.62, INK), 180));
for (const size of [192, 512]) writeFileSync(out(`favicon-${size}x${size}-maskable.png`), await png(square(0.56, INK), size));

/* The Organization logo for structured data: the mark on the ink, square. */
writeFileSync(out("mindmake-logo-512.png"), await png(square(0.62, INK), 512));

/* Safari's pinned tab: one colour, the browser paints it. */
const mono = square(0.92, null)
  .replace(/fill="url\(#[^"]+\)"/g, 'fill="#000"')
  .replace(/<defs>[\s\S]*?<\/defs>/, "")
  .replace(/<linearGradient[\s\S]*?<\/linearGradient>/g, "");
writeFileSync(out("safari-pinned-tab.svg"), mono + "\n");

/* The old set: Windows tile sizes nothing references, the previous source
   picture, and a duplicate of the 32px tab icon. */
for (const stale of ["favicon-48x48.png", "favicon-70x70.png", "favicon-96x96.png", "favicon-144x144.png", "favicon-150x150.png", "favicon-310x310.png", "favicon.png", "mindmake-icon.png"]) {
  if (existsSync(out(stale))) unlinkSync(out(stale));
}
console.log("icons written from src/assets/mindmake-mark.svg");
