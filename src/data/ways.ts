import backArt from "@/assets/ways/ways-back-r01-800.webp";
import termsArt from "@/assets/ways/ways-terms-r01-800.webp";
import callsArt from "@/assets/ways/ways-calls-r01-800.webp";
import tryArt from "@/assets/ways/ways-try-r01-800.webp";
import briefArt from "@/assets/ways/ways-brief-r01-800.webp";
import yoursArt from "@/assets/ways/ways-yours-r01-800.webp";
import { examples } from "@/data/examples";
import { getUseCase, type SituationId, type UseCaseId } from "@/data/useCases";

/**
 * "Ways an AI brain can level you up." (Krish, 2026-11-28): the homepage's one
 * proof section, a rail of cards that tilt toward the pointer and turn over.
 *
 * Each card is one wish. Its front is a promise of fewer than ten words that
 * never takes more than two lines; its back is the wish's anchor story in its
 * record's own words (src/data/useCases.ts, held word for word by the parity
 * tests), or a labelled example where no client story exists yet.
 *
 * The six wishes map one to one onto the six parts of the AI brain on
 * /ai-brain, so a card names the part of the brain that does the work and its
 * link lights that part when the reader arrives.
 */
export type BrainPart = "North Star" | "Vision" | "Judgement" | "Taste" | "Standards" | "Preferences";

export const partSlug = (part: BrainPart) => part.toLowerCase().replace(/\s+/g, "-");

export interface WayCard {
  wish: SituationId;
  front: string;
  part: BrainPart;
  art: string;
  /** The back: the anchor story's heading, outcome and result, or a labelled example. */
  back: { kind: "story"; id: UseCaseId; heading: string; outcome: string; result?: string } | { kind: "example"; title: string; leave: string };
}

const story = (id: UseCaseId): WayCard["back"] => {
  const entry = getUseCase(id);
  return { kind: "story", id, heading: entry.heading, outcome: entry.outcome, result: entry.result?.headline };
};

const example = (id: string): WayCard["back"] => {
  const entry = examples.find((item) => item.id === id);
  if (!entry) throw new Error(`ways: no example ${id}`);
  const leave = entry.leave.charAt(0).toUpperCase() + entry.leave.slice(1);
  return { kind: "example", title: entry.title, leave };
};

export const WAYS: readonly WayCard[] = [
  { wish: "back", front: "Back the work you believe in.", part: "Taste", art: backArt, back: story("C-18") },
  { wish: "terms", front: "Take the money, keep the ending.", part: "North Star", art: termsArt, back: example("series") },
  { wish: "calls", front: "Make the big call well.", part: "Judgement", art: callsArt, back: story("C-15") },
  { wish: "try", front: "Reach the idea you'd never reach alone.", part: "Vision", art: tryArt, back: story("C-02") },
  { wish: "brief", front: "Hand over a brief that keeps its point.", part: "Standards", art: briefArt, back: story("C-13") },
  { wish: "yours", front: "Keep your work yours, wherever it travels.", part: "Preferences", art: yoursArt, back: story("C-16") },
];
