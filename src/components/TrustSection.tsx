import { Quote } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import krishHeadshot from "@/assets/krish-headshot.png";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

interface Testimonial {
  metric: string;
  metricLabel: string;
  shortQuote: string;
  fullQuote: string;
  name: string;
  title: string;
}

const testimonials: Testimonial[] = [
  {
    metric: "0",
    metricLabel: "board AI questions I now dread",
    shortQuote: "I stopped dreading board AI questions.",
    fullQuote:
      "Before the sprint, I was fielding questions about our AI strategy and honestly just making it up as I went. Krish helped me get clear on the 3 decisions that actually mattered. Now when the board asks, I have real answers.",
    name: "Sarah M.",
    title: "GTM Leader, Series C SaaS",
  },
  {
    metric: "14 \u2192 3",
    metricLabel: "AI tools that actually work",
    shortQuote: "We went from 14 tools to 3 systems that actually work.",
    fullQuote:
      "Everyone on the team was experimenting with AI \u2014 ChatGPT for this, Claude for that, some random automation tool from LinkedIn. It was chaos. The 4-week sprint forced us to decide: what\u2019s actually strategic, and what\u2019s just noise?",
    name: "Anonymous",
    title: "VP of Operations",
  },
  {
    metric: "6mo",
    metricLabel: "of going in circles \u2192 resolved",
    shortQuote: "I finally knew what to build versus buy.",
    fullQuote:
      "I\u2019d been going in circles for 6 months \u2014 do we build our own AI underwriting model or use a vendor API? Krish didn\u2019t give me a recommendation. He gave me the framework to decide for myself.",
    name: "Founder",
    title: "Early-Stage FinTech",
  },
  {
    metric: "\u2713",
    metricLabel: "Board confidence, first time",
    shortQuote: "For the first time I wasn\u2019t guessing in a board conversation on AI.",
    fullQuote:
      "I went into a board conversation on AI the week after our session and for the first time I wasn\u2019t guessing. I had the questions, I knew what to push on, and I didn\u2019t get cornered.",
    name: "CEO",
    title: "Mid-market Services",
  },
  {
    metric: "10min",
    metricLabel: "to kill a bad vendor proposal",
    shortQuote: "We killed a vendor proposal in ten minutes.",
    fullQuote:
      "I expected this to be another AI discussion. It wasn\u2019t. We killed a vendor proposal in about ten minutes because the assumptions didn\u2019t hold up. I forwarded the notes straight to my team and we moved on.",
    name: "COO",
    title: "B2B Technology",
  },
  {
    metric: "2",
    metricLabel: "workflows I now use every single day",
    shortQuote: "I built two workflows in the sprint that I now use every day.",
    fullQuote:
      "I actually built two workflows in the sprint that I now use every day. Not experiments. Real systems that made my week calmer almost immediately.",
    name: "Head of Ops",
    title: "Scale-up",
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="w-[300px] sm:w-[320px] shrink-0 p-5 rounded-2xl border border-border/50 hover:border-ink/20 dark:hover:border-mint/20 transition-all cursor-pointer flex flex-col bg-background snap-start h-[260px]"
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Metric -- fixed height */}
      <div className="mb-2 h-[56px]">
        <div className="text-3xl font-bold text-ink dark:text-mint leading-none">
          {testimonial.metric}
        </div>
        <div className="text-[11px] text-muted-foreground mt-1 line-clamp-1">{testimonial.metricLabel}</div>
      </div>

      {/* Quote -- exactly 2 lines */}
      <Quote className="h-3.5 w-3.5 text-ink/20 dark:text-white/20 mb-1.5 shrink-0" />
      <p className="text-sm font-medium line-clamp-2 h-[40px] shrink-0">
        &ldquo;{testimonial.shortQuote}&rdquo;
      </p>

      {/* Expanded detail */}
      {isExpanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-[11px] text-muted-foreground leading-relaxed mt-1"
        >
          {testimonial.fullQuote}
        </motion.p>
      )}

      {/* Footer -- always at bottom */}
      <div className="mt-auto pt-2 border-t border-border/30">
        <div className="font-semibold text-[11px]">{testimonial.name}</div>
        <div className="text-[10px] text-muted-foreground">{testimonial.title}</div>
      </div>
    </div>
  );
};

const TrustSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

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

          <p className="text-xl md:text-2xl font-bold mb-4 max-w-2xl mx-auto leading-snug">
            I work with AI every single day &mdash; building, breaking, and shipping real systems. I&rsquo;m here to make sure you can too, without the jargon, without the judgement, and without pretending you should already know this stuff.
          </p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">
            This is a safe space to ask the &ldquo;silly&rdquo; questions, get honest answers, and walk away with the skills and confidence to future-proof yourself for the next decade. That&rsquo;s what I&rsquo;m passionate about.
          </p>

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

        {/* Horizontal scroll testimonials */}
        <div className="overflow-x-auto pb-4 -mx-4 px-4 scrollbar-thin">
          <div className="flex gap-5 snap-x snap-mandatory">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ ...spring, delay: index * 0.08 }}
              >
                <TestimonialCard testimonial={testimonial} />
              </motion.div>
            ))}
          </div>
        </div>

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
