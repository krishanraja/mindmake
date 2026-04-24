import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import type { OrgNodeData } from "./orgChartData";

interface DecisionPromptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: OrgNodeData | null;
}

const KindBadge = ({ kind }: { kind: OrgNodeData["kind"] }) => {
  const styles =
    kind === "human"
      ? "bg-ink/10 text-ink dark:bg-white/10 dark:text-white border border-border"
      : kind === "agent"
      ? "bg-mint/15 text-mint-dark dark:text-mint border border-mint/30"
      : "bg-gradient-to-r from-ink/10 to-mint/15 text-foreground border border-mint/30";
  const label = kind === "human" ? "Human" : kind === "agent" ? "Agent" : "Hybrid";
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] ${styles}`}>
      {label}
    </span>
  );
};

const PromptBody = ({ data }: { data: OrgNodeData }) => {
  const { decisionPrompt, featured } = data;
  if (!decisionPrompt) return null;
  const paragraphs = decisionPrompt.body.split(/\n\n+/);

  return (
    <div className="flex flex-col gap-6 pt-2">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center gap-2 flex-wrap"
      >
        <KindBadge kind={data.kind} />
        {featured && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] bg-mint text-ink">
            <Star className="w-3 h-3" />
            Featured
          </span>
        )}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.4 }}
        className="text-2xl md:text-3xl font-bold leading-tight"
      >
        {decisionPrompt.headline}
      </motion.h2>

      <div className="flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.15, duration: 0.4 }}
            className="text-muted-foreground leading-relaxed"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {decisionPrompt.decisionBody && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + paragraphs.length * 0.15, duration: 0.4 }}
          className="pt-4 border-t border-border/60"
        >
          <div className="relative inline-block mb-3">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-mint-dark dark:text-mint">
              {decisionPrompt.decisionLabel ?? "Decision you'd face"}
            </span>
            <motion.span
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5 + paragraphs.length * 0.15, duration: 0.5 }}
              style={{ originX: 0 }}
              className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-mint"
            />
          </div>
          <p className="text-foreground leading-relaxed">{decisionPrompt.decisionBody}</p>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 + paragraphs.length * 0.15, duration: 0.4 }}
        className="pt-2"
      >
        <Button
          asChild
          className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
        >
          <a href="/cohort">
            Work through decisions like this in the Cohort
            <ArrowRight className="ml-2 w-4 h-4" />
          </a>
        </Button>
      </motion.div>
    </div>
  );
};

export const DecisionPromptSheet = ({ open, onOpenChange, data }: DecisionPromptSheetProps) => {
  const isMobile = useIsMobile();

  if (!data) return null;

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 flex flex-col max-h-[85dvh]">
          <DrawerHeader className="sr-only">
            <DrawerTitle>{data.decisionPrompt?.headline ?? data.label}</DrawerTitle>
            <DrawerDescription>Role details</DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 min-h-0 overflow-y-auto pb-6">
            <PromptBody data={data} />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="sm:max-w-lg w-full overflow-y-auto"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>{data.decisionPrompt?.headline ?? data.label}</SheetTitle>
          <SheetDescription>Role details</SheetDescription>
        </SheetHeader>
        <PromptBody data={data} />
      </SheetContent>
    </Sheet>
  );
};
