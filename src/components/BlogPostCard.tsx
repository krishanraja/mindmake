import { Link } from "react-router-dom";
import { Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlogPost } from "@/data/blogPosts";

const categoryLabels: Record<string, string> = {
  "ai-literacy": "AI Literacy",
  leadership: "Leadership",
  implementation: "Implementation",
  strategy: "Strategy",
};

const categoryColors: Record<string, string> = {
  "ai-literacy": "bg-mint/20 text-mint-dark dark:text-mint border-mint/30",
  leadership:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  implementation:
    "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-amber-200 dark:border-amber-800",
  strategy:
    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-800",
};

export const BlogPostCard = ({ post, index = 0 }: { post: BlogPost; index?: number }) => {
  return (
    <Link to={`/blog/${post.slug}`} className="group block">
      <article
        className="h-full flex flex-col p-6 rounded-xl border border-border bg-card hover:border-mint/50 hover:shadow-lg hover:shadow-mint/5 transition-all duration-300"
        style={{ animationDelay: `${index * 0.05}s` }}
      >
        <div className="mb-4">
          <Badge variant="outline" className={`text-xs ${categoryColors[post.category]}`}>
            {categoryLabels[post.category]}
          </Badge>
        </div>

        <h3 className="text-lg font-bold mb-3 group-hover:text-mint transition-colors line-clamp-2">
          {post.title}
        </h3>

        <p className="text-muted-foreground text-sm mb-4 flex-grow line-clamp-3">{post.excerpt}</p>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {post.readingTime} min
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {post.tags.slice(0, 2).map((tag) => (
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

export { categoryLabels, categoryColors };
