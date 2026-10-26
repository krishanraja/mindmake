// Generated from the immutable accepted R3. Run node scripts/qa/build-homepage-release.mjs.
import asset0 from "../../assets/mindmake-mark.svg";
import asset1 from "../../assets/mindmake-wordmark.svg";
import asset2 from "../../assets/films/sep2026/archive-engine-hero-poster-r07.webp";
import asset3 from "../../assets/films/sep2026/archive-engine-hero-loop-r07-16s-1080p-review-sealed.mp4";
import { heroStartMarkup, homepageSectionsMarkup, mastheadSubscribeMarkup } from "@/components/homepage-release/homepageSections";
export const homepageMarkup = `<a class="skip-link" href="#history">Skip to the story</a>
    <main id="site" data-release="homepage-integrated-candidate-r3" aria-label="Mindmake homepage">
      <section id="opening" class="r3-section r3-opening" data-component="opening"><div class="r3-variant preview-desktop"><div class="site-frame" data-composition-desktop="editorial" data-title-desktop="balanced" data-measure-desktop="balanced" data-position-desktop="middle" data-crop-desktop="center" data-contrast="cinema" data-lede="show" data-doors="paired" data-proof="show" data-reveal="staged">
              <header class="site-masthead">
                <a class="brand" href="/" aria-label="Mindmake home">
                  <img class="mark" src="${asset0}" alt="">
                  <img class="wordmark" src="${asset1}" alt="Mindmake">
                </a>
                ${mastheadSubscribeMarkup()}<button class="menu-control" type="button" aria-label="Open navigation"><b>Menu</b><i aria-hidden="true"></i></button>
              </header>
              <section class="hero-stage">
                <video data-mm-poster="true" muted="" loop="" playsinline="" preload="metadata" poster="${asset2}" aria-hidden="true">
                  <source src="${asset3}" type="video/mp4" media="(min-width: 701px)">
                </video>
                <div class="film-wash" aria-hidden="true"></div>
                <div class="hero-copy">
                  <h1><span class="mm-hero-line"><span class="mm-hero-row">Promote <span class="mm-hero-your">your</span> AI</span> <span class="mm-hero-row">from intern to</span> <span class="mm-hero-row">chief of staff.</span></span></h1>
                  <p class="hero-lede">The leaders who shape the next decade will have an AI that thinks like them. We build yours.</p>
                  <div class="route-doors" role="group" aria-label="Choose a Mindmake route">
                    <a href="/ai-brain" data-route-choice="brain"><span>Build your</span><strong>AI brain</strong><small>Your judgement, running as a system you own.</small><i>↗</i></a>
                    <a href="/ai-gtm" data-route-choice="gtm"><span>Build your</span><strong>AI revenue engine</strong><small>The pricing, positioning and team you'll need.</small><i>↗</i></a>
                  </div>${heroStartMarkup()}
                </div>
              </section>
            </div></div><div class="r3-variant preview-mobile"><div class="site-frame" data-composition-mobile="overlay" data-title-mobile="balanced" data-measure-mobile="balanced" data-position-mobile="high" data-crop-mobile="right" data-contrast="cinema" data-lede="show" data-doors="paired" data-proof="show" data-reveal="staged">
              <header class="site-masthead">
                <a class="brand" href="/" aria-label="Mindmake home">
                  <img class="mark" src="${asset0}" alt="">
                  <img class="wordmark" src="${asset1}" alt="Mindmake">
                </a>
                ${mastheadSubscribeMarkup()}<button class="menu-control" type="button" aria-label="Open navigation"><b>Menu</b><i aria-hidden="true"></i></button>
              </header>
              <section class="hero-stage">
                <video data-mm-poster="true" muted="" loop="" playsinline="" preload="metadata" poster="${asset2}" aria-hidden="true">
                  <source src="${asset3}" type="video/mp4" media="(max-width: 700px)">
                </video>
                <div class="film-wash" aria-hidden="true"></div>
                <div class="hero-copy">
                  <h1><span class="mm-hero-line"><span class="mm-hero-row">Promote <span class="mm-hero-your">your</span> AI</span> <span class="mm-hero-row">from intern to</span> <span class="mm-hero-row">chief of staff.</span></span></h1>
                  <p class="hero-lede">The leaders who shape the next decade will have an AI that thinks like them. We build yours.</p>
                  <div class="route-doors" role="group" aria-label="Choose a Mindmake route">
                    <a href="/ai-brain" data-route-choice="brain"><span>Build your</span><strong>AI brain</strong><small>Your judgement, running as a system you own.</small><i>↗</i></a>
                    <a href="/ai-gtm" data-route-choice="gtm"><span>Build your</span><strong>AI revenue engine</strong><small>The pricing, positioning and team you'll need.</small><i>↗</i></a>
                  </div>${heroStartMarkup()}
                </div>
              </section>
            </div></div></section>
      ${homepageSectionsMarkup()}<section id="footer" class="r3-footer r3-reveal" data-component="footer"><div class="r3-variant preview-desktop"><footer class="site-footer" data-structure-desktop="rail" data-density-desktop="compact" data-brand="full" data-statement="short" data-routes="single" data-legal="bottom" data-copyright="short" data-ground="dark" data-rule="accent" data-reveal="scroll"><div class="brand-block"><a class="brand" href="/" aria-label="Mindmake home"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><p class="footer-statement">Keep your edge as AI<br>changes the market.</p><a class="mm-subscribe-cta" href="https://makeyourmindup.ai" target="_blank" rel="noreferrer" data-subscribe-source="homepage_footer">Subscribe for free <span aria-hidden="true">↗</span></a></div><nav class="footer-routes" aria-label="Footer navigation"><a href="/">Home</a><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm">Build your AI revenue engine</a><a href="/case-studies">Success stories</a><a href="/blog">Ideas you can use</a><a href="/faq">Questions we get asked</a><a href="/about">About us</a><a href="https://makeyourmindup.ai" target="_blank" rel="noreferrer">Media</a><a href="/start">Start building your AI brain</a></nav><nav class="legal" aria-label="Legal navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><small>© 2026 Mindmake. <span class="mm-entity-note"><span>Mindmake is a Mindmaker LLC company.</span> <span>Mindmaker Ltd in the UK.</span></span></small></footer></div><div class="r3-variant preview-mobile"><footer class="site-footer" data-structure-mobile="compact" data-density-mobile="compact" data-brand="full" data-statement="short" data-routes="single" data-legal="bottom" data-copyright="short" data-ground="dark" data-rule="accent" data-reveal="scroll"><div class="brand-block"><a class="brand" href="/" aria-label="Mindmake home"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><p class="footer-statement">Keep your edge as AI<br>changes the market.</p><a class="mm-subscribe-cta" href="https://makeyourmindup.ai" target="_blank" rel="noreferrer" data-subscribe-source="homepage_footer">Subscribe for free <span aria-hidden="true">↗</span></a></div><nav class="legal" aria-label="Legal navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav><small>© 2026 Mindmake. <span class="mm-entity-note"><span>Mindmake is a Mindmaker LLC company.</span> <span>Mindmaker Ltd in the UK.</span></span></small></footer></div></section>
    </main>
    <aside class="r3-navigation" aria-hidden="true" aria-label="Site navigation" role="dialog" aria-modal="true" inert><div class="r3-variant preview-desktop"><div class="site-frame" data-structure-desktop="index" data-scale-desktop="balanced" data-density-desktop="balanced" data-order="build" data-secondary="footer" data-active="rule" data-action="bar" data-ground="solid" data-entrance="stepped">
              
              <div class="ground" aria-hidden="true"></div>
              <header class="site-masthead"><a class="brand" href="/" aria-label="Mindmake home" tabindex="-1"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><button class="menu-control" type="button" aria-label="Close navigation"><b>Close</b><i aria-hidden="true"></i></button></header>
              <div class="menu-surface"><nav class="primary-routes" aria-label="Main navigation"><a href="/">Home</a><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm"><span>Build your AI revenue<span class="mm-route-tail"> engine</span></span></a><a href="/case-studies">Success stories</a><a href="/blog">Ideas you can use</a><a href="/faq">Questions we get asked</a><a href="/about">About us</a><a href="https://makeyourmindup.ai" target="_blank" rel="noreferrer" class="mm-route-badged" data-badge="Subscribe for free">Media</a></nav><a class="start-action" type="button" href="/start">Start building your AI brain <span aria-hidden="true">→</span></a><nav class="secondary-routes" aria-label="Additional navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
            </div></div><div class="r3-variant preview-mobile"><div class="site-frame" data-structure-mobile="list" data-scale-mobile="balanced" data-density-mobile="balanced" data-order="build" data-secondary="footer" data-active="rule" data-action="bar" data-ground="solid" data-entrance="stepped">
              
              <div class="ground" aria-hidden="true"></div>
              <header class="site-masthead"><a class="brand" href="/" aria-label="Mindmake home" tabindex="-1"><img class="mark" src="${asset0}" alt=""><img class="wordmark" src="${asset1}" alt="Mindmake"></a><button class="menu-control" type="button" aria-label="Close navigation"><b>Close</b><i aria-hidden="true"></i></button></header>
              <div class="menu-surface"><nav class="primary-routes" aria-label="Main navigation"><a href="/">Home</a><a href="/ai-brain">Build your AI brain</a><a href="/ai-gtm"><span>Build your AI revenue<span class="mm-route-tail"> engine</span></span></a><a href="/case-studies">Success stories</a><a href="/blog">Ideas you can use</a><a href="/faq">Questions we get asked</a><a href="/about">About us</a><a href="https://makeyourmindup.ai" target="_blank" rel="noreferrer" class="mm-route-badged" data-badge="Subscribe for free">Media</a></nav><a class="start-action" type="button" href="/start">Start building your AI brain <span aria-hidden="true">→</span></a><nav class="secondary-routes" aria-label="Additional navigation"><a href="/privacy">Privacy</a><a href="/terms">Terms</a></nav></div>
            </div></div></aside>`;
