import { useState } from "react";
import {
  WEEK_ONE_QUESTIONS,
  buildWeekOnePreview,
  type Q1,
  type Q2,
} from "@/content/personalRead";
import { track } from "@/lib/analytics";

type SendState = "idle" | "sending" | "sent" | "failed";

/* Resolved once, the way useBoardData does it. Reading the env inline left the
   header object typed string | undefined, which is also the honest shape of the
   bug: with the variable missing the request would have gone out carrying the
   word "undefined" as its key. */
const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/mindmake-personal-read`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

/**
 * See it learn you.
 *
 * The preview is composed on the spot from the template lines, so it never
 * waits on a network call: the visitor gets the value before the email field
 * exists. Enrichment is a best-effort improvement to the emailed version, and
 * a send that cannot happen says so rather than claiming one.
 */
export function BrainJourney() {
  const [linkedin, setLinkedin] = useState("");
  const [q1, setQ1] = useState<Q1 | null>(null);
  const [q2, setQ2] = useState<Q2 | null>(null);
  const [preview, setPreview] = useState<ReturnType<typeof buildWeekOnePreview> | null>(null);
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [send, setSend] = useState<SendState>("idle");

  const show = () => {
    if (!q1 || !q2) {
      setPrompt("Tap one answer in each question and this becomes yours.");
      return;
    }
    setPrompt("");
    setPreview(buildWeekOnePreview(q1, q2, linkedin.trim().length > 0));
    track("journey_brain_preview", { q1, q2, profile: linkedin.trim().length > 0 });

    // Best effort, and deliberately not awaited: the preview is already on
    // screen, and enrichment only improves the version that gets emailed.
    void fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: ANON_KEY,
        Authorization: `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ action: "preview", linkedin_url: linkedin.trim(), q1, q2 }),
    }).catch(() => undefined);
  };

  const submitEmail = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!q1 || !q2 || !/^\S+@\S+\.\S+$/.test(email)) {
      setPrompt("Add a work email and we will send the full version.");
      return;
    }
    setPrompt("");
    setSend("sending");
    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ANON_KEY}`,
        },
        body: JSON.stringify({ action: "send", linkedin_url: linkedin.trim(), q1, q2, email }),
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

  return (
    <div className="mm-journey">
      <div className={`mm-journey-bar${linkedin.trim() ? " has-text" : ""}`}>
        <label className="mm-visually-hidden" htmlFor="brain-linkedin">Your LinkedIn URL</label>
        <input
          id="brain-linkedin"
          type="text"
          inputMode="url"
          placeholder="linkedin.com/in/you"
          value={linkedin}
          onChange={(event) => setLinkedin(event.target.value)}
        />
      </div>

      {(["q1", "q2"] as const).map((key) => {
        const question = WEEK_ONE_QUESTIONS[key];
        const chosen = key === "q1" ? q1 : q2;
        return (
          <div className="mm-qrow" key={key}>
            <p id={`brain-${key}`}>{key === "q1" ? "Q1 · " : "Q2 · "}{question.label}</p>
            <div className="mm-qchips" role="group" aria-labelledby={`brain-${key}`}>
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
          </div>
        );
      })}

      <button className="mm-button" data-mm-primary type="button" style={{ marginTop: 16 }} onClick={show}>
        Show me week one
      </button>

      {prompt && <p className="mm-journey-error" role="status">{prompt}</p>}

      {preview && (
        <div className="mm-preview">
          <h3>{preview.title}</h3>
          {preview.lines.map((line) => <p key={line}>{line}</p>)}
          <p className="mm-fine">{preview.closing}</p>

          {send === "sent" ? (
            <p className="mm-fine" role="status" style={{ color: "var(--mm-mint)" }}>
              On its way. Check your inbox in a few minutes.
            </p>
          ) : (
            <form className="mm-preview-form" onSubmit={submitEmail}>
              <label className="mm-visually-hidden" htmlFor="brain-email">Your work email</label>
              <input
                id="brain-email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <button className="mm-button" type="submit" disabled={send === "sending"}>
                {send === "sending" ? "Sending" : "Send me the full version"}
              </button>
              {send === "failed" && (
                <p className="mm-journey-error" role="alert">
                  We could not send that just now. Try again in a moment, or start here and we will
                  read your business instead.
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
