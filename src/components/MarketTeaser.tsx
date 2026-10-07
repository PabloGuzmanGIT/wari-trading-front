import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/locales/translations';
import { pages, routes } from '@/locales/pages';
import { getPosts } from '@/lib/blog';
import { SectionHeading } from '@/components/Section';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';

export async function MarketTeaser({ locale }: { locale: Locale }) {
  const t = pages[locale].home.market;
  const posts = (await getPosts(locale)).slice(0, 3);

  return (
    <section className="section-padding bg-[#fbfbfa]">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
          <Link href={`/${locale}${routes.market}`} className="btn-secondary no-underline self-start md:mb-12 flex-shrink-0">
            {t.cta} <FiArrowRight />
          </Link>
        </div>

        {posts.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-5">
            {posts.map((post) => (
              <Link key={post.id} href={`/${locale}/blog/${post.id}`} className="group rounded-2xl bg-white border border-slate-200 p-6 no-underline hover:shadow-lg transition-shadow flex flex-col">
                <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 mb-2">{post.category}</div>
                <h3 className="font-bold text-slate-900 leading-snug mb-2 group-hover:text-emerald-700">{post.title}</h3>
                <p className="text-sm text-slate-500 line-clamp-3 flex-1">{post.summary}</p>
                <div className="text-xs text-slate-400 mt-4">{post.date}</div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-6 flex items-center gap-3 text-sm text-slate-500">
            <FiTrendingUp className="text-emerald-500" /> {t.empty}
          </div>
        )}
      </div>
    </section>
  );
}
