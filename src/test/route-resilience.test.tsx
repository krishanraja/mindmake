import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { PageLoading, ScrollToLocation } from "@/App";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import NotFound from "@/pages/NotFound";
import { blogPosts } from "@/data/blogPosts";

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

    fireEvent.change(screen.getByPlaceholderText("Try pricing, judgement or vendors"), {
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

  it("uses a branded and announced loading state", () => {
    renderWithAppProviders(<PageLoading />);

    expect(screen.getByRole("status")).toHaveTextContent("Loading the page.");
    /* The wordmark is the real logo now rather than styled type, so the brand
       is an image and the alt text is what carries the name. The mark beside it
       is decorative and must stay out of the accessibility tree. */
    expect(screen.getByAltText("Mindmake")).toBeInTheDocument();
    expect(screen.getAllByRole("img")).toHaveLength(1);
  });
});
