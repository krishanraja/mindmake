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

const brainMapReadout = document.querySelector("#brainMapReadout");
const livingBrain = document.querySelector("#livingBrain");
const livingEdges = document.querySelector("#livingEdges");
const livingNodes = document.querySelector("#livingNodes");
let brainFixture;
let selectedBrainId = "BI-001";

const humanize = (value) => value.replaceAll("_", " ").replace(/\b\w/g, (character) => character.toUpperCase());
const shortenNode = (title) => title.length > 22 ? `${title.slice(0, 20)}…` : title;

function brainPoint(item) {
  return { x: item.x * 10, y: item.y * 6.4 };
}

function selectBrainItem(id) {
  if (!brainFixture) return;
  selectedBrainId = id;
  const item = brainFixture.items.find((candidate) => candidate.id === id);
  if (!item) return;
  const related = brainFixture.relationships.filter((relationship) => relationship.from === id || relationship.to === id);
  const relatedIds = new Set(related.map((relationship) => relationship.from === id ? relationship.to : relationship.from));
  livingNodes.querySelectorAll(".living-node").forEach((node) => {
    const selected = node.dataset.id === id;
    node.classList.toggle("is-active", selected);
    node.classList.toggle("is-related", relatedIds.has(node.dataset.id));
    node.setAttribute("aria-pressed", String(selected));
  });
  livingEdges.querySelectorAll(".living-edge").forEach((edge) => {
    edge.classList.toggle("is-active", edge.dataset.from === id || edge.dataset.to === id);
  });
  document.querySelector("#brainMapStanding").textContent = `${humanize(item.standing)} · ${item.id}`;
  document.querySelector("#brainMapTitle").textContent = item.title;
  document.querySelector("#brainMapStatement").textContent = item.statement;
  document.querySelector("#brainMapEvidence").textContent = humanize(item.confidence);
  document.querySelector("#brainMapVersion").textContent = `v${item.version}`;
  document.querySelector("#brainMapAudience").textContent = humanize(item.audience);
  document.querySelector("#brainMapRelations").innerHTML = (related.length ? related.slice(0, 3) : [{ type: "No supported connections", meaning: "This meaning remains current without a claimed relationship." }]).map((relationship) => {
    const otherId = relationship.from === id ? relationship.to : relationship.from;
    return `<li><b>${humanize(relationship.type)}${otherId ? ` · ${otherId}` : ""}</b><span>${relationship.meaning}</span></li>`;
  }).join("");
}

function renderLivingBrain(data) {
  brainFixture = data;
  const itemById = new Map(data.items.map((item) => [item.id, item]));
  livingEdges.innerHTML = data.relationships.map((relationship) => {
    const from = brainPoint(itemById.get(relationship.from));
    const to = brainPoint(itemById.get(relationship.to));
    return `<line class="living-edge" data-from="${relationship.from}" data-to="${relationship.to}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />`;
  }).join("");
  livingNodes.innerHTML = data.items.map((item, index) => {
    const point = brainPoint(item);
    const anchor = item.x > 76 ? "end" : "start";
    const labelX = item.x > 76 ? -18 : 18;
    const labelY = item.y > 86 ? -15 : 4;
    return `<g class="living-node" data-id="${item.id}" data-type="${item.type}" role="button" tabindex="0" aria-pressed="false" aria-label="${humanize(item.type)}: ${item.title}" transform="translate(${point.x} ${point.y})" style="--node-delay:${index * -0.19}s"><circle class="living-hit" r="28" /><circle class="living-halo" r="15" /><circle class="living-dot" r="9" /><text x="${labelX}" y="${labelY}" text-anchor="${anchor}">${shortenNode(item.title)}</text></g>`;
  }).join("");
  livingNodes.querySelectorAll(".living-node").forEach((node) => {
    node.addEventListener("click", () => selectBrainItem(node.dataset.id));
    node.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      selectBrainItem(node.dataset.id);
    });
  });
  document.querySelector("#livingCount").textContent = `${data.items.length} meanings · ${data.relationships.length} relationships · ${data.sources.length} sources`;
  livingBrain.dataset.status = "ready";
  selectBrainItem(selectedBrainId);
}

fetch("./brain-fixture.json", { cache: "no-store" })
  .then((response) => {
    if (!response.ok) throw new Error("Brain fixture unavailable");
    return response.json();
  })
  .then(renderLivingBrain)
  .catch(() => {
    livingBrain.dataset.status = "error";
    document.querySelector("#livingCount").textContent = "The Brain could not be opened";
    document.querySelector("#brainMapStatement").textContent = "The working fixture is unavailable. No substitute portrait has been invented.";
  });

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
