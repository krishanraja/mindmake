import { useState, useEffect } from "react";
import { Sparkles, ChevronLeft, Calendar, MessageCircle, User, Lightbulb, Map, TrendingUp, Mic } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { ChatPanel } from "@/components/ChatBot/ChatPanel";
import { cn } from "@/lib/utils";
import krishHeadshot from "@/assets/krish-headshot.png";

type DialogType = 'quiz' | 'decision' | 'friction' | 'portfolio' | null;

interface ActionsHubProps {
  onToolClick: (toolId: DialogType) => void;
}

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  compact?: boolean;
}

const ToolCard = ({ icon, title, subtitle, onClick, compact }: ToolCardProps) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center rounded-xl bg-muted/50 hover:bg-muted border border-border/50 hover:border-mint/30 transition-all duration-200 text-left group w-full",
      compact ? "gap-2 p-3" : "gap-3 p-4"
    )}
  >
    <div className={cn(
      "rounded-lg bg-gradient-to-br from-mint/20 to-mint/5 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform",
      compact ? "w-8 h-8" : "w-10 h-10"
    )}>
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <h4 className={cn("font-semibold leading-tight", compact ? "text-xs" : "text-sm")}>{title}</h4>
      {!compact && <p className="text-xs text-muted-foreground">{subtitle}</p>}
    </div>
  </button>
);

export const ActionsHub = ({ onToolClick }: ActionsHubProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleOpenHub = () => setIsOpen(true);
    window.addEventListener('openActionsHub', handleOpenHub);
    return () => window.removeEventListener('openActionsHub', handleOpenHub);
  }, []);

  const tools = [
    {
      id: 'quiz' as const,
      icon: <User className="w-5 h-5 text-mint-dark" />,
      title: "Builder Profile Quiz",
      subtitle: "60-sec assessment"
    },
    {
      id: 'decision' as const,
      icon: <Lightbulb className="w-5 h-5 text-mint-dark" />,
      title: "AI Decision Helper",
      subtitle: "Instant clarity"
    },
    {
      id: 'friction' as const,
      icon: <Map className="w-5 h-5 text-mint-dark" />,
      title: "Friction Map Builder",
      subtitle: "Map your time sink"
    },
    {
      id: 'portfolio' as const,
      icon: <TrendingUp className="w-5 h-5 text-mint-dark" />,
      title: "AI Portfolio Builder",
      subtitle: "Your roadmap"
    }
  ];

  const handleToolClick = (toolId: DialogType) => {
    onToolClick(toolId);
    setIsOpen(false);
  };

  const handleBookSession = () => {
    setConsultModalOpen(true);
    setIsOpen(false);
  };

  const handleOpenChat = () => {
    setChatOpen(true);
    setIsOpen(false);
  };

  const drawerContent = (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className={cn("flex items-center justify-between px-5 border-b border-border/50", isMobile ? "pt-4 pb-3" : "pt-6 pb-4")}>
        <h2 className="font-bold text-base tracking-wide text-foreground">Actions</h2>
      </div>

      {/* Content */}
      <div className={cn("flex-1 overflow-y-auto px-5", isMobile ? "py-4 space-y-5" : "py-6 space-y-8")}>
        {/* PRIMARY CTA - Book Session */}
        <section>
          <button
            onClick={handleBookSession}
            className={cn("w-full relative overflow-hidden rounded-2xl bg-gradient-to-br from-mint to-mint-dark text-left group transition-all duration-300 hover:shadow-lg hover:shadow-mint/20 hover:scale-[1.02]", isMobile ? "p-4" : "p-5")}
          >
            {/* Decorative glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
            
            <div className="relative z-10 flex items-center gap-4">
              <div className={cn("rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm", isMobile ? "w-10 h-10" : "w-12 h-12")}>
                <Calendar className="w-6 h-6 text-ink" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-ink text-lg">Book Your Session</h3>
                <p className="text-ink/70 text-sm">Start your AI leadership journey</p>
              </div>
              <ChevronLeft className="w-5 h-5 text-ink/50 rotate-180 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </section>

        {/* AI TOOLS Section */}
        <section>
          <div className={cn("flex items-center gap-2", isMobile ? "mb-3" : "mb-4")}>
            <Sparkles className="w-4 h-4 text-mint" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground leading-none">Decision Tools</h3>
            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-mint/10 border border-mint/20 ml-auto">
              <Mic className="w-2.5 h-2.5 text-mint" />
              <span className="text-[9px] font-medium text-mint-dark">Voice</span>
            </div>
          </div>
          <div className={cn("grid", isMobile ? "grid-cols-2 gap-2" : "grid-cols-1 gap-3")}>
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                icon={tool.icon}
                title={tool.title}
                subtitle={tool.subtitle}
                onClick={() => handleToolClick(tool.id)}
                compact={isMobile}
              />
            ))}
          </div>
          <a
            href="/leaders"
            className={cn("block text-center text-xs text-muted-foreground hover:text-mint transition-colors", isMobile ? "mt-3" : "mt-4")}
            onClick={() => setIsOpen(false)}
          >
            Want the full diagnostic? Take the Decision Readiness Diagnostic &rarr;
          </a>
        </section>

        {/* CHAT Section */}
        <section>
          <div className={cn("flex items-center gap-2", isMobile ? "mb-3" : "mb-4")}>
            <MessageCircle className="w-4 h-4 text-mint" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Ask Mindmaker</h3>
          </div>
          <button
            onClick={handleOpenChat}
            className={cn("w-full flex items-center rounded-xl bg-ink dark:bg-card border-2 border-ink/10 dark:border-mint/20 hover:border-mint/40 transition-all duration-200 group", isMobile ? "gap-3 p-3" : "gap-4 p-4")}
          >
            <Avatar className={cn("border-2 border-mint/30 group-hover:border-mint/50 transition-colors", isMobile ? "h-10 w-10" : "h-12 w-12")}>
              <AvatarImage src={krishHeadshot} alt="Krish" />
              <AvatarFallback>K</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left">
              <h4 className="font-semibold text-white dark:text-foreground">Ask me anything</h4>
              <p className="text-sm text-white/60 dark:text-muted-foreground">AI strategy questions answered</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-mint animate-pulse" />
          </button>
        </section>
      </div>
    </div>
  );

  return (
    <>
      {/* Trigger — Mobile: avatar circle bottom-right, Desktop: avatar tab right edge */}
      {isMobile ? (
        <motion.button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-[60] bottom-6 right-4 h-14 w-14",
            isOpen && "opacity-0 pointer-events-none"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          aria-label="Get in touch"
        >
          {/* Sonar rings */}
          <span className="absolute inset-0 rounded-full border-2 border-mint/40 animate-sonar-ping" />
          <span
            className="absolute inset-0 rounded-full border-2 border-mint/30 animate-sonar-ping"
            style={{ animationDelay: "1s" }}
          />

          {/* Avatar button */}
          <div className="relative h-14 w-14 rounded-full shadow-lg bg-ink border-2 border-mint/30 flex items-center justify-center chat-fab-animated overflow-hidden">
            <Avatar className="h-11 w-11 border-0">
              <AvatarImage src={krishHeadshot} alt="Get in touch" loading="eager" />
              <AvatarFallback className="bg-mint/20 text-mint font-bold">K</AvatarFallback>
            </Avatar>

            {/* Chat bubble overlay — bottom-right of avatar */}
            <div className="absolute -bottom-0.5 -right-0.5 h-5 w-5 rounded-full bg-mint flex items-center justify-center shadow-md">
              <MessageCircle className="w-3 h-3 text-ink" />
            </div>
          </div>
        </motion.button>
      ) : (
        <motion.button
          onClick={() => setIsOpen(true)}
          className={cn(
            "fixed z-[60] right-0 top-1/2 -translate-y-1/2 w-14 rounded-l-2xl border-l border-t border-b border-mint/20",
            "bg-gradient-to-b from-ink/95 to-ink",
            "shadow-lg shadow-ink/30",
            "flex flex-col items-center justify-center gap-2 py-4",
            "transition-all duration-300",
            "hover:shadow-xl hover:shadow-mint/20 hover:border-mint/40 hover:w-16",
            "group",
            isOpen && "opacity-0 pointer-events-none"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: isOpen ? 0 : 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          aria-label="Get in touch"
          title="Get in touch"
        >
          {/* Pulse indicator */}
          <span className="absolute flex h-2.5 w-2.5 -left-1 top-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-mint opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-mint"></span>
          </span>

          <Avatar className="h-8 w-8 border-2 border-mint/30 group-hover:border-mint/60 transition-colors">
            <AvatarImage src={krishHeadshot} alt="Get in touch" loading="eager" />
            <AvatarFallback className="bg-mint/20 text-mint text-xs font-bold">K</AvatarFallback>
          </Avatar>
          <MessageCircle className="w-4 h-4 text-mint group-hover:scale-110 transition-transform" />
        </motion.button>
      )}

      {/* Drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={cn(
            "p-0 flex flex-col",
            isMobile 
              ? "h-[80vh] rounded-t-3xl pt-2 pb-safe-area-bottom" 
              : "w-full sm:max-w-[400px] sheet-navbar-aware"
          )}
        >
          {drawerContent}
        </SheetContent>
      </Sheet>

      {/* Book Session Modal */}
      <InitialConsultModal 
        open={consultModalOpen} 
        onOpenChange={setConsultModalOpen}
      />

      {/* Chat Panel */}
      {chatOpen && (
        <ChatPanel onClose={() => setChatOpen(false)} />
      )}
    </>
  );
};
