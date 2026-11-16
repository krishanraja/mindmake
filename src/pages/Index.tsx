import { useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeFooter } from "@/components/mindmake/MindmakeFooter";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { track } from "@/lib/analytics";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { mountHomepageRuntime } from "@/components/homepage-release/runtime";
import { mountHomepageSections } from "@/components/homepage-release/homepageSections";
import { mountHeroRotation } from "@/components/homepage-release/heroRotation";
import { settleSections } from "@/lib/sectionSettle";
import "@/styles/mindmake.css";
import "@/styles/new-age-leadership-r5.css";
import "@/components/homepage-release/component-styles.css";
import "@/components/homepage-release/page.css";
import "@/components/homepage-release/integration.css";
import "@/components/homepage-release/homepageSections.css";

/**
 * Production delivery of the accepted R3 opening and menu, compiled from its
 * immutable source, with the sections of homepageSections.ts after them (the
 * owner's ruling of 2026-10-24), then the one footer every page carries
 * (MindmakeFooter, owner ruling of 2026-11-16). React owns the lead journey
 * and the footer; the bounded adapter owns the opening and menu. Nothing on
 * the page pins.
 */
export default function Index() {
  const rootRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLElement>(null);
  const { briefOpen, briefRoute, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const startRef = useRef(openBrief);
  const briefOpener = useRef<HTMLElement | null>(null);
  const wasBriefOpen = useRef(false);
  startRef.current = openBrief;

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
    /* Each section eases back as it leaves (Ruling, owner, 2026-11-10:
       "Gentle settle, no pinning"). Not the opening: the approved masthead is
       fixed inside it, and a scale would carry the masthead with it. */
    const unsettle = settleSections([...root.querySelectorAll<HTMLElement>(".hs-section")]);
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
    /* The footer sits after the generated markup, so the R3 menu's own inert
       does not reach it. It follows the menu, as the page under it does. */
    const footerFollowsMenu = () => {
      const footer = footerRef.current;
      if (footer) footer.inert = document.body.classList.contains("navigation-open") || root.inert;
    };
    const menuWatch = new MutationObserver(footerFollowsMenu);
    menuWatch.observe(document.body, { attributes: true, attributeFilter: ["class"] });
    const footer = footerRef.current;
    return () => {
      menuWatch.disconnect();
      if (footer) footer.inert = false;
      root.removeEventListener("click", measure);
      unrotate();
      unmountSections();
      unsettle();
      runtime.destroy();
      document.documentElement.classList.remove("mm-homepage-active");
      document.body.classList.remove("mm-homepage-active");
    };
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const footer = footerRef.current;
    root.inert = briefOpen;
    if (footer) footer.inert = briefOpen || document.body.classList.contains("navigation-open");
    if (briefOpen) root.setAttribute("aria-hidden", "true");
    else root.removeAttribute("aria-hidden");
    const restore = wasBriefOpen.current && !briefOpen;
    wasBriefOpen.current = briefOpen;
    const frame = restore ? requestAnimationFrame(() => briefOpener.current?.focus({ preventScroll: true })) : 0;
    return () => { cancelAnimationFrame(frame); root.inert = false; root.removeAttribute("aria-hidden"); if (footer) footer.inert = false; };
  }, [briefOpen]);

  return (
    <>
      <SEO
        title="Promote your AI from intern to chief of staff."
        description="Part people. Part agent. Led by judgement. Build your AI brain or your AI native pricing, positioning and organisation with Mindmake."
        canonical="/"
      />
      <div ref={rootRef} className="mm-homepage-release mm-home-approved" dangerouslySetInnerHTML={{ __html: homepageMarkup }} />
      <MindmakeFooter
        ref={footerRef}
        id="footer"
        className="mm-footer-home"
        source="homepage_footer"
        onStart={() => {
          briefOpener.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
          startRef.current("home");
        }}
      />
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
