import { useEffect, useRef } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useLockedMotion } from "@/components/mindmake/locked/useLockedMotion";
import { extractLockedBlock, extractLockedMain, replaceLockedAsset } from "@/components/mindmake/locked/lockedMarkup";
import { useLeadBriefHistory } from "@/hooks/useLeadBriefHistory";
import fixture from "@/data/vnext/brain-fixture.json";
import evidenceFilm from "@/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4";
import lockedDocument from "../../prototypes/website-redesign-recovery/brain-signature/index-s4-narrative-r1.html?raw";
/* The poster as a 1280-wide webp, 33 KB, where the PNG was 901 KB and took
   ten seconds on a phone (Krish, 2026-11-04). */
import evidencePoster from "@/assets/responsive/evidence-connects-poster-w1280.webp";
import { PairingBridge } from "@/components/mindmake/PairingBridge";
import { CompareNudge } from "@/components/mindmake/CompareNudge";
import { chiefOfStaffMarkup } from "@/components/mindmake/chiefOfStaff";
import { Icon } from "@/components/mindmake/Icon";
import monthPlate from "@/assets/stories/punched-cards-r01-800.webp";
import type { IconName } from "@/lib/icons";
import { readingProgress, sequenceProgress, stepStates } from "@/components/mindmake/locked/scrollSequence";
import { mountLiquidBrain } from "@/components/mindmake/locked/liquidBrain";
import { CLUSTERS, clusterSeats, restsOn } from "@/components/mindmake/locked/connectedBrain";
import { leadershipStories } from "@/components/leadership-chapters/leadershipChapters";
import { mountStoryFinder, storyFinderMarkup } from "@/components/leadership-chapters/storyFinder";
import { track } from "@/lib/analytics";
import { buildOnScroll } from "@/lib/scrollBuild";
import { settleSections } from "@/lib/sectionSettle";
import { START_LABEL } from "@/lib/publicLinks";
import "@/styles/mindmake.css";
import "@/styles/mindmake-locked-brain.css";
import "@/styles/mindmake-brain-refinements.css";
import "@/styles/mindmake-brain-narrative.css";
import "@/styles/mindmake-brain-s6.css";
import "@/styles/mindmake-calm-s8.css";
import "@/styles/mindmake-alive-brain.css";
import "@/styles/mindmake-deck.css";
import "@/styles/mindmake-connected-brain.css";
import "@/styles/mindmake-brain-cos.css";

const selectedId = "BI-003";
const plainStatements: Record<string, string> = {
  "BI-001": "Build systems that help more people make better decisions.",
  "BI-002": "Spot newly possible work before old habits make it obvious.",
  "BI-003": "People stay accountable for work that reaches the outside world.",
  "BI-004": "Repeated clicks, copying and explanation reveal where the system needs work.",
  "BI-005": "Seeing what is possible early can make old ways of working feel painfully slow.",
  "BI-006": "Work with leaders who want to reshape their category.",
  "BI-007": "Let AI carry repeatable information work. Keep standards, relationships, strategy and final craft human.",
  "BI-008": "Missing numbers and lookalike thinking are warning signs.",
  "BI-009": "The system should preserve a person's voice, standards and exceptions.",
  "BI-010": "Turn good judgement into standards that other people can use without becoming copies.",
  "BI-011": "Put the time saved back into customers and the people affected by the work.",
  "BI-012": "Build with leaders who are already ready to move.",
  "BI-013": "Redesign the work before drawing conclusions about the people doing it.",
  "BI-014": "Future teams may need builders with agency, taste and strong systems around them.",
  "BI-015": "Bring genuinely different options into the room so people can spend their time judging.",
  "BI-016": "See where culture is saturated, what is missing and what might emerge next.",
  "BI-017": "Changing a mind is not enough when the surrounding system still rewards the old behaviour.",
  "BI-018": "A second AI can check the work. It cannot make the final call.",
  "BI-019": "The leader owns the Brain. The company gains from the decisions it improves.",
  "BI-020": "Help capable people become more discerning, more decisive and less generic.",
};

const evidenceMessages = {
  ready: "",
  loading: "Checking the record. The last known version remains readable.",
  stale: "The source check is older than expected. The last known version remains readable.",
  error: "The source check is unavailable. The last known version remains readable.",
  recovery: "Connection restored. The record is current.",
} as const;

type BrainItem = (typeof fixture.items)[number];

// The page is three sections (S6, Ruling, Krish, 2026-10-24): the opening and
// one story in three beats (you, sharper, business), what a Brain holds beside
// the living record, then the month. Each heading must appear exactly once, so
// a copy edit can never silently drop or double a part the scroll build and
// the checks depend on.
const chapterTitles = ["opening-title", "you-title", "sharper-title", "business-title", "memory-title", "built-title"];
/** The finder's stories, moved here from the homepage (Ruling, Krish, 2026-10-24: "it is the most practical. outlook, output for what an AI brain makes possible, but, having said that, I think this might belong on the AI brain page"). The page already says what it is about, so the finder carries no label of its own. */
const finderMarkup = storyFinderMarkup(leadershipStories, { kicker: false, door: "brain" });
/** What stays with you, as the receipt: the approved brain steps (01_CANON.md). */
const KEEPS = ["Your brain, built out.", "The systems that amplify you, proven.", "The confidence of being an AI era leader."] as const;
/* Ruling (owner, 2026-11-04, mock approved): what stays with you is three
   marks in a row, not a receipt box. */
const KEEP_ICON: readonly IconName[] = ["graph", "proven", "rise"];
/** Where the month's steps light: this far down the screen. */
const READING_LINE = 0.72;

function prepareMarkup() {
  let markup = `${extractLockedMain(lockedDocument)}${extractLockedBlock(lockedDocument, "truth-bar")}`;
  chapterTitles.forEach((id) => {
    if (markup.split(`id="${id}"`).length - 1 !== 1) {
      throw new Error(`The Brain page must carry exactly one ${id}.`);
    }
  });
  markup = replaceLockedAsset(markup, "../../../src/assets/films/sep2026/evidence-connects-loop-r01-20s-720p-web-sealed.mp4", evidenceFilm);
  markup = replaceLockedAsset(markup, "./media/evidence-connects-poster.png", evidencePoster);
  markup = replaceLockedAsset(markup, "../../../src/assets/stories/punched-cards-r01-800.webp", monthPlate);
  const chief = "<!--chief-of-staff-->";
  if (markup.split(chief).length - 1 !== 1) throw new Error("The Brain page must carry exactly one how-you-think panel.");
  markup = markup.replace(chief, chiefOfStaffMarkup());
  const field = '<div class="field-focus" aria-hidden="true"></div>';
  if (markup.split(field).length - 1 !== 1) throw new Error("The Brain page must carry exactly one field focus.");
  return markup.replace(field, `${field}${noScriptBrain()}`);
}

/* Without scripting the Brain has no ideas to draw, so its twenty ideas are
   listed by cluster instead, from the same fixture the picture uses. */
function noScriptBrain() {
  const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const groups = CLUSTERS.map((cluster) => {
    const titles = fixture.items.filter((item) => item.cluster === cluster.id).map((item) => escape(item.title));
    return titles.length ? `<li><b>${escape(cluster.name)}</b> ${titles.join(", ")}</li>` : "";
  }).join("");
  return `<noscript><ul class="brain-nojs">${groups}</ul></noscript>`;
}

const lockedMarkup = prepareMarkup();

// Settled thinking and thinking still being worked out look different in the
// graph, so the nodes read as doing different jobs before anyone clicks.
const isSettled = (item: BrainItem) => item.standing === "accepted" || item.standing === "owned_call" || item.standing === "accepted_learning";

// The inspector's label names the picked idea's standing, in the colour the
// graph already gives it: the leader's own settled calls, or the Brain's
// reading, which stays a reading until the leader agrees it.
const standingLabel = (item: BrainItem) => (isSettled(item) ? "Agreed" : "The Brain's reading");

// Whether two ideas share a connection, in either direction.
const linked = (a: string, b?: string) => fixture.relationships.some((relationship) => (relationship.from === a && relationship.to === b) || (relationship.to === a && relationship.from === b));

// Text that changes on interaction sits in a frame sized to its longest
// variant, so the panel never grows or shrinks as a visitor clicks around.
function reserveLongest(target: HTMLElement | null, variants: string[]) {
  const frame = target?.parentElement;
  if (!target || !frame || frame.querySelector(`[data-sizer-for="${target.id}"]`)) return;
  const wrapper = document.createElement("div");
  wrapper.className = "mm-stable-frame";
  target.replaceWith(wrapper);
  wrapper.append(target);
  variants.forEach((variant) => {
    const ghost = target.cloneNode(false) as HTMLElement;
    ghost.removeAttribute("id");
    ghost.dataset.sizerFor = target.id;
    ghost.setAttribute("aria-hidden", "true");
    ghost.className = `${target.className} mm-stable-ghost`.trim();
    ghost.textContent = variant;
    wrapper.append(ghost);
  });
}

function useLockedBrain(rootRef: React.RefObject<HTMLDivElement>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if ([fixture.items.length, fixture.relationships.length, fixture.sources.length, fixture.corrections.length].join(",") !== "20,18,10,3") {
      throw new Error("The locked Brain fixture counts changed.");
    }

    const q = <T extends Element>(selector: string) => root.querySelector<T>(selector);
    const cleanups: Array<() => void> = [];
    const params = new URLSearchParams(window.location.search);
    const requestedState = params.get("state") ?? "ready";
    const renderFinal = params.get("render") === "final";
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const itemById = new Map(fixture.items.map((item) => [item.id, item]));
    const field = q<HTMLElement>("#meaningFieldS2");
    const svg = q<SVGSVGElement>("#relationshipFieldS2");

    const setEvidenceState = (state: string) => {
      const safeState = state in evidenceMessages ? state as keyof typeof evidenceMessages : "ready";
      root.dataset.evidenceState = safeState;
      const output = q<HTMLElement>("#evidenceStateS2");
      if (output) output.textContent = evidenceMessages[safeState];
    };

    /* What the chosen idea rests on (the connected Brain, round 2, 2026-11-10):
       its connections, each one a way to the idea it touches, one source and
       the change made to it, in the simplest words. */
    const renderRests = (host: HTMLElement, id: string) => {
      const rests = restsOn(fixture, id);
      host.replaceChildren();
      const group = (label: string) => {
        const block = document.createElement("div");
        block.className = "rests-group";
        const name = document.createElement("p");
        name.className = "rests-label";
        name.textContent = label;
        block.append(name);
        host.append(block);
        return block;
      };
      if (rests.connections.length) {
        const list = document.createElement("div");
        list.className = "rests-chips";
        rests.connections.forEach((connection) => {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = "rests-chip";
          chip.dataset.go = connection.otherId;
          const verb = document.createElement("span");
          verb.className = "rests-verb";
          verb.textContent = connection.verb;
          chip.append(verb, document.createTextNode(` ${connection.title}`));
          list.append(chip);
        });
        group(rests.connections.length === 1 ? "Connected to one idea" : `Connected to ${rests.connections.length} ideas`).append(list);
      }
      const source = rests.sources[0];
      if (source) {
        const line = document.createElement("p");
        line.className = "rests-source";
        const label = document.createElement("span");
        label.textContent = source.label;
        line.append(label, document.createTextNode(` ${source.line}`));
        group(rests.sources.length === 1 ? "From one source" : `From ${rests.sources.length} sources`).append(line);
      }
      if (rests.changes.length) {
        const line = document.createElement("p");
        line.className = "rests-change";
        line.textContent = rests.changes[0];
        group("You changed it").append(line);
      }
    };

    const selectMeaning = (item: BrainItem) => {
      field?.querySelectorAll<HTMLElement>(".meaning-node-s2").forEach((node) => {
        const active = node.dataset.id === item.id;
        node.classList.toggle("is-active", active);
        node.setAttribute("aria-pressed", active ? "true" : "false");
      });
      const kind = q<HTMLElement>("#inspectorKindS2");
      const title = q<HTMLElement>("#inspectorTitleS2");
      const statement = q<HTMLElement>("#inspectorStatementS2");
      if (kind) {
        kind.textContent = standingLabel(item);
        kind.dataset.standing = isSettled(item) ? "settled" : "working";
      }
      // The picked idea's own connections light, so the reasons that tie it
      // to the rest of the Brain are the ones on show.
      svg?.querySelectorAll<SVGLineElement>("line").forEach((line) => {
        line.classList.toggle("is-focus", line.dataset.from === item.id || line.dataset.to === item.id);
      });
      field?.querySelectorAll<HTMLElement>(".meaning-node-s2").forEach((node) => {
        node.classList.toggle("is-linked", linked(item.id, node.dataset.id));
      });
      if (title) title.textContent = item.title;
      if (statement) statement.textContent = plainStatements[item.id] ?? item.statement;
      const cluster = q<HTMLElement>("#inspectorTypeS2");
      if (cluster) cluster.textContent = restsOn(fixture, item.id).cluster;
    };

    let liquid: ReturnType<typeof mountLiquidBrain> | null = null;
    let openDetail: (id: string) => void = () => undefined;
    let closeDetail: (returnFocus?: boolean) => void = () => undefined;
    const pickMeaning = (item: BrainItem) => {
      root.dataset.meaningTouched = "true";
      inspector?.setAttribute("aria-live", "polite");
      selectMeaning(item);
      liquid?.select(item.id, true);
      openDetail(item.id);
    };

    // Every idea title stays on one line at one size. The size is set once
    // from the longest title that fits the panel, never per selection.
    const inspector = q<HTMLElement>("#meaningInspectorS2");
    const inspectorTitle = q<HTMLElement>("#inspectorTitleS2");
    reserveLongest(q<HTMLElement>("#inspectorStatementS2"), fixture.items.map((item) => plainStatements[item.id] ?? item.statement));
    const fitTitles = () => {
      if (!inspector || !inspectorTitle) return;
      inspector.style.removeProperty("--inspector-title-size");
      const probe = inspectorTitle.cloneNode(false) as HTMLElement;
      probe.removeAttribute("id");
      probe.setAttribute("aria-hidden", "true");
      probe.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;width:auto;max-width:none;max-inline-size:none;margin:0";
      inspectorTitle.parentElement?.append(probe);
      const available = inspectorTitle.getBoundingClientRect().width;
      const baseSize = parseFloat(getComputedStyle(inspectorTitle).fontSize);
      const widest = Math.max(...fixture.items.map((item) => { probe.textContent = item.title; return probe.getBoundingClientRect().width; }));
      probe.remove();
      if (available > 0 && widest > available) inspector.style.setProperty("--inspector-title-size", `${Math.floor(baseSize * (available / widest) * 10) / 10}px`);
    };
    fitTitles();
    void document.fonts?.ready.then(fitTitles);
    window.addEventListener("resize", fitTitles);
    cleanups.push(() => window.removeEventListener("resize", fitTitles));

    const nodeById = new Map<string, HTMLElement>();
    if (field && svg) {
      fixture.items.forEach((item) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "meaning-node-s2";
        button.dataset.id = item.id;
        button.dataset.standing = isSettled(item) ? "settled" : "working";
        button.style.setProperty("--cue-delay", `${(fixture.items.indexOf(item) * 7) % 20 * 0.45}s`);
        button.style.setProperty("--x", `${item.x}%`);
        button.style.setProperty("--y", `${item.y}%`);
        button.setAttribute("aria-label", `${item.title}. ${plainStatements[item.id] ?? item.statement}`);
        button.setAttribute("aria-pressed", item.id === selectedId ? "true" : "false");
        if (item.id === selectedId) button.classList.add("is-active");
        if (linked(selectedId, item.id)) button.classList.add("is-linked");
        const label = document.createElement("span");
        label.textContent = item.title;
        button.append(label);
        const click = () => pickMeaning(item);
        button.addEventListener("click", click);
        cleanups.push(() => button.removeEventListener("click", click));
        field.append(button);
        nodeById.set(item.id, button);
      });

      /* The ideas sit on a living mass (owner, 2026-11-10). It stays on the
         idea it opens with until the reader picks another: turning by itself
         replaced the reading before anyone could read it. */
      /* The seven clusters, named on the picture. */
      CLUSTERS.forEach((cluster) => {
        const label = document.createElement("span");
        label.className = "brain-region";
        label.setAttribute("aria-hidden", "true");
        label.textContent = cluster.name;
        field.append(label);
        nodeById.set(`label:${cluster.id}`, label);
      });
      liquid = mountLiquidBrain(field, {
        ideas: fixture.items.map((item) => ({ id: item.id, x: item.x, y: item.y, settled: isSettled(item) })),
        relationships: fixture.relationships,
        nodes: nodeById,
        seats: (minGap) => clusterSeats(fixture, minGap),
        initial: selectedId,
        tour: !(reducedMotion.matches || renderFinal),
        tourMs: 7000,
        onAdvance: (id) => {
          const item = itemById.get(id);
          if (!item) return;
          inspector?.setAttribute("aria-live", "off");
          closeDetail();
          selectMeaning(item);
        },
        reduced: reducedMotion.matches || renderFinal,
      });
      cleanups.push(() => liquid?.destroy());

      /* The tour just keeps going, with no button (owner, 2026-11-11: "it
         just keeps going ... until I press something and then press out of
         it. It still keeps going, which is a good thing"). Picking an idea
         holds it while that idea's card is open; closing the card lets it
         carry on from there, after a full stay on the idea shown. Reduced
         motion has no tour. */
      const touring = !(reducedMotion.matches || renderFinal);

      /* What an idea rests on floats over the Brain when the reader picks it
         (Krish, 2026-11-10: "an overlay that fluidly bobbles about upon
         click", so the section stays one screen long). It grows out of the
         chosen idea, sits beside it inside the picture, follows the reader
         along a connection, and closes on its button, Escape or a tap on the
         Brain's open ground. */
      const detail = document.createElement("div");
      detail.className = "brain-detail";
      detail.setAttribute("role", "group");
      detail.setAttribute("aria-label", "What this idea rests on");
      detail.hidden = true;
      const closeButton = document.createElement("button");
      closeButton.type = "button";
      closeButton.className = "brain-detail-close";
      closeButton.setAttribute("aria-label", "Close");
      closeButton.textContent = "×";
      const detailBody = document.createElement("div");
      detailBody.className = "brain-detail-body";
      detail.append(closeButton, detailBody);
      field.append(detail);
      let detailFor = "";
      const place = (id: string) => {
        const node = nodeById.get(id);
        if (!node) return;
        const width = field.clientWidth, height = field.clientHeight;
        const x = (parseFloat(node.style.getPropertyValue("--x")) / 100) * width;
        const y = (parseFloat(node.style.getPropertyValue("--y")) / 100) * height;
        const w = detail.offsetWidth, h = detail.offsetHeight;
        const left = Math.max(8, Math.min(width - w - 8, x - w / 2));
        const below = y + 22, above = y - 22 - h;
        let top = below + h <= height - 6 ? below : above >= 6 ? above : Math.max(6, Math.min(height - h - 6, y - h / 2));
        /* On a small phone the card can be taller than the Brain: it then
           rides up over the words above rather than leaving the screen. */
        const fieldTop = field.getBoundingClientRect().top;
        const masthead = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--mm-header-height")) || 64;
        if (fieldTop + top + h > window.innerHeight - 8) top = window.innerHeight - 8 - h - fieldTop;
        if (fieldTop + top < masthead + 8) top = masthead + 8 - fieldTop;
        detail.style.left = `${left.toFixed(0)}px`;
        detail.style.top = `${top.toFixed(0)}px`;
        detail.style.transformOrigin = `${(x - left).toFixed(0)}px ${(y - top).toFixed(0)}px`;
      };
      openDetail = (id: string) => {
        detailFor = id;
        renderRests(detailBody, id);
        const name = document.createElement("p");
        name.className = "brain-detail-name";
        name.textContent = itemById.get(id)?.title ?? "";
        detailBody.prepend(name);
        detail.hidden = false;
        detail.classList.remove("is-leaving", "is-open");
        place(id);
        void detail.offsetWidth;
        detail.classList.add("is-open");
      };
      let closing = 0;
      closeDetail = (returnFocus = false) => {
        if (detail.hidden) return;
        detail.classList.remove("is-open");
        detail.classList.add("is-leaving");
        window.clearTimeout(closing);
        closing = window.setTimeout(() => { if (detail.classList.contains("is-leaving")) detail.hidden = true; }, reducedMotion.matches ? 0 : 260);
        if (returnFocus) nodeById.get(detailFor)?.focus();
        if (touring) liquid?.setTour(true);
      };
      const onDetailClick = (event: MouseEvent) => {
        event.stopPropagation();
        if ((event.target as HTMLElement).closest(".brain-detail-close")) { closeDetail(true); return; }
        const chip = (event.target as HTMLElement).closest<HTMLElement>("[data-go]");
        const item = chip ? itemById.get(chip.dataset.go ?? "") : undefined;
        if (item) pickMeaning(item);
      };
      detail.addEventListener("click", onDetailClick);
      cleanups.push(() => detail.removeEventListener("click", onDetailClick));
      const onGround = (event: MouseEvent) => {
        if (!(event.target as HTMLElement).closest(".meaning-node-s2, .brain-detail")) closeDetail();
      };
      field.addEventListener("click", onGround);
      cleanups.push(() => field.removeEventListener("click", onGround));
      const onKey = (event: KeyboardEvent) => { if (event.key === "Escape" && !detail.hidden) closeDetail(true); };
      document.addEventListener("keydown", onKey);
      cleanups.push(() => document.removeEventListener("keydown", onKey));
      const onResize = () => { if (!detail.hidden && detailFor) place(detailFor); };
      window.addEventListener("resize", onResize);
      cleanups.push(() => window.removeEventListener("resize", onResize));
      cleanups.push(() => { window.clearTimeout(closing); detail.remove(); });

      // The compact graph deliberately keeps every idea at a 44px keyboard
      // target. On the narrowest phone those target circles can overlap even
      // though their visible dots do not. Resolve pointer clicks to the
      // nearest visible node centre, so a tap on an idea can never be captured
      // by a neighbouring invisible hit area. Keyboard activation continues
      // through each button's own click handler.
      const selectNearestMeaning = (event: MouseEvent) => {
        if (event.detail === 0) return;
        const target = event.target instanceof Element
          ? event.target.closest<HTMLElement>(".meaning-node-s2")
          : null;
        if (!target) return;

        const nearest = [...field.querySelectorAll<HTMLElement>(".meaning-node-s2")]
          .map((node) => {
            const rect = node.getBoundingClientRect();
            return {
              node,
              distance: Math.hypot(
                event.clientX - (rect.left + rect.width / 2),
                event.clientY - (rect.top + rect.height / 2),
              ),
            };
          })
          .sort((a, b) => a.distance - b.distance)[0]?.node;

        const item = nearest ? itemById.get(nearest.dataset.id ?? "") : undefined;
        if (!item) return;
        event.preventDefault();
        event.stopPropagation();
        pickMeaning(item);
      };
      field.addEventListener("click", selectNearestMeaning, true);
      cleanups.push(() => field.removeEventListener("click", selectNearestMeaning, true));
    }


    const chapters = [...root.querySelectorAll<HTMLElement>(".chapter[data-phase]")];
    const links = [...root.querySelectorAll<HTMLElement>("[data-phase-link]")];
    const sequences = [...root.querySelectorAll<HTMLElement>("[data-steps]")];
    let buildFrame = 0;
    const updateBuild = () => {
      buildFrame = 0;
      const viewportHeight = window.innerHeight;
      let active = chapters[0];
      let nearest = Number.POSITIVE_INFINITY;
      chapters.forEach((chapter) => {
        const rect = chapter.getBoundingClientRect();
        const progress = renderFinal ? 1 : Math.max(0, Math.min(1, (viewportHeight * 0.82 - rect.top) / Math.max(viewportHeight * 0.72, rect.height * 0.62)));
        chapter.style.setProperty("--section-p", progress.toFixed(3));
        chapter.querySelectorAll<HTMLElement>(".instrument").forEach((instrument) => instrument.style.setProperty("--p", progress.toFixed(3)));
        chapter.dataset.build = progress < 0.08 ? "idle" : progress < 0.75 ? "building" : "built";
        const distance = Math.abs(rect.top + rect.height * 0.4 - viewportHeight * 0.5);
        if (distance < nearest) { nearest = distance; active = chapter; }
      });
      // The stepped instruments (the questions, the decision and the levers)
      // light one step at a time as each rises into view, and unlight on the
      // way back. The month (data-steps="reading") lights each step as its
      // own top reaches the reading line instead. Only colour and opacity
      // change, never size or position.
      sequences.forEach((sequence) => {
        const steps = [...sequence.querySelectorAll<HTMLElement>("[data-step]")];
        const rect = sequence.getBoundingClientRect();
        const progress = renderFinal ? 1 : sequence.dataset.steps === "reading"
          ? readingProgress(steps.map((step) => step.getBoundingClientRect().top), viewportHeight * READING_LINE)
          : sequenceProgress(rect.top, rect.height, viewportHeight);
        sequence.style.setProperty("--seq-p", progress.toFixed(3));
        stepStates(progress, steps.length).forEach((state, index) => { steps[index].dataset.stepState = state; });
      });
      links.forEach((link) => {
        if (link.dataset.phaseLink === active?.dataset.phase) link.setAttribute("aria-current", "step");
        else link.removeAttribute("aria-current");
      });
    };
    const requestBuild = () => { if (!buildFrame) buildFrame = window.requestAnimationFrame(updateBuild); };
    // An instrument's rise and a chapter re-centring over the bar's reserve
    // are transitions that finish after the last scroll event, so the build
    // is read again once they settle.
    const settleBuild = (event: TransitionEvent) => {
      if ((event.propertyName === "transform" || event.propertyName === "padding-bottom") && (event.target as HTMLElement).matches(".instrument, .chapter")) requestBuild();
    };
    window.addEventListener("scroll", requestBuild, { passive: true });
    window.addEventListener("resize", requestBuild);
    root.addEventListener("transitionend", settleBuild);
    cleanups.push(() => window.removeEventListener("scroll", requestBuild));
    cleanups.push(() => window.removeEventListener("resize", requestBuild));
    cleanups.push(() => root.removeEventListener("transitionend", settleBuild));

    root.classList.remove("no-js");
    setEvidenceState(requestedState);
    updateBuild();

    return () => {
      cleanups.forEach((cleanup) => cleanup());
      sequences.forEach((sequence) => sequence.querySelectorAll<HTMLElement>("[data-step]").forEach((step) => { delete step.dataset.stepState; }));
      if (buildFrame) window.cancelAnimationFrame(buildFrame);
      field?.querySelectorAll(".meaning-node-s2").forEach((node) => node.remove());
      while (svg?.firstChild) svg.removeChild(svg.firstChild);
    };
  }, [rootRef]);
}

/**
 * S6: the story in three beats, the hero's way in, and the finder.
 *
 * The beats are one panel the reader steps through with its own controls; it
 * never pins and never moves the page, and all three beats sit in one place,
 * so the panel is always the size of its longest (Ruling, Krish, 2026-10-24).
 * Without scripting the controls are hidden and the beats read one after
 * another. The hero's button lives in the locked markup, so its click is taken
 * here.
 */
function useBrainSections(rootRef: React.RefObject<HTMLDivElement>, finderRef: React.RefObject<HTMLDivElement>, startRef: React.MutableRefObject<(route: "brain" | "gtm") => void>) {
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panel = root.querySelector<HTMLElement>(".beats");
    const count = panel ? panel.querySelectorAll(".beat").length : 0;
    let current = 0;
    const show = (index: number) => {
      if (!panel || !count) return;
      current = (index + count) % count;
      panel.querySelectorAll<HTMLElement>("[data-beat]").forEach((el) => { el.dataset.active = String(Number(el.dataset.beat) === current); });
      panel.querySelectorAll<HTMLButtonElement>("[data-beat-go]").forEach((button) => button.setAttribute("aria-pressed", String(Number(button.dataset.beatGo) === current)));
      const at = panel.querySelector(".beat-at");
      if (at) at.textContent = `${current + 1} / ${count}`;
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const go = target.closest<HTMLElement>("[data-beat-go]");
      if (go) { show(Number(go.dataset.beatGo)); return; }
      const step = target.closest<HTMLElement>("[data-beat-step]");
      if (step) { show(current + Number(step.dataset.beatStep)); return; }
      if (target.closest("[data-brain-start]")) {
        track("scoping_request", { source: "hero", route: "brain" });
        startRef.current("brain");
      }
    };
    root.addEventListener("click", onClick);

    const finder = finderRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const unmountFinder = finder ? mountStoryFinder(finder, {
      reduced,
      deck: true,
      onStart: (door) => {
        track("scoping_request", { source: "story_finder", route: door });
        startRef.current(door);
      },
    }) : () => undefined;

    /* The page builds as it is read, like the homepage (Krish, 2026-11-04,
       src/lib/scrollBuild.ts): headings arrive and a hand marks their key
       words, ledes follow a sentence at a time, then the cards. The chapters'
       own scrub (instruments rising, steps lighting) is untouched. */
    const unbuildChapters = buildOnScroll(root, {
      sections: ".chapter[data-phase]",
      title: ".chapter-copy > h1, .chapter-copy > h2, .beat-copy > h2",
      lede: ".chapter-copy > p, .beat-copy > p",
      splitLede: true,
    });
    const close = root.closest("main")?.querySelector<HTMLElement>(".brain-close");
    const unbuildClose = close ? buildOnScroll(close, {
      sections: ".brain-finder, .brain-close-body",
      title: ".finder-question",
      items: ".finder-panels, .s8-keeps li, .mm-pairing",
    }) : () => undefined;
    /* Each section eases back as it leaves (Ruling, owner, 2026-11-10:
       "Gentle settle, no pinning"). */
    const unsettle = settleSections([...root.querySelectorAll<HTMLElement>(":scope > .chapter[data-phase]"), ...(close ? [close] : [])]);

    return () => {
      root.removeEventListener("click", onClick);
      unmountFinder();
      unbuildChapters();
      unbuildClose();
      unsettle();
    };
  }, [rootRef, finderRef, startRef]);
}

export default function AiBrainLocked() {
  const { briefOpen, briefRoute, briefJourneyKey, openBrief, closeBrief } = useLeadBriefHistory();
  const rootRef = useRef<HTMLDivElement>(null);
  const finderRef = useRef<HTMLDivElement>(null);
  const startRef = useRef(openBrief);
  startRef.current = openBrief;
  useLockedBrain(rootRef);
  useLockedMotion(rootRef);
  useBrainSections(rootRef, finderRef, startRef);

  return (
    <MindmakeShell onStart={() => openBrief("brain")} mainClassName="mm-locked-route-main" siteClassName="mm-route-brain">
      <SEO title="Build your AI brain" description="Every AI you can buy already knows the market, and none of them know you. We help you build the one that does, private to you." canonical="/ai-brain" />
      <div ref={rootRef} className="mm-locked-brain no-js" data-evidence-state="loading" dangerouslySetInnerHTML={{ __html: lockedMarkup }} />
      <div className="brain-close">
        <CompareNudge page="brain" />
        <div ref={finderRef} id="stories" className="nal-page brain-finder" dangerouslySetInnerHTML={{ __html: finderMarkup }} />
        <div className="brain-close-body">
          <div className="s8-keeps-block">
            <h3 className="s8-label s8-label-run"><span>What stays with you</span><span className="s8-label-sep" aria-hidden="true"> · </span><span>Yours to keep</span><span className="s8-label-sep" aria-hidden="true"> · </span><span>Day 30</span></h3>
            <ul className="s8-keeps">
              {KEEPS.map((entry, index) => <li key={entry}><Icon name={KEEP_ICON[index]} className="mm-icon mm-icon-big" />{entry}</li>)}
            </ul>
          </div>
          <PairingBridge route="brain" onStart={() => openBrief("brain")} startLabel={START_LABEL} />
        </div>
      </div>
      <LeadBrief key={briefRoute} open={briefOpen} onClose={closeBrief} route={briefRoute === "gtm" ? "gtm" : "brain"} presentation="drawer" journeyKey={briefJourneyKey} />
    </MindmakeShell>
  );
}
