const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const WIDTH = 1200;
const HEIGHT = 630;
const root = path.join(__dirname, "..");
const outputPath = path.join(root, "public", "og-image.jpg");

const gridLines = [
  ...Array.from({ length: 14 }, (_, index) => `<line x1="${index * 80}" y1="0" x2="${index * 80}" y2="630" />`),
  ...Array.from({ length: 8 }, (_, index) => `<line x1="0" y1="${index * 80}" x2="1200" y2="${index * 80}" />`),
].join("");

const background = Buffer.from(`
  <svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="86%" cy="8%" r="65%">
        <stop offset="0" stop-color="#67e0be" stop-opacity="0.2" />
        <stop offset="0.55" stop-color="#67e0be" stop-opacity="0.04" />
        <stop offset="1" stop-color="#67e0be" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="#06251f" />
    <rect width="1200" height="630" fill="url(#glow)" />
    <g stroke="#fffdf8" stroke-opacity="0.055" stroke-width="1">${gridLines}</g>
    <rect width="1200" height="8" fill="#67e0be" />
    <rect x="56" y="48" width="500" height="102" rx="4" fill="#f4f0e8" />
    <text x="72" y="282" fill="#fffdf8" font-family="Georgia, serif" font-size="66" font-weight="700">Put your best judgement</text>
    <text x="72" y="358" fill="#fffdf8" font-family="Georgia, serif" font-size="66" font-weight="700">to work with AI.</text>
    <text x="76" y="432" fill="#fffdf8" fill-opacity="0.78" font-family="Arial, sans-serif" font-size="24">Build Your AI Brain  ·  Build Your AI GTM</text>
    <line x1="76" y1="474" x2="1124" y2="474" stroke="#67e0be" stroke-opacity="0.75" stroke-width="3" />
    <text x="76" y="550" fill="#fffdf8" fill-opacity="0.66" font-family="Arial, sans-serif" font-size="20">mindmake.co</text>
    <circle cx="1114" cy="542" r="10" fill="#67e0be" />
  </svg>
`);

async function drawCover() {
  const wordmark = await sharp(path.join(root, "prototypes", "assets", "mindmake-wordmark.png"))
    .resize({ width: 338 })
    .png()
    .toBuffer();
  const icon = await sharp(path.join(root, "src", "assets", "mindmaker-icon.png"))
    .resize(64, 64, { fit: "contain" })
    .png()
    .toBuffer();

  await sharp(background)
    .composite([
      { input: icon, left: 72, top: 67 },
      { input: wordmark, left: 156, top: 73 },
    ])
    .jpeg({ quality: 94, progressive: true })
    .toFile(outputPath);

  const size = fs.statSync(outputPath).size;
  console.log(`OG image written to ${outputPath} (${(size / 1024).toFixed(1)}KB)`);
}

drawCover().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
