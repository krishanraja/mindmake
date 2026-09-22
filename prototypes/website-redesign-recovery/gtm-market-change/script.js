const DATA_URL = "../../../src/data/vnext/gtm-signals.json";
const signalInputs = [...document.querySelectorAll('input[name="signal"]')];
const responseInputs = [...document.querySelectorAll('input[name="response"]')];
const responseLabels = [...document.querySelectorAll(".response-paddle > span:last-child")];
const leaves = [...document.querySelectorAll(".outcome-grid .paper-leaf")];
const undoButton = document.querySelector("#undo");
const undoLabel = document.querySelector("#undo-label");
const root = document.documentElement;
const instrument = document.querySelector(".instrument");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const forceFinalRender = new URLSearchParams(window.location.search).get("render") === "final";

const outputKeys = ["product", "price", "positioning", "people"];
const outputNames = ["Product", "Price", "Positioning", "People"];
const shortResponses = ["Subscription", "Completed task", "Verified result"];
const roleModels = [
  {
    product: ["Human sets the roadmap", "AI assists"],
    price: ["Human sets the bundle", "AI stays inside it"],
    positioning: ["Human leads the promise", "AI supports"],
    people: ["Human keeps control", "AI prepares"]
  },
  {
    product: ["Human defines the task", "Agent completes it"],
    price: ["Human sets the limits", "System meters use"],
    positioning: ["Human owns the promise", "Agent shows proof"],
    people: ["Human handles exceptions", "Agent runs the routine"]
  },
  {
    product: ["Human sets the standard", "Agent acts"],
    price: ["Human sets the value", "System verifies"],
    positioning: ["Human owns trust", "Agent proves the result"],
    people: ["Human judges appeals", "Agent improves"]
  }
];
const evidenceStates = {
  ready: {
    light: "Evidence set",
    label: "Ready.",
    copy: "Dated company evidence, with its limit kept visible."
  },
  stale: {
    light: "Check overdue",
    label: "Stale.",
    copy: "The evidence remains visible, but its review date has passed."
  },
  quiet: {
    light: "No new signal",
    label: "Quiet.",
    copy: "No newer qualifying source was found. The last dated evidence remains."
  },
  error: {
    light: "Refresh failed",
    label: "Error.",
    copy: "Current evidence could not be refreshed. This is only a dated worked example."
  },
  conflicted: {
    light: "Evidence conflicts",
    label: "Conflicted.",
    copy: "Sources point in different directions. Treat the response as a test, not a conclusion."
  }
};

let signals = null;
let signalKey = "pricing";
let responseIndex = 1;
let previousResponseIndex = null;
let stageIndex = 0;
let changeTimer;
let buildFrame = 0;

const leafOrigins = [
  { x: 272, y: 182 },
  { x: -330, y: 182 },
  { x: 288, y: -166 },
  { x: -330, y: -166 }
];

function setBuildProgress(value) {
  const progress = Math.max(0, Math.min(1, value));
  const inverse = 1 - progress;
  instrument.style.setProperty("--build-progress", progress.toFixed(4));
  instrument.style.setProperty("--build-inverse", inverse.toFixed(4));
  instrument.style.setProperty("--build-offset", `${Math.round(inverse * 640)}px`);
  instrument.style.setProperty("--mobile-leaf-y", `${Math.round(inverse * 34)}px`);
  instrument.dataset.build = progress >= 0.985
    ? "built"
    : progress > 0.02
      ? "building"
      : "idle";

  leaves.forEach((leaf, index) => {
    leaf.style.setProperty("--leaf-x", `${Math.round(leafOrigins[index].x * inverse)}px`);
    leaf.style.setProperty("--leaf-y", `${Math.round(leafOrigins[index].y * inverse)}px`);
  });
}

function updateScrollBuild() {
  buildFrame = 0;
  if (reducedMotion.matches || forceFinalRender) {
    setBuildProgress(1);
    return;
  }
  const rect = instrument.getBoundingClientRect();
  const isMobile = window.innerWidth <= 700;
  const start = window.innerHeight * (isMobile ? 0.94 : 0.88);
  const distance = Math.max(260, window.innerHeight * (isMobile ? 0.52 : 0.68));
  setBuildProgress((start - rect.top) / distance);
}

function requestScrollBuild() {
  if (buildFrame) return;
  buildFrame = window.requestAnimationFrame(updateScrollBuild);
}

function setText(selector, value) {
  const element = document.querySelector(selector);
  if (element) element.textContent = value;
}

function applyEvidenceState() {
  const requested = new URLSearchParams(window.location.search).get("state") || "ready";
  const state = evidenceStates[requested] || evidenceStates.ready;
  const stateKey = evidenceStates[requested] ? requested : "ready";
  root.dataset.evidenceState = stateKey;
  const status = document.querySelector(".status-light");
  if (status?.lastChild) status.lastChild.textContent = state.light;
  const evidence = document.querySelector("#evidence-state");
  evidence.replaceChildren();
  const strong = document.createElement("strong");
  strong.textContent = state.label;
  evidence.append(strong, document.createTextNode(` ${state.copy}`));
  setText("#fixture-status", stateKey === "ready" ? "Worked example" : state.light);
}

function selectedSignal() {
  return signals?.[signalKey];
}

function selectedResponse() {
  return selectedSignal()?.responses[responseIndex];
}

function renderSignal() {
  const signal = selectedSignal();
  if (!signal) return;

  setText("#signal-domain", signal.domain);
  setText("#signal-date", signal.date);
  document.querySelector("#signal-date").dateTime = signal.isoDate;
  setText("#signal-observation", signal.observation);
  setText("#signal-limit", signal.limit);
  setText("#decision-question", window.matchMedia("(max-width: 700px)").matches
    ? signal.mobileQuestion
    : signal.question);

  const source = document.querySelector("#signal-source");
  source.href = signal.source;
  source.firstChild.textContent = `Open ${signal.sourceLabel} `;

  responseLabels.forEach((label, index) => {
    label.textContent = signal.responses[index].name;
  });
  renderResponse(true);
}

function markChanges(previous, next, force = false) {
  clearTimeout(changeTimer);
  leaves.forEach((leaf, index) => {
    const key = outputKeys[index];
    leaf.classList.toggle("changed", force || previous?.[key] !== next?.[key]);
  });
  changeTimer = window.setTimeout(() => {
    leaves.forEach((leaf) => leaf.classList.remove("changed"));
  }, 2200);
}

function renderRoleModel() {
  const model = roleModels[responseIndex];
  outputKeys.forEach((key) => {
    setText(`#role-${key}-human`, model[key][0]);
    setText(`#role-${key}-agent`, model[key][1]);
  });
}

function renderResponse(signalChanged = false) {
  const signal = selectedSignal();
  const response = selectedResponse();
  if (!signal || !response) return;

  const prior = previousResponseIndex === null
    ? null
    : signal.responses[previousResponseIndex];

  outputKeys.forEach((key) => setText(`#outcome-${key}`, response[key]));
  setText("#test-title", response.testTitle);
  setText("#test-body", response.testBody);
  setText("#hub-response", shortResponses[responseIndex]);
  renderRoleModel();
  markChanges(prior, response, signalChanged);

  root.classList.add("is-changing");
  window.setTimeout(() => root.classList.remove("is-changing"), 280);
  stageIndex = 0;
  renderMobileStage();
}

function renderUndo() {
  if (previousResponseIndex === null) {
    undoButton.hidden = true;
    return;
  }
  const priorName = selectedSignal().responses[previousResponseIndex].name;
  undoLabel.textContent = `Undo: ${priorName}`;
  undoButton.hidden = false;
}

function renderMobileStage() {
  const response = selectedResponse();
  if (!response) return;

  const atTest = stageIndex === outputKeys.length;
  instrument.classList.toggle("mobile-showing-test", atTest);
  document.querySelector("#test-slip").classList.toggle("mobile-visible", atTest);

  if (!atTest) {
    const key = outputKeys[stageIndex];
    setText("#mobile-index", `${String.fromCharCode(65 + stageIndex)} / 04`);
    setText("#mobile-heading", outputNames[stageIndex]);
    setText("#mobile-copy", response[key]);
    setText("#mobile-role-human", roleModels[responseIndex][key][0]);
    setText("#mobile-role-agent", roleModels[responseIndex][key][1]);
  }

  const back = document.querySelector("#stage-back");
  const next = document.querySelector("#stage-next");
  back.disabled = stageIndex === 0;
  setText("#stage-count", `${stageIndex + 1} of 5`);

  if (stageIndex === outputKeys.length) {
    next.innerHTML = 'Back to Product <span aria-hidden="true">&#8635;</span>';
    next.setAttribute("aria-label", "Return to the first consequence, Product");
  } else {
    const nextName = stageIndex === outputKeys.length - 1
      ? "Customer test"
      : outputNames[stageIndex + 1];
    next.innerHTML = `Next: ${nextName} <span aria-hidden="true">&rarr;</span>`;
    next.setAttribute("aria-label", `Show next step, ${nextName}`);
  }
}

signalInputs.forEach((input) => {
  input.addEventListener("change", () => {
    signalKey = input.value;
    previousResponseIndex = null;
    renderSignal();
    renderUndo();
  });
});

responseInputs.forEach((input) => {
  input.addEventListener("change", () => {
    previousResponseIndex = responseIndex;
    responseIndex = Number(input.value);
    renderResponse();
    renderUndo();
  });
});

undoButton.addEventListener("click", () => {
  if (previousResponseIndex === null) return;
  responseIndex = previousResponseIndex;
  previousResponseIndex = null;
  responseInputs[responseIndex].checked = true;
  renderResponse();
  renderUndo();
  responseInputs[responseIndex].focus();
});

document.querySelector("#stage-back").addEventListener("click", () => {
  stageIndex = Math.max(0, stageIndex - 1);
  renderMobileStage();
});

document.querySelector("#stage-next").addEventListener("click", () => {
  stageIndex = stageIndex === outputKeys.length ? 0 : stageIndex + 1;
  renderMobileStage();
});

window.addEventListener("resize", () => {
  const signal = selectedSignal();
  if (signal) {
    setText("#decision-question", window.matchMedia("(max-width: 700px)").matches
      ? signal.mobileQuestion
      : signal.question);
  }
  requestScrollBuild();
});

window.addEventListener("scroll", requestScrollBuild, { passive: true });
reducedMotion.addEventListener("change", requestScrollBuild);

applyEvidenceState();

try {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Signal fixture returned ${response.status}`);
  signals = await response.json();
  renderSignal();
  renderUndo();
  root.classList.remove("no-js");
  requestScrollBuild();
} catch (error) {
  console.error("The GTM fixture could not be loaded.", error);
  root.dataset.evidenceState = "error";
  const status = document.querySelector(".status-light");
  if (status?.lastChild) status.lastChild.textContent = "Fixture unavailable";
  const evidence = document.querySelector("#evidence-state");
  evidence.innerHTML = "<strong>Error.</strong> The interactive fixture could not be loaded. The default worked example remains readable.";
}
