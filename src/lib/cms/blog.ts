// Blog post files: content/blog/<slug>.md with the cover image in content/blog/images/.
import YAML from 'yaml';
import { listDir, readText } from './store';

export type PostFields = {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
  image: string;
  imageAlt: string;
  body: string;
  cta: { title: string; text: string; buttonLabel: string; buttonUrl: string };
};

export const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const slugify = (s: string) =>
  s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

export const emptyPost = (): PostFields => ({
  slug: '',
  title: '',
  description: '',
  date: new Date().toISOString().slice(0, 10),
  tags: [],
  draft: true,
  image: '',
  imageAlt: '',
  body: '',
  cta: { title: '', text: '', buttonLabel: '', buttonUrl: '' },
});

export function parsePost(slug: string, text: string): PostFields {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  const d = (m ? YAML.parse(m[1]) : {}) ?? {};
  const date = d.date instanceof Date ? d.date.toISOString().slice(0, 10) : String(d.date ?? '').slice(0, 10);
  return {
    slug,
    title: String(d.title ?? ''),
    description: String(d.description ?? ''),
    date,
    tags: Array.isArray(d.tags) ? d.tags.map(String) : [],
    draft: Boolean(d.draft),
    image: String(d.image ?? ''),
    imageAlt: String(d.imageAlt ?? ''),
    body: (m ? m[2] : text).replace(/^\n/, ''),
    cta: { title: d.cta?.title ?? '', text: d.cta?.text ?? '', buttonLabel: d.cta?.buttonLabel ?? '', buttonUrl: d.cta?.buttonUrl ?? '' },
  };
}

export function serializePost(p: PostFields): string {
  const cta = Object.fromEntries(Object.entries(p.cta).filter(([, v]) => v.trim()));
  const front: Record<string, unknown> = {
    title: p.title,
    description: p.description,
    date: p.date,
    image: p.image,
    imageAlt: p.imageAlt,
    tags: p.tags,
    draft: p.draft,
  };
  if (Object.keys(cta).length) front.cta = cta;
  return `---\n${YAML.stringify(front, { lineWidth: 0 }).trimEnd()}\n---\n\n${p.body.trim()}\n`;
}

/** content/blog/images/x.jpg path for a frontmatter "./images/x.jpg" value. */
export const imageRepoPath = (image: string) => (image.startsWith('./images/') ? `content/blog/${image.slice(2)}` : '');

export async function listPosts(): Promise<PostFields[]> {
  const files = (await listDir('content/blog')).filter((f) => f.endsWith('.md'));
  const posts = await Promise.all(files.map(async (f) => parsePost(f.replace(/\.md$/, ''), await readText(`content/blog/${f}`))));
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}
