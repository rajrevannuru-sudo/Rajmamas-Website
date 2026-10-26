// Marks rendered text with the content field it comes from, for the CMS visual editor.
// A source is "doc|path", e.g. "site|process.0.title" or "services/api-documentation|lead" ("__body" = Markdown body).
// The attribute is invisible to visitors; the editor at /cms/visual uses it to make text clickable.
export type Src = string | undefined;

export const src = (doc: string, path: string): string => `${doc}|${path}`;
export const sub = (base: Src, key: string | number): Src => (base ? `${base}.${key}` : undefined);
export const at = (s: Src) => (s ? { 'data-cms': s } : {});
