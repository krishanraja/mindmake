// Shared types for the Nervous Decision Machine edge-function output.
// Used by both the full-section NervousDecisionMachine and the compact
// version embedded in OperatorsBrief.

export type NDMPath = {
  name: string;
  tradeoff: string;
  confidence: string;
};

export type NDMArtifact = {
  card1_real_decision: { heading: string; body: string };
  card2_three_paths: { heading: string; paths: NDMPath[] };
  card3_next_14_days: { heading: string; actions: string[] };
};

export const NDM_CONFIDENCE_STYLES: Record<string, string> = {
  Defensible: "bg-mint/15 text-mint-dark dark:text-mint border-mint/30",
  Risky: "bg-orange-500/15 text-orange-600 dark:text-orange-400 border-orange-500/30",
  "Usually wrong":
    "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/30",
};

export const NDM_MAX_CHARS = 500;
