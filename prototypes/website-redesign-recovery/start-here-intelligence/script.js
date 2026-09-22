(() => {
  const video = document.querySelector('.resolution-film video');
  const film = document.querySelector('.resolution-film');
  const result = document.querySelector('[data-screen="result"]');
  const capacity = document.querySelector('[data-screen="capacity"]');
  const stage = document.querySelector('.stage');
  const drawer = document.querySelector('.drawer');
  const pageContext = document.querySelector('.page-context');
  const close = document.querySelector('.close');
  const reopen = document.querySelector('.page-start');
  const keep = document.querySelector('[data-keep]');
  const actionStatus = document.querySelector('.action-status');
  const source = '../../../src/assets/films/sep2026/opportunities-resolve-loop-r01-20s-720p-web-sealed.mp4';
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  const stop = () => {
    video.pause();
    film.dataset.filmState = 'poster';
  };

  const start = async () => {
    if (reduced || saveData || document.hidden || !result.classList.contains('active')) return stop();
    if (!video.src) {
      video.src = source;
      video.load();
    }
    try {
      await video.play();
      film.dataset.filmState = 'playing';
    } catch {
      film.dataset.filmState = 'poster';
    }
  };

  video.addEventListener('error', () => {
    video.removeAttribute('src');
    film.dataset.filmState = 'unavailable';
  });
  video.addEventListener('playing', () => { film.dataset.filmState = 'playing'; });
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : void start());

  const show = (name) => {
    const showResult = name === 'result';
    result.classList.toggle('active', showResult);
    capacity.classList.toggle('active', !showResult);
    if (showResult) void start(); else stop();
  };

  document.querySelector('[data-back]').addEventListener('click', () => show('capacity'));
  document.querySelector('[data-show-result]').addEventListener('click', () => show('result'));
  document.querySelectorAll('.choice-list button').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.choice-list button').forEach((choice) => choice.setAttribute('aria-pressed', String(choice === button)));
    });
  });
  document.querySelector('[data-return]').addEventListener('click', () => show('result'));
  close.addEventListener('click', () => {
    stop();
    stage.classList.add('is-closed');
    drawer.setAttribute('aria-hidden', 'true');
    pageContext.removeAttribute('aria-hidden');
    pageContext.removeAttribute('inert');
    reopen.focus();
  });
  reopen.addEventListener('click', () => {
    stage.classList.remove('is-closed');
    drawer.removeAttribute('aria-hidden');
    pageContext.setAttribute('aria-hidden', 'true');
    pageContext.setAttribute('inert', '');
    close.focus();
    void start();
  });
  keep.addEventListener('click', () => {
    keep.dataset.kept = 'true';
    keep.innerHTML = 'Private brief selected <span aria-hidden="true">✓</span>';
    actionStatus.textContent = 'Next: verify your work email. Nothing has been sent.';
  });

  void start();
})();
