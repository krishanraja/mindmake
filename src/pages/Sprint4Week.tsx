import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const weeklyArc = [
  {
    week: 1,
    theme: "Relief",
    description:
      "We name what you're actually anxious about. Not what the vendor deck says. Not what the board wants to hear. The real decision. You'll feel relief because you're finally addressing it directly.",
  },
  {
    week: 2,
    theme: "Momentum",
    description:
      "We map your options. Build vs buy. Vendor A vs Vendor B. Do it now vs wait. Every path gets a trade-off analysis. No hand-waving. You'll see the decision clearly for the first time.",
  },
  {
    week: 3,
    theme: "Confidence",
    description:
      "You make the call. We document why. Not a 40-slide deck \u2014 a decision memo. One page. What you decided, why, what success looks like, what the risks are. Defensible. Real.",
  },
  {
    week: 4,
    theme: "Calm",
    description:
      "Board-ready. You walk into that meeting with a one-pager that answers every question before it's asked. No theater. No anxiety. Just calm clarity.",
  },
];

const nervousDecisions = [
  "Which vendors do we commit to?",
  "What should I build vs buy?",
  "How do I multiply my strongest edge with AI?",
  "What's my AI boundary for this year?",
  "Should we hire AI talent or train our team?",
  "How do I evaluate vendor promises vs reality?",
  "What's the right first AI project to build credibility?",
  "How do I prioritize 12 competing AI initiatives?",
  "Should I build an AI clone of myself or is that overkill?",
  "What should I delegate to AI vs keep doing myself?",
  "How do I get AI to actually sound like me?",
  "How do I make AI remember my preferences and context?",
];

const deliverables = [
  "One clear, defensible decision on your biggest AI anxiety",
  "Trade-off analysis showing all options + why you picked yours",
  "Decision memo (1-2 pages, board-ready)",
  "ROI framework to measure success in 3/6/12 months",
  "Access to Krish for 4 weekly decision sessions (60 min each)",
  "Async support between sessions (email/Slack)",
];

const Sprint4Week = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              4-Week Sprint
            </h1>
            <p className="text-2xl text-mint mb-4">
              One decision. Four weeks. Board-ready.
            </p>
            <p className="text-xl text-muted-foreground">
              You have a nervous decision about AI. We help you make it with
              confidence.
            </p>
          </div>

          {/* The Arc */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8">The Four-Week Arc</h2>

            <div className="space-y-8">
              {weeklyArc.map((week) => (
                <div key={week.week}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center font-bold text-mint">
                      {week.week}
                    </div>
                    <h3 className="text-2xl font-semibold">{week.theme}</h3>
                  </div>
                  <p className="ml-14 sm:ml-[60px] text-muted-foreground">
                    {week.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Example Nervous Decisions */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              Example Nervous Decisions
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              These are the kinds of decisions leaders bring to the 4-week
              sprint:
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
              {nervousDecisions.map((decision, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-4 rounded-lg bg-ink/5"
                >
                  <CheckCircle className="w-5 h-5 text-mint shrink-0 mt-0.5" />
                  <span className="text-sm">{decision}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What You Get */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">What You Actually Get</h2>
            <ul className="space-y-4">
              {deliverables.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mint shrink-0 mt-0.5" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Decision Sprint Library */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-3">
              Example Decision Sprints
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Pick one. We resolve it in four weeks.
            </p>

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-mint mb-3">
                  Mind Set (Clarity)
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "AI Landscape Compression", decision: "What actually matters in AI right now?" },
                    { name: "Tool Commitment Philosophy", decision: "Which tools do I commit to vs experiment with?" },
                    { name: "Personal AI Manifesto", decision: "What are my boundaries?" },
                  ].map((sprint, i) => (
                    <div key={i} className="p-4 rounded-lg bg-ink/5 border border-border/50">
                      <div className="font-semibold text-sm mb-1">{sprint.name}</div>
                      <div className="text-xs text-muted-foreground">{sprint.decision}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-mint mb-3">
                  Mind Map (Leverage)
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "Personal System Architecture", decision: "What systems should I build for myself?" },
                    { name: "Strength Amplifier", decision: "How do I multiply my strongest edge?" },
                    { name: "Weakness Counterbalance", decision: "Where am I bottlenecked personally?" },
                    { name: "AI Clone Design", decision: "How do I build a digital version of myself that works?" },
                    { name: "Agentic Workflow Engine", decision: "Which tasks should run autonomously?" },
                    { name: "Vibe Code Ideas to MVP", decision: "What can I build myself vs outsource?" },
                  ].map((sprint, i) => (
                    <div key={i} className="p-4 rounded-lg bg-ink/5 border border-border/50">
                      <div className="font-semibold text-sm mb-1">{sprint.name}</div>
                      <div className="text-xs text-muted-foreground">{sprint.decision}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-mint mb-3">
                  Mind Make (Direction)
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "Build vs Buy vs Glue", decision: "Where is AI core vs commodity?" },
                    { name: "AI Pricing & Monetization", decision: "How does AI reshape revenue?" },
                    { name: "Vendor Selection Without Regret", decision: "Which vendors do we commit to?" },
                    { name: "AI Operating Model", decision: "Who owns AI and how?" },
                    { name: "Strategic Data Prioritisation", decision: "What data is strategic?" },
                    { name: "12-Month AI Roadmap", decision: "What do we actually do next year?" },
                    { name: "AI Delegation Matrix", decision: "What stays human and what gets handed off?" },
                    { name: "AI-Powered GTM", decision: "How do I generate leads without scaling headcount?" },
                  ].map((sprint, i) => (
                    <div key={i} className="p-4 rounded-lg bg-ink/5 border border-border/50">
                      <div className="font-semibold text-sm mb-1">{sprint.name}</div>
                      <div className="text-xs text-muted-foreground">{sprint.decision}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center glass-card p-6 sm:p-12">
            <h2 className="text-3xl font-bold mb-4">
              What's your nervous decision?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              The first conversation is free. We'll figure out if this is the
              right sprint for you.
            </p>
            <Button
              size="lg"
              className="bg-mint text-ink hover:bg-mint/90 font-semibold px-6 sm:px-12 py-6 text-base sm:text-lg"
              onClick={() => setConsultModalOpen(true)}
            >
              Start the Conversation
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />

      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        commitmentLevel="4wk"
      />
    </main>
  );
};

export default Sprint4Week;
