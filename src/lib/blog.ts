import { API_INTERNAL_URL } from '@/lib/config';

export interface BlogPostSummary {
  id: number;
  locale: string;
  title: string;
  summary: string;
  cover_image: string;
  author: string;
  date: string;
  category: string;
}

/** Notas de mercado desde el backend. Si la API no responde, devuelve [] (la UI lo omite). */
export async function getPosts(locale: string): Promise<BlogPostSummary[]> {
  try {
    const res = await fetch(`${API_INTERNAL_URL}/api/blog?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return [];
  }
}
