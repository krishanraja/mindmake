import { chromium } from 'playwright';
import readline from 'node:readline/promises';
import { mkdir, readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

// Explicit opt-in only. This exercises the documented operator-owned test inbox.
// Never include codes, headers, email bodies or raw provider payloads in evidence.
if (process.env.MINDMAKE_RUN_DESIGNATED_CANARY !== 'yes') throw new Error('Explicit canary opt-in required');
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
if (process.stdin.isTTY) process.stdin.setRawMode(true);
const input = readline.createInterface({ input: process.stdin, terminal: false });
const emit = (value) => console.log(JSON.stringify(value));
const researchOnly = process.env.MINDMAKE_CANARY_CANONICAL_READ_ONLY === 'yes';
page.on('response', async response => {
  if (!response.url().includes('/functions/v1/')) return;
  const endpoint = new URL(response.url()).pathname.split('/').pop();
  const body = await response.json().catch(() => ({}));
  emit({ endpoint, http: response.status(), status: body.status, requestId: body.requestId,
    visitorDelivery: body.visitorDelivery, operatorDelivery: body.operatorDelivery,
    hasIdentity: !!body.identity?.name, identity: body.identity?.name, domain: body.domain,
    knownWrongEntity: /Kristof Hermans|Doorganiser|vCon/i.test(JSON.stringify(body)),
    tailoredChoices: body.choices?.length });
  if (researchOnly && endpoint === 'enrich-company') emit({ evidence: body.understanding, synthesis: body.synthesis, sources: body.currency });
});
try {
  await page.goto('https://mindmake.co/?start=brain', { waitUntil: 'domcontentloaded' });
  const dialog = page.locator('.mm-brief-panel[role="dialog"]');
  const workEmail = dialog.getByLabel('Work email', { exact: true });
  await workEmail.waitFor({ state: 'visible', timeout: 15000 });
  const combinedEntry = await dialog.getByLabel('First name', { exact: true }).isVisible();
  const fillProfile = async () => {
    await dialog.getByLabel('First name', { exact: true }).fill('Release');
    await dialog.getByLabel('Last name', { exact: true }).fill('Canary');
    const leadership = dialog.getByRole('button', { name: 'Leadership', exact: true });
    if (await leadership.isVisible()) await leadership.click();
    else await dialog.getByLabel('Your part of the business', { exact: true }).selectOption('leadership');
  };
  await workEmail.fill(researchOnly ? 'release@mindmake.co' : 'krish@themindmaker.ai');
  if (combinedEntry) await fillProfile();
  const companyResponse = page.waitForResponse(response => response.url().includes('/functions/v1/enrich-company'), { timeout: 45000 });
  await dialog.getByRole('button', { name: /Read the business/ }).click();
  if (!combinedEntry) {
    await dialog.getByLabel('First name', { exact: true }).waitFor({ state: 'visible', timeout: 15000 });
    await fillProfile();
    await dialog.getByRole('button', { name: /See the company read/ }).click();
  }
  await (await companyResponse).finished();
  await dialog.getByRole('button', { name: /Use this problem/ }).waitFor({ state: 'visible', timeout: 15000 });
  emit({ stage: 'company-read', entryLayout: combinedEntry ? 'combined' : 'company-then-profile', text: await dialog.innerText() });
  if (researchOnly) input.close();
  // Subsequent navigation stays explicit so the test cannot guess a send control.
  if (!researchOnly) for await (const line of input) {
    const action = JSON.parse(line);
    if (action.kind === 'stop') break;
    if (action.kind === 'click') await dialog.getByRole('button', { name: new RegExp(action.name, 'i') }).click();
    if (action.kind === 'fill') await dialog.getByLabel(action.label, { exact: true }).fill(action.value);
    if (action.kind === 'code') {
      await dialog.locator('input[inputmode="numeric"]').fill(action.value);
      await dialog.getByRole('button', { name: /Send my private brief/ }).click();
    }
    if (action.kind === 'download') {
      // Read expected content from the actual completed visitor brief, not a fixture.
      const proposal = dialog.getByRole('article', { name: 'Your private brief', exact: true });
      await proposal.waitFor({ state: 'visible', timeout: 15000 });
      const expected = await proposal.locator('.mm-proposal-headline, .mm-proposal-card h4, .mm-proposal-card p, .mm-proposal-card li, .mm-proposal-card strong, .mm-proposal-time h4, .mm-proposal-time p, .mm-proposal-honesty, .mm-proposal-foot p')
        .evaluateAll(elements => elements.map(element => (element.textContent ?? '').replace(/\s+/g, ' ').trim()).filter(Boolean));
      assert(expected.length >= 10, 'Completed visitor brief content is missing');
      const downloading = page.waitForEvent('download', { timeout: 15000 });
      await dialog.getByRole('button', { name: 'Download my brief', exact: true }).click();
      const download = await downloading;
      assert(/^mindmake-[a-z0-9-]+-private-brief\.html$/i.test(download.suggestedFilename()), 'Unexpected download filename');
      const scratch = 'C:/Users/krish/.scratch/mindmake-production-canary-20260924';
      await mkdir(scratch, { recursive: true });
      const file = path.join(scratch, `live-private-brief-${Date.now()}.html`);
      await download.saveAs(file);
      assert.equal(await download.failure(), null, 'Browser download failed');
      const html = await readFile(file, 'utf8');
      assert(Buffer.byteLength(html) > 1000 && /^<!doctype html>/i.test(html), 'Downloaded brief is empty or not HTML');
      assert(!/<script|<iframe|@import|<link[^>]+href=/i.test(html), 'Downloaded brief must be self-contained');
      const artifact = await browser.newPage();
      let externalRequests = 0;
      const widths = [];
      try {
        await artifact.route(/^https?:/, route => { externalRequests++; return route.abort(); });
        for (const width of [1440, 390]) {
          await artifact.setViewportSize({ width, height: 900 });
          await artifact.goto(pathToFileURL(file).href);
          const body = (await artifact.locator('body').textContent()).replace(/\s+/g, ' ').trim();
          assert(expected.every(fragment => body.includes(fragment)), 'Downloaded content differs from the actual visitor brief');
          assert(!/undefined|NaN|Lorem ipsum/.test(body), 'Downloaded brief contains placeholder residue');
          assert.equal(await artifact.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, 'Downloaded brief overflows');
          const screenshot = file.replace(/\.html$/, `-${width}.png`);
          await artifact.screenshot({ path: screenshot, fullPage: true });
          widths.push({ width, screenshot, horizontalOverflow: false });
        }
        assert.equal(externalRequests, 0, 'Downloaded brief makes external requests');
        emit({ stage: 'actual-download', file, bytes: Buffer.byteLength(html), verifiedFragments: expected.length, externalRequests, widths });
      } finally { await artifact.close(); }
    }
    await page.waitForTimeout(action.wait ?? 1000);
    emit({ stage: action.kind, text: (await dialog.innerText()).replaceAll('krish@themindmaker.ai', '[designated inbox]'),
      inputs: await dialog.locator('input').evaluateAll(elements => elements.map(e => ({ type: e.type, inputmode: e.inputMode, id: e.id }))),
      buttons: await dialog.getByRole('button').allTextContents() });
  }
} finally { input.close(); await browser.close(); }
