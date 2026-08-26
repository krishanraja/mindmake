import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RouteRail } from "@/components/mindmake/RouteRail";

describe("RouteRail", () => {
  it("keeps the final card active when browser rounding stops just short of the scroll end", async () => {
    render(
      <RouteRail className="test-track" label="Customer outcomes">
        <article>One</article>
        <article>Two</article>
        <article>Three</article>
      </RouteRail>,
    );

    const track = screen.getByRole("region", { name: "Customer outcomes" });
    Object.defineProperties(track, {
      clientWidth: { configurable: true, value: 300 },
      scrollWidth: { configurable: true, value: 660 },
      scrollLeft: { configurable: true, writable: true, value: 359 },
    });

    fireEvent.scroll(track);

    await waitFor(() => expect(screen.getByText("03 / 03")).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Next item in Customer outcomes" })).toBeDisabled();
  });
});
