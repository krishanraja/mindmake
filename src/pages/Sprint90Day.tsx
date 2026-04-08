import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import LiveDecisionPreview from "@/components/LiveDecisionPreview";
import { useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";

const monthlyArc = [
  {
    month: 1,
    phase: "Mind Set",
    theme: "Clarity",
    description:
      "We identify the 2-3 decisions that will define your AI direction for the next year. No noise, no vendor theater \u2014 just what actually matters for your business.",
  },
  {
    month: 2,
    phase: "Mind Map",
    theme: "Leverage",
    description:
      "We build working systems around your actual workflows \u2014 AI clones, agentic automations, memory structures. Not demos, not proofs-of-concept. Real, deployed AI that multiplies your strongest capabilities.",
  },
  {
    month: 3,
    phase: "Mind Make",
    theme: "Direction",
    description:
      "We measure, document, and prepare your board-ready narrative. You walk away with deployed systems, clear ROI, and a 12-month roadmap.",
  },
];

const outcomes = [
  "3-5 deployed AI systems (working, measured, documented)",
  "2-3 strategic decisions resolved (with trade-off memos)",
  "12-month AI roadmap with clear gates and owners",
  "Board-level confidence (you can defend every decision)",
  "Team alignment on AI standards and boundaries",
  "Builder Dossier (all decisions, systems, and learnings in one place)",
  "Personal AI systems (clones, agents, memory) that make you operate at 3x",
];

const examples = [
  "Full AI governance framework",
  "Multiple working systems deployed",
  "Team alignment on AI standards",
  "Vendor landscape clarity",
  "Build vs buy resolved across the stack",
  "Hiring strategy for AI roles",
  "AI clone deployed for communications and first-draft work",
  "Delegation framework with clear human-vs-AI boundaries",
];

const Sprint90Day = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="section-padding pt-32">
        <div className="container-width max-w-4xl">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              90-Day Sprint
            </h1>
            <p className="text-2xl text-mint-dark dark:text-mint mb-4">
              The full journey. Mind Set &rarr; Mind Map &rarr; Mind Make.
            </p>
            <p className="text-xl text-muted-foreground">
              Three decisions. Three months. Complete direction from AI chaos to
              calm.
            </p>
          </div>

          {/* The Three-Month Arc */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-8">The Three-Month Arc</h2>

            <div className="space-y-10">
              {monthlyArc.map((month) => (
                <div key={month.month}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 rounded-full bg-mint/20 flex items-center justify-center font-bold text-mint-dark dark:text-mint">
                      {month.month}
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold">{month.theme}</h3>
                      <p className="text-sm text-mint-dark dark:text-mint">{month.phase}</p>
                    </div>
                  </div>
                  <p className="ml-14 sm:ml-[60px] text-muted-foreground">
                    {month.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* What You Get */}
          <div className="glass-card p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">What You Actually Get</h2>
            <ul className="space-y-4">
              {outcomes.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-mint-dark dark:text-mint shrink-0 mt-0.5" />
                  <span className="text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Example Outcomes */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">
              What Leaders Walk Away With
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {examples.map((example, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 p-4 rounded-lg bg-ink/5"
                >
                  <CheckCircle className="w-5 h-5 text-mint-dark dark:text-mint shrink-0 mt-0.5" />
                  <span className="text-sm">{example}</span>
                </div>
              ))}
            </div>
          </div>

          {/* The Sprint Library -- what each month covers */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-3">
              What Each Month Looks Like
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Each month maps to a phase. Here are the decision sprints you'll work through.
            </p>

            <div className="space-y-6">
              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-mint-dark dark:text-mint mb-1">
                  Month 1 - Mind Set (Clarity)
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Filter the noise. Set your boundaries. Develop taste.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "AI Landscape Compression", artifact: "AI relevance map + discard list" },
                    { name: "Tool Commitment Philosophy", artifact: "Tool hierarchy (Core / Tactical / Experimental)" },
                    { name: "Personal AI Manifesto", artifact: "1-page personal AI charter" },
                  ].map((sprint, i) => (
                    <div key={i} className="p-3 rounded bg-ink/5 border border-border/50">
                      <div className="font-semibold text-sm mb-1">{sprint.name}</div>
                      <div className="text-xs text-muted-foreground">Artifact: {sprint.artifact}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-mint-dark dark:text-mint mb-1">
                  Month 2 - Mind Map (Leverage)
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Build systems. Multiply strengths. Automate weaknesses.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "Personal System Architecture", artifact: "3–5 working AI systems + deployment checklist" },
                    { name: "Strength Amplifier or Weakness Counterbalance", artifact: "Amplifier blueprint or delegation flow + automation stack" },
                    { name: "AI Clone & Memory Architecture", artifact: "Clone prompt library + memory system + deployment guide" },
                    { name: "Vibe Code Ideas to MVP", artifact: "Working prototype + build-vs-hire decision matrix" },
                  ].map((sprint, i) => (
                    <div key={i} className="p-3 rounded bg-ink/5 border border-border/50">
                      <div className="font-semibold text-sm mb-1">{sprint.name}</div>
                      <div className="text-xs text-muted-foreground">Artifact: {sprint.artifact}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-6">
                <h3 className="text-sm font-bold uppercase tracking-wider text-mint-dark dark:text-mint mb-1">
                  Month 3 - Mind Make (Direction)
                </h3>
                <p className="text-xs text-muted-foreground mb-3">Make high-stakes decisions. Set the roadmap. Brief the board.</p>
                <div className="grid sm:grid-cols-3 gap-3">
                  {[
                    { name: "Build vs Buy vs Glue", artifact: "Decision memo + investment table" },
                    { name: "Vendor Selection Without Regret", artifact: "Scorecard + shortlist + exit criteria" },
                    { name: "12-Month AI Roadmap", artifact: "Quarterly milestones + board narrative" },
                    { name: "AI-Powered GTM", artifact: "Deployed lead-gen system + cost-per-lead model" },
                  ].map((sprint, i) => (
                    <div key={i} className="p-3 rounded bg-ink/5 border border-border/50">
                      <div className="font-semibold text-sm mb-1">{sprint.name}</div>
                      <div className="text-xs text-muted-foreground">Artifact: {sprint.artifact}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Decision Artifact */}
          <LiveDecisionPreview />

          {/* Extended Sprint */}
          <div className="glass-card p-8 mb-12">
            <h3 className="text-2xl font-bold mb-4">Need More Time?</h3>
            <p className="text-lg text-muted-foreground mb-4">
              Some leaders extend the 90-day sprint into a 6-month engagement
              for ongoing support as they scale what they've built. We call this
              the <strong>Extended Sprint</strong>.
            </p>
            <p className="text-muted-foreground">
              This isn't a separate product - it's a natural continuation.
              We'll discuss this option in your initial conversation if it makes
              sense for your situation.
            </p>
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
        commitmentLevel="90d"
      />
    </main>
  );
};

export default Sprint90Day;
