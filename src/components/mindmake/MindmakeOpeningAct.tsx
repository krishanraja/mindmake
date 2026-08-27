import { useEffect, useRef, useState } from "react";
import brainFilm from "@/assets/CTRL - Demo 5 - Brain.mp4";
import brainPoster from "@/assets/ctrl-brain-poster.webp";
import decisionsPoster from "@/assets/ctrl-decisions-poster.webp";
import { BrainGtmGateway } from "@/components/mindmake/BrainGtmGateway";

const heroThoughts = [
  "If there were 3 of me, I'd be able to get everything done.",
  "I need to deliver an AI strategy - where do I start?",
  "What if I could give every employee an AI coworker?",
  "14 tools pitched this quarter. I use none of them.",
  "I want to build an AI assistant that actually knows our business.",
  "Should we build our own AI tools or buy off the shelf?",
  "Everyone on my team is using different AI tools. It's chaos.",
  "I want AI doing the boring work so my team does the real work.",
  "How do I know if AI is paying off, or just hype?",
  "I keep imagining what my company looks like with AI embedded everywhere.",
  "I'm nervous about getting locked into the wrong vendor.",
  "I should probably understand this better than I do.",
];

const categoryChapters = [
  {
    title: "AI help is everywhere.",
    body: "Consultants bring plans. AI assistants give answers. One-job tools do one task. All-in-one systems promise to run everything.",
  },
  {
    title: "You can hand over the work. Not the understanding.",
    body: "All of them can help. But you still need to test the work, ask better questions and decide what comes next.",
  },
  {
    title: "Keep your own thinking moving.",
    body: "AI keeps changing. Keep learning with it. You will get better at spotting what does not fit and making the call.",
  },
  {
    title: "Build the skill to lead the work.",
    body: "Mindmake helps you learn by using AI on real work. You see what it can do, where it falls short and how to make the call.",
  },
];

const judgementChapters = [
  {
    title: "Build on what makes you good.",
    body: "Your experience, taste and vision are the starting point. AI should help you grow into the leader you want to become, even as the work changes.",
  },
  {
    title: "Get better at the work you find hard.",
    body: "Use AI to help with weak spots, show what changed and find what you may not be seeing yet.",
  },
  {
    title: "Put more of yourself where it matters.",
    body: "Let AI carry memory, research and repeat work. Reinvest the time in ideas, people and choices where you add the most value.",
  },
  {
    title: "See more. Decide faster. Act with confidence.",
    body: "AI can open more paths, show blind spots and keep the right facts close. You still decide what matters.",
  },
];

const categoryCuts = [.24, .48, .72];
const chapterCuts = [.24, .49, .74];
const categoryEntryOffsets = [[-78, -50], [88, -52], [-82, 58], [92, 62]];
const categoryExitOffsets = [[-34, -24], [36, -26], [-38, 28], [40, 30]];
/* Portrait cards enter vertically so nothing clips the narrow canvas. */
const categoryEntryOffsetsPhone = [[0, -30], [0, -30], [0, 30], [0, 30]];
const categoryExitOffsetsPhone = [[0, -14], [0, -14], [0, 14], [0, 14]];

/* The judgement thread has one choreography and two stage geometries: the
   approved landscape constellation for wide screens and a portrait
   constellation composed for phones. Both are applied from here so the
   scroll story stays identical. */
const threadGeometries = {
  wide: {
    viewBox: "0 0 900 680",
    start: [390, 340],
    nodes: [[250, 150], [455, 155], [565, 280], [235, 505], [440, 540], [590, 445]],
    coreRadii: [72, 84],
    timePath: "M235 505C300 625 470 640 590 445",
    timeRect: [355, 605, 148, 36],
    timeText: [429, 628],
    evidenceTags: [[720, 170], [730, 510]],
    optionCircles: [[650, 105], [725, 142], [790, 225], [760, 355], [815, 420], [702, 560]],
    optionRect: [638, 67, 178, 34],
    optionText: [727, 89],
  },
  portrait: {
    viewBox: "0 0 460 560",
    start: [230, 320],
    nodes: [[118, 84], [342, 84], [352, 208], [108, 208], [118, 450], [342, 450]],
    coreRadii: [52, 62],
    timePath: "M118 500C160 536 300 536 342 500",
    timeRect: [156, 512, 148, 36],
    timeText: [230, 535],
    evidenceTags: [[112, 146], [348, 146]],
    optionCircles: [[52, 278], [408, 266], [58, 364], [402, 358], [230, 186], [230, 400]],
    optionRect: [141, 8, 178, 34],
    optionText: [230, 30],
  },
} as const;
const brainVideoStart = .15;
const brainVideoEnd = 2.75;

type ProofRoute = "brain" | "gtm";

const proofStates = {
  brain: {
    heading: "You do not start from scratch every time.",
    body: "Your AI Brain remembers what you know, what good looks like to you and the choices you have already made. It brings the right parts back when you need to decide.",
    announcement: "AI Brain example selected.",
    title: "Your thinking is ready.",
    caption: "Facts, standards and past choices come back when they matter.",
  },
  gtm: {
    heading: "Make the business decision with the facts in front of you.",
    body: "CTRL brings together what has changed, what customers are doing and what your team knows. You can see the real choice and agree what to test next.",
    announcement: "AI GTM example selected.",
    title: "Your team can see why you chose it.",
    caption: "The product, price, message and team options stay next to the facts behind the decision.",
  },
} satisfies Record<ProofRoute, { heading: string; body: string; announcement: string; title: string; caption: string }>;

const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
const ease = (value: number) => value < .5 ? 4 * value * value * value : 1 - Math.pow(-2 * value + 2, 3) / 2;
const range = (value: number, start: number, end: number) => ease(clamp((value - start) / Math.max(.0001, end - start)));

/* SVG text cannot wrap or shrink to its container, so every label is measured
   against the shape drawn around it and stepped down until it fits. */
function fitSvgText(text: SVGTextElement, available: number) {
  /* Clear any earlier fit first so the stylesheet size is always the
     starting point and repeated fits cannot ratchet the label smaller. */
  text.style.removeProperty("font-size");
  if (typeof text.getComputedTextLength !== "function" || available <= 0) return;
  let size = Number.parseFloat(getComputedStyle(text).fontSize) || 16;
  for (let step = 0; step < 12; step += 1) {
    const width = text.getComputedTextLength();
    if (!width || width <= available) return;
    size = Math.max(7, size * Math.min(.94, available / width));
    text.style.fontSize = `${size.toFixed(2)}px`;
  }
}

function curvePath(from: number[], to: number[], bend = .5) {
  const controlX = mix(from[0], to[0], bend);
  return `M${from[0].toFixed(1)} ${from[1].toFixed(1)}C${controlX.toFixed(1)} ${from[1].toFixed(1)} ${controlX.toFixed(1)} ${to[1].toFixed(1)} ${to[0].toFixed(1)} ${to[1].toFixed(1)}`;
}

export function MindmakeOpeningAct() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroRotationRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLElement>(null);
  const threadRef = useRef<HTMLElement>(null);
  const proofRef = useRef<HTMLElement>(null);
  const proofMediaRef = useRef<HTMLDivElement>(null);
  const proofVideoRef = useRef<HTMLVideoElement>(null);
  const transitionTimerRef = useRef<number>(0);
  const [heroThoughtIndex, setHeroThoughtIndex] = useState(0);
  const [previousHeroThoughtIndex, setPreviousHeroThoughtIndex] = useState<number | null>(null);
  const [heroHasAdvanced, setHeroHasAdvanced] = useState(false);
  const [heroRotationPaused, setHeroRotationPaused] = useState(false);
  const [heroRotationInView, setHeroRotationInView] = useState(true);
  const [documentVisible, setDocumentVisible] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [proofRoute, setProofRoute] = useState<ProofRoute>("brain");
  const proofState = proofStates[proofRoute];

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      setReducedMotion(media.matches);
      if (media.matches) {
        setHeroThoughtIndex(0);
        setPreviousHeroThoughtIndex(null);
        setHeroHasAdvanced(false);
      }
    };
    const updateVisibility = () => setDocumentVisible(!document.hidden);
    updatePreference();
    updateVisibility();
    media.addEventListener?.("change", updatePreference);
    document.addEventListener("visibilitychange", updateVisibility);
    return () => {
      media.removeEventListener?.("change", updatePreference);
      document.removeEventListener("visibilitychange", updateVisibility);
    };
  }, []);

  useEffect(() => {
    const reel = heroRotationRef.current;
    if (!reel || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(([entry]) => setHeroRotationInView(entry.isIntersecting), { threshold: .25 });
    observer.observe(reel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (heroRotationPaused || reducedMotion || !documentVisible || !heroRotationInView) return;
    const timer = window.setTimeout(() => {
      setPreviousHeroThoughtIndex(heroThoughtIndex);
      setHeroThoughtIndex((heroThoughtIndex + 1) % heroThoughts.length);
      setHeroHasAdvanced(true);
      window.clearTimeout(transitionTimerRef.current);
      transitionTimerRef.current = window.setTimeout(() => setPreviousHeroThoughtIndex(null), 420);
    }, heroHasAdvanced ? 4400 : 1100);
    return () => window.clearTimeout(timer);
  }, [documentVisible, heroHasAdvanced, heroRotationInView, heroRotationPaused, heroThoughtIndex, reducedMotion]);

  useEffect(() => () => window.clearTimeout(transitionTimerRef.current), []);

  useEffect(() => {
    const root = rootRef.current;
    const category = categoryRef.current;
    const thread = threadRef.current;
    const proof = proofRef.current;
    const proofMedia = proofMediaRef.current;
    if (!root || !category || !thread || !proof || !proofMedia) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const phone = window.matchMedia("(max-width: 560px)");
    const categoryChapterElements = [...category.querySelectorAll<HTMLElement>("[data-mm-category-chapter]")];
    const categoryOffers = [...category.querySelectorAll<HTMLElement>("[data-mm-category-offer]")];
    const chapterElements = [...thread.querySelectorAll<HTMLElement>("[data-mm-thread-chapter]")];
    const nodes = [...thread.querySelectorAll<SVGGElement>("[data-mm-node]")];
    const strands = [...thread.querySelectorAll<SVGPathElement>("[data-mm-strand]")];
    const canvas = thread.querySelector<SVGSVGElement>(".mm-act-thread-canvas");
    const core = thread.querySelector<SVGGElement>(".mm-act-judgement-core");
    const coreDisc = thread.querySelector<SVGCircleElement>(".mm-act-core-disc");
    const corePressure = thread.querySelector<SVGCircleElement>(".mm-act-core-pressure");
    const timeReturn = thread.querySelector<SVGGElement>(".mm-act-time-return");
    const evidenceTags = [...thread.querySelectorAll<SVGGElement>(".mm-act-evidence-tag")];
    const optionField = thread.querySelector<SVGGElement>(".mm-act-option-field");
    let geometry: (typeof threadGeometries)[keyof typeof threadGeometries] = threadGeometries.wide;
    let frame = 0;

    const applyThreadGeometry = () => {
      geometry = phone.matches ? threadGeometries.portrait : threadGeometries.wide;
      canvas?.setAttribute("viewBox", geometry.viewBox);
      core?.setAttribute("transform", `translate(${geometry.start[0]} ${geometry.start[1]})`);
      coreDisc?.setAttribute("r", String(geometry.coreRadii[0]));
      corePressure?.setAttribute("r", String(geometry.coreRadii[1]));
      const timePath = timeReturn?.querySelector("path");
      const timeRect = timeReturn?.querySelector("rect");
      const timeText = timeReturn?.querySelector("text");
      timePath?.setAttribute("d", geometry.timePath);
      timeRect?.setAttribute("x", String(geometry.timeRect[0]));
      timeRect?.setAttribute("y", String(geometry.timeRect[1]));
      timeText?.setAttribute("x", String(geometry.timeText[0]));
      timeText?.setAttribute("y", String(geometry.timeText[1]));
      evidenceTags.forEach((tag, index) => {
        const spot = geometry.evidenceTags[index];
        if (spot) tag.setAttribute("transform", `translate(${spot[0]} ${spot[1]})`);
      });
      if (optionField) {
        [...optionField.querySelectorAll("circle")].forEach((dot, index) => {
          const spot = geometry.optionCircles[index];
          if (!spot) return;
          dot.setAttribute("cx", String(spot[0]));
          dot.setAttribute("cy", String(spot[1]));
        });
        const optionRect = optionField.querySelector("rect");
        const optionText = optionField.querySelector("text");
        optionRect?.setAttribute("x", String(geometry.optionRect[0]));
        optionRect?.setAttribute("y", String(geometry.optionRect[1]));
        optionText?.setAttribute("x", String(geometry.optionText[0]));
        optionText?.setAttribute("y", String(geometry.optionText[1]));
      }
      fitThreadText();
    };

    const fitThreadText = () => {
      nodes.forEach((node) => {
        const rect = node.querySelector("rect");
        if (!rect) return;
        const available = Number.parseFloat(rect.getAttribute("width") || "0") - 18;
        node.querySelectorAll<SVGTextElement>("text").forEach((text) => fitSvgText(text, available));
      });
      const coreWidth = geometry.coreRadii[0] * 1.72;
      core?.querySelectorAll<SVGTextElement>("text").forEach((text) => fitSvgText(text, coreWidth));
      [timeReturn, optionField, ...evidenceTags].forEach((group) => {
        const rect = group?.querySelector("rect");
        const text = group?.querySelector<SVGTextElement>("text");
        if (!rect || !text) return;
        fitSvgText(text, Number.parseFloat(rect.getAttribute("width") || "0") - 12);
      });
    };

    const progressFor = (element: HTMLElement) => {
      const stage = (element.firstElementChild as HTMLElement | null) ?? element;
      const stickyTop = Number.parseFloat(getComputedStyle(stage).top) || 0;
      const rect = element.getBoundingClientRect();
      return clamp((stickyTop - rect.top) / Math.max(1, rect.height - stage.offsetHeight));
    };

    const viewportProgress = (element: HTMLElement) => {
      const rect = element.getBoundingClientRect();
      return clamp((window.innerHeight - rect.top) / Math.max(1, rect.height + window.innerHeight * .1));
    };

    const updateCategory = (isReduced: boolean) => {
      const progress = isReduced ? 1 : progressFor(category);
      const offersProgress = range(progress, .02, .27);
      const work = range(progress, .18, .43);
      const own = range(progress, .65, .88);
      const gap = range(progress, .38, .6) * (1 - range(progress, .66, .8));
      const coreOut = 1 - range(progress, .69, .715);
      const coreIn = range(progress, .715, .75);
      const tabs = range(progress, .5, .58);
      category.style.setProperty("--mm-act-category-offers", offersProgress.toFixed(4));
      category.style.setProperty("--mm-act-category-work", work.toFixed(4));
      category.style.setProperty("--mm-act-category-gap", gap.toFixed(4));
      category.style.setProperty("--mm-act-category-own", own.toFixed(4));
      category.style.setProperty("--mm-act-category-core-out", coreOut.toFixed(4));
      category.style.setProperty("--mm-act-category-core-in", coreIn.toFixed(4));
      category.style.setProperty("--mm-act-category-tabs", tabs.toFixed(4));
      category.style.setProperty("--mm-act-leader-left", `${mix(26, 43.3, own).toFixed(2)}%`);

      const entryOffsets = phone.matches ? categoryEntryOffsetsPhone : categoryEntryOffsets;
      const exitOffsets = phone.matches ? categoryExitOffsetsPhone : categoryExitOffsets;
      categoryOffers.forEach((offer, index) => {
        const offerProgress = isReduced ? 1 : range(progress, .025 + index * .035, .16 + index * .035);
        const entry = entryOffsets[index];
        const exit = exitOffsets[index];
        offer.style.setProperty("--mm-act-offer-progress", offerProgress.toFixed(4));
        offer.style.setProperty("--mm-act-offer-shift-x", `${(mix(entry[0], 0, offerProgress) + mix(0, exit[0], own)).toFixed(1)}px`);
        offer.style.setProperty("--mm-act-offer-shift-y", `${(mix(entry[1], 0, offerProgress) + mix(0, exit[1], own)).toFixed(1)}px`);
      });

      let activeIndex = isReduced ? categoryChapterElements.length - 1 : 0;
      if (!isReduced) categoryCuts.forEach((cut, index) => { if (progress >= cut) activeIndex = index + 1; });
      categoryChapterElements.forEach((chapter, index) => {
        if (isReduced) {
          chapter.style.opacity = "1";
          chapter.style.transform = "none";
          chapter.style.zIndex = "auto";
          chapter.removeAttribute("aria-hidden");
          return;
        }
        const current = index === activeIndex;
        const revealStart = activeIndex === 0 ? 0 : categoryCuts[activeIndex - 1];
        const reveal = activeIndex === 0 ? 1 : range(progress, revealStart, revealStart + .025);
        chapter.style.opacity = current ? "1" : "0";
        chapter.style.zIndex = current ? "1" : "0";
        chapter.style.transform = current ? `translateY(${((1 - reveal) * 10).toFixed(2)}px)` : "translateY(10px)";
        if (current) chapter.removeAttribute("aria-hidden");
        else chapter.setAttribute("aria-hidden", "true");
      });
    };

    const update = () => {
      frame = 0;
      const isReduced = media.matches;
      updateCategory(isReduced);

      const progress = isReduced ? 1 : progressFor(thread);
      const split = range(progress, 0, .18);
      const evidence = range(progress, .18, .28);
      const resolve = range(progress, .38, .5);
      const pressure = range(progress, .56, .68);
      thread.style.setProperty("--mm-act-split", split.toFixed(4));
      thread.style.setProperty("--mm-act-evidence", evidence.toFixed(4));
      thread.style.setProperty("--mm-act-resolve", resolve.toFixed(4));
      thread.style.setProperty("--mm-act-pressure", pressure.toFixed(4));
      nodes.forEach((node, index) => {
        const target = geometry.nodes[index];
        const nodePhase = node.dataset.mmNode;
        const phase = nodePhase === "gap" ? evidence : nodePhase === "value" ? resolve : split;
        const x = mix(geometry.start[0], target[0], phase);
        const y = mix(geometry.start[1], target[1], phase);
        node.style.setProperty("--mm-act-node-progress", phase.toFixed(4));
        node.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
        strands[index]?.style.setProperty("--mm-act-strand-progress", phase.toFixed(4));
        strands[index]?.setAttribute("d", curvePath([geometry.start[0], geometry.start[1]], [x, y], .48));
      });

      let activeIndex = isReduced ? chapterElements.length - 1 : 0;
      if (!isReduced) chapterCuts.forEach((cut, index) => { if (progress >= cut) activeIndex = index + 1; });
      chapterElements.forEach((chapter, index) => {
        if (isReduced) {
          chapter.style.opacity = "1";
          chapter.style.transform = "none";
          chapter.style.zIndex = "auto";
          chapter.removeAttribute("aria-hidden");
          return;
        }
        const current = index === activeIndex;
        const revealStart = activeIndex === 0 ? 0 : chapterCuts[activeIndex - 1];
        const reveal = activeIndex === 0 ? 1 : range(progress, revealStart, revealStart + .02);
        chapter.style.opacity = current ? "1" : "0";
        chapter.style.zIndex = current ? "1" : "0";
        chapter.style.transform = current ? `translateY(${((1 - reveal) * 10).toFixed(2)}px)` : "translateY(10px)";
        if (current) chapter.removeAttribute("aria-hidden");
        else chapter.setAttribute("aria-hidden", "true");
      });

      const proofProgress = isReduced ? 1 : (window.innerWidth <= 900 ? viewportProgress(proofMedia) : range(progressFor(proof), 0, .72));
      proof.style.setProperty("--mm-act-proof", proofProgress.toFixed(4));
    };

    const schedule = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };
    const relayout = () => {
      applyThreadGeometry();
      schedule();
    };
    applyThreadGeometry();
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    media.addEventListener?.("change", schedule);
    phone.addEventListener?.("change", relayout);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      media.removeEventListener?.("change", schedule);
      phone.removeEventListener?.("change", relayout);
    };
  }, []);

  useEffect(() => {
    const video = proofVideoRef.current;
    if (!video) return;
    video.playbackRate = 1.8;
    if (proofRoute === "gtm" || reducedMotion) {
      video.pause();
      return;
    }
    if (video.readyState >= 1 && (video.currentTime < brainVideoStart || video.currentTime > brainVideoEnd)) video.currentTime = brainVideoStart;
    void video.play()?.catch(() => undefined);
  }, [proofRoute, reducedMotion]);

  return (
    <div className="mm-opening-act" id="work" ref={rootRef}>
      <section className="mm-act-hero" id="top" aria-labelledby="hero-title">
        <div className="mm-act-hero-copy">
          <h1 className="mm-act-hero-title" id="hero-title">
            <span>Put your best</span>{" "}
            <span>judgement to work</span>{" "}
            <span>with AI.</span>
          </h1>
          <div className="mm-act-hero-reel" ref={heroRotationRef}>
            <div className="mm-act-hero-reel-window" aria-live="off">
              {previousHeroThoughtIndex !== null && <p className="mm-act-hero-thought is-leaving" aria-hidden="true">{heroThoughts[previousHeroThoughtIndex]}</p>}
              <p className={`mm-act-hero-thought is-current${heroHasAdvanced ? " is-entering" : ""}`} aria-hidden="false" key={heroThoughtIndex}>{heroThoughts[heroThoughtIndex]}</p>
            </div>
            <button
              className="mm-act-rotation-toggle"
              type="button"
              aria-label={`${heroRotationPaused ? "Play" : "Pause"} rotating headlines`}
              title={`${heroRotationPaused ? "Play" : "Pause"} rotating headlines`}
              onClick={() => setHeroRotationPaused((paused) => !paused)}
            >
              {heroRotationPaused ? (
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3.2 12 8l-7 4.8Z" /></svg>
              ) : (
                <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 3v10M11 3v10" /></svg>
              )}
            </button>
          </div>
          <p className="mm-act-hero-lead">Mindmake helps leaders use AI to do more. It keeps what they know close, brings the right facts into view and turns hard choices into tools their team can use.</p>
          <a className="mm-act-hero-action" href="#judgement-thread">Start here <b aria-hidden="true">↓</b></a>
          <div className="mm-act-hero-proof" aria-label="Experience"><strong>17+</strong><span>years in data and technology</span><i aria-hidden="true" /><strong>2</strong><span>years building deeply with AI</span></div>
        </div>
        <figure className="mm-act-hero-media">
          <picture><source media="(max-width: 900px) and (orientation: portrait)" srcSet="/krish-stage-2-hero-mobile.webp" /><img src="/krish-stage-2-hero.webp" alt="Krish Raja in conversation with another leader on stage" width="1600" height="891" /></picture>
          <figcaption>Krish Raja, in conversation on stage</figcaption>
        </figure>
      </section>

      <div className="mm-act-opening-story" id="judgement-thread">
        <section className="mm-act-category-story" ref={categoryRef} aria-labelledby="category-title">
          <div className="mm-act-category-stage">
            <div className="mm-act-category-copy" aria-live="off">
              {categoryChapters.map((chapter, index) => <article className="mm-act-category-chapter" data-mm-category-chapter key={chapter.title} aria-hidden={index === 0 ? undefined : true}><h2 id={index === 0 ? "category-title" : undefined}>{chapter.title}</h2><p>{chapter.body}</p></article>)}
            </div>
            <div className="mm-act-category-visual" aria-hidden="true">
              <div className="mm-act-category-board">
                <svg className="mm-act-category-lines" viewBox="0 0 900 680" preserveAspectRatio="none" focusable="false">
                  <path className="mm-act-category-work-line" pathLength="1" d="M520 130C555 175 610 235 650 340" /><path className="mm-act-category-work-line" pathLength="1" d="M760 145C730 205 688 260 650 340" /><path className="mm-act-category-work-line" pathLength="1" d="M515 550C555 495 610 440 650 340" /><path className="mm-act-category-work-line" pathLength="1" d="M760 535C730 485 685 420 650 340" />
                  <path className="mm-act-category-gap-line" d="M318 340C420 340 520 340 575 340" /><path className="mm-act-category-own-line" pathLength="1" d="M235 340C285 340 338 340 390 340" />
                </svg>
                <svg className="mm-act-category-lines is-portrait" viewBox="0 0 100 100" preserveAspectRatio="none" focusable="false">
                  <path className="mm-act-category-work-line" pathLength="1" d="M28 20C28 36 38 46 46 52" /><path className="mm-act-category-work-line" pathLength="1" d="M72 20C72 36 62 46 54 52" /><path className="mm-act-category-work-line" pathLength="1" d="M28 42C30 48 40 52 47 55" /><path className="mm-act-category-work-line" pathLength="1" d="M72 42C70 48 60 52 53 55" />
                  <path className="mm-act-category-gap-line" d="M50 67C50 69.5 50 72.5 50 75" /><path className="mm-act-category-own-line" pathLength="1" d="M50 86C50 78 50 70 50 62" />
                </svg>
                <div className="mm-act-category-leader"><div className="mm-act-category-leader-copy is-initial"><strong>You</strong><span>Ready to judge the work</span></div><div className="mm-act-category-leader-copy is-owned"><strong>What matters</strong><span>to you</span></div></div>
                <div className="mm-act-category-team"><div><strong>The Work</strong><span>Plans, answers and tools</span></div></div>
                <div className="mm-act-category-offer" data-mm-category-offer data-offer="consultant"><strong>Consultants</strong><span>A plan from outside</span></div>
                <div className="mm-act-category-offer" data-mm-category-offer data-offer="model"><strong>AI assistants</strong><span>An answer when you ask</span></div>
                <div className="mm-act-category-offer" data-mm-category-offer data-offer="tool"><strong>One-job tools</strong><span>One task done</span></div>
                <div className="mm-act-category-offer" data-mm-category-offer data-offer="system"><strong>AI systems</strong><span>A promise to run it all</span></div>
                <span className="mm-act-category-gap-label">What you learn</span><div className="mm-act-category-mindmake" /><span className="mm-act-category-mindmake-label">Mindmake builds with you</span>
                <span className="mm-act-category-capability is-one">Understand</span><span className="mm-act-category-capability is-two">Check</span><span className="mm-act-category-capability is-three">Decide</span>
                <div className="mm-act-category-help-tabs"><span>Consultant</span><span>AI help</span><span>Tool</span><span>System</span></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mm-act-thread-story" ref={threadRef} aria-label="How Mindmake strengthens a leader's judgement with AI">
          <div className="mm-act-thread-stage">
            <div className="mm-act-story-copy" aria-live="off">
              {judgementChapters.map((chapter, index) => <article className="mm-act-thread-chapter" data-mm-thread-chapter key={chapter.title} aria-hidden={index === 0 ? undefined : true}><h2>{chapter.title}</h2><p>{chapter.body}</p></article>)}
            </div>
            <div className="mm-act-thread-visual">
              <svg className="mm-act-thread-canvas" viewBox="0 0 900 680" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
                {[0, 1, 2, 3, 4, 5].map((index) => <path className="mm-act-thread-strand" pathLength="1" data-mm-strand={index} d="M390 340C390 340 390 340 390 340" key={index} />)}
                <g className="mm-act-option-field"><circle cx="650" cy="105" r="15" /><circle cx="725" cy="142" r="11" /><circle cx="790" cy="225" r="13" /><circle cx="760" cy="355" r="9" /><circle cx="815" cy="420" r="12" /><circle className="is-seen" cx="702" cy="560" r="14" /><rect x="638" y="67" width="178" height="34" /><text x="727" y="89">More possible moves</text></g>
                <g className="mm-act-time-return"><path pathLength="1" d="M235 505C300 625 470 640 590 445" /><rect x="355" y="605" width="148" height="36" /><text x="429" y="628">Time returned</text></g>
                {[
                  ["core", "Strengths", "What you do best"], ["core", "Vision", "What you want to make true"], ["core", "Future self", "Who you are becoming"],
                  ["gap", "Weak spots", "Where AI can help"], ["gap", "Blind spots", "What you may miss"], ["value", "High-value work", "What deserves more of you"],
                ].map(([phase, label, note], index) => <g className="mm-act-node" data-mm-node={phase} transform="translate(390 340)" key={label}><rect x="-93" y="-38" width="186" height="76" /><text y="0">{label}</text><text className="mm-act-node-note" y="22">{note}</text></g>)}
                <g className="mm-act-evidence-tag" transform="translate(720 170)"><rect x="-68" y="-18" width="136" height="36" /><text y="4">What changed</text></g><g className="mm-act-evidence-tag" transform="translate(730 510)"><rect x="-66" y="-18" width="132" height="36" /><text y="4">Checked sources</text></g>
                <g className="mm-act-judgement-core" transform="translate(390 340)"><circle className="mm-act-core-disc" r="72" /><circle className="mm-act-core-pressure" pathLength="1" r="84" /><text className="mm-act-core-main" y="-2">What matters</text><text className="mm-act-core-main" y="20">to you</text></g>
              </svg>
            </div>
          </div>
        </section>
      </div>

      <BrainGtmGateway />

      <section className="mm-act-proof-bridge" id="proof" ref={proofRef} aria-labelledby="proof-title">
        <div className="mm-act-proof-copy"><h2 id="proof-title">{proofState.heading}</h2><p>{proofState.body}</p><p className="mm-act-visually-hidden" aria-live="polite">{proofState.announcement}</p></div>
        <div className="mm-act-proof-media-wrap" ref={proofMediaRef}><figure className="mm-act-proof-frame"><span className="mm-act-proof-thread" aria-hidden="true" /><span className="mm-act-proof-playhead" aria-hidden="true" />
          <video
            ref={proofVideoRef}
            muted
            playsInline
            preload="metadata"
            poster={brainPoster}
            aria-hidden="true"
            hidden={proofRoute !== "brain"}
            onLoadedMetadata={(event) => { event.currentTarget.playbackRate = 1.8; event.currentTarget.currentTime = brainVideoStart; if (!reducedMotion) void event.currentTarget.play()?.catch(() => undefined); }}
            onTimeUpdate={(event) => { if (!event.currentTarget.hidden && event.currentTarget.currentTime >= brainVideoEnd) event.currentTarget.currentTime = brainVideoStart; }}
          ><source src={brainFilm} type="video/mp4" /></video>
          <img src={decisionsPoster} alt="CTRL showing a business decision next to the facts behind it." hidden={proofRoute !== "gtm"} />
          <figcaption><strong>{proofState.title}</strong><span>{proofState.caption}</span></figcaption>
        </figure></div>
      </section>
    </div>
  );
}
