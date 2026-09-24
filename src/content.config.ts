import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Projects: one folder per project under /projects, each with an index.mdx.
 * Folders starting with "_" (like _template) are ignored.
 * The schema is enforced at build time; a missing field or image fails `npm run build`.
 * Guide: docs/ADDING-PROJECTS.md
 */

const url = z.url({ error: 'must be a full URL starting with https://' });

const projects = defineCollection({
  loader: glob({
    pattern: ['*/index.{md,mdx}', '!_*/**'],
    base: './projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string({ error: 'title is required' }).min(1),
        slug: z
          .string({ error: 'slug is required (use the folder name)' })
          .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, 'slug must be lowercase letters, numbers and hyphens'),
        summary: z
          .string({ error: 'summary is required' })
          .min(1)
          .max(160, 'summary must be one line (160 characters max)'),
        thumbnail: image(),
        thumbnailAlt: z.string({ error: 'thumbnailAlt is required (describe the image for screen readers)' }).min(1),
        year: z.union([z.number().int().min(2000).max(2100), z.string().regex(/^\d{4}(–\d{2,4})?$/)], {
          error: 'year must be a number like 2026 or a range like "2024–26"',
        }),
        role: z.string({ error: 'role is required' }).min(1),
        stack: z.array(z.string().min(1)).min(1, 'stack needs at least one entry'),
        links: z
          .object({
            live: url.optional(),
            repo: url.optional(),
            caseStudy: url.optional(),
            docs: url.optional(),
          })
          .strict()
          .default({}),
        problem: z.string({ error: 'problem is required' }).min(1),
        outcome: z.string({ error: 'outcome is required' }).min(1),
        order: z.number({ error: 'order is required (lower numbers come first)' }).int(),
        featured: z.boolean().default(false),
        status: z.enum(['live', 'in-progress', 'complete', 'archived', 'placeholder'], {
          error: 'status must be one of: live, in-progress, complete, archived, placeholder',
        }),
        screenshots: z
          .array(z.object({ src: image(), alt: z.string().min(1), caption: z.string().optional() }))
          .default([]),
      })
      .strict(),
});

export const collections = { projects };
