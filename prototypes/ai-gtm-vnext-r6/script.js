const signals = {
  pricing: {
    short: "AI pricing",
    domain: "Price",
    date: "13 Apr 2026",
    isoDate: "2026-04-13",
    observation: "HubSpot moved two Breeze agents from access-based charges to credits tied to resolved conversations and recommended leads.",
    limit: "Company announcement. Adoption beyond HubSpot is not established.",
    sourceLabel: "HubSpot source",
    source: "https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete",
    question: "If AI does more work with fewer seats, what should the customer pay for?",
    mobileQuestion: "If AI does more work, what should customers pay for?",
    responses: [
      { name: "Keep AI inside the subscription", product: "AI remains part of the current subscription.", price: "Each subscription includes a fixed amount of AI work.", positioning: "The existing product now does more.", people: "Sales explains adoption and expansion.", testTitle: "Does included AI change renewal or expansion?", testBody: "Put an AI-inclusive plan in front of current buyers and measure whether it changes willingness to renew, expand or switch." },
      { name: "Charge for each completed task", product: "Define each task the AI can complete.", price: "Customers buy credits for those tasks.", positioning: "Customers pay as the AI completes more work.", people: "Product defines usage. Finance sets limits.", testTitle: "Can buyers forecast and accept the charge?", testBody: "Show buyers each chargeable task, expected volume, cap and alerts before engineering the billing model." },
      { name: "Charge for each verified result", product: "Define a result that both sides can verify.", price: "Charge only when the result passes evaluation.", positioning: "Software that completes a defined job.", people: "Operations handles quality and disputes.", testTitle: "Can buyers trust and value a verified result?", testBody: "Put the result, price and dispute path in front of target buyers before rebuilding the commercial model." },
    ],
  },
  commerce: {
    short: "Purchases through AI assistants",
    domain: "Distribution",
    date: "24 Mar 2026",
    isoDate: "2026-03-24",
    observation: "Shopify says Agentic Storefronts distribute merchant products across ChatGPT, Copilot, Google AI Mode and Gemini.",
    limit: "Company announcement. Adoption and checkout behaviour vary by market and category.",
    sourceLabel: "Shopify source",
    source: "https://www.shopify.com/news/agentic-commerce-momentum",
    question: "When the first buying conversation happens inside AI, what must the business change?",
    mobileQuestion: "If buying starts inside AI, what must change?",
    responses: [
      { name: "Keep purchases on the website", product: "The website remains the main place to buy.", price: "Keep the current pricing and checkout model.", positioning: "Bring customers back to the website.", people: "Channel teams improve human traffic and conversion.", testTitle: "How much qualified demand still reaches the website?", testBody: "Compare high-intent buyer prompts with current referral and conversion paths before defending the existing sales path." },
      { name: "Put the catalogue inside AI assistants", product: "Give AI assistants accurate, structured product data.", price: "Treat AI assistants as another sales channel.", positioning: "Available wherever customers ask.", people: "Commerce keeps product data accurate everywhere.", testTitle: "Can an AI assistant recommend the right products?", testBody: "Publish a bounded product set, run real buyer prompts and record representation gaps before adding more products." },
      { name: "Let AI assistants complete purchases", product: "Make product data, policy and checkout work together.", price: "Earn revenue from purchases completed inside AI.", positioning: "A trusted way for AI assistants to buy.", people: "One owner spans product, brand and risk.", testTitle: "Will buyers complete a safe purchase through AI?", testBody: "Prototype discovery, comparison and checkout for one category, with clear handoff and failure boundaries." },
    ],
  },
  product: {
    short: "Building before the roadmap",
    domain: "Product",
    date: "15 Apr 2026",
    isoDate: "2026-04-15",
    observation: "Uber reports interactive prototypes appearing in hours, often before a complete product requirements document.",
    limit: "One company’s operating evidence. The speed claim is not a universal benchmark.",
    sourceLabel: "Uber source",
    source: "https://www.uber.com/us/en/blog/ai-prototyping/",
    question: "When building becomes cheap, what should earn a place on the roadmap?",
    mobileQuestion: "When building is cheap, what earns a roadmap place?",
    responses: [
      { name: "Require a specification before building", product: "Ideas become documents before prototypes.", price: "Fund planning before exploration.", positioning: "Reliable delivery of planned features.", people: "Product coordinates each handoff.", testTitle: "Does the specification remove costly uncertainty?", testBody: "Identify which open questions still rely on interpretation, then test whether a concrete artefact changes the decision." },
      { name: "Build a prototype before committing", product: "Working alternatives appear before the roadmap.", price: "Fund learning before full delivery.", positioning: "Show the future before selling it.", people: "Product explores more options earlier.", testTitle: "Which option survives contact with users?", testBody: "Put materially different prototypes in front of target users and record where behaviour contradicts internal preference." },
      { name: "Let customer evidence decide what gets built", product: "Every prototype has a clear test.", price: "Back the option that earns commitment.", positioning: "Faster learning, not faster output.", people: "Leaders own the release standard.", testTitle: "What evidence would make us build, revise or stop?", testBody: "Agree the customer behaviour and stopping rules first, then use contrasting prototypes to make the decision." },
    ],
  },
  content: {
    short: "AI access to paid content",
    domain: "Business model",
    date: "01 Jul 2025",
    isoDate: "2025-07-01",
    observation: "Cloudflare introduced a Pay Per Crawl beta that lets publishers allow, block or set a price for AI crawler access.",
    limit: "Company beta. Demand, adoption and durable clearing prices are not established.",
    sourceLabel: "Cloudflare source",
    source: "https://blog.cloudflare.com/introducing-pay-per-crawl/",
    question: "When AI consumes the answer without sending the click, what becomes the paid product?",
    mobileQuestion: "If AI takes the answer, what becomes the paid product?",
    responses: [
      { name: "Keep premium content on the website", product: "Keep premium material for human readers.", price: "Subscriptions and advertising remain primary.", positioning: "A destination worth visiting directly.", people: "Editorial protects reach and conversion.", testTitle: "Which material still earns a direct relationship?", testBody: "Separate discovery content from proprietary intelligence, then test which material creates registration, return visits or paid demand." },
      { name: "License source material to AI companies", product: "Package trusted source material for AI systems.", price: "Charge for access, volume or rights.", positioning: "A reliable source for AI systems.", people: "Product, editorial and legal own the licence.", testTitle: "Will buyers pay for reliable AI access?", testBody: "Offer one structured evidence set with clear sources, update terms and usage boundaries to selected model and enterprise buyers." },
      { name: "Sell continuously updated intelligence", product: "Turn expertise into a product that stays current.", price: "Charge for freshness, depth and decision value.", positioning: "Trusted intelligence for people and AI systems.", people: "One team owns research, product and rights.", testTitle: "Which decision becomes better with this intelligence?", testBody: "Prototype one machine-readable intelligence product around a costly customer decision, then test use, trust and willingness to pay." },
    ],
  },
  service: {
    short: "Software that completes service work",
    domain: "Positioning",
    date: "19 May 2026",
    isoDate: "2026-05-19",
    observation: "Zendesk repositioned around an Autonomous Service Workforce and tied charging to outcomes checked by a separate evaluation model.",
    limit: "Company announcement. Independent evidence of customer value is still required.",
    sourceLabel: "Zendesk source",
    source: "https://www.zendesk.com/newsroom/press-releases/relate-2026/",
    question: "If software promises to do the job, what proves that the job was done?",
    mobileQuestion: "What proves that the software did the job?",
    responses: [
      { name: "Sell better software features", product: "AI assistants remain features inside the software.", price: "Keep the existing subscription structure.", positioning: "A better support platform.", people: "Sales demonstrates the feature set.", testTitle: "Do features still explain why the buyer should act?", testBody: "Compare feature-led and job-led conversations with the same buyer group and record which one creates a credible reason to buy." },
      { name: "Sell each completed service task", product: "Organise the experience around completed work.", price: "Charge for each task the system completes.", positioning: "Software that completes a defined service job.", people: "Operations handles exceptions and quality.", testTitle: "Will buyers give the system real work?", testBody: "Offer a bounded queue with clear escalation, quality and cost rules, then observe whether buyers delegate meaningful work." },
      { name: "Sell verified service outcomes", product: "Action, evaluation and correction form one loop.", price: "Charge for verified outcomes within clear limits.", positioning: "A service system that can be inspected and challenged.", people: "People own standards, appeals and improvement.", testTitle: "Can the buyer inspect and challenge success?", testBody: "Prototype the outcome definition, evaluation, appeal path and human boundary together before promising a completed service." },
    ],
  },
};

let activeSignal = "pricing";
let activeResponse = 2;
const fixtureState = new URLSearchParams(location.search).get("state") || "ready";
const fixtureStates = {
  stale: "This read is outside its review window. The dated source remains visible, but no current conclusion should be drawn from it.",
  quiet: "No newer verified move has been added. The comparison remains a worked example, not evidence of a fresh market change.",
  error: "The source check is unavailable. No current conclusion has been added. The comparison remains a worked example.",
  conflicted: "The available evidence supports competing interpretations. The comparison keeps those responses visible instead of forcing a conclusion.",
};

const tickerTrack = document.querySelector(".wire-signals");
const tickerOriginals = [...tickerTrack.querySelectorAll("[data-signal]")];
tickerOriginals.forEach((button) => {
  const clone = button.cloneNode(true);
  clone.dataset.tickerClone = "";
  clone.removeAttribute("role");
  clone.removeAttribute("aria-checked");
  clone.setAttribute("aria-hidden", "true");
  clone.tabIndex = -1;
  tickerTrack.appendChild(clone);
});

const signalButtons = tickerOriginals;
const responseButtons = [...document.querySelectorAll("[data-response]")];
const fields = ["product", "price", "positioning", "people"];

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function render() {
  const signal = signals[activeSignal];
  setText("signalDomain", signal.domain);
  setText("signalDate", signal.date);
  document.getElementById("signalDate").dateTime = signal.isoDate;
  setText("signalObservation", signal.observation);
  setText("signalLimit", signal.limit);
  setText("signalQuestion", signal.question);
  setText("signalQuestionPhone", signal.mobileQuestion);
  const source = document.getElementById("signalSource");
  source.href = signal.source;
  source.firstChild.textContent = `${signal.sourceLabel} `;

  signal.responses.forEach((response, responseIndex) => {
    setText(`responseName${responseIndex}`, response.name);
    responseButtons[responseIndex].setAttribute("aria-checked", String(responseIndex === activeResponse));
  });

  const selected = signal.responses[activeResponse];
  setText("mobileProduct", selected.product);
  setText("mobilePrice", selected.price);
  setText("mobilePositioning", selected.positioning);
  setText("mobilePeople", selected.people);
  setText("mapProduct", selected.product);
  setText("mapPrice", selected.price);
  setText("mapPositioning", selected.positioning);
  setText("mapPeople", selected.people);
  setText("mapResponse", selected.name);
  setText("testTitle", selected.testTitle);
  setText("testBody", selected.testBody);
  setText("drawerContext", `${signal.short} · ${selected.name}`);
  setText("handoffContext", `${signal.short} · ${selected.name}`);

  signalButtons.forEach((button) => button.setAttribute("aria-checked", String(button.dataset.signal === activeSignal)));
}

document.body.dataset.fixtureState = fixtureState;
if (fixtureStates[fixtureState]) {
  const notice = document.getElementById("fixtureNotice");
  notice.textContent = fixtureStates[fixtureState];
  notice.hidden = false;
  document.querySelector(".wire-label span").textContent = fixtureState === "stale" ? "Stale fixture" : fixtureState === "quiet" ? "No fresh signal" : fixtureState === "error" ? "Source unavailable" : "Conflicted evidence";
  document.querySelector(".wire-label time").textContent = fixtureState === "stale" ? "Last checked 15 Sep 2026" : fixtureState === "quiet" ? "No newer source · 15 Sep 2026" : fixtureState === "error" ? "Fixture only · 15 Sep 2026" : "Competing sources · 15 Sep 2026";
}

signalButtons.forEach((button) => button.addEventListener("click", () => {
  activeSignal = button.dataset.signal;
  activeResponse = 2;
  render();
}));

let tickerResumeTimer;
tickerTrack.addEventListener("pointerdown", () => {
  clearTimeout(tickerResumeTimer);
  tickerTrack.classList.add("is-held");
});
const resumeTicker = () => {
  clearTimeout(tickerResumeTimer);
  tickerResumeTimer = setTimeout(() => tickerTrack.classList.remove("is-held"), 1400);
};
tickerTrack.addEventListener("pointerup", resumeTicker);
tickerTrack.addEventListener("pointercancel", resumeTicker);

responseButtons.forEach((button) => button.addEventListener("click", () => {
  activeResponse = Number(button.dataset.response);
  render();
}));

document.querySelectorAll('[role="radiogroup"]').forEach((group) => group.addEventListener("keydown", (event) => {
  if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
  const buttons = [...group.querySelectorAll('[role="radio"]')];
  const current = Math.max(0, buttons.indexOf(document.activeElement));
  const delta = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
  const next = buttons[(current + delta + buttons.length) % buttons.length];
  event.preventDefault();
  next.focus();
  next.click();
}));

render();

const decision = document.querySelector("#decisionTable");
const decisionJumps = [...document.querySelectorAll("[data-decision-jump]")];
let decisionPhase = 0;

function setDecisionPhase(nextPhase) {
  decisionPhase = Math.max(0, Math.min(2, nextPhase));
  decision.dataset.phase = String(decisionPhase);
  decisionJumps.forEach((button, index) => {
    button.classList.toggle("is-active", index === decisionPhase);
    button.setAttribute("aria-current", index === decisionPhase ? "step" : "false");
  });
}

function updateDecisionScroll() {
  if (window.matchMedia("(max-width: 80rem)").matches || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = decision.getBoundingClientRect();
  const travel = Math.max(1, decision.offsetHeight - window.innerHeight);
  const progress = Math.max(0, Math.min(0.999, -rect.top / travel));
  setDecisionPhase(Math.floor(progress * 3));
}

decisionJumps.forEach((button) => button.addEventListener("click", () => {
  const phase = Number(button.dataset.decisionJump);
  if (window.matchMedia("(max-width: 80rem)").matches) {
    document.querySelector(phase === 0 ? ".decision-intro" : phase === 1 ? ".comparison-shell" : ".test-ticket")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }
  const travel = Math.max(1, decision.offsetHeight - window.innerHeight);
  window.scrollTo({ top: decision.offsetTop + travel * (phase / 2), behavior: "smooth" });
}));

window.addEventListener("scroll", updateDecisionScroll, { passive: true });
window.addEventListener("resize", updateDecisionScroll);
setDecisionPhase(0);
updateDecisionScroll();

const menuLayer = document.querySelector("#menuLayer");
const startLayer = document.querySelector("#startLayer");
const siteHeader = document.querySelector("#siteHeader");
const main = document.querySelector("#main");
const footer = document.querySelector(".site-footer");
const menuTrigger = document.querySelector("#menuTrigger");
const startForm = startLayer.querySelector("form");
const handoffState = document.querySelector("#handoffState");
const companyStep = document.querySelector("#companyStep");
const youStep = document.querySelector("#youStep");
const workEmail = document.querySelector("#workEmail");
const emailError = document.querySelector("#emailError");
let returnFocus = null;

const focusable = (root) => [...root.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),[tabindex]:not([tabindex="-1"])')]
  .filter((element) => !element.closest("[hidden]"));

function setPageInert(value) {
  siteHeader.inert = value;
  main.inert = value;
  footer.inert = value;
  document.body.classList.toggle("is-locked", value);
}

function openLayer(layer) {
  const replacesMenu = layer === startLayer && !menuLayer.hidden;
  if (replacesMenu) {
    menuLayer.hidden = true;
    menuTrigger.setAttribute("aria-expanded", "false");
  }
  if (layer === startLayer) {
    startForm.reset();
    startForm.hidden = false;
    handoffState.hidden = true;
    companyStep.classList.add("is-current");
    youStep.classList.remove("is-current");
    workEmail.removeAttribute("aria-invalid");
    emailError.hidden = true;
  }
  if (!replacesMenu) returnFocus = document.activeElement;
  layer.hidden = false;
  if (layer === menuLayer) menuTrigger.setAttribute("aria-expanded", "true");
  setPageInert(true);
  (layer.querySelector("input") || layer.querySelector(".close-button")).focus();
}

function closeLayer(layer, restore = true) {
  layer.hidden = true;
  if (layer === menuLayer) menuTrigger.setAttribute("aria-expanded", "false");
  if (menuLayer.hidden && startLayer.hidden) setPageInert(false);
  if (restore && returnFocus) returnFocus.focus();
}

function trapFocus(event, layer) {
  if (event.key !== "Tab") return;
  const items = focusable(layer);
  if (!items.length) return;
  const first = items[0];
  const last = items.at(-1);
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

menuTrigger.addEventListener("click", () => openLayer(menuLayer));
document.querySelectorAll("[data-close-menu]").forEach((element) => element.addEventListener("click", () => closeLayer(menuLayer)));
document.querySelectorAll("[data-open-start]").forEach((element) => element.addEventListener("click", () => openLayer(startLayer)));
document.querySelectorAll("[data-close-start]").forEach((element) => element.addEventListener("click", () => closeLayer(startLayer)));
menuLayer.addEventListener("keydown", (event) => trapFocus(event, menuLayer));
startLayer.addEventListener("keydown", (event) => trapFocus(event, startLayer));

startForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(workEmail.value.trim());
  if (!valid) {
    workEmail.setAttribute("aria-invalid", "true");
    emailError.hidden = false;
    workEmail.focus();
    return;
  }
  const signal = signals[activeSignal];
  const selected = signal.responses[activeResponse];
  const domain = workEmail.value.trim().split("@").at(-1).toLowerCase();
  setText("handoffReceipt", `${domain} · ${signal.short} · ${selected.name}`);
  startForm.hidden = true;
  handoffState.hidden = false;
  companyStep.classList.remove("is-current");
  youStep.classList.add("is-current");
  handoffState.focus();
});

workEmail.addEventListener("input", () => {
  workEmail.removeAttribute("aria-invalid");
  emailError.hidden = true;
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!startLayer.hidden) closeLayer(startLayer);
  else if (!menuLayer.hidden) closeLayer(menuLayer);
});

const reveal = new IntersectionObserver((entries) => entries.forEach((entry) => {
  if (entry.isIntersecting) entry.target.classList.add("is-visible");
}), { threshold: 0.12 });
document.querySelectorAll(".decision-intro,.comparison-shell,.proof-copy").forEach((element) => reveal.observe(element));
