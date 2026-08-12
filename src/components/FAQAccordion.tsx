import { useState } from "react";
import { Search, ChevronDown, Lightbulb, Users, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface FAQItem {
  question: string;
  answer: string;
  category: "the-sprint" | "fit" | "getting-started";
}

export const faqItems: FAQItem[] = [
  {
    category: "getting-started",
    question: "What is Mindmaker?",
    answer:
      "Mindmaker helps business leaders make hard calls as AI changes their market. The work can cover products, prices, sales plans and how a team is set up.",
  },
  {
    category: "getting-started",
    question: "Who is this for?",
    answer:
      "It is for a leader who owns an important business result. You may feel that new rivals are moving faster, or that your own growth is stuck because your product, price, message or team no longer fits the market.",
  },
  {
    category: "getting-started",
    question: "How do I start?",
    answer:
      "Book a 15-minute fit call. Bring the problem as you see it today. You do not need a finished brief. Krish will tell you if a Sprint is the right next step.",
  },
  {
    category: "the-sprint",
    question: "What is the 21-day Sprint?",
    answer:
      "It is focused work on one important business problem. Over 21 days, Krish finds what is really causing it, tests the strongest options and helps your team start the right action.",
  },
  {
    category: "the-sprint",
    question: "What happens during the Sprint?",
    answer:
      "Krish studies the business, speaks with the right people and checks outside facts. He separates facts from guesses, shows what each cause adds to the problem and works with you on the first real step.",
  },
  {
    category: "the-sprint",
    question: "What do we keep at the end?",
    answer:
      "You keep a clear decision record, the evidence behind it and the work started during the Sprint. This lives in a CTRL space so your team can keep using it after Krish leaves.",
  },
  {
    category: "fit",
    question: "How is this different from an AI automation consultant?",
    answer:
      "The goal is not to automate a list of small tasks. Krish protects the expertise, judgement and taste already in your business, then uses AI to make it more useful. The aim is a better business decision and a team that can carry it on.",
  },
  {
    category: "fit",
    question: "Do we need to know the answer before we call?",
    answer:
      "No. An unclear problem is a valid place to start. Krish uses careful questions and outside evidence to find the real decision underneath it.",
  },
  {
    category: "fit",
    question: "Do I need to be technical?",
    answer:
      "No. The work is built for business leaders. Technical detail is used only when it helps you make or carry out the decision.",
  },
  {
    category: "getting-started",
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
  "the-sprint": {
    label: "The Sprint",
    icon: Users,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-900/30",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  fit: {
    label: "Is it a fit?",
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
