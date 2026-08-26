import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blogPosts";

const categoryLabels: Record<string, string> = {
  "ai-literacy": "Using AI",
  leadership: "For leaders",
  implementation: "Building",
  strategy: "Business choices",
};

export const BlogPostCard = ({ post }: { post: BlogPost }) => (
  <Link to={`/blog/${post.slug}`} className="mm-blog-card">
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <footer>
        <small>{categoryLabels[post.category]} · {new Date(post.publishedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} · {post.readingTime} min read</small>
        <strong>Read <ArrowRight aria-hidden="true" /></strong>
      </footer>
    </article>
  </Link>
);

export { categoryLabels };
