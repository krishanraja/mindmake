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
// A third (Krish, 2026-09-25, recorded first in
// quality/route-lock/approved-production-r40.json and revised in r44): the two
// opening hero-stage films play the Archive Engine loop with its own poster.
// `heroFilm` below is the whole of it; the route stage keeps film-02, as does
// /ai-brain. r44 replaces the earlier exploratory loop with the physically
// coherent drawer-first filing cycle.
//
// A fourth (Krish, 2026-09-25): the footer statement breaks before "changes".
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
const retiredChapters = /\.r3-(?:authority|dividend)\b|\.r3-mode-switch\b|\[data-(?:stage|practice|benefit-prev|benefit-next)\]/;
const leadershipChapters = '<div id="new-age-leadership" class="nal-page mm-home-leadership" data-component="leadership">${leadershipChaptersMarkup()}</div>\n      ';
const assets = new Map();
const register = value => {
  if (!value.startsWith('../')) return value;
  const absolute = path.resolve(source, value);
  if (!fs.existsSync(absolute)) throw new Error(`Missing approved asset: ${value}`);
  if (!assets.has(value)) assets.set(value, { name: `asset${assets.size}`, absolute });
  return assets.get(value).name;
};
let body = read('index.html').match(/<body>([\s\S]*?)<script src="\.\/script.js"><\/script>/)[1].trim();
body = cut(body, '<section id="authority"', '<section id="route"', leadershipChapters, 'retired chapters');
const publication = 'https://mindmakerlive.substack.com';
const subscribe = { href: `${publication}/subscribe`, label: 'Subscribe for free' };
const doors = { brain: '/ai-brain', gtm: '/ai-gtm' };
const heroFilm = {
  poster: '../../../src/assets/films/sep2026/archive-engine-hero-poster-r06.webp',
  mp4: '../../../src/assets/films/sep2026/archive-engine-hero-loop-r06-16s-720p-web-sealed.mp4',
};
body = body
  .replace(/(<section class="hero-stage">\s*<video [^>]*poster=")\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-poster\.webp("[^>]*>\s*<source src=")\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-loop\.mp4"/g, (_, open, middle) => `${open}${heroFilm.poster}${middle}${heroFilm.mp4}"`)
  .replace(/<button type="button" data-route-choice="(brain|gtm)">([\s\S]*?)<\/button>/g, (_, route, inner) => `<a href="${doors[route]}" data-route-choice="${route}">${inner}</a>`)
  .replace(/(<nav class="primary-routes"[^>]*>[\s\S]*?)<a href="https:\/\/mindmakerlive\.substack\.com" target="_blank" rel="noreferrer">Media<\/a>/g, `$1<a href="${subscribe.href}" target="_blank" rel="noreferrer" class="mm-route-badged" data-badge="${subscribe.label}">Media</a>`)
  .replace(/<a href="https:\/\/mindmakerlive\.substack\.com" target="_blank" rel="noreferrer">Media<\/a>/g, `<a href="${subscribe.href}" target="_blank" rel="noreferrer">Media</a>`)
  .replace(/(<p class="footer-statement">[^<]*<\/p>)/g, `$1<a class="mm-subscribe-cta" href="${subscribe.href}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_footer">${subscribe.label} <span aria-hidden="true">↗</span></a>`);
body = body.replace(/<p class="footer-statement">Keep your edge as AI changes the market\.<\/p>/g, '<p class="footer-statement">Keep your edge as AI<br>changes the market.</p>');
for (const [pattern, expected, label] of [[/data-route-choice="(?:brain|gtm)"/g, 4, 'hero door'], [/data-badge=/g, 2, 'Media badge'], [/mm-subscribe-cta/g, 2, 'footer subscribe'], [/<button type="button" data-route-choice/g, 0, 'unconverted door'], [/archive-engine-hero-loop-r06/g, 2, 'hero film'], [/archive-engine-hero-poster-r06/g, 2, 'hero poster'], [/Keep your edge as AI<br>changes the market\./g, 2, 'footer statement break']]) {
  const found = (body.match(pattern) ?? []).length;
  if (found !== expected) throw new Error(`Authorised correction drifted: ${label} expected ${expected}, found ${found}`);
}
const markup = body.replace(/<video muted="" loop="" autoplay=""/g, '<video data-mm-poster="true" muted="" loop=""').replace(/(?:src|poster)="(\.\.\/[^\"]+)"/g, (all, value) => all.replace(value, `\${${register(value)}}`));
let script = read('script.js');
script = cut(script, '  const selectAuthority = (phase) => {', '  if ("IntersectionObserver" in window) new IntersectionObserver(([entry], observer) => {', '', 'retired chapter runtime');
script = cut(script, '    restartBenefitTimer();\n  });', null, '  });', 'retired benefit timer');
script = cut(script, '  selectAuthority("work");\n  selectDividend("practice");\n', null, '', 'retired chapter start');
// The doors are links now; the page they name is where the click goes.
script = cut(script, '  within("opening", "[data-route-choice]").forEach((button) => button.addEventListener("click", () => selectRoute(button.dataset.routeChoice, true, true)));\n', null, '', 'hero door binding');
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
runtime = cut(runtime, 'button.toggleAttribute("aria-current", Number(button.dataset.era) === index)', null, 'setCurrent(button, Number(button.dataset.era) === index)', 'history current state');
runtime = cut(runtime, '() => selectStory(Number(button.dataset.era))', null, '() => { const index = Number(button.dataset.era); selectStory(index); choice({ section: "history", index }); }', 'history choice');
runtime = runtime.replace('    video.play().catch(() => {});', '    if (!reducedMotion.matches) video.play().catch(() => {});');
runtime = cut(runtime, '  selectRoute("brain");', null, `  const syncMotionMedia = () => root.querySelectorAll('video').forEach(video => {
    if (reducedMotion.matches) video.pause();
    else if (video.closest('.r3-opening') && video.closest('.r3-variant')?.offsetParent !== null) video.play().catch(() => {});
  });
  listen(reducedMotion, 'change', syncMotionMedia);
  syncMotionMedia();
  selectRoute("brain");`, 'motion media');
runtime = runtime.replace('    if (shouldScroll) scope("route").scrollIntoView', `    if (shouldScroll) {
      const heading = within('route', '.route-copy h2').find(node => node.offsetParent !== null);
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
    if (shouldScroll) scope("route").scrollIntoView`);
runtime = runtime.replace(/"(\.\.\/[^\"]+\.(?:mp4|webp))"/g, (_, value) => register(value));
runtime = runtime.replace('location.href = `/?start=${button.dataset.startRoute}`;', 'onStart(button.dataset.startRoute);');
runtime = cut(runtime, '  selectRoute("brain");', null, `  root.querySelectorAll('a[href="/start"]').forEach(link => listen(link, 'click', event => { event.preventDefault(); setNavigation(false); onStart('home'); }));\n  selectRoute("brain");`, 'start links');
runtime = cut(runtime, '  selectRoute("brain");', null, `  selectRoute("brain");\n  return {\n    selectStory,\n    destroy() {\n      abort.abort();\n      observers.forEach(observer => observer.disconnect());\n      timeouts.forEach(id => window.clearTimeout(id));\n      intervals.forEach(id => window.clearInterval(id));\n      frames.forEach(id => window.cancelAnimationFrame(id));\n      root.querySelectorAll('video').forEach(video => video.pause());\n      root.classList.remove('has-motion');\n      document.body.classList.remove('navigation-open');\n      site.removeAttribute('inert');\n    },\n  };`, 'lifecycle return');
const imports = [...assets.values()].map(({name, absolute}) => `import ${name} from ${JSON.stringify(path.relative(output, absolute).replaceAll('\\', '/'))};`).join('\n');
const files = {
  'markup.ts': `// Generated from the immutable accepted R3. Run node scripts/qa/build-homepage-release.mjs.\n${imports}\nimport { leadershipChaptersMarkup } from "@/components/leadership-chapters/leadershipChapters";\nexport const homepageMarkup = \`${markup}\`;\n`,
  'runtime.js': `// Generated delivery adapter. Approved source remains unchanged.\n${imports}\n${runtime}`,
  'runtime.d.ts': `export interface HomepageRuntime {\n  selectStory(index: number): void;\n  destroy(): void;\n}\nexport function mountHomepageRuntime(root: HTMLElement, options: { onStart: (route: 'home' | 'brain' | 'gtm') => void }): HomepageRuntime;\n`,
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
