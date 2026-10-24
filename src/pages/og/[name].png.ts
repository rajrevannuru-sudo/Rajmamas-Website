import type { APIRoute, GetStaticPaths } from 'astro';
import { pages } from '../../lib/site';
import { fill } from '../../lib/placeholder';
import { getServices, getCaseStudies } from '../../lib/content';
import { renderOg } from '../../lib/og';

const strip = (s: string) => s.replace(/[[\]]/g, '');

export const getStaticPaths: GetStaticPaths = async () => {
  const fixed = [
    ['home', pages.home.seo],
    ['services', pages.services.seo],
    ['case-studies', pages.caseStudies.seo],
    ['about', pages.about.seo],
    ['contact', pages.contact.seo],
    ['privacy-policy', pages.privacy.seo],
  ] as const;
  const services = (await getServices()).map((s) => ({
    params: { name: `services-${s.id}` },
    props: { eyebrow: `Services · ${s.data.name}`, title: s.data.seo.h1 },
  }));
  const studies = (await getCaseStudies()).map((c) => ({
    params: { name: `case-studies-${c.id}` },
    props: { eyebrow: fill(pages.caseStudy.ogEyebrow, { client: c.data.client }), title: c.data.title },
  }));
  return [
    ...fixed.map(([name, seo]) => ({ params: { name }, props: { eyebrow: seo.ogEyebrow, title: seo.h1 } })),
    ...services,
    ...studies,
  ];
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOg(strip(props.eyebrow as string), strip(props.title as string));
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
