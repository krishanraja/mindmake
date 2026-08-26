import type { Edge, Node } from "reactflow";

export type NodeKind = "human" | "agent" | "hybrid";
export type NodeCategory =
  | "decision-critical"
  | "agent-first"
  | "emergent"
  | "hybrid-team";

export interface DecisionPrompt {
  headline: string;
  body: string;
  decisionLabel?: string;
  decisionBody?: string;
}

export interface OrgNodeData {
  label: string;
  subtitle?: string;
  kind: NodeKind;
  category?: NodeCategory;
  featured?: boolean;
  decisionPrompt?: DecisionPrompt;
}

export type OrgNode = Node<OrgNodeData>;
export type OrgEdge = Edge;
export type ChartState = "traditional" | "new-age";

export const nodeVariantClasses = (kind: NodeKind): string =>
  kind === "human"
    ? "bg-ink text-white border-ink/40 dark:border-white/20"
    : kind === "agent"
    ? "bg-mint text-ink border-mint"
    : "bg-gradient-to-br from-ink via-ink/95 to-mint/40 text-white border-mint/50";

// Layout constants. We hand-place nodes in a compact hierarchy so the
// chart reads cleanly on laptop widths without ReactFlow's auto-layout.
const COL = 220;
const ROW = 130;
const CENTER = 3 * COL;

const traditionalNodes: OrgNode[] = [
  {
    id: "t-ceo",
    type: "org",
    position: { x: CENTER, y: 0 },
    data: { label: "Chief Executive", kind: "human", category: "decision-critical" },
  },
  {
    id: "t-cto",
    type: "org",
    position: { x: CENTER - 2 * COL, y: ROW },
    data: { label: "Technology lead", kind: "human" },
  },
  {
    id: "t-cmo",
    type: "org",
    position: { x: CENTER - COL, y: ROW },
    data: { label: "Marketing lead", kind: "human" },
  },
  {
    id: "t-coo",
    type: "org",
    position: { x: CENTER, y: ROW },
    data: { label: "Operations lead", kind: "human" },
  },
  {
    id: "t-cfo",
    type: "org",
    position: { x: CENTER + COL, y: ROW },
    data: { label: "Finance lead", kind: "human" },
  },
  {
    id: "t-crow",
    type: "org",
    position: { x: CENTER + 2 * COL, y: ROW },
    data: { label: "Revenue lead", kind: "human" },
  },
  {
    id: "t-eng",
    type: "org",
    position: { x: CENTER - 2 * COL, y: 2 * ROW },
    data: { label: "Engineering", kind: "human" },
  },
  {
    id: "t-content",
    type: "org",
    position: { x: CENTER - COL, y: 2 * ROW },
    data: { label: "Marketing / Content", kind: "human" },
  },
  {
    id: "t-ops",
    type: "org",
    position: { x: CENTER, y: 2 * ROW },
    data: { label: "Operations", kind: "human" },
  },
  {
    id: "t-research",
    type: "org",
    position: { x: CENTER, y: 3 * ROW },
    data: { label: "Customer Research", kind: "human" },
  },
  {
    id: "t-bd",
    type: "org",
    position: { x: CENTER + 2 * COL, y: 2 * ROW },
    data: { label: "Business Development", kind: "human" },
  },
];

const traditionalEdges: OrgEdge[] = [
  { id: "te-1", source: "t-ceo", target: "t-cto" },
  { id: "te-2", source: "t-ceo", target: "t-cmo" },
  { id: "te-3", source: "t-ceo", target: "t-coo" },
  { id: "te-4", source: "t-ceo", target: "t-cfo" },
  { id: "te-5", source: "t-ceo", target: "t-crow" },
  { id: "te-6", source: "t-cto", target: "t-eng" },
  { id: "te-7", source: "t-cmo", target: "t-content" },
  { id: "te-8", source: "t-coo", target: "t-ops" },
  { id: "te-9", source: "t-coo", target: "t-research" },
  { id: "te-10", source: "t-crow", target: "t-bd" },
];

const newAgeNodes: OrgNode[] = [
  {
    id: "n-ceo",
    type: "org",
    position: { x: CENTER, y: 0 },
    data: { label: "Chief Executive", kind: "human", category: "decision-critical" },
  },
  {
    id: "n-cos",
    type: "org",
    position: { x: CENTER - COL, y: ROW },
    data: {
      label: "Chief of Staff",
      kind: "human",
      category: "decision-critical",
      decisionPrompt: {
        headline: "Chief of Staff: Keep trust with a person",
        body: "A chief of staff still owns private context, trust and delicate choices. AI can collect inputs, prepare options and show where work is stuck.",
        decisionLabel: "Useful question",
        decisionBody:
          "Which parts of the job can AI prepare safely, and which calls should always come back to the person?",
      },
    },
  },
  {
    id: "n-coo-agent",
    type: "org",
    position: { x: CENTER + COL, y: ROW },
    data: {
      label: "Agatha, operations agent",
      subtitle: "Checks the whole AI system",
      kind: "agent",
      category: "emergent",
      decisionPrompt: {
        headline: "Agatha: Give the system a human owner",
        body: "Agatha checks work from the other agents, spots gaps and brings important questions back to Krish.",
        decisionLabel: "Useful question",
        decisionBody:
          "When an agent finds a problem that crosses two teams, which person owns the answer?",
      },
    },
  },
  {
    id: "n-content",
    type: "org",
    position: { x: CENTER - 2 * COL, y: 2 * ROW },
    data: {
      label: "Marketing / Content",
      subtitle: "One person leads; AI prepares",
      kind: "hybrid",
      category: "hybrid-team",
      decisionPrompt: {
        headline: "Marketing and content: Keep one clear editor",
        body: "AI can research, prepare drafts and help time the work. One person still owns the voice, the facts and the choice to publish.",
        decisionLabel: "Useful question",
        decisionBody:
          "Who can reject a weak draft, and what must they check before anything reaches a customer?",
      },
    },
  },
  {
    id: "n-lead-scoring",
    type: "org",
    position: { x: CENTER - COL, y: 2 * ROW },
    data: {
      label: "Lead Scoring",
      subtitle: "AI first; person handles exceptions",
      kind: "agent",
      category: "agent-first",
      decisionPrompt: {
        headline: "Lead scoring: Bring uncertain cases to a person",
        body: "AI can compare a possible buyer with the rules you set. A person steps in when the evidence is weak, the deal is important or the risk is high.",
        decisionLabel: "Useful question",
        decisionBody:
          "What can the agent decide alone, and what should always be checked before sales acts?",
      },
    },
  },
  {
    id: "n-research",
    type: "org",
    position: { x: CENTER, y: 2 * ROW },
    data: {
      label: "Customer Research",
      subtitle: "People interview; AI finds patterns",
      kind: "hybrid",
      category: "hybrid-team",
      decisionPrompt: {
        headline: "Customer research: Let people hear the customer",
        body: "People can lead the interviews. AI can group notes, find repeated needs and prepare a first view without hiding the source material.",
        decisionLabel: "Useful question",
        decisionBody:
          "How will the team keep learning to hear nuance if AI does more of the sorting and summarising?",
      },
    },
  },
  {
    id: "n-deps",
    type: "org",
    position: { x: CENTER + COL, y: 2 * ROW },
    data: {
      label: "Dependency Monitoring",
      subtitle: "AI watches; a person sets the limits",
      kind: "agent",
      category: "agent-first",
      decisionPrompt: {
        headline: "System checks: Decide when a person steps in",
        body: "An agent can watch software links, supplier changes and costs. It can bring a person the few changes that may need action.",
        decisionLabel: "Useful question",
        decisionBody:
          "Which changes can the agent fix, which need approval and how will a person see the reason?",
      },
    },
  },
  {
    id: "n-bd",
    type: "org",
    position: { x: CENTER + 2 * COL, y: 2 * ROW },
    data: {
      label: "Sales research",
      subtitle: "AI prepares; a person builds trust",
      kind: "agent",
      category: "agent-first",
      decisionPrompt: {
        headline: "Sales research: Use the saved time on the relationship",
        body: "AI can research the company, prepare a useful first note and sort replies. A person uses that time to understand the buyer and earn trust.",
        decisionLabel: "Useful question",
        decisionBody:
          "What should the salesperson do better with the time AI gives back?",
      },
    },
  },
  {
    id: "n-synthesist",
    type: "org",
    position: { x: CENTER, y: 3.3 * ROW },
    data: {
      label: "Executive brief builder",
      subtitle: "New role created for AI work",
      kind: "agent",
      category: "emergent",
      featured: true,
      decisionPrompt: {
        headline: "Executive brief builder: Turn many reports into one view",
        body: "This job was not in the first plan. Agatha found that useful reports were arriving one by one, but no one was joining them into a clear view.\n\nKrish checked the need, set the standard and built Nova to prepare that view.",
        decisionLabel: "Useful question",
        decisionBody:
          "When AI points to a missing job, who checks that the job is real and decides what good work looks like?",
      },
    },
  },
];

const newAgeEdges: OrgEdge[] = [
  { id: "ne-1", source: "n-ceo", target: "n-cos" },
  { id: "ne-2", source: "n-ceo", target: "n-coo-agent" },
  { id: "ne-3", source: "n-cos", target: "n-content" },
  { id: "ne-4", source: "n-cos", target: "n-research" },
  { id: "ne-5", source: "n-coo-agent", target: "n-lead-scoring" },
  { id: "ne-6", source: "n-coo-agent", target: "n-deps" },
  { id: "ne-7", source: "n-coo-agent", target: "n-bd" },
  { id: "ne-8", source: "n-coo-agent", target: "n-synthesist" },
  { id: "ne-9", source: "n-cos", target: "n-synthesist" },
];

export const traditionalChart = {
  nodes: traditionalNodes,
  edges: traditionalEdges,
};

export const newAgeChart = {
  nodes: newAgeNodes,
  edges: newAgeEdges,
};
