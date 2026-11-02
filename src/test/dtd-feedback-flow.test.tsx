import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import DtdFeedback from "@/pages/DtdFeedback";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const next = () => fireEvent.click(screen.getByRole("button", { name: /^(Start|Next|Skip|Skip this one|Send feedback)$/ }));

describe("DoThinkDo feedback flow", () => {
  it("shows one screen at a time and will not move on while a starter blank is left", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    render(<MemoryRouter><DtdFeedback /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "How did it go?" })).toBeTruthy();
    next();
    expect(screen.getByRole("heading", { name: "What did you like?" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "What could we do better next time?" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Build Lab sessions" }));
    next();
    expect(screen.getByRole("heading", { name: "What did you like about the Build Lab sessions?" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "The moment it clicked for me was when …" }));
    const box = screen.getByLabelText("What did you like about the Build Lab sessions?") as HTMLTextAreaElement;
    expect(box.value).toBe("The moment it clicked for me was when ___");
    next();
    expect(screen.getByRole("alert").textContent).toContain("own words");
    expect(screen.getByRole("heading", { name: "What did you like about the Build Lab sessions?" })).toBeTruthy();

    fireEvent.change(box, { target: { value: "The moment it clicked for me was when we built the account plan live" } });
    next();
    expect(screen.getByRole("heading", { name: "What could we do better next time?" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Skip this one" })).toBeTruthy();
    next();
    expect(screen.getByRole("heading", { name: "Last bit." })).toBeTruthy();
    next();

    await waitFor(() => expect(screen.getByRole("heading", { name: "Thank you." })).toBeTruthy());
    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.liked).toEqual([{ id: "build-lab", comment: "The moment it clicked for me was when we built the account plan live" }]);
    expect(body.better).toEqual([]);
  });

  it("keeps answers when going back", () => {
    render(<MemoryRouter><DtdFeedback /></MemoryRouter>);
    next();
    fireEvent.click(screen.getByRole("button", { name: "LinkedIn lookups" }));
    next();
    fireEvent.click(screen.getByRole("button", { name: "Back" }));
    expect(screen.getByRole("button", { name: "LinkedIn lookups" }).getAttribute("aria-pressed")).toBe("true");
  });
});
