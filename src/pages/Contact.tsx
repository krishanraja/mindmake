import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Send, Calendar, ExternalLink, Linkedin, Mail, MapPin, Building, User, Briefcase, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import krishHeadshot from "@/assets/krish-headshot.png";
import { SEO } from "@/components/SEO";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { InitialConsultModal } from "@/components/InitialConsultModal";
import { useSessionData } from "@/contexts/SessionDataContext";

const Contact = () => {
  const navigate = useNavigate();
  const { sessionData } = useSessionData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
    interest: "",
    message: "",
  });

  const seoData = {
    title: "Contact Us - Mindmaker",
    description: "Get in touch with Mindmaker. Have a nervous decision about AI? We'd love to hear from you.",
    canonical: "/contact",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase.functions.invoke("send-contact-email", {
        body: {
          name: formData.name,
          email: formData.email,
          message: `
Company: ${formData.company || "Not provided"}
Role: ${formData.role || "Not provided"}
Interest: ${formData.interest || "Not specified"}

Message:
${formData.message}
          `.trim()
        },
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Message sent successfully! Krish will get back to you soon.");
      setFormData({ name: "", email: "", company: "", role: "", interest: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try again or email directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const interestOptions = [
    { value: "4-week-sprint", label: "4-Week Decision Sprint" },
    { value: "90-day-sprint", label: "90-Day Concierge Sprint" },
    { value: "not-sure", label: "Not sure yet" },
  ];

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
                  <Mail className="h-6 w-6 text-mint-dark dark:text-mint" />
                </div>
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Connect
                </span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 font-display">
                Let's <span className="text-mint dark:text-mint">Talk</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                Have a nervous decision about AI or want to explore working together? 
                I'd love to hear from you.
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Left Column - About & Quick Actions */}
            <div className="lg:col-span-2 space-y-8">
              {/* Krish Profile Card */}
              <div className="p-6 rounded-2xl border border-border bg-card">
                <div className="flex items-start gap-5 mb-6">
                  <img 
                    src={krishHeadshot} 
                    alt="Krish Raja" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-mint/30"
                  />
                  <div>
                    <h2 className="text-xl font-bold text-foreground">Krish Raja</h2>
                    <p className="text-muted-foreground text-sm">Founder, Mindmaker</p>
                    <a 
                      href="https://www.krishraja.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-mint-dark dark:text-mint hover:underline mt-1"
                    >
                      krishraja.com
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
                
                <p className="text-sm text-foreground leading-relaxed mb-4">
                  I help senior business leaders become AI-literate by building working AI systems 
                  around their real work—not through vendor theatre or theoretical training.
                </p>
                
                <p className="text-sm text-foreground leading-relaxed mb-6">
                  With 16+ years scaling businesses from zero to multi-million dollar revenue 
                  across the UK, USA, and Australia, I bring operator experience to AI transformation. 
                  I've worked with Microsoft, Nine, BBC, and Singtel on data and tech monetization strategies.
                </p>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a 
                      href="https://www.linkedin.com/in/krish-raja/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="h-4 w-4 mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                  >
                    <a href="mailto:krish@themindmaker.ai">
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* Mission Statement */}
              <div className="dark-cta-card !p-6">
                <h3 className="text-lg font-bold mb-3">Why This Mission Matters</h3>
                <p className="text-sm leading-relaxed mb-4">
                  AI literacy will be the defining skill of the next decade. Yet most leaders 
                  are stuck between vendor hype and technical jargon. They need practical 
                  capability, not more theory.
                </p>
                <p className="text-sm leading-relaxed">
                  My mission is to ensure senior leaders can confidently integrate AI into 
                  their work—making informed strategic decisions and leading their organizations 
                  through the AI transformation with clarity.
                </p>
              </div>

              {/* Quick Book CTA */}
              <div className="p-6 rounded-2xl border border-mint/30 bg-mint/5">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="h-5 w-5 text-mint-dark dark:text-mint" />
                  <h3 className="font-semibold">Ready to Start?</h3>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Start with a free conversation. No decks, no demos—just clarity on your nervous decision.
                </p>
                <Button 
                  variant="mint"
                  className="w-full"
                  onClick={() => setConsultModalOpen(true)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  What's your nervous decision?
                </Button>
              </div>

              {/* Direct Contact */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Direct Contact
                </h3>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <a href="mailto:krish@themindmaker.ai" className="text-foreground hover:text-mint transition-colors">
                    krish@themindmaker.ai
                  </a>
                </div>
                
                {/* Global Offices */}
                <div className="pt-2">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                    Global Offices
                  </h4>
                  <div className="grid gap-3">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <MapPin className="h-4 w-4 text-mint-dark dark:text-mint mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Brooklyn, New York</p>
                        <p className="text-xs text-muted-foreground">United States</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <MapPin className="h-4 w-4 text-mint-dark dark:text-mint mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">London</p>
                        <p className="text-xs text-muted-foreground">England</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border border-border/50">
                      <MapPin className="h-4 w-4 text-mint-dark dark:text-mint mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-foreground">Sydney</p>
                        <p className="text-xs text-muted-foreground">Australia</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:col-span-3">
              {isSubmitted ? (
                <div className="p-8 md:p-12 rounded-2xl border border-mint/30 bg-mint/5 text-center">
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-mint/20 flex items-center justify-center">
                    <CheckCircle2 className="h-8 w-8 text-mint-dark dark:text-mint" />
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Message Received!</h2>
                  <p className="text-muted-foreground mb-6">
                    Thanks for reaching out. I typically respond within 24-48 hours. 
                    In the meantime, feel free to explore the blog or book a session directly.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button 
                      variant="outline"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                    <Button 
                      onClick={() => setConsultModalOpen(true)}
                    >
                      Start the Conversation
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-8 md:p-10 rounded-2xl border border-border bg-card">
                  <h2 className="text-2xl font-bold mb-2">Send a Message</h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and I'll get back to you as soon as possible.
                  </p>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email Row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                          <User className="h-3.5 w-3.5 inline mr-1.5 text-muted-foreground" />
                          Your Name *
                        </label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="John Smith"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                          <Mail className="h-3.5 w-3.5 inline mr-1.5 text-muted-foreground" />
                          Email Address *
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="john@company.com"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Company & Role Row */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-foreground mb-2">
                          <Building className="h-3.5 w-3.5 inline mr-1.5 text-muted-foreground" />
                          Company
                        </label>
                        <Input
                          id="company"
                          name="company"
                          placeholder="Acme Inc"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        />
                      </div>
                      <div>
                        <label htmlFor="role" className="block text-sm font-medium text-foreground mb-2">
                          <Briefcase className="h-3.5 w-3.5 inline mr-1.5 text-muted-foreground" />
                          Your Role
                        </label>
                        <Input
                          id="role"
                          name="role"
                          placeholder="CEO, VP Product, etc."
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        />
                      </div>
                    </div>

                    {/* Interest */}
                    <div>
                      <label htmlFor="interest" className="block text-sm font-medium text-foreground mb-2">
                        Which sprint interests you?
                      </label>
                      <Select
                        value={formData.interest}
                        onValueChange={(value) => setFormData({ ...formData, interest: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose one..." />
                        </SelectTrigger>
                        <SelectContent>
                          {interestOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                        Message *
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="What's your nervous decision? Tell me what you're working through..."
                        required
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="resize-none"
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Sending...</>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      Messages go directly to Krish. Expect a response within 24-48 hours.
                    </p>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Consult Modal */}
      <InitialConsultModal
        open={consultModalOpen}
        onOpenChange={setConsultModalOpen}
        preselectedProgram={sessionData.qualificationData?.preselectedProgram}
        commitmentLevel={sessionData.qualificationData?.commitmentLevel}
        audienceType={sessionData.qualificationData?.audienceType}
        pathType={sessionData.qualificationData?.pathType}
      />
    </div>
  );
};

export default Contact;
