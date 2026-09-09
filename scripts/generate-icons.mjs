/**
 * Genera todo el set de iconos del sitio a partir de un único diseño maestro.
 *
 *   node scripts/generate-icons.mjs
 *
 * Salidas:
 *   src/app/icon.svg              favicon vectorial (navegadores modernos)
 *   src/app/favicon.ico           16/32/48 px  (resultados de Google, navegadores viejos)
 *   src/app/apple-icon.png        180x180      (iOS "Añadir a pantalla de inicio")
 *   public/icon-192.png           192x192      manifest, purpose "any"
 *   public/icon-512.png           512x512      manifest, purpose "any" + logo JSON-LD
 *   public/icon-maskable-512.png  512x512      manifest, purpose "maskable" (con zona segura)
 *
 * Requiere `sharp` (viene con Next). Es un script de build local: los PNG/ICO
 * resultantes se versionan, no se regeneran en cada deploy.
 */
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

// Paleta de marca (misma que el sitio)
const BG = '#0f172a'; // azul elefante oscuro (tinta)
const SNOW = '#fbfbfa'; // hueso
const RIVER = '#2f5d50'; // verde pino
const RIVER_HI = '#6f9a8d'; // verde claro (brillo del río)

// Marca «Cumbre»: sierra de tres picos y el río serpenteando por el valle central,
// sobre fondo tinta. El perfil evoca la «W» de Wari; montaña + río, el VRAEM.
// Formas planas sin contornos + una línea de corriente -> legible a 16 px.
const CUMBRE = `
  <path d="M-20 378 L84 200 L188 252 L256 168 L324 252 L428 200 L532 378 Z" fill="${SNOW}"/>
  <path d="M-16 372 C70 350 120 360 182 342 C232 328 250 300 276 302 C316 306 340 356 400 368 C452 378 496 360 528 366 L528 452 C470 462 430 442 372 430 C320 419 288 452 250 452 C214 452 190 424 140 430 C84 437 30 456 -16 448 Z" fill="${RIVER}"/>
  <path d="M-8 400 C74 380 126 390 186 374 C234 361 252 336 276 338 C314 342 338 384 396 396 C448 406 492 390 520 396" fill="none" stroke="${RIVER_HI}" stroke-width="9" stroke-linecap="round"/>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>${CUMBRE}
</svg>`;

/** Igual, compactado dentro de la zona segura (círculo central) del recorte maskable de Android. */
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <g transform="translate(97.28 97.28) scale(0.62)">${CUMBRE}
  </g>
</svg>`;

const png = (svg, size) =>
  sharp(Buffer.from(svg), { density: 384 }).resize(size, size).png({ compressionLevel: 9 }).toBuffer();

/** Empaqueta varios PNG en un contenedor .ico (PNG embebido, soportado por todos los navegadores relevantes). */
function pngsToIco(items) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(items.length, 4);
  const dir = Buffer.alloc(16 * items.length);
  let offset = header.length + dir.length;
  items.forEach((it, i) => {
    const e = dir.subarray(i * 16, i * 16 + 16);
    e.writeUInt8(it.size >= 256 ? 0 : it.size, 0);
    e.writeUInt8(it.size >= 256 ? 0 : it.size, 1);
    e.writeUInt16LE(1, 4); // planes
    e.writeUInt16LE(32, 6); // bpp
    e.writeUInt32LE(it.buffer.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += it.buffer.length;
  });
  return Buffer.concat([header, dir, ...items.map((it) => it.buffer)]);
}

const out = (...p) => join(root, ...p);

await writeFile(out('src', 'app', 'icon.svg'), iconSvg + '\n');

await writeFile(out('src', 'app', 'apple-icon.png'), await png(iconSvg, 180));
await writeFile(out('public', 'icon-192.png'), await png(iconSvg, 192));
await writeFile(out('public', 'icon-512.png'), await png(iconSvg, 512));
await writeFile(out('public', 'icon-maskable-512.png'), await png(maskableSvg, 512));

const ico = pngsToIco(
  await Promise.all(
    [16, 32, 48].map(async (size) => ({ size, buffer: await png(iconSvg, size) })),
  ),
);
await writeFile(out('src', 'app', 'favicon.ico'), ico);

console.log('Iconos generados:');
console.log('  src/app/icon.svg, src/app/favicon.ico, src/app/apple-icon.png');
console.log('  public/icon-192.png, public/icon-512.png, public/icon-maskable-512.png');
