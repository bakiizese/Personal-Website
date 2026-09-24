// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { site } from './src/config/site.ts';
import { projectSlugs, readProject } from './scripts/lib/frontmatter.mjs';

// Pages kept out of the sitemap: the style guide and any project still marked as a placeholder.
const hidden = ['/styleguide', ...projectSlugs().filter((s) => readProject(s).status === 'placeholder').map((s) => `/work/${s}/`)];

// Fonts come straight from the installed @fontsource packages: no network at build time,
// self-hosted, and Astro generates metric-matched fallbacks so text doesn't jump when they load.
// Latin subset only (the site is in English). Characters outside it, such as arrows, fall back to the system font.
const local = fontProviders.local();
/** @type {(pkg: string, name: string) => string} */
const file = (pkg, name) => `./node_modules/${pkg}/files/${name}`;

export default defineConfig({
  site: site.url,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap({ filter: (page) => !hidden.some((path) => page.includes(path)) })],
  build: { inlineStylesheets: 'auto' },
  prefetch: { prefetchAll: false, defaultStrategy: 'hover' },
  fonts: [
    {
      provider: local,
      name: 'Newsreader',
      cssVariable: '--font-serif',
      fallbacks: ['Georgia', 'serif'],
      options: {
        variants: [
          // Variable weight and optical size: headlines get the display cut automatically.
          { src: [file('@fontsource-variable/newsreader', 'newsreader-latin-standard-normal.woff2')], weight: '200 800', style: 'normal' },
          { src: [file('@fontsource-variable/newsreader', 'newsreader-latin-standard-italic.woff2')], weight: '200 800', style: 'italic' },
        ],
      },
    },
    {
      provider: local,
      name: 'Geist',
      cssVariable: '--font-sans',
      fallbacks: ['Arial', 'sans-serif'],
      options: {
        variants: [{ src: [file('@fontsource-variable/geist', 'geist-latin-wght-normal.woff2')], weight: '100 900', style: 'normal' }],
      },
    },
    {
      provider: local,
      name: 'Geist Mono',
      cssVariable: '--font-mono',
      fallbacks: ['ui-monospace', 'Menlo', 'monospace'],
      options: {
        variants: [
          { src: [file('@fontsource-variable/geist-mono', 'geist-mono-latin-wght-normal.woff2')], weight: '100 900', style: 'normal' },
        ],
      },
    },
  ],
});
