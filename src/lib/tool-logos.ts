// Maps tool names used in content/services/*.md `tools:` to a brand logo (Simple Icons, CC0)
// or, where no brand mark exists, one of the site's line icons. Unknown names fall back to "doc".
import {
  siOpenapiinitiative, siPostman, siMarkdown, siMdx, siDocusaurus, siReadme, siGitbook, siGithub, siGit, siHtml5,
  siZendesk, siIntercom, siHelpscout, siConfluence, siNotion, siGoogledocs, siGoogledrive, siLucid, siMiro, siCanva,
  siZoom, siAdobeacrobatreader,
} from 'simple-icons';
import type { IconName } from './icons';

type Brand = { path: string; hex: string; title: string };
export type ToolLogo = { kind: 'brand'; path: string; color: string } | { kind: 'icon'; name: IconName };

const brands: Record<string, Brand> = {
  'openapi / swagger': siOpenapiinitiative,
  postman: siPostman,
  markdown: siMarkdown,
  mdx: siMdx,
  docusaurus: siDocusaurus,
  readme: siReadme,
  gitbook: siGitbook,
  'git & github': siGithub,
  git: siGit,
  html: siHtml5,
  'zendesk guide': siZendesk,
  intercom: siIntercom,
  helpscout: siHelpscout,
  confluence: siConfluence,
  notion: siNotion,
  'google docs': siGoogledocs,
  'google drive': siGoogledrive,
  lucidchart: siLucid,
  miro: siMiro,
  canva: siCanva,
  'remote via zoom or teams': siZoom,
  pdf: siAdobeacrobatreader,
};

const icons: Record<string, IconName> = {
  freshdesk: 'ticket',
  sharepoint: 'doc',
  'microsoft word': 'doc',
  powerpoint: 'doc',
  vale: 'check',
  'in person in hyderabad': 'pin',
  'your own docs and tools': 'book',
  'analytics and search data': 'search',
};

// Pale brand colours are darkened toward midnight until they reach 3:1 on the paper chip.
const PAPER = [0xff, 0xfd, 0xf8];
const MIDNIGHT = [0x0b, 0x1d, 0x33];
const lum = (rgb: number[]) => {
  const [r, g, b] = rgb.map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: number[], b: number[]) => {
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
function legible(hex: string): string {
  let rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  for (let t = 0; contrast(rgb, PAPER) < 3 && t < 20; t++) {
    rgb = rgb.map((v, i) => Math.round(v + (MIDNIGHT[i] - v) * 0.12));
  }
  return `#${rgb.map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

export function toolLogo(tool: string): ToolLogo {
  const key = tool.toLowerCase().replace(/\[|\]/g, '').trim();
  const brand = brands[key];
  if (brand) return { kind: 'brand', path: brand.path, color: legible(brand.hex) };
  return { kind: 'icon', name: icons[key] ?? 'doc' };
}
