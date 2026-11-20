/* The brain module emails (Krish, 2026-11-20: "looks HORRIBLE and exposes a full supabase URL"). One designed
   HTML email with a plain-text twin. Every link is a mindmake.co or makeyourmindup.ai address: the download page
   fetches a fresh private link when the buyer presses its button, so no storage address is ever shown. */
const esc = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export interface ReceiptParts {
  preheader: string;
  heading: string;
  intro: string;
  button?: { label: string; href: string };
  steps?: string[];
  notes: string[];
  subscribe?: { href: string };
  footerLinks: { label: string; href: string }[];
}

const INK = "#0a100d", PAPER = "#f4efe4", MINT = "#7fe3b4", MUTED = "#5c665f", LINE = "#e3ddcf";

export function receiptHtml(p: ReceiptParts): string {
  const para = (text: string, style = "") => `<p style="margin:0 0 14px;font-size:16px;line-height:1.6;color:${INK};${style}">${esc(text)}</p>`;
  const button = p.button ? `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px"><tr><td style="background:${INK};border-radius:8px">
    <a href="${esc(p.button.href)}" style="display:inline-block;padding:16px 26px;font-size:16px;font-weight:600;color:${PAPER};text-decoration:none;font-family:Helvetica,Arial,sans-serif">${esc(p.button.label)} &rarr;</a></td></tr></table>` : "";
  const steps = p.steps?.length ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:4px 0 22px;border-top:1px solid ${LINE}">${p.steps.map((step, i) => `<tr><td valign="top" style="border-bottom:1px solid ${LINE};padding:14px 12px 14px 0;font:600 13px/1.5 Menlo,Consolas,monospace;color:#1d6a47;width:22px">0${i + 1}</td><td style="border-bottom:1px solid ${LINE};padding:14px 0;font-size:15px;line-height:1.55;color:${INK}">${esc(step)}</td></tr>`).join("")}</table>` : "";
  const subscribe = p.subscribe ? `<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="margin:6px 0 24px;background:${INK};border-radius:16px"><tr><td style="padding:22px 24px">
    <p style="margin:0 0 6px;font:600 12px/1.4 Menlo,Consolas,monospace;letter-spacing:.08em;text-transform:uppercase;color:${MINT}">Free · three pieces a week</p>
    <p style="margin:0 0 8px;font:400 22px/1.25 Georgia,'Times New Roman',serif;color:#f2f1ea">Read makeyourmindup, our media channel</p>
    <p style="margin:0 0 14px;font-size:15px;line-height:1.55;color:#c4c8c2">What is changing in AI, and what to do about it, for leaders who make the call.</p>
    <a href="${esc(p.subscribe.href)}" style="display:inline-block;background:${MINT};padding:14px 18px;border-radius:8px;font-size:15px;line-height:18px;font-weight:600;color:${INK};text-decoration:none">Subscribe free &rarr;</a></td></tr></table>` : "";
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(p.heading)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:Helvetica,Arial,sans-serif">
<span style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(p.preheader)}</span>
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:${PAPER}"><tr><td align="center" style="padding:28px 14px">
<table role="presentation" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px">
<tr><td style="padding:0 4px 18px;font:600 15px/1 Menlo,Consolas,monospace;letter-spacing:.18em;color:${INK}">MIND<span style="color:#1d6a47">/</span>MAKE</td></tr>
<tr><td style="background:#fffdf7;border:1px solid ${LINE};border-radius:20px;padding:30px 22px;box-shadow:0 8px 24px #0a100d0a">
<h1 style="margin:0 0 14px;text-wrap:balance;font:400 34px/1.12 Georgia,'Times New Roman',serif;color:${INK}">${esc(p.heading)}</h1>
${para(p.intro)}${button}${steps}${subscribe}${p.notes.map(note => para(note, `font-size:14px;color:${MUTED}`)).join("")}
</td></tr>
<tr><td style="padding:18px 4px;font-size:13px;line-height:1.6;color:${MUTED}">${p.footerLinks.map(link => `<a href="${esc(link.href)}" style="color:${MUTED}">${esc(link.label)}</a>`).join(" &nbsp;·&nbsp; ")}<br>Mindmake is a Mindmaker LLC company.</td></tr>
</table></td></tr></table></body></html>`;
}

export function receiptText(p: ReceiptParts): string {
  return [p.heading, "", p.intro, ...(p.button ? ["", `${p.button.label}: ${p.button.href}`] : []),
    ...(p.steps?.length ? ["", ...p.steps.map((step, i) => `${i + 1}. ${step}`)] : []),
    ...(p.subscribe ? ["", `Read makeyourmindup, our free media channel, three pieces a week: ${p.subscribe.href}`] : []),
    "", ...p.notes.flatMap(note => [note, ""]), p.footerLinks.map(link => `${link.label}: ${link.href}`).join("\n")].join("\n").trim();
}
