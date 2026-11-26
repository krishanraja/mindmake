import { describe, expect, it, vi } from "vitest";
import { render } from "@/entry-server";
import { createElement } from "react";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render as mount, within } from "@testing-library/react";
import Questions from "@/pages/Library";
import Blog from "@/pages/Blog";
import corpus from "@/content/answers.json";
import { ideas } from "@/lib/ideas";

const routes = [
  ["/", ".hs-section"],
  ["/ai-brain", ".product-section"],
  ["/ai-gtm", ".product-section"],
  ["/case-studies", "section.uc-finder, section.uc-words, main > section.mm-block"],
  ["/new-age-leadership", 'section[aria-label="The problem"], section[aria-label="How it works"], section[aria-label="What you keep"]'],
  ["/2-minute-ai-upgrade-toolkit", ".journey-room"],
  ["/faq", ".journey-room"],
  ["/about", ".mm-founder, .mm-about-why, section[aria-labelledby=about-words-title]"],
  ["/blog", ".journey-room"],
];

const documentFor = (route: string) => new DOMParser().parseFromString(render(route), "text/html");

describe("the nine public journeys", () => {
  it.each(routes)("%s closes the third chapter with the brief and one onward link", (route, selector) => {
    const doc = documentFor(route);
    const sections = doc.querySelectorAll(selector);
    expect(sections).toHaveLength(3);
    const end = sections[2].querySelector(".journey-end");
    expect(end).not.toBeNull();
    expect(doc.querySelectorAll(".journey-end")).toHaveLength(1);
    expect(end!.querySelector("button")?.textContent).toBe("Start your brief");
    expect(end!.querySelectorAll("a[href^='/']")).toHaveLength(1);
  });

  it("keeps every FAQ answer in an individual disclosure and opens one per chapter", () => {
    const doc = documentFor("/faq");
    expect(doc.querySelectorAll(".journey-questions details[open]")).toHaveLength(3);
    expect(Array.from(doc.querySelectorAll(".journey-questions summary"), node => node.textContent).sort())
      .toEqual(corpus.entries.map(item => item.question).sort());
  });

  it("serves every idea as a real link before the responsive pager starts", () => {
    const doc = documentFor("/blog");
    expect(Array.from(doc.querySelectorAll("a.mm-idea-entry:not([hidden])"), node => node.getAttribute("href")))
      .toEqual(ideas.map(idea => idea.href));
  });
});

it("lets a phone reader change a question and page through individual ideas", () => {
  const original = window.matchMedia.bind(window);
  const media = vi.spyOn(window, "matchMedia").mockImplementation(query => ({
    ...original(query), matches: query === "(max-width: 700px)",
  }));
  try {
    const faq = mount(createElement(MemoryRouter, {}, createElement(Questions)));
    const group = within(faq.container).getByRole("combobox", { name: "Is this for you?" });
    fireEvent.change(group, { target: { value: "technical" } });
    expect(faq.container.querySelector('.journey-pocket-answer > [aria-hidden="false"]')?.textContent)
      .toBe(corpus.entries.find(item => item.id === "technical")!.answer);
    faq.unmount();

    const blog = mount(createElement(MemoryRouter, {}, createElement(Blog)));
    const visible = () => [...blog.container.querySelectorAll(".mm-idea-entry:not([hidden])")].map(link => link.getAttribute("href"));
    expect(visible()).toEqual([ideas[0].href]);
    fireEvent.click(within(blog.container).getByRole("button", { name: "Next ideas" }));
    expect(visible()).toEqual([ideas[1].href]);
    blog.unmount();
  } finally {
    media.mockRestore();
  }
});
