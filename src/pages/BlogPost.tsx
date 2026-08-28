import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Linkedin, Share2, Twitter } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { SEO } from "@/components/SEO";
import { BlogPostCard, categoryLabels } from "@/components/BlogPostCard";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import "@/styles/mindmake.css";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const [briefOpen, setBriefOpen] = useState(false);
  const [shareStatus, setShareStatus] = useState<"" | "shared" | "copied" | "manual">("");
  const { data: post } = useBlogPost(slug);
  const { data: allPosts = [] } = useBlogPosts();

  if (!post) {
    return (
      <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
        <SEO title="Article not found" description="This Mindmake idea could not be found." canonical="/blog" noindex />
        <section className="mm-article-missing">
          <h1>This idea is no longer here.</h1>
          <Link className="mm-button" to="/blog">See every idea <ArrowRight aria-hidden="true" /></Link>
        </section>
        <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
      </MindmakeShell>
    );
  }

  const relatedPosts = allPosts.filter((candidate) => candidate.category === post.category && candidate.slug !== post.slug).slice(0, 3);
  const shareUrl = `https://mindmake.co/blog/${post.slug}`;
  const shareText = `${post.title} by Mindmake`;

  const handleShare = async () => {
    setShareStatus("");

    if (navigator.share) {
      try {
        await navigator.share({ title: post.title, text: post.excerpt, url: shareUrl });
        setShareStatus("shared");
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareStatus("copied");
    } catch {
      setShareStatus("manual");
    }
  };

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
      <SEO
        title={post.title}
        description={post.metaDescription}
        canonical={`/blog/${post.slug}`}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.metaDescription,
          author: { "@type": "Person", name: post.author },
          publisher: { "@type": "Organization", name: "Mindmake", url: "https://mindmake.co" },
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          mainEntityOfPage: { "@type": "WebPage", "@id": shareUrl },
        }}
      />

      <article className="mm-article-page">
        <header className="mm-container mm-article-hero">
          <Link className="mm-article-back" to="/blog"><ArrowLeft aria-hidden="true" /> All ideas</Link>
          <h1>{post.title}</h1>
          <p className="mm-article-excerpt">{post.excerpt}</p>
          <div className="mm-article-meta">
            <span>{categoryLabels[post.category]}</span>
            <span>{post.author}</span>
            <span>{new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>{post.readingTime} min read</span>
            <nav aria-label="Share this idea">
              <button type="button" onClick={handleShare} aria-label="Share this idea"><Share2 aria-hidden="true" /></button>
              <a href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" aria-label="Share this idea on LinkedIn"><Linkedin aria-hidden="true" /></a>
              <a href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`} target="_blank" rel="noopener noreferrer" aria-label="Share this idea on X"><Twitter aria-hidden="true" /></a>
            </nav>
            <p className="mm-share-status" role="status" aria-live="polite">
              {shareStatus === "shared" && "Shared."}
              {shareStatus === "copied" && "Link copied."}
              {shareStatus === "manual" && <>Copy or open this link: <a href={shareUrl}>{shareUrl}</a></>}
            </p>
          </div>
        </header>

        <div className="mm-container mm-article-body">
          <ReactMarkdown
            components={{
              h2: ({ children }) => <h2>{children}</h2>,
              h3: ({ children }) => <h3>{children}</h3>,
              p: ({ children }) => <p>{children}</p>,
              strong: ({ children }) => <strong>{children}</strong>,
              ul: ({ children }) => <ul>{children}</ul>,
              ol: ({ children }) => <ol>{children}</ol>,
              li: ({ children }) => <li>{children}</li>,
              hr: () => <hr />,
              em: ({ children }) => <em>{children}</em>,
              a: ({ href, children }) => href?.startsWith("/")
                ? <Link to={href}>{children}</Link>
                : <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      </article>

      <aside className="mm-container mm-article-author" aria-label="About the author">
        <div aria-hidden="true">KR</div>
        <div>
          <p>Mindmake</p>
          <p>We help leaders put their judgement to work with AI, then build the parts that keep the work going.</p>
          <Link to="/ai-brain">Build your AI brain <ArrowRight aria-hidden="true" /></Link>
        </div>
      </aside>

      <aside className="mm-container mm-article-next" aria-labelledby="article-next-title">
        <h2 id="article-next-title">See what changes when the company is known.</h2>
        <p>Mindmake reads the business first, gives you a likely problem and shows a useful first move before asking for your email.</p>
        <button className="mm-button" type="button" onClick={() => setBriefOpen(true)}>Start here <ArrowRight aria-hidden="true" /></button>
      </aside>

      {relatedPosts.length > 0 && (
        <section className="mm-container mm-related-ideas" aria-labelledby="related-title">
          <h2 id="related-title">Related ideas.</h2>
          <div className="mm-blog-grid">
            {relatedPosts.map((relatedPost) => <BlogPostCard key={relatedPost.slug} post={relatedPost} />)}
          </div>
        </section>
      )}

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
};

export default BlogPost;
