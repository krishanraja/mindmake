(() => {
  const storageKey = "mindmake-homepage-leadership-dividend-console-v1";
  const practiceScenes = [
    {
      key: "notice",
      title: "It notices what changed.",
      copy: "Signals arrive before someone asks for a report.",
      image: "../../case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp"
    },
    {
      key: "connect",
      title: "It joins the evidence.",
      copy: "New information meets what the business already knows.",
      image: "../../case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp"
    },
    {
      key: "prepare",
      title: "It prepares the next move.",
      copy: "Useful work reaches you ready for a decision.",
      image: "../../case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp"
    }
  ];

  const benefits = [
    { key: "leadership", title: "Leadership updates become consistent, even when the week was not.", copy: "Your decisions, risks and priorities stay connected from one update to the next." },
    { key: "unowned", title: "Work nobody owns becomes visible before it becomes a problem.", copy: "The Brain joins the gaps across reports, meetings and decisions." },
    { key: "pricing", title: "A change in market pricing becomes a decision, not a forgotten observation.", copy: "It connects the signal to what your commercial team already knows." },
    { key: "writing", title: "A CEO who hates writing can still publish ideas worth following.", copy: "The blank page goes. Their judgement and voice stay." },
    { key: "numbers", title: "A CRO who hates the numbers can become better at using them.", copy: "The Brain prepares what changed, why it matters and where to look next." },
    { key: "founder", title: "Founder-led content can begin with the work, not another content calendar.", copy: "Useful thinking already inside the business becomes something people can see." }
  ];

  const returnItems = [
    "Ask the harder question.",
    "Spend more time with people.",
    "Make the consequential call earlier."
  ];

  const decisions = [
    { key: "desktopLayout", group: "Layout", title: "How should this chapter sit on desktop?", context: "Practice, benefits and the returned hour use the same spatial rule.", focus: "intro", device: "desktop", mode: "practice", options: [["balanced", "Balanced split"], ["copy-first", "Copy first"], ["cinematic", "Cinematic overlay"]] },
    { key: "mobileLayout", group: "Layout", title: "How should the chapter compress on mobile?", context: "Compare the real mobile proportion without adding page length.", focus: "story", device: "mobile", mode: "practice", options: [["overlay", "Integrated overlay"], ["copy-first", "Copy first"], ["compact", "Compact lens"]] },
    { key: "desktopTitle", group: "Layout", title: "How large should the main ideas feel on desktop?", context: "This applies to the three views, not just the one on screen.", focus: "intro", device: "desktop", mode: "practice", options: [["balanced", "Balanced"], ["large", "Large"]] },
    { key: "mobileTitle", group: "Layout", title: "How large should the main ideas feel on mobile?", context: "Choose impact without forcing unnecessary vertical space.", focus: "intro", device: "mobile", mode: "practice", options: [["balanced", "Balanced"], ["compact", "Compact"]] },
    { key: "defaultMode", group: "Layout", title: "Which idea should appear first?", context: "This chooses the chapter's first frame; all three remain in the sequence.", focus: "", options: [["practice", "How it works"], ["benefits", "What the Brain makes possible"], ["return", "The returned hour"]] },
    { key: "practiceControls", group: "Layout", title: "How should the three practice moments move?", context: "Only the stage control changes.", focus: "controls", mode: "practice", options: [["tabs", "Stage tabs"], ["arrows", "Directional controls"], ["rail", "Quiet rail"]] },
    { key: "benefitControls", group: "Layout", title: "How should people move through the benefits?", context: "The carousel remains bounded to one frame.", focus: "controls", mode: "benefits", options: [["arrows", "Arrow rail"], ["rail", "Quiet rail"], ["dots", "Minimal dots"]] },
    { key: "benefitMotion", group: "Layout", title: "When should the benefits start moving?", context: "Reduced-motion preferences always stop automatic movement.", focus: "benefit", mode: "benefits", options: [["rotate-entry", "Rotate on entry"], ["manual", "After first interaction"], ["still", "Manual only"]] },

    { key: "practiceLabel", group: "Practice", title: "Does the practice sequence need a label?", context: "Remove it if the headline already gives enough context.", focus: "intro", mode: "practice", options: [["What this feels like in practice", "What this feels like in practice"], ["", "Remove it"]] },
    { key: "practiceHeadline", group: "Practice", title: "What should the practice sequence say?", context: "This is the governing line above the three moments.", focus: "intro", mode: "practice", options: [["The system does not replace your judgement. It brings more to it.", "The system does not replace your judgement. It brings more to it."], ["Let the work move. Keep the understanding with you.", "Let the work move. Keep the understanding with you."], ["Part people. Part agent. Led by judgement.", "Part people. Part agent. Led by judgement."]] },
    { key: "sceneOrder", group: "Practice", title: "In what order should the work unfold?", context: "Use the stage controls in the preview to inspect each moment.", focus: "story", mode: "practice", options: [["notice-connect-prepare", "Notice · Connect · Prepare"], ["connect-notice-prepare", "Connect · Notice · Prepare"], ["prepare-notice-connect", "Prepare · Notice · Connect"]] },
    { key: "sceneCopy", group: "Practice", title: "Should each practice moment include one explanation?", context: "The explanation is one sentence and never expands the page.", focus: "story", mode: "practice", options: [["show", "Show it"], ["hide", "Headline only"]] },

    { key: "benefitLabel", group: "Benefits", title: "What should introduce the benefit carousel?", context: "This label stays fixed while the benefits rotate.", focus: "benefit", mode: "benefits", options: [["What your AI Brain makes possible", "What your AI Brain makes possible"], ["Make your judgement reusable.", "Make your judgement reusable."], ["", "Remove it"]] },
    { key: "benefitOrder", group: "Benefits", title: "Which benefit should people see first?", context: "The remaining benefits continue in a rotating carousel.", focus: "benefit", mode: "benefits", options: [["leadership-first", "Consistent leadership updates"], ["unowned-first", "Work nobody owns"], ["pricing-first", "Market-pricing patterns"]] },
    { key: "benefitCopy", group: "Benefits", title: "Should each benefit include one line of meaning?", context: "The headline remains the primary message.", focus: "benefit", mode: "benefits", options: [["show", "Show it"], ["hide", "Headline only"]] },
    { key: "benefitCount", group: "Benefits", title: "Should the carousel show its place in the sequence?", context: "This is navigation, not another explanatory label.", focus: "benefit", mode: "benefits", options: [["fraction", "01 / 06"], ["number", "01"], ["remove", "Remove it"]] },

    { key: "returnLabel", group: "Returned hour", title: "Does the final frame need a label?", context: "The headline can stand alone if you prefer.", focus: "return", mode: "return", options: [["The returned hour", "The returned hour"], ["", "Remove it"]] },
    { key: "returnHeadline", group: "Returned hour", title: "What question should close the chapter?", context: "This turns time saved into a leadership choice.", focus: "return", mode: "return", options: [["What will you do with the hours it gives back?", "What will you do with the hours it gives back?"], ["Let the work move. Keep the understanding with you.", "Let the work move. Keep the understanding with you."], ["What stays with you", "What stays with you"]] },
    { key: "returnList", group: "Returned hour", title: "How much should the final frame answer for the reader?", context: "Fewer lines make the question more open; all three make the dividend explicit.", focus: "return", mode: "return", options: [["all", "All three possibilities"], ["first-two", "First two only"], ["remove", "Question only"]] },
    { key: "returnLine", group: "Returned hour", title: "Does the final frame need a closing line?", context: "Remove it if the question and list already complete the thought.", focus: "return", mode: "return", options: [["A hybrid organisation does not ask you to think less. It helps you act on more of what you know.", "A hybrid organisation does not ask you to think less. It helps you act on more of what you know."], ["Build the first working version on real work. Keep the system.", "Build the first working version on real work. Keep the system."], ["", "Remove it"]] }
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
  const answers = { ...defaults, ...(stored?.answers || {}) };
  const notes = { ...(stored?.notes || {}) };
  let comment = stored?.comment || "";
  let index = Number.isInteger(stored?.index) ? Math.min(stored.index, decisions.length - 1) : 0;
  let device = stored?.device === "mobile" ? "mobile" : "desktop";
  let mode = ["practice", "benefits", "return"].includes(stored?.mode) ? stored.mode : answers.defaultMode;
  let practiceIndex = Number.isInteger(stored?.practiceIndex) ? stored.practiceIndex : 0;
  let benefitIndex = Number.isInteger(stored?.benefitIndex) ? stored.benefitIndex : 0;
  let reviewMode = false;
  let locked = Boolean(stored?.locked);
  let benefitTimer = 0;
  const feedbackRegister = document.createElement("output");
  feedbackRegister.hidden = true;
  feedbackRegister.dataset.feedbackRegister = "leadership-dividend";
  document.body.append(feedbackRegister);
  const syncFeedbackRegister = () => {
    feedbackRegister.dataset.decisionNotes = JSON.stringify(Object.fromEntries(Object.entries(notes).filter(([, value]) => value.trim())));
    feedbackRegister.dataset.overallNote = comment;
    feedbackRegister.dataset.locked = String(locked);
  };
  syncFeedbackRegister();

  const escapeHtml = (value) => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll('"', "&quot;");
  const practiceOrder = () => ({
    "notice-connect-prepare": [0, 1, 2],
    "connect-notice-prepare": [1, 0, 2],
    "prepare-notice-connect": [2, 0, 1]
  }[answers.sceneOrder] || [0, 1, 2]);
  const benefitOrder = () => {
    const first = { "leadership-first": 0, "unowned-first": 1, "pricing-first": 2 }[answers.benefitOrder] ?? 0;
    return [first, ...benefits.map((_, itemIndex) => itemIndex).filter((itemIndex) => itemIndex !== first)];
  };

  const save = () => {
    syncFeedbackRegister();
    ui.saveState.classList.add("is-saving");
    ui.saveState.querySelector("span").textContent = "Saving";
    localStorage.setItem(storageKey, JSON.stringify({ answers, notes, comment, index, device, mode, practiceIndex, benefitIndex, locked, recordVersion: 2 }));
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

  const chooseMode = (value, persist = true) => {
    mode = value;
    document.querySelectorAll("[data-mode]").forEach((button) => button.classList.toggle("is-active", button.dataset.mode === mode));
    document.querySelectorAll(".dividend-frame").forEach((frame) => { frame.dataset.modeView = mode; });
    restartBenefitMotion();
    if (persist) save();
  };

  const choosePractice = (visibleIndex, persist = true) => {
    practiceIndex = ((Number(visibleIndex) % 3) + 3) % 3;
    applyPreview();
    if (persist) save();
  };

  const chooseBenefit = (visibleIndex, persist = true) => {
    benefitIndex = ((Number(visibleIndex) % benefits.length) + benefits.length) % benefits.length;
    applyPreview();
    if (persist) save();
  };

  const restartBenefitMotion = () => {
    window.clearInterval(benefitTimer);
    benefitTimer = 0;
    if (mode !== "benefits" || answers.benefitMotion !== "rotate-entry" || matchMedia("(prefers-reduced-motion: reduce)").matches || document.hidden) return;
    benefitTimer = window.setInterval(() => chooseBenefit(benefitIndex + 1), 6200);
  };

  const applyPreview = () => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = answers[node.dataset.copy] || ""; });
    document.querySelectorAll("[data-optional-copy]").forEach((node) => {
      const value = answers[node.dataset.optionalCopy] || "";
      node.textContent = value;
      node.hidden = !value;
    });
    document.querySelectorAll(".dividend-frame").forEach((frame) => {
      frame.dataset.modeView = mode;
      frame.dataset.desktopLayout = answers.desktopLayout;
      frame.dataset.mobileLayout = answers.mobileLayout;
      frame.dataset.desktopTitle = answers.desktopTitle;
      frame.dataset.mobileTitle = answers.mobileTitle;
      frame.dataset.controlStyle = answers.practiceControls;
      frame.dataset.benefitControls = answers.benefitControls;
    });

    const orderedPractice = practiceOrder();
    const practiceScene = practiceScenes[orderedPractice[practiceIndex]];
    document.querySelectorAll("[data-practice-image]").forEach((image) => { image.src = practiceScene.image; });
    document.querySelectorAll("[data-practice-count]").forEach((node) => { node.textContent = `0${practiceIndex + 1} / 03`; });
    document.querySelectorAll("[data-practice-title]").forEach((node) => { node.textContent = practiceScene.title; });
    document.querySelectorAll("[data-practice-copy]").forEach((node) => { node.textContent = answers.sceneCopy === "show" ? practiceScene.copy : ""; node.hidden = answers.sceneCopy !== "show"; });
    document.querySelectorAll("[data-practice]").forEach((button, buttonIndex) => {
      const localIndex = buttonIndex % practiceScenes.length;
      const scene = practiceScenes[orderedPractice[localIndex]];
      button.textContent = scene.key[0].toUpperCase() + scene.key.slice(1);
      button.toggleAttribute("aria-current", localIndex === practiceIndex);
    });

    const orderedBenefits = benefitOrder();
    const benefit = benefits[orderedBenefits[benefitIndex]];
    document.querySelectorAll("[data-benefit-title]").forEach((node) => { node.textContent = benefit.title; });
    document.querySelectorAll("[data-benefit-copy]").forEach((node) => { node.textContent = answers.benefitCopy === "show" ? benefit.copy : ""; node.hidden = answers.benefitCopy !== "show"; });
    document.querySelectorAll("[data-benefit-count]").forEach((node) => {
      const count = String(benefitIndex + 1).padStart(2, "0");
      node.textContent = answers.benefitCount === "fraction" ? `${count} / 06` : answers.benefitCount === "number" ? count : "";
      node.hidden = answers.benefitCount === "remove";
    });

    const visibleReturnItems = answers.returnList === "all" ? returnItems : answers.returnList === "first-two" ? returnItems.slice(0, 2) : [];
    document.querySelectorAll("[data-return-list]").forEach((list) => { list.innerHTML = visibleReturnItems.map((item) => `<li>${item}</li>`).join(""); list.hidden = !visibleReturnItems.length; });
  };

  const applyFocus = (focus) => {
    document.querySelectorAll(".dividend-frame").forEach((frame) => {
      frame.classList.toggle("has-focus", Boolean(focus));
      frame.querySelectorAll("[data-focus-region]").forEach((node) => node.classList.toggle("is-focused", node.dataset.focusRegion === focus));
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
    }).join("")}</div><label class="overall-note-label" for="dividendComment">Overall note</label><textarea id="dividendComment" rows="2" placeholder="Optional overall note" style="width:100%;margin-top:6px;padding:10px;color:#eee2cc;border:1px solid rgba(157,240,200,.2);background:#04110c;resize:none;font:11px/1.35 Archivo">${escapeHtml(comment)}</textarea>`;
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
    if (decision.device) chooseDevice(decision.device, false);
    if (decision.mode) chooseMode(decision.mode, false);
    renderGroups(decision.group);
    ui.progressCount.textContent = `${String(index + 1).padStart(2, "0")} / ${decisions.length}`;
    ui.progressBar.style.width = `${((index + 1) / decisions.length) * 100}%`;
    ui.group.textContent = decision.group;
    ui.title.textContent = decision.title;
    ui.titleCopy.textContent = decision.title;
    ui.context.textContent = decision.context;
    ui.options.innerHTML = `${decision.options.map(([value, label], optionIndex) => `<label class="decision-option" data-letter="${String.fromCharCode(65 + optionIndex)}"><input type="radio" name="${decision.key}" value="${escapeHtml(value)}" ${answers[decision.key] === value ? "checked" : ""}><span>${label || "Remove it"}</span></label>`).join("")}<label class="decision-note"><span>Optional note on this decision</span><textarea rows="2" data-decision-note placeholder="Add context, a correction or a condition">${escapeHtml(notes[decision.key] || "")}</textarea></label>`;
    ui.options.querySelectorAll("input").forEach((input) => input.addEventListener("change", () => {
      answers[decision.key] = input.value;
      if (decision.key === "defaultMode") chooseMode(input.value, false);
      locked = false;
      practiceIndex = 0;
      benefitIndex = 0;
      applyPreview();
      restartBenefitMotion();
      save();
    }));
    ui.options.querySelector("[data-decision-note]").addEventListener("input", (event) => {
      notes[decision.key] = event.target.value;
      locked = false;
      save();
    });
    ui.prev.disabled = index === 0;
    ui.prev.textContent = "Previous";
    ui.next.innerHTML = index === decisions.length - 1 ? "Review choices <span>→</span>" : "Next decision <span>→</span>";
    applyPreview();
    applyFocus(decision.focus);
  };

  document.querySelectorAll("[data-device]").forEach((button) => button.addEventListener("click", () => chooseDevice(button.dataset.device)));
  document.querySelectorAll("[data-mode]").forEach((button) => button.addEventListener("click", () => chooseMode(button.dataset.mode)));
  document.querySelectorAll("[data-practice]").forEach((button) => button.addEventListener("click", () => choosePractice([...button.parentElement.children].indexOf(button))));
  document.querySelectorAll("[data-benefit-prev]").forEach((button) => button.addEventListener("click", () => { chooseBenefit(benefitIndex - 1); restartBenefitMotion(); }));
  document.querySelectorAll("[data-benefit-next]").forEach((button) => button.addEventListener("click", () => { chooseBenefit(benefitIndex + 1); restartBenefitMotion(); }));
  document.addEventListener("visibilitychange", restartBenefitMotion);
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
      history.replaceState(null, "", `#${new URLSearchParams({ ...answers, ...(Object.keys(cleanNotes).length ? { feedback: JSON.stringify(cleanNotes) } : {}), ...(comment.trim() ? { overallFeedback: comment.trim() } : {}) })}`);
      save();
      renderReview();
      return;
    }
    if (index === decisions.length - 1) renderReview();
    else { index += 1; render(); save(); }
  });
  document.addEventListener("keydown", (event) => {
    if (event.altKey && event.key === "ArrowRight") ui.next.click();
    if (event.altKey && event.key === "ArrowLeft") ui.prev.click();
  });

  chooseDevice(device, false);
  chooseMode(mode, false);
  applyPreview();
  if (locked) renderReview(); else render();
})();
