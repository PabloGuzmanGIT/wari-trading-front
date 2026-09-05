import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';

export const Certifications: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].certs;
  const coops = company.alliedCoops;

  return (
    <section id="certs" className="section-padding bg-white scroll-mt-24">
      <div className="container max-w-4xl">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 text-center">{t.title}</h2>
        <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mb-6 rounded-full" />

        <p className="text-slate-600 leading-relaxed text-center max-w-2xl mx-auto mb-8">{t.bridge}</p>

        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">{t.coopsLabel}</div>
          {coops.length > 0 ? (
            <ul className="space-y-2">
              {coops.map((c) => (
                <li key={c.name} className="text-sm text-slate-700">
                  <span className="font-semibold">{c.name}</span>
                  {c.certs && c.certs.length > 0 && <span className="text-slate-500"> — {c.certs.join(', ')}</span>}
                  {c.certifier && <span className="text-slate-400"> ({c.certifier})</span>}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">{t.coopsPending}</p>
          )}
        </div>

        <p className="text-xs text-slate-400 italic mt-4 text-center">{t.roadmap}</p>
      </div>
    </section>
  );
};
