// Generates the site-wide share image and the favicons, in the site's own fonts.
//   npm run brand
// Writes public/og.png (1200×630), public/favicon.ico, public/favicon-32.png,
// public/apple-touch-icon.png (180) and public/icon-512.png.
// Re-run after changing your name, role or portrait. Project pages use their own thumbnails instead.

import { chromium } from 'playwright';
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './lib/frontmatter.mjs';
import { fontFaces } from './lib/fonts.mjs';

// Read the few values we need from site.ts without a TypeScript toolchain.
const siteSrc = readFileSync(join(root, 'src/config/site.ts'), 'utf8');
const field = (name) => siteSrc.match(new RegExp(`^\\s*${name}: '([^']*)'`, 'm'))?.[1] ?? '';
const site = {
  firstName: field('firstName'),
  lastName: field('lastName'),
  role: field('role'),
  roleFocus: field('roleFocus'),
  location: field('location'),
};

const fonts = `${fontFaces}
  * { margin: 0; box-sizing: border-box; }`;

// Chromium won't load file:// images into a page set from about:blank, so embed the portrait.
const mirror = /^\s*mirror: true/m.test(siteSrc);
let portraitImg = sharp(join(root, 'src/assets/portrait.png')).resize({ height: 1040 });
if (mirror) portraitImg = portraitImg.flop();
const portrait = await portraitImg.png().toBuffer();
const portraitSrc = `data:image/png;base64,${portrait.toString('base64')}`;

const og = `<!doctype html><html><head><style>${fonts}
  body { width: 1200px; height: 630px; overflow: hidden; position: relative; background: #f5f2ec; color: #16171b; font-family: 'BZ Sans'; }
  .light { position: absolute; inset: 0; background: radial-gradient(ellipse 40% 70% at 74% 50%, rgb(255 226 196 / .95), rgb(245 242 236 / 0)); }
  .top, .bottom { position: absolute; left: 64px; right: 64px; display: flex; justify-content: space-between;
    font-family: 'BZ Mono'; font-size: 17px; letter-spacing: .08em; text-transform: uppercase; }
  .top { top: 52px; } .bottom { bottom: 0; padding: 18px 0 30px; border-top: 1px solid #16171b; color: #5f5e59; }
  .n { color: #c23a1f; margin-right: 14px; }
  h1 { position: absolute; left: 60px; bottom: 92px; font-family: 'BZ Serif'; font-weight: 500; font-size: 128px; line-height: 1; letter-spacing: -.025em; z-index: 1; }
  h1 em { font-weight: 400; }
  .role { position: absolute; left: 64px; top: 128px; font-size: 26px; font-weight: 500; line-height: 1.25; }
  .role em { display: block; font-family: 'BZ Serif'; font-size: 30px; color: #5f5e59; font-weight: 400; }
  img { position: absolute; right: 70px; bottom: 67px; height: 520px; z-index: 2; }
</style></head><body>
  <div class="light"></div>
  <div class="top"><span><span class="n">(00)</span>Portfolio</span></div>
  <p class="role">${site.role}<em>${site.roleFocus.replace('&', '&amp;')}</em></p>
  <h1>${site.firstName}<br><em>${site.lastName}</em></h1>
  <img src="${portraitSrc}" alt="">
  <div class="bottom"><span>${site.firstName} ${site.lastName}</span><span>${site.location} · UTC+3</span></div>
</body></html>`;

// The icon: an ink square with a serif "B" and a vermilion full stop.
const icon = (size) => `<!doctype html><html><head><style>${fonts}
  body { width: ${size}px; height: ${size}px; display: grid; place-items: center; background: #16171b; border-radius: ${size > 64 ? size * 0.18 : 0}px; }
  span { font-family: 'BZ Serif'; font-weight: 500; color: #f5f2ec; font-size: ${size * 0.78}px; line-height: 1; transform: translate(${size * 0.02}px, ${size * 0.04}px); }
  i { font-style: normal; color: #ff6b4a; }
</style></head><body><span>B<i>.</i></span></body></html>`;

const browser = await chromium.launch();
const page = await browser.newPage();

async function render(html, width, height, transparent = false) {
  await page.setViewportSize({ width, height });
  await page.setContent(html, { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  if (!(await page.evaluate(() => document.fonts.check("20px 'BZ Serif'")))) throw new Error('Fonts failed to load; run npm install first.');
  const missing = await page.evaluate(() => [...document.images].filter((i) => !i.naturalWidth).map((i) => i.src));
  if (missing.length) throw new Error(`Image failed to load: ${missing.join(', ')}`);
  return page.screenshot({ omitBackground: transparent });
}

const out = (name) => join(root, 'public', name);
writeFileSync(out('og.png'), await sharp(await render(og, 1200, 630)).png({ compressionLevel: 9 }).toBuffer());

const big = await render(icon(512), 512, 512, true);
await sharp(big).png().toFile(out('icon-512.png'));
await sharp(await render(icon(180), 180, 180)).png().toFile(out('apple-touch-icon.png'));
const small = await render(icon(32), 32, 32);
await sharp(small).png().toFile(out('favicon-32.png'));
await browser.close();

// favicon.ico for browsers that request /favicon.ico directly. An ICO can wrap a PNG as-is.
const png = await sharp(small).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(1, 4); // one image
header.writeUInt8(32, 6); // width
header.writeUInt8(32, 7); // height
header.writeUInt16LE(1, 10); // colour planes
header.writeUInt16LE(32, 12); // bits per pixel
header.writeUInt32LE(png.length, 14); // image size
header.writeUInt32LE(22, 18); // image offset
writeFileSync(out('favicon.ico'), Buffer.concat([header, png]));

console.log('wrote public/og.png, favicon.ico, favicon-32.png, apple-touch-icon.png, icon-512.png');
