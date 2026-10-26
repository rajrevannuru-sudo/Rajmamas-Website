// POST /cms/api/preview { markdown } → { html, sections } rendered exactly like the site (login required).
import type { APIRoute } from 'astro';
import { guardApi } from '../../../lib/cms/auth';
import { md, splitSections } from '../../../lib/markdown';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  const denied = await guardApi(cookies);
  if (denied) return denied;
  const { markdown } = (await request.json().catch(() => ({}))) as { markdown?: string };
  const source = String(markdown ?? '').slice(0, 100_000);
  const sections = await Promise.all(splitSections(source).map(async (s) => ({ heading: s.heading, html: await md(s.body) })));
  return Response.json({ html: await md(source), sections });
};
