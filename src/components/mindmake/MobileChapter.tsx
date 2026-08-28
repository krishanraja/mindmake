import { useState, type ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

/**
 * A long list, shortened on a phone until somebody asks for the rest.
 *
 * It renders fewer children rather than clipping them. Clipping is the usual
 * way to do this and it leaves the hidden part in the tab order, so a keyboard
 * reader lands on something nobody can see. Rendering fewer items has no such
 * trap, and the count in the button says exactly what is being held back rather
 * than making the reader guess how much more there is.
 *
 * Above the phone breakpoint it renders everything and adds no markup at all,
 * so a laptop reader never meets a control that exists only for a phone.
 */
interface MobileChapterProps {
  items: ReactNode[];
  /** How many to show before the reader asks for more. */
  shown: number;
  /** Named for what is behind the button: "stories", "questions". */
  noun: string;
  className?: string;
}

export function MobileChapter({ items, shown, noun, className = "" }: MobileChapterProps) {
  const phone = useIsMobile();
  const [open, setOpen] = useState(false);
  const capped = phone && !open && items.length > shown;
  const visible = capped ? items.slice(0, shown) : items;

  return (
    <>
      <div className={className}>{visible}</div>
      {capped && (
        <p className="mm-chapter-more">
          <button type="button" className="mm-button mm-button-quiet" onClick={() => setOpen(true)}>
            Read the other {items.length - shown} {noun}
          </button>
        </p>
      )}
    </>
  );
}
