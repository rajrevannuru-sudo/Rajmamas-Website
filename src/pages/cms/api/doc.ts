// GET /cms/api/doc?id=<doc> → { label, kind, data, body } for the visual editor (login required).
import type { APIRoute } from 'astro';
import { guardApi } from '../../../lib/cms/auth';
import { loadDoc, resolveDoc, type Doc } from '../../../lib/cms/content';

export const prerender = false;

export const GET: APIRoute = async ({ url, cookies }) => {
  const denied = await guardApi(cookies);
  if (denied) return denied;
  const doc = resolveDoc(url.searchParams.get('id') ?? '');
  if (!doc) return Response.json({ error: 'Unknown content file.' }, { status: 404 });
  try {
    const { data, body } = await loadDoc(doc as Doc);
    return Response.json({ label: doc.label, kind: doc.kind, data, body: body ?? null }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
};
