/** Invented layout examples. A kit becomes ready only after its installable
 * software, own-file behaviour and sample output have been accepted. */
export interface Kit {
  slug: string;
  name: string;
  problem: string;
  who: string;
  does: [string, string, string];
  firstFiveMinutes: [string, string, string];
  requirements: string[];
  sample: { title: string; rows: { label: string; text: string }[] };
  door: "ai-brain" | "ai-gtm";
  status: "ready" | "sample";
}

export const kits: Kit[] = [
  {
    slug: "board-update-check", name: "Board update check", status: "sample", door: "ai-brain",
    problem: "The board update is written, but the decisions inside it are still hard to find.",
    who: "You run the company.",
    does: ["Finds the decisions your update asks the board to make.", "Checks each claim against the files you supply.", "Separates what is known from what still needs an answer."],
    firstFiveMinutes: ["Open the kit in Claude Desktop.", "Choose your draft update and its supporting files.", "Read the checks and decide what to change."],
    requirements: ["Claude Desktop on Mac or Windows.", "Your board update and the files behind it."],
    sample: { title: "Board update check", rows: [
      { label: "Decision", text: "Approve the hiring plan, or wait for the renewal decision?" },
      { label: "Check", text: "The update assumes the renewal. The account notes still call it open." },
      { label: "Next question", text: "Who owns the renewal decision, and when will we know?" },
    ] },
  },
  {
    slug: "call-prep-from-your-own-files", name: "Call prep from your own files", status: "sample", door: "ai-brain",
    problem: "The context for your next conversation is scattered across your own notes.",
    who: "You back companies.",
    does: ["Brings together the context in the files you choose.", "Finds open questions and conflicting accounts.", "Prepares a brief you can check before the call."],
    firstFiveMinutes: ["Open the kit in Claude Desktop.", "Choose the notes for your next conversation.", "Read the brief and choose the questions that matter."],
    requirements: ["Claude Desktop on Mac or Windows.", "Your meeting notes and relevant documents."],
    sample: { title: "Before the call", rows: [
      { label: "Context", text: "The last conversation ended with an open question about the buyer." },
      { label: "Check", text: "The deck names the team. The notes name its finance lead." },
      { label: "Ask", text: "Whose approval turns interest into a purchase?" },
    ] },
  },
  {
    slug: "ad-spend-waste-finder", name: "Ad spend waste finder", status: "sample", door: "ai-gtm",
    problem: "The spend report shows activity without making the next budget decision clear.",
    who: "You run the market.",
    does: ["Checks the spend export you supply.", "Flags gaps between activity and the outcomes you track.", "Separates a possible cut from a measurement problem."],
    firstFiveMinutes: ["Open the kit in Claude Desktop.", "Choose your spend export and outcome definitions.", "Read the flagged rows and check the evidence."],
    requirements: ["Claude Desktop on Mac or Windows.", "Your advertising export and outcome definitions."],
    sample: { title: "Spend review", rows: [
      { label: "Observation", text: "The campaign has spend but no recorded qualified enquiries." },
      { label: "Check", text: "Enquiry tracking is missing from the export." },
      { label: "Before a cut", text: "Confirm the tracking before treating missing results as wasted spend." },
    ] },
  },
];

export function visibleKits(catalogue: readonly Kit[], environment: "production" | "preview" | "local"): Kit[] {
  return catalogue.filter(kit => kit.status === "ready" || environment !== "production");
}

export const KIT_PRICE_CENTS = 5900;
export const KIT_CURRENCY = "usd";
