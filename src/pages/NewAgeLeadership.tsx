import { useEffect, useMemo, useRef, useState } from "react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CommercialDecisionBalance } from "@/components/mindmake/locked/CommercialDecisionBalance";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import "@/styles/mindmake.css";
import writing from "../../prototypes/website-redesign-recovery/new-age-leadership/media/history-writing-s2.webp";
import loom from "../../prototypes/website-redesign-recovery/new-age-leadership/media/history-loom-s2.webp";
import calculator from "../../prototypes/website-redesign-recovery/new-age-leadership/media/history-calculator-s2.webp";
import satnav from "../../prototypes/website-redesign-recovery/new-age-leadership/media/history-satnav-s2.webp";
import quietPoster from "../../prototypes/website-redesign-recovery/case-study-browsing/media/quiet-workshop-growth-loop-r01-20s-720p-web-sealed-poster.webp";
import readyPoster from "../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import quietFilm from "@/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4";
import readyFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import { leadershipChaptersMarkup, mountLeadershipChapters } from "@/components/leadership-chapters/leadershipChapters";
import "@/styles/new-age-leadership-r5.css";

const description = "Build a hybrid organisation where AI carries the repeated work and people keep the judgement, relationships and decisions.";
const esc = (value: string) => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

const stories = [
  ["Writing", writing, "An ancient teacher speaking while a scribe records the words on papyrus", "If knowledge lives outside us, will memory grow weaker?", "Ideas could travel beyond one voice and survive their maker. We changed what memory was for."],
  ["The loom", loom, "A skilled textile worker considering a mechanised loom in an early nineteenth-century mill", "If the machine can do the work, what happens to the worker?", "The fear was not foolish. Jobs, wages and status changed. The real fight was over who controlled the gain."],
  ["Calculator", calculator, "A teacher introduces a pocket calculator beside handwritten arithmetic in a 1970s classroom", "If the device does the arithmetic, will children stop learning to think?", "A review of 79 studies found no collapse in basic skills. The question moved from doing every sum to understanding the answer."],
  ["Satnav", satnav, "An early satellite-navigation unit and a paper map inside a car at a crossroads", "If the device knows the route, will we lose our sense of direction?", "That risk turned out to be real. A useful tool still asks us what we choose to keep practising."],
] as const;

function pageMarkup() {
  const frames = stories.map((s, i) => `<figure class="lens-frame${i ? "" : " is-active"}" data-lens-frame="${i}" aria-hidden="${Boolean(i)}"><img src="${esc(s[1])}" alt="${esc(s[2])}" /></figure>`).join("");
  const copies = stories.map((s, i) => `<div class="lens-copy${i ? "" : " is-active"}" data-lens-copy="${i}" aria-hidden="${Boolean(i)}"><h3>${s[3]}</h3><p><b>What changed</b> ${s[4]}</p></div>`).join("");
  const eras = stories.map((s, i) => `<button class="${i ? "" : "is-active"}" data-lens-button="${i}"${i ? "" : ' aria-current="step"'}><i>0${i + 1}</i><span>${s[0] === "The loom" ? "Loom" : s[0]}</span></button>`).join("");
  return `<section class="hero" id="top" aria-labelledby="hero-title"><video class="hero-film" muted loop playsinline preload="metadata" poster="${esc(quietPoster)}"><source src="${esc(quietFilm)}" type="video/mp4" /></video><div class="hero-wash" aria-hidden="true"></div><div class="hero-orbits" aria-hidden="true"><i></i><i></i><i></i><span></span></div><div class="hero-content"><p class="kicker"><span></span>The hybrid organisation</p><h1 id="hero-title">Build the business<br />that can <em>think</em><br />with you.</h1><p class="hero-deck scroll-reveal" data-reveal="hero-deck">Part people. Part agent.<br />Led by judgement.</p><a class="hero-action" href="#old-feeling">Begin the story <span aria-hidden="true">↓</span></a><button class="motion-toggle" type="button" aria-pressed="false"><i aria-hidden="true"></i><span>Pause motion</span></button></div><p class="film-mark">Illustrative machinery</p></section>
  <section class="old-feeling" id="old-feeling" aria-labelledby="old-feeling-title"><p class="kicker"><span></span>This feeling is older than AI</p><h2 id="old-feeling-title">You are not the first person to wonder what a new tool might take from you.</h2><p class="scroll-reveal" data-reveal>We have been asking that question for centuries.</p></section>
  <section class="time-lens" id="history" aria-labelledby="lens-title" tabindex="0"><div class="lens-sticky"><div class="lens-viewport" data-lens-viewport>${frames}<div class="lens-wash" aria-hidden="true"></div><div class="lens-aperture" aria-hidden="true"><i></i><i></i><b></b></div></div><div class="lens-story" aria-live="polite"><p class="kicker"><span></span><b data-lens-count>01 / 04</b><i data-lens-era>Writing</i></p><h2 id="lens-title">We have felt this before.</h2>${copies}</div><nav class="lens-era-nav" aria-label="Choose an era">${eras}</nav><div class="lens-controls"><button type="button" data-lens-prev aria-label="Previous story">←</button><label><span>Move through time</span><input data-lens-range type="range" min="0" max="3" step="1" value="0" aria-label="Historical story" /></label><button type="button" data-lens-next aria-label="Next story">→</button></div></div></section>
  ${leadershipChaptersMarkup()}
  <section class="finale" id="finale" aria-labelledby="finale-title"><video muted loop playsinline preload="none" poster="${esc(readyPoster)}"><source src="${esc(readyFilm)}" type="video/mp4" /></video><div class="finale-wash"></div><div class="finale-copy"><p class="kicker"><span></span>The human boundary</p><h2 id="finale-title">Let the work move.<br />Keep the understanding<br /><em>with you.</em></h2><p>A hybrid organisation does not ask you to think less. It helps you act on more of what you know.</p><a href="#top">Return to the beginning <span aria-hidden="true">↑</span></a></div></section>`;
}

function useExperience(rootRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const abort = new AbortController();
    const observers: IntersectionObserver[] = [];
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData === true;
    const toggle = root.querySelector<HTMLButtonElement>(".motion-toggle");
    const videos = [...root.querySelectorAll<HTMLVideoElement>("video")];
    let paused = reduced || saveData;
    const syncMotion = () => { toggle?.setAttribute("aria-pressed", String(paused)); const label = toggle?.querySelector("span"); if (label) label.textContent = paused ? "Play motion" : "Pause motion"; root.classList.toggle("motion-paused", paused); };
    const play = (video: HTMLVideoElement) => { if (!paused) void video.play().catch(() => undefined); };
    syncMotion();
    toggle?.addEventListener("click", () => { paused = !paused; syncMotion(); videos.forEach((v) => !paused && v.getBoundingClientRect().top < innerHeight && v.getBoundingClientRect().bottom > 0 ? play(v) : v.pause()); }, { signal: abort.signal });
    const videoObserver = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting ? play(entry.target as HTMLVideoElement) : (entry.target as HTMLVideoElement).pause()), { threshold: 0.18 }); observers.push(videoObserver); videos.forEach((v) => videoObserver.observe(v));
    const reveals = [...root.querySelectorAll<HTMLElement>("[data-reveal]")];
    if (reduced || saveData) reveals.forEach((x) => x.classList.add("is-revealed")); else { const observer = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { (e.target as HTMLElement).classList.add("is-revealed"); observer.unobserve(e.target); } }), { threshold: 0.25 }); observers.push(observer); reveals.forEach((x) => observer.observe(x)); }
    const activate = (selector: string, index: number, current = "step") => root.querySelectorAll<HTMLElement>(selector).forEach((node, i) => {
      node.classList.toggle("is-active", i === index);
      node.setAttribute("aria-hidden", String(i !== index));
      if (node.tagName === "BUTTON") {
        if (i === index) node.setAttribute("aria-current", current);
        else node.removeAttribute("aria-current");
      }
    });
    let lensIndex = 0; let lensLockUntil = 0;
    const setLens = (raw: number) => { lensIndex = Math.max(0, Math.min(3, raw)); activate("[data-lens-frame]", lensIndex); activate("[data-lens-copy]", lensIndex); activate("[data-lens-button]", lensIndex); const range = root.querySelector<HTMLInputElement>("[data-lens-range]"); if (range) range.value = String(lensIndex); const count = root.querySelector("[data-lens-count]"); const era = root.querySelector("[data-lens-era]"); if (count) count.textContent = `0${lensIndex + 1} / 04`; if (era) era.textContent = stories[lensIndex][0]; };
    const lens = root.querySelector<HTMLElement>(".time-lens");
    /* The era buttons and the range move the page to where that era lives,
       rather than swapping the picture underneath a reader who has not moved.
       The phone used to be excluded here and fell back to tapping through. */
    const chooseLens = (i: number) => { setLens(i); lensLockUntil = performance.now() + 1200; if (!lens) return; scrollTo({ top: scrollY + lens.getBoundingClientRect().top + Math.max(1, lens.offsetHeight - innerHeight) * (lensIndex / 3), behavior: reduced ? "auto" : "smooth" }); };
    root.querySelectorAll<HTMLElement>("[data-lens-button]").forEach((button, i) => button.addEventListener("click", () => chooseLens(i), { signal: abort.signal })); root.querySelector("[data-lens-prev]")?.addEventListener("click", () => chooseLens(lensIndex - 1), { signal: abort.signal }); root.querySelector("[data-lens-next]")?.addEventListener("click", () => chooseLens(lensIndex + 1), { signal: abort.signal }); root.querySelector<HTMLInputElement>("[data-lens-range]")?.addEventListener("input", (e) => chooseLens(Number((e.target as HTMLInputElement).value)), { signal: abort.signal });
    /* The history lens reads its state from where the page is, forwards and
       backwards. It is not gated to wide screens: below 900px it pins too, so
       there is a scroll position to read. The three chapters after it share
       their source and behaviour with the homepage. */
    const update = () => { if (lens && performance.now() >= lensLockUntil) setLens(Math.round(Math.max(0, Math.min(1, -lens.getBoundingClientRect().top / Math.max(1, lens.offsetHeight - innerHeight))) * 3)); };
    addEventListener("scroll", update, { passive: true, signal: abort.signal }); addEventListener("resize", update, { signal: abort.signal });
    const unmountChapters = mountLeadershipChapters(root, { reduced });
    setLens(0); update();
    return () => { unmountChapters(); abort.abort(); observers.forEach((o) => o.disconnect()); videos.forEach((v) => v.pause()); };
  }, [rootRef]);
}

export default function NewAgeLeadership() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [briefOpen, setBriefOpen] = useState(false);
  const html = useMemo(pageMarkup, []);
  useExperience(rootRef);
  /* One shell for every route. This page used to carry its own masthead and a
     hand-copied duplicate of the site footer, which is how it ended up with a
     header no other page had, no navigation menu, and a footer that had to be
     kept in step with the real one by hand. */
  return <><SEO title="Build the business that can think with you" description={description} canonical="/new-age-leadership" ogType="article" keywords="AI leadership, hybrid organisation, AI Brain, human judgement" jsonLd={{ "@context": "https://schema.org", "@type": "Article", headline: "Build the business that can think with you", description, author: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" }, publisher: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" }, mainEntityOfPage: { "@type": "WebPage", "@id": "https://mindmake.co/new-age-leadership" } }} /><MindmakeShell siteClassName="mm-route-leadership" onStart={() => setBriefOpen(true)}><div className="nal-page" ref={rootRef} dangerouslySetInnerHTML={{ __html: html }} /><CommercialDecisionBalance context="leadership" onStart={() => setBriefOpen(true)} /></MindmakeShell><LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} /></>;
}
