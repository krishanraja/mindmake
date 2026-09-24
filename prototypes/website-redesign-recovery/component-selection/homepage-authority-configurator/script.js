(() => {
  const storageKey = "mindmake-homepage-authority-console-v1";
  const aiLong = ["Gather", "Connect", "Compare", "Monitor", "Model", "Reconcile", "Prepare", "Retrieve", "Route", "Update"];
  const aiShort = ["Gather", "Connect", "Prepare", "Monitor"];
  const humanLong = ["Intent", "Taste", "Judgement", "Method", "Relationships", "Context", "Accountability", "Exceptions", "Ethics", "Decision"];
  const humanShort = ["Intent", "Standards", "Exceptions", "Decision"];
  const decisions = [
    { key: "desktopLayout", group: "Layout", title: "How should copy and instrument share desktop?", context: "These are the built split, reversed and full-stage compositions.", focus: "", device: "desktop", options: [["balanced", "Copy left, instrument right"], ["stage-first", "Instrument left, copy right"], ["full-stage", "Copy above a wide instrument"]] },
    { key: "mobileLayout", group: "Layout", title: "How should the organisation become a mobile-native composition?", context: "The rejected tall chart is gone. Each option is bounded to one phone screen.", focus: "instrument", device: "mobile", phase: "organisation", options: [["network", "One-screen network"], ["focus-chain", "Brain-centred role chain"], ["role-rail", "Brain with horizontal role rail"]] },
    { key: "desktopHeadline", group: "Layout", title: "How large should the chapter headline feel on desktop?", context: "The measure remains controlled in both options.", focus: "copy", device: "desktop", options: [["balanced", "Balanced"], ["large", "Large"]] },
    { key: "mobileHeadline", group: "Layout", title: "How large should the chapter headline feel on mobile?", context: "Choose impact or a more compact reading pace.", focus: "copy", device: "mobile", options: [["balanced", "Balanced"], ["compact", "Compact"]] },
    { key: "desktopInstrumentScale", group: "Layout", title: "How much desktop space should the instrument command?", context: "The headline stays fixed while the instrument changes scale.", focus: "instrument", device: "desktop", options: [["balanced", "Balanced"], ["large", "Large"]] },
    { key: "mobileInstrumentScale", group: "Layout", title: "How much mobile space should the instrument command?", context: "The compact option protects short screens.", focus: "instrument", device: "mobile", options: [["balanced", "Balanced"], ["compact", "Compact"]] },
    { key: "controlStyle", group: "Layout", title: "How should Work and Organisation be selected?", context: "Every option remains direct, reversible and keyboard reachable.", focus: "controls", options: [["buttons", "Filled direct buttons"], ["rail", "Editorial progress rail"], ["compact", "Compact stage tabs"]] },
    { key: "defaultPhase", group: "Layout", title: "Which state should the chapter reveal first?", context: "The other state stays one direct action away.", focus: "instrument", options: [["work", "Work first"], ["organisation", "Organisation first"]] },

    { key: "chapterLabel", group: "Copy", title: "Does the chapter need its small opening label?", context: "Remove it if the transition already makes the shift clear.", focus: "copy", options: [["And now, AI", "And now, AI"], ["", "Remove it"]] },
    { key: "workHeadline", group: "Copy", title: "What should the Work state lead with?", context: "All three lines come from the approved New-age leadership work.", focus: "copy", phase: "work", options: [["The feeling is familiar. The reach is new.", "The feeling is familiar. The reach is new."], ["Give AI the repeatable work. Keep the decisions that shape the business.", "Give AI the repeatable work. Keep the decisions that shape the business."], ["AI can carry work that used to look like thinking. So you need a boundary you can see.", "AI can carry work that used to look like thinking. So you need a boundary you can see."]] },
    { key: "workPromise", group: "Copy", title: "What should explain the Work state?", context: "Select Remove it if the headline and instrument already carry the idea.", focus: "copy", phase: "work", options: [["AI can carry work that used to look like thinking, across the business from one decision to the next.", "AI can carry work that used to look like thinking, across the business from one decision to the next."], ["AI can carry work that used to look like thinking. So you need a boundary you can see.", "AI can carry work that used to look like thinking. So you need a boundary you can see."], ["", "Remove it"]] },
    { key: "organisationHeadline", group: "Copy", title: "What should the Organisation state lead with?", context: "The preview changes to Organisation automatically.", focus: "copy", phase: "organisation", options: [["The organisation changes shape.", "The organisation changes shape."], ["Part people. Part agent. Led by judgement.", "Part people. Part agent. Led by judgement."], ["Meet the business you are becoming.", "Meet the business you are becoming."]] },
    { key: "organisationPromise", group: "Copy", title: "What should explain the Organisation state?", context: "Choose the shortest line that still makes the model clear.", focus: "copy", phase: "organisation", options: [["People hold judgement. The AI Brain connects the work.", "People hold judgement. The AI Brain connects the work."], ["A hybrid organisation does not ask you to think less. It helps you act on more of what you know.", "A hybrid organisation does not ask you to think less. It helps you act on more of what you know."], ["", "Remove it"]] },

    { key: "aiList", group: "Boundary", title: "How much should the AI-carries reel show?", context: "The long reel shows range. The short reel shows the original four-part boundary.", focus: "instrument", phase: "work", options: [["long", "Ten capabilities"], ["short", "Four foundation capabilities"]] },
    { key: "humanList", group: "Boundary", title: "How much should the You-keep reel show?", context: "The long reel includes taste, method and relationships. The short reel states the original boundary.", focus: "instrument", phase: "work", options: [["long", "Ten retained responsibilities"], ["short", "Four governing responsibilities"]] },
    { key: "reelMotion", group: "Boundary", title: "Should the capability reels keep moving?", context: "Movement remains suppressed by reduced-motion preferences.", focus: "instrument", phase: "work", options: [["moving", "Always moving while visible"], ["still", "Still lists"]] },
    { key: "aiLabel", group: "Boundary", title: "How should the system side be named?", context: "This is a governing label, not a decorative eyebrow.", focus: "instrument", phase: "work", options: [["AI carries", "AI carries"], ["AI can carry", "AI can carry"]] },
    { key: "humanLabel", group: "Boundary", title: "How should the human side be named?", context: "Choose whether the line speaks directly to the reader or describes the role.", focus: "instrument", phase: "work", options: [["You keep", "You keep"], ["People keep", "People keep"], ["Leaders keep", "Leaders keep"]] },

    { key: "organisationDetail", group: "Organisation", title: "How much detail should the organisation nodes carry?", context: "Concise is the adjudicated R5 treatment. Full restores the longer R4 descriptions.", focus: "instrument", phase: "organisation", options: [["concise", "Concise node descriptions"], ["full", "Full node descriptions"]] },
    { key: "organisationLabel", group: "Organisation", title: "Does the organisation instrument need a label?", context: "Remove it if the Organisation state already makes the meaning obvious.", focus: "instrument", phase: "organisation", options: [["New-age leadership", "New-age leadership"], ["Hybrid organisation", "Hybrid organisation"], ["", "Remove it"]] },
    { key: "filmLabel", group: "Organisation", title: "Should the illustrative-film disclosure remain visible?", context: "The film is atmosphere, not client evidence.", focus: "copy", options: [["Illustrative machinery", "Illustrative machinery"], ["", "Remove it"]] }
  ];

  const groups = [...new Set(decisions.map((decision) => decision.group))];
  const defaults = Object.fromEntries(decisions.map((decision) => [decision.key, decision.options[0][0]]));
  const ui = {
    previewStage: document.querySelector(".preview-stage"),
    groupNav: document.querySelector(".group-nav"),
    progressCount: document.querySelector("[data-progress-count]"),
    progressBar: document.querySelector("[data-progress-bar]"),
    group: document.querySelector("[data-decision-group]"),
    title: document.querySelector("[data-decision-title]"),
    titleCopy: document.querySelector("[data-decision-title-copy]"),
    context: document.querySelector("[data-decision-context]"),
    options: document.querySelector("[data-decision-options]"),
    card: document.querySelector(".decision-card"),
    prev: document.querySelector("[data-prev]"),
    next: document.querySelector("[data-next]"),
    saveState: document.querySelector(".save-state")
  };
  let stored = null;
  try { stored = JSON.parse(localStorage.getItem(storageKey)); } catch { stored = null; }
  const requestedDecisionKey = new URLSearchParams(location.search).get("decision");
  const requestedDecisionIndex = decisions.findIndex((decision) => decision.key === requestedDecisionKey);
  const hasRequestedDecision = requestedDecisionIndex >= 0;
  const answers = { ...defaults, ...(stored?.answers || {}) };
  if (!decisions.find((decision) => decision.key === "mobileLayout").options.some(([value]) => value === answers.mobileLayout)) answers.mobileLayout = defaults.mobileLayout;
  const notes = { ...(stored?.notes || {}) };
  const requiresMobileRecheck = Boolean(stored?.locked && stored?.recordVersion !== 3);
  let comment = stored?.comment || "";
  let index = hasRequestedDecision ? requestedDecisionIndex : requiresMobileRecheck ? 1 : Number.isInteger(stored?.index) ? Math.min(stored.index, decisions.length - 1) : 0;
  let phase = hasRequestedDecision && decisions[index].phase ? decisions[index].phase : requiresMobileRecheck ? "organisation" : stored?.phase === "organisation" ? "organisation" : "work";
  let device = hasRequestedDecision && decisions[index].device ? decisions[index].device : requiresMobileRecheck ? "mobile" : stored?.device === "mobile" ? "mobile" : "desktop";
  let reviewMode = false;
  let locked = Boolean(stored?.locked && !requiresMobileRecheck && !hasRequestedDecision);
  let recheckOnly = Boolean(requestedDecisionKey === "mobileLayout" || requiresMobileRecheck || (stored && !stored.locked && stored.index === 1 && stored.device === "mobile" && stored.phase === "organisation"));
  const feedbackRegister = document.createElement("output");
  feedbackRegister.hidden = true;
  feedbackRegister.dataset.feedbackRegister = "authority";
  document.body.append(feedbackRegister);
  const syncFeedbackRegister = () => {
    feedbackRegister.dataset.decisionNotes = JSON.stringify(Object.fromEntries(Object.entries(notes).filter(([, value]) => value.trim())));
    feedbackRegister.dataset.overallNote = comment;
    feedbackRegister.dataset.locked = String(locked);
  };
  syncFeedbackRegister();

  const save = () => {
    syncFeedbackRegister();
    ui.saveState.classList.add("is-saving");
    ui.saveState.querySelector("span").textContent = "Saving";
    localStorage.setItem(storageKey, JSON.stringify({ answers, notes, comment, index, phase, device, locked, recheckOnly, recordVersion: 3 }));
    window.setTimeout(() => { ui.saveState.classList.remove("is-saving"); ui.saveState.querySelector("span").textContent = "Saved locally"; }, 120);
  };
  const chooseDevice = (value, persist = true) => {
    device = value;
    ui.previewStage.dataset.deviceView = device;
    document.querySelectorAll("[data-device]").forEach((button) => button.classList.toggle("is-active", button.dataset.device === device));
    if (persist) save();
  };
  const choosePhase = (value, persist = true) => {
    phase = value;
    document.querySelectorAll(".authority-frame").forEach((frame) => { frame.dataset.phaseView = phase; });
    document.querySelectorAll("[data-phase]").forEach((button) => button.classList.toggle("is-active", button.dataset.phase === phase));
    document.querySelectorAll("[data-stage]").forEach((button) => button.toggleAttribute("aria-current", button.dataset.stage === phase));
    if (persist) save();
  };
  const renderLists = () => {
    const ai = answers.aiList === "short" ? aiShort : aiLong;
    const human = answers.humanList === "short" ? humanShort : humanLong;
    document.querySelectorAll("[data-ai-list]").forEach((node) => { node.innerHTML = ai.map((item) => `<span>${item}</span>`).join(""); node.classList.toggle("is-still", answers.reelMotion === "still"); });
    document.querySelectorAll("[data-human-list]").forEach((node) => { node.innerHTML = human.map((item) => `<span>${item}</span>`).join(""); node.classList.toggle("is-still", answers.reelMotion === "still"); });
  };
  const renderOrganisationDetail = () => {
    const detail = answers.organisationDetail === "full"
      ? { leader: "Direction · judgement", chief: "Trust · private context", brain: "Memory · connections", signals: "Watches what changes", marketing: "Person leads · Brain prepares", research: "People listen · Brain connects", sales: "Prepares · people build trust", brief: "One view of what matters" }
      : { leader: "Direction · judgement", chief: "Trust · context", brain: "Memory · links", signals: "Watches change", marketing: "Person leads", research: "People listen", sales: "People build trust", brief: "One view" };
    document.querySelectorAll("[data-detail]").forEach((node) => { node.textContent = detail[node.dataset.detail]; });
  };
  const applyPreview = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = answers[node.dataset.copy] || ""; });
    document.querySelectorAll("[data-optional-copy]").forEach((node) => { const value = answers[node.dataset.optionalCopy] || ""; node.textContent = value; node.hidden = !value; });
    document.querySelectorAll(".authority-frame").forEach((frame) => {
      frame.dataset.desktopLayout = answers.desktopLayout;
      frame.dataset.mobileLayout = answers.mobileLayout;
      frame.dataset.desktopHeadline = answers.desktopHeadline;
      frame.dataset.mobileHeadline = answers.mobileHeadline;
      frame.dataset.desktopInstrumentScale = answers.desktopInstrumentScale;
      frame.dataset.mobileInstrumentScale = answers.mobileInstrumentScale;
      frame.dataset.controlStyle = answers.controlStyle;
    });
    renderLists();
    renderOrganisationDetail();
    choosePhase(phase, false);
  };
  const applyFocus = (focus) => {
    document.querySelectorAll(".authority-frame").forEach((frame) => {
      frame.classList.toggle("has-focus", Boolean(focus));
      frame.querySelectorAll("[data-focus-region]").forEach((node) => node.classList.toggle("is-focused", node.dataset.focusRegion === focus));
    });
  };
  const renderGroups = (activeGroup) => {
    ui.groupNav.innerHTML = groups.map((group) => `<button type="button" data-group="${group}" class="${group === activeGroup ? "is-active" : ""}">${group}</button>`).join("");
    ui.groupNav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => { reviewMode = false; index = decisions.findIndex((decision) => decision.group === button.dataset.group); render(); save(); }));
  };
  const cleanText = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  const renderReview = () => {
    reviewMode = true;
    applyFocus("");
    renderGroups("");
    ui.progressCount.textContent = "Ready to submit";
    ui.progressBar.style.width = "100%";
    ui.card.classList.add("is-review");
    ui.group.textContent = "Readback";
    ui.title.textContent = locked ? "Selections submitted." : "Everything is together.";
    ui.titleCopy.textContent = ui.title.textContent;
    ui.context.textContent = locked ? "Your choices and notes are saved for reconciliation. This is not production approval." : "Four compact groups replace a long summary. Open any group to revise it.";
    ui.options.innerHTML = `<div class="review-list">${groups.map((group) => { const items = decisions.filter((decision) => decision.group === group); const noted = items.filter((decision) => notes[decision.key]?.trim()); return `<button type="button" data-review-group="${group}"><small>${String(items.length).padStart(2, "0")}</small><span>${group}: ${items.map((decision) => decision.options.find(([value]) => value === answers[decision.key])?.[1] || "Remove it").join(" · ")}${noted.length ? `<em>${noted.length} decision note${noted.length === 1 ? "" : "s"} preserved</em>${noted.map((decision) => `<mark><b>${cleanText(decision.title)}</b>${cleanText(notes[decision.key])}</mark>`).join("")}` : ""}</span></button>`; }).join("")}</div><label class="overall-note-label" for="authorityComment">Overall note</label><textarea id="authorityComment" rows="2" placeholder="Optional overall note" style="width:100%;margin-top:6px;padding:10px;color:#eee2cc;border:1px solid rgba(157,240,200,.2);background:#04110c;resize:none;font:11px/1.35 Archivo">${cleanText(comment)}</textarea>`;
    ui.options.querySelectorAll("[data-review-group]").forEach((button) => button.addEventListener("click", () => { reviewMode = false; locked = false; index = decisions.findIndex((decision) => decision.group === button.dataset.reviewGroup); render(); save(); }));
    ui.options.querySelector("textarea").addEventListener("input", (event) => { comment = event.target.value; locked = false; save(); });
    ui.prev.disabled = false;
    ui.prev.textContent = "Back to choices";
    ui.next.innerHTML = locked ? "Submitted for reconciliation <span>✓</span>" : "Submit choices and notes <span>✓</span>";
  };
  const render = () => {
    if (reviewMode) { renderReview(); return; }
    const decision = decisions[index];
    locked = false;
    ui.card.classList.remove("is-review");
    if (decision.device) chooseDevice(decision.device, false);
    if (decision.phase) choosePhase(decision.phase, false);
    if (decision.key === "defaultPhase") choosePhase(answers.defaultPhase, false);
    renderGroups(decision.group);
    ui.progressCount.textContent = `${String(index + 1).padStart(2, "0")} / ${decisions.length}`;
    ui.progressBar.style.width = `${((index + 1) / decisions.length) * 100}%`;
    ui.group.textContent = decision.group;
    ui.title.textContent = decision.title;
    ui.titleCopy.textContent = decision.title;
    ui.context.textContent = decision.context;
    ui.options.innerHTML = `${decision.options.map(([value, label], optionIndex) => `<label class="decision-option" data-letter="${String.fromCharCode(65 + optionIndex)}"><input type="radio" name="${decision.key}" value="${cleanText(value)}" ${answers[decision.key] === value ? "checked" : ""}><span>${label}</span></label>`).join("")}<label class="decision-note"><span>Optional note on this decision</span><textarea rows="2" data-decision-note placeholder="Add context, a correction or a condition">${cleanText(notes[decision.key] || "")}</textarea></label>`;
    ui.options.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => { answers[decision.key] = input.value; if (decision.key === "defaultPhase") phase = input.value; locked = false; applyPreview(); save(); }));
    ui.options.querySelector("[data-decision-note]").addEventListener("input", (event) => { notes[decision.key] = event.target.value; locked = false; save(); });
    ui.prev.disabled = index === 0;
    ui.prev.textContent = "Previous";
    ui.next.innerHTML = recheckOnly && index === 1 ? "Review this correction <span>→</span>" : index === decisions.length - 1 ? "Review choices <span>→</span>" : "Next decision <span>→</span>";
    applyPreview();
    applyFocus(decision.focus);
  };

  document.querySelectorAll("[data-device]").forEach((button) => button.addEventListener("click", () => chooseDevice(button.dataset.device)));
  document.querySelectorAll("[data-phase]").forEach((button) => button.addEventListener("click", () => choosePhase(button.dataset.phase)));
  document.querySelectorAll("[data-stage]").forEach((button) => button.addEventListener("click", () => choosePhase(button.dataset.stage)));
  ui.prev.addEventListener("click", () => { if (reviewMode) { reviewMode = false; index = decisions.length - 1; } else index = Math.max(0, index - 1); render(); save(); });
  ui.next.addEventListener("click", () => {
    if (reviewMode) { const cleanNotes = Object.fromEntries(Object.entries(notes).filter(([, value]) => value.trim())); locked = true; history.replaceState(null, "", `#${new URLSearchParams({ ...answers, ...(Object.keys(cleanNotes).length ? { feedback: JSON.stringify(cleanNotes) } : {}), ...(comment.trim() ? { overallFeedback: comment.trim() } : {}) })}`); save(); renderReview(); return; }
    if (recheckOnly && index === 1) { recheckOnly = false; renderReview(); save(); return; }
    if (index === decisions.length - 1) renderReview(); else { index += 1; render(); save(); }
  });
  document.addEventListener("keydown", (event) => { if (event.altKey && event.key === "ArrowRight") ui.next.click(); if (event.altKey && event.key === "ArrowLeft") ui.prev.click(); });
  chooseDevice(device, false);
  choosePhase(phase, false);
  if (locked) renderReview(); else render();
})();
