// POST /cms/api/save { edits: [{ src: "doc|path", value }], page } → one commit with every changed file.
import type { APIRoute } from 'astro';
import { isLoggedIn } from '../../../lib/cms/auth';
import { applyEdits, type Edit } from '../../../lib/cms/content';
import { commit, storeMode } from '../../../lib/cms/store';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
  if (!isLoggedIn(cookies)) return Response.json({ error: 'Please log in again.' }, { status: 401 });
  let payload: { edits?: Edit[]; page?: string };
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 });
  }
  const edits = Array.isArray(payload.edits) ? payload.edits.slice(0, 200) : [];
  if (!edits.length) return Response.json({ error: 'No changes to publish.' }, { status: 400 });
  const { problems, files } = await applyEdits(edits);
  if (problems.length) return Response.json({ error: 'Nothing was published.', problems }, { status: 422 });
  try {
    const page = String(payload.page ?? '').slice(0, 80);
    await commit(files, `Visual edit: ${edits.length} change${edits.length === 1 ? '' : 's'}${page ? ` on ${page}` : ''}`);
    return Response.json({ ok: true, mode: storeMode() });
  } catch (e) {
    return Response.json({ error: String(e) }, { status: 500 });
  }
};
