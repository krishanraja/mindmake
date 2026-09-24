import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:64065';
const browser = await chromium.launch();
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const snapshots=[];
    for (const path of ['/prototypes/website-redesign-recovery/homepage-production-synthesis-r3/index.html','/']) {
      const page=await browser.newPage({viewport});
      await page.goto(`${base}${path}`, {waitUntil:'domcontentloaded'});
      await page.evaluate(()=>document.fonts.ready);
      snapshots.push(await page.evaluate(()=>[...document.querySelectorAll('[data-component] h1,[data-component] h2,[data-component] h3,[data-component] h4,[data-component] p,[data-component] small,[data-component] button,[data-component] li,[data-component] blockquote')].filter(el=>el.offsetParent!==null).map(el=>{
        const css=getComputedStyle(el);
        return {section:el.closest('[data-component]').dataset.component,text:el.textContent.trim(),tag:el.tagName,color:css.color,font:css.fontFamily,size:css.fontSize,weight:css.fontWeight,line:css.lineHeight,spacing:css.letterSpacing};
      })));
      await page.close();
    }
    assert.equal(snapshots[0].length,snapshots[1].length,'Same visible approved text elements');
    const differences=snapshots[0].flatMap((approved,index)=>JSON.stringify(approved)===JSON.stringify(snapshots[1][index])?[]:[{index,approved,production:snapshots[1][index]}]);
    if(differences.length) console.log(JSON.stringify({viewport,differences},null,2));
    assert.deepEqual(differences,[],`Accepted typography and colour parity at ${viewport.width}`);
  }
  console.log('PASS: accepted desktop/mobile text, colour and typography preserved');
} finally { await browser.close(); }
