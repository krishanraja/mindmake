-- Blog posts table: enables CMS-style publishing without code deploys
-- Falls back gracefully: the app uses static blogPosts.ts when this table is empty

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author text NOT NULL DEFAULT 'Krish Raja',
  published_at date NOT NULL DEFAULT CURRENT_DATE,
  updated_at date NOT NULL DEFAULT CURRENT_DATE,
  category text NOT NULL CHECK (category IN ('ai-literacy', 'leadership', 'implementation', 'strategy')),
  tags text[] NOT NULL DEFAULT '{}',
  reading_time integer NOT NULL DEFAULT 5,
  featured boolean NOT NULL DEFAULT false,
  meta_description text NOT NULL,
  og_image text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS but allow public reads (blog is public content)
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog posts are publicly readable"
  ON public.blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Index for fast slug lookups and ordering
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts (slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON public.blog_posts (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON public.blog_posts (category);
