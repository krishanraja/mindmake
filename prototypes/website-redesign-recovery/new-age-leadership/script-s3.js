(() => {
  const videos = [...document.querySelectorAll('video')];
  const toggle = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  let paused = reduced || saveData;
  const syncToggle = () => {
    toggle?.setAttribute('aria-pressed', String(paused));
    const label = toggle?.querySelector('span');
    if (label) label.textContent = paused ? 'Play motion' : 'Pause motion';
  };
  const play = video => { if (!paused) video.play().catch(() => {}); };
  const stop = video => video.pause();
  syncToggle();
  toggle?.addEventListener('click', () => {
    paused = !paused;
    syncToggle();
    videos.forEach(video => paused ? stop(video) : (video.getBoundingClientRect().top < innerHeight && video.getBoundingClientRect().bottom > 0 ? play(video) : stop(video)));
  });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting ? play(entry.target) : stop(entry.target)), { threshold: .18 });
  videos.forEach(video => observer.observe(video));

  const lens = document.querySelector('.time-lens');
  const lensFrames = [...document.querySelectorAll('[data-lens-frame]')];
  const lensCopies = [...document.querySelectorAll('[data-lens-copy]')];
  const lensButtons = [...document.querySelectorAll('[data-lens-button]')];
  const lensRange = document.querySelector('[data-lens-range]');
  const lensCount = document.querySelector('[data-lens-count]');
  const lensEra = document.querySelector('[data-lens-era]');
  const lensViewport = document.querySelector('[data-lens-viewport]');
  const eras = ['Writing', 'The loom', 'Calculator', 'Satnav'];
  let lensIndex = 0;
  let touchStart = null;

  const setLens = rawIndex => {
    const index = Math.max(0, Math.min(3, Number(rawIndex)));
    lensIndex = index;
    lensFrames.forEach((frame, i) => {
      frame.classList.toggle('is-active', i === index);
      frame.setAttribute('aria-hidden', String(i !== index));
    });
    lensCopies.forEach((copy, i) => {
      copy.classList.toggle('is-active', i === index);
      copy.setAttribute('aria-hidden', String(i !== index));
    });
    lensButtons.forEach((button, i) => {
      button.classList.toggle('is-active', i === index);
      if (i === index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
    });
    if (lensRange) lensRange.value = String(index);
    if (lensCount) lensCount.textContent = `${String(index + 1).padStart(2, '0')} / 04`;
    if (lensEra) lensEra.textContent = eras[index];
  };

  const lensScrollTop = index => {
    if (!lens || innerWidth <= 900) return;
    const rootTop = scrollY + lens.getBoundingClientRect().top;
    const distance = Math.max(1, lens.offsetHeight - innerHeight);
    scrollTo({ top: rootTop + distance * (index / 3), behavior: reduced ? 'auto' : 'smooth' });
  };
  const chooseLens = index => innerWidth > 900 ? lensScrollTop(index) : setLens(index);
  const updateLensFromScroll = () => {
    if (!lens || innerWidth <= 900) return;
    const rect = lens.getBoundingClientRect();
    const distance = Math.max(1, lens.offsetHeight - innerHeight);
    setLens(Math.round(Math.max(0, Math.min(1, -rect.top / distance)) * 3));
  };
  lensButtons.forEach((button, index) => button.addEventListener('click', () => chooseLens(index)));
  lensRange?.addEventListener('input', event => chooseLens(event.target.value));
  document.querySelector('[data-lens-prev]')?.addEventListener('click', () => chooseLens(lensIndex - 1));
  document.querySelector('[data-lens-next]')?.addEventListener('click', () => chooseLens(lensIndex + 1));
  lens?.addEventListener('keydown', event => {
    if (event.key === 'ArrowRight') { event.preventDefault(); chooseLens(lensIndex + 1); }
    if (event.key === 'ArrowLeft') { event.preventDefault(); chooseLens(lensIndex - 1); }
  });
  lensViewport?.addEventListener('pointerdown', event => { touchStart = { x: event.clientX, y: event.clientY }; });
  lensViewport?.addEventListener('pointerup', event => {
    if (!touchStart || innerWidth > 900) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) chooseLens(lensIndex + (dx < 0 ? 1 : -1));
    touchStart = null;
  });
  addEventListener('scroll', updateLensFromScroll, { passive: true });
  addEventListener('resize', updateLensFromScroll);
  setLens(0);
  updateLensFromScroll();

  const makeSequence = ({ rootSelector, sceneSelector, buttonSelector, count }) => {
    const root = document.querySelector(rootSelector);
    const scenes = [...document.querySelectorAll(sceneSelector)];
    const buttons = [...document.querySelectorAll(buttonSelector)];
    let current = -1;
    const set = index => {
      index = Math.max(0, Math.min(count - 1, index));
      if (index === current) return;
      current = index;
      scenes.forEach((scene, i) => {
        scene.classList.toggle('is-active', i === index);
        const video = scene.querySelector('video');
        if (video) i === index ? play(video) : stop(video);
      });
      buttons.forEach((button, i) => {
        button.classList.toggle('is-active', i === index);
        if (i === index) button.setAttribute('aria-current', 'step');
        else button.removeAttribute('aria-current');
      });
    };
    const update = () => {
      if (!root || innerWidth <= 900) return;
      const rect = root.getBoundingClientRect();
      const distance = Math.max(1, root.offsetHeight - innerHeight);
      set(Math.round(Math.max(0, Math.min(1, -rect.top / distance)) * (count - 1)));
    };
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      if (!root) return;
      const y = scrollY + root.getBoundingClientRect().top + (root.offsetHeight - innerHeight) * (index / (count - 1));
      scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
    }));
    addEventListener('scroll', update, { passive: true });
    addEventListener('resize', update);
    set(0);
    update();
  };
  makeSequence({ rootSelector: '.work-scroll', sceneSelector: '[data-work-scene]', buttonSelector: '[data-work-button]', count: 3 });
})();
