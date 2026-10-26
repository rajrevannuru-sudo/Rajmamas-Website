// Social share image (DESIGN.md §3.18), rendered with satori → resvg. Layout mirrors design/reference/social-share-template.html; fonts are Manrope + Inter.
import fs from 'node:fs';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

const font = (pkg: string, file: string) => fs.readFileSync(path.resolve('node_modules/@fontsource', pkg, 'files', file));
const fonts = [
  { name: 'Manrope', data: font('manrope', 'manrope-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
  { name: 'Manrope', data: font('manrope', 'manrope-latin-700-normal.woff'), weight: 700 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter', 'inter-latin-400-normal.woff'), weight: 400 as const, style: 'normal' as const },
  { name: 'Inter', data: font('inter', 'inter-latin-600-normal.woff'), weight: 600 as const, style: 'normal' as const },
];

// Gold logo (bottom-left), embedded as a data URL for satori.
const logoPng = fs.readFileSync(path.resolve('src/assets/images/brand/vaks-consulting-logo-gold.png'));
const logoDataUrl = `data:image/png;base64,${logoPng.toString('base64')}`;
const logoRatio = logoPng.readUInt32BE(16) / logoPng.readUInt32BE(20); // PNG IHDR width / height
const LOGO_H = 56;

const C = { midnight: '#0b1d33', gold: '#c6a56b', parchment: '#f4efe5', muted: '#b4c0cf' };

type El = { type: string; props: Record<string, unknown> & { children?: unknown } };
const h = (type: string, style: Record<string, unknown>, children?: unknown): El => ({ type, props: { style, children } });

export async function renderOg(eyebrow: string, title: string): Promise<Buffer> {
  const size = title.length > 60 ? 50 : 60;
  const tree = h(
    'div',
    {
      width: 1200, height: 630, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      padding: '72px 80px', background: C.midnight, color: C.parchment, fontFamily: 'Inter',
    },
    [
      h('div', { display: 'flex', fontSize: 18, fontWeight: 600, letterSpacing: 3.6, textTransform: 'uppercase', color: C.gold }, eyebrow),
      h('div', { display: 'flex', flexDirection: 'column' }, [
        h('div', { width: 96, height: 4, background: C.gold, marginBottom: 28 }),
        h('div', { display: 'flex', fontFamily: 'Manrope', fontWeight: 700, fontSize: size, lineHeight: 1.15, letterSpacing: -1.2, maxWidth: 1000 }, title),
      ]),
      h('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 22, color: C.muted }, [
        { type: 'img', props: { src: logoDataUrl, width: LOGO_H * logoRatio, height: LOGO_H, style: { display: 'flex' } } },
        h('div', { display: 'flex' }, 'vaksconsulting.com'),
      ]),
    ],
  );
  const svg = await satori(tree as never, { width: 1200, height: 630, fonts });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
