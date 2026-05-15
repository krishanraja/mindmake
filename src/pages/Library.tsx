import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, HelpCircle, FileText } from "lucide-react";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BlogPostCard } from "@/components/BlogPostCard";
import { FAQAccordion } from "@/components/FAQAccordion";
import { useBlogPosts } from "@/hooks/useBlogPosts";

type TabKey = "posts" | "questions" | "manifesto";

const VALID_TABS: TabKey[] = ["posts", "questions", "manifesto"];

const TAB_META: Record<TabKey, { title: string; description: string; canonical: string }> = {
  posts: {
    title: "Library: Posts",
    description:
      "Practical writing for leaders building AI capability. No vendor theatre, just frameworks from real implementations.",
    canonical: "/library",
  },
  questions: {
    title: "Library: Questions",
    description: "Frequently asked questions about Mindmaker, programs, AI literacy, and getting started.",
    canonical: "/library?tab=questions",
  },
  manifesto: {
    title: "Library: Manifesto",
    description:
      "What we believe. Your context is the most valuable thing you own. It should not live inside someone else's product.",
    canonical: "/library?tab=manifesto",
  },
};

const MANIFESTO_PILLARS = [
  {
    label: "Portable",
    accent: "Your context follows you.",
    body: "Exportable across every AI tool you actually use (ChatGPT, Claude, Gemini, Cursor) without being trapped inside any of them.",
  },
  {
    label: "Agnostic",
    accent: "No platform. No lock-in.",
    body: "Your context is a layer, not a product. Independent of any specific model or provider, so you can keep moving as the frontier moves.",
  },
  {
    label: "Private",
    accent: "Self-contained by design.",
    body: "No integrations sucking in your email, calendar, or repos. Information comes from you, directly, and only when you decide.",
  },
  {
    label: "You Own Your Context",
    accent: "Encrypted. Exportable. Deletable.",
    body: "Your data is yours. Encrypted, user-controlled, never used for model training. Take it with you, or take it off the table. Your call.",
  },
  {
    label: "Future-Proof",
    accent: "The leaders who start now compound every day.",
    body: "The competitive advantage in 2026 belongs to the operators who built portable memory in 2024. Compounding starts the day you start.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 8 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: "easeOut" as const },
  }),
};

const Library = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedTab = searchParams.get("tab") as TabKey | null;
  const activeTab: TabKey = requestedTab && VALID_TABS.includes(requestedTab) ? requestedTab : "posts";

  const { data: blogPosts = [] } = useBlogPosts();
  const recentPosts = useMemo(() => {
    return [...blogPosts]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 6);
  }, [blogPosts]);

  const handleTabChange = (value: string) => {
    if (value === "posts") {
      searchParams.delete("tab");
    } else {
      searchParams.set("tab", value);
    }
    setSearchParams(searchParams, { replace: true });
  };

  const meta = TAB_META[activeTab];

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title={meta.title}
        description={meta.description}
        canonical={meta.canonical}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: meta.title,
          description: meta.description,
          url: `https://www.themindmaker.ai${meta.canonical}`,
        }}
      />
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container-width">
          <div className="mb-10 max-w-3xl">
            <div className="text-xs font-bold uppercase tracking-[0.2em] text-mint-dark dark:text-mint mb-3">
              Library
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
              Posts, questions, and{" "}
              <span className="text-mint-dark dark:text-mint">what I believe</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Everything worth reading on one page. Pick a tab.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="h-auto p-1 mb-10 inline-flex flex-wrap gap-1">
              <TabsTrigger value="posts" className="gap-2 px-4 py-2">
                <BookOpen className="h-4 w-4" />
                Posts
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2 px-4 py-2">
                <HelpCircle className="h-4 w-4" />
                Questions
              </TabsTrigger>
              <TabsTrigger value="manifesto" className="gap-2 px-4 py-2">
                <FileText className="h-4 w-4" />
                Manifesto
              </TabsTrigger>
            </TabsList>

            {/* POSTS */}
            <TabsContent value="posts" className="mt-0">
              {recentPosts.length > 0 ? (
                <>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentPosts.map((post, index) => (
                      <BlogPostCard key={post.slug} post={post} index={index} />
                    ))}
                  </div>
                  <div className="mt-10 flex justify-center">
                    <Button asChild variant="outline" size="lg">
                      <Link to="/blog" className="inline-flex items-center gap-2">
                        All posts
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  No posts yet. Check back soon.
                </div>
              )}
            </TabsContent>

            {/* QUESTIONS */}
            <TabsContent value="questions" className="mt-0">
              <FAQAccordion />
              <div className="mt-12 text-center">
                <p className="text-muted-foreground">
                  Can't find your answer?{" "}
                  <a
                    href="mailto:krish@themindmaker.ai"
                    className="text-mint-dark dark:text-mint hover:underline font-medium"
                  >
                    Email me directly
                  </a>{" "}
                  or{" "}
                  <a
                    href="/contact"
                    className="text-mint-dark dark:text-mint hover:underline font-medium"
                  >
                    use the contact form
                  </a>
                  .
                </p>
              </div>
            </TabsContent>

            {/* MANIFESTO */}
            <TabsContent value="manifesto" className="mt-0">
              <section className="relative border-t border-border/40 -mx-4 px-4 py-12 md:py-16 bg-gradient-to-b from-background via-background to-muted/30 rounded-2xl">
                <div className="max-w-3xl mx-auto">
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeUp}
                    className="text-center mb-12"
                  >
                    <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-mint-dark dark:text-mint mb-5">
                      <span className="h-1 w-1 rounded-full bg-mint" />
                      What we believe
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-5 tracking-tight">
                      Your <span className="text-mint-dark dark:text-mint">context</span> is the
                      most valuable thing you own.
                    </h2>
                    <p className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                      It should not live inside someone else's product.
                    </p>
                  </motion.div>

                  <div className="space-y-5 mb-12">
                    {MANIFESTO_PILLARS.map((pillar, i) => (
                      <motion.div
                        key={pillar.label}
                        initial="hidden"
                        whileInView="show"
                        viewport={{ once: true, margin: "-50px" }}
                        custom={i}
                        variants={fadeUp}
                        className="border-l-2 border-mint/60 pl-6 py-2"
                      >
                        <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-mint-dark dark:text-mint mb-2">
                          {pillar.label}
                        </div>
                        <p className="font-bold text-foreground text-lg leading-snug mb-2">
                          {pillar.accent}
                        </p>
                        <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                          {pillar.body}
                        </p>
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-50px" }}
                    variants={fadeUp}
                    className="border-t border-border/40 pt-8 text-center"
                  >
                    <p className="text-base md:text-lg text-foreground leading-relaxed mb-6 italic">
                      We built CTRL because we needed it. Not as a product idea. As a tool for the
                      work.
                    </p>
                    <Button asChild size="lg">
                      <Link to="/operator" className="inline-flex items-center gap-2">
                        See how I operate
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              </section>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Library;
