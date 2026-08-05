import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, User, Tag, ArrowRight, Share2, Linkedin, Twitter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useSessionData } from "@/contexts/SessionDataContext";
import { useBlogPost, useBlogPosts } from "@/hooks/useBlogPosts";
import ReactMarkdown from 'react-markdown';

const categoryLabels: Record<string, string> = {
  "ai-literacy": "AI Literacy",
  "leadership": "Leadership",
  "implementation": "Implementation",
  "strategy": "Strategy",
};

const categoryColors: Record<string, string> = {
  "ai-literacy": "bg-mint/20 text-mint-dark dark:text-mint border-mint/30",
  "leadership": "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  "implementation": "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  "strategy": "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { sessionData } = useSessionData();
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  
  const { data: post } = useBlogPost(slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-6">The article you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  // Get related posts (same category, excluding current)
  const { data: allPosts = [] } = useBlogPosts();
  const relatedPosts = allPosts
    .filter(p => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  const shareUrl = `https://themindmaker.ai/blog/${post.slug}`;
  const shareText = `${post.title} - by Krish Raja`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: post.excerpt,
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
      }
    }
  };

  const seoData = {
    title: `${post.title} - Mindmaker`,
    description: post.metaDescription,
    canonical: `/blog/${post.slug}`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": post.title,
      "description": post.metaDescription,
      "author": {
        "@type": "Person",
        "name": post.author,
        "url": "https://www.krishraja.com"
      },
      "publisher": {
        "@type": "Organization",
        "name": "Mindmaker",
        "url": "https://themindmaker.ai"
      },
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": `https://themindmaker.ai/blog/${post.slug}`
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <main className="pt-24 pb-16">
        {/* Article Header */}
        <header className="container-width mb-12">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/blog')}
            className="mb-6 -ml-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Button>
          
          <div className="max-w-3xl">
            {/* Category & Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <Badge 
                variant="outline" 
                className={categoryColors[post.category]}
              >
                {categoryLabels[post.category]}
              </Badge>
              {post.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
            
            {/* Title */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 font-display leading-tight">
              {post.title}
            </h1>
            
            {/* Excerpt */}
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              {post.excerpt}
            </p>
            
            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground pb-8 border-b border-border">
              <span className="flex items-center gap-2">
                <User className="h-4 w-4" />
                {post.author}
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                  month: 'long', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {post.readingTime} min read
              </span>
              
              {/* Share Buttons */}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a 
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Linkedin className="h-4 w-4" />
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  asChild
                >
                  <a 
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Twitter className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="container-width">
          <div className="max-w-3xl">
            <div className="prose prose-lg dark:prose-invert max-w-none
              prose-headings:font-display prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
              prose-p:text-foreground prose-p:leading-relaxed
              prose-strong:text-foreground prose-strong:font-semibold
              prose-ul:my-4 prose-li:my-1
              prose-a:text-mint-dark dark:prose-a:text-mint prose-a:no-underline hover:prose-a:underline
            ">
              <ReactMarkdown
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-bold mt-12 mb-4 font-display">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-bold mt-8 mb-3 font-display">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-foreground leading-relaxed mb-4">{children}</p>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-foreground">{children}</strong>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 my-4 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 my-4 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-foreground">{children}</li>
                  ),
                  hr: () => (
                    <hr className="my-12 border-border" />
                  ),
                  em: ({ children }) => (
                    <em className="text-muted-foreground italic">{children}</em>
                  ),
                  a: ({ href, children }) => {
                    const internal = href?.startsWith("/");
                    const className =
                      "text-emerald-deep dark:text-mint font-semibold underline underline-offset-4 hover:opacity-80 transition-opacity";
                    return internal ? (
                      <Link to={href!} className={className}>
                        {children}
                      </Link>
                    ) : (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={className}
                      >
                        {children}
                      </a>
                    );
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </div>
        </article>

        {/* Author Bio */}
        <section className="container-width mt-16">
          <div className="max-w-3xl">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <div className="flex items-start gap-6">
                <div className="shrink-0">
                  <div className="w-16 h-16 rounded-full bg-mint/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-mint-dark dark:text-mint">KR</span>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1">Krish Raja</h3>
                  <p className="text-sm text-muted-foreground mb-3">Founder, Mindmaker</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    Krish helps senior business leaders become AI-literate by building working AI systems 
                    around their real work. With 16+ years scaling businesses from zero to multi-million 
                    dollar revenue across the UK, USA, and Australia, he brings operator experience to 
                    AI transformation.
                  </p>
                  <a 
                    href="https://www.krishraja.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-3 text-sm text-mint-dark dark:text-mint hover:underline"
                  >
                    Learn more about Krish →
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container-width mt-16">
          <div className="max-w-3xl">
            <div className="dark-cta-card">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Ready to Build Your AI Literacy?
              </h2>
              <p className="mb-6">
                Stop reading about AI and start building with it. Book a Builder Session 
                to create your first working AI systems in 60 minutes.
              </p>
              <Button 
                size="lg"
                variant="mint"
                onClick={() => setConsultModalOpen(true)}
              >
                Book a Builder Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="container-width mt-16">
            <div className="max-w-5xl">
              <h2 className="text-2xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="group block p-6 rounded-xl border border-border bg-card hover:border-mint/50 transition-all"
                  >
                    <Badge 
                      variant="outline" 
                      className={`text-xs mb-3 ${categoryColors[relatedPost.category]}`}
                    >
                      {categoryLabels[relatedPost.category]}
                    </Badge>
                    <h3 className="font-bold mb-2 group-hover:text-mint transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      
      <Footer />
      
      {/* Consult Modal */}
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram || "build"}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType || "build"}
      />
    </div>
  );
};

export default BlogPost;
