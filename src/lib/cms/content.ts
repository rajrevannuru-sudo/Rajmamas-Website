// Which content files the CMS may edit, and how form fields map onto them.
// Existing values can be edited; nothing can be added or removed (only blog posts can be created).
import YAML from 'yaml';
import * as lucide from 'lucide-static';
import { iconNames } from '../icons';
import { listDir, readText } from './store';

export type Doc = {
  id: string;
  /** Human name, e.g. the service or case study title. */
  label: string;
  /** What this file controls, in plain words. */
  summary: string;
  group: string;
  path: string;
  kind: 'json' | 'md';
  /** Live pages that show this content (first one is linked as "View page"). */
  pages: { label: string; url: string }[];
};

/** Keys that hold structure (URLs, ordering, links between pages) rather than copy. */
export const LOCKED = new Set(['slug', 'order', 'secondary', 'next', 'service', 'relatedCaseStudy', 'url', 'href', 'dropdown', 'photo', 'maxLength']);

const human = (s: string) => s.replace(/\.(md|json)$/, '').replace(/-/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export async function listDocs(): Promise<Doc[]> {
  const docs: Doc[] = [
    {
      id: 'site',
      label: 'Business details, founder & home content',
      summary: 'Contact details, founder bio and career results, home page problems, process, FAQ, testimonials, values and stats.',
      group: 'Site',
      path: 'content/site.json',
      kind: 'json',
      pages: [{ label: 'Home', url: '/' }, { label: 'About', url: '/about' }, { label: 'Contact', url: '/contact' }],
    },
    {
      id: 'pages',
      label: 'Page headings & interface text',
      summary: 'Section headings, leads, buttons and form labels used across every page, plus the blog page text.',
      group: 'Site',
      path: 'content/pages.json',
      kind: 'json',
      pages: [{ label: 'Home', url: '/' }, { label: 'Services', url: '/services' }, { label: 'Case studies', url: '/case-studies' }, { label: 'Blog', url: '/blog' }],
    },
    {
      id: 'privacy',
      label: 'Privacy policy',
      summary: 'The privacy policy page text.',
      group: 'Site',
      path: 'content/pages/privacy-policy.md',
      kind: 'md',
      pages: [{ label: 'Privacy policy', url: '/privacy-policy' }],
    },
  ];
  for (const [folder, group] of [['services', 'Services'], ['case-studies', 'Case studies']] as const) {
    const files = (await listDir(`content/${folder}`)).filter((f) => f.endsWith('.md')).sort();
    const entries = await Promise.all(
      files.map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const path = `content/${folder}/${file}`;
        let d: Record<string, unknown> = {};
        try {
          d = parse('md', await readText(path)).data;
        } catch {
          /* fall back to the file name */
        }
        const isService = folder === 'services';
        const label = String((isService ? d.name : d.client) ?? human(file));
        const summary = isService ? String(d.cardDescription ?? '') : String(d.title ?? '');
        return { id: `${folder}/${slug}`, label, summary, group, path, kind: 'md' as const, pages: [{ label, url: `/${folder}/${slug}` }], order: Number(d.order ?? 99) };
      }),
    );
    entries.sort((a, b) => a.order - b.order).forEach(({ order: _order, ...doc }) => docs.push(doc));
  }
  return docs;
}

export async function getDoc(id: string): Promise<Doc | undefined> {
  return (await listDocs()).find((d) => d.id === id);
}

export function parse(kind: Doc['kind'], text: string): { data: Record<string, unknown>; body?: string } {
  if (kind === 'json') return { data: JSON.parse(text) };
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { data: {}, body: text };
  return { data: (YAML.parse(m[1]) ?? {}) as Record<string, unknown>, body: m[2].replace(/^\n/, '') };
}

export function serialize(kind: Doc['kind'], data: Record<string, unknown>, body = ''): string {
  if (kind === 'json') return `${JSON.stringify(data, null, 2)}\n`;
  const front = YAML.stringify(data, { lineWidth: 0 }).trimEnd();
  return `---\n${front}\n---\n\n${body.trim()}\n`;
}

// Same name conversion as components/Glyph.astro, so anything that passes here renders.
const isLucide = (name: string) =>
  /^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) &&
  typeof (lucide as unknown as Record<string, unknown>)[name.replace(/(^|-)([a-z0-9])/g, (_, __, c: string) => c.toUpperCase())] === 'string';

/** Applies `f.<path>` (text/number) and `b.<path>` (checkbox) fields onto data, in place. Returns problems. */
export function applyForm(data: Record<string, unknown>, form: FormData, opts: { serviceIconAtRoot?: boolean } = {}): string[] {
  const problems: string[] = [];
  const checked = new Set(form.getAll('bool-on').map(String));
  for (const [name, raw] of form.entries()) {
    const isText = name.startsWith('f.');
    const isBool = name.startsWith('b.');
    if (!isText && !isBool) continue;
    const parts = name.slice(2).split('.');
    const key = parts[parts.length - 1];
    if (LOCKED.has(key) || key.startsWith('_')) continue;
    let parent: unknown = data;
    for (const p of parts.slice(0, -1)) parent = (parent as Record<string, unknown> | undefined)?.[p];
    if (!parent || typeof parent !== 'object' || !(key in parent)) continue;
    const obj = parent as Record<string, unknown>;
    const current = obj[key];
    if (isBool && typeof current === 'boolean') {
      obj[key] = checked.has(name.slice(2));
      continue;
    }
    if (!isText) continue;
    // Field values are single pieces of copy: trim stray whitespace (Markdown bodies are handled separately).
    const value = String(raw).replace(/\r\n/g, '\n').trim();
    if (typeof current === 'number') {
      const n = Number(value);
      if (Number.isFinite(n)) obj[key] = n;
      else problems.push(`${name.slice(2)} must be a number.`);
    } else if (typeof current === 'string') {
      if (key === 'icon') {
        const v = value.trim();
        const valid = opts.serviceIconAtRoot && parts.length === 1 ? (iconNames as readonly string[]).includes(v) : isLucide(v);
        if (!valid) {
          problems.push(`"${v}" is not a known icon name (${name.slice(2)}). See lucide.dev/icons.`);
          continue;
        }
        obj[key] = v;
      } else obj[key] = value;
    }
  }
  return problems;
}

export async function loadDoc(doc: Doc) {
  return parse(doc.kind, await readText(doc.path));
}
