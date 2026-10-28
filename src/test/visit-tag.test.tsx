import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ToStart } from "@/App";
import { dropVisitTag } from "@/lib/visitTag";
import { trackBrief } from "@/lib/analytics";

/* The head script that holds a growth placement's tag, run against a given
   arrival address with its own queue and window, exactly as index.html has it. */
const head = readFileSync(resolve(__dirname, "../../index.html"), "utf8");
const tagScript = (() => {
  const start = head.indexOf("<script>", head.indexOf("<!-- Google tag")) + "<script>".length;
  return head.slice(start, head.indexOf("</script>", start));
})();

function arrive(search: string, stored: string | null = null) {
  const appended: string[] = [];
  const win: Record<string, unknown> = { location: { search } };
  const doc = {
    createElement: () => ({}),
    head: { appendChild: (node: { src?: string }) => appended.push(String(node.src)) },
  };
  const storage = { getItem: () => stored };
  new Function("window", "document", "localStorage", "dataLayer", `var dataLayer; ${tagScript.replace(/window\.dataLayer = window\.dataLayer \|\| \[\];/, "window.dataLayer = window.dataLayer || []; dataLayer = window.dataLayer;")}`)(win, doc, storage, undefined);
  const layer = (win.dataLayer as ArrayLike<unknown>[]).map((command) => Array.from(command));
  return { win, layer, appended };
}

describe("a growth placement's tag", () => {
  afterEach(() => {
    delete window.mmVisitTag;
    delete window.dataLayer;
  });

  it("is held in page memory and queued before the config, and nothing is requested before Allow", () => {
    const { win, layer, appended } = arrive("?utm_source=growth-podcast&utm_medium=referral&utm_campaign=ignored&start=1");
    expect(win.mmVisitTag).toEqual({ campaign_source: "growth-podcast", campaign_medium: "referral" });
    const set = layer.findIndex((command) => command[0] === "set");
    const config = layer.findIndex((command) => command[0] === "config");
    expect(set).toBeGreaterThan(-1);
    expect(set).toBeLessThan(config);
    expect(layer[set][1]).toEqual({ campaign_source: "growth-podcast", campaign_medium: "referral" });
    expect(JSON.stringify(layer)).not.toContain("ignored");
    expect(appended).toEqual([]);
  });

  it("keeps the engine's shape for any growth path, and nothing else", () => {
    expect(arrive("?utm_source=growth-guest-seat&utm_medium=referral").win.mmVisitTag)
      .toEqual({ campaign_source: "growth-guest-seat", campaign_medium: "referral" });
    for (const search of [
      "",
      "?utm_source=growth-podcast",
      "?utm_source=growth-podcast&utm_medium=email",
      "?utm_source=newsletter&utm_medium=referral",
      "?utm_source=growth-&utm_medium=referral",
      "?utm_source=growth-Podcast&utm_medium=referral",
      "?utm_source=growth-pod_cast&utm_medium=referral",
      "?utm_source=growth-ada%40example.com&utm_medium=referral",
      `?utm_source=growth-${"a".repeat(40)}&utm_medium=referral`,
    ]) {
      const { win, layer } = arrive(search);
      expect(win.mmVisitTag, search).toBeNull();
      expect(layer.some((command) => command[0] === "set"), search).toBe(false);
    }
  });

  it("is sent only when the tag loads: a stored yes loads it, no answer does not", () => {
    expect(arrive("?utm_source=growth-podcast&utm_medium=referral").appended).toEqual([]);
    expect(arrive("?utm_source=growth-podcast&utm_medium=referral", "essential").appended).toEqual([]);
    expect(arrive("?utm_source=growth-podcast&utm_medium=referral", "analytics").appended[0]).toContain("googletagmanager.com/gtag/js");
  });

  it("is dropped from page memory and from the queue on Decline", () => {
    const tag = { campaign_source: "growth-podcast", campaign_medium: "referral" as const };
    const config = ["config", "G-TEST"];
    window.mmVisitTag = tag;
    window.dataLayer = [["consent", "default"], ["set", tag], config];
    dropVisitTag();
    expect(window.mmVisitTag).toBeNull();
    expect(window.dataLayer).toEqual([["consent", "default"], config]);
  });

  it("is never written to the device", () => {
    expect(tagScript).not.toMatch(/sessionStorage|setItem|document\.cookie/);
    expect(readFileSync(resolve(__dirname, "../lib/visitTag.ts"), "utf8")).not.toMatch(/sessionStorage|localStorage|document\.cookie/);
  });
});

describe("/start inside the app", () => {
  const Landed = () => {
    const { pathname, search } = useLocation();
    return <p>{`${pathname}${search}`}</p>;
  };

  it("keeps the query string, as the edge redirect does", () => {
    render(
      <MemoryRouter initialEntries={["/start?utm_source=growth-podcast&utm_medium=referral&utm_campaign=x"]}>
        <Routes>
          <Route path="/start" element={<ToStart />} />
          <Route path="/" element={<Landed />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("/?utm_source=growth-podcast&utm_medium=referral&utm_campaign=x&start=1")).toBeInTheDocument();
  });

  it("still opens the brief from a bare /start", () => {
    render(
      <MemoryRouter initialEntries={["/start"]}>
        <Routes>
          <Route path="/start" element={<ToStart />} />
          <Route path="/" element={<Landed />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("/?start=1")).toBeInTheDocument();
  });
});

describe("trackBrief", () => {
  afterEach(() => {
    delete window.gtag;
    delete window.mmGoogleTagLoaded;
  });

  it("sends only after Allow and only the fixed names", () => {
    const gtag = vi.fn();
    window.gtag = gtag;
    trackBrief("brief_open", "gtm");
    expect(gtag).not.toHaveBeenCalled();
    window.mmGoogleTagLoaded = true;
    trackBrief("brief_open", "gtm");
    trackBrief("brief_step", "brain", "preview");
    trackBrief("brief_step", "brain", "ada@example.com");
    trackBrief("brief_submit", "somewhere");
    expect(gtag.mock.calls).toEqual([
      ["event", "brief_open", { brief_route: "gtm" }],
      ["event", "brief_step", { brief_route: "brain", brief_step: "preview" }],
    ]);
  });
});
