/**
 * One icon set, drawn by one hand (Krish, 2026-11-04: compensate for many
 * words with "different tactics"; mock approved: "the rest of it looks good").
 * A 24 grid, a 1.5 stroke, round caps and no fills, so every icon on the site
 * reads as the same pen. Shared by React (`Icon`) and by the markup the
 * homepage and /ai-brain set as HTML (`iconSvg`). Decoration beside words
 * that say the same, so always hidden from assistive technology.
 */
export const ICONS = {
  product: '<path d="M4 7.5 12 3.5l8 4v9l-8 4-8-4z"/><path d="M4 7.5 12 11.5l8-4M12 11.5v9"/>',
  price: '<path d="M3.5 12.5 11.5 4.5h8v8l-8 8z"/><circle cx="15.5" cy="8.5" r="1.4"/>',
  positioning: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r=".9"/>',
  people: '<circle cx="9" cy="8" r="3"/><path d="M3.5 19c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5"/><circle cx="17" cy="9" r="2.3"/><path d="M15.8 14.2c2.4.2 4 1.8 4.6 4.3"/>',
  agent: '<rect x="5" y="7.5" width="14" height="11" rx="3"/><path d="M12 7.5V4.5M9.5 12.5h.01M14.5 12.5h.01M9.5 15.5h5"/>',
  chart: '<path d="M4 20h16"/><path d="M6.5 16v-4M11 16V8M15.5 16v-6M20 16V5"/>',
  message: '<path d="M4 5.5h16v10H10l-4.5 3.5v-3.5H4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  org: '<rect x="9" y="3.5" width="6" height="4.5" rx="1"/><rect x="3" y="16" width="6" height="4.5" rx="1"/><rect x="15" y="16" width="6" height="4.5" rx="1"/><path d="M12 8v4M6 16v-4h12v4"/>',
  launch: '<path d="M4 14.5V9.5l11-5v15z"/><path d="M15 8.5c2.2.2 3.8 1.6 3.8 3.5S17.2 15.3 15 15.5M7 15l1.2 4.5h2.6L10 15"/>',
  radar: '<circle cx="12" cy="12" r="8.5"/><path d="M12 12 18 6"/><path d="M12 7a5 5 0 1 0 5 5"/>',
  model: '<path d="M4 5h16v14H4z"/><path d="M4 10h16M10 10v9"/>',
  evidence: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 14l2 2 4-4.5"/>',
  built: '<path d="M4 20h16M6.5 20v-6h5v6M12.5 20V9h5v11"/><path d="M6.5 11 9 8.5l2.5 2.5"/>',
  taste: '<path d="M12 3.5c2.5 3 5 5.6 5 9a5 5 0 0 1-10 0c0-3.4 2.5-6 5-9z"/>',
  standards: '<path d="M3.5 15.5 15.5 3.5l5 5-12 12z"/><path d="M7 12l2 2M10 9l1.5 1.5M13 6l2 2"/>',
  judgement: '<path d="M12 4v16M7 20h10M5 7h14"/><path d="M5 7 2.5 13a2.5 2.5 0 0 0 5 0zM19 7l-2.5 6a2.5 2.5 0 0 0 5 0z"/>',
  context: '<circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.3 11 15.7 7M8.3 13l7.4 4"/>',
  memory: '<path d="M4 12a8 8 0 1 0 2.4-5.7L4 8.5"/><path d="M4 4v4.5h4.5M12 8v4l3 2"/>',
  decision: '<path d="M12 20v-6M12 14 6 8M12 14l6-6"/><path d="M6 4v4h4M18 4v4h-4"/>',
  question: '<circle cx="12" cy="12" r="8.5"/><path d="M9.6 9.5a2.5 2.5 0 1 1 3.4 2.3c-.6.3-1 .8-1 1.5v.4M12 16.6h.01"/>',
  call: '<path d="M5 12.5 10 17.5 19.5 7"/>',
  pen: '<path d="M4 20l1-4.5L15.5 5l3.5 3.5L8.5 19z"/><path d="M13.5 7l3.5 3.5"/>',
  plug: '<path d="M9 3.5v4M15 3.5v4M6.5 7.5h11v3a5.5 5.5 0 0 1-11 0zM12 16v4.5"/>',
  target: '<circle cx="12" cy="12" r="8.5"/><path d="M8.5 12l2.5 2.5 4.5-5"/>',
  refresh: '<path d="M19.5 12a7.5 7.5 0 0 1-13 5.1M4.5 12a7.5 7.5 0 0 1 13-5.1"/><path d="M17.5 3.5v3.4h-3.4M6.5 20.5v-3.4h3.4"/>',
  graph: '<circle cx="6" cy="7" r="2"/><circle cx="17" cy="5" r="2"/><circle cx="12" cy="13" r="2"/><circle cx="18" cy="18" r="2"/><circle cx="5" cy="18" r="2"/><path d="M7.7 8.2l2.8 3.4M15.4 6.3l-2.4 5M13.6 14.3l2.9 2.5M10.3 14l-3.6 2.8"/>',
  proven: '<path d="M12 3 19 6v5.5c0 4.2-3 7.6-7 9.5-4-1.9-7-5.3-7-9.5V6z"/><path d="M8.8 12.2l2.2 2.2 4.2-4.6"/>',
  rise: '<path d="M4 18 10 12l3.5 3.5L20 8.5"/><path d="M15 8.5h5v5"/>',
  board: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="M8 20l4-4 4 4M8 9h8M8 12h5"/>',
  reply: '<path d="M10 6 4.5 11 10 16"/><path d="M4.5 11H14a5.5 5.5 0 0 1 5.5 5.5V18"/>',
  post: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 12.5h8M8 16h5"/>',
  brief: '<rect x="3.5" y="7.5" width="17" height="12" rx="1.5"/><path d="M9 7.5V5.5h6v2M3.5 12.5h17"/>',
  read: '<path d="M3 6.5c3-1.5 6-1.5 9 0v13c-3-1.5-6-1.5-9 0zM21 6.5c-3-1.5-6-1.5-9 0v13c3-1.5 6-1.5 9 0z"/>',
  any: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.5"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.5"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.5"/>',
  lock: '<rect x="5" y="10.5" width="14" height="10" rx="1.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
  notice: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
  connect: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  prepare: '<path d="M6 3.5h8l4 4v13H6z"/><path d="M14 3.5v4h4M9 12h6M9 15.5h6"/>',
  ideas: '<path d="M9 17.5h6M10 20.5h4M12 3.5a6 6 0 0 0-3.5 10.9V17.5h7v-3.1A6 6 0 0 0 12 3.5z"/>',
  change: '<path d="M4 7h13l-3-3M20 17H7l3 3"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  arrow: '<path d="M4 12h15M14 7l5 5-5 5"/>',
} as const;

export type IconName = keyof typeof ICONS;

export function iconSvg(name: IconName, className = "mm-icon"): string {
  return `<svg class="${className}" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${ICONS[name]}</svg>`;
}
