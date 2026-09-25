import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PageLoading, ScrollToLocation } from "@/App";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import Answers from "@/pages/Answers";
import Answer from "@/pages/Answer";
import { blogPosts } from "@/data/blogPosts";
import { answers } from "@/lib/answers";
import { asQuestion } from "@/lib/answerFormat";

const renderWithAppProviders = (node: React.ReactNode, route = "/") => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={[route]}>{node}</MemoryRouter>
    </QueryClientProvider>,
  );
};

afterEach(() => {
  vi.restoreAllMocks();
  Reflect.deleteProperty(navigator, "share");
  Reflect.deleteProperty(navigator, "clipboard");
  Reflect.deleteProperty(HTMLElement.prototype, "scrollIntoView");
});

describe("public route resilience", () => {
  it("shows a featured article when it is the search result", () => {
    renderWithAppProviders(<Blog />, "/blog");

    fireEvent.change(screen.getByPlaceholderText("Pricing, judgement, AI"), {
      target: { value: "Start Cost" },
    });

    expect(screen.getByRole("heading", { name: blogPosts[0].title })).toBeInTheDocument();
  });

  it("copies an article link when native sharing is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: { writeText } });

    renderWithAppProviders(
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>,
      `/blog/${blogPosts[0].slug}`,
    );

    fireEvent.click(screen.getByRole("button", { name: "Share this idea" }));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith(`https://mindmake.co/blog/${blogPosts[0].slug}`));
    expect(screen.getByRole("status")).toHaveTextContent("Link copied.");
  });

  it("shows the article link when browser sharing is blocked", async () => {
    Object.defineProperty(navigator, "share", { configurable: true, value: undefined });
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: undefined });

    renderWithAppProviders(
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>,
      `/blog/${blogPosts[0].slug}`,
    );

    fireEvent.click(screen.getByRole("button", { name: "Share this idea" }));

    const fallback = await screen.findByRole("link", { name: `https://mindmake.co/blog/${blogPosts[0].slug}` });
    expect(fallback).toHaveAttribute("href", `https://mindmake.co/blog/${blogPosts[0].slug}`);
  });

  it("scrolls a home-page fragment into view", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0);
      return 1;
    });
    vi.spyOn(window, "cancelAnimationFrame").mockImplementation(() => undefined);

    render(
      <MemoryRouter initialEntries={["/#about"]}>
        <ScrollToLocation />
        <section id="about">About Mindmake</section>
      </MemoryRouter>,
    );

    await waitFor(() => expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" }));
    expect(screen.getByText("About Mindmake")).toHaveFocus();
  });

  it("marks the client-side missing page as noindex", async () => {
    renderWithAppProviders(<NotFound />, "/not-a-real-page");

    expect(screen.getByRole("heading", { name: "There is nothing here." })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    });
  });

  it("lists every answer page with the question it answers", () => {
    renderWithAppProviders(<Answers />, "/answers");

    for (const answer of answers) {
      expect(screen.getByRole("heading", { name: answer.title })).toBeInTheDocument();
      expect(screen.getByText(asQuestion(answer.targetQuery))).toBeInTheDocument();
      expect(screen.getByRole("link", { name: new RegExp(answer.title.slice(0, 30), "i") }))
        .toHaveAttribute("href", `/answers/${answer.slug}`);
    }
  });

  it("puts the answer above the argument, and the FAQ in real headings", () => {
    /* The order is the whole point of the surface: an assistant fetching the
       page reads the first chunk and stops, so the liftable answer is the
       first prose in the markup rather than the payoff at the end. */
    const [answer] = answers;
    const { container } = renderWithAppProviders(
      <Routes>
        <Route path="/answers/:slug" element={<Answer />} />
      </Routes>,
      `/answers/${answer.slug}`,
    );

    expect(screen.getByRole("heading", { level: 1, name: answer.title })).toBeInTheDocument();
    const prose = [...container.querySelectorAll("main p")].map((node) => node.textContent);
    expect(prose[0]).toBe(answer.answer);
    expect(prose[1]).toBe(answer.claim);

    for (const entry of answer.faq) {
      expect(screen.getByRole("heading", { name: entry.q })).toBeInTheDocument();
      expect(screen.getByText(entry.a)).toBeInTheDocument();
    }
    for (const line of answer.firstParty) {
      expect(screen.getByText(line)).toBeInTheDocument();
    }
  });

  it("marks an answer that is no longer published as noindex", async () => {
    renderWithAppProviders(
      <Routes>
        <Route path="/answers/:slug" element={<Answer />} />
      </Routes>,
      "/answers/a-question-nobody-asked",
    );

    expect(screen.getByRole("heading", { name: "This answer is no longer here." })).toBeInTheDocument();
    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    });
  });

  it("uses a branded and announced loading state", () => {
    renderWithAppProviders(<PageLoading />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading the page.");
    /* The wordmark is the real logo, a vector written into the page since
       4 September 2026, and its accessible name is what carries the brand.
       The mark beside it is decorative and must stay out of the
       accessibility tree, so exactly one image is announced. */
    expect(screen.getByRole("img", { name: "Mindmake" })).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});
