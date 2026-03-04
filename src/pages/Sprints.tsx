import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, ArrowRight, Zap, FileCheck, Target } from "lucide-react";

const spring = { type: "spring" as const, stiffness: 80, damping: 18 };

type PathTab = "build" | "orchestrate";

const builderSprintLibrary = {
  mindSet: [
    { name: "AI Landscape Compression", decision: "What actually matters in AI right now?", artifact: "AI relevance map + discard list" },
    { name: "Tool Commitment Philosophy", decision: "Which tools do I commit to vs experiment with?", artifact: "Tool hierarchy (Core / Tactical / Experimental)" },
    { name: "Personal AI Manifesto", decision: "What are my boundaries?", artifact: "1-page personal AI charter" },
  ],
  mindMap: [
    { name: "Personal System Architecture", decision: "What systems should I build for myself?", artifact: "3\u20135 working AI systems + deployment checklist" },
    { name: "Strength Amplifier", decision: "How do I multiply my strongest edge?", artifact: "Amplifier blueprint + workflow design" },
    { name: "Weakness Counterbalance", decision: "Where am I bottlenecked personally?", artifact: "Delegation flow + automation stack" },
    { name: "AI Clone Design", decision: "How do I build a digital version of myself?", artifact: "Clone prompt library + voice/tone profile + deployment playbook" },
    { name: "Agentic Workflow Engine", decision: "Which tasks should run on autopilot?", artifact: "3\u20135 autonomous agent workflows + trigger/guardrail config" },
    { name: "Memory & Context Architecture", decision: "How do I make AI remember everything I need it to?", artifact: "Knowledge base structure + retrieval system + update cadence" },
    { name: "Vibe Code Ideas to MVP", decision: "What can I build myself vs outsource?", artifact: "Working prototype + build-vs-hire decision matrix" },
  ],
  mindMake: [
    { name: "Build vs Buy vs Glue", decision: "Where is AI core vs commodity?", artifact: "Decision memo + investment table" },
    { name: "AI Pricing & Monetization", decision: "How does AI reshape revenue?", artifact: "Monetization framework + SKU structure" },
    { name: "The 3-Person Team Stack", decision: "What\u2019s the minimum AI stack to operate like a team of three?", artifact: "Deployed clone + agent suite + daily workflow documentation" },
    { name: "AI-Powered GTM", decision: "How do I generate leads without scaling headcount?", artifact: "Deployed lead-gen system + cost-per-lead model" },
  ],
};

const orchestratorSprintLibrary = {
  mindSet: [
    { name: "AI Landscape Compression", decision: "What actually matters in AI right now?", artifact: "AI relevance map + discard list" },
    { name: "Tool Commitment Philosophy", decision: "Which tools do I commit to vs experiment with?", artifact: "Tool hierarchy (Core / Tactical / Experimental)" },
    { name: "Personal AI Manifesto", decision: "What are my boundaries?", artifact: "1-page personal AI charter" },
    { name: "Executive AI Intelligence System", decision: "How do I stay sharp on AI without drowning in noise?", artifact: "Personal signal filter + weekly briefing structure + discard rules" },
  ],
  mindMap: [
    { name: "AI Operating Model", decision: "Who owns AI and how?", artifact: "Governance structure + RACI + operating cadence" },
    { name: "Strategic Data Prioritisation", decision: "What data is strategic?", artifact: "Investment sequencing + ownership logic" },
    { name: "AI Delegation Framework", decision: "What do I hand off to AI and what stays human?", artifact: "Delegation matrix + risk tiers + escalation triggers" },
    { name: "Communication Style Cloning", decision: "How do I get AI to write and speak like us?", artifact: "Brand voice profile + prompt templates + quality rubric" },
    { name: "Institutional Memory Design", decision: "How does our AI retain what the organisation knows?", artifact: "Knowledge architecture + ingestion plan + ownership model" },
    { name: "Vibe Code Culture Design", decision: "How do I identify and empower my top 10% AI builders?", artifact: "Builder identification criteria + MVP pipeline + innovation cadence" },
  ],
  mindMake: [
    { name: "Vendor Selection Without Regret", decision: "Which vendors do we commit to?", artifact: "Scorecard + shortlist + exit criteria" },
    { name: "12-Month AI Roadmap", decision: "What do we actually do next year?", artifact: "Quarterly milestones + board narrative" },
    { name: "Build vs Buy vs Glue", decision: "Where is AI core vs commodity?", artifact: "Decision memo + investment table" },
    { name: "AI Authority Blueprint", decision: "How do I lead AI conversations with confidence?", artifact: "Executive talking points + board Q&A prep + vendor negotiation playbook" },
    { name: "AI-Powered GTM Strategy", decision: "How do I do more with less before incumbents do it to me?", artifact: "GTM efficiency model + headcount-to-output benchmarks + competitive response plan" },
  ],
};

const fourWeekArc = [
  { week: 1, theme: "Relief", description: "Name the real decision. Not the vendor deck version." },
  { week: 2, theme: "Momentum", description: "Map every option. Trade-off analysis, no hand-waving." },
  { week: 3, theme: "Confidence", description: "Make the call. Document why. One-page decision memo." },
  { week: 4, theme: "Calm", description: "Board-ready. Walk in with answers, not anxiety." },
];

const ninetyDayArc = [
  { month: 1, phase: "MindSet", theme: "Clarity", description: "Filter noise, set boundaries, develop executive AI judgment." },
  { month: 2, phase: "MindMap", theme: "Leverage", description: "Build working systems that multiply what you're already good at." },
  { month: 3, phase: "MindMake", theme: "Direction", description: "Make high-stakes decisions. Set the roadmap. Brief the board." },
];

const PhaseIcon = ({ phase }: { phase: string }) => {
  if (phase === "mindSet") return <Target className="w-4 h-4" />;
  if (phase === "mindMap") return <Zap className="w-4 h-4" />;
  return <FileCheck className="w-4 h-4" />;
};

const SprintLibrarySection = ({ library, label }: { library: typeof builderSprintLibrary; label: string }) => (
  <div className="space-y-8">
    <h3 className="text-2xl font-bold">Decision Sprint Library</h3>
    <p className="text-muted-foreground text-sm">
      {label === "Builder"
        ? "Builder sprints turn you into a one-person product team. Vibe-code your own websites, ecommerce, and app prototypes. Deploy AI-powered GTM that generates leads without scaling headcount. Leave operating like a team of three."
        : "Orchestrator sprints give you leverage over AI-driven growth. Identify your top 10% builders and accelerate innovation. Deploy AI-powered GTM to do more with less before incumbents do it to you. Leave with the authority to direct it all."}
    </p>

    {(["mindSet", "mindMap", "mindMake"] as const).map((phase) => (
      <div key={phase}>
        <div className="flex items-center gap-2 mb-3">
          <PhaseIcon phase={phase} />
          <h4 className="text-sm font-bold uppercase tracking-wider text-ink dark:text-mint">
            {phase === "mindSet" ? "MindSet" : phase === "mindMap" ? "MindMap" : "MindMake"}
          </h4>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {library[phase].map((sprint, i) => (
            <motion.div
              key={i}
              className="p-4 rounded-xl border border-border/50 hover:border-ink/20 dark:hover:border-mint/20 transition-all hover:-translate-y-0.5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...spring, delay: i * 0.05 }}
            >
              <div className="font-semibold text-sm mb-1">{sprint.name}</div>
              <div className="text-xs text-muted-foreground mb-2">&ldquo;{sprint.decision}&rdquo;</div>
              <div className="text-[11px] text-ink/50 dark:text-white/40">
                Artifact: {sprint.artifact}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Sprints = () => {
  const [searchParams] = useSearchParams();
  const pathParam = searchParams.get("path");
  const initialTab: PathTab = pathParam === "orchestrate" ? "orchestrate" : "build";
  const [activeTab, setActiveTab] = useState<PathTab>(initialTab);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [bookingCommitment, setBookingCommitment] = useState<string | undefined>();

  const library = activeTab === "build" ? builderSprintLibrary : orchestratorSprintLibrary;

  const openBooking = (commitment: string) => {
    setBookingCommitment(commitment);
    setConsultModalOpen(true);
  };

  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <section className="pt-32 pb-16">
        <div className="container-width max-w-5xl">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
            >
              Let's do this.
            </motion.h1>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Pick your path. Pick your sprint. Make your decision.
            </motion.p>
          </div>

          {/* Tab switcher */}
          <div className="flex justify-center mb-16">
            <div className="inline-flex rounded-full border border-border/50 p-1 bg-ink/[0.03] dark:bg-white/[0.03]">
              {(["build", "orchestrate"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-8 py-3 rounded-full text-sm font-semibold transition-all ${
                    activeTab === tab
                      ? "bg-ink dark:bg-mint text-white dark:text-ink shadow-lg"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab === "build" ? "Builder" : "Orchestrator"}
                </button>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: activeTab === "build" ? -30 : 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeTab === "build" ? 30 : -30 }}
              transition={{ duration: 0.3 }}
              className="space-y-20"
            >
              {/* 4-Week Sprint */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">4-Week Decision Sprint</h2>
                  <p className="text-lg text-ink/60 dark:text-mint">
                    One decision. Four weeks. Board-ready.
                  </p>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    {activeTab === "build"
                      ? "Pick one nervous decision \u2014 tool commitment, AI clone design, your first agentic workflow \u2014 and resolve it with a working system and decision memo."
                      : "Pick one nervous decision \u2014 vendor selection, delegation framework, what your team hands off vs keeps \u2014 and resolve it with a defensible trade-off analysis and board memo."}
                  </p>
                </div>

                {/* Emotional arc */}
                <div className="grid sm:grid-cols-4 gap-4 mb-8">
                  {fourWeekArc.map((week, i) => (
                    <motion.div
                      key={week.week}
                      className="p-5 rounded-xl border border-border/50 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...spring, delay: i * 0.1 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-ink/10 dark:bg-mint/20 flex items-center justify-center mx-auto mb-3 text-sm font-bold text-ink dark:text-mint">
                        {week.week}
                      </div>
                      <div className="font-bold mb-1">{week.theme}</div>
                      <div className="text-xs text-muted-foreground">{week.description}</div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold px-10 py-6 text-base"
                  onClick={() => openBooking("4wk")}
                >
                  Start 4-Week Sprint <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* 90-Day Sprint */}
              <div>
                <div className="mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">90-Day Concierge Sprint</h2>
                  <p className="text-lg text-ink/60 dark:text-mint">
                    The full journey. MindSet &rarr; MindMap &rarr; MindMake.
                  </p>
                  <p className="text-muted-foreground mt-2 max-w-2xl">
                    {activeTab === "build"
                      ? "Build your AI clone, deploy agentic workflows, design your memory systems \u2014 and leave operating like a 3-person team with a Builder Dossier and 12-month roadmap."
                      : "Set your delegation framework, clone your communication standards into AI, build institutional memory \u2014 and leave with a board-ready 12-month roadmap and the authority to direct it."}
                  </p>
                </div>

                {/* 3-month arc */}
                <div className="grid sm:grid-cols-3 gap-4 mb-8">
                  {ninetyDayArc.map((month, i) => (
                    <motion.div
                      key={month.month}
                      className="p-6 rounded-xl border border-border/50"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ ...spring, delay: i * 0.1 }}
                    >
                      <div className="text-xs font-bold uppercase tracking-wider text-ink dark:text-mint mb-2">
                        Month {month.month} &mdash; {month.phase}
                      </div>
                      <div className="text-xl font-bold mb-2">{month.theme}</div>
                      <div className="text-sm text-muted-foreground">{month.description}</div>
                    </motion.div>
                  ))}
                </div>

                <Button
                  size="lg"
                  className="bg-ink dark:bg-mint text-white dark:text-ink hover:opacity-90 font-bold px-10 py-6 text-base"
                  onClick={() => openBooking("90d")}
                >
                  Start 90-Day Sprint <ArrowRight className="ml-2 w-5 h-5" />
                </Button>

                {/* Extended sprint mention */}
                <p className="text-xs text-muted-foreground mt-4">
                  Some leaders extend to 6 months for ongoing support as they scale. We'll discuss if relevant.
                </p>
              </div>

              {/* Divider */}
              <div className="border-t border-border/30" />

              {/* Sprint Library */}
              <SprintLibrarySection
                library={library}
                label={activeTab === "build" ? "Builder" : "Orchestrator"}
              />

              {/* Final CTA */}
              <motion.div
                className="text-center p-12 rounded-2xl border border-border/50 bg-ink/[0.02] dark:bg-white/[0.02]"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={spring}
              >
                <h2 className="text-3xl font-bold mb-3">What's your nervous decision?</h2>
                <p className="text-muted-foreground mb-6">
                  The first conversation is free. No prep required.
                </p>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold px-12 py-6 text-lg shadow-lg shadow-mint/20"
                  onClick={() => {
                    setBookingCommitment(undefined);
                    setConsultModalOpen(true);
                  }}
                >
                  Start the Conversation <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <Footer />

      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        pathType={activeTab}
        commitmentLevel={bookingCommitment}
      />
    </main>
  );
};

export default Sprints;
