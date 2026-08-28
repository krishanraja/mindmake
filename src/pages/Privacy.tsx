import { useState } from "react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import "@/styles/mindmake.css";

const sections = [
  {
    title: "1. Who we are",
    body: <><p>Mindmake is the public brand of Mindmaker LLC. You can contact us at <a href="mailto:privacy@mindmake.co">privacy@mindmake.co</a>.</p></>,
  },
  {
    title: "2. What we collect",
    body: <><p>We collect only what is needed for the part of Mindmake you choose to use.</p><ul><li>For a private starting brief: your work email, the company website, the problem and use of time you choose, the page where you began and your separate publication-interest choice.</li><li>For a general message: your name, email, company if supplied and the message.</li><li>For paid work: the business information, files, notes and payment records needed to do the agreed work.</li><li>For the publication: your email and subscription choices, handled through the publication provider.</li><li>For the website: basic visit information and the privacy choice stored on your device.</li></ul><p>The private brief may use public information about the company. It stores the resulting company read, the brief choices and delivery records. The private brief database does not store the six-digit code, your raw internet address or a plain description of your browser. It stores one-way security codes made from some of this information to limit abuse.</p></>,
  },
  {
    title: "3. Why we use it",
    body: <><p>Before you confirm your email, we use the information to research the company, prepare the brief, send the code and protect the service from misuse. Nothing is sent to us from the brief until the code is confirmed.</p><p>After confirmation, Mindmake tries to send your brief to you and a separate fit summary to our team. The summary contains your email, company, choices, public company read and a server-made starting recommendation. Either email can fail on its own. No automated sales sequence follows.</p><p>The publication box is separate and unticked. It records interest only. It does not subscribe you or authorise an automatic import. A publication sign-up must be completed separately.</p><p>We may also use information to take steps you ask for before a contract, to carry out a contract, to meet a legal duty and for the reasonable needs of running, protecting and improving Mindmake.</p></>,
  },
  {
    title: "4. Who helps us handle it",
    body: <><p>Mindmake uses trusted providers for website hosting, data storage, email, company research, AI services, privacy-friendly analytics, payments and publication delivery. These providers process information for the service they supply. Some may process data outside your country.</p><p>We do not sell personal information. We may share it when the law requires this, when a business transfer requires it or when you ask us to.</p><p>You can ask for the current provider list and transfer safeguards by emailing us.</p></>,
  },
  {
    title: "5. Analytics and your device",
    body: <><p>The site uses privacy-friendly analytics to count visits and understand which pages help. It does not use advertising cookies. Your privacy choice is kept on your device so the site can remember it.</p><p>External sites, including the Mindmake publication, have their own privacy terms.</p></>,
  },
  {
    title: "6. How long we keep it",
    body: <><p>A private-brief code works for ten minutes. Five failed tries stop it. The code itself is not stored.</p><p>Private-brief records are deleted on a schedule. A request that is never confirmed is deleted 7 days after it was made. The one-way abuse-limit records are deleted after 48 hours. A confirmed request, together with its consent and delivery records, is deleted 12 months after it last changed. You can ask for earlier deletion at any time. We first check the request really comes from you, then delete the record unless a legal duty requires part of it to be kept elsewhere.</p><p>Other information is kept only while it is needed for the reason it was collected, an active customer relationship, security, normal business records or a legal duty. You can ask what is held and why it is held.</p></>,
  },
  {
    title: "7. Your choices and rights",
    body: <><p>Depending on where you live, you may be able to ask for a copy, correction, deletion, restriction or transfer of your personal information. You may also object to some uses.</p><p>You can leave the publication at any time through its unsubscribe link. Email <a href="mailto:privacy@mindmake.co">privacy@mindmake.co</a> for any other request. If you are in the UK and remain unhappy, you may complain to the Information Commissioner's Office. People elsewhere may contact their local data authority.</p></>,
  },
  {
    title: "8. Security",
    body: <><p>We use access controls and established service providers to protect information. No internet service can promise perfect security. Please do not put secrets or sensitive personal information into the public brief form.</p></>,
  },
  {
    title: "9. Changes",
    body: <><p>We may update this notice when the service or the law changes. The latest date will appear at the top of this page.</p></>,
  },
] as const;

export default function Privacy() {
  const [briefOpen, setBriefOpen] = useState(false);

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
      <SEO title="Privacy policy" description="How Mindmake collects, uses and protects information." canonical="/privacy" />
      <article className="mm-legal-page">
        <header className="mm-container mm-legal-hero">
          <h1>Privacy policy.</h1>
          <p>This page explains what Mindmake collects, why it is needed and the choices you have.</p>
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
