(() => {
  const storageKey = "mindmake-homepage-history-console-v2";
  const legacyKey = "mindmake-homepage-history-combination-v1";
  const stories = [
    { name: "Writing", era: "370 BC · Writing", image: "../../new-age-leadership/media/history-writing-s2.webp", alt: "An illustrative historical writing scene" },
    { name: "Engine loom", era: "1675 · Engine loom", image: "../../new-age-leadership/media/history-loom-s2.webp", alt: "An illustrative mechanised loom scene" },
    { name: "Calculator", era: "1970s · Calculator", image: "../../new-age-leadership/media/history-calculator-s2.webp", alt: "An illustrative classroom calculator scene" },
    { name: "Satnav", era: "2000s · Satnav", image: "../../new-age-leadership/media/history-satnav-s2.webp", alt: "An illustrative early satellite navigation scene" }
  ];

  const decisions = [
    { key: "desktopComposition", group: "Structure", title: "How should the story sit on desktop?", context: "The whole composition changes in the live preview.", focus: "story", options: [["editorial", "Editorial split"], ["cinematic", "Cinematic overlay"], ["banded", "Paper prelude"]] },
    { key: "mobileComposition", group: "Structure", title: "How should the story compress on mobile?", context: "Switch the preview to Mobile to compare this choice at the real proportion.", focus: "bridge", device: "mobile", options: [["integrated", "Integrated one-screen lens"], ["prelude", "Brief prelude, then lens"], ["first-frame", "Bridge inside first story"]] },
    { key: "desktopCopyPosition", group: "Structure", title: "Where should the story copy sit on desktop?", context: "The image and controls rebalance around this position.", focus: "story", device: "desktop", options: [["left", "Left"], ["right", "Right"]] },
    { key: "desktopHeadlineScale", group: "Structure", title: "How large should desktop story headlines feel?", context: "Compare impact against readable line length.", focus: "question", device: "desktop", options: [["balanced", "Balanced"], ["large", "Large"]] },
    { key: "mobileHeadlineScale", group: "Structure", title: "How large should mobile story headlines feel?", context: "This controls reading pace without adding more page length.", focus: "question", device: "mobile", options: [["balanced", "Balanced"], ["compact", "Compact"]] },
    { key: "controlTreatment", group: "Structure", title: "How should people move between stories?", context: "The highlighted rail is the only element changing.", focus: "controls", options: [["era", "Era rail"], ["count", "Numbered rail"], ["titles", "Title rail"]] },
    { key: "storyTransition", group: "Structure", title: "How should one story give way to the next?", context: "Choose the rhythm. Reduced-motion preferences still remove animation.", focus: "story", options: [["dissolve", "Dissolve"], ["slide", "Directional slide"], ["cut", "Clean cut"]] },

    { key: "bridgeHeadline", group: "Chapter", title: "What opens the historical chapter?", context: "This is the bridge from the present-day premise into the four stories.", focus: "bridge", options: [["You are not the first person to wonder what a new tool might take from you.", "You are not the first person to wonder what a new tool might take from you."], ["Every powerful tool changes what people fear losing.", "Every powerful tool changes what people fear losing."], ["AI is not the first tool to make people question their place.", "AI is not the first tool to make people question their place."]] },
    { key: "bridgeLine", group: "Chapter", title: "Does the bridge need a second line?", context: "Select Remove it if the headline already does the work.", focus: "bridge", options: [["We have been asking that question for centuries.", "We have been asking that question for centuries."], ["The technology changes. The human question does not.", "The technology changes. The human question does not."], ["", "Remove it"]] },
    { key: "bridgeTreatment", group: "Chapter", title: "How should the bridge differ from each historical question?", context: "The two lines should not compete in the same typographic voice and scale.", focus: "bridge", story: 0, device: "desktop", options: [["contrast", "Compact modern bridge, editorial story"], ["marker", "Small editorial marker, large story"], ["same-serif", "Same editorial voice"]] },
    { key: "outcomeLabel", group: "Chapter", title: "How should each resolution be introduced?", context: "This small label repeats across all four stories.", focus: "outcome", options: [["What changed", "What changed"], ["What happened", "What happened"], ["The result", "The result"], ["", "Remove it"]] },
    { key: "closingHinge", group: "Chapter", title: "What turns the history back towards AI?", context: "This is the final hinge into the next section.", focus: "hinge", device: "desktop", options: [["The feeling is familiar. The reach is new.", "The feeling is familiar. The reach is new."], ["The old question returns at a different scale.", "The old question returns at a different scale."], ["AI reaches further. Your boundary has to become clearer.", "AI reaches further. Your boundary has to become clearer."], ["", "Remove it"]] },

    { key: "questionWriting", group: "Questions", title: "What is the fear in the writing story?", context: "Writing is shown automatically so the choice stays in context.", focus: "question", story: 0, options: [["If knowledge lives outside us, will memory grow weaker?", "If knowledge lives outside us, will memory grow weaker?"], ["When writing holds the words, what happens to memory?", "When writing holds the words, what happens to memory?"], ["If the page remembers for us, do we remember less?", "If the page remembers for us, do we remember less?"]] },
    { key: "questionLoom", group: "Questions", title: "What is the fear in the engine loom story?", context: "The engine loom is shown automatically.", focus: "question", story: 1, options: [["If the machine can do the work, what happens to the worker?", "If the machine can do the work, what happens to the worker?"], ["When the machine takes the skill, who keeps the value?", "When the machine takes the skill, who keeps the value?"], ["If output rises, who gets the gain?", "If output rises, who gets the gain?"]] },
    { key: "questionCalculator", group: "Questions", title: "What is the fear in the calculator story?", context: "The calculator is shown automatically.", focus: "question", story: 2, options: [["If the device does the arithmetic, will children stop learning to think?", "If the device does the arithmetic, will children stop learning to think?"], ["When the calculator does the sum, what should children still learn?", "When the calculator does the sum, what should children still learn?"], ["If the machine gives the answer, do we lose the thinking?", "If the machine gives the answer, do we lose the thinking?"]] },
    { key: "questionSatnav", group: "Questions", title: "What is the fear in the satnav story?", context: "Satnav is shown automatically.", focus: "question", story: 3, options: [["If the device knows the route, will we lose our sense of direction?", "If the device knows the route, will we lose our sense of direction?"], ["When the map tells us where to turn, what stops being practised?", "When the map tells us where to turn, what stops being practised?"], ["If the route is always given, do we still learn the way?", "If the route is always given, do we still learn the way?"]] },

    { key: "outcomeWriting", group: "Outcomes", title: "What happened after writing arrived?", context: "Keep the explanation plain, useful and proportionate.", focus: "outcome", story: 0, options: [["Ideas could travel beyond one voice and survive their maker. We changed what memory was for.", "Ideas could travel beyond one voice and survive their maker. We changed what memory was for."], ["Writing did not end memory. It changed the work memory had to do.", "Writing did not end memory. It changed the work memory had to do."], ["Knowledge could travel, accumulate and outlive the person who first held it.", "Knowledge could travel, accumulate and outlive the person who first held it."]] },
    { key: "outcomeLoom", group: "Outcomes", title: "What happened after the engine loom arrived?", context: "The engine loom is shown automatically.", focus: "outcome", story: 1, options: [["The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain.", "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain."], ["The machine changed whose skill counted, who earned and who controlled the output.", "The machine changed whose skill counted, who earned and who controlled the output."], ["Workers were right to worry about wages and status. The gain depended on who owned the machine.", "Workers were right to worry about wages and status. The gain depended on who owned the machine."]] },
    { key: "outcomeCalculator", group: "Outcomes", title: "What happened after calculators arrived?", context: "The calculator is shown automatically.", focus: "outcome", story: 2, options: [["A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer.", "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer."], ["Basic skills did not collapse. The useful question became whether children understood the answer.", "Basic skills did not collapse. The useful question became whether children understood the answer."], ["The calculator changed what good learning looked like. Understanding mattered more than repeating every sum.", "The calculator changed what good learning looked like. Understanding mattered more than repeating every sum."]] },
    { key: "outcomeSatnav", group: "Outcomes", title: "What happened after satnav arrived?", context: "Satnav is shown automatically.", focus: "outcome", story: 3, options: [["That risk turned out to be real. A useful tool still asks us what we choose to keep practising.", "That risk turned out to be real. A useful tool still asks us what we choose to keep practising."], ["The tool made navigation easier, but habitual use can weaken the spatial memory we stop exercising.", "The tool made navigation easier, but habitual use can weaken the spatial memory we stop exercising."], ["Satnav solved the route and exposed the trade-off. Convenience can remove a skill we still value.", "Satnav solved the route and exposed the trade-off. Convenience can remove a skill we still value."]] }
  ];

  const groups = [...new Set(decisions.map((decision) => decision.group))];
  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  const storyFields = [["questionWriting", "outcomeWriting"], ["questionLoom", "outcomeLoom"], ["questionCalculator", "outcomeCalculator"], ["questionSatnav", "outcomeSatnav"]];
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
  if (!stored) {
    try { stored = { answers: JSON.parse(localStorage.getItem(legacyKey) || "null") }; } catch { stored = null; }
  }
  const requestedDecisionKey = new URLSearchParams(location.search).get("decision");
  const requestedDecisionIndex = decisions.findIndex((decision) => decision.key === requestedDecisionKey);
  const hasRequestedDecision = requestedDecisionIndex >= 0;
  const answers = { ...defaults, ...(stored?.answers || stored || {}) };
  const notes = { ...(stored?.notes || {}) };
  const requiresTypographyRecheck = Boolean((stored?.locked || stored?.recordVersion) && !stored?.answers?.bridgeTreatment);
  let comment = stored?.comment || "";
  let index = hasRequestedDecision ? requestedDecisionIndex : requiresTypographyRecheck ? decisions.findIndex((decision) => decision.key === "bridgeTreatment") : Number.isInteger(stored?.index) ? Math.min(stored.index, decisions.length - 1) : 0;
  let storyIndex = hasRequestedDecision && Number.isInteger(decisions[index].story) ? decisions[index].story : Number.isInteger(stored?.story) ? stored.story : 0;
  let device = hasRequestedDecision && decisions[index].device ? decisions[index].device : requiresTypographyRecheck ? "desktop" : stored?.device === "mobile" ? "mobile" : "desktop";
  let reviewMode = false;
  let locked = Boolean(stored?.locked && !requiresTypographyRecheck && !hasRequestedDecision);
  let recheckOnly = Boolean(requestedDecisionKey === "bridgeTreatment" || requiresTypographyRecheck);
  const feedbackRegister = document.createElement("output");
  feedbackRegister.hidden = true;
  feedbackRegister.dataset.feedbackRegister = "history";
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
    localStorage.setItem(storageKey, JSON.stringify({ answers, notes, comment, index, story: storyIndex, device, locked, recheckOnly, recordVersion: 4 }));
    window.setTimeout(() => {
      ui.saveState.classList.remove("is-saving");
      ui.saveState.querySelector("span").textContent = "Saved locally";
    }, 120);
  };

  const chooseDevice = (value, persist = true) => {
    device = value;
    ui.previewStage.dataset.deviceView = device;
    document.querySelectorAll("[data-device]").forEach((button) => button.classList.toggle("is-active", button.dataset.device === device));
    if (persist) save();
  };

  const chooseStory = (value, persist = true) => {
    storyIndex = Number(value);
    document.querySelectorAll("[data-story]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.story) === storyIndex));
    document.querySelectorAll("[data-era]").forEach((button) => button.toggleAttribute("aria-current", Number(button.dataset.era) === storyIndex));
    applyPreview();
    if (persist) save();
  };

  const applyPreview = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = answers[node.dataset.copy] || ""; });
    document.querySelectorAll("[data-optional-copy]").forEach((node) => {
      const value = answers[node.dataset.optionalCopy] || "";
      node.textContent = value;
      node.hidden = !value;
    });
    const [questionKey, outcomeKey] = storyFields[storyIndex];
    document.querySelectorAll("[data-story-question]").forEach((node) => { node.textContent = answers[questionKey]; });
    document.querySelectorAll("[data-story-outcome]").forEach((node) => { node.textContent = answers[outcomeKey]; });
    document.querySelectorAll("[data-story-era]").forEach((node) => { node.textContent = stories[storyIndex].era; });
    document.querySelectorAll("[data-story-count]").forEach((node) => { node.textContent = `0${storyIndex + 1}`; });
    document.querySelectorAll("[data-story-image]").forEach((image) => { image.src = stories[storyIndex].image; image.alt = stories[storyIndex].alt; });
    document.querySelectorAll("[data-era]").forEach((button) => {
      button.toggleAttribute("aria-current", Number(button.dataset.era) === storyIndex);
      button.querySelector("span").dataset.count = `0${Number(button.dataset.era) + 1}`;
    });
    document.querySelectorAll(".history-frame").forEach((frame) => {
      frame.dataset.desktopComposition = answers.desktopComposition;
      frame.dataset.mobileComposition = answers.mobileComposition;
      frame.dataset.desktopCopyPosition = answers.desktopCopyPosition;
      frame.dataset.desktopHeadlineScale = answers.desktopHeadlineScale;
      frame.dataset.mobileHeadlineScale = answers.mobileHeadlineScale;
      frame.dataset.controlTreatment = answers.controlTreatment;
      frame.dataset.storyTransition = answers.storyTransition;
      frame.dataset.bridgeTreatment = answers.bridgeTreatment;
    });
  };

  const applyFocus = (focus) => {
    document.querySelectorAll(".history-frame").forEach((frame) => {
      frame.classList.toggle("has-focus", Boolean(focus));
      frame.querySelectorAll("[data-focus-region]").forEach((node) => node.classList.toggle("is-focused", node.dataset.focusRegion === focus));
      frame.querySelector(".story-copy")?.classList.toggle("has-child-focus", focus === "question" || focus === "outcome");
    });
  };

  const renderGroups = (activeGroup) => {
    ui.groupNav.innerHTML = groups.map((group) => `<button type="button" data-group="${group}" class="${group === activeGroup ? "is-active" : ""}">${group}</button>`).join("");
    ui.groupNav.querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
      reviewMode = false;
      index = decisions.findIndex((decision) => decision.group === button.dataset.group);
      render();
      save();
    }));
  };

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
    ui.options.innerHTML = `<div class="review-list">${groups.map((group) => {
      const groupDecisions = decisions.filter((decision) => decision.group === group);
      const noted = groupDecisions.filter((decision) => notes[decision.key]?.trim());
      return `<button type="button" data-review-group="${group}"><small>${String(groupDecisions.length).padStart(2, "0")}</small><span>${group}: ${groupDecisions.map((decision) => decision.options.find(([value]) => value === answers[decision.key])?.[1] || "Remove it").join(" · ")}${noted.length ? `<em>${noted.length} decision note${noted.length === 1 ? "" : "s"} preserved</em>${noted.map((decision) => `<mark><b>${escapeHtml(decision.title)}</b>${escapeHtml(notes[decision.key])}</mark>`).join("")}` : ""}</span></button>`;
    }).join("")}</div><label class="overall-note-label" for="historyComment">Overall note</label><textarea id="historyComment" rows="2" placeholder="Optional overall note" style="width:100%;margin-top:6px;padding:10px;color:#eee2cc;border:1px solid rgba(157,240,200,.2);background:#04110c;resize:none;font:11px/1.35 Archivo">${escapeHtml(comment)}</textarea>`;
    ui.options.querySelectorAll("[data-review-group]").forEach((button) => button.addEventListener("click", () => {
      reviewMode = false;
      locked = false;
      index = decisions.findIndex((decision) => decision.group === button.dataset.reviewGroup);
      render();
      save();
    }));
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
    if (Number.isInteger(decision.story)) chooseStory(decision.story, false);
    if (decision.device) chooseDevice(decision.device, false);
    renderGroups(decision.group);
    ui.progressCount.textContent = `${String(index + 1).padStart(2, "0")} / ${decisions.length}`;
    ui.progressBar.style.width = `${((index + 1) / decisions.length) * 100}%`;
    ui.group.textContent = decision.group;
    ui.title.textContent = decision.title;
    ui.titleCopy.textContent = decision.title;
    ui.context.textContent = decision.context;
    ui.options.innerHTML = `${decision.options.map(([value, label], optionIndex) => `<label class="decision-option" data-letter="${String.fromCharCode(65 + optionIndex)}"><input type="radio" name="${decision.key}" value="${value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")}" ${answers[decision.key] === value ? "checked" : ""}><span>${label}</span></label>`).join("")}<label class="decision-note"><span>Optional note on this decision</span><textarea rows="2" data-decision-note placeholder="Add context, a correction or a condition">${(notes[decision.key] || "").replaceAll("&", "&amp;").replaceAll("<", "&lt;")}</textarea></label>`;
    ui.options.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => {
      answers[decision.key] = input.value;
      locked = false;
      applyPreview();
      save();
    }));
    ui.options.querySelector("[data-decision-note]").addEventListener("input", (event) => {
      notes[decision.key] = event.target.value;
      locked = false;
      save();
    });
    ui.prev.disabled = index === 0;
    ui.prev.textContent = "Previous";
    ui.next.innerHTML = recheckOnly && decisions[index].key === "bridgeTreatment" ? "Review this correction <span>→</span>" : index === decisions.length - 1 ? "Review choices <span>→</span>" : "Next decision <span>→</span>";
    applyPreview();
    applyFocus(decision.focus);
  };

  document.querySelectorAll("[data-device]").forEach((button) => button.addEventListener("click", () => chooseDevice(button.dataset.device)));
  document.querySelectorAll("[data-story]").forEach((button) => button.addEventListener("click", () => chooseStory(button.dataset.story)));
  document.querySelectorAll("[data-era]").forEach((button) => button.addEventListener("click", () => chooseStory(button.dataset.era)));
  ui.prev.addEventListener("click", () => {
    if (reviewMode) { reviewMode = false; index = decisions.length - 1; }
    else index = Math.max(0, index - 1);
    render();
    save();
  });
  ui.next.addEventListener("click", () => {
    if (reviewMode) {
      locked = true;
      const cleanNotes = Object.fromEntries(Object.entries(notes).filter(([, value]) => value.trim()));
      const clean = { ...answers, ...(Object.keys(cleanNotes).length ? { feedback: JSON.stringify(cleanNotes) } : {}), ...(comment.trim() ? { overallFeedback: comment.trim() } : {}) };
      history.replaceState(null, "", `#${new URLSearchParams(clean)}`);
      save();
      renderReview();
      return;
    }
    if (recheckOnly && decisions[index].key === "bridgeTreatment") { recheckOnly = false; renderReview(); save(); }
    else if (index === decisions.length - 1) renderReview();
    else { index += 1; render(); save(); }
  });
  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "ArrowRight") ui.next.click();
    if (event.altKey && event.key === "ArrowLeft") ui.prev.click();
  });

  chooseDevice(device, false);
  chooseStory(storyIndex, false);
  if (locked) renderReview(); else render();
})();
