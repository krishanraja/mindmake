import { useId, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

interface MediaFrameProps {
  src: string;
  poster: string;
  title: string;
  label: string;
  className?: string;
}

export function MediaFrame({ src, poster, title, label, className = "" }: MediaFrameProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const captionId = useId();

  const toggle = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play();
    else video.pause();
  };

  return (
    <figure className={`mm-media-frame ${className}`}>
      <div className="mm-media-viewport">
        <video
          ref={videoRef}
          muted
          playsInline
          preload="none"
          poster={poster}
          aria-label={title}
          aria-describedby={captionId}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          <source src={src} type="video/mp4" />
        </video>
        <button type="button" onClick={toggle} aria-label={`${playing ? "Pause" : "Play"} ${title}`}>
          {playing ? <Pause aria-hidden="true" /> : <Play aria-hidden="true" />}
          <span>{playing ? "Pause" : "Play"} this view</span>
        </button>
      </div>
      <figcaption id={captionId} className="mm-media-caption">{label}</figcaption>
    </figure>
  );
}
