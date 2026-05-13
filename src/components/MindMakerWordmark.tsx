import { cn } from "@/lib/utils";

interface MindMakerWordmarkProps {
  size?: "nav" | "section";
  className?: string;
}

export const MindMakerWordmark = ({ size = "nav", className }: MindMakerWordmarkProps) => {
  const isNav = size === "nav";

  return (
    <span
      className={cn("inline-flex items-center", isNav ? "gap-1.5" : "gap-3", className)}
      aria-label="Mindmaker Live"
    >
      <span
        className={cn(
          "font-bold tracking-tight bg-gradient-to-r from-foreground via-mint/90 to-emerald-400 dark:from-white dark:via-mint/90 dark:to-emerald-300 bg-clip-text text-transparent",
          isNav ? "text-sm" : "text-2xl md:text-3xl",
        )}
      >
        MINDMAKER
      </span>
      <span
        className={cn("rounded-full bg-mint", isNav ? "h-1 w-1" : "h-1.5 w-1.5")}
        aria-hidden="true"
      />
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-gradient-to-r from-mint to-emerald-400 text-ink font-extrabold leading-none",
          isNav
            ? "px-1.5 py-0.5 text-[9px] tracking-[0.14em]"
            : "px-3 py-1 text-xs md:text-sm tracking-[0.18em]",
        )}
      >
        LIVE
      </span>
    </span>
  );
};
