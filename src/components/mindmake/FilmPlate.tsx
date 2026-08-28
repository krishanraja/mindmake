import { useRef, useState } from "react";
import { useAmbientMotion } from "@/hooks/useAmbientMotion";

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
 * ambience, so it ignores that setting, and it fetches nothing until clicked.
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

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play();
    setPlaying(true);
  };

  const sources = (
    <>
      {srcWebm && <source src={srcWebm} type="video/webm" />}
      {src && <source src={src} type="video/mp4" />}
    </>
  );

  const hasFilm = Boolean(src || srcWebm);
  const showLoop = hasFilm && !clickToPlay && motion;

  return (
    <div
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
            fetchPriority={priority ? "high" : "auto"}
            decoding={priority ? "sync" : "async"}
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
        >
          {sources}
        </video>
      )}

      {hasFilm && clickToPlay && (
        <video
          ref={videoRef}
          className="mm-plate-media mm-plate-loop"
          poster={poster}
          playsInline
          preload="none"
          controls={playing}
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
