// Serves blog images from CMS storage for previews inside the CMS (login required).
import type { APIRoute } from 'astro';
import { isLoggedIn } from '../../../lib/cms/auth';
import { readBinary } from '../../../lib/cms/store';

export const prerender = false;

const types: Record<string, string> = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

export const GET: APIRoute = async ({ params, cookies }) => {
  if (!isLoggedIn(cookies)) return new Response('Unauthorised', { status: 401 });
  const file = params.file ?? '';
  const ext = file.split('.').pop()?.toLowerCase() ?? '';
  if (!/^[a-z0-9-]+\.(jpe?g|png|webp)$/.test(file) || !types[ext]) return new Response('Not found', { status: 404 });
  try {
    const buf = await readBinary(`content/blog/images/${file}`);
    return new Response(new Uint8Array(buf), { headers: { 'Content-Type': types[ext], 'Cache-Control': 'private, max-age=60' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
