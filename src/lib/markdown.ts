// Renders markdown strings (sections split out of a body) with the same placeholder plugin as the site config.
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import remarkPlaceholders from './remark-placeholders.mjs';

const processor = await createMarkdownProcessor({ remarkPlugins: [remarkPlaceholders] });

export async function md(source: string): Promise<string> {
  return (await processor.render(source)).code;
}

/** Splits a markdown body at its "## " headings: [{ heading, body }]. Text before the first heading is dropped. */
export function splitSections(body: string): { heading: string; body: string }[] {
  return body
    .split(/^## /m)
    .slice(1)
    .map((chunk) => {
      const [first, ...rest] = chunk.split('\n');
      return { heading: first.trim(), body: rest.join('\n').trim() };
    });
}
