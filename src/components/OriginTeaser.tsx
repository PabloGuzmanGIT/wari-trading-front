import React from 'react';
import Link from 'next/link';
import type { Locale } from '@/locales/translations';
import { pages, routes } from '@/locales/pages';
import { company } from '@/lib/company';
import { SectionHeading } from '@/components/Section';
import { CorridorMap } from '@/components/CorridorMap';
import { FiArrowRight } from 'react-icons/fi';

export const OriginTeaser: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = pages[locale].home.origin;
  const o = pages[locale].origin;

  return (
    <section className="section-padding bg-[#fbfbfa]">
      <div className="container grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <SectionHeading eyebrow={t.eyebrow} title={t.title} subtitle={t.subtitle} />
          <ul className="grid sm:grid-cols-2 gap-3 mb-8">
            {o.how.map((h) => (
              <li key={h.t} className="rounded-xl bg-white border border-slate-200 p-4">
                <div className="font-bold text-slate-900 text-sm">{h.t}</div>
                <div className="text-xs text-slate-500 mt-1 leading-relaxed">{h.d}</div>
              </li>
            ))}
          </ul>
          <Link href={`/${locale}${routes.origin}`} className="btn-primary no-underline">
            {t.cta} <FiArrowRight />
          </Link>
        </div>
        <div className="rounded-3xl bg-white border border-slate-200 p-6">
          <CorridorMap
            plantLabel={`${locale === 'es' ? 'Planta' : 'Plant'} · ${company.address.region}`}
            riverLabel={locale === 'es' ? 'Río Apurímac · Ene' : 'Apurímac · Ene river'}
            className="w-full max-w-sm mx-auto h-auto"
          />
        </div>
      </div>
    </section>
  );
};
