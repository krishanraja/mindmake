import { describe, expect, it } from "vitest";
import { render, renderWithMetadata } from "@/entry-server";
import { staticPages } from "../../scripts/lib/pages.mjs";
import { blogPosts } from "@/data/blogPosts";
import { answers } from "@/lib/answers";
import { answerPath } from "@/lib/answerFormat";

const routes = [...staticPages.map(page => page.path), ...blogPosts.map(post => `/blog/${post.slug}`), ...answers.map(answer => answerPath(answer.slug))];
describe("the real prerendered body behind technical metadata", () => {
  it("captures one canonical SEO owner per indexed route and agrees with the reader directory", () => {
    for (const route of routes) {
      const { metadata } = renderWithMetadata(route);
      expect(metadata?.canonical, route).toBe(route);
      expect(metadata?.noindex, route).toBe(false);
      expect(metadata?.title, route).toBeTruthy();
      expect(metadata?.description, route).toBeTruthy();
      const manifest = staticPages.find(page => page.path === route);
      if (manifest) {
        expect(metadata?.title, route).toBe(manifest.title);
        expect(metadata?.description, route).toBe(manifest.description);
      }
    }
  });

  it("captures existing structured data for static indexes and articles without inventing schema", () => {
    for (const route of ["/case-studies", "/blog", "/answers", "/new-age-leadership", `/blog/${blogPosts[0].slug}`, answerPath(answers[0].slug)]) {
      expect(renderWithMetadata(route).metadata?.jsonLd, route).toBeTruthy();
    }
    for (const post of blogPosts) expect(renderWithMetadata(`/blog/${post.slug}`).metadata?.ogType).toBe("article");
    expect(renderWithMetadata("/contact").metadata?.jsonLd).toBeUndefined();
  });
  it("renders all indexed routes without adding metadata markup to the page body", () => {
    for (const route of routes) {
      const body = render(route);
      expect(body, route).toContain("<h1");
      expect(body, route).not.toContain('id="mindmake-page-jsonld"');
      expect(renderWithMetadata(route).body, route).toBe(body);
    }
  });
});
