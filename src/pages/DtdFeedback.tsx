import { type FormEvent, useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { START_PATH } from "@/lib/publicLinks";
import "@/styles/mindmake.css";
import "@/styles/dtd-feedback.css";
import {
  BETTER_CHIPS,
  COMMENT_LIMIT,
  LIKED_CHIPS,
  NAME_LIMIT,
  type FeedbackChip,
} from "../../supabase/functions/submit-dtd-feedback/core";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/submit-dtd-feedback`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

type Picks = Record<string, string>;
type Status = "idle" | "sending" | "sent" | "failed";

interface GroupProps {
  legend: string;
  chips: readonly FeedbackChip[];
  picks: Picks;
  onChange: (picks: Picks) => void;
}

function ChipGroup({ legend, chips, picks, onChange }: GroupProps) {
  const id = useId();
  const toggle = (chipId: string) => {
    const next = { ...picks };
    if (chipId in next) delete next[chipId];
    else next[chipId] = "";
    onChange(next);
  };
  const picked = chips.filter((chip) => chip.id in picks);

  return (
    <fieldset className="mm-dtd-group">
      <legend>{legend}</legend>
      <p className="mm-dtd-hint">Tap all that apply.</p>
      <div className="mm-dtd-chips">
        {chips.map((chip) => (
          <button
            key={chip.id}
            type="button"
            className="mm-dtd-chip"
            aria-pressed={chip.id in picks}
            onClick={() => toggle(chip.id)}
          >
            {chip.label}
          </button>
        ))}
      </div>
      {picked.map((chip) => (
        <div className="mm-dtd-comment" key={chip.id}>
          <label htmlFor={`${id}-${chip.id}`}>{chip.prompt}</label>
          <textarea
            id={`${id}-${chip.id}`}
            rows={3}
            maxLength={COMMENT_LIMIT}
            value={picks[chip.id]}
            onChange={(event) => onChange({ ...picks, [chip.id]: event.target.value })}
          />
        </div>
      ))}
    </fieldset>
  );
}

const toItems = (chips: readonly FeedbackChip[], picks: Picks) =>
  chips.filter((chip) => chip.id in picks).map((chip) => ({ id: chip.id, comment: picks[chip.id] }));

export default function DtdFeedback() {
  const navigate = useNavigate();
  const [liked, setLiked] = useState<Picks>({});
  const [better, setBetter] = useState<Picks>({});
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const nothingPicked = Object.keys(liked).length === 0 && Object.keys(better).length === 0;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (nothingPicked) {
      setError("Tap at least one choice above first.");
      return;
    }
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({ name, website, liked: toItems(LIKED_CHIPS, liked), better: toItems(BETTER_CHIPS, better) }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error("not sent");
      setStatus("sent");
    } catch {
      setStatus("failed");
      setError("That did not send. Please try again in a moment.");
    }
  };

  return (
    <MindmakeShell onStart={() => navigate(START_PATH)} showMobileActionBar={false}>
      <SEO
        title="DoThinkDo feedback"
        description="A short feedback form for the DoThinkDo team."
        canonical="/feedback/dtd"
        noindex
      />
      <article className="mm-legal-page mm-dtd-page">
        <header className="mm-container mm-legal-hero">
          <h1>How did it go?</h1>
          <p>Two quick questions about our work together at DoThinkDo. Tap what fits, add a line if you like, and send. It takes about two minutes.</p>
        </header>

        <div className="mm-container">
          {status === "sent" ? (
            <div className="mm-dtd-done" role="status">
              <h2>Thank you.</h2>
              <p>Your feedback is on its way to Krish. It really does shape what we do next.</p>
            </div>
          ) : (
            <form className="mm-dtd-form" onSubmit={submit} noValidate>
              <ChipGroup
                legend="What did you like?"
                chips={LIKED_CHIPS}
                picks={liked}
                onChange={setLiked}
              />
              <ChipGroup
                legend="What could we do better next time?"
                chips={BETTER_CHIPS}
                picks={better}
                onChange={setBetter}
              />

              <div className="mm-dtd-name">
                <label htmlFor="dtd-name">Your name <span>(optional, leave blank to stay anonymous)</span></label>
                <input id="dtd-name" autoComplete="name" maxLength={NAME_LIMIT} value={name} onChange={(event) => setName(event.target.value)} />
              </div>
              <div className="mm-dtd-trap" aria-hidden="true">
                <label htmlFor="dtd-website">Website</label>
                <input id="dtd-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </div>

              {error && <p className="mm-form-error" role="alert">{error}</p>}
              <button className="mm-button" type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending" : "Send feedback"}
              </button>
            </form>
          )}
        </div>
      </article>
    </MindmakeShell>
  );
}
