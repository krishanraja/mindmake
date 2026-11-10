/**
 * The connected Brain (Krish, 2026-11-10: "One connected Brain", chosen after
 * the S9 audit found the Brain said nothing to a first-time visitor). MOCK for
 * approval: the names and plain words below are proposals Krish decides.
 *
 * Everything shown comes from the fixture, nothing is invented: each idea's
 * cluster (where it sits on the Brain), its kind (what sort of idea it is),
 * the sources it rests on, its connections and what each one means, and the
 * changes made to it.
 */
import { sourceLine } from "./brainRecord";

export interface BrainFixture {
  items: Array<{ id: string; title: string; cluster: string; type: string; standing: string; source_refs: string[] }>;
  relationships: Array<{ id: string; from: string; to: string; type: string; meaning: string }>;
  sources: Array<{ id: string; kind: string; label: string; assertion: string }>;
  corrections: Array<{ id: string; item_ref: string; summary: string }>;
}

/** The seven clusters in the fixture, named in plain words and placed on the brain (1000 x 820 space). Names are proposals. */
export const CLUSTERS: ReadonlyArray<{ id: string; name: string; centre: [number, number] }> = [
  { id: "self", name: "Who you are becoming", centre: [320, 290] },
  { id: "taste", name: "Your taste", centre: [560, 200] },
  { id: "future", name: "Where it leads", centre: [760, 330] },
  { id: "judgement", name: "How you judge", centre: [290, 500] },
  { id: "growth", name: "Where you are growing", centre: [535, 400] },
  { id: "fluency", name: "How you use AI", centre: [455, 600] },
  { id: "work", name: "How the work gets done", centre: [700, 575] },
];

/** What kind of idea each is, as the reader would say it. Proposals. */
export const KIND_WORDS: Readonly<Record<string, string>> = {
  becoming: "Who you are becoming",
  edge: "Your edge",
  value: "Something you value",
  standard: "A standard you hold",
  belief: "Something you believe",
  boundary: "A line you hold",
  method: "How you work",
  tension: "A tension you are working through",
  frontier: "Where you want to get better",
  learning: "Something you learned",
  ambition: "What you want to build",
  identity: "Who you build with",
  example: "An example",
  purpose: "Why you do it",
  anti_standard: "Something you refuse",
  taste: "Your taste",
  decision: "A call you made",
  hypothesis: "Something you are testing",
  experiment: "An experiment",
};

/** What each connection does, in plain words. */
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
  kind: string;
  sources: Array<{ label: string; line: string }>;
  connections: Array<{ otherId: string; text: string }>;
  changes: string[];
}

/** What an idea rests on: its sources, its connections and what each means, and its changes. */
export function restsOn(fixture: BrainFixture, id: string): RestsOn {
  const item = fixture.items.find((entry) => entry.id === id);
  const title = (other: string) => fixture.items.find((entry) => entry.id === other)?.title ?? other;
  if (!item) return { kind: "", sources: [], connections: [], changes: [] };
  return {
    kind: KIND_WORDS[item.type] ?? "",
    sources: item.source_refs
      .map((ref) => fixture.sources.find((source) => source.id === ref))
      .filter((source): source is BrainFixture["sources"][number] => Boolean(source))
      .map((source) => ({ label: source.label, line: sourceLine(source) })),
    connections: fixture.relationships
      .filter((relationship) => relationship.from === id || relationship.to === id)
      .map((relationship) => {
        const verb = RELATION_WORDS[relationship.type] ?? "connects to";
        return relationship.from === id
          ? { otherId: relationship.to, text: `${capitalise(verb)} ${title(relationship.to)}` }
          : { otherId: relationship.from, text: `${title(relationship.from)} ${verb} this` };
      }),
    changes: fixture.corrections.filter((correction) => correction.item_ref === id).map((correction) => correction.summary),
  };
}

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);
