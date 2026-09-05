import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { company } from '@/lib/company';
import { FiMapPin } from 'react-icons/fi';

export const Sourcing: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].sourcing;

  return (
    <section id="sourcing" className="section-padding bg-white scroll-mt-24">
      <div className="container">
        <div className="grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">{t.title}</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mb-4 rounded-full" />
            <p className="text-lg text-slate-500 mb-6">{t.subtitle}</p>

            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{t.districtsLabel}</div>
              <div className="flex flex-wrap gap-2">
                {company.origin.districts.map((d) => (
                  <span key={d} className="inline-flex items-center gap-1 text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-full">
                    <FiMapPin className="text-cyan-600" size={12} />
                    {d}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 space-y-4">
            {t.differentiators.map((d) => (
              <div key={d.t} className="rounded-2xl border border-slate-100 p-6 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-slate-900 mb-1">{d.t}</h3>
                <p className="text-sm text-slate-500">{d.d}</p>
              </div>
            ))}
            <p className="text-xs text-slate-400 italic pt-2">{t.note}</p>
          </div>
        </div>
      </div>
    </section>
  );
};
