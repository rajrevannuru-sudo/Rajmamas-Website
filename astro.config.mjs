// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import fs from 'node:fs';
import YAML from 'yaml';
import remarkPlaceholders from './src/lib/remark-placeholders.mjs';

// Blog post dates for the sitemap's <lastmod> (posts are created in the CMS; every save rebuilds the site).
/** @type {Record<string, Date>} */
const postDates = {};
for (const file of fs.readdirSync('./content/blog').filter((f) => f.endsWith('.md'))) {
  const front = fs.readFileSync(`./content/blog/${file}`, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/);
  const d = (front && YAML.parse(front[1])) || {};
  const date = new Date(d.updated ?? d.date);
  if (!d.draft && !Number.isNaN(date.getTime())) postDates[file.replace(/\.md$/, '')] = date;
}

// The site is prerendered (static). Only the /cms routes opt out with `prerender = false`
// and run as a Vercel serverless function.
export default defineConfig({
  site: 'https://vaksconsulting.com',
  output: 'static',
  adapter: vercel(),
  // CMS posts are origin-checked in src/middleware.ts (Astro's check misreads the host behind Vercel's proxy).
  security: { checkOrigin: false },
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
    sitemap({
      filter: (page) => !/\/(404|cms)(\.html|\/|$)/.test(page),
      serialize(item) {
        const slug = item.url.match(/\/blog\/([^/]+)$/)?.[1];
        if (slug && postDates[slug]) item.lastmod = postDates[slug].toISOString();
        return item;
      },
    }),
  ],
});
