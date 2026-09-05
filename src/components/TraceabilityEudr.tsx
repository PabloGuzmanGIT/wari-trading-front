import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { FiShield, FiCheck } from 'react-icons/fi';

export const TraceabilityEudr: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].trace;

  return (
    <section id="eudr" className="section-padding bg-slate-50 scroll-mt-24">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider mb-4">
              <FiShield size={13} /> EUDR
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">{t.title}</h2>
            <p className="text-lg text-slate-500 mb-4">{t.subtitle}</p>
            <p className="text-sm text-slate-600 leading-relaxed">{t.body}</p>
          </div>

          <div className="lg:col-span-6">
            <ul className="space-y-3 mb-6">
              {t.points.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm text-slate-700 font-medium bg-white border border-slate-100 rounded-xl p-4">
                  <FiCheck className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <p className="text-xs text-slate-400 italic">{t.disclaimer}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
