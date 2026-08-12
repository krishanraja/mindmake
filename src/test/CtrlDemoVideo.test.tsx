import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CtrlDemoVideo } from "@/components/CtrlDemoVideo";

describe("CtrlDemoVideo", () => {
  it("uses the approved MP4 and exposes an accurate playback control", () => {
    render(<CtrlDemoVideo />);

    const video = screen.getByLabelText("A redacted view of CTRL by Mindmaker");
    const source = video.querySelector("source");

    expect(source).toHaveAttribute("src", "/CTRL-demo-aug-26.mp4");
    expect(source).toHaveAttribute("type", "video/mp4");

    fireEvent.canPlay(video);
    expect(screen.getByRole("button", { name: "Play CTRL demo" })).toBeInTheDocument();

    fireEvent.play(video);
    expect(screen.getByRole("button", { name: "Pause CTRL demo" })).toBeInTheDocument();

    fireEvent.pause(video);
    expect(screen.getByRole("button", { name: "Play CTRL demo" })).toBeInTheDocument();
  });

  it("replaces a failed video with a clear fallback", () => {
    render(<CtrlDemoVideo />);

    fireEvent.error(screen.getByLabelText("A redacted view of CTRL by Mindmaker"));

    expect(screen.getByText("The demo could not load.")).toBeInTheDocument();
    expect(screen.queryByLabelText("A redacted view of CTRL by Mindmaker")).not.toBeInTheDocument();
  });
});
