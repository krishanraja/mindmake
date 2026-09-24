const film = document.querySelector('#world-film');
const filmToggle = document.querySelector('#film-toggle');
const arrival = document.querySelector('.arrival');
const plateBody = document.querySelector('.plate-body');
const proofRail = document.querySelector('.proof-rail');
const proofglass = document.querySelector('.proofglass');
const traceButtons = [...document.querySelectorAll('.trace-trigger')];
const traces = [...document.querySelectorAll('.trace')];
const startHere = document.querySelector('#start-here');
const preflight = document.querySelector('#preflight');
const decisionInput = document.querySelector('#decision');
const decisionError = document.querySelector('#decision-error');
const frameAction = document.querySelector('.frame-action');
const copyFrame = document.querySelector('.copy-frame');
const inputStep = document.querySelector('[data-preflight-step="input"]');
const resultStep = document.querySelector('[data-preflight-step="result"]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const saveData = Boolean(navigator.connection?.saveData);
const filmSource = '../../../src/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4';

let activeTrace = 0;
let pausedByUser = false;
let arrivalVisible = true;
let filmReady = false;
let returnFocus = null;

const constrained = () => reducedMotion.matches || saveData || document.documentElement.dataset.textScale === '200';

const syncGlassState = () => {
  if (!proofglass || activeTrace < 0) return;
  const record = activeTrace + 1;
  proofglass.setAttribute('aria-valuenow', String(record));
  proofglass.setAttribute('aria-valuetext', `Record ${record} of ${traces.length}`);
  const readout = proofglass.querySelector('span');
  if (readout) readout.textContent = String(record).padStart(2, '0');
};

const syncLens = () => {
  if (!plateBody || !traces[activeTrace]) return;
  const plateBox = plateBody.getBoundingClientRect();
  const traceBox = traces[activeTrace].getBoundingClientRect();
  plateBody.style.setProperty('--glass-y', `${traceBox.top - plateBox.top + traceBox.height / 2}px`);
};

const activateTrace = (index, { focus = false, toggle = false } = {}) => {
  const next = Math.max(0, Math.min(traces.length - 1, index));
  const collapse = toggle && activeTrace === next && traceButtons[next].getAttribute('aria-expanded') === 'true';
  activeTrace = collapse ? -1 : next;
  traces.forEach((trace, traceIndex) => {
    const active = traceIndex === activeTrace;
    trace.classList.toggle('is-active', active);
    const button = trace.querySelector('.trace-trigger');
    const detail = trace.querySelector('.trace-detail');
    button.setAttribute('aria-expanded', String(active));
    detail.hidden = !active;
  });
  plateBody.dataset.selection = activeTrace < 0 ? 'none' : 'active';
  syncGlassState();
  if (focus && activeTrace >= 0) traceButtons[activeTrace].focus();
  sessionStorage.setItem('mindmake-proofglass-trace', String(activeTrace));
  requestAnimationFrame(syncLens);
  window.setTimeout(syncLens, 440);
};

traceButtons.forEach((button, index) => {
  button.addEventListener('click', () => activateTrace(index, { toggle: true }));
  button.addEventListener('keydown', (event) => {
    const keys = { ArrowDown: index + 1, ArrowRight: index + 1, ArrowUp: index - 1, ArrowLeft: index - 1, Home: 0, End: traces.length - 1 };
    if (!(event.key in keys)) return;
    event.preventDefault();
    activateTrace(keys[event.key], { focus: true });
  });
});

let draggingGlass = false;
let glassMoved = false;
let dragCentres = [];

const nearestTraceAt = clientY => {
  if (!traces.length) return 0;
  const centres = dragCentres.length ? dragCentres : traces.map(trace => {
    const box = trace.getBoundingClientRect();
    return box.top + box.height / 2;
  });
  return centres.reduce((nearest, centre, index) => {
    const distance = Math.abs(clientY - centre);
    return distance < nearest.distance ? { index, distance } : nearest;
  }, { index: 0, distance: Number.POSITIVE_INFINITY }).index;
};

const inspectAt = clientY => activateTrace(nearestTraceAt(clientY));

proofRail?.addEventListener('pointerdown', event => {
  if (event.button !== 0) return;
  draggingGlass = true;
  glassMoved = false;
  plateBody.dataset.dragging = 'true';
  dragCentres = traces.map(trace => {
    const box = trace.getBoundingClientRect();
    return box.top + box.height / 2;
  });
  proofglass?.setPointerCapture?.(event.pointerId);
  inspectAt(event.clientY);
  event.preventDefault();
});

proofRail?.addEventListener('pointermove', event => {
  if (!draggingGlass) return;
  glassMoved = true;
  inspectAt(event.clientY);
  event.preventDefault();
});

const finishGlassDrag = event => {
  if (!draggingGlass) return;
  inspectAt(event.clientY);
  draggingGlass = false;
  dragCentres = [];
  delete plateBody.dataset.dragging;
  proofglass?.releasePointerCapture?.(event.pointerId);
  proofglass?.focus({ preventScroll: true });
};

proofRail?.addEventListener('pointerup', finishGlassDrag);
proofRail?.addEventListener('pointercancel', finishGlassDrag);

proofglass?.addEventListener('click', event => {
  if (glassMoved) event.preventDefault();
  glassMoved = false;
  if (activeTrace < 0) activateTrace(0);
});

proofglass?.addEventListener('keydown', event => {
  const current = activeTrace < 0 ? 0 : activeTrace;
  const keys = { ArrowDown: current + 1, ArrowRight: current + 1, ArrowUp: current - 1, ArrowLeft: current - 1, Home: 0, End: traces.length - 1, PageDown: current + 1, PageUp: current - 1 };
  if (!(event.key in keys)) return;
  event.preventDefault();
  activateTrace(keys[event.key]);
});

const syncFilmControl = () => {
  filmToggle.hidden = constrained() || !filmReady || !arrivalVisible || Boolean(film?.error);
  filmToggle.textContent = pausedByUser ? 'Play film' : 'Pause film';
  filmToggle.setAttribute('aria-pressed', String(pausedByUser));
};

const attachFilm = async () => {
  if (!film || constrained()) {
    film?.pause();
    film?.removeAttribute('src');
    film?.load();
    filmReady = false;
    syncFilmControl();
    return;
  }
  if (film.getAttribute('src') !== filmSource) {
    film.src = filmSource;
    film.load();
  }
  if (!pausedByUser && !document.hidden && arrivalVisible) await film.play().catch(() => {});
};

film?.addEventListener('canplay', () => {
  filmReady = true;
  syncFilmControl();
});
film?.addEventListener('error', () => {
  filmReady = false;
  film.pause();
  film.removeAttribute('src');
  syncFilmControl();
});
filmToggle?.addEventListener('click', async () => {
  pausedByUser = !pausedByUser;
  if (pausedByUser) film.pause();
  else await film.play().catch(() => {});
  syncFilmControl();
});

const arrivalObserver = new IntersectionObserver(([entry]) => {
  arrivalVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio > 0.02);
  if (!arrivalVisible) film?.pause();
  else if (!document.hidden && !pausedByUser && !constrained()) film?.play().catch(() => {});
  syncFilmControl();
}, { threshold: [0, 0.02] });
arrivalObserver.observe(arrival);

document.addEventListener('visibilitychange', () => {
  if (document.hidden) film?.pause();
  else if (arrivalVisible && !pausedByUser && !constrained()) film?.play().catch(() => {});
});
reducedMotion.addEventListener?.('change', attachFilm);

const resetPreflight = () => {
  inputStep.hidden = false;
  resultStep.hidden = true;
  decisionError.hidden = true;
  copyFrame.textContent = 'Copy this frame';
  const saved = sessionStorage.getItem('mindmake-proofglass-decision');
  if (saved) decisionInput.value = saved;
};

startHere?.addEventListener('click', (event) => {
  if (!preflight?.showModal) return;
  event.preventDefault();
  returnFocus = event.currentTarget;
  resetPreflight();
  preflight.showModal();
  window.setTimeout(() => decisionInput.focus(), 0);
});

preflight?.addEventListener('close', () => {
  returnFocus?.focus();
});
preflight?.addEventListener('click', (event) => {
  if (event.target !== preflight) return;
  const box = preflight.getBoundingClientRect();
  const inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
  if (!inside) preflight.close();
});

const frames = [
  {
    test: /build.{0,24}partner|partner.{0,24}build|decision|govern|approve/i,
    subject: 'Your decision system',
    decision: 'Write the decision boundary: what evidence changes the answer, and what must remain human judgement.',
    step: 'Replay the last consequential decision using one shared evidence record and the same explicit standard.',
    success: 'The next decision begins from the recorded reasoning instead of restarting the argument.',
  },
  {
    test: /tool|vendor|stack|software|platform/i,
    subject: 'Your operating system',
    decision: 'Name the business capability that must survive. Judge every tool by that one job.',
    step: 'Place the current tools against the same real task, then keep only the smallest set that completes it.',
    success: 'A working path is live with a named owner, and the redundant tools can stop without losing the capability.',
  },
  {
    test: /publish|content|article|research|post|media|newsletter/i,
    subject: 'Your publishing system',
    decision: 'Choose the one recurring publication worth making repeatable before adding more output.',
    step: 'Take the last finished piece through the current process. Mark every hand-off, repeated search and rewrite.',
    success: 'The same team can produce the next piece from one recorded standard with fewer hand-offs.',
  },
  {
    test: /sell|sales|offer|market|buyer|pipeline|gtm|go.to.market|commercial/i,
    subject: 'Your commercial system',
    decision: 'Choose the single buyer decision your offer must make easier before adding more activity.',
    step: 'Put the current promise, one live objection and one piece of customer evidence into the same working view.',
    success: 'The team can make the same next move from evidence without reopening the offer each time.',
  },
];

const defaultFrame = {
  subject: 'Your next useful system',
  decision: 'Name the single decision or capability that is costly to keep reopening.',
  step: 'Run one piece of real work through the current process and record the judgement, evidence and repeated effort.',
  success: 'The next person can repeat the useful part without losing the standard that made it work.',
};

const renderFrame = () => {
  const value = decisionInput.value.trim();
  if (value.length < 8) {
    decisionError.hidden = false;
    decisionInput.setAttribute('aria-invalid', 'true');
    decisionInput.focus();
    return;
  }
  decisionError.hidden = true;
  decisionInput.removeAttribute('aria-invalid');
  sessionStorage.setItem('mindmake-proofglass-decision', value);
  copyFrame.textContent = 'Copy this frame';
  const selected = frames.find((frame) => frame.test.test(value)) || defaultFrame;
  document.querySelector('#result-subject').textContent = selected.subject;
  document.querySelector('#result-decision').textContent = selected.decision;
  document.querySelector('#result-step').textContent = selected.step;
  document.querySelector('#result-success').textContent = selected.success;
  inputStep.hidden = true;
  resultStep.hidden = false;
  resultStep.querySelector('h2').focus();
};

frameAction?.addEventListener('click', renderFrame);
decisionInput?.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') renderFrame();
});
decisionInput?.addEventListener('input', () => {
  if (!decisionError.hidden) decisionError.hidden = true;
  decisionInput.removeAttribute('aria-invalid');
  copyFrame.textContent = 'Copy this frame';
  sessionStorage.setItem('mindmake-proofglass-decision', decisionInput.value);
});

copyFrame?.addEventListener('click', async () => {
  const text = [...resultStep.querySelectorAll('dt,dd')].map((node) => node.textContent.trim()).join('\n');
  try {
    await navigator.clipboard.writeText(text);
    copyFrame.textContent = 'Copied';
  } catch {
    copyFrame.textContent = 'Select the text above';
  }
});

const savedTrace = Number(sessionStorage.getItem('mindmake-proofglass-trace'));
activateTrace(Number.isInteger(savedTrace) && savedTrace >= 0 && savedTrace < traces.length ? savedTrace : 0);
window.addEventListener('resize', syncLens);
attachFilm();
