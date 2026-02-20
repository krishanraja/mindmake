import { Quote, TrendingUp, Clock, Shield } from "lucide-react";
import { useState } from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import krishHeadshot from "@/assets/krish-headshot.png";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

interface Testimonial {
  metric: string;
  metricLabel: string;
  shortQuote: string;
  fullQuote: string;
  name: string;
  title: string;
  icon: typeof Quote;
}

const testimonials: Testimonial[] = [
  {
    metric: "0",
    metricLabel: "board AI questions I now dread",
    shortQuote: "I stopped dreading board AI questions.",
    fullQuote:
      "Before the sprint, I was fielding questions about our AI strategy and honestly just making it up as I went. Krish helped me get clear on the 3 decisions that actually mattered. Now when the board asks, I have real answers.",
    name: "Sarah M.",
    title: "CPO, Series C SaaS",
    icon: Shield,
  },
  {
    metric: "14 \u2192 3",
    metricLabel: "AI tools that actually work",
    shortQuote: "We went from 14 tools to 3 systems that actually work.",
    fullQuote:
      "Everyone on the team was experimenting with AI \u2014 ChatGPT for this, Claude for that, some random automation tool from LinkedIn. It was chaos. The 4-week sprint forced us to decide: what\u2019s actually strategic, and what\u2019s just noise?",
    name: "Anonymous",
    title: "VP of Operations",
    icon: TrendingUp,
  },
  {
    metric: "6mo",
    metricLabel: "of going in circles \u2192 resolved",
    shortQuote: "I finally knew what to build versus buy.",
    fullQuote:
      "I\u2019d been going in circles for 6 months \u2014 do we build our own AI underwriting model or use a vendor API? Every conversation made it worse. Krish didn\u2019t give me a recommendation. He gave me the framework to decide for myself.",
    name: "Founder",
    title: "Early-Stage FinTech",
    icon: Clock,
  },
];

const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="p-8 rounded-2xl border border-border/50 hover:border-ink/20 dark:hover:border-mint/20 transition-all cursor-pointer flex flex-col"
      whileHover={{ y: -4 }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="mb-4">
        <div className="text-4xl md:text-5xl font-bold text-ink dark:text-mint leading-none">
          {testimonial.metric}
        </div>
        <div className="text-sm text-muted-foreground mt-1">{testimonial.metricLabel}</div>
      </div>

      <Quote className="h-5 w-5 text-ink/20 dark:text-white/20 mb-3" />

      <p className="text-sm font-medium mb-3">
        &ldquo;{testimonial.shortQuote}&rdquo;
      </p>

      {isExpanded && (
        <motion.p
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="text-sm text-muted-foreground mb-3 leading-relaxed"
        >
          {testimonial.fullQuote}
        </motion.p>
      )}

      <div className="mt-auto pt-4 border-t border-border/30">
        <div className="font-semibold text-sm">{testimonial.name}</div>
        <div className="text-xs text-muted-foreground">{testimonial.title}</div>
      </div>

      {!isExpanded && (
        <span className="text-xs text-muted-foreground mt-2">Click to read more</span>
      )}
    </motion.div>
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
        {/* Krish stat line */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={spring}
        >
          <div className="flex justify-center mb-6">
            <img
              src={krishHeadshot}
              alt="Krish Raja"
              className="w-24 h-24 rounded-full border-4 border-ink/10 dark:border-mint/20"
              loading="lazy"
            />
          </div>
          <p className="text-2xl md:text-3xl font-bold mb-2">
            16 years. 90+ engagements. Microsoft. Harvard.
          </p>
          <p className="text-muted-foreground max-w-lg mx-auto">
            I'm not going to sell you a tool or a framework slide. I'm going to help you make the decisions you've been avoiding.
          </p>
        </motion.div>

        {/* Metrics-forward testimonials */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ ...spring, delay: index * 0.1 }}
            >
              <TestimonialCard testimonial={testimonial} />
            </motion.div>
          ))}
        </div>

        {/* Client sectors */}
        <motion.div
          className="mt-16 text-center"
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
