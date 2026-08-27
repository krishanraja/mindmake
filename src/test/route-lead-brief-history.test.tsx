import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import AiBrain from "@/pages/AiBrain";
import AiGtm from "@/pages/AiGtm";

vi.mock("@/components/mindmake/LeadBrief", () => ({
  LeadBrief: ({ open, onClose, route }: { open: boolean; onClose: () => void; route: string }) => open ? (
    <div role="dialog" data-entry-route={route}>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  ) : null,
}));

vi.mock("@/components/mindmake/MediaFrame", () => ({
  MediaFrame: ({ title }: { title: string }) => <div aria-label={title} />,
}));

function LocationProbe() {
  const location = useLocation();
  return <output data-testid="location">{location.pathname}{location.search}{location.hash}</output>;
}

function HistoryBackProbe() {
  const navigate = useNavigate();
  return <button type="button" onClick={() => navigate(-1)}>Browser back</button>;
}

const routes = [
  { path: "/ai-brain", entryRoute: "brain", Page: AiBrain },
  { path: "/ai-gtm", entryRoute: "gtm", Page: AiGtm },
] as const;

function renderRoute(path: string, Page: (typeof routes)[number]["Page"]) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/ai-brain" element={<><Page /><LocationProbe /><HistoryBackProbe /></>} />
        <Route path="/ai-gtm" element={<><Page /><LocationProbe /><HistoryBackProbe /></>} />
      </Routes>
    </MemoryRouter>,
  );
}

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe.each(routes)("$path private brief history", ({ path, entryRoute, Page }) => {
  it("pushes Start here into history and lets Back or Close return to the same route", async () => {
    const baseLocation = `${path}?campaign=route-test#proof`;
    renderRoute(baseLocation, Page);

    fireEvent.click(screen.getAllByRole("button", { name: "Start here" })[0]);
    const firstDialog = await screen.findByRole("dialog");
    expect(firstDialog).toHaveAttribute("data-entry-route", entryRoute);
    expect(screen.getByTestId("location")).toHaveTextContent(`${path}?campaign=route-test&start=1#proof`);

    fireEvent.click(screen.getByRole("button", { name: "Browser back" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent(baseLocation);

    fireEvent.click(screen.getAllByRole("button", { name: "Start here" })[0]);
    await screen.findByRole("dialog");
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent(baseLocation);
  });

  it("opens a deep link and removes only the start parameter on Close", async () => {
    renderRoute(`${path}?campaign=route-test&start=1&source=private#proof`, Page);

    const dialog = await screen.findByRole("dialog");
    expect(dialog).toHaveAttribute("data-entry-route", entryRoute);
    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(screen.getByTestId("location")).toHaveTextContent(`${path}?campaign=route-test&source=private#proof`);
  });
});
