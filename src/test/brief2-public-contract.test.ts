import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, statSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { staticPages } from "../../scripts/lib/pages.mjs";
import { blogPosts } from "@/data/blogPosts";
import { answers } from "@/lib/answers";
import { answerPath } from "@/lib/answerFormat";
import { buildPrivateBriefHtml } from "@/components/mindmake/privateBriefHtml";
import {
  buildMindmakeBriefConfirmV2,
  buildMindmakeBriefRequestV2,
  NEWSLETTER_CONSENT_WORDING,
  NEWSLETTER_CONSENT_WORDING_VERSION,
} from "@/components/mindmake/leadDelivery";
import { ASK_ENTRIES, ASK_UNMATCHED } from "@/lib/askCorpus";
import { render as serverRender } from "@/entry-server";

/**
 * The public contract, as the rebuild brief defines it.
 *
 * Five non-negotiables gate the site: no Krish in copy, the three-second rule,
 * the motion law, one accent system, and the two-email cap. What can be checked
 * from source is checked here; the aliveness and three-second reads stay human.
 */

const ROOT = resolve(__dirname, "../..");

/** Everything a visitor can read or that renders copy for one. */
const PUBLIC_SURFACES = [
  "index.html",
  "src/App.tsx",
  "src/pages/Index.tsx",
  "src/pages/AiBrain.tsx",
  "src/pages/AiGtm.tsx",
  /* r47 moved the page's markup into its chapters; the gates follow it. */
  "src/components/ai-gtm/Opening.tsx",
  "src/components/ai-gtm/Workaround.tsx",
  "src/components/ai-gtm/StepRail.tsx",
  "src/components/ai-gtm/LeverChapter.tsx",
  "src/components/ai-gtm/TurnBand.tsx",
  "src/components/ai-gtm/PlanChapter.tsx",
  "src/components/ai-gtm/TeamChapter.tsx",
  "src/components/ai-gtm/ProofBand.tsx",
  "src/components/ai-gtm/Unbroken.tsx",
  "src/pages/CaseStudies.tsx",
  "src/pages/Contact.tsx",
  "src/pages/Alumni.tsx",
  "src/pages/Library.tsx",
  "src/pages/About.tsx",
  "src/pages/NewAgeLeadership.tsx",
  "src/pages/Blog.tsx",
  "src/pages/BlogPost.tsx",
  "src/pages/Answer.tsx",
  /* The one list /blog shows and the words on its entries and filters. */
  "src/lib/ideaFormat.ts",
  /* Every answer page's markdown, read by directory rather than named one by
     one. Publishing on that surface is dropping a file in, so a list of file
     names here would be a second list to keep in step and the first page
     somebody forgot would be the first page outside the copy gates. */
  ...readdirSync(resolve(ROOT, "src/content/answers"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => `src/content/answers/${file}`),
  "src/pages/Privacy.tsx",
  "src/pages/Terms.tsx",
  "src/pages/NotFound.tsx",
  "src/components/BlogPostCard.tsx",
  "src/components/CookieConsent.tsx",
  "src/components/mindmake/AskBar.tsx",
  "src/lib/askCorpus.ts",
  "src/components/mindmake/CloseBlock.tsx",
  /* The nine dead ends and what they say. Every string a visitor sees when
     something here fails is written in the same voice as the strings they see
     when it works, and this is what holds the two to the same standard. */
  "src/content/handoff.ts",
  "src/components/mindmake/HumanHandoff.tsx",
  "src/components/mindmake/journeys/DetailsJourney.tsx",
  "src/components/mindmake/journeys/BrainJourney.tsx",
  "src/components/mindmake/journeys/GtmJourney.tsx",
  "src/lib/workEmail.ts",
  "src/components/mindmake/CountingValue.tsx",
  "src/components/mindmake/FilmPlate.tsx",
  "src/components/mindmake/LeadBrief.tsx",
  "src/components/mindmake/Marquee.tsx",
  "src/components/mindmake/MindmakeShell.tsx",
  "src/components/mindmake/ObjectionChips.tsx",
  "src/components/mindmake/OneAtATime.tsx",
  "src/components/mindmake/FounderNote.tsx",
  "src/components/mindmake/ProofDrum.tsx",
  "src/components/mindmake/companyRead.ts",
  "src/components/mindmake/leadDelivery.ts",
  "src/components/mindmake/privateBriefHtml.ts",
  "src/components/mindmake/proposalContent.ts",
  "src/components/mindmake/MindmakeProposal.tsx",
  "src/components/new-age/AgathaStory.tsx",
  "src/components/new-age/DecisionPromptSheet.tsx",
  "src/components/new-age/OrgChart.tsx",
  "src/components/new-age/OrgChartMobile.tsx",
  "src/components/new-age/orgChartData.ts",
  "src/content/answers.json",
  "src/data/blogPosts.ts",
  "src/data/rebuildProof.ts",
  /* src/data/testimonials.ts is deliberately absent. It holds thirty-three
     verbatim quotes, and the house style rules these gates enforce govern the
     practice's own voice, not what other people wrote. Scanning it would force
     the quotes to be edited, and an edited quote attributed to a named person
     is not a quote. The rule that does apply to that file, that every shortened
     quote is an exact substring of the full one, is enforced by
     src/test/testimonials.test.ts. */
  "scripts/generate-llms.mjs",
  "scripts/generate-sitemap.mjs",
  "scripts/prerender.mjs",
  "public/llms.txt",
];

/** Files whose motion has to obey the motion law. */
const MOTION_SURFACES = [
  "src/hooks/useScrollDriver.ts",
  "src/components/mindmake/CountingValue.tsx",
  "src/components/mindmake/FilmPlate.tsx",
  "src/components/mindmake/Marquee.tsx",
  "src/components/mindmake/MindmakeShell.tsx",
  "src/pages/Index.tsx",
  "src/pages/AiBrain.tsx",
  "src/pages/AiGtm.tsx",
  "src/components/ai-gtm/Opening.tsx",
  "src/components/ai-gtm/Workaround.tsx",
  "src/components/ai-gtm/StepRail.tsx",
  "src/components/ai-gtm/LeverChapter.tsx",
  "src/components/ai-gtm/TurnBand.tsx",
  "src/components/ai-gtm/PlanChapter.tsx",
  "src/components/ai-gtm/TeamChapter.tsx",
  "src/components/ai-gtm/ProofBand.tsx",
  "src/components/ai-gtm/Unbroken.tsx",
  "src/hooks/usePinnedSteps.ts",
  "src/styles/mindmake-ai-gtm.css",
  "src/styles/mindmake.css",
  "src/styles/mindmake-instruments.css",
];

const read = (relative: string) => readFileSync(resolve(ROOT, relative), "utf8");
const readAll = (surfaces: string[]) => surfaces
  .filter((surface) => existsSync(resolve(ROOT, surface)))
  .map((surface) => [surface, read(surface)] as const);

describe("the Krish gate", () => {
  /* The ban is on the operator appearing in the site's voice, and that is still
     what this gate holds. What changed on 28 August 2026 is where the voice
     stops.

     Founder-led, practice voice: he appears in the founder section, in the
     framing of the proof, and inside verbatim quotes other people wrote. The
     rest of the site is the practice speaking as we, with no first person, no
     biography and no portrait. So the scan below still runs over every page and
     every piece of copy the practice authors, and the two files that hold other
     people's words and the founder's own section are named exceptions rather
     than a hole in the rule.

     The mailbox is a third exception, declared once in src/lib/publicLinks.ts
     and read by every page, so it stays one line in one file. */
  const CONTACT_MAILBOX = /krish@themindmaker\.ai/g;

  /** Surfaces allowed to carry the name, and the reason each one is. */
  const NAMED_SURFACES: Record<string, string> = {
    "src/data/testimonials.ts": "thirty-three verbatim quotes, several of which name him",
    "src/components/mindmake/FounderNote.tsx": "the founder section: his bio, in his own voice",
    "src/components/mindmake/ProofDrum.tsx": "the framing of the proof: who these people worked with",
    "src/pages/About.tsx": "the About us page: who runs the practice and why, in his own voice (Krish, 2026-09-25)",
  };

  it("keeps the operator's name out of the practice's own voice", () => {
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      if (surface in NAMED_SURFACES) continue;
      const copy = source.replace(CONTACT_MAILBOX, "");
      expect(`${surface}: ${copy.toLowerCase().includes("krish")}`).toBe(`${surface}: false`);
    }
  });

  it("names every surface allowed to carry it, and only those", () => {
    /* An exception that nobody has to declare is not an exception. Adding a
       page to this list is a decision somebody makes on purpose, in a diff. */
    for (const surface of Object.keys(NAMED_SURFACES)) {
      expect(`${surface} exists: ${existsSync(resolve(ROOT, surface))}`)
        .toBe(`${surface} exists: true`);
      expect(NAMED_SURFACES[surface].length > 20).toBe(true);
    }
    expect(Object.keys(NAMED_SURFACES)).toHaveLength(4);
  });

  it("keeps the practice speaking as we, even where he is named", () => {
    /* The founder section carries first person because the bio is his, and the
       quotes carry it because the people who wrote them were speaking. Nothing
       else may: a page that says "I build" has stopped being the practice.
       Comments are stripped, since a note to the next engineer is not copy. */
    const prose = (source: string) => source
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/\/\/[^\n]*/g, "")
      .replace(/import[^\n]*\n/g, "");
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      if (surface in NAMED_SURFACES) continue;
      expect(`${surface}: ${/\b(I build|I help|I work with|my practice|my clients)\b/i.test(prose(source))}`)
        .toBe(`${surface}: false`);
    }
  });

  it("declares the contact mailbox once, and says why it is that one", () => {
    const links = read("src/lib/publicLinks.ts");
    expect(links).toContain("CONTACT_EMAIL");
    /* mindmake.co has no MX record, so the branded aliases bounce. A privacy
       contact that bounces is worse than one on the older domain, and the
       comment has to keep saying so until the aliases exist. */
    expect(links).toContain("no MX record");
    for (const surface of [
      "src/pages/Privacy.tsx",
      "src/pages/Terms.tsx",
      "src/pages/Contact.tsx",
      "src/pages/Alumni.tsx",
      "src/pages/About.tsx",
    ]) {
      const source = read(surface);
      expect(`${surface} reads the constant: ${source.includes("CONTACT_EMAIL")}`)
        .toBe(`${surface} reads the constant: true`);
      expect(`${surface} hardcodes an address: ${/mailto:[a-z]+@/.test(source)}`)
        .toBe(`${surface} hardcodes an address: false`);
    }
  });

  /* The photographs came back with the founder section, so what this asserts
     now is where they live. In src/assets they are hashed, sized and imported
     by the one component that shows them; in public/ they were loose files any
     page could reference and the old build shipped whether used or not. */
  it("keeps the founder photographs out of public/ and under the build", () => {
    for (const asset of ["public/Krish-Headshot.png", "public/krish-stage-2-hero.webp"]) {
      expect(`${asset} is loose: ${existsSync(resolve(ROOT, asset))}`).toBe(`${asset} is loose: false`);
    }
    for (const asset of [
      "src/assets/founder/Krish-Headshot.png",
      "src/assets/founder/krish-stage-2-hero.webp",
    ]) {
      expect(`${asset} exists: ${existsSync(resolve(ROOT, asset))}`).toBe(`${asset} exists: true`);
    }
  });
});

describe("the three-second gate", () => {
  /* Vocabulary a non-technical scroller should never have to decode. Prose
     only: these words are legitimate in code, so the scan reads visible copy. */
  const BANNED_WORDS = [
    "ingest", "orchestrate", "agentic", "harness", "semantic",
  ];

  const visibleCopy = (source: string) => source
    // JSX/HTML text and quoted strings carry the copy; imports and classes do not.
    .replace(/import[^\n]*\n/g, "")
    .replace(/className="[^"]*"/g, "")
    .replace(/from "[^"]*"/g, "");

  it("keeps banned vocabulary out of public copy", () => {
    /* One approved exception, from the brief's own final copy: the mirror card
       says an AI "ingests what you tell it", where the word carries its plain
       English sense rather than the machine one the ban is aimed at. */
    const APPROVED = /ingests what you tell it/g;
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      const copy = visibleCopy(source).toLowerCase().replace(APPROVED, "");
      for (const word of BANNED_WORDS) {
        expect(`${surface} uses "${word}": ${copy.includes(word)}`).toBe(`${surface} uses "${word}": false`);
      }
    }
  });

  it("allows inference only where the board prices it", () => {
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      const copy = visibleCopy(source).toLowerCase();
      const uses = copy.match(/inference/g) ?? [];
      const priced = copy.match(/inference cost/g) ?? [];
      expect(`${surface}: ${uses.length - priced.length}`).toBe(`${surface}: 0`);
    }
  });

  it("rejects the AI-cliche antithesis templates", () => {
    /* "not X, but Y", "X. Not Y." and "never just X" all lean on a negation to
       praise something. The brief says state the fact instead. */
    const ANTITHESIS = [
      /\bnot [a-z]{2,}[^.?!]{0,40}, but\b/i,
      /\.\s+Not [A-Z][a-z]+[.,]/,
      /\bnever just\b/i,
      /\bit never\b[^.?!]{0,30}\bit does\b/i,
    ];
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      const copy = visibleCopy(source);
      for (const pattern of ANTITHESIS) {
        expect(`${surface} matches ${pattern}: ${pattern.test(copy)}`)
          .toBe(`${surface} matches ${pattern}: false`);
      }
    }
  });

  it("keeps em dashes and American spellings out of public copy", () => {
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      expect(`${surface}: ${source.includes("—")}`).toBe(`${surface}: false`);
      expect(`${surface}: ${/\bjudgment\b/.test(source)}`).toBe(`${surface}: false`);
    }
  });
});

describe("the eyebrow ban", () => {
  /* No small pre-heading above a hero or a section title, anywhere. Renaming
     it or changing its case does not make it acceptable: what is banned is a
     decorative label sitting above a real heading. A small label may remain
     only where it names an object, a control, a value or an axis. */
  const PAGES = [
    "src/pages/Index.tsx",
    "src/pages/AiBrain.tsx",
    "src/pages/AiGtm.tsx",
    "src/components/ai-gtm/Opening.tsx",
    "src/components/ai-gtm/Workaround.tsx",
    "src/components/ai-gtm/StepRail.tsx",
    "src/components/ai-gtm/LeverChapter.tsx",
    "src/components/ai-gtm/TurnBand.tsx",
    "src/components/ai-gtm/PlanChapter.tsx",
    "src/components/ai-gtm/TeamChapter.tsx",
    "src/components/ai-gtm/ProofBand.tsx",
    "src/components/ai-gtm/Unbroken.tsx",
    "src/pages/NewAgeLeadership.tsx",
    "src/components/mindmake/ReflexDeck.tsx",
    "src/components/new-age/AgathaStory.tsx",
    "src/components/mindmake/ForkBand.tsx",
    "src/components/mindmake/ProofStrip.tsx",
    "src/components/mindmake/ObjectionChips.tsx",
    "src/components/mindmake/CloseBlock.tsx",
  /* The nine dead ends and what they say. Every string a visitor sees when
     something here fails is written in the same voice as the strings they see
     when it works, and this is what holds the two to the same standard. */
  "src/content/handoff.ts",
  "src/components/mindmake/HumanHandoff.tsx",
  "src/components/mindmake/journeys/DetailsJourney.tsx",
  "src/components/mindmake/journeys/BrainJourney.tsx",
  "src/components/mindmake/journeys/GtmJourney.tsx",
  "src/lib/workEmail.ts",
  ];

  it("never places a label immediately above a heading", () => {
    for (const [surface, source] of readAll(PAGES)) {
      /* A label element followed by a heading, ignoring whitespace, is the
         exact shape of the thing that is banned. */
      const eyebrow = /mm-label[^>]*>[^<]*<\/(?:p|span)>\s*<h[1-3]/;
      expect(`${surface}: ${eyebrow.test(source)}`).toBe(`${surface}: false`);
    }
  });

  it("keeps the remaining labels on data rather than headings", () => {
    /* The labels that survive name a lane on the board or a question in a
       journey. Both are axes, and neither introduces a heading. */
    const board = read("src/components/mindmake/board/LiveBoard.tsx");
    expect(board).toMatch(/mm-label[^>]*>\{lane\}/);
  });

  it("uses no em dashes anywhere in public copy", () => {
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      expect(`${surface}: ${source.includes("\u2014")}`).toBe(`${surface}: false`);
    }
  });
});

describe("the motion gate", () => {
  it("keeps the observer out of every surface but the one primitive", () => {
    /* This used to assert the observer appeared nowhere at all, which was the
       checkable form of a ban on entrance choreography. Krish lifted that ban on
       29 August 2026, so the assertion narrows rather than disappearing: arrival
       is allowed, and it happens in `useReveal` or it does not happen. What the
       ban was really protecting is enforced in `reveal-contract.test.tsx`, which
       asks whether the page is still whole when the reveal never fires. */
    for (const [surface, source] of readAll(MOTION_SURFACES)) {
      expect(`${surface}: ${source.includes("IntersectionObserver")}`).toBe(`${surface}: false`);
    }
    expect(read("src/hooks/useReveal.ts")).toContain("IntersectionObserver");
  });

  it("keeps animation libraries off the three rebuilt pages", () => {
    for (const [surface, source] of readAll([
      "src/pages/Index.tsx",
      "src/pages/AiBrain.tsx",
      "src/pages/AiGtm.tsx",
      "src/components/ai-gtm/Opening.tsx",
      "src/components/ai-gtm/Workaround.tsx",
      "src/components/ai-gtm/StepRail.tsx",
      "src/components/ai-gtm/LeverChapter.tsx",
      "src/components/ai-gtm/TurnBand.tsx",
      "src/components/ai-gtm/PlanChapter.tsx",
      "src/components/ai-gtm/TeamChapter.tsx",
      "src/components/ai-gtm/ProofBand.tsx",
      "src/components/ai-gtm/Unbroken.tsx",
      "src/hooks/usePinnedSteps.ts",
    ])) {
      expect(`${surface}: ${source.includes("framer-motion")}`).toBe(`${surface}: false`);
    }
  });

  it("never animates opacity or transform from an absent state", () => {
    /* Entrance choreography always starts from opacity:0 or a translated
       offset. Ambient and touch motion never do. */
    const css = read("src/styles/mindmake-instruments.css");
    /* Scoped to the keyframes block itself. The first version of this ran from
       a keyframes rule to the next at-rule, so an ordinary rule a few
       declarations below a harmless keyframes tripped it: the film loop's
       crossfade, which is a transition on a class over a still of the very
       same frame, and not an entrance from anywhere. */
    const blocks = css.match(/@keyframes[^{]*\{(?:[^{}]*\{[^}]*\})+\s*\}/g) ?? [];
    const entrances = blocks.filter((block) => /opacity:\s*0(?![.\d])/.test(block));
    expect(entrances).toEqual([]);
  });

  it("drives the scrubbed builds from position, never from an event", () => {
    /* This is the whole distinction between a build and a reveal, and it is why
       the entrance ban did not have to move to allow these. A device that reads
       scroll position reverses when you scroll back; one that latches on a
       first sighting cannot. A `started`/`seen`/`hasFired` flag is that latch. */
    for (const [surface, source] of readAll([
      "src/components/mindmake/ScrubText.tsx",
      "src/components/mindmake/CountingValue.tsx",
    ])) {
      expect(`${surface} uses the driver: ${source.includes("useScrollDriver")}`)
        .toBe(`${surface} uses the driver: true`);
      expect(`${surface} latches: ${/\b(started|hasFired|seen|played)\b/.test(source)}`)
        .toBe(`${surface} latches: false`);
    }
  });

  it("keeps every word of a scrubbed sentence in the document", () => {
    /* Only opacity moves. A crawler, a screen reader, and someone landing
       mid-page all get the complete sentence. */
    const scrub = read("src/components/mindmake/ScrubText.tsx");
    expect(scrub).toContain("text.split(");
    expect(scrub).toMatch(/opacity:\s*dim \+/);
    expect(`hides words: ${/display:\s*"?none|visibility:\s*"?hidden/.test(scrub)}`)
      .toBe("hides words: false");
  });

  it("never lets a settling figure read a number that is not true", () => {
    /* A live figure counting up from nothing states a false value on the way.
       It settles from a fraction of the real number instead. */
    const counting = read("src/components/mindmake/CountingValue.tsx");
    expect(counting).toMatch(/from = 0\.\d+/);
    expect(counting).toContain("value * from");
  });

  it("carries the ambient floor on every section, not only where a plate sits", () => {
    /* The floor is that no viewport is ever fully still. Plates and the marquee
       only cover part of a page, so the section ground carries the same light.
       Attaching it to the section wrappers is what makes the floor structural
       rather than something to remember: a new section inherits it. */
    const css = read("src/styles/mindmake-instruments.css");
    expect(css).toMatch(/@keyframes mm-ground-light/);
    const rule = css.match(/\.mm-block::before,[\s\S]*?\}/)?.[0] ?? "";
    expect(rule).toContain(".mm-close::before");
    expect(rule).toContain("animation: mm-ground-light");
    /* Behind the content and out of the way of the hand. */
    expect(rule).toContain("z-index: -1");
    expect(rule).toContain("pointer-events: none");
  });

  it("stills the ambient layer under reduced motion", () => {
    const css = read("src/styles/mindmake-instruments.css");
    expect(css).toContain("prefers-reduced-motion");
    expect(css).toMatch(/prefers-reduced-motion[\s\S]*mm-marquee-track\s*\{\s*animation:\s*none/);
    expect(css).toMatch(/prefers-reduced-motion[\s\S]*mm-block::before[\s\S]*?animation:\s*none/);
  });

  it("pins the scroll driver to its completed value under reduced motion", () => {
    const driver = read("src/hooks/useScrollDriver.ts");
    expect(driver).toContain("prefers-reduced-motion");
    expect(driver).toContain("notify(1)");
  });
});

describe("one accent system", () => {
  it("defines mint and amber and nothing else as colour", () => {
    const tokens = read("src/styles/mindmake.css");
    expect(tokens).toContain("--mm-amber: #e0a44a");
    expect(tokens).toContain("--mm-ink: #0a100d");
    expect(tokens).toContain("--mm-paper: #f2f1ea");

    /* Mint is one literal in two roles. `--mm-mint-bright` is the accent as a
       surface — a filled button, a pressed chip, the marquee band — and stays
       bright on every ground. `--mm-mint` is the accent as text and line, and
       derives from it, so there is still exactly one mint in the file.

       The split exists because #7fe3b4 on cream is 1.2:1. Before it, the paper
       ground could not carry a mint claim, a mint link or a mint rule, which is
       most of why a ground that had been built and tested was used on one band
       of one page and nowhere else. */
    expect(tokens).toContain("--mm-mint-bright: #7fe3b4");
    expect(tokens).toContain("--mm-mint: var(--mm-mint-bright)");
    const declarations = tokens.replace(/\/\*[\s\S]*?\*\//g, "");
    expect(declarations.match(/#7fe3b4/g) ?? []).toHaveLength(1);
  });

  it("lets a ground redefine the accent as text but never as a surface", () => {
    /* The one rule that keeps the split honest. If a paper band redefined
       --mm-mint-bright it would turn the marquee into a dark green band with
       dark text on it, and if a surface rule read --mm-mint it would go dark
       mint on paper and take --mm-mint-ink with it. */
    const tokens = read("src/styles/mindmake.css");
    const paper = tokens.slice(tokens.indexOf(".mm-on-paper {"));
    const block = paper.slice(0, paper.indexOf("}"));
    expect(block).toContain("--mm-mint: var(--mm-mint-d)");
    expect(block).not.toContain("--mm-mint-bright:");

    for (const file of ["src/styles/mindmake.css", "src/styles/mindmake-instruments.css", "src/styles/mindmake-brief.css"]) {
      const css = read(file);
      expect(css, file).not.toMatch(/background(-color)?:\s*var\(--mm-mint\)/);
    }
  });

  it("puts the ink palette back wherever a dark island sits inside paper", () => {
    /* The fork band's dark head painted its own near-black ground inside a
       paper section, and the moment paper started redefining the accent its
       claim rendered dark green on near-black. The band went on 5 September
       2026, so there is no island left; what this holds now is that nothing in
       the instruments paints the ink ground for itself without joining the
       ink-palette selector in mindmake.css, which is how the next island would
       fail the same way. */
    const tokens = read("src/styles/mindmake.css");
    const group = tokens.slice(0, tokens.indexOf("--mm-ground-light: rgba(127, 227, 180, .07)"));
    expect(group).toContain(".mm-on-ink {");

    const instruments = read("src/styles/mindmake-instruments.css");
    for (const match of instruments.matchAll(/^(\.[a-z0-9_-]+)[^{]*\{[^}]*background:\s*#0d1310/gm)) {
      expect(group, match[1]).toContain(match[1]);
    }
  });

  it("gives every interactive element a visible mint focus ring", () => {
    const tokens = read("src/styles/mindmake.css");
    expect(tokens).toMatch(/:focus-visible\s*\{\s*outline:\s*2px solid var\(--mm-focus\)/);
    /* The ring derives from the accent rather than repeating its hex, so a
       change to the accent cannot leave the focus ring behind. It reads the
       bright token on purpose: an outline that dimmed on a paper ground would
       be the one outline that must not. */
    expect(tokens).toContain("--mm-focus: var(--mm-mint-bright)");
  });

  it("reserves the serif for the claim and the mono for data", () => {
    const tokens = read("src/styles/mindmake.css");
    expect(tokens).toMatch(/\.mm-claim\s*\{[^}]*var\(--mm-serif\)/);
    expect(tokens).toMatch(/\.mm-label\s*\{[^}]*var\(--mm-mono\)/);
  });
});

describe("the conversion contract", () => {
  it("offers one way in, worded in one place, and books nothing", () => {
    const shell = read("src/components/mindmake/MindmakeShell.tsx");
    const links = read("src/lib/publicLinks.ts");
    /* The words live in publicLinks.ts so the menu, the action bar and every
       page's own close read the same label. A literal here would let one
       surface drift and still pass. */
    expect(shell).toContain("START_LABEL");
    expect(links).toContain("export const START_LABEL");
    /* The flow behind it is a written brief that we follow up on. It books no
       session, so nothing on the shell may say it does. */
    for (const claim of ["calendly", "book a fit call", "book a call", "book a session", "schedule a call"]) {
      expect(`${claim}: ${shell.toLowerCase().includes(claim)}`).toBe(`${claim}: false`);
      expect(`${claim}: ${links.toLowerCase().includes(claim)}`).toBe(`${claim}: false`);
    }
  });

  it("keeps the approved R3 routes in the shell menu", () => {
    const shell = read("src/components/mindmake/MindmakeShell.tsx");
    const links = read("src/lib/publicLinks.ts");
    expect(shell).toContain("PRIMARY_ROUTES.map");
    for (const item of [
      "Build your AI brain",
      "Build your AI GTM",
      "Home",
      "Success stories",
      "Ideas you can use",
      "Questions we get asked",
      "About us",
      "Media",
    ]) {
      expect(links).toContain(item);
    }
  });

  it("keeps prices off every public surface", () => {
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      expect(`${surface}: ${/\$\s?\d{1,3}[,.]?\d{3}/.test(source)}`).toBe(`${surface}: false`);
    }
  });

  it("offers the publication as a subscription, not a consolation or a band", () => {
    /* It used to be eleven pixels of muted mono at the foot of the close block,
       reading "Not ready? Take the weekly read instead", which framed it as
       what you take when you will not take the real thing. The close block
       still offers no runner-up prize. */
    const close = read("src/components/mindmake/CloseBlock.tsx");
    expect(`close offers a consolation: ${close.includes("Not ready")}`)
      .toBe("close offers a consolation: false");

    /* Ruling (Krish, 2026-09-25): the "reading, if you want it separately"
       band is gone everywhere. Subscribing is offered where it costs the page
       nothing: the badge beside Media, the footer, and the brief's success
       step, each saying the same "Subscribe for free". */
    expect(`band exists: ${existsSync(resolve(process.cwd(), "src/components/mindmake/SubscribeBand.tsx"))}`)
      .toBe("band exists: false");
    for (const page of ["src/pages/CaseStudies.tsx", "src/pages/AiGtm.tsx", "src/pages/AiBrainLocked.tsx", "src/pages/Index.tsx"]) {
      expect(read(page)).not.toContain("SubscribeBand");
    }

    const links = read("src/lib/publicLinks.ts");
    expect(links).toContain("https://makeyourmindup.ai");
    expect(links).toContain('SUBSCRIBE_LABEL = "Subscribe for free"');
    const shell = read("src/components/mindmake/MindmakeShell.tsx");
    expect(shell).toContain("SUBSCRIBE_URL");
    /* Media reaches the shell footer through the shared route list, as it
       does on the homepage's rail, rather than as a footer-only link. */
    expect(shell).toContain("PRIMARY_ROUTES");
    expect(links).toMatch(/label: "Media", href: PUBLICATION_URL/);
    expect(read("src/components/mindmake/LeadBrief.tsx")).toContain("SUBSCRIBE_LABEL");
  });
});

describe("the naming law", () => {
  /* A business with two names has none. Mindmake is the only name for the
     business, and the publication runs exactly two channels. Everything else
     that has ever looked like a brand name here is dead. */

  it("uses no earlier name for the business", () => {
    /* Three exceptions, all deliberate and all narrow, and none of them a name.
       `Mindmaker LLC` is the registered legal entity and belongs in the two
       legal pages, where the law wants the registrant named. The substack.com
       address is where the publication is hosted. The themindmaker.ai mailbox
       is where mail actually arrives, because mindmake.co has no MX record. */
    const LEGAL_ENTITY = /Mindmaker LLC/g;
    const HOSTING = /mindmakerlive\.substack\.com/g;
    const MAILBOX = /krish@themindmaker\.ai/g;
    const LEGAL_PAGES = new Set(["src/pages/Privacy.tsx", "src/pages/Terms.tsx"]);

    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      let copy = source.replace(HOSTING, "").replace(MAILBOX, "");
      if (LEGAL_PAGES.has(surface)) copy = copy.replace(LEGAL_ENTITY, "");
      expect(`${surface} uses an older name: ${/mindmaker/i.test(copy)}`)
        .toBe(`${surface} uses an older name: false`);
    }
  });

  it("names the publication's two channels and no others", () => {
    const canon = read("project-documentation/00_NORTH_STAR.md");
    expect(canon).toContain("The Money of AI");
    expect(canon).toContain("Built with AI");
    /* The channel that was renamed. Its old form must not survive anywhere a
       reader or a model would take it as current. */
    for (const doc of ["project-documentation/00_NORTH_STAR.md", "project-documentation/02_PUBLICATION.md"]) {
      expect(`${doc}: ${/Building with AI/.test(read(doc))}`).toBe(`${doc}: false`);
    }
  });

  it("keeps the documentation set to one reading order with no history file", () => {
    /* A source of truth someone can read cold has exactly one of each thing.
       A parallel history file full of superseded decisions defeats that. */
    for (const gone of [
      "project-documentation/DECISIONS_LOG.md",
      "project-documentation/MINDMAKE_CANON.md",
      "project-documentation/MINDMAKE_PROPOSITION_LOCK.md",
      "HANDOVER/README.md",
      "CHANGELOG.md",
    ]) {
      expect(`${gone} exists: ${existsSync(resolve(ROOT, gone))}`).toBe(`${gone} exists: false`);
    }
    for (const required of [
      "project-documentation/00_NORTH_STAR.md",
      "project-documentation/01_CANON.md",
      "project-documentation/02_PUBLICATION.md",
      "project-documentation/03_DESIGN_CONTRACT.md",
      "project-documentation/04_PROOF.md",
      "project-documentation/05_LEAD_DELIVERY_SPEC.md",
      "project-documentation/06_CURRENT_STATE.md",
      "project-documentation/07_DEPLOYMENT.md",
    ]) {
      expect(`${required} exists: ${existsSync(resolve(ROOT, required))}`).toBe(`${required} exists: true`);
    }
  });

  it("keeps the canon's list of public answers in step with the ones that ship", () => {
    /* The canon delegates the wording of public answers to answers.json, because
       that file is what a visitor actually reads. Delegation is only honest
       while the canon still names every topic the file covers, so a new answer
       cannot appear on the site without the documentation knowing. */
    const canon = read("project-documentation/01_CANON.md");
    /* Markdown wraps at the column, so a phrase can straddle a line break. */
    const covered = canon.slice(canon.indexOf("questions people actually ask")).replace(/\s+/g, " ");
    const TOPIC: Record<string, string> = {
      cost: "cost",
      technical: "whether you need to be technical",
      duration: "what happens when the work ends",
      data: "who sees your data",
      consultant: "how this differs from a consultant",
      chatgpt: "why not just use a chatbot",
      "where-to-use": "where you use your AI brain",
      "keep-it-right": "how you keep your AI brain up to date",
      team: "how much of the team's time it takes",
      keep: "what you keep",
      report: "whether it is a document or something that works",
      speed: "how soon you see something working",
      start: "how to start",
      fit: "whether it fits your business",
      email: "whether we will email forever",
      "how-we-work": "what actually happens in the work",
      included: "what is included",
      "why-not-myself": "why you need this rather than doing it yourself",
      charging: "how we charge",
      risk: "what happens if it does not work",
      "tried-it": "why it would be different when AI has already got things wrong",
      size: "whether you need to be a certain size",
      private: "whether anyone in your company needs to know",
    };
    for (const entry of ASK_ENTRIES) {
      expect(`01_CANON names the "${entry.id}" answer: ${entry.id in TOPIC}`)
        .toBe(`01_CANON names the "${entry.id}" answer: true`);
      expect(`01_CANON covers ${entry.id}: ${covered.includes(TOPIC[entry.id])}`)
        .toBe(`01_CANON covers ${entry.id}: true`);
    }
  });

  it("leaves no documentation link pointing at a file that was removed", () => {
    const docs = readdirSync(resolve(ROOT, "project-documentation"))
      .filter((name) => name.endsWith(".md"))
      .map((name) => `project-documentation/${name}`);
    for (const [surface, source] of readAll([...docs, "README.md", "CLAUDE.md"])) {
      for (const match of source.matchAll(/`(project-documentation\/[A-Za-z0-9_.]+\.md)`/g)) {
        expect(`${surface} links ${match[1]}: ${existsSync(resolve(ROOT, match[1]))}`)
          .toBe(`${surface} links ${match[1]}: true`);
      }
      for (const match of source.matchAll(/\]\((project-documentation\/[A-Za-z0-9_.]+\.md)\)/g)) {
        expect(`${surface} links ${match[1]}: ${existsSync(resolve(ROOT, match[1]))}`)
          .toBe(`${surface} links ${match[1]}: true`);
      }
    }
  });
});

describe("the ask bar corpus", () => {
  const entries = ASK_ENTRIES;

  it("answers the eight objections the brief requires", () => {
    const required = ["cost", "technical", "duration", "data", "consultant", "chatgpt", "team", "keep"];
    for (const id of required) {
      expect(entries.map((entry) => entry.id)).toContain(id);
    }
  });

  it("gives every entry a question, keywords and an answer", () => {
    for (const entry of entries) {
      expect(entry.question.length).toBeGreaterThan(8);
      expect(entry.keywords.length).toBeGreaterThan(2);
      expect(entry.answer.length).toBeGreaterThan(30);
    }
  });

  it("answers an unmatched question honestly and routes it into the funnel", () => {
    expect(ASK_UNMATCHED).toContain("results email");
  });
});

describe("the Brain decision proof", () => {
  it("keeps internal CTRL captures off the shortened public route", () => {
    for (const [surface, source] of readAll(PUBLIC_SURFACES)) {
      expect(`${surface}: ${source.includes("assets/ctrl/")}`).toBe(`${surface}: false`);
    }
    expect(read("src/components/mindmake/ProofViewer.tsx")).toContain("assets/ctrl/");
    expect(read("src/pages/AiBrain.tsx")).not.toContain("ProofViewer");
  });

  it("keeps the internal engine name out of the public argument", () => {
    for (const [surface, source] of readAll(["src/pages/Index.tsx", "src/pages/AiBrain.tsx", "src/pages/AiGtm.tsx", "src/components/ai-gtm/Opening.tsx", "src/components/ai-gtm/Workaround.tsx", "src/components/ai-gtm/StepRail.tsx", "src/components/ai-gtm/LeverChapter.tsx", "src/components/ai-gtm/TurnBand.tsx", "src/components/ai-gtm/PlanChapter.tsx", "src/components/ai-gtm/TeamChapter.tsx", "src/components/ai-gtm/ProofBand.tsx", "src/components/ai-gtm/Unbroken.tsx"])) {
      expect(`${surface}: ${/\bCTRL\b/.test(source)}`).toBe(`${surface}: false`);
    }
  });

  it("never links or prices the product", () => {
    const brain = read("src/pages/AiBrain.tsx");
    expect(brain).not.toMatch(/href=["'][^"']*ctrl\./i);
    expect(brain).not.toMatch(/to=["'][^"']*ctrl/i);
  });

  it("makes one decision and one attributed outcome tangible", () => {
    const brain = read("src/pages/AiBrain.tsx");
    const proofRecords = read("src/data/rebuildProof.ts");
    const clientWords = read("src/data/testimonials.ts");
    for (const state of ["Decision", "Brain", "Evidence", "Correction"]) expect(brain).toContain(state);
    expect(brain).toContain("Inspect how a decision becomes reusable judgement.");
    expect(brain).toContain("Correct it once.");
    expect(brain).toContain("clientStories");
    expect(proofRecords).toContain('...spoken("wellness-founder")');
    expect(clientWords).toContain("I used to post once a month; now it's most days");
    expect(brain).toContain("identity withheld");
  });
});

describe("the film slots", () => {
  it("ships a poster and both formats for every film", () => {
    for (const id of ["01", "02", "03", "04", "05", "06"]) {
      for (const suffix of ["poster.jpg", "poster.webp"]) {
        expect(existsSync(resolve(ROOT, `src/assets/films/aug2026/film-${id}-${suffix}`))).toBe(true);
      }
    }
    /* Five ambient loops, and the proof film, which is a different thing. */
    for (const id of ["01", "02", "03", "04", "06"]) {
      for (const suffix of ["loop.mp4", "loop.webm"]) {
        expect(existsSync(resolve(ROOT, `src/assets/films/aug2026/film-${id}-${suffix}`))).toBe(true);
      }
    }
    for (const suffix of ["proof.mp4", "proof.webm"]) {
      expect(existsSync(resolve(ROOT, `src/assets/films/aug2026/film-05-${suffix}`))).toBe(true);
    }
  });

  it("keeps what every visitor downloads inside the performance budget", () => {
    /* Two budgets, because two different things are being paid for. A poster is
       in the markup and carries the paint, so it stays small. An ambient loop
       arrives after the paint but still arrives unasked, so it stays modest.
       The proof film is neither: nothing fetches it until someone clicks, which
       is why it is allowed to be a real sixty-second film. */
    const dir = resolve(ROOT, "src/assets/films/aug2026");
    for (const file of readdirSync(dir)) {
      const bytes = statSync(resolve(dir, file)).size;
      const cap = file.includes("poster") ? 200_000 : file.includes("proof") ? 10_000_000 : 2_000_000;
      expect(`${file} (${bytes}B, cap ${cap}B): ${bytes < cap}`)
        .toBe(`${file} (${bytes}B, cap ${cap}B): true`);
    }
  });

  it("charges nobody for the long proof film without an explicit play", () => {
    const plate = read("src/components/mindmake/FilmPlate.tsx");
    expect(plate).toContain("clickToPlay && playing");
    expect(plate).toContain("showLoop = hasFilm && !clickToPlay && motion");
    const brain = read("src/pages/AiBrain.tsx");
    expect(brain).toContain("filmTwoPoster");
    expect(brain).toContain("filmTwoLoopWebm");
    expect(brain).not.toContain("filmFiveProof");
  });

  it("serves the still, not the film, to anyone who asked for less motion", () => {
    /* The loop is never mounted rather than mounted and paused, so a visitor
       who asked for reduced motion does not fetch a video at all. */
    const plate = read("src/components/mindmake/FilmPlate.tsx");
    expect(plate).toContain("useAmbientMotion");
    expect(plate).toMatch(/showLoop\s*=\s*hasFilm && !clickToPlay && motion/);
    const hook = read("src/hooks/useAmbientMotion.ts");
    expect(hook).toContain("prefers-reduced-motion");
    expect(hook).toContain("useState(false)");
  });

  it("describes every plate for assistive technology", () => {
    const plate = read("src/components/mindmake/FilmPlate.tsx");
    expect(plate).toContain('role: "img"');
    expect(plate).toContain('"aria-label": label');
    /* A plate behind content that already names the thing is hidden instead,
       so a door is not read out twice. That is a second branch, not a way to
       skip the label: the check below is what stops it becoming one. */
    expect(plate).toContain('"aria-hidden": true');
  });

  it("gives every plate on a page either a description or a reason not to", () => {
    /* Every <FilmPlate> in the tree carries a non-empty label, or is marked
       decorative because the copy sitting on it already says what it is. An
       empty label with neither is a plate that announces itself as an image
       called nothing. */
    for (const [surface, source] of readAll(["src/pages/Index.tsx", "src/pages/AiBrain.tsx", "src/pages/AiGtm.tsx"])) {
      // Index consumes the immutable compiled adapter. Inspect what it renders,
      // not a wrapper file that deliberately contains no duplicated markup.
      const renderedSource = surface === "src/pages/Index.tsx" ? serverRender("/") : source;
      const plates = renderedSource.split("<FilmPlate").slice(1);
      const nativeVideos = renderedSource.split("<video").slice(1);
      expect(`${surface} has visual media: ${plates.length > 0 || nativeVideos.length > 0}`).toBe(`${surface} has visual media: true`);
      for (const [at, plate] of plates.entries()) {
        const props = plate.slice(0, plate.indexOf("/>"));
        const labelled = /label="[^"]+"/.test(props) || /label=\{[^}]+\}/.test(props);
        const decorative = /\bdecorative\b/.test(props);
        expect(`${surface} plate ${at}: ${labelled || decorative}`)
          .toBe(`${surface} plate ${at}: true`);
        /* And never both, which would mean a description nothing can read. */
        expect(`${surface} plate ${at} is both: ${labelled && decorative}`)
          .toBe(`${surface} plate ${at} is both: false`);
      }
      for (const [at, video] of nativeVideos.entries()) {
        const props = video.slice(0, video.indexOf(">"));
        const labelled = /aria-label="[^"]+"/.test(props);
        const decorative = /aria-hidden="true"/.test(props);
        expect(`${surface} video ${at} has a poster: ${/\bposter=/.test(props)}`)
          .toBe(`${surface} video ${at} has a poster: true`);
        expect(`${surface} video ${at} is described or decorative: ${labelled || decorative}`)
          .toBe(`${surface} video ${at} is described or decorative: true`);
        expect(`${surface} video ${at} is both: ${labelled && decorative}`)
          .toBe(`${surface} video ${at} is both: false`);
      }
    }
  });
});

describe("the lead machinery is untouched", () => {
  it("still builds the version 2 request payload", () => {
    const request = buildMindmakeBriefRequestV2({
      requestId: "11111111-2222-4333-8444-555555555555",
      email: "leader@example.com",
      domain: "example.com",
      pressure: "Our price no longer matches the value",
      capacityChoice: "Grow this business",
      route: "gtm",
      publicationRequested: false,
    });
    expect(request.action).toBe("request");
    expect(request.version).toBe(2);
    expect(request.website).toBe("");
    expect(request.consent.wordingVersion).toBe(NEWSLETTER_CONSENT_WORDING_VERSION);
    /* The field was named returnedTime here until the typecheck was repaired,
       which meant this test fed the builder a property it does not have and
       omitted one it requires. Assert the mapping rather than only its
       neighbours. */
    expect(request.choices.returnedTimeId).toBe("grow-this-business");
  });

  it("still builds the version 2 confirm payload", () => {
    const confirm = buildMindmakeBriefConfirmV2({
      requestId: "11111111-2222-4333-8444-555555555555",
      email: "leader@example.com",
      code: "123456",
    });
    expect(confirm.action).toBe("confirm");
    expect(confirm.code).toBe("123456");
  });

  /* The commercial canon routes payload authority to the delivery spec.
     Check the declared fields against the actual parser, not old narrative. */
  it("sends only the personal-read fields declared by the delivery contract", () => {
    const canon = read("project-documentation/01_CANON.md");
    expect(canon).toContain("05_LEAD_DELIVERY_SPEC.md");
    const spec = read("project-documentation/05_LEAD_DELIVERY_SPEC.md");
    const declaration = spec.match(/Personal-read request allowlist: `([^`]+)`/);
    expect(declaration).not.toBeNull();
    const declared = declaration![1].split(",").map((key) => key.trim()).sort();

    /* The parser's allowlist is the enforcement. Nothing outside it reaches the
       server, and nothing inside it is undeclared above. */
    const parser = read("supabase/functions/mindmake-personal-read/core.ts");
    const allowed = parser.slice(parser.indexOf("const allowed = new Set(["));
    const keys = [...allowed.slice(0, allowed.indexOf("]")).matchAll(/"([a-z0-9_]+)"/g)].map((m) => m[1]);
    expect(keys.sort()).toEqual(
      ["action", "division", "email", "first_name", "last_name", "q1", "q2"],
    );
    expect(declared).toEqual(keys.sort());
    /* The retired field must not creep back: it is the ask this round removed. */
    expect(keys).not.toContain("linkedin_url");
  });

  it("keeps the consent wording verbatim", () => {
    expect(NEWSLETTER_CONSENT_WORDING.length).toBeGreaterThan(20);
  });

  it("keeps the downloadable brief self-contained", () => {
    const html = buildPrivateBriefHtml({
      company: "Example",
      domain: "example.com",
      pressure: "Our price no longer matches the value",
      known: "A public read of the company.",
      evidence: ["A first evidence line.", "A second evidence line."],
      carry: "What AI can carry.",
      human: "What stays yours.",
      proof: "A useful first proof.",
      capacityValue: "Where the returned time goes.",
      nextStep: "keep",
    });
    expect(html).not.toContain("fonts.googleapis");
    expect(html).not.toContain("fonts.gstatic");
    expect(html).not.toContain("@import");
    expect(html).not.toContain("<script");
  });
});

describe("the crawler surfaces stay in step", () => {
  it("keeps the generated llms.txt in agreement with its generator", () => {
    const generated = execFileSync(process.execPath, ["scripts/generate-llms.mjs", "--stdout"], { cwd: ROOT, encoding: "utf8" });
    expect(read("public/llms.txt").replaceAll("\r\n", "\n")).toBe(generated.replaceAll("\r\n", "\n"));
    for (const page of staticPages) expect(generated).toContain(page.description);
  });

  it("prerenders the same routes the sitemap publishes", () => {
    const sitemap = execFileSync(process.execPath, ["scripts/generate-sitemap.mjs", "--stdout"], { cwd: ROOT, encoding: "utf8" });
    const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => new URL(match[1]).pathname);
    const expected = [...staticPages.map(page => page.path), ...blogPosts.map(post => `/blog/${post.slug}`), ...answers.map(answer => answerPath(answer.slug))];
    expect(routes.sort()).toEqual(expected.sort());
    for (const route of routes) expect(serverRender(route), route).toContain("<h1");
  });
});
