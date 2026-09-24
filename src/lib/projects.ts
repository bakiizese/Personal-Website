import { getCollection, type CollectionEntry } from 'astro:content';

export type Project = CollectionEntry<'projects'>;

/**
 * All projects, sorted by `order`. Also runs the checks Zod can't express on a single entry:
 * the slug must match its folder name, and no two projects may share a slug or an order.
 */
export async function getProjects(): Promise<Project[]> {
  const projects = await getCollection('projects');
  const problems: string[] = [];

  const seenOrder = new Map<number, string>();
  for (const p of projects) {
    if (p.data.slug !== p.id) {
      problems.push(`projects/${p.id}/index.mdx: slug "${p.data.slug}" must match its folder name "${p.id}"`);
    }
    const clash = seenOrder.get(p.data.order);
    if (clash) {
      problems.push(`projects/${p.id}/index.mdx: order ${p.data.order} is already used by projects/${clash}`);
    }
    seenOrder.set(p.data.order, p.id);
  }

  if (problems.length) {
    throw new Error(`\n\nProject validation failed:\n  - ${problems.join('\n  - ')}\n\nSee docs/ADDING-PROJECTS.md\n`);
  }

  return projects.sort((a, b) => a.data.order - b.data.order);
}

export const statusLabel: Record<Project['data']['status'], string> = {
  live: 'Live',
  'in-progress': 'In progress',
  complete: 'Complete',
  archived: 'Archived',
  placeholder: '[PLACEHOLDER]',
};
