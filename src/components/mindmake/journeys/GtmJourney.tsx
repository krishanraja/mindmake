import { HumanHandoff } from "@/components/mindmake/HumanHandoff";
import { DetailsJourney, type Details } from "@/components/mindmake/journeys/DetailsJourney";
import { track } from "@/lib/analytics";

interface GtmJourneyProps {
  /** Hands the details to the brief dialog, which opens on the read. */
  onRead: (details: Details) => void;
}

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
      <DetailsJourney
        action="Read my business"
        onSubmit={submit}
        /* The same locked door as the other page, opened the same way. */
        onDeadEnd={(typed) => <HumanHandoff reason="personal-email" prefill={typed} />}
      />

    </div>
  );
}
