// Minimal frontmatter reader for the helper scripts. Astro does the real parsing and validation at build time;
// this only pulls out the few simple fields the scripts need.

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const root = resolve(import.meta.dirname, '..', '..');
export const projectsDir = join(root, 'projects');

export function projectSlugs() {
  return readdirSync(projectsDir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
    .map((d) => d.name);
}

export function readProject(slug) {
  const file = join(projectsDir, slug, 'index.mdx');
  if (!existsSync(file)) throw new Error(`projects/${slug}/ has no index.mdx`);
  const fm = readFileSync(file, 'utf8').split(/^---$/m)[1] ?? '';
  const unquote = (s) => s.trim().replace(/^["']|["']$/g, '');
  const field = (name) => {
    const m = fm.match(new RegExp(`^${name}:\\s*(.+)$`, 'm'));
    return m ? unquote(m[1]) : undefined;
  };
  const stack = (field('stack') ?? '')
    .replace(/^\[|\]$/g, '')
    .split(',')
    .map(unquote)
    .filter(Boolean);
  const images = [...fm.matchAll(/^\s*(?:thumbnail|-?\s*src):\s*(\S+)\s*$/gm)].map((m) => unquote(m[1]));
  return {
    file,
    title: field('title') ?? slug,
    year: field('year') ?? '',
    order: field('order') ?? '',
    thumbnail: field('thumbnail'),
    stack,
    images,
  };
}
