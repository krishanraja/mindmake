#!/usr/bin/env node
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-commercial-readiness-s2';
const candidatePath = '/prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s2.html';
const reviewPath = '/prototypes/website-redesign-recovery/commercial-continuity/review-readiness-s2.html';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1440,700],[1440,900]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

await mkdir(output, { recursive: true });
const scriptSource = await readFile(new URL('./script-readiness-s2.js', import.meta.url), 'utf8');
const htmlSource = await readFile(new URL('./index-readiness-s2.html', import.meta.url), 'utf8');
fail(scriptSource.includes('currentTime'), 'source: film motion writes video.currentTime');
fail((htmlSource.match(/class="primary-action"/g) || []).length !== 1, 'source: expected exactly one filled primary action');
fail((htmlSource.match(/class="trace-state"/g) || []).length !== 4, 'source: every record needs one disclosure cue');
fail(!htmlSource.includes('role="slider"'), 'source: Proofglass is not an operable inspection control');

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

const waitForFonts = page => page.evaluate(() => document.fonts?.ready);
async function load(page, path = candidatePath) {
  await page.goto(origin + path, { waitUntil: 'networkidle' });
  await waitForFonts(page);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const measure = page => page.evaluate(() => {
  const visible = node => {
    if (!node || node.hidden) return false;
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .01 && box.width > .5 && box.height > .5;
  };
  const escapes = [];
  const boundaries = document.querySelectorAll('.arrival-copy,.plate-heading,.trace,.plate-foot,.preflight section');
  for (const boundary of boundaries) {
    if (!visible(boundary)) continue;
    const outer = boundary.getBoundingClientRect();
    for (const node of boundary.querySelectorAll('h1,h2,p,a,button,strong,span,dt,dd,blockquote,cite')) {
      if (!visible(node) || node.children.length) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const line of range.getClientRects()) {
        if (line.width < .5 || line.height < .5) continue;
        if (line.left < outer.left - 6 || line.right > outer.right + 6 || line.top < outer.top - 6 || line.bottom > outer.bottom + 6) {
          escapes.push({ text: node.textContent.trim().slice(0,52), line: line.toJSON(), outer: outer.toJSON() });
        }
      }
    }
  }
  const smallTargets = [...document.querySelectorAll('a,button')].filter(visible).map(node => ({
    name: (node.textContent || node.getAttribute('aria-label') || '').trim().replace(/\s+/g,' ').slice(0,44),
    box: node.getBoundingClientRect().toJSON(),
  })).filter(({ box }) => box.width < 43.5 || box.height < 43.5);
  const primary = document.querySelector('.primary-action')?.getBoundingClientRect();
  const active = document.querySelector('.trace.is-active')?.getBoundingClientRect();
  const proofglass = document.querySelector('.proofglass')?.getBoundingClientRect();
  const video = document.querySelector('video');
  return {
    width: innerWidth,
    height: innerHeight,
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    y: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    escapes,
    smallTargets,
    primary: primary?.toJSON(),
    active: active?.toJSON(),
    proofglass: proofglass?.toJSON(),
    text: (document.querySelector('main')?.innerText || '').replace(/\s+/g,' ').trim(),
    allText: (document.body.innerText || '').replace(/\s+/g,' ').trim(),
    videoCount: document.querySelectorAll('video').length,
    videoSrc: video?.getAttribute('src') || '',
    poster: video?.getAttribute('poster') || '',
    videoPlaying: Boolean(video && !video.paused),
    dialogOpen: Boolean(document.querySelector('dialog[open]')),
  };
});

function assess(state, label) {
  fail(state.x > 1, `${label}: horizontal document overflow ${state.x}`);
  fail(state.escapes.length > 0, `${label}: painted text escapes boundary ${JSON.stringify(state.escapes.slice(0,3))}`);
  fail(state.smallTargets.length > 0, `${label}: controls below 44px ${JSON.stringify(state.smallTargets.slice(0,5))}`);
  fail(state.videoCount !== 1, `${label}: expected one video, saw ${state.videoCount}`);
  fail(!state.poster, `${label}: poster fallback missing`);
  if (state.proofglass && state.active) fail(state.proofglass.right > state.active.left - 2, `${label}: Proofglass overlaps the active evidence column`);
}

const requiredCold = [
  'For founders, principals, portfolio owners and senior commercial leaders',
  'Leader-owned AI, built on real work.',
  'Build an AI brain or AI-native go-to-market system',
  'Build your AI brain',
  'Build your AI go-to-market',
  'Start here',
  'Days → under an hour',
  'Roughly monthly → most days',
  '14 vendors → 3 decisions',
  'Own team · no new hires',
  'Two quarters → one day',
  '11 of 14 stopped',
  'First system live · inside 90 days',
];
const forbidden = [
  'Open any result', 'The drawing shows', 'Fourteen tools running', 'Three kept, eleven stopped',
  'illustrative machinery films', 'Book a call', 'Schedule a call', '£', '$', 'per month',
];

async function exercise(page, label, width, height, capture = false) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await load(page);
  let state = await measure(page);
  assess(state, `${label} cold`);
  if (capture) await page.screenshot({ path: `${output}/${label.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-cold-viewport.png`, fullPage: false });
  for (const phrase of requiredCold) fail(!state.allText.toLowerCase().includes(phrase.toLowerCase()), `${label}: missing cold-visible meaning "${phrase}"`);
  for (const phrase of forbidden) fail(state.allText.toLowerCase().includes(phrase.toLowerCase()), `${label}: forbidden copy "${phrase}"`);
  fail((await page.locator('a[href="/ai-brain"]').count()) !== 1, `${label}: Brain route missing or duplicated`);
  fail((await page.locator('a[href="/ai-gtm"]').count()) !== 1, `${label}: GTM route missing or duplicated`);
  fail((await page.locator('a[href="/case-studies"]').count()) !== 1, `${label}: case-study route missing or duplicated`);
  fail((await page.locator('.primary-action').count()) !== 1, `${label}: filled primary action count changed`);
  fail(!state.primary || state.primary.top < -1 || state.primary.bottom > height + 1, `${label}: Start here is not cold-visible ${JSON.stringify(state.primary)}`);
  if (width > 860) fail(state.y > 1, `${label}: desktop synthesis exceeds its viewport by ${state.y}`);

  const firstGlassTop = state.proofglass?.top;
  await page.locator('.trace-trigger').nth(0).click();
  fail(await page.locator('#trace-detail-1').isVisible(), `${label}: expanded record did not collapse`);
  await page.locator('.trace-trigger').nth(0).click();
  fail(!(await page.locator('#trace-detail-1').isVisible()), `${label}: collapsed record did not reopen`);
  await page.locator('.trace-trigger').nth(3).click();
  await page.waitForTimeout(480);
  fail((await page.locator('.trace-trigger').nth(3).getAttribute('aria-expanded')) !== 'true', `${label}: fourth record did not expand`);
  fail(!(await page.locator('#trace-detail-4').isVisible()), `${label}: fourth record detail is not visible`);
  fail(await page.locator('#trace-detail-1').isVisible(), `${label}: first record detail did not retire`);
  if (width > 860) {
    state = await measure(page);
    fail(Math.abs((state.proofglass?.top ?? 0) - (firstGlassTop ?? 0)) < 20, `${label}: Proofglass did not move with the selected record`);
  }
  await page.locator('.trace-trigger').nth(3).press('ArrowUp');
  fail((await page.locator('.trace-trigger').nth(2).getAttribute('aria-expanded')) !== 'true', `${label}: keyboard record inspection failed`);

  const glass = page.locator('.proofglass');
  await glass.focus();
  await glass.press('End');
  fail((await glass.getAttribute('aria-valuenow')) !== '4', `${label}: Proofglass End key did not select record four`);
  fail(!(await page.locator('#trace-detail-4').isVisible()), `${label}: Proofglass keyboard selection did not reveal matching evidence`);
  await glass.press('Home');
  fail((await glass.getAttribute('aria-valuenow')) !== '1', `${label}: Proofglass Home key did not return to record one`);
  if (width > 860) {
    await page.waitForTimeout(480);
    const glassBox = await glass.boundingBox();
    const targetBox = await page.locator('.trace').nth(2).boundingBox();
    if (glassBox && targetBox) {
      await page.mouse.move(glassBox.x + glassBox.width / 2, glassBox.y + glassBox.height / 2);
      await page.mouse.down();
      await page.mouse.move(glassBox.x + glassBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 5 });
      await page.mouse.up();
      fail((await glass.getAttribute('aria-valuenow')) !== '3', `${label}: dragging Proofglass did not select the nearest record`);
      fail(!(await page.locator('#trace-detail-3').isVisible()), `${label}: Proofglass drag did not reveal matching evidence`);
    } else fail(true, `${label}: Proofglass drag geometry unavailable`);
  }

  await page.locator('#start-here').click();
  fail(!(await page.locator('#preflight').evaluate(node => node.open)), `${label}: Start here did not open the preflight`);
  await page.locator('#decision').fill('Turn our expertise into a repeatable publishing system');
  await page.locator('.frame-action').click();
  fail(!(await page.locator('.preflight-result').isVisible()), `${label}: useful first frame did not appear`);
  const resultText = await page.locator('.preflight-result').innerText();
  fail(!resultText.includes('Choose the one recurring publication worth making repeatable'), `${label}: generated first decision is not specific`);
  fail(!resultText.includes('Take the last finished piece through the current process'), `${label}: generated real-work step is missing`);
  fail(!resultText.includes('The same team can produce the next piece'), `${label}: generated success criterion is missing`);
  fail((await page.locator('input[type="email"]').count()) !== 0, `${label}: email appears before the delivered value`);
  fail((await page.locator('.continue-link').getAttribute('href')) !== '/?start=1', `${label}: private continuation target is wrong`);
  if (capture) await page.screenshot({ path: `${output}/${label.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-result-viewport.png`, fullPage: false });
  await page.locator('.copy-frame').click();
  await page.waitForFunction(() => document.querySelector('.copy-frame')?.textContent !== 'Copy this frame');
  fail((await page.locator('.copy-frame').innerText()) === 'Copy this frame', `${label}: copy action produced no consequence`);
  await page.keyboard.press('Escape');
  fail(await page.locator('#preflight').evaluate(node => node.open), `${label}: Escape did not close the preflight`);
  fail(!(await page.locator('#start-here').evaluate(node => node === document.activeElement)), `${label}: closing preflight did not restore focus`);
  await page.locator('#start-here').click();
  await page.locator('#decision').fill('Resolve whether we build or partner for the next capability');
  await page.locator('.frame-action').click();
  fail((await page.locator('.copy-frame').innerText()) !== 'Copy this frame', `${label}: copy consequence persisted onto an uncopied result`);
  fail(!(await page.locator('.preflight-result').innerText()).includes('Write the decision boundary'), `${label}: build-or-partner input mapped to the wrong first frame`);
  await page.keyboard.press('Escape');

  state = await measure(page);
  assess(state, `${label} recovered`);
  fail(errors.length > 0, `${label}: runtime errors ${JSON.stringify(errors)}`);
  if (capture) await page.screenshot({ path: `${output}/${label.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}.png`, fullPage: true });
}

async function run(engine, name, viewports) {
  const browser = await engine.launch(name === 'chromium' ? { headless: true, channel: 'chrome' } : { headless: true });
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await exercise(page, `${name}-${width}x${height}`, width, height, name === 'chromium' && [[320,568],[390,844],[844,390],[1440,900]].some(([w,h]) => w === width && h === height));
      await context.close();
    }
  } finally { await browser.close(); }
}

async function constrainedModes() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const mode of ['reduced-motion','save-data']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced-motion' ? 'reduce' : 'no-preference' });
      if (mode === 'save-data') await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }));
      const page = await context.newPage();
      await load(page);
      const state = await measure(page);
      assess(state, mode);
      fail(Boolean(state.videoSrc), `${mode}: moving source attached`);
      for (const phrase of requiredCold) fail(!state.allText.toLowerCase().includes(phrase.toLowerCase()), `${mode}: meaning disappeared "${phrase}"`);
      await page.locator('.trace-trigger').nth(1).click();
      fail(!(await page.locator('#trace-detail-2').isVisible()), `${mode}: inspection failed`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function noJavaScript() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(origin + candidatePath, { waitUntil: 'load' });
    const state = await measure(page);
    assess(state, 'no-js');
    fail(Boolean(state.videoSrc), 'no-js: moving source attached');
    fail((await page.locator('#start-here').getAttribute('href')) !== '/?start=1', 'no-js: Start here fallback is not real');
    for (const phrase of requiredCold) fail(!state.allText.toLowerCase().includes(phrase.toLowerCase()), `no-js: meaning disappeared "${phrase}"`);
    await context.close();
  } finally { await browser.close(); }
}

async function textScale200() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [width,height] of [[225,568],[320,568],[390,844],[844,390],[1440,900]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await load(page);
      await page.evaluate(() => { document.documentElement.dataset.textScale = '200'; document.documentElement.style.fontSize = '200%'; dispatchEvent(new Event('resize')); });
      await page.waitForTimeout(100);
      const state = await measure(page);
      fail(state.x > 1, `200% ${width}x${height}: horizontal overflow ${state.x}`);
      fail(!state.allText.includes('11 of 14 stopped'), `200% ${width}x${height}: fourth outcome disappeared`);
      fail(state.smallTargets.length > 0, `200% ${width}x${height}: controls below 44px ${JSON.stringify(state.smallTargets.slice(0,4))}`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function unavailableMediaAndPlayback() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.route('**/*.mp4', route => route.abort('failed'));
    await load(page);
    await page.waitForTimeout(150);
    let state = await measure(page);
    assess(state, 'unavailable-media');
    fail(!await page.locator('#film-toggle').isHidden(), 'unavailable-media: false playback control remains');
    fail(!state.poster, 'unavailable-media: poster missing');
    fail(state.videoPlaying, 'unavailable-media: video reports moving');
    await context.close();

    const context2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page2 = await context2.newPage();
    await load(page2);
    await page2.waitForTimeout(180);
    await page2.locator('#evidence-plate').scrollIntoViewIfNeeded();
    await page2.waitForTimeout(220);
    fail(!await page2.locator('video').evaluate(node => node.paused), 'offscreen: film continues playing');
    await context2.close();
  } finally { await browser.close(); }
}

async function coarsePointer() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await load(page);
    await page.locator('.trace-trigger').nth(2).tap();
    fail(!(await page.locator('#trace-detail-3').isVisible()), 'touch: third record did not open');
    await page.locator('#start-here').tap();
    fail(!(await page.locator('#preflight').evaluate(node => node.open)), 'touch: preflight did not open');
    await context.close();
  } finally { await browser.close(); }
}

async function reviewCapture() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 1600, height: 1050 } });
    const page = await context.newPage();
    await load(page, reviewPath);
    const geometry = await page.evaluate(() => ({
      x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      frames: [...document.querySelectorAll('iframe')].map(node => ({ frame: node.getBoundingClientRect().toJSON(), window: node.closest('.window').getBoundingClientRect().toJSON() })),
    }));
    fail(geometry.x > 1, `review: horizontal overflow ${geometry.x}`);
    fail(geometry.frames.length !== 2, `review: expected two surfaces, saw ${geometry.frames.length}`);
    for (const [index,item] of geometry.frames.entries()) fail(item.frame.left < item.window.left - 1 || item.frame.top < item.window.top - 1, `review: frame ${index + 1} is offset outside canvas`);
    for (const frame of page.frames().slice(1)) await frame.evaluate(() => document.querySelector('video')?.pause());
    await page.screenshot({ path: `${output}/paired-review.png`, fullPage: true });
    await context.close();
  } finally { await browser.close(); }
}

try {
  await run(chromium, 'chromium', chromiumViewports);
  await run(webkit, 'webkit', representative);
  await run(firefox, 'firefox', representative);
  await constrainedModes();
  await noJavaScript();
  await textScale200();
  await unavailableMediaAndPlayback();
  await coarsePointer();
  await reviewCapture();
} finally {
  await server.close();
}

console.log(JSON.stringify({
  artifact: 'COMMERCIAL-READINESS-S2-PROOFGLASS', origin,
  chromium: chromiumViewports.map(([w,h]) => `${w}x${h}`),
  webkit: representative.map(([w,h]) => `${w}x${h}`),
  firefox: representative.map(([w,h]) => `${w}x${h}`),
  evidence: output, physicalDevices: 'not run', failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
