(() => {
  const form = document.querySelector("#openingForm");
  const previews = [...document.querySelectorAll(".site-frame")];
  const desktop = document.querySelector(".preview-desktop .site-frame");
  const mobile = document.querySelector(".preview-mobile .site-frame");
  const lockButton = document.querySelector("#lockButton");
  const resetButton = document.querySelector("#resetButton");
  const output = document.querySelector("#selectionReadout");
  const shell = document.querySelector(".review-shell");
  const storageKey = "mindmake-homepage-opening-combination-v1";
  const defaults = Object.fromEntries(new FormData(form).entries());
  const labels = {
    compositionDesktop: "Desktop composition", compositionMobile: "Mobile composition",
    titleDesktop: "Desktop title scale", titleMobile: "Mobile title scale",
    measureDesktop: "Desktop title measure", measureMobile: "Mobile title measure",
    positionDesktop: "Desktop position", positionMobile: "Mobile position",
    cropDesktop: "Desktop crop", cropMobile: "Mobile crop", contrast: "Film contrast",
    lede: "Supporting sentence", doors: "Route doors", proof: "Proof sentence", reveal: "Opening reveal"
  };

  const read = () => Object.fromEntries(new FormData(form).entries());
  const apply = (state) => {
    desktop.dataset.compositionDesktop = state.compositionDesktop;
    desktop.dataset.titleDesktop = state.titleDesktop;
    desktop.dataset.measureDesktop = state.measureDesktop;
    desktop.dataset.positionDesktop = state.positionDesktop;
    desktop.dataset.cropDesktop = state.cropDesktop;
    mobile.dataset.compositionMobile = state.compositionMobile;
    mobile.dataset.titleMobile = state.titleMobile;
    mobile.dataset.measureMobile = state.measureMobile;
    mobile.dataset.positionMobile = state.positionMobile;
    mobile.dataset.cropMobile = state.cropMobile;
    previews.forEach((preview) => {
      preview.dataset.contrast = state.contrast;
      preview.dataset.lede = state.lede;
      preview.dataset.doors = state.doors;
      preview.dataset.proof = state.proof;
      preview.dataset.reveal = state.reveal;
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
    const lines = Object.entries(labels).map(([key, label]) => `${label}: ${state[key]}`);
    lines.push(`Comment: ${state.comment?.trim() || "none"}`);
    output.innerHTML = `<strong>Saved locally</strong><br>${lines.join("<br>")}`;
    lockButton.textContent = "Combination locked";
    shell.classList.add("is-locked");
  };
  const hashFor = (state) => {
    const clean = { ...state }; delete clean.comment;
    return new URLSearchParams(clean).toString();
  };

  form.addEventListener("change", () => {
    apply(read());
    shell.classList.remove("is-locked");
    lockButton.textContent = "Lock this combination";
  });
  lockButton.addEventListener("click", () => {
    const state = read();
    localStorage.setItem(storageKey, JSON.stringify(state));
    history.replaceState(null, "", `#${hashFor(state)}`);
    renderLock(state);
  });
  resetButton.addEventListener("click", () => {
    localStorage.removeItem(storageKey);
    history.replaceState(null, "", location.pathname + location.search);
    form.reset();
    restore(defaults);
    output.textContent = "";
    shell.classList.remove("is-locked");
    lockButton.textContent = "Lock this combination";
  });

  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }
  if (saved) { restore(saved); renderLock(saved); } else { apply(defaults); }
})();
