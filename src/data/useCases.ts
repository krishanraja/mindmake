import founderPlate from "@/assets/stories/founder-pantograph-r01-800.webp";
import pressPlate from "@/assets/stories/proofing-press-r01-800.webp";
import updatesPlate from "@/assets/stories/updates-seal-r01-800.webp";
import receiverPlate from "@/assets/stories/one-way-receiver-r01-800.webp";
import sightPlate from "@/assets/stories/method-sight-r01-800.webp";
import briefingPlate from "@/assets/stories/briefing-tray-r01-800.webp";
import telescopePlate from "@/assets/stories/window-telescope-r01-800.webp";
import pricingPlate from "@/assets/stories/pricing-balance-r01-800.webp";
import workbenchPlate from "@/assets/stories/workbench-gears-r01-800.webp";
import voicePlate from "@/assets/stories/voice-pipe-r01-800.webp";
import cardsPlate from "@/assets/stories/punched-cards-r01-800.webp";
import folioPlate from "@/assets/stories/shared-folio-r01-800.webp";
import stencilPlate from "@/assets/stories/stencil-correction-r01-800.webp";
import orreryPlate from "@/assets/stories/orrery-alignment-r01-800.webp";
import prismPlate from "@/assets/stories/prism-light-r01-800.webp";
import boundFolioPlate from "@/assets/stories/bound-folio-r01-800.webp";
import drawerPlate from "@/assets/stories/index-drawer-r01-800.webp";
import switchPlate from "@/assets/stories/switch-panel-r01-800.webp";
import { canShowStoryQuote, quoteById, testimonials } from "@/data/testimonials";

/**
 * The eighteen use cases, one record each (content source of 15 November
 * 2026, project-documentation/04_PROOF.md).
 *
 * A use case owns its heading, outcome, starting point, what we did, picture
 * and the quote that belongs to it. Eight also hold their result on the
 * record, inside the same entry: there is no second inventory of results, and
 * every page that shows a use case or a result reads it from here. The words
 * are the content source's, character for character
 * (src/test/use-case-parity.test.ts); a page that needs to hold two words on
 * one line does that where it renders them, never here.
 *
 * Quotes are not copied into this file. A use case names its quote by id, and
 * the full text, the attribution and the exact part shown on the use case live
 * on that quote's one record in src/data/testimonials.ts.
 *
 * `evidence` says what the entry rests on, as a code for checks rather than
 * words for the page: a result on the record, or the practice's own account of
 * the engagement (with a client quote, or with a figure the owner reported).
 */

export type UseCaseId =
  | "C-01" | "C-02" | "C-03" | "C-04" | "C-05" | "C-06" | "C-07" | "C-08" | "C-09"
  | "C-10" | "C-11" | "C-12" | "C-13" | "C-14" | "C-15" | "C-16" | "C-17" | "C-18";

/** The two products a use case belongs to: the content source's "AI brain" and "AI business" types. */
export type Door = "brain" | "gtm";
export const DOOR_LABEL = { brain: "AI brain", gtm: "AI business" } as const;

export type SituationId = "back" | "terms" | "calls" | "try" | "brief" | "yours";

/** Result ids are live link fragments (/case-studies#story=<id>), so they keep their names. */
export type ResultId =
  | "own-system" | "hand-back" | "simple-product" | "market-moves"
  | "day-one" | "sellable-expertise" | "team-decides" | "business-first";

export type Evidence = "result" | "practice-account" | "practice-account-quote" | "practice-account-figure";

/** Who the use case is about, only as the entry itself names them (`roleWords`). */
export type Role =
  | "founder" | "chief-executive" | "chief-revenue-officer" | "head-of-operations"
  | "investor" | "partners" | "leader" | "team" | "organisation";

export interface UseCaseResult {
  id: ResultId;
  headline: string;
  detail: string;
  /** The quote that goes with the result, by its id in testimonials.ts. */
  quoteId: string;
}

export interface UseCase {
  id: UseCaseId;
  heading: string;
  outcome: string;
  startingPoint: string;
  whatWeDid: string;
  /** The scene from the instrument room: mood, never evidence. */
  picture: string;
  /** The quote shown on the use case, by id; its words are that quote's `useCaseExcerpts[id]`. */
  quoteId?: string;
  evidence: Evidence;
  /** A figure in the outcome and where it comes from. */
  figure?: { words: string; source: "owner-reported" };
  result?: UseCaseResult;
  industry: string;
  door: Door;
  role: Role;
  /** The words in the heading or starting point that name the role. */
  roleWords: string;
}

export interface Situation {
  id: SituationId;
  label: string;
  useCases: readonly UseCaseId[];
}

export const SITUATIONS: readonly Situation[] = [
  { id: "back", label: "Back the work you believe in, and say exactly why.", useCases: ["C-18", "C-05"] },
  { id: "terms", label: "Take the money without giving away the ending.", useCases: [] },
  { id: "calls", label: "Make the big call well, and the next one without starting again.", useCases: ["C-15", "C-17", "C-08", "C-07"] },
  { id: "try", label: "Try the idea you would never have reached on your own.", useCases: ["C-02", "C-11", "C-09", "C-10"] },
  { id: "brief", label: "Hand over a brief without losing the point of it.", useCases: ["C-13", "C-14", "C-12", "C-03", "C-06"] },
  { id: "yours", label: "Keep what makes your work yours, wherever it travels.", useCases: ["C-16", "C-01", "C-04"] },
];

export const useCases: readonly UseCase[] = [
  {
    id: "C-01",
    heading: "A founder who posted about once a month now posts most days.",
    outcome: "A post backed by research now takes under an hour.",
    startingPoint: "The founder runs a research and content brand. Publishing a post backed by research took days.",
    whatWeDid: "We set up an AI system that the founder owns. It fits around what they do and where they get stuck.",
    picture: founderPlate,
    quoteId: "wellness-founder",
    evidence: "result",
    result: {
      id: "own-system",
      headline: "Publishing moved from monthly to most days.",
      detail: "A founder-owned content system cut publishing time from days to under an hour. Publishing moved from about monthly to most days.",
      quoteId: "wellness-founder",
    },
    industry: "Research and content",
    door: "brain",
    role: "founder",
    roleWords: "The founder runs",
  },
  {
    id: "C-02",
    heading: "A CEO who hates writing can still publish ideas worth following.",
    outcome: "Five videos went out in the first week.",
    startingPoint: "The CEO of an executive coaching practice avoided posting and being seen. They knew a modern chief executive should be visible.",
    whatWeDid: "Their AI brain helps them get better at the things they avoided or felt held up by. Now they can just publish.",
    picture: pressPlate,
    quoteId: "coaching-founder",
    evidence: "result",
    result: {
      id: "hand-back",
      headline: "The business was rebuilt and left in the founder's hands.",
      detail: "An eight-week rebuild covered the brand, offers, lead capture, content and outreach. Five videos shipped in week one.",
      quoteId: "coaching-founder",
    },
    industry: "Executive coaching",
    door: "brain",
    role: "chief-executive",
    roleWords: "The CEO of an executive coaching practice",
  },
  {
    id: "C-03",
    heading: "Leadership updates become consistent, even when the week was not.",
    outcome: "A patchy week no longer means patchy updates.",
    startingPoint: "The leader's updates used to depend on how their week had gone. A patchy week meant patchy updates.",
    whatWeDid: "Their AI brain knows that risk. It helps them get each update out, whatever the week has been like.",
    picture: updatesPlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "brain",
    role: "leader",
    roleWords: "The leader's updates",
  },
  {
    id: "C-04",
    heading: "A fintech leader who networks less now still hears what her market says.",
    outcome: "She feels more informed, and no customer data ever leaves her business.",
    startingPoint: "A senior fintech leader used to hear her industry's news by networking. She can do far less of that now, and cannot share customer data.",
    whatWeDid: "We built her a one-way feed: the world outside her business, brought to her. Nothing goes out, so no customer data leaves.",
    picture: receiverPlate,
    evidence: "practice-account",
    industry: "Fintech",
    door: "brain",
    role: "leader",
    roleWords: "A senior fintech leader",
  },
  {
    id: "C-05",
    heading: "An investor buying companies now watches his market through his own method.",
    outcome: "It flags the signals he looks for, so he can stay ahead as more investors move into his area.",
    startingPoint: "An investor looking to buy companies reads the market with his own method. More investors are moving into his area.",
    whatWeDid: "We turned his method into a system that watches for the outside signals it looks for, so his reading of the market keeps up.",
    picture: sightPlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "brain",
    role: "investor",
    roleWords: "An investor looking to buy companies",
  },
  {
    id: "C-06",
    heading: "A CEO who read many newsletters every morning now gets one briefing.",
    outcome: "One briefing is waiting for him each morning.",
    startingPoint: "The chief executive subscribed to many newsletters. His morning briefing meant checking them one by one, by hand.",
    whatWeDid: "We built him an AI brain that reads them for him.",
    picture: briefingPlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "brain",
    role: "chief-executive",
    roleWords: "The chief executive subscribed",
  },
  {
    id: "C-07",
    heading: "A leader who only heard from inside now sees what is changing outside.",
    outcome: "It gives them an edge over competitors and brings them closer to customers.",
    startingPoint: "The leader only had company data and their own people to go on. They had never thought of AI as a way to learn what was happening outside.",
    whatWeDid: "What we built brings them research on their company, their market and current events, only when it could change a decision.",
    picture: telescopePlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "brain",
    role: "leader",
    roleWords: "The leader only had",
  },
  {
    id: "C-08",
    heading: "A change in market pricing becomes a decision, not a forgotten observation.",
    outcome: "The price was clear within 30 days, and the first two customers signed up to trial it.",
    startingPoint: "The founder of an adtech firm and their leadership team kept coming back to pricing. They had the same conversation hundreds of times.",
    whatWeDid: "Now they treat that repetition as a signal to act. When pricing comes up again, the conversation ends in a decision.",
    picture: pricingPlate,
    quoteId: "martech-founder",
    evidence: "result",
    result: {
      id: "simple-product",
      headline: "Two pilots signed during the work.",
      detail: "The position and price were rebuilt in 30 days. The first two pilots were signed during the work.",
      quoteId: "martech-founder",
    },
    industry: "Adtech",
    door: "brain",
    role: "founder",
    roleWords: "The founder of an adtech firm",
  },
  /* Getting hands-on again. C-09 and C-10 carry the shorter headings approved
     on 15 November 2026 (src/test/use-case-parity.test.ts, HEADING_RULINGS). */
  {
    id: "C-09",
    heading: "A head of operations is hands-on again, building systems from the best of what's new and proven, fitted to their exact work.",
    outcome: "Their week felt calmer almost at once.",
    startingPoint: "The leader is head of operations at a scale-up, a fast-growing company. They manage people and wanted to be hands-on again.",
    whatWeDid: "In a session with us, they built two real, working systems.",
    picture: workbenchPlate,
    quoteId: "scaleup-ops",
    evidence: "practice-account-quote",
    industry: "Sector not recorded",
    door: "brain",
    role: "head-of-operations",
    roleWords: "head of operations at a scale-up",
  },
  {
    id: "C-10",
    heading: "Someone new to AI now talks their own dashboard into existence, anchored to their north star values.",
    outcome: "They talked it into being, at least five times faster than AI alone, and far more accurately.",
    startingPoint: "A member of the team was new to AI. They needed a dashboard for the accounts they look after.",
    whatWeDid: "Their AI brain guided them as they built it, with the right data underneath and the company's own voice.",
    picture: voicePlate,
    evidence: "practice-account-figure",
    figure: { words: "at least five times faster than AI alone", source: "owner-reported" },
    industry: "Sector not recorded",
    door: "brain",
    role: "team",
    roleWords: "A member of the team",
  },
  {
    id: "C-11",
    heading: "A CRO who struggles with spreadsheets can become better at using them.",
    outcome: "The company changed how it sells, and that led to a paid trial with a major US publisher.",
    startingPoint: "The chief revenue officer at a data-infrastructure company was fine with numbers but bad with spreadsheets.",
    whatWeDid: "Now they play to their strengths. They reliably build their own AI agents, helpers that handle the work they hated.",
    picture: cardsPlate,
    quoteId: "data-infra-cro",
    evidence: "result",
    result: {
      id: "market-moves",
      headline: "A new sales path led to a paid publisher test.",
      detail: "A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.",
      quoteId: "data-infra-cro",
    },
    industry: "Data infrastructure",
    door: "brain",
    role: "chief-revenue-officer",
    roleWords: "The chief revenue officer at",
  },
  {
    id: "C-12",
    heading: "Teams working on the same account stop asking each other the same questions.",
    outcome: "The repeated questions stopped.",
    startingPoint: "Different teams worked on the same accounts. The same questions kept going back and forth between them.",
    whatWeDid: "Each person's AI brain now knows what the other teams already know about an account, including who already looks after it.",
    picture: folioPlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "gtm",
    role: "team",
    roleWords: "Different teams worked",
  },
  {
    id: "C-13",
    heading: "One person corrected it once, and everyone's AI got better that day.",
    outcome: "That same day, the fix reached everyone it applied to, and only them.",
    startingPoint: "One person kept being told something by their AI that had stopped being true.",
    whatWeDid: "They corrected it once.",
    picture: stencilPlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "gtm",
    role: "team",
    roleWords: "everyone's AI",
  },
  {
    id: "C-14",
    heading: "A team's account plans now serve the division's goals and the CEO's vision.",
    outcome: "It tells the CEO when someone senior needs them to step in.",
    startingPoint: "A team looked after a few large accounts. Their plans, the division's goals and the chief executive's direction sat in different places.",
    whatWeDid: "Each person's AI brain now works with the division's and the CEO's. It maps each account's health and its contacts by seniority.",
    picture: orreryPlate,
    evidence: "practice-account",
    industry: "Sector not recorded",
    door: "gtm",
    role: "team",
    roleWords: "A team looked after",
  },
  {
    id: "C-15",
    heading: "Two quarters of argument over build or partner ended in one day.",
    outcome: "The partner agreement was signed the following month.",
    startingPoint: "The chief revenue officer of a media company had spent two quarters refereeing one argument: build it themselves, or partner.",
    whatWeDid: "We worked it through with the room in one day. The answer was to partner now, and look at building again in twelve months, once the data is stronger.",
    picture: prismPlate,
    quoteId: "media-cro",
    evidence: "result",
    result: {
      id: "day-one",
      headline: "A day's work, and a partner signed the month after.",
      detail: "Two quarters of argument over build or partner ended in one day in the room. The partner agreement was signed the following month, and build comes back for review in twelve months, once the data is stronger.",
      quoteId: "media-cro",
    },
    industry: "Media",
    door: "gtm",
    role: "chief-revenue-officer",
    roleWords: "The chief revenue officer of",
  },
  {
    id: "C-16",
    heading: "Media advisers turned their expertise into an offer clients could buy.",
    outcome: "Their expertise became an offer people could buy.",
    startingPoint: "The partners at a media advisory firm had expertise everyone respected, but nothing a client could simply buy.",
    whatWeDid: "We turned their ideas into one clear offer and a plan to launch it.",
    picture: boundFolioPlate,
    quoteId: "media-advisory-partner",
    evidence: "result",
    result: {
      id: "sellable-expertise",
      headline: "Expertise became an offer people could buy.",
      detail: "A respected advisory firm turned its ideas into a clear offer and a plan to launch it.",
      quoteId: "media-advisory-partner",
    },
    industry: "Media",
    door: "gtm",
    role: "partners",
    roleWords: "The partners at a media advisory firm",
  },
  {
    id: "C-17",
    heading: "A publisher weighing up fourteen AI suppliers made three decisions.",
    outcome: "Its own team built the chosen work, with no new hires.",
    startingPoint: "A top-10 US digital publisher had fourteen AI suppliers competing for its business.",
    whatWeDid: "It started with hands-on AI sessions. From there, the fourteen became three decisions.",
    picture: drawerPlate,
    quoteId: "publisher-ops",
    evidence: "result",
    result: {
      id: "team-decides",
      headline: "Fourteen vendors became three decisions.",
      detail: "A publisher moved from 14 competing AI vendors to three decisions. Its own team then shipped the chosen work with no new hires.",
      quoteId: "publisher-ops",
    },
    industry: "Media",
    door: "gtm",
    role: "organisation",
    roleWords: "A top-10 US digital publisher",
  },
  {
    id: "C-18",
    heading: "A broadcaster stopped eleven of its fourteen AI tools and kept its budget.",
    outcome: "Its first working system went live inside 90 days.",
    startingPoint: "A legacy broadcast business had fourteen AI tools on the go.",
    whatWeDid: "We tied every AI choice back to the business. Eleven of the fourteen tools stopped, and the budget stayed.",
    picture: switchPlate,
    evidence: "result",
    result: {
      id: "business-first",
      headline: "The team cut eleven tools and put one useful system live.",
      detail: "Eleven of fourteen tools were stopped. The budget was kept and the first working system went live inside 90 days.",
      quoteId: "broadcast-president",
    },
    industry: "Media",
    door: "gtm",
    role: "organisation",
    roleWords: "A legacy broadcast business",
  },
];

/* Checked when the module loads, so a broken reference fails the build rather
   than rendering an empty card. */
const quoteIds = new Set(testimonials.map((quote) => quote.id));
const filed = SITUATIONS.flatMap((situation) => situation.useCases);
if (new Set(filed).size !== filed.length || filed.length !== useCases.length) throw new Error("Every use case belongs to exactly one situation");
for (const entry of useCases) {
  if (!filed.includes(entry.id)) throw new Error(`${entry.id} is in no situation`);
  if ((entry.evidence === "result") !== Boolean(entry.result)) throw new Error(`${entry.id}: a result on the record and its evidence disagree`);
  if (entry.figure && !entry.outcome.includes(entry.figure.words)) throw new Error(`${entry.id}: the figure is not in the outcome`);
  if (entry.quoteId) {
    const quote = testimonials.find((candidate) => candidate.id === entry.quoteId);
    if (!quote) throw new Error(`${entry.id}: no quote with id "${entry.quoteId}"`);
    const excerpt = quote.useCaseExcerpts?.[entry.id];
    if (!excerpt || !quote.full.includes(excerpt)) throw new Error(`${entry.id}: the quote's use-case excerpt is missing or not part of it`);
  }
  if (entry.result && !quoteIds.has(entry.result.quoteId)) throw new Error(`${entry.id}: no quote with id "${entry.result.quoteId}"`);
}

export function getUseCase(id: UseCaseId): UseCase {
  const found = useCases.find((entry) => entry.id === id);
  if (!found) throw new Error(`No use case with id "${id}"`);
  return found;
}

export function situationOf(id: UseCaseId): Situation {
  const found = SITUATIONS.find((situation) => situation.useCases.includes(id));
  if (!found) throw new Error(`${id} is in no situation`);
  return found;
}

/** The eight results on the record, each with the use case it belongs to. */
export const results = useCases.flatMap((entry) => (entry.result ? [{ useCase: entry.id, ...entry.result }] : []));

export function resultById(id: ResultId) {
  const found = results.find((result) => result.id === id);
  if (!found) throw new Error(`No result with id "${id}"`);
  return found;
}

/** The use case a quote belongs to, where it belongs to one. */
export function useCaseForQuote(quoteId: string): UseCaseId | undefined {
  return useCases.find((entry) => entry.quoteId === quoteId || entry.result?.quoteId === quoteId)?.id;
}

/** Select the existing passage for this story. An excluded passage has no substitute. */
export function storyQuoteFor(entry: UseCase) {
  const id = entry.quoteId ?? entry.result?.quoteId;
  if (!id) return;
  const voice = quoteById(id);
  const text = entry.quoteId ? voice.useCaseExcerpts?.[entry.id] : voice.excerpt;
  if (text && canShowStoryQuote(text)) return { testimonialId: id, text };
}

/** Media results lead the full index. Within each evidence group, keep the wish order. */
const mediaLeads: readonly UseCaseId[] = ["C-15", "C-17", "C-18", "C-16"];
const orderedRecords = [...new Set([...mediaLeads, ...filed])].map(getUseCase);
export const storiesInDisplayOrder = [
  ...orderedRecords.filter((entry) => entry.result),
  ...orderedRecords.filter((entry) => !entry.result),
];
