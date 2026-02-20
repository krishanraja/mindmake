import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, X } from "lucide-react";

interface VideoDrawerProps {
  videoUrl: string;
  thumbnailUrl?: string;
  title: string;
  trigger?: "hover" | "click";
}

export const VideoDrawer = ({
  videoUrl,
  thumbnailUrl,
  title,
  trigger = "click",
}: VideoDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const shouldOpen = trigger === "hover" ? isHovered : isOpen;

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => trigger === "hover" && setIsHovered(true)}
      onMouseLeave={() => trigger === "hover" && setIsHovered(false)}
    >
      <button onClick={() => setIsOpen(true)} className="relative group">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="w-full h-auto rounded-lg border-2 border-mint/20 group-hover:border-mint/60 transition-all"
          />
        ) : (
          <div className="w-full h-48 rounded-lg border-2 border-mint/20 group-hover:border-mint/60 transition-all flex items-center justify-center bg-ink/5">
            <Play className="w-12 h-12 text-mint" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-ink/60 rounded-lg"
        >
          <div className="text-center text-white">
            <Play className="w-12 h-12 mx-auto mb-2" />
            <p className="text-sm font-medium">Watch Video</p>
          </div>
        </motion.div>
      </button>

      <AnimatePresence>
        {shouldOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative max-w-4xl w-full bg-background rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-ink/80 hover:bg-ink text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="aspect-video">
                <video src={videoUrl} controls autoPlay className="w-full h-full">
                  Your browser does not support video playback.
                </video>
              </div>

              <div className="p-6 bg-ink text-white">
                <h3 className="text-xl font-bold">{title}</h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
