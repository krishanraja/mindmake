import { webkit } from 'playwright';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, mkdir, writeFile, appendFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Diagnostic only: no assertions in the release gate are changed or bypassed.
// Four fresh-process cases isolate automation interception from native asset I/O.
const root = path.resolve(import.meta.dirname, '../..');
const script = fileURLToPath(import.meta.url);
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const indexSha256 = digest(await readFile(path.join(root, 'dist/index.html')));
const origin = process.env.QA_DIAG_ORIGIN || process.env.QA_BASE_URL || 'http://127.0.0.1:4345';
if (!['localhost', '127.0.0.1'].includes(new URL(origin).hostname)) throw Error('Local diagnostic target required');
const emit = event => console.log(JSON.stringify(event));
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));
const bounded = (promise, ms, label) => {
  let timer;
  return Promise.race([promise, new Promise((_, reject) => { timer = setTimeout(() => reject(Error(`${label}: bounded ${ms}ms timeout`)), ms); })]).finally(() => clearTimeout(timer));
};

if (process.argv.includes('--worker')) {
  const mode = process.env.QA_DIAG_MODE;
  const scenario = process.env.QA_DIAG_SCENARIO;
  const width = Number(process.env.QA_DIAG_WIDTH || 390);
  const record = { mode, scenario, width, indexSha256, failures: [], phases: [], pageerrors: [], browserVersion: null };
  let browser;
  const start = performance.now();
  const event = value => emit({ elapsedMs: Math.round(performance.now() - start), ...value });
  const phase = async (name, operation, timeout = 12000) => {
    const item = { name, startedMs: Math.round(performance.now() - start) };
    record.phases.push(item); event({ kind: 'phase-start', ...item });
    const phaseStart = performance.now();
    const result = await bounded(operation(), timeout, name);
    item.completedMs = Math.round(performance.now() - phaseStart);
    event({ kind: 'phase-complete', ...item });
    return result;
  };
  try {
    browser = await phase('launch', () => webkit.launch());
    record.browserVersion = browser.version();
    const page = await phase('new-page', () => browser.newPage({ viewport: { width, height: width < 700 ? 844 : 900 }, serviceWorkers: 'block' }));
    page.setDefaultTimeout(12000);
    page.on('pageerror', error => { record.pageerrors.push(error.message); event({ kind: 'pageerror', message: error.message }); });
    page.on('crash', () => event({ kind: 'page-crash' }));
    page.on('request', request => {
      const url = new URL(request.url());
      event({ kind: 'request', path: url.pathname, external: url.origin !== origin, method: request.method(), type: request.resourceType(), range: request.headers().range || null });
    });
    page.on('response', response => {
      event({ kind: 'response', path: new URL(response.url()).pathname, status: response.status(), length: response.headers()['content-length'] || null, contentRange: response.headers()['content-range'] || null });
    });
    page.on('requestfinished', request => event({ kind: 'request-finished', path: new URL(request.url()).pathname }));
    page.on('requestfailed', request => event({ kind: 'request-failed', path: new URL(request.url()).pathname, error: request.failure()?.errorText }));
    await page.exposeFunction('__qaHeartbeat', state => event({ kind: 'heartbeat', ...state }));
    await page.addInitScript(target => {
      if (location.origin !== target) return;
      localStorage.setItem('mindmake_consent', 'accepted');
      setInterval(() => window.__qaHeartbeat({ readyState: document.readyState, covered: document.documentElement.classList.contains('mm-covered'), arrived: document.documentElement.classList.contains('mm-arrived'), playing: [...document.querySelectorAll('video')].filter(node => !node.paused).length }).catch(() => {}), 500);
    }, origin);
    const handler = async intercepted => {
      const request = intercepted.request();
      const url = new URL(request.url());
      event({ kind: 'intercept', path: url.pathname, type: request.resourceType() });
      if (url.origin !== origin || !['GET', 'HEAD'].includes(request.method())) return intercepted.abort();
      if (request.isNavigationRequest() && ['/ai-brain', '/ai-gtm'].includes(url.pathname)) {
        // Same exact directory-index mapping as the release gate; HTML only.
        return intercepted.fulfill({ response: await intercepted.fetch({ url: `${origin}${url.pathname}/` }) });
      }
      await intercepted.continue();
    };
    if (mode === 'broad') await page.route('**/*', handler);
    else if (mode === 'selective') {
      // Keep local media/font/image/script/style bytes entirely on native networking.
      // This diagnostic performs only document navigation and menu clicks, no forms.
      await page.route(url => url.origin !== origin || !/^\/(assets|fonts)\//.test(url.pathname), handler);
    } else throw Error(`Unknown diagnostic mode: ${mode}`);

    const ready = async label => {
      await phase(`${label}:root-heading`, () => page.waitForFunction(() => {
        const node = document.querySelector('#root');
        return node && Object.keys(node).some(key => key.startsWith('__reactContainer')) && document.querySelector('main h1');
      }));
      await phase(`${label}:fonts`, () => page.evaluate(() => document.fonts.ready));
      await phase(`${label}:curtain`, () => page.waitForFunction(() => !document.documentElement.classList.contains('mm-covered')));
      await page.waitForTimeout(180);
      await phase(`${label}:two-frames`, () => page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))));
    };
    const visit = async (pathname, label) => {
      const response = await phase(`${label}:goto`, () => page.goto(`${origin}${pathname}`, { waitUntil: 'domcontentloaded', timeout: 12000 }));
      const bytes = await phase(`${label}:document-bytes`, () => response.body());
      const local = await readFile(path.join(root, 'dist', pathname.replace(/^\//, ''), 'index.html'));
      if (digest(bytes) !== digest(local)) throw Error('Served HTML does not match built HTML');
      await ready(label);
    };
    if (scenario === 'case-studies') {
      await visit('/case-studies/', 'case-studies');
      record.visibleHeadings = await phase('case-studies:headings', () => page.locator('h1:visible').allTextContents());
      record.media = await phase('case-studies:media-state', () => page.locator('video').evaluateAll(nodes => nodes.map(node => ({ paused: node.paused, time: node.currentTime, readyState: node.readyState, path: node.currentSrc ? new URL(node.currentSrc).pathname : null }))));
    } else {
      record.destinations = [];
      for (const destination of ['/ai-brain', '/ai-gtm']) {
        await visit('/', `${destination}:home`);
        await phase(`${destination}:menu`, () => page.getByRole('button', { name: 'Open navigation', exact: true }).filter({ visible: true }).click());
        await phase(`${destination}:click`, () => page.locator(`.r3-navigation a[href="${destination}"]:visible`).click());
        await phase(`${destination}:url`, () => page.waitForURL(url => url.pathname.replace(/\/$/, '') === destination));
        await ready(destination);
        record.destinations.push({ destination, headings: await phase(`${destination}:headings`, () => page.locator('h1:visible').allTextContents()) });
      }
      await visit('/', 'third-home-return');
      record.visibleHeadings = await phase('third-home-return:headings', () => page.locator('h1:visible').allTextContents());
    }
    if (record.visibleHeadings.length !== 1 || record.pageerrors.length) throw Error('Final heading or browser errors failed');
  } catch (error) {
    record.failures.push(error.message);
    // Independent server probe distinguishes a live HTTP server from renderer stalls.
    const started = performance.now();
    try { const response = await fetch(`${origin}/`, { method: 'HEAD', signal: AbortSignal.timeout(2000) }); record.serverProbe = { status: response.status, elapsedMs: Math.round(performance.now() - started) }; }
    catch (probeError) { record.serverProbe = { error: probeError.message }; }
  } finally {
    emit({ kind: 'result', record });
    if (browser) await bounded(browser.close(), 2000, 'browser-close').catch(error => event({ kind: 'cleanup-timeout', message: error.message }));
    // The parent owns this worker's process group and will reap any descendants.
    process.exit(record.failures.length ? 1 : 0);
  }
} else {
  const evidence = path.join(root, 'artifacts/homepage-release');
  await mkdir(evidence, { recursive: true });
  const name = `webkit-diagnostic-${indexSha256.slice(0, 12)}-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  const file = path.join(evidence, `${name}.json`);
  const observations = path.join(evidence, `${name}.jsonl`);
  const report = { at: new Date().toISOString(), indexSha256, origin, platform: process.platform, node: process.version, playwright: createRequire(import.meta.url)('playwright/package.json').version, scriptSha256: digest(await readFile(script)), cases: [], limitations: ['Diagnostic A/B only, not a replacement for the release gate.', 'Videos remain unchanged; no media mocks, pauses, timeouts relaxed, or product edits.', 'Broad routes all requests; selective bypasses automation interception only for local /assets/ and /fonts/ requests.', 'Each fresh-browser worker has a 45-second process deadline; individual page phases retain 12-second bounds.'] };
  let server;
  try {
    if (!process.env.QA_BASE_URL) {
      server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4345', '--strictPort'], { cwd: root, windowsHide: true, stdio: 'ignore' });
      let available = false;
      for (let attempt = 0; attempt < 40; attempt++) {
        if (server.exitCode !== null) throw Error(`Preview exited ${server.exitCode}`);
        try { const response = await fetch(origin, { signal: AbortSignal.timeout(500) }); if (response.ok) { available = true; break; } } catch { /* bounded startup */ }
        await pause(250);
      }
      if (!available) throw Error('Owned preview did not become HTTP-ready');
    }
    if (digest(Buffer.from(await (await fetch(origin)).text())) !== indexSha256) throw Error('Preview homepage hash mismatch');
    await writeFile(observations, JSON.stringify({ kind: 'run-start', ...report }) + '\n');
    const modes = process.env.QA_DIAG_MODE ? [process.env.QA_DIAG_MODE] : ['broad', 'selective'];
    for (const mode of modes) for (const scenario of ['case-studies', 'core-navigation']) {
      const caseRecord = { mode, scenario, width: Number(process.env.QA_DIAG_WIDTH || 390), events: [], stderr: '' };
      const child = spawn(process.execPath, [script, '--worker'], { cwd: root, windowsHide: true, detached: process.platform !== 'win32', stdio: ['ignore', 'pipe', 'pipe'], env: { ...process.env, QA_DIAG_ORIGIN: origin, QA_DIAG_MODE: mode, QA_DIAG_SCENARIO: scenario } });
      const killOwnedGroup = () => {
        try { if (process.platform === 'win32') child.kill(); else process.kill(-child.pid, 'SIGKILL'); } catch { /* already exited */ }
      };
      const timer = setTimeout(() => { caseRecord.processDeadlineExceeded = true; killOwnedGroup(); }, 45000);
      let buffer = '';
      child.stdout.on('data', chunk => {
        buffer += chunk.toString();
        let newline;
        while ((newline = buffer.indexOf('\n')) >= 0) {
          const line = buffer.slice(0, newline); buffer = buffer.slice(newline + 1);
          try { const entry = JSON.parse(line); caseRecord.events.push(entry); if (entry.kind === 'result') caseRecord.result = entry.record; } catch { /* non-JSON browser output is not a result */ }
        }
      });
      child.stderr.on('data', chunk => { caseRecord.stderr += chunk.toString(); });
      const completed = await new Promise(resolve => { child.once('error', error => resolve({ error: error.message })); child.once('exit', (code, signal) => resolve({ code, signal })); });
      clearTimeout(timer); killOwnedGroup();
      Object.assign(caseRecord, completed);
      report.cases.push(caseRecord);
      await appendFile(observations, JSON.stringify({ kind: 'diagnostic-case', ...caseRecord }) + '\n');
      emit({ mode, scenario, code: caseRecord.code, deadline: Boolean(caseRecord.processDeadlineExceeded), failures: caseRecord.result?.failures || ['Worker did not return a result'] });
    }
    report.endSha256 = digest(await readFile(path.join(root, 'dist/index.html')));
    await writeFile(file, JSON.stringify(report, null, 2) + '\n');
    emit({ report: file, indexSha256, endSha256: report.endSha256 });
    if (report.endSha256 !== indexSha256) process.exitCode = 1;
  } finally { server?.kill(); }
}
