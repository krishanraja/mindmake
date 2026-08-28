import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogPostCard, categoryLabels } from "@/components/BlogPostCard";
import "@/styles/mindmake.css";

const Blog = () => {
  const [briefOpen, setBriefOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: blogPosts = [] } = useBlogPosts();
  const categories = [...new Set(blogPosts.map((post) => post.category))];

  const filteredPosts = blogPosts.filter((post) => {
    const query = searchQuery.trim().toLowerCase();
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !query || [post.title, post.excerpt, ...post.tags].some((value) => value.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const showFeaturedPost = !searchQuery.trim() && !selectedCategory;
  const featuredPost = showFeaturedPost ? blogPosts.find((post) => post.featured) : undefined;
  const visiblePosts = featuredPost ? filteredPosts.filter((post) => post !== featuredPost) : filteredPosts;

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)}>
      <SEO
        title="Ideas for better AI decisions"
        description="Useful questions, checks and working methods for leaders making business decisions as AI changes their market."
        canonical="/blog"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Blog",
          name: "Mindmake ideas",
          description: "Useful questions, checks and working methods for leaders making business decisions as AI changes their market",
          url: "https://mindmake.co/blog",
          author: { "@type": "Organization", name: "Mindmake" },
        }}
      />

      <section className="mm-blog-page" aria-labelledby="blog-title">
        <header className="mm-container mm-blog-hero">
          <h1 id="blog-title">Ideas you can use.</h1>
          <p>Each note gives you a question, check or working method to take into a real decision.</p>
        </header>

        <div className="mm-container mm-blog-tools" aria-label="Find an article">
          <label className="mm-blog-search">
            <span>Search the ideas</span>
            <Search aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Try pricing, judgement or vendors"
            />
          </label>
          <div className="mm-blog-filters" aria-label="Filter by subject">
            <button type="button" aria-pressed={selectedCategory === null} onClick={() => setSelectedCategory(null)}>All ideas</button>
            {categories.map((category) => (
              <button key={category} type="button" aria-pressed={selectedCategory === category} onClick={() => setSelectedCategory(category)}>
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>
        </div>

        <div className="mm-container mm-blog-list">
          {featuredPost && (
            <Link to={`/blog/${featuredPost.slug}`} className="mm-blog-featured">
              <article>
                <h2>{featuredPost.title}</h2>
                <p>{featuredPost.excerpt}</p>
                <footer>
                  <span>
                    {categoryLabels[featuredPost.category]} · {new Date(featuredPost.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <strong>Read the idea <ArrowRight aria-hidden="true" /></strong>
                </footer>
              </article>
            </Link>
          )}

          {filteredPosts.length > 0 ? (
            <div className="mm-blog-grid">
              {visiblePosts.map((post) => <BlogPostCard key={post.slug} post={post} />)}
            </div>
          ) : (
            <div className="mm-blog-empty">
              <h2>No close match.</h2>
              <p>Clear the search to see every idea.</p>
              <button type="button" className="mm-text-button" onClick={() => { setSearchQuery(""); setSelectedCategory(null); }}>Show all ideas</button>
            </div>
          )}
        </div>

        <aside className="mm-container mm-blog-continuation" aria-labelledby="blog-next-title">
          <h2 id="blog-next-title">Turn one useful idea into a clearer starting point.</h2>
          <p>Mindmake reads the company first. You see the likely problem and a useful first move before choosing whether to keep the private brief.</p>
          <button className="mm-button" type="button" onClick={() => setBriefOpen(true)}>Start here <ArrowRight aria-hidden="true" /></button>
        </aside>
      </section>

      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
};

export default Blog;
