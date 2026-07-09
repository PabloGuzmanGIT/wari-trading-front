import type { MetadataRoute } from 'next';
import { API_BASE_URL, SITE_URL } from '@/lib/config';

const LOCALES = ['es', 'en'] as const;
const STATIC_ROUTES = ['', '/blog', '/demand-board', '/traceability'] as const;

interface BlogPostSummary {
  id: number;
  date: string;
}

async function getBlogPosts(locale: string): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog?locale=${locale}`, {
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

  for (const locale of LOCALES) {
    for (const route of STATIC_ROUTES) {
      entries.push({
        url: `${SITE_URL}/${locale}${route}`,
        changeFrequency: route === '' ? 'weekly' : 'daily',
        priority: route === '' ? 1 : 0.7,
      });
    }

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
