import { useEffect, useRef, useState } from "react";
import { Instrument } from "@/components/mindmake/Instrument";
import { DetailsJourney, type Details, type PartialDetails } from "@/components/mindmake/journeys/DetailsJourney";
import {
  HANDOFF_ACTION,
  HANDOFF_ACTION_BUSY,
  HANDOFF_COPY,
  HANDOFF_DONE_BODY,
  HANDOFF_DONE_TITLE,
  HANDOFF_LAST_RESORT,
  HANDOFF_TRIGGER,
  type HandoffReason,
} from "@/content/handoff";
import { track } from "@/lib/analytics";
import { postPersonalRead } from "@/lib/personalReadClient";
import { CONTACT_EMAIL } from "@/lib/publicLinks";

interface HumanHandoffProps {
  reason: HandoffReason;
  /**
   * The four details, when the page already holds them. By the time most of
   * these failures happen it does, and asking a second time at the moment
   * somebody has been let down is a second letting down. With details, this is
   * one button.
   */
  details?: Details | null;
  /**
   * What they had already typed when the form stood aside for this.
   *
   * The address rule is the one dead end reached mid-form, so the four fields
   * are half filled rather than empty. Carrying them across means the visitor
   * finishes the one they had not reached instead of typing their name twice.
   */
  prefill?: PartialDetails;
  /** A quiet way back to whatever failed, where trying again is worth offering. */
  onRetry?: () => void;
  retryLabel?: string;
  /**
   * Stays a single quiet line until it is asked for.
   *
   * Used where a live form is still on screen: a full panel there would be a
   * second door beside a working one, and the site's rule is one way in.
   */
  asTrigger?: boolean;
}

type Sending = "idle" | "sending" | "sent" | "failed";

/**
 * The offer at the end of every dead end.
 *
 * Nine things on this site can fail, and each of them used to finish on a grey
 * line of text with nothing under it. The worst case was the honest one: the
 * read gate deciding a company could not be written about well enough to send,
 * saying so, and leaving a real person who had typed four true details with no
 * way forward at all. Refusing to send something generic is right. Refusing and
 * then closing the door is not.
 *
 * So each failure ends here instead: an apology, one dry line where the machine
 * rather than the visitor is the butt of the joke, and one button. Nothing is
 * asked for that the page already knows.
 *
 * The visitor gets no email from this. Two emails, ever, is a published promise
 * in the canon and a handoff is neither of them: the operator is told, and a
 * person replies as a person.
 */
export function HumanHandoff({ reason, details, prefill, onRetry, retryLabel, asTrigger }: HumanHandoffProps) {
  const [open, setOpen] = useState(!asTrigger);
  const [sending, setSending] = useState<Sending>("idle");
  const copy = HANDOFF_COPY[reason];
  /* One event per offer shown, not one per render. StrictMode mounts twice in
     development and a ref is what keeps the count honest in both. */
  const announced = useRef(false);

  useEffect(() => {
    if (!open || announced.current) return;
    announced.current = true;
    track("handoff_offer", { reason });
  }, [open, reason]);

  const request = async (person: Details) => {
    setSending("sending");
    try {
      const response = await postPersonalRead({
        action: "handoff",
        reason,
        first_name: person.firstName,
        last_name: person.lastName,
        division: person.division,
        email: person.email,
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      if (data?.status !== "received") throw new Error("not-received");
      setSending("sent");
      track("handoff_request", { reason });
    } catch {
      /* The dead end that fails to fail. If even this cannot get through, the
         visitor is handed an address rather than a spinner. */
      setSending("failed");
    }
  };

  if (!open) {
    return (
      <button className="mm-handoff-trigger" type="button" onClick={() => setOpen(true)}>
        {HANDOFF_TRIGGER}
      </button>
    );
  }

  if (sending === "sent") {
    return (
      <div className="mm-handoff is-done" role="status">
        <Instrument kind="flap" />
        <p className="mm-handoff-sorry">{HANDOFF_DONE_TITLE}</p>
        <p className="mm-handoff-aside">{HANDOFF_DONE_BODY}</p>
      </div>
    );
  }

  return (
    <div className="mm-handoff">
      <div className="mm-handoff-say" role="alert">
        <Instrument kind="flap" />
        <p className="mm-handoff-sorry">{copy.sorry}</p>
        <p className="mm-handoff-aside">{copy.aside}</p>
      </div>

      {details ? (
        <div className="mm-handoff-do">
          <button
            className="mm-button"
            data-mm-primary
            type="button"
            disabled={sending === "sending"}
            onClick={() => void request(details)}
          >
            {sending === "sending" ? HANDOFF_ACTION_BUSY : HANDOFF_ACTION} <span aria-hidden="true">→</span>
          </button>
          {onRetry && (
            <button className="mm-handoff-trigger" type="button" onClick={onRetry}>
              {retryLabel ?? "Or try that again"}
            </button>
          )}
        </div>
      ) : (
        /* No second form. The one every page already uses, with the company
           rule off, because this visitor is asking for a person and not a read. */
        <DetailsJourney
          action={HANDOFF_ACTION}
          busy={sending === "sending"}
          busyLabel={HANDOFF_ACTION_BUSY}
          emailRule="any"
          emailHint="Wherever you would rather we replied."
          initial={prefill}
          onSubmit={(person) => void request(person)}
        />
      )}

      {sending === "failed" && (
        <p className="mm-handoff-last" role="alert">
          {HANDOFF_LAST_RESORT} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
        </p>
      )}
    </div>
  );
}
