(() => {
  const videos = [...document.querySelectorAll('video')];
  const toggle = document.querySelector('.motion-toggle');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigator.connection?.saveData === true;
  let paused = reduced || saveData;
  const syncToggle = () => { toggle?.setAttribute('aria-pressed', String(paused)); const label = toggle?.querySelector('span'); if (label) label.textContent = paused ? 'Play motion' : 'Pause motion'; };
  const play = video => { if (!paused) video.play().catch(() => {}); };
  const stop = video => video.pause();
  syncToggle();
  toggle?.addEventListener('click', () => { paused = !paused; syncToggle(); videos.forEach(video => paused ? stop(video) : (video.getBoundingClientRect().top < innerHeight && video.getBoundingClientRect().bottom > 0 ? play(video) : stop(video))); });
  const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting ? play(entry.target) : stop(entry.target)), { threshold: .18 });
  videos.forEach(video => observer.observe(video));

  const makeSequence = ({rootSelector, sceneSelector, buttonSelector, count}) => {
    const root = document.querySelector(rootSelector); const scenes = [...document.querySelectorAll(sceneSelector)]; const buttons = [...document.querySelectorAll(buttonSelector)]; let current = -1;
    const set = index => { index = Math.max(0, Math.min(count - 1, index)); if (index === current) return; current = index; scenes.forEach((scene, i) => { scene.classList.toggle('is-active', i === index); const video = scene.querySelector('video'); if (video) i === index ? play(video) : stop(video); }); buttons.forEach((button, i) => { button.classList.toggle('is-active', i === index); if (i === index) button.setAttribute('aria-current','step'); else button.removeAttribute('aria-current'); }); };
    const update = () => { if (!root || innerWidth <= 900) return; const rect = root.getBoundingClientRect(); const distance = Math.max(1, root.offsetHeight - innerHeight); set(Math.round(Math.max(0, Math.min(1, -rect.top / distance)) * (count - 1))); };
    buttons.forEach((button, index) => button.addEventListener('click', () => { if (!root) return; const y = scrollY + root.getBoundingClientRect().top + (root.offsetHeight - innerHeight) * (index / (count - 1)); scrollTo({top:y,behavior:reduced?'auto':'smooth'}); }));
    addEventListener('scroll', update, {passive:true}); addEventListener('resize', update); set(0); update();
  };
  makeSequence({rootSelector:'.history-scroll',sceneSelector:'[data-history-scene]',buttonSelector:'[data-history-button]',count:4});
  makeSequence({rootSelector:'.work-scroll',sceneSelector:'[data-work-scene]',buttonSelector:'[data-work-button]',count:3});
})();
