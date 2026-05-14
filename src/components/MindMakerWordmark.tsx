import { cn } from "@/lib/utils";

interface MindMakerWordmarkProps {
  size?: "nav" | "section";
  className?: string;
}

// Renders the canonical Mindmaker Live brand lockup. Light variant carries the
// dark-navy → mint gradient for light backgrounds; the dark variant lifts the
// left side toward white so it stays legible on dark backgrounds.
export const MindMakerWordmark = ({ size = "nav", className }: MindMakerWordmarkProps) => {
  const isNav = size === "nav";
  const heightClass = isNav ? "h-[18px]" : "h-7 md:h-9";

  return (
    <>
      <img
        src="/mindmaker-live-logo.png"
        alt="Mindmaker Live"
        className={cn("w-auto object-contain dark:hidden", heightClass, className)}
      />
      <img
        src="/mindmaker-live-logo-dark.png"
        alt="Mindmaker Live"
        className={cn("w-auto object-contain hidden dark:block", heightClass, className)}
      />
    </>
  );
};
