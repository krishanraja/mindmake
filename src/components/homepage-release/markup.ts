// Generated from the immutable accepted R3. Run node scripts/qa/build-homepage-release.mjs.
import asset0 from "../../assets/mindmake-mark.svg";
import asset1 from "../../assets/mindmake-wordmark.svg";
import asset2 from "../../assets/films/film-02-poster.webp";
import asset3 from "../../assets/films/film-02-loop.mp4";
import asset4 from "../../assets/films/film-04-loop.mp4";
import { leadershipChaptersMarkup } from "@/components/leadership-chapters/leadershipChapters";
export const homepageMarkup = `<a class="skip-link" href="#new-age-leadership">Skip to the story</a>
    <main id="site" data-release="homepage-integrated-candidate-r3" aria-label="Mindmake homepage">
      <section id="opening" class="r3-section r3-opening" data-component="opening"><div class="r3-variant preview-desktop"><div class="site-frame" data-composition-desktop="editorial" data-title-desktop="balanced" data-measure-desktop="balanced" data-position-desktop="middle" data-crop-desktop="center" data-contrast="cinema" data-lede="show" data-doors="paired" data-proof="show" data-reveal="staged">
              <header class="site-masthead">
                <a class="brand" href="/" aria-label="Mindmake home">
                  <img class="mark" src="${asset0}" alt="">
                  <img class="wordmark" src="${asset1}" alt="Mindmake">
                </a>
                <button class="menu-control" type="button" aria-label="Open navigation"><b>Menu</b><i aria-hidden="true"></i></button>
              </header>
              <section class="hero-stage">
                <video data-mm-poster="true" muted="" loop="" playsinline="" preload="metadata" poster="${asset2}" aria-hidden="true">
                  <source src="${asset3}" type="video/mp4" media="(min-width: 701px)">
                </video>
                <div class="film-wash" aria-hidden="true"></div>
                <div class="hero-copy">
                  <h1>Build the business that can think with you.</h1>
                  <p class="hero-lede">Part people. Part agent. Led by judgement.</p>
                  <div class="route-doors" role="group" aria-label="Choose a Mindmake route">
                    <button type="button" data-route-choice="brain"><span>Build your</span><strong>AI brain</strong><small>Your judgement, running.</small><i>↗</i></button>
                    <button type="button" data-route-choice="gtm"><span>Build your</span><strong>AI GTM</strong><small>Build your AI native pricing, positioning and org.</small><i>↗</i></button>
                  </div>
                  <p class="shared-proof">Build the first working version on real work. Keep the system.</p>
                </div>
              </section>
            </div></div><div class="r3-variant preview-mobile"><div class="site-frame" data-composition-mobile="overlay" data-title-mobile="balanced" data-measure-mobile="balanced" data-position-mobile="high" data-crop-mobile="right" data-contrast="cinema" data-lede="show" data-doors="paired" data-proof="show" data-reveal="staged">
              <header class="site-masthead">
                <a class="brand" href="/" aria-label="Mindmake home">
                  <img class="mark" src="${asset0}" alt="">
                  <img class="wordmark" src="${asset1}" alt="Mindmake">
                </a>
                <button class="menu-control" type="button" aria-label="Open navigation"><b>Menu</b><i aria-hidden="true"></i></button>
              </header>
              <section class="hero-stage">
                <video data-mm-poster="true" muted="" loop="" playsinline="" preload="metadata" poster="${asset2}" aria-hidden="true">
                  <source src="${asset3}" type="video/mp4" media="(max-width: 700px)">
                </video>
                <div class="film-wash" aria-hidden="true"></div>
                <div class="hero-copy">
                  <h1>Build the business that can think with you.</h1>
                  <p class="hero-lede">Part people. Part agent. Led by judgement.</p>
                  <div class="route-doors" role="group" aria-label="Choose a Mindmake route">
                    <button type="button" data-route-choice="brain"><span>Build your</span><strong>AI brain</strong><small>Your judgement, running.</small><i>↗</i></button>
                    <button type="button" data-route-choice="gtm"><span>Build your</span><strong>AI GTM</strong><small>Build your AI native pricing, positioning and org.</small><i>↗</i></button>
                  </div>
                  <p class="shared-proof">Build the first working version on real work. Keep the system.</p>
                </div>
              </section>
            </div></div></section>
      <div id="new-age-leadership" class="nal-page mm-home-leadership" data-component="leadership">${leadershipChaptersMarkup({ opening: "organisation" })}</div>
      <section id="route" class="r3-section r3-route r3-reveal" data-component="route">
        <div class="r3-variant preview-desktop"><div class="site-frame" data-composition-desktop="balanced" data-title-desktop="balanced" data-measure-desktop="balanced" data-action="copy" data-back="text" data-caption="show" data-receipt="full" data-steps="numbered" data-reveal="staged">
            
            <section class="route-stage"><video muted="" loop="" playsinline="" preload="none" aria-hidden="true" poster="${asset2}"><source src="${asset3}" type="video/mp4" media="(min-width: 701px)"></video><div class="wash"></div><button class="back" type="button" data-route-toggle="true">← <span>AI Brain or AI GTM</span></button><div class="route-copy" aria-live="polite"><h2>Make your judgement reusable.</h2><p class="lede">Give your standards, context and past decisions a memory you can use.</p><button class="primary" type="button" data-start-route="brain">Get your free AI brief <span>→</span></button></div><figure><figcaption>The next decision begins with what the last one taught you.</figcaption></figure><article class="receipt"><header><h3>What stays with you</h3><p>Anonymous client outcome · Research and content</p></header><ol><li>The founder's standards</li><li>A system they own</li><li>Used on real work</li></ol><blockquote>Research-backed publishing moved from days to under an hour, and from roughly monthly to most days.</blockquote></article></section>
          </div></div><div class="r3-variant preview-mobile"><div class="site-frame" data-composition-mobile="copy" data-title-mobile="balanced" data-measure-mobile="balanced" data-action="copy" data-back="text" data-caption="show" data-receipt="full" data-steps="numbered" data-reveal="staged">
            
            <section class="route-stage"><video muted="" loop="" playsinline="" preload="none" aria-hidden="true" poster="${asset2}"><source src="${asset3}" type="video/mp4" media="(max-width: 700px)"></video><div class="wash"></div><button class="back" type="button" data-route-toggle="true">← <span>AI Brain or AI GTM</span></button><div class="route-copy" aria-live="polite"><h2>Make your judgement reusable.</h2><p class="lede">Give your standards, context and past decisions a memory you can use.</p><button class="primary" type="button" data-start-route="brain">Get your free AI brief <span>→</span></button></div><figure><figcaption>The next decision begins with what the last one taught you.</figcaption></figure><article class="receipt"><header><h3>What stays with you</h3><p>Anonymous client outcome · Research and content</p></header><ol><li>The founder's standards</li><li>A system they own</li><li>Used on real work</li></ol><blockquote>Research-backed publishing moved from days to under an hour, and from roughly monthly to most days.</blockquote></article></section>
          </div></div>
      </section>
      <section id="footer" class="r3-footer r3-reveal" data-component="footer"><div class="r3-variant preview-desktop"><footer class="site-footer" data-structure-desktop="rail" data-density-desktop="compact" data-brand="full" data-statement="short" data-routes="single" data-legal="bottom" data-copyright="short" data-ground="dark" data-rule="accent" data-reveal="scroll"><div class="brand-block"><a class="brand" href="/" aria-label="Mindmake home"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><p class="footer-statement">Keep your edge as AI changes the market.</p></div><nav class="footer-routes" aria-label="Footer navigation"><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm">Build your AI GTM</a><a href="/case-studies">Results</a><a href="/blog">Thinking</a><a href="/answers">Questions leaders ask</a><a href="/faq">Before you start</a><a href="https://mindmakerlive.substack.com" target="_blank" rel="noreferrer">Media</a><a href="/start">Get your free AI brief</a></nav><nav class="legal" aria-label="Legal navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><small>© 2026 Mindmake.</small></footer></div><div class="r3-variant preview-mobile"><footer class="site-footer" data-structure-mobile="compact" data-density-mobile="compact" data-brand="full" data-statement="short" data-routes="single" data-legal="bottom" data-copyright="short" data-ground="dark" data-rule="accent" data-reveal="scroll"><div class="brand-block"><a class="brand" href="/" aria-label="Mindmake home"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><p class="footer-statement">Keep your edge as AI changes the market.</p></div><nav class="footer-routes" aria-label="Footer navigation"><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm">Build your AI GTM</a><a href="/case-studies">Results</a><a href="/blog">Thinking</a><a href="/answers">Questions leaders ask</a><a href="/faq">Before you start</a><a href="https://mindmakerlive.substack.com" target="_blank" rel="noreferrer">Media</a><a href="/start">Get your free AI brief</a></nav><nav class="legal" aria-label="Legal navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><small>© 2026 Mindmake.</small></footer></div></section>
    </main>
    <aside class="r3-navigation" aria-hidden="true" aria-label="Site navigation" role="dialog" aria-modal="true" inert><div class="r3-variant preview-desktop"><div class="site-frame" data-structure-desktop="index" data-scale-desktop="balanced" data-density-desktop="balanced" data-order="build" data-secondary="footer" data-active="rule" data-action="bar" data-ground="solid" data-entrance="stepped">
              
              <div class="ground" aria-hidden="true"></div>
              <header class="site-masthead"><a class="brand" href="/" aria-label="Mindmake home" tabindex="-1"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><button class="menu-control" type="button" aria-label="Close navigation"><b>Close</b><i aria-hidden="true"></i></button></header>
              <div class="menu-surface"><nav class="primary-routes" aria-label="Main navigation"><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm">Build your AI GTM</a><a href="/case-studies">Results</a><a href="/blog">Thinking</a><a href="/answers">Questions leaders ask</a><a href="/faq">Before you start</a><a href="https://mindmakerlive.substack.com" target="_blank" rel="noreferrer">Media</a></nav><a class="start-action" type="button" href="/start">Get your free AI brief <span aria-hidden="true">→</span></a><nav class="secondary-routes" aria-label="Additional navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
            </div></div><div class="r3-variant preview-mobile"><div class="site-frame" data-structure-mobile="list" data-scale-mobile="balanced" data-density-mobile="balanced" data-order="build" data-secondary="footer" data-active="rule" data-action="bar" data-ground="solid" data-entrance="stepped">
              
              <div class="ground" aria-hidden="true"></div>
              <header class="site-masthead"><a class="brand" href="/" aria-label="Mindmake home" tabindex="-1"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><button class="menu-control" type="button" aria-label="Close navigation"><b>Close</b><i aria-hidden="true"></i></button></header>
              <div class="menu-surface"><nav class="primary-routes" aria-label="Main navigation"><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm">Build your AI GTM</a><a href="/case-studies">Results</a><a href="/blog">Thinking</a><a href="/answers">Questions leaders ask</a><a href="/faq">Before you start</a><a href="https://mindmakerlive.substack.com" target="_blank" rel="noreferrer">Media</a></nav><a class="start-action" type="button" href="/start">Get your free AI brief <span aria-hidden="true">→</span></a><nav class="secondary-routes" aria-label="Additional navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
            </div></div></aside>`;
