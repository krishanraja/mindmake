import type { CSSProperties } from "react";
import { usePinnedSteps } from "@/hooks/usePinnedSteps";
import { StepRail } from "./StepRail";
import { Unbroken } from "./Unbroken";

export type Kind = "person" | "hybrid" | "agent";
export type View = "today" | "native";
export interface Role { id: string; kind: Kind; title: string; line: string; isNew?: boolean }

export interface TeamCopy {
  heading: string;
  lead: Record<View, Role>;
  roles: Record<View, Role[]>;
  tally: Record<View, string>;
  decisions: Record<string, string>;
}

const VIEWS: readonly View[] = ["today", "native"];
const VIEW_NAMES: Record<View, string> = { today: "Today", native: "AI-native" };
const KIND_NAME: Record<Kind, string> = { person: "Person", hybrid: "Person + agents", agent: "Agent-first" };

/**
 * The team, rebuilt in front of the reader: today's commercial team becomes the
 * AI-native one as the page scrolls, and back again on the way up.
 *
 * It is drawn as an org chart on an instrument panel that says it is an
 * example. Each seat holds both of its states in the same place, so the change
 * reads as the same seat becoming something else, and its top rule carries its
 * kind: a person, a person with agents, agents first, or a new role. A seat that
 * does not exist yet is an empty dashed seat until the AI-native team fills it.
 * Picking a seat shows the decision it creates beside the chart, and never
 * moves the page.
 *
 * Where the chapter cannot pin (any phone, a short screen, a phone on its side,
 * no scripting, a reader's own larger text) it is a document instead: every
 * seat shows today's version struck through, the AI-native one, and the
 * decision it creates, so nothing waits behind a tap, and the seats are not
 * controls because there is nothing left for them to open.
 */
export function TeamChapter({ copy, picked, onPick, decisionLabel, decisionNote, instrumentLabel }: {
  copy: TeamCopy;
  picked: string;
  onPick: (id: string) => void;
  decisionLabel: string;
  decisionNote: string;
  instrumentLabel?: string;
}) {
  const { trackRef, stageRef, step, pinned, goTo } = usePinnedSteps<HTMLElement>(VIEWS.length);
  const view: View = pinned ? VIEWS[step] : "native";

  const ids = [...new Set([...copy.roles.today, ...copy.roles.native].map((role) => role.id))];
  const find = (which: View, id: string) => copy.roles[which].find((role) => role.id === id) ?? null;
  const role = picked === "lead" ? copy.lead[view] : find(view, picked) ?? copy.lead[view];
  const decision = copy.decisions[role.id] ?? copy.decisions.lead;
  /* Every seat's decision, in both teams, is laid out unseen behind the one on
     screen, so the panel is always as tall as its longest decision and picking
     a seat never moves the chart or the rail. */
  const every = [...new Map(VIEWS.flatMap((which) => [copy.lead[which], ...copy.roles[which]])
    .map((seat) => [`${seat.id}|${seat.title}`, seat] as const)).values()];

  return (
    <section
      ref={trackRef}
      className="gtm-chapter gtm-team"
      data-gtm-chapter="team"
      data-view={view}
      aria-labelledby="gtm-team-title"
      style={{ "--gtm-steps": VIEWS.length } as CSSProperties}
    >
      <div ref={stageRef} className="gtm-stage">
        <div className="gtm-stage-body mm-container">
          <div className="gtm-team-head">
            <h2 id="gtm-team-title"><Unbroken text={copy.heading} /></h2>
          </div>
          <div className="team-instrument">
            <div className="team-instrument-head">
              {instrumentLabel ? <p className="team-instrument-label"><i aria-hidden="true" />{instrumentLabel}</p> : null}
              <p className="gtm-team-tally" aria-live="polite">
                <span data-view-layer="today">{copy.tally.today}</span>
                <span data-view-layer="native">{copy.tally.native}</span>
              </p>
            </div>
            <div className="team-board" role="group" aria-label={`${VIEW_NAMES[view]} team`} style={{ "--gtm-cols": ids.length % 3 === 0 ? 3 : 2 } as CSSProperties}>
              <RoleCell today={copy.lead.today} native={copy.lead.native} view={view} pinned={pinned} decision={copy.decisions.lead} active={picked === "lead"} onPick={() => onPick("lead")} lead />
              <span className="team-bus" aria-hidden="true" />
              {ids.map((id) => (
                <RoleCell key={id} today={find("today", id)} native={find("native", id)} view={view} pinned={pinned} decision={copy.decisions[id] ?? copy.decisions.lead} active={picked === id} onPick={() => onPick(id)} />
              ))}
            </div>
          </div>
          <article className="decision-panel" aria-live="polite" aria-labelledby="gtm-decision-title">
            <div className="decision-stack">
              <div className="decision-copy">
                <h3 id="gtm-decision-title">{decision}</h3>
                <p className="gtm-decision-role">{decisionLabel} as {role.title}.</p>
              </div>
              {every.map((seat) => (
                <div key={`${seat.id}-${seat.title}`} className="decision-copy decision-sizer" aria-hidden="true">
                  <span className="decision-sizer-q">{copy.decisions[seat.id] ?? copy.decisions.lead}</span>
                  <span className="decision-sizer-role">{decisionLabel} as {seat.title}.</span>
                </div>
              ))}
            </div>
            <p className="gtm-decision-note">{decisionNote}</p>
          </article>
        </div>
        <StepRail label="Your team" steps={VIEWS.map((name) => VIEW_NAMES[name])} active={VIEWS.indexOf(view)} onGo={goTo} className="gtm-rail-two" />
      </div>
    </section>
  );
}

function RoleCell({ today, native, view, pinned, decision, active, onPick, lead = false }: {
  today: Role | null;
  native: Role | null;
  view: View;
  pinned: boolean;
  decision: string;
  active: boolean;
  onPick: () => void;
  lead?: boolean;
}) {
  const layer = (role: Role | null, which: View) => role ? (
    <span
      className="role-layer"
      data-view-layer={which}
      data-kind={role.kind}
      data-new={role.isNew ? "true" : undefined}
      data-kept={which === "today" && native?.title === role.title ? "true" : undefined}
    >
      <span className="role-kind">{KIND_NAME[role.kind]}{role.isNew ? <em>New role</em> : null}</span>
      <span className="role-title">{role.title}</span>
      <span className="role-line">{role.line}</span>
    </span>
  ) : (
    <span className="role-layer role-empty" data-view-layer={which} aria-hidden="true" />
  );
  /* A seat the team on screen does not have yet is drawn empty and cannot be
     picked; it has nothing to say until the AI-native team fills it. Unpinned,
     the seat already shows its decision, so it is not a control at all. */
  const current = view === "today" ? today : native;
  const pickable = pinned && Boolean(current);
  return (
    <button type="button" className={`role-cell${lead ? " role-lead" : ""}${today ? "" : " role-arrives"}`} aria-pressed={pickable && active} disabled={!pickable} aria-label={current ? undefined : "Not yet a seat"} onClick={onPick}>
      <span className="role-pick" aria-hidden="true" />
      {layer(today, "today")}
      {layer(native, "native")}
      <span className="role-decision">{decision}</span>
    </button>
  );
}
