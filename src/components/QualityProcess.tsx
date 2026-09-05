import React from 'react';
import { translations, type Locale } from '@/locales/translations';
import { FiCheckCircle } from 'react-icons/fi';

export const QualityProcess: React.FC<{ locale: Locale }> = ({ locale }) => {
  const t = translations[locale].quality;

  return (
    <section id="quality" className="section-padding bg-white scroll-mt-24">
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">{t.title}</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mb-4 rounded-full" />
          <p className="text-lg text-slate-500">{t.subtitle}</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {t.points.map((p) => (
            <div key={p.t} className="flex gap-4 rounded-2xl border border-slate-100 p-6">
              <FiCheckCircle className="text-emerald-500 flex-shrink-0 mt-1" size={20} />
              <div>
                <h3 className="font-bold text-slate-900 mb-1">{p.t}</h3>
                <p className="text-sm text-slate-500">{p.d}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
