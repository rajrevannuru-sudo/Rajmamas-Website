// Username/password login with a signed, HttpOnly session cookie (8 hours). No database needed.
import { createHmac, timingSafeEqual } from 'node:crypto';
import type { AstroCookies } from 'astro';
import { cmsEnv } from './env';

const COOKIE = 'vaks_cms';
const MAX_AGE = 60 * 60 * 8;

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

export function startSession(cookies: AstroCookies, secure: boolean) {
  const payload = Buffer.from(JSON.stringify({ u: cmsEnv.username(), exp: Date.now() + MAX_AGE * 1000 })).toString('base64url');
  cookies.set(COOKIE, `${payload}.${sign(payload)}`, { httpOnly: true, secure, sameSite: 'strict', path: '/cms', maxAge: MAX_AGE });
}

export function endSession(cookies: AstroCookies) {
  cookies.delete(COOKIE, { path: '/cms' });
}

export function isLoggedIn(cookies: AstroCookies) {
  if (!isConfigured()) return false;
  const value = cookies.get(COOKIE)?.value ?? '';
  const [payload, sig] = value.split('.');
  if (!payload || !sig || !safeEqual(sig, sign(payload))) return false;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return typeof exp === 'number' && exp > Date.now();
  } catch {
    return false;
  }
}

export const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));
