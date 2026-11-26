import { useMastheadHeight } from "@/hooks/useMastheadHeight";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { CompareNudge } from "@/components/mindmake/CompareNudge";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { track } from "@/lib/analytics";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { mountHomepageRuntime } from "@/components/homepage-release/runtime";
import { HOME_COMPARE_IN_HERO, mountHomepageSections } from "@/components/homepage-release/homepageSections";
import { mountHeroRotation } from "@/components/homepage-release/heroRotation";
import "@/styles/mindmake.css";
import "@/styles/new-age-leadership-r5.css";
import "@/components/homepage-release/component-styles.css";
import "@/components/homepage-release/page.css";
import "@/components/homepage-release/integration.css";
import "@/components/homepage-release/homepageSections.css";
import "@/styles/journey.css";

/**
 * Production delivery of the accepted R3 opening, menu and footer, compiled
 * from its immutable source, with the three sections of homepageSections.ts
 * between them (the owner's ruling of 2026-10-24). React owns the lead journey; the
 * bounded adapter owns the opening and menu. Nothing on the page pins.
 */
export default function Index() {
  const rootRef = useRef<HTMLDivElement>(null);
  useMastheadHeight(rootRef, ".r3-opening .site-masthead");
  const { briefOpen, briefRoute, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const startRef = useRef(openBrief);
  const briefOpener = useRef<HTMLElement | null>(null);
  const wasBriefOpen = useRef(false);
  const [compareHost, setCompareHost] = useState<HTMLElement | null>(null);
  startRef.current = openBrief;

  /* The "Prefer to ...?" nudge from /ai-brain, in the hero on a wide screen
     and at the top of the first sheet otherwise (homepageSections.ts). One
     nudge, moved when the screen crosses the line, never two. */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const wide = window.matchMedia(HOME_COMPARE_IN_HERO);
    const place = () => setCompareHost(wide.matches
      ? root.querySelector<HTMLElement>('.preview-desktop [data-hs-compare="hero"]')
      : root.querySelector<HTMLElement>('[data-hs-compare="sheet"]'));
    place();
    wide.addEventListener("change", place);
    return () => wide.removeEventListener("change", place);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.documentElement.classList.add("mm-homepage-active");
    document.body.classList.add("mm-homepage-active");
    const runtime = mountHomepageRuntime(root, {
      onStart: (route) => {
        const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
        briefOpener.current = active?.closest(".r3-navigation")
          ? [...root.querySelectorAll<HTMLElement>(".r3-opening .menu-control")].find(button => button.offsetParent !== null) ?? null
          : active;
        track("scoping_request", { source: "homepage_release", route });
        startRef.current(route);
      },
    });
    const unmountSections = mountHomepageSections(root);
    const unrotate = mountHeroRotation(root);
    /* The generated markup's own links: the hero doors go to their pages and
       the subscribe links leave for the publication. Measured here because
       the adapter only owns chapter interaction. */
    const measure = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const door = target?.closest<HTMLElement>("[data-route-choice]");
      if (door) track("door_click", { source: "homepage_hero", route: door.dataset.routeChoice ?? "" });
      const publication = target?.closest("a[href*='substack.com'], a[href*='makeyourmindup.ai']");
      if (publication) track("substack_click", { source: publication.closest(".r3-navigation") ? "menu" : (publication as HTMLElement).dataset.subscribeSource ?? "homepage_footer" });
    };
    root.addEventListener("click", measure);
    return () => {
      root.removeEventListener("click", measure);
      unrotate();
      unmountSections();
      runtime.destroy();
      document.documentElement.classList.remove("mm-homepage-active");
      document.body.classList.remove("mm-homepage-active");
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    root.inert = briefOpen;
    if (briefOpen) root.setAttribute("aria-hidden", "true");
    else root.removeAttribute("aria-hidden");
    const restore = wasBriefOpen.current && !briefOpen;
    wasBriefOpen.current = briefOpen;
    const frame = restore ? requestAnimationFrame(() => briefOpener.current?.focus({ preventScroll: true })) : 0;
    return () => { cancelAnimationFrame(frame); root.inert = false; root.removeAttribute("aria-hidden"); };
  }, [briefOpen]);

  return (
    <>
      <SEO
        title="AI can copy almost anything except your taste."
        description="The AI brain company for the people who shape creative work, culture and sport."
        canonical="/"
      />
      <div ref={rootRef} className="mm-homepage-release mm-home-approved" dangerouslySetInnerHTML={{ __html: homepageMarkup }} />
      {compareHost ? createPortal(<CompareNudge key={compareHost.dataset.hsCompare} page="brain" source={`homepage_${compareHost.dataset.hsCompare}`} />, compareHost) : null}
      <div className="mm-site"><div>
        <LeadBrief
          key={briefRoute}
          open={briefOpen}
          route={briefRoute}
          onClose={closeBrief}
          presentation="drawer"
          journeyKey={briefJourneyKey}
        />
      </div></div>
    </>
  );
}
