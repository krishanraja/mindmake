(() => {
  const form = document.querySelector("#languageForm");
  const shell = document.querySelector(".review-shell");
  const lockButton = document.querySelector("#lockButton");
  const resetButton = document.querySelector("#resetButton");
  const output = document.querySelector("#selectionReadout");
  const storageKey = "mindmake-shared-language-combination-v1";
  const defaults = Object.fromEntries(new FormData(form).entries());
  const labels = {
    results: "Proof route label",
    blog: "Editorial route label",
    answers: "Long-form answer route",
    faq: "Buying questions route",
    media: "Publication label",
    start: "Primary action label",
    leadershipMode: "New-age leadership route",
    positioning: "Footer positioning sentence",
  };

  const read = () => Object.fromEntries(new FormData(form).entries());
  const leadershipCopy = (mode) => mode === "companion" ? "The human choice" : "New-age leadership";

  const apply = (state) => {
    const copy = { ...state, leadership: leadershipCopy(state.leadershipMode) };
    document.querySelectorAll("[data-copy]").forEach((node) => {
      const value = copy[node.dataset.copy] ?? "";
      node.textContent = value;
      if (node.dataset.copy === "positioning") node.hidden = value === "";
    });
    document.querySelectorAll('[data-route="leadership"]').forEach((node) => {
      node.hidden = state.leadershipMode === "home";
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

  const renderLock = (state) => {
    const lines = Object.entries(labels).map(([key, label]) => `${label}: ${state[key] || "removed"}`);
    lines.push(`Comment: ${state.comment?.trim() || "none"}`);
    output.innerHTML = `<strong>Saved locally</strong><br>${lines.join("<br>")}`;
    lockButton.textContent = "Language decisions locked";
    shell.classList.add("is-locked");
  };

  form.addEventListener("change", () => {
    apply(read());
    shell.classList.remove("is-locked");
    lockButton.textContent = "Lock these language decisions";
  });

  lockButton.addEventListener("click", () => {
    const state = read();
    localStorage.setItem(storageKey, JSON.stringify(state));
    const clean = { ...state };
    delete clean.comment;
    history.replaceState(null, "", `#${new URLSearchParams(clean)}`);
    renderLock(state);
  });

  resetButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    history.replaceState(null, "", location.pathname + location.search);
    form.reset();
    restore(defaults);
    output.textContent = "";
    shell.classList.remove("is-locked");
    lockButton.textContent = "Lock these language decisions";
  });

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }
  if (saved) {
    restore(saved);
    renderLock(saved);
  } else {
    apply(defaults);
  }
})();
