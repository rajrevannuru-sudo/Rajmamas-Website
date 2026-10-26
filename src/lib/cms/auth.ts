// Username/password login with a signed, HttpOnly session cookie (8 hours).
// Only one session is active at a time: each login stores a new session id server-side (lib/kv.ts),
// so any other browser that was signed in is signed out on its next request or heartbeat.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { cmsEnv } from './env';
import { kvDel, kvGet, kvMode, kvSet } from '../kv';

const COOKIE = 'vaks_cms';
const MAX_AGE = 60 * 60 * 8;
const SESSION_KEY = 'cms:session';

const sign = (payload: string) => createHmac('sha256', cmsEnv.secret()).update(payload).digest('base64url');

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function isConfigured() {
  return Boolean(cmsEnv.username() && cmsEnv.password() && cmsEnv.secret().length >= 16);
}

export function checkCredentials(username: string, password: string) {
  if (!isConfigured()) return false;
  // Compare both so the response time doesn't reveal which one was wrong.
  const u = safeEqual(username.trim().toLowerCase(), cmsEnv.username().toLowerCase());
  const p = safeEqual(password, cmsEnv.password());
  return u && p;
}

type Payload = { u: string; exp: number; sid?: string };

function readCookie(cookies: AstroCookies): Payload | null {
  if (!isConfigured()) return null;
  const value = cookies.get(COOKIE)?.value ?? '';
  const [payload, sig] = value.split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Payload;
    return typeof data.exp === 'number' && data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

/** Starts a session and makes it the only valid one. */
export async function startSession(cookies: AstroCookies, secure: boolean) {
  const sid = randomBytes(18).toString('base64url');
  if (kvMode() !== 'none') await kvSet(SESSION_KEY, sid, MAX_AGE);
  const payload = Buffer.from(JSON.stringify({ u: cmsEnv.username(), exp: Date.now() + MAX_AGE * 1000, sid })).toString('base64url');
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, { httpOnly: true, secure, sameSite: 'strict', path: '/cms', maxAge: MAX_AGE });
}

export async function endSession(cookies: AstroCookies) {
  const data = readCookie(cookies);
  if (data?.sid && kvMode() !== 'none' && (await kvGet(SESSION_KEY)) === data.sid) await kvDel(SESSION_KEY);
  cookies.delete(COOKIE, { path: '/cms' });
}

/**
 * "ok": signed in. "replaced": a newer login elsewhere took over this session. "none": not signed in.
 * Without a database (kvMode "none") the single-session rule can't be enforced, so a valid cookie is enough.
 */
export async function sessionState(cookies: AstroCookies): Promise<'ok' | 'replaced' | 'none'> {
  const data = readCookie(cookies);
  if (!data) return 'none';
  if (kvMode() === 'none') return 'ok';
  const current = await kvGet(SESSION_KEY).catch(() => null);
  if (current && data.sid && safeEqual(current, data.sid)) return 'ok';
  return current ? 'replaced' : 'none';
}

export async function isLoggedIn(cookies: AstroCookies) {
  return (await sessionState(cookies)) === 'ok';
}

/** For CMS pages: a redirect to the login screen when not signed in, otherwise null. */
export async function guard(ctx: { cookies: AstroCookies; redirect: (path: string) => Response }): Promise<Response | null> {
  const state = await sessionState(ctx.cookies);
  if (state === 'ok') return null;
  if (state === 'replaced') ctx.cookies.delete(COOKIE, { path: '/cms' });
  return ctx.redirect(state === 'replaced' ? '/cms?signedout=elsewhere' : '/cms');
}

/** For CMS API routes: a 401 JSON response when not signed in, otherwise null. */
export async function guardApi(cookies: AstroCookies): Promise<Response | null> {
  const state = await sessionState(cookies);
  if (state === 'ok') return null;
  return Response.json(
    { error: state === 'replaced' ? 'You were signed out because someone signed in from another browser or device.' : 'Please log in again.', reason: state },
    { status: 401 },
  );
}

/** Whether only one active session can be enforced (needs the database). */
export const singleSessionEnforced = () => kvMode() !== 'none';

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
