import { chromium, firefox, webkit } from 'playwright';
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { asked } from './lib/asked.mjs';

// Bounded public-route smoke. No form delivery, external navigation or network writes.
let server;
try {
const root = path.resolve(import.meta.dirname, '../..');
const matrix = { chromium: [{ width: 320, height: 568 }, { width: 390, height: 844 }, { width: 1108, height: 574 }, { width: 1440, height: 900 }], firefox: [{ width: 390, height: 844 }, { width: 1440, height: 900 }], webkit: [{ width: 390, height: 844 }, { width: 1440, height: 900 }] };
const engineFilter = process.env.QA_ENGINE;
const widthFilter = process.env.QA_WIDTH;
const routeFilter = process.env.QA_ROUTE;
if (engineFilter !== undefined && !Object.hasOwn(matrix, engineFilter)) throw new Error(`Unknown QA_ENGINE: ${engineFilter}`);
if (widthFilter !== undefined && (!/^[1-9]\d*$/.test(widthFilter) || !Number.isSafeInteger(Number(widthFilter)))) throw new Error(`Invalid QA_WIDTH: ${widthFilter}`);
const activeMatrix = Object.entries(matrix).filter(([engine]) => engineFilter === undefined || engine === engineFilter)
  .map(([engine, viewports]) => [engine, viewports.filter(viewport => widthFilter === undefined || viewport.width === Number(widthFilter))])
  .filter(([, viewports]) => viewports.length);
if (!activeMatrix.length) throw new Error(`QA_WIDTH matches no viewport for the selected engines: ${widthFilter}`);
const sitemap = await readFile(path.join(root, 'dist/sitemap.xml'), 'utf8');
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
if (!routes.length || new Set(routes).size !== routes.length) throw new Error('Built sitemap has no routes or duplicate routes');
if (routeFilter !== undefined && !routes.includes(routeFilter)) throw new Error(`QA_ROUTE matches no built public route: ${routeFilter}`);
const activeRoutes = routes.filter(route => routeFilter === undefined || route === routeFilter);
const activeViewportCount = activeMatrix.reduce((count, [, viewports]) => count + viewports.length, 0);
const expectedCounts = {
  routeCases: activeViewportCount * activeRoutes.length,
  coreNavigation: routeFilter === undefined ? activeViewportCount : 0,
  routerPatterns: routeFilter === undefined && activeMatrix.some(([engine]) => engine === 'chromium') ? 1 : 0,
};
expectedCounts.supplemental = expectedCounts.coreNavigation + expectedCounts.routerPatterns;
const origin = process.env.QA_BASE_URL || 'http://127.0.0.1:4344';
if (!['127.0.0.1', 'localhost'].includes(new URL(origin).hostname)) throw new Error('A local built preview is required');
if (!process.env.QA_BASE_URL) {
  server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4344', '--strictPort'], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  // Terminal colour codes differ between Windows and Linux CI. Readiness is
  // an actual HTTP response, not a substring of Vite's decorated console URL.
  let startupError;
  let startupOutput = '';
  server.once('error', error => { startupError = error; });
  server.once('exit', code => { startupError = new Error(`Owned preview exited ${code}: ${startupOutput}`); });
  server.stderr.on('data', chunk => { startupOutput += chunk.toString(); });
  server.stdout.on('data', chunk => { startupOutput += chunk.toString(); });
  const deadline = Date.now() + 20000;
  let ready = false;
  while (Date.now() < deadline) {
    if (startupError) throw startupError;
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 150));
  }
  if (!ready) throw new Error(`Owned built preview did not respond within 20 seconds: ${startupOutput}`);
}
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const indexBytes = await readFile(path.join(root, 'dist/index.html'));
const indexSha256 = digest(indexBytes);
if (digest(Buffer.from(await (await fetch(`${origin}/`)).text())) !== indexSha256) throw new Error('Served homepage differs from dist/index.html');
const appSource = await readFile(path.join(root, 'src/App.tsx'), 'utf8');
const literalRoutes = [...appSource.matchAll(/<Route path="([^"]+)"/g)].map(match => match[1]);
const retired = [...appSource.matchAll(/^\s+"(\/[^"\n]+)",\r?$/gm)].map(match => match[1]);
const cases = [], failures = [], supplemental = [];
const evidence = path.join(root, 'artifacts/homepage-release');
await mkdir(evidence, { recursive: true });
const scriptSha256 = digest(await readFile(new URL(import.meta.url)));
const runStamp = new Date().toISOString().replace(/[:.]/g, '-');
const runName = `route-smoke-${indexSha256.slice(0, 12)}${process.env.QA_ENGINE ? `-${process.env.QA_ENGINE}` : ''}${process.env.QA_WIDTH ? `-${process.env.QA_WIDTH}` : ''}${process.env.QA_ROUTE ? `-${process.env.QA_ROUTE.replace(/[^a-z0-9]/gi, '_')}` : ''}-${runStamp}`;
const observationsFile = path.join(evidence, `${runName}.jsonl`);
await writeFile(observationsFile, JSON.stringify({ kind: 'run-start', at: new Date().toISOString(), origin, indexSha256, scriptSha256, routes, expectedCounts, filters: { engine: process.env.QA_ENGINE || null, width: process.env.QA_WIDTH || null, route: process.env.QA_ROUTE || null } }) + '\n');
async function persistObservation(kind, record) {
  await appendFile(observationsFile, JSON.stringify({ kind, indexSha256, scriptSha256, record }) + '\n');
  console.log(JSON.stringify({ observed: record.id, failures: record.failures }));
}
const assert = (record, condition, label) => { if (!condition) { record.failures.push(label); failures.push(`${record.id}: ${label}`); } };
const settle = page => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
const rect = box => box && ({ x: box.x, y: box.y, width: box.width, height: box.height });

async function prepare(page, record) {
  page.setDefaultTimeout(12000);
  record.readiness = [];
  record.pendingRequests = [];
  const pending = new Map();
  const publishPending = () => { record.pendingRequests = [...pending.values()]; };
  page.on('request', request => {
    const url = new URL(request.url());
    if (url.origin !== origin) return;
    pending.set(request, { path: url.pathname, type: request.resourceType() });
    publishPending();
  });
  for (const event of ['requestfinished', 'requestfailed']) page.on(event, request => { pending.delete(request); publishPending(); });
  page.on('pageerror', error => record.pageerrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error' && /hydrati|Minified React error #(418|423|425)/i.test(message.text())) record.hydrationConsoleErrors.push(message.text()); });
  await page.addInitScript(targetOrigin => {
    if (location.origin !== targetOrigin) return;
    localStorage.setItem('mindmake_consent', 'accepted');
    window.__routeSmoke = { serverHeading: null };
    const capture = () => {
      const heading = document.querySelector('#root main h1');
      if (heading) { window.__routeSmoke.serverHeading = heading; observer.disconnect(); }
    };
    const observer = new MutationObserver(capture);
    observer.observe(document, { childList: true, subtree: true });
    capture();
  }, origin);
  await page.route('**/*', async intercepted => {
    const request = intercepted.request();
    const url = new URL(request.url());
    if (url.origin !== origin || !['GET', 'HEAD'].includes(request.method())) {
      record.blockedRequests.push({ method: request.method(), external: url.origin !== origin, path: url.pathname });
      await intercepted.abort();
      return;
    }
    // Vite preview lacks Vercel's directory-index lookup for untrailed native links.
    // Serve the exact corresponding built response without changing its bytes or URL.
    if (request.isNavigationRequest() && routes.includes(url.pathname) && url.pathname !== '/' && !url.pathname.endsWith('/')) {
      record.directoryIndexMappings.push(url.pathname);
      await intercepted.fulfill({ response: await intercepted.fetch({ url: `${origin}${asked(url.pathname)}${url.search}` }) });
      return;
    }
    await intercepted.continue();
  });
}

async function ready(page, record) {
  const stage = name => {
    const entry = { name, path: new URL(page.url()).pathname, startedAt: new Date().toISOString() };
    record.readiness.push(entry);
    const start = performance.now();
    return () => { entry.completedMs = Math.round(performance.now() - start); };
  };
  let complete = stage('react-root-and-heading');
  await page.waitForFunction(() => {
    const node = document.querySelector('#root');
    return node && Object.keys(node).some(key => key.startsWith('__reactContainer')) && document.querySelector('main h1');
  });
  complete();
  complete = stage('fonts-ready');
  await page.evaluate(() => document.fonts.ready);
  complete();
  complete = stage('curtain-released');
  await page.waitForFunction(() => !document.documentElement.classList.contains('mm-covered'));
  complete();
  await page.waitForTimeout(180);
  await settle(page);
}

async function failureScreenshot(page, record) {
  if (record.screenshot) return;
  record.screenshot = `${runName}-${record.id.replace(/[^a-z0-9]/gi, '_')}-failure.png`;
  try { await page.screenshot({ path: path.join(evidence, record.screenshot), timeout: 3000 }); }
  catch (error) { record.screenshotFailure = error.message; delete record.screenshot; }
}

async function menuCheck(page, record) {
  await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
  const opener = page.getByRole('button', { name: 'Open navigation', exact: true }).filter({ visible: true });
  /* /new-age-leadership used to be exempt here, because it drew its own
     masthead with a home link and a motion control instead of the shared
     navigation. It now wears the same shell as every other route, so the
     exemption is gone and the route takes the check below. */
  if (!await opener.count()) { assert(record, false, 'Navigation opener missing'); return; }
  await opener.first().click();
  const openStarted = performance.now();
  let openReady = true;
  await page.waitForFunction(() => Boolean(document.querySelector('.r3-navigation.is-open, .mm-menu.is-open')) && Boolean(document.activeElement.closest('.r3-navigation, .mm-menu, .mm-header')), null, { timeout: 3000 }).catch(() => { openReady = false; });
  record.menu = await page.evaluate(() => ({
    open: Boolean(document.querySelector('.r3-navigation.is-open, .mm-menu.is-open')),
    focusInside: Boolean(document.activeElement.closest('.r3-navigation, .mm-menu, .mm-header')),
  }));
  record.menu.openReadyWithinBound = openReady;
  record.menu.openWaitMs = Math.round(performance.now() - openStarted);
  assert(record, openReady, 'Menu open/focus state did not settle within 3000ms');
  assert(record, record.menu.open, 'Menu did not open');
  assert(record, record.menu.focusInside, 'Menu did not receive keyboard focus');
  await page.keyboard.press('Escape');
  const closeStarted = performance.now();
  let closeReady = true;
  await page.waitForFunction(() => !document.querySelector('.r3-navigation.is-open, .mm-menu.is-open') && document.activeElement.getAttribute('aria-label') === 'Open navigation', null, { timeout: 3000 }).catch(() => { closeReady = false; });
  record.menu.closeReadyWithinBound = closeReady;
  record.menu.closeWaitMs = Math.round(performance.now() - closeStarted);
  assert(record, closeReady, 'Menu close/focus state did not settle within 3000ms');
  record.menu.closed = await page.locator('.r3-navigation.is-open, .mm-menu.is-open').count() === 0;
  record.menu.focusRestored = await page.evaluate(() => document.activeElement.getAttribute('aria-label') === 'Open navigation');
  assert(record, record.menu.closed && record.menu.focusRestored, 'Menu Escape did not close and restore focus');
}

async function smoke(browser, engine, viewport, route) {
  const record = { id: `${engine}-${viewport.width}x${viewport.height}-${route}`, engine, viewport, route, at: new Date().toISOString(), failures: [], pageerrors: [], hydrationConsoleErrors: [], blockedRequests: [], directoryIndexMappings: [] };
  const page = await browser.newPage({ viewport });
  try {
    await prepare(page, record);
    const response = await page.goto(`${origin}${asked(route)}`, { waitUntil: 'domcontentloaded', timeout: 30000 });
    record.status = response.status();
    record.documentSha256 = digest(await response.body());
    const local = await readFile(path.join(root, 'dist', route.replace(/^\//, ''), 'index.html'));
    assert(record, record.documentSha256 === digest(local), 'Served route bytes do not match built HTML');
    await ready(page, record);
    record.hydration = await page.evaluate(() => ({ serverHeadingCaptured: Boolean(window.__routeSmoke.serverHeading), serverHeadingPreserved: Boolean(window.__routeSmoke.serverHeading?.isConnected) }));
    assert(record, record.hydration.serverHeadingCaptured && record.hydration.serverHeadingPreserved, 'Server heading was not preserved through hydration');
    const headings = page.locator('h1:visible');
    record.visibleHeadings = await headings.allTextContents();
    assert(record, record.visibleHeadings.length === 1, 'Expected exactly one visible h1');
    record.heading = rect(await headings.first().boundingBox());
    record.fixedHeaderBottom = await page.evaluate(() => Math.max(0, ...[...document.querySelectorAll('header')].filter(node => {
      const css = getComputedStyle(node), box = node.getBoundingClientRect();
      return ['fixed', 'sticky'].includes(css.position) && box.height > 0 && box.top <= 1 && box.bottom > 0;
    }).map(node => node.getBoundingClientRect().bottom)));
    assert(record, record.heading && record.heading.y >= record.fixedHeaderBottom - 2, 'Main heading overlaps fixed navigation');
    record.initialOverflow = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
    assert(record, record.initialOverflow.document <= viewport.width + 1, 'Horizontal overflow at entry');
    await menuCheck(page, record);
    // Traverse unloaded lazy images through the rendered page before judging them.
    for (const image of await page.locator('img:visible').elementHandles()) {
      if (await image.evaluate(node => !node.isConnected || !node.getClientRects().length || node.complete)) continue;
      await image.evaluate(node => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await settle(page);
      if (await image.evaluate(node => !node.isConnected || !node.getClientRects().length)) continue;
      await image.evaluate(node => new Promise(resolve => {
        if (node.complete) return resolve();
        const done = () => { clearTimeout(timer); resolve(); };
        const timer = setTimeout(done, 5000);
        node.addEventListener('load', done, { once: true });
        node.addEventListener('error', done, { once: true });
      }));
    }
    const footer = page.locator('footer:visible').last();
    assert(record, await footer.count() > 0, 'Footer missing');
    if (await footer.count()) {
      await footer.evaluate(node => node.scrollIntoView({ block: 'end', behavior: 'instant' }));
      await settle(page);
      await page.waitForTimeout(150);
      record.footer = rect(await footer.boundingBox());
      record.footerLink = rect(await footer.locator('a:visible').last().boundingBox());
      record.fixedBottomTop = await page.evaluate(() => Math.min(innerHeight, ...[...document.querySelectorAll('.mm-cookie-notice,.mm-action-bar.is-shown')].filter(node => {
        const box = node.getBoundingClientRect(); return box.height > 0 && box.top < innerHeight && box.bottom >= innerHeight - 2;
      }).map(node => node.getBoundingClientRect().top)));
      assert(record, record.footer && record.footer.y < viewport.height && record.footer.y + record.footer.height > 0, 'Footer unreachable');
      assert(record, record.footerLink && record.footerLink.y >= record.fixedHeaderBottom - 2 && record.footerLink.y + record.footerLink.height <= record.fixedBottomTop + 2, 'Last footer link obscured');
    }
    record.brokenImages = await page.locator('img').evaluateAll(images => images.filter(node => node.getClientRects().length && node.complete && !node.naturalWidth).map(node => ({ alt: node.alt, path: new URL(node.currentSrc || node.src).pathname })));
    record.pendingImages = await page.locator('img:visible').evaluateAll(images => images.filter(node => !node.complete).map(node => ({ alt: node.alt, path: new URL(node.currentSrc || node.src).pathname })));
    assert(record, record.brokenImages.length === 0, 'Broken visible image');
    assert(record, record.pendingImages.length === 0, 'Visible image did not complete within bounded wait');
    record.finalOverflow = await page.evaluate(() => ({ width: innerWidth, document: document.documentElement.scrollWidth }));
    assert(record, record.finalOverflow.document <= viewport.width + 1, 'Horizontal overflow at footer');
    if (route === '/contact') {
      const before = page.url();
      await page.locator('.mm-contact-form button[type="submit"]').click();
      await page.locator('#contact-name-error').waitFor();
      const focusStarted = performance.now();
      let contactReady = true;
      await page.waitForFunction(() => document.activeElement.id === 'contact-name' && document.querySelectorAll('.mm-contact-form [aria-invalid="true"]').length === 3 && document.querySelectorAll('.mm-form-error').length === 3, null, { timeout: 3000 }).catch(() => { contactReady = false; });
      record.contactRecoveryWaitMs = Math.round(performance.now() - focusStarted);
      assert(record, contactReady, 'Contact error and focus recovery did not settle within 3000ms');
      record.invalidContact = { urlPreserved: page.url() === before, fields: await page.locator('.mm-contact-form [aria-invalid="true"]').count(), errors: await page.locator('.mm-form-error').allTextContents(), focusedField: await page.evaluate(() => document.activeElement.id) };
      assert(record, record.invalidContact.urlPreserved && record.invalidContact.fields === 3 && record.invalidContact.errors.length === 3 && record.invalidContact.focusedField === 'contact-name', 'Empty contact submission did not retain page with three focused field errors');
    }
    assert(record, record.pageerrors.length === 0 && record.hydrationConsoleErrors.length === 0, 'Browser or hydration errors');
    if (record.failures.length) {
      record.screenshot = `${runName}-${engine}-${viewport.width}-${route.replace(/[^a-z0-9]/gi, '_') || 'home'}.png`;
      await page.screenshot({ path: path.join(evidence, record.screenshot) });
    }
  } catch (error) { assert(record, false, error.message); await failureScreenshot(page, record); }
  finally { cases.push(record); await persistObservation('route-case', record); await page.close(); }
}

async function navigation(browser, engine, viewport) {
  const record = { id: `${engine}-${viewport.width}x${viewport.height}-core-navigation`, engine, viewport, failures: [], pageerrors: [], hydrationConsoleErrors: [], blockedRequests: [], directoryIndexMappings: [], destinations: [] };
  const page = await browser.newPage({ viewport });
  try {
    await prepare(page, record);
    for (const destination of ['/ai-brain', '/ai-gtm', '/case-studies', '/blog']) {
      await page.goto(`${origin}/`, { waitUntil: 'domcontentloaded' }); await ready(page, record);
      await page.getByRole('button', { name: 'Open navigation', exact: true }).filter({ visible: true }).click();
      await page.locator(`.r3-navigation a[href="${destination}"]:visible`).click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === destination);
      await ready(page, record);
      record.destinations.push({ expected: destination, actual: new URL(page.url()).pathname, heading: await page.locator('h1:visible').allTextContents(), homepageCleanup: await page.evaluate(() => !document.documentElement.classList.contains('mm-homepage-active')) });
      const result = record.destinations.at(-1);
      assert(record, result.heading.length === 1 && result.homepageCleanup, `Navigation to ${destination} failed`);
    }
    assert(record, !record.pageerrors.length && !record.hydrationConsoleErrors.length, 'Core navigation raised browser errors');
  } catch (error) { assert(record, false, error.message); await failureScreenshot(page, record); }
  finally { supplemental.push(record); await persistObservation('core-navigation', record); await page.close(); }
}

async function routerPatterns(browser) {
  const record = { id: 'chromium-router-patterns', failures: [], pageerrors: [], hydrationConsoleErrors: [], blockedRequests: [], directoryIndexMappings: [], observations: [] };
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  try {
    await prepare(page, record);
    const other = [...new Set([...literalRoutes.filter(route => !routes.includes(route) && !['/blog/:slug', '/answers/:slug'].includes(route)), ...retired])];
    for (const pattern of other) {
      const route = pattern === '*' ? '/qa-missing-public-page' : pattern.replace(':slug', 'qa-missing-slug');
      await page.goto(`${origin}/`, { waitUntil: 'domcontentloaded' }); await ready(page, record);
      // There is no built HTML for these paths. Exercise BrowserRouter separately;
      // this is CSR route coverage, explicitly not direct-navigation hydration proof.
      await page.evaluate(next => { history.pushState(null, '', next); dispatchEvent(new PopStateEvent('popstate')); }, route);
      await page.waitForTimeout(350); await settle(page);
      record.observations.push({ pattern, requested: route, actual: new URL(page.url()).pathname + new URL(page.url()).search, headings: await page.locator('h1:visible').allTextContents(), dialog: await page.locator('[role="dialog"]:visible').count(), externalBoundary: record.blockedRequests.filter(request => request.external).length });
      if (!['/signal', '/builder-economy'].includes(pattern)) {
        const observed = record.observations.at(-1);
        assert(record, observed.headings.length === 1, `Router pattern ${pattern} has no single heading`);
        const expected = ['/operator', '/tool'].includes(pattern) ? '/ai-brain' : ['/library', '/answers'].includes(pattern) ? '/blog' : pattern === '/blog/10-20x-roi-what-real-ai-implementation-looks-like' ? '/blog/measuring-ai-work-that-pays-back' : pattern === '/blog/building-ai-systems-in-30-days-sprint-approach' ? '/blog/a-useful-first-30-days-building-with-ai' : ['*', '/alumni'].includes(pattern) ? route : '/?start=1';
        assert(record, observed.actual === expected, `Router pattern ${pattern} expected ${expected}, observed ${observed.actual}`);
      }
    }
    assert(record, !record.pageerrors.length, 'CSR route patterns raised browser errors');
  } catch (error) { assert(record, false, error.message); await failureScreenshot(page, record); }
  finally { supplemental.push(record); await persistObservation('router-patterns', record); await page.close(); }
}

for (const [engine, viewports] of activeMatrix) {
  const launcher = { chromium, firefox, webkit }[engine];
  const browser = await launcher.launch();
  try {
    for (const viewport of viewports) {
      for (const route of activeRoutes) await smoke(browser, engine, viewport, route);
      if (!process.env.QA_ROUTE) await navigation(browser, engine, viewport);
      console.log(JSON.stringify({ completed: `${engine}-${viewport.width}x${viewport.height}`, cases: cases.length, failures: failures.length }));
    }
    if (engine === 'chromium' && !process.env.QA_ROUTE) await routerPatterns(browser);
  } finally { await browser.close(); }
}
const actualCounts = {
  routeCases: cases.length,
  coreNavigation: supplemental.filter(record => record.id.endsWith('-core-navigation')).length,
  routerPatterns: supplemental.filter(record => record.id === 'chromium-router-patterns').length,
  supplemental: supplemental.length,
};
for (const [kind, expected] of Object.entries(expectedCounts)) {
  if (actualCounts[kind] !== expected) failures.push(`Coverage count mismatch for ${kind}: expected ${expected}, observed ${actualCounts[kind]}`);
}
const endSha256 = digest(await readFile(path.join(root, 'dist/index.html')));
if (endSha256 !== indexSha256) failures.push('Built homepage changed during the run; candidate evidence is invalid');
const report = {
  at: new Date().toISOString(), origin, built: true, selfOwnedRuntime: Boolean(server), indexSha256, endSha256,
  scriptSha256, routes, literalRoutePatterns: literalRoutes, expectedCounts, actualCounts,
  filters: { engine: process.env.QA_ENGINE || null, width: process.env.QA_WIDTH || null, route: process.env.QA_ROUTE || null },
  limitations: ['Public read-only UI only; no live lead, email, provider or payment mutation.', 'External requests and non-GET/HEAD requests were blocked; live integrations are outside this smoke.', 'Vite untrailed native links use exact built directory-index responses, matching documented deployment behavior.', 'Non-prerendered and retired route patterns are CSR coverage only; direct-navigation hydration is not certified.', 'Geometry, DOM identity and errors are automated observations, not a visual design or physical assistive-technology audit.', 'Cookie notice is dismissed to isolate route geometry; first-visit cookie clearance is a separate release check.'],
  cases, supplemental, failures,
};
const file = `${runName}.json`;
await writeFile(path.join(evidence, file), JSON.stringify(report, null, 2) + '\n');
await appendFile(observationsFile, JSON.stringify({ kind: 'run-complete', at: report.at, indexSha256, endSha256, cases: cases.length, failures }) + '\n');
console.log(JSON.stringify({ report: path.join('artifacts/homepage-release', file), cases: cases.length, supplemental: supplemental.length, failures }, null, 2));
if (failures.length) process.exitCode = 1;
} finally { server?.kill(); }
