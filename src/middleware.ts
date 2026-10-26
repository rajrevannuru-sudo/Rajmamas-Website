// Same-origin check for CMS form posts. Replaces Astro's built-in checkOrigin, which compares against the
// function's internal URL on Vercel and so rejected genuine logins. Here we compare the browser's Origin
// header with the host the visitor actually used (x-forwarded-host on Vercel, Host locally).
import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { request, url } = context;
  if (request.method !== 'GET' && request.method !== 'HEAD' && url.pathname.startsWith('/cms')) {
    const origin = request.headers.get('origin');
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
    let sameOrigin = false;
    try {
      sameOrigin = !!origin && !!host && new URL(origin).host === host.split(',')[0].trim();
    } catch {
      sameOrigin = false;
    }
    if (!sameOrigin) return new Response('Cross-site form submissions are not allowed.', { status: 403 });
  }
  return next();
});
