import React from 'react';
import Link from 'next/link';
import { translations, type Locale } from '@/locales/translations';
import { FiDownload, FiArrowRight } from 'react-icons/fi';

const SpecTable: React.FC<{ name: string; rows: string[][] }> = ({ name, rows }) => (
  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
    <div className="bg-slate-900 text-white px-6 py-4 font-bold">{name}</div>
    <dl className="divide-y divide-slate-100">
      {rows.map(([k, v]) => (
        <div key={k} className="grid grid-cols-3 gap-3 px-6 py-3 text-sm">
          <dt className="text-slate-500 font-semibold col-span-1">{k}</dt>
          <dd className="text-slate-800 col-span-2">{v}</dd>
        </div>
      ))}
    </dl>
  </div>
);

export const SpecSheets: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].specs;

  return (
    <section id="specs" className="section-padding bg-slate-50 scroll-mt-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">{t.title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mb-4 rounded-full" />
          <p className="text-lg text-slate-500">{t.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <SpecTable name={t.coffee.name} rows={t.coffee.rows} />
          <SpecTable name={t.cocoa.name} rows={t.cocoa.rows} />
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h3 className="font-bold text-slate-900 mb-1">{t.specialty.name}</h3>
          <p className="text-sm text-slate-500">{t.specialty.desc}</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mt-10">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 border border-slate-200 rounded-full px-5 py-2.5 cursor-not-allowed" title={locale === 'es' ? 'Ficha PDF en preparación' : 'PDF sheet in preparation'}>
            <FiDownload />
            {t.download}
          </span>
          <Link href={`/${locale}#contact`} className="btn-primary no-underline">
            {t.request}
            <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
};
