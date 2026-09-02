/**
 * Every testimonial the practice holds, verbatim.
 *
 * Two rules govern this file and a test enforces both.
 *
 * `full` is exactly what the person wrote. Not corrected, not anglicised, not
 * shortened, and not stripped of the founder's name. You cannot honestly quote
 * someone and also edit their spelling, so the house style rules that govern
 * the site's own voice stop at the quotation mark.
 *
 * `excerpt` is an exact substring of `full`. It exists because 33 quotes of
 * wildly different lengths cannot sit on one rail, and because the alternative
 * to an excerpt is a paraphrase, which is a quote that is no longer true. The
 * rail shows the excerpt; the full quote is one tap away.
 *
 * Four families, kept apart so they cannot be misread as one another. A session
 * attendee is not a client. A career reference is not an AI-era outcome.
 */

export type TestimonialFamily = "session" | "client" | "outcome" | "reference";

export type Testimonial = {
  id: string;
  family: TestimonialFamily;
  /** Present only where the person is named. Anonymised outcomes carry a role. */
  name?: string;
  /** Job title for a named voice, or role and sector for an anonymised one. */
  role: string;
  /** An exact substring of `full`. */
  excerpt: string;
  full: string;
  /**
   * Only a client named on the site carries this, and only where the consent is
   * on record. A missing or failed value hides the entry rather than showing it
   * unattributed.
   */
  consent?: "recorded";
};

export const testimonials: Testimonial[] = [
  /* ---- Sessions. People who attended a session, not clients. ---- */
  {
    id: "hui",
    family: "session",
    name: "Martin S. Hui",
    role: "General Counsel and Tech Ops Leader",
    excerpt: "you're the best communicator by far",
    full: "I've done a lot of learning and you're the best communicator by far.",
  },
  {
    id: "mazza",
    family: "session",
    name: "Mary Carol Mazza, PhD",
    role: "AI and Behavioural Scientist",
    excerpt: "Love your compassionate approach to AI",
    full: "Love your compassionate approach to AI...",
  },
  {
    id: "ellsworth",
    family: "session",
    name: "Shveta Ellsworth",
    role: "Session attendee",
    excerpt: "one of the most clearly structured sessions on building with AI today",
    full: "Probably one of the most clearly structured sessions on building with AI today! Thank you!",
  },
  {
    id: "magee",
    family: "session",
    name: "Travis Magee",
    role: "Session attendee",
    excerpt: "Hands down one of the most helpful sessions",
    full: "Hands down one of the most helpful sessions... literally mindset adjustment and what to do with examples.",
  },
  {
    id: "yazdani",
    family: "session",
    name: "Arash Yazdani",
    role: "Session attendee",
    excerpt: "a great wake-up call that there is much work to be done",
    full: "This is a great wake-up call that there is much work to be done before experimenting with open-source agent swarms",
  },

  /* ---- Clients who agreed to be named, with the consent on record. ---- */
  {
    id: "darmanin",
    family: "client",
    name: "Steph Darmanin",
    role: "Performance Coach",
    consent: "recorded",
    excerpt: "You get much more than what you're expecting, learn from a kind and dedicated accountability partner",
    full: "Everyone wants to learn AI skills, but it can be complex and overwhelming to go it alone. There are also a lot of smoke and mirrors out there, with many people claiming to be experts and appearing genuine in their promise to help you, but end up not following through on their commitments. Working with Krish was the opposite. You get much more than what you're expecting, learn from a kind and dedicated accountability partner, and the process is simple and straightforward.",
  },
  {
    id: "divekar",
    family: "client",
    name: "Dipti Divekar",
    role: "Performance Coach",
    consent: "recorded",
    excerpt: "He puts you in the driver's seat, explains AI fundamentals in plain language",
    full: "What's unique about Krish is that he never lets you become reliant on him. He puts you in the driver's seat, explains AI fundamentals in plain language, and empowers you to own the skills that actually move your business forward.",
  },
  {
    id: "gately",
    family: "client",
    name: "James Gately",
    role: "Founder, FinTech",
    consent: "recorded",
    excerpt: "With mind/make, I was empowered",
    full: "Previous support came to a halt once the paid engagement ended, and ultimately I had to pull the plug and start over. With mind/make, I was empowered on how to own the what I do next, which has brought me immense pride and satisfaction.",
  },
  {
    id: "thrave",
    family: "client",
    name: "Louisa Thrave",
    role: "CEO, Media",
    consent: "recorded",
    excerpt: "choose mindmake. You'll get all three.",
    full: "If you're deciding what next step to take to drive stronger business outcomes, and weighing up between a marketing professional, a sales expert, or an AI coach, choose mindmake. You'll get all three.",
  },

  /* ---- Client outcomes, anonymised to role and sector. ---- */
  {
    id: "data-infra-cro",
    family: "outcome",
    role: "Chief Revenue Officer, data-infrastructure company",
    excerpt: "an AI-native go-to-market system that made us rethink who we hire and what they do",
    full: "He set up an AI-native go-to-market system that made us rethink who we hire and what they do. He works experimentally yet transparently. We trusted he would deliver.",
  },
  {
    id: "adtech-founder",
    family: "outcome",
    role: "Founder, adtech firm",
    excerpt: "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me.",
    full: "We had a brilliant product nobody could buy, because nobody could explain it. Now they can. Including me.",
  },
  {
    id: "media-cro",
    family: "outcome",
    role: "Chief Revenue Officer, media company",
    excerpt: "One day. One decision. No more Monday debates.",
    full: "One day. One decision. No more Monday debates. That's the entire review.",
  },
  {
    id: "media-advisory-partner",
    family: "outcome",
    role: "Partner, media advisory",
    excerpt: "He turned the talking into something sellable.",
    full: "We had expertise everyone respected and nothing they could buy. He turned the talking into something sellable.",
  },
  {
    id: "publisher-ops",
    family: "outcome",
    role: "Head of Operations, top-10 US digital publisher",
    excerpt: "our team took ownership and accountability",
    full: "We started with immersive AI sessions, which led to a broader project where our team took ownership and accountability. Cheers to Krish for leading and landing.",
  },
  {
    id: "coaching-founder",
    family: "outcome",
    role: "Founder and CEO, executive coaching practice",
    excerpt: "Krish thinks about me and the results I need.",
    full: "The reason I'm loving Krish's sprints is the unique approach. He uses his incredible knowledge of AI and tech to help me with really human problems. I'd had an AI mentor before who was way too technical. Krish thinks about me and the results I need.",
  },
  {
    id: "broadcast-president",
    family: "outcome",
    role: "President, legacy broadcast business",
    excerpt: "watch them come together in a very thoughtful program",
    full: "It's been a good journey to bring Krish problems that match our business goals and leadership needs, and watch them come together in a very thoughtful program.",
  },
  {
    id: "breathwork-founder",
    family: "outcome",
    role: "Founder, research and content brand",
    excerpt: "I used to post once a month; now it's most days.",
    full: "Since working with Krish I've learnt to push through basic barriers I didn't realise I could, and he set up systems that make me more effective and more motivated. I used to post once a month; now it's most days. It's helping me be seen by my customers.",
  },
  {
    id: "services-ceo",
    family: "outcome",
    role: "CEO, mid-market services",
    excerpt: "for the first time I wasn't guessing",
    full: "I went into a board conversation on AI the week after our session and for the first time I wasn't guessing. I had the questions, I knew what to push on, and I didn't get cornered.",
  },
  {
    id: "b2b-coo",
    family: "outcome",
    role: "Chief Operating Officer, B2B technology",
    excerpt: "We killed a vendor proposal in about ten minutes because the assumptions didn't hold up.",
    full: "I expected another AI discussion. It wasn't. We killed a vendor proposal in about ten minutes because the assumptions didn't hold up. I forwarded the notes straight to my team and we moved on.",
  },
  {
    id: "fintech-founder",
    family: "outcome",
    role: "Founder, early-stage FinTech",
    excerpt: "He gave me the framework to decide for myself.",
    full: "I'd been going in circles for six months. Do we build our own AI underwriting model or use a vendor API? Krish didn't hand me a recommendation. He gave me the framework to decide for myself.",
  },
  {
    id: "saas-gtm",
    family: "outcome",
    role: "Go-to-market lead, Series C software company",
    excerpt: "Now when the board asks, I have real answers.",
    full: "Before the session I was fielding questions about our AI strategy and honestly making it up as I went. Krish helped me get clear on the three decisions that actually mattered. Now when the board asks, I have real answers.",
  },
  {
    id: "ops-vp",
    family: "outcome",
    role: "VP of Operations",
    excerpt: "forced us to decide what's actually strategic and what's just noise",
    full: "Everyone on the team was experimenting with AI: ChatGPT for this, Claude for that, some random automation tool from LinkedIn. It was chaos. The cohort forced us to decide what's actually strategic and what's just noise.",
  },
  {
    id: "scaleup-ops",
    family: "outcome",
    role: "Head of Operations, scale-up",
    excerpt: "I actually built two workflows in the session that I now use every day.",
    full: "I actually built two workflows in the session that I now use every day. Not experiments, real systems that made my week calmer almost immediately.",
  },

  /* ---- Career references. Named, and from before the AI work. ---- */
  {
    id: "pelillo",
    family: "reference",
    name: "Vincent Pelillo",
    role: "Regional Managing Director, Channel Factory",
    excerpt: "Krish demonstrated outstanding leadership, consistently driving results",
    full: "I had the pleasure of guiding and working with Krish during his time as Managing Director at Captify in Australia. Krish demonstrated outstanding leadership, consistently driving results while fostering a collaborative and motivating environment in a challenging market. His strategic vision and ability to navigate complex challenges helped our teams achieve remarkable success. Krish excels at building strong solutions and is highly respected by his peers and management. I would re hire Krish 100% if i had the opportunity to.",
  },
  {
    id: "young",
    family: "reference",
    name: "Lizzie Young",
    role: "Chief Executive, Commercial Radio and Audio",
    excerpt: "a great communicator of complexity and a warm nature that brings people together",
    full: "Krish is a respected senior leader with deep subject matter expertise in the digital media and data domains. He has experience in different environments ranging from corporate to start up and has built teams from the ground up displaying his entrepreneurial approach while being equally comfortable playing that role in more traditional organisations as well. The other wonderful attribute Krish brings is his very human approach - a great communicator of complexity and a warm nature that brings people together.",
  },
  {
    id: "leung-kam",
    family: "reference",
    name: "Marie-Anne Leung Kam",
    role: "Director, 2 Square Talent",
    excerpt: "an outstanding leader with a clear vision, a collaborative approach",
    full: "I've had the pleasure of knowing Krish for most of his career way back to when he started in digital advertising at Microsoft Advertising in London. Krish is an outstanding leader with a clear vision, a collaborative approach, results driven and has a knack for driving innovation. He's a true professional at the forefront of the digital tech industry, and I couldn't recommend him more highly.",
  },
  {
    id: "paine",
    family: "reference",
    name: "Matt Paine",
    role: "Managing Partner, Lamington Digital",
    excerpt: "articulate complex scenarios in simple and easy to grasp language",
    full: "Krish was the conduit between our front line sales team and our data science product team - having come from the sales side he was adept at understanding our needs and what outcome would be best suited to the end client. His in depth knowledge of our back end systems enabled him to articulate complex scenarios in simple and easy to grasp language that helped our clients better understand how we could help them to move the conversation forward.",
  },
  {
    id: "spencer",
    family: "reference",
    name: "Chris Spencer",
    role: "Lead Account Executive, Enterprise, Culture Amp",
    excerpt: "turn this knowledge into actionable plans to take to market",
    full: "Krish is first and foremost an industry expert when it comes to all things Programmatic, Performance & Audience. His wealth of experience allows him to turn this knowledge into actionable plans to take to market, and even more importantly deliver a crafted solution for clients. Working closely with Krish on numerous projects at Nine, I found him to be a brilliant presenter, who is able to clearly articulate both internally and in market, the dynamic space that he operates in.",
  },
  {
    id: "hudson",
    family: "reference",
    name: "Rob Hudson",
    role: "National Sales Director, Media, REA Group",
    excerpt: "making the world of programmatic & data products accessible to all in the room",
    full: "Krish has a unique ability of making the world of programmatic & data products accessible to all in the room- not just the 'digital' people. A strong presenter; Krish's enthusiasm for what he does is immediately apparent to all he meets, with a genuine passion for helping clients solve problems facing their business with the help of data. Above all else, he's a great guy- very personable and approachable.",
  },
  {
    id: "ricciardone",
    family: "reference",
    name: "Michael Ricciardone",
    role: "Country Manager, ANZ, MoEngage",
    excerpt: "Articulate, engaging & entertaining.",
    full: "Articulate, engaging & entertaining. Krish explores all the barriers advertisers & marketers experience with data & technology, breaks them all down with relevant examples & stories and presents clear solutions. Full of support, Krish is always keen to educate & assist his peers.",
  },
  {
    id: "heffernan",
    family: "reference",
    name: "Melinda Heffernan",
    role: "Ad Channel Partnerships Director, Asia-Pacific, Taboola",
    excerpt: "He is able to explain complex technical set ups and is a true problem solver.",
    full: "Working with Krish was a great experience. In my early career I learnt a lot about sales and how to find solutions for clients from him. He is able to explain complex technical set ups and is a true problem solver. Not to mention he is really fun to work with!",
  },
  {
    id: "kinchin",
    family: "reference",
    name: "Joseph Kinchin",
    role: "Business Development Director, ROAS media",
    excerpt: "a leading thinker in the ever evolving Programmatic and Data industry",
    full: "Krish has proven himself a leading thinker in the ever evolving Programmatic and Data industry. His deep understand of both data and tech allows him concisely articulating the problems and solutions that are relevant for the present and in the future. In both roles where Krish has serviced us he has driven positive advertising outcomes through tangible advancements.",
  },
  {
    id: "wales-brown",
    family: "reference",
    name: "Ashley Wales-Brown",
    role: "Digital Commerce Director, Mars United Commerce",
    excerpt: "could be relied on for a straight answer plus a willingness to get his hands dirty",
    full: "Krish and I worked together whilst at Nine and it was a great partnership. Intelligent, hardworking plus a deep understanding of data and tech. A solid team member, respected by all those he worked with, could be relied on for a straight answer plus a willingness to get his hands dirty to solve issues whilst maintaining a great sense of humour.",
  },
];

/**
 * What the rail is allowed to show.
 *
 * A named client without recorded consent is dropped rather than anonymised,
 * because an anonymised version of a quote somebody agreed to give under their
 * own name is a different quote.
 */
export const publishableTestimonials = testimonials.filter(
  (voice) => voice.family !== "client" || voice.consent === "recorded",
);

export const FAMILY_LABEL: Record<TestimonialFamily, string> = {
  session: "Session",
  client: "Client",
  outcome: "Client outcome",
  reference: "Career reference",
};
