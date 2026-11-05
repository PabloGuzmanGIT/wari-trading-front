import React from 'react';
import { translations, type Locale } from '@/locales/translations';

export const CompanyFacts: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].facts;

  return (
    <section id="empresa" className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
      <h2 className="font-body! text-2xl font-bold tracking-tight text-wari-navy sm:text-[1.75rem]">{t.title}</h2>
      <dl className="mt-3 divide-y divide-slate-200">
        {t.rows.map(([k, v]) => (
          <div key={k} className="grid gap-1 py-3 text-sm sm:grid-cols-3 sm:gap-3">
            <dt className="font-bold text-wari-navy">{k}</dt>
            <dd className="text-slate-700 sm:col-span-2">{v}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};
