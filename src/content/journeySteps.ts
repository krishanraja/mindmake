/**
 * What happens after the four details, in three rows, for each door.
 *
 * They used to be rendered at the foot of each journey's form, which put a
 * description of what comes next under a form nobody had filled in yet: 386px
 * of a 1,655px section on a 360px phone. They are the promise, so they belong
 * above the ask, and the pages render them in the section that makes it.
 *
 * Here rather than beside either component, because a module that exports a
 * component and a constant is a module Fast Refresh cannot reload, and because
 * both doors say the same three things in their own words.
 */

export interface JourneyStep {
  number: string;
  title: string;
  body: string;
}

/** The GTM door: the read is about the market. */
export const GTM_STEPS: readonly JourneyStep[] = [
  {
    number: "01",
    title: "We read your market",
    body: "Your sector, who you compete with and where your prices sit, pulled together while you watch.",
  },
  {
    number: "02",
    title: "A plan built for you",
    body: "What we would change first, with your numbers rather than a general example.",
  },
  {
    number: "03",
    title: "One email, and that is it",
    /* The two-email cap, in the visitor's own words rather than in a
       privacy note nobody opens. `brief2-journeys.test.tsx` holds it. */
    body: "Your plan, our terms and a link to talk. We write once more after two weeks, and never again.",
  },
] as const;

/** The brain door: the same shape, but the read ends up on the reader's week. */
export const BRAIN_STEPS: readonly JourneyStep[] = [
  {
    number: "01",
    title: "We read your company",
    body: "What it sells and how it talks about itself, pulled together from public sources while you watch.",
  },
  {
    number: "02",
    title: "Then we read your week",
    body: "What the same picture means for the work only you can do, rather than for the business in general.",
  },
  {
    number: "03",
    title: "One email, and that is it",
    body: "Week one written out, our terms, and nothing else afterwards.",
  },
] as const;
