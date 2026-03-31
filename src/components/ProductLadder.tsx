import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { InitialConsultModal } from "@/components/InitialConsultModal";

interface SprintOffering {
  name: string;
  tagline: string;
  duration: string;
  description: string;
  outcomes: string[];
  examples: string[];
  cta: string;
  route: string;
  intensity: string;
  commitment: string;
}

const offerings: SprintOffering[] = [
  {
    name: "4-Week Sprint",
    tagline: "One decision. Four weeks. Board-ready.",
    duration: "4 weeks",
    description:
      "You have a nervous decision about AI. We help you make it with confidence. Week 1: clarity. Week 2: options. Week 3: decision. Week 4: board-ready memo.",
    outcomes: [
      "One clear, defensible decision",
      "Trade-off analysis you can explain",
      "Board-ready decision memo",
      "ROI framework to measure success",
    ],
    examples: [
      "Which vendors do we commit to?",
      "What should I build vs buy?",
      "How do I multiply my strongest edge?",
      "What's my AI boundary?",
    ],
    cta: "Start 4-Week Sprint",
    route: "/sprint/4-week",
    intensity: "Focused",
    commitment: "4wk",
  },
  {
    name: "90-Day Sprint",
    tagline: "The full journey. Mind Set \u2192 Mind Map \u2192 Mind Make.",
    duration: "90 days",
    description:
      "Three decisions. Three months. Complete direction from AI chaos to calm. Month 1: Mind Set (clarity). Month 2: Mind Map (systems). Month 3: Mind Make (deployment).",
    outcomes: [
      "3-5 deployed AI systems",
      "2-3 strategic decisions resolved",
      "12-month roadmap with clear gates",
      "Board-level confidence on AI",
    ],
    examples: [
      "Full AI governance framework",
      "Multiple working systems deployed",
      "Team alignment on AI standards",
      "Vendor landscape clarity",
    ],
    cta: "Start 90-Day Sprint",
    route: "/sprint/90-day",
    intensity: "Deep",
    commitment: "90d",
  },
];

const SprintCard = ({
  offering,
  onBook,
}: {
  offering: SprintOffering;
  onBook: () => void;
}) => {
  const navigate = useNavigate();
  const { name, tagline, duration, description, outcomes, examples, cta, route } = offering;

  return (
    <div className="glass-card p-8 hover:border-mint/40 transition-all flex flex-col">
      <div className="mb-6">
        <h3 className="text-3xl font-bold mb-2">{name}</h3>
        <p className="text-xl text-mint-dark dark:text-mint">{tagline}</p>
        <p className="text-sm text-muted-foreground mt-2">{duration}</p>
      </div>

      <p className="text-lg mb-6">{description}</p>

      <div className="mb-6">
        <h4 className="font-semibold mb-3">What You Get:</h4>
        <ul className="space-y-2">
          {outcomes.map((outcome, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle className="w-5 h-5 text-mint-dark dark:text-mint shrink-0 mt-0.5" />
              <span>{outcome}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h4 className="font-semibold mb-3">Example Nervous Decisions:</h4>
        <div className="space-y-1 text-sm text-muted-foreground">
          {examples.map((ex, i) => (
            <div key={i}>&ldquo; {ex}</div>
          ))}
        </div>
      </div>

      <div className="mt-auto flex flex-col gap-2">
        <Button
          size="lg"
          className="w-full bg-mint text-ink hover:bg-mint/90"
          onClick={onBook}
        >
          {cta}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-muted-foreground hover:text-foreground"
          onClick={() => navigate(route)}
        >
          Learn more <ArrowRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
};

const ProductLadder = () => {
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [bookingCommitment, setBookingCommitment] = useState<string | undefined>();

  const handleBook = (commitment: string) => {
    setBookingCommitment(commitment);
    setConsultModalOpen(true);
  };

  return (
    <section id="products" className="section-padding bg-background">
      <div className="container-width">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Choose Your Sprint
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            One nervous decision or a full AI direction overhaul. Pick the sprint that fits.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {offerings.map((offering) => (
            <SprintCard
              key={offering.name}
              offering={offering}
              onBook={() => handleBook(offering.commitment)}
            />
          ))}
        </div>

        {/* What Comes Next */}
        <div className="text-center mt-16 p-8 glass-card max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold mb-4">What Comes Next</h3>
          <p className="text-muted-foreground mb-4">
            After your sprint, some leaders bring their teams through the{" "}
            <strong>Leadership Lab</strong> to build shared AI decision
            frameworks. Others engage as <strong>Portfolio Partners</strong> for
            ongoing strategic support.
          </p>
          <p className="text-sm text-muted-foreground">
            These aren't public products. We'll discuss them if relevant after
            your sprint.
          </p>
        </div>

        {/* Fallback CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Not sure which sprint? Start with a conversation.
          </p>
          <Button
            size="lg"
            className="bg-mint text-ink hover:bg-mint/90 font-semibold px-8 py-6 text-lg"
            onClick={() => setConsultModalOpen(true)}
          >
            What's your nervous decision?
          </Button>
        </div>
      </div>

      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        commitmentLevel={bookingCommitment}
      />
    </section>
  );
};

export default ProductLadder;
