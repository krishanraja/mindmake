/**
 * "Instead of…": what a visitor would be left with on another route.
 *
 * One-off content for the closes of /ai-brain and /ai-gtm, not a design-system
 * component. Copy is the approved brief's, verbatim. Grades are honest and must
 * not be "improved": a board where every rival scores No reads as rigged.
 * Categories only, never company names; no prices; no fear.
 *
 * Each alternative is [name, grades, they give you, what's missing, prefer],
 * where grades is five letters (Y, P, N) in criteria order and prefer finishes
 * the nudge's "Prefer to ...?" at "Where would you start?".
 */
export type Grade = "Y" | "P" | "N";
export type CompareAlt = readonly [name: string, grades: string, give: string, missing: string, prefer: string];
export interface ComparePage {
  ask: string;
  criteria: readonly [string, string, string, string, string];
  ours: string;
  /** Index of the alternative chosen on load, so the verdict is never empty. */
  initial: number;
  alts: readonly CompareAlt[];
}

export const COMPARE: Record<"brain" | "gtm", ComparePage> = {
  brain: {
    ask: "What are you weighing up?",
    criteria: [
      "Makes you better, not just the task faster",
      "Leaves you a private AI brain you own",
      "That brain checks its own work",
      "Sharpens how you decide with AI",
      "Starts from your vision and standards",
    ],
    ours: "A private AI brain that holds your standards and checks its own work, and sharper judgement to go with it.",
    initial: 2,
    alts: [
      ["Online AI courses", "PNNPN", "Lessons, templates and prompts.", "Nothing gets built on your actual work.", "take an online AI course"],
      ["YouTube explainers", "NNNNN", "Free ideas, in bulk.", "No one checks any of it fits you.", "learn it from YouTube"],
      ["A chat AI on its own", "NNNPN", "A fast, capable assistant.", "It forgets your standards and tends to agree with you.", "just use a chat AI"],
      ["A company brain", "NNPNN", "One place for your people to search everything the company knows.", "It's built to keep what your people know for the company. It doesn't make you any sharper.", "build a company brain"],
      ["A strategy consultant", "PNNPP", "Advice and a deck.", "The thinking leaves when they do.", "hire a strategy consultant"],
      ["An AI automation shop", "NNPNN", "Today's tasks, automated.", "Faster at the old job, and no better at the next one.", "hire an automation shop"],
      ["A transformation partner", "NPPPP", "A large programme for the organisation.", "Built around the org chart, and slow to reach you.", "hire a transformation partner"],
      ["Hiring an AI lead", "PPNPP", "A capable person in-house.", "Slow to hire, and your judgement still isn't in the system.", "hire an AI lead"],
      ["Waiting until it settles", "NNNNN", "Nothing, yet.", "The gap widens while you wait.", "wait until it settles"],
    ],
  },
  gtm: {
    ask: "How would you make the call today?",
    criteria: [
      "Builds your team's judgement, not just an answer",
      "Leaves you an intelligence layer you own",
      "Checks each call against live market evidence",
      "Starts from your vision and standards",
      "Ends with a decision in use on real work",
    ],
    ours: "A live intelligence layer for price, product, positioning and people, and a team that decides better with it.",
    initial: 3,
    alts: [
      ["A strategy consultancy", "PNPPP", "A recommendation and a deck.", "The method leaves with them.", "hire a strategy consultancy"],
      ["A pricing or positioning agency", "NNPPP", "A new price list or new messaging.", "One answer, fixed on the day it ships.", "hire a pricing agency"],
      ["Market research reports", "NNPNN", "Data on your market.", "Out of date by the time you read it, and the call is still yours to make alone.", "buy market research"],
      ["A chat AI on its own", "NNNNP", "Fast drafts of any strategy.", "Confident answers that aren't checked against your market.", "just use a chat AI"],
      ["AI sales and outreach tools", "NNNNP", "More outreach, automated.", "More volume on the same price and the same message.", "buy AI outreach tools"],
      ["An AI automation shop", "NNNNP", "Today's processes, automated.", "A faster version of the go-to-market you already have.", "hire an automation shop"],
      ["A transformation partner", "NPPPP", "A programme across the company.", "Built around the org chart, and slow to reach the calls that matter now.", "hire a transformation partner"],
      ["Hiring a head of growth", "PPNPP", "A capable person in-house.", "One person's view, and slow to hire.", "hire a head of growth"],
      ["The team's gut feel", "NNNPP", "Quick decisions.", "Nothing checks them against what the market is doing now.", "go with the team's gut"],
      ["Waiting to see", "NNNNN", "Nothing, yet.", "Others move first and set the terms.", "wait and see"],
    ],
  },
};

export const GRADE_WORD: Record<Grade, string> = { Y: "Yes", P: "Partly", N: "No" };
