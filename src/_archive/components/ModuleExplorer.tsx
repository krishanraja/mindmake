import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, LucideIcon } from "lucide-react";
import * as Icons from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

interface Module {
  id: number;
  level: "Start Here" | "Intermediate" | "Expert";
  category: "Leadership" | "Implementation";
  title: string;
  description: string;
  credits: number;
  icon: string;
  contexts: ("individual" | "team" | "portfolio")[];
}

interface ModuleExplorerProps {
  context: "individual" | "team" | "portfolio";
}

const modules: Module[] = [
  // Start Here
  { 
    id: 1, 
    level: "Start Here", 
    category: "Leadership", 
    title: "Align Leaders", 
    description: "Exec Team primer on AI literacy, market shifts, and how media leaders are preparing for 2030", 
    credits: 15, 
    icon: "Users", 
    contexts: ["team", "portfolio"] 
  },
  { 
    id: 2, 
    level: "Start Here", 
    category: "Leadership", 
    title: "Inspire Staff", 
    description: "All Hands keynote on the future of work & principles to thrive", 
    credits: 10, 
    icon: "MessageSquare", 
    contexts: ["team", "portfolio"] 
  },
  { 
    id: 3, 
    level: "Start Here", 
    category: "Leadership", 
    title: "Product Strategy", 
    description: "Map AI capabilities to your product roadmap or new revenue lines", 
    credits: 25, 
    icon: "Target", 
    contexts: ["individual", "team", "portfolio"] 
  },
  { 
    id: 4, 
    level: "Start Here", 
    category: "Implementation", 
    title: "Agent Opp Spotter", 
    description: "Workflow redesign jam: spot agent opportunities", 
    credits: 5, 
    icon: "Search", 
    contexts: ["individual", "team", "portfolio"]
  },
  
  // Intermediate
  { 
    id: 5, 
    level: "Intermediate", 
    category: "Leadership", 
    title: "Formalize Ops", 
    description: "Produce & train an internal AI usage playbook", 
    credits: 20, 
    icon: "Settings", 
    contexts: ["individual", "team", "portfolio"] 
  },
  { 
    id: 6, 
    level: "Intermediate", 
    category: "Implementation", 
    title: "Get Building", 
    description: "Deep dive: build a lightweight tool with one team and track KPIs", 
    credits: 20, 
    icon: "Hammer", 
    contexts: ["individual", "portfolio"] 
  },
  { 
    id: 7, 
    level: "Intermediate", 
    category: "Implementation", 
    title: "Coach the Coaches", 
    description: "1-1 coaching for power users to scale literacy", 
    credits: 20, 
    icon: "UserPlus", 
    contexts: ["team", "portfolio"] 
  },
  { 
    id: 8, 
    level: "Intermediate", 
    category: "Implementation", 
    title: "Gamify Learning", 
    description: "Mini-lessons + scorecards delivered via email/newsletter", 
    credits: 15, 
    icon: "Gamepad2", 
    contexts: ["team", "portfolio"]
  },
  
  // Expert
  { 
    id: 9, 
    level: "Expert", 
    category: "Implementation", 
    title: "Workflow Redesign Mastery", 
    description: "Advanced process redesign with AI-first thinking", 
    credits: 25, 
    icon: "Workflow", 
    contexts: ["individual", "portfolio"] 
  },
  { 
    id: 10, 
    level: "Expert", 
    category: "Implementation", 
    title: "Competitive Intel Bootcamp", 
    description: "Transform market research using AI", 
    credits: 40, 
    icon: "TrendingUp", 
    contexts: ["individual", "team", "portfolio"] 
  },
  { 
    id: 11, 
    level: "Expert", 
    category: "Leadership", 
    title: "Internal Champion Dev", 
    description: "Build a network of AI champions across the org", 
    credits: 45, 
    icon: "Award", 
    contexts: ["team", "portfolio"] 
  },
  { 
    id: 12, 
    level: "Expert", 
    category: "Implementation", 
    title: "AI Content Strategy", 
    description: "Create systematic AI-driven content workflows", 
    credits: 20, 
    icon: "FileText", 
    contexts: ["individual", "portfolio"]
  },
];

const getLevelStyles = (level: Module["level"]) => {
  switch (level) {
    case "Start Here":
      return "bg-mint/10 text-mint-dark border-mint/20";
    case "Intermediate":
      return "bg-ink/20 text-ink dark:text-foreground border-ink/30";
    case "Expert":
      return "bg-ink/40 text-white border-ink/50";
  }
};

export const ModuleExplorer = ({ context }: ModuleExplorerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const filteredModules = modules.filter(module => 
    module.contexts.includes(context)
  );

  return (
    <div className="mb-12">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full group">
          <div className="minimal-card hover:border-mint/30 transition-colors cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Visual hint of stacked cards */}
                <div className="relative w-8 h-8 flex-shrink-0">
                  <div className="absolute inset-0 bg-mint/20 border border-mint/30 rounded" style={{ transform: 'translate(4px, 4px)' }} />
                  <div className="absolute inset-0 bg-mint/20 border border-mint/30 rounded" style={{ transform: 'translate(2px, 2px)' }} />
                  <div className="absolute inset-0 bg-mint/30 border border-mint rounded" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-mint transition-colors">
                    See where this could go
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {filteredModules.length} optional add-on modules
                  </p>
                </div>
              </div>
              <ChevronDown 
                className={cn(
                  "h-5 w-5 text-muted-foreground transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
              />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <AnimatePresence>
            {isOpen && (
              <div className="mt-6">
                {/* Desktop: Grid */}
                <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredModules.map((module, index) => (
                    <ModuleCard 
                      key={module.id} 
                      module={module} 
                      index={index}
                    />
                  ))}
                </div>

                {/* Mobile: Horizontal Scroll */}
                <div className="md:hidden overflow-x-auto -mx-4 px-4">
                  <div className="flex gap-4 pb-4" style={{ scrollSnapType: 'x mandatory' }}>
                    {filteredModules.map((module, index) => (
                      <div 
                        key={module.id} 
                        className="flex-shrink-0 w-[85vw]"
                        style={{ scrollSnapAlign: 'start' }}
                      >
                        <ModuleCard module={module} index={index} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

interface ModuleCardProps {
  module: Module;
  index: number;
}

const ModuleCard = ({ module, index }: ModuleCardProps) => {
  const IconComponent = (Icons as any)[module.icon] as LucideIcon | undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.3 }}
      className="h-full"
    >
      <div className="border border-border rounded-lg p-4 bg-card hover:border-mint/50 transition-colors h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className={cn(
            "text-xs font-bold px-2 py-1 rounded border",
            getLevelStyles(module.level)
          )}>
            {module.level}
          </div>
          {IconComponent && (
            <IconComponent className="h-5 w-5 text-mint flex-shrink-0" />
          )}
        </div>

        {/* Title */}
        <h4 className="font-bold text-sm mb-2 text-foreground line-clamp-2">
          {module.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 flex-grow">
          {module.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border mt-auto">
          <span className="text-xs text-muted-foreground font-medium">
            {module.category}
          </span>
          <span className="text-xs font-bold text-mint">
            {module.credits} credits
          </span>
        </div>
      </div>
    </motion.div>
  );
};
