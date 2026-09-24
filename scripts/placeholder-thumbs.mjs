// Generates a clearly marked typographic placeholder thumbnail for a project.
//
//   npm run thumbs -- my-project            → projects/my-project/thumbnail.png
//   npm run thumbs -- my-project other-one  → several at once
//   npm run thumbs                          → every project whose thumbnail file is missing
//   npm run thumbs -- --force my-project    → overwrite an existing one
//
// Replace the result with a real screenshot as soon as you have one.

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { projectSlugs, projectsDir, readProject, root } from './lib/frontmatter.mjs';

const font = (p) => pathToFileURL(join(root, 'node_modules', p)).href;

const args = process.argv.slice(2);
const force = args.includes('--force');
let slugs = args.filter((a) => !a.startsWith('--'));

function frontmatter(slug) {
  const project = readProject(slug);
  return { ...project, thumbnail: project.thumbnail ?? './thumbnail.png' };
}

if (!slugs.length) {
  slugs = projectSlugs().filter((slug) => !existsSync(join(projectsDir, slug, frontmatter(slug).thumbnail)));
}
if (!slugs.length) {
  console.log('Every project already has a thumbnail.');
  process.exit(0);
}

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

function html({ title, year, order, stack }) {
  const words = title.replace(/^\[PLACEHOLDER\]\s*/, '').split(' ');
  // Italicise the last word, the way the site's display headlines do.
  const last = words.pop();
  return `<!doctype html><html><head><style>
    @font-face { font-family: 'Instrument Serif'; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-normal.woff2')}); }
    @font-face { font-family: 'Instrument Serif'; font-style: italic; src: url(${font('@fontsource/instrument-serif/files/instrument-serif-latin-400-italic.woff2')}); }
    @font-face { font-family: 'Geist Mono'; font-weight: 100 900; src: url(${font('@fontsource-variable/geist-mono/files/geist-mono-latin-wght-normal.woff2')}); }
    * { margin: 0; box-sizing: border-box; }
    body { width: 1600px; height: 1000px; background: #EDE8DF; color: #16171B; font-family: 'Geist Mono', monospace;
      background-image: linear-gradient(#DCD7CC 1px, transparent 1px), linear-gradient(90deg, #DCD7CC 1px, transparent 1px);
      background-size: 100px 100px; background-position: -1px -1px; position: relative; }
    .frame { position: absolute; inset: 60px; border: 1px solid #16171B; background: #F5F2EC; padding: 56px 64px;
      display: flex; flex-direction: column; justify-content: space-between; }
    .top, .bottom { display: flex; justify-content: space-between; font-size: 22px; letter-spacing: .12em; text-transform: uppercase; }
    .mark { color: #C23A1F; }
    h1 { font-family: 'Instrument Serif', serif; font-weight: 400; font-size: 150px; line-height: .92; letter-spacing: -.02em; max-width: 1300px; }
    h1 em { font-style: italic; }
    .bottom { color: #5F5E59; border-top: 1px solid #DCD7CC; padding-top: 28px; }
  </style></head><body><div class="frame">
    <div class="top"><span class="mark">[Placeholder thumbnail]</span><span>No. ${esc(String(order).padStart(2, '0'))}</span></div>
    <h1>${esc(words.join(' '))} <em>${esc(last)}</em></h1>
    <div class="bottom"><span>${esc(stack.slice(0, 4).join(' · '))}</span><span>${esc(year)}</span></div>
  </div></body></html>`;
}

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });
for (const slug of slugs) {
  const fm = frontmatter(slug);
  const out = join(projectsDir, slug, fm.thumbnail.endsWith('.png') ? fm.thumbnail : './thumbnail.png');
  if (existsSync(out) && !force) {
    console.log(`skip ${slug}: ${out} exists (use --force to overwrite)`);
    continue;
  }
  await page.setContent(html(fm), { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: out });
  console.log(`wrote ${out}`);
}
await browser.close();
