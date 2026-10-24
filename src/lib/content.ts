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
