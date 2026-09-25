import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { areas, topics } from './config/taxonomy';

const common = z.object({
  title: z.string(),
  description: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  draft: z.boolean().default(true),
  test: z.boolean().default(false),
  topics: z.array(z.enum(topics)).default([]),
  tags: z.array(z.string()).default([]),
  sources: z
    .array(
      z.object({
        title: z.string(),
        url: z.url(),
        note: z.string().optional(),
      }),
    )
    .default([]),
  scientificNames: z.array(z.string()).default([]),
  relatedContent: z
    .array(
      z.object({
        collection: z.enum([
          'articles',
          'species',
          'glossary',
          'places',
          'books',
          'experiences',
        ]),
        id: z.string(),
      }),
    )
    .default([]),
  knowledgeStatus: z
    .enum(['editorial', 'experience', 'hypothesis', 'evidence'])
    .default('editorial'),
});
const articles = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/articles' }),
  schema: ({ image }) =>
    common.extend({
      publishedDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      author: z.string(),
      category: z
        .string()
        .refine(
          (value) => areas.some((area) => area.id === value),
          'Categoria sconosciuta',
        ),
      heroImage: image(),
      heroAlt: z.string().min(1),
      readingTime: z.number().positive(),
      featured: z.boolean().default(false),
    }),
});
const knowledge = (folder: string) =>
  defineCollection({
    loader: glob({ pattern: '**/*.{md,mdx}', base: `./src/content/${folder}` }),
    schema: common,
  });
export const collections = {
  articles,
  glossary: knowledge('glossary'),
  species: knowledge('species'),
  places: knowledge('places'),
  books: knowledge('books'),
  experiences: knowledge('experiences'),
};
