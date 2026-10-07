import type { Metadata } from 'next';
import { SITE_URL, company } from '@/lib/company';
import type { Locale } from '@/locales/translations';

/**
 * Metadata estándar de una página interna: canonical, hreflang es/en y
 * OpenGraph con la imagen de [locale]/opengraph-image (si se define `openGraph`
 * propio sin `images`, la página pierde la miniatura heredada).
 */
export function pageMetadata(locale: Locale, path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  const images = [{ url: `${SITE_URL}/${locale}/opengraph-image`, width: 1200, height: 630, alt: company.name }];
  const fullTitle = `${title} | ${company.name}`;
  return {
    // El layout raíz aplica la plantilla "%s | marca"; aquí va solo el título.
    title,
    description,
    alternates: {
      canonical: url,
      languages: { es: `${SITE_URL}/es${path}`, en: `${SITE_URL}/en${path}`, 'x-default': `${SITE_URL}/es${path}` },
    },
    openGraph: { title: fullTitle, description, url, type: 'website', images },
    twitter: { card: 'summary_large_image', title: fullTitle, description, images },
  };
}

export const toLocale = (raw: string): Locale => (raw === 'en' ? 'en' : 'es');
