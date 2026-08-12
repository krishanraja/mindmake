import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { BookFitCall } from "@/components/BookFitCall";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import { BlogPostCard, categoryLabels } from "@/components/BlogPostCard";

const Blog = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: blogPosts = [] } = useBlogPosts();
  const categories = [...new Set(blogPosts.map((p) => p.category))];

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = !selectedCategory || post.category === selectedCategory;
    const matchesSearch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPost = filteredPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured || post !== featuredPost);

  const seoData = {
    title: "Ideas for Better AI Decisions",
    description: "Clear ideas for leaders making product, price, sales and company decisions as AI changes their market.",
    canonical: "/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Mindmaker Ideas",
      "description": "Clear ideas for leaders making important business decisions as AI changes their market",
      "url": "https://themindmaker.ai/blog",
      "author": {
        "@type": "Person",
        "name": "Krish Raja"
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container-width">
          {/* Header */}
          <div className="mb-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                Ideas for <span className="text-mint-dark dark:text-mint">better decisions</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Clear lessons from real work with leaders, products and teams. No vendor theatre.
              </p>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All
              </Button>
              {categories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {categoryLabels[category] || category}
                </Button>
              ))}
            </div>
          </div>

          {/* Featured Post */}
          {featuredPost && !searchQuery && !selectedCategory && (
            <Link 
              to={`/blog/${featuredPost.slug}`}
              className="block mb-12 group"
            >
              <article className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-ink to-ink-900 p-8 md:p-12 hover:border-mint/50 transition-all duration-300">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-mint/10 to-transparent opacity-50" />
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <Badge className="bg-mint text-ink border-0 font-medium">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="border-dark-card-muted text-dark-card-body">
                      {categoryLabels[featuredPost.category]}
                    </Badge>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-dark-card-heading group-hover:text-mint transition-colors">
                    {featuredPost.title}
                  </h2>
                  
                  <p className="text-dark-card-body text-lg mb-6 max-w-2xl">
                    {featuredPost.excerpt}
                  </p>
                  
                  <div className="flex items-center gap-6 text-sm text-dark-card-muted">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(featuredPost.publishedAt).toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {featuredPost.readingTime} min read
                    </span>
                  </div>
                </div>
                
                <ArrowRight className="absolute bottom-8 right-8 h-6 w-6 text-mint opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all" />
              </article>
            </Link>
          )}

          {/* Post Grid */}
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post, index) => (
                <BlogPostCard key={post.slug} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No articles found matching your criteria.</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory(null);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-16 p-8 md:p-12 rounded-2xl bg-gradient-to-br from-mint/10 to-mint/5 border border-mint/20">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Reading has done its job. Now make the call.
              </h2>
              <p className="text-muted-foreground mb-6">
                If AI has changed an important product, price, sales or company decision, use the fit call to see whether a 21-day Sprint is the right shape.
              </p>
              <BookFitCall source="blog-index" />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Blog;
