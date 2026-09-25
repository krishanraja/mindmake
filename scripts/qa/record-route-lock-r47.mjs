#!/usr/bin/env node
/* Writes quality/route-lock/approved-production-r47.json from r46 and the
   working tree: the /ai-gtm rebuild on the house system (r47).

   Every file r46 locks is re-hashed. A locked file whose bytes changed must be
   named in REASONS below with why, or this refuses to write the record; that
   is what keeps a declared revision from turning into a silent rehash. Files
   new to the lock are listed with their reason too. Run it again after any
   edit to a locked file; the record is only written from the tree as it is.

   Usage: node scripts/qa/record-route-lock-r47.mjs [--check] */
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";
import { sourceHashBytes } from "../lib/source-hash.mjs";

const root = resolve(import.meta.dirname, "../..");
const previousPath = "quality/route-lock/approved-production-r46.json";
const outputPath = "quality/route-lock/approved-production-r47.json";
const previous = JSON.parse(await readFile(resolve(root, previousPath), "utf8"));
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const hashOf = async (path, manifest) => sha256(sourceHashBytes(path, await readFile(resolve(root, path)), manifest));

const SCOPE = "Krish, 2026-09-25: \"https://mindmake.co/ai-gtm - this page has the most confusing user experience. As I scroll, I just have no idea where to look. There's no visual hierarchy of sections. There are no scroll builds. It doesn't set up a universal problem that someone will really feel empathically that we understand them. None of this talks to a user one-to-one, so it doesn't really set up the problem that we're solving. The fonts are all over the place. They're not part of a cohesive design system as per the rest of the repository, nor is the rest of the look and feel of this page, to be honest. The content is more or less there in terms of what we're supposed to be saying and offering, but everything else is not up to scratch in terms of: the copywriting, the UX, the aesthetics, the design system, the build of the page, the visual delight etc etc\"";

const RETIRED_GTM_STYLES = [
  ["src/styles/mindmake-locked-gtm.css", "GTM-PLAIN-R2's generated private stylesheet (its own palette, three mints, non-variable font names, labels down to 7.7px). Retired in r47 for src/styles/mindmake-ai-gtm.css on the house tokens."],
  ["src/styles/mindmake-gtm-plain.css", "GTM-PLAIN-R2's override layer on the stylesheet above. Retired with it in r47."],
];

/* Locked files this revision changes, and why. */
const REASONS = {
  "src/pages/AiGtm.tsx": "Rebuilt as one argument in the house system: problem-first opening, four felt moments with dated sources, the turn to the offer, the 30 days, the team, one result. The approved copy, levers, plan, team, decisions, proof and brief routing are kept; the chapters live in src/components/ai-gtm/.",
  "src/styles/mindmake.css": "The three GTM-only --mm-header-inline overrides for the retired 1,360px shell are removed, so the wordmark, menu and footer take the shell edge that /ai-gtm's content now uses.",
  "scripts/qa/approved-route-lock-check.mjs": "Selects r47.",
  "scripts/qa/approved-route-lock-self-test.mjs": "Selects r47 and names its temporary controls after it.",
  "src/test/brief2-public-contract.test.ts": "Coverage follows the markup that moved from AiGtm.tsx into src/components/ai-gtm/ and src/hooks/usePinnedSteps.ts. No assertion removed or weakened.",
  "scripts/qa/locked-material-production-check.mjs": "/ai-gtm leaves the locked-material routes: its cases had asserted the retired signal-and-response design since r25 and read the deleted stylesheet. The Brain checks are unchanged.",
  "scripts/qa/full-route-continuity-check.mjs": "The 200% reflow case for /ai-gtm measures the decision panel that replaced the test slip.",
};

/* Files new to the lock, and why. */
const NEW = {
  "src/components/ai-gtm/Opening.tsx": "The first screen: the change the reader feels, and the old playbook's four rules struck through beside it, with the control that pauses the page's films.",
  "src/components/ai-gtm/Workaround.tsx": "The easy way out and what it costs, on its own screen between the four places and the offer.",
  "src/components/ai-gtm/StepRail.tsx": "The rail along each pinned chapter; its segments fill with progress and move the page to a step.",
  "src/components/ai-gtm/LeverChapter.tsx": "Chapter one: four felt moments, each with its lever, the old way struck and the new way, and a dated source.",
  "src/components/ai-gtm/TurnBand.tsx": "The turn to the offer, with the two doors after the service is explained.",
  "src/components/ai-gtm/PlanChapter.tsx": "The 30 days as one month filling with scroll, with the work it produces visible.",
  "src/components/ai-gtm/TeamChapter.tsx": "Today's team becoming the AI-native one with scroll, and the decision each seat creates.",
  "src/components/ai-gtm/ProofBand.tsx": "One result: quote, outcome, attribution.",
  "src/components/ai-gtm/Unbroken.tsx": "Keeps hyphenated words whole on a line.",
  "src/hooks/usePinnedSteps.ts": "The pinned-step geometry /new-age-leadership proved, as a hook: step from position only, reverses and releases by itself, controls move the page.",
  "src/styles/mindmake-ai-gtm.css": "The route stylesheet on the house tokens: Newsreader, Archivo, Plex Mono, one mint, amber for change and evidence.",
  "src/test/ai-gtm-pinned-steps.test.tsx": "The pin contract: maths, forward and reverse, controls, reduced motion, unpinned fallback, no input capture.",
  "src/test/ai-gtm-page.test.tsx": "The page contract: problem before offer, every step server-rendered, the switch, the quote, the stylesheet's token and size rules.",
  "scripts/qa/record-route-lock-r47.mjs": "Writes this record from the tree and refuses an undeclared change to a locked file.",
};

const check = process.argv.includes("--check");
const failures = [];
const files = {};
const allowedExistingChanges = [];

for (const [path, before] of Object.entries(previous.files)) {
  if (RETIRED_GTM_STYLES.some(([retired]) => retired === path)) {
    if (existsSync(resolve(root, path))) failures.push(`${path} is retired in r47 but still exists`);
    continue;
  }
  const after = await hashOf(path, previous);
  files[path] = after;
  if (after !== before) {
    const reason = REASONS[path];
    if (!reason) failures.push(`${path} changed since r46 with no declared reason`);
    else allowedExistingChanges.push({ path, before, after, reason });
  }
}
for (const [path] of Object.entries(NEW)) {
  if (!existsSync(resolve(root, path))) { failures.push(`${path} is declared new but missing`); continue; }
  files[path] = await hashOf(path, previous);
}

const baselineCommit = execFileSync("git", ["rev-parse", "--short=7", "1462cb0"], { cwd: root, encoding: "utf8" }).trim();

const record = {
  artifact: "mindmake-approved-production-routes-r47",
  recordedAt: "2026-09-25",
  status: "record of the /ai-gtm rebuild on Krish's 2026-09-25 review. His review of the rebuilt page is tracked by AI-GTM-R47-OWNER-REVIEW-001 in the feedback ledger.",
  scopeRequested: SCOPE,
  sessionDecisions: [
    "/ai-gtm is told as one argument in the order a buyer lives it: the change they already feel, in four places; the easy way out and what it costs; the offer; the 30 days; what their team becomes; one result. Each chapter holds one idea on one screen.",
    "Opening, problem first: h1 'Your customers have changed how they buy.' with 'how they buy.' in the italic mint the approved chapters use, and 'You still build, price, position and hire by the old playbook.' Beside it the old playbook's four rules (the approved old-way lines) are struck through in amber one after another. No picker and no panel on the first screen, and no mono line above or below the h1.",
    "A control on the first screen pauses and plays the page's films (WCAG 2.2.2), as /new-age-leadership and /ai-brain can; useLockedMotion reads it.",
    "Chapter one, 'You can feel it in four places.', pins and steps through Product, Price, Positioning and People. Each felt moment says no more than its dated source in gtm-signals.json: Product and Zendesk (19 May 2026), Price and HubSpot (13 Apr 2026), Positioning and Shopify (24 Mar 2026), People and HubSpot (13 Apr 2026). The product signal (Uber) is no longer cited because it did not support the product line. The approved old way is struck in amber and the new way follows. It reads the same for both kinds of business, because the switch comes after it.",
    "A screen of its own between the four places and the offer names the easy way out and its cost: 'You could add an AI tool and keep everything else.' / 'The deals would go to whoever changed the rest.'",
    "The canon headline moves from the h1 to the turn, as the answer to the screens before it, set 'Make your pricing, positioning and team' then 'AI-native.' in italic mint, with the canon promise verbatim. This changes a locked canon placement (01_CANON.md) and is pending Krish's approval of the rendered page.",
    "The two doors (canon labels) move from the top of the page to the turn, under the visible question 'Where are you starting from?'; established is the default and choosing never moves the page. They drive the promise, the 30 days, the team and the result.",
    "The founder-specific lever lines move into week 1 of the 30 days, each approved old way struck beside its new line, shown when the reader chooses the AI-native door. No approved line is lost.",
    "The 30 days pin as the month itself: thirty days that light one by one with scroll, grouped into the three stretches, whose names are the rail. All three stretches stay on screen; the six things the month can build are visible in weeks 2 to 4 with the fee note beneath them. On a phone the month is a document with the thirty days drawn whole.",
    "The team is an illustrative org chart on an instrument panel that says it is an example on every screen: the lead above a bus the seats hang from, each seat's top rule carrying its kind (person, person with agents, agent-first, new role), a ring that shows it can be picked. Where it pins (desktops, laptops, a tablet held upright) it builds from today to AI-native with scroll, both ways, and picking a seat shows its approved decision beside the chart without moving the page; the panel is held at its tallest decision so a pick never moves the chart. On a phone, where no screen holds the chart and a decision, it is a document: each seat shows today's version struck through, the AI-native one and its decision.",
    "One result on paper: the quote in quotation marks, the outcome in amber, the attribution beneath in small mono (the r43 ruling), following the chosen door, with a link to that story.",
    "Drawn only in the house system: Newsreader headlines, Archivo body and actions, IBM Plex Mono labels at 12px or more, one mint (the answer, the selected state), amber for change and evidence, and the warm cream the approved chapter surfaces use. The route takes the shell edge /new-age-leadership and the homepage use (4.4vw, 1,600px), so the wordmark and content share one gutter. The rotated paper leaves, SVG traces, machinery still, numbered eyebrows, badges and the decision slip collage are gone.",
    "The two films the continuity contract gives this page stay: quiet-workshop-growth behind the opening and signals-arrive behind chapter one, on their existing 9 to 22KB WebP posters instead of 570 to 892KB PNGs. No other imagery.",
    "A stage pins only where its step fits: the stylesheet unpins short screens, phones held sideways and readers without scripting, and the hook releases any chapter whose content outgrows its stage (a reader's own text spacing or font size, a short laptop) before the reader reaches it, never while they are in it. Released chapters lay every step out. Reduced motion keeps every pin and drops the transitions. A rail press holds its step only until the page arrives.",
    "On the cream bands the focus ring takes the paper's own mint (--mm-mint-d), because the bright mint ring is under 3:1 on the cream.",
    "Numbered r47: the candidate was built as r44; main took r44 (the homepage archive engine hero r06, PR #201), r45 (its revert, PR #202) and r46 (benefit headlines and practice, PR #203) first. This record sits on r46; the candidate, its ledger items and its evidence were renamed r47 before main was merged in, and nothing main recorded is rewritten. The gate evidence in artifacts/ai-gtm/scroll-build was captured under the id ai-gtm-r45 on the same /ai-gtm source bytes.",
    "Correction to r43's retired list: pinnedChapters.ts, pinnedChapters.css and homepage-pin-lifecycle.test.ts were reinstated by r41 and remain locked in files, so r47 does not list them as retired.",
  ],
  routes: previous.routes,
  changePolicy: previous.changePolicy,
  contractSources: {
    brain: previous.contractSources.brain,
    gtm: [
      "src/pages/AiGtm.tsx",
      "src/components/ai-gtm/Opening.tsx",
      "src/components/ai-gtm/Workaround.tsx",
      "src/components/ai-gtm/StepRail.tsx",
      "src/components/ai-gtm/LeverChapter.tsx",
      "src/components/ai-gtm/TurnBand.tsx",
      "src/components/ai-gtm/PlanChapter.tsx",
      "src/components/ai-gtm/TeamChapter.tsx",
      "src/components/ai-gtm/ProofBand.tsx",
    ],
  },
  files,
  newlyLocked: Object.entries(NEW).map(([path, reason]) => ({ path, reason })),
  minimumContracts: {
    brain: previous.minimumContracts.brain,
    gtm: {
      citedSignals: ["service", "pricing", "commerce"],
      stages: [
        "Your customers have changed",
        "You can feel it in four places",
        "You could add an AI tool",
        "Make your pricing, positioning and team",
        "One go-to-market move in 30 days",
        "Your sales and marketing team gets agents",
        "Result",
      ],
      requiredInstruments: ["usePinnedSteps", "gtm-rail", "lever-steps", "mode-switch", "plan-days", "team-board", "decision-panel"],
    },
  },
  forbiddenPhrases: previous.forbiddenPhrases,
  verification: {
    status: "Pending: filled from the verification run on the final candidate.",
    performed: [],
  },
  supersedes: { path: previousPath, reason: "Krish's 2026-09-25 rejection of the live /ai-gtm. No earlier record is rewritten." },
  textLineEndings: previous.textLineEndings,
  browserPlatforms: previous.browserPlatforms,
  scope: { baselineCommit, allowedExistingChanges },
  additionalTextExtensions: previous.additionalTextExtensions,
  retired: [
    ...previous.retired.filter((entry) => !Object.hasOwn(files, entry.path)),
    ...RETIRED_GTM_STYLES.map(([path, reason]) => ({ path, lastHash: previous.files[path], reason })),
  ],
};

if (failures.length) {
  console.error(JSON.stringify({ artifact: record.artifact, failures }, null, 2));
  process.exit(1);
}
const text = `${JSON.stringify(record, null, 2)}\n`;
if (check) {
  const current = existsSync(resolve(root, outputPath)) ? await readFile(resolve(root, outputPath), "utf8") : "";
  const stripVerification = (value) => value ? JSON.stringify({ ...JSON.parse(value), verification: null }) : "";
  if (stripVerification(current) !== stripVerification(text)) {
    console.error(`${outputPath} is stale: run node scripts/qa/record-route-lock-r47.mjs`);
    process.exit(1);
  }
  console.log(`${outputPath} matches the tree`);
} else {
  const existing = existsSync(resolve(root, outputPath)) ? JSON.parse(await readFile(resolve(root, outputPath), "utf8")) : null;
  if (existing?.verification?.performed?.length) record.verification = existing.verification;
  await writeFile(resolve(root, outputPath), `${JSON.stringify(record, null, 2)}\n`);
  console.log(JSON.stringify({ written: outputPath, lockedFiles: Object.keys(files).length, changed: allowedExistingChanges.map((entry) => entry.path), newlyLocked: Object.keys(NEW).length }, null, 2));
}
