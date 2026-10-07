import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/locales/translations';
import { pages, routes, quoteHref } from '@/locales/pages';
import { SectionHeading } from '@/components/Section';
import { FiArrowRight } from 'react-icons/fi';

// Color de fondo del espacio de imagen por producto, mientras no haya fotos propias.
// TODO: reemplazar por fotos de producto (fondo neutro) cuando estén seleccionadas.
const SWATCH = ['bg-[#5b4636]', 'bg-[#6b3f2a]', 'bg-[#3d2a22]', 'bg-[#2e2420]'];

export const ProductCards: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.products;

  return (
    <section id="products" className="section-padding bg-white scroll-mt-28">
      <div className="container">
        <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.items.map((item, i) => (
            <article key={item.t} className="group flex flex-col rounded-2xl border border-slate-200 overflow-hidden bg-white hover:shadow-lg transition-shadow">
              <div className={`${SWATCH[i]} aspect-[4/3] flex items-end p-4`}>
                <span className="text-white/90 font-headings font-bold text-sm uppercase tracking-wider">{item.t}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-sm text-slate-600 flex-1">{item.d}</p>
                <div className="flex items-center justify-between gap-3 mt-5 pt-4 border-t border-slate-100">
                  <Link
                    href={`/${locale}${routes[item.slug as keyof typeof routes]}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:text-emerald-900 no-underline"
                  >
                    {t.spec} <FiArrowRight size={14} />
                  </Link>
                  <Link
                    href={quoteHref(locale, item.slug === 'derivatives' ? 'processing' : 'grain')}
                    className="text-xs font-semibold text-slate-500 hover:text-slate-800 no-underline"
                  >
                    {t.sample}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
