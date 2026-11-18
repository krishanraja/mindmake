export const THESIS = "AI makes strong judgement stronger and weak judgement weaker. Mindmake builds the strong kind.";
export const SUBTITLE = "One real decision. Six questions. A private read of where your judgement held, and where you handed it over.";
export const LEVELS = ["Aware", "Supported", "Independent", "Adapting"] as const;
export type Level = typeof LEVELS[number];
type Option = { level: Level; text: string; meaning: string };
type Step = { id: string; title: string; question: string; prompt: string; options: readonly Option[]; practice: string };

export const STEPS: readonly Step[] = [
  {
    id: "decision", title: "The decision", question: "What did you decide, and what else did you weigh?",
    prompt: "Bring one real decision from the last month where AI played a part. Keep it in mind or name it in your private note.",
    options: [
      { level: "Aware", text: "I can name the decision. I went with the first workable answer.", meaning: "You can name the call, but did not weigh another real option." },
      { level: "Supported", text: "AI or someone else helped me compare the options.", meaning: "You compared options with help. You have not yet shown how you would weigh them alone." },
      { level: "Independent", text: "I weighed real options myself and checked what each would cost us.", meaning: "You weighed the options and checked their costs yourself." },
      { level: "Adapting", text: "When the situation changed, I changed how I compared the options and checked again.", meaning: "You changed your method when the situation changed, then checked the options again." },
    ],
    practice: "Before asking AI, write down the decision and two real options, including leaving things as they are. Name what would make you choose each one.",
  },
  {
    id: "evidence", title: "The evidence", question: "How did you check the claims behind the answer?",
    prompt: "Think about the claim that mattered most to your decision.",
    options: [
      { level: "Aware", text: "I can name a key claim. I took the AI’s word for it.", meaning: "You can name a key claim, but took it on trust." },
      { level: "Supported", text: "With help, I opened an original source and checked the claim.", meaning: "You checked a claim against an original source with help." },
      { level: "Independent", text: "I found the original sources myself and checked the key claims in context.", meaning: "You checked the key claims against original sources yourself." },
      { level: "Adapting", text: "When sources conflicted or no longer fitted, I changed how I checked and tested the claims again.", meaning: "You adapted your checks when the evidence conflicted or no longer fitted." },
    ],
    practice: "Pick the claim that would change your decision if it were wrong. Find its original source and check what it actually says, when it was written and what it leaves out.",
  },
  {
    id: "standard", title: "The standard", question: "Without the tool, how did you know it was good enough?",
    prompt: "Think about the standard you used before making the call.",
    options: [
      { level: "Aware", text: "I knew what the answer was for, but had no clear way to judge it.", meaning: "You knew the purpose, but had no clear standard for accepting the answer." },
      { level: "Supported", text: "I needed AI or someone else to help me say what good enough meant.", meaning: "You named a standard with help, rather than setting it alone." },
      { level: "Independent", text: "I set the standard myself and checked the answer against it without AI.", meaning: "You set and applied your own standard without the tool." },
      { level: "Adapting", text: "When the stakes changed, I revised my standard and checked the answer again.", meaning: "You revised your standard to fit changed stakes and checked again." },
    ],
    practice: "Before opening the tool, finish this sentence: ‘I will accept an answer only if…’ Name something you can check, then use it on the answer.",
  },
  {
    id: "numbers", title: "The numbers", question: "Which number moved you, and what could it hide?",
    prompt: "Think about what you compared it with. If no number drove the call, consider whether one was missing.",
    options: [
      { level: "Aware", text: "I can name the number, or the gap. I did not check a comparison.", meaning: "You can name a number or a missing measure, but did not test it against a comparison." },
      { level: "Supported", text: "With help, I checked a comparison and what might make it misleading.", meaning: "You tested the number and its limits with help." },
      { level: "Independent", text: "I checked the comparison and the limits myself, or checked why no number was needed.", meaning: "You checked the measure and its limits yourself, or checked why it did not belong." },
      { level: "Adapting", text: "When conditions changed, I changed the measure or comparison and tested it again.", meaning: "You changed the measure or comparison to fit new conditions, then tested it again." },
    ],
    practice: "Write the number that matters beside a fair comparison. Name one thing it leaves out. If no number belongs in the call, write why.",
  },
  {
    id: "handover", title: "The handover", question: "What thinking did you hand over, and did you take it back?",
    prompt: "Think about who framed the problem, weighed the trade-offs and made the final call.",
    options: [
      { level: "Aware", text: "I can name what AI did. I accepted its thinking without working through it myself.", meaning: "You can name the work AI did, but did not take its reasoning back into your own hands." },
      { level: "Supported", text: "With help, I worked through the AI’s reasoning before deciding.", meaning: "You took the reasoning back with help before making the call." },
      { level: "Independent", text: "I worked through the reasoning myself and made a call I could explain without AI.", meaning: "You checked the reasoning yourself and could explain your own call." },
      { level: "Adapting", text: "When AI missed something, I changed what I gave it and checked the new reasoning myself.", meaning: "You changed the handover after a miss and checked the reasoning yourself." },
    ],
    practice: "After AI answers, close it. Explain your choice and its main trade-off in your own words. Reopen it only after naming what you still need to check.",
  },
  {
    id: "pattern", title: "The pattern", question: "What has AI learned about your judgement, and who could own it?",
    prompt: "Think about your standards, habits and corrections. Would you be comfortable if your company owned that record?",
    options: [
      { level: "Aware", text: "I can name a habit I have shown AI. I have not checked what it keeps or who controls it.", meaning: "You can name a pattern you have shared, but have not checked who controls the record." },
      { level: "Supported", text: "With help, I checked what AI keeps and considered what I would let my company own.", meaning: "You considered the record and its ownership with help." },
      { level: "Independent", text: "I checked what is kept and who controls it, then set my own boundary for what I share.", meaning: "You checked control of the record and set your own sharing boundary." },
      { level: "Adapting", text: "When the tool or company rules changed, I checked again and changed what I share.", meaning: "You revisited the record and changed your boundary when the conditions changed." },
    ],
    practice: "Name one part of your judgement you would not want your company to own. Check the tool’s memory and your company’s rules before sharing another example of it.",
  },
];

export const FACTS = [
  { text: "Across 106 experiments, people working with AI did better when they were already better than the AI at the task, and worse when they were not.", attribution: "Vaccaro, Almaatouq and Malone, Nature Human Behaviour, 2024.", href: "https://www.nature.com/articles/s41562-024-02024-1" },
  { text: "Consultants given AI on a task beyond what it could do were 19 percentage points less likely to get it right.", attribution: "Dell'Acqua et al., Harvard Business School and BCG, 2023 (758 consultants).", href: "https://aiinstitute.hbs.edu/navigating-the-jagged-technological-frontier/" },
  { text: "Knowledge workers who trusted AI more reported thinking less critically; those more confident in their own judgement thought more critically.", attribution: "Lee et al., Carnegie Mellon and Microsoft Research, CHI 2025 (319 knowledge workers, self-reported).", href: "https://www.microsoft.com/en-us/research/publication/the-impact-of-generative-ai-on-critical-thinking-self-reported-reductions-in-cognitive-effort-and-confidence-effects-from-a-survey-of-knowledge-workers/" },
] as const;

/** Incomplete or invalid answers produce no read. Equal levels keep step order. */
export function readDecision(answers: readonly (Level | null)[]) {
  if (answers.length !== STEPS.length || STEPS.some((_, index) => !LEVELS.includes(answers[index] as Level))) return null;
  const lines = STEPS.map((step, index) => ({
    id: step.id, title: step.title, level: answers[index] as Level,
    meaning: step.options.find(option => option.level === answers[index])!.meaning,
    practice: step.practice,
  }));
  const first = lines.reduce((weakest, line) => LEVELS.indexOf(line.level) < LEVELS.indexOf(weakest.level) ? line : weakest);
  return { lines, first };
}
