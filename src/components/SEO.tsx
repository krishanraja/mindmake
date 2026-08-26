import { useEffect } from "react";

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
  ogImage = "https://mindmake.co/og-image.jpg?v=2",
  ogType = "website",
  keywords,
  jsonLd,
  noindex = false,
}: SEOProps) => {
  useEffect(() => {
    const fullTitle = `${title} | Mindmake`;
    const canonicalUrl = `https://mindmake.co${canonical || ""}`;
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
      "og:image": ogImage,
      "og:image:secure_url": ogImage,
      "og:image:width": "1200",
      "og:image:height": "630",
    };
    Object.entries(openGraph).forEach(([property, content]) => {
      setMeta(`meta[property="${property}"]`, "property", property, content);
    });

    const twitter: Record<string, string> = {
      "twitter:card": "summary_large_image",
      "twitter:url": canonicalUrl,
      "twitter:title": fullTitle,
      "twitter:description": description,
      "twitter:image": ogImage,
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
