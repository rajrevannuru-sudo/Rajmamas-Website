// Runs for the on-demand routes (/cms and /api):
// 1. Same-origin check for CMS form posts and the public /api/ endpoints (website forms). Replaces Astro's built-in
//    checkOrigin, which compares against the function's internal URL on Vercel and so rejected genuine logins. Here we
//    compare the browser's Origin header with the host the visitor actually used (x-forwarded-host on Vercel, Host locally).
// 2. Keeps the CMS and API out of search engines: every response gets X-Robots-Tag: noindex, nofollow
//    (covers JSON, CSV and images too, which a <meta> tag can't).
import { defineMiddleware } from 'astro:middleware';

const PRIVATE = /^\/(cms|api)(\/|$)/;

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url } = context;
  const isPrivate = PRIVATE.test(url.pathname);

  if (isPrivate && request.method !== 'GET' && request.method !== 'HEAD') {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    let sameOrigin = false;
    try {
      sameOrigin = !!origin && !!host && new URL(origin).host === host.split(',')[0].trim();
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin) {
      return new Response('Cross-site form submissions are not allowed.', { status: 403, headers: { 'X-Robots-Tag': 'noindex, nofollow' } });
    }
  }

  const response = await next();
  if (isPrivate) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
    if (url.pathname.startsWith('/cms')) response.headers.set('Cache-Control', 'private, no-store');
  }
  return response;
});
