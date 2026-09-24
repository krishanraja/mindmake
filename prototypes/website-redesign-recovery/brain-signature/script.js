const FIXTURE_URL = "../../ai-brain-vnext-r5/brain-fixture.json";
const SELECTED_ID = "BI-003";
const params = new URLSearchParams(window.location.search);
const simulatedState = params.get("state") || "ready";
const renderFinal = params.get("render") === "final";

document.body.classList.remove("no-js");
document.body.dataset.mask = "false";
document.body.dataset.correction = "current";
document.documentElement.dataset.render = renderFinal ? "final" : "live";

const evidenceMessages = {
  ready: "Current record. 10 sources loaded.",
  loading: "Checking sources. Last known record remains readable.",
  stale: "Source check is older than expected. Last known record remains readable.",
  error: "Source check unavailable. Last known record remains readable.",
  recovery: "Source connection restored. Record current."
};

function setEvidenceState(state) {
  const safeState = Object.hasOwn(evidenceMessages, state) ? state : "ready";
  document.documentElement.dataset.evidenceState = safeState;
  document.querySelector("#evidenceState").textContent = evidenceMessages[safeState];
}

setEvidenceState("loading");
let fixture;

async function initialise() {
  try {
    const response = await fetch(FIXTURE_URL);
    if (!response.ok) throw new Error(`Fixture request returned ${response.status}`);
    fixture = await response.json();
    assertFixture(fixture);
    renderBrain(fixture);
    renderRecord(fixture);
    wireEvidenceTest();
    wireCorrection();
    wireScrollBuild();
    setEvidenceState(simulatedState);
  } catch (error) {
    setEvidenceState("error");
    document.querySelector("#evidenceState").textContent = "Source check unavailable. Last known record remains readable.";
    console.error(error);
  }
}

function assertFixture(data) {
  const counts = [data.items?.length, data.relationships?.length, data.sources?.length, data.corrections?.length];
  if (counts.join(",") !== "20,18,10,3") throw new Error(`Unexpected fixture counts: ${counts.join(",")}`);
}

function humanise(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function renderBrain(data) {
  const field = document.querySelector("#meaningField");
  const svg = document.querySelector("#relationshipField");
  const itemById = new Map(data.items.map((item) => [item.id, item]));
  const focusIds = new Set(["BI-003", "BI-007", "BI-010", "BI-018"]);

  for (const relationship of data.relationships) {
    const from = itemById.get(relationship.from);
    const to = itemById.get(relationship.to);
    if (!from || !to) continue;
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", from.x);
    line.setAttribute("y1", from.y);
    line.setAttribute("x2", to.x);
    line.setAttribute("y2", to.y);
    if (focusIds.has(from.id) && focusIds.has(to.id)) line.classList.add("is-focus");
    svg.append(line);
  }

  for (const item of data.items) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "meaning-node";
    button.dataset.id = item.id;
    button.style.setProperty("--x", `${item.x}%`);
    button.style.setProperty("--y", `${item.y}%`);
    button.setAttribute("aria-label", `${item.id}: ${item.title}`);
    button.setAttribute("aria-pressed", item.id === SELECTED_ID ? "true" : "false");
    if (item.id === SELECTED_ID) button.classList.add("is-active");
    const label = document.createElement("span");
    label.textContent = item.title;
    button.append(label);
    button.addEventListener("click", () => selectMeaning(item));
    field.append(button);
  }

  function selectMeaning(item) {
    for (const node of field.querySelectorAll(".meaning-node")) {
      const active = node.dataset.id === item.id;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", active ? "true" : "false");
    }
    document.querySelector("#inspectorId").textContent = `${item.id} / ${humanise(item.type)}`;
    document.querySelector("#inspectorTitle").textContent = item.title;
    document.querySelector("#inspectorStatement").textContent = item.statement;
    document.querySelector("#inspectorStanding").textContent = humanise(item.standing);
    document.querySelector("#inspectorConfidence").textContent = `${humanise(item.confidence)} evidence`;
  }
}

function renderRecord(data) {
  const targets = [
    ["#allMeanings", data.items, (item) => [item.id, `${item.title}. ${item.statement}`]],
    ["#allRelationships", data.relationships, (item) => [item.id, `${item.from} ${humanise(item.type).toLowerCase()} ${item.to}. ${item.meaning}`]],
    ["#allSources", data.sources, (item) => [item.id, `${item.label}. ${item.assertion}`]],
    ["#allCorrections", data.corrections, (item) => [item.id, `${item.item_ref}, version ${item.from_version} to ${item.to_version}. ${item.summary}`]]
  ];
  for (const [selector, records, copy] of targets) {
    const list = document.querySelector(selector);
    for (const record of records) {
      const [id, valueText] = copy(record);
      const li = document.createElement("li");
      const key = document.createElement("b");
      const value = document.createElement("span");
      key.textContent = id;
      value.textContent = valueText;
      li.append(key, value);
      list.append(li);
    }
  }
}

function wireEvidenceTest() {
  const button = document.querySelector("#maskSource");
  button.addEventListener("click", () => {
    const masked = document.body.dataset.mask !== "true";
    document.body.dataset.mask = masked ? "true" : "false";
    button.setAttribute("aria-pressed", masked ? "true" : "false");
    button.querySelector("span").textContent = masked ? "Restore SRC-002" : "Test without SRC-002";
    button.querySelector("b").textContent = masked ? "Restore source" : "Mask source";
    document.querySelector("#sourceTwoState").textContent = masked ? "Temporarily masked" : "Current source";
    document.querySelector("#meaningSupport").textContent = masked
      ? "Still supported by SRC-010. Canonical confidence remains direct."
      : "Supported by SRC-002 and SRC-010. Canonical confidence: direct.";
    document.querySelector("#rel003State").textContent = masked
      ? "Supported through SRC-010"
      : "Supported by SRC-002 and SRC-010";
    for (const selector of ["#rel009State", "#rel010State"]) {
      const element = document.querySelector(selector);
      element.textContent = masked ? "Challenged. Its only fixture evidence is SRC-002." : "Supported by SRC-002";
      element.classList.toggle("is-challenged", masked);
    }
    document.querySelector("#inspectionNote").textContent = masked
      ? "Inspection only. BI-003 stays current; two relationships are challenged."
      : "Temporary inspection. The Brain does not change.";
  });
}

function wireCorrection() {
  const button = document.querySelector("#replayCorrection");
  button.addEventListener("click", () => {
    const replay = document.body.dataset.correction !== "replay";
    document.body.dataset.correction = replay ? "replay" : "current";
    button.setAttribute("aria-pressed", replay ? "true" : "false");
    button.querySelector("span").textContent = replay ? "Return to current v2" : "Replay founder correction";
    button.querySelector("b").textContent = replay ? "Current state" : "v1 to v2";
    document.querySelector("#correctionStatus").textContent = replay
      ? "Replay shows the recorded narrowing from v1 to v2."
      : "Current v2 is in focus.";
  });
}

function wireScrollBuild() {
  const scenes = [...document.querySelectorAll(".scene")];
  const links = [...document.querySelectorAll("[data-phase-link]")];
  let frame = 0;
  const update = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;
    let current = scenes[0];
    let nearest = Number.POSITIVE_INFINITY;
    for (const scene of scenes) {
      const rect = scene.getBoundingClientRect();
      const progress = renderFinal
        ? 1
        : Math.max(0, Math.min(1, (viewportHeight * .88 - rect.top) / Math.max(viewportHeight * .76, rect.height * .62)));
      scene.style.setProperty("--section-p", progress.toFixed(3));
      for (const instrument of scene.querySelectorAll(".instrument, .mobile-path")) {
        instrument.style.setProperty("--p", progress.toFixed(3));
      }
      scene.dataset.build = progress < .08 ? "idle" : progress < .78 ? "building" : "built";
      const distance = Math.abs(rect.top + rect.height * .35 - viewportHeight * .5);
      if (distance < nearest) {
        nearest = distance;
        current = scene;
      }
    }
    for (const link of links) {
      if (link.dataset.phaseLink === current.dataset.phase) link.setAttribute("aria-current", "step");
      else link.removeAttribute("aria-current");
    }
  };
  const requestUpdate = () => {
    if (frame) return;
    frame = requestAnimationFrame(update);
  };
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  update();
}

initialise();
