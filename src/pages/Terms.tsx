import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { SEO } from "@/components/SEO";

const Terms = () => {
  const navigate = useNavigate();

  const seoData = {
    title: "Terms & Conditions - Mindmaker",
    description: "Terms and conditions for using Mindmaker LLC services. Read our service agreement and policies.",
    canonical: "/terms",
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO {...seoData} />
      <div className="container-width py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-8 p-2"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Home
        </Button>

        <div className="max-w-4xl mx-auto prose prose-gray dark:prose-invert">
          <h1 className="text-3xl font-bold mb-8">Terms & Conditions</h1>
          <p className="text-muted-foreground mb-8">Effective Date: January 1, 2025</p>

          <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="mb-4">
              By accessing or using Mindmaker LLC's services, website, or programs, you agree to be bound by these Terms & Conditions ("Terms"). If you do not agree to these Terms, please do not use our services.
            </p>
          </section>

          <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. Description of Services</h2>
            <p className="mb-4">
              Mindmaker LLC provides business and AI advisory services, including:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Time-limited business decision Sprints</li>
              <li>Product, pricing, sales and company strategy advice</li>
              <li>Research, interviews and practical working sessions</li>
              <li>Digital content and resources</li>
              <li>Coaching and advisory services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">3. User Responsibilities</h2>
            <p className="mb-4">You agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Use our services for lawful purposes only</li>
              <li>Respect intellectual property rights</li>
              <li>Maintain the confidentiality of your account information</li>
              <li>Not interfere with or disrupt our services</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">4. Payment Terms</h2>
            <p className="mb-4">
              Payment terms for our services are as follows:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Payment is due as specified in your service agreement</li>
              <li>All fees are non-refundable unless otherwise stated</li>
              <li>We reserve the right to change our fees with 30 days notice</li>
              <li>Late payments may result in suspension of services</li>
            </ul>
          </section>

          <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              All content, materials, and intellectual property provided through Mindmaker LLC services are owned by us or our licensors. You may not:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Copy, distribute, or reproduce our materials without permission</li>
              <li>Use our trademarks or logos without authorization</li>
              <li>Reverse engineer or attempt to extract source code</li>
              <li>Create derivative works based on our content</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">6. Cancellation and Refunds</h2>
            <p className="mb-4">
              Cancellation policies vary by service type:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Individual sessions: 24-hour cancellation notice required</li>
              <li>Program enrollments: Refunds available within 7 days of purchase</li>
              <li>Ongoing coaching: 30-day notice required for cancellation</li>
              <li>Digital content: No refunds after access is granted</li>
            </ul>
          </section>

          <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Limitation of Liability</h2>
            <p className="mb-4">
              To the maximum extent permitted by law, Mindmaker LLC shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services. Our total liability shall not exceed the amount you paid for the specific service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">8. Privacy</h2>
            <p className="mb-4">
              Your privacy is important to us. Please review our Privacy Policy to understand how we collect, use, and protect your information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">9. Modifications</h2>
            <p className="mb-4">
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting on our website. Your continued use of our services constitutes acceptance of the modified Terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">10. Termination</h2>
            <p className="mb-4">
              We may terminate or suspend your access to our services immediately, without prior notice, for any breach of these Terms or for any other reason we deem appropriate.
            </p>
          </section>

          <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">11. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction where Mindmaker LLC operates, without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4">12. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms & Conditions, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p><strong>Mindmaker LLC</strong></p>
              <p>Email: legal@themindmaker.ai</p>
              <p>Website: https://www.themindmaker.ai</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
