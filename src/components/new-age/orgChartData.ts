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
    data: { label: "CEO", kind: "human", category: "decision-critical" },
  },
  {
    id: "t-cto",
    type: "org",
    position: { x: CENTER - 2 * COL, y: ROW },
    data: { label: "CTO", kind: "human" },
  },
  {
    id: "t-cmo",
    type: "org",
    position: { x: CENTER - COL, y: ROW },
    data: { label: "CMO", kind: "human" },
  },
  {
    id: "t-coo",
    type: "org",
    position: { x: CENTER, y: ROW },
    data: { label: "COO", kind: "human" },
  },
  {
    id: "t-cfo",
    type: "org",
    position: { x: CENTER + COL, y: ROW },
    data: { label: "CFO", kind: "human" },
  },
  {
    id: "t-crow",
    type: "org",
    position: { x: CENTER + 2 * COL, y: ROW },
    data: { label: "CRO", kind: "human" },
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
    data: { label: "CEO", kind: "human", category: "decision-critical" },
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
        headline: "Chief of Staff: Always human",
        body: "Decision-critical roles stay human. Judgment, discretion, and political capital are not delegable to an agent fleet. But the role's texture changes. Your Chief of Staff now orchestrates outputs from a dozen agents, not a dozen people.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "Does your current Chief of Staff have the literacy to orchestrate agent outputs? If not, is it a training gap or a hiring gap? The answer changes the next 12 months of your org.",
      },
    },
  },
  {
    id: "n-coo-agent",
    type: "org",
    position: { x: CENTER + COL, y: ROW },
    data: {
      label: "Agatha, COO Agent",
      subtitle: "Fleet governance",
      kind: "agent",
      category: "emergent",
      decisionPrompt: {
        headline: "Agatha, COO Agent",
        body: "The agent that orchestrates the other agents. Surfaces strategic tensions, flags drift, and (as you'll see in the story below) identifies capability gaps the fleet didn't know it had.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "Who is the human counterpart to your COO-agent? Most orgs haven't named one. The first time your COO-agent surfaces a decision that spans two human VPs, you'll need a human owner of the response, not a meeting to schedule a meeting.",
      },
    },
  },
  {
    id: "n-content",
    type: "org",
    position: { x: CENTER - 2 * COL, y: 2 * ROW },
    data: {
      label: "Marketing / Content",
      subtitle: "Human lead + 3 agents",
      kind: "hybrid",
      category: "hybrid-team",
      decisionPrompt: {
        headline: "Marketing / Content: Hybrid team",
        body: "One human lead (owns voice, judgment, relationships). Three agents (research, draft generation, distribution timing). 80% of the throughput is agent-produced; the judgment on what's shipped stays human.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "Who owns quality control when 80% of the output is agent-generated? Does your current head of content become a smaller job, a different job, or a bigger job? The three answers lead to very different hiring decisions over the next eighteen months.",
      },
    },
  },
  {
    id: "n-lead-scoring",
    type: "org",
    position: { x: CENTER - COL, y: 2 * ROW },
    data: {
      label: "Lead Scoring",
      subtitle: "Agent-first, human exception path",
      kind: "agent",
      category: "agent-first",
      decisionPrompt: {
        headline: "Lead Scoring: Agent-first function",
        body: "Once a human-default function, now run end-to-end by an agent. A human only gets involved in the exception path: accounts that score ambiguously, enterprise deals over a threshold, or reputational risks.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "The people who used to do lead scoring: replace, empower, or redeploy? Each answer has a different timeline and a different political cost. You'll make this call for a dozen functions over the next two years. The first one sets the precedent for the rest.",
      },
    },
  },
  {
    id: "n-research",
    type: "org",
    position: { x: CENTER, y: 2 * ROW },
    data: {
      label: "Customer Research",
      subtitle: "Human lead + agent research corps",
      kind: "hybrid",
      category: "hybrid-team",
      decisionPrompt: {
        headline: "Customer Research: Hybrid team",
        body: "The interviews are still human. The synthesis, the pattern-matching across hundreds of calls, the drafting of research memos: all agent-assisted. The human role becomes more senior, not less.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "Junior research roles get thinner while mid-level and senior roles get more leveraged. What's your pipeline for developing the next generation of senior researchers when the junior rungs have been cut away?",
      },
    },
  },
  {
    id: "n-deps",
    type: "org",
    position: { x: CENTER + COL, y: 2 * ROW },
    data: {
      label: "Dependency Monitoring",
      subtitle: "Agent-first, always-on",
      kind: "agent",
      category: "agent-first",
      decisionPrompt: {
        headline: "Dependency Monitoring: Agent-first function",
        body: "No human watches integration dashboards anymore. An agent (Kai, in our case) monitors every API, every vendor, every cost curve. Escalates to a human when thresholds are breached, not when nothing is wrong.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "What's your governance for what an agent can act on autonomously versus what it must escalate? Set the threshold too high and you drown in alerts. Set it too low and the agent makes decisions your board will ask you about later.",
      },
    },
  },
  {
    id: "n-bd",
    type: "org",
    position: { x: CENTER + 2 * COL, y: 2 * ROW },
    data: {
      label: "BD Ops",
      subtitle: "Agent-first, human close",
      kind: "agent",
      category: "agent-first",
      decisionPrompt: {
        headline: "BD Ops: Agent-first function",
        body: "Prospect research, personalization, cadence, reply triage: all agent-run. The human steps in to close. In our fleet, Marcus handles the first 80% of the funnel before a human ever sees the prospect.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "Your SDRs are now your orchestrators, not your outreachers. What's the job you're hiring for, and does the person sitting in that seat today still fit the job description you're about to write?",
      },
    },
  },
  {
    id: "n-synthesist",
    type: "org",
    position: { x: CENTER, y: 3.3 * ROW },
    data: {
      label: "Intelligence Synthesist",
      subtitle: "Agent-native role",
      kind: "agent",
      category: "emergent",
      featured: true,
      decisionPrompt: {
        headline: "Intelligence Synthesist: Agent-native role",
        body: "This role did not exist in our planned org chart. It emerged when Agatha, the COO-agent, flagged that outputs from across the fleet were not being synthesized into coherent executive briefings. Each agent was reporting in isolation.\n\nAgatha proposed the role herself and recommended its specification. A new agent (Nova) was created to fulfill it.",
        decisionLabel: "Decision you'd face",
        decisionBody:
          "When an AI teammate identifies a capability gap in your org and proposes a role to fill it, who approves the hire? What's your vetting process? What's the org-chart governance protocol you haven't written yet?",
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
