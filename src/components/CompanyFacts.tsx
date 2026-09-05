import React from 'react';
import { translations, type Locale } from '@/locales/translations';

export const CompanyFacts: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].facts;

  return (
    <section id="empresa" className="section-padding bg-slate-50 scroll-mt-24">
      <div className="container max-w-3xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 text-center">{t.title}</h2>
        <dl className="rounded-3xl border border-slate-100 bg-white divide-y divide-slate-100 overflow-hidden">
          {t.rows.map(([k, v]) => (
            <div key={k} className="grid sm:grid-cols-3 gap-2 px-6 py-4 text-sm">
              <dt className="font-semibold text-slate-500">{k}</dt>
              <dd className="sm:col-span-2 text-slate-800">{v}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
};
