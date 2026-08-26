import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import "@/styles/mindmake.css";

const sections = [
  {
    title: "1. Using this website",
    body: <><p>Mindmake is the public brand of Mindmaker LLC. By using this website, you agree to use it lawfully and not damage, copy or disrupt it.</p><p>The public starting brief is an early view based on limited information. It is not a promise, a full diagnosis or professional legal, financial or tax advice.</p></>,
  },
  {
    title: "2. Paid work",
    body: <><p>Paid work may include a time-limited proof, product and company advice, research, working sessions, coaching, systems or longer advisory work.</p><p>Each piece of paid work has its own written agreement. That agreement sets the scope, timing, price, payment dates, ownership, confidentiality, cancellation terms and any result Mindmake has agreed to deliver. If it differs from this page, the written agreement takes priority.</p></>,
  },
  {
    title: "3. Your part",
    body: <><p>You agree to give accurate information, keep account details safe, respect other people's rights and use the work lawfully. You remain responsible for the business decisions you make and for checking advice where another professional is needed.</p></>,
  },
  {
    title: "4. Payment and cancellation",
    body: <><p>Prices and payment dates are agreed before paid work starts. Late payment may pause the work. Refunds, cancellation rights and notice periods are set in the written agreement for that work.</p></>,
  },
  {
    title: "5. Ownership and permission",
    body: <><p>Mindmake keeps its existing brand, methods, tools, templates and general know-how. You keep the business information and material you bring to the work. The written agreement explains who owns new customer-specific work and what each side may keep using.</p><p>You may not use the Mindmake name, logo or website material without written permission.</p></>,
  },
  {
    title: "6. Confidentiality and privacy",
    body: <><p>Private business information is handled under the written agreement for paid work. The <a href="/privacy">privacy policy</a> explains how personal information is handled on this site.</p></>,
  },
  {
    title: "7. Availability and limits",
    body: <><p>We try to keep the website accurate and available, but public content may change and the site may sometimes be unavailable.</p><p>Any limit on liability for paid work is set in its written agreement and applies only as far as the law allows. Nothing on this page removes a right that the law does not allow us to remove.</p></>,
  },
  {
    title: "8. Ending access",
    body: <><p>We may block website access that is unlawful, harmful or abusive. Either side may end paid work only under its written agreement.</p></>,
  },
  {
    title: "9. Law and changes",
    body: <><p>The law and dispute process for paid work are set in its written agreement. We may update these website terms. The latest date will appear at the top of this page.</p></>,
  },
  {
    title: "10. Contact",
    body: <><p>Questions can be sent to <a href="mailto:krish@themindmaker.ai">krish@themindmaker.ai</a>.</p><p>Mindmaker LLC<br />Mindmake<br />mindmake.co</p></>,
  },
] as const;

export default function Terms() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
      <SEO title="Terms and conditions" description="Terms for using the Mindmake website and services." canonical="/terms" />
      <article className="mm-legal-page">
        <header className="mm-container mm-legal-hero">
          <h1>Terms and conditions.</h1>
          <p>The short version is simple: use the site lawfully, and agree the details of paid work in writing before it starts.</p>
          <small>Last updated: 26 August 2026</small>
        </header>
        <div className="mm-container mm-legal-sections">
          {sections.map((section) => <section key={section.title}><h2>{section.title}</h2><div>{section.body}</div></section>)}
        </div>
      </article>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
