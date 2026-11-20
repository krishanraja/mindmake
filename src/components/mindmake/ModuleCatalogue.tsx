import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, BookOpen, Calculator, Check, ChevronDown, FileCheck2, Plus } from "lucide-react";
import { KIT_PRICE_CENTS, type Kit } from "@/content/kits";
import sample from "@/content/parts-sample.json";
import { ClaudeMark } from "@/components/ui/claude-only";
import { PartsFaqDrawer } from "@/components/ui/parts-faq-drawer";
import { BuiltBy, DecisionMath, ExitOverlay, PartsEngine, PartsVersus, Stories } from "@/components/ui/parts-proof";
import { PartsSampleOutput } from "@/components/ui/parts-sample-output";

const jobs = [
  { label: "Check facts", icon: FileCheck2, slugs: ["fact-check-board-update", "fact-check-email", "check-a-number"] },
  { label: "Set a price", icon: Calculator, slugs: ["lowest-price", "test-a-discount"] },
  { label: "Make a call", icon: BookOpen, slugs: ["meeting-brief", "audit-a-decision", "read-ai-stack"] },
];
const boardSlug = "fact-check-board-update";
const modulePrice = "$" + KIT_PRICE_CENTS / 100;

function reportLine(value: string) {
  const [, text, source] = /^(.*?)\s*\[([^\]]+)\]$/.exec(value) ?? [];
  return { text: text ?? value, source };
}

function ReportQuote({ text }: { text: string }) {
  return <>“{text.split(/(\b\d+\b)/).map((part, index) =>
    index % 2 === 1 ? <mark key={index}>{part}</mark> : part
  )}”</>;
}

function BoardExample() {
  const row = sample.rows[0];
  const claim = reportLine(row.claim);
  const evidence = reportLine(row.evidence);
  return <div className="mc-example">
    <div className="mc-example-heading"><FileCheck2 size={16} aria-hidden="true" /> Sample board update</div>
    <blockquote><ReportQuote text={claim.text} /></blockquote>
    <details>
      <summary><span className="mc-when-closed">Check the source</span><span className="mc-when-open">Hide the source</span><ChevronDown size={16} aria-hidden="true" /></summary>
      <div className="mc-source">
        <span className="mc-flag">Conflicting figures</span>
        <p><ReportQuote text={evidence.text} /></p>
        <small>{evidence.source}</small>
        <details className="mc-report"><summary>Read the sample report <Plus size={14} aria-hidden="true" /></summary><PartsSampleOutput /></details>
      </div>
    </details>
  </div>;
}

export function ModuleCatalogue({ catalogue, memberSearch }: { catalogue: readonly Kit[]; memberSearch: string }) {
  const [job, setJob] = useState<string | null>(null);
  const modulePath = (slug: string) => "/brain-modules/" + slug + memberSearch;
  const selected = jobs.find(group => group.label === job);
  const shown = selected ? catalogue.filter(kit => selected.slugs.includes(kit.slug)) : catalogue;

  return <div className="mc">
    <section className="mc-hero" aria-labelledby="mc-title" id="kit-hero">
      <div className="mc-wrap mc-opening">
        <div className="mc-intro">
          <p className="mc-label mc-product-name"><span aria-hidden="true" />Brain modules</p>
          <h1 id="mc-title">Before you put <em>your name on it.</em></h1>
          <p className="mc-lede">Build your AI brain with software that checks your own files. Catch the wrong number before your board does. See when a discount would wipe out your margin.</p>
          <div className="mc-actions">
            <Link className="mc-buy" to={modulePath(boardSlug)}>{memberSearch ? "View the board check" : "Fact-check my update · " + modulePrice} <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <a className="mc-browse" href="#kit-catalogue">Explore all {catalogue.length} modules <ArrowDown size={15} aria-hidden="true" /></a>
          </div>
          <p className="mc-platform">
            <ClaudeMark size={19} /><span>For <strong>Claude Desktop</strong> on Mac or Windows.</span>
            <span className="mc-terms">14-day refund</span>
          </p>
        </div>
        <div className="mc-instrument">
          <div className="mc-object" aria-hidden="true">
            <img src="/media/parts/brain-module-1100.webp" srcSet="/media/parts/brain-module-640.webp 640w, /media/parts/brain-module-1100.webp 1100w" sizes="(max-width: 730px) 100vw, 48vw" alt="" width={1100} height={733} decoding="async" />
          </div>
          <BoardExample />
        </div>
      </div>
    </section>

    <section className="mc-library" id="kit-catalogue" aria-labelledby="mc-library-title">
      <div className="mc-wrap mc-library-layout">
        <div className="mc-library-menu">
          <div className="mc-library-head">
            <p className="mc-label">The module library</p>
            <h2 id="mc-library-title">What’s on <em>your desk?</em></h2>
            <p>Pick the job you need done next. Each module is <strong>{modulePrice} once</strong>, with a full refund within 14 days.</p>
          </div>
          <div className="mc-groups" role="group" aria-label="Filter modules by job">
            <button type="button" aria-pressed={!job} onClick={() => setJob(null)}>All <span>{catalogue.length}</span></button>
            {jobs.map(group => <button key={group.label} type="button" aria-pressed={group.label === job} onClick={() => setJob(group.label)}>{group.label}</button>)}
          </div>
          <span className="sr-only" role="status">{shown.length} modules shown</span>
        </div>
        <div className="mc-rows">
          {shown.map(kit => {
            const Icon = jobs.find(group => group.slugs.includes(kit.slug))?.icon ?? BookOpen;
            return <details className="mc-module" key={kit.slug} name="module-library">
              <summary><span className="mc-module-icon"><Icon size={19} strokeWidth={1.6} aria-hidden="true" /></span><span>{kit.name}</span><Plus className="mc-plus" size={19} aria-hidden="true" /></summary>
              <div className="mc-module-body">
                <div><p>{kit.problem}</p><ul>{kit.does.map(item => <li key={item}><Check size={15} aria-hidden="true" />{item}</li>)}</ul>{kit.asksFor === "company" && <small>One company per purchase.</small>}</div>
                <div className="mc-row-offer">
                  <Link className="mc-row-action" to={modulePath(kit.slug)} aria-label={memberSearch ? "View member offer for " + kit.name : kit.name + ", " + modulePrice}>
                    {memberSearch ? "View member offer" : "Get this module · " + modulePrice} <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                  {!memberSearch && <small>Full refund within 14 days.</small>}
                </div>
              </div>
            </details>;
          })}
        </div>
      </div>
    </section>

    <section className="mc-notes" aria-labelledby="mc-notes-title">
      <div className="mc-wrap mc-notes-layout">
        <div className="mc-notes-intro"><p className="mc-label">What you’re buying</p><h2 id="mc-notes-title">One purchase.<br /><em>A check you keep.</em></h2>
          <p>Buy once, then add it to Claude Desktop on a Mac or Windows computer in one click. Run it again when the next decision lands.</p>
          <PartsFaqDrawer heading />
        </div>
        <div className="mc-reference">
          <details name="module-notes"><summary>How does a module work? <Plus size={17} aria-hidden="true" /></summary><div className="mc-reference-content"><PartsEngine /><PartsVersus /></div></details>
          <details name="module-notes"><summary>What could a better call be worth? <Plus size={17} aria-hidden="true" /></summary><div className="mc-reference-content"><DecisionMath /></div></details>
          <details name="module-notes"><summary>Who built these checks? <Plus size={17} aria-hidden="true" /></summary><div className="mc-reference-content"><BuiltBy /><Stories /></div></details>
          <div className="mc-spare"><p>Want to try one decision for free?</p><Link to="/measure-your-ai-judgement">Measure your AI judgement <ArrowRight size={16} aria-hidden="true" /></Link></div>
          <a className="mc-whole" href="/?start=1">Build your whole AI brain with Mindmake <ArrowUpRight size={14} aria-hidden="true" /></a>
        </div>
      </div>
    </section>
    <ExitOverlay buyHref="#kit-catalogue" buyLabel={memberSearch ? "Explore your module offers" : "Choose a brain module, " + modulePrice} />
  </div>;
}
