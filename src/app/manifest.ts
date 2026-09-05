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
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'maskable' },
    ],
  };
}
