(() => {
  const MOBILE = "(max-width: 700px)";
  const historyAnswers = {
    desktopComposition: "editorial", mobileComposition: "integrated", desktopCopyPosition: "left",
    desktopHeadlineScale: "balanced", mobileHeadlineScale: "balanced", controlTreatment: "era",
    storyTransition: "dissolve", bridgeTreatment: "contrast",
    bridgeHeadline: "You are not the first person to wonder what a new tool might take from you.",
    bridgeLine: "We have been asking that question for centuries.", outcomeLabel: "What changed",
    closingHinge: "The feeling is familiar. The reach is new.",
    questionWriting: "If knowledge lives outside us, will memory grow weaker?",
    questionLoom: "If the machine can do the work, what happens to the worker?",
    questionCalculator: "If the device does the arithmetic, will children stop learning to think?",
    questionSatnav: "If the device knows the route, will we lose our sense of direction?",
    outcomeWriting: "Ideas could travel beyond one voice and survive their maker. We changed what memory was for.",
    outcomeLoom: "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain.",
    outcomeCalculator: "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer.",
    outcomeSatnav: "That risk turned out to be real. A useful tool still asks us what we choose to keep practising."
  };
  const authorityAnswers = {
    desktopLayout: "balanced", mobileLayout: "network", desktopHeadline: "balanced", mobileHeadline: "balanced",
    desktopInstrumentScale: "balanced", mobileInstrumentScale: "balanced", controlStyle: "buttons", defaultPhase: "work",
    chapterLabel: "And now, AI", workHeadline: "The feeling is familiar. The reach is new.",
    workPromise: "AI can carry work that used to look like thinking, across the business from one decision to the next.",
    organisationHeadline: "The organisation changes shape.",
    organisationPromise: "People hold judgement. The AI Brain connects the work.",
    aiList: "long", humanList: "long", reelMotion: "moving", aiLabel: "AI carries", humanLabel: "You keep",
    organisationDetail: "concise", organisationLabel: "New-age leadership", filmLabel: "Illustrative machinery"
  };
  const dividendAnswers = {
    desktopLayout: "balanced", mobileLayout: "overlay", desktopTitle: "balanced", mobileTitle: "balanced",
    defaultMode: "practice", practiceControls: "tabs", benefitControls: "arrows", benefitMotion: "rotate-entry",
    practiceLabel: "What this feels like in practice",
    practiceHeadline: "The system does not replace your judgement. It brings more to it.",
    sceneOrder: "notice-connect-prepare", sceneCopy: "show",
    benefitLabel: "What your AI Brain makes possible", benefitOrder: "leadership-first", benefitCopy: "show",
    benefitCount: "fraction", returnLabel: "The returned hour",
    returnHeadline: "What will you do with the hours it gives back?", returnList: "all",
    returnLine: "A hybrid organisation does not ask you to think less. It helps you act on more of what you know."
  };

  const stores = {
    "mindmake-homepage-opening-combination-v1": { compositionDesktop:"editorial",compositionMobile:"overlay",titleDesktop:"balanced",titleMobile:"balanced",measureDesktop:"balanced",measureMobile:"balanced",positionDesktop:"middle",positionMobile:"high",cropDesktop:"center",cropMobile:"right",contrast:"cinema",lede:"show",doors:"paired",proof:"show",reveal:"staged" },
    "mindmake-homepage-history-console-v2": { answers: historyAnswers, notes:{}, comment:"", index:0, story:0, device:"desktop", locked:true, recheckOnly:false, recordVersion:4 },
    "mindmake-homepage-authority-console-v1": { answers: authorityAnswers, notes:{}, comment:"", index:0, phase:"work", device:"desktop", locked:false, recheckOnly:false, recordVersion:3 },
    "mindmake-homepage-leadership-dividend-console-v1": { answers: dividendAnswers, notes:{}, comment:"", index:0, mode:"practice", device:"desktop", locked:true, recordVersion:1 },
    "mindmake-homepage-route-combination-v1": { compositionDesktop:"balanced",compositionMobile:"copy",titleDesktop:"balanced",titleMobile:"balanced",measureDesktop:"balanced",measureMobile:"balanced",action:"copy",back:"text",caption:"show",receipt:"full",steps:"numbered",reveal:"staged" },
    "mindmake-footer-combination-v1": { structureDesktop:"rail",structureMobile:"compact",densityDesktop:"compact",densityMobile:"compact",brand:"full",statement:"short",routes:"single",legal:"bottom",copyright:"short",ground:"dark",rule:"accent",reveal:"scroll" },
    "mindmake-navigation-overlay-combination-v1": { structureDesktop:"index",structureMobile:"list",scaleDesktop:"balanced",scaleMobile:"balanced",densityDesktop:"balanced",densityMobile:"balanced",order:"build",secondary:"footer",active:"rule",action:"bar",ground:"solid",entrance:"stepped" }
  };
  Object.entries(stores).forEach(([key, value]) => localStorage.setItem(key, JSON.stringify(value)));

  const allFrames = [...document.querySelectorAll("iframe[data-source]")];
  const isMobile = () => matchMedia(MOBILE).matches;
  const embedCss = (kind, mobile) => {
    const target = mobile ? ".preview-mobile" : ".preview-desktop";
    const device = mobile ? ".device-mobile" : ".device-desktop";
    if (kind === "console") return `
      html,body,.console-shell{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#06110d!important}
      .console-shell{position:relative!important;display:block!important}.console-workspace,.preview-pane,.preview-stage{position:absolute!important;inset:0!important;display:block!important;width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#06110d!important}
      .console-head,.decision-pane,.preview-toolbar{display:none!important}
      .device-frame{display:none!important}${device}{display:block!important;width:100%!important;height:100%!important;max-width:none!important;aspect-ratio:auto!important;margin:0!important;border:0!important}
      ${device}>section{width:100%!important;height:100%!important}.has-focus{outline:0!important}.has-focus [data-focus-region]{opacity:1!important;filter:none!important;outline:0!important;box-shadow:none!important}`;
    return `
      html,body,.review-shell,.workspace,.previews{width:100%!important;height:100%!important;min-width:0!important;min-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important;background:#06110d!important}
      .review-head,.controls,.preview-label,.route-switch{display:none!important}.workspace{display:block!important}.previews{position:static!important}
      .preview-card{display:none!important}${target}{display:block!important;width:100%!important;height:100%!important;max-width:none!important;margin:0!important;border:0!important;box-shadow:none!important}
      ${target} .site-frame,${target}.site-footer{width:100%!important;height:100%!important;min-height:0!important;aspect-ratio:auto!important}`;
  };

  const patchOpening = (doc) => {
    doc.querySelectorAll(".hero-copy h2").forEach((node) => node.textContent = "Build the business that can think with you.");
    doc.querySelectorAll(".hero-lede").forEach((node) => node.textContent = "Part people. Part agent. Led by judgement.");
    doc.querySelectorAll(".route-doors button").forEach((button, index) => {
      const routeIndex = index % 2;
      button.removeAttribute("tabindex");
      button.querySelector("span").textContent = "Build your";
      button.querySelector("strong").textContent = routeIndex ? "AI GTM" : "AI brain";
      button.querySelector("small").textContent = routeIndex ? "Build your AI native pricing, positioning and org." : "Your judgement, running.";
      button.addEventListener("click", () => selectRoute(routeIndex ? "gtm" : "brain", true));
    });
    doc.querySelectorAll(".shared-proof").forEach((node) => node.textContent = "Build the first working version on real work. Keep the system.");
  };
  const routeCopy = {
    brain: { title:"Make your judgement reusable.", lede:"Give your standards, context and past decisions a memory you can use.", caption:"The next decision begins with what the last one taught you." },
    gtm: { title:"We turn an AI market shift into one tested commercial move.", lede:"See how one market change alters product, price, positioning and people before you commit.", caption:"Start with the commercial decision that is holding the rest of the system back." }
  };
  const patchRouteCopy = (doc, route) => {
    const copy = routeCopy[route];
    doc.querySelectorAll(".route-copy h2").forEach((node) => node.textContent = copy.title);
    doc.querySelectorAll(".lede").forEach((node) => node.textContent = copy.lede);
    doc.querySelectorAll("figcaption").forEach((node) => node.textContent = copy.caption);
    doc.querySelectorAll(".back span").forEach((node) => node.textContent = "AI Brain or AI GTM");
    doc.querySelectorAll(".receipt h3").forEach((node) => node.textContent = "What stays with you");
  };
  const patchFooter = (doc) => {
    const labels = ["Build your AI brain","Build your AI GTM","Results","Thinking","Questions leaders ask","Before you start","Media","Start here"];
    doc.querySelectorAll(".footer-routes").forEach((nav) => { nav.innerHTML = labels.map((label) => `<a href="#">${label}</a>`).join(""); });
    doc.querySelectorAll(".footer-statement").forEach((node) => node.textContent = "Keep your edge as AI changes the market.");
  };
  const patchNavigation = (doc) => {
    const labels = ["Build your AI brain","Build your AI GTM","Results","Thinking","Questions leaders ask","Before you start","Media"];
    doc.querySelectorAll(".primary-routes").forEach((nav) => { nav.innerHTML = labels.map((label, i) => `<a href="#"${i === 0 ? ' class="is-active"' : ""}>${label}</a>`).join(""); });
    doc.querySelectorAll(".start-action").forEach((node) => node.innerHTML = "Start here <span>→</span>");
  };
  const wireMenu = (doc) => doc.querySelectorAll(".menu-control").forEach((control) => {
    control.style.cursor = "pointer";
    control.setAttribute("role", "button");
    control.setAttribute("tabindex", "0");
    const invoke = () => toggleNavigation(!document.querySelector(".navigation-overlay").classList.contains("is-open"));
    control.addEventListener("click", invoke);
    control.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") invoke(); });
  });
  const prepare = (frame) => {
    const doc = frame.contentDocument;
    if (!doc) return;
    let style = doc.querySelector("#synthesis-embed-style");
    if (!style) { style = doc.createElement("style"); style.id = "synthesis-embed-style"; doc.head.append(style); }
    style.textContent = embedCss(frame.dataset.kind, isMobile());
    const component = frame.closest("[data-component]")?.dataset.component;
    if (component === "opening") patchOpening(doc);
    if (component === "route") patchRouteCopy(doc, currentRoute);
    if (component === "footer") patchFooter(doc);
    if (frame.closest(".navigation-overlay")) { patchNavigation(doc); wireMenu(doc); }
    else wireMenu(doc);
    frame.dataset.parityReady = "true";
  };

  let currentRoute = "brain";
  const selectRoute = (route, scroll = false) => {
    currentRoute = route;
    document.querySelectorAll("[data-route-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.routeMode === route)));
    const frame = document.querySelector('[data-component="route"] iframe');
    const doc = frame?.contentDocument;
    doc?.querySelector(`[data-route="${route}"]`)?.click();
    if (doc) patchRouteCopy(doc, route);
    if (scroll) document.querySelector('[data-component="route"]')?.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth"});
  };
  document.querySelectorAll("[data-route-mode]").forEach((button) => button.addEventListener("click", () => selectRoute(button.dataset.routeMode)));

  const selectDividend = (mode) => {
    document.querySelectorAll("[data-dividend-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.dividendMode === mode)));
    const doc = document.querySelector('[data-component="leadership-dividend"] iframe')?.contentDocument;
    doc?.querySelector(`[data-mode="${mode}"]`)?.click();
  };
  document.querySelectorAll("[data-dividend-mode]").forEach((button) => button.addEventListener("click", () => selectDividend(button.dataset.dividendMode)));

  const overlay = document.querySelector(".navigation-overlay");
  const toggleNavigation = (open) => {
    overlay.classList.toggle("is-open", open); overlay.setAttribute("aria-hidden", String(!open)); document.body.classList.toggle("navigation-open", open);
  };
  addEventListener("keydown", (event) => { if (event.key === "Escape") toggleNavigation(false); });
  addEventListener("resize", () => allFrames.forEach(prepare), {passive:true});
  allFrames.forEach((frame) => { frame.addEventListener("load", () => { prepare(frame); if (frame.closest('[data-component="route"]')) selectRoute(currentRoute); }); frame.src = frame.dataset.source; });
})();
