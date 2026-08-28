import { useState } from "react";
import { track } from "@/lib/analytics";
import { cleanDomain, isPublicHostname } from "@/lib/domain";

interface GtmJourneyProps {
  /** Hands the validated domain to the brief dialog, which opens on the read. */
  onRead: (domain: string) => void;
}

const STEPS = [
  {
    number: "01",
    title: "We read you, live",
    body: "Your sector, your competitors and your pricing position, pulled while you watch.",
  },
  {
    number: "02",
    title: "A proposal built for you",
    body: "Your levers, your numbers, your next move.",
  },
  {
    number: "03",
    title: "One email. That is it.",
    body: "Your proposal, our private terms and a call link. We never mail you again except one follow-up.",
  },
];

/**
 * The company read, started from the page.
 *
 * This is the shipped enrichment and proposal machinery made prominent, not a
 * second pipeline: the input validates a domain and hands it straight to the
 * brief dialog, which opens on the live read it would have run anyway.
 */
export function GtmJourney({ onRead }: GtmJourneyProps) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    const domain = cleanDomain(value);
    if (!isPublicHostname(domain)) {
      setError("That does not look like a company web address. Try yourcompany.com.");
      return;
    }
    setError("");
    track("journey_gtm_start", { domain });
    onRead(domain);
  };

  return (
    <div className="mm-journey">
      <div className={`mm-journey-bar${value.trim() ? " has-text" : ""}`}>
        <label className="mm-visually-hidden" htmlFor="gtm-journey-domain">Your company web address</label>
        <input
          id="gtm-journey-domain"
          type="text"
          inputMode="url"
          autoComplete="url"
          placeholder="yourcompany.com"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              submit();
            }
          }}
        />
        <button type="button" onClick={submit}>Read my business</button>
      </div>

      {error && <p className="mm-journey-error" role="alert">{error}</p>}

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
