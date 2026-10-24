import { z } from 'astro/zod';
import siteJson from '../../content/site.json';
import pagesJson from '../../content/pages.json';

const titled = z.object({ title: z.string(), text: z.string(), icon: z.string().optional() });

const siteSchema = z.object({
  name: z.string(),
  legalName: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.string().url(),
  email: z.string(),
  phone: z.string(),
  phoneHref: z.string(),
  whatsappHref: z.string().url(),
  bookingUrl: z.string(),
  address: z.object({ locality: z.string(), region: z.string(), country: z.string(), display: z.string() }),
  responseTime: z.string(),
  availability: z.string(),
  callHours: z.string(),
  linkedinCompany: z.string(),
  founder: z.object({
    name: z.string(),
    shortName: z.string(),
    jobTitle: z.string(),
    experienceYears: z.string(),
    location: z.string(),
    linkedin: z.string().url(),
    photo: z.string(),
    photoAlt: z.string(),
    shortBio: z.string(),
    bio: z.array(z.string()),
    careerResults: z.array(z.object({ value: z.string(), label: z.string() })),
    careerResultsNote: z.string(),
    expertise: z.array(z.string()),
  }),
  stats: z.array(z.object({ value: z.string(), suffix: z.string(), label: z.string(), icon: z.string().optional() })),
  clients: z.array(z.string()),
  clientLogos: z.record(z.string(), z.union([z.string(), z.object({ file: z.string(), scale: z.number().positive().default(1) })])).default({}),
  nav: z.array(z.object({ label: z.string(), href: z.string(), dropdown: z.boolean().optional() })),
  process: z.array(titled),
  engagementFlow: z.array(titled),
  projectFlow: z.array(titled),
  problems: z.array(titled),
  values: z.array(titled),
  story: z.array(z.string()),
  homeFaq: z.array(z.object({ q: z.string(), a: z.string() })),
  testimonials: z.array(
    z.object({ quote: z.string(), name: z.string(), role: z.string(), company: z.string(), confirmed: z.boolean() }),
  ),
});

const pageSeo = z.object({
  title: z.string().max(60),
  description: z.string().max(160),
  h1: z.string(),
  ogEyebrow: z.string(),
});

// pages.json is free-form section copy; only the SEO blocks are checked strictly.
const pagesSchema = z
  .object({
    home: z.object({ seo: pageSeo }).passthrough(),
    services: z.object({ seo: pageSeo }).passthrough(),
    caseStudies: z.object({ seo: pageSeo }).passthrough(),
    about: z.object({ seo: pageSeo }).passthrough(),
    contact: z.object({ seo: pageSeo }).passthrough(),
    privacy: z.object({ seo: pageSeo }).passthrough(),
    notFound: z.object({ seo: pageSeo }).passthrough(),
  })
  .passthrough();

export const site = siteSchema.parse(siteJson);
pagesSchema.parse(pagesJson);
export const pages = pagesJson;

/** Testimonials marked confirmed: false show in dev only. */
export const showUnconfirmed = import.meta.env.DEV;
export const testimonials = site.testimonials.filter((t) => t.confirmed || showUnconfirmed);

export const absoluteUrl = (path: string) => (path === '/' ? `${site.url}/` : `${site.url}${path}`);
