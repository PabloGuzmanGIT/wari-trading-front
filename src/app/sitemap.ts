import type { MetadataRoute } from 'next';
import { API_INTERNAL_URL, SITE_URL } from '@/lib/config';

const LOCALES = ['es', 'en'] as const;
const STATIC_ROUTES = [
  '', '/products/coffee', '/products/cocoa', '/products/derivatives',
  '/maquila', '/private-label', '/traceability', '/origin', '/about', '/quote', '/blog',
] as const;

interface BlogPostSummary {
  id: number;
  date: string;
}

async function getBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_INTERNAL_URL}/api/blog?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Error fetching blog posts for sitemap:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  // Cada idioma va como <loc> propio con sus alternates (Google pide que cada
  // URL del grupo hreflang esté en el sitemap, no solo como alternate).
  for (const route of STATIC_ROUTES) {
    for (const locale of LOCALES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        changeFrequency: route === '' ? 'weekly' : route === '/blog' ? 'daily' : 'monthly',
        priority: route === '' ? 1 : route === '/maquila' || route.startsWith('/products') ? 0.9 : 0.7,
        alternates: {
          languages: {
            es: `${SITE_URL}/es${route}`,
            en: `${SITE_URL}/en${route}`,
            'x-default': `${SITE_URL}/es${route}`,
          },
        },
      });
    }
  }

  for (const locale of LOCALES) {
    const posts = await getBlogPosts(locale);
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.id}`,
        lastModified: post.date,
        changeFrequency: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}
