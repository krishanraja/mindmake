import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { FilmPlate } from "@/components/mindmake/FilmPlate";
import { LeadBrief, type BriefRoute } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import { useScrollDriver } from "@/hooks/useScrollDriver";
import { track } from "@/lib/analytics";
import filmTwoPoster from "@/assets/films/film-02-poster.jpg";
import filmTwoPosterWebp from "@/assets/films/film-02-poster.webp";
import filmTwoLoop from "@/assets/films/film-02-loop.mp4";
import filmTwoLoopWebm from "@/assets/films/film-02-loop.webm";
import filmFourPoster from "@/assets/films/film-04-poster.jpg";
import filmFourPosterWebp from "@/assets/films/film-04-poster.webp";
import filmFourLoop from "@/assets/films/film-04-loop.mp4";
import filmFourLoopWebm from "@/assets/films/film-04-loop.webm";
import "@/styles/mindmake.css";
import "@/styles/mindmake-instruments.css";
import "@/styles/mindmake-home-vnext.css";

type HomepageRoute = Exclude<BriefRoute, "home">;

interface RouteContent {
  name: string;
  titleLines: [string, string];
  lede: string;
  poster: string;
  posterWebp: string;
  film: string;
  filmWebm: string;
  imageLabel: string;
  caption: string;
  source: string;
  causal: [string, string, string];
  result: string;
}

const ROUTES: Record<HomepageRoute, RouteContent> = {
  brain: {
    name: "Build your AI brain",
    titleLines: ["Your judgement", "at work."],
    lede: "Turn your standards, context and past decisions into a system that helps you make the next call.",
    poster: filmTwoPoster,
    posterWebp: filmTwoPosterWebp,
    film: filmTwoLoop,
    filmWebm: filmTwoLoopWebm,
    imageLabel: "A walnut instrument cabinet with rows of labelled drawers.",
    caption: "The useful part is a system that knows what you would keep, change or reject.",
    source: "Anonymous client outcome · Research and content",
    causal: ["The founder's standards", "A system they own", "Used on real work"],
    result: "Research-backed publishing moved from days to under an hour, and from roughly monthly to most days.",
  },
  gtm: {
    name: "Build your AI GTM",
    titleLines: ["Make the business", "easier to buy."],
    lede: "Rebuild one part of how the business reaches customers and gets paid: product, price, positioning or people.",
    poster: filmFourPoster,
    posterWebp: filmFourPosterWebp,
    film: filmFourLoop,
    filmWebm: filmFourLoopWebm,
    imageLabel: "A brass and walnut instrument moving a paper record through a measured track.",
    caption: "Start with the commercial decision that is holding the rest of the system back.",
    source: "Anonymous client outcome · Media advisory",
    causal: ["Expertise people value", "A clear offer", "A defined plan launched"],
    result: "A respected advisory firm turned its expertise into a clear offer clients could buy.",
  },
};

const routeFromHash = (hash: string): HomepageRoute | null => {
  const candidate = hash.replace(/^#/, "");
  return candidate === "brain" || candidate === "gtm" ? candidate : null;
};

export default function Index() {
  const location = useLocation();
  const navigate = useNavigate();
  const { briefOpen, briefRoute, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const [route, setRoute] = useState<HomepageRoute | null>(null);
  const mounted = useRef(false);
  const routeWasOpenedHere = useRef(false);
  const routeTrigger = useRef<HTMLButtonElement | null>(null);
  const routeTitle = useRef<HTMLHeadingElement | null>(null);
  const thresholdCopyRef = useScrollDriver<HTMLDivElement>(undefined, "read");
  const thresholdInstrumentRef = useScrollDriver<HTMLDivElement>(undefined, "read");
  const thresholdMidRef = useScrollDriver<HTMLSpanElement>(undefined, "read");
  const thresholdTopRef = useScrollDriver<HTMLSpanElement>(undefined, "read");
  const thresholdProofRef = useScrollDriver<HTMLParagraphElement>(undefined, "read");

  useEffect(() => {
    mounted.current = true;
    setRoute(routeFromHash(location.hash));
  }, [location.hash]);

  useEffect(() => {
    if (!mounted.current) return;
    const frame = window.requestAnimationFrame(() => {
      if (route) routeTitle.current?.focus({ preventScroll: true });
      else routeTrigger.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [route]);

  const chooseRoute = useCallback((nextRoute: HomepageRoute, trigger: HTMLButtonElement) => {
    routeTrigger.current = trigger;
    routeWasOpenedHere.current = true;
    setRoute(nextRoute);
    track("door_click", { door: nextRoute, source: "homepage_threshold" });
    navigate({ pathname: "/", search: location.search, hash: nextRoute });
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [location.search, navigate]);

  const showBothRoutes = useCallback(() => {
    setRoute(null);
    window.scrollTo({ top: 0, behavior: "auto" });
    if (routeWasOpenedHere.current) {
      routeWasOpenedHere.current = false;
      navigate(-1);
      return;
    }
    navigate({ pathname: "/", search: location.search, hash: "" }, { replace: true });
  }, [location.search, navigate]);

  useEffect(() => {
    if (!route) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape" || briefOpen) return;
      if (document.body.classList.contains("mm-menu-open") || document.body.classList.contains("mm-dialog-open")) return;
      showBothRoutes();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [briefOpen, route, showBothRoutes]);

  const start = (nextRoute: HomepageRoute) => {
    track("scoping_request", { source: "homepage_route", route: nextRoute });
    openBrief(nextRoute);
  };

  const current = route ? ROUTES[route] : null;

  return (
    <MindmakeShell
      onStart={openBrief}
      mainClassName="mm-home-vnext"
      siteClassName="mm-site-home-vnext"
      showMobileActionBar={false}
      compactFooter
    >
      <SEO
        title="Build the AI that knows how you decide."
        description="Mindmake helps founders and senior commercial leaders turn their standards, context and past decisions into an AI they own."
        canonical="/"
      />

      {!current ? (
        <section className="mm-vnext-threshold" aria-labelledby="homepage-title" data-homepage-view="threshold">
          <span ref={thresholdTopRef} className="mm-vnext-top-build" aria-hidden="true" />
          <div ref={thresholdCopyRef} className="mm-vnext-threshold-copy">
            <h1 id="homepage-title">Build the AI that knows how you decide.</h1>
            <p>
              For founders and commercial leaders. Your standards and past decisions
              become an AI you own.
            </p>
          </div>

          <div ref={thresholdInstrumentRef} className="mm-vnext-instrument" aria-label="Choose how to begin">
            <FilmPlate
              className="mm-vnext-threshold-film"
              poster={filmTwoPoster}
              posterWebp={filmTwoPosterWebp}
              src={filmTwoLoop}
              srcWebm={filmTwoLoopWebm}
              label="A walnut instrument cabinet with rows of labelled drawers."
              scrim
              priority
            />
            <div className="mm-vnext-instrument-face" aria-hidden="true"><span>MM</span><b>01</b></div>
            <span ref={thresholdMidRef} className="mm-vnext-mid-build" aria-hidden="true" />
            <div className="mm-vnext-route-doors" role="group" aria-label="Choose a Mindmake route">
              <button
                type="button"
                data-mm-primary
                onClick={(event) => chooseRoute("brain", event.currentTarget)}
              >
                <span>Build your</span>
                <strong>AI brain</strong>
                <small>Your judgement, running.</small>
                <i aria-hidden="true">↗</i>
              </button>
              <button
                type="button"
                data-mm-primary
                onClick={(event) => chooseRoute("gtm", event.currentTarget)}
              >
                <span>Build your</span>
                <strong>AI GTM</strong>
                <small>How the business reaches customers and gets paid.</small>
                <i aria-hidden="true">↗</i>
              </button>
            </div>
            <p ref={thresholdProofRef} className="mm-vnext-shared-proof">One paid proof on real work. You keep what works.</p>
          </div>
        </section>
      ) : (
        <section className="mm-vnext-route" aria-labelledby="homepage-route-title" data-homepage-view={route}>
          <div className="mm-vnext-route-topline">
            <button type="button" onClick={showBothRoutes}><span aria-hidden="true">←</span> Both routes</button>
            <p>{current.name} · One paid proof</p>
          </div>

          <div className="mm-vnext-route-chamber">
            <div className="mm-vnext-route-copy">
              <h1 id="homepage-route-title" ref={routeTitle} tabIndex={-1}>
                {current.titleLines.map((line) => <span key={line}>{line}</span>)}
              </h1>
              <p>{current.lede}</p>
              <button className="mm-vnext-primary" data-mm-primary type="button" onClick={() => route && start(route)}>
                Start here <span aria-hidden="true">→</span>
              </button>
            </div>

            <figure className="mm-vnext-route-figure">
              <FilmPlate
                poster={current.poster}
                posterWebp={current.posterWebp}
                src={current.film}
                srcWebm={current.filmWebm}
                label={current.imageLabel}
                scrim
                priority
              />
              <figcaption>{current.caption}</figcaption>
            </figure>

            <article className="mm-vnext-receipt" aria-labelledby="homepage-receipt-title">
              <div className="mm-vnext-receipt-head">
                <h2 id="homepage-receipt-title">What the proof can leave behind</h2>
                <p>{current.source}</p>
              </div>
              <ol>
                {current.causal.map((item) => <li key={item}>{item}</li>)}
              </ol>
              <blockquote>{current.result}</blockquote>
            </article>
          </div>
        </section>
      )}

      <LeadBrief
        key={briefRoute}
        open={briefOpen}
        route={briefRoute}
        onClose={closeBrief}
        presentation="drawer"
        journeyKey={briefJourneyKey}
      />
    </MindmakeShell>
  );
}
