// One-off: renders public/favicon.svg into the PNG/ICO favicon set and a square logo for JSON-LD.
// Run with `node scripts/make-icons.mjs` after changing the monogram.
import fs from 'node:fs';
import sharp from 'sharp';

const svg = fs.readFileSync('public/favicon.svg');
const png = (size) => sharp(svg, { density: 1200 }).resize(size, size).png().toBuffer();

fs.writeFileSync('public/apple-touch-icon.png', await png(180));
fs.writeFileSync('public/icon-192.png', await png(192));
fs.writeFileSync('public/icon-512.png', await png(512));
fs.writeFileSync('public/logo.png', await png(512));

// favicon.ico holding 16, 32 and 48px PNGs
const sizes = [16, 32, 48];
const images = await Promise.all(sizes.map(png));
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
console.log('icons written');
