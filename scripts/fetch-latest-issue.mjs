import fs from 'node:fs';
import path from 'node:path';

// The homepage hero names one issue of Make Your Mind Up, the publication,
// beside the way to subscribe (Ruling, Krish, 2026-10-24: "doesn't need to be
// a new button, but, let's think imaginatively about how we get as many people
// to subscribe to my substack as possible, directly from here").
//
// The title is read at build time from the publication's own RSS feed and
// written to src/data/latestIssue.json, so the server render and the browser
// render agree (a fetch in the browser would make them differ, and the feed
// does not allow cross-origin reads anyway). The build never fails on the
// feed: if it cannot be read, or reads oddly, the last good issue in the file
// stays. The hero calls it "From Make Your Mind Up", never "latest", because
// between deploys a newer issue may exist and a stale feed must not appear
// fresh (03_DESIGN_CONTRACT.md).
const FEED = 'https://home.makeyourmindup.ai/feed';
const target = path.join(process.cwd(), 'src/data/latestIssue.json');

const text = (value) => value
  .replace(/^<!\[CDATA\[|\]\]>$/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .trim();

try {
  const response = await fetch(FEED, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) throw new Error(`feed answered ${response.status}`);
  const xml = await response.text();
  const item = xml.match(/<item>([\s\S]*?)<\/item>/)?.[1];
  const title = item?.match(/<title>([\s\S]*?)<\/title>/)?.[1];
  const url = item?.match(/<link>([\s\S]*?)<\/link>/)?.[1];
  if (!title || !url) throw new Error('feed has no item with a title and link');
  const issue = { title: text(title), url: text(url) };
  if (issue.title.length < 8 || issue.title.length > 140 || /[<>]/.test(issue.title)) throw new Error('feed title is not plain text of a sensible length');
  if (!/^https:\/\/(?:home\.)?makeyourmindup\.ai\//.test(issue.url)) throw new Error('feed link is not on the publication');
  const next = `${JSON.stringify(issue, null, 2)}\n`;
  if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== next) fs.writeFileSync(target, next);
  console.log(JSON.stringify({ status: 'PASS', issue }));
} catch (error) {
  console.log(JSON.stringify({ status: 'KEPT', reason: String(error?.message ?? error), issue: JSON.parse(fs.readFileSync(target, 'utf8')) }));
}
