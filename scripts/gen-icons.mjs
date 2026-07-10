// Genera los PNG del manifest a partir del logo (techo + corazón).
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const svg = (pad) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${-pad} ${-pad} ${64 + pad * 2} ${64 + pad * 2}">
  <rect x="${-pad}" y="${-pad}" width="${64 + pad * 2}" height="${64 + pad * 2}" rx="${pad ? 0 : 16}" fill="#14584E"/>
  <path d="M14 32 32 16l18 16" fill="none" stroke="#FAF6EF" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M32 49s-11-7-11-14.5A6.2 6.2 0 0 1 32 30a6.2 6.2 0 0 1 11 4.5C43 42 32 49 32 49z" fill="#FAF6EF"/>
</svg>`;

mkdirSync('public/icons', { recursive: true });

await sharp(Buffer.from(svg(0))).resize(192, 192).png().toFile('public/icons/icon-192.png');
await sharp(Buffer.from(svg(0))).resize(512, 512).png().toFile('public/icons/icon-512.png');
// maskable: el contenido vive en la zona segura (80%), fondo pino a sangre completa
await sharp(Buffer.from(svg(10))).resize(512, 512).png().toFile('public/icons/maskable-512.png');

console.log('Iconos generados en public/icons/');
