import type { APIRoute } from 'astro';
import { endSession } from '../../lib/cms/auth';

export const prerender = false;

export const POST: APIRoute = ({ cookies, redirect }) => {
  endSession(cookies);
  return redirect('/cms', 303);
};
