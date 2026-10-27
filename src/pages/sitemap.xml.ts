// /sitemap.xml — every public page, generated at build time. New top-level pages, services,
// case studies and published blog posts are included automatically. (@astrojs/sitemap also
// writes /sitemap-index.xml; both list the same pages.)
import type { APIRoute } from 'astro';
import { site } from '../lib/site';
import { getServices, getCaseStudies, getPosts, serviceHref, caseHref, postHref } from '../lib/content';

// Top-level pages from src/pages/*.astro (404 and the CMS are private/excluded).
const pageFiles = Object.keys(import.meta.glob('./*.astro'));
const EXCLUDE = new Set(['404']);

const xmlEscape = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const GET: APIRoute = async () => {
  const top = pageFiles
    .map((f) => f.replace(/^\.\//, '').replace(/\.astro$/, ''))
    .filter((name) => !EXCLUDE.has(name))
    .map((name) => ({ path: name === 'index' ? '/' : `/${name}`, lastmod: undefined as Date | undefined }));

  const services = (await getServices()).map((s) => ({ path: serviceHref(s), lastmod: undefined as Date | undefined }));
  const studies = (await getCaseStudies()).map((c) => ({ path: caseHref(c), lastmod: undefined as Date | undefined }));
  const posts = (await getPosts())
    .filter((p) => !p.data.draft)
    .map((p) => ({ path: postHref(p), lastmod: p.data.updated ?? p.data.date }));

  const urls = [...top, ...services, ...studies, ...posts].sort((a, b) => (a.path === '/' ? -1 : b.path === '/' ? 1 : a.path.localeCompare(b.path)));
  const body = urls
    .map(({ path, lastmod }) => {
      const loc = path === '/' ? `${site.url}/` : `${site.url}${path}`;
      return `  <url>\n    <loc>${xmlEscape(loc)}</loc>${lastmod ? `\n    <lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ''}\n  </url>`;
    })
    .join('\n');

  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
