import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CookieConsent } from "../components/CookieConsent";

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.classList.remove("mm-cookie-visible");
    document.documentElement.style.removeProperty("--mm-cookie-reserve");
  });

  it("shows banner when no consent stored", () => {
    render(<CookieConsent />);
    expect(screen.getByText("Got it")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("mm-cookie-visible");
  });

  it("hides banner after clicking accept", () => {
    render(<CookieConsent />);
    fireEvent.click(screen.getByText("Got it"));
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
    expect(localStorage.getItem("mindmake_consent")).toBe("accepted");
    expect(document.documentElement).not.toHaveClass("mm-cookie-visible");
    expect(document.documentElement.style.getPropertyValue("--mm-cookie-reserve")).toBe("");
  });

  it("does not show banner when consent already stored", () => {
    localStorage.setItem("mindmake_consent", "accepted");
    render(<CookieConsent />);
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
  });

  it("still shows the notice when storage cannot be read", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    render(<CookieConsent />);
    expect(screen.getByText("Got it")).toBeInTheDocument();
  });

  it("still closes the notice when storage cannot be written", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    render(<CookieConsent />);
    fireEvent.click(screen.getByText("Got it"));
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
  });
});
