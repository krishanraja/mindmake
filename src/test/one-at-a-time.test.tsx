import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { OneAtATime } from "@/components/mindmake/OneAtATime";
import { ObjectionChips } from "@/components/mindmake/ObjectionChips";
import { ASK_ENTRIES } from "@/lib/askCorpus";

/**
 * The stack that shows one answer at a time.
 *
 * This exists because of what it replaced. The questions were a drum, `.mm-drum`
 * was `overflow: hidden`, and the drum's position is a transform written by
 * JavaScript, so with scripting off the box showed one card of eight and
 * clipped 2,308px of answers with no scrollbar and no way to reach them. Every
 * unit test passed the whole time, because every unit test rendered into a
 * jsdom that runs JavaScript.
 *
 * So the load-bearing test here is the first one: the server's own markup, with
 * nothing running, has to carry every answer and a control that opens it. The
 * rest holds the parts that make the animated version behave: one row open,
 * `aria-expanded` telling the truth once the component has taken over, and the
 * shared `name` that lets a browser run the accordion by itself.
 */

afterEach(cleanup);

const rows = [
  { id: "a", title: "First question?", body: <p>First answer.</p> },
  { id: "b", title: "Second question?", body: <p>Second answer.</p> },
  { id: "c", title: "Third question?", body: <p>Third answer.</p> },
];

describe("with nothing running", () => {
  const markup = renderToStaticMarkup(<OneAtATime rows={rows} name="test" />);

  it("carries every answer in the server's markup", () => {
    for (const row of rows) {
      expect(markup).toContain(row.title);
      expect(markup).toContain(`${row.title.split(" ")[0]} answer.`);
    }
  });

  it("opens the first row and leaves the rest openable by the browser", () => {
    /* A `<details>` with a shared name is an accordion with no script at all:
       the first is open, a tap opens any other, and the browser closes the one
       that was. Both attributes have to be in the server's output for that. */
    expect(markup.match(/<details/g)).toHaveLength(3);
    expect(markup.match(/name="test"/g)).toHaveLength(3);
    expect(markup.match(/ open/g)).toHaveLength(1);
    expect(markup).toContain("<summary");
  });

  it("puts no aria-expanded on a summary the browser is driving", () => {
    /* The element reports its own state until this component takes it over.
       Writing the attribute here would be a second answer to the same
       question, and a wrong one the moment the browser changes the first. */
    expect(markup).not.toContain("aria-expanded");
  });
});

describe("once it has taken over", () => {
  it("keeps exactly one row open and says which", () => {
    render(<OneAtATime rows={rows} name="test" />);
    const heads = screen.getAllByRole("group").map((d) => d.querySelector("summary")!);
    expect(heads.map((h) => h.getAttribute("aria-expanded"))).toEqual(["true", "false", "false"]);

    fireEvent.click(heads[2]);
    expect(heads.map((h) => h.getAttribute("aria-expanded"))).toEqual(["false", "false", "true"]);
  });

  it("drops the shared name, because it would close what it is animating", () => {
    /* Every row is left `open` so the fold has something to transition. A
       browser enforcing the group would immediately shut two of them. */
    const { container } = render(<OneAtATime rows={rows} name="test" />);
    const all = [...container.querySelectorAll("details")];
    expect(all.every((d) => d.hasAttribute("open"))).toBe(true);
    expect(all.some((d) => d.hasAttribute("name"))).toBe(false);
  });

  it("marks the rows still to come, which is what the drifting line reads from", () => {
    const { container } = render(<OneAtATime rows={rows} name="test" />);
    const ahead = () => [...container.querySelectorAll(".mm-stack-row")].map((r) => r.classList.contains("is-ahead"));
    expect(ahead()).toEqual([false, true, true]);
    fireEvent.click(container.querySelectorAll("summary")[1]);
    expect(ahead()).toEqual([false, false, true]);
  });

  it("numbers the rows inside the control, which the eyebrow ban allows", () => {
    /* A number above a heading is an eyebrow. A number inside the control it
       labels names that control, which is the carve-out the ban keeps open. */
    const { container } = render(<OneAtATime rows={rows} name="test" />);
    const first = container.querySelector("summary")!;
    expect(first.querySelector(".mm-stack-n")?.textContent).toBe("01");
    expect(first.querySelector("h3")?.textContent).toBe("First question?");
  });
});

describe("the questions section", () => {
  it("asks the corpus and answers from it, with nothing running", () => {
    const ask = ["consultant", "chatgpt", "included"];
    const markup = renderToStaticMarkup(<ObjectionChips ask={ask} />);
    for (const id of ask) {
      const entry = ASK_ENTRIES.find((e) => e.id === id)!;
      expect(markup).toContain(entry.question);
      /* The answers are prose with apostrophes and quotes that the renderer
         escapes, so match on a plain opening run of words rather than the
         whole string. */
      expect(markup).toContain(entry.answer.split(" ").slice(0, 4).join(" "));
    }
  });

  it("says how many there are without telling the reader to do anything", () => {
    const markup = renderToStaticMarkup(<ObjectionChips ask={["consultant", "chatgpt"]} />);
    expect(markup).toContain("2 of them.");
    expect(markup).not.toContain("Drag it");
  });
});
