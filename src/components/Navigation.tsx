import { useState } from "react";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useTheme } from "next-themes";
import mindmakerIcon from "@/assets/mindmaker-icon.png";
import mindmakeWordmark from "../../prototypes/assets/mindmake-wordmark.png";
import { BookFitCall } from "@/components/BookFitCall";
import { MINDMAKER_LIVE_URL } from "@/lib/publicLinks";
import { useScrollDirection } from "@/hooks/useScrollDirection";

const links = [
  { label: "How I Help", href: "/#work" },
  { label: "Results", href: "/case-studies" },
];

export default function Navigation() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { isHidden } = useScrollDirection({ disabled: open });

  return (
    <nav
      className="fixed top-0 z-[100] w-full border-b border-border/50 bg-background/90 pt-safe-top shadow-sm backdrop-blur-md transition-transform duration-300"
      style={{ transform: isHidden ? "translateY(-100%)" : "translateY(0)" }}
      aria-label="Main navigation"
    >
      <div className="container-width">
        <div className="flex h-16 items-center justify-between sm:h-18 md:h-20">
          <a href="/" className="flex items-center gap-2 hover:no-underline" aria-label="Mindmake home">
            <img src={mindmakerIcon} alt="" className="h-8 w-auto sm:h-9 md:h-10" />
            <img src={mindmakeWordmark} alt="Mindmake" className="h-5 w-auto dark:brightness-0 dark:invert sm:h-6 md:h-7" />
          </a>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <a key={link.href} href={link.href} className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-mint/10 hover:text-foreground hover:no-underline">
                {link.label}
              </a>
            ))}
            <a href={MINDMAKER_LIVE_URL} target="_blank" rel="noopener noreferrer" className="rounded-md px-3 py-2 text-sm font-semibold hover:bg-mint/10 hover:no-underline">
              Media
            </a>
            <BookFitCall source="navigation" className="ml-3 min-h-10 px-4 py-2" />
          </div>

          <div className="flex items-center gap-1">
            <button type="button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="relative grid h-11 w-11 place-items-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint" aria-label="Change colour theme">
              <Sun className="h-4 w-4 scale-100 dark:scale-0" />
              <Moon className="absolute h-4 w-4 scale-0 dark:scale-100" />
            </button>
            <button type="button" onClick={() => setOpen((value) => !value)} className="grid h-11 w-11 place-items-center rounded-md hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-mint lg:hidden" aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"}>
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open && (
          <div id="mobile-navigation" className="border-t border-border/50 py-4 lg:hidden">
            <div className="flex flex-col">
              {links.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setOpen(false)} className="flex min-h-12 items-center rounded-md px-3 text-base font-semibold hover:bg-mint/10 hover:no-underline">
                  {link.label}
                </a>
              ))}
              <a href={MINDMAKER_LIVE_URL} target="_blank" rel="noopener noreferrer" className="flex min-h-12 items-center rounded-md px-3 text-base font-semibold hover:bg-mint/10 hover:no-underline">
                Media
              </a>
              <BookFitCall source="mobile-navigation" className="mt-3 w-full" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
