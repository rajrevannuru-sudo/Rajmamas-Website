// Tiny key-value store shared by the CMS (single active session) and leads.
// Upstash Redis REST on Vercel; .data/kv.json in local dev; unavailable otherwise.
import fs from 'node:fs/promises';
import path from 'node:path';
import { cmsEnv } from './cms/env';

const LOCAL_FILE = path.resolve('.data/kv.json');
export const hasRedis = () => Boolean(cmsEnv.redisUrl() && cmsEnv.redisToken());
export const kvMode = () => (hasRedis() ? 'redis' : import.meta.env.DEV ? 'local' : 'none');

/** Runs Redis commands in one round trip (Upstash pipeline). */
export async function redis<T = unknown>(commands: (string | number)[][]): Promise<T[]> {
  const res = await fetch(`${cmsEnv.redisUrl().replace(/\/$/, '')}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cmsEnv.redisToken()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(commands),
  });
  if (!res.ok) throw new Error(`Database error ${res.status}`);
  const out = (await res.json()) as { result?: T; error?: string }[];
  const failed = out.find((r) => r.error);
  if (failed) throw new Error(`Database error: ${failed.error}`);
  return out.map((r) => r.result as T);
}

type LocalEntry = { value: string; exp?: number };
async function readLocal(): Promise<Record<string, LocalEntry>> {
  try {
    return JSON.parse(await fs.readFile(LOCAL_FILE, 'utf8'));
  } catch {
    return {};
  }
}
async function writeLocal(data: Record<string, LocalEntry>) {
  await fs.mkdir(path.dirname(LOCAL_FILE), { recursive: true });
  await fs.writeFile(LOCAL_FILE, JSON.stringify(data, null, 2));
}

export async function kvGet(key: string): Promise<string | null> {
  if (hasRedis()) return (await redis<string | null>([['GET', key]]))[0] ?? null;
  const e = (await readLocal())[key];
  return e && (!e.exp || e.exp > Date.now()) ? e.value : null;
}

export async function kvSet(key: string, value: string, ttlSeconds?: number): Promise<void> {
  if (hasRedis()) {
    await redis([ttlSeconds ? ['SET', key, value, 'EX', ttlSeconds] : ['SET', key, value]]);
    return;
  }
  const data = await readLocal();
  data[key] = { value, exp: ttlSeconds ? Date.now() + ttlSeconds * 1000 : undefined };
  await writeLocal(data);
}

export async function kvDel(key: string): Promise<void> {
  if (hasRedis()) {
    await redis([['DEL', key]]);
    return;
  }
  const data = await readLocal();
  delete data[key];
  await writeLocal(data);
}
