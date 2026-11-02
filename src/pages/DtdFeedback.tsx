import { type FormEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { START_PATH } from "@/lib/publicLinks";
import "@/styles/mindmake.css";
import "@/styles/dtd-feedback.css";
import {
  BETTER_CHIPS,
  BETTER_STARTERS,
  BLANK,
  COMMENT_LIMIT,
  LIKED_CHIPS,
  LIKED_STARTERS,
  NAME_LIMIT,
  type FeedbackChip,
} from "../../supabase/functions/submit-dtd-feedback/core";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL ?? ""}/functions/v1/submit-dtd-feedback`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ?? "";

type Group = "liked" | "better";
type Picks = Record<string, string>;
type Step =
  | { kind: "welcome" }
  | { kind: "pick"; group: Group }
  | { kind: "comment"; group: Group; chip: FeedbackChip }
  | { kind: "name" };

const GROUPS = {
  liked: { chips: LIKED_CHIPS, starters: LIKED_STARTERS, question: "What did you like?" },
  better: { chips: BETTER_CHIPS, starters: BETTER_STARTERS, question: "What could we do better next time?" },
} as const;

/* Progress counts sections, never questions, so picking more chips never makes
   the form look longer. */
const SECTIONS = [
  { id: "liked", label: "Liked" },
  { id: "better", label: "Better" },
  { id: "send", label: "Send" },
] as const;

const sectionOf = (step: Step) => (step.kind === "name" ? "send" : step.kind === "welcome" ? null : step.group);

const toItems = (chips: readonly FeedbackChip[], picks: Picks) =>
  chips.filter((chip) => chip.id in picks).map((chip) => ({ id: chip.id, comment: picks[chip.id] }));

export default function DtdFeedback() {
  const navigate = useNavigate();
  const [picks, setPicks] = useState<Record<Group, Picks>>({ liked: {}, better: {} });
  const [index, setIndex] = useState(0);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "failed">("idle");
  const [error, setError] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const firstRender = useRef(true);

  const steps = useMemo<Step[]>(() => {
    const list: Step[] = [{ kind: "welcome" }];
    for (const group of ["liked", "better"] as const) {
      list.push({ kind: "pick", group });
      for (const chip of GROUPS[group].chips) if (chip.id in picks[group]) list.push({ kind: "comment", group, chip });
    }
    list.push({ kind: "name" });
    return list;
  }, [picks]);

  const step = steps[Math.min(index, steps.length - 1)];
  const section = sectionOf(step);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headingRef.current?.focus();
    setError("");
  }, [index, status]);

  const go = (delta: number) => setIndex((current) => Math.max(0, Math.min(steps.length - 1, current + delta)));

  const togglePick = (group: Group, chipId: string) =>
    setPicks((current) => {
      const next = { ...current[group] };
      if (chipId in next) delete next[chipId];
      else next[chipId] = "";
      return { ...current, [group]: next };
    });

  const setComment = (group: Group, chipId: string, comment: string) =>
    setPicks((current) => ({ ...current, [group]: { ...current[group], [chipId]: comment } }));

  /* Puts the cursor on the first blank, selected, so typing replaces it. Focus
     moves at once, so a quick typist never types into the starter button; the
     selection lands once React has written the new text into the box. */
  const pendingBlank = useRef(false);
  const selectBlank = () => {
    pendingBlank.current = true;
    textRef.current?.focus();
  };
  const commentValue = step.kind === "comment" ? picks[step.group][step.chip.id] : null;
  useLayoutEffect(() => {
    const box = textRef.current;
    if (!pendingBlank.current || !box) return;
    pendingBlank.current = false;
    const at = box.value.indexOf(BLANK);
    if (at >= 0) box.setSelectionRange(at, at + BLANK.length);
  }, [commentValue]);

  const addStarter = (group: Group, chipId: string, starter: string) => {
    const existing = picks[group][chipId].trimEnd();
    const text = `${existing}${existing ? " " : ""}${starter}`.slice(0, COMMENT_LIMIT);
    setComment(group, chipId, text);
    selectBlank();
  };

  const nothingPicked = Object.keys(picks.liked).length === 0 && Object.keys(picks.better).length === 0;

  const submit = async () => {
    if (nothingPicked) return;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY, Authorization: `Bearer ${ANON_KEY}` },
        body: JSON.stringify({
          name,
          website,
          liked: toItems(LIKED_CHIPS, picks.liked),
          better: toItems(BETTER_CHIPS, picks.better),
        }),
      });
      const body = await response.json().catch(() => null);
      if (!response.ok || !body?.ok) throw new Error("not sent");
      setStatus("sent");
    } catch {
      setStatus("failed");
      setError("That did not send. Please try again in a moment.");
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (step.kind === "comment") {
      const text = picks[step.group][step.chip.id];
      if (text.includes(BLANK)) {
        setError("Finish the sentence in your own words first.");
        selectBlank();
        const box = textRef.current;
        const at = text.indexOf(BLANK);
        if (box && at >= 0) box.setSelectionRange(at, at + BLANK.length);
        pendingBlank.current = false;
        return;
      }
    }
    if (step.kind === "name") void submit();
    else go(1);
  };

  const nextLabel = (() => {
    if (step.kind === "welcome") return "Start";
    if (step.kind === "name") return status === "sending" ? "Sending" : "Send feedback";
    if (step.kind === "pick") return Object.keys(picks[step.group]).length ? "Next" : "Skip this one";
    return picks[step.group][step.chip.id].trim() ? "Next" : "Skip";
  })();

  return (
    <MindmakeShell onStart={() => navigate(START_PATH)} showMobileActionBar={false}>
      <SEO title="DoThinkDo feedback" description="A short feedback form for the DoThinkDo team." canonical="/feedback/dtd" noindex />
      <article className="mm-legal-page mm-dtd-page">
        <div className="mm-container">
          {status === "sent" ? (
            <div className="mm-dtd-card mm-dtd-done" role="status">
              <h1 ref={headingRef} tabIndex={-1}>Thank you.</h1>
              <p>Your feedback is on its way to Krish. It really does shape what we do next.</p>
            </div>
          ) : (
            <form className="mm-dtd-card" onSubmit={onSubmit} noValidate>
              <ol className="mm-dtd-progress" aria-label="Progress">
                {SECTIONS.map((item) => {
                  const position = SECTIONS.findIndex((candidate) => candidate.id === section);
                  const mine = SECTIONS.findIndex((candidate) => candidate.id === item.id);
                  const state = section === null ? "todo" : mine < position ? "done" : mine === position ? "now" : "todo";
                  return (
                    <li key={item.id} data-state={state} aria-current={state === "now" ? "step" : undefined}>
                      {item.label}
                    </li>
                  );
                })}
              </ol>

              <div className="mm-dtd-body">
                {step.kind === "welcome" && (
                  <>
                    <h1 className="mm-dtd-hero" ref={headingRef} tabIndex={-1}>How did it go?</h1>
                    <p className="mm-dtd-lede">A few quick taps about our work together at DoThinkDo. Three short sections, about two minutes.</p>
                  </>
                )}

                {step.kind === "pick" && (
                  <>
                    <h1 ref={headingRef} tabIndex={-1}>{GROUPS[step.group].question}</h1>
                    <p className="mm-dtd-hint">Tap all that apply.</p>
                    <div className="mm-dtd-chips">
                      {GROUPS[step.group].chips.map((chip) => (
                        <button
                          key={chip.id}
                          type="button"
                          className="mm-dtd-chip"
                          aria-pressed={chip.id in picks[step.group]}
                          onClick={() => togglePick(step.group, chip.id)}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}

                {step.kind === "comment" && (
                  <>
                    <p className="mm-dtd-kicker">{step.chip.label}</p>
                    <h1 ref={headingRef} tabIndex={-1}>{step.chip.prompt}</h1>
                    <p className="mm-dtd-hint">Tap a starter, then finish it in your own words.</p>
                    <div className="mm-dtd-starters">
                      {GROUPS[step.group].starters.map((starter) => (
                        <button key={starter} type="button" className="mm-dtd-starter" onClick={() => addStarter(step.group, step.chip.id, starter)}>
                          {starter.replace(new RegExp(`${BLANK}\\.?`, "g"), "…")}
                        </button>
                      ))}
                    </div>
                    <label className="mm-dtd-sr" htmlFor="dtd-comment">{step.chip.prompt}</label>
                    <textarea
                      id="dtd-comment"
                      key={`${step.group}-${step.chip.id}`}
                      ref={textRef}
                      rows={3}
                      maxLength={COMMENT_LIMIT}
                      value={picks[step.group][step.chip.id]}
                      onChange={(event) => setComment(step.group, step.chip.id, event.target.value)}
                    />
                  </>
                )}

                {step.kind === "name" && (
                  <>
                    <h1 ref={headingRef} tabIndex={-1}>Last bit.</h1>
                    {nothingPicked ? (
                      <p className="mm-dtd-lede">You have not picked anything yet. Go back and tap at least one thing you liked or one thing to do better.</p>
                    ) : (
                      <div className="mm-dtd-name">
                        <label htmlFor="dtd-name">Your name <span>(optional, leave blank to stay anonymous)</span></label>
                        <input id="dtd-name" autoComplete="name" maxLength={NAME_LIMIT} value={name} onChange={(event) => setName(event.target.value)} />
                      </div>
                    )}
                    <div className="mm-dtd-trap" aria-hidden="true">
                      <label htmlFor="dtd-website">Website</label>
                      <input id="dtd-website" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
                    </div>
                  </>
                )}
              </div>

              <div className="mm-dtd-nav">
                <p className="mm-form-error" role="alert">{error}</p>
                {step.kind !== "welcome" && (
                  <button type="button" className="mm-button mm-button-quiet" onClick={() => go(-1)} disabled={status === "sending"}>
                    Back
                  </button>
                )}
                <button
                  className="mm-button"
                  type="submit"
                  disabled={status === "sending" || (step.kind === "name" && nothingPicked)}
                >
                  {nextLabel}
                </button>
              </div>
            </form>
          )}
        </div>
      </article>
    </MindmakeShell>
  );
}
