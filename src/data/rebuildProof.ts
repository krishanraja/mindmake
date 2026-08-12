import bbcLogo from "@/assets/brands/bbc.svg";
import hearstLogo from "@/assets/brands/hearst.svg";
import condeNastLogo from "@/assets/brands/conde-nast.svg";

export type ClientStory = {
  id: string;
  title: string;
  outcome: string;
  quote: string;
  attribution: string;
};

export const attendeeBrands = [
  { name: "BBC", logo: bbcLogo },
  { name: "Hearst", logo: hearstLogo },
  { name: "Condé Nast", logo: condeNastLogo },
] as const;

export const clientStories: ClientStory[] = [
  {
    id: "expensive-decision",
    title: "Settle the expensive decision",
    outcome: "One day to a clear build-or-partner decision. This avoided about a year of work on the wrong path.",
    quote: "One day. One decision. No more Monday debates. That's the entire review.",
    attribution: "CRO, media company",
  },
  {
    id: "sellable-expertise",
    title: "Turn expertise into something clients can buy",
    outcome: "A respected advisory firm turned its ideas into a clear offer and a plan to launch it.",
    quote: "We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable.",
    attribution: "Managing Partner, TMT advisory",
  },
  {
    id: "simple-product",
    title: "Make the product simple enough to sell",
    outcome: "The position and price were rebuilt in 30 days. The first two pilots were signed during the work.",
    quote: "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me.",
    attribution: "Founder, adtech firm",
  },
  {
    id: "hand-back",
    title: "Rebuild the business, then hand it back",
    outcome: "An eight-week rebuild covered the brand, offers, lead capture, content and outreach. Five videos shipped in week one.",
    quote: "He uses deep knowledge of AI and tech to help me with genuinely human problems. I had an AI mentor before and they were far too technical. He thinks about me and the results I need.",
    attribution: "Founder and CEO, executive coaching practice",
  },
  {
    id: "own-system",
    title: "Own the system instead of renting the operator",
    outcome: "A founder-owned content system cut publishing time from days to under an hour. Publishing moved from about monthly to most days.",
    quote: "I've learnt to push through barriers I didn't know I could, and the systems make me more effective and more motivated. I used to post once a month, now it's most days. It's helping my customers see me.",
    attribution: "Founder, research and content brand",
  },
  {
    id: "team-decides",
    title: "Change how the team decides",
    outcome: "A publisher moved from 14 competing AI vendors to three decisions. Its own team then shipped the chosen work with no new hires.",
    quote: "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. He led it and landed it.",
    attribution: "Head of Operations, top-10 US digital publisher",
  },
  {
    id: "business-first",
    title: "Tie every AI choice back to the business",
    outcome: "Eleven of fourteen tools were stopped. The budget was kept and the first working system went live inside 90 days.",
    quote: "It's been a good journey to bring him problems that match our business goals and leadership needs, and watch them come together in a very thoughtful programme.",
    attribution: "President, legacy broadcast business",
  },
  {
    id: "market-moves",
    title: "Change direction before the market moves",
    outcome: "A data company changed how it sold as AI changed the web. The work led to a paid test with a major US publisher.",
    quote: "He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver.",
    attribution: "CRO, data-infrastructure company",
  },
];

export const careerReferences = [
  { name: "Lizzie Young", role: "Chief Executive, Commercial Radio & Audio", quote: "A respected senior leader with deep expertise in digital media and data, a great communicator of complexity, with a warm nature that brings people together." },
  { name: "Melinda Heffernan", role: "Ad Channel Partnerships Director APAC, Taboola", quote: "He explains complex technical set-ups simply and is a true problem solver. I learnt a huge amount about finding solutions for clients from him." },
  { name: "Chris Spencer", role: "Lead Account Executive, Enterprise, Culture Amp", quote: "An industry expert who turns knowledge into actionable plans and crafted solutions for clients." },
  { name: "Ashley Wales-Brown", role: "Digital Commerce Director, Mars United Commerce", quote: "Intelligent and hardworking, with a deep understanding of data and tech, always good for a straight answer and willing to get his hands dirty." },
  { name: "Matt Paine", role: "Managing Partner, Lamington Digital", quote: "Adept at translating complex scenarios into simple, easy-to-grasp language that moves the conversation forward." },
  { name: "Vincent Pelillo", role: "Regional Managing Director, Channel Factory", quote: "Outstanding leadership, consistently driving results in a challenging market. Where 'get it done' is valued, I'd rehire him 100%." },
] as const;
