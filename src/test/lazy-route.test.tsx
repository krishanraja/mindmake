import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Suspense } from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { lazyRoute, ROUTE_RELOAD_KEY } from "@/lib/lazyRoute";

/* A route chunk, or one of the shared chunks it depends on, can fail to arrive
   on a flaky connection. The prerendered page was already right, so one dropped
   request must not replace it with the error boundary. */

const Page = () => <h1>The page</h1>;
const chunkError = () => new TypeError("Failed to fetch dynamically imported module");

function mount(Component: React.ComponentType) {
  return render(
    <ErrorBoundary>
      <Suspense fallback={<p>Loading</p>}>
        <Component />
      </Suspense>
    </ErrorBoundary>,
  );
}

const originalLocation = window.location;
function stubReload() {
  const reload = vi.fn();
  Object.defineProperty(window, "location", { configurable: true, value: { ...originalLocation, pathname: "/ai-brain", reload } });
  return reload;
}

afterEach(() => {
  Object.defineProperty(window, "location", { configurable: true, value: originalLocation });
  window.sessionStorage.clear();
  vi.restoreAllMocks();
});

describe("lazyRoute", () => {
  it("renders the page when the retry succeeds after one failed request", async () => {
    const importer = vi.fn()
      .mockRejectedValueOnce(chunkError())
      .mockResolvedValueOnce({ default: Page });
    mount(lazyRoute(importer, { retryDelayMs: 0 }));
    expect(await screen.findByRole("heading", { name: "The page" })).toBeInTheDocument();
    expect(importer).toHaveBeenCalledTimes(2);
  });

  it("reloads once, instead of showing the error page, when the retry fails too", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reload = stubReload();
    const importer = vi.fn().mockRejectedValue(chunkError());
    mount(lazyRoute(importer, { retryDelayMs: 0 }));
    await vi.waitFor(() => expect(reload).toHaveBeenCalledTimes(1));
    expect(window.sessionStorage.getItem(ROUTE_RELOAD_KEY)).toBe("/ai-brain");
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("reaches the error page, without a second reload, when the reload already happened", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    const reload = stubReload();
    window.sessionStorage.setItem(ROUTE_RELOAD_KEY, "/ai-brain");
    const importer = vi.fn().mockRejectedValue(chunkError());
    mount(lazyRoute(importer, { retryDelayMs: 0 }));
    expect(await screen.findByText("Something went wrong")).toBeInTheDocument();
    expect(reload).not.toHaveBeenCalled();
  });

  it("clears the reload guard once a route loads", async () => {
    window.sessionStorage.setItem(ROUTE_RELOAD_KEY, "/ai-brain");
    mount(lazyRoute(() => Promise.resolve({ default: Page }), { retryDelayMs: 0 }));
    await screen.findByRole("heading", { name: "The page" });
    expect(window.sessionStorage.getItem(ROUTE_RELOAD_KEY)).toBeNull();
  });
});
