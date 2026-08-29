import { useState } from "react";
import { Instrument } from "@/components/mindmake/Instrument";
import { DetailsJourney, type Details } from "@/components/mindmake/journeys/DetailsJourney";
import { WEEK_ONE_QUESTIONS, CLOSING_LINE, type Q1, type Q2 } from "@/content/personalRead";
import { track } from "@/lib/analytics";

type SendState = "idle" | "sending" | "sent" | "failed";

/* Resolved once, the way useBoardData does it. Reading the env inline left the
   header object typed string | undefined, which is also the honest shape of the
   bug: with the variable missing the request would have gone out carrying the
   word "undefined" as its key. */
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/mindmake-personal-read`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

/** What the server assembles and the page puts on screen. */
interface Read {
  opening: string;
  lines: string[];
  company?: string;
  companyOnly: boolean;
}

const post = (body: unknown) => fetch(FUNCTION_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    apikey: ANON_KEY,
    Authorization: `Bearer ${ANON_KEY}`,
  },
  body: JSON.stringify(body),
});

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

  const start = async (entered: Details) => {
    if (!q1 || !q2) {
      setPrompt("Tap one answer in each question and this becomes yours.");
      return;
    }
    setPrompt("");
    setReading(true);
    setDetails(entered);
    track("journey_brain_read", { division: entered.division, q1, q2 });
    try {
      const response = await post({
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
        setPrompt(
          "We could not find enough about your company from the outside to write you anything worth reading. "
          + "Rather than send you something generic, we would rather not. Reply to us and we will look properly.",
        );
        return;
      }
      if (!data?.read) throw new Error("no-read");
      setRead(data.read as Read);
    } catch {
      setPrompt("We could not read your company just now. Try again in a moment.");
    } finally {
      setReading(false);
    }
  };

  const sendFull = async () => {
    if (!details || !q1 || !q2) return;
    setSend("sending");
    try {
      const response = await post({
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

        {send === "sent" ? (
          <p className="mm-fine" role="status" style={{ color: "var(--mm-mint)" }}>
            On its way to {details?.email}. Check your inbox in a few minutes.
          </p>
        ) : (
          <>
            <button className="mm-button" data-mm-primary type="button" disabled={send === "sending"} onClick={sendFull}>
              {send === "sending" ? "Sending" : "Send me the full version"} <span aria-hidden="true">→</span>
            </button>
            <p className="mm-fine">{CLOSING_LINE}</p>
            {send === "failed" && (
              <p className="mm-journey-error" role="alert">
                We could not send that just now. Try again in a moment.
              </p>
            )}
          </>
        )}
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
