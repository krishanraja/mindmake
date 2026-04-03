import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CookieConsent } from "../components/CookieConsent";

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("shows banner when no consent stored", () => {
    render(<CookieConsent />);
    expect(screen.getByText("Got it")).toBeInTheDocument();
  });

  it("hides banner after clicking accept", () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText("Got it"));
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
    expect(localStorage.getItem("mindmaker_consent")).toBe("accepted");
  });

  it("does not show banner when consent already stored", () => {
    localStorage.setItem("mindmaker_consent", "accepted");
    render(<CookieConsent />);
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
  });
});
