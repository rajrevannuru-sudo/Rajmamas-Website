// Renders [bracketed] (unconfirmed) copy inside <span class="placeholder">, brackets kept visible.
const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export function ph(text: string | undefined | null): string {
  if (!text) return '';
  return escape(text).replace(/\[[^\]\n]+\]/g, (m) => `<span class="placeholder">${m}</span>`);
}

/** Plain text for meta tags and JSON-LD: brackets stay, no markup. */
export const plain = (text: string) => text.replace(/\s+/g, ' ').trim();

/** Fills {key} tokens in UI strings, e.g. "See the {client} case study". */
export const fill = (template: string, values: Record<string, string>) =>
  template.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
