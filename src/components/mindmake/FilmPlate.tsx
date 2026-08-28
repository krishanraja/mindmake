import { useRef, useState } from "react";

interface FilmPlateProps {
  /** Poster frame. Every slot ships with one; the site never waits on footage. */
  poster?: string;
  posterWebp?: string;
  /** Loop source, when the footage has landed. Absent means poster plus drift. */
  src?: string;
  /** What the film shows, for anyone who cannot see it. */
  label: string;
  /** Click to play with sound, rather than an ambient muted loop. */
  clickToPlay?: boolean;
  className?: string;
  style?: React.CSSProperties;
  /** Darkens the plate so type sitting on it stays legible. */
  scrim?: boolean;
  priority?: boolean;
}

/**
 * The film plate. Poster-first and lazy: the ambient drift and light sweep are
 * CSS on the plate itself, so an empty slot still moves and the aliveness floor
 * holds before any footage exists. Reduced motion serves the poster only.
 */
export function FilmPlate({
  poster,
  posterWebp,
  src,
  label,
  clickToPlay = false,
  className = "",
  style,
  scrim = false,
  priority = false,
}: FilmPlateProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const play = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = false;
    void video.play();
    setPlaying(true);
  };

  return (
    <div
      className={`mm-plate${src ? " has-media" : ""} ${className}`.trim()}
      style={style}
      role="img"
      aria-label={label}
    >
      {src && !clickToPlay && (
        <video
          className="mm-plate-media"
          poster={poster}
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      )}

      {src && clickToPlay && (
        <video
          ref={videoRef}
          className="mm-plate-media"
          poster={poster}
          src={src}
          playsInline
          preload="none"
          controls={playing}
        />
      )}

      {!src && poster && (
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
