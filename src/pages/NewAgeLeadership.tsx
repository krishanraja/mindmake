import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Bot, Sparkles, Users } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { AgathaStory, PageCompletionBeacon } from "@/components/new-age/AgathaStory";
/* Imported, not lazy. It was a `React.lazy` boundary inside a lazy route, which
   split one page's code across two requests and bought nothing: this page is
   the only thing that loads either chunk. Once the pages were prerendered it
   cost something real. `renderToString` cannot wait for a lazy component, so
   the build wrote an unfinished Suspense boundary here, the chart was missing
   from the HTML a crawler reads, and the browser rebuilt that whole section
   client-side on arrival. */
import { OrgChart } from "@/components/new-age/OrgChart";
import "@/styles/mindmake.css";


const checks = [
  {
    icon: Users,
    title: "Keep a person on the calls that need trust.",
    body: "Name the work where taste, care, privacy or a hard trade-off still needs a person. AI can prepare the ground without making the final call.",
  },
  {
    icon: Bot,
    title: "Let AI carry work that has a clear rule.",
    body: "Research, checking and first drafts can move without waiting. Set the rule, the limit and the point where a person must step in.",
  },
  {
    icon: Sparkles,
    title: "Design the hand-off, not only the agent.",
    body: "The useful question is not how many agents you have. It is what each one hands back, who checks it and what happens when it is unsure.",
  },
];

const description =
  "Explore a working org chart from our own AI system and see the human decisions behind each role.";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "See people and AI agents share the work",
  description,
  author: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
  publisher: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://mindmake.co/new-age-leadership",
  },
};

export default function NewAgeLeadership() {
  const [briefOpen, setBriefOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title="A working AI org chart"
        description={description}
        canonical="/new-age-leadership"
        ogType="article"
        keywords="AI org chart, AI agents, organisation design, human judgement"
        jsonLd={jsonLd}
      />

      <section className="section-padding pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="container-width max-w-5xl">
          <motion.h1
            className="max-w-[15ch] text-[clamp(3rem,7vw,6.7rem)] leading-[0.95]"
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.08, duration: 0.55 }}
          >
            See people and AI agents share the work.
          </motion.h1>
          <motion.p
            className="mt-8 max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl"
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.2, duration: 0.45 }}
          >
            This is a working org chart from our own AI system. Switch views, open a role
            and inspect the decision it creates. Use it to notice what your own chart may need.
          </motion.p>
        </div>
      </section>

      <section className="section-padding pt-0" aria-label="Interactive AI organisation chart">
        <div className="container-width max-w-6xl">
          <OrgChart onStart={() => setBriefOpen(true)} />
        </div>
      </section>

      <section className="section-padding bg-muted/30" aria-labelledby="org-chart-checks">
        <div className="container-width max-w-6xl">
          <div className="max-w-3xl mb-12 md:mb-16">
            <h2 id="org-chart-checks" className="text-3xl font-bold leading-tight md:text-5xl">
              Three choices to make before you add an AI agent.
            </h2>
          </div>
          <div className="grid border-y border-border/70 md:grid-cols-3">
            {checks.map((check, index) => {
              const Icon = check.icon;
              return (
                <motion.article
                  key={check.title}
                  className="py-9 md:min-h-[340px] md:px-8 md:py-10 md:first:pl-0 md:last:pr-0 md:[&+article]:border-l md:[&+article]:border-border/70"
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={reduceMotion ? { duration: 0 } : { delay: index * 0.1, duration: 0.45 }}
                >
                  <Icon className="h-6 w-6 text-mint-dark dark:text-mint" aria-hidden="true" />
                  <h3 className="mt-16 text-2xl font-bold leading-tight md:text-3xl">{check.title}</h3>
                  <p className="mt-5 leading-relaxed text-muted-foreground">{check.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <AgathaStory onStart={() => setBriefOpen(true)} />

      <section className="section-padding bg-ink text-white" aria-labelledby="org-chart-next-step">
        <div className="container-width max-w-5xl grid gap-10 md:grid-cols-[1.2fr_.8fr] md:items-end">
          <div>
            <h2 id="org-chart-next-step" className="max-w-[13ch] text-4xl font-bold leading-[1.02] md:text-6xl">
              Find one hand-off worth improving first.
            </h2>
          </div>
          <div>
            <p className="mb-7 text-lg leading-relaxed text-white/70">
              Mindmake can read the company and show one useful starting point. You see the
              brief before you choose whether to share it.
            </p>
            <button className="mm-button" type="button" onClick={() => setBriefOpen(true)}>
              Start here
            </button>
          </div>
        </div>
        <PageCompletionBeacon />
      </section>

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
