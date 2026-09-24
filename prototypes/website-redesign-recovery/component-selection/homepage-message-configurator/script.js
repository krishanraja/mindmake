(() => {
  const form = document.querySelector("#messageForm");
  const shell = document.querySelector(".review-shell");
  const previews = document.querySelector(".previews");
  const lockButton = document.querySelector("#lockButton");
  const resetButton = document.querySelector("#resetButton");
  const output = document.querySelector("#selectionReadout");
  const storageKey = "mindmake-homepage-message-combination-v1";
  const defaults = Object.fromEntries(new FormData(form).entries());
  const labels = {
    openingHeadline: "Hero headline", openingLede: "Opening promise", brainDoor: "AI Brain door headline", brainDoorDetail: "AI Brain door explanation", gtmDoor: "AI GTM door headline", gtmDoorDetail: "AI GTM door explanation", openingProof: "Shared proof line", brainHeadline: "Brain headline", brainLede: "Brain promise", brainCaption: "Brain film line", gtmHeadline: "GTM headline", gtmLede: "GTM promise", gtmCaption: "GTM film line", backLabel: "Back control label", receiptHeading: "Proof receipt headline"
  };
  const routeFacts = {
    brain: { list: ["The founder's standards", "A system they own", "Used on real work"], result: "Research-backed publishing moved from days to under an hour, and from roughly monthly to most days." },
    gtm: { list: ["Expertise people value", "A clear offer", "A defined plan launched"], result: "A respected advisory firm turned its expertise into a clear offer clients could buy." }
  };
  let view = "opening";
  const read = () => Object.fromEntries(new FormData(form).entries());

  const apply = (state) => {
    document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = state[node.dataset.copy] ?? ""; });
    const route = view === "gtm" ? "gtm" : "brain";
    const routeCopy = route === "brain" ? { headline: state.brainHeadline, lede: state.brainLede, caption: state.brainCaption } : { headline: state.gtmHeadline, lede: state.gtmLede, caption: state.gtmCaption };
    document.querySelectorAll("[data-route-copy]").forEach((node) => { node.textContent = routeCopy[node.dataset.routeCopy] ?? routeFacts[route][node.dataset.routeCopy] ?? ""; });
    document.querySelectorAll("[data-route-list]").forEach((list) => { list.innerHTML = routeFacts[route].list.map((item) => `<li>${item}</li>`).join(""); });
    previews.dataset.previewView = view;
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

  document.querySelectorAll("[data-view]").forEach((button) => button.addEventListener("click", () => {
    view = button.dataset.view;
    document.querySelectorAll("[data-view]").forEach((item) => item.classList.toggle("is-active", item === button));
    apply(read());
  }));
  form.addEventListener("change", () => { apply(read()); shell.classList.remove("is-locked"); lockButton.textContent = "Lock the homepage message"; });
  lockButton.addEventListener("click", () => {
    const state = read();
    localStorage.setItem(storageKey, JSON.stringify(state));
    const clean = { ...state }; delete clean.comment;
    history.replaceState(null, "", `#${new URLSearchParams(clean)}`);
    output.innerHTML = `<strong>Saved locally</strong><br>${Object.entries(labels).map(([key, label]) => `${label}: ${state[key]}`).join("<br>")}<br>Comment: ${state.comment?.trim() || "none"}`;
    lockButton.textContent = "Homepage message locked";
    shell.classList.add("is-locked");
  });
  resetButton.addEventListener("click", () => { localStorage.removeItem(storageKey); history.replaceState(null, "", location.pathname + location.search); form.reset(); restore(defaults); output.textContent = ""; shell.classList.remove("is-locked"); lockButton.textContent = "Lock the homepage message"; });
  let saved = null; try { saved = JSON.parse(localStorage.getItem(storageKey)); } catch { saved = null; }
  if (saved) { restore(saved); lockButton.click(); } else apply(defaults);
})();
