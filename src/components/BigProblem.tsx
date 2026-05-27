import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Brain,
  Compass,
  Crown,
  KeyRound,
  Rocket,
  RotateCw,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

type Face = { icon: LucideIcon; strong: string; sub: string };

const cards: { fate: Face; value: Face }[] = [
  {
    fate: { icon: Crown, strong: "Orchestrate AI.", sub: "Or report to it." },
    value: {
      icon: Rocket,
      strong: "Ships, not slides.",
      sub: "Working systems and decisions you can defend, built alongside you in real time.",
    },
  },
  {
    fate: { icon: Brain, strong: "Extend your thinking.", sub: "Or become a commodity." },
    value: {
      icon: Compass,
      strong: "You lead, not watch.",
      sub: "Hands-on fluency in your actual workflows. Not a training course.",
    },
  },
  {
    fate: { icon: Zap, strong: "Accelerate.", sub: "Or get passed by." },
    value: {
      icon: KeyRound,
      strong: "Yours to keep.",
      sub: "A Mindmake roadmap and the working habits to run it. Yours for years.",
    },
  },
];

const openScopingModal = (preselected?: string) => {
  window.dispatchEvent(
    new CustomEvent("openScopingModal", {
      detail: {
        source_page: "/",
        ...(preselected ? { preselected } : {}),
      },
    }),
  );
};

type FlipCardProps = {
  index: number;
  fate: Face;
  value: Face;
  flipped: boolean;
  onFlip: () => void;
  reduceMotion: boolean;
};

const FlipCard = ({ index, fate, value, flipped, onFlip, reduceMotion }: FlipCardProps) => {
  const FateIcon = fate.icon;
  const ValueIcon = value.icon;
  const number = `0${index + 1} / 03`;

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onFlip();
    }
  };

  return (
    <div className="[perspective:1400px] w-full">
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${fate.strong} — tap to reveal what working with Mindmaker looks like`}
        onClick={onFlip}
        onKeyDown={handleKey}
        className={cn(
          "relative w-full aspect-square cursor-pointer outline-none",
          "[transform-style:preserve-3d]",
          !reduceMotion && "transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
          flipped && !reduceMotion && "[transform:rotateY(180deg)]",
          "focus-visible:[&>div]:ring-2 focus-visible:[&>div]:ring-mint focus-visible:[&>div]:ring-offset-4 focus-visible:[&>div]:ring-offset-ink",
        )}
      >
        {/* FRONT — fate */}
        <CardFace
          hidden={reduceMotion && flipped}
          className={cn(reduceMotion && flipped && "hidden")}
        >
          <CardChrome number={number} variant="fate" />
          <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
            <FateIcon
              className="w-12 h-12 md:w-16 md:h-16 text-mint mb-auto shrink-0"
              strokeWidth={1.5}
            />
            <div className="mt-6">
              <p className="text-3xl md:text-4xl font-bold text-white leading-[1.05] tracking-tight">
                {fate.strong}
              </p>
              <p className="text-base md:text-lg text-white/55 mt-3 leading-snug">
                {fate.sub}
              </p>
            </div>
            <div className="mt-6 flex items-center gap-2 self-start px-3 py-1.5 border border-mint/40 text-mint text-[10px] md:text-xs font-bold uppercase tracking-[0.18em]">
              <RotateCw className="w-3 h-3 md:w-3.5 md:h-3.5" strokeWidth={2.5} />
              Tap to flip
            </div>
          </div>
        </CardFace>

        {/* BACK — value */}
        <CardFace
          back
          hidden={reduceMotion && !flipped}
          className={cn(reduceMotion && !flipped && "hidden")}
        >
          <CardChrome number={number} variant="value" />
          <div className="relative z-10 flex flex-col h-full p-6 md:p-8">
            <ValueIcon
              className="w-12 h-12 md:w-16 md:h-16 text-mint mb-auto shrink-0"
              strokeWidth={1.5}
            />
            <div className="mt-6">
              <p className="text-3xl md:text-4xl font-bold text-white leading-[1.05] tracking-tight">
                {value.strong}
              </p>
              <p className="text-sm md:text-base text-white/70 mt-3 leading-relaxed">
                {value.sub}
              </p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                openScopingModal(`big-problem-card-${index + 1}`);
              }}
              className="mt-6 group/cta inline-flex items-center gap-2 self-start px-4 py-2.5 bg-mint text-ink text-xs md:text-sm font-bold uppercase tracking-[0.14em] hover:bg-white transition-colors"
            >
              Build this with me
              <ArrowRight
                className="w-4 h-4 group-hover/cta:translate-x-0.5 transition-transform"
                strokeWidth={2.5}
              />
            </button>
          </div>
        </CardFace>
      </div>
    </div>
  );
};

type CardFaceProps = {
  children: React.ReactNode;
  back?: boolean;
  hidden?: boolean;
  className?: string;
};

const CardFace = ({ children, back, hidden, className }: CardFaceProps) => (
  <div
    aria-hidden={hidden}
    className={cn(
      "absolute inset-0 [backface-visibility:hidden] [-webkit-backface-visibility:hidden]",
      "bg-ink border-2 border-mint",
      "shadow-[0_0_0_1px_rgba(126,244,194,0.35),0_0_40px_rgba(126,244,194,0.18),inset_0_0_60px_rgba(126,244,194,0.04)]",
      "hover:shadow-[0_0_0_1px_rgba(126,244,194,0.7),0_0_60px_rgba(126,244,194,0.4),inset_0_0_60px_rgba(126,244,194,0.06)]",
      "transition-shadow duration-300",
      back && "[transform:rotateY(180deg)]",
      className,
    )}
  >
    {children}
  </div>
);

const CardChrome = ({ number, variant }: { number: string; variant: "fate" | "value" }) => (
  <>
    <div className="absolute top-4 right-5 md:top-5 md:right-6 z-10 text-[10px] md:text-xs font-mono font-bold tracking-[0.18em] text-mint/80">
      {number}
    </div>
    {/* corner ticks for trading-card chrome */}
    <span className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-mint pointer-events-none" />
    <span className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-mint pointer-events-none" />
    <span className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-mint pointer-events-none" />
    <span className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-mint pointer-events-none" />
    {variant === "value" && (
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_left,rgba(126,244,194,0.10),transparent_55%)]" />
    )}
  </>
);

const BigProblem = () => {
  const reduceMotion = useReducedMotion() ?? false;
  const [flipped, setFlipped] = useState<boolean[]>([false, false, false]);
  const [api, setApi] = useState<CarouselApi | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveSlide(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const toggle = useCallback((index: number) => {
    setFlipped((prev) => prev.map((v, i) => (i === index ? !v : v)));
  }, []);

  return (
    <section id="big-problem" className="relative bg-ink py-20 md:py-32 overflow-hidden">
      <div className="container-width max-w-6xl">
        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-mint mb-5 sm:mb-7">
          Ten years from now
        </div>

        <h2 className="text-[clamp(1.875rem,5.5vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-white max-w-5xl">
          Every leader will fall into one of{" "}
          <span className="text-mint">two categories.</span>
        </h2>

        {/* Desktop grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-6 mt-14">
          {cards.map((card, i) => (
            <FlipCard
              key={i}
              index={i}
              fate={card.fate}
              value={card.value}
              flipped={flipped[i]}
              onFlip={() => toggle(i)}
              reduceMotion={reduceMotion}
            />
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden mt-10 -mx-4">
          <Carousel
            opts={{ align: "center", containScroll: "trimSnaps", loop: false }}
            setApi={setApi}
            className="w-full"
          >
            <CarouselContent className="-ml-3">
              {cards.map((card, i) => (
                <CarouselItem key={i} className="pl-3 basis-[85%]">
                  <FlipCard
                    index={i}
                    fate={card.fate}
                    value={card.value}
                    flipped={flipped[i]}
                    onFlip={() => toggle(i)}
                    reduceMotion={reduceMotion}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div className="flex items-center justify-center gap-2 mt-6">
            {cards.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Go to card ${i + 1}`}
                className={cn(
                  "h-1.5 transition-all duration-300",
                  activeSlide === i ? "w-8 bg-mint" : "w-1.5 bg-white/20",
                )}
              />
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-14 md:mt-20">
          <button
            type="button"
            onClick={() => openScopingModal("big-problem")}
            className="group inline-flex items-center gap-3 px-7 py-3.5 border-2 border-mint text-white font-bold text-sm md:text-base uppercase tracking-[0.14em] hover:bg-mint hover:text-ink transition-colors shadow-[0_0_30px_rgba(126,244,194,0.25)] hover:shadow-[0_0_50px_rgba(126,244,194,0.5)]"
          >
            Pick up the pen
            <ArrowRight
              className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
              strokeWidth={2.5}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default BigProblem;
