/**
 * The indexed pages, in one place.
 *
 * `scripts/prerender.mjs` writes each page's head from this list and
 * `scripts/social-plates.mjs` paints each page's social plate from it, so the
 * words a crawler reads and the words a share card shows cannot drift apart.
 * The page's own words, from its component; `headline` and `claim` are the
 * plate's two lines where the title is a label rather than a sentence, and
 * `still` names the film whose first frame sits behind them.
 */
export const site = "https://mindmake.co";

export const staticPages = [
  {
    path: "/",
    title: "See what is coming for your business before it is obvious.",
    description: "Mindmake works with leaders in private: where you stand, what is coming, what to do first, built into an AI that knows how you work and stays yours.",
    headline: "See what is coming for your business before it is obvious.",
    claim: "Then act on it with an AI that knows how you work, and keep the edge.",
    still: "film-01",
  },
  {
    path: "/ai-brain",
    title: "Build your AI brain",
    description: "An AI that knows how you work: your standards, your context and the decisions you have already made. Built with you in private, and yours to keep.",
    headline: "Build your AI brain.",
    claim: "Your AI should already know how you work.",
    still: "film-02",
  },
  {
    path: "/ai-gtm",
    title: "Build your AI GTM",
    description: "AI is changing what customers will pay for. We rebuild one part of how you sell and prove it with real buyers before we leave.",
    headline: "Build your AI GTM.",
    claim: "AI is changing what customers will pay for.",
    still: "film-03",
  },
  {
    path: "/case-studies",
    title: "Results",
    description: "Eight verified stories about the work Mindmake helped customers change and what happened next.",
    headline: "The decision, and what changed next.",
    still: "film-04",
  },
  {
    /* The page's own words, from src/pages/NewAgeLeadership.tsx. This entry
       carried the retired org-chart title and description into the served
       head for months after the page was rebuilt, because SEO.tsx writes the
       head in an effect and only this file reaches a crawler. */
    path: "/new-age-leadership",
    title: "What a leader does with the hours AI gives back",
    description: "AI gives a leader hours back every week. What the hours go into decides whether the leader gets better at the job or only faster at the work.",
    headline: "What a leader does with the hours AI gives back.",
    claim: "You can hand over the work. You cannot hand over the understanding.",
    still: "film-05",
    ogType: "article",
    keywords: "AI and leadership, resistance to new technology, AI org chart, human judgement",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "You can hand over the work",
      description: "AI gives a leader hours back every week. What the hours go into decides whether the leader gets better at the job or only faster at the work.",
      author: { "@type": "Organization", name: "Mindmake", url: site },
      publisher: { "@type": "Organization", name: "Mindmake", url: site },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${site}/new-age-leadership` },
    },
  },
  {
    path: "/blog",
    title: "Ideas for better AI decisions",
    description: "Useful questions, checks and working methods for leaders making business decisions as AI changes their market.",
    headline: "Ideas you can use.",
    still: "film-04",
  },
  {
    path: "/faq",
    title: "Straight answers",
    description: "Straight answers about Mindmake: what the work builds, what it costs, whether anyone needs to know, what happens to your data and what you keep.",
    headline: "Straight answers.",
    still: "film-02",
  },
  {
    path: "/contact",
    title: "Contact",
    description: "Send Mindmake a general message.",
    headline: "Say hello.",
    still: "film-01",
  },
  {
    path: "/privacy",
    title: "Privacy policy",
    description: "How Mindmake collects, uses and protects information.",
    headline: "Privacy policy.",
    still: "film-05",
  },
  {
    path: "/terms",
    title: "Terms and conditions",
    description: "Terms for using the Mindmake website and services.",
    headline: "Terms and conditions.",
    still: "film-05",
  },
];

/** A post's still, by what it is about. */
export const stillForCategory = {
  implementation: "film-01",
  "ai-literacy": "film-02",
  strategy: "film-03",
  leadership: "film-05",
};

/** The plate's two lines for a page or a post. */
export const plateWords = (page) => ({
  headline: page.headline ?? page.title,
  claim: page.claim ?? "",
});
