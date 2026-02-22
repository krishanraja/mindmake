import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, Pause, Play } from "lucide-react";

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  position?: "bottom-right" | "inline";
}

export const AudioPlayer = ({
  audioUrl,
  title,
  position = "bottom-right",
}: AudioPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const positionClasses =
    position === "bottom-right" ? "fixed bottom-8 right-8 z-40" : "relative";

  return (
    <motion.div
      className={positionClasses}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      onHoverStart={() => setIsExpanded(true)}
      onHoverEnd={() => setIsExpanded(false)}
    >
      <motion.div
        className="glass-card p-3 flex items-center gap-3 cursor-pointer"
        animate={{ width: isExpanded ? "auto" : "60px" }}
      >
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-mint/20 flex items-center justify-center hover:bg-mint/30 transition-colors shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-mint" />
          ) : (
            <Play className="w-5 h-5 text-mint ml-0.5" />
          )}
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              className="flex items-center gap-2 whitespace-nowrap overflow-hidden"
            >
              <Volume2 className="w-4 h-4 text-mint" />
              <span className="text-sm font-medium">{title}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <audio ref={audioRef} src={audioUrl} />
    </motion.div>
  );
};
