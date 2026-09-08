import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/posts' }),
  schema: () =>
    z.object({
      title: z.string().trim().min(1),
      description: z.string().trim().min(1),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string().trim().min(1)).default([]),
      series: z.string().trim().min(1).optional(),
      seriesOrder: z.number().int().positive().optional(),
      cover: z.string().trim().min(1).optional(),
      coverAlt: z.string().trim().min(1).optional(),
      draft: z.boolean().default(false),
      featured: z.boolean().default(false)
    }).superRefine((post, context) => {
      if (post.cover && !post.coverAlt) {
        context.addIssue({
          code: 'custom',
          path: ['coverAlt'],
          message: 'coverAlt is required when cover is set'
        });
      }

      if (post.updatedDate && post.updatedDate < post.pubDate) {
        context.addIssue({
          code: 'custom',
          path: ['updatedDate'],
          message: 'updatedDate cannot be earlier than pubDate'
        });
      }

      if (post.seriesOrder !== undefined && !post.series) {
        context.addIssue({
          code: 'custom',
          path: ['series'],
          message: 'series is required when seriesOrder is set'
        });
      }

      const normalizedTags = post.tags.map((tag) => tag.normalize('NFKC').toLocaleLowerCase());
      if (new Set(normalizedTags).size !== normalizedTags.length) {
        context.addIssue({
          code: 'custom',
          path: ['tags'],
          message: 'tags cannot contain duplicates'
        });
      }
    })
});

export const collections = { posts };
