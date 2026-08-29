import { describe, expect, it, vi, afterEach } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { AskBar } from "@/components/mindmake/AskBar";
import { HumanHandoff } from "@/components/mindmake/HumanHandoff";
import { BrainJourney } from "@/components/mindmake/journeys/BrainJourney";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import {
  HANDOFF_ACTION,
  HANDOFF_COPY,
  HANDOFF_REASONS,
  HANDOFF_TRIGGER,
  type HandoffReason,
} from "@/content/handoff";
import { CONTACT_EMAIL } from "@/lib/publicLinks";
import type { Details } from "@/components/mindmake/journeys/DetailsJourney";

/**
 * Every dead end ends in a person.
 *
 * Nine things on this site can fail. Before this, every one of them finished on
 * a line of grey text with nothing under it, and the worst of them was the
 * honest one: the read gate deciding a company could not be written about well
 * enough to send, saying so, and leaving somebody who had typed four true
 * details with nowhere to go. That was a lead we asked to leave.
 *
 * These hold the fix in place, because it is exactly the sort of thing that
 * disappears in a refactor without a single gate objecting. One of the site's
 * canon promises did exactly that for a whole commit.
 */

const ADA: Details = {
  firstName: "Ada",
  lastName: "Lovelace",
  email: "ada@northwind.com",
  division: "leadership",
  domain: "northwind.com",
};

/** Fills the four fields every page asks for. */
function enterDetails(email = "ada@northwind.com") {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Lovelace" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: email } });
  fireEvent.click(screen.getByRole("button", { name: "Leadership" }));
}

const received = () => new Response(JSON.stringify({ status: "received" }), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});

afterEach(() => { vi.restoreAllMocks(); });

describe("the offer itself", () => {
  it("asks for nothing when the page already holds the details", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(received());
    render(<HumanHandoff reason="read-refused" details={ADA} />);

    // No fourth form at the worst possible moment.
    expect(screen.queryByLabelText("Work email")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: new RegExp(HANDOFF_ACTION, "i") }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const body = JSON.parse(String((fetchSpy.mock.calls[0][1] as RequestInit).body));
    expect(body).toEqual({
      action: "handoff",
      reason: "read-refused",
      first_name: "Ada",
      last_name: "Lovelace",
      division: "leadership",
      email: "ada@northwind.com",
    });
    // Never the domain, the read, or anything the browser is not trusted with.
    expect(Object.keys(body)).toHaveLength(6);
  });

  it("confirms a person rather than an email, because a handoff is neither of the two", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(received());
    render(<HumanHandoff reason="read-refused" details={ADA} />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(HANDOFF_ACTION, "i") }));

    expect(await screen.findByText(/that is with a person now/i)).toBeInTheDocument();
    expect(screen.getByText(/reply to you directly/i)).toBeInTheDocument();
    expect(screen.queryByText(/check your inbox|on its way/i)).not.toBeInTheDocument();
  });

  it("hands over an address rather than a spinner when even this fails", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    render(<HumanHandoff reason="read-refused" details={ADA} />);
    fireEvent.click(screen.getByRole("button", { name: new RegExp(HANDOFF_ACTION, "i") }));

    const last = await screen.findByRole("link", { name: CONTACT_EMAIL });
    expect(last).toHaveAttribute("href", `mailto:${CONTACT_EMAIL}`);
  });

  it("asks for what it lacks, and never for the company rule it has stopped enforcing", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(received());
    render(<HumanHandoff reason="ask-unmatched" />);

    // A personal address is fine here: the reading it protects is already off.
    enterDetails("ada@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: new RegExp(HANDOFF_ACTION, "i") }));

    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    const body = JSON.parse(String((fetchSpy.mock.calls[0][1] as RequestInit).body));
    expect(body.email).toBe("ada@gmail.com");
    expect(body.reason).toBe("ask-unmatched");
  });

  it("stays one quiet line until it is asked for", () => {
    render(<HumanHandoff reason="code-not-accepted" details={ADA} asTrigger />);
    expect(screen.queryByText(HANDOFF_COPY["code-not-accepted"].sorry)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: HANDOFF_TRIGGER }));
    expect(screen.getByText(HANDOFF_COPY["code-not-accepted"].sorry)).toBeInTheDocument();
  });
});

describe("the dead ends on /ai-brain", () => {
  const pick = () => {
    fireEvent.click(screen.getByRole("button", { name: "Chasing people" }));
    fireEvent.click(screen.getByRole("button", { name: "My pipeline" }));
  };

  it("offers a person when the gate refuses to send, and does not offer a retry", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(
      JSON.stringify({ status: "not_worth_sending", failures: 3 }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    ));
    render(<BrainJourney />);
    pick();
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    expect(await screen.findByText(HANDOFF_COPY["read-refused"].sorry)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: new RegExp(HANDOFF_ACTION, "i") })).toBeInTheDocument();
    /* The one case with nothing to try again. The read did not fail, it was
       refused, and offering the same refusal a second time is not an offer. */
    expect(screen.queryByRole("button", { name: /try the read once more/i })).not.toBeInTheDocument();
    // And the form is put away rather than left implying it might work now.
    expect(screen.queryByRole("button", { name: /Show me week one/ })).not.toBeInTheDocument();
  });

  it("tells a rate-limited visitor the cap is ours, not that they should try again", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 429 }));
    render(<BrainJourney />);
    pick();
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    expect(await screen.findByText(HANDOFF_COPY["read-rate-limited"].sorry)).toBeInTheDocument();
    expect(screen.getByText(/cannot tell a robot from somebody genuinely interested/i)).toBeInTheDocument();
  });

  it("keeps the read on screen and replaces the send button when the email will not go", async () => {
    const read = {
      opening: "Ada, this is your week.",
      lines: ["Week one line.", "Pointed at line.", "Division line."],
      company: "Northwind",
      companyOnly: false,
    };
    const fetchSpy = vi.spyOn(globalThis, "fetch")
      .mockResolvedValueOnce(new Response(JSON.stringify({ status: "ok", read }), {
        status: 200, headers: { "Content-Type": "application/json" },
      }))
      .mockResolvedValueOnce(new Response("", { status: 502 }));
    render(<BrainJourney />);
    pick();
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));
    fireEvent.click(await screen.findByRole("button", { name: /Send me the full version/ }));

    expect(await screen.findByText(HANDOFF_COPY["send-failed"].sorry)).toBeInTheDocument();
    // The read they came for is still there, and the failed action is not.
    expect(screen.getByText("Ada, this is your week.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Send me the full version/ })).not.toBeInTheDocument();
    // A retry is worth offering here: the read exists, only the post failed.
    expect(screen.getByRole("button", { name: /try sending it again/i })).toBeInTheDocument();
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("lets somebody with no work address out of the form rather than holding the door shut", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(received());
    render(<BrainJourney />);
    pick();
    enterDetails("ada@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    fireEvent.click(screen.getByRole("button", { name: HANDOFF_TRIGGER }));
    expect(screen.getByText(HANDOFF_COPY["personal-email"].sorry)).toBeInTheDocument();
    // What they typed comes across, so nobody types their name twice.
    expect(screen.getByLabelText("First name")).toHaveValue("Ada");
    expect(screen.getByLabelText("Work email")).toHaveValue("ada@gmail.com");

    fireEvent.click(screen.getByRole("button", { name: new RegExp(HANDOFF_ACTION, "i") }));
    await waitFor(() => expect(fetchSpy).toHaveBeenCalled());
    expect(JSON.parse(String((fetchSpy.mock.calls[0][1] as RequestInit).body)).reason).toBe("personal-email");
  });
});

describe("the dead ends elsewhere", () => {
  it("offers a person on the other page's address rule too", () => {
    render(<GtmJourney onRead={vi.fn()} />);
    enterDetails("ada@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: /Read my business/ }));
    fireEvent.click(screen.getByRole("button", { name: HANDOFF_TRIGGER }));
    expect(screen.getByText(HANDOFF_COPY["personal-email"].sorry)).toBeInTheDocument();
  });

  it("offers a person for a question the corpus has no answer for, and only then", () => {
    render(<AskBar />);
    const box = screen.getByLabelText("Ask us anything");

    fireEvent.change(box, { target: { value: "what is your favourite colour" } });
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(screen.getByRole("button", { name: HANDOFF_TRIGGER })).toBeInTheDocument();

    fireEvent.change(box, { target: { value: "how long does it take" } });
    fireEvent.click(screen.getByRole("button", { name: "Ask" }));
    expect(screen.queryByRole("button", { name: HANDOFF_TRIGGER })).not.toBeInTheDocument();
  });
});

describe("the copy, held to the house style", () => {
  const strings = [
    ...HANDOFF_REASONS.flatMap((reason: HandoffReason) => [
      HANDOFF_COPY[reason].sorry,
      HANDOFF_COPY[reason].aside,
    ]),
    HANDOFF_ACTION,
    HANDOFF_TRIGGER,
  ];

  it("carries no em dash and no American spelling", () => {
    for (const line of strings) {
      expect(line, line).not.toMatch(/[–—]/);
      expect(line, line).not.toMatch(/\bjudgment|\borganiz|\bapologiz|\brecogniz|\bcolor\b|\bbehavior\b/i);
    }
  });

  it("never speaks in the operator's name", () => {
    for (const line of strings) {
      expect(line, line).not.toMatch(/\bkrish\b|\braja\b/i);
    }
  });

  it("apologises first, in a sentence a twelve-year-old could read", () => {
    for (const reason of HANDOFF_REASONS) {
      const { sorry } = HANDOFF_COPY[reason];
      expect(sorry, reason).toMatch(/^(Sorry|No work address|We do not have)/);
      /* One sentence. A guard against the apology growing into a paragraph,
         not a style rule: the longest of them is the approved one. */
      expect(sorry.length, reason).toBeLessThan(90);
    }
  });

  it("aims the joke at the machine and never at the reader", () => {
    /* The register was chosen deliberately: dry, self-deprecating, and the
       machine is the butt of it. A joke at the visitor's expense at the moment
       they have been let down is not levity, it is a second insult. */
    for (const reason of HANDOFF_REASONS) {
      const { sorry, aside } = HANDOFF_COPY[reason];
      const both = `${sorry} ${aside}`;
      expect(both, reason).toMatch(/\b(we|our|us|ours)\b/i);
      expect(both, reason).not.toMatch(/\byou (should|need to|must|failed|forgot)\b/i);
      // Never an order. The house style bans commands to the reader outright.
      expect(both, reason).not.toMatch(/^(Try|Check|Enter|Click|Use|Add) /m);
    }
  });

  it("keeps the browser's list of reasons identical to the server's", () => {
    const core = readFileSync("supabase/functions/mindmake-personal-read/core.ts", "utf8");
    const block = core.slice(core.indexOf("export const HANDOFF_REASONS"));
    const server = Array.from(block.slice(0, block.indexOf("] as const")).matchAll(/"([a-z-]+)"/g), (m) => m[1]);
    expect(server).toEqual([...HANDOFF_REASONS]);
  });
});

describe("what the panel is allowed to look like", () => {
  it("wears the surface it lands on rather than carrying its own", () => {
    /* The proposal learned this the hard way, as dark text on a dark ground.
       Every colour in here resolves through the dialog's tone tokens first and
       falls back to the page's, so the same panel is legible inside the lead
       dialog on paper and inside the journey on ink. */
    const css = readFileSync("src/styles/mindmake.css", "utf8");
    const block = css.slice(css.indexOf(".mm-handoff {"), css.indexOf(".mm-handoff-say"));
    for (const token of ["--mmh-fg", "--mmh-mut", "--mmh-line", "--mmh-accent"]) {
      expect(block).toContain(`${token}: var(--mmb-`);
    }
    /* And the aside reads the dialog's secondary-text token rather than its
       caption one. Measured in a browser before the change: 3.4:1 on paper,
       which is right for a small label naming a box and wrong for a sentence.
       After: 6.9:1 on paper, 7.7:1 on ink, 8.1:1 on forest. */
    expect(block).toContain("--mmh-mut: var(--mmb-fg2");
    const brief = readFileSync("src/styles/mindmake-brief.css", "utf8");
    for (const tone of ["ink", "forest", "paper"]) {
      const scope = brief.slice(brief.indexOf(`[data-tone="${tone}"]`));
      expect(scope.slice(0, scope.indexOf("}")), tone).toContain("--mmb-fg2:");
    }
  });

  it("gives the offer a heading, an aside and one action, in that order", () => {
    const { container } = render(<HumanHandoff reason="read-refused" details={ADA} />);
    const panel = container.querySelector(".mm-handoff");
    expect(panel).not.toBeNull();
    const say = within(panel as HTMLElement).getByRole("alert");
    expect(say.textContent).toContain(HANDOFF_COPY["read-refused"].sorry);
    expect(within(panel as HTMLElement).getAllByRole("button")).toHaveLength(1);
  });
});
