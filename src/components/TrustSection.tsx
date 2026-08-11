import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import krishHeadshot from "@/assets/krish-headshot.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import { caseStudies } from "@/data/caseStudies";
import CaseStudyCard from "@/components/proof/CaseStudyCard";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

// Homepage teaser: the rich, metric-driven cases. Full archive + filtering live on /case-studies.
const teaser = caseStudies.filter((c) => c.variant === "case");

const CaseStudyCarousel = ({ isInView }: { isInView: boolean }) => {
  const isMobile = useIsMobile();
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const onSelect = useCallback(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
  }, [api]);

  useEffect(() => {
    if (!api) return;
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <div className="relative group">
      {/* Carousel - center-aligned so prev/next cards peek on both edges */}
      <Carousel
        setApi={setApi}
        opts={{
          align: "center",
          loop: true,
          dragFree: false,
          slidesToScroll: 1,
        }}
        orientation="horizontal"
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {teaser.map((caseStudy, index) => (
            <CarouselItem
              key={caseStudy.id}
              className={`pl-4 ${isMobile ? "basis-[72%]" : "basis-[26%]"}`}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: index * 0.08 }}
                className="h-full"
              >
                <CaseStudyCard caseStudy={caseStudy} />
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Edge fade gradients - narrow so peeking cards stay visible */}
      <div
        className="absolute left-0 top-0 bottom-0 w-6 md:w-8 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, var(--muted), transparent)",
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-6 md:w-8 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to left, var(--muted), transparent)",
        }}
      />

      {/* Desktop: Arrow buttons */}
      {!isMobile && (
        <>
          <button
            onClick={() => api?.scrollPrev()}
            className="absolute -left-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background border border-border/50 shadow-md flex items-center justify-center transition-all duration-200 hover:border-mint/50 hover:shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Previous case study"
          >
            <ChevronLeft className="w-5 h-5 text-ink dark:text-foreground" />
          </button>
          <button
            onClick={() => api?.scrollNext()}
            className="absolute -right-5 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-background border border-border/50 shadow-md flex items-center justify-center transition-all duration-200 hover:border-mint/50 hover:shadow-lg hover:scale-105 opacity-0 group-hover:opacity-100 cursor-pointer"
            aria-label="Next case study"
          >
            <ChevronRight className="w-5 h-5 text-ink dark:text-foreground" />
          </button>
        </>
      )}

      {/* Dot indicators - shown on both mobile and desktop */}
      <div className="flex justify-center gap-1.5 mt-5">
        {teaser.map((caseStudy, index) => (
          <button
            key={caseStudy.id}
            onClick={() => api?.scrollTo(index)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              current === index
                ? "w-6 bg-mint"
                : "w-1.5 bg-muted-foreground/25 hover:bg-muted-foreground/40"
            }`}
            aria-label={`Go to case study ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [bioExpanded, setBioExpanded] = useState(false);

  return (
    <section ref={ref} className="py-24 md:py-32 bg-muted relative overflow-hidden" id="trust">
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: "url(/mindmaker-background.gif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="container-width relative z-10">
        {/* Krish bio */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={spring}
        >
          <div className="flex justify-center mb-6">
            <img
              src={krishHeadshot}
              alt="Krish Raja"
              className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-ink/10 dark:border-mint/20 shadow-xl"
              loading="lazy"
            />
          </div>

          {/* Desktop: wider container, full text */}
          <div className="hidden md:block">
            <p className="text-2xl font-bold mb-4 max-w-5xl mx-auto leading-snug">
              Sixteen years commercialising content, media and IP businesses. Now I build
              the AI systems that run them.
            </p>
            <p className="text-muted-foreground max-w-3xl mx-auto mb-8">
              I work with AI every day, building, breaking and shipping real systems, and
              I run a 14-agent operating system across my own portfolio. Mindmaker is a
              capped advisory practice: a small number of engagements a year, because I do
              the work. You can ask the questions you have been avoiding asking out loud.
            </p>
          </div>

          {/* Mobile: collapsible bio */}
          <div className="md:hidden mb-8">
            <p className="text-lg font-bold leading-snug">
              Sixteen years commercialising content, media and IP businesses. Now I build
              the AI systems that run them.
            </p>
            <motion.div
              initial={false}
              animate={{ height: bioExpanded ? "auto" : 0, opacity: bioExpanded ? 1 : 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <p className="text-lg font-bold leading-snug mt-2">
                I work with AI every day, building, breaking and shipping real systems, and
                I run a 14-agent operating system across my own portfolio.
              </p>
              <p className="text-muted-foreground mt-4">
                Mindmaker is a capped advisory practice: a small number of engagements a
                year, because I do the work. You can ask the questions you have been
                avoiding asking out loud.
              </p>
            </motion.div>
            <button
              onClick={() => setBioExpanded(!bioExpanded)}
              className="mt-3 text-sm text-mint hover:text-mint/80 transition-colors font-medium"
            >
              {bioExpanded ? "Show less" : "Read more"}
            </button>
          </div>

          {/* Get to know me */}
          <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wider font-medium">
            Get to know me a bit more
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a
              href="https://www.linkedin.com/in/krishanraja/"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/50 hover:border-ink/30 dark:hover:border-mint/30 transition-all hover:-translate-y-0.5 hover:shadow-md bg-background"
            >
              <svg className="w-5 h-5 text-[#0A66C2] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              <span className="text-sm font-medium">LinkedIn</span>
            </a>
            <a
              href="https://www.krishraja.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/50 hover:border-ink/30 dark:hover:border-mint/30 transition-all hover:-translate-y-0.5 hover:shadow-md bg-background"
            >
              <svg className="w-5 h-5 text-ink dark:text-mint group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5a17.92 17.92 0 01-8.716-4.247m0 0A8.966 8.966 0 013 12c0-1.528.38-2.97 1.05-4.228" />
              </svg>
              <span className="text-sm font-medium">krishraja.com</span>
            </a>
            <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/30 bg-background opacity-50 cursor-not-allowed">
              <span className="text-sm font-medium text-muted-foreground">Cohorts (Coming Soon)</span>
            </span>
          </div>
        </motion.div>

        {/* Case study teaser carousel */}
        <CaseStudyCarousel isInView={isInView} />

        {/* See all case studies */}
        <motion.div
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.4 }}
        >
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-mint-dark dark:text-mint hover:gap-2.5 transition-all"
          >
            See all case studies <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Client sectors */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground mb-4 font-medium uppercase tracking-wider">
            Worked with teams from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-40">
            {["Fortune 500", "Scale-ups", "Consulting", "Media", "FinTech", "E-Commerce", "Legal"].map((sector) => (
              <span key={sector} className="text-sm font-medium">{sector}</span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TrustSection;
