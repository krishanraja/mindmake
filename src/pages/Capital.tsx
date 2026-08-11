/**
 * The third door: the same two engagements, bought by a fund, family office or
 * operating partner on behalf of a portfolio company.
 *
 * Not a separate offer. The mistake this page used to make was describing
 * fund-specific products, which meant maintaining a second ladder that drifted
 * from the first one. There is one ladder. This page changes who is holding
 * the invoice and what they are optimising for, not what gets delivered.
 *
 * Prices come from src/lib/offers.ts like everywhere else, per portfolio
 * company. Fund-level and multi-company terms are deliberately NOT published:
 * they are set on the call. A published volume discount would be a published
 * discount, which is the thing that was just removed from the rest of the site.
 */

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Building2, CheckCircle } from "lucide-react";
import { SEO } from "@/components/SEO";
import { HANDOVER, HANDOVER_ANNUAL_CAP, TEARDOWN, displayPrice } from "@/lib/offers";
import { useCurrency, useOfferPrice } from "@/contexts/CurrencyContext";
import { CurrencySwitcher } from "@/components/CurrencySwitcher";
import { cn } from "@/lib/utils";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: "easeOut" },
  }),
};

const openDiagnosisRoom = () => {
  window.dispatchEvent(
    new CustomEvent("openDiagnosisRoom", {
      detail: { source_page: "/capital", mode: "full" },
    }),
  );
};

const whenItFits = [
  "A portfolio company whose product works and whose commercial story does not.",
  "A board paper that keeps getting rewritten because nobody agrees what the company sells.",
  "An operating partner being asked to have an opinion on an AI decision they did not make.",
  "The same conversation happening at three companies, where you suspect it is one problem.",
];

const whenItDoesNot = [
  "You want a fractional operator inside the company. This ends on a date.",
  "The company needs engineering delivery. This is commercial work.",
  "Nobody at the company owns the outcome. A sponsor who is not accountable cannot carry it.",
  "Pre-revenue, or no decision anyone can name in a sentence.",
];

export default function Capital() {
  const { currency } = useCurrency();
  const teardownPrice = useOfferPrice(TEARDOWN);

  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="For funds and portfolio companies"
        description="The same two engagements, bought by a fund, family office or operating partner for a portfolio company. The Teardown on one decision. The Handover on how the company decides and sells. Priced per portfolio company."
        canonical="/capital"
        ogType="website"
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mint/10 border border-mint/20 text-mint-dark dark:text-mint text-xs font-bold uppercase tracking-[0.18em] mb-6">
              <Building2 className="w-3.5 h-3.5" />
              For funds and portfolio companies
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 leading-tight">
              You already know which one is stuck.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-6 leading-relaxed">
              Usually it is not the product. It is that nobody can explain what the
              company sells, to whom, at what price, and the deck has been rewritten four
              times without anyone saying that out loud.
            </p>
            <p className="text-base text-muted-foreground max-w-2xl mb-8 leading-relaxed">
              Same two engagements as everyone else gets. The difference is who is holding
              the invoice, and that you are watching a pattern across a portfolio rather
              than one company's quarter.
            </p>

            <Button
              size="lg"
              onClick={openDiagnosisRoom}
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
            >
              Bring me one real decision
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* THE TWO ENGAGEMENTS */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-3"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            Priced per portfolio company.
          </motion.h2>
          <motion.p
            className="text-muted-foreground mb-8 max-w-2xl leading-relaxed"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            The same figures anyone else pays. Nothing is marked up because a fund is
            asking, and nothing is discounted for volume on a public page.
          </motion.p>

          <motion.div
            className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-2"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">
              Prices in
            </span>
            <CurrencySwitcher idPrefix="capital-currency" />
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            <motion.div
              className="glass-card editorial-card p-6 border border-mint/30"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
            >
              <h3 className="text-lg font-bold mb-1">The Handover</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Six weeks rebuilding how the company decides and sells, then it ends. In
                week five I do not attend, which is when you find out whether it holds. A
                Day 90 recheck is included.
              </p>
              <dl className="space-y-1.5">
                {HANDOVER.tiers.map((tier, i) => (
                  <div key={tier.id} className="flex flex-wrap items-baseline gap-x-3">
                    <dd
                      data-price
                      className={cn(
                        "min-w-[7ch] whitespace-nowrap font-bold tabular-nums",
                        i === 0 ? "text-2xl" : "text-lg",
                      )}
                    >
                      {displayPrice(HANDOVER, currency, tier.id)}
                    </dd>
                    <dt className="min-w-0 text-sm text-muted-foreground">{tier.label}</dt>
                  </div>
                ))}
              </dl>
              <p className="text-xs text-muted-foreground mt-4">
                {HANDOVER_ANNUAL_CAP} a year in total, across every client. The cap is not
                a scarcity device, it is the honest number for work done personally.
              </p>
            </motion.div>

            <motion.div
              className="glass-card editorial-card p-6 border border-border/50"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={1}
            >
              <h3 className="text-lg font-bold mb-1">The Teardown</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Ten business days on one real decision, under two hours of the company's
                time. Ends in a one-page memo the board can read, and three claims placed
                under a 90-day watch.
              </p>
              <div className="flex flex-wrap items-baseline gap-x-3">
                <span
                  data-price
                  className="min-w-[7ch] whitespace-nowrap text-2xl font-bold tabular-nums"
                >
                  {teardownPrice}
                </span>
                <span className="text-sm text-muted-foreground">
                  {TEARDOWN.tiers[0].label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Every Handover starts here. It is also the cheapest way to find out that a
                company does not need the six weeks, which happens often enough to be the
                point rather than a disclaimer.
              </p>
            </motion.div>
          </div>

          <motion.p
            className="text-sm text-muted-foreground mt-6 max-w-2xl leading-relaxed"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            Fund-level engagements, and terms across more than one portfolio company, are
            set on the call. That is not a coyness about price. It is that the shape
            changes with how many companies, over what window, and who inside the fund
            carries the work between engagements, and none of that is knowable from a page.
          </motion.p>
        </div>
      </section>

      {/* FIT */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-4xl">
          <motion.h2
            className="text-3xl md:text-4xl font-bold mb-8"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            When this is the right call.
          </motion.h2>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-4">
                It fits
              </h3>
              <ul className="space-y-3">
                {whenItFits.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <CheckCircle className="w-4 h-4 mt-0.5 shrink-0 text-mint-dark dark:text-mint" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              variants={fadeUp}
              custom={1}
            >
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-muted-foreground mb-4">
                It does not
              </h3>
              <ul className="space-y-3">
                {whenItDoesNot.map((item) => (
                  <li key={item} className="flex gap-3 text-sm text-muted-foreground leading-relaxed">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-muted-foreground/60" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding border-t border-border/40">
        <div className="container-width max-w-2xl text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUp}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Bring the company you keep arguing about.
            </h2>
            <p className="text-muted-foreground mb-7 leading-relaxed">
              Work the decision through first. It costs nothing, and it will tell you
              plainly if neither engagement is the right spend for that company.
            </p>
            <Button
              size="lg"
              onClick={openDiagnosisRoom}
              className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold"
            >
              Bring me one real decision
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
