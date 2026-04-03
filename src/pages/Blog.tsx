import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Tag, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useBlogPosts } from "@/hooks/useBlogPosts";
import type { BlogPost } from "@/data/blogPosts";

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
    title: "AI Literacy Blog - Mindmaker",
    description: "Expert insights on AI literacy for business leaders. Learn how to build AI systems, evaluate vendors, and lead AI transformation in your organization.",
    canonical: "/blog",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      "name": "Mindmaker AI Literacy Blog",
      "description": "Expert insights on AI literacy for business leaders",
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
                AI Literacy <span className="text-mint-dark dark:text-mint">Insights</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Practical frameworks and strategies for leaders building AI capability. 
                No vendor theatre, just real insights from real implementations.
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
                <BlogCard key={post.slug} post={post} index={index} />
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
                Ready to Build Your AI Literacy?
              </h2>
              <p className="text-muted-foreground mb-6">
                Stop reading about AI and start building with it. Book a Builder Session 
                to create your first working AI systems in 60 minutes.
              </p>
              <Button 
                size="lg"
                onClick={() => window.open('https://calendly.com/krish-raja/mindmaker-meeting', '_blank')}
              >
                Book a Builder Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

const BlogCard = ({ post, index }: { post: BlogPost; index: number }) => {
  return (
    <Link 
      to={`/blog/${post.slug}`}
      className="group block"
    >
      <article 
        className="h-full flex flex-col p-6 rounded-xl border border-border bg-card hover:border-mint/50 hover:shadow-lg hover:shadow-mint/5 transition-all duration-300"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        {/* Category Badge */}
        <div className="mb-4">
          <Badge 
            variant="outline" 
            className={`text-xs ${categoryColors[post.category]}`}
          >
            {categoryLabels[post.category]}
          </Badge>
        </div>
        
        {/* Title */}
        <h3 className="text-lg font-bold mb-3 group-hover:text-mint transition-colors line-clamp-2">
          {post.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">
          {post.excerpt}
        </p>
        
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.slice(0, 2).map(tag => (
            <span 
              key={tag} 
              className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
            >
              {tag}
            </span>
          ))}
          {post.tags.length > 2 && (
            <span className="text-[10px] px-2 py-0.5 text-muted-foreground">
              +{post.tags.length - 2}
            </span>
          )}
        </div>
      </article>
    </Link>
  );
};

export default Blog;
