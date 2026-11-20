import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, FileDown } from "lucide-react";
import { SEO } from "@/components/SEO";
import { MindmakeShell } from "@/components/mindmake/MindmakeShell";
import { ClaudeMark, CLAUDE_DOWNLOAD_URL } from "@/components/ui/claude-only";
import { SquareGrid } from "@/components/ui/square-grid";
import { CONTACT_EMAIL } from "@/lib/publicLinks";
import "@/styles/mindmake.css";
import "@/styles/kits.css";

type DownloadState = { status: "preparing" | "error" } | {
  status: "downloaded"; filename: string; research?: string;
};

function signedFile(value: unknown, base: string) {
  if (typeof value !== "string") return;
  try {
    const url = new URL(value);
    if (url.origin === new URL(base).origin && url.pathname.startsWith("/storage/v1/object/sign/kits/")) return url;
  } catch { return; }
}

function downloadsHint() {
  const agent = navigator.userAgent;
  if (/Macintosh/.test(agent)) return "Look in your browser’s downloads or open Downloads in Finder.";
  if (/Windows/.test(agent)) return "Look in your browser’s downloads or open Downloads in File Explorer.";
  return "Look in your browser’s downloads or your Downloads folder. Open the file on a Mac or Windows computer.";
}

export default function KitDownload() {
  const [state, setState] = useState<DownloadState>({ status: "preparing" });
  const token = useRef<string>();
  const busy = useRef(false);
  const frame = useRef<HTMLIFrameElement>(null);
  const download = useCallback(async () => {
    if (busy.current) return;
    busy.current = true;
    setState({ status: "preparing" });
    try {
      const base = import.meta.env.VITE_SUPABASE_URL;
      if (!token.current || !base) throw new Error("missing");
      const response = await fetch(`${base}/functions/v1/kits-download`, {
        method: "POST", headers: { Authorization: `Bearer ${token.current}` },
      });
      if (!response.ok) throw new Error("unavailable");
      const result = await response.json();
      const url = signedFile(result.url, base);
      if (!url) throw new Error("unavailable");
      if (!frame.current) return;
      const name = url.searchParams.get("download") || url.pathname.split("/").pop() || "";
      const filename = /^mindmake-[a-z0-9-]+\.mcpb$/.test(name) ? name : "mindmake-brain-module.mcpb";
      frame.current.src = url.href;
      setState({ status: "downloaded", filename, research: signedFile(result.research_url, base)?.href });
    } catch {
      setState({ status: "error" });
    } finally {
      busy.current = false;
    }
  }, []);

  useEffect(() => {
    if (token.current !== undefined) return;
    token.current = new URLSearchParams(window.location.hash.slice(1)).get("token") ?? "";
    window.history.replaceState(null, "", window.location.pathname);
    void download();
  }, [download]);

  return <MindmakeShell onStart={() => window.location.assign("/?start=1")} siteClassName="kits-site" mainClassName="kits-main" showMobileActionBar={false}>
    <SEO title="Your AI brain module" description="Open your brain module from your Mindmake receipt." canonical="/brain-modules/download" noindex />
    <section className="kit-install" aria-live="polite">
      <p className="kit-install-brand kit-label"><ClaudeMark /> Claude Desktop</p>
      {state.status === "preparing" && <>
        <h1>Preparing your download</h1>
        <SquareGrid />
      </>}
      {state.status === "downloaded" && <>
        <h1>Your brain module is downloading</h1>
        <p className="kit-install-direction">Open the file that just saved. Claude Desktop starts and asks you to press Install.</p>
        <figure className="kit-install-file">
          <div aria-hidden="true"><FileDown size={38} strokeWidth={1.4} /><ArrowRight size={24} /><ClaudeMark size={38} /></div>
          <figcaption>{state.filename}</figcaption>
        </figure>
        <p>{downloadsHint()}</p>
        <div className="kit-install-actions">
          <button className="kit-button" onClick={download}>Download again</button>
          {state.research && <a className="kit-text-link" href={state.research}>Download your research file</a>}
        </div>
        <p className="kit-install-help">No Claude Desktop? <a className="kit-text-link" href={CLAUDE_DOWNLOAD_URL}>Get it free</a></p>
      </>}
      {state.status === "error" && <>
        <h1>This download is unavailable.</h1>
        <p>Open the link in your receipt again, or email Mindmake for help.</p>
        <div className="kit-install-actions"><button className="kit-button" onClick={download}>Retry download</button><a className="kit-text-link" href={`mailto:${CONTACT_EMAIL}`}>Email Mindmake</a></div>
      </>}
    </section>
    <iframe ref={frame} hidden title="Brain module download" />
  </MindmakeShell>;
}
