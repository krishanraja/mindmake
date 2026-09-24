(() => {
  const form = document.querySelector("#historyForm");
  const shell = document.querySelector(".review-shell");
  const lockButton = document.querySelector("#lockButton");
  const resetButton = document.querySelector("#resetButton");
  const output = document.querySelector("#selectionReadout");
  const storageKey = "mindmake-homepage-history-combination-v1";
  const defaults = Object.fromEntries(new FormData(form).entries());
  const storyFields = [
    ["questionWriting", "outcomeWriting"],
    ["questionLoom", "outcomeLoom"],
    ["questionCalculator", "outcomeCalculator"],
    ["questionSatnav", "outcomeSatnav"]
  ];
  const stories = [
    { era: "370 BC · Writing", image: "../../new-age-leadership/media/history-writing-s2.webp", alt: "An illustrative historical writing scene" },
    { era: "1675 · Engine loom", image: "../../new-age-leadership/media/history-loom-s2.webp", alt: "An illustrative mechanised loom scene" },
    { era: "1970s · Calculator", image: "../../new-age-leadership/media/history-calculator-s2.webp", alt: "An illustrative classroom calculator scene" },
    { era: "2000s · Satnav", image: "../../new-age-leadership/media/history-satnav-s2.webp", alt: "An illustrative early satellite navigation scene" }
  ];
  const labels = {
    desktopComposition: "Desktop composition",
    mobileComposition: "Mobile compression",
    desktopCopyPosition: "Desktop story copy position",
    desktopHeadlineScale: "Desktop headline scale",
    mobileHeadlineScale: "Mobile headline scale",
    controlTreatment: "Story controls",
    storyTransition: "Story transition",
    bridgeHeadline: "Bridge headline",
    bridgeLine: "Bridge line",
    outcomeLabel: "Outcome label",
    closingHinge: "Closing hinge",
    questionWriting: "Writing question",
    questionLoom: "Engine loom question",
    questionCalculator: "Calculator question",
    questionSatnav: "Satnav question",
    outcomeWriting: "Writing outcome",
    outcomeLoom: "Engine loom outcome",
    outcomeCalculator: "Calculator outcome",
    outcomeSatnav: "Satnav outcome"
  };
  let storyIndex = 0;
  const read = () => Object.fromEntries(new FormData(form).entries());

  const apply = (state) => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = state[node.dataset.copy] || ""; });
    document.querySelectorAll("[data-optional-copy]").forEach((node) => {
      const value = state[node.dataset.optionalCopy] || "";
      node.textContent = value;
      node.hidden = !value;
    });
    const [questionField, outcomeField] = storyFields[storyIndex];
    document.querySelectorAll("[data-story-question]").forEach((node) => { node.textContent = state[questionField]; });
    document.querySelectorAll("[data-story-outcome]").forEach((node) => { node.textContent = state[outcomeField]; });
    document.querySelectorAll("[data-story-era]").forEach((node) => { node.textContent = stories[storyIndex].era; });
    document.querySelectorAll("[data-story-count]").forEach((node) => { node.textContent = `0${storyIndex + 1}`; });
    document.querySelectorAll("[data-story-image]").forEach((image) => { image.src = stories[storyIndex].image; image.alt = stories[storyIndex].alt; });
    document.querySelectorAll("[data-era]").forEach((button) => {
      const active = Number(button.dataset.era) === storyIndex;
      button.toggleAttribute("aria-current", active);
      button.querySelector("span").dataset.count = `0${Number(button.dataset.era) + 1}`;
    });
    document.querySelectorAll(".history-frame").forEach((frame) => {
      frame.dataset.desktopComposition = state.desktopComposition;
      frame.dataset.mobileComposition = state.mobileComposition;
      frame.dataset.desktopCopyPosition = state.desktopCopyPosition;
      frame.dataset.desktopHeadlineScale = state.desktopHeadlineScale;
      frame.dataset.mobileHeadlineScale = state.mobileHeadlineScale;
      frame.dataset.controlTreatment = state.controlTreatment;
      frame.dataset.storyTransition = state.storyTransition;
    });
  };

  const restore = (state) => {
    Object.entries(state).forEach(([name, value]) => {
      const target = form.elements.namedItem(name);
      if (!target) return;
      if (target instanceof RadioNodeList) target.value = value;
      else target.value = value;
    });
    apply(read());
  };

  const chooseStory = (index) => {
    storyIndex = Number(index);
    document.querySelectorAll("[data-story]").forEach((button) => button.classList.toggle("is-active", Number(button.dataset.story) === storyIndex));
    apply(read());
  };

  document.querySelectorAll("[data-story]").forEach((button) => button.addEventListener("click", () => chooseStory(button.dataset.story)));
  document.querySelectorAll("[data-era]").forEach((button) => button.addEventListener("click", () => chooseStory(button.dataset.era)));
  form.addEventListener("change", () => { apply(read()); shell.classList.remove("is-locked"); lockButton.textContent = "Lock the historical story"; });
  lockButton.addEventListener("click", () => {
    const state = read();
    localStorage.setItem(storageKey, JSON.stringify(state));
    const clean = { ...state }; delete clean.comment;
    history.replaceState(null, "", `#${new URLSearchParams(clean)}`);
    output.innerHTML = `<strong>Saved locally</strong><br>${Object.entries(labels).map(([key, label]) => `${label}: ${state[key] || "remove"}`).join("<br>")}<br>Comment: ${state.comment?.trim() || "none"}`;
    lockButton.textContent = "Historical story locked";
    shell.classList.add("is-locked");
  });
  resetButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    history.replaceState(null, "", location.pathname + location.search);
    form.reset();
    restore(defaults);
    output.textContent = "";
    shell.classList.remove("is-locked");
    lockButton.textContent = "Lock the historical story";
  });
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }
  if (saved) { restore(saved); lockButton.click(); } else apply(defaults);
})();
