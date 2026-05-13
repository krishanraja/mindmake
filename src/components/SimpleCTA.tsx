import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { motion } from "framer-motion";
import { CONCIERGE_CALENDLY_URL } from "@/utils/calendly";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

const SimpleCTA = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasPlayedRef = useRef(false);

  const handleTimeUpdate = useCallback(() => {
    const video = videoRef.current;
    if (!video || !video.duration) return;
    // When the video nears the end of its first loop, pause on the last frame
    if (video.currentTime >= video.duration - 0.1) {
      video.pause();
      video.currentTime = video.duration;
      video.removeEventListener("timeupdate", handleTimeUpdate);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasPlayedRef.current) {
          hasPlayedRef.current = true;
          video.addEventListener("timeupdate", handleTimeUpdate);
          video.play();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [handleTimeUpdate]);

  return (
    <>
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
      />
      <section className="py-24 md:py-32 bg-ink dark:bg-background">
        <div className="container-width">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={spring}
          >
            {/* Owl above heading */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden">
                <video
                  ref={videoRef}
                  muted
                  playsInline
                  preload="auto"
                  className="w-full h-full object-cover"
                >
                  <source src="/MM owl.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white dark:text-foreground text-center mb-8">
              You've been pitched enough.
            </h2>

            <div className="text-center">
              <p className="text-xl text-white/70 dark:text-muted-foreground leading-relaxed mb-10">
                Start making decisions.
              </p>

              <Button
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-6 sm:px-14 py-7 text-base sm:text-lg shadow-lg shadow-mint/25 hover:shadow-xl hover:shadow-mint/30 transition-all duration-300 hover:-translate-y-0.5 touch-target group w-full sm:w-auto whitespace-normal"
                onClick={() => setConsultModalOpen(true)}
              >
                What's your nervous decision?
                <ArrowRight className="ml-2 h-5 w-5 shrink-0 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-sm text-white/40 dark:text-muted-foreground mt-6">
                The first conversation is free. No prep required.
              </p>
              <p className="text-sm text-white/40 dark:text-muted-foreground mt-3">
                Or{" "}
                <a
                  href={CONCIERGE_CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-white/70 dark:text-foreground underline underline-offset-4 hover:text-mint dark:hover:text-mint transition-colors"
                >
                  book a free 15-min diagnostic instead
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default SimpleCTA;
