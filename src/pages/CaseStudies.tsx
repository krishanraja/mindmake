import { motion } from "framer-motion";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookFitCall } from "@/components/BookFitCall";
import { SEO } from "@/components/SEO";
import { useTestimonials } from "@/hooks/useTestimonials";
import { careerReferences, clientStories } from "@/data/rebuildProof";

export default function CaseStudies() {
  const { data: consented = [] } = useTestimonials();
  const canShowSteph = consented.some((item) => `${item.company ?? ""} ${item.role ?? ""}`.toLowerCase().includes("legacy ascend"));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Mindmaker client results",
    itemListElement: clientStories.map((story, index) => ({ "@type": "ListItem", position: index + 1, name: story.title })),
  };

  return (
    <main className="min-h-screen bg-background">
      <SEO title="Client results" description="Eight verified stories about the business decisions Mindmaker helped clients make and what happened next." canonical="/case-studies" jsonLd={jsonLd} />
      <Navigation />

      <section className="section-padding-nav bg-muted">
        <div className="container-width max-w-5xl">
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">Client results</p>
          <h1 className="text-4xl font-bold md:text-6xl">The decision, and what changed next.</h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground">Eight real engagements. The clients stay anonymous. The work and results do not.</p>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-width max-w-6xl">
          <div className="grid gap-5 md:grid-cols-2">
            {clientStories.map((story, index) => (
              <motion.article key={story.id} className="rounded-2xl border border-border/60 bg-card p-7 md:p-8" initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ delay: Math.min(index * 0.04, 0.2) }}>
                <p className="text-xs font-bold text-mint-dark dark:text-mint">{String(index + 1).padStart(2, "0")}</p>
                <h2 className="mt-4 text-2xl font-bold">{story.title}</h2>
                <p className="mt-4 text-muted-foreground">{story.outcome}</p>
                <blockquote className="mt-7 border-t border-border/60 pt-5">
                  <p className="text-sm leading-relaxed">“{story.quote}”</p>
                  <footer className="mt-3 text-xs font-bold text-muted-foreground">{story.attribution}</footer>
                </blockquote>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {canShowSteph && (
        <section className="section-padding bg-ink text-white">
          <div className="container-width max-w-4xl">
            <blockquote>
              <p className="text-2xl font-bold leading-relaxed text-white md:text-4xl">“What's unique about Krish is that he never lets you become reliant on him. He puts you in the driver's seat, explains AI fundamentals in plain language, and empowers you to own the skills that actually move your business forward.”</p>
              <footer className="mt-6 text-sm font-bold text-mint">Steph Darmanin, Performance Coach</footer>
            </blockquote>
          </div>
        </section>
      )}

      <section className="section-padding bg-muted">
        <div className="container-width max-w-6xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Career references, not client results</p>
          <h2 className="max-w-3xl text-3xl font-bold md:text-5xl">What people who worked beside Krish say.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {careerReferences.map((reference) => (
              <blockquote key={reference.name} className="rounded-2xl border border-border/60 bg-background p-6">
                <p className="text-sm leading-relaxed">“{reference.quote}”</p>
                <footer className="mt-5 border-t border-border/60 pt-4 text-xs"><strong className="block">{reference.name}</strong><span className="text-muted-foreground">{reference.role}</span></footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-background text-center">
        <div className="container-width max-w-3xl">
          <h2 className="text-3xl font-bold md:text-5xl">Bring the decision, not a finished brief.</h2>
          <p className="mx-auto mt-5 max-w-xl text-lg text-muted-foreground">The fit call is enough to see whether the problem and the Sprint belong together.</p>
          <BookFitCall source="case-studies-final" className="mt-8" />
        </div>
      </section>

      <Footer />
    </main>
  );
}
