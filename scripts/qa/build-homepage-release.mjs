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
// A seventh (Krish, 2026-09-26): each era's label names its event
// (`eraLabels`), after his edit of the first to "Writing IS INVENTED". The
// runtime used to restore the bare names over the markup on load.
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
// Every Media link lands on the publication's own site (Krish, 2026-09-26);
// "Subscribe for free" keeps the one-field form on its Substack host.
const media = 'https://makeyourmindup.ai';
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
  .replace(/(<p class="footer-statement">[^<]*<\/p>)/g, `$1<a class="mm-subscribe-cta" href="${subscribe.href}" target="_blank" rel="noreferrer" data-subscribe-source="homepage_footer">${subscribe.label} <span aria-hidden="true">↗</span></a>`)
  .replace(/(<section class="route-stage"><video [^>]*poster=")\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-poster\.webp("[^>]*><source src=")\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-loop\.mp4"/g, (_, open, middle) => `${open}${heroFilm.poster}${middle}${heroFilm.mp4}"`);
// The history questions are what people asked at the time, so they read as
// quotations, in the curly marks the rest of the site quotes with.
const list = values => `[${values.map(value => JSON.stringify(value)).join(', ')}]`;
const quoted = question => `“${question.replace(/^["“]|["”]$/g, '')}”`;
body = body.replace(/(<h3 data-story-question=""[^>]*>)([^<]+)(<\/h3>)/g, (_, open, question, close) => `${open}${quoted(question)}${close}`);
const eraLabels = ['370 BC · Writing is invented', '1675 · The engine loom arrives', '1970s · Calculators reach classrooms', '2000s · Satnav goes mainstream'];
{
  const labels = [...new Set([...body.matchAll(/<b data-story-era="">([^<]+)<\/b>/g)].map(([, label]) => label))];
  if (labels.length !== 1 || !labels[0].startsWith('370 BC · Writing')) throw new Error('Homepage adapter anchor missing or split: first era label');
  body = body.replaceAll(`<b data-story-era="">${labels[0]}</b>`, `<b data-story-era="">${eraLabels[0]}</b>`);
}
const brainWords = (() => {
  const copies = [...body.matchAll(/<div class="route-copy"[^>]*><h2>([^<]+)<\/h2><p class="lede">([^<]+)<\/p>/g)].map(([, title, lede]) => ({ title, lede }));
  const steps = [...body.matchAll(/<article class="receipt">[\s\S]*?<ol>([\s\S]*?)<\/ol>/g)].map(([, list]) => [...list.matchAll(/<li>([^<]+)<\/li>/g)].map(([, step]) => step));
  if (copies.length !== 2 || steps.length !== 2 || steps[0].length !== 3) throw new Error('Homepage adapter anchor missing: route brain words');
  const words = { ...copies[0], steps: steps[0] };
  if (JSON.stringify({ ...copies[1], steps: steps[1] }) !== JSON.stringify(words)) throw new Error('Homepage adapter drift: desktop and phone route words differ');
  return words;
})();
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
for (const [pattern, expected, label] of [[/data-route-choice="(?:brain|gtm)"/g, 4, 'hero door'], [/data-badge=/g, 2, 'Media badge'], [/<a href="https:\/\/makeyourmindup\.ai"[^>]*>Media<\/a>/g, 3, 'Media to the publication'], [/mm-subscribe-cta/g, 2, 'footer subscribe'], [/<button type="button" data-route-choice/g, 0, 'unconverted door'], [/archive-engine-hero-loop-r07/g, 4, 'hero and route film'], [/archive-engine-hero-poster-r07/g, 4, 'hero and route poster'], [/<section class="route-stage"><video [^>]*archive-engine-hero-poster-r07[^>]*><source src="[^"]*archive-engine-hero-loop-r07/g, 2, 'route film'], [/film-02-(?:loop|poster)/g, 0, 'retired route film'], [/<h3 data-story-question=""[^>]*>“[^"“”<]+”<\/h3>/g, 2, 'quoted history question'], [/Keep your edge as AI<br>changes the market\./g, 2, 'footer statement break'], [/<a href="\/">Home<\/a>/g, 3, 'Home route'], [/<a href="\/about">About us<\/a>/g, 3, 'About route'], [/>(?:Success stories|Ideas you can use|Questions we get asked)<\/a>/g, 9, 'renamed routes'], [/<nav class="footer-routes"/g, 1, 'desktop footer rail'], [/<a href="\/answers">/g, 0, 'merged answers route'], [/>(?:Results|Thinking|Questions leaders ask|Before you start|Quick AI tips)<\/a>/g, 0, 'retired route labels']]) {
  const found = (body.match(pattern) ?? []).length;
  if (found !== expected) throw new Error(`Authorised correction drifted: ${label} expected ${expected}, found ${found}`);
}
const markup = body.replace(/<video muted="" loop="" autoplay=""/g, '<video data-mm-poster="true" muted="" loop=""').replace(/(?:src|poster)="(\.\.\/[^\"]+)"/g, (all, value) => all.replace(value, `\${${register(value)}}`));
let script = read('script.js');
if (Object.values(brainWords).flat().some(text => /[&<>]/.test(text))) throw new Error('Route brain words carry markup; set them as plain text');
script = cut(script, '    brain: {\n', '      caption:', `    brain: {\n      title: ${JSON.stringify(brainWords.title)},\n      lede: ${JSON.stringify(brainWords.lede)},\n`, 'route brain title and lede');
script = script.replace(/(    brain: \{[\s\S]*?      steps: )\[[^\]]*\](,[\s\S]*?      film: )"\.\.\/\.\.\/\.\.\/src\/assets\/films\/film-02-loop\.mp4"/, (_, open, middle) => `${open}${list(brainWords.steps)}${middle}${JSON.stringify(heroFilm.mp4)}`);
script = script.replace(/question: "([^"]+)"/g, (_, question) => `question: ${JSON.stringify(quoted(question))}`);
for (const [index, bare] of ['370 BC · Writing', '1675 · Engine loom', '1970s · Calculator', '2000s · Satnav'].entries()) script = cut(script, `    { era: "${bare}", `, null, `    { era: ${JSON.stringify(eraLabels[index])}, `, `era label ${index + 1}`);
for (const [pattern, expected, label] of [[/question: "“[^"“”]+”"/g, 4, 'quoted history questions'], [/film-02-loop/g, 0, 'retired route film in runtime'], [new RegExp(`title: ${JSON.stringify(brainWords.title).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g'), 1, 'route brain title']]) {
  const found = (script.match(pattern) ?? []).length;
  if (found !== expected) throw new Error(`Authorised correction drifted: ${label} expected ${expected}, found ${found}`);
}
if (script.split(`steps: ${list(brainWords.steps)}`).length !== 2) throw new Error('Authorised correction drifted: route brain steps');
for (const label of eraLabels) if (script.split(`{ era: ${JSON.stringify(label)}, `).length !== 2) throw new Error(`Authorised correction drifted: era label ${label}`);
if ((body.match(new RegExp(`<b data-story-era="">${eraLabels[0]}</b>`, 'g')) ?? []).length !== 2) throw new Error('Authorised correction drifted: first era label in markup');
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
