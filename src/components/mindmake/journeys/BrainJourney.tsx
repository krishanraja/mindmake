import { useState } from "react";
import { HumanHandoff } from "@/components/mindmake/HumanHandoff";
import { Instrument } from "@/components/mindmake/Instrument";
import { DetailsJourney, type Details } from "@/components/mindmake/journeys/DetailsJourney";
import { WEEK_ONE_QUESTIONS, CLOSING_LINE, type Q1, type Q2 } from "@/content/personalRead";
import type { HandoffReason } from "@/content/handoff";
import { track } from "@/lib/analytics";
import { postPersonalRead } from "@/lib/personalReadClient";

type SendState = "idle" | "sending" | "sent" | "failed";

/** What the server assembles and the page puts on screen. */
interface Read {
  opening: string;
  lines: string[];
  company?: string;
  companyOnly: boolean;
}

/**
 * See it read you.
 *
 * It used to ask for a LinkedIn URL and then compose a preview locally from two
 * template lines, so the thing on screen was the same for everyone who tapped
 * the same two chips. It asks for the four things every page asks for now, and
 * the read comes back from the server built from the company behind the email
 * and the part of the business the visitor works in.
 *
 * That trades certainty for substance: the old preview could never fail and
 * could never say anything specific. This one waits a few seconds and can come
 * back knowing only the division, which is why the degraded read is written to
 * be worth reading on its own and says plainly what it did not find.
 */
export function BrainJourney() {
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const [details, setDetails] = useState<Details | null>(null);
  const [read, setRead] = useState<Read | null>(null);
  const [reading, setReading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [send, setSend] = useState<SendState>("idle");
  /* Which dead end we are standing in, or null. Three of the four ways the read
     can end badly used to collapse into one sentence about trying again, which
     is advice a visitor has already taken by the time they read it. */
  const [stuck, setStuck] = useState<HandoffReason | null>(null);

  const start = async (entered: Details) => {
    if (!q1 || !q2) {
      setPrompt("Tap one answer in each question and this becomes yours.");
      return;
    }
    setPrompt("");
    setStuck(null);
    setReading(true);
    setDetails(entered);
    track("journey_brain_read", { division: entered.division, q1, q2 });
    try {
      const response = await postPersonalRead({
        action: "preview",
        first_name: entered.firstName,
        last_name: entered.lastName,
        division: entered.division,
        email: entered.email,
        q1,
        q2,
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      /* The server read its own work and would not stand behind it. Saying so
         is better than putting a generic paragraph on screen with their name on
         it, which is exactly what this whole gate exists to stop. */
      if (data?.status === "not_worth_sending") {
        setStuck("read-refused");
        return;
      }
      if (!data?.read) throw new Error("no-read");
      setRead(data.read as Read);
    } catch (caught) {
      /* The limiter is its own dead end and reads nothing like a fault: the cap
         is ours, it cannot tell a robot from somebody interested, and telling
         them to try again in a moment would be telling them to trip it again. */
      setStuck(caught instanceof Error && caught.message === "429" ? "read-rate-limited" : "read-failed");
    } finally {
      setReading(false);
    }
  };

  const sendFull = async () => {
    if (!details || !q1 || !q2) return;
    setSend("sending");
    try {
      const response = await postPersonalRead({
        action: "send",
        first_name: details.firstName,
        last_name: details.lastName,
        division: details.division,
        email: details.email,
        q1,
        q2,
      });
      if (!response.ok) throw new Error(String(response.status));
      const data = await response.json();
      // Never claim a delivery the server did not accept.
      if (data?.status !== "queued") throw new Error("not-queued");
      setSend("sent");
      track("journey_brain_email");
    } catch {
      setSend("failed");
    }
  };

  if (read) {
    return (
      <div className="mm-journey">
        {/* The same grid the company read assembles into on /ai-gtm, because
            this is the same kind of object and a second design for it would be
            two houses' worth of layout for one idea. */}
        <div className="mm-brief-result-grid">
          <article className="is-wide is-read"><small>Your week, from the outside</small><p>{read.opening}</p></article>
          {read.lines.map((line, at) => (
            <article className={at === 0 ? "is-wide" : ""} key={line}>
              <small>{at === 0 ? "Week one" : at === 1 ? "Pointed at" : "In your part of the business"}</small>
              <p>{line}</p>
            </article>
          ))}
        </div>

        {read.companyOnly && (
          <p className="mm-fine">
            We read this from {read.company ?? "your company"} and the part of the business you work
            in. We did not find you specifically, so nothing above assumes what you do there.
          </p>
        )}

        {send === "sent" && (
          <p className="mm-fine" role="status" style={{ color: "var(--mm-mint)" }}>
            On its way to {details?.email}. Check your inbox in a few minutes.
          </p>
        )}

        {/* The read is written and on screen. What failed is the posting of it,
            so the offer takes the place of the send button rather than sitting
            beside it: two actions here would be asking somebody who has just
            been let down to decide which one is the real one. */}
        {send === "failed" && (
          <HumanHandoff
            reason="send-failed"
            details={details}
            onRetry={() => { setSend("idle"); }}
            retryLabel="Or try sending it again"
          />
        )}

        {send !== "sent" && send !== "failed" && (
          <>
            <button className="mm-button" data-mm-primary type="button" disabled={send === "sending"} onClick={sendFull}>
              {send === "sending" ? "Sending" : "Send me the full version"} <span aria-hidden="true">→</span>
            </button>
            <p className="mm-fine">{CLOSING_LINE}</p>
          </>
        )}
      </div>
    );
  }

  /* Nothing to show and nothing to try. The form is put away rather than left
     underneath, because leaving it there says the machine might work this time
     and it has just told us it will not. Trying again is offered quietly inside
     the panel for the two cases where it is worth anything. */
  if (stuck) {
    return (
      <div className="mm-journey">
        <HumanHandoff
          reason={stuck}
          details={details}
          onRetry={stuck === "read-refused" ? undefined : () => setStuck(null)}
          retryLabel="Or try the read once more"
        />
      </div>
    );
  }

  return (
    <div className="mm-journey">
      <DetailsJourney
        action="Show me week one"
        busy={reading}
        busyLabel="Reading your company and your role"
        onSubmit={start}
        /* Somebody with no work address cannot go and get one, so the rule that
           protects the reading becomes a locked door once the reading is off
           the table. This is the way out of it. */
        onDeadEnd={(typed) => <HumanHandoff reason="personal-email" prefill={typed} />}
      >
        {(["q1", "q2"] as const).map((key) => {
          const question = WEEK_ONE_QUESTIONS[key];
          const chosen = key === "q1" ? q1 : q2;
          return (
            <fieldset className="mm-details-field" key={key}>
              {/* The flap is what changes and the drawer is what is kept, which
                  is what these two questions are actually asking about. */}
              <legend>
                <Instrument kind={key === "q1" ? "flap" : "drawer"} className="mm-q-mark" />
                {question.label}
              </legend>
              <div className="mm-qchips">
                {question.options.map((option) => (
                  <button
                    key={option.id}
                    className="mm-qchip"
                    type="button"
                    aria-pressed={chosen === option.id}
                    onClick={() => (key === "q1" ? setQ1(option.id as Q1) : setQ2(option.id as Q2))}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </fieldset>
          );
        })}
      </DetailsJourney>

      {prompt && <p className="mm-journey-error" role="alert">{prompt}</p>}
    </div>
  );
}
