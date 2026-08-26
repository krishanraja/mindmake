import { BookFitCall } from "@/components/BookFitCall";
import { MindmakeBrand } from "@/components/mindmake/MindmakeBrand";
import { MINDMAKER_LIVE_URL } from "@/lib/publicLinks";
import "@/styles/mindmake.css";

const groups = [
  { title: "How I help", links: [["Build Your AI Brain", "/ai-brain"], ["Build Your AI GTM", "/ai-gtm"], ["Results", "/case-studies"]] },
  { title: "Read", links: [["Media", MINDMAKER_LIVE_URL], ["Library", "/library"], ["Articles", "/blog"], ["New Age Leadership", "/new-age-leadership"]] },
  { title: "Company", links: [["Contact", "/contact"], ["Privacy", "/privacy"], ["Terms", "/terms"]] },
] as const;

export default function Footer() {
  return (
    <footer className="relative z-20 border-t border-border/50 bg-background py-16 sm:py-20">
      <div className="container-width">
        <div className="grid gap-12 border-b border-border/50 pb-14 lg:grid-cols-[1.3fr_2fr]">
          <div>
            <MindmakeBrand />
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              Krish Raja helps leaders put their best judgement to work with AI.
            </p>
            <BookFitCall source="footer" className="mt-6" />
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {groups.map((group) => (
              <div key={group.title}>
                <h2 className="mb-3 text-sm font-bold tracking-normal">{group.title}</h2>
                <nav className="flex flex-col gap-3" aria-label={`${group.title} links`}>
                  {group.links.map(([label, href]) => (
                    <a key={href} href={href} className="text-sm text-muted-foreground hover:text-foreground">{label}</a>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Mindmake. Operated by Mindmaker LLC.</p>
          <p>Building with AI and The Money of AI are the two Media themes.</p>
        </div>
      </div>
    </footer>
  );
}
