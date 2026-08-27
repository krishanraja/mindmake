import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = resolve(__dirname, "../..");
const read = (file: string) => readFileSync(resolve(ROOT, file), "utf8");

/* The stepped journeys on /ai-brain and /ai-gtm implement the proposition
   lock of 27 August 2026. These assertions pin the locked promises, the
   corrected GTM levers, the full-bleed numeral form and the honest shape
   of the compounding timeline. */
describe("Mindmake step journey contract", () => {
  it("renders the locked value propositions verbatim", () => {
    expect(read("src/pages/AiBrain.tsx"))
      .toContain("Encode your taste and judgement, amplify your strengths, uncover your blind spots.");
    expect(read("src/pages/AiGtm.tsx"))
      .toContain("Create an AI-native GTM model across product, price, positioning or people.");
  });

  it("defines an AI brain in plain words high on the page", () => {
    expect(read("src/pages/AiBrain.tsx"))
      .toMatch(/An AI brain is a working system that holds your/);
  });

  it("uses the corrected GTM levers everywhere outside the frozen gateway", () => {
    expect(read("src/pages/AiGtm.tsx")).toContain("product, price, positioning or people");
    const leverCards = read("src/components/mindmake/GtmStepVisuals.tsx");
    ["<b>Product</b>", "<b>Price</b>", "<b>Positioning</b>", "<b>People</b>"].forEach((lever) => expect(leverCards).toContain(lever));

    const leverSurfaces = [
      "src/pages/AiBrain.tsx",
      "src/pages/AiGtm.tsx",
      "src/components/mindmake/GtmStepVisuals.tsx",
      "src/components/mindmake/BrainStepVisuals.tsx",
      "scripts/prerender.mjs",
      "scripts/generate-llms.mjs",
      "public/llms.txt",
    ];
    const retired = /message (?:and|or) team|price, message/i;
    expect(leverSurfaces.filter((file) => retired.test(read(file)))).toEqual([]);
  });

  it("builds both pages from numbered step scenes instead of the old rails", () => {
    const brain = read("src/pages/AiBrain.tsx");
    const gtm = read("src/pages/AiGtm.tsx");

    [brain, gtm].forEach((page) => {
      expect(page).toContain("<StepJourney>");
      expect(page).toContain("<StepScene");
      expect(page).toContain("<CompoundingTimeline");
      expect(page).not.toContain("RouteRail");
    });

    ["Capture", "Encode", "Amplify", "Uncover", "Keep"].forEach((step) => expect(brain).toContain(`name="${step}"`));
    ["Read", "Choose the lever", "Build the model", "Prove with buyers", "Run it"].forEach((step) => expect(gtm).toContain(`name="${step}"`));
  });

  it("keeps the step numeral full-bleed and owned by the scene component", () => {
    const scene = read("src/components/mindmake/StepScene.tsx");
    expect(scene).toContain('className="mm-step-numeral"');
    expect(scene).toContain('aria-hidden="true"');

    const styles = read("src/styles/mindmake-journey.css");
    const numeralSizes = [...styles.matchAll(/\.mm-step-numeral span[^{]*\{[^}]*font-size:([^;]+);/g)]
      .map(([, size]) => size);
    expect(numeralSizes.length).toBeGreaterThan(0);
    numeralSizes.forEach((size) => expect(size).toMatch(/sv[hw]|\d+vw/));
  });

  it("keeps the compounding timeline honest and thumb-friendly", () => {
    const timeline = read("src/components/mindmake/CompoundingTimeline.tsx");
    expect(timeline).toContain('data-timeline-day="30"');
    expect(timeline).toContain("DAYS = [30, 60, 90]");
    expect(timeline).toContain("setPointerCapture");
    expect(timeline).toContain('role="radiogroup"');
    expect(read("src/styles/mindmake-journey.css")).toContain("touch-action: pan-y");

    const sold = /\bpackages?\b|\btiers?\b|\bguarantees?\b|\bupgrade\b|\bbundle\b/i;
    ["src/pages/AiBrain.tsx", "src/pages/AiGtm.tsx", "src/components/mindmake/CompoundingTimeline.tsx"]
      .forEach((file) => expect(read(file).match(sold)).toBeNull());

    ["src/pages/AiBrain.tsx", "src/pages/AiGtm.tsx"].forEach((file) => {
      const page = read(file);
      expect(page).toContain('standing: "The proof"');
      expect(page).toContain('standing: "Earned"');
      expect(page).toContain("it has to earn that");
    });
  });

  it("keeps reduced motion as a complete, static experience", () => {
    expect(read("src/components/mindmake/StepJourney.tsx")).toContain("prefers-reduced-motion: reduce");
    expect(read("src/components/mindmake/CompoundingTimeline.tsx")).toContain("prefers-reduced-motion: reduce");
    expect(read("src/styles/mindmake-journey.css")).toContain("@media (prefers-reduced-motion: reduce)");
  });

  it("keeps hand-drawn marks sparing, reversible and off the footage", () => {
    const mark = read("src/components/mindmake/ScrollMark.tsx");
    expect(mark).toContain("prefers-reduced-motion: reduce");
    expect(mark).toContain('"circle" | "underline" | "bracket"');
    expect(read("src/styles/mindmake-journey.css"))
      .toContain(".mm-mark.is-step { --mm-mark-progress: var(--mm-step-p3, 1); }");

    ["src/pages/AiBrain.tsx", "src/pages/AiGtm.tsx"].forEach((file) => {
      const marks = read(file).match(/<ScrollMark/g) ?? [];
      expect(marks.length).toBeGreaterThan(0);
      expect(marks.length).toBeLessThanOrEqual(3);
    });
    ["src/components/mindmake/BrainStepVisuals.tsx", "src/components/mindmake/GtmStepVisuals.tsx"]
      .forEach((file) => expect(read(file)).not.toContain("ScrollMark"));
  });

  it("teaches the working-understanding comparison on both door pages", () => {
    ["src/pages/AiBrain.tsx", "src/pages/AiGtm.tsx"].forEach((file) => {
      const page = read(file);
      expect(page).toContain("<WorkingUnderstandingCompare");
      expect(page).toContain("Where does the understanding live when the work ends?");
      expect(page).not.toMatch(/\bSaaS\b/);
    });
    const compare = read("src/components/mindmake/WorkingUnderstandingCompare.tsx");
    expect(compare).toContain("You can hand over the work.");
    expect(compare).toContain("Not the understanding.");
    expect(compare).not.toMatch(/\bSaaS\b/);

    const styles = read("src/styles/mindmake-journey.css");
    const compareBlock = styles.slice(styles.indexOf(".mm-compare"));
    expect(compareBlock).not.toMatch(/overflow-x:\s*(auto|scroll)/);
    expect(styles).toMatch(/@media \(max-width: 560px\)[\s\S]*?\.mm-compare-grid \{ grid-template-columns: minmax\(0, 1fr\)/);
  });

  it("keeps the leaders claim uncounted until the evidence trail is approved", () => {
    ["src/pages/Index.tsx", "scripts/generate-llms.mjs", "public/llms.txt"].forEach((file) => {
      expect(read(file)).not.toMatch(/\b\d[\d,]*\+?\s+leaders/i);
    });
  });

  it("stages the brief journey with a functional path and the branded proposal", () => {
    const brief = read("src/components/mindmake/LeadBrief.tsx");
    expect(brief).toContain('className="mm-brief-path"');
    expect(brief).toContain('aria-label="Your progress"');
    expect(brief).toContain("STEP_TONES[step]");
    expect(brief).toContain("<MindmakeProposal");

    const proposal = read("src/components/mindmake/proposalContent.ts");
    expect(proposal).toContain("It is not advice.");
    expect(proposal).toContain("What I cannot know from the outside");
    expect(read("src/components/mindmake/MindmakeProposal.tsx")).toContain('aria-label="Your private brief"');
  });

  it("keeps footage user-controlled through the shared media frame", () => {
    const film = read("src/components/mindmake/StepFilm.tsx");
    expect(film).toContain("MediaFrame");
    expect(film).toContain("IntersectionObserver");
    expect(film).toContain("video.pause()");
  });
});
