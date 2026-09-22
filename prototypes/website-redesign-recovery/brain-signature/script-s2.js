const FIXTURE_URL_S2 = "../../ai-brain-vnext-r5/brain-fixture.json";
const SELECTED_ID_S2 = "BI-003";
const paramsS2 = new URLSearchParams(window.location.search);
const simulatedStateS2 = paramsS2.get("state") || "ready";
const renderFinalS2 = paramsS2.get("render") === "final";
const reducedMotionS2 = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.body.classList.remove("no-js");
document.body.dataset.sourceTest = "false";
document.body.dataset.correction = "current";
document.body.dataset.recordPaused = reducedMotionS2 || renderFinalS2 ? "true" : "false";
document.documentElement.dataset.render = renderFinalS2 ? "final" : "live";

const evidenceMessagesS2 = {
  ready: "Current record. Ten sources connected.",
  loading: "Checking the record. The last known version remains readable.",
  stale: "The source check is older than expected. The last known version remains readable.",
  error: "The source check is unavailable. The last known version remains readable.",
  recovery: "Connection restored. The record is current."
};

const plainStatements = {
  "BI-001": "Build systems that help more people make better decisions.",
  "BI-002": "Spot newly possible work before old habits make it obvious.",
  "BI-003": "People stay accountable for work that reaches the outside world.",
  "BI-004": "Repeated clicks, copying and explanation reveal where the system needs work.",
  "BI-005": "Seeing what is possible early can make old ways of working feel painfully slow.",
  "BI-006": "Work with leaders who want to reshape their category, not defend the old one.",
  "BI-007": "Let AI carry repeatable information work. Keep standards, relationships, strategy and final craft human.",
  "BI-008": "Missing numbers and lookalike thinking are warning signs.",
  "BI-009": "The system should preserve a person's voice, standards and exceptions.",
  "BI-010": "Turn good judgement into standards that other people can use without becoming copies.",
  "BI-011": "Put the time saved back into customers and the people affected by the work.",
  "BI-012": "Build with leaders who are already ready to move.",
  "BI-013": "Redesign the work before drawing conclusions about the people doing it.",
  "BI-014": "Future teams may need builders with agency, taste and strong systems around them.",
  "BI-015": "Bring genuinely different options into the room so people can spend their time judging.",
  "BI-016": "See where culture is saturated, what is missing and what might emerge next.",
  "BI-017": "Changing a mind is not enough when the surrounding system still rewards the old behaviour.",
  "BI-018": "A second AI can check the work. It cannot make the final call.",
  "BI-019": "The leader owns the Brain. The company gains from the decisions it improves.",
  "BI-020": "Help capable people become more discerning, more agentic and less generic."
};

function setEvidenceStateS2(state) {
  const safeState = Object.hasOwn(evidenceMessagesS2, state) ? state : "ready";
  document.documentElement.dataset.evidenceState = safeState;
  document.querySelector("#evidenceStateS2").textContent = evidenceMessagesS2[safeState];
}

function humaniseS2(value) {
  return value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function plainStanding(item) {
  const standing = item.standing === "accepted" ? "Accepted thinking" : "Working thinking";
  const confidence = item.confidence === "direct" ? "backed by direct evidence" : "supported by the record";
  return `${standing}, ${confidence}`;
}

function assertFixtureS2(data) {
  const counts = [data.items?.length, data.relationships?.length, data.sources?.length, data.corrections?.length];
  if (counts.join(",") !== "20,18,10,3") throw new Error(`Unexpected fixture counts: ${counts.join(",")}`);
}

function renderBrainS2(data) {
  const field = document.querySelector("#meaningFieldS2");
  const svg = document.querySelector("#relationshipFieldS2");
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
    button.className = "meaning-node-s2";
    button.dataset.id = item.id;
    button.style.setProperty("--x", `${item.x}%`);
    button.style.setProperty("--y", `${item.y}%`);
    button.setAttribute("aria-label", `${item.title}. ${plainStatements[item.id] || item.statement}`);
    button.setAttribute("aria-pressed", item.id === SELECTED_ID_S2 ? "true" : "false");
    if (item.id === SELECTED_ID_S2) button.classList.add("is-active");
    const label = document.createElement("span");
    label.textContent = item.title;
    button.append(label);
    button.addEventListener("click", () => selectMeaningS2(item));
    field.append(button);
  }

  function selectMeaningS2(item) {
    for (const node of field.querySelectorAll(".meaning-node-s2")) {
      const active = node.dataset.id === item.id;
      node.classList.toggle("is-active", active);
      node.setAttribute("aria-pressed", active ? "true" : "false");
    }
    document.querySelector("#inspectorKindS2").textContent = "What the Brain remembers";
    document.querySelector("#inspectorTitleS2").textContent = item.title;
    document.querySelector("#inspectorStatementS2").textContent = plainStatements[item.id] || item.statement;
    document.querySelector("#inspectorStandingS2").textContent = plainStanding(item);
  }
}

function createRecordSetS2(data) {
  const itemById = new Map(data.items.map((item) => [item.id, item]));
  const ideas = data.items.map((item) => ({
    kind: "Idea",
    id: item.id,
    title: item.title,
    detail: plainStatements[item.id] || item.statement
  }));
  const connections = data.relationships.map((relationship) => ({
    kind: "Connection",
    id: relationship.id,
    title: `${itemById.get(relationship.from)?.title || relationship.from} → ${itemById.get(relationship.to)?.title || relationship.to}`,
    detail: relationship.meaning
  }));
  const sources = data.sources.map((source) => ({
    kind: "Evidence",
    id: source.id,
    title: source.label,
    detail: source.assertion
  }));
  const corrections = data.corrections.map((correction) => ({
    kind: "Change",
    id: correction.id,
    title: itemById.get(correction.item_ref)?.title || correction.item_ref,
    detail: correction.summary
  }));
  return [...ideas, ...connections, ...sources, ...corrections];
}

function renderRecordS2(data) {
  const records = createRecordSetS2(data);
  const reel = document.querySelector("#recordReelS2");
  const complete = document.querySelector("#completeRecordS2");
  const pauseButton = document.querySelector("#pauseRecordS2");
  const nextButton = document.querySelector("#nextRecordS2");
  let current = renderFinalS2 ? 2 : 0;
  let timer = 0;

  for (const record of records) {
    const li = document.createElement("li");
    li.className = "record-card";
    li.innerHTML = `<span>${record.kind}</span><div><strong></strong><small></small></div>`;
    li.querySelector("strong").textContent = record.title;
    li.querySelector("small").textContent = record.detail;
    reel.append(li);

    const accessible = document.createElement("p");
    accessible.textContent = `${record.kind}, ${record.id}: ${record.title}. ${record.detail}`;
    complete.append(accessible);
  }

  const cards = [...reel.children];
  function paint() {
    const cardHeight = cards[0]?.getBoundingClientRect().height || 66;
    const gap = Number.parseFloat(getComputedStyle(reel).rowGap) || 9;
    reel.style.setProperty("--reel-shift", `${current * (cardHeight + gap) + cardHeight / 2}px`);
    cards.forEach((card, index) => {
      const distance = Math.abs(index - current);
      card.classList.toggle("is-current", distance === 0);
      card.classList.toggle("is-near", distance === 1);
      card.setAttribute("aria-hidden", distance > 2 ? "true" : "false");
    });
    document.querySelector("#recordIndexS2").textContent = `${current + 1} of ${records.length}`;
  }

  function next() {
    current = (current + 1) % records.length;
    paint();
  }

  function stopTimer() {
    if (timer) window.clearInterval(timer);
    timer = 0;
  }

  function startTimer() {
    stopTimer();
    if (document.body.dataset.recordPaused !== "true" && !renderFinalS2) timer = window.setInterval(next, 1800);
  }

  pauseButton.textContent = document.body.dataset.recordPaused === "true" ? "Play" : "Pause";
  document.querySelector("#recordStateS2").textContent = document.body.dataset.recordPaused === "true" ? "Record paused" : "Live record";
  pauseButton.setAttribute("aria-pressed", document.body.dataset.recordPaused);
  pauseButton.addEventListener("click", () => {
    const paused = document.body.dataset.recordPaused !== "true";
    document.body.dataset.recordPaused = paused ? "true" : "false";
    pauseButton.setAttribute("aria-pressed", paused ? "true" : "false");
    pauseButton.textContent = paused ? "Play" : "Pause";
    document.querySelector("#recordStateS2").textContent = paused ? "Record paused" : "Live record";
    startTimer();
  });
  nextButton.addEventListener("click", () => {
    next();
    startTimer();
  });
  window.addEventListener("resize", paint);
  paint();
  startTimer();
}

function wireSourceTestS2() {
  const button = document.querySelector("#testSourceS2");
  button.addEventListener("click", () => {
    const testing = document.body.dataset.sourceTest !== "true";
    document.body.dataset.sourceTest = testing ? "true" : "false";
    button.setAttribute("aria-pressed", testing ? "true" : "false");
    button.querySelector("span").textContent = testing ? "Put the source back" : "Take one source away";
    button.querySelector("b").textContent = testing ? "Restore" : "Try it";
    document.querySelector("#sourceOneStateS2").textContent = testing ? "Temporarily removed" : "Connected";
    document.querySelector("#proofHeadlineS2").textContent = testing
      ? "The decision still holds."
      : "The decision is supported by both sources.";
    document.querySelector("#proofDetailS2").textContent = testing
      ? "One source still supports it. Two connected ideas need another look."
      : "Its connected thinking is clear.";
  });
}

function wireCorrectionS2() {
  const button = document.querySelector("#replayCorrectionS2");
  button.addEventListener("click", () => {
    const replay = document.body.dataset.correction !== "replay";
    document.body.dataset.correction = replay ? "replay" : "current";
    button.setAttribute("aria-pressed", replay ? "true" : "false");
    button.querySelector("span").textContent = replay ? "Return to the current view" : "Replay the change";
    button.querySelector("b").textContent = replay ? "Show now" : "Before → now";
    document.querySelector("#correctionStatusS2").textContent = replay
      ? "The earlier view is back in focus."
      : "The current view is in focus.";
  });
}

function wireScrollBuildS2() {
  const chapters = [...document.querySelectorAll(".chapter[data-phase]")];
  const links = [...document.querySelectorAll("[data-phase-link]")];
  let frame = 0;
  const update = () => {
    frame = 0;
    const viewportHeight = window.innerHeight;
    let current = chapters[0];
    let nearest = Number.POSITIVE_INFINITY;
    for (const chapter of chapters) {
      const rect = chapter.getBoundingClientRect();
      const progress = renderFinalS2
        ? 1
        : Math.max(0, Math.min(1, (viewportHeight * .82 - rect.top) / Math.max(viewportHeight * .72, rect.height * .62)));
      chapter.style.setProperty("--section-p", progress.toFixed(3));
      for (const instrument of chapter.querySelectorAll(".instrument")) instrument.style.setProperty("--p", progress.toFixed(3));
      chapter.dataset.build = progress < .08 ? "idle" : progress < .75 ? "building" : "built";
      const distance = Math.abs(rect.top + rect.height * .4 - viewportHeight * .5);
      if (distance < nearest) {
        nearest = distance;
        current = chapter;
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

async function initialiseS2() {
  setEvidenceStateS2("loading");
  try {
    const response = await fetch(FIXTURE_URL_S2);
    if (!response.ok) throw new Error(`Fixture request returned ${response.status}`);
    const fixture = await response.json();
    assertFixtureS2(fixture);
    renderBrainS2(fixture);
    renderRecordS2(fixture);
    wireSourceTestS2();
    wireCorrectionS2();
    wireScrollBuildS2();
    setEvidenceStateS2(simulatedStateS2);
  } catch (error) {
    setEvidenceStateS2("error");
    console.error(error);
  }
}

initialiseS2();
