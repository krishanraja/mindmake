import { useEffect, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { track } from "@/lib/analytics";
import communicationsFilm from "@/assets/films/sep2026/communications-compose-loop-r01-20s-720p-web-sealed.mp4";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import growthFilm from "@/assets/films/sep2026/quiet-workshop-growth-loop-r01-20s-720p-web-sealed.mp4";
import leadershipFilm from "@/assets/films/sep2026/ready-for-decision-loop-r01-20s-720p-web-sealed.mp4";
import signalsFilm from "@/assets/films/sep2026/signals-arrive-loop-r01-20s-720p-web-sealed.mp4";
import communicationsPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/communications-compose-loop-r01-20s-720p-web-sealed-poster.webp";
import evidencePoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/evidence-connects-loop-r01-20s-720p-web-sealed-poster.webp";
import growthPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/quiet-workshop-growth-loop-r01-20s-720p-web-sealed-poster.webp";
import leadershipPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/ready-for-decision-loop-r01-20s-720p-web-sealed-poster.webp";
import signalsPoster from "../../../../prototypes/website-redesign-recovery/case-study-browsing/media/signals-arrive-loop-r01-20s-720p-web-sealed-poster.webp";
import "@/styles/mindmake-commercial-continuity.css";

export type CommercialContinuityContext = "leadership" | "editorial" | "brain" | "gtm";

interface CommercialContinuityProps {
  context: CommercialContinuityContext;
  onStart: () => void;
}

interface CommercialMedia {
  name: string;
  title: string;
  film: string;
  poster: string;
  signalFilm?: string;
  signalPoster?: string;
}

const MEDIA: Record<CommercialContinuityContext, CommercialMedia> = {
  leadership: {
    name: "Leadership",
    title: "The decision stays human.",
    film: leadershipFilm,
    poster: leadershipPoster,
  },
  editorial: {
    name: "Ideas + answers",
    title: "Useful work, prepared.",
    film: communicationsFilm,
    poster: communicationsPoster,
  },
  brain: {
    name: "AI Brain",
    title: "Your judgement, connected.",
    film: evidenceFilm,
    poster: evidencePoster,
  },
  gtm: {
    name: "AI GTM",
    title: "The whole growth engine.",
    film: growthFilm,
    poster: growthPoster,
    signalFilm: signalsFilm,
    signalPoster: signalsPoster,
  },
};

type ConnectionWithSaveData = EventTarget & { saveData?: boolean };

function useCommercialContinuityMotion(
  rootRef: React.RefObject<HTMLElement>,
  context: CommercialContinuityContext,
) {
  useEffect(() => {
    const root = rootRef.current;
    const stage = root?.querySelector<HTMLElement>("[data-commercial-stage]");
    const surface = root?.querySelector<HTMLElement>("[data-commercial-surface]");
    const video = root?.querySelector<HTMLVideoElement>("[data-commercial-video]");
    const toggle = root?.querySelector<HTMLButtonElement>("[data-commercial-toggle]");
    const title = root?.querySelector<HTMLElement>("[data-commercial-film-title]");
    if (!root || !stage || !surface || !video || !toggle || !title) return;

    const selected = MEDIA[context];
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const navigatorWithConnection = navigator as Navigator & {
      connection?: ConnectionWithSaveData;
      mozConnection?: ConnectionWithSaveData;
      webkitConnection?: ConnectionWithSaveData;
    };
    const connection = navigatorWithConnection.connection
      ?? navigatorWithConnection.mozConnection
      ?? navigatorWithConnection.webkitConnection;
    let pausedByUser = false;
    let surfaceVisible = false;
    let currentFilm = "";
    let mediaUnavailable = false;
    let frame = 0;
    let progress = 0;

    const constrained = () => reducedMotion.matches
      || Boolean(connection?.saveData)
      || document.documentElement.dataset.textScale === "200";

    const syncToggle = () => {
      toggle.hidden = constrained()
        || !surfaceVisible
        || !currentFilm
        || mediaUnavailable
        || Boolean(video.error)
        || video.readyState < 2
        || progress >= 0.42;
      toggle.textContent = pausedByUser ? "Play film" : "Pause film";
      toggle.setAttribute("aria-pressed", String(pausedByUser));
    };

    const clearFilm = (policy: string) => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      currentFilm = "";
      root.dataset.motionPolicy = policy;
      syncToggle();
    };

    const chosenFilm = () => {
      const signalPhase = context === "gtm" && progress > 0.55;
      return signalPhase && selected.signalFilm && selected.signalPoster
        ? {
            film: selected.signalFilm,
            poster: selected.signalPoster,
            title: "Signals arrive together.",
          }
        : { film: selected.film, poster: selected.poster, title: selected.title };
    };

    const brainRecordControlVisible = () => {
      if (context !== "brain") return false;
      const control = document.querySelector<HTMLElement>("#pauseRecordS2");
      if (!control || getComputedStyle(control).visibility === "hidden") return false;
      const rect = control.getBoundingClientRect();
      return rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
    };

    const syncFilm = async () => {
      if (constrained()) {
        clearFilm("poster");
        return;
      }
      if (mediaUnavailable) {
        video.pause();
        video.removeAttribute("src");
        currentFilm = "";
        root.dataset.motionPolicy = "unavailable";
        syncToggle();
        return;
      }
      const chosen = chosenFilm();
      video.poster = chosen.poster;
      title.textContent = chosen.title;
      const competingControlVisible = brainRecordControlVisible();
      if (!surfaceVisible || document.hidden || competingControlVisible) {
        video.pause();
        root.dataset.motionPolicy = competingControlVisible ? "deferred" : "offscreen";
        syncToggle();
        return;
      }
      if (currentFilm !== chosen.film) {
        video.pause();
        video.src = chosen.film;
        video.load();
        currentFilm = chosen.film;
      }
      root.dataset.motionPolicy = pausedByUser ? "paused" : "motion";
      syncToggle();
      if (!pausedByUser) await video.play().catch(() => undefined);
      syncToggle();
    };

    const updateProgress = () => {
      frame = 0;
      const mobile = window.innerWidth <= 860;
      const forceStatic = constrained() || (window.innerHeight <= 520 && window.innerWidth > window.innerHeight);
      root.classList.toggle("is-static", forceStatic);
      if (forceStatic) progress = 1;
      else {
        const rect = stage.getBoundingClientRect();
        const distance = mobile ? 190 : Math.max(260, window.innerHeight * 0.65);
        progress = Math.max(0, Math.min(1, -rect.top / distance));
      }
      surface.style.setProperty("--commercial-p", progress.toFixed(4));
      void syncFilm();
    };

    const requestProgress = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };

    const onToggle = () => {
      pausedByUser = !pausedByUser;
      if (pausedByUser) video.pause();
      else void syncFilm();
      syncToggle();
    };
    const onCanPlay = () => syncToggle();
    const onError = () => {
      mediaUnavailable = true;
      video.pause();
      video.removeAttribute("src");
      video.load();
      currentFilm = "";
      root.dataset.motionPolicy = "unavailable";
      syncToggle();
    };
    const onVisibility = () => void syncFilm();
    const onPolicy = () => {
      updateProgress();
      void syncFilm();
    };

    let observer: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(([entry]) => {
        surfaceVisible = Boolean(entry?.isIntersecting && entry.intersectionRatio >= 0.28);
        void syncFilm();
      }, { threshold: [0, 0.28, 0.5] });
      observer.observe(surface);
    } else {
      surfaceVisible = true;
    }

    toggle.addEventListener("click", onToggle);
    video.addEventListener("canplay", onCanPlay);
    video.addEventListener("error", onError);
    window.addEventListener("scroll", requestProgress, { passive: true });
    window.addEventListener("resize", requestProgress);
    document.addEventListener("visibilitychange", onVisibility);
    reducedMotion.addEventListener?.("change", onPolicy);
    connection?.addEventListener?.("change", onPolicy);
    updateProgress();
    void syncFilm();

    return () => {
      observer?.disconnect();
      toggle.removeEventListener("click", onToggle);
      video.removeEventListener("canplay", onCanPlay);
      video.removeEventListener("error", onError);
      window.removeEventListener("scroll", requestProgress);
      window.removeEventListener("resize", requestProgress);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedMotion.removeEventListener?.("change", onPolicy);
      connection?.removeEventListener?.("change", onPolicy);
      if (frame) window.cancelAnimationFrame(frame);
      video.pause();
    };
  }, [context, rootRef]);
}

export function CommercialContinuity({ context, onStart }: CommercialContinuityProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const outcomeId = useId();
  const media = MEDIA[context];
  useCommercialContinuityMotion(rootRef, context);

  const start = () => {
    track("scoping_request", { source: "commercial_continuity", context });
    onStart();
  };

  return (
    <section
      ref={rootRef}
      id="commercial-proof"
      className="mm-commercial"
      data-context={context}
      data-motion-policy="poster"
      aria-labelledby={titleId}
    >
      <div className="mm-commercial-stage" data-commercial-stage>
        <div className="mm-commercial-surface" data-commercial-surface style={{ "--commercial-p": 0 } as React.CSSProperties}>
          <figure className="mm-commercial-film" aria-label={`${media.name} illustrative machinery`}>
            <video
              muted
              loop
              playsInline
              preload="none"
              poster={media.poster}
              aria-hidden="true"
              data-commercial-video
            />
            <div className="mm-commercial-film-shade" aria-hidden="true" />
            <div className="mm-commercial-film-state">
              <p data-commercial-film-title>{media.title}</p>
              <button type="button" aria-pressed="false" hidden data-commercial-toggle>Pause film</button>
            </div>
            <figcaption>{media.name}</figcaption>
          </figure>

          <div className="mm-commercial-seam" aria-hidden="true" />

          <div className="mm-commercial-proof">
            <div className="mm-commercial-content">
              <header className="mm-commercial-heading">
                <h2 id={titleId}>Two ways in. <span>One paid proof.</span></h2>
                <nav className="mm-commercial-doors" aria-label="Choose a Mindmake route">
                  <Link to="/ai-brain" aria-current={context === "brain" ? "page" : undefined}>
                    <span>Build your</span>
                    <strong>AI brain</strong>
                  </Link>
                  <Link to="/ai-gtm" aria-current={context === "gtm" ? "page" : undefined}>
                    <span>Build your</span>
                    <strong>AI go-to-market</strong>
                  </Link>
                </nav>
              </header>

              <div className="mm-commercial-contract">
                <p>We choose one important decision or capability. We build a working first version, use it on real work and make it useful in the first week. You keep the working system and its reasoning.</p>
                <button className="mm-commercial-start" type="button" data-mm-primary onClick={start}>
                  Start here <span aria-hidden="true">→</span>
                </button>
              </div>

              <div className="mm-commercial-outcome-field" aria-labelledby={outcomeId}>
                <div className="mm-commercial-outcome-head">
                  <h3 id={outcomeId}>What changed</h3>
                  <Link to="/case-studies">Read all eight stories <span aria-hidden="true">↗</span></Link>
                </div>
                <div className="mm-commercial-outcomes">
                  <article>
                    <span>Anonymous client outcome</span>
                    <p>Founder-owned publishing moved from days to under an hour, and from roughly monthly to most days.</p>
                  </article>
                  <article>
                    <span>Anonymous client outcome</span>
                    <p>Fourteen vendors became three decisions. The team shipped with no new hires.</p>
                  </article>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
