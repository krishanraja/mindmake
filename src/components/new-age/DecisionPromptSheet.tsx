import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { motion, useReducedMotion } from "framer-motion";
import type { OrgNodeData } from "./orgChartData";

interface DecisionPromptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: OrgNodeData | null;
  onStart: () => void;
}

const PromptBody = ({ data, onStart }: { data: OrgNodeData; onStart: () => void }) => {
  const { decisionPrompt } = data;
  const reduceMotion = useReducedMotion();
  if (!decisionPrompt) return null;
  const paragraphs = decisionPrompt.body.split(/\n\n+/);
  const kindLabel = data.kind === "human" ? "Human" : data.kind === "agent" ? "AI agent" : "Person and AI working together";

  return (
    <div className="flex flex-col gap-6 pt-2">
      <p className="sr-only">Role type: {kindLabel}.</p>

      <motion.h2
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.05, duration: 0.4 }}
        className="text-2xl md:text-3xl font-bold leading-tight"
      >
        {decisionPrompt.headline}
      </motion.h2>

      <div className="flex flex-col gap-4">
        {paragraphs.map((p, i) => (
          <motion.p
            key={i}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={reduceMotion ? { duration: 0 } : { delay: 0.15 + i * 0.15, duration: 0.4 }}
            className="text-muted-foreground leading-relaxed"
          >
            {p}
          </motion.p>
        ))}
      </div>

      {decisionPrompt.decisionBody && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={reduceMotion ? { duration: 0 } : { delay: 0.15 + paragraphs.length * 0.15, duration: 0.4 }}
          className="pt-4 border-t border-border/60"
          role="group"
          aria-label={decisionPrompt.decisionLabel ?? "A useful question"}
        >
          <p className="text-foreground leading-relaxed">{decisionPrompt.decisionBody}</p>
        </motion.div>
      )}

      <motion.div
        initial={reduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={reduceMotion ? { duration: 0 } : { delay: 0.8 + paragraphs.length * 0.15, duration: 0.4 }}
        className="pt-2"
      >
        <Button
          type="button"
          onClick={onStart}
          className="bg-gradient-to-r from-mint to-emerald-400 text-ink hover:opacity-90 font-bold"
        >
          Start here
        </Button>
      </motion.div>
    </div>
  );
};

export const DecisionPromptSheet = ({ open, onOpenChange, data, onStart }: DecisionPromptSheetProps) => {
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
            <PromptBody data={data} onStart={onStart} />
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
        <PromptBody data={data} onStart={onStart} />
      </SheetContent>
    </Sheet>
  );
};
