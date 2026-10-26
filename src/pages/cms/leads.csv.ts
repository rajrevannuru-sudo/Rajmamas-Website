// GET /cms/leads.csv — all leads (or the current status/form filter) as a spreadsheet (login required).
import type { APIRoute } from 'astro';
import { isLoggedIn } from '../../lib/cms/auth';
import { listLeads } from '../../lib/leads';

export const prerender = false;

const cell = (v: string) => {
  // Quote every cell; neutralise leading =,+,-,@ so spreadsheets don't run formulas.
  const s = /^[=+\-@]/.test(v) ? `'${v}` : v;
  return `"${s.replace(/"/g, '""')}"`;
};

export const GET: APIRoute = async ({ cookies, url }) => {
  if (!isLoggedIn(cookies)) return new Response('Unauthorised', { status: 401 });
  const status = url.searchParams.get('status');
  const form = url.searchParams.get('form');
  const leads = (await listLeads()).filter((l) => (!status || l.status === status) && (!form || l.form === form));
  const header = ['Received', 'Status', 'Name', 'Email', 'Company', 'Interested in', 'Message', 'Form', 'Page', 'Notes'];
  const rows = leads.map((l) => [l.createdAt, l.status, l.name, l.email, l.company, l.services, l.message, l.form, l.page, l.notes].map((v) => cell(String(v ?? ''))));
  const csv = [header.map(cell), ...rows].map((r) => r.join(',')).join('\r\n');
  return new Response(`﻿${csv}`, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="vaks-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      'Cache-Control': 'no-store',
    },
  });
};
