import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { blogPosts as staticPosts, type BlogPost } from "@/data/blogPosts";
import { BOOKING_URL } from "@/lib/publicLinks";

const RETIRED_ARTICLE_CTA = "*Work one nervous AI decision through the [Diagnosis Room](/start). Free, no email.*";
const CURRENT_ARTICLE_CTA = `*If this has become a real business decision, [book a fit call](${BOOKING_URL}?utm_source=article&utm_medium=website).*`;

const withCurrentCta = (post: BlogPost): BlogPost => ({
  ...post,
  content: post.content.replaceAll(RETIRED_ARTICLE_CTA, CURRENT_ARTICLE_CTA),
});

const currentStaticPosts = staticPosts.map(withCurrentCta);

/**
 * Fetches blog posts from Supabase with static file fallback.
 *
 * The `blog_posts` table is the source of truth when available.
 * Falls back to the static blogPosts.ts data if Supabase is unreachable
 * or the table doesn't exist yet (gradual migration).
 */
async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      // Table doesn't exist or is empty, use static fallback
      return currentStaticPosts;
    }

    // Map Supabase snake_case to BlogPost camelCase
    return data.map((row: Record<string, unknown>) => withCurrentCta({
      slug: row.slug as string,
      title: row.title as string,
      excerpt: row.excerpt as string,
      content: row.content as string,
      author: row.author as string,
      publishedAt: row.published_at as string,
      updatedAt: row.updated_at as string,
      category: row.category as BlogPost["category"],
      tags: (row.tags as string[]) || [],
      readingTime: row.reading_time as number,
      featured: row.featured as boolean,
      metaDescription: row.meta_description as string,
      ogImage: row.og_image as string | undefined,
    }));
  } catch {
    // Network error or Supabase unavailable, use static fallback
    return currentStaticPosts;
  }
}

export function useBlogPosts() {
  return useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    initialData: currentStaticPosts, // Show static data immediately, refresh in background
  });
}

export function useBlogPost(slug: string | undefined) {
  const { data: posts, ...rest } = useBlogPosts();
  const post = slug ? posts?.find((p) => p.slug === slug) : undefined;
  return { data: post, ...rest };
}
