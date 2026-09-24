const stage = document.querySelector('.proof-stage');
const surface = document.querySelector('.proof-surface');
const video = document.querySelector('#context-film');
const toggle = document.querySelector('#film-toggle');
const contextName = document.querySelector('#context-name');
const contextTitle = document.querySelector('#context-title');
const startLink = document.querySelector('#start-link');
const contextLinks = [...document.querySelectorAll('[data-context-link]')];

const media = {
  leadership: {
    name: 'Leadership',
    title: 'The decision stays human.',
    poster: '../case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp',
    film: '../../../src/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4',
    start: '/?start=1',
  },
  editorial: {
    name: 'Ideas + answers',
    title: 'Useful work, prepared.',
    poster: '../case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp',
    film: '../../../src/assets/films/sep2026/communications-compose-loop-r01-20s-720p-web-sealed.mp4',
    start: '/?start=1',
  },
  brain: {
    name: 'AI Brain',
    title: 'Your judgement, connected.',
    poster: '../case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp',
    film: '../../../src/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4',
    start: '/?start=brain',
  },
  gtm: {
    name: 'AI GTM',
    title: 'The whole growth engine.',
    poster: '../case-study-browsing/media/quiet-workshop-growth-loop-r01-20s-720p-web-sealed-poster.webp',
    film: '../../../src/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4',
    signalPoster: '../case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp',
    signalFilm: '../../../src/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4',
    start: '/?start=gtm',
  },
};

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData);
const constrained = () => reducedMotion.matches || saveData || document.documentElement.dataset.textScale === '200';
let currentContext = 'leadership';
let currentFilm = '';
let pausedByUser = false;
let surfaceVisible = true;
let frame = 0;
let lastProgress = 0;

const syncFilmControlVisibility = () => {
  toggle.hidden = constrained() || !currentFilm || Boolean(video?.error) || video.readyState < 2 || lastProgress >= 0.42;
};

const requestedContext = () => {
  const requested = new URLSearchParams(window.location.search).get('context');
  return requested && requested in media ? requested : 'leadership';
};

const setFilm = async (src, poster, title) => {
  if (!video) return;
  video.poster = poster;
  contextTitle.textContent = title;
  if (constrained()) {
    video.pause();
    video.removeAttribute('src');
    video.load();
    currentFilm = '';
    toggle.hidden = true;
    return;
  }
  toggle.hidden = true;
  if (currentFilm !== src) {
    video.pause();
    video.src = src;
    video.load();
    currentFilm = src;
  }
  if (!pausedByUser && !document.hidden && surfaceVisible) {
    await video.play().catch(() => {});
  }
  syncFilmControlVisibility();
  toggle.textContent = pausedByUser ? 'Play film' : 'Pause film';
  toggle.setAttribute('aria-pressed', String(pausedByUser));
};

video?.addEventListener('canplay', () => {
  syncFilmControlVisibility();
});

video?.addEventListener('error', () => {
  video.pause();
  currentFilm = '';
  toggle.hidden = true;
  surface.dataset.mediaState = 'poster';
});

const syncContext = (context, { history = false } = {}) => {
  currentContext = context in media ? context : 'leadership';
  const selected = media[currentContext];
  stage.dataset.context = currentContext;
  contextName.textContent = selected.name;
  startLink.href = selected.start;
  contextLinks.forEach((link) => {
    if (link.dataset.contextLink === currentContext) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  if (history) {
    const url = new URL(window.location.href);
    url.searchParams.set('context', currentContext);
    window.history.pushState({ context: currentContext }, '', url);
  }
  const signalPhase = currentContext === 'gtm' && lastProgress > 0.55;
  setFilm(
    signalPhase ? selected.signalFilm : selected.film,
    signalPhase ? selected.signalPoster : selected.poster,
    signalPhase ? 'Signals arrive together.' : selected.title,
  );
};

const updateProgress = () => {
  frame = 0;
  if (!stage || !surface) return;
  const mobile = window.innerWidth <= 860;
  const forceStatic = constrained() || (window.innerHeight <= 520 && window.innerWidth > window.innerHeight);
  document.documentElement.classList.toggle('is-static', forceStatic);
  let progress = 1;
  if (!forceStatic) {
    const rect = stage.getBoundingClientRect();
    const distance = mobile ? 190 : Math.max(260, window.innerHeight * 0.65);
    progress = Math.max(0, Math.min(1, -rect.top / distance));
  }
  lastProgress = progress;
  surface.style.setProperty('--p', progress.toFixed(4));
  syncFilmControlVisibility();
  if (currentContext === 'gtm') {
    const selected = media.gtm;
    const signalPhase = progress > 0.55;
    const growthPhase = progress < 0.45;
    if (signalPhase && currentFilm !== selected.signalFilm) setFilm(selected.signalFilm, selected.signalPoster, 'Signals arrive together.');
    if (growthPhase && currentFilm !== selected.film) setFilm(selected.film, selected.poster, selected.title);
  }
};

const requestProgress = () => {
  if (!frame) frame = window.requestAnimationFrame(updateProgress);
};

contextLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    syncContext(link.dataset.contextLink, { history: true });
  });
});

toggle?.addEventListener('click', async () => {
  pausedByUser = !pausedByUser;
  toggle.textContent = pausedByUser ? 'Play film' : 'Pause film';
  toggle.setAttribute('aria-pressed', String(pausedByUser));
  if (pausedByUser) video.pause();
  else await video.play().catch(() => {});
});

window.addEventListener('popstate', () => syncContext(requestedContext()));
window.addEventListener('scroll', requestProgress, { passive: true });
window.addEventListener('resize', requestProgress);
reducedMotion.addEventListener?.('change', () => { syncContext(currentContext); requestProgress(); });
document.addEventListener('visibilitychange', () => {
  if (document.hidden) video?.pause();
  else if (surfaceVisible && !pausedByUser && !constrained()) video?.play().catch(() => {});
});

const surfaceObserver = new IntersectionObserver(([entry]) => {
  surfaceVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.01);
  if (!surfaceVisible) video?.pause();
  else if (!document.hidden && !pausedByUser && !constrained()) video?.play().catch(() => {});
}, { threshold: [0, 0.01] });

surfaceObserver.observe(surface);

syncContext(requestedContext());
updateProgress();
