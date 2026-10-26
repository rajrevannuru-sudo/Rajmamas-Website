import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { iconNames } from './lib/icons';

const seo = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  h1: z.string().optional(),
  primaryKeyword: z.string(),
  keywords: z.array(z.string()).default([]),
});

const titled = z.object({ title: z.string(), text: z.string() });
const faq = z.array(z.object({ q: z.string(), a: z.string() }));

const services = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/services' }),
  schema: z.object({
    name: z.string(),
    slug: z.string(),
    order: z.number(),
    secondary: z.boolean().default(false),
    icon: z.enum(iconNames),
    cardDescription: z.string(),
    seo: seo.extend({ h1: z.string() }),
    eyebrow: z.string(),
    headings: z.object({
      problems: z.string(),
      intro: z.string(),
      included: z.string(),
      faq: z.string(),
      cta: z.string().optional(),
    }),
    lead: z.string(),
    /** Hero diagram inputs (Lucide icon names), 3–4 items. */
    heroInputs: z.array(z.object({ label: z.string(), icon: z.string() })).min(3).max(4),
    whoFor: z.array(z.string()),
    problems: z.array(titled),
    included: z.array(z.string()),
    timelineNote: z.string().optional(),
    process: z.array(titled.extend({ label: z.string() })).min(3).max(5),
    tools: z.array(z.string()).default([]),
    relatedCaseStudy: z.string().optional().default(''),
    faq,
  }),
});

const caseStudies = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/case-studies' }),
  schema: z.object({
    client: z.string(),
    slug: z.string(),
    order: z.number(),
    industry: z.string(),
    service: z.string(),
    serviceLabel: z.string(),
    timeline: z.string(),
    title: z.string(),
    seo,
    headings: z.object({ challenge: z.string(), approach: z.string(), outcome: z.string() }).partial().default({}),
    headlineMetric: z.object({ value: z.string(), label: z.string() }),
    summary: z.object({ challenge: z.string(), approach: z.string(), outcome: z.string() }),
    approach: z.array(titled).min(3).max(5),
    outcomes: z.array(z.object({ value: z.string(), label: z.string() })),
    deliverables: z.array(z.string()),
    quote: z
      .object({ text: z.string(), name: z.string(), role: z.string(), confirmed: z.boolean().default(false) })
      .optional(),
    next: z.string(),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/pages' }),
  schema: z.object({ title: z.string().optional() }),
});

// Blog posts are created and edited in the CMS (/cms). The author is always the founder (site.json).
const blog = defineCollection({
  loader: glob({ pattern: '*.md', base: './content/blog' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().max(160),
      date: z.coerce.date(),
      updated: z.coerce.date().optional(),
      image: image(),
      imageAlt: z.string(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      cta: z
        .object({
          title: z.string().optional(),
          text: z.string().optional(),
          buttonLabel: z.string().optional(),
          buttonUrl: z.string().optional(),
        })
        .default({}),
    }),
});

export const collections = { services, caseStudies, pages, blog };
