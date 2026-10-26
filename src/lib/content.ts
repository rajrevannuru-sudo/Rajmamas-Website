import { getCollection, getEntry, type CollectionEntry } from 'astro:content';

export type Service = CollectionEntry<'services'>;
export type CaseStudy = CollectionEntry<'caseStudies'>;

export async function getServices(): Promise<Service[]> {
  return (await getCollection('services')).sort((a, b) => a.data.order - b.data.order);
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  return (await getCollection('caseStudies')).sort((a, b) => a.data.order - b.data.order);
}

export async function getService(slug: string) {
  if (!slug) return undefined;
  const entry = await getEntry('services', slug);
  if (!entry) throw new Error(`Unknown service "${slug}"`);
  return entry;
}

export async function getCaseStudy(slug: string) {
  if (!slug) return undefined;
  const entry = await getEntry('caseStudies', slug);
  if (!entry) throw new Error(`Unknown case study "${slug}"`);
  return entry;
}

export const serviceHref = (s: Service) => `/services/${s.id}`;
export const caseHref = (c: CaseStudy) => `/case-studies/${c.id}`;

export type Post = CollectionEntry<'blog'>;

/** Published posts, newest first. Drafts show in dev only. */
export async function getPosts(): Promise<Post[]> {
  return (await getCollection('blog', (p) => import.meta.env.DEV || !p.data.draft)).sort(
    (a, b) => b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const postHref = (p: Post) => `/blog/${p.id}`;

/** Rough reading time at 220 words a minute. */
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.split(/\s+/).filter(Boolean).length / 220));

export const formatDate = (d: Date) =>
  d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Kolkata' });
