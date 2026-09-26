import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/data/blogPosts";
import { subjectLabels as categoryLabels, writtenOn } from "@/lib/ideaFormat";

export const BlogPostCard = ({ post }: { post: BlogPost }) => (
  <Link to={`/blog/${post.slug}`} className="mm-blog-card">
    <article>
      <h2>{post.title}</h2>
      <p>{post.excerpt}</p>
      <footer>
        <small>{categoryLabels[post.category]} · {writtenOn(post.publishedAt, "short")} · {post.readingTime} min read</small>
        <strong>Read <ArrowRight aria-hidden="true" /></strong>
      </footer>
    </article>
  </Link>
);

export { categoryLabels };
