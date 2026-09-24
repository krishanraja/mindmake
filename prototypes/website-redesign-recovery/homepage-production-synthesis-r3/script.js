(() => {
  const root = document.documentElement;
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
  if (!reducedMotion.matches) root.classList.add("has-motion");

  const scope = (component) => document.querySelector(`[data-component="${component}"]`);
  const within = (component, selector) => [...scope(component).querySelectorAll(selector)];
  const visible = (nodes) => nodes.find((node) => getComputedStyle(node.closest(".r3-variant") || node).display !== "none");

  const navigation = document.querySelector(".r3-navigation");
  const site = document.getElementById("site");
  let navigationReturnFocus = null;
  const focusNavigationClose = () => {
    const variant = matchMedia("(max-width: 700px)").matches ? ".preview-mobile" : ".preview-desktop";
    navigation.querySelector(`${variant} .menu-control`)?.focus({ preventScroll: true });
  };
  const setNavigation = (open, opener = null) => {
    if (open) navigationReturnFocus = opener instanceof HTMLElement ? opener : document.activeElement;
    navigation.classList.toggle("is-open", open);
    navigation.setAttribute("aria-hidden", String(!open));
    navigation.toggleAttribute("inert", !open);
    site.toggleAttribute("inert", open);
    document.body.classList.toggle("navigation-open", open);
    if (open) {
      requestAnimationFrame(focusNavigationClose);
      setTimeout(focusNavigationClose, 60);
    } else if (navigationReturnFocus instanceof HTMLElement) {
      const restoreNavigationFocus = () => navigationReturnFocus?.focus({ preventScroll: true });
      requestAnimationFrame(restoreNavigationFocus);
      setTimeout(restoreNavigationFocus, 60);
    }
  };
  within("opening", ".menu-control").forEach((button) => button.addEventListener("click", (event) => setNavigation(true, event.currentTarget)));
  [...navigation.querySelectorAll(".menu-control")].forEach((button) => button.addEventListener("click", () => setNavigation(false)));
  [...navigation.querySelectorAll("a")].forEach((link) => link.addEventListener("click", () => setNavigation(false)));
  addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) setNavigation(false);
    if (event.key !== "Tab" || !navigation.classList.contains("is-open")) return;
    const controls = [...navigation.querySelectorAll("a,button")].filter((node) => node.offsetParent !== null && node.tabIndex >= 0 && !node.disabled);
    const first = controls[0];
    const last = controls.at(-1);
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const routeContent = {
    brain: {
      title: "Make your judgement reusable.",
      lede: "Give your standards, context and past decisions a memory you can use.",
      caption: "The next decision begins with what the last one taught you.",
      source: "Anonymous client outcome · Research and content",
      steps: ["The founder's standards", "A system they own", "Used on real work"],
      result: "Research-backed publishing moved from days to under an hour, and from roughly monthly to most days.",
      film: "../../../src/assets/films/film-02-loop.mp4",
    },
    gtm: {
      title: "We turn an AI market shift into one tested commercial move.",
      lede: "See how one market change alters product, price, positioning and people before you commit.",
      caption: "Start with the commercial decision that is holding the rest of the system back.",
      source: "Anonymous client outcome · Media advisory",
      steps: ["Expertise people value", "A clear offer", "A defined plan launched"],
      result: "A respected advisory firm turned its expertise into a clear offer clients could buy.",
      film: "../../../src/assets/films/film-04-loop.mp4",
    },
  };
  let selectedRoute = "brain";
  const activateRouteMedia = () => within("route", "video").forEach((video) => {
    if (video.closest(".r3-variant")?.offsetParent === null) return;
    const source = video.querySelector("source")?.getAttribute("src") || "";
    if (video.dataset.loadedSrc === source) return;
    video.dataset.loadedSrc = source;
    video.load();
    video.play().catch(() => {});
  });
  const selectRoute = (route, shouldScroll = false, activateMedia = false) => {
    selectedRoute = route;
    within("route", ".site-frame").forEach((frame) => {
      const item = routeContent[route];
      frame.querySelector(".route-copy h2").textContent = item.title;
      frame.querySelector(".lede").textContent = item.lede;
      frame.querySelector("figcaption").textContent = item.caption;
      frame.querySelector(".receipt header p").textContent = item.source;
      [...frame.querySelectorAll(".receipt li")].forEach((node, index) => { node.textContent = item.steps[index]; });
      frame.querySelector("blockquote").textContent = item.result;
      const sourceNode = frame.querySelector("video source");
      if (sourceNode.getAttribute("src") !== item.film) sourceNode.setAttribute("src", item.film);
      frame.querySelector("[data-start-route]").dataset.startRoute = route;
    });
    if (activateMedia) activateRouteMedia();
    if (shouldScroll) scope("route").scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
  };
  within("opening", "[data-route-choice]").forEach((button) => button.addEventListener("click", () => selectRoute(button.dataset.routeChoice, true, true)));
  within("route", "[data-route-toggle]").forEach((button) => button.addEventListener("click", () => {
    selectRoute(selectedRoute === "brain" ? "gtm" : "brain", false, true);
  }));
  within("route", "[data-start-route]").forEach((button) => button.addEventListener("click", () => { location.href = `/?start=${button.dataset.startRoute}`; }));

  const stories = [
    { era: "370 BC · Writing", image: "../new-age-leadership/media/history-writing-s2.webp", alt: "An illustrative historical writing scene", question: "If knowledge lives outside us, will memory grow weaker?", outcome: "Ideas could travel beyond one voice and survive their maker. We changed what memory was for." },
    { era: "1675 · Engine loom", image: "../new-age-leadership/media/history-loom-s2.webp", alt: "An illustrative mechanised loom scene", question: "If the machine can do the work, what happens to the worker?", outcome: "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain." },
    { era: "1970s · Calculator", image: "../new-age-leadership/media/history-calculator-s2.webp", alt: "An illustrative classroom calculator scene", question: "If the device does the arithmetic, will children stop learning to think?", outcome: "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer." },
    { era: "2000s · Satnav", image: "../new-age-leadership/media/history-satnav-s2.webp", alt: "An illustrative early satellite navigation scene", question: "If the device knows the route, will we lose our sense of direction?", outcome: "That risk turned out to be real. A useful tool still asks us what we choose to keep practising." },
  ];
  const selectStory = (index) => {
    within("history", ".history-frame").forEach((frame) => {
      const story = stories[index];
      frame.querySelector("[data-story-question]").textContent = story.question;
      frame.querySelector("[data-story-outcome]").textContent = story.outcome;
      frame.querySelector("[data-story-era]").textContent = story.era;
      frame.querySelector("[data-story-count]").textContent = `0${index + 1}`;
      const image = frame.querySelector("[data-story-image]");
      image.src = story.image;
      image.alt = story.alt;
      frame.querySelectorAll("[data-era]").forEach((button) => button.toggleAttribute("aria-current", Number(button.dataset.era) === index));
    });
  };
  within("history", "[data-era]").forEach((button) => button.addEventListener("click", () => selectStory(Number(button.dataset.era))));

  const selectAuthority = (phase) => {
    within("authority", ".authority-frame").forEach((frame) => {
      frame.dataset.phaseView = phase;
      frame.querySelectorAll("[data-stage]").forEach((button) => {
        const active = button.dataset.stage === phase;
        button.toggleAttribute("aria-current", active);
        button.setAttribute("aria-pressed", String(active));
      });
      frame.querySelectorAll("[data-stage-panel]").forEach((panel) => panel.setAttribute("aria-hidden", String(panel.dataset.stagePanel !== phase)));
    });
  };
  within("authority", "[data-stage]").forEach((button) => button.addEventListener("click", () => {
    selectAuthority(button.dataset.stage);
  }));

  const practiceScenes = [
    ["It notices what changed.", "Signals arrive before someone asks for a report.", "../case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp"],
    ["It joins the evidence.", "New information meets what the business already knows.", "../case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp"],
    ["It prepares the next move.", "Useful work reaches you ready for a decision.", "../case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp"],
  ];
  const benefits = [
    ["Leadership updates become consistent, even when the week was not.", "Your decisions, risks and priorities stay connected from one update to the next."],
    ["Work nobody owns becomes visible before it becomes a problem.", "The Brain joins the gaps across reports, meetings and decisions."],
    ["A change in market pricing becomes a decision, not a forgotten observation.", "It connects the signal to what your commercial team already knows."],
    ["A CEO who hates writing can still publish ideas worth following.", "The blank page goes. Their judgement and voice stay."],
    ["A CRO who hates the numbers can become better at using them.", "The Brain prepares what changed, why it matters and where to look next."],
    ["Founder-led content can begin with the work, not another content calendar.", "Useful thinking already inside the business becomes something people can see."],
  ];
  let dividendMode = "practice";
  let practiceIndex = 0;
  let benefitIndex = 0;
  let benefitTimer = 0;
  let dividendInView = false;
  let dividendHasFocus = false;
  const applyPractice = () => within("leadership-dividend", ".dividend-frame").forEach((frame) => {
    const scene = practiceScenes[practiceIndex];
    frame.querySelector("[data-practice-image]").src = scene[2];
    frame.querySelector("[data-practice-count]").textContent = `0${practiceIndex + 1} / 03`;
    frame.querySelector("[data-practice-title]").textContent = scene[0];
    frame.querySelector("[data-practice-copy]").textContent = scene[1];
    frame.querySelectorAll("[data-practice]").forEach((button, index) => button.toggleAttribute("aria-current", index === practiceIndex));
  });
  const applyBenefit = () => within("leadership-dividend", ".dividend-frame").forEach((frame) => {
    frame.querySelector("[data-benefit-title]").textContent = benefits[benefitIndex][0];
    frame.querySelector("[data-benefit-copy]").textContent = benefits[benefitIndex][1];
    frame.querySelector("[data-benefit-count]").textContent = `${String(benefitIndex + 1).padStart(2, "0")} / 06`;
  });
  const restartBenefitTimer = () => {
    clearInterval(benefitTimer);
    benefitTimer = 0;
    if (dividendMode === "benefits" && dividendInView && !dividendHasFocus && !reducedMotion.matches && !document.hidden) benefitTimer = setInterval(() => { benefitIndex = (benefitIndex + 1) % benefits.length; applyBenefit(); }, 6200);
  };
  const selectDividend = (mode) => {
    dividendMode = mode;
    within("leadership-dividend", ".dividend-frame").forEach((frame) => { frame.dataset.modeView = mode; });
    document.querySelectorAll("[data-dividend-mode]").forEach((button) => button.setAttribute("aria-pressed", String(button.dataset.dividendMode === mode)));
    restartBenefitTimer();
  };
  document.querySelectorAll("[data-dividend-mode]").forEach((button) => button.addEventListener("click", () => {
    selectDividend(button.dataset.dividendMode);
  }));
  within("leadership-dividend", "[data-practice]").forEach((button, index) => button.addEventListener("click", () => { practiceIndex = index % 3; applyPractice(); }));
  within("leadership-dividend", "[data-benefit-prev]").forEach((button) => button.addEventListener("click", () => { benefitIndex = (benefitIndex + benefits.length - 1) % benefits.length; applyBenefit(); restartBenefitTimer(); }));
  within("leadership-dividend", "[data-benefit-next]").forEach((button) => button.addEventListener("click", () => { benefitIndex = (benefitIndex + 1) % benefits.length; applyBenefit(); restartBenefitTimer(); }));
  const dividendSection = scope("leadership-dividend");
  dividendSection.addEventListener("focusin", () => { dividendHasFocus = true; restartBenefitTimer(); });
  dividendSection.addEventListener("focusout", () => setTimeout(() => {
    dividendHasFocus = dividendSection.contains(document.activeElement);
    restartBenefitTimer();
  }));
  if ("IntersectionObserver" in window) new IntersectionObserver(([entry]) => {
    dividendInView = entry.isIntersecting;
    restartBenefitTimer();
  }, { threshold: .12 }).observe(dividendSection);
  else dividendInView = true;
  document.addEventListener("visibilitychange", restartBenefitTimer);
  if ("IntersectionObserver" in window) new IntersectionObserver(([entry], observer) => {
    if (!entry.isIntersecting) return;
    activateRouteMedia();
    observer.disconnect();
  }, { threshold: .05 }).observe(scope("route"));

  const reveals = [...document.querySelectorAll(".r3-reveal")];
  if (reducedMotion.matches || !("IntersectionObserver" in window)) reveals.forEach((section) => section.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }), { threshold: .12, rootMargin: "0px 0px -8%" });
    reveals.forEach((section) => observer.observe(section));
  }
  reducedMotion.addEventListener?.("change", (event) => {
    root.classList.toggle("has-motion", !event.matches);
    reveals.forEach((section) => section.classList.add("is-visible"));
    restartBenefitTimer();
  });

  selectStory(0);
  selectAuthority("work");
  selectDividend("practice");
  selectRoute("brain");
})();
