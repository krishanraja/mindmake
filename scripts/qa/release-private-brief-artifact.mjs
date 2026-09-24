import { createServer } from 'vite';
import { chromium } from 'playwright';
import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';

const output = 'C:/Users/krish/.scratch/mindmake-private-brief-20260924';
await mkdir(output, { recursive: true });
const server = await createServer({ configFile: false, server: { middlewareMode: true },
  resolve: { alias: { '@': path.resolve('src') } } });
const browser = await chromium.launch();
try {
  const { buildPrivateBriefHtml } = await server.ssrLoadModule('/src/components/mindmake/privateBriefHtml.ts');
  const content = { company: 'Mindmake', domain: 'mindmake.co', pressure: 'Too much important context lives in my head',
    known: 'Mindmake helps leaders turn their judgement into useful AI systems and make better product, price, positioning and people decisions.',
    evidence: ['Build your AI GTM - Mindmake'],
    carry: 'Hold the facts, examples, past choices and useful relationships in one place.',
    human: 'Decide what matters, when a rule should bend and who deserves your trust.',
    proof: 'Build one useful memory around a live decision, then use it twice on real work.',
    capacityValue: 'Protect that time for product, buyers and the few decisions that can change growth.', nextStep: 'keep' };
  const html = buildPrivateBriefHtml(content);
  assert(!/<script|<iframe|@import|url\(|<link[^>]+href=/i.test(html), 'Document must remain self-contained');
  const page = await browser.newPage();
  await page.setContent('<button>Download</button>');
  const downloading = page.waitForEvent('download');
  await page.evaluate(value => {
    const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([value], {type:'text/html;charset=utf-8'}));
    link.download = 'mindmake-mindmake-co-private-brief.html'; link.click();
  }, html);
  const download = await downloading;
  const file = path.join(output, download.suggestedFilename());
  await download.saveAs(file);
  assert.equal(await readFile(file, 'utf8'), html);
  let unexpectedRequests = 0;
  page.on('request', request => { if (/^https?:/.test(request.url())) unexpectedRequests++; });
  const results = [];
  for (const width of [1440, 390]) {
    await page.setViewportSize({width,height:900});
    await page.goto(new URL(`file:///${file.replaceAll('\\','/')}`).href);
    const body = await page.locator('body').innerText();
    for (const value of [content.known,content.carry,content.human,content.proof,content.capacityValue]) assert(body.includes(value));
    assert(!/undefined|NaN|Lorem ipsum/.test(body));
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
    assert(!horizontalOverflow);
    const screenshot = path.join(output, `brief-${width}.png`);
    await page.screenshot({path:screenshot,fullPage:true});
    results.push({width,horizontalOverflow,title:await page.title(),screenshot});
  }
  assert.equal(unexpectedRequests,0);
  await page.emulateMedia({media:'print'});
  await page.pdf({path:path.join(output,'brief-print.pdf'),format:'A4',printBackground:true});
  console.log(JSON.stringify({file,bytes:Buffer.byteLength(html),unexpectedRequests,results}));
} finally { await browser.close(); await server.close(); }
