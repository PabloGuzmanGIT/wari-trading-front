import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';

export const Certifications: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].certs;
  const coops = company.alliedCoops;

  return (
    <section id="certs" className="scroll-mt-24 rounded-2xl bg-[#f3f7ee] p-6 sm:p-8">
      <h2 className="font-body! text-2xl font-bold tracking-tight text-wari-navy sm:text-[1.75rem]">{t.title}</h2>
      <p className="mt-4 leading-relaxed text-slate-800">{t.bridge}</p>

      {/* Solo se muestra con alianzas reales cargadas en company.alliedCoops. */}
      {coops.length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-5">
          <div className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-600">{t.coopsLabel}</div>
          <ul className="space-y-2">
            {coops.map((c) => (
              <li key={c.name} className="text-sm text-slate-800">
                <span className="font-semibold">{c.name}</span>
                {c.certs && c.certs.length > 0 && <span className="text-slate-600"> — {c.certs.join(', ')}</span>}
                {c.certifier && <span className="text-slate-600"> ({c.certifier})</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};
