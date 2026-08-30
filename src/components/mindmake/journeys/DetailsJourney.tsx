import { useId, useState } from "react";
import { Instrument } from "@/components/mindmake/Instrument";
import { HANDOFF_TRIGGER } from "@/content/handoff";
import {
  DIVISIONS,
  FREE_EMAIL_PROBLEM,
  anyEmailProblem,
  workEmailProblem,
  domainFromEmail,
  type Division,
} from "@/lib/workEmail";

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
 *
 * One of those messages is a dead end rather than a typo. Somebody working for
 * themselves cannot go and get a work address, and until now the form simply
 * held the door shut on them. `onDeadEnd` is how they get out: a quiet line
 * under the error, and the form stands aside for whatever the page offers
 * instead. It stands aside rather than sitting underneath because the offer
 * carries its own form, and a form inside a form is not a thing a browser will
 * do.
 */

export interface Details {
  firstName: string;
  lastName: string;
  email: string;
  division: Division;
  /** Derived from the email, so the caller never re-parses it. */
  domain: string;
}

/** What somebody had typed at the moment the form gave up on them. */
export type PartialDetails = Partial<Omit<Details, "division">> & { division?: Division | "" };

interface DetailsJourneyProps {
  /** The label on the button. Each page promises its own thing. */
  action: string;
  busy?: boolean;
  busyLabel?: string;
  onSubmit: (details: Details) => void;
  /** Rendered under the fields: whatever the page wants asked as well. */
  children?: React.ReactNode;
  /**
   * Which addresses are allowed.
   *
   * "work" is the rule everywhere a read is being built, because the read comes
   * out of the domain and a personal address gives it nothing. "any" is for the
   * handoff form alone, where somebody is asking to reach a person rather than
   * to be read: refusing them there would be the site enforcing a rule for a job
   * it has already stopped doing, and turning a rescue into a second refusal.
   */
  emailRule?: "work" | "any";
  /** Replaces the standard help line under the address field. */
  emailHint?: string;
  /** Fills the fields in from what was typed before the form stood aside. */
  initial?: PartialDetails;
  /**
   * What to offer when the address rule is the thing standing in their way.
   *
   * Only the personal-address message reaches this. Every other message here is
   * answered by fixing what was typed, and offering a way out of a typo would
   * be offering a way out of nothing.
   */
  onDeadEnd?: (typed: PartialDetails) => React.ReactNode;
}

export function DetailsJourney({
  action,
  busy,
  busyLabel,
  onSubmit,
  children,
  emailRule = "work",
  emailHint,
  initial,
  onDeadEnd,
}: DetailsJourneyProps) {
  const id = useId();
  const [firstName, setFirstName] = useState(initial?.firstName ?? "");
  const [lastName, setLastName] = useState(initial?.lastName ?? "");
  const [email, setEmail] = useState(initial?.email ?? "");
  const [division, setDivision] = useState<Division | "">(initial?.division ?? "");
  const [error, setError] = useState("");
  const [stoodAside, setStoodAside] = useState(false);
  /* Which field the error is about, so it can be linked to it rather than only
     announced beside the form. A `role="alert"` block reaches a screen reader
     once, when it appears; `aria-describedby` is what a reader gets when they
     land back on the field to fix it, and it is what marks the field invalid
     for anyone navigating by field. */
  const [errorField, setErrorField] = useState<"name" | "email" | "division" | null>(null);
  const errorId = `${useId()}-error`;

  const typed = (): PartialDetails => ({
    firstName: firstName.trim().slice(0, 80),
    lastName: lastName.trim().slice(0, 80),
    email: email.trim().toLowerCase(),
    division,
  });

  const fail = (field: "name" | "email" | "division", message: string) => {
    setErrorField(field);
    setError(message);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim()) {
      fail("name", "We need your name to find you. First and last is enough.");
      return;
    }
    const problem = emailRule === "any" ? anyEmailProblem(email) : workEmailProblem(email);
    if (problem) { fail("email", problem); return; }
    if (!division) { fail("division", "Pick the part of the business you work in."); return; }
    setErrorField(null);
    setError("");
    onSubmit({
      firstName: firstName.trim().slice(0, 80),
      lastName: lastName.trim().slice(0, 80),
      email: email.trim().toLowerCase(),
      division,
      domain: domainFromEmail(email),
    });
  };

  if (stoodAside && onDeadEnd) return <>{onDeadEnd(typed())}</>;

  return (
    <form className="mm-details" onSubmit={submit} noValidate>
      <div className="mm-details-pair">
        <p className="mm-details-field">
          <label htmlFor={`${id}-first`}>First name</label>
          <input
            id={`${id}-first`}
            autoComplete="given-name"
            aria-invalid={errorField === "name" || undefined}
            aria-describedby={errorField === "name" ? errorId : undefined}
            value={firstName}
            onChange={(event) => { setFirstName(event.target.value); if (error) { setError(""); setErrorField(null); } }}
          />
        </p>
        <p className="mm-details-field">
          <label htmlFor={`${id}-last`}>Last name</label>
          <input
            id={`${id}-last`}
            autoComplete="family-name"
            aria-invalid={errorField === "name" || undefined}
            value={lastName}
            onChange={(event) => { setLastName(event.target.value); if (error) { setError(""); setErrorField(null); } }}
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
          aria-invalid={errorField === "email" || undefined}
          aria-describedby={errorField === "email" ? errorId : undefined}
          placeholder="you@company.com"
          value={email}
          onChange={(event) => { setEmail(event.target.value); if (error) { setError(""); setErrorField(null); } }}
        />
        <small>{emailHint ?? "We read your company from this, so it saves you typing it out."}</small>
      </p>

      <fieldset className="mm-details-field mm-details-divisions" aria-invalid={errorField === "division" || undefined} aria-describedby={errorField === "division" ? errorId : undefined}>
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
              onClick={() => { setDivision(entry.id); if (error) { setError(""); setErrorField(null); } }}
            >
              {entry.label}
            </button>
          ))}
        </div>
      </fieldset>

      {children}

      {error && (
        <div className="mm-journey-error" role="alert">
          <p id={errorId}>{error}</p>
          {error === FREE_EMAIL_PROBLEM && onDeadEnd && (
            <button className="mm-handoff-trigger" type="button" onClick={() => setStoodAside(true)}>
              {HANDOFF_TRIGGER}
            </button>
          )}
        </div>
      )}

      <button className="mm-button" data-mm-primary type="submit" disabled={busy}>
        {busy ? (busyLabel ?? action) : action} <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
