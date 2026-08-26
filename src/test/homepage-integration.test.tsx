import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Index from "@/pages/Index";
import AiBrain from "@/pages/AiBrain";

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}{location.hash}</output>;
}

function HistoryBackProbe() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate(-1)}>Browser back</button>;
}

function renderHomepage(entry = "/") {
  return render(
    <MemoryRouter initialEntries={[entry]}>
      <Routes>
        <Route path="/" element={<><Index /><LocationProbe /><HistoryBackProbe /></>} />
      </Routes>
    </MemoryRouter>,
  );
}

function renderAiBrain() {
  return render(
    <MemoryRouter initialEntries={["/ai-brain"]}>
      <Routes>
        <Route path="/ai-brain" element={<AiBrain />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
  vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Mindmake homepage integration", () => {
  it("preserves the approved first act and every lower homepage section once", () => {
    const { container } = renderHomepage();

    expect(screen.getByRole("heading", { name: "Put your best judgement to work with AI." })).toBeInTheDocument();
    expect(screen.getByText("Pick your starting point")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Encode Your Vision Define How You Sell" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Build Your AI Brain Decide faster. Lead with confidence." })).toHaveAttribute("href", "/ai-brain");
    expect(screen.getByRole("link", { name: "Build Your AI GTM Product, price, message or team." })).toHaveAttribute("href", "/ai-gtm");
    expect(screen.getByRole("heading", { name: "Decisions that moved the business." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "The decision and the build belong together." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Testimonials" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Useful ideas by email." })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Make it clearer. Build what helps. Keep it." })).toBeInTheDocument();

    ["work", "judgement-thread", "paths", "proof", "results", "about"].forEach((id) => {
      expect(container.querySelectorAll(`#${id}`)).toHaveLength(1);
    });

    const ids = [...container.querySelectorAll<HTMLElement>("[id]")].map((element) => element.id);
    expect(ids.filter((id, index) => ids.indexOf(id) !== index)).toEqual([]);
    expect(container.querySelectorAll(".mm-kicker")).toHaveLength(0);
    expect(container.querySelectorAll(".mm-quote-deck")).toHaveLength(1);
    expect(screen.getAllByText(/Ashley Wales-Brown/)).toHaveLength(1);
  });

  it("keeps the private brief and the URL in sync", async () => {
    renderHomepage("/?start=1");

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByTestId("location")).toHaveTextContent("/?start=1");

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);

    fireEvent.click(screen.getAllByRole("button", { name: /^start here$/i })[0]);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent("/?start=1");
    expect(screen.getAllByRole("dialog")).toHaveLength(1);

    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("pushes the brief into history so browser Back dismisses it", async () => {
    renderHomepage();

    fireEvent.click(screen.getAllByRole("button", { name: /^start here$/i })[0]);
    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent("/?start=1");

    fireEvent.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent(/^\/$/);
  });

  it("keeps keyboard focus inside the open mobile navigation", async () => {
    renderHomepage();

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menuButton);

    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    const lastControl = within(mobileNavigation).getByRole("link", { name: "Media" });

    await waitFor(() => {
      expect(within(mobileNavigation).getByRole("link", { name: "How I help" })).toHaveFocus();
    });

    lastControl.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(menuButton).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(lastControl).toHaveFocus();
  });

  it("returns focus to the visible menu trigger after a mobile Start here journey", async () => {
    renderAiBrain();

    const menuButton = screen.getByRole("button", { name: "Open navigation" });
    fireEvent.click(menuButton);
    const mobileNavigation = screen.getByRole("navigation", { name: "Mobile navigation" });
    const mobileStart = within(mobileNavigation).getByRole("button", { name: "Start here" });
    fireEvent.click(mobileStart);

    await waitFor(() => expect(screen.getByRole("dialog")).toBeInTheDocument());
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(menuButton).toHaveFocus();
  });
});
