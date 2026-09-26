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
    title: "Build the business that can think with you.",
    description: "Part people. Part agent. Led by judgement. Build your AI brain or your AI native pricing, positioning and organisation with Mindmake.",
    headline: "Build the business that can think with you.",
    claim: "Part people. Part agent. Led by judgement.",
    still: "film-02",
  },
  {
    path: "/ai-brain",
    title: "Build your AI brain",
    description: "Every AI you can buy already knows the market, and none of them know you. We help you build the one that does, private to you and at work in every AI you use.",
    headline: "Build your AI brain.",
    claim: "Private to you, and sharper with every call you make.",
    still: "film-02",
  },
  {
    path: "/ai-gtm",
    title: "Build your AI GTM",
    description: "Make your pricing, positioning and team AI-native, then test it with real buyers.",
    headline: "Build your AI GTM.",
    claim: "Make your pricing, positioning and team AI-native, then test it with real buyers.",
    still: "film-03",
  },
  {
    path: "/case-studies",
    title: "Success stories",
    description: "Eight verified stories about the work Mindmake helped customers change and what happened next.",
    headline: "Success stories.",
    still: "film-04",
  },
  {
    /* The page's own words, from src/pages/NewAgeLeadership.tsx. This entry
       carried the retired org-chart title and description into the served
       head for months after the page was rebuilt, because SEO.tsx writes the
       head in an effect and only this file reaches a crawler. */
    path: "/new-age-leadership",
    title: "Build the business that can think with you",
    description: "Build a hybrid organisation where AI carries the repeated work and people keep the judgement, relationships and decisions.",
    headline: "Build the business that can think with you.",
    claim: "You can hand over the work. You cannot hand over the understanding.",
    still: "film-05",
    ogType: "article",
    keywords: "AI leadership, hybrid organisation, AI Brain, human judgement",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: "Build the business that can think with you",
      description: "Build a hybrid organisation where AI carries the repeated work and people keep the judgement, relationships and decisions.",
      author: { "@type": "Organization", name: "Mindmake", url: site },
      publisher: { "@type": "Organization", name: "Mindmake", url: site },
      mainEntityOfPage: { "@type": "WebPage", "@id": `${site}/new-age-leadership` },
    },
  },
  {
    /* The one index of the quick tips and the longer reads (Krish,
       2026-09-25: /answers merged into this page and now redirects here). The
       pages under it are not listed here: the reads come from
       `src/data/blogPosts.ts` and the tips are markdown files read by
       `scripts/lib/answers-loader.mjs`, so publishing one is adding a file. */
    path: "/blog",
    title: "Ideas you can use",
    description: "Quick AI tips and longer reads for leaders making business decisions as AI changes their market, newest first.",
    headline: "Ideas you can use.",
    still: "film-04",
  },
  {
    path: "/faq",
    title: "Questions we get asked",
    description: "Straight answers about Mindmake: what the work builds, what it costs, whether anyone needs to know, what happens to your data and what you keep.",
    headline: "Questions we get asked.",
    still: "film-02",
  },
  {
    path: "/about",
    title: "About us",
    description: "Who runs Mindmake and why. Sixteen years building commercial teams in media, data and technology, now spent helping leaders use AI to make better decisions.",
    headline: "About us.",
    still: "film-01",
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

/** One still for every answer page, the same one its index wears. */
export const answerStill = "film-02";

/** The plate's two lines for a page or a post. */
export const plateWords = (page) => ({
  headline: page.headline ?? page.title,
  claim: page.claim ?? "",
});
