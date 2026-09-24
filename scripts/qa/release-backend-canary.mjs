import { chromium } from 'playwright';
import readline from 'node:readline/promises';

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
  const dialog = page.getByRole('dialog');
  await dialog.getByLabel('First name', { exact: true }).fill('Release');
  await dialog.getByLabel('Last name', { exact: true }).fill('Canary');
  await dialog.getByLabel('Work email', { exact: true }).fill(researchOnly ? 'release@mindmake.co' : 'krish@themindmaker.ai');
  await dialog.getByRole('button', { name: 'Leadership', exact: true }).click();
  const companyResponse = page.waitForResponse(response => response.url().includes('/functions/v1/enrich-company'), { timeout: 45000 });
  await dialog.getByRole('button', { name: /Read the business/ }).click();
  await (await companyResponse).finished();
  await page.waitForTimeout(1000);
  emit({ stage: 'company-read', text: await dialog.innerText() });
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
    await page.waitForTimeout(action.wait ?? 1000);
    emit({ stage: action.kind, text: (await dialog.innerText()).replaceAll('krish@themindmaker.ai', '[designated inbox]'),
      inputs: await dialog.locator('input').evaluateAll(elements => elements.map(e => ({ type: e.type, inputmode: e.inputMode, id: e.id }))),
      buttons: await dialog.getByRole('button').allTextContents() });
  }
} finally { input.close(); await browser.close(); }
