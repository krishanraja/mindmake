import { readFileSync } from "node:fs";
import { resolve } from "node:path";
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

/* Every journey test below names a door, because from 1 September 2026 the
   dialog opened without one asks which before anything else, and the journey
   these cases drive starts at the four details. `gtm` rather than `brain`
   because the pressure these cases pick, "Customers can now do more without
   us", belongs to that door's four; the brain door asks about a leader's own
   week instead. The door step has its own cases at the foot of this file. */
function ReopenHarness() {
  const [open, setOpen] = useState(true);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Open brief</button>
      <LeadBrief open={open} onClose={() => setOpen(false)} route="gtm" />
    </>
  );
}

/* The first step is the four details now, not a website field.
   It was `Company website`, which is the ask this dialog carried while both
   door panels asked for four details and said there was nothing to look up.
   The step being driven here is the same step: give the dialog what it needs to
   read the company. The domain is derived from the work email rather than
   typed, so the test supplies an address at the domain it wants read. */
async function fillDetails(domain = "example.com") {
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Ada" } });
  fireEvent.change(screen.getByLabelText("Last name"), { target: { value: "Lovelace" } });
  fireEvent.change(screen.getByLabelText("Work email"), { target: { value: `ada@${domain}` } });
  fireEvent.click(screen.getByRole("button", { name: "Leadership" }));
}

async function reachPreview(domain = "example.com") {
  await fillDetails(domain);
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
      render(<LeadBrief open onClose={() => undefined} route="gtm" />);
      const heading = screen.getByRole("heading", { name: "Show me the business." });
      const field = screen.getByLabelText("First name");
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

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    expect(screen.getByRole("link", { name: /how the starting read handles information/i })).toHaveAttribute("href", "/privacy");
    await reachPreview();
    fireEvent.click(screen.getByRole("button", { name: /keep the private brief/i }));

    expect(await screen.findByRole("heading", { name: "Keep this. Your brief is ready." })).toBeInTheDocument();
    expect(screen.getByText("Download it now. Nothing has been sent to us, and no email has been sent.")).toBeInTheDocument();
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
    expect(await screen.findByLabelText("First name")).toHaveValue("");
    await reachContact("fresh.example.com");
    /* Carried, not asked again. The contact step used to open on an empty
       address because the dialog had not asked for one; it asks for the work
       email in the first step now, and this is the promise `initialEmail`
       already made on the seeded path from /ai-gtm: nobody types it twice.
       What must still be fresh is the journey, which the line above checks. */
    expect(screen.getByLabelText("Work email")).toHaveValue("ada@fresh.example.com");
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

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    const nameField = screen.getByLabelText("First name");
    /* The heading takes focus here, not the first field, which is what every
       step of this dialog does except the two that ask for one thing. The
       website field was the exception because it was the one thing; four
       details are a form, and dropping a reader straight into "First name"
       skips the sentence saying what the four are for. */
    await waitFor(() => expect(screen.getByRole("heading", { name: "Show me the business." })).toHaveFocus());
    expect(nameField).not.toHaveFocus();
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
    /* The first step is the shared four-detail capture now. It announced its
       error beside the form and left the field unmarked, which is a weaker
       thing than the website field it replaced did: `role="alert"` reaches a
       reader once, when it appears, and `aria-describedby` is what they get on
       landing back at the field to fix it. Both door pages use this component,
       so linking the error there fixed all three surfaces at once. */
    expect(nameField).toHaveAttribute("aria-invalid", "true");
    const nameErrorId = nameField.getAttribute("aria-describedby");
    expect(nameErrorId).toBeTruthy();
    expect(document.getElementById(nameErrorId as string)).toHaveTextContent(/We need your name/);

    await fillDetails("example.com");
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
    /* Cleared first, because this step now arrives carrying the address from
       the details. Emptying it is the real path somebody takes to change it,
       and it is the only way left to reach the error this line is about. */
    fireEvent.change(emailField, { target: { value: "" } });
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
    const successHeading = await screen.findByRole("heading", { name: "Your brief is on its way. Our copy was queued too." });
    await waitFor(() => expect(successHeading).toHaveFocus());
  });

  it("times out a slow company read, keeps the visitor moving and allows a retry", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    vi.useFakeTimers();
    invoke.mockImplementationOnce(() => new Promise(() => undefined)).mockResolvedValueOnce({ data: dossier, error: null });

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await fillDetails("example.com");
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
    expect(screen.getByText(/still thinking about it/i)).toBeInTheDocument();
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
    await screen.findByRole("heading", { name: "Your brief is on its way. Our copy was queued too." });

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

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
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

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await reachContact();
    await requestCode();
    const requestCall = invoke.mock.calls.find(([name, options]) => name === "submit-mindmake-brief" && options.body.action === "request");
    expect(requestCall?.[1].body.requestId).toMatch(/^mindmake-[a-z0-9]+-1234$/);
  });

  it("only claims the delivery outcomes confirmed after verification", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ operatorDelivery: "failed" }));

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await reachContact();
    await requestCode();
    await confirmCode();
    expect(await screen.findByRole("heading", { name: "Your brief is on its way." })).toBeInTheDocument();
    expect(screen.getByText(/We were not given the context/i)).toBeInTheDocument();
    expect(screen.queryByText(/our copy was queued/i)).not.toBeInTheDocument();
  });

  it("rejects a publication interest the visitor did not request", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ publicationInterestRecorded: true }));

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await reachContact();
    await requestCode();
    await confirmCode();
    expect(await screen.findByText(/publication choice you did not make/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Keep this. Your brief is still ready." })).toBeInTheDocument();
    expect(screen.queryByText(/our copy was queued/i)).not.toBeInTheDocument();
  });

  it("keeps publication interest separate and never calls it a subscription", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ publicationInterestRecorded: false }));

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await reachContact();
    expect(screen.getByRole("checkbox", { name: /useful ideas by email/i })).not.toBeChecked();
    await requestCode({ publication: true });
    await confirmCode();
    expect(await screen.findByRole("heading", { name: "Your brief is on its way. Our copy was queued too." })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Your publication interest was not recorded. You have not been added to any list.");
    expect(screen.queryByText(/you are subscribed|you were added to|added to the publication/i)).not.toBeInTheDocument();
  });

  it("fails closed when verification succeeds but neither delivery is queued", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "true");
    mockWorkingV2Flow(confirmedResponse({ visitorDelivery: "failed", operatorDelivery: "failed" }));

    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await reachContact();
    await requestCode();
    await confirmCode();
    expect(await screen.findByRole("heading", { name: "Keep this. Your brief is still ready." })).toBeInTheDocument();
    /* Two alerts now: what failed, and the offer of a person underneath it.
       The first is the one this test is about. */
    expect(screen.getAllByRole("alert")[0]).toHaveTextContent(/neither hand-off was confirmed/i);
    expect(screen.getByRole("link", { name: /email us directly/i })).toHaveAttribute("href", expect.stringContaining("mailto:krish@themindmaker.ai"));
    expect(screen.queryByText(/email was queued|our copy was queued/i)).not.toBeInTheDocument();
  });

  it("normalises an array-shaped company read instead of showing comma-separated text", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({
      data: { ...dossier, synthesis: ["Example Company", "helps teams", "do useful work."] },
      error: null,
    });
    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await fillDetails("example.com");
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));
    expect(await screen.findByText("Example Company helps teams do useful work.")).toBeInTheDocument();
    expect(screen.queryByText(/Example Company,helps teams,do useful work/)).not.toBeInTheDocument();
  });

  it("repairs a comma-separated live read and drops sentences that ask the visitor anything", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({
      data: {
        ...dossier,
        synthesis: "You're, the, BBC, a, public, broadcaster, reaching, people, across, TV, radio, and, digital, platforms., Tell, me, if, this, is, wrong.",
      },
      error: null,
    });
    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await fillDetails("bbc.com");
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));

    expect(await screen.findByText("You're the BBC a public broadcaster reaching people across TV radio and digital platforms.")).toBeInTheDocument();
    expect(screen.queryByText(/You're, the, BBC/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Tell me/)).not.toBeInTheDocument();
  });

  it("drops question and invite sentences from an otherwise ordinary company read", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({
      data: {
        ...dossier,
        synthesis: "Example Company builds useful software. Is that read fair? Let me know if I have got this wrong.",
      },
      error: null,
    });
    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    await fillDetails("example.com");
    fireEvent.click(screen.getByRole("button", { name: /read the business/i }));

    expect(await screen.findByText("Example Company builds useful software.")).toBeInTheDocument();
    expect(screen.queryByText(/Let me know/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Is that read fair/)).not.toBeInTheDocument();
  });

  it("waits before revoking a downloaded brief URL", async () => {
    vi.stubEnv("VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED", "false");
    invoke.mockResolvedValue({ data: dossier, error: null });
    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
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

/**
 * The dialog has a shape, and the stylesheet is where it lives.
 *
 * On 28 August 2026 the strip commit rewrote `mindmake.css` and took the whole
 * dialog layer with it: the backdrop, the panel geometry, the step padding, the
 * grids, the consent row, the success block and every phone rule. Nothing
 * objected. The file that stages the dialog's colours was untouched and still
 * correct, so it kept its palette while losing its shape, and it rendered
 * full-bleed and unpadded on the live site on the one surface every lead
 * passes through.
 *
 * Every test above this one passed throughout. They render markup and read it
 * back, and a stylesheet is not markup: none of them could see it, and neither
 * could a browser gate, because they all measure a page at rest and a dialog is
 * not on a page at rest. So this asserts the rules exist at all, and
 * `scripts/qa/dialog-shape-check.mjs` opens the real thing and reads its box.
 */
describe("the dialog's structure", () => {
  const css = readFileSync(resolve(__dirname, "../styles/mindmake-brief.css"), "utf8");

  it("styles every part of itself the component renders", () => {
    /* The list is taken from the class names in LeadBrief.tsx. A part the
       component renders and the stylesheet has never heard of is exactly the
       failure this is here for. */
    for (const part of [
      ".mm-dialog-open",
      ".mm-brief-backdrop",
      ".mm-brief-panel",
      ".mm-brief-top",
      ".mm-brief-path",
      ".mm-brief-step",
      ".mm-step-back",
      ".mm-text-button",
      ".mm-form-error",
      ".mm-honesty-note",
      ".mm-reading",
      ".mm-spinner",
      ".mm-company-read",
      ".mm-choice-grid",
      ".mm-capacity-grid",
      ".mm-value-preview",
      ".mm-brief-result-grid",
      ".mm-consent",
      ".mm-success",
      ".mm-success-mark",
      ".mm-success-actions",
    ]) {
      expect(css, part).toContain(`${part} `);
    }
  });

  it("makes the panel a panel rather than the page", () => {
    const panel = css.slice(css.indexOf(".mm-brief-panel {"));
    const block = panel.slice(0, panel.indexOf("}"));
    expect(block).toContain("width: min(780px, 100%)");
    expect(block).toContain("overflow-y: auto");
    expect(block).toContain("overscroll-behavior: contain");
    const backdrop = css.slice(css.indexOf(".mm-brief-backdrop {"));
    expect(backdrop.slice(0, backdrop.indexOf("}"))).toContain("position: fixed");
  });

  it("reads the measurements the component takes", () => {
    /* The dialog measures the visual viewport and the software keyboard and
       writes five custom properties onto the backdrop. For a day nothing read
       any of them, so an open keyboard on a phone pushed the field being typed
       into under the fold. */
    for (const property of [
      "--mm-brief-viewport-height",
      "--mm-brief-viewport-width",
      "--mm-brief-viewport-top",
      "--mm-brief-viewport-left",
      "--mm-brief-keyboard-inset",
    ]) {
      expect(css, property).toContain(property);
    }
  });

  it("gives a phone the screen rather than a card floating on it", () => {
    const phone = css.slice(css.indexOf("@media (max-width: 560px)"));
    expect(phone).toContain("grid-template-columns: 1fr");
    expect(phone).toContain("var(--mm-safe-bottom)");
  });
});

/**
 * The door, and why the dialog sometimes asks for it.
 *
 * `BriefRoute` is `home | brain | gtm` and each door has held its own four
 * pressure questions since the doors existed. Nothing on the homepage passed a
 * route, so every visitor who started there met `PRESSURES.default`, a generic
 * set belonging to neither door, and the difference the code was built to make
 * was never made. The homepage forks at the button now; everything that opens
 * this without a door asks here.
 */
describe("the door", () => {
  afterEach(cleanup);

  it("asks which one, when it was opened without one", () => {
    render(<LeadBrief open onClose={() => undefined} />);
    expect(screen.getByRole("heading", { name: "Which one are you here for?" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Build your AI brain/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Build your AI GTM/ })).toBeInTheDocument();
  });

  it("does not ask when the door is already known", () => {
    render(<LeadBrief open onClose={() => undefined} route="brain" />);
    expect(screen.queryByRole("heading", { name: "Which one are you here for?" })).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Show me the business." })).toBeInTheDocument();
  });

  it("shows that door's own four problems, not a generic set", async () => {
    /* The whole point of asking. The brain door asks about a leader's own week
       and the GTM door about what customers will pay for, and before this the
       homepage offered neither. */
    render(<LeadBrief open onClose={() => undefined} />);
    fireEvent.click(screen.getByRole("button", { name: /Build your AI brain/ }));
    await screen.findByRole("heading", { name: "Show me the business." });

    const source = readFileSync(resolve(__dirname, "../components/mindmake/LeadBrief.tsx"), "utf8");
    const brain = source.slice(source.indexOf("  brain: ["), source.indexOf("  gtm: ["));
    expect(brain).toContain("Too much important context lives in my head");
    expect(brain).not.toContain("Customers can now do more without us");
  });

  it("puts the door in the path, so it can be gone back to", () => {
    render(<LeadBrief open onClose={() => undefined} />);
    expect(screen.getByRole("button", { name: "Door" })).toBeInTheDocument();
  });

  it("leaves the path alone when there was no door to pick", () => {
    render(<LeadBrief open onClose={() => undefined} route="gtm" />);
    expect(screen.queryByRole("button", { name: "Door" })).not.toBeInTheDocument();
  });
});
