import Link from 'next/link';
import type { Metadata } from 'next';
import { FiCalendar, FiUser, FiArrowLeft, FiTag } from 'react-icons/fi';
import { API_BASE_URL, SITE_URL } from '@/lib/config';

interface BlogPost {
  id: number;
  locale: string;
  title: string;
  summary: string;
  content: string;
  cover_image: string;
  secondary_image?: string;
  author: string;
  date: string;
  category: string;
}

interface Props {
  params: Promise<{ locale: 'es' | 'en'; id: string }>;
}

async function getPost(id: string, locale: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog/${id}?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (err) {
    console.error('Error fetching blog post:', err);
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, id } = await params;
  const post = await getPost(id, locale);
  if (!post) {
    return { title: 'Wari Trading S.A.C.' };
  }

  const url = `${SITE_URL}/${locale}/blog/${post.id}`;
  const title = `${post.title} | Wari Trading S.A.C.`;

  return {
    title,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.summary,
      url,
      type: 'article',
      publishedTime: post.date,
      authors: [post.author],
      images: [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.summary,
      images: [post.cover_image],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const isEs = locale === 'es';
  const post = await getPost(id, locale);

  if (!post) {
    return (
      <div className="section-padding bg-slate-50 flex-grow min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-slate-500 text-sm italic">{isEs ? 'Artículo no encontrado.' : 'Article not found.'}</p>
        <Link href={`/${locale}/blog`} className="btn-primary !text-xs !py-2 !px-4 no-underline">
          {isEs ? 'Volver al Blog' : 'Back to Blog'}
        </Link>
      </div>
    );
  }

  const url = `${SITE_URL}/${locale}/blog/${post.id}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.summary,
    image: post.cover_image,
    datePublished: post.date,
    author: { '@type': 'Person', name: post.author },
    publisher: {
      '@type': 'Organization',
      name: 'Wari Trading S.A.C.',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
  };

  return (
    <article className="section-padding bg-slate-50 flex-grow min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="container max-w-3xl">

        {/* Back Link */}
        <Link
          href={`/${locale}/blog`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 text-sm font-semibold mb-8 cursor-pointer no-underline"
        >
          <FiArrowLeft />
          {isEs ? 'Volver al Listado' : 'Back to Blog'}
        </Link>

        {/* Categoria Badge */}
        <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full mb-4">
          <FiTag size={12} />
          {post.category}
        </span>

        {/* Titulo */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight mb-4 tracking-tight">
          {post.title}
        </h1>

        {/* Metadatos */}
        <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider mb-8 border-b border-slate-200 pb-4">
          <span className="flex items-center gap-1">
            <FiCalendar />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <FiUser />
            {post.author}
          </span>
        </div>

        {/* Imagen Portada Principal (1200x630, renderizada en aspect-video o similar) */}
        <div className="relative w-full aspect-[1.91/1] rounded-3xl overflow-hidden shadow-lg mb-8 border border-slate-200">
          <img
            src={post.cover_image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Contenido HTML */}
        <div
          className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-6 text-base sm:text-lg mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Imagen Secundaria Opcional (800x450, renderizada en relación 16:9) */}
        {post.secondary_image && (
          <div className="mt-10 pt-8 border-t border-slate-200">
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden shadow-md max-w-xl mx-auto border border-slate-200">
              <img
                src={post.secondary_image}
                alt={`${post.title} - ${isEs ? 'Imagen Secundaria' : 'Secondary Image'}`}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-[10px] text-center text-slate-400 italic mt-2">
              {isEs ? 'Fotografía de campo. Wari Trading S.A.C.' : 'Field photograph. Wari Trading S.A.C.'}
            </p>
          </div>
        )}

      </div>
    </article>
  );
}
