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
const BG = '#0f172a'; // azul elefante oscuro
const BEAN = '#fbfbfa'; // hueso
const CREASE = '#2f5d50'; // verde

/** Marca a sangre: grano de café pálido con la veta central en S sobre fondo oscuro. */
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <ellipse cx="256" cy="256" rx="134" ry="178" fill="${BEAN}"/>
  <path d="M256 98 C300 166 300 248 256 306 C212 364 212 402 256 414" fill="none" stroke="${CREASE}" stroke-width="30" stroke-linecap="round"/>
</svg>`;

/** Igual, pero con el grano más chico: queda dentro de la zona segura del recorte maskable. */
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <rect width="512" height="512" fill="${BG}"/>
  <ellipse cx="256" cy="256" rx="104" ry="138" fill="${BEAN}"/>
  <path d="M256 140 C290 192 290 256 256 300 C222 344 222 376 256 384" fill="none" stroke="${CREASE}" stroke-width="24" stroke-linecap="round"/>
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
