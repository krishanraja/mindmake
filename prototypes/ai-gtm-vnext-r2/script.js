const sequence = document.querySelector("#offerSequence");
const panels = [...document.querySelectorAll("[data-panel]")];
const stageButtons = [...document.querySelectorAll("[data-stage]")];
const sheetState = document.querySelector("#sheetState");
const states = ["Product", "Price", "Positioning", "People"];
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
let activeStage = -1;

history.scrollRestoration = "manual";
sequence.classList.add("is-enhanced");

function clamp(value, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value));
}

function setStage(stage) {
  const next = clamp(stage, 0, 3);
  if (next === activeStage) return;
  activeStage = next;
  sequence.style.setProperty("--stage", String(next));
  sequence.style.setProperty("--progress", String((next + 1) / states.length));
  sheetState.textContent = states[next];
  panels.forEach((panel, index) => {
    const current = index === next;
    panel.classList.toggle("is-active", current);
    if (reducedMotion.matches) panel.removeAttribute("aria-hidden");
    else panel.setAttribute("aria-hidden", String(!current));
  });
  stageButtons.forEach((button, index) => {
    if (index === next) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
}

function updateScroll() {
  const rect = sequence.getBoundingClientRect();
  const distance = Math.max(1, sequence.offsetHeight - innerHeight);
  const progress = clamp(-rect.top / distance);
  setStage(Math.min(3, Math.floor(Math.min(.9999, progress) * 4)));
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
  const distance = Math.max(0, sequence.offsetHeight - innerHeight);
  scrollTo({
    top: sequence.offsetTop + distance * ((stage + .2) / 4),
    behavior: reducedMotion.matches ? "auto" : "smooth",
  });
}));

addEventListener("scroll", requestUpdate, { passive: true });
addEventListener("resize", requestUpdate);
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
const footer = document.querySelector(".site-footer");
const menuTrigger = document.querySelector("#menuTrigger");
const startForm = startLayer.querySelector("form");
const workEmail = document.querySelector("#workEmail");
const emailError = document.querySelector("#emailError");
let returnFocus = null;

const focusable = (root) => [...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')]
  .filter((element) => !element.closest("[hidden]"));

function setPageInert(value) {
  siteHeader.inert = value;
  main.inert = value;
  footer.inert = value;
  document.body.classList.toggle("is-locked", value);
}

function openLayer(layer) {
  if (layer === startLayer && !menuLayer.hidden) {
    menuLayer.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
  }
  if (layer === startLayer) {
    startForm.reset();
    workEmail.removeAttribute("aria-invalid");
    emailError.hidden = true;
  }
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

menuTrigger.addEventListener("click", () => openLayer(menuLayer));
document.querySelectorAll("[data-close-menu]").forEach((element) => element.addEventListener("click", () => closeLayer(menuLayer)));
document.querySelectorAll("[data-open-start]").forEach((element) => element.addEventListener("click", () => openLayer(startLayer)));
document.querySelectorAll("[data-close-start]").forEach((element) => element.addEventListener("click", () => closeLayer(startLayer)));
menuLayer.addEventListener("keydown", (event) => trapFocus(event, menuLayer));
startLayer.addEventListener("keydown", (event) => trapFocus(event, startLayer));

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.value.trim());
  if (!valid) {
    workEmail.setAttribute("aria-invalid", "true");
    emailError.hidden = false;
    workEmail.focus();
    return;
  }
  location.href = "../../ai-gtm?start=1";
});

workEmail.addEventListener("input", () => {
  workEmail.removeAttribute("aria-invalid");
  emailError.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!startLayer.hidden) closeLayer(startLayer);
  else if (!menuLayer.hidden) closeLayer(menuLayer);
});

scrollTo(0, 0);
