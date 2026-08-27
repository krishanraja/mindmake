import { buildProposalSections, type ProposalContent } from "@/components/mindmake/proposalContent";

export interface PrivateBriefContent {
  company: string;
  domain: string;
  pressure: string;
  capacityValue: string;
  known: string;
  evidence: string[];
  carry: string;
  human: string;
  proof: string;
  preparedFor?: string;
  nextStep?: "reply" | "keep";
}

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
}[char] ?? char));

/* The downloadable private brief, built as a self-contained branded
   proposal: system fonts only, no scripts, no external requests, printable
   to a clean A4. Shares its content contract with the on-screen render. */
export const buildPrivateBriefHtml = (brief: PrivateBriefContent) => {
  const sections = buildProposalSections({ ...brief, nextStep: brief.nextStep ?? "keep" } as ProposalContent);
  const esc = escapeHtml;

  return `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(sections.company)} | Mindmake private brief</title>
<style>
body{margin:0;background:#f4f0e8;color:#0d1929;font:16px/1.55 "Segoe UI",Arial,sans-serif}
.wrap{max-width:760px;margin:auto;padding:44px 24px 64px}
.cover{border-top:10px solid #6ee1c0;padding-top:26px;display:flex;justify-content:space-between;gap:18px;flex-wrap:wrap;align-items:baseline}
.brand{font-family:Georgia,"Times New Roman",serif;font-size:21px;letter-spacing:-.02em}
.brand b{font-weight:800;letter-spacing:.14em;font-family:"Segoe UI",Arial,sans-serif;font-size:15px;text-transform:uppercase}
.meta{color:#5d6562;font-size:13px}
h1{font-family:Georgia,"Times New Roman",serif;letter-spacing:-.04em;max-width:14ch;margin:56px 0 0;font-size:clamp(42px,8vw,70px);line-height:.94}
.card{margin-top:20px;border:1px solid rgba(13,25,41,.24);padding:24px;background:#fffdf8;box-shadow:10px 10px 0 rgba(13,25,41,.12)}
.label{margin:0 0 8px;color:#0b756c;font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}
.card p,.card ul{margin:0}
.card ul{margin-top:10px;padding-left:20px}
.card li{margin-top:4px}
.pair{display:grid;gap:16px;margin-top:4px}
@media(min-width:680px){.pair{grid-template-columns:1fr 1fr}}
.proof strong{display:block;font-family:Georgia,"Times New Roman",serif;font-size:26px;line-height:1.15;letter-spacing:-.02em}
.time{margin-top:34px;border-left:4px solid #b96743;padding-left:18px}
.time .label{color:#b96743}
.honesty{margin-top:30px;font-style:italic;color:#3d4a47}
.next{margin-top:26px;border:1px solid #0b756c;padding:18px 20px;background:#fffdf8}
.foot{margin-top:56px;padding-top:16px;border-top:1px solid rgba(13,25,41,.22);color:#5d6562;font-size:13px}
.foot p{margin:0 0 6px}
@media print{body{background:#fff}.wrap{padding:0;max-width:none}.card{box-shadow:none}}
</style></head>
<body><main class="wrap">
<div class="cover"><p class="brand"><b>Mindmake</b> &#215; ${esc(sections.company)}</p><p class="meta">${esc(sections.domain)}${sections.preparedFor ? ` &#183; prepared for ${esc(sections.preparedFor)}` : ""} &#183; Private brief</p></div>
<h1>${esc(sections.headline)}.</h1>
<div class="card"><p class="label">${esc(sections.read.title)}</p><p>${esc(sections.read.body)}</p>${sections.read.evidence.length ? `<ul>${sections.read.evidence.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>` : ""}</div>
<div class="pair"><div class="card"><p class="label">${esc(sections.carries.title)}</p><p>${esc(sections.carries.body)}</p></div><div class="card"><p class="label">${esc(sections.keeps.title)}</p><p>${esc(sections.keeps.body)}</p></div></div>
<div class="card proof"><p class="label">${esc(sections.proof.title)}</p><strong>${esc(sections.proof.body)}</strong></div>
<div class="time"><p class="label">${esc(sections.returnedTime.title)}</p><p>${esc(sections.returnedTime.body)}</p></div>
<p class="honesty">${esc(sections.honesty.cannotKnow)}</p>
<div class="next"><p class="label">${esc(sections.nextStep.title)}</p><p>${esc(sections.nextStep.body)}</p></div>
<div class="foot"><p>${esc(sections.disclaimer)}</p><p>${esc(sections.honesty.illustrative)}</p></div>
</main></body></html>`;
};
