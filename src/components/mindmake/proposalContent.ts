import type { PrivateBriefContent } from "@/components/mindmake/privateBriefHtml";
import { CONTACT_EMAIL } from "@/lib/publicLinks";

export interface ProposalContent extends PrivateBriefContent {
  preparedFor?: string;
  nextStep: "reply" | "keep";
}

/* The one private fact that would most change each read. Named honestly so
   the visitor can see where public research ends and the real work begins. */
const CANNOT_KNOW: Array<{ match: RegExp; fact: string }> = [
  { match: /context|searching/i, fact: "how much of what lives in your head your team can already reach without you" },
  { match: /avoid/i, fact: "which piece of avoided work is really about taste and which is about time" },
  { match: /room for important decisions/i, fact: "which decision is waiting on you right now, and what it costs each week it waits" },
  { match: /customers can now/i, fact: "what your best customers still ask you for that they could not get elsewhere" },
  { match: /price/i, fact: "what your last three renewals actually argued about" },
  { match: /message/i, fact: "which promise your sales conversations already make that the website does not" },
  { match: /building|moves|choose/i, fact: "which option your team privately believes in and has not said out loud" },
];

export const cannotKnowFor = (pressure: string) =>
  CANNOT_KNOW.find((entry) => entry.match.test(pressure))?.fact
    ?? "the one private constraint that would most change this read";

export const ILLUSTRATIVE_LINE =
  "This read is an illustrative example of how the Mindmake brain reads a business from the outside. It is not advice.";

export const DISCLAIMER_LINE =
  "This is a useful first view, not a promise or final answer. Mindmake uses the real business, the leader's judgement and real work to test what holds up.";

export interface ProposalSections {
  company: string;
  domain: string;
  preparedFor?: string;
  headline: string;
  read: { title: string; body: string; evidence: string[] };
  whyNow: string[];
  carries: { title: string; body: string };
  keeps: { title: string; body: string };
  proof: { title: string; body: string };
  returnedTime: { title: string; body: string };
  honesty: { cannotKnow: string; illustrative: string };
  disclaimer: string;
  nextStep: { title: string; body: string };
}

/* One content contract feeding both renderers: the on-screen proposal in
   the brief dialog and the downloadable single-file document. */
export const buildProposalSections = (content: ProposalContent): ProposalSections => ({
  company: content.company,
  domain: content.domain,
  preparedFor: content.preparedFor,
  headline: content.pressure,
  read: {
    title: `What Mindmake saw at ${content.company}`,
    body: content.known,
    evidence: content.evidence,
  },
  whyNow: content.evidence.slice(0, 2),
  carries: { title: "What AI can carry", body: content.carry },
  keeps: { title: "What stays yours", body: content.human },
  proof: { title: "A useful 30-day proof", body: content.proof },
  returnedTime: { title: "Where the returned time goes", body: content.capacityValue },
  honesty: {
    cannotKnow: `What I cannot know from the outside: ${cannotKnowFor(content.pressure)}.`,
    illustrative: ILLUSTRATIVE_LINE,
  },
  disclaimer: DISCLAIMER_LINE,
  nextStep: content.nextStep === "reply"
    ? { title: "The next step", body: "If this reads worth a conversation, reply to the email this brief came with. We read every reply." }
    : { title: "The next step", body: `Keep this copy. If you want us to see it, email ${CONTACT_EMAIL}.` },
});
