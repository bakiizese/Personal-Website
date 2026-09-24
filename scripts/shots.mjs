// Screenshots of the built site at desktop and mobile widths, for design review.
//   npm run build && npm run shots                 → all pages, light theme
//   npm run shots -- --dark                        → dark theme
//   npm run shots -- / /work/wego-ride/            → specific routes
// Output: screenshots/<route>-<width>[-dark].png (git-ignored)

import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { root } from './lib/frontmatter.mjs';

const PORT = 4322;
const WIDTHS = [
  [1440, 900],
  [390, 844],
];

const args = process.argv.slice(2);
const dark = args.includes('--dark');
let routes = args.filter((a) => a.startsWith('/'));
if (!routes.length) {
  const work = readdirSync(join(root, 'dist', 'work'), { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => `/work/${d.name}/`);
  routes = ['/', ...work, '/404'];
}

// --ignore-lock keeps the server in the foreground: Astro 7 otherwise detaches it into a background process
// when it detects an AI agent, and that stray server keeps the port. The process group is stopped on exit too.
const server = spawn(join(root, 'node_modules', '.bin', 'astro'), ['preview', '--port', String(PORT), '--ignore-lock'], {
  cwd: root,
  stdio: 'pipe',
  detached: true,
});
const stop = () => {
  try {
    process.kill(-server.pid);
  } catch {}
};
process.on('exit', stop);
await new Promise((ok, fail) => {
  server.stdout.on('data', (d) => String(d).includes(`localhost:${PORT}`) && ok());
  server.stderr.on('data', (d) => /in use/i.test(String(d)) && fail(new Error(`Port ${PORT} is busy. Stop the other server first.`)));
  server.on('exit', (code) => fail(new Error(`astro preview exited (${code}). Did you run npm run build?`)));
});

const outDir = join(root, 'screenshots');
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch();

try {
  for (const [width, height] of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height },
      deviceScaleFactor: 1,
      colorScheme: dark ? 'dark' : 'light',
      reducedMotion: 'reduce', // skip entrance animations so every shot shows the final state
    });
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(`http://localhost:${PORT}${route}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      // Scroll through the page so lazy-loaded images load before the full-page capture.
      await page.evaluate(async () => {
        for (let y = 0; y < document.body.scrollHeight; y += innerHeight / 2) {
          scrollTo(0, y);
          await new Promise((r) => setTimeout(r, 60));
        }
        scrollTo(0, 0);
      });
      await page.waitForLoadState('networkidle');
      const name = (route.replace(/^\/|\/$/g, '').replace(/\//g, '_') || 'home') + `-${width}${dark ? '-dark' : ''}.png`;
      await page.screenshot({ path: join(outDir, name), fullPage: true });
      console.log(`screenshots/${name}`);
    }
    await context.close();
  }
} finally {
  await browser.close();
  stop();
}
