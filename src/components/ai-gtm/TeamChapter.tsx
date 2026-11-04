import { useState, type CSSProperties, type ReactNode } from "react";
import { Icon } from "@/components/mindmake/Icon";
import { Plate } from "@/components/mindmake/Plate";
import { Unbroken } from "./Unbroken";

export type Kind = "person" | "hybrid" | "agent";
export type View = "today" | "native";
export interface Role { id: string; kind: Kind; title: string; line: string; isNew?: boolean }

export interface TeamCopy {
  heading: string;
  lead: Record<View, Role>;
  roles: Record<View, Role[]>;
  tally: Record<View, string>;
  /** The same tally as counts, drawn as a ring a person and a robot an agent role. */
  count: Record<View, { people: number; agents: number }>;
  decisions: Record<string, string>;
}

const VIEWS: readonly View[] = ["today", "native"];
const VIEW_NAMES: Record<View, string> = { today: "Today", native: "AI-native" };
const KIND_NAME: Record<Kind, string> = { person: "Person", hybrid: "Person + agents", agent: "Agent-first" };

/**
 * The team, rebuilt in front of the reader: one switch turns today's
 * commercial team into the AI-native one, and back.
 *
 * Ruling (owner, 2026-10-24): this is "one of the more powerful sections in
 * reality, because it's really relatable and really visual", and it is how the
 * page shows the change working. It no longer pins and builds with scroll; the
 * reader turns it with the switch beside the tally, at every width.
 *
 * It is drawn as an org chart on an instrument panel that says it is an
 * example. Each seat holds both of its states in the same place, so the change
 * reads as the same seat becoming something else, and its top rule carries its
 * kind: a person, a person with agents, agents first, or a new role. A seat that
 * does not exist yet is an empty dashed seat until the AI-native team fills it.
 * Picking a seat shows the decision it creates under the chart, and never
 * moves the page. The decision panel holds every seat's decision unseen behind
 * the one on screen, and every seat holds both of its states, so neither the
 * switch nor a pick ever changes the size of anything.
 *
 * Without scripting the switch cannot work, so the chapter is a document
 * instead: every seat shows today's version struck through, the AI-native one,
 * and the decision it creates.
 */
export function TeamChapter({ copy, picked, onPick, decisionLabel, decisionNote, instrumentLabel, plate }: {
  copy: TeamCopy;
  /** The section's picture, under its heading. */
  plate: ReactNode;
  picked: string;
  onPick: (id: string) => void;
  decisionLabel: string;
  decisionNote: string;
  instrumentLabel?: string;
}) {
  const [view, setView] = useState<View>("today");

  const ids = [...new Set([...copy.roles.today, ...copy.roles.native].map((role) => role.id))];
  const find = (which: View, id: string) => copy.roles[which].find((role) => role.id === id) ?? null;
  const role = picked === "lead" ? copy.lead[view] : find(view, picked) ?? copy.lead[view];
  const decision = copy.decisions[role.id] ?? copy.decisions.lead;
  /* Every seat's decision, in both teams, is laid out unseen behind the one on
     screen, so the panel is always as tall as its longest decision and picking
     a seat never moves the chart or the rail. */
  const every = [...new Map(VIEWS.flatMap((which) => [copy.lead[which], ...copy.roles[which]])
    .map((seat) => [`${seat.id}|${seat.title}`, seat] as const)).values()];

  /* Ruling (owner, 2026-11-04, mock approved): the section opens on its
     picture, and its one big thing is the team today beside the AI-native
     team, as counts and marks, so the change is seen before any seat is
     read. The decision stays in view as the question it raises; the chart of
     seats, with its switch and every seat's decision, is one tap away under
     "See every role". */
  const side = (which: View) => (
    <div className="team-side" data-side={which}>
      <p className="team-count">
        {copy.count[which].people}{copy.count[which].agents ? <span> + {copy.count[which].agents}</span> : null}
        <small>{VIEW_NAMES[which]} · {copy.tally[which]}</small>
      </p>
      <p className="team-marks" aria-hidden="true">
        {Array.from({ length: copy.count[which].people }, (_, index) => <i key={`p${index}`} />)}
        {Array.from({ length: copy.count[which].agents }, (_, index) => <Icon key={`a${index}`} name="agent" />)}
      </p>
    </div>
  );

  return (
    <section
      className="gtm-team gtm-s8"
      data-gtm-chapter="team"
      data-view={view}
      aria-labelledby="gtm-team-title"
    >
      <Plate media={plate}>
        <h2 id="gtm-team-title"><Unbroken text={copy.heading} /></h2>
      </Plate>
      <div className="gtm-team-body s8-body s8-dark">
        <div className="mm-container">
          <div className="team-compare">
            {side("today")}
            <Icon name="arrow" className="mm-icon team-compare-arrow" />
            {side("native")}
          </div>
          <div className="team-rest">
            <article className="decision-panel" aria-live="polite" aria-labelledby="gtm-decision-title">
              <div className="decision-stack">
                <div className="decision-copy">
                  <p className="gtm-decision-role">{decisionLabel} as {role.title}.</p>
                  <h3 id="gtm-decision-title">{decision}</h3>
                </div>
                {every.map((seat) => (
                  <div key={`${seat.id}-${seat.title}`} className="decision-copy decision-sizer" aria-hidden="true">
                    <span className="decision-sizer-role">{decisionLabel} as {seat.title}.</span>
                    <span className="decision-sizer-q">{copy.decisions[seat.id] ?? copy.decisions.lead}</span>
                  </div>
                ))}
              </div>
              <p className="gtm-decision-note">{decisionNote}</p>
            </article>
            <details className="s8-more team-roles">
              <summary><Icon name="plus" />See every role</summary>
              <div className="team-instrument">
                <div className="team-instrument-head">
                  {instrumentLabel ? <p className="team-instrument-label"><i aria-hidden="true" />{instrumentLabel}</p> : null}
                  <div className="gtm-view-switch" role="group" aria-label="Your team">
                    {VIEWS.map((which) => (
                      <button key={which} type="button" aria-pressed={view === which} onClick={() => setView(which)}>{VIEW_NAMES[which]}</button>
                    ))}
                  </div>
                  <p className="gtm-team-tally" aria-live="polite">
                    <span data-view-layer="today">{copy.tally.today}</span>
                    <span data-view-layer="native">{copy.tally.native}</span>
                  </p>
                </div>
                <div className="team-board" role="group" aria-label={`${VIEW_NAMES[view]} team`} style={{ "--gtm-cols": ids.length % 3 === 0 ? 3 : 2 } as CSSProperties}>
                  <RoleCell today={copy.lead.today} native={copy.lead.native} view={view} decision={copy.decisions.lead} active={picked === "lead"} onPick={() => onPick("lead")} lead />
                  <span className="team-bus" aria-hidden="true" />
                  {ids.map((id) => (
                    <RoleCell key={id} today={find("today", id)} native={find("native", id)} view={view} decision={copy.decisions[id] ?? copy.decisions.lead} active={picked === id} onPick={() => onPick(id)} />
                  ))}
                </div>
              </div>
            </details>
          </div>
        </div>
      </div>
    </section>
  );
}

function RoleCell({ today, native, view, decision, active, onPick, lead = false }: {
  today: Role | null;
  native: Role | null;
  view: View;
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
     picked; it has nothing to say until the AI-native team fills it. */
  const current = view === "today" ? today : native;
  const pickable = Boolean(current);
  return (
    <button type="button" className={`role-cell${lead ? " role-lead" : ""}${today ? "" : " role-arrives"}`} aria-pressed={pickable && active} disabled={!pickable} aria-label={current ? undefined : "Not yet a seat"} onClick={onPick}>
      <span className="role-pick" aria-hidden="true" />
      {layer(today, "today")}
      {layer(native, "native")}
      <span className="role-decision">{decision}</span>
    </button>
  );
}
