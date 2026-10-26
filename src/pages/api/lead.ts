// POST /api/lead — every website form sends its enquiry here; it appears in CMS → Leads.
import type { APIRoute } from 'astro';
import { allowSubmission, saveLead } from '../../lib/leads';

export const prerender = false;

const clip = (v: unknown, max: number) => String(v ?? '').replace(/\r\n/g, '\n').trim().slice(0, max);
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: 'Invalid request' }, { status: 400 });
  }
  // Honeypot: real visitors never tick the hidden "botcheck" box. Pretend success to bots.
  if (body.botcheck) return Response.json({ ok: true });

  const lead = {
    form: clip(body.form, 30) || 'website',
    page: clip(body.page, 200),
    name: clip(body.name, 120),
    email: clip(body.email, 200),
    company: clip(body.company, 160),
    services: clip(body.services, 400),
    message: clip(body.message, 5000),
  };
  if (!lead.name || !EMAIL.test(lead.email) || !lead.message) {
    return Response.json({ ok: false, error: 'Please fill in your name, a valid email and a message.' }, { status: 422 });
  }
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || (() => {
    try {
      return clientAddress;
    } catch {
      return 'unknown';
    }
  })();
  try {
    if (!(await allowSubmission(ip))) return Response.json({ ok: false, error: 'Too many messages. Please try again later.' }, { status: 429 });
    await saveLead(lead);
    return Response.json({ ok: true });
  } catch (e) {
    console.error('lead save failed', e);
    return Response.json({ ok: false, error: 'Could not save the enquiry.' }, { status: 500 });
  }
};
