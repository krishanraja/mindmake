// Generated delivery adapter. Approved source remains unchanged.
import asset0 from "../../assets/mindmake-mark.svg";
import asset1 from "../../assets/mindmake-wordmark.svg";
import asset2 from "../../assets/films/sep2026/archive-engine-hero-poster-r07.webp";
import asset3 from "../../assets/films/sep2026/archive-engine-hero-loop-r07-16s-1080p-review-sealed.mp4";
import asset4 from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-writing-s2.webp";
import asset5 from "../../assets/films/film-02-poster.webp";
import asset6 from "../../assets/films/film-02-loop.mp4";
import asset7 from "../../assets/films/film-04-loop.mp4";
import asset8 from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-loom-s2.webp";
import asset9 from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-calculator-s2.webp";
import asset10 from "../../../prototypes/website-redesign-recovery/new-age-leadership/media/history-satnav-s2.webp";
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

  const routeContent = {
    brain: {
      title: "Own your judgement, and amplify it.",
      lede: "Give your standards, taste and business vision a seat at the table, and level up your capabilities as a leader.",
      caption: null,
      source: null,
      steps: ["Your brain, built out.", "The systems that amplify you, proven.", "The confidence of being an AI era leader."],
      result: null,
      film: asset6,
    },
    gtm: {
      title: "We turn an AI market shift into one tested commercial move.",
      lede: "See how one market change alters product, price, positioning and people before you commit.",
      caption: "Start with the commercial decision that is holding the rest of the system back.",
      source: "Anonymous client outcome · Media advisory",
      steps: ["Expertise people value", "A clear offer", "A defined plan launched"],
      result: "A respected advisory firm turned its expertise into a clear offer clients could buy.",
      film: asset7,
    },
  };
  let selectedRoute = "brain";
  const activateRouteMedia = () => within("route", "video").forEach((video) => {
    if (video.closest(".r3-variant")?.offsetParent === null) return;
    const source = video.querySelector("source")?.getAttribute("src") || "";
    if (video.dataset.loadedSrc === source) return;
    video.dataset.loadedSrc = source;
    video.load();
    if (!reducedMotion.matches) video.play().catch(() => {});
  });
  const selectRoute = (route, shouldScroll = false, activateMedia = false) => {
    selectedRoute = route;
    within("route", ".site-frame").forEach((frame) => {
      const item = routeContent[route];
      frame.querySelector(".route-copy h2").textContent = item.title;
      frame.querySelector(".lede").textContent = item.lede;
      const captionNode = frame.querySelector("figcaption");
      if (captionNode) captionNode.textContent = item.caption;
      const sourceNode2 = frame.querySelector(".receipt header p");
      if (sourceNode2) sourceNode2.textContent = item.source;
      [...frame.querySelectorAll(".receipt li")].forEach((node, index) => { node.textContent = item.steps[index]; });
      const resultNode = frame.querySelector("blockquote");
      if (resultNode) resultNode.textContent = item.result;
      const sourceNode = frame.querySelector("video source");
      if (sourceNode.getAttribute("src") !== item.film) sourceNode.setAttribute("src", item.film);
      frame.querySelector("[data-start-route]").dataset.startRoute = route;
    });
    if (activateMedia) activateRouteMedia();
    if (shouldScroll) {
      const heading = within('route', '.route-copy h2').find(node => node.offsetParent !== null);
      if (heading) { heading.tabIndex = -1; heading.focus({ preventScroll: true }); }
    }
    if (shouldScroll) scope("route").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  };
  within("route", "[data-route-toggle]").forEach((button) => listen(button, "click", () => {
    selectRoute(selectedRoute === "brain" ? "gtm" : "brain", false, true);
  }));
  within("route", "[data-start-route]").forEach((button) => listen(button, "click", () => { onStart(button.dataset.startRoute); }));

  const stories = [
    { era: "370 BC · Writing", image: asset4, alt: "An illustrative historical writing scene", question: "If knowledge lives outside us, will memory grow weaker?", outcome: "Ideas could travel beyond one voice and survive their maker. We changed what memory was for." },
    { era: "1675 · Engine loom", image: asset8, alt: "An illustrative mechanised loom scene", question: "If the machine can do the work, what happens to the worker?", outcome: "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain." },
    { era: "1970s · Calculator", image: asset9, alt: "An illustrative classroom calculator scene", question: "If the device does the arithmetic, will children stop learning to think?", outcome: "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer." },
    { era: "2000s · Satnav", image: asset10, alt: "An illustrative early satellite navigation scene", question: "If the device knows the route, will we lose our sense of direction?", outcome: "That risk turned out to be real. A useful tool still asks us what we choose to keep practising." },
  ];
  const selectStory = (index) => {
    within("history", ".history-frame").forEach((frame) => {
      const story = stories[index];
      frame.querySelector("[data-story-question]").textContent = story.question;
      frame.querySelector("[data-story-outcome]").textContent = story.outcome;
      frame.querySelector("[data-story-era]").textContent = story.era;
      frame.querySelector("[data-story-count]").textContent = `0${index + 1}`;
      const image = frame.querySelector("[data-story-image]");
      image.src = story.image;
      image.alt = story.alt;
      frame.querySelectorAll("[data-era]").forEach((button) => setCurrent(button, Number(button.dataset.era) === index));
    });
  };
  within("history", "[data-era]").forEach((button) => listen(button, "click", () => { const index = Number(button.dataset.era); selectStory(index); choice({ section: "history", index }); }));

  if ("IntersectionObserver" in window) new TrackedObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    activateRouteMedia();
    observer.disconnect();
  }, { threshold: .05 }).observe(scope("route"));

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

  selectStory(0);
  const syncMotionMedia = () => root.querySelectorAll('video').forEach(video => {
    if (reducedMotion.matches) video.pause();
    else if (video.closest('.r3-opening') && video.closest('.r3-variant')?.offsetParent !== null) video.play().catch(() => {});
  });
  listen(reducedMotion, 'change', syncMotionMedia);
  syncMotionMedia();
  root.querySelectorAll('a[href="/start"]').forEach(link => listen(link, 'click', event => { event.preventDefault(); setNavigation(false); onStart('home'); }));
  selectRoute("brain");
  return {
    selectStory,
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
