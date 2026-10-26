// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import remarkPlaceholders from './src/lib/remark-placeholders.mjs';

// The site is prerendered (static). Only the /cms routes opt out with `prerender = false`
// and run as a Vercel serverless function.
export default defineConfig({
  site: 'https://vaksconsulting.com',
  output: 'static',
  adapter: vercel(),
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { remarkPlugins: [remarkPlaceholders] },
  // 301s from docs/seo-plan.md §6 (also in public/_redirects and public/.htaccess for other hosts)
  redirects: {
    '/portfolio': { status: 301, destination: '/case-studies' },
    '/theme-study': { status: 301, destination: '/' },
    '/design-system': { status: 301, destination: '/' },
    '/home': { status: 301, destination: '/' },
  },
  integrations: [
    sitemap({ filter: (page) => !/\/(404|cms)(\.html|\/|$)/.test(page) }),
  ],
});
