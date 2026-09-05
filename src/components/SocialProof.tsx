import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';

export const SocialProof: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].social;
  const coops = company.alliedCoops;

  return (
    <section className="section-padding bg-white">
      <div className="container max-w-4xl text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">{t.title}</h2>

        {coops.length > 0 && (
          <div className="mb-8">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">{t.coopsTitle}</div>
            <div className="flex flex-wrap justify-center gap-2">
              {coops.map((c) => (
                <span key={c.name} className="text-sm font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-full px-4 py-2">
                  {c.name}
                </span>
              ))}
            </div>
          </div>
        )}

        <p className="text-sm text-slate-400 italic">{t.pending}</p>
      </div>
    </section>
  );
};
