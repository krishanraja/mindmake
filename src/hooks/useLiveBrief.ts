import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { BriefTag } from "@/pages/Brief";

// Live /signal archive, sourced from the portfolio's shared pool.
//
// `get-ai-news` now serves CTRL's corroborated `live_headlines_cache` (one
// brain, one pool) tagged with Krish's editorial lens. We map that lens onto
// the /signal taxonomy and carry the corroboration count so the card can show
// a "+N sources" chip UNDER Krish's tag - corroboration beneath opinion, the
// portfolio's anti-vanilla pattern. Falls back to the inlined sample archive
// when the feed is empty/unreachable.

export interface LiveBriefCard {
  tag: BriefTag;
  headline: string;
  body: string;
  source?: string;
  sourceCount?: number;
  url?: string;
}

const LABEL_TO_TAG: Record<string, BriefTag> = {
  SIGNAL: "WATCH",
  NOISE: "SKIP",
  "DECISION TRIGGER": "CALL",
  "KRISH'S TAKE": "TAKE",
};

interface RawHeadline {
  title: string;
  source?: string;
  say?: string;
  url?: string;
  sourceCount?: number;
}

function parse(h: RawHeadline): LiveBriefCard | null {
  const m = h.title?.match(/^\[([^\]]+)\]\s*(.+)$/);
  if (!m) return null;
  const tag = LABEL_TO_TAG[m[1].trim().toUpperCase()] ?? "WATCH";
  return {
    tag,
    headline: m[2].trim(),
    body: h.say ?? "",
    source: h.source,
    sourceCount: h.sourceCount,
    url: h.url,
  };
}

export function useLiveBrief(): LiveBriefCard[] | null {
  const [cards, setCards] = useState<LiveBriefCard[] | null>(null);
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke("get-ai-news");
        if (error || !data?.headlines) return;
        const mapped = (data.headlines as RawHeadline[])
          .map(parse)
          .filter((c): c is LiveBriefCard => c !== null);
        if (active && mapped.length > 0) setCards(mapped);
      } catch {
        // keep null -> the page uses its sample archive fallback
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  return cards;
}
