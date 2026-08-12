import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useReducedMotion } from "framer-motion";
import { CTRL_DEMO_VIDEO_URL } from "@/lib/publicLinks";
import { cn } from "@/lib/utils";

type CtrlDemoVideoProps = {
  className?: string;
};

export function CtrlDemoVideo({ className }: CtrlDemoVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = async () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      try {
        await video.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    video.pause();
  };

  return (
    <div
      className={cn(
        "relative aspect-video overflow-hidden rounded-xl bg-ink",
        className,
      )}
      data-video-status={status}
    >
      <div className="absolute inset-0 grid place-items-center px-6 text-center">
        <div>
          <p className="text-sm font-bold text-mint">CTRL by Mindmaker</p>
          <p className="mt-1 text-xs text-white/60">
            {status === "failed" ? "The demo could not load." : "Loading the private decision workspace."}
          </p>
        </div>
      </div>

      {status !== "failed" && (
        <video
          ref={videoRef}
          autoPlay={!reduceMotion}
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="A redacted view of CTRL by Mindmaker"
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-300",
            status === "ready" ? "opacity-100" : "opacity-0",
          )}
          onCanPlay={() => setStatus("ready")}
          onError={() => {
            setStatus("failed");
            setIsPlaying(false);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={CTRL_DEMO_VIDEO_URL} type="video/mp4" />
        </video>
      )}

      {status === "ready" && (
        <button
          type="button"
          onClick={togglePlayback}
          className="absolute right-3 top-3 z-10 inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-white/20 bg-ink/85 text-white shadow-lg backdrop-blur transition-colors hover:bg-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          aria-label={isPlaying ? "Pause CTRL demo" : "Play CTRL demo"}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </button>
      )}
    </div>
  );
}
