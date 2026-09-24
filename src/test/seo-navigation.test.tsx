import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render } from "@testing-library/react";
import { SEO } from "@/components/SEO";
import plates from "@/content/socialPlates.json";

const content = (key: string) => document.head.querySelector(`meta[name="${key}"],meta[property="${key}"]`)?.getAttribute("content");
afterEach(() => {
  cleanup();
  document.head.querySelectorAll('meta,link[rel="canonical"],#mindmake-page-jsonld').forEach(node => node.remove());
});

describe("metadata survives client navigation without contradicting the served head", () => {
  it("preserves preview permissions, canonical root and versioned social images", () => {
    render(<SEO title="Home" description="Description" />);
    expect(content("robots")).toBe("index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1");
    expect(document.querySelector('link[rel="canonical"]')?.getAttribute("href")).toBe("https://mindmake.co/");
    const image = `https://mindmake.co${plates["/"].file}?v=${plates["/"].version}`;
    for (const key of ["og:image", "og:image:secure_url", "twitter:image"]) expect(content(key)).toBe(image);
  });

  it("removes stale keywords and structured data when leaving an article", () => {
    const view = render(<SEO title="Article" description="Article description" canonical="/article" keywords="topic" ogType="article" jsonLd={{ "@type": "Article" }} />);
    expect(content("og:type")).toBe("article");
    expect(content("keywords")).toBe("topic");
    view.rerender(<SEO title="Home" description="Home description" canonical="/" />);
    expect(content("og:type")).toBe("website");
    expect(content("keywords")).toBeUndefined();
    expect(document.getElementById("mindmake-page-jsonld")).toBeNull();
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1);
    expect(document.querySelectorAll('meta[property="og:image"]')).toHaveLength(1);
  });

  it("does not describe a custom social image with an unrelated fallback plate", () => {
    render(<SEO title="Article title" description="Description" canonical="/blog/example" ogImage="https://mindmake.co/custom.jpg" ogType="article" />);
    expect(content("og:image:alt")).toBe("Article title");
    expect(content("twitter:image:alt")).toBe("Article title");
    expect(content("og:image:secure_url")).toBe("https://mindmake.co/custom.jpg");
  });

  it("keeps excluded pages excluded and clears noindex when returning to a public page", () => {
    const view = render(<SEO title="Missing" description="Missing" noindex />);
    expect(content("robots")).toBe("noindex, nofollow");
    view.rerender(<SEO title="Home" description="Home" />);
    expect(content("robots")).not.toContain("noindex");
    expect(content("robots")).toContain("max-image-preview:large");
  });
});
