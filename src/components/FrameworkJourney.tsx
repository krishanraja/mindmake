import { motion, useTransform, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { Target, Zap, FileCheck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

/** Breakpoint matches Tailwind `md:` (grid switches to 3-col at 768px). */
const useMobile = () => {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
};

const MindLabel = ({ prefix, suffix }: { prefix: string; suffix: string }) => (
  <span>
    {prefix}<span className="text-mint font-black">{suffix}</span>
  </span>
);

const noiseItems = [
  { label: "Vendor pitch deck #14", keep: false },
  { label: "Core workflow bottleneck", keep: true },
  { label: "LinkedIn: AI will replace you", keep: false },
  { label: "Team using 6 different tools", keep: false },
  { label: "Analyst report: $4.2T market", keep: false },
  { label: "Your strongest differentiator", keep: true },
  { label: "Competitor launched AI feature", keep: false },
  { label: "Customer asking about AI plan", keep: true },
  { label: "New model release hype cycle", keep: false },
  { label: "Board wants an AI strategy", keep: false },
];


const FrameworkJourney = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isMobile = useMobile();

  // Auto-rotating spotlight: cycles 0 → 1 → 2 → 0 every 3 seconds,
  // with smooth eased transitions between cards so the light "hands off."
  const spotlight = useMotionValue(0);

  useEffect(() => {
    let idx = 0;
    const cycle = () => {
      idx = (idx + 1) % 3;
      animate(spotlight, idx, { duration: 0.6, ease: "easeInOut" });
    };
    const id = setInterval(cycle, 3000);
    return () => clearInterval(id);
  }, [spotlight]);

  // Torchlight: mouse-following mint glow
  const rawX = useMotionValue(-1000);
  const rawY = useMotionValue(-1000);
  const torchX = useSpring(rawX, { stiffness: 300, damping: 30 });
  const torchY = useSpring(rawY, { stiffness: 300, damping: 30 });
  const [torchVisible, setTorchVisible] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      rawX.set(e.clientX - rect.left);
      rawY.set(e.clientY - rect.top);
    },
    [rawX, rawY],
  );

  const handleMouseEnter = useCallback(() => setTorchVisible(true), []);
  const handleMouseLeave = useCallback(() => setTorchVisible(false), []);

  // Mobile carousel state + auto-rotation
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();
  const [currentSlide, setCurrentSlide] = useState(0);
  const userInteractedRef = useRef(false);

  useEffect(() => {
    if (!carouselApi) return;
    setCurrentSlide(carouselApi.selectedScrollSnap());
    carouselApi.on("select", () => {
      setCurrentSlide(carouselApi.selectedScrollSnap());
    });
  }, [carouselApi]);

  // Auto-rotate carousel on mobile every 4s, pause on user interaction
  useEffect(() => {
    if (!isMobile || !carouselApi) return;

    let autoplayId: ReturnType<typeof setInterval>;
    let resumeId: ReturnType<typeof setTimeout>;

    const startAutoplay = () => {
      autoplayId = setInterval(() => {
        if (!carouselApi.canScrollNext()) {
          carouselApi.scrollTo(0);
        } else {
          carouselApi.scrollNext();
        }
      }, 4000);
    };

    const onPointerDown = () => {
      userInteractedRef.current = true;
      clearInterval(autoplayId);
      clearTimeout(resumeId);
      resumeId = setTimeout(() => {
        userInteractedRef.current = false;
        startAutoplay();
      }, 6000);
    };

    startAutoplay();
    carouselApi.on("pointerDown", onPointerDown);

    return () => {
      clearInterval(autoplayId);
      clearTimeout(resumeId);
    };
  }, [isMobile, carouselApi]);

  const cards = [
    <Card key={0} index={0} spotlight={spotlight} isMobile={isMobile} isActive={isMobile && currentSlide === 0} icon={Target} label="MindSet" headline="Filter the noise.">
      <MindSetContent />
    </Card>,
    <Card key={1} index={1} spotlight={spotlight} isMobile={isMobile} isActive={isMobile && currentSlide === 1} icon={Zap} label="MindMap" headline="Build your systems.">
      <MindMapContent />
    </Card>,
    <Card key={2} index={2} spotlight={spotlight} isMobile={isMobile} isActive={isMobile && currentSlide === 2} icon={FileCheck} label="MindMake" headline="Decide and ship.">
      <MindMakeContent />
    </Card>,
  ];

  return (
    <section
      id="framework-journey"
      ref={sectionRef}
      className="py-24 md:py-32 bg-ink relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Torchlight glow that follows cursor */}
      <motion.div
        className="absolute pointer-events-none z-10 rounded-full"
        style={{
          width: 420,
          height: 420,
          x: torchX,
          y: torchY,
          translateX: "-50%",
          translateY: "-50%",
          background:
            "radial-gradient(circle, rgba(126,244,194,0.10) 0%, rgba(126,244,194,0.04) 35%, transparent 70%)",
          opacity: torchVisible ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      />

      <div className="container-width relative z-20">
        <div className="text-center mb-16">
          <h2 className="text-[1.35rem] sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3">
            <MindLabel prefix="Mind" suffix="Set" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Map" /> &rarr;{" "}
            <MindLabel prefix="Mind" suffix="Make" />
          </h2>
          <p className="text-base text-white/40 max-w-lg mx-auto">
            Three phases. Most nervous decisions resolve in the first.
          </p>
        </div>

        {isMobile ? (
          <>
            <Carousel
              setApi={setCarouselApi}
              opts={{
                align: "start",
                loop: false,
                dragFree: false,
                containScroll: "trimSnaps",
              }}
              orientation="horizontal"
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent className="-ml-3">
                {cards.map((card, i) => (
                  <CarouselItem key={i} className="pl-3 basis-[85%]">
                    {card}
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-4">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => carouselApi?.scrollTo(index)}
                  className={`h-2 rounded-full transition-all duration-200 ${
                    currentSlide === index ? "w-6 bg-mint" : "w-2 bg-white/30"
                  }`}
                  aria-label={`Go to card ${index + 1}`}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {cards}
          </div>
        )}
      </div>
    </section>
  );
};

const Card = ({
  index,
  spotlight,
  isMobile,
  isActive,
  icon: Icon,
  label,
  headline,
  children,
}: {
  index: number;
  spotlight: any;
  isMobile: boolean;
  isActive: boolean;
  icon: any;
  label: string;
  headline: string;
  children: React.ReactNode;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Mobile: each card fades in independently when it scrolls into view.
  const inView = useInView(cardRef, { once: true, amount: 0.25 });

  // Desktop: scroll-synced spotlight drives opacity.
  const cardOpacity = useTransform(spotlight, (v: number) => {
    const dist = Math.abs(v - index);
    return Math.max(0.2, 1 - dist * 0.8);
  });

  const glowOpacity = useTransform(spotlight, (v: number) => {
    const dist = Math.abs(v - index);
    return Math.max(0, 1 - dist * 2) * 0.35;
  });

  // Resolve final opacity: hover > mobile-active > desktop-spotlight
  const resolvedOpacity = isHovered ? 1 : isMobile ? undefined : cardOpacity;

  return (
    <motion.div
      ref={cardRef}
      className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 flex flex-col h-[420px] relative overflow-hidden transition-opacity duration-300"
      style={{ opacity: resolvedOpacity }}
      // Mobile: active card is fully lit, others dim
      {...(isMobile && !isHovered ? { animate: { opacity: isActive ? 1 : (inView ? 0.4 : 0.15) }, transition: { duration: 0.35 } } : {})}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Natural radial glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          opacity: isHovered ? 0.35 : isMobile ? (isActive ? 0.35 : (inView ? 0.1 : 0)) : glowOpacity,
          background: "radial-gradient(ellipse at center, rgba(126, 244, 194, 0.15) 0%, transparent 70%)",
          boxShadow: "0 0 80px rgba(126, 244, 194, 0.08)",
        }}
      />

      <div className="text-center shrink-0 mb-5 flex flex-col items-center">
        <Icon className="w-6 h-6 text-mint mb-2" />
        <h3 className="text-lg md:text-xl font-bold text-white leading-tight">{headline}</h3>
        <p className="text-xs text-mint mt-1">{label}</p>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden mt-4">{children}</div>
    </motion.div>
  );
};

const MindSetContent = () => {
  const doubled = [...noiseItems, ...noiseItems];

  return (
    <div className="h-full flex flex-col">
      {/* Scrolling list with fade masks */}
      <div className="flex-1 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-4 bg-gradient-to-b from-white/[0.04] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-6 bg-gradient-to-t from-white/[0.04] to-transparent z-10 pointer-events-none" />
        <div
          className="space-y-1.5 pb-4"
          style={{
            animation: "mindset-scroll 18s linear infinite",
          }}
        >
          {doubled.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-2 px-2 py-1 rounded text-[11px]"
            >
              <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${item.keep ? "bg-mint" : "bg-red-400/50"}`} />
              <span className={!item.keep ? "line-through text-white/20" : "font-semibold text-white"}>
                {item.label}
              </span>
              {item.keep && <span className="ml-auto text-[9px] font-bold text-mint uppercase">Signal</span>}
            </div>
          ))}
        </div>
      </div>
      {/* Fixed footer */}
      <div className="h-[48px] shrink-0 flex items-center justify-center border-t border-white/10">
        <div className="text-center">
          <span className="text-[10px] text-white/30">10 inputs &rarr; </span>
          <span className="text-xs font-bold text-mint">3 that matter</span>
        </div>
      </div>
    </div>
  );
};

const MindMapContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const nodes = [
    { x: 100, y: 20, label: "my clone" },
    { x: 40, y: 60, label: "my memory" },
    { x: 160, y: 55, label: "my writer" },
    { x: 70, y: 110, label: "my EA" },
    { x: 135, y: 105, label: "my PM" },
  ];

  const connections = [
    [0, 1], [0, 2], [1, 3], [2, 4], [3, 4], [1, 2],
  ];

  return (
    <div ref={ref} className="h-full flex flex-col">
      {/* Circuit-board system assembly */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 200 140" className="max-h-full">
          {/* Connections drawing in */}
          {connections.map(([from, to], i) => (
            <motion.line
              key={`conn-${i}`}
              x1={nodes[from].x} y1={nodes[from].y}
              x2={nodes[to].x} y2={nodes[to].y}
              stroke="#7ef4c2"
              strokeWidth="1.5"
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isInView ? { pathLength: 1, opacity: 0.35 } : {}}
              transition={{ delay: 0.6 + i * 0.18, duration: 0.5, ease: "easeOut" }}
            />
          ))}

          {/* Nodes appearing */}
          {nodes.map((node, i) => (
            <g key={`node-${i}`}>
              <motion.circle
                cx={node.x} cy={node.y} r="16"
                fill="rgba(126, 244, 194, 0.12)"
                stroke="#7ef4c2"
                strokeWidth="1.5"
                initial={{ scale: 0, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.15 + i * 0.15, type: "spring", stiffness: 200, damping: 15 }}
              />
              <motion.text
                x={node.x} y={node.y + 1}
                textAnchor="middle"
                dominantBaseline="middle"
                className="fill-white text-[6px] font-semibold"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 0.9 } : {}}
                transition={{ delay: 0.3 + i * 0.15 }}
              >
                {node.label}
              </motion.text>

              {/* Pulse on arrival */}
              <motion.circle
                cx={node.x} cy={node.y} r="16"
                fill="none"
                stroke="#7ef4c2"
                strokeWidth="1"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={isInView ? { scale: 2.2, opacity: 0 } : {}}
                transition={{ delay: 0.15 + i * 0.15, duration: 0.8 }}
              />
            </g>
          ))}

          {/* Persistent subtle pulse traveling along a connection */}
          {isInView && (
            <motion.circle
              r="2.5"
              fill="#7ef4c2"
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                cx: [nodes[0].x, nodes[1].x, nodes[3].x, nodes[4].x],
                cy: [nodes[0].y, nodes[1].y, nodes[3].y, nodes[4].y],
              }}
              transition={{ delay: 2, duration: 3, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
            />
          )}
        </svg>
      </div>

      {/* Fixed footer */}
      <div className="h-[48px] shrink-0 flex items-center justify-center border-t border-white/10">
        <motion.div className="text-center" initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ delay: 2 }}>
          <span className="text-[10px] text-white/30">5 nodes &rarr; </span>
          <span className="text-xs font-bold text-mint">1 system</span>
        </motion.div>
      </div>
    </div>
  );
};

const MindMakeContent = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  const stages = [
    { label: "Anxious", position: 0 },
    { label: "Informed", position: 50 },
    { label: "Decided", position: 100 },
  ];

  const outcomes = [
    { label: "Decision", value: "Build", delay: 2.0 },
    { label: "Timeline", value: "6 weeks", delay: 2.3 },
    { label: "ROI", value: "340%", delay: 2.6 },
  ];

  return (
    <div ref={ref} className="h-full flex flex-col">
      {/* Confidence Arc */}
      <div className="flex-1 flex flex-col justify-center px-1">
        {/* Stage labels */}
        <div className="flex justify-between mb-2">
          {stages.map((stage, i) => (
            <motion.span
              key={stage.label}
              className="text-[10px] font-medium"
              initial={{ opacity: 0, y: 5 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.3 }}
              style={{ color: i === 0 ? "rgba(251, 146, 60, 0.7)" : i === 1 ? "rgba(255,255,255,0.5)" : "#7ef4c2" }}
            >
              {stage.label}
            </motion.span>
          ))}
        </div>

        {/* Progress bar track */}
        <div className="relative h-3 rounded-full bg-white/[0.08] overflow-hidden">
          {/* Fill with gradient */}
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: "linear-gradient(to right, rgba(251,146,60,0.6) 0%, rgba(255,255,255,0.4) 50%, #7ef4c2 100%)",
            }}
            initial={{ width: "0%" }}
            animate={isInView ? { width: "100%" } : {}}
            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          />
          {/* Glow at leading edge */}
          <motion.div
            className="absolute inset-y-0 w-6 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(126,244,194,0.6) 0%, transparent 70%)",
            }}
            initial={{ left: "0%" }}
            animate={isInView ? { left: "calc(100% - 12px)" } : {}}
            transition={{ delay: 0.5, duration: 2, ease: "easeOut" }}
          />
        </div>

        {/* Tick marks under the bar */}
        <div className="flex justify-between mt-1.5 px-0.5">
          {stages.map((_, i) => (
            <motion.div
              key={i}
              className="w-px h-2"
              style={{ backgroundColor: i === 0 ? "rgba(251,146,60,0.4)" : i === 1 ? "rgba(255,255,255,0.2)" : "rgba(126,244,194,0.5)" }}
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.8 }}
            />
          ))}
        </div>

        {/* Outcome stats appearing below */}
        <div className="flex justify-between mt-6">
          {outcomes.map((outcome) => (
            <motion.div
              key={outcome.label}
              className="text-center"
              initial={{ opacity: 0, y: 8 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: outcome.delay, duration: 0.5 }}
            >
              <div className="text-[9px] text-white/30 uppercase tracking-wider">{outcome.label}</div>
              <div className="text-sm font-bold text-mint mt-0.5">{outcome.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fixed footer */}
      <div className="h-[48px] shrink-0 flex items-center justify-center border-t border-white/10">
        <motion.div
          className="flex items-center gap-1.5"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 3 }}
        >
          <svg className="w-4 h-4 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-xs font-bold text-mint">Board-ready</span>
        </motion.div>
      </div>
    </div>
  );
};

export default FrameworkJourney;
