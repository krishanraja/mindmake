import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { GtmJourney } from "@/components/mindmake/journeys/GtmJourney";
import { cleanDomain, isPublicHostname } from "@/lib/domain";

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
    expect(screen.getByText("We read you, live")).toBeInTheDocument();
    expect(screen.getByText("A proposal built for you")).toBeInTheDocument();
    expect(screen.getByText("One email. That is it.")).toBeInTheDocument();
    expect(screen.getByText(/never mail you again except one follow-up/i)).toBeInTheDocument();
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
