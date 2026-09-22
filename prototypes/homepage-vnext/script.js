const thresholdView = document.querySelector("#thresholdView");
const routeView = document.querySelector("#routeView");
const routeTitle = document.querySelector("#routeTitle");
const routeName = document.querySelector("#routeName");
const routeLede = document.querySelector("#routeLede");
const routeImage = document.querySelector("#routeImage");
const routeCaption = document.querySelector("#routeCaption");
const receiptSource = document.querySelector("#receiptSource");
const receiptResult = document.querySelector("#receiptResult");
const causalLine = document.querySelector("#causalLine");
const menuLayer = document.querySelector("#menuLayer");
const startLayer = document.querySelector("#startLayer");
const siteHeader = document.querySelector("#siteHeader");
const menuTrigger = document.querySelector("#menuTrigger");
const startForm = document.querySelector("#startForm");
const drawerStep = document.querySelector("#drawerStep");
const drawerProgress = document.querySelector("#drawerProgress");
const workTitle = document.querySelector("#workTitle");
const workChoices = document.querySelector("#workChoices");

const routeData = {
  brain: {
    name: "Build your AI brain",
    title: "Your judgement at work.",
    titleLines: ["Your judgement", "at work."],
    lede: "Turn your standards, context and past decisions into a system that helps you make the next call.",
    image: "../../src/assets/films/film-02-poster.webp",
    alt: "A walnut instrument cabinet with rows of labelled drawers",
    caption: "The useful part is not another answer. It is a system that knows what you would keep, change or reject.",
    source: "Anonymous client outcome · Research and content",
    causal: ["The founder's standards", "A system they own", "Used on real work"],
    result: "Research-backed publishing moved from days to under an hour, and from roughly monthly to most days.",
    question: "What should your AI brain take on first?",
    choices: ["Decisions only I can make", "Work that keeps bottlenecking on me", "Something else"]
  },
  gtm: {
    name: "Build your AI GTM",
    title: "Make the business easier to buy.",
    titleLines: ["Make the business", "easier to buy."],
    lede: "Rebuild one part of how the business reaches customers and gets paid: product, price, positioning or people.",
    image: "../../src/assets/films/film-04-poster.webp",
    alt: "A brass and walnut instrument moving a paper record through a measured track",
    caption: "Start with the commercial decision that is holding the rest of the system back.",
    source: "Anonymous client outcome · Media advisory",
    causal: ["Expertise people value", "A clear offer", "A defined plan launched"],
    result: "A respected advisory firm turned its expertise into a clear offer clients could buy.",
    question: "What part of GTM needs to move first?",
    choices: ["What we sell", "What we charge", "How we stand out", "Who sells it"]
  }
};

let currentRoute = null;
let routeTrigger = null;
let overlayTrigger = null;
let drawerStage = "route";

const focusable = (root) => [...root.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex]:not([tabindex="-1"])')].filter((element) => !element.closest("[hidden]"));

function setPageInert(value) {
  siteHeader.inert = value;
  thresholdView.inert = value;
  routeView.inert = value;
}

function trapFocus(event, layer) {
  if (event.key !== "Tab") return;
  const items = focusable(layer);
  if (!items.length) return;
  const first = items[0];
  const last = items[items.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function paintRoute(route) {
  const data = routeData[route];
  routeName.textContent = data.name;
  routeTitle.replaceChildren(...data.titleLines.flatMap((line, index) => {
    const span = document.createElement("span");
    span.textContent = line;
    return index === 0 ? [span] : [document.createTextNode(" "), span];
  }));
  routeLede.textContent = data.lede;
  routeImage.src = data.image;
  routeImage.alt = data.alt;
  routeCaption.textContent = data.caption;
  receiptSource.textContent = data.source;
  receiptResult.textContent = data.result;
  causalLine.replaceChildren(...data.causal.map((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    return li;
  }));
}

function showRoute(route, push = true) {
  if (!routeData[route]) return;
  currentRoute = route;
  paintRoute(route);
  const swap = () => {
    thresholdView.hidden = true;
    thresholdView.classList.remove("is-leaving");
    routeView.hidden = false;
    routeView.classList.add("is-arriving");
    document.body.dataset.view = route;
    window.scrollTo(0, 0);
    routeTitle.focus({ preventScroll: true });
    window.setTimeout(() => routeView.classList.remove("is-arriving"), 420);
  };
  if (push) history.pushState({ route }, "", `#${route}`);
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (thresholdView.hidden || reduced) swap();
  else {
    thresholdView.classList.add("is-leaving");
    window.setTimeout(swap, 230);
  }
}

function showThreshold(restoreFocus = true) {
  currentRoute = null;
  routeView.hidden = true;
  thresholdView.hidden = false;
  document.body.dataset.view = "threshold";
  window.scrollTo(0, 0);
  if (restoreFocus && routeTrigger) routeTrigger.focus({ preventScroll: true });
  else document.querySelector("[data-route='brain']").focus({ preventScroll: true });
}

function returnToThreshold() {
  if (history.state?.route || location.hash === "#brain" || location.hash === "#gtm") history.back();
  else showThreshold();
}

document.querySelectorAll("[data-route]").forEach((button) => {
  button.addEventListener("click", () => {
    routeTrigger = button;
    showRoute(button.dataset.route);
  });
});

document.querySelectorAll("[data-home]").forEach((button) => button.addEventListener("click", () => {
  if (currentRoute) returnToThreshold();
}));

document.querySelector("#routeBack").addEventListener("click", returnToThreshold);

window.addEventListener("popstate", () => {
  const route = location.hash.slice(1);
  if (routeData[route]) showRoute(route, false);
  else showThreshold();
});

function openMenu() {
  overlayTrigger = document.activeElement;
  menuLayer.hidden = false;
  setPageInert(true);
  document.body.style.overflow = "hidden";
  menuLayer.querySelector(".close-button").focus();
}

function closeMenu(restore = true) {
  menuLayer.hidden = true;
  setPageInert(false);
  document.body.style.overflow = "";
  if (restore) (overlayTrigger || menuTrigger).focus();
}

menuTrigger.addEventListener("click", openMenu);
document.querySelectorAll("[data-close-menu]").forEach((element) => element.addEventListener("click", () => closeMenu()));
menuLayer.addEventListener("keydown", (event) => trapFocus(event, menuLayer));

document.querySelectorAll("[data-menu-route]").forEach((button) => button.addEventListener("click", () => {
  const route = button.dataset.menuRoute;
  closeMenu(false);
  routeTrigger = menuTrigger;
  showRoute(route);
}));

function updateDrawer(route = currentRoute) {
  currentRoute = route || null;
  const steps = [...startForm.querySelectorAll(".form-step")];
  steps.forEach((step) => {
    const active = step.dataset.step === drawerStage;
    step.hidden = !active;
    step.classList.toggle("is-active", active);
  });
  const position = drawerStage === "route" ? 1 : drawerStage === "work" ? 2 : 3;
  drawerStep.textContent = drawerStage === "complete" ? "Complete" : `${position} of 3`;
  drawerProgress.style.width = drawerStage === "complete" ? "100%" : `${position * 33.333}%`;
  if (drawerStage === "work" && currentRoute) {
    workTitle.textContent = routeData[currentRoute].question;
    workChoices.replaceChildren(...routeData[currentRoute].choices.map((choice) => {
      const button = document.createElement("button");
      button.type = "button";
      button.innerHTML = `<span>${choice}</span><span aria-hidden="true">→</span>`;
      button.addEventListener("click", () => {
        workChoices.querySelectorAll("button").forEach((item) => item.classList.remove("is-selected"));
        button.classList.add("is-selected");
        drawerStage = "details";
        window.setTimeout(() => {
          updateDrawer();
          document.querySelector("#workEmail").focus();
        }, 100);
      });
      return button;
    }));
  }
}

function openDrawer(route = currentRoute) {
  overlayTrigger = document.activeElement;
  drawerStage = route ? "work" : "route";
  startLayer.hidden = false;
  setPageInert(true);
  document.body.style.overflow = "hidden";
  updateDrawer(route);
  const active = startLayer.querySelector(".form-step:not([hidden])");
  (active.querySelector("button, input") || startLayer.querySelector(".close-button")).focus();
}

function closeDrawer() {
  startLayer.hidden = true;
  setPageInert(false);
  document.body.style.overflow = "";
  startForm.reset();
  (overlayTrigger || document.querySelector("#startButton")).focus();
}

document.querySelector("#startButton").addEventListener("click", () => openDrawer(currentRoute));
document.querySelector("#menuStart").addEventListener("click", () => {
  closeMenu(false);
  openDrawer(null);
});
document.querySelectorAll("[data-close-drawer]").forEach((element) => element.addEventListener("click", closeDrawer));
startLayer.addEventListener("keydown", (event) => trapFocus(event, startLayer));

document.querySelectorAll("[data-drawer-route]").forEach((button) => button.addEventListener("click", () => {
  currentRoute = button.dataset.drawerRoute;
  drawerStage = "work";
  updateDrawer();
  workChoices.querySelector("button").focus();
}));

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const inputs = [...startForm.querySelectorAll("input[required]")];
  const invalid = inputs.find((input) => !input.checkValidity());
  if (invalid) {
    invalid.reportValidity();
    invalid.focus();
    return;
  }
  drawerStage = "complete";
  updateDrawer();
  startLayer.querySelector("[data-step='complete']").focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!startLayer.hidden) closeDrawer();
  else if (!menuLayer.hidden) closeMenu();
  else if (currentRoute) returnToThreshold();
});

const initialRoute = location.hash.slice(1);
if (routeData[initialRoute]) showRoute(initialRoute, false);
