import { DIVISION_IDS } from "@/lib/workEmail";
import { INDUSTRIES, ROLE_LABELS, type Industry, type Role } from "@/lib/board";

/**
 * The board's filters, as one control used by both surfaces.
 *
 * The roles are the site's own eight divisions, the same list the lead dialog
 * asks for and the server allowlists, so a visitor who says they run revenue in
 * one place is offered the word "Sales" in the other rather than a synonym the
 * board invented for itself.
 *
 * Two rules hold, and both were learned rather than designed.
 *
 * **A chip is never pressable and empty.** Its count is beside it and it is
 * disabled at zero, so the control tells you what it will do before you press
 * it. The counts must therefore be computed over the same window the rows are
 * drawn from, which is why they arrive as props rather than being counted here.
 *
 * **A control that appears to do nothing is worse than no control.** On the
 * board that means every figure on the page -- the rows, the lane tiles, the
 * spark bars and the timestamp's total -- reads from one filtered collection.
 * This component only reports the choice; the surface owns the collection.
 */
export function BoardFilters({
  role,
  onRole,
  roleCounts,
  industry,
  onIndustry,
  industryCounts,
}: {
  role: Role | null;
  onRole: (role: Role | null) => void;
  roleCounts: Record<Role, number>;
  /** Industries are /ai-gtm's second lens. Omitted, the control is roles only. */
  industry?: Industry;
  onIndustry?: (industry: Industry) => void;
  industryCounts?: Record<Industry, number>;
}) {
  return (
    <>
      {/* No printed label. "Your week" and "Your market" sat at the head of
          each row as sticky text with no ground of its own, so on any phone
          where the row scrolls the chips slid under the words. They named
          nothing the chips do not: the group carries its name for a screen
          reader, and eight divisions and six industries say what they are.

          The roles wrap wherever there is height for them, so all eight are on
          screen at once; on a short screen they become a rail like the
          industries, because three wrapped rows is a fifth of a 640px phone. */}
      <div className="mm-chips is-short-rail" role="group" aria-label="Filter by the part of the business you run">
        <button
          className="mm-chip"
          type="button"
          aria-pressed={role === null}
          onClick={() => onRole(null)}
        >
          Everything
        </button>
        {DIVISION_IDS.map((option) => (
          <button
            key={option}
            className="mm-chip"
            type="button"
            aria-pressed={role === option}
            disabled={roleCounts[option] === 0}
            onClick={() => onRole(role === option ? null : option)}
          >
            {ROLE_LABELS[option]}
            <i aria-hidden="true">{roleCounts[option]}</i>
          </button>
        ))}
      </div>

      {industry && onIndustry && industryCounts && (
        <div className="mm-chips is-rail" role="group" aria-label="Filter by industry">
          {INDUSTRIES.map((option) => (
            <button
              key={option}
              className="mm-chip"
              type="button"
              aria-pressed={industry === option}
              disabled={industryCounts[option] === 0}
              onClick={() => onIndustry(option)}
            >
              {option === "All industries" ? "Everything" : option}
              {option !== "All industries" && <i aria-hidden="true">{industryCounts[option]}</i>}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
