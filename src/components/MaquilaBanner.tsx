import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/locales/translations';
import { pages, routes } from '@/locales/pages';
import { SectionHeading, SanitarySeal } from '@/components/Section';
import { FiArrowRight } from 'react-icons/fi';

export const MaquilaBanner: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.maquila;

  return (
    <section className="section-padding bg-emerald-800 text-white">
      <div className="container grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-7">
          <div className="mb-6"><SanitarySeal label={t.seal} dark /></div>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} dark />
          <Link href={`/${locale}${routes.maquila}`} className="inline-flex items-center gap-2 bg-white text-emerald-800 font-headings font-semibold px-5 py-3 rounded-full no-underline hover:bg-emerald-50 transition-colors">
            {t.cta} <FiArrowRight />
          </Link>
        </div>
        <div className="lg:col-span-5 grid grid-cols-3 lg:grid-cols-1 gap-3">
          {t.figures.map((f) => (
            <div key={f.l} className="rounded-2xl border border-white/15 bg-white/5 p-4 sm:p-5 lg:flex lg:items-baseline lg:gap-4">
              <div className="text-2xl sm:text-4xl font-extrabold font-headings tracking-tight">{f.v}</div>
              <div className="text-xs sm:text-sm text-emerald-100/80 mt-1">{f.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
