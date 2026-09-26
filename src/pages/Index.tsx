import { useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { track } from "@/lib/analytics";
import { homepageMarkup } from "@/components/homepage-release/markup";
import { mountHomepageRuntime } from "@/components/homepage-release/runtime";
import { mountLeadershipChapters } from "@/components/leadership-chapters/leadershipChapters";
import { mountPinnedChapters } from "@/components/homepage-release/pinnedChapters";
import { mountReturnedHour } from "@/components/homepage-release/returnedHour";
import "@/styles/mindmake.css";
import "@/styles/new-age-leadership-r5.css";
import "@/components/homepage-release/component-styles.css";
import "@/components/homepage-release/page.css";
import "@/components/homepage-release/integration.css";
import "@/components/homepage-release/pinnedChapters.css";

/**
 * Production delivery of the accepted R3, not a reconstruction of it.
 * Markup and styles are compiled from its immutable source. React owns the
 * lead journey; the bounded adapter owns the opening, route and menu; the
 * three new-age leadership chapters between them carry their own scroll
 * behaviour, shared with /new-age-leadership.
 */
export default function Index() {
  const rootRef = useRef<HTMLDivElement>(null);
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
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const unpin = mountPinnedChapters(root, runtime);
    const unmountChapters = mountLeadershipChapters(root, { reduced: motion.matches, media: true, canPlay: () => !motion.matches });
    const unstrike = mountReturnedHour(root);
    /* The generated markup's own links: the hero doors go to their pages and
       the subscribe links leave for the publication. Measured here because
       the adapter only owns chapter interaction. */
    const measure = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;
      const door = target?.closest<HTMLElement>("[data-route-choice]");
      if (door) track("door_click", { source: "homepage_hero", route: door.dataset.routeChoice ?? "" });
      const publication = target?.closest("a[href*='substack.com']");
      if (publication) track("substack_click", { source: publication.closest(".r3-navigation") ? "menu" : "homepage_footer" });
    };
    root.addEventListener("click", measure);
    return () => {
      root.removeEventListener("click", measure);
      unstrike();
      unmountChapters();
      unpin();
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
        title="Build the business that can think with you."
        description="Part people. Part agent. Led by judgement. Build your AI brain or your AI native pricing, positioning and organisation with Mindmake."
        canonical="/"
      />
      <div ref={rootRef} className="mm-homepage-release mm-home-approved" dangerouslySetInnerHTML={{ __html: homepageMarkup }} />
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
