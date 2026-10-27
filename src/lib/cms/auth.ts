// Username/password login with a signed, HttpOnly session cookie (8 hours). Several users can be configured
// (see cmsEnv.users). Each user has one active session at a time: a login stores a new session id for that user
// server-side (lib/kv.ts), so that user's other browser is signed out on its next request or heartbeat.
import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { cmsEnv } from './env';
import { kvDel, kvGet, kvMode, kvSet } from '../kv';

const COOKIE = 'vaks_cms';
const MAX_AGE = 60 * 60 * 8;
const sessionKey = (user: string) => `cms:session:${user.toLowerCase()}`;

const sign = (payload: string) => createHmac('sha256', cmsEnv.secret()).update(payload).digest('base64url');

const safeEqual = (a: string, b: string) => {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};

export function isConfigured() {
  return Boolean(cmsEnv.users().length && cmsEnv.secret().length >= 16);
}

/** Returns the matching user's name (as configured), or null. Every user is checked so timing reveals nothing. */
export function checkCredentials(username: string, password: string): string | null {
  if (!isConfigured()) return null;
  const given = username.trim().toLowerCase();
  let match: string | null = null;
  for (const user of cmsEnv.users()) {
    const u = safeEqual(given, user.username.toLowerCase());
    const p = safeEqual(password, user.password);
    if (u && p) match = user.username;
  }
  return match;
}

const userExists = (name: string) => cmsEnv.users().some((u) => u.username.toLowerCase() === name.toLowerCase());

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

/** Starts a session for `user` and makes it that user's only valid session. */
export async function startSession(cookies: AstroCookies, secure: boolean, user: string) {
  const sid = randomBytes(18).toString('base64url');
  if (kvMode() !== 'none') await kvSet(sessionKey(user), sid, MAX_AGE);
  const payload = Buffer.from(JSON.stringify({ u: user, exp: Date.now() + MAX_AGE * 1000, sid })).toString('base64url');
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, { httpOnly: true, secure, sameSite: 'strict', path: '/cms', maxAge: MAX_AGE });
}

export async function endSession(cookies: AstroCookies) {
  const data = readCookie(cookies);
  if (data?.sid && kvMode() !== 'none' && (await kvGet(sessionKey(data.u))) === data.sid) await kvDel(sessionKey(data.u));
  cookies.delete(COOKIE, { path: '/cms' });
}

/**
 * "ok": signed in. "replaced": a newer login by the same user elsewhere took over this session. "none": not signed in.
 * Without a database (kvMode "none") the single-session rule can't be enforced, so a valid cookie is enough.
 */
export async function sessionState(cookies: AstroCookies): Promise<'ok' | 'replaced' | 'none'> {
  const data = readCookie(cookies);
  if (!data || !data.u || !userExists(data.u)) return 'none';
  if (kvMode() === 'none') return 'ok';
  const current = await kvGet(sessionKey(data.u)).catch(() => null);
  if (current && data.sid && safeEqual(current, data.sid)) return 'ok';
  return current ? 'replaced' : 'none';
}

/** Name of the signed-in user from the (signed) cookie, for display and commit messages. */
export function cookieUser(cookies: AstroCookies): string {
  return readCookie(cookies)?.u ?? '';
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
