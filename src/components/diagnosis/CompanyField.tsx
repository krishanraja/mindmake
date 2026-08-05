import { useEffect, useRef, useState } from "react";
import { Building2, Check, Loader2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { haptics } from "@/lib/haptics";
import { sound } from "@/lib/sound";
import { cn } from "@/lib/utils";

export interface PickedCompany {
  name?: string;
  domain?: string;
  iconUrl?: string;
}

interface CompanyResult {
  name?: string;
  domain: string;
  iconUrl?: string;
}

interface CompanyFieldProps {
  /**
   * Reports the current best company guess on every change: a tapped result
   * carries an exact { name, domain } (precise, as good as an email); free-typed
   * text carries only { name } (resolved server-side by search); empty -> null.
   */
  onChange: (company: PickedCompany | null) => void;
  onFocus?: (e: React.FocusEvent<HTMLElement>) => void;
}

/**
 * The opener's company typeahead. As the visitor types their company name, it
 * queries the `company-search` edge function and shows matching companies with
 * their real logo and domain. Picking one hands the session an exact domain,
 * which is the richest, most reliable enrichment key, lower friction than a
 * work email and instantly confirmatory ("it already knows us").
 */
export const CompanyField = ({ onChange, onFocus }: CompanyFieldProps) => {
  const [text, setText] = useState("");
  const [results, setResults] = useState<CompanyResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [picked, setPicked] = useState<CompanyResult | null>(null);

  const timer = useRef<number | null>(null);
  const seq = useRef(0); // guards against out-of-order responses
  const blurTimer = useRef<number | null>(null);

  // Debounced search. A picked result suppresses searching until the text changes.
  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    const q = text.trim();
    if (picked && (picked.name === text || picked.domain === text)) return;
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const mine = ++seq.current;
    timer.current = window.setTimeout(async () => {
      try {
        const { data } = await supabase.functions.invoke("company-search", {
          body: { query: q },
        });
        if (mine !== seq.current) return; // a newer keystroke won
        const list = (data?.results ?? []) as CompanyResult[];
        setResults(list.filter((r) => r && r.domain));
        setOpen(true);
      } catch {
        if (mine === seq.current) setResults([]);
      } finally {
        if (mine === seq.current) setLoading(false);
      }
    }, 250);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [text, picked]);

  useEffect(
    () => () => {
      if (blurTimer.current) window.clearTimeout(blurTimer.current);
    },
    [],
  );

  const handleText = (v: string) => {
    const next = v.slice(0, 80);
    setText(next);
    setPicked(null);
    onChange(next.trim() ? { name: next.trim() } : null);
  };

  const pick = (r: CompanyResult) => {
    haptics.select();
    sound.play("tick");
    setPicked(r);
    setText(r.name || r.domain);
    setResults([]);
    setOpen(false);
    onChange({ name: r.name, domain: r.domain, iconUrl: r.iconUrl });
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 px-1">
        {picked ? (
          picked.iconUrl ? (
            <img
              src={picked.iconUrl}
              alt=""
              className="h-5 w-5 shrink-0 rounded-[5px] object-contain"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <Check className="h-4 w-4 shrink-0 text-mint" />
          )
        ) : (
          <Search className="h-4 w-4 shrink-0 text-white/35" />
        )}
        <input
          value={text}
          onChange={(e) => handleText(e.target.value)}
          onFocus={(e) => {
            if (results.length > 0) setOpen(true);
            onFocus?.(e);
          }}
          onBlur={() => {
            // delay so a tap on a result registers before the list closes
            blurTimer.current = window.setTimeout(() => setOpen(false), 150);
          }}
          placeholder="Your company (start typing to find it)"
          className="w-full bg-transparent py-1 text-[15px] text-white placeholder:text-white/35 focus:outline-none sm:text-base"
          autoComplete="off"
          spellCheck={false}
        />
        {loading && (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-white/35" />
        )}
      </div>

      {open && results.length > 0 && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-white/12 bg-[#0c1714] shadow-2xl shadow-black/50">
          <ul className="max-h-64 overflow-y-auto py-1">
            {results.map((r) => (
              <li key={r.domain}>
                <button
                  type="button"
                  // onMouseDown beats the input's onBlur so the pick lands
                  onMouseDown={(e) => {
                    e.preventDefault();
                    pick(r);
                  }}
                  className="flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-white/[0.06]"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                    {r.iconUrl ? (
                      <img
                        src={r.iconUrl}
                        alt=""
                        className="h-full w-full object-contain p-0.5"
                        onError={(e) => {
                          const el = e.currentTarget as HTMLImageElement;
                          el.style.display = "none";
                        }}
                      />
                    ) : (
                      <Building2 className="h-4 w-4 text-ink/50" />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-white">
                      {r.name || r.domain}
                    </span>
                    <span className="block truncate text-[12px] text-white/45">
                      {r.domain}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CompanyField;
