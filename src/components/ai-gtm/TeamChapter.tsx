import { useState } from "react";
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
 * Each cell holds both of its states in the same place, so the change reads as
 * the same seat becoming something else, and a reader without scripts sees the
 * two side by side. A role that does not exist yet is an empty seat until the
 * AI-native state fills it. Picking a role shows the decision it creates beside
 * the board, and never moves the page.
 */
export function TeamChapter({ copy, picked, onPick, decisionLabel, decisionNote, footnote }: {
  copy: TeamCopy;
  picked: string;
  onPick: (id: string) => void;
  decisionLabel: string;
  decisionNote: string;
  footnote: string;
}) {
  const { trackRef, stageRef, step, pinned, goTo } = usePinnedSteps<HTMLElement>(VIEWS.length);
  /* Unpinned (a short screen), the rail is a plain switch and starts on the
     AI-native team, which is the point of the chapter. */
  const [chosen, setChosen] = useState<View>("native");
  const view: View = pinned ? VIEWS[step] : chosen;
  const go = (index: number) => (pinned ? goTo(index) : setChosen(VIEWS[index]));

  const ids = [...new Set([...copy.roles.today, ...copy.roles.native].map((role) => role.id))];
  const find = (which: View, id: string) => copy.roles[which].find((role) => role.id === id) ?? null;
  const role = picked === "lead" ? copy.lead[view] : find(view, picked) ?? copy.lead[view];
  const decision = copy.decisions[role.id] ?? copy.decisions.lead;

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
            <p className="gtm-team-tally" aria-live="polite">
              <span data-view-layer="today">{copy.tally.today}</span>
              <span data-view-layer="native">{copy.tally.native}</span>
            </p>
          </div>
          <div className="team-board" role="group" aria-label={`${VIEW_NAMES[view]} team`}>
            <RoleCell today={copy.lead.today} native={copy.lead.native} active={picked === "lead"} onPick={() => onPick("lead")} lead />
            {ids.map((id) => (
              <RoleCell key={id} today={find("today", id)} native={find("native", id)} active={picked === id} onPick={() => onPick(id)} />
            ))}
          </div>
          <article className="decision-panel mm-on-paper" aria-live="polite" aria-labelledby="gtm-decision-title">
            <p className="gtm-decision-label">{decisionLabel}</p>
            <h3 id="gtm-decision-title">{decision}</h3>
            <p className="gtm-decision-role">{role.title}. {role.line}.</p>
            <p className="gtm-decision-note">{decisionNote}</p>
            <p className="gtm-decision-footnote">{footnote}</p>
          </article>
        </div>
        <StepRail label="Your team" steps={VIEWS.map((name) => VIEW_NAMES[name])} active={VIEWS.indexOf(view)} onGo={go} className="gtm-rail-two" />
      </div>
    </section>
  );
}

function RoleCell({ today, native, active, onPick, lead = false }: {
  today: Role | null;
  native: Role | null;
  active: boolean;
  onPick: () => void;
  lead?: boolean;
}) {
  const layer = (role: Role | null, which: View) => role ? (
    <span className="role-layer" data-view-layer={which}>
      <span className="role-kind" data-kind={role.kind}>{KIND_NAME[role.kind]}{role.isNew ? <em>New role</em> : null}</span>
      <span className="role-title">{role.title}</span>
      <span className="role-line">{role.line}</span>
    </span>
  ) : (
    <span className="role-layer role-empty" data-view-layer={which} aria-hidden="true" />
  );
  return (
    <button type="button" className={`role-cell${lead ? " role-lead" : ""}${today ? "" : " role-arrives"}`} aria-pressed={active} onClick={onPick}>
      {layer(today, "today")}
      {layer(native, "native")}
    </button>
  );
}
