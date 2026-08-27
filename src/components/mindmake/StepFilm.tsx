import { CSSProperties, useEffect, useRef } from "react";
import { MediaFrame } from "@/components/mindmake/MediaFrame";

interface StepFilmProps {
  src: string;
  poster: string;
  title: string;
  caption: string;
  labels: string[];
}

/* Real CTRL footage inside a step. The frame settles early and stays put so
   the play control never moves under a thumb. The labels name stable objects
   in the footage and sit beside the frame, never over it. A film that leaves
   the screen stops playing. */
export function StepFilm({ src, poster, title, caption, labels }: StepFilmProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !("IntersectionObserver" in window)) return;
    const video = root.querySelector("video");
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting && !video.paused) video.pause();
    }, { threshold: .1 });
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="mm-step-film" ref={rootRef}>
      <MediaFrame src={src} poster={poster} title={title} label={caption} className="mm-step-film-frame" />
      <ul className="mm-step-film-labels">
        {labels.map((label, index) => (
          <li key={label} style={{ "--mm-i": index } as CSSProperties}>{label}</li>
        ))}
      </ul>
    </div>
  );
}
