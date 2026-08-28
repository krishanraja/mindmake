import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import { cleanDomain, isPublicHostname } from "@/lib/domain";
import { BrainJourney } from "@/components/mindmake/journeys/BrainJourney";
import { CLOSING_LINE, Q1_LINES, Q2_LINES } from "@/content/personalRead";

/**
 * The GTM journey is a seam onto shipped machinery, not a second pipeline. It
 * validates a domain and hands it over; everything downstream stays untouched.
 */

describe("the company read seam", () => {
  it("hands a cleaned domain to the brief dialog", () => {
    const onRead = vi.fn();
    render(<GtmJourney onRead={onRead} />);

    fireEvent.change(screen.getByLabelText("Your company web address"), { target: { value: "https://www.Example.com/pricing" } });
    fireEvent.click(screen.getByRole("button", { name: "Read my business" }));

    expect(onRead).toHaveBeenCalledWith("example.com");
  });

  it("says so rather than starting a read it cannot run", () => {
    const onRead = vi.fn();
    render(<GtmJourney onRead={onRead} />);

    fireEvent.change(screen.getByLabelText("Your company web address"), { target: { value: "not a website" } });
    fireEvent.click(screen.getByRole("button", { name: "Read my business" }));

    expect(onRead).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toHaveTextContent(/company web address/i);
  });

  it("submits on Enter as well as the button", () => {
    const onRead = vi.fn();
    render(<GtmJourney onRead={onRead} />);

    const field = screen.getByLabelText("Your company web address");
    fireEvent.change(field, { target: { value: "example.com" } });
    fireEvent.keyDown(field, { key: "Enter" });

    expect(onRead).toHaveBeenCalledWith("example.com");
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
  it("composes the preview with no network call", () => {
    /* The instant preview is structural, not best effort: the visitor sees
       their week one before any request could have returned. */
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    render(<BrainJourney />);

    fireEvent.click(screen.getByRole("button", { name: "Writing and comms" }));
    fireEvent.click(screen.getByRole("button", { name: "My network" }));
    fireEvent.click(screen.getByRole("button", { name: "Show me week one" }));

    expect(screen.getByText(Q1_LINES.writing)).toBeInTheDocument();
    expect(screen.getByText(Q2_LINES.network)).toBeInTheDocument();
    // The enrichment call is fired and never awaited, so the preview cannot
    // depend on it. What matters is that the lines are already on screen.
    fetchSpy.mockRestore();
  });

  it("asks for the email only once the preview exists", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    render(<BrainJourney />);

    expect(screen.queryByLabelText("Your work email")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Admin between decisions" }));
    fireEvent.click(screen.getByRole("button", { name: "My decisions" }));
    fireEvent.click(screen.getByRole("button", { name: "Show me week one" }));

    expect(screen.getByLabelText("Your work email")).toBeInTheDocument();
    vi.restoreAllMocks();
  });

  it("says what to do rather than showing an empty preview", () => {
    render(<BrainJourney />);
    fireEvent.click(screen.getByRole("button", { name: "Show me week one" }));
    expect(screen.getByRole("status")).toHaveTextContent(/tap one answer in each question/i);
  });

  it("states the two-email cap beside the preview", () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("{}"));
    render(<BrainJourney />);
    fireEvent.click(screen.getByRole("button", { name: "Chasing people" }));
    fireEvent.click(screen.getByRole("button", { name: "My pipeline" }));
    fireEvent.click(screen.getByRole("button", { name: "Show me week one" }));
    expect(screen.getByText(CLOSING_LINE)).toBeInTheDocument();
    expect(CLOSING_LINE).toMatch(/one email, ever, plus one follow-up/i);
    vi.restoreAllMocks();
  });
});
