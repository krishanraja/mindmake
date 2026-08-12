import { useState, useEffect } from "react";
import { ArrowLeft, Shield, ChevronDown, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PrivacySection {
  id: string;
  title: string;
  content: React.ReactNode;
}

const privacySections: PrivacySection[] = [
  {
    id: "information-collection",
    title: "1. Information We Collect",
    content: (
      <>
        <p className="mb-4">
          Mindmaker LLC ("we," "our," or "us") collects information you provide directly to us, such as when you:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Ask about or take part in a Mindmaker Sprint</li>
          <li>Contact us through our website or email</li>
          <li>Take part in interviews or working sessions</li>
          <li>Subscribe to our newsletters or content hub</li>
          <li>Book a fit call through our booking provider</li>
        </ul>
        <p className="mb-4">
          <strong>Types of information collected may include:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Name and contact information (email, phone number)</li>
          <li>Professional information (job title, company, industry)</li>
          <li>Payment information (processed securely through third-party providers)</li>
          <li>Session notes and assessment results</li>
          <li>Communications you send to us</li>
        </ul>
      </>
    )
  },
  {
    id: "information-use",
    title: "2. How We Use Your Information",
    content: (
      <>
        <p className="mb-4">We use the information we collect to:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide, maintain, and improve our advisory services</li>
          <li>Communicate with you about our Sprint and other services</li>
          <li>Tailor our work and recommendations to your business</li>
          <li>Send you educational content, updates, and marketing communications (with your consent)</li>
          <li>Analyze usage patterns to improve our offerings</li>
          <li>Process payments and prevent fraud</li>
          <li>Comply with legal obligations</li>
        </ul>
      </>
    )
  },
  {
    id: "information-sharing",
    title: "3. Information Sharing",
    content: (
      <>
        <p className="mb-4">
          We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described below:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Service providers:</strong> Third parties who assist us in operating our business (e.g., payment processors, email services, scheduling tools)</li>
          <li><strong>Legal requirements:</strong> When required by law, court order, or governmental authority</li>
          <li><strong>Business transfers:</strong> In connection with any merger, acquisition, or sale of company assets</li>
          <li><strong>With your consent:</strong> When you explicitly agree to share your information</li>
        </ul>
      </>
    )
  },
  {
    id: "data-security",
    title: "4. Data Security",
    content: (
      <>
        <p className="mb-4">
          We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li>Encryption of data in transit and at rest</li>
          <li>Regular security assessments and updates</li>
          <li>Limited access to personal information on a need-to-know basis</li>
          <li>Secure third-party service providers with appropriate data protection agreements</li>
        </ul>
        <p>
          However, no method of transmission over the internet or electronic storage is 100% secure. While we strive to protect your information, we cannot guarantee absolute security.
        </p>
      </>
    )
  },
  {
    id: "your-rights",
    title: "5. Your Rights",
    content: (
      <>
        <p className="mb-4">Depending on your location, you may have the following rights regarding your personal information:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li><strong>Access:</strong> Request a copy of the personal information we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete information</li>
          <li><strong>Deletion:</strong> Request deletion of your personal information</li>
          <li><strong>Opt-out:</strong> Unsubscribe from marketing communications at any time</li>
          <li><strong>Portability:</strong> Request a portable copy of your data</li>
          <li><strong>Restriction:</strong> Request limitation of processing in certain circumstances</li>
        </ul>
        <p className="mt-4">
          To exercise these rights, please contact us at <a href="mailto:privacy@themindmaker.ai" className="text-mint-dark dark:text-mint hover:underline">privacy@themindmaker.ai</a>.
        </p>
      </>
    )
  },
  {
    id: "cookies",
    title: "6. Cookies and Tracking",
    content: (
      <>
        <p className="mb-4">
          We use cookies and similar technologies to enhance your experience on our website. These include:
        </p>
        <ul className="list-disc pl-6 mb-4 space-y-2">
          <li><strong>Essential cookies:</strong> Necessary for the website to function properly</li>
          <li><strong>Analytics cookies:</strong> Help us understand how visitors interact with our website</li>
          <li><strong>Preference cookies:</strong> Remember your settings and preferences</li>
          <li><strong>Marketing cookies:</strong> Used to deliver relevant advertisements (with your consent)</li>
        </ul>
        <p>
          You can control cookie settings through your browser preferences. Note that disabling certain cookies may affect website functionality.
        </p>
      </>
    )
  },
  {
    id: "third-party",
    title: "7. Third-Party Links",
    content: (
      <>
        <p>
          Our website may contain links to third-party websites, including our service providers like Calendly, Maven, and Substack. We are not responsible for the privacy practices of these external sites and encourage you to review their privacy policies before providing any personal information.
        </p>
      </>
    )
  },
  {
    id: "retention",
    title: "8. Data Retention",
    content: (
      <>
        <p className="mb-4">
          We retain your personal information for as long as necessary to:
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Provide our services to you</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes and enforce agreements</li>
          <li>Maintain business records as required by law</li>
        </ul>
        <p className="mt-4">
          When information is no longer needed, we securely delete or anonymize it.
        </p>
      </>
    )
  },
  {
    id: "changes",
    title: "9. Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy from time to time to reflect changes in our practices or legal requirements. We will notify you of any material changes by posting the new policy on this page with an updated effective date. We encourage you to review this policy periodically.
        </p>
      </>
    )
  },
  {
    id: "contact",
    title: "10. Contact Us",
    content: (
      <>
        <p className="mb-4">
          If you have any questions about this Privacy Policy or our data practices, please contact us at:
        </p>
        <div className="p-6 rounded-xl bg-muted/50 border border-border">
          <p className="font-semibold mb-2">Mindmaker LLC</p>
          <p className="mb-1">Email: <a href="mailto:privacy@themindmaker.ai" className="text-mint-dark dark:text-mint hover:underline">privacy@themindmaker.ai</a></p>
          <p className="mb-1">General inquiries: <a href="mailto:krish@themindmaker.ai" className="text-mint-dark dark:text-mint hover:underline">krish@themindmaker.ai</a></p>
          <p>Website: <a href="https://themindmaker.ai" className="text-mint-dark dark:text-mint hover:underline">themindmaker.ai</a></p>
        </div>
      </>
    )
  }
];

const Privacy = () => {
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(privacySections.map(s => s.id)));
  const [activeSection, setActiveSection] = useState<string>(privacySections[0].id);

  const toggleSection = (id: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedSections(newExpanded);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Make sure section is expanded
      setExpandedSections(prev => new Set([...prev, id]));
    }
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = privacySections.map(s => ({
        id: s.id,
        offset: document.getElementById(s.id)?.offsetTop || 0
      }));

      const scrollPosition = window.scrollY + 150;
      
      for (let i = sections.length - 1; i >= 0; i--) {
        if (scrollPosition >= sections[i].offset) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const seoData = {
    title: "Privacy Policy - Mindmaker",
    description: "Privacy policy for Mindmaker LLC. Learn how we collect, use, and protect your personal information.",
    canonical: "/privacy",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seoData} />
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container-width">
          {/* Header */}
          <div className="mb-12">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className="mb-6 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-mint/10">
                  <Shield className="h-6 w-6 text-mint-dark dark:text-mint" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Legal
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-display">
                Privacy Policy
              </h1>
              <p className="text-lg text-muted-foreground mb-4">
                Your privacy matters. Here's how we collect, use, and protect your information.
              </p>
              <p className="text-sm text-muted-foreground">
                <strong>Effective Date:</strong> January 1, 2025 | <strong>Last Updated:</strong> January 1, 2025
              </p>
            </div>
          </div>

          <div className="flex gap-12">
            {/* Table of Contents - Desktop Sticky Sidebar */}
            <aside className="hidden lg:block w-64 shrink-0">
              <div className="sticky top-28">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                  Contents
                </h3>
                <nav className="space-y-1">
                  {privacySections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={cn(
                        "block w-full text-left px-3 py-2 text-sm rounded-lg transition-colors",
                        activeSection === section.id
                          ? "bg-mint/10 text-mint-dark dark:text-mint font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 max-w-3xl">
              <div className="space-y-4">
                {privacySections.map((section) => {
                  const isExpanded = expandedSections.has(section.id);
                  
                  return (
                    <div
                      key={section.id}
                      id={section.id}
                      className={cn(
                        "border rounded-xl overflow-hidden transition-all duration-300",
                        isExpanded 
                          ? "border-border bg-card" 
                          : "border-border bg-card/50 hover:border-mint/30"
                      )}
                    >
                      <button
                        onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-6 text-left group"
                      >
                        <h2 className="text-lg font-semibold text-foreground group-hover:text-mint transition-colors">
                          {section.title}
                        </h2>
                        <ChevronDown className={cn(
                          "h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-300",
                          isExpanded && "rotate-180"
                        )} />
                      </button>
                      
                      <div className={cn(
                        "overflow-hidden transition-all duration-300",
                        isExpanded ? "max-h-[2000px]" : "max-h-0"
                      )}>
                        <div className="px-6 pb-6 pt-0 text-foreground leading-relaxed">
                          {section.content}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Additional Links */}
              <div className="mt-12 p-6 rounded-xl bg-muted/50 border border-border">
                <h3 className="font-semibold mb-4">Related Policies</h3>
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="/terms" 
                    className="flex items-center gap-2 text-sm text-mint-dark dark:text-mint hover:underline"
                  >
                    Terms & Conditions
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <a 
                    href="/contact" 
                    className="flex items-center gap-2 text-sm text-mint-dark dark:text-mint hover:underline"
                  >
                    Contact Us
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Privacy;
