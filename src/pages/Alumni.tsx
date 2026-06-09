import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Lock } from "lucide-react";
import { SEO } from "@/components/SEO";
// The Alumni Pass is the only product on the site that takes a direct
// Stripe charge. The price is configured via STRIPE_PRODUCTS.alumniPass
// in src/lib/stripe-prices.ts. Krish confirms eligibility post-engagement
// and sends a direct Stripe Payment Link out of band; live checkout from
// this page is not shipped in this pass.

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openConsultModal = (detail?: Record<string, unknown>) => {
  window.dispatchEvent(
    new CustomEvent("openConsultModal", { detail: detail || {} })
  );
};

const benefits = [
  "Annual access to all five Mindmaker Workshops (re-attend any one, any time)",
  "Quarterly written state-of-the-market memo",
  "Alumni Slack channel",
  "First-refusal seats on the next AI-Fluent Executive cohort",
  "Lifetime access to CTRL, Mindmaker's flagship memory-web app",
];

export default function Alumni() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="Alumni Pass"
        description="Annual continuity programme for Mindmaker alumni. Around $1,500 a year."
        canonical="/alumni"
        ogType="website"
        noindex
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-3xl text-center">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Lock className="w-3.5 h-3.5" />
              Alumni-only · Invitation required
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              The Mindmaker <span className="text-mint-dark dark:text-mint">Alumni Pass.</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Continuity after the finish line. For Mindmaker alumni who want to keep building.
            </p>
          </motion.div>
        </div>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className="section-padding pt-0">
        <div className="container-width max-w-3xl">
          <motion.div
            className="glass-card editorial-card p-8 md:p-10 border border-border/50"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6">What's included.</h2>
            <ul className="space-y-3">
              {benefits.map((item, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-3"
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  custom={i}
                  variants={fadeUp}
                >
                  <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* ELIGIBILITY */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}>
            <h2 className="text-2xl md:text-3xl font-bold mb-5">Eligibility.</h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
              If you've completed a Mindmaker Workshop, the AI-Fluent Executive cohort, a Signal Session, the Revenue Architecture, or the AI Immersion, you're eligible. Invitations are sent post-engagement. If you're not yet an alum and you'd like to be, the right starting point is a Workshop or the Cohort.
            </p>
          </motion.div>
        </div>
      </section>

      {/* PRICE + CTA */}
      <section className="section-padding">
        <div className="container-width max-w-3xl">
          <motion.div
            className="glass-card editorial-card p-8 md:p-10 border border-mint/30 text-center"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <div className="flex items-baseline justify-center gap-2 mb-3">
              <span className="text-4xl md:text-5xl font-bold">around $1,500</span>
              <span className="text-muted-foreground">a year</span>
            </div>
            <p className="text-sm text-muted-foreground mb-7">
              Cancel anytime. Billed via Stripe.
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
              onClick={() => openConsultModal({ preselected: "alumni" })}
            >
              Request an invitation <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
