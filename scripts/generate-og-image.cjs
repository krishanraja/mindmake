const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const WIDTH = 1200;
const HEIGHT = 630;

const canvas = createCanvas(WIDTH, HEIGHT);
const ctx = canvas.getContext('2d');

// Background - dark ink color
ctx.fillStyle = '#0e1a2b';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Subtle gradient overlay
const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
gradient.addColorStop(0, 'rgba(0, 217, 182, 0.08)');
gradient.addColorStop(0.5, 'rgba(0, 217, 182, 0.02)');
gradient.addColorStop(1, 'rgba(0, 217, 182, 0.06)');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, WIDTH, HEIGHT);

// Subtle particle dots (brand element)
ctx.fillStyle = 'rgba(0, 217, 182, 0.15)';
const dots = [
  [120, 80, 3], [340, 150, 2], [900, 100, 4], [1050, 200, 2.5],
  [180, 400, 2], [500, 500, 3], [750, 450, 2], [1100, 480, 3.5],
  [60, 250, 2.5], [400, 60, 2], [650, 120, 3], [980, 380, 2],
  [200, 550, 2], [850, 550, 2.5], [1150, 100, 2],
];
dots.forEach(([x, y, r]) => {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
});

// Connecting lines between some dots (subtle network effect)
ctx.strokeStyle = 'rgba(0, 217, 182, 0.06)';
ctx.lineWidth = 1;
const connections = [[0, 2], [2, 3], [4, 5], [6, 7], [8, 10], [11, 13]];
connections.forEach(([a, b]) => {
  ctx.beginPath();
  ctx.moveTo(dots[a][0], dots[a][1]);
  ctx.lineTo(dots[b][0], dots[b][1]);
  ctx.stroke();
});

// Mint accent line at top
const topLine = ctx.createLinearGradient(0, 0, WIDTH, 0);
topLine.addColorStop(0, 'rgba(0, 217, 182, 0)');
topLine.addColorStop(0.2, 'rgba(0, 217, 182, 0.8)');
topLine.addColorStop(0.8, 'rgba(0, 217, 182, 0.8)');
topLine.addColorStop(1, 'rgba(0, 217, 182, 0)');
ctx.fillStyle = topLine;
ctx.fillRect(0, 0, WIDTH, 3);

// "mindmaker" text - main brand
ctx.fillStyle = '#ffffff';
ctx.font = 'bold 72px sans-serif';
ctx.textAlign = 'left';
ctx.fillText('Mindmaker', 80, 220);

// Mint underline accent under brand name
const underline = ctx.createLinearGradient(80, 0, 420, 0);
underline.addColorStop(0, '#00D9B6');
underline.addColorStop(1, 'rgba(0, 217, 182, 0.3)');
ctx.fillStyle = underline;
ctx.fillRect(80, 235, 340, 3);

// Tagline
ctx.fillStyle = '#00D9B6';
ctx.font = 'bold 32px sans-serif';
ctx.fillText('Mind Set  →  Mind Map  →  Mind Make', 80, 300);

// Description
ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
ctx.font = '24px sans-serif';
ctx.fillText('1:1 sprints that turn AI chaos into calm,', 80, 380);
ctx.fillText('clear, executable direction.', 80, 415);

// Bottom tagline
ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
ctx.font = '18px sans-serif';
ctx.fillText('themindmaker.ai', 80, 560);

// Mint accent dot before URL
ctx.fillStyle = '#00D9B6';
ctx.beginPath();
ctx.arc(65, 555, 4, 0, Math.PI * 2);
ctx.fill();

// Bottom mint line
const bottomLine = ctx.createLinearGradient(0, 0, WIDTH, 0);
bottomLine.addColorStop(0, 'rgba(0, 217, 182, 0)');
bottomLine.addColorStop(0.2, 'rgba(0, 217, 182, 0.6)');
bottomLine.addColorStop(0.8, 'rgba(0, 217, 182, 0.6)');
bottomLine.addColorStop(1, 'rgba(0, 217, 182, 0)');
ctx.fillStyle = bottomLine;
ctx.fillRect(0, 627, WIDTH, 3);

// Write to file
const buffer = canvas.toBuffer('image/jpeg', { quality: 0.92 });
const outputPath = path.join(__dirname, '..', 'public', 'og-image.jpg');
fs.writeFileSync(outputPath, buffer);
console.log(`OG image written to ${outputPath} (${(buffer.length / 1024).toFixed(1)}KB)`);
