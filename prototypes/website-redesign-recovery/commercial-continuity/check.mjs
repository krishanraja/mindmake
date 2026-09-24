#!/usr/bin/env node
import { mkdir, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium, firefox, webkit } from 'playwright';
import { createServer } from 'vite';

const root = fileURLToPath(new URL('../../../', import.meta.url));
const output = 'C:/Users/krish/.scratch/mindmake-commercial-continuity-s1';
const candidatePath = '/prototypes/website-redesign-recovery/commercial-continuity/index.html';
const reviewPath = '/prototypes/website-redesign-recovery/commercial-continuity/review.html';
const chromiumViewports = [[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1024,768],[1280,800],[1440,700],[1440,900],[1920,1080]];
const representative = [[320,568],[390,844],[844,390],[1440,700],[1440,900]];
const failures = [];
const fail = (condition, message) => { if (condition) failures.push(message); };

await mkdir(output, { recursive: true });

const scriptSource = await readFile(new URL('./script.js', import.meta.url), 'utf8');
fail(scriptSource.includes('currentTime'), 'source: film motion writes video.currentTime');

const server = await createServer({
  root,
  server: { host: '127.0.0.1', port: 0, strictPort: false },
  logLevel: 'error',
});
await server.listen();
const address = server.httpServer.address();
const origin = `http://127.0.0.1:${address.port}`;

const waitForFonts = (page) => page.evaluate(() => document.fonts?.ready);

async function load(page, path = candidatePath) {
  await page.goto(origin + path, { waitUntil: 'networkidle' });
  await waitForFonts(page);
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

const measure = (page) => page.evaluate(() => {
  const visible = (node) => {
    if (!node) return false;
    const style = getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > .01 && rect.width > .5 && rect.height > .5;
  };
  const rect = (node) => node?.getBoundingClientRect().toJSON();
  const viewport = { left: 0, top: 0, right: innerWidth, bottom: innerHeight };
  // Font range boxes may extend a few pixels beyond their CSS line box for
  // ascenders/descenders. Six pixels still catches actual clipping while
  // avoiding false failures from the variable serif metrics across engines.
  const outside = (box, outer = viewport, tolerance = 6) => box.left < outer.left - tolerance || box.right > outer.right + tolerance || box.top < outer.top - tolerance || box.bottom > outer.bottom + tolerance;
  const paintedEscapes = [];
  for (const boundary of document.querySelectorAll('.copy-boundary,.proof-heading,.proof-contract,.outcome-field,.topbar,.film-state,figcaption')) {
    if (!visible(boundary)) continue;
    const box = boundary.getBoundingClientRect();
    for (const node of boundary.querySelectorAll('h1,h2,p,a,button,strong,span')) {
      if (!visible(node) || node.children.length) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      for (const line of range.getClientRects()) {
        if (line.width > .5 && line.height > .5 && outside(line, box)) {
          paintedEscapes.push({ text: node.textContent.trim().slice(0, 54), line: line.toJSON(), box: box.toJSON() });
        }
      }
    }
  }
  const targets = [...document.querySelectorAll('a,button')].filter(visible).map(node => ({
    name: (node.textContent || node.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 42),
    box: node.getBoundingClientRect().toJSON(),
  })).filter(({ box }) => box.width < 43.5 || box.height < 43.5);
  const nested = [...document.querySelectorAll('.proof-content,.proof-contract,.outcome-field,.outcomes')]
    .filter(visible)
    .map(node => ({ className: node.className, x: node.scrollWidth - node.clientWidth, y: node.scrollHeight - node.clientHeight }))
    .filter(item => item.x > 1 || item.y > 1);
  const proof = document.querySelector('.proof-plane');
  const film = document.querySelector('.film-plane');
  const proofBox = proof?.getBoundingClientRect();
  const filmBox = film?.getBoundingClientRect();
  const copyBox = document.querySelector('.proof-content')?.getBoundingClientRect();
  const seamStyle = getComputedStyle(document.querySelector('.material-seam'));
  return {
    viewport: { width: innerWidth, height: innerHeight },
    documentX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
    documentY: document.documentElement.scrollHeight - document.documentElement.clientHeight,
    paintedEscapes,
    targets,
    nested,
    proof: proofBox?.toJSON(),
    film: filmBox?.toJSON(),
    copy: copyBox?.toJSON(),
    heading: rect(document.querySelector('h1')),
    contract: rect(document.querySelector('.proof-contract')),
    outcomes: rect(document.querySelector('.outcome-field')),
    primary: rect(document.querySelector('.primary-action')),
    doors: [...document.querySelectorAll('.door-links a')].map(rect),
    filmCaption: rect(document.querySelector('figcaption')),
    seamVisible: seamStyle.display !== 'none' && Number(seamStyle.opacity) > .01,
    videoCount: document.querySelectorAll('video').length,
    videoSrc: document.querySelector('video')?.getAttribute('src') || '',
    videoPoster: document.querySelector('video')?.getAttribute('poster') || '',
    videoPlaying: Boolean(document.querySelector('video') && !document.querySelector('video').paused),
    context: document.querySelector('.proof-stage')?.dataset.context,
    progress: getComputedStyle(document.querySelector('.proof-surface')).getPropertyValue('--p').trim(),
    staticMode: document.documentElement.classList.contains('is-static'),
    mainText: document.querySelector('main')?.innerText || '',
  };
});

function assess(state, label, { allowDocumentY = true } = {}) {
  fail(state.documentX > 1, `${label}: horizontal document overflow ${state.documentX}`);
  if (!allowDocumentY) fail(state.documentY > 1, `${label}: document exceeds fixed viewport by ${state.documentY}`);
  fail(state.paintedEscapes.length > 0, `${label}: painted text escapes its boundary ${JSON.stringify(state.paintedEscapes.slice(0, 3))}`);
  fail(state.targets.length > 0, `${label}: controls below 44px target floor ${JSON.stringify(state.targets.slice(0, 5))}`);
  fail(state.nested.length > 0, `${label}: clipped or nested overflow ${JSON.stringify(state.nested.slice(0, 4))}`);
  fail(state.videoCount !== 1, `${label}: expected one video element, saw ${state.videoCount}`);
  fail(!state.videoPoster, `${label}: film has no static poster`);
}

async function exercise(page, label, width, height, capture = false) {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await load(page);
  let state = await measure(page);
  assess(state, `${label} cold`);
  fail(!state.mainText.includes('Two ways in. One paid proof.'), `${label}: two-door commercial hierarchy is missing`);
  fail(!state.mainText.includes('We choose one important decision or capability.'), `${label}: paid-proof promise is missing`);
  fail(!state.mainText.includes('Founder-owned publishing moved from days to under an hour'), `${label}: publishing outcome is missing`);
  fail(!state.mainText.includes('Fourteen vendors became three decisions.'), `${label}: vendor outcome is missing`);
  fail(!state.mainText.includes('Read all eight stories'), `${label}: case-study continuity link is missing`);
  if (width === 1440 && height === 900) {
    for (const [name, box] of [['heading',state.heading],['contract',state.contract],['outcomes',state.outcomes],['primary',state.primary],...state.doors.map((box,index)=>[`door-${index + 1}`,box])]) {
      fail(!box || box.top < -1 || box.bottom > height + 1, `${label}: ${name} is not cold-visible ${JSON.stringify(box)}`);
    }
  }
  if (width === 320 && height === 568) {
    fail(!state.primary || state.primary.top < -1 || state.primary.bottom > height + 1, `${label}: primary action is not cold-visible ${JSON.stringify(state.primary)}`);
  }
  const alignment = await page.evaluate(() => ({
    brand: document.querySelector('.brand')?.getBoundingClientRect().left,
    heading: document.querySelector('.proof-heading h1')?.getBoundingClientRect().left,
  }));
  if (!(height <= 520 && width > height)) {
    fail(Math.abs(alignment.brand - alignment.heading) > 2.1, `${label}: header/content grid drifts by ${Math.abs(alignment.brand - alignment.heading).toFixed(2)}px`);
  }
  fail(state.mainText.includes('Illustrative sequence. Not evidence.'), `${label}: forbidden visual-disclaimer copy is visible`);
  fail(!state.mainText.includes('AI go-to-market'), `${label}: GTM is not expanded on first use`);
  fail((await page.locator('#start-link').getAttribute('href')) !== '/?start=1', `${label}: Leadership Start here target is wrong`);
  fail((await page.locator('.context-nav a').count()) !== 2, `${label}: context navigation changed shape`);

  await page.locator('[data-context-link="brain"]').click();
  await page.waitForTimeout(60);
  fail(!page.url().includes('context=brain'), `${label}: Brain context is not encoded in URL`);
  fail((await page.locator('#start-link').getAttribute('href')) !== '/?start=brain', `${label}: Brain Start here target is wrong`);
  fail(!(await page.locator('video').getAttribute('poster'))?.includes('evidence-connects'), `${label}: Brain film did not become evidence-connects`);

  await page.locator('[data-context-link="gtm"]').click();
  await page.waitForTimeout(60);
  fail((await page.locator('#start-link').getAttribute('href')) !== '/?start=gtm', `${label}: GTM Start here target is wrong`);
  state = await measure(page);
  if (state.staticMode) {
    fail(!(await page.locator('video').getAttribute('poster'))?.includes('signals-arrive'), `${label}: static short-landscape state did not resolve to signals-arrive`);
  } else {
    fail(!(await page.locator('video').getAttribute('poster'))?.includes('quiet-workshop-growth'), `${label}: GTM cold film is not quiet-workshop-growth`);
    const stageTop = await page.locator('.proof-stage').evaluate(node => node.getBoundingClientRect().top + scrollY);
    const distance = width <= 860 ? 190 : Math.max(260, height * .65);
    await page.evaluate(y => {
      document.documentElement.scrollTop = y;
      document.body.scrollTop = y;
      dispatchEvent(new Event('scroll'));
    }, stageTop + distance * .82);
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(80);
    state = await measure(page);
    assess(state, `${label} built`);
    fail(Number(state.progress) < .72, `${label}: scroll build did not reach its resolved state (${state.progress})`);
    fail(!(await page.locator('video').getAttribute('poster'))?.includes('signals-arrive'), `${label}: GTM film did not hand off to signals-arrive`);
    fail(!await page.locator('#film-toggle').isHidden(), `${label}: film control remains partially exposed after the film plane retires`);
    const retiredOpacity = await page.locator('.film-state').evaluate(node => Number(getComputedStyle(node).opacity));
    fail(retiredOpacity > .02, `${label}: film-side sentence remains visible after the seam crosses it (${retiredOpacity})`);

    await page.evaluate(() => {
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      dispatchEvent(new Event('scroll'));
    });
    await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
    await page.waitForTimeout(80);
    state = await measure(page);
    fail(Number(state.progress) > .08, `${label}: reverse scroll did not restore the opening state (${state.progress})`);
    fail(!(await page.locator('video').getAttribute('poster'))?.includes('quiet-workshop-growth'), `${label}: reverse scroll did not restore quiet-workshop-growth`);
  }

  const toggle = page.locator('#film-toggle');
  if (await toggle.isVisible()) {
    await toggle.click();
    fail((await toggle.getAttribute('aria-pressed')) !== 'true' || (await toggle.innerText()) !== 'Play film', `${label}: film pause consequence is unclear`);
    await toggle.click();
    await page.waitForFunction(() => document.querySelector('#film-toggle')?.getAttribute('aria-pressed') === 'false');
    fail((await toggle.getAttribute('aria-pressed')) !== 'false' || (await toggle.innerText()) !== 'Pause film', `${label}: film play consequence is unclear`);
  }
  fail(errors.length > 0, `${label}: runtime errors ${errors.join(' | ')}`);

  if (capture) {
    await page.evaluate(() => { const video = document.querySelector('video'); video?.pause(); });
    await page.screenshot({ path: `${output}/${label.replaceAll(' ', '-').replace('×','x')}.png`, fullPage: false });
  }
}

async function run(browserType, name, viewports) {
  const browser = await browserType.launch({ headless: true, ...(browserType === chromium ? { channel: 'chrome' } : {}) });
  try {
    for (const [width, height] of viewports) {
      const context = await browser.newContext({ viewport: { width, height }, reducedMotion: 'no-preference' });
      const page = await context.newPage();
      const capture = name === 'chromium' && ((width === 390 && height === 844) || (width === 1440 && height === 900));
      await exercise(page, `${name} ${width}×${height}`, width, height, capture);
      await context.close();
    }
  } finally {
    await browser.close();
  }
}

async function reducedMotionAndSaveData() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const mode of ['reduced-motion', 'save-data']) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: mode === 'reduced-motion' ? 'reduce' : 'no-preference' });
      if (mode === 'save-data') {
        await context.addInitScript(() => Object.defineProperty(navigator, 'connection', { configurable: true, value: { saveData: true } }));
      }
      const page = await context.newPage();
      await load(page);
      const state = await measure(page);
      assess(state, mode);
      fail(Boolean(state.videoSrc), `${mode}: video source was attached`);
      fail(state.videoPlaying, `${mode}: film is moving`);
      fail(!state.staticMode, `${mode}: surface retained its sticky scroll chapter`);
      fail(!await page.locator('#film-toggle').isHidden(), `${mode}: unusable film toggle remains visible`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function noJavaScript() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto(origin + candidatePath, { waitUntil: 'networkidle' });
    const state = await measure(page);
    assess(state, 'no JavaScript');
    fail(!state.mainText.includes('Two ways in. One paid proof.'), 'no JavaScript: complete commercial meaning is absent');
    fail(Boolean(state.videoSrc), 'no JavaScript: video source is attached');
    fail(!state.videoPoster, 'no JavaScript: poster fallback is absent');
    fail(!await page.locator('#film-toggle').isHidden(), 'no JavaScript: unavailable film control remains visible');
    fail((await page.locator('[data-context-link="brain"]').getAttribute('href')) !== '/ai-brain', 'no JavaScript: Brain door is not a real route');
    fail((await page.locator('[data-context-link="gtm"]').getAttribute('href')) !== '/ai-gtm', 'no JavaScript: GTM door is not a real route');
    await context.close();
  } finally { await browser.close(); }
}

async function textScale200() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    for (const [width, height] of [[225,568],[320,568],[390,844],[844,390],[1440,900]]) {
      const context = await browser.newContext({ viewport: { width, height } });
      const page = await context.newPage();
      await load(page);
      await page.evaluate(() => {
        document.documentElement.dataset.textScale = '200';
        document.documentElement.style.fontSize = '200%';
        dispatchEvent(new Event('resize'));
      });
      await page.waitForTimeout(80);
      const state = await measure(page);
      assess(state, `200% ${width}×${height}`);
      fail(!state.staticMode, `200% ${width}×${height}: sticky chapter was not released`);
      fail(!state.mainText.includes('Fourteen vendors became three decisions.'), `200% ${width}×${height}: outcome meaning disappeared`);
      await context.close();
    }
  } finally { await browser.close(); }
}

async function coarsePointer() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
    const page = await context.newPage();
    await load(page);
    const state = await measure(page);
    assess(state, 'coarse pointer');
    await page.locator('[data-context-link="brain"]').tap();
    fail(!page.url().includes('context=brain'), 'coarse pointer: context control did not respond to touch');
    await context.close();
  } finally { await browser.close(); }
}

async function unavailableMedia() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.route('**/*.mp4', route => route.abort('failed'));
    await load(page);
    await page.waitForTimeout(120);
    const state = await measure(page);
    assess(state, 'unavailable media');
    fail(!await page.locator('#film-toggle').isHidden(), 'unavailable media: false playback control remains visible');
    fail(!state.videoPoster, 'unavailable media: poster fallback is absent');
    fail(state.videoPlaying, 'unavailable media: video reports moving');
    await context.close();
  } finally { await browser.close(); }
}

async function offscreenPlayback() {
  const browser = await chromium.launch({ headless: true, channel: 'chrome' });
  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    await load(page);
    await page.waitForTimeout(180);
    await page.evaluate(() => {
      const spacer = document.createElement('div');
      spacer.style.height = '2200px';
      spacer.setAttribute('aria-hidden', 'true');
      document.body.append(spacer);
      scrollTo(0, document.body.scrollHeight);
    });
    await page.waitForTimeout(240);
    fail(!await page.locator('video').evaluate(node => node.paused), 'offscreen media: film continues playing after surface leaves viewport');
    await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(240);
    fail(await page.locator('video').evaluate(node => node.paused), 'offscreen media: visible film does not resume');
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
    fail(geometry.frames.length !== 2, `review: expected two live surfaces, saw ${geometry.frames.length}`);
    for (const [index, item] of geometry.frames.entries()) {
      fail(item.frame.left < item.window.left - 1 || item.frame.top < item.window.top - 1, `review: frame ${index + 1} is offset outside its canvas`);
    }
    for (const frame of page.frames().slice(1)) await frame.evaluate(() => document.querySelector('video')?.pause());
    await page.screenshot({ path: `${output}/paired-review.png`, fullPage: true });
    await context.close();
  } finally { await browser.close(); }
}

try {
  await run(chromium, 'chromium', chromiumViewports);
  await run(webkit, 'webkit', representative);
  await run(firefox, 'firefox', representative);
  await reducedMotionAndSaveData();
  await noJavaScript();
  await textScale200();
  await coarsePointer();
  await unavailableMedia();
  await offscreenPlayback();
  await reviewCapture();
} finally {
  await server.close();
}

console.log(JSON.stringify({
  artifact: 'COMMERCIAL-CONTINUITY-S1',
  origin,
  chromium: chromiumViewports.map(([w,h]) => `${w}x${h}`),
  webkit: representative.map(([w,h]) => `${w}x${h}`),
  firefox: representative.map(([w,h]) => `${w}x${h}`),
  evidence: output,
  physicalDevices: 'not run',
  failures,
}, null, 2));
if (failures.length) process.exitCode = 1;
