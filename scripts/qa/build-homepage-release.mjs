import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';

// The approved R3 is immutable. This adapter changes delivery paths, runtime
// lifecycle and CSS isolation. It changes approved words or composition in one
// place only, which is recorded in quality/route-lock/approved-production-r35.json:
// the three R3 chapters between the opening and the route (history, authority
// and leadership dividend) are cut, and the three /new-age-leadership chapters
// are delivered in their place from their shared source. From r41 the history
// chapter is back (Krish, 2026-09-25: "reinstate"), pinned by
// src/components/homepage-release/pinnedChapters.ts; only authority and the
// leadership dividend stay cut.
// Ruling (Krish, 2026-09-25): the homepage uses the new-age-leadership
// chapters instead of its own three, which are scrapped. r39 opened the reach
// chapter on the organisation alone; r41 restores both of its states.
//
// A second authorised correction (Krish, 2026-09-25, recorded in
// quality/route-lock/approved-production-r38.json): the two hero doors promise
// a page (their ↗ says so) and are links to it rather than buttons that
// scrolled to the closing chapter, and Media carries its "Subscribe for free"
// badge and lands on the subscribe form. `doors` and `subscribe` below are the
// whole of it; each is counted and the build fails if the source drifts.
//
// A third (Krish, 2026-09-25, recorded in
// quality/route-lock/approved-production-r40.json): the two opening hero-stage
// films play the Archive Engine loop with its own poster. `heroFilm` below is
// the whole of it; the route stage keeps film-02, as does /ai-brain. r45
// restores r04 after Krish rejected and ordered removal of the r06 render.
//
// A fourth (Krish, 2026-09-25): the footer statement breaks before "changes".
//
// A sixth (Krish, 2026-09-26): the closing chapter's AI brain state plays the
// hero's Archive Engine loop and poster (`routeFilm`), and the four history
// questions are set in quotation marks (`quoted`). The runtime used to restore
// the brain state's title, lede and steps from older copy of its own on every
// load, so the words in the markup never showed; they are now read from the
// markup (`brainWords`), which leaves one place to change them. The AI GTM
// state keeps film-04 and its own words.
//
// A seventh (Krish, 2026-09-26): each era's label names its event, after his
// edit of the first to "Writing IS INVENTED".
//
// A sixteenth (Ruling, Krish, 2026-10-24: "drastically simplify everything
// here to be probably three sections"), which supersedes the history, route
// and leadership-chapter corrections above (git keeps them): everything
// between the opening and the footer is cut, and the three sections of
// src/components/homepage-release/homepageSections.ts are delivered in its
// place. The history chapter's four eras become tiles in the first section,
// the reach chapter's organisation and the practice scenes become the second,
// the closing route chapter folds into the opening (its button joins the hero;
// its headline joins the rotation in heroRotation.ts), and the AI Brain
// stories and "What stays with you" move to /ai-brain. The opening gains the
// way in and the publication line after its doors (`heroStart`), a new lede
// and new door lines. The runtime loses everything that served the cut
// chapters.
const repo = process.cwd();
const source = path.join(repo, 'prototypes/website-redesign-recovery/homepage-production-synthesis-r3');
const output = path.join(repo, 'src/components/homepage-release');
const check = process.argv.includes('--check');
const lifecycle = `  const abort = new AbortController();
  const observers = new Set();
  const timeouts = new Set();
  const intervals = new Set();
  const frames = new Set();
  const listen = (target, name, handler, options = {}) => target.addEventListener(name, handler, { ...options, signal: abort.signal });
  const addEventListener = (name, handler, options) => listen(window, name, handler, options);
  const setTimeout = (callback, delay) => { const id = window.setTimeout(() => { timeouts.delete(id); callback(); }, delay); timeouts.add(id); return id; };
  const setInterval = (callback, delay) => { const id = window.setInterval(callback, delay); intervals.add(id); return id; };
  const clearInterval = id => { window.clearInterval(id); intervals.delete(id); };
  const requestAnimationFrame = callback => { const id = window.requestAnimationFrame(() => { frames.delete(id); callback(); }); frames.add(id); return id; };
  function TrackedObserver(callback, options) { const observer = new window.IntersectionObserver(callback, options); observers.add(observer); return observer; }
  const choice = detail => root.dispatchEvent(new CustomEvent('homepage:choice', {detail}));
  const setCurrent = (element, current) => { if (current) element.setAttribute('aria-current', 'true'); else element.removeAttribute('aria-current'); };`;
const read = name => fs.readFileSync(path.join(source, name), 'utf8');
// Every cut names its anchors and fails the build when one is missing, so a
// change to the source can never leave a chapter half removed.
const cut = (text, from, to, replacement = '', label = from) => {
  const start = text.indexOf(from);
  const end = to === null ? start + from.length : text.indexOf(to, start);
  if (start < 0 || end < 0 || text.indexOf(from, start + 1) >= 0) throw new Error(`Homepage adapter anchor not unique or missing: ${label}`);
  return text.slice(0, start) + replacement + text.slice(end);
};
const retiredChapters = /\.r3-(?:authority|dividend|history|route)\b|\.r3-mode-switch\b|\[data-(?:stage|practice|benefit-prev|benefit-next)\]/;
const homepageSections = '${homepageSectionsMarkup()}';
const assets = new Map();
const register = value => {
  if (!value.startsWith('../')) return value;
  const absolute = path.resolve(source, value);
  if (!fs.existsSync(absolute)) throw new Error(`Missing approved asset: ${value}`);
  if (!assets.has(value)) assets.set(value, { name: `asset${assets.size}`, absolute });
  return assets.get(value).name;
};
let body = read('index.html').match(/<body>([\s\S]*?)<script src="\.\/script.js"><\/script>/)[1].trim();
body = cut(body, '<section id="history"', '<section id="footer"', homepageSections, 'chapters between the opening and the footer');
// Every Media and "Subscribe for free" link lands on the publication's own
// site (Krish, 2026-09-26).
const media = 'https://makeyourmindup.ai';
const subscribe = { href: media, label: 'Subscribe for free' };
const doors = { brain: '/ai-brain', gtm: '/ai-gtm' };
const heroFilm = {
  poster: '../../../src/assets/films/sep2026/archive-engine-hero-poster-r07.webp',
  mp4: '../../../src/assets/films/sep2026/archive-engine-hero-loop-r07-16s-1080p-review-sealed.mp4',
};
body = body
  .replace(/(<section class="hero-stage">\s*<video [^>]*poster=")\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-poster\.webp("[^>]*>\s*<source src=")\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-loop\.mp4"/g, (_, open, middle) => `${open}${heroFilm.poster}${middle}${heroFilm.mp4}"`)
  .replace(/<button type="button" data-route-choice="(brain|gtm)">([\s\S]*?)<\/button>/g, (_, route, inner) => `<a href="${doors[route]}" data-route-choice="${route}">${inner}</a>`)
  .replace(/(<nav class="primary-routes"[^>]*>[\s\S]*?)<a href="https:\/\/mindmakerlive\.substack\.com" target="_blank" rel="noreferrer">Media<\/a>/g, `$1<a href="${media}" target="_blank" rel="noreferrer" class="mm-route-badged" data-badge="${subscribe.label}">Media</a>`)
  .replace(/<a href="https:\/\/mindmakerlive\.substack\.com" target="_blank" rel="noreferrer">Media<\/a>/g, `<a href="${media}" target="_blank" rel="noreferrer">Media</a>`)
  .replace(/(<p class="footer-statement">[^<]*<\/p>)/g, `$1<a class="mm-subscribe-cta" href="${subscribe.href}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_footer">${subscribe.label} <span aria-hidden="true">↗</span></a>`);
// The route labels say what the reader gets, Home leads and About us sits
// before Media, in every menu and footer (Krish, 2026-09-25). PRIMARY_ROUTES in
// src/lib/publicLinks.ts carries the same list for every other page.
// A fifth (Krish, 2026-09-25): the answer index merged into /blog, "Ideas you
// can use", so the /answers route leaves every menu and footer, and the phone
// footer carries no route list at all ("we don't need all the links in the
// bottom nav bar ... there's a mobile menu that is easily accessible"). The
// desktop footer keeps its rail.
const routeLabels = [['/case-studies', 'Success stories'], ['/blog', 'Ideas you can use'], ['/faq', 'Questions we get asked']];
body = body.replace(/(<nav class="(?:primary|footer)-routes"[^>]*>)([\s\S]*?)(<\/nav>)/g, (_, open, inner, close) => {
  let routes = inner;
  for (const [href, label] of routeLabels) routes = routes.replace(new RegExp(`<a href="${href}">[^<]*</a>`), `<a href="${href}">${label}</a>`);
  routes = routes.replace(/<a href="\/answers">[^<]*<\/a>/, '');
  routes = routes.replace(/(<a href="https:\/\/makeyourmindup\.ai"[^>]*>Media<\/a>)/, '<a href="/about">About us</a>$1');
  return `${open}<a href="/">Home</a>${routes}${close}`;
});
const phoneFooterRoutes = /(<div class="r3-variant preview-mobile"><footer class="site-footer"[^>]*>[\s\S]*?)<nav class="footer-routes"[^>]*>[\s\S]*?<\/nav>/;
if (!phoneFooterRoutes.test(body)) throw new Error('Homepage adapter anchor missing: phone footer routes');
body = body.replace(phoneFooterRoutes, '$1');
body = body.replace(/<p class="footer-statement">Keep your edge as AI changes the market\.<\/p>/g, '<p class="footer-statement">Keep your edge as AI<br>changes the market.</p>');
// An eleventh (Krish, 2026-09-26): "your" in the headline is underlined, the
// line drawn in as the page loads (integration.css draws it). A twelfth
// (Krish, 2026-09-27): the headline is set in three fixed lines, as are the
// three it turns to (heroRotation.ts), so every one of them keeps the same
// shape as they rotate. The text content is unchanged.
// A thirteenth (Krish, 2026-10-15): the most impactful headline first. It is
// the simplest form of what an AI brain does for a leader, and the h1; R3's
// headline still turns, fifth, in heroRotation.ts.
body = body.replace(/<h1>Build the human \+ AI business that augments your vision\.<\/h1>/g, '<h1><span class="mm-hero-line"><span class="mm-hero-row">Promote <span class="mm-hero-your">your</span> AI</span> <span class="mm-hero-row">from intern to</span> <span class="mm-hero-row">chief of staff.</span></span></h1>');
// A fourteenth (Krish, 2026-10-15): the second door is the AI revenue engine,
// and the acronym GTM leaves public copy; the brain door names the idea you
// have been sitting on. The /ai-gtm address is unchanged.
body = body
  .replace(/<strong>AI GTM<\/strong>/g, '<strong>AI revenue engine</strong>')
  .replace(/<small>Your judgement, taste, standards & vision, encoded\. <\/small>/g, '<small>Your judgement, running as a system you own.</small>')
  .replace(/<small>The pricing, positioning and org structure you'll need\.<\/small>/g, "<small>The pricing, positioning and team you'll need.</small>")
  .replace(/(<nav class="primary-routes"[^>]*>[\s\S]*?)<a href="\/ai-gtm">Build your AI GTM<\/a>/g, '$1<a href="/ai-gtm"><span>Build your AI revenue<span class="mm-route-tail"> engine</span></span></a>')
  .replace(/>Build your AI GTM<\/a>/g, '>Build your AI revenue engine</a>');
// A fifteenth (Krish, 2026-10-19: "Yes, add the footer note to Mindmake too"):
// the copyright line names the registered companies, as the shell footer does
// on every other page. Each sentence is held together so a phone breaks
// between them, never inside one.
const entityNote = '<span class="mm-entity-note"><span>Mindmake is a Mindmaker LLC company.</span> <span>Mindmaker Ltd in the UK.</span></span>';
body = body.replace(/<small>(© \d{4} Mindmake\.)<\/small>/g, `<small>$1 ${entityNote}</small>`);
// The hero lede, the doors' way in and the publication line (Ruling, Krish,
// 2026-10-24). The lede speaks to every leader, not one industry; the button
// opens the brief at the AI brain's door; the publication is one line under it
// (homepageSections.ts writes both).
body = body.replace(/<p class="hero-lede">For leaders in creative industries with high standards and curiosity required to drive the new era\.<\/p>/g, '<p class="hero-lede">The leaders who shape the next decade will have an AI that thinks like them. We build yours.</p>');
body = body.replace(/(<div class="route-doors" role="group" aria-label="Choose a Mindmake route">[\s\S]*?<\/div>)/g, '$1${heroStartMarkup()}');
// A seventeenth (Krish, 2026-10-24: "add a subscribe button in the top nav bar
// next to the hamburger"): the masthead's Subscribe sits before the menu
// control at both sizes (homepageSections.ts writes it). The open
// navigation's masthead keeps its Close alone; its menu carries the badge.
body = body.replace(/(<button class="menu-control" type="button" aria-label="Open navigation">)/g, '${mastheadSubscribeMarkup()}$1');
// The menu's and footer's way in say what the reader is building, as
// START_LABEL in src/lib/publicLinks.ts does on every other page.
body = body.replace(/(href="\/start">)Get your free AI brief/g, '$1Start building your AI brain');
for (const [pattern, expected, label] of [[/data-route-choice="(?:brain|gtm)"/g, 4, 'hero door'], [/data-badge=/g, 2, 'Media badge'], [/\$\{mastheadSubscribeMarkup\(\)\}<button class="menu-control" type="button" aria-label="Open navigation">/g, 2, 'masthead subscribe'], [/<a href="https:\/\/makeyourmindup\.ai"[^>]*>Media<\/a>/g, 3, 'Media to the publication'], [/mm-subscribe-cta/g, 2, 'footer subscribe'], [/<button type="button" data-route-choice/g, 0, 'unconverted door'], [/archive-engine-hero-loop-r07/g, 2, 'hero film'], [/archive-engine-hero-poster-r07/g, 2, 'hero poster'], [/film-02-(?:loop|poster)/g, 0, 'retired route film'], [/<section id="(?:authority|leadership-dividend|route)"/g, 0, 'cut chapters'], [/\$\{homepageSectionsMarkup\(\)\}/g, 1, 'homepage sections'], [/\$\{heroStartMarkup\(\)\}/g, 2, 'hero way in'], [/Keep your edge as AI<br>changes the market\./g, 2, 'footer statement break'], [/<span class="mm-hero-row">from intern to<\/span> <span class="mm-hero-row">chief of staff\.<\/span><\/span><\/h1>/g, 2, 'hero lines'], [/<strong>AI revenue engine<\/strong>/g, 2, 'revenue engine door'], [/<small>Your judgement, running as a system you own\.<\/small>/g, 2, 'brain door line'], [/<small>The pricing, positioning and team you'll need\.<\/small>/g, 2, 'revenue engine door line'], [/<a href="\/ai-gtm"><span>Build your AI revenue<span class="mm-route-tail"> engine<\/span><\/span><\/a>/g, 2, 'revenue engine menu route'], [/>Build your AI revenue engine<\/a>/g, 1, 'revenue engine footer route'], [/GTM/g, 0, 'GTM acronym in public copy'], [/href="\/start">Start building your AI brain/g, 3, 'menu and footer way in'], [/Get your free AI brief/g, 0, 'retired way in'], [/<p class="hero-lede">The leaders who shape the next decade will have an AI that thinks like them\. We build yours\.<\/p>/g, 2, 'hero lede'], [/<a href="\/">Home<\/a>/g, 3, 'Home route'], [/<a href="\/about">About us<\/a>/g, 3, 'About route'], [/>(?:Success stories|Ideas you can use|Questions we get asked)<\/a>/g, 9, 'renamed routes'], [/<nav class="footer-routes"/g, 1, 'desktop footer rail'], [/<a href="\/answers">/g, 0, 'merged answers route'], [/<small>© \d{4} Mindmake\. <span class="mm-entity-note"><span>Mindmake is a Mindmaker LLC company\.<\/span> <span>Mindmaker Ltd in the UK\.<\/span><\/span><\/small>/g, 2, 'footer entity note'], [/>(?:Results|Thinking|Questions leaders ask|Before you start|Quick AI tips)<\/a>/g, 0, 'retired route labels']]) {
  const found = (body.match(pattern) ?? []).length;
  if (found !== expected) throw new Error(`Authorised correction drifted: ${label} expected ${expected}, found ${found}`);
}
const markup = body.replace(/<video muted="" loop="" autoplay=""/g, '<video data-mm-poster="true" muted="" loop=""').replace(/(?:src|poster)="(\.\.\/[^\"]+)"/g, (all, value) => all.replace(value, `\${${register(value)}}`));
let script = read('script.js');
script = cut(script, '  const routeContent = {', '  const reveals = [...document.querySelectorAll(".r3-reveal")];', '', 'route, history and retired chapter runtime');
script = cut(script, '    restartBenefitTimer();\n  });', null, '  });', 'retired benefit timer');
script = cut(script, '  selectStory(0);\n  selectAuthority("work");\n  selectDividend("practice");\n  selectRoute("brain");\n', null, '  /* adapter: end */\n', 'chapter start');
let runtime = script.replace(/^\(\(\) => \{/, 'export function mountHomepageRuntime(root, { onStart }) {').replace(/\}\)\(\);\s*$/, '}');
runtime = runtime.replace('  const root = document.documentElement;', lifecycle);
runtime = runtime.replaceAll('document.querySelector', 'root.querySelector').replace('document.getElementById("site")', 'root.querySelector("#site")');
runtime = runtime.replace(/\b(button|link|document|reducedMotion)\.addEventListener(?:\?\.)?\(/g, 'listen($1, ');
runtime = runtime.replaceAll('new IntersectionObserver(', 'new TrackedObserver(');
runtime = runtime.replace('  const focusNavigationClose = () => {', `  let navigationFocusVersion = 0;
  const focusNavigationClose = (version) => {
    if (abort.signal.aborted || !root.isConnected || version !== navigationFocusVersion || !navigation.classList.contains('is-open') || root.closest('[inert]')) return;
    if (navigation.contains(document.activeElement)) return;`);
runtime = runtime.replace('    navigation.querySelector(`${variant} .menu-control`)?.focus({ preventScroll: true });', `    const target = navigation.querySelector(\`\${variant} .menu-control\`);
    if (!target) return;
    if (getComputedStyle(target).visibility === 'visible' && target.getClientRects().length) {
      target.focus({ preventScroll: true });
      if (document.activeElement === target) return;
    }
    requestAnimationFrame(() => focusNavigationClose(version));`);
runtime = runtime.replace('  const setNavigation = (open, opener = null) => {', '  const setNavigation = (open, opener = null) => {\n    const focusVersion = ++navigationFocusVersion;');
runtime = runtime.replace(/      requestAnimationFrame\(focusNavigationClose\);\r?\n      setTimeout\(focusNavigationClose, 60\);/, '      requestAnimationFrame(() => focusNavigationClose(focusVersion));');
runtime = runtime.replace('const restoreNavigationFocus = () => navigationReturnFocus?.focus({ preventScroll: true });', 'const restoreNavigationFocus = () => { if (focusVersion === navigationFocusVersion && (document.activeElement === document.body || navigation.contains(document.activeElement))) navigationReturnFocus?.focus({ preventScroll: true }); };');
runtime = runtime.replace('    video.play().catch(() => {});', '    if (!reducedMotion.matches) video.play().catch(() => {});');
runtime = cut(runtime, '  /* adapter: end */', null, `  const syncMotionMedia = () => root.querySelectorAll('video').forEach(video => {
    if (reducedMotion.matches) video.pause();
    else if (video.closest('.r3-opening') && video.closest('.r3-variant')?.offsetParent !== null) video.play().catch(() => {});
  });
  listen(reducedMotion, 'change', syncMotionMedia);
  syncMotionMedia();
  /* adapter: end */`, 'motion media');
runtime = runtime.replace(/"(\.\.\/[^\"]+\.(?:mp4|webp))"/g, (_, value) => register(value));
// The way in, in the hero and at the end, opens the brief at its door.
runtime = cut(runtime, '  /* adapter: end */', null, `  root.querySelectorAll('[data-start-route]').forEach(button => listen(button, 'click', () => onStart(button.dataset.startRoute)));\n  root.querySelectorAll('a[href="/start"]').forEach(link => listen(link, 'click', event => { event.preventDefault(); setNavigation(false); onStart('home'); }));\n  /* adapter: end */`, 'start links');
runtime = cut(runtime, '  /* adapter: end */', null, `  return {\n    destroy() {\n      abort.abort();\n      observers.forEach(observer => observer.disconnect());\n      timeouts.forEach(id => window.clearTimeout(id));\n      intervals.forEach(id => window.clearInterval(id));\n      frames.forEach(id => window.cancelAnimationFrame(id));\n      root.querySelectorAll('video').forEach(video => video.pause());\n      root.classList.remove('has-motion');\n      document.body.classList.remove('navigation-open');\n      site.removeAttribute('inert');\n    },\n  };`, 'lifecycle return');
const imports = [...assets.values()].map(({name, absolute}) => `import ${name} from ${JSON.stringify(path.relative(output, absolute).replaceAll('\\', '/'))};`).join('\n');
const files = {
  'markup.ts': `// Generated from the immutable accepted R3. Run node scripts/qa/build-homepage-release.mjs.\n${imports}\nimport { heroStartMarkup, homepageSectionsMarkup, mastheadSubscribeMarkup } from "@/components/homepage-release/homepageSections";\nexport const homepageMarkup = \`${markup}\`;\n`,
  'runtime.js': `// Generated delivery adapter. Approved source remains unchanged.\n${imports}\n${runtime}`,
  'runtime.d.ts': `export interface HomepageRuntime {\n  destroy(): void;\n}\nexport function mountHomepageRuntime(root: HTMLElement, options: { onStart: (route: 'home' | 'brain' | 'gtm') => void }): HomepageRuntime;\n`,
};
for (const name of ['component-styles.css', 'page.css']) {
  const ast = postcss.parse(read(name));
  ast.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    const kept = rule.selectors.filter(selector => !retiredChapters.test(selector));
    if (!kept.length) rule.remove();
    else if (kept.length !== rule.selectors.length) rule.selectors = kept;
  });
  ast.walkAtRules(rule => { if (rule.nodes && !rule.nodes.length) rule.remove(); });
  ast.walkRules(rule => {
    if (rule.selector.includes('.route-doors button')) rule.selectors = rule.selectors.map(selector => selector.replaceAll('.route-doors button', '.route-doors a'));
  });
  ast.walkDecls(decl => {
    decl.value = decl.value.replace(/url\("(\.\.\/[^\"]+)"\)/g, (_, value) => `url("${path.relative(output, path.resolve(source, value)).replaceAll('\\', '/')}")`);
  });
  if (name === 'page.css') ast.walkRules(rule => {
    if (rule.parent.type === 'atrule' && /keyframes/.test(rule.parent.name)) return;
    rule.selectors = rule.selectors.map(selector => {
      if (selector === ':root') return '.mm-homepage-release';
      if (selector === 'html') return 'html.mm-homepage-active';
      if (selector.startsWith('body')) return selector.replace('body', 'body.mm-homepage-active');
      if (['*', 'button', 'a'].includes(selector)) return `.mm-homepage-release ${selector}`;
      return selector;
    });
  });
  files[name] = `/* Generated immutable R3 delivery adapter. */\n${ast.toString()}`;
}
fs.mkdirSync(output, {recursive:true});
for (const [name, value] of Object.entries(files)) {
  const target = path.join(output, name);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) throw new Error(`Stale homepage adapter: ${name}`);
  } else fs.writeFileSync(target, value);
}
console.log(JSON.stringify({status:'PASS', mode:check ? 'check' : 'build', assets: assets.size, sourceSha256:crypto.createHash('sha256').update(read('index.html')).digest('hex')}));
