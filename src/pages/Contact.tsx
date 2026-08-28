import { FormEvent, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { SEO } from "@/components/SEO";
import { LeadBrief } from "@/components/mindmake/LeadBrief";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import "@/styles/mindmake.css";

type ContactField = "name" | "email" | "message";
type ContactErrors = Partial<Record<ContactField, string>>;

export default function Contact() {
  const [briefOpen, setBriefOpen] = useState(false);
  const [errors, setErrors] = useState<ContactErrors>({});
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const clearFieldError = (field: ContactField) => {
    setErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const email = String(form.get("email") || "").trim();
    const company = String(form.get("company") || "").trim();
    const message = String(form.get("message") || "").trim();
    const nextErrors: ContactErrors = {};
    if (!name) nextErrors.name = "Add your name.";
    if (!/^\S+@\S+\.\S+$/.test(email)) nextErrors.email = "Add a valid email address.";
    if (message.length < 10) nextErrors.message = "Add a message of at least 10 characters.";

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      window.requestAnimationFrame(() => {
        if (nextErrors.name) nameRef.current?.focus();
        else if (nextErrors.email) emailRef.current?.focus();
        else messageRef.current?.focus();
      });
      return;
    }

    setErrors({});
    const subject = encodeURIComponent(`Mindmake message from ${name}`);
    const body = encodeURIComponent([
      `Name: ${name}`,
      `Email: ${email}`,
      company ? `Company: ${company}` : "",
      "",
      message,
    ].filter(Boolean).join("\n"));
    window.location.href = `mailto:hello@mindmake.co?subject=${subject}&body=${body}`;
  };

  return (
    <MindmakeShell onStart={() => setBriefOpen(true)} darkHeader={false}>
      <SEO title="Contact" description="Send Mindmake a general message." canonical="/contact" />
      <section className="mm-contact-page" aria-labelledby="contact-title">
        <div className="mm-container mm-contact-grid">
          <div>
            <h1 id="contact-title">Say hello.</h1>
            <p>For a business starting point, use the guided read. For everything else, send us a note here.</p>
            <button className="mm-text-link mm-contact-start" type="button" onClick={() => setBriefOpen(true)}>
              Start here <ArrowRight aria-hidden="true" />
            </button>
          </div>
          <form className="mm-contact-form" onSubmit={submit} noValidate>
            <label htmlFor="contact-name">Name</label>
            <input
              ref={nameRef}
              id="contact-name"
              name="name"
              autoComplete="name"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "contact-name-error" : undefined}
              onChange={() => clearFieldError("name")}
            />
            {errors.name && <p id="contact-name-error" className="mm-form-error">{errors.name}</p>}
            <label htmlFor="contact-email">Email</label>
            <input
              ref={emailRef}
              id="contact-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "contact-email-error" : undefined}
              onChange={() => clearFieldError("email")}
            />
            {errors.email && <p id="contact-email-error" className="mm-form-error">{errors.email}</p>}
            <label htmlFor="contact-company">Company <span>Optional</span></label>
            <input id="contact-company" name="company" autoComplete="organization" />
            <label htmlFor="contact-message">Message</label>
            <textarea
              ref={messageRef}
              id="contact-message"
              name="message"
              rows={7}
              required
              aria-invalid={Boolean(errors.message)}
              aria-describedby={errors.message ? "contact-message-error" : undefined}
              onChange={() => clearFieldError("message")}
            />
            {errors.message && <p id="contact-message-error" className="mm-form-error">{errors.message}</p>}
            <button className="mm-button" type="submit">Open in email <ArrowRight aria-hidden="true" /></button>
            <small>
              This opens your email app. Nothing is sent until you press Send there. Read the{" "}
              <a href="/privacy" target="_blank" rel="noreferrer">privacy notice</a>.
            </small>
          </form>
        </div>
      </section>
      <LeadBrief open={briefOpen} onClose={() => setBriefOpen(false)} />
    </MindmakeShell>
  );
}
