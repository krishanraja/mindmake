(() => {
  const videos = [...document.querySelectorAll('video')];
  const toggle = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  let paused = reduced || saveData;

  const syncToggle = () => {
    toggle?.setAttribute('aria-pressed', String(paused));
    const label = toggle?.querySelector('span');
    if (label) label.textContent = paused ? 'Play films' : 'Pause films';
  };
  const play = video => { if (!paused && video.isConnected) video.play().catch(() => {}); };
  const stop = video => video.pause();
  syncToggle();
  toggle?.addEventListener('click', () => {
    paused = !paused;
    syncToggle();
    videos.forEach(video => paused ? stop(video) : (video.getBoundingClientRect().top < innerHeight && video.getBoundingClientRect().bottom > 0 ? play(video) : stop(video)));
  });

  const videoObserver = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) play(entry.target); else stop(entry.target);
  }), { threshold: .18 });
  videos.forEach(video => videoObserver.observe(video));

  const atlas = document.querySelector('.atlas');
  const copies = [...document.querySelectorAll('[data-stage-copy]')];
  const films = [...document.querySelectorAll('[data-stage-film]')];
  const buttons = [...document.querySelectorAll('[data-stage-button]')];
  const count = document.querySelector('[data-atlas-count]');
  let current = -1;
  const setStage = index => {
    index = Math.max(0, Math.min(4, index));
    if (index === current) return;
    current = index;
    copies.forEach((el, i) => el.classList.toggle('is-active', i === index));
    films.forEach((el, i) => { el.classList.toggle('is-active', i === index); i === index ? play(el) : stop(el); });
    buttons.forEach((el, i) => { el.classList.toggle('is-active', i === index); el.setAttribute('aria-current', i === index ? 'step' : 'false'); });
    if (count) count.textContent = `${String(index + 1).padStart(2, '0')} / 05`;
  };
  const updateAtlas = () => {
    if (!atlas || innerWidth <= 900) return;
    const rect = atlas.getBoundingClientRect();
    const distance = Math.max(1, atlas.offsetHeight - innerHeight);
    setStage(Math.round(Math.max(0, Math.min(1, -rect.top / distance)) * 4));
  };
  addEventListener('scroll', updateAtlas, { passive: true });
  addEventListener('resize', updateAtlas);
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    if (!atlas) return;
    const y = scrollY + atlas.getBoundingClientRect().top + (atlas.offsetHeight - innerHeight) * (index / 4);
    scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
  }));
  setStage(0);

  const species = document.querySelector('.species');
  document.querySelectorAll('[data-species]').forEach(button => button.addEventListener('click', () => {
    const mode = button.dataset.species;
    species.dataset.mode = mode;
    document.querySelectorAll('[data-species]').forEach(item => {
      const active = item.dataset.species === mode;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
  }));

  const missing = document.querySelector('.missing-job');
  if (missing) new IntersectionObserver(([entry]) => missing.classList.toggle('is-seen', entry.isIntersecting), { threshold: .35 }).observe(missing);
})();
