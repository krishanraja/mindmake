/**
 * Three-way currency control, shown next to a price rather than buried in the
 * footer, because the person who needs it is looking at the number.
 *
 * Built on native radios rather than three buttons or a select: a radio group
 * is what a three-way exclusive choice is, and arrow-key navigation, roving
 * focus and the correct screen-reader semantics come from the platform
 * instead of being reimplemented.
 */

import { CURRENCIES, CURRENCY_META } from "@/lib/offers";
import { useCurrency } from "@/contexts/CurrencyContext";
import { cn } from "@/lib/utils";

interface CurrencySwitcherProps {
  /**
   * Must be unique per instance. Native radios group by `name`, so two
   * switchers sharing one would fight over a single selection. Required
   * rather than defaulted so that cannot happen by accident.
   */
  idPrefix: string;
  className?: string;
}

export function CurrencySwitcher({ idPrefix, className }: CurrencySwitcherProps) {
  const { currency, setCurrency } = useCurrency();

  return (
    <fieldset className={cn("shrink-0 border-0 p-0 m-0", className)}>
      <legend className="sr-only">Show prices in</legend>

      <div className="inline-flex items-center gap-0.5 rounded-full border border-border/60 bg-background/60 p-0.5">
        {CURRENCIES.map((code) => {
          const meta = CURRENCY_META[code];
          const id = `${idPrefix}-${code}`;
          const checked = currency === code;
          return (
            <span key={code} className="relative inline-flex">
              {/*
                The accessible name lives on the input, not on the label
                element. The visible text is a three-letter code, and "AUD"
                read aloud is ambiguous, so the radio itself carries the full
                "Show prices in Australian dollars".
              */}
              <input
                type="radio"
                id={id}
                name={idPrefix}
                value={code}
                checked={checked}
                aria-label={`Show prices in ${meta.aria}`}
                onChange={() => setCurrency(code)}
                className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
              />
              <label
                htmlFor={id}
                aria-hidden="true"
                className={cn(
                  "cursor-pointer select-none rounded-full px-2.5 py-1",
                  "text-xs font-bold uppercase tracking-[0.12em] transition-colors",
                  "peer-focus-visible:outline peer-focus-visible:outline-2",
                  "peer-focus-visible:outline-offset-2 peer-focus-visible:outline-mint",
                  checked
                    ? "bg-ink text-white dark:bg-mint dark:text-ink"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {meta.label}
              </label>
            </span>
          );
        })}
      </div>

      {/*
        One announcement per change. Putting aria-live on each price would make
        the Handover ladder read three numbers on every click.
      */}
      <span role="status" className="sr-only">
        Prices shown in {CURRENCY_META[currency].aria}
      </span>
    </fieldset>
  );
}
