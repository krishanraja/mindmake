(() => {
  const stage = document.querySelector('.stage');
  const instrument = document.querySelector('.instrument');
  const video = document.querySelector('.film video');
  const film = document.querySelector('.film');
  const leaves = [...document.querySelectorAll('.leaf')];
  const leafNumber = document.querySelector('[data-leaf-number]');
  const primary = document.querySelector('[data-primary]');
  const previous = document.querySelector('[data-prev-leaf]');
  const live = document.querySelector('[data-live]');
  const timePanel = document.querySelector('.time-panel');
  const keepPanel = document.querySelector('.keep-panel');
  const foldedCover = document.querySelector('.folded-cover');
  const timeShort = document.querySelector('[data-time-short]');
  const timeValue = document.querySelector('[data-time-value]');
  const timePreview = document.querySelector('[data-time-preview]');
  const restoreTime = document.querySelector('[data-restore-time]');
  const coverState = document.querySelector('[data-cover-state]');
  const params = new URLSearchParams(window.location.search);
  const instance = params.get('instance') || 'standalone';
  const storageKey = `mindmake-start-here-interaction-s3:${instance}`;
  const source = '../../../src/assets/films/sep2026/opportunities-resolve-loop-r01-20s-720p-web-sealed.mp4';
  const compact = window.matchMedia('(max-width: 820px), (max-width: 920px) and (orientation: landscape) and (max-height: 500px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection && navigator.connection.saveData);

  const times = {
    'Grow this business': {
      short: 'Grow',
      value: 'Protect that time for product, buyers and the few decisions that can change growth.',
    },
    'Help more companies': {
      short: 'Help',
      value: 'Use the same judgement across more companies without lowering the quality of the work.',
    },
    'Build my AI skill': {
      short: 'Learn',
      value: 'Test better ways of working until you can improve the system yourself.',
    },
    'Make room for important decisions': {
      short: 'Decide',
      value: 'Move preparation and routine checks out of the day, then protect time for decisions only you can make.',
    },
  };

  const initial = {
    activeLeaf: 0,
    time: 'Grow this business',
    previousTime: null,
    folded: false,
  };

  let state = { ...initial };
  let returnFocus = null;
  let touchStartX = null;

  if (params.get('fresh') === '1') {
    try { sessionStorage.removeItem(storageKey); } catch { /* private mode */ }
  }

  try {
    const saved = JSON.parse(sessionStorage.getItem(storageKey) || 'null');
    if (saved && Number.isInteger(saved.activeLeaf) && times[saved.time]) {
      state = {
        activeLeaf: Math.max(0, Math.min(3, saved.activeLeaf)),
        time: saved.time,
        previousTime: times[saved.previousTime] ? saved.previousTime : null,
        folded: Boolean(saved.folded),
      };
    }
  } catch {
    state = { ...initial };
  }

  const persist = () => {
    try { sessionStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* private mode */ }
  };

  const announce = (message) => {
    live.textContent = '';
    window.requestAnimationFrame(() => { live.textContent = message; });
  };

  const stopFilm = (status = 'poster') => {
    video.pause();
    film.dataset.filmState = status;
  };

  const startFilm = async () => {
    if (reduced.matches || saveData || document.hidden || state.folded) return stopFilm();
    if (!video.src) {
      video.src = source;
      video.load();
    }
    try {
      await video.play();
      film.dataset.filmState = 'playing';
    } catch {
      stopFilm();
    }
  };

  const updateLeaves = ({ focus = false } = {}) => {
    leaves.forEach((leaf, index) => {
      const active = index === state.activeLeaf;
      leaf.classList.toggle('is-active', active);
      leaf.classList.toggle('is-before', index < state.activeLeaf);
      leaf.setAttribute('aria-current', active ? 'step' : 'false');
    });
    leafNumber.textContent = String(state.activeLeaf + 1);
    previous.hidden = state.activeLeaf === 0;
    if (compact.matches) {
      primary.firstChild.textContent = state.activeLeaf === 3 ? 'Keep the private brief ' : 'Next leaf ';
    } else {
      primary.firstChild.textContent = 'Keep the private brief ';
    }
    coverState.textContent = `${leaves[state.activeLeaf].querySelector('small').textContent} · ${state.activeLeaf + 1} of 4`;
    persist();
    if (focus) leaves[state.activeLeaf].focus({ preventScroll: true });
  };

  const updateTime = ({ animate = false } = {}) => {
    const detail = times[state.time];
    timeShort.textContent = detail.short;
    timeValue.textContent = detail.value;
    timePreview.textContent = detail.value;
    restoreTime.hidden = !state.previousTime;
    if (state.previousTime) restoreTime.textContent = `Restore ${times[state.previousTime].short}`;
    document.querySelectorAll('input[name="time"]').forEach((input) => { input.checked = input.value === state.time; });
    if (animate && !reduced.matches) {
      instrument.classList.remove('is-time-changing');
      void instrument.offsetWidth;
      instrument.classList.add('is-time-changing');
      window.setTimeout(() => instrument.classList.remove('is-time-changing'), 900);
    }
    persist();
  };

  const focusable = (panel) => [...panel.querySelectorAll('button:not([disabled]), input:not([disabled])')].filter((element) => !element.hidden);

  const openPanel = (panel, trigger) => {
    returnFocus = trigger || document.activeElement;
    panel.hidden = false;
    instrument.setAttribute('inert', '');
    document.querySelector('.topbar').setAttribute('inert', '');
    const candidates = focusable(panel);
    (panel.querySelector('input:checked') || candidates[0])?.focus();
  };

  const closePanel = (panel) => {
    panel.hidden = true;
    instrument.removeAttribute('inert');
    document.querySelector('.topbar').removeAttribute('inert');
    returnFocus?.focus({ preventScroll: true });
    returnFocus = null;
  };

  const trapPanel = (panel, event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closePanel(panel);
      return;
    }
    if (event.key !== 'Tab') return;
    const candidates = focusable(panel);
    if (!candidates.length) return;
    const first = candidates[0];
    const last = candidates[candidates.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  leaves.forEach((leaf, index) => {
    leaf.addEventListener('click', () => {
      state.activeLeaf = index;
      updateLeaves();
    });
    leaf.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') state.activeLeaf = 0;
      if (event.key === 'End') state.activeLeaf = 3;
      if (event.key === 'ArrowLeft') state.activeLeaf = Math.max(0, state.activeLeaf - 1);
      if (event.key === 'ArrowRight') state.activeLeaf = Math.min(3, state.activeLeaf + 1);
      updateLeaves({ focus: true });
    });
  });

  document.querySelector('.leaves').addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX ?? null;
  }, { passive: true });

  document.querySelector('.leaves').addEventListener('touchend', (event) => {
    if (touchStartX === null) return;
    const delta = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
    touchStartX = null;
    if (Math.abs(delta) < 48) return;
    state.activeLeaf = delta < 0 ? Math.min(3, state.activeLeaf + 1) : Math.max(0, state.activeLeaf - 1);
    updateLeaves();
  }, { passive: true });

  primary.addEventListener('click', () => {
    if (compact.matches && state.activeLeaf < 3) {
      state.activeLeaf += 1;
      updateLeaves({ focus: true });
      announce(`${leaves[state.activeLeaf].querySelector('small').textContent}, ${state.activeLeaf + 1} of 4.`);
      return;
    }
    openPanel(keepPanel, primary);
  });

  previous.addEventListener('click', () => {
    state.activeLeaf = Math.max(0, state.activeLeaf - 1);
    updateLeaves({ focus: true });
  });

  document.querySelector('[data-open-time]').addEventListener('click', (event) => openPanel(timePanel, event.currentTarget));
  document.querySelectorAll('[data-cancel-time]').forEach((button) => button.addEventListener('click', () => closePanel(timePanel)));
  document.querySelectorAll('input[name="time"]').forEach((input) => {
    input.addEventListener('change', () => { timePreview.textContent = times[input.value].value; });
  });
  document.querySelector('[data-commit-time]').addEventListener('click', () => {
    const selected = document.querySelector('input[name="time"]:checked').value;
    const changed = selected !== state.time;
    if (changed) {
      state.previousTime = state.time;
      state.time = selected;
      updateTime({ animate: true });
    }
    closePanel(timePanel);
    announce(changed ? `Time changed to ${selected}. The four guidance leaves are unchanged.` : 'Time kept.');
  });

  restoreTime.addEventListener('click', () => {
    if (!state.previousTime) return;
    const current = state.time;
    state.time = state.previousTime;
    state.previousTime = current;
    updateTime({ animate: true });
    announce(`Time restored to ${state.time}. The four guidance leaves are unchanged.`);
  });

  document.querySelector('[data-cancel-keep]').addEventListener('click', () => closePanel(keepPanel));
  document.querySelector('[data-continue]').addEventListener('click', () => {
    closePanel(keepPanel);
    announce('Email verification would be next. Nothing has been sent.');
  });

  document.querySelector('.close').addEventListener('click', () => {
    state.folded = true;
    persist();
    instrument.hidden = true;
    foldedCover.hidden = false;
    stopFilm();
    document.querySelector('[data-reopen]').focus();
  });

  document.querySelector('[data-reopen]').addEventListener('click', () => {
    state.folded = false;
    persist();
    foldedCover.hidden = true;
    instrument.hidden = false;
    updateLeaves();
    leaves[state.activeLeaf].focus({ preventScroll: true });
    void startFilm();
  });

  timePanel.addEventListener('keydown', (event) => trapPanel(timePanel, event));
  keepPanel.addEventListener('keydown', (event) => trapPanel(keepPanel, event));
  document.addEventListener('visibilitychange', () => document.hidden ? stopFilm() : void startFilm());
  reduced.addEventListener?.('change', () => reduced.matches ? stopFilm() : void startFilm());
  compact.addEventListener?.('change', () => updateLeaves());
  video.addEventListener('error', () => {
    video.removeAttribute('src');
    stopFilm('unavailable');
  });
  video.addEventListener('playing', () => { film.dataset.filmState = 'playing'; });

  foldedCover.hidden = !state.folded;
  instrument.hidden = state.folded;
  updateLeaves();
  updateTime();
  if (!state.folded) void startFilm();
})();
