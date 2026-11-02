import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import DtdFeedback from "@/pages/DtdFeedback";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const next = () => fireEvent.click(screen.getByRole("button", { name: /^(Let's go|Next|Nothing to add|Skip this part|Send to Krish)$/ }));

describe("DoThinkDo feedback flow", () => {
  it("shows one screen at a time and will not move on while a starter blank is left", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ ok: true }) });
    vi.stubGlobal("fetch", fetchMock);
    render(<MemoryRouter><DtdFeedback /></MemoryRouter>);

    expect(screen.getByRole("heading", { name: "Hi, it's Krish." })).toBeTruthy();
    next();
    expect(screen.getByRole("heading", { name: "What worked for you?" })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "What should I do differently next time?" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Build Lab sessions" }));
    next();
    expect(screen.getByRole("heading", { name: "What made the Build Lab sessions useful for you?" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "The moment it clicked for me was when …" }));
    const box = screen.getByLabelText("What made the Build Lab sessions useful for you?") as HTMLTextAreaElement;
    expect(box.value).toBe("The moment it clicked for me was when ");
    expect(box.selectionStart).toBe(box.value.length);
    next();
    expect(screen.getByRole("alert").textContent).toContain("own words");
    expect(screen.getByRole("heading", { name: "What made the Build Lab sessions useful for you?" })).toBeTruthy();

    fireEvent.change(box, { target: { value: "The moment it clicked for me was when we built the account plan live" } });
    next();
    expect(screen.getByRole("heading", { name: "What should I do differently next time?" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Skip this part" })).toBeTruthy();
    next();
    expect(screen.getByRole("heading", { name: "Last thing." })).toBeTruthy();
    next();

    await waitFor(() => expect(screen.getByRole("heading", { name: "Thank you - really." })).toBeTruthy());
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

  it("honours a Let's go tap made before the page hydrated, then stops listening", () => {
    const fn = vi.fn();
    document.addEventListener("click", fn, true);
    (window as Window & { __dtdEarly?: unknown }).__dtdEarly = { started: true, fn };
    render(<MemoryRouter><DtdFeedback /></MemoryRouter>);
    expect(screen.getByRole("heading", { name: "What worked for you?" })).toBeTruthy();
    expect((window as Window & { __dtdEarly?: unknown }).__dtdEarly).toBeUndefined();
    fireEvent.click(screen.getByRole("button", { name: "Build Lab sessions" }));
    expect(fn).not.toHaveBeenCalled();
  });

  it("joins a second starter on as a new sentence, with one gap at the end", () => {
    render(<MemoryRouter><DtdFeedback /></MemoryRouter>);
    next();
    fireEvent.click(screen.getByRole("button", { name: "Build Lab sessions" }));
    next();
    const box = screen.getByLabelText("What made the Build Lab sessions useful for you?") as HTMLTextAreaElement;
    fireEvent.click(screen.getByRole("button", { name: "The biggest change for me is …" }));
    fireEvent.change(box, { target: { value: `${box.value}speed` } });
    fireEvent.click(screen.getByRole("button", { name: "Something I still use every week is …" }));
    expect(box.value).toBe("The biggest change for me is speed. Something I still use every week is ");
    next();
    expect(screen.getByRole("alert").textContent).toContain("own words");
  });
});
