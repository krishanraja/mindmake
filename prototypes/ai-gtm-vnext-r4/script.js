const signals = {
  pricing: {
    short: "Outcome pricing",
    domain: "Price",
    date: "13 Apr 2026",
    isoDate: "2026-04-13",
    observation: "HubSpot moved two Breeze agents from access-based charges to credits tied to resolved conversations and recommended leads.",
    limit: "Company announcement. Adoption beyond HubSpot is not established.",
    sourceLabel: "HubSpot source",
    source: "https://www.hubspot.com/company-news/hubspots-customer-agent-and-prospecting-agent-now-you-pay-when-the-task-is-complete",
    question: "If AI does more work with fewer seats, what should the customer pay for?",
    responses: [
      { name: "Keep the seat", product: "AI stays inside the existing plan.", price: "Bundle capacity into each seat.", positioning: "Faster software for the current team.", people: "Sales protects adoption and expansion.", testTitle: "Does included AI change renewal or expansion?", testBody: "Put an AI-inclusive plan in front of current buyers and measure whether it changes willingness to renew, expand or switch." },
      { name: "Meter the work", product: "Define each billable agent action.", price: "Credits grow with autonomous work.", positioning: "Pay as the system does more.", people: "Product owns usage. Finance owns control.", testTitle: "Can buyers forecast and accept the meter?", testBody: "Show buyers the action unit, expected volume, cap and alerts before engineering the billing model." },
      { name: "Price the result", product: "Define a result that can be verified.", price: "Charge when the result clears evaluation.", positioning: "Software that completes the job.", people: "Operations owns quality and disputes.", testTitle: "Can buyers trust and value a verified result?", testBody: "Put the outcome definition, price and dispute path in front of target buyers before rebuilding the commercial model." },
    ],
  },
  commerce: {
    short: "AI-mediated commerce",
    domain: "Distribution",
    date: "24 Mar 2026",
    isoDate: "2026-03-24",
    observation: "Shopify says Agentic Storefronts distribute merchant products across ChatGPT, Copilot, Google AI Mode and Gemini.",
    limit: "Company announcement. Adoption and checkout behaviour vary by market and category.",
    sourceLabel: "Shopify source",
    source: "https://www.shopify.com/news/agentic-commerce-momentum",
    question: "When the first buying conversation happens inside AI, what must the business change?",
    responses: [
      { name: "Keep website-first", product: "The storefront remains the main interface.", price: "Keep the existing commerce model.", positioning: "Bring buyers back to the site.", people: "Channel teams optimise human traffic.", testTitle: "How much qualified demand still reaches the site?", testBody: "Compare high-intent buyer prompts with current referral and conversion paths before defending the existing funnel." },
      { name: "Syndicate the catalogue", product: "Structured product data becomes the feed.", price: "Treat AI as another channel cost.", positioning: "Available where buyers ask.", people: "Commerce owns accuracy across channels.", testTitle: "Can an AI shortlist the right products accurately?", testBody: "Publish a bounded product set, run real buyer prompts and record representation gaps before scaling distribution." },
      { name: "Build for agent buying", product: "Catalogue, policy and checkout work together.", price: "Capture value from completed transactions.", positioning: "A trusted commerce layer for agents.", people: "One owner spans product, brand and risk.", testTitle: "Will buyers complete a governed agent-led journey?", testBody: "Prototype discovery, comparison and checkout for one category, with explicit handoff and failure boundaries." },
    ],
  },
  product: {
    short: "AI prototyping",
    domain: "Product",
    date: "15 Apr 2026",
    isoDate: "2026-04-15",
    observation: "Uber reports interactive prototypes appearing in hours, often before a complete product requirements document.",
    limit: "One company’s operating evidence. The speed claim is not a universal benchmark.",
    sourceLabel: "Uber source",
    source: "https://www.uber.com/us/en/blog/ai-prototyping/",
    question: "When building becomes cheap, what should earn a place on the roadmap?",
    responses: [
      { name: "Keep the spec gate", product: "Ideas become documents before prototypes.", price: "Fund certainty before exploration.", positioning: "Reliable delivery of planned features.", people: "Product coordinates the handoffs.", testTitle: "Does the document remove the costly uncertainty?", testBody: "Identify which open questions still rely on interpretation, then test whether a concrete artefact changes the decision." },
      { name: "Prototype before commitment", product: "Working alternatives appear before the roadmap.", price: "Fund learning before full delivery.", positioning: "Show the future before selling it.", people: "Product explores more routes earlier.", testTitle: "Which route survives contact with users?", testBody: "Put materially different prototypes in front of target users and record where behaviour contradicts internal preference." },
      { name: "Prototype against evidence", product: "Every prototype carries an evaluation contract.", price: "Back the route that earns commitment.", positioning: "Faster learning, not faster output.", people: "Leaders own the release standard.", testTitle: "What evidence would make us build, revise or stop?", testBody: "Agree the customer behaviour and kill criteria first, then use contrasting prototypes to buy the decision." },
    ],
  },
  content: {
    short: "Machine-priced intelligence",
    domain: "Business model",
    date: "01 Jul 2025",
    isoDate: "2025-07-01",
    observation: "Cloudflare introduced a Pay Per Crawl beta that lets publishers allow, block or set a price for AI crawler access.",
    limit: "Company beta. Demand, adoption and durable clearing prices are not established.",
    sourceLabel: "Cloudflare source",
    source: "https://blog.cloudflare.com/introducing-pay-per-crawl/",
    question: "When AI consumes the answer without sending the click, what becomes the paid product?",
    responses: [
      { name: "Protect the page", product: "Keep premium material behind the human experience.", price: "Subscriptions and advertising remain primary.", positioning: "A destination worth visiting directly.", people: "Editorial protects reach and conversion.", testTitle: "Which material still earns a direct relationship?", testBody: "Separate discovery content from proprietary intelligence, then test which material creates registration, return visits or paid demand." },
      { name: "License the evidence", product: "Package trusted material for machine use.", price: "Charge for access, volume or rights.", positioning: "A reliable source for AI systems.", people: "Product, editorial and legal own the licence.", testTitle: "Will buyers pay for governed machine access?", testBody: "Offer one structured evidence set with clear provenance, update terms and usage boundaries to selected model and enterprise buyers." },
      { name: "Build the intelligence product", product: "Turn expertise into a governed data service.", price: "Price freshness, depth and decision value.", positioning: "Trusted intelligence for humans and agents.", people: "One team owns research, product and rights.", testTitle: "Which decision becomes better with this intelligence?", testBody: "Prototype one machine-readable intelligence product around a costly customer decision, then test use, trust and willingness to pay." },
    ],
  },
  service: {
    short: "Autonomous service",
    domain: "Positioning",
    date: "19 May 2026",
    isoDate: "2026-05-19",
    observation: "Zendesk repositioned around an Autonomous Service Workforce and tied charging to outcomes checked by a separate evaluation model.",
    limit: "Company announcement. Independent evidence of customer value is still required.",
    sourceLabel: "Zendesk source",
    source: "https://www.zendesk.com/newsroom/press-releases/relate-2026/",
    question: "When software presents itself as labour, what proof must replace the feature demo?",
    responses: [
      { name: "Lead with features", product: "Agents remain capabilities inside the suite.", price: "Protect the existing plan architecture.", positioning: "A better support platform.", people: "Sales demonstrates feature breadth.", testTitle: "Do features still explain the buying case?", testBody: "Compare feature-led and job-led conversations with the same buyer cohort and record which one creates credible urgency." },
      { name: "Name the completed job", product: "Organise the experience around resolved work.", price: "Meter the work the system completes.", positioning: "A workforce for a defined service job.", people: "Operations owns exceptions and quality.", testTitle: "Will buyers give the system a real queue?", testBody: "Offer a bounded queue with explicit escalation, quality and cost rules, then observe whether buyers delegate meaningful work." },
      { name: "Prove the operating model", product: "Action, evaluation and correction form one loop.", price: "Charge for verified outcomes within guardrails.", positioning: "A governed service system, not a bot.", people: "Humans own standards, appeals and improvement.", testTitle: "Can the buyer inspect and challenge success?", testBody: "Prototype the outcome definition, evaluator, appeal path and human boundary together before making the workforce claim." },
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

const signalButtons = [...document.querySelectorAll("[data-signal]")];
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
