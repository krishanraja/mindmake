import { useId } from "react";
import { ArrowUpRight } from "lucide-react";

/* Brain modules run in Claude Desktop only (Krish, 2026-11-20): said at the top of every module page, with
   the Claude mark, and confirmed with a tick before anything can be bought. */
export const CLAUDE_DOWNLOAD_URL = "https://claude.ai/download";

export function ClaudeMark({ size = 28 }: { size?: number }) {
  return <img className="kit-claude-mark" src="/media/claude-symbol.svg" alt="" width={size} height={size} decoding="async" />;
}

/** "Made for Claude": a badge for the top of a module page. */
export function ClaudeOnlyBadge() {
  return <p className="kit-claude-badge"><ClaudeMark size={22} /><span><strong>For Claude only.</strong> Runs in Claude Desktop on a Mac or Windows computer.</span></p>;
}

/** The tick that must be set before a module can be bought or claimed. */
export function ClaudeCheck({ checked, onChange, missing }: { checked: boolean; onChange: (value: boolean) => void; missing: boolean }) {
  const id = useId();
  return <div className={`kit-claude-check${missing ? " is-missing" : ""}`}>
    <label htmlFor={id}>
      <input id={id} type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)} aria-describedby={`${id}-help`} />
      <span className="kit-claude-box" aria-hidden="true" />
      <ClaudeMark size={24} />
      <span>I use Claude Desktop on a Mac or Windows computer.</span>
    </label>
    <p id={`${id}-help`} role={missing ? "alert" : undefined}>
      {missing ? "Tick the box first. A brain module only works inside Claude Desktop." : <>No Claude Desktop yet? It is free to start. <a href={CLAUDE_DOWNLOAD_URL} target="_blank" rel="noreferrer">Get it from Claude <ArrowUpRight size={14} aria-hidden="true" /></a></>}
    </p>
  </div>;
}
