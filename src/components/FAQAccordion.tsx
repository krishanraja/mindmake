import { useState } from "react";
import { Search, ChevronDown, Lightbulb, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
  category: "programs" | "ai-literacy" | "getting-started";
}

export const faqItems: FAQItem[] = [
  {
    category: "getting-started",
    question: "What is Mindmaker?",
    answer:
      "Mindmaker turns non-technical leaders into no-code AI builders. We help CEOs, GMs, and executives build working AI systems around their real work, without writing code or waiting for IT.",
  },
  {
    category: "getting-started",
    question: "Who is this for?",
    answer:
      "CEO, GM, CCO, CPO, CMO, CRO, COO. Leaders with P&L responsibility who need to design the future, not delegate it. If you're tired of vendor theatre and want to build real systems, this is for you.",
  },
  {
    category: "getting-started",
    question: "How do I start?",
    answer:
      "Start with the 4-Week Decision Sprint. Bring one real problem, leave with systems. From there, you can dive into the 90-Day Concierge Sprint for deeper work. No pressure, just clarity.",
  },
  {
    category: "programs",
    question: "What's the 4-Week Decision Sprint?",
    answer:
      "A 4-week program where you bring one nervous decision about AI. Week 1: clarity on what actually matters. Week 2: options and trade-offs. Week 3: you make the call. Week 4: board-ready decision memo. You leave with a defensible decision and ROI framework.",
  },
  {
    category: "programs",
    question: "What's the 90-Day Concierge Sprint?",
    answer:
      "A 90-day program for senior leaders: Mind Set (Month 1), Mind Map (Month 2), Mind Make (Month 3). You build 3-5 deployed AI systems, resolve 2-3 strategic decisions, and leave with a 12-month roadmap and Builder Dossier.",
  },
  {
    category: "programs",
    question: "How is the Mindmaker Sprint for teams different?",
    answer:
      "Mindmaker Sprints for teams bring executive groups of 6-12 through the same framework in an intensive format. You run real decisions through a new AI-enabled way of working and leave with a 90-day pilot charter to implement across your team.",
  },
  {
    category: "ai-literacy",
    question: "How is this different from AI training?",
    answer:
      "Training fades. Consulting tells you what to do. Tools do it for you. We build the system with you so you can think for yourself: design systems, run decisions, and stop wasting money on vendor theatre.",
  },
  {
    category: "ai-literacy",
    question: "What do I actually get?",
    answer:
      "Working systems you can use tomorrow. Not slides, not theory. Prompts, workflows, and frameworks built around your real work. Each engagement includes concrete deliverables you can implement immediately.",
  },
  {
    category: "ai-literacy",
    question: "I'm not technical. Is this for me?",
    answer:
      "Absolutely. This is designed specifically for non-technical leaders. You won't write code. You'll learn to think with AI, not program it. The Four Modes framework makes AI accessible to anyone.",
  },
  {
    category: "ai-literacy",
    question: "What's Mindmaker LIVE?",
    answer:
      "Mindmaker LIVE is the publication: what's actually working in real portfolios, not vendor hype. Two formats. Paid follows the money on a shift and asks who pays. Built is conversations with people who have really built something with AI. Read it at live.themindmaker.ai.",
  },
];

export const categoryConfig = {
  "getting-started": {
    label: "Getting Started",
    icon: Rocket,
    color: "text-mint-dark dark:text-mint",
    bgColor: "bg-mint/10",
    borderColor: "border-mint/30",
  },
  programs: {
    label: "Programs",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  "ai-literacy": {
    label: "AI Literacy",
    icon: Lightbulb,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "bg-purple-100 dark:bg-purple-900/30",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
} as const;

export const FAQAccordion = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const filteredFaqs = faqItems.filter((item) => {
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    const matchesSearch =
      !searchQuery ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleItem = (index: number) => {
    const next = new Set(expandedItems);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setExpandedItems(next);
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search questions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === null ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(null)}
          >
            All
          </Button>
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <Button
                key={key}
                variant={selectedCategory === key ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="gap-1.5"
              >
                <Icon className="h-3.5 w-3.5" />
                {config.label}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="max-w-4xl">
        {filteredFaqs.length > 0 ? (
          <div className="space-y-4">
            {filteredFaqs.map((item, index) => {
              const config = categoryConfig[item.category];
              const isExpanded = expandedItems.has(index);

              return (
                <div
                  key={index}
                  className={cn(
                    "border rounded-xl overflow-hidden transition-all duration-300",
                    isExpanded
                      ? "border-mint/50 shadow-lg shadow-mint/5 bg-card"
                      : "border-border bg-card hover:border-mint/30",
                  )}
                  style={{ animationDelay: `${index * 0.03}s` }}
                >
                  <button
                    onClick={() => toggleItem(index)}
                    className="w-full flex items-start gap-4 p-6 text-left group"
                  >
                    <div className={cn("shrink-0 p-2 rounded-lg transition-colors", config.bgColor)}>
                      <config.icon className={cn("h-4 w-4", config.color)} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <span
                        className={cn(
                          "text-[10px] font-medium uppercase tracking-wider mb-1 block",
                          config.color,
                        )}
                      >
                        {config.label}
                      </span>
                      <h3 className="font-semibold text-foreground group-hover:text-mint transition-colors pr-8">
                        {item.question}
                      </h3>
                    </div>

                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300",
                        isExpanded && "rotate-180",
                      )}
                    />
                  </button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300",
                      isExpanded ? "max-h-96" : "max-h-0",
                    )}
                  >
                    <div className="px-6 pb-6 pt-0 pl-[4.5rem]">
                      <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No questions found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search or filters</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory(null);
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
