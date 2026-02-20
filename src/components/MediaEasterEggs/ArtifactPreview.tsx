import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Maximize2, X } from "lucide-react";

interface ArtifactPreviewProps {
  title: string;
  description: string;
  previewImage: string;
  fullImage?: string;
}

export const ArtifactPreview = ({
  title,
  description,
  previewImage,
  fullImage,
}: ArtifactPreviewProps) => {
  const [isFullView, setIsFullView] = useState(false);

  return (
    <>
      <motion.div
        className="glass-card p-6 cursor-pointer group"
        whileHover={{ scale: 1.02 }}
        onClick={() => setIsFullView(true)}
      >
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-lg bg-mint/20 flex items-center justify-center shrink-0 group-hover:bg-mint/30 transition-colors">
            <FileText className="w-6 h-6 text-mint" />
          </div>

          <div className="flex-1">
            <h4 className="font-semibold mb-1 group-hover:text-mint transition-colors">
              {title}
            </h4>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>

          <Maximize2 className="w-5 h-5 text-muted-foreground group-hover:text-mint transition-colors shrink-0" />
        </div>
      </motion.div>

      <AnimatePresence>
        {isFullView && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/95 flex items-center justify-center p-8"
            onClick={() => setIsFullView(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsFullView(false)}
                className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <img
                src={fullImage || previewImage}
                alt={title}
                className="w-full h-auto rounded-lg shadow-2xl"
              />

              <div className="mt-6 text-center text-white">
                <h3 className="text-2xl font-bold mb-2">{title}</h3>
                <p className="text-white/70">{description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
