import { useQuery } from "@tanstack/react-query";
import { blogPosts, type BlogPost } from "@/data/blogPosts";

const currentPosts: BlogPost[] = blogPosts;

/**
 * The checked-in archive is the public source of truth.
 * A retired remote table must not put old offers or unsupported claims back on the site.
 */
export function useBlogPosts() {
  return useQuery({
    queryKey: ["mindmake-public-articles"],
    queryFn: async () => currentPosts,
    staleTime: Infinity,
    initialData: currentPosts,
  });
}

export function useBlogPost(slug: string | undefined) {
  const { data: posts, ...rest } = useBlogPosts();
  const post = slug ? posts.find((candidate) => candidate.slug === slug) : undefined;
  return { data: post, ...rest };
}
