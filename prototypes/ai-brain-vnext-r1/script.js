const sequence = document.querySelector("#decisionSequence");
const panels = [...document.querySelectorAll("[data-panel]")];
const stageButtons = [...document.querySelectorAll("[data-stage]")];
const sheetState = document.querySelector("#sheetState");
const states = ["Prepared", "Challenged", "Decided", "Kept"];
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

stageButtons.forEach((button) => button.addEventListener("click", () => {
  const stage = Number(button.dataset.stage);
  const distance = sequence.offsetHeight - window.innerHeight;
  const top = sequence.offsetTop + distance * ((stage + 0.2) / 4);
  window.scrollTo({ top, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
}));

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
const workEmail = document.querySelector("#workEmail");
const workEmailError = document.querySelector("#workEmailError");

function showDrawerScreen(name) {
  drawerScreens.forEach((screen) => { screen.hidden = screen.dataset.drawerScreen !== name; });
  drawerSteps.forEach((step) => step.classList.toggle("is-current", step.dataset.drawerStep === name));
  const target = drawerScreens.find((screen) => screen.dataset.drawerScreen === name);
  const preferredFocus = name === "complete" ? target : target.querySelector("input");
  (preferredFocus || target).focus();
}

function resetDrawer() {
  companyForm.reset();
  personForm.reset();
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
  if (layer === startLayer && !menuLayer.hidden) {
    menuLayer.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
  }
  if (layer === startLayer) resetDrawer();
  returnFocus = document.activeElement;
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
