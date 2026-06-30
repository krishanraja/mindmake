import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

// The Cohort Signal - the public face of the portfolio hive mind (D-expose).
//
// `portfolio-pulse` categorises, SERVER-SIDE, the anxieties leaders admit at the
// top of the funnel (Make Your Mind Up's "the decision you keep not making")
// into the nine AI-native lanes and returns ONLY the anonymised distribution -
// counts and shares, never a name, a company, or the raw text. No single product
// can see this; the portfolio can. Here it becomes a quiet, honest piece of Live
// Intel: "this is the shape of the room you're in."
//
// Volume-guarded: below MIN_VISIBLE the aggregate is too thin to show publicly
// (a near-empty room reads as weakness, not signal), so the section renders
// nothing and the page flows straight past it. No PII ever reaches the client.

const MIN_VISIBLE = 12;

interface PulseLane {
  lane: string;
  label: string;
  count: number;
  share: number; // 0..1
}

interface PulseData {
  total: number;
  lanes: PulseLane[];
}

function usePortfolioPulse(): PulseData | null {
  const [data, setData] = useState<PulseData | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data: res, error } = await supabase.functions.invoke("portfolio-pulse");
        if (error || !res?.ok) return;
        if (active && (res.total ?? 0) >= MIN_VISIBLE) {
          setData({ total: res.total, lanes: (res.lanes as PulseLane[]).slice(0, 6) });
        }
      } catch {
        // stay null - the section simply doesn't render
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return data;
}

export function PortfolioPulse() {
  const pulse = usePortfolioPulse();
  if (!pulse || pulse.lanes.length === 0) return null;

  const top = pulse.lanes[0];

  return (
    <section className="section-padding bg-ink text-white border-t border-white/10">
      <div className="container-width max-w-5xl">
        <div className="mb-8">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-mint/80 mb-3">
            The cohort signal
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
            What leaders are actually wrestling with
          </h2>
          <p className="mt-3 text-sm md:text-base text-white/60 max-w-2xl">
            Anonymised, from {pulse.total} leaders who told us the AI decision they keep
            not making. No names, no companies - just the shape of the room you're in.
          </p>
        </div>

        <div className="space-y-3">
          {pulse.lanes.map((lane, i) => {
            const pct = Math.round(lane.share * 100);
            return (
              <div key={lane.lane} className="flex items-center gap-4">
                <div className="w-48 shrink-0 text-sm text-white/80 leading-snug">
                  {lane.label}
                </div>
                <div className="flex-1 h-7 rounded-md bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${Math.max(pct, 4)}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7, delay: i * 0.08, ease: "easeOut" }}
                    className="h-full rounded-md bg-mint/80"
                  />
                </div>
                <div className="w-10 shrink-0 text-right text-sm font-mono text-white/50">
                  {pct}%
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-xs text-white/30">
          Most leaders are quietly stuck on the same call: {top.label.toLowerCase()}.
          You're not behind - you're in good company. Updated as the room grows.
        </p>
      </div>
    </section>
  );
}
