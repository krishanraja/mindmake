import { useEffect, useRef, useState } from "react";
import { useAmbientMotion } from "@/hooks/useAmbientMotion";
import { useScrollDriver } from "@/hooks/useScrollDriver";

interface FilmPlateProps {
  /** Poster frame, which is frame one of the film so the handover is invisible. */
  poster?: string;
  posterWebp?: string;
  /** Loop or film sources. Absent means poster plus the plate's own drift. */
  src?: string;
  srcWebm?: string;
  /** What the film shows, for anyone who cannot see it. */
  label: string;
  /** Click to play with sound, rather than an ambient muted loop. */
  clickToPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Darkens the plate so type sitting on it stays legible. */
  scrim?: boolean;
  priority?: boolean;
  /**
   * The plate is behind content that already says what this is, so it carries
   * no role and no label. Used inside the doors, where announcing the film as
   * an image would make a screen reader read the door twice.
   */
  decorative?: boolean;
}

/**
 * The film plate.
 *
 * The poster is always in the markup, so it carries the paint and there is
 * nothing to wait for. An ambient loop mounts on top of it only once the
 * browser has said this visitor wants motion; a visitor who asked for less
 * keeps the still. A click-to-play film is a deliberate request rather than
 * ambience, so it ignores that setting, and it is not in the document at all
 * until the play button is pressed.
 *
 * ## When a loop mounts
 *
 * Once the visitor wants motion and the plate is near the screen, not before.
 * The homepage carries six loops, about 3.2MB of webm, and every one of them
 * used to mount at hydration and start fetching against the hero's own 869KB
 * on the same connection, which is why the hero film did not land until three
 * seconds on a throttled phone. A priority plate is near from the start; every
 * other plate waits until the scroll driver reports it within a viewport of
 * the fold. The driver is asked to report and write nothing, so a plate does
 * not read as a scrubbed build to the aliveness gate.
 *
 * ## How a loop arrives
 *
 * It fades up over its own poster once it is actually playing, because the
 * decoded video and the webp of the same frame are not the same colour: the
 * hero loop replaced its poster with a visibly darker tone in one frame. The
 * class is added on the element rather than through state so nothing
 * re-renders; the element is never in the server markup, so there is nothing
 * for hydration to disagree about.
 */
export function FilmPlate({
  poster,
  posterWebp,
  src,
  srcWebm,
  label,
  clickToPlay = false,
  className = "",
  style,
  scrim = false,
  priority = false,
  decorative = false,
}: FilmPlateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const motion = useAmbientMotion();

  /* Mounted on the click, not before it.
     This element used to sit in the markup with `preload="none"` and a poster,
     which the docstring above described as fetching nothing until clicked. The
     `preload` covers the film; it does not cover the poster, and a browser
     fetches that immediately. Once the pages were prerendered it was measured:
     the click-to-play band on /ai-brain pulled 96KB of JPEG off a throttled
     connection while the render-blocking stylesheet was still arriving, for a
     still nobody reaches for several screens and which the `<picture>` above
     already renders. Mounting on the click makes the claim true. */
  const play = () => setPlaying(true);

  /* Started here rather than with `autoPlay`, because this film plays with
     sound and a bare autoplay attribute is refused for that. Called from an
     effect one commit after the click, it is allowed: the click leaves sticky
     activation behind it, which is what the policy actually tests. */
  useEffect(() => {
    if (!playing) return;
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play();
  }, [playing]);

  /* Near, and live. See the docstring: a loop mounts once the plate is within
     a viewport of the fold, and fades up once it is actually playing. */
  const [near, setNear] = useState(priority);
  const plateRef = useScrollDriver<HTMLDivElement>(
    (progress) => { if (progress > 0) setNear(true); },
    "centre",
    { silent: true },
  );
  const live = (event: React.SyntheticEvent<HTMLVideoElement>) => event.currentTarget.classList.add("is-live");

  const sources = (
    <>
      {srcWebm && <source src={srcWebm} type="video/webm" />}
      {src && <source src={src} type="video/mp4" />}
    </>
  );

  const hasFilm = Boolean(src || srcWebm);
  const showLoop = hasFilm && !clickToPlay && motion && near;

  return (
    <div
      ref={plateRef}
      className={`mm-plate${hasFilm ? " has-media" : ""} ${className}`.trim()}
      style={style}
      {...(decorative ? { "aria-hidden": true } : { role: "img", "aria-label": label })}
    >
      {poster && (
        <picture>
          {posterWebp && <source srcSet={posterWebp} type="image/webp" />}
          <img
            className="mm-plate-media"
            src={poster}
            alt=""
            loading={priority ? "eager" : "lazy"}
            decoding={priority ? "sync" : "async"}
            /* Lowercase, because React 18 does not know this attribute and
               silently drops a camelCase prop it does not recognise. Written
               `fetchPriority` it never reached the markup at all, which the
               server render surfaced as a warning the production client build
               had been stripping. React 18's types do not carry it either, so
               the spread is what gets it past the compiler and onto the tag. */
            {...{ fetchpriority: priority ? "high" : "auto" }}
          />
        </picture>
      )}

      {showLoop && (
        <video
          className="mm-plate-media mm-plate-loop"
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onPlaying={live}
        >
          {sources}
        </video>
      )}

      {hasFilm && clickToPlay && playing && (
        <video
          ref={videoRef}
          className="mm-plate-media mm-plate-loop"
          playsInline
          controls
          onPlaying={live}
        >
          {sources}
        </video>
      )}

      {scrim && <div className="mm-plate-scrim" />}

      {clickToPlay && !playing && (
        <button className="mm-plate-play" type="button" onClick={play}>
          <span aria-hidden="true">▶</span>
          <span className="mm-visually-hidden">Play the film: {label}</span>
        </button>
      )}
    </div>
  );
}
