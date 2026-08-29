import { useId, useState } from "react";
import { Instrument } from "@/components/mindmake/Instrument";
import { DIVISIONS, workEmailProblem, domainFromEmail, type Division } from "@/lib/workEmail";

/**
 * The four things both pages ask for, asked the same way on both.
 *
 * /ai-brain used to open with "linkedin.com/in/you", which is a URL most people
 * have to go and find, and /ai-gtm asked for a company address. They collected
 * the same asset, a work email, at two different points and to two different
 * standards. They ask for the same four things now, in the same order, with the
 * same validation, and each page does its own thing with the answer.
 *
 * The email carries the company: its domain is what the read is built from, so
 * nobody has to type their company twice. That is also why a personal address
 * cannot be accepted, and the message for that case says the limitation is ours.
 */

export interface Details {
  firstName: string;
  lastName: string;
  email: string;
  division: Division;
  /** Derived from the email, so the caller never re-parses it. */
  domain: string;
}

interface DetailsJourneyProps {
  /** The label on the button. Each page promises its own thing. */
  action: string;
  busy?: boolean;
  busyLabel?: string;
  onSubmit: (details: Details) => void;
  /** Rendered under the fields: whatever the page wants asked as well. */
  children?: React.ReactNode;
}

export function DetailsJourney({ action, busy, busyLabel, onSubmit, children }: DetailsJourneyProps) {
  const id = useId();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [division, setDivision] = useState<Division | "">("");
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      setError("We need your name to find you. First and last is enough.");
      return;
    }
    const problem = workEmailProblem(email);
    if (problem) { setError(problem); return; }
    if (!division) { setError("Pick the part of the business you work in."); return; }
    setError("");
    onSubmit({
      firstName: firstName.trim().slice(0, 80),
      lastName: lastName.trim().slice(0, 80),
      email: email.trim().toLowerCase(),
      division,
      domain: domainFromEmail(email),
    });
  };

  return (
    <form className="mm-details" onSubmit={submit} noValidate>
      <div className="mm-details-pair">
        <p className="mm-details-field">
          <label htmlFor={`${id}-first`}>First name</label>
          <input
            id={`${id}-first`}
            autoComplete="given-name"
            value={firstName}
            onChange={(event) => { setFirstName(event.target.value); if (error) setError(""); }}
          />
        </p>
        <p className="mm-details-field">
          <label htmlFor={`${id}-last`}>Last name</label>
          <input
            id={`${id}-last`}
            autoComplete="family-name"
            value={lastName}
            onChange={(event) => { setLastName(event.target.value); if (error) setError(""); }}
          />
        </p>
      </div>

      <p className="mm-details-field">
        <label htmlFor={`${id}-email`}>Work email</label>
        <input
          id={`${id}-email`}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(event) => { setEmail(event.target.value); if (error) setError(""); }}
        />
        <small>We read your company from this, so it saves you typing it out.</small>
      </p>

      <fieldset className="mm-details-field mm-details-divisions">
        {/* The rail is who does the work, which is exactly what this asks. Every
            other question on the site carries the mark for the kind of thing it
            is, and these were the three that did not. */}
        <legend><Instrument kind="rail" className="mm-q-mark" />Which part of the business do you work in?</legend>
        <div className="mm-qchips">
          {DIVISIONS.map((entry) => (
            <button
              key={entry.id}
              className="mm-qchip"
              type="button"
              aria-pressed={division === entry.id}
              onClick={() => { setDivision(entry.id); if (error) setError(""); }}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </fieldset>

      {children}

      {error && <p className="mm-journey-error" role="alert">{error}</p>}

      <button className="mm-button" data-mm-primary type="submit" disabled={busy}>
        {busy ? (busyLabel ?? action) : action} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
