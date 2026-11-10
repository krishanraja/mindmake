/**
 * The connected Brain (Krish, 2026-11-10: "One connected Brain", chosen after
 * the S9 audit found the Brain said nothing to a first-time visitor). MOCK for
 * approval.
 *
 * Everything shown comes from the fixture, nothing is invented: each idea's
 * cluster (where it sits on the Brain),
 * the sources it rests on, its connections and what each one means, and the
 * changes made to it. Round 2 (Krish, 2026-11-10): cluster names approved,
 * words "as simple as possible", the liquid mass kept, and the details float
 * over the Brain on a click so the section stays one screen long.
 */
import { sourceLine } from "./brainRecord";

export interface BrainFixture {
  items: Array<{ id: string; title: string; cluster: string; type: string; standing: string; source_refs: string[] }>;
  relationships: Array<{ id: string; from: string; to: string; type: string; meaning: string }>;
  sources: Array<{ id: string; kind: string; label: string; assertion: string }>;
  corrections: Array<{ id: string; item_ref: string; summary: string }>;
}

/** The seven clusters in the fixture, named in plain words (approved by Krish, 2026-11-10) and placed on the brain (1000 x 820 space). */
export const CLUSTERS: ReadonlyArray<{ id: string; name: string; centre: [number, number] }> = [
  { id: "self", name: "Who you are becoming", centre: [320, 290] },
  { id: "taste", name: "Your taste", centre: [560, 200] },
  { id: "future", name: "Where it leads", centre: [760, 330] },
  { id: "judgement", name: "How you judge", centre: [290, 500] },
  { id: "growth", name: "Where you are growing", centre: [535, 400] },
  { id: "fluency", name: "How you use AI", centre: [455, 600] },
  { id: "work", name: "How the work gets done", centre: [700, 575] },
];

/** What each connection does, in plain words, said from the idea that does it. */
export const RELATION_WORDS: Readonly<Record<string, string>> = {
  supports: "supports",
  constrains: "limits",
  qualifies: "refines",
  develops: "develops",
  creates_need_for: "creates a need for",
  in_tension_with: "pulls against",
  expresses: "expresses",
  requires: "needs",
  protects: "protects",
  tests: "tests",
  example_of: "is an example of",
  holds_open: "keeps open",
  is_outcome_of: "comes from",
};

/** The same connection said from the other end. */
export const RELATION_WORDS_BACK: Readonly<Record<string, string>> = {
  supports: "supported by",
  constrains: "limited by",
  qualifies: "refined by",
  develops: "developed by",
  creates_need_for: "needed because of",
  in_tension_with: "pulls against",
  expresses: "expressed by",
  requires: "needed by",
  protects: "protected by",
  tests: "tested by",
  example_of: "shown by",
  holds_open: "kept open by",
  is_outcome_of: "leads to",
};

/** The three changes in the fixture, in plain words (as the ideas already have them). */
export const plainChanges: Readonly<Record<string, string>> = {
  "COR-001": "Only work that reaches the outside world needs your sign-off; internal drafts can stay with AI.",
  "COR-002": "Your own capability is how the company gains, not a goal that competes with it.",
  "COR-003": "From a faster AI user to a builder of judgement other people can use.",
};

/** Seats every idea around its cluster's centre, and a label above each cluster. Keys "label:<cluster>" are the labels. */
export function clusterSeats(fixture: BrainFixture): Map<string, [number, number]> {
  const seats = new Map<string, [number, number]>();
  for (const cluster of CLUSTERS) {
    const members = fixture.items.filter((item) => item.cluster === cluster.id);
    const [cx, cy] = cluster.centre;
    const radius = members.length > 1 ? 52 : 0;
    members.forEach((item, index) => {
      const angle = -Math.PI / 2 + (index / Math.max(1, members.length)) * Math.PI * 2 + (members.length === 2 ? Math.PI / 2 : 0);
      seats.set(item.id, [cx + Math.cos(angle) * radius, cy + 18 + Math.sin(angle) * radius * 0.8]);
    });
    seats.set(`label:${cluster.id}`, [cx, cy - (members.length > 1 ? 52 : 26)]);
  }
  return seats;
}

export interface RestsOn {
  cluster: string;
  sources: Array<{ label: string; line: string }>;
  connections: Array<{ otherId: string; verb: string; title: string }>;
  changes: string[];
}

/** What an idea rests on: its sources, its connections and what each means, and its changes. */
export function restsOn(fixture: BrainFixture, id: string): RestsOn {
  const item = fixture.items.find((entry) => entry.id === id);
  const title = (other: string) => fixture.items.find((entry) => entry.id === other)?.title ?? other;
  if (!item) return { cluster: "", sources: [], connections: [], changes: [] };
  return {
    cluster: CLUSTERS.find((cluster) => cluster.id === item.cluster)?.name ?? "",
    sources: item.source_refs
      .map((ref) => fixture.sources.find((source) => source.id === ref))
      .filter((source): source is BrainFixture["sources"][number] => Boolean(source))
      .map((source) => ({ label: source.label, line: sourceLine(source) })),
    connections: fixture.relationships
      .filter((relationship) => relationship.from === id || relationship.to === id)
      .map((relationship) => relationship.from === id
        ? { otherId: relationship.to, verb: RELATION_WORDS[relationship.type] ?? "connects to", title: title(relationship.to) }
        : { otherId: relationship.from, verb: RELATION_WORDS_BACK[relationship.type] ?? "connected to", title: title(relationship.from) }),
    changes: fixture.corrections.filter((correction) => correction.item_ref === id).map((correction) => plainChanges[correction.id] ?? correction.summary),
  };
}
