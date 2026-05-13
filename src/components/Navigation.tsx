import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Menu, X, Sun, Moon, ChevronDown, ExternalLink } from "lucide-react";
import { useTheme } from "next-themes";
import mindmakerLogoDark from "@/assets/mindmaker-logo-dark.png";
import mindmakerLogoLight from "@/assets/mindmaker-logo-light.png";
import { LightningLessons } from "@/components/LightningLessons";
import { MindMakerWordmark } from "@/components/MindMakerWordmark";
import { useScrollDirection } from "@/hooks/useScrollDirection";

type NavSubItem = {
  label: string;
  href?: string;
  external?: boolean;
  type?: "lessons" | "section";
};

type NavItem = {
  label: string;
  href?: string;
  badge?: string;
  wordmark?: boolean;
  dropdown?: NavSubItem[];
};

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [lessonsExpanded, setLessonsExpanded] = useState(false);
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const { isHidden } = useScrollDirection({ disabled: isOpen });

  const navItems: NavItem[] = [
    {
      label: "Cohort",
      href: "/cohort",
    },
    {
      label: "Enterprise",
      dropdown: [
        { label: "The Signal Session", href: "/enterprise#signal-session" },
        { label: "The Revenue Architecture", href: "/enterprise#revenue-architecture" },
        { label: "The AI Immersion", href: "/enterprise#immersion" },
        { type: "section", label: "For funds & operating partners" },
        { label: "Capital", href: "/capital" },
      ],
    },
    {
      label: "Mindmaker LIVE",
      href: "/signal",
      wordmark: true,
    },
    {
      label: "Operator",
      dropdown: [
        { label: "How I operate", href: "/operator" },
        { label: "The Builder Economy (Podcast)", href: "https://www.thebuildereconomy.com", external: true },
        { label: "Lightning Lessons", type: "lessons" },
      ],
    },
    {
      label: "Library",
      href: "/library",
    },
    {
      label: "About",
      dropdown: [
        { label: "Contact", href: "/contact" },
        { label: "Privacy", href: "/privacy" },
        { label: "Terms", href: "/terms" },
      ],
    },
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const currentRef = dropdownRefs.current[openDropdown];
        if (currentRef && !currentRef.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setOpenDropdown(null);
  };

  return (
    <nav
      className="fixed top-0 w-full z-[100] bg-background/80 backdrop-blur-md border-b border-border/50 shadow-md pt-safe-top transition-all duration-300 ease-out"
      style={{ transform: isHidden ? "translateY(-100%)" : "translateY(0)" }}
    >
      <div className="container-width">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          <div className="flex items-center mr-8 lg:mr-12">
            <a href="/" className="transition-opacity hover:opacity-80">
              <img
                src={mindmakerLogoDark}
                alt="Mindmaker"
                loading="eager"
                fetchpriority="high"
                decoding="sync"
                className="h-7 sm:h-8 md:h-[24px] w-auto max-w-[150px] sm:max-w-[180px] object-contain dark:hidden"
              />
              <img
                src={mindmakerLogoLight}
                alt="Mindmaker"
                loading="eager"
                fetchpriority="high"
                decoding="sync"
                className="h-7 sm:h-8 md:h-[24px] w-auto max-w-[150px] sm:max-w-[180px] object-contain hidden dark:block"
              />
            </a>
          </div>

          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item) => {
              if (!item.dropdown && item.href) {
                return (
                  <a
                    key={item.label}
                    href={item.href}
                    aria-label={item.wordmark ? item.label : undefined}
                    className="text-sm font-semibold py-2 px-3 rounded-md text-ink dark:text-white hover:text-mint hover:bg-mint/5 transition-all duration-200 inline-flex items-center gap-1.5"
                  >
                    {item.wordmark ? <MindMakerWordmark size="nav" /> : item.label}
                    {item.badge && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gradient-to-r from-mint to-emerald-400 text-ink text-[9px] font-extrabold tracking-[0.14em] leading-none">
                        {item.badge}
                      </span>
                    )}
                  </a>
                );
              }
              return (
                <div
                  key={item.label}
                  className="relative"
                  ref={(el) => {
                    dropdownRefs.current[item.label] = el;
                  }}
                  onKeyDown={handleKeyDown}
                >
                  <button
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                    className={`text-sm font-semibold transition-all duration-200 ease-out flex items-center gap-1.5 py-2 px-3 rounded-md ${
                      openDropdown === item.label
                        ? "text-mint-dark dark:text-mint bg-mint/10 shadow-sm"
                        : "text-ink dark:text-white hover:text-mint hover:bg-mint/5"
                    }`}
                    aria-expanded={openDropdown === item.label}
                    aria-haspopup="true"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 ${
                        openDropdown === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === item.label && item.dropdown && (
                    <div
                      className="absolute top-full left-0 mt-2 bg-card/95 backdrop-blur-md border border-border/50 rounded-lg shadow-lg py-3 min-w-[240px] z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                      role="menu"
                      aria-label={`${item.label} menu`}
                    >
                      {item.dropdown.map((subItem) => {
                        if (subItem.type === "lessons") {
                          return (
                            <div key={subItem.label} className="px-2">
                              <LightningLessons />
                            </div>
                          );
                        }
                        if (subItem.type === "section") {
                          return (
                            <div
                              key={subItem.label}
                              className="mx-2 mt-2 pt-2 border-t border-border/50 px-4 pb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
                            >
                              {subItem.label}
                            </div>
                          );
                        }
                        return (
                          <a
                            key={subItem.label}
                            href={subItem.href}
                            target={subItem.external ? "_blank" : undefined}
                            rel={subItem.external ? "noopener noreferrer" : undefined}
                            role="menuitem"
                            className="flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-md mx-2 text-ink dark:text-white hover:bg-mint/10 transition-colors"
                          >
                            <span>{subItem.label}</span>
                            {subItem.external && <ExternalLink className="h-3 w-3 ml-2" />}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <Button
              size="sm"
              className="ml-4 relative touch-target"
              onClick={() => {
                window.dispatchEvent(new CustomEvent("openConsultModal"));
              }}
            >
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-mint rounded-full animate-pulse" />
              Book a call
            </Button>
          </div>

          <div className="flex items-center gap-3 ml-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="touch-target"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden touch-target"
            >
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden border-t border-border pb-safe-bottom">
            <ScrollArea className="h-[calc(100vh-5rem)] py-4">
              <div className="flex flex-col space-y-1">
                {navItems.map((item, index) => (
                  <div key={item.label}>
                    {!item.dropdown && item.href ? (
                      <a
                        href={item.href}
                        aria-label={item.wordmark ? item.label : undefined}
                        className="min-h-[44px] flex items-center gap-2 px-4 py-3 text-base font-semibold text-ink dark:text-white hover:bg-mint/10 rounded-md transition-colors"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.wordmark ? <MindMakerWordmark size="nav" /> : item.label}
                        {item.badge && (
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-gradient-to-r from-mint to-emerald-400 text-ink text-[9px] font-extrabold tracking-[0.14em] leading-none">
                            {item.badge}
                          </span>
                        )}
                      </a>
                    ) : (
                      <div className="py-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-4">
                          {item.label}
                        </div>
                        <div className="flex flex-col space-y-1">
                          {item.dropdown?.map((subItem) => {
                            if (subItem.type === "section") {
                              return (
                                <div
                                  key={subItem.label}
                                  className="mx-4 mt-3 pt-3 border-t border-border/50 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground"
                                >
                                  {subItem.label}
                                </div>
                              );
                            }
                            if (subItem.type === "lessons") {
                              return (
                                <div key={subItem.label} className="py-2">
                                  <button
                                    onClick={() => setLessonsExpanded(!lessonsExpanded)}
                                    className="w-full min-h-[44px] flex items-center justify-between px-4 py-3 text-base font-medium text-ink dark:text-white hover:bg-mint/10 rounded-md transition-colors"
                                  >
                                    Lightning Lessons
                                    <ChevronDown
                                      className={`h-4 w-4 transition-transform ${
                                        lessonsExpanded ? "rotate-180" : ""
                                      }`}
                                    />
                                  </button>
                                  {lessonsExpanded && (
                                    <div className="flex flex-col space-y-1 mt-2 ml-4">
                                      {[
                                        {
                                          label: "Vibe Coding for Leaders",
                                          url: "https://maven.com/p/ca6d71/vibe-coding-for-leaders-build-what-you-brief",
                                        },
                                        {
                                          label: "Make AI Your Co-Founder",
                                          url: "https://maven.com/p/0cc82a/make-ai-your-co-founder",
                                        },
                                        {
                                          label: "Build an Autonomous Business with AI",
                                          url: "https://maven.com/p/38d196/build-an-autonomous-business-with-ai",
                                        },
                                        {
                                          label: "Give Your AI Memory",
                                          url: "https://maven.com/p/8fba42/improve-the-memory-of-your-ai-tools",
                                        },
                                      ].map((lesson) => (
                                        <a
                                          key={lesson.url}
                                          href={lesson.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="min-h-[44px] flex items-center justify-between px-4 py-3 text-sm font-medium text-ink dark:text-white hover:bg-mint/10 rounded-md transition-colors"
                                          onClick={() => setIsOpen(false)}
                                        >
                                          <span>{lesson.label}</span>
                                          <ExternalLink className="h-3 w-3 flex-shrink-0 ml-2" />
                                        </a>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            }
                            return (
                              <a
                                key={subItem.label}
                                href={subItem.href}
                                target={subItem.external ? "_blank" : undefined}
                                rel={subItem.external ? "noopener noreferrer" : undefined}
                                className="min-h-[44px] flex items-center justify-between px-4 py-3 text-base font-medium text-ink dark:text-white hover:bg-mint/10 rounded-md transition-colors"
                                onClick={() => setIsOpen(false)}
                              >
                                <span>{subItem.label}</span>
                                {subItem.external && <ExternalLink className="h-3 w-3" />}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    )}
                    {index < navItems.length - 1 && <div className="h-px bg-border my-2" />}
                  </div>
                ))}

                <Button
                  size="sm"
                  className="w-fit mx-4 mt-4"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("openConsultModal"));
                    setIsOpen(false);
                  }}
                >
                  Book a call
                </Button>
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
