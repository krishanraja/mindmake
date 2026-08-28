import { useEffect, useState } from "react";
import type { BoardCard, BoardDay } from "@/lib/board";

export type BoardState =
  | { status: "loading" }
  /** The read is live. cacheDate is the cache's own stamp, never now(). */
  | { status: "ready"; days: BoardDay[]; cacheDate: string; total: number }
  /** The fetch failed or returned nothing usable. The section collapses. */
  | { status: "collapsed" };

interface Options {
  /** How many retained days to ask for. The board shows 28, the homepage 1. */
  days?: number;
}

/** Legacy shape, still returned when no view is requested. */
interface LegacyHeadline {
  title: string;
  source?: string;
  say?: string;
  url?: string;
  sourceCount?: number;
}

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/get-ai-news`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";
const TIMEOUT_MS = 8_000;

/**
 * Strips the editorial label the legacy path prefixes onto a title, so a card
 * built from the fallback shape reads the same as one from the board view.
 */
const stripLabel = (title: string) => title.replace(/^\[[A-Z' ]+\]\s*/, "");

function fromLegacy(headlines: LegacyHeadline[]): BoardDay[] {
  const cards: BoardCard[] = headlines
    .filter((headline) => headline?.title)
    .map((headline, index) => ({
      id: `legacy-${index}`,
      headline: stripLabel(headline.title),
      say: headline.say ?? null,
      // The legacy shape carries no point of view, category or age. Rather than
      // invent them, the card renders without those lines.
      pov: null,
      category: null,
      source: headline.source ?? null,
      url: headline.url ?? null,
      timeAgo: null,
      score: headlines.length - index,
      sourceCount: headline.sourceCount ?? null,
    }));
  return cards.length > 0 ? [{ date: new Date().toISOString(), cards }] : [];
}

/**
 * Reads the daily market board.
 *
 * Asks for the board view first. A deployment that predates that view still
 * answers with the legacy headline list, which is mapped into partial cards so
 * the page stays honest rather than empty. Anything else collapses the section.
 */
export function useBoardData({ days = 28 }: Options = {}): BoardState {
  const [state, setState] = useState<BoardState>({ status: "loading" });

  useEffect(() => {
    if (!FUNCTION_URL.startsWith("http")) {
      setState({ status: "collapsed" });
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);

    (async () => {
      try {
        const response = await fetch(FUNCTION_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: ANON_KEY,
            Authorization: `Bearer ${ANON_KEY}`,
          },
          body: JSON.stringify({ view: "board", days }),
          signal: controller.signal,
        });
        if (!response.ok) throw new Error(`get-ai-news ${response.status}`);
        const payload = await response.json();

        if (Array.isArray(payload?.days) && payload.days.length > 0) {
          const boardDays = payload.days as BoardDay[];
          const total = boardDays.reduce((sum, day) => sum + day.cards.length, 0);
          setState({
            status: "ready",
            days: boardDays,
            cacheDate: payload.timestamp ?? boardDays[0].date,
            total,
          });
          return;
        }

        const legacy = fromLegacy(payload?.headlines ?? []);
        if (legacy.length > 0) {
          setState({
            status: "ready",
            days: legacy,
            cacheDate: payload?.timestamp ?? legacy[0].date,
            total: legacy[0].cards.length,
          });
          return;
        }

        setState({ status: "collapsed" });
      } catch {
        setState({ status: "collapsed" });
      } finally {
        window.clearTimeout(timer);
      }
    })();

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [days]);

  return state;
}
