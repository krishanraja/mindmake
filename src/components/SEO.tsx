import { useEffect } from "react";
import plates from "@/content/socialPlates.json";

/**
 * The page's own social plate, from the manifest `scripts/social-plates.mjs`
 * writes: one per indexed page, painted from the page's words. The prerender
 * writes the same URL into the served head; this keeps the two in step when
 * the client rewrites the head on navigation. A path with no plate of its own
 * wears the homepage's.
 */
const plateFor = (path: string) => {
  const plate = (plates as Record<string, { file: string; version: string; headline: string; claim: string }>)[path]
    ?? (plates as Record<string, { file: string; version: string; headline: string; claim: string }>)["/"];
  return { url: `https://mindmake.co${plate.file}?v=${plate.version}`, alt: [plate.headline, plate.claim].filter(Boolean).join(" ") };
};

interface SEOProps {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  jsonLd?: object;
  noindex?: boolean;
}

const setMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let element = document.head.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
};

export const SEO = ({
  title,
  description,
  canonical,
  ogImage,
  ogType = "website",
  keywords,
  jsonLd,
  noindex = false,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | Mindmake`;
    const canonicalUrl = `https://mindmake.co${canonical || ""}`;
    const plate = plateFor(canonical || "/");
    const image = ogImage ?? plate.url;
    document.title = fullTitle;

    setMeta('meta[name="title"]', "name", "title", fullTitle);
    setMeta('meta[name="description"]', "name", "description", description);
    setMeta('meta[name="robots"]', "name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    if (keywords) setMeta('meta[name="keywords"]', "name", "keywords", keywords);

    let canonicalElement = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonicalElement) {
      canonicalElement = document.createElement("link");
      canonicalElement.rel = "canonical";
      document.head.appendChild(canonicalElement);
    }
    canonicalElement.href = canonicalUrl;

    const openGraph: Record<string, string> = {
      "og:type": ogType,
      "og:url": canonicalUrl,
      "og:title": fullTitle,
      "og:description": description,
      "og:image": image,
      "og:image:secure_url": image,
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:alt": plate.alt,
    };
    Object.entries(openGraph).forEach(([property, content]) => {
      setMeta(`meta[property="${property}"]`, "property", property, content);
    });

    const twitter: Record<string, string> = {
      "twitter:card": "summary_large_image",
      "twitter:url": canonicalUrl,
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": image,
      "twitter:image:alt": plate.alt,
    };
    Object.entries(twitter).forEach(([name, content]) => {
      setMeta(`meta[name="${name}"]`, "name", name, content);
    });

    document.getElementById("mindmake-page-jsonld")?.remove();
    if (jsonLd) {
      const script = document.createElement("script");
      script.id = "mindmake-page-jsonld";
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [canonical, description, jsonLd, keywords, noindex, ogImage, ogType, title]);

  return null;
};
