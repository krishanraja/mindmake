import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const base = process.env.QA_BASE_URL || 'http://127.0.0.1:64065';
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHROMIUM ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM } : {});
const checks = [];
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    const page = await browser.newPage({viewport});
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`${base}/`);
    await page.locator('.mm-homepage-release .hero-copy h1:visible').waitFor();
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.locator('main').count(), 1, 'One homepage main landmark');
    assert.equal(await page.locator('.r3-opening .site-masthead:visible').count(), 1, 'One visible masthead');
    assert.equal(await page.locator('.hero-copy h1:visible').textContent(), 'Build the business that can think with you.');
    assert.equal(await page.locator('.mm-home-leadership :is(.reach-sequence, .work-scroll, .human-proof)').count(), 3, 'The three new-age leadership chapters');
    assert.equal(await page.locator('[data-component="history"], [data-component="authority"], [data-component="leadership-dividend"]').count(), 0, 'The retired R3 chapters are gone');
    const broken = await page.locator('img').evaluateAll(images => images.filter(image => image.complete && !image.naturalWidth).map(image=>image.src));
    assert.deepEqual(broken, [], 'Imported image URLs resolve');
    await page.evaluate(() => {
      const track = document.querySelector('.mm-home-leadership [data-benefit-track]');
      window.scrollTo({top: window.scrollY + track.getBoundingClientRect().top + 1, behavior:'instant'});
    });
    await page.locator('.mm-cookie-notice').waitFor();
    await page.waitForTimeout(300);
    const clear = await page.locator('.mm-home-leadership [data-benefit-next]').evaluate(element => {
      const notice = document.querySelector('.mm-cookie-notice').getBoundingClientRect();
      return element.getBoundingClientRect().bottom <= notice.top + 1;
    });
    assert.equal(clear, true, 'Cookie notice does not cover the benefit controls');
    await page.locator('.mm-home-leadership [data-benefit-next]').click();
    await page.waitForTimeout(1300);
    assert.equal(await page.locator('.mm-home-leadership [data-benefit-count]').textContent(), '02');
    await page.locator('.mm-cookie-notice').getByRole('button', { name: 'Allow' }).click();
    await page.locator('.mm-cookie-notice').waitFor({state:'detached'});
    await page.evaluate(() => scrollTo({top:0,behavior:'instant'}));
    await page.locator('.r3-opening .menu-control:visible').click();
    assert.equal(await page.locator('.r3-navigation').getAttribute('aria-hidden'), 'false');
    await page.locator('.r3-navigation .start-action:visible').click();
    await page.locator('.mm-brief-panel').waitFor();
    await page.keyboard.press('Escape');
    await page.locator('.mm-brief-panel').waitFor({state:'detached'});
    await page.waitForFunction(() => document.activeElement?.matches('.r3-opening .menu-control'));
    await page.locator('.r3-opening .menu-control:visible').click();
    await page.keyboard.press('Escape');
    // The hero doors are links to their pages (Krish, 2026-09-25), not a
    // scroll to the closing chapter. The closing chapter keeps its own toggle.
    const door = page.locator('.r3-opening [data-route-choice="gtm"]:visible');
    assert.equal(await door.getAttribute('href'), '/ai-gtm', 'The AI GTM door is a real link to its page');
    await door.click();
    await page.waitForURL(url => /^\/ai-gtm\/?$/.test(new URL(url).pathname));
    await page.locator('.mm-route-gtm main h1').waitFor();
    await page.goBack();
    await page.locator('.mm-homepage-release [data-route-toggle]:visible').waitFor();
    await page.locator('.r3-route [data-route-toggle]:visible').click();
    assert.equal(await page.locator('[data-start-route]:visible').getAttribute('data-start-route'), 'gtm', 'The closing chapter toggle still binds the brief to its route');
    await page.locator('[data-start-route="gtm"]:visible').click();
    await page.locator('.mm-brief-panel[data-step="company"]').waitFor();
    assert.match(page.url(), /start=gtm/);
    assert.equal(await page.locator('.mm-homepage-release').getAttribute('aria-hidden'), 'true');
    await page.keyboard.press('Escape');
    await page.locator('.mm-brief-panel').waitFor({state:'detached'});
    await page.waitForTimeout(100);
    assert.equal(await page.locator('.mm-homepage-release').getAttribute('aria-hidden'), null);
    assert.equal(await page.locator('[data-start-route="gtm"]:visible').evaluate(element => element === document.activeElement), true, 'Escape restores opener after background is no longer inert');
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.waitForFunction(() => matchMedia('(prefers-reduced-motion: reduce)').matches && [...document.querySelectorAll('video')].every(video => video.paused));
    assert.equal(await page.locator('video').evaluateAll(videos => videos.every(video => video.paused)), true, 'Reduced motion pauses every video');
    assert.equal(await page.locator('[aria-current=""]').count(),0,'Current state has valid ARIA values');
    await page.reload({waitUntil:'domcontentloaded'});
    await page.locator('.mm-homepage-release').waitFor();
    await page.waitForFunction(() => [...document.querySelectorAll('video')].every(video => video.paused));
    assert.deepEqual(errors, [], 'No runtime errors');
    checks.push({viewport,status:'PASS',journey:'menu, route choice, native LeadBrief open/close, imported assets'});
    await page.close();
  }
  console.log(JSON.stringify({status:'PASS', checks}, null, 2));
} finally { await browser.close(); }
