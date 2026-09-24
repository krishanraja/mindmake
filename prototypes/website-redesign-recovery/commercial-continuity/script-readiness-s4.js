const root = document.documentElement;
const instrument = document.querySelector('.balance-instrument');
const stage = document.querySelector('#proof-stage');
const stageButtons = [...document.querySelectorAll('[data-stage]')];
const readingCount = document.querySelector('.reading-count');
const readingTitle = document.querySelector('#reading-title');
const readingDetail = document.querySelector('#reading-detail');
const video = document.querySelector('#decision-film');
const arrivalVideo = document.querySelector('#arrival-film');
const start = document.querySelector('#start-here');
const dialog = document.querySelector('#decision-dialog');
const inputStep = dialog?.querySelector('[data-dialog-step="input"]');
const resultStep = dialog?.querySelector('[data-dialog-step="result"]');
const decisionInput = document.querySelector('#decision-input');
const decisionError = document.querySelector('#decision-error');
const frameAction = document.querySelector('.frame-action');
const resultHeading = resultStep?.querySelector('h2');
const resultDecision = document.querySelector('#result-decision');
const resultCarry = document.querySelector('#result-carry');
const resultHuman = document.querySelector('#result-human');
const resultVersion = document.querySelector('#result-version');
const resultProof = document.querySelector('#result-proof');
const changeDecision = document.querySelector('.change-decision');
const copyRecord = document.querySelector('.copy-record');

const readings = [
  ['One real decision.', 'Name the judgement or capability worth making easier to repeat.'],
  ['Evidence prepared.', 'Bring the relevant evidence, options and context into one reachable view.'],
  ['A working first version.', 'Build the smallest useful system around the live decision, not a demonstration.'],
  ['Used on real work.', 'Test it where the decision already matters and keep the human authority clear.'],
  ['The useful system stays.', 'You keep the system, its proof and the standards behind it.'],
];

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
let activeStage = 0;
let pointerOwned = false;

function setStage(next, { focus = false, source = 'direct' } = {}) {
  activeStage = clamp(Number(next) || 0, 0, readings.length - 1);
  const [title, detail] = readings[activeStage];
  const tilt = -4 + activeStage * 2;
  instrument?.style.setProperty('--stage', String(activeStage));
  instrument?.style.setProperty('--tilt', `${tilt}deg`);
  if (stage) {
    stage.value = String(activeStage);
    stage.setAttribute('aria-valuetext', `${title} ${detail}`);
  }
  if (readingCount) readingCount.textContent = `${String(activeStage + 1).padStart(2, '0')} / 05`;
  if (readingTitle) readingTitle.textContent = title;
  if (readingDetail) readingDetail.textContent = detail;
  stageButtons.forEach((button, index) => {
    const selected = index === activeStage;
    button.classList.toggle('is-active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  if (focus) stageButtons[activeStage]?.focus();
  try { sessionStorage.setItem('mindmake-decision-balance-stage', String(activeStage)); } catch { /* private mode */ }
  instrument?.setAttribute('data-stage-source', source);
}

stage?.addEventListener('input', () => setStage(stage.value, { source: 'range' }));
stage?.addEventListener('pointerdown', () => { pointerOwned = true; });
stage?.addEventListener('pointerup', () => { pointerOwned = false; });
stageButtons.forEach((button, index) => {
  button.addEventListener('click', () => setStage(index, { source: 'button' }));
  button.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Home') setStage(0, { focus: true, source: 'keyboard' });
    else if (event.key === 'End') setStage(4, { focus: true, source: 'keyboard' });
    else setStage(activeStage + (['ArrowRight','ArrowDown'].includes(event.key) ? 1 : -1), { focus: true, source: 'keyboard' });
  });
});

const mobileLayout = matchMedia('(max-width: 860px)');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');

function syncScrollReading() {
  if (mobileLayout.matches || pointerOwned || !instrument) return;
  const section = document.querySelector('.balance-stage');
  if (!section) return;
  const travel = section.offsetHeight - innerHeight;
  if (travel <= 0) return;
  const progress = clamp(scrollY / travel, 0, 1);
  setStage(Math.round(progress * 4), { source: 'scroll' });
}

let scrollFrame = 0;
addEventListener('scroll', () => {
  cancelAnimationFrame(scrollFrame);
  scrollFrame = requestAnimationFrame(syncScrollReading);
}, { passive: true });

function motionAllowed() {
  return !reducedMotion.matches && !navigator.connection?.saveData;
}

const filmSource = '/src/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4';
let filmObserver;
function configureFilm() {
  filmObserver?.disconnect();
  for (const film of [video, arrivalVideo]) {
    if (!film) continue;
    film.pause();
    film.removeAttribute('src');
    film.load();
  }
  if (!motionAllowed()) return;
  const film = mobileLayout.matches ? arrivalVideo : video;
  if (!film) return;
  film.src = filmSource;
  filmObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) film.play().catch(() => {});
    else film.pause();
  }, { threshold: .08 });
  filmObserver.observe(film);
  film.addEventListener('error', () => { film.removeAttribute('src'); film.load(); }, { once: true });
}
configureFilm();
mobileLayout.addEventListener?.('change', configureFilm);
reducedMotion.addEventListener?.('change', configureFilm);

function normaliseSubject(value) {
  return value.trim().replace(/\s+/g, ' ').replace(/[.!?]+$/, '');
}

function sentenceSubject(value) {
  const subject = normaliseSubject(value);
  if (!subject) return 'Your decision';
  return subject.charAt(0).toUpperCase() + subject.slice(1);
}

function frameFor(value) {
  const source = normaliseSubject(value);
  const lower = source.toLowerCase();
  if (/build|buy|partner|vendor|make or/.test(lower)) return {
    carry: 'Prepare the evidence and compare credible build, buy and hybrid paths against the same criteria.',
    human: 'Set the boundary, choose the route and record what would reverse the decision.',
    version: 'A working route-comparison instrument built around the real options.',
    proof: 'Use it on one live choice. It works when the team can defend the route and its reversal condition.'
  };
  if (/hire|role|team|people|automate|agent/.test(lower)) return {
    carry: 'Map the repeated work and compare human, system and hybrid boundaries.',
    human: 'Choose where judgement, trust and final authority must remain human.',
    version: 'A working responsibility map tested on one real workflow.',
    proof: 'Use the same live case across all three boundaries. It works when the necessary human intervention is clear.'
  };
  if (/price|pricing|offer|position|customer|buyer|sales|market|gtm|go.to.market/.test(lower)) return {
    carry: 'Bring product changes, buyer language, evidence and live objections into one view.',
    human: 'Choose the promise, commercial call and proof you can stand behind.',
    version: 'A working commercial instrument built around one live offer.',
    proof: 'Put it in front of real buyers. It works when the objections become specific enough to act on.'
  };
  if (/publish|content|brief|research|write|voice/.test(lower)) return {
    carry: 'Gather the source material, organise the evidence and prepare a repeatable first pass.',
    human: 'Choose the claim, hold the voice and make the final call to publish.',
    version: 'A working evidence-to-draft system used on the next real piece.',
    proof: 'Run the last finished piece and the next one through the same record. It works when the second needs fewer hand-offs without lowering the standard.'
  };
  return {
    carry: 'Prepare the relevant evidence, options and repeatable middle of the work.',
    human: 'Keep the judgement, approval and standard that make the decision yours.',
    version: 'A working first version built around the next real instance.',
    proof: 'Use it on the next live case. It works when the useful part becomes easier to repeat without losing the judgement.'
  };
}

function showInput({ focus = true } = {}) {
  inputStep.hidden = false;
  resultStep.hidden = true;
  decisionError.hidden = true;
  if (focus) requestAnimationFrame(() => decisionInput?.focus());
}

function showResult(value, { focus = true } = {}) {
  const subject = sentenceSubject(value);
  const frame = frameFor(value);
  resultDecision.textContent = subject;
  resultCarry.textContent = frame.carry;
  resultHuman.textContent = frame.human;
  resultVersion.textContent = frame.version;
  resultProof.textContent = frame.proof;
  inputStep.hidden = true;
  resultStep.hidden = false;
  if (focus) requestAnimationFrame(() => resultHeading?.focus());
  try {
    sessionStorage.setItem('mindmake-decision-balance-input', value);
    sessionStorage.setItem('mindmake-decision-balance-complete', 'true');
  } catch { /* private mode */ }
}

function openDialog(event) {
  event?.preventDefault();
  if (!dialog) return;
  const saved = sessionStorage.getItem('mindmake-decision-balance-input') || '';
  const complete = sessionStorage.getItem('mindmake-decision-balance-complete') === 'true';
  decisionInput.value = saved;
  if (complete && saved) showResult(saved, { focus: false });
  else showInput({ focus: false });
  dialog.showModal();
  const target = complete && saved ? resultHeading : decisionInput;
  target?.focus({ preventScroll: true });
  requestAnimationFrame(() => target?.focus({ preventScroll: true }));
  setTimeout(() => {
    if (dialog.open && (document.activeElement === document.body || document.activeElement === dialog || document.activeElement?.classList.contains('close-dialog'))) {
      target?.focus({ preventScroll: true });
    }
  }, 40);
}

start?.addEventListener('click', openDialog);
dialog?.addEventListener('close', () => start?.focus());
dialog?.addEventListener('cancel', () => { requestAnimationFrame(() => start?.focus()); });

decisionInput?.addEventListener('input', () => {
  decisionError.hidden = true;
  try {
    sessionStorage.setItem('mindmake-decision-balance-input', decisionInput.value);
    sessionStorage.removeItem('mindmake-decision-balance-complete');
  } catch { /* private mode */ }
});

frameAction?.addEventListener('click', () => {
  const value = normaliseSubject(decisionInput.value);
  if (!value) {
    decisionError.hidden = false;
    decisionInput.focus();
    return;
  }
  showResult(value);
});

changeDecision?.addEventListener('click', () => {
  try { sessionStorage.removeItem('mindmake-decision-balance-complete'); } catch { /* private mode */ }
  showInput();
});

copyRecord?.addEventListener('click', async () => {
  const text = [
    'Mindmake first decision record',
    `Decision: ${resultDecision.textContent}`,
    `AI can carry: ${resultCarry.textContent}`,
    `You keep: ${resultHuman.textContent}`,
    `First version: ${resultVersion.textContent}`,
    `First proof: ${resultProof.textContent}`,
    'Handback: The working system, this record and the standards behind it.',
    'Scope, duration and fee are agreed privately in writing before work starts.'
  ].join('\n');
  try {
    await navigator.clipboard.writeText(text);
    copyRecord.textContent = 'Record copied';
  } catch {
    copyRecord.textContent = 'Select and copy the record';
  }
});

dialog?.addEventListener('keydown', (event) => {
  if (event.key !== 'Tab') return;
  const focusable = [...dialog.querySelectorAll('button:not([disabled]),a[href],textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter(node => !node.closest('[hidden]'));
  if (!focusable.length) return;
  const index = focusable.indexOf(document.activeElement);
  const next = (index + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
  event.preventDefault();
  focusable[next].focus();
});

try {
  const savedStage = Number.parseInt(sessionStorage.getItem('mindmake-decision-balance-stage') || '0', 10);
  setStage(savedStage, { source: 'restore' });
} catch { setStage(0, { source: 'initial' }); }

root.dataset.decisionBalanceReady = 'true';
