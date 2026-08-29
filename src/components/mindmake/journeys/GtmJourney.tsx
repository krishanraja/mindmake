import { DetailsJourney, type Details } from "@/components/mindmake/journeys/DetailsJourney";
import { track } from "@/lib/analytics";

interface GtmJourneyProps {
  /** Hands the details to the brief dialog, which opens on the read. */
  onRead: (details: Details) => void;
}

const STEPS = [
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
    body: "Your plan, our terms and a link to talk. We write once more after two weeks, and never again.",
  },
];

/**
 * The company read, started from the page.
 *
 * This is the shipped enrichment and proposal machinery made prominent, not a
 * second pipeline: the details hand straight to the brief dialog, which opens on
 * the live read it would have run anyway.
 *
 * It used to ask for a company web address alone while /ai-brain asked for a
 * LinkedIn URL, so the same work email arrived by two routes at two standards.
 * Both pages ask for the same four things now; the company comes out of the
 * email, and the dialog still requires the six-digit code before anything about
 * this visitor reaches us.
 */
export function GtmJourney({ onRead }: GtmJourneyProps) {
  const submit = (details: Details) => {
    track("journey_gtm_start", { domain: details.domain, division: details.division });
    onRead(details);
  };

  return (
    <div className="mm-journey">
      <DetailsJourney action="Read my business" onSubmit={submit} />

      <div className="mm-journey-steps">
        {STEPS.map((step) => (
          <article className="mm-journey-step" key={step.number}>
            <b>{step.number}</b>
            <strong>{step.title}</strong>
            <span>{step.body}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
