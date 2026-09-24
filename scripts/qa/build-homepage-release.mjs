import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';

// The approved R3 is immutable. This adapter only changes delivery paths,
// runtime lifecycle and CSS isolation, never approved words or composition.
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
const assets = new Map();
const register = value => {
  if (!value.startsWith('../')) return value;
  const absolute = path.resolve(source, value);
  if (!fs.existsSync(absolute)) throw new Error(`Missing approved asset: ${value}`);
  if (!assets.has(value)) assets.set(value, { name: `asset${assets.size}`, absolute });
  return assets.get(value).name;
};
const body = read('index.html').match(/<body>([\s\S]*?)<script src="\.\/script.js"><\/script>/)[1].trim();
const markup = body.replace(/<video muted="" loop="" autoplay=""/g, '<video data-mm-poster="true" muted="" loop=""').replace(/(?:src|poster)="(\.\.\/[^\"]+)"/g, (all, value) => all.replace(value, `\${${register(value)}}`));
let runtime = read('script.js').replace(/^\(\(\) => \{/, 'export function mountHomepageRuntime(root, { onStart }) {').replace(/\}\)\(\);\s*$/, '}');
runtime = runtime.replace('  const root = document.documentElement;', lifecycle);
runtime = runtime.replaceAll('document.querySelector', 'root.querySelector').replace('document.getElementById("site")', 'root.querySelector("#site")');
runtime = runtime.replace(/\b(button|link|dividendSection|document|reducedMotion)\.addEventListener(?:\?\.)?\(/g, 'listen($1, ');
runtime = runtime.replaceAll('new IntersectionObserver(', 'new TrackedObserver(');
runtime = runtime.replace('const restoreNavigationFocus = () => navigationReturnFocus?.focus({ preventScroll: true });', 'const restoreNavigationFocus = () => { if (document.activeElement === document.body || navigation.contains(document.activeElement)) navigationReturnFocus?.focus({ preventScroll: true }); };');
runtime = runtime.replace('button.toggleAttribute("aria-current", Number(button.dataset.era) === index)', 'setCurrent(button, Number(button.dataset.era) === index)');
runtime = runtime.replace('button.toggleAttribute("aria-current", active)', 'setCurrent(button, active)');
runtime = runtime.replace('button.toggleAttribute("aria-current", index === practiceIndex)', 'setCurrent(button, index === practiceIndex)');
runtime = runtime.replace('    video.play().catch(() => {});', '    if (!reducedMotion.matches) video.play().catch(() => {});');
runtime = runtime.replace('  selectStory(0);', `  const syncMotionMedia = () => root.querySelectorAll('video').forEach(video => {
    if (reducedMotion.matches) video.pause();
    else if (video.closest('.r3-opening') && video.closest('.r3-variant')?.offsetParent !== null) video.play().catch(() => {});
  });
  listen(reducedMotion, 'change', syncMotionMedia);
  syncMotionMedia();
  applyPractice();
  selectStory(0);`);
runtime = runtime.replace('    if (shouldScroll) scope("route").scrollIntoView', `    if (shouldScroll) {
      const heading = within('route', '.route-copy h2').find(node => node.offsetParent !== null);
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
    if (shouldScroll) scope("route").scrollIntoView`);
runtime = runtime.replace(/"(\.\.\/[^\"]+\.(?:mp4|webp))"/g, (_, value) => register(value));
runtime = runtime.replace('location.href = `/?start=${button.dataset.startRoute}`;', 'onStart(button.dataset.startRoute);');
runtime = runtime.replace('() => selectStory(Number(button.dataset.era))', '() => { const index = Number(button.dataset.era); selectStory(index); choice({ section: "history", index }); }');
runtime = runtime.replace('selectDividend(button.dataset.dividendMode);', 'selectDividend(button.dataset.dividendMode); choice({ section: "dividend", mode: button.dataset.dividendMode });');
runtime = runtime.replace('practiceIndex = index % 3; applyPractice();', 'practiceIndex = index % 3; applyPractice(); choice({ section: "dividend", index: practiceIndex });');
runtime = runtime.replace('  selectStory(0);', `  root.querySelectorAll('a[href="/start"]').forEach(link => listen(link, 'click', event => { event.preventDefault(); setNavigation(false); onStart('home'); }));\n  selectStory(0);`);
runtime = runtime.replace('  selectRoute("brain");', `  selectRoute("brain");\n  return {\n    selectStory,\n    selectDividend,\n    selectPractice(index) { practiceIndex = Math.max(0, Math.min(2, index)); applyPractice(); },\n    selectBenefit(index) { benefitIndex = Math.max(0, Math.min(5, index)); applyBenefit(); },\n    destroy() {\n      abort.abort();\n      observers.forEach(observer => observer.disconnect());\n      timeouts.forEach(id => window.clearTimeout(id));\n      intervals.forEach(id => window.clearInterval(id));\n      frames.forEach(id => window.cancelAnimationFrame(id));\n      root.querySelectorAll('video').forEach(video => video.pause());\n      root.classList.remove('has-motion');\n      document.body.classList.remove('navigation-open');\n      site.removeAttribute('inert');\n    },\n  };`);
const imports = [...assets.values()].map(({name, absolute}) => `import ${name} from ${JSON.stringify(path.relative(output, absolute).replaceAll('\\', '/'))};`).join('\n');
const files = {
  'markup.ts': `// Generated from the immutable accepted R3. Run node scripts/qa/build-homepage-release.mjs.\n${imports}\nexport const homepageMarkup = \`${markup}\`;\n`,
  'runtime.js': `// Generated delivery adapter. Approved source remains unchanged.\n${imports}\n${runtime}`,
  'runtime.d.ts': `export interface HomepageRuntime {\n  selectStory(index: number): void;\n  selectPractice(index: number): void;\n  selectDividend(mode: 'practice' | 'benefits' | 'return'): void;\n  selectBenefit(index: number): void;\n  destroy(): void;\n}\nexport function mountHomepageRuntime(root: HTMLElement, options: { onStart: (route: 'home' | 'brain' | 'gtm') => void }): HomepageRuntime;\n`,
};
for (const name of ['component-styles.css', 'page.css']) {
  const ast = postcss.parse(read(name));
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
