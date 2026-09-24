#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-start-here-interaction-s4';
const candidatePath = '/prototypes/website-redesign-recovery/start-here-intelligence/index-interaction-s4.html';
const reviewPath = '/prototypes/website-redesign-recovery/start-here-intelligence/review-interaction-s4.html';
const candidateViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1320,852],[1440,700],[1440,900],[1920,1080]];
const reviewViewports = [[320,700],[390,900],[768,900],[1000,900],[1320,852],[1562,1000],[1600,1040],[1920,1080]];
const representative = [[320,568],[390,844],[768,1024],[844,390],[1320,852],[1440,700],[1440,900]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };
const sha256 = (bytes) => createHash('sha256').update(bytes).digest('hex');

const frozenS3 = {
  'index-interaction-s3.html': '2d8f6147b125e71db46590511a5b478180fc70c8caeac1aeadbaa0191d549c2d',
  'styles-interaction-s3.css': 'c5211125bf8afdcbd8041144591e2cdd5ac018f7dfe36db52bf877ab7463fa3f',
  'script-interaction-s3.js': '8df7dbe1b8b5d95e2ed543dbb72b26956a4a210b5c2780cbfcfa1c1153aebea8',
  'review-interaction-s3.html': '99103f3d223c0459c3096f4860d18a5976b6c94ebbbf0ae92601050a3cabc16e',
  'check-interaction-s3.mjs': '8fe7d7e12419495cf187ce93698edd9caca2217c36b9dccc6cd7efe4f560ca1b',
};

for (const [file, expected] of Object.entries(frozenS3)) {
  const bytes = await readFile(new URL(file, import.meta.url));
  fail(sha256(bytes) !== expected, `frozen S3 changed: ${file}`);
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

async function geometry(page) {
  return page.evaluate(() => {
    const visible = (element) => {
      if (!element || element.hidden) return false;
      const style = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0.01 && rect.width > .5 && rect.height > .5;
    };
    const inside = (inner, outer, tolerance = 1.25) => inner.left >= outer.left - tolerance && inner.right <= outer.right + tolerance && inner.top >= outer.top - tolerance && inner.bottom <= outer.bottom + tolerance;
    const rangeViolations = [];
    const containers = ['.binding', '.folio-head', '.leaf', '.folio-actions'];
    for (const selector of containers) {
      for (const container of document.querySelectorAll(selector)) {
        if (!visible(container)) continue;
        const boundary = container.getBoundingClientRect();
        for (const textElement of container.querySelectorAll('p, strong, small, span, h1')) {
          if (!visible(textElement)) continue;
          const range = document.createRange();
          range.selectNodeContents(textElement);
          for (const rect of range.getClientRects()) {
            if (rect.width < .5 || rect.height < .5) continue;
            if (!inside(rect, boundary)) rangeViolations.push({ selector, text: textElement.textContent.trim().slice(0, 40), rect: { left: rect.left, right: rect.right, top: rect.top, bottom: rect.bottom }, boundary: { left: boundary.left, right: boundary.right, top: boundary.top, bottom: boundary.bottom } });
          }
        }
      }
    }
    const targetViolations = [...document.querySelectorAll('button')]
      .filter(visible)
      .map((button) => ({ text: button.textContent.trim(), rect: button.getBoundingClientRect() }))
      .filter(({ rect }) => rect.width < 43.5 || rect.height < 43.5)
      .map(({ text, rect }) => ({ text, width: rect.width, height: rect.height }));
    const scrollViolations = ['.stage', '.instrument', '.folio', '.panel-surface']
      .flatMap((selector) => [...document.querySelectorAll(selector)].filter(visible).map((element) => ({ selector, x: element.scrollWidth - element.clientWidth, y: element.scrollHeight - element.clientHeight })))
      .filter(({ x, y }) => x > 1 || y > 1);
    const stage = document.querySelector('.stage').getBoundingClientRect();
    return {
      documentX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      documentY: document.documentElement.scrollHeight - document.documentElement.clientHeight,
      stage: { width: stage.width, height: stage.height, left: stage.left, top: stage.top, right: stage.right, bottom: stage.bottom },
      viewport: { width: innerWidth, height: innerHeight },
      rangeViolations,
      targetViolations,
      scrollViolations,
      activeLeaves: [...document.querySelectorAll('.leaf')].filter(visible).map((leaf) => leaf.dataset.leaf),
      filmTruth: document.querySelector('.film-truth').textContent.trim(),
    };
  });
}

function assessGeometry(state, label) {
  fail(state.documentX > 1, `${label}: document horizontal overflow ${state.documentX}`);
  fail(state.documentY > 1, `${label}: document vertical overflow ${state.documentY}`);
  fail(Math.abs(state.stage.width - state.viewport.width) > 1 || Math.abs(state.stage.height - state.viewport.height) > 1, `${label}: stage ${state.stage.width}x${state.stage.height} does not fit ${state.viewport.width}x${state.viewport.height}`);
  fail(state.rangeViolations.length > 0, `${label}: ${state.rangeViolations.length} painted-text containment violations ${JSON.stringify(state.rangeViolations.slice(0, 2))}`);
  fail(state.targetViolations.length > 0, `${label}: undersized controls ${JSON.stringify(state.targetViolations)}`);
  fail(state.scrollViolations.length > 0, `${label}: nested overflow ${JSON.stringify(state.scrollViolations)}`);
  fail(!state.filmTruth.includes('Illustrative sequence. Not evidence.'), `${label}: film truth label missing`);
}

async function exercise(page, label, compact) {
  const leafCopyBefore = await page.locator('.leaf').allTextContents();
  await page.locator('[data-open-time]').click();
  const timeGeometry = await geometry(page);
  assessGeometry(timeGeometry, `${label} time dialog`);
  fail(!(await page.locator('.time-panel').isVisible()), `${label}: time dialog did not open`);
  fail(!await page.locator('.time-panel').evaluate((panel) => panel.contains(document.activeElement)), `${label}: focus did not move into time dialog`);
  await page.locator('.time-layout label').filter({ hasText: 'Help more companies' }).click();
  fail(!(await page.locator('[data-time-preview]').innerText()).includes('same judgement'), `${label}: Time preview did not change`);
  await page.locator('[data-commit-time]').click();
  fail((await page.locator('[data-time-short]').innerText()) !== 'Help', `${label}: committed Time not reflected in binding`);
  fail(!(await page.locator('[data-restore-time]').isVisible()), `${label}: Restore not exposed after Time change`);
  const leafCopyAfter = await page.locator('.leaf').allTextContents();
  fail(JSON.stringify(leafCopyBefore) !== JSON.stringify(leafCopyAfter), `${label}: Time fabricated a change to the four guidance leaves`);
  await page.locator('[data-restore-time]').click();
  fail((await page.locator('[data-time-short]').innerText()) !== 'Grow', `${label}: Restore did not recover original Time`);

  if (compact) {
    for (let index = 0; index < 3; index += 1) await page.locator('[data-primary]').click();
    fail((await page.locator('[data-leaf-number]').innerText()) !== '4', `${label}: Pocket Folio did not reach leaf 4`);
    const resumeUrl = page.url();
    await page.goto(resumeUrl, { waitUntil: 'commit' });
    await page.locator('.instrument').waitFor({ state: 'visible' });
    fail((await page.locator('[data-leaf-number]').innerText()) !== '4', `${label}: interrupted mobile state did not resume at leaf 4`);
  } else {
    await page.locator('.leaf').first().focus();
    await page.keyboard.press('ArrowRight');
    fail(await page.locator('.leaf').nth(1).getAttribute('aria-current') !== 'step', `${label}: keyboard did not advance the desktop folio`);
  }

  await page.locator('[data-primary]').click();
  fail(!(await page.locator('.keep-panel').isVisible()), `${label}: Keep consequence did not open`);
  const keepText = await page.locator('.keep-panel').innerText();
  fail(!keepText.toLowerCase().includes('email verification is next.') || !keepText.toLowerCase().includes('nothing has been sent.'), `${label}: exact Keep consequence missing`);
  const keepGeometry = await geometry(page);
  assessGeometry(keepGeometry, `${label} Keep consequence`);
  await page.locator('[data-cancel-keep]').click();

  await page.locator('.close').click();
  fail(!(await page.locator('.folded-cover').isVisible()), `${label}: close did not fold the brief`);
  const cover = await page.locator('[data-cover-state]').innerText();
  if (compact) fail(!cover.toLowerCase().includes('4 of 4'), `${label}: folded cover lost mobile leaf state`);
  await page.locator('[data-reopen]').click();
  fail(!(await page.locator('.instrument').isVisible()), `${label}: reopen did not restore the brief`);
  if (compact) fail((await page.locator('[data-leaf-number]').innerText()) !== '4', `${label}: reopen lost exact leaf state`);
}

async function inspectCandidate(browserType, name, matrix, capture = false) {
  const browser = await launch(browserType);
  try {
    for (const [width, height] of matrix) {
      const page = await browser.newPage({ viewport: { width, height } });
      const instance = `check-${name}-${width}-${height}`;
      await page.goto(`${origin}${candidatePath}?instance=${instance}`, { waitUntil: 'domcontentloaded' });
      await page.locator('.instrument').waitFor({ state: 'visible' });
      await page.evaluate(() => document.fonts.ready);
      const compact = await page.evaluate(() => matchMedia('(max-width: 820px), (max-width: 920px) and (orientation: landscape) and (max-height: 500px)').matches);
      const initialGeometry = await geometry(page);
      assessGeometry(initialGeometry, `${name} ${width}x${height} initial`);
      fail(compact ? initialGeometry.activeLeaves.length !== 1 : initialGeometry.activeLeaves.length !== 4, `${name} ${width}x${height}: wrong visible leaf count ${initialGeometry.activeLeaves.length}`);
      await exercise(page, `${name} ${width}x${height}`, compact);

      if (capture && [[390,844],[768,1024],[844,390],[1440,700],[1440,900]].some(([w,h]) => w === width && h === height)) {
        await page.evaluate(() => { document.querySelector('video')?.pause(); document.querySelector('.film').dataset.filmState = 'poster'; });
        await page.screenshot({ path: `${output}/${name}-candidate-${width}x${height}.png`, fullPage: false });
      }
      await page.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

async function inspectReducedMotion() {
  const browser = await launch(chromium);
  try {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await page.goto(`${origin}${candidatePath}?instance=reduced-motion`, { waitUntil: 'domcontentloaded' });
    await page.locator('.instrument').waitFor({ state: 'visible' });
    fail(Boolean(await page.locator('video').getAttribute('src')), 'reduced motion: video source should not load');
    await page.locator('[data-open-time]').click();
    await page.locator('.time-layout label').filter({ hasText: 'Build my AI skill' }).click();
    await page.locator('[data-commit-time]').click();
    fail((await page.locator('[data-time-short]').innerText()) !== 'Learn', 'reduced motion: changed state not understandable without animation');
    fail(!(await page.locator('[data-restore-time]').isVisible()), 'reduced motion: Restore missing');
  } finally {
    await browser.close().catch(() => {});
  }
}

async function inspectReview(browserType, name, matrix, capture = false) {
  const browser = await launch(browserType);
  try {
    for (const [width, height] of matrix) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(origin + reviewPath, { waitUntil: 'domcontentloaded' });
      await page.locator('.review-grid').waitFor({ state: 'visible' });
      await page.evaluate(() => document.fonts.ready);
      for (const frame of page.frames().slice(1)) await frame.evaluate(() => { document.querySelector('video')?.pause(); document.querySelector('.film').dataset.filmState = 'poster'; });
      const state = await page.evaluate(() => {
        const bounds = (selector) => {
          const windowRect = document.querySelector(selector).getBoundingClientRect();
          const iframeRect = document.querySelector(`${selector} iframe`).getBoundingClientRect();
          return {
            window: { left: windowRect.left, right: windowRect.right, top: windowRect.top, bottom: windowRect.bottom },
            iframe: { left: iframeRect.left, right: iframeRect.right, top: iframeRect.top, bottom: iframeRect.bottom },
            clipped: Math.max(0, windowRect.left - iframeRect.left) + Math.max(0, iframeRect.right - windowRect.right) + Math.max(0, windowRect.top - iframeRect.top) + Math.max(0, iframeRect.bottom - windowRect.bottom),
          };
        };
        return {
          x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          desktop: bounds('.desktop-window'),
          mobile: bounds('.mobile-window'),
        };
      });
      fail(state.x > 1, `${name} review ${width}x${height}: horizontal overflow ${state.x}`);
      fail(state.desktop.clipped > 1, `${name} review ${width}x${height}: desktop evidence clipped ${state.desktop.clipped}`);
      fail(state.mobile.clipped > 1, `${name} review ${width}x${height}: mobile evidence clipped ${state.mobile.clipped}`);
      if (capture && width === 1600 && height === 1040) await page.screenshot({ path: `${output}/paired-review-interaction-s4.png`, fullPage: true });
      if (capture && width === 1320 && height === 852) await page.screenshot({ path: `${output}/${name}-review-1320x852.png`, fullPage: true });
      await page.close().catch(() => {});
    }
  } finally {
    await browser.close().catch(() => {});
  }
}

try {
  await inspectCandidate(chromium, 'chromium', candidateViewports, true);
  await inspectCandidate(webkit, 'webkit', representative);
  await inspectCandidate(firefox, 'firefox', representative);
  await inspectReducedMotion();
  await inspectReview(chromium, 'chromium', reviewViewports, true);
  await inspectReview(webkit, 'webkit', [[390,900],[1320,852],[1600,1040]]);
  await inspectReview(firefox, 'firefox', [[390,900],[1320,852],[1600,1040]]);
} finally {
  await server.close();
}

const files = ['index-interaction-s4.html', 'styles-interaction-s4.css', 'review-interaction-s4.html', 'check-interaction-s4.mjs'];
const hashes = Object.fromEntries(await Promise.all(files.map(async (file) => [file, sha256(await readFile(new URL(file, import.meta.url)))])));

console.log(JSON.stringify({
  artifact: 'START-HERE-INTERACTION-S4 / ASYMMETRIC WORKING FOLIO',
  origin,
  frozenS3: Object.keys(frozenS3),
  chromiumViewports: candidateViewports.map(([width, height]) => `${width}x${height}`),
  webkitViewports: representative.map(([width, height]) => `${width}x${height}`),
  firefoxViewports: representative.map(([width, height]) => `${width}x${height}`),
  reducedMotion: 'verified in Chromium 390x844',
  reviewViewports: reviewViewports.map(([width, height]) => `${width}x${height}`),
  output,
  hashes,
  physicalDevices: 'not run',
  failures,
}, null, 2));

if (failures.length) process.exitCode = 1;
