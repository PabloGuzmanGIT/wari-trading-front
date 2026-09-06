import type { MetadataRoute } from 'next';
import { company } from '@/lib/company';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${company.name} — ${company.tagline.es}`,
    short_name: company.name,
    description: company.description.es,
    start_url: '/es',
    display: 'standalone',
    background_color: '#0f172a',
    theme_color: '#0f172a',
    orientation: 'portrait',
    // PNG para máxima compatibilidad (Android, splash, atajos) + SVG escalable.
    // El maskable lleva zona segura propia (grano más chico) para que Android
    // no recorte el diseño al aplicar su máscara. Ver scripts/generate-icons.mjs.
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };
}
