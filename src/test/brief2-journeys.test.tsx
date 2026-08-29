import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import { cleanDomain, isPublicHostname } from "@/lib/domain";
import { BrainJourney } from "@/components/mindmake/journeys/BrainJourney";
import { CLOSING_LINE } from "@/content/personalRead";

/**
 * Both pages ask for the same four things now, so the first thing worth holding
 * is that they really do: the shared capture is the only way into either
 * pipeline, and it applies the same rules on both. After that each page does its
 * own thing, and those are tested separately because they are different things.
 */

/** Fills the four fields every page asks for. */
function enterDetails(email = "ada@northwind.com") {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Lovelace" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: email } });
  fireEvent.click(screen.getByRole("button", { name: "Leadership" }));
}

describe("the shared capture", () => {
  it("hands over the details and the company it read from the email", () => {
    const onRead = vi.fn();
    render(<GtmJourney onRead={onRead} />);
    enterDetails("Ada@WWW.Northwind.com");
    fireEvent.click(screen.getByRole("button", { name: /Read my business/ }));

    expect(onRead).toHaveBeenCalledWith({
      firstName: "Ada",
      lastName: "Lovelace",
      email: "ada@www.northwind.com",
      division: "leadership",
      domain: "northwind.com",
    });
  });

  it("refuses a personal address, and says the limitation is ours", () => {
    const onRead = vi.fn();
    render(<GtmJourney onRead={onRead} />);
    enterDetails("ada@gmail.com");
    fireEvent.click(screen.getByRole("button", { name: /Read my business/ }));

    expect(onRead).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/we read your company from your email/i);
  });

  it("will not proceed without a name or a division", () => {
    const onRead = vi.fn();
    render(<GtmJourney onRead={onRead} />);

    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "ada@northwind.com" } });
    fireEvent.click(screen.getByRole("button", { name: /Read my business/ }));
    expect(screen.getByRole("alert")).toHaveTextContent(/we need your name/i);
    expect(onRead).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Ada" } });
    fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Lovelace" } });
    fireEvent.click(screen.getByRole("button", { name: /Read my business/ }));
    expect(screen.getByRole("alert")).toHaveTextContent(/part of the business/i);
    expect(onRead).not.toHaveBeenCalled();
  });

  it("states the three steps, including the email cap", () => {
    render(<GtmJourney onRead={vi.fn()} />);
    expect(screen.getByText("We read your market")).toBeInTheDocument();
    expect(screen.getByText("A plan built for you")).toBeInTheDocument();
    expect(screen.getByText("One email, and that is it")).toBeInTheDocument();
    expect(screen.getByText(/write once more after two weeks, and never again/i)).toBeInTheDocument();
  });
});

describe("domain validation", () => {
  it("reduces what a visitor types to the bare host", () => {
    expect(cleanDomain("  HTTPS://WWW.Example.CO.UK/a/b  ")).toBe("example.co.uk");
    expect(cleanDomain("example.com")).toBe("example.com");
    expect(cleanDomain("")).toBe("");
  });

  it("rejects what the read cannot use", () => {
    expect(isPublicHostname("example.com")).toBe(true);
    expect(isPublicHostname("sub.example.co.uk")).toBe(true);
    expect(isPublicHostname("localhost")).toBe(false);
    expect(isPublicHostname("example")).toBe(false);
    expect(isPublicHostname(".example.com")).toBe(false);
    expect(isPublicHostname("example.com.")).toBe(false);
  });
});

describe("the personal read", () => {
  const READ = {
    opening: "You are Chief Executive at Northwind. Here is what your first week would look like.",
    lines: ["Line about writing.", "Line about the network.", "Line about leadership."],
    company: "Northwind",
    companyOnly: false,
  };

  const serverReturns = (read: unknown) =>
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ status: "ok", read }), {
        headers: { "Content-Type": "application/json" },
      }),
    );

  it("puts the server's read on screen rather than a template", async () => {
    /* The read is the point: it used to be composed locally from two template
       lines, so everyone who tapped the same chips saw the same thing. */
    serverReturns(READ);
    render(<BrainJourney />);

    fireEvent.click(screen.getByRole("button", { name: "Writing and comms" }));
    fireEvent.click(screen.getByRole("button", { name: "My network" }));
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    await waitFor(() => expect(screen.getByText(READ.opening)).toBeInTheDocument());
    for (const line of READ.lines) expect(screen.getByText(line)).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("says out loud when it only found the company", async () => {
    /* A read built from the division alone must not be passed off as one that
       found the person. */
    serverReturns({ ...READ, companyOnly: true });
    render(<BrainJourney />);
    fireEvent.click(screen.getByRole("button", { name: "Writing and comms" }));
    fireEvent.click(screen.getByRole("button", { name: "My network" }));
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    await waitFor(() =>
      expect(screen.getByText(/we did not find you specifically/i)).toBeInTheDocument());
    vi.restoreAllMocks();
  });

  it("asks for nothing else until the read exists", async () => {
    serverReturns(READ);
    render(<BrainJourney />);

    expect(screen.queryByRole("button", { name: /Send me the full version/ })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Admin between decisions" }));
    fireEvent.click(screen.getByRole("button", { name: "My decisions" }));
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /Send me the full version/ })).toBeInTheDocument());
    vi.restoreAllMocks();
  });

  it("says what to do rather than running a read it cannot use", () => {
    render(<BrainJourney />);
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));
    expect(screen.getByRole("alert")).toHaveTextContent(/tap one answer in each question/i);
  });

  it("says so rather than claiming a read that failed", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("", { status: 500 }));
    render(<BrainJourney />);
    fireEvent.click(screen.getByRole("button", { name: "Chasing people" }));
    fireEvent.click(screen.getByRole("button", { name: "My pipeline" }));
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(/could not read your company/i));
    vi.restoreAllMocks();
  });

  it("states the two-email cap beside the read", async () => {
    serverReturns(READ);
    render(<BrainJourney />);
    fireEvent.click(screen.getByRole("button", { name: "Chasing people" }));
    fireEvent.click(screen.getByRole("button", { name: "My pipeline" }));
    enterDetails();
    fireEvent.click(screen.getByRole("button", { name: /Show me week one/ }));

    await waitFor(() => expect(screen.getByText(CLOSING_LINE)).toBeInTheDocument());
    expect(CLOSING_LINE).toMatch(/one email, ever, plus one follow-up/i);
    vi.restoreAllMocks();
  });
});
