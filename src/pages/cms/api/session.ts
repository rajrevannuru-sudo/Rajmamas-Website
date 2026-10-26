// GET /cms/api/session — heartbeat for open CMS tabs; tells a tab when its session was replaced by a newer login.
import type { APIRoute } from 'astro';
import { sessionState } from '../../../lib/cms/auth';

export const prerender = false;

export const GET: APIRoute = async ({ cookies }) => {
  const state = await sessionState(cookies);
  return Response.json({ ok: state === 'ok', reason: state }, { headers: { 'Cache-Control': 'no-store' } });
};
