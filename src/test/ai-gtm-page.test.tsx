import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render as serverRender } from "@/entry-server";
import AiGtm from "@/pages/AiGtm";

/**
 * /ai-gtm as one argument (r47): the change the reader feels, in four places;
 * the turn to the offer; the 30 days; the team; one result. These read the
 * server render for what every reader gets before scripts run, and the client
 * render for what the one switch on the page changes.
 */

const ROOT = resolve(__dirname, "../..");
const read = (relative: string) => readFileSync(resolve(ROOT, relative), "utf8");

const contexts: string[] = [];
vi.mock("@/components/mindmake/LeadBrief", () => ({
  LeadBrief: ({ initialContext }: { initialContext?: string }) => {
    if (initialContext) contexts.push(initialContext);
    return null;
  },
}));

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  contexts.length = 0;
});

const text = (html: string) => html.replace(/<[^>]+>/g, " ").replace(/&[a-z#0-9]+;/g, " ").replace(/\s+/g, " ");

describe("/ai-gtm on the server", () => {
  const html = serverRender("/ai-gtm");
  const body = html.slice(html.indexOf('class="mm-gtm"'));

  it("has one h1, and it is the proposition, with the urgency in its lede and nothing before the four places", () => {
    /* Ruling (2026-10-24): "the Make Your Pricing, Positioning and Team AI
       Native is probably actually the top headline", leading with the urgency
       of the old opening, and the "add an AI tool" section "doesn't need to
       exist". */
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    const h1 = html.slice(html.indexOf("<h1"), html.indexOf("</h1>"));
    expect(text(h1).trim()).toBe("Make your pricing, positioning and team AI-native.");
    const lede = body.indexOf("Your customers have changed how they buy.");
    expect(lede).toBeGreaterThan(body.indexOf("<h1"));
    expect(body.indexOf("Where are you starting from?")).toBeGreaterThan(lede);
    expect(body.indexOf("You can feel it in four places.")).toBeGreaterThan(body.indexOf("Where are you starting from?"));
    expect(text(body)).not.toContain("You could add an AI tool");
    expect(text(body)).not.toContain("The deals would go to whoever changed the rest.");
  });

  it("shows every part of every section at once, with nothing pinned and nothing hidden from assistive technology but the other starting point", () => {
    expect(body).not.toMatch(/data-gtm-step=/);
    expect(body).not.toContain("gtm-stage");
    for (const felt of [
      "Your buyers are being offered software that does the whole job.",
      "Your buyers can already pay some software for each result it delivers.",
      "Your next buyer may ask an AI assistant for a shortlist before they visit your website.",
      "Agents, software that works on its own, now answer customers and find leads.",
    ]) {
      expect(text(body)).toContain(felt);
    }
    /* Each card holds both starting points in one place, the chosen one shown
       and the other hidden from sight and from assistive technology. */
    const levers = body.slice(body.indexOf('data-gtm-chapter="levers"'), body.indexOf("</section>", body.indexOf('data-gtm-chapter="levers"')));
    expect((levers.match(/class="gtm-lever-way" data-active="true"/g) ?? [])).toHaveLength(4);
    expect((levers.match(/class="gtm-lever-way" data-active="false" aria-hidden="true"/g) ?? [])).toHaveLength(4);
    for (const step of ["Week 1", "Weeks 2 to 4", "Day 30"]) expect(text(body)).toContain(step);
    for (const keep of ["The model.", "The evidence.", "Anything we built."]) expect(text(body)).toContain(keep);
  });

  it("shows the work the month can produce instead of folding it into a drawer", () => {
    for (const item of ["Pricing model and buyer test", "Positioning and messaging", "AI-native org chart", "Working agents", "Product marketing launch kit", "AI market read"]) {
      expect(text(body)).toContain(item);
    }
    expect(body).not.toContain("<details");
  });

  it("carries both of each seat's states, so a reader without scripts sees the team change", () => {
    expect(text(body)).toContain("8 account executives");
    expect(text(body)).toContain("4 people + research and proposal agents");
    expect(text(body)).toContain("27 people · 0 agents");
    expect(text(body)).toContain("11 people · 5 agent roles");
  });

  it("writes each seat's decision into the seat, so a reader who cannot pick one still reads them all", () => {
    const start = body.indexOf('data-gtm-chapter="team"');
    const board = body.slice(start, body.indexOf("decision-panel", start));
    for (const decision of [
      "How do you set targets when part of the team is software?",
      "Who is accountable when an agent turns away a lead that would have bought?",
      "Per task or per result: which can your buyers forecast and your finance team bill?",
    ]) expect(text(board)).toContain(decision);
    // The copies that hold the panel at its tallest decision are unseen and unheard.
    const sizers = body.match(/class="decision-copy decision-sizer"[^>]*>/g) ?? [];
    expect(sizers.length).toBeGreaterThan(0);
    for (const sizer of sizers) expect(sizer).toContain('aria-hidden="true"');
  });

  it("cites a dated public source for every lever", () => {
    const start = body.indexOf('data-gtm-chapter="levers"');
    const levers = text(body.slice(start, body.indexOf("</section>", start)));
    expect(levers.match(/(Zendesk|HubSpot|Shopify) · \d{1,2} [A-Z][a-z]{2} 2026/g)).toEqual([
      "Zendesk · 19 May 2026",
      "HubSpot · 13 Apr 2026",
      "Shopify · 24 Mar 2026",
      "HubSpot · 13 Apr 2026",
    ]);
  });

  it("quotes the result in quotation marks, with the outcome and the attribution beneath", () => {
    const quote = "We set up an AI-native go-to-market system that made us rethink who we hire and what they do.";
    const flat = text(body);
    expect(flat).toContain(quote);
    const after = text(body.slice(body.indexOf("gtm-quote")));
    const at = after.indexOf("We set up an AI-native");
    const who = after.indexOf("Chief Revenue Officer, data-infrastructure company");
    const outcome = after.indexOf("A new sales path led to a paid test");
    expect(outcome).toBeGreaterThan(at);
    expect(who).toBeGreaterThan(outcome);
    expect(body).toContain('href="/case-studies#story=market-moves"');
  });

  /* The acronym GTM leaves public copy (Krish, 2026-10-15); the page says
     go-to-market in full. */
  it("names go-to-market in full and never says GTM", () => {
    const flat = text(body);
    expect(flat.indexOf("go-to-market")).toBeGreaterThan(-1);
    expect(flat).not.toContain("GTM");
  });

  it("loads its films on demand only", () => {
    const videos = body.split("<video").slice(1).map((video) => video.slice(0, video.indexOf(">")));
    expect(videos).toHaveLength(2);
    for (const video of videos) {
      expect(video).toContain("data-src=");
      expect(video).toContain("poster=");
      expect(video).not.toMatch(/\ssrc=/);
    }
  });

  it("publishes no price and no retired shorthand", () => {
    expect(text(body)).toContain("and the fee, before work starts");
    expect(text(body)).not.toMatch(/[$£€]\s?\d/);
    for (const phrase of ["Keep the seat", "Meter the work", "Price the result"]) expect(text(body)).not.toContain(phrase);
  });
});

describe("/ai-gtm in the browser", () => {
  function renderPage() {
    vi.stubGlobal("scrollTo", vi.fn());
    return render(<MemoryRouter initialEntries={["/ai-gtm"]}><AiGtm /></MemoryRouter>);
  }

  it("lets the reader say which business they run, and follows it through the team, the result and the brief", () => {
    renderPage();
    const levers = document.querySelector('[data-gtm-chapter="levers"]')!.textContent;
    expect(screen.getByText("Your sales and marketing team gets agents.")).toBeTruthy();
    expect(contexts.at(-1)).toBe("I run an established business");

    fireEvent.click(screen.getByLabelText(/I'm building an AI-native business/));
    expect(screen.getByText("Your first commercial team can be mostly agents.")).toBeTruthy();
    expect(document.querySelector(".gtm-quote")!.textContent).toContain("We had a brilliant product nobody could buy");
    expect(contexts.at(-1)).toBe("I'm building an AI-native business");
    /* The four places now speak to the chosen starting point, in the same
       cells: the founder's ways are the ones shown, and no card gained or lost
       a word, so none can change size. */
    const shown = [...document.querySelectorAll('.gtm-lever-way[data-active="true"]')].map((way) => way.textContent).join(" ");
    expect(shown).toContain("Build around the job AI can finish.");
    expect(shown).not.toContain("Software that finishes the work.");
    expect(document.querySelector('[data-gtm-chapter="levers"]')!.textContent).toBe(levers);
    // Choosing never moves the page.
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  it("turns today's team into the AI-native one with its switch, and shows the decision a seat creates, without moving the page", () => {
    renderPage();
    const team = document.querySelector('[data-gtm-chapter="team"]') as HTMLElement;
    expect(team.dataset.view).toBe("today");
    fireEvent.click(screen.getByRole("button", { name: "AI-native" }));
    expect(team.dataset.view).toBe("native");
    fireEvent.click(screen.getAllByRole("button", { name: /Lead qualification/ })[0]);
    expect(document.querySelector(".decision-panel h3")!.textContent).toBe("Who is accountable when an agent turns away a lead that would have bought?");
    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});

describe("/ai-gtm's stylesheet", () => {
  const css = read("src/styles/mindmake-ai-gtm.css");
  const tokenBlock = css.slice(css.indexOf(".mm-gtm {"), css.indexOf("}", css.indexOf(".mm-gtm {")) + 1);
  const rest = css.replace(tokenBlock, "");

  it("replaces the page's two private stylesheets", () => {
    expect(existsSync(resolve(ROOT, "src/styles/mindmake-locked-gtm.css"))).toBe(false);
    expect(existsSync(resolve(ROOT, "src/styles/mindmake-gtm-plain.css"))).toBe(false);
    const page = read("src/pages/AiGtm.tsx");
    expect(page).toContain('import "@/styles/mindmake-ai-gtm.css"');
    expect(page).not.toMatch(/mindmake-locked-gtm|mindmake-gtm-plain/);
  });

  it("reads the house tokens and names no font of its own", () => {
    expect(rest).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/font-family:\s*["'A-Z]/);
    expect(css).not.toMatch(/font:[^;]*"[^"]+"/);
    /* Set on the element by the chapter that owns it: the step count, a rail
       segment's count and index, the progress the hook writes, a day of the
       month and the board's column count. */
    const fromMarkup = new Set(["--gtm-steps", "--gtm-n", "--gtm-i", "--gtm-progress", "--gtm-day", "--gtm-cols"]);
    for (const [, name] of css.matchAll(/var\((--[a-z0-9-]+)/g)) {
      const defined = name.startsWith("--mm-") || fromMarkup.has(name) || new RegExp(`${name}\\s*:`).test(css);
      expect(`${name}: ${defined}`).toBe(`${name}: true`);
    }
  });

  it("sets no text under 12px", () => {
    for (const [, size] of css.matchAll(/(?:font-size:|font:\s*\d+\s+)\s*(\d+(?:\.\d+)?)px/g)) {
      expect(Number(size)).toBeGreaterThanOrEqual(12);
    }
  });

  it("pins nothing, reads as a document without scripts, and drops transitions for reduced motion", () => {
    expect(css).not.toMatch(/position: sticky/);
    expect(css).toMatch(/@media \(scripting: none\) \{[\s\S]*?\.gtm-view-switch \{ display: none; \}/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?transition: none;/);
  });
});
