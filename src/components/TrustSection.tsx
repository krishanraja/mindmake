import { Quote, TrendingUp, Clock, Shield } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import krishHeadshot from "@/assets/krish-headshot.png";

interface Testimonial {
  shortQuote: string;
  fullQuote: string;
  name: string;
  title: string;
  metric: string;
  icon: typeof Quote;
}

const testimonials: Testimonial[] = [
  {
    shortQuote: "I stopped dreading board AI questions.",
    fullQuote:
      "Before the sprint, I was fielding questions about our AI strategy and honestly just making it up as I went. Krish helped me get clear on the 3 decisions that actually mattered for our product roadmap. Now when the board asks, I have real answers \u2014 not theater.",
    name: "Sarah M.",
    title: "CPO, Series C SaaS Company",
    metric: "Board confidence",
    icon: Shield,
  },
  {
    shortQuote: "We went from 14 tools to 3 systems that actually work.",
    fullQuote:
      "Everyone on the team was experimenting with AI \u2014 ChatGPT for this, Claude for that, some random automation tool someone saw on LinkedIn. It was chaos. The 4-week sprint forced us to decide: what\u2019s actually strategic, and what\u2019s just noise?",
    name: "Anonymous",
    title: "VP of Operations",
    metric: "Stopped the chaos",
    icon: TrendingUp,
  },
  {
    shortQuote: "I finally knew what to build versus buy.",
    fullQuote:
      "I\u2019d been going in circles for 6 months \u2014 do we build our own AI underwriting model or use a vendor API? Every conversation made it worse. Krish didn\u2019t give me a recommendation. He gave me the framework to decide for myself.",
    name: "Founder",
    title: "Early-Stage FinTech",
    metric: "Decision clarity",
    icon: Clock,
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const IconComponent = testimonial.icon;

  return (
    <div className="minimal-card hover-lift bg-background h-full flex flex-col min-h-[280px]">
      <Quote className="h-6 w-6 text-mint mb-4 flex-shrink-0" />

      <div className="flex-grow">
        <p className="text-lg font-medium mb-3">
          &ldquo;{testimonial.shortQuote}&rdquo;
        </p>

        {isExpanded && (
          <p className="text-sm leading-relaxed text-muted-foreground mb-3">
            {testimonial.fullQuote}
          </p>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-mint text-xs hover:underline focus:outline-none"
        >
          {isExpanded ? "Show less" : "Read the full story..."}
        </button>
      </div>

      <div className="flex items-start gap-3 pt-4 mt-auto border-t border-border">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm">{testimonial.name}</div>
          <div className="text-xs text-muted-foreground">{testimonial.title}</div>
        </div>

        <div className="flex items-center gap-2 text-xs font-bold text-mint-dark bg-mint/10 px-3 py-1.5 rounded-full whitespace-nowrap">
          <IconComponent className="h-3 w-3 flex-shrink-0" />
          <span>{testimonial.metric}</span>
        </div>
      </div>
    </div>
  );
};

const TrustSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 6000);

    return () => clearInterval(interval);
  }, [api]);

  return (
    <section className="section-padding bg-muted relative overflow-hidden" id="trust">
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "url(/mindmaker-background.gif)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />
      <div className="container-width relative z-10">
        {/* About Krish */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <div className="flex justify-center mb-6">
            <img
              src={krishHeadshot}
              alt="Krish Raja"
              className="w-32 h-32 rounded-full border-4 border-mint/20"
              loading="lazy"
            />
          </div>

          <p className="text-lg leading-relaxed text-foreground">
            I run AI direction for businesses 100x your size during the day. I
            build products with AI every night. I've spent 16 years in data and
            tech, including Microsoft and Harvard Business School. I'm not going
            to sell you a tool or a framework slide. I'm going to help you make
            the decisions you've been avoiding &mdash; and feel good about them.
          </p>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-12 sm:mb-16 px-4 sm:px-0">
          <h3 className="text-2xl sm:text-3xl font-bold mb-3">
            What Leaders Say
          </h3>
        </div>

        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            loop: true,
            startIndex: 0,
          }}
          className="w-full max-w-6xl mx-auto px-4 sm:px-0"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem
                key={index}
                className="pl-2 md:pl-4 basis-[85%] sm:basis-1/2 lg:basis-1/3 h-full"
              >
                <div
                  className="fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden sm:flex" />
          <CarouselNext className="hidden sm:flex" />
        </Carousel>

        {/* Mobile dot indicators */}
        <div className="flex justify-center gap-2 mt-6 sm:hidden">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              className={cn(
                "w-2 h-2 rounded-full transition-colors",
                current === idx ? "bg-mint" : "bg-muted-foreground/30"
              )}
              onClick={() => api?.scrollTo(idx)}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* Client Logos */}
        <div className="mt-16 text-center px-4 sm:px-0">
          <p className="text-sm text-muted-foreground mb-6 font-medium">
            Worked with teams from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 opacity-40 mb-6">
            <div className="text-xl font-bold text-foreground">Fortune 500</div>
            <div className="text-xl font-bold text-foreground">Scale-ups</div>
            <div className="text-xl font-bold text-foreground">Consulting</div>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6 opacity-50">
            <div className="text-sm font-medium text-muted-foreground">Media</div>
            <div className="text-sm font-medium text-muted-foreground">E-Commerce</div>
            <div className="text-sm font-medium text-muted-foreground">Marketing</div>
            <div className="text-sm font-medium text-muted-foreground">Telco</div>
            <div className="text-sm font-medium text-muted-foreground">Wellness</div>
            <div className="text-sm font-medium text-muted-foreground">Entertainment</div>
            <div className="text-sm font-medium text-muted-foreground">Music</div>
            <div className="text-sm font-medium text-muted-foreground">Legal</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
