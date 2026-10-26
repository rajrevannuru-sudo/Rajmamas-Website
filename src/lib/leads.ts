// Leads from every website form. Stored in Upstash Redis on Vercel (REST API, no SDK);
// in local dev without Redis they go to .data/leads.json (gitignored).
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHmac, randomBytes } from 'node:crypto';
import { cmsEnv } from './cms/env';
import { hasRedis, redis } from './kv';

export const LEAD_STATUSES = ['new', 'contacted', 'qualified', 'closed'] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export type Lead = {
  id: string;
  createdAt: string;
  status: LeadStatus;
  /** Which form: "contact" or "blog". */
  form: string;
  /** Page the form was on, e.g. /contact or /blog/<slug>. */
  page: string;
  name: string;
  email: string;
  company: string;
  services: string;
  message: string;
  notes: string;
};

const LOCAL_FILE = path.resolve('.data/leads.json');
export const leadStore = () => (hasRedis() ? 'redis' : import.meta.env.DEV ? 'local' : 'none');

async function readLocal(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'));
  } catch {
    return [];
  }
}
async function writeLocal(leads: Lead[]) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(leads, null, 2));
}
function assertStore() {
  if (leadStore() === 'none') throw new Error('The leads database isn’t connected (add Upstash Redis in Vercel).');
}

export async function saveLead(input: Omit<Lead, 'id' | 'createdAt' | 'status' | 'notes'>): Promise<Lead> {
  assertStore();
  const now = new Date();
  const lead: Lead = { id: `${now.getTime().toString(36)}-${randomBytes(4).toString('hex')}`, createdAt: now.toISOString(), status: 'new', notes: '', ...input };
  if (hasRedis()) await redis([['SET', `lead:${lead.id}`, JSON.stringify(lead)], ['ZADD', 'leads', now.getTime(), lead.id]]);
  else await writeLocal([lead, ...(await readLocal())]);
  return lead;
}

export async function listLeads(limit = 1000): Promise<Lead[]> {
  assertStore();
  if (!hasRedis()) return (await readLocal()).slice(0, limit);
  const [ids] = await redis<string[]>([['ZREVRANGE', 'leads', 0, limit - 1]]);
  if (!ids?.length) return [];
  const [rows] = await redis<(string | null)[]>([['MGET', ...ids.map((id) => `lead:${id}`)]]);
  return rows.filter((r): r is string => !!r).map((r) => JSON.parse(r) as Lead);
}

export async function updateLead(id: string, patch: Partial<Pick<Lead, 'status' | 'notes'>>): Promise<void> {
  assertStore();
  if (!/^[a-z0-9]+-[a-f0-9]{8}$/.test(id)) throw new Error('Unknown lead');
  if (hasRedis()) {
    const [row] = await redis<string | null>([['GET', `lead:${id}`]]);
    if (!row) throw new Error('Lead not found');
    await redis([['SET', `lead:${id}`, JSON.stringify({ ...JSON.parse(row), ...patch })]]);
  } else {
    await writeLocal((await readLocal()).map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }
}

export async function deleteLead(id: string): Promise<void> {
  assertStore();
  if (hasRedis()) await redis([['DEL', `lead:${id}`], ['ZREM', 'leads', id]]);
  else await writeLocal((await readLocal()).filter((l) => l.id !== id));
}

/** At most `max` submissions per hour per visitor. The IP is hashed, never stored. */
export async function allowSubmission(ip: string, max = 8): Promise<boolean> {
  if (!hasRedis()) return true;
  const key = `rl:${createHmac('sha256', cmsEnv.secret() || 'vaks').update(ip).digest('hex').slice(0, 24)}`;
  const [count] = await redis<number>([['INCR', key], ['EXPIRE', key, 3600, 'NX']]);
  return Number(count) <= max;
}
