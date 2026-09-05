import Link from 'next/link';
import type { Metadata } from 'next';
import { translations } from '@/locales/translations';
import { FiCalendar, FiUser, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import { API_BASE_URL } from '@/lib/config';
import { SITE_URL, company } from '@/lib/company';

interface BlogPost {
  id: number;
  locale: string;
  title: string;
  summary: string;
  cover_image: string;
  author: string;
  date: string;
  category: string;
}

interface Props {
  params: Promise<{ locale: 'es' | 'en' }>;
}

async function getPosts(locale: string): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/blog?locale=${locale}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    return res.json();
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const isEs = locale === 'es';
  const title = isEs
    ? `Notas de mercado | ${company.name}`
    : `Market notes | ${company.name}`;
  const description = isEs
    ? 'Precios del café y cacao en el VRAEM, calendario de cosecha, EUDR y cómo compramos en origen.'
    : 'VRAEM coffee and cocoa prices, harvest calendar, EUDR, and how we buy at origin.';
  const url = `${SITE_URL}/${locale}/blog`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        es: `${SITE_URL}/es/blog`,
        en: `${SITE_URL}/en/blog`,
        'x-default': `${SITE_URL}/es/blog`,
      },
    },
    openGraph: { title, description, url, type: 'website' },
    twitter: { card: 'summary', title, description },
  };
}

export default async function BlogListingPage({ params }: Props) {
  const { locale: rawLocale } = await params;
  const locale: 'es' | 'en' = (rawLocale === 'es' || rawLocale === 'en') ? rawLocale : 'es';
  const isEs = locale === 'es';
  const t = translations[locale];
  const posts = await getPosts(locale);

  return (
    <div className="section-padding bg-slate-50 flex-grow min-h-screen">
      <div className="container max-w-5xl">

        {/* Back Link */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-1.5 text-slate-500 hover:text-emerald-700 text-sm font-semibold mb-8 cursor-pointer no-underline"
        >
          <FiArrowLeft />
          {isEs ? 'Volver a Inicio' : 'Back Home'}
        </Link>

        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            {t.nav.blog}
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl">
            {isEs
              ? 'Precios del café y cacao en el VRAEM, calendario de cosecha, EUDR y cómo compramos en origen.'
              : 'VRAEM coffee and cocoa prices, harvest calendar, EUDR, and how we buy at origin.'}
          </p>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-3xl border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Imagen de Portada (Tamaño sugerido: 1200x630px, renderizada en relación 1.91:1) */}
                <Link href={`/${locale}/blog/${post.id}`} className="block relative w-full aspect-[1.91/1] overflow-hidden">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                    {post.category}
                  </div>
                </Link>

                {/* Info */}
                <div className="p-6 md:p-8 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-3">
                    <span className="flex items-center gap-1">
                      <FiCalendar />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser />
                      {post.author}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-950 mb-3 group-hover:text-emerald-700 transition-colors leading-snug line-clamp-2">
                    <Link href={`/${locale}/blog/${post.id}`} className="no-underline text-inherit">
                      {post.title}
                    </Link>
                  </h2>

                  <p className="text-slate-500 text-sm mb-6 line-clamp-3">
                    {post.summary}
                  </p>

                  <Link
                    href={`/${locale}/blog/${post.id}`}
                    className="mt-auto inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700 cursor-pointer no-underline pl-0.5"
                  >
                    {isEs ? 'Leer Más' : 'Read More'}
                    <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-white rounded-3xl border border-slate-100 text-slate-500 italic text-sm">
            {isEs ? 'No hay posts de blog registrados.' : 'No blog posts registered.'}
          </div>
        )}

      </div>
    </div>
  );
}
