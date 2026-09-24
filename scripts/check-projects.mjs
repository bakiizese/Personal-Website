// Runs before `astro build`. Catches missing image files with a message that names the project,
// before Astro's own (less specific) image error. Field-level checks live in src/content.config.ts.

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { projectSlugs, projectsDir, readProject } from './lib/frontmatter.mjs';

const problems = [];

for (const slug of projectSlugs()) {
  const project = readProject(slug);
  if (!project.thumbnail) {
    problems.push(`projects/${slug}/index.mdx: "thumbnail" is missing. Add one, or run: npm run thumbs -- ${slug}`);
  }
  for (const img of project.images) {
    if (!existsSync(join(projectsDir, slug, img))) {
      problems.push(`projects/${slug}/index.mdx: image "${img}" not found in projects/${slug}/`);
    }
  }
}

if (problems.length) {
  console.error(`\nProject check failed:\n  - ${problems.join('\n  - ')}\n\nSee docs/ADDING-PROJECTS.md\n`);
  process.exit(1);
}
