import { ArrowUpRight } from "lucide-react";
import { BOOKING_URL } from "@/lib/publicLinks";
import { cn } from "@/lib/utils";

type BookFitCallProps = {
  className?: string;
  source?: string;
};

export function BookFitCall({ className, source = "website" }: BookFitCallProps) {
  const href = `${BOOKING_URL}?utm_source=${encodeURIComponent(source)}`;

  const trackClick = () => {
    try {
      (window as unknown as { plausible?: (event: string, options?: { props: Record<string, string> }) => void }).plausible?.(
        "fit_call_clicked",
        { props: { source } },
      );
    } catch {
      // Booking must still work if analytics are blocked.
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={trackClick}
      aria-label="Book a fit call. Opens in a new tab."
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-mint px-6 py-3 text-sm font-bold text-ink shadow-lg shadow-mint/20 transition duration-300 hover:-translate-y-0.5 hover:text-ink hover:no-underline hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint focus-visible:ring-offset-2 focus-visible:ring-offset-ink",
        className,
      )}
    >
      Book a fit call
      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
    </a>
  );
}
