#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-start-here-intelligence-s3';
const candidatePath = '/prototypes/website-redesign-recovery/start-here-intelligence/index-s2.html';
const reviewPath = '/prototypes/website-redesign-recovery/start-here-intelligence/review-s3.html';
const candidateViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1320,852],[1440,700],[1440,900],[1920,1080]];
const reviewViewports = [[320,700],[390,900],[768,900],[1000,900],[1001,900],[1320,852],[1562,1000],[1563,1000],[1600,1040],[1920,1080]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');
const frozenS2 = {
  'index-s2.html': '5e391f505283c00085cd5ab9a716023a7e6b58921929e155c308ab7bf634971e',
  'styles-s2.css': '01e83ea0bb5f4f48f84789f933b4ec20683fe816987e5fdb0c7cd3a7f853eb45',
  'review-s2.html': 'e558b01d13347e75cebe45eb85754643e8812555e27836ff179f1a5384e11783',
  'check-s2.mjs': '95f86a6e65fe425c9a11448481533ea7d1c8f85228c900297f9b28de2c7bb71f',
};

for (const [file, expected] of Object.entries(frozenS2)) {
  const bytes = await readFile(new URL(file, import.meta.url));
  fail(sha256(bytes) !== expected, `frozen S2 changed: ${file}`);
}

await mkdir(output, { recursive: true });
const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

const launch = (browserType) => browserType.launch({
  headless: true,
  ...(browserType === chromium ? { channel: 'chrome' } : {}),
});

async function paintedTextState(page) {
  return page.evaluate(() => {
    const body = document.querySelector('.resolution-body').getBoundingClientRect();
    const screen = document.querySelector('.screen.active');
    const selectors = [
      '.starting-point',
      '.division article:first-child p',
      '.division article:nth-child(2) p',
      '.first-proof strong',
      '.resolution-body > .action-rail',
    ];
    const violations = [];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      const range = document.createRange();
      range.selectNodeContents(element);
      for (const rect of range.getClientRects()) {
        if (rect.width < 0.5 || rect.height < 0.5) continue;
        if (rect.left < body.left - 1 || rect.right > body.right + 1 || rect.top < body.top - 1 || rect.bottom > body.bottom + 1) {
          violations.push({ selector, left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom, bodyLeft: body.left, bodyRight: body.right, bodyTop: body.top, bodyBottom: body.bottom });
        }
      }
    }
    return {
      violations,
      documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      screenOverflow: screen.scrollHeight - screen.clientHeight,
      bodyOverflow: document.querySelector('.resolution-body').scrollWidth - document.querySelector('.resolution-body').clientWidth,
      status: document.querySelector('.action-status').textContent.trim(),
    };
  });
}

async function inspectCandidate(browserType, name, matrix, capture = false) {
  const browser = await launch(browserType);
  try {
    for (const [width, height] of matrix) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(origin + candidatePath, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const before = await paintedTextState(page);
      fail(before.violations.length > 0, `${name} candidate ${width}x${height}: ${before.violations.length} painted-text bounds violations before action`);
      fail(before.documentOverflow > 1 || before.bodyOverflow > 1 || before.screenOverflow > 1, `${name} candidate ${width}x${height}: overflow before action`);

      await page.locator('[data-keep]').click();
      const after = await paintedTextState(page);
      fail(!after.status.includes('Nothing has been sent'), `${name} candidate ${width}x${height}: Keep consequence missing`);
      fail(after.violations.length > 0, `${name} candidate ${width}x${height}: ${after.violations.length} painted-text bounds violations after action`);
      fail(after.documentOverflow > 1 || after.bodyOverflow > 1 || after.screenOverflow > 1, `${name} candidate ${width}x${height}: overflow after action`);

      if (capture && ((width === 1320 && height === 852) || (width === 1440 && height === 900) || (width === 390 && height === 844))) {
        await page.evaluate(() => { document.querySelector('video')?.pause(); document.querySelector('.resolution-film').dataset.filmState = 'poster'; });
        await page.screenshot({ path: `${output}/${name}-candidate-${width}x${height}-kept.png`, fullPage: false });
      }
      await page.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

async function inspectReview(browserType, name, matrix, capture = false) {
  const browser = await launch(browserType);
  try {
    for (const [width, height] of matrix) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(origin + reviewPath, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      for (const frame of page.frames().slice(1)) {
        await frame.evaluate(() => { document.querySelector('video')?.pause(); document.querySelector('.resolution-film').dataset.filmState = 'poster'; });
      }
      const state = await page.evaluate(() => {
        const bounds = (selector) => {
          const windowRect = document.querySelector(selector).getBoundingClientRect();
          const iframeRect = document.querySelector(`${selector} iframe`).getBoundingClientRect();
          return {
            window: { left: windowRect.left, right: windowRect.right, top: windowRect.top, bottom: windowRect.bottom, width: windowRect.width, height: windowRect.height },
            iframe: { left: iframeRect.left, right: iframeRect.right, top: iframeRect.top, bottom: iframeRect.bottom, width: iframeRect.width, height: iframeRect.height },
            clippedLeft: Math.max(0, windowRect.left - iframeRect.left),
            clippedRight: Math.max(0, iframeRect.right - windowRect.right),
            clippedTop: Math.max(0, windowRect.top - iframeRect.top),
            clippedBottom: Math.max(0, iframeRect.bottom - windowRect.bottom),
          };
        };
        return {
          pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          desktop: bounds('.desktop-window'),
          mobile: bounds('.mobile-window'),
        };
      });
      fail(state.pageOverflow > 1, `${name} review ${width}x${height}: page overflow ${state.pageOverflow}`);
      for (const [surface, value] of Object.entries({ desktop: state.desktop, mobile: state.mobile })) {
        const clipped = value.clippedLeft + value.clippedRight + value.clippedTop + value.clippedBottom;
        fail(clipped > 1, `${name} review ${width}x${height}: ${surface} evidence clipped ${clipped.toFixed(2)}px`);
      }

      if (capture && width === 1320 && height === 852) {
        await page.screenshot({ path: `${output}/${name}-review-1320x852.png`, fullPage: true });
      }
      if (capture && width === 1600 && height === 1040) {
        await page.screenshot({ path: `${output}/paired-review-s3.png`, fullPage: true });
      }
      await page.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

try {
  await inspectCandidate(chromium, 'chromium', candidateViewports, true);
  await inspectCandidate(webkit, 'webkit', [[390,844],[1320,852],[1440,900]]);
  await inspectCandidate(firefox, 'firefox', [[390,844],[1320,852],[1440,900]]);
  await inspectReview(chromium, 'chromium', reviewViewports, true);
  await inspectReview(webkit, 'webkit', [[320,700],[1320,852],[1600,1040]]);
  await inspectReview(firefox, 'firefox', [[320,700],[1320,852],[1600,1040]]);
} finally {
  await server.close();
}

console.log(JSON.stringify({
  artifact: 'START-HERE-INTELLIGENCE-S2 / REVIEW-S3',
  origin,
  frozenCandidate: Object.keys(frozenS2),
  chromiumCandidateViewports: candidateViewports.map(([width, height]) => `${width}x${height}`),
  chromiumReviewViewports: reviewViewports.map(([width, height]) => `${width}x${height}`),
  webkitCandidateViewports: ['390x844', '1320x852', '1440x900'],
  firefoxCandidateViewports: ['390x844', '1320x852', '1440x900'],
  exactReproduction: '1320x852',
  output,
  physicalDevices: 'not run',
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
