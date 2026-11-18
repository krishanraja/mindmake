/** Parts of a leader's AI brain. Internal commerce identifiers stay stable. */
export interface Kit {
  slug: string;
  name: string;
  problem: string;
  strengthens: string;
  does: [string, string, string];
  firstFiveMinutes: [string, string, string];
  requirements: string[];
  /** Verbatim report wording supplied by Krish, 17 November 2026. */
  checks: string;
  whoDecided: string;
  door: "ai-brain";
  status: "ready" | "sample";
}

export const kits: Kit[] = [
  {
    "name": "Fact-check my board update",
    "slug": "fact-check-board-update",
    "problem": "Every claim traced to a source before it goes to the board.",
    "strengthens": "Your ability to tell what the evidence supports before you put your name to it.",
    "does": [
      "A trace from each claim to the source you supplied.",
      "Missing or conflicting evidence brought into view.",
      "Claims that need your judgement before you speak."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose what you are about to say and the files behind it.",
      "Read the result and decide which claims you can stand behind."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "the claims in your update for matching wording, conflicting numbers and explicit negation in your evidence.",
    "whoDecided": "whether the evidence is trustworthy and the update gives the board a fair account of the business."
  },
  {
    "name": "Fact-check an email before I send it",
    "slug": "fact-check-email",
    "problem": "Every name, figure and quote checked before it leaves your outbox.",
    "strengthens": "Your judgement about which details in a draft are fit to send.",
    "does": [
      "Names, figures and quotations traced to your source files.",
      "Details that disagree with the source or have no trace.",
      "Checks to resolve before the draft goes out."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose your draft and its source files.",
      "Read the result and decide what to correct or leave out."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "the names, figures and quotations in your draft against your notes.",
    "whoDecided": "whether each claim is true in context, correctly attributed and right to send."
  },
  {
    "name": "Check a number before I rely on it",
    "slug": "check-a-number",
    "problem": "Whether a figure is sound enough to decide on or report.",
    "strengthens": "Your judgement about whether a figure can carry the conclusion you want to draw.",
    "does": [
      "A check of the number against the records behind it.",
      "Its definition, comparison and gaps brought into view.",
      "Unresolved questions to settle before reporting."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose the figures you plan to report and their supporting records.",
      "Read the result and decide what is fit to report."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "the ratio arithmetic, reporting dates, cohort details, repeated measurements and missing sources behind your metrics.",
    "whoDecided": "whether the underlying measurements are reliable and answer the question you need to decide."
  },
  {
    "name": "Brief me before a meeting",
    "slug": "meeting-brief",
    "problem": "What your own files already say about the person, and what is missing.",
    "strengthens": "Your ability to enter a conversation knowing what is established and what you still need to ask.",
    "does": [
      "Relevant context from your own notes.",
      "A distinction between what was said and what was inferred.",
      "Named gaps to consider before the conversation."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose your notes about the person you are meeting.",
      "Read the result and decide which questions matter."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "your own files for who they are, what was last said, open questions and gaps in the record.",
    "whoDecided": "which questions matter for this conversation and how to respond to what the other person says."
  },
  {
    "name": "Work out my lowest price",
    "slug": "lowest-price",
    "problem": "Your price floor, from your own costs and margin.",
    "strengthens": "Your ability to hold a price against the costs and standards you have chosen.",
    "does": [
      "A price floor grounded in your own inputs.",
      "The costs and standards behind that floor.",
      "Assumptions you need to settle before quoting."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose your costs, proposed scope and pricing standards.",
      "Read the result and decide whether the work meets your standards."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "the minimum price that meets your target margin from your costs, payment fees and refund reserve.",
    "whoDecided": "whether customers will pay that price and whether your costs and assumptions reflect your business."
  },
  {
    "name": "Test a discount before I agree to it",
    "slug": "test-a-discount",
    "problem": "What it really costs, and how many extra sales it needs to pay for itself.",
    "strengthens": "Your ability to judge a concession against your own commercial standards.",
    "does": [
      "The proposed discount measured against your costs.",
      "The effect on what you keep from the work.",
      "Assumptions and trade-offs behind the concession."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose your price, costs and the proposed discount.",
      "Read the result and decide whether the concession is worth making."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "what the discount does to your contribution and the extra sales needed to keep it whole.",
    "whoDecided": "whether the discount will bring enough extra demand and whether you can fulfil those sales."
  },
  {
    "name": "Audit a decision I made with AI",
    "slug": "audit-a-decision",
    "problem": "Where your judgement held and where you handed it over, kept as a running record.",
    "strengthens": "Your ability to recognise where AI helped your judgement and where you stopped making the call.",
    "does": [
      "Six questions about one decision you made with AI.",
      "A record of where your judgement held and where you handed it over.",
      "A running record you can return to before your next decision."
    ],
    "firstFiveMinutes": [
      "Open this brain module in Claude Desktop.",
      "Choose one decision you made with AI and the files behind it.",
      "Work through the six questions and keep the record for your next decision."
    ],
    "requirements": [
      "Claude Desktop on Mac or Windows."
    ],
    "door": "ai-brain",
    "status": "ready",
    "checks": "your own account of how you made this decision, against six questions.",
    "whoDecided": "whether your account is honest, and what you will do differently next time."
  }
];

export function visibleKits(catalogue: readonly Kit[], environment: "production" | "preview" | "local"): Kit[] {
  return catalogue.filter(kit => kit.status === "ready" || environment !== "production");
}
export const KIT_PRICE_CENTS = 5900;
export const KIT_CURRENCY = "usd";
