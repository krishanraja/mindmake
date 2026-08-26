import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  BRIEF_BLOB_REVOKE_DELAY_MS,
  COMPANY_READ_TIMEOUT_MS,
  LeadBrief,
} from "@/components/mindmake/LeadBrief";
import { NEWSLETTER_CONSENT_WORDING_VERSION } from "@/components/mindmake/leadDelivery";

const { invoke } = vi.hoisted(() => ({ invoke: vi.fn() }));

vi.mock("@/integrations/supabase/client", () => ({
  supabase: { functions: { invoke } },
}));

const dossier = {
  identity: { name: "Example Company" },
  understanding: { descriptor: "A useful business.", products: ["A clear offer"] },
  synthesis: "Example Company helps teams do useful work.",
};

const confirmedResponse = (overrides: Record<string, unknown> = {}) => ({
  version: 2,
  success: true,
  status: "confirmed",
  leadId: "lead-1",
  visitorDelivery: "queued" as const,
  operatorDelivery: "queued" as const,
  publicationInterestRecorded: false,
  ...overrides,
});

const verificationResponse = (requestId: string) => ({
  version: 2,
  success: true,
  status: "verification_required",
  requestId,
});

function mockWorkingV2Flow(finalResponse = confirmedResponse()) {
  invoke.mockImplementation((name: string, options?: { body?: Record<string, unknown> }) => {
    if (name === "enrich-company") return Promise.resolve({ data: dossier, error: null });
    if (options?.body?.action === "request") {
      return Promise.resolve({ data: verificationResponse(String(options.body.requestId)), error: null });
    }
    if (options?.body?.action === "confirm") return Promise.resolve({ data: finalResponse, error: null });
    return Promise.resolve({ data: null, error: new Error("unexpected-call") });
  });
}

function ReopenHarness() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open brief</button>
      <LeadBrief open={open} onClose={() => setOpen(false)} />
    </>
  );
}

async function reachPreview(domain = "example.com") {
  fireEvent.change(screen.getByLabelText("Company website"), { target: { value: domain } });
  fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
  await screen.findByRole("heading", { name: "This is what I can see so far." });
  fireEvent.click(screen.getByRole("button", { name: "Customers can now do more without us" }));
  fireEvent.click(screen.getByRole("button", { name: /use this problem/i }));
  fireEvent.click(screen.getByRole("button", { name: "Grow this business" }));
  fireEvent.click(screen.getByRole("button", { name: /show me the recommendation/i }));
  await screen.findByRole("heading", { name: "Customers can now do more without us." });
}

async function reachContact(domain = "example.com") {
  await reachPreview(domain);
  fireEvent.click(screen.getByRole("button", { name: /keep the private brief/i }));
  await screen.findByLabelText("Work email");
}

async function requestCode({ email = "leader@example.com", publication = false } = {}) {
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: email } });
  if (publication) fireEvent.click(screen.getByRole("checkbox", { name: /useful ideas by email/i }));
  fireEvent.click(screen.getByRole("button", { name: /send the code/i }));
  await screen.findByLabelText("Six-digit code");
}

async function confirmCode(code = "123456") {
  fireEvent.change(screen.getByLabelText("Six-digit code"), { target: { value: code } });
  fireEvent.click(screen.getByRole("button", { name: /send my private brief/i }));
}

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe("Mindmake private brief journey", () => {
  it("keeps touch focus on the step heading and follows the visible keyboard viewport", async () => {
    const viewportState = { height: 480 };
    const viewportListeners = new Map<string, Set<EventListener>>();
    const visualViewport = {
      get height() { return viewportState.height; },
      width: 390,
      offsetTop: 24,
      offsetLeft: 0,
      addEventListener: vi.fn((type: string, listener: EventListener) => {
        const listeners = viewportListeners.get(type) ?? new Set<EventListener>();
        listeners.add(listener);
        viewportListeners.set(type, listeners);
      }),
      removeEventListener: vi.fn((type: string, listener: EventListener) => {
        viewportListeners.get(type)?.delete(listener);
      }),
    } as unknown as VisualViewport;
    const scrollIntoView = vi.fn();
    const originalScrollIntoView = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "scrollIntoView");

    vi.stubGlobal("visualViewport", visualViewport);
    vi.stubGlobal("matchMedia", vi.fn((query: string) => ({
      matches: query === "(pointer: coarse)",
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(() => true),
    })));
    Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
      configurable: true,
      value: scrollIntoView,
    });

    try {
      render(<LeadBrief open onClose={() => undefined} />);
      const heading = screen.getByRole("heading", { name: "Show me the business." });
      const field = screen.getByLabelText("Company website");
      const backdrop = screen.getByRole("dialog").parentElement as HTMLElement;
      await waitFor(() => expect(heading).toHaveFocus());
      expect(field).not.toHaveFocus();
      expect(backdrop.style.getPropertyValue("--mm-brief-viewport-height")).toBe("480px");
      expect(backdrop.style.getPropertyValue("--mm-brief-viewport-top")).toBe("24px");

      field.focus();
      act(() => {
        viewportState.height = 300;
        viewportListeners.get("resize")?.forEach((listener) => listener(new Event("resize")));
      });

      await waitFor(() => expect(scrollIntoView).toHaveBeenCalledWith({ block: "center", inline: "nearest" }));
      expect(backdrop.style.getPropertyValue("--mm-brief-viewport-height")).toBe("300px");
      expect(Number.parseInt(backdrop.style.getPropertyValue("--mm-brief-keyboard-inset"), 10)).toBeGreaterThan(0);
      expect(visualViewport.addEventListener).toHaveBeenCalledWith("resize", expect.any(Function));
    } finally {
      if (originalScrollIntoView) {
        Object.defineProperty(HTMLElement.prototype, "scrollIntoView", originalScrollIntoView);
      } else {
        delete (HTMLElement.prototype as Partial<HTMLElement>).scrollIntoView;
      }
    }
  });

  it("stays download-only by default and never asks for email or invokes a hand-off", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({ data: dossier, error: null });

    render(<LeadBrief open onClose={() => undefined} />);
    expect(screen.getByRole("link", { name: /how the starting read handles information/i })).toHaveAttribute("href", "/privacy");
    await reachPreview();
    fireEvent.click(screen.getByRole("button", { name: /keep the private brief/i }));

    expect(await screen.findByRole("heading", { name: "Keep this. Your brief is ready." })).toBeInTheDocument();
    expect(screen.getByText("Download it now. Nothing has been sent to Krish, and no email has been sent.")).toBeInTheDocument();
    expect(screen.queryByLabelText("Work email")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /download my brief/i })).toBeEnabled();
    expect(invoke.mock.calls.map(([name]) => name)).toEqual(["enrich-company"]);
  });

  it("starts a fresh private journey after the modal closes", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow();

    render(<ReopenHarness />);
    await reachContact();
    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "leader@example.com" } });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: "Close" }));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Open brief" }));
    expect(await screen.findByLabelText("Company website")).toHaveValue("");
    await reachContact("fresh.example.com");
    expect(screen.getByLabelText("Work email")).toHaveValue("");
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("moves focus through verification and links form errors to their fields", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    let finishCompanyRead: ((value: { data: typeof dossier; error: null }) => void) | undefined;
    invoke.mockImplementation((name: string, options?: { body?: Record<string, unknown> }) => {
      if (name === "enrich-company") return new Promise((resolve) => { finishCompanyRead = resolve; });
      if (options?.body?.action === "request") {
        return Promise.resolve({ data: verificationResponse(String(options.body.requestId)), error: null });
      }
      return Promise.resolve({ data: confirmedResponse(), error: null });
    });

    render(<LeadBrief open onClose={() => undefined} />);
    const domainField = screen.getByLabelText("Company website");
    await waitFor(() => expect(domainField).toHaveFocus());
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
    expect(domainField).toHaveAttribute("aria-invalid", "true");
    expect(domainField).toHaveAttribute("aria-describedby", "mm-company-domain-error");

    fireEvent.change(domainField, { target: { value: "https://www.example.com/pricing" } });
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
    await screen.findByRole("heading", { name: "Reading example.com." });
    await act(async () => finishCompanyRead?.({ data: dossier, error: null }));
    await screen.findByRole("heading", { name: "This is what I can see so far." });
    fireEvent.click(screen.getByRole("button", { name: "Customers can now do more without us" }));
    fireEvent.click(screen.getByRole("button", { name: /use this problem/i }));
    fireEvent.click(screen.getByRole("button", { name: "Grow this business" }));
    fireEvent.click(screen.getByRole("button", { name: /show me the recommendation/i }));
    fireEvent.click(await screen.findByRole("button", { name: /keep the private brief/i }));

    const emailField = await screen.findByLabelText("Work email");
    await waitFor(() => expect(emailField).toHaveFocus());
    fireEvent.click(screen.getByRole("button", { name: /send the code/i }));
    expect(emailField).toHaveAttribute("aria-invalid", "true");
    expect(emailField).toHaveAttribute("aria-describedby", "mm-work-email-error");

    fireEvent.change(emailField, { target: { value: "leader@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send the code/i }));
    const codeField = await screen.findByLabelText("Six-digit code");
    await waitFor(() => expect(codeField).toHaveFocus());
    fireEvent.click(screen.getByRole("button", { name: /send my private brief/i }));
    expect(codeField).toHaveAttribute("aria-invalid", "true");
    expect(codeField).toHaveAttribute("aria-describedby", "mm-verification-code-error");

    fireEvent.change(codeField, { target: { value: "123456" } });
    fireEvent.click(screen.getByRole("button", { name: /send my private brief/i }));
    const successHeading = await screen.findByRole("heading", { name: "Your brief is on its way. Krish's copy was queued too." });
    await waitFor(() => expect(successHeading).toHaveFocus());
  });

  it("times out a slow company read, keeps the visitor moving and allows a retry", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    vi.useFakeTimers();
    invoke.mockImplementationOnce(() => new Promise(() => undefined)).mockResolvedValueOnce({ data: dossier, error: null });

    render(<LeadBrief open onClose={() => undefined} />);
    fireEvent.change(screen.getByLabelText("Company website"), { target: { value: "example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
    await act(async () => { await Promise.resolve(); });
    expect(invoke).toHaveBeenCalledWith("enrich-company", expect.objectContaining({
      timeout: COMPANY_READ_TIMEOUT_MS,
      signal: expect.any(AbortSignal),
    }));

    await act(async () => {
      vi.advanceTimersByTime(COMPANY_READ_TIMEOUT_MS);
      await Promise.resolve();
    });
    expect(screen.getByText(/live read took too long/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Try the live read again" }));
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText("Example Company")).toBeInTheDocument();
  });

  it("sends only the exact V2 identifiers, creates a fresh resend and confirms its code", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ publicationInterestRecorded: true }));

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await reachContact();
    await requestCode({ publication: true });
    fireEvent.click(screen.getByRole("button", { name: /send a new code/i }));
    await waitFor(() => {
      expect(invoke.mock.calls.filter(([name, options]) => name === "submit-mindmake-brief" && options.body.action === "request")).toHaveLength(2);
    });
    await confirmCode();
    await screen.findByRole("heading", { name: "Your brief is on its way. Krish's copy was queued too." });

    const handoffCalls = invoke.mock.calls.filter(([name]) => name === "submit-mindmake-brief");
    const requestCalls = handoffCalls.filter(([, options]) => options.body.action === "request");
    const confirmCall = handoffCalls.find(([, options]) => options.body.action === "confirm");
    expect(requestCalls).toHaveLength(2);
    expect(requestCalls[0][1].body).toEqual({
      version: 2,
      action: "request",
      requestId: expect.any(String),
      contact: { email: "leader@example.com" },
      company: { domain: "example.com" },
      choices: {
        pressureId: "customers-can-do-more-without-us",
        returnedTimeId: "grow-this-business",
        entryRoute: "gtm",
      },
      consent: {
        publicationRequested: true,
        wordingVersion: NEWSLETTER_CONSENT_WORDING_VERSION,
      },
      website: "",
    });
    expect(requestCalls[1][1].body.requestId).not.toBe(requestCalls[0][1].body.requestId);
    expect(confirmCall?.[1].body).toEqual({
      version: 2,
      action: "confirm",
      requestId: requestCalls[1][1].body.requestId,
      contact: { email: "leader@example.com" },
      code: "123456",
    });
    expect(JSON.stringify(requestCalls[0][1].body)).not.toMatch(/recommendation|known|evidence|carry|human|proof|returnedTimeValue|companyName/i);
    expect(invoke.mock.calls.some(([name]) => name === "send-contact-email")).toBe(false);
  });

  it("starts a fresh request when the visitor goes back to change their email", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow();

    render(<LeadBrief open onClose={() => undefined} />);
    await reachContact();
    await requestCode();

    const firstRequest = invoke.mock.calls.find(
      ([name, options]) => name === "submit-mindmake-brief" && options.body.action === "request",
    );
    fireEvent.click(screen.getByRole("button", { name: /change email/i }));
    fireEvent.change(screen.getByLabelText("Work email"), { target: { value: "second@example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /send the code/i }));
    await screen.findByLabelText("Six-digit code");

    const requestCalls = invoke.mock.calls.filter(
      ([name, options]) => name === "submit-mindmake-brief" && options.body.action === "request",
    );
    expect(requestCalls).toHaveLength(2);
    expect(requestCalls[1][1].body.requestId).not.toBe(firstRequest?.[1].body.requestId);
    expect(requestCalls[1][1].body.contact).toEqual({ email: "second@example.com" });
  });

  it("creates a usable request ID when randomUUID is unavailable", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    vi.stubGlobal("crypto", {
      getRandomValues: (values: Uint32Array) => {
        values.set([1, 2, 3, 4]);
        return values;
      },
    });
    mockWorkingV2Flow();

    render(<LeadBrief open onClose={() => undefined} />);
    await reachContact();
    await requestCode();
    const requestCall = invoke.mock.calls.find(([name, options]) => name === "submit-mindmake-brief" && options.body.action === "request");
    expect(requestCall?.[1].body.requestId).toMatch(/^mindmake-[a-z0-9]+-1234$/);
  });

  it("only claims the delivery outcomes confirmed after verification", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ operatorDelivery: "failed" }));

    render(<LeadBrief open onClose={() => undefined} />);
    await reachContact();
    await requestCode();
    await confirmCode();
    expect(await screen.findByRole("heading", { name: "Your brief is on its way." })).toBeInTheDocument();
    expect(screen.getByText(/Krish was not given the context/i)).toBeInTheDocument();
    expect(screen.queryByText(/Krish's copy was queued/i)).not.toBeInTheDocument();
  });

  it("rejects a publication interest the visitor did not request", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ publicationInterestRecorded: true }));

    render(<LeadBrief open onClose={() => undefined} />);
    await reachContact();
    await requestCode();
    await confirmCode();
    expect(await screen.findByText(/publication choice you did not make/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Keep this. Your brief is still ready." })).toBeInTheDocument();
    expect(screen.queryByText(/Krish's copy was queued/i)).not.toBeInTheDocument();
  });

  it("keeps publication interest separate and never calls it a subscription", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ publicationInterestRecorded: false }));

    render(<LeadBrief open onClose={() => undefined} />);
    await reachContact();
    expect(screen.getByRole("checkbox", { name: /useful ideas by email/i })).not.toBeChecked();
    await requestCode({ publication: true });
    await confirmCode();
    expect(await screen.findByRole("heading", { name: "Your brief is on its way. Krish's copy was queued too." })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Your publication interest was not recorded. You have not been added to any list.");
    expect(screen.queryByText(/you are subscribed|you were added to|added to the publication/i)).not.toBeInTheDocument();
  });

  it("fails closed when verification succeeds but neither delivery is queued", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ visitorDelivery: "failed", operatorDelivery: "failed" }));

    render(<LeadBrief open onClose={() => undefined} />);
    await reachContact();
    await requestCode();
    await confirmCode();
    expect(await screen.findByRole("heading", { name: "Keep this. Your brief is still ready." })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(/neither hand-off was confirmed/i);
    expect(screen.getByRole("link", { name: /email krish directly/i })).toHaveAttribute("href", expect.stringContaining("mailto:krish@themindmaker.ai"));
    expect(screen.queryByText(/email was queued|Krish's copy was queued/i)).not.toBeInTheDocument();
  });

  it("normalises an array-shaped company read instead of showing comma-separated text", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({
      data: { ...dossier, synthesis: ["Example Company", "helps teams", "do useful work."] },
      error: null,
    });
    render(<LeadBrief open onClose={() => undefined} />);
    fireEvent.change(screen.getByLabelText("Company website"), { target: { value: "example.com" } });
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
    expect(await screen.findByText("Example Company helps teams do useful work.")).toBeInTheDocument();
    expect(screen.queryByText(/Example Company,helps teams,do useful work/)).not.toBeInTheDocument();
  });

  it("repairs a pathologically comma-separated live company read without changing ordinary prose", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({
      data: {
        ...dossier,
        synthesis: "You're, the, BBC, a, public, broadcaster, reaching, people, across, TV, radio, and, digital, platforms., Tell, me, if, this, is, wrong.",
      },
      error: null,
    });
    render(<LeadBrief open onClose={() => undefined} />);
    fireEvent.change(screen.getByLabelText("Company website"), { target: { value: "bbc.com" } });
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));

    expect(await screen.findByText("You're the BBC a public broadcaster reaching people across TV radio and digital platforms. Tell me if this is wrong.")).toBeInTheDocument();
    expect(screen.queryByText(/You're, the, BBC/)).not.toBeInTheDocument();
  });

  it("waits before revoking a downloaded brief URL", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({ data: dossier, error: null });
    render(<LeadBrief open onClose={() => undefined} />);
    await reachPreview();
    fireEvent.click(screen.getByRole("button", { name: /keep the private brief/i }));
    await screen.findByRole("heading", { name: "Keep this. Your brief is ready." });

    const createObjectURL = vi.fn(() => "blob:mindmake-brief");
    const revokeObjectURL = vi.fn();
    class TestURL extends URL {}
    Object.defineProperties(TestURL, {
      createObjectURL: { value: createObjectURL },
      revokeObjectURL: { value: revokeObjectURL },
    });
    vi.stubGlobal("URL", TestURL);
    vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => undefined);
    vi.useFakeTimers();

    fireEvent.click(screen.getByRole("button", { name: /download my brief/i }));
    expect(createObjectURL).toHaveBeenCalledOnce();
    expect(revokeObjectURL).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(BRIEF_BLOB_REVOKE_DELAY_MS - 1));
    expect(revokeObjectURL).not.toHaveBeenCalled();
    act(() => vi.advanceTimersByTime(1));
    expect(revokeObjectURL).toHaveBeenCalledWith("blob:mindmake-brief");
  });
});
