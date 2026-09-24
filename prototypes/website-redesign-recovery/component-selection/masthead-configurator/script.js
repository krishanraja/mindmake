const STORAGE_KEY = "mindmake-masthead-combination-v1";
const shell = document.querySelector(".review-shell");
const form = document.querySelector("#mastheadForm");
const readout = document.querySelector("#selectionReadout");
const lockButton = document.querySelector("#lockButton");
const resetButton = document.querySelector("#resetButton");

const defaults = {
  logoDesktop: "146",
  logoMobile: "128",
  heightDesktop: "66",
  heightMobile: "64",
  contextLabel: "none",
  menuStyle: "word-lines",
  ground: "glass",
  rule: "hairline",
  behavior: "fixed",
  comment: "",
  locked: false,
};

function values() {
  return Object.fromEntries(new FormData(form).entries());
}

function apply(state) {
  for (const [name, value] of Object.entries(state)) {
    const control = form.elements.namedItem(name);
    if (!control) continue;
    if (control instanceof RadioNodeList) control.value = value;
    else control.value = value;
  }
  shell.style.setProperty("--logo-desktop", `${state.logoDesktop}px`);
  shell.style.setProperty("--logo-mobile", `${state.logoMobile}px`);
  shell.style.setProperty("--height-desktop", `${state.heightDesktop}px`);
  shell.style.setProperty("--height-mobile", `${state.heightMobile}px`);
  document.querySelector(".preview-desktop .site-canvas").style.setProperty("--logo-total", `${state.logoDesktop}px`);
  document.querySelector(".preview-mobile .site-canvas").style.setProperty("--logo-total", `${state.logoMobile}px`);
  document.querySelector(".preview-desktop .site-canvas").style.setProperty("--masthead-height", `${state.heightDesktop}px`);
  document.querySelector(".preview-mobile .site-canvas").style.setProperty("--masthead-height", `${state.heightMobile}px`);
  shell.dataset.context = state.contextLabel;
  shell.dataset.menu = state.menuStyle;
  shell.dataset.ground = state.ground;
  shell.dataset.rule = state.rule;
  shell.dataset.behavior = state.behavior;
  shell.classList.toggle("is-locked", Boolean(state.locked));
  lockButton.textContent = state.locked ? "Combination locked" : "Lock this combination";
}

function summary(state) {
  return [
    `Desktop logo: ${state.logoDesktop}px`,
    `Mobile logo: ${state.logoMobile}px`,
    `Desktop masthead: ${state.heightDesktop}px`,
    `Mobile masthead: ${state.heightMobile}px`,
    `Centre context: ${state.contextLabel}`,
    `Menu: ${state.menuStyle}`,
    `Ground: ${state.ground}`,
    `Bottom rule: ${state.rule}`,
    `Behaviour: ${state.behavior}`,
    state.comment ? `Comment: ${state.comment}` : "Comment: none",
  ].join("\n");
}

function persist(locked = shell.classList.contains("is-locked")) {
  const state = { ...values(), locked };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  apply(state);
  return state;
}

form.addEventListener("input", () => {
  const state = persist(false);
  readout.textContent = "";
  shell.classList.remove("is-locked");
  lockButton.textContent = "Lock this combination";
});

lockButton.addEventListener("click", () => {
  const state = persist(true);
  readout.textContent = `Saved locally\n\n${summary(state)}`;
  history.replaceState(null, "", `#${new URLSearchParams({
    ld: state.logoDesktop,
    lm: state.logoMobile,
    hd: state.heightDesktop,
    hm: state.heightMobile,
    context: state.contextLabel,
    menu: state.menuStyle,
    ground: state.ground,
    rule: state.rule,
    behavior: state.behavior,
  })}`);
});

resetButton.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  history.replaceState(null, "", location.pathname);
  apply(defaults);
  readout.textContent = "Reset to the review starting state.";
});

let restored = defaults;
try {
  restored = { ...defaults, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}") };
} catch {
  restored = defaults;
}
apply(restored);
if (restored.locked) readout.textContent = `Saved locally\n\n${summary(restored)}`;
