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
}

const escapeHtml = (value: string) => value.replace(/[&<>"]/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
}[char] ?? char));

export const buildPrivateBriefHtml = (brief: PrivateBriefContent) => `<!doctype html>
<html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(brief.company)} | Mindmake private brief</title>
<style>body{margin:0;background:#f4f0e8;color:#0d1929;font:16px/1.55 "Segoe UI",Arial,sans-serif}.wrap{max-width:760px;margin:auto;padding:48px 24px}.top{border-top:10px solid #6ee1c0;padding-top:28px}.brand{font-weight:800;letter-spacing:.16em;text-transform:uppercase}h1,h2{font-family:Georgia,"Times New Roman",serif;letter-spacing:-.04em}h1{max-width:13ch;margin-top:64px;font-size:clamp(44px,8vw,74px);line-height:.92}h2{font-size:30px}.card{margin-top:18px;border:1px solid rgba(13,25,41,.22);padding:24px;background:#fffdf8}.label{color:#0b756c;font-size:11px;font-weight:800;letter-spacing:.13em;text-transform:uppercase}.grid{display:grid;gap:16px;margin-top:24px}@media(min-width:680px){.grid{grid-template-columns:1fr 1fr}}.note{margin-top:36px;border-left:4px solid #b96743;padding-left:18px}.foot{margin-top:64px;padding-top:18px;border-top:1px solid rgba(13,25,41,.22);color:#5d6562;font-size:13px}</style></head>
<body><main class="wrap"><div class="top"><div class="brand">Mindmake</div><p>${escapeHtml(brief.domain)}</p></div>
<h1>${escapeHtml(brief.pressure)}.</h1>
<div class="card"><p class="label">What we know so far</p><p>${escapeHtml(brief.known)}</p>${brief.evidence.length ? `<ul>${brief.evidence.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}</div>
<div class="grid"><div class="card"><p class="label">AI can carry</p><p>${escapeHtml(brief.carry)}</p></div><div class="card"><p class="label">You keep</p><p>${escapeHtml(brief.human)}</p></div></div>
<div class="card"><p class="label">A useful 30-day test</p><h2>${escapeHtml(brief.proof)}</h2></div>
<p class="note"><strong>What the returned time could buy:</strong><br>${escapeHtml(brief.capacityValue)}</p>
<p class="foot">This is a useful first view, not a promise or final answer. Mindmake uses the real business, the leader's judgement and real work to test what holds up.</p></main></body></html>`;
