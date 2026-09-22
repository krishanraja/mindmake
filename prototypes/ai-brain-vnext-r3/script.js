const sequence = document.querySelector("#decisionSequence");
const panels = [...document.querySelectorAll("[data-panel]")];
const stageButtons = [...document.querySelectorAll("[data-stage]")];
const sheetState = document.querySelector("#sheetState");
const states = ["Capture", "Inspect", "Evidence", "Correct"];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let activeStage = -1;
history.scrollRestoration = "manual";

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function setStage(stage) {
  const next = clamp(stage, 0, 3);
  if (next === activeStage) return;
  activeStage = next;
  document.body.dataset.phase = states[next].toLowerCase();
  sequence.style.setProperty("--stage", String(next));
  sheetState.textContent = states[next];
  panels.forEach((panel, index) => {
    const isActive = index === next;
    panel.classList.toggle("is-active", isActive);
    if (reducedMotion.matches) panel.removeAttribute("aria-hidden");
    else panel.setAttribute("aria-hidden", String(!isActive));
  });
  stageButtons.forEach((button, index) => {
    if (index === next) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
}

const brainItems = {
  builder: { standing: "Current synthesis", title: "Builder of judgement", statement: "Move from personal AI fluency to systems that help other people exercise stronger judgement.", evidence: "4 sources · version 2" },
  possibility: { standing: "Observed pattern", title: "Possibility detection", statement: "See newly possible work before established operating habits make it obvious.", evidence: "2 sources · version 1" },
  release: { standing: "Accepted standard", title: "Human release judgement", statement: "Externally consequential work receives human polish, verification and accountable release judgement.", evidence: "2 sources · version 2" },
  teachable: { standing: "Current synthesis", title: "Make judgement teachable", statement: "Encode standards, anti-examples and verification so quality can travel without producing copies of the founder.", evidence: "3 sources · version 1" },
  convergence: { standing: "Accepted anti-standard", title: "Reject convergence", statement: "Blind optimism, missing numbers and homogeneous thinking are warning signs, not acceptable speed gains.", evidence: "1 source · version 1" },
};
const brainNodes = [...document.querySelectorAll("[data-brain-item]")];
const brainMapReadout = document.querySelector("#brainMapReadout");

brainNodes.forEach((node) => node.addEventListener("click", () => {
  const item = brainItems[node.dataset.brainItem];
  brainNodes.forEach((item) => {
    const selected = item === node;
    item.classList.toggle("is-active", selected);
    item.setAttribute("aria-pressed", String(selected));
  });
  document.querySelector("#brainMapStanding").textContent = item.standing;
  document.querySelector("#brainMapTitle").textContent = item.title;
  document.querySelector("#brainMapStatement").textContent = item.statement;
  document.querySelector("#brainMapSources").textContent = item.evidence;
}));

function updateScroll() {
  const rect = sequence.getBoundingClientRect();
  const distance = Math.max(1, sequence.offsetHeight - window.innerHeight);
  const progress = clamp(-rect.top / distance);
  sequence.style.setProperty("--progress", progress.toFixed(4));
  setStage(Math.min(3, Math.floor(progress * 4)));
}

let ticking = false;
function requestUpdate() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateScroll();
    ticking = false;
  });
}

function scrollToStage(stage) {
  setStage(stage);
  const distance = sequence.offsetHeight - window.innerHeight;
  const top = sequence.offsetTop + distance * ((stage + 0.2) / 4);
  window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}

stageButtons.forEach((button) => button.addEventListener("click", () => scrollToStage(Number(button.dataset.stage))));
document.querySelectorAll("[data-open-evidence]").forEach((button) => button.addEventListener("click", () => scrollToStage(2)));
document.querySelectorAll("[data-return-map]").forEach((button) => button.addEventListener("click", () => scrollToStage(1)));

const brainChange = document.querySelector("#brainChange");
const applyCorrection = document.querySelector("#applyCorrection");
const repairText = document.querySelector("#repairText");
let correctionApplied = false;

applyCorrection.addEventListener("click", () => {
  correctionApplied = !correctionApplied;
  brainChange.classList.toggle("is-applied", correctionApplied);
  applyCorrection.querySelector("span").textContent = correctionApplied ? "Undo demo correction" : "Apply correction";
  applyCorrection.querySelector("b").textContent = correctionApplied ? "↺" : "→";
  repairText.textContent = correctionApplied
    ? "Rebuilt: private portrait, map and retrieval. Held: anything consequential or shared."
    : "No private meaning has changed yet.";
  document.querySelector("#repairReceipt b").textContent = correctionApplied ? "Repair complete" : "Repair ready";
  document.querySelector("#repairReceipt").classList.toggle("is-complete", correctionApplied);
});

window.addEventListener("scroll", requestUpdate, { passive: true });
window.addEventListener("resize", requestUpdate);
setStage(0);
requestUpdate();
reducedMotion.addEventListener("change", () => {
  activeStage = -1;
  setStage(Math.max(0, states.indexOf(sheetState.textContent)));
});

const menuLayer = document.querySelector("#menuLayer");
const startLayer = document.querySelector("#startLayer");
const siteHeader = document.querySelector("#siteHeader");
const main = document.querySelector("#main");
const menuTrigger = document.querySelector("#menuTrigger");
let returnFocus = null;
const drawerScreens = [...document.querySelectorAll("[data-drawer-screen]")];
const drawerSteps = [...document.querySelectorAll("[data-drawer-step]")];
const companyForm = document.querySelector('[data-drawer-screen="company"]');
const personForm = document.querySelector('[data-drawer-screen="you"]');
const problemForm = document.querySelector('[data-drawer-screen="problem"]');
const workEmail = document.querySelector("#workEmail");
const workEmailError = document.querySelector("#workEmailError");

function showDrawerScreen(name) {
  drawerScreens.forEach((screen) => { screen.hidden = screen.dataset.drawerScreen !== name; });
  drawerSteps.forEach((step) => step.classList.toggle("is-current", step.dataset.drawerStep === name));
  const target = drawerScreens.find((screen) => screen.dataset.drawerScreen === name);
  const preferredFocus = name === "complete" ? target : target.querySelector("input, textarea");
  (preferredFocus || target).focus();
}

function resetDrawer() {
  companyForm.reset();
  personForm.reset();
  problemForm.reset();
  workEmail.removeAttribute("aria-invalid");
  workEmailError.hidden = true;
  showDrawerScreen("company");
}

const focusable = (root) => [...root.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])')]
  .filter((element) => !element.closest("[hidden]"));

function trapFocus(event, layer) {
  if (event.key !== "Tab") return;
  const items = focusable(layer);
  if (!items.length) return;
  const first = items[0];
  const last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function setPageInert(value) {
  siteHeader.inert = value;
  main.inert = value;
  document.body.classList.toggle("is-locked", value);
}

function openLayer(layer) {
  const replacesMenu = layer === startLayer && !menuLayer.hidden;
  if (replacesMenu) {
    menuLayer.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
  }
  if (layer === startLayer) resetDrawer();
  if (!replacesMenu) returnFocus = document.activeElement;
  layer.hidden = false;
  if (layer === menuLayer) menuTrigger.setAttribute("aria-expanded", "true");
  setPageInert(true);
  (layer.querySelector("input") || layer.querySelector(".close-button")).focus();
}

function closeLayer(layer, restore = true) {
  layer.hidden = true;
  if (layer === menuLayer) menuTrigger.setAttribute("aria-expanded", "false");
  if (menuLayer.hidden && startLayer.hidden) setPageInert(false);
  if (restore && returnFocus) returnFocus.focus();
}

menuTrigger.addEventListener("click", () => openLayer(menuLayer));
document.querySelectorAll("[data-close-menu]").forEach((element) => element.addEventListener("click", () => closeLayer(menuLayer)));
document.querySelectorAll("[data-open-start]").forEach((element) => element.addEventListener("click", () => openLayer(startLayer)));
document.querySelectorAll("[data-close-start]").forEach((element) => element.addEventListener("click", () => closeLayer(startLayer)));
menuLayer.addEventListener("keydown", (event) => trapFocus(event, menuLayer));
startLayer.addEventListener("keydown", (event) => trapFocus(event, startLayer));

companyForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = workEmail.value.trim();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  if (!valid) {
    workEmail.setAttribute("aria-invalid", "true");
    workEmailError.hidden = false;
    workEmail.focus();
    return;
  }
  workEmail.removeAttribute("aria-invalid");
  workEmailError.hidden = true;
  const domain = value.split("@").at(-1).toLowerCase();
  document.querySelector("#companyDomain").textContent = domain;
  document.querySelector("#problemDomain").textContent = domain;
  document.querySelector("#completeDomain").textContent = domain;
  showDrawerScreen("you");
});

workEmail.addEventListener("input", () => {
  workEmail.removeAttribute("aria-invalid");
  workEmailError.hidden = true;
});

document.querySelector("[data-drawer-back]").addEventListener("click", () => showDrawerScreen("company"));
personForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!personForm.reportValidity()) return;
  const firstName = document.querySelector("#firstName").value.trim();
  const role = document.querySelector("#businessPart").value;
  document.querySelector("#problemPerson").textContent = `${firstName} · ${role}`;
  showDrawerScreen("problem");
});
document.querySelector("[data-problem-back]").addEventListener("click", () => showDrawerScreen("you"));
problemForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!problemForm.reportValidity()) return;
  const decision = document.querySelector("#decisionProblem").value.trim();
  document.querySelector("#completeContext").textContent = decision;
  showDrawerScreen("complete");
});
const proofDisclosure = document.querySelector(".proof-disclosure");
const founderProof = document.querySelector("#founderProof");
proofDisclosure.addEventListener("click", () => {
  const open = proofDisclosure.getAttribute("aria-expanded") === "true";
  proofDisclosure.setAttribute("aria-expanded", String(!open));
  founderProof.hidden = open;
  proofDisclosure.querySelector("span").textContent = open ? "+" : "−";
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!startLayer.hidden) closeLayer(startLayer);
  else if (!menuLayer.hidden) closeLayer(menuLayer);
});

const stageParam = new URLSearchParams(location.search).get("stage");
const requestedStage = stageParam === null ? Number.NaN : Number(stageParam);
if (Number.isInteger(requestedStage) && requestedStage >= 0 && requestedStage <= 3) {
  addEventListener("load", () => {
    const distance = sequence.offsetHeight - innerHeight;
    scrollTo(0, sequence.offsetTop + distance * ((requestedStage + 0.2) / 4));
  }, { once: true });
} else {
  scrollTo(0, 0);
}
