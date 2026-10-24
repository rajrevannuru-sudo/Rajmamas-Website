// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkPlaceholders from './src/lib/remark-placeholders.mjs';

export default defineConfig({
  site: 'https://vaksconsulting.com',
  output: 'static',
  trailingSlash: 'never',
  build: { format: 'file' },
  markdown: { remarkPlugins: [remarkPlaceholders] },
  integrations: [
    sitemap({ filter: (page) => !/\/404(\.html)?$/.test(page) }),
  ],
});
