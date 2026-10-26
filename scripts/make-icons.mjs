// Builds the favicon set and the JSON-LD logo from the brand files in assets-brand/.
// Run with `node scripts/make-icons.mjs` after the logo changes.
import fs from 'node:fs';
import sharp from 'sharp';

const mark = 'assets-brand/vaks-mark-gold.png'; // the gold book mark, cropped from the logo

/** Gold book mark centred on a rounded midnight square. */
async function icon(size, { radius = 0.18, pad = 0.18 } = {}) {
  const inner = Math.round(size * (1 - pad * 2));
  const markBuf = await sharp(mark).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer();
  const r = Math.round(size * radius);
  const bg = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" fill="#0b1d33"/></svg>`);
  return sharp(bg).composite([{ input: markBuf, gravity: 'center' }]).png().toBuffer();
}

fs.writeFileSync('public/apple-touch-icon.png', await icon(180, { radius: 0 }));
fs.writeFileSync('public/icon-192.png', await icon(192));
fs.writeFileSync('public/icon-512.png', await icon(512));
fs.writeFileSync('public/favicon-32.png', await icon(32, { pad: 0.12 }));

// favicon.ico holding 16, 32 and 48px PNGs
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map((s) => icon(s, { pad: 0.1 })));
const header = Buffer.alloc(6 + 16 * sizes.length);
header.writeUInt16LE(0, 0);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(sizes.length, 4);
let offset = header.length;
sizes.forEach((s, i) => {
  const e = 6 + i * 16;
  header.writeUInt8(s, e);
  header.writeUInt8(s, e + 1);
  header.writeUInt16LE(1, e + 4);
  header.writeUInt16LE(32, e + 6);
  header.writeUInt32LE(images[i].length, e + 8);
  header.writeUInt32LE(offset, e + 12);
  offset += images[i].length;
});
fs.writeFileSync('public/favicon.ico', Buffer.concat([header, ...images]));

// JSON-LD logo: full navy logo on white with breathing room
await sharp('src/assets/images/brand/vaks-consulting-logo-navy.png')
  .resize({ width: 1000 })
  .extend({ top: 60, bottom: 60, left: 60, right: 60, background: { r: 255, g: 255, b: 255, alpha: 1 } })
  .flatten({ background: '#ffffff' })
  .png()
  .toFile('public/logo.png');

console.log('icons written');
