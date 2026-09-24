const root = document.documentElement;
const film = document.querySelector("#world-film");
const filmToggle = document.querySelector("#film-toggle");
const handoff = document.querySelector(".handoff");
const handoffStage = document.querySelector(".handoff-stage");
const recordSheet = document.querySelector(".record-sheet");
const records = [...document.querySelectorAll("[data-record]")];
const recordTriggers = [...document.querySelectorAll(".record-trigger")];
const mobileRecordSwitches = [...document.querySelectorAll("[data-record-jump]")];
const mobileRecordNav = document.querySelector(".mobile-record-switch");
const recordsContainer = document.querySelector(".records");
const rails = [...document.querySelectorAll(".reasoning-rail")];
const startHere = document.querySelector("#start-here");
const preflight = document.querySelector("#preflight");
const decisionInput = document.querySelector("#decision");
const decisionError = document.querySelector("#decision-error");
const frameAction = document.querySelector(".frame-action");
const changeDecision = document.querySelector(".change-decision");
const copyFrame = document.querySelector(".copy-frame");
const inputStep = document.querySelector('[data-preflight-step="input"]');
const resultStep = document.querySelector('[data-preflight-step="result"]');
const resultHeading = resultStep?.querySelector("h2");
const resultSubject = document.querySelector("#result-subject");
const resultStarting = document.querySelector("#result-starting");
const resultCarry = document.querySelector("#result-carry");
const resultHuman = document.querySelector("#result-human");
const resultProof = document.querySelector("#result-proof");

const filmSource = "../../../src/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
const stageNames = ["Starting point", "The call", "The system carried", "The leader kept", "Recorded change"];
const stagePositions = [10, 30, 50, 70, 90];
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)");
const largeText = matchMedia("(min-resolution: 1.99dppx)");
const compactLayout = matchMedia("(max-width: 860px)");
const saveData = Boolean(navigator.connection?.saveData);
let filmPausedByUser = false;
let scrollFrame = 0;
let activeRecord = Number.parseInt(sessionStorage.getItem("mindmake-proofglass-s3-record") || "0", 10);
let lastFocus = null;
let generatedDecision = "";

const clamp = (number, minimum, maximum) => Math.min(Math.max(number, minimum), maximum);

function focusReliably(node) {
  node?.focus?.({ preventScroll: true });
  requestAnimationFrame(() => node?.focus?.({ preventScroll: true }));
  setTimeout(() => node?.focus?.({ preventScroll: true }), 50);
}

function constrainedMotion() {
  return reduceMotion.matches || saveData || largeText.matches;
}

function syncFilmControl() {
  if (!filmToggle || !film) return;
  const hasFilm = Boolean(film.getAttribute("src"));
  filmToggle.hidden = !hasFilm;
  filmToggle.textContent = film.paused ? "Play film" : "Pause film";
  filmToggle.setAttribute("aria-pressed", String(film.paused));
}

function startFilm() {
  if (!film || constrainedMotion()) return;
  if (!film.getAttribute("src")) {
    film.setAttribute("src", filmSource);
    film.load();
  }
  if (!filmPausedByUser && !document.hidden && handoffStage?.getBoundingClientRect().bottom > 0) {
    film.play().catch(() => {});
  }
  syncFilmControl();
}

function stopMovingFilm() {
  if (!film) return;
  film.pause();
  film.removeAttribute("src");
  film.load();
  syncFilmControl();
}

function updateFilmState() {
  if (!film) return;
  if (constrainedMotion()) {
    stopMovingFilm();
    return;
  }
  startFilm();
}

filmToggle?.addEventListener("click", () => {
  if (!film) return;
  filmPausedByUser = !film.paused;
  if (film.paused) film.play().catch(() => {});
  else film.pause();
  syncFilmControl();
});

film?.addEventListener("play", syncFilmControl);
film?.addEventListener("pause", syncFilmControl);
film?.addEventListener("error", () => {
  film?.removeAttribute("src");
  syncFilmControl();
});

function updateHandoff() {
  scrollFrame = 0;
  if (!handoff || compactLayout.matches || reduceMotion.matches || largeText.matches) {
    handoffStage?.style.setProperty("--sheet-y", "0%");
    handoffStage?.style.setProperty("--sheet-x", "0%");
    handoffStage?.style.setProperty("--sheet-scale", "1");
    handoffStage?.style.setProperty("--copy-opacity", "1");
    return;
  }
  const rect = handoff.getBoundingClientRect();
  const travel = Math.max(handoff.offsetHeight - innerHeight, 1);
  const progress = clamp(-rect.top / travel, 0, 1);
  const sheetProgress = clamp(progress / 0.42, 0, 1);
  const reasoningProgress = clamp((progress - 0.42) / 0.58, 0, 1);
  handoffStage.style.setProperty("--sheet-y", `${(1 - sheetProgress) * 74}%`);
  handoffStage.style.setProperty("--sheet-x", "0%");
  handoffStage.style.setProperty("--sheet-scale", "1");
  handoffStage.style.setProperty("--copy-opacity", String(1 - sheetProgress * 0.38));
  if (progress >= 0.42) activateStage(records[activeRecord]?.querySelector(".reasoning-rail"), Math.round(reasoningProgress * 4));
  else activateStage(records[activeRecord]?.querySelector(".reasoning-rail"), 0);
}

function requestHandoffUpdate() {
  if (scrollFrame) return;
  scrollFrame = requestAnimationFrame(updateHandoff);
}

addEventListener("scroll", requestHandoffUpdate, { passive: true });
addEventListener("resize", requestHandoffUpdate, { passive: true });

function activateRecord(index, moveFocus = false) {
  activeRecord = clamp(index, 0, records.length - 1);
  sessionStorage.setItem("mindmake-proofglass-s3-record", String(activeRecord));

  records.forEach((record, recordIndex) => {
    const active = recordIndex === activeRecord;
    const body = record.querySelector(".record-body");
    const trigger = record.querySelector(".record-trigger");
    record.classList.toggle("is-active", active);
    trigger?.setAttribute("aria-expanded", String(active));
    if (body) body.hidden = !active;
  });

  syncRecordSemantics();

  if (moveFocus) {
    const focusTarget = compactLayout.matches ? mobileRecordSwitches[activeRecord] : recordTriggers[activeRecord];
    focusTarget?.focus({ preventScroll: true });
  }
}

function syncRecordSemantics() {
  const tabMode = compactLayout.matches;
  if (tabMode) {
    mobileRecordNav?.setAttribute("role", "tablist");
    recordsContainer?.removeAttribute("role");
  } else {
    mobileRecordNav?.removeAttribute("role");
    recordsContainer?.setAttribute("role", "list");
  }
  mobileRecordSwitches.forEach((button, index) => {
    const selected = index === activeRecord;
    if (tabMode) {
      button.setAttribute("role", "tab");
      button.setAttribute("aria-selected", String(selected));
      button.removeAttribute("aria-pressed");
    } else {
      button.removeAttribute("role");
      button.removeAttribute("aria-selected");
      button.setAttribute("aria-pressed", String(selected));
    }
  });
  records.forEach((record, index) => {
    if (tabMode) {
      record.setAttribute("role", "tabpanel");
      record.setAttribute("aria-hidden", String(index !== activeRecord));
    } else {
      record.setAttribute("role", "listitem");
      record.removeAttribute("aria-hidden");
    }
  });
}

recordTriggers.forEach((trigger, index) => {
  trigger.addEventListener("click", () => activateRecord(index));
  trigger.addEventListener("keydown", (event) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") activateRecord(0, true);
    else if (event.key === "End") activateRecord(records.length - 1, true);
    else activateRecord((index + (event.key === "ArrowDown" ? 1 : -1) + records.length) % records.length, true);
  });
});

mobileRecordSwitches.forEach((button, index) => {
  button.addEventListener("click", () => activateRecord(index));
  button.addEventListener("keydown", (event) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") activateRecord(0, true);
    else if (event.key === "End") activateRecord(records.length - 1, true);
    else activateRecord((index + (event.key === "ArrowRight" ? 1 : -1) + records.length) % records.length, true);
  });
});

function activateStage(rail, stageIndex, moveFocus = false) {
  if (!rail) return;
  const recordIndex = Number(rail.closest("[data-record]")?.dataset.record || 0);
  const index = clamp(stageIndex, 0, stageNames.length - 1);
  const tabs = [...rail.querySelectorAll('[role="tab"]')];
  const glass = rail.querySelector(".proofglass");

  rail.dataset.stageIndex = String(index);
  rail.style.setProperty("--stage-x", `${stagePositions[index]}%`);
  tabs.forEach((tab, tabIndex) => {
    const selected = tabIndex === index;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  glass?.setAttribute("aria-valuenow", String(index + 1));
  glass?.setAttribute("aria-valuetext", stageNames[index]);
  const number = glass?.querySelector("span");
  if (number) number.textContent = String(index + 1).padStart(2, "0");
  sessionStorage.setItem(`mindmake-proofglass-s3-stage-${recordIndex}`, String(index));
  if (moveFocus) tabs[index]?.focus({ preventScroll: true });
}

function stageFromPointer(rail, clientX) {
  const grid = rail.querySelector(".stage-grid");
  if (!grid) return 0;
  const bounds = grid.getBoundingClientRect();
  const usableLeft = bounds.left + bounds.width * 0.1;
  const usableRight = bounds.left + bounds.width * 0.9;
  const ratio = clamp((clientX - usableLeft) / Math.max(usableRight - usableLeft, 1), 0, 1);
  return Math.round(ratio * 4);
}

rails.forEach((rail) => {
  const recordIndex = Number(rail.closest("[data-record]")?.dataset.record || 0);
  const savedStage = Number.parseInt(sessionStorage.getItem(`mindmake-proofglass-s3-stage-${recordIndex}`) || "0", 10);
  const tabs = [...rail.querySelectorAll('[role="tab"]')];
  const glass = rail.querySelector(".proofglass");

  activateStage(rail, savedStage);

  tabs.forEach((tab, tabIndex) => {
    const stageMeaning = tab.querySelector("span")?.textContent.trim() || "";
    tab.setAttribute("aria-label", `${stageNames[tabIndex]}. ${stageMeaning}`);
    tab.addEventListener("click", () => activateStage(rail, tabIndex));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") activateStage(rail, 0, true);
      else if (event.key === "End") activateStage(rail, 4, true);
      else activateStage(rail, (tabIndex + (event.key === "ArrowRight" ? 1 : -1) + 5) % 5, true);
    });
  });

  glass?.addEventListener("keydown", (event) => {
    const current = Number(rail.dataset.stageIndex || 0);
    const keys = ["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"];
    if (!keys.includes(event.key)) return;
    event.preventDefault();
    if (event.key === "Home") activateStage(rail, 0);
    else if (event.key === "End") activateStage(rail, 4);
    else if (["ArrowRight", "ArrowUp", "PageUp"].includes(event.key)) activateStage(rail, current + 1);
    else activateStage(rail, current - 1);
  });

  glass?.addEventListener("pointerdown", (event) => {
    if (event.button !== 0 && event.pointerType !== "touch") return;
    glass.setPointerCapture(event.pointerId);
    rail.dataset.dragging = "true";
    activateStage(rail, stageFromPointer(rail, event.clientX));
  });
  glass?.addEventListener("pointermove", (event) => {
    if (!glass.hasPointerCapture(event.pointerId)) return;
    activateStage(rail, stageFromPointer(rail, event.clientX));
  });
  const finishDrag = (event) => {
    if (!glass.hasPointerCapture(event.pointerId)) return;
    activateStage(rail, stageFromPointer(rail, event.clientX));
    glass.releasePointerCapture(event.pointerId);
    delete rail.dataset.dragging;
  };
  glass?.addEventListener("pointerup", finishDrag);
  glass?.addEventListener("pointercancel", (event) => {
    if (glass.hasPointerCapture(event.pointerId)) glass.releasePointerCapture(event.pointerId);
    delete rail.dataset.dragging;
  });
});

const frames = {
  publishing: {
    pattern: /publish|content|research|editorial|article|post|newsletter|writing/i,
    carry: "Gather the source material, preserve the evidence trail and prepare the repeatable first draft.",
    human: "Choose the claim, the standard and whether the work is ready to leave the building.",
    proof: "Run the last finished piece and the next one through the same record. It works when the second needs fewer hand-offs without lowering the standard."
  },
  tools: {
    pattern: /tool|vendor|stack|software|platform|licen[cs]e/i,
    carry: "Map the tools against the repeated work and make the overlaps visible.",
    human: "Choose which capability matters, which risk is acceptable and what stops.",
    proof: "Put one useful workflow live, then remove the tools it makes redundant."
  },
  commercial: {
    pattern: /sales|offer|market|gtm|buyer|customer|pricing|revenue|commercial/i,
    carry: "Bring the current promise, buyer language, objections and evidence into one view.",
    human: "Choose the buyer decision the offer must make easier and the proof that earns it.",
    proof: "Test one offer with real buyers and keep the objections in the record."
  },
  decision: {
    pattern: /build|partner|decision|govern|invest|buy|make|hire/i,
    carry: "Prepare the evidence, constraints and credible options for comparison.",
    human: "Set the decision boundary, make the call and name what would change it.",
    proof: "Replay the next live choice against the written rationale and the evidence that supported it."
  },
  default: {
    pattern: /.*/,
    carry: "Hold the evidence and the repeatable middle of the work in one reachable record.",
    human: "Set the standard, make the consequential choice and own the exception.",
    proof: "Use it on the next real case. It works when another person can repeat the useful part without losing the judgement."
  }
};

function matchingFrame(value) {
  if (frames.decision.pattern.test(value)) return frames.decision;
  return [frames.publishing, frames.tools, frames.commercial, frames.default].find((frame) => frame.pattern.test(value)) || frames.default;
}

function specificDecisionFrame(value) {
  const lower = value.toLowerCase();
  const buildSubjectMatch = value.match(/\bbuild\s+(.+?)\s+or\s+(?:buy|purchase|partner|outsource)\b/i);
  const rawSubject = buildSubjectMatch?.[1]?.trim();
  const subject = rawSubject && !/^(ourselves|it|one|in[- ]house)$/i.test(rawSubject) ? rawSubject : "the capability";
  const hireSubjectMatch = value.match(/\bhire\s+(.+?)(?=,|\s+or\s+(?:automate|use)\b)/i);
  const hireSubject = hireSubjectMatch?.[1]?.trim() || "the role";

  if (/\bbuild\b/.test(lower) && /\b(buy|purchase|platform)\b/.test(lower)) {
    return {
      carry: `Compare build, buy and hybrid paths for ${subject} against speed, total cost, team capability, control and reversibility.`,
      human: "Weight those trade-offs, decide what must remain leader-owned and name the evidence that would reopen the call.",
      proof: "Score one credible build route, one live buy route and one thin hybrid pilot against the same criteria. It works when the team can explain why the chosen route wins and what would reverse it."
    };
  }
  if (/\bbuild\b/.test(lower) && /\b(partner|specialist|outsource)\b/.test(lower)) {
    return {
      carry: `Compare build, partner and hybrid paths for ${subject} against speed, total cost, capability transfer, dependency and reversibility.`,
      human: "Choose what must remain leader-owned, what a partner may carry and the evidence that would reopen the call.",
      proof: "Put one credible build route, one live partner route and one bounded hybrid pilot through the same criteria. It works when the team can defend the boundary and the reversal condition."
    };
  }
  if (/\bhire\b/.test(lower) && /\b(automate|agent|ai)\b/.test(lower)) {
    return {
      carry: `Compare hiring ${hireSubject}, automating the repeated work and a hybrid path against judgement, repeatability, risk and operating load.`,
      human: "Choose where human judgement must remain, where the system may act and what evidence would change that boundary.",
      proof: "Run the same live case through human-only, system-only and hybrid boundaries. It works when the necessary human intervention is clear and the repeated work becomes easier to carry."
    };
  }
  return frames.decision;
}

function resetPreflight() {
  if (!inputStep || !resultStep) return;
  inputStep.hidden = false;
  resultStep.hidden = true;
  decisionError.hidden = true;
  decisionInput?.removeAttribute("aria-invalid");
  if (copyFrame) copyFrame.textContent = "Copy this record";
}

function openPreflight(event) {
  if (!preflight?.showModal) return;
  event.preventDefault();
  lastFocus = startHere;
  decisionInput.value = sessionStorage.getItem("mindmake-proofglass-s3-decision") || "";
  if (generatedDecision && generatedDecision === decisionInput.value.trim()) {
    inputStep.hidden = true;
    resultStep.hidden = false;
  } else resetPreflight();
  preflight.showModal();
  focusReliably(resultStep.hidden ? decisionInput : resultHeading);
}

startHere?.addEventListener("click", openPreflight);

decisionInput?.addEventListener("input", () => {
  sessionStorage.setItem("mindmake-proofglass-s3-decision", decisionInput.value);
  decisionError.hidden = true;
  decisionInput.removeAttribute("aria-invalid");
});

frameAction?.addEventListener("click", () => {
  const value = decisionInput.value.trim();
  if (!value) {
    decisionError.hidden = false;
    decisionInput.setAttribute("aria-invalid", "true");
    decisionInput.focus();
    return;
  }
  const matchedFrame = matchingFrame(value);
  const frame = matchedFrame === frames.decision ? specificDecisionFrame(value) : matchedFrame;
  resultSubject.textContent = "This decision";
  resultStarting.textContent = value;
  resultCarry.textContent = frame.carry;
  resultHuman.textContent = frame.human;
  resultProof.textContent = frame.proof;
  generatedDecision = value;
  inputStep.hidden = true;
  resultStep.hidden = false;
  focusReliably(resultHeading);
});

changeDecision?.addEventListener("click", () => {
  generatedDecision = "";
  resetPreflight();
  focusReliably(decisionInput);
});

copyFrame?.addEventListener("click", async () => {
  const record = [
    `Starting point: ${resultStarting.textContent}`,
    `AI can carry: ${resultCarry.textContent}`,
    `You keep: ${resultHuman.textContent}`,
    `First proof: ${resultProof.textContent}`
  ].join("\n");
  try {
    await navigator.clipboard.writeText(record);
    copyFrame.textContent = "Record copied";
  } catch {
    copyFrame.textContent = "Select and copy the record";
  }
});

preflight?.addEventListener("click", (event) => {
  if (event.target === preflight) preflight.close();
});

let pendingModalTabFocus = null;

preflight?.addEventListener("keydown", (event) => {
  if (event.key !== "Tab") return;
  const focusable = [...preflight.querySelectorAll('button:not([disabled]),a[href],textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')]
    .filter((node) => !node.hidden && node.getClientRects().length && getComputedStyle(node).visibility !== "hidden");
  if (!focusable.length) return;
  const current = focusable.indexOf(document.activeElement);
  const origin = current < 0 ? (event.shiftKey ? 0 : -1) : current;
  const next = (origin + (event.shiftKey ? -1 : 1) + focusable.length) % focusable.length;
  event.preventDefault();
  event.stopPropagation();
  pendingModalTabFocus = focusable[next] || null;
  pendingModalTabFocus?.focus({ preventScroll: true });
});

preflight?.addEventListener("keyup", (event) => {
  if (event.key !== "Tab" || !pendingModalTabFocus) return;
  event.preventDefault();
  pendingModalTabFocus.focus({ preventScroll: true });
  pendingModalTabFocus = null;
});

preflight?.addEventListener("close", () => {
  decisionError.hidden = true;
  decisionInput?.removeAttribute("aria-invalid");
  if (copyFrame) copyFrame.textContent = "Copy this record";
  lastFocus?.focus?.({ preventScroll: true });
  requestAnimationFrame(() => lastFocus?.focus?.({ preventScroll: true }));
});

document.addEventListener("visibilitychange", () => {
  if (!film) return;
  if (document.hidden) film.pause();
  else if (!filmPausedByUser) startFilm();
});

const stageObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!film || constrainedMotion()) return;
    if (entry.isIntersecting && !filmPausedByUser && !document.hidden) film.play().catch(() => {});
    else film.pause();
  });
}, { threshold: 0.05 });

if (handoffStage) stageObserver.observe(handoffStage);

[reduceMotion, largeText, compactLayout].forEach((query) => {
  query.addEventListener?.("change", () => {
    updateFilmState();
    requestHandoffUpdate();
    syncRecordSemantics();
  });
});

activateRecord(Number.isFinite(activeRecord) ? activeRecord : 0);
updateFilmState();
updateHandoff();
