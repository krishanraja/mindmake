import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { CONTACT_EMAIL } from "@/lib/publicLinks";
import "@/styles/mindmake.css";
import "@/styles/kits.css";

export default function KitDownload() {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const token = useRef<string>();
  async function download() {
    if (busy) return;
    setBusy(true); setStatus("");
    token.current ??= new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    // Remove the bearer capability from browser history before calling anything.
    window.history.replaceState(null, "", window.location.pathname);
    try {
      const base = import.meta.env.VITE_SUPABASE_URL;
      if (!token.current || !base) throw new Error("missing");
      const response = await fetch(`${base}/functions/v1/kits-download`, {
        method: "POST", headers: { Authorization: `Bearer ${token.current}` },
      });
      const result = await response.json();
      const url = new URL(result.url);
      if (!response.ok || url.origin !== new URL(base).origin || !url.pathname.startsWith("/storage/v1/object/sign/kits/")) throw new Error("unavailable");
      window.location.assign(url.href);
    } catch { setStatus("This download is unavailable. Open the link in your receipt again, or email Mindmake for help."); }
    finally { setBusy(false); }
  }
  return <MindmakeShell onStart={() => window.location.assign("/?start=1")} siteClassName="kits-site" mainClassName="kits-main" showMobileActionBar={false}>
    <SEO title="Your kit download" description="Open your kit from your Mindmake receipt." canonical="/kits/download" noindex />
    <section className="kit-section kit-missing"><p className="kit-label">MINDMAKE KITS</p><h1>Your kit download</h1><button className="kit-button" onClick={download} disabled={busy}>{busy ? "Preparing your download…" : "Download your kit"}</button><p role="status">{status}</p><p><a href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></p><Link className="kit-back" to="/kits">See the kits</Link></section>
  </MindmakeShell>;
}
