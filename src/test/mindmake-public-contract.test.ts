import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { buildPrivateBriefHtml } from "@/components/mindmake/privateBriefHtml";
import {
  buildMindmakeBriefConfirmV2,
  buildMindmakeBriefRequestV2,
  NEWSLETTER_CONSENT_WORDING,
  NEWSLETTER_CONSENT_WORDING_VERSION,
} from "@/components/mindmake/leadDelivery";
import { blogPosts } from "@/data/blogPosts";
import { attendeeBrands, careerReferences, clientStories, homepageResultStories } from "@/data/rebuildProof";

const ROOT = resolve(__dirname, "../..");
const ACTIVE_SURFACES = [
  "src/pages/Index.tsx",
  "src/pages/AiBrain.tsx",
  "src/pages/AiGtm.tsx",
  "src/pages/CaseStudies.tsx",
  "src/pages/Contact.tsx",
  "src/pages/Alumni.tsx",
  "src/pages/Library.tsx",
  "src/pages/NewAgeLeadership.tsx",
  "src/pages/Blog.tsx",
  "src/pages/BlogPost.tsx",
  "src/pages/Privacy.tsx",
  "src/pages/Terms.tsx",
  "src/pages/NotFound.tsx",
  "src/components/BlogPostCard.tsx",
  "src/components/BookFitCall.tsx",
  "src/components/CookieConsent.tsx",
  "src/components/mindmake/LeadBrief.tsx",
  "src/components/mindmake/leadDelivery.ts",
  "src/components/mindmake/MediaFrame.tsx",
  "src/components/mindmake/BrainGtmGateway.tsx",
  "src/components/mindmake/MindmakeOpeningAct.tsx",
  "src/components/mindmake/MindmakeShell.tsx",
  "src/components/mindmake/ProofDeck.tsx",
  "src/components/mindmake/ScrollEvidenceMark.tsx",
  "src/components/mindmake/privateBriefHtml.ts",
  "src/components/FAQAccordion.tsx",
  "src/components/new-age/AgathaStory.tsx",
  "src/components/new-age/DecisionPromptSheet.tsx",
  "src/components/new-age/OrgChart.tsx",
  "src/components/new-age/OrgChartMobile.tsx",
  "src/components/new-age/orgChartData.ts",
  "src/data/blogPosts.ts",
  "src/data/rebuildProof.ts",
  "src/styles/mindmake.css",
  "src/styles/mindmake-gateway.css",
  "src/styles/mindmake-opening-act.css",
  "src/App.tsx",
  "vercel.json",
  "scripts/generate-llms.mjs",
  "scripts/generate-og-image.cjs",
  "scripts/generate-sitemap.mjs",
  "scripts/prerender.mjs",
  "public/llms.txt",
  "public/site.webmanifest",
  "index.html",
];

const read = (file: string) => readFileSync(resolve(ROOT, file), "utf8");
const sha256 = (file: string) => createHash("sha256")
  .update(readFileSync(resolve(ROOT, file))).digest("hex").toUpperCase();

describe("Mindmake public product contract", () => {
  it("keeps the approved V5 floor and Brain/GTM gateway byte-for-byte frozen", () => {
    expect(sha256("prototypes/mindmake-judgement-thread-motion-study-v5.html"))
      .toBe("DE09D75C46EB660AD6148C1D7F5DD61E4F82031B48FCFE931CC3AE05C8126C81");
    expect(sha256("prototypes/mindmake-brain-gtm-gateway-candidate-7-v2.html"))
      .toBe("5A3F68994BFBD2AF412D95776515CF8F7884150FE49991364DDC680E3B418E42");
    expect(sha256("src/components/mindmake/BrainGtmGateway.tsx"))
      .toBe("E95327BD7FFDC12071558CF05355411071FABC54AEE548D335EB32A07872017F");
    expect(sha256("src/styles/mindmake-gateway.css"))
      .toBe("1A3440796054A668191B4D54DC27C8D601C480E31E546E69D3300A6D9A8A2EBC");
  });

  it("keeps public diary links and retired copy out of active surfaces", () => {
    const blocked = /calendly\.com|Book a fit call|\bthesis\b|\$\s*254(?:,?000|K)\b/i;
    const leaks = ACTIVE_SURFACES.filter((file) => blocked.test(read(file)));
    expect(leaks).toEqual([]);
  });

  it("keeps the generated social card on the current brand and offer", () => {
    const generator = read("scripts/generate-og-image.cjs");
    expect(generator).toContain("mindmake.co");
    expect(generator).toContain("Build Your AI Brain");
    expect(generator).toContain("Build Your AI GTM");
    expect(generator).not.toMatch(/themindmaker\.ai|1:1 sprints|Mind Set\s+→/i);
  });

  it("keeps the new public copy free of em dashes", () => {
    const leaks = ACTIVE_SURFACES.filter((file) => read(file).includes("\u2014"));
    expect(leaks).toEqual([]);
  });

  it("keeps authored public copy in British English", () => {
    const leaks = ACTIVE_SURFACES.filter((file) => /\bjudgment\b/i.test(read(file)));
    expect(leaks).toEqual([]);
  });

  it("locks the approved V5 opening act and its two real paths", () => {
    const openingAct = read("src/components/mindmake/MindmakeOpeningAct.tsx");
    const gateway = read("src/components/mindmake/BrainGtmGateway.tsx");
    const homepage = read("src/pages/Index.tsx");

    expect(homepage).toContain("<MindmakeOpeningAct />");
    expect(openingAct).toContain("Put your best");
    expect(openingAct).toContain("judgement to work");
    expect(openingAct).toContain('href="#judgement-thread">Start here');
    expect(openingAct).toContain("<BrainGtmGateway />");
    expect(gateway).toContain("Pick your starting point");
    expect(gateway).toContain("Encode Your Vision");
    expect(gateway).toContain("Define How You Sell");
    expect(gateway).toContain("Build Your AI Brain");
    expect(gateway).toContain("Decide faster. Lead with confidence.");
    expect(gateway).toContain("Build Your AI GTM");
    expect(gateway).toContain("Product, price, message or team.");
    expect(gateway).toContain('to="/ai-brain"');
    expect(gateway).toContain('to="/ai-gtm"');
    expect(gateway).not.toContain("Ways to get started on your AI journey");
    expect(gateway).not.toContain("<video");
    expect(openingAct).not.toContain("mm-act-path-gate-media");
    expect(openingAct).not.toContain("decisionsFilm");
    expect(openingAct).toContain('id="proof"');
    expect(openingAct).toContain("brainVideoStart = .15");
    expect(openingAct).toContain("brainVideoEnd = 2.75");
    expect(openingAct).toContain("video.playbackRate = 1.8");
  });

  it("keeps decorative meta-heading chrome out of the V5 opening act", () => {
    const openingAct = read("src/components/mindmake/MindmakeOpeningAct.tsx");
    const blocked = /kicker|eyebrow|overline|pre[- ]heading|chapter[- ]label|decorative[- ]counter|status[- ]strap|proof[- ]badge|two places to use it|the two main events|a working ai brain|showing improve what you sell proof/i;

    expect(openingAct.match(blocked)).toBeNull();
  });

  it("keeps the homepage free of decorative kicker components", () => {
    const homepageSurfaces = [
      "src/pages/Index.tsx",
      "src/components/mindmake/MindmakeOpeningAct.tsx",
      "src/components/mindmake/ProofDeck.tsx",
    ];

    expect(homepageSurfaces.filter((file) => read(file).includes("mm-kicker"))).toEqual([]);
  });

  it("keeps decorative meta-heading patterns out of every public surface", () => {
    const blocked = /mm-kicker|\beyebrow\b|\boverline\b|pre[- ]?heading|chapter[- ]?label|status[- ]?strap|proof[- ]?badge/i;
    const leaks = ACTIVE_SURFACES.filter((file) => blocked.test(read(file)));
    expect(leaks).toEqual([]);
  });

  it("keeps every public starting action plain and consistent", () => {
    const rejected = /See your starting point|Build the starting point|Find a starting point|Follow one decision|A clear place to start/i;
    const leaks = ACTIVE_SURFACES.filter((file) => rejected.test(read(file)));
    expect(leaks).toEqual([]);

    const callToActionSurfaces = [
      "src/pages/Index.tsx",
      "src/pages/AiBrain.tsx",
      "src/pages/AiGtm.tsx",
      "src/components/BookFitCall.tsx",
      "src/components/mindmake/MindmakeOpeningAct.tsx",
      "src/components/mindmake/MindmakeShell.tsx",
      "scripts/generate-llms.mjs",
      "scripts/prerender.mjs",
    ].map(read).join("\n");
    expect(callToActionSurfaces).toContain("Start here");
  });

  it("keeps the two route names exact and calls the visitor choice a problem", () => {
    expect(read("src/pages/AiBrain.tsx")).toContain('title="Build Your AI Brain"');
    expect(read("src/pages/AiGtm.tsx")).toContain('title="Build Your AI GTM"');
    expect(read("scripts/prerender.mjs")).toContain('title: "Build Your AI Brain"');
    expect(read("scripts/prerender.mjs")).toContain('title: "Build Your AI GTM"');

    const visitorCopy = [
      "src/pages/Blog.tsx",
      "src/pages/BlogPost.tsx",
      "src/pages/Privacy.tsx",
      "scripts/generate-llms.mjs",
      "scripts/prerender.mjs",
    ];
    expect(visitorCopy.filter((file) => /\bpressure\b/i.test(read(file)))).toEqual([]);
  });

  it("keeps the root page from becoming a sticky-breaking scroll container", () => {
    const globalStyles = read("src/index.css");
    expect(globalStyles).toMatch(/body\s*\{[^}]*overflow-x:\s*clip;/s);
    expect(globalStyles).toMatch(/html\s*\{[^}]*overflow-x:\s*clip;/s);
    expect(globalStyles).not.toMatch(/body\s*\{[^}]*overflow-x:\s*hidden;/s);
    expect(globalStyles).not.toMatch(/html\s*\{[^}]*overflow-x:\s*hidden;/s);
  });

  it("keeps newsletter permission separate and unticked", () => {
    const leadBrief = read("src/components/mindmake/LeadBrief.tsx");
    expect(leadBrief).toContain("useState(false)");
    expect(NEWSLETTER_CONSENT_WORDING).toContain("an invitation to Mindmake's useful ideas by email");
    expect(leadBrief).toContain("NEWSLETTER_CONSENT_WORDING");
    expect(leadBrief).toContain("The publication box is separate and unticked.");
    expect(leadBrief).toContain("It records interest only. It does not subscribe you.");
  });

  it("makes the returned-time choice change both outputs", () => {
    const leadBrief = read("src/components/mindmake/LeadBrief.tsx");
    const leadDelivery = read("src/components/mindmake/leadDelivery.ts");
    expect(leadBrief).toContain("What that time could buy");
    expect(leadBrief).toContain("capacityValue: timeValue");
    expect(leadBrief).toContain("const timeValue = useMemo(() => capacityDetail(capacity)");
    expect(leadDelivery).toContain('"Grow this business": "grow-this-business"');
    expect(leadDelivery).toContain("returnedTimeId: RETURNED_TIME_IDS[capacityChoice]");
  });

  it("escapes visitor and company content in the downloaded brief", () => {
    const html = buildPrivateBriefHtml({
      company: '<script>alert("company")</script>',
      domain: "example.com",
      pressure: '<img src=x onerror="alert(1)">',
      capacityValue: "Protect buyer time.",
      known: "Useful & checked",
      evidence: ['A recent signal: <script>alert("signal")</script>'],
      carry: "Prepare the work.",
      human: "Make the call.",
      proof: "Test one real decision.",
    });

    expect(html).not.toContain("<script>alert");
    expect(html).not.toContain("<img src=x");
    expect(html).toContain("&lt;script&gt;");
    expect(html).toContain("Useful &amp; checked");
    expect(html).not.toMatch(/fonts\.googleapis|fonts\.gstatic|@import\s+url/i);
  });

  it("blocks persuasion-only prototype phrases from active pages", () => {
    const blocked = /the result is the picture|we do not need fake images|one change\. two views\.|start small\. keep what works\./i;
    const leaks = ACTIVE_SURFACES.filter((file) => blocked.test(read(file)));
    expect(leaks).toEqual([]);
  });

  it("keeps retired offers and unsupported sales claims out of public articles", () => {
    const publicArticleCopy = blogPosts
      .flatMap((post) => [post.title, post.excerpt, post.metaDescription, post.content, ...post.tags])
      .join("\n");
    const blocked = /Builder Session|Orchestrator Session|Builder Sprint|Leadership Lab|\$\s*(?:1,500|15,000)|10[-–]20x|\b(?:20x|50x)\b|3[-–]5 working systems|retention drops to near-zero|hundreds of (?:leaders|engagements)|AI consumers are increasingly replaceable|Diagnosis Room/i;

    expect(publicArticleCopy.match(blocked)).toBeNull();
    expect(blogPosts.map((post) => post.slug).join("\n")).not.toMatch(/10-20x|sprint/i);
  });

  it("keeps general contact honest and outside the retired lead pipeline", () => {
    const contact = read("src/pages/Contact.tsx");
    expect(contact).toContain("mailto:krish@mindmake.co");
    expect(contact).toContain("Nothing is sent until you press Send there.");
    expect(contact).toContain('href="/privacy"');
    expect(contact).not.toContain("send-contact-email");
    expect(contact).not.toContain("Krish has it");
  });

  it("keeps the public articles in plain language", () => {
    const publicArticleCopy = blogPosts
      .flatMap((post) => [post.title, post.excerpt, post.metaDescription, post.content, ...post.tags])
      .join("\n");
    const blocked = /\b(?:thesis|frameworks?|governance|synthesis|synthesise|orchestrate|orchestrator|autonomously|capability|capabilities|leverage|leveraged|methodology|deliverables?|roadmap|use cases?)\b/i;
    expect(publicArticleCopy.match(blocked)).toBeNull();
  });

  it("keeps the worked org-chart example value-first", () => {
    const chartCopy = [
      "src/pages/NewAgeLeadership.tsx",
      "src/components/new-age/AgathaStory.tsx",
      "src/components/new-age/DecisionPromptSheet.tsx",
      "src/components/new-age/OrgChart.tsx",
      "src/components/new-age/orgChartData.ts",
    ].map(read).join("\n");
    expect(chartCopy).not.toMatch(/Take a decision like this apart|Decision you'd face|href="\/sprint"/i);
    expect(chartCopy).toContain("Useful question");
    expect(chartCopy).toContain("Start here");
  });

  it("keeps the desktop organisation chart keyboard-operable", () => {
    const chart = read("src/components/new-age/OrgChart.tsx");
    expect(chart).toContain("<motion.button");
    expect(chart).toContain("aria-label={`Open the question for ${label}`}");
    expect(chart).toContain("nodesFocusable={false}");
    expect(chart).toContain('aria-pressed={state === "traditional"}');
    expect(chart).toContain('aria-pressed={state === "new-age"}');
  });

  it("honours reduced-motion preferences on the worked example", () => {
    const animatedSurfaces = [
      "src/pages/NewAgeLeadership.tsx",
      "src/components/new-age/AgathaStory.tsx",
      "src/components/new-age/DecisionPromptSheet.tsx",
    ];

    animatedSurfaces.forEach((file) => {
      const source = read(file);
      expect(source).toContain("useReducedMotion");
      expect(source).toContain("reduceMotion ? false");
      expect(source).toContain("reduceMotion ? { duration: 0 }");
    });
  });

  it("uses a two-tone focus indicator across Mindmake form controls", () => {
    const styles = read("src/styles/mindmake.css");
    expect(styles).toContain(".mm-site textarea:focus-visible");
    expect(styles).toContain(".mm-site select:focus-visible");
    expect(styles).toContain("outline: 3px solid var(--mm-paper-bright)");
    expect(styles).toContain("box-shadow: 0 0 0 8px var(--mm-ink)");
  });

  it("keeps homepage proof in the rebuild proof source of truth", () => {
    const proofDeck = read("src/components/mindmake/ProofDeck.tsx");
    const homepage = read("src/pages/Index.tsx");

    expect(clientStories).toHaveLength(8);
    expect(careerReferences).toHaveLength(6);
    expect(homepageResultStories.map(({ id }) => id)).toEqual([
      "expensive-decision",
      "sellable-expertise",
      "simple-product",
    ]);
    expect(attendeeBrands.map(({ name }) => name)).toEqual(["BBC", "Hearst", "Condé Nast"]);
    expect(proofDeck).toContain('from "@/data/rebuildProof"');
    expect(proofDeck).toContain("careerReferences");
    expect(proofDeck).not.toContain("clientStories");
    expect(proofDeck).not.toContain("One day. One decision. No more Monday debates.");
    expect(homepage).toContain("homepageResultStories.map");
    expect(homepage).toContain("attendeeBrands.map");
    expect(homepage).toContain("<CareerReferenceDeck />");
    expect(homepage).not.toContain("<ProofDeck />");
    expect(homepage).not.toContain("Ashley Wales-Brown");
    expect(homepage).not.toMatch(/assets\/brands\/(?:bbc|hearst|conde-nast)/);
    expect(homepage).not.toContain("const resultStories =");
  });

  it("anchors the one hand-drawn evidence mark to the result it explains", () => {
    const homepage = read("src/pages/Index.tsx");
    const mark = read("src/components/mindmake/ScrollEvidenceMark.tsx");

    expect(homepage).toContain("<ScrollEvidenceMark />");
    expect(homepage.match(/<svg/g)).toBeNull();
    expect(mark).toContain('className="mm-evidence-target"');
    expect(mark).toContain('className="mm-evidence-mark"');
    expect(mark).toContain("--mm-mark-progress");
    expect(mark).toContain('addEventListener("scroll"');
    expect(mark).toContain("prefers-reduced-motion: reduce");
  });

  it("uses one article archive and a separate answers route", () => {
    const app = read("src/App.tsx");
    const redirects = read("vercel.json");
    expect(app).toContain('<Route path="/library" element={<Navigate to="/blog" replace />} />');
    expect(app).toContain('<Route path="/faq" element={<Questions />} />');
    expect(redirects).toContain('{ "source": "/library", "destination": "/blog"');
  });

  it("does not truncate article titles or summaries", () => {
    const articleSurfaces = ["src/pages/Blog.tsx", "src/pages/BlogPost.tsx", "src/components/BlogPostCard.tsx"];
    const truncated = articleSurfaces.filter((file) => /line-clamp|text-overflow:\s*ellipsis/i.test(read(file)));
    expect(truncated).toEqual([]);
  });

  it("keeps the checked article archive as the public source of truth", () => {
    const hook = read("src/hooks/useBlogPosts.ts");
    expect(hook).toContain('queryKey: ["mindmake-public-articles"]');
    expect(hook).not.toContain('from("blog_posts")');
  });

  it("keeps the brief hand-off pinned, disabled by default and conservative", () => {
    const leadBrief = read("src/components/mindmake/LeadBrief.tsx");
    expect(leadBrief).toContain('VITE_MINDMAKE_BRIEF_HANDOFF_ENABLED === "true"');
    expect(leadBrief).toContain('"submit-mindmake-brief"');
    expect(leadBrief).not.toContain("send-contact-email");
    expect(leadBrief).toContain('handoffResult?.operatorDelivery === "queued"');
    expect(leadBrief).toContain('handoffResult?.visitorDelivery === "queued"');
    expect(leadBrief).not.toContain("Boolean(handoffResult?.leadId)");
    expect(leadBrief).toContain("neither hand-off was confirmed");
    expect(leadBrief).toContain("publication-choice-mismatch");
    expect(leadBrief).toContain("six-digit code");
    expect(leadBrief).toContain("Nothing is sent to Krish until you confirm the code.");
    expect(leadBrief).toContain('href="/privacy"');
  });

  it("keeps the public request identifier-only and confirms the verified email separately", () => {
    const request = buildMindmakeBriefRequestV2({
      domain: "example.com",
      email: "leader@example.com",
      pressure: "Our price no longer matches the value",
      capacityChoice: "Grow this business",
      publicationRequested: false,
      requestId: "request-123",
      route: "gtm",
    });
    const confirmation = buildMindmakeBriefConfirmV2({
      code: " 123456 ",
      email: "leader@example.com",
      requestId: "request-123",
    });

    expect(request).toEqual({
      version: 2,
      action: "request",
      requestId: "request-123",
      contact: { email: "leader@example.com" },
      company: { domain: "example.com" },
      choices: {
        pressureId: "price-no-longer-matches-value",
        returnedTimeId: "grow-this-business",
        entryRoute: "gtm",
      },
      consent: {
        publicationRequested: false,
        wordingVersion: NEWSLETTER_CONSENT_WORDING_VERSION,
      },
      website: "",
    });
    expect(confirmation).toEqual({
      version: 2,
      action: "confirm",
      requestId: "request-123",
      contact: { email: "leader@example.com" },
      code: "123456",
    });
    expect(JSON.stringify(request)).not.toMatch(/brief|recommendation|evidence|proof|known|human|carry/i);
  });
});
