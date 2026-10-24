// Generated delivery adapter. Approved source remains unchanged.
import asset0 from "../../assets/mindmake-mark.svg";
import asset1 from "../../assets/mindmake-wordmark.svg";
import asset2 from "../../assets/films/sep2026/archive-engine-hero-poster-r07.webp";
import asset3 from "../../assets/films/sep2026/archive-engine-hero-loop-r07-16s-1080p-review-sealed.mp4";
export function mountHomepageRuntime(root, { onStart }) {
  const abort = new AbortController();
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
  const setCurrent = (element, current) => { if (current) element.setAttribute('aria-current', 'true'); else element.removeAttribute('aria-current'); };
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches) root.classList.add("has-motion");

  const scope = (component) => root.querySelector(`[data-component="${component}"]`);
  const within = (component, selector) => [...scope(component).querySelectorAll(selector)];
  const visible = (nodes) => nodes.find((node) => getComputedStyle(node.closest(".r3-variant") || node).display !== "none");

  const navigation = root.querySelector(".r3-navigation");
  const site = root.querySelector("#site");
  let navigationReturnFocus = null;
  let navigationFocusVersion = 0;
  const focusNavigationClose = (version) => {
    if (abort.signal.aborted || !root.isConnected || version !== navigationFocusVersion || !navigation.classList.contains('is-open') || root.closest('[inert]')) return;
    if (navigation.contains(document.activeElement)) return;
    const variant = matchMedia("(max-width: 700px)").matches ? ".preview-mobile" : ".preview-desktop";
    const target = navigation.querySelector(`${variant} .menu-control`);
    if (!target) return;
    if (getComputedStyle(target).visibility === 'visible' && target.getClientRects().length) {
      target.focus({ preventScroll: true });
      if (document.activeElement === target) return;
    }
    requestAnimationFrame(() => focusNavigationClose(version));
  };
  const setNavigation = (open, opener = null) => {
    const focusVersion = ++navigationFocusVersion;
    if (open) navigationReturnFocus = opener instanceof HTMLElement ? opener : document.activeElement;
    navigation.classList.toggle("is-open", open);
    navigation.setAttribute("aria-hidden", String(!open));
    navigation.toggleAttribute("inert", !open);
    site.toggleAttribute("inert", open);
    document.body.classList.toggle("navigation-open", open);
    if (open) {
      requestAnimationFrame(() => focusNavigationClose(focusVersion));
    } else if (navigationReturnFocus instanceof HTMLElement) {
      const restoreNavigationFocus = () => { if (focusVersion === navigationFocusVersion && (document.activeElement === document.body || navigation.contains(document.activeElement))) navigationReturnFocus?.focus({ preventScroll: true }); };
      requestAnimationFrame(restoreNavigationFocus);
      setTimeout(restoreNavigationFocus, 60);
    }
  };
  within("opening", ".menu-control").forEach((button) => listen(button, "click", (event) => setNavigation(true, event.currentTarget)));
  [...navigation.querySelectorAll(".menu-control")].forEach((button) => listen(button, "click", () => setNavigation(false)));
  [...navigation.querySelectorAll("a")].forEach((link) => listen(link, "click", () => setNavigation(false)));
  addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) setNavigation(false);
    if (event.key !== "Tab" || !navigation.classList.contains("is-open")) return;
    const controls = [...navigation.querySelectorAll("a,button")].filter((node) => node.offsetParent !== null && node.tabIndex >= 0 && !node.disabled);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const reveals = [...root.querySelectorAll(".r3-reveal")];
  if (reducedMotion.matches || !("IntersectionObserver" in window)) reveals.forEach((section) => section.classList.add("is-visible"));
  else {
    const observer = new TrackedObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: .12, rootMargin: "0px 0px -8%" });
    reveals.forEach((section) => observer.observe(section));
  }
  listen(reducedMotion, "change", (event) => {
    root.classList.toggle("has-motion", !event.matches);
    reveals.forEach((section) => section.classList.add("is-visible"));
  });

  const syncMotionMedia = () => root.querySelectorAll('video').forEach(video => {
    if (reducedMotion.matches) video.pause();
    else if (video.closest('.r3-opening') && video.closest('.r3-variant')?.offsetParent !== null) video.play().catch(() => {});
  });
  listen(reducedMotion, 'change', syncMotionMedia);
  syncMotionMedia();
  root.querySelectorAll('[data-start-route]').forEach(button => listen(button, 'click', () => onStart(button.dataset.startRoute)));
  root.querySelectorAll('a[href="/start"]').forEach(link => listen(link, 'click', event => { event.preventDefault(); setNavigation(false); onStart('home'); }));
  return {
    destroy() {
      abort.abort();
      observers.forEach(observer => observer.disconnect());
      timeouts.forEach(id => window.clearTimeout(id));
      intervals.forEach(id => window.clearInterval(id));
      frames.forEach(id => window.cancelAnimationFrame(id));
      root.querySelectorAll('video').forEach(video => video.pause());
      root.classList.remove('has-motion');
      document.body.classList.remove('navigation-open');
      site.removeAttribute('inert');
    },
  };
}