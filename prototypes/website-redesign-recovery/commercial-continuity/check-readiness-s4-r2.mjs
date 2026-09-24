#!/usr/bin/env node
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { chromium, firefox, webkit } from 'playwright';
import sharp from 'sharp';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-commercial-readiness-s4-r2';
const candidatePath = '/prototypes/website-redesign-recovery/commercial-continuity/index-readiness-s4-r2.html';
const reviewPath = '/prototypes/website-redesign-recovery/commercial-continuity/review-readiness-s4-r2.html';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1366,640],[1440,700],[1440,900],[1538,636],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1440,700],[1440,900],[1538,636]];
const captureSizes = new Set(['320x568','390x844','844x390','1440x900','1538x636']);
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

await mkdir(output, { recursive: true });
const baselineHtml = await readFile(new URL('./index-readiness-s4.html', import.meta.url), 'utf8');
const htmlSource = await readFile(new URL('./index-readiness-s4-r2.html', import.meta.url), 'utf8');
const scriptSource = await readFile(new URL('./script-readiness-s4.js', import.meta.url), 'utf8');
const cssSource = await readFile(new URL('./styles-readiness-s4.css', import.meta.url), 'utf8');
const fitCssSource = await readFile(new URL('./styles-readiness-s4-r2.css', import.meta.url), 'utf8');
const allSource = `${htmlSource}\n${scriptSource}\n${cssSource}\n${fitCssSource}`;
const digest = source => createHash('sha256').update(source).digest('hex');
const normalise = source => source.replace(/\r\n/g, '\n').trimEnd();
const expectedHtml = baselineHtml
  .replace('<title>Mindmake · The Decision Balance</title>', '<title>Mindmake · The Decision Balance · fit lock</title>')
  .replace('    <link rel="stylesheet" href="./styles-readiness-s4.css" />', '    <link rel="stylesheet" href="./styles-readiness-s4.css" />\n    <link rel="stylesheet" href="./styles-readiness-s4-r2.css" />');
fail(digest(baselineHtml) !== '74795539d8517f7a9005061a0400bc2b57cc7ced7ecf7047067af9b71cfdbf45', 'lock: S4 baseline HTML changed');
fail(digest(cssSource) !== '62ea24a3bf36212ee04555b447c27a8557403cab79a32c72ba23af07ba171d4e', 'lock: S4 baseline CSS changed');
fail(digest(scriptSource) !== '451bad24d3126da11add67a3e885f0348d03ace8d7fb3ad39ff3eee0b365ada9', 'lock: S4 baseline JavaScript changed');
fail(normalise(htmlSource) !== normalise(expectedHtml), 'lock: candidate HTML differs beyond its title and additive fit stylesheet');
fail(/[—]/.test(allSource), 'source: em dash entered the S4 surface');
fail((htmlSource.match(/class="primary-action"/g) || []).length !== 1, 'source: expected exactly one filled primary action');
fail((htmlSource.match(/<video/g) || []).length !== 2, 'source: expected responsive desktop and mobile film hosts');
fail(!htmlSource.includes('Scope, duration and fee are agreed privately in writing before work starts.'), 'source: exact private commercial boundary missing');
fail(!htmlSource.includes('One real decision or capability becomes a working first version.'), 'source: first-version promise missing');
fail(!htmlSource.includes('You keep the system, its proof and standards.'), 'source: ownership promise missing');
fail(/thirty|30[ -]?day|£|\$[0-9]|€|per month/i.test(allSource), 'source: forbidden public duration or price entered the candidate');
fail(scriptSource.includes('currentTime'), 'source: film motion writes video.currentTime');

const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: false }, logLevel: 'error' });
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

async function load(page, path = candidatePath) {
  const isReview = path === reviewPath;
  await page.goto(origin + path, { waitUntil: isReview ? 'domcontentloaded' : 'networkidle' });
  if (isReview) {
    await page.waitForFunction(() => {
      const frames = [...document.querySelectorAll('iframe')];
      return frames.length === 3 && frames.every(frame => frame.contentDocument?.readyState === 'complete' && frame.contentDocument.body?.innerText.includes('Build one useful AI system on real work.'));
    }, { timeout: 20000 });
    await Promise.all(page.frames().slice(1).map(frame => frame.evaluate(() => document.fonts?.ready)));
  }
  await page.evaluate(() => document.fonts?.ready);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const measure = page => page.evaluate(() => {
  const visible = node => {
    if (!node || node.hidden) return false;
    const style = getComputedStyle(node);
    const box = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .01 && box.width > .5 && box.height > .5 && box.right > 0 && box.bottom > 0 && box.left < innerWidth && box.top < innerHeight;
  };
  const escapes = [];
  for (const boundary of document.querySelectorAll('.offer-panel,.instrument-heading,.pan,.stage-jumps,.decision-input,.decision-result')) {
    if (!visible(boundary)) continue;
    const outer = boundary.getBoundingClientRect();
    for (const node of boundary.querySelectorAll('h1,h2,p,a,button,strong,small,span,dt,dd,label')) {
      if (!visible(node) || node.children.length) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const line of range.getClientRects()) {
        if (line.width < .5 || line.height < .5) continue;
        if (line.left < outer.left - 7 || line.right > outer.right + 7 || line.top < outer.top - 7 || line.bottom > outer.bottom + 7) {
          escapes.push({ text: node.textContent.trim().slice(0,60), line: line.toJSON(), outer: outer.toJSON() });
        }
      }
    }
  }
  const smallTargets = [...document.querySelectorAll('a,button,input[type="range"]')].filter(visible).map(node => ({
    name: (node.textContent || node.getAttribute('aria-label') || node.id || '').trim().replace(/\s+/g,' ').slice(0,52),
    box: node.getBoundingClientRect().toJSON(),
  })).filter(({ box }) => box.width < 43.5 || box.height < 43.5);
  const sources = [...document.querySelectorAll('video')].filter(node => node.getAttribute('src'));
  const primary = document.querySelector('.primary-action')?.getBoundingClientRect().toJSON();
  const brand = document.querySelector('.brand')?.getBoundingClientRect().toJSON();
  const contentAnchor = document.querySelector('.offer-panel h1')?.getBoundingClientRect().toJSON();
  const firstScreenSelectors = ['.offer-panel','.primary-action','.instrument-heading','.balance-assembly','.calibration-control','.stage-jumps'];
  const firstScreen = innerWidth > 860 ? firstScreenSelectors.map(selector => ({ selector, box: document.querySelector(selector)?.getBoundingClientRect().toJSON() })) : [];
  return {
    width: innerWidth, height: innerHeight,
    x: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    escapes, smallTargets, primary, brand, contentAnchor, firstScreen,
    text: (document.body.innerText || '').replace(/\s+/g,' ').trim(),
    activeSources: sources.length,
    sources: sources.map(node => node.id),
  };
});

function assess(state, label, { requireTargetSize = true, requireFirstScreen = true } = {}) {
  fail(state.x > 1, `${label}: horizontal document overflow ${state.x}`);
  fail(state.escapes.length > 0, `${label}: painted text escapes boundary ${JSON.stringify(state.escapes.slice(0,3))}`);
  const gridDrift = state.brand && state.contentAnchor ? Math.abs(state.brand.left - state.contentAnchor.left) : Infinity;
  fail(gridDrift > 2, `${label}: logo/content grid drift ${gridDrift}px`);
  if (requireFirstScreen) {
    const firstScreenEscapes = state.firstScreen.filter(({ box }) => !box || box.top < -1 || box.bottom > state.height + 1 || box.left < -1 || box.right > state.width + 1);
    fail(firstScreenEscapes.length > 0, `${label}: desktop first-screen composition escapes viewport ${JSON.stringify(firstScreenEscapes)}`);
  }
  if (requireTargetSize) fail(state.smallTargets.length > 0, `${label}: controls below 44px ${JSON.stringify(state.smallTargets.slice(0,5))}`);
}

const required = [
  'Build one useful AI system on real work.',
  'Start with your judgement or your route to market. Both lead to one paid proof.',
  'Build your AI brain', 'Build your AI go-to-market',
  'One real decision or capability becomes a working first version.',
  'We use it on real work.', 'You keep the system, its proof and standards.',
  'Scope, duration and fee are agreed privately in writing before work starts.',
  'Start here', 'Get a first decision record before email',
  'AI carries', 'You keep', 'Decision', 'Evidence', 'First version', 'Real work', 'Yours'
];
const forbidden = [
  'Open any result', 'The drawing shows', 'Illustrative machinery films', 'Book a call', 'Schedule a call',
  'per month', 'thirty days', '30-day', '30 day', 'unlock', 'AI transformation'
];

async function exercise(page, label, width, height, capture = false) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await load(page);
  let state = await measure(page);
  assess(state, `${label} cold`);
  for (const phrase of required) fail(!state.text.toLowerCase().includes(phrase.toLowerCase()), `${label}: missing meaning "${phrase}"`);
  for (const phrase of forbidden) fail(state.text.toLowerCase().includes(phrase.toLowerCase()), `${label}: forbidden copy "${phrase}"`);
  fail((await page.locator('a[href="/ai-brain"]').count()) !== 1, `${label}: Brain must remain one ordinary link`);
  fail((await page.locator('a[href="/ai-gtm"]').count()) !== 1, `${label}: GTM must remain one ordinary link`);
  fail((await page.locator('a[href="/ai-brain"]').getAttribute('aria-pressed')) !== null, `${label}: Brain link became a selectable control`);
  fail((await page.locator('a[href="/ai-gtm"]').getAttribute('aria-pressed')) !== null, `${label}: GTM link became a selectable control`);
  fail(!state.primary || state.primary.top < -1 || state.primary.bottom > height + 1, `${label}: Start here is not cold-visible ${JSON.stringify(state.primary)}`);
  fail(state.activeSources !== 1, `${label}: expected one active film source, saw ${state.activeSources} ${JSON.stringify(state.sources)}`);
  const expectedFilm = width <= 860 ? 'arrival-film' : 'decision-film';
  fail(state.sources[0] !== expectedFilm, `${label}: wrong responsive film host ${JSON.stringify(state.sources)}`);
  if (capture) await page.screenshot({ path: `${output}/${label}-cold.png`, fullPage: false });

  if (width > 860) {
    const sectionTravel = await page.locator('.balance-stage').evaluate(node => node.offsetHeight - innerHeight);
    await page.evaluate(distance => scrollTo(0, distance), sectionTravel);
    await page.waitForTimeout(450);
    fail((await page.locator('#proof-stage').inputValue()) !== '4', `${label}: desktop scroll did not resolve the proof`);
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(450);
    fail((await page.locator('#proof-stage').inputValue()) !== '0', `${label}: reverse scroll did not restore the first reading`);
  } else {
    await page.locator('.balance-instrument').scrollIntoViewIfNeeded();
    await page.waitForTimeout(100);
  }

  const range = page.locator('#proof-stage');
  await range.focus();
  await range.press('End');
  fail((await range.inputValue()) !== '4', `${label}: range End did not select Yours`);
  fail((await page.locator('[data-stage="4"]').getAttribute('aria-pressed')) !== 'true', `${label}: range and reading diverged`);
  fail(!(await page.locator('#reading-title').innerText()).includes('useful system stays'), `${label}: final reading missing`);
  await range.press('Home');
  await page.locator('[data-stage="2"]').click();
  fail((await range.inputValue()) !== '2', `${label}: tap/click did not select First version`);
  fail(!(await page.locator('#reading-title').innerText()).includes('working first version'), `${label}: first-version reading missing`);

  await page.locator('#start-here').click();
  fail(!(await page.locator('#decision-dialog').evaluate(node => node.open)), `${label}: Start here did not open`);
  fail(!(await page.locator('#decision-input').evaluate(node => node === document.activeElement)), `${label}: entry focus missed decision input`);
  await page.locator('.frame-action').click();
  fail(!(await page.locator('#decision-error').isVisible()), `${label}: empty decision has no recovery`);
  const value = 'Decide whether we build or partner';
  await page.locator('#decision-input').fill(value);
  await page.locator('.frame-action').click();
  fail(!(await page.locator('.decision-result').isVisible()), `${label}: decision record did not appear`);
  const result = await page.locator('.decision-result').innerText();
  for (const phrase of [value, 'build, buy and hybrid paths', 'working route-comparison instrument', 'reversal condition', 'Nothing has been sent']) {
    fail(!result.toLowerCase().includes(phrase.toLowerCase()), `${label}: decision record missing "${phrase}"`);
  }
  fail((await page.locator('input[type="email"]').count()) !== 0, `${label}: email appears before delivered value`);
  fail((await page.locator('.continue-link').getAttribute('href')) !== '/?start=1', `${label}: private continuation target changed`);
  if (capture) await page.screenshot({ path: `${output}/${label}-result.png`, fullPage: false });
  await page.locator('.copy-record').click();
  await page.waitForFunction(() => document.querySelector('.copy-record')?.textContent !== 'Copy record');
  fail((await page.locator('.copy-record').innerText()) === 'Copy record', `${label}: copy action has no consequence`);
  await page.keyboard.press('Escape');
  fail(await page.locator('#decision-dialog').evaluate(node => node.open), `${label}: Escape did not close`);
  fail(!(await page.locator('#start-here').evaluate(node => node === document.activeElement)), `${label}: close did not restore focus`);
  await page.locator('#start-here').click();
  fail(!(await page.locator('.decision-result').isVisible()), `${label}: completed record did not survive interruption`);
  await page.locator('.change-decision').click();
  fail(!(await page.locator('.decision-input').isVisible()), `${label}: record has no change/recovery path`);
  fail((await page.locator('#decision-input').inputValue()) !== value, `${label}: original decision was lost`);
  await page.keyboard.press('Escape');

  state = await measure(page);
  assess(state, `${label} exercised`, { requireFirstScreen: false });
  fail(errors.length > 0, `${label}: runtime errors ${JSON.stringify(errors)}`);
}

async function run(engine, name, viewports) {
  const browser = await engine.launch(name === 'chromium' ? { headless: true, channel: 'chrome' } : { headless: true });
  try {
    for (const [width,height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await exercise(page, `${name}-${width}x${height}`, width, height, name === 'chromium' && captureSizes.has(`${width}x${height}`));
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
      fail(state.activeSources !== 0, `${mode}: moving source attached`);
      await page.locator('#start-here').click();
      fail(!(await page.locator('#decision-dialog').evaluate(node => node.open)), `${mode}: Start here failed`);
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
    fail(state.x > 1, `no-js: horizontal overflow ${state.x}`);
    fail(state.activeSources !== 0, 'no-js: moving source attached');
    fail((await page.locator('#start-here').getAttribute('href')) !== '/?start=1', 'no-js: Start here fallback changed');
    for (const phrase of required) fail(!state.text.toLowerCase().includes(phrase.toLowerCase()), `no-js: missing "${phrase}"`);
    await context.close();
  } finally { await browser.close(); }
}

async function increasedText() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [width,height] of [[320,568],[225,568]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await load(page);
      await page.addStyleTag({ content: 'html{font-size:200%!important}' });
      await page.waitForTimeout(150);
      const state = await measure(page);
      assess(state, `text-200-${width}x${height}`, { requireTargetSize: false });
      await context.close();
    }
  } finally { await browser.close(); }
}

async function unavailableMedia() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.route('**/*.mp4', route => route.abort());
    const page = await context.newPage();
    await load(page);
    await page.waitForTimeout(150);
    fail(!(await page.locator('#arrival-film').getAttribute('poster')), 'unavailable-media: poster missing');
    fail((await page.locator('#start-here').isVisible()) === false, 'unavailable-media: action disappeared');
    await context.close();
  } finally { await browser.close(); }
}

async function reviewGeometry() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [width,height] of [[390,844],[768,1024],[1024,768],[1366,640],[1538,636],[1600,900]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await load(page, reviewPath);
      const geometry = await page.evaluate(() => {
        const problems = [...document.querySelectorAll('.window')].flatMap(win => {
          const frame = win.getBoundingClientRect();
          const canvas = win.querySelector('.canvas').getBoundingClientRect();
          return canvas.left < frame.left - 1 || canvas.right > frame.right + 1 || canvas.bottom > frame.bottom + 1 ? [{ frame: frame.toJSON(), canvas: canvas.toJSON() }] : [];
        });
        const desktop = document.querySelector('.desktop-frame .window')?.getBoundingClientRect().toJSON();
        const portrait = document.querySelector('.portrait-frame .window')?.getBoundingClientRect().toJSON();
        return {
          problems,
          horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
          desktop,
          portrait,
          sources: [...document.querySelectorAll('iframe')].map(frame => frame.getAttribute('src')),
        };
      });
      fail(geometry.problems.length > 0, `review-${width}x${height}: review canvas escapes ${JSON.stringify(geometry.problems)}`);
      fail(geometry.horizontalOverflow > 1, `review-${width}x${height}: horizontal overflow ${geometry.horizontalOverflow}`);
      fail(!geometry.desktop || geometry.desktop.bottom > height + 1, `review-${width}x${height}: desktop frame does not fit the visible screen ${JSON.stringify(geometry.desktop)}`);
      fail(!geometry.portrait || geometry.portrait.bottom > height + 1, `review-${width}x${height}: portrait frame does not fit the visible screen ${JSON.stringify(geometry.portrait)}`);
      fail(geometry.sources.some(source => source !== './index-readiness-s4-r2.html'), `review-${width}x${height}: stale frame source ${JSON.stringify(geometry.sources)}`);
      const childTexts = await Promise.all(page.frames().slice(1).map(frame => frame.locator('body').innerText()));
      fail(childTexts.length !== 3 || childTexts.some(text => !text.includes('Build one useful AI system on real work.')), `review-${width}x${height}: blank or stale rendered frame`);
      if (width === 1538 && height === 636) await page.screenshot({ path: `${output}/review-1538x636.png`, fullPage: false });
      await context.close();
    }
  } finally { await browser.close(); }
}

try {
  await run(chromium, 'chromium', chromiumViewports);
  await run(webkit, 'webkit', representative);
  await run(firefox, 'firefox', representative);
  await constrainedModes();
  await noJavaScript();
  await increasedText();
  await unavailableMedia();
  await reviewGeometry();

  const desktop = await readFile(`${output}/chromium-1440x900-cold.png`);
  const mobile = await readFile(`${output}/chromium-390x844-cold.png`);
  const desktopResized = await sharp(desktop).resize({ width: 1040, height: 900, fit: 'inside' }).png().toBuffer();
  const mobileResized = await sharp(mobile).resize({ width: 460, height: 900, fit: 'inside' }).png().toBuffer();
  await sharp({ create: { width: 1500, height: 900, channels: 4, background: '#04100b' } })
    .composite([{ input: desktopResized, top: 0, left: 0 }, { input: mobileResized, top: 0, left: 1040 }])
    .png().toFile(`${output}/paired-review.png`);

  console.log(JSON.stringify({
    artifact: 'commercial-readiness-s4-r2-fit-lock',
    origin,
    output,
    chromiumViewports: chromiumViewports.length,
    representativePerSecondaryEngine: representative.length,
    physicalDevices: { iphoneSafariVoiceOver: 'not run', androidChromeTalkBack: 'not run' },
    failures,
  }, null, 2));
  if (failures.length) process.exitCode = 1;
} finally {
  await server.close();
}
