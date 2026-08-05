import { Suspense, lazy } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { ArrowRight, Users, Bot, Sparkles } from "lucide-react";
import { AgathaStory, PageCompletionBeacon } from "@/components/new-age/AgathaStory";
import FrameworkJourney from "@/components/FrameworkJourney";

// Lazy-load the chart so it doesn't block the hero's LCP
const OrgChart = lazy(() =>
  import("@/components/new-age/OrgChart").then((m) => ({ default: m.OrgChart }))
);

const openScopingModal = () => {
  window.dispatchEvent(
    new CustomEvent("openScopingModal", {
      detail: { source_page: "/new-age-leadership" },
    }),
  );
};

const HEADLINE_WORDS = [
  "Your",
  "next",
  "org",
  "chart",
  "has",
  "agents",
  "on",
  "it.",
  "Here's",
  "what",
  "that",
  "looks",
  "like.",
];

const categories = [
  {
    icon: Sparkles,
    title: "Hybrid teams",
    body: "Most existing roles will become hybrid: one human who owns judgment and relationships, a small fleet of agents doing the throughput. The decision you'll face: when most of the work is agent-executed, does the human role become smaller, different, or bigger? Different companies will answer this differently. The answer determines your hiring plan for the next two years.",
  },
  {
    icon: Bot,
    title: "Agent-first functions",
    body: "Some functions will stop being human-default. Lead scoring, dependency monitoring, content drafting, customer research synthesis: these will become agent-first, with a human only in the exception path. The decision you'll face: when a function stops being human-default, what happens to the humans who used to do it? Replace, empower, or redeploy, and on what timeline?",
  },
  {
    icon: Users,
    title: "Emergent agent-native roles",
    body: "Some roles will appear that did not exist before. They're not translations of human jobs. They're roles that only make sense because an agent fleet created the need for them. The decision you'll face: how will your org approve the creation of roles that no human ever asked to do? Who has the authority? What's your governance? You probably haven't written this policy yet.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "New Age Leadership: What your org chart looks like when AI agents are teammates",
  description:
    "Most leadership content about AI is theoretical. This is the org chart of a business already running a 14-agent fleet, with the decisions every leader will need to make as their organization becomes AI-native.",
  author: {
    "@type": "Person",
    name: "Krish Raja",
    url: "https://www.themindmaker.ai",
  },
  publisher: {
    "@type": "Organization",
    name: "Mindmaker",
    url: "https://www.themindmaker.ai",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://www.themindmaker.ai/new-age-leadership",
  },
  about: [
    "AI org chart",
    "agentic organization design",
    "AI teammates",
    "agent-native roles",
    "future of leadership",
  ],
};

const ChartFallback = () => (
  <div className="rounded-2xl border border-border/60 bg-muted/30 h-[520px] md:h-[600px] flex items-center justify-center">
    <div className="text-sm text-muted-foreground">Loading chart…</div>
  </div>
);

export default function NewAgeLeadership() {
  return (
    <main className="min-h-screen bg-background">
      <SEO
        title="New Age Leadership: What your org chart looks like when AI agents are teammates"
        description="Most leadership content about AI is theoretical. This is the org chart of a business already running a 14-agent fleet, with the decisions every leader will need to make as their organization becomes AI-native."
        canonical="/new-age-leadership"
        ogType="article"
        keywords="AI org chart, agentic organization design, AI teammates, agent-native roles, future of leadership"
        jsonLd={jsonLd}
      />
      <Navigation />

      {/* HERO */}
      <section className="section-padding pt-32 pb-16">
        <div className="container-width max-w-4xl">
          <motion.div
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-mint-dark dark:text-mint mb-6"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span className="h-1 w-1 rounded-full bg-mint" />
            New Age Leadership
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            {HEADLINE_WORDS.map((word, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.15 + i * 0.06,
                  duration: 0.5,
                  type: "spring",
                  damping: 15,
                  stiffness: 200,
                }}
                className={`inline-block mr-[0.2em] ${
                  word.startsWith("agents") ? "text-mint-dark dark:text-mint" : ""
                }`}
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.05, duration: 0.6 }}
          >
            Most leadership content about AI is theoretical. This is what it actually looks like in an organization already running it. Toggle the chart. Click the roles. See the decisions you're going to have to make.
          </motion.p>
        </div>
      </section>

      {/* INTERACTIVE CHART */}
      <section className="section-padding pt-0">
        <div className="container-width max-w-6xl">
          <Suspense fallback={<ChartFallback />}>
            <OrgChart />
          </Suspense>
        </div>
      </section>

      {/* THREE CATEGORIES */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-6xl">
          <motion.div
            className="max-w-2xl mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              The three categories of role you didn't have to manage before.
            </h2>
            <p className="text-muted-foreground text-lg">
              Each one comes with its own governance question you probably haven't answered yet.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.article
                  key={cat.title}
                  className="group glass-card editorial-card p-7 border border-border/50 flex flex-col relative overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.18, duration: 0.5 }}
                  whileHover={{ y: -4 }}
                >
                  <div className="absolute left-0 top-0 bottom-0 w-0 bg-mint transition-all duration-300 group-hover:w-1" />
                  <div className="w-11 h-11 rounded-lg bg-mint/10 border border-mint/20 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-mint-dark dark:text-mint" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight">{cat.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{cat.body}</p>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* AGATHA STORY */}
      <AgathaStory />

      {/* MIND MAKE CLOSING */}
      <section className="section-padding">
        <div className="container-width max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-5">
              <span className="h-1 w-1 rounded-full bg-mint" />
              Mind Make
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              The future leaders don't have frameworks for yet.
            </h2>

            <div className="space-y-5 text-lg text-muted-foreground leading-relaxed mb-8">
              <p>
                Mindmaker's framework is{" "}
                <span className="font-semibold text-foreground">
                  Mind Set <span className="text-mint-dark dark:text-mint">→</span> Mind Map{" "}
                  <span className="text-mint-dark dark:text-mint">→</span> Mind Make
                </span>
                . Mind Make is the phase where decisions get committed and deployed. Most of what's above (emergent roles, hybrid teams, agent-proposed hires) is Mind Make territory, and it's territory leaders don't have frameworks for yet.
              </p>
              <p>
                You don't need to solve it today. You do need to know it's coming. The leaders who will handle it best aren't the ones who've read the most about AI. They're the ones who've already made a few of these calls, gotten a few wrong, and built the judgment muscle in a room of peers facing the same questions.
              </p>
              <p className="text-foreground font-medium">That's what the Cohort is for.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-8"
              >
                <a href="/cohort">
                  See the Cohort <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="font-bold">
                <a href="/operator">See how I operate</a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* HOW YOU GET THERE: the framework, moved here from the homepage so it
          sits with the org-design idea it actually serves. */}
      <section className="section-padding">
        <div className="container-width max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint mb-3">
              How you get there
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
              Running a hybrid species business is a skill, not a tool purchase.
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              An org chart with agents in it needs a leader who can actually direct them.
              That is the job: not buying AI, but becoming the person who can run a
              business where humans and agents both do the work. Three phases, and most
              nervous decisions resolve in the first.
            </p>
          </motion.div>
        </div>
      </section>

      <FrameworkJourney />

      {/* FINAL SOFT CTA */}
      <section className="section-padding bg-muted/30">
        <div className="container-width max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 max-w-2xl mx-auto">
              The New Age org chart isn't a prediction. It's already happening in my business and in a growing number of my clients'. If yours is next, let's talk before you design it alone.
            </p>
            <Button
              size="lg"
              className="bg-ink text-white hover:bg-ink/90 dark:bg-mint dark:text-ink dark:hover:bg-mint/90 font-bold px-8"
              onClick={openScopingModal}
            >
              Bring me one real decision <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </motion.div>
          <PageCompletionBeacon />
        </div>
      </section>

      <Footer />
    </main>
  );
}
