import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import { CookieConsent } from "../components/CookieConsent";

/**
 * Scrolls past the point at which the notice is allowed to appear.
 *
 * The notice is held back until the visitor leaves the first screen, because as
 * a corner card it would otherwise land on top of the homepage's two doors.
 * Every test that expects to see it has to get there first.
 */
function leaveFirstScreen() {
  act(() => {
    window.scrollY = window.innerHeight;
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("CookieConsent", () => {
  beforeEach(() => {
    localStorage.clear();
    window.scrollY = 0;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    window.scrollY = 0;
    document.documentElement.classList.remove("mm-cookie-visible");
    document.documentElement.style.removeProperty("--mm-cookie-reserve");
  });

  it("stays out of the way on the first screen", () => {
    render(<CookieConsent />);
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
    expect(document.documentElement).not.toHaveClass("mm-cookie-visible");
  });

  it("shows banner once the visitor scrolls, when no consent stored", () => {
    render(<CookieConsent />);
    leaveFirstScreen();
    expect(screen.getByText("Got it")).toBeInTheDocument();
    expect(document.documentElement).toHaveClass("mm-cookie-visible");
  });

  it("shows banner immediately when the page is already scrolled", () => {
    window.scrollY = window.innerHeight * 2;
    render(<CookieConsent />);
    expect(screen.getByText("Got it")).toBeInTheDocument();
  });

  it("hides banner after clicking accept", () => {
    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Got it"));
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
    expect(localStorage.getItem("mindmake_consent")).toBe("accepted");
    expect(document.documentElement).not.toHaveClass("mm-cookie-visible");
    expect(document.documentElement.style.getPropertyValue("--mm-cookie-reserve")).toBe("");
  });

  it("does not show banner when consent already stored", () => {
    localStorage.setItem("mindmake_consent", "accepted");
    render(<CookieConsent />);
    leaveFirstScreen();
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
  });

  it("still shows the notice when storage cannot be read", () => {
    vi.spyOn(localStorage, "getItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    render(<CookieConsent />);
    leaveFirstScreen();
    expect(screen.getByText("Got it")).toBeInTheDocument();
  });

  it("still closes the notice when storage cannot be written", () => {
    vi.spyOn(localStorage, "setItem").mockImplementation(() => {
      throw new Error("Storage blocked");
    });

    render(<CookieConsent />);
    leaveFirstScreen();
    fireEvent.click(screen.getByText("Got it"));
    expect(screen.queryByText("Got it")).not.toBeInTheDocument();
  });
});
